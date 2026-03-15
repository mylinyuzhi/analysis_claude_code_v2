# Module: LLM Core & Prompt Building (03/04)

## Overview

The LLM Core is the "brain" of Claude Code, responsible for orchestrating the conversation loop, managing tool schemas, building complex system prompts, and handling API requests with adaptive features like thinking and effort levels.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `llmRequestGenerator` (lOq) - Main async generator for LLM API requests and stream handling.
- `getSystemPrompt` (cq6) - Returns the appropriate base system prompt based on environment.
- `getAttributionHeader` (lq6) - Generates the versioned billing/attribution header.
- `buildSystemPromptWithCache` (F9z) - Assembles system prompts and injects cache control markers.
- `withApiRetry` (V26) - Wrapper for API calls with automatic retry and model fallback logic.

**Cross-References:**
- Model selection and resolution: [01_cli/model_selection.md](../01_cli/model_selection.md)
- Effort levels and thinking mode: [19_think_level/effort_control.md](../19_think_level/effort_control.md)
- Proactive mode simplified prompts: [03_llm_core/proactive_mode.md](proactive_mode.md)

---

## Core Algorithms

### LLM Request Generation & Adaptive Configuration

**What it does:**
`llmRequestGenerator` (lOq) prepares the entire payload for the Anthropic Messages API, including message normalization, tool schema construction, prompt caching markers, and beta header selection. It then manages the streaming response.

**How it works:**
1.  **Tool Context Evaluation**: It checks if "Dynamic Tool Loading" (Deferred Tools) should be used based on the model and current state.
2.  **Global Cache Selection**:
    - If enabled, it determines if caching should be `tool_based` or `system_prompt` based.
    - For `tool_based` caching, it identifies a "stable" tool (the last non-MCP tool) to attach the `cache_control: { type: "ephemeral" }` marker.
3.  **Prompt Assembly**:
    - Combines the attribution header, base system prompt, and any extra prompts.
    - Injects available deferred tools into the message history if applicable.
4.  **Beta Header & Adaptive Feature Selection**:
    - **Adaptive Thinking**: If the model supports it, sets `thinking: { type: "adaptive" }` and adds the `adaptive-thinking-2026-01-28` beta.
    - **Effort Levels**: Injects `output_config: { effort: value }` and the `effort-2025-11-24` beta.
    - **Adaptive Fast Mode**: If eligible, adds the `research-preview-2026-02` beta.
5.  **Streaming & Stall Detection**:
    - Initiates the API call via `withApiRetry`.
    - Monitors the stream for "stalls" (gaps > 30s) and reports them to telemetry.
    - Yields events (text deltas, thinking blocks, tool uses) back to the main agent loop.

**Why this approach:**
- **Context Optimization**: By only loading relevant tools and using ephemeral caching, it minimizes token usage and latency.
- **Resilience**: The stall detection and retry logic ensure the agent remains responsive even under network instability.
- **Future-Proofing**: The adaptive thinking and effort systems allow the agent to leverage advanced model capabilities dynamically.

**Key insight:** The use of "Tool-Based Global Cache Markers" is a clever way to ensure that the bulk of the system prompt and tool definitions remain cached even when MCP tools (which might be dynamic) are present.

---

## Code Implementation (Deobfuscated)

### llmRequestGenerator - Main API Request orchestrator
// Location: chunks.169.mjs:739-1038 (partial)

// ORIGINAL (for source lookup):
```javascript
async function* lOq(A, q, K, Y, z, w) {
    // ... logic for tool schema building, message normalization, system prompt assembly ...
    let O1 = (z1) => {
        let Y1 = [...$], $1 = vw6(_1), G1 = { ...$1.output_config ?? {} };
        let L1 = Sn7() ?? w.effortValue ?? p17(w.model);
        if (x9z(L1, G1, $1, Y1, w.model), w.outputFormat && !("format" in G1)) {
            if (G1.format = w.outputFormat, !Y1.includes(hl)) Y1.push(hl)
        }
        if (K !== 0)
            if (ok7(w.model)) {
                if ($1.thinking = { type: "adaptive" }, !Y1.includes($L6)) Y1.push($L6);
            } else {
                x1 = { budget_tokens: A6, type: "enabled" }
            }
        // ... build return object ...
    };
    // ... stream handling ...
}
```

// READABLE (for understanding):
```javascript
/**
 * Main generator for LLM requests
 * @param {Array} history - Message history
 * @param {Array} systemPrompts - Initial system prompts
 * @param {number} maxThinkingTokens - Thinking budget
 * @param {Array} toolset - Available tools
 * @param {AbortSignal} signal - Abort signal
 * @param {Object} options - Model and execution options
 */
async function* llmRequestGenerator(history, systemPrompts, maxThinkingTokens, toolset, signal, options) {
    // 1. Prepare Beta Headers
    let betas = getBetaHeaders(options.model);
    
    // 2. Dynamic Tool Filtering
    let useDynamicLoading = await shouldUseDynamicToolLoading(options.model, toolset);
    let filteredTools = filterToolsForContext(toolset, useDynamicLoading);
    
    // 3. Prompt Caching Logic
    let useGlobalCache = isPromptCachingEnabled() && (hasMcpTools || hasSearchTool);
    if (useGlobalCache) betas.push(BETA_GLOBAL_CACHE);
    
    // 4. Build System Prompt
    let fullSystemPrompt = [
        getAttributionHeader(calculatePromptHash(history)),
        getSystemPrompt(options),
        ...systemPrompts
    ].filter(Boolean);
    
    // 5. Payload Builder (Internal)
    const buildPayload = (requestOptions) => {
        let currentBetas = [...betas];
        let outputConfig = {};
        
        // Effort Level Configuration
        let effort = getEffortLevel() || options.effortValue;
        configureEffort(effort, outputConfig, currentBetas, options.model);
        
        // Adaptive Thinking Configuration
        if (maxThinkingTokens !== 0) {
            if (isAdaptiveThinkingSupported(options.model)) {
                outputConfig.thinking = { type: "adaptive" };
                currentBetas.push(BETA_ADAPTIVE_THINKING);
            } else {
                outputConfig.thinking = { 
                    type: "enabled", 
                    budget_tokens: maxThinkingTokens 
                };
            }
        }
        
        return {
            model: options.model,
            messages: normalizeMessages(history),
            system: buildSystemPromptWithCache(fullSystemPrompt),
            tools: filteredTools.map(t => getToolSchema(t)),
            betas: currentBetas,
            max_tokens: options.maxTokens || 4096,
            ...outputConfig
        };
    };
    
    // 6. Execute Request & Handle Stream
    let client = createLlmClient(options);
    let stream = await withApiRetry(async () => {
        return client.beta.messages.create({ ...buildPayload(options), stream: true });
    });
    
    for await (const event of stream) {
        // ... Yield deltas and handle stalls ...
        yield event;
    }
}
```

// Mapping: lOq→llmRequestGenerator, A→history, q→systemPrompts, K→maxThinkingTokens, Y→toolset, z→signal, w→options, $L6→BETA_ADAPTIVE_THINKING, hl→BETA_STRUCTURED_OUTPUTS

---

### getSystemPrompt - Contextual Base Prompt
// Location: chunks.47.mjs:2470-2477

// ORIGINAL (for source lookup):
```javascript
function cq6(A) {
    if (E4() === "vertex") return B7A;
    if (A?.isNonInteractive) {
        if (A.hasAppendSystemPrompt) return t17;
        return e17
    }
    return B7A
}
```

// READABLE (for understanding):
```javascript
function getSystemPrompt(options) {
    const PROMPT_STANDARD = "You are Claude Code, Anthropic's official CLI for Claude.";
    const PROMPT_SDK_APPEND = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.";
    const PROMPT_SDK_BASE = "You are a Claude agent, built on Anthropic's Claude Agent SDK.";

    if (getPlatform() === "vertex") return PROMPT_STANDARD;
    
    if (options?.isNonInteractive) {
        if (options.hasAppendSystemPrompt) {
            return PROMPT_SDK_APPEND;
        }
        return PROMPT_SDK_BASE;
    }
    
    return PROMPT_STANDARD;
}
```

// Mapping: cq6→getSystemPrompt, A→options, B7A→PROMPT_STANDARD, t17→PROMPT_SDK_APPEND, e17→PROMPT_SDK_BASE

---

## withApiRetry - Adaptive Retry Wrapper

### Algorithm Deep Dive

**What it does:** Wraps any API operation in an async generator that implements exponential backoff, fast mode degradation, context overflow recovery, rate limit handling, and fallback model support. Is itself an async generator so it can yield retry warning messages to the UI.

**How it works:**

The retry loop runs `maxRetries + 1` times. `maxRetries` is model-dependent (fetched via `Cq9`). On each iteration:

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

```javascript
// ============================================
// withApiRetry - Adaptive retry with backoff, context overflow, fast mode degradation
// Location: chunks.72.mjs:1861-1951
// ============================================

// ORIGINAL (for source lookup):
async function* V26(A, q, K) {
  let Y = Cq9(K), z = {model: K.model, maxThinkingTokens: K.maxThinkingTokens, ...i4() ? {fastMode: K.fastMode} : {}},
    w = null, H = 0, $;
  for (let O = 1; O <= Y + 1; O++) {
    if (K.signal?.aborted) throw new Oz;
    let _ = i4() ? z.fastMode && !Kv() : !1;
    try {
      if (w === null || $ instanceof k4 && $.status === 401 || wv7($)) {
        if ($ instanceof k4 && $.status === 401) { let J = a4()?.accessToken; if (J) await EO1(J) }
        w = await A()
      }
      return await q(w, O, z)
    } catch (J) {
      if ($ = J, _ && J instanceof k4 && (J.status === 429 || Kv7(J))) {
        let M = J.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
        if (M !== null && M !== void 0) { Z17(M), z.fastMode = !1; continue }
        let P = xq9(J);
        if (P !== null && P < hq9) { await dS(P, K.signal); continue }
        let W = Math.max(P ?? Sq9, Iq9);
        if (P17(Date.now() + W), i4()) z.fastMode = !1; continue
      }
      if (_ && Lq9(J)) { W17(), z.fastMode = !1; continue }
      if (Kv7(J) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !i8() && p_1(K.model))) {
        if (H++, H >= Eq9) {
          if (K.fallbackModel) throw c("tengu_api_opus_fallback_triggered", {...});
          if (!process.env.IS_SANDBOX) throw new qB(Error(tHA), z)
        }
      }
      if (O > Y) throw new qB(J, z);
      if (!Rq9(J) && (!(J instanceof k4) || !yq9(J))) throw new qB(J, z);
      if (J instanceof k4) {
        let M = zv7(J);
        if (M) {
          let {inputTokens: P, contextLimit: W} = M, G = 1000, f = Math.max(0, W - P - 1000);
          if (f < K$A) throw K1(Error(`availableContext ${f} < FLOOR_OUTPUT_TOKENS`)), J;
          let Z = (z.maxThinkingTokens || 0) + 1, N = Math.max(K$A, f, Z);
          z.maxTokensOverride = N, c("tengu_max_tokens_context_overflow_adjustment", {...}); continue
        }
      }
      let D = Yv7(J), j = cU(O, D);
      if (J instanceof k4) yield Hv7(J, j, O, Y);
      c("tengu_api_retry", {...}); await dS(j, K.signal)
    }
  }
  throw new qB($, z)
}

// READABLE (for understanding):
async function* withApiRetry(clientFactory, operation, retryConfig) {
  let maxRetries = getMaxRetriesForModel(retryConfig);
  let retryContext = { model: retryConfig.model, maxThinkingTokens: retryConfig.maxThinkingTokens,
    ...(isFastModeAvailable() ? { fastMode: retryConfig.fastMode } : {}) };
  let client = null, fallbackAttempts = 0, lastError;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    if (retryConfig.signal?.aborted) throw new AbortError();
    let fastModeActive = isFastModeAvailable() ? retryContext.fastMode && !isRateLimited() : false;
    try {
      // (Re-)initialize client on first attempt or after auth/credential failure
      if (client === null || (lastError instanceof ApiError && lastError.status === 401) || isBedrockAuthExpired(lastError)) {
        if (lastError instanceof ApiError && lastError.status === 401) {
          let token = getStoredOAuthToken()?.accessToken;
          if (token) await refreshOAuthToken(token);
        }
        client = await clientFactory();
      }
      return await operation(client, attempt, retryContext);   // ← SUCCESS: return result
    } catch (error) {
      lastError = error;
      // Fast mode: rate limit or overload → disable fast mode and retry
      if (fastModeActive && error instanceof ApiError && (error.status === 429 || isOverloadError(error))) {
        let overageReason = error.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
        if (overageReason != null) { recordOverageReason(overageReason); retryContext.fastMode = false; continue; }
        let retryAfterMs = parseRetryAfterHeader(error);
        if (retryAfterMs != null && retryAfterMs < MAX_SERVER_DELAY) { await delay(retryAfterMs, retryConfig.signal); continue; }
        let backoff = Math.max(retryAfterMs ?? DEFAULT_BACKOFF, MIN_BACKOFF);
        recordRateLimitUntil(Date.now() + backoff);
        if (isFastModeAvailable()) retryContext.fastMode = false;
        continue;
      }
      // Fast mode compatibility failure → disable and retry
      if (fastModeActive && isFastModeCompatibilityError(error)) { clearFastModeCache(); retryContext.fastMode = false; continue; }
      // Overload → attempt fallback model
      if (isOverloadError(error) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || (!isLocalMode() && isOpusModel(retryConfig.model)))) {
        if (++fallbackAttempts >= MAX_FALLBACK_ATTEMPTS) {
          if (retryConfig.fallbackModel) throw recordMetric("tengu_api_opus_fallback_triggered", {}); // triggers fallback
          if (!process.env.IS_SANDBOX) throw new RetryExhaustedError("Model overloaded", retryContext);
        }
      }
      if (attempt > maxRetries) throw new RetryExhaustedError(error, retryContext);
      if (!isRetryableError(error) && (!(error instanceof ApiError) || !isTemporaryHttpError(error)))
        throw new RetryExhaustedError(error, retryContext);
      // Context overflow: parse and adjust max_tokens
      if (error instanceof ApiError) {
        let contextInfo = parseContextOverflowError(error);
        if (contextInfo) {
          let { inputTokens, contextLimit } = contextInfo;
          let available = Math.max(0, contextLimit - inputTokens - 1000);  // 1000 token buffer
          if (available < FLOOR_OUTPUT_TOKENS) throw error;  // No room even for minimal response
          retryContext.maxTokensOverride = Math.max(FLOOR_OUTPUT_TOKENS, available, (retryContext.maxThinkingTokens || 0) + 1);
          recordMetric("tengu_max_tokens_context_overflow_adjustment", { inputTokens, contextLimit, maxTokensOverride: retryContext.maxTokensOverride });
          continue;  // ← RETRY with reduced max_tokens
        }
      }
      // Exponential backoff with retry-after header respect
      let retryAfterMs = extractRetryAfterMs(error);
      let delayMs = calculateExponentialBackoff(attempt, retryAfterMs);
      if (error instanceof ApiError) yield buildRetryNoticeMessage(error, delayMs, attempt, maxRetries);
      recordMetric("tengu_api_retry", { model: retryConfig.model, attempt, delayMs });
      await delay(delayMs, retryConfig.signal);
    }
  }
  throw new RetryExhaustedError(lastError, retryContext);
}

// Mapping: V26→withApiRetry, A→clientFactory, q→operation, K→retryConfig,
//   z→retryContext, Cq9→getMaxRetriesForModel, Kv7→isOverloadError, xq9→parseRetryAfterHeader,
//   dS→delay, zv7→parseContextOverflowError, K$A→FLOOR_OUTPUT_TOKENS, cU→calculateExponentialBackoff,
//   qB→RetryExhaustedError, Rq9→isRetryableError, yq9→isTemporaryHttpError
```

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

```javascript
// ============================================
// buildSystemPromptWithCache - Converts prompt strings to cached API blocks
// Location: chunks.169.mjs:1394-1406
// ============================================

// ORIGINAL (for source lookup):
function F9z(A, q, K) {
  return nSA(A, {skipGlobalCacheForSystemPrompt: K?.skipGlobalCacheForSystemPrompt})
    .map((Y) => ({
      type: "text",
      text: Y.text,
      ...q && Y.cacheScope !== null ? {cache_control: s91(Y.cacheScope)} : {}
    }))
}

// READABLE (for understanding):
function buildSystemPromptWithCache(systemPromptStrings, cachingEnabled, options) {
  // Split into sections with cache scope annotations
  return splitSystemPromptBySections(systemPromptStrings, {
    skipGlobalCacheForSystemPrompt: options?.skipGlobalCacheForSystemPrompt
  }).map((section) => ({
    type: "text",
    text: section.text,
    // Only add cache_control if caching enabled AND this section is cacheable
    ...(cachingEnabled && section.cacheScope !== null
      ? { cache_control: createCacheControl(section.cacheScope) }
      : {})
  }));
}

// Mapping: F9z→buildSystemPromptWithCache, A→systemPromptStrings, q→cachingEnabled,
//   K→options, nSA→splitSystemPromptBySections, s91→createCacheControl
```

**Why this approach:**
- The system prompt can be 4000+ tokens. Without caching, these tokens are re-processed on every API call, adding latency and cost.
- By placing a cache boundary at the end of the static sections (persona, tool policy, coding guidelines), the stable content is cached while dynamic sections (memory content, MCP instructions, environment info) are re-sent each turn.
- The `skipGlobalCacheForSystemPrompt` option disables even the local cache — used in scenarios where prompt content is fully dynamic (e.g., compaction summary requests).

**Key insight:** The global cache (`tengu_system_prompt_global_cache` feature flag) places a special `xG1` marker string at the end of the prompt. `nSA` recognizes this marker as a cache boundary and assigns `cacheScope: "global"` to everything after it. This creates a two-tier system: the base prompt is globally cached (across all users), while dynamic injections (memory, MCP, env) are not cached at all.

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

```javascript
// ============================================
// processContentBlocks - Normalizes LLM output content after streaming completes
// Location: chunks.173.mjs:278-313
// ============================================

// ORIGINAL (for source lookup):
function JT6(A, q, K) {
  if (!A) return [];
  return A.map((Y) => {
    switch (Y.type) {
      case "tool_use": {
        if (typeof Y.input !== "string" && !WO(Y.input)) throw Error("Tool use input must be a string or object");
        let z = typeof Y.input === "string" ? j9(Y.input) ?? {} : Y.input;
        if (typeof z === "object" && z !== null) {
          let w = q.find((H) => H.name === Y.name);
          if (w) try { z = R1q(w, z, K) } catch (H) { K1(Error("Error normalizing tool input: " + H)) }
        }
        return {...Y, input: z}
      }
      case "text":
        if (Y.text.trim().length === 0) c("tengu_model_whitespace_response", {length: Y.text.length});
        return Y;
      case "code_execution_tool_result": case "mcp_tool_use": case "mcp_tool_result":
      case "container_upload": case "server_tool_use":
        return Y;
      default: return Y
    }
  })
}

// READABLE (for understanding):
function processContentBlocks(contentBlocks, toolSchemas, agentId) {
  if (!contentBlocks) return [];
  return contentBlocks.map((block) => {
    switch (block.type) {
      case "tool_use": {
        // Validate: input must be string (accumulated JSON) or already-parsed object
        if (typeof block.input !== "string" && !isPlainObject(block.input))
          throw Error("Tool use input must be a string or object");
        // Parse JSON string → object; fall back to {} if invalid JSON
        let parsed = typeof block.input === "string" ? parseJson(block.input) ?? {} : block.input;
        // Schema validation: coerce types, apply defaults
        if (typeof parsed === "object" && parsed !== null) {
          let matchingTool = toolSchemas.find(t => t.name === block.name);
          if (matchingTool) {
            try { parsed = normalizeToolInput(matchingTool, parsed, agentId); }
            catch (err) { recordError(Error("Error normalizing tool input: " + err)); }
            // Note: normalization failure is non-fatal; raw parsed input is used
          }
        }
        return { ...block, input: parsed };
      }
      case "text":
        // Log but don't reject whitespace-only responses (model can emit these intentionally)
        if (block.text.trim().length === 0)
          recordMetric("tengu_model_whitespace_response", { length: block.text.length });
        return block;
      // Pass-through: MCP tools, code execution, server tools, container uploads
      default: return block;
    }
  });
}

// Mapping: JT6→processContentBlocks, A→contentBlocks, q→toolSchemas, K→agentId,
//   j9→parseJson, R1q→normalizeToolInput, WO→isPlainObject, K1→recordError
```

**Why this approach:**
- Tool inputs arrive as concatenated `partial_json` strings. JSON cannot be parsed incrementally, so parsing is deferred until the block is complete.
- The Zod schema normalization step ensures that even if the model emits technically valid JSON that doesn't match the tool's expected types (e.g., `"true"` instead of `true`), the input is coerced to the correct type before execution.
- Non-fatal normalization errors prevent a single malformed tool call from crashing the entire agent turn.

**Key insight:** The `parseJson(input) ?? {}` fallback means that if the model emits syntactically invalid JSON (which can happen if streaming was interrupted), the tool still gets called with an empty input object. This allows the tool to return a "missing required parameter" error rather than crashing the process.

---

## calculateCost - Token Pricing Model

### Pricing Tier Lookup

**What it does:** Computes the USD cost for a given model and usage statistics by looking up the model's pricing tier and multiplying token counts by per-token rates.

**How it works:**

1. `oZ5` (lookupPricingTier) identifies the pricing object for the model:
   - Gets model short name via `v_` (e.g., "claude-opus-4-6" → "opus-4-6")
   - For first-party models (Anthropic direct API), applies conditional pricing:
     - `research_preview_2026_02` flag → research preview pricing
     - `x17(usage) > 200000` → high-volume pricing tier
   - For other models: looks up in `xq6` pricing table
   - If model unknown: logs telemetry and falls back to default pricing
2. `rZ5` (computeUsdCost) multiplies each token count by its per-million rate:
   ```
   cost = (inputTokens / 1M × inputRate)
        + (outputTokens / 1M × outputRate)
        + (cacheReadTokens / 1M × cacheReadRate)
        + (cacheCreationTokens / 1M × cacheWriteRate)
        + (webSearchRequests × webSearchRate)
   ```

```javascript
// ============================================
// calculateCost + computeUsdCost - USD cost calculation
// Location: chunks.47.mjs:1605 (calculateCost), chunks.47.mjs:1573 (computeUsdCost)
// ============================================

// ORIGINAL (for source lookup):
function bq6(A, q) { let K = oZ5(A, q); return rZ5(K, q) }

function rZ5(A, q) {
  return q.input_tokens / 1e6 * A.inputTokens +
    q.output_tokens / 1e6 * A.outputTokens +
    (q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens +
    (q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens +
    (q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}

function oZ5(A, q) {
  let K = v_(A);
  if (K === v_(yn.firstParty)) {
    let z = q.research_preview_2026_02 !== void 0, w = x17(q) > 200000;
    return _r(w, z)
  }
  let Y = xq6[K];
  if (!Y) return b17(A, K), xq6[v_(m17)];
  if (x17(q) > 200000) {
    if (Y === K71) return k7A;
    if (Y === Y71) return B17;
    b17(A, K)
  }
  return Y
}

// READABLE (for understanding):
function calculateCost(modelName, usageStats) {
  let pricingTier = lookupPricingTier(modelName, usageStats);
  return computeUsdCost(pricingTier, usageStats);
}

function computeUsdCost(pricing, usage) {
  return (usage.input_tokens / 1_000_000 * pricing.inputTokens)
    + (usage.output_tokens / 1_000_000 * pricing.outputTokens)
    + ((usage.cache_read_input_tokens ?? 0) / 1_000_000 * pricing.promptCacheReadTokens)
    + ((usage.cache_creation_input_tokens ?? 0) / 1_000_000 * pricing.promptCacheWriteTokens)
    + ((usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests);
}

function lookupPricingTier(modelName, usage) {
  let shortName = getModelShortName(modelName);
  if (shortName === getModelShortName(FIRST_PARTY_MODEL)) {
    // First-party: apply research preview or high-volume pricing if applicable
    let isResearchPreview = usage.research_preview_2026_02 !== undefined;
    let isHighVolume = totalTokenCount(usage) > 200_000;
    return getFirstPartyPricing(isHighVolume, isResearchPreview);
  }
  let tier = pricingTable[shortName];
  if (!tier) { recordUnknownModelTelemetry(modelName, shortName); return pricingTable[DEFAULT_MODEL_SHORT]; }
  if (totalTokenCount(usage) > 200_000) {
    if (tier === SONNET_PRICING) return SONNET_HIGH_VOLUME;
    if (tier === HAIKU_PRICING) return HAIKU_HIGH_VOLUME;
    recordUnknownModelTelemetry(modelName, shortName);
  }
  return tier;
}

// Mapping: bq6→calculateCost, rZ5→computeUsdCost, oZ5→lookupPricingTier,
//   A→modelName, q→usage/pricing, xq6→pricingTable, x17→totalTokenCount,
//   _r→getFirstPartyPricing, yn.firstParty→FIRST_PARTY_MODEL
```

**Why this approach:**
- Volume thresholds (200k tokens) exist because Anthropic charges different rates for high-context requests (longer prompts have different infrastructure costs).
- Web search requests are billed per-request (not per token) because they have fixed server-side costs.
- Unknown models fall back to default pricing rather than returning $0 — this prevents accidentally reporting free usage for new/custom models.

**Key insight:** The `research_preview_2026_02` field in usage comes from the new research preview beta introduced in 2.1.38's "Adaptive Fast Mode" feature. When this beta is active, the usage object from the API includes this field, and the pricing tier switches to the research preview rate (which may differ from standard rates to reflect the experimental nature of the feature).
