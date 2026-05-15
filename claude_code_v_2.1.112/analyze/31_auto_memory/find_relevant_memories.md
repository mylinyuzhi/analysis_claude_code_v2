# Find Relevant Memories — `findRelevantMemories.ts` (v2.1.112)

## Module Overview

`findRelevantMemories.ts` is the **recall layer** of the auto-memory subsystem. Given a user query and a memory directory, it returns up to five memory files most likely to help the model answer that query, using a *small Sonnet side-call* as the relevance ranker. The module sits between the on-disk `memoryScan` primitive (see [memory_scan.md](./memory_scan.md)) and the prompt-injection layer (see [attachment_normalization.md](./attachment_normalization.md)).

**v2.1.88 source** : `/lyz/codespace/3rd/claude-code/src/memdir/findRelevantMemories.ts` (141 lines).
**v2.1.112 chunks** : `chunks.99.mjs:618-685` (selector path), `chunks.99.mjs:687-766` (synthesis path), `chunks.86.mjs:2624-2678` (per-dir state cache), `chunks.99.mjs:768-797` (system prompts).

v2.1.112 grew the module from "one function, one Sonnet call" into a **two-mode dispatcher** with prompt-cache state per directory:

1. **Selector mode** — `uC4` returns up to 5 filenames Sonnet considered relevant. Same shape as v2.1.88 plus de-dup against `alreadySurfaced`.
2. **Synthesis mode** — `mC4` (gated on `tengu_billiard_aviary`) sends *full memory bodies* to Sonnet and gets back atomic facts. The output is a single attachment containing model-extracted prose, not raw files. Mode chosen by the caller `RMY` in chunks.155.mjs:2076-2112.

Both modes share a **per-directory `stateByDir` map** (`AQ1` / `OQ1` / `wQ1` in chunks.86.mjs) that caches the manifest as a cache-controlled system-message prefix. Subsequent queries against the same directory append to the message chain and reuse the cached prefix, so the second-and-later side queries pay only for the new query text.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_04.md](../00_overview/symbol_additions_unit_04.md) — symbols added by this unit
> - [symbol_index.md](../00_overview/symbol_index.md) — v2.1.88 → v2.1.112 scoped diff index

Key functions in this document:
- `findRelevantMemories` selector mode (`uC4`) — Entry point, returns `RelevantMemory[]` (chunks.99.mjs:618-629)
- `selectRelevantMemoriesSideQuery` (`nMz`) — Issues the Sonnet side query (chunks.99.mjs:631-685)
- `findRelevantMemories` synthesis mode (`mC4`) — Synthesizer entry, returns `{synthesis, citedMemories}` or null (chunks.99.mjs:687-695)
- `synthesizeMemorySideQuery` (`iMz`) — Synthesizer side query (chunks.99.mjs:697-766)
- `getRelevantMemoryAttachments` (`RMY`) — Caller in chunks.155.mjs:2076 that picks the mode and joins per-directory results
- `createMemorySelectorState` (`dK6`) — Per-session selector cache (chunks.86.mjs:2624-2629)
- `getSelectorStateForDir` (`AQ1`) — Lookup in `stateByDir` (chunks.86.mjs:2636-2638)
- `initSelectorStateForDir` (`OQ1`) — Build manifest + `byFilename` map + cache-controlled system message (chunks.86.mjs:2640-2657)
- `appendSelectorQAToState` (`wQ1`) — Append (user query, assistant selection) to message chain (chunks.86.mjs:2659-2678)
- `SELECT_MEMORIES_SYSTEM_PROMPT` (`cMz`) — Selector instructions (chunks.99.mjs:768-775)
- `SYNTHESIZE_MEMORIES_SYSTEM_PROMPT` (`lMz`) — Synthesizer instructions (chunks.99.mjs:777-797)
- `MEMDIR_QUERY_SOURCE` (`YQ1`) — Telemetry tag `"memdir_relevance"` (chunks.86.mjs:2680)

---

## Selector Mode (Default)

### What it does

`findRelevantMemories` (selector form `uC4`) takes a user query, scans a memory directory for `.md` files (excluding `MEMORY.md`), asks Sonnet to pick which filenames are *clearly* useful, and returns absolute paths + mtimes for up to 5 picks. The model is told to return an empty list when uncertain, so a "no relevant memories" outcome is the common case.

### How it works

```javascript
// ============================================
// findRelevantMemories (selector) - Returns up to 5 RelevantMemory paths
// Location: chunks.99.mjs:618-629
// ============================================

// ORIGINAL (for source lookup):
async function uC4(q, K, _, z, Y = new Set) {
    _.lastUsage = null;
    let A = { type: "ephemeral" },
        O = AQ1(_, K) ?? await t88(K, z).then((j) =>
            j.length > 0 && !z.aborted ? OQ1(_, K, j, e88(j), A) : void 0
        );
    if (!O || O.memories.every((j) => Y.has(j.filePath))) return [];
    return (await nMz(q, K, _, O.messages, O.byFilename, A, z))
        .map((j) => O.byFilename.get(j))
        .filter((j) => j !== void 0 && !Y.has(j.filePath))
        .map((j) => ({ path: j.filePath, mtimeMs: j.mtimeMs }));
}

// READABLE (for understanding):
async function findRelevantMemoriesSelector(
    query,                          // user prompt text
    memoryDir,                      // absolute path to a memory directory
    selectorState,                  // MemorySelectorState (per session, mutable)
    signal,                         // turn-level AbortSignal
    alreadySurfaced = new Set(),    // paths already shown in prior turns
) {
    selectorState.lastUsage = null;
    const cacheControl = { type: "ephemeral" };

    // 1. Reuse cached state for this directory, or build it from a fresh scan.
    const dirState =
        getSelectorStateForDir(selectorState, memoryDir) ??
        await scanMemoryFiles(memoryDir, signal).then(headers => {
            if (headers.length === 0 || signal.aborted) return undefined;
            return initSelectorStateForDir(
                selectorState,
                memoryDir,
                headers,
                formatMemoryManifest(headers),
                cacheControl,
            );
        });

    // 2. Bail when the directory is empty OR every memory has already been surfaced.
    if (!dirState || dirState.memories.every(m => alreadySurfaced.has(m.filePath))) {
        return [];
    }

    // 3. Side-query Sonnet for filenames; map back to MemoryHeaders; filter already-surfaced.
    const selectedFilenames = await selectRelevantMemoriesSideQuery(
        query, memoryDir, selectorState,
        dirState.messages, dirState.byFilename,
        cacheControl, signal,
    );
    return selectedFilenames
        .map(filename => dirState.byFilename.get(filename))
        .filter(m => m !== undefined && !alreadySurfaced.has(m.filePath))
        .map(m => ({ path: m.filePath, mtimeMs: m.mtimeMs }));
}

// Mapping:
// uC4 → findRelevantMemoriesSelector
// q   → query
// K   → memoryDir
// _   → selectorState (MemorySelectorState — has stateByDir + lastUsage)
// z   → signal
// Y   → alreadySurfaced (ReadonlySet<string> of filePaths)
// A   → cacheControl (`{ type: "ephemeral" }`)
// O   → dirState (from cache or freshly built)
// j   → loop variable / MemoryHeader / filename
// AQ1 → getSelectorStateForDir
// t88 → scanMemoryFiles
// OQ1 → initSelectorStateForDir
// e88 → formatMemoryManifest
// nMz → selectRelevantMemoriesSideQuery
```

### Why this approach

**Why a Sonnet side-call for ranking (not text-similarity).** v2.1.88's selector prompt explicitly warns against keyword overlap: the example given is a query containing "spawn" + a memory describing an `mcp__X__spawn` tool. A simple BM25 / cosine similarity ranker would surface that memory; the model would recognize that the tool is *already being used* and skip it. The selector also gets the recently-used-tools list (in v2.1.88; v2.1.112 has consolidated that into the conversation context) and is told to *not* surface reference docs for tools that are working — a behaviour that can't be implemented without reasoning over context, hence the LLM.

**Why bail on `alreadySurfaced` covers everything (line 624).** The selector spends its 5-slot budget on memories it could possibly surface. If every memory in the directory has been shown in prior turns, the selector would either return nothing useful or return repeats — both wasteful side calls. The pre-filter `dirState.memories.every(m => alreadySurfaced.has(m.filePath))` lets us skip the API call entirely.

**Why filter `alreadySurfaced` again *after* the Sonnet call (line 627).** This is **belt-and-suspenders**. The Sonnet call already implicitly avoids re-picking via the prompt instruction "Do not re-select memories you already returned for an earlier query in this conversation" (chunks.99.mjs:774). But Sonnet's instruction-following on negative prompts is imperfect, and a stale cache or a multi-directory call could re-introduce a path. The host-side filter guarantees the contract regardless of model behaviour.

**Why `byFilename.get(...)` filter.** Sonnet returns *filenames* (because filenames are short and the model is unreliable at echoing long absolute paths). The host code re-maps those filenames to `MemoryHeader` objects via `byFilename`. If Sonnet hallucinates a filename, `byFilename.get` returns `undefined` and the filter drops it. This is the same defensive design pattern used in v2.1.88's `validFilenames.has(f)` filter on the parsed JSON — the host never trusts a model-returned identifier.

### Key insight

The selector is **stateless w.r.t. the model** but **stateful w.r.t. the session**. Every selector call sends the same big "Available memories" prefix (cached via `cache_control: ephemeral`), then a tiny per-turn query message. Sonnet sees the conversation as `[available-memories-prefix, q1, a1, q2, a2, ...]`, where the prefix is cache-hit and only the new query+answer pair burns fresh tokens. This makes the cost amortize down to almost zero on the second-and-later side calls within a single session.

---

## Side-Query Call

### What it does

`selectRelevantMemoriesSideQuery` (`nMz`) issues a constrained Sonnet call: a system prompt (cached), a manifest message (cached), the new query, and a JSON-schema-constrained output that must produce a list of filenames. It also appends the (query, response) pair to the session's per-directory message chain so the next turn can reference it through prompt caching.

### How it works

```javascript
// ============================================
// selectRelevantMemoriesSideQuery - Sonnet side-call returning filenames
// Location: chunks.99.mjs:631-685
// ============================================

// ORIGINAL (for source lookup):
async function nMz(q, K, _, z, Y, A, O) {
    let w = `Select memories relevant to:
${q}`;
    try {
        let $ = await dR({
                model: Af(),
                system: [{ type: "text", text: cMz, cache_control: A }],
                skipSystemPromptPrefix: !0,
                messages: [...z, {
                    role: "user",
                    content: [{ type: "text", text: w, cache_control: A }]
                }],
                max_tokens: 256,
                output_format: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: { selected_memories: { type: "array", items: { type: "string" } } },
                        required: ["selected_memories"],
                        additionalProperties: !1
                    }
                },
                signal: O,
                querySource: YQ1
            }),
            j = $.content.find((J) => J.type === "text");
        if (!j || j.type !== "text") return [];
        let H = n8(j.text);
        return wQ1(_, K, w, j.text), _.lastUsage = {
            cacheReadInputTokens: $.usage.cache_read_input_tokens ?? 0,
            cacheCreationInputTokens: $.usage.cache_creation_input_tokens ?? 0,
            turnCount: (z.length + 1) / 2
        }, H.selected_memories.filter((J) => Y.has(J))
    } catch ($) {
        if (_.lastUsage = null, O.aborted) return [];
        return E(`[memdir] selectRelevantMemories failed: ${b6($)}`, { level: "warn" }), []
    }
}

// READABLE (for understanding):
async function selectRelevantMemoriesSideQuery(
    query, memoryDir, selectorState,
    priorMessages, byFilename, cacheControl, signal,
) {
    const queryMessage = `Select memories relevant to:\n${query}`;
    try {
        const response = await sideQuery({
            model: getDefaultSonnetModel(),                            // Af
            system: [
                { type: "text", text: SELECT_MEMORIES_SYSTEM_PROMPT, cache_control: cacheControl },
            ],
            skipSystemPromptPrefix: true,                              // no shared prefix
            messages: [
                ...priorMessages,                                      // includes manifest as cached msg 0
                {
                    role: "user",
                    content: [{ type: "text", text: queryMessage, cache_control: cacheControl }],
                },
            ],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: { selected_memories: { type: "array", items: { type: "string" } } },
                    required: ["selected_memories"],
                    additionalProperties: false,
                },
            },
            signal,
            querySource: MEMDIR_QUERY_SOURCE,                          // "memdir_relevance"
        });

        const textBlock = response.content.find(b => b.type === "text");
        if (!textBlock || textBlock.type !== "text") return [];
        const parsed = jsonParse(textBlock.text);

        // Append this Q/A to the cached message chain BEFORE returning, so the next
        // turn's side-query reuses [system, manifest, q1, a1, q2] (4-of-5 cache hit).
        appendSelectorQAToState(selectorState, memoryDir, queryMessage, textBlock.text);
        selectorState.lastUsage = {
            cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
            cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0,
            turnCount: (priorMessages.length + 1) / 2,
        };
        return parsed.selected_memories.filter(name => byFilename.has(name));
    } catch (e) {
        if (signal.aborted) {
            selectorState.lastUsage = null;
            return [];
        }
        selectorState.lastUsage = null;
        logForDebugging(`[memdir] selectRelevantMemories failed: ${errorMessage(e)}`, { level: "warn" });
        return [];
    }
}

// Mapping:
// nMz                                   → selectRelevantMemoriesSideQuery
// q                                     → query
// K                                     → memoryDir
// _                                     → selectorState
// z                                     → priorMessages
// Y                                     → byFilename (Map<string, MemoryHeader>)
// A                                     → cacheControl
// O                                     → signal
// w                                     → queryMessage
// $                                     → response
// j                                     → textBlock
// H                                     → parsed
// dR                                    → sideQuery
// Af                                    → getDefaultSonnetModel
// cMz                                   → SELECT_MEMORIES_SYSTEM_PROMPT
// n8                                    → jsonParse
// wQ1                                   → appendSelectorQAToState
// E                                     → logForDebugging
// b6                                    → errorMessage
// YQ1                                   → MEMDIR_QUERY_SOURCE = "memdir_relevance"
```

### Why this approach

**Why `max_tokens: 256`.** The output is a JSON object containing at most a 5-element array of filenames. 256 tokens is generous; the typical response is < 50 tokens. Keeping `max_tokens` small bounds the worst-case latency.

**Why `skipSystemPromptPrefix: true`.** Side queries normally prepend the standard Claude Code system prompt prefix (tool list, environment, etc.) — irrelevant for a filename selector. Skipping it both shortens the call and makes the selector's behavior insensitive to how the parent session was configured.

**Why JSON schema (not free-text parsing).** The output is structurally constrained: the model *must* produce `{"selected_memories": ["a.md", "b.md"]}` and nothing else. This eliminates the entire class of "model emitted a preamble before the JSON" failures, and lets `jsonParse(textBlock.text)` succeed directly. Note that the v2.1.88 source confirms this is the same schema; v2.1.112 only changes which prompt text is paired with it.

**Why append to `stateByDir` *after* a successful call (line 674, `wQ1(_, K, w, j.text)`).** If the call fails or times out, the message chain is *not* updated — the next turn restarts from `[system, manifest]` rather than chaining onto a non-existent assistant turn. The error branch explicitly skips the append. This guarantees the cached chain is always coherent.

**Why two `if (O.aborted)` branches.** The abort branch is distinct from the general error branch because aborted calls *intentionally* short-circuit without logging (a user pressing Escape is not a bug to warn about). Setting `lastUsage = null` in both branches ensures the telemetry "the selector ran and consumed X cache tokens" is only true for genuinely-completed calls.

### Key insight

The selector is a **prompt-cached message-chain** Sonnet conversation. Treating it as a stateful conversation per directory makes each subsequent turn cheap: the cached manifest becomes `cache_read_input_tokens`, the cached prior Q/A pairs likewise, and only the new query is fresh creation. The session-level state (`MemorySelectorState`) is the *only* thing that makes this possible — without `stateByDir`, every turn would rebuild the manifest from scratch.

---

## Per-Directory Cache State Machine

### What it does

The `MemorySelectorState` lives for a session. It maps `memoryDir → DirState` where `DirState = { memories, byFilename, messages }`. `memories` is the raw scan output. `byFilename` is the path-validation lookup. `messages` is the **accumulated Sonnet conversation history** for that directory, including the cached manifest as message 0.

### How it works

```javascript
// ============================================
// createMemorySelectorState - Per-session selector store
// Location: chunks.86.mjs:2624-2629
// ============================================

// ORIGINAL (for source lookup):
function dK6() {
    return { stateByDir: new Map, lastUsage: null }
}

// READABLE (for understanding):
function createMemorySelectorState() {
    return {
        stateByDir: new Map(),                  // memoryDir → DirState
        lastUsage: null,                        // most recent cache_read / creation token counts
    };
}

// Mapping:
// dK6 → createMemorySelectorState
```

```javascript
// ============================================
// getSelectorStateForDir / initSelectorStateForDir - Build cached manifest message
// Location: chunks.86.mjs:2636-2657
// ============================================

// ORIGINAL (for source lookup):
function AQ1(q, K) { return q.stateByDir.get(K) }
function OQ1(q, K, _, z, Y) {
    let A = {
        memories: _,
        byFilename: new Map(_.map((O) => [O.filename, O])),
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: `Available memories:\n${z}`,
                ...Y && { cache_control: Y }
            }]
        }]
    };
    return q.stateByDir.set(K, A), A
}

// READABLE (for understanding):
function getSelectorStateForDir(selectorState, memoryDir) {
    return selectorState.stateByDir.get(memoryDir);
}

function initSelectorStateForDir(selectorState, memoryDir, headers, manifestText, cacheControl) {
    const dirState = {
        memories: headers,
        byFilename: new Map(headers.map(h => [h.filename, h])),
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Available memories:\n${manifestText}`,
                        ...(cacheControl ? { cache_control: cacheControl } : {}),
                    },
                ],
            },
        ],
    };
    selectorState.stateByDir.set(memoryDir, dirState);
    return dirState;
}

// Mapping:
// AQ1 → getSelectorStateForDir
// OQ1 → initSelectorStateForDir
// q   → selectorState
// K   → memoryDir
// _   → headers (MemoryHeader[])
// z   → manifestText
// Y   → cacheControl ({type: "ephemeral"})
// A   → dirState
// O   → header (loop var)
```

```javascript
// ============================================
// appendSelectorQAToState - Chain query+selection onto cached messages
// Location: chunks.86.mjs:2659-2678
// ============================================

// ORIGINAL (for source lookup):
function wQ1(q, K, _, z) {
    let Y = q.stateByDir.get(K);
    if (!Y) return;
    q.stateByDir.set(K, {
        ...Y,
        messages: [...Y.messages, {
            role: "user",
            content: [{ type: "text", text: _ }]
        }, {
            role: "assistant",
            content: [{ type: "text", text: z }]
        }]
    })
}

// READABLE (for understanding):
function appendSelectorQAToState(selectorState, memoryDir, queryText, assistantText) {
    const dirState = selectorState.stateByDir.get(memoryDir);
    if (!dirState) return;                            // no-op if cleared (e.g. on compact)
    selectorState.stateByDir.set(memoryDir, {
        ...dirState,
        messages: [
            ...dirState.messages,
            { role: "user", content: [{ type: "text", text: queryText }] },
            { role: "assistant", content: [{ type: "text", text: assistantText }] },
        ],
    });
}

// Mapping:
// wQ1 → appendSelectorQAToState
// q   → selectorState
// K   → memoryDir
// _   → queryText
// z   → assistantText
// Y   → dirState
```

### Why this approach

**Why a per-directory state map.** v2.1.112's `getRelevantMemoryAttachments` (`RMY`) can run against multiple directories — the auto-memory dir and one-or-more agent-mention dirs. Each directory has its own manifest, so each needs its own cache chain. A single shared chain would invalidate cache as soon as the manifest changed.

**Why store the manifest as a `user` role message (not `system`).** Sonnet's prompt cache supports both, but the *cache key* differs. The host code wants exactly two cached blocks: the static `cMz` system text (one cache breakpoint) and the dynamic manifest (a second breakpoint). Putting the manifest in the user message slot makes that two-breakpoint layout natural: `system[cache_control]`, `user[cache_control](manifest)`, `user(q1)`, `assistant(a1)`, ..., `user[cache_control](qN)`. The most recent user message carries `cache_control` so the *prior* turn's tail (manifest + Q1..QN-1 + AN-1) is the cache-hit prefix.

**Why no eviction policy.** Each `MemorySelectorState` is per-session and the session lifetime caps memory growth. The state is also disposed when compaction fires (the `[Symbol.dispose]` hook in `MemoryPrefetch`). For long-lived sessions the growth is `O(turns × directories)` — acceptable in practice given that most sessions stay below 50 memdir queries.

### Key insight

The state machine is the **prompt-cache contract** between the host and the API. Every field exists for a specific cache-related reason: `memories` and `byFilename` are pure host state, but `messages` is the *exact array* that gets sent to the API on every call. Append-only growth on that array is what gives the prompt cache its high hit-rate; clearing the array (via `sj6` / `clearSelectorState` on compact) is what lets the cache regenerate cleanly when the conversation has been compressed.

---

## Synthesis Mode (Flagged)

When `tengu_billiard_aviary` (`wH()`) is on, the caller `RMY` (chunks.155.mjs:2076-2112) takes the synthesis path: `mC4` invokes `iMz`, which sends *full memory bodies* to Sonnet and asks it to extract atomic facts.

```javascript
// ============================================
// findRelevantMemories (synthesis) - Returns {synthesis, citedMemories} or null
// Location: chunks.99.mjs:687-695
// ============================================

// ORIGINAL (for source lookup):
async function mC4(q, K, _, z) {
    _.lastUsage = null;
    let Y = { type: "ephemeral" },
        A = AQ1(_, K) ?? await t88(K, z).then((O) =>
            O.length > 0 && !z.aborted ? OQ1(_, K, O, e88(O), Y) : void 0
        );
    if (!A) return null;
    return iMz(q, K, _, A.messages, A.byFilename, Y, z)
}

// READABLE (for understanding):
async function synthesizeRelevantMemories(query, memoryDir, selectorState, signal) {
    selectorState.lastUsage = null;
    const cacheControl = { type: "ephemeral" };

    const dirState =
        getSelectorStateForDir(selectorState, memoryDir) ??
        await scanMemoryFiles(memoryDir, signal).then(headers => {
            if (headers.length === 0 || signal.aborted) return undefined;
            // Note: scanMemoryFiles in synthesis mode returns headers WITH .content
            // populated (see memory_scan.md), so the manifest includes full bodies.
            return initSelectorStateForDir(
                selectorState, memoryDir, headers,
                formatMemoryManifest(headers),  // body lines indented 2 spaces
                cacheControl,
            );
        });

    if (!dirState) return null;
    return synthesizeMemorySideQuery(
        query, memoryDir, selectorState,
        dirState.messages, dirState.byFilename,
        cacheControl, signal,
    );
}

// Mapping:
// mC4 → synthesizeRelevantMemories
```

```javascript
// ============================================
// synthesizeMemorySideQuery - Side-query that returns extracted facts + citations
// Location: chunks.99.mjs:697-766
// ============================================

// ORIGINAL (abridged — see chunks.99.mjs:697-766 for the full body):
async function iMz(q, K, _, z, Y, A, O) {
    // ...same side-query shape as nMz, except:
    //   - system text is lMz (synthesizer prompt, not cMz)
    //   - max_tokens: 2000 (room for 7 facts × ~1-2 sentences)
    //   - output schema is { relevant_facts: string[], cited_memories: string[] }
    //   - Returns { synthesis: "- fact1\n- fact2\n...", citedMemories: [..] } or null
    // ...
}
```

### Why a second mode

**Why surface model-written prose instead of raw files.** The selector mode surfaces *the file*, leaving the model to do its own reading. That works fine for short directories but degrades when 20+ memories are loosely related to a query (the model spends turns reading and discarding). The synthesizer instead reads everything *upstream* — Sonnet sees all bodies in one batched manifest — and produces 1-7 atomic facts the main model can rely on, plus citations. The trade-off is more Sonnet tokens (full bodies vs. descriptions) for fewer main-model tokens (extracted facts vs. raw files).

**Why max 7 facts.** Set by `H.relevant_facts...slice(0, 7)` in the synthesizer (chunks.99.mjs:751). Seven is an upper bound on what the model can meaningfully attend to in a single attachment without saturating the recall section.

**Why the attachment uses `path: "<synthesis:${dir}>"` and `header: "Recalled from your persistent memory system:"`.** The caller `RMY` (chunks.155.mjs:2087-2098) packages the synthesis into the same `relevant_memories` attachment shape as the selector mode, but with a sentinel path that distinguishes it visually. The `B97` header helper (chunks.155.mjs:2152) is bypassed entirely for synthesis attachments — they get a fixed `"Recalled from your persistent memory system:"` header instead, since there's no single file to cite (the citations are inside the synthesis text).

### Key insight

The two modes are **strictly cheaper substitutes**, not competing variants. Selector mode is the default; synthesis mode is a flagged experiment that trades Sonnet tokens for main-model focus. Both write into the same `relevant_memories` attachment so the downstream attachment-normalization layer (see [attachment_normalization.md](./attachment_normalization.md)) does not need to know which mode produced the attachment.

---

## System Prompts (Constant Text)

The selector prompt in v2.1.112 (chunks.99.mjs:768-775, `cMz`):

> You are selecting memories that will be useful to Claude Code as it processes a user's query. The first message lists the available memory files with their filenames and descriptions; subsequent messages each contain one user query.
>
> Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
> - If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
> - If there are no memories in the list that would clearly be useful, feel free to return an empty list.
> - Be especially conservative with user-profile and project-overview memories ([user], [project]). These describe the user's ongoing focus, not what every question is about. A profile saying "works on DB performance" is NOT relevant to a question that merely contains the word "performance" unless the question is actually about that DB work. Match on what the question IS ABOUT, not on surface keyword overlap with who the user is.
> - Do not re-select memories you already returned for an earlier query in this conversation.

Notable v2.1.88 → v2.1.112 changes:
- **New conversation framing** ("The first message lists ...; subsequent messages each contain one user query."). v2.1.88's prompt assumed a single-turn call where the manifest was inlined into the user message; v2.1.112 splits the manifest into its own cached prior message and tells the model that explicitly.
- **New "[user] / [project] conservatism" rule.** Inserted to combat false-positive selections on profile memories — the v2.1.88 version had no equivalent.
- **New "do not re-select" rule.** Pairs with the host-side `alreadySurfaced` filter to suppress repeats both in-prompt and post-hoc.
- **Removed "Recently used tools" guidance.** v2.1.88's prompt included a `recentTools` paragraph. v2.1.112 has consolidated this into a separate `wQ1` mechanism (the recent-tools section is no longer in the system prompt itself). In v2.1.112 source code, `recentTools` is no longer passed to the selector at all — that filtering is done indirectly through other channels.

The synthesizer prompt (chunks.99.mjs:777-797, `lMz`) is entirely new in v2.1.112 — there is no v2.1.88 equivalent. Its instructions emphasize:
- Lifting facts from memory bodies, not deriving from general knowledge
- Naming a path/flag/identifier only when it is "the thing the assistant must use or avoid"
- Returning empty facts when a prior turn already returned the answer (to prevent redundancy)

---

## Outer Wrapper: `getRelevantMemoryAttachments`

`RMY` (chunks.155.mjs:2076-2112) is the *caller* that:
1. Expands `@agent-name` mentions in the query to per-agent memory dirs (via `UNK` and `Jh6`)
2. Falls back to the auto-memory dir (`Nw()`) if no agent-dirs found
3. Dispatches to selector or synthesis mode based on `wH()`
4. In selector mode: flattens per-directory results, filters against `readFileState` and `alreadySurfaced`, slices to 5, and reads bodies via `CMY` (chunks.155.mjs:2126-2150)
5. In synthesis mode: packages each per-directory synthesis as a single attachment entry with `path: "<synthesis:${dir}>"`, header `"Recalled from your persistent memory system:"`

See [attachment_normalization.md](./attachment_normalization.md) for how the returned `relevant_memories` attachment is rendered into the prompt.

---

## Cross-Version Notes (v2.1.88 → v2.1.112)

| Concern | v2.1.88 | v2.1.112 | Change |
|---|---|---|---|
| Modes | Selector only | Selector + Synthesis (flagged) | Synthesis is new (`tengu_billiard_aviary`) |
| Selector entry | `findRelevantMemories(query, dir, signal, recentTools, alreadySurfaced)` | `uC4(q, K, selectorState, signal, alreadySurfaced)` | `recentTools` removed; `selectorState` added |
| Caching | Per-call manifest as user message text | Per-dir cached manifest, append-only Q/A chain | New cache state machine via `stateByDir` |
| Output (selector) | `RelevantMemory[]` (path + mtime) | `RelevantMemory[]` (path + mtime) | unchanged |
| Output (synthesis) | n/a | `{synthesis: string, citedMemories: string[]}` packaged into `relevant_memories` with sentinel path | new |
| System prompt | Includes recentTools guidance | Includes user/project conservatism guidance + no-repeat rule | tuning |
| Error logging | `[memdir] selectRelevantMemories failed: …` | `[memdir] selectRelevantMemories failed: …` (selector), `[memdir] synthesizeRelevantMemories failed: …` (synthesis) | second log site added |
| Telemetry | `feature('MEMORY_SHAPE_TELEMETRY')` shape-log | Cache-token telemetry via `lastUsage` (read by `MemoryPrefetch[Symbol.dispose]`) | telemetry pivoted from shape to cost |
| Excluded query sources | n/a | `extract_memories`, `auto_dream`, `prompt_suggestion`, `speculation`, `compact` (`bMY` set in chunks.155.mjs:2823) | new — these query sources skip prefetch entirely |

The cache state machine is the architecturally significant new piece. v2.1.88 reissued the manifest on every call (a small, ~3KB user message), but the calls were per-turn so the marginal cost was modest. v2.1.112 collapses this into a single cached prefix across the session — cost per call drops from ~3KB to ~50 bytes of new query text after the first turn.
