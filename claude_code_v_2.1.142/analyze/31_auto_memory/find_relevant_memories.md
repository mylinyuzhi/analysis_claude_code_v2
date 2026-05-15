# Find Relevant Memories — `findRelevantMemories.ts` (v2.1.142)

## Module Overview

`findRelevantMemories.ts` is the **recall layer** of the auto-memory subsystem. Given a user query and a memory directory, it returns up to five memory files most likely to help the model answer that query, using a *small Sonnet side-call* as the relevance ranker. The module sits between the on-disk `memoryScan` primitive (see [memory_scan.md](./memory_scan.md)) and the prompt-injection layer (see [attachment_normalization.md](./attachment_normalization.md)).

**v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/findRelevantMemories.ts` (141 lines).
**v2.1.142 lines**:
- `cli_inner_pretty.js:237145-237154` — selector entry (`FK7`)
- `cli_inner_pretty.js:237155-237198` — selector side-query (`Lz_`)
- `cli_inner_pretty.js:237199-237205` — synthesis entry (`gK7`)
- `cli_inner_pretty.js:237206-237257` — synthesis side-query (`Pz_`)
- `cli_inner_pretty.js:217408-217445` — per-directory state cache (`q36` / `K36` / `_36`)
- `cli_inner_pretty.js:237258-237286` — system prompts (`Jz_` / `Xz_`)

**v2.1.112 → v2.1.142 changes:**
1. Module-level rename only — same algorithm, same prompt-cache state machine.
2. `wH()` (synthesis flag) renamed to `gM()` in the dispatcher caller (`RMY` analog).
3. Selector + synthesizer are split functions but share the same `stateByDir` per-directory cache.
4. The selector system prompt (`Jz_`) gains an explicit "do not re-select" rule and "be conservative with user-profile memories" rule (same as v2.1.112 — these were tuning additions there too).
5. The synthesizer prompt (`Xz_`) is unchanged from v2.1.112's `lMz`.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — symbols added by this unit

Key functions in this document:
- `findRelevantMemories` selector mode (`FK7`) — Entry point, returns `RelevantMemory[]` (cli_inner_pretty.js:237145-237154)
- `selectRelevantMemoriesSideQuery` (`Lz_`) — Issues the Sonnet side query (cli_inner_pretty.js:237155-237198)
- `findRelevantMemories` synthesis mode (`gK7`) — Synthesizer entry, returns `{synthesis, citedMemories}` or null (cli_inner_pretty.js:237199-237205)
- `synthesizeMemorySideQuery` (`Pz_`) — Synthesizer side query (cli_inner_pretty.js:237206-237257)
- `getSelectorStateForDir` (`q36`) — Lookup in `stateByDir` (cli_inner_pretty.js:217408-217410)
- `initSelectorStateForDir` (`K36`) — Build manifest + `byFilename` map + cache-controlled system message (cli_inner_pretty.js:217411-217430)
- `appendSelectorQAToState` (`_36`) — Append (user query, assistant selection) to message chain (cli_inner_pretty.js:217431-217445)
- `SELECT_MEMORIES_SYSTEM_PROMPT` (`Jz_`) — Selector instructions (cli_inner_pretty.js:237258-237265)
- `SYNTHESIZE_MEMORIES_SYSTEM_PROMPT` (`Xz_`) — Synthesizer instructions (cli_inner_pretty.js:237266-237286)
- `MEMDIR_QUERY_SOURCE` (`$36`) — Telemetry tag `"memdir_relevance"` (cli_inner_pretty.js:217443)

---

## Selector Mode (Default)

### What it does

`findRelevantMemories` (selector form `FK7`) takes a user query, scans a memory directory for `.md` files (excluding `MEMORY.md`), asks Sonnet to pick which filenames are *clearly* useful, and returns absolute paths + mtimes for up to 5 picks. The model is told to return an empty list when uncertain, so a "no relevant memories" outcome is the common case.

### How it works

```javascript
// ============================================
// findRelevantMemories (selector) - Returns up to 5 RelevantMemory paths
// Location: cli_inner_pretty.js:237145-237154
// ============================================

// ORIGINAL (for source lookup):
async function FK7(H, $, q, K, _ = new Set()) {
  q.lastUsage = null;
  let A = { type: "ephemeral" },
    z = q36(q, $) ?? (await SO$($, K).then((O) =>
      (O.length > 0 && !K.aborted ? K36(q, $, O, RO$(O), A) : void 0)));
  if (!z || z.memories.every((O) => _.has(O.filePath))) return [];
  return (await Lz_(H, $, q, z.messages, z.byFilename, A, K))
    .map((O) => z.byFilename.get(O))
    .filter((O) => O !== void 0 && !_.has(O.filePath))
    .map((O) => ({ path: O.filePath, mtimeMs: O.mtimeMs }));
}

// READABLE (for understanding):
async function findRelevantMemoriesSelector(
  query,                       // user prompt text
  memoryDir,                   // absolute path to a memory directory
  selectorState,               // MemorySelectorState (per session, mutable)
  signal,                      // turn-level AbortSignal
  alreadySurfaced = new Set(), // paths already shown in prior turns
) {
  selectorState.lastUsage = null
  const cacheControl = { type: 'ephemeral' }

  // 1. Reuse cached state for this directory, or build it from a fresh scan.
  const dirState =
    getSelectorStateForDir(selectorState, memoryDir) ??
    (await scanMemoryFiles(memoryDir, signal).then(headers => {
      if (headers.length === 0 || signal.aborted) return undefined
      return initSelectorStateForDir(
        selectorState,
        memoryDir,
        headers,
        formatMemoryManifest(headers),
        cacheControl,
      )
    }))

  // 2. Bail when the directory is empty OR every memory has already been surfaced.
  if (!dirState || dirState.memories.every(m => alreadySurfaced.has(m.filePath))) {
    return []
  }

  // 3. Side-query Sonnet for filenames; map back to MemoryHeaders; filter already-surfaced.
  const selectedFilenames = await selectRelevantMemoriesSideQuery(
    query, memoryDir, selectorState,
    dirState.messages, dirState.byFilename,
    cacheControl, signal,
  )
  return selectedFilenames
    .map(filename => dirState.byFilename.get(filename))
    .filter(m => m !== undefined && !alreadySurfaced.has(m.filePath))
    .map(m => ({ path: m.filePath, mtimeMs: m.mtimeMs }))
}

// Mapping:
// FK7  → findRelevantMemoriesSelector
// H    → query
// $    → memoryDir
// q    → selectorState
// K    → signal
// _    → alreadySurfaced
// A    → cacheControl
// z    → dirState
// O    → loop variable / MemoryHeader / filename
// q36  → getSelectorStateForDir
// SO$  → scanMemoryFiles
// K36  → initSelectorStateForDir
// RO$  → formatMemoryManifest
// Lz_  → selectRelevantMemoriesSideQuery
```

### Why this approach

**Why a Sonnet side-call for ranking (not text-similarity).** A simple BM25 / cosine similarity ranker would have trouble distinguishing tool-reference memories the conversation is actively using from genuinely-useful memories. The selector system prompt (`Jz_`) explicitly instructs the model to be "especially conservative" with `[user]` and `[project]` memories that describe ongoing focus rather than question subject.

**Why bail on `alreadySurfaced` covers everything.** If every memory in the directory has been shown in prior turns, the selector would either return nothing useful or return repeats — both wasteful side calls. The pre-filter lets us skip the API call entirely.

**Why filter `alreadySurfaced` again *after* the Sonnet call.** This is **belt-and-suspenders**. The Sonnet call already implicitly avoids re-picking via the prompt instruction "Do not re-select memories you already returned for an earlier query in this conversation." But Sonnet's instruction-following on negative prompts is imperfect; the host-side filter guarantees the contract regardless of model behaviour.

**Why `byFilename.get(...)` filter.** Sonnet returns *filenames*. The host code re-maps those filenames to `MemoryHeader` objects. If Sonnet hallucinates a filename, `byFilename.get` returns `undefined` and the filter drops it. The host never trusts a model-returned identifier.

### Key insight

The selector is **stateless w.r.t. the model** but **stateful w.r.t. the session**. Every selector call sends the same big "Available memories" prefix (cached via `cache_control: ephemeral`), then a tiny per-turn query message. Sonnet sees the conversation as `[available-memories-prefix, q1, a1, q2, a2, ...]`, where the prefix is cache-hit and only the new query+answer pair burns fresh tokens. This makes the cost amortize down to almost zero on the second-and-later side calls within a single session.

---

## Side-Query Call

### What it does

`selectRelevantMemoriesSideQuery` (`Lz_`) issues a constrained Sonnet call: a system prompt (cached), a manifest message (cached), the new query, and a JSON-schema-constrained output that must produce a list of filenames. It also appends the (query, response) pair to the session's per-directory message chain so the next turn can reference it through prompt caching.

### How it works

```javascript
// ============================================
// selectRelevantMemoriesSideQuery - Sonnet side-call returning filenames
// Location: cli_inner_pretty.js:237155-237198
// ============================================

// ORIGINAL (for source lookup):
async function Lz_(H, $, q, K, _, A, z) {
  let Y = `Select memories relevant to:\n${H}`;
  try {
    let f = await Sg({
        model: lv(),
        system: [{ type: "text", text: Jz_, cache_control: A }],
        skipSystemPromptPrefix: !0,
        messages: [...K, { role: "user", content: [{ type: "text", text: Y, cache_control: A }] }],
        max_tokens: 256,
        output_format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: { selected_memories: { type: "array", items: { type: "string" } } },
            required: ["selected_memories"],
            additionalProperties: !1,
          },
        },
        signal: z,
        querySource: $36,
      }),
      O = f.content.find((w) => w.type === "text");
    if (!O || O.type !== "text") return [];
    let M = x$(O.text);
    return (
      _36(q, $, Y, O.text),
      (q.lastUsage = {
        cacheReadInputTokens: f.usage.cache_read_input_tokens ?? 0,
        cacheCreationInputTokens: f.usage.cache_creation_input_tokens ?? 0,
        turnCount: (K.length + 1) / 2,
      }),
      RH("memory_recall_select"),
      M.selected_memories.filter((w) => _.has(w))
    );
  } catch (f) {
    if (((q.lastUsage = null), z.aborted)) return [];
    return (
      J8("memory_recall_select", "memory_recall_select_query_failed"),
      N(`[memdir] selectRelevantMemories failed: ${ZH(f)}`, { level: "warn" }),
      []
    );
  }
}

// READABLE (for understanding):
async function selectRelevantMemoriesSideQuery(
  query, memoryDir, selectorState,
  priorMessages, byFilename, cacheControl, signal,
) {
  const queryMessage = `Select memories relevant to:\n${query}`
  try {
    const response = await sideQuery({
      model: getDefaultSonnetModel(),
      system: [
        { type: 'text', text: SELECT_MEMORIES_SYSTEM_PROMPT, cache_control: cacheControl },
      ],
      skipSystemPromptPrefix: true,
      messages: [
        ...priorMessages,                                      // includes manifest as cached msg 0
        {
          role: 'user',
          content: [{ type: 'text', text: queryMessage, cache_control: cacheControl }],
        },
      ],
      max_tokens: 256,
      output_format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: { selected_memories: { type: 'array', items: { type: 'string' } } },
          required: ['selected_memories'],
          additionalProperties: false,
        },
      },
      signal,
      querySource: MEMDIR_QUERY_SOURCE,                         // "memdir_relevance"
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return []
    const parsed = jsonParse(textBlock.text)

    appendSelectorQAToState(selectorState, memoryDir, queryMessage, textBlock.text)
    selectorState.lastUsage = {
      cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0,
      turnCount: (priorMessages.length + 1) / 2,
    }
    markPerfBoundary('memory_recall_select')
    return parsed.selected_memories.filter(name => byFilename.has(name))
  } catch (e) {
    if (signal.aborted) {
      selectorState.lastUsage = null
      return []
    }
    selectorState.lastUsage = null
    markPerfFailure('memory_recall_select', 'memory_recall_select_query_failed')
    logForDebugging(`[memdir] selectRelevantMemories failed: ${errorMessage(e)}`, { level: 'warn' })
    return []
  }
}

// Mapping:
// Lz_   → selectRelevantMemoriesSideQuery
// H     → query
// $     → memoryDir
// q     → selectorState
// K     → priorMessages
// _     → byFilename (Map<string, MemoryHeader>)
// A     → cacheControl
// z     → signal
// Y     → queryMessage
// f     → response
// O     → textBlock
// M     → parsed
// w     → loop variable
// Sg    → sideQuery
// lv    → getDefaultSonnetModel
// Jz_   → SELECT_MEMORIES_SYSTEM_PROMPT
// x$    → jsonParse
// _36   → appendSelectorQAToState
// RH    → markPerfBoundary
// J8    → markPerfFailure
// N     → logForDebugging
// ZH    → errorMessage
// $36   → MEMDIR_QUERY_SOURCE = "memdir_relevance"
```

### Why this approach

**Why `max_tokens: 256`.** The output is a JSON object containing at most a 5-element array of filenames. 256 tokens is generous; the typical response is < 50 tokens. Keeping `max_tokens` small bounds the worst-case latency.

**Why `skipSystemPromptPrefix: true`.** Side queries normally prepend the standard Claude Code system prompt prefix (tool list, environment, etc.) — irrelevant for a filename selector. Skipping it both shortens the call and makes the selector's behavior insensitive to how the parent session was configured.

**Why JSON schema (not free-text parsing).** The output is structurally constrained: the model *must* produce `{"selected_memories": ["a.md", "b.md"]}` and nothing else. This eliminates the entire class of "model emitted a preamble before the JSON" failures, and lets `jsonParse(textBlock.text)` succeed directly.

**Why append to `stateByDir` *after* a successful call.** If the call fails or times out, the message chain is *not* updated — the next turn restarts from `[system, manifest]` rather than chaining onto a non-existent assistant turn. The error branch explicitly skips the append. This guarantees the cached chain is always coherent.

**Why two `if (z.aborted)` branches.** The abort branch is distinct from the general error branch because aborted calls *intentionally* short-circuit without logging (a user pressing Escape is not a bug to warn about). Setting `lastUsage = null` in both branches ensures the telemetry "the selector ran and consumed X cache tokens" is only true for genuinely-completed calls.

### Key insight

The selector is a **prompt-cached message-chain** Sonnet conversation. Treating it as a stateful conversation per directory makes each subsequent turn cheap: the cached manifest becomes `cache_read_input_tokens`, the cached prior Q/A pairs likewise, and only the new query is fresh creation. The session-level state (`MemorySelectorState`) is the *only* thing that makes this possible — without `stateByDir`, every turn would rebuild the manifest from scratch.

---

## Per-Directory Cache State Machine

### What it does

The `MemorySelectorState` lives for a session. It maps `memoryDir → DirState` where `DirState = { memories, byFilename, messages }`. `memories` is the raw scan output. `byFilename` is the path-validation lookup. `messages` is the **accumulated Sonnet conversation history** for that directory, including the cached manifest as message 0.

### How it works

```javascript
// ============================================
// getSelectorStateForDir / initSelectorStateForDir - Build cached manifest message
// Location: cli_inner_pretty.js:217408-217429
// ============================================

// ORIGINAL (for source lookup):
function q36(H, $) {
  return H.stateByDir.get($);
}
function K36(H, $, q, K, _) {
  let A = {
    memories: q,
    byFilename: new Map(q.map((z) => [z.filename, z])),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Available memories:\n${K}`,
            ...(_ && { cache_control: _ }),
          },
        ],
      },
    ],
  };
  return (H.stateByDir.set($, A), A);
}

// READABLE (for understanding):
function getSelectorStateForDir(selectorState, memoryDir) {
  return selectorState.stateByDir.get(memoryDir)
}

function initSelectorStateForDir(selectorState, memoryDir, headers, manifestText, cacheControl) {
  const dirState = {
    memories: headers,
    byFilename: new Map(headers.map(h => [h.filename, h])),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Available memories:\n${manifestText}`,
            ...(cacheControl ? { cache_control: cacheControl } : {}),
          },
        ],
      },
    ],
  }
  selectorState.stateByDir.set(memoryDir, dirState)
  return dirState
}

// Mapping:
// q36  → getSelectorStateForDir
// K36  → initSelectorStateForDir
// H    → selectorState
// $    → memoryDir
// q    → headers
// K    → manifestText
// _    → cacheControl
// A    → dirState
// z    → header (loop var)
```

```javascript
// ============================================
// appendSelectorQAToState - Chain query+selection onto cached messages
// Location: cli_inner_pretty.js:217431-217445
// ============================================

// ORIGINAL (for source lookup):
function _36(H, $, q, K) {
  let _ = H.stateByDir.get($);
  if (!_) return;
  H.stateByDir.set($, {
    ..._,
    messages: [
      ..._.messages,
      { role: "user", content: [{ type: "text", text: q }] },
      { role: "assistant", content: [{ type: "text", text: K }] },
      // (closing brace omitted in source preview but understood from context)
    ],
  });
}

// READABLE (for understanding):
function appendSelectorQAToState(selectorState, memoryDir, queryText, assistantText) {
  const dirState = selectorState.stateByDir.get(memoryDir)
  if (!dirState) return                              // no-op if cleared (e.g. on compact)
  selectorState.stateByDir.set(memoryDir, {
    ...dirState,
    messages: [
      ...dirState.messages,
      { role: 'user', content: [{ type: 'text', text: queryText }] },
      { role: 'assistant', content: [{ type: 'text', text: assistantText }] },
    ],
  })
}

// Mapping:
// _36  → appendSelectorQAToState
// H    → selectorState
// $    → memoryDir
// q    → queryText
// K    → assistantText
// _    → dirState
```

### Why this approach

**Why a per-directory state map.** The caller (`getRelevantMemoryAttachments` analog) can run against multiple directories — the auto-memory dir and one-or-more agent-mention dirs. Each directory has its own manifest, so each needs its own cache chain. A single shared chain would invalidate cache as soon as the manifest changed.

**Why store the manifest as a `user` role message (not `system`).** Sonnet's prompt cache supports both, but the *cache key* differs. The host code wants exactly two cached blocks: the static `Jz_` system text (one cache breakpoint) and the dynamic manifest (a second breakpoint). Putting the manifest in the user message slot makes that two-breakpoint layout natural.

**Why no eviction policy.** Each `MemorySelectorState` is per-session and the session lifetime caps memory growth. The state is also disposed when compaction fires. For long-lived sessions the growth is `O(turns × directories)` — acceptable in practice given that most sessions stay below 50 memdir queries.

### Key insight

The state machine is the **prompt-cache contract** between the host and the API. Every field exists for a specific cache-related reason: `memories` and `byFilename` are pure host state, but `messages` is the *exact array* that gets sent to the API on every call. Append-only growth on that array is what gives the prompt cache its high hit-rate; clearing the array on compact is what lets the cache regenerate cleanly when the conversation has been compressed.

---

## Synthesis Mode (Flagged)

When `tengu_billiard_aviary` (`gM()`) is on, the caller takes the synthesis path: `gK7` invokes `Pz_`, which sends *full memory bodies* to Sonnet and asks it to extract atomic facts.

```javascript
// ============================================
// findRelevantMemories (synthesis) - Returns {synthesis, citedMemories} or null
// Location: cli_inner_pretty.js:237199-237205
// ============================================

// ORIGINAL (for source lookup):
async function gK7(H, $, q, K) {
  q.lastUsage = null;
  let _ = { type: "ephemeral" },
    A = q36(q, $) ?? (await SO$($, K).then((z) =>
      (z.length > 0 && !K.aborted ? K36(q, $, z, RO$(z), _) : void 0)));
  if (!A) return null;
  return Pz_(H, $, q, A.messages, A.byFilename, _, K);
}

// READABLE (for understanding):
async function synthesizeRelevantMemories(query, memoryDir, selectorState, signal) {
  selectorState.lastUsage = null
  const cacheControl = { type: 'ephemeral' }

  const dirState =
    getSelectorStateForDir(selectorState, memoryDir) ??
    (await scanMemoryFiles(memoryDir, signal).then(headers => {
      if (headers.length === 0 || signal.aborted) return undefined
      // Note: scanMemoryFiles in synthesis mode returns headers WITH .content
      // populated, so the manifest includes full bodies.
      return initSelectorStateForDir(
        selectorState, memoryDir, headers,
        formatMemoryManifest(headers),       // body lines indented 2 spaces
        cacheControl,
      )
    }))

  if (!dirState) return null
  return synthesizeMemorySideQuery(
    query, memoryDir, selectorState,
    dirState.messages, dirState.byFilename,
    cacheControl, signal,
  )
}

// Mapping: gK7→synthesizeRelevantMemories
```

The `Pz_` side query body is structurally the same as `Lz_`, but with:
- `system` text = `Xz_` (synthesizer prompt, not `Jz_`).
- `max_tokens: 2000` (room for 7 facts × ~1-2 sentences).
- Output schema `{ relevant_facts: string[], cited_memories: string[] }`.
- Returns `{ synthesis: "- fact1\n- fact2\n...", citedMemories: [...] }` or `null`.
- The `relevant_facts` array is `.slice(0, 7)` — bounded at 7.

### Why a second mode

**Why surface model-written prose instead of raw files.** The selector mode surfaces *the file*, leaving the model to do its own reading. That works fine for short directories but degrades when 20+ memories are loosely related to a query (the model spends turns reading and discarding). The synthesizer instead reads everything *upstream* — Sonnet sees all bodies in one batched manifest — and produces 1-7 atomic facts the main model can rely on, plus citations. The trade-off is more Sonnet tokens (full bodies vs. descriptions) for fewer main-model tokens (extracted facts vs. raw files).

**Why max 7 facts.** Seven is an upper bound on what the model can meaningfully attend to in a single attachment without saturating the recall section.

**Why the attachment uses `path: "<synthesis:${dir}>"` and `header: "Recalled from your persistent memory system:"`.** The caller packages the synthesis into the same `relevant_memories` attachment shape as the selector mode, but with a sentinel path that distinguishes it visually. The header helper is bypassed entirely for synthesis attachments — they get a fixed `"Recalled from your persistent memory system:"` header instead, since there's no single file to cite (the citations are inside the synthesis text).

### Key insight

The two modes are **strictly cheaper substitutes**, not competing variants. Selector mode is the default; synthesis mode is a flagged experiment that trades Sonnet tokens for main-model focus. Both write into the same `relevant_memories` attachment so the downstream attachment-normalization layer (see [attachment_normalization.md](./attachment_normalization.md)) does not need to know which mode produced the attachment.

---

## System Prompts (Constant Text)

### Selector prompt (`Jz_`, cli_inner_pretty.js:237258-237265)

> You are selecting memories that will be useful to Claude Code as it processes a user's query. The first message lists the available memory files with their filenames and descriptions; subsequent messages each contain one user query.
>
> Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
> - If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
> - If there are no memories in the list that would clearly be useful, feel free to return an empty list.
> - Be especially conservative with user-profile and project-overview memories ([user], [project]). These describe the user's ongoing focus, not what every question is about. A profile saying "works on DB performance" is NOT relevant to a question that merely contains the word "performance" unless the question is actually about that DB work. Match on what the question IS ABOUT, not on surface keyword overlap with who the user is.
> - Do not re-select memories you already returned for an earlier query in this conversation.

**v2.1.112 → v2.1.142**: Text is **identical**. Both the user/project conservatism rule and the no-repeat rule were already present in v2.1.112.

### Synthesizer prompt (`Xz_`, cli_inner_pretty.js:237266-237286)

> You read persistent memory files for an AI coding assistant and extract facts to help the coding assistant answer queries. The first message lists every available memory file with its frontmatter and full body; each subsequent user message contains one query.
>
> For each query, return a JSON object:
> - relevant_facts: an array of facts (max 7) that would be useful for processing the query. Each fact is 1-2 sentences and stands on its own.
> - cited_memories: array of filenames (matching the manifest exactly) for the memories you drew from
>
> If no memories are relevant, return relevant_facts: [] and cited_memories: [].
>
> A fact is useful when it lets the assistant do one of these things:
> - Avoid re-asking: supply something the user would otherwise have to restate (a path, a name, a config value, a decision already made).
> - Apply user preferences: surface conventions, styles, or tooling choices the assistant should follow for this query.
> - Maintain continuity: surface the state of an ongoing project, goal, or prior thread that this query is continuing.
> - Avoid a known pitfall: surface past corrections or mistakes so the assistant pre-empts repeating them.
>
> Style and length:
> - Each fact is 1-2 sentences. State the fact directly, then add the context needed to act on it.
> - Name a path, flag, or identifier only when it is the thing the assistant must use or avoid. Drop supporting details like timestamps, byte counts, version numbers, and historical asides.
> - Do not answer or solve the query yourself. You are a retrieval step, not the assistant: every fact must be lifted from a memory file body, not derived from general knowledge or your own reasoning about the query. If no memory covers it, return relevant_facts: [].
> - Do not restate the query.
> - If a prior turn in this conversation already returned the relevant facts for this query, return relevant_facts: [] and cited_memories: [] rather than restating.

**v2.1.112 → v2.1.142**: Text is **identical**.

---

## Outer Wrapper: getRelevantMemoryAttachments

The outer caller (analog of v2.1.112's `RMY`) does:

1. Expand `@agent-name` mentions in the query to per-agent memory dirs.
2. Fall back to the auto-memory dir (`UY()`) if no agent-dirs found.
3. Dispatch to selector or synthesis mode based on `gM()`.
4. In selector mode: flatten per-directory results, filter against `readFileState` and `alreadySurfaced`, slice to 5, and read bodies via the attachment-creation pipeline (see [attachment_normalization.md](./attachment_normalization.md)).
5. In synthesis mode: package each per-directory synthesis as a single attachment entry with `path: "<synthesis:${dir}>"`, header `"Recalled from your persistent memory system:"`.

The v2.1.142 caller is at `cli_inner_pretty.js:398150-398210` (function `Oq5`) and its prefetch entry `oo7` at `cli_inner_pretty.js:398243-398281`.

---

## Cross-Version Notes (v2.1.88 → v2.1.142)

| Concern | v2.1.88 | v2.1.112 | v2.1.142 | Change vs v2.1.112 |
|---|---|---|---|---|
| Modes | Selector only | Selector + Synthesis | Selector + Synthesis | none |
| Selector entry | `findRelevantMemories` | `uC4` | `FK7` | rename only |
| Synthesis entry | n/a | `mC4` | `gK7` | rename only |
| Side-query function | inline | `nMz` | `Lz_` | rename only |
| Synthesis-side function | n/a | `iMz` | `Pz_` | rename only |
| Per-directory cache | n/a | `stateByDir` via `dK6` | same `stateByDir`, helper now anonymous | structural rename |
| Selector system prompt | recent-tools paragraph | conservatism + no-repeat rules | conservatism + no-repeat rules | none |
| Synthesizer system prompt | n/a | `lMz` | `Xz_` (identical text) | rename only |
| `max_tokens` (selector) | 256 | 256 | 256 | none |
| `max_tokens` (synthesizer) | n/a | 2000 | 2000 | none |
| Synthesis fact cap | n/a | 7 | 7 | none |
| Error log prefix | `[memdir] selectRelevantMemories failed` | same | same | none |
| `MEMDIR_QUERY_SOURCE` | n/a | `"memdir_relevance"` | `"memdir_relevance"` | none |

The cache state machine and the prompt text are **bit-equivalent** between v2.1.112 and v2.1.142. The only changes are obfuscated-name renames and the upstream scan adapter (because `scanMemoryFiles` reads `metadata.*` fields differently — see [memory_scan.md](./memory_scan.md)). The selector behavior has been stable since v2.1.112 was tuned.
