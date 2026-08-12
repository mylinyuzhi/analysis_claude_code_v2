# Environment/work bridge scheduler

The environment/work bridge is the local worker behind `claude remote-control`/environment work. It
registers a machine, long-polls for leased work, and spawns one or more local Claude session
processes. It is not the Chrome WebSocket relay and not the Remote Control client transport analyzed
in module 54. Its core abstraction is a capacity-limited lease scheduler.

## 1. Control-plane API

### Authenticated request with one refresh-and-retry

**What it does:** Builds environment API requests with runner/device identity and recovers once from
an expired access token without entering an unbounded authentication loop.

**How it works:**
1. `createEnvironmentBridgeApi` (`XRa`) obtains the current access token lazily for each operation.
2. Headers include bearer auth, API version, required beta, runner version, user agent, and an
   optional trusted-device token.
3. A request helper executes the operation once.
4. Any status other than 401 returns immediately to normal status classification.
5. On 401, the helper calls `onAuth401` with the token that failed so the refresh layer can avoid
   replacing a newer token incorrectly.
6. If refresh succeeds, it retrieves the current token again and retries the request once.
7. A second 401 returns the original failure path; no recursive refresh is attempted.
8. Registration, stop, deregistration, archive, and reconnect use this helper. Poll/ack/heartbeat use
   their lease token directly as required by those endpoints.

**Why this approach:**
- Lazy token reads keep operations synchronized with external refresh state.
- Comparing/handing the failed token to the refresh callback prevents a stale request from
  overwriting a token another concurrent operation already refreshed.
- One retry handles normal expiration while bounding latency and avoiding credential storms.
- Lease-scoped calls deliberately use their session/work token instead of broad user auth.

**Key insight:** Authentication state has two scopes: environment management uses the user token,
while work polling and session leases use server-issued ingress tokens. Treating them as one token
would break both refresh and least-privilege boundaries.

Evidence: `XRa` at `cli_inner_pretty.js:624758-624957`.

### Typed status and rate-limit classification

**What it does:** Converts HTTP statuses into actionable bridge lifecycle errors, including session
expiry and server-directed poll delay.

**How it works:**
1. Success is limited to 200/204.
2. A 401 becomes an authentication error with a login hint.
3. A 403 is inspected for expiry/lifetime semantics; an expired Remote Control resource is separated
   from an organization-permission denial.
4. A 404 reports unavailable/not found; 410 becomes an explicit environment-expired error.
5. A 429 parses `Retry-After` into `retryAfterMs` and attaches it to the thrown error.
6. Other failures preserve status and a sanitized server message.
7. Higher-level predicates distinguish resource-gone, missing scopes, network errors, server
   responses, and fatal typed bridge errors.

**Why this approach:**
- Poll loops need different responses to invalid auth, expired environment state, throttling, and a
  transient network break.
- Preserving server-directed retry time avoids a client-side retry schedule fighting the gateway.
- Typed status remains machine-readable while messages stay useful to operators.

**Key insight:** “Request failed” is not one retry class. Expired resources terminate or re-create a
lifecycle; throttling delays it; connection errors consume a separate availability budget.

Evidence: `validateEnvironmentBridgeResponse` (`Rst`) at `cli_inner_pretty.js:624958-624987`.

## 2. Polling and capacity

### Liveness-safe poll configuration

**What it does:** Loads remotely tunable polling intervals while preventing a configuration that
silences both polling and lease heartbeat at full capacity.

**How it works:**
1. `getEnvironmentBridgePollConfig` (`Hkt`) reads `tengu_bridge_poll_interval_config` through a
   five-minute cache.
2. Schema validation requires active polling intervals to be at least 100 ms.
3. At-capacity intervals may be zero to disable that polling mode.
4. Independent intervals exist for empty, partial-capacity, and full-capacity multi-session states.
5. Lease reclaim defaults to 5 seconds; session keepalive defaults to 120 seconds.
6. Two cross-field refinements require either a non-exclusive heartbeat or a nonzero at-capacity poll
   interval for both legacy and multi-session variants.
7. Any invalid remote payload falls back atomically to the complete default object.

**Why this approach:**
- Remote tuning permits load-shedding without a client release.
- Per-capacity intervals avoid aggressive polling when no local slot can accept work.
- Zero is useful as an explicit disabled state, but disabling every liveness mechanism would allow
  leases to expire silently.
- Whole-object fallback avoids mixing unvalidated fields with defaults in surprising combinations.

**Key insight:** The schema validates relationships, not just individual numbers. Full capacity must
still have a path to renew leases or discover a capacity change.

Evidence: `Hkt` and its schema/defaults at `cli_inner_pretty.js:628390-628464`.

### Capacity-aware poll and heartbeat state machine

**What it does:** Polls rapidly when slots are available, backs off at capacity, and renews active
work while waiting.

**How it works:**
1. `runEnvironmentBridgeLoop` (`nDa`) tracks active child sessions, work IDs, display IDs,
   worktrees, title state, completed work IDs, and token-refresh schedulers in separate maps/sets.
2. Every outer iteration reloads validated poll configuration.
3. The selected server poll interval depends on whether active count is zero, below maximum, or at
   maximum.
4. A successful empty poll resets both error budgets.
5. At full capacity, heartbeat mode periodically calls `heartbeatWork` for every active session until
   capacity changes, a poll becomes due, heartbeat is disabled, auth fails, or shutdown begins.
6. A 401/403 heartbeat marks the session token stale and requests server-side session reconnect so
   fresh work can be queued.
7. Wake signals interrupt capacity waits when a child exits, so the loop does not sleep through a new
   free slot.
8. Completed work IDs are remembered and never spawned again; the loop still honors the appropriate
   full-capacity wait.

**Why this approach:**
- Polling every two seconds at capacity wastes control-plane traffic because the worker cannot accept
  more sessions.
- Stopping all traffic at capacity loses lease liveness and delays reuse after a child exits.
- A wakeable wait responds faster than a fixed sleep while retaining load control.
- Separate maps make each identity domain explicit; a work ID is not interchangeable with a session
  ID or displayed CCR ID.

**Key insight:** Heartbeat mode is not merely slower polling. It changes the operation from acquiring
new work to preserving already acquired leases until capacity returns.

Evidence: `nDa` at `cli_inner_pretty.js:628996-629245`.

## 3. Work admission and child ownership

### Acknowledge, register epoch, isolate, then spawn

**What it does:** Admits a leased session only after validating its secret, acknowledging delivery,
registering worker ownership, and creating requested worktree isolation.

**How it works:**
1. The work secret is decoded before use. Decode failure marks the work completed locally and sends
   a stop operation rather than spawning with untrusted/malformed credentials.
2. Healthchecks are acknowledged and produce no child.
3. Session work validates the session ID.
4. If that session is already active, the existing child and token scheduler receive the new ingress
   token, the work-ID association is updated, and the work is acknowledged.
5. A new session is not acknowledged/spawned when local capacity is already full.
6. Accepted work is acknowledged before expensive setup.
7. The client registers a CCR worker and obtains a worker epoch, retrying once after two seconds.
8. A requested worktree is created before spawn unless the attached session already owns the target.
9. Failure to create the worktree stops the work and does not fall back to the shared checkout.
10. `spawnEnvironmentBridgeSession` (`MMS`) launches the child with session ID, SDK URL, ingress
    token, worker epoch, and chosen directory.
11. Only a successfully spawned child enters the active maps and token/heartbeat schedulers.

**Why this approach:**
- Acknowledgement communicates that this worker owns the lease; doing it after arbitrary long setup
  could cause server redelivery.
- Worker epochs prevent an older child/process from continuing to publish after ownership changes.
- Updating an existing child is safer and cheaper than spawning a duplicate session.
- Worktree creation is fail-closed because silently using the main checkout would violate the
  isolation requested by the work item.

**Key insight:** The worker epoch is the distributed ownership token, while the OS child process is
only the local execution mechanism. A valid PID without a current epoch is not authorized to act as
the session worker.

Evidence: `MMS` and `nDa` at `cli_inner_pretty.js:628988-628995`, `629246-629455`.

### Completion, archival, and worktree disposition

**What it does:** Reconciles child exit status with lease stopping, session archival, worktree
cleanup, and single- versus multi-session lifecycle.

**How it works:**
1. The child completion callback removes every session-associated map entry and wakes the poll loop.
2. It records duration and classifies `completed`, `failed`, or `interrupted`.
3. Non-interrupted work IDs are added to the completed set and asynchronously stopped with bounded
   retry.
4. A failed session is remembered as having ended while offline/invalid when appropriate.
5. Failed sessions keep their worktree for recovery; successful or interrupted sessions schedule
   cleanup.
6. In multi-session mode, completed server sessions are archived and the environment returns to
   idle. A failed session is not automatically archived, preserving recovery visibility.
7. In single-session mode, any non-interrupted completion aborts the outer loop so the environment
   tears down.
8. Display and title state are keyed independently from raw session IDs to survive CCR ID projection
   and remote rename.

**Why this approach:**
- Work lease completion and session archival are distinct remote operations and may fail
  independently.
- Keeping a failed worktree prioritizes user work preservation over automatic disk cleanup.
- Multi-session environments are reusable workers; single-session environments are scoped to one
  terminal lifecycle.
- Asynchronous cleanup prevents slow remote/archive operations from blocking capacity release.

**Key insight:** Failure deliberately leaks a recoverable worktree rather than deleting evidence and
work. Cleanup policy is driven by preservation semantics, not merely process exit.

Evidence: the child completion closure inside `nDa` at `cli_inner_pretty.js:629075-629157`.

## 4. Reliability and shutdown

### Split error budgets with sleep-gap reset

**What it does:** Retries network/server failures without allowing a laptop sleep interval to consume
the retry budget or one error class to poison another.

**How it works:**
1. Typed bridge API errors such as fatal auth/resource expiry leave the loop with a specific status.
2. Connection and bad-server-response errors use a connection elapsed-time budget and exponential
   delay with ±25% jitter.
3. Other unexpected errors use an independent general-error budget and independent delay curve.
4. A success clears both budgets.
5. When the wall-clock gap since the last error sample exceeds twice the connection backoff cap, the
   loop classifies it as system sleep and resets both budgets.
6. Activity in one error class clears counters for the other class, so a sporadic parse error does
   not inherit minutes of network-outage history.
7. If heartbeat is enabled, retry waits also attempt lease renewal.
8. Exceeding the appropriate give-up duration marks teardown as failure rather than retrying forever.

**Why this approach:**
- Network availability and program/data errors have different expected recovery behavior.
- Elapsed-time budgets are more meaningful than attempt counts under jitter and variable backoff.
- Sleep produces a large wall-clock gap with no failed attempts; counting it as outage time would
  terminate immediately after wake.
- Jitter prevents many resumed workers from retrying in lockstep.

**Key insight:** System sleep is inferred from the sampling gap, not from a platform-specific power
event. This keeps the scheduler portable while protecting the retry budget.

Evidence: `nDa` at `cli_inner_pretty.js:629456-629543`.

### Graceful, preservable teardown

**What it does:** Stops children and leases in a recoverable order, with an explicit mode that
preserves the environment for later resume.

**How it works:**
1. Shutdown stops status refresh and snapshots active sessions/work-ID associations.
2. Every child receives a graceful kill signal.
3. The loop waits for all children or a configurable grace period (default 30 seconds).
4. Remaining children are force-killed.
5. Token refresh schedules are canceled and owned worktrees are cleaned unless earlier failure policy
   preserved them.
6. Active server work items receive forced stop requests.
7. Outstanding asynchronous stop/archive tasks settle before environment disposal.
8. With `preserveOnShutdown` and no fatal error, the function skips archival and deregistration and
   prints the exact resume command.
9. Otherwise it archives the relevant sessions, deregisters the environment, and clears the local
   environment pointer when this process owns it.

**Why this approach:**
- Grace before force gives child processes time to flush transcript and repository state.
- Server stop follows local termination so the server cannot assign replacement ownership while the
  old child still runs.
- Preserve mode supports intentional disconnect/restart without destroying resumable server state.
- Pointer cleanup is ownership-conditional to avoid one process erasing another process’s current
  registration.

**Key insight:** Teardown has two valid terminal states: offline-and-disposed or offline-but-resumable.
Conflating them would make Ctrl-C destroy environments that were meant to survive a client restart.

Evidence: `nDa` at `cli_inner_pretty.js:629544-629626`.

## Environment bridge versus self-hosted runner

Both systems execute remote requests locally, but their ownership models differ:

| Dimension | Environment/work bridge | Self-hosted runner |
|---|---|---|
| Primary user | Logged-in Claude Code user | Team/Enterprise operator |
| Registration | Per environment/machine bridge | Durable runner pool member |
| Work unit | Remote Control/environment session | Self-hosted runner lease |
| Local isolation | Optional per-session worktree | Per-session directory under validated base dir |
| Analysis module | This document | [60_self_hosted_runner](../60_self_hosted_runner/) |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createEnvironmentBridgeApi` (`XRa`) — authenticated environment/work REST client.
- `validateEnvironmentBridgeResponse` (`Rst`) — typed status and retry metadata classifier.
- `getEnvironmentBridgePollConfig` (`Hkt`) — cached, cross-field liveness configuration.
- `spawnEnvironmentBridgeSession` (`MMS`) — exception-safe child spawn boundary.
- `runEnvironmentBridgeLoop` (`nDa`) — lease, capacity, child, retry, and shutdown state machine.
