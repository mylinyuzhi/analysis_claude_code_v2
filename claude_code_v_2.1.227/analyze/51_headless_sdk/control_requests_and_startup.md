# Control requests and print startup

Control requests mutate a running headless session without entering the model conversation. The
dispatcher therefore has to validate payloads, report exactly one terminal lifecycle event, and make
changes visible to the next or current turn without racing plugin/MCP refreshes.

### Required-versus-deferrable MCP startup

**What it does:** Connects MCP servers before the first print-mode turn when their schemas are needed,
while allowing deferrable servers and connectors to start without unnecessarily blocking startup.

**How it works:**
1. `createMcpStartupCoordinator` (`nNh`, `cli_inner_pretty.js:928831-928852`) reads the global
   nonblocking policy and partitions regular configs by `alwaysLoad`.
2. `alwaysLoad` servers run through a required path even when general MCP startup is nonblocking.
3. Other regular servers use the selected deferral mode; claude.ai connectors run in a parallel
   branch with the same state updater.
4. `startMcpServerGroup` (`VYl`, `cli_inner_pretty.js:928854-928900`) inserts pending client slots
   before connecting so the init event can report connection state.
5. It creates one completion promise per server; callbacks resolve the matching promise, and `finally`
   resolves any stragglers before scheduling retries.
6. Print setup creates the coordinator and explicitly awaits `connect()` before importing/running the
   headless loop (`cli_inner_pretty.js:947808-947821`).

**Why this approach:**
- Tools marked always-resident must exist before prompt construction; deferred tools need not block
  on their full schemas.
- Per-server promises let partial success complete accurately instead of waiting on one monolithic
  client operation.
- Pending slots make startup state observable.
- The split balances first-turn correctness with startup latency.

**Key insight:** The awaited call alone is not the policy. The important decision is which connection
promises the coordinator treats as required. This structure is already present in 2.1.220, so the
2.1.221 changelog does not correspond to a net structural delta between the available endpoints.

### Tracked and detached control-request lifecycle

**What it does:** Ensures command-lifecycle notifications describe when a handler actually finishes,
including requests whose work continues asynchronously.

**How it works:**
1. The main structured-input loop marks ordinary non-user frames complete immediately.
2. For a `control_request`, it creates two wrappers around a handler promise.
3. The tracked wrapper emits `started`, awaits the handler, and emits `completed` in `finally`.
4. The detached wrapper marks the command complete before scheduling background work.
5. A flag records whether either wrapper claimed lifecycle ownership; the outer dispatcher emits a
   default completion only when no subtype did.
6. Handler exceptions are reported but cannot skip the tracked `finally` completion.
7. Long operations may emit `control_request_progress` frames keyed by the original `request_id`.

**Why this approach:**
- Some controls are transactions whose completion matters; others merely launch background work.
- Two explicit wrappers prevent an unconditional outer `completed` from racing an unfinished
  handler.
- `finally` gives exactly-once completion under success or failure.
- The subtype author must choose the correct wrapper, but that choice makes lifecycle semantics
  visible in code review.

**Key insight:** A response frame and a command-lifecycle completion are related but distinct. The
dispatcher tracks both instead of assuming that enqueueing a response means all side effects ended.

### Initialize reconciliation for SDK MCP servers and agents

**What it does:** Applies an SDK host's dynamic MCP and agent definitions to the live session without
being overwritten by an earlier plugin refresh.

**How it works:**
1. The initialize arm validates MCP-name arrays, hook callback structures, skill arrays, and optional
   title before mutating state.
2. SDK MCP names are inserted as SDK configs and immediately trigger the MCP reconciler.
3. `applyInitializeSettings` (`UoH`, result at `cli_inner_pretty.js:946343`) applies tool aliases,
   permissions, optional skills, agent definitions, and other host settings.
4. Agent definitions are produced from the current agent getter rather than captured startup data.
5. The result returns `mergedStdinAgents`; the dispatcher de-duplicates them against the current live
   agent-name list and appends only missing names (`944249-944252`).
6. Restricted model substitutions are surfaced separately, then the initialize state becomes active.

**Why this approach:**
- Plugin refreshes can replace the active agent catalog, so pushing into a stale array loses SDK
  definitions.
- Getter-based construction reads the latest authoritative catalog at mutation time.
- Name de-duplication preserves plugin agents and SDK agents without multiplying equal entries.
- Reconciliation is more expensive than blind assignment, but initialize is infrequent and state
  correctness dominates.

**Key insight:** The merge happens twice at different abstraction levels: definitions are built from
the live catalog, then returned names are merged into the dispatcher-visible name set.

### Transactional mid-turn model and system-prompt switch

**What it does:** Validates and applies a model change, optional system prompt, policy fallback, and
session metadata as one successful control transaction.

**How it works:**
1. Reject a non-string non-null model before calling string methods; if a system prompt accompanied
   it, record that the prompt transaction was rejected too.
2. Reject a present prompt unless it is a nonempty string.
3. Normalize `default`, recognize canonical/provider model IDs, and compute family-alias step-down
   when organization policy restricts the requested model.
4. Return a suggestion-aware error for unrecognized IDs and a policy error when no permitted family
   alternative exists.
5. On success, atomically update the live override, persisted model selection, app-state model,
   session metadata, and model-change notification.
6. Apply the supplied system prompt only on that success branch, then send the control success.

**Why this approach:**
- Early type checks prevent malformed protocol input from throwing before a response, which SDK hosts
  perceive as a hang.
- Treating model and prompt as one transaction prevents a rejected model from partially changing the
  prompt.
- Same-family fallback preserves caller intent better than silently using the parent/default model.
- Multiple state updates are necessary because current turn, future turns, and host metadata have
  different consumers.

**Key insight:** Validation order is part of atomicity: no session-facing state changes until both
payload fields and policy resolution succeed.

### Busy-aware working-directory change

**What it does:** Allows `set_cwd` only when moving the process cannot invalidate an active turn or a
queued main-thread action.

**How it works:**
1. The dispatcher delegates to the shared directory-change handler with an `isBusy` callback.
2. Busy means an active run outside the `waiting_for_agents` phase or a nonempty main-thread queue.
3. Waiting for agents is allowed because the main model/tool thread is quiescent.
4. On approval, the handler updates cwd, permission directories, and dependent discovery state.
5. It enqueues a meta move notice rather than pretending the directory change was a user prompt.
6. Validation errors become control errors tied to the original request.

**Why this approach:**
- Changing cwd mid-tool execution can redirect relative paths and corrupt permissions.
- A phase-aware predicate is more precise than a single `isRunning` boolean.
- Including queued work closes the race where cwd changes between enqueue and execution.
- Allowing the agent-wait phase improves host ergonomics without risking the main thread.

**Key insight:** “Busy” is derived from both execution phase and queue ownership, not UI spinner state.

### Long register-root operation and keep-alive pump

**What it does:** Validates and registers an additional repository root while keeping remote SDK
transports alive during hooks and optional reload work.

**How it works:**
1. Resolve current and requested directories through `realpath` and require a directory.
2. Enforce registration scope against cwd, CLI-added roots, and current additional directories.
3. Reject duplicate registration.
4. Update permission context and durable additional-directory state, then refresh configuration.
5. Start a 30-second keep-alive interval while `DirectoryAdded` hooks execute; clear it in `finally`.
6. Optionally reload CLAUDE.md, skills, plugins, and resulting MCP clients.
7. Respond only after synchronous requested reloads finish; errors are converted to a control error.

**Why this approach:**
- Canonical paths prevent symlink spelling from bypassing scope or duplicate checks.
- Permission context changes before discovery so newly loaded content is already within the allowed
  root.
- Keep-alives distinguish a long legitimate control from a dead worker.
- Reloads increase latency, but callers explicitly requested a coherent post-registration state.

**Key insight:** Repository registration is a permission transaction followed by discovery. The
keep-alive covers the slow side effects without declaring the request complete early.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createMcpStartupCoordinator` (`nNh`) - partitions startup connections by prompt requirement.
- `startMcpServerGroup` (`VYl`) - creates pending slots and per-server completion promises.
- `applyInitializeSettings` (`UoH`) - reconciles host-provided runtime settings.
