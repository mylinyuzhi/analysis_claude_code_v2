# Plan Mode (v2.1.193 current-state deep dive)

> Module status: **current-version implementation analysis**, not a net-new v2.1.183 -> v2.1.193 delta. The local `EnterPlanMode` / `ExitPlanMode` handshake is largely carryover from v2.1.183, but this document fills the 2.1.193 tree's missing Plan Mode coverage because the goal explicitly calls out **plan mode, reminders, prompts, and UI**.
>
> Target source: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Named-source cross-check: `/lyz/codespace/3rd/claude-code/src` (2.1.88 lineage mirror).
> Before-picture: `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts` and `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_unpack_pretty/decls/`.

## Summary

Plan Mode is a controlled permission-mode transition, not just a prompt style. The model asks to enter via `EnterPlanMode` (`Z5n`, `cli_inner_pretty.js:381889`), the session's `toolPermissionContext.mode` becomes `"plan"`, and repeated `plan_mode` attachments enforce a read-only planning workflow with exactly one write exception: the plan file. The model exits via `ExitPlanMode` (`UD`, `cli_inner_pretty.js:381532`), which reads the plan from disk, asks for user approval unless the caller is a teammate context, restores `prePlanMode`, and emits a tool result that either blocks for team-lead approval or tells the model to start implementation.

This implementation is source-supported by six code regions:

- Tool constants: `C7` resolves to `EnterPlanMode` at `cli_inner_pretty.js:229308`; `Ex` / `uD` resolve to `ExitPlanMode` at `cli_inner_pretty.js:153113-153114`.
- `ExitPlanMode` schemas and tool object: `cli_inner_pretty.js:381500-381741`.
- `EnterPlanMode` prompt, render helpers, and tool object: `cli_inner_pretty.js:381748-381944`.
- Bootstrap flags for exit/reentry attachments: `TTt`, `kz`, `qfr`, `bse`, and `eme` at `cli_inner_pretty.js:3402-3417`.
- Plan-mode attachment generation and cadence: `Pko`, `fuf`, `muf`, `HEl`, and `KKn` at `cli_inner_pretty.js:473394-473455` and `470052-470064`.
- Plan-mode attachment rendering: `o5f`, `i5f`, `a5f`, and `l5f` at `cli_inner_pretty.js:601213-601511`.

## Detailed Docs

- [reminder_cadence.md](reminder_cadence.md) - attachment scheduling, human-turn throttling, full/sparse rotation, re-entry, exit notices, and compact carryover.
- [prompt_surface.md](prompt_surface.md) - tool prompts, full/sparse reminder prompt text, custom `planModeInstructions`, result text, and remote Ultraplan prompt scaffolding.
- [ui_permission_flow.md](ui_permission_flow.md) - enter/exit permission dialogs, approval option construction, edited-plan handling, feedback, external editor support, auto/bypass/context-clear paths, and Ultraplan refinement.
- [lifecycle_state_machine.md](lifecycle_state_machine.md) - end-to-end state machine across entry, `prePlanMode`, planning attachments, team approval, restore, implementation handoff, exit notices, and re-entry.

## Current vs Previous Versions

This is mostly carryover, but it is still important to document in the 2.1.193 tree:

- **v2.1.183 carryover:** the reconstructed 183 source already shows the same two-tool handshake, plan-file-on-disk contract, teammate leader approval branch, auto-mode restore fallback, and four `ExitPlanMode` tool-result branches. The 183 anchors are documented in `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts`.
- **v2.1.88 lineage:** the named TypeScript source in `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/EnterPlanModeTool.ts`, `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts`, `src/utils/attachments.ts`, and `src/components/permissions/*PlanModePermissionRequest*` matches the semantics and gives stable names for the obfuscated 2.1.193 symbols.
- **2.1.193 evidence:** the current bundle keeps the same core flow and additionally exposes source-level anchors for the current remote Ultraplan scaffolding reminders at `cli_inner_pretty.js:537540-537630` and the `planModeInstructions` custom workflow field at `cli_inner_pretty.js:700728` / `712419`.

## Core Flow

1. `EnterPlanMode` requests user permission through the UI dialog, then sets permission mode to `"plan"`.
2. The first plan-mode turn receives a full `plan_mode` attachment. Subsequent reminders are throttled by human-turn count and alternate full/sparse reminders by attachment count.
3. While in plan mode, the model may read/explore, ask clarifying questions with `AskUserQuestion`, and write only the plan file.
4. `ExitPlanMode` requires a real plan-mode context for local sessions; teammates bypass local UI and either exit locally or send a `plan_approval_request` to the team lead.
5. On approval, `ExitPlanMode` restores `prePlanMode`, preserves/strips auto-mode dangerous rules as appropriate, sets one-time exit flags, and returns an approval tool result.
6. After exit, a `plan_mode_exit` attachment tells the model it can now edit and run tools.

## Key Algorithms and Decisions

### Enter Plan Mode Transition

**What it does:** Switches the active permission mode into `"plan"` while preserving the previous mode in `prePlanMode`.

**How it works:**
1. `EnterPlanMode` rejects agent contexts: `if (t.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts")` at `cli_inner_pretty.js:381922`.
2. It calls `handlePlanModeTransition` (`eme`) with the previous mode and `"plan"`, which clears stale exit attachment state when entering plan mode (`cli_inner_pretty.js:3415`).
3. It prepares the current permission context with `prepareContextForPlanMode` (`Pmt`) before applying `setMode -> plan`. This ordering matters: `Pmt` records `prePlanMode` before the mode is overwritten.
4. It returns a tool result with the six-step planning reminder: explore, identify existing patterns, consider trade-offs, ask questions, design strategy, and call `ExitPlanMode`.

**Why this approach:**
- Preserving `prePlanMode` lets exit restore the exact permission style the user had before planning, including `"auto"` when the auto-mode gate is still valid.
- Blocking agent contexts avoids an unexitable trap. Agents do not have the same local approval UI path as the main session, so entry is reserved for the main thread.
- The tool is read-only (`isReadOnly() { return !0; }` at `cli_inner_pretty.js:381916`) because the state change itself is mediated as a permission-mode update, not a filesystem mutation.

**Key insight:** `EnterPlanMode` does not merely tell the model to plan. It changes the permission context, then relies on attachment reminders to keep the model inside the read-only contract.

```javascript
// ============================================
// enterPlanModeToolCall - Main transition into plan permission mode
// Location: cli_inner_pretty.js:381915-381942
// ============================================

// ORIGINAL (for source lookup):
async call(e, t) {
  if (t.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  return (eme(Nr(t).mode, "plan"), t.setToolPermissionContext((n) => _y(Pmt(n), { type: "setMode", mode: "plan", destination: "session" })), { data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } });
}

// READABLE (for understanding):
async function enterPlanModeToolCall(input, context) {
  if (context.agentId) throw new Error("EnterPlanMode tool cannot be used in agent contexts");
  handlePlanModeTransition(getPermissionContext(context).mode, "plan");
  context.setToolPermissionContext((previous) =>
    applyPermissionUpdate(prepareContextForPlanMode(previous), {
      type: "setMode",
      mode: "plan",
      destination: "session",
    }),
  );
  return {
    data: {
      message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
    },
  };
}

// Mapping: Z5n→EnterPlanModeTool, C7→ENTER_PLAN_MODE_TOOL_NAME, eme→handlePlanModeTransition, Nr→getPermissionContext, _y→applyPermissionUpdate, Pmt→prepareContextForPlanMode
```

### Plan Mode Reminder Cadence

**What it does:** Re-injects plan-mode instructions often enough to preserve the read-only contract, but not on every tool loop.

**How it works:**
1. `getPlanModeAttachmentTurnCount` (`Pko`) scans messages backward from the current turn. It counts only human user turns: user messages that are not meta and do not contain tool-result content (`cli_inner_pretty.js:473394-473408`).
2. If a previous `plan_mode` or `plan_mode_reentry` attachment is found and fewer than 5 human turns have passed, `muf` returns no new attachment (`cli_inner_pretty.js:473421-473425`).
3. `countPlanModeAttachmentsSinceLastExit` (`fuf`) counts prior `plan_mode` attachments until a `plan_mode_exit` boundary (`cli_inner_pretty.js:473410-473420`).
4. `muf` chooses `full` if `(count + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1`; otherwise it chooses `sparse` (`cli_inner_pretty.js:473432`). Both constants are 5 at `cli_inner_pretty.js:474654`.
5. If `hasExitedPlanModeInSession` (`TTt`) is true and a plan exists, `muf` first emits a `plan_mode_reentry` attachment and clears the flag (`cli_inner_pretty.js:473431`).
6. The full renderer (`i5f`) includes the five-phase workflow. The sparse renderer (`a5f`) compresses it into one reminder sentence. The subagent renderer (`l5f`) uses stricter language and does not include the full multi-agent plan workflow.

**Why this approach:**
- Counting human turns instead of assistant/tool turns prevents tool-heavy exploration from repeatedly flooding context with full plan instructions.
- The full/sparse split preserves the safety invariant while controlling prompt bloat.
- Resetting at `plan_mode_exit` makes re-entry fresh: a new planning cycle gets full instructions again instead of inheriting the old sparse cadence.

**Key insight:** The cadence is attached to human conversation progress, not tool-loop mechanics. That is the important protection against both missing reminders and over-injecting reminders during exploration.

```javascript
// ============================================
// buildPlanModeAttachments - Cadenced plan-mode reminder injection
// Location: cli_inner_pretty.js:473421-473443
// ============================================

// ORIGINAL (for source lookup):
async function muf(e, t, n, r) {
  if (Nr(n).mode !== "plan") return [];
  if (t && t.length > 0) {
    let { turnCount: u, foundPlanModeAttachment: d } = Pko(t);
    if (d && u < Rko.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  BPe(xt(), r?.planSlugSeed ?? e ?? void 0);
  let s = ND(n.agentId), i = BD(n.agentId), a = [];
  if (TTt() && i !== null) (a.push({ type: "plan_mode_reentry", planFilePath: s }), kz(!1));
  let c = (fuf(t ?? []) + 1) % Rko.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return (a.push({ type: "plan_mode", reminderType: c, isSubAgent: !!n.agentId, planFilePath: s, planExists: i !== null, customInstructions: n.options.planModeInstructions }), a);
}

// READABLE (for understanding):
async function buildPlanModeAttachments(sessionId, messages, context, options) {
  if (getPermissionContext(context).mode !== "plan") return [];
  if (messages?.length) {
    const { turnCount, foundPlanModeAttachment } = countHumanTurnsSinceLastPlanAttachment(messages);
    if (foundPlanModeAttachment && turnCount < PLAN_MODE_ATTACHMENT_CONFIG.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  seedPlanFilePath(getCurrentWorkingDirectory(), options?.planSlugSeed ?? sessionId ?? undefined);
  const planFilePath = getPlanFilePath(context.agentId);
  const existingPlan = getPlan(context.agentId);
  const attachments = [];
  if (hasExitedPlanModeInSession() && existingPlan !== null) {
    attachments.push({ type: "plan_mode_reentry", planFilePath });
    setHasExitedPlanMode(false);
  }
  const reminderType =
    (countPlanModeAttachmentsSinceLastExit(messages ?? []) + 1) %
      PLAN_MODE_ATTACHMENT_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS ===
    1
      ? "full"
      : "sparse";
  attachments.push({ type: "plan_mode", reminderType, isSubAgent: !!context.agentId, planFilePath, planExists: existingPlan !== null, customInstructions: context.options.planModeInstructions });
  return attachments;
}

// Mapping: muf→buildPlanModeAttachments, Pko→countHumanTurnsSinceLastPlanAttachment, fuf→countPlanModeAttachmentsSinceLastExit, Rko→PLAN_MODE_ATTACHMENT_CONFIG, ND→getPlanFilePath, BD→getPlan, TTt→hasExitedPlanModeInSession, kz→setHasExitedPlanMode
```

### Exit Plan Mode Approval and Restore

**What it does:** Converts a plan file into an approval decision, restores the pre-plan permission mode, and returns a branch-specific tool result.

**How it works:**
1. The input schema accepts `allowedPrompts` and passthrough fields, while the SDK-facing schema can include injected `plan` and `planFilePath` (`cli_inner_pretty.js:381500-381508`). This keeps the model-facing contract "read plan from disk", while permission/UI flows can pass an edited plan back.
2. `validateInput` rejects local calls outside `"plan"` mode and logs `tengu_exit_plan_mode_called_outside_plan` (`cli_inner_pretty.js:381567-381584`). Teammates bypass this validation.
3. `checkPermissions` asks `"Exit plan mode?"` for local sessions and allows teammate contexts (`cli_inner_pretty.js:381586-381588`).
4. The call reads `input.plan` if present, otherwise falls back to the plan file (`BD`). If an edited plan arrives from UI, it writes it back to disk and re-snapshots remote state (`cli_inner_pretty.js:381600-381610`).
5. Required-plan teammates do not exit immediately. They write a `plan_approval_request` to `team-lead`, mark the in-process teammate as awaiting approval, and return `awaitingLeaderApproval` (`cli_inner_pretty.js:381611-381631`).
6. Local/session exit computes whether auto mode can be restored. If `prePlanMode === "auto"` but the auto-mode gate is off, it notifies and restores to `"default"` instead (`cli_inner_pretty.js:381633-381655`).
7. If still in plan mode, it sets `hasExitedPlanMode` and `needsPlanModeExitAttachment`, restores or strips dangerous permissions depending on the target mode, clears `prePlanMode`, and returns result data (`cli_inner_pretty.js:381657-381700`).
8. The tool result has four branches: team-lead approval pending, agent approval "ok", empty plan approval, or approved plan echoed under `## Approved Plan` / `## Approved Plan (edited by user)` (`cli_inner_pretty.js:381681-381730`).

**Why this approach:**
- The plan file is the review artifact, so the approval UI and future transcript references are grounded in the same content the model wrote.
- Restoring through `prePlanMode` makes Plan Mode a temporary mode, not a sticky global change.
- The auto-mode gate fallback prevents `ExitPlanMode` from bypassing a circuit breaker or settings disable by blindly reactivating auto mode.
- Teammate approval is mailbox-based because a teammate does not own the user's local approval dialog.

**Key insight:** `ExitPlanMode` is both a user-approval tool and a permission-context repair point. The subtle part is the restore path: it must return to the user's previous mode without reviving auto mode after the auto-mode gate has become unavailable.

```javascript
// ============================================
// exitPlanModeRestore - Restore pre-plan permission mode after approval
// Location: cli_inner_pretty.js:381633-381700
// ============================================

// ORIGINAL (for source lookup):
let p = Nr(t);
if (p.mode === "plan") {
  (kz(!0), bse(!0));
  let m = p.prePlanMode ?? "default";
  {
    if (m === "auto" && !(i?.isAutoModeGateEnabled() ?? !1)) m = "default";
    let y = m === "auto", b = s?.isAutoModeActive() ?? !1;
    if ((s?.setAutoModeActive(y), b && !y)) zU(!0);
  }
  zye({ from: "plan", to: m, trigger: "exit_plan_mode" });
  let g = m === "auto", h = p.strippedDangerousRules;
  t.setToolPermissionContext((y) => {
    let b = y;
    if (g) b = i?.stripDangerousPermissionsForAutoMode(b) ?? b;
    else if (h) b = i?.restoreDangerousPermissions(b) ?? b;
    return { ...b, mode: m, prePlanMode: void 0 };
  });
}

// READABLE (for understanding):
const permissionContext = getPermissionContext(context);
if (permissionContext.mode === "plan") {
  setHasExitedPlanMode(true);
  setNeedsPlanModeExitAttachment(true);
  let restoreMode = permissionContext.prePlanMode ?? "default";
  if (restoreMode === "auto" && !permissionSetup?.isAutoModeGateEnabled()) restoreMode = "default";
  const restoringToAuto = restoreMode === "auto";
  const autoWasUsedDuringPlan = autoModeState?.isAutoModeActive() ?? false;
  autoModeState?.setAutoModeActive(restoringToAuto);
  if (autoWasUsedDuringPlan && !restoringToAuto) setNeedsAutoModeExitAttachment(true);
  logPermissionModeChanged({ from: "plan", to: restoreMode, trigger: "exit_plan_mode" });
  context.setToolPermissionContext((current) => {
    let next = current;
    if (restoringToAuto) next = permissionSetup?.stripDangerousPermissionsForAutoMode(next) ?? next;
    else if (permissionContext.strippedDangerousRules) next = permissionSetup?.restoreDangerousPermissions(next) ?? next;
    return { ...next, mode: restoreMode, prePlanMode: undefined };
  });
}

// Mapping: Nr→getPermissionContext, kz→setHasExitedPlanMode, bse→setNeedsPlanModeExitAttachment, zU→setNeedsAutoModeExitAttachment, zye→logPermissionModeChanged, i→permissionSetupModule, s→autoModeStateModule
```

## Prompt and Reminder Surface

### Tool Prompts

`EnterPlanMode` (`yGp`, `cli_inner_pretty.js:381748`) tells the model to use plan mode for non-trivial implementation tasks, multi-file changes, unclear requirements, architecture decisions, and cases where user preference matters. The `What Happens in Plan Mode` fragment (`hGp`, `cli_inner_pretty.js:381733`) names `Glob`, `Grep`, and `Read`, with an interactive shell-alias branch for `find` / `grep` when available.

`ExitPlanMode` prompt text (`Kza`, defined at `cli_inner_pretty.js:380558` and returned by `UD.prompt()` at `cli_inner_pretty.js:381539-381540`) requires that the plan already be written to the plan file and warns not to use `AskUserQuestion` for plan approval. The extracted tool asset corroborates this at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/assets/tools/ExitPlanMode.md`.

### Plan Mode Attachments

The full attachment renderer `i5f` starts with the hard rule:

- Plan mode is active.
- Do not edit files other than the plan file.
- Do not run non-read-only tools, commit, or change config.
- Build the plan incrementally in the named plan file.

It then emits a five-phase workflow:

1. Initial understanding.
2. Design.
3. Review.
4. Final plan.
5. Call `ExitPlanMode`.

The final-plan phase is defined by `s5f` at `cli_inner_pretty.js:602480-602489`: it asks for context, recommended approach only, critical files, reused functions/utilities, and verification steps. If `planModeInstructions` is present, `i5f` replaces the default workflow body with the custom instructions while keeping the read-only preamble and `ExitPlanMode` footer (`cli_inner_pretty.js:601232-601245`). The SDK schema documents this as "Custom workflow body for plan mode" at `cli_inner_pretty.js:700728` and `712419`.

### Re-entry and Exit Attachments

The `plan_mode_reentry` renderer at `cli_inner_pretty.js:601514-601532` tells the model to read the existing plan file, evaluate whether the current request is the same task or a different task, and edit the plan file before calling `ExitPlanMode`. This is triggered by `muf` only when `hasExitedPlanModeInSession` is true and a plan file exists (`cli_inner_pretty.js:473431`).

The `plan_mode_exit` renderer at `cli_inner_pretty.js:602690-602693` tells the model it has exited plan mode and may now edit, run tools, and take actions. `HEl` emits that attachment when the session is no longer in plan mode and either the one-time flag or a prior plan attachment indicates that an exit notice is needed (`cli_inner_pretty.js:473445-473453`).

### Remote Ultraplan Reminders

2.1.193 carries three remote planning reminders:

- Lightweight remote planning session: `lUl`, `cli_inner_pretty.js:537540-537574`.
- Diagram-aware lightweight remote planning session: `cUl`, `cli_inner_pretty.js:537576-537610`.
- Multi-agent remote planning session: `uUl`, `cli_inner_pretty.js:537612-537630`.

All three instruct the model to call `ExitPlanMode`, handle the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel, and avoid disclosing the scaffolding. These strings also exist in 2.1.183 assets, so they are not a new 193-local concept; they are included because they are part of the current Plan Mode prompt surface.

## UI Surface

The local UI has two approval dialogs:

- **Enter dialog:** `Qpc` at `cli_inner_pretty.js:646536-646605` renders "Enter plan mode?", explains that Claude will explore, identify patterns, design a strategy, and present a plan, then offers "Yes, enter plan mode" / "No, start implementing now". Its answer handler logs `tengu_plan_enter` and applies `setMode -> plan` when the user chooses yes (`cli_inner_pretty.js:646542-646544`).
- **Exit dialog:** `fdc` at `cli_inner_pretty.js:640625-641219` renders "Exit plan mode?" when there is no plan or the simplified confirmation path is active, otherwise it shows "Here is Claude's plan:" and drives accept/reject/edit behavior from the plan content.

The transcript/result renderers are separate from permission dialogs:

- `EnterPlanMode` result renderer `hKa` displays "Entered plan mode" and "Claude is now exploring and designing an implementation approach" (`cli_inner_pretty.js:381846-381861`).
- `ExitPlanMode` tool-result renderer `aKa` chooses among exited, team-submitted, user-approved, and agent-approved states (`cli_inner_pretty.js:381387-381443`, located just before the schemas).
- Rejected plan feedback uses `qEo` at `cli_inner_pretty.js:602456`, which tells the model the plan was rejected and to stay in plan mode.

## Compact Interaction

Plan Mode survives compaction through explicit attachment reconstruction. `createPlanModeAttachmentIfNeeded` is `KKn` at `cli_inner_pretty.js:470052-470064`: if the current permission mode is `"plan"`, it emits a full `plan_mode` attachment with the current plan file path, plan existence bit, subagent bit, and optional custom instructions. The 2.1.88 named source explains why: normally plan instructions arrive through tool-use attachments, so compaction must rebuild them or the model would lose the read-only planning rules after summary.

## Cross-validation Notes

- Stable tool asset check: `assets/tools/EnterPlanMode.md` and `assets/tools/ExitPlanMode.md` in 2.1.193 contain the same model-facing search hints and prompt bodies exposed by `Z5n.prompt()` and `UD.prompt()`.
- 2.1.183 before-picture: `cli_unpack_pretty/decls/vars/Z2t.js` already has `planWasEdited`, `awaitingLeaderApproval`, the `No plan file found` error, and `Approved Plan (edited by user)`. Therefore these are **carryover current-state Plan Mode behavior**, not a 2.1.193 delta.
- 2.1.88 named-source mirror: `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts` has the same `allowedPrompts` schema, disk-plan fallback, teammate leader approval, auto-mode gate fallback, `planWasEdited` branch, and approval tool-result labels. This confirms the semantic naming used for obfuscated 2.1.193 symbols.
- Remote Ultraplan reminder check: the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel exists in both 2.1.183 extracted reminders and current 2.1.88 named source (`src/utils/ultraplan/ccrSession.ts`), so the current 2.1.193 strings are prompt-surface carryover unless a future focused diff proves otherwise.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:

- `EnterPlanModeTool` (`Z5n`, `cli_inner_pretty.js:381889`) - deferred, read-only tool that enters plan mode.
- `ExitPlanModeTool` (`UD`, `cli_inner_pretty.js:381532`) - deferred tool that asks for approval, exits plan mode, and restores `prePlanMode`.
- `ENTER_PLAN_MODE_TOOL_NAME` (`C7`, `cli_inner_pretty.js:229308`) - tool-name constant.
- `EXIT_PLAN_MODE_TOOL_NAME` (`Ex` / `uD`, `cli_inner_pretty.js:153113-153114`) - tool-name constants.
- `prepareContextForPlanMode` (`Pmt`, `cli_inner_pretty.js:598786`) - records `prePlanMode` and handles auto-mode-on-plan-entry.
- `transitionPlanAutoMode` (`A4t`, `cli_inner_pretty.js:598796`) - reconciles auto-mode state while still in plan mode.
- `handlePlanModeTransition` (`eme`, `cli_inner_pretty.js:3414`) - toggles plan-mode exit attachment flags across mode transitions.
- `buildPlanModeAttachments` (`muf`, `cli_inner_pretty.js:473421`) - emits full/sparse/reentry plan-mode attachments.
- `renderPlanModeAttachment` (`o5f`, `cli_inner_pretty.js:601213`) - dispatches full/sparse/subagent plan-mode reminders.
- `renderFullPlanModeAttachment` (`i5f`, `cli_inner_pretty.js:601224`) - renders the full five-phase workflow.
- `renderSparsePlanModeAttachment` (`a5f`, `cli_inner_pretty.js:601311`) - renders the compact recurring reminder.
- `buildExitPlanModeOptions` (`AQf`, `cli_inner_pretty.js:640541`) - builds approval/rejection/context-clear/Ultraplan options.
- `mapExitPlanModeChoiceToPermissionResult` (`Tar`, `cli_inner_pretty.js:640586`) - maps exit UI choices to permission results.
- `buildPlanModeAttachmentForCompact` (`KKn`, `cli_inner_pretty.js:470052`) - recreates full plan-mode instructions after compaction.
- `PLAN_MODE_ATTACHMENT_CONFIG` (`Rko`, `cli_inner_pretty.js:474654`) - 5-turn throttle and every-5th full reminder constants.
- `EnterPlanModePermissionRequest` (`Qpc`, `cli_inner_pretty.js:646536`) - local enter-plan approval dialog.
- `ExitPlanModePermissionRequest` (`fdc`, `cli_inner_pretty.js:640625`) - local exit-plan approval/edit dialog.
