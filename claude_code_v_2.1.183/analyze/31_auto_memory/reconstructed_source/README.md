# Auto-Memory / Dream — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **entire** auto-memory + dream
> machine **as it exists in Claude Code v2.1.183** — not a delta, the *whole subsystem* — written as
> clean TypeScript organized the way the genuine Anthropic source tree (the v2.1.88 named-TS at
> `/lyz/codespace/3rd/claude-code/src`) organizes it. It restores both the parts that are
> **byte-for-byte carryover** from v2.1.156/v2.1.88 (the `MEMORY.md` entrypoint + caps, the typed-memory
> taxonomy, the per-turn extraction subagent + read-only tool sandbox, the auto-dream scheduler +
> `.consolidate-lock` PID protocol, the consolidation prompt, the `DreamTask` UI registry, the
> identity-free path/age helpers) **and** the **v2.1.172/2.1.181 deltas** (the `CLAUDE_MEMORY_STORES`
> `scope`/`promptIndex` schema, the network `promptIndex` fetch + `<memory>` injection, the rewritten
> scope/mode recall dispatcher `loadMemoryPrompt`, the mounted-store team-enable fix `Nk`, the watcher
> team/user scope-split, the new `tiny_memory` one-fact-per-file mode, the conversation-cached
> SELECT/SYNTHESIZE query-time recall engine, and the verbose-only `memory_saved` file list).
>
> **Why it exists.** The sibling docs in `31_auto_memory/` (`README.md`,
> `team_memory_stores_recall.md`, `status_line_and_misc_delta.md`) are a *verified delta analysis*:
> they document what the v2.1.172/v2.1.181 changes did to the recall path, the team stores, and the
> status line, and defer the unchanged spine to the v2.1.156 baseline. **This directory is the
> source-level companion to that delta analysis** — it restores the full subsystem so you can read the
> implementation top-to-bottom without cross-referencing two version trees. Read this README, then the
> file you care about; jump to the delta docs when you want the *why-it-changed* narrative.
>
> Every behavior here is backed by a v2.1.183 line that was read directly; every reconstructed function
> carries a `// 2.1.183: <readable> = <obf> @<line>` anchor (all line numbers are `cli_inner_pretty.js`)
> so any claim can be re-verified in seconds.

---

## How to read these files (the three evidence tiers)

These files were built — and adversarially verified — under a strict evidence discipline (the full
rules live in [`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   Every symbol, constant, branch, and verbatim string was verified by reading the exact line(s).
   Obfuscated names re-mangle every build, so all were re-derived in this build by anchoring on stable
   strings — env var names, telemetry event names, prompt text, schema literals (e.g. the master gate
   `isAutoMemoryEnabled`→`Iu`@147636, the recall dispatcher `loadMemoryPrompt`→`e0t`@151847). Assets
   corroborate the verbatim text: `extract/assets/feature_gates.json` (`tengu_onyx_plover`,
   `tengu_passport_quail`, `tengu_herring_clock`, `tengu_marble_lark`, `tengu_billiard_aviary`,
   `tengu_coral_fern`, `tengu_moth_copse`, `tengu_bramble_lintel`), `assets/env_vars.json`
   (`CLAUDE_CODE_DISABLE_AUTO_MEMORY`, `CLAUDE_CODE_REMOTE_MEMORY_DIR`, `CLAUDE_MEMORY_STORES`,
   `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`, `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES`).
2. **SCAFFOLD — readable logic & names.** The v2.1.183 delta docs in `31_auto_memory/` (the three files
   linked below) plus the scout dossier `_scout_dossier_auto_memory.md` supplied v2.1.183-specific
   anchors, readable names, and before/after analysis as a jump-start — each claim re-verified against
   the 183 bundle. For the *unchanged-carryover logic + analysis prose*, the v2.1.156 baseline
   (`../../../claude_code_v_2.1.156/analyze/31_auto_memory/`: `memdir_core.md`, `auto_dream_runtime.md`,
   `extract_memories_runtime.md`, `cross_validation.md`) was the secondary scaffold.
3. **CONVENTION + REAL ANCESTOR — file shape & genuine names.** The v2.1.88 named-TS source. **The
   auto-memory/dream subsystem is a real, fully-implemented ancestor in v2.1.88 — it is NOT gated out.**
   So v2.1.88 is both the *shape* template (file layout, `feature('TEAMMEM')`/`feature('KAIROS')` gating
   with `require()`, closure-scoped service state via `initX()`, ESM `.js` import specifiers on `.ts`,
   React/Ink `.tsx` for UI) **and** a genuine readable ancestor — real function names, doc-comments, and
   logic are borrowed where v2.1.183 still does the same thing. **But the topology differs:** the KAIROS
   daily-log paradigm (`getAutoMemDailyLogPath`, `buildAssistantDailyLogPrompt`, "This session is
   long-lived") is **gone** in v2.1.183, replaced by the `tiny_memory` mode; the single-store
   `teamMemorySync` axios client is **rewritten** onto the multistore memory-service REST backend; and
   the single-line `MemoryUpdateNotification` is **superseded** by the summary+file-list renderer.
   **When behavior diverges, the 183 bundle wins;** the 88 file is cited only for the convention/name
   borrowed (each file header discloses the mirror path and marks the divergence inline with
   `// DELTA …`).

---

## File inventory (20 files)

Every reconstructed `.ts`/`.tsx` file restores one slice of the subsystem and opens with a header block
listing its v2.1.183 source regions, its v2.1.88 ancestor/mirror path, the scaffold delta doc used, and
a one-line cross-validation note. The table below summarizes each file's role, its v2.1.88 ancestor, and
its key v2.1.183 anchors. The tree mirrors the genuine source layout (`memdir/`, `services/<svc>/`,
`tasks/<Task>/`, `utils/`, `components/memory/`).

```
reconstructed_source/
├── _conventions.md                         the 3-tier evidence rules + 88→183 unit map + naming registry (read first)
├── README.md                               you are here — index + evidence model + delta/carryover map
│
├── memdir/                                 the recall lane + paths/taxonomy/scan/team-store machinery
├── services/autoDream/                     the background consolidation scheduler + lock + prompt + gate
├── services/extractMemories/               the per-turn extraction subagent + read-only sandbox + prompt
├── services/teamMemorySync/                the watcher scope-split (full) + transport (contract-level)
├── tasks/DreamTask/                        the background-task registry entry that surfaces the dream agent
├── utils/                                  the memory_saved message subset + memory-file detection
└── components/memory/                      the memory_saved REPL renderer
```

| # | File | Role | v2.1.88 ancestor | Key v2.1.183 anchors (`cli_inner_pretty.js`) | Status |
|---|------|------|------------------|------------------------------------------------|--------|
| 1 | `memdir/paths.ts` | The master auto-memory gate + path resolver: `isAutoMemoryEnabled`, the memory base/entrypoint dir, the `tiny_memory`-vs-`memory` dir-name switch, the security path validator, and the memoized `getAutoMemPath`. | `src/memdir/paths.ts` | `isAutoMemoryEnabled`=Iu@147636, `isExtractModeActive`=Nyn@147662, `getMemoryBaseDir`=Wse@147666, `memoryDirName`=XXu@147670 (`"memory"`/`"tiny_memory"`@147729-147730), `isTinyMemoryEnabled`=aH@147673, `validateMemoryPath`=$mi@147676, `isAutoMemPathWritable`=Lkt@147721, `getAutoMemPath`=hm@147746 | **DELTA + CARRYOVER** |
| 2 | `memdir/memdir.ts` | The entrypoint caps + truncation, and `loadMemoryPrompt` — THE recall dispatcher that decides which `# Memory` prompt the model sees per session (cowork short-circuit → promptIndex preamble → tiny/team/scope-mode routing → disabled tail). | `src/memdir/memdir.ts` | caps $w/tie/HTe@150799-150801, `loadMemoryPrompt`=e0t@151847-151949, `buildMemoryLines`=UNr@151756, `tengu_memdir_loaded`@151749, `tengu_memdir_disabled`@151941 | **DELTA + CARRYOVER** |
| 3 | `memdir/memoryTypes.ts` | The memory-type taxonomy + verbatim prompt-section constants (what to save / not save / when to access / how to treat a recalled memory), plus the parallel tiny/one-fact-per-file taxonomy cluster. | `src/memdir/memoryTypes.ts` | `MEMORY_TYPES`=kNr@150905 (4-elem), `TINY_MEMORY_TYPES`=ONr@151559 (3-elem), `parseMemoryType`=dgi@150869, frontmatter ex h_n@150823, compact switch (`tengu_ochre_finch`) NQu@150876 | **DELTA + CARRYOVER** |
| 4 | `memdir/memoryScan.ts` | Memory-directory scanning primitives (split out so extraction can scan without pulling the API-client chain): `scanMemoryFiles`, `formatMemoryManifest`, the promptIndex exclude set, and the tiny-mode densified manifest. | `src/memdir/memoryScan.ts` | `scanMemoryFiles`=C4t@454800, `formatMemoryManifest`=I4t@454838, `buildPromptIndexExcludeSet`=o2p@454766, caps @454858-454862 | **DELTA + CARRYOVER** |
| 5 | `memdir/memoryAge.ts` | Memory staleness / relative-age helpers (a floor-rounded "N days old" caveat triggers staleness reasoning that a raw ISO mtime does not). | `src/memdir/memoryAge.ts` | `memoryAgeDays`=EHd@220191, `memoryFreshnessText`=YWr@220194, `memoryFreshnessNote`=xOi@220203 | **DELTA (removal) + CARRYOVER** |
| 6 | `memdir/findRelevantMemories.ts` | The **query-time** recall engine (distinct from the system-prompt lane): a conversation-cached, two-mode (SELECT / SYNTHESIZE) LLM recall path that surfaces relevant memories as `<system-reminder>` background context. | `src/memdir/findRelevantMemories.ts` | `findRelevantMemories`=ntl@464313 (SELECT), `synthesizeRelevantMemories`=rtl@464417 (SYNTHESIZE), prompts q3p@464524/V3p@464532, cache tIe@230199 | **DELTA (full rebuild)** |
| 7 | `memdir/teamMemPaths.ts` | The team-store schema/parser/gate, the network `promptIndex` fetch helpers, and the team-dir write/containment validators — the v2.1.172 delta core (`CLAUDE_MEMORY_STORES` + the mounted-store team-enable fix). | `src/memdir/teamMemPaths.ts` | store schema bQu@150491, parser `parseMemoryStoresEnv`=Zse@150442, `isPromptIndexPathSafe`=vNr@150438, `fetchStorePromptIndices`=agi@150754, `isTeamMemoryEnabled`=Nk@151098, `getTeamMemPath`=uH@151103 | **DELTA + CARRYOVER** |
| 8 | `memdir/teamMemPrompts.ts` | The five team-memory recall-prompt builders (pure string/array factories) the dispatcher routes to: verbose combined, multistore rw/ro, tiny single-dir, tiny team, and the simplified-system-prompt variant. | `src/memdir/teamMemPrompts.ts` | `buildCombinedMemoryPrompt`=mgi@151194, `buildTeamRecallRwRo`=Agi@151265, `buildTinySingleDirRecall`=bgi@151378, `buildTinyTeamRecall`=Sgi@151426, `buildSimpleSystemPromptRecall`=Egi@151481 | **DELTA + CARRYOVER** |
| 9 | `services/autoDream/autoDream.ts` | The background consolidation scheduler: the gate→scan→lock→fork loop, the forked dream subagent, the daily-log counter, the progress watcher, and the (expanded) fired/completed/failed/skipped telemetry. | `src/services/autoDream/autoDream.ts` | `getDreamThresholds`=w2p@455394, `runAutoDream`=BQa@455415-455544, `tengu_auto_dream_fired`@455467, `_completed`@455522, `_failed`@455539, SCAN_INTERVAL T2p=600000@455582 | **DELTA + CARRYOVER** |
| 10 | `services/autoDream/config.ts` | The leaf "is auto-dream on?" gate (minimal imports so the `/memory` dialog can read it): server-side opt-in (`tengu_onyx_plover` `enabled`/`available` + team-server fallback) × user toggle. | `src/services/autoDream/config.ts` | `getDreamConfig`=yQa@454520, `isAutoDreamServerSideOptIn`=jGn@454523, `isAutoDreamEnabled`=T4t@454528 | **DELTA + CARRYOVER** |
| 11 | `services/autoDream/consolidationLock.ts` | The `.consolidate-lock` PID protocol: mtime-as-`lastConsolidatedAt`, stale-holder takeover, the touched-sessions lister, and the rollback path. | `src/services/autoDream/consolidationLock.ts` | `tryAcquireConsolidationLock`=Cqa@424619, `readLastConsolidatedAt`=h3n@424612, `LOCK_FILE`=BDp=".consolidate-lock"@424663, `HOLDER_STALE_MS`=FDp=3600000@424664 | **DELTA (removal) + CARRYOVER** |
| 12 | `services/autoDream/consolidationPrompt.ts` | The `# Dream: Memory Consolidation` 4-phase prompt builder fed to the forked subagent, plus the team-memory section, the CLAUDE.md-reconcile section, and the two inert (always-false) injection slots. | `src/services/autoDream/consolidationPrompt.ts` | `buildConsolidationPrompt`=PQa@455311, team section H2p@455379, reconcile section v2p@455381, inert slots kQa@455283/LQa@455298 | **DELTA + CARRYOVER** |
| 13 | `services/extractMemories/extractMemories.ts` | The per-turn extraction subagent: a perfect fork of the main conversation, run at end-of-turn, with a closure-scoped state machine, a read-only tool sandbox (`createAutoMemCanUseTool`), the skip-ladder, and the `.md` write carve-out. | `src/services/extractMemories/extractMemories.ts` | `createAutoMemCanUseTool`=zGn@455059, skip events `_skipped_direct_write`@455133/`_extraction`@455183/`_coalesced`@455223, gate `tengu_passport_quail`@455218, `isAutoMemPathMd`=k4t@455056 | **DELTA + CARRYOVER** |
| 14 | `services/extractMemories/prompts.ts` | The extraction subagent's prompt — collapsed from the 88 two-builder pair into one parameterized `buildExtractionPrompt` that defers the taxonomy/how-to-save prose to the system prompt's Memory section. | `src/services/extractMemories/prompts.ts` | `buildExtractionPrompt`=SQa@454882-454927 (3rd arg = `Nk()` team-enabled) | **DELTA (shape)** |
| 15 | `services/teamMemorySync/watcher.ts` | The memory-dir watcher + the v2.1.172 scope-split: parse `CLAUDE_MEMORY_STORES` once, split stores by `scope` into team/user lanes, build a multistore per lane, and drive a debounced push + initial pull each. | `src/services/teamMemorySync/watcher.ts` | scope-split `startMemoryWatcherCore`=uFp@449203, team lane rX@449224, user lane $W@449230, `tengu_personal_mem_sync_started`@449262, `isUserStoreEnabled`=lje@289759 | **DELTA (full rebuild)** |
| 16 | `services/teamMemorySync/index.ts` | The multistore sync **transport** — restored at **contract level only** (public store-client / multistore / push-pull / telemetry surface); the deep delta-compute / 412-conflict / byte-batched-PUT / secret-scan internals are summarized, not reconstructed. | `src/services/teamMemorySync/index.ts` | store client `MemoryServiceBackend`=m_n@150574, multistore builder `buildMultistore`=lAo@448434, `multistorePush`=pAo@448833, `pullMemory`=sAo@447764 | **CONTRACT-LEVEL** |
| 17 | `tasks/DreamTask/DreamTask.ts` | The background-task registry entry that surfaces the otherwise-invisible dream fork in the footer pill ("dreaming") and the Shift+Down dialog: register / add-turn / complete / fail / kill (now via a registry object, with `skipTranscript`). | `src/tasks/DreamTask/DreamTask.ts` | `registerDreamTask`=xqa@424678, `addDreamTurn`=kqa@424694, `completeDreamTask`=Lqa@424707, `isDreamTask`=spo@424675, MAX_TURNS UDp=30@424717 | **DELTA + CARRYOVER** |
| 18 | `utils/messages.ts` | The **memory subset** of the giant `messages.ts`: the `memory_saved` system-message factory, the `memory_update` source-label map, and the `pendingMemoryUpdates` ambient queue (init / dream-push / per-turn drain). | `src/utils/messages.ts` | `createMemorySavedMessage`=YGn@589751 (`subtype:"memory_saved"`@589754), `MEMORY_UPDATE_SOURCE_LABELS`=YSf@590643, `pendingMemoryUpdates` init@294619 / push@455509 / drain Ctl@465836 | **DELTA + CARRYOVER** |
| 19 | `utils/memoryFileDetection.ts` | The predicates that classify whether a path / glob / shell command targets a Claude-managed memory file — consumed by the REPL render path to collapse + badge memory tool-uses as "memory" operations. | `src/utils/memoryFileDetection.ts` | detection module @444832-444922 (predicates i4t/V4n/xWe/HNp + team predicates Nk/vK/Bme), render callers @444971-444985 | **DELTA (removal) + CARRYOVER** |
| 20 | `components/memory/MemoryUpdateNotification.tsx` | The `memory_saved` REPL renderer: the "Saved/Improved N memories · M team memories" summary line + the verbose-only per-file clickable list. | `src/components/memory/MemoryUpdateNotification.tsx` | renderer `Svp`@383399-383440, clickable file Hvp@383444, team segment ANa@382753, dispatch SNa@382871 | **DELTA (verbose gate)** |

> **Note on file boundaries.** The v2.1.183 bundle is a single concatenated file, so several of these
> modules are co-located there (e.g. the `memdir/` recall cluster lives near @150799-151949; the dream
> scheduler + extraction + scan all cluster near @454520-455608; the lock + DreamTask sit at
> @424609-424742). The split into the directory layout above follows the v2.1.88 module conventions;
> each file's header discloses where its content physically sits in the bundle. The behavior is faithful
> to those exact lines — only the grouping is a convention choice.

---

## How to read the anchors

Every top-level function/const carries an anchor comment tying it to the live bundle:

```ts
// 2.1.183: loadMemoryPrompt = e0t @cli_inner_pretty.js:151847   (THE recall dispatcher)
export async function loadMemoryPrompt(...) { … }
```

Read it as: *the readable name `loadMemoryPrompt` is the v2.1.183 obfuscated symbol `e0t`, defined at
line 151847 of `cli_inner_pretty.js`*. To re-verify any claim, open that line in the bundle. Divergences
from the v2.1.88 ancestor are flagged inline with `// DELTA v2.1.172: …` / `// DELTA v2.1.181: …`
(plus the 183 line and, for team-store / status-line deltas, a `// see team_memory_stores_recall.md §N`
cross-link). Each file header also lists its *covered regions* (the line ranges it restores), its
*88 ancestor mirror path*, the *scaffold doc* used, and a *cross-val* note (exactly what was re-read in
the 183 bundle). Because every symbol is line-anchored in-file, **each reconstructed file is itself the
authoritative, line-anchored symbol map for its slice** — per-file lookups don't need the central index.

---

## What NOT to re-read (out of scope)

Two adjacent subsystems are intentionally **not** reconstructed here — they look like "memory" but are
distinct machines documented elsewhere:

1. **`SessionMemory` = compact.** `services/SessionMemory/*` and
   `services/compact/sessionMemoryCompact.ts` are the **compact** session-summary memory — a different
   subsystem documented under `07_compact/`. The `session_memory` arm that the v2.1.88
   `memoryFileDetection` had was **removed** from the 183 detection module (only `session_transcript`
   survives there); the rest moved to compact. Do not re-derive it here.
2. **The deep `teamMemorySync` transport.** `services/teamMemorySync/index.ts` is restored at
   **contract level only** — the public store-client / multistore / push-pull / telemetry surface is
   anchored, but the delta-compute / 412-conflict loop / byte-batched-PUT splits / tombstone bookkeeping
   / `secretScanner.ts` are **carryover transport the delta docs deliberately do not re-derive**. For
   the *why* of the watcher scope-split and the multistore lanes, read
   [`../team_memory_stores_recall.md`](../team_memory_stores_recall.md) §5; do not re-document the wire
   protocol.

---

## Verification & manifests

- **Conventions:** the three-tier evidence rules, the 88→183 unit map, the anchor-comment style, and the
  naming registry live in [`_conventions.md`](./_conventions.md) (read it first).
- **Cross-validation report:** the build method, the 20-unit recon→adversarial-verify pipeline
  (20/20 PASS, 0 FAIL), the coherence pass, the surfaced v2.1.88→v2.1.183 deltas, and the residual /
  open-items list are in [`_cross_validation_report.md`](./_cross_validation_report.md). The final
  authoritative import-graph + brace re-check is appended there by the orchestrator.
- **Symbol manifest:** new symbols surfaced here land in
  [`../../00_overview/symbol_additions_v2_1_183_auto_memory.md`](../../00_overview/symbol_additions_v2_1_183_auto_memory.md);
  each reconstructed `.ts` file is itself a line-anchored symbol map for its slice.

For *what changed* between v2.1.156 and v2.1.183 specifically — the team-store recall redesign, the
status-line verbose gate, and the misc deltas — read the delta docs one level up:
[`../README.md`](../README.md), [`../team_memory_stores_recall.md`](../team_memory_stores_recall.md),
[`../status_line_and_misc_delta.md`](../status_line_and_misc_delta.md).

---

## Suggested reading order

1. **`memdir/paths.ts`** — is the subsystem even on? (the `isAutoMemoryEnabled` gate chain) and where do
   the memory files live (`memory` vs the new `tiny_memory` dir).
2. **`memdir/memdir.ts`** — the centerpiece: `loadMemoryPrompt`, the per-session recall dispatcher that
   routes by tiny-mode, team-enable, and store scope/mode.
3. **`memdir/{memoryTypes,teamMemPaths,teamMemPrompts}.ts`** — the taxonomy the prompt teaches, the
   team-store schema + promptIndex fetch, and the five recall-prompt builders the dispatcher fans out to.
4. **`services/extractMemories/{extractMemories,prompts}.ts`** — the per-turn extraction subagent, its
   read-only sandbox, and the skip-ladder that decides when a turn produces a memory write.
5. **`services/autoDream/{config,autoDream,consolidationLock,consolidationPrompt}.ts`** — the background
   consolidation scheduler, the `.consolidate-lock` protocol, and the `# Dream` prompt.
6. **`tasks/DreamTask/DreamTask.ts`** — how the dream fork surfaces in the UI.
7. **`memdir/{memoryScan,memoryAge,findRelevantMemories}.ts`** — the scan/age primitives and the
   query-time SELECT/SYNTHESIZE recall engine (a separate lane from the system-prompt recall).
8. **`services/teamMemorySync/{watcher,index}.ts`** — the watcher scope-split and (contract-level) the
   multistore transport it drives.
9. **`utils/{messages,memoryFileDetection}.ts`, `components/memory/MemoryUpdateNotification.tsx`** — the
   `memory_saved` message + the render/badge path, read as needed.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored symbol
> map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_auto_memory.md](../../00_overview/symbol_additions_v2_1_183_auto_memory.md) — the consolidated v2.1.183 auto-memory symbol table (delta symbols **plus** the full-reconstruction additions surfaced here).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — Auto-Memory / Dream is a core-feature module (alongside Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — the GrowthBook gate lookup, settings schema, and the env-var resolution behind the path gates.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — the REPL render/badge path and the `/memory` dialog surfaces.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `isAutoMemoryEnabled` (`Iu`, cli_inner_pretty.js:147636) — the master gate → `memdir/paths.ts`.
- `loadMemoryPrompt` (`e0t`, cli_inner_pretty.js:151847) — the recall dispatcher → `memdir/memdir.ts`.
- `isTinyMemoryEnabled` (`aH`, cli_inner_pretty.js:147673, `tengu_billiard_aviary`) + `memoryDirName` (`XXu`, cli_inner_pretty.js:147670, `"memory"`/`"tiny_memory"`@147729-147730) — the tiny-memory mode → `memdir/paths.ts`.
- `isTeamMemoryEnabled` (`Nk`, cli_inner_pretty.js:151098) + the store schema (`bQu`, cli_inner_pretty.js:150491) + `fetchStorePromptIndices` (`agi`, cli_inner_pretty.js:150754) — the team-store / promptIndex core → `memdir/teamMemPaths.ts`.
- `findRelevantMemories` (`ntl`, cli_inner_pretty.js:464313) / `synthesizeRelevantMemories` (`rtl`, cli_inner_pretty.js:464417) — the SELECT/SYNTHESIZE query-time recall → `memdir/findRelevantMemories.ts`.
- `runAutoDream` (`BQa`, cli_inner_pretty.js:455415) with `tengu_auto_dream_fired`@455467 / `_failed`@455539 — the consolidation scheduler → `services/autoDream/autoDream.ts`.
- `createAutoMemCanUseTool` (`zGn`, cli_inner_pretty.js:455059) — the extraction read-only sandbox → `services/extractMemories/extractMemories.ts`.
- `startMemoryWatcherCore` (`uFp`, cli_inner_pretty.js:449203) — the watcher scope-split → `services/teamMemorySync/watcher.ts`.
- `createMemorySavedMessage` (`YGn`, cli_inner_pretty.js:589751) — the `memory_saved` factory → `utils/messages.ts`; renderer `Svp`@383399 → `components/memory/MemoryUpdateNotification.tsx`.
