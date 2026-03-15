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

## Summary

The LLM Core in Claude Code 2.1.76 represents a sophisticated balance between:

1. **Performance**: Streaming, parallel tool execution, and prompt caching minimize latency
2. **Reliability**: Comprehensive error handling, retry logic, and fallback mechanisms
3. **Flexibility**: Support for multiple models, thinking modes, effort levels, and custom prompts
4. **Observability**: Extensive telemetry tracking for monitoring and debugging

The system scales from basic conversations to complex multi-turn interactions with tool execution, plan mode, and team collaboration.
