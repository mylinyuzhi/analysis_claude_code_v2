# Plan Mode Lifecycle State Machine

> Scope: end-to-end Plan Mode lifecycle in 2.1.193, from entry request through planning reminders, approval, restore, exit notice, and re-entry. This document ties together the tool, permission-context, UI, and attachment surfaces described separately in the reminder, prompt, and UI deep dives.

## Summary

Plan Mode is best understood as a temporary permission-mode state machine:

1. **Default or prior mode:** session starts in an ordinary permission mode such as `default`, `acceptEdits`, `bypassPermissions`, or `auto`.
2. **Enter request:** `EnterPlanMode` asks for local approval and, on approval, records the previous mode in `prePlanMode`.
3. **Planning state:** active mode becomes `"plan"`; read-only planning reminders are injected as attachments.
4. **Plan artifact:** the model writes or edits only the plan file.
5. **Exit request:** `ExitPlanMode` reads the plan file, asks for approval or sends a team-lead approval request.
6. **Restore/handoff:** the session restores `prePlanMode`, falls back from unsafe auto mode when needed, or starts a context-cleared implementation handoff.
7. **Exit notice/re-entry:** one-time flags tell the model it can implement, or warn it when it re-enters planning with an existing plan.

The load-bearing 2.1.193 anchors are:

- bootstrap flags: `TTt`, `kz`, `qfr`, `bse`, `eme` at `cli_inner_pretty.js:3402-3417`;
- entry transition: `Z5n.call` at `cli_inner_pretty.js:381921-381932`;
- permission preparation: `Pmt` at `cli_inner_pretty.js:598780-598794`;
- auto-plan reconciliation: `A4t` at `cli_inner_pretty.js:598796-598805`;
- exit validation/call/restore: `UD` at `cli_inner_pretty.js:381567-381679`;
- UI context-clear/auto handoff paths: `fdc` at `cli_inner_pretty.js:640778-640904`;
- reminders and exit notices: `muf` / `HEl` at `cli_inner_pretty.js:473421-473452`.

## Lifecycle Stages

### Stage 1: Entry Request

`EnterPlanMode` is deferred and requires approval. The permission UI is `EnterPlanModePermissionRequest` (`Qpc`, `cli_inner_pretty.js:646536-646608`). When the user confirms, the UI logs `tengu_plan_enter` and calls `handlePlanModeTransition(previousMode, "plan")` (`cli_inner_pretty.js:646542-646544`).

The actual tool call repeats the state transition on the tool side:

- blocks agent contexts (`cli_inner_pretty.js:381922`);
- calls `handlePlanModeTransition(getPermissionContext(context).mode, "plan")` (`cli_inner_pretty.js:381923-381924`);
- applies `prepareContextForPlanMode(previousContext)` before `setMode -> plan` (`cli_inner_pretty.js:381924-381925`);
- returns the "Entered plan mode" result message (`cli_inner_pretty.js:381926-381931`).

This duplication is intentional: the UI path handles the permission request, while the tool call is the authoritative side-effect point for the permission context.

### Stage 2: Permission Context Preparation

`prepareContextForPlanMode` (`Pmt`) is the central entry helper:

- if already in `"plan"`, it returns the context unchanged (`cli_inner_pretty.js:598781-598782`);
- if entering from `"auto"` and plan-auto semantics are available, it records `prePlanMode: "auto"` without stripping (`cli_inner_pretty.js:598784-598786`);
- if entering from `"auto"` but plan-auto is unavailable, it disables active auto mode, sets the auto-exit attachment flag, strips dangerous rules through the non-auto context helper, and records `prePlanMode: "auto"` (`cli_inner_pretty.js:598786-598788`);
- if plan should use auto semantics and the previous mode is not bypass, it activates auto mode, strips dangerous rules, and records the previous mode (`cli_inner_pretty.js:598789`);
- otherwise it logs the plain entry and records `prePlanMode` (`cli_inner_pretty.js:598791-598794`).

The helper exists because `setMode -> plan` would otherwise overwrite the information needed to restore the previous mode.

### Stage 3: Planning State

While mode is `"plan"`, `buildPlanModeAttachments` (`muf`) emits the recurring planning contract:

- it returns no attachments outside plan mode (`cli_inner_pretty.js:473421-473422`);
- it throttles reminders by human user turns (`cli_inner_pretty.js:473423-473425`);
- it ensures the plan file path is seeded (`cli_inner_pretty.js:473427-473429`);
- it emits a one-time re-entry attachment when appropriate (`cli_inner_pretty.js:473431`);
- it pushes the current `plan_mode` attachment with reminder type, plan path, existence bit, subagent bit, and custom instructions (`cli_inner_pretty.js:473432-473443`).

The planning state has one write exception: the plan file. The full prompt renders this as a hard rule at `cli_inner_pretty.js:601246-601250` and `602488-602489`.

### Stage 4: Exit Request

`ExitPlanMode` (`UD`) validates and asks for approval:

- teammate contexts bypass local validation/interaction (`cli_inner_pretty.js:381563-381569`, `381586-381588`);
- local sessions outside `"plan"` are rejected before the approval dialog (`cli_inner_pretty.js:381567-381584`);
- local sessions in plan mode ask "Exit plan mode?" (`cli_inner_pretty.js:381586-381588`);
- the call reads `input.plan` when the UI supplied an edited plan, otherwise it reads the plan file (`cli_inner_pretty.js:381600-381603`);
- edited UI plans are written back to disk and remote snapshots are refreshed (`cli_inner_pretty.js:381604-381610`).

This keeps the plan file as the approval artifact while still allowing the user to edit it in the UI.

### Stage 5: Team Approval Branch

When the current context is a teammate that requires plan approval, `ExitPlanMode` does not exit locally:

- it requires a plan file (`cli_inner_pretty.js:381611-381615`);
- it creates a `plan_approval_request` payload (`cli_inner_pretty.js:381616-381626`);
- it writes the payload to the `team-lead` mailbox (`cli_inner_pretty.js:381627`);
- it marks the in-process teammate as awaiting approval (`cli_inner_pretty.js:381628-381630`);
- it returns `awaitingLeaderApproval` and `requestId` (`cli_inner_pretty.js:381631`).

The result mapper then tells the teammate to wait for team-lead approval (`cli_inner_pretty.js:381685-381702`). This branch is why Plan Mode cannot be represented purely as a local UI state.

### Stage 6: Restore or Handoff

The ordinary local exit branch restores or hands off execution:

- `ExitPlanMode` computes an auto-mode fallback notification before mutating state (`cli_inner_pretty.js:381633-381655`);
- if still in `"plan"`, it sets `hasExitedPlanMode` and `needsPlanModeExitAttachment` (`cli_inner_pretty.js:381656-381659`);
- it restores `prePlanMode`, but falls back to `"default"` if `prePlanMode` was `"auto"` and the auto-mode gate is off (`cli_inner_pretty.js:381659-381662`);
- it toggles active auto mode and may request an auto-mode exit attachment (`cli_inner_pretty.js:381662-381665`);
- it logs the permission transition (`cli_inner_pretty.js:381666`);
- it strips dangerous rules when restoring to auto, restores them when leaving auto, clears `prePlanMode`, and updates the context (`cli_inner_pretty.js:381667-381674`).

The exit dialog has additional handoff paths:

- context-clear approval builds a new `initialMessage` beginning with "Implement the following plan:" and denies the current permission request so the new context starts cleanly (`cli_inner_pretty.js:640818-640856`);
- resume-auto approval activates auto mode, sets exit flags, logs the transition, and allows the deferred tool (`cli_inner_pretty.js:640859-640878`);
- keep-context approval sets exit flags and returns the selected permission updates (`cli_inner_pretty.js:640881-640902`).

These UI paths are behaviorally distinct, but they all serve the same lifecycle goal: turn an approved plan into an implementation state with the correct permissions.

### Stage 7: Exit Notice and Re-entry

The flags set during exit feed back into the attachment pipeline:

- `needsPlanModeExitAttachment` is read by `HEl` to emit one post-exit notice (`cli_inner_pretty.js:473445-473452`);
- `hasExitedPlanMode` is read by `muf` to emit one re-entry notice if the session enters plan mode again and a plan exists (`cli_inner_pretty.js:473428-473431`);
- `handlePlanModeTransition` clears stale exit state on entry and sets exit state on mode crossings (`cli_inner_pretty.js:3414-3417`).

The model therefore receives explicit transcript boundaries for both "you may now implement" and "you are planning again with an existing plan."

## Key Algorithms and Decisions

### `prePlanMode` Restore Strategy

**What it does:** Makes Plan Mode temporary by preserving and restoring the user's prior permission mode.

**How it works:**
1. Entry runs `prepareContextForPlanMode` before `setMode -> plan`.
2. `prePlanMode` is stored on the permission context.
3. Exit reads `prePlanMode ?? "default"` as the target restore mode.
4. Auto restore is gated by the current auto-mode availability check.
5. Dangerous permissions are stripped or restored based on whether the final target is auto.
6. `prePlanMode` is cleared after restore.

**Why this approach:**
- The user expects planning to be a temporary phase, not a permanent permission-mode change.
- The restore target must be captured before entering plan mode.
- Auto mode is powerful enough that stale `prePlanMode: "auto"` cannot be blindly trusted after circuit breakers or settings changes.

**Key insight:** `prePlanMode` is necessary but not sufficient. The restore path still revalidates auto-mode safety at exit time.

### Auto-Mode While Planning

**What it does:** Reconciles auto-mode behavior when plan mode is active and settings/gates change.

**How it works:**
1. `prepareContextForPlanMode` may activate or deactivate auto-mode side effects during entry (`cli_inner_pretty.js:598784-598789`).
2. `transitionPlanAutoMode` (`A4t`) handles later settings changes while mode is still `"plan"` (`cli_inner_pretty.js:598796-598805`).
3. If the context is not plan, `A4t` returns unchanged unless mode is already auto (`cli_inner_pretty.js:598796-598798`).
4. If `prePlanMode` is missing or bypass, it leaves the plan context alone (`cli_inner_pretty.js:598799`).
5. It compares current plan-auto availability and active auto-mode state, then either strips or restores dangerous permissions and toggles the auto exit flag (`cli_inner_pretty.js:598800-598805`).

**Why this approach:**
- Auto mode can be enabled, disabled, or circuit-broken after Plan Mode has already started.
- The active auto-mode flag is the runtime truth for whether dangerous permissions should be stripped.
- Plan Mode must stay read-only regardless of the user's earlier auto setting.

**Key insight:** Plan Mode is not isolated from auto mode. It carries enough state to return to auto when safe, while still enforcing read-only planning in the interim.

### Approval Artifact Strategy

**What it does:** Keeps the plan file as the shared artifact across model, UI, teammates, and remote handoff.

**How it works:**
1. Plan reminders instruct the model to write the plan file and only that file.
2. Exit reads the plan from disk unless the UI provided an edited plan.
3. UI edits are written back to disk before approval continues.
4. Team approval sends the plan file path and content to the team lead.
5. Tool-result text includes the saved plan path and approved plan content.
6. Remote Ultraplan parsing relies on the approved-plan marker in the tool result.

**Why this approach:**
- A disk-backed plan can be inspected, edited, sent to teammates, and referenced after context clearing.
- The UI and model are reviewing the same artifact.
- The handoff to implementation can survive compaction or context reset.

**Key insight:** Plan Mode's approval unit is not a chat message. It is the plan file plus the approval result that names and echoes it.

## Cross-Version Notes

- 2.1.183 reconstructed Plan Mode source documents the same lifecycle: enter stores `prePlanMode`, exit reads the plan file, teammate-required plans go to the team lead, auto restore is guarded, and result branches are split by agent/empty/edited/leader approval.
- 2.1.88 named source confirms the same semantic structure in `EnterPlanModeTool.ts`, `ExitPlanModeV2Tool.ts`, `permissionSetup.ts`, `attachments.ts`, and `teammate.ts`.
- 2.1.193 remains the source of truth for the exact obfuscated anchors and current UI handoff paths, especially context-clear implementation handoff and Ultraplan refinement from the exit dialog.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode symbols
> - [cross_validation_report_plan_mode.md](../00_overview/cross_validation_report_plan_mode.md) - validation report

Key functions in this document:

- `EnterPlanModeTool` (`Z5n`) - entry tool object and authoritative mode transition.
- `ExitPlanModeTool` (`UD`) - approval, teammate branch, restore, and result mapping.
- `prepareContextForPlanMode` (`Pmt`) - captures `prePlanMode` and handles auto-mode side effects on entry.
- `transitionPlanAutoMode` (`A4t`) - reconciles auto-mode state while still in plan mode.
- `handlePlanModeTransition` (`eme`) - toggles plan-mode exit attachment flags on mode crossings.
- `setHasExitedPlanMode` (`kz`) - records plan exit for re-entry reminders.
- `setNeedsPlanModeExitAttachment` (`bse`) - records plan exit for the post-exit attachment.
- `buildPlanModeAttachments` (`muf`) - emits plan-mode and re-entry attachments.
- `buildPlanModeExitAttachment` (`HEl`) - emits the post-exit attachment.
- `mapExitPlanModeChoiceToPermissionResult` (`Tar`) - normalizes exit UI choices into permission results.
