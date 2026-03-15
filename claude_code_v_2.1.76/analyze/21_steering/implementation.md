# Steering Implementation - Deep Analysis

## Module Overview

The **steering mechanism** in Claude Code v2.1.38 enables users to provide real-time course corrections to the AI agent while it is actively working on a task. This prevents the agent from pursuing incorrect approaches for extended periods and allows for dynamic, interactive guidance during complex multi-turn operations.

**Key Capability**: Users can type a new message while Claude is streaming and press Enter to queue it; pressing Escape or Ctrl+C aborts the current LLM call. The queued message is then auto-submitted via the `HVq` hook once loading completes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop and LLM API

Key functions in this document:
- `onCancel` (N11) - Main steering trigger function
- `cancelHandlerComponent` (ngA) - React component that registers keybindings for cancel/interrupt
- `createAbortController` (Aq) - Creates abort signal for cancellation
- `processUserInput` (PE6) - Input handler that detects steering intent and enqueues message
- `enqueueCommand` (lB) - Adds steering message to React state queue (`queuedCommands`)
- `useQueuedCommandProcessor` (HVq) - Hook that auto-submits queued commands after load completes
- `processNextQueuedCommand` (zVq) - Dequeues and executes next command from React state queue
- `isPromptQueueingEnabled` (KY) - **Always returns false** in this version
- `cancelRunningAgentTasks` (Kd7) - Kills running local_agent tasks on cancel
- `clearLegacyQueue` (GjA) - Clears the legacy in-memory `xj1` array queue
- `processStreamEvent` (iW1) - Dispatches LLM stream events and drives `streamMode` state machine
- `cancelSession` (RemoteSessionManager method) - Remote steering via WebSocket

---

## 1. Core Architecture

### 1.1 Steering Modes

Claude Code supports two distinct steering implementations based on execution context:

```
┌────────────────────────────────────────────────────────────┐
│                    STEERING ARCHITECTURE                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐              ┌──────────────────┐  │
│  │  LOCAL MODE      │              │  REMOTE MODE     │  │
│  │  (CLI/Terminal)  │              │  (Web/SSH)       │  │
│  └────────┬─────────┘              └────────┬─────────┘  │
│           │                                  │            │
│           │ Uses:                           │ Uses:      │
│           │ - AbortController API           │ - WebSocket│
│           │ - Escape / Ctrl+C keybinding    │ - Control  │
│           │ - Enter key queues message      │ - Messages │
│           │ - HVq hook processes queue      │            │
│           │                                  │            │
│           ▼                                  ▼            │
│  ┌─────────────────┐              ┌──────────────────┐  │
│  │ abort() signal  │              │ {subtype:        │  │
│  │ → LLM API call  │              │  "interrupt"}    │  │
│  └─────────────────┘              └──────────────────┘  │
│                                                            │
│  Both modes converge on:                                  │
│  - Queue user's steering message                          │
│  - Gracefully stop LLM streaming                          │
│  - Resume query with new context                          │
└────────────────────────────────────────────────────────────┘
```

**Design Rationale**:
- **Local mode** leverages browser/Node.js native `AbortController` for zero-latency interruption
- **Remote mode** requires network round-trip but maintains same UX through WebSocket control channel

---

## 2. UI Layer: Cancel Handler Component

### 2.1 `cancelHandlerComponent` (ngA) - The Keybinding Hub

// ============================================
// cancelHandlerComponent - Registers cancel/interrupt keybinding handlers
// Location: chunks.185.mjs:2137-2172
// ============================================

// ORIGINAL (for source lookup):
function ngA(A) {
    let {
        setToolUseConfirmQueue: q,
        onCancel: K,
        isMessageSelectorVisible: Y,
        screen: z,
        abortSignal: w,
        popCommandFromQueue: H,
        vimMode: $,
        isLocalJSXCommand: O,
        isSearchingHistory: _,
        isHelpOpen: J,
        inputMode: X,
        inputValue: D
    } = A, j = B_(), M = L7(), P = v6((U) => U.queuedCommands.length), W = void 0, G = v6((U) => U.viewSelectionMode), f = v6((U) => Object.values(U.tasks).some((x) => x.type === "local_agent" && x.status === "running")), Z = xfq.useCallback(() => {
        if (w !== void 0 && !w.aborted) { c("tengu_cancel", {}), q(() => []), K(); return }
        if (KY() && f) { c("tengu_cancel", {}), q(() => []), K(); return }
        if (j.getState().queuedCommands.length > 0) { if (H) { H(); return } }
        c("tengu_cancel", {}), q(() => []), K()
    }, [j, M, w, H, q, K, f]), N = Jk7(), T = w !== void 0 && !w.aborted, k = P > 0, y = X !== void 0 && X !== "prompt" && !D, B = !1, m = ...(T || k || B || f), b = m && !y && !D, g = B || m;
    return DA("chat:cancel", Z, { context: "Chat", isActive: b }),
           DA("app:interrupt", Z, { context: "Global", isActive: g }), null
}

// READABLE (for understanding):
function cancelHandlerComponent({
    setToolUseConfirmQueue,
    onCancel,
    isMessageSelectorVisible,
    screen,
    abortSignal,          // ← O3?.signal: undefined or AbortSignal
    popCommandFromQueue,
    vimMode,
    isLocalJSXCommand,
    isSearchingHistory,
    isHelpOpen,
    inputMode,
    inputValue
}) {
    const appStore = getAppStore();
    const setAppState = useSetAppState();
    const queuedCommandsCount = useStore((s) => s.queuedCommands.length);
    const viewSelectionMode = useStore((s) => s.viewSelectionMode);
    const hasRunningLocalAgents = useStore((s) =>
        Object.values(s.tasks).some(t => t.type === "local_agent" && t.status === "running")
    );

    // ─── The cancel/interrupt handler ────────────────────────────────────
    const handleCancelPress = useCallback(() => {
        // BRANCH 1: Streaming is active (LLM responding)
        if (abortSignal !== undefined && !abortSignal.aborted) {
            telemetry("tengu_cancel", {});
            setToolUseConfirmQueue(() => []);
            onCancel();   // → N11() → O3?.abort()
            return;
        }

        // BRANCH 2: Prompt queueing enabled + background agents running
        // NOTE: isPromptQueueingEnabled() ALWAYS returns false in v2.1.38!
        if (isPromptQueueingEnabled() && hasRunningLocalAgents) {
            telemetry("tengu_cancel", {});
            setToolUseConfirmQueue(() => []);
            onCancel();
            return;
        }

        // BRANCH 3: Queue has items (pop next for editing)
        if (appStore.getState().queuedCommands.length > 0) {
            if (popCommandFromQueue) {
                popCommandFromQueue();  // → rc() → places next cmd in input box
                return;
            }
        }

        // BRANCH 4: Default cancel
        telemetry("tengu_cancel", {});
        setToolUseConfirmQueue(() => []);
        onCancel();
    }, [appStore, setAppState, abortSignal, popCommandFromQueue, setToolUseConfirmQueue, onCancel, hasRunningLocalAgents]);

    // ─── Cancel button visibility conditions ─────────────────────────────
    const isStreaming  = abortSignal !== undefined && !abortSignal.aborted;
    const hasQueue     = queuedCommandsCount > 0;
    const isActive = (screen !== "transcript")
                  && !isSearchingHistory && !isMessageSelectorVisible
                  && !isLocalJSXCommand && !isHelpOpen && !isVimInsertMode()
                  && (isStreaming || hasQueue || hasRunningLocalAgents);

    const showCancelText = isActive && !(inputMode !== undefined && inputMode !== "prompt" && !inputValue);
    const isGloballyActive = isActive;

    // Register keybinding handlers (renders no DOM nodes)
    registerKeybinding("chat:cancel",    handleCancelPress, { context: "Chat",   isActive: showCancelText });
    registerKeybinding("app:interrupt",  handleCancelPress, { context: "Global", isActive: isGloballyActive });

    return null;  // Pure behavioral component, no rendering
}

// Mapping:
// ngA → cancelHandlerComponent
// Z → handleCancelPress
// w → abortSignal (= O3?.signal)
// K → onCancel (= N11)
// P → queuedCommandsCount
// f → hasRunningLocalAgents
// T → isStreaming
// k → hasQueue
// m → isActive
// b → showCancelText
// g → isGloballyActive
// KY → isPromptQueueingEnabled
// H → popCommandFromQueue (= rc)
// DA → registerKeybinding

**What it does**: A pure behavioral React component (renders nothing) that registers two keyboard action handlers for the cancel/interrupt UX. It determines when those actions are "active" (enabling the cancel indicator in the UI).

**How it works**:

1. **State observation**: Monitors `abortSignal` (streaming?), `queuedCommandsCount` (queue?), and `hasRunningLocalAgents` (background work?) to determine if cancellation is meaningful
2. **handleCancelPress dispatch logic**:
   - **Priority 1 (streaming)**: If the LLM is actively streaming (`abortSignal` not aborted), immediately call `onCancel()` to abort the stream
   - **Priority 2 (background agents)**: If prompt queuing is enabled AND agents are running, call `onCancel()` — note KY() always returns false, so this branch never fires
   - **Priority 3 (pop queue)**: If there are queued commands but nothing is streaming, pop the next command into the input box for editing rather than executing it
   - **Priority 4 (default)**: Cancel any remaining state
3. **Keybinding registration**: Registers `Escape → chat:cancel` and (via the default keybindings) `Ctrl+C → app:interrupt`

**Why separate `chat:cancel` vs `app:interrupt`**:
- `chat:cancel` (`Escape`) requires being in "Chat" context (input box focused)
- `app:interrupt` (`Ctrl+C`) works globally at any time
- Both fire the same `handleCancelPress` callback, but have different `isActive` conditions

**Key insight**: The cancel handler is a *pure behavioral component* — it contributes zero visual elements but wires up all keyboard events. The visual cancel indicator (spinner, status text) is rendered by `GR4` (spinner component) based on `isLoading` state.

**Default keybindings** (chunks.54.mjs:1127):
```
Context: Global  → ctrl+c: "app:interrupt"
Context: Chat    → escape: "chat:cancel"
                   enter:  "chat:submit"
```

---

### 2.2 Stream Mode State Machine

The `streamMode` state variable (`O7`, type `string`) tracks what phase the LLM is in. It is driven by `processStreamEvent` (iW1).

```
┌────────────────────────────────────────────────────────────────┐
│             STREAM MODE STATE MACHINE                          │
│            (O7 / streamMode state, set via tK)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Initial value: "responding"                                   │
│                                                                │
│  API request sent                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────┐   content_block_start (thinking)            │
│  │ "requesting" │──────────────────────────────► "thinking"   │
│  └──────┬───────┘                                             │
│         │                                                      │
│         │ content_block_start (text)                           │
│         ▼                                                      │
│  ┌──────────────┐                                             │
│  │ "responding" │  ← Claude is generating text tokens         │
│  └──────┬───────┘                                             │
│         │                                                      │
│         │ content_block_start (tool_use)                       │
│         ▼                                                      │
│  ┌──────────────┐                                             │
│  │ "tool-input" │  ← Claude generating tool call JSON         │
│  └──────┬───────┘                                             │
│         │                                                      │
│         │ message_stop                                         │
│         ▼                                                      │
│  ┌──────────────┐                                             │
│  │  "tool-use"  │  ← Tool execution phase                     │
│  └──────────────┘                                             │
│                                                                │
│  All transitions driven by iW1(processStreamEvent)            │
└────────────────────────────────────────────────────────────────┘
```

// ============================================
// processStreamEvent - Stream event dispatch with streamMode state machine
// Location: chunks.173.mjs:390-450
// ============================================

// ORIGINAL (for source lookup):
function iW1(A, q, K, Y, z, w, H) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") { w?.(A.message); return }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let $ = A.message.content.find((O) => O.type === "thinking");
            if ($ && $.type === "thinking") H?.(() => ({ thinking: $.thinking, isStreaming: !1, streamingEndedAt: Date.now() }))
        }
        q(A); return
    }
    if (A.type === "stream_request_start") { Y("requesting"); return }
    if (A.event.type === "message_stop") { Y("tool-use"), z(() => []); return }
    switch (A.event.type) {
        case "content_block_start":
            switch (A.event.content_block.type) {
                case "thinking": case "redacted_thinking": Y("thinking"); return;
                case "text": Y("responding"); return;
                case "tool_use": Y("tool-input"); z((_) => [..._, { index: A.event.index, contentBlock: A.event.content_block, unparsedToolInput: "" }]); return;
            }
            break;
        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta": K(A.event.delta.text); return;
                case "input_json_delta": K(A.event.delta.partial_json), z(...); return;
            }
    }
}

// READABLE (for understanding):
function processStreamEvent(event, addMessage, addDelta, setStreamMode, setStreamingToolUses, removeTombstone, setThinkingState) {
    // Non-streaming events: pass through to message list
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") { removeTombstone?.(event.message); return; }
        if (event.type === "tool_use_summary") return;
        if (event.type === "assistant") {
            const thinkingBlock = event.message.content.find(b => b.type === "thinking");
            if (thinkingBlock) setThinkingState?.(() => ({ thinking: thinkingBlock.thinking, isStreaming: false, streamingEndedAt: Date.now() }));
        }
        addMessage(event); return;
    }

    // API request initiated → enter "requesting" mode
    if (event.type === "stream_request_start") { setStreamMode("requesting"); return; }

    // LLM finished all content blocks → enter tool execution phase
    if (event.event.type === "message_stop") { setStreamMode("tool-use"); setStreamingToolUses(() => []); return; }

    switch (event.event.type) {
        case "content_block_start":
            switch (event.event.content_block.type) {
                case "thinking": case "redacted_thinking": setStreamMode("thinking"); return;
                case "text":     setStreamMode("responding"); return;
                case "tool_use": setStreamMode("tool-input");
                    setStreamingToolUses(prev => [...prev, {
                        index: event.event.index,
                        contentBlock: event.event.content_block,
                        unparsedToolInput: ""
                    }]); return;
            }
            break;
        case "content_block_delta":
            switch (event.event.delta.type) {
                case "text_delta":       addDelta(event.event.delta.text); return;
                case "input_json_delta": addDelta(event.event.delta.partial_json);
                    setStreamingToolUses(prev => /* update tool input */ prev); return;
            }
    }
}

// Mapping: iW1→processStreamEvent, A→event, q→addMessage, K→addDelta,
// Y→setStreamMode (tK), z→setStreamingToolUses, w→removeTombstone, H→setThinkingState

**streamMode values and meanings**:
| Value | Description | UI Effect |
|-------|-------------|-----------|
| `"requesting"` | API request in-flight, waiting for first byte | Spinner shown |
| `"thinking"` | Extended thinking `<thinking>` tokens streaming | Thinking indicator |
| `"responding"` | Text tokens streaming to user | Streaming text visible |
| `"tool-input"` | Tool call JSON being generated | Tool badge streaming |
| `"tool-use"` | message_stop received, tools executing | Tool execution indicators |

**Key insight**: The `streamMode` drives the spinner component (`GR4`) to show contextually appropriate messages ("Claude is thinking…", "Claude is responding…", "Running tools…"). The cancel button's `isActive` condition checks `abortSignal` (not `streamMode`) for correctness — even during tool-use phase the signal is still valid.

---

## 3. Local Steering Implementation

### 3.1 AbortController Lifecycle

// ============================================
// createAbortController - AbortController factory with timeout support
// Location: chunks.6.mjs:449-451
// ============================================

// ORIGINAL (for source lookup):
function Aq(A = n4K) {
    let q = new AbortController;
    return i4K(A, q.signal), q
}

// READABLE (for understanding):
function createAbortController(timeoutMs = DEFAULT_TIMEOUT) {
    let controller = new AbortController();
    // Setup automatic timeout-based abort if timeout value provided
    setupAbortTimeout(timeoutMs, controller.signal);
    return controller;
}

// Mapping: Aq→createAbortController, n4K→DEFAULT_TIMEOUT, i4K→setupAbortTimeout

**Lifecycle**:
1. **Creation**: `createAbortController()` called in two places:
   - `cMz` (processUserInput): `const controller = createAbortController(); setAbortController(controller);`
   - `Z$` (onSubmit): Called with `Aq()` for speculative/preloaded queries
2. **Storage**: Stored in React state as `O3` (abortController); passed as `abortSignal: O3?.signal` to `cancelHandlerComponent`
3. **Abort**: Called via `O3?.abort()` in `onCancel()` (N11)
4. **Cleanup**: After query completes, `HY(null)` (setAbortController(null)) clears the controller

**Key insight**: The AbortController is created BEFORE the API call begins (`cMz` creates it first, then passes it to `ff` (onQuery)), ensuring the signal is available from the moment `cancelHandlerComponent` receives it.

---

### 3.2 `onCancel` (N11) - The Steering Trigger

// ============================================
// onCancel - Central cancellation dispatch
// Location: chunks.188.mjs:328-340
// ============================================

// ORIGINAL (for source lookup):
function N11() {
    if (XO === "elicitation") return;
    if (h(`[onCancel] focusedInputDialog=${XO} streamMode=${O7}`), I6.current = !1, YK(), XO === "tool-permission") F7[0]?.onAbort(), f8([]);
    else if ($O.isRemoteMode) $O.cancelRequest();
    else O3?.abort();
    if (KY()) Kd7(D1, A1), GjA(), A1((k6) => {
        if (k6.queuedCommands.length === 0) return k6;
        return { ...k6, queuedCommands: [] }
    })
}

// READABLE (for understanding):
function onCancel() {
    // GUARD: Never interrupt elicitation dialogs (cost warnings, user confirmations)
    if (currentInputMode === "elicitation") return;

    debug(`[onCancel] focusedInputDialog=${currentInputMode} streamMode=${streamMode}`);

    // 1. Clear the "query is running" flag
    isQueryRunning.current = false;

    // 2. Reset loading state (spinner, progress bars)
    resetLoadingState();  // → YK()

    // 3. Mode-specific cancellation
    if (currentInputMode === "tool-permission") {
        // Abort pending tool permission (user is in approval dialog)
        toolUseConfirmQueue[0]?.onAbort();
        setToolUseConfirmQueue([]);
    } else if (remoteSessionManager.isRemoteMode) {
        // Send WebSocket interrupt control message
        remoteSessionManager.cancelRequest();
    } else {
        // Abort the LLM fetch() call via signal
        abortController?.abort();   // ← The core steering action
    }

    // 4. Prompt queue cleanup (DEAD CODE: KY() always returns false)
    if (isPromptQueueingEnabled()) {
        cancelRunningAgentTasks(tasks, setAppState);  // Kd7: kill local_agent tasks
        clearLegacyQueue();                           // GjA: clear xj1[]
        setAppState((state) => ({
            ...state,
            queuedCommands: []
        }));
    }
}

// Mapping:
// N11→onCancel, XO→currentInputMode, O7→streamMode, I6.current→isQueryRunning
// YK→resetLoadingState, F7→toolUseConfirmQueue, f8→setToolUseConfirmQueue
// $O→remoteSessionManager, O3→abortController, KY→isPromptQueueingEnabled
// Kd7→cancelRunningAgentTasks, GjA→clearLegacyQueue, D1→tasks, A1→setAppState

**Critical finding**: `KY()` (isPromptQueueingEnabled) **always returns `false`** in v2.1.38 (chunks.89.mjs:879). This means:
- `cancelRunningAgentTasks` (Kd7) is **never called from onCancel**
- `clearLegacyQueue` (GjA) is **never called from onCancel**
- `queuedCommands: []` clear is **never executed from onCancel**

Therefore, steering messages placed in `queuedCommands` via `lB` are **preserved** across cancellation — they will be processed by `HVq` after the abort completes.

**What it does**: Central dispatch for all cancellation scenarios. Guards against elicitation dialog interruption, then routes to mode-appropriate abort mechanism.

**How it works**:
1. **Guard**: Skip if in `"elicitation"` mode (cost threshold warnings cannot be bypassed)
2. **State reset**: `isQueryRunning = false` prevents concurrent query detection triggering on the subsequent resume
3. **Loading reset**: `resetLoadingState()` clears spinner, streaming tool uses, and progress indicators
4. **Mode branch**: Tool permission → abort approval dialog; Remote → WebSocket; Local → AbortController

**Design rationale**:
- **Centralized**: One function handles all three cancellation scenarios
- **Elicitation exception**: Cost warnings are gating decisions — bypassing them could let expensive queries proceed without user knowledge
- **Dead code insight**: The `KY()` guard block was likely added for a planned "enhanced prompt queuing" feature but is disabled

---

### 3.3 `processUserInput` (PE6) - Enter Key Steering Path

// ============================================
// processUserInput - Main input handler; queues message if loading
// Location: chunks.185.mjs:3067-3165
// ============================================

// ORIGINAL (key section for source lookup):
// Inside PE6(A):
if (Y) {  // Y = isLoading
    if (z !== "prompt") return;
    let x, p;
    if (m) x = nMz(b, j), p = Object.values(j).filter((l) => l.type === "image").map((l) => l.id);
    else x = b.trim();
    lB({ value: x, mode: "prompt", imagePasteIds: p }, N);
    H(""), y(0), $({}), S(), B();
    return
}
l1q(), await cMz({ input: b, ... })

// READABLE (for understanding):
async function processUserInput({ input, isLoading, mode, ... }) {
    // Skip empty input
    if (input.trim() === "" && !hasImages) return;

    // Handle exit commands
    if (["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(input.trim())) { /* exit */ }

    // Handle slash commands
    if (input.trim().startsWith("/")) { /* slash command handling */ }

    // ─── STEERING BRANCH ────────────────────────────────────────────────
    if (isLoading) {
        // Only steer in "prompt" mode (not "task", "diff", etc.)
        if (mode !== "prompt") return;

        let steeringContent;
        if (hasImages) {
            // Build multipart content with text + images
            steeringContent = buildMultipartContent(processedInput, pastedContents);
        } else {
            steeringContent = processedInput.trim();
        }

        // QUEUE the message — does NOT abort the current stream!
        enqueueCommand({ value: steeringContent, mode: "prompt", imagePasteIds: imageIds }, setAppState);

        // Clear the input box, cursor, images, history, buffer
        setInputValue("");
        setCursorOffset(0);
        clearPastedContents({});
        resetHistory();
        clearBuffer();

        return;  // ← NO onCancel() called here!
    }
    // ─── Normal submission path ──────────────────────────────────────────
    clearStashHint();
    await submitQuery({ input: processedInput, ... });
}

// Mapping: PE6→processUserInput, Y→isLoading, z→mode, m→hasImages
// b→processedInput, j→pastedContents, N→setAppState
// lB→enqueueCommand, H→setInputValue, y→setCursorOffset, $→clearPastedContents
// S→resetHistory, B→clearBuffer, l1q→clearStashHint, cMz→submitQuery

**Critical insight - Enter does NOT abort**:
When the user presses Enter while Claude is loading, `processUserInput`:
1. Detects `isLoading === true`
2. Queues the message via `enqueueCommand` (lB)
3. Clears the input box
4. Returns **without calling `onCancel()`**

The abort (Escape/Ctrl+C) is a **completely separate user action**. The system supports two usage patterns:

**Pattern A - Queue then wait**:
```
User presses Enter → message queued → Claude finishes naturally → HVq auto-submits queued message
```

**Pattern B - Queue then interrupt** (true steering):
```
User presses Enter → message queued → User presses Escape → Claude aborted → HVq auto-submits queued message
```

**Why no auto-abort on Enter**: This is intentional. Sometimes users want to "pre-load" the next question while Claude works, without interrupting the current response. Forcing an abort on Enter would be disruptive.

---

## 4. Queue System - Deep Dive

### 4.1 Dual Queue Architecture

Claude Code uses **two separate queue systems** that serve different purposes:

```
┌─────────────────────────────────────────────────────────┐
│                  DUAL QUEUE SYSTEM                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Queue 1: React State Queue (queuedCommands[])         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Storage: React appState.queuedCommands (array)   │  │
│  │ Write:   lB(A, setAppState) → adds to array      │  │
│  │ Read:    Z_6(getState, setState) → dequeues      │  │
│  │ Process: zVq → HVq useEffect on isLoading=false  │  │
│  │ Clear:   setAppState({queuedCommands: []})        │  │
│  │ Used for: User steering messages (PE6 path)       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Queue 2: Legacy Array Queue (xj1[])                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Storage: in-memory array xj1 (module-level)      │  │
│  │ Write:   WR(A) → xj1.push(A) + notify            │  │
│  │ Read:    up7() → xj1.shift()                     │  │
│  │ Process: HVq first useEffect via useSyncExtStore  │  │
│  │ Clear:   GjA() → xj1.length = 0                  │  │
│  │ Used for: task-notification mode messages         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Both queues processed by HVq hook, which runs         │
│  after isLoading transitions to false.                  │
└─────────────────────────────────────────────────────────┘
```

### 4.2 `enqueueCommand` (lB) - Queue Dispatch

// ============================================
// enqueueCommand - Routes to React state or legacy queue
// Location: chunks.89.mjs:415-422
// ============================================

// ORIGINAL (for source lookup):
function lB(A, q) {
    if (A.mode === "task-notification" && W_6.size > 0) WR(A);
    else q((K) => ({
        ...K,
        queuedCommands: [...K.queuedCommands, A]
    })), AB1("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueCommand(command, setAppState) {
    if (command.mode === "task-notification" && legacyQueueSubscribers.size > 0) {
        // task-notification mode goes to the legacy synchronous queue
        enqueueToLegacyQueue(command);
    } else {
        // All other modes (including "prompt" for steering) go to React state queue
        setAppState((state) => ({
            ...state,
            queuedCommands: [...state.queuedCommands, command]
        }));
        // Telemetry: track enqueue event
        logQueueEvent("enqueue", typeof command.value === "string" ? command.value : undefined);
    }
}

// Mapping: lB→enqueueCommand, A→command, q→setAppState, W_6→legacyQueueSubscribers
// WR→enqueueToLegacyQueue, AB1→logQueueEvent

**Routing logic**: Steering messages have `mode: "prompt"`, so they ALWAYS go to the React state queue (second branch). The legacy queue (`WR`) is only used for `task-notification` mode messages when there are active subscribers.

### 4.3 `useQueuedCommandProcessor` (HVq) - Auto-Execution After Load

// ============================================
// useQueuedCommandProcessor - Processes queued commands after isLoading=false
// Location: chunks.186.mjs:87-135
// ============================================

// ORIGINAL (for source lookup):
function HVq({ isLoading: A, queuedCommandsLength: q, lastQueryCompletionTime: K, getAppState: Y, setAppState: z, executeQueuedInput: w, hasActiveLocalJsxUI: H, setIsLoading: $ }) {
    let O = vY1.useRef(!1), _ = vY1.useSyncExternalStore(Sp7, hp7);
    vY1.useEffect(() => {
        if (A) return;
        if (!Ip7()) return;
        if (H) return;
        if (O.current) return;
        let J = up7();
        if (!J) return;
        O.current = !0, $(!0);
        let X, D = {};
        if (typeof J.value === "string") X = J.value;
        else { let j = agA(J.value, 1); X = j.text, D = j.pastedContents }
        w(X, D).catch(() => {}).finally(() => { O.current = !1, bp7() })
    }, [_, A, H, w, $]),
    vY1.useEffect(() => {
        if (A) return;
        if (q === 0) return;
        if (H) return;
        if (O.current) return;
        O.current = !0, $(!0), zVq({ getAppState: Y, setAppState: z, executeInput: w })
            .then((J) => { if (!J.processed) $(!1) })
            .finally(() => { O.current = !1 })
    }, [A, q, K, Y, z, w, H, $])
}

// READABLE (for understanding):
function useQueuedCommandProcessor({
    isLoading, queuedCommandsLength, lastQueryCompletionTime,
    getAppState, setAppState, executeQueuedInput,
    hasActiveLocalJsxUI, setIsLoading
}) {
    const isExecuting = useRef(false);
    // useSyncExternalStore: subscribe to xj1 legacy queue changes
    const legacyQueueRevision = useSyncExternalStore(subscribeToQueueChanges, getQueueRevision);

    // ─── Effect 1: Process legacy xj1 array queue ──────────────────────
    useEffect(() => {
        if (isLoading) return;                   // Wait until loading completes
        if (!isLegacyQueueNonEmpty()) return;    // Check xj1[] has items
        if (hasActiveLocalJsxUI) return;          // Don't interrupt local UI
        if (isExecuting.current) return;          // Prevent concurrent execution

        const nextCommand = dequeueFromLegacyArray();  // up7() → xj1.shift()
        if (!nextCommand) return;

        isExecuting.current = true;
        setIsLoading(true);  // Show spinner immediately

        let text, pastedContents = {};
        if (typeof nextCommand.value === "string") {
            text = nextCommand.value;
        } else {
            // Multipart content with images
            const parsed = parseMultipartContent(nextCommand.value, 1);
            text = parsed.text; pastedContents = parsed.pastedContents;
        }

        executeQueuedInput(text, pastedContents)
            .catch(() => {})
            .finally(() => {
                isExecuting.current = false;
                notifyLegacyQueueProgress();  // bp7()
            });
    }, [legacyQueueRevision, isLoading, hasActiveLocalJsxUI, executeQueuedInput, setIsLoading]);

    // ─── Effect 2: Process React state queuedCommands[] ────────────────
    useEffect(() => {
        if (isLoading) return;                  // Must not be loading
        if (queuedCommandsLength === 0) return; // Must have queued commands
        if (hasActiveLocalJsxUI) return;        // Don't interrupt local UI
        if (isExecuting.current) return;        // Prevent concurrent execution

        isExecuting.current = true;
        setIsLoading(true);   // Optimistic: show spinner before execute

        processNextQueuedCommand({             // zVq()
            getAppState,
            setAppState,
            executeInput: executeQueuedInput
        }).then(({ processed }) => {
            if (!processed) setIsLoading(false);  // Nothing to process, reset
        }).finally(() => {
            isExecuting.current = false;
        });
    }, [isLoading, queuedCommandsLength, lastQueryCompletionTime, ...]);
}

// Mapping: HVq→useQueuedCommandProcessor, A→isLoading, q→queuedCommandsLength
// K→lastQueryCompletionTime, w→executeQueuedInput, O→isExecuting
// _→legacyQueueRevision, Sp7→subscribeToQueueChanges, hp7→getQueueRevision
// Ip7→isLegacyQueueNonEmpty, up7→dequeueFromLegacyArray, bp7→notifyLegacyQueueProgress
// zVq→processNextQueuedCommand

**What it does**: The "pump" that drives automatic queue processing. It reacts to two triggers: (1) `isLoading` transitions to `false`, and (2) queue length changes.

**How it works**:

**Effect 1 (legacy queue)**:
- Triggered by: `useSyncExternalStore` revision change (set by `G_6()` whenever `xj1` changes)
- Prerequisite: `isLoading === false` AND `xj1.length > 0`
- Action: Shift one item from `xj1`, call `executeQueuedInput` (→ `iA` → `PE6` → `cMz`)

**Effect 2 (React state queue)**:
- Triggered by: `isLoading` or `queuedCommandsLength` changes
- Prerequisite: `isLoading === false` AND `queuedCommandsLength > 0`
- Action: Call `zVq` which dequeues from `queuedCommands` state and executes

**Critical timing**: `lastQueryCompletionTime` (wD) is included in Effect 2's dependency array. This ensures the effect re-fires even if a query completes with `queuedCommandsLength` still equal to its previous value (e.g., queue had 1 item, query runs, query completes with 0 items in queue, another item is added — the completion time change triggers re-evaluation).

**Key insight**: Both effects use `isExecuting.current` ref (not state) to prevent re-entrant execution. If the effect fires while another dequeue is running, it immediately returns, preventing double-submission.

---

### 4.4 `popAndMergeQueuedCommands` (V_6) - Manual Queue Pop to Input

// ============================================
// popAndMergeQueuedCommands - Pop all editable commands, merge into input
// Location: chunks.89.mjs:473-500
// ============================================

// ORIGINAL (for source lookup):
async function V_6(A, q, K, Y) {
    let z = await K();
    if (z.queuedCommands.length === 0) return;
    let { editable: w = [], nonEditable: H = [] } = yp7(z.queuedCommands, (D) => f_6(D.mode) ? "editable" : "nonEditable");
    if (w.length === 0) return;
    let $ = w.map((D) => vv9(D.value)),
        O = [...$, A].filter(Boolean).join("\n"),
        _ = $.join("\n").length + 1 + q,
        J = [], X = Date.now();
    for (let D of w) { let j = Ev9(D.value, X); J.push(...j), X += j.length }
    for (let D of w) AB1("popAll", typeof D.value === "string" ? D.value : void 0);
    return Y((D) => ({ ...D, queuedCommands: H })), { text: O, cursorOffset: _, images: J }
}

// READABLE (for understanding):
async function popAndMergeQueuedCommands(currentInputValue, cursorOffset, getAppState, setAppState) {
    const state = await getAppState();
    if (state.queuedCommands.length === 0) return undefined;

    // Separate editable (mode="prompt") vs. non-editable (mode="task-notification") items
    const { editable = [], nonEditable = [] } = partition(state.queuedCommands,
        cmd => isEditableMode(cmd.mode) ? "editable" : "nonEditable"
    );
    if (editable.length === 0) return undefined;

    // Extract text from each editable command
    const textValues = editable.map(cmd => extractTextContent(cmd.value));

    // Merge all queued texts + current input into one multiline string
    const mergedText = [...textValues, currentInputValue].filter(Boolean).join("\n");

    // Calculate cursor offset to put cursor after merged queued text
    const newCursorOffset = textValues.join("\n").length + 1 + cursorOffset;

    // Extract image attachments from all commands
    const images = [];
    let imageIdCounter = Date.now();
    for (const cmd of editable) {
        const cmdImages = extractImagesFromCommand(cmd.value, imageIdCounter);
        images.push(...cmdImages);
        imageIdCounter += cmdImages.length;
    }

    // Log telemetry for each popped command
    for (const cmd of editable) {
        logQueueEvent("popAll", typeof cmd.value === "string" ? cmd.value : undefined);
    }

    // Update state: keep only non-editable commands
    setAppState(state => ({ ...state, queuedCommands: nonEditable }));

    return { text: mergedText, cursorOffset: newCursorOffset, images };
}

// Mapping: V_6→popAndMergeQueuedCommands, A→currentInputValue, q→cursorOffset
// K→getAppState, Y→setAppState, w→editable, H→nonEditable
// $→textValues, O→mergedText, _→newCursorOffset

**What it does**: When the user presses Escape with queued commands present (but nothing streaming), this function pops ALL editable commands from the queue and merges them into the current input box for the user to review/edit before submitting.

**Key design detail**: It preserves `nonEditable` commands (task-notification type) in the queue while popping `editable` ones. This prevents auto-generated task notifications from being accidentally edited by the user.

**cursor offset calculation**: `textValues.join("\n").length + 1 + cursorOffset` — places the cursor after all the merged queued text, so existing input text comes after. The `+1` accounts for the newline separator.

---

## 5. Remote Steering Implementation

### 5.1 WebSocket Interrupt Signal

// ============================================
// Remote Session Interrupt via WebSocket
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
    // Send via CONTROL channel (separate from data channel for low latency)
    this.websocket?.sendControlRequest({ subtype: "interrupt" });
}

**Remote flow**:
```
Browser (user presses Escape)
    → handleCancelPress (Z)
    → onCancel (N11)
    → remoteSessionManager.cancelRequest()   [= cancelSession()]
    → WebSocket control message: {subtype: "interrupt"}
    → Remote agent receives
    → Remote agent triggers local AbortController.abort()
    → Same cleanup path as local mode
```

**Why separate control channel**: The data channel can have backpressure from large tool outputs (file reads, grep results). The control channel has dedicated priority — the interrupt arrives immediately without queueing behind pending data messages.

---

## 6. Signal Propagation to LLM API

// ============================================
// LLM Streaming with Abort Signal Integration
// Location: chunks.149.mjs:1865-1870
// ============================================

// READABLE (for understanding):
for await (let streamChunk of callAnthropicLLMAPI({
    messages: formatMessagesForAPI(assistantMessages, userMessage),
    systemPrompt: systemPrompt,
    maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
    tools: toolUseContext.options.tools,
    signal: toolUseContext.abortController.signal,  // ← CRITICAL
    options: { model: selectedModel, ... }
})) {
    yield streamChunk;  // If signal aborts, iterator throws, loop exits
}

**Abort propagation chain**:
```
User presses Escape
    → handleCancelPress → onCancel → abortController.abort()
    → signal.aborted = true
    → fetch() internal abort (network connection severed)
    → AsyncIterator throws AbortError
    → for-await loop exits
    → query generator falls through to abort detection
```

---

## 7. Abort Detection and Graceful Cleanup

// ============================================
// Query Abort Detection and Cleanup Logic
// Location: chunks.149.mjs:1960-1967
// ============================================

// READABLE (for understanding):
if (toolUseContext.abortController.signal.aborted) {
    // CLEANUP PHASE 1: Drain streaming tool execution results
    if (streamingToolExecutor) {
        // Allow in-progress tools to complete gracefully
        for await (let result of streamingToolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    } else {
        // No streaming tools active, add interruption message
        yield* createUserInterruptMessage(assistantMessages, "Interrupted by user");
    }

    // CLEANUP PHASE 2: Only add cleanup message for non-steering aborts
    if (toolUseContext.abortController.signal.reason !== "interrupt") {
        yield createCleanupMessage({ toolUse: false });
    }

    return;  // Exit query generator
}

**Abort reason discriminator** (`signal.reason`):
- `"interrupt"` → User-initiated steering (Escape/Ctrl+C); skip cleanup message
- Any other / undefined → Timeout or error; add `createCleanupMessage`

**Why preserve partial tool results**: Tools that were executing (file reads, git operations) may have produced meaningful output even if the query is aborted. Draining the remaining results ensures this data appears in conversation history, preventing confusion when Claude resumes with steering context.

---

## 8. End-to-End Steering Timelines

### 8.1 Pattern A: Pre-Queue Then Steer

```
TIME  │ USER ACTION              │ SYSTEM STATE               │ LLM API
──────┼──────────────────────────┼────────────────────────────┼───────────
T0    │ Submit: "Implement login"│ isLoading=true, O3=created │ POST /msgs
T1    │ [Claude streaming JWT]   │ streamMode="responding"    │ Streaming
T2    │ Type "Use OAuth instead" │ input buffer filling       │ Streaming
      │ Press Enter              │ lB() → queuedCommands=     │
      │                          │ ["Use OAuth instead"]       │
      │                          │ input cleared               │
T3    │ Press Escape             │ handleCancelPress()         │ Streaming
      │                          │ onCancel() → abort()        │
T4    │ [~100ms network delay]   │ signal.aborted=true         │ fetch aborted
T5    │ [Query generator exits]  │ "Interrupted by user" added │ Idle
      │                          │ isLoading=false             │
T6    │ [HVq fires Effect 2]     │ queuedCommandsLength=1      │ POST /msgs
      │                          │ zVq() dequeues "Use OAuth"  │ (new query)
      │                          │ executeQueuedInput() called │
T7    │ [Claude responds]        │ streamMode="responding"     │ Streaming
      │                          │ Response uses OAuth context │
```

### 8.2 Pattern B: Escape Only (No Pre-Queue)

```
T0    │ Submit: "Implement login"│ isLoading=true             │ POST /msgs
T1    │ [Claude streaming JWT]   │ streamMode="responding"    │ Streaming
T2    │ Press Escape             │ handleCancelPress()         │ Streaming
      │                          │ onCancel() → abort()        │
T3    │ [Query aborts]           │ isLoading=false            │ Idle
T4    │ Type "Use OAuth instead" │ Normal input typing         │ -
      │ Press Enter              │ processUserInput()          │
      │                          │ isLoading=false → cMz()     │
T5    │ [Claude responds]        │ Normal submission           │ POST /msgs
```

**Total steering latency** (Pattern A): ~100-300ms from Escape to API abort (local mode).
**Pattern B latency**: Zero — user controls the timing entirely.

---

## 9. Help Tip: enter-to-steer-in-relatime

The help tip system advertises the steering feature to users:

```javascript
// chunks.176.mjs:1341-1343
{
    id: "enter-to-steer-in-relatime",  // NOTE: typo "relatime" (not "realtime")
    content: async () => "Send messages to Claude while it works to steer Claude in real-time",
    cooldownSessions: 20,
    isRelevant: async () => true
}
```

**Note**: The `id` field contains a typo: `"enter-to-steer-in-relatime"` (missing the "l" in realtime). The symbol index has the corrected spelling. This is a cosmetic bug in the source code.

There is also a "prompt-queue" tip:
```javascript
{
    id: "prompt-queue",
    content: async () => "Hit Enter to queue up additional messages while Claude is working.",
    cooldownSessions: 5,
    isRelevant: async () => f6().promptQueueUseCount <= 3
}
```

The `promptQueueUseCount` telemetry tracks how many times users have used the queue feature, and the tip stops showing after the user has used it 3+ times.

---

## 10. Edge Cases and Error Handling

### 10.1 Concurrent Abort Scenarios

**Scenario 1: Escape pressed multiple times**
```javascript
// Protection in handleCancelPress:
if (abortSignal !== undefined && !abortSignal.aborted) {
    onCancel();  // First press: abort fires
    return;
}
// Second press: abortSignal.aborted === true → falls through to queue pop
```
The second Escape press no longer sees an active signal, so it tries to pop the queue instead.

**Scenario 2: Enter pressed after Escape (before abort completes)**
```javascript
// PE6 receives isLoading=true (still loading during abort)
if (isLoading) {
    enqueueCommand(input, setAppState);  // queued safely
    return;
}
```
Even during the abort window, Enter queues the message for HVq to pick up.

**Scenario 3: Queue item while HVq is processing**
```javascript
// isExecuting.current ref prevents double-processing
if (isExecuting.current) return;  // Skip this effect invocation
```

### 10.2 Steering During Tool Permission Requests

```javascript
function onCancel() {
    if (currentInputMode === "tool-permission") {
        toolUseConfirmQueue[0]?.onAbort();  // Deny the tool permission
        setToolUseConfirmQueue([]);
        // NOTE: Does NOT call abort() → LLM stream handled separately
        return;
    }
    ...
}
```

**Effect**: The tool permission dialog is dismissed (permission denied) but the LLM stream continues until the abort controller is triggered separately. This can cause a brief inconsistency window where the tool is "cancelled" but Claude's response is still streaming.

---

## 11. Performance Characteristics

### 11.1 Latency Breakdown (Local Mode)

| Phase | Estimated Time | Component |
|-------|----------------|-----------|
| User presses Escape | 0ms | Keyboard event |
| `handleCancelPress()` → `onCancel()` | 1-3ms | React callback dispatch |
| `abortController.abort()` | <1ms | AbortController API |
| Signal propagation to fetch() | 10-50ms | JS event loop |
| Network stream termination | 50-200ms | TCP connection close |
| Query generator cleanup | 1-10ms | Interrupt message, drain tools |
| `isLoading=false` → `HVq` fires | 5-15ms | React re-render cycle |
| Queue dequeue + new API call | 1-5ms | State mutation + fetch init |
| **Total** | **70-285ms** | End-to-end interrupt latency |

The dominant cost (75-90%) is network RTT to terminate the LLM fetch connection.

### 11.2 Memory Impact

- **AbortController**: ~100 bytes each; garbage collected after query; one active at a time
- **queuedCommands**: Typically 0-3 items; each item is a string + metadata; <10KB total
- **xj1 legacy array**: Module-level; cleared after each use; normally empty

---

## 12. Design Trade-offs

### 12.1 Enter = Queue (not Abort) vs. Enter = Abort + Queue

**Current design**: Enter queues, Escape aborts.

**Alternative**: Enter both queues AND auto-aborts.

**Why current design was chosen**:
- Users may want to "pre-type" the next message before Claude finishes
- If Enter auto-aborted, accidental Enter presses would interrupt Claude mid-thought
- Separate Escape gives explicit user intent signal
- The two-step UX matches terminal conventions (Enter=submit, Ctrl+C=interrupt)

### 12.2 React State Queue vs. Synchronous Array Queue

**Two queue systems exist** because the React state queue (added later) requires React's async batching, while the legacy array queue (xj1) provides synchronous, immediate access without React's rendering cycle. The legacy queue is now only used for non-interactive task notifications.

### 12.3 `KY()` Always False - Disabled Feature

The `isPromptQueueingEnabled()` guard in `onCancel()` protects code that:
- Kills running local_agent tasks (`Kd7`)
- Clears the legacy queue (`GjA`)
- Empties `queuedCommands` React state

This was likely an "enhanced steering" mode where cancelling would also terminate background agents and flush ALL queued items. Currently disabled — the simpler behavior (preserve queued commands across cancel) is what ships.

---

## Summary

The steering mechanism has **two user-facing primitives**:
1. **Enter while loading** → Pre-queue next message (non-disruptive)
2. **Escape/Ctrl+C** → Interrupt current query (abort + auto-process queue)

The implementation relies on four key components working together:
1. `cancelHandlerComponent` (ngA): Keyboard event wiring
2. `onCancel` (N11): Abort dispatch and state cleanup
3. `enqueueCommand` (lB): Thread-safe queue insertion via React state
4. `useQueuedCommandProcessor` (HVq): Auto-execution pump after loading

**The key architectural insight**: Interrupt signals flow *upstream* (UI → AbortController → fetch() → LLM API), while steering messages flow *downstream* through the normal query submission path. The `HVq` hook bridges these two flows — it detects when the upstream interrupt has completed (isLoading=false) and activates the downstream submission of the queued steering message.
