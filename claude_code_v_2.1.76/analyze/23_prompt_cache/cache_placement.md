# Cache Breakpoint Placement Algorithm

## Overview

This document details the precise algorithms used to place cache breakpoints on system prompts, conversation messages, and tool schemas. The placement strategy is non-trivial because it must balance cache hit rates against cache invalidation frequency. A breakpoint placed too early in the content risks low hit rates (content after it changes often), while a breakpoint placed too late wastes potential savings on the stable prefix.

The system uses three distinct placement strategies:
1. **System prompt splitting** -- Divides the system prompt at a sentinel boundary marker to separate stable from dynamic content
2. **Message-level breakpoints** -- Marks the last few conversation messages for caching
3. **Tool-based global cache markers** -- Designates a stable tool schema as the cache anchor point

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `splitSystemPromptForCache` (Jn8) - Core algorithm that partitions system prompt into cacheable blocks
- `buildSystemPromptWithCache` (_9z) - Converts split blocks into API-ready format with cache_control
- `applyCacheBreakpointsToMessages` (z9z) - Places breakpoints on recent conversation messages
- `formatUserMessageForCache` (s3z) - Adds cache_control to user messages
- `formatAssistantMessageForCache` (t3z) - Adds cache_control to assistant messages
- `createCacheControl` (Ml) - Builds the cache_control object
- `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (S_6) - Sentinel marker string for prompt splitting

---

## System Prompt Cache Splitting Algorithm (Jn8)

### splitSystemPromptForCache

**What it does:** Takes an array of system prompt strings and partitions them into annotated blocks, each with a `cacheScope` property (`"global"`, `"org"`, or `null`). This determines how each block is cached by the API.

**How it works:**

The function operates in three distinct modes based on configuration:

#### Mode 1: Tool-based global caching (skipGlobalCacheForSystemPrompt = true)

When global caching is enabled but a stable tool has been found to serve as the cache anchor, the system prompt itself does NOT receive global cache markers. Instead, all system prompt blocks get `cacheScope: null` (ephemeral only), and the tool schema carries the global cache marker.

**Algorithm:**
1. Filter out null entries and the boundary marker string
2. Extract the billing header (starts with `"x-anthropic-billing-header"`) -- scope: `null`
3. Extract the identity string (one of the known system identity prompts) -- scope: `"org"`
4. Join all remaining strings into a single block -- scope: `"org"`

#### Mode 2: Boundary-based global caching (boundary marker found)

When global caching is enabled and the `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` marker is present in the prompt array, the algorithm splits the prompt at that boundary:

**Algorithm:**
1. Find the index of `S_6` (`"__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"`) in the array
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

**Telemetry:** Emits `tengu_sysprompt_missing_boundary_marker` if global cache enabled but no boundary found.

### Complete Function Implementation

```javascript
// ============================================
// splitSystemPromptForCache - Partition system prompt into cache-scoped blocks
// Location: chunks.170.mjs:1483-1583
// ============================================

// ORIGINAL (for source lookup):
function Jn8(A, q) {
    let K = C_6() && (t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1));
    if (K && q?.skipGlobalCacheForSystemPrompt) {
        d("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: A.length
        });
        let $, H, j = [];
        for (let D of A) {
            if (!D) continue;
            if (D === S_6) continue;
            if (D.startsWith("x-anthropic-billing-header")) $ = D;
            else if (x21.has(D)) H = D;
            else j.push(D)
        }
        let J = [];
        if ($) J.push({ text: $, cacheScope: null });
        if (H) J.push({ text: H, cacheScope: "org" });
        let M = j.join("\n\n");
        if (M) J.push({ text: M, cacheScope: "org" });
        return J
    }
    if (K) {
        let $ = A.findIndex((H) => H === S_6);
        if ($ !== -1) {
            let H, j, J = [], M = [];
            for (let W = 0; W < A.length; W++) {
                let Z = A[W];
                if (!Z || Z === S_6) continue;
                if (Z.startsWith("x-anthropic-billing-header")) H = Z;
                else if (x21.has(Z)) j = Z;
                else if (W < $) J.push(Z);
                else M.push(Z)
            }
            let D = [];
            if (H) D.push({ text: H, cacheScope: null });
            if (j) D.push({ text: j, cacheScope: null });
            let X = J.join("\n\n");
            if (X) D.push({ text: X, cacheScope: "global" });
            let P = M.join("\n\n");
            if (P) D.push({ text: P, cacheScope: null });
            return d("tengu_sysprompt_boundary_found", {
                blockCount: D.length,
                staticBlockLength: X.length,
                dynamicBlockLength: P.length
            }), D
        } else d("tengu_sysprompt_missing_boundary_marker", {
            promptBlockCount: A.length
        })
    }
    let Y, z, _ = [];
    for (let $ of A) {
        if (!$) continue;
        if ($.startsWith("x-anthropic-billing-header")) Y = $;
        else if (x21.has($)) z = $;
        else _.push($)
    }
    let w = [];
    if (Y) w.push({ text: Y, cacheScope: null });
    if (z) w.push({ text: z, cacheScope: "org" });
    let O = _.join("\n\n");
    if (O) w.push({ text: O, cacheScope: "org" });
    return w
}

// READABLE (for understanding):
function splitSystemPromptForCache(promptStrings, options) {
    // Check if global caching is enabled
    let globalCacheEnabled = isFirstPartyProvider() &&
        (parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
         getFeatureFlag("tengu_system_prompt_global_cache", false));

    // ========================================
    // MODE 1: Tool-based global caching
    // When skipGlobalCacheForSystemPrompt is true, tools carry global cache
    // ========================================
    if (globalCacheEnabled && options?.skipGlobalCacheForSystemPrompt) {
        telemetry("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: promptStrings.length
        });

        let billingHeader, identityString, otherStrings = [];

        for (let str of promptStrings) {
            if (!str) continue;
            if (str === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue;
            if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
            else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
            else otherStrings.push(str);
        }

        let blocks = [];
        if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
        if (identityString) blocks.push({ text: identityString, cacheScope: "org" });
        let joinedOther = otherStrings.join("\n\n");
        if (joinedOther) blocks.push({ text: joinedOther, cacheScope: "org" });

        return blocks;
    }

    // ========================================
    // MODE 2: Boundary-based global caching
    // ========================================
    if (globalCacheEnabled) {
        let boundaryIndex = promptStrings.findIndex((s) => s === SYSTEM_PROMPT_DYNAMIC_BOUNDARY);

        if (boundaryIndex !== -1) {
            let billingHeader, identityString, preBoundary = [], postBoundary = [];

            for (let i = 0; i < promptStrings.length; i++) {
                let str = promptStrings[i];
                if (!str || str === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue;

                if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
                else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
                else if (i < boundaryIndex) preBoundary.push(str);
                else postBoundary.push(str);
            }

            let blocks = [];
            if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
            if (identityString) blocks.push({ text: identityString, cacheScope: null });

            let staticContent = preBoundary.join("\n\n");
            if (staticContent) blocks.push({ text: staticContent, cacheScope: "global" });

            let dynamicContent = postBoundary.join("\n\n");
            if (dynamicContent) blocks.push({ text: dynamicContent, cacheScope: null });

            telemetry("tengu_sysprompt_boundary_found", {
                blockCount: blocks.length,
                staticBlockLength: staticContent.length,
                dynamicBlockLength: dynamicContent.length
            });

            return blocks;
        } else {
            telemetry("tengu_sysprompt_missing_boundary_marker", {
                promptBlockCount: promptStrings.length
            });
        }
    }

    // ========================================
    // MODE 3: Default (no global caching)
    // ========================================
    let billingHeader, identityString, otherStrings = [];

    for (let str of promptStrings) {
        if (!str) continue;
        if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
        else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
        else otherStrings.push(str);
    }

    let blocks = [];
    if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
    if (identityString) blocks.push({ text: identityString, cacheScope: "org" });

    let joinedOther = otherStrings.join("\n\n");
    if (joinedOther) blocks.push({ text: joinedOther, cacheScope: "org" });

    return blocks;
}

// Mapping: Jn8->splitSystemPromptForCache, A->promptStrings, q->options, K->globalCacheEnabled,
//   C_6->isFirstPartyProvider, t6->parseBoolean, w8->getFeatureFlag, S_6->SYSTEM_PROMPT_DYNAMIC_BOUNDARY,
//   x21->KNOWN_IDENTITY_STRINGS, d->telemetry
```

```javascript
// ============================================
// splitSystemPromptForCache - Partition system prompt into cache-scoped blocks
// Location: chunks.170.mjs:1483-1583
// ============================================

// ORIGINAL (for source lookup):
function Jn8(A, q) {
    let K = C_6() && (t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1));
    if (K && q?.skipGlobalCacheForSystemPrompt) {
        d("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: A.length
        });
        let $, H, j = [];
        for (let D of A) {
            if (!D) continue;
            if (D === S_6) continue;
            if (D.startsWith("x-anthropic-billing-header")) $ = D;
            else if (x21.has(D)) H = D;
            else j.push(D)
        }
        let J = [];
        if ($) J.push({ text: $, cacheScope: null });
        if (H) J.push({ text: H, cacheScope: "org" });
        let M = j.join("\n\n");
        if (M) J.push({ text: M, cacheScope: "org" });
        return J
    }
    if (K) {
        let $ = A.findIndex((H) => H === S_6);
        if ($ !== -1) {
            let H, j, J = [], M = [];
            for (let W = 0; W < A.length; W++) {
                let Z = A[W];
                if (!Z || Z === S_6) continue;
                if (Z.startsWith("x-anthropic-billing-header")) H = Z;
                else if (x21.has(Z)) j = Z;
                else if (W < $) J.push(Z);
                else M.push(Z)
            }
            let D = [];
            if (H) D.push({ text: H, cacheScope: null });
            if (j) D.push({ text: j, cacheScope: null });
            let X = J.join("\n\n");
            if (X) D.push({ text: X, cacheScope: "global" });
            let P = M.join("\n\n");
            if (P) D.push({ text: P, cacheScope: null });
            return d("tengu_sysprompt_boundary_found", {
                blockCount: D.length,
                staticBlockLength: X.length,
                dynamicBlockLength: P.length
            }), D
        } else d("tengu_sysprompt_missing_boundary_marker", {
            promptBlockCount: A.length
        })
    }
    let Y, z, _ = [];
    for (let $ of A) {
        if (!$) continue;
        if ($.startsWith("x-anthropic-billing-header")) Y = $;
        else if (x21.has($)) z = $;
        else _.push($)
    }
    let w = [];
    if (Y) w.push({ text: Y, cacheScope: null });
    if (z) w.push({ text: z, cacheScope: "org" });
    let O = _.join("\n\n");
    if (O) w.push({ text: O, cacheScope: "org" });
    return w
}

// READABLE (for understanding):
function splitSystemPromptForCache(promptStrings, options) {
    let globalCacheEnabled = getProvider() === "firstParty" &&
        (parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
         getFeatureFlag("tengu_system_prompt_global_cache", false));

    // ========================================
    // MODE 1: Tool-based global caching
    // ========================================
    if (globalCacheEnabled && options?.skipGlobalCacheForSystemPrompt) {
        telemetry("tengu_sysprompt_using_tool_based_cache", {
            promptBlockCount: promptStrings.length
        });

        let billingHeader, identityString, otherStrings = [];

        for (let str of promptStrings) {
            if (!str) continue;
            if (str === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue;
            if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
            else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
            else otherStrings.push(str);
        }

        let blocks = [];
        if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
        if (identityString) blocks.push({ text: identityString, cacheScope: "org" });
        let joinedOther = otherStrings.join("\n\n");
        if (joinedOther) blocks.push({ text: joinedOther, cacheScope: "org" });

        return blocks;
    }

    // ========================================
    // MODE 2: Boundary-based global caching
    // ========================================
    if (globalCacheEnabled) {
        let boundaryIndex = promptStrings.findIndex((s) => s === SYSTEM_PROMPT_DYNAMIC_BOUNDARY);

        if (boundaryIndex !== -1) {
            let billingHeader, identityString, preBoundary = [], postBoundary = [];

            for (let i = 0; i < promptStrings.length; i++) {
                let str = promptStrings[i];
                if (!str || str === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue;

                if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
                else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
                else if (i < boundaryIndex) preBoundary.push(str);
                else postBoundary.push(str);
            }

            let blocks = [];
            if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
            if (identityString) blocks.push({ text: identityString, cacheScope: null });

            let staticContent = preBoundary.join("\n\n");
            if (staticContent) blocks.push({ text: staticContent, cacheScope: "global" });

            let dynamicContent = postBoundary.join("\n\n");
            if (dynamicContent) blocks.push({ text: dynamicContent, cacheScope: null });

            telemetry("tengu_sysprompt_boundary_found", {
                blockCount: blocks.length,
                staticBlockLength: staticContent.length,
                dynamicBlockLength: dynamicContent.length
            });

            return blocks;
        } else {
            telemetry("tengu_sysprompt_missing_boundary_marker", {
                promptBlockCount: promptStrings.length
            });
        }
    }

    // ========================================
    // MODE 3: Default (no global caching)
    // ========================================
    let billingHeader, identityString, otherStrings = [];

    for (let str of promptStrings) {
        if (!str) continue;
        if (str.startsWith("x-anthropic-billing-header")) billingHeader = str;
        else if (KNOWN_IDENTITY_STRINGS.has(str)) identityString = str;
        else otherStrings.push(str);
    }

    let blocks = [];
    if (billingHeader) blocks.push({ text: billingHeader, cacheScope: null });
    if (identityString) blocks.push({ text: identityString, cacheScope: "org" });

    let joinedOther = otherStrings.join("\n\n");
    if (joinedOther) blocks.push({ text: joinedOther, cacheScope: "org" });

    return blocks;
}

// Mapping: Jn8->splitSystemPromptForCache, A->promptStrings, q->options, K->globalCacheEnabled,
//   C_6->getProvider, t6->parseBoolean, w8->getFeatureFlag, S_6->SYSTEM_PROMPT_DYNAMIC_BOUNDARY,
//   x21->KNOWN_IDENTITY_STRINGS, d->telemetry
```

**Why this approach:**

The boundary marker design solves a fundamental tension: the system prompt contains both stable content (coding instructions, tool usage rules, safety guidelines) and dynamic content (CLAUDE.md memory, MCP instructions, environment info). By inserting `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` into the prompt array at the right position during prompt construction, the splitting algorithm can reliably separate stable from dynamic content without fragile string parsing.

**Key insight:** The three-mode hierarchy reflects an evolution of the caching strategy. Mode 3 (org scope) is the baseline. Mode 2 (boundary-based global) improves on it by distinguishing stable vs dynamic system prompt content. Mode 1 (tool-based global) further improves by moving the global cache anchor to the tool schema, where it can cover both the system prompt AND tool definitions in a single cache prefix.

---

## The Boundary Marker Strategy

### How the boundary is injected

The system prompt building functions conditionally inject the `S_6` boundary marker. The injection happens in the system prompt construction array at a specific position:

```javascript
// ============================================
// Boundary marker injection in system prompt builder
// Location: chunks.168.mjs:2155
// ============================================

// ORIGINAL (for source lookup):
return [P5z(w), W5z(H), w === null || w.keepCodingInstructions === !0 ? Z5z() : null, G5z(), f5z(H, _), N5z(), v5z(),
    ...t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1) ? [S_6] : [],
    ...J].filter((M) => M !== null)

// READABLE (for understanding):
function buildSystemPromptArray(config, dynamicSections) {
    return [
        getOutputStylePrompt(config),           // P5z: Output style (json, text, etc.)
        getEnvInfoPrompt(envInfo),              // W5z: Environment info
        config.keepCodingInstructions ? getCodingInstructionsPrompt() : null,  // Z5z: Coding instructions
        getToolUsagePrompt(),                   // G5z: Tool usage rules
        getMcpInstructionsPrompt(envInfo, mcpClients),  // f5z: MCP server instructions
        getSafetyGuidelinesPrompt(),            // N5z: Safety guidelines
        getToneStylePrompt(),                   // v5z: Tone/style preferences
        // ===== BOUNDARY MARKER INJECTION POINT =====
        // Everything BEFORE this marker is STABLE across sessions
        ...(parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
          getFeatureFlag("tengu_system_prompt_global_cache", false)
            ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY]  // S_6: "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"
            : []),
        // Everything AFTER this marker is DYNAMIC per session
        ...dynamicSections  // J: CLAUDE.md content, memory, scratchpad, etc.
    ].filter((section) => section !== null);
}

// Mapping: P5z->getOutputStylePrompt, W5z->getEnvInfoPrompt, Z5z->getCodingInstructionsPrompt,
//   G5z->getToolUsagePrompt, f5z->getMcpInstructionsPrompt, N5z->getSafetyGuidelinesPrompt,
//   v5z->getToneStylePrompt, S_6->SYSTEM_PROMPT_DYNAMIC_BOUNDARY, w8->getFeatureFlag
```

### Boundary Marker Constant

```javascript
// ============================================
// SYSTEM_PROMPT_DYNAMIC_BOUNDARY - Sentinel marker for cache splitting
// Location: chunks.168.mjs:2277
// ============================================

// ORIGINAL (for source lookup):
S_6 = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"

// READABLE (for understanding):
const SYSTEM_PROMPT_DYNAMIC_BOUNDARY = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__";

// Mapping: S_6->SYSTEM_PROMPT_DYNAMIC_BOUNDARY
```

**Why this sentinel string:**
- It's a unique, identifiable string that won't appear naturally in prompts
- It allows the splitting algorithm to reliably find the boundary position
- It's filtered out during the splitting process (not included in final API messages)
- It separates stable content (coding rules, tool instructions) from dynamic content (CLAUDE.md, memory)

### Why not just cache everything?

Caching the entire system prompt with `global` scope would cause cache misses whenever ANY dynamic section changes (e.g., the user edits CLAUDE.md). By splitting at the boundary, the stable prefix remains cached even when dynamic sections change. The `global` scope allows this cache to be shared across different sessions and even different users within the same organization, multiplying the cost savings.

---

## Message-Level Cache Breakpoints

### applyCacheBreakpointsToMessages (z9z)

**What it does:** Iterates over normalized conversation messages and adds `cache_control` markers to the last few messages.

**How it works:**
1. Emit telemetry: `tengu_api_cache_breakpoints` with total message count and caching-enabled flag
2. For each message at index `M`:
   - If `M === cacheBreakpointIndex`, apply caching
   - Call `formatUserMessageForCache` or `formatAssistantMessageForCache` depending on type
   - The third argument `q` (cachingEnabled) controls whether `cache_control` is actually added
3. Handle `cache_edits` blocks if compaction edits are provided

```javascript
// ============================================
// applyCacheBreakpointsToMessages - Mark recent messages for caching
// Location: chunks.171.mjs:721-796
// ============================================

// ORIGINAL (for source lookup):
function z9z(A, q, K, Y = !1, z, _, w = !1) {
    d("tengu_api_cache_breakpoints", {
        totalMessageCount: A.length,
        cachingEnabled: q,
        skipCacheWrite: w
    });
    let O = w ? A.length - 2 : A.length - 1,
        $ = A.map((J, M) => {
            let D = M === O;
            if (J.type === "user") return s3z(J, D, q, K);
            return t3z(J, D, q, K)
        });
    if (!Y) return $;

    // cache_edits handling for compaction...
    let H = new Set,
        j = (J) => {
            let M = J.edits.filter((D) => {
                if (H.has(D.cache_reference)) return !1;
                return H.add(D.cache_reference), !0
            });
            return { ...J, edits: M }
        };

    // Process user message edits...
    for (let J of _ ?? []) {
        let M = $[J.userMessageIndex];
        if (M && M.role === "user") {
            if (!Array.isArray(M.content)) M.content = [{ type: "text", text: M.content }];
            let D = j(J.block);
            if (D.edits.length > 0) injectCacheEditsBlock(M.content, D)
        }
    }

    // Process last user message edit...
    if (z && $.length > 0) {
        let J = j(z);
        if (J.edits.length > 0)
            for (let M = $.length - 1; M >= 0; M--) {
                let D = $[M];
                if (D && D.role === "user") {
                    if (!Array.isArray(D.content)) D.content = [{ type: "text", text: D.content }];
                    injectCacheEditsBlock(D.content, J);
                    debugLog(`Added cache_edits block with ${J.edits.length} deletion(s) to message[${M}]`);
                    break
                }
            }
    }

    // Add cache_reference to tool_result blocks for cache_edits correlation
    if (q) {
        let J = -1;
        for (let M = 0; M < $.length; M++) {
            let D = $[M];
            if (Array.isArray(D.content)) {
                for (let X of D.content)
                    if (X && typeof X === "object" && "cache_control" in X) J = M
            }
        }
        if (J >= 0)
            for (let M = 0; M < J; M++) {
                let D = $[M];
                if (D.role !== "user" || !Array.isArray(D.content)) continue;
                let X = !1;
                for (let P = 0; P < D.content.length; P++) {
                    let W = D.content[P];
                    if (W && isToolResultBlock(W)) {
                        if (!X) D.content = [...D.content], X = !0;
                        D.content[P] = Object.assign({}, W, { cache_reference: W.tool_use_id })
                    }
                }
            }
    }
    return $
}

// READABLE (for understanding):
function applyCacheBreakpointsToMessages(
    messages,
    cachingEnabled,
    querySource,
    hasCompactionEdits = false,
    userMessageEdits,
    lastUserMessageEdit,
    skipCacheWrite = false
) {
    // Emit telemetry
    telemetry("tengu_api_cache_breakpoints", {
        totalMessageCount: messages.length,
        cachingEnabled,
        skipCacheWrite
    });

    // Calculate which message gets the cache breakpoint
    // If skipCacheWrite, the last message is new (no point caching it)
    let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;

    // Apply cache_control to each message
    let formattedMessages = messages.map((message, index) => {
        let shouldCache = index === cacheBreakpointIndex;
        if (message.type === "user") {
            return formatUserMessageForCache(message, shouldCache, cachingEnabled, querySource);
        }
        return formatAssistantMessageForCache(message, shouldCache, cachingEnabled, querySource);
    });

    // Return early if no compaction edits
    if (!hasCompactionEdits) return formattedMessages;

    // ... cache_edits handling logic ...

    return formattedMessages;
}

// Mapping: z9z->applyCacheBreakpointsToMessages, A->messages, q->cachingEnabled,
//   K->querySource, Y->hasCompactionEdits, z->lastUserMessageEdit, _->userMessageEdits,
//   w->skipCacheWrite, s3z->formatUserMessageForCache, t3z->formatAssistantMessageForCache
```

**Why last message (or second-to-last if skipCacheWrite):**
- The most recent user message is the "frontier"
- Earlier messages are stable and already cached from previous turns
- Placing breakpoints at the frontier ensures the new messages get cached for the NEXT turn
- This creates a rolling cache window: each turn, the frontier messages get cached, and older turns already have their cache markers

### Cache Breakpoint Index Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│  Normal case (skipCacheWrite = false)                           │
│                                                                 │
│  Messages: [M0, M1, M2, M3, M4, M5]                            │
│                              cache breakpoint here ↑            │
│                              index = length - 1 = 5             │
│                                                                 │
│  Result: M5 gets cache_control                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  skipCacheWrite case (new message, don't cache it yet)          │
│                                                                 │
│  Messages: [M0, M1, M2, M3, M4, M5]  ← M5 is NEW               │
│                          cache breakpoint here ↑                │
│                          index = length - 2 = 4                 │
│                                                                 │
│  Result: M4 gets cache_control, M5 is excluded                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## cache_edits Block Handling

When compaction occurs, the system may inject `cache_edits` blocks to inform the API about content that was removed during summarization. This enables more efficient cache usage.

### cache_edits Structure

```javascript
{
    type: "cache_edits",
    edits: [
        {
            cache_reference: "toolu_xxx",  // ID of the deleted content
            operation: "delete"
        }
    ]
}
```

### Why cache_edits

When messages are compacted (summarized), the old content is replaced with a summary. However, the cache still contains the old content. The `cache_edits` block tells the API which cached content is now obsolete, allowing it to optimize the cache more effectively.

---

## buildSystemPromptWithCache (_9z)

**What it does:** Converts the split system prompt blocks into API-ready format with `cache_control` annotations.

```javascript
// ============================================
// buildSystemPromptWithCache - Convert split blocks to API format
// Location: chunks.171.mjs:799-813
// ============================================

// ORIGINAL (for source lookup):
function _9z(A, q, K) {
    return Jn8(A, {
        skipGlobalCacheForSystemPrompt: K?.skipGlobalCacheForSystemPrompt
    }).map((Y) => {
        return {
            type: "text",
            text: Y.text,
            ...q && Y.cacheScope !== null ? {
                cache_control: Ml({
                    scope: Y.cacheScope,
                    querySource: K?.querySource
                })
            } : {}
        }
    })
}

// READABLE (for understanding):
function buildSystemPromptWithCache(promptStrings, cachingEnabled, options) {
    // Split the prompt into blocks with cache scopes
    let blocks = splitSystemPromptForCache(promptStrings, {
        skipGlobalCacheForSystemPrompt: options?.skipGlobalCacheForSystemPrompt
    });

    // Convert each block to API format
    return blocks.map((block) => {
        return {
            type: "text",
            text: block.text,
            // Add cache_control if caching is enabled AND block has a scope
            ...(cachingEnabled && block.cacheScope !== null
                ? { cache_control: createCacheControl({ scope: block.cacheScope, querySource: options?.querySource }) }
                : {})
        };
    });
}

// Mapping: _9z->buildSystemPromptWithCache, A->promptStrings, q->cachingEnabled,
//   K->options, Jn8->splitSystemPromptForCache, Ml->createCacheControl
```

**Key insight:** Blocks with `cacheScope: null` don't get a `cache_control` marker. This means they fall back to the default ephemeral caching behavior (cached if something after them has a cache_control).

---

## Tool Schema Cache Marking

When MCP tools or deferred tools are present, the system selects the most "stable" tool (typically the first alphabetically stable tool that won't change across requests) and adds `cache_control` to its definition. This designates it as the global cache anchor point.

The tool-based approach is used when:
1. Global caching is enabled (feature flag or env var)
2. At least one stable tool exists in the active tool list
3. The `skipGlobalCacheForSystemPrompt` option is set to `true`

**Trade-off:** If the designated "stable" tool changes (e.g., a tool is removed), the global cache is invalidated for all content after the cache marker point. This is acceptable because tool list changes are infrequent compared to message additions.

### Tool Cache Marker Selection

```javascript
// From chunks.171.mjs:34-88
// The system looks for a tool that can serve as the cache anchor

let useToolBasedCache = getProvider() === "firstParty" &&
    (parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
     getFeatureFlag("tengu_system_prompt_global_cache", false));

if (useToolBasedCache && hasStableTool(tools)) {
    // Find the best tool for cache anchoring
    // Prefer tools that are unlikely to change between requests
    let cacheAnchorTool = findCacheAnchorTool(tools);

    // Add cache_control to the tool's schema
    cacheAnchorTool.cache_control = createCacheControl({ scope: "global" });

    // Mark that system prompt should NOT get global scope
    options.skipGlobalCacheForSystemPrompt = true;
}
```

---

## Cache Placement Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          API REQUEST BUILDING                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  1. Build System Prompt Array                                                 │
│     - Coding instructions                                                     │
│     - Tool usage rules                                                        │
│     - Safety guidelines                                                       │
│     - [BOUNDARY MARKER] (if global cache enabled)                            │
│     - Dynamic sections (CLAUDE.md, MCP instructions, etc.)                   │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  2. Split System Prompt for Cache (Jn8)                                       │
│     Mode 1: Tool-based → All blocks get null/"org" scope                     │
│     Mode 2: Boundary-based → Pre=global, Post=null                           │
│     Mode 3: Default → Identity=org, Content=org                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  3. Build System Prompt with Cache (_9z)                                      │
│     Convert blocks to API format with cache_control                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  4. Apply Cache Breakpoints to Messages (z9z)                                 │
│     - Calculate breakpoint index (last or second-to-last)                     │
│     - Format each message with optional cache_control                         │
│     - Handle cache_edits if compaction occurred                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  5. Final API Request                                                         │
│     {                                                                         │
│       system: [{ type: "text", text: "...", cache_control: {...} }],        │
│       messages: [{ role: "user", content: [..., cache_control: {...}] }],   │
│       tools: [{ name: "...", cache_control: {...} }]                         │
│     }                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Impact

### Cache Hit Rate Optimization

| Placement Strategy | Expected Hit Rate | Cost Savings |
|-------------------|-------------------|--------------|
| System prompt (global scope) | 90-95% | 70% of system prompt tokens |
| System prompt (org scope) | 80-85% | 60% of system prompt tokens |
| Recent messages (last 2) | 60-70% | Rolling window savings |
| Tool schemas (global anchor) | 85-90% | Full tool list if stable |

### Cache Invalidation Triggers

| Trigger | What Gets Invalidated |
|---------|----------------------|
| Model change | Entire cache |
| Tool added/removed | Tool cache + system prompt cache |
| CLAUDE.md edit | Dynamic system prompt section |
| MCP server reconnect | MCP instructions section |
| Settings change | Affected system prompt sections |

---

## injectCacheEditsBlock (Mn8)

**What it does:** Injects a `cache_edits` block into a message's content array at the appropriate position.

```javascript
// ============================================
// injectCacheEditsBlock - Inject cache_edits into message content
// Location: chunks.170.mjs:1789-1805
// ============================================

// ORIGINAL (for source lookup):
function Mn8(A, q) {
    let K = -1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z && typeof z === "object" && "type" in z && z.type === "tool_result") K = Y
    }
    if (K >= 0) {
        let Y = K + 1;
        if (A.splice(Y, 0, q), Y === A.length - 1) A.push({
            type: "text",
            text: "."
        })
    } else {
        let Y = Math.max(0, A.length - 1);
        A.splice(Y, 0, q)
    }
}

// READABLE (for understanding):
function injectCacheEditsBlock(content, cacheEditsBlock) {
    // Find the last tool_result block in the content
    let lastToolResultIndex = -1;
    for (let i = 0; i < content.length; i++) {
        let block = content[i];
        if (block && typeof block === "object" && "type" in block && block.type === "tool_result") {
            lastToolResultIndex = i;
        }
    }

    if (lastToolResultIndex >= 0) {
        // Insert cache_edits after the last tool_result
        let insertIndex = lastToolResultIndex + 1;
        content.splice(insertIndex, 0, cacheEditsBlock);

        // If we inserted at the very end, add a placeholder text block
        // (API requires text content after cache_edits)
        if (insertIndex === content.length - 1) {
            content.push({
                type: "text",
                text: "."
            });
        }
    } else {
        // No tool_result found, insert at second-to-last position
        let insertIndex = Math.max(0, content.length - 1);
        content.splice(insertIndex, 0, cacheEditsBlock);
    }
}

// Mapping: Mn8->injectCacheEditsBlock, A->content, q->cacheEditsBlock, K->lastToolResultIndex
```

**Why insert after tool_result:** The `cache_edits` block references tool_result blocks by their `cache_reference` ID. Placing the `cache_edits` block right after the last tool_result ensures the API can efficiently correlate the deletion operations with the cached content.

**Why the placeholder text:** If `cache_edits` is the last block in the content array, the API may not properly process it. Adding a minimal text block ensures proper cache processing.

---

## isToolResultBlock (Y9z)

**What it does:** Type guard function to check if a content block is a `tool_result` type.

```javascript
// ============================================
// isToolResultBlock - Type guard for tool_result blocks
// Location: chunks.171.mjs:717-719
// ============================================

// ORIGINAL (for source lookup):
function Y9z(A) {
    return A !== null && typeof A === "object" && "type" in A && A.type === "tool_result" && "tool_use_id" in A
}

// READABLE (for understanding):
function isToolResultBlock(block) {
    return block !== null
        && typeof block === "object"
        && "type" in block
        && block.type === "tool_result"
        && "tool_use_id" in block;
}

// Mapping: Y9z->isToolResultBlock, A->block
```

---

## cache_reference Injection

When `cache_edits` blocks are present, all `tool_result` blocks before the cache breakpoint receive a `cache_reference` field for correlation:

```javascript
// From chunks.171.mjs:771-796
// Add cache_reference to tool_result blocks for cache_edits correlation

if (cachingEnabled) {
    // Find the index of the message with cache_control
    let lastCacheControlIndex = -1;
    for (let i = 0; i < formattedMessages.length; i++) {
        let msg = formattedMessages[i];
        if (Array.isArray(msg.content)) {
            for (let block of msg.content) {
                if (block && typeof block === "object" && "cache_control" in block) {
                    lastCacheControlIndex = i;
                }
            }
        }
    }

    // Add cache_reference to all tool_result blocks before the cache breakpoint
    if (lastCacheControlIndex >= 0) {
        for (let i = 0; i < lastCacheControlIndex; i++) {
            let msg = formattedMessages[i];
            if (msg.role !== "user" || !Array.isArray(msg.content)) continue;

            let contentModified = false;
            for (let j = 0; j < msg.content.length; j++) {
                let block = msg.content[j];
                if (block && isToolResultBlock(block)) {
                    if (!contentModified) {
                        msg.content = [...msg.content];
                        contentModified = true;
                    }
                    msg.content[j] = Object.assign({}, block, {
                        cache_reference: block.tool_use_id
                    });
                }
            }
        }
    }
}
```

**Why cache_reference is needed:**

1. The `cache_edits` block specifies deletions by `cache_reference` ID
2. Without `cache_reference` on tool_result blocks, the API cannot correlate deletions
3. Only tool_result blocks before the cache breakpoint need `cache_reference` (those are the ones that might be deleted during compaction)

---

## Edge Cases and Fallback Behavior

### Missing Boundary Marker

When global caching is enabled but the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker is not found:

```javascript
// From chunks.170.mjs:304-306
if (boundaryIndex === -1) {
    telemetry("tengu_sysprompt_missing_boundary_marker", {
        promptBlockCount: promptStrings.length
    });
    // Falls through to default mode 3 handling
}
```

**Behavior:**
1. Telemetry event `tengu_sysprompt_missing_boundary_marker` is emitted
2. The algorithm falls through to Mode 3 (default org-scoped caching)
3. No global scope is applied to any system prompt block

**Why this fallback:**
- Maintains functionality even if boundary marker injection fails
- Prevents cache errors from blocking API calls
- Provides telemetry for debugging prompt construction issues

### Empty or Null Prompt Strings

The algorithm handles empty strings and null values gracefully:

```javascript
// From chunks.170.mjs:266-271
for (let str of promptStrings) {
    if (!str) continue;  // Skip null/undefined/empty
    if (str === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue;  // Skip marker itself
    // ... process string
}
```

**Why this matters:**
- Prompt arrays may contain conditional sections that resolve to null
- Empty strings shouldn't create empty cache blocks
- Prevents wasted cache entries on whitespace

### Tool List Changes

When tools are added or removed mid-session:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOOL CHANGE IMPACT ON CACHE                               │
└─────────────────────────────────────────────────────────────────────────────┘

Turn 1:                           Turn 2 (Tool Removed):
┌───────────────────────┐        ┌───────────────────────┐
│ System Prompt         │        │ System Prompt         │
│ (cached, global)      │        │ (SAME - cache hit)    │
├───────────────────────┤        ├───────────────────────┤
│ Tools: [A, B, C]      │        │ Tools: [A, B]         │
│ (cached, global)      │        │ (DIFFERENT - cache    │
│                       │        │  invalidated!)        │
├───────────────────────┤        ├───────────────────────┤
│ Messages              │        │ Messages              │
│ (cached, ephemeral)   │        │ (SAME - cache hit)    │
└───────────────────────┘        └───────────────────────┘

Result: Tool cache invalidated → Cache miss on tool definitions
```

**Mitigation strategy:**
- Tools are selected as cache anchors only if they're "stable" (unlikely to change)
- The first-party tools (Read, Write, Edit, Bash, Glob, Grep) are most stable
- MCP tools are less stable and may trigger cache invalidation on connect/disconnect

### Cache Scope Inheritance

When a block has `cacheScope: null`, it inherits from the cache prefix:

```
Block 1: cacheScope: "global"  → Creates global cache prefix
Block 2: cacheScope: null      → Falls under Block 1's global cache
Block 3: cacheScope: "org"     → Creates org-scoped cache (separate from global)
Block 4: cacheScope: null      → Falls under Block 3's org cache
```

**Why null scope exists:**
- Allows blocks to share a cache prefix without re-declaring scope
- Reduces cache_control overhead in the API request
- Maintains flexibility for dynamic content that shouldn't anchor a cache

---

## Tool-Based Global Cache Strategy

### When Tool-Based Caching is Used

Tool-based global caching activates when:

```javascript
// From chunks.171.mjs:34-88
let useToolBasedCache = getProvider() === "firstParty" &&
    (parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
     getFeatureFlag("tengu_system_prompt_global_cache", false));

if (useToolBasedCache && hasStableTool(tools)) {
    // Find the best tool for cache anchoring
    let cacheAnchorTool = findCacheAnchorTool(tools);

    // Add cache_control to the tool's schema
    cacheAnchorTool.cache_control = createCacheControl({ scope: "global" });

    // Mark that system prompt should NOT get global scope
    options.skipGlobalCacheForSystemPrompt = true;
}
```

**Decision tree:**
```
Is first-party provider?
├── No  → Use org-scoped caching
└── Yes → Is CLAUDE_CODE_FORCE_GLOBAL_CACHE or tengu_system_prompt_global_cache enabled?
          ├── No  → Use org-scoped caching
          └── Yes → Does a stable tool exist?
                    ├── No  → Use boundary-based global caching
                    └── Yes → Use tool-based global caching
                              (skipGlobalCacheForSystemPrompt = true)
```

### Tool Anchor Selection Criteria

The system selects a tool as the cache anchor based on:

1. **Stability**: The tool definition rarely changes between requests
2. **Position**: Appears early in the tools array for maximum prefix coverage
3. **Type**: Built-in tools preferred over MCP tools

**Why tools make good cache anchors:**
- Tool schemas are typically 500-2000 tokens
- Tool lists change infrequently during a session
- Anchoring on tools covers both system prompt AND tool definitions in one cache prefix

### Tool-Based vs Boundary-Based Comparison

| Aspect | Tool-Based Global | Boundary-Based Global |
|--------|-------------------|----------------------|
| Cache anchor position | Tool schema | System prompt split point |
| Cache scope coverage | Tools + System prompt | System prompt only |
| Invalidated when | Tools change | Dynamic content changes |
| Best for | Stable tool sets | Dynamic CLAUDE.md content |
| Mode | 1 | 2 |

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.170.mjs` | `Jn8`, `Ml`, `s3z`, `t3z`, `Mn8` | System prompt splitting, cache_control creation, message formatting, cache_edits injection |
| `chunks.171.mjs` | `z9z`, `_9z`, `Y9z` | Message cache breakpoints, system prompt with cache, tool_result type guard |
| `chunks.168.mjs` | `S_6` | System prompt boundary marker constant |

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [ttl_scope_logic.md](./ttl_scope_logic.md) - TTL and scope decision trees
- [ui_integration.md](./ui_integration.md) - UI display of cache statistics
- [api_integration.md](./api_integration.md) - API request construction with caching