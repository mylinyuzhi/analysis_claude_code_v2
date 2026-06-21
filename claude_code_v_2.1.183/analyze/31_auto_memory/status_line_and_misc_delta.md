# Auto Memory — `memory_saved` Status-Line Delta + Env Surface (v2.1.156 → v2.1.183)

> **Delta tree.** Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle
> (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless explicitly
> labelled as a **v2.1.156** before-picture (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`)
> or a **v2.1.88** named-source reference. Names follow the scout dossier anchor table.

## Scope of this document

This is the *small* delta doc for `31_auto_memory`. It covers exactly one user-visible behavior change plus a
short env-surface note:

1. **The 2.1.181 `memory_saved` status-line change** — the per-file clickable list under the
   "Saved/Improved N memories" summary is now rendered **only in verbose mode**. The v2.1.156 renderer
   always showed a `slice(0, 3)`-truncated file list plus an expandable **"+N more files"** count even
   outside verbose. (Confirmed delta 6 in the dossier.)
2. **Env-surface presence note** — `CLAUDE_CODE_REMOTE_MEMORY_DIR` and the
   `CLAUDE_COWORK_MEMORY_*` family are present in the v2.1.183 bundle. These belong to the team-store
   recall path (the headline 2.1.172 work) and are documented in depth in
   [team_memory_stores_recall.md](./team_memory_stores_recall.md); this doc only notes their presence
   and how they connect to the status line.

The **`memory_saved` message factory itself, the verb ("Saved"/"Improved"), and the
"N memories" / "N team memories" summary computation are unchanged carryover** — see the v2.1.156
write-up rather than re-deriving them:
[v2.1.156 extract_memories_runtime.md](../../../claude_code_v_2.1.156/analyze/31_auto_memory/extract_memories_runtime.md)
(the `createMemorySavedMessage` factory and the "Saved N memories plus a collapsible file list" contract)
and [v2.1.156 auto_dream_runtime.md](../../../claude_code_v_2.1.156/analyze/31_auto_memory/auto_dream_runtime.md)
(auto-dream reusing the same factory with `verb:"Improved"`).

---

## 1. The data contract is unchanged — only the renderer changed

Before getting to the renderer, it is worth pinning down what *did not* change, because that is what makes
this a pure presentation-layer delta.

### 1.1 `memory_saved` system message factory — carryover

The system message that drives the status line is produced by a tiny factory. In v2.1.183 it is `YGn`
(589751); the shape is byte-for-byte the same record the v2.1.156 factory produced.

```javascript
// ============================================
// createMemorySavedMessage - factory for the "memory_saved" system message that the status line renders
// Location: cli_inner_pretty.js:589751-589760
// ============================================

// ORIGINAL (for source lookup):
function YGn(e) {
  return {
    type: "system",
    subtype: "memory_saved",
    writtenPaths: e,
    timestamp: new Date().toISOString(),
    uuid: A$.randomUUID(),
    isMeta: !1,
  };
}

// READABLE (for understanding):
function createMemorySavedMessage(writtenPaths) {
  return {
    type: "system",
    subtype: "memory_saved",     // routed to the memory_saved renderer by SNa
    writtenPaths,                // the full list of paths the extractor/dream wrote
    timestamp: new Date().toISOString(),
    uuid: crypto.randomUUID(),
    isMeta: false,
  };
}

// Mapping: YGn->createMemorySavedMessage, e->writtenPaths, A$->crypto
```

The `verb` field ("Saved" for extraction, "Improved" for auto-dream) and the `teamCount` field are
patched onto this record by the caller — that mechanism is unchanged from v2.1.156 (see the baseline
`extract_memories_runtime.md` linked above). The point for this doc: the renderer still receives the
**full `writtenPaths` array**; the change is purely in how it chooses to display them.

### 1.2 The team-memory segment helper — carryover

The summary line's "N team memories" suffix comes from a helper that reads `teamCount` off the message.
In v2.1.183 it is `ANa` (382753); its logic is identical to the v2.1.156 `teamMemSavedPart`.

```javascript
// ============================================
// teamMemSavedPart - builds the "N team memories" summary segment from teamCount
// Location: cli_inner_pretty.js:382753-382757
// ============================================

// ORIGINAL (for source lookup):
function ANa(e) {
  let t = e.teamCount ?? 0;
  if (t === 0) return null;
  return { segment: `${t} team ${t === 1 ? "memory" : "memories"}`, count: t };
}

// READABLE (for understanding):
function teamMemSavedPart(message) {
  let teamCount = message.teamCount ?? 0;
  if (teamCount === 0) return null;                 // no team memories -> no segment
  return {
    segment: `${teamCount} team ${teamCount === 1 ? "memory" : "memories"}`,
    count: teamCount,                               // subtracted from writtenPaths for the local count
  };
}

// Mapping: ANa->teamMemSavedPart, e->message, t->teamCount
```

This is what lets the summary read e.g. `Saved 3 memories · 2 team memories`: the renderer subtracts
`count` (team memories) from `writtenPaths.length` to get the local-memory count, then joins both
segments with `·`. **This computation is identical in both builds** — confirm by comparing the renderer
bodies in §2.

---

## 2. The delta: per-file list is now verbose-only (2.1.181)

**Kind:** behavior-change (presentation only). **Confidence:** high.

### 2.1 v2.1.183 renderer — `Svp`

```javascript
// ============================================
// renderMemorySaved - "memory_saved" status-line renderer; file list verbose-only
// Location: cli_inner_pretty.js:383399-383440
// ============================================

// ORIGINAL (for source lookup):
function Svp(e) {
  let t = d0e.c(16),
    { message: n, addMargin: r, verbose: o } = e,
    { writtenPaths: s } = n,
    i;
  if (t[0] !== n) ((i = ANa(n)), (t[0] = n), (t[1] = i));
  else i = t[1];
  let a = i,
    l = s.length - (a?.count ?? 0),
    c = l > 0 ? `${l} ${l === 1 ? "memory" : "memories"}` : null,
    u = a?.segment,
    d;
  if (t[2] !== c || t[3] !== u) ((d = [c, u].filter(Boolean)), (t[2] = c), (t[3] = u), (t[4] = d));
  else d = t[4];
  let p = d,
    f = r ? 1 : 0,
    m;
  if (t[5] === Symbol.for("react.memo_cache_sentinel"))
    ((m = $r.createElement(B, { minWidth: 2 }, $r.createElement(w, { dimColor: !0 }, mc))), (t[5] = m));
  else m = t[5];
  let A = n.verb ?? "Saved",
    g = p.join(" \xB7 "),
    h;
  if (t[6] !== A || t[7] !== g)
    ((h = $r.createElement(B, { flexDirection: "row" }, m, $r.createElement(w, null, A, " ", g))),
      (t[6] = A),
      (t[7] = g),
      (t[8] = h));
  else h = t[8];
  let y;
  if (t[9] !== o || t[10] !== s) ((y = o && s.map(Evp)), (t[9] = o), (t[10] = s), (t[11] = y));
  else y = t[11];
  let _;
  if (t[12] !== y || t[13] !== f || t[14] !== h)
    ((_ = $r.createElement(B, { flexDirection: "column", marginTop: f }, h, y)),
      (t[12] = y),
      (t[13] = f),
      (t[14] = h),
      (t[15] = _));
  else _ = t[15];
  return _;
}

// READABLE (for understanding):
function renderMemorySaved({ message, addMargin, verbose }) {
  // React-Compiler memo cache (d0e.c(16)) elided for clarity.
  let { writtenPaths } = message;

  // --- summary line (UNCHANGED from v2.1.156) ---
  let teamPart   = teamMemSavedPart(message);                 // ANa: {segment,count} | null
  let localCount = writtenPaths.length - (teamPart?.count ?? 0);
  let localSeg   = localCount > 0
        ? `${localCount} ${localCount === 1 ? "memory" : "memories"}`
        : null;
  let segments   = [localSeg, teamPart?.segment].filter(Boolean);
  let verb       = message.verb ?? "Saved";                   // "Saved" | "Improved"
  let summaryRow = createElement(Box, { flexDirection: "row" },
    bulletIcon,                                               // mc, dim
    createElement(Text, null, verb, " ", segments.join(" · ")) // e.g. "Saved 3 memories · 2 team memories"
  );

  // --- file list: ONLY in verbose mode (THE DELTA) ---
  let fileList = verbose && writtenPaths.map(renderClickableFile);  // Evp -> Hvp clickable path

  return createElement(Box,
    { flexDirection: "column", marginTop: addMargin ? 1 : 0 },
    summaryRow,
    fileList,                                                 // false (=> nothing) when not verbose
  );
}

// Mapping: Svp->renderMemorySaved, e->props, n->message, r->addMargin, o->verbose,
//   s->writtenPaths, i/a->teamPart, l->localCount, c->localSeg, u->teamSegment, p->segments,
//   A->verb, g->joinedSegments, h->summaryRow, y->fileList, _->container,
//   mc->bulletIcon, ANa->teamMemSavedPart, Evp->renderClickableFile (key/path wrapper around Hvp),
//   B->Box, w->Text, $r->React
```

The decisive line is **383429**:

```js
((y = o && s.map(Evp)), …)
```

`o` is the `verbose` prop. `o && s.map(Evp)` short-circuits to `false` (which React renders as nothing)
whenever `verbose` is false. When verbose, every path in the **full** `writtenPaths` array (`s`) is mapped
through `Evp` (383441) → `Hvp` (383444), the clickable-file component (a `Box` with `onClick → Uxt(path)`
that opens the file, rendering `basename(path)` with hover underline). There is **no `slice`, no truncation,
and no "+N more files" component** anywhere in `Svp`.

### 2.2 v2.1.156 before-picture — `sk_`

```javascript
// ============================================
// renderMemorySaved (v2.1.156 BEFORE) - always shows a truncated file list + "+N more files"
// Location: v2.1.156 cli_inner_pretty.js:393698-393751 (BEFORE-PICTURE)
// ============================================

// ORIGINAL (for source lookup) — v2.1.156:
function sk_(H) {
  let $ = VLH.c(21),
    { message: q, addMargin: K, verbose: _ } = H,
    { writtenPaths: z } = q,
    A;
  if ($[0] !== q) ((A = gk_.teamMemSavedPart(q)), ($[0] = q), ($[1] = A));
  else A = $[1];
  let Y = A,
    f = z.length - (Y?.count ?? 0),
    O = f > 0 ? `${f} ${f === 1 ? "memory" : "memories"}` : null,
    M = Y?.segment,
    j;
  if ($[2] !== O || $[3] !== M) ((j = [O, M].filter(Boolean)), ($[2] = O), ($[3] = M), ($[4] = j));
  else j = $[4];
  let w = j,
    D;
  if ($[5] !== _ || $[6] !== z) ((D = _ ? z : z.slice(0, ak_)), ($[5] = _), ($[6] = z), ($[7] = D));
  else D = $[7];
  let J = D,
    X = z.length - J.length,
    L = K ? 1 : 0,
    P;
  if ($[8] === Symbol.for("react.memo_cache_sentinel"))
    ((P = j6.createElement(p, { minWidth: 2 }, j6.createElement(k, { dimColor: !0 }, r9))), ($[8] = P));
  else P = $[8];
  let Z = q.verb ?? "Saved",
    W = w.join(" \xB7 "),
    G;
  if ($[9] !== Z || $[10] !== W)
    ((G = j6.createElement(p, { flexDirection: "row" }, P, j6.createElement(k, null, Z, " ", W))),
      ($[9] = Z),
      ($[10] = W),
      ($[11] = G));
  else G = $[11];
  let V;
  if ($[12] !== J) ((V = J.map(tk_)), ($[12] = J), ($[13] = V));
  else V = $[13];
  let v;
  if ($[14] !== X)
    ((v = X > 0 && j6.createElement(h8, null, j6.createElement(iP, { count: X, unit: "file", expandable: !0 }))),
      ($[14] = X),
      ($[15] = v));
  else v = $[15];
  let E;
  if ($[16] !== G || $[17] !== V || $[18] !== v || $[19] !== L)
    ((E = j6.createElement(p, { flexDirection: "column", marginTop: L }, G, V, v)),
      ($[16] = G),
      ($[17] = V),
      ($[18] = v),
      ($[19] = L),
      ($[20] = E));
  else E = $[20];
  return E;
}

// READABLE (for understanding) — v2.1.156:
function renderMemorySaved_v156({ message, addMargin, verbose }) {
  let { writtenPaths } = message;

  // --- summary line (SAME as v2.1.183) ---
  let teamPart   = teamMemSavedPart(message);
  let localCount = writtenPaths.length - (teamPart?.count ?? 0);
  let localSeg   = localCount > 0
        ? `${localCount} ${localCount === 1 ? "memory" : "memories"}` : null;
  let segments   = [localSeg, teamPart?.segment].filter(Boolean);
  let verb       = message.verb ?? "Saved";
  let summaryRow = createElement(Box, { flexDirection: "row" },
    bulletIcon, createElement(Text, null, verb, " ", segments.join(" · ")));

  // --- file list: ALWAYS shown; truncated to ak_ (=3) outside verbose (THE OLD BEHAVIOR) ---
  let shown       = verbose ? writtenPaths : writtenPaths.slice(0, ak_);  // ak_ = 3
  let hiddenCount = writtenPaths.length - shown.length;
  let fileList    = shown.map(renderClickableFile);                       // tk_ -> ek_
  let moreFiles   = hiddenCount > 0 &&                                    // "+N more files" expandable
    createElement(Spacer, null,
      createElement(ExpandableCount, { count: hiddenCount, unit: "file", expandable: true }));

  return createElement(Box,
    { flexDirection: "column", marginTop: addMargin ? 1 : 0 },
    summaryRow,
    fileList,                                                             // truncated list, even non-verbose
    moreFiles,                                                            // "+N more files"
  );
}

// Mapping: sk_->renderMemorySaved_v156, q->message, K->addMargin, _->verbose, z->writtenPaths,
//   A/Y->teamPart, f->localCount, O->localSeg, M->teamSegment, j/w->segments, Z->verb, W->joinedSegments,
//   G->summaryRow, D/J->shown, X->hiddenCount, V->fileList, v->moreFiles, E->container,
//   ak_->FILE_LIST_TRUNCATION_LIMIT (=3, v2.1.156:393839), tk_->renderClickableFile, iP->ExpandableCount,
//   h8->Spacer, r9->bulletIcon, gk_.teamMemSavedPart->teamMemSavedPart, p->Box, k->Text, j6->React
```

The two removed pieces are at v2.1.156 lines **393714** and **393736-393737**:

```js
// 393714 — truncate to ak_ when not verbose:
(D = _ ? z : z.slice(0, ak_))          // ak_ = 3  (v2.1.156:393839)
// 393736-393737 — "+N more files" expandable count:
(v = X > 0 && createElement(h8, null, createElement(iP, { count: X, unit: "file", expandable: !0 })))
```

### 2.3 Side-by-side semantics

| Aspect | v2.1.156 (`sk_`) | v2.1.183 (`Svp`) |
|---|---|---|
| Summary line ("Saved/Improved N memories · M team memories") | shown | shown (identical computation) |
| File list **when verbose** | full `writtenPaths` (`tk_`) | full `writtenPaths` (`Evp`) — unchanged |
| File list **when NOT verbose** | `writtenPaths.slice(0, 3)` clickable files | **nothing** |
| "+N more files" count (non-verbose) | `iP` expandable, when `>3` paths | **removed** |
| Truncation constant | `ak_ = 3` (393839) | **gone** (no `slice`) |

> This is the *only* allowed table in this module doc — it is a cross-version 88/156/183-style behavior
> comparison in the spirit of a cross-validation table, not an obfuscated→readable mapping table. All
> symbol mappings live in the [Related Symbols](#related-symbols) block and the per-feature additions file.

### 2.4 Deep analysis

#### Algorithm: verbose-gated file-list rendering

**What it does:** Decides whether the `memory_saved` status line shows the list of file paths that were
written (each clickable, opening the file in the editor) underneath the one-line "Saved N memories" summary.

**How it works (v2.1.183):**
1. `SNa` (the status-line dispatcher, 382861) matches `message.subtype === "memory_saved"` (382871) and
   computes the effective verbose flag `p = o || !!s` — **`verbose` OR `isTranscriptMode`** (382872) — then
   passes it as the `verbose` prop to `Svp`.
2. Inside `Svp`, the summary row `h` is built unconditionally from the verb + the joined
   `[localSeg, teamSeg]` segments (383419-383427). This is the part the user always sees.
3. The file list `y` is `o && s.map(Evp)` (383429): a short-circuit. When `o` (verbose) is false, `y` is the
   boolean `false`, which React renders as nothing. When true, **every** path in `writtenPaths` is mapped to
   a clickable `Hvp` component — no cap.
4. The container `_` stacks `h` then `y` in a column (383433); a `false` child contributes no rows.

**How it differed (v2.1.156):**
- Step 3 was two stages: `D = _ ? z : z.slice(0, ak_)` (393714) chose a *truncated* list outside verbose
  (`ak_ = 3`), and a separate `v = X > 0 && <ExpandableCount …/>` (393736) appended a "+3 more files"
  affordance when paths exceeded the cap. The list `V = J.map(tk_)` and the count `v` were both always
  placed in the container (393743) regardless of verbose.

**Why this approach (trade-offs / alternatives):**
- **Noise reduction.** The non-verbose status line is meant to be a single glanceable line in the running
  transcript. Even three file paths plus a "+N more files" affordance added 1-4 extra rows after *every*
  memory save (and auto-dream fires per turn), pushing real conversation content up the scrollback. Gating
  the entire list on verbose collapses the common case to one row.
- **The full detail is still reachable.** Because `SNa` folds `isTranscriptMode` into the verbose flag
  (`o || !!s`, 382872), the complete clickable list still appears in the transcript view and in `--verbose`.
  Nothing is lost — only the inline default is quieter. This is the same trade-off Claude Code applies to
  other status messages: terse inline, full in transcript.
- **Alternative considered (inferable):** they could have kept the truncated `slice(0,3)` + "+N more files"
  but lowered the cap, or made "+N more files" the *only* thing shown. They chose the simpler binary — show
  all or show none — which deletes two code paths (`slice` and the `ExpandableCount`/`iP` component usage
  here) and removes the `ak_` constant. Less code, fewer states to reason about.

**Key insight:** This is a *pure presentation* change with a one-line implementation: replacing
`_ ? z : z.slice(0, ak_)` + a conditional "+N more" component with the single short-circuit `o && s.map(…)`.
The message contract (`writtenPaths`, `verb`, `teamCount`), the summary computation, and the clickable-file
component are all untouched — the renderer simply stops *truncating-and-teasing* and instead *all-or-nothing*
gates the list on verbose. The verbose flag itself (`verbose || isTranscriptMode`) is **not** new: the
v2.1.156 dispatcher already computed `w = _ || !!z` at the equivalent case (v2.1.156:393208), so the
behavior pivot lives entirely inside the renderer, not in how verbose is derived.

> **Honest caveat (dossier delta 6 framing).** The dossier described the verbose flag as "set in the
> renderer dispatch `SNa`." That is accurate for v2.1.183, but the `verbose || isTranscriptMode`
> computation is itself **carryover** — it was already `_ || !!z` in the v2.1.156 dispatcher
> (v2.1.156:393208). So the *only* real code delta is the renderer body (`Svp` vs `sk_`), specifically the
> removal of the `slice(0, ak_)` truncation and the `iP` "+N more files" component. The dispatch line is
> not a delta and should not be cited as one.

---

## 3. Env-surface presence note

The dossier and `_asset_anchors.md` flag two memory-related env-var families as present in the v2.1.183
bundle. They are not part of the status-line render path, but a reader landing here from the changelog may
expect them mentioned, so this is a brief presence note only — full treatment lives in
[team_memory_stores_recall.md](./team_memory_stores_recall.md).

- **`CLAUDE_CODE_REMOTE_MEMORY_DIR`** — present (8 occurrences in the v2.1.183 bundle). It is consumed by
  `getRemoteMemoryRoot` (`Wse`, cli_inner_pretty.js:147666): when set, the auto-memory base directory
  `hm()` resolves under it, which is what makes a remote session's mounted team stores discoverable. This
  is the env hook behind the 2.1.172 remote-recall fix (`isTeamMemoryEnabled` / `Nk`, 151098). It has **no
  effect on the status-line renderer** — the renderer only sees `writtenPaths`/`verb`/`teamCount`, which are
  produced after recall/extraction has already run. See
  [team_memory_stores_recall.md](./team_memory_stores_recall.md) for the recall-path analysis.
- **`CLAUDE_COWORK_MEMORY_*` family** — present: `CLAUDE_COWORK_MEMORY_GUIDELINES`,
  `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES`, `CLAUDE_COWORK_MEMORY_INDEX_CONTENT`,
  `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`. These feed the cowork branch of the recall dispatcher
  `loadMemoryPrompt` (`e0t`, 151847) — e.g. `CLAUDE_COWORK_MEMORY_GUIDELINES` is read in the `e0t`
  preamble — and are part of the team-store recall surface, **not** the status line. Again, full coverage
  is in [team_memory_stores_recall.md](./team_memory_stores_recall.md).

**Confidence:** the *presence* of all five env vars is high (grep-confirmed in the v2.1.183 bundle). Their
detailed semantics are out of scope for this status-line doc and are intentionally deferred to the recall
doc to avoid duplicate (and possibly drifting) analysis.

---

## 4. What did NOT change (link, do not re-read)

- **`memory_saved` message factory** (`createMemorySavedMessage`, `YGn` @589751) and the `verb`/`teamCount`
  patching → v2.1.156
  [extract_memories_runtime.md](../../../claude_code_v_2.1.156/analyze/31_auto_memory/extract_memories_runtime.md)
  and [auto_dream_runtime.md](../../../claude_code_v_2.1.156/analyze/31_auto_memory/auto_dream_runtime.md)
  (auto-dream's `verb:"Improved"` reuse).
- **The team-memory summary segment** (`teamMemSavedPart`, `ANa` @382753) — identical logic to v2.1.156.
- **The clickable-file component** (`Hvp` @383444 / `Evp` @383441 in v2.1.183; `ek_`/`tk_` in v2.1.156) —
  same `Box`+`onClick(openFile)`+hover-underline structure; only the surrounding *gating* changed.
- **The dispatcher's verbose derivation** (`verbose || isTranscriptMode`) — carryover (v2.1.156:393208).

---

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Auto Memory)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_183_auto_memory.md](../00_overview/symbol_additions_v2_1_183_auto_memory.md) - Per-feature additions (v2.1.183 auto_memory)

Key functions in this document:
- `renderMemorySaved` (obf: `Svp`, cli_inner_pretty.js:383399) — `memory_saved` status-line renderer; file list now verbose-only (`o && s.map(Evp)` @383429)
- `renderClickableFile` (obf: `Evp`, cli_inner_pretty.js:383441) — key/path wrapper that renders each `writtenPaths` entry as a clickable `Hvp`
- `clickableFile` (obf: `Hvp`, cli_inner_pretty.js:383444) — clickable file row (`onClick → openFile`, hover underline)
- `renderMemorySaved` v2.1.156 BEFORE (obf: `sk_`, v2.1.156 cli_inner_pretty.js:393698) — always showed `slice(0, ak_)` truncated list + `iP` "+N more files"
- `FILE_LIST_TRUNCATION_LIMIT` v2.1.156 BEFORE (obf: `ak_`, v2.1.156 cli_inner_pretty.js:393839, value `3`) — removed in v2.1.183
- `statusLineDispatch` (obf: `SNa`, cli_inner_pretty.js:382861) — routes `memory_saved`; computes `verbose = verbose || isTranscriptMode` (@382872, carryover)
- `teamMemSavedPart` (obf: `ANa`, cli_inner_pretty.js:382753) — builds the "N team memories" summary segment (carryover)
- `createMemorySavedMessage` (obf: `YGn`, cli_inner_pretty.js:589751) — `memory_saved` system-message factory (carryover)
- `getRemoteMemoryRoot` (obf: `Wse`, cli_inner_pretty.js:147666) — honors `CLAUDE_CODE_REMOTE_MEMORY_DIR` (env-surface note only; detail in [team_memory_stores_recall.md](./team_memory_stores_recall.md))
- `loadMemoryPrompt` (obf: `e0t`, cli_inner_pretty.js:151847) — reads `CLAUDE_COWORK_MEMORY_*` (env-surface note only; detail in [team_memory_stores_recall.md](./team_memory_stores_recall.md))
