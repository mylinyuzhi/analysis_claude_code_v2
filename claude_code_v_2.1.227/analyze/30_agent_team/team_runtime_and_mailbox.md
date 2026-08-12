# Current team runtime and mailbox

The current team implementation has two stores and two execution backends. Team membership lives in a
locked roster; work state lives in the task store. Pane teammates are separate CLI processes, while
in-process teammates are persistent task-registry entries that repeatedly run model turns and wait for
more work. Both communicate through the same durable mailbox envelope.

## 1. Implicit team bootstrap

### Session-owned team initialization

**What it does:** Creates or joins exactly one implicit team for the session and aligns its task-list
identity, lead roster entry, UI state, and cleanup ownership.

**How it works:**
1. `initializeSessionTeam` (`h7v`) consumes an explicit existing-team name or a one-shot inherited
   environment name; the inherited variable is deleted immediately after capture.
2. Without either, it derives `session-<first eight session-id characters>`.
3. It computes a deterministic lead agent ID from `team-lead` plus team name.
4. If no readable existing roster is found, it writes a roster containing the lead, current cwd,
   timestamps, and in-process backend metadata.
5. It sets the process's active task-list ID to the team name and renames a provisional session task
   directory when necessary.
6. It initializes the task store and registers the team for final session cleanup.
7. It returns UI `teamContext` and a deterministic initial color assignment for later reservations.

**Why this approach:**
- Implicit bootstrap removes a model-visible create/delete lifecycle that could be skipped or
  reordered.
- One team name shared by roster and tasks makes cross-process discovery deterministic.
- Deleting the inherited environment value prevents child launches later in the same process from
  accidentally reusing it.
- The trade-off is eager filesystem/storage state at startup, accepted to guarantee that a later
  teammate spawn never sees an uninitialized control plane.

**Key insight:** Team creation is process-owned initialization, not a tool action. The model can add
members, but it does not own the existence of the session team.

Evidence: `hPh`, `f7v`, and `h7v` at `cli_inner_pretty.js:923118-923193`.

## 2. Roster consistency and spawn

### Locked roster mutation

**What it does:** Serializes team membership changes across CLI processes and supports both filesystem
and Storage V5 backends without allowing silent lost updates.

**How it works:**
1. `updateTeamFile` (`k1e`) resolves the team config and acquires its lock before reading.
2. The mutator receives the latest parsed loose roster, not the caller's stale snapshot.
3. A returned value is separated from the roster object; the roster is atomically rewritten only when
   mutation succeeds.
4. Lock release is attempted in all paths and release failures are diagnosed separately.
5. The Storage V5 twin uses conditional update results and classifies contention, missing state, and
   nonretryable storage errors.
6. Member removal may include a `joinedAt` upper bound so delayed cleanup cannot remove a newly
   re-added identity.

**Why this approach:**
- Multiple pane processes and the leader can update the roster concurrently.
- Read-modify-write under one lock is the minimum transaction needed for unique names and stable
  membership.
- A join-time condition prevents ABA-style stale cleanup.
- Dual persistence adds branches, but keeps the semantic transaction identical across deployments.

**Key insight:** The roster mutation callback executes against authoritative state while holding the
serialization primitive; uniqueness cannot be safely decided before the lock.

Evidence: `k1e`, `Q6_`, and `DSn` at `cli_inner_pretty.js:342225-342401`.

### Reserve, launch, commit, or roll back

**What it does:** Makes teammate creation transactional across roster identity, mailbox seed, pane or
in-process launch, task registration, and UI state.

**How it works:**
1. `reserveTeammateIdentity` (`fni`) rejects control characters in agent/team names.
2. Under roster lock, it sanitizes the requested name, rejects the reserved `main` alias, appends a
   numeric suffix on case-insensitive collision, creates a deterministic agent ID, assigns a color,
   and writes a provisional member.
3. The selected backend fills pane/backend metadata and clears/seeds the teammate inbox before launch.
4. Pane mode constructs an argv-safe command for the child CLI; in-process mode registers a teammate
   task and starts the persistent runner.
5. The backend calls the commit callback only after the agent is running.
6. Any pre-commit failure runs backend cleanup and removes the provisional roster entry.
7. A post-commit failure keeps the entry because deleting a live agent's identity would create an
   unreachable orphan.

**Why this approach:**
- Filesystem roster, terminal pane, task registry, and child process cannot share one database
  transaction.
- Explicit commit/rollback callbacks approximate a saga while preserving a truthful roster.
- Case-insensitive collision prevention avoids cross-platform name ambiguity.
- Keeping post-commit state favors reachability over cosmetically reverting the UI.

**Key insight:** “Agent started” is the commit point. Before it, cleanup may roll back identity; after
it, identity must survive even if later bookkeeping fails.

Evidence: `fni` at `cli_inner_pretty.js:550036-550113`, backend handlers at `550126-550553`, and
selector `PnS` at `550554-550586`.

### Backend selection and flat-team enforcement

**What it does:** Selects pane versus in-process execution while preserving a flat team topology and
falling back safely when automatic pane mode is unavailable.

**How it works:**
1. The Agent tool exposes teammate spawn only to the lead; teammates are told to omit `name` and spawn
   ordinary subagents instead.
2. Explicit in-process mode routes directly to `spawnInProcessHandler` (`PVp`).
3. Otherwise the selector probes the configured terminal backend.
4. If probing fails and mode is `auto`, it latches the fallback notice and uses in-process execution.
5. An explicitly forced pane backend fails rather than silently changing execution topology.
6. Split-pane preference chooses the swarm-view pane path; `use_splitpane:false` chooses a distinct
   tmux-window path.
7. Model selection is resolved before backend launch so all paths report the actual model consistently.

**Why this approach:**
- A flat roster avoids recursive teams and ambiguous lead authority.
- Automatic mode optimizes usability, while explicit mode respects the user's integration choice.
- In-process fallback preserves functionality on terminals without pane support.
- Separate pane paths retain terminal-specific UX at the cost of duplicated launch choreography.

**Key insight:** Backend fallback is allowed only when the user selected automatic policy; explicit
terminal policy is an authority boundary, not a hint.

Evidence: generated Agent contract at `cli_inner_pretty.js:543591-543660`, `PVp` at
`550437-550553`, and `PnS` at `550554-550586`.

## 3. Persistent in-process execution

### Turn/idle/resume state machine

**What it does:** Keeps an in-process teammate alive across multiple instructions without holding an
active model turn or losing mailbox/task wake-ups.

**How it works:**
1. `runInProcessTeammate` (`xVp`) registers agent identity, context, abort controllers, and the first
   prompt.
2. For each prompt it marks the task active, optionally compacts long history, and creates a fresh
   current-work abort controller plus retry-wake emitter.
3. The normal agent loop streams messages/tools and updates usage/progress into the task registry.
4. At turn end it drains the mailbox before declaring idle, preventing a just-arrived message from
   being stranded behind an idle notification.
5. It classifies user interruption, transient API failure, and terminal failure separately.
6. Idle state sets an eviction deadline unless a transient failure requires holding the agent for
   recovery; callbacks and leader notification run once.
7. It waits for shutdown, direct/user message, plan approval, mode change, task-list work, abort, or
   idle timeout, then either resumes another turn or exits.
8. Final cleanup clears runner-only state, task output, roster activity, and terminal task status.

**Why this approach:**
- Reusing history makes teammates addressable after each task without replaying the initial prompt.
- Separate work and lifecycle abort controllers allow Escape to stop current work without killing the
  teammate.
- The post-turn mailbox drain closes a race between message delivery and idle transition.
- Persistent runners consume registry memory, so idle eviction bounds lifetime while transient holds
  preserve recoverability.

**Key insight:** Idle is a resumable execution state, not completion. Completion belongs to the runner
lifecycle; an idle teammate still owns history, identity, and a mailbox.

Evidence: `xVp` at `cli_inner_pretty.js:549273-549677`.

### Mailbox-first polling and atomic task pickup

**What it does:** Chooses the next input with shutdown/control priority, while allowing idle agents to
claim unblocked shared tasks without two agents taking the same task.

**How it works:**
1. `drainTeammateMailbox` (`kVp`) reads unread frames and prioritizes `shutdown_request` over ordinary
   messages.
2. Plan approval and permission-mode frames are applied only when the recipient is in the matching
   waiting state; stale protocol frames are dropped.
3. Remaining messages are marked read and returned as one new instruction or a drained batch.
4. `waitForNextTeammateInput` (`xnS`) first checks queued user messages and lifecycle abort state, then
   polls the mailbox.
5. If no message is available, `claimNextOpenTask` (`CVp`) selects an unblocked pending task and calls
   the task store's atomic claim primitive.
6. A successful claim becomes a model prompt and immediately transitions the task to in progress.
7. Poll sleeps are bounded and retry-wake delivery can interrupt an API backoff without canceling the
   teammate lifecycle.

**Why this approach:**
- Shutdown must preempt ordinary work so teardown cannot be starved by a busy inbox.
- Protocol frames are state-sensitive; accepting stale approval would mutate the wrong turn.
- Task selection followed by atomic claim handles races without requiring a global scheduler.
- Polling is simpler and portable across file/storage backends; retry wake reduces its latency for live
  in-process work.

**Key insight:** Discovery of a task is optimistic, but ownership is not. Only the atomic claim result
authorizes the model to act on it.

Evidence: `CVp`, `kVp`, and `xnS` at `cli_inner_pretty.js:549135-549272`; retry wake at
`548924-548945`.

## 4. Durable mailbox

### Validate-on-read, validate-on-write, repair later

**What it does:** Prevents one malformed mailbox entry from crashing a teammate's permanent poll loop
and repairs corrupted inboxes without blocking message delivery.

**How it works:**
1. Every new message receives `{msgV, msg_id, type, read:false}`.
2. `partitionValidMailboxEntries` (`W8s`) validates each array element independently; a non-array top
   level becomes an empty result.
3. Invalid entries are skipped while valid entries remain deliverable.
4. Diagnostics contain only a bounded field/code/type digest; reports are deduplicated and globally
   capped.
5. `readMailbox` (`Yrt`) returns valid entries immediately and schedules a single-flight prune when it
   observed invalid entries.
6. The prune reacquires the authoritative storage lock/update transaction and revalidates current
   contents before rewriting, so it does not overwrite a concurrent message.
7. `writeToMailbox` (`GD`) validates before append and returns `undefined` on durable-write failure;
   callers cannot report success without a message ID.
8. Read/ack operations remove exact entries or predicate-selected IDs under the same atomic update
   discipline.

**Why this approach:**
- A poll loop amplifies persistent corruption; entry-level salvage keeps healthy messages flowing.
- Pruning after the read minimizes delivery latency and avoids lock nesting.
- Revalidation under the repair lock closes the lost-update race.
- Privacy-safe, bounded diagnostics prevent attacker-controlled message text from entering telemetry.

**Key insight:** The repair job never writes the snapshot that triggered it. It rereads and revalidates
under serialization, making asynchronous cleanup concurrency-safe.

Evidence: envelope and mailbox runtime at `cli_inner_pretty.js:340000-340980`, particularly `W8s`
`340674-340688`, `yGd` `340700-340730`, `Yrt` `340776-340805`, and `GD` `340811-340877`.

## 5. Cleanup ownership

### Graceful member removal and final session cleanup

**What it does:** Separates ordinary member departure from last-resort session cleanup so live panes,
worktrees, and team directories are not deleted prematurely.

**How it works:**
1. Ordinary teammate shutdown sends/handles structured shutdown frames and removes the member only
   after lifecycle completion.
2. Stale removal can require `joinedAt <= removalStartedAt`, protecting a re-added member.
3. Team names touched by the session are recorded in a cleanup set.
4. Session shutdown enumerates those teams, asks backend implementations to kill remaining pane
   members, and waits for kill results.
5. It collects member worktree paths before deleting the team directory.
6. Worktrees are removed through git when possible, with guarded filesystem fallback and reparse-point
   refusal.
7. Failures are logged per resource so one bad pane/worktree does not prevent cleanup of the rest.

**Why this approach:**
- Runtime member removal and process-exit garbage collection have different authority and failure
  tolerance.
- Capturing worktree paths before roster deletion preserves cleanup evidence.
- Best-effort independent cleanup avoids one corrupt team orphaning all session teams.
- The final sweep is intentionally broader, but remains constrained to names registered by this
  session.

**Key insight:** The session, not the model or an individual teammate, is the ultimate owner of team
filesystem and pane resources.

Evidence: roster removal and cleanup at `cli_inner_pretty.js:342338-342559`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `initializeSessionTeam` (`h7v`) - implicit roster/task initialization.
- `updateTeamFile` (`k1e`) - serialized authoritative roster mutation.
- `reserveTeammateIdentity` (`fni`) - provisional identity and spawn commit/rollback.
- `spawnTeammateByBackend` (`PnS`) - explicit/automatic backend selection.
- `spawnInProcessHandler` (`PVp`) - in-process teammate registration and launch.
- `runInProcessTeammate` (`xVp`) - repeated turn/idle lifecycle.
- `waitForNextTeammateInput` (`xnS`) - prioritized mailbox/task polling.
- `claimNextOpenTask` (`CVp`) - optimistic selection plus atomic task claim.
- `readMailbox` (`Yrt`) and `writeToMailbox` (`GD`) - durable validated transport.
- `cleanupSessionTeams` (`eK_`) - final pane/worktree/team ownership cleanup.
