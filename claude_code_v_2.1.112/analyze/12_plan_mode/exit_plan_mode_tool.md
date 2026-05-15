# ExitPlanModeV2Tool — Deep Deobfuscation (v2.1.112)

`ExitPlanModeV2Tool` is the model-callable tool that ends plan mode. It reads the plan from disk, prompts the user to approve (or routes through a teammate's leader mailbox), restores the pre-plan permission mode, and emits a tool_result that includes the full plan text so the model can immediately begin implementation.

The full v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts` (493 lines). The v2.1.112 obfuscated implementation lives at `chunks.150.mjs:2094-2315`. Their behavior matches 1:1 except for the **auto-mode gate fallback** which is a v2.1.112 addition tied to the Auto-mode circuit breaker.

## Symbol Table

- `ExitPlanModeV2Tool` (`zZ`) — exported tool object - chunks.150.mjs:2094
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (`dP`) — `"ExitPlanMode"` - chunks.96.mjs:2551 (also aliased `Fk`)
- `EXIT_PLAN_MODE_V2_TOOL_PROMPT` (`PGK`) — prompt string - chunks.150.mjs (declared near top)
- `allowedPromptSchema` (`n$Y`) — `{ tool: 'Bash', prompt: string }` - chunks.150.mjs:2079
- `inputSchema` (`TGK`) — strict `{ allowedPrompts? }` (passthrough) - chunks.150.mjs:2081
- `_sdkInputSchema` (`Vs2`) — extends input with `plan`, `planFilePath` - chunks.150.mjs:2083
- `outputSchema` (`i$Y`) — full output shape with `awaitingLeaderApproval`, `requestId`, ... - chunks.150.mjs:2086
- `autoModeStateModule` (`vGK`) — lazy-loaded `autoModeState` module (feature-gated) - chunks.150.mjs:2078
- `permissionSetupModule` (`qI6`) — lazy-loaded `permissionSetup` module - chunks.150.mjs:2078
- `getAllowedChannels` (`qj`) - --channels gate
- `isTeammate` (`Lz`) - teammate-context check
- `isPlanModeRequired` (`Pn6`) - plan_mode_required spawn flag check
- `getPlanFilePath` (`eW`) - chunks.97.mjs:1612
- `getPlan` (`lP`) - chunks.97.mjs:1618
- `persistFileSnapshotIfRemote` (`gb8`) - chunks.97.mjs:1721
- `writeToMailbox` (`F_`)
- `generateRequestId` (`ph6`)
- `getAgentName` (`T_`), `getTeamName` (`Z9`), `formatAgentId` (`op`)
- `setHasExitedPlanMode` (`iL`) - chunks.1.mjs:3030
- `setNeedsPlanModeExitAttachment` (`Km`) - chunks.1.mjs:3038
- `setNeedsAutoModeExitAttachment` (`sG`) - chunks.1.mjs:3051
- `hasExitedPlanModeInSession` (`_p6`) - chunks.1.mjs:3026

## Tool Definition

The tool object spans chunks.150.mjs:2094-2315. Below is the structural skeleton; the `call` body is dissected in its own section.

```javascript
// ============================================
// ExitPlanModeV2Tool - Tool object skeleton
// Location: chunks.150.mjs:2094-2162
// ============================================

// ORIGINAL (for source lookup):
zZ = Iq({
    name: dP,
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 1e5,
    async description() { return "Prompts the user to exit plan mode and start coding" },
    async prompt() { return PGK },
    get inputSchema() { return TGK() },
    get outputSchema() { return i$Y() },
    userFacingName() { return "" },
    shouldDefer: !0,
    isEnabled() {
        if (qj().length > 0) return !1;
        return !0
    },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !1 },
    requiresUserInteraction() {
        if (Lz()) return !1;
        return !0
    },
    async validateInput(q, { getAppState: K, options: _ }) {
        if (Lz()) return { result: !0 };
        let z = K().toolPermissionContext.mode;
        if (z !== "plan") return d("tengu_exit_plan_mode_called_outside_plan", {
            model: _.mainLoopModel, mode: z, hasExitedPlanModeInSession: _p6()
        }), {
            result: !1,
            message: "You are not in plan mode. ...",
            errorCode: 1
        };
        return { result: !0 }
    },
    async checkPermissions(q, K) {
        if (Lz()) return { behavior: "allow", updatedInput: q };
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: q }
    },
    // ... renderers and call/mapToolResultToToolResultBlockParam ...
})

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
        if (getAllowedChannels().length > 0) return false;
        return true;
    },
    isConcurrencySafe() { return true; },
    isReadOnly() { return false; },  // writes to disk on edited-plan flow
    requiresUserInteraction() {
        if (isTeammate()) return false;
        return true;
    },
    async validateInput(_input, { getAppState, options }) {
        if (isTeammate()) return { result: true };
        const mode = getAppState().toolPermissionContext.mode;
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

// Mapping: zZ→ExitPlanModeV2Tool, dP→EXIT_PLAN_MODE_V2_TOOL_NAME, PGK→EXIT_PLAN_MODE_V2_TOOL_PROMPT,
//          TGK→inputSchema, i$Y→outputSchema, qj→getAllowedChannels, Lz→isTeammate,
//          _p6→hasExitedPlanModeInSession, d→logEvent
```

### Schema highlights

```javascript
// Input (model-facing)
inputSchema = z.strictObject({
    allowedPrompts: z.array(z.object({
        tool: z.enum(['Bash']),
        prompt: z.string(),  // "run tests", "install dependencies"
    })).optional(),
}).passthrough();   // .passthrough() so normalizeToolInput can inject plan/planFilePath

// SDK-facing
_sdkInputSchema = inputSchema.extend({
    plan: z.string().optional(),
    planFilePath: z.string().optional(),
});

// Output
outputSchema = z.object({
    plan: z.string().nullable(),
    isAgent: z.boolean(),
    filePath: z.string().optional(),
    hasTaskTool: z.boolean().optional(),
    planWasEdited: z.boolean().optional(),
    awaitingLeaderApproval: z.boolean().optional(),
    requestId: z.string().optional(),
});
```

**Why `.passthrough()`?** `normalizeToolInput` (chunks elsewhere) reads the plan from disk and injects it into the tool_use input *before* hooks run. Without passthrough, the strict schema would reject the injected fields. The internal schema *intentionally* omits `plan` (so model output containing inline plan is rejected — disk is the source of truth), but passthrough lets infrastructure layers add it.

## Algorithm: `validateInput`

**What it does:** Rejects calls that aren't in plan mode (with a telemetry event) so the model gets a clear error instead of an approval dialog firing in an inappropriate context.

**Why this exists:** The deferred-tool list announces `ExitPlanMode` to the model after plan approval too — this is needed because the model may need to call it again on resume/compact. But if the model spuriously calls it when not in plan mode, this guard catches it *before* `checkPermissions` runs the approval dialog. The telemetry event `tengu_exit_plan_mode_called_outside_plan` tracks how often this happens (so the team can tune the deferred-tool announcement logic).

**Teammate bypass:** `if (isTeammate()) return { result: true }` — teammate AppState may show the *leader's* mode (because `runAgent.ts` skips mode overrides in `acceptEdits`/`bypassPermissions`/`auto`); the true source of "should this teammate exit plan mode" is `isPlanModeRequired()`, checked later in `call`. Validating the mode here would produce false negatives.

## Algorithm: `checkPermissions`

```javascript
async checkPermissions(input, context) {
    if (isTeammate()) {
        return { behavior: 'allow', updatedInput: input };
    }
    return { behavior: 'ask', message: 'Exit plan mode?', updatedInput: input };
}
```

**What it does:** For non-teammates, gates the call behind a user dialog. For teammates, bypasses the dialog entirely.

**Why teammates bypass:** Teammates have no local user interaction surface. The teammate's `call()` body branches: if `isPlanModeRequired()`, it routes the approval through the leader's mailbox (sending a `plan_approval_request`); otherwise the teammate exits "voluntarily" (no approval needed because the user/leader didn't require it). Returning `allow` here is correct because the *real* approval is performed elsewhere.

**`behavior: 'ask'`** triggers the TUI permission dialog. The user sees the plan preview and chooses approve/reject/edit. On approve, the CCR web UI may rewrite `input.plan` if the user edited the plan in the diff editor — this comes back via `permissionResult.updatedInput`.

## Algorithm: The `call` Body

This is the most complex method in the module. The full body spans chunks.150.mjs:2163-2262. Below it is decomposed into phases.

### Phase 1: Disk read & edited-plan write-back

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Phase 1: disk IO
// Location: chunks.150.mjs:2163-2168
// ============================================

// ORIGINAL (for source lookup):
async call(q, K) {
    let _ = !!K.agentId,
        z = eW(K.agentId),
        Y = "plan" in q && typeof q.plan === "string" ? q.plan : void 0,
        A = Y ?? lP(K.agentId);
    if (Y !== void 0 && z) await l$Y(z, Y, "utf-8").catch((H) => j6(H)), gb8();
    // ... continues in Phase 2 ...
}

// READABLE (for understanding):
async call(input, context) {
    const isAgent = !!context.agentId;
    const filePath = getPlanFilePath(context.agentId);
    // CCR/SDK may inject an edited plan via permissionResult.updatedInput.
    // queryHelpers.ts full-replaces finalInput, so when CCR sends {} (no edit)
    // input.plan is undefined → disk fallback. The internal inputSchema omits
    // 'plan' (normally injected by normalizeToolInput), hence the narrowing.
    const inputPlan = 'plan' in input && typeof input.plan === 'string' ? input.plan : undefined;
    const plan = inputPlan ?? getPlan(context.agentId);
    // Sync disk so VerifyPlanExecution / Read see the edit. Re-snapshot
    // after: the only other persistFileSnapshotIfRemote call (api.ts) runs
    // in normalizeToolInput, pre-permission — it captured the OLD plan.
    if (inputPlan !== undefined && filePath) {
        await writeFile(filePath, inputPlan, 'utf-8').catch(e => logError(e));
        void persistFileSnapshotIfRemote();
    }
    // ... continues ...
}

// Mapping: q→input, K→context, _→isAgent, z→filePath, Y→inputPlan, A→plan,
//          eW→getPlanFilePath, lP→getPlan, l$Y→writeFile (from fs/promises),
//          j6→logError, gb8→persistFileSnapshotIfRemote
```

**Key insight: dual plan source.** The `plan` is fetched from `input.plan` if present, else from disk via `getPlan`. The two pathways are:

- **Disk path (default)**: model wrote the plan with `Write`. `call` reads it via `getPlan`.
- **CCR/web edit path**: user edited the plan in the web diff editor before approving. CCR puts the edited content in `permissionResult.updatedInput.plan`, which `queryHelpers.ts` full-replaces into `finalInput`. The `'plan' in input` narrowing detects this.

**Why write back to disk:** After the edit, subsequent tools (e.g. a hypothetical `VerifyPlanExecution`, or simple `Read` of the file later) need to see the edited content. The earlier `persistFileSnapshotIfRemote` call (in `normalizeToolInput`, pre-permission) captured the OLD plan, so this one re-snapshots with the edit. The write is fire-and-forget with `.catch(logError)` so a disk failure doesn't abort the approval.

### Phase 2: Teammate branch — leader approval

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Phase 2: teammate plan-approval-request
// Location: chunks.150.mjs:2169-2199
// ============================================

// ORIGINAL (for source lookup):
if (Lz() && Pn6()) {
    if (!A) throw Error(`No plan file found at ${z}. Please write your plan to this file before calling ExitPlanMode.`);
    let H = T_() || "unknown",
        J = Z9(),
        X = ph6("plan_approval", op(H, J || "default")),
        M = {
            type: "plan_approval_request",
            from: H,
            timestamp: new Date().toISOString(),
            planFilePath: z,
            planContent: A,
            requestId: X
        };
    await F_("team-lead", { from: H, text: I6(M), timestamp: new Date().toISOString() }, J);
    let P = K.getAppState(),
        W = Jd8(H, P);
    if (W) J37(W, K.taskRegistry, !0);
    return {
        data: {
            plan: A, isAgent: !0, filePath: z,
            awaitingLeaderApproval: !0, requestId: X
        }
    }
}

// READABLE (for understanding):
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
    await writeToMailbox(
        'team-lead',
        { from: agentName, text: jsonStringify(approvalRequest), timestamp: new Date().toISOString() },
        teamName,
    );
    const appState = context.getAppState();
    const agentTaskId = findInProcessTeammateTaskId(agentName, appState);
    if (agentTaskId) {
        setAwaitingPlanApproval(agentTaskId, context.taskRegistry, true);
    }
    return {
        data: {
            plan, isAgent: true, filePath,
            awaitingLeaderApproval: true, requestId,
        },
    };
}

// Mapping: Lz→isTeammate, Pn6→isPlanModeRequired, T_→getAgentName, Z9→getTeamName,
//          ph6→generateRequestId, op→formatAgentId, F_→writeToMailbox,
//          I6→jsonStringify, Jd8→findInProcessTeammateTaskId,
//          J37→setAwaitingPlanApproval, H→agentName, J→teamName, X→requestId, M→approvalRequest
```

**What it does:** When this is a teammate with `plan_mode_required`, instead of running the local approval dialog, route the plan through the leader's mailbox.

**Why:**
- Teammates have no TUI permission dialog (`requiresUserInteraction()` returns false).
- `plan_mode_required` is a per-teammate config that says "this teammate's plan must be approved by the lead before implementation". The mailbox is the canonical IPC channel.
- The `requestId` (formatted `plan_approval-<agentId>-<random>`) uniquely identifies the approval round for retries and timeouts.

**Side effects:**
- `setAwaitingPlanApproval(agentTaskId, ..., true)` flips the UI flag on the leader's task panel so the team-status renderer shows "awaiting plan approval".
- The teammate's runner blocks on receiving a `plan_approval_response` message from the leader (handled in the in-process runner / `chunks.155` polling loop).

**No mode change yet.** The teammate stays in `mode: 'plan'` while awaiting. The actual mode restoration happens only after the leader sends an `approve` response, which triggers another code path (not this one).

### Phase 3: Auto-mode gate fallback (v2.1.112-only safeguard)

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Phase 3: auto-mode gate guard
// Location: chunks.150.mjs:2200-2228
// ============================================

// ORIGINAL (for source lookup):
let O = K.getAppState(),
    w = null;
{
    let H = O.toolPermissionContext.prePlanMode ?? "default";
    if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) {
        let J = qI6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
        w = qI6?.getAutoModeUnavailableNotification(J) ?? "auto mode unavailable",
        E(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${H} but gate is off (reason=${J}) — falling back to default on plan exit`, { level: "warn" })
    }
}
if (w) {
    let H = `plan exit → default · ${w}`;
    K.addNotification?.({
        key: "auto-mode-gate-plan-exit-fallback",
        text: H, priority: "immediate", color: "warning", timeoutMs: 1e4
    }),
    sv({ type: "system", subtype: "notification", key: "auto-mode-gate-plan-exit-fallback",
         text: H, priority: "immediate", color: "warning", timeout_ms: 1e4 })
}

// READABLE (for understanding):
const appState = context.getAppState();
let gateFallbackNotification = null;
{
    const prePlanRaw = appState.toolPermissionContext.prePlanMode ?? 'default';
    if (prePlanRaw === 'auto' && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
        const reason = permissionSetupModule?.getAutoModeUnavailableReason() ?? 'circuit-breaker';
        gateFallbackNotification =
            permissionSetupModule?.getAutoModeUnavailableNotification(reason) ?? 'auto mode unavailable';
        logForDebugging(
            `[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${prePlanRaw} ` +
            `but gate is off (reason=${reason}) — falling back to default on plan exit`,
            { level: 'warn' },
        );
    }
}
if (gateFallbackNotification) {
    const text = `plan exit → default · ${gateFallbackNotification}`;
    context.addNotification?.({
        key: 'auto-mode-gate-plan-exit-fallback',
        text, priority: 'immediate', color: 'warning', timeoutMs: 10000,
    });
    recordSystemNotification({
        type: 'system', subtype: 'notification',
        key: 'auto-mode-gate-plan-exit-fallback',
        text, priority: 'immediate', color: 'warning', timeout_ms: 10000,
    });
}

// Mapping: qI6→permissionSetupModule, E→logForDebugging, sv→recordSystemNotification
```

**What it does:** Detects the case where the user entered plan mode from `auto` mode, but in the meantime the auto-mode gate was disabled (e.g. by the safety classifier's circuit breaker). In that case, restoring to `auto` would re-enable a mode the system has just decided to disable. The code instead forces the restore to `default` and surfaces a notification.

**Why this is critical: circuit breaker bypass defense.**
Without this check, `ExitPlanMode` would bypass the auto-mode circuit breaker. The classifier's circuit breaker exists to disable auto mode after consecutive safety violations; restoring it via the plan exit path would silently re-enable a mode the user didn't realize was disabled.

**Why notify twice (`addNotification` + `recordSystemNotification`)?**
- `addNotification` is the per-TUI toast (transient, displayed in the status line).
- `recordSystemNotification` (`sv` in obfuscated code) emits a structured system message that gets recorded in the transcript. This means the model also sees the notification in its next context (so it understands why permissions are different).

The notification text format is `plan exit → default · <reason>`, e.g. `plan exit → default · auto mode is temporarily unavailable due to safety check failures`.

**Diff vs v2.1.88:** v2.1.88 lacks the `recordSystemNotification` (transcript) emission. v2.1.112 adds it so the model can introspect the fallback. The notification *key* is identical, ensuring de-duplication in the TUI works.

### Phase 4: Mode restoration with permission rewriting

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Phase 4: mode restoration
// Location: chunks.150.mjs:2229-2251
// ============================================

// ORIGINAL (for source lookup):
let $ = K.getAppState().toolPermissionContext;
if ($.mode === "plan") {
    iL(!0), Km(!0);
    let H = $.prePlanMode ?? "default";
    {
        if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) H = "default";
        let M = H === "auto",
            P = vGK?.isAutoModeActive() ?? !1;
        if (vGK?.setAutoModeActive(M), P && !M) sG(!0)
    }
    let J = H === "auto",
        X = $.strippedDangerousRules;
    K.setToolPermissionContext((M) => {
        let P = M;
        if (J) P = qI6?.stripDangerousPermissionsForAutoMode(P) ?? P;
        else if (X) P = qI6?.restoreDangerousPermissions(P) ?? P;
        return { ...P, mode: H, prePlanMode: void 0 }
    })
}

// READABLE (for understanding):
const currentContext = context.getAppState().toolPermissionContext;
if (currentContext.mode === 'plan') {
    setHasExitedPlanMode(true);
    setNeedsPlanModeExitAttachment(true);
    let restoreMode = currentContext.prePlanMode ?? 'default';
    {
        if (restoreMode === 'auto' && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
            restoreMode = 'default';
        }
        const finalRestoringAuto = restoreMode === 'auto';
        // Capture pre-restore state — isAutoModeActive() is the authoritative
        // signal (prePlanMode/strippedDangerousRules are stale after
        // transitionPlanAutoMode deactivates mid-plan).
        const autoWasUsedDuringPlan = autoModeStateModule?.isAutoModeActive() ?? false;
        autoModeStateModule?.setAutoModeActive(finalRestoringAuto);
        if (autoWasUsedDuringPlan && !finalRestoringAuto) {
            setNeedsAutoModeExitAttachment(true);
        }
    }
    const restoringToAuto = restoreMode === 'auto';
    const wasStripped = currentContext.strippedDangerousRules;
    context.setToolPermissionContext(prev => {
        let baseContext = prev;
        if (restoringToAuto) {
            baseContext = permissionSetupModule?.stripDangerousPermissionsForAutoMode(baseContext) ?? baseContext;
        } else if (wasStripped) {
            baseContext = permissionSetupModule?.restoreDangerousPermissions(baseContext) ?? baseContext;
        }
        return { ...baseContext, mode: restoreMode, prePlanMode: undefined };
    });
}

// Mapping: $→currentContext, iL→setHasExitedPlanMode, Km→setNeedsPlanModeExitAttachment,
//          sG→setNeedsAutoModeExitAttachment, H→restoreMode, J→restoringToAuto,
//          X→wasStripped, M→prev, P→baseContext, vGK→autoModeStateModule
```

**What it does:** Restores the pre-plan permission mode, conditionally rewriting dangerous-permission rules and updating the auto-mode-active flag.

**How it works (step-by-step):**

1. **Defensive re-read**: re-reads the AppState because phase 3 may have called `addNotification` which itself can trigger renders. The mode check is `if ($.mode === 'plan')` — if we're somehow already out of plan mode (e.g. a permission hook auto-approved with a `setMode` updatedPermissions), we skip mode restoration entirely. This handles the edge case described in the comment: "PermissionRequest hook auto-approves without providing updatedPermissions".
2. **Set exit flags**: `iL(true)` (sets `hasExitedPlanMode`), `Km(true)` (sets `needsPlanModeExitAttachment`). These are checked by `HMY` (the next reminder build) to produce the `plan_mode_exit` attachment.
3. **Compute `restoreMode`**: defaults to `prePlanMode ?? 'default'`. Then the second auto-mode gate check (mirroring phase 3) forces `default` if the gate is off.
4. **Reconcile `autoModeActive`**: the in-memory `autoModeState` module tracks whether auto mode is currently active. The reconciliation captures whether auto was active *during* the plan (because the classifier may have transitioned plan→auto mid-plan), then sets the new active state to `finalRestoringAuto`. If auto was used during the plan but we're NOT restoring to auto, set `needsAutoModeExitAttachment` so the model sees an explanation reminder.
5. **Rewrite dangerous rules**:
   - If restoring to auto: strip dangerous rules (because auto-mode requires them stripped).
   - Else if `strippedDangerousRules`: restore them (because they were stripped on plan entry and the user wasn't in auto mode before).
6. **Final state update**: `{ ...baseContext, mode: restoreMode, prePlanMode: undefined }` — the mode is set, `prePlanMode` is cleared (no longer in plan mode).

**Why this is so complex:** Auto-mode and plan-mode interact in subtle ways. The classifier can flip auto on/off independently of mode changes. The plan entry may have stripped dangerous rules (if entering from auto), and exit needs to reverse that surgically depending on what mode we're restoring to. Without these multiple guards, the auto-mode circuit breaker could be silently bypassed via the plan-exit path.

### Phase 5: Tool result construction

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Phase 5: return tool data
// Location: chunks.150.mjs:2252-2261
// ============================================

// ORIGINAL (for source lookup):
let j = z4() && K.options.tools.some((H) => e3(H, T4));
return {
    data: {
        plan: A,
        isAgent: _,
        filePath: z,
        hasTaskTool: j || void 0,
        planWasEdited: Y !== void 0 || void 0
    }
}

// READABLE (for understanding):
const hasTaskTool = isAgentSwarmsEnabled() &&
    context.options.tools.some(t => toolMatchesName(t, AGENT_TOOL_NAME));
return {
    data: {
        plan,
        isAgent,
        filePath,
        hasTaskTool: hasTaskTool || undefined,
        planWasEdited: inputPlan !== undefined || undefined,
    },
};

// Mapping: j→hasTaskTool, z4→isAgentSwarmsEnabled, e3→toolMatchesName, T4→AGENT_TOOL_NAME
```

**`hasTaskTool` propagation:** If the session has the `Agent` tool available, the tool result will include a hint suggesting the user/model break the plan into parallel tasks via `TeamCreate`. The `|| undefined` idiom strips the field from the JSON when false (instead of `hasTaskTool: false`).

**`planWasEdited`:** Truthy only when the model called the tool via the SDK/CCR edit path. Used by `mapToolResultToToolResultBlockParam` to label the plan as "Approved Plan (edited by user)" so the model knows the user changed something.

## Algorithm: `mapToolResultToToolResultBlockParam`

This method runs *after* `call` and converts the tool's `data` into the actual tool_result block the model sees. The branches cover all the return shapes from `call`.

```javascript
// Phase A: awaiting leader approval
if (awaitingLeaderApproval) {
    return tool_result(`Your plan has been submitted to the team lead for approval.\n\nPlan file: ${filePath}\n\n**What happens next:**\n1. Wait for the team lead to review your plan\n2. You will receive a message in your inbox with approval/rejection\n3. If approved, you can proceed with implementation\n4. If rejected, refine your plan based on the feedback\n\n**Important:** Do NOT proceed until you receive approval. Check your inbox for response.\n\nRequest ID: ${requestId}`);
}
// Phase B: subagent (non-teammate) plan was approved
if (isAgent) {
    return tool_result('User has approved the plan. There is nothing else needed from you now. Please respond with "ok"');
}
// Phase C: empty plan (defensive)
if (!plan || plan.trim() === '') {
    return tool_result('User has approved exiting plan mode. You can now proceed.');
}
// Phase D: normal approved-plan path
const teamHint = hasTaskTool
    ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.`
    : '';
const planLabel = planWasEdited ? 'Approved Plan (edited by user)' : 'Approved Plan';
return tool_result(`User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: ${filePath}\nYou can refer back to it if needed during implementation.${teamHint}\n\n## ${planLabel}:\n${plan}`);
```

**Key insight: the plan is echoed in the tool_result.** Even though the model already wrote the plan to disk, the approved plan is **inlined** in the tool_result content. This is intentional:

1. The CCR Ultraplan flow's `extractApprovedPlan()` parses the tool_result for the `## Approved Plan:` marker to deliver the plan to the local CLI.
2. The model can begin implementation without re-reading the file (the plan is already in its context window).
3. If the user *edited* the plan, the label changes to `## Approved Plan (edited by user):` so the model knows to follow the edited version verbatim.

## Why the dual constants `Fk` and `dP`?

`chunks.96.mjs:2549-2551`:
```javascript
Fk = "ExitPlanMode"
dP = "ExitPlanMode"
```

Both are the literal `"ExitPlanMode"`. The duplication is from v2.1.88's source where `EXIT_PLAN_MODE_TOOL_NAME` (deprecated, for the legacy V1 tool) and `EXIT_PLAN_MODE_V2_TOOL_NAME` are both declared but resolve to the same string for wire compatibility — the tool name is "ExitPlanMode" externally either way. The minifier preserved both because their import sites differ (V1 paths may still import `Fk`; V2 path imports `dP`).

## v2.1.88 → v2.1.112 Diff Summary

| Aspect | v2.1.88 | v2.1.112 | Status |
|--------|---------|----------|--------|
| Schema | `inputSchema` + `_sdkInputSchema` | Same | Identical |
| `validateInput` | mode-check + telemetry | Same | Identical |
| `checkPermissions` | ask / allow-for-teammate | Same | Identical |
| Disk read & edit write-back | yes | yes | Identical |
| Teammate `plan_approval_request` path | yes | yes | Identical |
| Auto-mode gate guard (phase 3) | absent | present | **Added in v2.1.112** |
| `sv(...notification...)` transcript emit | absent | present | **Added in v2.1.112** |
| `setAutoModeActive` reconciliation | yes | yes | Identical (refined) |
| Dangerous-permission rewrite | yes | yes | Identical |
| Tool result inline plan | yes | yes | Identical |

The substantive v2.1.112 addition is the **auto-mode gate fallback** (phase 3 + the second guard in phase 4) which prevents the plan-exit path from bypassing the auto-mode circuit breaker. This addition is tied to the broader v2.1.111 Auto-mode rollout for Max subscribers.

## Failure Modes

| Failure | Trigger | Behavior |
|---------|---------|----------|
| `"You are not in plan mode."` | Tool called when `mode !== 'plan'` (and not teammate) | `validateInput` returns `result: false` with `errorCode: 1`. No approval dialog. Logs `tengu_exit_plan_mode_called_outside_plan`. |
| `No plan file found at <path>` | Teammate with `plan_mode_required` but `getPlan()` returned null | Thrown synchronously from `call`. Model sees the error and writes the plan. |
| Disk write error on edited plan | `writeFile(filePath, inputPlan)` rejects | Caught and logged via `j6`/`logError`. Approval still proceeds; disk state may be stale. |
| Auto-mode gate disabled mid-plan | `prePlanMode === 'auto'` but `isAutoModeGateEnabled()` returns false at exit | Restore mode forced to `'default'`. Notification with key `auto-mode-gate-plan-exit-fallback` shown. |
| Mode race | AppState already shows `mode !== 'plan'` (e.g. permission hook auto-rewrote) | Mode restoration is skipped (`if ($.mode === 'plan')` guard). Exit flags still set. |
| Empty plan after approval | `!plan || plan.trim() === ''` | Tool_result is a short "You can now proceed." instead of the inlined plan. |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions
> - Unit-1 additions: [symbol_additions_unit_01.md](../00_overview/symbol_additions_unit_01.md)

See also:
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) - the companion entry tool
- [implementation.md](./implementation.md) - end-to-end lifecycle and state machine
- [plan_file_naming.md](./plan_file_naming.md) - how the plan file path is constructed
- `30_agent_team/plan_mode_integration.md` - leader-side approval response handling
