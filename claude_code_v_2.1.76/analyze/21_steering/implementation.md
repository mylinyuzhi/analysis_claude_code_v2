# Steering Implementation - Deep Analysis

## Module Overview

The **steering mechanism** in Claude Code v2.1.76 enables users to provide real-time course corrections to the AI agent while it is actively working on a task. This prevents the agent from pursuing incorrect approaches for extended periods and allows for dynamic, interactive guidance during complex multi-turn operations.

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

```javascript
// ============================================
// cancelHandlerComponent - Registers cancel/interrupt keybinding handlers
// Location: chunks.185.mjs:2137-2172
// ============================================

// ORIGINAL (for source lookup):
function ngA(A) {
    let {
        setToolUseConfirmQueue: q, onCancel: K, isMessageSelectorVisible: Y,
        screen: z, abortSignal: w, popCommandFromQueue: H, vimMode: $,
        isLocalJSXCommand: O, isSearchingHistory: _, isHelpOpen: J,
        inputMode: X, inputValue: D
    } = A, j = B_(), M = L7(), P = v6((U) => U.queuedCommands.length),
    W = void 0, G = v6((U) => U.viewSelectionMode),
    f = v6((U) => Object.values(U.tasks).some((x) => x.type === "local_agent" && x.status === "running")),
    Z = xfq.useCallback(() => {
        if (w !== void 0 && !w.aborted) { c("tengu_cancel", {}), q(() => []), K(); return }
        if (KY() && f) { c("tengu_cancel", {}), q(() => []), K(); return }
        if (j.getState().queuedCommands.length > 0) { if (H) { H(); return } }
        c("tengu_cancel", {}), q(() => []), K()
    }, [j, M, w, H, q, K, f]);
    // ... (visibility computation omitted)
    return DA("chat:cancel", Z, { context: "Chat", isActive: b }),
           DA("app:interrupt", Z, { context: "Global", isActive: g }), null
}

// READABLE (for understanding):
function cancelHandlerComponent({
    setToolUseConfirmQueue, onCancel, abortSignal, popCommandFromQueue,
    isPromptQueueingEnabled, vimMode, isLocalJSXCommand, isSearchingHistory,
    isHelpOpen, inputMode, inputValue
}) {
    const appStore = getAppStore();
    const queuedCommandsCount = useStore((s) => s.queuedCommands.length);
    const hasRunningLocalAgents = useStore((s) =>
        Object.values(s.tasks).some(t => t.type === "local_agent" && t.status === "running")
    );

    const handleCancelPress = useCallback(() => {
        // BRANCH 1: Streaming is active (LLM responding)
        if (abortSignal !== undefined && !abortSignal.aborted) {
            telemetry("tengu_cancel", {});
            setToolUseConfirmQueue(() => []);
            onCancel();   // → N11() → O3?.abort()
            return;
        }

        // BRANCH 2: Prompt queueing enabled + background agents running
        // NOTE: isPromptQueueingEnabled() ALWAYS returns false in v2.1.76!
        if (isPromptQueueingEnabled() && hasRunningLocalAgents) {
            telemetry("tengu_cancel", {});
            setToolUseConfirmQueue(() => []);
            onCancel();
            return;
        }

        // BRANCH 3: Queue has items (pop next for editing)
        if (appStore.getState().queuedCommands.length > 0) {
            if (popCommandFromQueue) {
                popCommandFromQueue();  // → rc() → merges into input box
                return;
            }
        }

        // BRANCH 4: Fallback (no stream, no queue, no agents)
        telemetry("tengu_cancel", {});
        setToolUseConfirmQueue(() => []);
        onCancel();
    }, [appStore, abortSignal, popCommandFromQueue, setToolUseConfirmQueue, onCancel, hasRunningLocalAgents]);

    // Register keybindings:
    registerKeybinding("chat:cancel", handleCancelPress, { context: "Chat", isActive: showCancelText });
    registerKeybinding("app:interrupt", handleCancelPress, { context: "Global", isActive: isGloballyActive });
    return null; // Invisible component, keybinding side effects only
}

// Mapping: ngA→cancelHandlerComponent, B_→getAppStore, L7→useSetAppState,
//   v6→useStore, j→appStore, w→abortSignal, H→popCommandFromQueue,
//   q→setToolUseConfirmQueue, K→onCancel, f→hasRunningLocalAgents, KY→isPromptQueueingEnabled
```

**Branch decision matrix**:

| Condition | Branch | Action |
|-----------|--------|--------|
| `abortSignal` defined AND not aborted | 1 | `abort()` → stops LLM stream |
| `KY()` true AND local agents running | 2 | `abort()` + kill agents [DEAD CODE in v2.1.76] |
| `queuedCommands.length > 0` | 3 | Pop queue → merge into input box |
| Default (no stream, empty queue) | 4 | `abort()` (no-op if no stream) |

---

## 3. Input Queue System

### 3.1 `processUserInput` (PE6) - Queuing Decision Point

**What it does:** Routes user input to either immediate submission or the queue based on loading state.

**How it works:**
1. If `isLoading=true`: calls `enqueueCommand(lB)` instead of submitting via `onQuery`
2. If `isLoading=false`: proceeds to normal submission pipeline
3. Queue is a React state array: `{ value: string, mode: "prompt" | ... }[]`

**Key insight:** The queue decision is made in `PE6` (processUserInput), NOT in the submit button handler. This means every input path — typing + Enter, slash command, or programmatic injection — automatically benefits from the queue when loading.

### 3.2 `useQueuedCommandProcessor` (HVq) - Queue Drain Hook

**What it does:** After `isLoading` transitions from `true` to `false`, processes queued commands sequentially.

**How it works:**
1. Effect 1: Resets `isExecuting` ref when loading starts
2. Effect 2: When `isLoading=false` AND `queuedCommandsLength > 0`, fires `processNextQueuedCommand`
3. Effect 2 also depends on `lastQueryCompletionTime` to re-fire on every query completion
4. `processNextQueuedCommand` (zVq): dequeues first item, calls `executeQueuedInput(iA)` which calls `processUserInput(PE6)`

**Why sequential (not batch)**: Each queued message may reference the result of the previous one. Processing one at a time ensures each steering message gets the correct conversation context.

---

## 4. Git-Related Feature: `includeGitInstructions`

**New in v2.1.76**: A new configuration option `includeGitInstructions` (env var: `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`) controls whether git workflow guidance is included in the system prompt during steering context.

**What it does:**
- When `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` is set, the git-specific instructions block is omitted from system prompt building
- Allows teams with custom git workflows or git-unaware deployments to suppress Claude's default git advice
- Defaults to `true` (git instructions included) if the env var is unset or non-truthy

**Where it's used**: Applied during system prompt assembly in the steering context, alongside the existing `includeGitInstructions` field in settings. Particularly relevant for CI/CD environments where git interaction is handled by automation, not the AI.

---

## 5. Abort Infrastructure

### 5.1 `onCancel` (N11) - The Abort Trigger

```javascript
// ============================================
// onCancel - Main abort trigger for local steering
// Location: chunks.188.mjs:550-587
// ============================================

// READABLE (for understanding):
function onCancel() {
    if (remoteSessionManager.isRemoteMode) {
        // Remote path: send WebSocket control message
        remoteSessionManager.cancelRequest();
        resetLoadingState();
        return;
    }
    // Local path: abort the in-flight fetch
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    resetLoadingState();
}
```

**What happens after `abort()`**:
1. The `fetch()` call inside the LLM API layer receives the abort signal
2. The streaming generator exits at its next `yield`
3. Checkpoint 2 in the query generator fires: `signal.aborted` → `true`
4. `getRemainingResults()` drains any in-flight tool calls
5. `"Interrupted by user"` is added to conversation as a system message
6. `isLoading` is set to `false`
7. `HVq` effect fires, dequeues next command

---

## 6. Stream Mode State Machine

### 6.1 `processStreamEvent` (iW1) - Stream Mode Tracking

The `streamMode` (O7) state drives the spinner display and determines what the user sees during streaming:

```
States: "requesting" → "thinking" → "responding" → "tool-input" → "tool-use" → done
                                       ↑                                           │
                                       └─── cycles for multi-tool responses ───────┘
```

**Transitions**:
- `message_start` → `"requesting"` (waiting for first token)
- `content_block_start` with `type: "thinking"` → `"thinking"`
- `content_block_start` with `type: "text"` → `"responding"`
- `content_block_start` with `type: "tool_use"` → `"tool-input"` (building tool args)
- Tool execution begins → `"tool-use"` (running the tool)
- Back to `"responding"` for next text block

This state is important for steering because the spinner message changes: during `"tool-use"`, the cancel button may need different visibility logic.

---

## 7. Complete Steering Flow

### 7.1 Successful Steering Sequence

```
1. LLM streams response → isLoading=true, abortSignal defined
2. User types new direction into input box
3. User presses Enter → PE6 sees isLoading=true → lB() → queuedCommands=["new direction"]
4. User presses Escape → ngA Branch 1 fires → onCancel() → abort()
5. LLM stream stops → Checkpoint 2: "Interrupted by user" added
6. isLoading → false
7. HVq Effect 2 fires → processNextQueuedCommand()
8. "new direction" dequeued → iA() → PE6 (isLoading=false now) → ff (onQuery)
9. New LLM call starts with updated context
```

### 7.2 Timing Guarantees

| Action | Latency | Why |
|--------|---------|-----|
| Escape press → abort signal | ~0ms | JavaScript synchronous |
| Abort signal → fetch cancellation | ~0ms (local) / RTT (remote) | AbortController / WebSocket |
| LLM stream termination | 0-500ms | Depends on in-flight tokens and tool drainage |
| `isLoading=false` | After stream ends | React state update |
| HVq fires | ~16ms after | React useEffect scheduling |
| Queue command submitted | ~16-32ms | After useEffect re-render |
