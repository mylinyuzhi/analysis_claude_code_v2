# Attachment Normalization — How Memories Reach the Model (v2.1.142)

## Module Overview

This document covers the *final mile* of the auto-memory subsystem: how a `RelevantMemory` produced by [findRelevantMemories](./find_relevant_memories.md) becomes a series of `user`-role messages with `<system-reminder>` wrappers in the API request. The pipeline crosses three modules — file reading, header building, and attachment normalization — and is anchored on a single design constraint: **the rendered bytes must be stable across turns to maintain prompt-cache hits.**

**v2.1.88 source paths:**
- `/lyz/codespace/3rd/claude-code/src/utils/attachments.ts`
- `/lyz/codespace/3rd/claude-code/src/utils/messages.ts` (cases)

**v2.1.142 locations** in `cli_inner_pretty.js`:
- `398150-398234` — `getRelevantMemoryAttachments` (analog of `RMY`) — function `Oq5`
- `398235-398242` — `memoryHeader` — function `_h6`
- `398243-398281` — `startRelevantMemoryPrefetch` (analog of `ikK`) — function `oo7`
- `425073-425091` — `relevant_memories` normalization case
- `426132-426140` — `nested_memory` normalization case
- `398282-398295` — Filter for already-surfaced memories — function `ao7`
- `244932-...` — `B97` (legacy obfuscated symbol used by SDK SSE — see note below)
- `398197-398234` — `readMemoriesForSurfacing` (analog of `CMY`)

**v2.1.112 → v2.1.142 changes:**
1. Module-level rename only — same data flow, same cache-stability principle, same wrapping.
2. `memoryHeader` is now `_h6` (was `B97`); body bit-identical.
3. The "Retrieved for possible relevance" preamble is identical.
4. The synthesis-attachment branching (`path.startsWith('<synthesis:')`) is identical.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — symbols added by this unit

Key functions in this document:
- `memoryHeader` (`_h6`) — Conditional staleness + path prefix (cli_inner_pretty.js:398235-398242)
- `readMemoriesForSurfacing` (filename TBC) — Read selected files with line + byte truncation
- `relevant_memories` normalization — Converts attachment to user messages wrapped in `<system-reminder>` (cli_inner_pretty.js:425073-425091)
- `nested_memory` normalization — Renders `@import` style memory file content (cli_inner_pretty.js:426132-426140)
- `startRelevantMemoryPrefetch` (`oo7`) — Kicks off the non-blocking memdir side-call at turn start (cli_inner_pretty.js:398243-398281)
- `ao7` — De-dups already-read memories from `readFileState`
- `wrapMessagesInSystemReminder` (`o_`) — Adds open/close `<system-reminder>` user messages
- `createUserMessage` (`w8`) — Constructs a `UserMessage` with `isMeta: true`
- `MAX_SESSION_BYTES` (`m65.MAX_SESSION_BYTES = 61440`) — 60 KB total memory bytes per session

---

## Pipeline Overview

```
                              user types a turn
                                      │
                                      ▼
              ┌──────────────────────────────────────────────────┐
              │  oo7  startRelevantMemoryPrefetch                 │
              │  - feature gate (tengu_moth_copse, memorySelector)│
              │  - skip excluded query sources (Dq5)              │
              │  - skip if session bytes ≥ MAX_SESSION_BYTES      │
              │  - fork Oq5 into a MemoryPrefetch handle          │
              │  - non-blocking; returns immediately              │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (concurrently)
              ┌──────────────────────────────────────────────────┐
              │  Oq5  getRelevantMemoryAttachments                │
              │  ├─ expand agent-mentions → dirs                  │
              │  ├─ dispatch gM() flag                            │
              │  │  ├─ selector: FK7 per dir, dedupe, slice 5     │
              │  │  └─ synthesis: gK7 per dir → synthesis prose   │
              │  └─ readMemoriesForSurfacing (CMY analog)         │
              │      ├─ read each file (200 lines, 4096 bytes)    │
              │      ├─ truncate body, append truncation note     │
              │      └─ compute _h6 memoryHeader, store inline    │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (when main model finishes streaming)
              ┌──────────────────────────────────────────────────┐
              │  query loop collect point                         │
              │  - consume MemoryPrefetch.promise if settled     │
              │  - ao7 filterDuplicateMemoryAttachments           │
              │    (vs readFileState in-context cache)            │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (on the next API call)
              ┌──────────────────────────────────────────────────┐
              │  attachment normalizer                            │
              │  case "relevant_memories":                         │
              │  - o_(...) wraps in <system-reminder>            │
              │  - per memory: render m.header ?? _h6(...)        │
              │  - prepend "Retrieved for possible relevance"     │
              │    on the first non-synthesis entry              │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼
                               sent to Claude
```

---

## `memoryHeader` — Conditional Prefix

### What it does

`memoryHeader` (`_h6`) produces the **header string** that sits between the `<system-reminder>` opening tag and the memory body. It either emits a bare `"Memory: ${path}:"` (no staleness caveat needed) or it prepends the staleness paragraph from `memoryFreshnessText` (see [memory_age.md](./memory_age.md)).

### How it works

```javascript
// ============================================
// memoryHeader - Conditional staleness + path prefix
// Location: cli_inner_pretty.js:398235-398242
// ============================================

// ORIGINAL (for source lookup):
function _h6(H, $) {
  let q = A36($);
  return q
    ? `${q}

Memory: ${H}:`
    : `Memory: ${H}:`;
}

// READABLE (for understanding):
function memoryHeader(filePath, mtimeMs) {
  const staleness = memoryFreshnessText(mtimeMs)            // empty for ≤ 1-day-old files
  return staleness
    ? `${staleness}\n\nMemory: ${filePath}:`                 // stale → caveat + blank + path
    : `Memory: ${filePath}:`                                 // fresh → bare path
}

// Mapping: _h6→memoryHeader, A36→memoryFreshnessText, H→filePath, $→mtimeMs, q→staleness
```

### Why this approach

**Why pre-compute the header once.** The header is stored in the `relevant_memories` attachment as `m.header`, not recomputed each turn. The reason is **prompt cache stability** — the staleness paragraph is day-bucketed, so a memory rendered "3 days old" on day 0 of the session would render "4 days old" on day 1 — different bytes, prompt cache bust. Pre-computation freezes the value at attachment-creation time so the bytes stay identical for the lifetime of the attachment.

**Why include the path inside the staleness header.** The model needs both *which memory is stale* and *what the stale caveat says*. Putting them in the same `<system-reminder>` block ties them together inseparably — the model can't see the caveat without seeing which file it applies to.

**Why a `\n\n` separator (not single `\n`).** Markdown convention: paragraph break before a new logical section. The caveat is one paragraph; "Memory: path:" is a section label introducing the body that follows.

### Key insight

The header is **the cache-stability anchor** for memory attachments. Everything else (the body, the truncation note) is content; the header is structure. Storing it pre-computed in the attachment is the single most important detail in this whole module — it transforms what would be a per-turn cache miss into a stable byte sequence the cache can read. Unchanged in spirit from v2.1.112.

### About the second `B97` symbol in v2.1.142

There is a separate `B97` function at `cli_inner_pretty.js:244932-...` in v2.1.142 that is **not** the memory header. That symbol is now used in the SDK/SSE telemetry layer (the "Emitted when the memory recall supervisor surfaces relevant memories" telemetry — see `cli_inner_pretty.js:238957`). The original `B97`-as-memoryHeader role from v2.1.112 was renamed to `_h6` in v2.1.142. This obfuscator reuse is normal — symbol names cycle.

---

## `readMemoriesForSurfacing` — File Reading with Caps

### What it does

Takes the up-to-5 selected `RelevantMemory` paths and reads each file's content with **both** a line cap (200) and a byte cap (4096). When either cap fires, the body is truncated and a Markdown-blockquote note is appended pointing at FileReadTool for the rest. The function also computes the `memoryHeader` at this point — the only place where a memory's `header` field is initialized.

### How it works

The v2.1.142 implementation is at `cli_inner_pretty.js:398196-398234` (visible around `function ao7` and the surrounding helpers). The structure is bit-identical to v2.1.112's `CMY`:

1. For each selected `{path, mtimeMs}`, call `readFileInRange(path, 0, 200, 4096, signal, { truncateOnByteLimit: true })`.
2. Determine if the file was truncated (`totalLines > 200 || truncatedByBytes`).
3. If truncated, append `\n\n> This memory file was truncated (${cap-description}). Use the ${FILE_READ_TOOL_NAME} tool to view the complete file at: ${path}`.
4. Compute `header = memoryHeader(path, mtimeMs)` and store inline.
5. Return `{ path, content, mtimeMs, header, limit: truncated ? lineCount : undefined }`.
6. Failed reads return `null` and are filtered out.

### Why this approach

**Why two caps (lines AND bytes).** Lines protect against unwieldy index-style memories with hundreds of short rows; bytes protect against memories where individual lines are long (e.g., a memory containing a single line with a 5KB JSON blob).

**Why `truncateOnByteLimit: true` (not drop-on-overflow).** A memory that just barely exceeds the byte cap still contains a useful first 4 KB. Dropping it would force the model to either request the file via FileReadTool (extra round-trip) or guess without it. The truncation surfaces the partial content with a clear note pointing to FileReadTool.

**Why the truncation note's specific wording.**
- "This memory file was truncated (`X byte limit` | `first N lines`)" — names the *exact* cap that fired.
- "Use the FileReadTool tool to view the complete file at: ${path}" — names the tool and the exact path.

**Why `header` is initialized here.** The cache-stability constraint requires the header bytes to be fixed at attachment-creation time. This is the attachment-creation boundary — once this function returns, the `relevant_memories` payload is sealed.

**Why `try/catch` returns `null` (not throws).** A file may have been deleted between the scan and the read (race condition), or permissions may have changed. The surviving memories should still be surfaced.

### Key insight

This function is where **disk content becomes attachment content**. After this point, no further file reads happen for the surfaced memories — the model sees the captured bytes as canonical. That captured-once-then-stable contract is what makes the rest of the pipeline cache-friendly. Unchanged from v2.1.112 in shape and behavior.

---

## `relevant_memories` Normalization

### What it does

The attachment normalizer is invoked when the agent loop builds the API request. For each attachment in the input array, it produces an array of `UserMessage` objects to splice into the conversation. The `relevant_memories` case turns one attachment into one wrapped block of N user messages (one per memory), where the whole block is sandwiched between `<system-reminder>` boundary messages.

### How it works

```javascript
// ============================================
// relevant_memories normalization - Render attachment as <system-reminder> user messages
// Location: cli_inner_pretty.js:425073-425091
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
  return o_(
    H.memories.map((K, _) => {
      let A = K.header ?? _h6(K.path, K.mtimeMs),
        z = K.path.startsWith("<synthesis:");
      return w8({
        content: `${
          _ === 0 && !z
            ? `Retrieved for possible relevance — use only if it actually applies to what the user asked.

`
            : ""
        }${A}

${K.content}`,
        isMeta: !0,
      });
    }),
  );

// READABLE (for understanding):
case 'relevant_memories':
  return wrapMessagesInSystemReminder(
    attachment.memories.map((memory, index) => {
      // Prefer the header stored at attachment-creation time (cache-stable).
      const header = memory.header ?? memoryHeader(memory.path, memory.mtimeMs)
      // Synthesis attachments have path: "<synthesis:${dir}>" and a custom
      // header already set; do not prepend the "retrieved" preamble.
      const isSynthesis = memory.path.startsWith('<synthesis:')
      // Only the first non-synthesis memory in the batch gets the preamble.
      const preamble = (index === 0 && !isSynthesis)
        ? 'Retrieved for possible relevance — use only if it actually applies to what the user asked.\n\n'
        : ''
      return createUserMessage({
        content: `${preamble}${header}\n\n${memory.content}`,
        isMeta: true,
      })
    }),
  )

// Mapping:
// H   → attachment ({type: "relevant_memories", memories: [...]})
// K   → memory (one entry)
// _   → index
// A   → header
// z   → isSynthesis
// o_  → wrapMessagesInSystemReminder
// w8  → createUserMessage
// _h6 → memoryHeader
```

### Why this approach

**Why `wrapMessagesInSystemReminder` for the entire block.** Each `<system-reminder>` open/close pair carries a non-trivial token cost. Wrapping the whole batch in one reminder pair instead of N pairs amortizes that cost.

**Why prepend "Retrieved for possible relevance — use only if it actually applies" on the first non-synthesis entry.** This is a *guard against false-positive retrieval acted upon as fact*. The model has historically been observed to treat retrieved memories as if the user explicitly cited them. The preamble explicitly tells the model that the host *guessed* these memories were relevant, and to use them only if they *actually* apply.

**Why only on `index === 0`.** The preamble is a *block-level* hint; repeating it before each memory would add noise without changing meaning.

**Why skip the preamble for synthesis attachments.** Synthesis attachments carry their own caller-set header (`"Recalled from your persistent memory system:"`), and the synthesis text is *model-curated* — it doesn't carry the same false-positive risk as a raw file.

**Why `isMeta: true` on every memory message.** `isMeta` flags messages as system-injected rather than user-typed. This affects rendering in the TUI (meta messages can be hidden / collapsed) and affects message filters. The model still sees the content, but the user-facing transcript treats it as background context.

**Why fall back to recomputing the header (`memory.header ?? _h6(...)`).** Resumed sessions that predate the `header?:` field will deserialize attachments without that field. Recomputing on the fly is correct (just suffers a cache miss); falling back transparently avoids breaking old session resumes.

### Key insight

The `relevant_memories` case is **the prompt-cache contract in render form**. Every byte emitted here matches a byte the cache will see on the next turn — same preamble (or same lack of it), same stored `header`, same body. The cache doesn't know about memories; it only sees the rendered bytes. Stability here is what makes the whole prefetch pattern profitable. Bit-equivalent to v2.1.112.

---

## `nested_memory` Normalization

### What it does

`nested_memory` is a *different* attachment type than `relevant_memories`. It is produced when the agent loop detects an explicit `@-reference` to a memory file in the user's input. The renderer is much simpler — it doesn't do staleness reasoning, doesn't compute a header, doesn't include a "may not apply" preamble.

### How it works

```javascript
// ============================================
// nested_memory normalization - Render attachment as direct file content
// Location: cli_inner_pretty.js:426132-426140
// ============================================

// ORIGINAL (for source lookup):
nested_memory: (H) =>
  o_([
    w8({
      content: `Contents of ${H.content.path}:

${H.content.content}`,
      isMeta: !0,
    }),
  ]),

// READABLE (for understanding):
nested_memory: (attachment) => wrapMessagesInSystemReminder([
  createUserMessage({
    content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
    isMeta: true,
  }),
]);

// Mapping: H→attachment, o_→wrapMessagesInSystemReminder, w8→createUserMessage
```

### Why the difference from `relevant_memories`

**Why no staleness caveat.** The user explicitly asked for this file (by `@-mentioning` it). The user is the source of truth for whether they want the content; warning them about staleness would be paternalistic.

**Why "Contents of …:" (not "Memory: …:").** The header signals provenance:
- `Contents of ${path}:` → the user asked for this file's contents
- `Memory: ${path}:` → the host retrieved this memory

The model's behavioral response to those two framings is meaningfully different.

**Why no truncation.** `nested_memory` attachments are pre-resolved by the agent loop. The file is read in full before the attachment is constructed, so the normalizer just renders whatever was supplied.

### Key insight

The two attachment cases are the cleanest example in the memory subsystem of **provenance shaping presentation**. The same disk content (a memory file body) renders differently depending on whether the user requested it or the host retrieved it — and that difference is encoded directly in the prompt the model sees. Unchanged from v2.1.112.

---

## Prefetch Lifecycle: `startRelevantMemoryPrefetch`

`startRelevantMemoryPrefetch` (`oo7`, cli_inner_pretty.js:398243-398281) kicks off the get-relevant-memories side-call as a non-blocking promise at the *start* of each turn. The returned `MemoryPrefetch` handle is bound by the caller with `using` syntax so that on any exit path of the turn loop, the `[Symbol.dispose]` hook aborts the in-flight side-call and emits telemetry.

```javascript
// ============================================
// startRelevantMemoryPrefetch - Non-blocking memdir side-call kick-off
// Location: cli_inner_pretty.js:398243-398281
// ============================================

// ORIGINAL (for source lookup):
function oo7(H, $, q) {
  let K = $.memorySelector;
  if (!K || $.agentId || !x9() || !Z$("tengu_moth_copse", !1) || Dq5.has(q)) return;
  let _ = H.findLast((w) => w.type === "user" && !w.isMeta);
  if (!_) return;
  let A = Wb(_);
  if (!A || !/\s/.test(A.trim())) return;
  let z = Mq5(H);
  if (z.totalBytes >= m65.MAX_SESSION_BYTES) return;
  let Y = nE($.abortController),
    f = Date.now(),
    O = Oq5(A, $.options.agentDefinitions.activeAgents, K, $.readFileState, Y.signal, z.paths).catch((w) => {
      if (!md(w)) EH(w);
      return [];
    }),
    M = {
      promise: O,
      settledAt: null,
      consumedOnIteration: -1,
      [Symbol.dispose]() {
        Y.abort();
        let w = K.lastUsage;
        d("tengu_memdir_prefetch_collected", {
          hidden_by_first_iteration: M.settledAt !== null && M.consumedOnIteration === 0,
          consumed_on_iteration: M.consumedOnIteration,
          latency_ms: (M.settledAt ?? Date.now()) - f,
          cache_read_input_tokens: w?.cacheReadInputTokens,
          cache_creation_input_tokens: w?.cacheCreationInputTokens,
          selector_turn_count: w?.turnCount,
        });
      },
    };
  return (O.finally(() => { M.settledAt = Date.now() }), M);
}

// READABLE (for understanding):
function startRelevantMemoryPrefetch(messages, env, querySource) {
  const selectorState = env.memorySelector
  if (!selectorState || env.agentId || !isAutoMemoryEnabled() ||
      !getFeatureValue_CACHED_MAY_BE_STALE('tengu_moth_copse', false) ||
      EXCLUDED_PREFETCH_QUERY_SOURCES.has(querySource)) {
    return undefined
  }

  const lastUser = messages.findLast(m => m.type === 'user' && !m.isMeta)
  if (!lastUser) return undefined
  const text = extractText(lastUser)
  if (!text || !/\s/.test(text.trim())) return undefined

  const surfaced = collectSurfacedMemories(messages)
  if (surfaced.totalBytes >= RELEVANT_MEMORIES_CONFIG.MAX_SESSION_BYTES) return undefined

  const abort = createAbortLink(env.abortController)
  const startedAt = Date.now()
  const promise = getRelevantMemoryAttachments(
    text, env.options.agentDefinitions.activeAgents,
    selectorState, env.readFileState, abort.signal, surfaced.paths,
  ).catch(e => {
    if (!isAbortError(e)) reportError(e)
    return []
  })

  const handle = {
    promise,
    settledAt: null,
    consumedOnIteration: -1,
    [Symbol.dispose]() {
      abort.abort()
      const usage = selectorState.lastUsage
      logEvent('tengu_memdir_prefetch_collected', {
        hidden_by_first_iteration: handle.settledAt !== null && handle.consumedOnIteration === 0,
        consumed_on_iteration: handle.consumedOnIteration,
        latency_ms: (handle.settledAt ?? Date.now()) - startedAt,
        cache_read_input_tokens: usage?.cacheReadInputTokens,
        cache_creation_input_tokens: usage?.cacheCreationInputTokens,
        selector_turn_count: usage?.turnCount,
      })
    },
  }
  void promise.finally(() => { handle.settledAt = Date.now() })
  return handle
}

// Mapping:
// oo7 → startRelevantMemoryPrefetch
// H   → messages
// $   → env
// q   → querySource
// K   → selectorState
// _   → lastUser
// A   → text
// z   → surfaced
// Y   → abort link
// f   → startedAt
// O   → promise
// M   → handle
// w   → varies (error in catch, usage at dispose)
// x9  → isAutoMemoryEnabled
// Z$  → getFeatureValue_CACHED_MAY_BE_STALE
// Dq5 → EXCLUDED_PREFETCH_QUERY_SOURCES
// Wb  → extractText
// Mq5 → collectSurfacedMemories
// m65 → RELEVANT_MEMORIES_CONFIG
// nE  → createAbortLink
// Oq5 → getRelevantMemoryAttachments
// md  → isAbortError
// EH  → reportError
// d   → logEvent
```

### Gates (in order)

1. `env.memorySelector` exists — the per-session selector state is required.
2. `env.agentId` is falsy — subagents don't run their own memory prefetch.
3. `isAutoMemoryEnabled()` — auto-memory is on.
4. `getFeatureValue('tengu_moth_copse', false)` — feature flag for memdir relevance.
5. `!EXCLUDED_PREFETCH_QUERY_SOURCES.has(querySource)` — query sources like `extract_memories`, `auto_dream`, `prompt_suggestion`, `speculation`, `compact` skip the prefetch.
6. Last non-meta user message exists, contains whitespace (multi-word).
7. `collectSurfacedMemories(messages).totalBytes < MAX_SESSION_BYTES (61440 = 60KB)` — session-total budget check.

### Telemetry

On `[Symbol.dispose]`, the handle emits `tengu_memdir_prefetch_collected` with:
- `hidden_by_first_iteration`: true if the prefetch settled but was consumed on iteration 0.
- `consumed_on_iteration`: which agent-loop iteration ultimately read the prefetch.
- `latency_ms`: time from kick-off to settlement.
- `cache_read_input_tokens` / `cache_creation_input_tokens` / `selector_turn_count`: pulled from the selector state's `lastUsage`.

### Key insight

The prefetch is **a race against the main model**. The host kicks off the memdir side-call concurrently with the main model's streaming response. If the main model finishes first, the memdir result is discarded. The whole design assumes the main model takes long enough that the side-call finishes first, in which case the memories arrive "for free" with no added latency. Telemetry lets the team measure how often that assumption holds.

---

## Session-Total Budget Enforcement (`collectSurfacedMemories` analog)

The analog of v2.1.112's `SMY` walks the message history and counts the cumulative byte size of every `relevant_memories` attachment ever surfaced in the session. The result feeds two decisions:

1. **Prefetch gate** (above): skip the side-call entirely once `totalBytes >= MAX_SESSION_BYTES`.
2. **Already-surfaced dedup** in `findRelevantMemories`: the `paths` set is passed as `alreadySurfaced` so Sonnet doesn't waste its 5-slot budget on memories that were shown earlier.

### Why scan history (not maintain a running counter)

**Why compaction-resilient.** When `compact` runs, the conversation history is summarized and old attachments are removed from the transcript. A running counter would carry forward bytes for attachments that no longer exist in context. Scanning the (post-compact) messages means the byte budget naturally resets to what's actually in context.

**Why a `Set` of paths instead of a list.** The same memory might appear in two prior turns. The `paths.add(memory.path)` deduplicates implicitly; downstream code does set-membership in O(1).

### Key insight

The budget mechanism is **history-derived**, not state-tracked. This is what makes compaction interactions clean: the prefetch's understanding of "how much memory is in this session" is always recomputed from the current message array. No state to invalidate.

---

## `ao7` — Already-Surfaced Filter

This v2.1.142 function (cli_inner_pretty.js:398282-398295) filters memory attachments against `readFileState` so the model isn't shown the same content twice in one session.

```javascript
// ============================================
// ao7 - Filter relevant-memories attachments against already-shown paths
// Location: cli_inner_pretty.js:398282-398295
// ============================================

// ORIGINAL (for source lookup):
function ao7(H, $) {
  return H.map((q) => {
    if (q.type !== "relevant_memories") return q;
    let K = q.memories.filter((_) => !$.has(_.path));
    for (let _ of K) $.set(_.path, { content: _.content, timestamp: _.mtimeMs, offset: void 0, limit: _.limit });
    return K.length > 0 ? { ...q, memories: K } : null;
  }).filter((q) => q !== null);
}

// READABLE (for understanding):
function filterDuplicateMemoryAttachments(attachments, readFileState) {
  return attachments.map(att => {
    if (att.type !== 'relevant_memories') return att
    // Drop any memory whose path was already shown (and is in readFileState).
    const fresh = att.memories.filter(m => !readFileState.has(m.path))
    // Side-effect: register the newly-surfaced memories in readFileState
    // so subsequent attachments in the same turn don't repeat them.
    for (const m of fresh) {
      readFileState.set(m.path, {
        content: m.content,
        timestamp: m.mtimeMs,
        offset: undefined,
        limit: m.limit,
      })
    }
    return fresh.length > 0 ? { ...att, memories: fresh } : null
  }).filter(att => att !== null)
}

// Mapping: ao7→filterDuplicateMemoryAttachments, H→attachments, $→readFileState,
//          q→att, K→fresh, _→m
```

### Why this matters

The selector's `alreadySurfaced` filter (see [find_relevant_memories.md](./find_relevant_memories.md)) eliminates repeats **before the Sonnet call**. This function eliminates repeats **before the API request**. Together they form two layers of defense against showing the same memory twice — necessary because:

1. Multi-directory attacks: if a memory exists under both auto-mem and an agent mem-dir, both calls might surface it. The first call writes to `readFileState`; the second call's `ao7` drops the duplicate.
2. Race conditions: the prefetch starts before any prior memory is fully consumed; the post-fetch filter catches anything that became "already shown" during the prefetch.

### Key insight

Memory attachments are **idempotent against `readFileState`**: each surfacing writes to `readFileState`, and each surfacing pre-filters against it. The two-step pattern ensures the model never sees the same memory body twice — even when the same memory is selected by two independent recall paths in the same turn.

---

## Cross-Version Notes (v2.1.88 → v2.1.142)

| Concern | v2.1.88 | v2.1.112 | v2.1.142 | Change vs v2.1.112 |
|---|---|---|---|---|
| `memoryHeader` text | `Memory (saved 3 days ago): path:` (fresh) or staleness + `Memory:` (stale) | `Memory: path:` (fresh) or staleness + `Memory:` (stale) | identical to v2.1.112 | none |
| `memoryAge()` function | exists | removed | removed | none |
| `readMemoriesForSurfacing` caps | line + byte cap | 200 lines + 4096 bytes | 200 + 4096 | none |
| Per-attachment preamble | none | `"Retrieved for possible relevance — use only if it actually applies to what the user asked."` (first non-synthesis entry) | identical | none |
| Synthesis attachments | n/a | `path: "<synthesis:${dir}>"`, fixed `"Recalled from your persistent memory system:"` header | identical | none |
| Prefetch gates | basic | + memorySelector + !agentId + bMY excluded | + memorySelector + !agentId + Dq5 excluded | identical |
| Telemetry payload | latency + iteration | + cache token counts | identical | none |
| `MAX_SESSION_BYTES` | 60 * 1024 | 61440 | 61440 | none |
| Truncation note tool name | `FILE_READ_TOOL_NAME` | obfuscated symbol | obfuscated symbol | none |
| `nested_memory` renderer | `Contents of <path>:` | identical | identical | none |
| `relevant_memories` renderer | wrap + per-memory header | wrap + preamble + per-memory header | identical | none |

The `relevant_memories` and `nested_memory` rendering pipeline is **bit-equivalent** between v2.1.112 and v2.1.142. The only differences are symbol-name renames (`B97` → `_h6`, `CMY` → unnamed, `RMY` → `Oq5`, `ikK` → `oo7`, `SMY` → `Mq5`, `bMY` → `Dq5`, `_MY` → `m65`). The cache-stability architecture, the preamble framing, and the session-budget enforcement are unchanged.
