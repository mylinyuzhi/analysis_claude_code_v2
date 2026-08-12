# Background runtime architecture in 2.1.227

Background execution in 2.1.227 is not one process table. It is a coordinated system with four
independently recoverable layers:

1. per-job durable state under the jobs namespace;
2. a daemon roster that describes live PTY-backed sessions;
3. a process-identity lock that elects one supervisor;
4. transcript and worktree artifacts that survive either the interactive client or daemon exiting.

This separation lets the agents view remain useful after partial failure. A missing roster entry can be
reconstructed from a live process, a stale job can be projected as failed without rewriting history, and
a resumable transcript can be distinguished from in-process state that is genuinely lost.

## 1. Durable job state

### Bounded, cached job-state loading

**What it does:** Loads `state.json` and its ordering/group sidecars without allowing malformed,
oversized, or unstable filesystem entries to stall or poison the entire agents list.

**How it works:**
1. `readJobState` (`Vl`) selects the Storage V5 or direct-filesystem reader.
2. Both readers verify that `state.json` is a regular file and no larger than 8 MiB before decoding it.
3. The filesystem reader stats `state.json`, `order`, `stateOrder`, and `group`, then builds an mtime key
   covering all readable inputs.
4. `JobStateReadCache` (`tYs`) returns a cached parse when that key is unchanged and caps its map at
   1,000 entries.
5. The reader parses JSON and validates the known state fields, while retaining unknown top-level
   fields for forward compatibility.
6. Numeric order sidecars override embedded values; the group sidecar is trimmed, length-bounded, and
   screened against reserved names.
7. A missing file clears its cache entry. A transient read/stat error returns the last cached value by
   default, but callers can request `null` instead.
8. Repeated warnings, prune reports, and sidecar-fallback notices are deduplicated per job.

**Why this approach:**
- Listing jobs is a fan-out operation, so one pathological entry must not make the whole view slow or
  unavailable.
- A metadata key avoids rereading large state files on every 200 ms UI refresh.
- Preserving unknown fields allows a newer writer and older reader to coexist during daemon handover.
- Returning stale cache data on a transient error favors continuity; the trade-off is that the UI may
  briefly display an older state rather than an empty row.

**Key insight:** The cache key covers the sidecars as well as `state.json`; ordering and grouping changes
cannot remain invisible merely because the primary state file did not change.

Evidence: `tYs`, `qzo`, `Vl`, and `y9d` at `cli_inner_pretty.js:358679-359040`; the 8 MiB cap is
initialized at `359585-359590`.

### Durable write normalization and self-write suppression

**What it does:** Publishes job state atomically while removing UI-only projections and preventing the
process's own watcher from treating its write as external activity.

**How it works:**
1. `writeJobState` (`rg`) derives `selfWake` from whether the in-flight kinds contain `session_cron`.
2. It removes derived `pinned`, ordering, and group fields from the primary state object; those belong to
   independent sidecars or the global pins set.
3. It increments a process-local write-depth counter before writing.
4. Storage V5 writes use mode `0600`; the filesystem path uses the atomic write helper with the same
   private mode.
5. The counter is decremented in `finally`, and the corresponding cache entry is invalidated even on
   failure.
6. Separate locked operations update ordering, grouping, and pins. Unpinning also releases the order
   sidecar so a stale pinned order cannot affect normal sorting.

**Why this approach:**
- Keeping projections outside `state.json` prevents UI interactions from rewriting execution state.
- A write-depth marker is cheaper and more precise than globally disabling watchers during every local
  mutation.
- Atomic replace prevents readers from observing truncated JSON.
- Multiple sidecars increase storage operations, but permit independently locked, low-conflict updates.

**Key insight:** The persisted primary object is deliberately smaller than the in-memory view model;
pinning and ordering are overlays, not execution truth.

Evidence: `rg` at `cli_inner_pretty.js:358798-358830`; sidecar and pin mutations at
`359188-359333`.

### Stale-state projection and roster-orphan adoption

**What it does:** Reconciles durable jobs with the daemon roster without falsely presenting abandoned
work as active or discarding a still-running process.

**How it works:**
1. `listBackgroundJobs` (`sJ`) loads all valid job scopes and overlays the global pin set.
2. `reconcileStaleJobs` (`PCr`) leaves terminal jobs, pinned jobs, and jobs younger than five seconds
   unchanged.
3. Older nonterminal entries are projected through `markStaleJobFailed` (`yQ_`): ordinary work becomes
   failed/idle and loses in-flight/block state, while a resumable blocked job remains blocked.
4. `adoptRosterOrphans` (`w9d`) finds daemon workers whose short IDs have no job directory.
5. Each candidate is checked with both PID liveness and recorded process-start identity.
6. Dead roster records are reported as prunable; live records are converted into a conservative job
   state, usually blocked with “send a prompt to start” unless their durable activity proves otherwise.
7. The synthesized state is created only if absent, so it cannot overwrite a concurrently materialized
   job.

**Why this approach:**
- The job store and daemon roster cannot commit atomically, so reconciliation must tolerate either side
  winning a crash race.
- A short grace interval avoids marking a job stale while startup is still creating its artifacts.
- Projection rather than immediate rewrite preserves forensic state and avoids a list operation mutating
  durable execution truth.
- PID plus process-start validation protects against PID reuse.

**Key insight:** Absence from one store is evidence to investigate, not proof of death. A live,
identity-matched roster process is adopted; an old state-only job is shown conservatively as failed.

Evidence: `sJ`, `PCr`, and `yQ_` at `cli_inner_pretty.js:359334-359414`; `w9d` at
`359459-359555`.

## 2. Supervisor ownership and recovery

### Identity-safe daemon election and handover

**What it does:** Ensures there is one background supervisor per configuration directory and prevents a
stale or adversarial lock entry from authorizing signals to an unrelated process.

**How it works:**
1. `readDaemonLock` (`oge`) accepts only a regular, bounded JSON record containing numeric `pid` and
   string `version`; malformed Storage V5 nodes are deleted or healed.
2. `readVerifiedDaemonLock` (`xU`) checks that the PID exists, `/proc/<pid>/cmdline` still identifies a
   Claude daemon, and the recorded process-start value matches a fresh probe.
3. Startup probes its own process-start value twice. If both probes fail, it records a lock without that
   identity but explicitly disables signal-based kill paths.
4. `acquireDaemonLock` (`Ifm`) creates the record with an if-absent precondition.
5. If creation loses a race, startup verifies the apparent owner. It replaces only an invalid/dead lock,
   waits briefly, and rereads to prove it still owns the replacement.
6. A service or foreground daemon may ask a transient daemon to yield through the control socket. A
   transient daemon never displaces an existing owner.
7. Shutdown deletes the lock only after rereading and matching both its own PID and `startedAt`, so a
   predecessor cannot remove its successor's lock.

**Why this approach:**
- PID alone is reusable and therefore not a durable process identity.
- Atomic create establishes election, while read-back verification covers backends whose replacement
  operation can race.
- Cooperative yield preserves live workers for re-adoption instead of killing them during origin
  changes.
- Refusing to signal an unverifiable process can leave manual cleanup, but that is safer than terminating
  an unrelated process.

**Key insight:** The lock is both an election token and an identity certificate. Every destructive use
requires stronger evidence than merely parsing a PID.

Evidence: `Ifm`, `oge`, and `xU` at `cli_inner_pretty.js:751234-751445`; daemon election and transient
handover in `EVh` at `968539-968674`.

### Registry-worker crash classification and jittered backoff

**What it does:** Keeps configured daemon workers alive while distinguishing temporary launch failure,
permanent refusal, broken wrappers, rapid crashes, and normal long-lived exits.

**How it works:**
1. `DaemonRegistryWorker` (`D4i`) spawns the resolved launcher with `--daemon-worker <kind>`, passes the
   worker config and initial access token through stdin, and optionally attaches an IPC auth channel.
2. A requested stop sends structured shutdown when possible, falls back to `SIGTERM`, then uses
   `SIGKILL` after five seconds.
3. A temporary-failure exit receives a separate randomized 30-second retry.
4. A permanent exit is logged and never respawned.
5. A wrapper that exits successfully before the worker could start is treated as a daemonizing/broken
   launcher and parked until daemon restart.
6. Other nonzero or sub-60-second exits increment a consecutive-crash counter.
7. `daemonWorkerBackoffMs` (`fpH`) computes exponential delay capped at five minutes and multiplies it by
   random jitter in `[0.5, 1.5)`.
8. If the invocation target disappeared during version garbage collection, the worker re-resolves the
   binary and clears the crash streak.
9. A process that ran at least 60 seconds is considered healthy enough to reset the streak and respawn
   immediately.

**Why this approach:**
- Exit codes convey policy, while uptime distinguishes a persistent configuration problem from an
  ordinary lifecycle exit.
- Jitter prevents several worker kinds from synchronizing their retries after a shared outage.
- Capped exponential backoff protects CPU and logs without abandoning recovery.
- Parking a broken wrapper requires a daemon restart, trading automatic recovery for avoiding an
  infinite loop caused by a launcher contract violation.

**Key insight:** “Exit code 0” is not always success: a process wrapper that returns immediately without
`exec`-ing its arguments is classified as a permanent startup failure.

Evidence: `D4i`, `fpH`, and worker constants at `cli_inner_pretty.js:968196-968405`.

### Live configuration reconciliation and supervisor exit policy

**What it does:** Applies daemon configuration changes without losing the last known-good worker set and
shuts transient supervisors down only when no clients or jobs keep them alive.

**How it works:**
1. `reconcileDaemonWorkers` (`yVh`) loads `daemon.json`; a failed initial load leaves the daemon idle,
   while a failed reload keeps the previous valid configuration.
2. It instantiates enabled worker kinds with a two-second stagger to avoid a startup burst.
3. On file changes it computes stop, restart, and start sets, serializes reload promises, and publishes
   a worker-status snapshot after mutations.
4. Configured workers do not themselves pin a transient supervisor.
5. `runBackgroundDaemon` (`EVh`) computes keep-alive count from client leases plus live background-job
   handles.
6. With no keep-alive, a never-used transient daemon gets the startup grace; one that previously served
   a client gets the shorter idle grace.
7. Binary identity is polled. A newer/replaced target triggers self-restart, but an older build or an
   unrunnable process wrapper defers replacement.
8. Yield, displacement, explicit shutdown, service recall, idle exit, manager startup failure, and OS
   signal are tracked as different terminal causes.
9. Teardown drains config reloads, stops workers, closes the manager, and conditionally removes only the
   still-owned lock.

**Why this approach:**
- Last-good configuration prevents a partially written file from taking healthy workers offline.
- Serialized reloads preserve change order without blocking the filesystem watcher.
- Workers are useful only while a client/job can consume them, so they do not keep an on-demand daemon
  alive indefinitely.
- Refusing downgrade self-restarts prevents an older installation from displacing a running newer build.

**Key insight:** Worker existence and daemon liveness are intentionally decoupled. Client/job leases are
the authority for a transient supervisor's lifetime.

Evidence: `yVh` at `cli_inner_pretty.js:968424-968507`; `EVh` at
`968539-968937`.

## 3. Workspace and conversation preservation

### Ownership-aware worktree cleanup

**What it does:** Prevents one background session or stale sweep from deleting a linked worktree owned by
another live Claude process or from discarding unverified user work.

**How it works:**
1. Worktree creation records a lock reason containing the owning process identity.
2. `acquireWorktreeOwnershipLock` (`v9u`) reads an existing lock before deciding whether it is stale; an
   unreadable registry causes the session to act as a guest.
3. A matching live owner leaves the lock untouched. Only a verifiably stale Claude-owned lock is cleared
   and reacquired.
4. `cleanupSessionWorktree` (`Cbt`) changes back to the original directory before cleanup and dispatches
   the configured remove hook for hook-managed worktrees.
5. Git-managed cleanup rereads the registry and proves that the lock reason is its own before removing
   the worktree.
6. Reparse points, unreadable registries, foreign locks, failed git removal, and removal-hook failure all
   preserve the directory and emit a reason.
7. Stale-job reaping checks lock liveness and the job cutoff before removal.
8. `releaseStaleClaudeWorktreeLocks` (`L9u`) caps each sweep and rechecks the registry immediately before
   unlocking, closing the time-of-check/time-of-use race.

**Why this approach:**
- The same repository can contain interactive, forked, team, and background worktrees concurrently.
- Fail-closed cleanup preserves user changes when ownership or path safety cannot be proved.
- Rechecking immediately before unlock handles an owner replacement after the initial scan.
- Conservative retention can leave artifacts requiring later cleanup, an accepted cost for data safety.

**Key insight:** A stale-looking path is never enough to authorize deletion; cleanup requires path,
registry, lock-reason, and process-liveness evidence to agree.

Evidence: `v9u` at `cli_inner_pretty.js:193834-193868`; `Cbt` at `194211-194305`; stale reaping and
lock release at `194702-194842`.

### Interactive-to-background fork handoff

**What it does:** Transfers a live interactive session into a durable background job without losing
task-registry state, partial assistant text, bridge sequencing, or worktree ownership.

**How it works:**
1. The fork path creates the background job with cwd, optional worktree metadata, session permission
   rules, memory policy, and an initial in-flight marker.
2. It checkpoints restartable agent/task state into `adopt.json` before launching the child.
3. For abort-then-fork, it preserves at most the final 16 KiB of partial assistant text plus the boundary
   UUID, avoiding unbounded handoff payloads.
4. Remote-control bridge metadata carries the bridge session, last sequence, grouping, ownership, and
   no-backfill policy into the child environment.
5. The bridge is flushed under a two- or five-second cap, then torn down without archiving the session.
6. The task list is carried under a separate two-second timeout.
7. Launch completion updates a shared settlement record. On failure, adoption state is abandoned or
   retained only while a queued launch may still consume it.
8. The original turn is aborted only after handoff data has been flushed and the launch is in motion.

**Why this approach:**
- The parent and child cannot atomically transfer process memory, task state, and network sequencing.
- Writing adoption state first creates a recoverable handoff journal.
- Size and time caps keep a background transition from freezing the interactive UI.
- A bounded partial-response tail preserves useful continuation context without copying an arbitrarily
  large stream.

**Key insight:** The fork is a small saga: persist recovery material, flush external sequencing, launch,
then relinquish the parent. Failure handling is based on which of those commitments occurred.

Evidence: background handoff at `cli_inner_pretty.js:901650-901772`.

## 4. Status and notification truthfulness

### Resume-time orphan classification

**What it does:** Converts background work with no completion record into truthful user-visible outcomes
and restarts only agents whose on-disk transcript is recent and structurally resumable.

**How it works:**
1. Transcript reconstruction collects launches, completion results, explicit stops, prior notifications,
   re-dispatches, background shells, workflows, and deleted cron IDs.
2. `reconcileOrphanedAgentsOnResume` (`EGv`) ignores already-notified work and agents that are still live
   in the current registry.
3. For each remaining agent it probes the output/transcript mtime and, for eligible Agent/forked-skill
   launches, validates resumable metadata.
4. A resumable transcript modified within 48 hours is handed to the auto-resume path.
5. A saved transcript without eligible resume metadata is marked stopped, because progress exists even
   though completion is unknown.
6. A launch with no saved transcript is marked failed because its in-process state was lost.
7. Re-dispatched agents get a distinct ambiguity warning; they may have been stopped by UI/SDK teardown,
   which leaves no transcript marker.
8. More than 20 orphans are summarized into one bounded notification and internal markers prevent the
   aggregate from being emitted repeatedly.
9. Shell commands and workflows use parallel classifiers, including workflow `resumeFromRunId` advice.

**Why this approach:**
- “No completion record” is not equivalent to “failed”; disk evidence changes what can be recovered.
- A 48-hour freshness bound avoids automatically reviving obsolete work forever.
- Aggregation prevents a damaged or very old transcript from flooding the next model turn.
- Detailed uncertainty is more verbose than a generic failure, but prevents users and the model from
  assuming work landed when it may only be partial.

**Key insight:** The classifier separates execution loss from notification loss and from resumable disk
state. Those cases require different recovery actions even though all lack a completion marker.

Evidence: transcript reconstruction at `cli_inner_pretty.js:901974-902151`; `EGv` at
`902162-902240`; notification constructors at `902241-902403`.

### Seen-result accounting and exit destination

**What it does:** Records when finished background results actually become visible and decides whether
leaving the agents screen can safely return to the originating job.

**How it works:**
1. `chooseAgentsViewExitDestination` (`AAh`) exits normally when there is no origin job.
2. If origin spawning is still unsettled, it waits; a failed spawn or missing origin row exits with a
   recovery hint instead of attempting a broken attachment.
3. Only a settled, successful, still-present origin is reattached.
4. `emitSeenBackgroundResults` (`CAh`) snapshots terminal jobs present when the view opens.
5. Each newly visible finished row is emitted at most once with outcome, entry channel, completion-to-see
   latency, missing-terminal-time marker, and whether its lifetime overlapped another job.
6. Interval overlap is computed from creation and first-terminal timestamps, using `now` only when a
   terminal time is absent.

**Why this approach:**
- UI navigation must not resurrect a job whose durable origin no longer exists.
- A “result produced” metric cannot measure whether the operator ever saw it; render-time accounting can.
- Snapshotting the initially finished set distinguishes results discovered on open from results that
  completed while the view was mounted.
- Deduplication sacrifices repeated-view counts in favor of one meaningful visibility event per mount.

**Key insight:** Completion and observation are separate events. The agents view explicitly measures the
second and refuses to infer an attachable origin from stale navigation state.

Evidence: `AAh` and `CAh` at `cli_inner_pretty.js:895067-895115`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `readJobState` (`Vl`) - Loads bounded, validated job state.
- `writeJobState` (`rg`) - Atomically publishes normalized job state.
- `adoptRosterOrphans` (`w9d`) - Reconstructs jobs for identity-verified live workers.
- `readVerifiedDaemonLock` (`xU`) - Validates daemon process identity.
- `runBackgroundDaemon` (`EVh`) - Owns supervisor election, lifetime, and teardown.
- `reconcileDaemonWorkers` (`yVh`) - Applies last-good daemon configuration.
- `reconcileOrphanedAgentsOnResume` (`EGv`) - Classifies incomplete prior background work.
