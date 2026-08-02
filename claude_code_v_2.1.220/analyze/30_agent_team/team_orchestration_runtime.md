# Agent Team runtime in 2.1.220: implicit teams, transactional spawn, and autonomous work pickup

This document describes the **current 2.1.220 Agent Team control plane**. The other reports in this
directory explain the mailbox and the version-specific hardening fixes; this report connects those
pieces into the end-to-end runtime that actually ships in 2.1.220.

The most important version boundary is easy to miss:

- The 2.1.220 bundle does **not** expose the readable tree's model-invoked `TeamCreate` / `TeamDelete`
  lifecycle. A top-level interactive session receives an implicit private team during startup.
- The same implicit-team initializer already exists in 2.1.193, so it is carryover rather than a
  2.1.220 delta.
- The readable tree remains a strong semantic witness for teammate spawning, the in-process runner,
  and task claiming, but its explicit create/delete tools are an older design and must not be
  transplanted into the 2.1.220 report.

Authoritative locations are in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`. The 2.1.193 bundle and
`/lyz/codespace/3rd/claude-code/src/` are used only for the two cross-checks above.

---

## 1. Runtime shape

A 2.1.220 team has four coupled state stores:

1. **Session state** — `AppState.teamContext` is the lead's live roster and UI-facing team identity.
2. **Team file** — `~/.claude/teams/<sanitized-team>/config.json` is the cross-process roster used by
   pane teammates and mailbox routing.
3. **Task list** — `~/.claude/tasks/<team-name>/` is the shared work queue. The implicit team name is
   installed as the task-list ID before any teammate is launched.
4. **Task registry** — an in-memory `in_process_teammate` task owns the abort controller, transcript,
   permission mode, idle state, pending messages, retry wake, and eviction deadline for each live
   in-process teammate.

The mailbox is deliberately outside those stores. It is the durable, cross-process transport between
the lead and teammates; the task registry is the fast in-process control plane. `SendMessage` writes
the mailbox in both cases and additionally emits `retryWake` when it can identify a live in-process
recipient. This preserves one communication model while avoiding a 500 ms polling delay in the common
in-process case.

### Agent-team enablement decision

**What it does:** Decides whether the session should expose teammate machinery and initialize an
implicit team.

**How it works:**
1. The environment opt-in `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` or the command-line opt-in
   `--agent-teams` must be present.
2. The `tengu_amber_flint` GrowthBook value is then treated as a kill switch and must remain enabled.
3. Startup calls the implicit initializer only for an interactive process and only when `--agent-id`
   is absent. A spawned teammate therefore joins its inherited team instead of creating a nested team.
4. Initialization errors are reported but do not crash startup. Later teammate spawning fails with a
   specific “session team not initialized” invariant error if the initializer could not establish the
   team file.

**Why this approach:**
- The opt-in prevents an experimental feature from changing the default tool/UI surface.
- The independent remote kill switch can disable the feature without requiring a client update.
- The `!agentId` condition prevents every pane teammate from becoming the lead of another implicit
  team.
- Continuing after an initialization error keeps ordinary single-agent use available; the failure is
  deferred to the feature that actually needs team state.

**Key insight:** Agent Team is enabled at the **session boundary**, not when the model first asks to
create a team. That is why an apparent `TeamCreate` implementation in an older readable tree cannot be
used as the 2.1.220 entry point.

```javascript
// ============================================
// isAgentSwarmsEnabled - Apply the local opt-in and remote kill switch
// Location: cli_inner_pretty.js:318748-318757
// ============================================

// ORIGINAL (for source lookup):
function YRy() {
  return process.argv.includes("--agent-teams");
}
function mc() {
  if (!Z.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS && !YRy()) return !1;
  if (!Ke("tengu_amber_flint", !0)) return !1;
  return !0;
}

// READABLE (for understanding):
function isAgentTeamsCliFlagSet() {
  return process.argv.includes("--agent-teams");
}
function isAgentSwarmsEnabled() {
  if (!env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS && !isAgentTeamsCliFlagSet()) return false;
  if (!getFeatureValue("tengu_amber_flint", true)) return false;
  return true;
}

// Mapping: YRy→isAgentTeamsCliFlagSet, mc→isAgentSwarmsEnabled, Z→env, Ke→getFeatureValue
```

The startup call is at `cli_inner_pretty.js:829042-829049`:
`mc() && !yn() && !t.agentId`. Here `yn()` means non-interactive mode, so negating it restricts the
initializer to the interactive lead.

---

## 2. Implicit session-team initialization

### Session team identity and initialization

**What it does:** Creates or inherits the one team associated with the lead session, aligns the task
list with it, registers cleanup, and returns initial `AppState` team data.

**How it works:**
1. Resolve an explicitly supplied `existingTeamName`; otherwise consume
   `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` exactly once. The environment variable is deleted after the
   first read so it cannot accidentally leak into unrelated children.
2. If neither exists, derive `session-<first-eight-session-id-characters>`.
3. Derive the lead's deterministic ID as `team-lead@<team-name>` and the team-file path.
4. Reuse an inherited team only if its file is readable. Otherwise write a fresh roster containing the
   lead as an in-process member with `tmuxPaneId: "leader"`.
5. Set the global task-list selector to the team name. If tasks were already created under the raw
   session ID, best-effort rename that directory to the team name.
6. Ensure the task directory exists and register the team for session-end cleanup.
7. Seed `AppState.teamContext` and the teammate-color allocator with the lead.

**Edge cases and special handling:**
- A missing inherited team file causes a new file to be created under the inherited name; inheritance
  is therefore a name handoff, not proof that a parent file survived.
- Team-file write failure is reported, but the initializer still builds in-memory state. A later
  locked roster mutation detects the missing file and raises the invariant error.
- The task-directory rename deliberately ignores errors. It is migration assistance, while
  `ensureTasksDir` establishes the usable postcondition.
- The eight-character session prefix is sufficient for a session-local namespace but is not used as
  an authorization token. The filesystem and session inheritance, not secrecy of the name, define the
  boundary.

**Why this approach:**
- An implicit team removes a model-visible setup step and guarantees that `Agent` teammate spawning,
  task tools, and mailbox routing agree on one identity from the start of the session.
- A deterministic lead ID lets every process reconstruct the lead address without another registry.
- Disk roster plus in-memory projection supports both separate terminal processes and low-latency
  in-process agents.
- Best-effort migration avoids making a stale task directory fatal to the whole session.

**Trade-offs:**
- Eager creation performs filesystem work even if the user never spawns a teammate.
- Keeping both a disk roster and `AppState.teamContext` creates consistency work; transactional roster
  updates and pin checks compensate for that duplication.
- Startup resilience means an initialization failure can surface later at spawn time rather than at
  the original write site.

**Key insight:** The team and task list are made the same project namespace before spawning. Without
the directory migration and task-list selector update, the lead and pane teammates could silently work
from different task queues.

```javascript
// ============================================
// initializeSessionTeam - Establish the implicit team and align its task list
// Location: cli_inner_pretty.js:828674-828718
// ============================================

// ORIGINAL (for source lookup):
async function jiE(e) {
  let t = e?.existingTeamName || BiE(),
    r = t ?? KEm(kt()),
    n = zCe(zf, r),
    o = Gze(r);
  if (!(t ? await JL(r) : null)) {
    let l = {
      name: r,
      createdAt: Date.now(),
      leadAgentId: n,
      leadSessionId: kt(),
      members: [
        {
          agentId: n,
          name: zf,
          agentType: zf,
          joinedAt: Date.now(),
          tmuxPaneId: "leader",
          cwd: gn(),
          subscriptions: [],
          backendType: "in-process",
        },
      ],
    };
    await hAo(r, l).catch((c) => mAo(r, c));
  }
  Did(r);
  let s = kt();
  if (r !== s) await zEm.rename(v9(s), v9(r)).catch(() => {});
  (await inn(r), qCs(r));
  let a = Ow[0];
  return {
    teamContext: {
      teamName: r,
      teamFilePath: o,
      leadAgentId: n,
      teammates: {
        [n]: {
          name: zf,
          agentType: zf,
          color: a,
          tmuxSessionName: "in-process",
          tmuxPaneId: "leader",
          cwd: gn(),
          spawnedAt: Date.now(),
        },
      },
    },
    teammateColors: { assignments: new Map([[n, a]]), index: 1 },
  };
}

// READABLE (for understanding):
async function initializeSessionTeam(options) {
  const inheritedName = options?.existingTeamName || consumeInheritedTeamName();
  const teamName = inheritedName ?? sessionTeamName(getSessionId());
  const leadAgentId = makeAgentId(TEAM_LEAD_NAME, teamName);
  const teamFilePath = getTeamFilePath(teamName);
  if (!(inheritedName ? await readTeamFileAsync(teamName) : null)) {
    await writeTeamFileAsync(teamName, createLeadOnlyRoster(teamName, leadAgentId)).catch(reportTeamWriteFailure);
  }
  setTaskListId(teamName);
  await bestEffortMoveSessionTasks(getSessionId(), teamName);
  await ensureTasksDir(teamName);
  registerTeamForSessionCleanup(teamName);
  return createInitialLeadTeamState(teamName, teamFilePath, leadAgentId);
}

// Mapping: jiE→initializeSessionTeam, BiE→consumeInheritedTeamName, KEm→sessionTeamName, kt→getSessionId, zCe→makeAgentId, zf→TEAM_LEAD_NAME, Gze→getTeamFilePath, JL→readTeamFileAsync, hAo→writeTeamFileAsync, mAo→reportTeamWriteFailure, Did→setTaskListId, v9→getTaskListDir, inn→ensureTasksDir, qCs→registerTeamForSessionCleanup
```

### Cleanup ownership

**What it does:** Makes the process, rather than a model-invoked delete tool, the final owner of team
resources created or inherited by this session.

**How it works:**
1. The initializer calls `registerTeamForSessionCleanup` (`qCs`, `:324609`) so cleanup scope is explicit
   and does not sweep unrelated team directories.
2. At graceful shutdown, `cleanupSessionTeams` (`$Dy`, `:324612-324622`) processes only those registered
   teams.
3. `killOrphanedTeammatePanes` (`NDy`, `:324623-324642`) reads each roster, selects non-lead members
   with a pane-backed backend, initializes those backends, and issues all pane kills with
   `Promise.allSettled`.
4. `cleanupTeamDirectories` (`wid`, `:324643-324659`) removes recorded worktrees first, then removes
   the team directory.
5. Both phases use `Promise.allSettled`, so one broken pane or worktree cannot prevent cleanup of the
   remaining teams. The session-created-team set is cleared after both phases.

**Why this approach:**
- Process shutdown is a reliable final boundary even when the model never invokes a lifecycle tool.
- Registration avoids a dangerous global directory sweep.
- Pane termination precedes worktree removal so live processes do not continue inside deleted state.
- `allSettled` favors maximum reclamation over fail-fast reporting.

This replaces the older readable tree's model-visible `TeamDelete` dependency with process-owned
cleanup. The trade-off is that a hard process crash can still bypass graceful cleanup, while an explicit
delete tool could provide earlier cooperative teardown. Conversely, explicit model cooperation cannot
be the only finalizer because the model may never call it.

**Key insight:** The cleanup registry is an ownership ledger. It converts teardown from a best-effort
model behavior into a bounded process responsibility without claiming ownership of every team on disk.

---

## 3. Teammate spawn transaction

### Identity reservation with commit/rollback

**What it does:** Reserves a unique teammate identity in the disk roster before any backend starts,
then rolls it back if spawning fails before the process becomes live.

**How it works:**
1. Reject control characters in the requested agent and team names before building commands or paths.
2. Acquire the team-file lock through `updateTeamFile` (`KHe`, `:324451-324478`).
3. Sanitize `@` in the display name, reserve case-insensitive uniqueness by appending `-2`, `-3`, and
   so on, derive the deterministic agent ID, and allocate a color.
4. Append the provisional roster member before starting a pane or in-process runner.
5. Pass three capabilities to the backend callback: the reserved identity, a commit marker, and a
   place to register OS/pane cleanup.
6. If the callback throws before commit, run the registered cleanup and remove the provisional roster
   member. If it throws after commit, keep the entry because an agent may already be executing.

**Edge cases and special handling:**
- The display name `main` is reserved because `SendMessage` interprets it as the main conversation.
- Uniqueness is case-insensitive, preventing `Worker` and `worker` from becoming ambiguous recipients.
- Cleanup failure is logged but does not suppress roster rollback.
- A post-commit exception deliberately leaves possible stale state rather than deleting the address of
  a process that may already be alive.

**Why this approach:**
- Reserving first makes concurrently spawned teammates serialize on one roster and prevents duplicate
  names/IDs.
- Explicit commit distinguishes “backend setup failed” from “process may have started,” which a simple
  `try/finally` cannot safely infer.
- Rollback minimizes ghost members without risking deletion of a live member.

**Trade-offs:** The provisional member is briefly visible before the backend is ready. This is safer
than starting an unaddressable process, but readers must tolerate a member whose pane metadata has not
yet been filled.

**Key insight:** This is a small transaction protocol across a JSON roster and an OS process. The
commit point is placed after the prompt/mailbox setup and process launch, not merely after allocating
an ID.

```javascript
// ============================================
// reserveTeammateIdentity - Reserve roster identity and roll back pre-commit failures
// Location: cli_inner_pretty.js:397222-397273
// ============================================

// ORIGINAL (for source lookup):
async function zMs(e, t, r, n, o) {
  for (let [l, c] of [
    ["name", e],
    ["team_name", t],
  ])
    if (Tod(c))
      throw (
        pe("subagent_launch", "subagent_teammate_control_chars"),
        Error(
          l === "name"
            ? "Invalid name: control characters are not allowed in agent or team names"
            : "Invalid team_name: control characters are not allowed in agent or team names",
        )
      );
  let i = await KHe(t, (l) => {
    let c = M8y(e, l),
      u = zCe(c, t),
      d = n.assign(u);
    return (
      l.members.push({ agentId: u, name: c, color: d, joinedAt: Date.now(), tmuxPaneId: "", subscriptions: [], ...r }),
      { sanitizedName: c, teammateId: u, teammateColor: d }
    );
  });
  if (!i)
    throw (
      pe("subagent_launch", "subagent_teammate_internal_invariant"),
      Error("reserveTeammateIdentity: updateTeamFile returned undefined")
    );
  let s = !1,
    a;
  try {
    return await o(
      i,
      () => {
        s = !0;
      },
      (l) => {
        a = l;
      },
    );
  } catch (l) {
    if (!s) {
      if (a)
        try {
          await a();
        } catch (c) {
          w(`[spawnTeammate] pane cleanup failed for ${i.teammateId}: ${le(c)}`);
        }
      await WCs(t, i.teammateId);
    } else w(`[spawnTeammate] post-commit failure for ${i.teammateId}; entry kept (agent already running): ${le(l)}`);
    throw l;
  }
}

// READABLE (for understanding):
async function reserveTeammateIdentity(requestedName, teamName, memberMetadata, colorAllocator, spawnBackend) {
  rejectControlCharacters(requestedName, teamName);
  const reservation = await updateTeamFile(teamName, roster => appendUniqueReservedMember(roster, requestedName, memberMetadata, colorAllocator));
  let committed = false;
  let cleanupBackend;
  try {
    return await spawnBackend(reservation, () => { committed = true; }, cleanup => { cleanupBackend = cleanup; });
  } catch (error) {
    if (!committed) {
      await cleanupBackend?.();
      await removeTeamMember(teamName, reservation.teammateId);
    } else {
      logPostCommitFailureWithoutDeletingLiveMember(reservation.teammateId, error);
    }
    throw error;
  }
}

// Mapping: zMs→reserveTeammateIdentity, e→requestedName, t→teamName, r→memberMetadata, n→colorAllocator, o→spawnBackend, Tod→hasControlCharacters, KHe→updateTeamFile, M8y→allocateUniqueTeammateName, zCe→makeAgentId, WCs→removeTeamMember, s→committed, a→cleanupBackend
```

### Backend selection and launch ordering

**What it does:** Selects in-process, split-pane, or separate tmux-window execution while preserving
the same reservation and mailbox protocol.

**How it works:**
1. Reject an initial prompt that is itself a structured mailbox protocol frame. Initial work must be
   ordinary task text, not a forged shutdown/approval control message.
2. If the captured teammate mode resolves to in-process, call the in-process handler directly.
3. Otherwise initialize the pane backend. In `auto` mode only, backend failure downgrades to in-process
   and emits a visible warning; an explicitly requested pane mode propagates the failure.
4. With a backend available, `use_splitpane !== false` chooses a split pane; exactly `false` chooses a
   separate tmux window.
5. Both pane paths reserve the identity, create the pane, attach pane metadata to the roster, clear the
   old inbox, enqueue the initial prompt, construct a tightly quoted child command, start it, then mark
   the transaction committed.
6. The in-process path reserves the same identity, marks the roster backend as `in-process`, registers
   an `in_process_teammate` task with an independent abort controller, commits, and starts the runner
   without awaiting its lifetime.

**Why this approach:**
- A single dispatcher keeps fallback policy separate from backend mechanics.
- Auto fallback favors successful delegation; explicit mode failure favors user intent and
  debuggability.
- The shared reservation and mailbox setup makes backend choice an implementation detail for the lead.
- Starting the in-process runner fire-and-forget lets the `Agent` tool return the identity immediately
  while the teammate continues asynchronously.

**Trade-offs:** Pane agents have process isolation and visible terminals but require backend setup,
shell quoting, and cross-process state. In-process agents are cheaper and the 2.1.220 default, but share
the event loop and depend more heavily on task-registry isolation.

**Key insight:** `teammateMode` changes *where* the loop runs, not the team protocol. The roster,
mailbox, task list, deterministic ID, and shutdown messages remain the same.

```javascript
// ============================================
// spawnTeammateByBackend - Select in-process, auto fallback, split pane, or tmux window
// Location: cli_inner_pretty.js:397705-397721
// ============================================

// ORIGINAL (for source lookup):
async function N8y(e, t, r) {
  if (e.prompt && Use(e.prompt)) throw (pe("subagent_launch", "subagent_teammate_protocol_frame_prompt"), Error(cxs));
  if (Orn()) return Jvd(e, t);
  try {
    await Prn();
  } catch (o) {
    if (YOt() !== "auto") throw (pe("subagent_launch", "subagent_teammate_pane_unavailable"), o);
    return (
      w(`[handleSpawn] No pane backend available, falling back to in-process: ${le(o)}`),
      TCs(),
      F8y(r),
      Jvd(e, t)
    );
  }
  if (e.use_splitpane !== !1) return O8y(e, t);
  return $8y(e, t);
}

// READABLE (for understanding):
async function spawnTeammateByBackend(input, context, notify) {
  if (input.prompt && isStructuredProtocolMessage(input.prompt)) throw new Error(PROTOCOL_FRAME_PROMPT_ERROR);
  if (useInProcessBackend()) return spawnInProcessHandler(input, context);
  try {
    await ensurePaneBackend();
  } catch (error) {
    if (getCapturedTeammateMode() !== "auto") throw error;
    notifyAutoFallback(notify, error);
    return spawnInProcessHandler(input, context);
  }
  return input.use_splitpane !== false
    ? spawnSplitPaneTeammate(input, context)
    : spawnTmuxWindowTeammate(input, context);
}

// Mapping: N8y→spawnTeammateByBackend, e→input, t→context, r→notify, Use→isStructuredProtocolMessage, cxs→PROTOCOL_FRAME_PROMPT_ERROR, Orn→useInProcessBackend, Jvd→spawnInProcessHandler, Prn→ensurePaneBackend, YOt→getCapturedTeammateMode, F8y→notifyAutoFallback, O8y→spawnSplitPaneTeammate, $8y→spawnTmuxWindowTeammate
```

---

## 4. In-process teammate state machine

### In-process turn/idle loop

**What it does:** Runs repeated agent turns for one teammate, persists a bounded transcript, accepts
mailbox/task input while idle, reports status to the lead, and owns terminal cleanup.

**How it works:**
1. Build an agent context with `agentType: "teammate"`, depth inherited from the parent, a deterministic
   team identity, and `isBackgroundAgent: true`.
2. Build the system prompt from the normal tool surface plus the teammate communication addendum.
   Custom agent instructions and memory are appended when an agent definition supplies them.
3. Register the initial prompt in the task transcript, then enter the outer loop controlled by the
   teammate's lifetime abort controller.
4. For each turn, create a separate current-work abort controller. Escape can interrupt only the
   current turn and return the teammate to idle; shutdown aborts the lifetime controller.
5. Before the model call, compact the private transcript if it crosses the normal auto-compact
   threshold. A `PreCompact` hook may block compaction; that condition is recorded but does not kill
   the teammate.
6. Run the shared agent loop with teammate context, teammate permissions, retry-wake subscription, and
   transcript preservation. Streamed messages update progress and the bounded transcript.
7. At turn end, drain the mailbox once before declaring idle. This closes the race where a message
   arrives between the last tool round and idle registration.
8. Classify API failure, choose `available`, `interrupted`, or `failed`, send one idle notification to
   the lead, and set either a 30-second eviction deadline or a transient-failure hold.
9. Wait for the next input. Priority is: pending in-process user message, shutdown frame, lead protocol
   frames, ordinary mailbox messages, then an available shared task.
10. On lifetime exit, convert the task to `completed`/`failed`, drop almost all retained transcript,
    evict terminal registry state, unregister tracing/lifecycle metadata, and report final status.

**Critical branches:**
- `planModeRequired` starts the teammate in plan permission mode and requires lead approval before
  implementation.
- A shutdown request is prioritized over earlier unread ordinary messages so teardown cannot be
  starved by backlog.
- Transient API failure after meaningful output suppresses eviction and keeps polling; an ordinary
  successful idle period gets the normal 30-second eviction deadline.
- While a teammate is viewed, another teammate is busy, background work remains, or plan approval is
  pending, the idle timer is refreshed to keep the agent addressable.
- A standalone/resumed runner skips team-file removal where a normal spawned teammate would remove
  itself on idle timeout.

**Why this approach:**
- Two abort scopes separate “stop this tool/model turn” from “terminate the teammate.”
- Reusing the core agent loop preserves tool, hook, permission, model, and compaction behavior instead
  of maintaining a second execution engine.
- A polling idle state works for both disk mailboxes and task files, while `retryWake` lowers latency
  for in-process messages and API retry sleeps.
- The bounded transcript and terminal truncation limit memory cost for teammates that can remain alive
  across many assignments.

**Trade-offs:** The loop is operationally robust but state-heavy: roster state, registry state,
mailbox read bits, plan approval, retry state, and eviction time must agree. The 500 ms polling interval
is simple and cross-process compatible but creates background I/O; wake emitters optimize only paths
that can identify the live local task.

**Key insight:** A teammate is not a one-shot subagent. It is a persistent actor alternating between
`responding` and `idle`, with its own conversation history and permission state, and it can autonomously
claim more work after completing the prompt that spawned it.

### Atomic task selection and claiming

**What it does:** Lets an idle teammate take the first dependency-ready unowned task without two
teammates successfully claiming the same work.

**How it works:**
1. List the shared team tasks.
2. Build the set of every task whose status is not `completed`.
3. Select the first task that is `pending`, has no owner, and whose `blockedBy` IDs are all absent from
   that unresolved set.
4. Call the task store's atomic `claimTask` operation with the teammate name.
5. Only after claim success, update the status to `in_progress` so the UI reflects active work.
6. Return a synthetic prompt that tells the teammate to complete all open tasks but begin with the
   claimed task.
7. On a lost claim race or I/O failure, log and return no prompt; the idle loop polls again.

**Why this approach:**
- The optimistic “scan then atomic claim” pattern keeps reads simple while the claim operation resolves
  races at the write boundary.
- Dependencies are evaluated against all unresolved tasks, not merely pending ones; an in-progress
  blocker therefore remains a blocker.
- Separating owner claim from status update keeps ownership as the concurrency invariant. A failed UI
  status write does not permit a second owner.

**Trade-offs:** First-match selection is deterministic and cheap but not priority-aware and may favor
low-numbered tasks. Polling after a lost race adds up to 500 ms of delay. The status update is not in
the same transaction as owner assignment, so a brief owner/status mismatch can appear in the UI.

**Key insight:** `owner`, not `status`, is the mutual-exclusion field. The subsequent `in_progress`
write is a presentation/state-progress update, not the lock.

```javascript
// ============================================
// claimNextOpenTask - Atomically own the next dependency-ready task
// Location: cli_inner_pretty.js:396268-396286
// ============================================

// ORIGINAL (for source lookup):
async function Kvd(e, t) {
  try {
    let r = await nte(e),
      n = C8y(r);
    if (!n) return;
    let o = await Uid(e, n.id, t);
    if (!o.success) {
      w(`[inProcessRunner] Failed to claim task #${n.id}: ${o.reason}`);
      return;
    }
    return (
      await Wze(e, n.id, { status: "in_progress" }),
      w(`[inProcessRunner] Claimed task #${n.id}: ${n.subject}`),
      x8y(n)
    );
  } catch (r) {
    w(`[inProcessRunner] Error checking task list: ${r}`);
    return;
  }
}

// READABLE (for understanding):
async function claimNextOpenTask(taskListId, agentName) {
  try {
    const task = findNextClaimableTask(await listTasks(taskListId));
    if (!task) return;
    const claim = await claimTask(taskListId, task.id, agentName);
    if (!claim.success) return;
    await updateTask(taskListId, task.id, { status: "in_progress" });
    return buildTaskClaimPrompt(task);
  } catch (error) {
    logTaskClaimFailure(error);
    return;
  }
}

// Mapping: Kvd→claimNextOpenTask, e→taskListId, t→agentName, nte→listTasks, C8y→findNextClaimableTask, Uid→claimTask, Wze→updateTask, x8y→buildTaskClaimPrompt
```

---

## 5. Cross-version verification

| Question | 2.1.220 authoritative bundle | 2.1.193 comparison | Readable tree cross-check | Verdict |
|---|---|---|---|---|
| How is a team created? | Startup `jiE`, `:828674-828718`; only one literal `TeamCreate` remains in an unrelated classifier set | Equivalent `Qdm`, `:697141+` | `src/tools/TeamCreateTool/TeamCreateTool.ts` exposes an explicit model tool | **Implicit team is authoritative; readable create tool is older design** |
| How is a team deleted? | Session-owned `$Dy` → `NDy` + `wid`, `:324612-324659` | Same cleanup family exists | `TeamDeleteTool.ts` asks the model to clean up after active members stop | **220 cleanup is process-owned; graceful messaging still precedes teardown** |
| Is team initialization a 220 change? | Present | Same name derivation, inherited env handling, task rename, cleanup registration, and lead state | No matching implicit initializer found | **Carryover from at least 2.1.193** |
| How are names reserved? | Locked `zMs` reservation with pre-commit rollback and post-commit retention | Same architecture under different mangling | `spawnMultiAgent.ts` / swarm helpers corroborate deterministic IDs and roster mutation | **Semantically cross-validated** |
| How does in-process execution work? | `Mko` registers; `Dko` starts; `H8y` owns repeated turn/idle cycles | Same core runner, with 220 hardening described in the lifecycle report | `src/utils/swarm/spawnInProcess.ts` and `inProcessRunner.ts` match the state model | **Semantically cross-validated; 220 bundle owns exact branches** |
| How is more work acquired? | `C8y` + `Kvd`, `:396250-396286` | Same task-pickup architecture | `findAvailableTask` + `tryClaimNextTask` in readable `inProcessRunner.ts` | **Direct semantic match** |

The comparison supports two different kinds of confidence:

- **Exact version truth** comes from the 2.1.220 bundle: symbol identities, gates, branch order, defaults,
  error handling, telemetry, and the implicit lifecycle.
- **Semantic naming confidence** comes from the readable runner and spawn files where their control flow
  agrees with the bundle. It does not license importing the readable tree's explicit team tools.

---

## 6. End-to-end sequence

1. Interactive startup passes `isAgentSwarmsEnabled` and calls `initializeSessionTeam`.
2. The lead receives `teamContext`; the disk roster contains the deterministic lead; the task list is
   keyed by the same implicit team name.
3. An `Agent` teammate request enters `spawnTeammateByBackend`.
4. `reserveTeammateIdentity` locks the roster, assigns a unique name/ID/color, and appends a provisional
   member.
5. The selected backend clears the teammate inbox, writes the initial prompt, starts or registers the
   process, fills backend metadata, and commits.
6. The in-process runner executes the prompt, reports idle/failure through the mailbox, then polls for
   shutdown, messages, approval/mode frames, or claimable tasks.
7. `SendMessage` writes the recipient mailbox and emits a retry wake for a live in-process task; the
   next tool/retry/idle boundary consumes it.
8. Graceful shutdown uses a structured request/response. Terminal runner cleanup updates the task
   registry and roster.
9. Session shutdown is the final owner: it kills any remaining pane processes, removes worktrees and
   team directories, and clears the session cleanup set.

This closes the control-plane analysis: startup, spawn, execution, work pickup, messaging, and final
cleanup all have 2.1.220 anchors.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isAgentSwarmsEnabled` (`mc`) - opt-in plus remote kill switch
- `initializeSessionTeam` (`jiE`) - implicit startup team and task-list initialization
- `sessionTeamName` (`KEm`) - deterministic `session-<prefix>` name
- `cleanupSessionTeams` (`$Dy`) - final session-owned cleanup coordinator
- `updateTeamFile` (`KHe`) - locked roster mutation primitive
- `reserveTeammateIdentity` (`zMs`) - unique roster reservation and spawn transaction
- `spawnTeammateByBackend` (`N8y`) - backend selection and auto fallback
- `spawnInProcessHandler` (`Jvd`) - in-process reservation and launch path
- `spawnInProcessTeammate` (`Mko`) - task/context registration
- `runInProcessTeammate` (`H8y`) - persistent turn/idle state machine
- `waitForNextTeammateInput` (`k8y`) - mailbox/task polling and eviction handling
- `claimNextOpenTask` (`Kvd`) - atomic work pickup
- `writeToMailbox` (`VT`) - durable teammate transport
- `wakeRunningTeammate` (`OMs`) - low-latency in-process wake
