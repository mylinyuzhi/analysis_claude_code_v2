# Plan Mode Approval Flow (v2.1.112)

> The end-to-end state machine for the user-facing plan approval lifecycle: prompt → plan-file write → `ExitPlanMode` tool call → permission modal → mode restoration. Includes auto-mode gating, plan-file validation, and the v2.1.91 file-resolution behaviour.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_02.md](../00_overview/symbol_additions_unit_02.md) — New symbols discovered in this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions / auto-mode gate

Key functions in this document:
- `ExitPlanModeV2Tool` (`zZ`) — Tool object, chunks.150.mjs:2094-2314
- `getPlanFilePath` (`eW`) — Resolves the slug-anchored plan path, chunks.97.mjs:1612
- `getPlan` (`lP`) — Reads plan from disk, chunks.97.mjs:1618
- `persistFileSnapshotIfRemote` (`gb8`) — Mirrors plan to transcript in remote sessions, chunks.97.mjs:1721
- `hasExitedPlanModeInSession` (`_p6`) — Analytics gate
- `setHasExitedPlanMode` (`iL`) — Flips session flag on approval
- `setNeedsPlanModeExitAttachment` (`Km`) — Marks attachment-injection for next turn
- `setNeedsAutoModeExitAttachment` (`sG`) — Marks auto-mode exit attachment
- `permissionSetupModule` (`qI6`) — Auto-mode gate + dangerous-rule stripping
- `autoModeStateModule` (`vGK`) — Auto-mode session toggle

---

## High-Level State Machine

```
                              ┌────────────────────────────────┐
                              │   user enters plan mode        │
                              │   (Shift+Tab or /plan or       │
                              │    auto-suggestion accept)     │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ savePrePlanMode(current_mode)  │
                              │ prePlanMode = "default" |      │
                              │   "auto" | "acceptEdits" |     │
                              │   "bypassPermissions"          │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ planSlug = newWordSlug()       │
                              │ planFilePath = {dir}/{slug}.md │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ model researches, writes plan  │
                              │ via Write/Edit to planFilePath │
                              │ (incremental persistFile…IfRem)│
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ model calls ExitPlanMode       │
                              │ (no `plan` arg; read from disk)│
                              └───────────────┬────────────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              │                                │
                       teammate? Pn6()                     no — main session
                              │                                │
                              ▼                                ▼
                  ┌────────────────────┐         ┌──────────────────────────┐
                  │ plan_approval_     │         │ checkPermissions:        │
                  │ request → leader   │         │ behavior:"ask"           │
                  │ (see swarm_plan…)  │         │ → ExitPlanModePermission │
                  └────────────────────┘         │   Request component      │
                                                 └────────────┬─────────────┘
                                                              │
                                                              ▼
                                            ┌──────────────────────────────────┐
                                            │ User picks an option (5 paths):  │
                                            │  • Yes, clear ctx + auto-accept  │
                                            │  • Yes, auto-accept (keep ctx)   │
                                            │  • Yes, manually approve         │
                                            │  • Refine with Ultraplan         │
                                            │  • No, keep planning + feedback  │
                                            └────────────────┬─────────────────┘
                                                             │
                                              ┌──────────────┴──────────────┐
                                              │                              │
                                          rejected                       approved
                                              │                              │
                                              ▼                              ▼
                                    ┌──────────────────┐      ┌────────────────────────────┐
                                    │ Tool call.       │      │ setHasExitedPlanMode(true) │
                                    │ skipped.         │      │ setNeedsPlanModeExitAtt    │
                                    │ stay in plan     │      │ mode = prePlanMode or fall │
                                    │ feedback → LLM   │      │   back via auto-mode gate  │
                                    └──────────────────┘      │ stripDangerousPermissions  │
                                                              │   or restoreDangerous      │
                                                              └────────────────────────────┘
```

---

## ExitPlanModeV2Tool — Definition

```javascript
// ============================================
// ExitPlanModeV2Tool - Plan-approval tool entry
// Location: chunks.150.mjs:2094-2314
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
    async validateInput(q, { getAppState: K, options: _ }) { /* see below */ },
    async checkPermissions(q, K) {
        if (Lz()) return { behavior: "allow", updatedInput: q };
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: q }
    },
    /* renderToolUseMessage, renderToolResultMessage, renderToolUseRejectedMessage */
    async call(q, K) { /* see below */ },
    mapToolResultToToolResultBlockParam(...) { /* see below */ }
})

// READABLE (for understanding):
ExitPlanModeV2Tool = buildTool({
    name: EXIT_PLAN_MODE_V2_TOOL_NAME,
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 100_000,
    description: () => "Prompts the user to exit plan mode and start coding",
    prompt: () => EXIT_PLAN_MODE_V2_TOOL_PROMPT,
    get inputSchema() { return inputSchema() },
    get outputSchema() { return outputSchema() },
    userFacingName: () => "",
    shouldDefer: true,
    isEnabled() {
        // KAIROS/channel users (Telegram/Discord) cannot see the dialog;
        // disabling avoids a hang.
        if (getAllowedChannels().length > 0) return false;
        return true;
    },
    isConcurrencySafe: () => true,
    isReadOnly: () => false,
    requiresUserInteraction() {
        // Teammates delegate to the team leader's mailbox.
        if (isTeammate()) return false;
        return true;
    },
    validateInput, checkPermissions, renderToolUseMessage, renderToolResultMessage,
    renderToolUseRejectedMessage, call, mapToolResultToToolResultBlockParam,
});

// Mapping: zZ→ExitPlanModeV2Tool, dP→EXIT_PLAN_MODE_V2_TOOL_NAME, PGK→EXIT_PLAN_MODE_V2_TOOL_PROMPT,
//          TGK→inputSchema, i$Y→outputSchema, Iq→buildTool, qj→getAllowedChannels, Lz→isTeammate
```

**Why `shouldDefer: true`:** The deferred-tool list announces `ExitPlanMode` regardless of mode, so the model can call it directly after plan approval (a fresh delta on compact/clear). This is also why `validateInput` does a *mode* re-check inside the tool — the tool can be invoked even when the model thinks it's in plan mode but isn't.

---

## Stage 1: `validateInput` — Mode Gate

```javascript
// ============================================
// validateInput - Reject ExitPlanMode outside plan mode
// Location: chunks.150.mjs:2128-2148
// ============================================

// ORIGINAL (for source lookup):
async validateInput(q, { getAppState: K, options: _ }) {
    if (Lz()) return { result: !0 };
    let z = K().toolPermissionContext.mode;
    if (z !== "plan") return d("tengu_exit_plan_mode_called_outside_plan", {
        model: _.mainLoopModel, mode: z, hasExitedPlanModeInSession: _p6()
    }), {
        result: !1,
        message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
        errorCode: 1
    };
    return { result: !0 }
}

// READABLE (for understanding):
async function validateInput(input, { getAppState, options }) {
    // Teammates: getAppState reflects the leader's mode; ignore it
    // (isPlanModeRequired() is the real signal — see runAgent.ts).
    if (isTeammate()) return { result: true };

    const mode = getAppState().toolPermissionContext.mode;
    if (mode !== "plan") {
        logEvent("tengu_exit_plan_mode_called_outside_plan", {
            model: options.mainLoopModel,
            mode,
            hasExitedPlanModeInSession: hasExitedPlanModeInSession(),
        });
        return {
            result: false,
            message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
            errorCode: 1,
        };
    }
    return { result: true };
}

// Mapping: Lz→isTeammate, K→getAppState, _→options, d→logEvent, _p6→hasExitedPlanModeInSession, z→mode
```

### Algorithm Deep Dive: Why pre-permission gating?

**What it does:** Rejects `ExitPlanMode` calls before the permission dialog is shown if the session is not currently in `"plan"` mode.

**How it works:**
1. Teammates skip the check (leader's `AppState` is observed remotely, not authoritative).
2. Main sessions read the current `toolPermissionContext.mode`.
3. If the mode is anything other than `"plan"`, return an error tuple (`result: false`).
4. Emit a telemetry event (`tengu_exit_plan_mode_called_outside_plan`) including the current mode and a flag for whether plan-mode was ever exited this session — useful for catching post-approval recall attempts.

**Why this approach:**
- `shouldDefer: true` means the tool definition is broadcast even when the model is not in plan mode (this lets the model "remember" the tool across compactions).
- Without a mode gate, the model could spuriously call `ExitPlanMode` after a prior approval, which would trigger the permission dialog with the *previous* plan content (UX confusion).
- The pre-check is structurally cheaper than rendering the dialog and then dismissing it.

**Trade-offs:**
- A single boolean flag (`hasExitedPlanMode`) would not differentiate "no prior plan" vs "already approved" — emitting the flag in telemetry lets Anthropic discover model failure modes.

**Key insight:** The error message explicitly tells the model to *continue with implementation* if the plan was already approved. This avoids a state-recovery loop where the model would keep retrying `ExitPlanMode` after approval.

---

## Stage 2: `checkPermissions` — Dispatch to Modal vs Mailbox

```javascript
// ============================================
// checkPermissions - Dispatch to user dialog or teammate mailbox
// Location: chunks.150.mjs:2149-2159
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(q, K) {
    if (Lz()) return { behavior: "allow", updatedInput: q };
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: q }
}

// READABLE (for understanding):
async function checkPermissions(input, context) {
    // Teammates: never show the permission UI locally. The .call() branch
    // either writes a plan_approval_request to the leader's mailbox
    // (isPlanModeRequired) or exits locally (voluntary plan mode).
    if (isTeammate()) return { behavior: "allow", updatedInput: input };
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
}

// Mapping: Lz→isTeammate
```

The `"ask"` return triggers rendering of `ExitPlanModePermissionRequest` (the "Ready to code?" modal). The modal is a *custom permission component*, not the default Yes/No dialog — it's wired through the permission-component registry by tool name.

---

## Stage 3: The Approval Modal — User Picks an Option

The component is `ExitPlanModePermissionRequest` (v2.1.88 path: `src/components/permissions/ExitPlanModePermissionRequest/ExitPlanModePermissionRequest.tsx`). It builds a 4-to-5 option select menu:

| Option key | When shown | What it does |
|------------|-----------|--------------|
| `yes-bypass-permissions` | enterprise mode + `isBypassPermissionsModeAvailable` | clear context + bypass mode |
| `yes-accept-edits` | always (if plan exists) | clear context + acceptEdits mode |
| `yes-accept-edits-keep-context` | (renamed under feature flag) | keep context + acceptEdits |
| `yes-default-keep-context` | always | keep context + default mode |
| `yes-resume-auto-mode` / `yes-auto-clear-context` | `TRANSCRIPT_CLASSIFIER` + auto-mode active | restore auto mode |
| `ultraplan` | `feature('ULTRAPLAN') && !ultraplanSessionUrl && !ultraplanLaunching` | reject locally; teleport to web |
| `no` | always | reject + typed feedback |

For the "ultraplan" path see [ultraplan_integration.md](./ultraplan_integration.md).

### Auto-mode gate visibility

`isAutoModeAvailable` (from `toolPermissionContext`) controls whether the auto-mode option appears. The gate can be turned off in real time by the circuit breaker — the modal observes the live value, so an open dialog hides the auto option as soon as the gate trips.

### Ctrl+G external-editor escape hatch

While the modal is visible, `Ctrl+G` opens the plan file in `$EDITOR`. For V2 (the only path in v2.1.112), this edits the file on disk directly. When the user returns, `planEditedLocally` is flipped, which causes `updatedInput = { plan: currentPlan }` to be passed back, so the tool's `call()` knows to echo the edited plan in `tool_result` (otherwise the model has the plan from the file write turn already).

---

## Stage 4: `call()` — Permission Granted → Restore Mode

The tool's `call()` runs **after** the user picks a yes-option (or the teammate flow short-circuits). Sequence:

```javascript
// ============================================
// ExitPlanModeV2Tool.call - Main session path
// Location: chunks.150.mjs:2163-2262
// ============================================

// ORIGINAL (excerpt — main-session branch only):
async call(q, K) {
    let _ = !!K.agentId,
        z = eW(K.agentId),
        Y = "plan" in q && typeof q.plan === "string" ? q.plan : void 0,
        A = Y ?? lP(K.agentId);
    if (Y !== void 0 && z) await l$Y(z, Y, "utf-8").catch((H) => j6(H)), gb8();
    /* teammate branch elided — see swarm_plan_approval.md */
    let O = K.getAppState(), w = null;
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
        K.addNotification?.({ key:"auto-mode-gate-plan-exit-fallback", text:H, priority:"immediate", color:"warning", timeoutMs:1e4 }),
        sv({ type:"system", subtype:"notification", key:"auto-mode-gate-plan-exit-fallback", text:H, priority:"immediate", color:"warning", timeout_ms:1e4 })
    }
    let $ = K.getAppState().toolPermissionContext;
    if ($.mode === "plan") {
        iL(!0), Km(!0);
        let H = $.prePlanMode ?? "default";
        if (H === "auto" && !(qI6?.isAutoModeGateEnabled() ?? !1)) H = "default";
        let M = H === "auto", P = vGK?.isAutoModeActive() ?? !1;
        if (vGK?.setAutoModeActive(M), P && !M) sG(!0);
        let J = H === "auto", X = $.strippedDangerousRules;
        K.setToolPermissionContext((M) => {
            let P = M;
            if (J) P = qI6?.stripDangerousPermissionsForAutoMode(P) ?? P;
            else if (X) P = qI6?.restoreDangerousPermissions(P) ?? P;
            return { ...P, mode: H, prePlanMode: void 0 }
        })
    }
    let j = z4() && K.options.tools.some((H) => e3(H, T4));
    return { data: { plan: A, isAgent: _, filePath: z, hasTaskTool: j || void 0, planWasEdited: Y !== void 0 || void 0 } }
}

// READABLE (for understanding):
async function call(input, context) {
    const isAgent = !!context.agentId;
    const filePath = getPlanFilePath(context.agentId);

    // CCR / Ctrl+G can pass an edited plan via input.plan; otherwise read disk.
    const inputPlan = "plan" in input && typeof input.plan === "string" ? input.plan : undefined;
    const plan = inputPlan ?? getPlan(context.agentId);

    // If the user edited via the CCR web UI, persist back to disk so
    // VerifyPlanExecution / Read see the change. The other persist call
    // (api.ts/normalizeToolInput) ran pre-permission with the old plan.
    if (inputPlan !== undefined && filePath) {
        await writeFile(filePath, inputPlan, "utf-8").catch(logError);
        void persistFileSnapshotIfRemote();
    }

    // [teammate branch handled elsewhere]

    // Auto-mode gate fallback: even though the modal hides the auto option
    // when the gate trips, prePlanMode may still be "auto" — defend here.
    const appState = context.getAppState();
    let gateFallbackNotification = null;
    {
        const prePlanRaw = appState.toolPermissionContext.prePlanMode ?? "default";
        if (prePlanRaw === "auto" && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
            const reason = permissionSetupModule?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            gateFallbackNotification = permissionSetupModule?.getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";
            logForDebugging(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${prePlanRaw} but gate is off (reason=${reason}) — falling back to default on plan exit`, { level: "warn" });
        }
    }
    if (gateFallbackNotification) {
        const text = `plan exit → default · ${gateFallbackNotification}`;
        context.addNotification?.({ key: "auto-mode-gate-plan-exit-fallback", text, priority: "immediate", color: "warning", timeoutMs: 10_000 });
        recordSystemMessage({ type: "system", subtype: "notification", key: "auto-mode-gate-plan-exit-fallback", text, priority: "immediate", color: "warning", timeout_ms: 10_000 });
    }

    // Refetch — modal callbacks may have rewritten the context already.
    const current = context.getAppState().toolPermissionContext;
    if (current.mode === "plan") {
        setHasExitedPlanMode(true);
        setNeedsPlanModeExitAttachment(true);

        let restoreMode = current.prePlanMode ?? "default";
        if (restoreMode === "auto" && !(permissionSetupModule?.isAutoModeGateEnabled() ?? false)) {
            restoreMode = "default";
        }
        const finalRestoringAuto = restoreMode === "auto";
        const autoWasUsedDuringPlan = autoModeStateModule?.isAutoModeActive() ?? false;
        autoModeStateModule?.setAutoModeActive(finalRestoringAuto);
        if (autoWasUsedDuringPlan && !finalRestoringAuto) setNeedsAutoModeExitAttachment(true);

        const restoringToAuto = restoreMode === "auto";
        const wasStripped = current.strippedDangerousRules;
        context.setToolPermissionContext(prev => {
            let next = prev;
            if (restoringToAuto) next = permissionSetupModule?.stripDangerousPermissionsForAutoMode(next) ?? next;
            else if (wasStripped) next = permissionSetupModule?.restoreDangerousPermissions(next) ?? next;
            return { ...next, mode: restoreMode, prePlanMode: undefined };
        });
    }

    const hasTaskTool = isAgentSwarmsEnabled() &&
        context.options.tools.some(t => toolMatchesName(t, AGENT_TOOL_NAME));

    return {
        data: {
            plan, isAgent, filePath,
            hasTaskTool: hasTaskTool || undefined,
            planWasEdited: inputPlan !== undefined || undefined,
        }
    };
}

// Mapping: eW→getPlanFilePath, lP→getPlan, l$Y→writeFile, j6→logError, gb8→persistFileSnapshotIfRemote,
//          E→logForDebugging, sv→recordSystemMessage, iL→setHasExitedPlanMode,
//          Km→setNeedsPlanModeExitAttachment, sG→setNeedsAutoModeExitAttachment,
//          qI6→permissionSetupModule, vGK→autoModeStateModule, z4→isAgentSwarmsEnabled,
//          T4→AGENT_TOOL_NAME, e3→toolMatchesName
```

---

## Algorithm Deep Dive: Auto-Mode Gate at Plan Exit

**What it does:** Prevents the session from restoring auto-mode after plan approval if the auto-mode circuit breaker has tripped while the user was planning.

**How it works:**
1. Read `prePlanMode` from the permission context (the mode active *before* `EnterPlanMode`).
2. If `prePlanMode === "auto"` AND `isAutoModeGateEnabled()` returns false:
   - Capture the unavailability reason (`"circuit-breaker"` by default, or a more specific code from `permissionSetup`).
   - Build a user-visible warning: `"plan exit → default · auto mode unavailable"`.
   - Surface it both via the toast queue (`addNotification`) AND the durable transcript (`recordSystemMessage`).
   - Force `restoreMode = "default"`.
3. Independently, check `autoModeStateModule.isAutoModeActive()` — auto mode could have been *deactivated mid-plan* (e.g. `shouldPlanUseAutoMode` flipped the flag), in which case `prePlanMode` lies. The authoritative live signal wins.
4. If auto was active during the plan but won't be after, set `needsAutoModeExitAttachment` so the next user turn includes a "you exited auto mode" notice.
5. Update the permission context: either strip dangerous rules (going to auto) or restore them (going non-auto).

**Why this approach:**
- The gate could trip between plan entry and plan exit. Trusting `prePlanMode` alone would silently re-enable auto-mode despite the circuit breaker.
- Showing the notification both as a toast and a system message is intentional: the toast may be dismissed before the user reads it, but the system message survives in the transcript and the model can see why the mode changed in subsequent turns.
- Stripping/restoring dangerous rules is symmetric: entering plan-from-auto strips them, exiting back to auto strips them again (no-op), exiting to non-auto restores them.

**Trade-offs:**
- Two layers of gate checks (the pre-`setAppState` warning + the inline check during `setToolPermissionContext`) — could be unified, but the pre-check exists so the notification is dispatched *before* state mutates (avoids race with re-renders).

**Key insight:** The line `let finalRestoringAuto = restoreMode === "auto"` after the gate clamp is the moment "we are committing to non-auto" is decided; everything downstream (auto-state toggle, dangerous-rule strip/restore, attachment flag) keys off that single boolean.

---

## Algorithm Deep Dive: Plan File Discovery / Validation

**What it does:** Locates the plan file for the current session/agent and returns its content, with a recovery path for remote sessions where the on-disk file may have evaporated.

**How it works:**

```javascript
// ============================================
// getPlanFilePath / getPlan - Slug-anchored disk lookup
// Location: chunks.97.mjs:1612-1628
// ============================================

// ORIGINAL (for source lookup):
function eW(q) {
    let K = g56(I8());
    if (!q) return F56(aO(), `${K}.md`);
    return F56(aO(), `${K}-agent-${q}.md`)
}
function lP(q) {
    let K = eW(q);
    try { return V8().readFileSync(K, { encoding: "utf-8" }) }
    catch (_) { if (t1(_)) return null; return j6(_), null }
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
    const slug = getPlanSlug(getSessionId());
    if (!agentId) return path.join(getPlansDirectory(), `${slug}.md`);
    return path.join(getPlansDirectory(), `${slug}-agent-${agentId}.md`);
}
function getPlan(agentId) {
    const filePath = getPlanFilePath(agentId);
    try {
        return getFsImplementation().readFileSync(filePath, { encoding: "utf-8" });
    } catch (e) {
        if (isENOENT(e)) return null;
        logError(e);
        return null;
    }
}

// Mapping: eW→getPlanFilePath, lP→getPlan, g56→getPlanSlug, I8→getSessionId,
//          F56→path.join, aO→getPlansDirectory, V8→getFsImplementation, t1→isENOENT, j6→logError
```

1. `getPlanSlug(sessionId)` looks up the word slug from a session cache. On first call, it generates a new slug via `generateWordSlug()` and retries up to 10 times to avoid collision with an existing plan file.
2. `getPlansDirectory()` returns `~/.claude/plans` by default, or `<projectRoot>/<settings.plansDirectory>` if configured and within the project root (the path-traversal check forces it back to the default if it escapes).
3. The full path is `{plansDir}/{slug}.md` for main sessions, or `{plansDir}/{slug}-agent-{agentId}.md` for subagents.
4. `getPlan()` reads the file synchronously. `ENOENT` returns `null` (expected for plan-not-yet-written); other errors are logged and treated as null.

**Why this approach:**
- Slug-based naming gives the plan a memorable URL/filename (e.g., `gilded-tortoise.md`) instead of a UUID. Useful for users browsing plans across sessions.
- The retry-on-collision loop (10 attempts) makes name clashes statistically negligible for small directories.
- Per-call slug lookup (not a cached path) is the v2.1.91 fix — see [remote_sessions.md](./remote_sessions.md).
- Treating `ENOENT` as `null` rather than throwing lets callers proceed gracefully when the model writes a plan to the *expected* path mid-conversation; `getPlan()` returning `null` before the model writes the file is normal.

**Key insight:** The shape `(sessionId, agentId?) → slug-anchored path` makes the plan file *naturally scoped*: clearing a session changes the slug, forking a session keeps the slug but the copyPlanForFork helper generates a new slug for the fork to avoid clobbering.

---

## Algorithm Deep Dive: Approved-Plan Tool Result Shape

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - Build tool_result for the model
// Location: chunks.150.mjs:2263-2313
// ============================================

// READABLE (for understanding):
function mapToolResultToToolResultBlockParam(
    { isAgent, plan, filePath, hasTaskTool, planWasEdited, awaitingLeaderApproval, requestId },
    toolUseID,
) {
    // Teammate awaiting leader approval — verbose blocking message
    if (awaitingLeaderApproval) {
        return {
            type: "tool_result",
            content: `Your plan has been submitted to the team lead for approval.\n\nPlan file: ${filePath}\n\n**What happens next:**\n1. Wait for the team lead to review your plan\n2. You will receive a message in your inbox with approval/rejection\n3. If approved, you can proceed with implementation\n4. If rejected, refine your plan based on the feedback\n\n**Important:** Do NOT proceed until you receive approval. Check your inbox for response.\n\nRequest ID: ${requestId}`,
            tool_use_id: toolUseID,
        };
    }
    // Subagent (Task tool) — silent ack
    if (isAgent) {
        return { type: "tool_result", content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"', tool_use_id: toolUseID };
    }
    // Empty plan — neutral ack
    if (!plan || plan.trim() === "") {
        return { type: "tool_result", content: "User has approved exiting plan mode. You can now proceed.", tool_use_id: toolUseID };
    }
    // Main path: echo plan back. The `## Approved Plan` marker is parsed by
    // extractApprovedPlan() in the Ultraplan CCR poll loop — keep it stable.
    const teamHint = hasTaskTool
        ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.`
        : "";
    return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: ${filePath}\nYou can refer back to it if needed during implementation.${teamHint}\n\n## ${planWasEdited ? "Approved Plan (edited by user)" : "Approved Plan"}:\n${plan}`,
        tool_use_id: toolUseID,
    };
}
```

**Key insight:** Four distinct content shapes for the four states the tool can reach (teammate-pending, subagent-approved, empty-plan-approved, normal-approved). The "Approved Plan" marker is a *contract* with the Ultraplan poll loop: see `extractApprovedPlan()` in [ultraplan_integration.md](./ultraplan_integration.md).

---

## State Flags Set on Approval

| Flag | Setter | Reader | Purpose |
|------|--------|--------|---------|
| `hasExitedPlanMode` | `setHasExitedPlanMode(true)` (`iL`) | `hasExitedPlanModeInSession()` (`_p6`) | Tells next-turn attachment generator + telemetry that an approval has occurred this session |
| `needsPlanModeExitAttachment` | `setNeedsPlanModeExitAttachment(true)` (`Km`) | next-turn attachment injector | Adds a "plan-exit reminder" attachment to the next user message |
| `needsAutoModeExitAttachment` | `setNeedsAutoModeExitAttachment(true)` (`sG`) | next-turn attachment injector | Adds an "auto mode deactivated" notice (only when auto was active mid-plan and is not being restored) |
| `toolPermissionContext.mode` | `setToolPermissionContext` | tool gating, UI | Switched from `"plan"` back to `prePlanMode` (or `"default"` on auto-fallback) |
| `toolPermissionContext.prePlanMode` | `setToolPermissionContext` | symmetry on next plan-mode entry | Cleared to `undefined` after restoration |
| `autoModeStateModule.autoModeActive` | `setAutoModeActive(...)` | live UI + permission checks | Toggled based on `finalRestoringAuto` |

---

## Error Cases

| Case | Detection | User-facing outcome |
|------|-----------|---------------------|
| Model calls `ExitPlanMode` outside plan mode | `validateInput` mode check | Tool result `errorCode: 1` + analytics `tengu_exit_plan_mode_called_outside_plan` |
| `KAIROS_CHANNELS` user (Telegram/Discord) | `isEnabled()` returns false | Tool is not advertised in tools list |
| Empty plan file | `mapToolResultToToolResultBlockParam` plan check | "User has approved exiting plan mode. You can now proceed." (no plan echoed) |
| Auto-mode gate disabled while planning | `permissionSetupModule.isAutoModeGateEnabled()` returns false | Notification + transcript message + fallback to `"default"` |
| Plan file write fails (Ctrl+G edit) | `writeFile(...).catch(logError)` | Error logged; tool continues with in-memory plan |
| Plan file missing on resume | `copyPlanForResume` recovery path | See [remote_sessions.md](./remote_sessions.md) |
| Teammate plan rejected by leader | `InboxPoller` receives `approved: false` | Stays in plan mode; feedback delivered as user message |
| Teammate has no plan file when calling ExitPlanMode | `if (!plan) throw Error(...)` | Tool errors with `"No plan file found at <path>. Please write your plan to this file before calling ExitPlanMode."` |
