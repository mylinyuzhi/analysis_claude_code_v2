# Architecture Complete - Background Agents (Claude Code 2.1.76)

> Complete architecture documentation for the background agent execution system including task lifecycle, output file system, kill mechanism, and progress tracking.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Background agent symbol verification
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `Un4` - createForegroundAgentTask — `chunks.146.mjs:2165`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `Y91` - OutputBuffer — `chunks.41.mjs:2252`

---

## System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKGROUND AGENT EXECUTION ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           MAIN AGENT LOOP                                    │
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │ AgentTool    │    │ BashTool     │    │ Other Tools  │                 │
│   │ run_in_bg    │    │ timeout/Ctrl │    │              │                 │
│   │ = true       │    │ = background │    │              │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────────────┘                 │
│          │                   │                                               │
└──────────┼───────────────────┼───────────────────────────────────────────────┘
           │                   │
           └─────────┬─────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK CREATION LAYER                                  │
│                                                                              │
│  createBackgroundAgentTask (Qn4) / createForegroundAgentTask (Un4)         │
│  ├── Generate unique task ID (oV)                                          │
│  ├── Create AbortController for cancellation                                │
│  ├── Initialize output file (.claude/tasks/<id>.output)                    │
│  ├── Register task in appState.tasks (Zf)                                  │
│  └── Spawn detached execution context                                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKGROUND EXECUTION                                  │
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐ │
│  │ Tool Access Control │    │ Output Capture      │    │ Progress Track  │ │
│  │ CW6 (blocked)       │    │ Y91 (OutputBuffer)  │    │ nl4 (telemetry) │ │
│  │ eP1 (allowed)       │    │ Z97 (delta read)    │    │ TV1 (preserve)  │ │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPLETION & NOTIFICATION                                │
│                                                                              │
│  $m8 (completed) / Hm8 (failed) / x66 (killed)                              │
│  → System reminder attachment via suY                                       │
│  → UI notification displayed                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task State Machine

### State Transitions

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

### State Transition Functions

| Function | From | To | Condition |
|----------|------|----|-----------|
| `Zf` | (none) | pending | Task created |
| (spawn) | pending | running | Execution starts |
| `$m8` | running | completed | Success |
| `Hm8` | running | failed | Error |
| `x66` | running | killed | User abort |
| `d4q` | killed | notified | Notification sent |
| `VR` | notified | (removed) | Terminal + notified |

---

## Output File System Architecture

### OutputBuffer Class (Y91)

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered output file writer
// Location: chunks.41.mjs:2252-2308
// ============================================

class OutputBuffer {
    constructor(filePath) {
        this.filePath = filePath;
        this.buffer = [];
        this.flushPromise = null;
    }

    append(content) {
        this.buffer.push(content);
        // Auto-flush when buffer exceeds threshold
        if (this.buffer.length >= FLUSH_THRESHOLD) {
            this.flush();
        }
    }

    async flush() {
        if (this.flushPromise) {
            await this.flushPromise;
        }
        const content = this.buffer.join('');
        this.buffer = [];
        this.flushPromise = fs.appendFile(this.filePath, content);
        await this.flushPromise;
    }
}
```

### Delta Reading Strategy

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.41.mjs:2325-2346
// ============================================

async function readOutputFileDelta(taskId, lastOffset) {
    const filePath = getOutputFilePath(taskId);

    try {
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;

        if (fileSize <= lastOffset) {
            return { content: null, newOffset: lastOffset };
        }

        const fd = await fs.open(filePath, 'r');
        const buffer = Buffer.alloc(fileSize - lastOffset);
        await fd.read(buffer, 0, buffer.length, lastOffset);
        await fd.close();

        return {
            content: buffer.toString('utf-8'),
            newOffset: fileSize
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { content: null, newOffset: 0 };
        }
        throw error;
    }
}
```

**Why delta reading:**
- Only new content is read
- Prevents duplicate information in LLM context
- Reduces token usage
- Keeps context fresh

---

## Kill Mechanism Architecture

### Abort Signal Propagation

```
User presses Ctrl+C (or Ctrl+F for kill all)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: Any local_agent running?                                             │
│   Code: Object.values(tasks).some(t => t.type === "local_agent" &&          │
│                                      t.status === "running")                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼ No                        ▼ Yes
       ┌───────────────────┐         ┌─────────────────────────────────────────┐
       │ Cancel stream     │         │ Show confirmation:                      │
       │ (normal Ctrl+C)   │         │ "Press Ctrl+F to stop agents"           │
       └───────────────────┘         └───────────────────┬─────────────────────┘
                                                           │
                                             ┌─────────────┴─────────────┐
                                             │                           │
                                             ▼ Timeout                   ▼ Ctrl+F
                                     ┌───────────────────┐         ┌─────────────────────────┐
                                     │ Revert to         │         │ Execute killAll:        │
                                     │ normal behavior   │         │ 1. U4q(tasks, setState) │
                                     └───────────────────┘         │ 2. For each killed:     │
                                                                   │    d4q(taskId, setState)│
                                                                   │ 3. Show notification    │
                                                                   └─────────────────────────┘
```

### Kill Functions

```javascript
// ============================================
// x66 - triggerAbortSignal
// Location: chunks.146.mjs:2012-2027
// ============================================

function triggerAbortSignal(taskId, setAppState) {
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        wasAborted = true;

        // Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Unregister cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output buffer (preserves partial results)
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}
```

**Why partial results preserved:**
- User can see what was accomplished
- Useful for debugging
- No silent loss of work

---

## Progress Tracking Architecture

### Progress Update Flow

```
Agent Loop executes tool
        │
        ▼
Tool produces output
        │
        ├─── updateTaskProgressWithTelemetry (nl4)
        │    │
        │    ├─── Capture previous progress
        │    ├─── Update progress atomically
        │    └─── Send telemetry event (if enabled)
        │
        ▼
Progress visible in:
├─── Status line indicator
├─── Task list modal
└─── System reminder attachment
```

### Telemetry Integration

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        progressData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: progressData.toolUseId,
            description: summary,
            usage: {
                total_tokens: progressData.tokenCount,
                tool_uses: progressData.toolUseCount,
                duration_ms: Date.now() - progressData.startTime
            }
        });
    }
}
```

---

## Tool Access Control

### Blocked Tools (CW6)

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval |
| `EnterPlanMode` | Requires user approval |
| `Agent` | Could spawn nested agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background shouldn't manage tasks |

### Allowed Tools (eP1)

| Tool | Why Safe |
|------|----------|
| `Read` | Read-only, no side effects |
| `Write` | File creation - common for tasks |
| `Edit` | File modification - common for tasks |
| `Grep` | Content search - non-blocking |
| `Glob` | File search - non-blocking |
| `Bash` | Shell commands - core capability |
| `WebFetch` | Network request - async-safe |
| `WebSearch` | Network request - async-safe |
| `TodoWrite` | Task management - useful for tracking |

---

## File Structure Map

| File | Content | Key Functions |
|------|---------|---------------|
| `chunks.146.mjs` | Task Lifecycle | `Qn4`, `Un4`, `x66`, `$m8`, `Hm8`, `U4q` |
| `chunks.90.mjs` | Task State | `i9`, `Zf`, `VR`, `EV8`, `wY4`, `OY4` |
| `chunks.41.mjs` | Task ID & Output | `oV`, `k$3`, `RG`, `Y91`, `Z97`, `g2` |
| `chunks.93.mjs` | Tool Filtering | `Xk8`, `_c` |
| `chunks.147.mjs` | System Reminder | `suY`, `f4` |

---

## Version Changes (v2.1.76)

| Feature | Previous | v2.1.76 |
|---------|----------|---------|
| `background: true` flag | Not in schema | Explicit in task record |
| Ctrl+F kill all | Individual only | Kills all running agents |
| Partial results | May be lost | Preserved on kill |
| Output file path | Not in notification | Included in completion |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full architecture documentation