# Plan Mode Integration — Agent Teams (v2.1.112)

## Overview

Plan Mode is Claude Code's two-phase execution model where the agent first proposes a plan and waits for human approval before acting. In an Agent Teams context, plan approval is **delegated from the teammate to the team lead**: the teammate cannot approve its own plan; it sends a `plan_approval_request` over the mailbox; the lead surfaces the plan to the user and sends back a `plan_approval_response`.

This document covers:
- How `plan_mode_required` propagates through spawn flows.
- The `awaitingPlanApproval` task field — the teammate's blocking gate.
- Plan approval/rejection message shapes.
- The teammate-side dispatch (intercepts `ExitPlanMode`).
- The leader-side handler (surfaces plan, captures decision).
- Edge cases: plan rejected, teammate retries, multi-plan iteration.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions and fields:
- `plan_mode_required` — input field on `Agent`/spawn tools, propagated as CLI flag `--plan-mode-required`
- `awaitingPlanApproval` — task field (boolean) on `in_process_teammate` records (chunks.100.mjs:1121)
- `plan_approval_request` — message type schema `_b4` (chunks.100.mjs:451)
- `plan_approval_response` — message type schema `zb4` (chunks.100.mjs:458)
- `EJY` — leader-side approve handler (chunks.153.mjs:272)
- `yJY` — leader-side reject handler (chunks.153.mjs:298)
- `Y0z` — derives initial permission mode from `plan_mode_required` (chunks.100.mjs:1073)
- `derivePermissionMode` — same function, readable name

---

## Spawn-Time Propagation

### Tool input

`Agent` and SpawnTeammate tools accept `plan_mode_required: boolean`. When true, the spawn flow:

1. Sets `permissionMode: "plan"` for the new task (instead of `"default"`).
2. Adds `--plan-mode-required` to the CLI args (in pane modes).
3. Records `awaitingPlanApproval: false` initially in the task record (chunks.100.mjs:1121) — the teammate is *required to plan*, but hasn't yet *finished a plan to wait on*.

```javascript
// In spawn dispatchers (j2K / c7Y / l7Y):
const planModeRequired = q.plan_mode_required;
const permissionMode = derivePermissionMode(state.toolPermissionContext.mode, planModeRequired);
                                                    // Y0z: returns "plan" if planModeRequired else state mode
```

### derivePermissionMode (Y0z)

```javascript
// ============================================
// derivePermissionMode - Pin permission to plan mode if required
// Location: chunks.100.mjs:1073-1077
// ============================================

// ORIGINAL (for source lookup):
function Y0z(q, K) {
  if (K) return "plan";
  if (q === "plan" || q === "dontAsk") return "default";
  return q;
}

// READABLE (for understanding):
function derivePermissionMode(currentMode, planModeRequired) {
  if (planModeRequired) return "plan";
  if (currentMode === "plan" || currentMode === "dontAsk") return "default";
  return currentMode;
}

// Mapping: Y0z→derivePermissionMode, q→currentMode, K→planModeRequired
```

The "swap to default if currently plan/dontAsk" branch is interesting: it ensures that a teammate spawned by a leader currently in plan mode (where the leader is itself awaiting approval) doesn't inherit a permission mode that would cause its own request prompts to be deferred. The teammate gets a fresh "default" baseline unless explicitly told otherwise.

> **v2.1.112 behavior change:** v2.1.88's `spawnInProcessTeammate` simply did `permissionMode: planModeRequired ? 'plan' : 'default'` — it always reset to default. v2.1.112's `Y0z` (this `derivePermissionMode`) **inherits** the leader's mode (e.g., `"auto"`, `"acceptEdits"`, `"bypassPermissions"`) unless the leader is itself in `"plan"`/`"dontAsk"`. This means v2.1.112 teammates can start with a more permissive mode if the leader has already escalated. Verified by comparing v2.1.88 `utils/swarm/spawnInProcess.ts:173` vs v2.1.112 `chunks.100.mjs:1124`.

---

## awaitingPlanApproval Field

The task record has a single boolean field:

```typescript
type InProcessTeammateTask = {
  // ...
  permissionMode: "default" | "plan" | "dontAsk";   // current mode
  awaitingPlanApproval: boolean;                     // gate flag
  // ...
};
```

Lifecycle:
- Initialized to `false` by `cI8` (chunks.100.mjs:1121).
- Set to `true` when the teammate's `ExitPlanMode` tool fires and the request is sent.
- Reset to `false` upon receipt of `plan_approval_response` (whether approve or reject).

The flag's primary purpose is **TUI rendering**: the team status renderer shows "(awaiting plan approval)" next to the teammate's spinner row when `awaitingPlanApproval === true`.

The runner's behavior when waiting is *not* gated by this flag — it still polls normally. The flag is a status indicator, not a runtime gate. The actual gating is the worker's local Promise (analogous to permission sync's pendingPromises map): `ExitPlanMode` returns a Promise that resolves only when the matching `plan_approval_response` arrives.

---

## Message Schemas

### plan_approval_request

Schema reference: `_b4` at chunks.100.mjs:450; parser `_J6` at chunks.100.mjs:301.

```typescript
type PlanApprovalRequest = {
  type: "plan_approval_request";
  from: string;                     // teammate's name
  timestamp: string;                // ISO 8601
  planFilePath: string;             // path where the plan was written by the worker
  planContent: string;              // inline plan body (also the file's content at write time)
  requestId: string;                // generated via ph6("plan_approval", agentId)
};
```

Note: field names are **camelCase** (`requestId`, `planContent`, `planFilePath`), not snake_case. The plan is both:
- **Written to a file** at `planFilePath` (resolved by `eW(agentId)` in the worker's session dir).
- **Sent inline** as `planContent`.

Both representations are sent so the leader's UI can render the plan immediately while the file remains available for re-reads (e.g., if the user wants to inspect or edit the plan via Read/Edit tools).

The mailbox-record `from` is the teammate's name; recipient is `"team-lead"` (the constant `Mz`).

### plan_approval_response

Schema reference: `zb4` at chunks.100.mjs:457; parser `ch6` at chunks.100.mjs:325.

```typescript
type PlanApprovalResponse = {
  type: "plan_approval_response";
  requestId: string;                // matches the request
  approved: boolean;                // true = approve, false = reject
  feedback?: string;                // when approved=false, the rejection reason
  timestamp: string;
  permissionMode?: "default" | "plan" | "auto" | "acceptEdits" | "bypassPermissions";
                                    // permission mode the worker should adopt after approval
};
```

The mailbox-record `from` is the leader (`Mz`); recipient is the teammate.

The `permissionMode` field is the **post-approval permission mode**: when the leader approves, it tells the worker what mode to switch into. The leader computes this in `EJY` (chunks.153.mjs:276-277) as:

```javascript
let A = z.toolPermissionContext.mode,
    O = A === "plan" ? "default" : A;          // strip "plan" → "default"
```

So if the leader is itself in plan mode, the approved teammate gets "default" (a sane working baseline), not "plan" (which would re-trigger the approval gate). Otherwise the worker inherits the leader's current mode.

---

## Worker-Side Dispatch

When a teammate is in plan mode and decides it's ready to ask for approval, it calls the `ExitPlanMode` tool (chunks.150.mjs around line 2160). In the team context, ExitPlanMode is intercepted: instead of switching the local permission mode out of "plan", it writes the plan to a file, announces it to the leader via the mailbox, and lets the agent loop continue knowing it's awaiting approval.

The actual flow (pseudocode of chunks.150.mjs:2163-2199):

```javascript
async function exitPlanModeCall(input, ctx) {
  const planArg = "plan" in input && typeof input.plan === "string" ? input.plan : undefined;
  const planFilePath = resolvePlanFilePath(ctx.agentId);          // eW
  const planContent = planArg ?? readPlanFile(ctx.agentId);       // lP

  // 1) If a plan was passed inline, persist it to the plan file
  if (planArg !== undefined && planFilePath) {
    await writeFile(planFilePath, planArg, "utf-8").catch(log);
    notifyPlanFileChanged();                                      // gb8
  }

  // 2) Teammate-mode + plan-mode-required gate
  if (isInTeammateContext() && isPlanModeRequired()) {            // Lz() && Pn6()
    if (!planContent) throw new Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);

    const fromAgentName = getCurrentAgentName() || "unknown";     // T_
    const teamName = getCurrentTeamName();                        // Z9
    const requestId = makeMessageId("plan_approval", deriveAgentId(fromAgentName, teamName)); // ph6
    const envelope = {
      type: "plan_approval_request",
      from: fromAgentName,
      timestamp: new Date().toISOString(),
      planFilePath,
      planContent,
      requestId,
    };

    await writeToMailbox("team-lead", {                           // F_(Mz, ...)
      from: fromAgentName,
      text: JSON.stringify(envelope),
      timestamp: new Date().toISOString(),
    }, teamName);

    // 3) Mark the task as awaiting approval (so the TUI shows it)
    const taskRecord = lookupTeammateTask(fromAgentName, ctx.getAppState());      // Jd8
    if (taskRecord) markAwaitingPlanApproval(taskRecord, ctx.taskRegistry, true); // J37

    // 4) Return a tool result that signals "awaiting" — the agent loop continues
    return {
      data: {
        plan: planContent,
        isAgent: true,
        filePath: planFilePath,
        awaitingLeaderApproval: true,
        requestId,
      }
    };
  }

  // ...standalone path: switch local permission mode out of "plan" and proceed
}
```

Three notable details vs my earlier description:

1. **The plan is written to a file**, not just transmitted inline. The leader can re-read the file via Read/Edit tools.
2. **`J37` mutates the task record** to set `awaitingPlanApproval: true` (via `taskRegistry.update(...)`), which is what the TUI reads.
3. **The tool returns immediately with `awaitingLeaderApproval: true`** — the worker doesn't block in `await pendingPromise`. Instead, the agent loop pauses naturally because subsequent tool calls would hit the still-restrictive `permissionMode: "plan"` gate. When the response arrives, the worker's plan_approval_response handler updates `permissionMode` (to whatever the leader sent), unsticking the loop.

So the "block until response" framing in my earlier pseudocode was a simplification. The actual mechanism is: ExitPlanMode returns the awaiting marker → agent loop continues → permission gate keeps blocking → response arrives → permission mode flips → agent loop unblocks.

### Why intercept ExitPlanMode instead of building a separate tool?

ExitPlanMode is the natural protocol for "I have a plan, please approve". A teammate's plan flow should *feel* identical to a standalone Claude's flow — write a plan, call ExitPlanMode, wait for human. The interception means:
- Custom agent definitions don't need teammate-specific instructions.
- The model uses its existing knowledge of plan mode without retraining.
- The tool surface stays small.

---

## Leader-Side Handlers

When the leader's mailbox poll picks up a `plan_approval_request`, the TUI surfaces a plan-review modal (similar to standalone plan mode). The user clicks Approve or Reject.

### Approve (EJY)

```javascript
// Location: chunks.153.mjs:272-296
// Triggered by SendMessage with message: {type: "plan_approval_response", approve: true, request_id}
async function approveTeammatePlan(workerName, requestId, ctx) {
  const team = ctx.getAppState().teamContext?.teamName;
  if (!team) return errorResult("no team");
  await writeToMailbox(workerName, {
    from: "team-lead",
    text: JSON.stringify({
      type: "plan_approval_response",
      request_id: requestId,
      approve: true,
    }),
    timestamp: new Date().toISOString(),
  }, team);
  return { data: { success: true } };
}
```

### Reject (yJY)

```javascript
// Location: chunks.153.mjs:298-324
// Triggered by SendMessage with message: {type: "plan_approval_response", approve: false, request_id, feedback}
async function rejectTeammatePlan(workerName, requestId, feedback, ctx) {
  const team = ctx.getAppState().teamContext?.teamName;
  if (!team) return errorResult("no team");
  await writeToMailbox(workerName, {
    from: "team-lead",
    text: JSON.stringify({
      type: "plan_approval_response",
      request_id: requestId,
      approve: false,
      feedback: feedback || "Plan needs revision",
    }),
    timestamp: new Date().toISOString(),
  }, team);
  return { data: { success: true } };
}
```

The leader-side handlers are minimal — they shape the response and write to the worker's mailbox. The decision logic lives in the leader's TUI plan-approval modal.

---

## Round-Trip Sequence

```
Teammate (worker)                       Team Lead
────────────────                        ─────────
  in plan mode (permissionMode="plan")
  agent loop runs, model writes plan
  model calls ExitPlanMode(plan)
       │
       │  → intercepted as team-mode handler
       │     awaitingPlanApproval = true
       │     send plan_approval_request to leader's inbox
       │
       │  ─── leader poll picks up ───►
       │                                      mailbox parsing detects plan_approval_request
       │                                      TUI surfaces plan modal
       │                                      user reviews plan
       │                                         │
       │                                         ▼
       │                                      user clicks Approve or Reject
       │                                      SendMessage tool fires:
       │                                        plan_approval_response (approve=T/F, feedback?)
       │                                      EJY/yJY → F_ writes worker's inbox
       │   ◄─── plan_approval_response ──────
       │
  worker poll picks up
  parsePermissionResponse-equivalent for plan
  resolve pendingPlanApprovals[request_id](decision)
       │
       │  awaitingPlanApproval = false
       │
       ├─ if approve:
       │      ExitPlanMode returns success
       │      permissionMode = "default"
       │      next turn: model executes plan
       │
       └─ if reject:
              ExitPlanMode returns {approved: false, feedback}
              model receives feedback as tool result
              next turn: model revises plan, calls ExitPlanMode again
```

---

## Iteration: Multi-Plan Approval

A rejection isn't terminal. The worker's model receives the feedback as the tool's result text, formats a revised plan, and calls ExitPlanMode again. Each cycle:
- Generates a fresh `request_id`.
- Sets `awaitingPlanApproval: true` again.
- Goes through the round-trip.

There's no max-iteration limit at the protocol level. The user can keep rejecting until satisfied. If the user wants to abort the planning loop entirely, they can either:
- Send a plain text message instructing the teammate to stop planning ("forget the plan, just answer the question").
- Send a `shutdown_request`.

---

## Plan Approval vs Permission Sync

Two superficially similar protocols:

| Aspect | Plan approval | Permission sync |
|--------|---------------|-----------------|
| Trigger | Worker calls ExitPlanMode | Worker calls a tool needing approval |
| Worker-side blocking | `pendingPlanApprovals` map | `pendingPermissions` map |
| Per-turn? | Once per plan | Once per tool invocation |
| Latency expectation | Long (user reads plan) | Short (user clicks Allow) |
| Failure-on-reject | New plan iteration | canUseTool returns deny |
| Carries updated input? | No (plan is text, not args) | Yes (permission_updates can rewrite) |

The two protocols are intentionally distinct so the leader-side TUI can present them differently — a plan modal is a multi-line preview with "Approve / Reject + feedback" actions; a permission prompt is a one-line "Allow / Deny / Always allow" choice.

---

## Edge Case: Teammate Spawned Inside an Already-Pending Plan

When the leader is itself in plan mode awaiting approval, and the user spawns a teammate, what mode does the teammate get?

`Y0z`'s second branch: "if the parent's mode is `plan` or `dontAsk`, the teammate's default is `default`." So the teammate **does not inherit** plan mode. This prevents a deadlock where the teammate would also need approval, but the leader (who normally approves) is itself stuck.

Override: passing `plan_mode_required: true` explicitly puts the teammate in plan mode anyway. In that scenario, the teammate's plan request would queue in the leader's inbox, but the leader (paused in its own plan modal) wouldn't see it until its own approval flow completes. The user would have to manually surface the teammate's queued plan after approving their own.

---

## Edge Case: Teammate Crash During Approval

If the worker crashes after sending the request but before receiving the response:
- The leader's plan modal still surfaces.
- The user clicks Approve or Reject.
- The leader writes the response to the worker's inbox.
- The worker is dead; no one consumes the response.
- On next worker spawn (with a fresh `request_id`), the stale response is harmless — the new worker has no matching pending Promise.

The stale `plan_approval_response` stays in the inbox as a `read: false` record. On the new worker's first poll, Priority 4 picks it up as an unread message. The runner has no special handling for an out-of-band plan_approval_response (it's not a structured message the runner peer-decodes), so it's delivered as a plain text user message. The model receives JSON-as-text and typically ignores or comments on it.

This is a tolerable failure mode — the cost is one confused turn at most.

---

## Why Not Auto-Approve in Some Cases?

A potential optimization: if `permissionMode` is `default` already (no plan required), skip the approval round-trip. But:
- `plan_mode_required: true` was passed for a reason — the user wants to review.
- An auto-approve path would diverge from the standalone plan mode protocol.

The current design errs on the side of consistency.

---

## Why Not Surface the Plan Asynchronously?

Some teams might want the leader to forward the plan to a third reviewer (e.g., another teammate). The current protocol routes everything through the leader. A third-party-review variant would need:
- New message types (`plan_approval_forward`).
- Forwarder logic in the leader.
- The reviewer would need its own TUI surface.

This is doable but not implemented in v2.1.112. The single-leader model is the simplest correct design.

---

## Summary

Plan mode integration is a focused subsystem: a single boolean field on the task record (`awaitingPlanApproval`), two message types (`plan_approval_request`/`plan_approval_response`), and two leader-side dispatchers (`EJY` approve, `yJY` reject). The teammate's `ExitPlanMode` tool is intercepted to trigger the round-trip; the leader's TUI presents a plan modal; iteration is unbounded; failures degrade gracefully to "the new worker ignores stale responses".
