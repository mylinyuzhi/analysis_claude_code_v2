# Goal lifecycle, proposal consent, and resume

Target anchors: `cli_inner_pretty.js:360797-360866`, `:366326-366555`, `:518489-518544`,
`:561360-561547`, and `:852394-852414`.

## 1. Runtime model

The runtime has three representations of one logical goal:

- A prompt `Stop` hook is the executable evaluator.
- `activeGoal` is transient session state: condition, iteration count, start time, output-token
  baseline, and the most recent rejection reason.
- `goal_status` transcript attachments are durable facts. A sentinel marks manual set/clear; ordinary
  statuses record unmet, met, or impossible evaluations.

This division lets hook execution reuse the mature hook engine while state and transcript consumers
receive typed goal information rather than reverse-parsing hook output.

### Goal Installation

**What it does:** Replaces any existing generic session prompt Stop hook with the requested goal and
initializes matching state and transcript history.

**How it works:**
1. `preflightSessionGoal` rejects restricted hooks and untrusted workspaces.
2. `findSessionGoalPromptHooks` selects only session `Stop` hooks with an empty matcher, prompt type,
   and no skill root. This deliberately excludes command hooks and skill-owned hooks.
3. All selected hooks are removed, enforcing one generic prompt goal per session.
4. A new prompt hook is registered with the goal condition as its prompt.
5. `activeGoal` captures zero iterations, wall-clock start, and the current output-token counter.
6. An unmet sentinel attachment is appended so resume can distinguish an active goal from no goal.
7. Telemetry records the operation without recording goal text.

**Why this approach:**
- Reusing `Stop` hooks avoids a parallel evaluator loop and inherits hook cancellation/error handling.
- Replacement makes the operation idempotent and avoids multiple goals independently blocking stop.
- A dedicated goal object would be simpler to read, but would duplicate hook registration, execution,
  and result semantics.
- The cost is coupling: generic blank-matcher prompt Stop hooks are treated as goal-owned and removed.

**Key insight:** A goal is not merely metadata. Its authoritative executable form is a standard prompt
Stop hook; `activeGoal` exists to attribute that hook's outcomes and calculate metrics.

```javascript
// ============================================
// setSessionGoal - Install one session-scoped goal as a prompt Stop hook
// Location: cli_inner_pretty.js:360823-360837
// ============================================

// ORIGINAL (for source lookup):
function GCr(e, t) {
  let r = yvn();
  if (r !== null) return (Le("goal_set", r.code), r.message);
  let n = Pt();
  for (let i of zCr(t.getAppState(), n)) t.sessionHooksRegistry.remove(n, "Stop", i);
  t.sessionHooksRegistry.add(n, "Stop", "", { type: "prompt", prompt: e });
  let o = { condition: e, iterations: 0, setAt: Date.now(), tokensAtStart: Uw() };
  return (
    t.setAppState((i) => ({ ...i, activeGoal: o })),
    t.applyMessageOp({ type: "append", messages: [f8d(!1, e)] }),
    M("tengu_stop_hook_added", { promptLength: e.length, via: Ae("goal") }),
    ve("goal_set"),
    null
  );
}

// READABLE (for understanding):
function setSessionGoal(condition, context) {
  const blocked = preflightSessionGoal();
  if (blocked !== null) return blocked.message;
  const sessionId = getSessionId();
  for (const hook of findSessionGoalPromptHooks(context.getAppState(), sessionId)) {
    context.sessionHooksRegistry.remove(sessionId, "Stop", hook);
  }
  context.sessionHooksRegistry.add(sessionId, "Stop", "", { type: "prompt", prompt: condition });
  context.setAppState((state) => ({
    ...state,
    activeGoal: { condition, iterations: 0, setAt: Date.now(), tokensAtStart: getOutputTokenCount() },
  }));
  context.applyMessageOp({ type: "append", messages: [createGoalSentinelAttachment(false, condition)] });
  return null;
}

// Mapping: GCr→setSessionGoal, e→condition, t→context, yvn→preflightSessionGoal,
//          zCr→findSessionGoalPromptHooks, Pt→getSessionId, Uw→getOutputTokenCount,
//          f8d→createGoalSentinelAttachment
```

### Stop-Hook Goal Evaluation

**What it does:** Converts ordinary hook results into goal progress, success, or terminal failure while
deciding whether the agent must continue.

**How it works:**
1. Before running Stop hooks, the handler checks the task registry. If background work remains, it
   temporarily removes the matching goal hook and remembers it for `finally` restoration.
2. Hook events are streamed through the normal Stop-hook handler.
3. A matching `hook_success` removes the hook and increments the final iteration count.
4. If the evaluator marks the goal impossible, the handler emits a failed `goal_status`; otherwise it
   emits a met status and updates session metadata.
5. Duration and output-token usage are calculated from `activeGoal` baselines and sent as telemetry
   fields.
6. A matching blocking result increments `activeGoal.iterations`, saves `lastReason`, emits an unmet
   status, and lets the existing continuation machinery drive another turn.
7. `finally` restores a temporarily removed hook even when hook execution throws or is cancelled.

**Why this approach:**
- Background work can itself satisfy the condition. Evaluating before it completes would create a
  false negative and burn an unnecessary continuation turn.
- Temporary removal lets other Stop hooks run normally; a global “skip all hooks” branch would hide
  unrelated safety or workflow checks.
- Streaming goal events keeps UI/session metadata consumers synchronized without teaching them hook
  internals.
- Deferral can delay recognition of an already-satisfied condition, but it avoids the more damaging
  early judgment while relevant work is still in flight.

**Key insight:** Deferral is implemented by reversible hook removal, not by suppressing the entire Stop
phase. The `finally` restoration is the invariant that prevents an exception from silently deleting
the goal.

## 2. Command semantics

`goalCommandCall` has four branches at `:518489-518513`:

1. Empty input reports active state, iteration count, and last reason.
2. Case-insensitive aliases `clear`, `stop`, `off`, `reset`, `none`, and `cancel` clear the goal.
3. Conditions over 4,000 characters are rejected.
4. Valid conditions call the shared setter and return a query containing the kickoff instruction.

The kickoff explicitly tells the model to acknowledge briefly and begin work immediately. Successful
completion auto-clears the goal, so it also warns against telling the user to run `/goal clear` after
success.

### Command as the Single Activation Funnel

**What it does:** Ensures typed goals and model-proposed goals activate through the same validated
command path.

**How it works:**
1. Typed user input invokes `/goal` directly.
2. `ProposeGoal` only schedules the string `/goal <canonical condition>` on the message queue.
3. The queued command performs the same shared gates, replacement, transcript append, and kickoff.
4. Until that queue item executes, the prior goal remains authoritative.

**Why this approach:**
- Direct mutation inside `ProposeGoal` would duplicate command behavior and make approval timing
  invisible in the transcript.
- Queueing introduces a short activation delay, but preserves ordering with the current model turn.
- A shared internal setter is still used by the command; the queue is for interaction ordering, not
  code reuse alone.

**Key insight:** The proposal tool reports success before activation by design. Its tool result tells
the model to continue and wait for a later kickoff message rather than assuming the new goal is live.

## 3. Model proposal and consent

### Proposal Decision Pipeline

**What it does:** Lets the model suggest a verifiable completion condition while preserving explicit
user control and guarding state changes that occur while a dialog is open.

**How it works:**
1. The tool rejects subagents, remote/headless session shapes, and disabled feature/setting states.
2. It canonicalizes whitespace and invisible characters, rejects empty text, clear aliases, and
   canonicalized conditions longer than 500 characters.
3. It applies the same hook/trust preflight as typed goals and separately blocks plan mode.
4. Consent is required when the setting is `alwaysAsk` or `ask_user` is not explicitly `false`.
5. With consent bypassed, the tool enqueues `/goal` as a visible task notification. The schema text
   permits this only when the user's own words already state the outcome.
6. With consent required, it stores a UUID in `pendingGoalProposal`, queues an approval dialog, and
   immediately returns a nonblocking tool result.
7. When the promise resolves, it rechecks proposal identity, setting disablement, and plan mode.
8. Only a still-current, approved proposal is enqueued as an auto-continuation; `finally` clears the
   pending UUID only if it still owns the slot.

**Why this approach:**
- The UUID makes an asynchronous decision compare-and-set: stale dialog results cannot activate a
  superseded proposal.
- Rechecking setting and mode after approval handles user actions during the dialog.
- Blocking the model turn until the user decides would waste interactive concurrency and encourage
  polling; the queue preserves causal order without blocking.
- The trade-off is a two-stage user experience: proposal accepted, then goal activation at turn end.

**Key insight:** Approval is necessary but not sufficient. The proposal must also still be current,
enabled, and outside plan mode at the moment the dialog resolves.

```javascript
// ============================================
// decideGoalProposal - Revalidate an asynchronous approval before activation
// Location: cli_inner_pretty.js:561501-561533
// ============================================

// ORIGINAL (for source lookup):
          l(Cqe, { condition: n }, { queueBehind: !0 })
            .then((d) => {
              let p = r.getAppState().pendingGoalProposal !== u,
                f = O$e() === "disabled",
                m = mn(r).mode === "plan";
              if (
                (M("tengu_goal_proposal_decided", {
                  decision: d.approved
                    ? p
                      ? Ae("approved_stale")
                      : f
                        ? Ae("approved_disabled")
                        : m
                          ? Ae("approved_plan_mode")
                          : Ae("approved")
                    : Ae("declined"),
                }),
                !d.approved || p || f || m)
              ) {
                if (d.approved && !p) {
                  if (f) Le("goal_propose", "approved_dropped_disabled");
                  else if (m) Le("goal_propose", "approved_dropped_plan_mode");
                }
                return;
              }
              a.enqueue({ agentId: $i(), mode: "prompt", value: `/goal ${n}`, origin: { kind: "auto-continuation" } });
            })
            .catch((d) => {
              De(d);
            })
            .finally(() => {
              c((d) => (d.pendingGoalProposal === u ? { ...d, pendingGoalProposal: void 0 } : d));
            }),

// READABLE (for understanding):
requestDialog(GoalProposalDialog, { condition }, { queueBehind: true })
  .then((decision) => {
    const stale = context.getAppState().pendingGoalProposal !== proposalId;
    const disabled = getModelProposedGoalsSetting() === "disabled";
    const planMode = getPermissionMode(context).mode === "plan";
    if (!decision.approved || stale || disabled || planMode) return;
    messageQueue.enqueue({
      agentId: getMainAgentId(),
      mode: "prompt",
      value: `/goal ${condition}`,
      origin: { kind: "auto-continuation" },
    });
  })
  .catch(reportError)
  .finally(() => {
    setAppState((state) =>
      state.pendingGoalProposal === proposalId ? { ...state, pendingGoalProposal: undefined } : state,
    );
  });

// Mapping: l→requestDialog, Cqe→GoalProposalDialog, n→condition, r→context,
//          u→proposalId, O$e→getModelProposedGoalsSetting, mn→getPermissionMode,
//          a→messageQueue, $i→getMainAgentId, c→setAppState, De→reportError
```

### Proposal Tool Classification

**What it does:** Marks `ProposeGoal` as read-only but not concurrency-safe, reflecting the difference
between external mutation classification and internal interaction state.

**How it works:**
1. `isReadOnly()` returns true, so the proposal itself is not classified as a filesystem or external
   write.
2. `isConcurrencySafe()` returns false because the session has one `pendingGoalProposal` slot.
3. `shouldDefer` is true and the approval promise continues after the immediate tool result.
4. The tool mutates only internal pending state and the message queue.
5. Actual goal activation occurs later through the queued `/goal` command.

**Why this approach:**
- Treating proposal as the same write class as goal activation would obscure that the user can still
  decline it.
- Marking it concurrency-safe would allow competing dialogs to race for one pending identity.
- “Read-only” here means no direct external resource mutation, not referential purity; app state and
  queue state do change.
- The split makes framework classification more precise, but requires readers not to interpret
  `isReadOnly` as “has no side effects.”

**Key insight:** The singleton UUID is the concurrency control. Framework read-only metadata does not
make the asynchronous proposal pipeline stateless.

### Setting Resolution

**What it does:** Resolves `auto`, `alwaysAsk`, or `disabled` from trusted settings while preserving a
consent-safe fallback for a present but not normally parsed value.

**How it works:**
1. Read the effective trusted `modelProposedGoals` value.
2. If a recognized value exists, return it directly.
3. If no parsed value exists, query the lower-level setting-presence service.
4. Return `alwaysAsk` when the key is present there; otherwise return the normal `auto` default.
5. Ignore project/local settings because repository content is not allowed to relax consent.
6. Apply the setting only to model proposals; typed `/goal` bypasses this resolver.

**Why this approach:**
- `alwaysAsk` is the safest interpretation of a configuration that exists but cannot be confidently
  interpreted through the normal path.
- Defaulting such a value to `auto` could permit `ask_user: false` unexpectedly.
- Rejecting all proposals would fail safer still, but would break compatible configurations whose
  presence is known through the alternate service.
- Restricting sources costs repository-level configurability in exchange for preventing checked-in
  settings from changing a user's consent posture.

**Key insight:** The fallback is deliberately asymmetric: ambiguity increases consent requirements; it
never relaxes them (`:58070-58084`).

## 4. Transcript recovery

### Reverse-Scan Resume Algorithm

**What it does:** Reconstructs an active goal after session resume without persisting executable hook
objects.

**How it works:**
1. Scan messages newest-to-oldest for the first `goal_status` attachment.
2. If none exists, there is no goal to restore.
3. If the newest status is met or failed, the lifecycle is terminal and nothing is restored.
4. Otherwise, use its condition as the active goal.
5. Re-run trust/hook preflight; if blocked, clear stale `activeGoal` state.
6. Re-register the prompt Stop hook and initialize fresh counters, time, and output-token baselines.

**Why this approach:**
- Reverse scanning is O(distance to last status), usually constant-time relative to transcript size.
- The transcript is already durable and ordered, avoiding a second persistence format for hooks.
- Counters reset on resume, so metrics describe the resumed run rather than reconstructing historical
  timing from incomplete process state.
- Persisting the full hook registry could preserve counters but would create migration and trust risks.

**Key insight:** Only the newest goal status matters. An older unmet goal must never be resurrected
after a later met/failed marker.

```javascript
// ============================================
// findGoalToRestore - Recover only the latest nonterminal goal from transcript history
// Location: cli_inner_pretty.js:852394-852402
// ============================================

// ORIGINAL (for source lookup):
function Hlh(e) {
  if (!e) return null;
  for (let t = e.length - 1; t >= 0; t--) {
    let r = e[t];
    if (r?.type !== "attachment" || r.attachment.type !== "goal_status") continue;
    return r.attachment.met || r.attachment.failed ? null : r.attachment.condition;
  }
  return null;
}

// READABLE (for understanding):
function findGoalToRestore(messages) {
  if (!messages) return null;
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index];
    if (message?.type !== "attachment" || message.attachment.type !== "goal_status") continue;
    return message.attachment.met || message.attachment.failed ? null : message.attachment.condition;
  }
  return null;
}

// Mapping: Hlh→findGoalToRestore, e→messages, t→index, r→message
```

## 5. Critical branches and edge cases

- A goal condition equal to a clear alias cannot be set, even if it is a legitimate English outcome.
- Manual clear removes every matching generic prompt hook but uses the first hook's prompt for the
  sentinel text. Installation normally guarantees only one.
- An impossible evaluator outcome is terminal (`failed: true`), whereas an unmet outcome increments
  iterations and continues.
- Background task deferral recognizes both ordinary and daemon/background task predicates before
  removing the goal hook.
- Hook execution errors are handled by the generic Stop-hook path. The goal is restored in `finally`
  only when it was temporarily removed for background work.
- Resume honors current trust/policy, not historical trust. A formerly valid goal is not reactivated
  after policy tightens.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `findSessionGoalPromptHooks` (`zCr`) - isolates goal-owned prompt Stop hooks.
- `setSessionGoal` (`GCr`) - installs the goal.
- `clearSessionGoal` (`WCr`) - clears hook and state.
- `createGoalSentinelAttachment` (`f8d`) - writes resumable lifecycle evidence.
- `proposeGoalTool` (`slS`) - proposal validation and dialog pipeline.
- `findGoalToRestore` (`Hlh`) - selects the latest lifecycle state.
- `restoreGoalFromTranscript` (`IRv`) - rebuilds transient runtime state.
