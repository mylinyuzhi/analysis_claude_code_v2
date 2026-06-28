# `/rewind` resuming from before `/clear` (v2.1.183 → v2.1.193)

> **Type / version:** NET-NEW capability (woven), changelog **2.1.191** — "`/rewind` can now resume a conversation from before a `/clear`".
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION 2.1.193, build a1938d2a). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged *(183)*.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).

---

## TL;DR

In v2.1.183, `/clear` minted a fresh `sessionId` and preserved the prior conversation under `parentSessionId`, and `/rewind` could only land a rewind anchor on a message that had a **preceding assistant turn**. Those two facts meant a rewind could never reach back across the clear boundary to the *first* user message of the prior conversation. v2.1.193 adds the two missing pieces:

1. a **`rewound` transcript marker** persisted into the `last-prompt` entry by `rewindAnchorWriter` (`hYt`) and its mirror `rewindAnchorMirror` (`MUo`), which the transcript reader `readTranscriptChain` (`tde`) follows across the parent-session boundary while rewriting `parentUuid` links; and
2. a **first-message gate** `tengu_rewind_first_message` (`cli_inner_pretty.js:707201`) that, when enabled, lets the rewind anchor land on the **first user message even with no preceding assistant** — the prerequisite for crossing the `/clear` boundary back to the start of the prior conversation.

The user-visible *strings* (`MessageSelector` focus-region label, `Run /rewind to recover the conversation`, the `--rewind-files` CLI flag) are all **carryover**. The net-new proof points are concrete grep-count deltas: `rewound` **1 → 12**, `persistAnchor` **0 → 2**, `precedingAssistantUuid` **0 → 9**, `tengu_rewind_first_message` **0 → 1** (183 → 193). **Confidence: high** for each individual piece; **medium-high** that they compose into the exact changelog capability (it is woven through session/transcript persistence, not a single isolable function).

---

## 0. The before-picture: why a rewind could not cross `/clear` in 183

Two pre-existing mechanisms set the stage; neither changed in this window, so hold them precisely.

**`/clear` preserves the prior conversation under `parentSessionId`.** The reset routine `resetSessionForClear` (`Jdr`, `cli_inner_pretty.js:2575`) is **carryover** (same shape in 183). When called with `{ setCurrentAsParent: !0 }` it copies the current `sessionId` into `parentSessionId` *before* minting a new id:

```javascript
// ============================================
// resetSessionForClear - /clear reset; stash current session as parent, mint fresh id, emit "clear"
// Location: cli_inner_pretty.js:2575-2588  (CARRYOVER from 183)
// ============================================

// ORIGINAL (for source lookup):
function Jdr(e = {}) {
  if (e.setCurrentAsParent) Nt.parentSessionId = Nt.sessionId;
  (Nt.planSlugCache.delete(Nt.sessionId),
    (Nt.sessionId = Vfe.randomUUID()),
    (Nt.sessionProjectDir = null),
    (Nt.promptIndex = 0),
    (Nt.lastCancelledAPIMessageId = null));
  let t = zKo();
  return (qKo(Nt.sessionId, "clear", t), Nt.sessionId);
}

// READABLE (for understanding):
function resetSessionForClear(opts = {}) {
  if (opts.setCurrentAsParent) sessionState.parentSessionId = sessionState.sessionId; // <-- prior convo kept here
  sessionState.planSlugCache.delete(sessionState.sessionId);
  sessionState.sessionId = randomUUID();          // fresh conversation id
  sessionState.sessionProjectDir = null;
  sessionState.promptIndex = 0;
  sessionState.lastCancelledAPIMessageId = null;
  let info = snapshotSessionInfo();
  emitSessionEvent(sessionState.sessionId, "clear", info);  // qKo
  return sessionState.sessionId;
}

// Mapping: Jdr→resetSessionForClear, Nt→sessionState, Vfe.randomUUID→randomUUID, qKo→emitSessionEvent
```

The interactive `/clear` generator yields `{ type: "conversation_reset", newConversationId }` (`cli_inner_pretty.js:485413`) then calls `Jdr({ setCurrentAsParent: !0 })` (`:485414`). So after `/clear` the *old* conversation is not discarded — it is reachable via `parentSessionId`. The data was always there; what was missing was a way to *walk into it* from a rewind.

**`/rewind` required a preceding assistant.** The rewind anchor selection used only a "preceding assistant uuid". With no preceding assistant (e.g. the very first user message of a conversation, or the start of the parent conversation across the clear boundary), the rewind errored out with "no preceding assistant". The resolver that produces *both* a first-message anchor and the preceding-assistant anchor — `resolveRewindAnchors` (`XRc`) — **did not exist in 183**: `grep -c persistAnchor` and `grep -c precedingAssistantUuid` over the 183 bundle both return **0**.

**Carryover seeds (NOT the delta).** Three rewind-adjacent strings look like the feature but are byte-identical carryover:
- `MessageSelector: "When the message selector (rewind) is open"` (`cli_inner_pretty.js:178765`) — a FocusRegion *label* only; present in 183.
- `Run /rewind to recover the conversation.` — shown on tool-concurrency/duplicate-tool-use errors; **183 grep-count = 2 (identical)**.
- `--rewind-files <uuid>` (`cli_inner_pretty.js:193227`) — the file-checkpoint CLI flag, whose handler `rewindFiles` (`:564401`/`:705210`) prints `Files rewound to state at message <id>`. **183 grep-count for `--rewind-files` = 5.** This is the lone `rewound` occurrence in 183 — a *file* rewind, unrelated to the *conversation* rewind added here.

---

## 1. The `rewound` transcript marker (`hYt` / `MUo`)

**What it does.** Records, in the durable transcript, that a particular leaf was reached by an explicit `/rewind` (as opposed to a normal turn). The marker is a single boolean field `rewound: true` spliced into the `last-prompt` entry that already tracks the current session leaf.

**How it works.** `rewindAnchorWriter` updates the in-memory leaf pointer/timestamp and appends a `last-prompt` entry; the `rewound` flag is added **only when** the caller passes `{ rewound: true }` (spread-conditional, so a normal anchor write carries no `rewound` key):

```javascript
// ============================================
// rewindAnchorWriter - persist a /rewind anchor into the transcript with the rewound marker
// Location: cli_inner_pretty.js:582712-582724
// ============================================

// ORIGINAL (for source lookup):
async function hYt(e, t) {
  let n = zc();
  ((n.currentSessionLeafUuid = e ?? void 0),
    (n.currentSessionLeafTs = new Date().toISOString()),
    await n.appendEntry({
      type: "last-prompt",
      ...(n.currentSessionLastPrompt && { lastPrompt: n.currentSessionLastPrompt }),
      leafUuid: e,
      explicit: !0,
      ...(t?.rewound && { rewound: !0 }),
      sessionId: xt(),
    }));
}

// READABLE (for understanding):
async function rewindAnchorWriter(leafUuid, opts) {
  let store = getTranscriptStore();                       // zc
  store.currentSessionLeafUuid = leafUuid ?? undefined;
  store.currentSessionLeafTs = new Date().toISOString();
  await store.appendEntry({
    type: "last-prompt",
    ...(store.currentSessionLastPrompt && { lastPrompt: store.currentSessionLastPrompt }),
    leafUuid,
    explicit: true,
    ...(opts?.rewound && { rewound: true }),              // <-- NET-NEW: only present on a /rewind
    sessionId: getSessionId(),                            // xt
  });
}

// Mapping: hYt→rewindAnchorWriter, zc→getTranscriptStore, xt→getSessionId, e→leafUuid, t→opts
```

`rewindAnchorMirror` (`MUo`, `cli_inner_pretty.js:582725`) is the byte-equivalent variant that writes through `mirrorInternalEntry` instead of `appendEntry` — the remote/SDK transcript mirror gets the same `{ ...rewound:!0 }` field so a mirrored transcript stays consistent with the local one.

**Why a marker on `last-prompt` rather than a new entry type.** The `last-prompt` entry already exists for *every* prompt to track the session's current leaf (it is the resume anchor). Reusing it means the rewind is recorded with one optional boolean on a write that *had to happen anyway* (the leaf pointer must move when you rewind), with zero new entry types for old readers to choke on. An older reader that does not understand `rewound` simply ignores the extra key and treats the entry as an ordinary explicit leaf — graceful degradation.

**Key insight.** `explicit: !0` was already there (it marks a user-initiated leaf move); `rewound: !0` is the *strictly stronger* signal that distinguishes "user typed a new prompt here" from "user rewound to here". The reader (§3) needs that distinction to decide whether to follow the chain across the clear boundary.

---

## 2. The anchor resolver `resolveRewindAnchors` (`XRc`) + the first-message gate

**What it does.** Given the message list and a target index, computes two candidate anchors by walking **backward**: `persistAnchor` (the closest user-or-assistant uuid, which lands on the **first user message** when no assistant precedes it) and `precedingAssistantUuid` (the closest assistant uuid, `null` if none).

```javascript
// ============================================
// resolveRewindAnchors - backward walk to find the first-message anchor and the preceding-assistant anchor
// Location: cli_inner_pretty.js:705599-705612   (183: absent — persistAnchor grep=0)
// ============================================

// ORIGINAL (for source lookup):
function XRc(e, t) {
  let n = null, r = null;
  for (let o = t - 1; o >= 0; o--) {
    let s = e[o];
    if (!s) continue;
    if (s.type === "assistant") { ((r = s.uuid), (n ??= s.uuid)); break; }
    if (s.type === "user" && n === null) n = s.uuid;
  }
  return { persistAnchor: n, precedingAssistantUuid: r };
}

// READABLE (for understanding):
function resolveRewindAnchors(messages, targetIndex) {
  let persistAnchor = null, precedingAssistantUuid = null;
  for (let i = targetIndex - 1; i >= 0; i--) {
    let m = messages[i];
    if (!m) continue;
    if (m.type === "assistant") {
      precedingAssistantUuid = m.uuid;
      persistAnchor ??= m.uuid;     // if no earlier user set it, fall back to this assistant
      break;
    }
    if (m.type === "user" && persistAnchor === null) persistAnchor = m.uuid; // first user message wins
  }
  return { persistAnchor, precedingAssistantUuid };
}

// Mapping: XRc→resolveRewindAnchors, e→messages, t→targetIndex, n→persistAnchor, r→precedingAssistantUuid
```

**How the gate picks between them.** In the rewind-conversation handler, the flag `tengu_rewind_first_message` chooses which anchor is used and whether the "no preceding assistant" error fires:

```javascript
// ============================================
// rewind-conversation handler - gate selects first-message vs preceding-assistant anchor
// Location: cli_inner_pretty.js:707200-707234
// ============================================

// ORIGINAL (for source lookup):
let { persistAnchor: go, precedingAssistantUuid: rs } = XRc(F, Fn),
  ra = it("tengu_rewind_first_message", !1),
  ka = ra ? go : rs;
if (rs === null && !ra)
  In(Ht, { rewound: !1, prefillText: null, precedingAssistantUuid: null, error: "no preceding assistant" });
else {
  let xs = !0;
  try { (await MUo(ka, { rewound: !0 }), await e.flushInternalEvents(), await hYt(ka, { rewound: !0 })); }
  catch (pc) { ((xs = !1), ke(pc)); }
  if (!xs) In(Ht, { rewound: !1, /*...*/ error: "failed to persist rewind anchor" });
  else if (F[Fn]?.uuid !== Gr?.uuid) In(Ht, { rewound: !1, /*...*/ error: "state changed" });
  else (F.splice(Fn), (Rt = F.length),
    In(Ht, { rewound: !0, targetMessageUuid: Gr?.uuid ?? Ln, prefillText: Fo, precedingAssistantUuid: rs }));
}

// READABLE (for understanding):
let { persistAnchor, precedingAssistantUuid } = resolveRewindAnchors(messages, targetIndex);
let firstMessageEnabled = getConfigFlag("tengu_rewind_first_message", false);   // it(...)
let anchor = firstMessageEnabled ? persistAnchor : precedingAssistantUuid;      // <-- gate
if (precedingAssistantUuid === null && !firstMessageEnabled)
  respond({ rewound: false, error: "no preceding assistant" });                 // legacy guard, only when flag OFF
else {
  let ok = true;
  try {
    await rewindAnchorMirror(anchor, { rewound: true });   // MUo — mirror first
    await flushInternalEvents();
    await rewindAnchorWriter(anchor, { rewound: true });   // hYt — then local
  } catch (err) { ok = false; logError(err); }
  if (!ok) respond({ rewound: false, error: "failed to persist rewind anchor" });
  else if (messages[targetIndex]?.uuid !== target?.uuid) respond({ rewound: false, error: "state changed" });
  else {                                                    // commit the rewind
    messages.splice(targetIndex);                           // truncate to the anchor
    respond({ rewound: true, targetMessageUuid: target?.uuid ?? leaf, prefillText, precedingAssistantUuid });
  }
}

// Mapping: XRc→resolveRewindAnchors, it→getConfigFlag, go→persistAnchor, rs→precedingAssistantUuid,
//          ra→firstMessageEnabled, ka→anchor, MUo→rewindAnchorMirror, hYt→rewindAnchorWriter, F→messages, Fn→targetIndex
```

**Why a gate, and why this exact branch.** The legacy guard `if (rs === null && !ra)` is the literal before-picture: with the flag **off**, a rewind that has no preceding assistant still errors out exactly as in 183 — the new capability is dark-launched behind `tengu_rewind_first_message` so it can be rolled out without changing default behavior. With the flag **on**, `anchor = persistAnchor` (the first user message), and the `rs === null` case proceeds instead of erroring — so you can rewind to the very first message, which is what reaching back to the *start of the prior conversation* (before `/clear`) requires. The mirror-then-local write order (`MUo` then `flushInternalEvents` then `hYt`) ensures the remote transcript records the rewind before the local commit, so a crash between the two cannot leave a local rewind that the mirror never saw.

**Key insight.** `persistAnchor ??= s.uuid` is the whole trick: the resolver *prefers* a user-message anchor and only falls back to the assistant. The first-message capability is "use `persistAnchor` instead of `precedingAssistantUuid`" — one ternary (`ka = ra ? go : rs`) gated by one flag. There is no separate "cross-clear" code path; crossing the clear boundary is an emergent consequence of (a) being allowed to anchor on the first message and (b) the reader following the `rewound` chain (§3).

---

## 3. The reader follows the `rewound` chain across the boundary (`tde`)

**What it does.** `readTranscriptChain` (`tde`, `cli_inner_pretty.js:584448`) reconstructs the live message list from the on-disk transcript, tracking explicit/rewound leaves and **rewriting `parentUuid`** so the chain stays linked across session boundaries.

```javascript
// ============================================
// readTranscriptChain (excerpt) - track the rewound/explicit/leaf chain, rewrite parentUuid
// Location: cli_inner_pretty.js:584448 (fn), 584491-584494 (the rewound chain track)
// ============================================

// ORIGINAL (for source lookup):
else if (G.type === "last-prompt") {
  if (G.leafUuid)
    ((O = G.explicit === !0 || (O && G.leafUuid === P)),
      (M = G.rewound === !0 || (M && G.leafUuid === P)),
      (P = G.leafUuid));
  else if (G.leafUuid === null && G.explicit === !0) ((D = !0), (P = void 0), (O = !1), (M = !1));
}
// ...later, while walking entries:
// if (G.parentUuid && U.has(G.parentUuid)) G.parentUuid = U.get(G.parentUuid) ?? null;   (@584487)

// READABLE (for understanding):
else if (entry.type === "last-prompt") {
  if (entry.leafUuid) {
    explicitChain = entry.explicit === true || (explicitChain && entry.leafUuid === prevLeaf);
    rewoundChain  = entry.rewound  === true || (rewoundChain  && entry.leafUuid === prevLeaf);  // <-- follows rewound
    prevLeaf = entry.leafUuid;
  } else if (entry.leafUuid === null && entry.explicit === true) {
    reset = true; prevLeaf = undefined; explicitChain = false; rewoundChain = false;
  }
}
// parentUuid remap keeps the chain connected even when a leaf points across the /clear boundary:
//   if (entry.parentUuid && remap.has(entry.parentUuid)) entry.parentUuid = remap.get(entry.parentUuid) ?? null;

// Mapping: tde→readTranscriptChain, G→entry, P→prevLeaf, O→explicitChain, M→rewoundChain, D→reset, U→parentUuidRemap
```

**Why track `rewound` separately from `explicit`.** The reader maintains two parallel chain-bits: `explicitChain` (user moved the leaf) and `rewoundChain` (user *rewound*). Both are computed as "this entry sets it, OR it was already set and this leaf continues the chain (`leafUuid === prevLeaf`)". The `rewound` bit is what tells the reader a leaf chain was produced by a `/rewind` and therefore may legitimately point *back* into a parent session — letting the `parentUuid` remap stitch the prior (pre-`/clear`) conversation onto the current one rather than treating the cross-session pointer as a dangling reference.

**Key insight.** This is why the marker had to be *persisted* (§1) rather than kept in memory: the reader runs at load/resume time over the on-disk transcript, long after the rewind happened. The `rewound` field is the durable breadcrumb that survives `/clear` (which only swaps the in-memory `sessionId`) and a full process restart.

---

## 4. End-to-end: rewinding to before `/clear`

1. User has conversation **A**, then `/clear` → `resetSessionForClear({setCurrentAsParent:!0})` stashes A's id into `parentSessionId`, mints conversation **B** (`cli_inner_pretty.js:485414`).
2. User opens the message selector and rewinds toward the start. The handler (`:707200`) calls `resolveRewindAnchors` → with `tengu_rewind_first_message` enabled, `anchor = persistAnchor` (A's first user message), and the `rs === null` "no preceding assistant" guard is **skipped** (`:707203`).
3. `rewindAnchorMirror` + `rewindAnchorWriter` persist a `last-prompt` entry with `rewound: !0` pointing at that anchor (`:707213`), then the message list is truncated (`F.splice(Fn)`).
4. On the next load/resume, `readTranscriptChain` sees the `rewound` chain (`:584494`) and remaps `parentUuid` so conversation A (the pre-`/clear` history) is reconstructed under the live conversation — the rewind has reached back across the clear boundary.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Token | 183 | 193 | Verdict |
|-------|-----|-----|---------|
| `rewound` | 1 | 12 | NET-NEW conversation marker (183's lone hit is the `--rewind-files` file-rewind string) |
| `persistAnchor` | 0 | 2 | NET-NEW (`XRc` resolver) |
| `precedingAssistantUuid` | 0 | 9 | NET-NEW |
| `tengu_rewind_first_message` | 0 | 1 | NET-NEW gate |
| `type:"last-prompt"` write-sites | 2 | 3 | NET-NEW write (582334 carryover + 582717/582728 the rewind writers) |
| `MessageSelector` label / `Run /rewind to recover` / `--rewind-files` | present | present | CARRYOVER (strings only) |
| `resetSessionForClear` (`Jdr`) | present | present | CARRYOVER (`/clear` parent-session stash predates this window) |

All 193 lines re-read in the live bundle for this doc. Drift fixed vs the scout dossier: the mirror writer `MUo` is at **582725** (dossier said 582727); the `/clear` `conversation_reset` yield is at **485413**/Jdr-call **485414** (dossier said 485411).

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md), [plugin_auto_rename.md](./plugin_auto_rename.md), [hook_matcher_comma_fix.md](./hook_matcher_comma_fix.md), [cli_input_and_review_misc.md](./cli_input_and_review_misc.md).
- The `/clear` reset + `conversation_reset` surfacing is unchanged carryover; for the broader session/transcript model see the v2.1.183 background/agents and compact trees ([../36_background_agents/README.md](../36_background_agents/README.md), [../07_compact/](../07_compact/)).

---

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (session/transcript state)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (config-flag reader)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (**Slash Commands** — `/rewind`, `/clear`)
> - per-feature additions: [symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md)

Key functions/constants in this document:

- `rewindAnchorWriter` (obf `hYt`, `cli_inner_pretty.js:582712`) — appends `last-prompt` with `rewound:!0`.
- `rewindAnchorMirror` (obf `MUo`, `cli_inner_pretty.js:582725`) — remote/SDK mirror variant.
- `readTranscriptChain` (obf `tde`, `cli_inner_pretty.js:584448`) — follows the `rewound`/`explicit` chain, rewrites `parentUuid` (`:584494`).
- `resolveRewindAnchors` (obf `XRc`, `cli_inner_pretty.js:705599`) — backward walk → `{persistAnchor, precedingAssistantUuid}`; absent in 183.
- `resetSessionForClear` (obf `Jdr`, `cli_inner_pretty.js:2575`) — `/clear` reset; stashes `parentSessionId` (CARRYOVER).
- `tengu_rewind_first_message` (flag, `cli_inner_pretty.js:707201`) — first-message rewind gate, read via `getConfigFlag` (obf `it`).
- rewind-conversation handler (`cli_inner_pretty.js:707200-707234`) — `ka = ra ? go : rs`; `MUo`/`hYt(ka,{rewound:!0})` at `:707213`.
