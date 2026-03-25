# CLI-UI-LLM Core Joint Complete Analysis

> Claude Code v2.1.76 — Complete integration analysis of CLI, UI, and LLM Core modules

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Compact, Hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI Components, Slash Commands)

Key symbols referenced throughout this document:

- `sessionOrchestrator` (ot8) - Main REPL orchestration - chunks.196.mjs:3
- `mainAgentLoop` (Yh) - Agent loop entry point - chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Core iteration logic - chunks.148.mjs:882
- `createStateStore` (WX1) - Observable store factory - chunks.85.mjs:1747
- `StreamingToolExecutor` (ui6) - Parallel tool execution - chunks.148.mjs:3
- `getInputDialogType` (ra6) - Dialog priority dispatcher - chunks.196.mjs:387
- `handleCancel` (TM) - Cancel propagation handler - chunks.196.mjs:420
- `assembleAllAttachments` (_uY) - Attachment orchestrator - chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer - chunks.174.mjs:3
- `normalizeMessages` (cM) - Message normalizer - chunks.173.mjs:1999

---

## Table of Contents

- [1. Complete Startup Sequence](#1-complete-startup-sequence)
- [2. State Synchronization Patterns](#2-state-synchronization-patterns)
- [3. Error Handling Coordination](#3-error-handling-coordination)
- [4. Cross-Feature Interaction Matrix](#4-cross-feature-interaction-matrix)
- [5. Source Code Restoration](#5-source-code-restoration)
- [6. Integration Test Scenarios](#6-integration-test-scenarios)
- [7. Performance Characteristics](#7-performance-characteristics)

---

## 1. Complete Startup Sequence

### 1.1 Full Startup Flow with Timing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE STARTUP SEQUENCE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: CLI ENTRY (chunks.198.mjs)                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. cliEntry() called                                                │   │
│  │  2. Parse environment variables                                      │   │
│  │  3. Handle update check (async, non-blocking)                       │   │
│  │  4. mainEntry() → process lifecycle setup                            │   │
│  │  5. commanderSetup() → register all CLI flags                       │   │
│  │  6. Handle early exit flags (--version, --help)                     │   │
│  │                                                                      │   │
│  │  Timing: ~50-100ms                                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  PHASE 2: ACTION HANDLER (chunks.197.mjs)                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. Resolve model selection (--model, auto-detect)                  │   │
│  │  2. Load session state if --resume                                   │   │
│  │  3. Build toolPermissionContext from flags                          │   │
│  │  4. Initialize MCP clients (parallel)                               │   │
│  │  5. Run setup screens if needed (onboarding, trust, policy)         │   │
│  │  6. Construct initialState object (~35 fields)                      │   │
│  │                                                                      │   │
│  │  Timing: ~200-500ms (varies by MCP config)                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  PHASE 3: STATE STORE INITIALIZATION (chunks.85.mjs)                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. createStateStore(initialState, onChangeAppStateHandler)         │   │
│  │  2. Store holds single state object reference                       │   │
│  │  3. Subscribe pattern for React integration                         │   │
│  │                                                                      │   │
│  │  Timing: ~1ms                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  PHASE 4: INK RENDER INITIALIZATION (chunks.189.mjs)                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. createRenderOptions(rGz) → FPS tracking setup                   │   │
│  │  2. createRoot(renderOptions) → Ink instance                        │   │
│  │  3. Prepare React element tree                                      │   │
│  │                                                                      │   │
│  │  Timing: ~10-20ms                                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  PHASE 5: REACT TREE MOUNT (chunks.176.mjs, chunks.196.mjs)                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  1. renderAndWait(ink, <AppStateRoot>)                              │   │
│  │  2. AppStateProvider creates store context                          │   │
│  │  3. FpsMetricsWrapper provides performance context                  │   │
│  │  4. sessionOrchestrator (REPL) mounts                               │   │
│  │  5. Initial hooks run (useEffect, useMemo)                          │   │
│  │  6. First render completes                                          │   │
│  │                                                                      │   │
│  │  Timing: ~50-100ms                                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  PHASE 6: READY STATE                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  • REPL is interactive                                              │   │
│  │  • Input box focused                                                │   │
│  │  • System reminders loaded                                          │   │
│  │  • MCP clients connected                                            │   │
│  │  • Ready for user input                                             │   │
│  │                                                                      │   │
│  │  Total startup time: ~300-700ms (typical)                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Startup Code Flow

```javascript
// ============================================
// Simplified startup sequence
// Location: chunks.198.mjs → chunks.197.mjs → chunks.196.mjs
// ============================================

// READABLE (for understanding):
async function cliEntry() {
    // Phase 1: Environment setup
    setupEnvironment();
    checkForUpdates();  // Non-blocking

    // Phase 2: Main entry
    await mainEntry();
}

async function mainEntry() {
    // Phase 3: Commander setup
    let program = commanderSetup();

    // Phase 4: Parse and execute
    await program.parseAsync(process.argv);
}

async function actionHandler(options) {
    // Phase 5: Build initial state
    let initialState = {
        verbose: options.verbose,
        model: resolveModel(options.model),
        toolPermissionContext: buildPermissionContext(options),
        messages: await loadSessionIfExists(options.resume),
        // ... ~30 more fields
    };

    // Phase 6: Setup screens (if needed)
    if (needsOnboarding) {
        await showSetupScreens(inkInstance);
    }

    // Phase 7: Create state store
    let store = createStateStore(initialState, onChangeAppStateHandler);

    // Phase 8: Mount React tree
    let inkRoot = createRoot(createRenderOptions());
    await renderAndWait(inkRoot, <AppStateRoot store={store} />);
}
```

---

## 2. State Synchronization Patterns

### 2.1 State Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STATE SYNCHRONIZATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI FLAGS                                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  --verbose, --model, --plan, --resume, --dangerously-skip...     │       │
│  └──────────────────────────┬───────────────────────────────────────┘       │
│                              │                                               │
│                              ▼                                               │
│  INITIAL STATE OBJECT (~35 fields)                                          │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  { verbose, model, messages, toolPermissionContext, ... }        │       │
│  └──────────────────────────┬───────────────────────────────────────┘       │
│                              │                                               │
│                              ▼                                               │
│  STATE STORE (createStateStore WX1)                                         │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │       │
│  │  │  getState   │  │  setState   │  │  subscribe  │              │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │       │
│  │         │                │                │                       │       │
│  │         │                ▼                │                       │       │
│  │         │    ┌─────────────────────┐      │                       │       │
│  │         │    │ onChangeCallback    │      │                       │       │
│  │         │    │ (K11)               │      │                       │       │
│  │         │    └──────────┬──────────┘      │                       │       │
│  │         │               │                  │                       │       │
│  │         │               ▼                  │                       │       │
│  │         │    ┌─────────────────────┐      │                       │       │
│  │         │    │ Notify subscribers  │──────┘                       │       │
│  │         │    └─────────────────────┘                              │       │
│  │         │                                                          │       │
│  └─────────┼──────────────────────────────────────────────────────────┘       │
│            │                                                                 │
│            ▼                                                                 │
│  REACT CONTEXT (AppStateProvider Yj)                                        │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  useAppState(selector) → reads slice                              │       │
│  │  useSetAppState() → returns setState                             │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│            │                                                                 │
│            ▼                                                                 │
│  UI COMPONENTS                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  SessionLogRenderer, InputBox, StatusBar, Dialogs, etc.          │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 State Update Propagation

```javascript
// ============================================
// State update flow with side effects
// Location: chunks.85.mjs:1747-1766
// ============================================

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        getState: () => currentState,

        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            // Bail-out if same reference
            if (Object.is(nextState, prevState)) return;

            currentState = nextState;

            // 1. SIDE EFFECTS FIRST (disk, MCP, telemetry)
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            // 2. THEN notify React subscribers
            for (let notify of subscribers) notify();
        },

        subscribe: (notify) => {
            subscribers.add(notify);
            return () => subscribers.delete(notify);
        }
    };
}
```

### 2.3 Cross-Module State Dependencies

| State Field | CLI Source | UI Consumer | LLM Core Consumer |
|-------------|------------|-------------|-------------------|
| `messages` | --resume | SessionLogRenderer | Agent loop input |
| `model` | --model | StatusBar | API request |
| `verbose` | --verbose | MessageRenderer | Logging level |
| `toolPermissionContext` | --allowed-tools | PermissionGate | Tool execution |
| `streamMode` | - | StreamingIndicator | Event processor |
| `isLoading` | - | InputBox | Query state |
| `mcp` | MCP config | MCP status | Tool definitions |
| `thinkingEnabled` | --thinking | ThinkingIndicator | API params |

---

## 3. Error Handling Coordination

### 3.1 Error Propagation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING COORDINATION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ERROR SOURCE                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  LLM API Error, Tool Error, Network Error, User Abort, etc.      │       │
│  └──────────────────────────┬───────────────────────────────────────┘       │
│                              │                                               │
│                              ▼                                               │
│  AGENT LOOP ERROR HANDLING                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  try {                                                            │       │
│  │      for await (event of mainAgentLoopCore) { ... }              │       │
│  │  } catch (error) {                                                │       │
│  │      if (error instanceof OverloadedError && fallbackModel) {    │       │
│  │          // Model fallback recovery                               │       │
│  │          retry with fallbackModel                                 │       │
│  │      }                                                            │       │
│  │      if (error instanceof ImageError) {                           │       │
│  │          yield userMessage with error explanation                 │       │
│  │          return { reason: "image_error" }                         │       │
│  │      }                                                            │       │
│  │      // Generic error                                             │       │
│  │      yield* addErrorMessage(assistantMessages, error.message)    │       │
│  │      return { reason: "model_error", error }                      │       │
│  │  }                                                                │       │
│  └──────────────────────────┬───────────────────────────────────────┘       │
│                              │                                               │
│                              ▼                                               │
│  UI ERROR DISPLAY                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  1. Add error message to messages state                           │       │
│  │  2. SessionLogRenderer displays error                             │       │
│  │  3. setIsLoading(false)                                           │       │
│  │  4. setStreamMode(null)                                           │       │
│  │  5. Input becomes interactive again                               │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Error Recovery Patterns

```javascript
// ============================================
// Model fallback recovery
// Location: chunks.148.mjs:1116-1127
// ============================================

// READABLE (for understanding):
} catch (error) {
    if (error instanceof OverloadedError && fallbackModel) {
        // Switch to fallback model
        currentModel = fallbackModel;
        shouldRetry = true;

        // Notify user
        yield createWarningMessage(`Switched to ${fallbackModel} due to high demand`);

        // Reset all buffers
        assistantMessages.length = 0;
        toolResults.length = 0;

        // Recreate streaming tool executor
        streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);

        continue;  // Retry with fallback
    }
}

// ============================================
// Context overflow recovery (tombstone)
// Location: chunks.148.mjs:1062-1071
// ============================================

if (contextOverflowDetected) {
    // Yield tombstone for each orphaned message
    for (let msg of orphanedMessages) {
        yield { type: "tombstone", message: msg };
    }

    // Clear all buffers
    orphanedMessages.length = 0;
    toolResults.length = 0;
    toolUseBlocks.length = 0;

    // Reset streaming tool executor
    streamingToolExecutor.discard();
    streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);
}
```

### 3.3 Abort Handling

```javascript
// ============================================
// User abort handling
// Location: chunks.148.mjs:1152-1161
// ============================================

// READABLE (for understanding):
if (abortController.signal.aborted) {
    // Wait for remaining tool results
    if (streamingToolExecutor) {
        for await (let result of streamingToolExecutor.getRemainingResults()) {
            if (result.message) yield result.message;
        }
    } else {
        yield* addErrorMessage(assistantMessages, "Interrupted by user");
    }

    // Only show interruption message if not an "interrupt" (graceful)
    if (abortController.signal.reason !== "interrupt") {
        yield updateUserMessage({ toolUse: false });
    }

    return { reason: "aborted_streaming" };
}
```

---

## 4. Cross-Feature Interaction Matrix

### 4.1 Feature Interaction Table

| Feature A | Feature B | Interaction Point | Description |
|-----------|-----------|-------------------|-------------|
| Plan Mode | System Reminder | `producePlanModeAttachment` | Plan mode instructions injected as attachment |
| Plan Mode | Tool Execution | Permission gate | Plan mode restricts write tools |
| Compact | Message List | Tombstone events | Compact removes old messages via tombstone |
| Hooks | Tool Execution | PreToolUse/PostToolUse | Hooks can block or modify tool execution |
| Thinking | Streaming UI | `streamingThinking` state | Thinking blocks shown during streaming |
| MCP | Tools | Tool definitions | MCP servers provide additional tools |
| Background Tasks | UI | Task status display | Background tasks shown in status bar |
| Todo | System Reminder | `produceTodoReminder` | Todo list injected as attachment |
| Team Mode | System Reminder | `produceTeamContextAttachment` | Team context injected as attachment |
| Streaming | Tool Execution | `StreamingToolExecutor` | Tools execute while LLM streams |

### 4.2 Mode Transition Matrix

| Current Mode | Trigger | Next Mode | UI Effect |
|--------------|---------|-----------|-----------|
| default | EnterPlanMode tool | plan | Plan instructions attached |
| plan | ExitPlanMode tool | default | Plan exit attached |
| default | Auto mode activation | auto | Auto instructions attached |
| auto | Auto mode exit | default | Auto exit attached |
| default | Team join | team | Team context attached |

### 4.3 Event Flow Matrix

| Event Type | Source | UI Handler | State Effect |
|------------|--------|------------|--------------|
| `stream_request_start` | Agent loop | `setStreamMode("requesting")` | Show waiting indicator |
| `content_block_start` (text) | LLM API | `setStreamMode("responding")` | Show text streaming |
| `content_block_start` (thinking) | LLM API | `setStreamMode("thinking")` | Show thinking animation |
| `content_block_start` (tool_use) | LLM API | `setStreamMode("tool-input")` | Show tool input preview |
| `content_block_delta` | LLM API | Update response length | Update token counter |
| `message_stop` | LLM API | `setStreamMode("tool-use")` | Show tool execution |
| `assistant` | Agent loop | `setMessages([...prev, event])` | Add message to transcript |
| `user` (tool result) | Tool executor | `setMessages([...prev, event])` | Add tool result |
| `tombstone` | Agent loop | `setMessages(prev => filter(...))` | Remove message |
| `system` | Agent loop | Add notification | Show system message |

---

## 5. Source Code Restoration

### 5.1 Main Agent Loop

```javascript
// ============================================
// mainAgentLoop (Yh) - Entry point for LLM queries
// Location: chunks.148.mjs:875-879
// ============================================

// ORIGINAL (for source lookup):
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}

// READABLE (for understanding):
async function* mainAgentLoop(context) {
    // Track completed tool uses for post-processing
    let completedToolUses = [];

    // Delegate to core loop
    let result = yield* mainAgentLoopCore(context, completedToolUses);

    // Mark all tool uses as completed
    for (let toolUse of completedToolUses) {
        markToolUseCompleted(toolUse, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, q→completedToolUses, omY→mainAgentLoopCore, pb→markToolUseCompleted
```

### 5.2 Dialog Priority Dispatcher

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
    // Block all dialogs during certain states
    if (isDialogLocked || hasBlockingDialog) return undefined;

    // High-priority: Message selector (always shown if active)
    if (isMessageSelectorVisible) return "message-selector";

    // Loading state blocks most dialogs
    if (isLoading) return undefined;

    // High-priority: Sandbox permission
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Medium-priority dialogs (only if animation should continue)
    let shouldShowDialogs = !toolJSX || toolJSX.shouldContinueAnimation;

    if (shouldShowDialogs) {
        // Tool permission prompts
        if (toolPermissionQueue[0]) return "tool-permission";

        // User input prompts
        if (promptQueue[0]) return "prompt";

        // Worker sandbox permissions
        if (workerSandboxQueue.queue[0]) return "worker-sandbox-permission";

        // Elicitation dialogs
        if (elicitationQueue.queue[0]) return "elicitation";

        // Low-priority: Status notifications
        if (showCostWarning) return "cost";
        if (showIdeOnboarding) return "ide-onboarding";
        if (showEffortCallout) return "effort-callout";
        if (showRemoteCallout) return "remote-callout";
        if (showLspRecommendation) return "lsp-recommendation";
        if (showDesktopUpsell) return "desktop-upsell";
    }

    return undefined;  // No dialog to show
}

// Mapping: ra6→getInputDialogType, lV6→isDialogLocked, na6→hasBlockingDialog,
//          W7→isMessageSelectorVisible, y2→isLoading, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n→workerSandboxQueue,
//          o→elicitationQueue, m26→showCostWarning, W6→showIdeOnboarding,
//          g6→showEffortCallout, J1→showRemoteCallout, e8→showLspRecommendation,
//          E1→showDesktopUpsell, j8→toolJSX, P1→shouldShowDialogs
```

### 5.3 Cancel Propagation Handler

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
    // Don't cancel elicitation dialogs (special handling required)
    if (focusedDialog === "elicitation") return;

    // Log cancel action
    debugLog(`[onCancel] focusedInputDialog=${focusedDialog} streamMode=${streamMode}`);

    // Force end any pending operations
    forceEndTracker.forceEnd();

    // Save any partial input as draft message
    if (inputDraft?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // Reset loading state
    resetLoadingState();

    // Handle cancel based on dialog type
    if (focusedDialog === "tool-permission") {
        // Abort tool permission request
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedDialog === "prompt") {
        // Reject all pending prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (remoteSession.isRemoteMode) {
        // Cancel remote request
        remoteSession.cancelRequest();
    } else {
        // Cancel local request
        abortController?.abort();
    }

    // Clear abort controller
    setAbortController(null);
}

// Mapping: TM→handleCancel, K2→focusedDialog, d7→streamMode, J9→forceEndTracker,
//          ez→inputDraft, gq→setMessages, $Z→createUserMessage, dE→resetLoadingState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue,
//          gA→setPromptQueue, M5→abortController, x5→setAbortController, B5→remoteSession
```

---

## 6. Integration Test Scenarios

### 6.1 Query Flow Test

```javascript
// Test: Complete query flow from input to response

describe('Query Flow Integration', () => {
    it('should process user input through complete pipeline', async () => {
        // 1. User types message
        simulateUserInput('What is 2+2?');

        // 2. onQuery called
        await waitFor(() => expect(isLoading).toBe(true));

        // 3. Agent loop invoked
        expect(mainAgentLoop).toHaveBeenCalledWith(expect.objectContaining({
            messages: expect.arrayContaining([
                expect.objectContaining({ type: 'user' })
            ])
        }));

        // 4. Stream events processed
        await waitFor(() => expect(streamMode).toBe('requesting'));

        // 5. Response received
        await waitFor(() => expect(messages).toContainEqual(
            expect.objectContaining({
                type: 'assistant',
                message: expect.objectContaining({
                    content: expect.arrayContaining([
                        expect.objectContaining({ type: 'text' })
                    ])
                })
            })
        ));

        // 6. Loading complete
        await waitFor(() => expect(isLoading).toBe(false));
    });
});
```

### 6.2 Tool Execution Test

```javascript
// Test: Tool execution with streaming

describe('Tool Execution Integration', () => {
    it('should execute tools while streaming', async () => {
        // 1. LLM outputs tool_use
        simulateToolUseStreaming('Bash', { command: 'echo test' });

        // 2. Stream mode changes to tool-input
        await waitFor(() => expect(streamMode).toBe('tool-input'));

        // 3. Tool added to streamingToolUses
        await waitFor(() => expect(streamingToolUses).toHaveLength(1));

        // 4. Tool completes streaming
        simulateContentBlockStop();

        // 5. Tool execution starts
        await waitFor(() => expect(streamMode).toBe('tool-use'));

        // 6. Tool result appears
        await waitFor(() => expect(messages).toContainEqual(
            expect.objectContaining({
                type: 'user',
                message: expect.objectContaining({
                    content: expect.arrayContaining([
                        expect.objectContaining({ type: 'tool_result' })
                    ])
                })
            })
        ));
    });
});
```

### 6.3 Cancel Flow Test

```javascript
// Test: User cancellation

describe('Cancel Integration', () => {
    it('should handle user cancel during streaming', async () => {
        // 1. Start query
        simulateUserInput('Long running query');
        await waitFor(() => expect(isLoading).toBe(true));

        // 2. Press Escape
        simulateKeyPress('escape');

        // 3. Cancel handler invoked
        expect(handleCancel).toHaveBeenCalled();

        // 4. Abort triggered
        expect(abortController.signal.aborted).toBe(true);

        // 5. Loading state reset
        await waitFor(() => expect(isLoading).toBe(false));

        // 6. UI returns to interactive state
        expect(streamMode).toBe(null);
    });
});
```

---

## 7. Performance Characteristics

### 7.1 Timing Benchmarks

| Operation | Typical Time | Max Acceptable |
|-----------|--------------|----------------|
| CLI startup to REPL ready | 300-700ms | 2000ms |
| State update propagation | 1-5ms | 16ms (60fps) |
| Attachment production | 50-200ms | 1000ms |
| Dialog priority check | <1ms | 16ms |
| Stream event processing | <1ms per event | 16ms |
| Message list re-render | 5-20ms | 100ms |

### 7.2 Memory Characteristics

| Component | Memory Usage | Notes |
|-----------|--------------|-------|
| State store | ~1KB base + messages | Grows with conversation |
| Streaming state | ~100 bytes per tool | Cleared after query |
| Thinking state | ~1-10KB | Cleared after 30 seconds |
| Attachment cache | ~5-50KB per attachment | Filtered per query |

### 7.3 Optimization Strategies

1. **React state batching**: Multiple setState calls batched into single render
2. **Deferred values**: Message updates deferred during input
3. **Memoization**: Component memoization with useMemoCache
4. **Selector pattern**: useAppState reads specific slices, avoiding full re-renders
5. **Streaming separation**: Partial content in separate state from messages

---

## 8. Summary

The CLI-UI-LLM integration represents a sophisticated architecture with:

1. **Clear separation of concerns**: CLI handles flags, UI handles display, LLM Core handles logic
2. **State-driven updates**: Single state store with subscription pattern
3. **Event-driven streaming**: Async generators for LLM response handling
4. **Graceful error handling**: Multiple recovery patterns for different error types
5. **Feature composition**: Cross-cutting features integrate through defined points

The key architectural insights are:

- **State store as intermediary**: CLI flags set initial state, React components read reactively
- **StreamingToolExecutor for parallelism**: Tools execute while LLM continues streaming
- **Attachment producers for context injection**: System reminders injected without user action
- **Dialog priority dispatcher**: Ensures user sees most important prompt first
- **Cancel propagation**: Sibling abort pattern isolates tool execution

---

## 9. Related Documentation

- [CLI Module](../01_cli/) - CLI entry points and configuration
- [UI Module](../02_ui/) - React/Ink components and interactions
- [LLM Core Module](../03_llm_core/) - Agent loop and stream processing
- [System Reminder Module](../04_system_reminder/) - Attachment types and producers
- [Algorithms Source Restoration](./algorithms_source_restoration.md) - Detailed algorithm analysis
- [UI Design Interaction Complete](../02_ui/ui_design_interaction_complete.md) - UI component analysis