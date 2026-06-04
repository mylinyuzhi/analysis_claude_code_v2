# Cross-Validation: v2.1.88 (TS) ↔ v2.1.156 (obf) — Auto Memory + Auto Dreaming

This document is the consolidated cross-reference for the `31_auto_memory` module in
Claude Code **2.1.156**. It maps the named v2.1.88 TypeScript ground truth
(`/lyz/codespace/3rd/claude-code/src/{memdir,services/extractMemories,services/autoDream,tasks/DreamTask}`)
onto the obfuscated v2.1.156 bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`),
and then layers the **v2.1.142 → v2.1.156 delta** on top of the v2.1.142 reference
([../../../claude_code_v_2.1.142/analyze/31_auto_memory/cross_validation.md](../../../claude_code_v_2.1.142/analyze/31_auto_memory/cross_validation.md)).

Every v2.1.156 citation below was confirmed by direct read of the bundle. Every v2.1.88
citation is a real `file:line` opened from the TypeScript tree. Where the 2.1.88 trail does
not reach the 2.1.156 code, that is flagged explicitly in [§5](#5-where-the-2188-trail-runs-cold).

> Symbol mappings (obfuscated → readable TABLES) live only in the overview, not here:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact, Hooks, Skills, **Auto Memory / Dream**
> - [symbol_additions_v2_1_156_auto_memory.md](../00_overview/symbol_additions_v2_1_156_auto_memory.md) — this version's symbol additions
>
> Companion module docs: [README.md](./README.md), [memdir_core.md](./memdir_core.md),
> [auto_dream_runtime.md](./auto_dream_runtime.md) (also covers the extraction subagent and its shared tool sandbox).

---

## 0. Source File Map

### v2.1.88 TypeScript (the readable reference)

| File | Lines | Role in this module |
|------|-------|----------------------|
| `src/memdir/memdir.ts` | 507 | Entrypoint name, caps, truncation, dir/telemetry helpers, prompt builders, `loadMemoryPrompt` dispatcher |
| `src/memdir/paths.ts` | 278 | `isAutoMemoryEnabled`, `isExtractModeActive`, path resolution + security validation, `isAutoMemPath` |
| `src/memdir/memoryTypes.ts` | 271 | `MEMORY_TYPES`, prompt sections, frontmatter spec |
| `src/services/extractMemories/extractMemories.ts` | 615 | Per-turn extraction subagent: state, canUseTool, cursor, skip ladder, fork, telemetry |
| `src/services/extractMemories/prompts.ts` | 154 | Two extraction prompt builders (auto-only + combined team) |
| `src/services/autoDream/autoDream.ts` | 324 | Per-turn auto-dream scheduler: gates → time → scan throttle → sessions → lock → fork → completion |
| `src/services/autoDream/config.ts` | 21 | `isAutoDreamEnabled` (setting ?? `tengu_onyx_plover.enabled`) |
| `src/services/autoDream/consolidationLock.ts` | 140 | `.consolidate-lock` protocol (mtime = lastConsolidatedAt, PID body, 1 hr stale) |
| `src/services/autoDream/consolidationPrompt.ts` | 65 | `buildConsolidationPrompt` — the 4-phase dream fork prompt |
| `src/tasks/DreamTask/DreamTask.ts` | 157 | Dream task registry (register/turn/complete/fail/kill) for footer UI |

### v2.1.156 obfuscated (the source under analysis)

All citations are stable `cli_inner_pretty.js:<line>` references (single ~650K-line bundle, no per-chunk map). Anchor regions:

| Region | Concern | Maps to v2.1.88 |
|--------|---------|------------------|
| 142111–145143 | memdir core (gates, paths, caps, truncation, dir/telemetry) | `memdir.ts` + `paths.ts` |
| 144962–145131 | memdir prompt builders + dispatcher `sM$` | `memdir.ts` (builders, `loadMemoryPrompt`) |
| 448027–448390 | extract-memories runtime (`Bg_` factory, `cT8` canUseTool, `Z04` prompt, cursor helpers) | `extractMemories.ts` + `prompts.ts` |
| 447997–448011, 448529–448677, 448700–448742 | auto-dream gates, config, scheduler, throttle/threshold consts | `autoDream.ts` + `config.ts` |
| 399347–399402 | filesystem lock protocol | `consolidationLock.ts` |
| 399413–399455 | dream task registry | `DreamTask.ts` |
| 448446–448516 | auto-dream fork prompt `C04` | `consolidationPrompt.ts` |
| 532705–532744 | `/dream` scaffold `As4` (NEW form) | — (no 2.1.88 analog) |

---

## 1. DELTA Table — memdir core (`memdir.ts` + `paths.ts`)

`Change` column: **Preserved** (byte/structure identical), **Renamed** (same behavior, new obf name),
**New** (no v2.1.88 analog), **Removed** (was in v2.1.88, gone in v2.1.156), **Evolved** (behavior changed).

| v2.1.88 symbol / behavior (file:line) | v2.1.156 (obf name @ line) | Change |
|----------------------------------------|----------------------------|--------|
| `ENTRYPOINT_NAME = 'MEMORY.md'` (memdir.ts:34) | `g75` @142198, alias `OX` @143879 (used by `q68`/extraction) | Preserved (two literal copies) |
| `MAX_ENTRYPOINT_LINES = 200` (memdir.ts:35) | `B9H` @143880 | Preserved |
| `MAX_ENTRYPOINT_BYTES = 25_000` (memdir.ts:38) | `aM$` @145142 | Preserved |
| `AUTO_MEM_DISPLAY_NAME = 'auto memory'` (memdir.ts:39) | `tM6` @145143 | Preserved |
| `DIR_EXISTS_GUIDANCE` (memdir.ts:116) | `p9H` @143881 (also injected into `C04` dream prompt @448452) | Preserved |
| `DIRS_EXIST_GUIDANCE` (memdir.ts:118) | `B5$`-style alias (team builder) | Preserved |
| dirnames `'memory'` / `AUTO_MEM_DIRNAME` (paths.ts:92) | `U75 = "memory"` @142196 | Preserved |
| tiny dirname `'tiny_memory'` | `F75 = "tiny_memory"` @142197; selector `Q75()` @142139 | Preserved |
| `truncateEntrypointContent` (memdir.ts:57–103) | `q68` @144897–144935 | Renamed (line-cap-200 → byte-cap-at-last-`\n`-under-25K → 3-form contextual warning, bit-identical) |
| `ensureMemoryDirExists` (memdir.ts:129–147) | `g9H` @144936–144944 | Renamed (recursive mkdir, debug-level swallow) |
| `logMemoryDirCounts` (memdir.ts:153–185) | `Yr` @144945–144960 | Renamed (fire-and-forget readdir → `tengu_memdir_loaded`) |
| `buildMemoryLines` (default, memdir.ts:199–266) | `eM6` @144962–145021 | Renamed (now has bouncer swap via `iM6()`/`q95`) |
| `buildMemoryPrompt` (agent, memdir.ts:272–316) | `hFK` @145022–145044 | Renamed (reads entrypoint, appends `## MEMORY.md`) |
| `buildSearchingPastContextSection` (memdir.ts:375–407) | inlined in `eM6`; `tengu_coral_fern` gate preserved | Preserved |
| **`buildAssistantDailyLogPrompt` (KAIROS, memdir.ts:327–370)** | — (`getKairosActive` branch absent from `sM$`) | **Removed** from dispatcher; log-layout text survives only in `/dream` scaffold `As4` |
| `loadMemoryPrompt` dispatcher (memdir.ts:419–507) | `sM$` @145046–145118 | **Evolved**: 6 first-match branches (was 2 reachable in 2.1.88 src) — see [§1.1](#11-dispatcher-branch-by-branch) |
| `MEMORY_TYPES = ['user','feedback','project','reference']` (memoryTypes.ts) | `lM6` @144194 | Preserved |
| `TINY_MEMORY_TYPES = ['user','feedback','project']` | `oM6` @144552 | New (drops `reference` from prompt only) |
| `parseMemoryType` (memoryTypes.ts) | `JFK` @144158–144161 | Renamed (returns value if ∈ `lM6` else undefined) |
| `isAutoMemoryEnabled` (paths.ts:30–55) | `M1` @142111–142122 | **Evolved**: adds `XR()` toggle-off at step 1 + `h88()` CCR sentinel at step 6 (see [§1.2](#12-enablement-gates)) |
| `isExtractModeActive` (paths.ts:69–77) | `S88` @142131–142134 | Preserved (`tengu_passport_quail` AND (`!R6()` OR `tengu_slate_thimble`)) |
| `getMemoryBaseDir` (paths.ts:85–90) | `lg` @142135–142138 | Renamed |
| `getAutoMemEntrypointDirname` (paths.ts) | `Q75` @142139 (returns `F75` if `_D()` else `U75`) | Renamed |
| `isTinyMemoryEnabled` (`tengu_billiard_aviary`) | `_D` @142142–142144 | Preserved |
| `validateMemoryPath` (paths.ts:109–150) | `EUK` @142145–142165 | **Evolved**: adds `startsWith('../')`/`'..\\'` rejections to the `..` guard @142151 |
| `getAutoMemPathOverride` (`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`, paths.ts:161–166) | `yUK` @142166–142168 | Preserved |
| `getAutoMemPathSetting` (paths.ts:179–186) | `d75` @142169–142175 | Preserved (3 trusted sources: policy → flag → user; `localSettings` already dropped in v2.1.142) |
| `hasAutoMemPathOverride` (paths.ts:194–196) | `R88` @142176–142178 | Renamed |
| `getAutoMemBase` (canonical git root, paths.ts:203–205) | `c75` @142179–142181 | Renamed |
| `getAutoMemEntrypoint` (paths.ts:257–259) | `h9H` @142182–142184 | Renamed (`join(TA(), g75)`) |
| `isAutoMemPath` (paths.ts:274–278) | `ng` @142185–142187 | Renamed (normalize-then-prefix) |
| `getAutoMemPath` (memoized, paths.ts:223–235) | `TA` @142199+ (memoized) | Renamed |
| **`getAutoMemDailyLogPath` (KAIROS, paths.ts:246–251)** | — | **Removed** (KAIROS log helper gone with the dispatch branch) |
| — | `bM$` (isAutoMemPathExceptEntrypoint) @142188–142192 | New (path guard used by `cT8` write check) |
| — | `h88` (isCcrSentinelDisabled) @142123–142129 | New (`tengu_sepia_cormorant` allowlist + `tengu_umber_petrel` kill-switch) |

### 1.1 Dispatcher branch-by-branch

The 2.1.88 source `loadMemoryPrompt` (memdir.ts:419–507) has, *in source*, four code paths: KAIROS,
TEAMMEM, auto-only, disabled. Two of those (KAIROS, TEAMMEM) are `feature()`-gated and tree-shaken
out of most shipped builds, so the v2.1.88 *binary* path is effectively two-branch. The v2.1.156 `sM$`
(@145046–145118) ships **six** first-match-wins branches — the structural reflection of the
v2.1.13x–14x prompt-experimentation phase. Verified by read:

1. **cowork-verbatim** (@145048–145058): `M1() && CLAUDE_COWORK_MEMORY_GUIDELINES` set → returns
   `` `# auto memory\n${env.trim()}` `` verbatim. *No 2.1.88 analog.*
2. **simple non-tiny** (@145062–145067): `M1() && !_D() && X3(model)` → `TFK(autoDir, teamDir|null, skipIndex, extra)`. *No 2.1.88 analog (simple-system-prompt branch).*
3. **tiny** (@145068–145087): `M1() && _D()` → team? `GFK(autoDir, teamDir, extra)` : `ZFK("auto memory", autoDir, extra).join("\n")`. *No 2.1.88 analog (tiny variant).*
4. **team non-tiny** (@145088–145098): `dVH.isTeamMemoryEnabled()` → `A95.buildCombinedMemoryPrompt(extra, skipIndex)`. **Maps to** memdir.ts:448–473 TEAMMEM branch.
5. **single auto** (@145099–145108): `M1()` → `eM6("auto memory", autoDir, extra, skipIndex).join("\n")`. **Maps to** memdir.ts:475–490 auto-only branch.
6. **disabled** (@145109–145117): emits `tengu_memdir_disabled {disabled_by_env_var, disabled_by_setting}`; if `tengu_herring_clock` also `tengu_team_memdir_disabled`; returns null. **Maps to** memdir.ts:492–506 — *byte-identical telemetry payload*.

Every enabled branch follows the same harness invariant as 2.1.88: `await g9H(dir)` (ensure exists) →
`Yr(dir, {memory_type})` (count telemetry) → `SH("memory_load_prompt")` (timing span, new in obf) → build.
The KAIROS branch (memdir.ts:432–438) is **gone** — confirmed by absence of any `getKairosActive()` call
in `sM$`.

```javascript
// ============================================
// loadMemoryPrompt - 6-branch first-match memory-prompt dispatcher (disabled branch)
// Location: cli_inner_pretty.js:145109-145117
// ============================================

// ORIGINAL (for source lookup):
if ((d("tengu_memdir_disabled", { disabled_by_env_var: xH(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY), disabled_by_setting: !xH(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && i6().autoMemoryEnabled === !1 }), V$("tengu_herring_clock", !1))) d("tengu_team_memdir_disabled", {});
return null;

// READABLE (for understanding):
logEvent("tengu_memdir_disabled", {
  disabled_by_env_var: isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
  disabled_by_setting:
    !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
    getInitialSettings().autoMemoryEnabled === false,
});
if (getFeatureValue("tengu_herring_clock", false))   // V$ is the cached GrowthBook reader (may be stale)
  logEvent("tengu_team_memdir_disabled", {});
return null;

// Mapping: sM$→loadMemoryPrompt, d→logEvent, xH→isEnvTruthy, i6→getInitialSettings, V$→getFeatureValue
```

This payload is **byte-identical** to 2.1.88 memdir.ts:492–506 — same two keys, same
`disabled_by_setting` short-circuit (env-truthy suppresses the setting reason).

### 1.2 Enablement gates

The 2.1.88 `isAutoMemoryEnabled` (paths.ts:30–55) is a 5-step chain: env-disable → `CLAUDE_CODE_SIMPLE`
→ remote-without-store → settings → default true. The v2.1.156 `M1` (@142111–142122) keeps that chain
**exactly** but adds two new gates around it:

```javascript
// ============================================
// isAutoMemoryEnabled - enablement chain with new toggle + CCR-sentinel gates
// Location: cli_inner_pretty.js:142111-142122
// ============================================

// ORIGINAL (for source lookup):
function M1() {
  if (XR()) return !1;
  let H = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
  if (xH(H)) return !1;
  if (k4(H)) return !0;
  if (xH(process.env.CLAUDE_CODE_SIMPLE)) return !1;
  if (xH(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
  if (h88()) return !1;
  let $ = i6();
  if ($.autoMemoryEnabled !== void 0) return $.autoMemoryEnabled;
  return !0;
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
  if (isMemoryToggledOff()) return false;                // [NEW] /toggle-memory session flag
  const env = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
  if (isEnvTruthy(env)) return false;                    // memdir.ts step 1
  if (isEnvDefinedFalsy(env)) return true;
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) return false;  // step 2
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) &&
      !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return false;   // step 3
  if (isCcrSentinelDisabled()) return false;             // [NEW] cohort kill-switch
  const settings = getInitialSettings();
  if (settings.autoMemoryEnabled !== undefined) return settings.autoMemoryEnabled; // step 4
  return true;                                           // step 5: default on
}

// Mapping: M1→isAutoMemoryEnabled, XR→isMemoryToggledOff, xH→isEnvTruthy, k4→isEnvDefinedFalsy, h88→isCcrSentinelDisabled, i6→getInitialSettings
```

The `XR()` (toggle-off) and `h88()` (CCR sentinel) gates were already present in v2.1.142 (the reference
calls them `Rd()` and `Pi$()`). They are **not** in the v2.1.88 source — flagged in [§5](#5-where-the-2188-trail-runs-cold).

---

## 2. DELTA Table — extraction runtime (`extractMemories.ts` + `prompts.ts`)

| v2.1.88 symbol / behavior (file:line) | v2.1.156 (obf name @ line) | Change |
|----------------------------------------|----------------------------|--------|
| module/namespace (init/execute/drain/canUseTool exports) | `lT8` exports @448082–448088; re-export `Ac_` for stop-hook | Renamed |
| `executeExtractMemories` (extractMemories.ts:598–603) | `pg_` @448380–448381 (`await y04?.(...)`) | Preserved |
| `drainPendingExtraction` (extractMemories.ts:611–615, 60s race + `.unref()`) | `Ug_` @448383–448384 → `h04` @448375–448377 | Preserved |
| `initExtractMemories` closure factory (extractMemories.ts:296–587) | `Bg_` @448255–448378 | Renamed |
| closure state: `inFlightExtractions` Set (:303) | `H` @448256 | Preserved |
| closure state: `lastMemoryMessageUuid` cursor (:307) | `$` @448257 | Preserved |
| closure state: `inProgress` (:313) | `K` @448259 | Preserved |
| closure state: `turnsSinceLastExtraction` (:316) | `_` @448260 | Preserved |
| closure state: `pendingContext` (:320) | `z` @448261 | Preserved |
| `runExtraction` inner (extractMemories.ts:329–523) | inner `A` @448262–448352 | Renamed |
| `executeExtractMemoriesImpl` (extractMemories.ts:527–567) | inner `Y` @448353–448364 | Renamed (gate ladder: `agentId` → `tengu_passport_quail` → `M1()` → `d6()` remote → coalesce) |
| `createAutoMemCanUseTool` (extractMemories.ts:171–222) | `cT8` @448200–448231 | **Evolved**: tiny-mode Edit denial + OS-aware `rm`/`Remove-Item` ALLOW + `.md`-suffix guard — see [§2.1](#21-canusetool-ladder) |
| `denyAutoMemTool` (extractMemories.ts:154–164) | `dT8` @448145 → `tengu_auto_mem_tool_denied {tool_name}` | Renamed |
| `isModelVisibleMessage` (extractMemories.ts:78–80) | `Ci6` @448089–448091 | Preserved |
| `countModelVisibleMessagesSince` (extractMemories.ts:82–110, compaction fallback = count all) | `Ig_` @448092–448105 | Preserved (fallback verbatim @448103) |
| `hasMemoryWritesSince` (extractMemories.ts:121–148) | `Cg_` @448106–448121 | Preserved (mutual-exclusion vs main agent) |
| `getWrittenFilePath` (extractMemories.ts:232–249) | `E04` @448233–448241 | Renamed |
| `extractWrittenPaths` (extractMemories.ts:251–269) | `mg_` @448242–448254 | Renamed |
| `buildExtractAutoOnlyPrompt` (prompts.ts:50–94) | merged into `Z04` @448027–448071 | **Evolved**: both builders + OS + tiny merged into one — see [§2.2](#22-the-merged-prompt-builder) |
| `buildExtractCombinedPrompt` (prompts.ts:101–154) | merged into `Z04` (team branch) | **Evolved** |
| `createMemorySavedMessage` (utils/messages) | `CT8` @445955–445963 | Preserved (`{type:"system", subtype:"memory_saved", writtenPaths, …}`) |
| telemetry `tengu_extract_memories_skipped_direct_write` (:356) | @448270 | Preserved |
| telemetry `tengu_extract_memories_extraction` (:473) | @448320 | Preserved (same token/cache/files/memories/duration keys) |
| telemetry `tengu_extract_memories_error` (:500) | @448343 | Preserved |
| telemetry `tengu_extract_memories_coalesced` (:561) | @448360 | Preserved |
| `MIN_USER_PROSE_TOKENS` | `V04 = 3` @448388 | New |
| — | `isUserProseMessage` `k04` @448126–448132 (≥3 non-meta text tokens) | **New** (no 2.1.88 analog) |
| — | `tokenize` `v04` @448123–448125 (`split(/\s+/).filter(Boolean)`) | New |
| — | `hasUserProseSince` `bg_` @448133+ | **New** skip-ladder step (no 2.1.88 analog) |
| — | telemetry `tengu_extract_memories_skipped_no_prose` @448277 | **New** |
| — | `validatePosixMemoryRm` `ug_` @448169–448198 | New |
| — | `validatePowerShellRemoveItem` `xg_` @448152–448167 | New |
| — | `skipCacheWrite: D$$()` arg to `runForkedAgent` @448301 | New |

### 2.1 canUseTool ladder

The v2.1.88 `createAutoMemCanUseTool` (extractMemories.ts:171–222) is a 5-rung ladder:
REPL ALLOW → Read/Grep/Glob ALLOW → read-only-Bash ALLOW (else deny) → Edit/Write inside
auto-mem-path ALLOW → default DENY. The v2.1.156 `cT8` (@448200–448231) preserves the spine but
**adds three things** that have no 2.1.88 analog in this file:

1. A **toggle-off short-circuit** at the very top: `if (XR()) return dT8($, "Memory is toggled off…")`
   (@448202).
2. **Destructive-but-bounded shell ALLOW**: inside the Bash/PowerShell rung, a `rm`/`Remove-Item` of a
   `.md` file inside the validated memory dir is now permitted (`ug_`/`xg_`, @448211) — 2.1.88 denied
   *all* writes including delete. This is the runtime half of the auto-dream "delete contradicted
   facts" instruction.
3. **Tiny-mode Edit denial** + a `.md`-suffix requirement on the Edit/Write path check
   (`_.endsWith(".md") && bM$(_)`, @448227). In tiny mode (`_D()`), Edit is denied entirely (memories
   are immutable; the agent must delete+recreate, @448221–448225).

```javascript
// ============================================
// createAutoMemCanUseTool - tiny-mode Edit denial + .md path guard (Edit/Write rung)
// Location: cli_inner_pretty.js:448220-448228
// ============================================

// ORIGINAL (for source lookup):
if (($.name === l7 || $.name === B9) && "file_path" in q) {
  if ($.name === l7 && _D())
    return dT8($, `${l7} is not permitted in tiny memory mode — memories are immutable, so delete via ${K1() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${B9}.`);
  let _ = q.file_path;
  if (typeof _ === "string" && _.endsWith(".md") && bM$(_)) return { behavior: "allow", updatedInput: q };
}

// READABLE (for understanding):
if ((tool.name === EditToolName || tool.name === WriteToolName) && "file_path" in input) {
  if (tool.name === EditToolName && isTinyMemoryEnabled())
    return denyAutoMemTool(tool, `${EditToolName} is not permitted in tiny memory mode — memories are immutable, so delete via ${isBashAvailable() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${WriteToolName}.`);
  const filePath = input.file_path;
  if (typeof filePath === "string" && filePath.endsWith(".md") && isAutoMemPathExceptEntrypoint(filePath))
    return { behavior: "allow", updatedInput: input };
}

// Mapping: l7→EditToolName, B9→WriteToolName, _D→isTinyMemoryEnabled, bM$→isAutoMemPathExceptEntrypoint, dT8→denyAutoMemTool, K1→isBashAvailable
```

Note `bM$` (isAutoMemPathExceptEntrypoint) is *stricter* than 2.1.88's `isAutoMemPath` — it rejects
`MEMORY.md` itself from direct Edit, forcing the index to be maintained via the two-step pointer flow.

### 2.2 The merged prompt builder

2.1.88 ships two separate builders — `buildExtractAutoOnlyPrompt` (prompts.ts:50–94) and
`buildExtractCombinedPrompt` (prompts.ts:101–154) — sharing an `opener()` (prompts.ts:29–44). v2.1.156
collapses both into a single `Z04` (@448027–448071) that branches internally on OS (POSIX vs Windows:
`rm` vs `Remove-Item`, tool names), tiny (`_D()`: "delete-and-recreate", no Edit, parallel single-turn),
and team (adds per-type `<scope>` guidance + the "never save API keys" line). The distinctive opener
string is preserved verbatim: *"You are now acting as the memory extraction subagent. Analyze the most
recent ~${N} messages above…"* (prompts.ts:35 ↔ obf @448027 region). The "turn 1 read in parallel,
turn 2 write in parallel" strategy (prompts.ts:39) survives into the non-tiny full branch.

**One real behavioral delta (not just a merge).** The 2.1.88 builders each took a `skipIndex` 3rd
parameter and emitted an inline two-step **`howToSave`** block (*"Saving a memory is a two-step process:
**Step 1** … **Step 2** — add a pointer to that file in `MEMORY.md` …"*, `prompts.ts:55-92` /
`:114-152`). v2.1.156's `Z04` **removes that block** and repurposes the 3rd parameter from `skipIndex` to
`teamMemoryEnabled`; the prompt now delegates the save procedure to *"the Memory section of your system
prompt"* (obf @448069). `skipIndex` / `tengu_moth_copse` did not vanish — it relocated to the memdir
builder `eM6` (`V$("tengu_moth_copse", !1)` @145059), centralizing the save instructions in one place. So
the 2.1.88→2.1.156 status for this row is **Merged + simplified**, not a pure transliteration. See
`extract_memories_runtime.md` §7/§9 for the full assembled prompt.

---

## 3. DELTA Table — auto-dream runtime (`autoDream.ts` + `config.ts` + `consolidationLock.ts` + `consolidationPrompt.ts` + `DreamTask.ts`)

| v2.1.88 symbol / behavior (file:line) | v2.1.156 (obf name @ line) | Change |
|----------------------------------------|----------------------------|--------|
| `isAutoDreamEnabled` (config.ts:13–21, setting ?? `onyx.enabled`) | `kk$` @448005–448011 | **Evolved**: 3-layer `QT8()` opt-in → setting → `onyx.enabled` → `$68()` team fallback |
| — | `getDreamConfig` `P04` @447997–447999 (`tengu_onyx_plover`) | New helper |
| — | `isAutoDreamServerSideOptIn` `QT8` @448000–448004 (`enabled` OR `available` OR `$68()`) | **New** (no 2.1.88 analog — `available` field absent from config.ts) |
| `getConfig` thresholds (autoDream.ts:73–93) | `ag_` @448529–448538 | Preserved (per-field positive-finite validation) |
| `DEFAULTS = {minHours:24, minSessions:5}` (autoDream.ts:63–66) | `x04 = {minHours:24, minSessions:5}` @448742 | Preserved (24 / 5 unchanged) |
| `SESSION_SCAN_INTERVAL_MS = 10*60*1000` (autoDream.ts:56) | `og_ = 600000` @448715 | Preserved |
| `isGateOpen` (autoDream.ts:95–100, KAIROS/remote/auto/dream) | `sg_` @448540–448545 (`!$b() && !d6() && M1() && kk$()`) | Preserved |
| `isForced` (autoDream.ts:105–107, returns false) | `tg_` @448546–448548 (returns false) | Preserved (kill-switch placeholder) |
| `initAutoDream` closure factory (autoDream.ts:122–273) | `p04` @448549–448677; assigns `B04` | Renamed |
| `runAutoDream` runner (autoDream.ts:125–272) | `B04` closure @448551–448676 | Renamed |
| `executeAutoDream` entry (autoDream.ts:319–324) | `U04` @448709–448711 (`await B04?.(...)`) | Preserved |
| `lastSessionScanAt = 0` capture (autoDream.ts:123) | `H = 0` @448550 | Preserved |
| time gate `hoursSince < minHours` (autoDream.ts:140–141) | @448562–448563 (`/3600000`) | Preserved |
| scan throttle `sinceScanMs < INTERVAL` (autoDream.ts:144–151) | @448564–448569 | Preserved |
| session gate (`listSessionsTouchedSince` − current, `< minSessions`) (autoDream.ts:154–171) | @448570–448582 | **Evolved**: adds `tengu_auto_dream_skipped {reason:"sessions", session_count, min_required}` telemetry |
| lock acquire (force→priorMtime else `tryAcquireConsolidationLock`) (autoDream.ts:173–190) | @448583–448595 | **Evolved**: adds `tengu_auto_dream_skipped {reason:"lock"}` on null |
| `tengu_auto_dream_fired {hours_since, sessions_since}` (autoDream.ts:195–198) | @448598–448599 | **Evolved**: adds `team_memory_enabled` key |
| `registerDreamTask` (autoDream.ts:204) | `AY4` @399416 / @448602 | Preserved |
| fork: `runForkedAgent({querySource:"auto_dream", canUseTool, onMessage})` (autoDream.ts:224–233) | `xZ({...})` @448623–448633 | **Evolved**: adds `skipCacheWrite: D$$()` |
| `completeDreamTask` + inline "Improved" msg (autoDream.ts:235–248) | `fY4` + `CT8(...){verb:"Improved"}` @448634–448638 | **Evolved**: also pushes `pendingMemoryUpdates {source:"dream", summary, paths}` @448639–448649 |
| `tengu_auto_dream_completed {cache_read, cache_created, output, sessions_reviewed}` (autoDream.ts:252–257) | @448654–448663 | **Evolved**: adds `daily_logs_found, files_touched_count, team_memory_enabled` |
| catch: abort→return; else `failDreamTask` + `rollbackConsolidationLock` (autoDream.ts:258–271) | @448664–448674 | **Evolved**: `tengu_auto_dream_failed {phase, error_class}` (was payload-less) |
| `makeDreamProgressWatcher` onMessage (autoDream.ts:281–313) | `eg_` @448678+ | **Evolved**: also parses `rm`/`Remove-Item` `.md` deletions, not just Edit/Write |
| **Lock module** (`consolidationLock.ts`) | | |
| `LOCK_FILE = '.consolidate-lock'` (consolidationLock.ts:16) | `qE_ = ".consolidate-lock"` @399401 | Preserved |
| `HOLDER_STALE_MS = 60*60*1000` (consolidationLock.ts:19) | `KE_ = 3600000` @399402 | Preserved (1 hr) |
| `lockPath` (consolidationLock.ts:21–23) | `JQ6` @399347–399348 (`join(TA(), qE_)`) | Renamed |
| `readLastConsolidatedAt` (mtime, 0 if absent) (consolidationLock.ts:29–36) | `_Z8` @399350–399356 | Preserved (mtime IS lastConsolidatedAt) |
| `tryAcquireConsolidationLock` (consolidationLock.ts:46–84) | `_Y4` @399357–399379 | Preserved (PID-live guard `Av()` + race re-verify) |
| `rollbackConsolidationLock` (consolidationLock.ts:91–108) | `zZ8` @399381–399393 | Preserved (0→unlink, else rewind mtime; "rollback failed" log) |
| `listSessionsTouchedSince` (consolidationLock.ts:118–124) | `zY4` @399395–399398 | Preserved (mtime > threshold, current excluded by caller) |
| `recordConsolidation` (manual /dream stamp, consolidationLock.ts:130–140) | not in this region (manual /dream is now scaffold) | See [§4](#4-v2142--v2156-delta-narrative) |
| **Task registry** (`DreamTask.ts`) | | |
| `isDreamTask` (DreamTask.ts:43–50) | `XQ6` @399413–399415 | Preserved |
| `registerDreamTask` (DreamTask.ts:52–74) | `AY4` @399416–399431 | Preserved (+`skipTranscript:true`) |
| `addDreamTurn` (DreamTask.ts:76–104) | `YY4` @399432–399443 | Preserved (phase flip on first Edit/Write) |
| `MAX_TURNS = 30` (DreamTask.ts:11) | `_E_ = 30` @399455 | Preserved |
| `completeDreamTask` (DreamTask.ts:106–120) | `fY4` @399445–399448 → emits `task_dream` | Preserved |
| `failDreamTask` (DreamTask.ts:122–130) | `OY4` @399450–399453 → emits `task_dream_failed` | Preserved |
| `DreamTask.kill` (DreamTask.ts:136–157) | task-framework kill (rewinds lock via `zZ8`) | Preserved |
| **Fork prompt** (`consolidationPrompt.ts`) | | |
| `buildConsolidationPrompt` (4 phases, consolidationPrompt.ts:10–65) | `C04` @448446–448512 | **Evolved**: adds team `ng_` block, prefix-coded log description, `S04()`/`R04()` injection points |
| header "# Dream: Memory Consolidation" (consolidationPrompt.ts:15) | @448447 | Preserved (string-identical) |
| Phase 4 "under ${MAX_ENTRYPOINT_LINES} lines AND under ~25KB" (consolidationPrompt.ts:55) | @448493 (`${B9H}` lines) | Preserved |

### 3.1 The lock protocol is 1:1

The `.consolidate-lock` protocol is the single most faithful 1:1 mapping in the whole module. Verified by
read of @399347–399402 against consolidationLock.ts:

```javascript
// ============================================
// tryAcquireConsolidationLock - PID-live staleness guard + race re-verify
// Location: cli_inner_pretty.js:399357-399379
// ============================================

// ORIGINAL (for source lookup):
async function _Y4() {
  let H = JQ6(), $, q;
  try {
    let [_, z] = await Promise.all([kC.stat(H), kC.readFile(H, "utf8")]);
    $ = _.mtimeMs; let A = parseInt(z.trim(), 10); q = Number.isFinite(A) ? A : void 0;
  } catch {}
  if ($ !== void 0 && Date.now() - $ < KE_) {
    if (q !== void 0 && Av(q)) return (N(`[autoDream] lock held by live PID ${q} ...`), null);
  }
  (await kC.mkdir(TA(), { recursive: !0 }), await kC.writeFile(H, String(process.pid)));
  let K; try { K = await kC.readFile(H, "utf8"); } catch { return null; }
  if (parseInt(K.trim(), 10) !== process.pid) return null;
  return $ ?? 0;
}

// READABLE (for understanding):
async function tryAcquireConsolidationLock() {
  const path = lockPath();
  let mtimeMs, holderPid;
  try {
    const [s, raw] = await Promise.all([stat(path), readFile(path, "utf8")]);
    mtimeMs = s.mtimeMs;
    const parsed = parseInt(raw.trim(), 10);
    holderPid = Number.isFinite(parsed) ? parsed : undefined;
  } catch {} // ENOENT — no prior lock
  if (mtimeMs !== undefined && Date.now() - mtimeMs < HOLDER_STALE_MS) {
    if (holderPid !== undefined && isProcessRunning(holderPid))
      return (logForDebugging(`[autoDream] lock held by live PID ${holderPid} ...`), null);
  }
  await mkdir(getAutoMemPath(), { recursive: true });
  await writeFile(path, String(process.pid));
  let verify; try { verify = await readFile(path, "utf8"); } catch { return null; }
  if (parseInt(verify.trim(), 10) !== process.pid) return null; // lost the race
  return mtimeMs ?? 0;
}

// Mapping: _Y4→tryAcquireConsolidationLock, JQ6→lockPath, KE_→HOLDER_STALE_MS, Av→isProcessRunning, TA→getAutoMemPath, kC→fs/promises, N→logForDebugging
```

Every invariant from consolidationLock.ts holds: mtime IS lastConsolidatedAt; PID body; 1 hr staleness
*even if the PID is live* (PID-reuse guard); two-reclaimer race resolved by re-read (loser returns null);
return value is the pre-acquire mtime for rollback.

---

## 4. v2.1.142 → v2.1.156 delta narrative

Against the v2.1.142 reference, the auto-memory subsystem is **structurally frozen**. The changes are:

### 4.1 The `/dream` skill → scaffold change (`tengu_kairos_dream` removed)

In v2.1.142, `/dream` existed as an interactive **skill/slash command** gated on the
`tengu_kairos_dream` GrowthBook flag (v2.1.142 `z8A`/`K8A`). In v2.1.156 that flag is **gone** —
`grep tengu_kairos_dream cli_inner_pretty.js` returns **0 hits** (verified). `/dream` now exists as a
**scheduled-task routine scaffold**: `As4` (@532705–532744), a YAML-fronted markdown asset with
`name: dream`, `context: fork`, *"Runs overnight (1–5am local) via the scheduled task scaffold"*. Its
prompt string `LOz = "/dream"` lives @533032, used @533003. It ships alongside two sibling scaffolds
(`/catch-up`, `/morning-checkin` `fs4` @532746) under the same routine machinery.

Critically, this scaffold has a **different 4-phase structure** from the auto-dream fork prompt `C04`:

| `As4` `/dream` scaffold (532716–532739) | `C04` auto-dream fork (448464–448498) |
|------------------------------------------|----------------------------------------|
| Phase 1: **Preparation** (review `logs/`, `sessions/`, existing topics) | Phase 1: **Orient** (`ls` dir, read MEMORY.md, `ls -R logs/`) |
| Phase 2: **Topics** (`<topic-slug>.md`, resolve contradictions) | Phase 2: **Gather recent signal** (session logs, drifted memories, narrow grep) |
| Phase 3: **Rules & Learnings** (`learnings/<slug>.md`) | Phase 3: **Consolidate** (write/update topic files, relative→absolute dates) |
| Phase 4: **Prioritization & Pruning** (`MEMORY.md` < 200 lines) | Phase 4: **Prune and index** (`MEMORY.md` < 200 lines AND < 25 KB) |

The scaffold introduces a `learnings/<learning-slug>.md` taxonomy that the auto-dream fork prompt
does **not** have. These are now two genuinely distinct dream surfaces (plus the tiny-pruning prompt
`VFK`), not renames of each other.

### 4.2 Obfuscated-name rotation (no behavior change)

Per the dossier, every symbol kept its v2.1.142 semantics but rotated its obfuscated identifier:

- memdir: `c5$ → sM$` (loadMemoryPrompt), `VK6 → eM6` (buildMemoryLines), `yVK → ZFK` (tiny single),
  `hVK → GFK` (tiny dual), `IVK → TFK` (simple), `SVK → VFK` (tiny prune), `oi$ → q68` (truncate),
  `PKH → g9H` (ensureDir), `jl → Yr` (logCounts), `x9 → M1` (isAutoMemoryEnabled), `VTK → EUK`
  (validateMemoryPath), `UY → TA` (getAutoMemPath).
- extraction: module `b85 → lT8`, factory `M$5 → Bg_`, validator `DO8 → cT8`.
- auto-dream: entry `nr7 → U04`, runner `cr7 → B04`, factory `lr7 → p04`, fork prompt `SL$ → C04`,
  lock helpers `jd7/tf8/sf8 → _Y4/zZ8/_Z8`.

### 4.3 What is byte/structurally identical to v2.1.142

- **Threshold defaults** 24 h / 5 sessions (`x04` @448742); **scan throttle** 600000 ms (`og_` @448715);
  **lock** `.consolidate-lock` (`qE_` @399401) / 1 hr stale (`KE_ = 3600000` @399402).
- **Dispatcher shape** — the 6-branch first-match `sM$` (cowork-verbatim, simple, tiny, team, single, disabled).
- **canUseTool ladder** — REPL/Read/Grep/Glob/read-only-Bash/bounded-rm/Edit-Write-md ladder (`cT8`).
- **Cursor + skip-ladder semantics** — `Cg_` direct-write skip, `bg_` no-prose skip, `tengu_bramble_lintel`
  throttle (default 1), compaction fallback in `Ig_`.
- **Telemetry payload shapes** — `tengu_extract_memories_extraction`, `tengu_auto_dream_fired/completed/skipped/failed`,
  `tengu_memdir_disabled`, `tengu_auto_mem_tool_denied`.
- **memory_update label** — `BQ_ = {dream: "Background memory consolidation"}` @446768.
- **Tiny-memory variant** present (`_D()`/`tengu_billiard_aviary`).
- **`/toggle-memory`** still gated-off by default (`isEnabled:()=>!1`).

---

## 5. Where the v2.1.88 trail runs cold

The v2.1.88 named TypeScript is the cleanest readable reference, but several things shipped in v2.1.156
have **no v2.1.88 analog**. These are flagged honestly as "trail runs cold" — they were introduced in
the v2.1.13x–14x experimentation window and exist only in obfuscated form, cross-validated against the
v2.1.142 reference rather than against named TS:

1. **No-prose skip gate** (`k04`/`v04`/`bg_` @448123–448133, `MIN_USER_PROSE_TOKENS = 3` @448388,
   `tengu_extract_memories_skipped_no_prose` @448277). The v2.1.88 `runExtraction`
   (extractMemories.ts:329–386) has only the direct-write skip and the throttle — **there is no prose
   gate in the v2.1.88 source**. This is a genuine behavioral addition: extraction now also skips turns
   with no ≥3-token user text since the cursor. Cross-validated against v2.1.142 (present there too).

2. **Tiny-memory mode end-to-end** (`_D()`/`tengu_billiard_aviary`; builders `ZFK`/`GFK`/`VFK`;
   `TINY_MEMORY_TYPES` `oM6`; tiny-mode Edit denial in `cT8` @448221). The v2.1.88 tree taught only the
   non-tiny four-type taxonomy. Tiny mode (immutable one-fact files, delete-and-recreate) is v2.1.14x+.

3. **CCR cohort sentinel** (`h88` @142123–142129, `tengu_sepia_cormorant` + `tengu_umber_petrel`) and the
   **`/toggle-memory` session flag** (`XR()`). Neither appears in v2.1.88 `paths.ts`/`memdir.ts`.

4. **Simple-system-prompt + cowork-verbatim dispatcher branches** (`X3()` simple-eligibility,
   `CLAUDE_COWORK_MEMORY_GUIDELINES` verbatim branch, builder `TFK`). v2.1.88's `loadMemoryPrompt` has
   neither — its source has KAIROS (now removed) and TEAMMEM/auto/disabled.

5. **Auto-dream server-side opt-in layer** (`QT8` @448000–448004: `enabled` OR `available` OR `$68()`).
   The v2.1.88 `config.ts` `isAutoDreamEnabled` (config.ts:13–21) only reads `setting ?? onyx.enabled` —
   it has **no `available` field and no `$68()` team-memory-server fallback**. Verified:
   `grep "available" src/services/autoDream/` returns nothing.

6. **`pendingMemoryUpdates` ambient-context queue** (push @448639–448649, `source:"dream"`,
   `BQ_` labels @446768, drainer renders a next-turn `isMeta` system message). The v2.1.88
   `autoDream.ts` (autoDream.ts:235–248) emits only the inline "Improved N memories" message — there is
   **no ambient `memory_update` queue** in the v2.1.88 source. This is a v2.1.14x surface.

7. **The `/dream` scaffold `As4`** (@532705–532744) with its `learnings/<slug>.md` taxonomy and the
   `/catch-up` / `/morning-checkin` sibling routines. The v2.1.88 tree has a KAIROS `/dream` *skill*
   (the daily-log distiller referenced in memdir.ts:324) but not the scheduled-routine scaffold form.

8. **`skipCacheWrite: D$$()`** passed to `runForkedAgent` in both extraction (@448301) and dream
   (@448632). Not present in the v2.1.88 `runForkedAgent` call sites in either service.

For everything else — the lock protocol, the truncation algorithm, the canUseTool spine, the cursor
helpers, the task registry, the 4-phase fork prompt skeleton, the 24/5 thresholds, the disabled-branch
telemetry — the v2.1.88 named source is a faithful 1:1 reference, and the mappings above are HIGH
confidence.

---

## 6. Verdict

**On-disk and runtime semantics are forward-compatible from v2.1.88 through v2.1.156.** Every cap
(`200` lines / `25000` bytes), every validator (`EUK` path security, `cT8` tool gating, `_Y4` lock
race-safety), every threshold (24 h / 5 sessions / 600 s scan / 1 hr stale), and every telemetry payload
shape is preserved or strictly extended.

**The v2.1.142 → v2.1.156 delta is essentially a name rotation plus the `/dream` skill→scaffold swap.**
The only flag removed is `tengu_kairos_dream`; the only structural change is that `/dream` migrated from
an interactive feature-gated skill to a scheduled-routine scaffold (`As4`) with its own distinct 4-phase
prompt — leaving the background auto-dream scheduler (`B04`/`C04`) untouched.

**Confidence: HIGH.** Each of the eight v2.1.156 column anchors above was re-read directly from the
bundle; the lock, truncation, dispatcher, canUseTool, and task-registry mappings are bit-faithful to the
v2.1.88 source; and every "trail runs cold" item in [§5](#5-where-the-2188-trail-runs-cold) is flagged
rather than papered over.
