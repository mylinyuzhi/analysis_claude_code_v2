# Steering Integration Analysis

## Module Overview

This document analyzes how the steering mechanism integrates with other Claude Code modules, examining cross-module dependencies, data flow patterns, and UI-linkage points.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop integration

---

## 1. UI Integration - Keybinding System (Module 32)

### 1.1 How Steering Keybindings are Registered

The cancel/interrupt actions are not hardcoded event listeners — they flow through the full keybinding resolution system.

**Default bindings** (chunks.54.mjs:1127-1155):
```
Context: Global  →  ctrl+c: "app:interrupt"    (hardcoded, cannot be rebound)
Context: Chat    →  escape: "chat:cancel"        (user-rebindable)
                    enter:  "chat:submit"         (drives PE6 via Z$)
```

**Registration flow**:
```
cancelHandlerComponent (ngA)
    │
    ├── DA("chat:cancel",   handleCancelPress, { context: "Chat",   isActive: showCancelText })
    │       ↓
    │   KeybindingHandler reads DEFAULT_KEYBINDINGS → escape → "chat:cancel"
    │   When user presses Escape in Chat context → handleCancelPress() fires
    │
    └── DA("app:interrupt", handleCancelPress, { context: "Global", isActive: isGloballyActive })
            ↓
        ctrl+c (hardcoded) → "app:interrupt"
        When user presses Ctrl+C anywhere → handleCancelPress() fires
```

**Why `app:interrupt` is hardcoded**: Ctrl+C has a POSIX standard meaning (interrupt process). Allowing it to be rebound could prevent users from exiting the process, creating a "trap" scenario. The system explicitly marks it in `getReservedShortcuts()` with reason: `"Cannot be rebound - used for interrupt/exit (hardcoded)"`.

### 1.2 Cancel Button Visibility State Machine

The cancel button (or "Esc to cancel" indicator) appears based on:

```
cancelHandlerComponent (ngA) evaluates:
┌──────────────────────────────────────────────────────────────┐
│  isActive = NOT (transcript | historySearch | msgSelector |  │
│             localJSX | helpOpen | vimInsert | viewingAgent)  │
│             AND (isStreaming | hasQueue | hasRunningAgents)   │
├──────────────────────────────────────────────────────────────┤
│  showCancelText = isActive                                    │
│    AND NOT (inputMode is non-prompt with no input value)     │
└──────────────────────────────────────────────────────────────┘
```

**What each condition prevents**:
- `screen !== "transcript"`: Don't show cancel in read-only transcript view
- `!isSearchingHistory`: Escape is used for history dismiss, not cancel
- `!isMessageSelectorVisible`: Escape is used to close selector
- `!isLocalJSXCommand`: Escape may be captured by local JSX component
- `!isHelpOpen`: Help overlay uses Escape to close
- `!isVimInsertMode()`: Escape in Vim INSERT = switch to NORMAL mode, not cancel

### 1.3 Spinner Component Integration (GR4)

The spinner/loading indicator component `GR4` renders differently based on `streamMode` (O7):

```javascript
V7.createElement(GR4, {
    mode: O7,           // streamMode: "requesting"|"thinking"|"responding"|"tool-input"|"tool-use"
    spinnerTip: N1,     // spinnerTip from appState
    responseLengthRef: Qj,
    overrideMessage: gj,
    spinnerSuffix: Hx,
    verbose: S,
    loadingStartTimeRef: $Y,
    totalPausedMsRef: OY,
    pauseStartTimeRef: fY,
    todos: xy,
    overrideColor: eK,
    overrideShimmerColor: HD,
    hasActiveTools: ow.size > 0
})
```

The spinner is shown when:
```javascript
PG = (!vK || vK.showSpinner === true)
  && F7.length === 0           // no tool permission dialogs
  && (_4 || Wz || L9 || xp7() > 0)  // loading OR userInput OR running tasks OR legacy queue
  && !q1                       // no worker request pending
  && !MG                       // not all tools are MCP-only
```

**streamMode → spinner message mapping**:
| streamMode | Spinner displays |
|------------|-----------------|
| `"requesting"` | "Waiting for Claude..." or initial state |
| `"thinking"` | Extended thinking indicator with thinking text |
| `"responding"` | "Claude is responding..." with token counter |
| `"tool-input"` | Tool name being generated |
| `"tool-use"` | "Running [tool name]..." |

---

## 2. Integration with Agent Loop (Module 03)

### 2.1 Query Generator Interrupt Points

The abort signal is checked at strategic points during the query lifecycle:

```
┌──────────────────────────────────────────────────────────────┐
│              AGENT LOOP WITH STEERING CHECKPOINTS             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐                                        │
│  │ START QUERY     │ ← New AbortController created          │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 1: Before LLM Call   │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) return      │      Early exit before  │
│  └────────┬────────────────────────┘      even hitting API  │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Stream LLM Response              │ ◄─── AbortSignal in   │
│  │ (signal passed to fetch API)     │      fetch() call     │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 2: After LLM Stream  │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) cleanup()   │      Drain tools,      │
│  └────────┬────────────────────────┘      add interrupt msg │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ Execute Tool Calls               │                        │
│  └────────┬────────────────────────┘                        │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────┐                        │
│  │ CHECKPOINT 3: After Tool Batch  │ ◄─── signal.aborted?   │
│  │ if (signal.aborted) drain tools │      May catch abort   │
│  └────────┬────────────────────────┘      during tool exec  │
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

### 2.2 `ff` (onQuery) - Concurrent Query Guard

When `onQuery` (ff) is called while a query is already running (`I6.current === true`), it also uses the queue:

```javascript
// chunks.188.mjs:590-598
if (I6.current) {
    // A concurrent query was detected - queue incoming messages instead
    telemetry("tengu_concurrent_onquery_detected", {});
    k6.filter((sq) => sq.type === "user")
      .map((sq) => extractTextContent(sq.message.content))
      .filter((sq) => sq !== null)
      .forEach((sq, idx) => {
          if (enqueueCommand({ value: sq, mode: "prompt" }, setAppState), idx === 0)
              telemetry("tengu_concurrent_onquery_enqueued", {});
      });
    setIsLoading(false);
    return;
}
```

This is a **safety net** — if somehow `onQuery` fires while `isQueryRunning` is true (race condition or external trigger), it queues rather than drops the message. Note that `setIsLoading(false)` is called because the concurrent query is not actually executing.

### 2.3 Message Injection After Steering

When steering aborts the LLM, the conversation history gets modified:

```
BEFORE steering abort:
Message history:
  [user]      "Implement login feature"
  [assistant] "I'll implement login using JWT authentication...
               First, let me create..." [INCOMPLETE]

AFTER steering abort:
Message history:
  [user]      "Implement login feature"
  [assistant] "I'll implement login using JWT authentication...
               First, let me create..." [INCOMPLETE]
  [system]    "Interrupted by user"         ← XhA injects this

AFTER steering query submission:
  [user]      "Use OAuth instead"           ← queued message submitted
  [assistant] "I understand. Let me implement OAuth 2.0..." ← new response
```

**Why the interruption message matters**: Claude's next response sees:
1. Original user request
2. Partial assistant response
3. Explicit "Interrupted by user" marker
4. New steering message

This context allows Claude to understand that its previous approach was incomplete AND deliberately stopped, not just truncated.

---

## 3. Integration with Tool Execution (Module 05)

### 3.1 Tool Drainage on Abort

When steering interrupts during tool execution:

```
Tools before abort:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Tool A: Write│  │ Tool B: Bash │  │ Tool C: Read │
│  (Complete)  │  │  (Running)   │  │  (Queued)    │
└──────────────┘  └──────────────┘  └──────────────┘

After abort signal fires:
│ Tool A: Write│  → Output already yielded to conversation
│ Tool B: Bash │  → getRemainingResults() waits for completion
│ Tool C: Read │  → Never starts (query generator returns)
```

The `getRemainingResults()` call ensures Tool B completes its current atomic operation:

| Tool Type | Without Drainage | With Drainage |
|-----------|------------------|---------------|
| `Write` file | File partially written, corrupted | File write completes atomically |
| `Bash` git commit | Commit aborted mid-op, dirty state | Commit finishes, clean state |
| `Read` large file | Partial read, incomplete context | Read completes, full data returned |
| `Grep` search | Stops mid-results | All matching results returned |

**Trade-off**: Drainage adds 50-500ms to abort latency (waiting for tool atomicity), but prevents data corruption.

### 3.2 Tool Permission Interaction

```javascript
// onCancel branch for tool-permission mode:
if (currentInputMode === "tool-permission") {
    toolUseConfirmQueue[0]?.onAbort();  // Call the tool's onAbort callback
    setToolUseConfirmQueue([]);          // Clear the permission queue
    return;                             // DON'T abort the LLM stream
}
```

**Subtle behavior**: When `onCancel` runs in `"tool-permission"` mode:
- The tool permission dialog is dismissed (tool denied)
- `return` exits without calling `abortController?.abort()`
- The LLM stream is NOT aborted by this path

This means if the user presses Escape to cancel a tool permission:
1. The tool permission is denied
2. Claude's next response will address the denied tool
3. If the user wanted to fully stop Claude, they need to press Escape again

This is intentional — the first Escape cancels the "inner" dialog, second Escape cancels the "outer" stream. The `cancelHandlerComponent` logic handles this because after clearing the tool permission, `abortSignal` is still active, so the next Escape press takes Branch 1 (abort the stream).

---

## 4. Integration with Input System (Module 02 - REPL)

### 4.1 `executeQueuedInput` (iA) - Queue-to-Submission Bridge

```javascript
// chunks.188.mjs:894-926
iA = useCallback(async (text, pastedContents) => {
    await processUserInput({
        input: text,
        helpers: { setCursorOffset: () => {}, clearBuffer: () => {}, resetHistory: () => {} },
        isLoading: _4,      // IMPORTANT: current isLoading state
        mode: "prompt",
        commands: RA,
        onInputChange: () => {},
        setPastedContents: () => {},
        setIsLoading: C3,
        setToolJSX: TA,
        getToolUseContext: J0,
        messages: W4,
        mainLoopModel: Y1,
        pastedContents: pastedContents,
        ideSelection: K6,
        setUserInputOnProcessing: ZY,
        setAbortController: HY,
        onQuery: ff,
        resetLoadingState: YK,
        thinkingEnabled: p,
        setAppState: A1,
        querySource: EQ1(),
        onBeforeQuery: M,
        canUseTool: Zf,
        addNotification: q6
    })
}, [_4, RA, ...]);
```

**Design note**: `executeQueuedInput` (iA) calls `processUserInput` (PE6) with the CURRENT `isLoading` value. When HVq calls it, `isLoading` has just become `false` (that's the trigger). But there's a subtle race: HVq sets `isLoading=true` *before* calling `iA`:

```javascript
O.current = !0, $(!0),  // isExecuting=true, setIsLoading(true) ← sets _4=true
zVq({ executeInput: w })  // w=iA → called with _4 might still be false from closure!
```

The `isLoading: _4` passed to `iA` captures the state at closure creation time. Since `iA` is a `useCallback` with `_4` in deps, it re-creates when `_4` changes. The actual `_4` value passed to `PE6` inside `iA` when it executes will be the most recent value from the closure — which at execution time may be `true` (set by HVq's `$(!0)` just before calling `iA`).

This means `PE6` inside `iA` might see `isLoading=true` when called from HVq, causing it to RE-QUEUE the command instead of submitting it! The guard `O.current` (isExecuting ref) prevents infinite loops: once HVq sets `isExecuting=true`, subsequent effect invocations bail out immediately.

**The race is safe because**: `PE6` with `isLoading=true` calls `lB` which adds to `queuedCommands`. Then `HVq` sees `queuedCommandsLength > 0` again, but `O.current` is still `true` (from the first call), so the second effect invocation returns early. The `finally` block resets `O.current=false` only after `iA` completes.

### 4.2 `popCommandFromQueue` (rc) - Manual Queue Editing

```javascript
// chunks.188.mjs:343-355 (reconstructed)
rc = useCallback(async () => {
    const result = await popAndMergeQueuedCommands(
        currentInputValue,           // K8: merge with whatever user typed
        cursorOffset,                // 0: cursor position
        async () => new Promise(resolve => setAppState(s => { resolve(s); return s; })),
        setAppState
    );
    if (!result) return;
    setInputValue(result.text);        // $8: put merged text in input box
    setInputMode("prompt");            // Rq: switch to prompt mode
    if (result.images.length > 0) {
        setPastedContents(prev => {
            const next = { ...prev };
            for (const img of result.images) next[img.id] = img;
            return next;
        });
    }
}, [setAppState, setInputValue, setInputMode, currentInputValue, setPastedContents]);
```

This is called by `cancelHandlerComponent` Branch 3 (when Escape is pressed with queue but no active stream). It pops all editable items from the queue and merges them into the input box, allowing the user to review and edit before submitting.

**User experience**:
```
State: Stream done, queuedCommands = ["Use OAuth", "Also add tests"]
User presses Escape
→ rc() called
→ input box shows: "Use OAuth\nAlso add tests"
→ cursor positioned after merged text
→ User can edit and press Enter to submit
```

---

## 5. Integration with State Management (Module 15)

### 5.1 `resetLoadingState` (YK) - What Gets Reset

```javascript
// chunks.188.mjs:218-221
YK = useCallback(() => {
    C3(!1),        // setIsLoading(false)
    ZY(void 0),    // setUserInputOnProcessing(undefined)
    Qj.current = 0, // responseLengthRef = 0
    xq([]),        // setStreamingToolUses([])
    S3(null),      // setSpinnerOverrideMessage(null)
    OO(null),      // setSpinnerOverrideColor(null)
    xH(null),      // setSpinnerOverrideShimmerColor(null)
    l7(),          // reset some internal state
    PB1()          // reset some other state
}, [C3, l7])
```

Called at:
1. `onCancel()` → always on cancel
2. `handleQuery()` → end of successful query
3. `ff (onQuery)` → finally block (ensures cleanup even on error)
4. `W6 (handleSessionResume)` → when resuming a session

**Key insight**: `resetLoadingState` is idempotent and comprehensive. It doesn't just clear `isLoading` — it resets ALL streaming-related UI state in one call, preventing orphaned spinners or stale tool indicators.

### 5.2 `lastQueryCompletionTime` (wD) - Completion Timestamp

```javascript
// chunks.188.mjs: (within ff's finally block)
LP(Date.now())  // setLastQueryCompletionTime(Date.now())
```

`wD` (lastQueryCompletionTime) is used as a dependency in HVq's Effect 2:
```javascript
useEffect(() => {
    ...
}, [isLoading, queuedCommandsLength, lastQueryCompletionTime, ...])
```

**Why needed**: If a query completes (`isLoading: true → false`) but `queuedCommandsLength` doesn't change between renders (e.g., stays at 0), React's shallow comparison would prevent the effect from re-firing. By including `lastQueryCompletionTime` (which always changes on completion), the effect reliably re-fires on every query completion.

---

## 6. Integration with Remote Sessions (Module 33)

### 6.1 Dual Session Manager Architecture

```javascript
// chunks.188.mjs:192
$O = pJ.isRemoteMode ? pJ : hH
```

The `$O` (remoteSessionManager) reference points to either:
- `pJ` (Tfq result): Remote session manager (Web/SSH mode)
- `hH` (ffq result): Local session handler (CLI mode)

Both implement the same interface: `{ isRemoteMode, cancelRequest, sendMessage, ... }`.

When `onCancel` checks `$O.isRemoteMode`:
- `true` → calls `$O.cancelRequest()` → sends WebSocket `{subtype: "interrupt"}`
- `false` → calls `O3?.abort()` → triggers AbortController

**Interface symmetry**: The remote path sends a control message that causes the remote agent to call its own `abortController.abort()`, creating symmetric behavior on both sides of the connection.

### 6.2 Remote Mode Enter-Key Handling

Remote mode has a special guard in `Z$` (onSubmit):

```javascript
// chunks.188.mjs:726
if ($O.isRemoteMode && !k6.trim()) return;  // Skip empty messages in remote mode
```

And the remote submission path bypasses `PE6` entirely:

```javascript
if ($O.isRemoteMode) {
    // Build message content (text + images)
    const message = buildMessageContent(input, pastedContents);
    // Add to local message history immediately
    addToMessages([createUserMessage({ content: message })]);
    // Send directly via WebSocket data channel
    await remoteSessionManager.sendMessage(messageContent);
    return;  // ← bypasses PE6 completely
}
// Local mode: use PE6
await processUserInput({ input, isLoading, ... })
```

**Implication**: Remote mode does NOT use the `queuedCommands` system. There is no message queue for remote sessions — each Enter press either sends immediately (not loading) or is silently dropped if the input is empty. The steering for remote sessions relies entirely on the WebSocket interrupt signal path.

---

## 7. Integration with Compact (Module 07)

### 7.1 Abort During Auto-Compaction

If auto-compaction is triggered mid-query and abort happens:

```
Query running:
  T0: LLM streaming response
  T1: Token count hits threshold → auto-compact triggered
  T2: User presses Escape → abort() called
```

**Resolution**: The abort signal is checked after each LLM response. The compact operation (which runs as part of the query generator) will check the signal before starting. Since `autoCompactDispatcher` (fs4) is called inside the query generator, and the abort check happens before each LLM API call:

```javascript
// In query generator (pseudocode):
if (toolUseContext.abortController.signal.aborted) { return; }  // Checkpoint
// Auto-compact happens here
if (shouldAutoCompact(messages)) await autoCompactDispatcher(...);
// Another checkpoint
if (toolUseContext.abortController.signal.aborted) { return; }
```

**User intent wins**: If the user aborts during auto-compaction, the compaction is abandoned (doesn't complete). The conversation history is NOT compacted, and the steering message is submitted with the original (uncompacted) history.

### 7.2 Interrupt Messages Preserved During Compaction

The "Interrupted by user" system message is tagged with `type: "system"`. During compaction, system messages are preserved (same as tool output messages) to maintain conversation causality.

---

## 8. Integration with Background Agents (Module 26)

### 8.1 `cancelRunningAgentTasks` (Kd7) - Dead Code in v2.1.38

```javascript
// chunks.89.mjs:1388-1393
function Kd7(A, q) {  // Kd7(tasks, setAppState)
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running")
            na(K, q)  // na = killLocalAgent(taskId, setAppState)
}
```

**Callable only when** `KY()` (isPromptQueueingEnabled) returns true, which **never happens** in v2.1.38.

**Intended behavior**: When prompt queueing was planned to be fully enabled, cancelling via Escape would also kill all running local_agent background tasks. This would provide a "hard reset" capability — interrupt everything, clean slate, start fresh with the steering message.

**Current state**: `Kd7` is compiled into the bundle but unreachable from normal operation. Background agents continue running even after steering in v2.1.38.

---

## 9. Integration with Hooks (Module 11)

### 9.1 Hook Abort Signal Propagation

Hooks that receive the abort signal respect it:

```javascript
// In hook execution (pseudocode from combineAbortSignals usage):
const combinedSignal = combineAbortSignals(hookTimeoutSignal, toolUseContext.abortController.signal);
await runHook(hook, { signal: combinedSignal });
```

`combineAbortSignals` (fR, chunks.90.mjs:1691) creates an AbortController that aborts when EITHER the hook timeout OR the steering abort fires. This means:
- If user steers while a hook is executing, the hook's subprocess receives SIGTERM
- The hook is killed, and the abort chain propagates up

### 9.2 `executeSessionStartHooks` and Steering

Session-start hooks run before the first query. Steering cannot interrupt session-start hooks because `abortController` is not yet created at that point. The `O3` state variable is `null` until `cMz` or `Z$` creates it.

---

## 10. Cross-Module Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEERING CROSS-MODULE FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  USER PRESSES ENTER (while loading)                                     │
│  ┌────────────────┐                                                     │
│  │  Z$ (onSubmit) │─→ PE6(isLoading=true) ─→ lB() ─→ queuedCommands   │
│  └────────────────┘                                                     │
│                                                                         │
│  USER PRESSES ESCAPE                                                    │
│  ┌────────────────┐                                                     │
│  │ ngA (Cancel    │─→ handleCancelPress()                               │
│  │  Handler)      │      ├─ if streaming: onCancel() ─→ abort()         │
│  └────────────────┘      │      ├─ AbortController signals fetch()       │
│                           │      └─ LLM stream terminates               │
│                           └─ if queue: popAndMerge() → input box        │
│                                                                         │
│  LLM STREAM TERMINATES                                                  │
│  ┌────────────────┐                                                     │
│  │ Query Generator│─→ signal.aborted?                                   │
│  │ (chunks.149)   │      ├─ YES: drain tools + "Interrupted by user"    │
│  └────────────────┘      └─ NO:  normal completion                      │
│         │                                                               │
│         ▼                                                               │
│  isLoading = false                                                      │
│         │                                                               │
│         ▼                                                               │
│  ┌────────────────┐                                                     │
│  │ HVq hook fires │─→ queuedCommandsLength > 0?                         │
│  │ (Effect 2)     │      ├─ YES: zVq() → dequeue → iA → PE6 → ff      │
│  └────────────────┘      └─ NO:  idle, wait for next user input         │
│                                                                         │
│  NEW QUERY STARTS                                                       │
│  ┌────────────────┐                                                     │
│  │ ff (onQuery)   │─→ Creates new AbortController                       │
│  │                │─→ Calls LLM API with full context:                  │
│  └────────────────┘      [original_user_msg, partial_assistant,         │
│                            "Interrupted by user", steering_message]     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Integration Testing Scenarios

### 11.1 Scenario: Steering During Multi-Tool Execution

**Setup**: Claude uses Glob to find 50 Python files, starts Reading each one (streaming batch)

**At tool 10, user presses Enter then Escape**:

| Event | System Response |
|-------|-----------------|
| Enter pressed | `lB({value: "Only check src/"})` → queued |
| Escape pressed | `abort()` → signal fires |
| Tool 10 Read in-flight | `getRemainingResults()` drains it → complete |
| Tools 11-50 | Never execute (abort prevents loop continuation) |
| Interrupt message | "Interrupted by user" added to conversation |
| `isLoading=false` | HVq Effect 2 fires |
| Queue dequeue | "Only check src/" executed as new query |
| Claude responds | Adjusts to analyze only src/ folder |

### 11.2 Scenario: Rapid Enter Presses During Streaming

**Setup**: Claude is streaming, user presses Enter 3 times with 3 different messages

| Event | State after |
|-------|-------------|
| Enter 1: "Focus on auth" | `queuedCommands: ["Focus on auth"]` |
| Enter 2: "Use JWT" | `queuedCommands: ["Focus on auth", "Use JWT"]` |
| Enter 3: "Add tests too" | `queuedCommands: ["Focus on auth", "Use JWT", "Add tests too"]` |
| Escape pressed | `abort()` → stream ends |
| HVq fires | Dequeues "Focus on auth" (first item only) |
| New query runs | Claude gets "Focus on auth" steering |
| HVq fires again | Dequeues "Use JWT" |
| Another query runs | Claude gets "Use JWT" steering |
| HVq fires again | Dequeues "Add tests too" |

**Insight**: Multiple Enter presses create a message queue that executes sequentially. Claude processes each steering message in order, building up context step by step.

### 11.3 Scenario: Escape While No Stream (Pop Queue to Input)

**Setup**: Claude finished responding, queuedCommands has 2 items, user presses Escape

| Condition | handleCancelPress branch |
|-----------|-------------------------|
| `abortSignal` = undefined | Branch 1 fails |
| `KY()` = false | Branch 2 fails |
| `queuedCommands.length > 0` = true | **Branch 3 fires** |
| `popCommandFromQueue()` | `V_6()` merges all editable items into input |

Result: Input box shows "item1\nitem2", cursor positioned at end. User can edit and press Enter.

---

## 12. Summary

Steering integration touches **8 major modules**:

| Module | Integration Point | Mechanism |
|--------|------------------|-----------|
| Keybindings (32) | Cancel keybinding registration | `ngA` registers `chat:cancel` and `app:interrupt` |
| Agent Loop (03) | Abort checkpoints in query generator | `signal.aborted` checked at 3+ points |
| Tool Execution (05) | Graceful tool drainage | `getRemainingResults()` before exit |
| REPL/Input (02) | Queue processing after load | `HVq` hook + `executeQueuedInput` |
| State Management (15) | isLoading + queuedCommands state | React state drives all transitions |
| Remote Sessions (33) | WebSocket control channel | `{subtype: "interrupt"}` message |
| Compact (07) | Abort during compaction | Abort takes priority, compaction abandoned |
| Hooks (11) | Signal forwarded to hook subprocess | `combineAbortSignals` terminates hook |

**The architectural principle**: Steering is implemented as a *unidirectional interrupt* that flows upstream (User → UI → Signal → Network), while steering messages flow downstream through the normal submission path. The `HVq` hook is the "reunification point" — it waits for the upstream interrupt to complete, then triggers the downstream steering message submission.

**Key v2.1.38 behavioral notes**:
1. `KY()` always returns `false` — prompt queueing cleanup code in `onCancel` is dead code
2. Background agents continue running during steering (Kd7 never called)
3. Remote mode has NO queue system — each Enter either sends or is dropped
4. The help tip ID has a typo: `"enter-to-steer-in-relatime"` (missing 'l' in realtime)
