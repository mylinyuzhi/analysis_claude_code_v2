# Scout Dossier — /rewind before /clear, CLI/bash mode, plugins, hooks, streaming-perf (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION 2.1.193, build a1938d2a, 2026-06-25)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**Method:** every claim cites a 193 line anchor + the exact obfuscated token; classified net-new / body-change / carryover by grep-count diff vs 183. Symbols re-mangle each build — all 193 obf names re-derived by line.

> **Version-attribution correction (important):** the real `claude_code_v_2.1.193/CHANGELOG.md` puts these bullets at: `/btw ←/→` and `/plugin recently-used sweep` at **2.1.187**; `/plugin "more above"` fix, `MAX_RETRIES` cap, `/review medium` at **2.1.186**; stall-hint reword + 20s at **2.1.185**; `/rewind` before `/clear`, hooks comma fix, streaming coalesce, terminal-cache memory at **2.1.191**; `renames` follow + `/add-dir` message at **2.1.193**. Several task-prompt version tags (e.g. some [2.1.191] / [2.1.187] tags) were off-by; anchors below use the real changelog dating.

---

## Verdict summary

| # | Bullet | Verdict | 193 anchor | obf symbol → readable |
|---|--------|---------|-----------|------------------------|
| 1 | /rewind before /clear (191) | **NEW (woven)** — net-new `rewound` persistence + gate | 582721, 707201 | `hYt`/`MUo` rewind-anchor writers; `tengu_rewind_first_message` gate |
| 2 | /add-dir already-working message (193) | **BODY CHANGE / refinement** | 177994 | `jot` add-dir result formatter; `isExactMatch`/`isOriginalCwd` |
| 3 | plugin auto-rename `renames` follow (193) | **NET-NEW** | 55667, 478428, 478442, 479511 | `renames` schema; `s_t` resolver; `NHl` settings migrator; loader follow |
| 4a | /plugin recently-used sweep (187) | **CARRYOVER** (identical in 183) | 195011 | `G1t` staleness (`daysSinceLastUse`) — not a window code-delta |
| 4b | /plugin "more above" fix (186) | **CARRYOVER / UI-only** (9 in both) | 517886 | `tKt` windowed-list `moreAbove` |
| 5 | hooks comma-separated matchers fix (191) | **BODY CHANGE / FIX** | 589634 | `s3f` matcher (was `qyf` in 183); split `/[|,]/` |
| 6 | streaming CPU −37% coalesce 100ms (191) | **BODY CHANGE** (16ms→100ms) | 619041, 619006 | `Zrc` factory / `Qrc` coalescer; default `flushIntervalMs` 16→100 |
| 7 | stream-stall hint reword + 20s (185) | **BODY CHANGE** (text + 10s→20s) | 366217, 596507 | stall UI; `q2o = 20000` (was `u0o = 1e4`) |
| 8 | /btw ←/→ arrow navigation (187) | **NET-NEW** (the left/right nav) | 482762 | btw key handler `key === "left" ? -1 : 1` |
| 9 | /review uses code-review medium (186) | **BODY CHANGE / NEW** | 538536 | `oRf` review command; `effort: "medium"` + `rRf` gh-pr prompt |
| 10 | MAX_RETRIES cap 15 + RETRY_WATCHDOG (186) | **BODY CHANGE / upgrade-gotcha** | 603209, 603244 | `O5f` clamp to `Ujo = 15`; `jHe` = RETRY_WATCHDOG |

---

## 1. /rewind support for resuming a conversation from before /clear (2.1.191) — NEW (woven)

### Seeds (all CARRYOVER — not the delta)
- `MessageSelector: "When the message selector (rewind) is open"` @178765 — a FocusRegion *label* only; present in 183. Carryover.
- `Run /rewind to recover the conversation.` @237612, @237620 — shown on 400 tool-concurrency / duplicate-tool-use errors via `Tr() ? "" : ...`. **183 grep-count = 2 (identical).** Carryover, NOT a 193 delta.
- `--rewind-files` @193227 — CLI flag in the print-mode allow-set. **183 grep-count = 5.** Carryover. The `--rewind-files <uuid>` handler (`l.rewindFiles`) @705349 calls `eLc(...)` and prints `Files rewound to state at message <id>` @705366 — carryover (the lone `rewound` in 183 is this exact string @686617).

### The actual net-new before-/clear machinery
**/clear path** — `Jdr({ setCurrentAsParent: !0 })` @2575 sets `Nt.parentSessionId = Nt.sessionId`, mints a fresh `sessionId`, emits `"clear"`. The interactive /clear generator yields `{ type: "conversation_reset", newConversationId }` then calls `Jdr({setCurrentAsParent:!0})` @485411. So the pre-clear conversation is preserved under `parentSessionId` rather than discarded.

**Net-new persistence flag — the `rewound` marker.** 193 records a rewind into the transcript by writing a `last-prompt` entry carrying `rewound: !0`:
- `hYt(leafUuid, {rewound})` @582712 — appends `{ type:"last-prompt", leafUuid, explicit:!0, ...(rewound && {rewound:!0}), sessionId }`.
- `MUo(leafUuid, {rewound})` @582727 — mirror-internal variant (remote/SDK mirror).
- Transcript reader `tde` @584448 consumes it: `M = G.rewound === !0 || (M && G.leafUuid === P)` @584494, tracking the rewound/explicit/leaf chain while it rewrites `parentUuid` across the `U` map (@584486) — i.e. the reader can follow the leaf chain across the clear boundary into the parent session.
- **183 grep-count of `rewound` = 1** (only the `--rewind-files` CLI string). The conversation-level `rewound` persistence (`hYt`/`MUo`/reader) is **net-new**.
- `type: "last-prompt"` write-sites: **183 = 2 → 193 = 3** (@582334, @582717, @582728).

**Net-new gate — `tengu_rewind_first_message`** @707201: `ra = it("tengu_rewind_first_message", !1)`. In the rewind-conversation handler, the anchor selection becomes `ka = ra ? persistAnchor : precedingAssistantUuid`, letting a rewind land on the **first** user message even with no preceding assistant — the prerequisite for crossing the clear boundary back to the start of the prior conversation. **183 grep-count = 0.** Net-new.
- Anchor resolver `XRc(messages, idx)` @705599 walks backward to compute `{ persistAnchor, precedingAssistantUuid }`.

**Verdict:** genuinely NEW capability landing in this window. It is *not* a single isolable function — it is woven through the session/transcript persistence — but the net-new proof points are concrete: the `rewound` conversation flag (`hYt`/`MUo`/reader, 1→8+ occurrences) and the `tengu_rewind_first_message` gate (0→1). The user-visible *strings* are all carryover. **Confidence: medium-high.**

```javascript
// ============================================
// rewindAnchorWriter (hYt) - persists a /rewind into the transcript with the rewound marker
// Location: cli_inner_pretty.js:582712-582724
// ============================================

// ORIGINAL (for source lookup):
async function hYt(e, t) {
  let n = zc();
  ((n.currentSessionLeafUuid = e ?? void 0), (n.currentSessionLeafTs = new Date().toISOString()),
    await n.appendEntry({ type: "last-prompt", ...(n.currentSessionLastPrompt && { lastPrompt: n.currentSessionLastPrompt }),
      leafUuid: e, explicit: !0, ...(t?.rewound && { rewound: !0 }), sessionId: xt() }));
}

// READABLE (for understanding):
async function rewindAnchorWriter(leafUuid, opts) {
  let store = getTranscriptStore();
  store.currentSessionLeafUuid = leafUuid ?? undefined;
  store.currentSessionLeafTs = new Date().toISOString();
  await store.appendEntry({
    type: "last-prompt",
    ...(store.currentSessionLastPrompt && { lastPrompt: store.currentSessionLastPrompt }),
    leafUuid,
    explicit: true,
    ...(opts?.rewound && { rewound: true }),   // <-- net-new in window; reader follows this across /clear
    sessionId: getSessionId(),
  });
}

// Mapping: hYt→rewindAnchorWriter, zc→getTranscriptStore, xt→getSessionId, e→leafUuid, t→opts
```

---

## 2. /add-dir message when dir is already a working directory (2.1.193) — BODY CHANGE

`jot(result)` @177994 formats the add-dir resolver result. The `alreadyInWorkingDirectory` branch was reworked from one generic line into three tailored messages, driven by **net-new** flags `isExactMatch` and `isOriginalCwd` (set @177990 `isOriginalCwd: s === o`):
- exact + original cwd → `"… is already the current working directory."` @178007
- exact + added dir → `"… is already added as a working directory."` @178008
- substring → `"… is already accessible within {the current|the additional working directory} …"` @178010

**183:** the formatter (`VZe` @176903) had a single message: `"… is already accessible within the existing working directory …"` @176914; **`isExactMatch` grep-count = 0 in 183.** Net-new flags → body change. **Confidence: high.**

---

## 3. Plugin auto-rename: marketplace `renames` followed automatically (2.1.193) — NET-NEW

**Schema** @55667: `renames: A.record(A.string(), A.string().nullable()).optional().catch(void 0)` — "Append-only map of old plugin name → current name (or null when removed). The loader follows this on plugin-not-found and migrates user settings to the new name." **183: schema string grep-count = 0.**

**Chain resolver `s_t(name, renames, presentNames)`** @478428 = `resolvePluginRename`. Walks the rename map up to `Gdf = 16` hops (@478477), returning `{kind:"renamed",to,chainDepth}` / `{kind:"removed"}` / `{kind:"unresolved", reason: "cycle"|"target-missing"|"chain-too-deep"}`. Cycle-safe via a visited set.

**Loader follow** inside `p0o({cacheOnly, preview})` @479511: on a not-found plugin whose marketplace manifest has `renames`, it calls `s_t(...)`, validates the target id against `jBe()` (the `plugin@marketplace` regex @55676), and rewrites `oldId → newId` (`${R.to}@${C}`). Falls through to plugin-not-found with a warning when unresolved/invalid (@479519, @479534).

**Settings migrator `NHl(renamePairs)`** @478442 = `migrateRenamedPluginsInSettings`: for each editable scope it rewrites `enabledPlugins` and `pluginConfigs` keys from `oldId → newId` (drops removed), persists via `co(...)`, and reports `plugin_rename_migration` success/partial/failed. This is the "updating your settings to the new name" half.

**Telemetry `k0n`** @195349 emits `tengu_plugin_renamed` `{outcome, chain_depth, reason}`.

**Marketplace-schema validation** @521492 / chain-resolve check @612539 (`t.renames && s_t(...)?.kind === "renamed"`) — both reference `renames`.

**183 diff:** every `renames`-feature string is absent in 183 — `"Append-only map of old plugin name"` / `"plugin-renamed"` / `"follows this on plugin-not-found"` grep-count **= 0**. (183's 14 `renames` hits are all unrelated: git `--no-renames`/`--find-renames` and the highlight.js Ada keyword list.) **NET-NEW. Confidence: high.**

```javascript
// ============================================
// resolvePluginRename (s_t) - follows the marketplace renames map, cycle-safe, capped at 16 hops
// Location: cli_inner_pretty.js:478428-478440  (Gdf=16 @478477)
// ============================================

// ORIGINAL (for source lookup):
function s_t(e, t, n) {
  if (!Object.hasOwn(t, e)) return null;
  let r = new Set(), o = e;
  for (let s = 0; s < Gdf; s++) {
    if (r.has(o)) return { kind: "unresolved", reason: "cycle" };
    r.add(o);
    let i = Object.hasOwn(t, o) ? t[o] : void 0;
    if (i === void 0) return n.has(o) ? { kind: "renamed", to: o, chainDepth: s } : { kind: "unresolved", reason: "target-missing" };
    if (i === null) return { kind: "removed", chainDepth: s + 1 };
    o = i;
  }
  return { kind: "unresolved", reason: "chain-too-deep" };
}

// READABLE (for understanding):
function resolvePluginRename(oldName, renamesMap, presentPluginNames) {
  if (!Object.hasOwn(renamesMap, oldName)) return null;
  let visited = new Set(), cur = oldName;
  for (let depth = 0; depth < MAX_RENAME_CHAIN /*16*/; depth++) {
    if (visited.has(cur)) return { kind: "unresolved", reason: "cycle" };
    visited.add(cur);
    let next = Object.hasOwn(renamesMap, cur) ? renamesMap[cur] : undefined;
    if (next === undefined)
      return presentPluginNames.has(cur) ? { kind: "renamed", to: cur, chainDepth: depth } : { kind: "unresolved", reason: "target-missing" };
    if (next === null) return { kind: "removed", chainDepth: depth + 1 };
    cur = next;
  }
  return { kind: "unresolved", reason: "chain-too-deep" };
}

// Mapping: s_t→resolvePluginRename, Gdf→MAX_RENAME_CHAIN(16), e→oldName, t→renamesMap, n→presentPluginNames
```

---

## 4. /plugin housekeeping bullets

### 4a. /plugin surfaces plugins you haven't used recently (2.1.187) — CARRYOVER
The plugin-usage/staleness machinery is **byte-identical between 183 and 193** (token grep-counts equal): `pluginUsage` 12/12, `daysSinceLastUse` 8/8, `sessionsSinceLastUse` 4/4, `lastUsedNumStartups` 4/4.
- `ij(name)` @195346 = `recordPluginUse` (count++/`lastUsedAt`, batched flush `oGi` @195356 every `DNd = 60000` ms).
- `G1t(usage, numStartups, now)` @195011 = `getPluginStaleness` → `{ sessionsSinceLastUse, daysSinceLastUse }`.

This is the data layer that "surfaces recently-unused plugins". Because it is identical in 183, the **code is carryover, NOT a 193-window code-delta** — the 2.1.187 user-facing change was a UI surfacing/gate flip on top of pre-existing tracking, not isolable as new source here. **Confidence: high (carryover).**

### 4b. /plugin Installed "more above" indicator fix (2.1.186) — CARRYOVER / UI-only
`"more above"` grep-count = **9 in both** 183 and 193. The shared windowed-list helper `tKt(...)` returns `moreAbove: windowStart` @517886 and the list only renders the chevron when `d.moreAbove > 0` @517998 (so it is suppressed at top, windowStart 0). Same component in both bundles — not isolable as a 193 code-delta. **Confidence: medium (carryover/UI-only).**

---

## 5. Hooks with comma-separated matchers ("Bash,PowerShell") silently never firing — FIXED (2.1.191) — BODY CHANGE/FIX

Matcher test `s3f(query, matcher, allowComma, aliases)` @589634. The `allowComma` flag (`n`) comes from `o3f.has(hook_event_name)` @589831 — `o3f` @591335 is the set of all hook events (`PreToolUse`, `PostToolUse`, `PermissionRequest`, … `InstructionsLoaded`).
- When `allowComma`: regex `/^[a-zA-Z0-9_|, ]+$/` (commas + spaces allowed) and split on **`/[|,]/`** (both pipe and comma).
- Otherwise: legacy `/^[a-zA-Z0-9_|]+$/` and split on `"|"`.

**183:** `qyf(query, matcher, aliases)` @577890 had **no comma flag**: regex `/^[a-zA-Z0-9_|]+$/` and split only on `"|"`. A matcher `"Bash,PowerShell"` failed that regex (comma not allowed), fell through to `new RegExp("Bash,PowerShell")`, which never matches the tool name `"Bash"` → the hook silently never fired. `split(n ? /[|,]/ : "|")` grep-count: **183 = 0 → 193 = 1.** The fix also threads tool-alias resolution (`Kcn(KL(i), r)`). **Confidence: high.**

```javascript
// ============================================
// hookMatcherMatches (s3f) - comma-aware; FIX for "Bash,PowerShell" never firing
// Location: cli_inner_pretty.js:589634-589651   (183: qyf @577890, pipe-only)
// ============================================

// ORIGINAL (for source lookup):
function s3f(e, t, n, r) {
  if (!t || t === "*") return !0;
  if ((n ? /^[a-zA-Z0-9_|, ]+$/ : /^[a-zA-Z0-9_|]+$/).test(t))
    return t.split(n ? /[|,]/ : "|").map((i) => i.trim()).filter(Boolean).flatMap((i) => Kcn(KL(i), r)).includes(e);
  try { let s = new RegExp(t); if (s.test(e)) return !0; for (let i of zcn(e)) if (s.test(i)) return !0; for (let i of Ycn(e, r)) if (s.test(i)) return !0; return !1; }
  catch { return (T(`Invalid regex pattern in hook matcher: ${t}`), !1); }
}

// READABLE (for understanding):
function hookMatcherMatches(toolName, matcher, allowComma, aliases) {
  if (!matcher || matcher === "*") return true;
  if ((allowComma ? /^[a-zA-Z0-9_|, ]+$/ : /^[a-zA-Z0-9_|]+$/).test(matcher))
    return matcher
      .split(allowComma ? /[|,]/ : "|")   // <-- FIX: also split on comma
      .map(s => s.trim()).filter(Boolean)
      .flatMap(s => resolveAliases(canonicalToolName(s), aliases))
      .includes(toolName);
  try { let re = new RegExp(matcher); /* regex fallback + alias/expanded forms */ }
  catch { log(`Invalid regex pattern in hook matcher: ${matcher}`); return false; }
}

// Mapping: s3f→hookMatcherMatches, e→toolName, t→matcher, n→allowComma, r→aliases, KL→canonicalToolName, Kcn→resolveAliases
```

---

## 6. Streaming CPU −37% by coalescing text updates to 100ms (2.1.191) — BODY CHANGE (16ms → 100ms)

The streaming text coalescer class `Qrc` @619006 buffers `pending` and schedules at most one `onFlush` per interval; the factory `Zrc({scheduleTimeout, onFlush, flushIntervalMs})` @619041 defaults **`flushIntervalMs = 100`**. Wiring: `bV` (onStreamingText) @688217 → `yb.apply(updater)`; `yb = useMemo(() => Zrc({ scheduleTimeout: $.setTimeout, onFlush: MU }))` @688214. Each `text_delta` (@601090, `fHo`) calls `onStreamingText(updater)` which only mutates `pending` and shares one scheduled flush → coalesced re-renders.

**183 diff:** the **same class exists** (`_jl` @605053) but the factory `bjl` @605086 defaulted **`flushIntervalMs = 16`** (one ~60fps frame). So the coalescer is carryover machinery; the **default interval changed 16 → 100ms** (≈6× fewer React/Ink re-renders during streaming → the ~37% CPU win). `flushIntervalMs: n = 100` grep-count: 183 = 0 (it's `= 16`) → 193 = 1. **Confidence: high.**

*Companion claim "reduced long-session memory growth from terminal output cache":* a separate mechanism, not isolated here — the transcript renderer (`Ukf` @534619) keeps a per-conversation `WeakMap` cache (`re.current` / `ce` @534655) that resets on conversation change; not provably a single window code-delta from grep. Flagged as not-isolated.

```javascript
// ============================================
// makeStreamTextCoalescer (Zrc) - default flush interval 100ms (was 16ms in 183)
// Location: cli_inner_pretty.js:619041   (183: bjl @605086 default = 16)
// ============================================

// ORIGINAL (for source lookup):
function Zrc({ scheduleTimeout: e, onFlush: t, flushIntervalMs: n = 100 }) {
  return new Qrc({ scheduleTimeout: e, onFlush: t, flushIntervalMs: n });
}

// READABLE (for understanding):
function makeStreamTextCoalescer({ scheduleTimeout, onFlush, flushIntervalMs = 100 /* was 16 */ }) {
  return new StreamTextCoalescer({ scheduleTimeout, onFlush, flushIntervalMs });
}

// Mapping: Zrc→makeStreamTextCoalescer, Qrc→StreamTextCoalescer, n=flushIntervalMs default 16→100
```

---

## 7. Stream-stall hint reword "Waiting for API response · will retry in …" after 20s (2.1.185) — BODY CHANGE (text + 10s → 20s)

**UI** @366217 (`n.kind === "stalled"`): renders `"Waiting for API response"` @366220 + `" · will retry in " + a + " · check your network"` @366234.
**Watchdog** (`xs` @594850, inside the SSE read loop): if no new chunk arrives within `q2o` ms, fires `s.onRetryStatus?.({ kind: "stalled", deadline: Date.now() + (Fn - q2o) })` @594858. Threshold **`q2o = 20000`** @596507.

**183 diff (both text and threshold changed):**
- 183 UI @354981: `"No response from API"` + `" · Retrying in " + a + " · check your network"`. `"Waiting for API response"` and `"will retry in"` grep-count in 183 = **0**.
- 183 threshold: the same watchdog @582956 used **`u0o = 1e4`** (10000 ms) @584496.

So the stall hint was reworded **and** its trigger doubled 10s → 20s. **Confidence: high.**

---

## 8. /btw ←/→ arrow navigation through earlier answers (2.1.187) — NET-NEW (the nav)

The `/btw` side-question UI (`xpf = /^\/btw\b/gi` @482363) renders the answer list with a selected index `S` (`dimColor: S !== J, bold: S === J` @482877) and an `(+M earlier /btw)` overflow indicator @482874. The key handler @482760 implements left/right stepping:

```javascript
let q = Math.max(0, J - tTl), K = _.current ?? J,
    X = Math.max(q, Math.min(J, K + (G.key === "left" ? -1 : 1)));   // ← left=-1, → right=+1
if (X === K) return;
((_.current = X === J ? null : X), H(_.current), v.current?.scrollTo(0));   // select earlier answer
```

**183 diff:** the `/btw` feature and the `(+M earlier /btw)` indicator exist in 183 (@474035, `ru.createElement`), but **there is no answer selection**: `key === "left" ? -1 : 1` grep-count = **0 in 183** (vs 1 in 193), and 183's render has no `dimColor: S !== J` selected-index branch. The ←/→ **navigation between earlier answers is net-new**; the /btw feature itself is carryover. **Confidence: high.**

---

## 9. /review <pr> now uses the same engine as /code-review medium (2.1.186) — BODY CHANGE / NEW

The builtin `review` command `oRf` @538536 was reworked:
- `effort: "medium"` (new field — pins it to the same effort tier as `/code-review medium`),
- `description: "Review a GitHub pull request; for your working diff use /code-review"` (was `"Review a pull request"`),
- `argumentHint: "[pr number]"` (new),
- a new prompt builder `rRf(pr, extra)` @538510 that fetches the PR with `gh pr view … --json …` + `gh pr diff <pr>` and runs the multi-phase review pipeline (`Hzn`), with a fallback hint `nRf` @538509 when no PR is given.

**183 diff:** the 183 command `Zrf` @527336 was `{ name:"review", description:"Review a pull request", … getPromptForCommand → Qrf(e) }` — **no `effort`, no `argumentHint`, no gh-pr prompt**. `effort: "medium"` grep on the review command = absent in 183. **Confidence: high.** (NEW capability: PR-scoped review wired into the code-review medium engine.)

---

## 10. CLAUDE_CODE_MAX_RETRIES capped at 15; CLAUDE_CODE_RETRY_WATCHDOG for unattended (2.1.186) — BODY CHANGE / upgrade-gotcha

`O5f()` @603209 reads `CLAUDE_CODE_MAX_RETRIES` and now **clamps to `Ujo = 15`** @603244 with a one-time warning `CLAUDE_CODE_MAX_RETRIES=<e> clamped to 15` @603214:

```javascript
if (e > Ujo) { if (!pZl) (pZl = !0, T(`CLAUDE_CODE_MAX_RETRIES=${e} clamped to ${Ujo}`, {level:"warn"})); return Ujo; }
return e;
```

**183 diff:** `vEf()` @591059 had **no cap** — `if (Number.isFinite(e) && e >= 0) return e;` (returns the user value verbatim). The clamp + `Ujo = 15` + warning are net-new in window. **Upgrade-behavior gotcha:** anyone who set `CLAUDE_CODE_MAX_RETRIES` above 15 for long unattended runs will silently get 15 after upgrade (with a warning) and is redirected to the watchdog.

`CLAUDE_CODE_RETRY_WATCHDOG` itself is **carryover** (env var present in both; `jHe()` @602804 = `at(process.env.CLAUDE_CODE_RETRY_WATCHDOG)`). It gates the "retry-after too long" abort: `else if (((x = AX(g, C)), !jHe() && x > T5f)) throw …` @603019 — with the watchdog on, arbitrarily long backoffs are tolerated (the intended replacement for a high MAX_RETRIES). **Confidence: high.**

---

## False-delta / carryover ledger (be adversarial)

| Item | Claim shape | Reality | Anchor |
|------|-------------|---------|--------|
| `idleStreamInterval: 20000` @34656 | looked like the 20s stall threshold | **FALSE LEAD** — GrowthBook SSE idle config; identical in 183 (@34467). Unrelated to the stall hint. | 34656 |
| Workflow-agent stall watchdog @423760 (`"stalled"` abort, `ce` timeout) | looked like the stream-stall hint | **DIFFERENT FEATURE** — no-progress watchdog for `agent()` workflow subagents, not the SSE stall UI | 423760 |
| `x.matcher.split("|")` @240472 | looked like the hooks comma fix | **DIFFERENT FEATURE** — `FileChanged` watch-path splitting, not the tool-name hook matcher | 240472 |
| "Run /rewind to recover the conversation" / `--rewind-files` | seeds for the rewind feature | **CARRYOVER** (183 counts 2 and 5) | 237612, 193227 |
| plugin `pluginUsage`/`daysSinceLastUse` | "/plugin recently-used" code | **CARRYOVER** — identical token counts 183↔193 | 195011 |
| "more above" indicator | "/plugin more above" code | **CARRYOVER** — 9 in both; shared windowed-list | 517886 |
| stream coalescer class | "100ms coalesce" new code | **CARRYOVER class**, only the **default 16→100** changed | 619006 |

---

## Proposed module docs

1. **`43_slash_commands/`** (extend or add):
   - `rewind_before_clear.md` — the `rewound` transcript marker (`hYt`/`MUo`), reader chain-follow across `parentSessionId`, `tengu_rewind_first_message` gate, `XRc` anchor resolver. (NEW surface.)
   - `btw_arrow_navigation.md` — `/btw` answer-list selection + ←/→ stepping (`key === "left" ? -1 : 1`).
   - `review_command_medium_engine.md` — `oRf` `effort:"medium"` + `rRf` gh-pr-diff prompt.
   - `add_dir_already_working_message.md` — `jot` + `isExactMatch`/`isOriginalCwd` three-message refinement.
2. **Plugin module (`*_plugins/` or extend marketplace doc):**
   - `plugin_auto_rename.md` — `renames` schema, `s_t` resolver (cycle/removed/chain-too-deep, `Gdf=16`), `NHl` settings migrator, loader follow in `p0o`, `k0n`/`tengu_plugin_renamed` telemetry. (NET-NEW; richest item.)
3. **Hooks module (extend):**
   - `hook_matcher_comma_fix.md` — `s3f` comma-aware split + `o3f` event set + alias threading (was `qyf` pipe-only).
4. **Streaming / UI perf (extend `00_overview` or a perf doc):**
   - `streaming_text_coalesce_100ms.md` — `Qrc`/`Zrc` (16→100ms) + the stall-hint reword/20s (`q2o`).
5. **Platform / retries (extend):**
   - `max_retries_cap_and_watchdog.md` — `O5f` clamp to 15 (`Ujo`), `jHe` RETRY_WATCHDOG, upgrade gotcha.

## Depth assessment

**Moderate.** Two items carry real source-level depth worth a full module doc: **plugin auto-rename** (multi-function net-new subsystem: schema + cycle-safe resolver + settings migrator + loader follow + telemetry — *rich*) and **/rewind before /clear** (woven net-new persistence flag + gate + reader chain-follow — *moderate*, harder to isolate but provable). The remaining items are precise, high-confidence single-symbol body changes (hook comma split, 16→100ms coalesce, 10s→20s stall + reword, MAX_RETRIES cap, /review effort, /btw nav, /add-dir message) — each a tidy before/after diff, *moderate* depth. Two task bullets resolve to **carryover** (plugin recently-used tracking, "more above") and should be documented as such to prevent false-delta inflation.
