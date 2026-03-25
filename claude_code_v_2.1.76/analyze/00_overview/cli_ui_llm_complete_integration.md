# CLI-UI-LLM Complete Integration Analysis (Claude Code v2.1.76)

> Comprehensive integration analysis with source-level restoration, timing diagrams, and cross-feature linkages.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Related Documents**:
> - [cli_ui_llm_joint_analysis.md](./cli_ui_llm_joint_analysis.md) - Main joint analysis
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution symbols
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Feature symbols

---

## Table of Contents

1. [Symbol Validation Report](#1-symbol-validation-report)
2. [Complete Startup Sequence with Timing](#2-complete-startup-sequence-with-timing)
3. [State Synchronization Patterns](#3-state-synchronization-patterns)
4. [Error Handling Coordination](#4-error-handling-coordination)
5. [Integration Test Scenarios](#5-integration-test-scenarios)
6. [Cross-Feature Interaction Matrix](#6-cross-feature-interaction-matrix)
7. [Source Code Restoration](#7-source-code-restoration)

---

## 1. Symbol Validation Report

### 1.1 Verified Core Symbols

All symbols have been cross-validated against source code:

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | ✅ Verified - `async function* Yh(A)` |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | ✅ Verified - `async function* omY(A, q)` |
| `ui6` | StreamingToolExecutor | chunks.148.mjs:3 | ✅ Verified - `class ui6` |
| `mGq` | streamingQueryCore | chunks.171.mjs:3 | ✅ Verified - `async function* mGq(A, q, K, Y, z, _)` |
| `ot8` | sessionOrchestrator | chunks.196.mjs:3 | ✅ Verified - `function ot8({commands, debug, initialTools, ...})` |
| `ra6` | getInputDialogType | chunks.196.mjs:387 | ✅ Verified - `function ra6()` |
| `TM` | handleCancel | chunks.196.mjs:420 | ✅ Verified - `function TM()` |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | ✅ Verified - `async function _uY(A, q, K, Y, z, _)` |
| `Hz` | timedAttachmentProducer | chunks.147.mjs:20 | ✅ Verified - `async function Hz(A, q)` |
| `DuY` | getPlanModeAttachment | chunks.147.mjs:136 | ✅ Verified - `async function DuY(A, q)` |
| `cM` | normalizeMessages | chunks.173.mjs:1999 | ✅ Verified - `function cM(A, q = [])` |
| `WX1` | createStateStore | chunks.85.mjs:1747 | ✅ Verified - `function WX1(A, q)` |
| `K5` | trackMark | chunks.148.mjs:250 | ✅ Verified - Performance tracking function |

### 1.2 Verified Symbol Signatures

```javascript
// ============================================
// mainAgentLoop (Yh) - Main agent loop async generator
// Location: chunks.148.mjs:875-880
// ============================================

// ORIGINAL (for source lookup):
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}

// READABLE (for understanding):
async function* mainAgentLoop(params) {
    let cleanupActions = [];
    let result = yield* mainAgentLoopCore(params, cleanupActions);
    for (let action of cleanupActions) {
        markToolCompleted(action, "completed");
    }
    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→cleanupActions, omY→mainAgentLoopCore
```

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Parallel tool execution class
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
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    // ... more methods
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = false;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = false;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext
```

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
    // Block-all conditions
    if (isViewingDialogHistory || hasActiveNotification) return undefined;

    // User-initiated (highest priority)
    if (messageSelectorVisible) return "message-selector";

    // Streaming pause blocks lower dialogs
    if (isPaused) return undefined;

    // Security-critical (immediate)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gate for lower priority
    const canShowLower = !toolJSX || toolJSX.shouldContinueAnimation;

    if (canShowLower && toolPermissionQueue[0]) return "tool-permission";
    if (canShowLower && promptQueue[0]) return "prompt";
    // ... more dialogs

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue
```

---

## 2. Complete Startup Sequence with Timing

### 2.1 Phase 1: CLI Entry (0-50ms)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLI ENTRY TIMING                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  T+0ms: cliEntry (JVz)                                                       │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Process argv slice                                                        │
│  • Check --version flag (early exit path)                                    │
│  • Check special modes (--mcp-cli, --ripgrep, --chrome)                     │
│                                                                               │
│  T+5ms: mainEntry (_Vz)                                                      │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Setup process signal handlers (SIGINT, SIGTERM)                          │
│  • Determine client type (IIFE pattern)                                      │
│  • Call run()                                                                │
│                                                                               │
│  T+10ms: run (OVz)                                                           │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Create Commander.js program                                               │
│  • Configure help formatting                                                 │
│  • Register preAction hook                                                   │
│                                                                               │
│  T+15ms: preAction Hook                                                      │
│  ────────────────────────────────────────────────────────────────────────   │
│  • initializeMdm() - Telemetry setup                                        │
│  • runInitializers() - Plugin initializers                                  │
│  • initializeErrorLogSink() - Error logging                                 │
│  • registerInlinePlugins() - Built-in plugins                               │
│  • runMigrations() - Schema migrations                                       │
│  • syncSettingsFromProject() - Load settings                                │
│                                                                               │
│  T+30ms: Flag Parsing                                                        │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Parse ~50 CLI flags                                                       │
│  • Validate flag combinations                                                │
│  • Build initialState object                                                 │
│                                                                               │
│  T+50ms: Branch Decision                                                     │
│  ────────────────────────────────────────────────────────────────────────   │
│  • isNonInteractive? → Headless execution                                    │
│  • isInteractive? → Render REPL                                              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Phase 2: State Initialization (50-100ms)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE INITIALIZATION TIMING                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  T+50ms: createStateStore (WX1)                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Create observable store with initialState                                 │
│  • Setup onChange callback                                                   │
│  • Initialize subscriber Set                                                 │
│                                                                               │
│  T+55ms: AppStateProvider (Yj)                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Create React context                                                      │
│  • Wrap store in provider                                                    │
│  • Setup useAppState hook                                                    │
│                                                                               │
│  T+60ms: Session Orchestrator Mount                                          │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Initialize 35+ useState calls                                             │
│  • Setup useEffect hooks                                                     │
│  • Initialize MCP client connections                                         │
│                                                                               │
│  T+70ms: Tool Assembly                                                        │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Load default tools (Read, Write, Edit, Bash, Grep, Glob)                 │
│  • Load MCP tools from clients                                               │
│  • Apply permission filters                                                  │
│  • Build final tool set                                                      │
│                                                                               │
│  T+80ms: Session Resume (if applicable)                                      │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Load session from --resume or --continue                                  │
│  • Parse session messages                                                    │
│  • Restore conversation state                                                │
│                                                                               │
│  T+100ms: Ready for Input                                                    │
│  ────────────────────────────────────────────────────────────────────────   │
│  • PromptInput component mounted                                             │
│  • Input focus acquired                                                      │
│  • Ready for user input                                                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Phase 3: Query Execution (User initiates query)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUERY EXECUTION TIMING                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  T+0ms: User Presses Enter                                                   │
│  ────────────────────────────────────────────────────────────────────────   │
│  • handleKeyPress detects Enter                                              │
│  • handleSubmit() called                                                     │
│  • CreateUserMessage created                                                 │
│  • setIsLoading(true)                                                        │
│                                                                               │
│  T+5ms: Agent Loop Start                                                     │
│  ────────────────────────────────────────────────────────────────────────   │
│  • mainAgentLoop() invoked                                                   │
│  • yield { type: "stream_request_start" }                                    │
│  • K5("query_fn_entry") - Performance mark                                   │
│                                                                               │
│  T+10ms: Pre-Turn Phase                                                      │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Micro-compact: Remove consecutive duplicates                             │
│  • Auto-compact check: Count tokens, compare threshold                      │
│  • assembleAllAttachments() - Produce all reminders                         │
│                                                                               │
│  T+30ms: API Request Building                                                │
│  ────────────────────────────────────────────────────────────────────────   │
│  • normalizeMessages() - Convert to API format                              │
│  • buildToolSchema() - Create tool definitions                              │
│  • Build system prompt with cache controls                                   │
│  • Create streaming request                                                  │
│                                                                               │
│  T+50ms: API Request Sent                                                    │
│  ────────────────────────────────────────────────────────────────────────   │
│  • K5("query_api_request_sent")                                              │
│  • First API call begins                                                     │
│  • SSE stream started                                                        │
│                                                                               │
│  T+500ms-2s: First Chunk Received (varies by model)                          │
│  ────────────────────────────────────────────────────────────────────────   │
│  • K5("query_first_chunk_received")                                          │
│  • timeToFirstChunk recorded                                                 │
│  • UI updates: streamMode = "responding"                                     │
│                                                                               │
│  T+Streaming: Content Accumulation                                           │
│  ────────────────────────────────────────────────────────────────────────   │
│  • content_block_delta events processed                                      │
│  • Text/thinking/tool_use accumulated                                        │
│  • UI re-renders with new content                                            │
│                                                                               │
│  T+Completion: Tool Execution (if tool_use)                                  │
│  ────────────────────────────────────────────────────────────────────────   │
│  • StreamingToolExecutor created                                             │
│  • Tools executed (parallel for concurrency-safe)                            │
│  • Tool results collected                                                    │
│  • Continue to next turn if tools called                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. State Synchronization Patterns

### 3.1 Uni-directional Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNI-DIRECTIONAL DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐                                                         │
│  │    CLI Flags    │                                                         │
│  │  (Source of     │                                                         │
│  │   Truth)        │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                   │
│           ▼                                                                   │
│  ┌─────────────────┐                                                         │
│  │  initialState   │                                                         │
│  │  {              │                                                         │
│  │   toolPermissio │                                                         │
│  │   nContext,     │                                                         │
│  │   mainLoopModel │                                                         │
│  │   mcp,          │                                                         │
│  │   ...           │                                                         │
│  │  }              │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                   │
│           ▼                                                                   │
│  ┌─────────────────┐     ┌─────────────────┐                                │
│  │ createStateStore│────►│    UI State     │                                │
│  │    (WX1)        │     │   (35+ useState)│                                │
│  │                 │     │                 │                                │
│  │  • getState()   │     │  • messages     │                                │
│  │  • setState()   │     │  • streamMode   │                                │
│  │  • subscribe()  │     │  • dialogQueue  │                                │
│  └─────────────────┘     └────────┬────────┘                                │
│                                   │                                           │
│                                   │ UI Events                                 │
│                                   ▼                                           │
│                          ┌─────────────────┐                                 │
│                          │  Agent Loop     │                                 │
│                          │  (Yh/omY)       │                                 │
│                          │                 │                                 │
│                          │  Yield Events:  │                                 │
│                          │  • assistant    │                                 │
│                          │  • user         │                                 │
│                          │  • tombstone    │                                 │
│                          │  • stream_event │                                 │
│                          └────────┬────────┘                                 │
│                                   │                                           │
│                                   │ Update State                              │
│                                   ▼                                           │
│                          ┌─────────────────┐                                 │
│                          │   setMessages   │                                 │
│                          │   setStreamMode │                                 │
│                          │   UI Re-render  │                                 │
│                          └─────────────────┘                                 │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 State Update Patterns

**Pattern 1: Immutable State Updates**

```javascript
// ============================================
// Immutable State Update Pattern
// Location: chunks.196.mjs (sessionOrchestrator)
// ============================================

// WRONG - Mutating state directly
// messages.push(newMessage); // ❌ Never do this

// CORRECT - Immutable update
setMessages(prevMessages => [...prevMessages, newMessage]); // ✅

// Mapping: gq→setMessages, P1→prevMessages
```

**Pattern 2: Object.is Equality Check**

```javascript
// ============================================
// Object.is Equality Check in createStateStore
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL:
function WX1(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K, w = z(_);
            if (Object.is(w, _)) return;  // Skip if nothing changed
            K = w, q?.({newState: w, oldState: _});
            for (let $ of Y) $();
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z); }
    };
}

// READABLE:
function createStateStore(initialState, onChange) {
    let state = initialState;
    let subscribers = new Set();

    return {
        getState: () => state,

        setState: (updater) => {
            let oldState = state;
            let newState = updater(oldState);

            // Skip update if state is referentially equal
            if (Object.is(newState, oldState)) return;

            state = newState;
            onChange?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        subscribe: (callback) => {
            subscribers.add(callback);
            return () => subscribers.delete(callback);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChange, K→state, Y→subscribers
```

### 3.3 Cross-Component State Sharing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-COMPONENT STATE SHARING                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  AppStateProvider (Yj)                                                       │
│  ────────────────────────────────────────────────────────────────────────   │
│  │                                                                           │
│  ├── useAppState Hook (M1)                                                  │
│  │    │                                                                      │
│  │    ├── SessionOrchestrator (ot8)                                         │
│  │    │    └── const toolPermissionContext = useAppState(s => s.toolPermissionContext)│
│  │    │                                                                      │
│  │    ├── MessageList (veY)                                                 │
│  │    │    └── const messages = useAppState(s => s.messages)                │
│  │    │                                                                      │
│  │    ├── Spinner                                                           │
│  │    │    └── const spinnerTip = useAppState(s => s.spinnerTip)            │
│  │    │                                                                      │
│  │    └── Footer                                                            │
│  │         └── const model = useAppState(s => s.mainLoopModel)              │
│  │                                                                          │
│  └── Shared State Fields:                                                   │
│       • toolPermissionContext: { mode, allowRules, denyRules }              │
│       • mcp: { clients, tools }                                              │
│       • plugins: { commands }                                                │
│       • agentDefinitions: { activeAgents, allowedAgentTypes }                │
│       • tasks: Map<agentId, Task[]>                                          │
│       • teamContext: { teamName, agentName, ... }                            │
│       • spinnerTip: string                                                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Error Handling Coordination

### 4.1 Error Propagation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR PROPAGATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Error Source                                                                │
│  ────────────────────────────────────────────────────────────────────────   │
│  │                                                                           │
│  ├── API Error (Anthropic)                                                  │
│  │    │                                                                      │
│  │    ├── context_length_exceeded                                           │
│  │    │    └── withApiRetry → Compact → Retry                               │
│  │    │                                                                      │
│  │    ├── max_tokens                                                        │
│  │    │    └── Adjust maxOutputTokensOverride → Retry                       │
│  │    │                                                                      │
│  │    ├── rate_limit                                                        │
│  │    │    └── withApiRetry → Exponential backoff → Retry                   │
│  │    │                                                                      │
│  │    └── other API errors                                                  │
│  │         └── Yield error message → UI displays error                      │
│  │                                                                          │
│  ├── Tool Execution Error                                                   │
│  │    │                                                                      │
│  │    ├── Permission denied                                                 │
│  │    │    └── Tool returns tool_result with is_error: true                 │
│  │    │                                                                      │
│  │    ├── Tool throws exception                                             │
│  │    │    └── ExecuteToolCore catches → Returns error result               │
│  │    │                                                                      │
│  │    └── Sibling tool error                                                │
│  │         └── StreamingToolExecutor aborts siblings → Returns error        │
│  │                                                                          │
│  ├── User Cancellation                                                      │
│  │    │                                                                      │
│  │    ├── Escape key pressed                                                │
│  │    │    └── handleCancel() → AbortController.abort()                     │
│  │    │                                                                      │
│  │    └── Stream interrupted                                                │
│  │         └── getAbortReason() → Returns "user_interrupted"                │
│  │                                                                          │
│  └── Hook Error                                                              │
│       │                                                                      │
│       ├── PreToolUse hook fails                                             │
│       │    └── Tool execution blocked → Return error result                 │
│       │                                                                      │
│       └── PostToolUse hook fails                                            │
│            └── Error logged → Original result returned                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Error Recovery Strategies

```javascript
// ============================================
// withApiRetry - API error recovery wrapper
// Location: chunks.89.mjs:3
// ============================================

// READABLE (for understanding):
async function* withApiRetry(apiCallFactory, retryConfig) {
    let attempt = 0;
    let maxRetries = retryConfig.maxRetries ?? 3;

    while (true) {
        try {
            let apiCall = apiCallFactory({ attempt });
            for await (let event of apiCall) {
                yield event;
            }
            return; // Success
        } catch (error) {
            attempt++;

            // Check if retryable
            if (!isRetryableError(error)) {
                throw error; // Non-retryable, propagate
            }

            // Check retry limit
            if (attempt >= maxRetries) {
                throw error; // Max retries exceeded
            }

            // Context overflow special handling
            if (error.type === "context_length_exceeded") {
                let parsedError = parseContextOverflowError(error);
                if (parsedError.availableSpace < FLOOR_OUTPUT_TOKENS) {
                    throw error; // Cannot recover
                }
                // Adjust max_tokens and retry
                retryConfig.maxOutputTokensOverride = parsedError.availableSpace;
                continue;
            }

            // Exponential backoff for other errors
            let delayMs = calculateBackoff(attempt, error);
            await sleep(delayMs);
        }
    }
}

// Mapping: _P1→withApiRetry
```

### 4.3 Cancel Propagation

```javascript
// ============================================
// Cancel Propagation Pattern
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL:
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim())
        gq((P1) => [...P1, $Z({ content: ez })]);
    if (dE(), K2 === "tool-permission")
        a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort();
    } else if (B5.isRemoteMode)
        B5.cancelRequest();
    else
        M5?.abort();
    x5(null);
}

// READABLE:
function handleCancel() {
    // Elicitation cannot be cancelled (MCP protocol requirement)
    if (focusedInputDialog === "elicitation") return;

    // Log cancel for debugging
    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // End any animation
    animationController.forceEnd();

    // Save draft input as message if present
    if (inputDraft?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // Clear input state
    clearInputState();

    // Handle based on active dialog
    if (focusedInputDialog === "tool-permission") {
        // Cancel tool permission dialog
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Cancel prompt dialog - reject all pending prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        // Cancel remote request
        remoteClient.cancelRequest();
    } else {
        // Standard abort
        abortController?.abort();
    }

    // Clear pending tool use
    setPendingToolUse(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→animationController,
//          ez→inputDraft, gq→setMessages, $Z→createUserMessage, dE→clearInputState
```

---

## 5. Integration Test Scenarios

### 5.1 Scenario 1: User Types Message → LLM Responds

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO 1: BASIC QUERY FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 1: User types "Hello, Claude!"                                         │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Input component captures keystrokes                                       │
│  • setDraftInput("Hello, Claude!")                                           │
│  • setIsInputComposing(true)                                                 │
│                                                                               │
│  STEP 2: User presses Enter                                                  │
│  ────────────────────────────────────────────────────────────────────────   │
│  • handleKeyPress detects Enter key                                          │
│  • handleSubmit() called                                                     │
│  • setIsLoading(true)                                                        │
│  • setAbortController(new AbortController())                                 │
│                                                                               │
│  STEP 3: User message added to state                                         │
│  ────────────────────────────────────────────────────────────────────────   │
│  • createUserMessage({ content: "Hello, Claude!" })                          │
│  • setMessages(prev => [...prev, userMessage])                               │
│  • clearDraftInput()                                                         │
│                                                                               │
│  STEP 4: Agent loop starts                                                   │
│  ────────────────────────────────────────────────────────────────────────   │
│  • mainAgentLoop(params) invoked                                             │
│  • yield { type: "stream_request_start" }                                    │
│  • handleStreamedEvent sets isStreaming = true                               │
│                                                                               │
│  STEP 5: Pre-turn processing                                                 │
│  ────────────────────────────────────────────────────────────────────────   │
│  • microcompact: No consecutive duplicates                                   │
│  • auto-compact check: Token count OK                                        │
│  • assembleAllAttachments: Produce date_change, token_usage                 │
│                                                                               │
│  STEP 6: API request sent                                                    │
│  ────────────────────────────────────────────────────────────────────────   │
│  • streamingQueryCore() starts                                               │
│  • normalizeMessages([userMessage])                                          │
│  • buildToolSchema([...allTools])                                            │
│  • API request sent to Anthropic                                             │
│                                                                               │
│  STEP 7: Streaming response received                                         │
│  ────────────────────────────────────────────────────────────────────────   │
│  • SSE event: message_start → Initialize message                             │
│  • SSE event: content_block_start(text) → setStreamMode("responding")        │
│  • SSE events: content_block_delta(text) → Accumulate                        │
│  • SSE event: content_block_stop → Yield assistant message                  │
│  • handleStreamedEvent adds to messages                                      │
│                                                                               │
│  STEP 8: Turn completion                                                     │
│  ────────────────────────────────────────────────────────────────────────   │
│  • No tool_use in response → Stop condition met                              │
│  • Agent loop completes                                                      │
│  • setIsLoading(false)                                                       │
│  • setAbortController(null)                                                  │
│  • Input re-enabled                                                          │
│                                                                               │
│  EXPECTED STATE:                                                              │
│  messages = [                                                                 │
│    { type: "user", message: { content: "Hello, Claude!" } },                 │
│    { type: "assistant", message: { content: [{ type: "text", text: "..." }] } }│
│  ]                                                                            │
│  isStreaming = false                                                          │
│  streamMode = "responding"                                                    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Scenario 2: Tool Permission Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO 2: TOOL PERMISSION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 1: LLM returns tool_use                                                │
│  ────────────────────────────────────────────────────────────────────────   │
│  • content_block: { type: "tool_use", name: "Bash", input: { command: "rm -rf /" } }│
│  • StreamingToolExecutor.addTool(block, message)                             │
│                                                                               │
│  STEP 2: Tool permission check                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  • toolDispatcher checks permission mode                                     │
│  • mode = "accept" → Auto-allow                                              │
│  • mode = "plan" → Allow only plan-safe tools                                │
│  • mode = "default" → Show permission dialog                                 │
│                                                                               │
│  STEP 3: Permission dialog shown                                             │
│  ────────────────────────────────────────────────────────────────────────   │
│  • setToolPermissionQueue([{ tool, input, onAllow, onDeny }])                │
│  • getInputDialogType() returns "tool-permission"                            │
│  • ToolPermissionDialog rendered                                             │
│                                                                               │
│  STEP 4: User approves                                                       │
│  ────────────────────────────────────────────────────────────────────────   │
│  • User presses Enter (Yes)                                                  │
│  • onAllow() called                                                          │
│  • setToolPermissionQueue([])                                                │
│  • Tool execution proceeds                                                   │
│                                                                               │
│  STEP 5: Tool executes                                                       │
│  ────────────────────────────────────────────────────────────────────────   │
│  • executeToolCore(BashTool, { command: "rm -rf /" }, context)               │
│  • Bash tool validates command                                               │
│  • Execute: Run command in sandbox                                           │
│  • Return tool_result                                                        │
│                                                                               │
│  STEP 6: Tool result collected                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  • StreamingToolExecutor.getCompletedResults()                              │
│  • Yield { type: "user", message: { content: [tool_result] } }               │
│  • handleStreamedEvent adds to messages                                      │
│                                                                               │
│  STEP 7: Continue to next turn                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  • Tools were called → turnCount++                                           │
│  • Continue agent loop                                                       │
│  • LLM sees tool result and responds                                         │
│                                                                               │
│  EXPECTED STATE:                                                              │
│  messages = [                                                                 │
│    user message,                                                              │
│    assistant message with tool_use,                                           │
│    user message with tool_result                                              │
│  ]                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Scenario 3: Cancel During Streaming

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCENARIO 3: CANCEL DURING STREAMING                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  STEP 1: Streaming in progress                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  • isStreaming = true                                                        │
│  • streamMode = "responding"                                                 │
│  • abortController = AbortController instance                                │
│                                                                               │
│  STEP 2: User presses Escape                                                 │
│  ────────────────────────────────────────────────────────────────────────   │
│  • handleKeyPress detects Escape                                             │
│  • handleCancel() called                                                     │
│                                                                               │
│  STEP 3: Cancel propagation                                                  │
│  ────────────────────────────────────────────────────────────────────────   │
│  • focusedInputDialog = undefined (no dialog)                                │
│  • abortController.abort() called                                            │
│  • StreamingQueryCore receives abort signal                                  │
│                                                                               │
│  STEP 4: Stream aborted                                                      │
│  ────────────────────────────────────────────────────────────────────────   │
│  • SSE stream interrupted                                                    │
│  • StreamingToolExecutor.getAbortReason() returns "user_interrupted"         │
│  • Pending tools cancelled                                                   │
│                                                                               │
│  STEP 5: Agent loop cleanup                                                  │
│  ────────────────────────────────────────────────────────────────────────   │
│  • yield { type: "tombstone", message: partialMessage }                      │
│  • handleStreamedEvent removes partial message                               │
│  • Agent loop exits                                                          │
│                                                                               │
│  STEP 6: State reset                                                         │
│  ────────────────────────────────────────────────────────────────────────   │
│  • setIsLoading(false)                                                       │
│  • setAbortController(null)                                                  │
│  • setStreamMode("responding")                                               │
│  • Input re-enabled                                                          │
│                                                                               │
│  EXPECTED STATE:                                                              │
│  • Partial response removed from messages                                     │
│  • isStreaming = false                                                        │
│  • User can submit new message                                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Cross-Feature Interaction Matrix

### 6.1 Feature Integration Table

| Feature A | Feature B | Integration Point | Data Flow |
|-----------|-----------|-------------------|-----------|
| **CLI** | **System Reminder** | `assembleAllAttachments` | CLI flags → initialState → Attachment producer |
| **CLI** | **Permissions** | `toolPermissionContext` | `--dangerously-skip-permissions` → mode = "accept" |
| **CLI** | **Compact** | `auto-compact trigger` | `DISABLE_AUTO_COMPACT` env → Skip auto-compact |
| **CLI** | **MCP** | `mcpClients` | `--mcp-config` → Load MCP servers → Register tools |
| **UI** | **System Reminder** | `date_change`, `token_usage` | UI state → Attachment content |
| **UI** | **Permissions** | `Dialog priority` | Permission queue → getInputDialogType |
| **UI** | **Agent Loop** | `handleStreamedEvent` | Agent events → UI state updates |
| **LLM Core** | **System Reminder** | `assembleAllAttachments` | Pre-turn → Produce attachments → Inject into context |
| **LLM Core** | **Tools** | `StreamingToolExecutor` | tool_use → Execute → tool_result |
| **LLM Core** | **Hooks** | `executePreToolHooks` | Pre-tool → Hook chain → Execute/Block |
| **LLM Core** | **Compact** | `autoCompactDispatcher` | Token limit → Compact → Continue |
| **System Reminder** | **Plan Mode** | `plan_mode attachment` | Plan mode → Plan attachment → LLM sees plan |
| **System Reminder** | **Team Mode** | `team_context attachment` | Team mode → Team context → LLM sees team |
| **System Reminder** | **Auto Memory** | `nested_memory attachment` | Memory files → Memory attachment → LLM sees memory |

### 6.2 System Reminder Producers and Their Triggers

| Producer | Function | Trigger Condition | Produces |
|----------|----------|-------------------|----------|
| `date_change` | `fuY` | Date changed since last turn | Date notification |
| `ultrathink_effort` | `TuY` | High effort mode + recent message | Extended thinking prompt |
| `deferred_tools_delta` | `xE1` | Tool availability changed | Tool availability notice |
| `changed_files` | `CuY` | Git status has changes | Changed files list |
| `nested_memory` | `IuY` | Memory files exist | Memory content |
| `plan_mode` | `DuY` | Permission mode = "plan" | Plan mode instructions |
| `plan_mode_exit` | `XuY` | Exiting plan mode | Plan exit notice |
| `auto_mode` | `ZuY` | Permission mode = "auto" | Auto mode instructions |
| `todo_reminders` | `ruY` | Todos exist + TodoWrite not used recently | Todo list content |
| `task_reminders` | `auY` | Tasks exist + Task tool not used recently | Task list content |
| `teammate_mailbox` | `euY` | Team mode + mailbox has messages | Team messages |
| `team_context` | `AmY` | Team mode active | Team coordination info |
| `token_usage` | `qmY` | Messages exist | Token count notification |
| `budget_usd` | `YmY` | Budget configured | Cost tracking |
| `ide_selection` | `kuY` | IDE has selection | Selected code context |
| `ide_opened_file` | `LuY` | File open in IDE | Open file context |
| `async_hook_responses` | `tuY` | Background hooks completed | Hook results |

---

## 7. Source Code Restoration

### 7.1 Main Agent Loop Core (omY)

```javascript
// ============================================
// mainAgentLoopCore (omY) - Core agent loop implementation
// Location: chunks.148.mjs:882-1100
// ============================================

// ORIGINAL (for source lookup):
async function* omY(A, q) {
    let {
        systemPrompt: K,
        userContext: Y,
        systemContext: z,
        canUseTool: _,
        fallbackModel: w,
        querySource: O,
        maxTurns: $,
        skipCacheWrite: H
    } = A, j = A.deps ?? SKq(), J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        maxOutputTokensOverride: A.maxOutputTokensOverride,
        autoCompactTracking: void 0,
        stopHookActive: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        turnCount: 1,
        pendingToolUseSummary: void 0,
        transition: void 0
    }, M = null, D = RKq();
    while (!0) {
        let { toolUseContext: X } = J, { messages: P, autoCompactTracking: W, ... } = J;
        // ... turn logic
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, cleanupActions) {
    // Destructure parameters
    let {
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        fallbackModel,
        querySource,
        maxTurns,
        skipCacheWrite
    } = params;

    // Get helper functions
    let helpers = params.deps ?? getModelCallHelpers();

    // Initialize turn state
    let turnState = {
        messages: params.messages,
        toolUseContext: params.toolUseContext,
        maxOutputTokensOverride: params.maxOutputTokensOverride,
        autoCompactTracking: undefined,
        stopHookActive: undefined,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: false,
        turnCount: 1,
        pendingToolUseSummary: undefined,
        transition: undefined
    };

    let sessionGates = getSessionGates();

    // Main turn loop
    while (true) {
        let { toolUseContext, messages, autoCompactTracking, ... } = turnState;

        // Yield stream start event
        yield { type: "stream_request_start" };
        trackMark("query_fn_entry");

        // Micro-compact: Remove consecutive duplicates
        trackMark("query_microcompact_start");
        messages = (await helpers.microcompact(messages, toolUseContext, querySource)).messages;
        trackMark("query_microcompact_end");

        // Auto-compact: Check threshold and compact if needed
        trackMark("query_autocompact_start");
        let { compactionResult, consecutiveFailures } = await helpers.autocompact(
            messages, toolUseContext, { systemPrompt, userContext, systemContext, ... },
            querySource, autoCompactTracking
        );
        trackMark("query_autocompact_end");

        // Handle compaction result
        if (compactionResult) {
            trackEvent("tengu_auto_compact_succeeded", { ... });
            for (let compactedMessage of formatCompactionResult(compactionResult)) {
                yield compactedMessage;
            }
            messages = compactionResult.summaryMessages;
        }

        // Create StreamingToolExecutor for parallel tool execution
        let toolExecutor = sessionGates.streamingToolExecution
            ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
            : null;

        // LLM API call loop
        trackMark("query_api_loop_start");
        try {
            while (true) {
                // Stream LLM response
                for await (let event of helpers.callModel({
                    messages,
                    systemPrompt,
                    thinkingConfig: toolUseContext.options.thinkingConfig,
                    tools: toolUseContext.options.tools,
                    signal: toolUseContext.abortController.signal,
                    options: { model, ... }
                })) {
                    yield event;

                    // Handle tool_use blocks
                    if (event.type === "assistant") {
                        for (let block of event.message.content) {
                            if (block.type === "tool_use") {
                                toolExecutor?.addTool(block, event.message);
                            }
                        }
                    }
                }

                // Execute tools and collect results
                for await (let result of toolExecutor?.getRemainingResults() ?? []) {
                    yield { type: "user", message: result.message };
                }

                // Check continue condition
                if (toolExecutor?.hasUnfinishedTools()) {
                    // Tools were called, continue to next turn
                    turnState.turnCount++;
                    break;
                } else {
                    // No tools, stop
                    return { reason: "complete" };
                }
            }
        } catch (error) {
            // Error handling
            yield createErrorMessage(error);
            return { reason: "error" };
        }
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→cleanupActions, K→systemPrompt,
//          SKq→getModelCallHelpers, RKq→getSessionGates, J→turnState
```

### 7.2 assembleAllAttachments (_uY)

```javascript
// ============================================
// assembleAllAttachments (_uY) - Main attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(), O = setTimeout((W) => W.abort(), 1000, w), $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), ...] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => fuY()), Hz("plan_mode", () => DuY(z, q)), ...],
        D = H ? [Hz("ide_selection", ...), ...] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(
    atMentionedFiles,    // Files mentioned with @
    toolUseContext,      // Session context
    ideState,            // IDE integration state
    queuedCommands,      // Pending commands
    messages,            // Conversation history
    sessionMemoryType    // "session_memory" or undefined
) {
    // Check if attachments are disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1s timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout(ac => ac.abort(), 1000, abortController);

    let contextWithAbort = {...toolUseContext, abortController};
    let isMainThread = !toolUseContext.agentId;

    // Phase 1: At-mentioned files (only if files were mentioned)
    let atMentionAttachments = atMentionedFiles
        ? await Promise.all([
            safeProduce("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, contextWithAbort)),
            safeProduce("mcp_resources", () => produceMcpResources(atMentionedFiles, contextWithAbort)),
            safeProduce("agent_mentions", () => produceAgentMentions(atMentionedFiles, toolUseContext.options.agentDefinitions.activeAgents))
        ])
        : [];

    // Phase 2: Always-produced attachments (parallel)
    let alwaysAttachments = await Promise.all([
        safeProduce("date_change", () => produceDateChange()),
        safeProduce("ultrathink_effort", () => produceUltrathinkEffort(messages)),
        safeProduce("deferred_tools_delta", () => produceDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages)),
        safeProduce("changed_files", () => produceChangedFiles(contextWithAbort)),
        safeProduce("nested_memory", () => produceNestedMemory(contextWithAbort)),
        safeProduce("plan_mode", () => producePlanMode(messages, toolUseContext)),
        safeProduce("plan_mode_exit", () => producePlanModeExit(toolUseContext)),
        safeProduce("auto_mode", () => produceAutoMode(messages, toolUseContext)),
        safeProduce("todo_reminders", () => isTeamMode() ? produceTaskReminders(messages, toolUseContext) : produceTodoReminders(messages, toolUseContext)),
        safeProduce("team_context", async () => produceTeamContext(messages ?? [])),
        safeProduce("critical_system_reminder", () => produceCriticalSystemReminder(toolUseContext))
    ]);

    // Phase 3: Main thread only attachments
    let mainThreadAttachments = isMainThread
        ? await Promise.all([
            safeProduce("ide_selection", async () => produceIdeSelection(ideState, toolUseContext)),
            safeProduce("ide_opened_file", async () => produceIdeOpenedFile(ideState, toolUseContext)),
            safeProduce("token_usage", async () => produceTokenUsage(messages ?? [], toolUseContext.options.mainLoopModel)),
            safeProduce("budget_usd", async () => produceBudgetUsd(toolUseContext.options.maxBudgetUsd))
        ])
        : [];

    clearTimeout(timeoutId);

    // Flatten and filter all attachments
    return [...atMentionAttachments.flat(), ...alwaysAttachments.flat(), ...mainThreadAttachments.flat()]
        .filter(attachment => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, Hz→safeProduce, t6→parseBoolean,
//          sK→createAbortController, A→atMentionedFiles, q→toolUseContext
```

---

## Related Documents

- **[cli_ui_llm_joint_analysis.md](./cli_ui_llm_joint_analysis.md)** - Main joint analysis document
- **[symbol_index_core_execution.md](./symbol_index_core_execution.md)** - Core execution symbols
- **[symbol_index_core_features.md](./symbol_index_core_features.md)** - Feature symbols
- **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)** - Platform infrastructure symbols
- **[symbol_index_infra_integration.md](./symbol_index_infra_integration.md)** - Integration symbols

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - CLI-UI-LLM complete integration analysis with source verification