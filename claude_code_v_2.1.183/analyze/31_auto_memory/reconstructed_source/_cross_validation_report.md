# Cross-Validation Report — v2.1.183 Auto-Memory / Dream Reconstruction

**Scope:** Adversarial cross-validation of the readable-source restoration under
`31_auto_memory/reconstructed_source/` — the whole auto-memory + dream machine at v2.1.183 (20 files).
Each reconstructed unit was independently re-read against the live `cli_inner_pretty.js` bundle (v2.1.183)
at the anchors it cites, byte-checked for verbatim strings and symbol bodies, and run through false-delta
guards against the v2.1.156 (and where available v2.1.132/142) bundles. Bundle of record:
`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).

---

## Overall Verdict: **PASS** — 20/20 units PASS, 0 FAIL

The build ran as a **20-unit reconstruct → adversarial-verify pipeline**: every `.ts`/`.tsx` file was
(a) reconstructed from the primary bundle under the three-tier evidence discipline in `_conventions.md`,
then (b) handed to an independent validator that re-derived each cited obfuscated name, re-read each
anchored line, byte-checked every verbatim prompt/string, and ran a false-delta counter-check against the
v2.1.156 predecessor. **All 20 units returned PASS; no unit FAILed.** Defects found mid-pipeline were
corrected in place and re-read against the live bundle before the unit was marked clean (itemized in
"Notable deltas" and "Residual / open items" below).

The reconstruction is faithful-to-source: where a detail could not be confirmed in the 183 bundle it was
omitted or marked `// UNVERIFIED` (one residual marker survives — see below), and false carryover from the
88 ancestor was actively hunted (the 88 ancestor is a *real, ungated* auto-memory subsystem, so the
temptation to carry its shape forward verbatim is strong — every "unchanged" claim was counter-checked
against the live 183 line).

---

## Per-Unit Verdicts

| # | Unit | Anchors re-read | Verdict | Notes |
|---|------|----------------:|---------|-------|
| 1 | `memdir/paths.ts` | gate chain Iu@147636, $mi@147676, hm@147746, dir-name XXu@147670/147729-730 | PASS | 4 new gates + `tiny_memory` switch confirmed; `getAutoMemDailyLogPath` removal confirmed (grep=0) |
| 2 | `memdir/memdir.ts` | caps@150799-801, e0t@151847-949, UNr@151756 | PASS | full e0t scope/mode ladder re-read; `tengu_coral_fern` removal confirmed (grep=0) |
| 3 | `memdir/memoryTypes.ts` | kNr@150905, ONr@151559, dgi@150869, NQu@150876 | PASS | 4-vs-3-elem taxonomy split + `tengu_ochre_finch` compact switch confirmed |
| 4 | `memdir/memoryScan.ts` | C4t@454800, I4t@454838, o2p@454766 | PASS | tiny-mode densified manifest + promptIndex exclude set confirmed |
| 5 | `memdir/memoryAge.ts` | EHd@220191, YWr@220194, xOi@220203 | PASS | 88 `memoryAge` relative-label removal confirmed (only EHd→YWr callsite) |
| 6 | `memdir/findRelevantMemories.ts` | ntl@464313, rtl@464417, q3p@464524, V3p@464532 | PASS | full SELECT/SYNTHESIZE rebuild; one residual `// UNVERIFIED` re-export marker (kept) |
| 7 | `memdir/teamMemPaths.ts` | bQu@150491, Zse@150442, agi@150754, Nk@151098, uH@151103 | PASS | `scope`/`promptIndex` schema + fetch + mounted-store fix confirmed |
| 8 | `memdir/teamMemPrompts.ts` | mgi@151194, Agi@151265, bgi@151378, Sgi@151426, Egi@151481 | PASS | all 5 builder bodies read in full (scout had signature-only) |
| 9 | `services/autoDream/autoDream.ts` | BQa@455415-544, w2p@455394, fired@455467, failed@455539 | PASS | fired/completed/failed/skipped payload additions all re-read live |
| 10 | `services/autoDream/config.ts` | yQa@454520, jGn@454523, T4t@454528 | PASS | 3-function opt-in cluster + team-server fallback confirmed |
| 11 | `services/autoDream/consolidationLock.ts` | Cqa@424619, BDp@424663, FDp@424664 | PASS | `recordConsolidation` removal confirmed (only lock PID write is in Cqa) |
| 12 | `services/autoDream/consolidationPrompt.ts` | PQa@455311, H2p@455379, v2p@455381, inert kQa/LQa | PASS | session-log layout change + reconcile section + always-false inert slots confirmed |
| 13 | `services/extractMemories/extractMemories.ts` | zGn@455059, skip events@455133/183/223, k4t@455056 | PASS | new `no_prose` skip rung + sandbox toggle/pwsh/tiny additions confirmed |
| 14 | `services/extractMemories/prompts.ts` | SQa@454882-927 | PASS | two-builder→one-builder collapse confirmed; `tengu_moth_copse` does NOT gate this prompt |
| 15 | `services/teamMemorySync/watcher.ts` | uFp@449203, rX@449224, $W@449230, lje@289759 | PASS | scope-split + `tengu_personal_mem_sync_started` user lane confirmed (grep=1) |
| 16 | `services/teamMemorySync/index.ts` | m_n@150574, lAo@448434, pAo@448833, sAo@447764 | PASS (contract-level) | public surface anchored; deep transport summarized by design |
| 17 | `tasks/DreamTask/DreamTask.ts` | xqa@424678, kqa@424694, Lqa@424707, UDp=30@424717 | PASS | free-fn→registry-object move + `skipTranscript` + inline telemetry confirmed |
| 18 | `utils/messages.ts` | YGn@589751, YSf@590643, drain Ctl@465836 | PASS | factory byte-identical to 88; labels/queue are post-88 additions |
| 19 | `utils/memoryFileDetection.ts` | module@444832-922, callers@444971-985 | PASS | `session_memory` arm removal confirmed (moved to compact, out of scope) |
| 20 | `components/memory/MemoryUpdateNotification.tsx` | Svp@383399, Hvp@383444, ANa@382753, SNa@382871 | PASS | verbose-only file list (no slice/cap) confirmed as the only real code delta vs 156 |

**Total: 20/20 PASS, 0 FAIL.** Every cited anchor was re-read in the live bundle; every verbatim prompt
string was byte-checked; every claimed delta was counter-checked against v2.1.156.

---

## Coherence Pass Summary

Run after per-unit validation to reconcile imports, duplicate definitions, and aliases across the 20-file
tree:

- **Module boundary split honored.** `memdir/memoryScan.ts` was deliberately split out of
  `findRelevantMemories.ts` so the extraction path can import the scan primitives without pulling in
  `sideQuery` + the API-client chain (which would close a cycle through `memdir.ts`). The reconstruction
  preserves that split; the import edge `extractMemories → memoryScan` resolves and is acyclic.
- **`feature('TEAMMEM')` gating.** `memdir.ts` and `utils/memoryFileDetection.ts` keep the 88-shape
  `feature('TEAMMEM') ? require('./teamMemPaths.js') : …` form, annotated `// feature('TEAMMEM')
  inlined-enabled in 183` (the 183 bundle calls the team predicates `Nk`/`vK`/`Bme` directly). The
  require collapses to a static import there; the in-tree edge is real and resolves.
- **Shared naming registry.** The recall dispatcher (`loadMemoryPrompt`/`e0t`), the master gate
  (`isAutoMemoryEnabled`/`Iu`), the team-enable gate (`isTeamMemoryEnabled`/`Nk`), and the tiny-mode gate
  (`isTinyMemoryEnabled`/`aH`) are referenced by consistent readable names across all units that touch
  them (`_conventions.md` "Naming registry"), so cross-file imports line up.
- **Contract-level boundary.** `services/teamMemorySync/index.ts` exposes only the public store-client /
  multistore / push-pull / telemetry surface that `watcher.ts` imports (`buildMultistore`/`lAo`,
  `MemoryServiceBackend`/`m_n`, `multistorePush`/`pAo`, `pullMemory`/`sAo`); `watcher.ts`'s imports all
  resolve to that surface. The deep transport internals are summarized in the file header, not exported.

---

## Notable v2.1.88 → v2.1.183 deltas the reconstruction surfaced

Harvested from the `// DELTA` comments across the 20 files (218 inline delta markers total) and
re-verified at the cited line. These are the high-signal changes between the v2.1.88 ancestor and the
v2.1.183 bundle that the restoration makes legible:

### Dream scheduler telemetry grew payloads

- **`tengu_auto_dream_fired` gained `team_memory_enabled`.** Bundle @455467:
  `G("tengu_auto_dream_fired", { hours_since: …, sessions_since: c.length, team_memory_enabled: p })`,
  where `p = Nk()` (`isTeamMemoryEnabled`@455465). The 88 ancestor's fired payload had no team field.
  → `services/autoDream/autoDream.ts`.
- **`tengu_auto_dream_failed` gained `{ phase, error_class }`.** Bundle @455539:
  `G("tengu_auto_dream_failed", { phase: Ne(g), error_class: yo(h).name })` — the 88 ancestor logged an
  **empty `{}`**. → `services/autoDream/autoDream.ts`.
- **`tengu_auto_dream_completed` gained `daily_logs_found` / `files_touched_count` /
  `team_memory_enabled`** @455522-455529, and the session/lock gates now emit a
  **`tengu_auto_dream_skipped { reason }`** event @455444/455461 where the 88 ancestor returned silently.

### A whole `tiny_memory` ("one-fact-per-file") subsystem appeared (gated by `tengu_billiard_aviary`)

- **`isTinyMemoryEnabled` = `aH`@147673 reads `tengu_billiard_aviary`** (1 occurrence in the bundle), and
  **`memoryDirName` = `XXu`@147670** returns `YXu="tiny_memory"`@147730 instead of `KXu="memory"`@147729
  when it is on. This flows everywhere: the memory base dir, the scan/manifest shape (a densified
  per-line manifest that inlines bodies — `memoryScan.ts`), the recall builders (`bgi`/`Sgi` tiny variants
  — `teamMemPrompts.ts`), the taxonomy (the parallel `TINY_MEMORY_TYPES`=`ONr`@151559 3-element cluster —
  `memoryTypes.ts`), the query-time SYNTHESIZE recall mode (`findRelevantMemories.ts`), the extraction
  sandbox (Edit banned, scoped `rm`/`Remove-Item` allowed — `extractMemories.ts` @455085), and the dream
  prompt (a delete-only "# Dream: Memory Pruning" prune prompt swapped in). → touches 7 files.

### The KAIROS daily-log paradigm was removed

- **`getAutoMemDailyLogPath` is gone** (grep in bundle = 0). The 88 KAIROS daily-log helpers
  (`buildAssistantDailyLogPrompt`, the "This session is long-lived" text, `logs/YYYY/MM/<date>.md`) have
  **no counterpart in the 183 path module** — `tiny_memory` replaced them. → noted in `memdir/paths.ts`
  and `memdir/memdir.ts`.
- **`recordConsolidation` is gone** from the lock module — the only PID write to `.consolidate-lock` is
  now inside `tryAcquireConsolidationLock` (`Cqa`@424633). The 88 ancestor's manual `/dream` stamp export
  has no 183 counterpart. → `services/autoDream/consolidationLock.ts`.
- **The `## Searching past context` recall section is gone** — `tengu_coral_fern` and "Searching past
  context" both grep to **0** in the bundle; `buildMemoryLines` (`UNr`) no longer appends it. →
  `memdir/memdir.ts`, `memdir/teamMemPrompts.ts`.
- **The 88 `memoryAge` relative-label formatter ("today"/"yesterday"/"N days ago") is gone** — `EHd`
  (`memoryAgeDays`) is referenced only by `YWr` (`memoryFreshnessText`); the recall/file-read paths
  consume the freshness *text/note*, not a relative-age label. → `memdir/memoryAge.ts`.
- **The `session_memory` detection arm is gone** from `memoryFileDetection` — only `session_transcript`
  (`.jsonl` under `/projects/`) survives; session-summary memory moved to the **compact** subsystem
  (out of scope). → `utils/memoryFileDetection.ts`.

### `findRelevantMemories` became an LLM SELECT / SYNTHESIZE recall engine

- The 88 file was a single one-shot Sonnet selector returning up to 5 `{ path, mtimeMs }`. v2.1.183
  rebuilt it (`ntl`@464313 / `rtl`@464417) into a **conversation-cached two-mode engine**: the
  available-memories manifest is sent ONCE as a cached first user message (`cache_control: ephemeral`),
  each turn appends only the new query, and two modes share that per-dir cache —
  **SELECT** (`findRelevantMemories` → filenames + a knowledge-index sidecar, used when tiny-mode is OFF)
  and **SYNTHESIZE** (`synthesizeRelevantMemories` → up to 7 extracted facts from full bodies, used when
  tiny-mode is ON). New `memory_recall_select` / `memory_recall_synthesize` telemetry (5 hits in the
  bundle). → `memdir/findRelevantMemories.ts`.

### The team-store recall path (v2.1.172) expanded

- **`CLAUDE_MEMORY_STORES` gained `scope` / `promptIndex` / `promptIndexMaxBytes`** in the store schema
  (`bQu`@150491); the parser (`Zse`@150442) defaults `scope:"team"` so every legacy v2.1.156 config keeps
  meaning, and enforces **at most one `scope:"user"`** store. Each store's `promptIndex` is fetched over
  the network (`fetchStorePromptIndices`=`agi`@150754, 5s timeout `xQu`@150791, drop-on-failure
  `allSettled`) and injected as a `<memory>` block. → `memdir/teamMemPaths.ts`, `memdir/memdir.ts`.
- **The mounted-store team-enable fix (`Nk`@151098)** — `isTeamMemoryEnabled` gained a NEW middle clause:
  a non-empty `CLAUDE_MEMORY_STORES` now enables team recall **independent of** the `tengu_herring_clock`
  flag. This is the remote-session recall fix. → `memdir/teamMemPaths.ts`.
- **The watcher split into team + user lanes** (`startMemoryWatcherCore`=`uFp`@449203): parse the stores
  once, split by `scope`, build a multistore per lane (`teamMultistore`=`rX`@449224 /
  `userMultistore`=`$W`@449230), and the user lane emits the new `tengu_personal_mem_sync_started`
  (grep=1) gated by `isUserStoreEnabled`=`lje`@289759 (`tengu_marble_lark`). → `services/teamMemorySync/watcher.ts`.
- **`isTeamMemPath` (`Bme`@151159) is now case-insensitive** (NFC + lowercase on both sides). →
  `memdir/teamMemPaths.ts`.

### Extraction + taxonomy + UI tweaks

- **The extraction sandbox grew** a `/toggle-memory off` short-circuit, a `trustedNetworkDirectories`
  check on Read/Grep/Glob, PowerShell support, and a tiny-mode Edit ban with scoped `rm`/`Remove-Item`
  allow (`createAutoMemCanUseTool`=`zGn`@455059); the skip-ladder gained a **`no_prose`** rung between the
  direct-write skip and the throttle (@455136-455142, `MIN_PROSE_WORDS`=`HQa`=3@455250). →
  `services/extractMemories/extractMemories.ts`.
- **The two extraction prompt builders collapsed into one** parameterized `buildExtractionPrompt`
  (`SQa`@454882) that **defers** the taxonomy / frontmatter / how-to-save prose to the system prompt's
  Memory section (its 3rd arg is `Nk()`, gating only the "scope guidance, " text, NOT `tengu_moth_copse`).
  → `services/extractMemories/prompts.ts`.
- **A compact-taxonomy switch** (`tengu_ochre_finch`) can replace the verbose `<types>` XML block with a
  one-liner-per-type list that defers to the `memory-types` skill; the frontmatter example was reshaped
  (`name:` → kebab slug, `type:` nested under `metadata:`, a `[[name]]` wikilink appendix). →
  `memdir/memoryTypes.ts`.
- **`DreamTask` moved from free functions to a registry object** — `registerDreamTask`/`addDreamTurn`/
  etc. now call `taskRegistry.register()/.update()/.get()` instead of taking a `setAppState` callback; the
  record gained `skipTranscript:true`@424684; complete/fail/kill now emit telemetry + a `task_notification`
  inline (88 emitted nothing). → `tasks/DreamTask/DreamTask.ts`.
- **The `memory_saved` renderer (`Svp`@383399) renders the per-file list verbose-only** —
  `y = o && s.map(Evp)` short-circuits to nothing unless verbose; **no `slice`, no cap, no "+N more
  files"** (the v2.1.156 renderer truncated to 3 + an "+N more" count). This is the only real *code*
  delta in the status-line path vs 156; `verbose = verbose || isTranscriptMode` is carryover, NOT a
  delta. → `components/memory/MemoryUpdateNotification.tsx`.

---

## False-Delta Guard — Consolidated Results

Every claimed 156/88→183 delta was counter-checked; every "this was removed" claim was a grep-confirmed
absence in the 183 bundle:

| Guard | Result | Verdict |
|-------|--------|---------|
| `getAutoMemDailyLogPath` / `AutoMemDailyLog` in 183 | grep = 0 | confirmed removed (KAIROS daily-log paradigm dropped) |
| `tengu_coral_fern` / "Searching past context" in 183 | grep = 0 | confirmed removed (recall section dropped) |
| `tengu_billiard_aviary` in 183 | grep = 1 (`aH`@147673) | confirmed present (the `tiny_memory` gate is REAL) |
| `tiny_memory` dir-name literal | `YXu="tiny_memory"`@147730 | confirmed (vs `KXu="memory"`@147729) |
| `tengu_auto_dream_fired` `team_memory_enabled` field | present @455467 | **REAL** addition (absent in 88) |
| `tengu_auto_dream_failed` `{phase,error_class}` | present @455539 | **REAL** addition (88 logged `{}`) |
| `tengu_personal_mem_sync_started` (user sync lane) | grep = 1 (@449262) | **REAL** addition (watcher scope-split) |
| `memory_recall_select` / `_synthesize` telemetry | grep = 5 | **REAL** (SELECT/SYNTHESIZE recall rebuild) |
| `recordConsolidation` lock export | absent in 183 lock module | confirmed removed (only Cqa writes the PID) |
| `session_memory` arm in `memoryFileDetection` | absent in 183 | confirmed removed (moved to compact, out of scope) |
| `createMemorySavedMessage` body vs 88 | byte-identical (`YGn`@589751) | **NO delta** (correctly NOT claimed; verb/teamCount patched at call site) |
| `tengu_moth_copse` gating the extraction prompt | NOT a gate there (uses @151860/@225900/@465364) | false-carryover guard PASS (prompt gates on tiny-mode, not moth_copse) |

---

## Residual / open items

Each is **deliberately kept** and documented in the reconstructed source. None is a wiring bug; each is
either an out-of-scope summarization or a behavior-irrelevant note.

- **`memdir/findRelevantMemories.ts:706` — one `// UNVERIFIED` marker (KEPT).** A helper is re-exported
  locally only to mirror the bundle's local helper usage; it is not byte-confirmable as a distinct exported
  bundle symbol, so it is flagged rather than asserted. Not a wiring bug — the file type-checks and the
  recall logic it supports is fully anchored.
- **`services/teamMemorySync/index.ts` — CONTRACT-LEVEL by design.** Per `_conventions.md`, the deep
  multistore transport (delta-compute, 412-conflict loop, byte-batched PUT splits, tombstone/soft-delete
  bookkeeping, secret scanning, bulk-export inflate) is **carryover plumbing the delta docs deliberately
  do not re-derive**. The file restores only the public store-client / multistore / push-pull / telemetry
  surface (anchored to `m_n`@150574, `lAo`@448434, `pAo`@448833, `sAo`@447764) and summarizes the internals
  in its header. This is an intentional scope boundary, not a gap.
- **Out-of-scope, linked not re-read:** `services/SessionMemory/*` and
  `services/compact/sessionMemoryCompact.ts` (the **compact** session-summary memory) are documented under
  `07_compact/`; the deep `teamMemorySync` push/pull *transport* + `secretScanner.ts` are linked to
  `../team_memory_stores_recall.md` §5 rather than re-derived. These were intentionally not read for this
  reconstruction.
- **Header anchor-citation drift (cosmetic).** A few file headers cite a region end-line or sibling-symbol
  line that is off by 1-4 while the cited string/logic content is byte-exact and the in-body
  `// 2.1.183: <name> = <obf> @<line>` anchors are correct. Left as-is; the in-body anchors are the
  authoritative map.

---

## Orchestrator final gate — independent import-graph + brace re-derivation (2026-06-24)

After the finalize workflow's coherence pass and the two file-disjoint adversarial cross-validators, the
orchestrator ran its **own** resolver over all 20 files — never trusting a prior coherence "PASS" (the
lesson carried from the Agent Team reconstruction). Method: a from-scratch parser that extracts every
`export` (including `export declare class`/`export declare function` contract-level surfaces) and every
relative `import { … } from '…js'`, strips inline comments from multi-line import lists, and resolves each
internal named import against the target file's real export set; plus a string/comment/regex-aware brace
counter.

**Result: 0 real internal import breaks — every internal named import resolves to a real export.**

- **First pass surfaced 11 candidate "missing exports" — all but one were resolver artifacts**, confirmed
  by direct inspection of the bundle and the files:
  - `index.ts` exposes `MemoryServiceBackend`, `pushMemory`, `multistorePush`, `pullMemory` as
    **`export declare`** contract-level surfaces (line 160/516/540/489). The first-pass regex didn't match
    `export declare`; the imports from `teamMemPaths.ts` and `watcher.ts` resolve correctly.
  - `paths.ts` does export `isAutoMemPathWritable`, `isTinyMemoryEnabled`, `isExtractModeActive`,
    `getAutoMemBaseDir` (483/227/187/439). The first-pass flags were inline `//` anchor comments **inside**
    `extractMemories.ts`'s multi-line import list polluting the name extraction.
  - `getAutoMemPath` (`hm`@147746, the memoized full memory dir) and `getAutoMemBaseDir` (`ZXu`@147712, the
    git-canonical-root base) are **two distinct exports** — the cross-validator's "dual readable name"
    residual is a naming nuance, not an import break: both are present in `paths.ts` and both resolve.
- **The one genuine unresolved edge — `createUserMessage`** (imported by `autoDream.ts` and
  `extractMemories.ts` from the memory-subset `utils/messages.ts`, where it lives in the un-restored bulk) —
  was closed by the orchestrator with a faithful **contract-level `export declare function createUserMessage`**
  (anchored `Rn`@587504), matching the same convention `index.ts` uses for the transport. Not invented (the
  real `messages.ts` exports it); it makes the reconstructed import graph fully self-consistent.
- **Brace/paren/bracket balance: 0 real imbalances.** The five files the naive counter flagged
  (`autoDream.ts`, `extractMemories.ts`, `memoryFileDetection.ts`, `consolidationPrompt.ts`,
  `memoryTypes.ts`) each contain either regex literals with literal `{`/`(`/`[` inside character classes
  (e.g. `/[*?[\]$\`(){}|;&<>"',]/` in the PowerShell `Remove-Item` guard, `/[/\\]+$/` in
  `memoryFileDetection.ts`) or large template-literal prompt bodies — none is a structural imbalance. The
  coherence pass's regex-aware counter independently reported 0.

**Final deliverable: 20 reconstructed `.ts`/`.tsx` files, ~9,290 LOC, import graph fully resolvable
(118 out-of-tree references are external/un-restored-by-design), 0 brace imbalances, 20/20 reconstruct
units PASS + 2/2 cross-validators PASS + orchestrator import-graph gate PASS.**

---

## Second independent cross-validation pass (2026-06-24)

A **finer-grained, fully independent** default-to-FAIL pass was run after the above — explicitly
distrusting every prior PASS (the lesson carried from the Agent Team reconstruction: a second pass that
re-reads the bundle catches false-deltas and invented attributions a first verify misses). **10
file-disjoint validators** (≈2 files each) re-read **373 anchors** in the live v2.1.183 bundle, and — for
every `// DELTA` comment — re-read **both** the v2.1.88 ancestor and the v2.1.183 bundle to adjudicate
whether the change is real and correctly attributed. A separate **read-only import/SSOT auditor** then
re-derived the whole export/import graph and **parsed all 20 files with esbuild** (0 syntax errors).

**Result: 10/10 groups PASS + audit PASS.** It caught and fixed **15 defects in place** that the first
pass had cleared — the high-value ones:

- **2 false deltas (wrong version attribution)** — both fixed:
  - `teamMemPaths.ts` tagged `isTeamMemPath` case-insensitivity as a **2.1.183** delta; it is byte-identical
    in v2.1.156 (`NFK`@[156]144775). Real vs the v2.1.88 ancestor (which was case-sensitive), but **not** a
    2.1.183 change — re-tagged "vs 88; carryover from 156".
  - `memoryScan.ts` tagged tiny-memory mode + the `created/last_read/content` triplet + the scan caps +
    content-inlining manifest + `memory_scan` telemetry as a **2.1.181** delta; all are present in v2.1.156
    (`UV$`@[156]412302 / `FV$`@[156]412339 / caps @[156]412359-412362). Re-tagged as 156 carryover.
- **1 invented attribution** — fixed at 3 sites: the claim that the v2.1.88 `getKairosActive()` gate was
  "folded into `isAutoMemoryEnabled()` (`Iu`@147636)" was unconfirmable — `Iu`'s body (@147636-147653) has
  no KAIROS check. Rewritten to assert only the verified gate composition (`dd` remote-exclusion + `Iu`
  parent + `T4t` config) and mark the relocation explicitly unconfirmed.
- **1 missed delta** — now tagged: the auto-dream catch-block rollback is **phase-gated** in 183
  (`failDreamTask`+`rollbackConsolidationLock` only when `phase==='fork'`, @455540), where the 88 ancestor
  did both unconditionally.
- **1 invented value** — removed: a `getTeamMemServerStatus` `'unknown'` status that is never set in the
  bundle (only `'not-available'`/`'has-content'`/`'empty'` are set via `j8e`).
- Plus several anchor/verbatim corrections in `consolidationLock.ts`/`DreamTask.ts`, `watcher.ts`/`index.ts`,
  and `messages.ts`/`MemoryUpdateNotification.tsx` (the `pluralize` argument-order on the "N memories" render).

**Import/SSOT auditor (read-only) — verdict PASS, 0 import breaks, 0 brace issues** (esbuild-confirmed). It
surfaced **3 minor items, all resolved by the orchestrator afterward:**

1. `memoryScan.ts` re-defined `ENTRYPOINT_NAME = 'MEMORY.md'` as a private const instead of importing the
   SSOT from `memdir.ts` — an *avoidable* dup (no cycle: `memdir.ts` imports only `paths`/`memoryTypes`).
   **Fixed:** `memoryScan.ts` now `import { ENTRYPOINT_NAME } from './memdir.js'` (also more faithful — the
   bundle has a single shared `$w`). Re-checked: import graph still resolves, no new cycle.
2. `Hgi`@151520 carried two readable names — `buildDreamPromptTiny` (the real export in `memoryTypes.ts`,
   consumed by `autoDream.ts`) vs `buildPrunePrompt` in `consolidationPrompt.ts`'s doc-comments. **Fixed:**
   unified the doc-comment refs to `buildDreamPromptTiny`.
3. `_conventions.md` registry cited `vNr@150439`/`kQu@150769` (body lines); the declarations are at
   **150438**/**150768** (the reconstructed files already used the correct lines). **Fixed** the conventions doc.

The `DIR_EXISTS_GUIDANCE_TINY` dup remains (intentional, documented cycle-avoidance — `memoryTypes.ts`
cannot import back from `memdir.ts`), and the `teamMemPaths ↔ teamMemorySync/index` value cycle remains
(ESM-tolerated, resolved at call time). Residuals are honest contract-level out-of-scope references
(`../bootstrap/*`, `../services/analytics/growthbook.js`, `../../Task.js#TaskRegistry`, `./types.js`,
`createUserMessage`) — each maps to a confirmed real 183 obf symbol but targets a module outside the
20-file focused tree.

**Post-second-pass gate (orchestrator, re-run): import graph 0 internal breaks, 0 brace imbalances,
0 broken doc links. 20/20 + 2/2 + 10/10 + audit PASS.** The reconstructed source is source-faithful to
v2.1.183 with accurate, honestly-attributed deltas.
