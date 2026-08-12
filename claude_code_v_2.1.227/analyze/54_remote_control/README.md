# 54_remote_control — Transport, history ownership, and client continuity

This module re-derives the complete 2.1.220 Remote Control scope from the 2.1.227 bundle. Remote
Control is not a single socket or UI toggle: it is a policy-gated worker runtime with an outbound
HTTPS event plane, an inbound SSE control plane, durable session ownership, transcript hydration,
conversation-boundary events, and local/remote client state reconciliation.

The 2.1.224–2.1.225 work is principally a continuity and ownership hardening pass. It makes fresh
replacement sessions incapable of inheriting stale local history, preserves compaction boundaries
during hydration, makes reset and progress events explicit to attached clients, prevents blank local
command projections, inlines eligible app photos, and turns connection failure into persistent state
with a recovery action. The 2.1.222 startup change also establishes an asymmetric trust rule:
repository settings may disable Remote Control, but only user/managed settings or explicit startup
intent may enable it.

## Documents

- [transport_and_session_lifecycle.md](transport_and_session_lifecycle.md) — split transport,
  sequence recovery, batching, liveness, initialization, and supersession-aware teardown.
- [history_events_and_attachments.md](history_events_and_attachments.md) — reattach/fresh-session
  ownership, cross-account taints, atomic history caps, compaction/reset propagation, blank-output
  filtering, and direct image blocks.
- [enablement_and_client_state.md](enablement_and_client_state.md) — eligibility, startup precedence,
  resume semantics, persistent failure state, and attached-client reducers.

## 2.1.220 → 2.1.227 result

| Concern | 2.1.227 status | Evidence |
|---|---|---|
| Split SSE/HTTPS transport | Retained and revalidated; inbound replay is sequence-anchored while outbound events are independently queued | `519961-521557` |
| Reconnect backlog | Hardened: ephemeral stream deltas are coalesced/droppable, durable events retain backpressure and retry semantics | `519633-519671`, `519672-521098` |
| Expired server session | Changed: a normal stale pointer may mint fresh, but it latches no-history-backfill and never uploads the old transcript | `521718-521741`, `522728-522731`, `827025-827075` |
| Resume safety | Changed: reattach-or-fail refuses to mint a replacement when the referenced session is gone | `521696-521717` |
| Large compacted history | Hardened: initial history is capped at an atomic turn boundary; persisted compaction entries carry preserved event IDs | `522611-522620`, `523023-523032`, `826647-826704` |
| Attached-client reset/progress | Hardened: compact progress, compact boundary, and conversation reset have distinct state transitions | `827637-827646`, `847760-847870`, `932895-933086` |
| Blank output-less commands | Changed: empty local-command stdout/stderr projections are dropped instead of becoming `(no content)` | `478170-478185` |
| App photos | Changed: eligible unsigned app images are prepended as image content blocks; signed/file attachments retain path semantics | `827455-827596` |
| Auto-start trust | Changed: project/local `false` may disable, project/local `true` is ignored, and user/managed settings decide enablement | `619125-619145`, `948548-948570` |
| Connection failure UI | Changed: failure kind and detail persist in app state and expose dismiss/reconnect shortcuts | `827730-828220`, `837806-838033` |

## Architectural conclusion

The 2.1.227 implementation treats continuity as an ownership problem:

1. Sequence numbers own inbound delivery continuity.
2. Worker epochs own the right to publish and prevent a replaced worker from archiving its successor.
3. Account/org identity and no-backfill taints own whether historical data may cross a session boundary.
4. Conversation-reset IDs own client transcript replacement.
5. Ephemeral and durable queues own different failure trade-offs.

This separation is more complex than reconnecting a duplex socket, but it prevents the more damaging
failure modes: duplicated commands, stale transcript upload, cross-account history leakage, replay
storms, and a disconnected UI that still claims to be attached.

## Scope and confidence

Current-state paths are **Verified** in 2.1.227 and **Cross-checked** against the 2.1.220 report and
bundle. Direct-image delivery, scoped auto-start, no-backfill propagation, supersession archive
suppression, blank-output filtering, and undelivered-reset protection are confirmed 2.1.227-only
anchors. The readable 2.1.88 tree helps recover bridge terminology but predates the current worker
epoch, persistence-taint, and attached-client continuity layers.

Cross-session `ListAgents`/`SendMessage` addressability is analyzed in
[30_agent_team](../30_agent_team/); this module covers only the Remote Control transport that makes
remote recipients reachable.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `RemoteControlSseTransport` (`Fxn`) — sequence-aware inbound SSE transport.
- `RemoteControlClient` (`Uxn`) — outbound state, event, heartbeat, and persistence client.
- `createRemoteControlBridge` (`MGp`) — server-session and worker lifecycle coordinator.
- `initializeRemoteControlSession` (`cSv`) — identity, taint, history, and UI integration boundary.
- `resolveRemoteControlStartupSetting` (`Xci`) — scope-sensitive auto-start resolver.
- `useRemoteControlBridge` (`BXm`) — interactive bridge lifecycle and persistent error state.
