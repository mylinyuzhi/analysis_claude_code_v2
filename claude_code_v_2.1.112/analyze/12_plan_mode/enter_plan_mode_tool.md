# EnterPlanModeTool — Deep Deobfuscation (v2.1.112)

`EnterPlanModeTool` is the model-callable tool that transitions a session into plan mode. It is a *deferred* tool (`shouldDefer: true`), so the agent loop announces it conditionally and waits for a fresh evaluation before each call. It exposes **no parameters** — the model just emits `{"name":"EnterPlanMode","input":{}}`.

The full v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/EnterPlanModeTool.ts` (126 lines). The v2.1.112 obfuscated implementation lives at `chunks.151.mjs:1286-1353`. They are equivalent up to renames.

## Symbol Table

- `EnterPlanModeTool` (`o58`) — the exported tool object - chunks.151.mjs:1286
- `ENTER_PLAN_MODE_TOOL_NAME` (`d56`) — the literal `"EnterPlanMode"` - chunks.98.mjs:1319
- `enterPlanModeInputSchema` (`RjY`) — Zod schema, strict empty object - chunks.151.mjs:1284
- `enterPlanModeOutputSchema` (`SjY`) — Zod schema with `message: string` - chunks.151.mjs:1284
- `getEnterPlanModeToolPrompt` (`$vK`) — dispatcher for the prompt (ant vs external) - chunks.151.mjs (function ref)
- `isPlanModeInterviewPhaseEnabled` (`Sj`) — feature flag governing follow-up message variant
- `handlePlanModeTransition` (`bi`) — mode-transition hook - chunks.1.mjs:3042
- `prepareContextForPlanMode` (`zI6`) — auto-mode prep / dangerous-rule stripping (in chunks.107 / chunks.108)
- `applyPermissionUpdate` (`EY`) — generic permission-context updater (chunks)
- `getAllowedChannels` (`qj`) — `--channels` allow-list - referenced by `isEnabled`

## Tool Definition

```javascript
// ============================================
// EnterPlanModeTool - Tool object definition
// Location: chunks.151.mjs:1286-1353
// ============================================

// ORIGINAL (for source lookup):
RjY = C6(() => y.strictObject({})), SjY = C6(() => y.object({
    message: y.string().describe("Confirmation that plan mode was entered")
})), o58 = Iq({
    name: d56,
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() {
        return $vK()
    },
    get inputSchema() { return RjY() },
    get outputSchema() { return SjY() },
    userFacingName() { return "" },
    shouldDefer: !0,
    isEnabled() {
        if (qj().length > 0) return !1;
        return !0
    },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    renderToolUseMessage: HvK,
    renderToolResultMessage: JvK,
    renderToolUseRejectedMessage: XvK,
    async call(q, K) {
        if (K.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
        let _ = K.getAppState();
        return bi(_.toolPermissionContext.mode, "plan"),
               K.setToolPermissionContext((z) => EY(zI6(z), {
                    type: "setMode", mode: "plan", destination: "session"
               })),
               { data: { message: "Entered plan mode. ..." } }
    },
    mapToolResultToToolResultBlockParam({ message: q }, K) {
        return {
            type: "tool_result",
            content: Sj() ? `${q}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
                          : `${q}\n\nIn plan mode, you should:\n1. ...`,
            tool_use_id: K
        }
    }
})

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
        if (getAllowedChannels().length > 0) return false;
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

// Mapping: o58→EnterPlanModeTool, d56→ENTER_PLAN_MODE_TOOL_NAME, RjY→enterPlanModeInputSchema,
//          SjY→enterPlanModeOutputSchema, qj→getAllowedChannels, bi→handlePlanModeTransition,
//          EY→applyPermissionUpdate, zI6→prepareContextForPlanMode, Sj→isPlanModeInterviewPhaseEnabled,
//          Iq→buildTool, C6→lazySchema, y→zod, $vK→getEnterPlanModeToolPrompt
```

## Algorithm: Mode Transition

**What it does:** Transitions the session's permission mode from any non-plan mode to `'plan'`, capturing the previous mode in `prePlanMode` and conditionally stripping dangerous-permission rules.

**How it works (step by step):**

1. **Subagent guard**: `if (context.agentId) throw ...` — Subagents (`Agent` tool spawns) inherit mode from their leader at spawn time and cannot independently enter plan mode. Teammates with `plan_mode_required` are pre-set, not entered via this tool.
2. **Side-effect: notify the attachment system** — `handlePlanModeTransition(prevMode, 'plan')` (the `bi` function in chunks.1.mjs:3042) flips `B8.needsPlanModeExitAttachment` based on the transition direction. When entering plan mode (from non-plan), it CLEARS the exit-attachment flag so the next reminder cycle doesn't render a stale "you exited plan mode" reminder.
3. **State update**: a single `setToolPermissionContext(prev => ...)` call composes two updates:
   - `prepareContextForPlanMode(prev)` — see `permissionSetup.ts` in v2.1.88. This is the **auto-mode classifier activation** side effect: if the user's `defaultMode` is `'auto'`, it kicks the auto-mode classifier into the right state for plan mode. It also conditionally strips dangerous-permission rules (marking `strippedDangerousRules: true`) so the read-only plan-mode session can't escalate to write actions even if the model tries.
   - `applyPermissionUpdate(..., { type: 'setMode', mode: 'plan', destination: 'session' })` — generic permission updater. `destination: 'session'` means the mode change is session-scoped (not persisted to settings.json). It also stores `prePlanMode = prev.mode` so exit can restore it.
4. **Tool result**: returns a simple success message; the actual workflow instructions go through `mapToolResultToToolResultBlockParam`.

**Why this approach:**
- Composing `prepareContextForPlanMode` *inside* the same setState call (rather than as a separate state update) ensures both transformations apply atomically. A two-step update would risk an intermediate render seeing the auto-mode-stripped context with the old mode still in place.
- The mode transition is set up *before* `setToolPermissionContext` runs so the `bi` flag flip is in effect when the next attachment build reads it. The argument order — `prevMode` first, `'plan'` second — matches the `bi` contract.

**Key insight:** The tool is intentionally minimal at the call site. All the heavy lifting (auto-mode classifier, dangerous-rule stripping, mode-event recording) lives in `prepareContextForPlanMode` and `bi`. This keeps `call` short and testable, while preserving auditability through the chain.

## Algorithm: Follow-up Instructions

**What it does:** After `call` succeeds, `mapToolResultToToolResultBlockParam` rewrites the success message into the actual tool_result content the model sees. This is the model's *only* instruction set for what to do in plan mode.

**How it works:**

```javascript
const instructions = isPlanModeInterviewPhaseEnabled()
    ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
    : `${message}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase to understand existing patterns\n2. ...\n6. When ready, use ExitPlanMode to present your plan for approval\n\nRemember: DO NOT write or edit any files yet. ...`;
```

Two branches:

1. **Interview-phase ON** (newer behavior): the tool result is intentionally terse: *"DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow."* The actual workflow guidance (which tools to use, how to ask follow-up questions, how to structure the plan) ships via the **`plan_mode` attachment** (chunks.155.mjs:1624 `HMY`) on the *next* turn. This separation lets the workflow guidance evolve independently and be re-injected each turn without the model recalling it from a single tool_result.
2. **Interview-phase OFF** (legacy behavior): the tool result inlines the full 6-step workflow.

**Why two branches:** The interview-phase flag is a rollout switch for the new workflow ("interview" = the model is allowed to call `AskUserQuestion` mid-plan to clarify scope). The legacy variant exists for backward compatibility while the feature rolls out.

## Gating: `isEnabled` and `--channels`

```javascript
isEnabled() {
    if (getAllowedChannels().length > 0) return false;
    return true;
}
```

**What it does:** Returns `false` when `--channels` mode is active. `--channels` is the Telegram/Discord remote-control mode: the user is interacting via chat, not the TUI, so the plan-approval dialog (which requires the terminal) cannot run.

**Why disable entry too?** This pairs with the same gate on `ExitPlanMode.isEnabled`. If only the *exit* tool were disabled, the model could call `EnterPlanMode` and then be stuck in plan mode with no way out. Mirroring both ensures plan mode is never a trap.

In v2.1.88 source, the gate is gated behind feature flags `KAIROS` or `KAIROS_CHANNELS`:

```typescript
if ((feature('KAIROS') || feature('KAIROS_CHANNELS')) && getAllowedChannels().length > 0) {
    return false;
}
```

In v2.1.112 the feature flag is dead-code-eliminated (the bundler resolves it to true), leaving just the channel-length check.

## Why `shouldDefer: true`?

`shouldDefer: true` flags this tool as "deferred announcement": the agent loop only announces it to the model when it is currently applicable. The exact semantics:

- The deferred tool list is rebuilt each turn based on `isEnabled` plus mode-specific filters.
- For `EnterPlanMode`, this prevents announcing it in plan mode (where it would be a no-op) and prevents announcing it in modes that already preclude plan mode (e.g. some subagent contexts).
- For `ExitPlanMode`, deferral lets it be announced after the plan is approved so the model knows the tool was the one that approved.

The flag is checked by the tool registry, not by `isEnabled`. They are orthogonal: `isEnabled` is the hard gate (e.g. `--channels`); `shouldDefer` is a behavior modifier on the announcement strategy.

## Prompt: External vs. Ant

The `prompt()` getter dispatches via `getEnterPlanModeToolPrompt()`:

```typescript
export function getEnterPlanModeToolPrompt(): string {
    return process.env.USER_TYPE === 'ant'
        ? getEnterPlanModeToolPromptAnt()
        : getEnterPlanModeToolPromptExternal();
}
```

Both variants ship in the v2.1.112 binary. The Ant variant is shorter and more permissive ("use plan mode when there's genuine ambiguity; otherwise just start working"), while the external variant is more eager ("prefer plan mode for non-trivial tasks"). Both share the same `## What Happens in Plan Mode` section, conditionally omitted when `isPlanModeInterviewPhaseEnabled()` is true (because the workflow is then carried by the attachment).

## v2.1.88 → v2.1.112 Diff Summary

| Aspect | v2.1.88 | v2.1.112 | Status |
|--------|---------|----------|--------|
| Tool shape | `Tool<InputSchema, Output>` | Same (obfuscated `o58`) | Identical |
| Input schema | `z.strictObject({})` | Same | Identical |
| Output schema | `{ message: string }` | Same | Identical |
| `isEnabled` gate | `(KAIROS||KAIROS_CHANNELS) && allowedChannels.length>0` | `allowedChannels.length>0` (feature DCE) | DCE only |
| Subagent throw | yes | yes | Identical |
| `prepareContextForPlanMode` call | yes | yes | Identical |
| Prompt: ant + external | both | both | Identical |
| Workflow attachment behavior | yes | yes | Identical |

No behavioral changes. Only feature-flag dead-code elimination.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools
> - Unit-1 additions: [symbol_additions_unit_01.md](../00_overview/symbol_additions_unit_01.md)

See also:
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) - the companion exit tool
- [implementation.md](./implementation.md) - end-to-end lifecycle
- [plan_file_naming.md](./plan_file_naming.md) - how the plan file path is fixed
