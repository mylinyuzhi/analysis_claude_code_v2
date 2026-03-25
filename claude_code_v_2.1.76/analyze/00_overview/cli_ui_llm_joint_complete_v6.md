# CLI-UI-LLM Core Joint Analysis Complete v6 (Claude Code 2.1.76)

> Comprehensive source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with semantic pseudocode.
> **Integration**: Full feature interaction analysis including System Reminders and UI Design Patterns.
> **Version**: v6 - Complete joint analysis with verified symbols, deep algorithms, and cross-feature linkages.

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
| `JVz` | cliEntry | chunks.198.mjs:1573 | `async function JVz()` | ✅ Verified |
| `OVz` | run | chunks.198.mjs:3 | `async function OVz()` | ✅ Verified |
| `WX1` | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ Verified |
| `Ez` | permissionContextReducer | chunks.53.mjs:1224 | `function Ez(A, q)` | ✅ Verified |
| `_v` | applyPermissionUpdates | chunks.53.mjs:1296 | `function _v(A, q)` | ✅ Verified |
| `Xk8` | filterToolsByMode | chunks.93.mjs:1568 | `function Xk8({tools, isBuiltIn, isAsync, permissionMode})` | ✅ Verified |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ Verified |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A, q, K, Y, z, _)` | ✅ Verified |
| `t6` | parseBoolean | chunks.1.mjs:4491 | `function t6(A)` | ✅ Verified |

### 1.2 LLM Core Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ Verified |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ Verified |
| `ui6` | StreamingToolExecutor | chunks.148.mjs:3 | `class ui6` | ✅ Verified |
| `mGq` | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(A, q, K, Y, z, _)` | ✅ Verified |
| `Wi6` | toolDispatcher | chunks.146.mjs:285 | `async function* Wi6(A, q, K, Y)` | ✅ Verified |
| `CmY` | shouldTriggerAutoCompaction | chunks.147.mjs:2620 | `async function CmY(A, q, K, Y)` | ✅ Verified |
| `sqq` | autoCompactDispatcher | chunks.147.mjs:2633 | `async function sqq(A, q, K, Y, z, _)` | ✅ Verified |
| `p1` | createUserMessage | chunks.173.mjs:1378 | `function p1({content, isMeta, ...})` | ✅ Verified |

### 1.3 Tool Module Symbols (VERIFIED)

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| `L9` | FileReadTool | chunks.90.mjs:2052 | `const L9 = {...}` | ✅ Verified |
| `s7` | TOOL_NAME_READ | chunks.56.mjs:173 | `const s7 = "Read"` | ✅ Verified |
| `xX` | FileWriteTool | chunks.139.mjs:45 | `const xX = {...}` | ✅ Verified |
| `_K` | TOOL_NAME_WRITE | chunks.56.mjs:1234 | `const _K = "Write"` | ✅ Verified |
| `pX` | EditTool | chunks.170.mjs:1116 | `const pX = {...}` | ✅ Verified |
| `R4` | TOOL_NAME_EDIT | chunks.56.mjs:102 | `const R4 = "Edit"` | ✅ Verified |
| `bb` | GrepTool | chunks.139.mjs:482 | `const bb = {...}` | ✅ Verified |
| `rg` | GlobTool | chunks.139.mjs:880 | `const rg = {...}` | ✅ Verified |

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
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UI LAYER (02_ui)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  REPL (TUA) → AppStateProvider (Yj) → createStateStore (WX1)        │    │
│  │  • React/Ink rendering                                               │    │
│  │  • Message list management                                           │    │
│  │  • Keyboard input handling                                           │    │
│  │  • Streaming display updates                                         │    │
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
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

```
User Input (UI)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. INPUT PHASE                                                              │
│    • Keyboard event captured                                                │
│    • Message assembled with attachments                                     │
│    • State transition: idle → thinking                                      │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. PRE-TURN PHASE (mainAgentLoopCore)                                       │
│    • Micro-compact: Remove consecutive duplicate messages                  │
│    • Auto-compact check: shouldTriggerAutoCompaction()                     │
│    • Attachment assembly: assembleAllAttachments()                         │
│    • System prompt building                                                 │
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
│    • State transition: thinking → idle                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CLI Entry Flow Restoration

### 3.1 cliEntry (JVz) - Top-Level Entry Point

```javascript
// ============================================
// cliEntry - Top-level CLI entry point
// Location: chunks.198.mjs:1573-1651
// ============================================

// ORIGINAL (for source lookup):
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }
    // ... early dispatch for --mcp-cli, --ripgrep, etc.
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // Handle --version flag early
    if (args.length === 1 &&
        (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Early dispatch for special subcommands
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        await runClaudeInChromeMcpServer();
        return;
    }

    if (process.argv[2] === "--chrome-native-host") {
        await runChromeNativeHost();
        return;
    }

    // Bridge/remote-control routing
    if (args[0] === "remote-control" || args[0] === "rc" ||
        args[0] === "remote" || args[0] === "sync" || args[0] === "bridge") {
        await bridgeMain(args.slice(1));
        return;
    }

    // tmux worktree fast path
    if ((args.includes("--tmux") || args.includes("--tmux=classic")) &&
        (args.includes("-w") || args.includes("--worktree"))) {
        let result = await execIntoTmuxWorktree(args);
        if (result.handled) return;
        if (result.error) process.exit(1);
    }

    // Start capturing early input
    startCapturingEarlyInput();

    // Import and run main
    let { main } = await import("./main.js");
    await main();
}

// Mapping: JVz→cliEntry, A→args
```

**Why this approach:**
- Early dispatch for utility modes avoids loading unnecessary code
- Version check is fastest path (no imports)
- Chrome/Bridge modes are isolated from main CLI flow

### 3.2 createStateStore (WX1) - State Store Factory

```javascript
// ============================================
// createStateStore - Redux-like state store
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

// Mapping: WX1→createStateStore, K→state, Y→listeners, z→updater
```

**Why this approach:**
- Immutable state pattern (new object on each update)
- Reference equality check prevents unnecessary re-renders
- Simple pub/sub pattern for React-like reactivity

---

## 4. UI State Machine Complete

### 4.1 UI State Types

```typescript
// UI State Types
type UIState =
    | { type: 'idle' }
    | { type: 'thinking' }
    | { type: 'streaming', partialContent: string }
    | { type: 'tool_execution', tools: ToolExecution[] }
    | { type: 'dialog', dialog: DialogConfig }
    | { type: 'permission_prompt', prompt: PermissionPrompt };

type UIEvent =
    | { type: 'user_input', message: string }
    | { type: 'stream_start' }
    | { type: 'stream_chunk', content: string }
    | { type: 'stream_end' }
    | { type: 'tool_start', tool: ToolUse }
    | { type: 'tool_end', result: ToolResult }
    | { type: 'dialog_open', config: DialogConfig }
    | { type: 'dialog_close' }
    | { type: 'permission_request' }
    | { type: 'permission_response', granted: boolean };
```

### 4.2 State Transition Matrix

```
┌─────────────┬─────────────────┬─────────────────────────────────────┐
│ From State  │ Event           │ To State                            │
├─────────────┼─────────────────┼─────────────────────────────────────┤
│ idle        │ user_input      │ thinking                            │
│ idle        │ dialog_open     │ dialog                              │
│ thinking    │ stream_start    │ streaming                           │
│ thinking    │ dialog_open     │ dialog                              │
│ streaming   │ stream_chunk    │ streaming (accumulate)              │
│ streaming   │ tool_start      │ tool_execution                      │
│ streaming   │ stream_end      │ idle                                │
│ tool_exec   │ tool_start      │ tool_execution (add tool)           │
│ tool_exec   │ tool_end        │ tool_execution (remove/continue)    │
│ tool_exec   │ all_tools_done  │ thinking (continue turn)            │
│ dialog      │ dialog_close    │ previous_state                      │
│ permission  │ perm_response   │ previous_state                      │
└─────────────┴─────────────────┴─────────────────────────────────────┘
```

### 4.3 Keyboard Input Handling

```javascript
// ============================================
// Keyboard Input Handler - Key event processing
// Location: chunks.155.mjs (inferred)
// ============================================

// READABLE (for understanding):
function handleKeyboardInput(keyEvent, state, dispatch) {
    const { key, ctrl, meta, shift } = keyEvent;

    // Escape key handling
    if (key === 'escape') {
        if (state.hasInterruptibleToolInProgress) {
            dispatch({ type: 'interrupt_tools' });
        } else if (state.streamingState === 'streaming') {
            dispatch({ type: 'abort_stream' });
        }
        return;
    }

    // Submit on Enter (unless multiline or shift+enter)
    if (key === 'return' && !shift) {
        if (state.inputMode === 'single_line' || ctrl || meta) {
            dispatch({ type: 'submit_input' });
        }
        return;
    }

    // Keyboard shortcuts with Ctrl modifier
    if (ctrl) {
        switch (key) {
            case 'c':
                if (state.hasSelection) {
                    dispatch({ type: 'copy_selection' });
                } else {
                    dispatch({ type: 'cancel_or_exit' });
                }
                break;
            case 's':
                dispatch({ type: 'toggle_speech_mode' });
                break;
            case 'b':
                dispatch({ type: 'toggle_compact_view' });
                break;
        }
        return;
    }

    // Character input
    dispatch({ type: 'append_input', char: key });
}
```

---

## 5. LLM Agent Loop Restoration

### 5.1 mainAgentLoop (Yh) - Entry Generator

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
    return K;
}

// READABLE (for understanding):
async function* mainAgentLoop(params) {
    let completedToolUseIds = [];

    // Delegate to core implementation
    let result = yield* mainAgentLoopCore(params, completedToolUseIds);

    // Mark all tools as completed
    for (let toolId of completedToolUseIds) {
        markToolCompleted(toolId, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, q→completedToolUseIds, K→result, omY→mainAgentLoopCore
```

### 5.2 mainAgentLoopCore (omY) - Core Implementation

```javascript
// ============================================
// mainAgentLoopCore - Core agent loop implementation
// Location: chunks.148.mjs:882-1200
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
    };
    // ... main loop continues
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, completedToolIds) {
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

    let deps = params.deps ?? getModelCallHelpers();

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

    // Get session gates (feature flags)
    let gates = getSessionGates();

    // Main turn loop
    while (true) {
        let { toolUseContext } = turnState;
        let { messages, autoCompactTracking, maxOutputTokensRecoveryCount } = turnState;

        // Yield stream start event
        yield { type: "stream_request_start" };

        // PRE-TURN PHASE
        // 1. Micro-compact (remove consecutive duplicates)
        messages = (await deps.microcompact(messages, toolUseContext, querySource)).messages;

        // 2. Auto-compact check
        let { compactionResult, consecutiveFailures } =
            await deps.autocompact(messages, toolUseContext, {
                systemPrompt,
                userContext,
                systemContext,
                toolUseContext,
                forkContextMessages: messages
            }, querySource, autoCompactTracking, 0);

        if (compactionResult) {
            // Yield compaction summary messages
            for (let msg of formatCompactionResult(compactionResult)) {
                yield msg;
            }
            messages = compactionResult.messages;
        }

        // 3. Attachment assembly
        let attachments = await assembleAllAttachments(
            undefined, // at-mentioned files
            toolUseContext,
            undefined, // IDE context
            undefined, // queued commands
            messages,
            querySource
        );

        // 4. Create tool executor if enabled
        let toolExecutor = gates.streamingToolExecution
            ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
            : null;

        // STREAMING PHASE
        let streamMessages = [];
        let assistantMessage = null;

        try {
            for await (let event of deps.callModel({
                messages: appendUserContext(messages, userContext),
                systemPrompt,
                thinkingConfig: toolUseContext.options.thinkingConfig,
                tools: toolUseContext.options.tools,
                signal: toolUseContext.abortController.signal,
                options: {
                    model: resolveModel(toolUseContext),
                    isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
                    querySource,
                    // ... other options
                }
            })) {
                // Handle different event types
                if (event.type === "assistant") {
                    streamMessages.push(event);
                    assistantMessage = event;
                    yield event;
                } else if (event.type === "stream_event") {
                    yield event;
                }
            }
        } catch (error) {
            // Handle streaming errors
            yield createErrorMessage(error);
            return { reason: "error" };
        }

        // TOOL EXECUTION PHASE
        if (toolExecutor && assistantMessage?.message?.content) {
            let toolUseBlocks = assistantMessage.message.content
                .filter(block => block.type === "tool_use");

            // Add tools to executor as they're found
            for (let block of toolUseBlocks) {
                toolExecutor.addTool(block, assistantMessage);
            }

            // Execute and yield results
            for await (let result of toolExecutor.getRemainingResults()) {
                yield result.message;
                streamMessages.push(result.message);

                // Update context if modified
                if (result.newContext) {
                    toolUseContext = result.newContext;
                }
            }
        }

        // TURN COMPLETION
        // Check if we should continue
        let hasToolCalls = streamMessages.some(
            msg => msg.message?.content?.some(block => block.type === "tool_use")
        );

        if (!hasToolCalls) {
            // No tools called - conversation complete
            return { reason: "complete" };
        }

        // Prepare for next turn
        turnState.messages = [...messages, ...streamMessages];
        turnState.toolUseContext = toolExecutor?.getUpdatedContext() ?? toolUseContext;
        turnState.turnCount++;

        // Check max turns
        if (maxTurns && turnState.turnCount > maxTurns) {
            return { reason: "max_turns" };
        }
    }
}

// Mapping: omY→mainAgentLoopCore, J→turnState, D→gates, s→toolExecutor
```

**Why this approach:**
- Generator pattern enables real-time streaming to UI
- Turn state is a single mutable object for clean state management
- Tool executor handles parallel execution with proper isolation

---

## 6. Key Algorithms Deep Dive

### 6.1 StreamingToolExecutor (ui6) - Parallel Tool Execution

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution queue
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
    // ... methods
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
    progressAvailableResolve;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    /**
     * Check if a tool can be executed given current queue state
     *
     * Decision Tree:
     * ├── No tools executing? → Execute immediately
     * ├── All executing are concurrency-safe AND new tool is concurrency-safe?
     * │   └── Execute in parallel
     * └── Otherwise? → Wait in queue
     */
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");

        // Allow if nothing executing
        if (executing.length === 0) return true;

        // Allow parallel if all executing and new tool are concurrency-safe
        return isConcurrencySafe && executing.every(t => t.isConcurrencySafe);
    }

    /**
     * Add a tool to the execution queue
     */
    addTool(toolUseBlock, assistantMessage) {
        let toolDef = findToolDefinition(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Create synthetic error for unknown tool
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                pendingProgress: [],
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

        // Validate input against schema
        toolUseBlock.input = coerceToolInput(toolDef, toolUseBlock.input);
        let validationResult = toolDef.inputSchema.safeParse(toolUseBlock.input);
        let isConcurrencySafe = validationResult.success
            ? toolDef.isConcurrencySafe?.(validationResult.data) ?? false
            : false;

        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage,
            status: "queued",
            isConcurrencySafe,
            pendingProgress: []
        });

        // Start processing queue
        this.processQueue();
    }

    /**
     * Determine abort reason for a tool
     *
     * Decision Tree:
     * ├── Executor discarded? → "streaming_fallback"
     * ├── Has sibling error? → "sibling_error"
     * ├── Abort controller aborted?
     * │   ├── Reason is "interrupt"?
     * │   │   ├── Tool interrupt behavior is "cancel"? → "user_interrupted"
     * │   │   └── Otherwise → null (continue)
     * │   └── Otherwise → "user_interrupted"
     * └── Otherwise → null (continue)
     */
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

    /**
     * Execute a single tool
     */
    async executeTool(toolEntry) {
        toolEntry.status = "executing";
        this.toolUseContext.setInProgressToolUseIDs(
            ids => new Set([...ids, toolEntry.id])
        );
        this.updateInterruptibleState();

        let results = [];
        let contextModifiers = [];

        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage)];
            toolEntry.status = "completed";
            this.updateInterruptibleState();
            return;
        }

        // Create sibling abort controller for isolation
        let siblingAbort = cloneAbortController(this.siblingAbortController);

        // Forward abort to parent if sibling aborts (but not from sibling_error)
        siblingAbort.signal.addEventListener("abort", () => {
            if (siblingAbort.signal.reason !== "sibling_error" &&
                !this.toolUseContext.abortController.signal.aborted &&
                !this.discarded) {
                this.toolUseContext.abortController.abort(siblingAbort.signal.reason);
            }
        }, { once: true });

        // Execute tool via dispatcher
        for await (let event of toolDispatcher(
            toolEntry.block,
            toolEntry.assistantMessage,
            this.canUseTool,
            { ...this.toolUseContext, abortController: siblingAbort }
        )) {
            let abortReason = this.getAbortReason(toolEntry);
            if (abortReason) {
                results.push(this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage));
                break;
            }

            // Check for tool errors that should abort siblings
            if (event.message?.type === "user" &&
                event.message.message.content?.some(
                    block => block.type === "tool_result" && block.is_error
                )) {
                // Only abort siblings for Write tool errors
                if (toolEntry.block.name === "Write") {
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

    /**
     * Get completed results as a generator
     */
    *getCompletedResults() {
        if (this.discarded) return;

        for (let tool of this.tools) {
            // Yield pending progress first
            while (tool.pendingProgress.length > 0) {
                yield {
                    message: tool.pendingProgress.shift(),
                    newContext: this.toolUseContext
                };
            }

            // Skip already yielded tools
            if (tool.status === "yielded") continue;

            // Yield completed tools
            if (tool.status === "completed" && tool.results) {
                tool.status = "yielded";
                for (let result of tool.results) {
                    yield {
                        message: result,
                        newContext: this.toolUseContext
                    };
                }
                removeToolFromInProgress(this.toolUseContext, tool.id);
            }
            // Stop at executing non-concurrency-safe tools
            else if (tool.status === "executing" && !tool.isConcurrencySafe) {
                break;
            }
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, Wm→cloneAbortController
```

**Why this approach:**
- Sibling abort pattern: One tool failure can abort siblings but not parent
- Parallel execution for Read/Grep/Glob (concurrency-safe)
- Sequential execution for Write/Edit/Bash
- Progress events streamed in real-time

### 6.2 shouldTriggerAutoCompaction (CmY) - Auto-Compact Trigger

```javascript
// ============================================
// shouldTriggerAutoCompaction - Check if auto-compact should run
// Location: chunks.147.mjs:2620-2631
// ============================================

// ORIGINAL (for source lookup):
async function CmY(A, q, K, Y = 0) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!Xh()) return !1;
    let z = eW(A) - Y,
        _ = oc6(q),
        w = OF(q);
    k(`autocompact: tokens=${z} threshold=${_} effectiveWindow=${w}${Y>0?` snipFreed=${Y}`:""}`);
    let {
        isAboveAutoCompactThreshold: O
    } = mz6(z, q);
    return O
}

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(messages, model, querySource, tokensFreed = 0) {
    // Skip for memory/compact query sources
    if (querySource === "session_memory" || querySource === "compact") {
        return false;
    }

    // Check if auto-compact is enabled
    if (!isAutoCompactEnabled()) {
        return false;
    }

    // Calculate current token count (minus any freed tokens)
    let tokenCount = countTokens(messages) - tokensFreed;
    let threshold = getAutoCompactThreshold(model);
    let effectiveWindow = getModelContextWindow(model);

    debugLog(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}`);

    // Check if above threshold
    let { isAboveAutoCompactThreshold } = checkTokenThresholds(tokenCount, model);
    return isAboveAutoCompactThreshold;
}

// Mapping: CmY→shouldTriggerAutoCompaction, A→messages, q→model, K→querySource, Y→tokensFreed
```

### 6.3 autoCompactDispatcher (sqq) - Auto-Compact Execution

```javascript
// ============================================
// autoCompactDispatcher - Execute auto-compaction
// Location: chunks.147.mjs:2633-2673
// ============================================

// ORIGINAL (for source lookup):
async function sqq(A, q, K, Y, z, _) {
    if (t6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
        wasCompacted: !1
    };
    let w = q.options.mainLoopModel;
    if (!await CmY(A, w, Y, _)) return {
        wasCompacted: !1
    };
    // ... compaction logic
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, toolUseContext, sessionContext, querySource, tracking, tokensFreed) {
    // Check if compact is disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // Circuit breaker: Skip if too many consecutive failures
    const MAX_CONSECUTIVE_FAILURES = 3;
    if (tracking?.consecutiveFailures !== undefined &&
        tracking.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        return { wasCompacted: false };
    }

    let model = toolUseContext.options.mainLoopModel;

    // Check trigger condition
    if (!await shouldTriggerAutoCompaction(messages, model, querySource, tokensFreed)) {
        return { wasCompacted: false };
    }

    // Prepare compaction context
    let compactionContext = {
        isRecompactionInChain: tracking?.compacted === true,
        turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
        previousCompactTurnId: tracking?.turnId,
        autoCompactThreshold: getAutoCompactThreshold(model),
        querySource
    };

    // Try fast summary first (for session_memory mode)
    let fastResult = await tryFastCompact(messages, toolUseContext.agentId, compactionContext.autoCompactThreshold);
    if (fastResult) {
        clearCompactState();
        notifyCompactComplete();
        return { wasCompacted: true, compactionResult: fastResult };
    }

    // Run full compaction
    try {
        let result = await runFullCompact(
            messages,
            toolUseContext,
            sessionContext,
            true,  // isAuto
            undefined, // customPrompt
            true,  // throwOnFailure
            compactionContext
        );

        clearCompactState();
        notifyCompactComplete();

        return {
            wasCompacted: true,
            compactionResult: result,
            consecutiveFailures: 0
        };
    } catch (error) {
        if (!isCancellationError(error)) {
            logError(error);
        }

        let newFailureCount = (tracking?.consecutiveFailures ?? 0) + 1;

        if (newFailureCount >= MAX_CONSECUTIVE_FAILURES) {
            debugLog(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures`, { level: "warn" });
        }

        return {
            wasCompacted: false,
            consecutiveFailures: newFailureCount
        };
    }
}

// Mapping: sqq→autoCompactDispatcher, A→messages, q→toolUseContext, K→sessionContext, Y→querySource, z→tracking, aqq→MAX_CONSECUTIVE_FAILURES
```

**Why this approach:**
- Circuit breaker prevents infinite retry loops
- Fast path for session memory mode
- Tracks failures across turns for graceful degradation

---

## 7. UI Design Interaction Patterns

### 7.1 Input Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INPUT HANDLING FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │ Keyboard Event  │                                                        │
│  │ (key, ctrl,     │                                                        │
│  │  meta, shift)   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                               │
│  │ Is Shortcut?    │────►│ Execute Action  │                               │
│  │ (Ctrl+*)        │     │ (copy, paste,   │                               │
│  └────────┬────────┘     │  interrupt)     │                               │
│           │ No           └─────────────────┘                               │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ Is Escape?      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├─── Yes ──► ┌─────────────────┐                                  │
│           │            │ Interrupt Mode? │                                  │
│           │            └────────┬────────┘                                  │
│           │                     │                                           │
│           │                     ├─── Interruptible ──► Abort tools          │
│           │                     └─── Not interruptible ──► Abort stream     │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ Is Enter?       │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├─── Yes ──► ┌─────────────────┐                                  │
│           │            │ Shift?          │                                  │
│           │            └────────┬────────┘                                  │
│           │                     │                                           │
│           │                     ├─── No ──► Submit message                  │
│           │                     └─── Yes ──► Newline                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ Character Input │                                                        │
│  │ Append to buffer│                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Message Rendering Pipeline

```javascript
// ============================================
// Message Rendering Pipeline
// ============================================

/**
 * Stages:
 * 1. Message received from agent loop
 * 2. Pre-processing (format detection, truncation)
 * 3. Virtualization (only render visible messages)
 * 4. Syntax highlighting (code blocks)
 * 5. Diff rendering (for Edit tool results)
 * 6. Terminal output ( Ink render)
 */

function renderMessage(message, state) {
    switch (message.type) {
        case "user":
            return renderUserMessage(message);
        case "assistant":
            return renderAssistantMessage(message, state);
        case "system":
            return renderSystemMessage(message);
        case "tombstone":
            // Remove from display
            return null;
        case "stream_event":
            return renderStreamEvent(message.event);
    }
}

function renderAssistantMessage(message, state) {
    let content = message.message.content;

    return (
        <Box flexDirection="column">
            {content.map((block, index) => {
                switch (block.type) {
                    case "text":
                        return <Text key={index}>{block.text}</Text>;
                    case "thinking":
                        return <ThinkingBlock key={index} thinking={block.thinking} />;
                    case "tool_use":
                        return <ToolUseBlock key={index} tool={block} state={state} />;
                    default:
                        return null;
                }
            })}
        </Box>
    );
}
```

### 7.3 Dialog Priority System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DIALOG PRIORITY SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Priority Level 1 (Highest): Permission Dialogs                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Tool permission prompts                                            │    │
│  │ • Session start permission requests                                  │    │
│  │ • Always block other interactions                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Priority Level 2: User Input Dialogs                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Elicitation hooks                                                  │    │
│  │ • Confirmation prompts                                               │    │
│  │ • Block streaming but can be cancelled                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Priority Level 3: Notification Dialogs                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Error notifications                                                │    │
│  │ • Status updates                                                     │    │
│  │ • Non-blocking, auto-dismiss                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Priority Level 4 (Lowest): Background Indicators                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Spinner                                                            │    │
│  │ • Progress bars                                                      │    │
│  │ • Status line updates                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Feature Cross-Linkage

### 8.1 CLI ↔ System Reminder

```
CLI Flags                    System Reminder Attachment
───────────                  ──────────────────────────
--plan                       → plan_mode attachment
--team-name                  → team_context attachment
--dangerously-skip-perm      → Affects permission attachment
--resume                     → Restores previous reminders
--name                       → session_name attachment
```

### 8.2 UI ↔ System Reminder

```
UI State                     System Reminder Behavior
──────────                   ─────────────────────────
isMeta: true                 → Hidden from chat display
Streaming active             → Real-time reminder injection
Dialog open                  → Elicitation result attachment
Permission prompt            → Hook response attachment
```

### 8.3 LLM Core ↔ System Reminder

```
LLM Phase                    System Reminder Integration
──────────                   ───────────────────────────
Pre-turn                     → assembleAllAttachments()
Message normalization        → normalizeAttachmentForAPI()
Token tracking               → token_usage attachment
Tool execution               → hook_additional_context
```

### 8.4 Feature Interaction Matrix

| Feature | CLI | UI | LLM Core | System Reminder |
|---------|-----|----|---------|-----------------|
| Plan Mode | --plan flag | Plan indicator | plan_mode attachment | Full/sparse variants |
| Team Mode | --team-name | Team status | team_context | Mailbox delivery |
| Compact | DISABLE_COMPACT | Compact indicator | autoCompactDispatcher | Compaction reminders |
| Hooks | --init flags | Hook dialogs | Hook execution | Hook response attachments |
| Thinking | --effort flag | Thinking display | thinkingConfig | ultrathink_effort attachment |
| Permissions | --permission-mode | Permission dialogs | Permission context | Permission attachments |

---

## 9. System Reminder Integration

### 9.1 assembleAllAttachments (_uY) - Attachment Orchestrator

```javascript
// ============================================
// assembleAllAttachments - Main attachment orchestrator
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
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), ...] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", ...), Hz("ultrathink_effort", ...), ...],
        D = H ? [Hz("ide_selection", ...), Hz("token_usage", ...), ...] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter(Boolean)
}

// READABLE (for understanding):
async function assembleAllAttachments(atMentionedFiles, toolUseContext, ideContext, queuedCommands, messages, querySource) {
    // Check if attachments are disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout(() => abortController.abort(), 1000);

    let contextWithAbort = {
        ...toolUseContext,
        abortController
    };

    let isMainThread = !toolUseContext.agentId;

    // Phase 1: @-mentioned files (if any)
    let atMentionAttachments = atMentionedFiles
        ? await Promise.all([
            timedAttachmentProducer("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, contextWithAbort)),
            timedAttachmentProducer("mcp_resources", () => produceMcpResources(atMentionedFiles, contextWithAbort)),
            timedAttachmentProducer("agent_mentions", () => Promise.resolve(produceAgentMentions(toolUseContext.options.agentDefinitions.activeAgents)))
        ])
        : [];

    // Phase 2: Always-produced attachments
    let coreAttachments = await Promise.all([
        timedAttachmentProducer("date_change", () => Promise.resolve(produceDateChangeAttachment())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(produceUltrathinkEffortAttachment(messages))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(produceDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(produceMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("changed_files", () => produceChangedFilesAttachment(contextWithAbort)),
        timedAttachmentProducer("nested_memory", () => produceNestedMemoryAttachment(contextWithAbort)),
        timedAttachmentProducer("dynamic_skill", () => produceDynamicSkillAttachment(contextWithAbort)),
        timedAttachmentProducer("skill_listing", () => produceSkillListingAttachment(contextWithAbort)),
        timedAttachmentProducer("ultra_claude_md", async () => produceUltraClaudeMdAttachment(messages)),
        timedAttachmentProducer("plan_mode", () => producePlanModeAttachment(messages, toolUseContext)),
        timedAttachmentProducer("plan_mode_exit", () => producePlanModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("auto_mode", () => produceAutoModeAttachment(messages, toolUseContext)),
        timedAttachmentProducer("auto_mode_exit", () => produceAutoModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("todo_reminders", () => isTaskSystemEnabled() ? produceTaskReminder(messages, toolUseContext) : produceTodoReminder(messages, toolUseContext)),
        // Team mode attachments (if applicable)
        ...(isTeamMode() ? [
            ...(querySource === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => produceTeammateMailboxAttachment(toolUseContext))]),
            timedAttachmentProducer("team_context", async () => produceTeamContextAttachment(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => produceAgentPendingMessagesAttachment(toolUseContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(produceCriticalSystemReminder(toolUseContext)))
    ]);

    // Phase 3: Main-thread-only attachments
    let mainThreadAttachments = isMainThread
        ? await Promise.all([
            timedAttachmentProducer("ide_selection", async () => produceIdeSelectionAttachment(ideContext, toolUseContext)),
            timedAttachmentProducer("ide_opened_file", async () => produceIdeOpenedFileAttachment(ideContext, toolUseContext)),
            timedAttachmentProducer("output_style", async () => Promise.resolve(produceOutputStyleAttachment())),
            timedAttachmentProducer("diagnostics", async () => produceDiagnosticsAttachment(toolUseContext)),
            timedAttachmentProducer("lsp_diagnostics", async () => produceLspDiagnosticsAttachment(toolUseContext)),
            timedAttachmentProducer("unified_tasks", async () => produceUnifiedTasksAttachment(toolUseContext)),
            timedAttachmentProducer("async_hook_responses", async () => produceAsyncHookResponsesAttachment()),
            timedAttachmentProducer("token_usage", async () => Promise.resolve(produceTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
            timedAttachmentProducer("budget_usd", async () => Promise.resolve(produceBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
            timedAttachmentProducer("output_token_usage", async () => Promise.resolve(produceOutputTokenUsageAttachment())),
            timedAttachmentProducer("verify_plan_reminder", async () => produceVerifyPlanReminderAttachment(messages, toolUseContext)),
            timedAttachmentProducer("queued_commands", () => produceQueuedCommandsAttachment(queuedCommands))
        ])
        : [];

    clearTimeout(timeoutId);

    // Flatten and filter
    return [
        ...atMentionAttachments.flat(),
        ...coreAttachments.flat(),
        ...mainThreadAttachments.flat()
    ].filter(attachment => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, Hz→timedAttachmentProducer, sK→createAbortController
```

### 9.2 normalizeAttachmentForAPI (Ui8) - Attachment Normalizer

```javascript
// ============================================
// normalizeAttachmentForAPI - Convert attachments to API messages
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({
            content: Kzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [p1({
            content: `<system-reminder>...Team Coordination...</system-reminder>`,
            isMeta: !0
        })];
    }
    switch (A.type) {
        case "directory":
            return b5([nr6(J4.name, {...}), ir6(J4, {...})]);
        case "file":
            // ... file handling
        case "plan_mode":
            // ... plan mode handling
        // ... more cases
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Team mode special handling
    if (isTeamMode()) {
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

    // Main dispatch switch
    switch (attachment.type) {
        case "directory":
            // Create synthetic tool call/result for directory listing
            return wrapWithSystemReminderTags([
                createToolCallMessage("Bash", {
                    command: `ls ${formatPaths([attachment.path])}`,
                    description: `Lists files in ${attachment.path}`
                }),
                createToolResultMessage("Bash", {
                    stdout: attachment.content,
                    stderr: "",
                    interrupted: false
                })
            ]);

        case "file":
            let content = attachment.content;
            switch (content.type) {
                case "image":
                    return wrapWithSystemReminderTags([
                        createToolCallMessage("Read", { file_path: attachment.filename }),
                        createToolResultMessage("Read", content)
                    ]);
                case "text":
                    return wrapWithSystemReminderTags([
                        createToolCallMessage("Read", { file_path: attachment.filename }),
                        createToolResultMessage("Read", content),
                        ...(attachment.truncated ? [createUserMessage({
                            content: `Note: The file ${attachment.filename} was too large and has been truncated...`,
                            isMeta: true
                        })] : [])
                    ]);
                case "notebook":
                case "pdf":
                    return wrapWithSystemReminderTags([
                        createToolCallMessage("Read", { file_path: attachment.filename }),
                        createToolResultMessage("Read", content)
                    ]);
            }
            break;

        case "edited_text_file":
            return wrapWithSystemReminderTags([createUserMessage({
                content: `Note: ${attachment.filename} was modified, either by the user or by a linter...`,
                isMeta: true
            })]);

        case "selected_lines_in_ide":
            let truncatedContent = attachment.content.length > 2000
                ? attachment.content.substring(0, 2000) + "\n... (truncated)"
                : attachment.content;
            return wrapWithSystemReminderTags([createUserMessage({
                content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:\n${truncatedContent}\n\nThis may or may not be related to the current task.`,
                isMeta: true
            })]);

        case "plan_mode":
            // Dispatch to plan mode variant selector
            return planModeReminderDispatcher(attachment);

        case "todo_reminder":
            let todoContent = attachment.content.map((item, index) =>
                `${index + 1}. [${item.status}] ${item.content}`
            ).join("\n");
            let reminderText = `The TodoWrite tool hasn't been used recently...`;
            if (todoContent.length > 0) {
                reminderText += `\n\nHere are the existing contents of your todo list:\n\n[${todoContent}]`;
            }
            return wrapWithSystemReminderTags([createUserMessage({
                content: reminderText,
                isMeta: true
            })]);

        case "token_usage":
            return wrapWithSystemReminderTags([createUserMessage({
                content: formatTokenUsageMessage(attachment),
                isMeta: true
            })]);

        // ... many more cases

        default:
            // Silent types return empty array
            return [];
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, p1→createUserMessage, b5→wrapWithSystemReminderTags, nr6→createToolCallMessage, ir6→createToolResultMessage
```

---

## 10. Performance Considerations

### 10.1 Streaming Latency Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STREAMING LATENCY OPTIMIZATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Immediate Event Yielding                                                 │
│     • SSE events yielded to UI immediately upon arrival                     │
│     • No batching of events                                                 │
│     • UI uses useDeferredValue for non-critical updates                     │
│                                                                              │
│  2. First Token Time (TTFT) Tracking                                        │
│     • Perf marks: query_fn_entry → query_first_chunk_received               │
│     • Alert if TTFT > 1000ms                                                │
│     • Stall detection: >30s gap between events                              │
│                                                                              │
│  3. Tool Execution Parallelization                                          │
│     • Concurrency-safe tools (Read, Grep, Glob) run in parallel             │
│     • Non-safe tools (Write, Edit, Bash) run sequentially                   │
│     • Results yielded as they complete                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Token Efficiency

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOKEN EFFICIENCY STRATEGIES                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Deferred Tool Loading                                                   │
│     • Only include tools referenced in conversation                         │
│     • Deferred tools list sent as attachment                                │
│     • Load on-demand when first referenced                                  │
│                                                                              │
│  2. Prompt Caching                                                          │
│     • System prompt cached (ephemeral)                                      │
│     • Repeated user messages cached                                         │
│     • Cache write avoidance for single-turn queries                         │
│                                                                              │
│  3. Auto-Compaction                                                         │
│     • Triggers at 80% of context window                                     │
│     • Circuit breaker after 3 consecutive failures                          │
│     • Preserves recent messages + summaries                                 │
│                                                                              │
│  4. Attachment Optimization                                                 │
│     • 1-second timeout for attachment production                            │
│     • Truncation for large files (1000 lines default)                       │
│     • Silent types skipped (no API payload)                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Error Recovery Patterns

```javascript
// Error Recovery Decision Tree

/*
Streaming Error?
├── Abort signal?
│   ├── User interrupt → Yield cancelled message
│   └── Timeout → Throw timeout error
├── Network error?
│   └── Retry with exponential backoff (max 3 retries)
├── Context overflow?
│   ├── Try reactive compact
│   │   └── Success → Retry request
│   └── Failure → Yield error message
└── Unknown error?
    ├── Non-streaming fallback enabled?
    │   ├── Yes → Retry in non-streaming mode
    │   └── No → Yield error message
    └── Yield error message
*/

async function handleStreamingError(error, context) {
    // Check for abort
    if (context.signal.aborted) {
        if (context.signal.reason === "interrupt") {
            return { type: "cancelled", reason: "user_interrupted" };
        }
        throw new TimeoutError("Request timed out");
    }

    // Check for retryable errors
    if (isRetryableError(error)) {
        return { type: "retry", delay: calculateBackoff(context.retryCount) };
    }

    // Check for context overflow
    if (isContextOverflowError(error)) {
        if (!context.hasAttemptedReactiveCompact) {
            let compactResult = await reactiveCompact(context.messages);
            if (compactResult.success) {
                return { type: "retry_with_compacted", messages: compactResult.messages };
            }
        }
        return { type: "error", message: "Context window exceeded" };
    }

    // Check for non-streaming fallback
    if (!isNonStreamingFallbackDisabled()) {
        return { type: "fallback_to_non_streaming" };
    }

    return { type: "error", message: error.message };
}
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (Compact, Thinking, Steering)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE)

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All modules documented with source-level restoration and cross-validated symbols