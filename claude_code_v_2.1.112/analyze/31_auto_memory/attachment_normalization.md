# Attachment Normalization — How Memories Reach the Model (v2.1.112)

## Module Overview

This document covers the *final mile* of the auto-memory subsystem: how a `RelevantMemory` produced by [findRelevantMemories](./find_relevant_memories.md) becomes a series of `user`-role messages with `<system-reminder>` wrappers in the API request. The pipeline crosses three modules — file reading, header building, and attachment normalization — and is anchored on a single design constraint: **the rendered bytes must be stable across turns to maintain prompt-cache hits.**

**v2.1.88 source paths:**
- `/lyz/codespace/3rd/claude-code/src/utils/attachments.ts` (chunks-style file): `readMemoriesForSurfacing` (line 2279), `memoryHeader` (line 2327), `getRelevantMemoryAttachments` (line ~2200), `MemoryPrefetch` / `startRelevantMemoryPrefetch` (line 2346-2424)
- `/lyz/codespace/3rd/claude-code/src/utils/messages.ts:3700-3722` — `nested_memory` and `relevant_memories` cases of the attachment normalizer

**v2.1.112 chunks:**
- `chunks.155.mjs:2076-2112` — `getRelevantMemoryAttachments` (`RMY`)
- `chunks.155.mjs:2126-2150` — `readMemoriesForSurfacing` (`CMY`)
- `chunks.155.mjs:2152-2157` — `memoryHeader` (`B97`)
- `chunks.155.mjs:2159-2206` — `startRelevantMemoryPrefetch` (`ikK`)
- `chunks.165.mjs:2549-2561` — `relevant_memories` normalization case
- `chunks.166.mjs:812-817` — `nested_memory` normalization case

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_04.md](../00_overview/symbol_additions_unit_04.md) — symbols added by this unit
> - [symbol_index.md](../00_overview/symbol_index.md) — v2.1.88 → v2.1.112 scoped diff index

Key functions in this document:
- `memoryHeader` (`B97`) — Conditional staleness + path prefix (chunks.155.mjs:2152-2157)
- `readMemoriesForSurfacing` (`CMY`) — Read selected files with line + byte truncation (chunks.155.mjs:2126-2150)
- `relevant_memories` normalization — Converts attachment to user messages wrapped in `<system-reminder>` (chunks.165.mjs:2549-2561)
- `nested_memory` normalization — Renders `@import` style memory file content (chunks.166.mjs:812-817)
- `startRelevantMemoryPrefetch` (`ikK`) — Kicks off the non-blocking memdir side-call at turn start (chunks.155.mjs:2159-2206)
- `collectSurfacedMemories` (`SMY`) — Scans message history for already-surfaced paths + total bytes (chunks.155.mjs:2114-2124)
- `wrapMessagesInSystemReminder` (`X_`) — Adds open/close `<system-reminder>` user messages (used by both cases)
- `createUserMessage` (`t8`) — Constructs a `UserMessage` with `isMeta: true`
- `RELEVANT_MEMORIES_CONFIG.MAX_SESSION_BYTES` (`_MY.MAX_SESSION_BYTES = 61440`) — 60 KB total memory bytes per session
- `MEMORY_READ_MAX_LINES` (`x97 = 200`) — Per-memory line cap
- `MEMORY_READ_MAX_BYTES` (`xNK = 4096`) — Per-memory byte cap
- `EXCLUDED_PREFETCH_QUERY_SOURCES` (`bMY`) — Query-source set that disables the prefetch

---

## Pipeline Overview

```
                              user types a turn
                                      │
                                      ▼
              ┌──────────────────────────────────────────────────┐
              │  ikK  startRelevantMemoryPrefetch                │
              │  - feature gate (tengu_moth_copse, memorySelector)│
              │  - skip excluded query sources (bMY)              │
              │  - skip if session bytes ≥ MAX_SESSION_BYTES      │
              │  - fork RMY into a MemoryPrefetch handle          │
              │  - non-blocking; returns immediately              │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (concurrently)
              ┌──────────────────────────────────────────────────┐
              │  RMY  getRelevantMemoryAttachments                │
              │  ├─ expand agent-mentions → dirs                  │
              │  ├─ dispatch wH() flag                            │
              │  │  ├─ selector: uC4 per dir, dedupe, slice 5     │
              │  │  └─ synthesis: mC4 per dir → synthesis prose   │
              │  └─ CMY readMemoriesForSurfacing                   │
              │      ├─ read each file (200 lines, 4096 bytes)    │
              │      ├─ truncate body, append truncation note     │
              │      └─ compute B97 memoryHeader, store inline    │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (when main model finishes streaming)
              ┌──────────────────────────────────────────────────┐
              │  query.ts collect point                           │
              │  - consume MemoryPrefetch.promise if settled     │
              │  - filterDuplicateMemoryAttachments               │
              │    (vs readFileState in-context cache)            │
              └──────────────────────────────────────────────────┘
                                      │
                                      ▼  (on the next API call)
              ┌──────────────────────────────────────────────────┐
              │  attachment normalizer (chunks.165.mjs)           │
              │  case "relevant_memories":                         │
              │  - X_(...) wraps in <system-reminder>            │
              │  - per memory: render m.header ?? B97(...)        │
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

`memoryHeader` (`B97`) produces the **header string** that sits between the `<system-reminder>` opening tag and the memory body. It either emits a bare `"Memory: ${path}:"` (no staleness caveat needed) or it prepends the staleness paragraph from `memoryFreshnessText` (see [memory_age.md](./memory_age.md)).

### How it works

```javascript
// ============================================
// memoryHeader - Conditional staleness + path prefix
// Location: chunks.155.mjs:2152-2157
// ============================================

// ORIGINAL (for source lookup):
function B97(q, K) {
    let _ = $Q1(K);
    return _ ? `${_}

Memory: ${q}:` : `Memory: ${q}:`
}

// READABLE (for understanding):
function memoryHeader(filePath, mtimeMs) {
    const staleness = memoryFreshnessText(mtimeMs);             // empty for ≤ 1-day-old files
    return staleness
        ? `${staleness}\n\nMemory: ${filePath}:`                 // stale → caveat + blank + path
        : `Memory: ${filePath}:`;                                // fresh → bare path
}

// Mapping:
// B97 → memoryHeader
// $Q1 → memoryFreshnessText
// q   → filePath
// K   → mtimeMs
// _   → staleness
```

### Why this approach

**Why pre-compute the header once.** The header is stored in the `relevant_memories` attachment as `m.header` (see `CMY` below), not recomputed each turn. The reason is stated in v2.1.88's `attachments.ts:506-512` (the comment on the `header?:` field):
> "Pre-computed header string (age + path prefix). Computed once at attachment-creation time so the rendered bytes are stable across turns — recomputing memoryAge(mtimeMs) at render time calls Date.now(), so 'saved 3 days ago' becomes 'saved 4 days ago' across turns → different bytes → prompt cache bust."

That comment refers to v2.1.88's `memoryAge()`-rendered `"saved 3 days ago"` strings; v2.1.112 has removed that prose entirely (see [memory_age.md](./memory_age.md) for the rationale). But the *cache-stability principle* still applies: even in v2.1.112, the staleness paragraph is day-bucketed, so a memory rendered "3 days old" on day 0 of the session would render "4 days old" on day 1 — same drift, same cache bust. Pre-computation freezes the value at attachment-creation time so the bytes stay identical for the lifetime of the attachment.

**Why include the path inside the staleness header.** The model needs both *which memory is stale* and *what the stale caveat says*. Putting them in the same `<system-reminder>` block ties them together inseparably — the model can't see the caveat without seeing which file it applies to.

**Why a `\n\n` separator (not single `\n`).** Markdown convention: paragraph break before a new logical section. The caveat is one paragraph; "Memory: path:" is a section label introducing the body that follows. Without the blank line, prompt-conditioning treats the caveat and the path as one continuous run-on sentence.

### Key insight

The header is **the cache-stability anchor** for memory attachments. Everything else (the body, the truncation note) is content; the header is structure. Storing it pre-computed in the attachment is the single most important detail in this whole module — it transforms what would be a per-turn cache miss into a stable byte sequence the cache can read.

---

## `readMemoriesForSurfacing` — File Reading with Caps

### What it does

`readMemoriesForSurfacing` (`CMY`) takes the up-to-5 selected `RelevantMemory` paths and reads each file's content with **both** a line cap (`x97 = 200`) and a byte cap (`xNK = 4096`). When either cap fires, the body is truncated and a Markdown-blockquote note is appended pointing at FileReadTool for the rest. The function also computes the `memoryHeader` at this point — the only place in the code where a memory's `header` field is initialized.

### How it works

```javascript
// ============================================
// readMemoriesForSurfacing - Read selected files, enforce 200L/4096B caps, store header
// Location: chunks.155.mjs:2126-2150
// ============================================

// ORIGINAL (for source lookup):
async function CMY(q, K) {
    return (await Promise.all(q.map(async ({ path: z, mtimeMs: Y }) => {
        try {
            let A = await m56(z, 0, x97, xNK, K, { truncateOnByteLimit: !0 }),
                O = A.totalLines > x97 || A.truncatedByBytes,
                w = O ? A.content + `

> This memory file was truncated (${A.truncatedByBytes?`${xNK} byte limit`:`first ${x97} lines`}). Use the ${xq} tool to view the complete file at: ${z}` : A.content;
            return {
                path: z,
                content: w,
                mtimeMs: Y,
                header: B97(z, Y),
                limit: O ? A.lineCount : void 0
            }
        } catch {
            return null
        }
    }))).filter((z) => z !== null)
}

// READABLE (for understanding):
async function readMemoriesForSurfacing(selected, signal) {
    return (await Promise.all(selected.map(async ({ path: filePath, mtimeMs }) => {
        try {
            const result = await readFileInRange(
                filePath,
                0,                                              // offset
                MEMORY_READ_MAX_LINES,                          // x97 = 200
                MEMORY_READ_MAX_BYTES,                          // xNK = 4096
                signal,
                { truncateOnByteLimit: true },                  // partial body, not whole-file drop
            );

            const truncated = result.totalLines > MEMORY_READ_MAX_LINES || result.truncatedByBytes;
            const contentWithNote = truncated
                ? `${result.content}\n\n> This memory file was truncated (` +
                  `${result.truncatedByBytes
                      ? `${MEMORY_READ_MAX_BYTES} byte limit`
                      : `first ${MEMORY_READ_MAX_LINES} lines`}` +
                  `). Use the ${FILE_READ_TOOL_NAME} tool to view the complete file at: ${filePath}`
                : result.content;

            return {
                path: filePath,
                content: contentWithNote,
                mtimeMs,
                header: memoryHeader(filePath, mtimeMs),         // computed ONCE, stored
                limit: truncated ? result.lineCount : undefined,
            };
        } catch {
            return null;                                          // skip unreadable files silently
        }
    }))).filter(memory => memory !== null);
}

// Mapping:
// CMY → readMemoriesForSurfacing
// q   → selected (RelevantMemory[])
// K   → signal
// z   → filePath
// Y   → mtimeMs
// A   → result (from readFileInRange)
// O   → truncated
// w   → contentWithNote
// m56 → readFileInRange
// x97 → MEMORY_READ_MAX_LINES (200)
// xNK → MEMORY_READ_MAX_BYTES (4096)
// xq  → FILE_READ_TOOL_NAME constant
// B97 → memoryHeader
```

### Why this approach

**Why two caps (lines AND bytes).** Lines protect against unwieldy index-style memories with hundreds of short rows; bytes protect against memories where individual lines are long (e.g., a memory containing a single line with a 5KB JSON blob). The v2.1.88 source comment on `readMemoriesForSurfacing` calls out the byte cap explicitly as a "long-line" defense.

**Why `truncateOnByteLimit: true` (not drop-on-overflow).** A memory that just barely exceeds the byte cap (4097 bytes) still contains a useful first 4 KB. Dropping it would force the model to either (1) request the file via FileReadTool, paying an extra round-trip, or (2) make a guess without it. The truncation surfaces the partial content with a clear note pointing to FileReadTool — the model can read what was selected as relevant, *plus* know that more exists. This trades a small risk of mid-thought truncation for a guaranteed signal.

**Why the truncation note's specific wording.**
- "This memory file was truncated (`X byte limit` | `first N lines`)" — names the *exact* cap that fired, so the model can decide whether to fetch the rest. A pure "truncated" note wouldn't tell the model whether the body is dense (byte-capped) or long (line-capped), each of which suggests different follow-up behaviour.
- "Use the FileReadTool tool to view the complete file at: ${path}" — names the tool and the exact path. This is *prompt scaffolding* — the model is being shown how to retrieve the rest *without* an example or system-prompt instruction.

**Why `header` is initialized here, not at attachment-rendering time.** As covered in the `memoryHeader` section above: the cache-stability constraint requires the header bytes to be fixed at attachment-creation time. `CMY` is the attachment-creation boundary — once this function returns, the `relevant_memories` payload is sealed and the header bytes are part of the stable representation.

**Why `try/catch` returns `null` (not throws).** A file may have been deleted between the scan and the read (race condition with another process), or permissions may have changed. Either way, the surviving memories should still be surfaced. The trailing `.filter(memory => memory !== null)` drops the failures silently — this matches the rest of the memdir module's "best-effort with graceful degradation" pattern.

### Key insight

This function is where **disk content becomes attachment content**. After this point, no further file reads happen for the surfaced memories — the model sees the captured bytes as canonical. That captured-once-then-stable contract is what makes the rest of the pipeline cache-friendly.

---

## `relevant_memories` Normalization

### What it does

The attachment normalizer (chunks.165.mjs:2549-2561) is invoked when the agent loop builds the API request. For each attachment in the input array, it produces an array of `UserMessage` objects to splice into the conversation. The `relevant_memories` case turns one attachment into one wrapped block of N user messages (one per memory), where the whole block is sandwiched between `<system-reminder>` boundary messages.

### How it works

```javascript
// ============================================
// relevant_memories normalization - Render attachment as <system-reminder> user messages
// Location: chunks.165.mjs:2549-2561
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return X_(q.memories.map((z, Y) => {
        let A = z.header ?? B97(z.path, z.mtimeMs),
            O = z.path.startsWith("<synthesis:");
        return t8({
            content: `${Y===0&&!O?`Retrieved for possible relevance — use only if it actually applies to what the user asked.

`:""}${A}

${z.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapMessagesInSystemReminder(
        attachment.memories.map((memory, index) => {
            // Prefer the header stored at attachment-creation time (cache-stable).
            // Fall back to recomputing only for resumed sessions that predate
            // the stored-header field.
            const header = memory.header ?? memoryHeader(memory.path, memory.mtimeMs);

            // Synthesis attachments have path: "<synthesis:${dir}>" and a custom
            // header already set; do not prepend the "retrieved" preamble.
            const isSynthesis = memory.path.startsWith("<synthesis:");

            // Only the first non-synthesis memory in the batch gets the preamble.
            const preamble = (index === 0 && !isSynthesis)
                ? "Retrieved for possible relevance — use only if it actually applies to what the user asked.\n\n"
                : "";

            return createUserMessage({
                content: `${preamble}${header}\n\n${memory.content}`,
                isMeta: true,
            });
        })
    );

// Mapping:
// q   → attachment ({type: "relevant_memories", memories: [...]})
// z   → memory (one entry)
// Y   → index
// A   → header
// O   → isSynthesis
// X_  → wrapMessagesInSystemReminder
// t8  → createUserMessage
// B97 → memoryHeader
```

### Why this approach

**Why `wrapMessagesInSystemReminder` for the entire block (one reminder per attachment, not per memory).** Each `<system-reminder>` open/close pair carries a non-trivial token cost. Wrapping the whole batch in one reminder pair instead of N pairs amortizes that cost; the model sees a single coherent "reminder block" containing 1-5 memory entries rather than 5 separate reminders.

**Why prepend "Retrieved for possible relevance — use only if it actually applies" on the first non-synthesis entry.** This is a *guard against false-positive retrieval acted upon as fact*. The model has historically been observed to treat retrieved memories as if the user explicitly cited them — leading to off-topic responses when the retrieval was loose. The preamble explicitly tells the model that the host *guessed* these memories were relevant, and to use them only if they *actually* apply. Phrasing pulled from v2.1.112's prompt engineering: "use only if it actually applies to what the user asked" forces a relevance check before reasoning.

**Why only on `index === 0`.** The preamble is a *block-level* hint; repeating it before each memory would add noise without changing meaning. Putting it at the top of the block makes the warning apply to the entire batch.

**Why skip the preamble for synthesis attachments (`!isSynthesis`).** Synthesis attachments carry their own caller-set header `"Recalled from your persistent memory system:"` (set in `RMY` chunks.155.mjs:2096), and the synthesis text is *model-curated* — it doesn't carry the same false-positive risk as a raw file. The preamble would be redundant and contradicting; skipping it keeps the synthesis presentation clean.

**Why `isMeta: true` on every memory message.** `isMeta` flags messages as system-injected rather than user-typed. This affects rendering in the TUI (meta messages can be hidden / collapsed) and affects message filters like `filterForBriefTool` and `shouldShowUserMessage`. The model still sees the content, but the user-facing transcript treats it as background context.

**Why fall back to recomputing the header (`memory.header ?? B97(...)`).** Resumed sessions that predate v2.1.112's `header?:` field will deserialize attachments without that field. Recomputing on the fly is correct (just suffers a cache miss); falling back transparently avoids breaking old session resumes.

### Key insight

The `relevant_memories` case is **the prompt-cache contract in render form**. Every byte emitted here matches a byte the cache will see on the next turn — same preamble (or same lack of it), same stored `header`, same body. The cache doesn't know about memories; it only sees the rendered bytes. Stability here is what makes the whole prefetch pattern profitable.

---

## `nested_memory` Normalization

### What it does

`nested_memory` is a *different* attachment type than `relevant_memories`. It is produced when the agent loop detects an explicit `@-reference` to a memory file in the user's input (e.g., the user pastes `@memory/auth.md` or includes a reference that resolves to a memory file). The renderer is much simpler — it doesn't do staleness reasoning, doesn't compute a header, doesn't include a "may not apply" preamble:

### How it works

```javascript
// ============================================
// nested_memory normalization - Render attachment as direct file content
// Location: chunks.166.mjs:812-817
// ============================================

// ORIGINAL (for source lookup):
nested_memory: (q) => X_([t8({
    content: `Contents of ${q.content.path}:

${q.content.content}`,
    isMeta: !0
})]),

// READABLE (for understanding):
nested_memory: (attachment) => wrapMessagesInSystemReminder([
    createUserMessage({
        content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
        isMeta: true,
    }),
]);

// Mapping:
// q                     → attachment
// q.content.path        → path of the referenced file
// q.content.content     → file body
// X_                    → wrapMessagesInSystemReminder
// t8                    → createUserMessage
```

### Why the difference from `relevant_memories`

**Why no staleness caveat.** The user explicitly asked for this file (by `@-mentioning` it). The user is the source of truth for whether they want the content; warning them about staleness would be paternalistic. Compare to `relevant_memories` where the host *guessed*, and the caveat ("use only if it actually applies") is the host hedging its guess.

**Why "Contents of …:" (not "Memory: …:").** The header signals provenance:
- `Contents of ${path}:` → the user asked for this file's contents; treat it as a paste-in
- `Memory: ${path}:` → the host retrieved this memory; treat it as background context

The model's behavioural response to those two framings is meaningfully different — content the user pasted gets quoted and analyzed; content the host retrieved gets used contextually if relevant.

**Why no truncation.** `nested_memory` attachments are pre-resolved by the agent loop (see chunks.155.mjs:1868 for the source where they're built). The file is read in full before the attachment is constructed, so the normalizer just renders whatever was supplied. There's no opportunity to truncate here because the trim decision was already made upstream.

### Key insight

The two attachment cases are the cleanest example in the memory subsystem of **provenance shaping presentation**. The same disk content (a memory file body) renders differently depending on whether the user requested it or the host retrieved it — and that difference is encoded directly in the prompt the model sees.

---

## Prefetch Lifecycle: `startRelevantMemoryPrefetch`

`startRelevantMemoryPrefetch` (`ikK`, chunks.155.mjs:2159-2206) kicks off `RMY` as a non-blocking promise at the *start* of each turn. The returned `MemoryPrefetch` handle is bound by the caller (query.ts) with `using` syntax so that on any exit path of the turn loop (`return`, `throw`, generator `.return()`), the `[Symbol.dispose]` hook aborts the in-flight side-call and emits telemetry.

```javascript
// ============================================
// startRelevantMemoryPrefetch - Non-blocking memdir side-call kick-off
// Location: chunks.155.mjs:2159-2206
// ============================================

// ORIGINAL (for source lookup):
function ikK(q, K, _) {
    let z = K.memorySelector;
    if (!z || K.agentId || !x3() || !u8("tengu_moth_copse", !1) || bMY.has(_)) return;
    let Y = q.findLast((J) => J.type === "user" && !J.isMeta);
    if (!Y) return;
    let A = it(Y);
    if (!A || !/\s/.test(A.trim())) return;
    let O = SMY(q);
    if (O.totalBytes >= _MY.MAX_SESSION_BYTES) return;
    let w = tv(K.abortController),
        $ = Date.now(),
        j = RMY(A, K.options.agentDefinitions.activeAgents, z, K.readFileState, w.signal, O.paths).catch((J) => {
            if (!uw8(J)) j6(J);
            return []
        }),
        H = {
            promise: j, settledAt: null, consumedOnIteration: -1,
            [Symbol.dispose]() {
                w.abort();
                let J = z.lastUsage;
                d("tengu_memdir_prefetch_collected", {
                    hidden_by_first_iteration: H.settledAt !== null && H.consumedOnIteration === 0,
                    consumed_on_iteration: H.consumedOnIteration,
                    latency_ms: (H.settledAt ?? Date.now()) - $,
                    cache_read_input_tokens: J?.cacheReadInputTokens,
                    cache_creation_input_tokens: J?.cacheCreationInputTokens,
                    selector_turn_count: J?.turnCount
                })
            }
        };
    void j.finally(() => { H.settledAt = Date.now() });
    return H
}
```

### Gates (in order)

1. `K.memorySelector` exists — the per-session selector state is required (initialized by `dK6()` at session start).
2. `K.agentId` is falsy — subagents don't run their own memory prefetch; the lead agent owns the side-call.
3. `x3()` — `isAutoMemoryEnabled`.
4. `u8("tengu_moth_copse", false)` — feature flag for memdir relevance.
5. `!bMY.has(querySource)` — query sources `extract_memories`, `auto_dream`, `prompt_suggestion`, `speculation`, `compact` skip the prefetch entirely (they're driven internally and don't represent a user question to surface memories for).
6. Last non-meta user message exists, contains whitespace (multi-word) — single-word prompts produce noise selections.
7. `collectSurfacedMemories(messages).totalBytes < MAX_SESSION_BYTES (61440 = 60KB)` — session-total budget check. Beyond 60 KB the model has enough memory context already; further surfacing is wasted attention.

### Telemetry

On `[Symbol.dispose]`, the handle emits `tengu_memdir_prefetch_collected` with:
- `hidden_by_first_iteration`: true if the prefetch settled but was consumed on iteration 0 (i.e., the main model finished too fast to use it).
- `consumed_on_iteration`: which agent-loop iteration ultimately read the prefetch (or `-1` if disposed without consumption).
- `latency_ms`: time from kick-off to settlement.
- `cache_read_input_tokens` / `cache_creation_input_tokens` / `selector_turn_count`: pulled from the selector state's `lastUsage` to measure the prompt-cache effectiveness.

### Key insight

The prefetch is **a race against the main model**. The host kicks off the memdir side-call concurrently with the main model's streaming response. If the main model finishes first (e.g., a simple "yes" answer), the memdir result is discarded — the `hidden_by_first_iteration` flag captures that case in telemetry. The whole design assumes the main model takes long enough (typically tool calls + reasoning) that the side-call finishes first, in which case the memories arrive "for free" with no added latency. Telemetry lets the team measure how often that assumption holds.

---

## Session-Total Budget Enforcement

`collectSurfacedMemories` (`SMY`, chunks.155.mjs:2114-2124) walks the message history and counts the cumulative byte size of every `relevant_memories` attachment ever surfaced in the session. The result feeds two decisions:

1. **Prefetch gate** (above): skip the side-call entirely once `totalBytes >= MAX_SESSION_BYTES`.
2. **Already-surfaced dedup** in `findRelevantMemories`: the `paths` set is passed as `alreadySurfaced` so Sonnet doesn't waste its 5-slot budget on memories that were shown earlier in the session.

```javascript
// ============================================
// collectSurfacedMemories - Scan messages for cumulative memory bytes + paths
// Location: chunks.155.mjs:2114-2124
// ============================================

// READABLE (for understanding):
function collectSurfacedMemories(messages) {
    const paths = new Set();
    let totalBytes = 0;
    for (const msg of messages) {
        if (msg.type === "attachment" && msg.attachment.type === "relevant_memories") {
            for (const memory of msg.attachment.memories) {
                paths.add(memory.path);
                totalBytes += memory.content.length;
            }
        }
    }
    return { paths, totalBytes };
}
```

### Why scan history (not maintain a running counter)

**Why compaction-resilient.** When `compact` runs, the conversation history is summarized and old attachments are removed from the transcript. A running counter would carry forward bytes for attachments that no longer exist in context, leading to false "session full" decisions. Scanning the (post-compact) messages means the byte budget naturally resets to what's actually in context — the same memories can be re-surfaced if a compact removed them and they're still relevant.

**Why a `Set` of paths instead of a list.** The same memory might appear in two prior turns (e.g., resumed sessions, branching). The `paths.add(memory.path)` deduplicates implicitly; downstream code (`alreadySurfaced.has(path)`) does set-membership in O(1).

### Key insight

The budget mechanism is **history-derived**, not state-tracked. This is what makes compaction interactions clean: the prefetch's understanding of "how much memory is in this session" is always recomputed from the current message array. No state to invalidate.

---

## Cross-Version Notes (v2.1.88 → v2.1.112)

| Concern | v2.1.88 | v2.1.112 | Change |
|---|---|---|---|
| `memoryHeader` text | `Memory (saved 3 days ago): path:` (fresh) or staleness + `Memory: path:` (stale) | `Memory: path:` (fresh) or staleness + `Memory: path:` (stale) | Relative-time prose **removed** for cache stability |
| `memoryAge()` function | exists, returns `"today"`/`"yesterday"`/`"N days ago"` | **removed** | — |
| `readMemoriesForSurfacing` caps | `MAX_MEMORY_LINES` line cap + `MAX_MEMORY_BYTES` byte cap | `x97 = 200` line cap + `xNK = 4096` byte cap | unchanged in spirit; numbers exposed as constants |
| Per-attachment preamble | none — model saw memories without relevance-hedging language | `"Retrieved for possible relevance — use only if it actually applies to what the user asked."` (first non-synthesis entry only) | new — guards against false-positive retrieval being treated as fact |
| Synthesis attachments | n/a | `path: "<synthesis:${dir}>"`, fixed `"Recalled from your persistent memory system:"` header | new — supports the synthesis side-call mode |
| Prefetch gates | `isAutoMemoryEnabled() + tengu_moth_copse + session bytes + non-empty multi-word prompt` | adds `memorySelector exists`, `!agentId`, `!bMY.has(querySource)` | new — distinguishes lead-agent vs subagent, internal vs user-driven query sources |
| Telemetry | `tengu_memdir_prefetch_collected` with latency + iteration consumed | adds `cache_read_input_tokens`, `cache_creation_input_tokens`, `selector_turn_count` from `lastUsage` | new — measures prompt-cache effectiveness of the per-dir state machine |
| `MAX_SESSION_BYTES` | `RELEVANT_MEMORIES_CONFIG.MAX_SESSION_BYTES` (60 * 1024) | `_MY.MAX_SESSION_BYTES = 61440` (same value) | unchanged literal |
| Truncation note tool name | `FILE_READ_TOOL_NAME` (TS constant) | `xq` (obfuscated constant for `FILE_READ_TOOL_NAME`) | unchanged content |

The two architecturally significant changes are:
1. **Prompt-cache motivated header simplification.** Removing the relative-time prose stabilizes the bytes of every fresh memory header across turns. This was probably the single biggest cache-hit improvement of v2.1.112 for sessions with memory.
2. **Hedge preamble.** The `"Retrieved for possible relevance — use only if it actually applies"` insertion is a behavioural fix for a class of false-positive retrievals; it costs ~25 tokens per attachment block and gains correctness at the edges.

All other changes (caps, gates, telemetry) refine existing mechanisms without changing their shape.
