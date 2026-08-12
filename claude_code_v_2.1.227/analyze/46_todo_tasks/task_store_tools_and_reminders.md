# Task store, tools, and reminders in 2.1.227

## 1. Two task surfaces remain mutually exclusive

### V1 `TodoWrite` versus V2 persistent Task tools

**What it does:** Exposes one task-management model at a time, preventing a session from maintaining
two competing sources of progress state.

**How it works:**
1. `isTaskTrackingEnabled` (`fO`, `:340086-340089`) returns false only when
   `CLAUDE_CODE_ENABLE_TASKS` is the boolean false value.
2. `TodoWriteTool` (`Y6p`, `:554819-554870`) is enabled only when persistent tasks are disabled and
   the model-specific kill switch is inactive.
3. `TaskCreateTool` (`WYp`), `TaskGetTool` (`YYp`), `TaskUpdateTool` (`ZYp`), and `TaskListTool`
   (`o7p`) invert the first condition: each requires persistent tasks and the same kill switch to pass.
4. V1 replaces a per-agent in-memory list on every call and stores an empty list when all entries are
   complete (`:554852-554860`).
5. V2 stores individually addressable records with stable ids, owners, dependency edges, metadata,
   and three durable statuses.
6. The 2.1.227 enablement predicate is the remangled equivalent of 2.1.220 `QL`; the mutual-exclusion
   contract is retained.

**Why this approach:**
- A replacement list is simple for one interactive agent, while stable records are necessary for
  teams, ownership, dependencies, and concurrent writers.
- Exposing both tools would let the model update one list while the UI or teammates read the other.
- One shared kill switch makes emergency model compatibility policy consistent across both surfaces.

**Key insight:** V2 is not merely a richer `TodoWrite` schema. It changes the state model from one
replaceable value to a shared record set, so exclusivity is required for semantic consistency.

## 2. Availability includes a fail-open model compatibility switch

### Model-targeted task suppression

**What it does:** Removes all task-management tools for model ids selected remotely by substring.

**How it works:**
1. `isTaskTrackingSuppressedForModel` (`cle`, `:554597-554606`) reads the GrowthBook value
   `tengu_vellum_ash` with an empty-array default.
2. A non-array or empty value disables suppression.
3. The current resolved model id is compared with every nonempty configured substring.
4. Any match suppresses both V1 and V2 tool objects; the system-prompt task projection also checks the
   same predicate at `:583101`.
5. Exceptions return false, preserving normal tool availability when experiment state is malformed.

**Why this approach:**
- Server-configured substrings allow a rapid compatibility response without shipping a new client.
- Matching substrings is flexible across dated model ids, but can select more models than an exact-id
  allowlist; rejecting empty entries avoids the universal-match trap.
- Failing open favors continued task support over letting a feature-service failure silently remove a
  core workflow aid.

**Key insight:** The switch is enforced at tool discovery and prompt construction, not only at call
time. A suppressed model is not encouraged to call tools it cannot see.

## 3. Task-list identity is contextual but path-safe

### Shared-list identity resolution

**What it does:** Chooses the namespace that standalone sessions, team leaders, and teammates use for
the same logical task list.

**How it works:**
1. `getTaskListId` (`Y6`, `:340138-340142`) first honors explicit
   `CLAUDE_CODE_TASK_LIST_ID`.
2. An in-process teammate context contributes the team name next.
3. Process team state, the leader's remembered team name, and finally the session id form the fallback
   ladder.
4. `sanitizeTaskKey` (`b9`, `:340144-340146`) replaces every character outside ASCII letters,
   digits, underscore, and hyphen with `-`.
5. `getTaskListDir` (`oJ`, `:340147-340149`) uses the sanitized id under the configuration `tasks`
   directory; Storage V5 uses the same normalized component in structured keys.

**Why this approach:**
- Explicit ids support SDK and externally coordinated sessions.
- Team-name resolution lets process and in-process teammates converge on the leader's records.
- Sanitizing at the storage boundary blocks separators and traversal, though replacement can cause two
  exotic ids to normalize to the same namespace.

**Key insight:** Identity precedence is a coordination protocol. The path helper is also the canonical
normalizer for the non-filesystem backend, preventing backend-dependent namespace drift.

## 4. One logical repository has two persistence adapters

### Filesystem and Storage V5 dispatch

**What it does:** Preserves the established per-task JSON behavior while supporting an injected keyed
storage service for hosted and remote execution paths.

**How it works:**
1. Every core operation accepts an optional Storage V5 handle: high-water reads/writes, reset, create,
   get, update, delete, list, dependency updates, claims, reminders, and fork carry.
2. Without the handle, records remain `<config>/tasks/<list>/<id>.json`, with `.lock` and
   `.highwatermark` siblings.
3. With the handle, task ids become structured task keys and the high-water mark receives its own
   structured key (`:340052-340078`).
4. `listStorageTaskIds` (`iGd`, `:340156-340173`) paginates a namespace and treats errors or page-cap
   exhaustion as a failed listing rather than a partial result.
5. `readStoredTaskList` (`k6_`, `:340174-340203`) consumes inline values when valid and otherwise
   schedules point reads; it awaits every scheduled promise even on listing failure before returning.
6. Both paths parse through the same schema and sort ids numerically before exposing records.

**Why this approach:**
- Keeping the old adapter preserves local interoperability and human-debuggable files.
- Keyed storage supplies conditional and atomic operations that ordinary shared filesystems cannot
  provide reliably in hosted execution.
- A common semantic layer reduces tool-level branching, at the cost of optional-backend parameters on
  many internal functions.

**Key insight:** Storage V5 is an adapter beneath the task domain, not a second task implementation.
The record schema and tool contracts remain invariant while durability primitives change.

## 5. IDs never move backward, even after deletion or an inconsistent listing

### Monotonic task-id allocation

**What it does:** Allocates numeric string ids without reusing ids that were deleted, reset, or hidden
by a temporarily incomplete backend listing.

**How it works:**
1. The allocator reads both the highest visible numeric task id and the stored high-water mark in
   parallel, then chooses their maximum (`:340222-340240`).
2. `createTask` (`lGd`, `:340242-340280`) holds the list-level filesystem lock during selection.
3. The filesystem adapter writes `max + 1` directly because the lock serializes local creators.
4. Storage V5 writes the candidate with an `ifAbsent` precondition.
5. An `AlreadyExists` result, plus a small set of collision-like storage telemetry codes, means the
   listing missed an occupied key; the candidate is recorded in the high-water mark and incremented.
6. The collision loop stops after 16 attempts and raises a diagnostic error rather than searching
   forever.
7. Deletion and reset advance the high-water mark before removing records.

**Why this approach:**
- A high-water mark prevents old task references from silently pointing at newly created work.
- Conditional write is the true uniqueness primitive in distributed storage; a preceding list is only
  a starting estimate.
- Sixteen retries tolerate bounded staleness but cap latency and expose pathological namespace damage.

**Key insight:** The listing finds a candidate; `ifAbsent` proves ownership of it. Treating the write,
not the scan, as authoritative closes the distributed allocation race.

## 6. Storage updates retry only a diagnosed transient

### Optimistic atomic update loop

**What it does:** Applies read-modify-write transformations atomically without retrying arbitrary
errors or rerunning mutations unboundedly.

**How it works:**
1. `atomicUpdateStoredTask` (`F8s`, `:340325-340357`) passes a callback to the storage backend's atomic
   `update` operation.
2. The callback parses the current value, computes either a new record plus result or a skip plus
   result, and serializes only when a write is requested.
3. A successful write emits the task-list update signal; a successful skip returns without a false UI
   invalidation.
4. Only `Unavailable` with telemetry code `LockSuspect` is retried.
5. Server-provided `retryAfterMs` wins; otherwise a bounded backoff is used.
6. The loop stops after five attempts and converts the backend error into a task-specific failure.
7. `updateTask` (`Krt`, `:340359-340379`) additionally takes a local lock anchor so in-process and
   filesystem-era callers retain familiar serialization behavior.

**Why this approach:**
- Atomic callbacks avoid lost updates between competing owners or dependency writers.
- Retrying all `Unavailable` failures could duplicate work or hide persistent faults.
- Five attempts are a reliability/latency trade-off: enough for transient lock-state convergence,
  bounded for interactive responsiveness.

**Key insight:** Retry eligibility is semantic, not merely HTTP-like. The code retries only the
backend's explicit “lock may be suspect” condition, where re-evaluating the pure update callback is safe.

## 7. Reads degrade per record, but listings never masquerade as complete

### Schema validation and partial-record tolerance

**What it does:** Keeps one malformed or disappearing task from breaking an entire list while refusing
to convert a failed namespace listing into an apparently empty list.

**How it works:**
1. Every record must satisfy the task schema: id, subject, description, status, both dependency arrays,
   optional active form/owner, and optional metadata (`:340529-340546`).
2. `parseStoredTask` (`w2o`, `:340282-340293`) logs schema or JSON failures and returns null.
3. Local point reads distinguish `ENOENT` from unexpected I/O failures; both become null, but serious
   errors are additionally reported (`:340306-340323`).
4. List operations filter null records and preserve numeric ordering.
5. Storage namespace listing returns null on service error or page-cap exhaustion; reset refuses to
   proceed when that happens.
6. Tool-facing `TaskList` filters records marked with internal metadata so system-owned tasks do not
   leak into the model's ordinary work list.

**Why this approach:**
- A single corrupt record should not make all task coordination unavailable.
- Destructive operations need a stronger guarantee: an incomplete list cannot safely prove that all
  work is complete.
- Returning an empty list for missing local directories preserves first-run behavior, while explicit
  remote listing failure protects distributed data.

**Key insight:** Read tolerance and destructive safety deliberately differ. Per-record damage is
skippable; uncertainty about the set of records is not.

## 8. Completed-list reset closes a time-of-check/time-of-use window

### Lock-scoped reset validation

**What it does:** Clears a finished task list for UI reuse without deleting work that became active
between the UI's decision and the reset operation.

**How it works:**
1. The watcher first observes a nonempty list in which every task is complete and schedules a delayed
   hide/reset (`:649320-649344`).
2. `resetCompletedTaskList` (`oGd`, `:340090-340137`) acquires the list lock.
3. While holding that lock, it lists and parses the tasks again.
4. If any valid record is not complete, or a Storage V5 listing/read is incomplete, reset returns
   false without deleting anything.
5. It records the highest id in the high-water mark, deletes task records, and emits an update only
   after the guarded check succeeds.
6. The 2.1.220 reset relied on the caller's pre-lock “all complete” check and did not repeat it inside
   the destructive critical section.

**Why this approach:**
- UI delay gives users time to see completed work, but also gives another writer time to create or
  reopen a task.
- Rechecking under the same lock as deletion is the standard TOCTOU repair.
- The extra list/read cost occurs only at list retirement, where correctness outweighs latency.

**Key insight:** The important 2.1.227 change is not the existing lock; it is moving the completion
predicate inside that lock so the predicate and deletion describe one state snapshot.

## 9. Claims have task-local and list-global atomicity levels

### Task ownership arbitration

**What it does:** Assigns a task only when it exists, is unresolved, is not owned by someone else, and
has no open blockers; optionally it also ensures the claimant owns no other open task.

**How it works:**
1. `claimTask` (`fGd`, `:340441-340473`) performs a clean preflight read so missing records return a
   typed `task_not_found` result rather than a lock error.
2. The normal path serializes on the target task and rejects a different owner or completed status.
3. It builds the set of open task ids and intersects it with `blockedBy`; only blockers still open
   prevent the claim.
4. In Storage V5, `decideAtomicTaskClaim` (`Z4d`, `:340475-340485`) first asks for the open-blocker set
   only when the record actually has dependencies, then repeats the atomic update with that set.
5. With `checkAgentBusy`, `claimTaskWithBusyCheck` (`L6_`, `:340487-340510`) takes the entire list lock,
   evaluates target state, blockers, and all other ownership, then writes the claim.
6. Failures use explicit reasons: not found, already claimed, already resolved, blocked, or agent busy.

**Why this approach:**
- Task-local locking permits independent tasks to be claimed concurrently.
- The “one active task per agent” invariant spans every record and therefore requires list-level
  serialization.
- The two-stage Storage V5 blocker check avoids listing the namespace for dependency-free tasks, but
  introduces an extra atomic update when blockers exist.

**Key insight:** Lock granularity follows invariant scope. Ownership of one task is local; proving an
agent owns no other task is inherently global to the list.

## 10. Dependency edges are denormalized and repaired on deletion

### Bidirectional dependency maintenance

**What it does:** Stores both “A blocks B” and “B is blocked by A” so either task can be rendered or
checked without a reverse scan.

**How it works:**
1. `addBidirectionalDependency` (`z8s`, `:340426-340433`) reads both endpoints concurrently.
2. Missing either endpoint aborts the operation.
3. It appends the target to the source's `blocks` list only when absent.
4. It appends the source to the target's `blockedBy` list only when absent.
5. `deleteTask` (`T2o`, `:340381-340410`) removes the record, lists survivors, and filters the deleted
   id from both arrays on every affected record.
6. `TaskList` hides dependencies whose source is already complete, while `TaskGet` retains full stored
   detail.

**Why this approach:**
- Denormalization makes common reads and UI rendering cheap.
- Two separate updates can temporarily expose a one-sided edge; the system accepts eventual repair
  instead of requiring a multi-key transaction not shared by both backends.
- Cleanup on deletion prevents permanent phantom blockers.

**Key insight:** Persisted dependency arrays describe topology, while claimability is computed from
topology plus current status. A completed predecessor can remain in history without blocking work.

## 11. Task creation repairs only recognizable model mistakes

### Bounded TaskCreate input coercion

**What it does:** Converts common near-miss input shapes into the strict one-task schema while refusing
ambiguous bulk or delegation requests.

**How it works:**
1. `coerceTaskCreateInput` (`BYp`, `:558499-558529`) accepts only a plain object and immediately rejects
   `tasks` or `todos` containers.
2. Agent-tool fields such as `prompt` or `subagent_type` cause rejection unless valid subject and
   description fields are already present.
3. A single `task` wrapper may contain a string or object; bulk and Agent-like nested shapes are again
   rejected.
4. Known aliases map `title`/`name` to subject, `content` to description, and `active_form` to
   `activeForm`.
5. A lone subject is copied into description; a lone description receives a derived subject capped at
   80 Unicode code points, preferably cut on a word boundary after position 40 (`CsS`, `:558491-558497`).
6. Once required strings exist, unsupported fields are stripped and invalid optional values are
   dropped.
7. `steerTaskCreateValidation` (`FYp`, `:558531-558538`) gives specific correction text for bulk-task
   and Agent-tool confusion rather than a generic schema error.

**Why this approach:**
- Model calls often miss by one wrapper or familiar alias; repairing those improves completion without
  weakening the public schema.
- Refusing arrays avoids silently creating only one item from a multi-task request.
- Refusing Agent-shaped inputs prevents accidental task creation when the model intended delegation.
- Unicode code-point slicing preserves emoji surrogate pairs, though it does not guarantee complete
  grapheme clusters for all combining sequences.

**Key insight:** Coercion is intent-preserving, not permissive parsing. It repairs shapes that still
unambiguously mean “create one task” and explicitly redirects shapes that mean something else.

## 12. Hooks turn create and completion into guarded transitions

### Task lifecycle hook arbitration

**What it does:** Lets trusted hooks veto task creation or completion without leaving the visible task
state inconsistent with the veto.

**How it works:**
1. `TaskCreateTool` allocates and writes the pending record first (`:558670-558684`).
2. It streams all `TaskCreated` hook results and collects blocking errors.
3. If any hook blocks, the tool deletes the newly written task and throws the combined messages
   (`:558685-558700`).
4. Only a successful transition expands the task UI and returns the new id.
5. `TaskUpdateTool` runs `TaskCompleted` hooks before including `status: completed` in its update
   object (`:559020-559045`).
6. Any blocking result returns failure with no completion write; cancellation of the hook control
   stream is logged but does not fabricate a blocking result.

**Why this approach:**
- Create hooks need an id and durable context, so validation occurs after provisional creation and
  requires compensating deletion.
- Completion hooks can run before the state change and therefore avoid rollback.
- Aggregating all blocking messages gives the model actionable feedback from multiple policies.

**Key insight:** The two transitions use different transaction shapes because their hooks need
different preconditions: create is write-then-compensate; complete is validate-then-write.

## 13. TaskUpdate coordinates fields, ownership messages, and topology

### Multi-effect task update orchestration

**What it does:** Applies ordinary field changes while routing deletion, completion, assignment, and
dependency changes through their specialized side effects.

**How it works:**
1. `TaskUpdateTool` (`ZYp`, `:558937-559093`) reads the latest record and constructs only changed
   scalar fields.
2. Metadata is merged key by key; a null value deletes that key rather than storing null.
3. `status: deleted` bypasses ordinary update and invokes dependency-cleaning deletion.
4. Completion invokes the hook gate before the status change.
5. In team mode, moving an unowned task to `in_progress` implicitly assigns the current agent.
6. After an owner change, a structured `task_assignment` frame is written to the recipient mailbox.
7. New `blocks` and `blockedBy` values are filtered against existing edges and then applied through
   the bidirectional helper.
8. The result reports the exact changed-field list and old/new status when relevant.

**Why this approach:**
- A single public tool is easier for the model, while specialized internal operations preserve
  invariants.
- Sparse updates reduce writes and make result feedback precise.
- Assignment messaging happens after persistence, so recipients never receive ownership that failed
  to commit; mailbox failure can still leave a valid assignment without notification.

**Key insight:** `TaskUpdate` is an orchestrator, not a generic object merge. Status, owner, metadata,
and dependencies each carry domain-specific semantics beyond their JSON fields.

## 14. Reminder scheduling uses two independent inactivity clocks

### Todo and task reminder attachment cadence

**What it does:** Nudges the model only after it has ignored task management long enough and has not
recently received the same reminder.

**How it works:**
1. `getTodoReminderMode` (`Kwa`, `:592101-592105`) gives the explicit environment setting precedence,
   then maps `tengu_soft_slate_nudge` to baseline/off.
2. `scanTodoReminderHistory` (`O_S`, `:593395-593416`) walks backward to the latest `TodoWrite` call and
   latest `todo_reminder`, counting ordinary assistant turns.
3. `scanTaskReminderHistory` (`B_S`, `:593431-593452`) performs the equivalent scan for TaskCreate or
   TaskUpdate and `task_reminder`.
4. Special assistant frames are ignored so protocol bookkeeping does not age the clocks.
5. A reminder requires both counters to reach 10 turns (`iDn`, `:593792`).
6. The V1 builder requires `TodoWrite`; the V2 builder requires persistent tasks and `TaskUpdate`.
7. Both suppress themselves when the alternate task mechanism is present, then attach the current
   list and item count rather than mutating task state.

**Why this approach:**
- One clock measures model neglect; the other rate-limits repeated nudges.
- Backward scanning avoids maintaining mutable reminder counters across resume and compaction.
- Ten turns balances task hygiene against prompt noise, but scanning cost grows with distance to the
  last relevant event; early exit bounds normal cases.

**Key insight:** A reminder is eligible only at the intersection of two histories: no recent task
management and no recent reminder. This prevents both premature and repetitive nudges.

## 15. Fork carry preserves only session-private task lists

### Backend-aware task-list fork preservation

**What it does:** Copies task state when the current conversation is backgrounded into a new fork id,
without duplicating an externally named or team-shared list.

**How it works:**
1. `carryTaskListToFork` (`sGv`, `:901540-901568`) compares the active list id with the current session
   id and exits when `CLAUDE_CODE_TASK_LIST_ID` is explicit or the list is otherwise shared.
2. The local path lists the source directory, copies only files, and checks an abort signal between
   entries.
3. `carryStoredTaskListToFork` (`lGv`, `:901569-901609`) paginates task ids, then copies the high-water
   key and task keys with `ifAbsent` writes.
4. Storage V5 workers share an index and run at a fixed bounded concurrency; individual failures are
   logged and skipped.
5. The left-arrow fork path gives the whole carry operation a two-second budget and passes the same
   storage handle into the forked session (`:901720-901728`).

**Why this approach:**
- A session-private list is part of conversation continuity; a team or explicit list already has an
  identity independent of the fork.
- Best-effort copying must not block backgrounding indefinitely.
- `ifAbsent` avoids overwriting a destination that another recovery path has already populated.
- Parallel storage reads/writes reduce latency, while bounded concurrency protects the backend.

**Key insight:** The identity check is more important than the copy primitive: copying a shared list
would split one collaboration namespace into two divergent snapshots.

## 16. Agent names are reconciled at lifecycle boundaries

### Runtime-aware name-registry pruning

**What it does:** Removes stale name-to-agent bindings while retaining terminal agents that still
have non-default keepalive work.

**How it works:**
1. `pruneAgentNameRegistry` (`t5o`, `:388724-388737`) filters every registry entry against the current
   task/runtime map.
2. Direct ids and resumable-agent ids both resolve through `SZd`.
3. Missing runtime entries are discarded.
4. Nonterminal agents are retained.
5. Terminal resumable agents survive only when their keepalive reasons contain something other than
   the default background-agent reason.
6. `/clear` applies the reconciler after pruning tasks (`:405047-405058`), and resume/fork applies it
   after restoring runtime state (`:915551-915559`).

**Why this approach:**
- Boundary reconciliation avoids cloning the registry on every individual task eviction.
- Resumable and keepalive-aware lookup prevents names from being freed while meaningful work still
  exists behind a terminal-looking shell.
- Stale entries may persist between boundaries, so name allocation separately verifies that the
  mapped runtime still exists (`:388759-388769`).

**Key insight:** Readers and allocators tolerate temporary staleness; lifecycle boundaries restore a
compact canonical registry. This trades eager write cost for defensive read logic.

## 17. 2.1.220-to-2.1.227 decision summary

### Persistence refactor with stable domain semantics

**What it does:** Distinguishes genuine architectural change from identifier remangling and retained
tool behavior.

**How it works:**
1. The 2.1.220 store at `:324797-325084` uses only files and `proper-lockfile`-style locks.
2. The 2.1.227 store at `:340041-340552` retains that path and adds Storage V5 branches throughout.
3. Tool input coercion is statement-equivalent between 2.1.220 `ZTd` (`:406828-406867`) and 2.1.227
   `BYp`/`FYp` (`:558499-558538`).
4. Tool schemas, TaskCreated/TaskCompleted control flow, dependency storage, model suppression, and
   reminder thresholds remain equivalent after remangling.
5. Reset gains an internal completion recheck, and fork carry gains a Storage V5 copy algorithm.
6. No changelog bullet names these internal changes, so the report records them as an undated
   2.1.220-to-2.1.227 refactor rather than inventing a release attribution.

**Why this approach:**
- Comparing semantic anchors avoids labeling every obfuscated-name change as a rewrite.
- Calling out retained behavior is essential for a parity report: absence from the changelog does not
  make a core module unanalyzed.
- Separating verified code delta from unknown release timing preserves evidentiary accuracy.

**Key insight:** The task domain did not change shape; its persistence guarantees did. The deepest
2.1.227 work is below the tool interface, where distributed storage replaces assumptions that were
safe only for a local directory.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getTaskListId` (`Y6`) - shared namespace precedence.
- `createTask` (`lGd`) - monotonic allocation and conditional create.
- `atomicUpdateStoredTask` (`F8s`) - optimistic update/retry primitive.
- `claimTask` (`fGd`) - task-local claim path.
- `claimTaskWithBusyCheck` (`L6_`) - list-global claim path.
- `TaskCreateTool` (`WYp`) - input repair, create, hook rollback, and UI expansion.
- `TaskUpdateTool` (`ZYp`) - lifecycle and dependency orchestration.
- `buildTodoReminderAttachments` (`N_S`) - V1 reminder builder.
- `buildTaskReminderAttachments` (`F_S`) - V2 reminder builder.
