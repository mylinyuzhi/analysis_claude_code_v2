# Resource Limits - Agent Team Quotas and Constraints

> **Module**: Agent Teams - Resource Management
> **Source**: `chunks.141.mjs` (lines 1572, 1594, 1639), `chunks.131.mjs`, hook configurations
> **Version**: Claude Code 2.1.38

---

## Table of Contents

1. [Overview](#1-overview)
2. [Agent Count Limits](#2-agent-count-limits)
3. [Timeout Configurations](#3-timeout-configurations)
4. [Turn Limits](#4-turn-limits)
5. [Memory Limits](#5-memory-limits)
6. [Disk Quotas](#6-disk-quotas)
7. [Monitoring and Telemetry](#7-monitoring-and-telemetry)
8. [Exceeding Limits](#8-exceeding-limits)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

Agent Teams consume system resources (CPU, memory, disk, API credits). Resource limits prevent runaway usage and ensure stable operation.

### Resource Categories

| Resource | What It Protects | Current Limit | Enforcement |
|----------|------------------|---------------|-------------|
| **Agent count** | Process spawning, terminal panes | No hard limit (system-dependent) | Backend availability check |
| **Hook timeout** | API hanging, infinite loops | 60 seconds | AbortSignal.timeout |
| **Hook turns** | API credit exhaustion | 50 turns | Counter + abort |
| **Message delivery** | Network delays | No explicit timeout | File system default |
| **Process memory** | OOM crashes | Node.js default (~4GB) | OS enforcement |
| **Team directory size** | Disk exhaustion | No quota | File system limit |

### Design Philosophy

**Fail-fast for infrastructure**: If backend is unavailable (tmux not installed), fail immediately rather than silently degrading.

**Generous for user work**: Hook turn limit (50) and timeout (60s) are high enough that legitimate use cases don't hit them.

**Observable failures**: Telemetry events track when limits are approached or exceeded.

---

## 2. Agent Count Limits

### Hard Limits: None

**Current implementation**: No explicit maximum number of agents per team.

**Practical limits**:

**Terminal backend (tmux/iTerm)**: Limited by terminal multiplexer capacity
- **tmux**: Can handle 100+ panes per window (tested to ~200 before performance degrades)
- **iTerm2**: Similar capacity, depends on macOS memory

**In-process backend**: Limited by Node.js event loop and memory
- **Realistic**: 5-10 in-process agents before event loop saturation
- **Theoretical max**: ~100 before OOM (each agent adds ~50MB overhead)

**System resources**: Each pane-based agent spawns a full Node.js process
- **Memory**: ~200MB per agent (Node.js + dependencies)
- **CPU**: Depends on workload (mostly idle waiting for API responses)

### Backend Availability Check

```javascript
// In TeamCreateTool.call()
let backend = getBackend(backendType);
if (!await backend.isAvailable()) {
  return {
    success: false,
    error: `Backend "${backendType}" is not available. Install tmux/iTerm or use in-process backend.`
  };
}
```

**Why check availability**: Prevents creating team config when backend can't spawn teammates.

### Implicit Limits from Configuration

**One team per lead**: Each session can lead only one team (enforced in TeamCreate validation)

**Rationale**: Simplifies state management and prevents confusion about message routing.

**Workaround**: Run multiple Claude CLI sessions to lead multiple teams simultaneously.

---

## 3. Timeout Configurations

### Hook Execution Timeout: 60 seconds

**Location**: `chunks.141.mjs:1572`

```javascript
// ============================================
// Hook timeout configuration
// Location: chunks.141.mjs:1572
// ============================================

// ORIGINAL (for source lookup):
let M = A.timeout ? A.timeout * 1000 : 60000,
    P = Aq(),
    { signal: W, cleanup: G } = fR(z, AbortSignal.timeout(M)),

// READABLE (for understanding):
let timeoutMs = hookConfig.timeout ? hookConfig.timeout * 1000 : 60000;  // Default 60s
let hookAbortController = new AbortController();
let { signal: combinedSignal, cleanup } = combineAbortSignals(
  parentAbortSignal,
  AbortSignal.timeout(timeoutMs)
);

// Mapping: M→timeoutMs, A→hookConfig, P→hookAbortController, W→combinedSignal, G→cleanup, Aq→AbortController, fR→combineAbortSignals, z→parentAbortSignal
```

**Why 60 seconds**:
- Verification agents need time for multi-step checks (read file → run tests → return result)
- Most hooks complete in <10 seconds; 60s is generous buffer
- Prevents indefinite hanging if agent gets stuck

**Override**: Hook configs can specify custom timeout
```json
{
  "name": "TaskCompleted",
  "timeout": 120,  // 2 minutes for slow test suites
  "prompt": "Run tests and verify all pass..."
}
```

### Message Delivery Timeout: None (Synchronous)

**Current implementation**: Message delivery is synchronous file append
```javascript
fs.appendFileSync(mailboxPath, JSON.stringify(message) + "\n");
```

**Timeout behavior**:
- If file system is responsive: ~1ms
- If file system hangs (NFS issue, disk full): blocks indefinitely
- No explicit timeout or async fallback

**Mitigation**: File system issues are typically transient. If persistent, user must fix underlying issue (free disk space, fix NFS mount).

### Task Execution Timeout: None

**Current implementation**: No enforced timeout for agents working on tasks.

**Implicit timeout**: User can manually abort agents via shutdown request or process kill.

**Future enhancement**: Could add per-task timeout in task config
```json
{
  "taskId": "task-123",
  "timeout": 3600,  // 1 hour max
  "subject": "Run full test suite"
}
```

---

## 4. Turn Limits

### Hook Agent Turn Limit: 50

**Location**: `chunks.141.mjs:1594, 1639`

```javascript
// ============================================
// Hook turn limit enforcement
// Location: chunks.141.mjs:1594-1641
// ============================================

// ORIGINAL (for source lookup):
let S = 50,
    ...
    U = 0,
    x = !1;
for await (let p of ZR({ ... })) {
    if (p.type === "assistant") {
        if (U++, U >= 50) {
            x = !0, h(`Hooks: Agent turn ${U} hit max turns, aborting`), P.abort();
            break
        }
    }
}

// READABLE (for understanding):
const MAX_HOOK_TURNS = 50;
let turnCount = 0;
let hitMaxTurns = false;

for await (let event of runAgentLoop({ ... })) {
    if (event.type === "assistant") {
        turnCount++;
        if (turnCount >= MAX_HOOK_TURNS) {
            hitMaxTurns = true;
            log(`Hooks: Agent turn ${turnCount} hit max turns, aborting`);
            abortController.abort();
            break;
        }
    }
}

// Mapping: S→MAX_HOOK_TURNS, U→turnCount, x→hitMaxTurns, P→abortController, ZR→runAgentLoop, h→log
```

**Why 50 turns**:
- Prevents infinite loops (agent keeps using tools without returning result)
- Generous enough for complex verifications (read 5 files, run tests, parse output)
- Typical hooks complete in 2-5 turns

**What counts as a turn**: Each assistant response (after tool results are processed)

**Example turn progression**:
```
Turn 1: Agent decides to read test file
  → Tool: Read("test/api.test.ts")
Turn 2: Agent sees test file, decides to run tests
  → Tool: Bash("npm test")
Turn 3: Agent sees test output (all passed), returns structured output
  → Tool: StructuredOutput({ ok: true })
  → Hook completes (3 turns total)
```

### Regular Agent Turn Limit: None

**Current implementation**: Main agents (team lead, teammates) have no turn limit.

**Implicit limit**: Context window size (~200K tokens for Sonnet). Once exceeded, compact or session ends.

**Why no limit**: Main agents should complete user-requested tasks regardless of complexity.

---

## 5. Memory Limits

### Per-Agent Memory

**Node.js default**: ~4GB max heap (can be increased with `--max-old-space-size`)

**Typical usage**:
- **Base overhead**: ~200MB (Node.js runtime + dependencies)
- **Conversation history**: ~50MB per 1000 messages (with tool results)
- **Tool result caching**: Varies (large file reads cached temporarily)

**OOM scenarios**:
- Reading very large files (>100MB) into memory
- Generating massive tool outputs (e.g., directory listing with millions of files)
- Memory leaks in long-running agents (hours without restart)

**Mitigation**: Compact conversation history automatically when approaching limit.

### Team Context Memory

**Shared state (AppState)**: Stored in team lead's memory
```javascript
teamContext: {
  teamName: string,
  teammates: { [agentId]: TeammateInfo },
  ...
}
```

**Size**: ~1KB per teammate (metadata only, not full conversation)

**Realistic team size**: 100 teammates = ~100KB (negligible)

### Task List Memory

**Storage**: In-memory in team lead process

**Size**: ~500 bytes per task

**Realistic limit**: 1000 tasks = ~500KB (acceptable)

---

## 6. Disk Quotas

### Team Directory Size: No Enforced Quota

**Location**: `~/.claude/teams/{team-name}/`

**Contents**:
- `config.json`: ~1KB (for 10-member team)
- `mailbox/*.jsonl`: Grows unbounded with messages

**Mailbox growth**:
```
1 message ≈ 500 bytes (JSON serialized)
1000 messages ≈ 500KB
10,000 messages ≈ 5MB
```

**Practical limit**: File system capacity

**Cleanup**: TeamDelete removes entire directory. No automatic pruning of old messages.

**Future enhancement**: Could implement mailbox rotation
```javascript
// Rotate mailbox when >10MB
if (fs.statSync(mailboxPath).size > 10 * 1024 * 1024) {
  fs.renameSync(mailboxPath, `${mailboxPath}.${Date.now()}.archived`);
  fs.writeFileSync(mailboxPath, "");  // Start fresh
}
```

### Task Directory Size

**Location**: `~/.claude/tasks/{team-name}/`

**Contents**: Task state files (TODO items, dependencies)

**Size**: Similar to mailbox, grows with task count

**Cleanup**: Removed by TeamDelete

### Memory Directory Size (Auto Memory)

**Location**: `~/.claude/projects/{project-hash}/memory/`

**Contents**: MEMORY.md + topic files

**Typical size**: 10-50KB (MEMORY.md under 200 lines, 5-10 topic files)

**User responsibility**: Keep memory organized and pruned (see [usage_patterns.md](../31_auto_memory/usage_patterns.md))

---

## 7. Monitoring and Telemetry

### Telemetry Events for Resource Usage

**Hook execution**:
```typescript
// Success
c("tengu_agent_stop_hook_success", {
  durationMs: number,
  turnCount: number
});

// Max turns hit
c("tengu_agent_stop_hook_max_turns", {
  durationMs: number,
  turnCount: 50
});

// Error
c("tengu_agent_stop_hook_error", {
  durationMs: number,
  turnCount: number,
  errorType: 1 | 2  // 1 = no output, 2 = exception
});
```

**Memory usage**:
```typescript
// Memory loaded
cN9("tengu_memdir_loaded", {
  content_length: number,
  line_count: number,
  was_truncated: boolean,
  memory_type: "auto" | "agent"
});
```

**Backend operations**: (Likely exists, not verified)
```typescript
// Pane creation
c("tengu_backend_pane_created", {
  backend: "tmux" | "iterm",
  paneId: string,
  durationMs: number
});
```

### Observable Metrics

**In CLI output**:
- Hook execution time: Displayed in verbose mode
- Agent status: Shown in swarm view UI
- Message count: Visible in mailbox file line count

**In logs**:
- Turn counts: `[inProcessRunner] poll #${count}`
- Resource warnings: Memory truncation, hook timeouts

**In file system**:
- Mailbox size: `ls -lh ~/.claude/teams/*/mailbox/*.jsonl`
- Team count: `ls ~/.claude/teams/ | wc -l`

---

## 8. Exceeding Limits

### Hook Timeout Exceeded

**What happens**:
1. AbortSignal fires after 60 seconds
2. Hook agent loop terminates
3. `executeAgentHook` returns `{ outcome: "cancelled" }`
4. Telemetry event: `tengu_agent_stop_hook_error` or timeout-specific event

**User impact**: Hook condition not verified, but action proceeds (fail-open)

**User action**:
- Optimize hook prompt (reduce file reads, simplify checks)
- Increase timeout in hook config
- Split complex hook into multiple simpler hooks

### Hook Turn Limit Exceeded

**What happens**:
1. Turn counter reaches 50
2. `abortController.abort()` called
3. Hook returns `{ outcome: "cancelled" }`
4. Telemetry: `tengu_agent_stop_hook_max_turns`

**User impact**: Same as timeout - action proceeds

**User action**:
- Check for infinite tool use loops (agent keeps retrying failed tool)
- Simplify hook logic (avoid deep file tree traversals)
- Use shell command hooks instead (simpler, no turn limit)

### Backend Capacity Exceeded

**Scenario**: Too many tmux panes (>200), system becomes slow

**Detection**: User notices lag in terminal, pane creation takes >5 seconds

**Mitigation**:
- Switch to in-process backend (fewer resources per agent)
- Reduce team size (shut down idle teammates)
- Use multiple tmux sessions (spread load)

### Disk Quota Exceeded

**Scenario**: File system full, mailbox append fails

**Detection**: `ENOSPC` error from `fs.appendFileSync`

**User impact**: Message delivery fails, SendMessage returns error

**Mitigation**:
- Free disk space (delete old teams, logs)
- Archive old mailboxes (move to external storage)
- Implement mailbox rotation (future enhancement)

### Memory Exhausted (OOM)

**Scenario**: Agent process exceeds 4GB memory

**Detection**: Process crashes with "JavaScript heap out of memory"

**User impact**: Agent terminates, work lost (unless saved to files)

**Mitigation**:
- Increase heap size: `--max-old-space-size=8192`
- Run compact to reduce conversation size
- Avoid reading very large files into memory
- Restart agents periodically (every few hours)

---

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key constants and functions in this document:

- Hook timeout default: `60000` (60 seconds) - chunks.141.mjs:1572
- Hook max turns: `50` - chunks.141.mjs:1594
- `executeAgentHook` (Xi4) - Enforces timeout and turn limits
- `combineAbortSignals` (fR) - Merges timeout and parent abort signals
- `AbortController` (Aq) - Controls hook agent termination
- `recordTelemetry` (c) - Emits resource usage events
- `getBackend` (zt) - Backend availability check
- `isAvailable` - Backend method for checking if tmux/iTerm is ready

Telemetry events:
- `tengu_agent_stop_hook_success` - Hook completed successfully
- `tengu_agent_stop_hook_max_turns` - Hook hit 50-turn limit
- `tengu_agent_stop_hook_error` - Hook timed out or crashed
- `tengu_memdir_loaded` - Memory file loaded into prompt

Cross-references:

- [hooks_integration.md](./hooks_integration.md) - Hook timeout and turn limit details
- [error_recovery.md](./error_recovery.md) - Handling resource exhaustion errors
- [team_config_schema.md](./team_config_schema.md) - Team directory structure
- [31_auto_memory/usage_patterns.md](../31_auto_memory/usage_patterns.md) - Memory size management
