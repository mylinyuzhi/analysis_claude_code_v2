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
        let O = A.findIndex((_) => _ === xG1);
        if (O !== -1) { /* Mode 2: split at boundary, pre=global, post=null */ }
    }
    /* Mode 3: default - billing=null, identity=org, rest=org */
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

The boundary marker design solves a fundamental tension: the system prompt contains both stable content (coding instructions, tool usage rules, safety guidelines) and dynamic content (CLAUDE.md memory, MCP instructions, environment info). By inserting `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` into the prompt array at the right position during prompt construction, the splitting algorithm can reliably separate stable from dynamic content without fragile string parsing.

**Key insight:** The three-mode hierarchy reflects an evolution of the caching strategy. Mode 3 (org scope) is the baseline. Mode 2 (boundary-based global) improves on it by distinguishing stable vs dynamic system prompt content. Mode 1 (tool-based global) further improves by moving the global cache anchor to the tool schema, where it can cover both the system prompt AND tool definitions in a single cache prefix.

---

## The Boundary Marker Strategy

### How the boundary is injected

The system prompt building functions conditionally inject the `xG1` boundary marker:

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
    telemetry("tengu_api_cache_breakpoints", {
        totalMessageCount: messages.length,
        cachingEnabled: cachingEnabled
    });
    return messages.map((message, index) => {
        let shouldCache = index > messages.length - 3;  // Last 2 messages
        if (message.type === "user") {
            return formatUserMessageForCache(message, shouldCache, cachingEnabled);
        } else {
            return formatAssistantMessageForCache(message, shouldCache, cachingEnabled);
        }
    });
}

// Mapping: m9z->applyCacheBreakpointsToMessages, A->messages, q->cachingEnabled,
//   b9z->formatUserMessageForCache, u9z->formatAssistantMessageForCache
```

**Why last 2 messages (index > length - 3):**
- The most recent user message and most recent assistant message are the "frontier"
- Earlier messages are stable and already cached from previous turns
- Placing breakpoints at positions -2 and -1 (relative to end) ensures the new messages get cached for the NEXT turn
- This creates a rolling cache window: each turn, the frontier messages get cached, and older turns already have their cache markers

---

## Tool Schema Cache Marking

When MCP tools or deferred tools are present, the system selects the most "stable" tool (typically the first alphabetically stable tool that won't change across requests) and adds `cache_control` to its definition. This designates it as the global cache anchor point.

The tool-based approach is used when:
1. Global caching is enabled (feature flag or env var)
2. At least one stable tool exists in the active tool list
3. The `skipGlobalCacheForSystemPrompt` option is set to `true`

**Trade-off:** If the designated "stable" tool changes (e.g., a tool is removed), the global cache is invalidated for all content after the cache marker point. This is acceptable because tool list changes are infrequent compared to message additions.
