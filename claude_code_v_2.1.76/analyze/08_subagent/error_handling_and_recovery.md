# Error Handling and Recovery - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the five error categories in the subagent system, recovery strategies, error propagation, and the three-layer cleanup mechanism.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `agentLoopRunner` (qh) - Agent loop with finally block cleanup - chunks.133.mjs:1565
- Three-layer cleanup: global active task set, task-level functions, map removal

> **Note:** Task state management functions (`markTaskFailed`, `killTask`) are referenced in the symbol index but their exact implementations are in task management modules. The cleanup logic is primarily implemented in the `finally` block of `agentLoopRunner` (qh).

---

## Five Error Categories

### Category 1: Validation Errors

Errors detected before the subagent starts.

**Examples:**
- Unknown agent definition name
- Required MCP server not available
- Per-invocation model name not recognized

**Recovery:** Return error immediately to parent. No subagent state to clean up.

### Category 2: LLM API Errors

Errors from the LLM API during the agent loop.

**Examples:**
- Rate limiting (429)
- Service unavailable (503)
- Context length exceeded (400)

**Recovery:**
- **Transient errors** (429, 503): Retry with exponential backoff (up to 3 retries)
- **Permanent errors** (400 context exceeded): Trigger compaction if possible, otherwise fail task
- **Auth errors** (401, 403): Fail immediately with clear error message

### Category 3: Tool Execution Errors

Errors from tool handlers during execution.

**Examples:**
- File not found during Read
- Permission denied during Write
- Bash command non-zero exit code

**Recovery:**
- Tool errors are returned to the LLM as `tool_result` with `is_error: true`
- The LLM decides how to proceed (retry, alternative approach, give up)
- Subagent continues running after tool errors unless the task limit is exceeded

### Category 4: Resource Errors

Errors from resource allocation/deallocation.

**Examples:**
- Worktree allocation failure (v2.1.76, if `isolation: worktree`)
- Mailbox file creation failure
- Transcript file write failure

**Recovery:**
- Worktree failure: Fall back to non-isolated execution with a warning
- Mailbox failure: Fail the teammate spawn with clear error
- Transcript failure: Log warning, continue (transcripts are not critical path)

### Category 5: Abort/Kill

Intentional termination by user or parent agent.

**Examples:**
- User presses Ctrl+C
- Parent agent calls killTask
- Session timeout

**Recovery:**
- Signal abort to the agent loop's AbortController
- Let the current tool execution complete or timeout
- Run three-layer cleanup
- Report status as "killed"

---

## Error Propagation

### From Subagent to Parent

Errors in the subagent propagate to the parent based on execution mode:

**Synchronous mode:**
```
Subagent error → markTaskFailed(taskId, error)
              → createForegroundTask's await rejects
              → AgentTool.call returns { status: "failed", error: error.message }
              → Parent LLM receives tool result with error content
```

**Asynchronous mode:**
```
Subagent error → markTaskFailed(taskId, error)
              → Error written to outputFile
              → Parent reads outputFile, sees "status: failed"
              → Parent LLM decides how to handle
```

**Teammate mode:**
```
Teammate error → writeToMailbox(parentAgentId, { type: "error", ... })
              → Parent's poll loop receives error message
              → Parent LLM decides how to handle
```

---

## Three-Layer Cleanup

Cleanup runs in `finally` blocks to ensure it always executes, even on errors. The `agentLoopRunner` (qh) implements comprehensive cleanup in its finally block.

### Source Code

```javascript
// ============================================
// Three-layer cleanup in agentLoopRunner finally block
// Location: chunks.133.mjs:1782-1785
// ============================================

// ORIGINAL (for source lookup):
} finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
} finally {
    // Layer 0: Flush pending transcript writes
    if (await flushTranscriptQueue(), agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }
    // Layer 1: Clear mutable state
    toolUseContext.readFileState.clear();
    // Layer 2: Clear message references
    messages.length = 0;
    // Layer 3: Clean up agent identity
    cleanupAgentIdentity(agentId);
    // Layer 4: Finalize transcript writer
    cleanupTranscriptWriter(agentId);
    // Layer 5: Remove from task tracking
    cleanupTaskState(agentId, toolUseContext.getAppState, setAppState);
}

// Mapping: K6→flushTranscriptQueue, A→agentDefinition, zZ6→deregisterAgentHooks,
// N→setAppState, L→agentId, z6→toolUseContext, R→messages,
// a36→cleanupAgentIdentity, Qx8→cleanupTranscriptWriter, t24→cleanupTaskState
```

### Layer 1: Global Active Task Set

```javascript
// Global set tracks all active tasks for session teardown
globalActiveTaskSet.delete(taskId);
```

**Purpose:** When the session ends (Ctrl+C, timeout), iterate the active task set to kill all remaining tasks. Without this, orphaned tasks would continue running after the session ends.

### Layer 2: Task-Level Cleanup Functions

```javascript
// Run each registered cleanup function
for (let cleanupFn of task.cleanupFns) {
    try { await cleanupFn(); } catch (err) { logError(err); }
}
```

**What's registered:**
- Worktree cleanup (if `isolation: worktree` - v2.1.76)
- Mailbox file deletion
- Transcript finalization
- Hook deregistration (SubagentStop hook firing)

**Why best-effort:** Cleanup failures should not prevent the task from being marked as completed/failed. Each cleanup function is wrapped in its own try/catch.

### Layer 3: Task Map Removal

```javascript
// Remove from registry to prevent memory leak
globalTaskMap.delete(taskId);
```

**Purpose:** The global task Map holds references to task state, including the AbortController and cleanup functions. Removing the entry allows garbage collection.

---

## Partial Transcript Preservation

If the agent loop fails mid-execution, the transcript file contains the messages written up to the point of failure. The `finalizeTranscript` (mQ1) function:

1. Writes a special "error" record to the transcript
2. Closes the write queue (no more writes accepted)
3. Returns the number of messages successfully written

This ensures the partial transcript is usable for debugging even when the subagent fails.

---

## Design Rationale

### Why Best-Effort Cleanup?

Cleanup errors should not mask the original error. If the worktree cleanup fails, the important information is still the original task error. Best-effort cleanup with individual error logging gives operators visibility into cleanup failures without propagating them to callers.

### Why Per-Category Recovery Strategies?

Different error categories have different optimal responses:
- Validation errors → fail fast (no point in retrying invalid input)
- LLM API errors → retry (usually transient)
- Tool errors → delegate to LLM (LLM can reason about the failure)
- Resource errors → degrade gracefully (proceed without the resource if possible)
- Abort → clean up quickly (user is waiting)

A single catch-all error handler cannot apply these different strategies appropriately.
