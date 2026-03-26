# Cross Validation Report - Final (Claude Code 2.1.76)

> Complete symbol verification against source code for 08_subagent and 26_background_agents modules.

---

## Verification Method

1. **Source Code Lookup** - Read actual function definitions from chunks.*.mjs
2. **Behavioral Verification** - Trace call chains and parameter usage
3. **Cross-Reference** - Verify consistent naming across multiple files
4. **Signature Matching** - Compare function signatures with documentation

---

## Subagent Core Symbols (08_subagent)

### Agent Tool (QW6)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512-1541 | ✓ Verified - Tool object with prompt, call, inputSchema, outputSchema |
| `r4` | TOOL_NAME_AGENT | chunks.40.mjs:406 | ✓ Verified - Constant "Agent" |
| `I46` | TOOL_ALIAS_TASK | chunks.136.mjs:1531 | ✓ Verified - Alias for Agent tool |
| `aVY` | agentInputSchema | chunks.136.mjs:1444-1450 | ✓ Verified - Base input schema |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451-1460 | ✓ Verified - Teammate mode schema with name, team_name, mode |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492-1510 | ✓ Verified - Union of completed, async_launched, queued_to_running |
| `xx8` | getAgentInputSchema | chunks.136.mjs:1461-1467 | ✓ Verified - Dynamic schema based on background disabled flag |

### Agent Loop (qh)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565-1759 | ✓ Verified - Async generator with all parameters |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561-1563 | ✓ Verified - Checks message types for recording |
| `Yh` | llmMessageLoop | chunks.148.mjs | ✓ Verified - Inner LLM processing loop |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788-1803 | ✓ Verified - Filters orphaned tool results |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806-1815 | ✓ Verified - Builds system prompt for agent |
| `NvY` | resolveSkillByName | chunks.133.mjs:1817-1828 | ✓ Verified - Resolves skill from registry |

### Teammate Execution

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qn4` | spawnTeammate | chunks.135.mjs:1116-1118 | ✓ Verified - Delegates to pNY |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110-1114 | ✓ Verified - Routes to backend (splitpane/tmux) |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483-1568 | ✓ Verified - Priority poll loop |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571-1659 | ✓ Verified - In-process teammate runner |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464-1480 | ✓ Verified - Claims task from shared list |

### Mailbox System

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3-14 | ✓ Verified - Reads messages from mailbox file |
| `pY6` | readUnreadMessages | chunks.132.mjs:16-20 | ✓ Verified - Filters for unread only |
| `x3` | writeToMailbox | chunks.132.mjs:22-55 | ✓ Verified - Writes with file locking |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57-90 | ✓ Verified - Marks single message as read |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92-126 | ✓ Verified - Marks all messages as read |
| `$TY` | clearMailbox | chunks.132.mjs:128-139 | ✓ Verified - Clears all messages |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141-151 | ✓ Verified - Formats as XML tags |
| `Ec6` | createIdleNotification | chunks.132.mjs:153-164 | ✓ Verified - Creates idle notification object |
| `yc6` | parseIdleNotification | chunks.132.mjs:166-172 | ✓ Verified - Parses idle notification |

### Agent Definitions

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `q96` | GENERAL_PURPOSE_AGENT | chunks.93.mjs:1681 | ✓ Verified - Default general-purpose agent definition |
| `QB` | EXPLORE_AGENT | chunks.93.mjs:1871 | ✓ Verified - Read-only codebase exploration |
| `x01` | PLAN_AGENT | chunks.93.mjs:1944 | ✓ Verified - Software architect planning |
| `X_4` | STATUSLINE_SETUP_AGENT | chunks.93.mjs:1694 | ✓ Verified - Status line configuration |
| `G_4` | CLAUDE_CODE_GUIDE_AGENT | chunks.93.mjs:2040 | ✓ Verified - Claude Code help agent |

---

## Background Agent Symbols (26_background_agents)

### Task ID Generation

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410-2416 | ✓ Verified - 8 random chars with type prefix |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406-2408 | ✓ Verified - Returns prefix from V$3 or "x" |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402-2404 | ✓ Verified - Checks completed/failed/killed |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438-2444 | ✓ Verified - Maps types to prefixes |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified - "0123456789abcdefghijklmnopqrstuvwxyz" |

### Task Record Creation

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `RG` | createTaskRecord | chunks.41.mjs:2418-2430 | ✓ Verified - Creates initial task record |
| `g2` | getOutputFilePath | chunks.41.mjs:2248+ | ✓ Verified - Returns .claude/tasks/<id>.output |

### Task State Management

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003-3017 | ✓ Verified - Atomic task state update |
| `Zf` | registerTask | chunks.90.mjs:3019-3035 | ✓ Verified - Adds to state + telemetry |
| `VR` | removeTask | chunks.90.mjs:3037-3051 | ✓ Verified - Removes if terminal + notified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053-3056 | ✓ Verified - Filters for running status |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058-3085 | ✓ Verified - Polls output files |
| `OY4` | updateTaskState | chunks.90.mjs:3087-3109 | ✓ Verified - Applies poll results |

### Task Lifecycle Functions

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012-2027 | ✓ Verified - Aborts task with cleanup |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029-2032 | ✓ Verified - Kills all running local_agent |
| `d4q` | markTaskKilled | chunks.146.mjs:2034-2043 | ✓ Verified - Sets notified flag |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100-2115 | ✓ Verified - Sets completed status |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117-2131 | ✓ Verified - Sets failed status |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059-2098 | ✓ Verified - Updates progress + sends telemetry |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045-2057 | ✓ Verified - Updates progress keeping summary |

### Task Creation

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133-2163 | ✓ Verified - Creates background task |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165-2199 | ✓ Verified - Creates foreground task |

### Output File System

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Y91` | OutputBuffer | chunks.41.mjs:2252-2308 | ✓ Verified - Buffered output file writer |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325-2346 | ✓ Verified - Reads incremental output |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified - Returns output file path |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | ✓ Verified - Flushes output buffer |

---

## Tool Filtering Symbols

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568-1588 | ✓ Verified - Filters tools based on agent type |
| `_c` | applyToolFilters | chunks.93.mjs:1590-1644 | ✓ Verified - Apply whitelist/blacklist |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified - Set of excluded tools |
| `xV8` | BUILTIN_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified - Copy of CW6 for built-in |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified - Tools allowed for async agents |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | ✓ Verified - Team/cron tools for delegates |

### Tool Set Contents (from chunks.91.mjs:269)

```javascript
// CW6 - Background Agent Excluded Tools
CW6 = new Set([
    "TaskOutput",      // $C - Could create polling loops
    "ExitPlanMode",    // aJ - Requires user approval
    "EnterPlanMode",   // dt - Requires user approval
    "Agent",           // r4 - Could spawn nested agents
    "AskUserQuestion", // Fw - Would block indefinitely
    "TaskStop"         // OC - Background shouldn't manage tasks
])

// eP1 - Async Agent Allowed Tools
eP1 = new Set([
    "Read",        // s7
    "WebSearch",   // jv
    "TodoWrite",   // MB
    "Grep",        // N9
    "WebFetch",    // sO
    "Glob",        // qz
    "Bash",        // ... (via ZU spread)
    "Edit",        // R4
    "Write",       // _K
    "NotebookEdit",// bJ
    "Skill",       // oH
    // ... more
])

// WY4 - Team Delegate Tools
WY4 = new Set([
    "TaskCreate",  // TR
    "TaskGet",     // lt
    "TaskList",    // it
    "TaskUpdate",  // ck
    "SendMessage", // hI
    "CronCreate",  // ER
    "CronDelete",  // ed
    "CronList"     // SW6
])
```

---

## System Reminder Integration Symbols

### Attachment Producers

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033-1048 | ✓ Verified - Gets all task attachments |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942-948 | ✓ Verified - Creates attachment wrapper |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified - Polls and returns attachments |

---

## Abort Signal Propagation

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Wm` | createChildAbortController | chunks.58.mjs:1775 | ✓ Verified - Creates child from parent |
| `R61` | createChildAbortController | chunks.6.mjs:465 | ✓ Verified - Alternative location |

---

## Corrections from Previous Versions

### Symbol Corrections

| Previous Mapping | Correct Mapping | Reason |
|-----------------|-----------------|--------|
| `TIY` = `countTurnsSinceLastProgress` | `TIY` = `countUniqueUris` | TIY counts file URIs in LSP operations, not progress throttling |
| `yjA` = `markTaskCompleted` | `$m8` = `markTaskCompleted` | yjA is a constant (67108864), not a function |
| `CjA` = `markTaskFailed` | `Hm8` = `markTaskFailed` | CjA is a constant (5242880), not a function |
| `Kd7` = `killAllRunningAgents` | `U4q` = `killAllLocalAgents` | Kd7 is crypto module export |
| `na` = `killTask` | `x66` = `triggerAbortSignal` | na is wf7.diff function |
| `c5` = `atomicUpdateTask` | `i9` = `atomicUpdateTask` | c5 is incorrect mapping |
| `bZ` = `registerTask` | `Zf` = `registerTask` | bZ is incorrect mapping |

### Location Corrections

| Symbol | Previous Location | Correct Location |
|--------|------------------|------------------|
| `Z97` | chunks.89.mjs | chunks.41.mjs:2325+ |
| `Qn4` | chunks.146.mjs:2133 | ✓ Confirmed |
| `Un4` | chunks.146.mjs:2165 | ✓ Confirmed |

---

## Verification Summary

| Category | Verified Count | Corrections |
|----------|---------------|-------------|
| Agent Tool | 7 | 0 |
| Agent Loop | 6 | 0 |
| Teammate Execution | 5 | 0 |
| Mailbox System | 9 | 0 |
| Agent Definitions | 5 | 0 |
| Task ID | 5 | 0 |
| Task State | 6 | 0 |
| Task Lifecycle | 7 | 0 |
| Task Creation | 2 | 0 |
| Output File System | 4 | 0 |
| Tool Filtering | 6 | 0 |
| System Reminder | 3 | 0 |
| Abort Signal | 2 | 0 |
| **Total** | **67** | **7** |

---

## Confidence Levels

| Level | Symbols | Confidence |
|-------|---------|------------|
| High | All verified symbols | 100% - Direct source code verification |
| Medium | None | N/A |
| Low | None | N/A |

---

## Source Code Files Referenced

| File | Content |
|------|---------|
| chunks.133.mjs | Agent loop, fork context, system prompt |
| chunks.136.mjs | AgentTool definition |
| chunks.146.mjs | Task lifecycle, kill mechanism |
| chunks.132.mjs | Mailbox system |
| chunks.41.mjs | Task ID, task record, output files |
| chunks.90.mjs | Task state management |
| chunks.93.mjs | Agent definitions, tool filtering |
| chunks.91.mjs | Tool set constants |
| chunks.134.mjs | Teammate execution |
| chunks.147.mjs | Attachment producers |
| chunks.58.mjs | Abort controller |

---

## Related Documents

- [../08_subagent/README.md](../08_subagent/README.md) - Subagent module overview
- [../26_background_agents/README.md](../26_background_agents/README.md) - Background agents overview
- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols

---

**Last Verified**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All 67 symbols verified with source code