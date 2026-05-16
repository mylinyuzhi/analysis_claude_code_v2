# PostToolUse / PostToolUseFailure `duration_ms` (v2.1.119)

## Overview

v2.1.119 threads tool wallclock duration into PostToolUse and PostToolUseFailure hook inputs. The changelog:

> PostToolUse/PostToolUseFailure include `duration_ms` (tool execution time)

The duration is measured by the tool execution layer (from "started executing" to "finished/failed") and passed into the hook dispatcher as `duration_ms`. Hooks can use it to:

- Log telemetry on slow tools.
- Skip expensive validations on already-slow operations.
- Filter on long-running edits (e.g., "if the edit took more than 5s, run integration tests").

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `postToolUseHook` (`zL$`) — Dispatcher; new `duration_ms` field on envelope
- `postToolUseFailureHook` (`YL$`) — Dispatcher; new `duration_ms` field
- `executeToolWithHooks` (caller) — Measures duration and passes to dispatcher

## v2.1.142 PostToolUse Dispatcher

```javascript
// ============================================
// postToolUseHook - PostToolUse envelope with duration_ms
// Location: cli_inner_pretty.js:520182-520193
// ============================================

// ORIGINAL (for source lookup):
async function* zL$(H, $, q, K, _, A, z, Y = p_, f) {
  let O = {
    ...M_(A, void 0, _),
    hook_event_name: "PostToolUse",
    tool_name: H,
    tool_input: q,
    tool_response: K,
    tool_use_id: $,
    duration_ms: f,                       // ← NEW v2.1.119
  };
  yield* aP({ hookInput: O, toolUseID: $, matchQuery: H, signal: z, timeoutMs: Y, toolUseContext: _ });
}

// READABLE (for understanding):
async function* postToolUseHook(
  toolName,
  toolUseID,
  toolInput,
  toolResponse,
  toolUseContext,
  permissionMode,
  signal,
  timeoutMs = DEFAULT_HOOK_TIMEOUT,
  durationMs,                              // ← NEW v2.1.119: tool execution time
) {
  const hookInput = {
    ...createBaseHookInput(permissionMode, undefined, toolUseContext),
    hook_event_name: "PostToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_response: toolResponse,
    tool_use_id: toolUseID,
    duration_ms: durationMs,
  };
  yield* dispatchHookOutputStream({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// Mapping:
//   zL$→postToolUseHook, H→toolName, $→toolUseID, q→toolInput, K→toolResponse,
//   _→toolUseContext, A→permissionMode, z→signal, Y→timeoutMs, f→durationMs,
//   M_→createBaseHookInput, aP→dispatchHookOutputStream, p_→DEFAULT_HOOK_TIMEOUT
```

## v2.1.142 PostToolUseFailure Dispatcher

```javascript
// ============================================
// postToolUseFailureHook - Failure envelope with duration_ms
// Location: cli_inner_pretty.js:520194-520211
// ============================================

// ORIGINAL (for source lookup):
async function* YL$(H, $, q, K, _, A, z, Y, f = p_, O) {
  let M = _.getAppState(),
    w = _.agentId ?? v$();
  if (!tI("PostToolUseFailure", M, w)) return;
  let D = {
    ...M_(z, void 0, _),
    hook_event_name: "PostToolUseFailure",
    tool_name: H,
    tool_input: q,
    tool_use_id: $,
    error: K,
    is_interrupt: A,
    duration_ms: O,                        // ← NEW v2.1.119
  };
  yield* aP({ hookInput: D, toolUseID: $, matchQuery: H, signal: Y, timeoutMs: f, toolUseContext: _ });
}

// READABLE (for understanding):
async function* postToolUseFailureHook(
  toolName,
  toolUseID,
  toolInput,
  errorMessage,
  isInterrupt,
  toolUseContext,
  permissionMode,
  signal,
  timeoutMs = DEFAULT_HOOK_TIMEOUT,
  durationMs,                              // ← NEW v2.1.119
) {
  const appState = toolUseContext.getAppState();
  const sessionId = toolUseContext.agentId ?? getSessionId();
  // Skip dispatch if no PostToolUseFailure hooks are registered — saves the envelope-build cost
  if (!hasHookForEvent("PostToolUseFailure", appState, sessionId)) return;
  const hookInput = {
    ...createBaseHookInput(permissionMode, undefined, toolUseContext),
    hook_event_name: "PostToolUseFailure",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID,
    error: errorMessage,
    is_interrupt: isInterrupt,
    duration_ms: durationMs,
  };
  yield* dispatchHookOutputStream({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// Mapping:
//   YL$→postToolUseFailureHook, H→toolName, $→toolUseID, q→toolInput, K→errorMessage,
//   A→isInterrupt, _→toolUseContext, z→permissionMode, Y→signal, f→timeoutMs, O→durationMs,
//   M→appState, w→sessionId, D→hookInput, tI→hasHookForEvent, v$→getSessionId
```

## Caller Site (Tool Executor)

The dispatcher is called from `executeToolWithHooks` (the integration point where the tool's execution loop produces a final output). The caller measures duration as the difference between "started running tool" and "tool produced final result":

```javascript
// Conceptual caller flow (from cli_inner_pretty.js:388410-388424 + 388467):
const startTime = Date.now();
let toolFinalOutput;
try {
  toolFinalOutput = await runTool();
  const durationMs = Date.now() - startTime;     // ← measured here
  // PostToolUse path
  for await (const yielded of postToolUseHook(
    toolName,
    toolUseID,
    toolInput,
    toolFinalOutput,
    toolUseContext,
    permissionMode,
    signal,
    timeoutMs,
    durationMs,                                  // ← passed to dispatcher
  )) { /* aggregate yielded results */ }
} catch (e) {
  const durationMs = Date.now() - startTime;
  // PostToolUseFailure path
  for await (const yielded of postToolUseFailureHook(
    toolName, toolUseID, toolInput,
    errorMessage(e), isInterruptError(e),
    toolUseContext, permissionMode, signal, timeoutMs,
    durationMs,                                  // ← also passed on failure path
  )) { /* aggregate yielded results */ }
}
```

The duration **excludes** time spent in pre-tool-use hooks, permission checks, and post-tool-use hook execution itself. It measures pure tool wallclock.

## Schema Documentation (v2.1.142)

Both events list `duration_ms` in the schema. Pulled from cli_inner_pretty.js schema documentation strings:

```javascript
// hook_event_name PostToolUse schema (within input-schema definitions):
//
//   tool_name: ...
//   tool_input: ...
//   tool_response: ...
//   tool_use_id: ...
//   duration_ms: Tool execution time in milliseconds (excludes hooks)
```

The semantics are explicit: **tool execution time only**, not the end-to-end hook chain.

## Key Decisions/Algorithms

### Measure end-to-end of tool, exclude hooks

**What it does:** `durationMs = endOfToolRun - startOfToolRun`. The before/after points are inside the executor's `try` block, around `await runTool()`.

**How it works:**
- Start time captured immediately before `runTool()`.
- End time captured immediately after the tool's promise resolves or rejects.
- The PostToolUse hook chain itself adds latency — that's NOT included in the duration the hook sees.

**Why this approach:**
- Hooks consuming `duration_ms` care about the **tool's** performance, not the dispatcher's overhead.
- Including hook execution time would create circular feedback: a hook that triggers on slow tools would see its own latency added to the measurement, biasing the decision.

**Key insight:** This is **observation neutrality**: the hook system reports on tool behavior, not its own behavior. Compare to v2.1.139's hook-aggregator durations (in OTel spans) which DO include hook latency — those are for diagnosing the hook system itself.

### Duration is on the envelope, not in hookSpecificOutput

**What it does:** `duration_ms` is a **top-level field** in the hook input JSON, alongside `tool_name`, `tool_input`, etc. It's not nested under `hookSpecificOutput` (which is for hook **output**).

**Why this approach:**
- `hookSpecificOutput` is reserved for the hook's response back to Claude Code. Input fields are flat top-level.
- Top-level placement means simple hooks like `jq '.duration_ms > 5000'` work without nested lookups.

**Key insight:** The split is clean: top-level keys are **what the runtime tells the hook**, `hookSpecificOutput` is **what the hook tells the runtime**. Adding duration to the former matches the convention.

### Same name for both events

**What it does:** Both `PostToolUse` and `PostToolUseFailure` use the same field name (`duration_ms`).

**Why this approach:**
- Hooks listening on both events with a shared handler can use a single field name to extract duration.
- Symmetric naming: a hook author thinking "how long did the tool take to fail?" finds the same answer as "how long did the tool take to succeed?"

**Key insight:** Some "duration_ms_until_failure" naming was rejected as overly specific. Failure has a duration like success does — same concept.

### `snake_case` matches the rest of the envelope

**What it does:** Field is `duration_ms`, not `durationMs`.

**Why this approach:**
- Hook input envelope fields use snake_case (`hook_event_name`, `tool_name`, `tool_use_id`, `agent_id`, `permission_mode`, etc.).
- The internal JavaScript parameter is `durationMs` (camelCase), but it's serialized as `duration_ms` to match envelope convention.

**Key insight:** Two naming conventions cohabit: the JS-level identifiers are camelCase (project convention), JSON-level field names are snake_case (Python-ish, matches the hook authoring docs which use snake_case JSON throughout). The `M_` envelope builder maintains the snake_case wire format.

## Diff vs v2.1.112

In v2.1.112, the equivalent `postToolUseHook` dispatcher had no `duration_ms` parameter. The hook input envelope had no `duration_ms` field. The schema didn't include it.

The v2.1.119 patch:
1. Adds the `durationMs` parameter (with positional fallback to `undefined`) to `postToolUseHook` and `postToolUseFailureHook`.
2. Adds `duration_ms: durationMs` to both hook input envelopes.
3. Updates the caller sites in the tool executor to measure and pass duration.
4. Updates the schema doc-string for both events.

The caller-site changes are forward-compatible: existing hooks that don't read `duration_ms` continue to work because the field is added, not replacing anything.

## Related Reading

- Tool execution flow: see `00_overview/symbol_index_core_execution.md` "Tools" for `runTool`/`executeToolWithHooks` integration.
- Telemetry for hook duration (different metric): hook-execution duration is in `hook_duration_ms` OTel metric, captured at `cli_inner_pretty.js:521369` and 522142.
