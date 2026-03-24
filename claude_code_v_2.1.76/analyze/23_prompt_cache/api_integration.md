# API Integration and Request Construction

## Overview

This document details how prompt caching integrates with the API request construction pipeline. It covers the complete flow from building system prompts to formatting messages with cache markers, and the special handling for compaction (cache_edits blocks).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `applyCacheBreakpointsToMessages` (z9z) - Main entry point for message cache marking
- `buildSystemPromptWithCache` (_9z) - Converts system prompt strings to API format
- `splitSystemPromptForCache` (Jn8) - Partitions system prompt into cache-scoped blocks
- `createCacheControl` (Ml) - Builds cache_control directive object
- `formatUserMessageForCache` (s3z) - Formats user messages with cache_control
- `formatAssistantMessageForCache` (t3z) - Formats assistant messages with cache_control
- `injectCacheEditsBlock` (Mn8) - Injects cache_edits for compaction
- `isToolResultBlock` (Y9z) - Type guard for tool_result blocks
- `isPromptCachingEnabled` (IGq) - Checks if caching is active for model
- `shouldUse1HourTTL` (o3z) - Determines TTL duration
- `isFirstPartyProvider` (C_6) - Checks if using first-party API

---

## API Request Construction Pipeline

### High-Level Flow

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
│     - Inject cache_reference for tool_result blocks                           │
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

## Message Cache Marking

### applyCacheBreakpointsToMessages (z9z)

**What it does:** Main entry point that iterates over normalized messages and adds cache_control markers. Also handles cache_edits blocks for compaction.

```javascript
// ============================================
// applyCacheBreakpointsToMessages - Mark messages for caching
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
    // ... cache_edits handling ...
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

    // Handle cache_edits from compaction...
    return formattedMessages;
}

// Mapping: z9z->applyCacheBreakpointsToMessages, A->messages, q->cachingEnabled,
//   K->querySource, Y->hasCompactionEdits, z->lastUserMessageEdit, _->userMessageEdits,
//   w->skipCacheWrite, s3z->formatUserMessageForCache, t3z->formatAssistantMessageForCache
```

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

**Why last message (or second-to-last if skipCacheWrite):**
- The most recent user message is the "frontier"
- Earlier messages are stable and already cached from previous turns
- Placing breakpoints at the frontier ensures new messages get cached for the NEXT turn
- This creates a rolling cache window: each turn, the frontier messages get cached

---

## Message Formatting Functions

### formatUserMessageForCache (s3z)

**What it does:** Formats a user message with optional cache_control, handling both string and array content.

```javascript
// ============================================
// formatUserMessageForCache - Format user message with cache_control
// Location: chunks.170.mjs:1928-1957
// ============================================

// ORIGINAL (for source lookup):
function s3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "user",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "user",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "user",
        content: Array.isArray(A.message.content) ? [...A.message.content] : A.message.content
    }
}

// READABLE (for understanding):
function formatUserMessageForCache(message, shouldApplyCache = false, cachingEnabled, querySource) {
    // Apply cache_control only if conditions are met
    if (shouldApplyCache) {
        if (typeof message.message.content === "string") {
            // String content: wrap in array with cache_control on the text block
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: message.message.content,
                    ...(cachingEnabled ? { cache_control: createCacheControl({ querySource }) } : {})
                }]
            };
        } else {
            // Array content: add cache_control to the LAST content block
            return {
                role: "user",
                content: message.message.content.map((block, index) => ({
                    ...block,
                    ...(index === message.message.content.length - 1 && cachingEnabled
                        ? { cache_control: createCacheControl({ querySource }) }
                        : {})
                }))
            };
        }
    }

    // No caching: return content as-is
    return {
        role: "user",
        content: Array.isArray(message.message.content)
            ? [...message.message.content]
            : message.message.content
    };
}

// Mapping: s3z->formatUserMessageForCache, A->message, q->shouldApplyCache,
//   K->cachingEnabled, Y->querySource, Ml->createCacheControl
```

**Why cache_control goes on the last block:** The Anthropic API caches everything UP TO the block with cache_control. By placing it on the last content block, we maximize the cached prefix.

---

### formatAssistantMessageForCache (t3z)

**What it does:** Formats an assistant message with optional cache_control, excluding thinking blocks.

```javascript
// ============================================
// formatAssistantMessageForCache - Format assistant message with cache_control
// Location: chunks.170.mjs:1959-1988
// ============================================

// ORIGINAL (for source lookup):
function t3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "assistant",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "assistant",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 && z.type !== "thinking" && z.type !== "redacted_thinking" ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "assistant",
        content: A.message.content
    }
}

// READABLE (for understanding):
function formatAssistantMessageForCache(message, shouldApplyCache = false, cachingEnabled, querySource) {
    if (shouldApplyCache) {
        if (typeof message.message.content === "string") {
            return {
                role: "assistant",
                content: [{
                    type: "text",
                    text: message.message.content,
                    ...(cachingEnabled ? { cache_control: createCacheControl({ querySource }) } : {})
                }]
            };
        } else {
            // Array content: add cache_control to last NON-THINKING block
            return {
                role: "assistant",
                content: message.message.content.map((block, index) => ({
                    ...block,
                    // Skip thinking blocks - they can't be cached
                    ...(index === message.message.content.length - 1
                         && block.type !== "thinking"
                         && block.type !== "redacted_thinking"
                         && cachingEnabled
                        ? { cache_control: createCacheControl({ querySource }) }
                        : {})
                }))
            };
        }
    }
    return { role: "assistant", content: message.message.content };
}

// Mapping: t3z->formatAssistantMessageForCache, A->message, q->shouldApplyCache,
//   K->cachingEnabled, Y->querySource, Ml->createCacheControl
```

**Key insight:** Thinking blocks (`thinking` and `redacted_thinking`) are explicitly excluded from cache_control because they contain model reasoning that shouldn't be cached.

---

## System Prompt Cache Building

### buildSystemPromptWithCache (_9z)

**What it does:** Converts split system prompt blocks into API-ready format with cache_control annotations.

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

**Key insight:** Blocks with `cacheScope: null` don't get a `cache_control` marker. This means they fall back to the default ephemeral caching behavior.

---

## cache_edits Block Handling

### Why cache_edits

When messages are compacted (summarized), the old content is replaced with a summary. However, the cache still contains the old content. The `cache_edits` block tells the API which cached content is now obsolete, allowing it to optimize the cache more effectively.

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

### injectCacheEditsBlock (Mn8)

**What it does:** Injects a cache_edits block into a message's content array.

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
    // Find the last tool_result block
    let lastToolResultIndex = -1;
    for (let i = 0; i < content.length; i++) {
        let block = content[i];
        if (block && typeof block === "object" && "type" in block && block.type === "tool_result") {
            lastToolResultIndex = i;
        }
    }

    if (lastToolResultIndex >= 0) {
        // Insert after the last tool_result
        let insertIndex = lastToolResultIndex + 1;
        content.splice(insertIndex, 0, cacheEditsBlock);

        // If inserted at the end, add a placeholder text block
        // (API requires text after cache_edits)
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

**Why insert after tool_result:** The cache_edits references tool_result blocks by ID. Placing the cache_edits block right after the last tool_result ensures the API can efficiently process the deletions.

---

### isToolResultBlock (Y9z)

**What it does:** Type guard to check if a content block is a tool_result.

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

When cache_edits are present, tool_result blocks receive a `cache_reference` field for correlation:

```javascript
// From chunks.171.mjs:780-794
if (cachingEnabled) {
    let lastCacheControlIndex = -1;
    // Find the message with cache_control
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

            for (let j = 0; j < msg.content.length; j++) {
                let block = msg.content[j];
                if (block && isToolResultBlock(block)) {
                    msg.content[j] = Object.assign({}, block, {
                        cache_reference: block.tool_use_id
                    });
                }
            }
        }
    }
}
```

**Why cache_reference:** The cache_reference allows cache_edits to reference specific tool results by ID, enabling fine-grained deletion of cached content.

---

## Provider Detection

### isFirstPartyProvider (C_6)

**What it does:** Checks if the current provider supports first-party features like global cache scope.

```javascript
// ============================================
// isFirstPartyProvider - Check if first-party API with beta support
// Location: chunks.176.mjs:1638-1640
// ============================================

// ORIGINAL (for source lookup):
function C_6() {
    return (QA() === "firstParty" || QA() === "foundry") && !t6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}

// READABLE (for understanding):
function isFirstPartyProvider() {
    let provider = getProvider();
    let isExperimentalBetasDisabled = parseBoolean(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS);

    return (provider === "firstParty" || provider === "foundry") && !isExperimentalBetasDisabled;
}

// Mapping: C_6->isFirstPartyProvider, QA->getProvider, t6->parseBoolean
```

**Key insight:** Global cache scope requires:
1. First-party or Foundry provider
2. Experimental betas not disabled

---

## 1-Hour TTL Allowlist

### get1HourTTLAllowlist (eu1) / set1HourTTLAllowlist (Am1)

```javascript
// ============================================
// get1HourTTLAllowlist / set1HourTTLAllowlist - Allowlist cache management
// Location: chunks.1.mjs:3147-3153
// ============================================

// ORIGINAL (for source lookup):
function eu1() {
    return v1.promptCache1hAllowlist
}
function Am1(A) {
    v1.promptCache1hAllowlist = A
}

// READABLE (for understanding):
function get1HourTTLAllowlist() {
    return globalState.promptCache1hAllowlist;
}

function set1HourTTLAllowlist(allowlist) {
    globalState.promptCache1hAllowlist = allowlist;
}

// Mapping: eu1->get1HourTTLAllowlist, Am1->set1HourTTLAllowlist, v1->globalState
```

**Why caching the allowlist:** The allowlist is fetched from feature flags once and cached globally to avoid repeated API calls during the session.

---

## Tool Schema Cache Marking

When MCP tools or deferred tools are present, the system selects the most "stable" tool and adds `cache_control` to its definition:

```javascript
// From chunks.171.mjs:34-88 (simplified)
function selectToolForGlobalCache(tools, globalCacheEnabled) {
    if (!globalCacheEnabled) return null;

    // Find a stable tool to serve as cache anchor
    for (let tool of tools) {
        if (isStableTool(tool)) {
            return tool;
        }
    }
    return null;
}

// Apply cache_control to the selected tool
if (cacheAnchorTool) {
    cacheAnchorTool.cache_control = createCacheControl({ scope: "global" });
    options.skipGlobalCacheForSystemPrompt = true;
}
```

**Trade-off:** If the designated "stable" tool changes (e.g., a tool is removed), the global cache is invalidated. This is acceptable because tool list changes are infrequent.

---

## Complete API Request Example

### Full Request Structure with All Cache Markers

```javascript
// ============================================
// Complete API request structure with prompt caching
// Shows all three cache layers: system, messages, tools
// ============================================

{
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,

    // ========================================
    // SYSTEM PROMPT (Layer 1)
    // ========================================
    system: [
        // Block 1: Billing header (no caching - changes per session)
        {
            type: "text",
            text: "x-anthropic-billing-header: cc_version=2.1.76.abc; cc_entrypoint=cli; cch=00000;"
            // No cache_control (billing header changes)
        },
        // Block 2: Identity string (org scope - shared within organization)
        {
            type: "text",
            text: "You are Claude Code, Anthropic's official CLI for Claude...",
            cache_control: {
                type: "ephemeral",
                scope: "org",
                ttl: "1h"  // 1-hour TTL for OAuth users
            }
        },
        // Block 3: Stable content (global scope - shared across all sessions)
        {
            type: "text",
            text: "# Coding Guidelines\n\n## File Operations\n...",
            cache_control: {
                type: "ephemeral",
                scope: "global",
                ttl: "1h"
            }
        },
        // Block 4: Dynamic content (no caching - changes per session)
        {
            type: "text",
            text: "# CLAUDE.md\n\nUser preferences and project context..."
            // No cache_control (dynamic content)
        }
    ],

    // ========================================
    // MESSAGES (Layer 2)
    // ========================================
    messages: [
        // Earlier messages (already cached from previous turns)
        {
            role: "user",
            content: [{ type: "text", text: "First message..." }]
        },
        {
            role: "assistant",
            content: [{ type: "text", text: "Response..." }]
        },
        // Latest message (gets cache marker)
        {
            role: "user",
            content: [
                { type: "text", text: "Latest message..." },
                // cache_control on LAST block in last message
                {
                    cache_control: {
                        type: "ephemeral",
                        ttl: "1h"  // No scope for messages
                    }
                }
            ]
        }
    ],

    // ========================================
    // TOOLS (Layer 3)
    // ========================================
    tools: [
        // Cache anchor tool (gets global scope)
        {
            name: "Read",
            input_schema: {
                type: "object",
                properties: {
                    file_path: { type: "string" }
                }
            },
            cache_control: {
                type: "ephemeral",
                scope: "global",
                ttl: "1h"
            }
        },
        // Other tools (covered by cache prefix)
        { name: "Write", input_schema: { ... } },
        { name: "Edit", input_schema: { ... } },
        { name: "Bash", input_schema: { ... } }
    ]
}
```

### Cache Marker Placement Rules

| Layer | Placement | Scope | TTL |
|-------|-----------|-------|-----|
| System - Billing header | First block | None (no caching) | N/A |
| System - Identity | Second block | `"org"` | 1h or 5min |
| System - Static content | Pre-boundary blocks | `"global"` | 1h or 5min |
| System - Dynamic content | Post-boundary blocks | None (no caching) | N/A |
| Messages | Last block of last message | None (default) | 1h or 5min |
| Tools | First stable tool | `"global"` | 1h or 5min |

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.171.mjs` | `z9z`, `_9z`, `Y9z` | Message cache breakpoints, system prompt with cache, tool_result type guard |
| `chunks.170.mjs` | `Jn8`, `Ml`, `s3z`, `t3z`, `Mn8`, `o3z`, `IGq` | System prompt splitting, cache_control creation, message formatting, cache_edits injection, TTL logic |
| `chunks.176.mjs` | `C_6` | First-party provider detection |
| `chunks.1.mjs` | `eu1`, `Am1` | 1-hour TTL allowlist management |
| `chunks.18.mjs` | `QA` | Provider type getter |

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [cache_placement.md](./cache_placement.md) - Cache breakpoint placement algorithms
- [ttl_scope_logic.md](./ttl_scope_logic.md) - TTL and scope decision trees
- [ui_integration.md](./ui_integration.md) - UI display of cache statistics