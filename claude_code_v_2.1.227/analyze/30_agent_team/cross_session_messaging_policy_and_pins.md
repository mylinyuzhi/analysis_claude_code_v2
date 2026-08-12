# Cross-session messaging policy, resolution, and recipient pins

## Scope and version result

The 2.1.224 changelog introduces cross-session `SendMessage`, `ListAgents` discovery, and the
`crossSessionInbound`/`dialogExpiry` settings. The binary evidence needs a narrower statement:

- `SendMessage` and `ListAgents` already exist in 2.1.220.
- `crossSessionInbound` is a verified window addition: 14 exact sites in 2.1.227 and none in 2.1.220.
- `dialogExpiry` is a verified window addition: two exact sites in 2.1.227 and none in 2.1.220.
- The new part of `SendMessage` is the multi-transport peer/session address space, its inbound authority
  gate, and the pinning rules that prevent an already-confirmed remote identity from silently rebinding.
- Exact attribution to 2.1.224/2.1.225 comes from the changelog because intermediate bundles are absent.

The related roster construction is documented in
[`list_agents_addressability.md`](list_agents_addressability.md). This document starts after a name or
`name [ref]` token enters the `SendMessage` resolver.

### Recipient Resolution Across Local and Remote Populations

**What it does:** Resolves one supplied recipient into a teammate mailbox, local subagent,
Unix-domain-socket session, cloud session, or Remote Control session without silently guessing through
an ambiguous or partially unavailable population.

**How it works:**
1. `resolveSendMessageRecipient` (`NRn`, `:564572-564844`) gives explicit local identities first
   priority: the main agent, in-process teammate registry, live local-agent registry, and persisted team
   roster are checked before cross-session sources.
2. A typed `name [ref]` is parsed into a normalized name plus a short identity reference. The resolver
   concurrently loads live local peers and cloud sessions, then reconciles Remote Control bridge rows.
3. A reference match uses `findCandidateByReference` (`vJp`, `:564852-564856`), so the reference—not the
   display name—is the decisive identity component.
4. A plain name is indexed across all candidate kinds. A unique exact match proceeds; multiple matches
   produce up to three candidates and require confirmation.
5. A prefix match is allowed only when it is at least three characters and the full population was
   searched. If a remote population is unavailable, the result becomes “confirm required” instead of
   selecting the sole currently visible local row.
6. `mapReachableCandidateToSendTarget` (`ORn`, `:564911-564935`) converts the resolved candidate into a
   transport-specific internal target.

**Why this approach:**
- A single namespace is convenient for the model, but display names are not globally unique and remote
  discovery can fail independently. Treating partial discovery as uniqueness would turn a network
  failure into an identity switch.
- Short references keep the roster readable while retaining an identity discriminator.
- Requiring confirmation for ambiguous prefixes costs an extra turn but prevents a message intended for
  another machine from reaching a same-named local session.
- Local identities retain priority for compatibility with older team/subagent semantics; explicit remote
  references still override name ambiguity.

**Key insight:** “Only one candidate was returned” is not equivalent to “only one candidate exists.” The
resolver carries remote-source failure state so a missing population cannot manufacture false uniqueness.

### Confirmed-recipient Pinning

**What it does:** Remembers the concrete identity behind a confirmed name and refuses to swap it for a
same-named session merely because one discovery source is temporarily unavailable.

**How it works:**
1. A pin stores `{id, name, ref}` under the normalized display name. `classifyPinnedIdentity` (`Ioi`,
   `:564761-564767`) distinguishes local agent, local session, cloud session, and Remote Control session
   from the ID shape.
2. `resolvePinnedCandidate` (`kJp`, `:564944-564987`) reads the pin only when the corresponding remote
   source was actually searched. A cloud pin is not considered stale when the cloud list failed; the
   same rule applies to the bridge.
3. A local row that merely claims the body of a remote identity is excluded through
   `localClaimedRemoteBodies`, closing the “same visible name, different transport” substitution.
4. The pin resolves only if its ID is in the current candidate set. If the pinned display name changed
   and the old name now belongs to another candidate, automatic rebound is refused.
5. `rehydrateSendMessagePins` (`RJp`, `:565061-565066`) reconstructs pins only from successful historical
   tool results, so a failed or denied send cannot become identity authority after resume.
6. A genuinely stale pin is surfaced as stale or ambiguous. It is not silently rewritten to whichever
   same-named row remains.

**Why this approach:**
- Binding to an ID provides stronger continuity than binding to a name, while retaining the name makes
  transcript recovery and errors understandable.
- Persisting only successful results gives pins an auditable consent lineage.
- Requiring a reference on every send would be safer but burdens ordinary local teamwork. Name-first plus
  confirmation pins preserves usability after one explicit decision.
- The trade-off is stale-pin friction when a remote session is legitimately recreated with a new ID. The
  design chooses re-confirmation over silent migration.

**Key insight:** The 2.1.225 fix is not ordinary caching. A pin is a small identity-security boundary:
discovery failure removes information, and removed information is never allowed to reassign authority.

### Inbound Policy Merge and Defaulting

**What it does:** Decides whether an inbound peer message is accepted immediately, held for approval, or
refused, while allowing repository configuration to tighten—but not loosen—higher-scope policy.

**How it works:**
1. `resolveExplicitCrossSessionPolicy` (`$Jp`, `:565145-565166`) scans managed, CLI-flag, and user settings
   in precedence order and takes the first explicit `crossSessionInbound` value.
2. It then scans local and project settings. A repository value is accepted only if stricter than the
   current value according to the internal `accept < hold < refuse` rank. Equal non-accept values can
   retain repository attribution for an accurate explanation.
3. `resolveInboundPeerPolicy` (`MJp`, `:565181-565201`) applies runtime defaults when there is no explicit
   setting. Self-sent messages are accepted. Unknown permission state fails closed to `hold`.
4. With permission-mode attestation enabled, matching prompting/bypass classes accept; a mismatch holds.
   A receiver in bypass mode holds a message whose sender supplied no mode attestation.
5. Non-peer task notifications bypass this gate. Coordinator peer messages honor only an explicit
   setting, avoiding accidental application of local peer defaults to a different provenance class.

**Why this approach:**
- Bypassed-permission sessions cannot show ordinary tool prompts, so immediately injecting remote model
  text would expand authority without a local decision.
- Repository settings may tighten because a repository can express a stricter local risk posture. Letting
  repository content loosen a managed or user policy would make checked-out code an authority source.
- Permission-mode class comparison is a compact proxy for whether sender and receiver have comparable
  human-approval assumptions.
- Fail-closed `hold` increases startup latency but avoids accepting messages while mode wiring is absent
  or throwing.

**Key insight:** `crossSessionInbound` is not a normal last-write-wins setting. It is a monotone policy
merge: lower-trust repository scopes can only move the result toward less automatic delivery.

### Bounded Hold Queue and Expiry

**What it does:** Keeps a message pending long enough for approval or startup recovery without parking it
forever or allowing an unbounded peer to consume memory.

**How it works:**
1. `gateInboundPeerMessage` (`BJp`, `:565236-565274`) dispatches the three policy outcomes.
2. `accept` immediately records the gate and releases policy-eligible held messages.
3. `refuse` emits a reason that distinguishes explicit opt-out from the global kill switch.
4. `hold` refuses late arrivals during shutdown. Otherwise it appends to a 100-message buffer
   (`HcS = 100`, `:565400`); when full, the oldest message is expired before the new one is appended.
5. Every held message gets a delivery receipt and optional UI announcement. Setting or mode changes
   trigger release/drop callbacks rather than detaching the message from UI state.
6. `settleHeldMessagesOnShutdown` (`yva`, `:565124-565135`) marks all remaining messages expired and waits
   only for a bounded receipt-settlement race. The `dialogExpiry` resolver (`:60873`) supplies the dialog
   lifetime for interactive approval surfaces.

**Why this approach:**
- A FIFO cap preserves recent intent under sustained input and gives deterministic eviction semantics.
- Expiry receipts turn “not delivered” into observable state for the sender, fixing the prior
  parked-without-notice failure class.
- Draining on shutdown prevents a resumed process from inheriting messages whose dialog no longer exists.
- The fixed entry cap is simple and predictable; a byte cap would better account for large bodies but make
  eviction and user-visible counts less stable.

**Key insight:** Holding is a protocol state, not just a local array. The sender sees `held`, followed by
a delivered, denied, or expired settlement, so headless and startup paths can recover without a TUI.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `resolveSendMessageRecipient` (`NRn`) - multi-population recipient resolution.
- `resolvePinnedCandidate` (`kJp`) - validates a prior identity pin against complete discovery results.
- `resolveExplicitCrossSessionPolicy` (`$Jp`) - monotone settings merge.
- `resolveInboundPeerPolicy` (`MJp`) - runtime policy and permission-mode defaulting.
- `gateInboundPeerMessage` (`BJp`) - accept/hold/refuse state transition.
- `settleHeldMessagesOnShutdown` (`yva`) - bounded shutdown expiry.
