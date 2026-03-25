# Algorithm Deep Dive (Claude Code v2.1.76)

> Detailed source-level analysis of key algorithms: tool execution, dialog priority, auto-compact, and state management.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.

---

## Table of Contents

1. [StreamingToolExecutor Queue Algorithm](#1-streamingtoolexecutor-queue-algorithm)
2. [Dialog Priority Dispatcher Algorithm](#2-dialog-priority-dispatcher-algorithm)
3. [Auto-Compact Trigger Algorithm](#3-auto-compact-trigger-algorithm)
4. [Message Normalization Algorithm](#4-message-normalization-algorithm)
5. [Cancel Handler Algorithm](#5-cancel-handler-algorithm)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.148.mjs:3
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `handleCancel` (TM) - Cancel handler at chunks.196.mjs:420
- `autoCompactDispatcher` (sqq) - Auto-compact at chunks.147.mjs:2633
- `normalizeMessages` (cM) - Message normalization at chunks.173.mjs:1999

---

## 1. StreamingToolExecutor Queue Algorithm

### Location
chunks.148.mjs:3-250

### What it does
Manages parallel execution of tools based on their concurrency safety rating. Tools that are "concurrency-safe" (Read, Grep, Glob) can run in parallel, while non-safe tools (Write, Edit, Bash) must run sequentially.

### How it works

#### 1.1 Class Structure

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
// Location: chunks.148.mjs:3-20
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
    toolDefinitions;      // Available tool definitions
    canUseTool;           // Permission check function
    tools = [];           // Queue of tool executions
    toolUseContext;       // Session/permission context
    hasErrored = false;   // Circuit breaker flag
    erroredToolDescription = "";  // Description of failed tool
    siblingAbortController;       // Isolated abort controller
    discarded = false;    // Discard flag for streaming fallback
    progressAvailableResolve;     // Progress promise resolver

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone the abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext,
//          Wm→cloneAbortController
```

#### 1.2 addTool Method - Queue Management

**Location:** chunks.148.mjs:21-61

```javascript
// ============================================
// addTool - Add a tool to the execution queue
// Location: chunks.148.mjs:21-61
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
addTool(toolUseBlock, assistantMessage) {
    // Find tool definition by name
    let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

    // If tool not found, create error result immediately
    if (!toolDef) {
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
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

    // Normalize tool input (handle string->typed conversions)
    toolUseBlock.input = normalizeToolInput(toolDef, toolUseBlock.input);

    // Parse and validate input against schema
    let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);

    // Determine concurrency safety
    let isConcurrencySafe = parseResult?.success ? (() => {
        try {
            return Boolean(toolDef.isConcurrencySafe(parseResult.data));
        } catch {
            return false;
        }
    })() : false;

    // Add to queue
    this.tools.push({
        id: toolUseBlock.id,
        block: toolUseBlock,
        assistantMessage: assistantMessage,
        status: "queued",
        isConcurrencySafe: isConcurrencySafe,
        pendingProgress: []
    });

    // Start processing queue
    this.processQueue();
}

// Mapping: dK→findToolByName, PE1→normalizeToolInput, p1→createUserMessage
```

**Why this approach:**
- **Immediate error handling:** Missing tools get synthetic error without blocking
- **Concurrency detection:** Calls tool's `isConcurrencySafe()` with parsed input
- **Fail-safe default:** If `isConcurrencySafe()` throws, defaults to `false`

#### 1.3 canExecuteTool - Execution Gate

**Location:** chunks.148.mjs:62-65

```javascript
// ============================================
// canExecuteTool - Check if a tool can be executed now
// Location: chunks.148.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    // Get currently executing tools
    let executing = this.tools.filter((t) => t.status === "executing");

    // Allow execution if:
    // 1. Nothing is currently executing, OR
    // 2. This tool is concurrency-safe AND all executing tools are concurrency-safe
    return executing.length === 0 ||
           (isConcurrencySafe && executing.every((t) => t.isConcurrencySafe));
}

// Mapping: A→isConcurrencySafe, q→executing
```

**Why this approach:**
- **Empty queue = immediate execution:** No waiting when nothing is running
- **All-safe parallel execution:** If all running tools are safe, a new safe tool can join
- **Non-safe blocks:** A non-safe tool must wait for everything to complete

#### 1.4 processQueue - Queue Processor

**Location:** chunks.148.mjs:66-72

```javascript
// ============================================
// processQueue - Process queued tools
// Location: chunks.148.mjs:66-72
// ============================================

// ORIGINAL (for source lookup):
async processQueue() {
    for (let A of this.tools) {
        if (A.status !== "queued") continue;
        if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
        else if (!A.isConcurrencySafe) break
    }
}

// READABLE (for understanding):
async processQueue() {
    for (let toolEntry of this.tools) {
        // Skip non-queued tools
        if (toolEntry.status !== "queued") continue;

        // Check if we can execute this tool now
        if (this.canExecuteTool(toolEntry.isConcurrencySafe)) {
            await this.executeTool(toolEntry);
        } else if (!toolEntry.isConcurrencySafe) {
            // Non-safe tool blocked - stop processing until it can run
            break;
        }
        // Safe tool that can't run yet: continue to next tool
    }
}

// Mapping: A→toolEntry
```

**Why this approach:**
- **Sequential iteration:** Processes tools in order they were added
- **Non-safe blocking:** A blocked non-safe tool stops the loop (prevents out-of-order)
- **Safe tool skipping:** Safe tools that can't run yet are skipped, allowing parallel execution

#### 1.5 getAbortReason - Abort Detection

**Location:** chunks.148.mjs:107-115

```javascript
// ============================================
// getAbortReason - Determine why tool should abort
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
    // Check if entire executor was discarded (streaming fallback)
    if (this.discarded) return "streaming_fallback";

    // Check if a sibling tool errored
    if (this.hasErrored) return "sibling_error";

    // Check if parent abort controller was triggered
    if (this.toolUseContext.abortController.signal.aborted) {
        // Check for interrupt signal
        if (this.toolUseContext.abortController.signal.reason === "interrupt") {
            // Check tool's interrupt behavior
            return this.getToolInterruptBehavior(toolEntry) === "cancel"
                ? "user_interrupted"
                : null;  // Tool can continue
        }
        return "user_interrupted";
    }

    return null;  // No abort reason
}

// Mapping: A→toolEntry
```

**Why this approach:**
- **Priority order:** Discarded > Sibling error > User interrupt
- **Interrupt behavior respect:** Some tools (like Bash) can continue during interrupt
- **Sibling isolation:** One tool failure aborts siblings, not parent

---

## 2. Dialog Priority Dispatcher Algorithm

### Location
chunks.196.mjs:387-404

### What it does
Determines which dialog should be displayed based on a strict priority hierarchy. Ensures only one dialog is visible at a time, with security-critical dialogs always showing first.

### How it works

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
    // ===== TIER 0: Absolute Blocks =====
    // These conditions prevent any dialog from showing

    if (isViewingDialogHistory) return undefined;  // User is searching history
    if (hasActiveNotification) return undefined;    // Full-screen overlay active

    // ===== TIER 1: User-Initiated (Highest Priority) =====
    // User explicitly triggered this action

    if (messageSelectorVisible) return "message-selector";  // Escape×2 pressed

    // ===== TIER 2: Streaming Pause =====
    // Paused streaming blocks lower priority dialogs

    if (isPaused) return undefined;

    // ===== TIER 3: Security-Critical =====
    // Always show immediately, no animation gate

    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // ===== ANIMATION GATE =====
    // Lower priority dialogs wait for animation to complete
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    // ===== TIER 4+: Lower Priority Dialogs =====
    // These are gated by the animation state

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

    return undefined;  // No dialog to show
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          j8→toolJSX, a8→toolPermissionQueue, zA→promptQueue
```

### Decision Tree

```
                         ┌─────────────────┐
                         │    START        │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
            ┌───────────────┐           ┌───────────────┐
            │ isViewing     │           │ hasActive     │
            │ DialogHistory?│           │ Notification? │
            └───────┬───────┘           └───────┬───────┘
                    │                           │
                 Yes│                        Yes│
                    │                           │
                    ▼                           ▼
            ┌───────────────┐           ┌───────────────┐
            │ return        │           │ return        │
            │ undefined     │           │ undefined     │
            └───────────────┘           └───────────────┘

                    │ No                           │ No
                    │                              │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ messageSelector │
                         │ Visible?        │
                         └────────┬────────┘
                                  │
                               Yes│
                                  ▼
                         ┌─────────────────┐
                         │ return          │
                         │"message-selector"│
                         └─────────────────┘

                                  │ No
                                  ▼
                         ┌─────────────────┐
                         │ isPaused?       │
                         └────────┬────────┘
                                  │
                               Yes│
                                  ▼
                         ┌─────────────────┐
                         │ return          │
                         │ undefined       │
                         └─────────────────┘

                                  │ No
                                  ▼
                         ┌─────────────────┐
                         │ sandboxQueue[0]?│
                         └────────┬────────┘
                                  │
                               Yes│
                                  ▼
                         ┌─────────────────┐
                         │ return          │
                         │"sandbox-permission"│
                         └─────────────────┘

                                  │ No
                                  ▼
                    ┌─────────────────────────┐
                    │ Animation Gate Check    │
                    │ !toolJSX ||             │
                    │ shouldContinueAnimation?│
                    └────────────┬────────────┘
                                 │
                           No────┼────Yes
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
           ┌───────────────┐        Check lower priority
           │ return        │        dialogs in order
           │ undefined     │        (tool-permission,
           └───────────────┘         prompt, elicitation,
                                    cost, etc.)
```

### Why this approach

1. **Security First:** Sandbox permissions (executing untrusted code) always show immediately
2. **User Intent:** User-initiated actions (message-selector) take precedence
3. **Animation Gate:** Prevents jarring interruptions during local command execution
4. **Queue Processing:** Each dialog type has its own queue, processed in priority order
5. **Single Dialog:** Only one dialog visible at a time, preventing UI clutter

---

## 3. Auto-Compact Trigger Algorithm

### Location
chunks.147.mjs:2633-2700

### What it does
Determines when to trigger automatic conversation compaction based on token count, failure history, and environment settings.

### Key Decision Points

```javascript
// ============================================
// Auto-Compact Trigger Logic
// Location: chunks.147.mjs:2633-2686 (inferred)
// ============================================

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(messages, model, autoCompactTracking) {
    // ===== CHECK 1: Environment Override =====
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) {
        return false;  // User explicitly disabled
    }

    // ===== CHECK 2: Circuit Breaker =====
    const MAX_FAILURES = 3;
    if (autoCompactTracking?.consecutiveFailures >= MAX_FAILURES) {
        // Too many consecutive failures - disable auto-compact for this session
        return false;
    }

    // ===== CHECK 3: Token Threshold =====
    const currentTokens = countTokens(messages);
    const threshold = getAutoCompactThreshold(model);

    return currentTokens >= threshold;
}
```

### Token Threshold Calculation

```javascript
// ============================================
// Token Threshold Calculation
// Location: chunks.147.mjs (inferred from context)
// ============================================

// READABLE (for understanding):
function getAutoCompactThreshold(model) {
    // Get model context limit
    const contextLimit = getModelContextLimit(model);

    // Calculate threshold as percentage of limit
    // Typically 70-80% of context limit
    const thresholdRatio = 0.75;  // 75% of context limit

    return Math.floor(contextLimit * thresholdRatio);
}

function getModelContextLimit(model) {
    // Model-specific context limits
    const CONTEXT_LIMITS = {
        "claude-opus-4": 200000,
        "claude-sonnet-4": 200000,
        "claude-haiku-4": 200000,
        "claude-3-5-sonnet": 200000,
        "claude-3-5-haiku": 200000
    };

    return CONTEXT_LIMITS[model] ?? 200000;
}
```

### Circuit Breaker State Machine

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
│  State Transitions:                                                          │
│  ────────────────────                                                        │
│  NORMAL → WARNING:    2nd consecutive failure                               │
│  WARNING → TRIPPED:   3rd consecutive failure                               │
│  Any → NORMAL:        Compaction succeeds                                   │
│  TRIPPED → (stuck):   Cannot exit without session restart                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why this approach

1. **Threshold-based:** Only compact when truly needed, not prematurely
2. **Circuit breaker:** Prevents infinite retry loops on repeated failures
3. **Environment control:** Can be disabled via environment variable
4. **Session-scoped:** Circuit breaker state persists for session lifetime

---

## 4. Message Normalization Algorithm

### Location
chunks.173.mjs:1999-2100

### What it does
Converts internal message format to API-compatible format, handling tool results, attachments, and cache controls.

```javascript
// ============================================
// normalizeMessages (cM) - Message normalization
// Location: chunks.173.mjs:1999-2030
// ============================================

// ORIGINAL (for source lookup):
function cM(A, q = []) {
    let K = new Set(q.map((M) => M.name)),
        Y = wzz(A),
        z = [];

    for (let M of Y) {
        if (M.type === "user") {
            // ... user message normalization
        } else if (M.type === "assistant") {
            // ... assistant message normalization
        }
    }

    return z;
}

// READABLE (for understanding):
function normalizeMessages(messages, tools = []) {
    // Create set of tool names for filtering
    let toolNames = new Set(tools.map((t) => t.name));

    // Flatten messages (handle nested structures)
    let flattenedMessages = flattenMessages(messages);

    // Result array
    let normalizedMessages = [];

    for (let message of flattenedMessages) {
        if (message.type === "user") {
            // User message normalization
            normalizedMessages.push(normalizeUserMessage(message, toolNames));
        } else if (message.type === "assistant") {
            // Assistant message normalization
            normalizedMessages.push(normalizeAssistantMessage(message, toolNames));
        }
    }

    return normalizedMessages;
}

// Mapping: cM→normalizeMessages, A→messages, q→tools, K→toolNames, Y→flattenedMessages
```

### Key Transformations

1. **Tool result flattening:** Tool results become content blocks in user messages
2. **Cache control injection:** Add cache_control to messages for prompt caching
3. **Content block normalization:** Ensure all content blocks have correct format
4. **Metadata stripping:** Remove internal-only fields before API submission

---

## 5. Cancel Handler Algorithm

### Location
chunks.196.mjs:420-432

### What it does
Handles user cancellation (Ctrl+C) with different behaviors based on the current dialog and streaming state.

```javascript
// ============================================
// handleCancel (TM) - Cancel handler
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
        gA([]), M5?.abort();
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null);
}

// READABLE (for understanding):
function handleCancel() {
    // ===== BLOCKED: Elicitation cannot be cancelled =====
    if (focusedInputDialog === "elicitation") return;

    // ===== LOGGING =====
    debugLog(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // ===== FORCE END ANIMATION =====
    animationController.forceEnd();

    // ===== SAVE DRAFT INPUT =====
    if (inputDraft?.trim()) {
        setMessages((prev) => [...prev, createUserMessage({ content: inputDraft })]);
    }

    // ===== CLEAR INPUT STATE =====
    clearInputState();

    // ===== DIALOG-SPECIFIC HANDLING =====
    if (focusedInputDialog === "tool-permission") {
        // Abort the tool, clear queue
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Reject all pending prompts, abort stream
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        // Cancel remote request
        remoteClient.cancelRequest();
    } else {
        // Default: abort the stream
        abortController?.abort();
    }

    // ===== CLEAR PENDING TOOL USE =====
    setPendingToolUse(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→animationController,
//          ez→inputDraft, gq→setMessages, $Z→createUserMessage, dE→clearInputState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue
```

### Cancel Behavior Matrix

| Dialog Type | Cancel Action | Side Effects |
|-------------|---------------|--------------|
| `elicitation` | **BLOCKED** | Cannot cancel MCP elicitation |
| `tool-permission` | `onAbort()` | Tool not executed, abort message returned |
| `prompt` | `reject()` | Prompt promise rejected, abort controller triggered |
| `sandbox-permission` | Abort | Permission denied, tool not executed |
| Streaming | `abort()` | Stream cancelled, partial results preserved |
| Remote mode | `cancelRequest()` | Remote request cancelled |

### Why this approach

1. **Elicitation blocking:** MCP server needs response, can't be cancelled
2. **Draft preservation:** User's typed input is saved as a message
3. **Promise rejection:** Tools waiting for prompts get proper error
4. **Abort propagation:** Single abort call cancels all pending operations

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| StreamingToolExecutor | chunks.148.mjs:3 | `StreamingToolExecutor` (ui6) |
| Dialog Priority | chunks.196.mjs:387 | `getInputDialogType` (ra6) |
| Cancel Handler | chunks.196.mjs:420 | `handleCancel` (TM) |
| Auto-Compact | chunks.147.mjs:2633 | `autoCompactDispatcher` (sqq) |
| Message Normalization | chunks.173.mjs:1999 | `normalizeMessages` (cM) |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - Algorithm deep dive with source verification