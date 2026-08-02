# Plan Mode lifecycle and approval runtime in 2.1.220

This document re-anchors the complete Plan Mode state machine in the **2.1.220 bundle**. It does not
assume that a 2.1.193 report remains correct merely because the public strings look similar.

The authoritative source is
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`. The 2.1.193 bundle is
used to distinguish stable machinery from 2.1.220 changes. The readable files under
`/lyz/codespace/3rd/claude-code/src/` corroborate semantic names and design intent but do not supply
2.1.220 obfuscated identifiers.

---

## 1. State model

Plan Mode is a temporary projection over the permission context, not a separate agent loop. Its
minimum persistent state is:

- `mode: "plan"` — the active permission mode and the source of the read-only permission floor;
- `prePlanMode` — the prior mode to restore after approval;
- `strippedDangerousRules` — permissions removed while auto semantics are active;
- module-global `hasExitedPlanMode` — one-shot re-entry guidance when a plan file survives;
- module-global `needsPlanModeExitAttachment` — one-shot transcript notice that actions are allowed;
- module-global auto-mode active/exit state — tracks whether classifier-backed auto semantics remain
  active while planning;
- the disk-backed plan file — the artifact shared by the model, terminal UI, teammate approval, remote
  refinement, context-clear handoff, and later implementation.

The lifecycle is:

1. `EnterPlanMode` asks for permission.
2. The authoritative call captures/restores permission information and changes mode to `plan`.
3. Attachments repeatedly inject the planning contract while the normal agent loop continues.
4. The model may write only the plan file (plus a specifically granted workshop document in the 220
   workshop branch) and otherwise uses read-only tools.
5. `ExitPlanMode` validates the state, reads the artifact, and opens the approval surface—or sends a
   teammate plan request to the lead.
6. Approval restores the prior safe mode, selects a different explicit mode, or creates a
   context-cleared implementation continuation.
7. One-shot exit/re-entry attachments synchronize the model's transcript understanding with the
   permission-context transition.

---

## 2. Entry and prior-mode preservation

### Enter Plan Mode transition

**What it does:** Moves a top-level session into the read-only planning phase without losing the mode
that should be restored after approval.

**How it works:**
1. `EnterPlanModeTool` (`IAo`, `:326287`) is deferred, read-only, concurrency-safe, and shares the
   enablement of `ExitPlanMode`. It is unavailable where the corresponding approval surface cannot be
   completed.
2. The call rejects agent contexts. Subagents cannot independently mutate their parent's permission
   phase.
3. `handlePlanModeTransition` (`uOe`, `:3661`) clears a stale exit-notice flag when moving into plan.
4. `prepareContextForPlanMode` (`bdr`, `:529746`) captures the current mode in `prePlanMode` and
   reconciles auto-mode side effects before the mode field is overwritten.
5. The normal permission-update reducer applies `setMode: "plan"` at session scope.
6. The tool result restates the planning workflow, but later transcript attachments—not this one-time
   result—maintain the contract.

**Why this approach:**
- Capturing `prePlanMode` immediately before the mode update makes Plan Mode reversible.
- Reusing the standard permission-update reducer keeps hooks, telemetry, and session-scope semantics
  aligned with ordinary mode changes.
- Rejecting agent contexts prevents a child from creating a local approval UI that its parent cannot
  see or authorize.
- A separate transition flag coordinates transcript notices without polluting the permission context
  with presentation-only state.

**Trade-offs:** The permission UI and tool call both participate in entry. This duplication gives the
UI immediate feedback while keeping the tool call as the authoritative side-effect boundary, but every
entry path must preserve the same ordering.

**Key insight:** `prePlanMode` must be written **before** `mode` becomes `plan`; otherwise exit could
only guess a restore target and would silently collapse every session to `default`.

```javascript
// ============================================
// enterPlanModeCall - Capture prior mode, mark the transition, and set session mode to plan
// Location: cli_inner_pretty.js:326319-326331
// ============================================

// ORIGINAL (for source lookup):
async call(e, t) {
  if (t.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  return (
    uOe(En(t).mode, "plan"),
    t.setToolPermissionContext((r) => YS(bdr(r), { type: "setMode", mode: "plan", destination: "session" })),
    {
      data: {
        message:
          "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
      },
    }
  );
}

// READABLE (for understanding):
async function enterPlanModeCall(_input, context) {
  if (context.agentId) throw new Error("EnterPlanMode tool cannot be used in agent contexts");
  handlePlanModeTransition(getPermissionContext(context).mode, "plan");
  context.setToolPermissionContext(previous =>
    applyPermissionUpdate(prepareContextForPlanMode(previous), {
      type: "setMode",
      mode: "plan",
      destination: "session",
    }),
  );
  return { data: { message: "Entered plan mode. Focus on exploration and implementation design." } };
}

// Mapping: t→context, uOe→handlePlanModeTransition, En→getPermissionContext, YS→applyPermissionUpdate, bdr→prepareContextForPlanMode
```

### Prior-mode and auto-mode preparation

**What it does:** Captures the restore target while ensuring classifier-backed auto behavior cannot
carry unsafe permission rules into Plan Mode.

**How it works:**
1. If already in plan, return unchanged. Repeated entry is idempotent and does not overwrite the
   original `prePlanMode`.
2. If entering from auto and `useAutoModeDuringPlan` is enabled, retain active auto semantics and set
   `prePlanMode: "auto"`.
3. If entering from auto without plan-auto semantics, deactivate auto, schedule an auto-exit notice,
   restore rules previously stripped for auto, and still remember `auto` as the intended restore mode.
4. If entering from a non-bypass mode and plan-auto semantics are enabled, activate auto, strip
   dangerous rules, and record the actual prior mode.
5. If entering from `bypassPermissions`, never activate plan-auto. Record bypass as the prior mode and
   rely on the plan permission floor while planning.
6. Settings changes during plan call `transitionPlanAutoMode` (`Bcn`, `:529762`) to reconcile desired
   and actual auto state without losing `prePlanMode`.

**Why this approach:**
- “Auto while planning” is a classifier behavior, not permission to execute arbitrary writes. Stripped
  allow rules keep classifier adjudication reachable.
- Bypass mode is excluded because activating auto on top of an intentionally unrestricted origin
  would blur which safety model owns the session.
- Runtime reconciliation is needed because feature gates and settings can change during a long plan.

**Trade-offs:** Three related values—`prePlanMode`, `strippedDangerousRules`, and global auto-active
state—must remain consistent. The redundancy allows safe restoration after mid-plan settings changes,
but makes exit revalidation essential.

**Key insight:** `prePlanMode: "auto"` expresses a desired destination, not authority to re-enable
auto later. Exit must ask whether auto remains available at that later moment.

```javascript
// ============================================
// prepareContextForPlanMode - Preserve the prior mode and reconcile plan-auto side effects
// Location: cli_inner_pretty.js:529746-529760
// ============================================

// ORIGINAL (for source lookup):
function bdr(e) {
  let t = e.mode;
  if (t === "plan") return e;
  if (t === "auto") {
    if (xUo()) return { ...e, prePlanMode: "auto" };
    return ($N(!1), c8(!0), { ...gRe(e), prePlanMode: "auto" });
  }
  if (t !== "bypassPermissions") {
    let r = Kfn(e);
    if (r) return { ...r, prePlanMode: t };
  }
  return (
    w(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${t}`, { level: "info" }),
    { ...e, prePlanMode: t }
  );
}

// READABLE (for understanding):
function prepareContextForPlanMode(context) {
  const previousMode = context.mode;
  if (previousMode === "plan") return context;
  if (previousMode === "auto") {
    if (shouldPlanUseAutoMode()) return { ...context, prePlanMode: "auto" };
    setAutoModeActive(false);
    setNeedsAutoModeExitAttachment(true);
    return { ...restoreDangerousPermissions(context), prePlanMode: "auto" };
  }
  if (previousMode !== "bypassPermissions") {
    const activated = activatePlanAutoMode(context);
    if (activated) return { ...activated, prePlanMode: previousMode };
  }
  return { ...context, prePlanMode: previousMode };
}

// Mapping: bdr→prepareContextForPlanMode, e→context, t→previousMode, xUo→shouldPlanUseAutoMode, $N→setAutoModeActive, c8→setNeedsAutoModeExitAttachment, gRe→restoreDangerousPermissions, Kfn→activatePlanAutoMode
```

---

## 3. Planning-phase enforcement

### Permission floor and write carve-out

**What it does:** Allows exploration and production of the approval artifact while preventing the
implementation from starting before approval.

**How it works:**
1. The active permission context is `mode: "plan"`.
2. The permission pipeline allows strict read-only operations and converts other passthrough decisions
   into an `ask`/denial carrying `Cannot call <tool> while in plan mode.`
3. The 2.1.220 Bash guards prevent sandbox and `acceptEdits` fast paths from returning an unconditional
   allow merely because they are safe in another permission mode.
4. Browser operations use the strict read-only predicate for the plan floor; observable actions such
   as click are not treated as equivalent to passive reads.
5. The prompt grants Write/Edit only for the plan file. In the workshop branch, an explicitly selected
   workshop document becomes a second narrow write target and may be published; all other writes remain
   forbidden.
6. The plan is built incrementally and remains readable after compaction because the full Plan Mode
   attachment is reconstructed.

**Why this approach:** A permission-mode check is enforceable; prompt text alone is not. The prompt
communicates the workflow, while the permission floor catches tool calls that violate it. The file
carve-out turns the plan into a durable artifact without granting implementation access.

**Trade-offs:** A universal plan floor can prompt for tools that are semantically harmless but not
provably read-only. 2.1.220 deliberately chooses classifier adjudication/fail-closed behavior over a
silent write. The workshop exception adds utility but expands the set of paths the permission layer
must recognize precisely.

**Key insight:** Plan Mode is not “no tools.” It is a constrained execution environment: read-only
inspection plus one canonical artifact, enforced in both prompt and permission layers.

The exact 2.1.220 permission branches are analyzed in
[`readonly_auto_allow_198_199.md`](readonly_auto_allow_198_199.md) and
[`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md). The reminder and
workshop carve-out are reconstructed in
[`reminder_prompt_and_compact_runtime.md`](reminder_prompt_and_compact_runtime.md).

---

## 4. Exit request and approval artifact

### Exit validation and plan acquisition

**What it does:** Converts the disk-backed plan into a permission request and ensures every approval
surface reviews the current artifact.

**How it works:**
1. A top-level session must currently be in plan mode. Calling exit outside plan records telemetry and
   returns an error that directs the model back to `EnterPlanMode` or implementation.
2. Teammates bypass local user interaction because their approval is routed to the team lead.
3. `normalizeToolInput` may inject an edited `plan`; otherwise the call reads the agent-specific plan
   file.
4. If the UI supplied an edited plan, ensure the plan directory, persist the new text, and refresh the
   remote file snapshot before continuing.
5. The tool's permission request opens `PlanApprovalDialog` for a top-level interactive session.
6. The tool call later restores the mode as a backstop even if a hook approved the request without
   supplying permission updates.

**Why this approach:** The plan file is the shared source of truth, but the terminal/web UI must allow
last-mile edits. Normalizing the edited text into the tool input makes that change explicit and lets
the call persist it before generating the result.

**Trade-offs:** Two plan representations briefly exist—the disk snapshot and UI input. The `.210`
fix family reduces stale/false-edited behavior, while 2.1.220 still keeps explicit `planWasEdited`
metadata so the tool result can label an actual user edit.

**Key insight:** Approval is attached to a file-backed artifact, not merely to the assistant text that
preceded the tool call. That is what permits editor round trips, team-lead review, context clearing,
remote refinement, and later implementation from the same plan.

### Teammate plan-approval protocol

**What it does:** Routes a required-plan teammate's exit request to the team lead instead of allowing
the teammate to approve itself or opening an invisible local dialog.

**How it works:**
1. Trigger only when the current process is a teammate and `planModeRequired` is true.
2. Require non-empty plan content; otherwise raise a precise missing-plan error naming its expected
   path.
3. Create a request ID from the teammate's deterministic team identity.
4. Write a structured `plan_approval_request` containing sender, timestamp, path, full plan, and
   request ID to the `team-lead` mailbox.
5. Locate the in-process teammate task and set `awaitingPlanApproval: true` so its idle/eviction logic
   knows approval is pending.
6. Return an `awaitingLeaderApproval` tool result instructing the teammate not to implement yet.
7. The lead later sends a `plan_approval_response`; the teammate mailbox consumer applies the mode and
   clears the waiting flag only if the task is still awaiting approval.

**Why this approach:** Approval authority belongs to the lead/user boundary. The mailbox makes the
same protocol work for pane and in-process teammates, while the task flag supplies local lifecycle
visibility.

**Trade-offs:** The plan content is duplicated into the control frame for reliable review even though
the file path is shared. This costs mailbox space but prevents a race where the file changes before the
lead reads it.

**Key insight:** Teammate exit is an asynchronous state, not a successful local transition. The
teammate remains in plan mode until a matching lead response is consumed.

```javascript
// ============================================
// requestLeaderPlanApproval - Send the current teammate plan to the team lead and arm wait state
// Location: cli_inner_pretty.js:326048-326068
// ============================================

// ORIGINAL (for source lookup):
if (oy() && F5r()) {
  if (!u)
    throw new pxs(
      `No plan file found at ${l}. Please write your plan to this file before calling ExitPlanMode.`,
    );
  let m = Qv() || "unknown",
    g = om(),
    y = x7n("plan_approval", zCe(m, g || "default")),
    _ = {
      type: "plan_approval_request",
      from: m,
      timestamp: new Date().toISOString(),
      planFilePath: l,
      planContent: u,
      requestId: y,
    };
  await VT("team-lead", { from: m, text: Ie(_), timestamp: new Date().toISOString() }, g);
  let E = t.getAppState(),
    A = Cid(m, E);
  if (A) VCs(A, t.taskRegistry, !0);
  return { data: { plan: u, isAgent: !0, filePath: l, awaitingLeaderApproval: !0, requestId: y } };
}

// READABLE (for understanding):
if (isTeammate() && isPlanModeRequired()) {
  if (!plan) throw new MissingPlanError(planFilePath);
  const agentName = getAgentName() || "unknown";
  const teamName = getTeamName();
  const requestId = generateRequestId("plan_approval", makeAgentId(agentName, teamName || "default"));
  const request = { type: "plan_approval_request", from: agentName, timestamp: new Date().toISOString(), planFilePath, planContent: plan, requestId };
  await writeToMailbox("team-lead", { from: agentName, text: jsonStringify(request), timestamp: new Date().toISOString() }, teamName);
  const taskId = findInProcessTeammateTaskId(agentName, context.getAppState());
  if (taskId) setAwaitingPlanApproval(taskId, context.taskRegistry, true);
  return { data: { plan, isAgent: true, filePath: planFilePath, awaitingLeaderApproval: true, requestId } };
}

// Mapping: oy→isTeammate, F5r→isPlanModeRequired, u→plan, l→planFilePath, pxs→MissingPlanError, Qv→getAgentName, om→getTeamName, x7n→generateRequestId, zCe→makeAgentId, VT→writeToMailbox, Ie→jsonStringify, Cid→findInProcessTeammateTaskId, VCs→setAwaitingPlanApproval
```

---

## 5. Approval choices and implementation handoff

### Exit option construction and normalization

**What it does:** Presents modes of implementation and reduces UI choices into either an allow result,
a denied continuation with feedback, a context-clear handoff, or remote refinement.

**How it works:**
1. `buildExitOptions` (`QYf`, `:761110`) chooses options from three facts: whether context clearing is
   offered, whether auto is available, and whether bypass mode is available.
2. Every non-empty plan can be approved while keeping context with `bypassPermissions`, `auto`,
   `acceptEdits`, or `default`, subject to availability.
3. When configured, clear-context variants report token usage and choose bypass, auto, or accept-edits
   for the new context.
4. If remote Ultraplan is available, “No, refine … on the web” launches refinement instead of
   approving.
5. “No, keep planning” returns denial plus typed feedback and optional pasted images.
6. `buildPlanApprovalAnswer` (`e7f`, `:761160`) includes `updatedInput.plan` only after a real local edit,
   preventing an unchanged display copy from being mislabeled as edited.
7. The 2.1.220 review step may publish a shareable plan artifact before the ordinary approval options;
   editing after publish marks that artifact stale.

**Why this approach:** Plan approval and execution permissions are separate decisions. The user can
approve the design while still choosing how much execution autonomy and how much old context to carry
forward.

**Trade-offs:** The matrix is flexible but large. Normalizing choices in one function prevents each UI
branch from independently constructing subtly different permission updates—the exact class of bug
addressed by the `.210` consolidation.

**Key insight:** “Approve plan” does not imply one fixed permission mode. Approval selects both an
artifact and a handoff policy.

### Context-clear handoff

**What it does:** Starts implementation in a fresh model context while preserving the approved plan,
feedback, transcript recovery path, and selected permission mode.

**How it works:**
1. Build an auto-continuation message beginning `Implement the following plan:` and embed the current
   plan.
2. Append the prior transcript path so exact details can be recovered if the fresh context needs them.
3. Append optional task-tool guidance and user feedback.
4. Store this as `initialMessage` with `clearContext: true`, the selected implementation mode, and a
   separate `planContent` field.
5. Mark the session as having exited plan mode.
6. Return `behavior: "deny"` for the current deferred request; the denial is control flow, not plan
   rejection—the new context executes the continuation.

**Why this approach:** A long exploration/planning context can consume much of the window and pollute
implementation with obsolete branches. Clearing it recovers capacity while the explicit plan carries
forward the chosen design.

**Trade-offs:** The fresh context loses incidental details. Embedding the plan and transcript path
provides selective recovery without paying to replay everything.

**Key insight:** The permission denial in this branch means “do not finish this tool call in the old
context,” not “the user rejected the plan.”

---

## 6. Exit restoration and safety revalidation

### Restore prior mode after approval

**What it does:** Leaves `plan`, restores the intended prior permission mode when still safe, repairs
auto-mode rule state, and schedules transcript notices.

**How it works:**
1. Only run the restoration if the context is still `plan`; UI/hook paths may already have transitioned
   it.
2. Set `hasExitedPlanMode` and `needsPlanModeExitAttachment`.
3. Choose `prePlanMode ?? "default"`.
4. If that target is auto but its gate/circuit breaker is now off, downgrade to default and notify the
   user.
5. Set the global auto-active flag to whether the final target is auto. If auto was active during plan
   but is not the target, request an auto-exit attachment.
6. Record the `plan → target` transition.
7. When restoring auto, strip dangerous rules again. When restoring a non-auto target from a context
   with stripped rules, restore them.
8. Write the final mode and clear `prePlanMode`.

**Why this approach:** Safety state may change between entry and approval. Restoring a stale auto target
without rechecking the gate would bypass the very circuit breaker that disabled auto.

**Trade-offs:** The final mode can differ from what was active before planning. That surprise is made
explicit through the immediate warning and is preferable to restoring an unavailable safety regime.

**Key insight:** Exit is a compare-and-revalidate transition, not a blind stack pop.

```javascript
// ============================================
// restoreModeAfterPlanApproval - Revalidate auto, repair rules, and clear prePlanMode
// Location: cli_inner_pretty.js:326092-326112
// ============================================

// ORIGINAL (for source lookup):
let p = En(t);
if (p.mode === "plan") {
  (EK(!0), Sue(!0));
  let m = p.prePlanMode ?? "default";
  {
    if (m === "auto" && !(s?.isAutoModeGateEnabled() ?? !1)) m = "default";
    let _ = m === "auto",
      E = i?.isAutoModeActive() ?? !1;
    if ((i?.setAutoModeActive(_), E && !_)) c8(!0);
  }
  _be({ from: "plan", to: m, trigger: "exit_plan_mode" });
  let g = m === "auto",
    y = p.strippedDangerousRules;
  t.setToolPermissionContext((_) => {
    let E = _;
    if (g) E = s?.stripDangerousPermissionsForAutoMode(E) ?? E;
    else if (y) E = s?.restoreDangerousPermissions(E) ?? E;
    return { ...E, mode: m, prePlanMode: void 0 };
  });
}

// READABLE (for understanding):
const permissionContext = getPermissionContext(context);
if (permissionContext.mode === "plan") {
  setHasExitedPlanMode(true);
  setNeedsPlanModeExitAttachment(true);
  let restoreMode = permissionContext.prePlanMode ?? "default";
  if (restoreMode === "auto" && !autoGate.isEnabled()) restoreMode = "default";
  const restoringAuto = restoreMode === "auto";
  const autoWasActive = autoState.isActive();
  autoState.setActive(restoringAuto);
  if (autoWasActive && !restoringAuto) setNeedsAutoModeExitAttachment(true);
  recordPermissionTransition("plan", restoreMode, "exit_plan_mode");
  context.setToolPermissionContext(current => {
    const repaired = restoringAuto
      ? autoGate.stripDangerousPermissions(current)
      : permissionContext.strippedDangerousRules
        ? autoGate.restoreDangerousPermissions(current)
        : current;
    return { ...repaired, mode: restoreMode, prePlanMode: undefined };
  });
}

// Mapping: t→context, En→getPermissionContext, p→permissionContext, EK→setHasExitedPlanMode, Sue→setNeedsPlanModeExitAttachment, m→restoreMode, s→autoGate, i→autoState, c8→setNeedsAutoModeExitAttachment, _be→recordPermissionTransition
```

---

## 7. Result branches

After the state transition, `ExitPlanMode` maps the outcome into four distinct model-visible results:

1. **Awaiting leader approval** — explains the asynchronous mailbox protocol and forbids proceeding.
2. **Agent context approved** — tells a one-shot agent there is nothing else to do and to return `ok`.
3. **Empty plan approved** — permits proceeding without echoing an artifact.
4. **Non-empty plan approved** — states that coding may begin, gives the saved file path, optionally
   recommends task delegation, and echoes either `Approved Plan` or `Approved Plan (edited by user)`.

Echoing the artifact makes the approval boundary survive later message processing, but it increases
tokens. The file path is retained as the durable reference so implementation does not depend solely on
the echoed copy.

---

## 8. Cross-version verification

| Concern | 2.1.220 bundle | 2.1.193 bundle | Readable source | Conclusion |
|---|---|---|---|---|
| Entry and `prePlanMode` capture | `IAo` + `bdr`, `:326287`, `:529746` | Same state machine under `Z5n` + `Pmt` | `EnterPlanModeTool.ts`, `permissionSetup.ts` match ordering | Stable core, re-anchored in 220 |
| Exit artifact and teammate request | `S6`, `:325968-326173` | Same plan-file/team branch | `ExitPlanModeV2Tool.ts` names the same protocol | Stable core with 220 hardening |
| Auto restore | gate revalidation and born-in-plan activation in 220 | older auto-plan reconciliation, without all 220 guards | named source explains circuit-breaker rationale | 220 bundle owns exact safety branches |
| Local approval choices | consolidated `e7f`; review/publish step; session naming | four repeated builder call sites; no review-artifact step | UI source corroborates choice semantics | 220 expanded and consolidated UI |
| Context-clear handoff | `:761523-761569` | equivalent core handoff | named UI/Exit tool corroborate artifact strategy | Stable design, 220 exact branches |
| Permission floor | strict browser predicate plus Bash/fast-path plan guards | missing the 220 fixes | permission source corroborates intent | 220 security behavior is authoritative |

The readable source supplies especially strong semantic confirmation for `EnterPlanModeTool`,
`ExitPlanModeV2Tool`, `prepareContextForPlanMode`, and `handlePlanModeTransition`. The 2.1.220 bundle is
still the sole source of exact symbol identity and of which safeguards/review features ship in 220.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `EnterPlanModeTool` (`IAo`) - deferred entry tool and authoritative transition call
- `ExitPlanModeV2Tool` (`S6`) - validation, approval protocol, restoration, and result mapping
- `prepareContextForPlanMode` (`bdr`) - prior-mode capture and entry-time auto reconciliation
- `transitionPlanAutoMode` (`Bcn`) - mid-plan auto settings reconciliation
- `handlePlanModeTransition` (`uOe`) - exit-attachment flag transition
- `setHasExitedPlanMode` (`EK`) - one-shot re-entry state
- `setNeedsPlanModeExitAttachment` (`Sue`) - one-shot post-exit state
- `findInProcessTeammateTaskId` (`Cid`) - resolve teammate task for approval wait state
- `setAwaitingPlanApproval` (`VCs`) - arm/disarm in-process approval wait
- `buildPlanApprovalAnswer` (`e7f`) - normalize UI choice to permission result
- `PlanApprovalDialog` (`znl`) - approval, feedback, editor, publish, and handoff UI
- `writeToMailbox` (`VT`) - teammate approval transport
