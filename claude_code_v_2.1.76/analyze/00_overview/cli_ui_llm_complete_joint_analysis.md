# CLI-UI-LLM Core Complete Joint Analysis (Claude Code v2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.

---

## Table of Contents

1. [Symbol Verification Report](#1-symbol-verification-report)
2. [Architecture Overview](#2-architecture-overview)
3. [Source-Level Code Restoration](#3-source-level-code-restoration)
4. [StreamingToolExecutor Algorithm](#4-streamingtoolexecutor-algorithm)
5. [Agent Loop Turn State Machine](#5-agent-loop-turn-state-machine)
6. [UI State Machine Architecture](#6-ui-state-machine-architecture)
7. [Dialog Priority System](#7-dialog-priority-system)
8. [Cross-Feature Integration](#8-cross-feature-integration)
9. [System Reminder Integration](#9-system-reminder-integration)
10. [Key Algorithms with Decision Reasoning](#10-key-algorithms-with-decision-reasoning)

---

## 1. Symbol Verification Report

### 1.1 CLI Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| JVz | cliEntry | chunks.198.mjs:1573 | `async function JVz()` | ✅ Verified |
| OVz | run | chunks.198.mjs:3 | `async function OVz()` | ✅ Verified |
| _Vz | mainEntry | chunks.197.mjs:1910 | `async function _Vz()` | ✅ Verified |
| WX1 | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ Verified |
| Ez | permissionContextReducer | chunks.53.mjs:1224 | `function Ez(A, q)` | ✅ Verified |

### 1.2 UI Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| ot8 | sessionOrchestrator | chunks.196.mjs:3 | `function ot8({...})` | ✅ Verified |
| ra6 | getInputDialogType | chunks.196.mjs:387 | `function ra6()` | ✅ Verified |
| TM | handleCancel | chunks.196.mjs:420 | `function TM()` | ✅ Verified |

### 1.3 LLM Core Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ Verified |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ Verified |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | `class ui6` | ✅ Verified |
| mGq | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(...)` | ✅ Verified |

---

## 2. Architecture Overview

### 2.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLI TIER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Entry Points                                  │    │
│  │  cliEntry (JVz) → mainEntry (_Vz) → run (OVz)                       │    │
│  │                                                                       │    │
│  │  Responsibilities:                                                   │    │
│  │  • Process argv parsing and routing                                  │    │
│  │  • Feature flag detection (--mcp-cli, --chrome-native-host, etc.)   │    │
│  │  • Environment setup                                                 │    │
│  │  • Initial state construction (~35 fields)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UI TIER                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    React/Ink Components                              │    │
│  │  sessionOrchestrator (ot8) → REPL → MessageList/Input               │    │
│  │                                                                       │    │
│  │  State Management:                                                   │    │
│  │  • createStateStore (WX1) - Observable state store                  │    │
│  │  • Stream mode state machine (prompt→requesting→thinking→...)        │    │
│  │  • Dialog priority system (13+ dialog types)                        │    │
│  │                                                                       │    │
│  │  Event Handling:                                                     │    │
│  │  • getInputDialogType (ra6) - Dialog dispatcher                     │    │
│  │  • handleCancel (TM) - Cancel propagation                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            LLM CORE TIER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Agent Loop                                    │    │
│  │  mainAgentLoop (Yh) → mainAgentLoopCore (omY)                       │    │
│  │                                                                       │    │
│  │  Components:                                                         │    │
│  │  • StreamingToolExecutor (ui6) - Parallel tool execution            │    │
│  │  • streamingQueryCore (mGq) - SSE event processing                  │    │
│  │  • Turn state machine - Conversation turn management                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Complete Request Flow

```
User Input (Keyboard/Pipe)
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. CLI ENTRY PHASE                                                        │
│    cliEntry (JVz) - chunks.198.mjs:1573                                   │
│    ├─ Fast path: --version → print and exit                              │
│    ├─ Subcommand routing: --mcp-cli, --ripgrep, auth, etc.               │
│    └─ Lazy import: main() → mainEntry (_Vz)                              │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. INITIALIZATION PHASE                                                   │
│    run (OVz) - chunks.198.mjs:3                                           │
│    ├─ Commander.js setup with flags                                      │
│    ├─ Build initialState (~35 fields)                                    │
│    ├─ Permission context building                                         │
│    └─ Render REPL via Ink                                                │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 3. UI RENDER PHASE                                                        │
│    sessionOrchestrator (ot8) - chunks.196.mjs:3                           │
│    ├─ createStateStore (WX1) with initialState                           │
│    ├─ Stream mode: "prompt" (waiting for input)                          │
│    └─ PromptInput component ready                                         │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 4. AGENT LOOP PHASE                                                       │
│    mainAgentLoopCore (omY) - chunks.148.mjs:882                           │
│    ├─ Turn state initialization                                          │
│    ├─ Microcompact: Remove consecutive duplicates                        │
│    ├─ Autocompact: Check token threshold                                 │
│    ├─ Build tool schemas                                                 │
│    ├─ Create StreamingToolExecutor                                       │
│    ├─ streamingQueryCore: LLM API request                                │
│    └─ Yield events as they arrive                                        │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 5. TOOL EXECUTION PHASE                                                   │
│    StreamingToolExecutor (ui6) - chunks.148.mjs:3                         │
│    ├─ Collect tool_use blocks from streaming                             │
│    ├─ canExecuteTool() check for concurrency safety                     │
│    ├─ Execute parallel for safe tools (Read, Grep, Glob)                │
│    ├─ Execute sequential for unsafe tools (Write, Edit, Bash)           │
│    └─ Yield tool results                                                 │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Source-Level Code Restoration

### 3.1 CLI Entry (cliEntry - JVz)

**What it does**: Top-level entry point with subcommand routing and lazy loading.

**Why this approach**:
- Fast path for `--version` without any imports minimizes cold-start latency
- Subcommand routing before main load enables lightweight operations

```javascript
// ============================================
// cliEntry (JVz) - Top-level CLI entry point
// Location: chunks.198.mjs:1573-1578
// ============================================

// ORIGINAL (for source lookup):
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }
    // ... early dispatch for --mcp-cli, --ripgrep, etc.
    await main();
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // Fast path: version check without loading main module
    if (args.length === 1 &&
        (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Subcommand routing for utility modes
    if (args.includes("--mcp-cli")) {
        return runMcpCli();
    }
    if (args.includes("--ripgrep")) {
        return runRipgrep();
    }
    if (args[0] === "auth") {
        return runAuthCommand(args.slice(1));
    }

    // Main entry
    await main();
}

// Mapping: JVz→cliEntry, A→args
```

### 3.2 State Store Factory (createStateStore - WX1)

**What it does**: Creates an observable state store with subscription support.

**Why this approach**:
- Immutable state updates prevent accidental mutations
- Subscription pattern enables React-like reactivity without React dependency
- Shallow equality check prevents unnecessary notifications

```javascript
// ============================================
// createStateStore (WX1) - Observable state store factory
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL (for source lookup):
function WX1(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K, w = z(_);
            if (Object.is(w, _)) return;
            K = w, q?.({newState: w, oldState: _});
            for (let $ of Y) $();
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z); }
    };
}

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        // Get current state snapshot
        getState: () => currentState,

        // Update state with immutability
        setState: (updater) => {
            let oldState = currentState;
            let newState = updater(oldState);

            // Skip if nothing changed (shallow equality)
            if (Object.is(newState, oldState)) return;

            currentState = newState;

            // Notify external callback (for debugging/logging)
            onChangeCallback?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        // Subscribe to state changes
        subscribe: (callback) => {
            subscribers.add(callback);
            // Return unsubscribe function
            return () => subscribers.delete(callback);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater
```

---

## 4. StreamingToolExecutor Algorithm

### 4.1 Class Structure

**What it does**: Manages parallel and sequential tool execution during LLM streaming.

**Why this approach**:
- Parallel execution for concurrency-safe tools improves performance
- Sequential execution for unsafe tools prevents race conditions
- Sibling abort pattern isolates errors without affecting unrelated tools

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
    // ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;      // Map of tool name → tool definition
    canUseTool;           // Permission checker function
    tools = [];           // Queue of tool executions
    toolUseContext;       // Session context (abort controller, etc.)
    hasErrored = false;   // Circuit breaker flag
    erroredToolDescription = "";  // For error messages
    siblingAbortController;       // Cloned abort for sibling isolation
    discarded = false;    // Cleanup flag
    progressAvailableResolve;     // Progress notification resolver

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone abort controller for sibling abort isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    // Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool,
    //          K→toolUseContext, Wm→cloneAbortController
}
```

### 4.2 Parallel vs Sequential Decision

**Key algorithm**: `canExecuteTool(isConcurrencySafe)`

```javascript
// ============================================
// canExecuteTool - Concurrency safety decision
// Location: chunks.148.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    let executingTools = this.tools.filter((tool) => tool.status === "executing");

    // CASE 1: Nothing executing → Allow any tool
    if (executingTools.length === 0) {
        return true;
    }

    // CASE 2: Tool is concurrency-safe AND all executing are safe → Allow parallel
    if (isConcurrencySafe && executingTools.every((tool) => tool.isConcurrencySafe)) {
        return true;  // Parallel execution allowed
    }

    // CASE 3: Unsafe tool or mix of safe/unsafe → Wait for queue to clear
    return false;  // Sequential execution required
}

// Mapping: A→isConcurrencySafe, q→executingTools, K→tool
```

**Why this approach**:
- **Read, Grep, Glob** are concurrency-safe: they don't modify state
- **Write, Edit, Bash** are NOT concurrency-safe: they modify files/state
- Safety is determined by calling `tool.isConcurrencySafe(input)` with parsed input

### 4.3 Sibling Abort Mechanism

**What it does**: When one tool fails, abort sibling tools but not the parent request.

```javascript
// ============================================
// getAbortReason - Determine if tool should be aborted
// Location: chunks.148.mjs:107-115
// ============================================

// ORIGINAL (for source lookup):
getAbortReason(A) {
    if (this.discarded) return "streaming_fallback";
    if (this.hasErrored) return "sibling_error";
    if (this.toolUseContext.abortController.signal.aborted) {
        if (this.toolUseContext.abortController.signal.reason === "interrupt")
            return this.getToolInterruptBehavior(A) === "cancel" ? "user_interrupted" : null;
        return "user_interrupted"
    }
    return null
}

// READABLE (for understanding):
getAbortReason(toolEntry) {
    // PRIORITY 1: Entire executor discarded (LLM streaming fallback)
    if (this.discarded) {
        return "streaming_fallback";
    }

    // PRIORITY 2: Another tool errored → Abort this sibling
    if (this.hasErrored) {
        return "sibling_error";
    }

    // PRIORITY 3: User-initiated abort
    if (this.toolUseContext.abortController.signal.aborted) {
        // Check if tool can be interrupted mid-execution
        if (this.toolUseContext.abortController.signal.reason === "interrupt") {
            return this.getToolInterruptBehavior(toolEntry) === "cancel"
                ? "user_interrupted"
                : null;  // Tool doesn't support cancel, let it finish
        }
        return "user_interrupted";
    }

    return null;  // No abort reason, continue execution
}

// Mapping: A→toolEntry
```

---

## 5. Agent Loop Turn State Machine

### 5.1 Turn State Object

**What it does**: Contains all mutable state for a single conversation turn.

```javascript
// ============================================
// Turn State Object - MainAgentLoopCore state
// Location: chunks.148.mjs:892-903
// ============================================

// ORIGINAL (for source lookup):
let J = {
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
};

// READABLE (for understanding):
let turnState = {
    // From parameters (immutable for turn)
    messages: params.messages,                    // Conversation history
    toolUseContext: params.toolUseContext,        // Permission/session context
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit

    // Turn-local mutable state
    autoCompactTracking: undefined,               // Compaction state tracking
    stopHookActive: undefined,                    // Hook control flag
    maxOutputTokensRecoveryCount: 0,              // Retry counter for max_tokens
    hasAttemptedReactiveCompact: false,           // Compact flag
    turnCount: 1,                                 // Current turn number
    pendingToolUseSummary: undefined,             // Tool result summary
    transition: undefined                         // Mode transition state
};

// Mapping: J→turnState, A→params
```

### 5.2 Main Agent Loop Core

```javascript
// ============================================
// mainAgentLoopCore (omY) - Core agent loop implementation
// Location: chunks.148.mjs:882-1069
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
        // ... turn state initialization
    };
    while (!0) {
        // Turn loop implementation
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, hookResults) {
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

    // Main turn loop
    while (true) {
        let { toolUseContext } = turnState;

        // 1. Yield stream_request_start event
        yield { type: "stream_request_start" };

        // 2. Microcompact: Remove consecutive duplicate messages
        turnState.messages = await helpers.microcompact(
            turnState.messages,
            toolUseContext,
            querySource
        ).messages;

        // 3. Autocompact: Check token threshold
        let { compactionResult, consecutiveFailures } = await helpers.autocompact(
            turnState.messages,
            toolUseContext,
            { systemPrompt, userContext, systemContext },
            querySource,
            turnState.autoCompactTracking
        );

        if (compactionResult) {
            for (let msg of compactionResult.summaryMessages) {
                yield msg;
            }
            turnState.messages = compactionResult.messages;
        }

        // 4. Create StreamingToolExecutor
        let toolExecutor = gates.streamingToolExecution
            ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
            : null;

        // 5. Call LLM API
        for await (let event of helpers.callModel({
            messages: turnState.messages,
            systemPrompt,
            tools: toolUseContext.options.tools,
            signal: toolUseContext.abortController.signal,
        })) {
            // Process tool_use blocks
            if (event.message?.content?.some(block => block.type === "tool_use")) {
                for (let block of event.message.content) {
                    if (block.type === "tool_use") {
                        toolExecutor.addTool(block, event.message);
                    }
                }
            }
            yield event;
        }

        // 6. Execute tools
        for await (let result of toolExecutor.getRemainingResults()) {
            yield result;
        }

        // 7. Check turn continuation
        if (toolExecutor.tools.length === 0) {
            break;  // No tools called → End turn
        }

        turnState.turnCount++;
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→hookResults
```

---

## 6. UI State Machine Architecture

### 6.1 Stream Mode States

```javascript
// ============================================
// Stream Mode State - LLM interaction phases
// Location: chunks.196.mjs:47
// ============================================

// ORIGINAL (for source lookup):
let [k6, ZY] = N8.useState("prompt");

// READABLE (for understanding):
let [streamMode, setStreamMode] = useState("prompt");

// Possible values:
type StreamMode =
    | "prompt"       // Waiting for user input
    | "requesting"   // Building request, not yet sent
    | "responding"   // LLM streaming text response
    | "thinking"     // LLM in extended thinking mode
    | "tool-input"   // LLM streaming tool_use input
    | "tool-use";    // Tool executing, waiting for result

// Mapping: k6→streamMode, ZY→setStreamMode, N8→React
```

### 6.2 State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────┐                                    │
│                          │   prompt    │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     User submits message                                    │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ requesting  │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                     LLM response starts                                     │
│                                 │                                           │
│                    ┌────────────┴────────────┐                             │
│                    │                         │                              │
│                    ▼                         ▼                              │
│             ┌─────────────┐          ┌─────────────┐                       │
│             │ responding  │          │  thinking   │                       │
│             └──────┬──────┘          └──────┬──────┘                       │
│                    │                         │                              │
│         Text streaming            Thinking streaming                        │
│                    │                         │                              │
│                    └────────────┬────────────┘                             │
│                                 │                                           │
│                   Tool_use block starts                                      │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ tool-input  │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│                Tool input JSON complete                                      │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │  tool-use   │                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│               ┌─────────────────┴─────────────────┐                        │
│               │                                   │                         │
│               ▼                                   ▼                         │
│        More tools?                           No more tools                  │
│               │                                   │                         │
│               │                                   ▼                         │
│               │                            ┌─────────────┐                  │
│               │                            │   prompt    │                  │
│               └───────────────────────────►└─────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Dialog Priority System

### 7.1 Dialog Types and Priorities

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// READABLE (for understanding):
function getInputDialogType() {
    // HIGHEST PRIORITY: Blocking states
    if (isConfirmingAction || hasBlockingDialog) {
        return undefined;  // No dialog allowed
    }

    // PRIORITY 1: Message selector (multi-message selection mode)
    if (isMessageSelectorVisible) {
        return "message-selector";
    }

    // BLOCKING: Loading state
    if (isLoading) {
        return undefined;  // No dialog during loading
    }

    // PRIORITY 2: Sandbox permission (network access - security critical)
    if (sandboxPermissionQueue[0]) {
        return "sandbox-permission";
    }

    // PRIORITY 3: Tool permission (tool execution - security critical)
    if (toolPermissionQueue[0]) {
        return "tool-permission";
    }

    // PRIORITY 4: Prompt request (MCP/user input prompt)
    if (promptQueue[0]) {
        return "prompt";
    }

    // PRIORITY 5: Worker sandbox permission
    if (workerSandboxPermissionQueue[0]) {
        return "worker-sandbox-permission";
    }

    // PRIORITY 6: Elicitation (MCP form requests)
    if (elicitationQueue[0]) {
        return "elicitation";
    }

    // PRIORITY 7: Cost warning
    if (costWarningQueue[0]) {
        return "cost";
    }

    // PRIORITY 8-12: Onboarding, callouts, recommendations
    // ...

    return undefined;  // No dialog to show
}

// Mapping: ra6→getInputDialogType
```

**Why this priority ordering**:
1. **Message selector** - User is actively selecting messages, must complete or cancel
2. **Sandbox permission** - Security critical, blocks network access
3. **Tool permission** - Security critical, blocks tool execution
4. **Prompt** - Tool-initiated prompts need user response
5. **Elicitation** - MCP server requests
6. **Cost warning** - Budget threshold reached
7. **Onboarding/recommendations** - Non-blocking UX improvements

---

## 8. Cross-Feature Integration

### 8.1 CLI → UI → LLM Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → UI → LLM INTEGRATION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                         UI Layer                  LLM Layer       │
│  ──────────                        ─────────                 ─────────       │
│                                                                              │
│  ┌───────────────┐               ┌───────────────┐        ┌──────────────┐ │
│  │ CLI Flags     │               │ sessionOrch.  │        │ mainAgentLoop│ │
│  │               │               │ (ot8)         │        │ (Yh)         │ │
│  │ --model       │ ────────────► │ createState   │ ────► │ callModel    │ │
│  │ --print       │               │ Store (WX1)   │        │              │ │
│  │ --plan        │               │               │        │ yields events│ │
│  │ --dangerously │               │ setStreamMode │        └──────┬───────┘ │
│  │ -skip-perm    │               │               │               │         │
│  └───────────────┘               └───────┬───────┘               │         │
│                                          │                       │         │
│                                          ▼                       │         │
│                                  ┌───────────────┐               │         │
│                                  │ handleStream  │ ◄─────────────┘         │
│                                  │ edEvent       │                        │
│                                  └───────────────┘                        │
│                                                                              │
│  Data Flow:                                                                  │
│  1. CLI flags parsed → initial state built                                 │
│  2. Initial state → createStateStore → UI render                           │
│  3. User input → mainAgentLoop called                                      │
│  4. mainAgentLoop yields events → UI state updates                         │
│  5. Turn complete → streamMode reset to "prompt"                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Permission Context Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION CONTEXT FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flags                         Permission Layer         Tool Filter     │
│  ──────────                        ────────────────         ───────────     │
│                                                                              │
│  ┌───────────────┐               ┌───────────────┐        ┌──────────────┐ │
│  │ --dangerously │               │ permissionCtx │        │ filterTools  │ │
│  │ -skip-perm    │ ────────────► │ Reducer (Ez)  │ ────► │ ByMode (Xk8) │ │
│  │               │               │               │        │              │ │
│  │ --allowed     │               │ mode:         │        │ Excludes:    │ │
│  │ -tools        │               │ • default     │        │ • EXCLUDED   │ │
│  │               │               │ • plan        │        │ • NON_BUILTIN│ │
│  │ --disallowed  │               │ • auto        │        │              │ │
│  │ -tools        │               │ • bypass      │        │ Includes:    │ │
│  │               │               │               │        │ • mcp__*     │ │
│  │ --permission  │               │ rules:        │        │ • PLAN_      │ │
│  │ -mode         │               │ • allowRules  │        │   ALLOWED    │ │
│  └───────────────┘               │ • denyRules   │        └──────────────┘ │
│                                  │ • askRules    │                         │
│                                  └───────────────┘                         │
│                                                                              │
│  Permission Mode Resolution:                                                │
│  1. --dangerously-skip-permissions → mode: "bypassPermissions"             │
│  2. --plan → mode: "plan"                                                   │
│  3. --permission-mode auto → mode: "auto"                                   │
│  4. Default → mode: "default"                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. System Reminder Integration

### 9.1 Attachment Producer Pipeline

The System Reminder module produces 40+ attachment types injected into conversations:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCER PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Key Attachment Producers:                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Mode Control:                                                            ││
│  │ • producePlanModeAttachment (DuY) - Plan mode reminders                ││
│  │ • produceAutoModeAttachment (ZuY) - Auto mode status                    ││
│  │                                                                          ││
│  │ Team Mode:                                                               ││
│  │ • produceTeamContextAttachment - Team context info                      ││
│  │ • produceMailboxAttachment - Teammate mailbox messages                  ││
│  │                                                                          ││
│  │ Status/Budget:                                                           ││
│  │ • produceTokenUsageAttachment (qmY) - Token usage stats                ││
│  │ • produceBudgetAttachment (YmY) - Budget USD tracking                   ││
│  │                                                                          ││
│  │ Memory/Context:                                                          ││
│  │ • produceAutoMemoryAttachment - MEMORY.md content                       ││
│  │ • produceRelevantMemoriesAttachment - Related memories                  ││
│  │                                                                          ││
│  │ File State:                                                              ││
│  │ • produceChangedFilesAttachment - Modified files list                   ││
│  │ • produceDiagnosticsAttachment - LSP diagnostics                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  isMeta Visibility Contract:                                                │
│  • isMeta: true → LLM sees it, User NEVER sees it                          │
│  • isMeta flag → stripped from API payload                                 │
│  • Used for turn counting, telemetry, token budget exclusion               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Key Algorithms with Decision Reasoning

### 10.1 Auto-Compact Trigger Algorithm

**What it does**: Determines when to trigger automatic context compaction.

**Why this approach**:
- Token threshold prevents context overflow
- Circuit breaker (3 consecutive failures) prevents infinite compact loops
- 20% buffer ensures room for next user message

```javascript
// ============================================
// shouldTriggerAutoCompaction - Auto-compact trigger logic
// ============================================

// READABLE (for understanding):
function shouldTriggerAutoCompaction(messages, model, consecutiveFailures) {
    // DISABLE CHECKS
    if (parseBoolean(process.env.DISABLE_COMPACT)) return false;
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) return false;

    // CIRCUIT BREAKER: Stop after 3 consecutive failures
    if (consecutiveFailures >= 3) {
        return false;
    }

    // TOKEN THRESHOLD CHECK
    let currentTokens = countTokens(messages);
    let threshold = getAutoCompactThreshold(model);  // Model-specific

    return currentTokens >= threshold;
}

// Token Thresholds by Model:
// - Claude 4 Sonnet: 160,000 tokens (80% of 200k)
// - Claude 4 Opus: 160,000 tokens
// - Claude 3.5 Sonnet: 160,000 tokens
```

### 10.2 Concurrency Safety Detection

**What it does**: Determines if a tool can execute in parallel with others.

```javascript
// ============================================
// isConcurrencySafe - Tool concurrency check
// Location: chunks.148.mjs:46-52
// ============================================

// READABLE (for understanding):
function checkConcurrencySafe(toolDefinition, toolInput) {
    let parseResult = toolDefinition.inputSchema.safeParse(toolInput);

    if (!parseResult?.success) {
        return false;  // Invalid input → Not safe
    }

    try {
        // Call tool's isConcurrencySafe with parsed input
        return Boolean(toolDefinition.isConcurrencySafe(parseResult.data));
    } catch {
        return false;  // Error → Default to not safe
    }
}

// Concurrency-Safe Tools:
// - Read: Always safe (read-only)
// - Grep: Always safe (read-only)
// - Glob: Always safe (read-only)

// NOT Concurrency-Safe Tools:
// - Write: Modifies files
// - Edit: Modifies files
// - Bash: Can modify anything
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `cliEntry` (JVz) - Top-level entry point at chunks.198.mjs:1573
- `run` (OVz) - Commander.js setup at chunks.198.mjs:3
- `mainAgentLoop` (Yh) - Main agent loop at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.148.mjs:3
- `sessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `getInputDialogType` (ra6) - Dialog priority at chunks.196.mjs:387
- `createStateStore` (WX1) - State store factory at chunks.85.mjs:1747

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All CLI/UI/LLM Core functionality documented with source verification