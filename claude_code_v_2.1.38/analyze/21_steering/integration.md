# Steering Integration Analysis

## Module Overview

This document analyzes how the steering mechanism integrates with other Claude Code modules, examining cross-module dependencies, data flow patterns, and integration points.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop integration

---

## 1. Integration with Agent Loop (Module 02)

### 1.1 Query Generator Interrupt Points

The steering mechanism is tightly integrated with the agent loop's query generator. Abort signals are checked at strategic points during the query lifecycle.

**Integration Points**:

```
┌──────────────────────────────────────────────────────────────┐
│              AGENT LOOP WITH STEERING CHECKPOINTS             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐                                        │
│  │ START QUERY     │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 1: Before LLM Call   │ ◄─── Signal check     │
│  │ if (signal.aborted) return      │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Stream LLM Response              │ ◄─── AbortSignal      │
│  │ (signal passed to fetch API)     │      in fetch()       │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 2: After LLM Chunk   │ ◄─── Signal check     │
│  │ if (signal.aborted) cleanup()   │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Execute Tool Calls               │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 3: After Tool Batch  │ ◄─── Signal check     │
│  │ if (signal.aborted) drain tools │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ NEXT ITERATION  │ ──┐                                    │
│  └─────────────────┘   │                                    │
│           ▲             │                                    │
│           └─────────────┘                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

// ============================================
// Agent Loop Checkpoint - Abort Detection
// Location: chunks.149.mjs:1960-1967
// ============================================

// ORIGINAL (for source lookup):
if (w.abortController.signal.aborted) {
    if (S) {
        for await (let Z1 of S.getRemainingResults()) if (Z1.message) yield Z1.message
    } else yield* XhA(k, "Interrupted by user");
    if (w.abortController.signal.reason !== "interrupt") yield FG1({
        toolUse: !1
    });
    return
}

// READABLE (for understanding):
// CHECKPOINT: Check if user triggered steering or timeout abort
if (toolUseContext.abortController.signal.aborted) {
    // Phase 1: Gracefully drain any in-flight tool executions
    if (streamingToolExecutor) {
        for await (let result of streamingToolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    } else {
        // No tools running, add interrupt marker to conversation
        yield* createUserInterruptMessage(assistantMessages, "Interrupted by user");
    }

    // Phase 2: Add cleanup message only for non-user aborts (timeouts, errors)
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        yield createCleanupMessage({ toolUse: false });
    }

    // Exit query generator early
    return;
}

**Key Integration Point**: The agent loop must check `signal.aborted` at EVERY major phase boundary:
- Before calling LLM API
- After receiving LLM response
- After executing tools

**Why**: This ensures steering can interrupt at any point, not just during network I/O.

---

### 1.2 Message Injection After Steering

When steering occurs, the conversation history is modified to include the interrupt context:

// ============================================
// createUserInterruptMessage - Add steering context to conversation
// Location: chunks.149.mjs (XhA function, inferred from exploration)
// ============================================

// READABLE (for understanding):
function* createUserInterruptMessage(assistantMessages, interruptText) {
    // Create a system-level message indicating the user interrupted
    const interruptMessage = {
        type: "system",
        content: interruptText,  // "Interrupted by user"
        timestamp: new Date().toISOString(),
        metadata: {
            trigger: "user-abort",
            assistantMessageCount: assistantMessages.length
        }
    };

    yield interruptMessage;
}

**Purpose**:
1. Preserve conversation causality (Claude knows the response was incomplete)
2. Provide debugging trace (users can see when they interrupted)
3. Enable Claude to reference the interruption in subsequent responses

**Example conversation flow**:
```
User: "Implement login feature"
Assistant: "I'll implement login using JWT authentication..." [INTERRUPTED]
System: "Interrupted by user"
User: "Actually, use OAuth 2.0 instead"
Assistant: "I understand. Let me revise the approach to use OAuth 2.0..." [CONTINUES]
```

---

## 2. Integration with Tool Execution (Module 05)

### 2.1 Streaming Tool Drainage

When steering interrupts during tool execution, the system must handle tools gracefully to prevent data corruption.

**Integration Pattern**:

```
┌────────────────────────────────────────────────────────────┐
│           TOOL EXECUTION DRAINAGE ON STEERING              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Tool Execution State:                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Tool A       │  │ Tool B       │  │ Tool C       │   │
│  │ (Completed)  │  │ (Running)    │  │ (Queued)     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  User presses Enter (abort triggered)                     │
│                    │                                       │
│                    ▼                                       │
│  ┌────────────────────────────────────────────┐          │
│  │ streamingToolExecutor.getRemainingResults()│          │
│  └────────────────────┬───────────────────────┘          │
│                       │                                    │
│                       ▼                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Tool A       │  │ Tool B       │  │ Tool C       │   │
│  │ ✓ Yielded    │  │ ⏳ Wait for  │  │ ✗ Cancelled  │   │
│  │              │  │   completion │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  Result: Tool B completes, Tool C never starts            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

// ============================================
// Tool Drainage Logic - Integration Point
// Location: chunks.149.mjs:1960-1963 (S.getRemainingResults())
// ============================================

// READABLE (for understanding):
if (streamingToolExecutor) {
    // CRITICAL: Allow currently executing tools to finish
    // This prevents:
    // - File writes from being truncated
    // - Git operations from leaving repo in dirty state
    // - Database transactions from being incomplete

    for await (let result of streamingToolExecutor.getRemainingResults()) {
        if (result.message) {
            yield result.message;  // Add tool output to conversation
        }
    }
}

**Why Tool Drainage Matters**:

| Tool Type | Without Drainage | With Drainage |
|-----------|------------------|---------------|
| `Write` file | File partially written, corrupted | File write completes atomically |
| `Bash` git commit | Commit aborted mid-operation, dirty state | Commit finishes, clean state |
| `Read` large file | Partial read, incomplete data | Read completes, full data available |
| `Grep` search | Search stops mid-results | All matching results returned |

**Trade-off**: Drainage adds 100-500ms to abort latency (waiting for tools to finish), but prevents data corruption.

---

### 2.2 Tool Permission Interaction

Special case: If user is mid-approval of a dangerous tool, steering should NOT interrupt the permission request.

// ============================================
// Tool Permission Protection in onCancel
// Location: chunks.188.mjs:328-340 (N11 function)
// ============================================

// READABLE (for understanding):
if (currentInputMode === "tool-permission") {
    // User is being asked to approve/deny a tool
    // Pressing Enter should DENY the tool, not steer the conversation
    toolUseConfirmQueue[0]?.onAbort();
    setToolUseConfirmQueue([]);
    // Early return: don't propagate to LLM abort
    return;
}

**Rationale**: Tool permissions are synchronous, blocking decisions. Confusing "Cancel tool" with "Steer conversation" would be dangerous (user might accidentally approve risky tools).

---

## 3. Integration with Prompt Queueing (Module 14)

### 3.1 Steering vs. Queued Messages

When prompt queueing is enabled, users can queue multiple messages while Claude is working. Steering must respect this queue.

**Integration Logic**:

```
┌──────────────────────────────────────────────────────────┐
│        PROMPT QUEUEING + STEERING INTERACTION            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Scenario 1: User queues message, then steers           │
│  ┌─────────────────────────────────────────────┐        │
│  │ T0: Claude is working                       │        │
│  │ T1: User types "Also add logging" → QUEUED │        │
│  │ T2: User types "Wait, use OAuth" → STEERING│        │
│  │                                             │        │
│  │ Result:                                     │        │
│  │ - Abort triggered immediately               │        │
│  │ - Queue cleared (both messages removed)     │        │
│  │ - Only steering message submitted           │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  Scenario 2: No queueing, direct steering               │
│  ┌─────────────────────────────────────────────┐        │
│  │ T0: Claude is working                       │        │
│  │ T1: User types "Use OAuth" → STEERING       │        │
│  │                                             │        │
│  │ Result:                                     │        │
│  │ - Abort triggered                           │        │
│  │ - Steering message submitted                │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

// ============================================
// Queue Clearing on Steering
// Location: chunks.188.mjs:328-340 (N11 function)
// ============================================

// READABLE (for understanding):
if (isPromptQueueingEnabled()) {
    // Clear all queued commands when steering occurs
    // Rationale: Queued messages were based on OLD context
    // After steering, context has changed, so old queue is stale

    clearQueuedCommands(tasks, setAppState);
    resetQueuedCommandsState();
    setAppState((state) => ({
        ...state,
        queuedCommands: []
    }));
}

**Why Clear Queue on Steering**:
- Queued messages were created under assumption Claude's current approach was correct
- After steering, Claude's direction has changed, making old queue irrelevant
- Prevents confusion from executing stale commands

**Alternative Considered**: Keep queue and append steering message
- **Rejected**: Would create contradictory instructions (queue says "do X", steering says "don't do X")

---

## 4. Integration with Compact (Module 07)

### 4.1 Steering During Auto-Compaction

If auto-compaction is triggered mid-query and user steers, the system must handle both events gracefully.

**Conflict Scenario**:
```
T0: User submits query
T1: LLM starts streaming response
T2: Token count exceeds threshold → compact triggered
T3: User presses Enter → steering triggered
```

**Resolution**:
```javascript
// Hypothetical conflict handling (inferred from architecture)
if (abortController.signal.aborted) {
    // Steering takes priority over compaction
    // Abort compaction in progress
    cancelCompaction();

    // Proceed with steering cleanup
    return;
}
```

**Rationale**: User steering is a real-time, intentional action. Auto-compaction is a background optimization. User intent wins.

---

### 4.2 Steering Message Inclusion in Compaction

After steering occurs, the "Interrupted by user" message becomes part of conversation history. When compaction happens later, should this message be preserved?

**Decision**: YES, preserve interrupt messages
- **Reason**: They provide critical context about conversation flow
- **Implementation**: Interrupt messages are tagged as `type: "system"` and are kept during compaction (same as tool outputs)

---

## 5. Integration with Remote Sessions (Module 33)

### 5.1 WebSocket Control Channel

Remote steering uses a separate WebSocket control channel to avoid queueing delays.

**Architecture**:

```
┌────────────────────────────────────────────────────────────┐
│         REMOTE SESSION DUAL-CHANNEL ARCHITECTURE            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌───────────────────┐                                    │
│  │  Web Browser UI   │                                    │
│  └─────────┬─────────┘                                    │
│            │                                               │
│            │                                               │
│      ┌─────┴─────┐                                        │
│      │           │                                         │
│      ▼           ▼                                         │
│  ┌────────┐  ┌────────────┐                              │
│  │ Data   │  │ Control    │                              │
│  │ Channel│  │ Channel    │                              │
│  │ (WS)   │  │ (WS)       │                              │
│  └────┬───┘  └────┬───────┘                              │
│       │           │                                        │
│       │ Messages  │ {subtype: "interrupt"}               │
│       │ Tool      │ {subtype: "permission-request"}      │
│       │ outputs   │                                       │
│       │           │                                        │
│       ▼           ▼                                         │
│  ┌──────────────────────────────┐                        │
│  │  Remote Agent Process        │                        │
│  │  (Running on SSH server)     │                        │
│  └──────────────────────────────┘                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Why Separate Channels**:
- **Data channel**: Can be backlogged with large tool outputs (file reads, long grep results)
- **Control channel**: Always low-latency, ensures interrupt signals arrive immediately

// ============================================
// Remote Steering Control Message
// Location: chunks.176.mjs:3060-3063
// ============================================

// ORIGINAL (for source lookup):
cancelSession() {
    h("[RemoteSessionManager] Sending interrupt signal"), this.websocket?.sendControlRequest({
        subtype: "interrupt"
    })
}

// READABLE (for understanding):
cancelSession() {
    debug("[RemoteSessionManager] Sending interrupt signal");

    // Send via CONTROL channel (not data channel)
    // This ensures interrupt is not delayed by queued data messages
    this.websocket?.sendControlRequest({
        subtype: "interrupt"
    });
}

**Protocol Design**:
```javascript
// Control message schema
interface ControlMessage {
    type: "control";
    subtype: "interrupt" | "permission-response" | "heartbeat";
    timestamp: string;
    payload?: any;
}
```

---

### 5.2 State Synchronization After Steering

After remote steering, the browser UI and remote agent must re-sync their state.

**Sync Steps**:
1. Browser sends interrupt control message
2. Remote agent aborts local LLM call
3. Remote agent sends "abort-acknowledged" control response
4. Browser UI updates state: `isLoading = false`
5. User submits steering message
6. Steering message sent via data channel
7. Remote agent processes as normal query

**Latency**: Remote steering has ~100-300ms additional delay vs. local (network RTT for control message).

---

## 6. Integration with Task System (Module 13)

### 6.1 Steering During Task Execution

If Claude is working on a task and user steers, the task state should reflect the interruption.

**Integration Point**:
```javascript
// Hypothetical task update after steering
if (currentTaskId && abortTriggered) {
    updateTaskState(currentTaskId, {
        status: "in_progress",  // Still in progress, but approach changed
        metadata: {
            lastSteeredAt: Date.now(),
            steeringMessage: userSteeringInput
        }
    });
}
```

**Use Case**: If user is tracking progress via `/tasks`, they can see when they steered the agent during a task.

---

## 7. Integration with Thinking Mode (Module 19)

### 7.1 Aborting Extended Thinking

Extended thinking can consume thousands of tokens. If user steers during thinking phase, the abort must handle this gracefully.

**Scenario**:
```
T0: User asks complex question
T1: Claude enters extended thinking (streaming <thinking> tokens)
T2: User realizes question was unclear, steers with clarification
```

**Integration**:
```javascript
// During thinking phase streaming
for await (let thinkingChunk of streamThinkingTokens()) {
    // Check abort signal between thinking chunks
    if (abortController.signal.aborted) {
        yield {
            type: "thinking",
            content: thinkingChunk,
            truncated: true  // Indicate thinking was cut short
        };
        return;
    }
    yield thinkingChunk;
}
```

**Effect**: Thinking is truncated, and Claude immediately processes the steering message without completing the full thinking phase.

---

## 8. Integration with Hooks (Module 11)

### 8.1 Pre-Compact Hooks and Steering

If user steers during a hook execution (e.g., a pre-compact hook running a linter), the hook should be aborted.

**Integration**:
```javascript
// Hook execution with abort signal
async function executePreCompactHooks(signal) {
    for (let hook of registeredHooks["pre-compact"]) {
        // Pass abort signal to hook execution
        try {
            await runHook(hook, { signal });
        } catch (err) {
            if (signal.aborted) {
                debug("Hook aborted due to steering");
                return;  // Exit hook execution
            }
            throw err;
        }
    }
}
```

**Why**: Hooks can be long-running (e.g., running `prettier` on entire codebase). User steering should interrupt them.

---

## 9. Integration with Fast Mode (Module 34)

### 9.1 Steering in Fast Mode

Fast mode uses quota tracking. If user steers during a fast mode query, does the aborted query count against quota?

**Integration Decision**:
```javascript
// Hypothetical quota handling
if (abortController.signal.aborted && signal.reason === "interrupt") {
    // User-initiated steering: DON'T count against quota
    // Rationale: User didn't get value from the aborted query
    fastModeQuota.refundTokens(tokensUsedBeforeAbort);
} else {
    // Timeout or error: DO count against quota
    fastModeQuota.consumeTokens(tokensUsedBeforeAbort);
}
```

**Trade-off**: Refunding aborted queries prevents penalizing users for steering, but could be gamed (user could abuse steering to "reset" bad queries without quota cost).

---

## 10. Cross-Module Data Flow Diagram

### 10.1 End-to-End Steering Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEERING CROSS-MODULE FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐              │
│  │  REPL    │────1───>│ Agent    │────2───>│ LLM API  │              │
│  │ (UI)     │<───6────│ Loop     │<───5────│ (Fetch)  │              │
│  └────┬─────┘         └────┬─────┘         └────┬─────┘              │
│       │                    │                     │                     │
│       │ 3. onCancel()      │ 4. Yield           │ abort signal       │
│       │    triggers        │    "Interrupted"    │ terminates fetch   │
│       ▼                    ▼                     ▼                     │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐              │
│  │ Prompt   │         │ Tools    │         │ Compact  │              │
│  │ Queue    │         │ (Drain)  │         │ (Pause)  │              │
│  └──────────┘         └──────────┘         └──────────┘              │
│       │                    │                     │                     │
│       │ 7. Clear queue     │ 8. Complete tools  │ 9. Defer compact   │
│       ▼                    ▼                     ▼                     │
│  ┌──────────────────────────────────────────────────────┐            │
│  │  New Query Submission (with steering context)        │            │
│  │  Messages: [original, partial response, interrupt,   │            │
│  │             steering message]                         │            │
│  └──────────────────────────────────────────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Legend:
1. User presses Enter → REPL captures input
2. REPL calls agent loop query generator
3. onCancel() triggered, abort signal set
4. Agent loop yields "Interrupted by user" message
5. Abort signal propagates to LLM API fetch()
6. Agent loop returns to REPL
7. Prompt queue cleared (stale messages removed)
8. Tools complete their current operation
9. Auto-compact deferred until after steering query
```

---

## 11. Integration Testing Scenarios

### 11.1 Test Case: Steering During Multi-Tool Execution

**Setup**:
1. User asks Claude to "Analyze all Python files"
2. Claude uses `Glob` to find 50 Python files
3. Claude starts `Read` tool on each file (streaming batch execution)
4. After 10 files read, user steers: "Only analyze files in src/ folder"

**Expected Behavior**:
- Abort signal triggered
- Currently executing `Read` tools (files 11-15) complete
- Queued `Read` tools (files 16-50) are cancelled
- "Interrupted by user" message added to conversation
- Claude receives steering message and adjusts to only analyze `src/` files

**Verification**:
```javascript
// Check that exactly 15 file reads completed (10 + 5 in-flight)
assert(readToolOutputs.length === 15);

// Check that steering message is in conversation
assert(messages.some(m => m.content === "Interrupted by user"));

// Check that new query only targets src/ folder
assert(newGlobPattern === "src/**/*.py");
```

---

### 11.2 Test Case: Rapid Steering (Double Enter Press)

**Setup**:
1. User submits query
2. Claude starts responding
3. User presses Enter (steering #1)
4. User immediately presses Enter again (steering #2) before first abort completes

**Expected Behavior**:
- First Enter triggers abort
- Second Enter is ignored (because `isQueryRunning.current === false` after first abort)
- Only one "Interrupted by user" message added
- Only one steering message submitted

**Verification**:
```javascript
// Check that only one interrupt message exists
const interruptMessages = messages.filter(m => m.content === "Interrupted by user");
assert(interruptMessages.length === 1);
```

---

## 12. Performance Optimization Opportunities

### 12.1 Predictive Abort

**Concept**: Detect when user is typing while Claude is working, and proactively prepare for steering (pre-create AbortController, pre-queue message).

**Benefit**: Reduces steering latency by 10-20ms (avoiding state updates during critical path).

**Implementation Sketch**:
```javascript
// On input change while isLoading
useEffect(() => {
    if (isLoading && inputValue.length > 0) {
        // User is typing while Claude works → likely steering
        prepareSteering();  // Pre-allocate resources
    }
}, [isLoading, inputValue]);
```

---

### 12.2 Abort Signal Caching

**Concept**: Reuse AbortController instances instead of creating new ones per query.

**Benefit**: Reduces garbage collection pressure (~100 allocations/deallocations per session).

**Trade-off**: More complex lifecycle management (must ensure controller is reset between queries).

---

## Summary

Steering integration touches **9 major modules**:
1. Agent Loop - Interrupt checkpoints in query generator
2. Tool Execution - Graceful drainage of in-flight tools
3. Prompt Queueing - Queue clearing on steering
4. Compact - Deferred compaction during steering
5. Remote Sessions - WebSocket control channel
6. Task System - Task metadata updates
7. Thinking Mode - Truncated thinking on abort
8. Hooks - Hook abortion
9. Fast Mode - Quota refund policy

The key architectural principle: **Steering signals flow UPSTREAM (from UI to LLM), while steering messages flow DOWNSTREAM (through normal query path)**. This separation ensures:
- Low latency (abort signal takes fast path)
- Data integrity (steering message processed with full context)
- Module decoupling (each module handles steering independently)

The integration is **compositional**: steering works by triggering existing module capabilities (abort signals, message injection, queue clearing) rather than requiring steering-specific code in each module.
