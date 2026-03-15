# Cache Breakpoint Placement Algorithm

## Overview

This document details the precise algorithms used to place cache breakpoints on system prompts, conversation messages, and tool schemas. The placement strategy is non-trivial because it must balance cache hit rates against cache invalidation frequency. A breakpoint placed too early in the content risks low hit rates (content after it changes often), while a breakpoint placed too late wastes potential savings on the stable prefix.

The system uses three distinct placement strategies:
1. **System prompt splitting** -- Divides the system prompt at a sentinel boundary marker to separate stable from dynamic content
2. **Message-level breakpoints** -- Marks the last 3 conversation messages for caching
3. **Tool-based global cache markers** -- Designates a stable tool schema as the cache anchor point

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `splitSystemPromptForCache` (nSA) - Core algorithm that partitions system prompt into cacheable blocks
- `buildSystemPromptWithCache` (F9z) - Converts split blocks into API-ready format with cache_control
- `applyCacheBreakpointsToMessages` (m9z) - Places breakpoints on recent conversation messages
- `formatUserMessageForCache` (b9z) - Adds cache_control to user messages
- `formatAssistantMessageForCache` (u9z) - Adds cache_control to assistant messages
- `createCacheControl` (s91) - Builds the cache_control object
- `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (xG1) - Sentinel marker string for prompt splitting

---

## System Prompt Cache Splitting Algorithm (nSA)

### splitSystemPromptForCache

**What it does:** Takes an array of system prompt strings and partitions them into annotated blocks, each with a `cacheScope` property (`"global"`, `"org"`, or `null`). This determines how each block is cached by the API.

**How it works:**

The function operates in three distinct modes based on configuration:

#### Mode 1: Tool-based global caching (skipGlobalCacheForSystemPrompt = true)

When global caching is enabled but a stable tool has been found to serve as the cache anchor, the system prompt itself does NOT receive global cache markers. Instead, all system prompt blocks get `cacheScope: null` (ephemeral only), and the tool schema carries the global cache marker.

**Algorithm:**
1. Filter out null entries and the boundary marker string
2. Extract the billing header (starts with `"x-anthropic-billing-header"`) -- scope: `null`
3. Extract the identity string (one of the known system identity prompts) -- scope: `null`
4. Join all remaining strings into a single block -- scope: `null`

#### Mode 2: Boundary-based global caching (boundary marker found)

When global caching is enabled and the `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` marker is present in the prompt array, the algorithm splits the prompt at that boundary:

**Algorithm:**
1. Find the index of `xG1` (`"__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"`) in the array
2. Separate prompt strings into: billing header, identity string, pre-boundary content, post-boundary content
3. Billing header -- scope: `null` (changes with version/hash)
4. Identity string -- scope: `null` (small, not worth global caching)
5. Pre-boundary content joined into one block -- scope: `"global"` (stable across sessions)
6. Post-boundary content joined into one block -- scope: `null` (dynamic, session-specific)

**Telemetry:** Emits `tengu_sysprompt_boundary_found` with block count, static/dynamic lengths.

#### Mode 3: Default (no global caching or no boundary)

**Algorithm:**
1. Extract billing header -- scope: `null`
2. Extract identity string -- scope: `"org"` (shared within organization)
3. Join all remaining strings -- scope: `"org"`

```javascript
// ============================================
// splitSystemPromptForCache - Partition system prompt into cache-scoped blocks
// Location: chunks.148.mjs:2306-2407
// ============================================

// ORIGINAL (for source lookup):
function nSA(A, q) {
    let K = E4() === "firstParty" && (J6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || x8("tengu_system_prompt_global_cache", !1));
    if (K && q?.skipGlobalCacheForSystemPrompt) {
        // Mode 1: Tool-based global caching
        let O, _, J = [];
        for (let j of A) {
            if (!j) continue;
            if (j === xG1) continue;
            if (j.startsWith("x-anthropic-billing-header")) O = j;
            else if (dq6.has(j)) _ = j;
            else J.push(j)
        }
        let X = [];
        if (O) X.push({ text: O, cacheScope: null });
        if (_) X.push({ text: _, cacheScope: null });
        let D = J.join("\n\n");
        if (D) X.push({ text: D, cacheScope: null });
        return X
    }
    if (K) {
        // Mode 2: Boundary-based global caching
        let O = A.findIndex((_) => _ === xG1);
        if (O !== -1) {
            // ... splits at boundary, pre=global, post=null
        }
    }
    // Mode 3: Default - org scope
    // ... billing=null, identity=org, rest=org
}

// READABLE (for understanding):
function splitSystemPromptForCache(promptStrings, options) {
    let globalCacheEnabled = getProvider() === "firstParty" &&
        (parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
         getFeatureFlag("tengu_system_prompt_global_cache", false));

    if (globalCacheEnabled && options?.skipGlobalCacheForSystemPrompt) {
        // Mode 1: All prompt blocks get null scope (tool carries the global marker)
        return partitionPromptBlocks(promptStrings, { allScopesNull: true });
    }

    if (globalCacheEnabled) {
        let boundaryIndex = promptStrings.findIndex(s => s === SYSTEM_PROMPT_DYNAMIC_BOUNDARY);
        if (boundaryIndex !== -1) {
            // Mode 2: Split at boundary - stable=global, dynamic=null
            return partitionAtBoundary(promptStrings, boundaryIndex);
        }
    }

    // Mode 3: Default - identity and content get "org" scope
    return partitionWithOrgScope(promptStrings);
}

// Mapping: nSA->splitSystemPromptForCache, A->promptStrings, q->options, K->globalCacheEnabled,
//   E4->getProvider, J6->parseBoolean, x8->getFeatureFlag, xG1->SYSTEM_PROMPT_DYNAMIC_BOUNDARY,
//   dq6->KNOWN_IDENTITY_STRINGS
```

**Why this approach:**

The boundary marker design solves a fundamental tension: the system prompt contains both stable content (coding instructions, tool usage rules, safety guidelines) and dynamic content (CLAUDE.md memory, MCP instructions, environment info). By inserting `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` into the prompt array at the right position during prompt construction (`hOq` / `dZ` functions), the splitting algorithm can reliably separate stable from dynamic content without fragile string parsing.

**Key insight:** The three-mode hierarchy reflects an evolution of the caching strategy. Mode 3 (org scope) is the baseline. Mode 2 (boundary-based global) improves on it by distinguishing stable vs dynamic system prompt content. Mode 1 (tool-based global) further improves by moving the global cache anchor to the tool schema, where it can cover both the system prompt AND tool definitions in a single cache prefix, while avoiding issues when the system prompt has no clear boundary.

---

## The Boundary Marker Strategy

### How the boundary is injected

The system prompt building functions (`hOq` for simple prompts, `dZ` for full prompts) conditionally inject the `xG1` boundary marker:

```javascript
// In the system prompt builder (chunks.169.mjs:233 and :248):
return [
    outputStylePrompt,
    codingInstructions,
    safetyGuidelines,
    toolUsageRules,
    toneStyleRules,
    // Boundary marker inserted here if global cache is enabled
    ...CLAUDE_CODE_FORCE_GLOBAL_CACHE || featureFlag("tengu_system_prompt_global_cache")
        ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY]
        : [],
    // Dynamic sections follow (memory, env info, MCP instructions, etc.)
    ...dynamicSections
].filter(s => s !== null)
```

Everything BEFORE the boundary is stable across sessions (coding rules, tool instructions, safety). Everything AFTER is session-specific (CLAUDE.md content, environment info, MCP server instructions, scratchpad).

### Why not just cache everything?

Caching the entire system prompt with `global` scope would cause cache misses whenever ANY dynamic section changes (e.g., the user edits CLAUDE.md). By splitting at the boundary, the stable prefix remains cached even when dynamic sections change. The `global` scope allows this cache to be shared across different sessions and even different users within the same organization, multiplying the cost savings.

---

## Message-Level Cache Breakpoints

### applyCacheBreakpointsToMessages (m9z)

**What it does:** Iterates over normalized conversation messages and adds `cache_control` markers to the last few messages.

**How it works:**
1. Emit telemetry: `tengu_api_cache_breakpoints` with total message count and caching-enabled flag
2. For each message at index `Y`:
   - If `Y > messages.length - 3` (one of the last 2 messages), apply caching
   - Call `formatUserMessageForCache` or `formatAssistantMessageForCache` depending on type
   - The third argument `q` (cachingEnabled) controls whether `cache_control` is actually added

```javascript
// ============================================
// applyCacheBreakpointsToMessages - Mark recent messages for caching
// Location: chunks.169.mjs:1385-1392
// ============================================

// ORIGINAL (for source lookup):
function m9z(A, q) {
    return c("tengu_api_cache_breakpoints", {
        totalMessageCount: A.length, cachingEnabled: q
    }), A.map((K, Y) => {
        return K.type === "user" ? b9z(K, Y > A.length - 3, q) : u9z(K, Y > A.length - 3, q)
    })
}

// READABLE (for understanding):
function applyCacheBreakpointsToMessages(messages, cachingEnabled) {
    logEvent("tengu_api_cache_breakpoints", {
        totalMessageCount: messages.length,
        cachingEnabled: cachingEnabled
    });
    return messages.map((message, index) => {
        let isRecentMessage = index > messages.length - 3;
        if (message.type === "user") {
            return formatUserMessageForCache(message, isRecentMessage, cachingEnabled);
        } else {
            return formatAssistantMessageForCache(message, isRecentMessage, cachingEnabled);
        }
    });
}

// Mapping: m9z->applyCacheBreakpointsToMessages, A->messages, q->cachingEnabled, K->message,
//   Y->index, b9z->formatUserMessageForCache, u9z->formatAssistantMessageForCache
```

**Why the last 3 messages?**

The `Y > A.length - 3` threshold means only the last 2 messages (indices `length-2` and `length-1`) get cache breakpoints. This is a deliberate design:

1. **Earlier messages are already cached** -- They were in the "recent" window during previous turns, so their cache entries already exist.
2. **The newest messages are the ones most likely to be the cache miss boundary** -- The API tries to match the longest cached prefix. By marking the last 2 messages, we give the API breakpoints to cache up to the second-to-last message, so the next turn only needs to process the truly new content.
3. **Two breakpoints, not one** -- Using 2 cache breakpoints provides a fallback. If the very last message changes (which it always does as new turns are added), the second-to-last breakpoint still provides a cache hit for everything up to that point.

### Message Formatting Details

```javascript
// ============================================
// formatUserMessageForCache - Format user message with optional cache control
// Location: chunks.169.mjs:618-643
// ============================================

// ORIGINAL (for source lookup):
function b9z(A, q = !1, K) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "user",
            content: [{ type: "text", text: A.message.content,
                ...K ? { cache_control: s91() } : {} }]
        };
        else return {
            role: "user",
            content: A.message.content.map((Y, z) => ({
                ...Y,
                ...z === A.message.content.length - 1 ? K ? { cache_control: s91() } : {} : {}
            }))
        };
    return { role: "user", content: A.message.content }
}

// READABLE (for understanding):
function formatUserMessageForCache(message, isRecentMessage, cachingEnabled) {
    if (isRecentMessage) {
        if (typeof message.message.content === "string") {
            // String content: wrap in array with cache_control on the single block
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: message.message.content,
                    ...cachingEnabled ? { cache_control: createCacheControl() } : {}
                }]
            };
        } else {
            // Array content: add cache_control to the LAST content block only
            return {
                role: "user",
                content: message.message.content.map((block, idx) => ({
                    ...block,
                    ...idx === message.message.content.length - 1
                        ? (cachingEnabled ? { cache_control: createCacheControl() } : {})
                        : {}
                }))
            };
        }
    }
    // Non-recent messages: no modification
    return { role: "user", content: message.message.content };
}

// Mapping: b9z->formatUserMessageForCache, A->message, q->isRecentMessage, K->cachingEnabled,
//   s91->createCacheControl
```

**Key detail for assistant messages:** The assistant formatter (`u9z`) has an additional check: it skips adding `cache_control` to `thinking` and `redacted_thinking` content blocks. This is because thinking blocks contain model reasoning that should not serve as cache breakpoints (they are volatile and model-specific).

---

## Tool-Based Global Cache Strategy

### How the cache marker tool is selected

In the main query function (`lOq`, `chunks.169.mjs:739-792`), when global caching is enabled and MCP tools are present:

```
1. Check if global cache is supported:
   - ts1() returns true for firstParty/foundry providers without experimental betas disabled
   - Feature flag "tengu_system_prompt_global_cache" or env CLAUDE_CODE_FORCE_GLOBAL_CACHE

2. Determine if MCP or deferred tools exist (creates instability in tool list)

3. Find the last NON-MCP, NON-deferred tool in the filtered tool list:
   - Scan filtered tools for the last tool where isMcp !== true AND name !== deferredToolSearchName
   - This tool becomes the "cache marker" tool (P)

4. Apply cache_control to the marker tool's schema:
   - cacheControl: createCacheControl("global")
   - This is passed through to nZ6() (tool schema builder) which adds it to the JSON

5. Set cache strategy mode:
   - "tool_based" if a stable tool was found
   - "system_prompt" if no stable tool (falls back to system prompt caching)
   - "none" if global caching not applicable
```

**Why tool-based caching?** MCP tools can connect/disconnect dynamically, changing the tool list between requests. If the cache breakpoint were on a system prompt block, the entire prefix up to that point (including all tool schemas serialized before it) would be invalidated when the tool list changes. By placing the breakpoint on the last STABLE tool, the cache covers all stable tools AND the system prompt, while allowing MCP tools (listed after the marker) to change freely.

---

## Cache Invalidation Triggers

Cache entries are invalidated when any content in the cached prefix changes. In practice, the following events cause cache misses:

1. **System prompt changes:**
   - User edits CLAUDE.md (affects dynamic section only; stable prefix stays cached if boundary splitting is used)
   - MCP server connects/disconnects (changes MCP instructions in dynamic section)
   - Feature flag changes

2. **Tool list changes:**
   - MCP tool added/removed (but only affects content AFTER the cache marker tool)
   - Tool permission changes

3. **Model changes:**
   - Different models may have different system prompts
   - Cache is not shared across different model identifiers

4. **Conversation prefix changes:**
   - Compaction removes earlier messages (changes the entire message prefix)
   - Message editing/deletion

5. **Version update:**
   - The billing attribution header includes the version string, so version changes invalidate system prompt caches

---

## buildSystemPromptWithCache (F9z)

**What it does:** Converts the split system prompt blocks (from `nSA`) into the API-ready format with actual `cache_control` directives.

```javascript
// ============================================
// buildSystemPromptWithCache - Convert split prompt to API format
// Location: chunks.169.mjs:1394-1406
// ============================================

// ORIGINAL (for source lookup):
function F9z(A, q, K) {
    return nSA(A, {
        skipGlobalCacheForSystemPrompt: K?.skipGlobalCacheForSystemPrompt
    }).map((Y) => {
        return {
            type: "text",
            text: Y.text,
            ...q && Y.cacheScope !== null ? {
                cache_control: s91(Y.cacheScope)
            } : {}
        }
    })
}

// READABLE (for understanding):
function buildSystemPromptWithCache(promptStrings, cachingEnabled, options) {
    return splitSystemPromptForCache(promptStrings, {
        skipGlobalCacheForSystemPrompt: options?.skipGlobalCacheForSystemPrompt
    }).map((block) => {
        return {
            type: "text",
            text: block.text,
            // Only add cache_control if caching is enabled AND scope is not null
            ...cachingEnabled && block.cacheScope !== null ? {
                cache_control: createCacheControl(block.cacheScope)
            } : {}
        };
    });
}

// Mapping: F9z->buildSystemPromptWithCache, A->promptStrings, q->cachingEnabled, K->options,
//   Y->block, nSA->splitSystemPromptForCache, s91->createCacheControl
```

**Key detail:** Blocks with `cacheScope: null` never get `cache_control` added, even when caching is enabled. This is intentional -- the billing header block changes frequently (includes a hash), so caching it would just waste cache creation tokens without yielding hits.

---

## Token Usage Tracking for Cache

The API response includes detailed cache token metrics that are tracked across streaming chunks:

```javascript
// ============================================
// mergeUsage - Merge streaming usage updates (take latest non-zero values)
// Location: chunks.169.mjs:1343-1362
// ============================================

// READABLE (for understanding):
function mergeUsage(accumulated, update) {
    return {
        input_tokens: update.input_tokens > 0 ? update.input_tokens : accumulated.input_tokens,
        cache_creation_input_tokens: update.cache_creation_input_tokens > 0
            ? update.cache_creation_input_tokens
            : accumulated.cache_creation_input_tokens,
        cache_read_input_tokens: update.cache_read_input_tokens > 0
            ? update.cache_read_input_tokens
            : accumulated.cache_read_input_tokens,
        cache_creation: {
            ephemeral_1h_input_tokens: update.cache_creation?.ephemeral_1h_input_tokens
                ?? accumulated.cache_creation.ephemeral_1h_input_tokens,
            ephemeral_5m_input_tokens: update.cache_creation?.ephemeral_5m_input_tokens
                ?? accumulated.cache_creation.ephemeral_5m_input_tokens
        },
        // ... other fields
    };
}
```

The distinction between `ephemeral_1h_input_tokens` and `ephemeral_5m_input_tokens` allows operators to monitor the effectiveness of the TTL-based caching strategy separately for OAuth users (1h) vs API key users (5m).
