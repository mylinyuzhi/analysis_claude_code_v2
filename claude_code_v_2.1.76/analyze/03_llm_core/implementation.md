# Module: LLM Core & Prompt Building (03/04) - Claude Code 2.1.76

## Overview

The LLM Core is the "brain" of Claude Code, responsible for orchestrating the conversation loop, managing tool schemas, building complex system prompts, and handling API requests with adaptive features like thinking and effort levels.

## Key Updates in v2.1.76

### New: 1M Context Opus Model Support

Claude Opus 4.6 now supports up to 1 million tokens context window. The system automatically detects and optimizes for this larger context:
- Dynamically adjusts compaction thresholds based on model context window size
- Enables more aggressive deferred tool loading for models with larger context
- Adjusts cache control placement to maximize cache efficiency in 1M context

### New: modelOverrides Field

The system prompt now supports `modelOverrides` configuration:
```javascript
{
    model: "claude-opus-4-6",
    modelOverrides: {
        "claude-haiku-4-5": "fallback to this for specific queries",
        "claude-sonnet-4-6": "alternative for cost optimization"
    }
}
```

This allows fine-grained control over which model to use for different types of queries.

### Simplified Effort Control

Effort level configuration has been simplified in v2.1.76:
- Single `effort` field instead of complex nested structures
- Values: "low" (1), "medium" (5), "high" (10)
- Automatically maps to `output_config.effort` in API requests
- Removed redundant effort management from hook system

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `mainAgentLoop` (Yh) - Main async generator for the agent conversation loop
- `mainAgentLoopCore` (omY) - Inner implementation handling turn logic
- `callModel` (NT6) - LLM API request generator (via SKq helper)
- `withApiRetry` (_P1) - Wrapper for API calls with automatic retry and model fallback logic
- `getSystemPrompt` (cq6) - Returns the appropriate base system prompt based on environment
- `getAttributionHeader` (lq6) - Generates the versioned billing/attribution header
- `buildSystemPromptWithCache` (F9z) - Assembles system prompts and injects cache control markers

**Cross-References:**
- Model selection and resolution: [01_cli/model_selection.md](../01_cli/model_selection.md)
- Effort levels and thinking mode: [19_think_level/effort_control.md](../19_think_level/effort_control.md)
- Proactive mode simplified prompts: [03_llm_core/proactive_mode.md](proactive_mode.md)
- Error recovery mechanisms: [03_llm_core/error_recovery.md](error_recovery.md)
- LLM request pipeline: [03_llm_core/llm_request_pipeline.md](llm_request_pipeline.md)

---

## Core Algorithms

### LLM Request Generation & Adaptive Configuration

**What it does:**
`callModel` (NT6) is a wrapper function that delegates to `streamingQueryCore` (mGq) for the actual LLM API request. It prepares the payload including message normalization, tool schema construction, prompt caching markers, and beta header selection, then manages the streaming response.

**Source Code (VERIFIED):**

```javascript
// ============================================
// callModel - LLM request entry point wrapper
// Location: chunks.170.mjs:2009-2020
// ============================================

// ORIGINAL (for source lookup):
async function* NT6({
    messages: A,
    systemPrompt: q,
    thinkingConfig: K,
    tools: Y,
    signal: z,
    options: _
}) {
    return yield* ff8(A, async function*() {
        yield* mGq(A, q, K, Y, z, _)
    })
}

// READABLE (for understanding):
async function* callModel({ messages, systemPrompt, thinkingConfig, tools, signal, options }) {
    // Delegate to streamingQueryCore via message context wrapper
    return yield* withMessageContext(messages, async function*() {
        yield* streamingQueryCore(messages, systemPrompt, thinkingConfig, tools, signal, options);
    });
}

// Mapping: NT6→callModel, A→messages, q→systemPrompt, K→thinkingConfig,
//   Y→tools, z→signal, _→options, ff8→withMessageContext, mGq→streamingQueryCore
```

**Helper Provider - getModelCallHelpers (SKq):**

```javascript
// ============================================
// getModelCallHelpers - Returns helper functions for the agent loop
// Location: chunks.148.mjs:834-841
// ============================================

// ORIGINAL (for source lookup):
function SKq() {
    return {
        callModel: NT6,
        microcompact: pg,
        autocompact: sqq,
        uuid: nmY
    }
}

// READABLE (for understanding):
function getModelCallHelpers() {
    return {
        callModel: callModel,           // NT6 - LLM request wrapper
        microcompact: microcompact,     // pg - Removes duplicate messages
        autocompact: autoCompact,       // sqq - Summarizes conversation
        uuid: generateUUID              // nmY - UUID generator
    };
}

// Mapping: SKq→getModelCallHelpers, NT6→callModel, pg→microcompact,
//   sqq→autoCompact, nmY→generateUUID
```

**How it works:**
1.  **Tool Context Evaluation**: Checks if "Dynamic Tool Loading" (Deferred Tools) should be used based on the model and current state.
2.  **Global Cache Selection**:
    - If enabled, determines if caching should be `tool_based` or `system_prompt` based.
    - For `tool_based` caching, identifies a "stable" tool (the last non-MCP tool) to attach the `cache_control: { type: "ephemeral" }` marker.
3.  **Prompt Assembly**:
    - Combines the attribution header, base system prompt, and any extra prompts.
    - Injects available deferred tools into the message history if applicable.
4.  **Beta Header & Adaptive Feature Selection**:
    - **Adaptive Thinking**: If the model supports it, sets `thinking: { type: "adaptive" }` and adds the `adaptive-thinking-2026-01-28` beta.
    - **Effort Levels**: Injects `output_config: { effort: value }` and the `effort-2025-11-24` beta.
    - **Adaptive Fast Mode**: If eligible, adds the `research-preview-2026-02` beta.
5.  **Streaming & Stall Detection**:
    - Initiates the API call via `withApiRetry` (_P1).
    - Monitors the stream for "stalls" (gaps > 30s) and reports them to telemetry.
    - Yields events (text deltas, thinking blocks, tool uses) back to the main agent loop.

**Why this approach:**
- **Context Optimization**: By only loading relevant tools and using ephemeral caching, it minimizes token usage and latency.
- **Resilience**: The stall detection and retry logic ensure the agent remains responsive even under network instability.
- **Future-Proofing**: The adaptive thinking and effort systems allow the agent to leverage advanced model capabilities dynamically.

**Key insight:** The use of "Tool-Based Global Cache Markers" is a clever way to ensure that the bulk of the system prompt and tool definitions remain cached even when MCP tools (which might be dynamic) are present.

---

### streamingQueryCore (mGq) - Full Streaming Implementation

**What it does:**
The `streamingQueryCore` function (mGq) is the complete streaming LLM request implementation. It handles tool schema building, message normalization, API request construction, and SSE event processing.

**Source Code (VERIFIED):**

```javascript
// ============================================
// streamingQueryCore - Complete streaming query implementation
// Location: chunks.171.mjs:3-300+
// ============================================

// ORIGINAL (for source lookup):
async function* mGq(A, q, K, Y, z, _) {
    // Off-switch check
    if (!iA() && (await rR("tengu-off-switch", { activated: !1 })).activated && V36(_.model)) {
        d("tengu_off_switch_query", {}), yield oX1(Error(v36), _.model);
        return
    }

    // Tool schema building
    K5("query_tool_schema_build_start");
    let $ = _.querySource.startsWith("repl_main_thread") || ...;
    let H = Ch1(_.model, { isAgenticQuery: $ });
    let j = await yi6(_.model, Y, _.getToolPermissionContext, _.agents, "query");

    // Deferred tool filtering
    if (j) {
        let T6 = zF(A);  // Extract tool names from recent messages
        J = Y.filter((D6) => {
            if (!GX(D6)) return !0;  // Include non-deferred tools
            if (z3(D6, HZ)) return !0;  // Include ToolSearch
            return T6.has(D6.name);  // Include if recently mentioned
        });
    }

    // Tool schema conversion
    let v = await Promise.all(J.map((T6) => Sh1(T6, {
        getToolPermissionContext: _.getToolPermissionContext,
        tools: Y,
        agents: _.agents,
        allowedAgentTypes: _.allowedAgentTypes,
        model: _.model,
        betas: H,
        deferLoading: j && (GX(T6) || e3z(T6))
    })));

    K5("query_tool_schema_build_end");

    // Message normalization
    K5("query_message_normalization_start");
    let N = cM(A, J);  // Normalize messages
    K5("query_message_normalization_end");

    // System prompt assembly
    q = uq([m21(V), u21({ ... }), ...q].filter(Boolean));
    let u = _9z(q, R, { skipGlobalCacheForSystemPrompt: G, querySource: _.querySource });

    // API request building
    let K1 = {
        model: lg(_.model),
        messages: z9z(N, b6, _.querySource, ...),
        system: u,
        tools: [...v, ..._.extraToolSchemas ?? []],
        max_tokens: u6,
        thinking: o6,
        ...(betas.length > 0 ? { betas } : {}),
        ...
    };

    // Streaming with retry
    let T6 = _P1(() => MI({...}), async (E6, U6, c6) => {
        // ... create streaming request
        return await E6.beta.messages.create({ ...K1, stream: !0 });
    }, { model: _.model, fallbackModel: _.fallbackModel, ... });

    // Process SSE events
    for await (let n6 of H6) {
        switch (n6.type) {
            case "message_start": { /* ... */ }
            case "content_block_start": { /* ... */ }
            case "content_block_delta": { /* ... */ }
            case "content_block_stop": { /* ... */ }
            case "message_delta": { /* ... */ }
            case "message_stop": { /* ... */ }
        }
    }
}

// READABLE (for understanding):
async function* streamingQueryCore(messages, systemPrompt, thinkingConfig, tools, signal, options) {
    // 1. Off-switch check (remote kill switch for emergency service control)
    if (!isSandbox() && await isOffSwitchActivated() && isPrimaryModel(options.model)) {
        logEvent("tengu_off_switch_query", {});
        yield createOffSwitchError();
        return;
    }

    // 2. Tool schema building with deferred loading
    recordMark("query_tool_schema_build_start");

    let isAgenticQuery = options.querySource.startsWith("repl_main_thread") || ...;
    let betas = getDefaultBetas(options.model, { isAgenticQuery });
    let isDeferredLoadingEnabled = await checkDeferredLoading(options.model, tools, ...);

    // Filter tools based on deferred loading
    let filteredTools;
    if (isDeferredLoadingEnabled) {
        let recentToolNames = extractRecentToolNames(messages);
        filteredTools = tools.filter(tool => {
            if (!isDeferredTool(tool)) return true;  // Always include non-deferred
            if (matchesToolName(tool, TOOL_SEARCH_NAME)) return true;  // Always include ToolSearch
            return recentToolNames.has(tool.name);  // Only if recently mentioned
        });
    }

    // Convert tool objects to API schemas
    let toolSchemas = await Promise.all(filteredTools.map(tool =>
        buildToolSchema(tool, { model, betas, deferLoading: isDeferredLoadingEnabled && isDeferredTool(tool) })
    ));

    recordMark("query_tool_schema_build_end");

    // 3. Message normalization
    recordMark("query_message_normalization_start");
    let normalizedMessages = normalizeMessages(messages, filteredTools);
    recordMark("query_message_normalization_end");

    // 4. Build API request with thinking, effort, and caching configuration
    let apiParams = {
        model: resolveModel(options.model),
        messages: prepareMessagesWithCache(normalizedMessages, ...),
        system: buildSystemPromptBlocks(systemPrompt, enableCaching, ...),
        tools: [...toolSchemas, ...(options.extraToolSchemas ?? [])],
        max_tokens: maxTokens,
        thinking: thinkingConfig.type !== "disabled" ? { type: thinkingConfig.type, ... } : undefined,
        ...(betas.length > 0 ? { betas } : {}),
        metadata: getMetadata(),
        ...(effortValue ? { output_config: { effort: effortValue } } : {}),
        ...(fastMode ? { speed: "fast" } : {})
    };

    // 5. Execute streaming request with retry wrapper
    let streamIterator = withApiRetry(
        () => createClient({ model: options.model, ... }),
        async (client, attempt, retryContext) => {
            recordMark("query_api_request_sent");
            return await client.beta.messages.create({ ...apiParams, stream: true });
        },
        { model: options.model, fallbackModel: options.fallbackModel, thinkingConfig, signal }
    );

    // 6. Process SSE events
    for await (let event of streamIterator) {
        switch (event.type) {
            case "message_start": /* Initialize message, track usage */
            case "content_block_start": /* Initialize content block by type */
            case "content_block_delta": /* Accumulate deltas (text, json, thinking) */
            case "content_block_stop": /* Yield complete block */
            case "message_delta": /* Update usage, check stop_reason */
            case "message_stop": /* End of message */
        }
        yield event;  // Pass to caller
    }
}

// Mapping: mGq→streamingQueryCore, A→messages, q→systemPrompt, K→thinkingConfig,
//   Y→tools, z→signal, _→options, Sh1→buildToolSchema, cM→normalizeMessages,
//   _P1→withApiRetry, K5→recordMark, d→logEvent
```

**Key insight:** The function is designed as a pipeline with clear stages marked by `K5` (recordMark) calls for performance profiling. Each stage transforms the data: tools → filtered tools → schemas, messages → normalized messages, prompts → cached blocks. The streaming loop at the end yields events incrementally for real-time UI updates.

---

## withApiRetry (_P1) - Adaptive Retry Wrapper

### Algorithm Deep Dive

**What it does:** Wraps any API operation in an async generator that implements exponential backoff, fast mode degradation, context overflow recovery, rate limit handling, and fallback model support. Is itself an async generator so it can yield retry warning messages to the UI.

**Source Code (Verified):**

```javascript
// ============================================
// withApiRetry - Adaptive retry wrapper with context overflow recovery
// Location: chunks.89.mjs:3-94
// ============================================

// ORIGINAL (for source lookup):
async function* _P1(A, q, K) {
    let Y = mb9(K),
        z = {
            model: K.model,
            thinkingConfig: K.thinkingConfig,
            ...Dq() ? {
                fastMode: K.fastMode
            } : {}
        },
        _ = null,
        w = K.initialConsecutive529Errors ?? 0,
        O;
    for (let $ = 1; $ <= Y + 1; $++) {
        if (K.signal?.aborted) throw new Az;
        // ... retry logic with error classification ...
        if (j instanceof a7) {
            let X = $54(j);
            if (X) {
                let {
                    inputTokens: P,
                    contextLimit: W
                } = X, Z = 1000, G = Math.max(0, W - P - 1000);
                if (G < fN8) throw _6(Error(`availableContext ${G} is less than FLOOR_OUTPUT_TOKENS ${fN8}`)), j;
                let f = (z.thinkingConfig.type === "enabled" ? z.thinkingConfig.budgetTokens : 0) + 1,
                    v = Math.max(fN8, G, f);
                z.maxTokensOverride = v, d("tengu_max_tokens_context_overflow_adjustment", {
                    inputTokens: P,
                    contextLimit: W,
                    adjustedMaxTokens: v,
                    attempt: $
                });
                continue
            }
        }
        // ... backoff calculation ...
    }
    throw new RB(O, z)
}

// READABLE (for understanding):
async function* withApiRetry(clientFactory, operation, config) {
    let maxRetries = getMaxRetries(config);
    let retryContext = {
        model: config.model,
        thinkingConfig: config.thinkingConfig,
        ...(isFastModeEnabled() ? { fastMode: config.fastMode } : {})
    };
    let client = null;
    let consecutive529Errors = config.initialConsecutive529Errors ?? 0;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        // Check for user cancellation
        if (config.signal?.aborted) throw new AbortError();

        // ... client initialization and operation execution ...

        // Error classification
        if (error instanceof APIError) {
            let contextOverflow = parseContextOverflowError(error);
            if (contextOverflow) {
                let { inputTokens, contextLimit } = contextOverflow;
                let buffer = 1000;
                let available = Math.max(0, contextLimit - inputTokens - buffer);

                if (available < FLOOR_OUTPUT_TOKENS) {
                    throw error; // No room for response
                }

                let thinkingBudget = (retryContext.thinkingConfig.type === "enabled"
                    ? retryContext.thinkingConfig.budgetTokens : 0) + 1;
                let adjusted = Math.max(FLOOR_OUTPUT_TOKENS, available, thinkingBudget);

                retryContext.maxTokensOverride = adjusted;
                logEvent("tengu_max_tokens_context_overflow_adjustment", {
                    inputTokens,
                    contextLimit,
                    adjustedMaxTokens: adjusted,
                    attempt
                });
                continue; // Retry with adjusted max_tokens
            }
        }

        // ... backoff calculation and retry ...
    }
    throw new RetryError(lastError, retryContext);
}

// Mapping: _P1→withApiRetry, A→clientFactory, q→operation, K→config,
//   Y→maxRetries, mb9→getMaxRetries, z→retryContext, Dq→isFastModeEnabled,
//   $54→parseContextOverflowError, fN8→FLOOR_OUTPUT_TOKENS, d→logEvent
```

**How it works:**

The retry loop runs `maxRetries + 1` times. `maxRetries` is model-dependent. On each iteration:

1. **Client initialization**: The `clientFactory` (`A`) is called on the first attempt or after a 401 error (to refresh auth tokens). Bedrock credential expiry is also detected and triggers re-initialization.

2. **Operation execution**: The `operation` callback (`q`) is called with `(client, attemptNumber, retryContext)`. The `retryContext` is a mutable object that accumulates state changes across retries (e.g., `maxTokensOverride`, `fastMode` flag).

3. **Error classification**: On failure, errors are categorized:
   - `AbortError` → re-thrown immediately (user cancelled)
   - `401` → refresh auth token, re-init client, retry
   - `429 / overload` with fast mode → disable fast mode, retry immediately or after delay
   - `context_length_exceeded` → compute available tokens, set `maxTokensOverride`, retry
   - Retryable network/server errors → exponential backoff

4. **Context overflow recovery algorithm**:
   ```
   inputTokens = from error response
   contextLimit = from error response
   buffer = 1000  (reserve tokens for safety)
   available = contextLimit - inputTokens - buffer
   if available < FLOOR_OUTPUT_TOKENS (1000): throw error (no room)
   adjusted = max(FLOOR_OUTPUT_TOKENS, available, maxThinkingTokens + 1)
   retryContext.maxTokensOverride = adjusted
   → retry with this reduced max_tokens
   ```
   This is the only mechanism preventing a "context too long" error from being fatal. It dynamically computes the largest safe output token budget that fits in the remaining context window.

5. **Fallback model logic**: For Claude Opus models specifically (`p_1(model)` returns true), persistent overload errors (after `Eq9` attempts) trigger the fallback model if configured. Telemetry event `tengu_api_opus_fallback_triggered` is recorded.

6. **Backoff calculation**: `cU(attemptNumber, retryAfterHeader)` computes the delay. Uses the `Retry-After` header value if present and within bounds (`< hq9` cap). Otherwise uses exponential backoff with jitter: `min(base * 2^attempt + jitter, maxBackoff)`.

**Why this approach:**
- **Generator pattern**: Yields `RetryNoticeMessage` objects during backoff so the UI can display "Retrying in Xs..." without blocking the retry loop.
- **Mutable `retryContext`**: Rather than re-building params on each retry, the context object is mutated with override values. This allows the next attempt to automatically use the adjusted `maxTokensOverride` or disabled `fastMode` without re-threading parameters through the call stack.
- **Context overflow recovery**: Rather than surfacing a fatal error to the user, automatically reduces `max_tokens` to fit within the available context. This makes long conversations recoverable without requiring explicit user intervention.

**Key insight:** The `maxTokensOverride` in `retryContext` is the most sophisticated part. It's computed as `max(FLOOR(1000), available_context, maxThinkingTokens + 1)`. The `maxThinkingTokens + 1` ensures thinking mode doesn't accidentally get more budget than the total max_tokens, which would be an API error.

---

## buildSystemPromptWithCache - Section-Based Cache Control

### Cache Section Strategy

**What it does:** Transforms system prompt strings into API-format content blocks with `cache_control` directives. The key innovation is splitting the prompt at semantic boundaries to maximize cache hit rates.

**How it works:**

1. Calls `nSA` (splitSystemPromptBySections) to split the system prompt array into sections with `cacheScope` labels.
2. The `cacheScope` determines which cache tier to use:
   - `null` → no caching (dynamic/frequently-changing content)
   - `"global"` → global ephemeral cache (shared across sessions, longer TTL)
   - `"local"` → local ephemeral cache (per-session)
3. Each section becomes a `{ type: "text", text: ..., cache_control?: ... }` block.

**Section splitting algorithm (nSA):**

The system prompt is built as an array of strings. `nSA` traverses this array and groups strings into cache sections based on a special delimiter marker `xG1` (GLOBAL_CACHE_MARKER). Strings before the global cache marker get `cacheScope: null` (not cached), strings after get `cacheScope: "global"`.

For the standard case (no global cache), the last two non-null sections get `cacheScope: "local"` to enable the standard message-level caching that the Anthropic API provides.

**Why this approach:**
- The system prompt can be 4000+ tokens. Without caching, these tokens are re-processed on every API call, adding latency and cost.
- By placing a cache boundary at the end of the static sections (persona, tool policy, coding guidelines), the stable content is cached while dynamic sections (memory content, MCP instructions, environment info) are re-sent each turn.
- The `skipGlobalCacheForSystemPrompt` option disables even the local cache — used in scenarios where prompt content is fully dynamic (e.g., compaction summary requests).

**Key insight:** The global cache (`tengu_system_prompt_global_cache` feature flag) places a special `xG1` marker string at the end of the prompt. `nSA` recognizes this marker as a cache boundary and assigns `cacheScope: "global"` to everything after it. This creates a two-tier system: the base prompt is globally cached (across all users), while dynamic injections (memory, MCP, env) are not cached at all.

---

## Deferred Tools Algorithm

### Dynamic Tool Loading System

**What it does:** The deferred tools system reduces token usage by only including tool schemas for tools the model is likely to use, rather than sending all available tools in every request.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Deferred Tools Filtering Logic
// Location: chunks.171.mjs:17-27
// ============================================

// ORIGINAL (for source lookup):
j = await yi6(_.model, Y, _.getToolPermissionContext, _.agents, "query");
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
let isDeferredLoadingEnabled = await checkDeferredLoading(model, tools, permissionContext, agents, "query");

// Edge case: Disable if no deferred tools available
if (isDeferredLoadingEnabled && !tools.some(isDeferredTool) && !hasPendingMcpServers) {
    log("Tool search disabled: no deferred tools available to search");
    isDeferredLoadingEnabled = false;
}

let filteredTools;
if (isDeferredLoadingEnabled) {
    // Extract tool names mentioned in recent messages
    let recentToolNames = extractRecentToolNames(messages);

    // Filter tools based on recency
    filteredTools = tools.filter((tool) => {
        if (!isDeferredTool(tool)) return true;          // Always include non-deferred (built-in)
        if (matchesToolName(tool, TOOL_SEARCH_NAME)) return true;  // Always include ToolSearch
        return recentToolNames.has(tool.name);           // Include if recently mentioned
    });
} else {
    // Filter out only ToolSearch
    filteredTools = tools.filter((tool) => !matchesToolName(tool, TOOL_SEARCH_NAME));
}

// Mapping: j→isDeferredLoadingEnabled, J→filteredTools, yi6→checkDeferredLoading,
//   Y→tools, GX→isDeferredTool, zF→extractRecentToolNames, A→messages,
//   z3→matchesToolName, HZ→TOOL_SEARCH_NAME, D6→tool, T6→recentToolNames
```

**How it works:**

1. **Enablement Check (`yi6`)**: Determines if deferred loading should be used:
   - Model must support the feature
   - Tools must have deferred tools (MCP tools marked as deferred)
   - User hasn't disabled the feature

2. **Recent Tool Extraction (`zF`)**: Scans recent messages for tool names:
   - Parses assistant messages for `tool_use` blocks
   - Extracts tool names from those blocks
   - Returns a Set of tool names

3. **Filtering Logic**:
   - **Always include**: Non-deferred tools (built-in tools like Read, Write, Edit)
   - **Always include**: ToolSearch (allows discovery of deferred tools)
   - **Conditionally include**: Deferred tools only if mentioned in recent messages

**Why this approach:**
- MCP servers can expose hundreds of tools, consuming 10,000+ tokens per request
- ToolSearch allows discovery without bloating every request
- Built-in tools are always available because they're core to agent capabilities
- Recent message tracking ensures tools used in the conversation stay available

**Key insight:** The `ToolSearch` tool is the escape hatch. If the model needs a deferred tool that wasn't included, it can call `ToolSearch` with `"select:tool_name"` to load that tool's schema. The next request will then include that tool.

### Deferred Tools Delta Attachment

**What it does:** Notifies the model about which deferred tools are available but weren't included in the schema.

**Location:** chunks.147.mjs:256-267 (xE1 function)

This attachment is produced by `getDeferredToolsDeltaAttachment` and informs the model:
```
<available-deferred-tools>
tool_name_1
tool_name_2
</available-deferred-tools>
```

This allows the model to discover and request tools it doesn't currently have schemas for.

---

## Thinking Mode Integration

### Thinking Configuration Processing

**What it does:** Configures the thinking parameter for API requests based on model capabilities, user settings, and feature flags.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Thinking Mode Configuration
// Location: chunks.171.mjs:129-143
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
let maxTokens = retryContext?.maxTokensOverride || options.maxOutputTokensOverride || getDefaultMaxTokens(options.model);

let isThinkingEnabled = thinkingConfig.type !== "disabled" &&
    !parseBoolean(process.env.CLAUDE_CODE_DISABLE_THINKING);

let thinkingParam = undefined;

if (isThinkingEnabled && modelSupportsThinking(options.model)) {
    if (!parseBoolean(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) &&
        supportsAdaptiveThinking(options.model)) {
        // Adaptive thinking: model decides budget dynamically
        thinkingParam = { type: "adaptive" };
    } else {
        // Enabled thinking: fixed budget
        let budget = getDefaultThinkingBudget(options.model);

        // Override with user-specified budget if provided
        if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== undefined) {
            budget = thinkingConfig.budgetTokens;
        }

        // Ensure budget doesn't exceed max_tokens - 1
        budget = Math.min(maxTokens - 1, budget);

        thinkingParam = {
            budget_tokens: budget,
            type: "enabled"
        };
    }
}

// Mapping: u6→maxTokens, C6→isThinkingEnabled, o6→thinkingParam, K→thinkingConfig,
//   T6→retryContext, _→options, t6→parseBoolean, QG7→modelSupportsThinking,
//   I21→supportsAdaptiveThinking, FGq→getDefaultThinkingBudget, Li6→getDefaultMaxTokens
```

**How it works:**

1. **Thinking Mode Detection**:
   - `disabled`: No thinking parameter in API request
   - `enabled`: Fixed `budget_tokens` specified
   - `adaptive`: Model dynamically manages thinking budget

2. **Budget Calculation**:
   - Default budget is model-specific (e.g., 31999 for Claude Opus)
   - User can override via `thinkingConfig.budgetTokens`
   - Budget is capped at `maxTokens - 1` to ensure room for output

3. **Beta Header Selection**:
   - `adaptive-thinking-2026-01-28`: Required for adaptive thinking
   - `interleaved-thinking-2025-05-14`: For interleaved thinking mode

**Why this approach:**
- Adaptive thinking allows the model to dynamically adjust its reasoning budget based on problem complexity
- Fixed budget provides predictability for cost-sensitive use cases
- The `maxTokens - 1` constraint ensures thinking doesn't consume all output tokens

**Key insight:** Thinking tokens are included in `output_tokens` but are not visible to the user. They represent the model's internal reasoning process. The budget must be carefully managed to ensure the model has enough tokens for both thinking and visible output.

---

## Global Cache Strategy

### System Prompt Caching Algorithm

**What it does:** Determines whether to use global caching, local caching, or no caching for the system prompt based on feature flags and tool composition.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Cache Strategy Selection
// Location: chunks.171.mjs:32-39
// ============================================

// ORIGINAL (for source lookup):
let D = !1,
    X = "",
    P = C_6() && (t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1)),
    W = Y.some((T6) => T6.isMcp === !0),
    Z = J.some((T6) => z3(T6, HZ)),
    G = P && (W || Z);
if (P && !H.includes(kR6)) H.push(kR6);
let f = P ? G ? "none" : "system_prompt" : "none",

// READABLE (for understanding):
let isGlobalCacheForced = C_6() && (
    parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
    getFeatureFlag("tengu_system_prompt_global_cache", false)
);

let hasMcpTools = tools.some((tool) => tool.isMcp === true);
let hasToolSearch = filteredTools.some((tool) => matchesToolName(tool, TOOL_SEARCH_NAME));
let shouldSkipGlobalCache = isGlobalCacheForced && (hasMcpTools || hasToolSearch);

if (isGlobalCacheForced && !betas.includes(ADAPTIVE_THINKING_BETA)) {
    betas.push(ADAPTIVE_THINKING_BETA);
}

let cacheStrategy = isGlobalCacheForced
    ? (shouldSkipGlobalCache ? "none" : "system_prompt")
    : "none";

// Mapping: P→isGlobalCacheForced, W→hasMcpTools, Z→hasToolSearch, G→shouldSkipGlobalCache,
//   f→cacheStrategy, Y→tools, J→filteredTools, H→betas, kR6→ADAPTIVE_THINKING_BETA,
//   w8→getFeatureFlag, t6→parseBoolean, C_6→isFirstParty
```

**Cache Strategy Decision Tree:**

```
┌─────────────────────────────────────────────────────────────┐
│              isGlobalCacheForced (feature flag)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │ FALSE                             │ TRUE
         ▼                                   ▼
   cacheStrategy = "none"         ┌─────────────────────────┐
                                  │ hasMcpTools || hasToolSearch? │
                                  └─────────────┬───────────┘
                                          │
                      ┌───────────────────┴───────────────────┐
                      │ TRUE                                  │ FALSE
                      ▼                                       ▼
              cacheStrategy = "none"            cacheStrategy = "system_prompt"
              (Skip global cache)               (Use global cache marker)
```

**Why this approach:**
- Global cache is shared across all users, reducing costs for common prompts
- MCP tools are dynamic (server-specific), so global cache must be disabled when they're present
- ToolSearch is also dynamic, requiring cache bypass
- The `system_prompt` strategy adds a cache marker that the API uses for global caching

**Key insight:** The adaptive thinking beta (`kR6`) is added when global cache is enabled because it's required for the cache to work correctly with thinking-enabled models.

---

## processContentBlocks - JSON Parsing and Schema Validation

### Tool Input Normalization

**What it does:** Post-processes LLM output content blocks to: parse JSON strings into objects for tool_use blocks, validate and normalize inputs against tool schemas, and detect/log whitespace-only text responses.

**How it works:**

1. **Type dispatch**: Iterates content blocks and routes each by type.
2. **tool_use normalization**:
   - Tool inputs arrive as concatenated `input_json_delta` strings → stored as `input: ""` in the block → concatenated during streaming → passed here as a raw JSON string.
   - `j9(input)` (parseJson) parses the string to a JS object. Returns `null` on invalid JSON, falling back to `{}`.
   - `R1q` (normalizeToolInput) validates the parsed object against the tool's Zod schema. This coerces types (e.g., number strings to numbers) and applies defaults.
   - Normalization errors are recorded via `K1` (recordError) but do NOT throw — the raw parsed input is used as fallback.
3. **text validation**: Whitespace-only text responses emit `tengu_model_whitespace_response` telemetry but are still returned as-is (the UI will handle display).
4. **Pass-through types**: `code_execution_tool_result`, `mcp_tool_use`, `mcp_tool_result`, `container_upload`, `server_tool_use` are returned unchanged.

**Why this approach:**
- Tool inputs arrive as partial JSON strings. JSON cannot be parsed incrementally, so parsing is deferred until the block is complete.
- The Zod schema normalization step ensures that even if the model emits technically valid JSON that doesn't match the tool's expected types (e.g., `"true"` instead of `true`), the input is coerced to the correct type before execution.
- Non-fatal normalization errors prevent a single malformed tool call from crashing the entire agent turn.

**Key insight:** The `parseJson(input) ?? {}` fallback means that if the model emits syntactically invalid JSON (which can happen if streaming was interrupted), the tool still gets called with an empty input object. This allows the tool to return a "missing required parameter" error rather than crashing the process.

---

## Cross-Feature Linkages

The LLM Core integrates with multiple subsystems. This section documents the key integration points.

### Integration with 04_system_reminder (Attachment System)

**Connection Point:** `mainAgentLoop` → `assembleAllAttachments` → `normalizeAttachmentForAPI`

```
mainAgentLoop (Yh) / mainAgentLoopCore (omY)
    │
    ├── After tool execution completes
    │   │
    │   └── assembleAllAttachments (_uY)
    │       │
    │       ├── User-dependent producers
    │       │   ├── at_mentioned_files (RuY)
    │       │   ├── mcp_resources (SuY)
    │       │   └── agent_mentions (huY)
    │       │
    │       ├── Always-computed producers
    │       │   ├── changed_files (CuY)
    │       │   ├── nested_memory (IuY)
    │       │   ├── plan_mode (DuY)
    │       │   └── todo_reminders (ruY/auY)
    │       │
    │       └── Main-agent-only producers
    │           ├── ide_selection (kuY)
    │           ├── diagnostics (cuY)
    │           └── token_usage (qmY)
    │
    └── normalizeAttachmentForAPI (Ui8)
        └── 57+ case switch
            └── Returns formatted messages with <system-reminder> tags
```

**Why attachments are produced after tool execution:**
1. Tool execution may modify files → changed_files needs latest git status
2. Tool execution may update todo list → todo_reminder needs latest items
3. Tool execution may change plan state → plan_mode needs latest state

**Key Files:**
- `03_llm_core/reminder_integration.md` - Producer layer
- `04_system_reminder/overview.md` - Normalization layer

### Integration with Tools (StreamingToolExecutor)

**Connection Point:** `mainAgentLoop` → `StreamingToolExecutor` → `toolDispatcher`

```
mainAgentLoop (Yh)
    │
    ├── callModel (NT6) yields tool_use blocks
    │   │
    │   └── StreamingToolExecutor (ui6)
    │       │
    │       ├── addTool() for each tool_use block
    │       │   ├── Lookup tool by name
    │       │   ├── Validate input against schema
    │       │   └── Determine concurrency safety
    │       │
    │       ├── processQueue()
    │       │   └── Execute safe tools in parallel
    │       │
    │       └── For each tool:
    │           └── toolDispatcher (Wi6)
    │               └── executeToolCore (fxY)
    │                   ├── Pre-tool hooks (y4q)
    │                   ├── Permission check (canUseTool)
    │                   ├── Tool execution
    │                   └── Post-tool hooks (k4q)
    │
    └── Yield tool results
```

**Concurrency Safety Rules:**
- Safe tools (Read, Glob, Grep) can run in parallel
- Unsafe tools (Write, Edit, Bash) must run sequentially
- Mixed: Safe tools can run in parallel with each other, but unsafe tools block

### Integration with Compact System

**Connection Point:** `mainAgentLoop` → auto-compact check → `compactMessages`

```
mainAgentLoop (Yh)
    │
    ├── Turn start
    │   │
    │   ├── Micro-compact check (pg)
    │   │   └── Quick context reduction if near limit
    │   │
    │   └── Auto-compact check (sqq)
    │       ├── Get token count
    │       ├── Compare against threshold
    │       └── If exceeded: compactMessages()
    │
    └── callModel (NT6)
        └── If context overflow error
            └── withApiRetry handles recovery
                └── Adjusts maxTokensOverride
```

**Context Overflow Recovery:**
1. API returns `context_length_exceeded` error
2. `withApiRetry` parses error for `inputTokens` and `contextLimit`
3. Computes `available = contextLimit - inputTokens - 1000` (buffer)
4. Sets `maxTokensOverride = max(FLOOR, available, thinkingBudget)`
5. Retries with reduced output budget

### Integration with Hooks

**Connection Points:**
1. **PreToolUse**: `executeToolCore` (fxY) → `executePreToolHooksIterator` (y4q)
2. **PostToolUse**: `executeToolCore` (fxY) → `executePostToolHooksIterator` (k4q)
3. **Stop**: `mainAgentLoop` checks hook results

```
executeToolCore (fxY)
    │
    ├── Input validation
    │
    ├── executePreToolHooksIterator (y4q)
    │   ├── For each registered PreToolUse hook
    │   │   ├── Execute hook
    │   │   └── Collect results:
    │   │       ├── hookPermissionResult (allow/deny/ask)
    │   │       ├── hookUpdatedInput (modified params)
    │   │       └── stopReason (if hook blocks)
    │   │
    │   └── Apply hook results
    │       ├── "allow" → bypass permission (if no user interaction required)
    │       ├── "deny" → return error immediately
    │       └── "ask" → pass to canUseTool
    │
    ├── Permission check (canUseTool)
    │
    ├── Tool execution
    │
    └── executePostToolHooksIterator (k4q)
        └── For each registered PostToolUse hook
            └── Process tool result
```

### Integration with Thinking/Effort Mode

**Connection Point:** `callModel` (NT6) → beta header selection

```
callModel (NT6)
    │
    ├── Determine thinking mode
    │   ├── enabled → thinking: { type: "enabled", budget_tokens: X }
    │   └── adaptive → thinking: { type: "adaptive" }
    │
    ├── Determine effort level
    │   ├── low (1) → output_config: { effort: "low" }
    │   ├── medium (5) → output_config: { effort: "medium" }
    │   └── high (10) → output_config: { effort: "high" }
    │
    └── Build beta headers
        ├── adaptive-thinking-2026-01-28 (if adaptive)
        ├── effort-2025-11-24 (if effort set)
        └── research-preview-2026-02 (if fast mode)
```

### Integration with Plan Mode

**Connection Points:**
1. **System Prompt**: Plan mode instructions injected via `getSystemPrompt`
2. **Attachments**: Plan state via `getPlanModeAttachment` (DuY)
3. **Tool Restrictions**: Safe tools only when in plan mode

```
mainAgentLoop (Yh)
    │
    ├── Check plan mode state
    │   └── From toolUseContext.options
    │
    ├── Build system prompt
    │   └── If plan mode active:
    │       └── Include "You are in plan mode..." instructions
    │
    └── Attachment production
        └── getPlanModeAttachment (DuY)
            ├── full: Complete plan reminder
            ├── sparse: Minimal reminder
            └── reentry: Return to plan mode
```

---

## Retry Algorithm Decision Tree

### Complete Error Classification and Recovery Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    withApiRetry (_P1) - Error Handler                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Error caught in attempt N    │
                    └───────────────┬───────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐     ┌───────────────────────┐     ┌───────────────────┐
│ signal.aborted│     │   APIError (a7)        │     │  Other Error      │
│               │     │   status codes         │     │                   │
└───────┬───────┘     └───────────┬───────────┘     └─────────┬─────────┘
        │                         │                           │
        ▼                         │                           │
┌───────────────┐                 │                           │
│ throw Abort   │                 │                           │
└───────────────┘                 │                           │
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
    ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
    │   401         │     │   429/529     │     │   400         │
    │   Unauthorized│     │   Rate/Overload│    │   Bad Request │
    └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
            │                     │                     │
            ▼                     │                     │
    ┌───────────────┐             │                     │
    │ Refresh token │             │                     │
    │ Re-init client│             │                     │
    │ Retry         │             │                     │
    └───────────────┘             │                     │
                                  │                     │
                    ┌─────────────┴─────────────┐       │
                    │                           │       │
                    ▼                           ▼       ▼
            ┌───────────────┐           ┌───────────────────────┐
            │ Fast Mode?    │           │ Context Overflow?     │
            └───────┬───────┘           │ ($54 parsing)         │
                    │                   └───────────┬───────────┘
            ┌───────┴───────┐                       │
            │               │                       ▼
            ▼               ▼           ┌───────────────────────────┐
    ┌───────────────┐ ┌───────────────┐ │ Parse error message:      │
    │ Yes: Disable  │ │ No: Backoff   │ │ "input length and         │
    │ fast mode     │ │ with delay    │ │ `max_tokens` exceed       │
    │ Retry         │ │ Retry         │ │ context limit: X + Y > Z" │
    └───────────────┘ └───────────────┘ └───────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ Calculate:                    │
                                    │ available = Z - X - 1000      │
                                    │                               │
                                    │ if available < FLOOR (1000):  │
                                    │   throw error (no recovery)   │
                                    │                               │
                                    │ adjusted = max(FLOOR,         │
                                    │   available, thinkingBudget+1)│
                                    │                               │
                                    │ retryContext.maxTokensOverride│
                                    │   = adjusted                  │
                                    │                               │
                                    │ Retry with adjusted max_tokens│
                                    └───────────────────────────────┘
```

### Backoff Calculation Algorithm (VI function)

```javascript
// ============================================
// calculateBackoffDelay - Exponential backoff with jitter
// Location: chunks.89.mjs:100-108
// ============================================

// ORIGINAL (for source lookup):
function VI(A, q) {
    if (q) {
        let z = parseInt(q, 10);
        if (!isNaN(z)) return z * 1000
    }
    let K = Math.min(Sb9 * Math.pow(2, A - 1), 32000),
        Y = Math.random() * 0.25 * K;
    return K + Y
}

// READABLE (for understanding):
function calculateBackoffDelay(attemptNumber, retryAfterHeader) {
    // If server provided Retry-After header, use it
    if (retryAfterHeader) {
        let seconds = parseInt(retryAfterHeader, 10);
        if (!isNaN(seconds)) {
            return seconds * 1000;  // Convert to milliseconds
        }
    }

    // Exponential backoff with jitter
    let baseDelay = BASE_DELAY * Math.pow(2, attemptNumber - 1);
    let cappedDelay = Math.min(baseDelay, 32000);  // Cap at 32 seconds
    let jitter = Math.random() * 0.25 * cappedDelay;  // 0-25% jitter

    return cappedDelay + jitter;
}

// Mapping: VI→calculateBackoffDelay, A→attemptNumber, q→retryAfterHeader,
//   Sb9→BASE_DELAY, K→baseDelay, Y→jitter
```

**Why jitter matters:**
- Prevents thundering herd when multiple clients retry simultaneously
- Randomizes retry timing to distribute load
- 25% jitter range is industry standard

### Error Classification Functions

```javascript
// ============================================
// Error Classification Functions
// Location: chunks.89.mjs:131-143
// ============================================

// isOverloadedError (iF6) - Detects 529 or overloaded_error type
function iF6(A) {
    if (!(A instanceof a7)) return !1;
    return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}

// isOAuthRevoked (TN8) - Detects revoked OAuth token
function TN8(A) {
    return A instanceof a7 && A.status === 403 && (A.message?.includes("OAuth token has been revoked") ?? !1)
}

// isFastModeNotEnabled (Cb9) - Detects fast mode unavailability
function Cb9(A) {
    if (!(A instanceof a7)) return !1;
    return A.status === 400 && (A.message?.includes("Fast mode is not enabled") ?? !1)
}

// Mapping: iF6→isOverloadedError, TN8→isOAuthRevoked, Cb9→isFastModeNotEnabled,
//   a7→APIError
```

---

## Cross-Functional Linkage Diagrams

### Module Integration Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLAUDE CODE ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   01_cli/       │
                              │   REPL Input    │
                              └────────┬────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           03_llm_core                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      mainAgentLoop (Yh)                              │   │
│  │                              │                                       │   │
│  │    ┌─────────────────────────┼─────────────────────────────┐         │   │
│  │    │                         │                             │         │   │
│  │    ▼                         ▼                             ▼         │   │
│  │  ┌───────────────┐   ┌───────────────────┐   ┌───────────────────┐   │   │
│  │  │ buildSystem   │   │ assembleAll       │   │ toolDispatcher    │   │   │
│  │  │ Prompt (R0)   │   │ Attachments (_uY) │   │ (Wi6)             │   │   │
│  │  └───────┬───────┘   └─────────┬─────────┘   └─────────┬─────────┘   │   │
│  │          │                     │                       │             │   │
│  │          ▼                     ▼                       ▼             │   │
│  │  ┌───────────────┐   ┌───────────────────┐   ┌───────────────────┐   │   │
│  │  │ System Prompt │   │ Meta Messages     │   │ Tool Results      │   │   │
│  │  │ Blocks        │   │ (isMeta: true)    │   │                   │   │   │
│  │  └───────────────┘   └───────────────────┘   └───────────────────┘   │   │
│  │          │                     │                       │             │   │
│  │          └─────────────────────┼───────────────────────┘             │   │
│  │                                ▼                                     │   │
│  │                    ┌───────────────────────┐                         │   │
│  │                    │   callModel (NT6)     │                         │   │
│  │                    │   LLM API Request     │                         │   │
│  │                    └───────────────────────┘                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ 04_system_reminder│     │ 05_tools          │     │ 07_compact        │
│                   │     │                   │     │                   │
│ • Attachment      │     │ • StreamingTool   │     │ • autoCompact     │
│   Producers       │     │   Executor (ui6)  │     │ • microCompact    │
│ • Normalization   │     │ • Tool schemas    │     │ • Context overflow│
│   (Ui8)           │     │ • Permissions     │     │   recovery        │
│ • Injection       │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
```

### LLM Core ↔ System Reminder Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    mainAgentLoop (Yh) - Attachment Flow                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Turn Start
                                    ▼
                    ┌───────────────────────────────┐
                    │   Tool Execution Complete     │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │                 assembleAllAttachments (_uY)                      │
        │                       chunks.147.mjs:3-18                         │
        │                                                                   │
        │  ┌─────────────────────────────────────────────────────────────┐ │
        │  │ Group 1: User-Dependent (Sequential)                        │ │
        │  │   • RuY: extractAtMentionedFiles                            │ │
        │  │   • SuY: extractMcpResources                                │ │
        │  │   • huY: extractAgentMentions                               │ │
        │  │   [MUST complete before Groups 2/3]                         │ │
        │  └─────────────────────────────────────────────────────────────┘ │
        │                              │                                    │
        │                              ▼                                    │
        │  ┌───────────────────────┐     ┌───────────────────────────────┐ │
        │  │ Group 2: Always       │ ║   │ Group 3: Main-Agent-Only      │ │
        │  │ Computed (Parallel)   │ ║   │ (Parallel with Group 2)       │ │
        │  │                       │ ║   │                               │ │
        │  │ • date_change         │ ║   │ • ide_selection               │ │
        │  │ • changed_files       │ ║   │ • diagnostics                 │ │
        │  │ • nested_memory       │ ║   │ • token_usage                 │ │
        │  │ • plan_mode           │ ║   │ • budget_usd                  │ │
        │  │ • todo_reminders      │ ║   │ • queued_commands             │ │
        │  │ • team_context        │ ║   │                               │ │
        │  └───────────────────────┘ ║   └───────────────────────────────┘ │
        │                              ▼                                    │
        │              Raw Attachment Objects Array                         │
        └───────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │                normalizeAttachmentForAPI (Ui8)                     │
        │                      chunks.174.mjs:3-469                          │
        │                                                                    │
        │   57+ case switch statement:                                       │
        │     • file → tool_use/tool_result blocks                           │
        │     • plan_mode → formatted reminder                               │
        │     • diagnostics → <new-diagnostics> XML                          │
        │     • token_usage → usage stats message                            │
        │     • ... (see reminder_integration.md for full list)              │
        │                                                                    │
        │   wrapWithSystemReminderTags (b5):                                 │
        │     Wraps content in <system-reminder>...</system-reminder>        │
        └───────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │                  attachmentGenerator (Vf6)                         │
        │                       chunks.147.mjs:822                            │
        │                                                                    │
        │   Yields messages for injection into conversation stream           │
        └───────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Messages injected before    │
                    │   next LLM API call           │
                    └───────────────────────────────┘
```

### LLM Core ↔ Tools Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Tool Execution Flow                                      │
└─────────────────────────────────────────────────────────────────────────────┘

LLM Stream Event: content_block_start { type: "tool_use", name: "Read", id: "xxx" }
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │              StreamingToolExecutor (ui6).addTool()                 │
        │                        chunks.148.mjs:21                           │
        │                                                                   │
        │   1. Look up tool definition: dK(toolDefinitions, name)           │
        │   2. Normalize input: PE1(tool, input)                            │
        │   3. Validate: tool.inputSchema.safeParse(input)                  │
        │   4. Check concurrency safety: tool.isConcurrencySafe(data)       │
        │   5. Add to queue with status: "queued"                           │
        └───────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   canExecuteTool(safe)?       │
                    │   chunks.148.mjs:62           │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ TRUE                          │ FALSE
                    ▼                               ▼
        ┌───────────────────────────┐   ┌───────────────────────────────┐
        │ executeTool()             │   │ Wait for current tools        │
        │ chunks.148.mjs:138        │   │ to complete                   │
        │                           │   └───────────────────────────────┘
        │ 1. Create abort clone     │
        │ 2. Call toolDispatcher    │───────────────────────────────────────┐
        │ 3. Collect results        │                                       │
        └───────────────────────────┘                                       │
                                                                            ▼
                                        ┌───────────────────────────────────┐
                                        │ toolDispatcher (Wi6)              │
                                        │ chunks.146.mjs:285                │
                                        │                                   │
                                        │ 1. Find tool definition           │
                                        │ 2. Validate input                 │
                                        │ 3. Run pre-tool hooks (y4q)       │
                                        │ 4. Check permissions              │
                                        │ 5. Execute tool.call()            │
                                        │ 6. Run post-tool hooks            │
                                        │ 7. Return tool_result message     │
                                        └───────────────────────────────────┘
```

### LLM Core ↔ Compact Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Compact Integration Points                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌───────────────────────────────┐
                    │   mainAgentLoop (Yh)          │
                    │   Turn Start                  │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   microCompact (gm)           │
                    │   Remove consecutive dupes    │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   autoCompact (sqq)           │
                    │   Check token threshold       │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Under threshold               │ Over threshold
                    ▼                               ▼
            ┌───────────────┐           ┌───────────────────────────────┐
            │ Continue to   │           │ Generate summary via LLM      │
            │ LLM request   │           │ Replace messages with summary  │
            └───────────────┘           └───────────────────────────────┘
                                                                    │
                                                                    ▼
                                                    ┌───────────────────────────────┐
                                                    │ Context Overflow Recovery     │
                                                    │ in withApiRetry (_P1)         │
                                                    │                               │
                                                    │ On context_length_exceeded:   │
                                                    │ 1. Parse error for tokens     │
                                                    │ 2. Calculate available space  │
                                                    │ 3. Set maxTokensOverride      │
                                                    │ 4. Retry with reduced output  │
                                                    └───────────────────────────────┘
```

---

## Deep Algorithm Analysis

### StreamingToolExecutor (ui6) - Parallel Tool Execution

**Location:** chunks.148.mjs:3-228

**What it does:** The `StreamingToolExecutor` class manages parallel execution of tool calls during LLM streaming. It queues tool calls as they arrive from the stream and executes them in parallel when safe.

**Source Code (VERIFIED):**

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution during streaming
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
    discard() {
        this.discarded = !0
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
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break
        }
    }
    // ... additional methods ...
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
        // Clone abort controller for sibling error propagation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    discard() {
        this.discarded = true;
    }

    addTool(toolUseBlock, assistantMessage) {
        // 1. Look up tool definition
        let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);

        if (!toolDef) {
            // Tool not found - create error result immediately
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

        // 2. Normalize input (handle string->typed conversions)
        toolUseBlock.input = normalizeToolInput(toolDef, toolUseBlock.input);

        // 3. Validate input against schema
        let validationResult = toolDef.inputSchema.safeParse(toolUseBlock.input);

        // 4. Check if tool is concurrency-safe
        let isConcurrencySafe = validationResult?.success
            ? (() => {
                try {
                    return Boolean(toolDef.isConcurrencySafe(validationResult.data));
                } catch {
                    return false;
                }
            })()
            : false;

        // 5. Add to queue
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });

        // 6. Process queue (may execute immediately)
        this.processQueue();
    }

    canExecuteTool(isSafe) {
        let executing = this.tools.filter((t) => t.status === "executing");
        // Can execute if:
        // 1. No tools currently executing, OR
        // 2. This tool is safe AND all executing tools are safe
        return executing.length === 0 ||
               (isSafe && executing.every((t) => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;

            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                // Non-safe tool must wait - stop processing
                break;
            }
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, dK→findToolByName, PE1→normalizeToolInput,
//   Wm→cloneAbortController, p1→createUserMessage
```

**Key Algorithm Decisions:**

1. **Concurrency Safety Check:**
   - Tools declare `isConcurrencySafe(input)` returning boolean
   - Safe tools (Read, Glob, Grep) can run in parallel
   - Unsafe tools (Write, Edit, Bash) must run sequentially

2. **Abort Propagation:**
   - Each executor clones the parent abort controller
   - If one tool fails with error, sibling tools are aborted
   - Prevents cascading failures from parallel execution

3. **Queue Processing:**
   - Tools are queued as `content_block_start` events arrive
   - `processQueue()` is called after each tool addition
   - Non-safe tools block subsequent tools until completion

**Why this approach:**
- Maximizes throughput for read-only operations
- Prevents race conditions for write operations
- Graceful error handling with sibling abort pattern
- Progress reporting via pendingProgress array

---

### executeToolCore (fxY) - Tool Execution Pipeline

**Location:** chunks.146.mjs:442+

**What it does:** The core pipeline for executing a single tool call. Handles input validation, pre-tool hooks, permission checking, tool execution, and post-tool hooks.

**Source Code (VERIFIED):**

```javascript
// ============================================
// executeToolCore - Core tool execution pipeline
// Location: chunks.146.mjs:442-620
// ============================================

// ORIGINAL (for source lookup):
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1
        }), u += I;
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), d("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: u.slice(0, 2000),
            messageID: w,
            toolName: hq(A.name),
            // ... telemetry ...
        }), [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${u}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `InputValidationError: ${J.error.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }]
    }
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) {
        // ... validation failure handling ...
    }
    // ... pre-tool hooks execution ...
    // ... permission checking ...
    // ... tool execution ...
}

// READABLE (for understanding):
async function executeToolCore(
    tool,              // Tool definition object
    toolUseId,         // Unique ID for this tool use
    input,             // Raw input from LLM
    context,           // Session context
    canUseTool,        // Permission check function
    assistantMessage,  // Parent assistant message
    messageId,         // Message UUID for telemetry
    requestId,         // API request ID
    mcpServerType,     // MCP server type if applicable
    mcpServerBaseUrl,  // MCP server URL if applicable
    progressCallback   // Progress notification callback
) {
    // STEP 1: Input Validation
    let validationResult = tool.inputSchema.safeParse(input);
    if (!validationResult.success) {
        let errorMessage = formatValidationError(tool.name, validationResult.error);

        // Check for deferred tool schema issue
        let deferredHint = checkDeferredToolSchema(tool, context.messages, context.options.tools);
        if (deferredHint) {
            logEvent("tengu_deferred_tool_schema_not_sent", {
                toolName: anonymizeToolName(tool.name),
                isMcp: tool.isMcp ?? false
            });
            errorMessage += deferredHint;
        }

        logWarning(`${tool.name} tool input error: ${errorMessage.slice(0, 200)}`);
        logEvent("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: errorMessage.slice(0, 2000),
            messageID: messageId,
            toolName: anonymizeToolName(tool.name),
            isMcp: tool.isMcp ?? false
        });

        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                toolUseResult: `InputValidationError: ${validationResult.error.message}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // STEP 2: Tool-Specific Validation
    let customValidation = await tool.validateInput?.(validationResult.data, context);
    if (customValidation?.result === false) {
        // Tool rejected input with custom error
        // ... handle validation failure ...
    }

    // STEP 3: Pre-Tool Hooks Execution
    let hookPermissionResult;
    let updatedInput = validationResult.data;
    let shouldPreventContinuation = false;
    let stopReason;

    for await (let event of executePreToolHooks(context, tool, updatedInput, toolUseId, assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl)) {
        switch (event.type) {
            case "message":
                if (event.message.message.type === "progress") {
                    progressCallback(event.message.message);
                } else {
                    results.push(event.message);
                }
                break;
            case "hookPermissionResult":
                hookPermissionResult = event.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                updatedInput = event.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = event.shouldPreventContinuation;
                break;
            case "stopReason":
                stopReason = event.stopReason;
                break;
            case "stop":
                return results;  // Hook requested stop
        }
    }

    // STEP 4: Permission Check (or use hook result)
    let permissionResult;
    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.()) {
        logDebug(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        permissionResult = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        logDebug(`Hook denied tool use for ${tool.name}`);
        permissionResult = hookPermissionResult;
    } else {
        permissionResult = await canUseTool(tool, updatedInput, context, assistantMessage, toolUseId);
    }

    // STEP 5: Execute Tool
    if (permissionResult.behavior === "allow") {
        let toolResult = await tool.call(updatedInput, context, progressCallback, abortSignal, hookContext);
        // ... process result ...
    } else {
        // Permission denied
        // ... create error result ...
    }
}

// Mapping: fxY→executeToolCore, A→tool, q→toolUseId, K→input, Y→context,
//   z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//   $→mcpServerType, H→mcpServerBaseUrl, j→progressCallback,
//   V4q→formatValidationError, GxY→checkDeferredToolSchema, d→logEvent,
//   k→logWarning, hq→anonymizeToolName, p1→createUserMessage
```

**Key Algorithm Decisions:**

1. **Two-Stage Validation:**
   - First: Schema validation via `inputSchema.safeParse`
   - Second: Tool-specific `validateInput` for business logic
   - Returns detailed error messages for debugging

2. **Hook Integration:**
   - Pre-tool hooks can modify input, approve/deny, or stop execution
   - Hook results take precedence over normal permission flow
   - Progress events from hooks are forwarded to UI

3. **Deferred Tool Handling:**
   - Detects when tool schema wasn't sent to API
   - Provides helpful error message to load tool first
   - Critical for dynamic tool loading feature

---

### streamingQueryCore (mGq) - LLM API Request Pipeline

**Location:** chunks.171.mjs:3-200

**What it does:** The main async generator that handles the complete LLM API request pipeline including tool schema building, message normalization, streaming, and error handling.

**Source Code (VERIFIED):**

```javascript
// ============================================
// streamingQueryCore - Main LLM API request pipeline
// Location: chunks.171.mjs:3-200
// ============================================

// ORIGINAL (for source lookup):
async function* mGq(A, q, K, Y, z, _) {
    if (!iA() && (await rR("tengu-off-switch", {
            activated: !1
        })).activated && V36(_.model)) {
        d("tengu_off_switch_query", {}), yield oX1(Error(v36), _.model);
        return
    }
    let w = A9z(A),
        O = QA() === "bedrock" && _.model.includes("application-inference-profile") ? await G31(_.model) ?? _.model : _.model;
    K5("query_tool_schema_build_start");
    // ... tool schema building ...
    K5("query_tool_schema_build_end"), d("tengu_api_before_normalize", {
        preNormalizedMessageCount: A.length
    }), K5("query_message_normalization_start");
    let N = cM(A, J);
    // ... message normalization ...
    let u = _9z(q, R, {
        skipGlobalCacheForSystemPrompt: G,
        querySource: _.querySource
    });
    // ... build API request ...
}

// READABLE (for understanding):
async function* streamingQueryCore(
    messages,        // Conversation history
    systemPrompt,    // System prompt sections
    thinkingConfig,  // Thinking mode configuration
    tools,           // Available tools
    signal,          // Abort signal
    options          // Query options
) {
    // STEP 1: Off-Switch Check
    if (!isAPIKeyAuth() &&
        (await getFeatureFlag("tengu-off-switch", { activated: false })).activated &&
        shouldBlockForOffSwitch(options.model)) {
        logEvent("tengu_off_switch_query", {});
        yield createOffSwitchError(new Error(offSwitchMessage), options.model);
        return;
    }

    // STEP 2: Get Previous Request ID (for caching)
    let previousRequestId = getLastAssistantRequestId(messages);

    // STEP 3: Model Resolution (Bedrock inference profiles)
    let resolvedModel = getPlatform() === "bedrock" &&
        options.model.includes("application-inference-profile")
        ? await resolveInferenceProfile(options.model) ?? options.model
        : options.model;

    // STEP 4: Tool Schema Building
    markPerformance("query_tool_schema_build_start");

    // Determine if this is an agentic query
    let isAgenticQuery = options.querySource.startsWith("repl_main_thread") ||
                         options.querySource.startsWith("agent:") ||
                         options.querySource === "sdk" ||
                         options.querySource === "hook_agent" ||
                         options.querySource === "verification_agent";

    // Get betas for this model
    let betas = getModelBetas(options.model, { isAgenticQuery });

    // Check if dynamic tool loading is enabled
    let useDynamicLoading = await shouldUseDynamicLoading(
        options.model,
        tools,
        options.getToolPermissionContext,
        options.agents,
        "query"
    );

    // Filter tools based on dynamic loading
    let filteredTools;
    if (useDynamicLoading) {
        let referencedTools = extractReferencedTools(messages);
        filteredTools = tools.filter((tool) => {
            if (!isDeferredTool(tool)) return true;
            if (isAlwaysLoadTool(tool, DEFERRED_TOOL_MARKER)) return true;
            return referencedTools.has(tool.name);
        });
    } else {
        filteredTools = tools.filter((tool) => !isDeferredTool(tool, DEFERRED_TOOL_MARKER));
    }

    markPerformance("query_tool_schema_build_end");

    // STEP 5: Message Normalization
    logEvent("tengu_api_before_normalize", {
        preNormalizedMessageCount: messages.length
    });

    markPerformance("query_message_normalization_start");
    let normalizedMessages = normalizeMessages(messages, filteredTools);

    // Add deferred tools hint if dynamic loading
    if (useDynamicLoading && !isDisableDeferredToolsHint()) {
        let deferredToolsHint = tools
            .filter(isDeferredTool)
            .map(formatToolHint)
            .sort()
            .join("\n");
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

    markPerformance("query_message_normalization_end");

    // STEP 6: System Prompt Processing
    let enableCaching = options.enablePromptCaching ?? supportsPromptCaching(options.model);
    let systemBlocks = buildSystemPromptBlocks(systemPrompt, enableCaching, {
        skipGlobalCacheForSystemPrompt: hasMcpOrDeferredTools,
        querySource: options.querySource
    });

    // STEP 7: Build API Request
    let toolSchemas = await Promise.all(
        filteredTools.map((tool) => buildToolSchema(tool, {
            getToolPermissionContext: options.getToolPermissionContext,
            tools: tools,
            agents: options.agents,
            allowedAgentTypes: options.allowedAgentTypes,
            model: options.model,
            betas: betas,
            deferLoading: useDynamicLoading && (isDeferredTool(tool) || isLspTool(tool))
        }))
    );

    // STEP 8: Streaming Loop
    // ... SSE event processing ...
}

// Mapping: mGq→streamingQueryCore, A→messages, q→systemPrompt, K→thinkingConfig,
//   Y→tools, z→signal, _→options, iA→isAPIKeyAuth, rR→getFeatureFlag,
//   V36→shouldBlockForOffSwitch, A9z→getLastAssistantRequestId, QA→getPlatform,
//   G31→resolveInferenceProfile, K5→markPerformance, d→logEvent
```

**Key Algorithm Decisions:**

1. **Dynamic Tool Loading:**
   - Only includes tools referenced in conversation
   - Deferred tools marked with special flag
   - Reduces prompt size for large tool sets

2. **Off-Switch Pattern:**
   - Feature flag can disable queries globally
   - Checked before any expensive operations
   - Returns friendly error message

3. **Bedrock Inference Profile Resolution:**
   - Bedrock models use inference profiles
   - Profile ARN resolved dynamically
   - Falls back to model name if resolution fails

---

## Summary

The LLM Core in Claude Code 2.1.76 represents a sophisticated balance between:

1. **Performance**: Streaming, parallel tool execution, and prompt caching minimize latency
2. **Reliability**: Comprehensive error handling, retry logic, and fallback mechanisms
3. **Flexibility**: Support for multiple models, thinking modes, effort levels, and custom prompts
4. **Observability**: Extensive telemetry tracking for monitoring and debugging

The system scales from basic conversations to complex multi-turn interactions with tool execution, plan mode, and team collaboration.
