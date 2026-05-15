# `continueOnBlock` Hook Config (v2.1.139)

## Overview

v2.1.139 adds a new `continueOnBlock: boolean` field to **prompt-type** hook config. The changelog describes it as:

> Added hook `continueOnBlock` config option for `PostToolUse` — set to `true` to feed the hook's rejection reason back to Claude and continue the turn

The semantics are subtle. A prompt hook returning `{ok: false, reason: "..."}` produces a `decision: "block"` outcome internally. Previously, this **always** set `preventContinuation: true` — meaning the turn ended and the model didn't see the rejection. With `continueOnBlock: true`, the rejection still flows up as a blocking error message **but the turn continues**, so on `PostToolUse` the model receives the blocking reason as a system reminder and can revise its next call.

The schema description encodes the per-event nuance:

> Sets the continue value for the `decision:"block"` produced when ok is false. Default false (turn ends). Whether continue:true lets the turn proceed depends on the event's `decision:"block"` semantics. On PostToolUse, the reason is fed back to Claude and the turn continues.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `PromptHookSchema` (returned by `Th9`) — Zod schema; new `continueOnBlock` field
- `promptHook` (`Ey4`) — Prompt hook executor; consults `continueOnBlock` when computing `preventContinuation`

## v2.1.142 Schema Definition

```javascript
// ============================================
// PromptHookSchema - Prompt hook config with v2.1.139 continueOnBlock
// Location: cli_inner_pretty.js:48772-48791
// ============================================

// ORIGINAL (for source lookup):
$ = y.object({
    type: y.literal("prompt").describe("LLM prompt hook type"),
    prompt: y.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
    if: lq$(),
    timeout: y.number().positive().optional(),
    model: y.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-6"). If not specified, uses the default small fast model.'),
    continueOnBlock: y.boolean().optional().describe(
      `Sets the continue value for the decision:"block" produced when ok is false. Default false (turn ends). Whether continue:true lets the turn proceed depends on the event's decision:"block" semantics. On PostToolUse, the reason is fed back to Claude and the turn continues.`,
    ),
    statusMessage: y.string().optional(),
    once: y.boolean().optional(),
}),

// READABLE (for understanding):
const PromptHookSchema = z.object({
  type: z.literal("prompt"),
  prompt: z.string(),
  if: hookIfSchema(),
  timeout: z.number().positive().optional(),
  model: z.string().optional(),
  // NEW v2.1.139: opt-out of turn termination on ok:false
  continueOnBlock: z.boolean().optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
});

// Mapping: $→PromptHookSchema, y→zod, lq$→hookIfSchema
```

## v2.1.142 Runtime Behavior

The `preventContinuation` flag is computed inside `promptHook` (`Ey4`) when the LLM evaluator returns `{ok: false}`:

```javascript
// ============================================
// promptHook - Rejection path that consults continueOnBlock
// Location: cli_inner_pretty.js:519293-519301
// ============================================

// ORIGINAL (for source lookup):
if (!I.data.ok)
  return (
    N(`Hooks: Prompt hook condition was not met: ${I.data.reason}`),
    {
      hook: H,
      outcome: "blocking",
      blockingError: { blockingError: `[${H.prompt}]: ${I.data.reason}`, command: H.prompt },
      preventContinuation: !O && H.continueOnBlock !== !0,           // ← v2.1.139 gate
      stopReason: I.data.reason,
    }
  );

// READABLE (for understanding):
if (!parsed.data.ok) {
  logForDebugging(`Hooks: Prompt hook condition was not met: ${parsed.data.reason}`);
  return {
    hook,
    outcome: "blocking",
    blockingError: {
      blockingError: `[${hook.prompt}]: ${parsed.data.reason}`,
      command: hook.prompt,
    },
    // v2.1.139: preventContinuation is now conditional:
    //   - Stop/SubagentStop events: ALWAYS continue (isStop flag means "no further work expected anyway")
    //   - Other events: prevent continuation unless caller opts in with continueOnBlock: true
    preventContinuation: !isStop && hook.continueOnBlock !== true,
    stopReason: parsed.data.reason,
  };
}

// Mapping:
//   I.data→parsed.data, H→hook, O→isStop (=== q === "Stop" || q === "SubagentStop"),
//   N→logForDebugging
```

### v2.1.88 Source for Comparison

In v2.1.88 TS (`src/utils/hooks/execPromptHook.ts:155-167`), the equivalent code was:

```typescript
// ORIGINAL (v2.1.88 TS):
return {
  hook,
  outcome: 'blocking',
  blockingError: {
    blockingError: `Prompt hook condition was not met: ${parsed.data.reason}`,
    command: hook.prompt,
  },
  preventContinuation: true,        // ← hardcoded, no continueOnBlock knob
  stopReason: parsed.data.reason,
}
```

Hardcoded `preventContinuation: true` — every prompt-hook rejection ended the turn, regardless of event.

## Aggregator Consumption

When the executor's stream consumer (`aP`'s outer loop) sees `preventContinuation`, it yields a control signal:

```javascript
// ============================================
// dispatchHookOutputStream - Aggregator's preventContinuation handler
// Location: cli_inner_pretty.js:522060-522066
// ============================================

// ORIGINAL (for source lookup):
if (g.preventContinuation)
  (N(`Hook ${M} (${JS(g.hook)}) requested preventContinuation`),
    yield { preventContinuation: !0, stopReason: g.stopReason });

// READABLE (for understanding):
if (hookResult.preventContinuation) {
  logForDebugging(
    `Hook ${hookEvent} (${describeHook(hookResult.hook)}) requested preventContinuation`,
  );
  yield { preventContinuation: true, stopReason: hookResult.stopReason };
}

// Mapping: g→hookResult, M→hookEvent, JS→describeHook
```

Downstream, the PostToolUse caller path (`G38` at `cli_inner_pretty.js:378993-379008`) reacts to this signal by emitting `hook_stopped_continuation` and **returning early** from the tool execution loop:

```javascript
// ============================================
// postToolUseHookAggregator - preventContinuation halts the tool's output loop
// Location: cli_inner_pretty.js:378993-379008
// ============================================

// ORIGINAL (for source lookup):
if (j.preventContinuation) {
  yield {
    message: fK({
      type: "hook_stopped_continuation",
      message: j.stopReason || "Execution stopped by PostToolUse hook",
      hookName: `PostToolUse:${$.name}`,
      toolUseID: q,
      hookEvent: "PostToolUse",
    }),
  };
  return;
}

// READABLE (for understanding):
if (yielded.preventContinuation) {
  yield {
    message: createAttachmentMessage({
      type: "hook_stopped_continuation",
      message: yielded.stopReason || "Execution stopped by PostToolUse hook",
      hookName: `PostToolUse:${tool.name}`,
      toolUseID,
      hookEvent: "PostToolUse",
    }),
  };
  return;
}

// Mapping: j→yielded, $→tool, q→toolUseID, fK→createAttachmentMessage
```

## Key Decisions/Algorithms

### Default is `false` (status-quo preservation)

**What it does:** When `continueOnBlock` is omitted, behavior matches v2.1.112 / v2.1.88 — rejection halts the turn.

**How it works:** The check is `hook.continueOnBlock !== true`. Both `undefined` and `false` evaluate to "halt the turn." Only `true` flips the behavior.

**Why this approach:**
- Existing hooks that opted-in to prompt evaluation for blocking purposes (e.g., "verify tests pass before allowing turn end") would break if the default flipped to "always continue."
- Boolean-typed field with explicit `true` check (not truthy) avoids accidental enable from `continueOnBlock: 1` or other JSON quirks.

**Key insight:** This is a strict opt-in. Three-state logic — undefined vs false vs true — would have been more flexible but harder to document; defaulting to "halt" matches the verb "block" in `decision:"block"`.

### Stop/SubagentStop ignore the flag

**What it does:** `!isStop && hook.continueOnBlock !== true` — for `Stop` and `SubagentStop` events, `preventContinuation` is always `false`.

**How it works:** `isStop = q === "Stop" || q === "SubagentStop"` (computed near the top of `Ey4` at `cli_inner_pretty.js:519157`). The negation `!isStop` short-circuits before reading `continueOnBlock`.

**Why this approach:**
- Stop hooks fire **after** the model has finished — there's no in-flight turn to "prevent continuation" of. The flag is a no-op semantically.
- An ill-formed Stop hook config setting `continueOnBlock: false` should not silently kill the next turn either; explicit gating prevents this.

**Key insight:** The flag is named for the **event class where it makes sense** (`PostToolUse` per the changelog), but the implementation is generic — any non-stop event respects it. PreToolUse with `continueOnBlock: true` would let the model retry the call after seeing the rejection reason.

### "continue" semantics depend on event, not hook

**What it does:** The doc-string explicitly says "Whether continue:true lets the turn proceed depends on the event's `decision:"block"` semantics. On PostToolUse, the reason is fed back to Claude and the turn continues."

**Why this approach:**
- Setting `preventContinuation: false` only signals "don't halt the turn." Whether the model sees the blocking error and reacts depends on the message-routing layer downstream:
  - `PostToolUse` hook block → reason flows into the assistant's next system reminder → model reads it and can revise the next tool call.
  - `PreToolUse` hook block → reason short-circuits the tool call → model gets a "permission denied" sentinel and can choose a different action.
  - `UserPromptSubmit` hook block → the original prompt is replaced/wrapped → model sees the hook's framing.

**Key insight:** The hook's `preventContinuation` flag is a **terminate-or-not** switch. The richness of "what does the model see" is owned by per-event consumer code, not by the hook system. This keeps the executor stateless about event semantics — it's the dispatcher's job to route the blocking-error message.

## Diff vs v2.1.112

In v2.1.112's `promptHook` (chunks.192.mjs in the equivalent location), `preventContinuation: true` was hardcoded with no conditional. The schema had no `continueOnBlock` field. Adding the flag is **purely opt-in extension**:

1. Schema: `continueOnBlock: z.boolean().optional()` added after `model`.
2. Runtime: `preventContinuation: true` → `preventContinuation: !isStop && hook.continueOnBlock !== true`.

Hooks that don't set `continueOnBlock` behave identically to v2.1.112.

## Related Reading

- Prompt-hook executor full architecture: see [v2.1.112 11_hooks/README.md](../../../claude_code_v_2.1.112/analyze/11_hooks/README.md) "Stage 3 (apply decision)" section for the canonical decision-flow background.
- Stop-hook event semantics: see [v2.1.112 11_hooks/README.md](../../../claude_code_v_2.1.112/analyze/11_hooks/README.md) for why Stop hooks treat `preventContinuation` differently.
