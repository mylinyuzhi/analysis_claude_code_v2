# MCP runtime, configuration, authentication, and discovery

## Scope and version assessment

This document reconstructs the complete MCP path in Claude Code 2.1.227. It covers the same functional
surface as the six 2.1.220 MCP documents: configuration and managed policy, dual runtime trees,
connection lifecycle, roots, OAuth, timeouts, diagnostics, deferred discovery, and automatic
backgrounding.

The endpoint comparison changes how several post-2.1.220 changelog bullets should be read. File-based
OAuth refresh locks, eager `alwaysLoad` startup, pending-server attachments, and MCP instruction/dropped-
tool deltas already exist in 2.1.220. The later releases repair edge branches inside those systems; they
do not introduce the whole mechanisms. Exact intermediate patch attribution is impossible with only the
2.1.220 and 2.1.227 bundles, so claims below distinguish verified target behavior from changelog-level
attribution.

### Configuration merge, validation, and trust precedence

**What it does:** Builds one connectable server map from managed, user, project, local, plugin,
directory, command-line, host, and claude.ai sources without letting lower-trust data overwrite policy.

**How it works:**
1. MCP maps are created with a null prototype by `createNullPrototypeMcpMap` (`fae`,
   `cli_inner_pretty.js:253539-253541`). Names such as `constructor` therefore remain ordinary keys
   instead of resolving through `Object.prototype`.
2. `parseMcpConfig` (`_Hr`, `:254339-254466`) requires a top-level `mcpServers` object. If it sees
   `servers` instead, it reports the likely typo rather than silently returning an empty configuration.
3. Every server is parsed by a type-specific schema. Unknown transports, a URL without an explicit
   `http`/`sse`/`ws` type, malformed fields, `__proto__`, and internal reserved names are skipped with
   stable `skipReason` categories.
4. Commands, arguments, environment entries, headers, and URLs are checked for leading/trailing
   whitespace. Environment references are expanded only when the source permits it; missing variables
   are diagnostic, and a URL that expands to empty is retained as an unconfigured entry rather than
   dialed.
5. Project-scoped servers pass through workspace trust. Pending or rejected servers may be included for
   approval UI, but they are kept out of the normal connectable set.
6. Managed allow/deny policy is evaluated after source assembly. Enterprise configuration can suppress
   weaker sources, plugin and claude.ai duplicates are deduplicated, and policy-blocked servers fail
   before transport creation.
7. Source scope is copied onto the normalized entry, so later status, permission, and diagnostics paths
   do not have to reconstruct provenance.

**Why this approach:**
- Parsing into typed entries once prevents every transport constructor from independently interpreting
  ambiguous configuration.
- Null-prototype maps and `Object.hasOwn` checks make untrusted server/tool names safe dictionary keys;
  rejecting every JavaScript built-in name would unnecessarily restrict valid MCP names.
- Keeping an empty expanded URL as an explicit terminal error produces a useful `unconfigured` state
  and avoids a misleading network/authentication failure.
- Stable skip categories are machine-consumable in SDK startup events, while detailed messages remain
  useful to humans. The trade-off is a larger normalization boundary, but downstream connection code
  receives a much stronger contract.

**Key insight:** MCP configuration is not a last-write-wins object merge. It is a provenance-preserving
policy reduction in which trust, workspace approval, schema validity, and duplicate identity are
resolved before any process or socket starts.

### Latched dual-runtime selection and accessor tripwire

**What it does:** Chooses one of two complete MCP client/auth implementations and prevents modules from
different generations from being mixed in one process.

**How it works:**
1. `selectMcpSdkGeneration` (`w4`, `cli_inner_pretty.js:216004-216027`) accepts only `v1` or `v2` from
   `MCP_SDK_GENERATION`; an invalid value is logged and ignored.
2. Without an environment override, the default is v1 unless the `tengu_brindle_causeway` rollout gate
   selects v2.
3. The decision is latched in memory on first read. A later environment or feature-flag change cannot
   switch protocol implementations under already-created clients.
4. `getMcpClientModule` (`P4_`, `:316894-316918`) loads the chosen module and checks its exported
   `MCP_TREE_ID` against the selected generation.
5. Auth, elicitation, task-watcher, error-classification, directory-read, and XAA modules have parallel
   accessors at `:316919-316946`, so all generation-sensitive dependencies route through the same latch.
6. A mismatch emits a one-shot tripwire event and throws immediately instead of permitting an invalid
   hybrid runtime.

**Why this approach:**
- A rollout gate permits side-by-side production testing of a new MCP SDK without duplicating all
  higher-level configuration and UI code.
- Latching gives each process a coherent runtime. Hot-switching would invalidate client instances,
  schemas, auth-provider types, and error classes.
- The explicit tree ID detects bundler/export mistakes that ordinary duck typing would miss.
- The cost is roughly duplicated connection/auth code and repeated fixes in both arms. Shared accessors
  reduce, but do not remove, that maintenance burden.

**Key insight:** Repeated MCP code in the bundle is intentional A/B architecture. A literal appearing
twice is not evidence of two executions or a new feature; the generation accessor decides the only live
tree.

### Non-blocking startup and first-turn readiness

**What it does:** Starts most MCP servers without delaying the CLI while still guaranteeing that tools
which must be present in the first model request are ready or have reached the standard timeout.

**How it works:**
1. `createMcpStartupCoordinator` (`nNh`, `cli_inner_pretty.js:928831-928853`) partitions regular servers
   by `alwaysLoad`.
2. Required servers are launched through the blocking `regular-required` path. Deferrable servers and
   claude.ai connectors may be scheduled non-blockingly, depending on `MCP_CONNECTION_NONBLOCKING`.
3. Before starting asynchronous work, `startMcpServerGroup` (`VYl`, `:928854-928890`) inserts a
   `pending` record for every configured name. UI, ToolSearch, and first-turn waiting therefore observe
   the intended capability before connection finishes.
4. Each server has its own completion promise. Successful discovery incrementally updates clients,
   tools, commands, and resources; one slow server does not hold back all others.
5. In print/headless mode, `explicitMcpConfigRequestsWait` (`BoH`, `:946098-946100`) and
   `waitForPendingMcpBeforeFirstCommand` (`yXl`, `:946109-946170`) decide which pending servers to wait
   for before the first request. Explicit non-SDK `--mcp-config` is a readiness request, not merely a
   background hint.
6. Normal deferrable servers get a short bounded wait; a server implicated by a permission prompt can
   receive the full connection timeout. Telemetry records how many were pending before/after and the
   actual wait.
7. `alwaysLoad` is also attached to individual upstream tools through
   `anthropic/alwaysLoad`; those schemas remain resident rather than hidden behind ToolSearch.

**Why this approach:**
- Most remote integrations are optional for a turn, so blocking the entire CLI on all of them creates
  avoidable startup latency.
- An explicit `--mcp-config` in print mode is commonly supplied because automation needs that server on
  turn one. Waiting there fixes the 2.1.221 failure where the model could emit an unavailable tool call
  as text.
- `alwaysLoad` is a deliberate latency/context trade-off: it pays startup time and prompt tokens for
  deterministic immediate availability.
- Incremental server promises isolate failures but make state transitions visible throughout the app;
  the pending-state and delta mechanisms handle that complexity.

**Key insight:** “Non-blocking MCP startup” does not mean “never wait.” Readiness is demand-driven:
required schemas, explicit headless configuration, and pending permission targets raise the wait floor.

### Connection state machine, transports, roots, and reconnect

**What it does:** Converts normalized configuration into a live client while preserving explicit
pending, cached, needs-auth, disabled, unconfigured, failed, and connected states.

**How it works:**
1. The connector selects stdio, Streamable HTTP, SSE, WebSocket, IDE, claude.ai proxy, SDK control, or
   in-process transport and computes protocol negotiation mode (`z3s`,
   `cli_inner_pretty.js:305786-305817` for the v1 arm).
2. Connection concurrency is bounded separately for local and remote servers. The cache key includes
   the server name/config signature, avoiding duplicate dials for the same normalized endpoint.
3. Managed policy is checked again at `connectToMcpServer` (`WNo`, `:305931-305959`), closing the gap
   between initial config assembly and a later lazy reconnect.
4. A cached discovery entry can expose tools before the live transport exists, but cache exclusions and
   capability fingerprints prevent unsafe reuse. Failed or stale promises are removed only if they are
   still the current cache occupant.
5. Connected clients register list-change, elicitation, and supported custom-notification handlers.
   Unsupported unsolicited custom notifications are not registered for modern protocol revisions.
6. `getRootsListResponse` (`fPd`, `:305718-305738`) emits de-duplicated file URLs for cwd, additional
   working directories, and an optional staging root. A missing staging root is logged and omitted.
7. `notifyMcpRootsListChanged` (`f2_`, `:305744-305749`) broadcasts root changes to all connected
   clients; per-client failure does not stop the rest.
8. Session-expiry errors cause at most one reconnect/retry at the tool wrapper. Cache invalidation and
   connection cleanup are identity-checked so an older async failure cannot tear down a newer client.

**Why this approach:**
- Typed non-connected states let UI and the model distinguish “wait,” “authenticate,” “enable,” “fix
  config,” and “retry network” instead of collapsing every failure into no tools.
- A discovery cache improves startup without treating stale metadata as a live transport.
- Rechecking policy on lazy connection handles managed-setting changes and cached clients safely.
- Broadcast roots match MCP's client capability model. Best-effort notification avoids one broken
  server preventing all integrations from learning about a directory change.

**Key insight:** The cache stores discoverability, not connectivity. Every actual call still resolves a
current connected client under current policy.

### Tool discovery, schema projection, and deferred-pool synchronization

**What it does:** Converts upstream MCP tool definitions into safe Claude Code tools and keeps the
model's deferred-tool inventory correct as servers change mid-conversation.

**How it works:**
1. Live discovery fetches tools, prompts, resources, templates, server instructions, skills, and
   capability metadata in parallel where dependencies permit.
2. `projectMcpTools` (`V3s`, `cli_inner_pretty.js:306064-306485`, v1) normalizes selected top-level
   schema combinators, validates property keys and API compatibility, and drops an invalid tool without
   discarding the server's other tools.
3. Upstream names are namespaced as `mcp__<server>__<tool>` except for explicitly allowed SDK cases.
   Annotation fields drive read-only/concurrency/destructive/open-world hints, result caps, user
   interaction, and `alwaysLoad`.
4. Per-server or per-tool descriptions/search hints may override upstream text. Permission policy and
   the organization maximum are attached to `mcpInfo`, not trusted as executable model instructions.
5. Tool-list refreshes use sequence numbers (`refreshMcpToolsForClient`, `noi`,
   `:557536-557572`). If two refreshes race, only the newest result may update the live pool; a failed
   refresh keeps the previous tools.
6. `computeDeferredToolDelta` (`rJs`, `:380806-380899`) reconstructs prior announcements from message
   attachments, compares them with the current deferred pool, and emits added, re-added, removed,
   pending, needs-auth, and failed-server changes.
7. The rendered attachment at `:583300-583437` names newly available deferred tools, tells the model to
   load schemas through ToolSearch, and differentiates reconnects from first announcements. Pending
   servers explicitly tell ToolSearch to wait rather than report a missing capability.
8. `computeMcpInstructionsDelta` (`ZGo`, `:592611-592619`) and
   `computeDroppedMcpToolsDelta` (`e3o`, `:592620-592624`) separately add/remove server instructions and
   explain tools excluded for invalid schemas.
9. ToolSearch preserves discovered names across compaction boundaries and can wait on pending servers,
   ensuring a mid-turn connection is searchable before Claude chooses a workaround.

**Why this approach:**
- Per-tool schema rejection is graceful degradation; rejecting an entire server because one extension
  is malformed would unnecessarily remove healthy capabilities.
- Deferred loading reduces prompt size, but creates a second consistency problem: the model must know
  names exist before it can search for them. Conversation attachments make pool changes replayable and
  compaction-aware.
- Sequence-checked refresh prevents a slow older `tools/list` response from overwriting a newer list.
- The trade-off is more meta messages and state reconstruction. That cost is lower than permanently
  resident schemas or hallucinated “tool unavailable” conclusions.

**Key insight:** Tool availability has two stages: announced/searchable and schema-loaded/callable. The
2.1.224 mid-turn fix protects the transition between them; it is not merely a UI refresh.

### Permission projection and execution-time ceilings

**What it does:** Integrates MCP tools into Claude Code's normal permission lattice without allowing
server metadata, cached definitions, or hook output to bypass local/managed policy.

**How it works:**
1. Each projected tool exposes semantic hints, but its default permission result is `passthrough` or
   `ask` when upstream marks that user interaction is required.
2. Server tool policy may suppress “always allow” suggestions and set an effective maximum of allow,
   ask, or blocked.
3. `effectiveModeForTool` (`hrt`, `cli_inner_pretty.js:301060-301076`) may tighten a permissive session
   mode for selected MCP/browser families; it never widens the launch capability.
4. The global permission engine still evaluates managed deny, MCP-specific rules, plan-mode write
   floors, hooks, organization ask ceilings, and auto-mode eligibility.
5. Immediately before a call, the wrapper resolves the current client with
   `connectToMcpServer`, strips internal consent fields, and rechecks special connector consent.
6. A claude.ai proxy may return protocol error `-32003` after the first attempt. The wrapper can surface
   one retroactive approval card and retry only unchanged approved input; edited input is rejected and
   must be issued as a new call.
7. URL/form elicitation pauses execution through a hook or dialog and is capped at three retries.
   Pending elicitation is exposed to timeout/background logic so a call waiting on the user is not
   misclassified as a hung server.

**Why this approach:**
- MCP servers are external and may supply inaccurate annotations; hints improve UX but cannot be the
  authority for local safety.
- Execution-time client and consent resolution closes time-of-check/time-of-use gaps caused by
  disconnects, policy updates, or late proxy approval.
- A single retroactive approval retry supports gateway-enforced consent without an infinite prompt
  loop.
- The trade-off is duplicated-looking checks between projection and execution. They guard different
  times and different mutable state.

**Key insight:** An MCP tool definition describes capability, not authority. Claude Code's local and
managed permission ceilings remain the final decision makers.

### Tool-call clocks, progress, output shaping, and auto-backgrounding

**What it does:** Executes long MCP operations without hanging forever, aborting user-mediated flows,
or flooding the model context with oversized output.

**How it works:**
1. `callMcpTool` (`wBo`, `cli_inner_pretty.js:314233-314350`, v2) arms a hard wall-clock timeout derived
   from per-server config/environment/defaults.
2. A separate idle watchdog wakes every 30 seconds. Progress notifications reset its activity time;
   active elicitation and the moment an elicitation closes also reset the idle baseline.
3. If the transport drops mid-call, a 90-second grace period allows a late response/reconnect path
   before reporting that the response was lost.
4. A hard timeout, idle timeout, caller abort, and transport-loss watchdog race the protocol call. All
   timers and active-watchdog registrations are removed in a single finalizer.
5. Results accept normal content, structured content, resource links, images, and audio. Binary data is
   saved to disk and represented by a file reference.
6. `shapeLargeMcpResult` (`xOd`, `:313949-314023`) keeps small or image-containing output inline, but
   persists large text/JSON to a file when possible. If persistence fails, it returns a bounded error
   and suggests server-side pagination/filtering.
7. `getMcpAutoBackgroundMs` (`WB_`, `:300899-300906`) disables automatic promotion for excluded server
   types, nested agents, or headless sessions without explicit opt-in. The configured delay is clamped.
8. `callMcpToolWithAutoBackground` (`qB_`, `:300907-301001`) races completion against that delay. It
   repeatedly defers promotion while an elicitation is pending; otherwise it registers an `mcp_task`
   and returns control while preserving cancellation and eventual notification.

**Why this approach:**
- Hard timeout bounds total cost; idle timeout detects a lost response earlier while allowing genuine
  progress to extend work.
- Elicitation resets are essential because waiting for human input is neither server progress nor a
  hang.
- Persisting large output retains full data without consuming the conversation window. Images remain
  inline because file-only substitution would change multimodal semantics.
- Auto-backgrounding improves interactivity for slow servers, but is withheld when user input is
  pending or no reliable notification surface exists.

**Key insight:** The runtime distinguishes four notions of “slow”: long total duration, silent server,
lost transport, and waiting on the user. Each has a different clock and recovery action.

### OAuth credential reads, proactive refresh, and concurrent recovery

**What it does:** Supplies OAuth credentials without turning a temporary keychain read failure or
another process's refresh into a false unauthenticated state.

**How it works:**
1. The two provider classes, `McpOAuthProviderV1` (`vwr`,
   `cli_inner_pretty.js:298157-299026`) and `McpOAuthProviderV2` (`Ywr`,
   `:311200-311985`), implement the same storage/refresh contract for their SDK generations.
2. `readCredentialStore` distinguishes a definitive absence from the secure-store sentinel meaning
   “could not read now.” The latter throws `McpCredentialStoreUnavailableError` (`yWt`,
   `:296681-296689`) so no request is sent with apparently missing credentials.
3. Tokens within five minutes of expiry trigger proactive refresh. Calls in the same process share
   `_refreshInProgress`; step-up authorization deliberately withholds the old refresh token.
4. Refresh acquires a per-server filesystem lock with staleness detection, update heartbeats, jittered
   retries, and bounded contention. Once inside the lock, it rereads storage because another process may
   already have produced a fresh token.
5. If refresh returns `invalid_grant` or invalid-client errors, the provider checks storage for a
   concurrent winner or re-registration before clearing anything. Credentials are invalidated only
   when the evidence still describes the same stored identity.
6. Timeouts, resets, server/temporary/rate errors, and credential-store unavailability are transient.
   They retry up to three attempts with exponential delays; policy/issuer/schema failures do not retry.
7. Save operations compare the last-served values and preserve a rotated refresh token when the server
   omits one. Persistence failures are logged/telemetried without claiming the in-memory response was
   absent.
8. Authentication challenge observation, metadata issuer checks, dynamic client registration, callback
   state, and optional step-up scopes are kept separate from token storage.

**Why this approach:**
- A keychain timeout is an availability failure, not proof of logout. Sending an unauthenticated request
  turns it into a misleading burst of 401s—the 2.1.225 bug.
- In-process promise sharing prevents duplicate work from one client; the filesystem lock handles
  distinct Claude Code processes after wake-from-sleep.
- Rereading under the lock and checking concurrent winners prevents a stale loser from deleting a
  winner's rotated tokens.
- The trade-off is additional disk reads and lock latency near expiry, preferable to revoking a valid
  session or forcing interactive re-authentication.

**Key insight:** Credential state has at least three values: present, definitively absent, and temporarily
unreadable. Collapsing the third into absence is both a reliability bug and an authentication storm.

### Model-facing diagnostics and stale-tool failures

**What it does:** Turns connection/discovery failures into actionable state for users, SDK hosts, and
the model without trusting remote error text as instructions.

**How it works:**
1. Configuration warnings retain scope, server, severity, stable skip category, suggested correction,
   and optional file path.
2. Runtime clients expose distinct `pending`, `cached`, `connected`, `needs-auth`, `disabled`,
   `unconfigured`, and `failed` states; status output does not infer authentication from every 401-like
   failure.
3. Failed-server attachments at `cli_inner_pretty.js:583350-583430` separate connection failures from
   administrative policy blocks and authentication requirements.
4. Quoted endpoint errors are explicitly labeled unvalidated diagnostic data, preventing an MCP server
   from injecting model instructions through an error string.
5. Removed deferred tools are announced by name and ToolSearch is told not to return them. If a stale
   transcript contains a tool result/error for a tool no longer in the local registry, the query/UI
   path preserves the error rather than dropping the block.
6. `WaitForMcpServers` reports connected, cached, failed, pending, needs-auth, disabled, unconfigured,
   unknown, and overall readiness. It never dials unknown servers and is automatically allowed because
   it is a read-only synchronization primitive.
7. List-change refresh failures retain the previous known-good tools/prompts/resources and log the
   refresh error; partial resource/template failures do not erase the successful half.

**Why this approach:**
- Different failure states require different remediation. “Retry,” “log in,” “ask an administrator,”
  and “fix configuration” are not interchangeable.
- Keeping the previous tool set on refresh failure avoids a transient network event looking like a
  permanent capability deletion.
- Treating remote error text as data preserves useful diagnostics without opening a prompt-injection
  channel.
- The richer state taxonomy costs UI and attachment complexity but prevents the model from fabricating
  workarounds for a capability that is merely still connecting.

**Key insight:** MCP reliability depends on preserving why a capability is unavailable, not just whether
its tool object is currently present.

## 2.1.220 to 2.1.227 change assessment

Verified target behavior and endpoint evidence support the following conclusions:

- **2.1.221 `--mcp-config` print startup:** the target has an explicit-config readiness policy
  (`BoH`/`yXl`) connected to headless startup. `alwaysLoad` startup existed in 2.1.220, so the fix is the
  first-command wait decision for explicit config, not the invention of required-server startup.
- **2.1.221 SDK MCP name `constructor`:** null-prototype maps and safe lookups are present at multiple
  preparation boundaries. The exact intermediate patch site remains unanchored in the endpoint-only
  ledger; this report does not assign the entire null-map design to 2.1.221 because it also appears in
  2.1.220.
- **2.1.221 cross-process refresh race:** both endpoints already contain per-server refresh locks. The
  target's lock/reread/concurrent-winner algorithm is verified, but the precise wake-from-sleep branch
  changed after 2.1.220 cannot be isolated without an intermediate bundle.
- **2.1.222 invalid session-token connector state:** 2.1.227 distinguishes claude.ai bearer rejection,
  connector OAuth need, and transient/credential errors. Exact attribution remains unanchored.
- **2.1.222 stale local tool errors:** current delta/removal and query rendering paths preserve failure
  information after a tool disappears. The precise changed function remains unanchored.
- **2.1.224 mid-turn connection announcement:** deferred-pool attachments existed in 2.1.220; the fixed
  behavior is the edge case that ensures newly connected deferred tool names are announced before the
  model must search for them. The target's full reconstruction/re-add/remove algorithm is verified.
- **2.1.225 macOS keychain timeout:** the new explicit temporarily-unreadable credential error and
  retry classification are visible in 2.1.227 and absent by message/type in 2.1.220. This is the
  strongest endpoint anchor among the post-220 MCP bullets.
- **2.1.226-2.1.227:** no MCP-specific release-note feature is claimed. The current bundle nevertheless
  contains additional rollout-gated protocol negotiation, schema normalization/drop policy, discovery
  caching, and refresh tools; without an intermediate bundle they are documented as current
  architecture, not assigned to those generic releases.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createNullPrototypeMcpMap` (`fae`) - safe dictionary base for externally named servers.
- `parseMcpConfig` (`_Hr`) - schema and diagnostic boundary.
- `selectMcpSdkGeneration` (`w4`) - process-wide v1/v2 latch.
- `getMcpClientModule` (`P4_`) - generation-aware accessor and tree tripwire.
- `createMcpStartupCoordinator` (`nNh`) - required versus deferrable startup partition.
- `startMcpServerGroup` (`VYl`) - pending-state insertion and incremental discovery.
- `connectToMcpServer` (`WNo`) - policy-checked live-client resolution.
- `projectMcpTools` (`V3s`) - schema validation and Claude Code tool construction.
- `refreshMcpToolsForClient` (`noi`) - sequence-safe `tools/list` refresh.
- `computeDeferredToolDelta` (`rJs`) - conversation-replayable tool-pool change set.
- `callMcpTool` (`wBo`) - protocol call and watchdog race.
- `shapeLargeMcpResult` (`xOd`) - inline versus file-backed result policy.
- `McpOAuthProviderV1` (`vwr`) / `McpOAuthProviderV2` (`Ywr`) - auth state and refresh recovery.
- `getRootsListResponse` (`fPd`) - deduplicated workspace roots.
- `notifyMcpRootsListChanged` (`f2_`) - best-effort roots update broadcast.
