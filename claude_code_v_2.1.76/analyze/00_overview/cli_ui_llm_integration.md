# CLI-UI-LLM Core Integration Analysis (Claude Code v2.1.76)

> Complete integration analysis of the three core modules: CLI entry point, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-25.
> **Related Documents**: See [turn_state_machine.md](../03_llm_core/turn_state_machine.md), [tool_executor_queue.md](../03_llm_core/tool_executor_queue.md), [keyboard_shortcut_flow.md](../02_ui/keyboard_shortcut_flow.md), [integration_flow.md](../04_system_reminder/integration_flow.md)

---

## Symbol Verification Summary

All major symbols have been cross-validated against source code with exact function signatures:

| Symbol | Readable | Location | Signature | Status |
|--------|----------|----------|-----------|--------|
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | `async function* Yh(A)` | ✅ VERIFIED |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | `async function* omY(A, q)` | ✅ VERIFIED |
| `mGq` | streamingQueryCore | chunks.171.mjs:3 | `async function* mGq(A, q, K, Y, z, _)` | ✅ VERIFIED |
| `ui6` | StreamingToolExecutor | chunks.173.mjs:3 | `class ui6` | ✅ VERIFIED |
| `cM` | normalizeMessages | chunks.173.mjs:1999 | `function cM(A, q = [])` | ✅ VERIFIED |
| `WX1` | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` | ✅ VERIFIED |
| `ot8` | sessionOrchestrator | chunks.196.mjs:3 | `function ot8({...})` | ✅ VERIFIED |
| `ra6` | getInputDialogType | chunks.196.mjs:387 | `function ra6()` | ✅ VERIFIED |
| `TM` | handleCancel | chunks.196.mjs:420 | `function TM()` | ✅ VERIFIED |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | `async function _uY(A)` | ✅ VERIFIED |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` | ✅ VERIFIED |
| `p1` | createUserMessage | chunks.173.mjs:1378 | `function p1(A)` | ✅ VERIFIED |

---

This document describes the complete data flow and integration between three core modules:

- **01_cli** - Command line parsing and session initialization
- **02_ui** - Terminal UI rendering and user interaction
- **03_llm_core** - LLM API requests and agent loop execution

The integration follows a **single-directional data flow** pattern with centralized state management via React's context API.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `run` (OVz) - Main CLI entry point with Commander.js setup
- `SessionOrchestrator` (ot8) - Main session orchestrator component
- `mainAgentLoop` (Yh) - Core agent loop async generator
- `handleStreamedEvent` (xN6) - Stream event processor
- `getInputDialogType` (ra6) - Dialog priority dispatcher
- `handleCancel` (TM) - Cancel handler
- `createStateStore` (WX1) - Observable state store factory
- `useAppState` (M1) - Reactive state slice reader

---

## Architecture Overview

### Three-Tier Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLI ENTRY POINT (run/OVz)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Commander.js Setup (~50 flags)                                      │   │
│  │ ├─ preAction Hook: initializeMdm → runInitializers → sinks → plugins│   │
│  │ └─ Action Handler: Flag extraction → Permission context → State     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ initialState Object (~35 fields)                                    │   │
│  │ ├─ From CLI: verbose, isSingleTurn, toolPermissionContext          │   │
│  │ ├─ From Config: model, agentDefinition, effortLevel                │   │
│  │ └─ From Session: messages, sessionId, isResumingSession            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ createStateStore (WX1) ──► AppStateProvider (Yj)                   │   │
│  │ ├─ getState(): Returns current state                                │   │
│  │ ├─ setState(updater): Updates state, notifies subscribers          │   │
│  │ └─ subscribe(notify): Returns unsubscribe closure                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SESSION ORCHESTRATOR (ot8)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Props (~25 parameters)                                              │   │
│  │ ├─ commands, initialTools, initialMessages, mcpClients             │   │
│  │ ├─ systemPrompt, appendSystemPrompt, thinkingConfig                │   │
│  │ └─ remoteSessionConfig, directConnectConfig, sshSession            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ State Initialization (35+ useState calls)                           │   │
│  │ ├─ Messages: messages, streamingToolUses, streamingIndicator       │   │
│  │ ├─ UI State: screen, inputMode, streamMode                         │   │
│  │ ├─ Permissions: toolUseConfirmQueue, sandboxPermissionQueue        │   │
│  │ └─ Remote: remoteSession, bridgeState                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Dialog Priority System (ra6) - 12 dialog types                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AGENT LOOP (mainAgentLoop/Yh)                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Turn Loop (while true)                                              │   │
│  │ ├─ 1. Micro-compact check                                           │   │
│  │ ├─ 2. Auto-compact check                                            │   │
│  │ ├─ 3. Context limit validation                                      │   │
│  │ ├─ 4. buildConversationChain                                        │   │
│  │ ├─ 5. LLM API request                                               │   │
│  │ ├─ 6. Stream event processing                                       │   │
│  │ └─ 7. Tool dispatch                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: CLI Entry Point

### run Function (OVz)

**Location**: `chunks.198.mjs:3-500`

**What it does**: Main CLI entry point that sets up Commander.js, defines all CLI flags, runs the preAction initialization sequence, and dispatches to either interactive or headless mode.

```javascript
// ============================================
// run (OVz) - Main CLI entry point with Commander.js setup
// Location: chunks.198.mjs:3-500
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
    Zq("run_commander_initialized");
    q.hook("preAction", async (w) => {
        Zq("preAction_start");
        await Wvq();  // initializeMdm
        await rVq();  // runInitializers
        // ... sinks, plugins, migrations
    });
    // ... ~50 flag definitions
}

// READABLE (for understanding):
async function run() {
    trackFunctionStart("run_function_start");

    // Create help configuration for Commander
    function createHelpConfiguration() {
        let getOptionName = (option) =>
            option.long?.replace(/^--/, "") ??
            option.short?.replace(/^-/, "") ?? "";
        return {
            sortSubcommands: true,
            sortOptions: true,
            compareOptions: (a, b) => getOptionName(a).localeCompare(getOptionName(b))
        };
    }

    // Create Commander program
    let program = new Command()
        .configureHelp(createHelpConfiguration())
        .enablePositionalOptions();

    // preAction initialization sequence
    program.hook("preAction", async (command) => {
        await initializeMdm();
        await runInitializers();
        initializeErrorLogSink();
        registerInlinePlugins();
        runMigrations();
        syncSettingsFromProject();
    });

    // Define all CLI flags (~50)
    program
        .option("-d, --debug [filter]", "Enable debug mode...")
        .option("-p, --print", "Print response and exit...")
        // ... many more flags

    // Action handler branches to interactive or headless mode
    program.action(async (prompt, options) => {
        // Build initialState, create state store
        // Branch based on isNonInteractive
    });
}

// Mapping: OVz→run, fkq→Command, Zq→trackFunctionStart, Wvq→initializeMdm,
//          rVq→runInitializers, WX1→createStateStore
```

### preAction Initialization Sequence

```
preAction_start
      │
      ▼
initializeMdm() ─────────────────────► preAction_after_mdm
      │
      ▼
runInitializers() ──────────────────► preAction_after_init
      │
      ▼
initializeErrorLogSink() ───────────► preAction_after_sinks
      │
      ▼
registerInlinePlugins() ────────────► (inline plugins loaded)
      │
      ▼
runMigrations() ────────────────────► preAction_after_migrations
      │
      ▼
syncSettingsFromProject() ──────────► preAction_after_remote_settings
      │
      ▼
syncRemoteSettings() ───────────────► preAction_after_settings_sync
```

### Complete CLI Flags Reference

| Flag | Type | Description | State Field |
|------|------|-------------|-------------|
| `-d, --debug [filter]` | string | Enable debug mode with category filtering | `debug` |
| `-p, --print` | boolean | Print response and exit | `isSingleTurn` |
| `--output-format` | text/json/stream-json | Output format | `outputFormat` |
| `--input-format` | text/stream-json | Input format | `inputFormat` |
| `--dangerously-skip-permissions` | boolean | Bypass all permission checks | `toolPermissionContext.mode` |
| `--allowed-tools` | string[] | Allowed tool patterns | `toolPermissionContext.allowedTools` |
| `--permission-mode` | accept/plan/auto | Permission mode | `toolPermissionContext.mode` |
| `-c, --continue` | boolean | Continue recent conversation | `isResumingSession` |
| `-r, --resume [id]` | string | Resume by session ID | `sessionId` |
| `--model` | string | Model for session | `mainLoopModel` |
| `--effort` | low/medium/high/max | Effort level | `effortValue` |
| `--agent` | string | Agent for session | `agentDefinition` |
| `--mcp-config` | string[] | MCP server configs | `mcp.clients` |
| `--ide` | boolean | Auto-connect IDE | `ideInstallationStatus` |
| `--session-id` | uuid | Specific session ID | `sessionId` |
| `--system-prompt` | string | Custom system prompt | `customSystemPrompt` |
| `--append-system-prompt` | string | Append to default prompt | `appendSystemPrompt` |
| `--thinking` | enabled/adaptive/disabled | Thinking mode | `thinkingConfig` |
| `--max-turns` | number | Max turns (non-interactive) | `maxTurns` |
| `--max-budget-usd` | number | Max budget in USD | `maxBudgetUsd` |
| `--chrome` | boolean | Enable Chrome integration | `chromeEnabled` |
| `--worktree` | string | Worktree path | `worktreePath` |
| `--tmux` | boolean | Use tmux for teammates | `tmuxEnabled` |

---

## Phase 2: Session Orchestrator (ot8)

**Location**: `chunks.196.mjs:3-1000+`

**What it does**: The main React component that orchestrates the entire session lifecycle. Manages 35+ state variables, coordinates MCP clients, handles tool permissions, and drives the agent loop.

### Props Interface

```javascript
// ============================================
// SessionOrchestrator (ot8) - Main session orchestrator component
// Location: chunks.196.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
function ot8({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    pendingHookMessages: z,
    initialFileHistorySnapshots: _,
    initialContentReplacements: w,
    initialAgentName: O,
    initialAgentColor: $,
    mcpClients: H,
    dynamicMcpConfig: j,
    autoConnectIdeFlag: J,
    strictMcpConfig: M = !1,
    systemPrompt: D,
    appendSystemPrompt: X,
    onBeforeQuery: P,
    onTurnComplete: W,
    disabled: Z = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    taskListId: v,
    remoteSessionConfig: N,
    directConnectConfig: V,
    sshSession: L,
    thinkingConfig: h
}) { ... }

// READABLE (for understanding):
function SessionOrchestrator({
    commands,                    // Slash commands array
    debug,                       // Debug mode flag
    initialTools,                // Initial tool set
    initialMessages,             // Resumed messages
    pendingHookMessages,         // Messages from hooks
    mcpClients,                  // MCP client instances
    systemPrompt,                // Custom system prompt
    appendSystemPrompt,          // Append to default prompt
    mainThreadAgentDefinition,   // Agent definition
    thinkingConfig               // Thinking mode config
}) { ... }

// Mapping: ot8→SessionOrchestrator, A→commands, q→debug, K→initialTools,
//          Y→initialMessages, H→mcpClients, D→systemPrompt
```

### Dialog Priority System (ra6)

**Location**: `chunks.196.mjs:387-404`

**What it does**: Determines which dialog to show based on current state. This is the core prioritization logic for user interactions.

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
    // 0. Check for blocking states
    if (forkSessionDialog || needsAuthentication) return;

    // 1. Message selector (highest priority)
    if (messageSelectorVisible) return "message-selector";

    // 2. Input is being composed
    if (isInputComposing) return;

    // 3. Sandbox permission
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check if animation should continue
    let shouldContinueAnimation = !toolJSX || toolJSX.shouldContinueAnimation;

    // 4-12. Lower priority dialogs (tool-permission through desktop-upsell)
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";
    // ... and so on for each dialog type
}

// Mapping: ra6→getInputDialogType, W7→messageSelectorVisible, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue
```

### Dialog Priority Order

| Priority | Dialog Type | Trigger |
|----------|-------------|---------|
| 1 | `message-selector` | W7 (messageSelectorVisible) |
| 2 | `sandbox-permission` | G7[0] (sandboxPermissionQueue) |
| 3 | `tool-permission` | a8[0] (toolPermissionQueue) |
| 4 | `prompt` | zA[0] (promptQueue) |
| 5 | `worker-sandbox-permission` | n.queue[0] |
| 6 | `elicitation` | o.queue[0] (elicitationQueue) |
| 7 | `cost` | m26 (showCostDialog) |
| 8 | `ide-onboarding` | W6 (showIdeOnboarding) |
| 9 | `effort-callout` | g6 (showEffortCallout) |
| 10 | `remote-callout` | J1 (showRemoteCallout) |
| 11 | `lsp-recommendation` | e8 (lspRecommendation) |
| 12 | `desktop-upsell` | E1 (showDesktopUpsell) |

---

## Phase 3: Agent Loop Integration

### mainAgentLoop (Yh) Call Site

**Location**: `chunks.196.mjs:766-775`

```javascript
// ============================================
// mainAgentLoop call site - Streaming event loop
// Location: chunks.196.mjs:766-775
// ============================================

// ORIGINAL (for source lookup):
for await (let e9 of Yh({
    messages: P1,
    systemPrompt: B9,
    userContext: y$,
    systemContext: fY,
    canUseTool: wW,
    toolUseContext: cA,
    querySource: Qc6()
})) rV6(e9);

// READABLE (for understanding):
for await (let event of mainAgentLoop({
    messages: currentMessages,
    systemPrompt: renderedSystemPrompt,
    userContext: userContext,
    systemContext: systemContext,
    canUseTool: canUseTool,
    toolUseContext: toolUseContext,
    querySource: getQuerySource()
})) {
    handleStreamedEvent(event);
}

// Mapping: Yh→mainAgentLoop, e9→event, P1→messages, B9→systemPrompt,
//          rV6→handleStreamedEvent
```

### Event Types Yielded by Agent Loop

| Event Type | Source | UI Handler |
|------------|--------|------------|
| `stream_request_start` | Agent loop start | `setStreamMode("requesting")` |
| `stream_event` (content_block_start, text) | LLM SSE | `setStreamMode("responding")` |
| `stream_event` (content_block_delta, text_delta) | LLM SSE | `setResponseLength(updater)` |
| `stream_event` (content_block_start, thinking) | LLM SSE | `setStreamMode("thinking")` |
| `stream_event` (content_block_start, tool_use) | LLM SSE | `setStreamMode("tool-input")` |
| `assistant` | Completed content block | `setMessages([...prev, event])` |
| `user` (tool_result) | Tool execution complete | `setMessages([...prev, event])` |
| `tombstone` | Context overflow | `setMessages(prev => filter(...))` |
| `system` (retry) | Retry event | Show retry indicator |

---

## Phase 4: State Management

### createStateStore (WX1)

**Location**: `chunks.85.mjs:1747-1766`

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
            // Bail out if reference-equal
            if (Object.is(nextState, prevState)) return;
            currentState = nextState;
            onChangeCallback?.({ newState: nextState, oldState: prevState });
            for (let notify of subscribers) notify();
        },
        subscribe: (notify) => {
            subscribers.add(notify);
            return () => subscribers.delete(notify);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback
```

### useAppState (M1)

**Location**: `chunks.148.mjs:2598-2610`

```javascript
// ============================================
// useAppState (M1) - Reactive state slice reader
// Location: chunks.148.mjs:2598-2610
// ============================================

// ORIGINAL (for source lookup):
function M1(A) {
    let q = A6(3), K = Bp8();
    return (0, C7.useSyncExternalStore)(q.subscribe, () => A(q.getState()))
}

// READABLE (for understanding):
function useAppState(selector) {
    let store = useContext(StoreContext);
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState())
    );
}

// Mapping: M1→useAppState, A→selector, Bp8→useStoreContext
```

---

## Phase 5: Cross-Feature Integration

### System Reminder Integration (04_system_reminder)

System reminders are injected as attachments through the agent loop:

```
Attachment Producers
├─ createDiagnosticAttachmentProducer (luY)
│   └─ LSP diagnostic integration
├─ Plan mode attachments
│   └─ Plan file content injection
├─ Task reminder attachments
│   └─ Pending task notifications
└─ Memory attachments
    └─ MEMORY.md content injection
```

### Permission System Integration

```
Permission Flow
├─ 1. Tool execution request
│   └─ toolDispatcher (Wi6) receives tool_use
├─ 2. Permission check
│   └─ canUseTool (wW) checks toolPermissionContext
├─ 3. Queue insertion
│   └─ setToolPermissionQueue([...prev, request])
├─ 4. Dialog display
│   └─ getInputDialogType returns "tool-permission"
├─ 5. User decision
│   └─ resolve(behavior) or reject(error)
└─ 6. Execution
    └─ Tool executes or aborts
```

### MCP Integration

```
MCP Lifecycle
├─ Initialization
│   └─ Fr6(mcpServers) → { clients, tools, commands }
├─ Tool Discovery
│   └─ Tools added to toolPermissionContext
├─ Elicitation Handling
│   └─ elicitationQueue receives MCP requests
└─ Resource Updates
    └─ mcp.resources updated on server changes
```

---

## Key Algorithms

### Query Guard Concurrency Control

**Why this approach**: Prevents multiple concurrent queries from corrupting state.

```javascript
// The query guard uses a mutex-like pattern:
let guardHandle = queryGuard.tryStart();
if (guardHandle === null) {
    // Another query is in progress - enqueue or reject
    logEvent("tengu_concurrent_onquery_detected", {});
    return;
}

try {
    await executeQuery(...);
} finally {
    if (queryGuard.end(guardHandle)) {
        resetLoadingState();
    }
}
```

### Stream Mode State Machine

```
Query submitted
  └── setStreamMode("requesting")

First text content_block_start event
  └── setStreamMode("responding")

First thinking content_block_start event
  └── setStreamMode("thinking")

First tool_use content_block_start event
  └── setStreamMode("tool-input")

Tool execution starts
  └── setStreamMode("tool-use")

Stream complete / Error
  └── setStreamMode(null)
```

---

## Summary

The CLI-UI-LLM integration represents a sophisticated three-tier architecture:

1. **CLI Layer**: Commander.js setup with 50+ flags, preAction initialization, and mode detection
2. **UI Layer**: React/Ink components with 35+ state variables, dialog priority system, and stream event handling
3. **LLM Layer**: Async generator agent loop yielding events to the UI

The key insight is that **events flow one direction** (LLM → UI) while **user input flows the other** (UI → LLM), with the state store acting as the intermediary for reactive updates.

---

## Complete Request Lifecycle

### User Input to LLM Response Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE REQUEST LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [User types message]                                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 1: INPUT CAPTURE                                            │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ • PromptInput component captures keystrokes                       │      │
│  │ • useInput hook processes key events                              │      │
│  │ • Enter triggers submission                                       │      │
│  │ • Escape triggers cancel/clear                                    │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 2: QUERY SUBMISSION (onQuery)                               │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ 1. Check isQueryInProgress.current (concurrency guard)            │      │
│  │ 2. Abort proactive mode if active                                 │      │
│  │ 3. Set isLoading = true                                           │      │
│  │ 4. Append user message to messages state                          │      │
│  │ 5. Wait for React state flush                                     │      │
│  │ 6. Run beforeQueryHook if provided                                │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 3: CONTEXT BUILDING (handleQuery)                           │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ 1. Notify MCP clients of query start                              │      │
│  │ 2. Build tool use context (permissions, abort controller)         │      │
│  │ 3. Load file history context (git status, changed files)          │      │
│  │ 4. Build system prompt (default + custom + MCP instructions)      │      │
│  │ 5. Load user context (config, language)                           │      │
│  │ 6. Load system context (platform, environment)                    │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 4: AGENT LOOP EXECUTION                                     │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ for await (event of mainAgentLoop({...})) {                       │      │
│  │     handleStreamedEvent(event);                                   │      │
│  │ }                                                                 │      │
│  │                                                                    │      │
│  │ Each event is processed synchronously before next event           │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 5: STREAM EVENT PROCESSING                                  │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ • stream_request_start → setStreamMode("requesting")              │      │
│  │ • content_block_start → create placeholder, set mode             │      │
│  │ • content_block_delta → accumulate text/json/thinking            │      │
│  │ • content_block_stop → yield complete message                    │      │
│  │ • message_delta → update usage, check stop_reason                │      │
│  │ • assistant → add to messages state (triggers re-render)          │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 6: TOOL EXECUTION (if tools called)                         │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ 1. Collect tool_use blocks from response                          │      │
│  │ 2. Validate inputs against schemas                                │      │
│  │ 3. Check permissions via canUseTool                               │      │
│  │ 4. If permission needed: queue dialog, await user decision        │      │
│  │ 5. Execute tools (parallel for concurrency-safe)                  │      │
│  │ 6. Collect results, yield user messages                           │      │
│  │ 7. Continue to next turn (go to PHASE 4)                          │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ PHASE 7: COMPLETION                                               │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │ • setIsLoading(false)                                             │      │
│  │ • setStreamMode(null)                                             │      │
│  │ • Run profiling report                                            │      │
│  │ • Process queued prompt if any                                    │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stream Event Processing Flow

### SSE Event State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STREAM EVENT STATE MACHINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [API Connection Established]                                               │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────┐                                                        │
│  │ message_start   │ ──► Initialize partialMessage, usage                   │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐     ┌─────────────────────────────────────────┐        │
│  │ content_block_  │ ──► │ type: "text" → text: ""                  │        │
│  │ start           │     │ type: "thinking" → thinking: "", sig: "" │        │
│  └────────┬────────┘     │ type: "tool_use" → input: ""             │        │
│           │              └─────────────────────────────────────────┘        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐     ┌─────────────────────────────────────────┐        │
│  │ content_block_  │ ──► │ text_delta → block.text += delta        │        │
│  │ delta           │     │ input_json_delta → block.input += json  │        │
│  └────────┬────────┘     │ thinking_delta → block.thinking += ...  │        │
│           │              │ signature_delta → block.signature = ... │        │
│           │              └─────────────────────────────────────────┘        │
│           │              (Loop: multiple deltas per block)                  │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ content_block_  │ ──► Yield { type: "assistant", message: {...} }        │
│  │ stop            │     contentBlocks[index] finalized                    │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           │    (Loop: multiple blocks per message)                          │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ message_delta   │ ──► Update usage, capture stop_reason                  │
│  └────────┬────────┘     If stop_reason === "max_tokens": yield error       │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ message_stop    │ ──► Stream complete, no more events                    │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Content Block Assembly Example

```javascript
// ============================================
// Content Block Assembly - Tool Use Example
// ============================================

// SSE Events received:
// 1. content_block_start: { type: "tool_use", id: "toolu_01", name: "Read" }
// 2. content_block_delta: { type: "input_json_delta", partial_json: '{"file_' }
// 3. content_block_delta: { type: "input_json_delta", partial_json: 'path":' }
// 4. content_block_delta: { type: "input_json_delta", partial_json: ' "test.' }
// 5. content_block_delta: { type: "input_json_delta", partial_json: 'txt"}' }
// 6. content_block_stop

// Assembled block:
{
    type: "tool_use",
    id: "toolu_01",
    name: "Read",
    input: { file_path: "test.txt" }
}

// Yielded to UI:
{
    type: "assistant",
    message: {
        content: [{
            type: "tool_use",
            id: "toolu_01",
            name: "Read",
            input: { file_path: "test.txt" }
        }]
    },
    uuid: "generated-uuid"
}
```

---

## Permission Dialog Flow

### Complete Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION DIALOG DECISION TREE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool execution requested                                                   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Check permission mode (toolPermissionContext.mode)                │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ├────── mode: "bypassPermissions" ──────────────────────────────┐   │
│         │                                                               │   │
│         │                                                               ▼   │
│         │                                                       ┌───────────┐│
│         │                                                       │ EXECUTE   ││
│         │                                                       │ IMMEDIATELY│
│         │                                                       └───────────┘│
│         │                                                                    │
│         ├────── mode: "accept" or "acceptEdits" ─────────────────────────┐  │
│         │                                                                │  │
│         │                                                                ▼  │
│         │                             ┌─────────────────────────────────┐│  │
│         │                             │ Is tool in "safe" list?         ││  │
│         │                             │ (Read, Grep, Glob, WebFetch)    ││  │
│         │                             └─────────────────────────────────┘│  │
│         │                                       │                        │  │
│         │                         ┌─────────────┴─────────────┐          │  │
│         │                         │                           │          │  │
│         │                         ▼                           ▼          │  │
│         │                   ┌───────────┐              ┌───────────┐     │  │
│         │                   │ EXECUTE   │              │ Check deny│     │  │
│         │                   │ IMMEDIATELY│              │ rules     │     │  │
│         │                   └───────────┘              └─────┬─────┘     │  │
│         │                                                    │           │  │
│         │                                    ┌───────────────┴──────┐    │  │
│         │                                    │                      │    │  │
│         │                                    ▼                      ▼    │  │
│         │                             ┌───────────┐          ┌───────────┐│  │
│         │                             │ BLOCKED   │          │ Check allow││  │
│         │                             │ (deny)    │          │ rules      ││  │
│         │                             └───────────┘          └─────┬─────┘│  │
│         │                                                         │       │  │
│         │                                          ┌──────────────┴─────┐│  │
│         │                                          │                    ││  │
│         │                                          ▼                    ▼│  │
│         │                                   ┌───────────┐        ┌───────────┐│
│         │                                   │ EXECUTE   │        │ PROMPT    ││
│         │                                   │ (allow)   │        │ (no rule) ││
│         │                                   └───────────┘        └───────────┘│
│         │                                                                    │
│         ├────── mode: "plan" ────────────────────────────────────────────┐  │
│         │                                                                │  │
│         │                                                                ▼  │
│         │                             ┌─────────────────────────────────┐│  │
│         │                             │ Is tool read-only?              ││  │
│         │                             │ (Read, Grep, Glob, WebFetch,    ││  │
│         │                             │  WebSearch)                     ││  │
│         │                             └─────────────────────────────────┘│  │
│         │                                       │                        │  │
│         │                         ┌─────────────┴─────────────┐          │  │
│         │                         │                           │          │  │
│         │                         ▼                           ▼          │  │
│         │                   ┌───────────┐              ┌───────────┐     │  │
│         │                   │ EXECUTE   │              │ BLOCKED   │     │  │
│         │                   │ (allowed) │              │ (write)   │     │  │
│         │                   └───────────┘              └───────────┘     │  │
│         │                                                                │  │
│         └────── mode: "default" ────────────────────────────────────────┐│  │
│                                                                          ││  │
│                                                                          ▼│  │
│                               ┌─────────────────────────────────────────┐│  │
│                               │ Check explicit rules                    ││  │
│                               │ • Deny rules (block)                    ││  │
│                               │ • Allow rules (execute)                 ││  │
│                               │ • No rule → PROMPT                      ││  │
│                               └─────────────────────────────────────────┘│  │
│                                                                          │  │
│                               ┌─────────────────────────────────────────┐│  │
│                               │ If PROMPT:                              ││  │
│                               │ 1. Add to toolPermissionQueue           ││  │
│                               │ 2. getInputDialogType returns           ││  │
│                               │    "tool-permission"                    ││  │
│                               │ 3. Render ToolPermissionDialog          ││  │
│                               │ 4. Await user decision                  ││  │
│                               └─────────────────────────────────────────┘│  │
│                                                                          │  │
│                                          ┌───────────────────────────────┤  │
│                                          │                               │  │
│                                          ▼                               ▼  │
│                                   ┌───────────┐                    ┌───────────┐│
│                                   │ ALLOW     │                    │ DENY      ││
│                                   │           │                    │           ││
│                                   │ Execute   │                    │ Return    ││
│                                   │ tool      │                    │ error     ││
│                                   └───────────┘                    └───────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Error Recovery Flow

### Context Overflow Recovery

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT OVERFLOW RECOVERY FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM API returns 400 error: "context_length_exceeded"                      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ parseContextOverflowError($54)                                     │      │
│  │ • Extract current token count                                      │      │
│  │ • Extract max context tokens                                       │      │
│  │ • Determine overflow amount                                        │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Check recovery attempts                                            │      │
│  │ if (maxOutputTokensRecoveryCount >= 3) {                           │      │
│  │     // Give up, throw error to user                                │      │
│  │     yield error;                                                   │      │
│  │     return;                                                        │      │
│  │ }                                                                  │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Trigger reactive compact                                           │      │
│  │ • Summarize older messages                                         │      │
│  │ • Replace with summary                                             │      │
│  │ • Track compaction in telemetry                                    │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Reduce max_output_tokens if possible                               │      │
│  │ newMax = Math.max(current - 1000, FLOOR_OUTPUT_TOKENS)             │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Retry request with:                                                │      │
│  │ • Compacted messages                                               │      │
│  │ • Reduced max_output_tokens                                        │      │
│  │ • Incremented recovery count                                       │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  Continue normal flow...                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stream Stall Detection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STREAM STALL DETECTION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Stream started                                                              │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Start stall timer                                                  │      │
│  │ stallTimeout = setTimeout(() => {                                  │      │
│  │     handleStall();                                                 │      │
│  │ }, STALL_THRESHOLD_MS);  // Typically 30-60 seconds                │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         │    On each event received                                         │
│         │    Reset stall timer                                               │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Normal event processing                                            │      │
│  │ clearTimeout(stallTimeout);                                        │      │
│  │ stallTimeout = setTimeout(...);  // Reset                          │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         │    If no events for STALL_THRESHOLD_MS                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ handleStall()                                                      │      │
│  │ 1. Abort current stream                                            │      │
│  │ 2. Log stall event to telemetry                                    │      │
│  │ 3. Fall back to non-streaming mode                                 │      │
│  │ 4. Or retry with new request                                       │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Reminder Integration

### Attachment Production Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  mainAgentLoop (pre-turn phase)                                             │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ assembleAllAttachments(_uY)                                        │      │
│  │ Location: chunks.147.mjs:3-18                                      │      │
│  │                                                                    │      │
│  │ Returns array of attachment objects:                               │      │
│  │ [                                                                  │      │
│  │   { type: "token_usage", ... },                                    │      │
│  │   { type: "plan_mode", ... },                                      │      │
│  │   { type: "todo", ... },                                           │      │
│  │   ...                                                              │      │
│  │ ]                                                                  │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Attachment Producer Selection                                      │      │
│  │ ─────────────────────────────────────────────────────────────    │      │
│  │                                                                    │      │
│  │ Priority Order:                                                    │      │
│  │ 1. Mode control (plan_mode, delegate_mode)                        │      │
│  │ 2. Critical reminders (token_usage, budget_usd)                   │      │
│  │ 3. Team context (teammate_mailbox, team_context)                  │      │
│  │ 4. Status updates (todo, task_reminder)                           │      │
│  │ 5. Memory (nested_memory, relevant_memories)                      │      │
│  │                                                                    │      │
│  │ Each producer:                                                     │      │
│  │ • Checks trigger conditions                                       │      │
│  │ • Returns null if not applicable                                  │      │
│  │ • Returns attachment object if applicable                         │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ normalizeAttachmentForAPI(Ui8)                                     │      │
│  │ Location: chunks.174.mjs:3-469                                     │      │
│  │                                                                    │      │
│  │ Converts attachment → user message:                                │      │
│  │ {                                                                  │      │
│  │   type: "user",                                                    │      │
│  │   message: {                                                       │      │
│  │     role: "user",                                                  │      │
│  │     content: [{ type: "text", text: "..." }],                     │      │
│  │     isMeta: true  // Not shown in chat UI                          │      │
│  │   },                                                               │      │
│  │   uuid: "generated-uuid"                                           │      │
│  │ }                                                                  │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │ Message Injection                                                  │      │
│  │                                                                    │      │
│  │ Normalized attachments are prepended to messages array:           │      │
│  │ [attachment1, attachment2, ..., userMessage, history...]          │      │
│  │                                                                    │      │
│  │ LLM receives these as context but user doesn't see them           │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Attachment Types

| Type | Trigger | Content |
|------|---------|---------|
| `plan_mode` | Permission mode = "plan" | Plan mode instructions, restrictions |
| `token_usage` | Every turn | Current token count, remaining context |
| `todo` | Todo list changed | Current todo items |
| `teammate_mailbox` | Team mode active | Messages from teammates |
| `team_context` | Team mode active | Team identity, resources |
| `nested_memory` | MEMORY.md exists | Memory content from file |
| `budget_usd` | Budget set | Current spend, remaining budget |
| `diagnostics` | LSP diagnostics exist | Current LSP errors/warnings |

---

## Cancel Propagation

### handleCancel (TM) Deep Analysis

```javascript
// ============================================
// handleCancel (TM) - Cancel propagation
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim()) gq((P1) => [...P1, $Z({
        content: ez
    })]);
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
    // 1. Elicitation dialogs cannot be cancelled (MCP protocol requirement)
    if (focusedDialog === "elicitation") return;

    // 2. Log for debugging
    debugLog(`[onCancel] focusedInputDialog=${focusedDialog} streamMode=${streamMode}`);

    // 3. Force end interaction tracking
    interactionTracker.forceEnd();

    // 4. Save partial input if any (user's unsent message)
    if (inputText?.trim()) {
        appendMessage(createUserMessage({ content: inputText }));
    }

    // 5. Reset loading state (clears spinner, streaming state)
    resetLoadingState();

    // 6. Dialog-specific cancel handling
    switch (focusedDialog) {
        case "tool-permission":
            // Abort the pending tool execution
            toolPermissionQueue[0]?.onAbort();
            setToolPermissionQueue([]);
            break;

        case "prompt":
            // Reject all queued prompts
            for (let prompt of promptQueue) {
                prompt.reject(Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController?.abort();
            break;

        default:
            // No dialog: cancel the main request
            if (isRemoteMode) {
                remoteSession.cancelRequest();
            } else {
                abortController?.abort();
            }
    }

    // 7. Clear streaming state
    setStreamingState(null);
}

// Mapping: TM→handleCancel, K2→focusedDialog, d7→streamMode, J9→interactionTracker,
//   ez→inputText, gq→appendMessage, dE→resetLoadingState, a8→toolPermissionQueue,
//   zA→promptQueue, M5→abortController, B5→remoteSession
```

**Why elicitation cannot be cancelled:**
- MCP protocol expects a response from the user
- Server is blocked waiting for user input
- Timeout is handled server-side, not client-side
- Cancelling would break the MCP session

---

## Key Insights

### 1. Single-Directional Event Flow

```
User Input ───────────────────────────────────────────► LLM
                    (via mainAgentLoop call)

LLM Events ───────────────────────────────────────────► UI
                    (via yield and handleStreamedEvent)
```

This pattern ensures:
- Predictable state updates
- No race conditions between user input and LLM events
- Clean cancellation propagation

### 2. React State as Event Aggregator

Instead of complex event emitters, the architecture uses React state as the aggregation point:
- `setMessages` appends new messages
- `setStreamMode` updates loading indicator
- `setToolPermissionQueue` manages permission dialogs

This leverages React's batching and reconciliation for efficient updates.

### 3. AbortController Hierarchy

```
mainAbortController (session-level)
    │
    ├── siblingAbortController (tool execution)
    │       │
    │       └── Individual tool abort signals
    │
    └── streamAbortController (LLM request)
```

This hierarchy enables:
- Session-level abort (user hits Ctrl+C)
- Tool-level abort (one tool fails, siblings cancelled)
- Stream-level abort (network error, retry)

---

## Complete Request Flow (Enhanced)

### Request Lifecycle with Timing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE REQUEST LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: CLI Initialization (~100ms)                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  cliEntry (JVz)                                                              │
│      │                                                                       │
│      ├─► Version check (-v)                                                  │
│      ├─► Subcommand routing (--mcp-cli, --chrome-native-host)               │
│      └─► mainEntry (_Vz)                                                     │
│              │                                                               │
│              ├─► Process signal handlers (SIGINT, SIGTERM)                  │
│              ├─► Client type determination                                   │
│              └─► run (OVz)                                                   │
│                      │                                                       │
│                      ├─► Commander.js program setup                         │
│                      ├─► Flag parsing & validation                           │
│                      ├─► Permission context building                         │
│                      └─► Interactive/Headless branch                         │
│                                                                              │
│  Phase 2: Session Initialization (~200ms)                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Interactive Mode:                                                           │
│      │                                                                       │
│      ├─► createRoot (Ink)                                                    │
│      ├─► AppStateProvider (Yj) setup                                         │
│      ├─► createStateStore (WX1) initialization                              │
│      ├─► MCP client connection                                               │
│      ├─► IDE connection attempt                                              │
│      └─► Render REPL component                                               │
│                                                                              │
│  Phase 3: User Input Processing (varies)                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│  User types message                                                          │
│      │                                                                       │
│      ├─► PromptInput component captures input                               │
│      ├─► Autocomplete suggestions (if slash command)                        │
│      ├─► Enter key triggers submission                                       │
│      │                                                                       │
│      └─► handleSubmit()                                                      │
│              │                                                               │
│              ├─► CreateUserMessage with content                              │
│              ├─► setMessages([...prev, userMessage])                         │
│              ├─► setStreamMode("requesting")                                 │
│              └─► mainAgentLoop(userMessage)                                  │
│                                                                              │
│  Phase 4: Agent Loop Execution (varies by LLM)                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  mainAgentLoop (Yh)                                                          │
│      │                                                                       │
│      ├─► [Turn Start]                                                        │
│      │   ├─► Micro-compact check (remove consecutive duplicates)            │
│      │   ├─► Auto-compact check (token threshold)                            │
│      │   └─► Context limit validation                                        │
│      │                                                                       │
│      ├─► [Pre-Request]                                                       │
│      │   ├─► assembleAllAttachments(_uY) - System reminders                 │
│      │   ├─► Build tool schemas                                              │
│      │   └─► normalizeMessages(cM)                                           │
│      │                                                                       │
│      ├─► [LLM Request] (~1-30 seconds)                                       │
│      │   │                                                                   │
│      │   └─► streamingQueryCore(mGq)                                         │
│      │           │                                                           │
│      │           ├─► message_start → Initialize state                        │
│      │           ├─► content_block_start → Create placeholder               │
│      │           ├─► content_block_delta → Incremental updates               │
│      │           │       │                                                   │
│      │           │       ├─► text_delta → setStreamingText()                 │
│      │           │       ├─► input_json_delta → tool input accumulation      │
│      │           │       └─► thinking_delta → setStreamingThinking()         │
│      │           │                                                           │
│      │           ├─► content_block_stop → Finalize block                     │
│      │           ├─► message_delta → Usage, stop_reason                      │
│      │           └─► message_stop → Complete                                 │
│      │                                                                       │
│      ├─► [Tool Execution] (if tool_use blocks)                               │
│      │   │                                                                   │
│      │   └─► StreamingToolExecutor(ui6)                                      │
│      │           │                                                           │
│      │           ├─► canExecuteTool() check                                  │
│      │           ├─► Permission check (if needed)                            │
│      │           ├─► toolDispatcher(Wi6) execution                           │
│      │           └─► Collect tool results                                    │
│      │                                                                       │
│      └─► [Turn Decision]                                                     │
│              │                                                               │
│              ├─► Tools called? → Continue loop with tool results            │
│              └─► No tools? → Return final result                             │
│                                                                              │
│  Phase 5: UI Update (real-time during streaming)                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  handleStreamedEvent (xN6)                                                   │
│      │                                                                       │
│      ├─► type: "assistant" → appendMessage(assistantMessage)                │
│      ├─► type: "tombstone" → remove message from list                       │
│      ├─► type: "stream_event" → update streaming state                      │
│      └─► type: "stream_request_start" → setStreamMode("requesting")         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## State Synchronization Patterns

### Flag → State Mapping

```javascript
// ============================================
// CLI Flags to Initial State Mapping
// Location: chunks.198.mjs action handler
// ============================================

// Flag → State transformation table:
const FLAG_TO_STATE_MAPPING = {
    // Permission flags
    "--dangerously-skip-permissions": {
        path: "toolPermissionContext.mode",
        value: "accept",
        sideEffect: "skipTrustDialog"
    },
    "--permission-mode": {
        path: "toolPermissionContext.mode",
        value: (v) => v, // direct value
        options: ["accept", "plan", "auto", "dontAsk"]
    },
    "--allowed-tools": {
        path: "toolPermissionContext.allowRules",
        value: (v) => parseToolPatterns(v),
        merge: true
    },
    "--disallowed-tools": {
        path: "toolPermissionContext.denyRules",
        value: (v) => parseToolPatterns(v),
        merge: true
    },

    // Model flags
    "--model": {
        path: "options.mainLoopModel",
        value: (v) => resolveModelAlias(v)
    },
    "--effort": {
        path: "thinkingConfig.effort",
        value: (v) => v.toLowerCase(),
        options: ["low", "medium", "high", "max"]
    },

    // Session flags
    "--resume": {
        path: "resumeSessionId",
        value: (v) => v === true ? "PICKER" : v
    },
    "--continue": {
        path: "continueSession",
        value: true
    },
    "--fork-session": {
        path: "forkSession",
        value: true,
        requires: "--resume"
    },
    "--name": {
        path: "sessionName",
        value: (v) => v
    },

    // Debug flags
    "--debug": {
        path: "debugMode",
        value: true,
        sideEffect: "initializeDebugSink"
    },
    "--verbose": {
        path: "verbose",
        value: true
    }
};
```

### State Update Propagation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STATE UPDATE PROPAGATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flag Parsed                                                             │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ buildInitialState(flags)                                               │  │
│  │                                                                        │  │
│  │ Returns: {                                                             │  │
│  │   toolPermissionContext: {...},                                        │  │
│  │   options: { mainLoopModel, mcpClients, tools, ... },                  │  │
│  │   debugMode: boolean,                                                  │  │
│  │   verbose: boolean,                                                    │  │
│  │   resumeSessionId: string | undefined,                                 │  │
│  │   ...                                                                  │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ createStateStore(initialState, onChangeCallback)                      │  │
│  │                                                                        │  │
│  │ Internal state object:                                                 │  │
│  │ K = initialState                                                       │  │
│  │ Y = new Set<Subscriber>()                                              │  │
│  │                                                                        │  │
│  │ Returns: {                                                             │  │
│  │   getState: () => K,                                                   │  │
│  │   setState: (updater) => { ... },                                      │  │
│  │   subscribe: (callback) => () => Y.delete(callback)                    │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ AppStateProvider (Yj)                                                  │  │
│  │                                                                        │  │
│  │ Context value = {                                                      │  │
│  │   ...store,                                                            │  │
│  │   dispatch: (action) => store.setState(state => reducer(state, action))│  │
│  │ }                                                                      │  │
│  │                                                                        │  │
│  │ Components use:                                                        │  │
│  │   const value = useAppState(s => s.toolPermissionContext.mode)        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ UI Components Re-render                                                │  │
│  │                                                                        │  │
│  │ • ModeIndicator shows current permission mode                         │  │
│  │ • Tool list filtered by filterToolsByMode()                           │  │
│  │ • Debug logs enabled if debugMode=true                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### useAppState Hook Pattern

```javascript
// ============================================
// useAppState (M1) - Reactive state slice reader
// Location: chunks.85.mjs (inferred from context pattern)
// ============================================

// ORIGINAL (for source lookup):
function M1(A) {
    let q = N8.useContext(Yj),
        K = N8.useRef(A),
        Y = N8.useRef(void 0);
    return K.current = A,
        Y.current === void 0 && (Y.current = A(q.getState())),
        N8.useEffect(() => {
            let z = q.subscribe(() => {
                let _ = A(q.getState());
                Object.is(_, Y.current) || (Y.current = _, K.current(_))
            });
            return z
        }, [q, A]),
        Y.current
}

// READABLE (for understanding):
function useAppState(selector) {
    const store = useContext(AppStateContext);

    // Store selector reference for stable comparison
    const selectorRef = useRef(selector);

    // Store selected value to avoid unnecessary re-renders
    const selectedValueRef = useRef(undefined);

    // Update selector ref
    selectorRef.current = selector;

    // Initialize selected value on first render
    if (selectedValueRef.current === undefined) {
        selectedValueRef.current = selector(store.getState());
    }

    // Subscribe to store changes
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const newValue = selector(store.getState());

            // Only update if value actually changed (shallow equality)
            if (!Object.is(newValue, selectedValueRef.current)) {
                selectedValueRef.current = newValue;
                // Force re-render with new value
                selectorRef.current(newValue);
            }
        });

        return unsubscribe;
    }, [store, selector]);

    return selectedValueRef.current;
}

// Usage examples:
const mode = useAppState(s => s.toolPermissionContext.mode);
const messages = useAppState(s => s.messages);
const isStreaming = useAppState(s => s.streamMode !== "idle");

// Mapping: M1→useAppState, A→selector, q→store, Yj→AppStateContext,
//   K→selectorRef, Y→selectedValueRef
```

**Why this approach:**
- **Selector pattern**: Components only subscribe to the state slice they need
- **Reference stability**: `Object.is` comparison prevents unnecessary re-renders
- **Automatic subscription**: useEffect handles cleanup on unmount
- **No external dependencies**: Built on React primitives (Context, useRef, useEffect)

---

## SSE Event Processing Matrix

### Complete Event Type Handling

```javascript
// ============================================
// SSE Event Processing Matrix
// Location: chunks.171.mjs (streamingQueryCore) + chunks.173.mjs (handleToolUseStream)
// ============================================

const SSE_EVENT_MATRIX = {
    "message_start": {
        handler: "initializeMessageState",
        stateUpdates: ["partialMessage", "usage"],
        uiEffect: "none",
        yieldToUI: false
    },
    "content_block_start": {
        handler: "createBlockPlaceholder",
        stateUpdates: ["contentBlocks[index]"],
        uiEffect: "setStreamMode",
        yieldToUI: true,
        subtypes: {
            "thinking": {
                mode: "thinking",
                state: { thinking: "", signature: "" }
            },
            "text": {
                mode: "responding",
                state: { text: "" }
            },
            "tool_use": {
                mode: "tool-input",
                state: { id: "", name: "", input: "" },
                addTo: "streamingToolUses"
            },
            "redacted_thinking": {
                mode: "thinking",
                state: { thinking: "[REDACTED]" }
            }
        }
    },
    "content_block_delta": {
        handler: "accumulateDelta",
        stateUpdates: ["contentBlocks[index].text|input|thinking"],
        uiEffect: "updateStreamingText",
        yieldToUI: false,
        subtypes: {
            "text_delta": {
                action: "append text",
                update: "block.text += delta.text"
            },
            "input_json_delta": {
                action: "append JSON",
                update: "block.input += delta.partial_json"
            },
            "thinking_delta": {
                action: "append thinking",
                update: "block.thinking += delta.thinking"
            },
            "signature_delta": {
                action: "set signature",
                update: "block.signature = delta.signature"
            }
        }
    },
    "content_block_stop": {
        handler: "finalizeBlock",
        stateUpdates: ["contentBlocks[index] finalized"],
        uiEffect: "yield message if complete",
        yieldToUI: true
    },
    "message_delta": {
        handler: "processStopReason",
        stateUpdates: ["usage", "stopReason"],
        uiEffect: "check max_tokens error",
        yieldToUI: true,
        stopReasons: {
            "end_turn": "Normal completion",
            "max_tokens": "Token limit reached - may trigger recovery",
            "stop_sequence": "Custom stop sequence hit",
            "tool_use": "Tools called - will continue"
        }
    },
    "message_stop": {
        handler: "completeMessage",
        stateUpdates: ["streamMode = 'tool-use'"],
        uiEffect: "transition to tool execution",
        yieldToUI: true
    },
    "ping": {
        handler: "respondWithPong",
        stateUpdates: [],
        uiEffect: "none",
        yieldToUI: false
    },
    "error": {
        handler: "handleStreamError",
        stateUpdates: ["error"],
        uiEffect: "show error message",
        yieldToUI: true
    }
};
```

### Stream State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STREAM STATE MACHINE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  States: idle → requesting → thinking/responding/tool-input → tool-use     │
│                                                                              │
│  ┌───────┐     user message      ┌─────────────┐                            │
│  │ idle  │ ────────────────────► │ requesting  │                            │
│  └───────┘                       └──────┬──────┘                            │
│      ▲                                  │                                   │
│      │                                  │ message_start                      │
│      │                                  ▼                                   │
│      │                           ┌─────────────┐                            │
│      │                           │   thinking  │ ◄── thinking block start   │
│      │                           └──────┬──────┘                            │
│      │                                  │ thinking_delta                    │
│      │                                  │ (accumulate)                       │
│      │                                  │                                    │
│      │                           ┌──────┴──────┐                            │
│      │                           │ responding  │ ◄── text block start       │
│      │                           └──────┬──────┘                            │
│      │                                  │ text_delta                         │
│      │                                  │ (accumulate)                       │
│      │                                  │                                    │
│      │                           ┌──────┴──────┐                            │
│      │                           │ tool-input  │ ◄── tool_use block start   │
│      │                           └──────┬──────┘                            │
│      │                                  │ input_json_delta                  │
│      │                                  │ (accumulate JSON)                  │
│      │                                  │                                    │
│      │                                  ▼                                   │
│      │                           ┌─────────────┐                            │
│      │                           │  tool-use   │ ◄── message_stop           │
│      │                           └──────┬──────┘                            │
│      │                                  │                                    │
│      │                                  │ Execute tools                      │
│      │                                  │ via StreamingToolExecutor          │
│      │                                  │                                    │
│      │                                  ▼                                   │
│      │                           ┌─────────────┐                            │
│      └────────────────────────── │   idle      │ (after tools complete)     │
│                                  └─────────────┘                            │
│                                                                              │
│  Transitions triggered by:                                                   │
│  - stream_request_start → requesting                                        │
│  - content_block_start (type) → thinking/responding/tool-input             │
│  - message_stop → tool-use                                                  │
│  - No tools to execute → idle                                               │
│  - Error/cancel → idle                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tool Execution Decision Tree

### Parallel vs Sequential Execution

```javascript
// ============================================
// Tool Execution Decision Algorithm
// Location: chunks.148.mjs (StreamingToolExecutor)
// ============================================

function canExecuteTool(tool, currentlyExecuting) {
    // Rule 1: Always allow if nothing is executing
    if (currentlyExecuting.length === 0) {
        return true;
    }

    // Rule 2: Allow if tool is concurrency-safe AND all executing are safe
    if (tool.isConcurrencySafe) {
        const allExecutingAreSafe = currentlyExecuting.every(
            t => t.isConcurrencySafe
        );
        if (allExecutingAreSafe) {
            return true;  // Parallel execution
        }
    }

    // Rule 3: Otherwise, wait for executing tools to complete
    return false;  // Sequential execution required
}

// Concurrency-safe tools (can run in parallel):
const CONCURRENCY_SAFE_TOOLS = new Set([
    "Read",      // File reads don't modify state
    "Grep",      // Search is read-only
    "Glob",      // File listing is read-only
    "TaskGet",   // Task read is read-only
    "TaskList",  // Task listing is read-only
    "WebFetch",  // Independent network requests
    "WebSearch"  // Independent search queries
]);

// Non-safe tools (must run sequentially):
const SEQUENTIAL_TOOLS = [
    "Write",     // Modifies file system
    "Edit",      // Modifies file system
    "Bash",      // May have side effects
    "TaskCreate", // Modifies state
    "TaskUpdate", // Modifies state
    "TodoWrite"  // Modifies UI state
];
```

### Tool Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM response contains tool_use blocks                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ StreamingToolExecutor(ui6).queueToolUse(block)                        │  │
│  │                                                                        │  │
│  │ Queue entry: {                                                         │  │
│  │   id: tool_use.id,                                                    │  │
│  │   name: tool_use.name,                                                │  │
│  │   input: parsed_input,                                                │  │
│  │   isConcurrencySafe: CONCURRENCY_SAFE_TOOLS.has(name),                │  │
│  │   status: "pending",                                                  │  │
│  │   results: []                                                          │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Execution Loop                                                         │  │
│  │                                                                        │  │
│  │ while (queue.hasPending()) {                                           │  │
│  │   for (tool of queue.getPending()) {                                   │  │
│  │     if (canExecuteTool(tool, executing)) {                             │  │
│  │       executeTool(tool);                                               │  │
│  │     }                                                                  │  │
│  │   }                                                                    │  │
│  │   await Promise.all(executing);  // Wait for at least one to complete  │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ executeTool(entry)                                                     │  │
│  │                                                                        │  │
│  │ 1. Check abort conditions:                                             │  │
│  │    - siblingAbortController.aborted?                                  │  │
│  │    - hasErrored (circuit breaker)?                                     │  │
│  │                                                                        │  │
│  │ 2. Permission check:                                                   │  │
│  │    - Check allow/deny rules                                           │  │
│  │    - If no rule match, add to permission queue                        │  │
│  │    - Wait for user decision                                           │  │
│  │                                                                        │  │
│  │ 3. Execute via toolDispatcher(Wi6):                                    │  │
│  │    for await (event of toolDispatcher(block, ...)) {                   │  │
│  │      entry.results.push(event.message);                                │  │
│  │    }                                                                   │  │
│  │                                                                        │  │
│  │ 4. Handle errors:                                                      │  │
│  │    - On error: set hasErrored = true                                   │  │
│  │    - Abort siblings                                                   │  │
│  │    - Return error result                                              │  │
│  │                                                                        │  │
│  │ 5. Mark completed:                                                     │  │
│  │    entry.status = "completed"                                          │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Collect results for all completed tools                                │  │
│  │                                                                        │  │
│  │ tool_results = queue.getAll().map(entry => ({                          │  │
│  │   type: "tool_result",                                                 │  │
│  │   tool_use_id: entry.id,                                               │  │
│  │   content: entry.results.join("\n"),                                   │  │
│  │   is_error: entry.results.some(r => r.is_error)                        │  │
│  │ }));                                                                   │  │
│  │                                                                        │  │
│  │ Continue agent loop with tool_results appended to messages             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Error Recovery Flows

### API Error Handling

```javascript
// ============================================
// withApiRetry (_P1) - Retry wrapper with recovery
// Location: chunks.89.mjs
// ============================================

async function* withApiRetry(fn, options) {
    const { maxRetries = 3, isRetryable, onRetry } = options;
    let attempts = 0;

    while (attempts <= maxRetries) {
        try {
            yield* fn();
            return;  // Success
        } catch (error) {
            attempts++;

            // Check if error is retryable
            if (!isRetryable(error)) {
                throw error;  // Non-retryable, propagate immediately
            }

            // Check retry limit
            if (attempts > maxRetries) {
                throw new MaxRetriesExceededError(attempts, error);
            }

            // Wait before retry (exponential backoff)
            const delayMs = Math.min(1000 * Math.pow(2, attempts - 1), 30000);
            await sleep(delayMs);

            // Notify caller of retry
            if (onRetry) {
                yield { type: "retry", attempt: attempts, error, delay: delayMs };
            }
        }
    }
}

// Retryable errors:
const RETRYABLE_ERRORS = [
    "overloaded_error",      // API temporarily overloaded
    "rate_limit_error",      // Too many requests
    "timeout_error",         // Request timeout
    "server_error",          // 5xx errors
    "connection_error"       // Network issues
];

// Non-retryable errors (propagate immediately):
const NON_RETRYABLE_ERRORS = [
    "invalid_request_error", // Bad request format
    "authentication_error",  // Invalid API key
    "permission_error",      // No access to resource
    "not_found_error"        // Resource doesn't exist
];
```

### Context Overflow Recovery

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT OVERFLOW RECOVERY                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  API returns "context_length_exceeded" error                                │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Determine recovery strategy                                            │  │
│  │                                                                        │  │
│  │ 1. Check autoCompactTracking:                                         │  │
│  │    - Already compacted this turn?                                     │  │
│  │    - consecutiveFailures >= 3? (circuit breaker)                      │  │
│  │                                                                        │  │
│  │ 2. If can compact:                                                     │  │
│  │    - Trigger reactive compact                                         │  │
│  │    - Replace old messages with summary                                │  │
│  │    - Retry request with compacted context                             │  │
│  │                                                                        │  │
│  │ 3. If cannot compact:                                                  │  │
│  │    - Return error to user                                             │  │
│  │    - Suggest manual message removal                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Reactive Compact Flow                                                  │  │
│  │                                                                        │  │
│  │ autoCompactDispatcher(messages, context, {                            │  │
│  │   trigger: "reactive",                                                 │  │
│  │   targetTokenCount: maxTokens * 0.7,  // Leave 30% buffer              │  │
│  │   preserveRecent: true                                                 │  │
│  │ })                                                                     │  │
│  │                                                                        │  │
│  │ Returns: {                                                             │  │
│  │   wasCompacted: true,                                                  │  │
│  │   summaryMessages: [...],                                              │  │
│  │   preCompactTokenCount: 150000,                                        │  │
│  │   postCompactTokenCount: 80000                                         │  │
│  │ }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Retry with compacted context                                           │  │
│  │                                                                        │  │
│  │ messages = [                                                           │  │
│  │   ...summaryMessages,                                                  │  │
│  │   ...recentMessages  // Last few turns preserved                      │  │
│  │ ];                                                                     │  │
│  │                                                                        │  │
│  │ // Update tracking                                                     │  │
│  │ state.autoCompactTracking = {                                          │  │
│  │   compacted: true,                                                     │  │
│  │   turnId: currentTurnId,                                               │  │
│  │   consecutiveFailures: 0  // Reset on success                         │  │
│  │ };                                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Cross-Reference

### Critical Source Files

| Component | File | Lines | Key Functions |
|-----------|------|-------|---------------|
| CLI Entry | chunks.198.mjs | 1-500 | `cliEntry` (JVz), `run` (OVz) |
| Main Entry | chunks.197.mjs | 1-200 | `mainEntry` (_Vz) |
| State Store | chunks.85.mjs | 1747-1800 | `createStateStore` (WX1) |
| Session Orchestrator | chunks.196.mjs | 1-600 | `sessionOrchestrator` (ot8) |
| Agent Loop | chunks.148.mjs | 875-1500 | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY) |
| Streaming Core | chunks.171.mjs | 1-500 | `streamingQueryCore` (mGq) |
| Stream Handler | chunks.173.mjs | 2384-2500 | `handleToolUseStream` (xN6) |
| Message Normalizer | chunks.173.mjs | 1999-2100 | `normalizeMessages` (cM) |
| Attachment Assembly | chunks.147.mjs | 1-100 | `assembleAllAttachments` (_uY) |
| Attachment Normalizer | chunks.174.mjs | 1-500 | `normalizeAttachmentForAPI` (Ui8) |
| Tool Executor | chunks.148.mjs | 1-200 | `StreamingToolExecutor` (ui6) |
| Tool Dispatcher | chunks.146.mjs | 1-200 | `toolDispatcher` (Wi6) |
| Retry Logic | chunks.89.mjs | 1-100 | `withApiRetry` (_P1) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Enhanced with detailed algorithms and flow diagrams