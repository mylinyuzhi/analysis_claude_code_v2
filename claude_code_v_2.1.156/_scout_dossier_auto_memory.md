# Scout Dossier — Auto Memory + Auto Dreaming (v2.1.156)

Working scratch file for building `claude_code_v_2.1.156/analyze/31_auto_memory/`.
All anchors below were **verified by direct read** of the bundle, not inferred.

## Source layout

- BUNDLE (single ~650K-line pretty-printed file): `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  - All citations are stable `cli_inner_pretty.js:<line>` references (no per-chunk file map; this build is one bundle).
  - Per-decl isolated bodies live under `extract/cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js`.
- 2.1.88 READABLE GROUND TRUTH (named TypeScript): `/lyz/codespace/3rd/claude-code/src/`
  - `memdir/{memdir,paths,memoryTypes,findRelevantMemories,memoryAge,memoryScan,teamMemPaths,teamMemPrompts}.ts`
  - `services/extractMemories/{extractMemories,prompts}.ts`
  - `services/autoDream/{autoDream,config,consolidationLock,consolidationPrompt}.ts`
  - `tasks/DreamTask/DreamTask.ts`, `components/memory/{MemoryUpdateNotification,MemoryFileSelector}.tsx`, `components/messages/UserMemoryInputMessage.tsx`, `commands/memory/memory.tsx`
- 2.1.142 REFERENCE DOCS (format + readable-name source): `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/31_auto_memory/`

## CONVENTIONS (from CLAUDE.md — every doc MUST follow)

- **Language: English only.**
- **Module docs must NOT contain symbol mapping tables.** Use list format only: `` - `readableName` (`obf`) — description (cli_inner_pretty.js:line) ``. Mapping TABLES live ONLY in `00_overview/symbol_additions_v2_1_156_auto_memory.md` and the four `symbol_index_*.md`.
- **Code snippets** must use the 4-part dual-version block:
  ```
  // ============================================
  // ReadableName - Brief description
  // Location: cli_inner_pretty.js:line-range
  // ============================================

  // ORIGINAL (for source lookup):
  <obfuscated code>

  // READABLE (for understanding):
  <deobfuscated code>

  // Mapping: obf→readable, A→param, ...
  ```
  Only ONE `====` block at the top of each snippet. No `====` around ORIGINAL/READABLE labels.
- **Deep analysis** for every key decision/algorithm: What it does / How it works (step-by-step) / Why this approach (trade-offs) / Key insight. No surface-level descriptions.
- Every conclusion must cite a `cli_inner_pretty.js:<line>` you can point to, and be cross-validated against 2.1.88 TS and/or the 2.1.142 reference.
- Relative links from `31_auto_memory/<doc>.md` to overview: `../00_overview/<file>.md`. To the other tree: `../../claude_code_v_2.1.142/analyze/...`.

---

## A. MEMDIR CORE — prompt-builder layer (region ~142000–145200)

### Constants
- `ENTRYPOINT_NAME` (`g75`) = `"MEMORY.md"` — cli_inner_pretty.js:142198 (paths chunk)
- `ENTRYPOINT_NAME` alias (`OX`) = `"MEMORY.md"` — cli_inner_pretty.js:143879 (memoryTypes chunk; used by memoryTypes/extraction filters)
- `MAX_ENTRYPOINT_LINES` (`B9H`) = 200 — cli_inner_pretty.js:143880
- `MAX_ENTRYPOINT_BYTES` (`aM$`) = 25000 — cli_inner_pretty.js:145142
- `DIR_EXISTS_GUIDANCE` (`p9H`) — string "This directory already exists…" — cli_inner_pretty.js:143881 (also injected into C04 dream prompt header)
- `AUTO_MEM_DISPLAY_NAME` (`tM6`) = `"auto memory"` — cli_inner_pretty.js:145143
- dirname consts: `"memory"` (`U75`)@142196, `"tiny_memory"` (`F75`)@142197

### Enablement gates
- `isAutoMemoryEnabled` (`M1`) — cli_inner_pretty.js:142111–142122 — priority chain: env `CLAUDE_CODE_DISABLE_AUTO_MEMORY` → simple/remote env → CCR sentinel → settings `autoMemoryEnabled` → default true. (NOTE: confirm exact ordering by reading the body.)
- `isCcrSentinelDisabled` (`h88`) — cli_inner_pretty.js:142123–142130 — `tengu_sepia_cormorant` allowlist + `tengu_umber_petrel` kill-switch.
- `isExtractModeActive` (`S88`) — cli_inner_pretty.js:142131–142134 — `tengu_passport_quail` AND (`!R6()` interactive OR `tengu_slate_thimble`). (`R6` = isNonInteractive.)
- `isTinyMemoryEnabled` (`_D`) — cli_inner_pretty.js:142142–142144 — `tengu_billiard_aviary` (default false).
- `isSimpleSystemPromptEnabled` (`X3`) — cli_inner_pretty.js:143872–143878 — memoized; env `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` OR model-eligibility.
- `isBouncerEnabled` (`iM6`) — cli_inner_pretty.js:144162–144164 — `tengu_ochre_finch` (default false).
- team gate `isTeamMemoryEnabled` (`nM$`) — cli_inner_pretty.js:144715–144718 — `M1() && tengu_herring_clock` (default false).

### Paths
- `getAutoMemPath` (`TA`) — cli_inner_pretty.js:142211+ — memoized; env override → settings → `<base>/projects/<git-root-slug>/(memory|tiny_memory)/`. dirname selector `Q75`@142140.
- `isAutoMemPath` (`ng`)@142185, `isAutoMemPathExceptEntrypoint` (`bM$`)@142188 — path guards used by canUseTool.
- `validateMemoryPath` — override-path security validator (find in paths chunk; 2.1.88 = `paths.ts`).

### Truncation / dir / telemetry
- `truncateEntrypointContent` (`q68`) — cli_inner_pretty.js:144897–144935 — line-truncate to 200, then byte-truncate at last `\n` under 25 KB, append contextual WARNING naming which cap fired.
- `ensureMemoryDirExists` (`g9H`) — cli_inner_pretty.js:144936–144944 — recursive mkdir, swallows errors (debug log), non-fatal.
- `logMemoryDirCounts` (`Yr`) — cli_inner_pretty.js:144945–144960 — fire-and-forget readdir counts; emits `tengu_memdir_loaded`. Called as `Yr(path, {memory_type:"auto"|"team"})` in the dispatcher.

### Prompt builders
- `buildMemoryLines` (`eM6`) — cli_inner_pretty.js:144962–145021 — DEFAULT non-tiny behavioral-instructions array (no MEMORY.md content). Bouncer swap via `iM6()`.
- `buildMemoryPrompt` (`hFK`) — cli_inner_pretty.js:145022–145044 — per-agent variant; reads entrypoint, truncates, appends `## MEMORY.md`.
- `buildMemoryLinesTiny` (`ZFK`) — cli_inner_pretty.js:144371–144417 — tiny single-dir; adds "## Memory files" + Granularity + Immutability blocks; uses 3-type tiny array.
- `buildCombinedMemoryPromptTiny` (`GFK`) — cli_inner_pretty.js:144419–144473 — tiny dual-dir (private+team).
- `buildSimpleMemoryPrompt` (`TFK`) — cli_inner_pretty.js:144474–144512 — compact single-block for simple-system-prompt branch.
- `buildDreamPromptTiny` / pruning (`VFK`) — cli_inner_pretty.js:144513–144540 — `/dream`-style offline prune prompt for TINY memory: immutability, delete-only mutation, stale/duplicate/good decision matrix. (Distinct from the auto-dream fork prompt C04.)
- `buildCombinedMemoryPrompt` (`A95.buildCombinedMemoryPrompt`) — external team-prompts namespace `A95` (loaded @145161) — non-tiny team dual-dir.
- types-section bouncer builder `q95`@144165, `maybeSwapToBouncer` `UVH`@144177.

### Memory types
- `MEMORY_TYPES` (`lM6`) = `["user","feedback","project","reference"]` — cli_inner_pretty.js:144194
- `TINY_MEMORY_TYPES` (`oM6`) = `["user","feedback","project"]` — cli_inner_pretty.js:144552 (drops `reference` from prompt only)
- `parseMemoryType` (`JFK`) — cli_inner_pretty.js:144158–144161 — returns value if in `lM6` else undefined (graceful legacy).
- prose sections: `WHAT_NOT_TO_SAVE` (`FVH`)@144338, `WHEN_TO_ACCESS` tiny (`XFK`)@144349 / full (`PFK`)@144554, `TRUSTING_RECALL` (`QVH`)@144356, `RECALLED_IN_TOOL_RESULTS` (`WFK`)@144561, frontmatter examples `RgH`@144369 / `LFK`@144553.

### Dispatcher — `loadMemoryPrompt` (`sM$`) — cli_inner_pretty.js:145046–145118
First-match-wins branch order (verified by read of 145046–145118):
1. **cowork-verbatim**: `M1()` AND `CLAUDE_COWORK_MEMORY_GUIDELINES` set → `# auto memory\n${env}` verbatim.
2. **simple non-tiny**: `M1() && !_D() && X3(model)` → `TFK(...)`.
3. **tiny**: `M1() && _D()` → team? `GFK(autoDir, teamDir, …)` : `ZFK("auto memory", autoDir, …).join("\n")`.
4. **team non-tiny**: `dVH.isTeamMemoryEnabled()` → `A95.buildCombinedMemoryPrompt(extra, skipIndex)`.
5. **single auto**: `M1()` → `eM6("auto memory", autoDir, extra, skipIndex).join("\n")`.
6. **disabled**: emit `tengu_memdir_disabled` `{disabled_by_env_var, disabled_by_setting}`; if `tengu_herring_clock` also emit `tengu_team_memdir_disabled`; return null.
- Every enabled branch first `await g9H(dir)` then `Yr(dir,{memory_type})` then `SH("memory_load_prompt")`.
- Per-agent helpers right after: `SFK`@145119 (gate: `!M1() && !_D() && !team && !X3()`), `RFK`@145126 (agent-memory header via `eM6(tM6,null,…)`), `IFK`@145131 (delegates to `sM$` or emits one-line "# auto memory" + "Memory directory: `path`" + optional `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES`).

### Cross-validation (2.1.88)
- `memdir/memdir.ts` (loadMemoryPrompt, buildMemoryPrompt, truncateEntrypointContent, ensureMemoryDirExists, ENTRYPOINT_NAME, caps), `memdir/paths.ts` (getAutoMemPath, isAutoMemoryEnabled, validateMemoryPath), `memdir/memoryTypes.ts` (MEMORY_TYPES, parseMemoryType, TYPES sections).

---

## B. EXTRACT-MEMORIES RUNTIME — per-turn extraction subagent (region ~448027–448390 + gate @142131)

- Module/namespace (`lT8`) — exports init/execute/drain/createAutoMemCanUseTool — cli_inner_pretty.js:448082–448088. Re-exported as `Ac_` (@~450998) for the stop-hook.
- `initExtractMemories` (`Bg_`) — cli_inner_pretty.js:448255–448378 — closure factory. State: `H`=inFlightExtractions Set, `$`=lastMemoryMessageUuid cursor, `K`=inProgress, `_`=turnsSinceLastExtraction throttle counter, `z`=pendingContext (trailing-run coalesce slot).
- `runExtraction` (inner `A`) — cli_inner_pretty.js:448262–448351 — skip ladder + throttle + fork.
- `executeExtractMemoriesImpl` (inner `Y`) — cli_inner_pretty.js:448353–448364 — gate + coalesce.
- `executeExtractMemories` (`pg_`) — cli_inner_pretty.js:448380–448381; `drainPendingExtraction` (`Ug_`) — cli_inner_pretty.js:448383–448384 (60s race, `.unref()`).
- wired `extractor` (`y04`)@448366, `drainer` (`h04`)@448375.

### canUseTool allow-list — `createAutoMemCanUseTool` (`cT8`) — cli_inner_pretty.js:448200–448231
Rule ladder (precedence): (1) memory toggled off (`XR()`) → DENY all; (2) REPL → ALLOW; (3) Read/Grep/Glob → ALLOW; (4) Bash/PowerShell → read-only ALLOW, OR `rm`/`Remove-Item` of `*.md` inside memoryDir (validated) ALLOW, else DENY; (5) Edit/Write → tiny-mode (`_D()`) denies Edit (delete+recreate), else ALLOW only if path inside memoryDir (`bM$`); (6) default DENY.
- deny factory `denyAutoMemTool` (`dT8`)@448145 → emits `tengu_auto_mem_tool_denied` `{tool_name}`.
- `validatePosixMemoryRm` (`ug_`)@448169–448198 — `rm <flags> path.md` only; absolute, `.md`, inside memoryDir, no `-r`, no redirects/envvars.
- `validatePowerShellRemoveItem` (`xg_`)@448152–448167 — `Remove-Item -Path/-LiteralPath path.md` aliases, inside memoryDir.

### Cursor helpers
- `isModelVisibleMessage` (`Ci6`)@448089, `countModelVisibleMessagesSince` (`Ig_`)@448092 (compaction fallback = count all), `hasMemoryWritesSince` (`Cg_`)@448106 (mutual-exclusion vs main agent), `isUserProseMessage` (`k04`)@448127 (≥3 tokens), `hasUserProseSince` (`bg_`)@448133, `getWrittenFilePath` (`E04`)@448233, `extractWrittenPaths` (`mg_`)@448242.
- `MIN_USER_PROSE_TOKENS` (`V04`) = 3 — cli_inner_pretty.js:448388.

### Skip ladder (runExtraction, in order)
1. `hasMemoryWritesSince` → emit `tengu_extract_memories_skipped_direct_write` `{message_count}` (cursor still advances) — @448266–448270.
2. `!hasUserProseSince` → emit `tengu_extract_memories_skipped_no_prose` `{message_count}` (cursor advances) — @448273–448277.
3. throttle: `turnsSinceLastExtraction < tengu_bramble_lintel` (default 1) → skip silently — @448281–448285.
4. else fork.

### Prompt builder — `buildExtractionPrompt` (`Z04`) — cli_inner_pretty.js:448027–448071
Branches: OS (POSIX vs Windows tool names + `rm` vs `Remove-Item`), tiny (`_D`: no Edit, "delete-and-recreate", parallel single-turn) vs full ("turn 1 read, turn 2 write"), team (adds "scope guidance, "). Distinctive lines: "You are now acting as the memory extraction subagent. Analyze the most recent ~${N} messages…"; "If nothing is worth saving, output only 'Nothing to save.'".

### Save message
- `createMemorySavedMessage` (`CT8`) — cli_inner_pretty.js:445955–445963 — `{type:"system", subtype:"memory_saved", writtenPaths, timestamp, uuid, isMeta:false}`. `teamCount` patched post-hoc.

### Telemetry (this region)
`tengu_auto_mem_tool_denied`@448148, `tengu_extract_memories_skipped_direct_write`@448270, `tengu_extract_memories_skipped_no_prose`@448277, `tengu_extract_memories_extraction`@448320 (token/cache/files/memories counts + duration), `tengu_extract_memories_error`@448343, `tengu_extract_memories_coalesced`@448360.

### Cross-validation (2.1.88)
`services/extractMemories/extractMemories.ts` (executeExtractMemories@598, initExtractMemories@296, drainPendingExtraction@611, createAutoMemCanUseTool@171, hasMemoryWritesSince@121) + `services/extractMemories/prompts.ts` (the two builders merged into Z04).

---

## C. AUTO-DREAM RUNTIME — per-turn cross-session scheduler (region ~447997–448742 + lock @399347–399453)

### Gates / config / thresholds
- `getDreamConfig` (`P04`) — cli_inner_pretty.js:447997–447999 — reads `tengu_onyx_plover` (default null).
- `isAutoDreamServerSideOptIn` (`QT8`) — cli_inner_pretty.js:448000–448004 — `onyx.enabled===true || onyx.available===true || $68()` (team-mem-server fallback).
- `isAutoDreamFeatureToggleable` (`kk$`) — cli_inner_pretty.js:448005–448011 — if `!QT8()` false; else user setting `autoDreamEnabled` ?? `onyx.enabled` ?? `$68()`.
- `getDreamThresholds` (`ag_`) — cli_inner_pretty.js:448529–448538 — reads `onyx.{minHours,minSessions}` (positive finite) else `x04` defaults.
- `AUTO_DREAM_THRESHOLD_DEFAULTS` (`x04`) = `{minHours:24, minSessions:5}` — cli_inner_pretty.js:448742.
- `AUTO_DREAM_SCAN_THROTTLE_MS` (`og_`) = 600000 (10 min) — cli_inner_pretty.js:448715.
- `isAutoDreamEnabled` (closure `sg_`) — cli_inner_pretty.js:448540–448545 — `!$b() && !d6() && M1() && kk$()`.
- `isAutoDreamForcedRun` (`tg_`) — cli_inner_pretty.js:448546–448548 — returns false (kill-switch placeholder).

### Scheduler
- `initAutoDream` (`p04`) — cli_inner_pretty.js:448549–448677 — closure factory; captures `lastSessionScanAt = 0`; assigns `B04`.
- `autoDreamExtractor` (closure `B04`) — cli_inner_pretty.js:448551–448676 — the gate→scan→lock→fork→track loop.
- `runAutoDreamCheck` / public entry (`U04`) — cli_inner_pretty.js:448709–448711 — delegates to `B04?.(...)`. Called by stop-hook.
- `B04` module var initialised null @448716 (in the require/init block).

#### autoDreamExtractor logic walk (verified)
1. read thresholds `ag_()`, forced `tg_()`; early-return if `!forced && !sg_()` (@448552–448554).
2. `await _Z8()` lastConsolidatedAt; `hoursSince = (Date.now()-mtime)/3.6e6` (@448556–448561).
3. time-gate: `!forced && hoursSince < minHours` → return (@448563).
4. scan-throttle: `now - lastSessionScanAt < og_(600000)` → return + debug log; else advance scan ts (@448564–448569).
5. session-gate: `listSessionsTouchedSince(mtime)` minus current session; if `< minSessions` → `tengu_auto_dream_skipped {reason:"sessions", session_count, min_required}` (@448570–448581).
6. lock: forced→use prior mtime; else `await _Y4()`; null → `tengu_auto_dream_skipped {reason:"lock"}` (@448583–448595).
7. fire: `tengu_auto_dream_fired {hours_since, sessions_since, team_memory_enabled}`; register task `AY4`; memoryDir=`TA()`, transcriptDir; `await Hd_(memoryDir)` daily-log count; build extra context; select prompt (tiny→`VFK`, else `C04(memoryDir, transcriptDir, extra, teamEnabled)`); `await xZ({... canUseTool: cT8(memoryDir), onMessage: eg_(...)})` runForkedAgent (@448597–448633).
8. completion: `fY4` finalize; count `filesTouched`; if >0 → `CT8(files){verb:"Improved"}` system msg + push `pendingMemoryUpdates {source:"dream", summary:"consolidated N memory file(s)", paths}`; emit `tengu_auto_dream_completed {cache_read, cache_created, output, sessions_reviewed, daily_logs_found, files_touched_count, team_memory_enabled}` (@448634–448663). VERIFIED.
9. error: aborted→log/return; else `tengu_auto_dream_failed {phase, error_class}`; if fork-phase: `OY4` rollback task + `await zZ8(priorMtime)` lock rewind (@448664–448674).

### Filesystem lock protocol (region 399347–399402) — VERIFIED vs 2.1.88 consolidationLock.ts
- `lockPath` (`JQ6`)@399347 = `<memoryDir>/.consolidate-lock`.
- `LOCK_FILE_NAME` (`qE_`) = `".consolidate-lock"` — cli_inner_pretty.js:399401.
- `HOLDER_STALE_MS` (`KE_`) = 3600000 (1 hr) — cli_inner_pretty.js:399402.
- `readLastConsolidatedAt` (`_Z8`)@399350 — stat mtime, 0 if absent (mtime IS lastConsolidatedAt).
- `acquireDreamLock` (`_Y4`)@399357 — read mtime+PID; if `now-mtime < KE_` AND PID live (`Av(pid)`) → null (blocked); else write PID + touch mtime=now; re-verify (race) → null; return prior mtime.
- `releaseDreamLock` / rollback (`zZ8`)@399381 — prior mtime 0 → unlink; else rewind mtime to prior; on failure log "rollback failed — next trigger delayed to minHours" (@399392).
- `listSessionsTouchedSince` (`zY4`)@399395 — session UUIDs from transcripts dir with mtime > threshold.
- 2.1.88 truth: `LOCK_FILE='.consolidate-lock'`, `HOLDER_STALE_MS=60*60*1000`, body=PID, mtime=lastConsolidatedAt, PID-reuse guard. **1:1 match.**

### Task registry (region 399413–399453)
- `isDreamTaskRecord` (`XQ6`)@399413, `registerDreamTask` (`AY4`)@399416, `aggregateDreamProgress` (`YY4`)@399432, `finalizeDreamTask` (`fY4`)@399445 (emits `task_dream`), `rollbackDreamTask` (`OY4`)@399450 (emits `task_dream_failed`).

### Dream prompts (THREE distinct surfaces — keep separate!)
1. **Auto-dream fork prompt** `buildDreamPrompt` (`C04`) — cli_inner_pretty.js:448446–448512 — header "# Dream: Memory Consolidation / You are performing a dream — a reflective pass…"; injects `p9H` (dir-exists guidance) + transcript-dir grep caveat + (if team) `ng_`. 4 phases: **Orient** (ls dir, read MEMORY.md, skim topics, `ls -R logs/`), **Gather recent signal** (logs/YYYY/MM/DD, drifted memories, narrow transcript grep), **Consolidate** (write/update topic files, convert relative→absolute dates, delete contradicted), **Prune and index** (MEMORY.md <200 lines & <25KB, one-line entries, remove stale, demote verbose) + `### Reconcile memories against CLAUDE.md` (`ig_`@448516).
   - `TEAM_DREAM_PHASE_GUIDANCE` (`ng_`)@448514, `RECONCILE_AGAINST_CLAUDEMD` (`ig_`)@448516.
2. **Tiny pruning prompt** `VFK`@144513 (memdir core region) — immutable memories, delete-only.
3. **`/dream` scheduled-task scaffold** `As4` (name "dream") — cli_inner_pretty.js:532705–532744 — "Nightly reflection and consolidation. Runs overnight (1–5am local) via the scheduled task scaffold. context: fork". 4 phases: Preparation / Topics / Rules & Learnings (`learnings/<slug>.md`) / Prioritization & Pruning. This is the **NEW form of `/dream`** (see delta below).

### Other dream helpers
- `trackDreamFilesTouched` (onMessage `eg_`)@448678 — collects Edit/Write file_paths + parses rm/Remove-Item `.md` from the dream subagent.
- `countDailyLogs` (`Hd_`)@448700 — recursive count of `.md` under `<memoryDir>/logs/`.
- canUseTool: reuses extraction's `createAutoMemCanUseTool` (`cT8`).

### Cross-validation (2.1.88)
`services/autoDream/autoDream.ts` (scheduler+gates), `config.ts` (isAutoDreamEnabled: setting ?? onyx.enabled), `consolidationLock.ts` (lock — 1:1), `consolidationPrompt.ts` (C04 phases), `tasks/DreamTask/DreamTask.ts` (registry).

---

## D. ORCHESTRATION + SURFACES

### Stop-hook (the per-turn writer caller) — VERIFIED call sites @450698–450699
```
if (!z.agentId && S88()) Ac_.executeExtractMemories(M, z.appendSystemMessage);   // extraction (gated)
if (!z.agentId) U04(M, z.appendSystemMessage);                                    // auto-dream (gate inside)
```
- extraction gated on `S88()` (isExtractModeActive); auto-dream called unconditionally (its gates are inside B04). Both require `!agentId` (main agent only).

### memory_update ambient-context attachment
- `pendingMemoryUpdates` appState queue (default `[]`) — init @241518.
- `drainPendingMemoryUpdates` (`vw4`)@413803–413816 — drains queue → `memory_update` attachments.
- `MEMORY_UPDATE_SOURCE_LABELS` (`BQ_`)@446768 = `{dream: "Background memory consolidation"}`.
- renderer `case "memory_update"`@445768 — emits an `isMeta` next-turn system message "…updated your memory directory: ${summary}" (ambient, do-not-narrate).

### Notifications / UI (secondary — fold into runtime docs, don't over-document)
- `MemoryUpdateNotification` (`sk_`)@393698 — "Saved N memories"/"Improved N memories" + collapsible file list (inline cap 3, `ak_`@393839). verb from system msg ("Saved" extraction / "Improved" dream).
- `randomAck` (`qk_`)@390746 = ["Got it.","Good to know.","Noted."]; `UserMemoryInputMessage` (`G_4`)@390749 — `#`-direct-save renderer.
- `/memory` command (`Nt_`)@473396 (always enabled); `/toggle-memory` (`yt_`)@473429 (`isEnabled:()=>!1` hidden) → handler `Et_`@473406 emits `tengu_memory_toggled`; "Toggle automemory off/on for this session".
- auto-dream toggle telemetry `tengu_auto_dream_toggled {enabled, is_first_enable}`@472916 — driven from the `/memory` dialog's auto-dream row.

### memory_20250818 (NOT Claude Code auto-memory)
- `"memory_20250818"`@606987, @611708 + `client.beta.memory_stores.*`@594173 — Anthropic Managed-Agents memory tool **docs strings only**, no call sites. Clarify as unrelated.

---

## KEY DELTAS vs v2.1.142 (verified or to-verify)

1. **`/dream` changed form.** The old `/dream` *skill/slash command* gated on `tengu_kairos_dream` (2.1.142 `z8A`/`K8A`) is GONE — `grep tengu_kairos_dream` = 0 hits. `/dream` now exists as a **scheduled-task routine scaffold** (`As4`, name "dream", `LOz="/dream"`@533032, cron-driven "overnight 1–5am") alongside `/catch-up` (`DOz`@…) and `/morning-checkin` (`XOz`@…). A `· /dream to run` UI hint appears @472994. The scaffold has its own 4-phase prompt (Preparation/Topics/Rules&Learnings/Prioritization). VERIFIED.
2. **Auto-dream background scheduler unchanged in structure** (gates, lock, thresholds, 4-phase fork prompt) — only obfuscated names rotated (`nr7→U04`, `cr7→B04`, `lr7→p04`, `SL$→C04`, lock helpers `jd7/tf8/sf8→_Y4/zZ8/_Z8`).
3. Threshold defaults 24h / 5 sessions unchanged (`x04`@448742); scan throttle 600000 unchanged (`og_`@448715); lock `.consolidate-lock`/1hr-stale unchanged.
4. Extraction runtime functionally identical; canUseTool ladder, validators, cursor, telemetry preserved; module `b85→lT8`, factory `M$5→Bg_`, validator `DO8→cT8`.
5. memdir dispatcher 5-branch shape unchanged (`c5$→sM$`); builders renamed (`VK6→eM6`, `yVK→ZFK`, `hVK→GFK`, `IVK→TFK`, `SVK→VFK`).
6. `/toggle-memory` still gated-off by default. memory_update label unchanged. tiny-memory variant present.

## DELIVERABLES (write into 31_auto_memory/ unless noted)
- `README.md` — overview, architecture (3 writers + 3 dream surfaces), file list, key symbols (LIST format), v2.1.142→156 delta table.
- `memdir_core.md` — dispatcher + builders + caps + enablement + paths + types.
- `extract_memories_runtime.md` — per-turn extraction subagent (full).
- `auto_dream_runtime.md` — per-turn auto-dream scheduler + lock + prompts + `/dream` scaffold delta + memory_update.
- `cross_validation.md` — 2.1.88 ↔ 2.1.156 mapping + 2.1.142 ↔ 2.1.156 delta tables.
- `../00_overview/symbol_additions_v2_1_156_auto_memory.md` — symbol TABLE (allowed here).
- `../00_overview/cross_validation_report_auto_memory.md` — PASS/FAIL citation spot-checks.
- light: add a 31_auto_memory row to `../00_overview/README.md` layout + top-level `README.md` + `file_index.md`.
