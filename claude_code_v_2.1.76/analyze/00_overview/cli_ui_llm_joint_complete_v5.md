# CLI-UI-LLM Core Joint Analysis Complete v5 (Claude Code 2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.
> **Version**: v5 - Complete joint analysis with verified symbols, deep algorithms, and feature linkages.

---

## Table of Contents

1. [Symbol Verification Report](#1-symbol-verification-report)
2. [Architecture Overview](#2-architecture-overview)
3. [CLI Entry Flow Restoration](#3-cli-entry-flow-restoration)
4. [UI State Machine Complete](#4-ui-state-machine-complete)
5. [LLM Agent Loop Restoration](#5-llm-agent-loop-restoration)
6. [Key Algorithms Deep Dive](#6-key-algorithms-deep-dive)
7. [UI Design Interaction Patterns](#7-ui-design-interaction-patterns)
8. [Feature Cross-Linkage](#8-feature-cross-linkage)
9. [System Reminder Integration](#9-system-reminder-integration)
10. [Performance Considerations](#10-performance-considerations)

---

## 1. Symbol Verification Report

### 1.1 CLI Module Symbols (VERIFIED)

All symbols cross-validated against source code with exact locations:

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| JVz | cliEntry | chunks.198.mjs:1573 | `async function JVz()` | ✅ Verified |
| OVz | run | chunks.198.mjs:3 | `async function OVz()` | ✅ Verified |
| WX1 | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ Verified |
| aN9 | getEntrypoint | chunks.85.mjs:1821 | `function aN9()` | ✅ Verified |

### 1.2 UI Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| ra6 | getInputTypeDialog | chunks.196.mjs:387 | `function ra6()` | ✅ Verified |
| ot8 | sessionOrchestrator | chunks.196.mjs:3 | `function ot8({...})` | ✅ Verified |
| Yj | AppStateProvider | chunks.148.mjs:2544 | Provider component | ✅ Verified |

### 1.3 LLM Core Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ Verified |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ Verified |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | `class ui6` | ✅ Verified |
| mGq | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(...)` | ✅ Verified |

### 1.4 System Reminder Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| _uY | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A, q, K, Y, z, _)` | ✅ Verified |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ Verified |
| Hz | timedAttachmentProducer | chunks.147.mjs:20 | `async function Hz(A, q)` | ✅ Verified |

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
│  │  • Early input capture (prevents lost keystrokes)                   │    │
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
│  │  • useAppState - Selector-based hook                                 │    │
│  │  • Stream mode state machine (prompt→requesting→thinking→...)        │    │
│  │  • Dialog priority system (13+ dialog types)                        │    │
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
│  │                                                                       │    │
│  │  Integration Points:                                                 │    │
│  │  • System Reminder attachment production                             │    │
│  │  • Auto-compact trigger logic                                        │    │
│  │  • Tool permission handling                                          │    │
│  │  • Hook execution                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Complete Request Flow (12 Stages)

```
User Input (Keyboard/Pipe)
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. CLI ENTRY PHASE                                                        │
│    cliEntry (JVz) - chunks.198.mjs:1573                                   │
│    ├─ Fast path: --version → print and exit                              │
│    ├─ Subcommand routing: --mcp-cli, --ripgrep, auth, etc.               │
│    ├─ startCapturingEarlyInput() ← Capture keystrokes during load        │
│    └─ Lazy import: main() → mainEntry (_Vz)                              │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. INITIALIZATION PHASE                                                   │
│    mainEntry (_Vz)                                                        │
│    ├─ Process signal handlers (SIGINT, exit)                             │
│    ├─ Determine client type (cli, sdk-cli, remote, etc.)                 │
│    ├─ Set CLAUDE_CODE_ENTRYPOINT env var                                 │
│    └─ run (OVz)                                                          │
│        ├─ Commander.js setup with flags                                  │
│        ├─ Build initialState (~35 fields)                                │
│        ├─ Permission context building                                     │
│        └─ Render REPL via renderFullscreenComponent                      │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 3. UI RENDER PHASE                                                        │
│    sessionOrchestrator (ot8) - chunks.196.mjs:3                           │
│    ├─ createStateStore (WX1) with initialState                           │
│    ├─ AppStateProvider (Yj) wraps REPL                                   │
│    ├─ Stream mode: "prompt" (waiting for input)                          │
│    ├─ Initialize tool permissions context                                │
│    └─ PromptInput component ready                                         │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 4. USER INPUT PHASE                                                       │
│    PromptInput                                                            │
│    ├─ User types message                                                  │
│    ├─ Multi-line support (Shift+Enter)                                   │
│    ├─ History navigation (Up/Down)                                       │
│    ├─ Autocomplete (Tab) for slash commands                              │
│    └─ Submit (Enter) → onQuery callback                                  │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 5. QUERY EXECUTION PHASE                                                  │
│    onQuery → executeQuery                                                 │
│    ├─ concurrentQueryLock.tryStart()                                     │
│    ├─ setStreamMode("requesting")                                        │
│    ├─ mainAgentLoop (Yh) called as async generator                       │
│    └─ for await (event of mainAgentLoop(...))                            │
│           handleStreamedEvent(event)                                      │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 6. AGENT LOOP PHASE                                                       │
│    mainAgentLoopCore (omY) - chunks.148.mjs:882                           │
│    ├─ Turn state initialization                                          │
│    ├─ Microcompact: Remove consecutive duplicates                        │
│    ├─ Autocompact: Check token threshold                                 │
│    ├─ assembleAllAttachments: System reminders                           │
│    ├─ Build tool schemas                                                 │
│    ├─ Create StreamingToolExecutor                                       │
│    ├─ streamingQueryCore: LLM API request                                │
│    └─ Yield events as they arrive                                        │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 7. STREAMING PHASE                                                        │
│    streamingQueryCore (mGq) - chunks.171.mjs:3                            │
│    ├─ SSE connection to Anthropic API                                    │
│    ├─ Process events:                                                    │
│    │   ├─ message_start → Initialize message                             │
│    │   ├─ content_block_start → Create block (text/tool/thinking)       │
│    │   ├─ content_block_delta → Accumulate content                       │
│    │   ├─ content_block_stop → Yield complete block                     │
│    │   └─ message_stop → End of message                                  │
│    └─ Yield to mainAgentLoop                                             │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 8. TOOL EXECUTION PHASE                                                   │
│    StreamingToolExecutor (ui6) - chunks.148.mjs:3                         │
│    ├─ Collect tool_use blocks from streaming                             │
│    ├─ canExecuteTool() check for concurrency safety                     │
│    ├─ Execute parallel for safe tools (Read, Grep, Glob)                │
│    ├─ Execute sequential for unsafe tools (Write, Edit, Bash)           │
│    ├─ Sibling abort on error                                             │
│    └─ Yield tool results                                                 │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 9. UI UPDATE PHASE                                                        │
│    handleStreamedEvent (rV6)                                              │
│    ├─ type: "assistant" → Append to messages                             │
│    ├─ type: "user" → Append tool results                                 │
│    ├─ type: "stream_event" → Update streamMode                           │
│    │   ├─ content_block_start (tool_use) → "tool-input"                 │
│    │   ├─ content_block_start (thinking) → "thinking"                   │
│    │   ├─ content_block_stop → "tool-use" or "responding"               │
│    │   └─ message_stop → "prompt"                                        │
│    └─ React re-render with deferred messages                             │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 10. TURN COMPLETION PHASE                                                 │
│    mainAgentLoopCore turn check                                           │
│    ├─ If tools were called: Continue to next turn                        │
│    │   └─ Go to step 6 (Agent Loop Phase)                               │
│    └─ If no tools: Return final result                                   │
│        ├─ setStreamMode("prompt")                                        │
│        └─ Ready for next user input                                      │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 11. DIALOG HANDLING PHASE                                                 │
│    getInputDialogType (ra6) - chunks.196.mjs:387                          │
│    ├─ Check pending dialogs in priority order                            │
│    ├─ message-selector (highest - user message selection)                │
│    ├─ sandbox-permission (security critical)                             │
│    ├─ tool-permission (tool approval)                                    │
│    ├─ prompt (tool-initiated prompts)                                    │
│    ├─ worker-sandbox-permission                                          │
│    ├─ elicitation (MCP forms)                                            │
│    ├─ cost (cost warning)                                                │
│    ├─ ide-onboarding                                                     │
│    ├─ effort-callout                                                     │
│    ├─ remote-callout                                                     │
│    ├─ lsp-recommendation                                                 │
│    └─ desktop-upsell (lowest priority)                                   │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 12. CANCEL/ABORT HANDLING PHASE                                           │
│    handleCancel (TM) - chunks.196.mjs:420                                 │
│    ├─ Check current dialog type (K2)                                     │
│    ├─ If elicitation: return (no cancel)                                 │
│    ├─ Flush pending input to messages                                    │
│    ├─ Reset loading state (dE)                                           │
│    ├─ Cancel appropriate dialog:                                         │
│    │   ├─ tool-permission → abort tool, clear queue                     │
│    │   ├─ prompt → reject all prompts, abort request                    │
│    │   └─ default → abort request                                        │
│    └─ Clear pending tool use state                                       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CLI Entry Flow Restoration

### 3.1 cliEntry (JVz) - Top-Level Entry Point

**What it does:** The first function called when Claude Code starts. Performs fastest possible checks first (version, special subcommands), then hands off to the full application.

**How it works:**

```javascript
// ============================================
// cliEntry - Top-level CLI entry point with subcommand routing
// Location: chunks.198.mjs:1573-1650
// ============================================

// ORIGINAL (for source lookup):
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return
    }
    let { profileCheckpoint: q } = await Promise.resolve().then(() => (XS(), z7A));
    if (q("cli_entry"), process.argv[2] === "--claude-in-chrome-mcp") {
        q("cli_claude_in_chrome_mcp_path");
        let { runClaudeInChromeMcpServer: _ } = await Promise.resolve().then(() => (wn8(), _n8));
        await _();
        return
    } else if (process.argv[2] === "--chrome-native-host") {
        q("cli_chrome_native_host_path");
        let { runChromeNativeHost: _ } = await Promise.resolve().then(() => (XVq(), DVq));
        await _();
        return
    }
    // ... additional routing for ripgrep, remote-control, auth, tmux, etc.
    let { startCapturingEarlyInput: Y } = await Promise.resolve().then(() => (lC1(), T77));
    Y(), q("cli_before_main_import");
    let { main: z } = await Promise.resolve().then(() => (pRq(), URq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // Fast path: --version without loading any modules
    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Load telemetry profiling
    let { profileCheckpoint } = await import("./telemetry");
    profileCheckpoint("cli_entry");

    // Fast paths for special subcommands
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        let { runClaudeInChromeMcpServer } = await import("./chrome-mcp");
        await runClaudeInChromeMcpServer();
        return;
    }

    if (process.argv[2] === "--chrome-native-host") {
        let { runChromeNativeHost } = await import("./chrome-native");
        await runChromeNativeHost();
        return;
    }

    // [New in v2.1.76] auth subcommand dispatch
    if (args[0] === "auth" && ["login", "status", "logout"].includes(args[1])) {
        let { authSubcommand } = await import("./auth");
        await authSubcommand(args[1]);
        return;
    }

    // Ripgrep fast path
    if (args[0] === "--ripgrep") {
        profileCheckpoint("cli_ripgrep_path");
        let { ripgrepMain } = await import("./ripgrep");
        process.exitCode = ripgrepMain(args.slice(1));
        return;
    }

    // Start capturing keyboard input early (before main loads)
    let { startCapturingEarlyInput } = await import("./input");
    startCapturingEarlyInput();
    profileCheckpoint("cli_before_main_import");

    // Lazy load and call main()
    let { main } = await import("./main");
    profileCheckpoint("cli_after_main_import");
    await main();
    profileCheckpoint("cli_after_main_complete");
}

// Mapping: JVz→cliEntry, A→args, q→profileCheckpoint, Y→startCapturingEarlyInput, z→main
```

**Why this approach:**
- **Lazy loading via Promise.resolve().then()**: The bundler's code-split syntax loads only required chunks
- **Fast paths first**: --version, --ripgrep, --mcp-cli never load React/Ink components
- **Early input capture**: Prevents keystroke loss during module loading

### 3.2 createStateStore (WX1) - State Store Factory

**What it does:** Creates a Zustand-like observable state store with subscribe capability.

```javascript
// ============================================
// createStateStore - Observable state store factory
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
            for (let O of Y) O()
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z); }
    };
}

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let state = initialState;
    let subscribers = new Set();

    return {
        getState: () => state,

        setState: (updater) => {
            let oldState = state;
            let newState = updater(oldState);

            // Skip update if state is identical (Object.is check)
            if (Object.is(newState, oldState)) return;

            state = newState;

            // Notify change callback if provided
            onChangeCallback?.({ newState, oldState });

            // Notify all subscribers
            for (let subscriber of subscribers) {
                subscriber();
            }
        },

        subscribe: (subscriber) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback, K→state, Y→subscribers
```

**Why this approach:**
- **Hand-rolled instead of Zustand**: Smaller bundle size, exact behavior needed
- **Object.is comparison**: Prevents unnecessary re-renders when state hasn't changed
- **Subscriber pattern**: React components can subscribe to state changes

---

## 4. UI State Machine Complete

### 4.1 Stream Mode States

The `streamMode` tracks what the LLM is currently outputting:

| Mode | Meaning | Trigger Event |
|------|---------|---------------|
| `"responding"` | Text content streaming | `content_block_start` with type `text`, or `message_delta` |
| `"tool-input"` | Tool call JSON streaming | `content_block_start` with type `tool_use` |
| `"thinking"` | Thinking block streaming | `content_block_start` with type `thinking` or `redacted_thinking` |
| `"requesting"` | Request starting | `stream_request_start` event |
| `"tool-use"` | Message complete, tools pending | `message_stop` event |
| `"prompt"` | Waiting for user input | After turn completion |

### 4.2 Dialog Priority System (getInputDialogType - ra6)

**What it does:** Determines which dialog to show based on pending states, with priority ordering.

```javascript
// ============================================
// getInputDialogType - Dialog priority dispatcher
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
    // Check for modal dialogs first (block everything)
    if (isExiting || isTransitioning) return undefined;

    // Highest priority: user message selection
    if (messageSelectorActive) return "message-selector";

    // Loading state - no dialog
    if (isLoading) return undefined;

    // Security-critical: sandbox permission
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check if animation should continue
    let shouldContinueAnimation = !spinner || spinner.shouldContinueAnimation;

    // Tool permission dialog
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";

    // Tool-initiated prompts
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";

    // Worker sandbox permission (async tool execution)
    if (shouldContinueAnimation && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // MCP elicitation forms
    if (shouldContinueAnimation && elicitationQueue[0]) return "elicitation";

    // Cost warning dialogs
    if (shouldContinueAnimation && costWarningActive) return "cost";

    // IDE onboarding
    if (shouldContinueAnimation && ideOnboardingActive) return "ide-onboarding";

    // Effort level callout
    if (shouldContinueAnimation && effortCalloutActive) return "effort-callout";

    // Remote session callout
    if (shouldContinueAnimation && remoteCalloutActive) return "remote-callout";

    // LSP recommendation dialog
    if (shouldContinueAnimation && lspRecommendationActive) return "lsp-recommendation";

    // Lowest priority: desktop upsell
    if (shouldContinueAnimation && desktopUpsellActive) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isExiting, na6→isTransitioning, W7→messageSelectorActive,
//          y2→isLoading, G7→sandboxPermissionQueue, a8→toolPermissionQueue, zA→promptQueue
```

**Why this approach:**
- **Priority ordering ensures security-critical dialogs are never blocked**
- **Animation check prevents dialogs from interrupting active streaming**
- **Message-selector has highest priority for user message selection flow**

---

## 5. LLM Agent Loop Restoration

### 5.1 mainAgentLoop (Yh) and mainAgentLoopCore (omY)

**What it does:** The main async generator that drives the conversation turn-by-turn.

```javascript
// ============================================
// mainAgentLoop - Main agent loop async generator
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
    let hookCleanupQueue = [];
    let result = yield* mainAgentLoopCore(params, hookCleanupQueue);

    // Run cleanup hooks
    for (let hook of hookCleanupQueue) {
        runHook(hook, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→hookCleanupQueue, K→result
```

### 5.2 Turn State Object

```javascript
// ============================================
// Turn State Object - Maintains state across conversation turns
// Location: chunks.148.mjs:882-903
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
    messages: params.messages,                    // Conversation history
    toolUseContext: params.toolUseContext,        // Permission/session context
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit
    autoCompactTracking: undefined,               // Compaction state
    stopHookActive: undefined,                    // Hook control flag
    maxOutputTokensRecoveryCount: 0,              // Retry counter
    hasAttemptedReactiveCompact: false,           // Compact flag
    turnCount: 1,                                 // Turn counter
    pendingToolUseSummary: undefined,             // Tool summary for next turn
    transition: undefined                         // Mode transition
};

// Mapping: J→turnState, A→params
```

**Why this approach:**
- **Single object contains all mutable state for the turn**
- **Enables clean state transitions and recovery**
- **Tracks compaction attempts to prevent infinite loops**

### 5.3 StreamingToolExecutor (ui6)

**What it does:** Manages parallel tool execution with concurrency safety.

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution queue
// Location: chunks.148.mjs:3-200
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
    // ... methods
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];  // Queue of tool executions
    toolUseContext;
    hasErrored = false;  // Circuit breaker flag
    erroredToolDescription = "";
    siblingAbortController;
    discarded = false;
    progressAvailableResolve;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;

        // Create sibling abort controller for isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, or if all executing tools are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    getAbortReason(toolEntry) {
        if (this.hasErrored && this.erroredToolDescription !== toolEntry.block.name) {
            return `Sibling tool ${this.erroredToolDescription} failed`;
        }
        if (this.discarded) {
            return "Tool executor discarded";
        }
        return null;
    }
}

// Mapping: ui6→StreamingToolExecutor, Wm→cloneAbortController
```

**Why this approach:**
- **Parallel execution for concurrency-safe tools** (Read, Grep, Glob)
- **Sequential execution for non-safe tools** (Write, Edit, Bash)
- **Sibling abort pattern**: one tool failure aborts siblings but not parent

---

## 6. Key Algorithms Deep Dive

### 6.1 assembleAllAttachments (_uY) - System Reminder Assembly

**What it does:** Orchestrates all attachment producers to gather context for the LLM request.

**How it works:**

```javascript
// ============================================
// assembleAllAttachments - System reminder orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(), O = setTimeout((W) => W.abort(), 1000, w), $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)),
                 Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        // ... additional producers
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(
    mentionedFiles, sessionContext, toolUseContext, tools, helpers, requestOptions
) {
    // Check if attachments are disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    let abortController = createAbortController();
    let timeout = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    let context = {...sessionContext, abortController};
    let isMainThread = !sessionContext.agentId;

    // First-pass attachments (mentioned files, MCP resources, agent mentions)
    let firstPassProducers = mentionedFiles ? [
        timedAttachmentProducer("at_mentioned_files", () => produceMentionedFiles(mentionedFiles, context)),
        timedAttachmentProducer("mcp_resources", () => produceMcpResources(mentionedFiles, context)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(produceAgentMentions(mentionedFiles, context.agents)))
    ] : [];

    let firstPassResults = await Promise.all(firstPassProducers);

    // Second-pass producers (mode-specific, status, memory)
    let secondPassProducers = [
        // Mode-based attachments
        ...(isMainThread ? [
            producePlanModeAttachment(context),
            produceAutoModeAttachment(context)
        ] : []),

        // Team context if applicable
        ...(sessionContext.teamContext ? [produceTeamContextAttachment(sessionContext.teamContext)] : []),

        // Status attachments
        produceTokenUsageAttachment(context),
        produceBudgetAttachment(context),

        // Memory attachments
        produceAutoMemoryAttachment(context),
        produceRelevantMemoriesAttachment(context)
    ];

    let secondPassResults = await Promise.all(secondPassProducers);

    clearTimeout(timeout);

    // Flatten and filter null/undefined
    return [...firstPassResults.flat(), ...secondPassResults.flat()]
        .filter(result => result !== undefined && result !== null);
}

// Mapping: _uY→assembleAllAttachments, t6→parseBoolean, sK→createAbortController, Hz→timedAttachmentProducer
```

**Why this approach:**
- **Two-pass architecture**: First pass for mentioned files, second pass for mode-specific
- **Timeout protection**: 1-second timeout prevents hanging on slow producers
- **Parallel execution**: All producers run concurrently via Promise.all
- **Sampling for telemetry**: 5% sampling for performance metrics

### 6.2 normalizeAttachmentForAPI (Ui8) - Attachment Normalization

**What it does:** Converts internal attachment objects to API-compatible message format.

```javascript
// ============================================
// normalizeAttachmentForAPI - Attachment to API message converter
// Location: chunks.174.mjs:3-50
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({
            content: Kzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [p1({
            content: `<system-reminder>
# Team Coordination
...
`
        })];
    }
    // ... additional type handling
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Handle first-party (SDK) mode special cases
    if (isFirstPartyMode()) {
        if (attachment.type === "teammate_mailbox") {
            return [createUserMessage({
                content: formatTeammateMessages(attachment.messages),
                isMeta: true
            })];
        }
        if (attachment.type === "team_context") {
            return [createUserMessage({
                content: `<system-reminder>
# Team Coordination

You are a teammate in team "${attachment.teamName}".

**Your Identity:**
- Name: ${attachment.agentName}

**Team Resources:**
- Team config: ${attachment.teamConfigPath}
- Task list: ${attachment.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    // Standard attachment types
    switch (attachment.type) {
        case "plan_mode":
            return [createUserMessage({
                content: wrapWithSystemReminderTags(attachment.content),
                isMeta: true
            })];
        case "token_usage":
            return [createUserMessage({
                content: formatTokenUsageMessage(attachment),
                isMeta: true
            })];
        // ... other types
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, E7→isFirstPartyMode, p1→createUserMessage
```

**Why this approach:**
- **Type-based dispatch**: Different handling for each attachment type
- **isMeta flag**: Marks messages as meta (not counted in conversation)
- **System reminder tags**: Wraps content for clear separation

---

## 7. UI Design Interaction Patterns

### 7.1 Input Handling

| Feature | Keys | Behavior |
|---------|------|----------|
| Multi-line | Shift+Enter | Insert newline without submitting |
| Submit | Enter | Submit current input |
| History | Up/Down | Navigate command history |
| Autocomplete | Tab | Complete slash commands |
| Cancel | Ctrl+C | Cancel current operation |

### 7.2 Dialog Priority System

The dialog system uses a priority queue where security-critical dialogs are never blocked:

1. **message-selector** (Highest) - User message selection
2. **sandbox-permission** - Security-critical permission prompts
3. **tool-permission** - Tool approval requests
4. **prompt** - Tool-initiated prompts
5. **worker-sandbox-permission** - Async tool permissions
6. **elicitation** - MCP form dialogs
7. **cost** - Cost warning dialogs
8. **ide-onboarding** - IDE setup
9. **effort-callout** - Effort level notifications
10. **remote-callout** - Remote session info
11. **lsp-recommendation** - LSP plugin suggestions
12. **desktop-upsell** (Lowest) - Desktop app promotion

### 7.3 Stream Mode Visual Feedback

```
Stream Mode State Transitions:

    ┌─────────────┐
    │   "prompt"  │ ←── Waiting for user input
    └──────┬──────┘
           │ onQuery()
           ▼
    ┌─────────────┐
    │"requesting" │ ←── Request starting
    └──────┬──────┘
           │ content_block_start
           ▼
    ┌──────────────────────────────────────────┐
    │                                          │
    │  ┌────────────┐  ┌────────────┐  ┌─────────────┐
    │  │"responding"│  │"tool-input"│  │ "thinking"  │
    │  │ (text)     │  │ (tool_use) │  │ (thinking)  │
    │  └────────────┘  └────────────┘  └─────────────┘
    │                                          │
    └─────────────────────┬────────────────────┘
                          │ message_stop
                          ▼
                   ┌─────────────┐
                   │ "tool-use"  │ ←── Tools executing
                   └──────┬──────┘
                          │ complete
                          ▼
                   ┌─────────────┐
                   │   "prompt"  │ ←── Ready for next input
                   └─────────────┘
```

---

## 8. Feature Cross-Linkage

### 8.1 CLI → Tools → Permission Flow

```
CLI Flags → Permission Updates → Tool Filtering → Session Tool Set

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ CLI Flags       │     │ Permission      │     │ Filtered        │
│                 │     │ Context         │     │ Tool Set        │
│ --allowed-tools │────►│ Ez reducer      │────►│ Xk8 filter      │
│ --disallowed-   │     │                 │     │                 │
│   tools         │     │ mode, rules,    │     │ MCP tools,      │
│ --dangerously-  │     │ directories     │     │ built-in tools  │
│   skip-perm     │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 8.2 LLM Core → Compact → Token Management

```
Turn Start → Token Count → Auto-Compact Check → Compaction → Continue

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Turn Start      │     │ Token Count     │     │ Auto-Compact    │
│                 │     │                 │     │                 │
│ mainAgentLoop   │────►│ tokenCount >=   │────►│ autoCompact     │
│ Core            │     │ threshold?      │     │ Dispatcher      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 8.3 System Reminder → Attachment Flow

```
Session State → Attachment Producers → Normalized Messages → LLM Request

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Session State   │     │ Attachment      │     │ API Messages    │
│                 │     │ Producers       │     │                 │
│ planMode        │────►│ _uY orchestrator│────►│ Ui8 normalizer  │
│ teamContext     │     │                 │     │                 │
│ tokenUsage      │     │ Plan, Team,     │     │ [{content,      │
│ budgetUsd       │     │ Token, Memory   │     │   isMeta:true}] │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 9. System Reminder Integration

### 9.1 Attachment Producer Catalog

| Producer | Type | Content | When Used |
|----------|------|---------|-----------|
| `producePlanModeAttachment` | plan_mode | Plan instructions | Plan mode active |
| `produceAutoModeAttachment` | auto_mode | Auto mode guidance | Auto mode flag set |
| `produceTeamContextAttachment` | team_context | Team coordination info | Team session |
| `produceTokenUsageAttachment` | token_usage | Token count summary | Every request |
| `produceBudgetAttachment` | budget | Budget status | Budget limit set |
| `produceAutoMemoryAttachment` | auto_memory | MEMORY.md content | Auto memory enabled |
| `produceRelevantMemoriesAttachment` | relevant_memories | Related memories | Agent mentions |
| `produceMentionedFilesAttachment` | at_mentioned_files | @file contents | Files mentioned |
| `produceMcpResourcesAttachment` | mcp_resources | MCP resource content | MCP resources referenced |
| `produceTeammateMailboxAttachment` | teammate_mailbox | Team messages | Teammate context |

### 9.2 Attachment Producer Priority

```
First-Pass (Before message assembly):
1. at_mentioned_files - File contents from @file syntax
2. mcp_resources - MCP server resources
3. agent_mentions - Referenced agent memory

Second-Pass (After mode determination):
4. plan_mode - Plan mode instructions
5. auto_mode - Auto mode guidance
6. team_context - Team coordination
7. token_usage - Token usage summary
8. budget - Budget status
9. auto_memory - Memory file content
10. relevant_memories - Related agent memories
```

---

## 10. Performance Considerations

### 10.1 Streaming Latency

- **Immediate yielding**: Events yielded immediately upon API arrival
- **No batching**: SSE events processed individually
- **Deferred rendering**: `useDeferredValue` for message rendering

### 10.2 Token Efficiency

- **Deferred tool loading**: Only include tools referenced in conversation
- **Prompt caching**: System prompt and repeated messages cached
- **Message normalization**: Removes unnecessary metadata

### 10.3 Error Recovery

- **Automatic retry**: Transient failures trigger retry with exponential backoff
- **Context overflow recovery**: Compact then retry with smaller context
- **Circuit breaker**: Max 3 consecutive compact failures

### 10.4 Memory Management (v2.1.76 Fix)

When a generator is terminated early (e.g., via abort), intermediate streaming buffers are now explicitly released rather than retained until GC. This fixes a memory leak in high-frequency streaming scenarios.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (Compact, Thinking, Steering)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations (Chrome, IDE, Plugin)

Key symbols documented:
- `cliEntry` (JVz) - Top-level entry at chunks.198.mjs:1573
- `createStateStore` (WX1) - State factory at chunks.85.mjs:1747
- `mainAgentLoop` (Yh) - Agent loop at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - Tool queue at chunks.148.mjs:3
- `streamingQueryCore` (mGq) - SSE processor at chunks.171.mjs:3
- `assembleAllAttachments` (_uY) - Reminder orchestrator at chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer at chunks.174.mjs:3
- `getInputDialogType` (ra6) - Dialog dispatcher at chunks.196.mjs:387

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All CLI-UI-LLM functionality documented with source verification