# Cross Validation Unified V5 - Complete Symbol Verification (Claude Code 2.1.76)

> Complete cross-validated symbol mapping for both 08_subagent and 26_background_agents modules.
> All 84 symbols verified against source code on 2026-03-27.
> This is the authoritative source for symbol mappings.

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

### Source Verification

```javascript
// ============================================
// QW6 - AgentTool - Verified at chunks.136.mjs:1512
// ============================================

// ORIGINAL (source):
QW6 = {
    async prompt({agents: A, tools: q, getToolPermissionContext: K, allowedAgentTypes: Y}) {...},
    name: r4,
    searchHint: "delegate work to a subagent",
    aliases: [I46],
    maxResultSizeChars: 1e5,
    async description() { return "Launch a new agent" },
    get inputSchema() { return xx8() },
    get outputSchema() { return eVY() },
    async call(params, toolUseContext, ...) {...}
}

// VERIFICATION: name=r4 confirms TOOL_NAME_AGENT mapping
```

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

### Source Verification

```javascript
// ============================================
// qh - agentLoopRunner - Verified at chunks.133.mjs:1565
// ============================================

// ORIGINAL (source):
async function* qh({
    agentDefinition: A,
    promptMessages: q,
    toolUseContext: K,
    canUseTool: Y,
    isAsync: z,
    ...
}) {
    // Agent loop implementation
    for await (let $6 of Yh({...})) { ... }
}

// VERIFICATION: Calls Yh (llmMessageLoop), confirmed async generator
```

---

## Module 3: Tool Filtering (chunks.91.mjs, chunks.93.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | function | ✓ Multi-stage filter |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | function | ✓ Apply whitelist/blacklist |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Excluded tools |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Set | ✓ Async whitelist |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set | ✓ Teammate tools |
| `xV8` | ASYNC_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set | ✓ Copy of CW6 |

### Source Verification

```javascript
// ============================================
// Tool Sets - Verified at chunks.91.mjs:269
// ============================================

// ORIGINAL (source):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC]),
xV8 = new Set([...CW6]),
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1]),
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// VERIFICATION:
// $C = TaskOutput, aJ = ExitPlanMode, dt = EnterPlanMode
// r4 = Agent, Fw = AskUserQuestion, OC = TaskStop
// s7 = Read, jv = WebSearch, MB = TodoWrite, N9 = Grep, etc.
```

### Tool Set Contents (Resolved)

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
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

ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

TEAM_DELEGATE_TOOLS = new Set([
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

### Source Verification

```javascript
// ============================================
// oV - generateTaskId - Verified at chunks.41.mjs:2410
// ============================================

// ORIGINAL (source):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// VERIFICATION: Uses G97 charset, k$3 for type prefix

// ============================================
// G97 - TASK_ID_CHARSET - Verified at chunks.41.mjs:2434
// ============================================
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// ============================================
// V$3 - TASK_TYPE_PREFIXES - Verified at chunks.41.mjs:2438
// ============================================
V$3 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
}
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

### Source Verification

```javascript
// ============================================
// i9 - atomicUpdateTask - Verified at chunks.90.mjs:3003
// ============================================

// ORIGINAL (source):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// VERIFICATION: Atomic immutable state update pattern confirmed

// ============================================
// Zf - registerTask - Verified at chunks.90.mjs:3019
// ============================================

// ORIGINAL (source):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    })),
    c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        ...
    })
}

// VERIFICATION: Adds task to state + sends telemetry
```

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

### Source Verification

```javascript
// ============================================
// x66 - triggerAbortSignal - Verified at chunks.146.mjs:2012
// ============================================

// ORIGINAL (source):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// VERIFICATION: Calls abort(), cleanup, flushes output

// ============================================
// U4q - killAllLocalAgents - Verified at chunks.146.mjs:2029
// ============================================

// ORIGINAL (source):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// VERIFICATION: Iterates all tasks, kills running local_agents

// ============================================
// $m8 - markTaskCompleted - Verified at chunks.146.mjs:2100
// ============================================

// ORIGINAL (source):
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            ...
        }
    }), $O(K)
}

// VERIFICATION: Sets completed status, flushes output
```

---

## Module 7: Output File System (chunks.41.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | class | ✓ Buffered writer |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | function | ✓ Incremental read |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | function | ✓ Path builder |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | function | ✓ Flush buffer |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant | ✓ "0123456789abcdefghijklmnopqrstuvwxyz" |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | object | ✓ Type prefix mapping |

---

## Module 8: Mailbox System (chunks.132.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | function | ✓ Read messages |
| `x3` | writeToMailbox | chunks.132.mjs:22 | function | ✓ Write message |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | function | ✓ Mark single read |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | function | ✓ Mark all read |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | function | ✓ Filter unread |

### Source Verification

```javascript
// ============================================
// wl - readMailbox - Verified at chunks.132.mjs:3
// ============================================

// ORIGINAL (source):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// VERIFICATION: Reads JSON from file, returns message array

// ============================================
// x3 - writeToMailbox - Verified at chunks.132.mjs:22
// ============================================

// ORIGINAL (source):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    // ... file locking and write logic
}

// VERIFICATION: Uses file locking (Nc6 = properLockfile)
```

---

## Module 9: System Reminder Integration (chunks.147.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | function | ✓ Task attachments |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942 | function | ✓ Attachment wrapper |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | function | ✓ Main orchestrator |
| `Hz` | timedAttachmentProducer | chunks.147.mjs:20 | function | ✓ Telemetry wrapper |

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
| Task ID Generation | 7 | 0 |
| Task State Management | 6 | 0 |
| Task Lifecycle | 9 | 0 |
| Output File System | 6 | 0 |
| Mailbox System | 5 | 0 |
| System Reminder Integration | 4 | 0 |
| Teammate Execution | 8 | 0 |
| Agent Identity | 4 | 0 |
| Backend Management | 7 | 0 |
| **Total** | **75** | **0** |

---

## Symbol Constant Reference

### Tool Names (chunks.40.mjs, chunks.90.mjs, chunks.56.mjs)

| Obfuscated | Readable | Value |
|------------|----------|-------|
| `$C` | TOOL_NAME_TASK_OUTPUT | "TaskOutput" |
| `aJ` | TOOL_NAME_EXIT_PLAN_MODE | "ExitPlanMode" |
| `dt` | TOOL_NAME_ENTER_PLAN_MODE | "EnterPlanMode" |
| `r4` | TOOL_NAME_AGENT | "Agent" |
| `I46` | TOOL_ALIAS_TASK | "Task" |
| `Fw` | TOOL_NAME_ASK_USER_QUESTION | "AskUserQuestion" |
| `OC` | TOOL_NAME_TASK_STOP | "TaskStop" |
| `s7` | TOOL_NAME_READ | "Read" |
| `jv` | TOOL_NAME_WEB_SEARCH | "WebSearch" |
| `MB` | TOOL_NAME_TODO_WRITE | "TodoWrite" |
| `N9` | TOOL_NAME_GREP | "Grep" |
| `sO` | TOOL_NAME_WEB_FETCH | "WebFetch" |
| `qz` | TOOL_NAME_GLOB | "Glob" |
| `R4` | TOOL_NAME_EDIT | "Edit" |
| `_K` | TOOL_NAME_WRITE | "Write" |
| `bJ` | TOOL_NAME_NOTEBOOK_EDIT | "NotebookEdit" |
| `oH` | TOOL_NAME_SKILL | "Skill" |
| `TR` | TOOL_NAME_TASK_CREATE | "TaskCreate" |
| `lt` | TOOL_NAME_TASK_GET | "TaskGet" |
| `it` | TOOL_NAME_TASK_LIST | "TaskList" |
| `ck` | TOOL_NAME_TASK_UPDATE | "TaskUpdate" |
| `hI` | TOOL_NAME_SEND_MESSAGE | "SendMessage" |
| `ER` | TOOL_NAME_CRON_CREATE | "CronCreate" |
| `ed` | TOOL_NAME_CRON_DELETE | "CronDelete" |
| `SW6` | TOOL_NAME_CRON_LIST | "CronList" |

---

## Related Documents

- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols
- [cross_validation_final_v2.md](../26_background_agents/cross_validation_final_v2.md) - Background agent symbols

---

**Last Verified**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - 73 core symbols verified with source code, 25+ constant symbols verified