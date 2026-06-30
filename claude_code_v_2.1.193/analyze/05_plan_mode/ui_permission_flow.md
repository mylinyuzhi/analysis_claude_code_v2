# Plan Mode UI Permission Flow

> Scope: local TUI permission surfaces for entering and exiting Plan Mode in 2.1.193, including approval choices, edited-plan handling, feedback, external editor support, auto/bypass restore choices, and Ultraplan refinement.

## Summary

Plan Mode UI is not a passive confirmation layer. The enter dialog turns a deferred tool call into a permission-mode change, and the exit dialog can edit the plan, attach rejection feedback, change the target permission mode, clear context, resume auto mode, or launch remote Ultraplan refinement.

The main UI functions are:

- `EnterPlanModePermissionRequest` (`Qpc`, `cli_inner_pretty.js:646536-646608`);
- `ExitPlanModePermissionRequest` (`fdc`, `cli_inner_pretty.js:640625-641219`);
- `buildExitPlanModeOptions` (`AQf`, `cli_inner_pretty.js:640541-640570`);
- `mapExitPlanModeChoiceToPermissionResult` (`Tar`, `cli_inner_pretty.js:640586-640624`).

## Enter Dialog

The enter dialog is intentionally simple:

- It logs `tengu_plan_enter` when the user chooses yes (`cli_inner_pretty.js:646542-646544`).
- It calls `handlePlanModeTransition(previousMode, "plan")` before returning the answer (`cli_inner_pretty.js:646542-646544`).
- It shows the title "Enter plan mode?" (`cli_inner_pretty.js:646603-646608`).
- It explains that Claude will explore, identify patterns, design a strategy, and present a plan (`cli_inner_pretty.js:646552-646567`).
- It says no code changes will be made until approval (`cli_inner_pretty.js:646571-646576`).
- It offers "Yes, enter plan mode" and "No, start implementing now" (`cli_inner_pretty.js:646589-646596`).

The named-source mirror is `src/components/permissions/EnterPlanModePermissionRequest/EnterPlanModePermissionRequest.tsx` in the 2.1.88 tree.

## Exit Dialog Surfaces

`ExitPlanModePermissionRequest` starts at `cli_inner_pretty.js:640625`. It has two visible modes:

- no plan or empty plan: a small "Exit plan mode?" confirmation with "Yes" / "No" (`cli_inner_pretty.js:641028-641061`);
- non-empty plan: a larger "Ready to code?" approval view that shows "Here is Claude's plan:", the rendered plan, requested permissions, approval options, feedback input, image paste support, and optional external-editor hint (`cli_inner_pretty.js:641063-641218`).

The component initializes the editable plan content from the payload plan or a fallback message (`cli_inner_pretty.js:640648-640655`). It tracks whether the plan was edited locally (`W`) and includes `plan: currentPlan` in `updatedInput` only when local edits happened (`Tar`, `cli_inner_pretty.js:640586-640599`). This is what drives the later `Approved Plan (edited by user)` result label in `ExitPlanMode`.

## Key Algorithms and Decisions

### Exit Option Construction

**What it does:** Builds the menu of possible exit actions based on context pressure and available permission modes.

**How it works:**
1. `buildExitPlanModeOptions` (`AQf`) starts with an empty option list (`cli_inner_pretty.js:640541-640550`).
2. If clear-context mode is available, it offers a context-clearing approval option. The target mode is bypass, auto, or accept-edits depending on availability (`cli_inner_pretty.js:640551-640554`).
3. It then offers a keep-context approval option: bypass, auto, or accept-edits (`cli_inner_pretty.js:640555-640557`).
4. It always offers "Yes, manually approve edits" (`cli_inner_pretty.js:640558`).
5. If Ultraplan is available, it offers "No, refine with Ultraplan on Claude Code on the web" (`cli_inner_pretty.js:640558-640559`).
6. It always appends a feedback input option labeled "No, keep planning" with `shift+tab` approval guidance (`cli_inner_pretty.js:640561-640568`).

**Why this approach:**
- Exiting plan mode is not always just "start coding"; the user may want bypass, auto, manual approval, or context clearing.
- High context usage can be handled at the same moment as approval, preserving the plan while clearing old conversation context.
- Feedback and Ultraplan are first-class rejection/refinement paths, not hidden side channels.

**Key insight:** The exit dialog is a mode-selection gateway. It chooses both whether to approve and what execution mode should follow approval.

### Exit Choice Normalization

**What it does:** Converts a UI menu choice into the permission result consumed by the deferred `ExitPlanMode` tool.

**How it works:**
1. `mapExitPlanModeChoiceToPermissionResult` (`Tar`) receives the current plan, edit state, allowed prompts, feedback, image blocks, and context-clear flag (`cli_inner_pretty.js:640586-640598`).
2. If the plan was edited locally, it includes `{ plan: currentPlan }` in `updatedInput`; otherwise `updatedInput` is empty (`cli_inner_pretty.js:640598`).
3. `ultraplan` returns `behavior: "deny"` with remote-refinement feedback (`cli_inner_pretty.js:640599`).
4. clear-context approval choices return `behavior: "deny"` because the UI starts an auto-continuation with a new initial message instead of letting the current deferred tool continue (`cli_inner_pretty.js:640600-640601`, continuation setup at `640818-640856`).
5. `yes-resume-auto-mode` can return `behavior: "allow"` with no extra permission updates when auto mode is available (`cli_inner_pretty.js:640602-640603`).
6. keep-context approval choices map to a permission mode and return `behavior: "allow"` with `permissionUpdates` (`cli_inner_pretty.js:640604-640614`).
7. `no` returns `null` if there is no feedback or image; otherwise it returns `behavior: "deny"` with text feedback and optional image blocks (`cli_inner_pretty.js:640615-640620`).

**Why this approach:**
- The same UI can support approval, rejection, remote refinement, and context-reset continuation.
- Edited plans are passed only when needed, preserving the disk-plan-as-source-of-truth contract for normal approvals.
- Rejection with feedback is represented as a denied permission result, keeping the session in plan mode while sending useful guidance back to the model.

**Key insight:** Some "yes" choices intentionally deny the current tool call. They do that to replace the next model input with a context-cleared implementation prompt, not because the plan was rejected.

### External Editor Round Trip

**What it does:** Lets the user edit the plan outside the inline TUI editor and bring the modified content back into the approval dialog.

**How it works:**
1. The exit dialog listens for `ctrl+g` (`cli_inner_pretty.js:640980-641014`).
2. It logs `tengu_plan_external_editor_used` (`cli_inner_pretty.js:640984`).
3. If a plan file path exists, it opens/reads that path through `g6(x)`; otherwise it opens a temp editor seeded with current plan text (`cli_inner_pretty.js:640985-641011`).
4. If returned content differs from the current plan, it updates local plan state and marks the plan edited (`cli_inner_pretty.js:640996-641010`).
5. The UI shows an external editor hint and "Plan saved!" status (`cli_inner_pretty.js:641164-641187`).

**Why this approach:**
- Long plans are awkward to edit in a compact terminal prompt.
- Editing the actual plan file keeps the review artifact consistent with what the model will later read.
- The `planEditedLocally` flag makes downstream result text explicit when the user changed the plan.

**Key insight:** The UI preserves the plan file as the artifact while still allowing local edits to flow back through `ExitPlanMode` as `updatedInput.plan`.

### Auto and Context-Clear Approval Paths

**What it does:** Supports starting implementation in the right permission mode, optionally with cleared context.

**How it works:**
1. If context clearing is selected, `fdc` logs `tengu_plan_exit`, logs the permission transition, builds a new `initialMessage` beginning with "Implement the following plan:", and sets `clearContext: true` (`cli_inner_pretty.js:640818-640856`).
2. If resume-auto is selected, it sets auto mode active, logs the transition, and returns an allow result through `Tar` (`cli_inner_pretty.js:640859-640878`).
3. If a keep-context approval path is selected, it logs the transition, sets plan-exit flags, and returns an allow result with the selected permission updates (`cli_inner_pretty.js:640881-640902`).
4. Empty-plan confirmation has its own simpler path that sets mode to default and emits allow/deny directly (`cli_inner_pretty.js:640957-640973`).

**Why this approach:**
- The user can approve a plan and decide execution permissions in one step.
- Context clearing starts implementation from a concise plan-centered prompt instead of carrying all planning context forward.
- Resume-auto is gated by auto availability rather than blindly reactivating autonomous execution.

**Key insight:** The exit dialog is also the handoff from planning context to implementation context.

## Transcript and Tool Result Renderers

The permission dialogs are not the only UI:

- `EnterPlanMode` result renderer `hKa` displays "Entered plan mode" and a short description (`cli_inner_pretty.js:381839-381856`).
- `EnterPlanMode` rejection renderer `yKa` displays "User declined to enter plan mode" (`cli_inner_pretty.js:381858-381866`).
- `ExitPlanMode` result renderer `aKa` chooses between exited, team-submitted, user-approved, and agent-approved display states (`cli_inner_pretty.js:381387-381443`).
- rejected plan feedback is encoded by `qEo` at `cli_inner_pretty.js:602456-602459`.

The named-source mirror is in:

- `src/components/permissions/ExitPlanModePermissionRequest/ExitPlanModePermissionRequest.tsx`;
- `src/components/messages/PlanApprovalMessage.tsx`;
- `src/components/messages/UserToolResultMessage/RejectedPlanMessage.tsx`.

## Cross-Version Notes

- 2.1.183 reconstructed Plan Mode docs already describe the local "Exit plan mode?" approval flow, plan-file review artifact, teammate approval branch, and edited-plan result label.
- 2.1.88 named source validates the component-level names and the same edit/approval split.
- 2.1.193 adds the current source anchors for Ultraplan refinement and the broader exit option builder in this bundle, but the local approval concept is carryover.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode symbols
> - [cross_validation_report_plan_mode.md](../00_overview/cross_validation_report_plan_mode.md) - validation report

Key functions in this document:

- `EnterPlanModePermissionRequest` (`Qpc`) - local approval UI for entering plan mode.
- `ExitPlanModePermissionRequest` (`fdc`) - local approval/edit UI for exiting plan mode.
- `buildExitPlanModeOptions` (`AQf`) - exit option list builder.
- `mapExitPlanModeChoiceToPermissionResult` (`Tar`) - UI choice to permission result converter.
- `setHasExitedPlanMode` (`kz`) - marks plan-mode exit for later re-entry reminders.
- `setNeedsPlanModeExitAttachment` (`bse`) - triggers the post-exit reminder attachment.
