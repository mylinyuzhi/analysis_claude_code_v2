# PermissionDenied Hook (v2.1.89)

## Overview

`PermissionDenied` is a new hook event introduced in v2.1.89 that fires **after** the auto-mode classifier produces a deny verdict for a tool call. Its purpose is to give plugins/scripts a chance to override that deny by returning `{retry: true}` — the runner then re-feeds the tool call to the model with a sentinel reminder telling the model it may retry.

**v2.1.88 status:** The event existed in the v2.1.88 source (`hooks.ts:3529-3544`), but the changelog calls it out as "Added" in v2.1.89 because that's when the changelog explicitly documented it and the SDK schema gained the `PermissionDenied` discriminant in `hookSpecificOutput`. The plumbing in v2.1.88 already had `retry` in `HookResult` (types/hooks.ts:274) and the consumer path in the tool dispatcher. This unit covers what the v2.1.112 obfuscated runtime now exposes that v2.1.88's `hooks.ts` source set up.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings: [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions in this document:

- `permissionDeniedHook` (`$38`) — chunks.192.mjs:2939 (dispatcher; equivalent to v2.1.88 `executePermissionDeniedHooks` at hooks.ts:3529)
- `applyHookPermissionDecision` (`KJ7`) — chunks.193.mjs:3 (parser for `hookSpecificOutput.retry`)
- `processCanUseToolResult` (the dispatch site that runs the hook after a classifier deny) — chunks.153.mjs:1360 (the `if (m.decisionReason?.type === "classifier" && m.decisionReason.classifier === "auto-mode")` branch)

## v2.1.88 Source Reference

```typescript
// ============================================
// executePermissionDeniedHooks - Fire after auto-mode classifier denies a tool call
// Location: src/utils/hooks.ts:3529-3562 (v2.1.88)
// ============================================

// ORIGINAL (for source lookup):
export async function* executePermissionDeniedHooks<ToolInput>(
  toolName: string,
  toolUseID: string,
  toolInput: ToolInput,
  reason: string,
  toolUseContext: ToolUseContext,
  permissionMode?: string,
  signal?: AbortSignal,
  timeoutMs: number = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
): AsyncGenerator<AggregatedHookResult> {
  const appState = toolUseContext.getAppState()
  const sessionId = toolUseContext.agentId ?? getSessionId()
  if (!hasHookForEvent('PermissionDenied', appState, sessionId)) return

  const hookInput: PermissionDeniedHookInput = {
    ...createBaseHookInput(permissionMode, undefined, toolUseContext),
    hook_event_name: 'PermissionDenied',
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID,
    reason,
  }
  yield* executeHooks({ hookInput, toolUseID, matchQuery: toolName, signal, timeoutMs, toolUseContext })
}

// READABLE (same as ORIGINAL — v2.1.88 source is hand-written TS):
// (identical)

// Mapping: matches identifier-for-identifier with v2.1.112 obfuscated $38.
```

## v2.1.112 Obfuscated Form

```javascript
// ============================================
// permissionDeniedHook - Dispatches PermissionDenied event after classifier deny
// Location: chunks.192.mjs:2939-2959
// ============================================

// ORIGINAL (for source lookup):
async function* $38(q, K, _, z, Y, A, O, w = u_) {
    let $ = Y.getAppState(),
        j = Y.agentId ?? I8();
    if (!pn("PermissionDenied", $, j)) return;
    let H = {
        ...J9(A, void 0, Y),
        hook_event_name: "PermissionDenied",
        tool_name: q,
        tool_input: _,
        tool_use_id: K,
        reason: z
    };
    yield* E0({ hookInput: H, toolUseID: K, matchQuery: q, signal: O, timeoutMs: w, toolUseContext: Y })
}

// READABLE (for understanding):
async function* permissionDeniedHook(
  toolName, toolUseID, toolInput, reason, toolUseContext,
  permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
) {
  const appState = toolUseContext.getAppState();
  const sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("PermissionDenied", appState, sessionId)) return;
  const hookInput = {
    ...createBaseHookInput(permissionMode, undefined, toolUseContext),
    hook_event_name: "PermissionDenied",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID,
    reason,
  };
  yield* executeHooks({ hookInput, toolUseID, matchQuery: toolName, signal: signal, timeoutMs, toolUseContext });
}

// Mapping: $38→permissionDeniedHook, q→toolName, K→toolUseID, _→toolInput, z→reason,
//          Y→toolUseContext, A→permissionMode, O→signal, w→timeoutMs,
//          pn→hasHookForEvent, I8→getSessionId, J9→createBaseHookInput, E0→executeHooks
```

## Consumer Site — Reading the `retry` Flag

The retry path is in the can-use-tool wrapper. After the auto-mode classifier denies, the dispatcher iterates the `permissionDeniedHook` generator, accumulating `retry: true` if ANY hook returns it, and feeds a sentinel system-reminder back to the model.

```javascript
// ============================================
// dispatchClassifierDenyHook - Run PermissionDenied hooks after auto-mode classifier deny
// Location: chunks.153.mjs:1360-1369
// ============================================

// ORIGINAL (for source lookup):
if (m.decisionReason?.type === "classifier" && m.decisionReason.classifier === "auto-mode") {
    let O6 = !1;
    for await (let J6 of $38(q.name, K, W, m.decisionReason.reason ?? "Permission denied", z, C, z.abortController.signal))
        if (J6.retry) O6 = !0;
    if (O6) P.push({
        message: t8({
            content: "The PermissionDenied hook indicated you may retry this tool call.",
            isMeta: !0
        })
    })
}

// READABLE (for understanding):
if (
  permissionResult.decisionReason?.type === "classifier" &&
  permissionResult.decisionReason.classifier === "auto-mode"
) {
  let shouldRetry = false;
  for await (const hookYield of permissionDeniedHook(
    tool.name,
    toolUseID,
    toolInput,
    permissionResult.decisionReason.reason ?? "Permission denied",
    toolUseContext,
    permissionMode,
    toolUseContext.abortController.signal,
  )) {
    if (hookYield.retry) shouldRetry = true;
  }
  if (shouldRetry) {
    messagesOut.push({
      message: createUserMessage({
        content: "The PermissionDenied hook indicated you may retry this tool call.",
        isMeta: true,
      }),
    });
  }
}

// Mapping: $38→permissionDeniedHook, m→permissionResult, J6→hookYield, O6→shouldRetry,
//          P→messagesOut, t8→createUserMessage, C→permissionMode
```

## The `retry` Field Wiring

In the per-event branch of `applyHookPermissionDecision` (`KJ7`), the `retry` field reads off `hookSpecificOutput`:

```javascript
// ============================================
// applyHookPermissionDecision.PermissionDenied - Extract retry flag from hook output
// Location: chunks.193.mjs:96-98
// ============================================

// ORIGINAL (for source lookup):
case "PermissionDenied":
    H.retry = q.hookSpecificOutput.retry;
    break;

// READABLE (for understanding):
case "PermissionDenied":
    result.retry = hookOutput.hookSpecificOutput.retry;
    break;

// Mapping: H→result, q→hookOutput, hookSpecificOutput.retry→retry
```

And in the aggregator that streams results out:

```javascript
// ============================================
// aggregateHookResults.retry - Re-yield retry flag to caller
// Location: chunks.193.mjs:1315-1317
// ============================================

// ORIGINAL (for source lookup):
if (S.retry) yield {
    retry: S.retry
};

// READABLE (for understanding):
if (hookResult.retry) yield { retry: hookResult.retry };

// Mapping: S→hookResult (current iteration's per-hook result)
```

## Deep Analysis

### Algorithm: Retry-After-Classifier-Deny

**What it does:** Lets a `PermissionDenied` hook tell the LLM "you may retry this tool call" by yielding `{retry: true}`, which causes a sentinel system-reminder to be added to the message stream the model sees on the next turn.

**How it works:**

1. **Trigger condition.** The hook only fires after a *classifier* deny (`decisionReason.type === "classifier"` AND `decisionReason.classifier === "auto-mode"`). It does NOT fire for explicit `permissions.deny` rule denies, plan-mode denies, or user-rejected `ask` prompts. The classifier in auto mode is the only stochastic denier — the retry path exists because the classifier can be wrong, but rule-based denies should be obeyed.
2. **Hook input.** `tool_name`, `tool_input`, `tool_use_id`, and `reason` (the classifier's reason string, default "Permission denied"). Plus the base envelope (cwd, session_id, transcript_path).
3. **Output protocol.** The hook returns `{"hookSpecificOutput": {"hookEventName": "PermissionDenied", "retry": true}}`. Exit code 0 with non-block JSON is the only path that emits `retry`.
4. **Aggregation.** Multiple hooks may register — the dispatcher OR-s their `retry` flags: ANY hook returning `retry: true` triggers the retry message.
5. **Effect.** When `shouldRetry`, a meta user message with content `"The PermissionDenied hook indicated you may retry this tool call."` is pushed onto the message buffer. This message is delivered to the model on the next turn, but does NOT re-execute the tool call automatically — the model must choose to re-emit the tool use.

**Why this approach:**

- **Why fire only on classifier denies?** The auto-mode classifier is the *only* deny path that could plausibly need an override. A user-defined `permissions.deny` rule reflects intentional policy; a hook overriding it would create a confusing precedence loop. A user-rejected interactive `ask` is explicit user intent. The classifier, however, is a probabilistic guard that can refuse a safe operation — so it's the only deny path with a retry escape hatch.
- **Why `retry: true` as a signal, not a re-issue?** Re-issuing the tool call automatically would bypass the original deny without giving the model a chance to reformulate (e.g., adjust input args, choose a different tool). The current design **lets the model decide**, which keeps the model in the loop (and in the audit trail).
- **Why OR-aggregate across hooks?** Multiple hooks can register; if any one of them says "retry", the user has signaled trust. Requiring unanimous agreement would mean a single conservative hook could globally suppress retries, defeating the purpose.

**Key insight:** The retry mechanism converts a `Permission denied (auto-mode classifier)` outcome into a *recoverable* one. From the model's perspective, the tool call appeared to fail with a reason, but a follow-up reminder says "the user-installed safety net says retry is fine" — giving the model a clear signal to try again, perhaps with a more justified phrasing. The hook author can implement custom risk logic (e.g., "check git status; if clean, allow retry") that the classifier itself cannot perform.

### Decision: Why a Separate Hook Event?

**Alternative considered:** Embed retry semantics into `PreToolUse` or `PermissionRequest`. **Why rejected (inferable):**

- `PreToolUse` fires *before* the classifier; the hook wouldn't know the reason for a future deny.
- `PermissionRequest` fires for the deny-rule path AND `ask` prompts; conflating retry-on-classifier-deny with general permission decisions would force hook authors to write `if (this is an auto-mode deny) ... else ...` branches inside a hook that's already overloaded.

The `PermissionDenied` event is **narrow by design**: it fires for exactly one situation (post-classifier deny) and exposes exactly one tool (the retry sentinel). Hook authors don't need to dispatch on subtypes.

## Edge Cases & Gotchas

1. **Retry is advisory, not authoritative.** Setting `retry: true` does NOT cause the tool to re-run. It injects a system-reminder asking the model to consider retrying. The model may not retry (e.g., if it concludes the deny was correct given a fresh re-read of context).
2. **`reason` defaults to `"Permission denied"`.** When the classifier produces a deny without a populated `reason`, the hook receives a literal `"Permission denied"` string. Hooks that key off `reason` content should treat that fallback explicitly.
3. **No interaction with `defer`.** The `defer` permissionDecision (also v2.1.89) operates on `PreToolUse`, not `PermissionDenied`. There's no path where a `PermissionDenied` hook returns `defer` — only `retry: true` or unset.
4. **Plugins can fire the hook.** Plugin hook configs that register a `PermissionDenied` matcher are included in the dispatch loop. The matcher syntax is the same as for other tool-bound events (uses `tool_name` as `matchQuery` via the switch at chunks.193.mjs:519).
