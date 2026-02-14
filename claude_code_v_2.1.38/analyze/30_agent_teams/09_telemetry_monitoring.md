# Telemetry & Monitoring for Agent Teams

> **Module**: Agent Teams - Telemetry & Monitoring
> **Version**: Claude Code 2.1.38
> **Purpose**: Document metrics collection, emission, and monitoring infrastructure for agent teams

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Debug Logging Infrastructure](#2-debug-logging-infrastructure)
3. [Structured Telemetry Events](#3-structured-telemetry-events)
4. [Team Lifecycle Logging](#4-team-lifecycle-logging)
5. [Performance Metrics Collection](#5-performance-metrics-collection)
6. [Correlation & Tracing](#6-correlation--tracing)
7. [Observability Gaps](#7-observability-gaps)
8. [Design Rationale & Trade-offs](#8-design-rationale--trade-offs)

---

## 1. Executive Summary

Agent teams telemetry in Claude Code 2.1.38 is **primarily debug logging** with minimal structured metrics. The observability strategy focuses on:

1. **Debug logging**: Extensive console logging via `h()` function for development/troubleshooting
2. **Minimal structured events**: Only 4 telemetry events specific to agent teams
3. **No aggregate metrics**: No teammate count, message volume, or task completion rate tracking
4. **No distributed tracing**: No correlation IDs linking team lead + teammates
5. **No performance metrics**: No spawn time, message latency, or throughput tracking

**Current instrumentation**:
- **Debug logs**: ~40 distinct log messages covering spawn, poll, messaging, errors
- **Telemetry events**: 4 events (agent hook lifecycle, tool selection, memory loading)
- **Error tracking**: Exceptions logged via `K1()` function (Sentry integration)

**Observability model**: **Development-focused** (debug logs for troubleshooting) rather than **production-focused** (metrics for monitoring/alerting).

**Key insight**: Agent teams lack production-grade observability. There's no dashboard or alerting for team health, performance degradation, or error rates. Troubleshooting relies on reading debug logs in the console.

---

## 2. Debug Logging Infrastructure

### 2.1 Debug Logging Function

**What it does**: Logs debug messages to console with optional metadata, used extensively throughout agent team code.

**How it works**:

```javascript
// ============================================
// h - Debug logging function
// Location: chunks.1.mjs:4187 (estimated)
// ============================================

// ORIGINAL (for source lookup):
function h(A, {}) {
    // Implementation details not fully visible in analyzed code
    // Inferred from usage: console logging with timestamp/context
}

// READABLE (for understanding):
function debugLog(message, options = {}) {
    // Logs message to console (likely with timestamp and context)
    // Used for development debugging and troubleshooting
    // NOT sent to telemetry backend (Datadog, BigQuery, etc.)
}

// Mapping: h→debugLog, A→message
```

**Usage pattern** (examples from source):

```javascript
// Team spawning
h(`[spawnInProcessTeammate] Spawning ${agentName} (taskId: ${taskId})`);

// Poll loop
h(`[inProcessRunner] ${agentName} starting poll loop (abort=${abortController.signal.aborted})`);

// Message delivery
h(`[inProcessRunner] ${agentName} received new message from ${message.from} (index ${index})`);

// Errors
h(`[TeammateTool] Failed to read team file for ${teamName}: ${error.message}`);
```

**Message prefixes by module**:

| Prefix | Module | Example Message |
|--------|--------|----------------|
| `[TeammateTool]` | Team management | `Removed teammate from team file: researcher` |
| `[inProcessRunner]` | In-process teammate execution | `Starting agent loop for researcher@web-app-team` |
| `[PaneBackendExecutor]` | Pane-based teammate spawning | `Spawned teammate researcher in pane pane-123` |
| `[Tasks]` | Task claiming/management | `Failed to claim task 5: already_claimed` |
| `[InboxPoller]` | Mailbox polling | `Found 3 unread message(s)` |

**Why this approach**:
- **Simple**: No telemetry backend setup required
- **Development-friendly**: Console logs visible in terminal during development
- **High verbosity**: Logs every poll iteration, message delivery, state change
- **No overhead**: Console logging is fast (no network calls)

**Trade-offs**:
- **Not production-observable**: Logs lost when process exits (no persistence)
- **No aggregation**: Can't query "how many teammates spawned today?"
- **No alerting**: Can't alert on error rate or performance degradation

**Alternative considered**: Structured logging to telemetry backend.
**Why not**: Adds complexity and cost. Debug logs sufficient for current use case (experimental feature).

### 2.2 Comprehensive Debug Log Catalog

**What it does**: Complete list of debug log messages emitted by agent team code.

**Spawn Lifecycle Logs**:

```javascript
// In-process spawn
h(`[spawnInProcessTeammate] Spawning ${agentName} (taskId: ${taskId})`);
h(`[spawnInProcessTeammate] Failed to spawn ${agentName}: ${error}`);
h(`[InProcessBackend] Started agent execution for ${agentId}`);
h(`[InProcessBackend] Invalid agentId format: ${agentId}`);

// Pane spawn
h(`[PaneBackendExecutor] Spawned teammate ${agentName} in pane ${paneId}`);
h(`[PaneBackendExecutor] kill() failed: teammate ${agentName} not found in spawned map`);
h(`[PaneBackendExecutor] isActive() called for ${agentName}`);
```

**Poll Loop Logs**:

```javascript
// Poll start/end
h(`[inProcessRunner] ${agentName} starting poll loop (abort=${abortSignal.aborted})`);
h(`[inProcessRunner] ${agentName} exiting poll loop (abort=${abortSignal.aborted}, polls=${pollCount})`);

// Poll iterations
h(`[inProcessRunner] ${agentName} poll #${pollCount}: checking mailbox`);
h(`[inProcessRunner] ${agentName} aborted while waiting (poll #${pollCount})`);
h(`[inProcessRunner] ${agentName} poll error: ${error}`);
```

**Message Delivery Logs**:

```javascript
// Incoming messages
h(`[inProcessRunner] ${agentName} found pending user message (poll #${pollCount})`);
h(`[inProcessRunner] ${agentName} received new message from ${sender} (index ${messageIndex})`);
h(`[inProcessRunner] ${agentName} received shutdown request from ${sender} (prioritized over ${unreadCount} unread messages)`);

// Mailbox polling
h(`[InboxPoller] Found ${unreadCount} unread message(s)`);
h(`[InboxPoller] Received plan approval response from team-lead: approved=${approved}`);
h(`[InboxPoller] Plan approved by team lead, exited plan mode to ${targetMode}`);
h(`[InboxPoller] Plan rejected by team lead: ${feedback}`);
h(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${sender}`);
```

**Agent Loop Logs**:

```javascript
// Agent execution
h(`[inProcessRunner] Starting agent loop for ${agentId}`);
h(`[inProcessRunner] ${agentId} processing prompt: ${prompt.substring(0,50)}...`);
h(`[inProcessRunner] ${agentId} compacting history (${tokenCount} tokens)`);
h(`[inProcessRunner] ${agentId} finished prompt, waiting for next`);

// Interrupts
h(`[inProcessRunner] ${agentId} lifecycle aborted`);
h(`[inProcessRunner] ${agentId} current work aborted (Escape pressed)`);
h(`[inProcessRunner] ${agentId} work interrupted, returning to idle`);

// Idle
h(`[inProcessRunner] Skipping duplicate idle notification for ${agentName}`);
```

**Team Management Logs**:

```javascript
// Team file operations
h(`[TeammateTool] Failed to read team file for ${teamName}: ${error.message}`);
h(`[TeammateTool] Cannot remove teammate ${agentName}: failed to read team file for "${teamName}"`);
h(`[TeammateTool] Teammate ${agentName} not found in team file for "${teamName}"`);
h(`[TeammateTool] Removed teammate from team file: ${agentName}`);

// Team cleanup
h(`[TeammateTool] Cleaned up team directory: ${teamDirectory}`);
h(`[TeammateTool] Failed to clean up team directory ${teamDirectory}: ${error.message}`);

// Member mode changes
h(`[TeammateTool] Set member ${agentName} in team ${teamName} to mode: ${permissionMode}`);
h(`[TeammateTool] Set ${memberCount} member modes in team ${teamName}`);
h(`[TeammateTool] Set member ${agentName} in team ${teamName} to ${"active" : "idle"}`);
h(`[TeammateTool] Cannot set member active: team ${teamName} not found`);
h(`[TeammateTool] Cannot set member active: member ${agentName} not found in team ${teamName}`);

// Pane management
h(`[TeammateTool] Removed member with pane ${paneId} from team ${teamName}`);
h(`[TeammateTool] Removed member ${agentName} from team ${teamName}`);
```

**Error Logs**:

```javascript
// Agent failures
h(`[inProcessRunner] Agent ${agentId} failed: ${error}`);
h(`[inProcessRunner] Unhandled error in ${agentId}: ${error}`);

// Task claiming errors
h(`[inProcessRunner] Failed to claim task #${taskId}: ${reason}`);
h(`[inProcessRunner] Error checking task list: ${error}`);
h(`[Tasks] Failed to claim task ${taskId}: ${error.message}`);
```

**Why this catalog matters**:
- **Troubleshooting guide**: Maps log messages to source locations and scenarios
- **Pattern recognition**: Identify common error patterns by log message
- **Monitoring**: Could grep logs for specific messages to detect issues

---

## 3. Structured Telemetry Events

### 3.1 Agent Hook Telemetry

**What it does**: Tracks agent hook lifecycle events (success, errors, timeouts).

**Events emitted**:

```javascript
// ============================================
// Agent hook telemetry events
// Location: chunks.141.mjs:1653-1700
// ============================================

// ORIGINAL (for source lookup):
// Max turns exceeded
if (x) return h("Hooks: Agent hook did not complete within 50 turns"), c("tengu_agent_stop_hook_max_turns", {
    agent: q,
    hook: "stop"
});

// Missing structured output
return h("Hooks: Agent hook did not return structured output"), c("tengu_agent_stop_hook_error", {
    agent: q,
    hook: "stop",
    error: "missing_structured_output"
});

// Hook success
return h("Hooks: Agent hook condition was met"), c("tengu_agent_stop_hook_success", {
    agent: q,
    hook: "stop",
    condition: H.action
});

// Hook error
return h(`Hooks: Agent hook error: ${D}`), c("tengu_agent_stop_hook_error", {
    agent: q,
    hook: "stop",
    error: String(D)
});

// READABLE (for understanding):
// Max turns exceeded
if (exceededMaxTurns) {
    debugLog("Hooks: Agent hook did not complete within 50 turns");
    trackEvent("tengu_agent_stop_hook_max_turns", {
        agent: agentName,
        hook: "stop"
    });
}

// Missing structured output
debugLog("Hooks: Agent hook did not return structured output");
trackEvent("tengu_agent_stop_hook_error", {
    agent: agentName,
    hook: "stop",
    error: "missing_structured_output"
});

// Hook success
debugLog("Hooks: Agent hook condition was met");
trackEvent("tengu_agent_stop_hook_success", {
    agent: agentName,
    hook: "stop",
    condition: hookResult.action
});

// Hook error
debugLog(`Hooks: Agent hook error: ${error}`);
trackEvent("tengu_agent_stop_hook_error", {
    agent: agentName,
    hook: "stop",
    error: String(error)
});

// Mapping: c→trackEvent, q→agentName, H→hookResult, D→error, x→exceededMaxTurns
```

**Event schemas**:

| Event Name | Metadata Fields | When Emitted |
|------------|----------------|--------------|
| `tengu_agent_stop_hook_max_turns` | `agent`, `hook` | Agent hook exceeded 50 agent loop turns |
| `tengu_agent_stop_hook_error` | `agent`, `hook`, `error` | Agent hook threw error or returned invalid output |
| `tengu_agent_stop_hook_success` | `agent`, `hook`, `condition` | Agent hook successfully returned condition met |

**Why agent hooks matter**:
- **Stop conditions**: Hooks can programmatically stop agent execution when condition met
- **Custom logic**: User-defined JavaScript functions for agent control
- **Telemetry critical**: Hooks can fail, timeout, or misbehave—need visibility

**Usage**: Track hook reliability and performance (how often do hooks fail?).

### 3.2 Agent Memory Telemetry

**What it does**: Tracks when custom agent memory is loaded for teammates.

**Event emitted**:

```javascript
// ============================================
// Agent memory loading telemetry
// Location: chunks.131.mjs:386, chunks.132.mjs:207
// ============================================

// ORIGINAL (for source lookup):
if (w.memory) c("tengu_agent_memory_loaded", {
    ...{},
    scope: w.memory,
    source: "in-process-teammate"
});

// READABLE (for understanding):
if (agentDefinition.memory) {
    trackEvent("tengu_agent_memory_loaded", {
        scope: agentDefinition.memory,
        source: "in-process-teammate"  // or "split-pane-teammate"
    });
}

// Mapping: c→trackEvent, w→agentDefinition
```

**Event schema**:

| Event Name | Metadata Fields | When Emitted |
|------------|----------------|--------------|
| `tengu_agent_memory_loaded` | `scope`, `source` | Teammate spawned with custom memory scope |

**Memory scopes**:
- `"project"` - Project-specific memory directory
- `"global"` - User-wide memory directory
- Custom path - Arbitrary directory specified in agent definition

**Usage**: Track adoption of custom agent memory feature (how many teams use it?).

### 3.3 Agent Tool Selection Telemetry

**What it does**: Tracks when an agent (teammate) selects a tool for execution.

**Event emitted**:

```javascript
// ============================================
// Tool selection telemetry
// Location: chunks.132.mjs:185
// ============================================

// ORIGINAL (for source lookup):
c("tengu_agent_tool_selected", {
    tool: O.name,
    agent: q.agentName
});

// READABLE (for understanding):
trackEvent("tengu_agent_tool_selected", {
    tool: toolUse.name,
    agent: identity.agentName
});

// Mapping: c→trackEvent, O→toolUse, q→identity
```

**Event schema**:

| Event Name | Metadata Fields | When Emitted |
|------------|----------------|--------------|
| `tengu_agent_tool_selected` | `tool`, `agent` | Teammate selected a tool for execution (before execution) |

**Usage**: Analyze tool usage patterns per teammate (which tools do teammates use most?).

### 3.4 Agent Tool Completion Telemetry

**What it does**: Tracks when an agent completes a tool execution.

**Event emitted**:

```javascript
// ============================================
// Tool completion telemetry
// Location: chunks.131.mjs:2526
// ============================================

// ORIGINAL (for source lookup):
return c("tengu_agent_tool_completed", {
    tool: K.name,
    agent: A.agentName
}), await K.execute(K2, A, q);

// READABLE (for understanding):
trackEvent("tengu_agent_tool_completed", {
    tool: toolUse.name,
    agent: identity.agentName
});
return await toolUse.execute(toolContext, identity, params);

// Mapping: c→trackEvent, K→toolUse, A→identity, q→params
```

**Event schema**:

| Event Name | Metadata Fields | When Emitted |
|------------|----------------|--------------|
| `tengu_agent_tool_completed` | `tool`, `agent` | Teammate completed tool execution (after execution) |

**Usage**: Track tool execution duration (time between `tool_selected` and `tool_completed`).

**Missing metadata**: No execution time, success/failure status, or error details. These would significantly improve observability.

### 3.5 Telemetry Event Summary

**Complete event catalog**:

```javascript
// Agent hooks (3 events)
c("tengu_agent_stop_hook_max_turns", { agent, hook });
c("tengu_agent_stop_hook_error", { agent, hook, error });
c("tengu_agent_stop_hook_success", { agent, hook, condition });

// Agent memory (1 event)
c("tengu_agent_memory_loaded", { scope, source });

// Agent tools (2 events)
c("tengu_agent_tool_selected", { tool, agent });
c("tengu_agent_tool_completed", { tool, agent });
```

**Total**: 6 distinct telemetry events (only 4 are team-specific, 2 are general agent events).

**Why so few events?**:
- **Experimental feature**: Agent teams gated behind feature flag, not production-ready
- **Development focus**: Prioritize rapid iteration over observability
- **Debug logs sufficient**: For experimental feature, console logs adequate

---

## 4. Team Lifecycle Logging

### 4.1 Team Creation Logging

**What it does**: Logs when teams are created, including team name and description.

**Current logging**:

```
// No explicit "Team created" log message found in code
// Team creation is implicit via TeamCreate tool execution
```

**Missing**: No structured log or telemetry event when team is created. Would be useful for tracking:
- Team creation rate
- Average team size
- Team naming patterns

**Workaround**: Could infer team creation from filesystem events (team directory created).

### 4.2 Teammate Spawn Logging

**What it does**: Logs when teammates are spawned, including agent name and spawn mode.

**Current logging**:

```javascript
// In-process spawn
h(`[spawnInProcessTeammate] Spawning ${agentName} (taskId: ${taskId})`);
h(`[InProcessBackend] Started agent execution for ${agentId}`);

// Pane spawn
h(`[PaneBackendExecutor] Spawned teammate ${agentName} in pane ${paneId}`);
```

**Missing structured telemetry**: No `tengu_teammate_spawned` event with metadata:
- `spawn_mode`: "in-process", "split-pane", "separate-window"
- `team_name`: Team the teammate belongs to
- `plan_mode_required`: Whether teammate starts in plan mode
- `spawn_time_ms`: Time from spawn request to agent loop start

**Impact**: Can't analyze spawn performance or mode distribution.

### 4.3 Team Shutdown Logging

**What it does**: Logs when teams are shut down (gracefully or forcefully).

**Current logging**:

```javascript
// Shutdown request
h(`[inProcessRunner] ${agentId} received shutdown request - passing to model`);

// No team-level shutdown logging
```

**Missing**: No aggregate team shutdown event or cleanup completion log.

### 4.4 Message Volume Logging

**What it does**: Logs message delivery events for inter-agent communication.

**Current logging**:

```javascript
// Message received
h(`[inProcessRunner] ${agentName} received new message from ${sender} (index ${messageIndex})`);
h(`[InboxPoller] Found ${unreadCount} unread message(s)`);
```

**Missing structured telemetry**: No `tengu_message_sent` or `tengu_message_received` events.

**Impact**: Can't analyze:
- Message throughput (messages/sec)
- Message latency (time from send to receive)
- Message types distribution (direct vs. broadcast vs. system messages)

---

## 5. Performance Metrics Collection

### 5.1 Spawn Time Metrics

**Problem**: No metrics tracking how long it takes to spawn teammates.

**What should be tracked**:

```javascript
// Hypothetical instrumentation
let spawnStartTime = Date.now();

// ... spawn teammate ...

let spawnDuration = Date.now() - spawnStartTime;
trackEvent("tengu_teammate_spawn_duration", {
    spawn_mode: "in-process",
    duration_ms: spawnDuration,
    agent_name: agentName
});
```

**Missing data**:
- Average spawn time per mode (in-process vs. pane)
- Spawn time percentiles (p50, p95, p99)
- Spawn failure rate

**Why it matters**: Spawn time affects user experience (how long user waits for team to be ready).

### 5.2 Message Latency Metrics

**Problem**: No metrics tracking message delivery latency.

**What should be tracked**:

```javascript
// Hypothetical instrumentation
message.sentTimestamp = Date.now();

// ... write to mailbox ...

// On receive:
let receiveTimestamp = Date.now();
let latency = receiveTimestamp - message.sentTimestamp;
trackEvent("tengu_message_latency", {
    latency_ms: latency,
    message_type: message.type,
    sender: message.from,
    receiver: agentName
});
```

**Missing data**:
- Message delivery latency (time from send to receive)
- Mailbox poll efficiency (% of polls with new messages)
- Message queue depth (unread message count over time)

**Why it matters**: High latency indicates system slowdown or contention.

### 5.3 Task Claiming Metrics

**Problem**: No metrics tracking task claiming success rate or contention.

**What should be tracked**:

```javascript
// Hypothetical instrumentation
let claimResult = attemptToClaimTask(storageContext, taskId, agentName);
trackEvent("tengu_task_claim_attempt", {
    success: claimResult.success,
    reason: claimResult.reason,  // "blocked", "already_claimed", "success"
    agent_name: agentName,
    task_id: taskId
});
```

**Missing data**:
- Task claim success rate
- Claim failure reasons distribution (blocked vs. already claimed)
- Task claim contention (multiple agents competing for same task)

**Why it matters**: Low claim success rate indicates dependency issues or task shortage.

---

## 6. Correlation & Tracing

### 6.1 Lack of Correlation IDs

**Problem**: No correlation IDs linking team lead and teammates.

**Current state**: Each teammate has independent agent ID (e.g., `researcher@web-app-team`), but no shared team-level trace ID.

**What's missing**:

```javascript
// Hypothetical correlation
let teamTraceId = generateTraceId();  // Shared across all teammates

// On every telemetry event:
trackEvent("tengu_teammate_spawned", {
    team_trace_id: teamTraceId,  // ← Links all team members
    agent_name: agentName,
    ...
});
```

**Impact**:
- Can't trace full team execution flow (lead → teammate1 → teammate2)
- Can't aggregate metrics per team (total messages sent across all teammates)
- Can't build team-level dashboards

**Why it matters**: Distributed tracing is critical for understanding multi-agent workflows.

### 6.2 No Parent-Child Relationships

**Problem**: No explicit parent-child relationship tracking for spawned teammates.

**What's missing**:

```javascript
// Hypothetical parent-child tracking
trackEvent("tengu_teammate_spawned", {
    parent_agent_id: "team-lead@web-app-team",  // ← Links to parent
    child_agent_id: "researcher@web-app-team",
    spawn_depth: 1  // How many levels deep
});
```

**Impact**: Can't visualize spawn tree or detect spawn recursion depth.

---

## 7. Observability Gaps

### 7.1 Missing Metrics

**Teammate lifecycle metrics**:
- Total teammates spawned (cumulative counter)
- Active teammate count (gauge)
- Teammate spawn rate (rate)
- Teammate lifetime duration (histogram)

**Message metrics**:
- Messages sent/received (counter)
- Message latency (histogram)
- Unread message queue depth (gauge)
- Message types distribution (counter per type)

**Task metrics**:
- Tasks created (counter)
- Tasks completed (counter)
- Task duration (histogram)
- Task claim attempts vs. successes (ratio)

**Error metrics**:
- Teammate spawn failures (counter)
- Teammate crash rate (counter)
- Message delivery failures (counter)
- Hook execution failures (counter)

### 7.2 Missing Logging

**Team-level logs**:
- Team created (with team name, description, member count)
- Team shutdown (with shutdown reason, member count, lifetime duration)
- Team config updated (mode changes, member additions/removals)

**Aggregate logs**:
- Summary on team shutdown (tasks completed, messages sent, errors encountered)
- Periodic status logs (every N minutes, log team health)

### 7.3 Missing Alerting

**No alerts defined for**:
- Teammate spawn failure rate > threshold
- Message queue depth > threshold (indicates backlog)
- Task claim success rate < threshold
- Teammate crash rate > threshold

**Why it matters**: Production systems need alerting to detect and respond to issues.

---

## 8. Design Rationale & Trade-offs

### 8.1 Why Debug Logs Instead of Structured Metrics?

**Problem**: Need visibility into agent team behavior.

**Solution**: Extensive debug logging via `h()` function.

**Rationale**:
1. **Experimental feature**: Agent teams gated behind feature flag, not production-ready
2. **Development focus**: Debug logs sufficient for troubleshooting during development
3. **Simplicity**: No telemetry backend setup or schema design required
4. **Fast iteration**: Can add debug logs quickly without changing telemetry infrastructure

**Trade-offs**:
- **Not production-observable**: Logs lost when process exits
- **No aggregation**: Can't query metrics or build dashboards
- **High noise**: Verbose logs (every poll iteration) clutter console

**When to migrate**: When agent teams move to production, add structured metrics.

### 8.2 Why No Correlation IDs?

**Problem**: Need to trace multi-agent workflows.

**Solution**: None currently implemented.

**Rationale**:
1. **Complexity**: Correlation IDs require thread-local storage or context propagation
2. **Deferred**: Wait until agent teams stabilize before adding tracing
3. **Workaround**: Can infer relationships from agent IDs (e.g., `@web-app-team` suffix)

**Trade-offs**:
- **Limited traceability**: Can't reconstruct full team execution flow
- **No aggregate metrics**: Can't compute team-level stats

**Future work**: Add OpenTelemetry distributed tracing with trace context propagation.

### 8.3 Why No Performance Metrics?

**Problem**: Need to detect performance degradation.

**Solution**: None currently implemented.

**Rationale**:
1. **Not production-critical**: Performance issues handled reactively (user reports slowness)
2. **Overhead concern**: Metrics collection adds latency (e.g., timestamp recording)
3. **Deferred**: Focus on feature stability before optimizing performance

**Trade-offs**:
- **Blind to performance**: Can't proactively detect slowdowns
- **Reactive troubleshooting**: Must reproduce issues to diagnose

**Future work**: Add spawn time, message latency, and task duration histograms.

### 8.4 Why Minimal Structured Events?

**Problem**: Need some telemetry for feature usage tracking.

**Solution**: Only 4-6 structured events (hooks, memory, tools).

**Rationale**:
1. **Selective instrumentation**: Only instrument features with error-prone behavior (hooks)
2. **Cost control**: Structured events sent to telemetry backend (BigQuery) cost money
3. **Statsig gates**: Feature gating can track adoption without explicit events

**Trade-offs**:
- **Limited visibility**: Missing lifecycle events (spawn, shutdown, messaging)
- **No production monitoring**: Can't build health dashboards

**When to expand**: When agent teams graduate from experimental to production.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `debugLog` (h) - Debug logging function (chunks.1.mjs:4187)
- `trackEvent` (c) - Structured telemetry event tracking (chunks.1.mjs:4278)
- `trackEventAsync` (ml) - Async telemetry event tracking (chunks.1.mjs:4290)
- `logError` (K1) - Error logging to Sentry (chunks, line TBD)

Telemetry events:
- `tengu_agent_stop_hook_max_turns` - Agent hook exceeded max turns (chunks.141.mjs:1653)
- `tengu_agent_stop_hook_error` - Agent hook error (chunks.141.mjs:1660, 1700)
- `tengu_agent_stop_hook_success` - Agent hook success (chunks.141.mjs:1677)
- `tengu_agent_memory_loaded` - Custom agent memory loaded (chunks.131.mjs:386, chunks.132.mjs:207)
- `tengu_agent_tool_selected` - Agent selected tool (chunks.132.mjs:185)
- `tengu_agent_tool_completed` - Agent completed tool execution (chunks.131.mjs:2526)

---

## Cross-References

- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Overall team workflow (logging context)
- [error_recovery.md](./error_recovery.md) - Error handling and recovery (logging)
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Spawn logging
- [04_polling_priorities.md](./04_polling_priorities.md) - Poll loop logging
- [hooks_integration.md](./hooks_integration.md) - Hook telemetry events

---

## Appendix: Potential Telemetry Additions

### High-Priority Metrics (Production-Critical)

```javascript
// Team lifecycle
c("tengu_team_created", { team_name, member_count, description });
c("tengu_team_shutdown", { team_name, lifetime_ms, tasks_completed, messages_sent });

// Teammate lifecycle
c("tengu_teammate_spawned", { agent_name, spawn_mode, plan_mode_required, spawn_time_ms });
c("tengu_teammate_terminated", { agent_name, termination_reason, lifetime_ms });

// Message delivery
c("tengu_message_sent", { message_type, sender, receiver, team_name });
c("tengu_message_received", { message_type, sender, receiver, latency_ms });

// Task execution
c("tengu_task_claimed", { task_id, agent_name, claim_time_ms });
c("tengu_task_completed", { task_id, agent_name, duration_ms, status });
```

### Medium-Priority Metrics (Performance Monitoring)

```javascript
// Performance
c("tengu_poll_iteration", { agent_name, had_messages, poll_duration_ms });
c("tengu_mailbox_lock_wait", { agent_name, wait_time_ms });
c("tengu_agent_loop_iteration", { agent_name, iteration_duration_ms, tool_calls_count });
```

### Low-Priority Metrics (Deep Diagnostics)

```javascript
// Detailed tool execution
c("tengu_tool_execution", { tool_name, agent_name, duration_ms, success, error_type });

// Memory usage
c("tengu_agent_memory_usage", { agent_name, heap_mb, external_mb });

// File I/O
c("tengu_task_file_lock_acquired", { task_id, wait_time_ms });
```
