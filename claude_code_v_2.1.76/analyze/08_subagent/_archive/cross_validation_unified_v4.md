# Cross Validation Unified V4 - Complete Symbol Verification (Claude Code 2.1.76)

> Complete cross-validated symbol mapping for both 08_subagent and 26_background_agents modules.
> All symbols verified against source code on 2026-03-27.

---

## Verification Method

1. **Source Code Lookup** - Read actual function definitions from chunks.*.mjs
2. **Behavioral Verification** - Trace call chains and parameter usage
3. **Cross-Reference** - Verify consistent naming across multiple files
4. **Signature Matching** - Compare function signatures with documentation

---

## Module 1: Agent Tool & Schema (chunks.136.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512 | tool object | ✓ Direct assignment |
| `r4` | TOOL_NAME_AGENT | chunks.136.mjs:1529 | constant | ✓ name property |
| `I46` | TOOL_ALIAS_TASK | chunks.136.mjs:1531 | constant | ✓ aliases array |
| `aVY` | agentInputSchema | chunks.136.mjs:1444 | function | ✓ Schema factory |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451 | function | ✓ Schema factory |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492 | function | ✓ Schema factory |
| `xx8` | getEffectiveInputSchema | chunks.136.mjs:1461 | function | ✓ Conditional schema |

---

## Module 2: Agent Loop Runner (chunks.133.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | async generator | ✓ Main agent loop |
| `Yh` | llmMessageLoop | chunks.133.mjs:1747 | async generator | ✓ Called in qh |
| `TvY` | shouldRecordMessage | chunks.133.mjs:1561 | function | ✓ Message type filter |
| `Fx8` | filterOrphanedToolResults | chunks.133.mjs:1788 | function | ✓ Remove orphaned results |
| `vvY` | buildSystemPromptForAgent | chunks.133.mjs:1806 | function | ✓ System prompt builder |
| `NvY` | resolveSkillName | chunks.133.mjs:1817 | function | ✓ Skill name resolution |

---

## Module 3: Tool Filtering (chunks.93.mjs, chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | function | ✓ Multi-stage filter |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | function | ✓ Apply whitelist/blacklist |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Excluded tools |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Set | ✓ Async whitelist |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set | ✓ Teammate tools |
| `xV8` | ASYNC_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Copy of CW6 |

### Tool Set Contents

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

CW6 = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
])

// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

eP1 = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

WY4 = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])
```

---

## Module 4: Task ID Generation (chunks.41.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | function | ✓ 8 random chars + prefix |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | function | ✓ Type prefix lookup |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | function | ✓ Status check |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | object | ✓ Prefix mapping |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | string | ✓ Charset chars |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | function | ✓ Initial record |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | function | ✓ Path builder |
| `N$3` | crypto.getRandomValues | - | function | ✓ Crypto API |

### Task Type Prefixes

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES
// Location: chunks.41.mjs:2438-2444
// ============================================

V$3 = {
    local_bash: "b",           // e.g., "b7x9k2m3"
    local_agent: "a",          // e.g., "a7x9k2m3"
    remote_agent: "r",         // e.g., "r7x9k2m3"
    in_process_teammate: "t",  // e.g., "t7x9k2m3"
    local_workflow: "w"        // e.g., "w7x9k2m3"
}

// ============================================
// G97 - TASK_ID_CHARSET
// Location: chunks.41.mjs:2434
// ============================================

G97 = "0123456789abcdefghijklmnopqrstuvwxyz"
// 36 characters = 10 digits + 26 lowercase letters
// 8 random chars = 36^8 = ~2.8 trillion combinations
```

---

## Module 5: Task State Management (chunks.90.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | function | ✓ Atomic state update |
| `Zf` | registerTask | chunks.90.mjs:3019 | function | ✓ Add to state + telemetry |
| `VR` | removeTask | chunks.90.mjs:3037 | function | ✓ Remove if terminal |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | function | ✓ Filter running |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | function | ✓ Poll output files |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | function | ✓ Apply poll results |

---

## Module 6: Task Lifecycle (chunks.146.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | function | ✓ Background task creation |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | function | ✓ Foreground task creation |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | function | ✓ Abort + cleanup |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | function | ✓ Kill all running |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | function | ✓ Set notified flag |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | function | ✓ Set completed status |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | function | ✓ Set failed status |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | function | ✓ Update progress |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | function | ✓ Progress + telemetry |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | function | ✓ Flush buffer |

---

## Module 7: Output File System (chunks.41.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | class | ✓ Buffered writer |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | function | ✓ Incremental read |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | function | ✓ Path builder |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | function | ✓ Flush buffer |
| `v$3` | getOrCreateOutputBuffer | chunks.41.mjs:2310 | function | ✓ Buffer cache |
| `W97` | appendToOutputBuffer | chunks.41.mjs:2316 | function | ✓ Append content |

---

## Module 8: Mailbox System (chunks.132.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | function | ✓ Read messages |
| `x3` | writeToMailbox | chunks.132.mjs:22 | function | ✓ Write message |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | function | ✓ Mark single read |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | function | ✓ Mark all read |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | function | ✓ Filter unread |
| `$TY` | clearMailbox | chunks.132.mjs:128 | function | ✓ Clear inbox |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141 | function | ✓ XML format |
| `Nc6` | properLockfile | chunks.132.mjs:437 | module | ✓ npm package |
| `iv1` | lockOptions | chunks.132.mjs:463 | object | ✓ Lock config |

---

## Module 9: System Reminder Integration (chunks.147.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | function | ✓ Task attachments |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942 | function | ✓ Attachment wrapper |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | function | ✓ Main orchestrator |
| `Hz` | timedAttachmentProducer | chunks.147.mjs:20 | function | ✓ Telemetry wrapper |
| `nuY` | deduplicateAttachments | chunks.147.mjs:951 | function | ✓ Dedupe by type |

---

## Module 10: Teammate Execution (chunks.134.mjs, chunks.135.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110 | function | ✓ Main dispatcher |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | function | ✓ Teammate spawn |
| `Rb` | isInProcessEnabled | chunks.135.mjs:208 | function | ✓ Check in-process |
| `FNY` | spawnInProcessTeammate | chunks.135.mjs:985 | function | ✓ In-process spawn |
| `BNY` | spawnSplitPaneTeammate | chunks.135.mjs:711 | function | ✓ Split-pane spawn |
| `gNY` | spawnTmuxTeammate | chunks.135.mjs:838 | function | ✓ Tmux spawn |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | function | ✓ Agent runner |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | function | ✓ Message poll |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464 | function | ✓ Task claiming |
| `JNY` | findNextAvailableTask | chunks.134.mjs:1445 | function | ✓ Find task |

---

## Module 11: Agent Identity (chunks.84.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `ef8` | teammateContextStorage | chunks.84.mjs:1425 | AsyncLocalStorage | ✓ Context storage |
| `dD1` | createTeammateContext | chunks.84.mjs:1415 | function | ✓ Context factory |
| `iM` | getTeammateContext | chunks.84.mjs:1403 | function | ✓ Get context |
| `UD1` | runWithTeammateContext | chunks.84.mjs:1407 | function | ✓ Run with context |

---

## Module 12: Backend Management (chunks.134.mjs, chunks.135.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Ju8` | TmuxBackend | chunks.134.mjs:2411 | class | ✓ Tmux backend |
| `Xu8` | ITermBackend | chunks.135.mjs:11 | class | ✓ ITerm backend |
| `Mi4` | InProcessBackend | chunks.134.mjs:1888 | class | ✓ In-process backend |
| `zt` | getBackend | chunks.131.mjs:1493 | function | ✓ Backend selection |
| `OI` | isRunningInsideTmux | chunks.131.mjs:759 | function | ✓ Tmux check |
| `j51` | isRunningInIterm2 | chunks.131.mjs:772 | function | ✓ ITerm check |
| `Kt` | isTmuxInstalled | chunks.131.mjs:768 | function | ✓ Install check |

---

## Verification Summary

| Category | Verified Count | Corrections |
|----------|---------------|-------------|
| Agent Tool & Schema | 7 | 0 |
| Agent Loop Runner | 6 | 0 |
| Tool Filtering | 6 | 0 |
| Task ID Generation | 8 | 0 |
| Task State Management | 6 | 0 |
| Task Lifecycle | 10 | 0 |
| Output File System | 6 | 0 |
| Mailbox System | 9 | 0 |
| System Reminder Integration | 5 | 0 |
| Teammate Execution | 10 | 0 |
| Agent Identity | 4 | 0 |
| Backend Management | 7 | 0 |
| **Total** | **84** | **0** |

---

## Corrections from Previous Versions

### Symbol Corrections

| Previous Mapping | Correct Mapping | Reason |
|-----------------|-----------------|--------|
| `TIY` = `countTurnsSinceLastProgress` | `TIY` = `countUniqueUris` | TIY counts file URIs in LSP operations |
| `yjA` = `markTaskCompleted` | `$m8` = `markTaskCompleted` | yjA is a constant (67108864) |
| `CjA` = `markTaskFailed` | `Hm8` = `markTaskFailed` | CjA is a constant (5242880) |
| `Kd7` = `killAllRunningAgents` | `U4q` = `killAllLocalAgents` | Kd7 is crypto module export |
| `na` = `killTask` | `x66` = `triggerAbortSignal` | na is wf7.diff function |
| `c5` = `atomicUpdateTask` | `i9` = `atomicUpdateTask` | c5 is incorrect mapping |
| `bZ` = `registerTask` | `Zf` = `registerTask` | bZ is incorrect mapping |
| `iVY` = `spawnTeammateDispatcher` | `pNY` = `spawnTeammateDispatcher` | iVY is fs.promises |

---

## Confidence Levels

| Level | Symbols | Confidence |
|-------|---------|------------|
| High | All verified symbols | 100% - Direct source code verification |

---

## Related Documents

- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols
- [cross_validation_final_v2.md](../26_background_agents/cross_validation_final_v2.md) - Background agent symbols

---

**Last Verified**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - 84 symbols verified across 12 modules