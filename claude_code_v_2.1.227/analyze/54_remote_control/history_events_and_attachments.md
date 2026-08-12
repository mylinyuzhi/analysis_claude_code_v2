# Remote Control history, event boundaries, and attachments

History backfill is security-sensitive because a local transcript can outlive its remote server
session or the login that created it. 2.1.227 therefore carries explicit suppression state across
reattach, remint, persistence hydration, compaction, and teardown.

### Reattach-or-remint decision

**What it does:** Chooses whether to resume an existing server session, fail safely, or create a fresh
session without importing stale history.

**How it works:**
1. `createRemoteControlBridge` (`MGp`, `cli_inner_pretty.js:521558-522890`) tries to unarchive a
   supplied session pointer before creating transport credentials.
2. Elevated-auth outcomes preserve the pointer and surface an authentication failure instead of
   creating a replacement (`521668-521695`).
3. If a reattach-or-fail pointer is gone, initialization terminates and asks the user to retry/start
   fresh explicitly (`521696-521717`).
4. For an ordinary stale pointer, the bridge latches `Wt`, selects a neutral title, invokes the
   gone-bounce callback, and mints a new session (`521718-521741`).
5. The initial-history flush runs only when history is allowed and `Wt` is false
   (`522580-522620`).
6. The exported bridge state sets `noHistoryBackfill` to the caller suppression flag **or** `Wt`
   (`522728-522731`).

**Why this approach:**
- Explicit resume promises referential continuity; silently substituting a different session would
  violate that promise.
- Interactive recovery may create a replacement, but the replacement must not inherit history that
  belonged to the expired server identity.
- A neutral title prevents even a stale transcript-derived title from leaking across the boundary.
- The trade-off is that a recovered fresh remote view starts empty even though the CLI still has
  local context.

**Key insight:** “Fresh session” and “same local conversation” are intentionally decoupled. The
replacement can continue locally while its remote history channel starts from a clean boundary.

### Account-bound no-backfill taint

**What it does:** Prevents persisted or environment-transferred Remote Control pointers from moving
history between claude.ai accounts or organizations.

**How it works:**
1. `initializeRemoteControlSession` (`cSv`, `826925-827384`) computes the current conversation entry
   and detects a torn transcript/session pair created during resume.
2. A restored pointer is compared with the current credential-store account and organization
   (`827025-827057`).
3. An environment handoff performs the same identity comparison; missing identity converts it to
   reattach-or-fail rather than assuming it is safe (`827058-827074`).
4. A mismatch clears the remote pointer, enables history suppression, and writes a durable taint when
   the local entry pair is coherent.
5. A torn pair receives precautionary in-memory suppression but no permanent taint, avoiding stamping
   the wrong transcript during the resume window.
6. Suppression is re-consulted after awaited policy/auth work and before persistence sync, closing a
   time-of-check/time-of-use gap (`826947-826986`, `827100-827116`).

**Why this approach:**
- Remote session IDs alone do not encode the human account that owns their local history.
- Durable taints survive restarts and prevent later code paths from accidentally re-enabling
  backfill.
- The torn-pair exception avoids corrupting the wrong file while still choosing confidentiality.
- Rechecking after awaits costs complexity but defends against login changes during startup.

**Key insight:** No-backfill is a monotone safety carrier for a conversation epoch: once ownership is
uncertain, later convenience paths cannot silently clear it.

### Atomic initial-history cap

**What it does:** Limits initial replay to 200 persistable events without starting in the middle of a
logical turn or tool exchange.

**How it works:**
1. Initial messages are filtered through the persistable-event predicate before capping
   (`522611-522614`).
2. `capInitialHistoryAtTurnBoundary` (`XXb`, `523023-523032`) computes the naive cut point
   `length - cap`.
3. It enumerates atomic ranges produced by the transcript grouping algorithm.
4. If the cut point lands inside a range, it moves backward to that range's start.
5. The resulting slice is converted to SDK messages, stamped historical, and associated with the new
   server session ID (`522614-522620`).
6. If the surviving tail indicates an active turn, worker state is reported running so attached
   clients do not interpret the hydrated transcript as idle.

**Why this approach:**
- A hard item slice is cheap but can orphan a tool result, assistant block, or compaction boundary.
- Moving backward preserves semantic validity and slightly exceeds the nominal cap only when needed.
- Keeping the recent tail aligns the remote view with the context the local model is still using.
- The trade-off is a variable actual replay count and dependence on accurate turn grouping.

**Key insight:** The cap is a target, while transcript atomicity is an invariant. The implementation
sacrifices an exact count before it sacrifices a valid conversation suffix.

### Persistence hydration across compaction

**What it does:** Uploads only locally missing transcript entries and preserves the relationship
between a compaction summary and the events it replaces.

**How it works:**
1. `backfillRemotePersistence` (`HXm`, `826647-826717`) refuses immediately when suppression or a
   cross-account carrier is present.
2. It reads remote main and subagent internal events and builds a set of server-known UUIDs.
3. Local transcript scanning excludes UUIDs already present and is bounded by a taint-sweep budget.
4. Budget exhaustion enables a precautionary hold; a detected taint aborts main and subagent upload
   together.
5. Compaction entries are written with `isCompaction` plus the UUIDs from
   `compactMetadata.preservedMessages`, clamped by the outbound client before transmission
   (`521037-521060`, `826681-826703`).
6. Only after sync remains current does initialization install the live transcript writer and hydrate
   readers (`826974-827002`).

**Why this approach:**
- UUID set subtraction makes hydration idempotent across reconnects.
- Treating main and subagent history as one taint domain prevents indirect leakage through child
  transcripts.
- Preserved-event IDs let the server/client reconstruct post-compaction history boundaries instead
  of treating the summary as an unrelated message.
- Scanning is budgeted to avoid startup stalls; the conservative trade-off is refusing backfill when
  proof cannot be completed in time.

**Key insight:** Compaction reduces content but not lineage. The preserved UUID list carries enough
identity for a resumed remote client to understand what the summary supersedes.

### Reset, progress, and boundary propagation

**What it does:** Keeps attached clients synchronized through `/clear` and compaction without
conflating an in-progress operation with a completed transcript boundary.

**How it works:**
1. Queued SDK events are filtered and forwarded through `flushQueuedSdkEvents` (`PXm`,
   `827637-827643`).
2. `compact_progress` carries hook/start/end phases; `system/compact_boundary` marks the completed
   transcript boundary (`932895-933086`).
3. Remote-client reducers enter compacting state on status, ignore duplicate compacting status, and
   clear it on the boundary or completed message (`847760-847823`).
4. `conversation_reset` creates a new conversation ID and tells clients to mount a fresh transcript.
5. The reducer clears old messages, streaming state, tool-use state, and cached partial assistant
   output while retaining only explicitly queued local user messages that must survive
   (`847844-847870`).
6. Teardown detects an undelivered reset and preserves the reset boundary rather than archiving it
   away (`828680-828725`).

**Why this approach:**
- Progress is transient UI state; a boundary is durable transcript structure; reset replaces identity.
- Separate event types avoid clients guessing state from a silent pause or an empty response.
- Retaining queued local input prevents user text from disappearing during a simultaneous reset.
- The trade-off is more reducer branches and teardown bookkeeping across every attached surface.

**Key insight:** `/clear` is not an empty assistant message. It is an identity transition, so it must
be propagated even when it produces no ordinary content.

### Empty local-command projection

**What it does:** Prevents output-less local slash commands such as `/clear` from appearing remotely
as a synthetic `(no content)` assistant message.

**How it works:**
1. The transcript-to-SDK projection recognizes local-command stdout/stderr wrappers
   (`478145-478169`).
2. `projectNonEmptyLocalCommandOutput` (`rkn`, `478170-478185`) strips wrapper tags and trims the
   resulting text.
3. An empty result returns `null`.
4. The caller converts `null` to an empty projection list instead of an assistant message.
5. Non-empty output retains the original UUID and timestamp, preserving deduplication and ordering.
6. Reset and other control events travel through their typed paths rather than being inferred from
   command output.

**Why this approach:**
- The internal `(no content)` sentinel is useful in local command machinery but is not meaningful
  transcript content.
- Filtering at the projection boundary avoids changing terminal behavior.
- UUID preservation keeps real command output stable across reconnect.
- The trade-off is that clients see no assistant row for a genuinely silent command, which matches
  its semantics.

**Key insight:** The fix removes a representation leak: an internal fallback string no longer escapes
as user-visible remote conversation data.

### Direct app-image delivery

**What it does:** Presents eligible photos from web/mobile clients directly as model image blocks
while preserving verified-file behavior for other attachments.

**How it works:**
1. `resolveInboundAttachment` (`fSv`, `827455-827505`) downloads through OAuth, enforces declared and
   actual size caps, sanitizes the filename, and writes a mode-0600 upload file.
2. Signed attachments verify SHA-256 and remain path references; failures become explicit notices.
3. For an app image with no SHA field, direct-inline mode calls the image decoder and returns an
   image content block; decoding failure falls back to the secure path.
4. `resolveInboundAttachments` (`IXm`, `827506-827566`) caps total attachments, resolves at concurrency
   four, and independently accumulates path references, image blocks, and failures.
5. `mergeInboundAttachmentsIntoMessage` (`FPi`, `827582-827596`) disables direct inlining for command
   prompts, prepends image blocks before text, and adds path/failure text to the last textual block.
6. If every attachment fails and the caption is empty, a textual failure placeholder is emitted so
   the inbound user turn is not silently lost.

**Why this approach:**
- Model-native image blocks eliminate the extra Read/file-tool round trip for ordinary app photos.
- Signed attachments keep integrity and path semantics because their digest participates in the
  security contract.
- A secure local write remains the fallback and supports non-image files.
- Bounded count, size, and concurrency limit memory/network pressure; the trade-off is that excess
  attachments are reported rather than processed.

**Key insight:** “Inline” is a content-routing decision, not a bypass of download safety. The image is
still authenticated, size-checked, securely materialized, and only then converted to a model block.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createRemoteControlBridge` (`MGp`) — reattach/remint and initial replay coordinator.
- `capInitialHistoryAtTurnBoundary` (`XXb`) — atomic suffix selection.
- `backfillRemotePersistence` (`HXm`) — taint-safe local/remote history reconciliation.
- `initializeRemoteControlSession` (`cSv`) — account and no-backfill boundary.
- `projectNonEmptyLocalCommandOutput` (`rkn`) — blank-output filter.
- `resolveInboundAttachment` (`fSv`) — one-attachment security and representation resolver.
- `resolveInboundAttachments` (`IXm`) — bounded multi-attachment coordinator.
- `mergeInboundAttachmentsIntoMessage` (`FPi`) — path/image/text composition.
