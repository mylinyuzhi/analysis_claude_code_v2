# Agent Teams & Collaboration Architecture

## Overview

The Agent Teams system in Claude Code (`v2.1.38`) implements a **filesystem-backed swarm architecture**. Unlike memory-only multi-agent systems, Claude Code uses the local filesystem (`~/.claude/teams/` and `~/.claude/tasks/`) as the shared state ledger. This allows persistent coordination between the "Team Lead" (the main user session) and "Teammates" (background processes).

The system consists of three pillars:
1.  **Team State**: Shared configuration and member registry.
2.  **Task Ledger**: A centralized, persistent list of tasks (To-Do) that agents claim and update.
3.  **Message Protocol**: A structured JSON-RPC-like protocol for Direct Messages, Broadcasts, and Control Signals (Shutdown/Plan Approval).

## Team Lifecycle

### Creation
Teams are initialized via the `TeamCreate` tool. This operation:
1.  Creates a unique team directory (`~/.claude/teams/{name}/`).
2.  Writes a `config.json` containing the `leadAgentId` and initial members.
3.  Initializes a corresponding task directory (`~/.claude/tasks/{name}/`).
4.  Updates the current session's `AppState` to include `teamContext`.

### Discovery
Teammates discover each other by reading the shared `config.json`. The system favors human-readable names (e.g., "researcher", "frontend-dev") over UUIDs for addressing.

### Termination
The `TeamDelete` tool acts as the cleanup mechanism. It enforces a safety check ensuring no active members (other than the leader) remain before deleting the team resources.

## Task Management (The Shared Ledger)

The `TaskList` and `TaskUpdate` tools implement a shared work queue.

### Task Data Structure
Tasks are not simple strings but structured objects with:
- `id`: Unique identifier.
- `status`: `pending`, `in_progress`, `completed`, `deleted`.
- `owner`: The agent currently working on the task (locking mechanism).
- `blocks` / `blockedBy`: Dependency graph support.

### Synchronization
Changes to tasks are written to disk, serving as the synchronization point. Agents are instructed to "poll" this list (conceptually, likely via tool usage) to find work.

## Inter-Agent Communication

Communication is handled by the `SendMessage` tool (`Yi4`/`YhY`). Messages are not direct TCP/socket connections but are routed via the application state (likely flushed to disk or shared memory in the actual runtime, though the code here shows state updates).

### Message Types
The protocol defines strict message schemas:

| Type | Purpose | Payload |
|------|---------|---------|
| `message` | Direct Message (DM) | `recipient`, `content`, `summary` |
| `broadcast` | Team-wide announcement | `content`, `summary` |
| `shutdown_request` | Leader asks agent to stop | `recipient`, `content` |
| `shutdown_response` | Agent confirms/rejects stop | `request_id`, `approve`, `content` |
| `plan_approval_request` | Agent asks Lead to sign off | (Implicit in Plan Mode exit) |
| `plan_approval_response` | Lead approves/rejects plan | `request_id`, `approve`, `feedback` |

### Code Snippet: SendMessage Tool Dispatch

```javascript
// ============================================
// SendMessageTool_Call - Dispatch logic for agent communication
// Location: chunks.141.mjs:1429-1443
// ============================================

// ORIGINAL (for source lookup):
/* async call(A, q) {
    switch (A.type) {
        case "message":
            return oSY(A, q);
        case "broadcast":
            return aSY(A, q);
        case "shutdown_request":
            return sSY(A, q);
        case "shutdown_response":
            if (A.approve) return tSY(A, q);
            return eSY(A);
        case "plan_approval_response":
            if (A.approve) return AhY(A, q);
            return qhY(A, q)
    }
} */

// READABLE (for understanding):
async function sendMessageTool_Call(input, context) {
    switch (input.type) {
        case "message":
            return sendDirectMessage(input, context); // oSY
        case "broadcast":
            return sendBroadcastMessage(input, context); // aSY
        case "shutdown_request":
            return sendShutdownRequest(input, context); // sSY
        case "shutdown_response":
            if (input.approve) return approveShutdown(input, context); // tSY
            return rejectShutdown(input); // eSY
        case "plan_approval_response":
            if (input.approve) return approvePlan(input, context); // AhY
            return rejectPlan(input, context); // qhY
    }
}

// Mapping: A→input, q→context, oSY→sendDirectMessage, aSY→sendBroadcastMessage
```

## Agent Hooks (Verification)

The system includes a powerful "Agent Hook" mechanism (`Xi4`). This allows the main process to spawn a temporary, isolated agent to verify a condition (e.g., "Did the tests pass?" or "Is the server running?").

### Architecture
1.  **Spawn**: A new agent loop is started with a restricted context.
2.  **Prompt**: The agent is given a specific verification instruction.
3.  **Constraint**: The agent has a hard limit on turns (default 50) and tools.
4.  **Output**: The agent must return a structured result (ok/false).

### Code Snippet: Agent Hook Execution

```javascript
// ============================================
// executeAgentHook - Spawns a temporary agent to verify a condition
// Location: chunks.141.mjs:1561-1698
// ============================================

// ORIGINAL (for source lookup):
async function Xi4(A, q, K, Y, z, w, H, $) {
    let O = H || `hook-${Ji4()}`,
        _ = w.agentId ? kh(w.agentId) : dO(),
        J = Date.now();
    try {
        let X = XJ6(A.prompt($), Y); // Interpolate prompt
        // ... (logging)
        let j = [c6({ content: X })]; // Initial message
        // ... (setup abort controller)
        
        // System Prompt Construction
        let y = [`You are verifying a stop condition in Claude Code...`];
        
        // ... (Agent Loop)
        for await (let p of ZR({
            messages: j,
            systemPrompt: y,
            // ... restricted context
            querySource: "hook_agent"
        })) {
            // ... (Handle events, look for structured output)
        }
        // ...
    }
    // ...
}

// Mapping: Xi4→executeAgentHook, A→hookDefinition, q→hookName, ZR→runAgentLoop
```

## Error Recovery

The Agent Teams system implements multiple error recovery strategies to handle failures gracefully. For complete details, see [error_recovery.md](./error_recovery.md).

### Graceful Shutdown Protocol

Teams use a **request → approval → confirmation** pattern for coordinated shutdown:

1. **Team lead sends shutdown_request** via SendMessage
2. **Teammate receives request** (Priority 2 in poll loop - higher than regular messages)
3. **User approves/rejects** via UI prompt
4. **Teammate sends shutdown_response** (approval or rejection)
5. **Termination**:
   - **In-process**: AbortController signals poll loop to exit
   - **Pane-based**: setImmediate schedules process.exit(0)

**Key insight**: Shutdown requests bypass the normal message queue (Priority 2) to prevent deadlock from message floods. This ensures teams can always shut down even under heavy message traffic.

### Communication Error Recovery

| Error Type | Detection | Recovery | Data Loss |
|------------|-----------|----------|-----------|
| Message delivery failure | fs.appendFileSync throws | Return error to agent | No (error surfaced) |
| Orphaned messages | Process crash with unread messages | TeamDelete cleanup | Yes (unread messages lost) |
| Mailbox corruption | JSON.parse fails | Skip corrupted lines | Minimal (single message) |

**Design philosophy**: Fail-fast for infrastructure errors (immediately visible), but graceful degradation for transient failures (skip corrupted messages, continue processing).

### Backend-Specific Errors

**tmux/iTerm backend**:
- **Availability check**: `backend.isAvailable()` before TeamCreate
- **Pane creation failure**: Cleanup partial state, return error
- **Command send failure**: Log error, user intervention required

**In-process backend**:
- **Agent crash**: Mark task as crashed in AppState, allow reassignment
- **Abort controller leak**: Cleanup on session restart

See [error_recovery.md](./error_recovery.md) for full recovery strategies matrix.

## Resource Management

Agent Teams consume resources (processes, memory, disk). The system uses limits and monitoring to prevent exhaustion. For complete details, see [resource_limits.md](./resource_limits.md).

### Resource Limits

| Resource | Limit | Enforcement | Rationale |
|----------|-------|-------------|-----------|
| Agent count | None (system-dependent) | Backend availability | tmux: ~200 panes, in-process: 5-10 |
| Hook timeout | 60 seconds | AbortSignal.timeout | Prevent infinite hangs |
| Hook turns | 50 turns | Counter + abort | Prevent runaway loops |
| Memory | Node.js default (~4GB) | OS enforcement | Typical: ~200MB per agent |
| Disk | No quota | File system limit | Mailbox grows unbounded |

### Hook Resource Enforcement

Hooks (verification agents) have strict limits to prevent resource exhaustion:

```javascript
const MAX_HOOK_TURNS = 50;
const DEFAULT_HOOK_TIMEOUT_MS = 60000;

let turnCount = 0;
for await (let event of runAgentLoop(...)) {
    if (event.type === "assistant") {
        turnCount++;
        if (turnCount >= MAX_HOOK_TURNS) {
            abortController.abort();
            return { outcome: "cancelled" };
        }
    }
}
```

**Why 50 turns**: Prevents infinite loops (agent keeps using tools) while allowing complex verifications (read files, run tests, parse output). Typical hooks complete in 2-5 turns.

**Why 60 second timeout**: Enough time for multi-step checks, not long enough to block user indefinitely.

### Monitoring

**Telemetry events** track resource usage:
- `tengu_agent_stop_hook_success` - Hook completed (track duration, turns)
- `tengu_agent_stop_hook_max_turns` - Hit 50-turn limit
- `tengu_agent_stop_hook_error` - Timeout or exception
- `tengu_memdir_loaded` - Memory size and truncation status

See [resource_limits.md](./resource_limits.md) for exceeding limits scenarios and mitigation strategies.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `TeamCreateTool` (QSY) - Initializes team/task directories
- `TeamDeleteTool` (USY) - Cleans up team resources
- `TaskListTool` (Ll4) - Lists active tasks
- `TaskUpdateTool` (Wl4) - Updates task status/assignment
- `SendMessageTool` (YhY) - Handles inter-agent messaging
- `executeAgentHook` (Xi4) - Spawns verification sub-agents
