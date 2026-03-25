# CLI-UI-LLM Core Joint Analysis (Claude Code v2.1.76)

> Complete source-level joint analysis of CLI entry, React/Ink UI, and LLM agent loop.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Related Documents**:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution symbols
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Feature symbols
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform symbols
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration symbols

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [CLI Entry Point Analysis](#2-cli-entry-point-analysis)
3. [UI Session Orchestrator Analysis](#3-ui-session-orchestrator-analysis)
4. [LLM Agent Loop Analysis](#4-llm-agent-loop-analysis)
5. [Cross-Module Integration Flow](#5-cross-module-integration-flow)
6. [Key Algorithms Deep Dive](#6-key-algorithms-deep-dive)
7. [Feature Interaction Matrix](#7-feature-interaction-matrix)
8. [Symbol Validation Report](#8-symbol-validation-report)

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
│  │ Key Functions:                                                        │  │
│  │ • Commander.js flag parsing (~50 flags)                              │  │
│  │ • preAction initialization sequence                                   │  │
│  │ • initialState object construction                                    │  │
│  │ • Permission context building                                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UI LAYER (02_ui)                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Session Orchestrator (ot8)                                            │  │
│  │                                                                       │  │
│  │ State Management:                                                     │  │
│  │ • 35+ useState calls for local state                                 │  │
│  │ • useAppState hooks for global state                                 │  │
│  │ • Dialog priority system (ra6)                                       │  │
│  │ • Stream mode tracking (streamMode)                                  │  │
│  │                                                                       │  │
│  │ Key Functions:                                                        │  │
│  │ • getInputDialogType (ra6) - Priority dispatcher                     │  │
│  │ • handleCancel (TM) - Cancel handler                                 │  │
│  │ • handleStreamedEvent (xN6) - Stream processor                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM LAYER (03_llm_core)                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Agent Loop (mainAgentLoop/Yh)                                         │  │
│  │                                                                       │  │
│  │ Turn State Object:                                                    │  │
│  │ • messages: Conversation history                                      │  │
│  │ • toolUseContext: Permission/session context                         │  │
│  │ • autoCompactTracking: Compaction state                              │  │
│  │ • turnCount: Current turn number                                     │  │
│  │                                                                       │  │
│  │ Turn Phases:                                                          │  │
│  │ 1. Micro-compact (remove consecutive duplicates)                     │  │
│  │ 2. Auto-compact (token threshold check)                              │  │
│  │ 3. Context limit validation                                          │  │
│  │ 4. LLM API request (streamingQueryCore/mGq)                          │  │
│  │ 5. Tool execution (StreamingToolExecutor/ui6)                        │  │
│  │ 6. Turn completion decision                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `run` (OVz) - Main CLI entry point at chunks.198.mjs:3
- `sessionOrchestrator` (ot8) - Main session orchestrator at chunks.196.mjs:3
- `mainAgentLoop` (Yh) - Agent loop at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `streamingQueryCore` (mGq) - Full SSE implementation at chunks.171.mjs:3
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.148.mjs:3

---

## 2. CLI Entry Point Analysis

### 2.1 Entry Point Flow

**What it does:** The CLI entry point handles the initial command-line parsing, runs initialization hooks, and dispatches to either interactive or headless mode.

**How it works:**

```
cliEntry (JVz)                    chunks.198.mjs:1573
    │
    ├─► Version check (-v/--version)
    │
    ├─► Special subcommand routing
    │    ├─► --claude-in-chrome-mcp
    │    ├─► --chrome-native-host
    │    ├─► remote-control/bridge
    │    └─► tmux worktree fast path
    │
    └─► mainEntry (_Vz)           chunks.197.mjs:1910
            │
            ├─► Process setup & signal handlers
            │
            ├─► Client type determination
            │
            └─► run (OVz)          chunks.198.mjs:3
                    │
                    ├─► Commander.js program definition
                    │
                    ├─► preAction initialization sequence
                    │
                    ├─► Flag extraction & validation
                    │
                    ├─► initialState construction
                    │
                    └─► REPL rendering / headless execution
```

### 2.2 run Function (OVz) - Source Code Analysis

**Location:** chunks.198.mjs:3-500

```javascript
// ============================================
// run (OVz) - Main CLI entry point with Commander.js setup
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
    Zq("run_commander_initialized");

    q.hook("preAction", async (w) => {
        Zq("preAction_start");
        await Wvq();  // initializeMdm
        Zq("preAction_after_mdm");
        await rVq();  // runInitializers
        Zq("preAction_after_init");
        // ... sinks, plugins, migrations
    });

    // ~50 flag definitions
    q.name("claude")
     .description("Claude Code - starts an interactive session...")
     .argument("[prompt]", "Your prompt", String)
     .helpOption("-h, --help", "Display help for command")
     .option("-d, --debug [filter]", "Enable debug mode...")
     .option("-p, --print", "Print response and exit...")
     // ... many more flags
     .action(async (w, O) => {
         // Action handler
     });
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

    trackFunctionStart("run_commander_initialized");

    // preAction initialization sequence
    program.hook("preAction", async (command) => {
        trackFunctionStart("preAction_start");
        await initializeMdm();
        trackFunctionStart("preAction_after_mdm");
        await runInitializers();
        trackFunctionStart("preAction_after_init");
        initializeErrorLogSink();
        registerInlinePlugins();
        runMigrations();
        syncSettingsFromProject();
        syncRemoteSettings();
        trackFunctionStart("preAction_after_settings_sync");
    });

    // Define all CLI flags (~50)
    program
        .name("claude")
        .description("Claude Code - starts an interactive session...")
        .argument("[prompt]", "Your prompt", String)
        .helpOption("-h, --help", "Display help for command")
        .option("-d, --debug [filter]", "Enable debug mode...")
        .option("-p, --print", "Print response and exit...")
        // ... many more flags

    // Action handler
    program.action(async (prompt, options) => {
        // Build initialState, create state store
        // Branch based on isNonInteractive
    });
}

// Mapping: OVz→run, fkq→Command, Zq→trackFunctionStart, Wvq→initializeMdm,
//          rVq→runInitializers
```

**Why this approach:**
- **Two-phase entry:** Early dispatch for utility modes (--version, --mcp-cli) before full initialization
- **preAction hook:** Runs initialization before the action handler, ensuring all services are ready
- **Ordered help:** Options sorted alphabetically for better UX

### 2.3 preAction Initialization Sequence

**What it does:** Initializes all required services before the main action runs.

```javascript
// ============================================
// preAction Initialization Sequence
// Location: chunks.198.mjs:16-25
// ============================================

// READABLE (for understanding):
const INIT_SEQUENCE = [
    { name: "initializeMdm", tracking: "preAction_after_mdm" },
    { name: "runInitializers", tracking: "preAction_after_init" },
    { name: "initializeErrorLogSink", tracking: "preAction_after_sinks" },
    { name: "registerInlinePlugins", tracking: null },
    { name: "runMigrations", tracking: "preAction_after_migrations" },
    { name: "syncSettingsFromProject", tracking: "preAction_after_remote_settings" },
    { name: "syncRemoteSettings", tracking: "preAction_after_settings_sync" }
];

// Execution flow:
// 1. initializeMdm() - Initialize MDm telemetry/error tracking
// 2. runInitializers() - Run registered initializers
// 3. initializeErrorLogSink() - Set up error logging sink
// 4. registerInlinePlugins() - Register plugins from --plugin-dir
// 5. runMigrations() - Run any pending migrations
// 6. syncSettingsFromProject() - Sync project settings
// 7. syncRemoteSettings() - Sync remote session settings
```

### 2.4 CLI Flags to State Mapping

**What it does:** Maps CLI flags to the initialState object.

| Flag | State Field | Description |
|------|-------------|-------------|
| `-p, --print` | `isSingleTurn` | Non-interactive mode |
| `--output-format` | `outputFormat` | text/json/stream-json |
| `--dangerously-skip-permissions` | `toolPermissionContext.mode` | Bypass permissions |
| `--allowed-tools` | `toolPermissionContext.allowedTools` | Tool whitelist |
| `--disallowed-tools` | `toolPermissionContext.disallowedTools` | Tool blacklist |
| `--model` | `mainLoopModel` | Model for session |
| `--effort` | `effortValue` | low/medium/high |
| `--agent` | `agentDefinition` | Agent override |
| `-c, --continue` | `isResumingSession` | Continue last session |
| `-r, --resume` | `sessionId` | Resume by ID |
| `--mcp-config` | `mcp.clients` | MCP server configs |
| `--system-prompt` | `customSystemPrompt` | Custom system prompt |
| `--thinking` | `thinkingConfig` | Thinking mode config |
| `--max-turns` | `maxTurns` | Max turns (non-interactive) |
| `--max-budget-usd` | `maxBudgetUsd` | Budget limit |

---

## 3. UI Session Orchestrator Analysis

### 3.1 Session Orchestrator (ot8) - Props and State

**Location:** chunks.196.mjs:3-100

**What it does:** The Session Orchestrator is the main React component that manages the entire session lifecycle, including state, streaming, dialog priority, and agent loop coordination.

```javascript
// ============================================
// SessionOrchestrator (ot8) - Main session orchestrator component
// Location: chunks.196.mjs:3-50
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
}) {
    let R = !!N;
    // ... state initialization
}

// READABLE (for understanding):
function SessionOrchestrator({
    commands,               // Available slash commands
    debug,                  // Debug mode flag
    initialTools,           // Initial tool set
    initialMessages,        // Conversation history
    pendingHookMessages,    // Messages from hooks
    initialFileHistorySnapshots,  // File history state
    initialContentReplacements,   // Content replacements
    initialAgentName,       // Agent display name
    initialAgentColor,      // Agent color
    mcpClients,             // MCP client connections
    dynamicMcpConfig,       // Dynamic MCP configuration
    autoConnectIdeFlag,     // Auto-connect IDE flag
    strictMcpConfig = false,  // Only use --mcp-config sources
    systemPrompt,           // System prompt
    appendSystemPrompt,     // Appended system prompt
    onBeforeQuery,          // Pre-query callback
    onTurnComplete,         // Post-turn callback
    disabled = false,       // Disable session
    mainThreadAgentDefinition,  // Agent definition
    disableSlashCommands = false,  // Disable skills
    taskListId,             // Task list ID
    remoteSessionConfig,    // Remote session configuration
    directConnectConfig,    // Direct connect configuration
    sshSession,             // SSH session info
    thinkingConfig          // Thinking mode configuration
}) {
    let isRemoteMode = !!remoteSessionConfig;
    // ... state initialization
}

// Mapping: ot8→SessionOrchestrator, A→commands, q→debug, K→initialTools,
//          Y→initialMessages, H→mcpClients, D→systemPrompt
```

### 3.2 State Management Architecture

**What it does:** Manages 35+ useState calls for local state and useAppState hooks for global state.

```javascript
// ============================================
// UI State Variables - Session Orchestrator internal state
// Location: chunks.196.mjs:30-60
// ============================================

// ORIGINAL (for source lookup):
let [k6, Z6] = N8.useState("prompt");  // screen state
let [u6, C6] = N8.useState(!1);        // isInputComposing
let [d7, W4] = N8.useState("responding"); // streamMode
let [JK, F3] = N8.useState([]);        // streamingToolUses
let [MK, k3] = N8.useState(null);      // streamingThinking

// READABLE (for understanding):
// Screen State
let [screen, setScreen] = useState("prompt");  // "prompt" | "transcript" | "tasks"

// Input State
let [isInputComposing, setIsInputComposing] = useState(false);

// Stream Mode State
let [streamMode, setStreamMode] = useState("responding");
// Values: "responding" | "tool-input" | "thinking" | "tool-use" | "requesting"

// Streaming Content State
let [streamingToolUses, setStreamingToolUses] = useState([]);
let [streamingThinking, setStreamingThinking] = useState(null);

// Global State (via useAppState hooks)
let toolPermissionContext = useAppState((s) => s.toolPermissionContext);
let mcp = useAppState((s) => s.mcp);
let plugins = useAppState((s) => s.plugins);
let agentDefinitions = useAppState((s) => s.agentDefinitions);
let tasks = useAppState((s) => s.tasks);
let teamContext = useAppState((s) => s.teamContext);

// Dialog Queues
let [toolUseConfirmQueue, setToolUseConfirmQueue] = useState([]);
let [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);
let [elicitationQueue, setElicitationQueue] = useState([]);
let [promptQueue, setPromptQueue] = useState([]);

// Mapping: k6→screen, Z6→setScreen, u6→isInputComposing, C6→setIsInputComposing,
//          d7→streamMode, W4→setStreamMode, JK→streamingToolUses, F3→setStreamingToolUses
```

### 3.3 Dialog Priority System (ra6)

**Location:** chunks.196.mjs:387-404

**What it does:** Determines which dialog should be shown based on a priority hierarchy.

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
    return;
}

// READABLE (for understanding):
function getInputDialogType() {
    // Tier 0: Absolute blocks (no dialog shown at all)
    if (isViewingDialogHistory || hasActiveNotification) return undefined;

    // Tier 1: User-initiated (highest priority)
    if (messageSelectorVisible) return "message-selector";

    // Tier 2: Streaming pause (blocks lower priority dialogs)
    if (isPaused) return undefined;

    // Tier 3: Security-critical (always show immediately)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gate: Lower priority dialogs wait for animation
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    // Tier 4+: Lower priority dialogs (gated by animation)
    if (canShowLowerPriority && toolPermissionQueue[0]) return "tool-permission";
    if (canShowLowerPriority && promptQueue[0]) return "prompt";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationQueue[0]) return "elicitation";
    if (canShowLowerPriority && showCostWarning) return "cost";
    if (canShowLowerPriority && showIdeOnboarding) return "ide-onboarding";
    if (canShowLowerPriority && showEffortCallout) return "effort-callout";
    if (canShowLowerPriority && showRemoteCallout) return "remote-callout";
    if (canShowLowerPriority && lspRecommendation) return "lsp-recommendation";
    if (canShowLowerPriority && showDesktopUpsell) return "desktop-upsell";

    return undefined; // No dialog
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          j8→toolJSX, a8→toolPermissionQueue, zA→promptQueue, n→workerSandboxPermissions,
//          o→elicitationState, m26→showCostWarning, W6→showIdeOnboarding
```

**Why this approach:**
- **Security first:** Sandbox permissions always show immediately
- **User intent:** User-initiated actions (message-selector) have highest priority
- **Animation gate:** Prevents jarring interruptions during local command execution
- **Cascading priority:** Lower priority dialogs only show when higher priority queues are empty

### 3.4 Dialog Priority Table

| Priority | Dialog Type | Trigger Variable | Rationale |
|----------|-------------|------------------|-----------|
| Block-all | `isViewingDialogHistory` | User searching | Any dialog would disrupt search |
| Block-all | `hasActiveNotification` | Full-screen overlay | Exclusive focus required |
| 1 | `message-selector` | User explicitly triggered | User intent highest priority |
| Block-below | `isPaused` | Streaming paused | Prevents dialog stacking |
| 2 | `sandbox-permission` | Security-critical | Must approve before execution |
| Gate | animation gate | `!toolJSX \|\| shouldContinueAnimation` | Ensures smooth UI |
| 3 | `tool-permission` | Tool approval required | Permission for tool execution |
| 4 | `prompt` | Tool interactive input | Tool needs user input |
| 5 | `worker-sandbox` | Worker security | Background agent permission |
| 6 | `elicitation` | MCP input request | External server needs input |
| 7 | `cost` | Cost threshold warning | Budget alert |
| 8 | `ide-onboarding` | IDE setup | Setup assistance |
| 9 | `effort-callout` | Effort selection | Model effort configuration |
| 10 | `remote-callout` | Remote session | Remote connection info |
| 11 | `lsp-recommendation` | LSP suggestion | Language server suggestion |
| 12 | `desktop-upsell` | App promotion | Desktop app marketing |

### 3.5 Cancel Handler (TM)

**Location:** chunks.196.mjs:420-432

**What it does:** Handles cancellation of the current operation based on the active dialog and streaming state.

```javascript
// ============================================
// handleCancel (TM) - Cancel handler with per-dialog behavior
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
function handleCancel() {
    // Elicitation cannot be cancelled
    if (focusedInputDialog === "elicitation") return;

    // Log cancel action
    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // Force end any ongoing animation
    animationController.forceEnd();

    // If there's draft input, save it as a user message
    if (inputDraft?.trim()) {
        setMessages((prev) => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // Clear input state
    clearInputState();

    // Handle based on current dialog
    if (focusedInputDialog === "tool-permission") {
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
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

    // Clear any pending tool use
    setPendingToolUse(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→animationController,
//          ez→inputDraft, gq→setMessages, $Z→createUserMessage, dE→clearInputState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue, gA→setPromptQueue,
//          M5→abortController, B5→remoteClient, x5→setPendingToolUse
```

---

## 4. LLM Agent Loop Analysis

### 4.1 mainAgentLoop (Yh) - Entry Point

**Location:** chunks.148.mjs:875-880

**What it does:** Wrapper function that collects cleanup actions and ensures they run on completion.

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
    return K;
}

// READABLE (for understanding):
async function* mainAgentLoop(params) {
    let cleanupActions = [];

    // Run the main loop and collect cleanup actions
    let result = yield* mainAgentLoopCore(params, cleanupActions);

    // Run all cleanup actions
    for (let action of cleanupActions) {
        markToolCompleted(action, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→cleanupActions, omY→mainAgentLoopCore,
//          pb→markToolCompleted
```

### 4.2 mainAgentLoopCore (omY) - Core Implementation

**Location:** chunks.148.mjs:882-1100

**What it does:** The core turn-based agent loop that manages conversation state, compaction, LLM requests, and tool execution.

```javascript
// ============================================
// mainAgentLoopCore (omY) - Core agent loop implementation
// Location: chunks.148.mjs:882-950
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
        // ... turn logic
    }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, cleanupActions) {
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

    // Get helper functions (callModel, microcompact, autocompact, uuid)
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
        // ... turn logic
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→cleanupActions, K→systemPrompt,
//          Y→userContext, z→systemContext, SKq→getModelCallHelpers, RKq→getSessionGates,
//          J→turnState
```

### 4.3 Turn State Object

**What it does:** Maintains all mutable state across turns in a single object.

```javascript
// ============================================
// Turn State Object - Mutable state across turns
// Location: chunks.148.mjs:892-903
// ============================================

// ORIGINAL (for source lookup):
J = {
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
    // Core conversation data
    messages: params.messages,              // Conversation history array
    toolUseContext: params.toolUseContext,  // Permission/session context

    // Token management
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit override

    // Compaction tracking
    autoCompactTracking: undefined,         // Tracks compaction state
    hasAttemptedReactiveCompact: false,     // Prevents infinite compaction

    // Error recovery
    maxOutputTokensRecoveryCount: 0,        // Retry counter for max_tokens errors

    // Turn management
    turnCount: 1,                           // Current turn number
    pendingToolUseSummary: undefined,       // Tool summary for next turn
    stopHookActive: undefined,              // Hook control flag

    // Mode transition
    transition: undefined                   // Mode transition state
};

// Mapping: J→turnState, A→params
```

**Why this design:**
- **Single mutable object:** All state changes happen through a single reference
- **Recovery friendly:** State can be rolled back on errors
- **Compact tracking:** Prevents infinite compaction loops
- **Turn counting:** Enables turn-based behaviors (e.g., maxTurns)

### 4.4 Turn Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TURN LIFECYCLE STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TURN START                                    │    │
│  │  State: { turnCount: N, messages: [...], ... }                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    1. MICRO-COMPACT PHASE                            │    │
│  │  • Remove consecutive duplicate messages                            │    │
│  │  • Track: query_microcompact_start → query_microcompact_end        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    2. AUTO-COMPACT PHASE                             │    │
│  │  • Check: tokenCount >= threshold?                                  │    │
│  │  • Check: consecutiveFailures < 3?                                  │    │
│  │  • If triggered: Create summary, replace old messages               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    3. CONTEXT LIMIT CHECK                            │    │
│  │  • Check: isAtBlockingLimit(tokenCount, model)?                     │    │
│  │  • If at limit: Yield error, return                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    4. LLM REQUEST PHASE                              │    │
│  │  • Build tool schemas, normalize messages                           │    │
│  │  • Call streamingQueryCore (mGq)                                    │    │
│  │  • Yield events: stream_request_start, stream_event, assistant      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    5. TOOL EXECUTION PHASE                           │    │
│  │  • Create StreamingToolExecutor (ui6)                               │    │
│  │  • Execute tools (parallel for concurrency-safe)                    │    │
│  │  • Collect tool results                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    6. TURN COMPLETION                                │    │
│  │  Decision: Continue or stop?                                        │    │
│  │  Continue if: Tools called AND no stop reason AND not at maxTurns   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cross-Module Integration Flow

### 5.1 Complete Startup Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE STARTUP SEQUENCE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CLI ENTRY                                                               │
│  ───────────────────────────────────────────────────────────────────────    │
│  cliEntry (JVz)                                                             │
│      │                                                                       │
│      ├─► Check for special modes (--version, --mcp-cli, etc.)              │
│      │                                                                       │
│      └─► mainEntry (_Vz)                                                    │
│              │                                                               │
│              ├─► Process setup (signal handlers, client type)              │
│              │                                                               │
│              └─► run (OVz)                                                  │
│                      │                                                       │
│                      ├─► preAction hook                                     │
│                      │    ├─► initializeMdm()                              │
│                      │    ├─► runInitializers()                            │
│                      │    ├─► initializeErrorLogSink()                     │
│                      │    ├─► registerInlinePlugins()                      │
│                      │    ├─► runMigrations()                              │
│                      │    └─► syncSettingsFromProject()                    │
│                      │                                                       │
│                      ├─► Parse flags, extract options                       │
│                      │                                                       │
│                      ├─► Build initialState object                          │
│                      │                                                       │
│                      └─► Branch: Interactive vs Headless                    │
│                                                                              │
│  2. STATE STORE CREATION                                                    │
│  ───────────────────────────────────────────────────────────────────────    │
│  createStateStore (WX1)                                                     │
│      │                                                                       │
│      ├─► Create observable store with initialState                         │
│      │                                                                       │
│      └─► Wrap in AppStateProvider (Yj)                                     │
│                                                                              │
│  3. UI RENDERING                                                            │
│  ───────────────────────────────────────────────────────────────────────    │
│  SessionOrchestrator (ot8)                                                  │
│      │                                                                       │
│      ├─► Initialize 35+ useState variables                                  │
│      │                                                                       │
│      ├─► Set up useAppState hooks for global state                         │
│      │                                                                       │
│      ├─► Initialize MCP clients                                             │
│      │                                                                       │
│      ├─► Build tool set from permissions                                    │
│      │                                                                       │
│      └─► Set up effect hooks for agent loop                                │
│                                                                              │
│  4. AGENT LOOP START                                                        │
│  ───────────────────────────────────────────────────────────────────────    │
│  mainAgentLoop (Yh)                                                         │
│      │                                                                       │
│      └─► mainAgentLoopCore (omY)                                            │
│              │                                                               │
│              ├─► Initialize turnState object                                │
│              │                                                               │
│              └─► Enter turn loop                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Stream Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAM EVENT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM API (Anthropic)                                                        │
│      │                                                                       │
│      │ SSE Events                                                           │
│      ▼                                                                       │
│  streamingQueryCore (mGq)                                                   │
│      │                                                                       │
│      ├─► message_start: Initialize message state                            │
│      ├─► content_block_start: Create block placeholder                     │
│      ├─► content_block_delta: Accumulate content                           │
│      ├─► content_block_stop: Yield complete message                        │
│      ├─► message_delta: Update usage, stop_reason                          │
│      └─► message_stop: Complete                                             │
│              │                                                               │
│              │ Yield events                                                  │
│              ▼                                                               │
│  mainAgentLoop (Yh)                                                         │
│      │                                                                       │
│      │ Yield events upstream                                                │
│      ▼                                                                       │
│  handleStreamedEvent (xN6)                                                  │
│      │                                                                       │
│      ├─► type: "assistant" → Add to messages array                         │
│      ├─► type: "user" → Add to messages array                              │
│      ├─► type: "stream_event" → Update streamMode                          │
│      │    ├─► content_block_start(text) → "responding"                     │
│      │    ├─► content_block_start(thinking) → "thinking"                   │
│      │    ├─► content_block_start(tool_use) → "tool-input"                 │
│      │    └─► message_stop → "tool-use"                                    │
│      ├─► type: "tombstone" → Remove from messages                          │
│      └─► type: "stream_request_start" → Set isStreaming=true               │
│              │                                                               │
│              ▼                                                               │
│  UI Re-render                                                               │
│      │                                                                       │
│      ├─► MessageList component updates                                     │
│      ├─► StreamingIndicator shows current state                            │
│      └─► Input field state changes                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Tool Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL EXECUTION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM Response contains tool_use blocks                                      │
│      │                                                                       │
│      ▼                                                                       │
│  StreamingToolExecutor (ui6)                                                │
│      │                                                                       │
│      ├─► addTool(toolUseBlock, assistantMessage)                           │
│      │                                                                       │
│      ├─► canExecuteTool(isConcurrencySafe)                                 │
│      │    ├─► Check: No executing tools?                                   │
│      │    └─► Check: All executing tools concurrency-safe?                 │
│      │                                                                       │
│      ├─► executeTool(toolEntry)                                            │
│      │    │                                                                  │
│      │    ├─► Check abort conditions                                       │
│      │    │                                                                  │
│      │    ├─► Create sibling abort controller                              │
│      │    │                                                                  │
│      │    └─► toolDispatcher (Wi6)                                         │
│      │            │                                                          │
│      │            ├─► executePreToolHooks (y4q)                           │
│      │            │    ├─► PreToolUse hooks                                │
│      │            │    └─► Can block/modify                                │
│      │            │                                                          │
│      │            ├─► executeToolCore (fxY)                               │
│      │            │    ├─► Find tool definition                            │
│      │            │    ├─► Validate input                                  │
│      │            │    ├─► Check permissions                               │
│      │            │    └─► Execute tool                                    │
│      │            │                                                          │
│      │            └─► executePostToolHooks                                │
│      │                 └─► PostToolUse hooks                               │
│      │                                                                       │
│      └─► getRemainingResults()                                             │
│           └─► Yield tool results as they complete                          │
│              │                                                               │
│              ▼                                                               │
│  Tool results added to messages                                             │
│      │                                                                       │
│      ▼                                                                       │
│  Continue to next turn                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Key Algorithms Deep Dive

### 6.1 StreamingToolExecutor Queue Algorithm

**Location:** chunks.148.mjs:3-200

**What it does:** Manages parallel execution of tools based on concurrency safety.

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
// Location: chunks.148.mjs:3-100
// ============================================

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

    // Check if a tool can be executed now
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");

        // Allow if nothing executing
        if (executing.length === 0) return true;

        // Allow if all executing tools are concurrency-safe AND this tool is too
        if (isConcurrencySafe && executing.every(t => t.isConcurrencySafe)) {
            return true;
        }

        return false;
    }

    // Get the abort reason for a tool
    getAbortReason(toolEntry) {
        // Check if parent was aborted
        if (this.toolUseContext.abortController.signal.aborted) {
            return "parent_aborted";
        }

        // Check if a sibling errored
        if (this.hasErrored) {
            return "sibling_error";
        }

        return null;
    }

    // Execute a tool
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
        try {
            for await (let event of toolDispatcher(
                toolEntry.block,
                toolEntry.assistantMessage,
                this.canUseTool,
                {...this.toolUseContext, abortController: siblingAbort}
            )) {
                // Collect results
                if (event.message) {
                    toolEntry.results.push(event.message);
                }
            }
        } catch (error) {
            this.hasErrored = true;
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, "execution_error", error)];
        }

        toolEntry.status = "completed";
    }
}

// Mapping: ui6→StreamingToolExecutor
```

**Why this approach:**
- **Parallel execution:** Concurrency-safe tools (Read, Grep, Glob) run in parallel
- **Sequential execution:** Non-safe tools (Write, Edit, Bash) wait for completion
- **Sibling abort pattern:** One tool failure aborts siblings but not parent
- **Isolation:** Each tool gets its own abort controller

### 6.2 Auto-Compact Trigger Algorithm

**Location:** chunks.147.mjs:2633-2700

**What it does:** Determines when to trigger automatic conversation compaction.

```javascript
// ============================================
// Auto-Compact Trigger Logic
// Location: chunks.147.mjs:2633-2686
// ============================================

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(messages, model, autoCompactTracking) {
    // Check if auto-compact is disabled
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) {
        return false;
    }

    // Check circuit breaker (max 3 consecutive failures)
    const MAX_FAILURES = 3;
    if (autoCompactTracking?.consecutiveFailures >= MAX_FAILURES) {
        return false;
    }

    // Calculate current token count
    const currentTokens = countTokens(messages);

    // Get model-specific threshold
    const threshold = getAutoCompactThreshold(model);

    // Trigger if above threshold
    return currentTokens >= threshold;
}

// Auto-compact dispatcher
async function autoCompactDispatcher(messages, sessionContext, systemPrompt, ...) {
    // Check if compaction is needed
    if (!shouldTriggerAutoCompaction(messages, model, autoCompactTracking)) {
        return { compactionResult: null, consecutiveFailures: 0 };
    }

    // Create compaction summary using LLM
    const summaryResult = await generateCompactSummary(messages, systemPrompt, ...);

    if (summaryResult.success) {
        // Create summary message
        const summaryMessage = {
            type: "user",
            content: summaryResult.summary,
            isCompactSummary: true
        };

        // Replace old messages with summary + recent messages
        const compactedMessages = [summaryMessage, ...recentMessages];

        return {
            compactionResult: {
                preCompactTokenCount: summaryResult.preTokenCount,
                postCompactTokenCount: summaryResult.postTokenCount,
                summaryMessages: [summaryMessage],
                attachments: []
            },
            consecutiveFailures: 0
        };
    } else {
        // Track failure
        return {
            compactionResult: null,
            consecutiveFailures: (autoCompactTracking?.consecutiveFailures ?? 0) + 1
        };
    }
}

// Mapping: sqq→autoCompactDispatcher
```

**Why this approach:**
- **Threshold-based trigger:** Only compact when token count exceeds limit
- **Circuit breaker:** Prevents infinite retry on repeated failures
- **Summary preservation:** Old context is summarized, not lost
- **Environment override:** Can be disabled via DISABLE_AUTO_COMPACT

### 6.3 Circuit Breaker Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CIRCUIT BREAKER STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                            │
│  │   NORMAL    │ ←──────────────────────────────────┐                      │
│  │   (0-1)     │                                    │                      │
│  │             │                                    │                      │
│  │ Auto-compact│     Compaction succeeds            │                      │
│  │ enabled     │ ──────────────────────────────────►│                      │
│  └──────┬──────┘                                    │                      │
│         │                                           │                      │
│         │ Compaction fails                          │                      │
│         ▼                                           │                      │
│  ┌─────────────┐                                    │                      │
│  │  WARNING    │                                    │                      │
│  │   (2)       │                                    │                      │
│  │             │                                    │                      │
│  │ Still       │     Compaction succeeds            │                      │
│  │ enabled     │ ──────────────────────────────────►│                      │
│  └──────┬──────┘                                    │                      │
│         │                                           │                      │
│         │ Compaction fails                          │                      │
│         ▼                                           │                      │
│  ┌─────────────┐                                    │                      │
│  │   TRIPPED   │                                    │                      │
│  │   (3+)      │                                    │                      │
│  │             │                                    │                      │
│  │ Auto-compact│                                    │                      │
│  │ DISABLED    │ ───────────────────────────────────┘                      │
│  │             │     (Requires session restart to reset)                   │
│  └─────────────┘                                                            │
│                                                                              │
│  States:                                                                     │
│  • NORMAL (0-1 failures): Auto-compact fully enabled                        │
│  • WARNING (2 failures): Auto-compact still enabled, logging warn          │
│  • TRIPPED (3+ failures): Auto-compact disabled, user must intervene       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Feature Interaction Matrix

### 7.1 Cross-Module Feature Integration

| Feature | CLI Integration | UI Integration | LLM Core Integration | System Reminder |
|---------|-----------------|----------------|----------------------|-----------------|
| **Permissions** | `--dangerously-skip-permissions`, `--allowed-tools` | Dialog priority, tool-permission queue | Tool filtering, canUseTool check | Permission mode attachment |
| **Compact** | `DISABLE_AUTO_COMPACT` env | Compaction indicator | Auto-compact trigger in turn loop | Token usage attachment |
| **Hooks** | `--init`, `--init-only`, `--maintenance` | Hook result display | PreToolUse/PostToolUse execution | Hook result attachments |
| **MCP** | `--mcp-config`, `--strict-mcp-config` | MCP notification UI, elicitation | MCP tool execution | MCP client state |
| **Skills** | `--disable-slash-commands`, `--plugin-dir` | Command rendering | Skill tool execution | Skill discovery context |
| **Plan Mode** | `--permission-mode plan` | Plan mode UI, question forms | Plan mode tools (EnterPlanMode, ExitPlanMode) | Plan mode attachment |
| **Thinking** | `--thinking`, `--max-thinking-tokens` | Thinking indicator | Thinking config in API params | Thinking mode context |
| **Model Selection** | `--model`, `--effort`, `--agent` | Model display in footer | Model resolution, effort tokens | Model context attachment |
| **Remote Sessions** | `--session-id`, Chrome flags | Remote session UI | Remote session config | Remote session state |
| **Team Mode** | `--agent-id`, `--team-name` | Team tab UI, teammate display | Team context, mailbox polling | Team context attachment |

### 7.2 State Propagation Matrix

| State | Source | Propagation Path |
|-------|--------|------------------|
| `toolPermissionContext` | CLI flags → initialState | createStateStore → useAppState → SessionOrchestrator → mainAgentLoop |
| `streamMode` | SSE events | handleStreamedEvent → setStreamMode → UI render |
| `messages` | User input / LLM response | handleSubmit → setMessages → mainAgentLoop → normalizeMessages |
| `autoCompactTracking` | Turn loop | mainAgentLoopCore → turnState → shouldTriggerAutoCompaction |
| `focusedInputDialog` | Dialog priority | getInputDialogType → focusedInputDialog → dialog render |
| `mcp.clients` | CLI flags / MCP discovery | initialState → useAppState → SessionOrchestrator → tool building |
| `teamContext` | CLI flags / team state | initialState → useAppState → SessionOrchestrator → attachment producer |

---

## 8. Symbol Validation Report

### 8.1 Verified Symbols

All key symbols have been cross-validated against source code:

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `OVz` | run | chunks.198.mjs:3 | ✅ VERIFIED |
| `JVz` | cliEntry | chunks.198.mjs:1573 | ✅ VERIFIED |
| `Yh` | mainAgentLoop | chunks.148.mjs:875 | ✅ VERIFIED |
| `omY` | mainAgentLoopCore | chunks.148.mjs:882 | ✅ VERIFIED |
| `ot8` | sessionOrchestrator | chunks.196.mjs:3 | ✅ VERIFIED |
| `ra6` | getInputDialogType | chunks.196.mjs:387 | ✅ VERIFIED |
| `TM` | handleCancel | chunks.196.mjs:420 | ✅ VERIFIED |
| `WX1` | createStateStore | chunks.85.mjs:1747 | ✅ VERIFIED |
| `mGq` | streamingQueryCore | chunks.171.mjs:3 | ✅ VERIFIED |
| `cM` | normalizeMessages | chunks.173.mjs:1999 | ✅ VERIFIED |
| `_uY` | assembleAllAttachments | chunks.147.mjs:3 | ✅ VERIFIED |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | ✅ VERIFIED |
| `ui6` | StreamingToolExecutor | chunks.148.mjs:3 | ✅ VERIFIED (class) |

### 8.2 Corrected Mappings

| Symbol | Incorrect Mapping | Correct Mapping |
|--------|-------------------|-----------------|
| `WJ` | ~~normalizeMessages~~ | Zod schema builder (chunks.5.mjs:945) |
| `oGz` | ~~streamJsonInputHandler~~ | getReplBridgeError (chunks.192.mjs:1983) |
| `KPA` | ~~validateMcpServers~~ | OpenTelemetry trace object (chunks.16.mjs:2445) |

---

## 9. SSE Event Processing Deep Dive

### 9.1 SSE Event Types and Handling

**Location:** chunks.171.mjs:299-400

```javascript
// ============================================
// SSE Event Processing - Full streaming implementation
// Location: chunks.171.mjs:299-400
// ============================================

// ORIGINAL (for source lookup):
switch (n6.type) {
    case "message_start": {
        a = n6.message, o = Date.now() - r, l = Qz6(l, n6.message?.usage);
        break
    }
    case "content_block_start":
        switch (n6.content_block.type) {
            case "tool_use":
                i[n6.index] = {
                    ...n6.content_block,
                    input: ""
                };
                break;
            case "server_tool_use":
                i[n6.index] = {
                    ...n6.content_block,
                    input: ""
                };
                break;
            case "text":
                i[n6.index] = {
                    ...n6.content_block,
                    text: ""
                };
                break;
            case "thinking":
                i[n6.index] = {
                    ...n6.content_block,
                    thinking: "",
                    signature: ""
                };
                break;
            default:
                i[n6.index] = {
                    ...n6.content_block
                };
                break
        }
        break;
    case "content_block_delta": {
        let S6 = i[n6.index];
        if (!S6) throw RangeError("Content block not found");
        switch (n6.delta.type) {
            case "input_json_delta":
                S6.input += n6.delta.partial_json;
                break;
            case "text_delta":
                S6.text += n6.delta.text;
                break;
            case "signature_delta":
                S6.signature = n6.delta.signature;
                break;
            case "thinking_delta":
                S6.thinking += n6.delta.thinking;
                break
        }
        break
    }
    case "content_block_stop": {
        let S6 = i[n6.index];
        let g6 = {
            message: {
                ...a,
                content: [S6]
            },
            type: "assistant",
            uuid: generateUUID()
        };
        yield g6;
        break
    }
}

// READABLE (for understanding):
switch (sseEvent.type) {
    case "message_start":
        // Initialize partial message with usage data
        partialMessage = sseEvent.message;
        timeToFirstChunk = Date.now() - requestStartTime;
        usage = mergeUsage(usage, sseEvent.message?.usage);
        break;

    case "content_block_start":
        // Create placeholder for content block
        switch (sseEvent.content_block.type) {
            case "tool_use":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    input: ""  // Will be accumulated via deltas
                };
                break;
            case "text":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    text: ""  // Will be accumulated via deltas
                };
                break;
            case "thinking":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    thinking: "",
                    signature: ""
                };
                break;
        }
        break;

    case "content_block_delta":
        // Accumulate content into existing block
        let block = contentBlocks[sseEvent.index];
        switch (sseEvent.delta.type) {
            case "text_delta":
                block.text += sseEvent.delta.text;
                break;
            case "input_json_delta":
                block.input += sseEvent.delta.partial_json;
                break;
            case "thinking_delta":
                block.thinking += sseEvent.delta.thinking;
                break;
            case "signature_delta":
                block.signature = sseEvent.delta.signature;
                break;
        }
        break;

    case "content_block_stop":
        // Yield complete message to UI
        let completedBlock = contentBlocks[sseEvent.index];
        yield {
            message: {
                ...partialMessage,
                content: [completedBlock]
            },
            type: "assistant",
            uuid: generateUUID()
        };
        break;

    case "message_delta":
        usage = mergeUsage(usage, sseEvent.usage);
        stopReason = sseEvent.delta.stop_reason;
        if (stopReason === "max_tokens") {
            yield createMaxTokensError();
        }
        break;
}

// Mapping: n6→sseEvent, a→partialMessage, o→timeToFirstChunk, l→usage,
//          i→contentBlocks, Qz6→mergeUsage
```

**Why this approach:**
- **Incremental accumulation:** Content is built via delta events, not all at once
- **Index-based tracking:** Uses array index to match deltas to blocks
- **Immediate yielding:** UI receives events in real-time for responsive display
- **Error handling:** Validates block existence before delta accumulation

### 9.2 Streaming Stall Detection

**Location:** chunks.171.mjs:280-295

```javascript
// ============================================
// Streaming Stall Detection
// Location: chunks.171.mjs:280-295
// ============================================

// ORIGINAL (for source lookup):
let E6 = !0,
    U6 = null,
    c6 = 30000,
    K1 = 0,
    j6 = 0;
for await (let n6 of H6) {
    b6();
    let d6 = Date.now();
    if (U6 !== null) {
        let S6 = d6 - U6;
        if (S6 > c6) j6++, K1 += S6, k(`Streaming stall detected: ${(S6/1000).toFixed(1)}s gap`),
            d("tengu_streaming_stall", {
                stall_duration_ms: S6,
                stall_count: j6,
                total_stall_time_ms: K1,
                event_type: n6.type,
                model: _.model,
                request_id: J6 ?? "unknown"
            })
    }
    U6 = d6;
}

// READABLE (for understanding):
let isFirstChunk = true;
let lastEventTime = null;
const STALL_THRESHOLD_MS = 30000;  // 30 seconds
let stallCount = 0;
let totalStallTime = 0;

for await (let sseEvent of eventStream) {
    resetIdleTimer();  // Reset the 30s/60s watchdog

    let currentTime = Date.now();
    if (lastEventTime !== null) {
        let gapMs = currentTime - lastEventTime;
        if (gapMs > STALL_THRESHOLD_MS) {
            stallCount++;
            totalStallTime += gapMs;
            debugLog(`Streaming stall detected: ${(gapMs/1000).toFixed(1)}s gap`);
            trackEvent("tengu_streaming_stall", {
                stall_duration_ms: gapMs,
                stall_count: stallCount,
                total_stall_time_ms: totalStallTime,
                event_type: sseEvent.type,
                model: model,
                request_id: requestId ?? "unknown"
            });
        }
    }
    lastEventTime = currentTime;
}

// Mapping: E6→isFirstChunk, U6→lastEventTime, c6→STALL_THRESHOLD_MS,
//          K1→totalStallTime, j6→stallCount, H6→eventStream, b6→resetIdleTimer
```

### 9.3 Stream Watchdog (Idle Timeout)

**Location:** chunks.171.mjs:266-275

```javascript
// ============================================
// Stream Watchdog - Idle timeout detection
// Location: chunks.171.mjs:266-275
// ============================================

// ORIGINAL (for source lookup):
let Q6 = t6(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG),
    k6 = 30000,
    Z6 = 60000,
    u6 = !1,
    C6 = null,
    o6 = null;

function b6() {
    V6();
    if (!Q6) return;
    C6 = setTimeout((E6) => {
        k(`Streaming idle warning: no chunks received for ${E6/1000}s`);
    }, k6, k6);
    o6 = setTimeout(() => {
        u6 = !0;
        k(`Streaming idle timeout: no chunks received for ${Z6/1000}s, aborting`);
        s();  // Abort the stream
    }, Z6);
}

// READABLE (for understanding):
const ENABLE_WATCHDOG = parseBoolean(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG);
const WARNING_TIMEOUT_MS = 30000;   // 30 seconds - log warning
const ABORT_TIMEOUT_MS = 60000;     // 60 seconds - abort stream
let didTimeout = false;
let warningTimer = null;
let abortTimer = null;

function resetIdleTimer() {
    clearTimers();
    if (!ENABLE_WATCHDOG) return;

    // Warning timer (30s)
    warningTimer = setTimeout(() => {
        debugLog(`Streaming idle warning: no chunks received for 30s`);
    }, WARNING_TIMEOUT_MS);

    // Abort timer (60s)
    abortTimer = setTimeout(() => {
        didTimeout = true;
        debugLog(`Streaming idle timeout: no chunks received for 60s, aborting`);
        abortStream();
    }, ABORT_TIMEOUT_MS);
}

// Mapping: Q6→ENABLE_WATCHDOG, k6→WARNING_TIMEOUT_MS, Z6→ABORT_TIMEOUT_MS,
//          u6→didTimeout, C6→warningTimer, o6→abortTimer, b6→resetIdleTimer, s→abortStream
```

---

## 10. System Reminder Integration

### 10.1 assembleAllAttachments (_uY) - Attachment Producer

**Location:** chunks.147.mjs:3-18

```javascript
// ============================================
// assembleAllAttachments (_uY) - Main attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), ...] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => fuY()), Hz("ultrathink_effort", () => TuY(A)), Hz("deferred_tools_delta", () => xE1(q.options.tools, q.options.mainLoopModel, z)), Hz("mcp_instructions_delta", () => uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z)), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => vuY(q))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => NuY()), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => qmY(z ?? [], q.options.mainLoopModel)), Hz("budget_usd", async () => YmY(q.options.maxBudgetUsd)), Hz("output_token_usage", async () => KmY()), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
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
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

    let contextWithAbort = {...toolUseContext, abortController};
    let isMainThread = !toolUseContext.agentId;  // Not a subagent

    // Phase 1: At-mentioned files (only if files were mentioned)
    let atMentionAttachments = atMentionedFiles
        ? await Promise.all([
            safeProduce("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, contextWithAbort)),
            safeProduce("mcp_resources", () => produceMcpResources(atMentionedFiles, contextWithAbort)),
            safeProduce("agent_mentions", () => produceAgentMentions(atMentionedFiles, toolUseContext.options.agentDefinitions.activeAgents))
        ])
        : [];

    // Phase 2: Always-produced attachments
    let alwaysAttachments = await Promise.all([
        safeProduce("date_change", () => produceDateChange()),
        safeProduce("ultrathink_effort", () => produceUltrathinkEffort(messages)),
        safeProduce("deferred_tools_delta", () => produceDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages)),
        safeProduce("mcp_instructions_delta", () => produceMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages)),
        safeProduce("changed_files", () => produceChangedFiles(contextWithAbort)),
        safeProduce("nested_memory", () => produceNestedMemory(contextWithAbort)),
        safeProduce("dynamic_skill", () => produceDynamicSkill(contextWithAbort)),
        safeProduce("skill_listing", () => produceSkillListing(contextWithAbort)),
        safeProduce("ultra_claude_md", async () => produceUltraClaudeMd(messages)),
        safeProduce("plan_mode", () => producePlanMode(messages, toolUseContext)),
        safeProduce("plan_mode_exit", () => producePlanModeExit(toolUseContext)),
        safeProduce("auto_mode", () => produceAutoMode(messages, toolUseContext)),
        safeProduce("auto_mode_exit", () => produceAutoModeExit(toolUseContext)),
        safeProduce("todo_reminders", () => isTeamMode() ? produceTaskReminders(messages, toolUseContext) : produceTodoReminders(messages, toolUseContext)),
        // Team mode attachments (conditional)
        ...(isTeamMode()
            ? [
                ...(sessionMemoryType === "session_memory" ? [] : [safeProduce("teammate_mailbox", async () => produceTeammateMailbox(toolUseContext))]),
                safeProduce("team_context", async () => produceTeamContext(messages ?? []))
            ]
            : []),
        safeProduce("agent_pending_messages", async () => produceAgentPendingMessages(toolUseContext)),
        safeProduce("critical_system_reminder", () => produceCriticalSystemReminder(toolUseContext))
    ]);

    // Phase 3: Main thread only attachments
    let mainThreadAttachments = isMainThread
        ? await Promise.all([
            safeProduce("ide_selection", async () => produceIdeSelection(ideState, toolUseContext)),
            safeProduce("ide_opened_file", async () => produceIdeOpenedFile(ideState, toolUseContext)),
            safeProduce("output_style", async () => produceOutputStyle()),
            safeProduce("diagnostics", async () => produceDiagnostics(toolUseContext)),
            safeProduce("lsp_diagnostics", async () => produceLspDiagnostics(toolUseContext)),
            safeProduce("unified_tasks", async () => produceUnifiedTasks(toolUseContext)),
            safeProduce("async_hook_responses", async () => produceAsyncHookResponses()),
            safeProduce("token_usage", async () => produceTokenUsage(messages ?? [], toolUseContext.options.mainLoopModel)),
            safeProduce("budget_usd", async () => produceBudgetUsd(toolUseContext.options.maxBudgetUsd)),
            safeProduce("output_token_usage", async () => produceOutputTokenUsage()),
            safeProduce("verify_plan_reminder", async () => produceVerifyPlanReminder(messages, toolUseContext)),
            safeProduce("queued_commands", () => produceQueuedCommands(queuedCommands))
        ])
        : [];

    clearTimeout(timeoutId);

    // Flatten and filter all attachments
    return [...atMentionAttachments.flat(), ...alwaysAttachments.flat(), ...mainThreadAttachments.flat()]
        .filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, Hz→safeProduce, t6→parseBoolean,
//          sK→createAbortController, E7→isTeamMode, r$→isTeamMode
```

### 10.2 Attachment Producer Types

| Producer | Type | When Produced | Purpose |
|----------|------|---------------|---------|
| `date_change` | Always | Date changed since last turn | Track conversation date |
| `ultrathink_effort` | Always | High effort + recent message | Extended thinking prompt |
| `deferred_tools_delta` | Always | Tools changed since last turn | Dynamic tool loading |
| `mcp_instructions_delta` | Always | MCP servers changed | MCP tool instructions |
| `changed_files` | Always | Files modified on disk | File change notification |
| `nested_memory` | Always | Memory files exist | Memory context |
| `dynamic_skill` | Always | Skills discovered | Skill availability |
| `skill_listing` | Always | Skills exist | Skill list for Skill tool |
| `ultra_claude_md` | Always | CLAUDE.md exists | Project instructions |
| `plan_mode` | Always | Permission mode = "plan" | Plan mode instructions |
| `plan_mode_exit` | Always | Exiting plan mode | Plan completion notice |
| `auto_mode` | Always | Permission mode = "auto" | Auto mode instructions |
| `auto_mode_exit` | Always | Exiting auto mode | Auto mode completion |
| `todo_reminders` | Always | Todos exist | Todo list context |
| `teammate_mailbox` | Team mode | Mailbox has messages | Team communication |
| `team_context` | Team mode | Team mode active | Team coordination |
| `agent_pending_messages` | Subagent | Coordinator has messages | Agent instructions |
| `critical_system_reminder` | Always | EXPERIMENTAL flag set | Critical reminders |
| `ide_selection` | Main thread | IDE selection active | Selected code context |
| `ide_opened_file` | Main thread | File open in IDE | Open file context |
| `output_style` | Main thread | Style configured | Output formatting |
| `diagnostics` | Main thread | Diagnostics exist | Error/warning context |
| `lsp_diagnostics` | Main thread | LSP diagnostics exist | Language server errors |
| `unified_tasks` | Main thread | Tasks exist | Task management |
| `async_hook_responses` | Main thread | Hook responses pending | Hook results |
| `token_usage` | Main thread | Messages exist | Token count tracking |
| `budget_usd` | Main thread | Budget configured | Cost tracking |
| `output_token_usage` | Main thread | Output tokens used | Output tracking |
| `verify_plan_reminder` | Main thread | Plan needs verification | Plan verification |
| `queued_commands` | Main thread | Commands queued | Pending commands |

### 10.3 normalizeAttachmentForAPI (Ui8)

**Location:** chunks.174.mjs:3-200

```javascript
// ============================================
// normalizeAttachmentForAPI (Ui8) - Convert attachment to API message
// Location: chunks.174.mjs:3-100
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

You are a teammate in team "${A.teamName}".

**Your Identity:**
- Name: ${A.agentName}

**Team Resources:**
- Team config: ${A.teamConfigPath}
- Task list: ${A.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.
</system-reminder>`,
            isMeta: !0
        })]
    }
    switch (A.type) {
        case "directory":
            return [createToolUseMessage("Bash", {command: `ls ${A.path}`}),
                    createToolResultMessage(stdout, stderr)];
        case "file":
            return [createToolUseMessage("Read", {file_path: A.filename}),
                    createToolResultMessage(A.content)];
        case "todo_reminder": {
            let K = A.content.map((z, _) => `${_+1}. [${z.status}] ${z.content}`).join(`\n`);
            return [createUserMessage({content: `The TodoWrite tool hasn't been used recently...`})];
        }
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
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    // Standard attachment types
    switch (attachment.type) {
        case "directory":
            // Simulates having run `ls` command
            return [
                createToolUseMessage("Bash", {command: `ls ${attachment.path}`}),
                createToolResultMessage(attachment.content, "")
            ];

        case "file":
            // Simulates having read the file
            return [
                createToolUseMessage("Read", {file_path: attachment.filename}),
                createToolResultMessage(attachment.content)
            ];

        case "todo_reminder":
            // Formats todo list as system reminder
            let todoList = attachment.content
                .map((todo, i) => `${i+1}. [${todo.status}] ${todo.content}`)
                .join('\n');
            return [createUserMessage({
                content: `The TodoWrite tool hasn't been used recently...

Here are the existing contents of your todo list:

[${todoList}]`,
                isMeta: true
            })];

        case "plan_mode":
            // Plan mode instructions
            return [createUserMessage({
                content: `You are in plan mode. Your task is to...`,
                isMeta: true
            })];

        case "token_usage":
            // Token count notification
            return [createUserMessage({
                content: `Token usage: ${attachment.count} / ${attachment.limit}`,
                isMeta: true
            })];

        // ... more cases
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, p1→createUserMessage, E7→isTeamMode
```

---

## 11. Complete Feature Linkage Diagram

### 11.1 CLI → System Reminder Linkage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → SYSTEM REMINDER LINKAGE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flag                  System Reminder Producer                         │
│  ─────────                 ────────────────────────                          │
│                                                                              │
│  --dangerously-skip-permissions  → No permission attachment (mode=bypass)   │
│  --permission-mode plan          → plan_mode attachment                     │
│  --permission-mode auto          → auto_mode attachment                     │
│  --team-name                     → team_context attachment                   │
│  --agent-id                      → agent_pending_messages attachment         │
│  --model                         → token_usage (model affects threshold)    │
│  --effort high                   → ultrathink_effort attachment              │
│  --mcp-config                    → mcp_instructions_delta attachment         │
│  --plugin-dir                    → skill_listing attachment                  │
│  --max-budget-usd                → budget_usd attachment                     │
│                                                                              │
│  Flow:                                                                       │
│  CLI Flag → initialState.toolPermissionContext → assembleAllAttachments     │
│           → normalizeAttachmentForAPI → API message with isMeta: true       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 UI → System Reminder Linkage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UI → SYSTEM REMINDER LINKAGE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  UI State                  System Reminder Producer                         │
│  ─────────                 ────────────────────────                          │
│                                                                              │
│  messages (length)                → token_usage attachment                  │
│  todos (from TodoWrite)           → todo_reminders attachment               │
│  tasks (from TaskUpdate)          → todo_reminders (team mode)              │
│  ideSelection                     → ide_selection attachment                 │
│  ideOpenedFile                    → ide_opened_file attachment               │
│  diagnostics                      → diagnostics attachment                   │
│  lspDiagnostics                   → lsp_diagnostics attachment               │
│  mcp.clients (status)             → mcp_instructions_delta attachment        │
│  skills (discovered)              → skill_listing attachment                 │
│  fileHistory (modifications)      → changed_files attachment                │
│  memoryFiles                      → nested_memory attachment                 │
│  queuedCommands                   → queued_commands attachment               │
│                                                                              │
│  Flow:                                                                       │
│  UI State → useAppState → toolUseContext → assembleAllAttachments           │
│           → normalizeAttachmentForAPI → API message                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 LLM Core → System Reminder Linkage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LLM CORE → SYSTEM REMINDER LINKAGE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM Core Event            System Reminder Producer                         │
│  ─────────────             ────────────────────────                          │
│                                                                              │
│  Turn completion                   → token_usage attachment (updated)       │
│  Auto-compact trigger              → Token usage check, no direct producer  │
│  Tool execution (deferred)         → deferred_tools_delta attachment        │
│  MCP tool discovery                → mcp_instructions_delta attachment       │
│  Skill discovery                   → skill_listing attachment                │
│  File modification (Edit/Write)    → changed_files attachment               │
│  Memory update                     → nested_memory attachment                │
│  Plan mode entry                   → plan_mode attachment                    │
│  Plan mode exit                    → plan_mode_exit attachment               │
│  Auto mode entry                   → auto_mode attachment                    │
│  Auto mode exit                    → auto_mode_exit attachment               │
│  Date change (midnight)            → date_change attachment                  │
│  Max tokens hit                    → output_token_usage attachment           │
│                                                                              │
│  Flow:                                                                       │
│  LLM Core → messages array → assembleAllAttachments                         │
│           → normalizeAttachmentForAPI → Injected before LLM request         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. UI Design Interaction Patterns

### 12.1 React/Ink Component Architecture

**What it does:** The UI layer uses React with Ink (React for CLI) to provide a responsive terminal interface with component-based architecture.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT/INK COMPONENT HIERARCHY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  <App> (Ink root - render() entry point)                                    │
│      │                                                                       │
│      └── <AppStateProvider> (Yj)                                            │
│              │   • Provides global state via React context                 │
│              │   • Wraps createStateStore (WX1)                            │
│              │                                                               │
│              └── <SessionOrchestrator> (ot8)                                │
│                      │                                                       │
│                      ├── <MessageList> (veY)                                │
│                      │       • Renders conversation history                │
│                      │       • Memoized for performance                     │
│                      │       • Uses useDeferredValue for large lists       │
│                      │                                                       │
│                      ├── <InputHandler>                                      │
│                      │       • Text input with composition support         │
│                      │       • Keyboard shortcut dispatching               │
│                      │       • Multi-line input handling                    │
│                      │                                                       │
│                      ├── <DialogRenderer>                                    │
│                      │       • Priority-based dialog display               │
│                      │       • 13 dialog types supported                    │
│                      │       • Animation state management                   │
│                      │                                                       │
│                      ├── <StatusBar>                                         │
│                      │       • Model name, mode indicator                   │
│                      │       • Token count, cost display                    │
│                      │       • Connection status                            │
│                      │                                                       │
│                      └── <StreamingIndicator>                               │
│                              • Stream mode visualization                    │
│                              • Tool execution progress                      │
│                              • Thinking animation                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 State Management Pattern

**Location:** chunks.196.mjs:30-60

```javascript
// ============================================
// State Management - 35+ useState calls in SessionOrchestrator
// Location: chunks.196.mjs:30-60
// ============================================

// ORIGINAL (for source lookup):
let [k6, Z6] = N8.useState("prompt");           // screen state
let [u6, C6] = N8.useState(!1);                  // isInputComposing
let [d7, W4] = N8.useState("responding");        // streamMode
let [JK, F3] = N8.useState([]);                  // streamingToolUses
let [MK, k3] = N8.useState(null);                // streamingThinking
let [a8, $A] = N8.useState([]);                  // toolPermissionQueue
let [G7, Q1] = N8.useState([]);                  // sandboxPermissionQueue
let [zA, gA] = N8.useState([]);                  // promptQueue
let [u7, Xz] = N8.useState(Y ?? []);             // messages

// READABLE (for understanding):
// Screen State
const [screen, setScreen] = useState("prompt");  // "prompt" | "transcript" | "tasks"

// Input State
const [isInputComposing, setIsInputComposing] = useState(false);
const [inputDraft, setInputDraft] = useState("");

// Stream Mode State
const [streamMode, setStreamMode] = useState("responding");
// Values: "responding" | "tool-input" | "thinking" | "tool-use" | "requesting"

// Streaming Content State
const [streamingToolUses, setStreamingToolUses] = useState([]);
const [streamingThinking, setStreamingThinking] = useState(null);

// Dialog Queues
const [toolPermissionQueue, setToolPermissionQueue] = useState([]);
const [sandboxPermissionQueue, setSandboxPermissionQueue] = useState([]);
const [promptQueue, setPromptQueue] = useState([]);
const [elicitationQueue, setElicitationQueue] = useState([]);

// Message State
const [messages, setMessages] = useState(initialMessages ?? []);

// Abort/Loading State
const [abortController, setAbortController] = useState(null);
const [isLoading, setIsLoading] = useState(false);

// Mapping: k6→screen, Z6→setScreen, u6→isInputComposing, C6→setIsInputComposing,
//          d7→streamMode, W4→setStreamMode, JK→streamingToolUses, F3→setStreamingToolUses,
//          MK→streamingThinking, k3→setStreamingThinking, a8→toolPermissionQueue,
//          $A→setToolPermissionQueue, G7→sandboxPermissionQueue, Q1→setSandboxPermissionQueue,
//          zA→promptQueue, gA→setPromptQueue, u7→messages, Xz→setMessages
```

### 12.3 User Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input Event                                                           │
│      │                                                                       │
│      ├─► Keyboard Event                                                     │
│      │       │                                                               │
│      │       ├─► Regular character → Append to inputDraft                  │
│      │       │                                                               │
│      │       ├─► Enter (not composing) → handleSubmit                      │
│      │       │       │                                                       │
│      │       │       ├─► Create user message                               │
│      │       │       ├─► Append to messages                                │
│      │       │       ├─► Create abort controller                           │
│      │       │       └─► Start mainAgentLoop                               │
│      │       │                                                               │
│      │       ├─► Enter (composing) → Confirm composition                   │
│      │       │                                                               │
│      │       ├─► Escape → handleCancel                                      │
│      │       │       │                                                       │
│      │       │       ├─► Abort streaming if active                         │
│      │       │       ├─► Clear dialog queue if dialog focused              │
│      │       │       └─► Reset input state                                  │
│      │       │                                                               │
│      │       ├─► Ctrl+C → Force exit                                        │
│      │       │                                                               │
│      │       └─► Custom keybinding → handleKeybinding                      │
│      │               │                                                       │
│      │               ├─► Chord detection (e.g., Ctrl+K, Ctrl+S)            │
│      │               └─► Dispatch action                                    │
│      │                                                                       │
│      └─► Mouse Event (rare in CLI)                                          │
│              └─► Scroll in message list                                     │
│                                                                              │
│  State Updates:                                                              │
│  ──────────────                                                              │
│  inputDraft change → setIsInputComposing(true)                              │
│  inputDraft empty → setIsInputComposing(false)                              │
│  submit → setIsLoading(true), setAbortController(new AbortController())     │
│  stream complete → setIsLoading(false), setAbortController(null)            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.4 handleSubmit Implementation

**Location:** chunks.196.mjs:280-320

```javascript
// ============================================
// handleSubmit - Main submission handler
// Location: chunks.196.mjs:280-320
// ============================================

// READABLE (for understanding):
async function handleSubmit(userInput) {
    // 1. Validate input
    if (!userInput?.trim()) return;

    // 2. Create user message
    const userMessage = createUserMessage({
        content: userInput,
        isMeta: false
    });

    // 3. Update messages state
    setMessages((prev) => [...prev, userMessage]);

    // 4. Clear input state
    setInputDraft("");
    setIsInputComposing(false);

    // 5. Set loading state
    setIsLoading(true);

    // 6. Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    // 7. Start agent loop
    try {
        for await (const event of mainAgentLoop({
            messages: [...messages, userMessage],
            systemPrompt: systemPrompt,
            toolUseContext: {
                ...toolPermissionContext,
                abortController: controller,
                options: {
                    tools: tools,
                    mcpClients: mcpClients,
                    mainLoopModel: model,
                    maxBudgetUsd: maxBudgetUsd
                }
            },
            canUseTool: canUseTool,
            querySource: "repl_main_thread"
        })) {
            // 8. Handle each streamed event
            handleStreamedEvent(event);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            handleError(error);
        }
    } finally {
        setIsLoading(false);
        setAbortController(null);
    }
}

// Mapping: This is a composite function showing the flow pattern
```

### 12.5 handleStreamedEvent Implementation

**Location:** chunks.196.mjs:350-400

```javascript
// ============================================
// handleStreamedEvent - Process events from agent loop
// Location: chunks.196.mjs:350-400
// ============================================

// READABLE (for understanding):
function handleStreamedEvent(event) {
    switch (event.type) {
        case "assistant": {
            // New assistant message
            setMessages((prev) => [...prev, event.message]);
            setStreamMode("responding");
            break;
        }

        case "user": {
            // Synthetic user message (e.g., tool result)
            setMessages((prev) => [...prev, event.message]);
            break;
        }

        case "stream_event": {
            // SSE event from API
            handleSseEvent(event.event);
            break;
        }

        case "tombstone": {
            // Remove message (e.g., cancelled tool)
            setMessages((prev) => prev.filter((m) => m.id !== event.messageId));
            break;
        }

        case "stream_request_start": {
            setIsStreaming(true);
            setStreamMode("requesting");
            break;
        }

        case "tool_permission_request": {
            setToolPermissionQueue((prev) => [...prev, event.request]);
            break;
        }

        case "sandbox_permission_request": {
            setSandboxPermissionQueue((prev) => [...prev, event.request]);
            break;
        }

        case "prompt_request": {
            setPromptQueue((prev) => [...prev, event.request]);
            break;
        }

        case "elicitation_request": {
            setElicitationQueue((prev) => [...prev, event.request]);
            break;
        }
    }
}

function handleSseEvent(sseEvent) {
    switch (sseEvent.type) {
        case "content_block_start": {
            const blockType = sseEvent.content_block.type;
            if (blockType === "thinking") {
                setStreamMode("thinking");
                setStreamingThinking({ thinking: "", isStreaming: true });
            } else if (blockType === "tool_use") {
                setStreamMode("tool-input");
                // Tool input JSON will be accumulated via deltas
            } else {
                setStreamMode("responding");
            }
            break;
        }

        case "content_block_delta": {
            if (sseEvent.delta.type === "thinking_delta") {
                setStreamingThinking((prev) => ({
                    ...prev,
                    thinking: prev.thinking + sseEvent.delta.thinking
                }));
            } else if (sseEvent.delta.type === "input_json_delta") {
                // Accumulate tool input JSON
            }
            break;
        }

        case "content_block_stop": {
            if (streamingThinking) {
                setStreamingThinking((prev) => ({
                    ...prev,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
            break;
        }

        case "message_stop": {
            setStreamMode("tool-use");  // Check if tools were called
            setIsStreaming(false);
            break;
        }
    }
}

// Mapping: handleStreamedEvent→xN6, handleSseEvent→internal handler
```

### 12.6 Dialog Interaction State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DIALOG INTERACTION STATE MACHINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  States:                                                                    │
│  • NO_DIALOG      - Normal input mode, no active dialog                    │
│  • DIALOG_SHOWING - Dialog is visible, waiting for user action             │
│  • DIALOG_WAITING - Dialog submitted, waiting for resolution               │
│                                                                              │
│  ┌─────────────┐                                                            │
│  │ NO_DIALOG   │                                                            │
│  │             │                                                            │
│  │ Input:      │                                                            │
│  │ • Type text │                                                            │
│  │ • Submit    │                                                            │
│  │ • Navigate  │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         │ Event triggers dialog (permission, prompt, etc.)                 │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │DIALOG_      │                                                            │
│  │ SHOWING     │                                                            │
│  │             │                                                            │
│  │ Actions:    │                                                            │
│  │ • Accept    │───► Resolve with "approve"                                │
│  │ • Reject    │───► Resolve with "deny"                                   │
│  │ • Cancel    │───► handleCancel()                                        │
│  │ • View diff │───► Open diff viewer (for Edit)                           │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         │ User responds to dialog                                           │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │DIALOG_      │                                                            │
│  │ WAITING     │                                                            │
│  │             │                                                            │
│  │ Processing  │                                                            │
│  │ response... │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         │ Resolution complete                                               │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │ NO_DIALOG   │ ◄─────────────────────────────────────────┐              │
│  └─────────────┘                                           │              │
│                                                             │              │
│  Cancel (Escape):                                          │              │
│         │                                                   │              │
│         ▼                                                   │              │
│  ┌─────────────┐                                           │              │
│  │ CANCEL_     │                                           │              │
│  │ HANDLING    │                                           │              │
│  │             │                                           │              │
│  │ • Clear Q   │───────────────────────────────────────────┘              │
│  │ • Abort     │                                                          │
│  │ • Reset     │                                                          │
│  └─────────────┘                                                           │
│                                                                             │
│  Priority Check (getInputDialogType/ra6):                                  │
│  ─────────────────────────────────────                                      │
│  1. Check block-all conditions (dialogHistory, notification)               │
│  2. Check user-initiated (message-selector)                                │
│  3. Check streaming pause (isPaused)                                       │
│  4. Check security (sandbox-permission)                                    │
│  5. Apply animation gate                                                   │
│  6. Check permission dialogs (tool-permission, prompt)                     │
│  7. Check lower priority (elicitation, cost, ide-onboarding)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.7 Keyboard Shortcut Processing

```javascript
// ============================================
// Keyboard Shortcut Processing
// Location: chunks.110.mjs (KeybindingSetup), chunks.196.mjs (handleKeyEvent)
// ============================================

// READABLE (for understanding):
function handleKeyEvent(keyEvent, state) {
    const { key, shiftKey, ctrlKey, metaKey, altKey } = keyEvent;

    // Build keystroke string
    const keystroke = buildKeystroke({
        key,
        shift: shiftKey,
        ctrl: ctrlKey,
        meta: metaKey,
        alt: altKey
    });

    // Check for chord continuation
    if (chordState.waitingForNext) {
        const chordResult = resolveChord(chordState, keystroke);
        if (chordResult.action) {
            executeAction(chordResult.action);
            resetChordState();
            return;
        }
        if (chordResult.continue) {
            updateChordState(keystroke);
            return;
        }
        resetChordState();
    }

    // Check for chord start (e.g., Ctrl+K)
    if (isChordStart(keystroke, state)) {
        setChordState({ waitingForNext: true, firstKey: keystroke });
        showChordIndicator(keystroke);
        return;
    }

    // Single key actions
    const action = resolveKeybinding(keystroke, state);
    if (action) {
        executeAction(action);
    }
}

// Default keybindings:
const DEFAULT_KEYBINDINGS = {
    "Enter": "submit",
    "Escape": "cancel",
    "Shift+Tab": "cycleMode",
    "Ctrl+C": "forceExit",
    "Ctrl+K": { chord: true, next: { "S": "save", "D": "delete" } },
    "Up": "historyPrevious",
    "Down": "historyNext"
};

// State-dependent keybindings:
// • streaming: Only Escape (cancel) available
// • dialog: Enter (accept), Escape (cancel), Tab (navigate options)
// • composing: Enter confirms composition, doesn't submit
```

---

## 13. Complete Request Lifecycle

### 13.1 End-to-End Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE REQUEST LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER INPUT PHASE                                                        │
│  ────────────────────────────────────────────────────────────────────────   │
│  User types prompt                                                          │
│      │                                                                       │
│      ├─► Input state updates (isInputComposing, inputDraft)                │
│      │                                                                       │
│      └─► User presses Enter                                                 │
│              │                                                               │
│              ├─► handleSubmit() called                                      │
│              │                                                               │
│              ├─► CreateUserMessage with content                            │
│              │                                                               │
│              └─► setMessages([...prev, userMessage])                        │
│                                                                              │
│  2. AGENT LOOP INITIALIZATION                                               │
│  ────────────────────────────────────────────────────────────────────────   │
│  mainAgentLoop(params)                                                      │
│      │                                                                       │
│      ├─► Create turnState object                                           │
│      │                                                                       │
│      ├─► Enter turn loop                                                    │
│      │                                                                       │
│      └─► Yield { type: "stream_request_start" }                            │
│                                                                              │
│  3. PRE-TURN PHASE                                                          │
│  ────────────────────────────────────────────────────────────────────────   │
│  Turn start:                                                                │
│      │                                                                       │
│      ├─► Micro-compact (remove consecutive duplicates)                     │
│      │                                                                       │
│      ├─► Auto-compact check                                                 │
│      │    ├─► Count tokens (countTokens)                                   │
│      │    ├─► Compare to threshold                                          │
│      │    └─► Trigger compaction if needed                                 │
│      │                                                                       │
│      ├─► assembleAllAttachments()                                          │
│      │    ├─► Produce date_change if date changed                          │
│      │    ├─► Produce token_usage attachment                               │
│      │    ├─► Produce plan_mode if in plan mode                            │
│      │    ├─► Produce todo_reminders                                       │
│      │    └─► Produce team_context if team mode                            │
│      │                                                                       │
│      └─► normalizeAttachmentForAPI() for each attachment                   │
│              └─► CreateUserMessage with isMeta: true                       │
│                                                                              │
│  4. API REQUEST PHASE                                                       │
│  ────────────────────────────────────────────────────────────────────────   │
│  streamingQueryCore(messages, systemPrompt, tools, ...):                   │
│      │                                                                       │
│      ├─► normalizeMessages() - Convert to API format                       │
│      │                                                                       │
│      ├─► buildToolSchema() for each tool                                   │
│      │                                                                       │
│      ├─► Build system prompt with cache controls                           │
│      │                                                                       │
│      ├─► Create API request with streaming                                 │
│      │                                                                       │
│      └─► Yield SSE events as they arrive                                   │
│              │                                                               │
│              ├─► message_start → Initialize state                          │
│              ├─► content_block_start → Create block                       │
│              ├─► content_block_delta → Accumulate                         │
│              ├─► content_block_stop → Yield complete message              │
│              └─► message_delta → Usage, stop_reason                        │
│                                                                              │
│  5. STREAMING DISPLAY PHASE                                                 │
│  ────────────────────────────────────────────────────────────────────────   │
│  handleStreamedEvent(event):                                                │
│      │                                                                       │
│      ├─► type: "assistant" → Add to messages                               │
│      │                                                                       │
│      ├─► type: "stream_event" → Update streamMode                          │
│      │    ├─► content_block_start(thinking) → "thinking"                  │
│      │    ├─► content_block_start(tool_use) → "tool-input"                │
│      │    └─► message_stop → Check for tools                              │
│      │                                                                       │
│      └─► UI re-renders with new state                                      │
│              ├─► MessageList shows new message                             │
│              ├─► StreamingIndicator shows mode                             │
│              └─► Input is disabled during streaming                        │
│                                                                              │
│  6. TOOL EXECUTION PHASE                                                    │
│  ────────────────────────────────────────────────────────────────────────   │
│  If response contains tool_use:                                             │
│      │                                                                       │
│      ├─► Create StreamingToolExecutor                                      │
│      │                                                                       │
│      ├─► For each tool_use block:                                          │
│      │    ├─► addTool(block, assistantMessage)                             │
│      │    ├─► canExecuteTool(isConcurrencySafe)                            │
│      │    │    ├─► Check executing queue                                   │
│      │    │    └─► Check concurrency safety                               │
│      │    └─► executeTool()                                                │
│      │                                                                       │
│      ├─► For each tool execution:                                          │
│      │    ├─► Check permissions (show dialog if needed)                    │
│      │    ├─► executePreToolHooks                                          │
│      │    ├─► executeToolCore                                              │
│      │    ├─► executePostToolHooks                                         │
│      │    └─► Yield tool result                                            │
│      │                                                                       │
│      └─► Collect all tool results                                          │
│              └─► Add to messages as user message                           │
│                                                                              │
│  7. TURN COMPLETION PHASE                                                   │
│  ────────────────────────────────────────────────────────────────────────   │
│  After LLM response processed:                                              │
│      │                                                                       │
│      ├─► Check stop condition:                                             │
│      │    ├─► No tool_use? → Stop                                          │
│      │    ├─► maxTurns reached? → Stop                                     │
│      │    └─► Error occurred? → Stop with error                           │
│      │                                                                       │
│      ├─► If tools called:                                                   │
│      │    ├─► turnCount++                                                  │
│      │    └─► Continue to next turn (go to step 3)                        │
│      │                                                                       │
│      └─► If no tools:                                                       │
│              ├─► Run stop hooks                                            │
│              ├─► Write session cache                                       │
│              └─► Return final result                                       │
│                                                                              │
│  8. POST-REQUEST CLEANUP                                                    │
│  ────────────────────────────────────────────────────────────────────────   │
│  After agent loop completes:                                                │
│      │                                                                       │
│      ├─► setIsLoading(false)                                               │
│      │                                                                       │
│      ├─► setAbortController(null)                                          │
│      │                                                                       │
│      ├─► setStreamMode("responding")                                        │
│      │                                                                       │
│      └─► Input is re-enabled                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| CLI Entry | chunks.198.mjs | `run` (OVz), `cliEntry` (JVz) |
| Session Orchestrator | chunks.196.mjs | `sessionOrchestrator` (ot8), `getInputDialogType` (ra6), `handleCancel` (TM) |
| Agent Loop | chunks.148.mjs | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY), `StreamingToolExecutor` (ui6) |
| Streaming | chunks.171.mjs | `streamingQueryCore` (mGq) |
| State Store | chunks.85.mjs | `createStateStore` (WX1) |
| Message Normalization | chunks.173.mjs | `normalizeMessages` (cM) |
| Attachments | chunks.147.mjs, chunks.174.mjs | `assembleAllAttachments` (_uY), `normalizeAttachmentForAPI` (Ui8) |
| Keybindings | chunks.110.mjs | `KeybindingSetup`, `handleKeyEvent` |
| Dialogs | chunks.196.mjs | Dialog priority queue, cancel handling |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - CLI-UI-LLM joint analysis with source verification and UI interaction patterns