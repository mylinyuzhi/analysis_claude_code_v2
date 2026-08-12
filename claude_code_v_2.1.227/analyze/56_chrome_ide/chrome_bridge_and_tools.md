# Chrome bridge and browser-tool execution

The Chrome path is a stateful relay, not a conventional local MCP subprocess. Claude Code exposes a
local MCP server to the agent, but each tool call is serialized over a WebSocket and executed by a
selected Chrome extension. The relay must therefore solve authentication, extension discovery,
session routing, permissions, deadlines, reconnect, and MCP result normalization.

## 1. Connection and extension ownership

### Extension discovery and deterministic selection

**What it does:** Chooses exactly one extension device without silently switching a user who has a
persisted pairing to another visible browser.

**How it works:**
1. `discoverAndSelectExtension` queries the bridge and deduplicates responses by `deviceId`, keeping
   the newest `connectedAt` record for each device.
2. If no device is present, it waits for `peer_connected` and queries once more instead of failing
   immediately during Chrome startup.
3. With `requirePairedDevice`, the absence of a persisted ID is terminal for discovery; the client
   explicitly refuses automatic selection.
4. If the persisted device is temporarily absent, it waits once more, but it still refuses to pick
   a different visible device.
5. Without strict pairing, one visible extension is selected automatically. A remote-device warning
   is emitted when its platform differs from the CLI platform.
6. With multiple devices, a persisted match wins; otherwise an AskUser-capable host defers to a
   selection UI, while a noninteractive host broadcasts a pairing request.
7. Browser switching clears the active selection, issues a fresh pairing request, and bounds the
   prompt at two minutes.

**Why this approach:**
- A first-device-wins policy is simple but unstable when several browsers reconnect in different
  orders.
- Persisted identity protects the user from sending browser actions to another machine merely
  because the expected browser is asleep.
- Device-level deduplication absorbs duplicate bridge presence records without exposing them as
  separate choices.
- The extra startup wait improves reliability at the cost of a bounded delay before “no extension”
  becomes final.

**Key insight:** Discovery completion and device selection are separate state. “Discovery ran and
found no acceptable target” must not be mistaken for “discovery has not run yet,” or every tool call
would restart pairing.

Evidence: `ChromeBridgeClient` (`$no`) at `cli_inner_pretty.js:28976-29883`, particularly
`29091-29292`.

### Authenticated WebSocket establishment and liveness

**What it does:** Establishes an authenticated bridge channel, detects stalled handshakes and dead
connections, and reconnects without leaving pending calls unresolved.

**How it works:**
1. `ensureConnected` accepts the connection only when three predicates agree: logical connection,
   authentication, and WebSocket `OPEN` state.
2. A caller waiting on an in-progress connect polls for at most 10 seconds; this caller bound is
   independent of the lower-level handshake watchdog.
3. `connect` resolves a user ID and OAuth token, constructs `<bridge-url>/chrome/<user-id>`, and
   starts a 30-second handshake timer.
4. On socket open, it sends an explicit `connect` message containing the client type and token.
   Transport establishment alone is not treated as authentication.
5. `paired` or `waiting` completes authentication, records establishment time, starts keepalive,
   resets reconnect attempts, and pushes external configuration.
6. Keepalive sends periodic pings and treats a missing pong beyond the liveness window as a dead
   channel.
7. Close or error clears logical/authenticated state and rejects all pending calls so none wait on a
   socket that can no longer answer.
8. Reconnect delay grows geometrically (`2s × 1.5^attempt`) to a 30-second ceiling and stops after
   100 attempts.

**Why this approach:**
- Separating socket-open from authenticated-ready prevents calls from racing the bridge handshake.
- Independent 10-second and 30-second bounds serve different consumers: a tool call fails promptly,
  while the background connection still has room for credential and network latency.
- Exponential backoff reduces load during outages; a cap preserves recoverability.
- Rejecting pending work is safer than replaying browser side effects whose execution status is
  unknown.

The 2.1.220 bundle still scanned legacy local sockets and emitted
`tengu_dead_probe_chrome_legacy_socket` (`2.1.220:267285-267308`). That probe is absent in 2.1.227.
The current bounded handshake makes a stalled or obsolete path observable through normal connection
state instead of a one-off dead-code probe.

**Key insight:** Readiness is a protocol state, not a TCP/WebSocket state. The client intentionally
requires bridge authentication before declaring success.

Evidence: `ChromeBridgeClient` (`$no`) at `cli_inner_pretty.js:29031-29055`, `29293-29526`, and
`29778-29883`.

## 2. Tool-call lifecycle

### Correlated call with permission-paused deadline

**What it does:** Sends one browser tool call with session and permission context, correlates the
result, and prevents an interactive permission prompt from consuming the tool’s execution budget.

**How it works:**
1. `callTool` ensures that a target device has been discovered and selected before allocating work.
2. A browser-activity observer runs before send. The client rechecks the socket afterward and emits
   a distinct “extension disconnected mid-call” failure if the selected device vanished.
3. A UUID becomes `tool_use_id`; a pending-map entry stores resolution callbacks, start time, tool
   name, timeout, session ID, user-message UUID, and arguments.
4. The wire request carries the selected target device, effective permission mode, allowed domains,
   session scope, and whether the caller can service permission requests.
5. When the extension requests permission, the client pauses the call’s timeout, invokes the host
   callback, sends the decision, and resumes the timer with the remaining budget.
6. A result is accepted only when its `tool_use_id` matches a pending call. Late results are tracked
   separately rather than being attached to newer work.
7. On timeout, diagnostics distinguish routing acknowledgement, pong/liveness state, and time spent
   paused for permission.
8. Extension notices are sanitized and capped before they are returned through MCP metadata.

**Why this approach:**
- UUID correlation permits concurrent browser actions over one socket without relying on response
  order.
- Passing permission context with each call supports mode changes and session-specific domains;
  global mutable bridge state alone would be stale.
- Pausing rather than resetting the timer preserves the execution budget while excluding human
  response time.
- Calls are not automatically retried because browser actions can be non-idempotent.

**Key insight:** Permission latency and browser execution latency are different clocks. Counting the
former against the latter creates false tool timeouts precisely when the system asks the user to
make a security decision.

Evidence: `ChromeBridgeClient.callTool` and its message handlers at
`cli_inner_pretty.js:29056-29118`, `29416-29777`.

### Session-owned tab-group front loading

**What it does:** Supplies a safe tab and tab-group context when `navigate` is called without a
`tabId`, while preserving one browser group per Claude session.

**How it works:**
1. `frontloadChromeTabContext` (`gLg`) activates only for `navigate` with no `tabId`.
2. `back` and `forward` are refused because their meaning depends on an already identified tab.
3. For a normal URL and a known session ID, the dispatcher creates or reuses one in-flight
   `tabs_context_mcp({createIfEmpty:true})` promise keyed by bridge client and session.
4. Concurrent navigate calls share that promise; it is removed only when the exact promise settles.
5. The hidden lookup has an 8-second bound. A timeout returns a specific recoverable diagnostic
   rather than leaving navigate indefinitely queued.
6. A returned tab ID is injected into the navigate arguments. The raw tab-context JSON is appended
   to the successful tool result so the model learns the created context.
7. The returned `tabGroupId` is carried in private metadata, saved by
   `createClaudeForChromeMcpServer` (`aio`) per session, and supplied on later calls.
8. Private routing fields are stripped before the MCP response reaches the model.

**Why this approach:**
- Requiring every model call to issue `tabs_context_mcp` explicitly adds latency and is easy to omit.
- Automatically choosing a tab without group identity risks cross-conversation browser reuse.
- Sharing the in-flight lookup removes a race in which parallel navigations create multiple groups.
- The bound trades a possible retry for freedom from an event-loop-visible hung browser call.

**Key insight:** The hidden context call is not merely convenience. It is the operation that creates
and recovers the session’s browser ownership boundary.

Evidence: `gLg`, `ZXi`, and `aio` at `cli_inner_pretty.js:39193-39247`, `39426-39467`.

### Model-directed tab cleanup contract

**What it does:** Makes tabs created by Claude explicitly disposable and tells the model when to
close them.

**How it works:**
1. The `tabs_create_mcp` description says created tabs belong to the current task.
2. It requires `tabs_close_mcp` as soon as a tab is no longer needed and again before task finish.
3. It preserves an exception when the user asked to see or retain a tab.
4. `tabs_close_mcp` limits closure to tabs in the current session group.
5. Closing the final tab removes the group; the next context call with `createIfEmpty` starts fresh.

**Why this approach:**
- The bridge cannot infer task-level intent from activity alone. An automatic idle timer could close
  a page the user wanted left open or preserve a page the model abandoned.
- Encoding ownership in the tool description lets the planning model perform semantic cleanup.
- Group enforcement keeps a mistaken ID from closing an unrelated browser tab.

This is the concrete 2.1.221 changelog change. The cleanup sentence is present at
`cli_inner_pretty.js:30320` in 2.1.227 and absent from 2.1.220. No code in this bundle automatically
walks and closes all model-created tabs, so the correct interpretation is a **tool-contract change**,
not a process-level tab reaper.

**Key insight:** Safety is split between enforcement and intent: the extension enforces “only this
group,” while the model contract decides “this tab is no longer needed.”

## 3. MCP projection and screenshots

### Bridge result normalization

**What it does:** Converts bridge-native tool responses into MCP content while retaining errors,
images, notices, authentication failures, and session metadata.

**How it works:**
1. The dispatcher handles local control tools (`switch_browser`, list, select) before normal relay.
2. Host tools may bypass the browser when an embedding host advertises an equivalent operation.
3. It ensures connection, performs browser selection, runs the tab-context front load, and calls the
   bridge.
4. Empty/undefined bridge results become a stable text completion rather than malformed MCP output.
5. Error content is normalized to typed content blocks and remains `isError: true`.
6. Extension image objects with nested `source` become standard MCP image blocks with `data` and
   `mimeType`.
7. Authentication-looking content invokes the host authentication callback.
8. Notices survive in metadata, while internal front-load and timeout flags are removed at the MCP
   server boundary.

**Why this approach:**
- The extension and MCP SDK use related but non-identical content shapes.
- Normalizing at one boundary prevents every downstream renderer from understanding bridge-private
  structures.
- Host-tool interception permits Desktop or another host to implement privileged operations without
  round-tripping through the extension.

**Key insight:** `createClaudeForChromeMcpServer` is an adapter boundary: bridge routing metadata is
useful inside the relay but deliberately does not become part of the public model-visible result.

Evidence: `iio`, `yLg`, and `aio` at `cli_inner_pretty.js:39248-39467`.

### Secure screenshot persistence with inline fallback

**What it does:** Implements `save_to_disk` without losing the screenshot when filesystem
persistence is unavailable or fails.

**How it works:**
1. Processing is skipped for errors and results without image blocks.
2. A host-provided save directory is created with directory mode `0700`; otherwise a private
   `claude-chrome-screenshots-*` temporary directory is used.
3. Reused temporary directories are accepted only if they are directories owned by the current UID
   with mode `0700`; otherwise a new directory is created.
4. Each image receives a timestamp/counter filename and an extension derived from a fixed MIME map.
5. The write uses exclusive creation (`wx`) and mode `0600`, preventing overwrite and broad read
   access.
6. The original inline image remains in the result. A successful write appends the saved path; a
   failed write appends an explanatory note.
7. Sessions that intentionally provide no save directory tell the model not to retry and to use the
   inline image.

**Why this approach:**
- Disk persistence is optional delivery, not the authoritative image representation.
- Exclusive writes avoid path collisions, while strict directory/file modes reduce local exposure.
- Retaining the inline block makes the operation failure-tolerant and avoids a retry loop in
  read-only or remote sessions.

**Key insight:** `save_to_disk` is additive. It never replaces the inline image with a path, so a
partial filesystem failure cannot destroy the tool’s primary output.

Evidence: `saveChromeScreenshots` (`sbc`) at `cli_inner_pretty.js:38915-39020`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `ChromeBridgeClient` (`$no`) — WebSocket, discovery, pairing, calls, liveness, and reconnect.
- `createChromeBridgeClient` (`Pno`) — bridge client factory.
- `frontloadChromeTabContext` (`gLg`) — bounded per-session tab-context creation.
- `attachFrontloadedTabContext` (`ZXi`) — result and private group metadata merger.
- `dispatchChromeTool` (`iio`) — host/browser dispatch and save-to-disk coordinator.
- `createClaudeForChromeMcpServer` (`aio`) — local MCP façade and session group memory.
- `saveChromeScreenshots` (`sbc`) — private, exclusive screenshot writer.
