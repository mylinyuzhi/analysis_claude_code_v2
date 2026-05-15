# Plan Mode × Hooks Integration (v2.1.142)

> How plan mode interacts with the hook system: `UserPromptSubmit` injection, `PreToolUse`/`PostToolUse` on `ExitPlanMode`, attachment-based reminders, and the `defer` decision token. This is a *protocol* document — the hook event lifecycle is detailed in `06_hooks/`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Hook events, plan-mode flags
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permission decisions

Key functions in this document:
- `ExitPlanModeV2Tool` (obfuscated: `V2`) — Tool definition (events for which hooks fire), `cli_inner_pretty.js:381649`
- `setHasExitedPlanMode` (obfuscated: `OT`) — Flag setter
- `setNeedsPlanModeExitAttachment` (obfuscated: `qh`) — Attachment-injection flag for next user turn
- `setNeedsAutoModeExitAttachment` (obfuscated: `MT`) — Auto-mode-exit attachment flag
- `persistFileSnapshotIfRemote` (obfuscated: `u38`) — Mirror plan to transcript (called from `ExitPlanMode.call`)
- `buildPlanModeAttachment` (obfuscated: `d65`) — Per-turn plan-mode reminder dispatcher
- `buildPlanModeExitAttachment` (obfuscated: `c65`) — One-shot exit attachment

---

## Hook Event Touchpoints

Plan mode interacts with the hook system at five lifecycle points:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  user types message                                                      │
│       │                                                                  │
│       ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ UserPromptSubmit hook                                            │    │
│  │  • can inject additionalContext (e.g., "reminder: in plan mode")│    │
│  │  • can sessionTitle override                                     │    │
│  │  • can block (exit code 2 / decision:"block")                    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  model thinks, decides to call a tool (Read, Write, ExitPlanMode, ...) │
│       │                                                                  │
│       ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ PreToolUse hook (per-tool, matcher-filtered)                    │    │
│  │  • can allow / deny / ask / defer (decision token)               │    │
│  │  • can update tool input (updatedInput)                          │    │
│  │  • can inject context (additionalContext)                        │    │
│  │  • Plan mode also runs the tool's checkPermissions:              │    │
│  │      ExitPlanMode → "ask" → ExitPlanModePermissionRequest        │    │
│  │      Write/Edit → "ask" with "Cannot write while in plan mode."  │    │
│  │        (v2.1.136: blocked even with Edit allow rule — see below) │    │
│  │      Bash → planMode-aware UI                                    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  tool .call() runs                                                       │
│       │                                                                  │
│       ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ PostToolUse hook (per-tool, matcher-filtered)                   │    │
│  │  • runs on success                                                │    │
│  │  • can inject additionalContext (typed into tool_result)         │    │
│  │  • can update MCP tool output                                     │    │
│  │  • For ExitPlanMode: hook sees plan + planFilePath               │    │
│  │  • v2.1.119: now receives `duration_ms` of the tool execution   │    │
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  attachments injected before next assistant turn:                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • plan_mode_reminder (if mode === "plan")                        │    │
│  │ • plan_mode_reentry (if HH$() && plan exists after exit)         │    │
│  │ • plan_mode_exit (if needsPlanModeExitAttachment)                │    │
│  │ • auto_mode_exit (if needsAutoModeExitAttachment)                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  next model turn                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Hook Touchpoint 1: PreToolUse on EnterPlanMode

When the model calls `EnterPlanMode`, the agent loop dispatches `PreToolUse` hooks matching `EnterPlanMode`. v2.1.142 inherits the v2.1.112 behavior:

- The hook sees `tool_input: {}` (the tool has no parameters).
- The hook may return `decision: "block"` to prevent entering plan mode. Useful for organizations that want to disable plan mode entirely.
- The hook may return `decision: "approve"` to skip the normal mode-transition gating (but this is rare — `EnterPlanMode` is already self-approving in normal flow).
- The hook may return `decision: "defer"` to wait for additional async resolution. Plan-mode entry is one of the few tool calls where defer is meaningful (the agent loop pauses until the hook resolves).

The `PreToolUse` hook does NOT see the resulting permission context. To inspect the mode change, hooks should match `PostToolUse` on `EnterPlanMode`.

---

## Hook Touchpoint 2: PreToolUse on Write/Edit During Plan Mode (v2.1.136)

This is the most-important v2.1.142-era change. When the model attempts a write/edit while in plan mode, the permission system now runs `VkH` (`checkWritePermissionForTool`) which inserts a plan-mode floor:

```javascript
// At cli_inner_pretty.js:518269-518274:
if (q.mode === "plan")
  return {
    behavior: "ask",
    message: `Cannot write to ${_} while in plan mode.`,
    decisionReason: { type: "mode", mode: "plan" },
  };
```

### Interaction with PreToolUse Hooks

1. Hook can intercept BEFORE `checkPermissions` if registered as `PreToolUse` with matcher `Write|Edit|MultiEdit|NotebookEdit`.
2. If the hook returns `decision: "allow"`, the permission check is bypassed entirely — meaning `checkWritePermissionForTool` doesn't run, and the plan-mode floor is NOT enforced.
3. If the hook returns `decision: "approve"`, the same: permission check is bypassed.
4. If the hook returns no decision (passthrough), `checkWritePermissionForTool` runs and the plan-mode floor applies.

**Implication:** A `PreToolUse` hook returning `allow` on `Edit` calls effectively re-creates the v2.1.136 bug: it bypasses the plan-mode floor. This is intentional — hooks are a higher authority than mode gating. Organizations relying on plan-mode-as-safety should NOT register `PreToolUse` Edit hooks that auto-approve.

### Interaction with Allow Rules

Allow rules (`Edit(/path/**)` in `~/.claude/settings.json`) are evaluated AFTER `checkPermissions`. Because `checkWritePermissionForTool` returns `behavior:"ask"` first when in plan mode, allow rules CANNOT silently auto-approve. This is the core of the v2.1.136 fix.

### Algorithm: `d64` Detection of Plan-Mode Floor

```javascript
function isPlanModeFloorReason(decisionReason) {
  return decisionReason?.type === 'mode' && decisionReason.mode === 'plan';
}
```

This predicate is used by the auto-mode classifier path (`tD` at `cli_inner_pretty.js:421900-421923`) to detect when an "ask" was triggered by plan-mode floor. When detected:

- Emit `tengu_auto_mode_fallback_to_ask` analytics with reason `plan_mode_floor`.
- Surface the ask to the user (not to the auto-mode classifier).

**Why:** Auto-mode tries to handle most asks via classifier. Plan-mode floor is special: it MUST surface to the user (or be blocked entirely) because plan mode is a user-affirmed read-only contract. The classifier is bypassed for this reason.

---

## Hook Touchpoint 3: PreToolUse on ExitPlanMode

When the model calls `ExitPlanMode`, hooks matching `ExitPlanMode` fire BEFORE `checkPermissions` and the approval dialog. v2.1.142 sees:

- `tool_input`: the SDK-shape input, including the disk-read `plan` and `planFilePath` (injected by `normalizeToolInput` before hooks run).
- Hook may `block` to prevent the approval dialog (e.g., enforce: "plan must be longer than N chars").
- Hook may `defer` to pause until async approval (e.g., wait for a Slack message).
- Hook may `updatedInput` to modify the plan content. This flows into `call` via `permissionResult.updatedInput.plan` and triggers the edited-plan write-back.

### Algorithm: Hook-Injected Plan Edits

**What it does:** A `PreToolUse` hook on `ExitPlanMode` can edit the plan content before the user sees it.

**Why useful:**
- Auto-prepend a checklist header.
- Strip secrets/credentials from the plan text before showing to the user.
- Normalize formatting (e.g., enforce H1/H2 hierarchy).

**Mechanism:**
1. Hook receives `tool_input: { plan, planFilePath, ... }`.
2. Hook returns `{ decision: "allow" | "approve", updatedInput: { plan: <modified>, ... } }`.
3. The agent loop merges `updatedInput` into the tool's input.
4. `call()` sees `'plan' in input && typeof input.plan === 'string'` → `inputPlan` is the modified plan.
5. Edited-plan write-back fires: the modified plan is written to disk.
6. `persistFileSnapshotIfRemote` mirrors it to the transcript.
7. User sees the modified plan in the approval dialog.

**Key insight:** This is the same mechanism that CCR uses to ship user-edited plans back into the local CLI. CCR sets `updatedInput.plan` via the `permission_request` reply; a hook setting `updatedInput.plan` is indistinguishable from a user edit at the `call()` level.

---

## Hook Touchpoint 4: PostToolUse on ExitPlanMode

After `ExitPlanMode.call` completes successfully, `PostToolUse` fires. The hook sees:

- `tool_input`: SDK shape with the plan and planFilePath.
- `tool_response`: `{ plan, isAgent, filePath, hasTaskTool, planWasEdited, awaitingLeaderApproval, requestId }`.
- `duration_ms` (NEW in v2.1.119): total tool execution time, excluding permission prompts and PreToolUse hooks.

### v2.1.119 `duration_ms` Addition

Changelog entry: *"`PostToolUse` and `PostToolUseFailure` hook inputs now include `duration_ms` (tool execution time, excluding permission prompts and PreToolUse hooks)"*.

For `ExitPlanMode`, `duration_ms` is the time from when `call()` started to when it returned. This excludes the approval dialog time (which can be minutes) — instead measuring only the disk read, mode restoration, and result mapping. The metric is useful for monitoring tool-level perf regressions.

**Use cases for `PostToolUse` on `ExitPlanMode`:**

- Archive the plan to a separate location (e.g., a corp planning dashboard).
- Notify a Slack channel that a plan was approved.
- Run a static-analysis pre-check on the plan content (e.g., flag plans that mention production deploys).
- Inject `additionalContext` into the tool_result (visible to the model on the next turn).

---

## Hook Touchpoint 5: Background Plan-Verification Hook

After plan approval, the next assistant turn may include a "verify the plan was implemented" check. v2.1.142 supports a `registerPlanVerificationHook` (alluded to in the `ExitPlanMode.call` comment chain) that runs after the model claims completion.

The verification hook is NOT registered inside `ExitPlanMode.call` (the v2.1.88 source had a comment noting this is registered in `REPL.tsx` after context clear). It is set up at session startup.

When fired:

- The hook receives the plan content + the model's tool-use history since approval.
- It can return `decision: "block"` to mark the work incomplete (the model is told to keep working).
- It can return `additionalContext` to provide critique-style feedback.

This is the same machinery used in Ultraplan's "verify plan execution" remote-session option.

---

## Hook Touchpoint 6: UserPromptSubmit Injection

The `UserPromptSubmit` hook runs once per user message, before the model sees the prompt. It can inject `additionalContext` that augments the user's prompt. In plan mode, common patterns:

- "Reminder: you are in plan mode. Read-only operations and the plan file only."
- Inject the current plan content for the model to reference.
- Inject a custom plan-mode workflow (overriding the default).

The `customInstructions` field on the `plan_mode` attachment (set from `context.options.planModeInstructions`) is one mechanism, but `UserPromptSubmit` is more flexible for per-prompt overrides.

---

## Attachment-Based Reminders

The system reminders themselves are not hooks but are **plan-mode-specific synthetic messages** injected before each assistant turn. The injection points are listed at `cli_inner_pretty.js:397585-397590`:

```javascript
// Roughly:
aY("plan_mode", () => d65(H, _, $, z));
aY("plan_mode_exit", () => c65(_, $));
aY("auto_mode", () => n65(_, $));
aY("auto_mode_exit", () => i65(_, $));
```

`aY` (the attachment registrar) takes a name and a builder function. The builder returns an array of attachments to inject. Each builder consults `getAppState()` to decide whether its attachment is relevant.

### Plan-Mode Attachment Cadence

- **`plan_mode`**: emitted every `TURNS_BETWEEN_ATTACHMENTS` (e.g. 4) turns. Alternates `reminderType: 'full'` (every N attachments) and `'sparse'` (others). The full reminder includes the workflow instructions; the sparse is just the path reference.
- **`plan_mode_reentry`**: emitted once when re-entering plan mode after a prior exit (gated by `HH$() && planExists`). Carries the prior plan path.
- **`plan_mode_exit`**: emitted once after plan mode exits (gated by `needsPlanModeExitAttachment`). Carries the final plan path.

The renderer for these attachments produces the actual system-reminder text (see `cli_inner_pretty.js:424770-425120` for the text content).

---

## Hook Configuration Examples

### Example 1: Block plans that mention secrets

```json
{
  "PreToolUse": [
    {
      "matcher": "ExitPlanMode",
      "hooks": [{
        "type": "command",
        "command": "node /path/to/check-secrets.js"
      }]
    }
  ]
}
```

The hook script reads `tool_input.plan` from stdin, scans for API key patterns, and exits 2 if found (denying the call).

### Example 2: Auto-archive approved plans

```json
{
  "PostToolUse": [
    {
      "matcher": "ExitPlanMode",
      "hooks": [{
        "type": "command",
        "command": "cp $CLAUDE_TOOL_INPUT_planFilePath ~/Documents/plan-archive/"
      }]
    }
  ]
}
```

The hook copies the plan to a personal archive on successful exit. Note `tool_input` is the SDK-shape input (includes `planFilePath`).

### Example 3: Enforce plan length

```json
{
  "PreToolUse": [
    {
      "matcher": "ExitPlanMode",
      "hooks": [{
        "type": "command",
        "command": "test $(jq -r '.tool_input.plan | length') -gt 500"
      }]
    }
  ]
}
```

Exit code 0 if the plan is > 500 chars. Else exit 1, blocking the call. The model gets feedback to flesh out the plan.

---

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| PreToolUse on EnterPlanMode | yes | yes | Identical |
| PreToolUse on ExitPlanMode (sees plan + planFilePath) | yes (normalizeToolInput injection) | yes | Identical |
| PostToolUse on ExitPlanMode | yes | yes | Identical |
| `duration_ms` in PostToolUse | (added in v2.1.119) | yes | **v2.1.119 fix is present** |
| Plan-mode floor (write block) | no | yes | **NEW in v2.1.136** — affects `PreToolUse` rule precedence |
| `d64` (isPlanModeFloorReason) decision-reason predicate | no | yes | **NEW in v2.1.136** |
| `auto_mode_fallback_to_ask` analytics with `plan_mode_floor` reason | no | yes | **NEW in v2.1.136** |
| UserPromptSubmit additionalContext | yes | yes | Identical |
| customInstructions field on plan_mode attachment | yes | yes | Identical |
| Background plan-verification hook | yes | yes | Identical |

The hook protocol itself is unchanged. The v2.1.136 plan-mode floor adds a new decision-reason type that `PreToolUse` hooks can observe.

---

## Related

- [implementation.md](./implementation.md) — full lifecycle
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — `call` body that PostToolUse sees
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.136 floor details
- [approval_flow.md](./approval_flow.md) — user dialog interaction
