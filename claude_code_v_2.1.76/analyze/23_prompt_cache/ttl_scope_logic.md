# TTL and Scope Decision Logic

## Overview

This document details the decision trees and algorithms used to determine cache TTL (Time To Live) and scope for prompt caching. The system makes sophisticated decisions based on user authentication status, provider type, and feature flag configurations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [overview.md](./overview.md) - Prompt cache system overview

Key functions in this document:
- `createCacheControl` (Ml) - Builds the cache_control object with TTL and scope
- `shouldUse1HourTTL` (o3z) - Determines if 1-hour TTL should be applied
- `isOAuthUser` (iA) - Checks if user is authenticated via OAuth
- `getProvider` (C_6) - Returns the API provider type
- `getFeatureFlag` (w8) - Retrieves feature flag value

---

## Cache Control Object Structure

The `cache_control` object sent to the Anthropic API has this structure:

```typescript
interface CacheControl {
    type: "ephemeral";           // Always "ephemeral" for prompt caching
    ttl?: "1h";                  // Optional: 1-hour TTL (default is 5 minutes)
    scope?: "global";            // Optional: Global scope (default is org/session)
}
```

### TTL Values

| TTL | Duration | Use Case |
|-----|----------|----------|
| (default) | 5 minutes | API key users, overage users, Bedrock default |
| `1h` | 1 hour | OAuth subscription users (Pro, Max, Enterprise, Team) |

### Scope Values

| Scope | Sharing | Use Case |
|-------|---------|----------|
| (default/ephemeral) | Session only | Dynamic content, billing header |
| `org` | Organization | System identity, most system prompt content |
| `global` | All org users | Stable system prompt prefix, tool schemas |

---

## TTL Decision Tree

### shouldUse1HourTTL (o3z)

```javascript
// ============================================
// shouldUse1HourTTL - Check if user qualifies for extended cache TTL
// Location: chunks.170.mjs:1864-1870
// ============================================

// ORIGINAL (for source lookup):
function o3z(A) {
    if (QA() === "bedrock" && t6(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)) return !0;
    if (!(iA() && !Jf.isUsingOverage)) return !1;
    let K = eu1();
    if (K === null) K = w8("tengu_prompt_cache_1h_config", {}).allowlist ?? [], Am1(K);
    return A !== void 0 && K.some((Y) => Y.endsWith("*") ? A.startsWith(Y.slice(0, -1)) : A === Y)
}

// READABLE (for understanding):
function shouldUse1HourTTL(querySource) {
    // =====================================================
    // PATH 1: Bedrock Provider
    // =====================================================
    if (getProvider() === "bedrock") {
        // Bedrock users get 1-hour TTL if env var is explicitly set
        return parseBoolean(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK);
    }

    // =====================================================
    // PATH 2: First-Party Provider
    // =====================================================

    // Check 1: Must be OAuth user
    if (!isOAuthUser()) {
        return false;  // API key users get 5-minute TTL
    }

    // Check 2: Must NOT be in overage mode
    if (rateLimitState.isUsingOverage) {
        return false;  // Overage users get 5-minute TTL
    }

    // Check 3: Query source must be in allowlist
    let allowlist = get1HourTTLAllowlist();
    if (allowlist === null) {
        allowlist = getFeatureFlag("tengu_prompt_cache_1h_config", {}).allowlist ?? [];
        set1HourTTLAllowlist(allowlist);
    }

    // Match query source against allowlist (supports wildcards)
    if (querySource === undefined) {
        return false;
    }

    return allowlist.some((pattern) => {
        if (pattern.endsWith("*")) {
            // Wildcard matching: "repl_*" matches "repl_main_thread", "repl_background", etc.
            return querySource.startsWith(pattern.slice(0, -1));
        } else {
            // Exact matching
            return querySource === pattern;
        }
    });
}

// Mapping: o3z->shouldUse1HourTTL, A->querySource, QA->getProvider, t6->parseBoolean,
//   iA->isOAuthUser, Jf->rateLimitState, eu1->get1HourTTLAllowlist, Am1->set1HourTTLAllowlist
```

### Decision Flow Diagram

```
                         ┌─────────────────────────────────┐
                         │   shouldUse1HourTTL(querySource) │
                         └───────────────┬─────────────────┘
                                         │
                                         ▼
                         ┌─────────────────────────────────┐
                         │   Is provider === "bedrock"?    │
                         └───────────────┬─────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ YES                                     │ NO
                    ▼                                         ▼
        ┌───────────────────────┐              ┌─────────────────────────────────┐
        │ Return env var value: │              │   Is isOAuthUser() === true?    │
        │ ENABLE_PROMPT_       │              └───────────────┬─────────────────┘
        │ CACHING_1H_BEDROCK    │                              │
        └───────────────────────┘              ┌───────────────┴───────────────┐
                                               │ NO                            │ YES
                                               ▼                               ▼
                                   ┌─────────────────────┐      ┌─────────────────────────────────┐
                                   │ Return FALSE        │      │ Is rateLimitState.isUsingOverage│
                                   │ (5-minute TTL)      │      │ === true?                       │
                                   └─────────────────────┘      └───────────────┬─────────────────┘
                                                                               │
                                                              ┌────────────────┴────────────────┐
                                                              │ YES                             │ NO
                                                              ▼                                 ▼
                                                  ┌─────────────────────┐  ┌─────────────────────────────┐
                                                  │ Return FALSE        │  │ Is querySource in allowlist?│
                                                  │ (5-minute TTL)      │  └───────────────┬─────────────┘
                                                  └─────────────────────┘                  │
                                                                           ┌─────────────────┴─────────────────┐
                                                                           │ NO                                │ YES
                                                                           ▼                                   ▼
                                                               ┌─────────────────────┐      ┌─────────────────────┐
                                                               │ Return FALSE        │      │ Return TRUE         │
                                                               │ (5-minute TTL)      │      │ (1-hour TTL)        │
                                                               └─────────────────────┘      └─────────────────────┘
```

---

## Scope Decision Tree

### Scope Assignment in createCacheControl (Ml)

```javascript
// ============================================
// createCacheControl - Builds cache_control directive with TTL and scope
// Location: chunks.170.mjs:1849-1862
// ============================================

// ORIGINAL (for source lookup):
function Ml({
    scope: A,
    querySource: q
} = {}) {
    return {
        type: "ephemeral",
        ...o3z(q) ? {
            ttl: "1h"
        } : {},
        ...A === "global" ? {
            scope: A
        } : {}
    }
}

// READABLE (for understanding):
function createCacheControl({ scope, querySource } = {}) {
    return {
        type: "ephemeral",

        // TTL is determined by shouldUse1HourTTL
        // Not dependent on scope
        ...(shouldUse1HourTTL(querySource) ? { ttl: "1h" } : {}),

        // Scope is passed explicitly
        // Only "global" is added to the object
        // null/undefined/missing means default (org/session) scope
        ...(scope === "global" ? { scope } : {})
    };
}

// Mapping: Ml->createCacheControl, A->scope, q->querySource, o3z->shouldUse1HourTTL
```

### Scope Assignment in System Prompt Splitting

The scope is assigned during `splitSystemPromptForCache` (Jn8):

```javascript
// From chunks.170.mjs:1483-1583 (simplified)

function splitSystemPromptForCache(promptStrings, options) {
    let globalCacheEnabled = /* check feature flags and provider */;

    // ========================================
    // MODE 1: Tool-based global caching
    // System prompt gets org scope, tool gets global
    // ========================================
    if (globalCacheEnabled && options?.skipGlobalCacheForSystemPrompt) {
        return [
            { text: billingHeader, cacheScope: null },      // Billing header: no caching
            { text: identityString, cacheScope: "org" },    // Identity: org scope
            { text: otherContent, cacheScope: "org" }       // Other: org scope
        ];
    }

    // ========================================
    // MODE 2: Boundary-based global caching
    // Pre-boundary gets global, post-boundary gets null
    // ========================================
    if (globalCacheEnabled && boundaryFound) {
        return [
            { text: billingHeader, cacheScope: null },      // Billing header: no caching
            { text: identityString, cacheScope: null },     // Identity: no caching (small)
            { text: staticContent, cacheScope: "global" },  // Static: GLOBAL scope
            { text: dynamicContent, cacheScope: null }      // Dynamic: no caching
        ];
    }

    // ========================================
    // MODE 3: Default (org scope for most content)
    // ========================================
    return [
        { text: billingHeader, cacheScope: null },          // Billing header: no caching
        { text: identityString, cacheScope: "org" },        // Identity: org scope
        { text: otherContent, cacheScope: "org" }           // Other: org scope
    ];
}
```

### Scope Assignment Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCOPE ASSIGNMENT DECISION TREE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │ Is global caching enabled?          │
                    │ (feature flag + first-party)        │
                    └───────────────┬─────────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               │ NO                                        │ YES
               ▼                                           ▼
   ┌─────────────────────────────┐       ┌─────────────────────────────────────┐
   │ DEFAULT MODE:               │       │ Is skipGlobalCacheForSystemPrompt?  │
   │ • Billing header: null      │       └───────────────┬─────────────────────┘
   │ • Identity: "org"           │                       │
   │ • Content: "org"            │    ┌──────────────────┴──────────────────┐
   └─────────────────────────────┘    │ YES                                 │ NO
                                      ▼                                     ▼
                          ┌────────────────────────┐        ┌───────────────────────────────┐
                          │ TOOL-BASED MODE:       │        │ Is boundary marker found?     │
                          │ • Billing: null        │        └───────────────┬───────────────┘
                          │ • Identity: "org"      │                        │
                          │ • Content: "org"       │       ┌────────────────┴────────────────┐
                          │                        │       │ NO                              │ YES
                          │ Tool schema gets       │       ▼                                 ▼
                          │ "global" scope         │   ┌─────────────────────┐  ┌─────────────────────────┐
                          └────────────────────────┘   │ FALLBACK MODE:      │  │ BOUNDARY MODE:          │
                                                      │ Same as DEFAULT     │  │ • Billing: null         │
                                                      └─────────────────────┘  │ • Identity: null        │
                                                                               │ • Pre-boundary: "global"│
                                                                               │ • Post-boundary: null   │
                                                                               └─────────────────────────┘
```

---

## Allowlist Configuration

### Feature Flag Structure

The `tengu_prompt_cache_1h_config` feature flag controls which query sources get 1-hour TTL:

```json
{
    "allowlist": [
        "repl_main_thread",
        "repl_background",
        "subagent_*",
        "prompt_suggestion"
    ]
}
```

### Allowlist Management Functions

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

**Why caching the allowlist:** The allowlist is fetched from feature flags once and cached globally to avoid repeated API calls during the session. This is set in `shouldUse1HourTTL` when the cached value is null.

The allowlist supports wildcard matching with `*` suffix:

| Pattern | Matches | Doesn't Match |
|---------|---------|---------------|
| `"repl_main_thread"` | `repl_main_thread` | `repl_background`, `repl_other` |
| `"repl_*"` | `repl_main_thread`, `repl_background`, `repl_anything` | `subagent_repl`, `api_repl` |
| `"*"` | Everything | (nothing) |

### Query Sources

Common query source values found in the codebase:

| Query Source | Description |
|--------------|-------------|
| `repl_main_thread` | Main REPL user interaction |
| `repl_background` | Background processing in REPL |
| `subagent_primary` | Primary subagent execution |
| `subagent_explore` | Explore agent execution |
| `subagent_plan` | Plan agent execution |
| `prompt_suggestion` | Prompt suggestion generation |
| `auto_mode` | Auto mode classification |
| `compact` | Compaction operation |
| `mcp_cli` | MCP CLI command |

---

## Provider-Specific Behavior

### First-Party (Anthropic Direct)

```
┌─────────────────────────────────────────────────────────────────┐
│ FIRST-PARTY PROVIDER                                            │
├─────────────────────────────────────────────────────────────────┤
│ OAuth Users (NOT in overage):                                   │
│   - 1-hour TTL IF query source in allowlist                     │
│   - 5-minute TTL otherwise                                      │
│                                                                 │
│ OAuth Users (IN overage):                                       │
│   - 5-minute TTL (always)                                       │
│                                                                 │
│ API Key Users:                                                  │
│   - 5-minute TTL (always)                                       │
│                                                                 │
│ Global Scope:                                                   │
│   - Available via feature flag                                  │
│   - Boundary-based splitting enabled                            │
└─────────────────────────────────────────────────────────────────┘
```

### Bedrock

```
┌─────────────────────────────────────────────────────────────────┐
│ BEDROCK PROVIDER                                                │
├─────────────────────────────────────────────────────────────────┤
│ TTL:                                                            │
│   - 1-hour IF ENABLE_PROMPT_CACHING_1H_BEDROCK env var is set   │
│   - 5-minute TTL otherwise                                      │
│                                                                 │
│ Global Scope:                                                   │
│   - Not available (Bedrock doesn't support global scope)        │
└─────────────────────────────────────────────────────────────────┘
```

### Vertex AI

```
┌─────────────────────────────────────────────────────────────────┐
│ VERTEX PROVIDER                                                 │
├─────────────────────────────────────────────────────────────────┤
│ TTL:                                                            │
│   - 5-minute TTL (no 1-hour option)                             │
│                                                                 │
│ Global Scope:                                                   │
│   - Not available                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `ENABLE_PROMPT_CACHING_1H_BEDROCK` | boolean | Enable 1-hour TTL for Bedrock users |
| `CLAUDE_CODE_FORCE_GLOBAL_CACHE` | boolean | Force global cache scope (testing/debugging) |
| `DISABLE_PROMPT_CACHING` | boolean | Disable all prompt caching |
| `DISABLE_PROMPT_CACHING_HAIKU` | boolean | Disable caching for Haiku model |
| `DISABLE_PROMPT_CACHING_SONNET` | boolean | Disable caching for Sonnet model |
| `DISABLE_PROMPT_CACHING_OPUS` | boolean | Disable caching for Opus model |

---

## Cost Implications

### TTL Impact on Costs

| TTL | Cache Duration | Cost Impact |
|-----|----------------|-------------|
| 5 minutes | Short window | Lower cache hit rate in multi-turn conversations |
| 1 hour | Long window | Higher cache hit rate, ~10x cost savings on repeated prompts |

**Example:**
- 100-turn conversation with same system prompt
- System prompt: 10,000 tokens
- Without cache: 100 × 10,000 = 1,000,000 input tokens
- With 5-minute TTL: ~70% hit rate = 300,000 input + 700,000 cache read
- With 1-hour TTL: ~95% hit rate = 50,000 input + 950,000 cache read

At $3/M input and $0.30/M cache read:
- No cache: $3.00
- 5-minute TTL: $1.11 (63% savings)
- 1-hour TTL: $0.44 (85% savings)

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.170.mjs` | `o3z`, `Ml` | TTL logic, cache_control creation |
| `chunks.16.mjs` | `iA` | OAuth user detection |
| `chunks.18.mjs` | `kR6` | Prompt caching scope beta header |

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [cache_placement.md](./cache_placement.md) - Cache breakpoint placement algorithms
- [ui_integration.md](./ui_integration.md) - UI display of cache statistics