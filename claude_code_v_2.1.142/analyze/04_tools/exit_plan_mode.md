# Tool: ExitPlanMode — Present Plan, Return to Edit Mode

> **Identity:** wire-name `ExitPlanMode`, userFacingName `""` (custom), `isReadOnly: false`, `isConcurrencySafe: true`, `shouldDefer: true`, `requiresUserInteraction: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:381612-381825` (declaration), `assets/tools/ExitPlanMode.md` (tool def).

ExitPlanMode signals that the model has finished writing its plan to the plan file and is ready for user approval. On approval, the session transitions out of plan mode (restoring the pre-plan mode), and the model begins implementation.

The cross-link is the [12_plan_mode](../12_plan_mode/) module.

---

## Overview

The "exit plan mode" event has two phases:

1. **Tool call**: The model writes its plan to the per-session plan file and calls ExitPlanMode (typically with no parameters, or with optional `allowedPrompts` describing the prompt-permissions needed for implementation).
2. **User approval**: The system shows the plan content + permission preview, the user accepts or rejects, and the mode transition happens.

If the model is a teammate (`isTeammate()`), the flow is different: the teammate sends an approval request to the team leader rather than the human user.

---

## Input Schema (`sc7`)

```javascript
// ============================================
// exitPlanModeInputSchema - Optional prompt-permission declarations
// Location: cli_inner_pretty.js:381612-381623 (sc7)
// ============================================

// ORIGINAL (for source lookup):
sc7 = yH(() =>
  y.strictObject({
    allowedPrompts: y.array(lt_()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands."),
  }).passthrough(),
);

// READABLE (for understanding):
exitPlanModeInputSchema = lazy(() =>
  z.strictObject({
    allowedPrompts: z.array(promptPermissionSchema()).optional().describe("Prompt-based permissions needed for implementation"),
  }).passthrough(),
);

// Mapping: sc7→exitPlanModeInputSchema, lt_→promptPermissionSchema
```

**Why `passthrough()`:** The schema accepts additional fields not declared (specifically `plan` and `planFilePath`, injected by `normalizeToolInput` from the plan file). The strict + passthrough combination lets:
- Known fields be validated strictly.
- Unknown fields pass through without rejection (for internal use).
- The model doesn't see the injected fields in its schema — but they're available in `call()`.

**Why `allowedPrompts` is just descriptors:** These are *semantic* descriptors of action categories, not specific commands. E.g.:
```json
{"allowedPrompts": [{"tool": "Bash", "prompt": "run tests"}, {"tool": "Bash", "prompt": "install dependencies"}]}
```

This pre-authorizes "any Bash invocation matching 'run tests'" rather than "Bash(npm test)". It's the prompt-based permission model — fuzzier than exact-command matching but more usable in practice.

### Internal Fields (Injected, Not in Schema)

```javascript
// ============================================
// normalizedPlanInput - Schema variant used internally
// Location: cli_inner_pretty.js:381624-381629 (N53)
// ============================================

N53 = yH(() =>
  sc7().extend({
    plan: y.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
    planFilePath: y.string().optional().describe("The plan file path (injected by normalizeToolInput)"),
  }),
);
```

When the tool call arrives, `normalizeToolInput` reads the plan file from disk and attaches `plan` + `planFilePath` to the input. The model never directly sets these — they come from the filesystem state.

**Why inject vs require:** The model could pass the plan content as a parameter, but that doubles context cost (plan in the tool call + plan in the plan file). Injection means the plan lives only on disk; the tool just signals "ready."

---

## Output Schema (`nt_`)

```javascript
// ============================================
// exitPlanModeOutputSchema - Multi-flavor return for sync/teammate/edited paths
// Location: cli_inner_pretty.js:381630-381648 (nt_)
// ============================================

// ORIGINAL (for source lookup):
nt_ = yH(() => y.object({
  plan: y.string().nullable().describe("The plan that was presented to the user"),
  isAgent: y.boolean(),
  filePath: y.string().optional().describe("The file path where the plan was saved"),
  hasTaskTool: y.boolean().optional().describe("Whether the Agent tool is available in the current context"),
  planWasEdited: y.boolean().optional().describe("True when the user edited the plan ..."),
  awaitingLeaderApproval: y.boolean().optional().describe("When true, the teammate has sent a plan approval request ..."),
  requestId: y.string().optional().describe("Unique identifier for the plan approval request"),
}));

// READABLE (for understanding):
exitPlanModeOutputSchema = lazy(() =>
  z.object({
    plan: z.string().nullable().describe("The plan that was presented"),
    isAgent: z.boolean(),
    filePath: z.string().optional().describe("Where the plan was saved"),
    hasTaskTool: z.boolean().optional().describe("Whether Agent tool is available"),
    planWasEdited: z.boolean().optional().describe("True if user edited the plan in CCR or Ctrl+G"),
    awaitingLeaderApproval: z.boolean().optional().describe("Teammate awaiting team lead approval"),
    requestId: z.string().optional().describe("Plan approval request ID"),
  }),
);

// Mapping: nt_→exitPlanModeOutputSchema
```

Three completion flavors:

- **Synchronous (default)**: `plan` returned, no `awaiting*` fields, mode has been restored to pre-plan.
- **Teammate (team mode)**: `awaitingLeaderApproval: true`, `requestId` present, mode unchanged (waiting on team lead).
- **Edited (web UI)**: `planWasEdited: true` — the user edited the plan in CCR web before approving.

---

## validateInput

```javascript
// ============================================
// validateExitPlanMode - Plan-mode-active gate
// Location: cli_inner_pretty.js:381683-381701 (in V2.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput(H, { getToolPermissionContext: $, options: q }) {
  if (AA()) return { result: !0 };
  let K = $().mode;
  if (K !== "plan")
    return (d("tengu_exit_plan_mode_called_outside_plan", { model: q.mainLoopModel, mode: K, hasExitedPlanModeInSession: HH$() }),
      { result: !1, message: "You are not in plan mode. ...", errorCode: 1 });
  return { result: !0 };
}

// READABLE (for understanding):
async function validateExitPlanMode(input, { getToolPermissionContext, options }) {
  if (isTeammate()) return { result: true };  // Teammate validation is in call()
  const mode = getToolPermissionContext().mode;
  if (mode !== "plan") {
    logEvent("tengu_exit_plan_mode_called_outside_plan", {
      model: options.mainLoopModel,
      mode,
      hasExitedPlanModeInSession: hasExitedPlanModeInSessionEver(),
    });
    return {
      result: false,
      message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
      errorCode: 1,
    };
  }
  return { result: true };
}

// Mapping: H→input, $→getToolPermissionContext, q→options, K→mode, AA→isTeammate, d→logEvent, HH$→hasExitedPlanModeInSessionEver
```

**Why mode-gate is here:** If the session is not in plan mode, calling ExitPlanMode is nonsensical. The error message is intentionally helpful — it tells the model two possibilities: "maybe you misremember being in plan mode" (try to recover) and "maybe your plan was already approved" (continue normally).

**Teammates bypass the mode gate:** A teammate's "plan mode" is implicit — they're spawned with a planning prompt and signal completion via ExitPlanMode regardless of mode state. The check is moved into `call()` for the teammate path.

---

## checkPermissions

```javascript
async checkPermissions(H, $) {
  if (AA()) return { behavior: "allow", updatedInput: H };  // teammate: skip prompt
  return { behavior: "ask", message: "Exit plan mode?", updatedInput: H };
}
```

Always asks the user (in human-driven sessions). The user sees the plan content + the proposed action and decides.

In teammate contexts (`AA()` returns true), there's no user to ask — the teammate just proceeds (the team lead approval comes through a different channel — see `awaitingLeaderApproval` below).

---

## call() — The Long One

The call function has four conditional branches. Pseudocode of the overall flow:

```javascript
// ============================================
// callExitPlanMode - Multi-branch exit handling
// Location: cli_inner_pretty.js:381709-381794 (in V2.call)
// ============================================

// ORIGINAL (for source lookup):
async call(H, $, q, K, _) {
  let A = null, z = null;
  [A, z] = await Promise.all([
    Promise.resolve().then(() => (k9H(), v9H)),
    Promise.resolve().then(() => (JX(), x38)),
  ]);
  let Y = !!$.agentId, f = v2($.agentId),
    O = "plan" in H && typeof H.plan === "string" ? H.plan : void 0,
    M = O ?? HW($.agentId);
  if (O !== void 0 && f)
    (await ac7.writeFile(f, O, "utf-8").catch(...), u38());
  if (AA() && h4$()) { /* teammate path: send approval request, return awaiting */ }
  /* standard path: restore prePlanMode, handle auto-mode gate, transition */
  return { data: { plan: M, isAgent: Y, filePath: f, hasTaskTool: J || void 0, planWasEdited: O !== void 0 || void 0 } };
}

// READABLE (for understanding):
async function callExitPlanMode(input, context, _abort, assistantMessage, onProgress) {
  // Lazy-import auto-mode and plan-mode modules
  const [autoModeModule, planModeModule] = await Promise.all([
    import("./autoMode.js"),
    import("./planMode.js"),
  ]);

  const isAgentCall = Boolean(context.agentId);  // is this an agent-context call?
  const planFilePath = getPlanFilePath(context.agentId);
  const planFromInput = "plan" in input && typeof input.plan === "string" ? input.plan : undefined;
  const planContent = planFromInput ?? readPlanFromDiskCache(context.agentId);

  // Branch A: Plan was edited by user (web UI or Ctrl+G) — persist it
  if (planFromInput !== undefined && planFilePath) {
    await fs.writeFile(planFilePath, planFromInput, "utf-8").catch(err => {
      log(`Failed to persist plan to ${planFilePath}: ${err}`, { level: "error" });
    });
    invalidatePlanCache();
  }

  // Branch B: Teammate path — send approval request to team lead, do not change mode
  if (isTeammate() && isPlanApprovalRequired()) {
    if (!planContent) {
      throw new Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }
    const senderName = getMyAgentName() || "unknown";
    const sessionId = getSessionId();
    const requestId = generateApprovalId("plan_approval", buildIdNamespace(senderName, sessionId));
    const approvalMessage = {
      type: "plan_approval_request",
      from: senderName,
      timestamp: new Date().toISOString(),
      planFilePath,
      planContent,
      requestId,
    };
    await sendMessage("team-lead", { from: senderName, text: serialize(approvalMessage), ... });
    const myAgentRecord = findMyAgentRecord(senderName, appState);
    if (myAgentRecord) markAgentAwaitingApproval(myAgentRecord, context.taskRegistry, /* awaiting */ true);
    return {
      data: { plan: planContent, isAgent: true, filePath: planFilePath, awaitingLeaderApproval: true, requestId },
    };
  }

  // Branch C: Standard exit — restore pre-plan mode
  const appState = context.getAppState();
  let autoModeFallbackNotice = null;
  // ... auto-mode gate check ...

  const permissionContext = context.getToolPermissionContext();
  if (permissionContext.mode === "plan") {
    // Mark exit (analytics, dedupe future enter-plan suggestions)
    markPlanModeExited(true);
    markPlanWasApproved(true);
    let restoreMode = permissionContext.prePlanMode ?? "default";

    // If reverting to auto-mode but the gate is off, fall back to default
    if (restoreMode === "auto" && !isAutoModeGateEnabled()) {
      restoreMode = "default";
    }

    // Apply auto-mode state if relevant
    const enteringAuto = restoreMode === "auto";
    const wasAutoActive = isAutoModeActive();
    setAutoModeActive(enteringAuto);
    if (wasAutoActive && !enteringAuto) flushAutoModeBuffer(true);

    logModeTransition({ from: "plan", to: restoreMode, trigger: "exit_plan_mode" });

    // Restore dangerous permissions stripping based on target mode
    const strippedRules = permissionContext.strippedDangerousRules;
    context.setToolPermissionContext(curr => {
      let next = curr;
      if (enteringAuto) next = stripDangerousPermissionsForAutoMode(next);
      else if (strippedRules) next = restoreDangerousPermissions(next);
      return { ...next, mode: restoreMode, prePlanMode: undefined };
    });
  }

  const hasTaskTool = isAgentSwarmsEnabled() && context.options.tools.some(t => isToolNamed(t, AGENT_TOOL_NAME));
  return {
    data: {
      plan: planContent,
      isAgent: isAgentCall,
      filePath: planFilePath,
      hasTaskTool: hasTaskTool || undefined,
      planWasEdited: planFromInput !== undefined || undefined,
    },
  };
}

// Mapping (selective): AA→isTeammate, h4$→isPlanApprovalRequired, b38→findMyAgentRecord,
//        qE6→markAgentAwaitingApproval, vC→logModeTransition, OT→markPlanModeExited,
//        qh→markPlanWasApproved, MT→flushAutoModeBuffer, eK→isAgentSwarmsEnabled,
//        AQH→generateApprovalId, In→buildIdNamespace, vA→getMyAgentName, q5→getSessionId
```

### Why the auto-mode handling is so elaborate

The session may have been in `"auto"` mode before entering plan mode. Auto mode dynamically permission-strips dangerous tools (rm -rf, etc.). When restoring to auto:

1. **Re-strip dangerous permissions**: The mode change re-runs `stripDangerousPermissionsForAutoMode` to ensure the auto-mode safety constraints are in place even though the user is exiting plan.
2. **Auto-mode gate check**: If the auto-mode GrowthBook gate has flipped *off* during the plan-mode session, restoring to auto would be wrong. Fall back to `"default"`.
3. **Buffer flush**: Auto mode buffers some events. If auto was active and we're exiting to non-auto, flush the buffer first.

Conversely, restoring to non-auto mode means *unstripping* the dangerous permissions that were stripped on auto-mode entry.

This complexity exists because mode transitions are not just `mode = newMode` — they have side effects on the permission rule set that the mode controls.

### Why the teammate path is so different

Teammates don't have a user to prompt. The team lead is a different teammate (typically the orchestrating agent). Plan approval is therefore a *messaging* operation, not a UI dialog:

1. The teammate serializes its plan + metadata into a structured `plan_approval_request` message.
2. Sends it to the "team-lead" address.
3. Marks itself as awaiting approval in the task registry.
4. Returns with `awaitingLeaderApproval: true`.

The team lead receives the message, displays it (or auto-approves), and sends back a response via SendMessage which the teammate's loop receives and processes.

The mode does *not* change for teammates at this point — the teammate stays in its planning state until the lead approves. If the lead approves, the lead's SendMessage handler triggers the actual mode transition asynchronously.

---

## mapToolResultToToolResultBlockParam

The result formatting depends on which branch ran:

```javascript
mapToolResultToToolResultBlockParam(
  { isAgent: H, plan: $, filePath: q, hasTaskTool: K, planWasEdited: _, awaitingLeaderApproval: A, requestId: z },
  Y,
) {
  // ... different content for awaiting-approval vs synchronous-exit ...
  // ... includes plan echo only if planWasEdited (saves tokens otherwise) ...
}
```

**Why only echo plan when `planWasEdited`:** In the standard path, the plan is already in the plan file and the conversation may have already shown it. Re-injecting the plan into the tool result would be redundant. Only when the user *edited* the plan (so the on-disk copy differs from the model's last write) does the tool re-echo the edited plan back to the model — so the model implements the *edited* plan, not the original.

---

## Render Methods

```javascript
renderToolUseMessage: cc7,        // "Approve plan?"
renderToolResultMessage: lc7,     // "Plan approved" or "Awaiting team lead"
renderToolUseRejectedMessage: nc7, // "Plan declined" with revision hint
```

The `cc7` use-message renderer shows the plan content (truncated if huge) so the user can review before approving. The user can also hit Ctrl+G to edit the plan inline.

---

## Key Insights

- **Plan content is on disk, not in the tool call**: The model never sends the plan as a parameter. The injection mechanism (`N53` schema, `normalizeToolInput`) reads from disk. This keeps tool-call sizes small and lets the user edit the plan via UI without round-tripping.

- **`planWasEdited` triggers plan-echo**: When the user edits the plan via CCR web UI or Ctrl+G, the input contains a `plan` field with the edited content. The presence of this field flips `planWasEdited` to true and the tool result includes the edited plan so the model implements the user's edits.

- **Teammates don't change mode synchronously**: Teammate exits enter an "awaiting approval" state where the teammate is paused but the mode hasn't changed yet. Only when the team lead approves does the mode actually transition. This is opposite from the human flow where the user's "approve" click both confirms and transitions.

- **Auto-mode gate flap handling**: If the auto-mode gate flipped off during the plan-mode session (some external config change), the exit falls back to `"default"` rather than restoring to `"auto"`. The user gets a notification about the fallback.

- **`hasTaskTool` flag in response**: Informs the model whether the Agent tool is available post-exit. This is useful: in team mode after exit, the model knows it can dispatch teammates to implement different parts of the plan.

- **`requiresUserInteraction: true` + `checkPermissions: ask`**: Always asks the user. There's no "auto-approve plans" mode — even acceptEdits doesn't bypass plan approval. The mode transition is significant enough to require explicit user consent.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | Plan file injected from disk via `normalizeToolInput` rather than as a parameter. |
| v2.1.117 | `allowedPrompts` parameter for prompt-based permission preview. |
| v2.1.121 | Teammate path: plan-approval messaging to team-lead via SendMessage. |
| v2.1.125 | Auto-mode gate fallback when gate flips during session. |
| v2.1.129 | `planWasEdited` flag and plan echo on edit. |
| v2.1.136 | `hasTaskTool` response field for post-exit Agent-tool discoverability. |
| v2.1.140 | Plan mode V2 interview phase introduced new exit flow. |
| v2.1.142 | No changes to ExitPlanMode itself. |

---

## Related Documents

- [enter_plan_mode.md](enter_plan_mode.md) — the entry tool for plan mode
- [12_plan_mode/](../12_plan_mode/) — plan mode infrastructure deep-dive

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree additions

Key functions in this document:
- `exitPlanModeInputSchema` (sc7) - {allowedPrompts?}
- `exitPlanModeNormalizedSchema` (N53) - Internal with injected plan/planFilePath
- `exitPlanModeOutputSchema` (nt_) - Multiple-flavor return
- `exitPlanModeTool` (V2) - Tool definition
- `promptPermissionSchema` (lt_) - {tool: "Bash", prompt: "category"}
- `getPlanFilePath` (v2) - Per-session plan path
- `isPlanApprovalRequired` (h4$) - Team-mode gate
- `markPlanModeExited` (OT) - Telemetry/dedupe flag
- `flushAutoModeBuffer` (MT) - Auto-mode state cleanup
- `EXIT_PLAN_MODE_TOOL_NAME` (NZ) - "ExitPlanMode"
