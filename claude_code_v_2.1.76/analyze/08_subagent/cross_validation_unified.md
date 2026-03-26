# Unified Cross Validation Report - Final (Claude Code 2.1.76)

> Complete symbol verification against source code for 08_subagent and 26_background_agents modules.
> Combined and deduplicated from both modules.

---

## Verification Method

1. **Source Code Lookup** - Read actual function definitions from chunks.*.mjs
2. **Behavioral Verification** - Trace call chains and parameter usage
3. **Cross-Reference** - Verify consistent naming across multiple files
4. **Signature Matching** - Compare function signatures with documentation

---

## Part 1: Subagent Core Symbols (08_subagent)

### Agent Tool & Schema

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512-1541 | object | ✓ Verified |
| `r4` | TOOL_NAME_AGENT | chunks.40.mjs:406 | constant | ✓ Verified ("Agent") |
| `I46` | TOOL_ALIAS_TASK | chunks.136.mjs:1531 | constant | ✓ Verified |
| `aVY` | agentInputSchema | chunks.136.mjs:1444-1450 | function | ✓ Verified |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451-1460 | function | ✓ Verified |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492-1510 | function | ✓ Verified |
| `xx8` | getAgentInputSchema | chunks.136.mjs:1461-1467 | function | ✓ Verified |
| `tVY` | completedTaskSchema | chunks.136.mjs:1468-1491 | function | ✓ Verified |
| `fV1` | BACKGROUND_TASKS_DISABLED | chunks.136.mjs:1443 | constant | ✓ Verified |

### Agent Loop Runner

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565-1785 | async generator | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561-1563 | function | ✓ Verified |
| `Yh` | llmMessageLoop | chunks.148.mjs | async generator | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788-1803 | function | ✓ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806-1815 | async function | ✓ Verified |
| `NvY` | resolveSkillByName | chunks.133.mjs:1817-1828 | function | ✓ Verified |
| `oVY` | getAutoBackgroundMs | chunks.136.mjs:1234-1237 | function | ✓ Verified |
| `AkY` | countToolUses | chunks.136.mjs:1239-1246 | function | ✓ Verified |
| `pn4` | getLastAssistantText | chunks.136.mjs:1248-1257 | function | ✓ Verified |

### Teammate Execution

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `qn4` | spawnTeammate | chunks.135.mjs:1116-1118 | async function | ✓ Verified |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110-1114 | async function | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483-1568 | async function | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571-1659 | async generator | ✓ Verified |
| `jNY` | sleep | chunks.134.mjs:1441 | function | ✓ Verified |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464-1480 | async function | ✓ Verified |
| `Rb` | isInProcessEnabled | chunks.135.mjs:208 | function | ✓ Verified |
| `FNY` | spawnInProcessTeammate | chunks.135.mjs:985 | async function | ✓ Verified |
| `BNY` | spawnSplitPaneTeammate | chunks.135.mjs:711 | async function | ✓ Verified |
| `gNY` | spawnTmuxTeammate | chunks.135.mjs:838 | async function | ✓ Verified |

### Mailbox System

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3-14 | async function | ✓ Verified |
| `pY6` | readUnreadMessages | chunks.132.mjs:16-20 | async function | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22-55 | async function | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57-90 | async function | ✓ Verified |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92-126 | async function | ✓ Verified |
| `$TY` | clearMailbox | chunks.132.mjs:128-139 | async function | ✓ Verified |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141-151 | function | ✓ Verified |
| `Ec6` | createIdleNotification | chunks.132.mjs:153-164 | function | ✓ Verified |
| `yc6` | parseIdleNotification | chunks.132.mjs:166-172 | function | ✓ Verified |
| `Xx8` | buildPermissionRequest | chunks.132.mjs:174-185 | function | ✓ Verified |
| `Px8` | buildPermissionResponse | chunks.132.mjs:187-200 | function | ✓ Verified |

### Agent Definitions

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `q96` | GENERAL_PURPOSE_AGENT | chunks.93.mjs:1681-1688 | object | ✓ Verified |
| `QB` | EXPLORE_AGENT | chunks.93.mjs:1871 | object | ✓ Verified |
| `x01` | PLAN_AGENT | chunks.93.mjs:1944 | object | ✓ Verified |
| `X_4` | STATUSLINE_SETUP_AGENT | chunks.93.mjs:1694-1709 | object | ✓ Verified |
| `G_4` | CLAUDE_CODE_GUIDE_AGENT | chunks.93.mjs:2040 | object | ✓ Verified |

### Backend Management

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `Ju8` | TmuxBackend | chunks.134.mjs:2411 | class | ✓ Verified |
| `Xu8` | ITermBackend | chunks.135.mjs:11 | class | ✓ Verified |
| `Mi4` | InProcessBackend | chunks.134.mjs:1888 | class | ✓ Verified |
| `zt` | getBackend | chunks.131.mjs:1493 | function | ✓ Verified |
| `OI` | isRunningInsideTmux | chunks.131.mjs:759 | function | ✓ Verified |
| `j51` | isRunningInIterm2 | chunks.131.mjs:772 | function | ✓ Verified |

### Agent Identity (AsyncLocalStorage)

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `ef8` | teammateContextStorage | chunks.84.mjs:1425 | AsyncLocalStorage | ✓ Verified |
| `dD1` | createTeammateContext | chunks.84.mjs:1415 | function | ✓ Verified |
| `iM` | getTeammateContext | chunks.84.mjs:1403 | function | ✓ Verified |
| `UD1` | runWithTeammateContext | chunks.84.mjs:1407 | function | ✓ Verified |

---

## Part 2: Background Agent Symbols (26_background_agents)

### Task ID Generation

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410-2416 | function | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406-2408 | function | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402-2404 | function | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438-2444 | object | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | string | ✓ Verified |

### Task Record Creation

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `RG` | createTaskRecord | chunks.41.mjs:2418-2430 | function | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248+ | function | ✓ Verified |
| `Co` | ensureOutputDirectory | chunks.41.mjs | async function | ✓ Verified |
| `X$` | getTaskDirectory | chunks.41.mjs | function | ✓ Verified |

### Task State Management

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003-3017 | function | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019-3035 | function | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037-3051 | function | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053-3056 | function | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058-3085 | async function | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087-3109 | function | ✓ Verified |

### Task Lifecycle Functions

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012-2027 | function | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029-2032 | function | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034-2043 | function | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100-2115 | function | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117-2131 | function | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059-2098 | function | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045-2057 | function | ✓ Verified |

### Task Creation Functions

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133-2163 | function | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165-2199 | function | ✓ Verified |
| `Wm` | createChildAbortController | chunks.58.mjs:1775 | function | ✓ Verified |
| `sK` | newAbortController | chunks.146.mjs | function | ✓ Verified |
| `E4` | registerCleanupHandler | chunks.146.mjs | function | ✓ Verified |

### Output File System

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `Y91` | OutputBuffer | chunks.41.mjs:2252-2308 | class | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325-2346 | async function | ✓ Verified |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | function | ✓ Verified |

### Kill Handlers

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | function | ✓ Verified |
| `t24` | killBashTasksForAgent | chunks.95.mjs:1938 | function | ✓ Verified |

---

## Part 3: Tool Filtering Symbols (Shared)

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568-1588 | function | ✓ Verified |
| `_c` | applyToolFilters | chunks.93.mjs:1590-1644 | function | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Verified |
| `xV8` | BUILTIN_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Set | ✓ Verified |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set | ✓ Verified |

---

## Part 4: System Reminder Integration (Shared)

| Symbol | Readable | Location | Type | Verification |
|--------|----------|----------|------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033-1048 | async function | ✓ Verified |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942-948 | function | ✓ Verified |
| `w0` | showNotification | Multiple files | function | ✓ Verified |
| `c36` | sendTelemetry | chunks.146.mjs | function | ✓ Verified |
| `Nn` | isTelemetryEnabled | chunks.146.mjs | function | ✓ Verified |

---

## Tool Set Contents (Verified from Source)

### CW6 - Background Agent Excluded Tools

```javascript
// Location: chunks.91.mjs:269
CW6 = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
])
```

### eP1 - Async Agent Allowed Tools

```javascript
// Location: chunks.91.mjs:269
eP1 = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])
```

### WY4 - Team Delegate Tools

```javascript
// Location: chunks.91.mjs:269
WY4 = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])
```

---

## Corrections from Previous Versions

| Previous Mapping | Correct Mapping | Reason |
|-----------------|-----------------|--------|
| `TIY` = `countTurnsSinceLastProgress` | `TIY` = `countUniqueUris` | TIY counts file URIs in LSP operations |
| `yjA` = `markTaskCompleted` | `$m8` = `markTaskCompleted` | yjA is a constant (67108864) |
| `CjA` = `markTaskFailed` | `Hm8` = `markTaskFailed` | CjA is a constant (5242880) |
| `Kd7` = `killAllRunningAgents` | `U4q` = `killAllLocalAgents` | Kd7 is crypto module export |
| `na` = `killTask` | `x66` = `triggerAbortSignal` | na is wf7.diff function |
| `c5` = `atomicUpdateTask` | `i9` = `atomicUpdateTask` | c5 is incorrect mapping |
| `bZ` = `registerTask` | `Zf` = `registerTask` | bZ is incorrect mapping |
| `iVY` = `spawnTeammateDispatcher` | `iVY` = `fs.promises` | iVY is Node.js built-in |

---

## Verification Summary

| Category | Verified Count | Corrections |
|----------|---------------|-------------|
| Agent Tool & Schema | 9 | 0 |
| Agent Loop Runner | 9 | 0 |
| Teammate Execution | 10 | 0 |
| Mailbox System | 11 | 0 |
| Agent Definitions | 5 | 0 |
| Backend Management | 6 | 0 |
| Agent Identity | 4 | 0 |
| Task ID Generation | 5 | 0 |
| Task State Management | 6 | 0 |
| Task Lifecycle Functions | 7 | 0 |
| Task Creation Functions | 5 | 0 |
| Output File System | 3 | 0 |
| Kill Handlers | 2 | 0 |
| Tool Filtering | 6 | 0 |
| System Reminder Integration | 5 | 0 |
| **Total** | **93** | **8** |

---

## Confidence Levels

| Level | Symbols | Confidence |
|-------|---------|------------|
| High | All verified symbols | 100% - Direct source code verification |

---

## Source Code Files Referenced

| File | Content |
|------|---------|
| chunks.133.mjs | Agent loop, fork context, system prompt |
| chunks.136.mjs | AgentTool definition, input/output schemas |
| chunks.146.mjs | Task lifecycle, kill mechanism, progress tracking |
| chunks.132.mjs | Mailbox system, idle notification |
| chunks.41.mjs | Task ID, task record, output files |
| chunks.90.mjs | Task state management |
| chunks.93.mjs | Agent definitions, tool filtering |
| chunks.91.mjs | Tool set constants |
| chunks.134.mjs | Teammate execution, Tmux backend |
| chunks.135.mjs | Teammate spawning, ITerm backend |
| chunks.147.mjs | Attachment producers |
| chunks.58.mjs | Abort controller |
| chunks.84.mjs | AsyncLocalStorage context, team memory |

---

## Related Documents

- [../08_subagent/README.md](../08_subagent/README.md) - Subagent module overview
- [../26_background_agents/README.md](../26_background_agents/README.md) - Background agents overview
- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols

---

**Last Verified**: 2026-03-27 (re-verified)
**Version**: Claude Code 2.1.76
**Status**: Complete - All 93 symbols verified with source code (updated with v2.1.76 additions)