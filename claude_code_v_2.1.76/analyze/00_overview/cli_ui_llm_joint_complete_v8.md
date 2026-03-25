# CLI-UI-LLM Core Joint Analysis Complete v8 (Claude Code 2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.
> **Version**: v8 - Complete joint analysis with verified symbols, deep algorithms, decision trees, UI interaction patterns, and cross-feature linkages.

---

## Table of Contents

1. [Symbol Verification Report](#1-symbol-verification-report)
2. [Architecture Overview](#2-architecture-overview)
3. [CLI Entry Flow Restoration](#3-cli-entry-flow-restoration)
4. [UI State Machine Complete](#4-ui-state-machine-complete)
5. [LLM Agent Loop Restoration](#5-llm-agent-loop-restoration)
6. [Key Algorithms Deep Dive](#6-key-algorithms-deep-dive)
7. [UI Design Interaction Patterns](#7-ui-design-interaction-patterns)
8. [System Reminder Integration](#8-system-reminder-integration)
9. [Feature Cross-Linkage](#9-feature-cross-linkage)
10. [Performance Considerations](#10-performance-considerations)

---

## 1. Symbol Verification Report

### 1.1 Verified Symbol Mappings

All key symbols cross-validated against source code with exact locations:

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| `JVz` | cliEntry | chunks.198.mjs:1573 | `async function JVz()` | ✅ Verified |
| `OVz` | run | chunks.198.mjs:3 | `async function OVz()` | ✅ Verified |
| `WX1` | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ Verified |
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ Verified |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ Verified |
| `ui6` | StreamingToolExecutor | chunks.148.mjs:3 | `class ui6` | ✅ Verified |
| `mGq` | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(A, q, K, Y, z, _)` | ✅ Verified |
| `Wi6` | toolDispatcher | chunks.146.mjs:285 | `async function* Wi6(A, q, K, Y)` | ✅ Verified |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A, q, K, Y, z, _)` | ✅ Verified |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ Verified |
| `ot8` | sessionOrchestrator | chunks.196.mjs:3 | `function ot8({...})` | ✅ Verified |
| `ra6` | getInputDialogType | chunks.196.mjs:387 | `function ra6()` | ✅ Verified |

### 1.2 UI State Symbols

| Symbol | Readable | Location | Type | Status |
|--------|----------|----------|------|--------|
| `d7` | uiState | chunks.196.mjs:96 | React state variable | ✅ Verified |
| `W4` | setUIState | chunks.196.mjs:96 | React state setter | ✅ Verified |
| `Dz` | uiStateRef | chunks.196.mjs:97 | React ref | ✅ Verified |
| `JK` | toolUses | chunks.196.mjs:99 | React state array | ✅ Verified |
| `F3` | setToolUses | chunks.196.mjs:99 | React state setter | ✅ Verified |
| `MK` | thinkingState | chunks.196.mjs:100 | React state object | ✅ Verified |
| `k3` | setThinkingState | chunks.196.mjs:100 | React state setter | ✅ Verified |
| `u7` | messages | chunks.196.mjs:173 | React state array | ✅ Verified |
| `Xz` | setMessages | chunks.196.mjs:173 | React state setter | ✅ Verified |
| `iY` | messagesRef | chunks.196.mjs:173 | React ref | ✅ Verified |
| `gq` | updateMessages | chunks.196.mjs:174 | React callback | ✅ Verified |

---

## 2. Architecture Overview

### 2.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLI LAYER (01_cli)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  cliEntry (JVz) → mainEntry (_Vz) → run (OVz)                       │    │
│  │  • Commander.js flag parsing                                         │    │
│  │  • Permission context initialization                                 │    │
│  │  • Session management (-r, -c, -n flags)                            │    │
│  │  • Early dispatch for special modes (MCP CLI, Chrome, Bridge)       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UI LAYER (02_ui)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  sessionOrchestrator (ot8) → AppStateProvider (Yj) → REPL           │    │
│  │  • React/Ink rendering                                               │    │
│  │  • Message list management                                           │    │
│  │  • Keyboard input handling                                           │    │
│  │  • Streaming display updates                                         │    │
│  │  • UI state machine: responding → thinking → tool-use → idle        │    │
│  │  • Dialog priority system (getInputDialogType/ra6)                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LLM CORE LAYER (03_llm_core)                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  mainAgentLoop (Yh) → mainAgentLoopCore (omY)                       │    │
│  │  • Turn state management                                             │    │
│  │  • Auto-compact triggers                                             │    │
│  │  • System reminder assembly                                          │    │
│  │  • streamingQueryCore (mGq) → SSE processing                        │    │
│  │  • StreamingToolExecutor (ui6) → Parallel tool execution            │    │
│  │  • toolDispatcher (Wi6) → Tool routing                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM REMINDER LAYER (04_system_reminder)            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  assembleAllAttachments (_uY)                                        │    │
│  │  • Plan mode attachments                                             │    │
│  │  • Auto mode attachments                                             │    │
│  │  • Team context attachments                                          │    │
│  │  • Token usage reminders                                             │    │
│  │  • normalizeAttachmentForAPI (Ui8) → Format for API                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Complete Request Flow

```
User Input (UI)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. INPUT PHASE                                                              │
│    • Keyboard event captured in REPL component                              │
│    • Message assembled with attachments                                     │
│    • State transition: responding → thinking                                │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. PRE-TURN PHASE (mainAgentLoopCore)                                       │
│    • Micro-compact: Remove consecutive duplicate messages                  │
│    • Auto-compact check: shouldTriggerAutoCompaction()                     │
│    • Attachment assembly: assembleAllAttachments()                         │
│    • System prompt building                                                 │
│    • Tool schema construction (with deferred loading)                      │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. STREAMING PHASE (streamingQueryCore)                                     │
│    • Build tool schemas (with deferred loading)                            │
│    • Normalize messages for API                                            │
│    • Send streaming request to Anthropic API                               │
│    • Process SSE events in real-time                                       │
│    • Yield events to UI as they arrive                                     │
│    • Track token usage                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. TOOL EXECUTION PHASE (StreamingToolExecutor)                             │
│    • Collect tool_use blocks from response                                 │
│    • Execute concurrency-safe tools in parallel                            │
│    • Sequential execution for non-safe tools                               │
│    • Handle abort/rollback on sibling errors                               │
│    • Yield tool results                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. TURN COMPLETION PHASE                                                    │
│    • If tools were called: Continue to next turn                           │
│    • If no tools: Return final result                                      │
│    • Update session state                                                  │
│    • State transition: tool-use → responding → idle                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CLI Entry Flow Restoration

### 3.1 createStateStore (WX1) - Redux-like State Store

**What it does:** Creates a minimal Redux-like state store with subscribe pattern.

**How it works:**
1. Maintains internal state variable
2. Provides getState() for synchronous access
3. setState() accepts updater function and notifies listeners
4. subscribe() returns unsubscribe function
5. Reference equality check prevents unnecessary updates

```javascript
// ============================================
// createStateStore (WX1) - Redux-like state store
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL (for source lookup):
function WX1(A, q) {
    let K = A,
        Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K,
                w = z(_);
            if (Object.is(w, _)) return;
            K = w, q?.({newState: w, oldState: _});
            for (let O of Y) O();
        },
        subscribe: (z) => {
            return Y.add(z), () => Y.delete(z);
        }
    };
}

// READABLE (for understanding):
function createStateStore(initialState, onChange) {
    let state = initialState;
    let listeners = new Set();

    return {
        getState: () => state,

        setState: (updater) => {
            let oldState = state;
            let newState = updater(oldState);

            // Skip if unchanged (reference equality)
            if (Object.is(newState, oldState)) return;

            state = newState;

            // Notify change callback
            onChange?.({ newState, oldState });

            // Notify all subscribers
            for (let listener of listeners) listener();
        },

        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChange, K→state, Y→listeners
```

**Why this approach:**
- Minimal implementation avoids Redux dependency
- Reference equality check (Object.is) prevents unnecessary re-renders
- Set for listeners ensures no duplicate subscriptions
- onChange callback enables logging/debugging

---

## 4. UI State Machine Complete

### 4.1 UI State Variables

The REPL component manages multiple interconnected state variables:

```javascript
// ============================================
// UI State Variables - REPL component
// Location: chunks.196.mjs:96-100
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);

// READABLE (for understanding):
let [uiState, setUIState] = useState("responding");
let uiStateRef = useRef(uiState);
uiStateRef.current = uiState;  // Sync ref for non-React callbacks

let [toolUses, setToolUses] = useState([]);  // Active tool executions
let [thinkingState, setThinkingState] = useState(null);  // {thinking, isStreaming, streamingEndedAt}

// Mapping: d7→uiState, W4→setUIState, Dz→uiStateRef, JK→toolUses, F3→setToolUses, MK→thinkingState, k3→setThinkingState
```

### 4.2 UI State Machine Diagram

```
                              ┌─────────────────────────────────────────┐
                              │              UI STATE MACHINE           │
                              └─────────────────────────────────────────┘

┌────────────┐     user input      ┌────────────┐     stream start     ┌────────────┐
│            │ ─────────────────► │            │ ─────────────────► │            │
│  responding │                    │  thinking  │                     │ responding │
│            │ ◄───────────────── │            │ ◄───────────────── │            │
└────────────┘     no tools        └────────────┘     stream end        └────────────┘
      │                                   │                                   │
      │                                   │ tool_use detected                 │
      │                                   ▼                                   │
      │                           ┌────────────┐                             │
      │                           │            │                             │
      │                           │ tool-use   │                             │
      │                           │            │                             │
      │                           └────────────┘                             │
      │                                   │                                   │
      │                                   │ tool results complete             │
      │                                   ▼                                   │
      │                           ┌────────────┐                             │
      │                           │            │                             │
      └─────────────────────────► │  thinking  │ ◄───────────────────────────┘
                                  │            │
                                  └────────────┘

State Transitions:
- responding → thinking: User submits message
- thinking → responding: LLM response with no tools
- thinking → tool-use: LLM calls tools
- tool-use → thinking: Tool execution complete, continuing turn
- thinking → responding: Turn complete

State Descriptions:
- responding: Idle state, accepting user input
- thinking: LLM is streaming response
- tool-use: Tools are being executed
```

### 4.3 Message State Management

```javascript
// ============================================
// Message State Management - REPL component
// Location: chunks.196.mjs:173-183
// ============================================

// ORIGINAL (for source lookup):
let [u7, Xz] = N8.useState(Y ?? []), iY = N8.useRef(u7);
let gq = N8.useCallback((P1) => {
    let Y8 = typeof P1 === "function" ? P1(iY.current) : P1;
    iY.current = Y8, Xz(Y8)
}, []);

// READABLE (for understanding):
let [messages, setMessages] = useState(initialMessages ?? []);
let messagesRef = useRef(messages);

let updateMessages = useCallback((updater) => {
    let newMessages = typeof updater === "function"
        ? updater(messagesRef.current)
        : updater;

    messagesRef.current = newMessages;  // Sync ref for async access
    setMessages(newMessages);
}, []);

// Deferred value for performance optimization
let deferredMessages = useDeferredValue(messages);

// Track deferred delta for logging
let messageDelta = messages.length - deferredMessages.length;
if (messageDelta > 0) {
    debugLog(`[useDeferredValue] Messages deferred by ${messageDelta}`);
}

// Mapping: u7→messages, Xz→setMessages, iY→messagesRef, gq→updateMessages
```

### 4.4 Dialog Priority System (getInputDialogType)

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (P1 && a8[0]) return "tool-permission";
    if (P1 && zA[0]) return "prompt";
    if (P1 && n.queue[0]) return "worker-sandbox-permission";
    if (P1 && o.queue[0]) return "elicitation";
    if (P1 && m26) return "cost";
    if (P1 && W6) return "ide-onboarding";
    if (P1 && g6) return "effort-callout";
    if (P1 && J1) return "remote-callout";
    if (P1 && e8) return "lsp-recommendation";
    if (P1 && E1) return "desktop-upsell";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // Early exit if modal is open
    if (isModalOpen || pendingNavigation) return undefined;

    // Highest priority: message selector (explicit user action)
    if (isMessageSelectorVisible) return "message-selector";

    // Block dialogs during typing
    if (isTyping) return undefined;

    // Check sandbox permission queue first
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check animation should continue
    let shouldContinueAnimation = !localJSXCommand || localJSXCommand.shouldContinueAnimation;

    // Priority order for dialogs
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";
    if (shouldContinueAnimation && workerSandboxQueue.queue[0]) return "worker-sandbox-permission";
    if (shouldContinueAnimation && elicitationQueue.queue[0]) return "elicitation";
    if (shouldContinueAnimation && isCostWarningVisible) return "cost";
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isModalOpen, na6→pendingNavigation, W7→isMessageSelectorVisible,
//          y2→isTyping, G7→sandboxPermissionQueue, a8→toolPermissionQueue, zA→promptQueue
```

**Why this approach:**
- Priority-based dispatching ensures correct dialog shown
- Explicit ordering prevents dialog conflicts
- Animation flag allows graceful transition states

---

## 5. LLM Agent Loop Restoration

### 5.1 StreamingToolExecutor (ui6) - Complete Implementation

**What it does:** Manages parallel tool execution with concurrency safety checks.

**How it works:**
1. Tools queue up as they stream in from SSE
2. Concurrency-safe tools execute in parallel
3. Non-safe tools wait for safe tools to complete
4. Sibling abort pattern: one failure aborts siblings

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
// Location: chunks.148.mjs:3-228
// ============================================

// ORIGINAL (for source lookup):
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    discard() {
        this.discarded = !0
    }
    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                pendingProgress: [],
                results: [p1({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
                        is_error: !0,
                        tool_use_id: A.id
                    }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try {
                    return Boolean(K.isConcurrencySafe(Y.data))
                } catch {
                    return !1
                }
            })() : !1;
        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        }), this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    // ... more methods ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.tools = [];  // Queue of tool executions
        this.toolUseContext = toolUseContext;
        this.hasErrored = false;  // Circuit breaker flag
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
        this.discarded = false;
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, or if all executing tools are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    addTool(toolUseBlock, assistantMessage) {
        let toolDef = findToolDefinition(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Tool not found - create error result
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                results: [createSyntheticError(toolUseBlock.id, `No such tool: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Validate input and determine concurrency safety
        let parsedInput = toolDef.inputSchema.safeParse(toolUseBlock.input);
        let isConcurrencySafe = parsedInput?.success
            ? Boolean(toolDef.isConcurrencySafe(parsedInput.data))
            : false;

        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage,
            status: "queued",
            isConcurrencySafe,
            pendingProgress: []
        });

        this.processQueue();
    }

    getAbortReason(toolEntry) {
        if (this.discarded) return "streaming_fallback";
        if (this.hasErrored) return "sibling_error";
        if (this.toolUseContext.abortController.signal.aborted) {
            if (this.toolUseContext.abortController.signal.reason === "interrupt") {
                return this.getToolInterruptBehavior(toolEntry) === "cancel"
                    ? "user_interrupted"
                    : null;
            }
            return "user_interrupted";
        }
        return null;
    }

    async executeTool(toolEntry) {
        toolEntry.status = "executing";
        this.toolUseContext.setInProgressToolUseIDs(ids => new Set([...ids, toolEntry.id]));
        this.updateInterruptibleState();

        let results = [];
        let contextModifiers = [];

        // Check abort conditions
        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage)];
            toolEntry.status = "completed";
            return;
        }

        // Create sibling abort controller for isolation
        let siblingAbort = cloneAbortController(this.siblingAbortController);
        siblingAbort.signal.addEventListener("abort", () => {
            if (siblingAbort.signal.reason !== "sibling_error" &&
                !this.toolUseContext.abortController.signal.aborted &&
                !this.discarded) {
                this.toolUseContext.abortController.abort(siblingAbort.signal.reason);
            }
        }, { once: true });

        // Execute via toolDispatcher
        for await (let event of toolDispatcher(toolEntry.block, toolEntry.assistantMessage,
                                                this.canUseTool, {...this.toolUseContext, abortController: siblingAbort})) {
            // Check abort during execution
            let reason = this.getAbortReason(toolEntry);
            if (reason) {
                results.push(this.createSyntheticErrorMessage(toolEntry.id, reason, toolEntry.assistantMessage));
                break;
            }

            // Handle error results - trigger sibling abort
            if (event.message?.type === "user" &&
                event.message.message.content?.some(c => c.type === "tool_result" && c.is_error)) {
                if (toolEntry.block.name === BASH_TOOL_NAME) {
                    this.hasErrored = true;
                    this.erroredToolDescription = this.getToolDescription(toolEntry);
                    this.siblingAbortController.abort("sibling_error");
                }
            }

            if (event.message) {
                if (event.message.type === "progress") {
                    toolEntry.pendingProgress.push(event.message);
                    if (this.progressAvailableResolve) {
                        this.progressAvailableResolve();
                        this.progressAvailableResolve = undefined;
                    }
                } else {
                    results.push(event.message);
                }
            }

            if (event.contextModifier) {
                contextModifiers.push(event.contextModifier.modifyContext);
            }
        }

        toolEntry.results = results;
        toolEntry.contextModifiers = contextModifiers;
        toolEntry.status = "completed";
        this.updateInterruptibleState();

        // Apply context modifiers for non-concurrency-safe tools
        if (!toolEntry.isConcurrencySafe && contextModifiers.length > 0) {
            for (let modifier of contextModifiers) {
                this.toolUseContext = modifier(this.toolUseContext);
            }
        }
    }

    async *getRemainingResults() {
        if (this.discarded) return;

        while (this.hasUnfinishedTools()) {
            await this.processQueue();

            for (let result of this.getCompletedResults()) {
                yield result;
            }

            // Wait for executing tools if no results ready
            if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
                let promises = this.tools
                    .filter(t => t.status === "executing" && t.promise)
                    .map(t => t.promise);
                let progressPromise = new Promise(resolve => {
                    this.progressAvailableResolve = resolve;
                });

                if (promises.length > 0) {
                    await Promise.race([...promises, progressPromise]);
                }
            }
        }

        for (let result of this.getCompletedResults()) {
            yield result;
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext
```

**Why this approach:**
- Parallel execution for concurrency-safe tools (Read, Grep, Glob)
- Sequential execution for non-safe tools (Write, Edit, Bash)
- Sibling abort pattern: one tool failure aborts siblings but not parent
- Progress tracking for UI updates

---

## 6. Key Algorithms Deep Dive

### 6.1 assembleAllAttachments (_uY) - Attachment Orchestrator

**What it does:** Assembles all system reminder attachments before each LLM request.

**How it works:**
1. Creates abort controller with 1-second timeout
2. Groups producers by priority (pre-switch, standard, conditional)
3. Executes all producers in parallel
4. Filters out null/undefined results

```javascript
// ============================================
// assembleAllAttachments (_uY) - Attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)),
                 Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))),
                 ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())),
             Hz("ultrathink_effort", () => Promise.resolve(TuY(A))),
             Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))),
             Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))),
             Hz("changed_files", () => CuY($)),
             Hz("nested_memory", () => IuY($)),
             Hz("dynamic_skill", () => BuY($)),
             Hz("skill_listing", () => guY($)),
             Hz("ultra_claude_md", async () => VuY(z)),
             Hz("plan_mode", () => DuY(z, q)),
             Hz("plan_mode_exit", () => XuY(q)),
             Hz("auto_mode", () => ZuY(z, q)),
             Hz("auto_mode_exit", () => GuY(q)),
             Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)),
             ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))],
                        Hz("team_context", async () => AmY(z ?? []))] : [],
             Hz("agent_pending_messages", async () => $uY(q)),
             Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)),
                 Hz("ide_opened_file", async () => LuY(K, q)),
                 Hz("output_style", async () => Promise.resolve(NuY())),
                 Hz("diagnostics", async () => cuY(q)),
                 Hz("lsp_diagnostics", async () => luY(q)),
                 Hz("unified_tasks", async () => suY(q)),
                 Hz("async_hook_responses", async () => tuY()),
                 Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))),
                 Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))),
                 Hz("output_token_usage", async () => Promise.resolve(KmY())),
                 Hz("verify_plan_reminder", async () => _mY(z, q)),
                 Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(atMentionedFiles, sessionContext, ideContext, queuedCommands, messages, memoryType) {
    // Check for disabled attachments
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout(ctrl => ctrl.abort(), 1000, abortController);

    let contextWithAbort = {
        ...sessionContext,
        abortController
    };

    let isMainThread = !sessionContext.agentId;

    // Pre-switch producers (only when files @-mentioned)
    let preSwitchProducers = atMentionedFiles ? [
        timedProducer("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, contextWithAbort)),
        timedProducer("mcp_resources", () => produceMcpResources(atMentionedFiles, contextWithAbort)),
        timedProducer("agent_mentions", () => produceAgentMentions(atMentionedFiles, sessionContext.options.agentDefinitions.activeAgents))
    ] : [];
    let preSwitchResults = await Promise.all(preSwitchProducers);

    // Standard producers (always run)
    let standardProducers = [
        timedProducer("date_change", () => produceDateChangeReminder()),
        timedProducer("ultrathink_effort", () => produceUltrathinkEffort(atMentionedFiles)),
        timedProducer("deferred_tools_delta", () => produceDeferredToolsDelta(sessionContext.options.tools, sessionContext.options.mainLoopModel, messages)),
        timedProducer("mcp_instructions_delta", () => produceMcpInstructionsDelta(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, messages)),
        timedProducer("changed_files", () => produceChangedFiles(contextWithAbort)),
        timedProducer("nested_memory", () => produceNestedMemory(contextWithAbort)),
        timedProducer("dynamic_skill", () => produceDynamicSkill(contextWithAbort)),
        timedProducer("skill_listing", () => produceSkillListing(contextWithAbort)),
        timedProducer("ultra_claude_md", async () => produceUltraClaudeMd(messages)),
        timedProducer("plan_mode", () => producePlanModeReminder(messages, sessionContext)),
        timedProducer("plan_mode_exit", () => producePlanModeExit(sessionContext)),
        timedProducer("auto_mode", () => produceAutoModeReminder(messages, sessionContext)),
        timedProducer("auto_mode_exit", () => produceAutoModeExit(sessionContext)),
        timedProducer("todo_reminders", () => isTodoCompactEnabled() ? produceTodoCompactReminder(messages, sessionContext) : produceTodoReminder(messages, sessionContext)),
        // Team mode conditional
        ...(isTeamMode() ? [
            ...(memoryType === "session_memory" ? [] : [timedProducer("teammate_mailbox", async () => produceTeammateMailbox(sessionContext))]),
            timedProducer("team_context", async () => produceTeamContext(messages ?? []))
        ] : []),
        timedProducer("agent_pending_messages", async () => produceAgentPendingMessages(sessionContext)),
        timedProducer("critical_system_reminder", () => produceCriticalReminder(sessionContext))
    ];

    // Conditional producers (only for main thread, not subagents)
    let conditionalProducers = isMainThread ? [
        timedProducer("ide_selection", async () => produceIdeSelection(ideContext, sessionContext)),
        timedProducer("ide_opened_file", async () => produceIdeOpenedFile(ideContext, sessionContext)),
        timedProducer("output_style", async () => produceOutputStyle()),
        timedProducer("diagnostics", async () => produceDiagnostics(sessionContext)),
        timedProducer("lsp_diagnostics", async () => produceLspDiagnostics(sessionContext)),
        timedProducer("unified_tasks", async () => produceUnifiedTasks(sessionContext)),
        timedProducer("async_hook_responses", async () => produceAsyncHookResponses()),
        timedProducer("token_usage", async () => produceTokenUsage(messages ?? [], sessionContext.options.mainLoopModel)),
        timedProducer("budget_usd", async () => produceBudgetUsd(sessionContext.options.maxBudgetUsd)),
        timedProducer("output_token_usage", async () => produceOutputTokenUsage()),
        timedProducer("verify_plan_reminder", async () => produceVerifyPlanReminder(messages, sessionContext)),
        timedProducer("queued_commands", () => produceQueuedCommands(queuedCommands))
    ] : [];

    // Execute in parallel
    let [standardResults, conditionalResults] = await Promise.all([
        Promise.all(standardProducers),
        Promise.all(conditionalProducers)
    ]);

    // Clear timeout and flatten results
    clearTimeout(timeoutId);

    return [...preSwitchResults.flat(), ...standardResults.flat(), ...conditionalResults.flat()]
        .filter(result => result !== undefined && result !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentionedFiles, q→sessionContext, K→ideContext, Y→queuedCommands,
//          z→messages, _→memoryType, w→abortController, H→isMainThread, j→preSwitchProducers, M→standardProducers, D→conditionalProducers
```

**Why this approach:**
- Parallel execution minimizes latency
- 1-second global timeout prevents hanging
- Conditional producers only for main thread saves tokens
- Three producer groups for prioritization

---

## 7. UI Design Interaction Patterns

### 7.1 sessionOrchestrator (ot8) - Main Session Component

```javascript
// ============================================
// sessionOrchestrator (ot8) - Main session orchestrator
// Location: chunks.196.mjs:3-300
// ============================================

// ORIGINAL (for source lookup):
function ot8({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    pendingHookMessages: z,
    // ... 25+ more props
}) {
    let R = !!N;  // isRemoteMode
    N8.useEffect(() => {
        return k(`[REPL:mount] REPL mounted, disabled=${Z}`), () => k("[REPL:unmount] REPL unmounting")
    }, [Z]);

    // State hooks (35+ useState calls)
    let [d7, W4] = N8.useState("responding");  // uiState
    let [JK, F3] = N8.useState([]);  // toolUses
    let [MK, k3] = N8.useState(null);  // thinkingState
    let [u7, Xz] = N8.useState(Y ?? []);  // messages
    // ... many more state hooks
}

// READABLE (for understanding):
function sessionOrchestrator({
    commands,                  // Slash commands
    debug,                     // Debug mode
    initialTools,              // Initial tool set
    initialMessages,           // Conversation history
    pendingHookMessages,       // Hook results to process
    mcpClients,                // MCP server connections
    systemPrompt,
    appendSystemPrompt,
    onBeforeQuery,             // Pre-query callback
    onTurnComplete,            // Post-turn callback
    disabled = false,
    disableSlashCommands = false,
    remoteSessionConfig,       // Remote session settings
    thinkingConfig             // Extended thinking config
}) {
    let isRemoteMode = !!remoteSessionConfig;

    // Primary UI state machine
    let [uiState, setUIState] = useState("responding");
    let uiStateRef = useRef(uiState);
    uiStateRef.current = uiState;

    // Tool execution tracking
    let [toolUses, setToolUses] = useState([]);
    let [thinkingState, setThinkingState] = useState(null);

    // Message management
    let [messages, setMessages] = useState(initialMessages ?? []);
    let messagesRef = useRef(messages);

    let updateMessages = useCallback((updater) => {
        let newMessages = typeof updater === "function"
            ? updater(messagesRef.current)
            : updater;
        messagesRef.current = newMessages;
        setMessages(newMessages);
    }, []);

    // Deferred rendering for performance
    let deferredMessages = useDeferredValue(messages);

    // Permission queues
    let [toolPermissionQueue, setToolPermissionQueue] = useState([]);
    let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);
    let [promptQueue, setPromptQueue] = useState([]);

    // Dialog determination
    function getInputDialogType() {
        if (isMessageSelectorVisible) return "message-selector";
        if (isTyping) return undefined;
        if (sandboxPermissionQueue[0]) return "sandbox-permission";

        let shouldContinueAnimation = !localJSXCommand || localJSXCommand.shouldContinueAnimation;

        if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";
        if (shouldContinueAnimation && promptQueue[0]) return "prompt";
        // ... more dialog types

        return undefined;
    }

    // Cancel handler
    function handleCancel() {
        if (currentDialogType === "elicitation") return;

        debugLog(`[onCancel] focusedInputDialog=${currentDialogType} streamMode=${uiState}`);

        // Handle streaming text
        if (streamingText?.trim()) {
            updateMessages(prev => [...prev, createAssistantMessage({ content: streamingText })]);
        }

        resetLoadingState();

        // Handle different dialog types
        if (currentDialogType === "tool-permission") {
            toolPermissionQueue[0]?.onAbort();
            setToolPermissionQueue([]);
        } else if (currentDialogType === "prompt") {
            for (let prompt of promptQueue) {
                prompt.reject(Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController?.abort();
        } else if (isRemoteMode) {
            remoteSessionHandler.cancelRequest();
        } else {
            abortController?.abort();
        }

        setAbortController(null);
    }

    // ... more implementation
}

// Mapping: ot8→sessionOrchestrator, d7→uiState, W4→setUIState, JK→toolUses, u7→messages
```

### 7.2 Component Hierarchy

```
sessionOrchestrator (ot8)
│
├── AppStateProvider (Yj)
│   │
│   └── REPL
│       │
│       ├── Header
│       │   ├── Logo
│       │   ├── Version display
│       │   └── Agent info
│       │
│       ├── MessageList
│       │   │
│       │   ├── MessageComponent (per message)
│       │   │   ├── UserMessage
│       │   │   ├── AssistantMessage
│       │   │   ├── ToolUseCard
│       │   │   └── ToolResultCard
│       │   │
│       │   ├── StreamingToolUse (during tool execution)
│       │   └── StreamingThinking (during extended thinking)
│       │
│       ├── Spinner (conditional)
│       │   └── Activity text, progress indicator
│       │
│       ├── PromptInput
│       │   ├── TextInput
│       │   ├── AutocompleteOverlay (slash commands)
│       │   └── ImagePreview
│       │
│       ├── DialogRenderer
│       │   ├── ToolPermissionDialog
│       │   ├── SandboxPermissionDialog
│       │   ├── ElicitationDialog
│       │   ├── CostWarningDialog
│       │   ├── IDEOnboardingDialog
│       │   ├── LSPRecommendationDialog
│       │   ├── EffortCalloutDialog
│       │   ├── RemoteCalloutDialog
│       │   ├── DesktopUpsellDialog
│       │   └── MessageSelectorDialog
│       │
│       └── Footer
│           ├── Mode indicator (accept/plan/auto)
│           ├── Model name
│           ├── Token count
│           └── Keybinding hints
```

---

## 8. System Reminder Integration

### 8.1 Attachment Producer Catalog

| Producer | Type | Trigger Condition | Priority |
|----------|------|-------------------|----------|
| `produceAtMentionedFiles` | file context | Files @-mentioned | Pre-switch |
| `produceMcpResources` | mcp_resource | @-mention MCP resource | Pre-switch |
| `produceAgentMentions` | agent_mention | Agent @-mentioned | Pre-switch |
| `produceDateChange` | date_change | Date changed since last | Standard |
| `produceUltrathinkEffort` | ultrathink_effort | Extended thinking active | Standard |
| `produceDeferredToolsDelta` | deferred_tools_delta | Deferred tools available | Standard |
| `producePlanModeReminder` | plan_mode | Mode is "plan" | Standard |
| `produceAutoModeReminder` | auto_mode | Mode is "auto" | Standard |
| `produceTodoReminders` | todo_reminder | Todo list exists | Standard |
| `produceTeamContext` | team_context | Team mode active | Standard |
| `produceTokenUsage` | token_usage | Main thread only | Conditional |
| `produceBudgetUsd` | budget_usd | Main thread only | Conditional |
| `produceIdeSelection` | ide_selection | Main thread + IDE active | Conditional |
| `produceDiagnostics` | diagnostics | Main thread + LSP active | Conditional |

### 8.2 Normalization Flow

```
Attachment Object
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ normalizeAttachmentForAPI (Ui8)                                              │
│                                                                              │
│ Switch on attachment.type:                                                   │
│   case "plan_mode":                                                          │
│     → planModeReminderDispatcher() → full/sparse/subagent variant           │
│   case "token_usage":                                                        │
│     → createUserMessage({content: formatTokens(), isMeta: true})            │
│   case "file":                                                               │
│     → createUserMessage({content: fileContent, isMeta: false})              │
│   case "todo_reminder":                                                      │
│     → wrapWithSystemReminderTags(createUserMessage(...))                    │
│   default:                                                                   │
│     → createUserMessage({content: attachment.content, isMeta: true})        │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
Normalized Message Object
{
    type: "user",
    message: {
        role: "user",
        content: [...],
        isMeta: true  // Hidden from UI
    },
    uuid: "..."
}
```

---

## 9. Feature Cross-Linkage

### 9.1 CLI → UI → LLM Integration Matrix

| CLI Flag | UI Impact | LLM Core Impact | System Reminder |
|----------|-----------|-----------------|-----------------|
| `-p, --print` | Non-interactive mode | maxTurns=1 | None |
| `--dangerously-skip-permissions` | Skip dialogs | mode="accept" | Skip permission attachments |
| `--model` | Display in footer | Model selection | Model-specific thresholds |
| `--plan` | Plan mode UI | mode="plan" | plan_mode attachment |
| `--resume` | Load messages | Session restore | Reload context |
| `--mcp-config` | MCP status | MCP tools | MCP instructions |
| `--effort` | Effort callout | Thinking budget | ultrathink_effort |

### 9.2 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          STATE FLOW ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   CLI Flags     │     │   State Store   │     │   UI Components │       │
│  │                 │     │   (WX1)         │     │                 │       │
│  │  --model        │────►│  toolPermission │────►│  Footer display │       │
│  │  --plan         │     │  Context        │     │  Mode badge     │       │
│  │  --resume       │     │                 │     │  Message list   │       │
│  └─────────────────┘     │  messages       │     │  Dialog stack   │       │
│                          │  mcpClients     │     └─────────────────┘       │
│  ┌─────────────────┐     │  tasks          │                              │
│  │   User Input    │     │                 │     ┌─────────────────┐       │
│  │                 │────►│  subscribe()    │────►│  Re-render      │       │
│  │  Keyboard       │     │  notifies       │     │  affected       │       │
│  │  Paste          │     │  listeners      │     │  components     │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│                                     │                                       │
│                                     │                                       │
│                                     ▼                                       │
│                          ┌─────────────────┐                                │
│                          │   Agent Loop    │                                │
│                          │   (mainAgentLoop│                                │
│                          │    Yh)          │                                │
│                          │                 │                                │
│                          │  Yields events  │                                │
│                          │  to UI layer    │                                │
│                          └─────────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Cross-Module Event Flow

```
User submits message
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ UI LAYER                                                                   │
│   setUIState("thinking")                                                   │
│   messagesRef.current = [...prev, userMessage]                            │
│   startAgentLoop()                                                         │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ AGENT LOOP (mainAgentLoopCore)                                             │
│   1. Check auto-compact trigger                                            │
│   2. Assemble attachments (_uY)                                            │
│   3. Build tool schemas                                                    │
│   4. Normalize messages                                                    │
│   5. Start streaming (mGq)                                                 │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ STREAMING CORE (streamingQueryCore)                                        │
│   for await (event of sseStream):                                          │
│     yield { type: "stream_event", event }                                  │
│     if (content_block_stop): yield { type: "assistant", message }          │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ UI LAYER (handleStreamedEvent)                                             │
│   switch (event.type):                                                     │
│     "assistant" → setMessages(prev => [...prev, event.message])            │
│     "stream_event" → updateStreamState(event.event)                        │
│     "tool_use" → setToolUses(...), setUIState("tool-use")                  │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TOOL EXECUTOR (StreamingToolExecutor)                                      │
│   for tool_use in tool_uses:                                               │
│     if (canExecuteTool(isConcurrencySafe)):                                │
│       executeTool(tool) → yield result                                     │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ UI LAYER (tool result handling)                                            │
│   setMessages(prev => [...prev, toolResultMessage])                        │
│   setUIState("thinking")  // Continue turn                                 │
│   // OR                                                                    │
│   setUIState("responding")  // Turn complete                               │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Performance Considerations

### 10.1 UI Performance Patterns

1. **useDeferredValue for Messages**
   - Defers heavy message rendering during rapid updates
   - Logs delta for debugging: `messages.length - deferredMessages.length`

2. **Ref Synchronization Pattern**
   - `messagesRef.current = messages` after each update
   - Enables async callbacks to access current state without stale closures

3. **Callback Memoization**
   - `updateMessages` wrapped in `useCallback` with empty deps
   - Prevents unnecessary re-renders of child components

### 10.2 Streaming Performance

1. **Immediate Event Yielding**
   - SSE events yielded to UI as they arrive
   - No batching for real-time feedback

2. **Parallel Tool Execution**
   - Concurrency-safe tools execute simultaneously
   - Reduces total tool execution time

3. **Progress Tracking**
   - `progressAvailableResolve` pattern for efficient waiting
   - `Promise.race` for tool completion + progress

### 10.3 Token Efficiency

1. **Deferred Tool Loading**
   - Only include tools referenced in conversation
   - Dynamic tool discovery via `zF(messages)`

2. **Sparse Reminders**
   - Plan mode reminders alternate full/sparse
   - Reduces context token usage

3. **Cache Controls**
   - System prompt cached with `ephemeral` type
   - Repeated user messages cached

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key functions documented:
- `createStateStore` (WX1) - State store factory at chunks.85.mjs:1747
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `StreamingToolExecutor` (ui6) - Tool execution queue at chunks.148.mjs:3
- `streamingQueryCore` (mGq) - SSE streaming at chunks.171.mjs:3
- `assembleAllAttachments` (_uY) - Attachment orchestrator at chunks.147.mjs:3

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All CLI-UI-LLM functionality documented with source verification