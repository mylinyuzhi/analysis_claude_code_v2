# CLI-UI-LLM Core Joint Analysis Complete v4 (Claude Code 2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.
> **Version**: v4 - Complete joint analysis with verified symbols and deep algorithm analysis.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Symbol Verification Report](#2-symbol-verification-report)
3. [Source-Level Code Restoration](#3-source-level-code-restoration)
4. [UI Design Interaction Complete](#4-ui-design-interaction-complete)
5. [Feature Interaction Analysis](#5-feature-interaction-analysis)
6. [Key Algorithms with Decision Reasoning](#6-key-algorithms-with-decision-reasoning)
7. [Cross-Module Integration](#7-cross-module-integration)
8. [System Reminder Deep Integration](#8-system-reminder-deep-integration)

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

### 2.4 System Reminder Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| _uY | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A, q, K, Y, z, _)` | ✅ Verified |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ Verified |
| Hz | timedAttachmentProducer | chunks.147.mjs:20 | `async function Hz(A, q)` | ✅ Verified |
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496 | `function b5(A)` | ✅ Verified |
| p1 | createUserMessage | chunks.173.mjs:1378 | `function p1(A)` | ✅ Verified |

### 2.5 Symbol Cross-Reference

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (CLI, Compact, Skills, Hooks)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations (Chrome, IDE, Plugin)

---

## 3. Source-Level Code Restoration

### 3.1 CLI Entry Flow (run - OVz)

**What it does**: Commander.js program setup with extensive CLI flag definitions.

**Why this approach**:
- Single entry point with declarative flag definitions
- PreAction hooks for initialization before command execution
- Type-safe argument parsing with validators

```javascript
// ============================================
// run (OVz) - Commander.js program setup
// Location: chunks.198.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
async function OVz() {
    Zq("run_function_start");

    function A() {
        let w = (O) => O.long?.replace(/^--/, "") ?? O.short?.replace(/^-/, "") ?? "";
        return Object.assign({
            sortSubcommands: !0,
            sortOptions: !0
        }, {
            compareOptions: (O, $) => w(O).localeCompare(w($))
        })
    }
    let q = new fkq().configureHelp(A()).enablePositionalOptions();
    // ... extensive flag definitions
    q.name("claude")
     .description("Claude Code - starts an interactive session by default...")
     .argument("[prompt]", "Your prompt", String)
     .helpOption("-h, --help", "Display help for command")
     .option("-d, --debug [filter]", 'Enable debug mode...')
     .option("-p, --print", "Print response and exit...")
     // ... 50+ more flags
}

// READABLE (for understanding):
async function run() {
    telemetry.mark("run_function_start");

    // Helper for option sorting
    function configureHelpOptions() {
        let getOptionName = (option) =>
            option.long?.replace(/^--/, "") ??
            option.short?.replace(/^-/, "") ??
            "";
        return Object.assign({
            sortSubcommands: true,
            sortOptions: true
        }, {
            compareOptions: (a, b) => getOptionName(a).localeCompare(getOptionName(b))
        });
    }

    // Create Commander program with sorted help
    let program = new Commander()
        .configureHelp(configureHelpOptions())
        .enablePositionalOptions();

    // Set up preAction hook for initialization
    program.hook("preAction", async (command) => {
        await runPreActionInitialization();
        await initializeErrorLogSink();
        await handlePluginDirectories(command.getOptionValue("pluginDir"));
        await runMigrations();
        await syncRemoteSettings();
    });

    // Define CLI interface
    program
        .name("claude")
        .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
        .argument("[prompt]", "Your prompt", String)
        .helpOption("-h, --help", "Display help for command")
        .option("-d, --debug [filter]", 'Enable debug mode with optional category filtering')
        .option("-p, --print", "Print response and exit (non-interactive mode)")
        .option("--dangerously-skip-permissions", "Bypass all permission checks")
        .option("-c, --continue", "Continue the most recent conversation")
        .option("-r, --resume [value]", "Resume a conversation by session ID")
        .option("--model <model>", "Model for the current session")
        .option("--effort <level>", "Effort level (low, medium, high, max)")
        .option("--allowed-tools <tools...>", "Comma-separated list of tool names to allow")
        .option("--disallowed-tools <tools...>", "Comma-separated list of tool names to deny")
        // ... 50+ more flags defined
        .action(async (prompt, options) => {
            // Main action handler
            await handleAction(prompt, options);
        });
}

// Mapping: OVz→run, fkq→Commander, Zq→telemetry.mark
```

### 3.2 Main Agent Loop (mainAgentLoop - Yh)

**What it does**: Top-level async generator that wraps mainAgentLoopCore with cleanup.

**Why this approach**:
- Generator pattern enables streaming events to UI
- Cleanup handled in finally-like pattern via array accumulation
- Returns completion reason for caller

```javascript
// ============================================
// mainAgentLoop (Yh) - Main agent loop entry point
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
    // Accumulate tool use IDs for cleanup
    let toolUseIds = [];

    // Delegate to core implementation
    let result = yield* mainAgentLoopCore(params, toolUseIds);

    // Mark all tools as completed
    for (let toolId of toolUseIds) {
        markToolCompleted(toolId, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, omY→mainAgentLoopCore, pb→markToolCompleted, q→toolUseIds
```

### 3.3 Main Agent Loop Core (mainAgentLoopCore - omY)

**What it does**: Core turn-based conversation loop with tool execution.

**Why this approach**:
- Turn state machine tracks conversation progress
- Micro-compact removes duplicates before each turn
- Auto-compact summarizes when token threshold exceeded
- Tool executor handles parallel/sequential execution

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
        // ... many more parameters
    } = A;

    // Initialize turn state
    let J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        autoCompactTracking: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        turnCount: 1,
        pendingToolUseSummary: void 0,
        stopHookActive: void 0,
        transition: void 0
    };

    while (!0) {
        // Turn processing...
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, toolUseIds) {
    let {
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        toolUseContext,
        messages,
        tools,
        modelConfig,
        thinkingConfig
    } = params;

    // Initialize turn state machine
    let turnState = {
        messages: messages,
        toolUseContext: toolUseContext,
        maxOutputTokensOverride: params.maxOutputTokensOverride,

        // Compaction tracking
        autoCompactTracking: undefined,
        hasAttemptedReactiveCompact: false,

        // Error recovery
        maxOutputTokensRecoveryCount: 0,

        // Turn management
        turnCount: 1,
        pendingToolUseSummary: undefined,
        stopHookActive: undefined,

        // Mode transition
        transition: undefined
    };

    // Main turn loop
    while (true) {
        // Phase 1: Micro-compact (remove consecutive duplicates)
        turnState.messages = await helpers.microcompact(
            turnState.messages,
            turnState.toolUseContext,
            querySource
        );

        // Phase 2: Auto-compact if token threshold exceeded
        if (shouldTriggerAutoCompaction(turnState.messages, model)) {
            let compactResult = await helpers.autocompact(
                turnState.messages,
                turnState.toolUseContext
            );
            if (compactResult) {
                turnState.messages = compactResult.messages;
                turnState.autoCompactTracking = {
                    compacted: true,
                    turnId: helpers.uuid(),
                    consecutiveFailures: 0
                };
                yield* compactResult.summaryEvents;
            }
        }

        // Phase 3: Assemble system reminder attachments
        let attachments = await assembleAllAttachments(
            userMessage,
            turnState.toolUseContext,
            ideSelection,
            pendingCommands,
            turnState.messages,
            sessionMemoryType
        );

        // Phase 4: Build request and call LLM
        let requestMessages = [...attachments, ...turnState.messages];

        for await (let event of helpers.callModel({
            messages: requestMessages,
            systemPrompt,
            tools,
            modelConfig,
            thinkingConfig
        })) {
            if (event.type === "assistant") {
                // Collect tool_use blocks
                let toolUseBlocks = event.message.content.filter(
                    block => block.type === "tool_use"
                );

                if (toolUseBlocks.length > 0) {
                    // Phase 5: Execute tools
                    let executor = new StreamingToolExecutor(
                        tools,
                        canUseTool,
                        turnState.toolUseContext
                    );

                    for (let block of toolUseBlocks) {
                        executor.addTool(block, event.message);
                    }

                    for await (let result of executor.getRemainingResults()) {
                        yield result;
                    }

                    // Update state for next turn
                    turnState.messages = [...turnState.messages, event.message, ...toolResults];
                    turnState.turnCount++;
                    continue; // Next turn
                }
            }
            yield event;
        }

        // No tools called = end conversation
        break;
    }
}

// Mapping: omY→mainAgentLoopCore, J→turnState, _uY→assembleAllAttachments, ui6→StreamingToolExecutor
```

### 3.4 StreamingToolExecutor (ui6)

**What it does**: Parallel tool execution with concurrency control.

**Why this approach**:
- isConcurrencySafe determines parallel vs sequential execution
- Sibling abort cancels all pending tools if one errors
- Queued execution respects dependencies

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Parallel tool execution
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

    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K;
        this.siblingAbortController = Wm(K.abortController)
    }

    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            // Tool not found - create synthetic error result
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
            return;
        }
        // Validate input and check concurrency safety
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try { return Boolean(K.isConcurrencySafe(Y.data)) }
                catch { return !1 }
            })() : !1;

        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        });
        this.processQueue();
    }

    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }

    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break;
        }
    }

    getAbortReason(A) {
        if (this.discarded) return "streaming_fallback";
        if (this.hasErrored) return "sibling_error";
        if (this.toolUseContext.abortController.signal.aborted) {
            if (this.toolUseContext.abortController.signal.reason === "interrupt")
                return this.getToolInterruptBehavior(A) === "cancel" ? "user_interrupted" : null;
            return "user_interrupted";
        }
        return null;
    }
}

// READABLE (for understanding):
class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        this.tools = [];
        this.hasErrored = false;
        this.erroredToolDescription = "";
        // Create sibling abort controller for parallel execution
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
        this.discarded = false;
    }

    addTool(toolUseBlock, assistantMessage) {
        // Find tool definition
        let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Tool not found - create synthetic error
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                results: [createUserMessage({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
                        is_error: true,
                        tool_use_id: toolUseBlock.id
                    }],
                    toolUseResult: `Error: No such tool available: ${toolUseBlock.name}`,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })]
            });
            return;
        }

        // Normalize and validate input
        toolUseBlock.input = normalizeToolInput(toolDef, toolUseBlock.input);
        let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);

        // Determine concurrency safety
        let isConcurrencySafe = parseResult?.success
            ? (() => {
                try { return Boolean(toolDef.isConcurrencySafe(parseResult.data)); }
                catch { return false; }
            })()
            : false;

        // Add to queue
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });

        // Start processing
        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");

        // Can execute if:
        // 1. No tools currently executing, OR
        // 2. This tool is concurrency-safe AND all executing tools are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;

            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                // Stop processing - unsafe tool waiting for safe tools to complete
                break;
            }
        }
    }

    getAbortReason(tool) {
        // Check in order of priority:
        // 1. Executor was discarded (streaming fallback)
        if (this.discarded) return "streaming_fallback";

        // 2. Sibling tool errored
        if (this.hasErrored) return "sibling_error";

        // 3. User interrupted
        if (this.toolUseContext.abortController.signal.aborted) {
            if (this.toolUseContext.abortController.signal.reason === "interrupt") {
                return this.getToolInterruptBehavior(tool) === "cancel"
                    ? "user_interrupted"
                    : null;
            }
            return "user_interrupted";
        }

        return null;
    }
}

// Mapping: ui6→StreamingToolExecutor, Wm→cloneAbortController, dK→findToolByName,
//          PE1→normalizeToolInput, p1→createUserMessage
```

### 3.5 streamingQueryCore (mGq)

**What it does**: Core SSE processing for Anthropic API streaming responses.

**Why this approach**:
- Generator pattern yields events as they arrive
- Dynamic tool loading for deferred MCP tools
- Cache control optimization for prompt caching

```javascript
// ============================================
// streamingQueryCore (mGq) - SSE processing core
// Location: chunks.171.mjs:3-200
// ============================================

// ORIGINAL (for source lookup):
async function* mGq(A, q, K, Y, z, _) {
    // Off-switch check for disabled accounts
    if (!isAPIKeyAuth() && (await getFeatureFlag("tengu-off-switch", { activated: false })).activated && isModelDisabled(_.model)) {
        d("tengu_off_switch_query", {});
        yield createOffSwitchError(Error(disabledMessage), _.model);
        return;
    }

    // Get last request ID for caching
    let lastRequestId = getLastAssistantRequestId(A);

    // Resolve Bedrock inference profile if needed
    let resolvedModel = getPlatform() === "bedrock" && _.model.includes("application-inference-profile")
        ? await resolveInferenceProfile(_.model) ?? _.model
        : _.model;

    // Determine if agentic query (for token-efficient tools)
    let isAgenticQuery = _.querySource.startsWith("repl_main_thread") ||
                         _.querySource.startsWith("agent:") ||
                         _.querySource === "sdk";

    // Build betas array
    let betas = getBetasForModel(_.model, { isAgenticQuery });

    // Check for dynamic tool loading
    let useDynamicLoading = await shouldUseDynamicLoading(_.model, Y, _.getToolPermissionContext, _.agents, "query");

    // Filter tools based on deferred markers
    let toolsToInclude = useDynamicLoading
        ? filterToolsWithDeferredMarkers(Y, A)
        : filterOutDeferredTools(Y);

    // Build tool schemas
    let toolSchemas = await Promise.all(toolsToInclude.map(tool =>
        buildToolSchema(tool, {
            getToolPermissionContext: _.getToolPermissionContext,
            tools: Y,
            agents: _.agents,
            allowedAgentTypes: _.allowedAgentTypes,
            model: _.model,
            betas: betas,
            deferLoading: useDynamicLoading && isDeferredOrMcpTool(tool)
        })
    ));

    // Normalize messages
    K5("query_message_normalization_start");
    let normalizedMessages = normalizeMessages(A, toolsToInclude);

    // Apply cache controls
    normalizedMessages = addCacheControlsToMessages(normalizedMessages);

    // Trim excess images
    normalizedMessages = trimImageCount(normalizedMessages, MAX_IMAGES_IN_CONTEXT);
    K5("query_message_normalization_end");

    // Build system prompt
    let systemPromptBlocks = buildSystemPromptBlocks(q, enablePromptCaching, {
        skipGlobalCacheForSystemPrompt: hasMcpOrDeferredTools,
        querySource: _.querySource
    });

    // ... SSE connection and event processing
}

// READABLE (for understanding):
async function* streamingQueryCore(messages, systemPromptSections, tools, abortSignal, extras, config) {
    // Phase 1: Pre-request checks
    // Check off-switch for disabled accounts
    if (!isAPIKeyAuth()) {
        let offSwitch = await getFeatureFlag("tengu-off-switch", { activated: false });
        if (offSwitch.activated && isModelDisabled(config.model)) {
            yield createOffSwitchError(new Error("Account disabled"), config.model);
            return;
        }
    }

    // Phase 2: Model resolution
    // Get cached request ID if available
    let lastRequestId = getLastAssistantRequestId(messages);

    // Resolve inference profile for Bedrock
    let resolvedModel = config.model;
    if (getPlatform() === "bedrock" && config.model.includes("application-inference-profile")) {
        resolvedModel = await resolveInferenceProfile(config.model) ?? config.model;
    }

    // Phase 3: Tool filtering and schema building
    // Determine if dynamic tool loading is needed
    let useDynamicLoading = await shouldUseDynamicLoading(
        config.model,
        tools,
        config.getToolPermissionContext,
        config.agents,
        "query"
    );

    // Filter tools based on deferred loading decision
    let referencedTools = extractReferencedTools(messages);
    let toolsToInclude = useDynamicLoading
        ? tools.filter(tool => !isDeferredTool(tool) || referencedTools.has(tool.name))
        : tools.filter(tool => !isDeferredTool(tool));

    // Build tool schemas
    performance.mark("query_tool_schema_build_start");
    let toolSchemas = await Promise.all(
        toolsToInclude.map(tool => buildToolSchema(tool, {
            model: config.model,
            betas: betas,
            deferLoading: useDynamicLoading && isDeferredOrMcpTool(tool)
        }))
    );
    performance.mark("query_tool_schema_build_end");

    // Phase 4: Message normalization
    performance.mark("query_message_normalization_start");
    let normalizedMessages = normalizeMessages(messages, toolsToInclude);

    // Apply additional normalization if not using dynamic loading
    if (!useDynamicLoading) {
        normalizedMessages = normalizedMessages.map(msg => {
            switch (msg.type) {
                case "user": return normalizeUserMessage(msg);
                case "assistant": return normalizeAssistantMessage(msg);
                default: return msg;
            }
        });
    }

    // Add cache controls and trim images
    normalizedMessages = addCacheControlsToMessages(normalizedMessages);
    normalizedMessages = trimImageCount(normalizedMessages, MAX_IMAGES_IN_CONTEXT);
    performance.mark("query_message_normalization_end");

    // Phase 5: System prompt assembly
    let systemPromptBlocks = buildSystemPromptBlocks(
        systemPromptSections,
        config.enablePromptCaching,
        { querySource: config.querySource }
    );

    // Phase 6: SSE streaming
    // ... streaming implementation yields events as they arrive

    // Yield: message_start, content_block_start, content_block_delta, content_block_stop, message_stop
}

// Mapping: mGq→streamingQueryCore, A9z→getLastAssistantRequestId, QA→getPlatform,
//          G31→resolveInferenceProfile, cM→normalizeMessages, Sh1→buildToolSchema
```

---

## 4. UI Design Interaction Complete

### 4.1 Stream Mode State Machine

```javascript
// ============================================
// Stream Mode States - UI interaction phases
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

### 4.2 Dialog Priority System

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-420
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (!P1) return;
    if (a8[0]) return "tool-permission";
    if (zA[0]) return "prompt";
    if (n.queue[0]) return "worker-sandbox-permission";
    if (o.queue[0]) return "elicitation";
    // ... informational dialogs
}

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

    // Check animation state for remaining dialogs
    let shouldShowDialog = !localJSXDialog || localJSXDialog.shouldContinueAnimation;
    if (!shouldShowDialog) {
        return undefined;
    }

    // PRIORITY 3: Tool permission (tool execution - security critical)
    if (toolPermissionQueue[0]) {
        return "tool-permission";
    }

    // PRIORITY 4: Prompt request (MCP/user input prompt)
    if (promptQueue[0]) {
        return "prompt";
    }

    // PRIORITY 5: Worker sandbox permission (background agent network)
    if (workerSandboxPermissionQueue[0]) {
        return "worker-sandbox-permission";
    }

    // PRIORITY 6: MCP elicitation (MCP server form request)
    if (elicitationQueue[0]) {
        return "elicitation";
    }

    // PRIORITIES 7-12: Informational dialogs
    if (costWarningActive) return "cost";
    if (ideOnboardingActive) return "ide-onboarding";
    if (effortCalloutActive) return "effort-callout";
    if (remoteCalloutActive) return "remote-callout";
    if (lspRecommendationActive) return "lsp-recommendation";
    if (desktopUpsellActive) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isConfirmingAction, na6→hasBlockingDialog,
//          W7→isMessageSelectorVisible, y2→isLoading, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n→workerSandboxPermissions, o→elicitation
```

### 4.3 Dialog Priority Table

| Priority | Dialog Type | Queue Variable | Trigger Condition |
|----------|-------------|----------------|-------------------|
| - | (blocked) | `isConfirmingAction` | Action confirmation |
| 1 | message-selector | `W7` | Multi-message selection |
| - | (blocked) | `isLoading` | Loading state |
| 2 | sandbox-permission | `G7[0]` | Network access request |
| 3 | tool-permission | `a8[0]` | Tool execution permission |
| 4 | prompt | `zA[0]` | User input prompt |
| 5 | worker-sandbox-permission | `n.queue[0]` | Background agent network |
| 6 | elicitation | `o.queue[0]` | MCP server form |
| 7 | cost | `m26` | Budget threshold |
| 8 | ide-onboarding | `W6` | IDE not connected |
| 9 | effort-callout | `g6` | Effort level change |
| 10 | remote-callout | `J1` | Remote session active |
| 11 | lsp-recommendation | `e8` | LSP plugin available |
| 12 | desktop-upsell | `E1` | Desktop app promotion |

---

## 5. Feature Interaction Analysis

### 5.1 CLI → System Reminder Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CLI → SYSTEM REMINDER INTEGRATION PIPELINE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  CLI Flags       │    │  Session State    │    │  Permission      │     │
│  │  --plan          │    │  teamMode         │    │  Context         │     │
│  │  --agent         │    │  delegateMode     │    │  mode: default   │     │
│  │  --print         │    │  agentId          │    │  bypass          │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │  assembleAllAttachments(_uY)  │                       │
│                    │  40+ attachment producers     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│           ┌────────────────────────┼────────────────────────┐              │
│           │                        │                        │              │
│           ▼                        ▼                        ▼              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│  │ Mode Control    │   │ Team Mode       │   │ Status/Budget   │          │
│  │ Attachments     │   │ Attachments     │   │ Attachments     │          │
│  │                 │   │                 │   │                 │          │
│  │ plan_mode       │   │ teammate_       │   │ token_usage     │          │
│  │ auto_mode       │   │ mailbox         │   │ budget_usd      │          │
│  │ delegate_mode   │   │ team_context    │   │ compaction_     │          │
│  └─────────────────┘   └─────────────────┘   │ reminder        │          │
│                                              └─────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Tool Execution Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TOOL EXECUTION PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flags                    LLM Core                    UI               │
│  ─────────                    ────────                    ──               │
│                                                                              │
│  --allowed-tools ──────────► filterToolsByMode ────────► Tool permission   │
│  --disallowed-tools              (Xk8)                     dialog          │
│                                                              (a8)           │
│       │                          │                           │              │
│       │                          ▼                           │              │
│       │                  StreamingToolExecutor              │              │
│       │                      (ui6)                          │              │
│       │                          │                           │              │
│       │              ┌───────────┴───────────┐              │              │
│       │              │                       │              │              │
│       │              ▼                       ▼              │              │
│       │       Parallel Tools          Sequential Tools      │              │
│       │       (Read, Grep,            (Write, Edit,         │              │
│       │        Glob, WebSearch)        Bash, Agent)         │              │
│       │              │                       │              │              │
│       │              └───────────┬───────────┘              │              │
│       │                          │                           │              │
│       │                          ▼                           │              │
│       │                   Tool Results                       │              │
│       │                          │                           │              │
│       │                          └──────────────────────────►│              │
│       │                                        yield events   │              │
│       │                                                      │              │
│       │                                         handleStreamedEvent        │
│       │                                                      │              │
│       └──────────────────────────────────────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Key Algorithms with Decision Reasoning

### 6.1 canExecuteTool Algorithm

**What it does**: Determines if a tool can start executing based on current execution state.

**How it works**:
1. Get list of currently executing tools
2. If no tools executing → allow
3. If this tool is concurrency-safe AND all executing tools are concurrency-safe → allow
4. Otherwise → wait

**Why this approach**:
- Parallel execution for I/O-bound tools improves performance
- Sequential execution for file modifications prevents race conditions
- Simple boolean check is fast and predictable

```javascript
// ============================================
// canExecuteTool - Concurrency check
// Location: chunks.148.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    // Get tools currently in execution
    let executingTools = this.tools.filter(tool => tool.status === "executing");

    // Decision tree:
    // 1. No tools executing → allow (empty queue)
    if (executingTools.length === 0) {
        return true;
    }

    // 2. This tool is safe AND all executing are safe → allow (parallel execution)
    if (isConcurrencySafe && executingTools.every(tool => tool.isConcurrencySafe)) {
        return true;
    }

    // 3. Otherwise → wait (sequential execution required)
    return false;
}

// Mapping: A→isConcurrencySafe, q→executingTools
```

### 6.2 getAbortReason Algorithm

**What it does**: Determines why a tool execution should be aborted.

**How it works**:
1. Check if executor was discarded (streaming fallback)
2. Check if sibling tool errored
3. Check if user interrupted via abort controller
4. Return appropriate reason or null

**Why this approach**:
- Ordered checks by priority
- Distinguishes between different abort scenarios for proper error messages
- Returns null if no abort needed

```javascript
// ============================================
// getAbortReason - Abort reason determination
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
getAbortReason(tool) {
    // Priority 1: Executor was discarded
    // This happens when streaming ends before all tools complete
    if (this.discarded) {
        return "streaming_fallback";
    }

    // Priority 2: Sibling tool errored
    // All pending tools should be cancelled
    if (this.hasErrored) {
        return "sibling_error";
    }

    // Priority 3: User interrupted
    if (this.toolUseContext.abortController.signal.aborted) {
        // Check if interrupt reason was explicit
        if (this.toolUseContext.abortController.signal.reason === "interrupt") {
            // Some tools can continue after interrupt (e.g., long-running background)
            return this.getToolInterruptBehavior(tool) === "cancel"
                ? "user_interrupted"
                : null;
        }
        return "user_interrupted";
    }

    // No abort needed
    return null;
}

// Mapping: A→tool
```

---

## 7. Cross-Module Integration

### 7.1 State Flow Between Modules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE FLOW BETWEEN MODULES                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI (01_cli)                                                               │
│  ├─ initialState (35 fields)                                                │
│  ├─ toolPermissionContext                                                   │
│  └─ mcpClients                                                              │
│         │                                                                    │
│         ▼                                                                    │
│  UI (02_ui)                                                                 │
│  ├─ AppStateProvider (Yj)                                                   │
│  │   └─ createStateStore (WX1)                                              │
│  ├─ streamMode state machine                                                │
│  └─ dialog queues (permission, prompt, elicitation)                         │
│         │                                                                    │
│         ▼                                                                    │
│  LLM Core (03_llm_core)                                                     │
│  ├─ mainAgentLoop (Yh)                                                      │
│  │   └─ turnState object                                                    │
│  ├─ toolUseContext                                                          │
│  └─ StreamingToolExecutor (ui6)                                             │
│         │                                                                    │
│         ▼                                                                    │
│  System Reminder (04_system_reminder)                                       │
│  ├─ assembleAllAttachments (_uY)                                            │
│  └─ normalizeAttachmentForAPI (Ui8)                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Event Flow Between Modules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT FLOW BETWEEN MODULES                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input                                                                 │
│      │                                                                       │
│      ▼                                                                       │
│  UI: PromptInput.onQuery()                                                  │
│      │                                                                       │
│      ▼                                                                       │
│  LLM Core: mainAgentLoop()                                                  │
│      │                                                                       │
│      ├─── streamingQueryCore() ──── yield stream events ────┐              │
│      │                                                       │              │
│      ├─── StreamingToolExecutor() ─── yield tool results ───┤              │
│      │                                                       │              │
│      └─── assembleAllAttachments() ─── attachments ─────────┤              │
│                                                              │              │
│      ▼                                                       │              │
│  UI: handleStreamedEvent() ◄─────────────────────────────────┘              │
│      │                                                                       │
│      ├─── Update streamMode                                                  │
│      ├─── Update messages                                                    │
│      └─── Update dialog queues                                               │
│                                                                              │
│      ▼                                                                       │
│  React Re-render                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. System Reminder Deep Integration

### 8.1 Attachment Production Pipeline

```javascript
// ============================================
// assembleAllAttachments (_uY) - Main orchestrator
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
async function assembleAllAttachments(
    userMessage,           // A: Current user message (if any)
    toolUseContext,        // q: Session context with options, agentId, etc.
    ideSelection,          // K: IDE selection state
    pendingCommands,       // Y: Queued commands from UI
    messages,              // z: Conversation history
    sessionMemoryType      // _: "session_memory" or undefined
) {
    // Global disable check
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    const abortController = createAbortController();
    const timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    // Extended context with abort signal
    const context = {
        ...toolUseContext,
        abortController
    };

    // Determine if this is the main agent (not a subagent)
    const isMainAgent = !toolUseContext.agentId;

    // Group 1: User-message-dependent (sequential)
    // Only computed if there's a user message
    const userDependentProducers = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => produceAtMentionedFiles(userMessage, context)),
        timedAttachmentProducer("mcp_resources", () => produceMcpResources(userMessage, context)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(produceAgentMentions(userMessage, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];

    // Wait for Group 1 to complete (sequential dependency)
    const userDependentResults = await Promise.all(userDependentProducers);

    // Group 2: Always-computed (parallel)
    const alwaysComputedProducers = [
        timedAttachmentProducer("date_change", () => Promise.resolve(produceDateChangeAttachment())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(produceUltrathinkEffortAttachment(userMessage))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(produceDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(produceMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("changed_files", () => produceChangedFilesAttachment(context)),
        timedAttachmentProducer("nested_memory", () => produceNestedMemoryAttachment(context)),
        timedAttachmentProducer("dynamic_skill", () => produceDynamicSkillAttachment(context)),
        timedAttachmentProducer("skill_listing", () => produceSkillListingAttachment(context)),
        timedAttachmentProducer("ultra_claude_md", async () => produceUltraClaudeMdAttachment(messages)),
        timedAttachmentProducer("plan_mode", () => producePlanModeAttachment(messages, toolUseContext)),
        timedAttachmentProducer("plan_mode_exit", () => producePlanModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("auto_mode", () => produceAutoModeAttachment(messages, toolUseContext)),
        timedAttachmentProducer("auto_mode_exit", () => produceAutoModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("todo_reminders", () => isTaskSystemEnabled() ? produceTaskReminders(messages, toolUseContext) : produceTodoReminders(messages, toolUseContext)),
        // Team mode attachments (if enabled)
        ...(isTeamMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => produceTeammateMailbox(toolUseContext))]),
            timedAttachmentProducer("team_context", async () => produceTeamContextAttachment(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => produceAgentPendingMessages(toolUseContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(produceCriticalSystemReminder(toolUseContext)))
    ];

    // Group 3: Main-agent-only (parallel, skipped for subagents)
    const mainAgentOnlyProducers = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => produceIdeSelectionAttachment(ideSelection, toolUseContext)),
        timedAttachmentProducer("ide_opened_file", async () => produceIdeOpenedFileAttachment(ideSelection, toolUseContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(produceOutputStyleAttachment())),
        timedAttachmentProducer("diagnostics", async () => produceDiagnosticsAttachment(toolUseContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => produceLspDiagnosticsAttachment(toolUseContext)),
        timedAttachmentProducer("unified_tasks", async () => produceUnifiedTasksAttachment(toolUseContext)),
        timedAttachmentProducer("async_hook_responses", async () => produceAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(produceTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(produceBudgetAttachment(toolUseContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(produceOutputTokenUsageAttachment())),
        timedAttachmentProducer("verify_plan_reminder", async () => produceVerifyPlanReminderAttachment(messages, toolUseContext)),
        timedAttachmentProducer("queued_commands", () => produceQueuedCommandsAttachment(pendingCommands))
    ] : [];

    // Execute Groups 2 and 3 in parallel
    const [group2Results, group3Results] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Clear timeout
    clearTimeout(timeoutId);

    // Combine and filter results
    return [
        ...userDependentResults.flat(),
        ...group2Results.flat(),
        ...group3Results.flat()
    ].filter(result => result !== undefined && result !== null);
}

// Mapping: _uY→assembleAllAttachments, t6→parseBoolean, sK→createAbortController,
//          Hz→timedAttachmentProducer, RuY→produceAtMentionedFiles, SuY→produceMcpResources,
//          huY→produceAgentMentions, DuY→producePlanModeAttachment, etc.
```

### 8.2 Attachment Type Categories

| Category | Types | Trigger |
|----------|-------|---------|
| **User-Dependent** | at_mentioned_files, mcp_resources, agent_mentions | User message content |
| **Mode Control** | plan_mode, plan_mode_exit, auto_mode, auto_mode_exit | Permission context mode |
| **Team Mode** | teammate_mailbox, team_context | Team mode enabled |
| **IDE Integration** | ide_selection, ide_opened_file, diagnostics | IDE connection |
| **Status/Budget** | token_usage, budget_usd, output_token_usage | Every turn |
| **Memory** | nested_memory, dynamic_skill, skill_listing | Memory enabled |
| **Hooks** | async_hook_responses, critical_system_reminder | Hook execution |

---

## Related Documents

> Joint Analysis:
> - [cli_ui_llm_joint_complete_v3.md](./cli_ui_llm_joint_complete_v3.md) - Previous version
> - [cli_ui_llm_integration.md](./cli_ui_llm_integration.md) - Integration overview
> - [cli_ui_llm_deep_integration.md](./cli_ui_llm_deep_integration.md) - Deep integration

> Symbol Indices:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution symbols
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features symbols
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform symbols
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration symbols

> Module Documentation:
> - [01_cli/README.md](../01_cli/README.md) - CLI module hub
> - [02_ui/README.md](../02_ui/README.md) - UI module hub
> - [03_llm_core/README.md](../03_llm_core/README.md) - LLM Core module hub
> - [04_system_reminder/README.md](../04_system_reminder/README.md) - System Reminder module hub