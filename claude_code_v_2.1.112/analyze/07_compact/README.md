# Context Compaction Module (07_compact) — v2.1.112

## Overview

**Context Compaction** is a critical subsystem in Claude Code v2.1.112 that manages the LLM's finite context window. It ensures conversations can continue indefinitely by intelligently summarizing older parts of the conversation while preserving essential state (files, tasks, plans, skills, todos, MCP instructions, agent listings).

In v2.1.112 the system implements a **dual-track compaction architecture**:

1. **Local autocompact (LLM-based)** — runs every turn from the agent loop. Replaces the entire conversation with a 2–3 KB LLM-produced summary plus state attachments.
2. **Server-driven `context_hint` reject path (NEW in v2.1.112)** — runs only when the API returns 422/424. Surgically clears old tool results and thinking blocks, then retries the request once.

A third optional layer exists in source but is **dead-code-eliminated** in the shipped binary:

3. **`snip` / `marble-origami` (context-collapse)** — gated behind feature flags `HISTORY_SNIP` and `CONTEXT_COLLAPSE`. The bundler removes both. Only forward-compatibility persistence shims survive. See [dead_code_audit.md](./dead_code_audit.md).

## Key Characteristics

- **State Anchoring** — Files, plans, skills, todos, agent listings, MCP instructions, and discovered tools survive compaction via attachment messages re-injected post-compact.
- **Two Circuit Breakers** — Consecutive-failure (3 errors → silent skip) and rapid-refill (3 refills within 3-turn windows → user-visible thrash error).
- **Threshold-Based Triggers** — Multi-level thresholds (warning, error, auto-compact, blocking).
- **Hook Integration** — `PreCompact` (can block via `decision: "block"`) and `PostCompact`; SessionStart fires post-compact under the `compact` source.
- **Three Retry Paths** — Cache-prefix sharing → standard streaming → PTL truncation retry (3 attempts).
- **Token Budgeting** — Strict per-file (5k), per-skill (5k), aggregate file (50k), aggregate skill (25k) caps prevent unbounded post-compact growth.
- **Feature-Gated Cold-Compact Stripping** — When the prompt cache has been cold ≥ 90 minutes AND `tengu_cold_compact` is on, sends a stripped-down compact request (no tools, no images, truncated tool results).

## Module Structure

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | High-level architecture and the full compact lifecycle (8 phases) |
| [trigger_mechanism.md](./trigger_mechanism.md) | Threshold math, window-source priority, the dispatcher gate cascade |
| [standard_compaction.md](./standard_compaction.md) | The full `vI6` LLM pipeline — phases, return shape, telemetry |
| [partial_compaction.md](./partial_compaction.md) | The `zLK` `up_to`/`from`-cursor variant used by `/compact <range>` |
| [microcompaction.md](./microcompaction.md) | The `qD4` KEEP-RECENT MC + the per-turn `_c` no-op stub |
| [prompt_builder.md](./prompt_builder.md) | Compact prompt construction (`fx8`, `Q0z`, `d0z`, `SI4`) |
| [context_hint_path.md](./context_hint_path.md) | NEW 422/424 reject + thinking-clear-latched recovery flow |
| [api_context_management.md](./api_context_management.md) | The `clear_thinking_20251015` server-side API strategy |
| [state_preservation.md](./state_preservation.md) | Collectors for files, plans, skills, tasks; reminder builders |
| [hooks_system.md](./hooks_system.md) | `PreCompact`, `PostCompact`, `SessionStart("compact")` hooks |
| [slash_command.md](./slash_command.md) | `/compact [instructions]` command and reactive flow |
| [cold_compact.md](./cold_compact.md) | `tengu_cold_compact` strip-non-essential path (`SDY`/`CDY`) |
| [cache_prefix_compact.md](./cache_prefix_compact.md) | `tengu_compact_cache_prefix` cache-sharing optimization |
| [edge_cases_and_failures.md](./edge_cases_and_failures.md) | Two breakers, PTL retry, network errors, hook blocks |
| [configuration_and_telemetry.md](./configuration_and_telemetry.md) | Env vars, feature flags, telemetry events |
| [query_pipeline_integration.md](./query_pipeline_integration.md) | Per-turn loop integration in `chunks.154.mjs` |
| [dead_code_audit.md](./dead_code_audit.md) | Snip + marble-origami: what was eliminated, what survives |
| [VERSION_DIFF_2188_TO_21112.md](./VERSION_DIFF_2188_TO_21112.md) | **Deep diff between v2.1.88 (leaked source) and v2.1.112 (binary)** — what was added/removed/preserved |
| [CROSS_VALIDATION.md](./CROSS_VALIDATION.md) | Cross-validation against `claude-code/src/services/compact/` source-tree — version-divergence map (note: original §G version-ordering was inverted; see VERSION_DIFF for correction) |

## Architecture: Dual-Track Compaction

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Agent Main Loop (yy)                                │
│                          chunks.154.mjs:880-1226                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────────┐
                │                   │                       │
                ▼                   ▼                       ▼
        microcompact          autocompact         (assistant turn,
       chunks.154:1006      chunks.154:1010        API call)
                │                   │                       │
                ▼                   ▼                       ▼
        _c (no-op)           QkK (autocompact)    Streamed response
        chunks.85:1207       chunks.159:1379               │
        Returns                  │                          │
        {messages}               │                          │
                                 ▼                          │
                  ┌──────────────────────────────┐         │
                  │  GATE 1  DISABLE_COMPACT?    │         │
                  │  GATE 2  failures ≥ 3?       │         │
                  │  GATE 3  shouldCompact (gDY) │         │
                  │  GATE 4  rapid-refill ≥ 3?   │         │
                  └──────────────────────────────┘         │
                                 │                          │
                       (all pass, run vI6)                  │
                                 │                          │
                                 ▼                          │
                  ┌──────────────────────────────┐          │
                  │  vI6 (compactConversation)   │          │
                  │  chunks.159.mjs:574-747      │          │
                  │                              │          │
                  │  PHASE 1  PreCompact hook    │          │
                  │  PHASE 2  Build prompt (fx8) │          │
                  │  PHASE 3a Cache-prefix call  │          │
                  │  PHASE 3b Standard call (ALK)│          │
                  │  PHASE 3c PTL retry x3 (KLK) │          │
                  │  PHASE 4  Restore state      │          │
                  │  PHASE 5  System reminders   │          │
                  │  PHASE 6  SessionStart hook  │          │
                  │  PHASE 7  Boundary marker    │          │
                  │  PHASE 8  PostCompact hook   │          │
                  └──────────────────────────────┘          │
                                                             │
                                                             ▼
                                          ┌──────────────────────────────┐
                                          │  API returned 422/424?       │
                                          │  AND beta=context-hint?      │
                                          │  → d85() reject handler      │
                                          │  chunks.194.mjs:856-887      │
                                          │                              │
                                          │  STEP A  Clear thinking      │
                                          │          (latch once)        │
                                          │  STEP B  qD4 KEEP-RECENT MC  │
                                          │          (last 5 tools)      │
                                          │  STEP C  Retry once          │
                                          └──────────────────────────────┘
```

## Key Algorithms

### 1. Threshold Calculation

```
Model context (e.g. 200_000 for Sonnet 4.5)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Effective Context Window  (Yn)                              │
│  = min(modelContext, configuredWindow) − min(maxOut, 20_000) │
│  = 200_000 − min(64_000, 20_000) = 180_000                   │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Auto-Compact Threshold  (v38)                               │
│  = effectiveWindow − 13_000 (t_7)                            │
│  = 180_000 − 13_000 = 167_000                                │
│  (Optionally floored by CLAUDE_AUTOCOMPACT_PCT_OVERRIDE)     │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Warning / Error Thresholds  (UM6)                           │
│  = autoCompactThreshold − 20_000 (mDY/BDY)                   │
│  = 147_000 (warning fires here)                              │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Blocking Limit  (UM6)                                       │
│  = effectiveWindow − 3_000 (e_7)   [unless ENV override]    │
│  = 177_000 (refuse to send any further turn)                 │
└─────────────────────────────────────────────────────────────┘
```

See [trigger_mechanism.md](./trigger_mechanism.md) for the full window-source resolution and `gDY` / `UM6` walk-throughs.

### 2. Dispatcher Gate Cascade

```
QkK(messages, ctx, deps, source, tracking, snipTokensFreed=undefined→0)
  │
  ├─ Gate 1  DISABLE_COMPACT env?           true → SKIP
  ├─ Gate 2  consecutiveFailures ≥ 3?       true → SKIP
  ├─ Gate 3  shouldCompact() (gDY)          false → SKIP
  ├─ Gate 4  rapidRefill ≥ 3 in <3 turns?   true → THRASH ERROR
  └─ Gate 5  vI6 (full compact)
              ├─ try    → wasCompacted=true
              └─ catch
                  ├─ PreCompact-blocked  → SILENT SKIP (no failure++)
                  ├─ user abort          → rethrow
                  └─ other               → failures++
```

### 3. State Anchoring (Post-Compact Reconstruction)

```javascript
let preservedReadFiles = pe6(K.readFileState);  // snapshot
K.readFileState.clear();
K.loadedNestedMemoryPaths?.clear();
sj6(K.memorySelector);

let [restoredFiles, restoredMemory] = await Promise.all([
  Nx8(preservedReadFiles, K, kx8 /* =5 */),     // POST_COMPACT_MAX_FILES
  hx8(K),                                        // task statuses
]);
let attachments = [...restoredFiles, ...restoredMemory];

if (planAttachment       = Ex8(K.agentId)) attachments.push(planAttachment);
if (asyncAgentAttachment = await Lx8(K))   attachments.push(asyncAgentAttachment);
if (skillAttachment      = yx8(K.agentId)) attachments.push(skillAttachment);

// System reminders re-injected: tools, agents, MCP servers
for (const r of MR6(...)) attachments.push(Y4(r));   // deferred_tools_delta
for (const r of PR6(...)) attachments.push(Y4(r));   // agent_listing_delta
for (const r of WR6(...)) attachments.push(Y4(r));   // mcp_instructions_delta

// Run SessionStart hook with source="compact"
let hookResults = await lR("compact", {model: K.options.mainLoopModel});
```

See [state_preservation.md](./state_preservation.md) for collector details.

## Key Constants

| Constant | Value | Purpose | File:Line |
|----------|-------|---------|-----------|
| `wLK` | 3 | Consecutive-failure breaker threshold | chunks.159.mjs:1457 |
| `jLK` | 3 | Rapid-refill breaker count | chunks.159.mjs:1461 |
| `a_7` | 3 | Rapid-refill turn window | chunks.159.mjs:1459 |
| `qLK` | 3 | PTL retry attempts within `vI6` | chunks.159.mjs (constants) |
| `kx8` | 5 | Max files to restore post-compact | chunks.159.mjs (constants) |
| `yDY` | 50,000 | Aggregate token budget for restored files | chunks.159.mjs (constants) |
| `LDY` | 5,000 | Per-file truncation cap | chunks.159.mjs (constants) |
| `RDY` | 25,000 | Aggregate token budget for restored skills | chunks.159.mjs (constants) |
| `hDY` | 5,000 | Per-skill truncation cap | chunks.159.mjs (constants) |
| `uDY` | 20,000 | MAX_OUTPUT_RESERVATION (cap inside `Yn`) | chunks.159.mjs:1443 |
| `t_7` | 13,000 | AUTOCOMPACT_BUFFER (threshold = window − reservation − buffer) | chunks.159.mjs:1449 |
| `e_7` | 3,000 | BLOCKING_LIMIT_RESERVE | chunks.159.mjs:1455 |
| `mDY` | 20,000 | WARNING_THRESHOLD_OFFSET | chunks.159.mjs:1451 |
| `BDY` | 20,000 | ERROR_THRESHOLD_OFFSET | chunks.159.mjs:1453 |
| `o_7` | 100,000 | MIN_AUTOCOMPACT (env-var lower bound) | chunks.159.mjs:1445 |
| `$LK` | 1,000,000 | MAX_AUTOCOMPACT (env-var upper bound) | chunks.159.mjs:1447 |
| `pDY` | 5,400,000 ms (1.5 h) | Cold-cache threshold for strip-non-essential | chunks.159.mjs:1465 |
| `Q6A` | 5 | DEFAULT_KEEP_RECENT for `qD4` MC | chunks.194.mjs:964 |
| `r4z` | 2,000 | IMAGE_TOKEN_ESTIMATE (per image/document) | chunks.85.mjs |
| `sR8` | "[Old tool result content cleared]" | Time-based MC cleared marker | chunks.85.mjs:1276 |
| `GI6` | "Compaction blocked by PreCompact hook" | Pre-compact-block error prefix | chunks.159.mjs |
| `cI` | "Prompt is too long" | PTL response detection | chunks.159.mjs |
| `at` | "API Error: Request was aborted." | User-abort detection | chunks.159.mjs |
| `_LK` | "Conversation too long. Press esc twice…" | PTL exhaustion user message | chunks.159.mjs |
| `ayK` | "[earlier conversation truncated for compaction retry]" | PTL truncation marker injected as msg[0] | chunks.159.mjs |
| `okK` | rapid-refill user error template | Thrash explanation user-facing message | chunks.159.mjs |
| `ql8` | "Compaction interrupted · This may be due to network issues…" | Network-interrupt error | chunks.159.mjs |
| `QI6` | "Not enough messages to compact." | Empty input early-return | chunks.159.mjs |
| `I85` | "context-hint-2026-04-09" | Beta header for server-side overflow recovery | chunks.194.mjs:846 |

## Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `DISABLE_COMPACT` | boolean | Disable all compaction (autocompact, manual, cold) |
| `DISABLE_AUTO_COMPACT` | boolean | Disable autocompact only — `/compact` still works |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | number 1–100 | Lower autocompact threshold to a percentage of effective window |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | int 100k–1M | Override the effective window |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | int | Override the hard-blocking limit |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | int | Override max output tokens (affects `Yn`) |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | int | Override model context (only when `DISABLE_COMPACT` is set) |

## Feature Flags

| Flag | Effect |
|------|--------|
| `tengu_amber_redwood` | Window-size experiment (string with `m`/`k` suffix or plain int) |
| `tengu_cold_compact` | Strip non-essential content when prompt cache is cold (≥1.5h idle) |
| `tengu_compact_cache_prefix` | Try cache-prefix sharing pass before standard compact call |
| `tengu_hazel_osprey` | Master switch for the `context-hint-2026-04-09` reject-path beta |
| `tengu_cobalt_raccoon` | Identifies "ant" users (gates window-source restrictions) |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Loop/State integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — API/telemetry
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash commands

Key functions:
- `autocompactDispatcher` (`QkK`) — chunks.159.mjs:1379 — Top-level autocompact gate cascade
- `compactConversation` (`vI6`) — chunks.159.mjs:574 — Full LLM compact (8-phase lifecycle)
- `partialCompactConversation` (`zLK`) — chunks.159.mjs:749 — `up_to`/`from`-cursor variant
- `shouldCompact` (`gDY`) — chunks.159.mjs:1365 — Threshold check + ant-user gate
- `getAutoCompactThreshold` (`v38`) — chunks.159.mjs:1320 — Threshold math + env override
- `getEffectiveContextWindow` (`Yn`) — chunks.159.mjs:1307
- `resolveWindowSource` (`Jn`) — chunks.159.mjs:1266 — env > settings > experiment > model
- `computeContextThresholds` (`UM6`) — chunks.159.mjs:1334 — UI status calculator
- `isCacheCold` (`FDY`) — chunks.159.mjs:1316 — 1.5h idle check
- `truncateHeadForPTLRetry` (`KLK`) — chunks.159.mjs:512 — Drop ~20% of head on PTL
- `compactPromptBuilder` (`fx8`) — chunks.101.mjs:679 — Full-compact prompt
- `partialCompactPrompt` (`Q0z`) — chunks.101.mjs:827 — `up_to`/`from` variant
- `microcompactStub` (`_c`) — chunks.85.mjs:1207 — Per-turn no-op
- `keepRecentMicrocompact` (`qD4`) — chunks.85.mjs:1235 — Server-driven only
- `contextHintReject` (`d85`) — chunks.194.mjs:856 — 422/424 + thinking-clear path
- `contextHintApplyAndRetry` (`NJ7`) — chunks.194.mjs:889
- `getAPIContextManagement` (`C85`) — chunks.194.mjs:741 — `clear_thinking_20251015` only
- `preCompactBlocked` (`ec8`) — chunks.159.mjs:533 — Throws `GI6`-prefixed error
- `restoreFilesPostCompact` (`Nx8`) — chunks.159.mjs:1057
- `loadMemoryPaths` (`hx8`) — chunks.159.mjs:1125
- `collectInvokedSkillsAttachment` (`yx8`) — chunks.159.mjs:1092
- `collectPlanAttachment` (`Ex8`) — chunks.159.mjs:1081
- `collectAsyncAgentAttachment` (`Lx8`) — chunks.159.mjs:1112
- `createCompactBoundaryMessage` (`p18`) — chunks.166.mjs:118
- `compactSummaryContent` (`b18`) — chunks.101.mjs:804
- `recordContextCollapseCommit` (`XtY`) — chunks.191.mjs:1102 — Write-only persistence shim
- `recordContextCollapseSnapshot` (`MtY`) — chunks.191.mjs:1112 — Write-only persistence shim

## Integration Points

### Agent Loop Integration

Per-turn (`chunks.154.mjs:1006-1022`):

1. **microcompact** (`_c`) — No-op stub, just clears warning suppression. Returns `{messages: q}` unchanged.
2. **autocompact** (`H.autocompact` → `QkK`) — Runs the gate cascade and may invoke `vI6`.
3. **Telemetry markers** — `query_autocompact_start` and `query_autocompact_end` bracket the call.
4. **Rapid-refill handling** — If `J6` (rapidRefillBreakerTripped) returns true, yield a user-facing thrash error (`okK`) and exit the loop.

### `context_hint` Integration

Wired through `d6A` (build-context-hint-handler) at chunks.194.mjs:906-962:
- `buildRequestParams()` — Adds the `context-hint-2026-04-09` beta header and `context_hint: { enabled: true }` body field.
- `onRequestError()` — On 422/424, calls `NJ7` to apply MC + thinking-clear. On 400 bad-beta, falls back. On 409 busy or 529, returns null.
- `classifyStreamError()` / `onStreamFallback()` — Handles overflow surfacing mid-stream.

### Hook Integration

- **PreCompact** (`oc`) — Runs before LLM summarization. Can return `decision: "block"` (throws `GI6`-prefixed error → silent skip) or inject `newCustomInstructions`.
- **PostCompact** (`K36`) — Runs after summarization completes. Adds to `userDisplayMessage`.
- **SessionStart** (`lR("compact", ...)`) — Runs after restoration. Output joins post-compact attachments.

### Tool Integration

- **Read** — Tracks file reads in `readFileState` for `Nx8` post-compact restoration.
- **Task** — Local-agent tasks tracked for `hx8` to re-attach status post-compact.
- **Skill** — Tracked in skill invocation map for `yx8`.
- **Plan** — `Ex8` re-attaches plan file content after compact.

### Persistence Integration

- **Boundary marker** (`p18`) — System message with `subtype: "compact_boundary"` recording trigger, preTokens, durationMs, postTokens, preCompactDiscoveredTools.
- **`recordContextCollapseSnapshot`/`Commit`** — Write-only forward-compatibility shims. See [dead_code_audit.md](./dead_code_audit.md).

## Design Insights

### State Anchoring Pattern

Compact replaces the conversation with a 2–3 KB summary, so files, plans, todos, skills, and tool definitions would be lost. The system **explicitly re-attaches** them as `attachment`-type messages after the summary. Without this, the agent would re-read every file and re-discover every skill.

### Two-Breaker Pattern

| Breaker | Trips when | Behavior |
|---------|------------|----------|
| Consecutive-failure | 3 LLM errors in a row (non-PreCompact, non-abort) | Silent skip; logs "circuit breaker tripped" |
| Rapid-refill | 3 successful compacts each followed by re-trigger within 3 turns | User-visible error: "Autocompact is thrashing… try /clear" |

The rapid-refill breaker exists because successful compaction that *immediately* triggers another compaction means a single tool result is so large that the post-compact context starts already-near-threshold — compacting the same content N times burns input tokens for nothing.

### Three Retry Layers (within `vI6`)

1. **Cache-prefix optimization** (Phase 3a) — Try a one-turn `rP({skipCacheWrite: true})` sharing the cached input prefix. Free reads from cache; never invalidates the upstream.
2. **Standard compact streaming** (Phase 3b) — Falls back to a normal streaming call.
3. **PTL truncation retry** (Phase 3c) — If response starts with "Prompt is too long", drop ~20% of message head and retry up to 3 times.

### Two Orthogonal MC Mechanisms

| | Local autocompact | Server-driven KEEP-RECENT MC |
|--|-------------------|-------------------------------|
| Trigger | Token threshold crossed | API returned 422/424 |
| Scope | Whole conversation | Tool results older than recent 5 |
| Cost | One full LLM call | Zero LLM calls |
| Reversibility | New summary replaces history | Old tool results replaced with cleared marker |
| In v2.1.88 | ✅ shipped | ❌ N/A (not introduced yet) |
| In v2.1.112 | ✅ shipped | ✅ NEW |

These coexist: a typical session sees `QkK` fire dozens of times per day; `d85` rarely or never (only when local heuristics under-counted, e.g. due to tool_use inputs that `vJ` underestimates).

### What's Gone

- **Snip** (`HISTORY_SNIP` feature flag) — every callable surface eliminated. Vestigial parameter `snipTokensFreed` survives in `gDY(q, K, _, z, Y = 0)` because no caller passes a value. See [dead_code_audit.md](./dead_code_audit.md).
- **Context-collapse runtime** (`marble_origami` codename) — `applyCollapsesIfNeeded`, `recoverFromOverflow`, `isContextCollapseEnabled`, `isWithheldPromptTooLong` — all eliminated.
- **Context-collapse persistence** — Half-shipped. `XtY` (`recordContextCollapseCommit`) and `MtY` (`recordContextCollapseSnapshot`) exist with no caller; the JSONL parser recognizes `marble-origami-{commit,snapshot}` types for forward compatibility.
- **Cached MC (`cache_edits` API beta)** — Referenced in 2.1.88 source but the implementation file was always missing; 2.1.112 has zero callsites.
- **API context-management `clear_tool_uses_20250919`** — Was env-gated for ant users in 2.1.88; gone in 2.1.112. Only `clear_thinking_20251015` remains.
