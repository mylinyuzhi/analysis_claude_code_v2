# Claude Code v2.1.7 - Subagent Error Handling

## Overview

This document covers error handling, timeout mechanisms, and abort patterns for the Claude Code subagent system.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key elements in this document:
- Error types and messages
- AbortController pattern
- TaskOutput timeout (block/timeout parameters)
- NO explicit retry mechanism (confirmed)

---

## Error Types

### 1. Agent Not Found Error

Thrown when an invalid `subagent_type` is specified.

```javascript
// ============================================
// Agent Not Found Error
// Location: chunks.113.mjs:110
// ============================================

// ORIGINAL:
throw Error(`Agent type '${Q}' not found. Available agents: ${E.map((S)=>S.agentType).join(", ")}`)

// READABLE:
if (!agentDefinition) {
  throw new Error(
    `Agent type '${subagent_type}' not found. Available agents: ${activeAgents.map(a => a.agentType).join(", ")}`
  );
}
```

**Example Error:**
```
Agent type 'invalid-agent' not found. Available agents: Bash, general-purpose, Explore, Plan, statusline-setup, claude-code-guide
```

**When This Occurs:**
- Typo in `subagent_type` parameter
- Referencing a plugin agent that's not installed
- Using an agent from settings that doesn't exist

**How to Handle:**
- Main agent receives error in tool result
- Can retry with correct agent type
- Can fall back to a different agent

---

### 2. Agent Permission Denied Error (NEW in 2.1.7)

Thrown when an agent type is denied by permission rules.

```javascript
// ============================================
// Agent Permission Denied Error
// Location: chunks.113.mjs:108
// ============================================

// ORIGINAL:
if (H.find((S) => S.agentType === Q)) {
  let S = cz0(V.toolPermissionContext, f3, Q);
  throw Error(`Agent type '${Q}' has been denied by permission rule '${f3}(${Q})' from ${S?.source??"settings"}.`)
}

// READABLE:
if (allAgents.find(a => a.agentType === subagent_type)) {
  // Agent exists but is denied by permission rules
  const denyRule = findDenyRule(toolPermissionContext, TASK_TOOL_NAME, subagent_type);
  throw new Error(
    `Agent type '${subagent_type}' has been denied by permission rule 'Task(${subagent_type})' from ${denyRule?.source ?? "settings"}.`
  );
}

// Mapping: cz0→findDenyRule
```

**Example Error:**
```
Agent type 'general-purpose' has been denied by permission rule 'Task(general-purpose)' from projectSettings.
```

**When This Occurs:**
- Agent is explicitly denied in permission configuration
- Organization policy blocks certain agents
- Project settings restrict agent access

---

### 3. Transcript Not Found Error

Thrown when `resume` parameter references a non-existent agent ID.

```javascript
// ============================================
// Transcript Not Found Error
// Location: chunks.113.mjs:124
// ============================================

// ORIGINAL:
if (Z) {
  let b = await bD1(iz(Z));
  if (!b) throw Error(`No transcript found for agent ID: ${Z}`);
  O = b
}

// READABLE:
if (resume) {
  const transcript = await loadTranscript(getTranscriptPath(resume));
  if (!transcript) {
    throw new Error(`No transcript found for agent ID: ${resume}`);
  }
  resumeMessages = transcript;
}

// Mapping: bD1→loadTranscript, iz→getTranscriptPath
```

**Example Error:**
```
No transcript found for agent ID: agent-nonexistent-123
```

**When This Occurs:**
- Invalid agent ID passed to `resume`
- Transcript file was deleted or expired
- Agent ID from different session
- Agent never completed (no transcript saved)

**How to Handle:**
- Main agent can retry without `resume` parameter
- Spawn fresh agent instead of resuming

---

### 4. Abort Error (aG Class)

Thrown when the agent execution is aborted via AbortController.

```javascript
// ============================================
// Abort Error Check
// Location: chunks.113.mjs:346, 192
// ============================================

// ORIGINAL:
if (GA && kD1(GA)) throw new aG;

// In background agent error handling:
} catch (f) {
  if (f instanceof aG) {
    $4A(S.agentId, X.setAppState);  // killBackgroundTask
    C4A(S.agentId, B, "killed", void 0, X.setAppState);  // createTaskNotification
    return
  }
  // ... handle other errors
}

// READABLE:
if (abortSignal && isAborted(abortSignal)) {
  throw new AbortError();
}

// In background agent error handling:
} catch (error) {
  if (error instanceof AbortError) {
    killBackgroundTask(taskId, setAppState);
    createTaskNotification(taskId, description, "killed", undefined, setAppState);
    return;  // Clean exit, no error propagation
  }
  // ... handle other errors
}

// Mapping: aG→AbortError, kD1→isAborted, $4A→killBackgroundTask, C4A→createTaskNotification
```

**When This Occurs:**
- User cancels operation (Ctrl+C)
- Parent aborts due to timeout
- System shutdown
- KillShell tool invoked

**Characteristics:**
- Clean exit - no partial results
- AbortController signal propagated
- Transcript may be incomplete
- Task marked as "killed" (not "failed")

---

### 5. System Prompt Generation Error

Caught and logged when agent system prompt fails to generate.

```javascript
// ============================================
// System Prompt Error
// Location: chunks.113.mjs:129-137
// ============================================

// ORIGINAL:
try {
  let b = Array.from(V.toolPermissionContext.additionalWorkingDirectories.keys()),
    S = z.getSystemPrompt({ toolUseContext: X });
  M = await pkA([S], $, b)
} catch (b) {
  k(`Failed to get system prompt for agent ${z.agentType}: ${b instanceof Error?b.message:String(b)}`)
}

// READABLE:
try {
  const workingDirs = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys());
  const rawSystemPrompt = agentDefinition.getSystemPrompt({ toolUseContext });
  resolvedSystemPrompt = await processSystemPrompt([rawSystemPrompt], model, workingDirs);
} catch (error) {
  log(`Failed to get system prompt for agent ${agentDefinition.agentType}: ${error instanceof Error ? error.message : String(error)}`);
  // Agent continues with default/fallback prompt
}

// Mapping: k→log, pkA→processSystemPrompt
```

**When This Occurs:**
- Custom agent has invalid getSystemPrompt function
- System prompt dependencies unavailable
- Plugin agent configuration error

**Behavior:**
- Error is logged but NOT thrown
- Agent continues with fallback/default prompt
- May produce suboptimal results

---

## AbortController Pattern

Subagents use an isolated AbortController for cancellation:

### AbortController Creation

```javascript
// ============================================
// Background Agent AbortController
// Location: chunks.91.mjs:1288-1315
// ============================================

// In createFullyBackgroundedAgent (L32):
// Creates a new AbortController for background execution
let abortController = new AbortController();

// For sync agents (O32):
// Creates backgroundSignal Promise and stores resolver in Map
let resolveBackground;
let backgroundSignal = new Promise((resolve) => {
  resolveBackground = resolve;
});
backgroundSignalMap.set(agentId, resolveBackground);
```

### AbortController Hierarchy

```
Main Agent AbortController
           │
           │ (for sync agents: O32)
           ▼
┌─────────────────────────────┐
│ Subagent can be backgrounded│
│   - backgroundSignal Promise│
│   - Resolver in Map         │
└─────────────────────────────┘
           │
           │ (for background agents: L32)
           ▼
┌─────────────────────────────┐
│ New AbortController         │
│   - Independent from parent │
│   - Allows background run   │
└─────────────────────────────┘
```

### Abort Propagation

| Scenario | Parent Aborts | Subagent Behavior |
|----------|--------------|-------------------|
| Sync (default) | ✅ | Can background via Ctrl+B |
| Background (from start) | ✅ | Continues independently |
| KillShell invoked | ✅ | Task killed |

---

## Timeout Handling

### TaskOutput Timeout

The `timeout` parameter controls how long to wait for a background agent:

```javascript
// TaskOutput schema (from system)
{
  task_id: string,        // Required: agent ID
  block: boolean,         // Default: true - wait for completion
  timeout: number         // Default: 30000ms, max: 600000ms
}
```

**Timeout Behavior:**

| timeout | block | Behavior |
|---------|-------|----------|
| 0 | true | Minimal wait |
| 30000 (default) | true | Wait up to 30 seconds |
| 600000 (max) | true | Wait up to 10 minutes |
| Any | false | Immediate status check |

**Timeout Flow:**
```
TaskOutput called with block=true, timeout=60000
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ Wait for agent completion, checking periodically                │
└─────────────────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼ Completes before 60s    ▼ 60 seconds pass
┌─────────────────────┐   ┌─────────────────────┐
│ Return completed    │   │ Return current      │
│ results             │   │ status (may be      │
│                     │   │ running)            │
└─────────────────────┘   └─────────────────────┘
```

### No Explicit Agent Execution Timeout

**Important Finding**: There is NO explicit timeout on agent execution itself.

- Agents run until completion or abort
- No automatic timeout kills an agent
- Background agents persist until done
- Main agent controls wait via TaskOutput

**Implications:**
- Long-running agents can consume resources
- Background agents should be designed to complete
- Main agent should use timeout wisely
- Consider `max_turns` parameter to limit iterations

---

## Retry Mechanism

### Key Finding: NO Explicit Retry

**Important**: There is NO automatic retry mechanism for subagent failures.

```
Error occurs during subagent execution
            │
            ▼
   ┌────────────────────┐
   │ Error returned to  │
   │ main agent in      │
   │ tool result        │
   └────────────────────┘
            │
            ▼
   ┌────────────────────┐
   │ Main agent decides │
   │ what to do:        │
   │ - Retry manually   │
   │ - Use diff agent   │
   │ - Report error     │
   └────────────────────┘
```

**Why No Auto-Retry:**
- Subagents are stateless - retry would start fresh anyway
- Main agent has context to make better retry decisions
- Some errors shouldn't be retried (invalid agent type)
- Resource management (avoid runaway retries)

**Manual Retry Pattern:**
```javascript
// Main agent can manually retry
// First attempt:
Task(subagent_type: "Explore", prompt: "...")
// Result: Error

// Main agent decides to retry:
Task(subagent_type: "Explore", prompt: "..." /* modified prompt */)
// Or use different agent:
Task(subagent_type: "general-purpose", prompt: "...")
```

---

## Background Agent Error Handling

Background agents have special error handling:

```javascript
// ============================================
// Background Agent Error Handling
// Location: chunks.113.mjs:191-198
// ============================================

// ORIGINAL:
} catch (f) {
  if (f instanceof aG) {
    $4A(S.agentId, X.setAppState), C4A(S.agentId, B, "killed", void 0, X.setAppState);
    return
  }
  let AA = f instanceof Error ? f.message : String(f);
  jI0(S.agentId, AA, X.setAppState), C4A(S.agentId, B, "failed", AA, X.setAppState)
}

// READABLE:
} catch (error) {
  if (error instanceof AbortError) {
    // Clean abort - mark as killed
    killBackgroundTask(taskId, setAppState);
    createTaskNotification(taskId, description, "killed", undefined, setAppState);
    return;
  }

  // Other errors - mark as failed with message
  const errorMessage = error instanceof Error ? error.message : String(error);
  markTaskFailed(taskId, errorMessage, setAppState);
  createTaskNotification(taskId, description, "failed", errorMessage, setAppState);
}

// Mapping: aG→AbortError, $4A→killBackgroundTask, C4A→createTaskNotification, jI0→markTaskFailed
```

### Task States After Errors

| Error Type | Task State | Notification |
|------------|------------|--------------|
| AbortError | `killed` | "killed" |
| Other Error | `failed` | "failed" + error message |
| Success | `completed` | "completed" |

---

## Error Handling Best Practices

### For Main Agent

1. **Check for valid agent types** before spawning
2. **Don't rely on resume** working - have fallback
3. **Use appropriate timeout** for background agents
4. **Handle errors gracefully** in tool results
5. **Provide user feedback** on subagent failures
6. **Consider max_turns** to prevent runaway agents

### For Custom Agent Definitions

1. **Robust getSystemPrompt** - handle errors gracefully
2. **Use forkContext wisely** - too much context can confuse
3. **Document when to use** in `whenToUse` field
4. **Test agent thoroughly** before deployment

---

## Error Response Format

Errors are returned in the tool result:

```javascript
// Error in tool result:
{
  type: "tool_result",
  tool_use_id: "toolu_xyz",
  is_error: true,  // Indicates error
  content: [{
    type: "text",
    text: "Agent type 'invalid' not found. Available agents: ..."
  }]
}
```

**Main agent processing:**
```
Main agent receives tool_result with is_error: true
            │
            ▼
Parse error message from content
            │
            ▼
Decide on recovery strategy:
- Inform user of issue
- Try alternative approach
- Ask user for guidance
```

---

## Summary

| Aspect | Implementation |
|--------|---------------|
| Agent Not Found | Throws error with available agents list |
| Permission Denied | Throws error with deny rule source (NEW) |
| Transcript Not Found | Throws error, allows retry without resume |
| Abort | AbortError (aG class) when signal aborted |
| System Prompt Error | Logged, continues with fallback |
| Execution Timeout | None (agents run until complete) |
| TaskOutput Timeout | 0-600000ms (default 30000ms) |
| Retry | None (main agent decides manually) |
| Background Errors | Mark as killed/failed, create notification |

**Key Takeaways:**
- No automatic retry - main agent controls recovery
- No execution timeout - agents run to completion
- AbortController enables clean cancellation
- TaskOutput timeout only affects blocking wait
- Main agent responsible for graceful error handling
- Permission denied errors are new in v2.1.7

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `aG` (AbortError) - Abort error class
- `kD1` (isAborted) - Check if signal is aborted
- `bD1` (loadTranscript) - Load transcript for resume
- `cz0` (findDenyRule) - Find permission deny rule
- `$4A` (killBackgroundTask) - Kill background task
- `jI0` (markTaskFailed) - Mark task as failed
- `C4A` (createTaskNotification) - Create task notification

---

## See Also

- [architecture.md](./architecture.md) - Agent system architecture
- [execution.md](./execution.md) - Execution flow and patterns
- [communication.md](./communication.md) - Communication patterns
- [integration.md](./integration.md) - System integration
