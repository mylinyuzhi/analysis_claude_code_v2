# Self-hosted runner command and session lifecycle

## Version result

The main `claude self-hosted-runner` execution surface is a verified 2.1.220-to-2.1.227 window addition:

- The target has a dedicated fast-path dispatcher at `cli_inner_pretty.js:978907-978939`, including
  `orchestrator`, `setup`, `doctor`, `code-sign`, and `decode-token` subcommands plus the fixed-fleet runner.
- The 2.1.220 bundle has no corresponding command dispatch or runner lifecycle. Its isolated
  `SELF_HOSTED_RUNNER_*` occurrence only scrubs possible inherited secrets from an unrelated child
  process.
- The 2.1.225 `--base-dir` reliability fix is visible as an ordering invariant in the target: writable
  directory validation completes before `registerRunner` can mutate server state.

The changelog attributes the command launch to 2.1.224 and the startup validation fix to 2.1.225. The
available bundles prove the aggregate addition and the final ordering, but not which intermediate build
first contained each line.

### Startup Validation Before Registration

**What it does:** Rejects invalid runner configuration and an unusable checkout root before registering a
runner that could receive sessions it cannot execute.

**How it works:**
1. `parseSelfHostedRunnerArgs` (`gYh`, `:976983-977209`) constructs defaults from environment variables,
   then applies CLI flags with strict type/range checks. Unknown flags and positional arguments fail.
2. Security-sensitive modes are parsed as closed enums. Invalid workspace-trust, repo-settings, port,
   capacity, timeout, host-rewrite, and retire-time values throw during startup.
3. `resolveRunnerEnvironmentSecret` (`_Yh`, `:977220-977249`) prefers an explicitly named secret file,
   then the current environment variable, with a warning-only fallback for the deprecated pool-secret
   name. Secret reads have a 10-second mount timeout.
4. `ensureRunnerBaseDirWritable` (`mKh`, `:973397-973414`) recursively creates the resolved base directory
   and requires both write and execute/search access.
5. The check is bounded to 10 seconds. A timeout names likely NFS/CSI mount health; ordinary errors name
   the directory, OS error, `--base-dir`, and its environment alternative.
6. `selfHostedRunnerMain` (`dhH`, `:977255-977737`) performs parse, environment validation, secret
   resolution, and base-directory validation in one guarded preflight. Failure exits with usage status 2.
7. Only after preflight does the function construct the API client and call `registerRunner`.

**Why this approach:**
- Registration is an externally visible mutation: the service may assign work as soon as the runner row
  exists. Filesystem feasibility therefore belongs before registration, not at first checkout.
- Write plus execute access is necessary on directories; checking existence or write permission alone
  would still permit a checkout root that cannot be traversed.
- A bounded async probe avoids hanging forever on unhealthy network mounts while not blocking the event
  loop with synchronous filesystem calls.
- Recursive creation makes empty volumes convenient, but creates state during validation. The state is
  local and harmless compared with advertising a broken runner remotely.

**Key insight:** The 2.1.225 fix is primarily an ordering correction. The invariant is “prove local
capacity before publishing remote capacity.”

### Registration and Control-plane API

**What it does:** Registers a capacity-bearing runner, maintains its lease/token, and converts service
assignments into local session work.

**How it works:**
1. `createRunnerApiClient` (`B4i`, `:970300-970537`) centralizes authenticated register, work-poll,
   session-token, failure-report, release, deregister, refresh, and remote-config calls.
2. Registration sends the client version, hostname label, and optional account lock. The response must
   contain a runner ID and token.
3. `selfHostedRunnerMain` retries transient registration failures up to five times with exponential delay.
   Authentication failures are identified separately and terminate with a credential-specific diagnosis.
4. The runner token is refreshed through a scheduled token manager; the mutable token state is shared by
   polling and per-session calls.
5. A health server exposes capacity, active sessions, polling freshness, initialization results, and
   per-platform counters without disclosing runner or environment secrets.

**Why this approach:**
- One API boundary gives status validation and error classification consistent semantics across polling,
  cleanup, and session startup.
- Retrying only transient classes tolerates control-plane/network startup races without hammering on an
  invalid credential.
- A renewable runner token limits the lifetime of the environment secret in normal traffic.
- The health endpoint adds observability, but its state is deliberately a projection; the service remains
  authoritative for assignments and lease ownership.

**Key insight:** The long-lived environment secret establishes the runner once. Routine execution moves to
a renewable runner token and per-session tokens, reducing credential scope as work flows downward.

### Capacity-aware Polling and Assignment Reconciliation

**What it does:** Keeps local child sessions aligned with server assignments while respecting capacity,
lease deadlines, failures, retirement, and optional low-latency wake hints.

**How it works:**
1. `runRunnerPollLoop` (`EYh`, `:977742-978445`) stores active handlers in a map keyed by session ID and
   reports `capacity - active.size` with every poll.
2. The returned assignment set is reconciled against that map. Server-deassigned sessions are aborted;
   duplicate, already-failed, reporting, released, or retirement-time assignments are not respawned.
3. A new assignment receives its own abort controller, idle/startup timers, activity state, metrics row,
   and asynchronous `handleRunnerSession` task.
4. Authentication failure stops polling and enters drain. A missing runner row must repeat three times
   before shutdown, protecting against a transient 404; other failures retry with bounded delay.
5. `deriveRunnerPollInterval` (`vYh`, `:978374-978382`) uses one third of the remaining lease time, clamped
   between 5 and 30 seconds. Missing/invalid lease data falls back to 20 seconds.
6. Optional SSE hints wake the same poll loop; they do not carry assignments or bypass polling authority.
7. Failed sessions are reported to the service. A server-marked stuck session, or a failure-report RPC
   failure, enters a local suppression set so a persistent assignment cannot create an unbounded respawn
   loop.

**Why this approach:**
- Set reconciliation is idempotent across repeated polls and lets server deletion/requeue cancel local
  work promptly.
- Lease-relative polling spends fewer requests on long leases while retaining enough renewal attempts
  near expiry.
- SSE is only a latency hint; treating it as authority would require a second consistency protocol.
- Suppressing uncertain failures sacrifices automatic recovery for one session, but bounds resource churn
  and lets the service reassign or an operator retry deliberately.

**Key insight:** Polling is both discovery and lease maintenance. Every optimization—SSE wakeups, adaptive
intervals, local deduplication—still converges through one authoritative assignment snapshot.

### Per-session Isolation and Child Launch

**What it does:** Turns an assignment into an isolated checkout/configuration and a resumable headless
Claude child without passing runner-administration authority into that child.

**How it works:**
1. `handleRunnerSession` (`KKh`, `:973940-974893`) obtains the session token and remote configuration,
   prepares bounded per-session paths, checks out sources, applies governed Git/config policy, and runs
   lifecycle hooks.
2. `spawnRunnerSessionChild` (`umH`, `:974895-975249`) launches the same Claude binary in stream-JSON
   print mode with `--resume` against the remote session endpoint.
3. Server-supplied tool arguments are filtered to remove all `self_hosted_runner_*` operator tools. If
   filtering empties the list, the child uses its normal tool pool instead of inheriting an empty one.
4. The child receives a session access token, inference token, isolated `CLAUDE_CONFIG_DIR`, stage root,
   worker epoch, and self-hosted environment markers.
5. Runner environment secrets and host-config paths are explicitly removed. A move to a later worker
   epoch enables interrupted-turn resumption and warns the model to re-verify ephemeral files.
6. A dedicated activity descriptor plus stream events track in-flight turns and background tasks. This
   state controls idle release, retire grace, and graceful shutdown rather than guessing from process age.

**Why this approach:**
- Reusing the normal headless Claude path avoids a second agent runtime while keeping the runner as a
  narrow supervisor.
- Per-session credentials and config roots reduce cross-session leakage at capacities greater than one.
- Removing operator tools prevents a tenant session from acquiring runner-administration capabilities
  merely because the supervising binary contains them.
- Rich activity tracking costs protocol complexity but distinguishes a genuinely idle prompt from a turn
  with background work, which is essential for safe release.

**Key insight:** The runner is not the agent. It is a credential-reducing, isolation-enforcing supervisor
that launches the ordinary agent runtime with a smaller, session-specific authority set.

### Drain, Retirement, and Failure Containment

**What it does:** Stops accepting work and releases or drains sessions without losing lease ownership or
leaving the service to wait unnecessarily for expiry.

**How it works:**
1. `SIGTERM`/`SIGINT` aborts the polling controller. A second signal force-exits after reporting unfinished
   post-session hooks.
2. A configured retirement time refuses new assignments and asks each active session to release at its
   next safe idle boundary. Background work receives a bounded grace; perpetual monitors do not hold the
   runner forever.
3. During explicit shutdown, the runner can wait for in-flight turns and background tasks for a configured
   drain interval while sending zero-capacity lease heartbeats.
4. Remaining child controllers are aborted, and all handlers settle within a budget derived from child
   stop grace, post-session-hook timeout, and optional push-on-release work.
5. Deregistration is attempted with a five-second bound. Failure is best-effort because lease expiry will
   eventually requeue sessions.

**Why this approach:**
- Immediate process death is simple but strands active assignments until lease expiry and can truncate
  preservation hooks.
- Continuing zero-capacity heartbeats during drain prevents the control plane from mistaking a slow clean
  shutdown for a dead runner.
- Every cleanup phase is bounded so a broken child, hook, filesystem, or deregistration RPC cannot defeat
  the host supervisor's termination deadline.
- Retirement prefers a parked resumable session over finishing indefinite background work; this is the
  explicit availability-versus-completion trade-off for finite-lived hosts.

**Key insight:** Graceful shutdown is a budgeted protocol, not an unbounded wait. Lease maintenance,
session release, child termination, hooks, and deregistration each have a role and a fallback.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `selfHostedRunnerMain` (`dhH`) - preflight, registration, health, and lifecycle assembly.
- `ensureRunnerBaseDirWritable` (`mKh`) - bounded create/write/traverse check before registration.
- `createRunnerApiClient` (`B4i`) - typed control-plane boundary.
- `runRunnerPollLoop` (`EYh`) - capacity, lease, assignment, retirement, and drain state machine.
- `handleRunnerSession` (`KKh`) - per-assignment preparation and cleanup.
- `spawnRunnerSessionChild` (`umH`) - reduced-authority headless child launch.
