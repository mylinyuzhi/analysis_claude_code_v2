# Tool: EnterPlanMode — Switch to Plan Mode

> **Identity:** wire-name `EnterPlanMode`, userFacingName `""` (blank — UI renders custom text), `isReadOnly: true`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:383786-383866` (declaration), `assets/tools/EnterPlanMode.md` (tool def).

EnterPlanMode transitions the session into **plan mode**: a read-only exploration phase where the model designs an implementation approach before writing code. The cross-link is the [12_plan_mode](../12_plan_mode/) module.

---

## Overview

Plan mode is a separate permission mode (in the `PermissionMode` enum alongside `"default"`, `"acceptEdits"`, `"bypassPermissions"`, `"auto"`). When entered:

- File-write tools (Edit, Write, NotebookEdit) are gated by the plan-mode prePlanMode rule — they will all ask for permission, defeating "edit freely."
- The system prompt is replaced with a plan-mode prompt directing the model to explore via Read/Grep/Glob/Agent.
- The plan file (a markdown scratch buffer) is created at the session's plan path.
- The model is expected to write its plan there, then call ExitPlanMode when ready.

The transition is **user-approved**: EnterPlanMode requires `requiresUserInteraction: true`, so the user gets a prompt confirming the mode switch before it happens.

---

## Input Schema (`ve_`)

```javascript
// ============================================
// enterPlanModeInputSchema - Empty schema
// Location: cli_inner_pretty.js:383796 (ve_)
// ============================================

// ORIGINAL (for source lookup):
ve_ = yH(() => y.strictObject({}));

// READABLE (for understanding):
enterPlanModeInputSchema = lazy(() => z.strictObject({}));

// Mapping: ve_→enterPlanModeInputSchema
```

No parameters. The tool is a mode-switch signal; the only decision the model makes is *whether* to call it, not *how*.

**Why no "reason" parameter:** Plan mode is opt-in by design. If the model decides to call EnterPlanMode, the implicit reason is "the task is non-trivial." Adding a reason field would tempt the model to over-justify ("I think this might require planning because X") consuming tokens for no decision-making value.

---

## Output Schema (`ke_`)

```javascript
// ============================================
// enterPlanModeOutputSchema - Confirmation string
// Location: cli_inner_pretty.js:383797 (ke_)
// ============================================

// ORIGINAL (for source lookup):
ke_ = yH(() => y.object({ message: y.string().describe("Confirmation that plan mode was entered") }));

// READABLE (for understanding):
enterPlanModeOutputSchema = lazy(() =>
  z.object({
    message: z.string().describe("Confirmation that plan mode was entered"),
  }),
);

// Mapping: ke_→enterPlanModeOutputSchema
```

Just a confirmation string. The downstream effect (mode change, plan file creation) is reflected in subsequent tool calls' permission context — not in this tool's return value.

---

## call() — Mode Transition

```javascript
// ============================================
// callEnterPlanMode - Apply mode change to permission context
// Location: cli_inner_pretty.js:383831-383843 (in Q38.call)
// ============================================

// ORIGINAL (for source lookup):
async call(H, $) {
  if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  let q = $.getAppState();
  return (
    Oo(q.toolPermissionContext.mode, "plan"),
    $.setToolPermissionContext((K) => Qz(UkH(K), { type: "setMode", mode: "plan", destination: "session" })),
    {
      data: {
        message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
      },
    }
  );
}

// READABLE (for understanding):
async function callEnterPlanMode(_input, context) {
  // Step 1: Reject if in subagent context — subagents don't use plan mode
  if (context.agentId) {
    throw new Error("EnterPlanMode tool cannot be used in agent contexts");
  }

  // Step 2: Telemetry — log the mode transition
  const appState = context.getAppState();
  logModeTransition(appState.toolPermissionContext.mode, "plan");

  // Step 3: Apply the mode change to the permission context, saved per-session
  context.setToolPermissionContext(currentContext =>
    applyPermissionRuleChange(captureRevertState(currentContext), {
      type: "setMode",
      mode: "plan",
      destination: "session",
    })
  );

  return {
    data: {
      message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
    },
  };
}

// Mapping: H→_input, $→context, q→appState, K→currentContext, Oo→logModeTransition,
//          Qz→applyPermissionRuleChange, UkH→captureRevertState
```

### Why Reject in Subagent Context

Subagents are spawned by the Agent tool with `subagent_type` set. They have their own permission context (often inherited from the parent), their own conversation, and their own tools. Letting a subagent enter plan mode would:

1. Conflict with the parent's mode — the parent expects subagents to *execute* the plan, not re-plan.
2. Confuse the UI — the plan-mode banner is a top-level UI element, not a subagent thing.
3. Block writes in the subagent's context, even though the subagent was probably given Write/Edit tools by the parent for a specific reason.

The error code is a hard floor: subagents cannot enter plan mode. If they need planning, they should ask the parent to plan (via SendMessage or their result) and let the parent re-dispatch.

### Why `captureRevertState` (`UkH`)

When `setMode` is applied, the system snapshots the pre-plan-mode context — specifically the `prePlanMode` field is set to whatever mode was active. This lets ExitPlanMode reverse the transition: when leaving plan mode, the session returns to its pre-plan state.

If the user was in `"acceptEdits"` mode before entering plan, then exiting plan mode returns to `"acceptEdits"`, not the global default `"default"`.

### `destination: "session"`

The mode change is session-scoped, not user-settings-scoped. When the session ends, the user's global default mode is unchanged. This avoids the surprise of "I entered plan mode for one debugging session and now all my future sessions start in plan mode."

---

## checkPermissions

Not explicitly listed on the tool definition. The `requiresUserInteraction: true` flag triggers the user-prompt path: every call asks the user to confirm.

The UI dialog is custom (handled by `il7`/`renderToolUseMessage`): instead of a generic "allow this tool?", it shows "Switch to plan mode?" with explanation.

---

## isEnabled

```javascript
isEnabled() {
  if (jj().length > 0 && T6()) return !1;
  return !0;
}
```

The tool is disabled when:
- `jj()` returns non-empty array (interactive prompts are paused — some other dialog is open)
- AND `T6()` returns true (we're in a TTY environment that can render prompts)

In a non-interactive (SDK/headless) session, this combination doesn't apply, so plan mode is available there too — but the SDK has to handle the mode change manually via its event stream.

---

## mapToolResultToToolResultBlockParam — Mode-Specific Instructions

```javascript
mapToolResultToToolResultBlockParam({ message: H }, $) {
  return {
    type: "tool_result",
    content: bf()
      ? `${H}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
      : `${H}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase to understand existing patterns\n2. Identify similar features and architectural approaches\n3. Consider multiple approaches and their trade-offs\n4. Use AskUserQuestion if you need to clarify the approach\n5. Design a concrete implementation strategy\n6. When ready, use ExitPlanMode to present your plan for approval\n\nRemember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
    tool_use_id: $,
  };
}
```

The post-transition message branches based on `bf()` (the `tengu_plan_mode_interview_phase` GrowthBook gate):

- **Interview phase mode (`bf() === true`)**: Short message. The system follows up with multi-message scripted workflow instructions ("Now ask the user about their preferences..."). This is the v2.1.140+ richer plan-mode experience.
- **Classic mode**: Long message with a 6-step workflow embedded in the result. Self-contained — the model has everything it needs to proceed.

**Why two modes:** The interview-phase pattern (gated) is more guided — the system explicitly walks the model through clarifying questions, then exploration, then plan synthesis. The classic pattern relies on the model to follow the embedded checklist. The interview phase is being tested as a UX improvement; the classic mode is the stable fallback.

**The plan file location:** Not in this tool's response, but set up by the session manager when it sees the mode change. Each session has a per-session plan path `${sessionPlansDir}/${sessionId}.md`. The model writes to this; ExitPlanMode reads from it.

---

## Render Methods

```javascript
renderToolUseMessage: il7,     // "Approve entering plan mode?"
renderToolResultMessage: rl7,  // "Entered plan mode" banner
renderToolUseRejectedMessage: ol7,  // "User declined to enter plan mode"
```

The custom renderers produce plan-mode-specific UI elements rather than generic tool results.

---

## Key Insights

- **Plan mode is a permission mode, not a tool mode**: It's stored in `toolPermissionContext.mode` alongside `"default"`, `"acceptEdits"`, etc. This means it interacts with the existing permission system rather than introducing parallel mechanism. The plan-mode prompt augmentation is what makes it special.

- **Pre-plan-mode is captured for revert**: `captureRevertState` stores the pre-plan-mode in `prePlanMode`. ExitPlanMode restores to this. The capture is session-scoped, so a session's revert always works correctly.

- **Subagents are blocked**: The hard error at the start of `call()` means agent loops cannot enter plan mode. This keeps the top-level workflow as the only entity that can suspend writes.

- **Empty userFacingName**: The tool's `userFacingName()` returns `""`. This makes the tool invisible in places where the tool name would be rendered as a label — the UI handles plan-mode UX with its own components (banner, mode indicator).

- **Cross-link to plan mode module**: Plan mode's broader infrastructure (plan file lifecycle, the autoCompact interaction, the V2 interview workflow) is documented in [12_plan_mode/](../12_plan_mode/). EnterPlanMode is just the entry tool.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.117 | `prePlanMode` revert capture standardized. |
| v2.1.121 | Subagent-block error path added. |
| v2.1.125 | `bf()` gate for the interview-phase workflow introduced. |
| v2.1.129 | The "Detailed workflow instructions will follow" message added for interview phase. |
| v2.1.140 | Plan mode V2 (multi-agent plan synthesis) gated via GrowthBook. |
| v2.1.142 | No changes to EnterPlanMode itself. (Plan mode V2 backing changes are in `12_plan_mode/`.) |

---

## Related Documents

- [exit_plan_mode.md](exit_plan_mode.md) — the companion tool for leaving plan mode
- [12_plan_mode/](../12_plan_mode/) — full plan mode infrastructure (plan file, interview phase, V2 workflow)

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree additions

Key functions in this document:
- `enterPlanModeInputSchema` (ve_) - Empty schema
- `enterPlanModeOutputSchema` (ke_) - {message}
- `enterPlanModeTool` (Q38) - Tool definition
- `logModeTransition` (Oo) - Mode-change telemetry
- `applyPermissionRuleChange` (Qz) - Permission context mutator
- `captureRevertState` (UkH) - Captures prePlanMode for revert
- `isInterviewPhase` (bf) - Plan mode V2 gate
- `ENTER_PLAN_MODE_TOOL_NAME` (Q3H) - "EnterPlanMode"
