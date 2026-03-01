# Configuration & Telemetry

## Overview

The Compact feature's behavior is controlled by a **layered configuration system** that combines:
1. **Remote feature flags** (fetched from Claude servers)
2. **Environment variables** (local overrides for debugging/testing)
3. **Default constants** (hard-coded fallback values)

Additionally, comprehensive **telemetry events** track compaction performance, effectiveness, and failures to enable data-driven optimization and debugging.

**Configuration philosophy:** **Progressive enhancement** - System works with sensible defaults, but can be tuned via feature flags or overridden locally for testing.

**Telemetry philosophy:** **Complete observability** - Every compaction path (standard, session memory, microcompaction) emits telemetry with detailed metrics for token savings, cache efficiency, and failure modes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `loadSmCompactConfig` (pmY) - Fetches remote config for session memory compaction thresholds
- `isSessionMemoryCompactEnabled` (TZ6) - Checks if session memory feature is enabled
- `getSmCompactConfig` (UmY) - Returns active session memory compaction configuration
- `setSmCompactConfig` (gmY) - Updates active configuration
- `getAutoCompactThreshold` (SQ1) - Computes auto-compact trigger threshold
- `getEffectiveContextWindow` (m51) - Gets model context window minus buffer
- `getCompactionStatus` (Ac) - Calculates token usage percentage and threshold status

Constants:
- `SM_COMPACT_CONFIG_DEFAULTS` (NZ6) - Default session memory config (minTokens: 10000, maxTokens: 40000, minTextBlockMessages: 5)
- `MAX_COMPACT_BUFFER` (nmY) - 20,000 tokens (buffer for LLM response)
- `AUTO_COMPACT_BUFFER_OFFSET` (cCA) - 13,000 tokens (safety margin before hard limit)
- `TOKEN_WARNING_THRESHOLD` (rmY) - 20,000 tokens (warning threshold offset)
- `TOKEN_ERROR_THRESHOLD` (omY) - 20,000 tokens (error threshold offset)
- `BLOCKING_LIMIT_OFFSET` (lCA) - 3,000 tokens (last resort before blocking user input)

---

## Configuration System

### Configuration Hierarchy

```
Priority (highest to lowest):
1. Environment Variables (local overrides)
2. Remote Feature Flags (server-controlled)
3. Default Constants (hard-coded fallbacks)
```

**Example:** `ENABLE_CLAUDE_CODE_SM_COMPACT` env var overrides `tengu_sm_compact` feature flag.

---

## Configuration Loading

### Session Memory Compaction Config

**Function:** `loadSmCompactConfig` (pmY)
**Location:** chunks.147.mjs:514-524

**What it does:** Fetches remote configuration for session memory compaction thresholds with fallback to defaults

**Algorithm:**

1. **Guard against double-loading**:
   ```javascript
   if (configLoaded) return;  // Already loaded
   configLoaded = true;
   ```

2. **Fetch remote config**:
   ```javascript
   let remoteConfig = await fetchRemoteConfig("tengu_sm_compact_config", {});
   ```

3. **Validate and merge with defaults**:
   ```javascript
   let finalConfig = {
       minTokens: (remoteConfig.minTokens && remoteConfig.minTokens > 0)
           ? remoteConfig.minTokens
           : SM_COMPACT_CONFIG_DEFAULTS.minTokens,  // 10,000

       minTextBlockMessages: (remoteConfig.minTextBlockMessages && remoteConfig.minTextBlockMessages > 0)
           ? remoteConfig.minTextBlockMessages
           : SM_COMPACT_CONFIG_DEFAULTS.minTextBlockMessages,  // 5

       maxTokens: (remoteConfig.maxTokens && remoteConfig.maxTokens > 0)
           ? remoteConfig.maxTokens
           : SM_COMPACT_CONFIG_DEFAULTS.maxTokens  // 40,000
   };
   ```

4. **Update active config**:
   ```javascript
   setSmCompactConfig(finalConfig);
   ```

**Schema:**
```typescript
interface SmCompactConfig {
    minTokens: number;          // Minimum tokens to keep after compaction
    minTextBlockMessages: number; // Minimum text-containing messages to keep
    maxTokens: number;          // Maximum tokens to keep (threshold)
}
```

**Defaults:**
```javascript
{
    minTokens: 10000,          // Keep at least 10k tokens
    minTextBlockMessages: 5,   // Keep at least 5 text messages
    maxTokens: 40000           // Keep at most 40k tokens
}
```

**Validation:**
- Reject values ≤ 0
- Fall back to defaults for invalid/missing values

---

## Environment Variables

### Compaction Control

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DISABLE_COMPACT` | boolean | `false` | **Master disable** - Disables all compaction (standard, session memory, microcompaction) |
| `DISABLE_AUTO_COMPACT` | boolean | `false` | Disables auto-triggered compaction (manual compaction still works) |
| `DISABLE_MICROCOMPACT` | boolean | `false` | Disables microcompaction optimization |
| `ENABLE_CLAUDE_CODE_SM_COMPACT` | boolean | `false` | **Override to enable** session memory compaction (bypasses feature flags) |

**Usage:**
```bash
# Disable all compaction for debugging
export DISABLE_COMPACT=true

# Disable only auto-compaction (keep manual compaction working)
export DISABLE_AUTO_COMPACT=true

# Force-enable session memory compaction (ignore feature flags)
export ENABLE_CLAUDE_CODE_SM_COMPACT=true
```

### Threshold Overrides

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | float | - | Overrides auto-compact threshold percentage (e.g., `0.85` for 85% of context window) |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | int | - | Overrides blocking limit (tokens before user input blocked) |

**Usage:**
```bash
# Trigger compaction at 90% of context window (instead of default ~80%)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=0.90

# Set blocking limit to 5000 tokens (instead of default 3000)
export CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE=5000
```

### Precedence Examples

**Scenario 1: Enable session memory compaction**
```javascript
// Priority 1: Environment variable
if (parseBoolean(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) {
    return true;  // ✅ Enabled (env var override)
}

// Priority 2: Feature flags
if (checkFeatureFlag("tengu_session_memory") && checkFeatureFlag("tengu_sm_compact")) {
    return true;  // ✅ Enabled (feature flags)
}

// Priority 3: Default
return false;  // ❌ Disabled (default)
```

**Scenario 2: Disable all compaction**
```javascript
// Priority 1: DISABLE_COMPACT env var
if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return false;  // ❌ Disabled (env var override)
}

// ... rest of logic never runs
```

---

## Feature Flags

### Compaction Feature Flags

| Flag Name | Default | Description |
|-----------|---------|-------------|
| `tengu_session_memory` | `false` | Enables session memory subsystem (prerequisite for SM compaction) |
| `tengu_sm_compact` | `false` | Enables session memory compaction path |
| `tengu_compact_cache_prefix` | `false` | Enables prompt cache sharing for compaction (90% cost reduction) |
| `tengu_compact_streaming_retry` | `false` | Enables retry logic for failed streaming summarization |
| `tengu_cache_plum_violet` | `false` | Enables API-managed context (disables microcompaction) |

### Feature Flag Resolution

**Function:** `checkFeatureFlag(flagName, defaultValue)`

**Algorithm:**
1. Fetch flag value from remote config service
2. If fetch fails or flag undefined, return `defaultValue`
3. Otherwise, return fetched value (boolean)

**Caching:** Feature flags are cached for session duration (loaded once at startup)

---

## Threshold Calculation

### Auto-Compact Threshold

**Function:** `getAutoCompactThreshold` (SQ1)
**Location:** chunks.147.mjs:722-735

**Formula:**
```javascript
threshold = effectiveContextWindow - AUTO_COMPACT_BUFFER_OFFSET
```

Where:
- `effectiveContextWindow = modelContextLimit - MAX_COMPACT_BUFFER`
- `AUTO_COMPACT_BUFFER_OFFSET = 13,000 tokens`
- `MAX_COMPACT_BUFFER = 20,000 tokens`

**Example (Claude Sonnet 3.5, 200k context):**
```javascript
modelContextLimit = 200,000
effectiveContextWindow = 200,000 - 20,000 = 180,000
autoCompactThreshold = 180,000 - 13,000 = 167,000 tokens
```

**Override:**
```javascript
if (process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE) {
    let percentage = parseFloat(process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE);
    threshold = Math.floor(effectiveContextWindow * percentage);
}
```

### Warning and Error Thresholds

**Function:** `getCompactionStatus` (Ac)
**Location:** chunks.147.mjs:736-763

**Thresholds:**
```javascript
let effectiveWindow = getEffectiveContextWindow(model);  // modelLimit - 20k
let autoCompactThreshold = getAutoCompactThreshold(model);

let warningThreshold = autoCompactThreshold - TOKEN_WARNING_THRESHOLD;  // -20k
let errorThreshold = autoCompactThreshold - TOKEN_ERROR_THRESHOLD;      // -20k (same as warning)
let blockingLimit = effectiveWindow - BLOCKING_LIMIT_OFFSET;           // -3k from effective
```

**Status Levels:**
```javascript
{
    isAboveWarningThreshold: currentTokens >= warningThreshold,
    isAboveErrorThreshold: currentTokens >= errorThreshold,
    isAboveAutoCompactThreshold: currentTokens >= autoCompactThreshold,
    isAboveBlockingLimit: currentTokens >= blockingLimit,
    percentage: currentTokens / effectiveWindow
}
```

**Diagram:**
```
0                                           effectiveWindow (180k)    modelLimit (200k)
├───────────────────────────────────────────┼───────────────────────┼
                                            ↑                       ↑
                                            blocking (177k)         MAX_COMPACT_BUFFER

                       warning/error (147k) ↓
                                            autoCompact (167k) ↓
```

---

## Telemetry Events

### Standard Compaction Events

#### `tengu_compact`

**When:** After successful standard compaction
**Properties:**
```typescript
{
    preCompactTokenCount: number,              // Token count before compaction
    postCompactTokenCount: number,             // Token count after compaction
    compactionInputTokens: number,             // LLM API input tokens for summary
    compactionOutputTokens: number,            // LLM API output tokens (summary text)
    compactionCacheReadTokens: number,         // Prompt cache read tokens
    compactionCacheCreationTokens: number,     // Prompt cache creation tokens
    compactionTotalTokens: number,             // Total API cost tokens
    promptCacheSharingEnabled: boolean,        // Was cache sharing attempted?
    // ... metadata from last message
}
```

**Analysis:**
- **Token reduction:** `preCompactTokenCount - postCompactTokenCount`
- **Cache efficiency:** `cacheReadTokens / (cacheReadTokens + cacheCreationTokens + inputTokens)`
- **Cost:** `compactionTotalTokens × price_per_token`

#### `tengu_compact_failed`

**When:** Standard compaction fails
**Properties:**
```typescript
{
    reason: "no_summary" | "api_error" | "prompt_too_long",
    preCompactTokenCount: number,
    promptCacheSharingEnabled: boolean
}
```

**Failure Reasons:**
- `no_summary`: LLM returned empty/invalid response
- `api_error`: LLM API error (rate limit, server error, timeout)
- `prompt_too_long`: Conversation exceeds model's context window

#### `tengu_compact_cache_sharing_success`

**When:** Prompt cache sharing successfully reduces cost
**Properties:**
```typescript
{
    preCompactTokenCount: number,
    outputTokens: number,
    cacheReadInputTokens: number,
    cacheCreationInputTokens: number,
    cacheHitRate: number  // 0.0-1.0 (1.0 = 100% cache hit)
}
```

**Analysis:**
- **Cost savings:** `cacheHitRate × 0.9` (cache reads are ~10% of regular input cost)

#### `tengu_compact_cache_sharing_fallback`

**When:** Cache sharing fails, falling back to standard streaming
**Properties:**
```typescript
{
    reason: "no_text_response" | "error",
    preCompactTokenCount: number
}
```

#### `tengu_compact_streaming_retry`

**When:** Streaming retry attempted
**Properties:**
```typescript
{
    attempt: number,          // Retry attempt number (1, 2, ...)
    preCompactTokenCount: number
}
```

---

### Session Memory Compaction Events

#### `tengu_sm_compact_no_session_memory`

**When:** Session memory compaction attempted but no session notes file exists

#### `tengu_sm_compact_empty_template`

**When:** Session notes exist but are unmodified template (never filled in)

#### `tengu_sm_compact_summarized_id_not_found`

**When:** Last summarized message ID exists but message not found in array

#### `tengu_sm_compact_resumed_session`

**When:** Resumed session without prior summary (fresh compaction)

#### `tengu_sm_compact_threshold_exceeded`

**When:** Post-compaction token count exceeds auto-compact threshold
**Properties:**
```typescript
{
    postCompactTokenCount: number,
    autoCompactThreshold: number
}
```

#### `tengu_sm_compact_error`

**When:** Session memory compaction throws unexpected error

---

### Microcompaction Events

#### `tengu_microcompact`

**When:** After successful microcompaction
**Properties:**
```typescript
{
    toolsCompacted: number,            // Number of tool results compacted
    totalUncompactedTokens: number,    // Total tool result tokens before compaction
    tokensAfterCompaction: number,     // Tokens remaining after compaction
    tokensSaved: number,               // Tokens saved from tool result compaction
    imageTokensSaved: number,          // Tokens saved from image replacement
    imagesCleared: number,             // Number of images replaced with "[image]"
    triggerType: "auto" | "manual"     // How microcompaction was triggered
}
```

**Analysis:**
- **Total savings:** `tokensSaved + imageTokensSaved`
- **Compression ratio:** `tokensSaved / totalUncompactedTokens`

---

### Hook Events

#### `tengu_run_hook`

**When:** Before executing hooks
**Properties:**
```typescript
{
    hookName: string,               // e.g., "PreCompact:auto"
    numCommands: number,            // Number of hooks to execute
    pluginHookCounts?: string       // JSON with plugin hook breakdown
}
```

---

## Configuration Best Practices

### Development/Testing

```bash
# Disable all compaction for debugging
export DISABLE_COMPACT=true

# Enable session memory compaction locally
export ENABLE_CLAUDE_CODE_SM_COMPACT=true

# Trigger compaction earlier (at 70% instead of 80%)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=0.70
```

### Production

```bash
# Use default settings (controlled by feature flags)
# - No environment variables set
# - Feature flags managed by Claude servers
# - Defaults provide safe, tested behavior
```

### Performance Tuning

**Aggressive compaction (save tokens):**
```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=0.75  # Compact at 75%
```

**Conservative compaction (preserve context longer):**
```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=0.90  # Compact at 90%
```

---

## Telemetry Analysis Queries

### Token Savings by Path

```sql
SELECT
    SUM(CASE WHEN event = 'tengu_compact' THEN preCompactTokenCount - postCompactTokenCount END) as standard_savings,
    SUM(CASE WHEN event = 'tengu_microcompact' THEN tokensSaved + imageTokensSaved END) as microcompact_savings
FROM telemetry_events
WHERE event IN ('tengu_compact', 'tengu_microcompact')
```

### Cache Hit Rate

```sql
SELECT
    AVG(cacheHitRate) as avg_cache_hit_rate,
    COUNT(*) as cache_attempts
FROM telemetry_events
WHERE event = 'tengu_compact_cache_sharing_success'
```

### Failure Rate by Reason

```sql
SELECT
    reason,
    COUNT(*) as failures,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM telemetry_events WHERE event = 'tengu_compact') as failure_pct
FROM telemetry_events
WHERE event = 'tengu_compact_failed'
GROUP BY reason
```

---

## Symbol Updates

The following symbols should be added to `symbol_index_core_features.md` under **Module: Compact > Configuration**:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TZ6 | isSessionMemoryCompactEnabled | chunks.147.mjs:612 | function |
| gmY | setSmCompactConfig | chunks.147.mjs:501 | function |
| Gs4 | configLoaded | chunks.147.mjs:689 | variable (boolean) |

---

## Conclusion

The Configuration & Telemetry system provides **complete control and observability** for compaction:

**Configuration:**
1. **Layered hierarchy**: Env vars → Feature flags → Defaults
2. **Safe defaults**: Works out-of-box without configuration
3. **Flexible overrides**: Easy testing and debugging

**Telemetry:**
1. **Comprehensive events**: Every compaction path emits detailed metrics
2. **Performance tracking**: Token savings, cache efficiency, latency
3. **Failure analysis**: Detailed failure reasons for debugging

**Key takeaways:**
- Environment variables provide instant local overrides
- Feature flags enable gradual rollout of new features
- Telemetry enables data-driven optimization
- Defaults ensure system works without configuration

This architecture enables **observable, tunable compaction** - engineers can monitor performance, debug issues, and optimize thresholds based on real usage data.
