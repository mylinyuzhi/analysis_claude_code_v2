/**
 * utils/messages.ts — MEMORY SUBSET (readable-source restoration, v2.1.183)
 * ============================================================================
 *
 * ⚠️ This is the **memory-relevant subset only** of the much larger
 * `src/utils/messages.ts` (the full v2.1.88 ancestor is ~5,500 lines of
 * message factories, normalizers, lookups, and reorder logic). The auto-memory
 * / dream subsystem touches exactly three things in this module, and only those
 * are reconstructed here:
 *
 *   1. `createMemorySavedMessage` — the `subtype:"memory_saved"` system-message
 *      factory that drives the "Saved/Improved N memories" status line. Both the
 *      per-turn extraction path ("Saved") and the auto-dream path ("Improved")
 *      reuse this single factory; the `verb` and `teamCount` fields are patched
 *      onto the returned message at the call site (not factory params).
 *   2. `MEMORY_UPDATE_SOURCE_LABELS` — the source→human-label map used to
 *      phrase the ambient `memory_update` reminder ("Background memory
 *      consolidation updated your memory directory: …").
 *   3. The `pendingMemoryUpdates` ambient queue — its app-state init shape, the
 *      auto-dream inline push (documented), and the per-turn drain that turns
 *      queued updates into `memory_update` attachments. (The queue itself lives
 *      in app-state;
 *      this file restores the contract + the messages-layer producers/consumer.)
 *
 * v2.1.183 regions covered (cli_inner_pretty.js):
 *   - createMemorySavedMessage = YGn @589751 (subtype:"memory_saved" @589754)
 *   - MEMORY_UPDATE_SOURCE_LABELS = YSf @590643 ({ dream: "Background memory consolidation" })
 *   - memory_update reminder builder (consumer of YSf) @589564-589580
 *   - AMBIENT_CONTEXT_REMINDER = _7n @590353 (trailing "do not narrate" line)
 *   - pendingMemoryUpdates app-state init @294619 / @694668 ([] )
 *   - push (auto-dream completion) @455505-455517 (source:"dream")
 *   - drain getMemoryUpdateAttachments = Ctl @465836, registered as the
 *     "memory_update" attachment producer @464681 (real name revealed by the
 *     bundle export map: `getMemoryUpdateAttachments: () => Ctl` @464573)
 *
 * v2.1.88 ancestor (shape + real names): src/utils/messages.ts
 *   - createMemorySavedMessage @4460 (writtenPaths-only; verb patched at call site
 *     in src/services/autoDream/autoDream.ts:245-247)
 *   NOTE: in the v2.1.88 ancestor `MEMORY_UPDATE_SOURCE_LABELS` and the
 *   `pendingMemoryUpdates` queue (memory_update attachment) do NOT exist — they
 *   are post-88 additions. They are reconstructed here purely from the v2.1.183
 *   bundle and marked `// DELTA (added after v2.1.88)`.
 *
 * scaffold: 31_auto_memory/status_line_and_misc_delta.md §1.1 (factory + verb),
 *   §4 (verb/teamCount carryover); v2.1.156 extract_memories_runtime.md
 *   (createMemorySavedMessage "Saved"), auto_dream_runtime.md (verb:"Improved").
 *
 * cross-val (re-read in the 183 bundle): `YGn` body is byte-identical to the 88
 *   ancestor (single `writtenPaths` param, subtype:"memory_saved", no verb/teamCount
 *   params); `verb:"Improved"` is spread onto the result at the dream call site
 *   (@455508) exactly as the 88 ancestor spreads it (autoDream.ts:245-247);
 *   `YSf` has a single `dream` entry; the only push site is auto-dream completion
 *   (extraction does NOT enqueue a memory_update); drain `Ctl` clears the queue
 *   and computes `inContextPaths`.
 *
 * Divergence from 88 ancestor disclosed: the source-label map + the
 * `pendingMemoryUpdates` queue/attachment are NOT in the 88 ancestor; everything
 * else is faithful carryover.
 */

import { randomUUID } from 'crypto'
import {
  getAutoMemEntrypoint,
  isAutoMemoryEnabled,
} from '../memdir/paths.js'
import { pluralize } from './string.js'
import type {
  Attachment,
  MemoryUpdate,
  MemoryUpdateSource,
} from './attachments.js'
import type {
  Message,
  SystemMemorySavedMessage,
} from '../types/message.js'
import type { ToolUseContext } from '../types/state.js'

// ---------------------------------------------------------------------------
// 0. Contract-level reference into the un-restored bulk of messages.ts
// ---------------------------------------------------------------------------
// `createUserMessage` lives in the (out-of-scope) remainder of this module — it
// is one of the generic message factories, not memory-specific. The auto-memory
// / dream callers (services/autoDream/autoDream.ts, services/extractMemories/
// extractMemories.ts) wrap the dream / extraction prompt in a user message
// before forking the subagent. Declared here (not reconstructed) so the
// reconstructed import graph resolves — the same contract-level convention used
// by services/teamMemorySync/index.ts for the transport (pushMemory/pullMemory).
// 2.1.183: createUserMessage = Rn @cli_inner_pretty.js:587504
// 2.1.88 ancestor: src/utils/messages.ts  (createUserMessage({ content }))
export declare function createUserMessage(params: {
  content: string
}): Message

// ---------------------------------------------------------------------------
// 1. memory_saved system-message factory
// ---------------------------------------------------------------------------

/**
 * Creates the `memory_saved` system message that the REPL renders as the
 * "Saved N memories" (or "Improved N memories") status line.
 *
 * `writtenPaths` is the full list of memory files that were written this
 * operation. The renderer (`MemoryUpdateNotification`) shows a one-line summary
 * always, and the clickable per-file list only in verbose / transcript mode
 * (the 2.1.181 verbose-only delta — see MemoryUpdateNotification.tsx).
 *
 * The `verb` and `teamCount` fields are NOT parameters: callers spread the
 * factory result and patch those fields onto the returned message object:
 *   - per-turn extraction →  verb defaults to "Saved" (renderer fallback)
 *   - auto-dream          →  `{ ...createMemorySavedMessage(files), verb: 'Improved' }`
 *   - team-sync           →  also sets `teamCount` so the summary can read
 *     "Saved 3 memories · 2 team memories" (see teamMemSaved.ts / teamMemSavedPart).
 *
 * 2.1.183: createMemorySavedMessage = YGn @cli_inner_pretty.js:589751
 *   (subtype:"memory_saved" @589754)
 * 2.1.88 ancestor: src/utils/messages.ts:4460 (identical body)
 */
export function createMemorySavedMessage(
  writtenPaths: string[],
): SystemMemorySavedMessage {
  return {
    type: 'system',
    subtype: 'memory_saved',
    writtenPaths,
    timestamp: new Date().toISOString(),
    uuid: randomUUID(),
    isMeta: false,
    // verb / teamCount are intentionally absent here; patched at the call site.
  }
}

// ---------------------------------------------------------------------------
// 2. memory_update ambient-reminder source labels
// ---------------------------------------------------------------------------

// DELTA (added after v2.1.88): the `MEMORY_UPDATE_SOURCE_LABELS` map and the
// entire `memory_update` ambient-reminder path do not exist in the v2.1.88
// ancestor. Reconstructed from the v2.1.183 bundle.

/**
 * Human-readable label for each source that can asynchronously rewrite the
 * memory directory while the agent is mid-turn. Used to phrase the ambient
 * `memory_update` reminder so the model is told *who* changed its memory:
 *
 *   "Background memory consolidation updated your memory directory: <summary>"
 *
 * Today only the auto-dream consolidator enqueues such updates, so the map has
 * a single `dream` entry. Keyed by `MemoryUpdateSource` so new producers can be
 * added without touching the formatter.
 *
 * 2.1.183: MEMORY_UPDATE_SOURCE_LABELS = YSf @cli_inner_pretty.js:590643
 */
export const MEMORY_UPDATE_SOURCE_LABELS: Record<MemoryUpdateSource, string> = {
  dream: 'Background memory consolidation',
}

/**
 * Trailing line appended to every ambient reminder. Tells the model the
 * preceding text is context it should not read aloud to the user.
 *
 * 2.1.183: AMBIENT_CONTEXT_REMINDER = _7n @cli_inner_pretty.js:590353
 */
export const AMBIENT_CONTEXT_REMINDER =
  'This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.'

// ---------------------------------------------------------------------------
// 3. pendingMemoryUpdates — ambient queue (init / push / drain)
// ---------------------------------------------------------------------------

// DELTA (added after v2.1.88): the `pendingMemoryUpdates` queue, its push
// helper, and the drain → `memory_update` attachment do not exist in the
// v2.1.88 ancestor. Reconstructed from the v2.1.183 bundle.
//
// Why a queue at all: auto-dream runs as a *forked background subagent* and may
// finish at an arbitrary point relative to the main agent loop. It cannot inject
// a reminder into the live conversation directly, so on completion it pushes a
// structured `MemoryUpdate` onto app-state. The next time the main loop builds
// its per-turn attachments, the drain flushes the queue into `memory_update`
// attachment(s) that tell the model its memory directory changed underneath it
// (and which in-context files are now stale).

/**
 * Initial value of the `pendingMemoryUpdates` slice of app-state. Mirrors the
 * two app-state init sites in the 183 bundle.
 *
 * 2.1.183: AppState.pendingMemoryUpdates init `[]` @cli_inner_pretty.js:294619
 *          (and the rewind/restart init @694668)
 */
export const INITIAL_PENDING_MEMORY_UPDATES: MemoryUpdate[] = []

// PUSH (producer). There is NO standalone enqueue symbol in the bundle — the
// only producer inlines the state update at the auto-dream completion path
// (@455505-455517). It does two things on success:
//   1. emits the `memory_saved` status line with verb swapped to "Improved":
//        appendSystemMessage?.({ ...createMemorySavedMessage(filesTouched),
//                                verb: 'Improved' })
//   2. pushes a `MemoryUpdate` onto `pendingMemoryUpdates`:
//        setAppState(s => ({ ...s, pendingMemoryUpdates: [
//          ...s.pendingMemoryUpdates,
//          { source: 'dream',
//            summary: `consolidated ${n} ${pluralize(n, 'memory file')}`,
//            paths: filesTouched } ] }))
// (Reconstructed faithfully at the call site in
//  services/autoDream/autoDream.ts; left inline here to avoid inventing a
//  symbol the bundle does not have.)

/**
 * Drain the `pendingMemoryUpdates` queue into `memory_update` attachments.
 *
 * Registered as the producer for the `"memory_update"` attachment kind
 * (@cli_inner_pretty.js:464681). On each per-turn attachment-gathering pass:
 *   1. read the queue; if empty, return no attachments (cheap fast-path);
 *   2. atomically clear the queue (only if non-empty, to avoid a pointless
 *      state write);
 *   3. for each queued update, compute `inContextPaths` — the subset of changed
 *      `paths` the agent currently has loaded, so the reminder can flag them as
 *      stale. A path is "in context" if it is:
 *        - the cowork MEMORY.md index (when auto-memory is on and the cowork
 *          index content env is non-empty), OR
 *        - already in `readFileState` (the model read it this session), OR
 *        - a loaded nested-memory path.
 *
 * The resulting `memory_update` attachment is rendered into an ambient,
 * `isMeta` user message by the attachment renderer (see attachments.ts) using
 * `MEMORY_UPDATE_SOURCE_LABELS` + `AMBIENT_CONTEXT_REMINDER`.
 *
 * 2.1.183: getMemoryUpdateAttachments = Ctl @cli_inner_pretty.js:465836
 *   (real name from the bundle export map @464573: `getMemoryUpdateAttachments: () => Ctl`;
 *    registered as the "memory_update" attachment producer @464681)
 */
export function getMemoryUpdateAttachments(
  context: ToolUseContext,
): Attachment[] {
  const queued = context.getAppState().pendingMemoryUpdates
  if (queued.length === 0) {
    return []
  }

  // Atomically flush. Guard on a still-empty queue to skip a redundant write
  // if another pass already cleared it. @465839
  context.setAppState(prev =>
    prev.pendingMemoryUpdates.length === 0
      ? prev
      : { ...prev, pendingMemoryUpdates: [] },
  )

  // The cowork MEMORY.md index counts as "in context" only when auto-memory is
  // enabled AND the cowork index content env var is non-empty. @465840
  const coworkIndexPath =
    isAutoMemoryEnabled() &&
    process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT !== ''
      ? getAutoMemEntrypoint() // bBe @147715 — the cowork MEMORY.md entrypoint
      : null

  const isInContext = (path: string): boolean =>
    path === coworkIndexPath ||
    context.readFileState.has(path) ||
    context.loadedNestedMemoryPaths?.[path] === true

  return queued.map(update => ({
    type: 'memory_update',
    source: update.source,
    summary: update.summary,
    paths: update.paths,
    inContextPaths: update.paths.filter(isInContext),
  }))
}

// ---------------------------------------------------------------------------
// (full module continues with the non-memory message factories / normalizers /
//  lookups that are out of scope for this restoration — see src/utils/messages.ts)
// ---------------------------------------------------------------------------
