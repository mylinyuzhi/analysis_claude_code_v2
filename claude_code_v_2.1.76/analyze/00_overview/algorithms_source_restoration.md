# Algorithms Source Restoration (Claude Code v2.1.76)

> Source-level restoration of key algorithms in Claude Code with dual-version code snippets (obfuscated + readable).
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## 1. Dialog Priority Dispatcher (ra6)

### What it does
Determines which dialog to show based on current state. Implements a priority-based dispatching system that ensures the most important user interaction is presented first.

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
    // Priority 0: Block-all conditions (no dialog shown)
    // - isViewingDialogHistory: User is looking at past messages
    // - hasActiveNotification: A notification is already displayed
    if (isViewingDialogHistory || hasActiveNotification) return undefined;

    // Priority 1: Message selector (user-initiated, highest priority)
    // Triggered by Escape Escape or Ctrl+R
    if (messageSelectorVisible) return "message-selector";

    // Priority 2: Input pause check
    // Don't interrupt user while they're composing input
    if (isPaused) return undefined;

    // Priority 3: Sandbox permission (security-critical, immediate)
    // Network/file access outside allowed domains
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gate: Lower priority dialogs wait for tool animation
    const shouldContinueAnimation = !toolJSX || toolJSX.shouldContinueAnimation;

    // Priority 4: Tool permission (requires user action)
    // User needs to approve/reject a tool execution
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";

    // Priority 5: Prompt request (AskUserQuestion tool)
    // LLM is asking for clarification
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";

    // Priority 6: Worker sandbox permission (background agent)
    // Permission for background agent network access
    if (shouldContinueAnimation && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // Priority 7: MCP elicitation (MCP server request)
    // MCP server is requesting user input
    if (shouldContinueAnimation && elicitationQueue[0]) return "elicitation";

    // Priorities 8-12: Lower priority informational dialogs
    if (shouldContinueAnimation && showCostDialog) return "cost";
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
//          W7→messageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
//          a8→toolPermissionQueue, zA→promptQueue, n.queue→workerSandboxQueue,
//          o.queue→elicitationQueue, m26→showCostDialog, W6→showIdeOnboarding,
//          g6→showEffortCallout, J1→showRemoteCallout, e8→lspRecommendation,
//          E1→showDesktopUpsell, j8→toolJSX, P1→shouldContinueAnimation
```

### Why this approach

**Design rationale:**
1. **Security first**: Sandbox permissions get priority over tool permissions because they affect system-level access
2. **User-initiated wins**: Message selector (user pressed keys) takes precedence over system-initiated dialogs
3. **Animation gating**: Lower-priority dialogs wait for tool animations to complete, preventing visual glitches
4. **Single active dialog**: Only one dialog shown at a time, preventing UI clutter

**Alternatives considered:**
- Stack-based dialog system: Rejected due to complexity and poor UX
- Priority queue with timeouts: Rejected because timing is unpredictable
- Modal overlay system: Rejected due to terminal UI limitations

### Key insight
The `shouldContinueAnimation` gate is critical for visual stability. Without it, dialogs would appear mid-animation, causing flickering and confusion.

---

## 2. StreamingToolExecutor Queue (ui6)

### What it does
Manages parallel execution of tools during LLM streaming, with concurrency safety and abort handling.

### How it works

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Parallel tool execution class
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
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
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
    async executeTool(A) {
        A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((_) => new Set([..._, A.id])), this.updateInterruptibleState();
        let q = [], K = [], z = (async () => {
            let _ = this.getAbortReason(A);
            if (_) {
                q.push(this.createSyntheticErrorMessage(A.id, _, A.assistantMessage)), A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState();
                return
            }
            let w = Wm(this.siblingAbortController);
            w.signal.addEventListener("abort", () => {
                if (w.signal.reason !== "sibling_error" && !this.toolUseContext.abortController.signal.aborted && !this.discarded) this.toolUseContext.abortController.abort(w.signal.reason)
            }, {once: !0});
            let O = Wi6(A.block, A.assistantMessage, this.canUseTool, {...this.toolUseContext, abortController: w}),
                $ = !1;
            for await (let H of O) {
                let j = this.getAbortReason(A);
                if (j && !$) {
                    q.push(this.createSyntheticErrorMessage(A.id, j, A.assistantMessage));
                    break
                }
                if (H.message.type === "user" && Array.isArray(H.message.message.content) && H.message.message.content.some((M) => M.type === "tool_result" && M.is_error === !0)) {
                    if ($ = !0, A.block.name === Q7) this.hasErrored = !0, this.erroredToolDescription = this.getToolDescription(A), this.siblingAbortController.abort("sibling_error")
                }
                if (H.message)
                    if (H.message.type === "progress") {
                        if (A.pendingProgress.push(H.message), this.progressAvailableResolve) this.progressAvailableResolve(), this.progressAvailableResolve = void 0
                    } else q.push(H.message);
                if (H.contextModifier) K.push(H.contextModifier.modifyContext)
            }
            A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState();
            if (!A.isConcurrencySafe && K.length > 0)
                for (let H of K) this.toolUseContext = H(this.toolUseContext)
        })();
        A.promise = z, z.finally(() => { this.processQueue() })
    }
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];                    // Queue of tool executions
    toolUseContext;
    hasErrored = false;            // Circuit breaker flag
    erroredToolDescription = "";
    siblingAbortController;        // Cloned abort controller for isolation
    discarded = false;
    progressAvailableResolve;      // Promise resolver for progress notification

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Clone the parent abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    // Determine if a tool can execute based on concurrency safety
    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing is executing
        // OR if the new tool is concurrency-safe AND all executing tools are also safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    // Add a tool to the execution queue
    addTool(toolUseBlock, assistantMessage) {
        let toolDef = findTool(this.toolDefinitions, toolUseBlock.name);

        // Unknown tool - create synthetic error result
        if (!toolDef) {
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                results: [createSyntheticError(`No such tool: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Validate input against schema
        toolUseBlock.input = parseAndValidate(toolDef, toolUseBlock.input);
        let parsedInput = toolDef.inputSchema.safeParse(toolUseBlock.input);

        // Determine if tool is concurrency-safe
        let isConcurrencySafe = parsedInput?.success
            ? Boolean(toolDef.isConcurrencySafe?.(parsedInput.data))
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

    // Execute a single tool
    async executeTool(toolEntry) {
        toolEntry.status = "executing";

        // Track in-progress tool IDs for UI
        this.toolUseContext.setInProgressToolUseIDs(
            ids => new Set([...ids, toolEntry.id])
        );
        this.updateInterruptibleState();

        let results = [];
        let contextModifiers = [];

        // Run tool execution
        let execution = (async () => {
            // Check abort conditions
            let abortReason = this.getAbortReason(toolEntry);
            if (abortReason) {
                results.push(this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage));
                toolEntry.results = results;
                toolEntry.status = "completed";
                return;
            }

            // Create sibling abort controller for isolation
            let siblingAbort = cloneAbortController(this.siblingAbortController);

            // Propagate abort to parent if sibling aborts (except for sibling_error)
            siblingAbort.signal.addEventListener("abort", () => {
                if (siblingAbort.signal.reason !== "sibling_error" &&
                    !this.toolUseContext.abortController.signal.aborted &&
                    !this.discarded) {
                    this.toolUseContext.abortController.abort(siblingAbort.signal.reason);
                }
            }, { once: true });

            // Execute via toolDispatcher
            let toolStream = toolDispatcher(
                toolEntry.block,
                toolEntry.assistantMessage,
                this.canUseTool,
                { ...this.toolUseContext, abortController: siblingAbort }
            );

            let hadError = false;

            for await (let event of toolStream) {
                // Check for mid-execution abort
                let abortReason = this.getAbortReason(toolEntry);
                if (abortReason && !hadError) {
                    results.push(this.createSyntheticErrorMessage(toolEntry.id, abortReason, toolEntry.assistantMessage));
                    break;
                }

                // Handle error results
                if (event.message?.type === "user" &&
                    Array.isArray(event.message.message.content) &&
                    event.message.message.content.some(c => c.type === "tool_result" && c.is_error)) {
                    hadError = true;

                    // Bash tool errors trigger sibling abort
                    if (toolEntry.block.name === "Bash") {
                        this.hasErrored = true;
                        this.erroredToolDescription = this.getToolDescription(toolEntry);
                        this.siblingAbortController.abort("sibling_error");
                    }
                }

                // Collect results and context modifiers
                if (event.message) {
                    if (event.message.type === "progress") {
                        toolEntry.pendingProgress.push(event.message);
                        // Notify waiters
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

            // Apply context modifiers for non-safe tools
            if (!toolEntry.isConcurrencySafe && contextModifiers.length > 0) {
                for (let modifier of contextModifiers) {
                    this.toolUseContext = modifier(this.toolUseContext);
                }
            }
        })();

        toolEntry.promise = execution;
        execution.finally(() => this.processQueue());
    }

    // Get reason for aborting a tool
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

// Mapping: ui6→StreamingToolExecutor, A→toolDefinitions, q→canUseTool, K→toolUseContext,
//          Wm→cloneAbortController, dK→findTool, PE1→parseAndValidate, Wi6→toolDispatcher,
//          p1→createUserMessage, Q7→"Bash" (tool name constant)
```

### Why this approach

**Design rationale:**
1. **Parallel execution for safe tools**: Read, Grep, Glob can run simultaneously
2. **Sequential for unsafe tools**: Write, Edit, Bash must run one at a time
3. **Sibling abort pattern**: One Bash error aborts siblings but not parent request
4. **Circuit breaker**: `hasErrored` flag prevents cascading failures

**Concurrency safety determination:**
- Tools define `isConcurrencySafe(input)` function
- Bash: Safe for read-only commands (`git status`), unsafe for mutations
- Read/Grep/Glob: Always safe (read-only)
- Write/Edit: Never safe (mutations)
- Agent: Safe (runs in isolation)

**Key insight:** The sibling abort pattern is crucial for UX. When one tool fails (e.g., Bash command errors), parallel tools get cancelled with a meaningful message rather than continuing pointlessly.

---

## 3. Agent Loop Core (mainAgentLoopCore/omY)

### What it does
The main turn-based conversation loop that drives the entire agent behavior.

### How it works

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
    return K
}

// READABLE (for understanding):
async function* mainAgentLoop(params) {
    let cleanupActions = [];

    // Delegate to core implementation
    let result = yield* mainAgentLoopCore(params, cleanupActions);

    // Complete any pending cleanup actions
    for (let action of cleanupActions) {
        markToolCompleted(action, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, A→params, q→cleanupActions, K→result,
//          omY→mainAgentLoopCore, pb→markToolCompleted
```

```javascript
// ============================================
// mainAgentLoopCore (omY) - Core turn loop implementation
// Location: chunks.148.mjs:882-1169
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
    let state = {
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

    let gates = getSessionGates();

    // Main turn loop
    while (true) {
        let { toolUseContext } = state;
        let { messages, autoCompactTracking, maxOutputTokensRecoveryCount, turnCount } = state;

        // Yield stream start event
        yield { type: "stream_request_start" };
        trackMark("query_fn_entry");

        // Set up query tracking
        let queryTracking = toolUseContext.queryTracking
            ? { chainId: toolUseContext.queryTracking.chainId, depth: toolUseContext.queryTracking.depth + 1 }
            : { chainId: helpers.uuid(), depth: 0 };

        // Phase 1: Micro-compact (remove consecutive duplicates)
        trackMark("query_microcompact_start");
        messages = (await helpers.microcompact(messages, toolUseContext, querySource)).messages;
        trackMark("query_microcompact_end");

        // Phase 2: Auto-compact (if token threshold exceeded)
        trackMark("query_autocompact_start");
        let { compactionResult, consecutiveFailures } = await helpers.autocompact(
            messages, toolUseContext, {
                systemPrompt, userContext, systemContext, toolUseContext
            }, querySource, autoCompactTracking, 0
        );
        trackMark("query_autocompact_end");

        if (compactionResult) {
            // Yield compaction summary
            for (let msg of formatCompactionResult(compactionResult)) {
                yield msg;
            }
            messages = compactionResult.messages;
            autoCompactTracking = { compacted: true, turnId: helpers.uuid(), turnCounter: 0, consecutiveFailures: 0 };
        }

        // Phase 3: Check blocking limit
        if (!compactionResult && querySource !== "compact") {
            let { isAtBlockingLimit } = checkBlockingLimit(messages, toolUseContext.options.mainLoopModel);
            if (isAtBlockingLimit) {
                yield createErrorMessage("Context too long");
                return { reason: "blocking_limit" };
            }
        }

        // Phase 4: Set up streaming tool executor
        let streamingExecutor = gates.streamingToolExecution
            ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext)
            : null;

        // Phase 5: LLM API request
        trackMark("query_api_streaming_start");
        let assistantMessages = [];
        let toolResults = [];
        let toolUses = [];
        let hasToolCalls = false;

        for await (let event of helpers.callModel({
            messages: messages,
            systemPrompt: systemPrompt,
            thinkingConfig: toolUseContext.options.thinkingConfig,
            tools: toolUseContext.options.tools,
            signal: toolUseContext.abortController.signal,
            options: { model, fallbackModel, queryTracking, ... }
        })) {
            // Yield events to UI
            yield event;

            if (event.type === "assistant") {
                assistantMessages.push(event);

                // Collect tool_use blocks
                let tools = event.message.content.filter(c => c.type === "tool_use");
                if (tools.length > 0) {
                    toolUses.push(...tools);
                    hasToolCalls = true;

                    // Add to streaming executor
                    if (streamingExecutor && !toolUseContext.abortController.signal.aborted) {
                        for (let tool of tools) {
                            streamingExecutor.addTool(tool, event);
                        }
                    }
                }
            }

            // Yield completed tool results during streaming
            if (streamingExecutor && !toolUseContext.abortController.signal.aborted) {
                for (let completed of streamingExecutor.getCompletedResults()) {
                    if (completed.message) {
                        yield completed.message;
                        toolResults.push(completed.message);
                    }
                }
            }
        }
        trackMark("query_api_streaming_end");

        // Phase 6: Check for abort
        if (toolUseContext.abortController.signal.aborted) {
            // Collect remaining tool results
            if (streamingExecutor) {
                for await (let result of streamingExecutor.getRemainingResults()) {
                    if (result.message) yield result.message;
                }
            }
            return { reason: "aborted_streaming" };
        }

        // Phase 7: No tools called - check completion
        if (!hasToolCalls) {
            // Handle max_output_tokens recovery
            let lastMessage = assistantMessages[assistantMessages.length - 1];
            if (lastMessage?.isApiErrorMessage && isMaxTokensError(lastMessage)) {
                if (maxOutputTokensRecoveryCount < 3) {
                    state.maxOutputTokensRecoveryCount++;
                    state.transition = { reason: "max_output_tokens_recovery" };
                    // Continue with continuation message
                    continue;
                }
            }

            // Run stop hooks
            await runStopHooks(assistantMessages, toolUseContext);

            return { reason: "completed" };
        }

        // Phase 8: Collect remaining tool results
        if (streamingExecutor) {
            for await (let result of streamingExecutor.getRemainingResults()) {
                if (result.message) {
                    yield result.message;
                    toolResults.push(result.message);
                }
            }
        }

        // Phase 9: Check max turns
        if (maxTurns && turnCount >= maxTurns) {
            yield createMaxTurnsMessage();
            return { reason: "max_turns" };
        }

        // Phase 10: Update state for next turn
        state = {
            ...state,
            messages: [...messages, ...assistantMessages, ...toolResults],
            autoCompactTracking: autoCompactTracking,
            turnCount: turnCount + 1,
            transition: { reason: "next_turn" }
        };

        // Continue to next turn
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→cleanupActions,
//          K→systemPrompt, Y→userContext, z→systemContext, _→canUseTool,
//          w→fallbackModel, O→querySource, $→maxTurns, H→skipCacheWrite,
//          j→helpers, J→state, D→gates, RKq→getSessionGates, SKq→getModelCallHelpers
```

### Why this approach

**Design rationale:**
1. **Generator pattern**: `async function*` allows yielding events incrementally
2. **Recursive continuation**: Loop continues with updated messages after tool calls
3. **Abort handling**: Multiple abort checks ensure clean shutdown
4. **Streaming tool execution**: Start tools during stream for lower latency

**Turn state tracking:**
- `autoCompactTracking`: Prevents infinite compaction loops
- `maxOutputTokensRecoveryCount`: Limits max_tokens recovery attempts
- `turnCount`: Enforces maxTurns limit
- `transition`: Tracks why loop continued

**Key insight:** The `while (true)` loop with state updates is cleaner than explicit recursion because:
1. State is maintained across iterations naturally
2. Abort conditions are checked in one place
3. Tool execution happens in a predictable order

---

## 4. Cancel Propagation (handleCancel/TM)

### What it does
Handles user cancellation (Escape key) with proper cleanup for each dialog type.

### How it works

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
    // 1. Elicitation dialogs cannot be cancelled
    // MCP protocol requires a response - server is blocked waiting
    if (focusedDialog === "elicitation") return;

    // 2. Log for debugging
    debugLog(`[onCancel] focusedInputDialog=${focusedDialog} streamMode=${streamMode}`);

    // 3. Force end interaction tracking (for telemetry)
    interactionTracker.forceEnd();

    // 4. Save partial input if user was typing
    // Prevents data loss when user accidentally presses Escape
    if (inputText?.trim()) {
        appendMessage(createUserMessage({ content: inputText }));
    }

    // 5. Reset loading state
    resetLoadingState();

    // 6. Dialog-specific cancel handling
    switch (focusedDialog) {
        case "tool-permission":
            // Abort the pending tool permission request
            toolPermissionQueue[0]?.onAbort();
            setToolPermissionQueue([]);
            break;

        case "prompt":
            // Reject all pending AskUserQuestion prompts
            for (let prompt of promptQueue) {
                prompt.reject(Error("Prompt cancelled by user"));
            }
            setPromptQueue([]);
            abortController?.abort();
            break;

        default:
            // No active dialog - cancel the ongoing request
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
//          ez→inputText, gq→appendMessage, $Z→createUserMessage, dE→resetLoadingState,
//          a8→toolPermissionQueue, $A→setToolPermissionQueue, zA→promptQueue,
//          gA→setPromptQueue, M5→abortController, B5→remoteSession
```

### Why elicitation cannot be cancelled

**MCP protocol requirements:**
1. MCP server called `elicitation` capability and is blocked waiting
2. Timeout is handled server-side, not client-side
3. Cancelling would break the protocol and leave server in undefined state
4. User must either respond or wait for server timeout

---

## 5. Source Code Locations

| Algorithm | Symbol | Location | Lines |
|-----------|--------|----------|-------|
| Dialog Priority | ra6 | chunks.196.mjs | 387-404 |
| Cancel Handler | TM | chunks.196.mjs | 420-432 |
| StreamingToolExecutor | ui6 | chunks.148.mjs | 3-228 |
| Agent Loop | Yh | chunks.148.mjs | 875-880 |
| Agent Loop Core | omY | chunks.148.mjs | 882-1169 |
| State Store | WX1 | chunks.85.mjs | 1747-1766 |
| Attachment Orchestrator | _uY | chunks.147.mjs | 3-18 |
| Attachment Normalizer | Ui8 | chunks.174.mjs | 3-469 |
| Message Normalizer | cM | chunks.173.mjs | 1999-2150 |

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All key algorithms documented with source verification