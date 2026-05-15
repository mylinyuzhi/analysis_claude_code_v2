# ExitPlanModeV2Tool — Deep Deobfuscation (v2.1.142)

`ExitPlanModeV2Tool` is the model-callable tool that ends plan mode. It reads the plan from disk, prompts the user to approve (or routes through a teammate's leader mailbox), restores the pre-plan permission mode, and emits a tool_result that includes the full plan text so the model can immediately begin implementation.

The full v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts` (493 lines). The v2.1.142 obfuscated implementation lives at `cli_inner_pretty.js:381649-381847`. Their behavior matches 1:1 except for the **`--channels` gate refinement** (now pairs with `T6()` background-session predicate, same as `EnterPlanMode`) and the **inline lazy-loading of `permissionSetupModule` / `autoModeStateModule`** (the modules are now resolved inside `call()` via `Promise.all` instead of at module-init time).

## Symbol Table

- `ExitPlanModeV2Tool` (obfuscated: `V2`) - exported tool object - `cli_inner_pretty.js:381649`
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (obfuscated: `NZ`) - `"ExitPlanMode"` - `cli_inner_pretty.js:143087` (also aliased `kZ` at `143086`)
- `EXIT_PLAN_MODE_V2_TOOL_PROMPT` (obfuscated: `dc7`) - prompt string - `cli_inner_pretty.js:381657` (returned by `prompt()`)
- `allowedPromptSchema` (obfuscated: `lt_`) - `{ tool: 'Bash', prompt: string }` - `cli_inner_pretty.js:381606`
- `inputSchema` (obfuscated: `sc7`) - strict `{ allowedPrompts? }` (passthrough) - `cli_inner_pretty.js:381612`
- `_sdkInputSchema` (obfuscated: `N53`) - extends input with `plan`, `planFilePath` - `cli_inner_pretty.js:381624`
- `outputSchema` (obfuscated: `nt_`) - full output shape with `awaitingLeaderApproval`, `requestId`, ... - `cli_inner_pretty.js:381630`
- `autoModeStateModule` (lazy, returned from `Promise.resolve().then(...v9H...)`) - `cli_inner_pretty.js:381713`
- `permissionSetupModule` (lazy, returned from `Promise.resolve().then(...x38...)`) - `cli_inner_pretty.js:381714`
- `getAllowedChannels` (obfuscated: `jj`) - --channels gate
- `isBackgroundSession` (obfuscated: `T6`) - background-session predicate
- `isTeammate` (obfuscated: `AA`) - teammate-context check
- `isPlanModeRequired` (obfuscated: `h4$`) - plan_mode_required spawn flag check
- `getPlanFilePath` (obfuscated: `v2`) - `cli_inner_pretty.js:517657`
- `getPlan` (obfuscated: `HW`) - `cli_inner_pretty.js:517662`
- `persistFileSnapshotIfRemote` (obfuscated: `u38`) - `cli_inner_pretty.js:517750`
- `writeToMailbox` (obfuscated: `cA`)
- `generateRequestId` (obfuscated: `AQH`)
- `getAgentName` (obfuscated: `vA`), `getTeamName` (obfuscated: `q5`), `formatAgentId` (obfuscated: `In`)
- `setHasExitedPlanMode` (obfuscated: `OT`) - `cli_inner_pretty.js:2952`
- `setNeedsPlanModeExitAttachment` (obfuscated: `qh`) - `cli_inner_pretty.js:2958`
- `setNeedsAutoModeExitAttachment` (obfuscated: `MT`) - `cli_inner_pretty.js:2968`
- `hasExitedPlanModeInSession` (obfuscated: `HH$`) - `cli_inner_pretty.js:2949`
- `recordModeTransition` (obfuscated: `vC`) - mode-transition telemetry
- `findInProcessTeammateTaskId` (obfuscated: `b38`)
- `setAwaitingPlanApproval` (obfuscated: `qE6`)
- `renderToolUseMessage` / `renderToolResultMessage` / `renderToolUseRejectedMessage` (obfuscated: `cc7`, `lc7`, `nc7`)

## Tool Definition

The tool object spans `cli_inner_pretty.js:381649-381847`. Below is the structural skeleton; the `call` body is dissected in its own section.

```javascript
// ============================================
// ExitPlanModeV2Tool - Tool object skeleton
// Location: cli_inner_pretty.js:381649-381708
// ============================================

// ORIGINAL (for source lookup):
V2 = XK({
  name: NZ,
  searchHint: "present plan for approval and start coding (plan mode only)",
  maxResultSizeChars: 1e5,
  async description() { return "Prompts the user to exit plan mode and start coding"; },
  async prompt() { return dc7; },
  get inputSchema() { return sc7(); },
  get outputSchema() { return nt_(); },
  userFacingName() { return ""; },
  shouldDefer: !0,
  isEnabled() {
    if (jj().length > 0 && T6()) return !1;
    return !0;
  },
  isConcurrencySafe() { return !0; },
  isReadOnly() { return !1; },
  requiresUserInteraction() {
    if (AA()) return !1;
    return !0;
  },
  async validateInput(H, { getToolPermissionContext: $, options: q }) {
    if (AA()) return { result: !0 };
    let K = $().mode;
    if (K !== "plan")
      return (
        d("tengu_exit_plan_mode_called_outside_plan", {
          model: q.mainLoopModel, mode: K, hasExitedPlanModeInSession: HH$(),
        }),
        { result: !1,
          message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
          errorCode: 1, }
      );
    return { result: !0 };
  },
  async checkPermissions(H, $) {
    if (AA()) return { behavior: "allow", updatedInput: H };
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: H };
  },
  renderToolUseMessage: cc7,
  renderToolResultMessage: lc7,
  renderToolUseRejectedMessage: nc7,
  // ... call() and mapToolResultToToolResultBlockParam ...
});

// READABLE (for understanding):
const ExitPlanModeV2Tool = buildTool({
  name: EXIT_PLAN_MODE_V2_TOOL_NAME,
  searchHint: 'present plan for approval and start coding (plan mode only)',
  maxResultSizeChars: 100_000,
  async description() { return 'Prompts the user to exit plan mode and start coding'; },
  async prompt() { return EXIT_PLAN_MODE_V2_TOOL_PROMPT; },
  get inputSchema() { return inputSchema(); },
  get outputSchema() { return outputSchema(); },
  userFacingName() { return ''; },
  shouldDefer: true,
  isEnabled() {
    // v2.1.142 change: paired with T6() (background-session)
    if (getAllowedChannels().length > 0 && isBackgroundSession()) return false;
    return true;
  },
  isConcurrencySafe() { return true; },
  isReadOnly() { return false; },  // writes to disk on edited-plan flow
  requiresUserInteraction() {
    if (isTeammate()) return false;
    return true;
  },
  async validateInput(_input, { getToolPermissionContext, options }) {
    if (isTeammate()) return { result: true };
    const mode = getToolPermissionContext().mode;
    if (mode !== 'plan') {
      logEvent('tengu_exit_plan_mode_called_outside_plan', {
        model: options.mainLoopModel,
        mode,
        hasExitedPlanModeInSession: hasExitedPlanModeInSession(),
      });
      return {
        result: false,
        message: 'You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.',
        errorCode: 1,
      };
    }
    return { result: true };
  },
  async checkPermissions(input, context) {
    if (isTeammate()) {
      return { behavior: 'allow', updatedInput: input };
    }
    return { behavior: 'ask', message: 'Exit plan mode?', updatedInput: input };
  },
  // ...
});

// Mapping: V2→ExitPlanModeV2Tool, NZ→EXIT_PLAN_MODE_V2_TOOL_NAME, dc7→EXIT_PLAN_MODE_V2_TOOL_PROMPT,
//          sc7→inputSchema, nt_→outputSchema, jj→getAllowedChannels, T6→isBackgroundSession,
//          AA→isTeammate, HH$→hasExitedPlanModeInSession, d→logEvent
```

### Schema highlights

```javascript
// Input (model-facing) — internal schema, the model can't pass `plan`
inputSchema = z.strictObject({
  allowedPrompts: z.array(z.object({
    tool: z.enum(['Bash']),
    prompt: z.string(),  // "run tests", "install dependencies"
  })).optional(),
}).passthrough();   // .passthrough() so normalizeToolInput can inject plan/planFilePath

// SDK-facing (used by hooks + SDK consumers)
_sdkInputSchema = inputSchema.extend({
  plan: z.string().optional(),         // injected from disk by normalizeToolInput
  planFilePath: z.string().optional(), // injected from getPlanFilePath
});

// Output
outputSchema = z.object({
  plan: z.string().nullable(),
  isAgent: z.boolean(),
  filePath: z.string().optional(),
  hasTaskTool: z.boolean().optional(),
  planWasEdited: z.boolean().optional(),       // true when user edited via CCR/Ctrl+G
  awaitingLeaderApproval: z.boolean().optional(),
  requestId: z.string().optional(),
});
```

The `_sdkInputSchema` (`N53` at `cli_inner_pretty.js:381624`) extends `inputSchema` with `plan` and `planFilePath`. This is the schema seen by `PreToolUse`/`PostToolUse` hooks via `normalizeToolInput`. The internal schema omits these fields so the model can't fabricate a plan inline — it MUST write the plan to disk first.

## Algorithm: validateInput

**What it does:** Gates the tool to mode === `'plan'` (skipped for teammates). Logs an analytics event when called outside plan mode.

**How it works:**

1. **Teammate bypass**: `if (isTeammate()) return { result: true };` — teammates may have stale `mode` due to inheritance and the `isPlanModeRequired()` check handles their gating separately in `call()`.
2. **Mode check**: Read the current mode from `getToolPermissionContext()`.
3. **Outside-plan rejection**: If `mode !== 'plan'`, emit the `tengu_exit_plan_mode_called_outside_plan` analytics event with `mode`, `mainLoopModel`, and `hasExitedPlanModeInSession`. The third field is the v2.1.132 signal — it tells us whether the model is re-attempting `ExitPlanMode` after a successful prior exit (a common confusion when the plan got approved but the tool announcement is still in the model's recent context).
4. Return `{ result: false, message: "You are not in plan mode...", errorCode: 1 }`. The error message guides the model: "If your plan was already approved, continue with implementation."

**Why this approach:**
- Validating in `validateInput` (which runs before `checkPermissions`) avoids showing the user an exit-plan-mode dialog when the model is mistakenly calling the tool after compaction/clear.
- The analytics event is essential for diagnosing why models are calling this tool outside plan mode. The `hasExitedPlanModeInSession` field directly tracks the v2.1.132 fix: if this is true and mode is not plan, the model is confused about its current state. If this is false and mode is not plan, the model probably never entered plan mode (perhaps the tool announcement leaked through model context).

## Algorithm: checkPermissions

```javascript
async checkPermissions(input, context) {
  if (isTeammate()) {
    return { behavior: 'allow', updatedInput: input };
  }
  return { behavior: 'ask', message: 'Exit plan mode?', updatedInput: input };
}
```

**What it does:** Routes the tool through the user-facing approval dialog for non-teammates. Teammates bypass.

The user-facing dialog is `ExitPlanModePermissionRequest` (`/lyz/codespace/3rd/claude-code/src/components/permissions/ExitPlanModePermissionRequest/`). It renders the plan content and presents 5 acceptance options (see [approval_flow.md](./approval_flow.md) §Approval Dialog).

## Algorithm: `call` — End-to-End Exit

The `call` body at `cli_inner_pretty.js:381709-381795` is the heart of the tool. It handles three sub-flows:

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Main exit logic
// Location: cli_inner_pretty.js:381709-381795
// ============================================

// ORIGINAL (for source lookup):
async call(H, $, q, K, _) {
  let A = null, z = null;
  [A, z] = await Promise.all([
    Promise.resolve().then(() => (k9H(), v9H)),
    Promise.resolve().then(() => (JX(), x38)),
  ]);
  let Y = !!$.agentId,
    f = v2($.agentId),
    O = "plan" in H && typeof H.plan === "string" ? H.plan : void 0,
    M = O ?? HW($.agentId);
  if (O !== void 0 && f)
    (await ac7.writeFile(f, O, "utf-8")
      .catch((X) => N(`Failed to persist plan to ${f}: ${X instanceof Error ? X.message : String(X)}`, { level: "error" })),
      u38());
  if (AA() && h4$()) {
    if (!M) throw Error(`No plan file found at ${f}. Please write your plan to this file before calling ExitPlanMode.`);
    let X = vA() || "unknown", L = q5(),
      P = AQH("plan_approval", In(X, L || "default")),
      Z = { type: "plan_approval_request", from: X, timestamp: new Date().toISOString(), planFilePath: f, planContent: M, requestId: P };
    await cA("team-lead", { from: X, text: SH(Z), timestamp: new Date().toISOString() }, L);
    let W = $.getAppState(), G = b38(X, W);
    if (G) qE6(G, $.taskRegistry, !0);
    return { data: { plan: M, isAgent: !0, filePath: f, awaitingLeaderApproval: !0, requestId: P } };
  }
  let w = $.getAppState(), D = null;
  {
    let X = w.toolPermissionContext.prePlanMode ?? "default";
    if (X === "auto" && !(z?.isAutoModeGateEnabled() ?? !1)) {
      let L = z?.getAutoModeUnavailableReason() ?? "circuit-breaker";
      ((D = z?.getAutoModeUnavailableNotification(L) ?? "auto mode unavailable"),
        N(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${X} but gate is off (reason=${L}) — falling back to default on plan exit`, { level: "warn" }));
    }
  }
  if (D)
    _?.({ type: "notification", notification: {
      key: "auto-mode-gate-plan-exit-fallback",
      text: `plan exit → default · ${D}`,
      priority: "immediate", color: "warning", timeoutMs: 1e4,
    }});
  let j = $.getToolPermissionContext();
  if (j.mode === "plan") {
    (OT(!0), qh(!0));
    let X = j.prePlanMode ?? "default";
    {
      if (X === "auto" && !(z?.isAutoModeGateEnabled() ?? !1)) X = "default";
      let Z = X === "auto", W = A?.isAutoModeActive() ?? !1;
      if ((A?.setAutoModeActive(Z), W && !Z)) MT(!0);
    }
    vC({ from: "plan", to: X, trigger: "exit_plan_mode" });
    let L = X === "auto", P = j.strippedDangerousRules;
    $.setToolPermissionContext((Z) => {
      let W = Z;
      if (L) W = z?.stripDangerousPermissionsForAutoMode(W) ?? W;
      else if (P) W = z?.restoreDangerousPermissions(W) ?? W;
      return { ...W, mode: X, prePlanMode: void 0 };
    });
  }
  let J = eK() && $.options.tools.some((X) => G1(X, D7));
  return {
    data: { plan: M, isAgent: Y, filePath: f, hasTaskTool: J || void 0, planWasEdited: O !== void 0 || void 0 },
  };
}

// READABLE (for understanding):
async call(input, context, _unused1, _unused2, addNotification) {
  // Lazy-load helper modules. v2.1.112 used a top-level feature() gate; v2.1.142
  // resolves both inside call() via Promise.all so module loading happens at
  // exact call time, not at module init.
  let autoModeStateModule = null, permissionSetupModule = null;
  [autoModeStateModule, permissionSetupModule] = await Promise.all([
    Promise.resolve().then(() => loadAutoModeStateModule()),
    Promise.resolve().then(() => loadPermissionSetupModule()),
  ]);

  const isAgent = !!context.agentId;
  const filePath = getPlanFilePath(context.agentId);
  // CCR web UI may send an edited plan via permissionResult.updatedInput.
  // queryHelpers.ts full-replaces finalInput, so when CCR sends {} (no edit)
  // input.plan is undefined → disk fallback.
  const inputPlan = 'plan' in input && typeof input.plan === 'string' ? input.plan : undefined;
  const plan = inputPlan ?? getPlan(context.agentId);

  // Edited-plan write-back: sync disk so VerifyPlanExecution / Read see the edit
  if (inputPlan !== undefined && filePath) {
    await writeFile(filePath, inputPlan, 'utf-8')
      .catch(e => logError(`Failed to persist plan to ${filePath}: ${e.message}`));
    void persistFileSnapshotIfRemote();
  }

  // Teammate branch: route to team-lead mailbox
  if (isTeammate() && isPlanModeRequired()) {
    if (!plan) {
      throw new Error(`No plan file found at ${filePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }
    const agentName = getAgentName() || 'unknown';
    const teamName = getTeamName();
    const requestId = generateRequestId('plan_approval', formatAgentId(agentName, teamName || 'default'));
    const approvalRequest = {
      type: 'plan_approval_request',
      from: agentName,
      timestamp: new Date().toISOString(),
      planFilePath: filePath,
      planContent: plan,
      requestId,
    };
    await writeToMailbox('team-lead',
      { from: agentName, text: jsonStringify(approvalRequest), timestamp: new Date().toISOString() },
      teamName,
    );
    const appState = context.getAppState();
    const taskId = findInProcessTeammateTaskId(agentName, appState);
    if (taskId) setAwaitingPlanApproval(taskId, context.taskRegistry, true);
    return { data: { plan, isAgent: true, filePath, awaitingLeaderApproval: true, requestId } };
  }

  // Main-user branch: compute gate-fallback notification BEFORE setAppState
  const appState = context.getAppState();
  let gateFallbackNotification = null;
  {
    const prePlanRaw = appState.toolPermissionContext.prePlanMode ?? 'default';
    if (prePlanRaw === 'auto' && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
      const reason = permissionSetupModule?.getAutoModeUnavailableReason() ?? 'circuit-breaker';
      gateFallbackNotification = permissionSetupModule?.getAutoModeUnavailableNotification(reason) ?? 'auto mode unavailable';
      logForDebugging(
        `[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${prePlanRaw} but gate is off (reason=${reason}) — falling back to default on plan exit`,
        { level: 'warn' }
      );
    }
  }
  if (gateFallbackNotification) {
    addNotification?.({
      type: 'notification',
      notification: {
        key: 'auto-mode-gate-plan-exit-fallback',
        text: `plan exit → default · ${gateFallbackNotification}`,
        priority: 'immediate',
        color: 'warning',
        timeoutMs: 10000,
      }
    });
  }

  // Mode restoration
  const ctx = context.getToolPermissionContext();
  if (ctx.mode === 'plan') {
    setHasExitedPlanMode(true);
    setNeedsPlanModeExitAttachment(true);
    let restoreMode = ctx.prePlanMode ?? 'default';
    {
      if (restoreMode === 'auto' && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
        restoreMode = 'default';
      }
      const finalRestoringAuto = restoreMode === 'auto';
      const autoWasUsedDuringPlan = autoModeStateModule?.isAutoModeActive() ?? false;
      autoModeStateModule?.setAutoModeActive(finalRestoringAuto);
      if (autoWasUsedDuringPlan && !finalRestoringAuto) setNeedsAutoModeExitAttachment(true);
    }
    recordModeTransition({ from: 'plan', to: restoreMode, trigger: 'exit_plan_mode' });
    const restoringToAuto = restoreMode === 'auto';
    const stripped = ctx.strippedDangerousRules;
    context.setToolPermissionContext(prev => {
      let baseContext = prev;
      if (restoringToAuto) {
        baseContext = permissionSetupModule?.stripDangerousPermissionsForAutoMode(baseContext) ?? baseContext;
      } else if (stripped) {
        baseContext = permissionSetupModule?.restoreDangerousPermissions(baseContext) ?? baseContext;
      }
      return { ...baseContext, mode: restoreMode, prePlanMode: undefined };
    });
  }

  const hasTaskTool = isAgentSwarmsEnabled() &&
    context.options.tools.some(t => toolMatchesName(t, AGENT_TOOL_NAME));

  return {
    data: { plan, isAgent, filePath, hasTaskTool: hasTaskTool || undefined, planWasEdited: inputPlan !== undefined || undefined },
  };
}

// Mapping: H→input, $→context, _→addNotification, A→autoModeStateModule, z→permissionSetupModule,
//          Y→isAgent, f→filePath, O→inputPlan, M→plan, w→appState, D→gateFallbackNotification,
//          j→ctx, X→restoreMode/various, L/P/Z/W/G→helpers, J→hasTaskTool, k9H→loadAutoModeStateModule,
//          JX→loadPermissionSetupModule, v2→getPlanFilePath, HW→getPlan, ac7→fs/promises,
//          u38→persistFileSnapshotIfRemote, AA→isTeammate, h4$→isPlanModeRequired,
//          vA→getAgentName, q5→getTeamName, AQH→generateRequestId, In→formatAgentId,
//          cA→writeToMailbox, SH→jsonStringify, b38→findInProcessTeammateTaskId,
//          qE6→setAwaitingPlanApproval, OT→setHasExitedPlanMode, qh→setNeedsPlanModeExitAttachment,
//          MT→setNeedsAutoModeExitAttachment, vC→recordModeTransition, eK→isAgentSwarmsEnabled,
//          G1→toolMatchesName, D7→AGENT_TOOL_NAME, N→logForDebugging
```

### Algorithm: Edited-plan Write-Back

**What it does:** When the user edits the plan in the CCR web UI or Ctrl+G external editor, that edited content needs to flow back into the on-disk file so `Read` and `VerifyPlanExecution` see the same plan the user approved.

**How it works:**

1. `inputPlan = 'plan' in input && typeof input.plan === 'string' ? input.plan : undefined` — narrowed extraction. The internal `inputSchema` omits `plan`, but `permissionResult.updatedInput` can inject it.
2. If `inputPlan !== undefined && filePath`, write the content to `filePath` via `fs/promises.writeFile`. Errors are logged but not thrown — disk persist is best-effort.
3. After the disk write, call `persistFileSnapshotIfRemote` (no await, fire-and-forget via `void`). This snapshots the new plan content into the transcript so remote (CCR) sessions can recover it.

**Why this approach:**
- The disk write happens BEFORE the user-approval branch checks `plan === null`. So an edited plan that arrived via `updatedInput` and was successfully written becomes the plan that the rest of `call` operates on.
- Failure tolerance: a logging-only failure means the user's edit may be lost from disk but is still reflected in the in-memory `plan` returned to the model. The model sees the edited plan via the `tool_result`; the file is the durable copy.

**Key insight:** The dual-write (disk + snapshot) is what makes CCR edits durable across container restarts. See [remote_sessions.md](./remote_sessions.md) §Transcript-Mirrored Snapshot.

### Algorithm: Teammate Plan-Approval Mailbox

**What it does:** For teammates marked `plan_mode_required`, route the plan to the team lead's mailbox instead of showing a local approval dialog.

**How it works:**

1. **Guard**: `isTeammate() && isPlanModeRequired()` — both must be true. A teammate that is not `plan_mode_required` exits plan mode locally (voluntary plan mode).
2. **Plan required**: `if (!plan) throw new Error(...)` — teammates MUST have written a plan to disk before calling this tool.
3. **Construct approval request**: assemble `{ type: 'plan_approval_request', from, timestamp, planFilePath, planContent, requestId }`. The `requestId` is generated via `formatAgentId(agentName, teamName || 'default')` + `'plan_approval'` prefix.
4. **Post to mailbox**: `writeToMailbox('team-lead', { from, text: jsonStringify(request), timestamp }, teamName)` enqueues the request in the team lead's inbox.
5. **In-process teammate UX**: `findInProcessTeammateTaskId(agentName, appState)` looks up the task ID for this teammate in the agent panel. If found, mark the task as awaiting approval via `setAwaitingPlanApproval(taskId, taskRegistry, true)`. This is the signal that surfaces "Plan submitted, awaiting leader" in the agent panel UI.
6. **Return**: `{ awaitingLeaderApproval: true, requestId }` — the caller (the agent loop) sees this and blocks the teammate's runner until the lead responds.

**Why this approach:**
- Bypassing the local user-approval UI is essential: teammates are running in a worker subprocess that has no terminal. The team lead is the user-facing approver.
- The mailbox is the same mechanism used for inter-teammate messaging (see `06_swarm/swarm_plan_approval.md` in the v2.1.112 analyze tree). Reusing it means the lead can approve via the standard mailbox-reply UI.
- The `requestId` correlates the eventual approval/rejection back to this exact plan submission. Without it, two consecutive `ExitPlanMode` calls (e.g. after a rejection and re-plan) would be indistinguishable.

### Algorithm: Auto-Mode Gate Fallback

**What it does:** When `prePlanMode === 'auto'` but the auto-mode gate has been tripped (circuit breaker, settings disable, or model unsupported), restore to `'default'` instead of `'auto'` and surface a warning notification.

**How it works:**

1. Compute the gate state *before* `setToolPermissionContext` runs, so the notification can be shown to the user with the correct reason.
2. Read `prePlanMode` (defaulting to `'default'` if undefined).
3. If `prePlanMode === 'auto' && !isAutoModeGateEnabled()`:
   - Get the unavailable reason (`settings`, `circuit-breaker`, or `model`) via `getAutoModeUnavailableReason()`.
   - Build a user-facing notification text via `getAutoModeUnavailableNotification(reason)`.
   - Log the warning to debug log with the full context.
4. If a notification was generated, call `addNotification?.({ ... })` with key `'auto-mode-gate-plan-exit-fallback'`, color `'warning'`, and a 10-second timeout. The `addNotification` callback flows back into the TUI toast system.
5. Inside `setToolPermissionContext`, downgrade `restoreMode === 'auto'` to `'default'` if the gate is off. This is the SAME check, repeated inside the state-setter to ensure the mode actually changes.
6. Subsequently, strip or restore dangerous permissions based on the actual restored mode (auto = strip, anything else = restore if previously stripped).

**Why this approach:**
- The double check (compute notification + state update) ensures the user sees a notification *and* the state change actually happens. A failure mode in v2.1.112 was that the notification fired but the state still went to auto (creating a confusing UX). The dual-evaluation in v2.1.142 closes this race.
- Notifications use the `addNotification` callback rather than direct state mutation so they participate in the TUI's toast queue (rate-limiting, deduplication by key).

**Key insight:** This is the v2.1.112-introduced safety mechanism, preserved unchanged in v2.1.142. The auto-mode gate (`isAutoModeGateEnabled()`) is the circuit-breaker that prevents users with revoked Claude Max from re-entering auto.

### Algorithm: Permission Mode Restoration

The state-setter:

```javascript
context.setToolPermissionContext(prev => {
  let baseContext = prev;
  if (restoringToAuto) {
    baseContext = stripDangerousPermissionsForAutoMode(baseContext) ?? baseContext;
  } else if (stripped) {
    baseContext = restoreDangerousPermissions(baseContext) ?? baseContext;
  }
  return { ...baseContext, mode: restoreMode, prePlanMode: undefined };
});
```

**What it does:** Restores the saved `prePlanMode` while handling the dangerous-rule strip/restore symmetry.

**Step by step:**

1. If restoring to `'auto'`: re-strip dangerous rules (defensive — the model is going back into auto where the classifier handles approval).
2. Else if rules were stripped on entry (`stripped = ctx.strippedDangerousRules`): restore them. The user's full rule set comes back.
3. Build the new context with `mode = restoreMode`, `prePlanMode = undefined` (cleared on exit).

**Why this matters:**
- The strip/restore symmetry ensures that entering plan-from-auto then exiting back to (say) `default` doesn't permanently strip the user's rules. Without the `else if (stripped) restore`, a single plan cycle would silently remove the user's `Edit(/path/**)` rules.

## Algorithm: Tool Result Mapping

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - Build tool_result content
// Location: cli_inner_pretty.js:381796-381845
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(
  { isAgent: H, plan: $, filePath: q, hasTaskTool: K, planWasEdited: _, awaitingLeaderApproval: A, requestId: z },
  Y,
) {
  if (A)
    return { type: "tool_result", content: `Your plan has been submitted to the team lead for approval.

Plan file: ${q}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${z}`, tool_use_id: Y };
  if (H)
    return { type: "tool_result", content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"', tool_use_id: Y };
  if (!$ || $.trim() === "")
    return { type: "tool_result", content: "User has approved exiting plan mode. You can now proceed.", tool_use_id: Y };
  let f = K ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${Am} tool to create a team and parallelize the work.` : "";
  return { type: "tool_result", content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${q}
You can refer back to it if needed during implementation.${f}

## ${_ ? "Approved Plan (edited by user)" : "Approved Plan"}:
${$}`, tool_use_id: Y };
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(
  { isAgent, plan, filePath, hasTaskTool, planWasEdited, awaitingLeaderApproval, requestId },
  toolUseID,
) {
  // Branch A: teammate awaiting leader approval
  if (awaitingLeaderApproval) {
    return {
      type: 'tool_result',
      content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}
...
Request ID: ${requestId}`,
      tool_use_id: toolUseID,
    };
  }

  // Branch B: subagent (Agent tool) — terse confirmation
  if (isAgent) {
    return {
      type: 'tool_result',
      content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
      tool_use_id: toolUseID,
    };
  }

  // Branch C: empty plan
  if (!plan || plan.trim() === '') {
    return {
      type: 'tool_result',
      content: 'User has approved exiting plan mode. You can now proceed.',
      tool_use_id: toolUseID,
    };
  }

  // Branch D: main path — echo plan back, optionally hint at TeamCreate
  const teamHint = hasTaskTool
    ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.`
    : '';
  const planLabel = planWasEdited ? 'Approved Plan (edited by user)' : 'Approved Plan';
  return {
    type: 'tool_result',
    content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${teamHint}

## ${planLabel}:
${plan}`,
    tool_use_id: toolUseID,
  };
}

// Mapping: H→isAgent, $→plan, q→filePath, K→hasTaskTool, _→planWasEdited,
//          A→awaitingLeaderApproval, z→requestId, Y→toolUseID, Am→TEAM_CREATE_TOOL_NAME
```

### Algorithm: Why Echo the Plan Back?

**What it does:** Branch D includes the full plan text in the tool_result, even though the plan is already on disk and the model just wrote it.

**Why:**
1. **Implementation handoff**: The model can immediately begin coding without re-reading the file. For a 5KB plan, this saves a round-trip.
2. **Ultraplan extraction**: The Ultraplan CCR flow parses the tool_result content via `extractApprovedPlan` (`/lyz/codespace/3rd/claude-code/src/utils/ultraplan/...`) to retrieve the plan text for the local CLI. If the plan weren't in the tool_result, the local CLI would have to fetch it separately.
3. **Edited-plan signaling**: When `planWasEdited` is true, the label changes to "Approved Plan (edited by user)". This explicit signal tells the model "the plan I'm about to implement is NOT the one I wrote; the user modified it." Without this, the model might blindly trust its own memory of the plan.
4. **Compaction resilience**: The plan text in the tool_result survives auto-compaction. If the plan file is later lost (container restart, /clear), the plan text in the transcript remains available.

**Key insight:** The dual-echo (file + tool_result) is the same dual-write pattern as in `call` — disk for durability, transcript for resilience.

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| Tool shape | `Tool<InputSchema, Output>` | Same (obfuscated `V2`) | Identical |
| Schemas (input/output/SDK) | as v2.1.88 | Same | Identical |
| `isEnabled` gate | `allowedChannels.length>0` | `allowedChannels.length>0 && T6()` | **Refined**: background-session predicate |
| `validateInput` | mode==='plan' + analytics | Same | Identical |
| `checkPermissions` | teammate→allow, else ask | Same | Identical |
| `call` skeleton | as v2.1.88 | Same | Identical |
| Module lazy-load | top-level feature() gate | Promise.all inside call() | **Refactored**: lazy-load moved into `call()`; eliminates need for `feature('TRANSCRIPT_CLASSIFIER')` macro |
| Auto-mode gate fallback | added in v2.1.112 | Present, unchanged | Identical |
| Edited-plan write-back | as v2.1.88 (v2 default) | Same | Identical |
| Teammate mailbox path | as v2.1.88 | Same | Identical |
| Strip/restore symmetry | as v2.1.88 | Same | Identical |
| Mode-transition telemetry (`vC`) | yes | yes | Identical |
| Tool result mapping (4 branches) | as v2.1.88 | Same | Identical |
| `planWasEdited` label | added in v2.1.112 | Present | Identical |

The only structural change is the module lazy-loading: v2.1.112 declared `vGK` and `qI6` at module init time with feature-gating; v2.1.142 inlines the `Promise.all([...require(...)...])` inside `call()`. This eliminates a class of init-order bugs (where the module variable was null because of bundle-time DCE) and makes the lazy-loading explicit at the call boundary.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) - all new symbol mappings discovered in this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions

See also:
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) - the companion enter tool
- [implementation.md](./implementation.md) - end-to-end lifecycle
- [approval_flow.md](./approval_flow.md) - the user approval dialog
- [permission_mode_persistence.md](./permission_mode_persistence.md) - v2.1.119/132/136 deltas
- [remote_sessions.md](./remote_sessions.md) - CCR persistence and recovery
