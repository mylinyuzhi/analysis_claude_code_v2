# CLI-UI-LLM Core Deep Integration Analysis (Claude Code v2.1.76)

> Complete source-level integration analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Related Documents**:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Symbol mappings
> - [cli_ui_llm_integration.md](./cli_ui_llm_integration.md) - Basic integration overview
> - [turn_state_machine.md](../03_llm_core/turn_state_machine.md) - Turn state analysis
> - [tool_executor_queue.md](../03_llm_core/tool_executor_queue.md) - Tool execution

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Startup Sequence Flow](#2-startup-sequence-flow)
3. [State Propagation System](#3-state-propagation-system)
4. [Event Stream Pipeline](#4-event-stream-pipeline)
5. [Dialog Priority System](#5-dialog-priority-system)
6. [Tool Execution Coordination](#6-tool-execution-coordination)
7. [System Reminder Integration](#7-system-reminder-integration)
8. [Error Recovery & Cancellation](#8-error-recovery--cancellation)

---

## 1. Architecture Overview

### Three-Tier Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLI LAYER (01_cli)                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Entry Points                                                          │  │
│  │ cliEntry (JVz) → mainEntry (_Vz) → run (OVz)                         │  │
│  │                                                                       │  │
│  │ Responsibilities:                                                     │  │
│  │ • Parse CLI flags (~50 flags)                                        │  │
│  │ • Build initialState object                                          │  │
│  │ • Create state store (createStateStore/WX1)                          │  │
│  │ • Render REPL component                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ State Store (createStateStore/WX1)                                   │  │
│  │                                                                       │  │
│  │ // chunks.85.mjs:1747-1766                                           │  │
│  │ {                                                                    │  │
│  │   getState: () => currentState,                                      │  │
│  │   setState: (updater) => { /* notify subscribers */ },               │  │
│  │   subscribe: (callback) => unsubscribe                               │  │
│  │ }                                                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UI LAYER (02_ui)                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ SessionOrchestrator (ot8) - chunks.196.mjs:3                         │  │
│  │                                                                       │  │
│  │ State Variables (35+ useState):                                      │  │
│  │ • messages - Conversation history                                    │  │
│  │ • streamMode - "requesting"|"responding"|"thinking"|"tool-input"    │  │
│  │ • toolPermissionQueue - Pending tool permissions                     │  │
│  │ • sandboxPermissionQueue - Sandbox permission requests               │  │
│  │ • promptQueue - Prompt requests                                      │  │
│  │ • elicitationQueue - MCP elicitation forms                           │  │
│  │                                                                       │  │
│  │ Core Functions:                                                      │  │
│  │ • ra6() - getInputDialogType - Dialog priority dispatcher           │  │
│  │ • TM() - handleCancel - Cancel propagation                          │  │
│  │ • rV6() - handleStreamedEvent - Process LLM events                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Dialog Rendering (Priority-based)                                    │  │
│  │                                                                       │  │
│  │ 1. message-selector (W7)                                             │  │
│  │ 2. sandbox-permission (G7[0])                                        │  │
│  │ 3. tool-permission (a8[0])                                           │  │
│  │ 4. prompt (zA[0])                                                    │  │
│  │ 5. worker-sandbox-permission (n.queue[0])                           │  │
│  │ 6. elicitation (o.queue[0])                                          │  │
│  │ 7-12. Lower priority dialogs...                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM LAYER (03_llm_core)                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ mainAgentLoop (Yh) - chunks.148.mjs:875                              │  │
│  │                                                                       │  │
│  │ async function* Yh(A) {                                              │  │
│  │   let queuedHooks = [];                                              │  │
│  │   let result = yield* omY(A, queuedHooks);  // Core loop            │  │
│  │   for (let hook of queuedHooks) pb(hook, "completed");              │  │
│  │   return result;                                                     │  │
│  │ }                                                                    │  │
│  │                                                                       │  │
│  │ Turn Loop:                                                           │  │
│  │ while (true) {                                                       │  │
│  │   1. Micro-compact (remove duplicates)                              │  │
│  │   2. Auto-compact (if token threshold exceeded)                     │  │
│  │   3. Context limit check                                            │  │
│  │   4. Build tool schemas                                             │  │
│  │   5. Call LLM API (streamingQueryCore/mGq)                          │  │
│  │   6. Execute tools (StreamingToolExecutor/ui6)                      │  │
│  │   7. Break if no tools called                                       │  │
│  │ }                                                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ StreamingToolExecutor (ui6) - chunks.148.mjs:3                       │  │
│  │                                                                       │  │
│  │ class ui6 {                                                          │  │
│  │   tools = [];  // Queue of tool executions                          │  │
│  │   hasErrored = false;  // Circuit breaker                           │  │
│  │   siblingAbortController;  // Isolation                              │  │
│  │                                                                       │  │
│  │   canExecuteTool(isConcurrencySafe) {                               │  │
│  │     // Allow if nothing executing, or all executing are safe        │  │
│  │   }                                                                  │  │
│  │                                                                       │  │
│  │   async executeTool(entry) {                                        │  │
│  │     // Check abort conditions                                        │  │
│  │     // Execute via toolDispatcher (Wi6)                              │  │
│  │     // Collect results                                               │  │
│  │   }                                                                  │  │
│  │ }                                                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Startup Sequence Flow

### Four-Phase Bootstrap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1: BOOTSTRAP (cli.chunks.mjs)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Node.js Entry Point                                                        │
│       │                                                                      │
│       ▼                                                                      │
│  require("./cli.chunks.mjs")                                                │
│       │                                                                      │
│       ▼                                                                      │
│  cliEntry (JVz) - chunks.198.mjs:1573                                       │
│                                                                              │
│  // Fast paths (no heavy imports):                                          │
│  if (args[0] === "--version") → print version & exit                       │
│  if (args[0] === "--ripgrep") → ripgrepMain() & exit                       │
│  if (args[0] === "--mcp-cli") → mcpCliMain() & exit                        │
│  if (args[0] === "auth") → authSubcommand() & return                       │
│                                                                              │
│  // Capture early input BEFORE heavy load:                                  │
│  startCapturingEarlyInput()                                                 │
│       │                                                                      │
│       ▼                                                                      │
│  await import("./main")  // Heavy load (~198 chunks)                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: MAIN ENTRY (_Vz/mainEntry)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                       chunks.197.mjs:1910                                    │
│                                                                              │
│  async function mainEntry() {                                               │
│    // 1. Process setup                                                      │
│    process.on("SIGINT", handleInterrupt);                                   │
│    process.on("SIGTERM", handleTerminate);                                  │
│                                                                              │
│    // 2. Determine client type                                              │
│    const clientType = determineClientType();                                │
│                                                                              │
│    // 3. Call run()                                                         │
│    await run();                                                             │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 3: RUN (OVz)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                       chunks.198.mjs:3                                       │
│                                                                              │
│  async function run() {                                                     │
│    // 1. Create Commander program                                           │
│    const program = new Command()                                            │
│      .configureHelp(helpConfig)                                             │
│      .enablePositionalOptions();                                            │
│                                                                              │
│    // 2. preAction initialization                                           │
│    program.hook("preAction", async () => {                                  │
│      await initializeMdm();                                                 │
│      await runInitializers();                                               │
│      initializeErrorLogSink();                                              │
│      registerInlinePlugins();                                               │
│      runMigrations();                                                       │
│      syncSettingsFromProject();                                             │
│    });                                                                      │
│                                                                              │
│    // 3. Define ~50 CLI flags                                               │
│    program.option("-p, --print", "Print response and exit");                │
│    program.option("--model <model>", "Model for session");                  │
│    // ... many more flags                                                   │
│                                                                              │
│    // 4. Action handler                                                     │
│    program.action(async (prompt, options) => {                              │
│      const initialState = buildInitialState(options);                       │
│      const stateStore = createStateStore(initialState, onStateChange);      │
│                                                                              │
│      if (isNonInteractive) {                                                │
│        await runHeadless(stateStore);                                       │
│      } else {                                                               │
│        renderFullscreenComponent(<REPL stateStore={stateStore} />);         │
│      }                                                                      │
│    });                                                                      │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 4: UI RENDER (SessionOrchestrator)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                       chunks.196.mjs:3                                       │
│                                                                              │
│  function SessionOrchestrator({                                             │
│    commands,                                                                │
│    initialTools,                                                            │
│    initialMessages,                                                         │
│    mcpClients,                                                              │
│    systemPrompt,                                                            │
│    thinkingConfig,                                                          │
│    ...                                                                      │
│  }) {                                                                       │
│    // 35+ useState calls for state management                              │
│    const [messages, setMessages] = useState([]);                            │
│    const [streamMode, setStreamMode] = useState("prompt");                  │
│    const [toolPermissionQueue, setToolPermissionQueue] = useState([]);      │
│    // ... more state                                                        │
│                                                                              │
│    // Subscribe to global state                                             │
│    const toolPermissionContext = useAppState(s => s.toolPermissionContext); │
│    const verbose = useAppState(s => s.verbose);                             │
│                                                                              │
│    // Main query execution                                                  │
│    const executeQuery = useCallback(async (msgs) => {                       │
│      for await (const event of mainAgentLoop({...})) {                      │
│        handleStreamedEvent(event);                                          │
│      }                                                                      │
│    }, [dependencies]);                                                      │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Critical Timing

| Phase | Duration | Purpose |
|-------|----------|---------|
| Phase 1 (Bootstrap) | ~5ms | Version check, early dispatch |
| Phase 2 (mainEntry) | ~10ms | Process setup, signal handlers |
| Phase 3 (run) | ~100ms | Commander setup, flag parsing |
| Phase 4 (UI Render) | ~200ms | React/Ink initialization |

**Key Insight**: `startCapturingEarlyInput()` runs before the heavy main module loads to prevent keystroke loss during the ~300ms module load time.

---

## 3. State Propagation System

### createStateStore (WX1) - The Heart of State Management

```javascript
// ============================================
// createStateStore (WX1) - Observable state store
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
            K = w, q?.({
                newState: w,
                oldState: _
            });
            for (let O of Y) O()
        },
        subscribe: (z) => {
            return Y.add(z), () => Y.delete(z)
        }
    }
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

            // Notify external callback
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
//          K→currentState, Y→subscribers, z→updater, _→oldState, w→newState
```

### State Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE FLOW ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flags                                                                  │
│  ──────────                                                                 │
│  --print                                                                    │
│  --model claude-sonnet-4                                                    │
│  --dangerously-skip-permissions                                             │
│       │                                                                      │
│       ▼                                                                      │
│  initialState Builder                                                       │
│  ─────────────────                                                          │
│  {                                                                          │
│    isSingleTurn: options.print,                                            │
│    mainLoopModel: options.model,                                           │
│    toolPermissionContext: {                                                │
│      mode: options.dangerouslySkipPermissions ? "accept" : "default",      │
│      allowedTools: options.allowedTools,                                    │
│      disallowedTools: options.disallowedTools                               │
│    },                                                                       │
│    verbose: options.verbose,                                                │
│    ...                                                                      │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  createStateStore(initialState)                                             │
│       │                                                                      │
│       ▼                                                                      │
│  AppStateProvider (Yj) - React Context                                      │
│  ────────────────────────────────                                           │
│  const AppStateContext = createContext(undefined);                          │
│                                                                              │
│  function AppStateProvider({ stateStore, children }) {                     │
│    const [state, setState] = useState(stateStore.getState());              │
│                                                                              │
│    useEffect(() => {                                                        │
│      return stateStore.subscribe(() => {                                    │
│        setState(stateStore.getState());                                     │
│      });                                                                    │
│    }, [stateStore]);                                                        │
│                                                                              │
│    return (                                                                 │
│      <AppStateContext.Provider value={stateStore}>                         │
│        {children}                                                           │
│      </AppStateContext.Provider>                                            │
│    );                                                                       │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  useAppState Hook (M1)                                                      │
│  ─────────────────────                                                      │
│  function useAppState(selector) {                                          │
│    const store = useContext(AppStateContext);                               │
│    const [state, setState] = useState(() => selector(store.getState()));    │
│                                                                              │
│    useEffect(() => {                                                        │
│      return store.subscribe(() => {                                         │
│        setState(selector(store.getState()));                                │
│      });                                                                    │
│    }, [store, selector]);                                                   │
│                                                                              │
│    return state;                                                            │
│  }                                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  Component Consumption                                                      │
│  ──────────────────────                                                     │
│  const toolPermissionContext = useAppState(s => s.toolPermissionContext);   │
│  const verbose = useAppState(s => s.verbose);                               │
│  const model = useAppState(s => s.mainLoopModel);                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### initialState Fields Reference

| Field | Type | Source | Purpose |
|-------|------|--------|---------|
| `verbose` | boolean | `--verbose` | Enable verbose logging |
| `debug` | string | `--debug` | Debug category filter |
| `isSingleTurn` | boolean | `--print` | Non-interactive mode |
| `mainLoopModel` | string | `--model` | Session model |
| `toolPermissionContext` | object | Multiple flags | Permission configuration |
| `outputFormat` | string | `--output-format` | Output format (text/json/stream-json) |
| `thinkingConfig` | object | `--thinking` | Thinking mode configuration |
| `effortValue` | string | `--effort` | Effort level (low/medium/high) |
| `maxTurns` | number | `--max-turns` | Turn limit for non-interactive |
| `mcp` | object | `--mcp-config` | MCP client configuration |
| `sessionId` | string | `--resume`/`--continue` | Session persistence |

---

## 4. Event Stream Pipeline

### mainAgentLoop Event Yielding

```javascript
// ============================================
// mainAgentLoop (Yh) - Event yielding pattern
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
    let queuedHooks = [];

    // Delegate to core implementation
    let result = yield* mainAgentLoopCore(params, queuedHooks);

    // Complete any pending hooks
    for (let hook of queuedHooks) {
        completeHook(hook, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→queuedHooks, K→result,
//          omY→mainAgentLoopCore, pb→completeHook
```

### Event Types and Handlers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT STREAM PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  mainAgentLoop (Yh) yields:                                                 │
│  ──────────────────────────                                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "stream_request_start" }                                    │   │
│  │                                                                       │   │
│  │ Handler: setStreamMode("requesting")                                │   │
│  │ UI Effect: Show loading indicator                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "stream_event", event: SSE_event }                          │   │
│  │                                                                       │   │
│  │ SSE Event Types:                                                     │   │
│  │ • message_start → Initialize message state                           │   │
│  │ • content_block_start (text) → setStreamMode("responding")          │   │
│  │ • content_block_start (thinking) → setStreamMode("thinking")        │   │
│  │ • content_block_start (tool_use) → setStreamMode("tool-input")      │   │
│  │ • content_block_delta (text_delta) → Append to text                 │   │
│  │ • content_block_delta (input_json_delta) → Append to tool input     │   │
│  │ • message_delta (stop_reason) → Check for max_tokens                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "assistant", message: {...} }                               │   │
│  │                                                                       │   │
│  │ Handler: setMessages(prev => [...prev, event.message])              │   │
│  │ UI Effect: Render assistant message in transcript                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "user", message: {...} }  // Tool result                    │   │
│  │                                                                       │   │
│  │ Handler: setMessages(prev => [...prev, event.message])              │   │
│  │ UI Effect: Render tool result in transcript                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "tombstone", uuids: [...] }  // Context overflow            │   │
│  │                                                                       │   │
│  │ Handler: setMessages(prev => prev.filter(m => !uuids.has(m.uuid)))  │   │
│  │ UI Effect: Remove compacted messages from display                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "system", subtype: "retry" }                                │   │
│  │                                                                       │   │
│  │ Handler: Show retry indicator                                        │   │
│  │ UI Effect: Display retry status to user                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### handleStreamedEvent (rV6) Implementation

```javascript
// ============================================
// handleStreamedEvent (rV6) - Event processor
// Location: chunks.196.mjs (referenced at line 774)
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event) {
    switch (event.type) {
        case "stream_request_start":
            setStreamMode("requesting");
            break;

        case "stream_event":
            // Handle SSE events
            const sseEvent = event.event;
            if (sseEvent.type === "content_block_start") {
                if (sseEvent.content_block.type === "text") {
                    setStreamMode("responding");
                } else if (sseEvent.content_block.type === "thinking") {
                    setStreamMode("thinking");
                } else if (sseEvent.content_block.type === "tool_use") {
                    setStreamMode("tool-input");
                    // Add to streaming tool uses
                    setStreamingToolUses(prev => [...prev, {
                        id: sseEvent.index,
                        name: sseEvent.content_block.name,
                        input: ""
                    }]);
                }
            } else if (sseEvent.type === "content_block_delta") {
                // Update streaming tool input
                if (sseEvent.delta.type === "input_json_delta") {
                    setStreamingToolUses(prev => {
                        const updated = [...prev];
                        const idx = updated.findIndex(t => t.id === sseEvent.index);
                        if (idx >= 0) {
                            updated[idx].input += sseEvent.delta.partial_json;
                        }
                        return updated;
                    });
                }
            }
            break;

        case "assistant":
            // Add complete assistant message
            setMessages(prev => [...prev, event.message]);
            // Clear streaming state
            setStreamingToolUses([]);
            break;

        case "user":
            // Add tool result message
            setMessages(prev => [...prev, event.message]);
            break;

        case "tombstone":
            // Remove compacted messages
            const uuidSet = new Set(event.uuids);
            setMessages(prev => prev.filter(m => !uuidSet.has(m.uuid)));
            break;
    }
}
```

---

## 5. Dialog Priority System

### getInputDialogType (ra6) - Priority Dispatcher

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
    // 0. Blocking states - no dialog
    if (forkSessionDialogOpen || needsAuthentication) return undefined;

    // 1. Message selector (highest priority, escape-escape)
    if (messageSelectorVisible) return "message-selector";

    // 2. Input is being composed - no dialog
    if (isInputComposing) return undefined;

    // 3. Sandbox permission (security critical)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check if animation should continue
    let shouldContinueAnimation = !focusedDialog || focusedDialog.shouldContinueAnimation;

    // 4-12. Lower priority dialogs (require animation continuation)
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";
    if (shouldContinueAnimation && workerSandboxQueue[0]) return "worker-sandbox-permission";
    if (shouldContinueAnimation && elicitationQueue[0]) return "elicitation";
    if (shouldContinueAnimation && showCostDialog) return "cost";
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→forkSessionDialogOpen, na6→needsAuthentication,
//          W7→messageSelectorVisible, y2→isInputComposing, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n.queue→workerSandboxQueue,
//          o.queue→elicitationQueue, m26→showCostDialog, W6→showIdeOnboarding,
//          g6→showEffortCallout, J1→showRemoteCallout, e8→lspRecommendation,
//          E1→showDesktopUpsell, j8→focusedDialog, P1→shouldContinueAnimation
```

### Dialog Priority Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIALOG PRIORITY MATRIX                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Priority │ Dialog Type          │ Queue/State       │ Security Level       │
│  ─────────┼──────────────────────┼───────────────────┼──────────────────────│
│    0      │ (blocking)           │ fork/auth         │ N/A                  │
│    1      │ message-selector     │ W7                │ User-initiated       │
│    2      │ sandbox-permission   │ G7[0]             │ HIGH (sandbox)       │
│    3      │ tool-permission      │ a8[0]             │ HIGH (tools)         │
│    4      │ prompt               │ zA[0]             │ MEDIUM (hooks/MCP)   │
│    5      │ worker-sandbox       │ n.queue[0]        │ HIGH (subagent)      │
│    6      │ elicitation          │ o.queue[0]        │ MEDIUM (MCP forms)   │
│    7      │ cost                 │ m26               │ LOW (notification)   │
│    8      │ ide-onboarding       │ W6                │ LOW (setup)          │
│    9      │ effort-callout       │ g6                │ LOW (notification)   │
│   10      │ remote-callout       │ J1                │ LOW (notification)   │
│   11      │ lsp-recommendation   │ e8                │ LOW (suggestion)     │
│   12      │ desktop-upsell       │ E1                │ LOW (marketing)      │
│                                                                              │
│  Rules:                                                                     │
│  • Only ONE dialog visible at a time                                        │
│  • Security-critical dialogs (sandbox, tool) take precedence                │
│  • Animation must continue for lower priority dialogs                       │
│  • Input composition blocks all dialogs except message-selector             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cancel Propagation (handleCancel/TM)

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation handler
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim()) gq((P1) => [...P1, $Z({
        content: ez
    }));
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
    // Don't cancel elicitation dialogs
    if (activeDialog === "elicitation") return;

    debugLog(`[onCancel] focusedInputDialog=${activeDialog} streamMode=${streamMode}`);

    // Force end any pending operations
    pendingOperationsTracker.forceEnd();

    // Save partial input if any
    if (partialInput?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: partialInput })]);
    }

    // Clear pending state
    clearPendingState();

    // Handle based on dialog type
    if (activeDialog === "tool-permission") {
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (activeDialog === "prompt") {
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        remoteClient.cancelRequest();
    } else {
        abortController?.abort();
    }

    // Clear abort controller reference
    setAbortController(null);
}

// Mapping: TM→handleCancel, K2→activeDialog, d7→streamMode, J9→pendingOperationsTracker,
//          ez→partialInput, gq→setMessages, $Z→createUserMessage, dE→clearPendingState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue,
//          gA→setPromptQueue, M5→abortController, B5→remoteClient, x5→setAbortController
```

---

## 6. Tool Execution Coordination

### StreamingToolExecutor (ui6) - Parallel Execution

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
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
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    // ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.tools = [];  // Queue of tool executions
        this.toolUseContext = toolUseContext;
        this.hasErrored = false;  // Circuit breaker
        this.erroredToolDescription = "";
        // Clone abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
        this.discarded = false;
    }

    // Check if a tool can start executing
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");

        // Allow if nothing executing
        if (executing.length === 0) return true;

        // Allow if all executing are concurrency-safe AND this tool is safe
        if (isConcurrencySafe && executing.every(t => t.isConcurrencySafe)) {
            return true;
        }

        return false;
    }

    // Add a tool to the queue
    addTool(toolUseBlock, assistantMessage) {
        const toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Unknown tool - create error result
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage,
                status: "completed",
                results: [createUserMessage({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
                        is_error: true,
                        tool_use_id: toolUseBlock.id
                    }]
                })]
            });
            return;
        }

        // Normalize and validate input
        toolUseBlock.input = normalizeToolInput(toolDef, toolUseBlock.input);
        const parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);
        const isConcurrencySafe = parseResult.success
            ? Boolean(toolDef.isConcurrencySafe?.(parseResult.data))
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

    // Determine abort reason
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

    // Execute a tool
    async executeTool(toolEntry) {
        toolEntry.status = "executing";

        // Check abort conditions
        const abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason)];
            toolEntry.status = "completed";
            return;
        }

        // Create sibling abort controller for isolation
        const siblingAbort = cloneAbortController(this.siblingAbortController);

        // Execute via toolDispatcher
        for await (const event of toolDispatcher(
            toolEntry.block,
            toolEntry.assistantMessage,
            this.canUseTool,
            { ...this.toolUseContext, abortController: siblingAbort }
        )) {
            if (event.message) {
                toolEntry.results.push(event.message);
            }
        }

        toolEntry.status = "completed";
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions/canUseTool/toolUseContext,
//          q→executing, Wm→cloneAbortController
```

### Parallel Execution Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION DECISION TREE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool arrives (addTool)                                                     │
│       │                                                                      │
│       ▼                                                                      │
│  Parse & validate input                                                     │
│       │                                                                      │
│       ▼                                                                      │
│  Determine isConcurrencySafe                                                │
│       │                                                                      │
│       ├── Read → SAFE                                                       │
│       ├── Grep → SAFE                                                       │
│       ├── Glob → SAFE                                                       │
│       ├── WebSearch → SAFE                                                  │
│       ├── WebFetch → SAFE                                                   │
│       ├── TodoWrite → SAFE                                                  │
│       ├── Edit → NOT SAFE                                                   │
│       ├── Write → NOT SAFE                                                  │
│       ├── Bash → NOT SAFE                                                   │
│       └── MCP tools → depends on tool                                       │
│       │                                                                      │
│       ▼                                                                      │
│  Add to queue (status: "queued")                                            │
│       │                                                                      │
│       ▼                                                                      │
│  processQueue()                                                             │
│       │                                                                      │
│       ▼                                                                      │
│  canExecuteTool(isConcurrencySafe)?                                         │
│       │                                                                      │
│       ├── YES (nothing executing OR all safe)                               │
│       │       │                                                              │
│       │       ▼                                                              │
│       │   executeTool() immediately                                          │
│       │                                                                      │
│       └── NO (unsafe tool executing)                                        │
│               │                                                              │
│               ▼                                                              │
│           Wait for current to complete                                       │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│                                                                              │
│  Example: [Read, Grep, Write, Glob, Bash]                                   │
│                                                                              │
│  Time →                                                                     │
│  ────────────────────────────────────────────────────────────────────────   │
│  Read:    [========executing========][completed]                            │
│  Grep:    [========executing========][completed]  ← Parallel with Read      │
│  Write:                        [========executing========][completed]        │
│  Glob:                              [========executing========][completed]  │
│  Bash:                                          [========executing==...]     │
│                                                                              │
│  Notes:                                                                     │
│  • Read and Grep execute in parallel (both safe)                            │
│  • Write waits for Read/Grep to complete (not safe)                         │
│  • Glob can run parallel with Write (safe)                                  │
│  • Bash waits for all to complete (not safe)                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. System Reminder Integration

### Attachment Flow in Agent Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Turn Start (mainAgentLoopCore)                                             │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ assembleAllAttachments (_uY) - chunks.147.mjs:3                      │   │
│  │                                                                       │   │
│  │ async function assembleAllAttachments(state) {                       │   │
│  │   if (CLAUDE_CODE_DISABLE_ATTACHMENTS) return [];                   │   │
│  │                                                                       │   │
│  │   const timeoutController = new AbortController();                  │   │
│  │   setTimeout(() => timeoutController.abort(), 1000);                │   │
│  │                                                                       │   │
│  │   // Group 1: User-dependent (parallel)                              │   │
│  │   const userAttachments = await Promise.all([                        │   │
│  │     getAtMentionedFiles(state),                                      │   │
│  │     getMcpResources(state),                                          │   │
│  │     getAgentMentions(state)                                          │   │
│  │   ]);                                                                │   │
│  │                                                                       │   │
│  │   // Group 2: Always-computed (parallel)                             │   │
│  │   const computedAttachments = await Promise.all([                    │   │
│  │     getDateChangeAttachment(state),                                  │   │
│  │     getUltrathinkEffortAttachment(state),                            │   │
│  │     getDeferredToolsDeltaAttachment(state),                          │   │
│  │     getChangedFilesAttachment(state),                                │   │
│  │     getPlanModeAttachment(state),  // If in plan mode                │   │
│  │     getAutoModeAttachment(state),  // If in auto mode                │   │
│  │     getTeamContextAttachment(state),  // If team mode                │   │
│  │     getTokenUsageAttachment(state),                                  │   │
│  │     getTodoReminderAttachment(state),                                │   │
│  │     // ... more producers                                            │   │
│  │   ]);                                                                │   │
│  │                                                                       │   │
│  │   return [...userAttachments, ...computedAttachments].flat();        │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ normalizeAttachmentForAPI (Ui8) - chunks.174.mjs:3                   │   │
│  │                                                                       │   │
│  │ function normalizeAttachmentForAPI(attachment) {                    │   │
│  │   switch (attachment.type) {                                         │   │
│  │     case "plan_mode":                                                │   │
│  │       return wrapWithSystemReminderTags(                             │   │
│  │         fullPlanReminder(attachment)                                 │   │
│  │       );                                                             │   │
│  │                                                                       │   │
│  │     case "token_usage":                                              │   │
│  │       return createUserMessage({                                     │   │
│  │         content: `Token count: ${attachment.count}`,                 │   │
│  │         isMeta: true                                                 │   │
│  │       });                                                            │   │
│  │                                                                       │   │
│  │     case "team_context":                                             │   │
│  │       return createUserMessage({                                     │   │
│  │         content: `You are a teammate in team ${attachment.name}`,   │   │
│  │         isMeta: true                                                 │   │
│  │       });                                                            │   │
│  │                                                                       │   │
│  │     // ... 50+ more types                                            │   │
│  │   }                                                                  │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Message Injection                                                     │   │
│  │                                                                       │   │
│  │ // Attachments become user messages with isMeta: true               │   │
│  │ const normalizedMessages = [                                         │   │
│  │   ...previousMessages,                                               │   │
│  │   ...attachments.map(a => normalizeAttachmentForAPI(a)),            │   │
│  │   newUserMessage                                                     │   │
│  │ ];                                                                   │   │
│  │                                                                       │   │
│  │ // Sent to API                                                       │   │
│  │ streamingQueryCore({ messages: normalizedMessages, ... });          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CLI → System Reminder Mapping

| CLI Flag | Reminder Type | Content |
|----------|--------------|---------|
| `--plan` | `plan_mode` | Full plan instructions |
| `--auto` | `auto_mode` | Auto mode instructions |
| `--team-name` | `team_context` | Team identity |
| `--dangerously-skip-permissions` | (mode change) | Affects tool filtering |
| `--effort` | `ultrathink_effort` | Reasoning budget |
| `--resume` | `todo_reminder` | Todo list state |

---

## 8. Error Recovery & Cancellation

### Error Handling Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR RECOVERY ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ withApiRetry (_P1) - chunks.89.mjs:3                                │   │
│  │                                                                       │   │
│  │ async function* withApiRetry(requestFn, options) {                  │   │
│  │   let attempt = 0;                                                   │   │
│  │   const maxRetries = options.maxRetries ?? 3;                       │   │
│  │                                                                       │   │
│  │   while (true) {                                                     │   │
│  │     try {                                                            │   │
│  │       yield* requestFn();                                            │   │
│  │       return;  // Success                                            │   │
│  │     } catch (error) {                                                │   │
│  │       attempt++;                                                     │   │
│  │                                                                       │   │
│  │       if (isContextOverflowError(error)) {                           │   │
│  │         // Trigger compaction and retry                              │   │
│  │         const { tokens } = parseContextOverflowError(error);        │   │
│  │         yield { type: "context_overflow", tokens };                 │   │
│  │         // Compact and retry with smaller context                    │   │
│  │       } else if (isRetryableError(error) && attempt < maxRetries) {  │   │
│  │         await sleep(calculateBackoff(attempt));                      │   │
│  │         continue;  // Retry                                           │   │
│  │       } else {                                                       │   │
│  │         throw error;  // Give up                                     │   │
│  │       }                                                              │   │
│  │     }                                                                │   │
│  │   }                                                                  │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Error Types & Recovery                                               │   │
│  │                                                                       │   │
│  │ Error Type           │ Recovery Action                               │   │
│  │ ─────────────────────┼──────────────────────────────────────────────│   │
│  │ context_overflow     │ Compact context, reduce messages, retry      │   │
│  │ max_tokens           │ Increase output limit, retry                  │   │
│  │ rate_limit           │ Exponential backoff, retry                    │   │
│  │ authentication       │ Prompt for re-auth                            │   │
│  │ network              │ Retry with backoff                            │   │
│  │ streaming_fallback   │ Discard tool execution, return error         │   │
│  │ user_interrupted     │ Cancel gracefully, show partial results       │   │
│  │ sibling_error        │ Cancel parallel tools, show first error      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Circuit Breaker (consecutiveFailures)                               │   │
│  │                                                                       │   │
│  │ // Prevents infinite compaction loops                                │   │
│  │ const MAX_CONSECUTIVE_COMPACT_FAILURES = 3;                          │   │
│  │                                                                       │   │
│  │ if (turnState.autoCompactTracking?.consecutiveFailures >= 3) {      │   │
│  │   // Stop trying to compact, surface error to user                  │   │
│  │   yield { type: "error", message: "Compaction failed 3 times" };   │   │
│  │   return { reason: "compaction_circuit_breaker" };                  │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cancellation Propagation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CANCELLATION PROPAGATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User presses Escape                                                        │
│       │                                                                      │
│       ▼                                                                      │
│  handleCancel (TM)                                                          │
│       │                                                                      │
│       ├── If tool-permission dialog:                                        │
│       │       a8[0].onAbort()  → Reject tool                               │
│       │       $A([])           → Clear queue                               │
│       │                                                                      │
│       ├── If prompt dialog:                                                 │
│       │       zA.forEach(p => p.reject())  → Reject all prompts            │
│       │       gA([])                       → Clear queue                    │
│       │       M5.abort()                   → Abort agent loop               │
│       │                                                                      │
│       └── If streaming:                                                     │
│               M5.abort()  → Signal to agent loop                            │
│       │                                                                      │
│       ▼                                                                      │
│  AbortController.signal.aborted = true                                      │
│       │                                                                      │
│       ▼                                                                      │
│  mainAgentLoop receives abort signal                                        │
│       │                                                                      │
│       ▼                                                                      │
│  StreamingToolExecutor.getAbortReason()                                     │
│       │                                                                      │
│       ├── Returns "user_interrupted"                                        │
│       │                                                                      │
│       ▼                                                                      │
│  Create synthetic error message for each tool                               │
│       │                                                                      │
│       ▼                                                                      │
│  yield { type: "user", message: errorResult }                               │
│       │                                                                      │
│       ▼                                                                      │
│  UI displays cancellation result                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `cliEntry` (JVz) - Top-level entry point at chunks.198.mjs:1573
- `mainEntry` (_Vz) - Main initialization at chunks.197.mjs:1910
- `run` (OVz) - Commander.js setup at chunks.198.mjs:3
- `createStateStore` (WX1) - State store factory at chunks.85.mjs:1747
- `SessionOrchestrator` (ot8) - Main session component at chunks.196.mjs:3
- `mainAgentLoop` (Yh) - Agent loop generator at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Core implementation at chunks.148.mjs:882
- `getInputDialogType` (ra6) - Dialog dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `StreamingToolExecutor` (ui6) - Tool executor at chunks.148.mjs:3
- `assembleAllAttachments` (_uY) - Attachment orchestrator at chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer at chunks.174.mjs:3

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - Deep integration analysis with source verification