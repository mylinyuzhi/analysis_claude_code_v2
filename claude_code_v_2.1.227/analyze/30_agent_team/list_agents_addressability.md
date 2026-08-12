# ListAgents reachability and addressability

Target anchors: `cli_inner_pretty.js:206412-206422`, `:523673-523850`, and `:577405-577472`.

`ListAgents` is not new in 2.1.227: its description exists at `:231217 (220)`. This document maps the
current implementation and the small but important gap between “visible” and “messageable.”

## 1. Collection

### Multi-Transport Reachability Aggregation

**What it does:** Collects peer sessions reachable through local IPC, cloud, and Remote Control, then
normalizes them into transport-tagged records.

**How it works:**
1. Start local Unix-domain-socket discovery, bridge/Remote-Control discovery, and the cloud/DID
   extension sources concurrently.
2. Local registry files are parsed defensively and their sockets are probed; dead processes are
   pruned when process inspection is available (`:523500-523672`).
3. Each live local session becomes `{transport: "uds", address: "uds:<socket>", session}`.
4. Cloud sessions already represented by a local record would be skipped to avoid duplicate rows.
   In this build `listCloudSessions` returns `{sessions: [], unavailable: undefined}` directly.
5. Bridge rows are reconciled with local/cloud rows, then receive `bridge:<id>` addresses.
6. The current build also initializes the DID source to an empty result and `didFocused` to false;
   cloud and DID are extension slots, not active sources in this path.
7. Return peers plus warning/focus/bridge-walk status for the formatter.

**Why this approach:**
- Parallel discovery bounds latency by the slowest active source rather than their sum.
- Transport tags preserve delivery requirements while the formatter can present one roster.
- Deduplication prevents a locally mirrored cloud session from appearing twice under different names.
- The cost is a reconciliation layer with partial-failure states; a single authoritative directory
  would be simpler but cannot represent offline/local-only sessions.

**Key insight:** The roster is a live reachability join, not a static team membership list.

```javascript
// ============================================
// listAllReachableAgents - Aggregate live peer sessions across available transports
// Location: cli_inner_pretty.js:523680-523702
// ============================================

// ORIGINAL (for source lookup):
async function aya(e) {
  let t = !1,
    r = $S(),
    n = r ? mti() : Promise.resolve({ rows: [], failed: !1, handle: null }),
    o = Promise.resolve({ peers: [], warnings: [] }),
    [i, s, a, l] = await Promise.all([r ? iya() : Promise.resolve([]), n, SKt(), o]),
    c = i.map((d) => ({ transport: "uds", address: `uds:${d.sock}`, session: d }));
  for (let d of a.sessions) {
    if (Dxn(i, d.id)) continue;
    c.push({ transport: "cloud", address: void 0, session: d });
  }
  let u = Kxn(s.rows, i, a.sessions);
  if (a.unavailable !== "fetch_failed") Vxn(s, Yxn(s.rows, a.sessions));
  else FGp(s);
  for (let d of u) c.push({ transport: "bridge", address: `bridge:${d.id}`, session: d });
  for (let d of l.peers) c.push({ transport: "did", address: d.did, session: d });
  return {
    peers: c,
    didWarnings: l.warnings,
    didFocused: t,
    bridgeWalkFailed: s.failed || (s.handle !== null && !hti(s)),
  };
}

// READABLE (for understanding):
async function listAllReachableAgents() {
  const messagingEnabled = isCrossSessionMessagingEnabled();
  const bridgePromise = messagingEnabled ? listBridgeRows() : emptyBridgeResult();
  const didPromise = Promise.resolve({ peers: [], warnings: [] });
  const [localSessions, bridge, cloud, did] = await Promise.all([
    messagingEnabled ? listLiveUdsSessions() : [],
    bridgePromise,
    listCloudSessions(), // currently a resolved empty provider
    didPromise,
  ]);
  const peers = localSessions.map((session) => ({
    transport: "uds",
    address: `uds:${session.sock}`,
    session,
  }));
  for (const session of cloud.sessions) {
    if (!isCloudSessionRepresentedLocally(localSessions, session.id)) {
      peers.push({ transport: "cloud", address: undefined, session });
    }
  }
  for (const session of reconcileBridgeRows(bridge.rows, localSessions, cloud.sessions)) {
    peers.push({ transport: "bridge", address: `bridge:${session.id}`, session });
  }
  return { peers, didWarnings: did.warnings, didFocused: false, bridgeWalkFailed: bridge.failed };
}

// Mapping: aya→listAllReachableAgents, $S→isCrossSessionMessagingEnabled,
//          mti→listBridgeRows, iya→listLiveUdsSessions, SKt→listCloudSessions,
//          Dxn→isCloudSessionRepresentedLocally, Kxn→reconcileBridgeRows
```

## 2. Context reconciliation and formatting

### Addressable Name Reconciliation

**What it does:** Combines transport discovery with in-process task state and assigns display names or
disambiguating references suitable for `SendMessage`.

**How it works:**
1. Load current app state and, when a team context exists, the persisted team file.
2. Extract in-process `local_agent` tasks except the `main-session` agent; reverse the name registry to
   recover user-visible names.
3. Suppress a registry name if it collides with a team-context teammate name.
4. Feed subagents, UDS sessions, cloud sessions, and bridge sessions into the address-candidate
   reconciler.
5. Index candidates by kind and ID, then render “Subagents” and “Peer sessions” sections.
6. Prefer reconciled names/references; fall back to agent ID, session title, cwd basename, or
   `(untitled)`.
7. When the bridge walk is incomplete, warn that rows without a reference are not yet messageable by
   name.

**Why this approach:**
- A readable name is the common `SendMessage` interface across different transports.
- Reference suffixes are shown only for collisions, keeping the normal path concise.
- App/task state supplies in-process agents that no external session registry can see.
- Names may change between listing and sending; the delivery side must still validate the address.

**Key insight:** A row's `[ref]` is a conditional disambiguator, not decorative metadata. The prompt
tells the model to append it only when the bare name is ambiguous or rejected.

### Model Formatter Branches

**What it does:** Produces a bounded text roster with useful status and age fields.

**How it works:**
1. Split peer records into UDS, cloud, bridge, and DID groups.
2. Build normalized address candidates and in-process subagent rows.
3. Render subagents when present.
4. Render peer sessions unless DID-focused mode is active.
5. For local peers include kind, status, optional safe tmux name, and start age.
6. For cloud peers translate `requires_action` to “waiting on a human.”
7. If no rendered sections exist, return `No reachable agents.`

**Why this approach:**
- Human-readable state reduces follow-up calls before messaging.
- Relative age is more compact than timestamps.
- A text result is easy for the model to copy, but less structured than returning rows in the output
  schema; the tool deliberately exposes only `{listing: string}`.

**Key insight:** The structured work is internal; the public tool result is a presentation contract.

## 3. Tool wrapper and edge cases

The `ListAgents` tool is enabled by the cross-session messaging gate, read-only, concurrency-safe, and
capped at 10,000 result characters. Its `channel` and `q` inputs are retained but explicitly described
as unavailable in this build. They are trimmed and passed to `listAllReachableAgents`, whose current
implementation ignores its argument. This preserves a forward-compatible schema without pretending
filtering works.

The tool runs collection and context loading in parallel. It returns the formatted listing directly as
a text tool-result block, making names immediately copyable into `SendMessage({to: ...})`.

The readable 2.1.88 source cross-check confirms `SendMessage` treats bare names and transport-prefixed
addresses differently and revalidates bridge connectivity at send time. It does not contain this
`ListAgents` implementation, so the roster algorithm is verified only from 2.1.227.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `listAllReachableAgents` (`aya`) - live peer join.
- `buildListAgentsContext` (`lya`) - app/team context load.
- `listInProcessSubagents` (`XGp`) - task-registry projection.
- `formatReachableAgentsForModel` (`lJb`) - address reconciliation and section selection.
- `formatSubagentRowsForModel` (`cJb`) - subagent state rows.
- `formatPeerSessionRowsForModel` (`uJb`) - local/cloud/bridge rows.
- `listAgentsTool` (`ufS`) - model-facing wrapper.
