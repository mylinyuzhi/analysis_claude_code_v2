# Remote Control transport and session lifecycle

The wire is deliberately asymmetric. Client-to-server transcript/state traffic uses retrying HTTPS
queues, while server-to-client messages and control requests use an SSE stream. Worker epochs and
sequence numbers connect those halves without pretending they share identical delivery guarantees.

### Split directional transport

**What it does:** Gives durable outbound events and latency-sensitive inbound commands independent
failure and retry behavior.

**How it works:**
1. `createRemoteControlTransport` (`Jga`, `cli_inner_pretty.js:521391-521555`) registers or accepts a
   worker epoch and derives the `/worker/events/stream` endpoint.
2. `RemoteControlSseTransport` (`Fxn`, `519961-520382`) owns the inbound SSE connection and POST
   response channel.
3. `RemoteControlClient` (`Uxn`, `520442-521243`) owns outbound event batches, internal transcript
   events, delivery acknowledgements, worker state, metadata, and heartbeats.
4. The wrapper reports an event as both received and processed after the SSE callback accepts it.
5. Outbound-only mirror mode skips the SSE connect but still initializes the publishing client.
6. The public transport becomes write-ready when worker initialization succeeds; the SSE stream may
   still be opening, so write readiness and inbound connectivity remain separate states.

**Why this approach:**
- Outbound transcript holes are expensive and deserve queues, retry, and backpressure.
- Inbound commands must be fresh; reconnecting a stream is safer than replaying an opaque socket.
- Separate readiness avoids blocking outbound mirroring on an inbound stream that is intentionally
  absent or temporarily reconnecting.
- The trade-off is a larger lifecycle state space: worker initialization, write readiness, SSE
  connectivity, and session ownership must be reconciled explicitly.

**Key insight:** “Connected” is not one boolean. The wrapper distinguishes a registered writer from
an open inbound stream, which is essential for mirror mode and partial recovery.

### Sequence-anchored SSE recovery

**What it does:** Reconnects without replaying the entire server backlog or silently duplicating
already consumed control events.

**How it works:**
1. The transport stores `lastSequenceNum` and seeds it from a persisted reattach pointer when one is
   available (`519983-520014`).
2. Each reconnect sends both `from_sequence_num` and `Last-Event-ID` when the sequence is nonzero
   (`520025-520047`).
3. Durable frames advance the sequence and enter a bounded seen-sequence set; duplicate observations
   are diagnosed rather than treated as new input (`520142-520190`).
4. The seen set is pruned at 1,000 entries, retaining recent duplicate detection without unbounded
   memory growth.
5. HTTP 401, 403, and 404 are permanent at this transport layer; other connection failures enter
   reconnect backoff (`520048-520083`).
6. A successful recovery resets attempts and downtime state and invokes the higher-level
   `onReconnected` reconciliation hook (`520084-520126`).

**Why this approach:**
- A monotone server sequence is cheaper and more precise than resending a growing event log on every
  reconnect.
- Sending the anchor in both URL and standard SSE header accommodates server/proxy variations.
- A bounded duplicate window catches local anomalies without retaining the full session history.
- Permanent authentication/not-found failures are promoted upward because blind reconnect cannot
  repair them; the trade-off is reliance on the bridge layer to refresh or remint correctly.

**Key insight:** The reconnect anchor is transport continuity, not transcript identity. Session and
account checks occur above it before an old sequence is trusted.

### Durable queue with ephemeral degradation

**What it does:** Prevents streaming deltas from causing event-loop stalls or reconnect backlog growth
without weakening delivery of completed transcript events.

**How it works:**
1. `RetryingBatchQueue` (`Oxn`, `519672-519795`) bounds queue size, batch count, and optionally batch
   bytes; producers wait when the queue is full.
2. Failed batches are prepended for retry with exponential delay, server retry hints, and jitter.
3. Completed assistant/system events enter the durable event uploader; stream deltas are marked
   ephemeral (`520993-521036`).
4. `coalesceRemoteStreamEvents` (`gGp`, `519633-519671`) merges adjacent text, JSON, or thinking
   deltas only when message index, delta type, and parent tool-use identity match.
5. Coalescing stops before the 60-KiB payload ceiling; oversize ephemeral frames are dropped and
   diagnosed rather than blocking durable progress.
6. Before a final assistant event is queued, the pending stream buffer is flushed, preserving the
   causal order “partial output, then completed message.”

**Why this approach:**
- Backpressure protects durable history from silent loss.
- Partial stream frames are replaceable by the eventual assistant message, so degrading them is
  preferable to accumulating an ever-growing replay queue.
- Semantic merge keys prevent deltas from different messages or nested tools being combined.
- The 4-KiB headroom below the payload ceiling covers serialization overhead; fewer live updates are
  the accepted trade-off for bounded memory and lower event-loop pressure.

**Key insight:** The fix is not “drop backlog.” It classifies which backlog is reconstructible and
allows only that ephemeral class to be coalesced or discarded.

### Liveness and reconnect scheduling

**What it does:** Detects half-open streams and worker-presence loss while avoiding synchronized retry
storms.

**How it works:**
1. Every SSE frame, including a liveness probe, refreshes the stream liveness deadline
   (`520127-520141`, `520288-520310`).
2. No evidence within the liveness window aborts the current stream and enters reconnect.
3. Reconnect delay grows exponentially from the base, caps at the maximum, and adds jitter
   (`520216-520260`).
4. Reconnect has no small fixed attempt ceiling; diagnostics become sparse after the first failures
   so a long outage does not flood telemetry.
5. The outbound client separately heartbeats the worker and clamps a server-proposed interval to
   safe bounds and the remaining credential lifetime (`520442-520990`).
6. If heartbeats fail while SSE remains apparently healthy, the wrapper can close with a typed cause
   so the bridge rebuilds the whole transport instead of trusting a half-healthy pair (`521421-521443`).

**Why this approach:**
- Traffic in either form proves stream liveness; requiring business messages would disconnect idle
  sessions.
- Jitter prevents many workers from reconnecting simultaneously after an outage.
- Unlimited background recovery favors long-lived sessions, while sparse diagnostics bound noise.
- Separate heartbeat and SSE health catch asymmetric failures, at the cost of typed recovery paths in
  the bridge coordinator.

**Key insight:** A live SSE socket does not prove the server still recognizes the worker. The two
health signals deliberately cross-check different failure domains.

### Worker initialization and stale-anchor fallback

**What it does:** Establishes one active publishing epoch and hydrates persistence without depending
on a stale pagination anchor.

**How it works:**
1. `createRemoteControlTransport` obtains a worker epoch before constructing the two transport halves
   (`521391-521412`).
2. The outbound client initializes that epoch; only then does the wrapper advertise write readiness
   (`521535-521550`).
3. Persistence reads paginate `/worker/internal-events` with `after_event_id` only on the first page;
   cursors replace it on subsequent pages (`521098-521113`).
4. If the server rejects the feature or reports `after_event_id_not_found`, the read restarts without
   the anchor and records which fallback occurred (`521114-521134`).
5. An epoch mismatch closes the shared wrapper with a typed cause, terminating both halves exactly
   once (`521413-521450`).
6. The bridge decides whether that cause is recoverable, requires new credentials, or means another
   worker superseded this one.

**Why this approach:**
- Epoch ownership prevents two workers from concurrently publishing one session.
- Anchor fallback handles old server gates and retention-pruned events without making hydration
  permanently fail.
- Closing both halves avoids a writer surviving after its reader has lost ownership.
- Refetching without an anchor costs bandwidth, but it is safer than accepting a silently incomplete
  persistence view.

**Key insight:** Sequence anchors optimize the normal path; worker epoch is the authority boundary.
When they disagree, ownership wins over incremental efficiency.

### Supersession-aware teardown

**What it does:** Prevents a replaced worker from archiving the server session now owned by its
successor.

**How it works:**
1. Bridge teardown latches stashed close codes before stopping timers, queues, and state publishers
   (`522621-522662`).
2. Epoch conflict and terminal 403/404 conditions are classified as known or unknown supersession.
3. Pending queues are dropped or briefly flushed according to teardown reason, and worker state is
   set idle.
4. `archiveRemoteSessionUnlessSuperseded` (`C$r`, `522980-522995`) returns
   `skipped_superseded` when the latch is set and performs no archive request.
5. Teleport/remint-loop paths have their own skip reasons; ordinary teardown archives with a strict
   timeout and one token-refresh retry (`522663-522719`).
6. Telemetry records archive outcome separately from bridge teardown completion.

**Why this approach:**
- Archival is correct for a worker that intentionally ends its session, but destructive for a worker
  that merely lost an ownership race.
- Latching the cause before asynchronous cleanup prevents later close events from erasing the reason.
- A bounded archive timeout keeps process shutdown responsive.
- Some abandoned sessions may remain server-side when ownership is uncertain; that is safer than
  archiving an active successor.

**Key insight:** Cleanup is not universally idempotent across owners. The losing worker must omit an
otherwise normal cleanup action because session ownership has moved.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `coalesceRemoteStreamEvents` (`gGp`) — adjacent ephemeral-delta coalescer.
- `RetryingBatchQueue` (`Oxn`) — bounded batch/retry/backpressure primitive.
- `RemoteControlSseTransport` (`Fxn`) — inbound stream and sequence recovery.
- `RemoteControlClient` (`Uxn`) — outbound worker client.
- `createRemoteControlTransport` (`Jga`) — epoch-aware transport wrapper.
- `archiveRemoteSessionUnlessSuperseded` (`C$r`) — ownership-safe teardown archive.
