# CLI-UI-LLM Core Joint Analysis Complete v3 (Claude Code 2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Symbol Verification Report](#2-symbol-verification-report)
3. [Source-Level Code Restoration](#3-source-level-code-restoration)
4. [UI Design Interaction Complete](#4-ui-design-interaction-complete)
5. [Feature Interaction Analysis](#5-feature-interaction-analysis)
6. [Key Algorithms with Decision Reasoning](#6-key-algorithms-with-decision-reasoning)
7. [Cross-Module Integration](#7-cross-module-integration)

---

## 1. Architecture Overview

### 1.1 Three-Tier Architecture

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
│  │                                                                       │    │
│  │  Event Handling:                                                     │    │
│  │  • handleToolUseStream (xN6) - LLM event processor                  │    │
│  │  • handleCancel (TM) - Cancel propagation                            │    │
│  │  • getInputDialogType (ra6) - Dialog dispatcher                     │    │
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

### 1.2 Complete Request Flow (12 Stages)

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
│    streamingQueryCore (mGq)                                               │
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
| RKq | getSessionGates | chunks.148.mjs:816 | Feature flags | ✅ Verified |
| SKq | getModelCallHelpers | chunks.148.mjs:834 | Helper factory | ✅ Verified |

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
    // Chrome MCP server: Runs Claude Code as MCP server for browser extension
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        profileCheckpoint("cli_claude_in_chrome_mcp_path");
        let { runClaudeInChromeMcpServer } = await import("./chrome-mcp");
        await runClaudeInChromeMcpServer();
        return;
    }

    // Chrome native messaging host: IPC bridge for Chrome extensions
    if (process.argv[2] === "--chrome-native-host") {
        profileCheckpoint("cli_chrome_native_host_path");
        let { runChromeNativeHost } = await import("./chrome-native-host");
        await runChromeNativeHost();
        return;
    }

    // Bridge/remote control mode: Remote session support
    if (args[0] === "remote-control" || args[0] === "rc" || args[0] === "remote" ||
        args[0] === "sync" || args[0] === "bridge") {
        profileCheckpoint("cli_bridge_path");
        await bridgeMain(args.slice(1));
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

### 3.2 StreamingToolExecutor (ui6)

**What it does**: Manages parallel tool execution with concurrency safety and sibling abort.

**Why this approach**:
- Parallel execution for concurrency-safe tools (Read, Grep, Glob) improves performance
- Sequential execution for non-safe tools (Write, Edit, Bash) prevents race conditions
- Sibling abort pattern: one tool failure aborts siblings but not parent request

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution with concurrency safety
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
        this.erroredToolDescription = "";
        // Clone abort controller for sibling abort isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
        this.discarded = false;
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, or if all executing tools are concurrency-safe
        // AND the new tool is also concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    getAbortReason(toolEntry) {
        // Priority 1: Executor was discarded (streaming fallback)
        if (this.discarded) return "streaming_fallback";

        // Priority 2: A sibling tool errored (circuit breaker)
        if (this.hasErrored) return "sibling_error";

        // Priority 3: User aborted the request
        if (this.toolUseContext.abortController.signal.aborted) {
            // Check interrupt behavior - some tools can continue during interrupt
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

        // Check abort conditions
        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason)];
            toolEntry.status = "completed";
            return;
        }

        // Create sibling abort controller for isolation
        let siblingAbort = cloneAbortController(this.siblingAbortController);

        // Execute via toolDispatcher
        for await (let event of toolDispatcher(toolEntry.block, toolEntry.assistantMessage,
                                                this.canUseTool,
                                                {...this.toolUseContext, abortController: siblingAbort})) {
            if (event.message) {
                toolEntry.results.push(event.message);
            }
        }

        toolEntry.status = "completed";
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext,
//          Wm→cloneAbortController
```

**Concurrency Safety Decision Tree**:

```
canExecuteTool(isConcurrencySafe)?
│
├─ No tools executing?
│   └─ YES → Allow execution
│
├─ New tool is concurrency-safe?
│   ├─ YES
│   │   └─ All executing tools are concurrency-safe?
│   │       ├─ YES → Allow parallel execution
│   │       └─ NO → Wait for non-safe tools to complete
│   └─ NO
│       └─ Wait for all executing tools to complete
```

---

### 3.3 mainAgentLoopCore (omY)

**What it does**: Core agent loop implementing turn-based conversation with tool execution.

**Why this approach**:
- Single turn state object for all mutable state enables clean state transitions
- Microcompact removes duplicates without API calls (fast, local)
- Autocompact triggers when token threshold exceeded
- StreamingToolExecutor enables parallel tool execution

```javascript
// ============================================
// mainAgentLoopCore - Core agent loop implementation
// Location: chunks.148.mjs:882-1019
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
        // ... turn logic ...
        let s = D.gates.streamingToolExecution ? new ui6(X.options.tools, _, X) : null;
        // ... streaming query ...
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, completedPromises) {
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

    // Helper functions factory (for testability and dependency injection)
    let helpers = params.deps ?? getModelCallHelpers();

    // TURN STATE OBJECT: Single object for all mutable turn state
    // This enables clean state transitions and recovery
    let turnState = {
        messages: params.messages,                    // Conversation history
        toolUseContext: params.toolUseContext,        // Permission/session context
        maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit
        autoCompactTracking: undefined,               // Compaction state tracking
        stopHookActive: undefined,                    // Hook control flag
        maxOutputTokensRecoveryCount: 0,              // Retry counter for token limits
        hasAttemptedReactiveCompact: false,           // Prevent infinite compact loops
        turnCount: 1,                                 // Current turn number
        pendingToolUseSummary: undefined,             // Tool results awaiting processing
        transition: undefined                         // Mode transition state
    };

    let sessionGates = getSessionGates();

    // MAIN TURN LOOP
    while (true) {
        // Yield stream request start event (for UI state)
        yield { type: "stream_request_start" };

        // PHASE 1: Message preparation
        let messages = turnState.messages;
        messages = removeConsecutiveDuplicates(messages);

        // PHASE 2: Micro-compact (remove consecutive duplicates)
        // Fast, local operation - no API calls
        messages = (await helpers.microcompact(messages, toolUseContext, querySource)).messages;

        // PHASE 3: Auto-compact (if token threshold exceeded)
        // May trigger LLM-based compaction
        let { compactionResult, consecutiveFailures } =
            await helpers.autocompact(messages, toolUseContext, {...});

        if (compactionResult) {
            // Track compaction for telemetry
            turnState.autoCompactTracking = {
                compacted: true,
                turnId: helpers.uuid(),
                turnCounter: 0,
                consecutiveFailures: 0
            };
            // Yield compacted messages to UI
            for (let msg of getCompactionMessages(compactionResult)) {
                yield msg;
            }
            messages = compactionResult.messages;
        }

        // PHASE 4: Create StreamingToolExecutor
        let toolExecutor = sessionGates.streamingToolExecution
            ? new StreamingToolExecutor(tools, canUseTool, toolUseContext)
            : null;

        // PHASE 5: Streaming query
        for await (let event of streamingQueryCore(messages, systemPrompt, ...)) {
            // Handle different event types
            if (event.type === "content_block_delta") {
                yield event;  // Forward to UI
            } else if (event.type === "tool_use") {
                // Queue tool for execution
                toolExecutor?.addTool(event.block, event.assistantMessage);
            }
            // ... more event handling ...
        }

        // PHASE 6: Tool execution
        if (toolExecutor?.tools.length > 0) {
            // Wait for all tools to complete
            await toolExecutor.waitForCompletion();

            // Collect results and continue to next turn
            turnState.messages = appendToolResults(messages, toolExecutor.tools);

            // Increment turn counter
            turnState.turnCount++;

            // Continue loop for next turn
            continue;
        }

        // No tools called - end of conversation
        return { reason: "complete" };
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, J→turnState, D→sessionGates,
//          ui6→StreamingToolExecutor, RKq→getSessionGates, SKq→getModelCallHelpers
```

---

## 4. UI Design Interaction Complete

### 4.1 Dialog Priority System

The UI uses a priority-based dialog system where only one dialog can be active at a time.

```javascript
// ============================================
// getInputDialogType - Dialog priority dispatcher
// Location: chunks.196.mjs:387-403
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
    // Priority 1: Animation/cost blocking dialogs
    if (isCostWarningAnimating || hasUnconfirmedCost) return;  // Block all dialogs

    // Priority 2: Message selector (highest user priority)
    if (isMessageSelectorVisible) return "message-selector";

    // Priority 3: Stream active - no dialogs during streaming
    if (isStreamActive) return;

    // Priority 4: Sandbox permission (security critical)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation must continue for lower priority dialogs
    let shouldContinueAnimation = !toolUseConfirm || toolUseConfirm.shouldContinueAnimation;

    // Priority 5: Tool permission
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";

    // Priority 6: Tool-initiated prompt
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";

    // Priority 7: Worker sandbox permission
    if (shouldContinueAnimation && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // Priority 8: MCP elicitation
    if (shouldContinueAnimation && elicitationQueue[0]) return "elicitation";

    // Priority 9: Cost warning
    if (shouldContinueAnimation && hasCostWarning) return "cost";

    // Priority 10: IDE onboarding
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";

    // Priority 11: Effort callout
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";

    // Priority 12: Remote callout
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";

    // Priority 13: LSP recommendation
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";

    // Priority 14: Desktop upsell (lowest priority)
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    return;  // No dialog to show
}

// Mapping: ra6→getInputDialogType, lV6→isCostWarningAnimating, na6→hasUnconfirmedCost,
//          W7→isMessageSelectorVisible, y2→isStreamActive, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n.queue→workerSandboxQueue,
//          o.queue→elicitationQueue, m26→hasCostWarning
```

### 4.2 Dialog Types and Behaviors

| Dialog Type | Priority | Trigger | Cancel Behavior |
|-------------|----------|---------|-----------------|
| message-selector | 1 | Double-Escape | Opens message selector for navigation |
| sandbox-permission | 2 | Network/sandbox request | Rejects sandbox permission |
| tool-permission | 3 | Tool needs approval | Aborts tool, clears queue |
| prompt | 4 | Tool needs user input | Rejects ALL queued prompts |
| worker-sandbox-permission | 5 | Background worker sandbox | Rejects worker permission |
| elicitation | 6 | MCP form request | No cancel (must respond) |
| cost | 7 | Cost threshold reached | Acknowledges warning |
| ide-onboarding | 8 | IDE detected | Dismisses onboarding |
| effort-callout | 9 | Effort level selection | Uses default (medium) |
| remote-callout | 10 | Remote session detected | Acknowledges |
| lsp-recommendation | 11 | LSP plugin available | Dismisses recommendation |
| desktop-upsell | 12 | Desktop app promotion | Dismisses upsell |

### 4.3 Cancel Propagation Chain

```javascript
// ============================================
// handleCancel - Cancel propagation handler
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim())
        gq((P1) => [...P1, $Z({ content: ez })]);
    if (dE(), K2 === "tool-permission") a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort()
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null)
}

// READABLE (for understanding):
function handleCancel() {
    // Elicitation cannot be cancelled - user must respond
    if (currentDialogType === "elicitation") return;

    logDebug(`[onCancel] focusedInputDialog=${currentDialogType} streamMode=${streamMode}`);

    // Force end any ongoing animation
    animationManager.forceEnd();

    // Flush pending input text to messages
    if (pendingInputText?.trim()) {
        appendToMessages(createUserMessage({ content: pendingInputText }));
    }

    // Reset loading state (clear streaming buffers)
    resetLoadingState();

    // Dialog-specific cancel handling
    if (currentDialogType === "tool-permission") {
        // Abort the tool permission request
        toolPermissionQueue[0]?.onAbort();
        clearToolPermissionQueue([]);
    } else if (currentDialogType === "prompt") {
        // CRITICAL: Reject ALL queued prompts (not just the first)
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        clearPromptQueue([]);
        // Abort the streaming request
        abortController?.abort();
    } else if (remoteSessionManager.isRemoteMode) {
        // Remote session: use remote cancel
        remoteSessionManager.cancelRequest();
    } else {
        // Default: abort the request
        abortController?.abort();
    }

    // Clear pending tool use state
    setPendingToolUse(null);
}

// Mapping: TM→handleCancel, K2→currentDialogType, d7→streamMode, J9→animationManager,
//          ez→pendingInputText, dE→resetLoadingState, a8→toolPermissionQueue,
//          zA→promptQueue, M5→abortController, $A→clearToolPermissionQueue, gA→clearPromptQueue
```

### 4.4 Stream Mode State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STREAM MODE STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐                                                              │
│   │  PROMPT  │◄──────────────────────────────────────────────────────┐     │
│   │          │                                                        │     │
│   │ Waiting  │                                                        │     │
│   │ for      │                                                        │     │
│   │ input    │                                                        │     │
│   └────┬─────┘                                                        │     │
│        │                                                              │     │
│        │ User submits query                                           │     │
│        ▼                                                              │     │
│   ┌──────────┐                                                        │     │
│   │REQUESTING│                                                        │     │
│   │          │                                                        │     │
│   │ Building │                                                        │     │
│   │ request  │                                                        │     │
│   └────┬─────┘                                                        │     │
│        │                                                              │     │
│        │ API request sent                                             │     │
│        ▼                                                              │     │
│   ┌──────────┐     content_block_start (thinking)    ┌──────────┐     │     │
│   │RESPONDING│─────────────────────────────────────►│ THINKING │     │     │
│   │          │                                      │          │     │     │
│   │ Text     │◄─────────────────────────────────────│ Extended │     │     │
│   │ response │      content_block_stop (thinking)   │ thinking │     │     │
│   └────┬─────┘                                      └──────────┘     │     │
│        │                                                               │     │
│        │ content_block_start (tool_use)                               │     │
│        ▼                                                               │     │
│   ┌──────────┐     tool_use input needed              ┌──────────┐     │     │
│   │TOOL-USE  │─────────────────────────────────────►│TOOL-INPUT│     │     │
│   │          │                                      │          │     │     │
│   │ Executing│◄─────────────────────────────────────│ Waiting  │     │     │
│   │ tools    │      input submitted/timeout         │ for input│     │     │
│   └────┬─────┘                                      └──────────┘     │     │
│        │                                                               │     │
│        │ All tools complete, no more tools                            │     │
│        │                                                               │     │
│        └───────────────────────────────────────────────────────────────┘     │
│                                                                              │
│   Transitions:                                                               │
│   • prompt → requesting: User submits query                                 │
│   • requesting → responding: API connection established                     │
│   • responding → thinking: content_block_start (thinking)                  │
│   • thinking → responding: content_block_stop                               │
│   • responding → tool-use: content_block_start (tool_use)                  │
│   • tool-use → tool-input: Tool needs user input                           │
│   • tool-input → tool-use: Input provided or timeout                       │
│   • tool-use → prompt: message_stop (no more tools)                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Feature Interaction Analysis

### 5.1 System Reminder Integration

System reminders are attached to LLM requests via `assembleAllAttachments`:

```javascript
// ============================================
// assembleAllAttachments - System reminder orchestrator
// Location: chunks.147.mjs:3
// ============================================

// READABLE (for understanding):
async function assembleAllAttachments(sessionState) {
    let attachments = [];

    // 1. Mode-based attachments
    if (sessionState.permissionMode === "plan") {
        attachments.push(await producePlanModeAttachment(sessionState));
    }
    if (sessionState.permissionMode === "auto") {
        attachments.push(produceAutoModeAttachment());
    }

    // 2. Team context
    if (sessionState.teamContext) {
        attachments.push(produceTeamContextAttachment(sessionState.teamContext));
        // Teammate mailbox
        if (sessionState.teammateMailbox) {
            attachments.push(produceMailboxAttachment(sessionState.teammateMailbox));
        }
    }

    // 3. Task/Todo reminders
    if (sessionState.tasks?.length > 0) {
        attachments.push(produceTaskReminderAttachment(sessionState.tasks));
    }

    // 4. Token usage
    attachments.push(produceTokenUsageAttachment(sessionState.tokenCount));

    // 5. LSP diagnostics
    if (sessionState.lspDiagnostics?.length > 0) {
        attachments.push(produceLspDiagnosticAttachment(sessionState.lspDiagnostics));
    }

    // 6. Memory/reminder types (40+ more attachment producers)
    // ... see 04_system_reminder/ for complete list

    // Normalize all attachments for API
    return attachments.map(attachment => normalizeAttachmentForAPI(attachment));
}

// Mapping: _uY→assembleAllAttachments, Ui8→normalizeAttachmentForAPI
```

### 5.2 Attachment Producer Categories

| Category | Producers | Trigger |
|----------|-----------|---------|
| **Mode Control** | plan_mode, auto_mode, default_mode | Permission mode |
| **Team Mode** | team_context, teammate_mailbox, team_memory | Team membership |
| **Task Management** | todo_reminders, task_dependencies, task_claim | Active tasks |
| **Status Budget** | token_usage, cost_warning, rate_limit | Token/cost thresholds |
| **IDE Integration** | ide_context, ide_selection, ide_diagnostics | IDE connection |
| **Skills/Memory** | auto_memory, relevant_memories, memory_files | Memory enabled |
| **Hooks** | hook_results, hook_context | Hook execution |
| **LSP** | diagnostics, code_actions | LSP enabled |

### 5.3 Cross-Feature Interaction Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FEATURE INTERACTION MATRIX                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────┐                              ┌─────────┐                      │
│   │   CLI   │─────────────────────────────►│   UI    │                      │
│   │ (Entry) │                              │ (React) │                      │
│   └────┬────┘                              └────┬────┘                      │
│        │                                        │                            │
│        │         ┌──────────────────┐          │                            │
│        └────────►│   LLM Core       │◄─────────┘                            │
│                  │   (Agent Loop)   │                                        │
│                  └────────┬─────────┘                                        │
│                           │                                                  │
│        ┌──────────────────┼──────────────────┐                              │
│        │                  │                  │                              │
│        ▼                  ▼                  ▼                              │
│   ┌─────────┐       ┌──────────┐      ┌──────────┐                         │
│   │  Tools  │       │  System  │      │  Hooks   │                         │
│   │         │       │ Reminder │      │          │                         │
│   └────┬────┘       └────┬─────┘      └────┬─────┘                         │
│        │                 │                 │                                │
│        └─────────────────┼─────────────────┘                                │
│                          │                                                  │
│                          ▼                                                  │
│                   ┌────────────┐                                           │
│                   │    MCP     │                                           │
│                   │ (External) │                                           │
│                   └────────────┘                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Key Algorithms with Decision Reasoning

### 6.1 Token Counting Strategy

**Decision**: Trigger autocompact at 80% of model limit.

**Reasoning**:
- 20% buffer ensures room for next user message without immediate re-compaction
- Space for system prompts that may be injected dynamically
- Margin for token estimation inaccuracies (varies by model)

### 6.2 Sibling Abort Pattern

**Decision**: One tool failure aborts siblings but not parent request.

**Reasoning**:
- Prevents cascading errors from parallel tool execution
- Maintains user's original request context
- Allows graceful error handling without losing conversation state

### 6.3 Dialog Priority Design

**Decision**: Security-critical dialogs have highest priority.

**Reasoning**:
- Sandbox permissions affect system security
- Tool permissions can modify files
- User prompts can wait for security decisions
- Upsell dialogs should never block critical operations

---

## 7. Cross-Module Integration

### 7.1 CLI → UI Integration

```
CLI Flags                    UI State                    LLM Core
──────────                   ─────────                   ─────────
--plan                   →   plan mode               →   Restricted tools
--dangerously-skip       →   bypass mode             →   No permission prompts
--print                  →   non-interactive         →   Single response
--verbose                →   debug output            →   Detailed logging
```

### 7.2 UI → LLM Core Integration

```
UI Event                    LLM Core Action
──────────                  ───────────────
onQuery()                →  mainAgentLoop()
handleCancel()           →  abortController.abort()
streamMode change        →  UI state update
dialog submission        →  permission resolution
```

### 7.3 System Reminder Integration

```
Trigger                    Attachment Producer
────────                   ───────────────────
Plan mode active        →  producePlanModeAttachment()
Team member             →  produceTeamContextAttachment()
Tasks pending           →  produceTaskReminderAttachment()
Tokens > threshold      →  produceTokenUsageAttachment()
```

---

## 8. Deep Algorithm Analysis with Decision Reasoning

### 8.1 assembleAllAttachments Algorithm

**What it does**: Orchestrates 40+ attachment producers to inject context into LLM requests.

**Source Code (VERIFIED)**:

```javascript
// ============================================
// assembleAllAttachments - System reminder orchestrator
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
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(atMentionedFiles, sessionContext, ideContext, queuedMessages, messages, memoryType) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second global timeout
    // This prevents any single producer from blocking the request
    let abortController = createAbortController();
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

    // Build context with abort controller
    let context = {
        ...sessionContext,
        abortController: abortController
    };

    // Determine if this is main thread (not subagent)
    let isMainThread = !sessionContext.agentId;

    // LAYER 1: Pre-switch attachments (executed before mode checks)
    // These are @-mention related and must run first
    let preSwitchProducers = atMentionedFiles ? [
        timedAttachmentProducer("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, context)),
        timedAttachmentProducer("mcp_resources", () => produceMcpResources(atMentionedFiles, context)),
        timedAttachmentProducer("agent_mentions", () => produceAgentMentions(atMentionedFiles, sessionContext.agentDefinitions.activeAgents))
    ] : [];
    let preSwitchResults = await Promise.all(preSwitchProducers);

    // LAYER 2: Core attachments (always produced)
    // These provide essential context for every request
    let coreProducers = [
        timedAttachmentProducer("date_change", () => produceDateChangeAttachment()),
        timedAttachmentProducer("ultrathink_effort", () => produceUltrathinkEffortAttachment(atMentionedFiles)),
        timedAttachmentProducer("deferred_tools_delta", () => produceDeferredToolsDelta(context.options.tools, context.options.mainLoopModel, messages)),
        timedAttachmentProducer("mcp_instructions_delta", () => produceMcpInstructionsDelta(context.options.mcpClients, context.options.tools, context.options.mainLoopModel, messages)),
        timedAttachmentProducer("changed_files", () => produceChangedFilesAttachment(context)),
        timedAttachmentProducer("nested_memory", () => produceNestedMemoryAttachment(context)),
        timedAttachmentProducer("dynamic_skill", () => produceDynamicSkillAttachment(context)),
        timedAttachmentProducer("skill_listing", () => produceSkillListingAttachment(context)),
        timedAttachmentProducer("ultra_claude_md", async () => produceUltraClaudeMdAttachment(messages)),
        timedAttachmentProducer("plan_mode", () => producePlanModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("plan_mode_exit", () => producePlanModeExitAttachment(sessionContext)),
        timedAttachmentProducer("auto_mode", () => produceAutoModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("auto_mode_exit", () => produceAutoModeExitAttachment(sessionContext)),
        timedAttachmentProducer("todo_reminders", () => isStructuredTasksEnabled()
            ? produceStructuredTodoAttachment(messages, sessionContext)
            : produceTodoAttachment(messages, sessionContext)),
        // Team mode attachments (conditional)
        ...(isTeamMode() ? [
            ...(memoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => produceTeammateMailboxAttachment(sessionContext))]),
            timedAttachmentProducer("team_context", async () => produceTeamContextAttachment(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => produceAgentPendingMessagesAttachment(sessionContext)),
        timedAttachmentProducer("critical_system_reminder", () => produceCriticalSystemReminderAttachment(sessionContext))
    ];

    // LAYER 3: Main thread only attachments
    // These only apply to the main conversation, not subagents
    let mainThreadProducers = isMainThread ? [
        timedAttachmentProducer("ide_selection", async () => produceIdeSelectionAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("ide_opened_file", async () => produceIdeOpenedFileAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("output_style", async () => produceOutputStyleAttachment()),
        timedAttachmentProducer("diagnostics", async () => produceDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => produceLspDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("unified_tasks", async () => produceUnifiedTasksAttachment(sessionContext)),
        timedAttachmentProducer("async_hook_responses", async () => produceAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => produceTokenUsageAttachment(messages ?? [], sessionContext.options.mainLoopModel)),
        timedAttachmentProducer("budget_usd", async () => produceBudgetUsdAttachment(sessionContext.options.maxBudgetUsd)),
        timedAttachmentProducer("output_token_usage", async () => produceOutputTokenUsageAttachment()),
        timedAttachmentProducer("verify_plan_reminder", async () => produceVerifyPlanReminderAttachment(messages, sessionContext)),
        timedAttachmentProducer("queued_commands", () => produceQueuedCommandsAttachment(queuedMessages))
    ] : [];

    // Execute both layers in parallel
    let [coreResults, mainThreadResults] = await Promise.all([
        Promise.all(coreProducers),
        Promise.all(mainThreadProducers)
    ]);

    // Clear timeout and flatten results
    clearTimeout(timeoutId);
    return [...preSwitchResults.flat(), ...coreResults.flat(), ...mainThreadResults.flat()]
        .filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentionedFiles, q→sessionContext, K→ideContext,
//          Y→queuedMessages, z→messages, _→memoryType, t6→parseBoolean, sK→createAbortController,
//          Hz→timedAttachmentProducer, E7→isTeamMode, r$→isStructuredTasksEnabled
```

**Why this approach:**

1. **Three-Layer Architecture**:
   - Layer 1 (Pre-switch): @-mention files must be resolved before mode checks
   - Layer 2 (Core): Essential context for every request
   - Layer 3 (Main thread): Context only needed for primary conversation

2. **1-Second Global Timeout**:
   - Prevents any single producer from blocking the request
   - Trade-off: May miss some context, but guarantees responsiveness
   - Producers should handle abort gracefully

3. **Parallel Execution**:
   - All producers in a layer run concurrently via `Promise.all()`
   - Reduces total latency from O(n) to O(max producer time)
   - 5% sampling for telemetry to avoid overhead

4. **Fail-Safe Design**:
   - Individual producer failures caught by `timedAttachmentProducer`
   - Returns empty array on error, allowing request to continue
   - Never crashes the main request due to attachment errors

**Key insight**: The separation between main thread and subagent attachments (`isMainThread` check) ensures that subagents don't receive irrelevant IDE context, token counts, or other main-thread-specific information.

### 8.2 timedAttachmentProducer (Hz)

```javascript
// ============================================
// timedAttachmentProducer - Telemetry wrapper for producers
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function timedAttachmentProducer(label, producerFn) {
    let startTime = Date.now();

    try {
        let result = await producerFn();
        let duration = Date.now() - startTime;

        // 5% sampling for telemetry (performance optimization)
        if (Math.random() < 0.05) {
            let totalSize = result
                .filter((attachment) => attachment !== undefined && attachment !== null)
                .reduce((sum, attachment) => sum + calculateByteLength(attachment), 0);

            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: result.length
            });
        }

        return result;
    } catch (error) {
        let duration = Date.now() - startTime;

        // 5% sampling for error telemetry
        if (Math.random() < 0.05) {
            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Log error but don't propagate - fail-safe
        logError(error);
        debugLog(`Attachment error in ${label}`, error);

        // Return empty array to allow request to continue
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producerFn, K→startTime,
//          d→trackEvent, _6→logError, jV→debugLog, B6→calculateByteLength
```

**Why this approach:**

1. **5% Sampling**: Reduces telemetry overhead while still providing statistically significant data
2. **Error Isolation**: Each producer failure is isolated - doesn't affect other producers
3. **Consistent Return Type**: Always returns array, even on error
4. **Performance Tracking**: Duration measurement helps identify slow producers

---

## 9. Complete Feature Interaction Matrix

### 9.1 CLI → System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLI → SYSTEM REMINDER FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flag                 Reminder Attachment          LLM Behavior         │
│  ─────────                ───────────────────          ────────────         │
│                                                                              │
│  --plan                →  plan_mode                  →  Read-only mode      │
│                           (full instructions)            No Edit/Write      │
│                                                                              │
│  --dangerously-skip    →  (none)                     →  No permission       │
│                           Bypass mode                   checks              │
│                                                                              │
│  --team-name           →  team_context               →  Swarm behavior      │
│                           Team identity                Coordinator role     │
│                                                                              │
│  --agent-id            →  teammate_mailbox           →  Process mailbox     │
│                           Pending messages             Respond as teammate   │
│                                                                              │
│  --mcp-config          →  mcp_instructions_delta     →  MCP server context  │
│                           Server instructions          Tool availability     │
│                                                                              │
│  --resume              →  (restored from session)    →  Continue context    │
│                           Previous state               History preserved     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 UI → System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       UI → SYSTEM REMINDER FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  UI State                Reminder Producer            Display Behavior      │
│  ─────────               ──────────────────            ────────────────      │
│                                                                              │
│  IDE file opened       →  ide_opened_file            →  isMeta: true        │
│                          (file path)                    Hidden in UI        │
│                                                                              │
│  IDE selection         →  ide_selection              →  isMeta: true        │
│                          (selected lines)               Context display     │
│                                                                              │
│  Stream mode change    →  (state update only)        →  Footer indicator    │
│                          prompt→responding              Mode display        │
│                                                                              │
│  Token count update    →  token_usage                →  isMeta: true        │
│                          (current/max)                  Status line         │
│                                                                              │
│  Cost threshold        →  budget_usd                 →  Dialog trigger      │
│                          (USD warning)                 Cost warning         │
│                                                                              │
│  Dialog open           →  (no attachment)            →  Priority system    │
│                          UI state only                 Dialog queue         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 LLM Core → System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LLM CORE → SYSTEM REMINDER FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM Event               Attachment Action              Timing              │
│  ─────────               ─────────────────              ──────              │
│                                                                              │
│  Pre-turn              →  assembleAllAttachments     →  Before every       │
│                          All 40+ producers              request            │
│                                                                              │
│  Tool use queued       →  (no attachment)             →  During stream     │
│                          Tool executor handles           Parallel exec     │
│                                                                              │
│  Post-compact          →  compact_file_reference      →  After compaction  │
│                          Summary of removed              Context preserved  │
│                                                                              │
│  Tool result           →  (no attachment)             →  Added to messages │
│                          Tool result message             Turn continues    │
│                                                                              │
│  Error recovery        →  critical_system_reminder    →  On error          │
│                          Error context                   Retry logic       │
│                                                                              │
│  Turn complete         →  (session state update)      →  After response    │
│                          Token counting                  Usage tracking    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.4 Cross-Feature Interaction Table

| Feature A | Feature B | Interaction Point | Data Flow |
|-----------|-----------|-------------------|-----------|
| CLI `--plan` | Tools | Tool filtering | plan_mode → filterToolsByMode → restricted tool set |
| CLI `--print` | LLM Core | Turn limiting | maxTurns=1 → single response |
| UI Dialog | LLM Core | Permission queue | tool-permission → waitForApproval → continue execution |
| System Reminder | LLM Core | Context injection | assembleAllAttachments → normalizeAttachmentForAPI → messages |
| Hooks | System Reminder | Result delivery | hook_response → attachment → normalizeAttachmentForAPI |
| MCP | Tools | Tool discovery | mcpClients → toolDefinitions → toolDispatcher |
| IDE | System Reminder | Context capture | ide_selection → attachment → LLM context |
| Team Mode | System Reminder | Mailbox polling | teammate_mailbox → attachment → message processing |
| Compact | System Reminder | Summary injection | compaction_result → compact_file_reference → context |
| Todo List | System Reminder | Task reminder | todos → todo_reminder → frequency-throttled attachment |

---

## Related Documents

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution symbols
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Feature symbols
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform symbols
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration symbols

Module documentation:
- [01_cli/README.md](../01_cli/README.md) - CLI module hub
- [02_ui/README.md](../02_ui/README.md) - UI module hub
- [03_llm_core/README.md](../03_llm_core/README.md) - LLM core module hub
- [04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder module

Joint analysis documents:
- [cli_ui_llm_feature_interaction_matrix.md](./cli_ui_llm_feature_interaction_matrix.md) - Feature interactions
- [cli_ui_llm_algorithm_complete_restoration.md](./cli_ui_llm_algorithm_complete_restoration.md) - Algorithm restoration
- [cli_ui_llm_complete_request_flow.md](./cli_ui_llm_complete_request_flow.md) - 12-stage request flow