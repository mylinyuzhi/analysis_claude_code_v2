# Memory → Conversation Integration (v2.1.112)

## Overview

How team (and private) memory bytes reach the conversation context. Three injection paths converge at the message renderer:

1. **System prompt section** — `buildCombinedMemoryPrompt` (`BtY`) is concatenated into the agent's system prompt at session start. This is where the agent learns *that* memory exists and *where*.
2. **`nested_memory` attachment** — A separate channel that injects per-file content (CLAUDE.md and pre-loaded memory files) as `<system-reminder>`-wrapped user messages.
3. **`relevant_memories` attachment** — Per-turn semantic recall hits, also `<system-reminder>`-wrapped, each prefixed by `memoryHeader` (`B97`).

**v2.1.88 sources**: `src/utils/messages.ts` (lines 81, 3700-3722), `src/utils/attachments.ts:2327-2332`, `src/memdir/teamMemPrompts.ts` (100 lines)
**v2.1.112 chunks**: chunks.166.mjs:812 (`nested_memory` renderer), chunks.165.mjs:2549 (`relevant_memories` renderer), chunks.155.mjs:2152 (`memoryHeader`), chunks.191.mjs:3104 (`buildCombinedMemoryPrompt`)

**Key insight**: Memory content is **not** spliced into the assistant's role messages. Every injection is via a **user-meta** message that the model treats as part of its system context, and each one is wrapped in a `<system-reminder>` envelope — making the boundary between "what the user said" and "what the system loaded" both visible and rule-bound.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — full index for v2.1.112
> - [symbol_additions_unit_05.md](../00_overview/symbol_additions_unit_05.md) — this unit's additions

Key functions in this document:
- `memoryHeader` (`B97`) — `chunks.155.mjs:2152`
- `memoryFreshnessText` (`$Q1`) — `chunks.86.mjs:2686`
- `memoryAgeDays` (`a5z`) — `chunks.86.mjs:2682`
- `buildCombinedMemoryPrompt` (`BtY`) — `chunks.191.mjs:3104`
- `loadAndFormatRelevantMemories` (`CMY`) — `chunks.155.mjs:2126`
- `startRelevantMemoryPrefetch` (`ikK`) — `chunks.155.mjs:2159`
- nested_memory renderer — `chunks.166.mjs:812`
- relevant_memories renderer — `chunks.165.mjs:2549`

---

## 1. The `memoryHeader` Function

`memoryHeader` is the single function that decides how each recalled memory is *labeled* in context. It is called twice per attachment: once at attachment-creation time (to freeze the bytes for prompt-cache stability), once as a fallback when the stored header is missing from a resumed session.

```javascript
// ============================================
// memoryHeader - Per-memory label string injected before file content
// Location: chunks.155.mjs:2152-2157
// ============================================

// ORIGINAL (for source lookup):
function B97(q, K) {
    let _ = $Q1(K);
    return _ ? `${_}

Memory: ${q}:` : `Memory: ${q}:`
}

// READABLE (for understanding):
export function memoryHeader(path: string, mtimeMs: number): string {
  const staleness = memoryFreshnessText(mtimeMs)
  return staleness
    ? `${staleness}\n\nMemory: ${path}:`
    : `Memory: ${path}:`
}

// Mapping: B97→memoryHeader, q→path, K→mtimeMs, _→staleness, $Q1→memoryFreshnessText
```

**What it does**: Returns a 1-or-2-block prefix that will go before the memory file's content in a `relevant_memories` attachment. The first block (only present if the file is older than 1 day) is a staleness caveat; the second block is always `Memory: <path>:`.

**How it works**:
1. Calls `memoryFreshnessText(mtimeMs)` — which returns `""` for files ≤1 day old, otherwise a sentence like *"This memory is 47 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."*
2. If the staleness text is empty, the prefix is just `Memory: <path>:` — keeping fresh-memory blocks compact.
3. Otherwise the prefix is `<staleness>\n\nMemory: <path>:` — staleness comes *first* so the model encounters the caveat before the (potentially misleading) bytes.

**Why this approach** (the cumulative design across versions):

- **The staleness caveat is conditional** because fresh memory is the common case and bare warnings on every recall would train the model to ignore them.
- **Path goes second** because path text is short and predictable; staleness text is long and variable. Placing staleness first leverages the recency-of-relevant-information heuristic — the model sees the caveat right before the (potentially-stale) bytes.
- **`Memory:` prefix is literal**, not stylized. This is a discoverable token: a downstream parser or the agent itself can scan for `Memory: <path>:` to identify recalled bytes in transcripts.

**Behavioral diff from v2.1.88**: The v2.1.88 source emits `Memory (saved ${memoryAge(mtimeMs)}): ${path}:` when there is no staleness caveat. The compiled v2.1.112 form omits the `(saved X ago)` parenthetical entirely:

```text
v2.1.88:   `Memory (saved today): path/to/file.md:`     ← no caveat, contains age
v2.1.112:  `Memory: path/to/file.md:`                   ← no caveat, no age
```

This is a documented (header-stability) regression: the v2.1.112 compiled output drops the "saved X ago" string in the fresh case. The staleness caveat (≥2 days old) is unchanged. Implications:

- Prompt-cache bytes for relevant_memories are slightly smaller in v2.1.112.
- Fresh memories no longer self-announce their recency. Stale memories still do (via the freshness caveat).
- A consumer counting "today" / "yesterday" mentions in transcript would see fewer hits in v2.1.112.

**Key insight**: The header is the contract between memory storage and the language model. By keeping it minimal (path + optional caveat) and computing it once at attachment-creation time, the design optimizes for **prompt cache stability** — re-rendering the same recall on the next turn produces byte-identical context, and the cache hits.

---

## 2. `memoryFreshnessText` — The Staleness Caveat

```javascript
// ============================================
// memoryFreshnessText - Returns empty for fresh memory, caveat otherwise
// Location: chunks.86.mjs:2686-2690
// ============================================

// ORIGINAL (for source lookup):
function $Q1(q) {
    let K = a5z(q);
    if (K <= 1) return "";
    return `This memory is ${K} days old. ` +
           "Memories are point-in-time observations, not live state — " +
           "claims about code behavior or file:line citations may be outdated. " +
           "Verify against current code before asserting as fact."
}

// READABLE (for understanding):
export function memoryFreshnessText(mtimeMs: number): string {
  const d = memoryAgeDays(mtimeMs)
  if (d <= 1) return ''
  return (
    `This memory is ${d} days old. ` +
    `Memories are point-in-time observations, not live state — ` +
    `claims about code behavior or file:line citations may be outdated. ` +
    `Verify against current code before asserting as fact.`
  )
}

// Mapping: $Q1→memoryFreshnessText, a5z→memoryAgeDays
```

**Why the ≤1 day cutoff**: Memories saved today or yesterday are almost certainly still accurate — the code they reference hasn't drifted. Caveat-on-everything would erode the value of the caveat in the ≥2-day case where it matters (file:line citations to code that may have moved or been refactored).

**Why `mtimeMs` and not "session count"**: mtime is observable from the filesystem with no extra bookkeeping. Sessions are harder to count consistently across crashes, resumes, etc. Days-since-mtime is the more robust signal of "is this memory likely still valid."

---

## 3. The `nested_memory` Attachment Type

`nested_memory` is the attachment type used for **pre-loaded** memory content — primarily CLAUDE.md files in the cwd, plus any memory file the system has chosen to load eagerly (as opposed to via per-turn recall).

```javascript
// ============================================
// nested_memory renderer - Inject pre-loaded memory file as user-meta message
// Location: chunks.166.mjs:812-817
// ============================================

// ORIGINAL (for source lookup):
nested_memory: (q) => X_([t8({
    content: `Contents of ${q.content.path}:

${q.content.content}`,
    isMeta: !0
})]),

// READABLE (for understanding):
case 'nested_memory': {
  return wrapMessagesInSystemReminder([
    createUserMessage({
      content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
      isMeta: true,
    }),
  ])
}

// Mapping: q→attachment, X_→wrapMessagesInSystemReminder, t8→createUserMessage
//          content.path / content.content come from the MemoryFileInfo struct
```

**What it does**: Converts a `nested_memory` attachment into a single `<system-reminder>`-wrapped user-meta message whose body is `Contents of <path>:\n\n<file content>`.

**How it works**:
1. Each attachment carries `{ type: 'nested_memory', path, content: MemoryFileInfo, displayPath }`. The `MemoryFileInfo` has both `path` and `content` fields — the renderer uses `content.path` (which may differ from the outer `path` if the file was relocated or aliased) and the actual `content.content` bytes.
2. `createUserMessage({ isMeta: true })` builds a user-role message tagged with `isMeta: true`. The meta flag is what distinguishes injected context from user-typed input — transcript views and tools that filter "real" user input on `!isMeta`.
3. `wrapMessagesInSystemReminder` wraps the content in `<system-reminder>...</system-reminder>` tags. The model treats these as system-level context.

**Why a separate channel from `relevant_memories`**:

- **Eager vs lazy loading**: `nested_memory` is loaded *unconditionally* at session start (CLAUDE.md is always loaded if it exists). `relevant_memories` is loaded *only* when a per-turn semantic search returns a hit.
- **Different headers**: `nested_memory` uses `Contents of <path>:` (no staleness, no `Memory:` prefix). `relevant_memories` uses `memoryHeader` (path-only or staleness+path).
- **Dedup state**: `nested_memory` paths are tracked in `loadedNestedMemoryPaths` (a Set) and `readFileState` (an LRU) so the same CLAUDE.md isn't injected twice within a session. `relevant_memories` is per-turn fresh.

**Why isMeta**: The user did not type `Contents of foo/CLAUDE.md: ...`. Marking the message as meta:
- Hides it from the transcript view (filterForBriefTool, shouldShowUserMessage).
- Excludes it from operations that count "user messages" (e.g. for memory extraction triggers).
- Lets the model see it as system context without treating it as a fresh user request.

---

## 4. The `relevant_memories` Attachment Type

`relevant_memories` carries per-turn recall hits — files the recall pipeline determined are relevant to the current user message. Each hit goes through `memoryHeader` (`B97`) once at creation time.

```javascript
// ============================================
// relevant_memories renderer - Inject recalled memory bytes
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
case 'relevant_memories': {
  return wrapMessagesInSystemReminder(
    attachment.memories.map((m, i) => {
      // Use the header stored at attachment-creation time so the
      // rendered bytes are stable across turns (prompt-cache hit).
      // Fall back to recomputing for resumed sessions that predate the field.
      const header = m.header ?? memoryHeader(m.path, m.mtimeMs)
      const isSynthesis = m.path.startsWith('<synthesis:')
      const prelude =
        i === 0 && !isSynthesis
          ? 'Retrieved for possible relevance — use only if it actually applies to what the user asked.\n\n'
          : ''
      return createUserMessage({
        content: `${prelude}${header}\n\n${m.content}`,
        isMeta: true,
      })
    }),
  )
}

// Mapping: q→attachment, z→m, Y→i, A→header, O→isSynthesis, B97→memoryHeader
```

**Three notable design decisions** in this renderer:

1. **Stored header takes precedence** (`z.header ?? B97(z.path, z.mtimeMs)`). The attachment-creation pipeline (`loadAndFormatRelevantMemories` at chunks.155.mjs:2126) calls `memoryHeader` once and stores the result in the attachment. The renderer prefers that cached value. The fallback recomputation only fires for *resumed sessions* where the attachment was serialized before the `header` field was added — keeps backward compat without breaking prompt-cache stability for new sessions.

2. **Prelude only on the first non-synthesis hit** (`i === 0 && !isSynthesis`). The prelude tells the model *not* to apply memory content reflexively. Putting it once at the top of the batch keeps token cost down. Synthesis hits (where path starts with `<synthesis:`) get a custom header at creation time (`Recalled from your persistent memory system:`) so they skip the prelude.

3. **`isMeta: true` and system-reminder wrap** — same envelope as `nested_memory`, for the same reasons (hidden from transcript, model-visible).

### 4.1 The Synthesis-Memory Special Case

```javascript
// from chunks.155.mjs:2092-2104
return [{
    type: "relevant_memories",
    memories: X      // X contains items with path: `<synthesis:${W}>` and header: "Recalled from your persistent memory system:"
}]
```

Synthesis memories are aggregated/distilled summaries (produced by the auto-dream agent) whose "path" is a synthetic marker rather than a filesystem path. They:
- Get the custom header `Recalled from your persistent memory system:` (not `Memory: <path>:`).
- Skip the prelude (the synthesis itself is already a summary; double-warning is noise).
- Use the same renderer as filesystem-backed memories — uniform downstream handling.

---

## 5. `buildCombinedMemoryPrompt` — The System-Prompt Memory Section

When team memory is enabled, `getAutoMemoryPromptForSession` (chunks.192.mjs) selects `buildCombinedMemoryPrompt` (`BtY` at chunks.191.mjs:3104) instead of the single-directory variant. The function produces the "# Memory" section of the system prompt.

```javascript
// ============================================
// buildCombinedMemoryPrompt - Dual-directory system prompt section
// Location: chunks.191.mjs:3104-3110
// Source: src/memdir/teamMemPrompts.ts:22-100
// ============================================

// ORIGINAL (for source lookup):
function BtY(q, K = !1) {
    let _ = Nw(),                       // autoDir
        z = vp(),                       // teamDir
        Y = K ? [/* skipIndex howToSave */] : [/* full howToSave */];
    return ["# Memory", "", `You have a persistent, file-based memory system with two directories: a private directory at \`${_}\` and a shared team directory at \`${z}\`. ${sd8}`, "", "...", ...bC4, ...aH6, "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "", ...Y, "", "## When to access memories", "...", ji1, "", ...sH6, "", "## Memory and other forms of persistence", "...", ...q ?? [], "", ...Dz8(_)].join("\n")
}

// READABLE (for understanding):
export function buildCombinedMemoryPrompt(
  extraGuidelines?: string[],
  skipIndex = false,
): string {
  const autoDir = getAutoMemPath()
  const teamDir = getTeamMemPath()

  const howToSave = skipIndex
    ? [/* one-step write (no MEMORY.md pointer step) */]
    : [/* two-step write: file + MEMORY.md pointer */]

  const lines = [
    '# Memory',
    '',
    `You have a persistent, file-based memory system with two directories: ` +
      `a private directory at \`${autoDir}\` and a shared team directory at \`${teamDir}\`. ` +
      `${DIRS_EXIST_GUIDANCE}`,
    '',
    "You should build up this memory system over time...",
    '',
    'If the user explicitly asks you to remember something, save it immediately...',
    '',
    '## Memory scope',
    '',
    'There are two scope levels:',
    '',
    `- private: memories that are private between you and the current user. ` +
      `They persist across conversations with only this specific user and are stored at the root \`${autoDir}\`.`,
    `- team: memories that are shared with and contributed by all of the users who work within this project directory. ` +
      `Team memories are synced at the beginning of every session and they are stored at \`${teamDir}\`.`,
    '',
    ...TYPES_SECTION_COMBINED,           // 4-type taxonomy (user/feedback/project/reference) with <scope> guidance
    ...WHAT_NOT_TO_SAVE_SECTION,
    '- You MUST avoid saving sensitive data within shared team memories. ' +
      'For example, never save API keys or user credentials.',
    '',
    ...howToSave,
    '',
    '## When to access memories',
    '- When memories (personal or team) seem relevant...',
    '- You MUST access memory when the user explicitly asks...',
    '- If the user says to *ignore* or *not use* memory: ...',
    MEMORY_DRIFT_CAVEAT,
    '',
    ...TRUSTING_RECALL_SECTION,
    '',
    '## Memory and other forms of persistence',
    'Memory is one of several persistence mechanisms...',
    '- When to use or update a plan instead of memory: ...',
    '- When to use or update tasks instead of memory: ...',
    ...(extraGuidelines ?? []),
    '',
    ...buildSearchingPastContextSection(autoDir),
  ]
  return lines.join('\n')
}

// Mapping: BtY→buildCombinedMemoryPrompt, q→extraGuidelines, K→skipIndex,
//          _→autoDir, z→teamDir, Y→howToSave,
//          Nw→getAutoMemPath, vp→getTeamMemPath,
//          sd8→DIRS_EXIST_GUIDANCE, bC4→TYPES_SECTION_COMBINED,
//          aH6→WHAT_NOT_TO_SAVE_SECTION, ji1→MEMORY_DRIFT_CAVEAT,
//          sH6→TRUSTING_RECALL_SECTION, Dz8→buildSearchingPastContextSection
```

**What it does**: Returns a multi-line string that becomes the `# Memory` section of the agent's system prompt when team memory is enabled. The string includes both directories' paths, the 4-type taxonomy with per-type scope guidance (user/feedback/project/reference), instructions for writing and accessing memory, and a search-past-context section.

**How it works** — section-by-section:

1. **Header line** — Names both directories and asserts `DIRS_EXIST_GUIDANCE` (a constant saying both dirs already exist on disk so the agent can write directly without checking).
2. **Scope definitions** — Spells out what "private" means (per-user, stored at the auto path) and what "team" means (shared, synced, stored at the team path). The "synced at the beginning of every session" claim is what the `teamMemorySync` watcher delivers.
3. **`TYPES_SECTION_COMBINED`** — The 4-type taxonomy with `<scope>` guidance embedded in XML-style `<type>` blocks. This is where the agent learns which memory type goes to which directory (e.g. `feedback` → private, `project` → team).
4. **`WHAT_NOT_TO_SAVE_SECTION`** + the **anti-secrets line** ("never save API keys or user credentials"). The anti-secrets line is *team-only* because secrets in private memory only leak to the same user; secrets in team memory leak to all teammates.
5. **`howToSave`** — Conditional on `skipIndex`. Default form is a 2-step write (memory file + MEMORY.md pointer); `skipIndex=true` is the 1-step form used when MEMORY.md is being rebuilt by the dream agent and individual writes shouldn't update it.
6. **When-to-access** + **`MEMORY_DRIFT_CAVEAT`** + **`TRUSTING_RECALL_SECTION`** — All shared constants from `memoryTypes.ts`; they describe when to consult memory and how to handle staleness.
7. **Persistence-comparison section** — Distinguishes memory from plans and tasks (plan = current implementation alignment; tasks = current step tracking; memory = cross-conversation knowledge).
8. **Tail**: optional `extraGuidelines` (caller-injected) and `buildSearchingPastContextSection(autoDir)` (search/recall tool guidance, takes only the private dir because the team dir's content is indexed under the same recall system).

**Why this approach** (vs. a simpler "here are the paths, save things") :

- **The taxonomy is essential** because the agent has to *choose* between private and team for every save. Without `TYPES_SECTION_COMBINED`'s per-type `<scope>` guidance, choices would be arbitrary.
- **The anti-secrets line is privileged** (not part of `WHAT_NOT_TO_SAVE_SECTION`) because it only applies when a team scope exists. Putting it inline (not in the shared constant) means the single-directory prompt doesn't carry an irrelevant secrets warning.
- **`skipIndex` is a per-call flag**, not a feature flag. The dream agent owns the MEMORY.md rebuild and passes `skipIndex=true` for that one run; everywhere else gets the 2-step form.

**Key insight**: This function is the *contract* between the system prompt and `validateTeamMemWritePath`. The prompt tells the agent *what* paths to write to; the validator enforces *that* the write doesn't escape that path. Without the validator, a misled or malicious model could write outside `team/`. Without the prompt, the agent wouldn't know `team/` exists at all.

### 5.1 Wiring Through `getAutoMemoryPromptForSession`

```javascript
// From chunks.192.mjs:65-72
if (Ka8.isTeamMemoryEnabled()) {
    let Y = Nw(),                    // private dir
        A = Ka8.getTeamMemPath();    // team dir
    return await Iu6(A),             // ensure team dir exists
           TW6(Y, { memory_type: "auto" }),   // metrics: count private memory load
           TW6(A, { memory_type: "team" }),   // metrics: count team memory load
           FtY.buildCombinedMemoryPrompt(z, K)
}
```

**What this shows**:
- The dispatcher *creates* the team dir if missing (`Iu6` = `ensureMemoryDirExists`). The prompt asserts "both dirs already exist," so the dispatcher has to make that true before generating the prompt.
- Both dirs get a `memoryDirLoadMetric` emitted at session start (memory_type label separates them).
- Only `BtY` is called — there is no separate "team prompt" function. Combined = the team variant.

---

## 6. End-to-End Injection Flow

Here is the complete data path for a single team memory item appearing in the LLM call:

```
[Disk]                                                  [Process]                          [LLM context]
~/.claude/projects/<repo>/memory/team/foo.md
    │
    │  (1) sync watcher pulls bytes from server
    │
    ▼
team/foo.md (on disk, mtimeMs=X)
    │
    │  (2) user sends a message
    │
    ▼
startRelevantMemoryPrefetch (chunks.155.mjs:2159)
    │
    │  (3) recallMemoryRequest returns hits
    │
    ▼
loadAndFormatRelevantMemories (chunks.155.mjs:2126)
    │  - reads each hit's bytes
    │  - calls memoryHeader(path, mtimeMs)        ◄── B97
    │  - stores header in the memory record
    │
    ▼
Attachment[] with type="relevant_memories"
    │
    │  (4) message construction pass
    │
    ▼
chunks.165.mjs:2549 — relevant_memories case      ◄── renderer
    │  - prelude on first non-synthesis hit
    │  - createUserMessage(isMeta:true)
    │  - wrapMessagesInSystemReminder
    │
    ▼
User-role messages tagged isMeta=true, wrapped <system-reminder>...</system-reminder>
    │
    │  (5) included in the next LLM call payload
    │
    ▼
Model sees:
<system-reminder>
Retrieved for possible relevance — use only if it actually applies to what the user asked.

Memory: /path/to/team/foo.md:

[file content]
</system-reminder>
```

Two related items run through the same renderer (`relevant_memories` case) but bypass parts of this flow:

- **Synthesis memories**: Path is `<synthesis:...>`, content is the distilled summary. The header is set at creation to `Recalled from your persistent memory system:` (skipping `memoryHeader`). Otherwise identical rendering.
- **CLAUDE.md / pre-loaded files**: Use the `nested_memory` channel (chunks.166.mjs:812) instead. Different message format (`Contents of <path>:\n\n<content>`), same isMeta+system-reminder envelope.

---

## 7. Cross-Cutting Considerations

### 7.1 Prompt-Cache Stability

The single most important property of this pipeline is that **rendering the same recall on a later turn produces byte-identical context**. The cache hit is what makes recall affordable. Two design choices defend this property:

1. **Stored header on the attachment**. `memoryHeader` is called *once* at attachment-creation time. The header text contains `memoryAge(mtimeMs)` (in v2.1.88) or the freshness caveat (in both versions), both of which depend on `Date.now()`. Recomputing at render time would shift `"today"` → `"yesterday"` mid-turn (or in v2.1.112's freshness caveat: shift `"3 days old"` → `"4 days old"`). Storing the header freezes the snapshot.

2. **`isMeta: true` for hiding from transcript views**. The transcript view filters on `isMeta`. The cache view does *not* — meta messages still occupy cache slots. The stable bytes property means a meta message rendered once is hit on every subsequent prompt.

### 7.2 Dedup

Two dedup mechanisms guard against re-injecting the same content:

- **`loadedNestedMemoryPaths`** (non-evicting Set) — for `nested_memory` (CLAUDE.md). Survives the LRU eviction in `readFileState`.
- **`bMY`** (`relevantMemoryConsumedTurns`, chunks.155.mjs:2161) — for `relevant_memories`. Per-turn guard so the prefetch only fires once per turn.

### 7.3 Synchronization Between Memory Bytes and `validateTeamMemWritePath`

When the agent writes via the Write tool to a team path:
1. `validateTeamMemWritePath` resolves and verifies the path is inside `team/`.
2. The write goes through; the file lands on disk with a new `mtimeMs`.
3. The next user turn fires `startRelevantMemoryPrefetch`, which calls `recallMemoryRequest`. The recall picks up the new file by its updated mtime.
4. `memoryHeader(path, mtimeMs)` is called with the fresh mtime → header reads "Memory: <path>:" (no staleness, since freshly written).
5. The `relevant_memories` attachment carries the new content into the next LLM call.

Round-trip time: typically one user turn. Faster if the file appears mid-turn (unlikely; writes are sequential within a turn).

---

## 8. Summary

The memory-to-conversation integration is a **three-channel pipeline** sharing one wrapper (`<system-reminder>` + `isMeta: true`):

1. **System prompt** (`buildCombinedMemoryPrompt` `BtY`) — names the directories, defines the scope vocabulary, embeds the 4-type taxonomy with `<scope>` guidance.
2. **`nested_memory`** (chunks.166.mjs:812) — eagerly-loaded files (CLAUDE.md), labeled `Contents of <path>:`.
3. **`relevant_memories`** (chunks.165.mjs:2549) — per-turn semantic recall, labeled via `memoryHeader` (`B97`).

The header function (`memoryHeader`) is the focal point: it freezes per-attachment bytes at creation time (prompt-cache stability), conditionally prepends a staleness caveat (≥2 days), and identifies the recalled bytes with a `Memory: <path>:` token. Synthesis memories override the header with `Recalled from your persistent memory system:`.

The v2.1.112 behavior diff from v2.1.88: the fresh-case fallback no longer carries `(saved X ago)`. The staleness caveat for ≥2-day-old memories is unchanged.
