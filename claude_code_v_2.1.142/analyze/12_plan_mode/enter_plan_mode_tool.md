# EnterPlanModeTool — Deep Deobfuscation (v2.1.142)

`EnterPlanModeTool` is the model-callable tool that transitions a session into plan mode. It is a *deferred* tool (`shouldDefer: true`), so the agent loop announces it conditionally and waits for a fresh evaluation before each call. It exposes **no parameters** — the model just emits `{"name":"EnterPlanMode","input":{}}`.

The full v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/EnterPlanModeTool.ts` (127 lines). The v2.1.142 obfuscated implementation lives at `cli_inner_pretty.js:383798-383866`. They are equivalent up to renames, with the **`--channels` gate refined** (now pairs with the `T6()` background-session predicate).

## Symbol Table

- `EnterPlanModeTool` (obfuscated: `Q38`) - the exported tool object - `cli_inner_pretty.js:383798`
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `Q3H`) - the literal `"EnterPlanMode"` - `cli_inner_pretty.js:211429`
- `enterPlanModeInputSchema` (obfuscated: `ve_`) - Zod schema, strict empty object - `cli_inner_pretty.js:383796`
- `enterPlanModeOutputSchema` (obfuscated: `ke_`) - Zod schema with `message: string` - `cli_inner_pretty.js:383797`
- `getEnterPlanModeToolPrompt` (obfuscated: `ll7`) - dispatcher for the prompt (ant vs external) - `cli_inner_pretty.js:383806` (call site)
- `isPlanModeInterviewPhaseEnabled` (obfuscated: `bf`) - feature flag governing follow-up message variant - `cli_inner_pretty.js:383848`, definition at `cli_inner_pretty.js:383640`
- `handlePlanModeTransition` (obfuscated: `Oo`) - mode-transition hook - `cli_inner_pretty.js:2961`
- `prepareContextForPlanMode` (obfuscated: `UkH`) - auto-mode prep / dangerous-rule stripping - `cli_inner_pretty.js:422720`
- `applyPermissionUpdate` (obfuscated: `Qz`) - generic permission-context updater
- `getAllowedChannels` (obfuscated: `jj`) - `--channels` allow-list - referenced by `isEnabled`
- `isBackgroundSession` (obfuscated: `T6`) - background-session predicate (NEW pairing in v2.1.142)
- `renderEnterPlanModeToolUseMessage` (obfuscated: `il7`) - UI render - `cli_inner_pretty.js:383828`
- `renderEnterPlanModeToolResultMessage` (obfuscated: `rl7`) - UI render - `cli_inner_pretty.js:383829`
- `renderEnterPlanModeToolUseRejectedMessage` (obfuscated: `ol7`) - UI render - `cli_inner_pretty.js:383830`

## Tool Definition

```javascript
// ============================================
// EnterPlanModeTool - Tool object definition
// Location: cli_inner_pretty.js:383798-383866
// ============================================

// ORIGINAL (for source lookup):
((ve_ = yH(() => y.strictObject({}))),
  (ke_ = yH(() => y.object({ message: y.string().describe("Confirmation that plan mode was entered") }))),
  (Q38 = XK({
    name: Q3H,
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
      return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },
    async prompt() {
      return ll7();
    },
    get inputSchema() { return ve_(); },
    get outputSchema() { return ke_(); },
    userFacingName() { return ""; },
    shouldDefer: !0,
    isEnabled() {
      if (jj().length > 0 && T6()) return !1;
      return !0;
    },
    isConcurrencySafe() { return !0; },
    isReadOnly() { return !0; },
    renderToolUseMessage: il7,
    renderToolResultMessage: rl7,
    renderToolUseRejectedMessage: ol7,
    async call(H, $) {
      if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
      let q = $.getAppState();
      return (
        Oo(q.toolPermissionContext.mode, "plan"),
        $.setToolPermissionContext((K) => Qz(UkH(K), { type: "setMode", mode: "plan", destination: "session" })),
        {
          data: {
            message:
              "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
          },
        }
      );
    },
    mapToolResultToToolResultBlockParam({ message: H }, $) {
      return {
        type: "tool_result",
        content: bf()
          ? `${H}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
          : `${H}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase to understand existing patterns\n2. Identify similar features and architectural approaches\n3. Consider multiple approaches and their trade-offs\n4. Use AskUserQuestion if you need to clarify the approach\n5. Design a concrete implementation strategy\n6. When ready, use ExitPlanMode to present your plan for approval\n\nRemember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
        tool_use_id: $,
      };
    },
  })));

// READABLE (for understanding):
const enterPlanModeInputSchema = lazySchema(() => z.strictObject({}));
const enterPlanModeOutputSchema = lazySchema(() => z.object({
  message: z.string().describe('Confirmation that plan mode was entered'),
}));

const EnterPlanModeTool = buildTool({
  name: ENTER_PLAN_MODE_TOOL_NAME,
  searchHint: 'switch to plan mode to design an approach before coding',
  maxResultSizeChars: 100_000,
  async description() {
    return 'Requests permission to enter plan mode for complex tasks requiring exploration and design';
  },
  async prompt() {
    return getEnterPlanModeToolPrompt();
  },
  get inputSchema() { return enterPlanModeInputSchema(); },
  get outputSchema() { return enterPlanModeOutputSchema(); },
  userFacingName() { return ''; },
  shouldDefer: true,
  isEnabled() {
    // v2.1.142 CHANGE: pairs allowedChannels with isBackgroundSession().
    // v2.1.112 only checked allowedChannels.length > 0.
    if (getAllowedChannels().length > 0 && isBackgroundSession()) return false;
    return true;
  },
  isConcurrencySafe() { return true; },
  isReadOnly() { return true; },
  renderToolUseMessage,
  renderToolResultMessage,
  renderToolUseRejectedMessage,
  async call(_input, context) {
    if (context.agentId) {
      throw new Error('EnterPlanMode tool cannot be used in agent contexts');
    }
    const appState = context.getAppState();
    handlePlanModeTransition(appState.toolPermissionContext.mode, 'plan');
    context.setToolPermissionContext(prev =>
      applyPermissionUpdate(
        prepareContextForPlanMode(prev),
        { type: 'setMode', mode: 'plan', destination: 'session' }
      )
    );
    return {
      data: {
        message: 'Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.',
      },
    };
  },
  mapToolResultToToolResultBlockParam({ message }, toolUseID) {
    const instructions = isPlanModeInterviewPhaseEnabled()
      ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
      : `${message}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase to understand existing patterns\n2. Identify similar features and architectural approaches\n3. Consider multiple approaches and their trade-offs\n4. Use AskUserQuestion if you need to clarify the approach\n5. Design a concrete implementation strategy\n6. When ready, use ExitPlanMode to present your plan for approval\n\nRemember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`;
    return { type: 'tool_result', content: instructions, tool_use_id: toolUseID };
  },
});

// Mapping: Q38→EnterPlanModeTool, Q3H→ENTER_PLAN_MODE_TOOL_NAME, ve_→enterPlanModeInputSchema,
//          ke_→enterPlanModeOutputSchema, jj→getAllowedChannels, T6→isBackgroundSession,
//          Oo→handlePlanModeTransition, Qz→applyPermissionUpdate,
//          UkH→prepareContextForPlanMode, bf→isPlanModeInterviewPhaseEnabled,
//          XK→buildTool, yH→lazySchema, y→zod, ll7→getEnterPlanModeToolPrompt
```

## Algorithm: Mode Transition

**What it does:** Transitions the session's permission mode from any non-plan mode to `'plan'`, capturing the previous mode in `prePlanMode` and conditionally stripping dangerous-permission rules.

**How it works (step by step):**

1. **Subagent guard**: `if (context.agentId) throw ...` — Subagents (`Agent` tool spawns) inherit mode from their leader at spawn time and cannot independently enter plan mode. Teammates with `plan_mode_required` are pre-set, not entered via this tool.
2. **Side-effect: notify the attachment system** — `handlePlanModeTransition(prevMode, 'plan')` (the `Oo` function in `cli_inner_pretty.js:2961-2964`) flips `U$.needsPlanModeExitAttachment` based on the transition direction. When entering plan mode (from non-plan), it CLEARS the exit-attachment flag so the next reminder cycle doesn't render a stale "you exited plan mode" reminder. **This is essential for the v2.1.132 re-entry fix** — if the previous turn had set `needsPlanModeExitAttachment = true` on a prior `ExitPlanMode`, re-entering plan mode immediately clears it.
3. **State update**: a single `setToolPermissionContext(prev => ...)` call composes two updates:
   - `prepareContextForPlanMode(prev)` (`UkH`, `cli_inner_pretty.js:422720-422735`) — This is the **auto-mode classifier activation** side effect: if the user's `defaultMode` is `'auto'`, it kicks the auto-mode classifier into the right state for plan mode. It also conditionally strips dangerous-permission rules (marking `strippedDangerousRules: true`) so the read-only plan-mode session can't escalate to write actions even if the model tries.
   - `applyPermissionUpdate(..., { type: 'setMode', mode: 'plan', destination: 'session' })` — generic permission updater. `destination: 'session'` means the mode change is session-scoped (not persisted to settings.json). It also stores `prePlanMode = prev.mode` so exit can restore it.
4. **Tool result**: returns a simple success message; the actual workflow instructions go through `mapToolResultToToolResultBlockParam`.

**Why this approach:**
- Composing `prepareContextForPlanMode` *inside* the same setState call (rather than as a separate state update) ensures both transformations apply atomically. A two-step update would risk an intermediate render seeing the auto-mode-stripped context with the old mode still in place.
- The mode transition is set up *before* `setToolPermissionContext` runs so the `Oo` flag flip is in effect when the next attachment build reads it. The argument order — `prevMode` first, `'plan'` second — matches the `Oo` contract.

**Key insight:** The tool is intentionally minimal at the call site. All the heavy lifting (auto-mode classifier, dangerous-rule stripping, mode-event recording) lives in `prepareContextForPlanMode` and `Oo`. This keeps `call` short and testable, while preserving auditability through the chain.

## Algorithm: `prepareContextForPlanMode` (UkH)

**What it does:** Transforms a permission context for plan-mode entry, handling the auto-mode interaction.

```javascript
// ============================================
// prepareContextForPlanMode - Pre-entry permission-context transform
// Location: cli_inner_pretty.js:422720-422735
// ============================================

// ORIGINAL (for source lookup):
function UkH(H) {
  let $ = H.mode;
  if ($ === "plan") return H;
  {
    let q = jR6();
    if ($ === "auto") {
      if (q) return { ...H, prePlanMode: "auto" };
      return (ON?.setAutoModeActive(!1), MT(!0), { ...CQ(H), prePlanMode: "auto" });
    }
    if (q && $ !== "bypassPermissions") return (ON?.setAutoModeActive(!0), { ...bb(H), prePlanMode: $ });
  }
  return (
    N(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${$}`, { level: "info" }),
    { ...H, prePlanMode: $ }
  );
}

// READABLE (for understanding):
function prepareContextForPlanMode(ctx) {
  const prev = ctx.mode;
  if (prev === 'plan') return ctx;  // idempotent re-entry guard
  const shouldPlanUseAuto = shouldPlanUseAutoMode();  // jR6
  if (prev === 'auto') {
    if (shouldPlanUseAuto) {
      // Plan piggybacks auto-mode; keep dangerous rules in place
      return { ...ctx, prePlanMode: 'auto' };
    }
    // Auto active but plan should NOT use auto; deactivate and strip
    autoModeStateModule?.setAutoModeActive(false);
    setNeedsAutoModeExitAttachment(true);
    return { ...stripDangerousPermissionsForAutoMode(ctx), prePlanMode: 'auto' };
  }
  if (shouldPlanUseAuto && prev !== 'bypassPermissions') {
    // Plan opts into auto-mode for this session
    autoModeStateModule?.setAutoModeActive(true);
    return { ...promoteToAutoModeContext(ctx), prePlanMode: prev };
  }
  logForDebugging(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${prev}`, { level: 'info' });
  return { ...ctx, prePlanMode: prev };
}

// Mapping: UkH→prepareContextForPlanMode, H→ctx, $→prev, q→shouldPlanUseAuto,
//          jR6→shouldPlanUseAutoMode, ON→autoModeStateModule, MT→setNeedsAutoModeExitAttachment,
//          CQ→stripDangerousPermissionsForAutoMode, bb→promoteToAutoModeContext, N→logForDebugging
```

### Three branches in detail

1. **Coming from `'auto'`**: If `shouldPlanUseAutoMode()` is true, plan inherits auto. Otherwise auto is deactivated, dangerous rules are stripped (defensive: the model is now in plan mode and shouldn't be able to escalate), and a one-shot `auto_mode_exit` reminder is queued for the next turn. `prePlanMode` is saved as `'auto'` so exit can restore.
2. **Plan-uses-auto + prev not bypass**: When `shouldPlanUseAutoMode()` is true and prev is not `'bypassPermissions'`, plan promotes the context to auto-mode (saving the original mode in `prePlanMode`). This is the "auto-mode kicks in for plan exploration" path.
3. **Default**: Just save `prePlanMode` and let `applyPermissionUpdate` set the mode. The debug log line documents this path for forensics.

**Why `prev === 'plan'` guard?** Defensive: prevents accidentally double-saving `prePlanMode` if `EnterPlanMode.call` runs while already in plan mode. Tied to the v2.1.132 re-entry fix — the model can call `EnterPlanMode` after a prior `ExitPlanMode` in the same session, and this guard ensures the `prePlanMode` from the prior session isn't lost. (Actually it ensures the call returns the context unchanged; the mode was already plan in this edge case.)

## Algorithm: Follow-up Instructions

**What it does:** After `call` succeeds, `mapToolResultToToolResultBlockParam` rewrites the success message into the actual tool_result content the model sees. This is the model's *only* instruction set for what to do in plan mode.

**How it works:**

```javascript
const instructions = isPlanModeInterviewPhaseEnabled()
  ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
  : `${message}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase to understand existing patterns\n2. ...\n6. When ready, use ExitPlanMode to present your plan for approval\n\nRemember: DO NOT write or edit any files yet. ...`;
```

Two branches:

1. **Interview-phase ON** (newer behavior): the tool result is intentionally terse: *"DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow."* The actual workflow guidance (which tools to use, how to ask follow-up questions, how to structure the plan) ships via the **`plan_mode` attachment** (`d65` at `cli_inner_pretty.js:397726`) on the *next* turn. This separation lets the workflow guidance evolve independently and be re-injected each turn without the model recalling it from a single tool_result.
2. **Interview-phase OFF** (legacy behavior): the tool result inlines the full 6-step workflow.

**Why two branches:** The interview-phase flag is a rollout switch for the new workflow ("interview" = the model is allowed to call `AskUserQuestion` mid-plan to clarify scope). The legacy variant exists for backward compatibility while the feature rolls out.

The flag itself is computed by `bf` (`isPlanModeInterviewPhaseEnabled`, `cli_inner_pretty.js:383640`):

```javascript
// ============================================
// isPlanModeInterviewPhaseEnabled - Feature-flag gate for interview-phase
// Location: cli_inner_pretty.js:383640
// ============================================

// ORIGINAL (for source lookup):
function bf() {
  return Z$("tengu_plan_mode_interview_phase", !1);
}

// READABLE (for understanding):
function isPlanModeInterviewPhaseEnabled() {
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_plan_mode_interview_phase', false);
}

// Mapping: bf→isPlanModeInterviewPhaseEnabled, Z$→getFeatureValue_CACHED_MAY_BE_STALE
```

v2.1.142 inlines the flag check (vs. v2.1.88 which included full `USER_TYPE === 'ant'` short-circuit). The ant path now also exits through the same growthbook flag. See `/lyz/codespace/3rd/claude-code/src/utils/planModeV2.ts:50-62` for the v2.1.88 form.

## Gating: `isEnabled` and `--channels`

```javascript
isEnabled() {
  if (jj().length > 0 && T6()) return false;
  return true;
}
```

**What it does:** Returns `false` when **both** `--channels` mode is active AND the session is running as a background-agent worker. `--channels` is the Telegram/Discord remote-control mode: the user is interacting via chat, not the TUI, so the plan-approval dialog (which requires the terminal) cannot run.

**v2.1.142 change:** v2.1.112 only checked `allowedChannels.length > 0`. v2.1.142 adds `T6()` (background-session predicate, abbreviated for "is in a background worker"). The intent: in interactive (foreground) sessions where channels are merely *available*, the user might still be at the terminal and able to approve a plan. In background-agent worker sessions, no terminal is attached. So plan mode is only suppressed when channels AND no-terminal. This pairs with the new `claude agents` flag additions in the v2.1.142 changelog.

**Why disable entry too?** This pairs with the same gate on `ExitPlanMode.isEnabled` (`cli_inner_pretty.js:381669-381672`). If only the *exit* tool were disabled, the model could call `EnterPlanMode` and then be stuck in plan mode with no way out. Mirroring both ensures plan mode is never a trap.

In v2.1.88 source, the gate is gated behind feature flags `KAIROS` or `KAIROS_CHANNELS`:

```typescript
if ((feature('KAIROS') || feature('KAIROS_CHANNELS')) && getAllowedChannels().length > 0) {
  return false;
}
```

In v2.1.142 the feature flag is dead-code-eliminated (the bundler resolves it to true), and the additional `T6()` predicate is bolted on.

## Why `shouldDefer: true`?

`shouldDefer: true` flags this tool as "deferred announcement": the agent loop only announces it to the model when it is currently applicable. The exact semantics:

- The deferred tool list is rebuilt each turn based on `isEnabled` plus mode-specific filters.
- For `EnterPlanMode`, this prevents announcing it in plan mode (where it would be a no-op) and prevents announcing it in modes that already preclude plan mode (e.g. some subagent contexts).
- For `ExitPlanMode`, deferral lets it be announced after the plan is approved so the model knows the tool was the one that approved.

The flag is checked by the tool registry, not by `isEnabled`. They are orthogonal: `isEnabled` is the hard gate (e.g. `--channels`); `shouldDefer` is a behavior modifier on the announcement strategy.

## Prompt: External vs. Ant

The `prompt()` getter dispatches via `ll7()` (`getEnterPlanModeToolPrompt`):

```typescript
export function getEnterPlanModeToolPrompt(): string {
  return process.env.USER_TYPE === 'ant'
    ? getEnterPlanModeToolPromptAnt()
    : getEnterPlanModeToolPromptExternal();
}
```

Both variants ship in the v2.1.142 binary. The Ant variant is shorter and more permissive ("use plan mode when there's genuine ambiguity; otherwise just start working"), while the external variant is more eager ("prefer plan mode for non-trivial tasks"). Both share the same `## What Happens in Plan Mode` section, conditionally omitted when `isPlanModeInterviewPhaseEnabled()` is true (because the workflow is then carried by the attachment).

The external prompt text in v2.1.142 is identical to v2.1.88 modulo whitespace. See `cli_inner_pretty.js:383662-383760` (full string literal) vs. `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/prompt.ts:23-98`.

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| Tool shape | `Tool<InputSchema, Output>` | Same (obfuscated `Q38`) | Identical |
| Input schema | `z.strictObject({})` | Same | Identical |
| Output schema | `{ message: string }` | Same | Identical |
| `isEnabled` gate | `allowedChannels.length>0` | `allowedChannels.length>0 && T6()` | **Refined**: added background-session predicate |
| Subagent throw | yes | yes | Identical |
| `prepareContextForPlanMode` call | yes | yes (via `UkH`) | Identical |
| Mode transition + setMode in one update | yes | yes | Identical |
| Prompt: ant + external | both | both | Identical |
| Workflow attachment behavior | yes | yes | Identical |
| Re-entry support (model calls again after exit) | yes (implicit) | yes (now explicitly tested by v2.1.132 fix) | Identical mechanism; better tested |

The only behavioral change is the `T6()` pairing in `isEnabled`. The re-entry support is unchanged in structure but is now exercised by the `/plan` UI improvement in v2.1.119 and the fix in v2.1.132 that addressed a side-effect regression.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) - all new symbol mappings discovered in this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions

See also:
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) - the companion exit tool
- [implementation.md](./implementation.md) - end-to-end lifecycle
- [plan_file_naming.md](./plan_file_naming.md) - how the plan file path is fixed
- [permission_mode_persistence.md](./permission_mode_persistence.md) - v2.1.119/132/136 deltas
