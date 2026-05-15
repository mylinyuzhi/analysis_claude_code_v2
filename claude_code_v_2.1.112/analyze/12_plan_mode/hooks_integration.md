# Plan Mode × Hooks Integration (v2.1.112)

> How plan mode interacts with the hook system: `UserPromptSubmit` injection, `PreToolUse`/`PostToolUse` on `ExitPlanMode`, attachment-based reminders, and the `defer` decision token (v2.1.89). This is a *protocol* document — the hook event lifecycle is detailed in `06_hooks/`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_02.md](../00_overview/symbol_additions_unit_02.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Hook events, plan-mode flags
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permission decisions

Key functions in this document:
- `ExitPlanModeV2Tool` (`zZ`) — Tool definition (events for which hooks fire), chunks.150.mjs:2094
- `setHasExitedPlanMode` (`iL`) — Flag setter
- `setNeedsPlanModeExitAttachment` (`Km`) — Attachment-injection flag for next user turn
- `setNeedsAutoModeExitAttachment` (`sG`) — Auto-mode-exit attachment flag
- `persistFileSnapshotIfRemote` (`gb8`) — Mirror plan to transcript (called from `ExitPlanMode.call`)
- Hook builder (`E0`) — Hook execution streaming generator, chunks.193.mjs:646
- `applyHookPermissionDecision` (no-fn) — Decision applier, chunks.193.mjs:34-130

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
│  model thinks, decides to call a tool (e.g. Read, Write, or ExitPlanMode)│
│       │                                                                  │
│       ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ PreToolUse hook (per-tool, matcher-filtered)                    │    │
│  │  • can allow / deny / ask / defer (decision token)               │    │
│  │  • can update tool input (updatedInput)                          │    │
│  │  • can inject context (additionalContext)                        │    │
│  │  • Plan mode also runs the tool's checkPermissions:              │    │
│  │      ExitPlanMode → "ask" → ExitPlanModePermissionRequest        │    │
│  │      Write/Edit/Bash → "ask" with planMode-aware UI              │    │
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
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  attachments injected before next assistant turn:                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ • plan_mode_reminder (if mode === "plan")                        │    │
│  │ • plan_mode_exit_attachment (if needsPlanModeExitAttachment)     │    │
│  │ • auto_mode_exit_attachment (if needsAutoModeExitAttachment)     │    │
│  │ • verify_plan_reminder (if has-exited-plan AND no Verify yet)   │    │
│  └────────────────────────────────────────────────────────────────┘    │
│       │                                                                  │
│       ▼                                                                  │
│  next model turn                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. UserPromptSubmit: Plan Mode Context Injection

The `UserPromptSubmit` hook fires before the new user message is appended to the conversation. It can append arbitrary text via `additionalContext`. Plan mode does NOT have a dedicated UserPromptSubmit hook in the built-in code — the plan-mode reminder is delivered via the *attachment* pathway (described below in §4) which is generated independently of hooks. However, user-defined `UserPromptSubmit` hooks see plan-mode-related state in their input.

### Algorithm Deep Dive: Why attachments, not UserPromptSubmit?

**What it does:** Plan-mode reminders, plan-exit notices, and the verify-plan nudge are injected as *attachments* on the user message, not via the `UserPromptSubmit` hook.

**How it works:**
- Attachments are built by a synchronous pre-send pipeline (see `06_attachments`).
- The pipeline reads `hasExitedPlanModeInSession`, `getNeedsPlanModeExitAttachment`, and the current `mode` directly from bootstrap state.
- Attachments are *internal* to the engine and don't go through the user-configurable hook surface.

**Why this approach:**
- Hooks are *user-configurable* — letting a user disable plan-mode reminders by overriding a hook would be a footgun (they'd silently violate plan mode).
- Attachments are also *meta*: marked `isMeta: true` so they don't contribute to token-count budgets the same way regular content does.
- Hook execution is asynchronous (subprocess spawn, network call for HTTP hooks); attachment injection is synchronous, so the reminder is guaranteed to land on every turn even when hooks are misconfigured or slow.

**Trade-offs:**
- User-defined `UserPromptSubmit` hooks cannot intercept or modify plan-mode reminders. If a user wants to change the wording, they have to write a script that *re-edits* the assembled message — not as ergonomic as a single hook return.
- Two separate context-injection mechanisms (attachments + hook `additionalContext`) means more code to maintain.

**Key insight:** The attachment pipeline runs *before* hooks (in the message-assembly order), so a `UserPromptSubmit` hook can see — and append to — the plan-mode reminder attachment if needed. This composes cleanly: built-in reminders + user-defined extras.

### What UserPromptSubmit hooks see

In plan mode, the hook input includes the standard fields plus the current permission mode:

```javascript
// From v2.1.88 src/utils/hooks.ts (HookInput type, partial):
type UserPromptSubmitInput = {
  hook_event_name: "UserPromptSubmit"
  session_id: string
  transcript_path: string
  cwd: string
  prompt: string                          // the user's typed message
  permission_mode: PermissionMode         // "plan" | "default" | "acceptEdits" | "bypassPermissions" | "auto"
  // ... standard meta fields
}
```

A hook that wants to reinforce plan-mode behaviour can branch on `permission_mode === "plan"` and emit:

```json
{
  "hookSpecificOutput": {
    "additionalContext": "Reminder: still in plan mode. Do not run any code yet."
  }
}
```

The `additionalContext` is plumbed into `H.additionalContext` in `applyHookPermissionDecision` (chunks.193.mjs:79) and surfaces as a system-injected addition to the assistant's context.

---

## 2. PreToolUse: Gating the ExitPlanMode Call

When the model invokes `ExitPlanMode`, two gating layers run *in order*:

1. **PreToolUse hooks** (user-defined) — can `allow`/`deny`/`ask`/`defer` the call before the tool's own `checkPermissions` runs.
2. **Tool's `checkPermissions`** — for non-teammates returns `{behavior: "ask"}` which displays the approval modal.

### Decision Token Application

```javascript
// ============================================
// applyHookPermissionDecision - Map hook decision to permission behavior
// Location: chunks.193.mjs:34-77 (PreToolUse branch)
// ============================================

// ORIGINAL (for source lookup):
switch (q.hookSpecificOutput.permissionDecision) {
    case "allow": H.permissionBehavior = "allow"; break;
    case "deny": H.permissionBehavior = "deny", H.blockingError = {
        blockingError: q.hookSpecificOutput.permissionDecisionReason || q.reason || "Blocked by hook",
        command: K
    }; break;
    case "ask": H.permissionBehavior = "ask"; break;
    case "defer": H.permissionBehavior = "defer"; break
}
if (H.hookPermissionDecisionReason = q.hookSpecificOutput.permissionDecisionReason, q.hookSpecificOutput.updatedInput) H.updatedInput = q.hookSpecificOutput.updatedInput;
H.additionalContext = q.hookSpecificOutput.additionalContext;

// READABLE (for understanding):
switch (hookOutput.hookSpecificOutput.permissionDecision) {
    case "allow":
        result.permissionBehavior = "allow";
        break;
    case "deny":
        result.permissionBehavior = "deny";
        result.blockingError = {
            blockingError: hookOutput.hookSpecificOutput.permissionDecisionReason || hookOutput.reason || "Blocked by hook",
            command,
        };
        break;
    case "ask":
        result.permissionBehavior = "ask";
        break;
    case "defer":
        result.permissionBehavior = "defer";  // v2.1.89+: pause until --resume
        break;
}
result.hookPermissionDecisionReason = hookOutput.hookSpecificOutput.permissionDecisionReason;
if (hookOutput.hookSpecificOutput.updatedInput) result.updatedInput = hookOutput.hookSpecificOutput.updatedInput;
result.additionalContext = hookOutput.hookSpecificOutput.additionalContext;

// Mapping: q→hookOutput, H→result, K→command
```

### Pre-Hook Effects on ExitPlanMode

| Hook decision | Effect on ExitPlanMode call |
|---------------|---------------------------|
| `allow` | Skip the approval modal entirely; tool runs immediately. Useful for automated test harnesses. |
| `deny` | Block with a `blockingError`. Plan mode is preserved; the model sees the error. |
| `ask` | Pass through to tool's `checkPermissions` (default behaviour — modal shown). |
| `defer` (v2.1.89+) | Pause execution; re-evaluate on next `--resume`. The session writes a deferred-tool entry to its state. |

**Why `defer` is important for plan mode:**
- A long-running prompt hook that needs to verify the plan asynchronously (e.g., an enterprise compliance check) can `defer` the decision.
- The session pauses *without* prompting the user.
- On `--resume`, the deferred tool list is re-evaluated; the hook runs again with fresh state.
- This avoids the user being stuck staring at "evaluating plan..." for several minutes.

### `additionalContext` on PreToolUse for ExitPlanMode

A hook that approves ExitPlanMode can also inject additional context. Example:

```json
{
  "hookSpecificOutput": {
    "permissionDecision": "allow",
    "additionalContext": "Plan auto-approved by linter policy. Run integration tests after implementation."
  }
}
```

The `additionalContext` is appended to the tool's result rendering path, surfacing as part of the assistant's reasoning surface.

---

## 3. PostToolUse: After Plan Approval

When `ExitPlanMode.call()` returns successfully, the `PostToolUse` hook fires with the tool's output. For ExitPlanMode the hook sees:

```javascript
{
  hook_event_name: "PostToolUse",
  tool_name: "ExitPlanMode",
  tool_input: {
    // The normalized input that ExitPlanMode received:
    plan?: string,            // injected by normalizeToolInput from disk
    planFilePath?: string,    // injected by normalizeToolInput
    allowedPrompts?: AllowedPrompt[]
  },
  tool_response: {
    plan: string | null,
    isAgent: boolean,
    filePath?: string,
    hasTaskTool?: boolean,
    planWasEdited?: boolean,
    awaitingLeaderApproval?: boolean,
    requestId?: string
  },
  permission_mode: "plan" | "default" | ...,   // CURRENT mode (after restoration)
  // ...
}
```

This is the moment a user-defined hook can:
- Persist the plan to a project-local `PLAN.md`
- Trigger CI dry-runs
- Notify a webhook (Slack, etc.)
- Inject `additionalContext` like "Verification suite started, expect a callback in 30s"

### Algorithm Deep Dive: Why `permission_mode` reflects POST-restoration

**What it does:** The `permission_mode` field in `PostToolUse` for `ExitPlanMode` is the *new* mode (e.g., `"default"`, `"acceptEdits"`), not `"plan"`.

**How it works:** `ExitPlanMode.call()` mutates `toolPermissionContext.mode` via `setToolPermissionContext` *before* returning. The PostToolUse hook is dispatched after `call()` returns, so its `getAppState()` snapshot already shows the restored mode.

**Why this approach:**
- The hook needs to know "where are we now?" to react appropriately. If a hook drives CI, it wants to know the new mode (because that determines what tools will be auto-approved next).
- Capturing the *pre-exit* mode would force the hook to also track `prePlanMode`, redundantly mirroring tool internal state.

**Trade-offs:**
- A hook that wants to know "was this an exit from plan mode?" cannot just check `permission_mode === "plan"` — it must check the tool name. Acceptable: tool-specific hooks are common.

**Key insight:** This is one of the rare hooks where state observed at hook-time reflects *post-tool* state, not pre-tool. Most PostToolUse hooks see the world "as-of just after the tool ran" — for ExitPlanMode that includes its own side-effects.

### MCP Tool Output Mutation Restricted

The `updatedMCPToolOutput` field in `hookSpecificOutput` is honoured for MCP tools only — it doesn't apply to `ExitPlanMode` (which is a built-in tool). A hook that tries to mutate `ExitPlanMode`'s output via `updatedMCPToolOutput` will be ignored. To mutate ExitPlanMode behaviour, use a PreToolUse hook with `updatedInput`.

---

## 4. Attachments: The Built-in Plan-Mode Reminders

While not technically a *hook* event, the attachment pipeline runs adjacent to hooks and is the canonical plan-mode notification surface. There are four plan-mode-related attachments:

### 4a. `plan_mode_reminder`

**When:** Every user turn while `mode === "plan"`.
**Content:** A reminder block stating "you are in plan mode" + the current plan-mode prompt template + (optionally) a sparse vs full variant depending on session length.

### 4b. `plan_mode_exit_attachment`

**When:** `needsPlanModeExitAttachment === true` (flag set by `setNeedsPlanModeExitAttachment(true)` in `ExitPlanMode.call`).
**Content:** A one-shot system note acknowledging the plan-mode exit and re-stating the now-active permission mode.

**Flag lifecycle:** Set by `ExitPlanModeV2Tool.call()` via `iL(true)` (`setHasExitedPlanMode`, persistent for session) and `Km(true)` (`setNeedsPlanModeExitAttachment`, one-shot). The attachment generator on the next user turn reads `getNeedsPlanModeExitAttachment()`, emits the attachment if true, then clears the flag via `Km(false)`.

The flag is *one-shot*: attached once on the next user turn, then cleared. Subsequent turns do not re-attach unless the flag is set again (e.g., by a second `ExitPlanMode` after re-entry into plan mode).

### 4c. `auto_mode_exit_attachment`

**When:** `needsAutoModeExitAttachment === true` (flag set by `setNeedsAutoModeExitAttachment(true)` when auto mode was active during planning but is not being restored on exit).
**Content:** A notice that auto-mode was deactivated, explaining the circuit-breaker / settings change that caused fallback to non-auto mode.

This complements the immediate `addNotification` toast surfaced at exit time — the toast may be dismissed, but the attachment is durable.

### 4d. `verify_plan_reminder`

**When:** `hasExitedPlanMode === true` AND the model has not yet called `VerifyPlanExecution`.
**Content:** A reminder nudging the model to call `VerifyPlanExecution` when the implementation is complete, so background verification can run.

This attachment is generated by `getPlanModeAttachment` (referenced via path `src/utils/attachments.ts:3892` in v2.1.88) and is gated by the `VerifyPlanExecutionTool` being present in the tool list.

---

## 5. Plan-Mode-Aware Tool Restrictions

In plan mode, *all tools* go through a stricter permission gate. This is not a hook event per se — it's a baseline `checkPermissions` behaviour wired into each tool. But the hook surface still applies on top: a PreToolUse hook can *override* the plan-mode restriction by returning `allow`.

| Tool | Plan-mode baseline | PreToolUse override |
|------|--------------------|---------------------|
| `Read` / `Glob` / `Grep` | allow (read-only) | yes — can deny |
| `Write` / `Edit` / `MultiEdit` | deny (in plan mode, only the plan file is writeable) | yes — can allow, e.g. for a designated scratch dir |
| `Bash` | deny | yes |
| `ExitPlanMode` | ask (modal) | yes — can allow (skip modal) |
| `EnterPlanMode` | n/a (already in plan mode) | n/a |

A user-defined hook with matcher `Write` and `if: "Write(*plans/*.md)"` could *allow* writes to plans-directory files while keeping the rest of the plan-mode restriction intact.

---

## 6. The `defer` Token (v2.1.89+) for Plan Mode

`defer` is the v2.1.89 addition that pauses tool execution until the next `--resume`. For plan mode, the typical use case is:

```
1. Model calls ExitPlanMode.
2. PreToolUse hook checks an external policy API.
3. The API takes 2 minutes to respond.
4. Hook returns { permissionDecision: "defer", permissionDecisionReason: "policy check pending" }.
5. Session pauses; tool not executed.
6. User runs `claude --resume`.
7. Deferred tool list is re-evaluated; hook runs again.
8. Policy API responds; hook returns "allow".
9. ExitPlanMode runs — modal shows, user approves.
```

### Why `defer` matters for plan mode specifically

Plan mode is the most-likely context for hook-driven policy enforcement (the plan is a structured artefact that's easy to scan and approve). Synchronous hooks would block the local session indefinitely; `defer` lets the hook *not* run synchronously while keeping the plan-approval lifecycle intact.

The `defer` token is *not* implemented in `ExitPlanMode.checkPermissions` itself — it's available only through user-defined PreToolUse hooks.

---

## 7. Hook Surface Around Ultraplan

When `ExitPlanMode` is processed via the Ultraplan path (refine remotely → bring plan back), hooks fire on **two** sides:

| Surface | Hooks that fire | Notes |
|---------|----------------|-------|
| Local CLI (the side that started Ultraplan) | None for the remote plan generation — the local tool isn't called | The local-side `ExitPlanMode` was *rejected* (with the teleport sentinel), so PostToolUse on local doesn't see an approval |
| Remote CCR session | All standard hooks (UserPromptSubmit, PreToolUse, PostToolUse) | The remote session runs its own hook config (typically inherited from settings) |

This means user hooks that should observe *every* plan approval (e.g., audit logging) need to be configured both locally and on the remote. The Ultraplan flow does not "forward" hook events from remote to local.

---

## 8. Summary Table

| Hook event | Sees Plan Mode? | Can affect Plan Mode flow? |
|------------|-----------------|---------------------------|
| `UserPromptSubmit` | Yes, via `permission_mode` field | Yes, by injecting `additionalContext` or blocking the message |
| `SessionStart` | Yes, via `permission_mode` | Yes, by injecting `initialUserMessage` or `additionalContext` |
| `PreToolUse` (matcher: `ExitPlanMode`) | Yes — input contains plan content | Yes — can allow/deny/ask/defer, modify input |
| `PostToolUse` (matcher: `ExitPlanMode`) | Yes — sees post-restoration mode | Yes, by injecting `additionalContext` |
| `PreToolUse` (other tools, in plan mode) | Yes — gates per-tool restrictions | Yes — can override the plan-mode baseline |
| `PostToolUse` (other tools, in plan mode) | Yes | Limited — can inject context, not change mode |
| `PermissionRequest` | Yes — the ExitPlanMode modal triggers PermissionRequest semantics | Yes — can autonomously decide approval |
| `Stop` / `SubagentStop` | Knows `hasExitedPlanModeInSession` | Limited — can block via `blockingError` |
