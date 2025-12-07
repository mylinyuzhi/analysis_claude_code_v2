# Subagent Error Handling

## Overview

This document covers error handling, timeout mechanisms, and abort patterns for the Claude Code subagent system.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key elements in this document:
- Error types and messages
- AbortController pattern
- AgentOutputTool timeout (wait_up_to)
- NO explicit retry mechanism (confirmed)

---

## Error Types

### 1. Agent Not Found Error

Thrown when an invalid `subagent_type` is specified.

```javascript
// ============================================
// Agent Not Found Error
// Location: chunks.145.mjs:1835
// ============================================

// ORIGINAL:
if (!K) throw Error(`Agent type '${Q}' not found. Available agents: ${F.map((T)=>T.agentType).join(", ")}`)

// READABLE:
if (!agentDefinition) {
  throw new Error(
    `Agent type '${subagent_type}' not found. Available agents: ${activeAgents.map(a => a.agentType).join(", ")}`
  );
}
```

**Example Error:**
```
Agent type 'invalid-agent' not found. Available agents: general-purpose, Explore, Plan, statusline-setup, claude-code-guide
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

### 2. Transcript Not Found Error

Thrown when `resume` parameter references a non-existent agent ID.

```javascript
// ============================================
// Transcript Not Found Error
// Location: chunks.145.mjs:1850
// ============================================

// ORIGINAL:
if (Z) {
  let T = await KY1(Z);
  if (!T) throw Error(`No transcript found for agent ID: ${Z}`);
  E = T
}

// READABLE:
if (resume) {
  const transcript = await loadTranscript(resume);
  if (!transcript) {
    throw new Error(`No transcript found for agent ID: ${resume}`);
  }
  resumeMessages = transcript;
}
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

### 3. Abort Error (WW Class)

Thrown when the agent execution is aborted via AbortController.

```javascript
// ============================================
// Abort Error Check
// Location: chunks.145.mjs:1188
// ============================================

// ORIGINAL:
if (await p, u.signal.aborted) throw new WW;
if ($O(A) && A.callback) A.callback()

// READABLE:
// After execution loop completes, check if aborted
await pendingTranscriptWrite;
if (abortController.signal.aborted) {
  throw new AbortError();  // WW class
}
if (isBuiltInAgent(agentDefinition) && agentDefinition.callback) {
  agentDefinition.callback();
}
```

**When This Occurs:**
- User cancels operation (Ctrl+C)
- Parent aborts due to timeout
- System shutdown

**Characteristics:**
- Clean exit - no partial results
- AbortController signal propagated
- Transcript may be incomplete

---

### 4. System Prompt Generation Error

Caught and logged when agent system prompt fails to generate.

```javascript
// ============================================
// System Prompt Error
// Location: chunks.145.mjs:1861-1863
// ============================================

// ORIGINAL:
try {
  let T = Array.from(D.toolPermissionContext.additionalWorkingDirectories.keys()),
    y = K.getSystemPrompt({ toolUseContext: Y });
  q = await GSA([y], C, T)
} catch (T) {
  g(`Failed to get system prompt for agent ${K.agentType}: ${T instanceof Error?T.message:String(T)}`)
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

```javascript
// ============================================
// AbortController Creation
// Location: chunks.145.mjs:916, 1104
// ============================================

// In createSubAgentContext (BSA):
let B = Q?.abortController ?? (Q?.shareAbortController ? A.abortController : JU0(A.abortController))

// In executeAgent (XY1):
let u = J?.abortController ? J.abortController : Z ? new AbortController : B.abortController;

// READABLE:
// Context creation - isolated by default
const abortController = options?.abortController ??
  (options?.shareAbortController
    ? parentContext.abortController
    : createIsolatedAbortController(parentContext.abortController));

// Execution - new controller for async agents
const executionAbortController = override?.abortController
  ? override.abortController
  : isAsync
    ? new AbortController()  // Fresh controller for background agents
    : toolUseContext.abortController;
```

### AbortController Hierarchy

```
Main Agent AbortController
           │
           │ (createIsolatedAbortController)
           ▼
┌─────────────────────────────┐
│ Subagent AbortController    │
│   - Isolated from parent    │
│   - Won't abort when parent │
│     aborts (by default)     │
└─────────────────────────────┘
           │
           │ (for async agents: new AbortController())
           ▼
┌─────────────────────────────┐
│ Async Execution Controller  │
│   - Completely independent  │
│   - Allows background run   │
└─────────────────────────────┘
```

### Abort Propagation

| Scenario | Parent Aborts | Subagent Behavior |
|----------|--------------|-------------------|
| Sync (default) | ✅ | Continues with isolated controller |
| Async/Background | ✅ | Continues independently |
| shareAbortController: true | ✅ | Aborts with parent |

---

## Timeout Handling

### AgentOutputTool Timeout

The `wait_up_to` parameter controls how long to wait for a background agent:

```javascript
// ============================================
// AgentOutputTool Timeout
// Location: chunks.145.mjs:1686
// ============================================

wait_up_to: j.number().min(0).max(300).default(150)
  .describe("Maximum time to wait in seconds")
```

**Timeout Behavior:**

| wait_up_to | block | Behavior |
|------------|-------|----------|
| 0 | true | Immediate check, no waiting |
| 150 (default) | true | Wait up to 2.5 minutes |
| 300 (max) | true | Wait up to 5 minutes |
| Any | false | Immediate status check |

**Timeout Flow:**
```
AgentOutputTool called with block=true, wait_up_to=120
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ Wait for agent completion, checking periodically                │
└─────────────────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼ Completes before 120s   ▼ 120 seconds pass
┌─────────────────────┐   ┌─────────────────────┐
│ Return completed    │   │ Return current      │
│ results             │   │ status (may be      │
│                     │   │ in_progress)        │
└─────────────────────┘   └─────────────────────┘
```

### No Explicit Agent Execution Timeout

**Important Finding**: There is NO explicit timeout on agent execution itself.

- Agents run until completion or abort
- No automatic timeout kills an agent
- Background agents persist until done
- Main agent controls wait via AgentOutputTool

**Implications:**
- Long-running agents can consume resources
- Background agents should be designed to complete
- Main agent should use `wait_up_to` wisely

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

## Error Handling Best Practices

### For Main Agent

1. **Check for valid agent types** before spawning
2. **Don't rely on resume** working - have fallback
3. **Use appropriate wait_up_to** for background agents
4. **Handle errors gracefully** in tool results
5. **Provide user feedback** on subagent failures

### For Custom Agent Definitions

1. **Robust getSystemPrompt** - handle errors gracefully
2. **Use forkContext wisely** - too much context can confuse
3. **Document when to use** in `whenToUse` field
4. **Test agent thoroughly** before deployment

---

## Error Response Format

Errors are returned in the tool result as text content:

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
| Transcript Not Found | Throws error, allows retry without resume |
| Abort | AbortError (WW class) when signal aborted |
| System Prompt Error | Logged, continues with fallback |
| Execution Timeout | None (agents run until complete) |
| AgentOutputTool Timeout | wait_up_to 0-300 seconds |
| Retry | None (main agent decides manually) |
| AbortController | Isolated by default, independent for async |

**Key Takeaways:**
- No automatic retry - main agent controls recovery
- No execution timeout - agents run to completion
- AbortController isolation prevents cascading aborts
- AgentOutputTool timeout only affects blocking wait
- Main agent responsible for graceful error handling
