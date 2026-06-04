# Symbol Additions — v2.1.156 Auto Memory & Auto Dreaming

These mappings consolidate every obfuscated identifier referenced by the **auto-memory** (Memdir
prompt layer + per-turn extraction subagent) and **auto-dreaming** (per-turn cross-session
consolidation scheduler + filesystem lock + `/dream` routine scaffold) analysis for v2.1.156:
the memdir constants/caps/paths/enablement gates, the `loadMemoryPrompt` dispatcher and its prompt
builders, the `createAutoMemCanUseTool` allow-list and `rm`/`Remove-Item` validators, the
`initExtractMemories`/`runExtraction` closure and its skip-ladder + cursor helpers, the
`initAutoDream`/`autoDreamExtractor` scheduler, the `.consolidate-lock` protocol, the dream task
registry, the three distinct dream prompt surfaces, and the `pendingMemoryUpdates` → `memory_update`
ambient-context loop plus the notification/command UI.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `cli_inner_pretty.js:line`,
and type. Every line was verified by direct read of
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location
(this build is a single pretty-printed bundle — no per-chunk file map).

Cross-validated against:
- **v2.1.156 self-check** — `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (every `cli_inner_pretty.js:<line>` below re-read at source; telemetry/event names confirmed at their
  emit sites; per-decl isolated bodies under `cli_unpack_pretty/decls/{functions,vars}/<id>.js`).
- **v2.1.88 readable TypeScript** (named ground truth) — `/lyz/codespace/3rd/claude-code/src/`:
  `memdir/{memdir,paths,memoryTypes,findRelevantMemories,memoryAge,memoryScan,teamMemPaths,teamMemPrompts}.ts`,
  `services/extractMemories/{extractMemories,prompts}.ts`,
  `services/autoDream/{autoDream,config,consolidationLock,consolidationPrompt}.ts`,
  `tasks/DreamTask/DreamTask.ts`,
  `components/memory/{MemoryUpdateNotification,MemoryFileSelector}.tsx`,
  `components/messages/UserMemoryInputMessage.tsx`, `commands/memory/memory.tsx`.
- **v2.1.142 reference module** (format + readable-name source) —
  `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/31_auto_memory/`.
- **Module docs (this version)** —
  `claude_code_v_2.1.156/analyze/31_auto_memory/{README,memdir_core,auto_dream_runtime,cross_validation}.md`
  (the per-turn extraction runtime is documented within `auto_dream_runtime.md`/`README.md`).

> **Home-index routing note.** Auto-memory and auto-dream are *core features*, so once promoted these
> rows belong in [`symbol_index_core_features.md`](symbol_index_core_features.md) — **not** in
> execution/platform/integration. As of this writing that index carries **no** memory/dream rows
> (confirmed: zero `memory|dream|memdir|consolidat` matches in its module sections), so all rows below
> are net-new additions there.
>
> **One reconciliation flagged.** `SFK` already appears in
> [`symbol_index_core_execution.md`](symbol_index_core_execution.md):175 as
> `isMemoryAutoLoadSection` (memory sub-behavior gate). The v2.1.156 module doc
> (`memdir_core.md` §"Per-agent helpers") gives the same symbol the more specific name
> **`shouldUseFullMemoryForAgent`** — same symbol, same location (145119-145124). When promoting,
> use `shouldUseFullMemoryForAgent` in `symbol_index_core_features.md` and either remove or
> cross-link the older `core_execution` entry so the symbol does not carry two readable names.

> **Readable-name provenance.** Readable names below are taken from (a) the v2.1.88 named TypeScript
> exports where a 1:1 symbol exists, and (b) the v2.1.156 `31_auto_memory` module docs, which already
> settled the readable names used throughout this analysis. Telemetry-gate codenames (`tengu_*`) are
> the bundle's own GrowthBook flag strings, kept verbatim.

---

## Module: Memdir Core — constants, caps, paths, types

> Home index: `symbol_index_core_features.md` (Auto Memory). The memdir prompt-builder layer lives in
> the bundle region ~142000–145200.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aM$` | `MAX_ENTRYPOINT_BYTES` (`25000`) | cli_inner_pretty.js:145142 | constant |
| `B9H` | `MAX_ENTRYPOINT_LINES` (`200`) | cli_inner_pretty.js:143880 | constant |
| `bM$` | `isAutoMemPathExceptEntrypoint` (path guard; also reused as the `memoryDir` scope check) | cli_inner_pretty.js:142188 | function |
| `dM$` | `DIRS_EXIST_GUIDANCE` (plural dir-exists guidance string) | cli_inner_pretty.js:143881 | constant |
| `EUK` | `validateMemoryPath` (override-path security validator) | cli_inner_pretty.js (memdir/paths region) | function |
| `F75` | `TINY_MEM_DIRNAME` (`"tiny_memory"`) | cli_inner_pretty.js:142197 | constant |
| `FVH` | `WHAT_NOT_TO_SAVE` (prose section) | cli_inner_pretty.js:144338 | constant |
| `g75` | `ENTRYPOINT_NAME` (`"MEMORY.md"`; paths chunk) | cli_inner_pretty.js:142198 | constant |
| `JFK` | `parseMemoryType` (returns value if in `MEMORY_TYPES` else `undefined`; graceful legacy) | cli_inner_pretty.js:144158 | function |
| `LFK` | `FRONTMATTER_EXAMPLE_FULL` (full-mode frontmatter example) | cli_inner_pretty.js:144553 | constant |
| `lM6` | `MEMORY_TYPES` (`["user","feedback","project","reference"]`) | cli_inner_pretty.js:144194 | constant |
| `ng` | `isAutoMemPath` (path guard used by canUseTool) | cli_inner_pretty.js:142185 | function |
| `oM6` | `TINY_MEMORY_TYPES` (`["user","feedback","project"]`; drops `reference` from prompt only) | cli_inner_pretty.js:144552 | constant |
| `OX` | `ENTRYPOINT_NAME` alias (`"MEMORY.md"`; memoryTypes chunk, extraction filters) | cli_inner_pretty.js:143879 | constant |
| `p9H` | `DIR_EXISTS_GUIDANCE` (single dir-exists string; also injected into the C04 dream header) | cli_inner_pretty.js:143881 | constant |
| `PFK` | `WHEN_TO_ACCESS_FULL` (full-mode access-guidance prose) | cli_inner_pretty.js:144554 | constant |
| `Q75` | `getAutoMemEntrypointDirname` (dirname selector: `memory` vs `tiny_memory`) | cli_inner_pretty.js:142140 | function |
| `QVH` | `TRUSTING_RECALL` (prose section) | cli_inner_pretty.js:144356 | constant |
| `RgH` | `FRONTMATTER_EXAMPLE_TINY` (tiny-mode frontmatter example) | cli_inner_pretty.js:144369 | constant |
| `TA` | `getAutoMemPath` (memoized; env override → settings → `<base>/projects/<git-slug>/(memory\|tiny_memory)/`) | cli_inner_pretty.js:142211 | function |
| `tM6` | `AUTO_MEM_DISPLAY_NAME` (`"auto memory"`) | cli_inner_pretty.js:145143 | constant |
| `U75` | `AUTO_MEM_DIRNAME` (`"memory"`) | cli_inner_pretty.js:142196 | constant |
| `WFK` | `RECALLED_IN_TOOL_RESULTS` (prose section) | cli_inner_pretty.js:144561 | constant |
| `XFK` | `WHEN_TO_ACCESS_TINY` (tiny-mode access-guidance prose) | cli_inner_pretty.js:144349 | constant |

## Module: Memdir Core — enablement gates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_D` | `isTinyMemoryEnabled` (`tengu_billiard_aviary`, default false) | cli_inner_pretty.js:142142 | function |
| `h88` | `isCcrSentinelDisabled` (`tengu_sepia_cormorant` allowlist + `tengu_umber_petrel` kill-switch) | cli_inner_pretty.js:142123 | function |
| `iM6` | `isBouncerEnabled` (`tengu_ochre_finch`, default false) | cli_inner_pretty.js:144162 | function |
| `M1` | `isAutoMemoryEnabled` (env-disable → simple/remote env → CCR sentinel → `autoMemoryEnabled` setting → default true) | cli_inner_pretty.js:142111 | function |
| `nM$` | `isTeamMemoryEnabled` (`isAutoMemoryEnabled() && tengu_herring_clock`, default false) | cli_inner_pretty.js:144715 | function |
| `S88` | `isExtractModeActive` (`tengu_passport_quail` AND (`!isNonInteractive` OR `tengu_slate_thimble`)) | cli_inner_pretty.js:142131 | function |
| `X3` | `isSimpleSystemPromptEnabled` (memoized; `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env OR model-eligibility) | cli_inner_pretty.js:143872 | function |

## Module: Memdir Core — truncation, dir, telemetry, dispatcher, builders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eM6` | `buildMemoryLines` (default non-tiny behavioral-instructions array; bouncer swap via `isBouncerEnabled`) | cli_inner_pretty.js:144962 | function |
| `g9H` | `ensureMemoryDirExists` (recursive mkdir; swallows errors; non-fatal) | cli_inner_pretty.js:144936 | function |
| `GFK` | `buildCombinedMemoryPromptTiny` (tiny dual-dir: private + team) | cli_inner_pretty.js:144419 | function |
| `hFK` | `buildMemoryPrompt` (per-agent variant; reads entrypoint, truncates, appends `## MEMORY.md`) | cli_inner_pretty.js:145022 | function |
| `IFK` | `buildAgentMemoryPrompt` (delegates to `loadMemoryPrompt` or emits one-line `# auto memory` header) | cli_inner_pretty.js:145131 | function |
| `q68` | `truncateEntrypointContent` (line-truncate to 200, byte-truncate at last `\n` under 25 KB, append WARNING) | cli_inner_pretty.js:144897 | function |
| `q95` | `buildTypesSectionBouncer` (types-section bouncer prompt builder) | cli_inner_pretty.js:144165 | function |
| `RFK` | `getAgentMemoryHeaderOrNull` (standard memory body with `null` memoryDir; dropped from `IFK` path in 2.1.156) | cli_inner_pretty.js:145126 | function |
| `SFK` | `shouldUseFullMemoryForAgent` (gate: `!isAutoMemoryEnabled \|\| tiny \|\| team \|\| simple` → false; see reconciliation note) | cli_inner_pretty.js:145119 | function |
| `sM$` | `loadMemoryPrompt` (5-branch first-match dispatcher: cowork/simple/tiny/team/single + disabled telemetry) | cli_inner_pretty.js:145046 | function |
| `TFK` | `buildSimpleMemoryPrompt` (compact single-block for the simple-system-prompt branch) | cli_inner_pretty.js:144474 | function |
| `UVH` | `maybeSwapToBouncer` (swaps types section to bouncer variant when enabled) | cli_inner_pretty.js:144177 | function |
| `VFK` | `buildDreamPromptTiny` (`/dream`-style offline prune prompt for TINY memory; delete-only mutation) | cli_inner_pretty.js:144513 | function |
| `Yr` | `logMemoryDirCounts` (fire-and-forget readdir counts; emits `tengu_memdir_loaded`) | cli_inner_pretty.js:144945 | function |
| `ZFK` | `buildMemoryLinesTiny` (tiny single-dir; Memory-files + Granularity + Immutability blocks) | cli_inner_pretty.js:144371 | function |

## Module: Extraction Runtime — per-turn extraction subagent

> Home index: `symbol_index_core_features.md` (Auto Memory). Region ~448027–448390 + gate @142131;
> module namespace `lT8` (init/execute/drain/createAutoMemCanUseTool) re-exported as `Ac_` for the stop-hook.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ac_` | extractMemories re-export (stop-hook handle to `lT8`) | cli_inner_pretty.js (~450998) | object |
| `Bg_` | `initExtractMemories` (closure factory: inFlight set, lastMemoryMessageUuid cursor, throttle counter, pendingContext slot) | cli_inner_pretty.js:448255 | function |
| `bg_` | `hasUserProseSince` (≥3-token user-prose gate since cursor) | cli_inner_pretty.js:448133 | function |
| `Cg_` | `hasMemoryWritesSince` (mutual-exclusion detector vs main agent) | cli_inner_pretty.js:448106 | function |
| `Ci6` | `isModelVisibleMessage` (message-visibility predicate for cursor counting) | cli_inner_pretty.js:448089 | function |
| `CT8` | `createMemorySavedMessage` (`memory_saved` system message factory; verb "Saved") | cli_inner_pretty.js:445955 | function |
| `cT8` | `createAutoMemCanUseTool` (shared tool allow-list; 6-rule ladder; reused by dream) | cli_inner_pretty.js:448200 | function |
| `dT8` | `denyAutoMemTool` (deny factory → emits `tengu_auto_mem_tool_denied {tool_name}`) | cli_inner_pretty.js:448145 | function |
| `E04` | `getWrittenFilePath` (resolve written file path from an Edit/Write tool result) | cli_inner_pretty.js:448233 | function |
| `h04` | `drainer` (wired `drainPendingExtraction` reference) | cli_inner_pretty.js:448375 | variable |
| `Ig_` | `countModelVisibleMessagesSince` (cursor count; compaction fallback counts all) | cli_inner_pretty.js:448092 | function |
| `k04` | `isUserProseMessage` (≥3 non-meta text tokens) | cli_inner_pretty.js:448127 | function |
| `lT8` | extractMemories module namespace (init/execute/drain/createAutoMemCanUseTool exports) | cli_inner_pretty.js:448082 | object |
| `mg_` | `extractWrittenPaths` (collect all written `.md` paths from a forked run) | cli_inner_pretty.js:448242 | function |
| `pg_` | `executeExtractMemories` (public entry called by the stop-hook) | cli_inner_pretty.js:448380 | function |
| `Ug_` | `drainPendingExtraction` (60s race drain for `-p`/non-interactive mode; `.unref()`) | cli_inner_pretty.js:448383 | function |
| `ug_` | `validatePosixMemoryRm` (`rm <flags> path.md` only; absolute, `.md`, inside memoryDir, no `-r`/redirects) | cli_inner_pretty.js:448169 | function |
| `V04` | `MIN_USER_PROSE_TOKENS` (`3`) | cli_inner_pretty.js:448388 | constant |
| `xg_` | `validatePowerShellRemoveItem` (`Remove-Item -Path/-LiteralPath path.md` aliases, inside memoryDir) | cli_inner_pretty.js:448152 | function |
| `y04` | `extractor` (wired `executeExtractMemories` reference) | cli_inner_pretty.js:448366 | variable |
| `Z04` | `buildExtractionPrompt` (OS × tiny × team prompt builder for the extraction subagent) | cli_inner_pretty.js:448027 | function |

## Module: Auto-Dream Runtime — scheduler, lock, registry, prompts

> Home index: `symbol_index_core_features.md` (Auto Dreaming). Scheduler region ~447997–448742;
> lock/registry region ~399347–399453.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Y4` | `acquireDreamLock` (read mtime+PID; stale/dead → write PID + touch mtime; re-verify race; return prior mtime) | cli_inner_pretty.js:399357 | function |
| `_Z8` | `readLastConsolidatedAt` (stat `.consolidate-lock` mtime; 0 if absent) | cli_inner_pretty.js:399350 | function |
| `$68` | `isTeamMemServerActive` (team-mem-server fallback for dream opt-in) | cli_inner_pretty.js (team-mem region) | function |
| `ag_` | `getDreamThresholds` (reads `onyx.{minHours,minSessions}` positive-finite else defaults) | cli_inner_pretty.js:448529 | function |
| `As4` | `dreamScheduledTaskScaffold` (new `/dream` routine scaffold, name "dream"; overnight 1–5am, context fork) | cli_inner_pretty.js:532705 | object |
| `AY4` | `registerDreamTask` (register a dream task record in the task channel) | cli_inner_pretty.js:399416 | function |
| `Av` | `isProcessRunning` (PID liveness check for the lock holder) | cli_inner_pretty.js (process util) | function |
| `B04` | `autoDreamExtractor` (closure; gate → scan → lock → fork → track loop; module var init null @448716) | cli_inner_pretty.js:448551 | function |
| `C04` | `buildDreamPrompt` (auto-dream fork prompt; 4 phases Orient/Gather/Consolidate/Prune+index) | cli_inner_pretty.js:448446 | function |
| `eg_` | `trackDreamFilesTouched` (onMessage; collect Edit/Write paths + parse rm/Remove-Item `.md`) | cli_inner_pretty.js:448678 | function |
| `fY4` | `finalizeDreamTask` (mark completed; emit `task_dream`) | cli_inner_pretty.js:399445 | function |
| `Hd_` | `countDailyLogs` (recursive count of `.md` under `<memoryDir>/logs/`) | cli_inner_pretty.js:448700 | function |
| `ig_` | `RECONCILE_AGAINST_CLAUDEMD` (`### Reconcile memories against CLAUDE.md` prompt block) | cli_inner_pretty.js:448516 | constant |
| `JQ6` | `lockPath` (`<memoryDir>/.consolidate-lock`) | cli_inner_pretty.js:399347 | function |
| `KE_` | `HOLDER_STALE_MS` (`3600000`; 1 hr) | cli_inner_pretty.js:399402 | constant |
| `kk$` | `isAutoDreamFeatureToggleable` (`!serverOptIn`→false; else `autoDreamEnabled` ?? `onyx.enabled` ?? team-mem) | cli_inner_pretty.js:448005 | function |
| `LOz` | `DREAM_ROUTINE_CMD` (`"/dream"` routine command string) | cli_inner_pretty.js:533032 | constant |
| `ng_` | `TEAM_DREAM_PHASE_GUIDANCE` (team-scope phase guidance injected into C04) | cli_inner_pretty.js:448514 | constant |
| `og_` | `AUTO_DREAM_SCAN_THROTTLE_MS` (`600000`; 10 min) | cli_inner_pretty.js:448715 | constant |
| `OY4` | `rollbackDreamTask` (mark failed; emit `task_dream_failed`) | cli_inner_pretty.js:399450 | function |
| `p04` | `initAutoDream` (closure factory; captures `lastSessionScanAt=0`; assigns `B04`) | cli_inner_pretty.js:448549 | function |
| `P04` | `getDreamConfig` (reads `tengu_onyx_plover`, default null) | cli_inner_pretty.js:447997 | function |
| `qE_` | `LOCK_FILE_NAME` (`".consolidate-lock"`) | cli_inner_pretty.js:399401 | constant |
| `QT8` | `isAutoDreamServerSideOptIn` (`onyx.enabled \|\| onyx.available \|\| isTeamMemServerActive`) | cli_inner_pretty.js:448000 | function |
| `sg_` | `isAutoDreamEnabled` (`!repl && !subagent && isAutoMemoryEnabled() && isAutoDreamFeatureToggleable()`) | cli_inner_pretty.js:448540 | function |
| `tg_` | `isAutoDreamForcedRun` (returns false; kill-switch placeholder) | cli_inner_pretty.js:448546 | function |
| `U04` | `runAutoDreamCheck` (public entry; delegates to `B04?.(...)`; called by stop-hook) | cli_inner_pretty.js:448709 | function |
| `x04` | `AUTO_DREAM_THRESHOLD_DEFAULTS` (`{minHours:24, minSessions:5}`) | cli_inner_pretty.js:448742 | constant |
| `XQ6` | `isDreamTaskRecord` (type guard for dream task records) | cli_inner_pretty.js:399413 | function |
| `YY4` | `aggregateDreamProgress` (aggregate dream subagent progress across messages) | cli_inner_pretty.js:399432 | function |
| `zY4` | `listSessionsTouchedSince` (session UUIDs from transcripts dir with mtime > threshold) | cli_inner_pretty.js:399395 | function |
| `zZ8` | `releaseDreamLock` (prior mtime 0 → unlink; else rewind mtime; log "rollback failed" on error) | cli_inner_pretty.js:399381 | function |

## Module: Orchestration & UI — stop-hook, ambient memory_update, commands, notifications

> Home index: `symbol_index_core_features.md` (Auto Memory). Stop-hook call sites @450698–450699;
> ambient attachment + UI in regions ~390700–393900, ~412900–413900, ~445700–446800, ~472900–473450.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ak_` | `DreamFileListInlineCap` (notification inline file-list cap = 3) | cli_inner_pretty.js:393839 | constant |
| `BQ_` | `MEMORY_UPDATE_SOURCE_LABELS` (`{dream:"Background memory consolidation"}`) | cli_inner_pretty.js:446768 | constant |
| `Et_` | memory-toggle handler (emits `tengu_memory_toggled`) | cli_inner_pretty.js:473406 | function |
| `G_4` | `UserMemoryInputMessage` (`#`-direct-save renderer) | cli_inner_pretty.js:390749 | function |
| `Nt_` | `/memory` command (always enabled) | cli_inner_pretty.js:473396 | object |
| `pendingMemoryUpdates` | `pendingMemoryUpdates` appState queue (default `[]`) | cli_inner_pretty.js:241518 | variable |
| `qk_` | `randomAck` (`["Got it.","Good to know.","Noted."]`) | cli_inner_pretty.js:390746 | constant |
| `sk_` | `MemoryUpdateNotification` ("Saved N memories"/"Improved N memories" + collapsible file list) | cli_inner_pretty.js:393698 | function |
| `vw4` | `drainPendingMemoryUpdates` (drains queue → `memory_update` attachments) | cli_inner_pretty.js:413803 | function |
| `yt_` | `/toggle-memory` command (`isEnabled:()=>false`, hidden) | cli_inner_pretty.js:473429 | object |
| `yT8` | `AMBIENT_CONTEXT_FOOTER` (do-not-narrate trailer on the `memory_update` system message) | cli_inner_pretty.js:446489 | constant |

---

## Telemetry events (verified at emit sites)

| Event | File:Line | Emitted by |
|-------|-----------|------------|
| `tengu_auto_dream_completed` | cli_inner_pretty.js:448634–448663 | `autoDreamExtractor` completion (cache/output/sessions/daily-logs/files-touched/team) |
| `tengu_auto_dream_failed` | cli_inner_pretty.js:448664–448674 | `autoDreamExtractor` error path (`{phase, error_class}`) |
| `tengu_auto_dream_fired` | cli_inner_pretty.js:448597 | `autoDreamExtractor` fire (`{hours_since, sessions_since, team_memory_enabled}`) |
| `tengu_auto_dream_skipped` | cli_inner_pretty.js:448570–448595 | session-gate (`reason:"sessions"`) / lock (`reason:"lock"`) |
| `tengu_auto_dream_toggled` | cli_inner_pretty.js:472916 | `/memory` dialog auto-dream row (`{enabled, is_first_enable}`) |
| `tengu_auto_mem_tool_denied` | cli_inner_pretty.js:448148 | `denyAutoMemTool` (`{tool_name}`) |
| `tengu_extract_memories_coalesced` | cli_inner_pretty.js:448360 | trailing-run coalesce |
| `tengu_extract_memories_error` | cli_inner_pretty.js:448343 | extraction fork error |
| `tengu_extract_memories_extraction` | cli_inner_pretty.js:448320 | extraction success (token/cache/files/memories + duration) |
| `tengu_extract_memories_skipped_direct_write` | cli_inner_pretty.js:448270 | skip ladder: memory writes since cursor (`{message_count}`) |
| `tengu_extract_memories_skipped_no_prose` | cli_inner_pretty.js:448277 | skip ladder: no user prose since cursor (`{message_count}`) |
| `tengu_memdir_disabled` | cli_inner_pretty.js:145046+ | `loadMemoryPrompt` disabled branch (`{disabled_by_env_var, disabled_by_setting}`) |
| `tengu_memdir_loaded` | cli_inner_pretty.js:144945+ | `logMemoryDirCounts` (`{memory_type}`) |
| `tengu_memory_toggled` | cli_inner_pretty.js:473406 | `/toggle-memory` handler `Et_` |
| `tengu_team_memdir_disabled` | cli_inner_pretty.js:145046+ | `loadMemoryPrompt` disabled branch when `tengu_herring_clock` set |
| `task_dream` | cli_inner_pretty.js:399447 | `finalizeDreamTask` |
| `task_dream_failed` | cli_inner_pretty.js:399452 | `rollbackDreamTask` |

## GrowthBook gate codenames (flag strings, verbatim)

| Flag | Read by | Meaning |
|------|---------|---------|
| `tengu_billiard_aviary` | `isTinyMemoryEnabled` (`_D`) | tiny-memory variant (default false) |
| `tengu_bramble_lintel` | `runExtraction` throttle | turns-since-last-extraction threshold (default 1) |
| `tengu_herring_clock` | `isTeamMemoryEnabled` (`nM$`) | team memory (default false) |
| `tengu_ochre_finch` | `isBouncerEnabled` (`iM6`) | bouncer types-section variant (default false) |
| `tengu_onyx_plover` | `getDreamConfig` (`P04`) | auto-dream `onyx` config object (default null) |
| `tengu_passport_quail` | `isExtractModeActive` (`S88`) | extraction master enable |
| `tengu_sepia_cormorant` | `isCcrSentinelDisabled` (`h88`) | CCR sentinel allowlist |
| `tengu_slate_thimble` | `isExtractModeActive` (`S88`) | extraction-in-interactive override |
| `tengu_umber_petrel` | `isCcrSentinelDisabled` (`h88`) | CCR sentinel kill-switch |

> **Deprecated/removed.** `tengu_kairos_dream` (the old `/dream` skill/slash-command gate, v2.1.142
> `z8A`/`K8A`) has **zero hits** in v2.1.156 — `/dream` is now the scheduled-task routine scaffold
> `dreamScheduledTaskScaffold` (`As4`). See `31_auto_memory/auto_dream_runtime.md` § "/dream delta".

---

## API / attachment anchors (no standalone symbol)

- `cli_inner_pretty.js:450698–450699` — stop-hook call sites:
  `if (!agentId && isExtractModeActive()) Ac_.executeExtractMemories(...)` (extraction, gated) and
  `if (!agentId) runAutoDreamCheck(...)` (auto-dream, gate inside `B04`). Both require main agent (`!agentId`).
- `cli_inner_pretty.js:448639–448649` — `pendingMemoryUpdates` push (`source:"dream"`, summary "consolidated N memory file(s)", paths).
- `cli_inner_pretty.js:445768` — renderer `case "memory_update"` → next-turn `isMeta` system message
  "…updated your memory directory: ${summary}" + `AMBIENT_CONTEXT_FOOTER` (do-not-narrate).
- `cli_inner_pretty.js:399347–399402` — `.consolidate-lock` protocol body (PID + mtime = lastConsolidatedAt; 1 hr stale).

## Unrelated (clarified, NOT Claude Code auto-memory)

- `"memory_20250818"` (cli_inner_pretty.js:606987, 611708) + `client.beta.memory_stores.*` (594173) —
  Anthropic Managed-Agents **memory tool docs strings only**, no call sites. Distinct from the
  memdir/auto-dream system above.
