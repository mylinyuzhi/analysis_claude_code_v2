# Symbol Additions — v2.1.193 — Background Agents & Subagent Depth (EXTEND)

> These symbols route to **[symbol_index_core_features.md](./symbol_index_core_features.md)** (the **Background Agents** module is its home; the subagent-depth filter/registry symbols sit on the agent-execution path but are indexed with the Background Agents feature here for locality).
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every line was re-derived in the live 193 bundle for this round; obfuscated names are re-mangled per build and are **never** assumed to carry across versions. Where a symbol is *carryover* (present in v2.1.183 with a different obf token), the 183 obf name is noted in the readable column for traceability.

## Module: Background Agents — memory-pressure idle bg-shell reaping (NET-NEW 2.1.193)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Mgl` | `registerBgShellPressureReaper` | cli_inner_pretty.js:454354 | function |
| `Ldu` | `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (env getter) | cli_inner_pretty.js:43175 | function |
| `Ldu` | `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (parse, `Fe.bool()`) | cli_inner_pretty.js:43538 | variable |
| `eof` | `BG_SHELL_IDLE_REAP_MS` (= 1800000) | cli_inner_pretty.js:454610 | constant |
| `VI` | `getLastInteractionTime` | cli_inner_pretty.js:2784 | function |
| `umr` | `isMainLoopBusy` | cli_inner_pretty.js:3647 | function |
| `Tr` | `isRemoteMode` | cli_inner_pretty.js:3061 | function |
| `e8e` | `hasActiveAgentTasks` | cli_inner_pretty.js:587048 | function |
| `R4f` | `ACTIVE_AGENT_TASK_TYPES` (Set) | cli_inner_pretty.js:587093 | constant |
| `o8t` | `notifyAndFinalizeShellTask` | cli_inner_pretty.js:454302 | function |
| `BSe` | `killLocalShellTask` | cli_inner_pretty.js:382320 | function |
| `g9e` | `registerKeepalive` | cli_inner_pretty.js:453737 | function |
| `h9e` | `deregisterKeepalive` | cli_inner_pretty.js:453744 | function |
| `xPe` | `launchBackgroundLocalBash` | cli_inner_pretty.js:454369 | function |
| `Kzn` | `backgroundRunningShellTask` | cli_inner_pretty.js:454527 | function |

## Module: Background Agents — subagent depth tracking (NET-NEW + body-change 2.1.187)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FBt` | `SUBAGENT_DEPTH_LIMIT` (= 5; carryover of 183 `v1i`@221800) | cli_inner_pretty.js:229871 | constant |
| `K3` | `getAgentDepth` (carryover of 183 `Gz`@103152) | cli_inner_pretty.js:103808 | function |
| `Kl` | `isLocalAgentTask` (carryover of 183 `od`@445761) | cli_inner_pretty.js:453726 | function |
| `RPe` | `SubagentLaunchError` (Error subclass thrown by depth cap) | cli_inner_pretty.js:430357 | class |
| `Re` | `logFeatureError` (emits `tengu_feature_bad` with `feature_name`/`error_code`; call `Re("subagent_launch","subagent_depth_cap")`@430480) | cli_inner_pretty.js:44848 | function |

## Module: Background Agents — agent stop lifecycle (NET-NEW 2.1.191) + turn-end finalizer (CARRYOVER)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Mde` | `markAgentStoppedByUser` | cli_inner_pretty.js:431808 | function |
| `CXp` | `persistStopMarker` | cli_inner_pretty.js:431816 | function |
| `Hre` | `readAgentDiskState` | cli_inner_pretty.js:581895 | function |
| `Tde` | `writeAgentDiskState` | cli_inner_pretty.js:581867 | function |
| `t7l` | `agentStateMetaPath` (builds `<agentId>.meta.json`; `Mx(e).replace(/\.jsonl$/, ".meta.json")` — the real path join) | cli_inner_pretty.js:581864 | function |
| `Ou` | `agentDiskStatePath` (identity passthrough of agentId in this build; the `.meta.json` path is joined by `t7l`@581864 inside Hre/Tde) | cli_inner_pretty.js:1792 | function |
| `Vht` | `AgentStoppedError` (thrown on resume of a stopped agent) | cli_inner_pretty.js:441779 | class |
| `Exo` | `markReplayNoOp` / `finalizeStuckWorkingJob` (carryover of 183 `pgo`@456114) | cli_inner_pretty.js:464591 | function |
| `Gaf` | `resetStartupJobState` (carryover) | cli_inner_pretty.js:464549 | function |
| `Waf` | `armBgStartupWedge` (carryover) | cli_inner_pretty.js:464561 | function |
| `UG` | `BG_TURN_END_NEEDS_USER` (= "send a prompt to start") | cli_inner_pretty.js:193813 | constant |

## Module: Background Agents — backgrounding & panel fixes (2.1.193 / 2.1.191)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Kr` | `currentBgCwdOverride` (returns the bg-session cwd refreshed by `/cd`) | cli_inner_pretty.js:193511 | function |
| `dSc` | `mapAgentPanelChildRows` (193 maps `kind:"frame"` children into visible child rows; 183 `JJl` filtered frames out) | cli_inner_pretty.js:674897 | function |
| `Eim` | `measureChildArtifactWidth` (193 reserves fallback width for frame-only child lists; 183 `wBf` returned `0`) | cli_inner_pretty.js:674539 | function |
| `ESc` | `buildAgentPanelRows` (headers/jobs/folds row builder for the agents panel) | cli_inner_pretty.js:674574 | function |
| `fze` | `computeCarryOverMap` | cli_inner_pretty.js:578006 | function |
| `FSc` | `agentPeekPanel` (peek/detail panel; slices child rows by overflow budget) | cli_inner_pretty.js:675223 | function |
| `H7t` | `countCarryOverTasks` | cli_inner_pretty.js:578070 | function |
| `Him` | `computeAgentPanelColumns` (age/label/artifact column width calculator) | cli_inner_pretty.js:674550 | function |
| `JKl` | `readJobDir` | cli_inner_pretty.js:577927 | function |
| `k3i` | `refreshBgJobCwdAfterCd` (bg-only state write of `cwd`/`originCwd`; called after successful `/cd`) | cli_inner_pretty.js:193514 / call 484488 | function |
| `Lgl` | `registerCompletedResumedAgent` | cli_inner_pretty.js:454100 | function |
| `oUo` | `countAbandonedBgTasks` | cli_inner_pretty.js:578073 | function |
| `Qim` | `agentRosterRow` (job row renderer; receives `childRows` from `dSc`) | cli_inner_pretty.js:675696 | function |
| `QKl` | `linkAdoptedAgentTranscript` | cli_inner_pretty.js:577951 | function |
| `R3i` | `refreshBgJobResumePointers` (bg-only state write of `resumeSessionId`/`linkScanPath`/`linkScanOffset:0`; called after conversation reset) | cli_inner_pretty.js:193529 / call 485419 | function |
| `WWn` | `getResumePrompt` (carryover) | cli_inner_pretty.js:371461 | function |
| `y_t` | `countBackgroundTasks` | cli_inner_pretty.js:485964 | function |
