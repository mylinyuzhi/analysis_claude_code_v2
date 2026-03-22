# LLM Request Pipeline (Claude Code 2.1.76)

> Complete documentation of the LLM request pipeline: from `mainAgentLoop` through `callModel` to `streamingQueryCore` to the Anthropic API.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `streamingQueryCore` (mGq) - Main streaming implementation (VERIFIED: chunks.171.mjs:3)
- `callModel` (NT6) - Wrapper that delegates to streamingQueryCore (VERIFIED: chunks.170.mjs:2009)
- `buildApiParams` (MI) - Constructs API request parameters
- `buildToolSchema` (Sh1) - Builds tool definitions for API
- `normalizeMessages` (cM) - Normalizes messages for API
- `buildSystemPromptBlocks` (_9z) - Converts system prompt to API format
- `withApiRetry` (_P1) - Retry wrapper with error recovery

---

## Pipeline Overview

The LLM request pipeline transforms internal state into an Anthropic API request and processes the streaming response:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM REQUEST PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 1: CONTEXT PREPARATION                                          │   │
│  │                                                                         │   │
│  │  mainAgentLoopCore (omY)                                               │   │
│  │      │                                                                  │   │
│  │      ├── Compact check (pg, sqq)                                       │   │
│  │      ├── Content replacement (T34)                                     │   │
│  │      └── Prepare toolUseContext                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                               │                                               │
│                               ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 2: API PARAMETER BUILDING                                       │   │
│  │                                                                         │   │
│  │  callModel (NT6)                                                       │   │
│  │      │                                                                  │   │
│  │      └── streamingQueryCore (mGq)                                      │   │
│  │              │                                                          │   │
│  │              ├── 1. Tool schema building (Sh1)                         │   │
│  │              │      └── Dynamic tool loading decision (yi6)            │   │
│  │              │                                                          │   │
│  │              ├── 2. Message normalization (cM)                         │   │
│  │              │      └── Cache controls added (gGq)                    │   │
│  │              │                                                          │   │
│  │              ├── 3. System prompt building (_9z)                      │   │
│  │              │      └── Cache scope assignment                        │   │
│  │              │                                                          │   │
│  │              └── 4. Request object construction ($6)                  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                               │                                               │
│                               ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 3: API EXECUTION                                                │   │
│  │                                                                         │   │
│  │  withApiRetry (_P1)                                                    │   │
│  │      │                                                                  │   │
│  │      └── Anthropic API (beta.messages.create with stream: true)       │   │
│  │              │                                                          │   │
│  │              └── SSE event stream                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                               │                                               │
│                               ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 4: EVENT PROCESSING                                             │   │
│  │                                                                         │   │
│  │  for await (event of stream):                                          │   │
│  │      ├── message_start → Initialize message, capture usage            │   │
│  │      ├── content_block_start → Create block placeholder               │   │
│  │      ├── content_block_delta → Accumulate text/json/thinking          │   │
│  │      ├── content_block_stop → Yield complete block                    │   │
│  │      ├── message_delta → Final usage, stop_reason                     │   │
│  │      └── message_stop → End of stream                                  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                               │                                               │
│                               ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 5: RESULT YIELDING                                              │   │
│  │                                                                         │   │
│  │  Yield events to agent loop:                                           │   │
│  │      ├── stream_event (raw SSE) → UI updates                           │   │
│  │      └── assistant (complete message) → Message history               │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Context Preparation

### Compact Check

Before each LLM request, the agent loop performs compaction checks:

```javascript
// In mainAgentLoopCore (omY) - chunks.148.mjs:932-950

// 1. Trim messages after compact boundary
I = [...fN(P)];  // fN = trimMessagesAfterCompactBoundary

// 2. Apply content replacements (large tool results → persisted references)
I = await T34(I, X.contentReplacementState, O, (D6) => void pz6(D6).catch(_6));

// 3. Micro-compact (remove consecutive duplicates)
K5("query_microcompact_start");
I = (await j.microcompact(I, X, O)).messages;  // pg
K5("query_microcompact_end");

// 4. Auto-compact (summarize if over threshold)
K5("query_autocompact_start");
let { compactionResult: U, consecutiveFailures: r } = await j.autocompact(I, X, {...}, O, g, B);
K5("query_autocompact_end");

if (U) {
    // Yield compaction summary messages
    for (let msg of formatCompactionResult(U)) yield msg;
    I = U.summaryMessages;
}
```

**Why this order:**
1. **Boundary trimming first** - Ensures we don't process already-summarized messages
2. **Content replacement second** - Reduces token count before expensive compaction
3. **Micro-compact third** - Quick cleanup of obvious duplicates
4. **Auto-compact last** - Expensive LLM summarization only if needed

---

## Phase 2: API Parameter Building

### Tool Schema Building

The `buildToolSchema` (Sh1) function converts internal tool definitions to API format:

```javascript
// ============================================
// buildToolSchema - Converts tool to API format
// Location: chunks.171.mjs:40-68
// ============================================

// ORIGINAL (for source lookup):
let v = await Promise.all(J.map((T6) => Sh1(T6, {
    getToolPermissionContext: _.getToolPermissionContext,
    tools: Y,
    agents: _.agents,
    allowedAgentTypes: _.allowedAgentTypes,
    model: _.model,
    betas: H,
    deferLoading: j && (GX(T6) || e3z(T6))
})));

// READABLE (for understanding):
let toolSchemas = await Promise.all(filteredTools.map((tool) => buildToolSchema(tool, {
    getToolPermissionContext: options.getToolPermissionContext,
    tools: allTools,
    agents: options.agents,
    allowedAgentTypes: options.allowedAgentTypes,
    model: options.model,
    betas: betaHeaders,
    deferLoading: useDynamicLoading && (isDeferredTool(tool) || isEphemeralTool(tool))
})));

// Mapping: v→toolSchemas, J→filteredTools, T6→tool, Sh1→buildToolSchema,
//          _→options, Y→allTools, H→betaHeaders, j→useDynamicLoading
```

### Dynamic Tool Loading

The `shouldUseDynamicLoading` (yi6) function determines if deferred tool loading should be used:

```javascript
// ============================================
// shouldUseDynamicLoading - Decide on dynamic loading
// Location: chunks.171.mjs:17
// ============================================

// ORIGINAL (for source lookup):
let j = await yi6(_.model, Y, _.getToolPermissionContext, _.agents, "query");

// READABLE (for understanding):
let useDynamicLoading = await shouldUseDynamicLoading(
    options.model,
    allTools,
    options.getToolPermissionContext,
    options.agents,
    "query"  // queryType
);

// Mapping: j→useDynamicLoading, yi6→shouldUseDynamicLoading,
//          _→options, Y→allTools
```

**Decision Logic (verified from source):**

```javascript
// ============================================
// Dynamic tool loading decision logic
// Location: chunks.171.mjs:18-27
// ============================================

// ORIGINAL (for source lookup):
if (j && !Y.some(GX) && !_.hasPendingMcpServers) k("Tool search disabled: no deferred tools available to search"), j = !1;
let J;
if (j) {
    let T6 = zF(A);
    J = Y.filter((D6) => {
        if (!GX(D6)) return !0;
        if (z3(D6, HZ)) return !0;
        return T6.has(D6.name)
    })
} else J = Y.filter((T6) => !z3(T6, HZ));

// READABLE (for understanding):
// If dynamic loading enabled but no deferred tools exist, disable it
if (useDynamicLoading && !allTools.some(isDeferredTool) && !options.hasPendingMcpServers) {
    log("Tool search disabled: no deferred tools available to search");
    useDynamicLoading = false;
}

let filteredTools;
if (useDynamicLoading) {
    // Extract tool names referenced in messages
    let referencedToolNames = extractReferencedTools(messages);

    // Include: non-deferred tools, server tools, and referenced deferred tools
    filteredTools = allTools.filter((tool) => {
        if (!isDeferredTool(tool)) return true;
        if (isServerTool(tool, SERVER_TOOL_MARKER)) return true;
        return referencedToolNames.has(tool.name);
    });
} else {
    // Exclude server tools (they need dynamic loading)
    filteredTools = allTools.filter((tool) => !isServerTool(tool, SERVER_TOOL_MARKER));
}

// Mapping: j→useDynamicLoading, Y→allTools, GX→isDeferredTool,
//          _→options, zF→extractReferencedTools, A→messages, z3→isServerTool,
//          HZ→SERVER_TOOL_MARKER, J→filteredTools, T6→referencedToolNames
```

**Why dynamic loading:**
- Reduces token count in initial request
- Model can request additional tools via special markers
- Critical for large MCP tool sets (100+ tools)

### Message Normalization for API

```javascript
// ============================================
// Message normalization flow
// Location: chunks.171.mjs:54-81
// ============================================

// ORIGINAL (for source lookup):
K5("query_message_normalization_start");
let N = cM(A, J);
if (K5("query_message_normalization_end"), !j) N = N.map((T6) => {
    switch (T6.type) {
        case "user":
            return Xn8(T6);
        case "assistant":
            return BGq(T6);
        default:
            return T6
    }
});
N = gGq(N), N = q9z(N, PA4), d("tengu_api_after_normalize", {
    postNormalizedMessageCount: N.length
});

// READABLE (for understanding):
mark("query_message_normalization_start");
let normalized = normalizeMessages(messages, filteredTools);
mark("query_message_normalization_end");

// If NOT using dynamic loading, normalize user/assistant messages
if (!useDynamicLoading) {
    normalized = normalized.map((msg) => {
        switch (msg.type) {
            case "user": return normalizeUserMessage(msg);      // Xn8
            case "assistant": return normalizeAssistantMessage(msg);  // BGq
            default: return msg;
        }
    });
}

// Add cache controls to messages
normalized = addCacheControlsToMessages(normalized);  // gGq

// Trim excess images (max PA4 = ~20 images)
normalized = trimImageCount(normalized, MAX_IMAGES_IN_CONTEXT);

logEvent("tengu_api_after_normalize", {
    postNormalizedMessageCount: normalized.length
});

// Mapping: K5→mark, N→normalized, cM→normalizeMessages, A→messages, J→filteredTools,
//          j→useDynamicLoading, Xn8→normalizeUserMessage, BGq→normalizeAssistantMessage,
//          gGq→addCacheControlsToMessages, q9z→trimImageCount, PA4→MAX_IMAGES_IN_CONTEXT,
//          d→logEvent
```

### Deferred Tools Hint Injection

When dynamic loading is enabled, a hint message is prepended to inform the model about available deferred tools:

```javascript
// ============================================
// Deferred tools hint injection
// Location: chunks.171.mjs:72-81
// ============================================

// ORIGINAL (for source lookup):
if (j && !ki6()) {
    let T6 = Y.filter(GX).map(fp6).sort().join(`
`);
    if (T6) N = [p1({
        content: `<available-deferred-tools>
${T6}
</available-deferred-tools>`,
        isMeta: !0
    }), ...N]
}

// READABLE (for understanding):
// Inject deferred tools hint if dynamic loading enabled and not in special mode
if (useDynamicLoading && !isSpecialQueryMode()) {
    // Build list of deferred tool names
    let deferredToolsHint = allTools
        .filter(isDeferredTool)  // GX
        .map(formatDeferredToolHint)  // fp6 - formats tool name/description
        .sort()
        .join("\n");

    if (deferredToolsHint) {
        // Prepend as meta message (not visible to user, but seen by model)
        normalized = [
            createMetaMessage({
                content: `<available-deferred-tools>
${deferredToolsHint}
</available-deferred-tools>`,
                isMeta: true
            }),  // p1
            ...normalized
        ];
    }
}

// Mapping: j→useDynamicLoading, ki6→isSpecialQueryMode, Y→allTools,
//          GX→isDeferredTool, fp6→formatDeferredToolHint, T6→deferredToolsHint,
//          N→normalized, p1→createMetaMessage
```

**Why this matters:**
- The model sees available tools without loading full schemas
- Reduces prompt tokens by 50-80% for large MCP tool sets
- Model can request specific tools via `tool_search` marker

### System Prompt Building

```javascript
// ============================================
// System prompt building
// Location: chunks.171.mjs:84-92
// ============================================

// ORIGINAL (for source lookup):
q = uq([m21(V), u21({
    isNonInteractive: _.isNonInteractiveSession,
    hasAppendSystemPrompt: _.hasAppendSystemPrompt
}), ...q, ...h ? [kE1] : []].filter(Boolean)), RGq(q);
let R = _.enablePromptCaching ?? IGq(_.model),
    u = _9z(q, R, {
        skipGlobalCacheForSystemPrompt: G,
        querySource: _.querySource
    });

// READABLE (for understanding):
// Build system prompt sections
let systemPromptSections = combineSystemPromptSections([
    formatSystemPromptHeader(tokenCount),  // m21(V) - adds cache scope markers
    formatEnvironmentSection({
        isNonInteractive: options.isNonInteractiveSession,
        hasAppendSystemPrompt: options.hasAppendSystemPrompt
    }),
    ...userProvidedSections,  // q
    ...(includeDeferredToolsHint ? [DEFERRED_TOOLS_INSTRUCTION] : [])  // kE1
].filter(Boolean));

validateSystemPrompt(systemPromptSections);

// Convert to API blocks with cache control
let enableCaching = options.enablePromptCaching ?? supportsPromptCaching(options.model);
let systemBlocks = buildSystemPromptBlocks(  // _9z
    systemPromptSections,
    enableCaching,
    {
        skipGlobalCacheForSystemPrompt: hasMcpOrDeferredTools,
        querySource: options.querySource
    }
);

// Mapping: q→systemPromptSections, uq→combineSystemPromptSections,
//          m21→formatSystemPromptHeader, u21→formatEnvironmentSection,
//          V→tokenCount, _→options, h→includeDeferredToolsHint, kE1→DEFERRED_TOOLS_INSTRUCTION,
//          RGq→validateSystemPrompt, R→enableCaching, IGq→supportsPromptCaching,
//          u→systemBlocks, _9z→buildSystemPromptBlocks, G→hasMcpOrDeferredTools
```

### Request Object Construction

The `$6` function builds the complete API request object:

```javascript
// ============================================
// buildRequestParams - Request object factory
// Location: chunks.171.mjs:118-183
// ============================================

// ORIGINAL (for source lookup):
let $6 = (T6) => {
    let D6 = [...H];
    if (!D6.includes(Gr) && Pn8(T6.model)) D6.push(Gr);
    // ... (beta headers setup)
    let u6 = T6?.maxTokensOverride || _.maxOutputTokensOverride || Li6(_.model),
        C6 = K.type !== "disabled" && !t6(process.env.CLAUDE_CODE_DISABLE_THINKING),
        o6 = void 0;
    if (C6 && QG7(_.model))
        if (!t6(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) && I21(_.model)) o6 = {
            type: "adaptive"
        };
        else {
            let j6 = FGq(_.model);
            if (K.type === "enabled" && K.budgetTokens !== void 0) j6 = K.budgetTokens;
            j6 = Math.min(u6 - 1, j6), o6 = {
                budget_tokens: j6,
                type: "enabled"
            }
        }
    return {
        model: lg(_.model),
        messages: z9z(N, b6, _.querySource, c6, X6, z6, _.skipCacheWrite),
        system: u,
        tools: [...v, ..._.extraToolSchemas ?? []],
        tool_choice: _.toolChoice,
        ...I ? {
            betas: D6
        } : {},
        metadata: Vt(),
        max_tokens: u6,
        thinking: o6,
        ...K1 !== void 0 && {
            temperature: K1
        },
        // ... additional fields
    }
};

// READABLE (for understanding):
let buildRequestParams = (context) => {
    // 1. Collect beta headers
    let betas = [...configuredBetas];
    if (!betas.includes("pdfs-2025-05-20") && supportsPdf(context.model)) {
        betas.push("pdfs-2025-05-20");  // Gr
    }

    // 2. Determine output token limit
    let maxTokens = context?.maxTokensOverride
        || options.maxOutputTokensOverride
        || getDefaultMaxTokens(options.model);  // Li6

    // 3. Configure thinking mode
    let thinkingEnabled = thinkingConfig.type !== "disabled"
        && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_THINKING);
    let thinkingConfig = undefined;

    if (thinkingEnabled && supportsThinking(options.model)) {  // QG7
        if (!parseBoolean(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING)
            && supportsAdaptiveThinking(options.model)) {  // I21
            thinkingConfig = { type: "adaptive" };
        } else {
            let budget = getDefaultThinkingBudget(options.model);  // FGq
            if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== undefined) {
                budget = thinkingConfig.budgetTokens;
            }
            // Ensure budget < max_tokens
            budget = Math.min(maxTokens - 1, budget);
            thinkingConfig = {
                budget_tokens: budget,
                type: "enabled"
            };
        }
    }

    // 4. Build request object
    return {
        model: resolveModelName(options.model),  // lg
        messages: addCacheControls(normalized, enableCaching, options.querySource, ...),
        system: systemBlocks,
        tools: [...toolSchemas, ...options.extraToolSchemas ?? []],
        tool_choice: options.toolChoice,
        ...(hasBetas ? { betas: betas } : {}),
        metadata: buildMetadata(),  // Vt
        max_tokens: maxTokens,
        thinking: thinkingConfig,
        ...(temperature !== undefined ? { temperature } : {}),
        ...(outputConfig ? { output_config: outputConfig } : {}),
        ...(fastMode ? { speed: "fast" } : {})
    };
};

// Mapping: $6→buildRequestParams, T6→context, D6→betas, H→configuredBetas,
//          Gr→"pdfs-2025-05-20", Pn8→supportsPdf, u6→maxTokens,
//          Li6→getDefaultMaxTokens, C6→thinkingEnabled, o6→thinkingConfig,
//          QG7→supportsThinking, I21→supportsAdaptiveThinking, FGq→getDefaultThinkingBudget,
//          lg→resolveModelName, z9z→addCacheControls, Vt→buildMetadata
```

#### Thinking Mode Decision Tree (Verified)

```javascript
// ============================================
// Thinking mode configuration logic
// Location: chunks.171.mjs:130-143
// ============================================

// ORIGINAL (for source lookup):
let C6 = K.type !== "disabled" && !t6(process.env.CLAUDE_CODE_DISABLE_THINKING),
    o6 = void 0;
if (C6 && QG7(_.model))
    if (!t6(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) && I21(_.model)) o6 = {
        type: "adaptive"
    };
    else {
        let j6 = FGq(_.model);
        if (K.type === "enabled" && K.budgetTokens !== void 0) j6 = K.budgetTokens;
        j6 = Math.min(u6 - 1, j6), o6 = {
            budget_tokens: j6,
            type: "enabled"
        }
    }

// READABLE (for understanding):
/*
Decision tree:

isThinkingEnabled()?
  ├── NO → thinking: undefined
  └── YES → supportsThinking(model)?
              ├── NO → thinking: undefined
              └── YES → DISABLE_ADAPTIVE_THINKING env?
                        ├── NO → supportsAdaptive(model)?
                        │         ├── YES → { type: "adaptive" }
                        │         └── NO → { type: "enabled", budget_tokens: N }
                        └── YES → { type: "enabled", budget_tokens: N }

Where N = min(maxTokens - 1, configuredBudget || defaultBudget)
*/

let thinkingEnabled = thinkingConfig.type !== "disabled"
    && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_THINKING);
let apiThinkingConfig = undefined;

if (thinkingEnabled && supportsThinking(options.model)) {
    if (!parseBoolean(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING)
        && supportsAdaptiveThinking(options.model)) {
        apiThinkingConfig = { type: "adaptive" };
    } else {
        let budget = getDefaultThinkingBudget(options.model);
        if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== undefined) {
            budget = thinkingConfig.budgetTokens;
        }
        budget = Math.min(maxTokens - 1, budget);  // Must leave room for output
        apiThinkingConfig = { budget_tokens: budget, type: "enabled" };
    }
}

// Mapping: C6→thinkingEnabled, o6→apiThinkingConfig, K→thinkingConfig,
//          t6→parseBoolean, QG7→supportsThinking, I21→supportsAdaptiveThinking,
//          FGq→getDefaultThinkingBudget, u6→maxTokens, j6→budget
```

---

## Phase 3: API Execution

### withApiRetry - Retry Wrapper

The `_P1` function wraps the API call with retry logic:

```javascript
// ============================================
// withApiRetry - API call with retry logic
// Location: chunks.89.mjs:3-120
// ============================================

async function* withApiRetry(createClient, apiCallFactory, retryContext) {
    let attempt = 0;

    while (true) {
        try {
            // Create client and execute
            let client = createClient();
            let stream = await apiCallFactory(client, attempt, retryContext);

            // Yield all events from stream
            for await (let event of stream) {
                yield event;
            }

            return;  // Success - exit retry loop

        } catch (error) {
            attempt++;

            // Context overflow recovery
            if (error instanceof APIError && error.status === 400) {
                let parsed = parseContextOverflowError(error);
                if (parsed) {
                    let { inputTokens, contextLimit } = parsed;
                    let available = contextLimit - inputTokens - 1000;  // 1000 buffer

                    if (available >= FLOOR_OUTPUT_TOKENS) {
                        retryContext.maxTokensOverride = Math.max(
                            FLOOR_OUTPUT_TOKENS,
                            available,
                            thinkingBudget + 1
                        );

                        logEvent("tengu_max_tokens_context_overflow_adjustment", {
                            inputTokens,
                            contextLimit,
                            adjustedMaxTokens: retryContext.maxTokensOverride,
                            attempt
                        });

                        continue;  // Retry with reduced max_tokens
                    }
                }
            }

            // Rate limiting recovery
            if (error.status === 529) {
                retryContext.fastMode = true;
                logEvent("tengu_rate_limit_fallback_to_fast", { attempt });
                continue;  // Retry with fast mode
            }

            // Model fallback
            if (error instanceof ModelFallbackError && retryContext.fallbackModel) {
                retryContext.model = retryContext.fallbackModel;
                logEvent("tengu_model_fallback", {
                    originalModel: error.originalModel,
                    fallbackModel: retryContext.fallbackModel
                });
                continue;  // Retry with fallback model
            }

            // Unrecoverable error
            throw error;
        }
    }
}
```

---

## Phase 4: Event Processing

### SSE Event Types

| Event Type | When Fired | Data |
|------------|-----------|------|
| `message_start` | First event | `{ message: { id, role, content: [], usage } }` |
| `content_block_start` | New block begins | `{ index, content_block: { type, ... } }` |
| `content_block_delta` | Block content added | `{ index, delta: { type, ... } }` |
| `content_block_stop` | Block complete | `{ index }` |
| `message_delta` | Final updates | `{ delta: { stop_reason }, usage }` |
| `message_stop` | Stream ends | `{}` |

### Event Processing Algorithm

```javascript
// ============================================
// SSE Event Processing Loop
// Location: chunks.171.mjs:279-446
// ============================================

// ORIGINAL (for source lookup):
for await (let n6 of H6) {
    b6();
    let d6 = Date.now();
    // Stall detection...
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
                case "thinking_delta":
                    S6.thinking += n6.delta.thinking;
                    break;
                case "signature_delta":
                    S6.signature = n6.delta.signature;
                    break
            }
            break
        }
        case "content_block_stop": {
            let S6 = i[n6.index];
            let g6 = {
                message: {
                    ...a,
                    content: dh1([S6], Y, _.agentId)
                },
                requestId: J6 ?? void 0,
                type: "assistant",
                uuid: Dn8(),
                timestamp: new Date().toISOString()
            };
            n.push(g6), yield g6;
            break
        }
        case "message_delta": {
            l = Qz6(l, n6.usage), w6 = n6.delta.stop_reason;
            let S6 = n[n.length - 1];
            if (S6) S6.message.usage = l, S6.message.stop_reason = w6;
            if (w6 === "max_tokens") yield createMaxTokensError(L6);
            if (w6 === "model_context_window_exceeded") yield createContextWindowError();
            break
        }
        case "message_stop":
            break
    }
    yield {
        type: "stream_event",
        event: n6,
        ...n6.type === "message_start" ? { ttftMs: o } : void 0
    }
}

// READABLE (for understanding):
for await (let sseEvent of stream) {
    resetStallTimer();  // b6 - resets 30s warning, 60s timeout

    // Track time for stall detection
    let eventTime = Date.now();
    // ... stall detection logic ...

    switch (sseEvent.type) {
        case "message_start": {
            // Initialize message structure
            partialMessage = sseEvent.message;
            ttftMs = Date.now() - requestStartTime;  // Time to first token
            usage = mergeUsage(usage, sseEvent.message?.usage);  // Qz6
            break;
        }

        case "content_block_start":
            // Initialize block based on type - each type has its accumulating field
            switch (sseEvent.content_block.type) {
                case "tool_use":
                    contentBlocks[sseEvent.index] = {
                        ...sseEvent.content_block,
                        input: ""  // Accumulate JSON string
                    };
                    break;
                case "server_tool_use":
                    contentBlocks[sseEvent.index] = {
                        ...sseEvent.content_block,
                        input: ""
                    };
                    break;
                case "text":
                    contentBlocks[sseEvent.index] = {
                        ...sseEvent.content_block,
                        text: ""  // Accumulate text
                    };
                    break;
                case "thinking":
                    contentBlocks[sseEvent.index] = {
                        ...sseEvent.content_block,
                        thinking: "",  // Accumulate thinking text
                        signature: ""  // Final signature
                    };
                    break;
                default:
                    contentBlocks[sseEvent.index] = { ...sseEvent.content_block };
            }
            break;

        case "content_block_delta": {
            let block = contentBlocks[sseEvent.index];
            if (!block) throw RangeError("Content block not found");

            // Accumulate delta into block
            switch (sseEvent.delta.type) {
                case "input_json_delta":
                    block.input += sseEvent.delta.partial_json;  // JSON fragments
                    break;
                case "text_delta":
                    block.text += sseEvent.delta.text;
                    break;
                case "thinking_delta":
                    block.thinking += sseEvent.delta.thinking;
                    break;
                case "signature_delta":
                    block.signature = sseEvent.delta.signature;  // Final signature
                    break;
            }
            break;
        }

        case "content_block_stop": {
            let completedBlock = contentBlocks[sseEvent.index];
            // Build complete message with processed content
            let completeMessage = {
                message: {
                    ...partialMessage,
                    content: processContentBlocks([completedBlock], tools, agentId)  // dh1
                },
                requestId: requestId ?? undefined,
                type: "assistant",
                uuid: generateUUID(),  // Dn8
                timestamp: new Date().toISOString()
            };
            assistantMessages.push(completeMessage);
            yield completeMessage;  // Yield for UI
            break;
        }

        case "message_delta": {
            usage = mergeUsage(usage, sseEvent.usage);
            stopReason = sseEvent.delta.stop_reason;

            // Update last message with final usage
            let lastMessage = assistantMessages[assistantMessages.length - 1];
            if (lastMessage) {
                lastMessage.message.usage = usage;
                lastMessage.message.stop_reason = stopReason;
            }

            // Handle special stop reasons
            if (stopReason === "max_tokens") {
                yield createMaxTokensError(maxTokens);
            }
            if (stopReason === "model_context_window_exceeded") {
                yield createContextWindowError();
            }
            break;
        }

        case "message_stop":
            // Stream complete - nothing to do
            break;
    }

    // Yield raw event for UI state updates
    yield {
        type: "stream_event",
        event: sseEvent,
        ...(sseEvent.type === "message_start" ? { ttftMs } : undefined)
    };
}

// Mapping: n6→sseEvent, H6→stream, b6→resetStallTimer, a→partialMessage,
//          o→ttftMs, r→requestStartTime, l→usage, Qz6→mergeUsage,
//          i→contentBlocks, dh1→processContentBlocks, Y→tools,
//          J6→requestId, Dn8→generateUUID, n→assistantMessages, w6→stopReason,
//          L6→maxTokens
```

#### Stall Detection

The streaming implementation includes sophisticated stall detection:

```javascript
// ============================================
// Streaming stall detection
// Location: chunks.171.mjs:216-235
// ============================================

// ORIGINAL (for source lookup):
let b6 = function() {
    if (V6(), !Q6) return;
    C6 = setTimeout((E6) => {
        k(`Streaming idle warning: no chunks received for ${E6/1000}s`, {
            level: "warn"
        }), U1("warn", "cli_streaming_idle_warning")
    }, k6, k6), o6 = setTimeout(() => {
        u6 = !0, k(`Streaming idle timeout: no chunks received for ${Z6/1000}s, aborting stream`, {
            level: "error"
        }), U1("error", "cli_streaming_idle_timeout"), d("tengu_streaming_idle_timeout", {
            model: _.model,
            request_id: J6 ?? "unknown",
            timeout_ms: Z6
        }), s()
    }, Z6)
};
// Constants: k6 = 30000 (warning), Z6 = 60000 (timeout)

// READABLE (for understanding):
let WARNING_TIMEOUT = 30000;  // 30 seconds
let ABORT_TIMEOUT = 60000;    // 60 seconds
let warningTimer = null;
let abortTimer = null;
let hasTimedOut = false;

function resetStallTimer() {
    clearTimers();
    if (!watchdogEnabled) return;

    // Warning after 30s
    warningTimer = setTimeout((timeout) => {
        log(`Streaming idle warning: no chunks received for ${timeout/1000}s`, { level: "warn" });
        emitUserNotification("warn", "cli_streaming_idle_warning");
    }, WARNING_TIMEOUT, WARNING_TIMEOUT);

    // Abort after 60s
    abortTimer = setTimeout(() => {
        hasTimedOut = true;
        log(`Streaming idle timeout: no chunks received for ${ABORT_TIMEOUT/1000}s, aborting stream`, { level: "error" });
        emitUserNotification("error", "cli_streaming_idle_timeout");
        logEvent("tengu_streaming_idle_timeout", {
            model: options.model,
            request_id: requestId ?? "unknown",
            timeout_ms: ABORT_TIMEOUT
        });
        abortStream();  // s()
    }, ABORT_TIMEOUT);
}

// Mapping: b6→resetStallTimer, V6→clearTimers, Q6→watchdogEnabled,
//          C6→warningTimer, o6→abortTimer, k6→WARNING_TIMEOUT (30000),
//          Z6→ABORT_TIMEOUT (60000), u6→hasTimedOut, s→abortStream
```

---

## Phase 5: Result Yielding

### Event Yield Pattern

The streaming module yields two types of events:

1. **`stream_event`** - Raw SSE events for UI state updates:
   ```javascript
   yield {
       type: "stream_event",
       event: rawSseEvent,
       ttftMs: number  // Only on message_start
   };
   ```

2. **`assistant`** - Complete assistant messages for history:
   ```javascript
   yield {
       type: "assistant",
       message: {
           id: string,
           role: "assistant",
           content: ContentBlock[],
           usage: Usage,
           stop_reason: string
       },
       requestId: string,
       uuid: string,
       timestamp: string
   };
   ```

### Agent Loop Processing

The agent loop processes yielded events:

```javascript
// In mainAgentLoopCore (omY) - chunks.148.mjs:1027-1114

for await (let event of callModel({ messages, systemPrompt, tools, ... })) {
    // Yield to UI
    yield event;

    // Track assistant messages
    if (event.type === "assistant") {
        assistantMessages.push(event);

        // Collect tool_use blocks
        let toolUses = event.message.content.filter(b => b.type === "tool_use");
        if (toolUses.length > 0) {
            collectedToolUses.push(...toolUses);
            hasToolUses = true;

            // Add to streaming executor for parallel execution
            if (streamingToolExecutor) {
                for (let toolUse of toolUses) {
                    streamingToolExecutor.addTool(toolUse, event);
                }
            }
        }
    }

    // Yield completed tool results from streaming executor
    if (streamingToolExecutor) {
        for (let result of streamingToolExecutor.getCompletedResults()) {
            if (result.message) {
                yield result.message;
                toolResults.push(...normalizeMessages([result.message], tools)
                    .filter(m => m.type === "user"));
            }
        }
    }
}
```

---

## Telemetry Events

```javascript
// Before normalization
logEvent("tengu_api_before_normalize", {
    preNormalizedMessageCount: number
});

// After normalization
logEvent("tengu_api_after_normalize", {
    postNormalizedMessageCount: number
});

// Request sent
logEvent("api_request_sent", {
    model: string,
    messagesLength: number,
    betas: string[],
    thinkingType: string,
    effortValue: number,
    fastMode: boolean
});

// First chunk received
logEvent("first_chunk", {});

// Max tokens reached
logEvent("tengu_max_tokens_reached", {
    max_tokens: number
});

// Context window exceeded
logEvent("tengu_context_window_exceeded", {
    max_tokens: number,
    output_tokens: number
});
```

---

## Content Replacement Strategy — T34 (VERIFIED)

> **Source:** `chunks.89.mjs:2024-2210` (P34, f34, fu9, Tu9, Vu9, vu9, T34, QN8)
> **Invocation:** `chunks.148.mjs:934` — called in agent loop before microcompaction
> **Cross-ref:** [compact_integration.md](compact_integration.md) — runs before micro-compact in the pre-query pipeline

Claude Code implements a **per-message budget** system that replaces oversized tool results with compressed summaries saved to disk. This runs every turn, before microcompaction, to keep tool results within a configurable token window.

### Constants

```javascript
// Location: chunks.89.mjs:1872-1881, 2244
$34 = 50000       // MAX_SINGLE_RESULT_SIZE: per-result size cap (chars)
Yp6 = 4           // CHARS_PER_TOKEN: approximation ratio
H34 = 400000      // DEFAULT_RESULT_LIMIT: fallback per-tool limit (chars)
j34 = 200000      // DEFAULT_MESSAGE_BUDGET: default per-message-group budget (chars)
EI = 50           // MAX_CONCURRENT_PERSISTS (not used in Vu9 — used in X34)
J34 = "<persisted-output>"  // REPLACEMENT_PREFIX: marks already-replaced content
DP1 = (unknown)    // PREVIEW_SIZE: first N bytes of preview
```

### Entry Point: T34 (applyContentReplacement)

```javascript
// Location: chunks.89.mjs:2205-2210
// Invoked at: chunks.148.mjs:934

// ORIGINAL:
async function T34(A, q, K, Y) {
    if (!q) return A;
    let z = await Vu9(A, q);
    if (z.newlyReplaced.length > 0 && K.startsWith("repl_main_thread")) Y(z.newlyReplaced);
    return z.messages
}

// READABLE:
async function applyContentReplacement(messages, state, querySource, onNewReplacements) {
    if (!state) return messages;   // No state → feature disabled
    let result = await enforcePerMessageBudget(messages, state);
    // Notify UI of new replacements only for REPL main thread
    if (result.newlyReplaced.length > 0 && querySource.startsWith("repl_main_thread"))
        onNewReplacements(result.newlyReplaced);
    return result.messages;
}

// Mapping: T34→applyContentReplacement, A→messages, q→state, K→querySource,
//   Y→onNewReplacements, Vu9→enforcePerMessageBudget
```

**Agent loop invocation** (chunks.148.mjs:934):
```javascript
I = await T34(I, X.contentReplacementState, O, (D6) => void pz6(D6).catch(_6));
// Right before microcompact: I = (await j.microcompact(I, X, O)).messages;
```

### State Machine: P34 (createContentReplacementState)

```javascript
// Location: chunks.89.mjs:2024-2029

// ORIGINAL:
function P34() {
    return { seenIds: new Set, replacements: new Map }
}

// READABLE:
function createContentReplacementState() {
    return {
        seenIds: new Set(),         // tool_use_ids already processed (frozen)
        replacements: new Map()     // toolUseId → compressed replacement string
    };
}
```

State is created once per session via `W34` (gated by feature flag `tengu_hawthorn_steeple`), or restored from prior session via `QN8`.

### Core Algorithm: Vu9 (enforcePerMessageBudget)

```javascript
// Location: chunks.89.mjs:2145-2203

// ORIGINAL:
async function Vu9(A, q) {
    let K = f34(A),            // Step 1: group tool results by turn
        Y = Wu9(),             // Get per-message budget (default 200000 chars)
        z = new Map,           // toolUseId → replacement content
        _ = [],                // fresh results selected for replacement
        w = 0,                 // reapplied count
        O = 0;                 // over-budget message count
    for (let J of K) {
        let { mustReapply: M, frozen: D, fresh: X } = fu9(J, q);  // Step 2: classify
        if (M.forEach((f) => z.set(f.toolUseId, f.replacement)), w += M.length,
            X.length === 0) { J.forEach((f) => q.seenIds.add(f.toolUseId)); continue }
        let P = D.reduce((f, v) => f + v.size, 0),    // frozen size
            W = X.reduce((f, v) => f + v.size, 0),    // fresh size
            Z = P + W > Y ? Tu9(X, P, Y) : [],        // Step 3: select for replacement
            G = new Set(Z.map((f) => f.toolUseId));
        J.filter((f) => !G.has(f.toolUseId)).forEach((f) => q.seenIds.add(f.toolUseId));
        if (Z.length === 0) continue;
        O++, _.push(...Z)
    }
    if (z.size === 0 && _.length === 0) return { messages: A, newlyReplaced: [] };
    let $ = await Promise.all(_.map(async (J) => [J, await Nu9(J)])),  // Step 4: persist
        H = [], j = 0;
    for (let [J, M] of $) {
        if (q.seenIds.add(J.toolUseId), M === null) continue;
        j += J.size, z.set(J.toolUseId, M.content), q.replacements.set(J.toolUseId, M.content);
        H.push({ kind: "tool-result", toolUseId: J.toolUseId, replacement: M.content });
        d("tengu_tool_result_persisted_message_budget", { /* ... */ });
    }
    // ...
    return { messages: vu9(A, z), newlyReplaced: H };   // Step 5: apply replacements
}

// READABLE:
async function enforcePerMessageBudget(messages, state) {
    let groups = groupToolResultsByTurn(messages);    // Step 1
    let budget = getMessageBudget();                   // default: 200,000 chars (j34)
    let replacementMap = new Map();
    let freshToReplace = [];
    let reappliedCount = 0;
    let overBudgetGroupCount = 0;

    for (let group of groups) {
        // Step 2: Classify each tool result in the group
        let { mustReapply, frozen, fresh } = classifyToolResults(group, state);

        // Re-apply existing replacements
        mustReapply.forEach(r => replacementMap.set(r.toolUseId, r.replacement));
        reappliedCount += mustReapply.length;

        if (fresh.length === 0) {
            group.forEach(r => state.seenIds.add(r.toolUseId));
            continue;
        }

        // Step 3: Check if group exceeds budget
        let frozenSize = frozen.reduce((sum, r) => sum + r.size, 0);
        let freshSize = fresh.reduce((sum, r) => sum + r.size, 0);
        let toReplace = (frozenSize + freshSize > budget)
            ? selectForReplacement(fresh, frozenSize, budget)   // Tu9
            : [];
        let replaceSet = new Set(toReplace.map(r => r.toolUseId));

        // Mark non-replaced as seen (frozen for future turns)
        group.filter(r => !replaceSet.has(r.toolUseId))
             .forEach(r => state.seenIds.add(r.toolUseId));

        if (toReplace.length === 0) continue;
        overBudgetGroupCount++;
        freshToReplace.push(...toReplace);
    }

    if (replacementMap.size === 0 && freshToReplace.length === 0)
        return { messages, newlyReplaced: [] };

    // Step 4: Persist selected results to disk (parallel)
    let persisted = await Promise.all(
        freshToReplace.map(async (r) => [r, await persistToolResult(r)])
    );

    let newlyReplaced = [];
    let totalShed = 0;
    for (let [result, compressed] of persisted) {
        state.seenIds.add(result.toolUseId);
        if (compressed === null) continue;  // persistence failed
        totalShed += result.size;
        replacementMap.set(result.toolUseId, compressed.content);
        state.replacements.set(result.toolUseId, compressed.content);
        newlyReplaced.push({
            kind: "tool-result",
            toolUseId: result.toolUseId,
            replacement: compressed.content
        });
        logEvent("tengu_tool_result_persisted_message_budget", {
            originalSizeBytes: compressed.originalSize,
            persistedSizeBytes: compressed.content.length,
            estimatedOriginalTokens: Math.ceil(compressed.originalSize / 4),
            estimatedPersistedTokens: Math.ceil(compressed.content.length / 4)
        });
    }

    // Step 5: Apply all replacements to messages
    return { messages: applyReplacements(messages, replacementMap), newlyReplaced };
}
```

### Algorithm Steps (Visual)

```
Step 1: f34 — Group tool results by assistant message boundary
  messages: [user(tool_result_A), user(tool_result_B), assistant_1, user(tool_result_C), assistant_2]
  groups: [[A, B], [C]]

Step 2: fu9 — Classify each result in a group
  ┌─────────────────────────────────┐
  │ For each tool_use_id:           │
  │  ├── In state.replacements?     │
  │  │   └── YES → mustReapply      │  (cached replacement from prior turn)
  │  ├── In state.seenIds?          │
  │  │   └── YES → frozen           │  (already processed, under budget)
  │  └── Neither?                   │
  │      └── fresh                  │  (new, never seen)
  └─────────────────────────────────┘

Step 3: Tu9 — Select largest fresh results for replacement
  IF frozenSize + freshSize > budget (200,000 chars):
    Sort fresh by size DESCENDING
    Remove largest until: frozenSize + remainingFreshSize ≤ budget
    Selected items → compress and persist

Step 4: Nu9 → XP1 — Persist to disk
  XP1(content, toolUseId):
    Write to ~/.claude/tool-results/{sessionId}/{toolUseId}.{json|txt}
    Return { filepath, originalSize, preview, hasMore }
  PP1(result):
    Format as: "<persisted-output>\nOutput too large ({size}). Full output saved to: {path}\nPreview (first {N}):\n{preview}\n..."

Step 5: vu9 — Apply replacements to messages
  For each user message with tool_result blocks:
    If tool_use_id in replacementMap:
      Replace content with compressed string
```

### Filter Rules (What Is NOT Replaced)

| Check | Function | Rule |
|-------|----------|------|
| Already replaced | `Zu9` | Content starts with `"<persisted-output>"` (J34 prefix) |
| Contains images | `Z34` | Content is array with any `type === "image"` element |
| Frozen | `fu9` | tool_use_id already in `state.seenIds` |
| Must-reapply | `fu9` | tool_use_id already in `state.replacements` (re-applies cached) |

### Feature Gating

- **Feature flag:** `tengu_hawthorn_steeple` — gates state creation (`W34`)
- **Budget override:** `tengu_hawthorn_window` — overrides default budget of 200,000 chars (`Wu9`)
- **Per-tool override:** `Du9` feature flag object — per-tool-name size limits (`M34`)

### Telemetry

```javascript
// Per-result: emitted for each successfully persisted tool result
logEvent("tengu_tool_result_persisted_message_budget", {
    originalSizeBytes: number,
    persistedSizeBytes: number,
    estimatedOriginalTokens: number,   // Math.ceil(original / 4)
    estimatedPersistedTokens: number   // Math.ceil(persisted / 4)
});

// Per-turn: emitted when any group was over budget
logEvent("tengu_message_level_tool_result_budget_enforced", {
    resultsPersisted: number,
    messagesOverBudget: number,
    replacedSizeBytes: number,
    reapplied: number
});
```

---

## Verified Symbol Reference

| Obfuscated | Readable | File:Line | Purpose |
|------------|----------|-----------|---------|
| mGq | streamingQueryCore | chunks.171.mjs:3 | Main streaming implementation |
| NT6 | callModel | chunks.170.mjs:2009 | Wrapper for streamingQueryCore |
| Sh1 | buildToolSchema | chunks.171.mjs:40 | Build tool schema for API |
| yi6 | shouldUseDynamicLoading | chunks.171.mjs:17 | Dynamic loading decision |
| cM | normalizeMessages | chunks.173.mjs:1999 | Message normalization |
| gGq | addCacheControlsToMessages | chunks.171.mjs:68 | Add cache controls |
| _9z | buildSystemPromptBlocks | chunks.170.mjs:1483 | System prompt blocks |
| $6 | buildRequestParams | chunks.171.mjs:118 | Request object factory |
| _P1 | withApiRetry | chunks.89.mjs:3 | Retry wrapper |
| Qz6 | mergeUsage | chunks.171.mjs:670 | Usage stats merger |
| dh1 | processContentBlocks | chunks.171.mjs:600 | Block processor |
| zF | extractReferencedTools | chunks.171.mjs:21 | Find referenced tools |
| GX | isDeferredTool | chunks.171.mjs | Deferred tool check |
| T34 | applyContentReplacement | chunks.89.mjs:2205 | Entry point for content replacement |
| P34 | createContentReplacementState | chunks.89.mjs:2024 | State factory (seenIds, replacements) |
| Vu9 | enforcePerMessageBudget | chunks.89.mjs:2145 | Core per-message budget algorithm |
| f34 | groupToolResultsByTurn | chunks.89.mjs:2070 | Group results by assistant boundary |
| fu9 | classifyToolResults | chunks.89.mjs:2086 | Classify: mustReapply/frozen/fresh |
| Tu9 | selectForReplacement | chunks.89.mjs:2103 | Select largest fresh for compression |
| vu9 | applyReplacements | chunks.89.mjs:2114 | Apply replacement map to messages |
| Nu9 | persistToolResult | chunks.89.mjs:2136 | Persist single result via XP1 |
| XP1 | persistToFile | chunks.89.mjs:1910 | Write tool result to disk |
| PP1 | formatPersistedOutput | chunks.89.mjs:1948 | Format replacement string |
| W34 | initContentReplacementState | chunks.89.mjs:2037 | Feature-gated state init |
| QN8 | restoreContentReplacementState | chunks.89.mjs:2212 | Restore state from prior session |
| Wu9 | getMessageBudget | chunks.89.mjs:2031 | Get budget (default j34=200000) |
| J34 | REPLACEMENT_PREFIX | chunks.89.mjs:2244 | `"<persisted-output>"` marker |
| j34 | DEFAULT_MESSAGE_BUDGET | chunks.89.mjs:1879 | 200,000 chars default |
| Yp6 | CHARS_PER_TOKEN | chunks.89.mjs:1875 | 4 chars per token ratio |