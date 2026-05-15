# Fork Interaction — Compaction Across Forks and Resumes (v2.1.142)

## Overview

Claude Code has two slash commands that create derivative sessions from existing ones: `/branch` (the older command, persists a full transcript) and `/fork` (the v2.1.118+ command, writes a *pointer*). Both interact non-trivially with the compaction subsystem:

- **Fork-pointer hydration** (v2.1.118): `/fork` writes a small JSONL header pointing at the parent session, then on read the hydrator follows the pointer to materialize a full message list. Compaction reads the hydrated view, not the on-disk file. This means a fork's `forkedFrom: { sessionId, messageUuid }` field must be tracked through compaction so the child can find its parent.
- **Subagent dedup-on-resume** (v2.1.132): When a subagent is resumed via `--resume`, the loader tracks `resumePersistedCount` — the count of messages already on disk. PTL-driven retries should write only the new tail (not re-append everything), which means compaction inside a resumed subagent needs to know where the on-disk boundary is.
- **`/branch` interaction** (v2.1.116, v2.1.118): The `/branch` command writes a *streaming* JSONL copy (one entry at a time, no memory buffering) and tags each kept entry with `forkedFrom`. Compaction on a branched session works with the regular path because `/branch` *fully materializes* the conversation.

This document walks through:
1. The `forkedFrom` field structure and its compaction implications
2. The `/fork` (background agent) write path — what gets persisted, what stays a pointer
3. The hydration step — how `CT4` / `hydrateForkPointer` materializes the conversation
4. `resumePersistedCount` — how subagent resume avoids re-appending the head on PTL retry
5. `/branch` — the streaming-copy variant; how compaction handles its output
6. The interaction with compact boundary metadata (`preservedSegment`)

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands, /fork, /branch
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Subagent resume, transcript persistence
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact boundary metadata
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11 (fork pointer hydration in detail)

Key functions in this document:
- `hydrateForkPointer` (`CT4`) - Materializes a fork's full transcript from parent + replacements
- `hydrateForkAndAppendMetadata` (`RT4`) - Wraps hydration with title/metadata
- `branchCommandWriter` (`iK4`) - The `/branch` streaming-copy writer
- `branchAndResume` (`rK4`) - The `/branch` slash command handler
- `spawnForkFromDirective` (`lR6`) - The `/fork` (background agent) handler
- `runResumedSubagent` (`uiH`) - Subagent --resume entry point; sets `resumePersistedCount`
- `runSubagentInner` (`Vb`) - Inner subagent loop; consumes `resumePersistedCount`
- `annotateBoundaryWithPreservedSegment` (`yj6`) - Tags compact boundary with kept-message UUIDs
- `resolveSessionTitleFromHistory` (`ih5`) - Reads title from a hydrated session

---

## 1. The `forkedFrom` Pointer

When `/fork` (v2.1.118+) or `/branch` (since v2.1.116) creates a new session, each kept message is annotated with:

```typescript
type ForkedFromPointer = {
  sessionId: string;     // UUID of parent session that owns the original message
  messageUuid: string;   // UUID of the original message — foreign key for hydration
}
```

The pointer is set at the *message level*, not the session level. Every preserved entry carries its own pointer back to its parent. This enables:
- Multi-step rewinds (fork → fork → fork) — each child knows its immediate parent
- Compaction across forks — the post-compaction summary's `forkedFrom` references the pre-compaction parent message UUID

### Two Write Paths, Same Pointer

Both `/branch` and `/fork` write pointers, but they materialize different amounts of content:

| Command | What's on disk | When hydrated |
|---------|-----------------|---------------|
| `/branch` (v2.1.116 streaming) | Full message content + `forkedFrom` per entry | Never — disk IS the truth |
| `/fork` (v2.1.118 pointer) | Pointer-only JSONL header + content-replacements | At read time, by hydrator |

This is the v2.1.118 trade-off: `/branch` was disk-heavy (50MB+ for large sessions), `/fork` is disk-light but pays a small read-time hydration cost. The user-facing UX is identical — both produce a "branched" conversation.

---

## 2. `/fork` Write Path

`spawnForkFromDirective` (`lR6`, cli_inner_pretty.js:427943-428022) handles the `/fork` command. The path:

1. **Sourcing the parent context**: The fork command argument supplies an `upToMessageId` boundary; `lR6` calls `CT4` (hydrate path is also used as the writer) to produce a fresh JSONL with `forkedFrom` annotations.
2. **Stripping the conversation copy**: Unlike `/branch`, `/fork` doesn't `cat` the parent transcript into a new file. It writes a header JSONL with one entry per parent message — but the entries reference the parent's UUIDs via `forkedFrom`, and `parentUuid` chains are rewritten so the child has its own UUID space.
3. **Title and metadata**: `resolveSessionTitleFromHistory` reads the *parent's* title (since the fork inherits the workflow), with a "(fork)" suffix if untitled.

### Code Reference

```javascript
// ============================================
// hydrateForkPointer - Materializes a fork's transcript from parent + content-replacements
// Location: cli_inner_pretty.js:499834-499897
// ============================================

// ORIGINAL (for source lookup):
function CT4(H, $, q, K) {
  let _ = H.transcript.filter((D) => !D.isSidechain);
  if (_.length === 0) throw Error(`Session ${$} has no messages to fork`);
  if (q.upToMessageId) { let D = _.findIndex((j) => j.uuid === q.upToMessageId); if (D === -1) throw Error(`Message ${q.upToMessageId} not found in session ${$}`); _ = _.slice(0, D + 1); }
  let A = new Map();
  for (let D of _) A.set(D.uuid, bZ$.randomUUID());
  let z = _.filter((D) => D.type !== "progress");
  if (z.length === 0) throw Error(`Session ${$} has no messages to fork`);
  let Y = new Map();
  for (let D of _) Y.set(D.uuid, D);
  let f = bZ$.randomUUID(), O = new Date().toISOString(), M = [];
  for (let D = 0; D < z.length; D++) {
    let j = z[D], J = A.get(j.uuid), X = null, L = j.parentUuid;
    while (L) { let G = Y.get(L); if (!G) break; if (G.type !== "progress") { X = A.get(L) ?? null; break; } L = G.parentUuid; }
    let P = D === z.length - 1 ? O : j.timestamp,
        Z = j.logicalParentUuid == null ? j.logicalParentUuid : (A.get(j.logicalParentUuid) ?? null),
        W = { ...j, uuid: J, parentUuid: X, logicalParentUuid: Z, sessionId: f, timestamp: P, isSidechain: !1, teamName: void 0, agentName: void 0, slug: void 0, sourceToolAssistantUUID: void 0, forkedFrom: { sessionId: $, messageUuid: j.uuid } };
    M.push(W);
  }
  if (H.contentReplacements.length > 0)
    M.push({ type: "content-replacement", sessionId: f, replacements: H.contentReplacements, uuid: bZ$.randomUUID(), timestamp: O });
  let w = q.title?.trim();
  if (!w) w = `${K() || "Forked session"} (fork)`;
  return (M.push({ type: "custom-title", sessionId: f, customTitle: w, uuid: bZ$.randomUUID(), timestamp: O }),
    { entries: M, forkedSessionId: f });
}

// READABLE (for understanding):
function hydrateForkPointer(parentSession, parentSessionId, options, resolveTitleFn) {
  // Strip sidechains — child shouldn't inherit other agents' contexts
  let nonSidechainMessages = parentSession.transcript.filter((m) => !m.isSidechain);
  if (nonSidechainMessages.length === 0) {
    throw new Error(`Session ${parentSessionId} has no messages to fork`);
  }

  // If upToMessageId is set, truncate the parent to that boundary
  if (options.upToMessageId) {
    const idx = nonSidechainMessages.findIndex((m) => m.uuid === options.upToMessageId);
    if (idx === -1) throw new Error(`Message ${options.upToMessageId} not found in session ${parentSessionId}`);
    nonSidechainMessages = nonSidechainMessages.slice(0, idx + 1);
  }

  // Mint fresh UUIDs for every message in the child
  const oldToNewUuid = new Map();
  for (const m of nonSidechainMessages) {
    oldToNewUuid.set(m.uuid, crypto.randomUUID());
  }

  // Filter out progress messages (they're transient, never persisted)
  const nonProgressMessages = nonSidechainMessages.filter((m) => m.type !== "progress");
  if (nonProgressMessages.length === 0) {
    throw new Error(`Session ${parentSessionId} has no messages to fork`);
  }

  // Build parent-UUID lookup for parentUuid rewriting
  const parentUuidLookup = new Map();
  for (const m of nonSidechainMessages) {
    parentUuidLookup.set(m.uuid, m);
  }

  const childSessionId = crypto.randomUUID();
  const forkTimestamp = new Date().toISOString();
  const entries = [];

  // For each kept message, build the child-side entry with rewritten UUIDs and forkedFrom pointer
  for (let idx = 0; idx < nonProgressMessages.length; idx++) {
    const msg = nonProgressMessages[idx];
    const newUuid = oldToNewUuid.get(msg.uuid);

    // Walk up the parentUuid chain, skipping progress messages (which were filtered out)
    let newParentUuid = null;
    let cursor = msg.parentUuid;
    while (cursor) {
      const parent = parentUuidLookup.get(cursor);
      if (!parent) break;
      if (parent.type !== "progress") {
        newParentUuid = oldToNewUuid.get(cursor) ?? null;
        break;
      }
      cursor = parent.parentUuid;
    }

    // Last message gets the fork timestamp (proves "this is when the fork happened")
    const newTimestamp = idx === nonProgressMessages.length - 1 ? forkTimestamp : msg.timestamp;
    const newLogicalParentUuid = msg.logicalParentUuid == null
      ? msg.logicalParentUuid
      : (oldToNewUuid.get(msg.logicalParentUuid) ?? null);

    entries.push({
      ...msg,
      uuid: newUuid,
      parentUuid: newParentUuid,
      logicalParentUuid: newLogicalParentUuid,
      sessionId: childSessionId,
      timestamp: newTimestamp,
      isSidechain: false,
      teamName: undefined,
      agentName: undefined,
      slug: undefined,
      sourceToolAssistantUUID: undefined,
      forkedFrom: { sessionId: parentSessionId, messageUuid: msg.uuid },
    });
  }

  // Carry over content replacements (used for redacting secrets in transcript)
  if (parentSession.contentReplacements.length > 0) {
    entries.push({
      type: "content-replacement", sessionId: childSessionId,
      replacements: parentSession.contentReplacements,
      uuid: crypto.randomUUID(), timestamp: forkTimestamp,
    });
  }

  // Title: explicit > "(fork)" suffix on resolved title > "Forked session (fork)"
  let title = options.title?.trim();
  if (!title) title = `${resolveTitleFn() || "Forked session"} (fork)`;
  entries.push({
    type: "custom-title", sessionId: childSessionId, customTitle: title,
    uuid: crypto.randomUUID(), timestamp: forkTimestamp,
  });

  return { entries, forkedSessionId: childSessionId };
}

// Mapping: CT4->hydrateForkPointer, bZ$->crypto module reference, H->parentSession, $->parentSessionId, q->options, K->resolveTitleFn,
//          A->oldToNewUuid, Y->parentUuidLookup, f->childSessionId, M->entries
```

### Compaction-Specific Concerns

When compaction runs in a forked session:
- The agent reads from the hydrated message list — so all `forkedFrom` pointers are present in-memory
- `compactConversation` (`qrH`) computes `messages.at(-1)?.uuid` for `createCompactBoundaryMessage`'s `parentUuid` — this is the *child's* UUID (the one minted at hydration time), not the parent's
- The new `boundaryMarker` doesn't itself get a `forkedFrom` — boundaries are child-session metadata, they don't trace back
- The compact summary's `summaryMessages` are fresh user-messages with new UUIDs; they too don't inherit `forkedFrom`

So compaction *erases* the fork-relationship for everything after the boundary. The pre-compact messages remain in the on-disk transcript with their `forkedFrom` annotations, but the post-compact context (summary + new messages) is detached. This is consistent with how compaction treats other metadata — it's a semantic checkpoint that doesn't preserve every cross-session reference.

---

## 3. Subagent Dedup-on-Resume (v2.1.132 `resumePersistedCount`)

Subagents persist their conversations to disk as they run. When a user `--resume`s a subagent (e.g. via `SendMessage` to a previously-spawned local agent), the inner loop has to know:
1. Which messages are *already on disk* (don't re-append)
2. Which messages are *new from this resume* (write fresh)

The boundary is captured by `resumePersistedCount`:

```javascript
// (cli_inner_pretty.js:386697)
resumePersistedCount: w.length,
```

`w` is the list of messages loaded from the parent's persisted transcript. Its length becomes the count of "already on disk" messages.

### Where it's Consumed

Inside `runSubagentInner` (`Vb`, cli_inner_pretty.js:393125):

```javascript
resumePersistedCount: h,
```

The value gets passed through the inner loop's options. When the loop attempts a write (after building the next assistant message), it consults `resumePersistedCount` to decide which messages to flush to disk. If a PTL retry truncates the message list, only the *new* messages (beyond `resumePersistedCount`) need re-writing — the prior persisted prefix stays on disk untouched.

### Compaction Inside a Resumed Subagent

Compaction inside a resumed subagent has to play nicely with `resumePersistedCount`. The flow:

1. Subagent is resumed with `messages = [persisted_0..N-1, new_N..N+M]`, `resumePersistedCount = N`
2. The conversation grows; eventually compaction triggers
3. `compactConversation` (`qrH`) replaces the entire `messages` array with `[boundaryMarker, ...summaryMessages, attachments, hookResults]`
4. **The compacted output has length << original** — typically 3-5 entries vs the original N+M

After compaction, the subagent loop's write pump should write *all* of the compacted output as new messages, because the disk-persisted prefix has been semantically *replaced*. But the disk *still has the original* N+M messages on it, including the parent's persisted prefix.

The resolution: `resumePersistedCount` is decoupled from the post-compaction state. Compaction in a subagent writes the new state as a fresh append to the JSONL (with the compact boundary marker indicating "this is a checkpoint"). The on-disk file becomes:

```
[persisted_0..N-1]                 (still there from original session)
[messages_N..N+M]                  (added during resume up to compact)
[compactBoundary]
[summaryMessage]
[attachments]
[hookResults]
[messages_after_compact]           (new turns after compact)
```

The original `[persisted_0..N-1]` and `[messages_N..N+M]` are preserved on disk because the JSONL is append-only. The reader (next time the subagent is resumed) follows compact boundaries and only the post-compact tail is hydrated as the active context.

The bug v2.1.132 fixed: prior versions wrote the *entire* `messages` array on every PTL retry, including re-appending `[persisted_0..N-1]` and `[messages_N..N+M]` over and over. On a 5MB persisted prefix, three PTL retries = 15MB redundant writes. `resumePersistedCount` solved this by telling the write pump "anything before index N is already on disk, skip it on retry writes".

---

## 4. `/branch` — The Streaming Copy

`/branch` is the older command (since v2.1.116 streaming). Unlike `/fork`, it materializes the full conversation:

```javascript
// (cli_inner_pretty.js:428119-428147)
if (!rm(V) || V.isSidechain || !D.has(V.uuid)) continue;
j.set(V.uuid, V);
// ...
for (let G of H) {
  let V = j.get(G.uuid);
  if (!V) continue;
  let v = { ...V, sessionId: K, parentUuid: P, isSidechain: !1, forkedFrom: { sessionId: _, messageUuid: V.uuid } },
      E = { ...V, sessionId: K };
  if ((W.push(E), (Z = V), await L(SH(v) + `\n`), V.type !== "progress")) P = V.uuid;
}
```

The `forkedFrom` field is set here too — same shape as `/fork`. The difference: `/branch` materializes the full message content per entry, so the child JSONL is a complete standalone transcript (no hydration needed on read).

### Compaction on a Branched Session

When compaction runs on a `/branch`-ed session, it behaves identically to compaction on an original session. The branched session's transcript is fully materialized; the compactor reads it the same way it reads any session. The only artifact left is the `forkedFrom` annotations on the pre-compact messages, which serve as an audit trail ("this came from session X") but are otherwise inert.

---

## 5. Compact Boundary + Fork-Aware Metadata

`annotateBoundaryWithPreservedSegment` (`yj6`) is the function that tags compact boundaries with which messages were kept:

```javascript
// ============================================
// annotateBoundaryWithPreservedSegment - Adds preservedSegment metadata to a compact boundary
// Location: cli_inner_pretty.js:407563-407574
// ============================================

// ORIGINAL (for source lookup):
function yj6(H, $, q, K = q) { let _ = VNH([...q], K).map((A) => A.uuid); if (_.length === 0) return H; return { ...H, compactMetadata: { ...H.compactMetadata, preservedSegment: { headUuid: _[0], anchorUuid: $, tailUuid: _.at(-1) }, preservedMessages: { anchorUuid: $, uuids: _ }, }, }; }

// READABLE (for understanding):
function annotateBoundaryWithPreservedSegment(boundary, anchorUuid, messagesToKeep, comparisonSource = messagesToKeep) {
  const preservedUuids = computeOrderedDiff([...messagesToKeep], comparisonSource).map((m) => m.uuid);
  if (preservedUuids.length === 0) return boundary;
  return {
    ...boundary,
    compactMetadata: {
      ...boundary.compactMetadata,
      // Old-style: headUuid + anchorUuid + tailUuid (3 points)
      preservedSegment: { headUuid: preservedUuids[0], anchorUuid, tailUuid: preservedUuids.at(-1) },
      // New-style: anchorUuid + uuid list (for partial-compact with non-contiguous segments)
      preservedMessages: { anchorUuid, uuids: preservedUuids },
    },
  };
}

// Mapping: yj6->annotateBoundaryWithPreservedSegment, VNH->computeOrderedDiff
```

The `preservedSegment.anchorUuid` is what links the kept-messages chain back into the post-compaction conversation. For a *forked* session that gets compacted, the anchor is the *child's* UUID (because `parentUuid` was rewritten at fork time), so the link is internally consistent.

The combination is what makes "fork → compact → fork again" work. The first fork captures the parent state with `forkedFrom`. The first compaction inside the fork sets a boundary anchoring `messagesToKeep` to the boundary's parent. A second fork from inside the compacted state captures the post-compact state with `forkedFrom` pointing to the (still-existing) original parent messages — the compact boundary doesn't break the chain, because the on-disk JSONL keeps everything.

---

## 6. Multi-Step Workflow Walk-Through

To make the interplay concrete:

```
1. User has session A with 200 messages, runs /branch to create session B
   B's JSONL contains 200 entries, each with forkedFrom: { sessionId: A.id, messageUuid: A.msg_i }
   
2. User in session B adds 50 more messages (no fork pointers, they're native to B)
   B's JSONL now contains 250 entries; the new 50 have no forkedFrom

3. Context fills, autocompact fires
   compactConversation runs on B's 250-message context
   On-disk B JSONL gets appended with:
     - boundaryMarker (no forkedFrom)
     - summaryMessage (no forkedFrom)
     - postCompact attachments + hook results
   B's in-memory context becomes [boundaryMarker, summaryMessage, attachments...] (~5 entries)

4. User runs /fork from session B's current state
   F's JSONL header is written with one entry per *currently-active* B message:
     - The boundaryMarker (with forkedFrom: { sessionId: B.id, messageUuid: boundary.uuid })
     - The summaryMessage (with forkedFrom: { sessionId: B.id, messageUuid: summary.uuid })
     - The attachments + hooks
   F can be opened separately; on read, hydration would pull F's own entries (no further indirection needed because the entries are full content)

5. User in session F continues for 100 turns
   F gains 100 new native entries; F is now a 105-entry session

6. F hits compact threshold; F's compact runs
   F's boundary references F's own UUIDs
   The original B messages (and the original A messages they came from) remain on disk in their original sessions
```

At no point does compaction need to re-resolve the `forkedFrom` chain backwards. The chain is structural metadata — the compactor works on the *currently in-memory* context, which has already been hydrated.

---

## 7. The `/fork` Hydration Edge Case

What if a fork is opened *after* the parent session is corrupted or deleted? `CT4` / `hydrateForkPointer` reads `parentSession.transcript` — if the parent doesn't exist, the load fails with a clear error: `Session ${parentSessionId} has no messages to fork`.

This is the disk-pointer trade-off: smaller files, but a hard dependency on the parent surviving. If a user deletes their `~/.claude/projects/...` history, all forks of those sessions become unloadable.

`/branch`, by contrast, has no such dependency — its JSONL is self-contained. The v2.1.118 transition to `/fork`'s pointer model was a deliberate trade-off favoring disk space over standalone durability. Both commands remain available; the user picks based on their archive needs.

---

## 8. Summary

| Operation | What flows through compaction | Fork/branch interaction |
|-----------|--------------------------------|--------------------------|
| `/branch` | Full message content materialized on disk | Compaction works normally; `forkedFrom` is inert metadata |
| `/fork` | Pointer JSONL hydrated on read into full message list | Compaction works normally on hydrated view; `forkedFrom` stays inert |
| Subagent `--resume` | `resumePersistedCount` tells write pump where the disk boundary is | Compaction adds new entries past the boundary; old entries stay on disk as audit trail |
| `forkedFrom` on compact-output | Compact summary/boundary get no `forkedFrom` | They're new content for the child session |
| Multi-step fork → compact → fork | Each compact creates a checkpoint; each fork captures the current view | All work consistently because each operates on hydrated in-memory state |

**Key insight:** Compaction is **fork-aware** but not **fork-rewriting**. It operates on the hydrated in-memory context, doesn't follow `forkedFrom` pointers backward, and doesn't propagate `forkedFrom` annotations to its own output. The same code path serves original sessions, branched sessions, and forked sessions because each one's hydration step makes their on-disk representations equivalent at the point of compaction. The v2.1.132 `resumePersistedCount` field is the only fork-related state the compaction pipeline needs to be explicitly aware of — and it's threaded through as opaque metadata that the write pump (not the compactor) consults.
