# Agent Teams & Collaboration Architecture

## Overview

The Agent Teams system in Claude Code (`v2.1.38`) implements a **filesystem-backed swarm architecture**. Unlike memory-only multi-agent systems, Claude Code uses the local filesystem (`~/.claude/teams/` and `~/.claude/tasks/`) as the shared state ledger. This allows persistent coordination between the "Team Lead" (the main user session) and "Teammates" (background processes).

The system consists of three pillars:
1.  **Team State**: Shared configuration and member registry.
2.  **Task Ledger**: A centralized, persistent list of tasks (To-Do) that agents claim and update.
3.  **Message Protocol**: A structured JSON-RPC-like protocol for Direct Messages, Broadcasts, and Control Signals (Shutdown/Plan Approval).

## Key Design Decisions

### Decision 1: Filesystem-Backed State vs In-Memory

**What was chosen**: Use `~/.claude/teams/` and `~/.claude/tasks/` directories as the source of truth for all team coordination.

**Why this approach**:

| Requirement | How Filesystem Satisfies | Alternative (In-Memory) |
|-------------|-------------------------|------------------------|
| **Multi-process coordination** | Each process reads/writes shared files | Requires IPC (sockets, shared memory) |
| **Crash resilience** | Team/task state survives process restart | Lost on crash |
| **Debuggability** | `cat ~/.claude/teams/web-app/config.json` reveals exact state | Opaque process memory |
| **Zero dependencies** | No Redis, PostgreSQL, or distributed system | Complex setup |

**Trade-offs**:
- ✅ **Pro**: Works on any filesystem, survives crashes, human-inspectable
- ❌ **Con**: Slower than in-memory (~1-5ms vs ~10μs), requires file locking for race conditions
- ❌ **Con**: Disk space usage grows unbounded (mailboxes accumulate messages)

**When this breaks**: Network filesystems (NFS) with unreliable file locking can cause race conditions and duplicate task claims.

**Design insight**: For typical team sizes (2-10 agents) and message volumes (<1000 messages per session), filesystem overhead is negligible. The durability and debuggability benefits outweigh the performance cost.

### Decision 2: Three Spawn Modes vs Single Mode

**What was chosen**: Support in-process, split-pane (tmux/iTerm2), and separate window modes with automatic selection.

**Why this approach**:

| Mode | Use Case | Why Needed |
|------|----------|-----------|
| **In-Process** | CI/CD pipelines, non-interactive sessions | No TTY available, can't spawn panes |
| **Split-Pane** | Local development with tmux/iTerm2 | Visual monitoring, process isolation |
| **Separate Window** | Large teams (>5 agents) | Dedicated screen space per agent |

**Alternatives considered**:
1. **Pane-only**: Simple but breaks in CI/CD (no TTY)
2. **In-process only**: Works everywhere but no visual feedback, shared event loop

**Trade-offs**:
- ✅ **Pro**: Graceful degradation (works in all environments)
- ✅ **Pro**: Users get best experience available (visual panes when possible)
- ❌ **Con**: Three code paths to maintain, more complexity
- ❌ **Con**: Behavior differs by environment (surprising to users)

**Design insight**: The automatic mode selection (`isInProcessEnabled()`) prioritizes user experience. Non-interactive sessions automatically fall back to in-process, while interactive sessions leverage terminal multiplexers for rich UI.

### Decision 3: File Locking vs Lock-Free Queues

**What was chosen**: Use `proper-lockfile` library with read-modify-write critical sections.

**Why this approach**:

File locking prevents **lost update problem**:
```
Without locking:
  Agent A reads mailbox: [msg1, msg2]
  Agent B reads mailbox: [msg1, msg2]
  Agent A writes: [msg1, msg2, msg3]
  Agent B writes: [msg1, msg2, msg4]  ← msg3 lost!

With locking:
  Agent A: lock → read → append msg3 → write → unlock
  Agent B: lock (blocks) → read [msg1, msg2, msg3] → append msg4 → write → unlock
  Result: [msg1, msg2, msg3, msg4] ✓
```

**Alternatives considered**:
1. **Lock-free append**: Use atomic file operations (create unique `.msg-uuid` files, reader scans directory)
   - **Pro**: No lock contention
   - **Con**: Complex (need directory scanning, sorting, cleanup)
2. **Database with ACID**: Use SQLite for transactions
   - **Pro**: Guaranteed consistency
   - **Con**: External dependency, overkill for small teams

**Trade-offs**:
- ✅ **Pro**: Simple read-modify-write model, proven library handles edge cases
- ❌ **Con**: Lock contention with 6+ concurrent writers (5 retries × 1s = 5s timeout)
- ❌ **Con**: Stale lock detection (60s timeout) delays recovery from crashes

**Design insight**: For typical teams (<5 agents), lock contention is rare (requires simultaneous writes to same mailbox within same 5ms window). The simplicity of locked read-modify-write outweighs the complexity of lock-free alternatives.

### Decision 4: 5-Level Priority Queue vs FIFO

**What was chosen**: In-process teammates use priority-based polling: AppState > Shutdown > Lead > Peer > Tasks.

**Why this approach**:

**Problem without priorities**:
```
Scenario: Teammate has 100 unread peer messages
Lead sends shutdown request (message #101)
FIFO: Process all 100 messages first (50+ minutes delay)
Priority: Shutdown bypasses queue (<1 second)
```

**Priority rationale**:

| Priority | Rationale | Bypass Behavior |
|----------|-----------|-----------------|
| **1 - AppState** | In-process fast path (0-1ms) | N/A (separate queue) |
| **2 - Shutdown** | Control plane, must not starve | Scans ALL messages first |
| **3 - Lead** | Orchestrator decisions override peer work | Higher than peers |
| **4 - Peer** | Normal collaboration, FIFO fairness | None |
| **5 - Tasks** | Self-directed work, lowest priority | Only if no messages |

**Trade-offs**:
- ✅ **Pro**: Critical signals (shutdown, lead corrections) never starve
- ✅ **Pro**: Natural interrupt hierarchy matches user expectations
- ❌ **Con**: Peer messages can be delayed by lead flood
- ❌ **Con**: Tasks can starve if messages continuously arrive

**Design insight**: The priority system treats coordination signals as **higher priority than data**. Shutdown is control plane (termination), lead messages are coordination plane (work assignment), peer messages are data plane (collaboration). This mirrors network protocol layering.

### Decision 5: Mark-as-Read vs Delete Messages

**What was chosen**: Set `read: true` flag, keep messages in mailbox file.

**Why this approach**:

| Approach | Debuggability | File Size | Idempotency |
|----------|--------------|-----------|-------------|
| **Mark-as-read** (chosen) | Can inspect full history | Grows unbounded | Safe to re-mark |
| **Delete** | History lost | Stays small | Crash after delete loses message |

**Use case for mark-as-read**:
```
Debugging scenario:
User: "Why did backend-dev implement feature X?"
Developer: cat ~/.claude/teams/my-team/inboxes/backend-dev.json
Developer sees: Message from team-lead at T=10:30: "Implement feature X"
```

**Trade-offs**:
- ✅ **Pro**: Full audit trail, crash-safe (message persists after read)
- ❌ **Con**: Mailbox file grows to ~100KB-1MB for active teams
- ❌ **Con**: Scan performance degrades with mailbox size (mitigated by Priority 2 full scan only for shutdown)

**Future work**: Mailbox compaction (archive read messages to separate file) when size exceeds 1MB.

**Design insight**: Debuggability trumps performance for coordination systems. The ability to inspect message history is invaluable for understanding agent behavior and debugging coordination issues.

---

For complete deep dives on specific aspects, see:
- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - End-to-end flow with decision rationale at each step
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Why 3 spawn modes and automatic selection
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File locking implementation and race condition analysis
- [04_polling_priorities.md](./04_polling_priorities.md) - Complete priority queue design and starvation analysis

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
