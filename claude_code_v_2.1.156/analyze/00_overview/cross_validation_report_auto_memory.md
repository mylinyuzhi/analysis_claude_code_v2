# Cross-Validation Report — Auto Memory + Auto Dreaming

- **Module:** 31_auto_memory — memdir prompt layer, per-turn extraction subagent, per-turn
  auto-dream scheduler + filesystem lock, and orchestration/UI surfaces, v2.1.156.
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/31_auto_memory`
- **Dossier:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/_scout_dossier_auto_memory.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (single ~650K-line pretty-printed bundle; all citations are stable `cli_inner_pretty.js:<line>`)
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src` (named TypeScript reconstruction —
  `memdir/{memdir,paths,memoryTypes}.ts`, `services/extractMemories/{extractMemories,prompts}.ts`,
  `services/autoDream/{autoDream,config,consolidationLock,consolidationPrompt}.ts`)
- **Prior-version baseline:** `claude_code_v_2.1.142/analyze/31_auto_memory/`
- **Markdown files scanned:** all **5** planned docs are present in the tree (`README.md`,
  `memdir_core.md`, `extract_memories_runtime.md`, `auto_dream_runtime.md`, `cross_validation.md`).
  (Note: §V2 below was authored before `extract_memories_runtime.md` was split out into its own file;
  its citations were verified against the bundle regardless and remain correct. See the **Round-2
  addendum** at the end of this report for the standalone-doc verification and the corrections it
  produced.)
- **Samples verified directly in the bundle:** 58 (15 memdir core + 12 extraction + 19 auto-dream/lock +
  12 orchestration/UI; well above the 35–45 floor). Plus 10 cross-tree 2.1.88 named-TS confirmations.

---

## V1 — MEMDIR CORE (15 cited symbols/lines sampled)

Constants, enablement gates, paths, truncation, builders, type arrays, and the dispatcher were each
located at their cited `cli_inner_pretty.js:<line>` by direct read.

- **Constants:** `g75 = "MEMORY.md"` (142198), `OX = "MEMORY.md"` (143879), `B9H = 200` (143880),
  `aM$ = 25000` (145142), `p9H` dir-exists guidance (143881), `tM6 = "auto memory"` (145143),
  `U75 = "memory"` (142196), `F75 = "tiny_memory"` (142197).
- **Gates (body-verified):** `M1` isAutoMemoryEnabled (142111) — confirmed priority chain
  `XR()` → env `CLAUDE_CODE_DISABLE_AUTO_MEMORY` → `CLAUDE_CODE_SIMPLE` → `CLAUDE_CODE_REMOTE` → CCR
  sentinel `h88()` → settings `autoMemoryEnabled` → default `!0`; `h88` (142123) — `tengu_sepia_cormorant`
  allowlist + `tengu_umber_petrel` kill-switch; `S88` isExtractModeActive (142131) —
  `tengu_passport_quail && (!R6() || tengu_slate_thimble)`; `_D` isTinyMemoryEnabled (142142) —
  `tengu_billiard_aviary`.
- **Paths / selector:** `TA` getAutoMemPath (142211), `ng` isAutoMemPath (142185), `bM$`
  isAutoMemPathExceptEntrypoint (142188), `Q75` dirname selector body `return _D() ? F75 : U75;` (142140).
- **Truncation / dir / telemetry:** `q68` truncateEntrypointContent (144897) — body confirms line-cap
  (`B9H`) then byte-cap (`aM$`) at last `\n`; `g9H` ensureMemoryDirExists (144936); `Yr`
  logMemoryDirCounts (144945).
- **Builders:** `eM6` buildMemoryLines (144962), `hFK` buildMemoryPrompt (145022), `ZFK`
  buildMemoryLinesTiny (144371), `GFK` buildCombinedMemoryPromptTiny (144419), `TFK`
  buildSimpleMemoryPrompt (144474), `VFK` buildDreamPromptTiny (144513).
- **Types / dispatcher:** `lM6 = ["user","feedback","project","reference"]` (144194), `oM6 =
  ["user","feedback","project"]` (144552), `JFK` parseMemoryType (144158), `sM$` loadMemoryPrompt
  dispatcher (145046).

**Body-verified dispatcher branch order** (read of 145046–145070): (1) cowork-verbatim
`M1() && CLAUDE_COWORK_MEMORY_GUIDELINES` → `` `# auto memory\n${env}` ``; (2) simple non-tiny
`$ && !_D() && X3(H)` → `TFK(...)`; (3) tiny `$ && _D()` → team `GFK` / single `ZFK`. Each enabled branch
runs `await g9H(dir)` → `Yr(dir,{memory_type})` → `SH("memory_load_prompt")` before returning. **1:1 with
the dossier §A dispatcher walk.**

- **PASS: 15**
- **FAIL: 0**

## V2 — EXTRACT-MEMORIES RUNTIME (12 cited symbols/lines sampled)

- **Module / factory:** `lT8` namespace (`var lT8 = {}` 448082), `Bg_` initExtractMemories (448255),
  inner `A` runExtraction (448262), inner `Y` executeExtractMemoriesImpl (448353), `pg_`
  executeExtractMemories (448380), `Ug_` drainPendingExtraction (448383).
- **canUseTool ladder:** `cT8` createAutoMemCanUseTool (448200) — full body read; precedence confirmed:
  `XR()` DENY-all → REPL `oO` ALLOW → Read/Grep/Glob `HK/s1/S_` ALLOW → Bash/PowerShell `gq/BK`
  read-only-or-validated-rm ALLOW (`ug_`/`xg_`) → Edit/Write `l7/B9` (tiny-mode `_D()` denies Edit; else
  path-guard `bM$` + `.md`) → default DENY. `dT8` denyAutoMemTool (448145), `ug_` validatePosixMemoryRm
  (448169), `xg_` validatePowerShellRemoveItem (448152).
- **Cursor helpers:** `Ci6` isModelVisibleMessage (448089), `Ig_` countModelVisibleMessagesSince
  (448092), `Cg_` hasMemoryWritesSince (448106), `k04` isUserProseMessage (def @448126; body uses
  `v04($) >= V04`), `V04 = 3` MIN_USER_PROSE_TOKENS (448388).
- **Prompt / save:** `Z04` buildExtractionPrompt (448027) — distinctive strings verified verbatim:
  *"You are now acting as the memory extraction subagent. Analyze the most recent ~${H} messages…"* and
  *"If nothing is worth saving, output only 'Nothing to save.' Do not explain why."*; `CT8`
  createMemorySavedMessage (445955) — body is exactly `{type:"system", subtype:"memory_saved",
  writtenPaths, timestamp, uuid, isMeta:!1}`.
- **Skip-ladder telemetry (line-exact):** `tengu_auto_mem_tool_denied` {tool_name} (448148),
  `tengu_extract_memories_skipped_direct_write` {message_count} (448270),
  `tengu_extract_memories_skipped_no_prose` {message_count} (448277),
  `tengu_extract_memories_extraction` (448320), `tengu_extract_memories_error` {duration_ms} (448343),
  `tengu_extract_memories_coalesced` (448360).

- **PASS: 12**
- **FAIL: 0**

## V3 — AUTO-DREAM RUNTIME + FILESYSTEM LOCK (19 cited symbols/lines sampled)

**Gates / config / thresholds:**
- `P04` getDreamConfig (447997), `QT8` isAutoDreamServerSideOptIn (448000) — body
  `enabled===!0 || available===!0 || $68()`; `kk$` isAutoDreamFeatureToggleable (448005) — body
  `!QT8()→false; else setting autoDreamEnabled ?? onyx.enabled ?? $68()`; `sg_` isAutoDreamEnabled (448540)
  — body `!$b() && !d6() && M1() && kk$()`; `tg_` isAutoDreamForcedRun (448546).
- `ag_` getDreamThresholds (448529), `x04 = {minHours:24, minSessions:5}` (448742),
  `og_ = 600000` AUTO_DREAM_SCAN_THROTTLE_MS (448715).
- Guard helpers used by `sg_`/lock: `XR` (2799), `$b` (2781), `d6` (3190), `Av` PID-live (99065).

**Scheduler:** `p04` initAutoDream (448549), `B04` autoDreamExtractor (448551), `U04` runAutoDreamCheck
(448709). Logic-walk lines confirmed: skip-throttle `tengu_bramble_lintel ?? 1` (448281, shared with
extraction), scan-throttle debug log (448566), session-gate (448570), lock (448583), fire (448597),
completion `fY4` (448634), error catch (448664).

**Filesystem lock (body-verified vs `consolidationLock.ts`):**
- `JQ6` lockPath (399347) = `KY4.join(TA(), qE_)`; `qE_ = ".consolidate-lock"` (399401);
  `KE_ = 3600000` HOLDER_STALE_MS (399402).
- `_Z8` readLastConsolidatedAt (399350) — returns `stat().mtimeMs`, 0 on absent (mtime IS
  lastConsolidatedAt).
- `_Y4` acquireDreamLock (399357) — reads mtime+PID; if `Date.now()-mtime < KE_` **and** `Av(pid)` live →
  `null`; else write `process.pid`, re-read, verify equals own pid (race guard) → return prior mtime.
- `zZ8` releaseDreamLock/rollback (399381) — prior `0` → `unlink`; else rewind mtime via `utimes`; on
  failure logs *"rollback failed … — next trigger delayed to minHours"* (exact string present).
- `zY4` listSessionsTouchedSince (399395). Registry: `XQ6` (399413), `AY4` (399416), `YY4` (399432),
  `fY4` (399445), `OY4` (399450).

**Prompts:** `C04` buildDreamPrompt (448446); `ng_` TEAM_DREAM_PHASE_GUIDANCE (448514) — body starts
*"## Team memory (`team/` subdirectory)…"*; `ig_` RECONCILE_AGAINST_CLAUDEMD (448516) — body starts
*"### Reconcile memories against CLAUDE.md"*. Helpers `eg_` trackDreamFilesTouched (448678), `Hd_`
countDailyLogs (448700). `/dream` scaffold `As4` (532705) — `name: dream` / *"Runs overnight (1–5am
local)"* / `context: fork`.

**Auto-dream telemetry (line-exact):** `tengu_auto_dream_skipped` {reason:"sessions",session_count,
min_required} (448580), {reason:"lock"} (448593); `tengu_auto_dream_fired`
{hours_since,sessions_since,team_memory_enabled} (448599); `tengu_auto_dream_completed` (448654);
`tengu_auto_dream_failed` {phase,error_class} (448671).

- **PASS: 19**
- **FAIL: 0**

## V4 — ORCHESTRATION + SURFACES (12 cited symbols/lines sampled)

- **Stop-hook call sites (450698–450699, body-verified):**
  `if (!z.agentId && S88()) Ac_.executeExtractMemories(M, z.appendSystemMessage);` and
  `if (!z.agentId) U04(M, z.appendSystemMessage);` — confirming extraction is `S88()`-gated while
  auto-dream is called unconditionally (gates inside `B04`), both `!agentId` (main-agent only). **1:1 with
  dossier §D.**
- **memory_update plumbing:** `pendingMemoryUpdates: []` appState init (241518), `vw4`
  drainPendingMemoryUpdates (413803), `BQ_ = {dream:"Background memory consolidation"}`
  MEMORY_UPDATE_SOURCE_LABELS (446768), renderer `case "memory_update":` (445768).
- **UI:** `sk_` MemoryUpdateNotification (393698), `qk_` randomAck (390746) — body
  `return YW(["Got it.","Good to know.","Noted."]);` (matches dossier's 3-element list), `G_4`
  UserMemoryInputMessage (390749), `Nt_` `/memory` command (473396), `yt_` `/toggle-memory` (473429).

- **PASS: 12**
- **FAIL: 0**

## V5 — KEY DELTAS vs v2.1.142 (asserted deltas, source-confirmed)

| Delta | Source evidence | Verdict |
|-------|-----------------|---------|
| `/dream` skill/slash gated on `tengu_kairos_dream` REMOVED | `grep tengu_kairos_dream` = **0 hits** | ✅ REMOVED |
| `/dream` now a scheduled-task scaffold | `As4` (532705) `name: dream`, `context: fork`, "overnight (1–5am)"; `LOz = "/dream"` (533032) | ✅ NEW form |
| `· /dream to run` UI hint | renderer string at 472994 | ✅ |
| auto-dream toggle telemetry | `tengu_auto_dream_toggled {enabled,is_first_enable}` (472916) | ✅ |
| `localSettings` dropped from override settings source | `d75` (142169) reads `policySettings → flagSettings → userSettings` only | ✅ (matches 2.1.142) |
| Threshold defaults 24h / 5 sessions unchanged | `x04 = {minHours:24,minSessions:5}` (448742) | ✅ stable |
| Scan throttle 600000 unchanged | `og_ = 600000` (448715) | ✅ stable |
| Lock `.consolidate-lock` / 1hr-stale unchanged | `qE_` (399401), `KE_ = 3600000` (399402) | ✅ stable |

## V6 — v2.1.88 named-TypeScript cross-check (10 samples)

Independent confirmation that the named function/const exists in the readable ground-truth tree, opened
directly under `/lyz/codespace/3rd/claude-code/src`.

| 2.1.156 (bundle) | 2.1.88 named source | Match |
|------------------|---------------------|-------|
| `g75/OX = "MEMORY.md"` | `memdir/memdir.ts:34` `ENTRYPOINT_NAME = 'MEMORY.md'` | ✅ |
| `q68` truncateEntrypointContent | `memdir.ts:57` `truncateEntrypointContent(raw)` | ✅ |
| `g9H` ensureMemoryDirExists | `memdir.ts:129` `ensureMemoryDirExists(memoryDir)` | ✅ |
| `M1` isAutoMemoryEnabled | `paths.ts:30` `isAutoMemoryEnabled()` | ✅ |
| `EUK` validateMemoryPath | `paths.ts:109` `validateMemoryPath(...)` (+ `getAutoMemPath` `paths.ts:223`) | ✅ |
| `lM6`/`JFK` MEMORY_TYPES/parseMemoryType | `memoryTypes.ts:14` `MEMORY_TYPES`, `:28` `parseMemoryType` | ✅ |
| `pg_`/`Bg_`/`Ug_` extract trio | `extractMemories.ts:598` `executeExtractMemories`, `:296` `initExtractMemories`, `:611` `drainPendingExtraction` (+ `createAutoMemCanUseTool:171`, `hasMemoryWritesSince:121`) | ✅ |
| `sg_` isAutoDreamEnabled | `config.ts:13` `isAutoDreamEnabled()`; `autoDream.ts:64-65` `DEFAULTS {minHours:24,minSessions:5}` | ✅ |
| `qE_`/`KE_` lock consts | `consolidationLock.ts:16` `LOCK_FILE='.consolidate-lock'`, `:19` `HOLDER_STALE_MS = 60*60*1000` (= 3600000) | ✅ |
| `C04` buildDreamPrompt phases | `consolidationPrompt.ts:15` `# Dream: Memory Consolidation`; phases 1–4 Orient/Gather recent signal/Consolidate/Prune and index (`:26/:33/:44/:53`) | ✅ |

**Readable-name reconciliation:** the dossier's `acquireDreamLock`/`releaseDreamLock` map to the 2.1.88
exports `tryAcquireConsolidationLock` / `rollbackConsolidationLock`; `readLastConsolidatedAt` and
`listSessionsTouchedSince` keep their names. All five lock/session exports exist as named functions —
no fabricated symbol. `HOLDER_STALE_MS = 60*60*1000` is **value-identical** to the bundle's `3600000`.

- **PASS: 10 / 10**

---

## Summary

- **V1 memdir core:** 15/15 PASS
- **V2 extract-memories runtime:** 12/12 PASS
- **V3 auto-dream runtime + lock:** 19/19 PASS
- **V4 orchestration + surfaces:** 12/12 PASS
- **V6 v2.1.88 named-TS cross-check:** 10/10 PASS
- **V5 asserted deltas:** 8/8 confirmed (1 REMOVED, 1 NEW form, 6 stable/version-aligned)

**Total checked:** 58 bundle citations + 10 cross-tree TS confirmations = **68 verifications;
68 passed; first-read pass rate 100%.** Every cited `cli_inner_pretty.js:<line>` resolved to the named
symbol/value on the first read — no line was off, no correction was required. Function-body reads
(M1/h88/S88/_D gates, the `cT8` canUseTool ladder, the `sM$` dispatcher branch order, the full lock
protocol `_Z8/_Y4/zZ8`, and the stop-hook call sites) all matched the asserted behavior, and the
distinctive prompt/save strings (`Z04`, `CT8`, `qk_`, `ng_`, `ig_`, `As4`) matched verbatim.

**Residual low-confidence / open items:** *(all resolved in the Round-2 addendum below)*
1. ~~Deliverable count mismatch~~ — **resolved.** All five docs are now present;
   `extract_memories_runtime.md` exists as a standalone file (and was re-verified in Round 2).
2. ~~`symbol_additions_v2_1_156_auto_memory.md` not opened~~ — **resolved.** It was sampled in Round 2
   (broad row sample, obfuscated→readable→`File:Line` confirmed against the bundle); no errors found.

**Overall confidence: HIGH.** Every analytical conclusion sampled from the dossier and the module docs
is backed by a directly-read 2.1.156 source line, cross-checked against the named 2.1.88 TypeScript
reconstruction. No false or mis-cited symbol was found in this pass.

---

## Round-2 addendum (independent re-verification)

A second, independent verification pass re-checked **all five module docs plus
`symbol_additions_v2_1_156_auto_memory.md`** against the 2.1.156 bundle and the 2.1.88 named-TypeScript
source. Coverage: **201 bundle citations + 45 cross-validation claims** sampled across the docs (one
read-only verifier per doc). Result: the analysis is sound; **0 high-severity factual errors in
`memdir_core.md`, `auto_dream_runtime.md`, or the index/`cross_validation.md` line numbers**. Five
corrections were applied:

| # | Doc | Issue | Fix |
|---|-----|-------|-----|
| 1 | `extract_memories_runtime.md` §5 | `runExtraction` location end-line off by one | `448288-448351` → `448288-448352` (function `A`'s closing brace is at 448352) |
| 2 | `extract_memories_runtime.md` §7/§9 + `cross_validation.md` §2.2 | "Merged (2→1)" understated the prompt change | Documented that 2.1.88's two builders each carried an inline two-step `howToSave` + `skipIndex` 3rd param; 2.1.156's `Z04` **drops the inline howToSave**, repurposes the 3rd param to `teamMemoryEnabled`, and delegates the save procedure to the system prompt. `skipIndex`/`tengu_moth_copse` relocated to `eM6` (`@145059`), not removed. Status → **Merged + simplified**. |
| 3 | `README.md` "Orchestration + surfaces" | Stop-hook citation conflated `eg_`/`Hd_` (448698-448699) with the dispatch site | Reduced to the correct `cli_inner_pretty.js:450698-450699` |
| 4 | `auto_dream_runtime.md` §6 | Toggle-row gate described only `QT8()` | Added the `M1()` (auto-memory) precondition: `B = L && S` @472869 |
| 5 | this report | Stale "4 docs / `extract_memories` not written / `symbol_additions` not opened" | Corrected above |

**Enhancement applied alongside the fixes:** the four memory/dream **prompt strings** are now quoted
**verbatim** in the docs (previously summarized with "…"): the dream consolidation prompt `C04` plus its
`RECONCILE_AGAINST_CLAUDEMD` (`ig_`) and `TEAM_DREAM_PHASE_GUIDANCE` (`ng_`) blocks
(`auto_dream_runtime.md` §8), the tiny pruning prompt `VFK` (`memdir_core.md` §5), the `/dream`
scheduled-task scaffold `As4` (`auto_dream_runtime.md` §Delta), and the assembled extraction prompt `Z04`
(`extract_memories_runtime.md` §7). For LLM-driven features the prompt text *is* the behavior, so these
are now first-class evidence rather than prose paraphrase.

**Round-2 verdict:** every spot-checked citation in the unchanged docs resolved correctly; the only
substantive content correction was the extraction-prompt `howToSave`/`skipIndex` delta (item 2), which
deepens rather than overturns the prior analysis. **Confidence remains HIGH.**
