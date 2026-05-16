# Prompt/Agent Hook Validation for Context-less Events (v2.1.142)

## Overview

v2.1.142 adds a clear error when a user configures a `prompt`- or `agent`-type hook on an event that fires without a conversation context — `SessionStart`, `Setup`, or `SubagentStart`. The changelog:

> Improved hook configuration error: configuring a prompt- or agent-type hook for `SessionStart`/`Setup`/`SubagentStart` now shows a clear "use a command-type hook instead" error

These events fire before a conversation exists (SessionStart, Setup) or just before a subagent starts (SubagentStart, where the parent context is intentionally not propagated). The hook executor's prompt/agent paths need `toolUseContext` to query the LLM evaluator — without it, the runtime previously failed with an opaque error. The fix is a typed, actionable message at the dispatch boundary.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key function in this document:

- `dispatchHookOutputStream` (`aP`) — Streaming hook driver; prompt/agent branch validates `toolUseContext` presence
- `sessionStartHook` (`$M$`) — Caller that does NOT pass `toolUseContext`
- `setupHook` (`qM$`) — Caller that does NOT pass `toolUseContext`
- `subagentStartHook` (`QL$`) — Caller that passes only `getAppState` (no `toolUseContext`)

## Caller Surface (No toolUseContext)

```javascript
// ============================================
// sessionStartHook - SessionStart caller passes no toolUseContext
// Location: cli_inner_pretty.js:520032-520043
// ============================================

// ORIGINAL (for source lookup):
async function* $M$(H, $, q, K, _, A = p_, z) {
  let Y = { ...M_(void 0, $), hook_event_name: "SessionStart", source: H, agent_type: q, model: K };
  yield* aP({
    hookInput: Y, toolUseID: XW8.randomUUID(), matchQuery: H,
    signal: _, timeoutMs: A, forceSyncExecution: z,
    // ← no toolUseContext field
  });
}

// READABLE (for understanding):
async function* sessionStartHook(source, sessionIdOverride, agentType, model, signal, timeoutMs, forceSyncExecution) {
  const hookInput = {
    ...createBaseHookInput(undefined, sessionIdOverride),
    hook_event_name: "SessionStart",
    source,
    agent_type: agentType,
    model,
  };
  yield* dispatchHookOutputStream({
    hookInput,
    toolUseID: randomUUID(),
    matchQuery: source,
    signal,
    timeoutMs,
    forceSyncExecution,
    // toolUseContext intentionally omitted — no conversation yet
  });
}

// Mapping: $M$→sessionStartHook, aP→dispatchHookOutputStream, M_→createBaseHookInput
```

`setupHook` (`qM$`, cli_inner_pretty.js:520044-520054) and `subagentStartHook` (`QL$`, cli_inner_pretty.js:520056) follow the same pattern. `subagentStartHook` does pass `getAppState` (to query session-scoped hooks) but not the full `toolUseContext`.

## Validation Inside the Dispatcher

```javascript
// ============================================
// dispatchHookOutputStream - prompt/agent validation throws when context is absent
// Location: cli_inner_pretty.js:521481-521512
// ============================================

// ORIGINAL (for source lookup):
if (g.type === "prompt") {
  if (!z)
    throw Error(
      `prompt-type hooks are not supported for ${M} events (no conversation context is available). Use a command-type hook instead.`,
    );
  if (z.agentId?.startsWith(jW8)) {
    (qH(),
      yield {
        message: fK({ type: "hook_cancelled", hookName: w, toolUseID: q, hookEvent: M }),
        outcome: "cancelled",
        hook: g,
      });
    return;
  }
  // ... prompt hook execution ...
}
if (g.type === "agent") {
  if (!z)
    throw Error(
      `agent-type hooks are not supported for ${M} events (no conversation context is available). Use a command-type hook instead.`,
    );
  if (z.agentId?.startsWith(jW8)) {
    (qH(),
      yield {
        message: fK({ type: "hook_cancelled", hookName: w, toolUseID: q, hookEvent: M }),
        outcome: "cancelled",
        hook: g,
      });
    return;
  }
  // ... agent hook execution ...
}

// READABLE (for understanding):
if (hook.type === "prompt") {
  // v2.1.142: explicit guard for context-less events
  if (!toolUseContext) {
    throw Error(
      `prompt-type hooks are not supported for ${hookEvent} events (no conversation context is available). ` +
      `Use a command-type hook instead.`,
    );
  }
  // Skip prompt hooks when running inside an agent-hook subagent (avoids recursion)
  if (toolUseContext.agentId?.startsWith(AGENT_HOOK_ID_PREFIX)) {
    cleanup();
    yield {
      message: createAttachmentMessage({
        type: "hook_cancelled",
        hookName,
        toolUseID,
        hookEvent,
      }),
      outcome: "cancelled",
      hook,
    };
    return;
  }
  // ... prompt hook execution ...
}
if (hook.type === "agent") {
  // Identical guard for agent-type hooks
  if (!toolUseContext) {
    throw Error(
      `agent-type hooks are not supported for ${hookEvent} events (no conversation context is available). ` +
      `Use a command-type hook instead.`,
    );
  }
  if (toolUseContext.agentId?.startsWith(AGENT_HOOK_ID_PREFIX)) {
    cleanup();
    yield {
      message: createAttachmentMessage({
        type: "hook_cancelled",
        hookName,
        toolUseID,
        hookEvent,
      }),
      outcome: "cancelled",
      hook,
    };
    return;
  }
  // ... agent hook execution ...
}

// Mapping:
//   g→hook, z→toolUseContext, M→hookEvent, w→hookName, q→toolUseID,
//   jW8→AGENT_HOOK_ID_PREFIX (= "hook-agent-"), qH→cleanup, fK→createAttachmentMessage
```

## Where the Error Surfaces

The `throw` happens inside an async-iterator-mapped sub-generator. The error propagates up through:

1. The sub-generator wraps the throw in its returned promise.
2. The aggregator's `for await` consumer catches it via the iterator protocol.
3. The aggregator runs its `catch` block (`cli_inner_pretty.js:521997-522024`) which yields:
   ```javascript
   yield {
     message: createAttachmentMessage({
       type: "hook_non_blocking_error",
       hookName,
       toolUseID,
       hookEvent,
       stderr: `Failed to run: ${errorMessage}`,
       ...
     }),
     outcome: "non_blocking_error",
     hook,
   };
   ```

So the user sees the error in the transcript as a non-blocking hook error, with the actionable message intact: **"prompt-type hooks are not supported for SessionStart events (no conversation context is available). Use a command-type hook instead."**

## Key Decisions/Algorithms

### Pre-execution validation vs schema validation

**What it does:** Checks `toolUseContext` presence at execution time, not at config-load time.

**How it works:**
- The Zod schema accepts any hook type for any event — the discriminated union doesn't know which events have context.
- The runtime gate inside the dispatcher checks `if (!toolUseContext)` per-execution.

**Why this approach:**
- Schema-level enforcement would require enumerating context-less events in the schema (`hooks: { SessionStart: { type: "command", ... } }` would need to forbid prompt/agent at the type level). That's brittle: adding a new context-less event would require schema edits.
- Runtime validation is single-source: any caller that doesn't pass `toolUseContext` triggers the gate. Self-correcting.
- The trade-off is **late error**: a malformed config doesn't fail until the event actually fires. Users won't see it on session start; they'll see it the first time their `SessionStart` hook tries to run.

**Key insight:** Validation lives where the **data** lives. The dispatcher is the only function that sees both the hook definition AND the execution context — putting the check anywhere else would require duplicating one or the other.

### `throw` vs `yield error result`

**What it does:** The runtime throws an Error rather than yielding a `non_blocking_error` result directly.

**Why this approach:**
- The aggregator already has a `catch` block that produces the user-visible non-blocking error message. Throwing reuses that path.
- It also marks the error in the per-hook `outcome` map — counted as a `non_blocking_error` — which feeds OpenTelemetry and the post-run summary.
- A direct `yield {outcome: "non_blocking_error"}` would skip the centralized error formatting (with `Failed to run:` prefix, durationMs, etc.) that other failures use.

**Key insight:** Throwing is the **idiomatic** way to signal a fail-to-execute in this codebase. The dispatcher's error-handling layer is the single funnel for all "couldn't run this hook" cases.

### Same template for prompt and agent

**What it does:** Identical error wording for both types, only the hook-type word changes.

**Why this approach:**
- Both fail for the same underlying reason (no conversation context).
- Both have the same fix (use command-type instead).
- Lumping them with two near-identical throws makes the diff localized — if context-less semantics change, both sites change together.

**Key insight:** Don't try to generalize the validator into a helper. The branches are already grouped (the validation is two adjacent `if (hook.type === ...)` blocks). Inlining the check keeps the call-site readable without adding a layer.

## Diff vs v2.1.112

In v2.1.112, the prompt/agent branches in the dispatcher didn't check for `toolUseContext`. If a user configured a `{ "type": "prompt", "prompt": "..." }` hook on `SessionStart`, the runtime would fall through to `Ey4` (prompt-hook evaluator), which would try to read `toolUseContext.options.tools`, `toolUseContext.getAppState()`, etc., and throw a TypeError on the first `undefined` access. The user would see something like:

> `TypeError: Cannot read properties of undefined (reading 'options')`

… which is technically informative but doesn't tell the user what to do. The v2.1.142 patch replaces the TypeError site with a typed Error containing actionable text:

> `prompt-type hooks are not supported for SessionStart events (no conversation context is available). Use a command-type hook instead.`

The patch is two `if (!z) throw Error(...)` statements, totaling six lines added.

## Related Reading

- Hook executor lifecycle: [v2.1.112 11_hooks/README.md](../../../claude_code_v_2.1.112/analyze/11_hooks/README.md) — the foundational dispatcher architecture.
- Event-type taxonomy: see `00_overview/symbol_index_core_features.md` Hooks section for the `HOOK_EVENTS` enum (which events carry `toolUseContext`).
