# Background Agents — Module Overview (Claude Code 2.1.76)

> Reverse-engineered analysis of the background agent system: asynchronous task execution,
> output capture, kill handlers, and integration with tools, hooks, and system reminders.

---

## What Are Background Agents?

Background agents are one of the most architecturally sophisticated systems in Claude Code. They allow any `Task` (subagent) or `Bash` (shell command) tool call to be detached from the main conversation loop, running asynchronously while the lead agent continues other work.

**Key capabilities:**
- **Asynchronous execution** - Run long tasks without blocking the main conversation
- **Output capture** - Persistent file-based output with incremental reads
- **Progress tracking** - Automatic progress updates injected into system reminders
- **Kill handling** - Graceful termination with task-type-specific strategies
- **Tool access control** - Blocklist/allowlist to prevent blocking operations

---

## What's New in v2.1.76

### `background: true` Flag

In v2.1.76, the `background: true` flag is explicitly present in the task record type definition and the AgentTool schema. Previously only `run_in_background` appeared in the tool input schema; v2.1.76 also propagates a `background` field into the task state to allow downstream code to distinguish explicitly-backgrounded tasks from foreground-then-backgrounded tasks.

### Ctrl+F Kill All

v2.1.76 adds a new keyboard shortcut: **Ctrl+F kills all running background agents** at once. This is implemented via `killAllRunningAgents` (`Kd7`) which is now bound to the Ctrl+F key event. Previously, users had to stop individual tasks one at a time.

### Partial Results Preserved on Kill

When a background agent is killed (either via Ctrl+F or TaskStop), any partial results that were written to the output file are preserved and surfaced in the `task_status` attachment. v2.1.76 ensures `readOutputFileDelta` is called before updating the task status to "killed", so results from completed tool calls within the agent are not lost.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Main Agent Loop                                  │
│  (processes user messages, runs tools synchronously)                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
   ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
   │ AgentTool   │       │ BashTool    │       │ Other Tools │
   │ run_in_bg   │       │ timeout/Ctrl│       │             │
   │ = true      │       │ = background│       │             │
   └──────┬──────┘       └──────┬──────┘       └─────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                      Task Creation Layer                             │
   │                                                                      │
   │  createAsyncTask() / createForegroundTask()                         │
   │  - Generate unique task ID (createTaskId)                           │
   │  - Create AbortController for cancellation                          │
   │  - Initialize output file (.claude/tasks/<id>.output)               │
   │  - Register task in appState.tasks                                  │
   │  - Spawn detached execution context                                 │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ Local Agent │          │ Local Bash  │          │ Remote Agent│
   │ Handler     │          │ Handler     │          │ Handler     │
   │ (B_6)       │          │ (gj1)       │          │ (Qi4)       │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                                   ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       Background Execution                           │
   │                                                                      │
   │  Tool Access Control:                                                │
   │  • BLOCKLIST (Bj1): TaskOutput, ExitPlanMode, EnterPlanMode,        │
   │    Task, AskUserQuestion, TaskStop                                   │
   │  • ALLOWLIST (L_6): Read, Write, Edit, Bash, Grep, Glob,            │
   │    WebFetch, WebSearch, TodoWrite, Skill, etc.                       │
   │                                                                      │
   │  Output Capture:                                                     │
   │  • appendToOutputFile() - Incremental writes                         │
   │  • readOutputFileDelta() - Incremental reads                         │
   │                                                                      │
   │  Progress Tracking:                                                  │
   │  • updateTaskProgress() - Record turn progress                       │
   │  • countTurnsSinceLastProgress() - Throttle frequency                │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                     Completion & Notification                        │
   │                                                                      │
   │  notifyTaskCompletion() - Inject task-notification into queue       │
   │  - Main loop receives and displays to user                          │
   │  - Task attachments added to context via getUnifiedTasksAttachment()│
   └─────────────────────────────────────────────────────────────────────┘
```

---

## Module Documents

| Document | Description |
|----------|-------------|
| [implementation.md](./implementation.md) | **Core implementation** - Task lifecycle, spawn, state machine, progress tracking |
| [output_capture.md](./output_capture.md) | **Output file system** - File paths, incremental reads, notification queue |
| [tools_integration.md](./tools_integration.md) | **Tool integration** - AgentTool, BashTool, tool access control (blocklist/allowlist) |
| [kill_handlers.md](./kill_handlers.md) | **Kill handlers** - Three handler types (local_agent, local_bash, remote_agent) |
| [system_reminder_integration.md](./system_reminder_integration.md) | **System reminders** - task_status, task_progress, frequency throttle |
| [hooks_integration.md](./hooks_integration.md) | **Hooks integration** - PreToolUse/PostToolUse for background agents |
| [compact_integration.md](./compact_integration.md) | **Compact integration** - Transcript handling, message filtering |
| [slash_commands_integration.md](./slash_commands_integration.md) | **CLI integration** - /tasks command, task management |

---

## Key Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createTaskId` (hp) - Generate unique task ID — `chunks.89.mjs:522`
- `createTaskRecord` (IZ) - Create task state object — `chunks.89.mjs:528`
- `createAsyncTask` (zd7) - Create background task with AbortController — `chunks.89.mjs:1447`
- `createForegroundTask` (wd7) - Create task that may be backgrounded later — `chunks.89.mjs:1477`
- `backgroundForegroundTask` (Hd7) - Convert running task to background — `chunks.89.mjs:1515`
- `killTask` (na) - Kill a running task — `chunks.89.mjs:1375`
- `killAllRunningAgents` (Kd7) - Kill all local_agent tasks (Ctrl+F) — `chunks.89.mjs`
- `getOutputFilePath` (ww) - Get output file path for task — `chunks.89.mjs:249`
- `appendToOutputFile` (ZK1) - Append content to output file — `chunks.89.mjs:253`
- `readOutputFileDelta` (WjA) - Read incremental output — `chunks.89.mjs:276`
- `readFullOutput` (M_6) - Read complete output file — `chunks.89.mjs:300`
- `initOutputFile` (hj1) - Initialize output file — `chunks.89.mjs:310`
- `LocalAgentTaskHandler` (B_6) - Kill handler for local agents — `chunks.89.mjs:1574`
- `LocalBashTaskHandler` (gj1) - Kill handler for shell commands — `chunks.89.mjs:2012`
- `RemoteAgentTaskHandler` (Qi4) - Kill handler for remote sessions — `chunks.142.mjs:1586`
- `getKillHandlerForType` (Vg1) - Handler lookup by task type — `chunks.142.mjs:1652`
- `BACKGROUND_AGENT_BLOCKED_TOOLS` (Bj1) - Tools blocked for background agents — `chunks.89.mjs:876`
- `ASYNC_COMPATIBLE_TOOLS` (L_6) - Allowlist for async contexts — `chunks.89.mjs:876`
- `notifyTaskCompletion` (vK1) - Inject completion notification — `chunks.89.mjs:1346`
- `countTurnsSinceLastProgress` (TIY) - Turn counting for throttle — `chunks.142.mjs:2703`
- `getUnifiedTasksAttachment` (vIY) - Main attachment producer — `chunks.142.mjs:2719`
- `buildTaskAttachments` (di4) - Build task attachments — `chunks.142.mjs:1711`
- `TaskOutputTool` (kW6) - Poll/retrieve background task output — `chunks.139.mjs:1922`
- `TaskStopTool` (vW6) - Kill a running background task — `chunks.139.mjs:1537`

---

## Tool Access Control Deep Dive

Background agents use a **blocklist + allowlist** mechanism to prevent interactive tools from causing hangs.

### Blocked Tools (Cannot Use)

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval flow |
| `EnterPlanMode` | Requires user approval flow |
| `Task` | Could spawn nested background agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background agents shouldn't manage other tasks |

### Allowed Tools (For Async Contexts)

| Tool | Why Safe |
|------|----------|
| `Read` | Read-only, no side effects |
| `Write` | File creation - common for background tasks |
| `Edit` | File modification - common for background tasks |
| `Grep` | Content search - non-blocking |
| `Glob` | File search - non-blocking |
| `Bash` | Shell commands - core capability |
| `WebFetch` | Network request - async-safe |
| `WebSearch` | Network request - async-safe |
| `TodoWrite` | Task management - useful for tracking |
| `NotebookEdit` | Jupyter editing - file-like operation |
| `Skill` | Skill invocation - controlled execution |
| `StructuredOutput` | Output formatting - non-blocking |
| `ToolSearch` | Discovery - non-blocking |
| `SendMessage` | Team communication - async-safe |

---

## Integration Points

### With Tools System
- **AgentTool (`rj1`)** - `run_in_background` parameter spawns async agent
- **BashTool (`h4`)** - Three background modes: explicit, timeout, interrupt
- **TaskOutputTool** - Poll/retrieve output from background tasks
- **TaskStopTool** - Kill running background tasks

### With System Reminders
- **task_status** - Background task status in conversation context
- **task_progress** - Progress updates with frequency throttling
- **Task attachments** - Unified view of all background tasks

### With Hooks
- **PreToolUse** - Validates tool access for background agents
- **PostToolUse** - Captures output for background tasks
- **Blocking detection** - Hooks may block background execution

### With Compact
- **Transcript filtering** - Background messages filtered from compaction
- **Task persistence** - Task state preserved across compactions
- **Output file retention** - Output files not compacted

### With CLI
- **/tasks command** - List and manage background tasks
- **Task notifications** - Completion notifications in terminal
- **Ctrl+F shortcut** - Kill all running agents (new in v2.1.76)

---

## Source Files

| File | Content |
|------|---------|
| `chunks.89.mjs` | Core machinery: output files, task records, state machine, notifications |
| `chunks.132.mjs` | AgentTool implementation with `run_in_background` support |
| `chunks.170.mjs` | BashTool with three backgrounding modes |
| `chunks.139.mjs` | TaskOutput and TaskStop management tools |
| `chunks.142.mjs` | Kill handlers, task attachments, progress tracking |

---

## Design Rationale

### Why Blocklist + Allowlist?

1. **Blocklist (Bj1)** - Prevents obviously dangerous operations:
   - Tools that require user interaction (`AskUserQuestion`, `EnterPlanMode`)
   - Tools that could create resource issues (`Task` spawning nested agents)
   - Tools that could create loops (`TaskOutput` polling)

2. **Allowlist (L_6)** - Ensures async safety:
   - Only non-blocking tools allowed
   - Clear security boundary for unattended execution
   - Easy to audit what background agents can do

### Why Output Files?

- **Persistence** - Output survives crashes/restarts
- **Incremental reads** - LLM can check progress without blocking
- **Simple API** - Standard file operations, no special protocols

### Why Kill Handlers?

- **Task-type-specific** - Different resources need different cleanup
- **Agent processes** - Need process group termination
- **Shell commands** - Need child process termination
- **Remote sessions** - Need session termination

---

## Usage Examples

### Spawning a Background Agent

```
AgentTool.call({
    prompt: "Search the codebase for all uses of createTaskId...",
    subagent_type: "Explore",
    run_in_background: true,
    description: "Find createTaskId usages"
})
// Returns: { status: "async_launched", agentId: "...", outputFile: "..." }
```

### Checking Background Task Output

```
TaskOutputTool.call({
    task_id: "abc123",
    block: false,  // Non-blocking poll
    timeout: 5000
})
// Returns: { output: "...current output...", status: "running" }
```

### Killing All Background Agents (v2.1.76)

```
// User presses Ctrl+F in the TUI
// → Calls killAllRunningAgents (Kd7)
// → Iterates all tasks with status "running" and type "local_agent"
// → Calls killTask (na) for each
// → Partial results preserved in output files
```
