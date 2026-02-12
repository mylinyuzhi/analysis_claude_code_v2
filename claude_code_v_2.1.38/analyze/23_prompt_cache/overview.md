# Prompt Cache System

## Overview

Claude Code implements a sophisticated prompt caching strategy to minimize token re-processing costs when making repeated API calls. The system places `cache_control` markers on specific message and system prompt segments, allowing the Anthropic API to reuse previously processed token prefixes rather than recomputing them from scratch.

The caching system operates at three distinct layers:
1. **System prompt caching** -- splitting the system prompt into stable/dynamic segments with appropriate cache scopes
2. **Message-level caching** -- placing cache breakpoints on recent conversation messages
3. **Tool schema caching** -- caching stable tool definitions via a designated "cache marker" tool

A prompt hash (`A67`) is also computed for billing attribution, using characters from the first user message combined with the application version.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `createCacheControl` (s91) - Builds a cache_control directive object
- `isPromptCachingEnabled` (pOq) - Checks if prompt caching is active for a given model
- `applyCacheBreakpointsToMessages` (m9z) - Adds cache markers to conversation messages
- `buildSystemPromptWithCache` (F9z) - Converts system prompt strings into cache-annotated blocks
- `splitSystemPromptForCache` (nSA) - Splits system prompt into segments with cache scope assignments
- `calculatePromptHash` (A67) - Computes a short hash for billing attribution
- `getFirstUserMessage` (Zf5) - Extracts the first user message text for hash input
- `hashWithSalt` (m7A) - SHA-256 hash helper for prompt hashing
- `formatUserMessageForCache` (b9z) - Formats a user message with optional cache_control
- `formatAssistantMessageForCache` (u9z) - Formats an assistant message with optional cache_control
- `validateApiKey` (cOq) - Tests an API key by making a minimal API call

---

## Cache Architecture

### What Gets Cached and Why

The Anthropic Messages API supports prompt caching by recognizing `cache_control` markers on content blocks. When the same token prefix is encountered across requests, the API can skip re-processing those tokens, resulting in:
- **Cost reduction**: Cached input tokens are billed at a fraction of the normal rate
- **Latency reduction**: Less computation per request when cache hits occur

Claude Code strategically places these markers on three categories of content:

1. **System prompt blocks** -- The system prompt is the most stable part of the request. It only changes when the model, tools, or configuration changes. Most of it can be cached "globally" (shared across all sessions for an organization) or at "org" scope.

2. **Recent conversation messages** -- The last few messages (specifically, the last 3 messages by index) receive cache breakpoints. This is because earlier messages are stable across successive turns, while the most recent ones are new.

3. **Tool definitions** -- When MCP tools or deferred tools are in use, a single stable tool is designated as the "cache marker" tool to anchor the tool schema cache.

### Cache Scopes

The system supports multiple cache scopes:
- **No scope** (default `ephemeral`): Standard per-session caching with a 5-minute TTL
- **`global` scope**: Shared across all sessions and users within the organization; requires the `prompt-caching-scope-2026-01-05` beta
- **`org` scope**: Shared within an organization, used for system prompt blocks

### TTL Behavior

The cache TTL varies by authentication context:

```javascript
// ============================================
// createCacheControl - Builds a cache_control directive with optional TTL and scope
// Location: chunks.169.mjs:554-563
// ============================================

// ORIGINAL (for source lookup):
function s91(A) {
    return {
        type: "ephemeral",
        ...i8() && !Pv.isUsingOverage ? { ttl: "1h" } : {},
        ...A === "global" ? { scope: A } : {}
    }
}

// READABLE (for understanding):
function createCacheControl(cacheScope) {
    return {
        type: "ephemeral",
        // OAuth users NOT on overage get extended 1-hour TTL
        // API key users and overage users get default 5-minute TTL
        ...isOAuthUser() && !rateLimitState.isUsingOverage ? { ttl: "1h" } : {},
        // Only include scope if explicitly "global"
        ...cacheScope === "global" ? { scope: cacheScope } : {}
    }
}

// Mapping: s91->createCacheControl, A->cacheScope, i8->isOAuthUser, Pv->rateLimitState
```

**Why this approach:**
- OAuth subscription users (Pro, Max, Enterprise, Team) who are NOT in overage mode get a 1-hour cache TTL. This is a significant cost optimization because these users have predictable, sustained usage patterns where longer caches yield greater savings.
- API key users and overage users get the default 5-minute TTL, which is more conservative since their usage patterns are less predictable and overage billing is different.
- The `global` scope is only applied when explicitly requested, because global caches are shared across sessions and must only contain truly stable content (like the core system prompt).

**Key insight:** The TTL decision is tightly coupled to the billing model. Longer caches reduce costs but risk serving stale content. The 1-hour TTL is safe because the system prompt and tool definitions are stable within a session, and the cache is invalidated if any prefix content changes.

---

## Prompt Caching Enable/Disable Logic

### isPromptCachingEnabled (pOq)

**What it does:** Determines whether prompt caching should be enabled for a given model, checking multiple environment variable overrides.

**How it works:**
1. If `DISABLE_PROMPT_CACHING` is truthy, caching is disabled for ALL models
2. If `DISABLE_PROMPT_CACHING_HAIKU` is truthy and the requested model is the Haiku model, caching is disabled
3. If `DISABLE_PROMPT_CACHING_SONNET` is truthy and the requested model is the Sonnet model, caching is disabled
4. If `DISABLE_PROMPT_CACHING_OPUS` is truthy and the requested model is the Opus model, caching is disabled
5. Otherwise, caching is enabled

```javascript
// ============================================
// isPromptCachingEnabled - Per-model prompt caching gate
// Location: chunks.169.mjs:537-552
// ============================================

// ORIGINAL (for source lookup):
function pOq(A) {
    if (J6(process.env.DISABLE_PROMPT_CACHING)) return !1;
    if (J6(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
        let q = _J(); if (A === q) return !1
    }
    if (J6(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
        let q = jL(); if (A === q) return !1
    }
    if (J6(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
        let q = _u(); if (A === q) return !1
    }
    return !0
}

// READABLE (for understanding):
function isPromptCachingEnabled(model) {
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING)) return false;
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
        if (model === getHaikuModel()) return false;
    }
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
        if (model === getSonnetModel()) return false;
    }
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
        if (model === getOpusModel()) return false;
    }
    return true;
}

// Mapping: pOq->isPromptCachingEnabled, A->model, J6->parseBoolean, _J->getHaikuModel, jL->getSonnetModel, _u->getOpusModel
```

**Why per-model controls:** Different models have different cache pricing. For development/testing scenarios, disabling caching on specific models allows operators to compare cached vs uncached performance and costs.

---

## Prompt Hash Calculation

### calculatePromptHash (A67)

**What it does:** Generates a short 3-character hex hash used for billing attribution, embedded in the `x-anthropic-billing-header`.

**How it works:**
1. Extract the first user message text from the conversation
2. Pick characters at positions 4, 7, and 20 from that text (or "0" if out of bounds)
3. Concatenate a salt (`Gf5` = `"59cf53e54c78"`), the 3-character substring, and the version string
4. SHA-256 hash the result and take the first 3 hex characters

```javascript
// ============================================
// calculatePromptHash - Generate billing attribution hash from conversation
// Location: chunks.47.mjs:2528-2537
// ============================================

// ORIGINAL (for source lookup):
function A67(A) {
    let q = Zf5(A);
    return m7A(q, { VERSION: "2.1.38", ... }.VERSION)
}

// READABLE (for understanding):
function calculatePromptHash(messages) {
    let firstUserText = getFirstUserMessage(messages);
    return hashWithSalt(firstUserText, "2.1.38");
}

// Mapping: A67->calculatePromptHash, Zf5->getFirstUserMessage, m7A->hashWithSalt
```

**Why this approach:** The hash provides a lightweight fingerprint of the conversation for billing analytics without exposing the actual content. By sampling only 3 specific character positions, the hash is privacy-preserving while still providing enough entropy to distinguish different conversations.

---

## Integration with LLM Request Building

The caching system is integrated into the main LLM query flow (`lOq` function) in `chunks.169.mjs`:

1. **System prompt path**: `buildSystemPromptWithCache` (F9z) calls `splitSystemPromptForCache` (nSA) to partition the system prompt into blocks with cache scopes, then wraps each block in `{ type: "text", text: ..., cache_control: ... }`.

2. **Message path**: `applyCacheBreakpointsToMessages` (m9z) iterates over normalized messages. For messages in the last 3 positions (`index > messages.length - 3`), it applies `cache_control` via `formatUserMessageForCache` (b9z) or `formatAssistantMessageForCache` (u9z).

3. **Tool path**: When global caching is enabled with MCP tools, the last non-MCP, non-deferred tool is designated as the cache marker tool, and its schema receives `cache_control: createCacheControl("global")`.

4. **Beta activation**: If global caching features are used, the `prompt-caching-scope-2026-01-05` beta string (`tV1`) is added to the request betas array.

### Usage Tracking

Cache performance is tracked via two token counters in the API response:
- `ephemeral_1h_input_tokens` -- Tokens cached with 1-hour TTL (OAuth users)
- `ephemeral_5m_input_tokens` -- Tokens cached with default 5-minute TTL
- `cache_creation_input_tokens` -- Tokens written to cache (first-time cost)
- `cache_read_input_tokens` -- Tokens read from cache (reduced cost)

These are accumulated across streaming chunks via `mergeUsage` (e51) and `addUsage` (Af6) functions.
