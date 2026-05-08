# Configuration and Telemetry

## Overview

The compact subsystem in v2.1.112 is highly configurable via environment variables, settings, and feature flags. It also emits a rich set of telemetry events that let Anthropic monitor usage patterns and detect regressions.

This document is the comprehensive reference for:
- Environment variables that control compact behavior
- User-configurable settings
- Feature flags (experiments)
- Constants that define limits and thresholds
- All telemetry events emitted by the subsystem

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry

---

## 1. Environment Variables

### Compact Disable Switches

| Variable | Type | Default | Effect |
|----------|------|---------|--------|
| `DISABLE_COMPACT` | boolean | unset | Disable ALL compact (auto + manual + cold). Slash command becomes hidden. |
| `DISABLE_AUTO_COMPACT` | boolean | unset | Disable autocompact only. Manual `/compact` still works. |

Both are checked in `z0()`:

```javascript
// chunks.159.mjs:1359-1363
function z0() {
    if (S6(process.env.DISABLE_COMPACT)) return !1;
    if (S6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return H8().autoCompactEnabled
}
```

`DISABLE_COMPACT` is also checked at `QkK`'s gate 1 (chunks.159.mjs:1382) to prevent autocompact from running.

### Window Size Overrides

| Variable | Type | Default | Range | Effect |
|----------|------|---------|-------|--------|
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | int | unset | 100,000 – 1,000,000 | Override the effective window size. Priority: env > settings > experiment > model. |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | float | unset | 1 – 100 | Lower the autocompact threshold to this percentage of effective window. Caps at default threshold. |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | int | model default | varies | Override max output tokens (affects `Yn` reservation). |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | int | unset | unbounded | Override model context. **ONLY applies when `DISABLE_COMPACT` is set.** |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | int | unset | unbounded | Override the hard-blocking limit (default = effective window − 3000). |

These let users tune the compact behavior for their model and use case. Common patterns:
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` — compact earlier (at 80% of window).
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW=120000` — restrict to a smaller effective window for testing.
- `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE=199000` — push the hard limit up if you trust your model's true max.

### `S6` Boolean Parsing

```javascript
// chunks.1.mjs (referenced)
function S6(s) {
  if (s === undefined) return false;
  return ["1", "true", "yes", "on"].includes(String(s).toLowerCase());
}
```

So `DISABLE_COMPACT=1`, `DISABLE_COMPACT=true`, `DISABLE_COMPACT=yes`, `DISABLE_COMPACT=on` all enable disabling. Other values (including `0`, `false`, empty string) leave it disabled.

---

## 2. Settings

The user can configure via `~/.claude/settings.json` (or workspace-level settings):

| Setting | Type | Default | Effect |
|---------|------|---------|--------|
| `autoCompactEnabled` | boolean | true | Master toggle for autocompact (ANDed with env vars). |
| `autoCompactWindow` | int (optional) | unset | Override the effective window. Priority: env > settings > experiment > model. |
| `hooks.PreCompact` | array | [] | PreCompact hooks (can block compact) |
| `hooks.PostCompact` | array | [] | PostCompact hooks (informational) |
| `hooks.SessionStart` | array (matcher: "compact") | [] | SessionStart hooks; subset matching `"compact"` source fires after compact. |

Priority of `autoCompactEnabled`:
1. `DISABLE_COMPACT` env → `false` regardless
2. `DISABLE_AUTO_COMPACT` env → `false` regardless
3. `H8().autoCompactEnabled` from settings → user choice

If unset in settings, defaults to `true`.

---

## 3. Feature Flags (Experiments)

Feature flags are evaluated via `u8(name, default)`. They're typically set per-user by Anthropic's experiment service.

### Compact-Related Flags

| Flag | Default | Effect |
|------|---------|--------|
| `tengu_amber_redwood` | "" | Window-size experiment (string with `m`/`k` suffix or plain int) |
| `tengu_cold_compact` | false | Strip non-essential content when prompt cache is cold (≥1.5h idle) |
| `tengu_compact_cache_prefix` | true | Try cache-prefix sharing pass before standard compact call |
| `tengu_hazel_osprey` | false | Master switch for the `context-hint-2026-04-09` reject-path beta |
| `tengu_cobalt_raccoon` | false | Identifies "ant" users (gates window-source restrictions, enables `XLY` reactive compact path) |

### Flag Effects in Detail

#### `tengu_amber_redwood`

```javascript
// chunks.159.mjs:1281-1286 (in Jn)
let z = z0() ? u8("tengu_amber_redwood", "") : "";
if (z) {
    let Y = s_7(z);
    if (Y !== void 0) return { window: Math.min(_, Y), configured: Y, source: "experiment" }
}
```

When set to a non-empty string, the experiment value is parsed by `s_7`:
- `"800k"` → 800,000
- `"1m"` → 1,000,000
- `"500"` → 500,000 (treated as thousands when 100-1000)
- `"500000"` → 500,000 (raw integer)

The parsed value becomes the effective window (clamped to model max).

#### `tengu_cold_compact`

```javascript
// chunks.159.mjs:1405 (in QkK)
let X = FDY() && u8("tengu_cold_compact", !1);
```

When true AND the cache is cold (≥1.5h idle), `vI6` runs with `stripNonEssential=true`. See [cold_compact.md](./cold_compact.md).

#### `tengu_compact_cache_prefix`

```javascript
// chunks.159.mjs:597 (in vI6)
let W = !w && u8("tengu_compact_cache_prefix", !0),
```

When true (and not in cold-compact mode), the cache-prefix optimization runs as Phase 3a. See [cache_prefix_compact.md](./cache_prefix_compact.md).

#### `tengu_hazel_osprey`

```javascript
// chunks.194.mjs:790-792
function x85() {
    return u8("tengu_hazel_osprey", !1)
}
```

When true, the `context-hint-2026-04-09` beta is sent on requests, and the `d85` reject handler is enabled. See [context_hint_path.md](./context_hint_path.md).

#### `tengu_cobalt_raccoon`

```javascript
// chunks.101.mjs:1530-1533
function bx() {
    if (I7()) return !1;
    return u8("tengu_cobalt_raccoon", !1)
}
```

When true, the user is treated as "ant":
- Window-source restriction in `gDY` (only env or settings allowed for autocompact)
- `/compact` slash-command routes to `XLY` (reactive compact) instead of `vI6` (standard)

The `I7()` check first short-circuits — if some other condition is true, `bx()` returns false regardless.

---

## 4. Constants

### Threshold Constants (chunks.159.mjs)

| Constant | Line | Value | Used in | Purpose |
|----------|------|-------|---------|---------|
| `uDY` | 1443 | 20,000 | `Yn` | MAX_OUTPUT_RESERVATION cap |
| `o_7` | 1445 | 100,000 | `Jn` | MIN_AUTOCOMPACT for env vars |
| `$LK` | 1447 | 1,000,000 | `Jn` | MAX_AUTOCOMPACT for env vars |
| `t_7` | 1449 | 13,000 | `v38` | AUTOCOMPACT_BUFFER (threshold = window − 13k) |
| `mDY` | 1451 | 20,000 | `UM6` | WARNING_THRESHOLD_OFFSET |
| `BDY` | 1453 | 20,000 | `UM6` | ERROR_THRESHOLD_OFFSET |
| `e_7` | 1455 | 3,000 | `UM6` | BLOCKING_LIMIT_RESERVE |
| `wLK` | 1457 | 3 | `QkK` | CONSECUTIVE_FAILURE_LIMIT |
| `a_7` | 1459 | 3 | `QkK` | RAPID_REFILL_TURN_WINDOW |
| `jLK` | 1461 | 3 | `QkK` | RAPID_REFILL_LIMIT |
| `pDY` | 1465 | 5,400,000 | `FDY` | COLD_CACHE_THRESHOLD (1.5h in ms) |

### Post-Compact Restoration Constants

| Constant | Value | Used in | Purpose |
|----------|-------|---------|---------|
| `kx8` | 5 | `Nx8` | Max files to restore |
| `yDY` | 50,000 | `Nx8` | Aggregate token budget for files |
| `LDY` | 5,000 | `Nx8` | Per-file truncation cap |
| `RDY` | 25,000 | `yx8` | Aggregate token budget for skills |
| `hDY` | 5,000 | `yx8` | Per-skill truncation cap |

### Microcompact Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `Q6A` | 5 | DEFAULT_KEEP_RECENT for `qD4` (only caller passes this) |
| `r4z` | 2,000 | IMAGE_TOKEN_ESTIMATE per image/document block |
| `sR8` | `"[Old tool result content cleared]"` | Cleared marker for tool results |
| `o4z` | Set | COMPACTABLE_TOOLS_SET (tools whose results can be cleared) |

### PTL/Error Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `qLK` | 3 | PTL_RETRY_LIMIT |
| `cI` | `"Prompt is too long"` | PTL detection prefix |
| `_LK` | `"Conversation too long. Press esc twice..."` | PTL exhaustion user message |
| `ayK` | `"[earlier conversation truncated for compaction retry]"` | PTL truncation marker |
| `at` | `"API Error: Request was aborted."` | User abort detection |
| `GI6` | `"Compaction blocked by PreCompact hook"` | Pre-compact-block error prefix |
| `ql8` | `"Compaction interrupted · This may be due to network issues..."` | Network interrupt error |
| `okK` | rapid-refill error template | Thrash explanation |
| `QI6` | `"Not enough messages to compact."` | Empty conversation error |

### Context-Hint Constants (chunks.194.mjs)

| Constant | Value | Purpose |
|----------|-------|---------|
| `I85` | `"context-hint-2026-04-09"` | Beta header name |
| `Q85` | empty Set | Default cleared-IDs in reject result |

---

## 5. Telemetry Events

### Compact Lifecycle Events

#### `tengu_compact`

Fired on successful full compact. The most important compact event.

```javascript
{
  preCompactTokenCount: number,                      // Tokens before compact
  stripNonEssential: boolean,                        // Cold-compact mode
  postCompactTokenCount: number,                     // Planned (from API response)
  truePostCompactTokenCount: number,                 // Actual after attachments
  autoCompactThreshold: number,                      // The threshold that triggered (or -1 for manual)
  willRetriggerNextTurn: boolean,                    // True if truePost >= threshold
  isAutoCompact: boolean,                            // false for manual /compact
  querySource: string,                               // "repl_main_thread" / "agent:..." / "compact"
  queryChainId: string,                              // For correlating across query forks
  queryDepth: number,
  isRecompactionInChain: boolean,                    // Already compacted in this chain?
  turnsSincePreviousCompact: number,                 // -1 if no previous
  previousCompactTurnId: string,
  compactionInputTokens: number,
  compactionOutputTokens: number,
  compactionCacheReadTokens: number,
  compactionCacheCreationTokens: number,
  compactionTotalTokens: number,
  promptCacheSharingEnabled: boolean,                // True if cache-prefix attempted
  // ... plus per-message stats from Kx8(qx8(messages))
}
```

Fired in `vI6` Phase 7 (chunks.159.mjs:678).

#### `tengu_compact_failed`

Fired on failed full compact. The `reason` field distinguishes failure modes:

```javascript
{
  reason: "prompt_too_long" | "no_summary" | "api_error" | "no_streaming_response",
  preCompactTokenCount: number,
  promptCacheSharingEnabled: boolean,
  // optional:
  ptlAttempts: number,                               // For PTL exhaustion
  hasStartedStreaming: boolean,                      // For no_streaming_response
}
```

#### `tengu_compact_ptl_retry`

Fired on each PTL retry attempt within `vI6` outer loop:

```javascript
{
  attempt: number,                                   // 1-3
  droppedMessages: number,                           // How many were truncated
  remainingMessages: number,
  path?: "partial",                                  // Only for zLK partial compact
}
```

#### `tengu_compact_cache_sharing_success`

Fired when the Phase 3a cache-prefix attempt succeeds:

```javascript
{
  preCompactTokenCount: number,
  outputTokens: number,
  cacheReadInputTokens: number,
  cacheCreationInputTokens: number,
  cacheHitRate: number,                              // 0.0-1.0
}
```

#### `tengu_compact_cache_sharing_fallback`

Fired when the Phase 3a attempt fails or returns invalid:

```javascript
{
  reason: "no_text_response" | "error",
  preCompactTokenCount: number,
}
```

### Partial Compact Events

#### `tengu_partial_compact`

Fired on successful partial compact:

```javascript
{
  preCompactTokenCount: number,
  postCompactTokenCount: number,
  messagesKept: number,
  messagesSummarized: number,
  direction: "up_to" | "from",
  hasUserFeedback: boolean,
  trigger: "message_selector",
  compactionInputTokens: number,
  compactionOutputTokens: number,
  compactionCacheReadTokens: number,
  compactionCacheCreationTokens: number,
}
```

#### `tengu_partial_compact_failed`

Same `reason` taxonomy as `tengu_compact_failed`, plus:

```javascript
{
  reason: "prompt_too_long" | "no_summary" | "api_error",
  preCompactTokenCount: number,
  direction: "up_to" | "from",
  messagesSummarized: number,
  ptlAttempts?: number,
}
```

### Microcompact Events

#### `tengu_time_based_microcompact`

Fired by `qD4` when KEEP-RECENT MC actually clears something:

```javascript
{
  toolsCleared: number,
  toolsKept: number,
  keepRecent: number,                                // = 5 (Q6A) for current caller
  tokensSaved: number,
  trigger: "context_hint",                           // Only trigger in v2.1.112
}
```

### Context-Hint Events

#### `tengu_context_hint_reject`

Fired when 422/424 triggers `d85` reject handler:

```javascript
{
  requestId: string,
  preCompactTokenEstimate: number,
  postCompactTokenEstimate: number,
  tokensSaved: number,
  thinkingCleared: boolean,
  mcApplied: boolean,
  mcTokensSaved: number,
}
```

#### `tengu_context_hint_busy_fallback`

Fired for non-recoverable rejection paths (409, 400 bad beta, 529):

```javascript
{
  requestId: string,
  status: 409 | 400 | 529,
}
```

#### `tengu_thinking_clear_latched`

Fired exactly once per session, on the first 422/424:

```javascript
{
  trigger: "context_hint",                           // Only trigger in v2.1.112
  estimatedThinkingTokens: number,                   // Math.round(thinkingChars / 4)
}
```

### Autocompact-Specific Events

#### `tengu_auto_compact_rapid_refill_breaker`

Fired in the per-turn loop when rapid-refill breaker trips:

```javascript
{
  consecutiveRapidRefills: number,                   // The count at trip-time
  turnsSincePreviousCompact: number,
  queryChainId: string,
  queryDepth: number,
}
```

### State Restoration Events

#### `tengu_post_compact_file_restore_success`

Fired by `Nx8` per successfully restored file:

```javascript
{
  // (fields from p97 file-reader telemetry, file-specific)
}
```

#### `tengu_post_compact_file_restore_error`

Fired per failed file restoration:

```javascript
{
  // (error fields from p97)
}
```

### OpenTelemetry-Format Event

#### `compaction` (via `aK6`)

Fired in `vI6`'s `finally` block. This is the **OpenTelemetry trace event** (separate format from `tengu_*`):

```javascript
{
  trigger: "auto" | "manual",
  success: "true" | "false",
  duration_ms: string,
  pre_tokens?: string,
  post_tokens?: string,
  error?: string,
}
```

This event is consumed by external observability tools (Datadog, Honeycomb, etc.). Note all values are stringified — OpenTelemetry attribute values are typically strings.

---

## 6. Status Constants for SDK

The SDK status (visible to programmatic clients) reflects compact state:

| Status | When |
|--------|------|
| `"compacting"` | Set by `vI6` Phase 1 (`K.setSDKStatus?.("compacting")`) |
| `null` (with `compactResult`) | Cleared by `vI6` `finally` block |
| `compactResult: "success"` | Successful compact |
| `compactResult: "failed"` | Failed compact |
| `compactError: <message>` | Failure detail (only with `failed`) |

Programmatic clients can poll the SDK status to know when compact is in progress and what the outcome was.

---

## 7. Configuration Workflows

### Disable Compact Entirely

```bash
export DISABLE_COMPACT=1
```

- Autocompact won't fire.
- `/compact` slash command becomes hidden.
- `CLAUDE_CODE_MAX_CONTEXT_TOKENS` env can override model context (only when this is set).

### Disable Just Autocompact, Keep Manual

```bash
export DISABLE_AUTO_COMPACT=1
```

- Autocompact won't fire.
- `/compact` still available.
- User explicitly controls compaction timing.

### Make Autocompact Fire Earlier

```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80
```

Threshold becomes `min(0.8 × effectiveWindow, defaultThreshold)`.
For 200K Sonnet: `min(0.8 × 180000, 167000) = min(144000, 167000) = 144000`.

So autocompact fires at 144K tokens instead of 167K.

### Restrict to a Smaller Window

```bash
export CLAUDE_CODE_AUTO_COMPACT_WINDOW=120000
```

Effective window becomes 120K (clamped to model max). Threshold becomes 120K − 13K = 107K. Autocompact fires at 107K.

### Higher Blocking Limit

```bash
export CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE=199000
```

Conversation can grow to 199K before the agent loop refuses further turns. Useful if you trust the model's true max context.

### Configure PreCompact Hook

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "manual",
        "hooks": [
          {
            "type": "command",
            "command": "if ! npm test --silent; then echo '{\"decision\":\"block\",\"reason\":\"tests failing\"}'; fi"
          }
        ]
      }
    ]
  }
}
```

Manual `/compact` runs the test suite. If tests fail, compact is blocked with a clear reason.

### Configure SessionStart Hook for Compact Context

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Resuming session in $(pwd)\\nCurrent branch: $(git branch --show-current)\""
          }
        ]
      }
    ]
  }
}
```

After every compact, the model receives an attachment with the working directory and branch info.

---

## 8. Telemetry Sampling and Volume

For a typical heavy user (multiple sessions per day):

| Event | Rate per user-day | Triggered by |
|-------|--------------------|--------------|
| `tengu_compact` | 5-20 | autocompact + `/compact` |
| `tengu_compact_cache_sharing_success` | 4-18 (≈85%-95% of compacts) | Phase 3a success |
| `tengu_compact_cache_sharing_fallback` | 0-2 | Phase 3a failure |
| `tengu_compact_ptl_retry` | 0-3 | PTL on rare large prompts |
| `tengu_compact_failed` | 0-1 | Network blip, model regression |
| `tengu_partial_compact` | 0-2 | User uses message-selector |
| `tengu_time_based_microcompact` | 0-1 (rare) | Only on context_hint reject |
| `tengu_context_hint_reject` | 0-1 (rare) | Only on 422/424 |
| `tengu_thinking_clear_latched` | 0-1 (per session) | First 422/424 of session |
| `tengu_auto_compact_rapid_refill_breaker` | 0 (very rare) | Pathological large content |

The high volume of `tengu_compact` events makes them suitable for trend analysis (per-user, per-team, per-version). The rare events are useful for debugging specific issues.

---

## 9. Constants Definitions in Bundled Code

For reproducibility, here are the exact constant declarations in chunks.159.mjs (excerpted):

```javascript
// chunks.159.mjs:1443-1465
uDY = 20000        // MAX_OUTPUT_RESERVATION
o_7 = 1e5          // MIN_AUTOCOMPACT
$LK = 1e6          // MAX_AUTOCOMPACT
t_7 = 13000        // AUTOCOMPACT_BUFFER
mDY = 20000        // WARNING_THRESHOLD_OFFSET
BDY = 20000        // ERROR_THRESHOLD_OFFSET
e_7 = 3000         // BLOCKING_LIMIT_RESERVE
wLK = 3            // CONSECUTIVE_FAILURE_LIMIT
a_7 = 3            // RAPID_REFILL_TURN_WINDOW
jLK = 3            // RAPID_REFILL_LIMIT
pDY = 5400000      // COLD_CACHE_THRESHOLD (1.5h in ms)
```

---

## 10. Dynamic Configuration from `getAppState`

Some configuration is read from app state at runtime:

| Field | Source | Used by |
|-------|--------|---------|
| `mainLoopModel` | `K.options.mainLoopModel` | All compact paths (model determines max context) |
| `autoCompactWindow` | `K.getAppState().autoCompactWindow` | `Jn` (settings priority) |
| `toolPermissionContext` | `K.getAppState().toolPermissionContext` | `Lx8` (plan-mode check) |
| `tasks` | `K.getAppState().tasks` | `hx8` (task status restoration) |
| `replContexts` | `K.getAppState().replContexts` | `b18` (REPL clearing notice) |

These are read at compact-time (not snapshot at session start), so changes during the session affect the next compact.

---

## 11. Summary of Anthropic Telemetry Use

The telemetry serves several purposes:

1. **Production health monitoring**: success rates, error rates, latency.
2. **Cost analysis**: cache hit rates, input/output tokens per compact.
3. **A/B test analysis**: compare metrics between experiment groups.
4. **Regression detection**: sudden change in `tengu_compact_failed` rates.
5. **Capacity planning**: aggregate token consumption across users.
6. **User-experience metrics**: how often does the rapid-refill breaker trip?
7. **Algorithm tuning**: average `cacheHitRate` informs cache TTL strategy.

The granularity (per-event with detailed fields) lets the team answer specific questions like:
- "Did the v2.1.110 → v2.1.112 change improve cache hit rate?"
- "Are users with `tengu_cold_compact` enabled saving cost?"
- "Is the new context-hint path saving users from `_LK` errors?"
- "Which file types are most often dropped by the post-compact budget?"

---

## 12. Key Insight

The compact subsystem is **comprehensively configurable** at three levels:

- **Hard switches** (env vars) for users who need predictable behavior.
- **Soft switches** (settings) for everyday user preference.
- **Experiment flags** for Anthropic-controlled rollouts and A/B tests.

This three-tier configurability lets the same binary serve:
- Power users who need aggressive thresholds (`PCT_OVERRIDE=80`).
- Conservative users who never want compact (`DISABLE_COMPACT=1`).
- Default users who get model defaults plus active experiments.
- Anthropic ant-team users who get experimental code paths (`bx()` returns true).

The telemetry layer is what makes this manageable — without it, configuration changes would be deployed blindly. With it, every config change can be measured against telemetry trends, enabling data-driven iteration.
