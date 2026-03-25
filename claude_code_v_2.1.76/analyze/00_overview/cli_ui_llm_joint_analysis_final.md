# CLI-UI-LLM Core Joint Analysis Final (Claude Code 2.1.76)

> **Comprehensive Source-Level Joint Analysis** - Complete integration of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-Validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode and decision reasoning.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.

---

## Table of Contents

1. [Symbol Verification Report](#1-symbol-verification-report)
2. [Architecture Overview](#2-architecture-overview)
3. [Complete Request Flow (15 Stages)](#3-complete-request-flow-15-stages)
4. [Source-Level Algorithm Restoration](#4-source-level-algorithm-restoration)
5. [UI Design Interaction Complete](#5-ui-design-interaction-complete)
6. [Feature Interaction Analysis](#6-feature-interaction-analysis)
7. [Cross-Module Integration](#7-cross-module-integration)

---

## 1. Symbol Verification Report

### 1.1 Verification Status

All key symbols have been cross-validated against source code:

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `OVz` | run | chunks.198.mjs:3 | ✅ VERIFIED |
| `ot8` | sessionOrchestrator | chunks.196.mjs:3 | ✅ VERIFIED |
| `ra6` | getInputDialogType | chunks.196.mjs:387 | ✅ VERIFIED |
| `TM` | handleCancel | chunks.196.mjs:420 | ✅ VERIFIED |
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | ✅ VERIFIED |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | ✅ VERIFIED |
| `ui6` | StreamingToolExecutor | chunks.148.mjs:3 | ✅ VERIFIED |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | ✅ VERIFIED |
| `Hz` | timedAttachmentProducer | chunks.147.mjs:20 | ✅ VERIFIED |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | ✅ VERIFIED |

### 1.2 Additional Verified Symbols

| Symbol | Readable | Location | Type |
|--------|----------|----------|------|
| `Wm` | cloneAbortController | chunks.148.mjs:16 | function |
| `dK` | findTool | chunks.148.mjs:22 | function |
| `p1` | createUserMessage | chunks.148.mjs:31 | function |
| `Wi6` | toolDispatcher | chunks.148.mjs:154 | function |
| `RKq` | getSessionGates | chunks.148.mjs:903 | function |
| `SKq` | getModelCallHelpers | chunks.148.mjs:892 | function |

---

## 2. Architecture Overview

### 2.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLI TIER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Entry Points                                  │    │
│  │  run (OVz) - Commander.js setup and flag parsing                    │    │
│  │                                                                       │    │
│  │  Responsibilities:                                                   │    │
│  │  • Commander.js program configuration (~50 flags)                    │    │
│  │  • Flag validation and transformation                                │    │
│  │  • Initial state construction (~35 fields)                          │    │
│  │  • MCP configuration loading                                         │    │
│  │  • Permission mode setup                                             │    │
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
│  │  • Dialog priority system (13 dialog types)                         │    │
│  │                                                                       │    │
│  │  Key Components:                                                     │    │
│  │  • getInputDialogType (ra6) - Dialog priority dispatcher            │    │
│  │  • handleCancel (TM) - Cancel propagation handler                    │    │
│  │  • handleStreamedEvent - LLM event processor                         │    │
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
│  │  • assembleAllAttachments (_uY) - System reminder production         │    │
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

### 2.2 Complete Request Flow (15 Stages)

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
│    mainEntry (_Vz) - chunks.197.mjs:1910                                  │
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
│    ├─ AppStateProvider wraps REPL                                        │
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
│    handleStreamedEvent                                                    │
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
│    ├─ Reset loading state                                                │
│    ├─ Cancel appropriate dialog:                                         │
│    │   ├─ tool-permission → abort tool, clear queue                     │
│    │   ├─ prompt → reject all prompts, abort request                    │
│    │   └─ default → abort request                                        │
│    └─ Clear pending tool use state                                       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Symbol Verification Report

### 2.1 CLI Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| JVz | cliEntry | chunks.198.mjs:1573 | `async function JVz()` | ✅ Verified |
| OVz | run | chunks.198.mjs:3 | `async function OVz()` | ✅ Verified |
| _Vz | mainEntry | chunks.197.mjs:1910 | `async function _Vz()` | ✅ Verified |
| aN9 | getEntrypoint | chunks.85.mjs:1821 | `function aN9()` | ✅ Verified |
| zVz | determineEntrypoint | chunks.197.mjs:1895 | `function zVz(A)` | ✅ Verified |

### 2.2 UI Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| WX1 | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ Verified |
| ra6 | getInputDialogType | chunks.196.mjs:387 | `function ra6()` | ✅ Verified |
| TM | handleCancel | chunks.196.mjs:420 | `function TM()` | ✅ Verified |
| ot8 | sessionOrchestrator | chunks.196.mjs:3 | `function ot8({...})` | ✅ Verified |
| Yj | AppStateProvider | chunks.148.mjs:2544 | Provider component | ✅ Verified |

### 2.3 LLM Core Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ Verified |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ Verified |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | `class ui6` | ✅ Verified |
| mGq | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(...)` | ✅ Verified |
| _uY | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A, q, K, Y, z, _)` | ✅ Verified |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ Verified |

### 2.4 Symbol Cross-Reference

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (CLI, Compact, Skills, Hooks)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations (Chrome, IDE, Plugin)

---

## 3. Source-Level Code Restoration

### 3.1 CLI Entry Flow (cliEntry - JVz)

**What it does**: Top-level entry point with subcommand routing and lazy loading.

**Why this approach**:
- Fast path for `--version` without any imports minimizes cold-start latency
- Subcommand routing before main load enables lightweight operations
- `startCapturingEarlyInput()` before heavy import prevents lost keystrokes

```javascript
// ============================================
// cliEntry - Top-level CLI entry point with subcommand routing
// Location: chunks.198.mjs:1573-1651
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
    // ... bridge/remote control handling ...
    if (A.length === 1 && (A[0] === "--update" || A[0] === "--upgrade"))
        process.argv = [process.argv[0], process.argv[1], "update"];
    let { startCapturingEarlyInput: Y } = await Promise.resolve().then(() => (bu6(), Ey7));
    Y(), q("cli_before_main_import");
    let { main: z } = await Promise.resolve().then(() => (Ta8(), yFq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // FAST PATH: Version check without any dynamic imports
    // This is the fastest possible check - zero async loading
    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Load telemetry profiling (lightweight)
    let { profileCheckpoint } = await import("./telemetry");
    profileCheckpoint("cli_entry");

    // SUBCOMMAND ROUTING: Handle special paths before main load
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        profileCheckpoint("cli_claude_in_chrome_mcp_path");
        let { runClaudeInChromeMcpServer } = await import("./chrome-mcp");
        await runClaudeInChromeMcpServer();
        return;
    }

    if (process.argv[2] === "--chrome-native-host") {
        profileCheckpoint("cli_chrome_native_host_path");
        let { runChromeNativeHost } = await import("./chrome-native-host");
        await runChromeNativeHost();
        return;
    }

    // Normalize --update/--upgrade to "update" subcommand
    if (args.length === 1 && (args[0] === "--update" || args[0] === "--upgrade")) {
        process.argv = [process.argv[0], process.argv[1], "update"];
    }

    // CRITICAL: Capture keyboard input BEFORE heavy import
    // This prevents losing keystrokes during the 100-400ms module load
    let { startCapturingEarlyInput } = await import("./early-input");
    startCapturingEarlyInput();

    profileCheckpoint("cli_before_main_import");

    // HEAVY LOAD: Import main module (~15MB, ~198 chunks)
    let { main } = await import("./main");
    profileCheckpoint("cli_after_main_import");

    await main();
    profileCheckpoint("cli_after_main_complete");
}

// Mapping: JVz→cliEntry, A→args, q→profileCheckpoint, Y→startCapturingEarlyInput, z→main
```

**Key insight**: The `startCapturingEarlyInput()` call placed between lightweight routing and heavy import is critical. Without it, fast typists would lose characters typed during module loading.

---

### 3.2 State Store Factory (createStateStore - WX1)

**What it does**: Creates a minimal observable store compatible with React's `useSyncExternalStore`.

**Why this approach**:
- Single object reference for all state (no split state complexity)
- Updater function pattern enables safe concurrent updates
- `Object.is` bail-out prevents unnecessary notifications
- Dual notification system: onChangeCallback for side effects, subscribers for React

```javascript
// ============================================
// createStateStore - Minimal observable state store (zustand-compatible)
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL (for source lookup):
function WX1(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let w = K, H = z(w);
            if (Object.is(H, w)) return;
            K = H, q?.({ newState: H, oldState: w });
            for (let $ of Y) $()
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z) }
    }
}

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        getState: () => currentState,

        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            // Bail out if reference unchanged
            if (Object.is(nextState, prevState)) return;

            currentState = nextState;

            // Notify side-effect handler (disk writes, MCP updates)
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            // Notify React subscribers for re-renders
            for (let notify of subscribers) notify();
        },

        subscribe: (notify) => {
            subscribers.add(notify);
            return () => subscribers.delete(notify);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater, w→prevState,
//          H→nextState, $→notify
```

---

### 3.3 StreamingToolExecutor (ui6)

**What it does**: Manages parallel tool execution with concurrency safety and sibling abort.

**Why this approach**:
- Parallel execution for concurrency-safe tools (Read, Grep, Glob) improves performance
- Sequential execution for non-safe tools (Write, Edit, Bash) prevents race conditions
- Sibling abort pattern: one tool failure aborts siblings but not parent request

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution with concurrency safety
// Location: chunks.148.mjs:3-150
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
    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                results: [p1({
                    content: [{ type: "tool_result", content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`, is_error: !0, tool_use_id: A.id }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => { try { return Boolean(K.isConcurrencySafe(Y.data)) } catch { return !1 } })() : !1;
        this.tools.push({ id: A.id, block: A, assistantMessage: q, status: "queued", isConcurrencySafe: z, pendingProgress: [] }),
        this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
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
    }

    addTool(toolUseBlock, assistantMessage) {
        let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Unknown tool: create synthetic error result
            this.tools.push({
                id: toolUseBlock.id,
                status: "completed",
                results: [createErrorMessage(`Error: No such tool available: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Validate input against schema
        let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);
        let isConcurrencySafe = parseResult.success
            ? Boolean(toolDef.isConcurrencySafe?.(parseResult.data))
            : false;

        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage,
            status: "queued",
            isConcurrencySafe
        });

        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, OR if all executing + new tool are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
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
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions/toolUseBlock, q→canUseTool/assistantMessage,
//          K→toolUseContext/toolDef, Y→parseResult, z→isConcurrencySafe, Wm→cloneAbortController,
//          dK→findToolByName, PE1→validateAndTransformInput
```

**Key insight**: The `canExecuteTool` logic enables parallel execution of safe tools while blocking unsafe ones. When a tool is "queued", it waits until either:
1. No tools are executing (safe to start any tool)
2. All executing tools are concurrency-safe AND the queued tool is also safe (can run in parallel)

---

### 3.4 Dialog Priority System (getInputDialogType - ra6)

**What it does**: Determines which dialog should be shown based on current state, using strict priority ordering.

**Why this approach**:
- User message selection has highest priority (must complete before any other action)
- Security-critical dialogs (sandbox-permission) take precedence over convenience dialogs
- Animation state gating prevents dialog flicker during transitions

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
    // Block all dialogs if fullscreen mode or message selector active
    if (isFullscreenMode || pendingMessageSelector) return undefined;

    // HIGHEST PRIORITY: User message selection (blocks everything else)
    if (isMessageSelectorVisible) return "message-selector";

    // Block dialogs during active turn
    if (isTurnActive) return undefined;

    // HIGH PRIORITY: Security dialogs (no animation gate)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // MEDIUM PRIORITY: Action dialogs (gated by animation state)
    let shouldContinueAnimation = !currentTurn || currentTurn.shouldContinueAnimation;

    if (shouldContinueAnimation) {
        if (toolPermissionQueue[0]) return "tool-permission";
        if (promptQueue[0]) return "prompt";
        if (workerSandboxQueue[0]) return "worker-sandbox-permission";
        if (elicitationQueue[0]) return "elicitation";

        // LOW PRIORITY: Notification dialogs
        if (hasCostWarning) return "cost";
        if (needsIdeOnboarding) return "ide-onboarding";
        if (hasEffortCallout) return "effort-callout";
        if (hasRemoteCallout) return "remote-callout";
        if (hasLspRecommendation) return "lsp-recommendation";

        // LOWEST PRIORITY: Upsell dialogs
        if (hasDesktopUpsell) return "desktop-upsell";
    }

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isFullscreenMode, na6→pendingMessageSelector,
//          W7→isMessageSelectorVisible, y2→isTurnActive, G7→sandboxPermissionQueue,
//          P1→shouldContinueAnimation, a8→toolPermissionQueue, zA→promptQueue,
//          n.queue→workerSandboxQueue, o.queue→elicitationQueue, m26→hasCostWarning,
//          W6→needsIdeOnboarding, g6→hasEffortCallout, J1→hasRemoteCallout,
//          e8→hasLspRecommendation, E1→hasDesktopUpsell
```

**Key insight**: The `shouldContinueAnimation` gate is crucial for preventing dialog flicker. When a turn completes but the success/failure animation is still running, dialogs wait until the animation settles.

---

### 3.5 Attachment Assembly (assembleAllAttachments - _uY)

**What it does**: Orchestrates parallel execution of attachment producers with timeout protection.

**Why this approach**:
- 1-second global timeout prevents hanging on slow producers
- Parallel execution minimizes latency (most producers are fast I/O)
- Three-tier execution: at-mentions, then core, then optional

```javascript
// ============================================
// assembleAllAttachments - Attachment orchestration with timeout protection
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)),
                 Hz("mcp_resources", () => SuY(A, $)),
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
async function assembleAllAttachments(atMentions, context, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Feature flag check
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // TIMEOUT PROTECTION: 1-second hard limit
    let abortController = createAbortController();
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

    let enhancedContext = { ...context, abortController };
    let isMainThread = !context.agentId;

    // TIER 1: At-mention dependent attachments (only if @mentions present)
    let atMentionAttachments = atMentions ? [
        timedProducer("at_mentioned_files", () => getAtMentionedFiles(atMentions, enhancedContext)),
        timedProducer("mcp_resources", () => getMcpResources(atMentions, enhancedContext)),
        timedProducer("agent_mentions", () => getAgentMentions(atMentions, context.options.agentDefinitions.activeAgents))
    ] : [];
    let atMentionResults = await Promise.all(atMentionAttachments);

    // TIER 2: Core attachments (always produced)
    let coreAttachments = [
        timedProducer("date_change", () => getDateChangeAttachment()),
        timedProducer("ultrathink_effort", () => getUltrathinkEffortAttachment(messages)),
        timedProducer("deferred_tools_delta", () => getDeferredToolsDelta(context.options.tools, context.options.mainLoopModel, messages)),
        timedProducer("mcp_instructions_delta", () => getMcpInstructionsDelta(context.options.mcpClients, context.options.tools, context.options.mainLoopModel, messages)),
        timedProducer("changed_files", () => getChangedFilesAttachment(enhancedContext)),
        timedProducer("nested_memory", () => getNestedMemoryAttachment(enhancedContext)),
        timedProducer("dynamic_skill", () => getDynamicSkillAttachment(enhancedContext)),
        timedProducer("skill_listing", () => getSkillListingAttachment(enhancedContext)),
        timedProducer("ultra_claude_md", () => getUltraClaudeMdAttachment(messages)),
        timedProducer("plan_mode", () => getPlanModeAttachment(messages, context)),
        timedProducer("plan_mode_exit", () => getPlanModeExitAttachment(context)),
        timedProducer("auto_mode", () => getAutoModeAttachment(messages, context)),
        timedProducer("auto_mode_exit", () => getAutoModeExitAttachment(context)),
        timedProducer("todo_reminders", () => getTodoRemindersAttachment(messages, context)),
        // Team mode attachments (conditional)
        ...(isTeamMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [timedProducer("teammate_mailbox", () => getTeammateMailboxAttachment(context))]),
            timedProducer("team_context", () => getTeamContextAttachment(messages ?? []))
        ] : []),
        timedProducer("agent_pending_messages", () => getAgentPendingMessagesAttachment(context)),
        timedProducer("critical_system_reminder", () => getCriticalSystemReminderAttachment(context))
    ];

    // TIER 3: Main-thread-only attachments
    let mainThreadAttachments = isMainThread ? [
        timedProducer("ide_selection", () => getIdeSelectionAttachment(ideContext, context)),
        timedProducer("ide_opened_file", () => getIdeOpenedFileAttachment(ideContext, context)),
        timedProducer("output_style", () => getOutputStyleAttachment()),
        timedProducer("diagnostics", () => getDiagnosticsAttachment(context)),
        timedProducer("lsp_diagnostics", () => getLspDiagnosticsAttachment(context)),
        timedProducer("unified_tasks", () => getUnifiedTasksAttachment(context)),
        timedProducer("async_hook_responses", () => getAsyncHookResponsesAttachment()),
        timedProducer("token_usage", () => getTokenUsageAttachment(messages ?? [], context.options.mainLoopModel)),
        timedProducer("budget_usd", () => getBudgetUsdAttachment(context.options.maxBudgetUsd)),
        timedProducer("output_token_usage", () => getOutputTokenUsageAttachment()),
        timedProducer("verify_plan_reminder", () => getVerifyPlanReminderAttachment(messages, context)),
        timedProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
    ] : [];

    let [coreResults, mainThreadResults] = await Promise.all([
        Promise.all(coreAttachments),
        Promise.all(mainThreadAttachments)
    ]);

    clearTimeout(timeoutId);

    // Flatten and filter null/undefined
    return [
        ...atMentionResults.flat(),
        ...coreResults.flat(),
        ...mainThreadResults.flat()
    ].filter(attachment => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentions, q→context, K→ideContext,
//          Y→queuedCommands, z→messages, _→sessionMemoryType, t6→parseBoolean,
//          sK→createAbortController, Hz→timedProducer, E7→isTeamMode,
//          RuY→getAtMentionedFiles, SuY→getMcpResources, etc.
```

**Key insight**: The three-tier execution model ensures:
1. At-mention dependent attachments are computed first (they may affect later attachments)
2. Core attachments run in parallel (independent of main thread status)
3. Main-thread-only attachments (IDE context, token usage) are conditional

---

## 4. UI Design Interaction Complete

### 4.1 Stream Mode State Machine

The UI tracks the current phase of request processing via `streamMode` state:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM MODE STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐                                                                 │
│  │ prompt  │ ← Initial state, waiting for user input                        │
│  └────┬────┘                                                                 │
│       │                                                                      │
│       │ User submits query                                                   │
│       ▼                                                                      │
│  ┌───────────┐                                                               │
│  │requesting │ ← Query sent to agent loop, awaiting response                │
│  └─────┬─────┘                                                               │
│        │                                                                     │
│        │ First content_block_start (text/thinking)                           │
│        ▼                                                                     │
│  ┌──────────┐                                                                │
│  │thinking  │ ← Model generating thinking content                           │
│  └─────┬────┘                                                                │
│        │                                                                     │
│        │ content_block_stop or content_block_start (tool_use)               │
│        ├──────────────────────────────────┐                                  │
│        │                                  │                                  │
│        ▼                                  ▼                                  │
│  ┌──────────┐                        ┌───────────┐                          │
│  │responding│                        │tool-input │                          │
│  │          │                        │           │                          │
│  │Text mode │                        │Tool input │                          │
│  │streaming │                        │streaming  │                          │
│  └─────┬────┘                        └─────┬─────┘                          │
│        │                                   │                                │
│        │ message_stop                      │ content_block_stop             │
│        │                                   ▼                                │
│        │                             ┌──────────┐                           │
│        │                             │tool-use  │                           │
│        │                             │          │                           │
│        │                             │Tool exec │                           │
│        └────────────────────────────►│in progress│                          │
│                                      └─────┬────┘                           │
│                                            │                                │
│                                            │ All tools complete             │
│                                            ▼                                │
│                                       ┌─────────┐                            │
│                                       │ prompt  │                            │
│                                       └─────────┘                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**State Transitions:**

| Current State | Event | Next State | UI Behavior |
|--------------|-------|------------|-------------|
| prompt | User submits | requesting | Show loading spinner |
| requesting | content_block_start(text) | thinking | Show thinking block |
| requesting | content_block_start(thinking) | thinking | Show thinking block |
| requesting | content_block_start(tool_use) | tool-input | Show tool name |
| thinking | content_block_stop | responding | Show text block |
| thinking | content_block_start(tool_use) | tool-input | Show tool name |
| responding | message_stop | prompt | Reset for next input |
| tool-input | content_block_stop | tool-use | Execute tool |
| tool-use | message_stop | prompt | Show tool result |
| tool-use | content_block_start | thinking/responding | Continue streaming |

### 4.2 Keyboard Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        KEYBOARD EVENT FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  stdin (raw mode)                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  Ink stdin handler                                                            │
│       │                                                                      │
│       ├─► Key sequence detection                                             │
│       │    ├─► Ctrl+C → handleCancel()                                       │
│       │    ├─► Ctrl+D → process.exit(0)                                      │
│       │    ├─► Enter → onSubmit()                                            │
│       │    ├─► Shift+Enter → insert newline                                  │
│       │    ├─► Up/Down → history navigation                                  │
│       │    ├─► Tab → autocomplete                                            │
│       │    └─► Escape → clear input / close dialog                           │
│       │                                                                      │
│       ▼                                                                      │
│  useInput hook (React)                                                        │
│       │                                                                      │
│       ├─► Input state update (m5)                                            │
│       │                                                                      │
│       └─► Side effects (submission, cancel, etc.)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Message Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MESSAGE RENDERING PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Agent Loop yields event                                                     │
│       │                                                                      │
│       ▼                                                                      │
│  handleStreamedEvent(event)                                                  │
│       │                                                                      │
│       ├─► type: "assistant" → Append to messages array                      │
│       ├─► type: "user" → Append tool results                                │
│       ├─► type: "tombstone" → Remove message by ID                          │
│       └─► type: "stream_event" → Update streamMode                          │
│       │                                                                      │
│       ▼                                                                      │
│  React setState (batched)                                                    │
│       │                                                                      │
│       ▼                                                                      │
│  useDeferredValue (message rendering)                                        │
│       │                                                                      │
│       │  Deferred rendering prevents blocking input handling                │
│       │                                                                      │
│       ▼                                                                      │
│  MessageList component                                                       │
│       │                                                                      │
│       ├─► Map messages to Message components                                │
│       ├─► Apply isMeta filter (hide meta messages)                          │
│       └─► Render with syntax highlighting                                   │
│       │                                                                      │
│       ▼                                                                      │
│  Ink render to terminal (ANSI escape sequences)                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Key Algorithms with Decision Reasoning

### 5.1 Parallel Tool Execution Decision

**Algorithm:** `canExecuteTool(isConcurrencySafe)`

**What it does:** Determines if a queued tool can start executing based on currently executing tools.

**How it works:**
1. Get all tools with status "executing"
2. If none executing → allow (queue is empty)
3. If tool is concurrency-safe AND all executing are safe → allow (parallel execution)
4. Otherwise → block (wait for current tools to complete)

**Why this approach:**
- **Performance**: Read, Grep, Glob can run simultaneously (no side effects)
- **Safety**: Write, Edit, Bash must run sequentially (filesystem mutations)
- **Simplicity**: Binary classification (safe/unsafe) rather than complex dependency graphs

**Trade-offs:**
- ✅ Simple to implement and reason about
- ✅ No false positives (unsafe tools never run in parallel)
- ⚠️ Conservative: Some safe patterns blocked (e.g., Read + Write to different files)

```javascript
canExecuteTool(isConcurrencySafe) {
    let executing = this.tools.filter(t => t.status === "executing");
    return executing.length === 0 ||
           (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
}
```

### 5.2 Sibling Abort Pattern

**Algorithm:** `getAbortReason(toolEntry)`

**What it does:** Determines if a tool should be aborted before/during execution.

**How it works:**
1. Check if executor was discarded (streaming fallback)
2. Check if sibling tool errored (circuit breaker)
3. Check if user aborted
4. Check interrupt behavior for user-initiated aborts

**Why this approach:**
- **Isolation**: One tool failure doesn't crash the entire request
- **User control**: Interrupt behavior varies by tool type
- **Graceful degradation**: Streaming fallback allows request to continue

**Key insight:** The `siblingAbortController` is a clone of the main abort controller. This allows aborting sibling tools without aborting the entire request.

---

## 6. Cross-Module Integration

### 6.1 CLI → UI Integration

```
CLI Flags → initialState → createStateStore → sessionOrchestrator
                                                │
                                                ▼
                                          REPL component
                                                │
                                                ▼
                                          useAppState hooks
```

**Key Integration Points:**
- `--print` sets `isNonInteractiveSession: true` → disables dialogs
- `--dangerously-skip-permissions` sets `permissionMode: "accept"` → auto-approves tools
- `--model` sets `mainLoopModel` → affects token thresholds
- `--resume` loads previous session messages → populates `initialMessages`

### 6.2 UI → LLM Core Integration

```
User Query → onQuery callback
                │
                ▼
          mainAgentLoop({messages, tools, context})
                │
                ▼
          for await (event of mainAgentLoop)
                │
                ├─► type: "assistant" → appendMessage()
                ├─► type: "user" → appendMessage()
                └─► type: "stream_event" → setStreamMode()
```

**Event Types:**
- `stream_request_start` - Begin streaming phase
- `assistant` - Assistant message chunk
- `user` - User/tool result message
- `tombstone` - Remove message (compaction)
- `stream_event` - SSE event for UI state

### 6.3 LLM Core → System Reminder Integration

```
mainAgentLoopCore (pre-turn)
        │
        ▼
assembleAllAttachments(sessionState)
        │
        ├── Plan mode attachment
        ├── Token usage attachment
        ├── Todo list attachment
        ├── Team context attachment
        └── IDE context attachment
        │
        ▼
normalizeAttachmentForAPI(attachment)
        │
        ▼
Injected as user message with isMeta: true
```

---

## 7. System Reminder Integration

### 7.1 Attachment Production Timing

Attachments are assembled at specific points in the agent loop:

```
Turn Start
    │
    ├── Microcompact (remove consecutive duplicates)
    │
    ├── Autocompact (if token threshold exceeded)
    │
    ├── ATTACHMENT ASSEMBLY ← assembleAllAttachments called here
    │       │
    │       ├── Mode-based attachments (plan_mode, auto_mode)
    │       ├── Status attachments (token_usage, budget_usd)
    │       └── Context attachments (todo, team_context)
    │
    ├── Tool schema building
    │
    └── LLM API request (attachments included as user messages)
```

### 7.2 Mode-Based Attachment Selection

| Mode | Attachments Produced |
|------|---------------------|
| default | token_usage, budget_usd, diagnostics |
| plan | plan_mode + all default attachments |
| auto | auto_mode + all default attachments |
| team | team_context, teammate_mailbox + all attachments |
| delegate | delegate_mode (subset for subagent) |

### 7.3 Attachment Normalization Flow

```
Attachment Object
       │
       ▼
normalizeAttachmentForAPI(attachment)
       │
       ├─► type: "plan_mode" → XML-wrapped plan instructions
       ├─► type: "token_usage" → Formatted token count message
       ├─► type: "team_context" → Team coordination XML
       ├─► type: "todo" → Todo list XML
       └─► type: unknown → [] (silent fallback)
       │
       ▼
{ content: string, isMeta: true }
       │
       ▼
Appended to messages array before API call
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (CLI, Compact, Skills, Hooks)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations (Chrome, IDE, Plugin)

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All symbols verified, algorithms documented with source-level restoration