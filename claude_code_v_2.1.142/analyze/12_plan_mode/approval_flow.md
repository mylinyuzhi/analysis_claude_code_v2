# Plan Mode Approval Flow (v2.1.142)

> The end-to-end state machine for the user-facing plan approval lifecycle: prompt → plan-file write → `ExitPlanMode` tool call → permission modal → mode restoration. Includes auto-mode gating, plan-file validation, and the v2.1.119/132/136 behavior changes.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions / auto-mode gate

Key functions in this document:
- `ExitPlanModeV2Tool` (obfuscated: `V2`) — Tool object, `cli_inner_pretty.js:381649-381847`
- `getPlanFilePath` (obfuscated: `v2`) — Resolves the slug-anchored plan path, `cli_inner_pretty.js:517657`
- `getPlan` (obfuscated: `HW`) — Reads plan from disk, `cli_inner_pretty.js:517662`
- `persistFileSnapshotIfRemote` (obfuscated: `u38`) — Mirrors plan to transcript in remote sessions, `cli_inner_pretty.js:517750`
- `hasExitedPlanModeInSession` (obfuscated: `HH$`) — Analytics gate
- `setHasExitedPlanMode` (obfuscated: `OT`) — Flips session flag on approval
- `setNeedsPlanModeExitAttachment` (obfuscated: `qh`) — Marks attachment-injection for next turn
- `setNeedsAutoModeExitAttachment` (obfuscated: `MT`) — Marks auto-mode exit attachment
- `permissionSetupModule` (lazy) — Auto-mode gate + dangerous-rule stripping
- `autoModeStateModule` (lazy) — Auto-mode session toggle
- `recordModeTransition` (obfuscated: `vC`) — Mode-transition telemetry hook
- `transitionPlanAutoMode` (obfuscated: `TdH`) — Re-entry auto-mode toggle, `cli_inner_pretty.js:422736`

---

## High-Level State Machine

```
                              ┌────────────────────────────────┐
                              │   user enters plan mode        │
                              │   (Shift+Tab or /plan or       │
                              │    auto-suggestion accept or   │
                              │    EnterPlanMode tool call)    │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ UkH(prepareContextForPlanMode):│
                              │   - branch on prev mode:       │
                              │     • auto + plan-auto: keep   │
                              │     • auto + no plan-auto:     │
                              │       strip + activate=false   │
                              │     • non-auto + plan-auto:    │
                              │       promote to auto-context  │
                              │     • else: just save prePlan  │
                              │   prePlanMode = saved prev     │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ Oo(prev,'plan'):               │
                              │   needsPlanModeExitAttachment  │
                              │   = false (clear stale)        │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ d65 attachment loop (next turn)│
                              │ PDH(sessionId, seed) fixes slug│
                              │ planSlug = computed            │
                              │ planFilePath = {dir}/{slug}.md │
                              │ If HH$()===true && plan exists:│
                              │   emit plan_mode_reentry attch │
                              │   OT(false) reset re-entry flag│
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ model researches, writes plan  │
                              │ via Write/Edit to planFilePath │
                              │ (writes to plan file allowed   │
                              │  via internal-path bypass;     │
                              │  writes to other files blocked │
                              │  by VkH plan-mode floor — NEW  │
                              │  in v2.1.136)                  │
                              │ persistFileSnapshotIfRemote    │
                              │  fires on each write           │
                              └───────────────┬────────────────┘
                                              │
                                              ▼
                              ┌────────────────────────────────┐
                              │ model calls ExitPlanMode       │
                              │ (no `plan` arg in internal     │
                              │  schema; read from disk)       │
                              └───────────────┬────────────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              │                                │
                       teammate? AA() &&                   no — main session
                       h4$()? isPlanModeRequired()             │
                              │                                │
                              ▼                                ▼
                  ┌────────────────────┐         ┌──────────────────────────┐
                  │ plan_approval_     │         │ checkPermissions:        │
                  │ request → leader   │         │ behavior:"ask"           │
                  │ (see hooks_integ…) │         │ → ExitPlanModePermission │
                  └────────────────────┘         │   Request component      │
                                                 └────────────┬─────────────┘
                                                              │
                                                              ▼
                                            ┌──────────────────────────────────┐
                                            │ User picks an option (5 paths):  │
                                            │  • Yes, with auto-accept edits   │
                                            │    (no /clear: ctx preserved)    │
                                            │  • Yes, with auto-accept edits   │
                                            │    + /clear (fresh context)      │
                                            │  • Yes, manually approve edits   │
                                            │  • Yes, with bypass permissions  │
                                            │    (if --dangerously-skip flag)  │
                                            │  • No, keep planning             │
                                            └────────────┬─────────────────────┘
                                                         │
                                              ┌──────────┴──────────┐
                                              │                     │
                                          approve                rejected
                                              │                     │
                                              ▼                     ▼
                                  call() body runs           tool_result with
                                  - OT(true)                 rejection feedback
                                  - qh(true)                 → model revises plan
                                  - restoreMode = X          → loop back
                                  - vC(from:plan,to:X,
                                       trigger:exit_plan_mode)
                                              │
                                              ▼
                                  ┌──────────────────────────────┐
                                  │ permissionSetupModule:       │
                                  │  if restore==auto AND gate   │
                                  │    is off → fallback default │
                                  │    + addNotification(warn)   │
                                  │  if restore===auto:          │
                                  │    strip dangerous rules     │
                                  │  else if stripped flag set:  │
                                  │    restore dangerous rules   │
                                  │  setMode(restoreMode)        │
                                  │  prePlanMode = undefined     │
                                  └──────────────┬───────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │ mapToolResultToToolResult-   │
                                  │ BlockParam: echo plan back   │
                                  │  Label: "Approved Plan" or   │
                                  │  "Approved Plan (edited by   │
                                  │   user)" if planWasEdited    │
                                  └──────────────┬───────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │ Next turn:                   │
                                  │  c65 emits plan_mode_exit    │
                                  │   attachment                 │
                                  │  Model resumes work          │
                                  └──────────────────────────────┘
```

---

## Stage 1: Permission Dialog UI

The `ExitPlanModePermissionRequest` React component (`/lyz/codespace/3rd/claude-code/src/components/permissions/ExitPlanModePermissionRequest/`) presents 5 paths in v2.1.142. The dialog is invoked from the agent loop when `checkPermissions` returns `{ behavior: "ask" }`.

**Dialog source location**: `cli_inner_pretty.js:541393-541590` (the JSX render block) and `cli_inner_pretty.js:541900-542075` (an alternate variant).

### 5 Acceptance Paths

| Path | Outcome | Permission Update |
|------|---------|-------------------|
| **Yes, with auto-accept edits** | Restore to `acceptEdits` mode; plan-mode exits | `setMode acceptEdits, session` |
| **Yes, with auto-accept edits + /clear** | Restore to `acceptEdits` AND wipe conversation context | `setMode acceptEdits, session` + clearTranscript() side-effect |
| **Yes, manually approve edits** | Restore to `default` mode; plan-mode exits | `setMode default, session` |
| **Yes, with bypass permissions** | Restore to `bypassPermissions` mode (requires `--dangerously-skip-permissions`) | `setMode bypassPermissions, session` |
| **No, keep planning** | Reject the `ExitPlanMode` call; model can keep refining | (no update; tool returns `behavior: "deny"`) |

### v2.1.119 Dialog Adjustment

The v2.1.119 changelog entry "Fixed plan acceptance dialog offering 'auto mode' instead of 'bypass permissions' when running with `--dangerously-skip-permissions`" indicates the dialog used to mis-label the 4th path. v2.1.142 carries the corrected label "Yes, with bypass permissions" gated on the `isBypassPermissionsModeAvailable` context flag.

### Auto-Mode Path Conditional Rendering

The auto-mode option ("Yes, accept edits in auto mode") is only rendered when `autoModeStateModule?.isAutoModeActive() === true` AND `permissionSetupModule?.isAutoModeGateEnabled() === true`. If the gate has tripped between plan entry and exit, this option is hidden — the user can't accidentally re-enter a mode that's been revoked.

---

## Stage 2: Plan File Read & Validation

When the user clicks an "accept" option, `permissionResult.updatedInput` flows back into `ExitPlanModeV2Tool.call`. The call body:

```javascript
const inputPlan = 'plan' in input && typeof input.plan === 'string' ? input.plan : undefined;
const plan = inputPlan ?? getPlan(context.agentId);
```

If the user edited the plan in the CCR web UI, `inputPlan` is populated. Otherwise the disk-resident plan is read via `HW(agentId)`. If both are absent (corner case: plan deleted between approval click and call processing), `plan === null` and the tool_result lands in Branch C (empty-plan) with content "User has approved exiting plan mode. You can now proceed."

### Algorithm: Why fallback to "User has approved" instead of erroring?

**What it does:** When the plan is empty, the tool still succeeds with a generic approval message.

**Why:** The user has already approved via the dialog. If the plan vanished, raising an error here would surprise the user ("I just approved!" but the model sees an error). Falling back to a benign success message preserves the user's intent. The model is told to "proceed" without seeing a plan; it can then ask the user for guidance or re-read the file.

**Trade-off:** Silently swallowing a missing plan masks the bug. The compensating telemetry is the on-tool-call logEvent in `validateInput` (the `tengu_exit_plan_mode_called_outside_plan` event captures a related issue) but there's no specific event for "approved with empty plan". Future hardening could add one.

---

## Stage 3: Mode Restoration

The state-setter inside `call`:

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

### Algorithm: Mode Restoration with Strip/Restore Symmetry

**What it does:** Restores the session's `mode` to `prePlanMode` while balancing the dangerous-rule strip/restore pair.

**How it works (step by step):**

1. **Determine `restoreMode`**: read `ctx.prePlanMode ?? 'default'`.
2. **Gate check**: if `restoreMode === 'auto'` but `isAutoModeGateEnabled()` is false, downgrade to `'default'` (notification was already queued earlier in `call`).
3. **Auto-mode state sync**: `autoModeStateModule?.setAutoModeActive(restoreMode === 'auto')`. This drives the `isAutoModeActive()` predicate that downstream features use.
4. **Auto-exit attachment**: if auto was active during plan but we're NOT restoring to auto, set `needsAutoModeExitAttachment = true`. The next turn will render a "you exited auto mode" reminder.
5. **Telemetry**: `recordModeTransition({ from: 'plan', to: restoreMode, trigger: 'exit_plan_mode' })`. This is the canonical mode-transition event consumed by analytics.
6. **Strip/restore dangerous rules**:
   - If `restoringToAuto`: re-strip dangerous rules (auto-mode + dangerous rules = no-op since the classifier handles approval, but the strip keeps the rule set clean).
   - Else if `stripped` flag was set on entry: restore the dangerous rules (the user gets back their full rule set).
7. **Final state**: `{ ...baseContext, mode: restoreMode, prePlanMode: undefined }`. The `prePlanMode` clear is crucial — it signals "we're back to a normal mode" so the next mode transition doesn't think we're still in plan.

**Why this approach:**
- Computing `restoreMode` outside the setter (before `setToolPermissionContext`) lets the gate-fallback notification fire BEFORE the state update, avoiding a render order race.
- The strip/restore symmetry is essential. Without `else if (stripped) restore`, a single plan cycle from `default` mode that crossed auto would silently strip `default`'s rules and never restore them.
- Telemetry fires once per actual transition, not once per re-render.

**Key insight:** The `prePlanMode` clear is the *signal* that this is no longer a plan-mode session. Any subsequent check `prev.prePlanMode === 'auto'` (e.g. by suggestion generators) correctly returns false after this point.

---

## Stage 4: Tool Result & Attachment Cycle

After mode restoration, the tool returns `{ plan, isAgent, filePath, hasTaskTool, planWasEdited }`. `mapToolResultToToolResultBlockParam` produces the tool_result content.

### Branch D Content (Main Path)

```
User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.[${teamHint}]

## Approved Plan[ (edited by user)]:
${plan}
```

The `teamHint` is appended only when `hasTaskTool === true` (i.e. `Agent` tool is available in the current context). This nudges the model toward parallelization via TeamCreate when the plan has independent tasks.

### Plan Mode Exit Attachment

On the next turn, `c65` (`buildPlanModeExitAttachment`, `cli_inner_pretty.js:397750-397758`) detects `needsPlanModeExitAttachment` is true (set by `qh(true)` in `call`):

```javascript
// ============================================
// buildPlanModeExitAttachment - Emit plan_mode_exit reminder on next turn
// Location: cli_inner_pretty.js:397750-397758
// ============================================

// ORIGINAL (for source lookup):
async function c65(H, $) {
  if ($.getAppState().toolPermissionContext.mode === "plan") return (qh(!1), []);
  let { foundPlanModeAttachment: K } = bs7(H ?? []);
  if (!Cv8() && !K) return [];
  qh(!1);
  let _ = v2($.agentId), A = HW($.agentId) !== null;
  return [{ type: "plan_mode_exit", planFilePath: _, planExists: A }];
}

// READABLE (for understanding):
async function buildPlanModeExitAttachment(messages, context) {
  // Guard: if we're STILL in plan mode (e.g. re-entered immediately), clear flag and skip
  if (context.getAppState().toolPermissionContext.mode === 'plan') {
    setNeedsPlanModeExitAttachment(false);
    return [];
  }
  const { foundPlanModeAttachment } = countTurnsSinceLastPlanAttachment(messages ?? []);
  // Only emit if the flag is set OR there's an active plan_mode attachment that needs sealing
  if (!getNeedsPlanModeExitAttachment() && !foundPlanModeAttachment) return [];
  setNeedsPlanModeExitAttachment(false);  // one-shot
  const planFilePath = getPlanFilePath(context.agentId);
  const planExists = getPlan(context.agentId) !== null;
  return [{ type: 'plan_mode_exit', planFilePath, planExists }];
}

// Mapping: c65→buildPlanModeExitAttachment, H→messages, $→context,
//          qh→setNeedsPlanModeExitAttachment, Cv8→getNeedsPlanModeExitAttachment,
//          bs7→countTurnsSinceLastPlanAttachment, v2→getPlanFilePath, HW→getPlan
```

### Algorithm: One-Shot Exit Attachment

**What it does:** Emits a single `plan_mode_exit` reminder after plan-mode exit.

**Why one-shot?**
- The model needs to know it exited plan mode so it stops respecting plan-mode's read-only constraints. Renderering the reminder once is enough.
- If multiple turns elapsed without a model response (e.g. user types a long message), the attachment loop guards against duplicate emission via the flag.
- The "still in plan mode" guard at the top handles immediate re-entry: if the model called `ExitPlanMode` (set flag=true), then re-entered plan mode within the same turn (rare but possible via the `/plan` path), the flag is cleared without emitting the exit reminder.

**Why include `planExists` and `planFilePath`?**
- The system reminder text (rendered by `cli_inner_pretty.js:426170-426174`) uses these to tell the model: "The plan file is located at `${planFilePath}` if you need to reference it." Or, if the plan was deleted, "the plan file no longer exists" — guiding the model to re-read from the tool_result instead of from disk.

---

## Stage 5: Re-entry After Exit (v2.1.132)

If the model calls `EnterPlanMode` again after a prior exit in the same session:

1. **EnterPlanMode.call**: throws if `agentId` (subagent guard), then:
   - `Oo(prevMode, 'plan')`: prev is the current restored mode (e.g. `default`). Since `prev !== 'plan'`, this sets `needsPlanModeExitAttachment = false` (clear any stale).
   - `setToolPermissionContext(prev => applyPermissionUpdate(prepareContextForPlanMode(prev), { setMode: plan, session }))`.
2. **UkH (prepareContextForPlanMode)**: this is a re-entry. `prev.mode` is e.g. `default`. The early-exit `if ($ === 'plan') return H` does NOT match here (we're not yet in plan). The flow continues normally.
3. **First `d65` call on next turn**:
   - `HH$()` returns true (sticky flag from prior exit).
   - `HW(agentId)` returns the prior plan content (still on disk).
   - Emit `plan_mode_reentry` attachment carrying the prior plan path.
   - `OT(false)` resets the sticky flag.
   - Append standard `plan_mode` attachment.

### Algorithm: Re-entry Detection

**What it does:** Detects the second (or Nth) entry into plan mode within a session and surfaces the existing plan.

**Why:** Without this, the model would re-enter plan mode and see no signal that a prior plan exists. It would start from scratch, potentially duplicating the prior planning work.

**Key insight (v2.1.132 fix):** Before v2.1.132, the re-entry path could fail silently because:

1. `EnterPlanMode.call` would run, but `setToolPermissionContext` would no-op if the context's `mode` was already a non-plan value with no `prePlanMode`. Some state-setters short-circuited when `prev === computed-next`.
2. The system-reminder cycle would not re-attach the plan-mode reminder because `mode === 'plan'` was technically true but the attachment hadn't been refreshed.

The v2.1.142 implementation ensures `Oo` always emits its flag update and `UkH` always returns a context object (never bails). The `setToolPermissionContext` callback is always invoked. This guarantees re-entry triggers a state-change event that downstream React renders pick up.

---

## Algorithm: Auto-Mode Re-entry (`TdH`)

`TdH` (`transitionPlanAutoMode`, `cli_inner_pretty.js:422736-422746`) is invoked when the user shifts between auto and plan during a session (Shift+Tab cycle, not via the tool).

```javascript
// ============================================
// transitionPlanAutoMode - Re-toggle auto-mode on plan re-entry/exit
// Location: cli_inner_pretty.js:422736-422746
// ============================================

// ORIGINAL (for source lookup):
function TdH(H) {
  if (H.mode === "auto") return bb(H);
  if (H.mode !== "plan") return H;
  if (!H.prePlanMode || H.prePlanMode === "bypassPermissions") return H;
  let $ = jR6(), q = ON?.isAutoModeActive() ?? !1;
  if ($ && q) return bb(H);
  if (!$ && !q) return H;
  if ($) return (ON?.setAutoModeActive(!0), MT(!1), bb(H));
  return (ON?.setAutoModeActive(!1), MT(!0), CQ(H));
}

// READABLE (for understanding):
function transitionPlanAutoMode(ctx) {
  // Coming from auto: promote into auto-mode context
  if (ctx.mode === 'auto') return promoteToAutoModeContext(ctx);
  // Coming from anything-but-plan: no-op
  if (ctx.mode !== 'plan') return ctx;
  // In plan with no prePlanMode (or bypassPermissions which we can't re-toggle): no-op
  if (!ctx.prePlanMode || ctx.prePlanMode === 'bypassPermissions') return ctx;

  const shouldPlanUseAuto = shouldPlanUseAutoMode();
  const autoCurrentlyActive = autoModeStateModule?.isAutoModeActive() ?? false;

  if (shouldPlanUseAuto && autoCurrentlyActive) {
    // Already aligned: promote to auto-context (no state-flag flip needed)
    return promoteToAutoModeContext(ctx);
  }
  if (!shouldPlanUseAuto && !autoCurrentlyActive) {
    return ctx;  // already aligned: not auto
  }
  if (shouldPlanUseAuto) {
    // Should be auto but isn't active: activate + promote, clear pending auto-exit attachment
    autoModeStateModule?.setAutoModeActive(true);
    setNeedsAutoModeExitAttachment(false);
    return promoteToAutoModeContext(ctx);
  }
  // shouldPlanUseAuto is false but auto IS active: deactivate + strip dangerous, queue auto-exit reminder
  autoModeStateModule?.setAutoModeActive(false);
  setNeedsAutoModeExitAttachment(true);
  return stripDangerousPermissionsForAutoMode(ctx);
}

// Mapping: TdH→transitionPlanAutoMode, H→ctx, $→shouldPlanUseAuto, q→autoCurrentlyActive,
//          jR6→shouldPlanUseAutoMode, ON→autoModeStateModule, MT→setNeedsAutoModeExitAttachment,
//          bb→promoteToAutoModeContext, CQ→stripDangerousPermissionsForAutoMode
```

### Algorithm: 4-Way Alignment

**What it does:** Reconciles the `(shouldPlanUseAutoMode, isAutoModeActive)` boolean pair and applies the right transition.

**Why so many branches?** The two booleans give 4 combinations:

| `shouldPlanUseAuto` | `autoActive` | Action |
|---------------------|--------------|--------|
| true | true | Aligned — promote (no state flip) |
| false | false | Aligned — no-op |
| true | false | Misaligned (should be auto but isn't) → activate + promote |
| false | true | Misaligned (auto running but shouldn't be) → deactivate + strip |

Each misalignment branch also queues the appropriate exit-attachment reminder so the model is informed on the next turn.

**Key insight:** `TdH` is called from `applyPermissionUpdate` mode-change paths (Shift+Tab cycling, `/plan` slash-command). It is NOT called from `EnterPlanModeTool.call` or `ExitPlanModeV2Tool.call` — those use the more conservative `UkH` (prepareContextForPlanMode) which keeps `prePlanMode` intact.

---

## Approval Outcome Semantics

| User Choice | Tool Result Behavior | Subsequent Mode |
|-------------|---------------------|-----------------|
| Yes, auto-accept (preserve ctx) | `allow` + updatedInput; full plan echoed | `acceptEdits` |
| Yes, auto-accept + /clear | `allow` + updatedInput; tool_result preserved; transcript cleared mid-tool | `acceptEdits` |
| Yes, manual approve | `allow` + updatedInput; full plan echoed | `default` |
| Yes, bypass permissions | `allow` + updatedInput; full plan echoed | `bypassPermissions` |
| No, keep planning | `deny` with feedback message | Stays in `plan` |

### Algorithm: "Yes + /clear" Mid-Tool Transcript Wipe

The `/clear` path is special: the user wants a fresh context but should keep the plan reference. The implementation (`cli_inner_pretty.js` around the permission-result dispatch) does:

1. Capture the plan text and tool_result content BEFORE clearing.
2. Clear the transcript via the `clearSessionCaches` path.
3. Inject the captured tool_result as the seed message of the cleared transcript.
4. Set `mode = 'acceptEdits'`.

This produces a clean transcript where the first non-system message is the plan approval. The model sees no prior conversation but has the full plan to work from.

---

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| Dialog 5-paths | yes | yes | Identical |
| Auto-mode option visibility gating | yes | yes | Identical |
| Bypass-permissions label fix | (pre-v2.1.119 may have shown auto-mode) | Correct label | **v2.1.119 fix is present** |
| Plan-file read fallback | inputPlan ?? disk | Same | Identical |
| Mode restoration with strip/restore | yes | yes | Identical |
| Auto-mode gate fallback on exit | yes (v2.1.112 addition) | yes | Identical |
| Tool result echoes plan | yes | yes | Identical |
| `planWasEdited` label | yes | yes | Identical |
| `plan_mode_exit` attachment one-shot | yes | yes | Identical |
| Re-entry attachment | yes (HH$ check) | yes (now reliably triggered) | **v2.1.132 fix makes this work reliably** |
| `/clear` path mid-tool | yes | yes | Identical |
| `TdH` (transitionPlanAutoMode) | present | present | Identical |

The v2.1.132 fix makes re-entry attachments reliable (prior behavior would sometimes skip them). The v2.1.119 fix corrects the dialog label. No new acceptance paths or fundamental dialog changes in v2.1.142.

---

## Related

- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) — pre-approval entry path
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — the `call` body
- [implementation.md](./implementation.md) — end-to-end lifecycle
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.119/132/136 deltas
- [hooks_integration.md](./hooks_integration.md) — hook touchpoints during approval
