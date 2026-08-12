# Remote Control enablement and attached-client state

Remote Control enablement is both a security decision and a UX decision. 2.1.227 separates
eligibility, startup intent, session reattachment, and current connection health so a stale pointer
or repository setting cannot manufacture authorization.

### Eligibility blocker ladder

**What it does:** Produces a precise terminal or actionable reason when Remote Control cannot start.

**How it works:**
1. `getRemoteControlEligibilityError` (`JCo`, `cli_inner_pretty.js:195238-195279`) first rejects cloud
   sessions and the managed `disableRemoteControl` setting.
2. It requires a signed-in claude.ai subscriber using subscription authentication rather than an API
   key.
3. It requires profile scope, organization identity, and an allowed organization compliance policy.
4. It requires feature-flag evaluation to be available and distinguishes explicit telemetry/
   GrowthBook disablement from a temporarily unreachable feature service.
5. It evaluates `tengu_ccr_bridge`; if the first read misses with stale features, it refreshes once
   before declaring the account ineligible.
6. `isRemoteControlBridgeEnabled` (`ZCs`, `195233-195236`) provides the fast boolean gate, while
   initialization repeats managed policy and trusted-device checks at the actual side-effect boundary
   (`827077-827144`).

**Why this approach:**
- A single false would make login, org policy, local configuration, and rollout failure
  indistinguishable.
- Ordered checks surface the first user-actionable blocker without making network calls unnecessarily.
- Rechecking policy at initialization prevents UI enablement from becoming stale authorization.
- The trade-off is duplicated-looking predicates; one path explains availability, while the other
  protects session creation.

**Key insight:** The detailed ladder is diagnostic; the initialization checks are authoritative.
User-visible eligibility never replaces enforcement at the network side effect.

### Asymmetric startup-setting precedence

**What it does:** Allows repository configuration to turn Remote Control off but never to turn it on.

**How it works:**
1. `resolveRemoteControlStartupSetting` (`Xci`, `619125-619145`) reads project and local settings
   independently.
2. Either repo-scoped value being `false` immediately returns disabled.
3. The enabling value is then resolved only from security-sensitive setting sources or the legacy
   user-global configuration.
4. Repo-scoped `true` is ignored when no trusted enabling source says true and a debug message tells
   the user to set it at user scope.
5. `resolveRemoteControlStartupMode` (`Czh`, `948548-948570`) combines that result with the explicit
   CLI flag, product default, environment remote mode, and reattach handoff.
6. The resolver returns full, mirror, or off plus provenance fields used by telemetry and IDE hosts.

**Why this approach:**
- Opening a remotely controllable session is security-sensitive and must not be enabled merely by
  cloning a repository.
- Allowing repo-local false still lets sensitive projects impose a stricter local policy.
- Returning provenance makes VS Code/desktop behavior explainable and testable.
- Asymmetry is less intuitive than normal setting precedence, but it matches the trust boundary.

**Key insight:** Scope precedence depends on direction: lower-trust scope may subtract capability but
cannot add it.

### Resume does not imply auto-enable

**What it does:** Prevents ordinary `--resume`, SDK-host, or IDE session restoration from silently
turning Remote Control back on after the user disabled it.

**How it works:**
1. Startup mode is computed before the interactive bridge hook runs (`948548-948570`).
2. A persisted server-session pointer is consumed only inside bridge initialization; it is not itself
   an enabling input to startup mode.
3. Only the explicit bridge reattach handoff environment can request full or outbound-only
   reattachment.
4. Repo/user false continues to suppress ordinary auto-start; a repository true remains ignored.
5. The interactive hook exits without initializing when `replBridgeEnabled` is false
   (`827730-827820`).
6. Reattach identity and policy are checked again if initialization is actually authorized.

**Why this approach:**
- Session history restoration and remote-network exposure are separate user choices.
- A stale persisted pointer is useful for continuity only after enablement has already been decided.
- Explicit process-to-process handoff remains possible because it carries deliberate reattach intent.
- The trade-off is that some resumed sessions require the user to re-enable Remote Control manually.

**Key insight:** Persistence provides an address, not permission. An old remote session ID cannot
override current startup intent.

### Persistent failure and recovery state

**What it does:** Keeps Remote Control failure visible after a transient toast would disappear and
offers the correct recovery action for the failure class.

**How it works:**
1. `useRemoteControlBridge` (`BXm`, `827657-828932`) subscribes separately to enabled, connected,
   session-active, error-detail, and error-kind fields.
2. Initialization and transport callbacks classify failures as authentication or terminal and store
   both detail and kind in app state (`827730-828220`).
3. The immediate notification distinguishes “failed” from “disconnected” using whether a connection
   had previously succeeded.
4. The Remote Control panel renders the stored detail persistently along with connection/session
   metadata (`837835-837958`).
5. `d` dismisses a failure or disconnects an active session; `r` is offered only for an auth failure
   while disconnected (`837806-837833`, `837997-838033`).
6. A successful retry clears error fields and re-sends system/init so the attached surface receives
   current model, permission, command, agent, skill, and fast-mode state.

**Why this approach:**
- An eight-second toast is insufficient for failures that require login or deliberate retry.
- Error kind prevents offering “reconnect” for terminal policy/ownership failures it cannot repair.
- Storing state centrally lets the CLI panel and IDE host agree about actual connection health.
- More explicit UI state increases reducer complexity, but removes false-connected presentation.

**Key insight:** Recovery affordance is derived from failure semantics, not merely from the absence of
a socket.

### Attached-client compaction reducer

**What it does:** Keeps remote viewers responsive and structurally correct while a large local
conversation compacts.

**How it works:**
1. A status frame sets the client's compacting latch; repeated compacting status is ignored
   (`847760-847800`).
2. A `compact_boundary` frame clears that latch after the durable post-compaction boundary arrives.
3. Completed message detection also clears stale streaming/compacting state as a recovery path.
4. `conversation_reset` clears remote messages, tool-use indexes, streaming text, and pending partial
   state (`847844-847870`).
5. Explicitly queued local user messages are retained across reset so client-origin input is not
   discarded by a simultaneous `/clear`.
6. The new conversation ID is passed to the host, which remounts transcript/title state under the
   replacement identity.

**Why this approach:**
- A visible progress state distinguishes a long compaction from a stuck worker.
- Waiting for the boundary rather than only `compact_end` aligns UI completion with durable history.
- The fallback clear on completed output heals a missed status transition.
- Preserving queued local messages handles races, though it requires per-message ownership tracking.

**Key insight:** The reducer follows durable transcript state, not just operation timing. Compaction
is complete for the viewer only when the new boundary is observable.

### Remote recipient addressability boundary

**What it does:** Lets `SendMessage` address named Remote Control sessions without weakening local
same-name collision safety.

**How it works:**
1. `ListAgents` exposes a remote session as `name [ref]` and retains an opaque identity reference.
2. `SendMessage` resolves an explicit reference before considering local names.
3. A confirmed remote recipient is pinned by identity, so failure to refresh its list cannot swap it
   for a same-named local session.
4. If discovery is unavailable and no identity was confirmed, resolution fails rather than guessing.
5. Delivery errors propagate instead of returning a false “Message sent.”
6. Remote transport then carries the message to the addressed session, while inbound policy remains
   responsible for approval/holding behavior.

**Why this approach:**
- Human-readable names are useful but not globally unique across machines.
- Displaying a short reference preserves usability while giving tools an unambiguous key.
- Identity pinning chooses safety over opportunistic fallback during discovery failure.
- The trade-off is that users may need to refresh `ListAgents` before first contact.

**Key insight:** Remote Control supplies reachability, but recipient identity is established above the
transport. See [30_agent_team](../30_agent_team/) for the full resolver and policy analysis.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Cross-session execution

Key functions in this document:
- `getRemoteControlEligibilityError` (`JCo`) — detailed availability diagnostics.
- `isRemoteControlBridgeEnabled` (`ZCs`) — fast rollout and auth gate.
- `resolveRemoteControlStartupSetting` (`Xci`) — trusted-scope setting resolver.
- `resolveRemoteControlStartupMode` (`Czh`) — full/mirror/off startup composition.
- `useRemoteControlBridge` (`BXm`) — interactive connection and failure-state owner.
