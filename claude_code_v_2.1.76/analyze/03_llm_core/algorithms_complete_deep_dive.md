# LLM Core Algorithms Deep Dive (Claude Code v2.1.76)

> Source-level algorithm analysis with pseudocode restoration.
>
> **Cross-validated**: All algorithms verified against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `mainAgentLoop` (Yh) - chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - chunks.148.mjs:3
- `streamingQueryCore` (mGq) - chunks.171.mjs:3

---

## 1. Turn State Machine

### 1.1 Turn State Object Structure

The turn state object (`J` in obfuscated code) tracks all mutable state for each conversation turn.

```javascript
// ============================================
// Turn State Object - Main agent loop state
// Location: chunks.148.mjs:892-903
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
    // Input state
    messages: params.messages,                    // Conversation history
    toolUseContext: params.toolUseContext,        // Permission/session context
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit

    // Compaction tracking
    autoCompactTracking: undefined,               // { consecutiveFailures, lastResult }

    // Hook control
    stopHookActive: undefined,                    // Stop hook flag

    // Recovery state
    maxOutputTokensRecoveryCount: 0,              // Max_tokens recovery attempts
    hasAttemptedReactiveCompact: false,           // Reactive compact flag

    // Turn tracking
    turnCount: 1,                                 // Current turn number
    pendingToolUseSummary: undefined,             // Tool result summary for next turn
    transition: undefined                         // Mode transition state
};

// Mapping: J→turnState, A→params
```

**Why this approach:**
- Single object for all mutable state enables clean transitions
- Recovery counters prevent infinite loops
- Tracking enables circuit breakers for compaction

### 1.2 Turn State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TURN STATE MACHINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                            │
│  │   START     │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PRE-TURN PHASE                                                       │    │
│  │                                                                       │    │
│  │ 1. Micro-compact: Remove consecutive duplicate messages             │    │
│  │    Condition: messages[i].content === messages[i+1].content         │    │
│  │                                                                       │    │
│  │ 2. Auto-compact: Trigger if token threshold exceeded                │    │
│  │    Condition: tokenCount >= threshold && consecutiveFailures < 3    │    │
│  │                                                                       │    │
│  │ 3. Context limit check: Validate context fits model window          │    │
│  │    Action: If exceeded, trigger reactive compact                    │    │
│  │                                                                       │    │
│  │ 4. Attachments: Assemble system reminders                           │    │
│  │    Action: assembleAllAttachments(sessionState)                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ REQUEST PHASE                                                        │    │
│  │                                                                       │    │
│  │ 1. Build tool schemas (with deferred loading)                       │    │
│  │ 2. Normalize messages for API format                                │    │
│  │ 3. Add cache controls to messages                                   │    │
│  │ 4. Construct API params (model, betas, thinking)                    │    │
│  │ 5. Execute streaming request                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ STREAMING PHASE                                                      │    │
│  │                                                                       │    │
│  │ Yield events:                                                        │    │
│  │ • stream_request_start                                               │    │
│  │ • stream_event (SSE)                                                 │    │
│  │ • assistant message (content_block_stop)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ TOOL EXECUTION PHASE                                                 │    │
│  │                                                                       │    │
│  │ 1. Create StreamingToolExecutor                                     │    │
│  │ 2. Add tool_use blocks as they stream in                            │    │
│  │ 3. Execute concurrency-safe tools in parallel                       │    │
│  │ 4. Yield tool results as they complete                              │    │
│  │ 5. Collect tool results into messages                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ TURN COMPLETION DECISION                                             │    │
│  │                                                                       │    │
│  │ if (toolsCalled && !stopReason?.startsWith("end_")) {               │    │
│  │     turnCount++;                                                     │    │
│  │     continue; // Next turn                                           │    │
│  │ } else {                                                             │    │
│  │     break; // End conversation                                       │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────┐                                                            │
│  │    END      │                                                            │
│  └─────────────┘                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. StreamingToolExecutor Algorithm

### 2.1 Class Structure

**Location**: chunks.148.mjs:3-200

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Complete class
// Location: chunks.148.mjs:3-200
// ============================================

// READABLE (for understanding):
class StreamingToolExecutor {
    // Instance properties
    toolDefinitions;      // Map of tool name → tool definition
    canUseTool;           // Permission check function
    tools = [];           // Execution queue: { id, block, status, results, ... }
    toolUseContext;       // Session/permission context
    hasErrored = false;   // Circuit breaker: set when any tool errors
    erroredToolDescription = "";  // Description of failed tool
    siblingAbortController;       // Isolated abort for siblings
    discarded = false;    // Discard flag for streaming fallback
    progressAvailableResolve;     // Progress notification resolver

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    /**
     * Discard the executor (streaming fallback)
     * All pending tools get synthetic error results
     */
    discard() {
        this.discarded = true;
    }

    /**
     * Add a tool_use block to the execution queue
     *
     * @param {Object} toolUseBlock - The tool_use content block from API
     * @param {Object} assistantMessage - The parent assistant message
     */
    addTool(toolUseBlock, assistantMessage) {
        // Step 1: Look up tool definition
        let toolDef = findToolDefinition(this.toolDefinitions, toolUseBlock.name);

        // Handle unknown tool
        if (!toolDef) {
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",  // Immediately completed with error
                isConcurrencySafe: true,
                pendingProgress: [],
                results: [createToolError(`No such tool available: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Step 2: Apply defaults to input
        toolUseBlock.input = applyInputDefaults(toolDef, toolUseBlock.input);

        // Step 3: Validate input schema
        let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);

        // Step 4: Determine concurrency safety
        let isConcurrencySafe = parseResult?.success
            ? this.evaluateConcurrencySafety(toolDef, parseResult.data)
            : false;

        // Step 5: Queue the tool
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });

        // Step 6: Process queue
        this.processQueue();
    }

    /**
     * Evaluate if tool input is concurrency-safe
     *
     * Why this matters:
     * - Safe tools can run in parallel (Read, Grep, Glob)
     * - Unsafe tools must be sequential (Write, Edit, Bash)
     */
    evaluateConcurrencySafety(toolDef, parsedInput) {
        try {
            return Boolean(toolDef.isConcurrencySafe?.(parsedInput));
        } catch {
            return false;  // Default to unsafe on error
        }
    }

    /**
     * Check if a tool can execute now
     *
     * @param {boolean} isConcurrencySafe - Whether the candidate tool is safe
     * @returns {boolean} - Can execute
     *
     * Decision tree:
     * - No executing tools → YES
     * - All executing are safe AND candidate is safe → YES (parallel)
     * - Otherwise → NO (must wait)
     */
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    /**
     * Process the tool queue
     *
     * Algorithm:
     * 1. Iterate through queued tools
     * 2. If can execute → execute
     * 3. If unsafe and can't execute → break (preserve order)
     */
    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;

            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                // Non-safe tool must wait - break to preserve order
                break;
            }
        }
    }

    /**
     * Determine abort reason for a tool
     *
     * @param {Object} toolEntry - The tool entry
     * @returns {string|null} - Abort reason or null
     *
     * Priority order:
     * 1. Executor discarded → "streaming_fallback"
     * 2. Sibling errored → "sibling_error"
     * 3. User abort → "user_interrupted" (if tool supports cancel)
     */
    getAbortReason(toolEntry) {
        // Highest priority: executor discarded
        if (this.discarded) return "streaming_fallback";

        // Circuit breaker: sibling error
        if (this.hasErrored) return "sibling_error";

        // User abort
        if (this.toolUseContext.abortController.signal.aborted) {
            // Check tool's interrupt behavior
            if (this.toolUseContext.abortController.signal.reason === "interrupt") {
                return this.getToolInterruptBehavior(toolEntry) === "cancel"
                    ? "user_interrupted"
                    : null;  // Tool can continue
            }
            return "user_interrupted";
        }

        return null;
    }

    /**
     * Get tool's interrupt behavior
     *
     * @param {Object} toolEntry - Tool entry
     * @returns {string} - "cancel" | "block"
     */
    getToolInterruptBehavior(toolEntry) {
        let toolDef = findToolDefinition(this.toolDefinitions, toolEntry.block.name);
        if (!toolDef?.interruptBehavior) return "block";  // Default: block
        try {
            return toolDef.interruptBehavior();
        } catch {
            return "block";
        }
    }

    /**
     * Create synthetic error message for aborted tool
     */
    createSyntheticErrorMessage(toolId, abortReason, assistantMessage) {
        if (abortReason === "user_interrupted") {
            return createToolResult({
                content: `<tool_use_error>User rejected tool use</tool_use_error>`,
                isError: true,
                toolUseId: toolId
            });
        }
        if (abortReason === "streaming_fallback") {
            return createToolResult({
                content: `<tool_use_error>Streaming fallback - tool execution discarded</tool_use_error>`,
                isError: true,
                toolUseId: toolId
            });
        }
        // Sibling error
        let description = this.erroredToolDescription;
        let message = description
            ? `Cancelled: parallel tool call ${description} errored`
            : "Cancelled: parallel tool call errored";
        return createToolResult({
            content: `<tool_use_error>${message}</tool_use_error>`,
            isError: true,
            toolUseId: toolId
        });
    }

    /**
     * Execute a tool
     *
     * @param {Object} toolEntry - Tool entry to execute
     */
    async executeTool(toolEntry) {
        // Mark as executing
        toolEntry.status = "executing";
        this.toolUseContext.setInProgressToolUseIDs(ids => new Set([...ids, toolEntry.id]));
        this.updateInterruptibleState();

        let results = [];
        let contextModifiers = [];

        // Execute in async IIFE
        let executionPromise = (async () => {
            // Check abort conditions
            let abortReason = this.getAbortReason(toolEntry);
            if (abortReason) {
                results.push(this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage));
                toolEntry.results = results;
                toolEntry.contextModifiers = contextModifiers;
                toolEntry.status = "completed";
                this.updateInterruptibleState();
                return;
            }

            // Create sibling abort controller for isolation
            let siblingAbort = cloneAbortController(this.siblingAbortController);

            // Propagate sibling abort to parent
            siblingAbort.signal.addEventListener("abort", () => {
                if (siblingAbort.signal.reason !== "sibling_error" &&
                    !this.toolUseContext.abortController.signal.aborted &&
                    !this.discarded) {
                    this.toolUseContext.abortController.abort(siblingAbort.signal.reason);
                }
            }, { once: true });

            // Execute tool via dispatcher
            let toolGenerator = toolDispatcher(
                toolEntry.block,
                toolEntry.assistantMessage,
                this.canUseTool,
                { ...this.toolUseContext, abortController: siblingAbort }
            );

            let hasError = false;

            for await (let event of toolGenerator) {
                // Check for mid-execution abort
                let midAbortReason = this.getAbortReason(toolEntry);
                if (midAbortReason && !hasError) {
                    results.push(this.createSyntheticErrorMessage(toolEntry.id, midAbortReason, toolEntry.assistantMessage));
                    break;
                }

                // Check for tool error
                if (event.message?.type === "user" &&
                    Array.isArray(event.message.message.content) &&
                    event.message.message.content.some(c => c.type === "tool_result" && c.is_error)) {
                    hasError = true;

                    // For Bash errors, trigger circuit breaker
                    if (toolEntry.block.name === "Bash") {
                        this.hasErrored = true;
                        this.erroredToolDescription = this.getToolDescription(toolEntry);
                        this.siblingAbortController.abort("sibling_error");
                    }
                }

                // Collect results and progress
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

            // Store results
            toolEntry.results = results;
            toolEntry.contextModifiers = contextModifiers;
            toolEntry.status = "completed";
            this.updateInterruptibleState();

            // Apply context modifiers for non-safe tools
            if (!toolEntry.isConcurrencySafe && contextModifiers.length > 0) {
                for (let modifier of contextModifiers) {
                    this.toolUseContext = modifier(this.toolUseContext);
                }
            }
        })();

        // Store promise for awaiters
        toolEntry.promise = executionPromise;

        // Continue processing queue after completion
        executionPromise.finally(() => {
            this.processQueue();
        });
    }

    /**
     * Generator: Yield completed results
     *
     * Yields progress messages first, then completed tool results.
     * Stops at first non-safe executing tool to preserve order.
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

            // Skip already yielded
            if (tool.status === "yielded") continue;

            // Yield completed results
            if (tool.status === "completed" && tool.results) {
                tool.status = "yielded";
                for (let result of tool.results) {
                    yield {
                        message: result,
                        newContext: this.toolUseContext
                    };
                }
                // Mark tool use as completed
                markToolUseCompleted(this.toolUseContext, tool.id);
            }
            // Stop at non-safe executing tool
            else if (tool.status === "executing" && !tool.isConcurrencySafe) {
                break;
            }
        }
    }

    hasPendingProgress() {
        return this.tools.some(t => t.pendingProgress.length > 0);
    }
}
```

### 2.2 Concurrency Decision Tree

```
                        Tool arrives (status="queued")
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Any tools currently executing? │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                   NO                              YES
                    │                               │
                    ▼                               ▼
            ┌─────────────┐               ┌─────────────────────────┐
            │ EXECUTE NOW │               │ New tool is safe?       │
            └─────────────┘               └───────────┬─────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                                   YES                              NO
                                    │                               │
                                    ▼                               ▼
                        ┌─────────────────────────┐     ┌─────────────────────────┐
                        │ All executing are safe? │     │ WAIT for executing to   │
                        └───────────┬─────────────┘     │ complete                │
                                    │                   └─────────────────────────┘
                    ┌───────────────┴───────────────┐
                    │                               │
                   YES                              NO
                    │                               │
                    ▼                               ▼
            ┌─────────────┐               ┌─────────────────────────┐
            │ PARALLEL    │               │ WAIT (sequential order) │
            │ EXECUTION   │               │                         │
            └─────────────┘               └─────────────────────────┘


EXECUTION RULES:
═══════════════════════════════════════════════════════════════════
| Scenario               | Safe Tool | Unsafe Tool | Result       |
|────────────────────────|───────────|-------------|--------------|
| Nothing executing      | Execute   | Execute     | Immediate    |
| Safe tool executing    | Parallel  | Wait        | Safe=parallel|
| Unsafe tool executing  | Wait      | Wait        | Sequential   |
═══════════════════════════════════════════════════════════════════
```

### 2.3 Sibling Abort Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SIBLING ABORT PATTERN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  toolUseContext.abortController (Parent)                                    │
│         │                                                                    │
│         └── siblingAbortController (Clone)                                  │
│                 │                                                            │
│                 ├── Tool A (executing)                                      │
│                 │       │                                                    │
│                 │       └── siblingAbort.signal                             │
│                 │                                                            │
│                 ├── Tool B (executing)                                      │
│                 │       │                                                    │
│                 │       └── siblingAbort.signal                             │
│                 │                                                            │
│                 └── Tool C (queued)                                         │
│                         │                                                    │
│                         └── siblingAbort.signal                             │
│                                                                              │
│  SCENARIO: Tool A errors                                                    │
│                                                                              │
│  1. Tool A sets hasErrored = true                                           │
│  2. Tool A sets erroredToolDescription                                      │
│  3. Tool A calls siblingAbortController.abort("sibling_error")             │
│  4. Tools B, C receive abort signal                                         │
│  5. Tools B, C create synthetic error message                               │
│  6. All sibling results collected                                           │
│                                                                              │
│  WHY THIS MATTERS:                                                          │
│  - Isolates sibling aborts from parent                                      │
│  - Parent can continue with new query                                       │
│  - Prevents partial tool execution                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Streaming Query Algorithm

### 3.1 streamingQueryCore (mGq) - SSE Processing

**Location**: chunks.171.mjs:3-300

```javascript
// ============================================
// streamingQueryCore (mGq) - SSE streaming implementation
// Location: chunks.171.mjs:3-100
// ============================================

// READABLE (for understanding):
async function* streamingQueryCore(
    messages,           // Conversation messages
    systemPromptParts,  // System prompt components
    thinkingConfig,     // Thinking mode configuration
    tools,              // Tool definitions
    extraContext,       // Additional context
    sessionConfig       // Session configuration
) {
    // =====================================================
    // PHASE 1: PRE-CHECKS
    // =====================================================

    // Off-switch check (only for non-first-party)
    if (!isFirstParty() && (await checkOffSwitch()).activated) {
        if (supportsOffSwitch(sessionConfig.model)) {
            trackEvent("tengu_off_switch_query", {});
            yield createOffSwitchError(sessionConfig.model);
            return;
        }
    }

    // =====================================================
    // PHASE 2: RESOLVE MODEL
    // =====================================================

    let resolvedModel = sessionConfig.model;

    // Handle Bedrock inference profiles
    if (getClientType() === "bedrock" && sessionConfig.model.includes("application-inference-profile")) {
        resolvedModel = await resolveInferenceProfile(sessionConfig.model) ?? sessionConfig.model;
    }

    // =====================================================
    // PHASE 3: BUILD BETAS
    // =====================================================

    let isAgenticQuery =
        sessionConfig.querySource.startsWith("repl_main_thread") ||
        sessionConfig.querySource.startsWith("agent:") ||
        sessionConfig.querySource === "sdk" ||
        sessionConfig.querySource === "hook_agent" ||
        sessionConfig.querySource === "verification_agent";

    let betas = getRequiredBetas(resolvedModel, { isAgenticQuery });

    // Add prompt-caching beta if enabled
    if (sessionConfig.enablePromptCaching && !betas.includes(PROMPT_CACHING_BETA)) {
        betas.push(PROMPT_CACHING_BETA);
    }

    // =====================================================
    // PHASE 4: BUILD TOOL SCHEMAS
    // =====================================================

    let useDeferredLoading = shouldUseDeferredTools(
        resolvedModel,
        tools,
        sessionConfig.getToolPermissionContext,
        sessionConfig.agents
    );

    // Filter tools based on deferred loading
    let referencedTools = extractReferencedTools(messages);
    let filteredTools = useDeferredLoading
        ? tools.filter(t => !isDeferredTool(t) || referencedTools.has(t.name))
        : tools.filter(t => !isDeferredTool(t));

    // Build tool schemas
    let toolSchemas = await Promise.all(
        filteredTools.map(tool => buildToolSchema(tool, {
            getToolPermissionContext: sessionConfig.getToolPermissionContext,
            tools: tools,
            agents: sessionConfig.agents,
            allowedAgentTypes: sessionConfig.allowedAgentTypes,
            model: resolvedModel,
            betas: betas,
            deferLoading: useDeferredLoading && (isDeferredTool(tool) || isSlowLoadingTool(tool))
        }))
    );

    // =====================================================
    // PHASE 5: NORMALIZE MESSAGES
    // =====================================================

    let normalizedMessages = normalizeMessages(messages, filteredTools);

    // Apply message transformations for non-deferred mode
    if (!useDeferredLoading) {
        normalizedMessages = normalizedMessages.map(msg => {
            switch (msg.type) {
                case "user":
                    return transformUserMessageForAPI(msg);
                case "assistant":
                    return transformAssistantMessageForAPI(msg);
                default:
                    return msg;
            }
        });
    }

    // Add cache controls
    normalizedMessages = addCacheControls(normalizedMessages);
    normalizedMessages = applyCacheStrategy(normalizedMessages, CACHE_STRATEGY);

    // Add deferred tools hint if applicable
    if (useDeferredLoading && !isCompactMode()) {
        let deferredToolsHint = buildDeferredToolsHint(tools);
        if (deferredToolsHint) {
            normalizedMessages = [
                createUserMessage({
                    content: `<available-deferred-tools>\n${deferredToolsHint}\n</available-deferred-tools>`,
                    isMeta: true
                }),
                ...normalizedMessages
            ];
        }
    }

    // =====================================================
    // PHASE 6: BUILD SYSTEM PROMPT
    // =====================================================

    let systemPrompt = buildSystemPrompt({
        basePrompt: systemPromptParts,
        isNonInteractive: sessionConfig.isNonInteractiveSession,
        hasAppendSystemPrompt: sessionConfig.hasAppendSystemPrompt,
        // Add effort prompt if needed
        ...shouldAddEffortPrompt ? [EFFORT_PROMPT] : []
    });

    // Apply cache controls to system prompt
    let cachedSystemPrompt = applySystemPromptCache(
        systemPrompt,
        sessionConfig.enablePromptCaching,
        {
            skipGlobalCacheForSystemPrompt: shouldSkipGlobalCache,
            querySource: sessionConfig.querySource
        }
    );

    // =====================================================
    // PHASE 7: BUILD API REQUEST
    // =====================================================

    let requestParams = buildApiParams({
        model: resolvedModel,
        messages: normalizedMessages,
        system: cachedSystemPrompt,
        tools: toolSchemas,
        betas: betas,
        thinkingConfig: thinkingConfig,
        maxTokens: sessionConfig.maxOutputTokensOverride ?? getMaxTokens(resolvedModel),
        temperature: sessionConfig.temperatureOverride,
        metadata: buildMetadata(),
        toolChoice: sessionConfig.toolChoice,
        outputFormat: sessionConfig.outputFormat,
        fastMode: sessionConfig.fastMode
    });

    // =====================================================
    // PHASE 8: EXECUTE STREAMING REQUEST
    // =====================================================

    let requestStart = Date.now();
    let lastEventTime = Date.now();
    let eventCount = 0;
    let partialMessage = null;
    let contentBlocks = [];
    let usage = {};
    let stopReason = null;

    // Create timeout handler
    function setupTimeout() {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (fetchController) {
                fetchController.body?.cancel().catch(() => {});
            }
        }, STREAM_TIMEOUT_MS);
    }

    // Yield stream start event
    yield { type: "stream_request_start" };

    // Execute request with retry
    let response = await fetchWithRetry("/v1/messages", {
        method: "POST",
        headers: buildHeaders(betas),
        body: JSON.stringify(requestParams),
        signal: abortController.signal
    });

    // =====================================================
    // PHASE 9: PROCESS SSE EVENTS
    // =====================================================

    for await (let sseEvent of parseSSEStream(response.body)) {
        eventCount++;
        lastEventTime = Date.now();

        // Track usage
        if (sseEvent.message?.usage) {
            usage = mergeUsage(usage, sseEvent.message.usage);
        }

        // Yield raw event for UI state updates
        yield { type: "stream_event", event: sseEvent };

        // Process by event type
        switch (sseEvent.type) {
            case "message_start":
                partialMessage = sseEvent.message;
                break;

            case "content_block_start":
                let block = sseEvent.content_block;
                switch (block.type) {
                    case "tool_use":
                        contentBlocks[sseEvent.index] = {
                            ...block,
                            input: ""  // Accumulated via deltas
                        };
                        break;
                    case "text":
                        contentBlocks[sseEvent.index] = {
                            ...block,
                            text: ""  // Accumulated via deltas
                        };
                        break;
                    case "thinking":
                        contentBlocks[sseEvent.index] = {
                            ...block,
                            thinking: "",
                            signature: ""
                        };
                        break;
                }
                break;

            case "content_block_delta":
                let targetBlock = contentBlocks[sseEvent.index];
                switch (sseEvent.delta.type) {
                    case "text_delta":
                        targetBlock.text += sseEvent.delta.text;
                        break;
                    case "input_json_delta":
                        targetBlock.input += sseEvent.delta.partial_json;
                        break;
                    case "thinking_delta":
                        targetBlock.thinking += sseEvent.delta.thinking;
                        break;
                    case "signature_delta":
                        targetBlock.signature = sseEvent.delta.signature;
                        break;
                }
                break;

            case "content_block_stop":
                let completedBlock = contentBlocks[sseEvent.index];
                // Yield complete message for this block
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

                // Handle max_tokens error
                if (stopReason === "max_tokens") {
                    yield createMaxTokensError();
                }
                break;

            case "message_stop":
                // Final message complete
                break;

            case "ping":
                // Keepalive, no action needed
                break;

            case "error":
                yield createStreamError(sseEvent.error);
                break;
        }
    }

    // =====================================================
    // PHASE 10: RETURN FINAL MESSAGE
    // =====================================================

    return {
        message: {
            ...partialMessage,
            content: contentBlocks,
            stop_reason: stopReason
        },
        usage: usage
    };
}
```

### 3.2 SSE Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SSE EVENT SEQUENCE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. message_start                                                           │
│     └── Initialize message state, capture initial usage                     │
│                                                                              │
│  2. content_block_start (may repeat for each block)                        │
│     ├── type: "text" → Initialize text accumulator                         │
│     ├── type: "tool_use" → Initialize input accumulator                    │
│     └── type: "thinking" → Initialize thinking accumulator                 │
│                                                                              │
│  3. content_block_delta (may repeat many times)                            │
│     ├── text_delta → Append to text                                        │
│     ├── input_json_delta → Append to input JSON                            │
│     ├── thinking_delta → Append to thinking                                │
│     └── signature_delta → Set signature                                    │
│                                                                              │
│  4. content_block_stop                                                      │
│     └── Yield complete message for this block                              │
│                                                                              │
│  5. message_delta                                                           │
│     ├── Capture stop_reason                                                │
│     ├── Merge usage                                                        │
│     └── If max_tokens → yield error                                        │
│                                                                              │
│  6. message_stop                                                            │
│     └── Message complete                                                   │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  YIELD PATTERN:                                                             │
│                                                                              │
│  for each event:                                                            │
│      yield { type: "stream_event", event }  // Always, for UI state        │
│                                                                              │
│  on content_block_stop:                                                     │
│      yield { type: "assistant", message: { content: [block] } }            │
│                                                                              │
│  WHY:                                                                        │
│  - UI receives all events for real-time state updates                      │
│  - Complete messages yielded only on content_block_stop for efficiency     │
│  - Enables streaming display while maintaining message boundaries           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Auto-Compact Trigger Algorithm

### 4.1 shouldTriggerAutoCompaction

```javascript
// ============================================
// shouldTriggerAutoCompaction - Trigger condition check
// Location: chunks.147.mjs:2620-2650
// ============================================

// READABLE (for understanding):
function shouldTriggerAutoCompaction(messages, model, autoCompactTracking) {
    // Step 1: Check if auto-compact is disabled
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) {
        return false;
    }

    // Step 2: Check if auto-compact is enabled for this session
    if (!isAutoCompactEnabled()) {
        return false;
    }

    // Step 3: Check circuit breaker
    let consecutiveFailures = autoCompactTracking?.consecutiveFailures ?? 0;
    if (consecutiveFailures >= 3) {
        debugLog("Auto-compact circuit breaker active", { consecutiveFailures });
        return false;
    }

    // Step 4: Calculate current token count
    let tokenCount = estimateTokenCount(messages, model);

    // Step 5: Get threshold for this model
    let threshold = getAutoCompactThreshold(model);

    // Step 6: Check if threshold exceeded
    if (tokenCount >= threshold) {
        debugLog("Auto-compact triggered", {
            tokenCount,
            threshold,
            messageCount: messages.length
        });
        return true;
    }

    return false;
}

// Mapping: process.env.DISABLE_AUTO_COMPACT → env var, autoCompactTracking → tracking state
```

**Why this approach:**
- Circuit breaker prevents infinite retry loops
- Threshold varies by model (larger context = higher threshold)
- Environment variable for emergency disable

---

## 5. Message Normalization Algorithm

### 5.1 normalizeMessages (cM)

```javascript
// ============================================
// normalizeMessages (cM) - Message format conversion
// Location: chunks.173.mjs:1999-2100
// ============================================

// READABLE (for understanding):
function normalizeMessages(messages, tools) {
    let normalized = [];

    for (let message of messages) {
        switch (message.type) {
            case "user":
                normalized.push(normalizeUserMessage(message));
                break;
            case "assistant":
                normalized.push(normalizeAssistantMessage(message, tools));
                break;
            case "attachment":
                // Convert attachment to user message with isMeta flag
                normalized.push(normalizeAttachmentMessage(message));
                break;
            default:
                normalized.push(message);
        }
    }

    // Merge consecutive user messages
    normalized = mergeConsecutiveUserMessages(normalized);

    // Remove empty messages
    normalized = normalized.filter(msg => !isEmptyMessage(msg));

    return normalized;
}

function normalizeUserMessage(message) {
    // Handle string content
    if (typeof message.message.content === "string") {
        return {
            role: "user",
            content: message.message.content
        };
    }

    // Handle array content (may include images)
    return {
        role: "user",
        content: normalizeContentArray(message.message.content)
    };
}

function normalizeAssistantMessage(message, tools) {
    let content = [];

    // Process each content block
    for (let block of message.message.content) {
        switch (block.type) {
            case "text":
                content.push({ type: "text", text: block.text });
                break;
            case "tool_use":
                // Parse JSON input if needed
                let input = typeof block.input === "string"
                    ? safeJsonParse(block.input) ?? {}
                    : block.input;
                content.push({
                    type: "tool_use",
                    id: block.id,
                    name: block.name,
                    input: input
                });
                break;
            case "thinking":
                content.push({
                    type: "thinking",
                    thinking: block.thinking,
                    signature: block.signature
                });
                break;
        }
    }

    return {
        role: "assistant",
        content: content
    };
}

// Mapping: cM→normalizeMessages
```

---

## 6. Performance Considerations

### 6.1 Deferred Tool Loading

**What it does:** Only include tools that are actually used in the conversation, rather than all available tools.

**How it works:**
1. Mark certain tools as "deferred" (e.g., WebFetch, WebSearch)
2. Scan messages for tool references
3. Only include deferred tools if they appear in the conversation

**Why it matters:**
- Reduces prompt size by ~10-20%
- Faster API response times
- Lower token costs

### 6.2 Prompt Caching

**Strategy:**
1. System prompt: Cache with ephemeral TTL
2. Repeated user messages: Cache with TTL
3. Tool definitions: Cache when possible

**Cache Control Placement:**
```javascript
// System prompt
{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }

// Last user message (most likely to be repeated)
messages[messages.length - 1].content.push({
    cache_control: { type: "ephemeral" }
});
```

---

## 7. Error Recovery Patterns

### 7.1 Max Tokens Recovery

```
When max_tokens error occurs:
1. Check maxOutputTokensRecoveryCount
2. If < max retries:
   a. Increase max_tokens (if possible)
   b. Increment recovery counter
   c. Retry request
3. If >= max retries:
   a. Return error to user
```

### 7.2 Context Overflow Recovery

```
When context_length_exceeded error occurs:
1. Trigger reactive compact
2. If compact succeeds:
   a. Retry with compacted context
3. If compact fails:
   a. Remove oldest messages
   b. Retry with reduced context
4. If all recovery fails:
   a. Return error to user
```

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - Full algorithm analysis with source verification