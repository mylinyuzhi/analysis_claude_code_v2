# memdir.ts Deep Dive — v2.1.142

Deep deobfuscation of `src/memdir/memdir.ts` (v2.1.88 reference text matched against v2.1.142 obfuscated code in `cli_inner_pretty.js`). This file owns the entrypoint filename, the line/byte caps, the prompt-line builders, and the top-level `loadMemoryPrompt` dispatcher. The dispatcher gained two new branches in v2.1.142 (simple-system-prompt and CLAUDE_COWORK_MEMORY_GUIDELINES-verbatim) and lost the KAIROS daily-log branch.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) - New symbols added by this unit

Key functions and constants in this document:
- `ENTRYPOINT_NAME` (`xj`, alias `nh1`) - Constant `"MEMORY.md"` (cli_inner_pretty.js:141682, 139836)
- `MAX_ENTRYPOINT_LINES` (`jKH`) - Constant 200 (cli_inner_pretty.js:141683)
- `MAX_ENTRYPOINT_BYTES` (`d5$`) - Constant 25000 (cli_inner_pretty.js:142953)
- `AUTO_MEM_DISPLAY_NAME` (`TK6`) - Constant `"auto memory"` (cli_inner_pretty.js:142954)
- `DIR_EXISTS_GUIDANCE` (`JKH`) - String literal for prompt (cli_inner_pretty.js:141684)
- `DIRS_EXIST_GUIDANCE` (`B5$`) - Combined-mode literal (cli_inner_pretty.js:141686)
- `truncateEntrypointContent` (`oi$`) - 200L/25KB cap enforcer (cli_inner_pretty.js:142678-142716)
- `ensureMemoryDirExists` (`PKH`) - Idempotent recursive mkdir (cli_inner_pretty.js:142717-142725)
- `logMemoryDirCounts` (`jl`) - Fire-and-forget telemetry helper (cli_inner_pretty.js:142726-142742)
- `buildMemoryLines` (`VK6`) - Behavioral instructions builder (default / non-tiny path, cli_inner_pretty.js:142743-142804)
- `buildMemoryLinesTiny` (`yVK`) - Tiny single-dir variant (cli_inner_pretty.js:142167-142215)
- `buildCombinedMemoryPromptTiny` (`hVK`) - Tiny dual-dir variant (cli_inner_pretty.js:142216-142272)
- `buildSimpleMemoryPrompt` (`IVK`) - Simple-system-prompt one-block variant (cli_inner_pretty.js:142273-142312)
- `buildDreamPrompt` (`SVK`) - `/dream` offline-pruning prompt builder (cli_inner_pretty.js:142313-142340)
- `buildMemoryPrompt` (`mVK`) - Agent-memory variant with content inline (cli_inner_pretty.js:142805-142828)
- `buildSearchingPastContextSection` (`VZH`) - Optional "## Searching past context" block (cli_inner_pretty.js:142829-142854)
- `loadMemoryPrompt` (`c5$`) - Top-level dispatcher (cli_inner_pretty.js:142855-142927)
- `shouldUseSimpleSystemPrompt` (`BVK`) - Simple-prompt branch decider (cli_inner_pretty.js:142928-142934)
- `getSimpleAgentHeader` (`pVK`) - Simple-prompt one-line header (cli_inner_pretty.js:142935-142939)
- `buildAgentMemoryPrompt` (`UVK`) - Per-agent prompt entrypoint (cli_inner_pretty.js:142940-142951)

## File Map

| Block | What it owns | cli_inner_pretty.js lines |
|-------|--------------|---------------------------|
| Constants (entrypoint + caps + guidance) | `ENTRYPOINT_NAME`, `MAX_ENTRYPOINT_LINES`, `MAX_ENTRYPOINT_BYTES`, `AUTO_MEM_DISPLAY_NAME`, `DIR_EXISTS_GUIDANCE`, `DIRS_EXIST_GUIDANCE` | 141682-141687, 142953-142954 |
| `truncateEntrypointContent` | 200-line + 25 KB cap + contextual warning | 142678-142716 |
| `ensureMemoryDirExists` | Idempotent recursive mkdir | 142717-142725 |
| `logMemoryDirCounts` | Async file/subdir count telemetry | 142726-142742 |
| `buildMemoryLines` (`VK6`) | Build the behavioral instruction lines (default path) | 142743-142804 |
| `buildMemoryPrompt` (`mVK`) | Like `buildMemoryLines` plus MEMORY.md content | 142805-142828 |
| `buildMemoryLinesTiny` (`yVK`) | Tiny single-dir variant with `## Memory files` block | 142167-142215 |
| `buildCombinedMemoryPromptTiny` (`hVK`) | Tiny dual-dir variant | 142216-142272 |
| `buildSimpleMemoryPrompt` (`IVK`) | Simple-system-prompt one-block compact variant | 142273-142312 |
| `buildDreamPrompt` (`SVK`) | `/dream` offline-pruning prompt | 142313-142340 |
| `buildSearchingPastContextSection` | Optional grep-guidance section | 142829-142854 |
| `loadMemoryPrompt` | Top-level dispatcher | 142855-142927 |

## Constants

```javascript
// ============================================
// Memory entrypoint name and caps
// Location: cli_inner_pretty.js:141682-141687, 142953-142954
// ============================================

// ORIGINAL (for source lookup):
xj = "MEMORY.md"
jKH = 200
d5$ = 25000
TK6 = "auto memory"
JKH = "This directory already exists — write to it directly with the Write tool (do not run mkdir or check for its existence)."
B5$ = "Both directories already exist — write to them directly with the Write tool (do not run mkdir or check for their existence)."

// READABLE (for understanding):
export const ENTRYPOINT_NAME = 'MEMORY.md'
export const MAX_ENTRYPOINT_LINES = 200
// ~125 chars/line at 200 lines. At p97 today; catches long-line indexes that
// slip past the line cap (p100 observed: 197KB under 200 lines).
export const MAX_ENTRYPOINT_BYTES = 25_000
const AUTO_MEM_DISPLAY_NAME = 'auto memory'
export const DIR_EXISTS_GUIDANCE =
  'This directory already exists — write to it directly with the Write tool (do not run mkdir or check for its existence).'
export const DIRS_EXIST_GUIDANCE =
  'Both directories already exist — write to them directly with the Write tool (do not run mkdir or check for their existence).'

// Mapping: xj→ENTRYPOINT_NAME, jKH→MAX_ENTRYPOINT_LINES, d5$→MAX_ENTRYPOINT_BYTES,
//          TK6→AUTO_MEM_DISPLAY_NAME, JKH→DIR_EXISTS_GUIDANCE, B5$→DIRS_EXIST_GUIDANCE
```

The aliased copy `nh1 = "MEMORY.md"` (cli_inner_pretty.js:139836) lives inside the `paths.ts` chunk for use by `getAutoMemEntrypoint` (`YKH`). The two literal copies are an obfuscator quirk, not a contract — both refer to the same Markdown filename.

### Why a byte cap on top of the line cap

Identical reasoning to v2.1.112: with a 200-line cap **alone**, an index that uses single huge lines slips through (the v2.1.88 codebase notes a real observed p100 of 197 KB inside 200 lines). The 25 KB byte cap catches that pathological shape. Both fire, and `truncateEntrypointContent` distinguishes them in the warning message so the model knows which one to fix.

## `truncateEntrypointContent` (oi$)

### What it does

Reads raw `MEMORY.md` text, returns either:
- the trimmed content unchanged if both caps are respected, **or**
- a truncated version with a `> WARNING: …` line appended that names *which* cap triggered.

The returned object also carries the original `lineCount` and `byteCount`, plus `wasLineTruncated` / `wasByteTruncated` flags consumed by telemetry.

### How it works

1. **Trim and measure**: Compute `lineCount` (split on `\n`) and `byteCount` (`.length`) on the *trimmed* input. Trimming first means a file with trailing blank lines does not falsely trip the cap.
2. **Decide which caps fired**: Both checks run against the original measurements — `wasLineTruncated = lineCount > 200`, `wasByteTruncated = byteCount > 25000`.
3. **Fast path**: If neither fired, return the trimmed content with the flags both false.
4. **Line truncation**: If `wasLineTruncated`, slice the first 200 lines and rejoin. Otherwise keep the full trimmed text.
5. **Byte truncation on top of step 4**: If the post-line-truncation string still exceeds 25 KB, find the **last newline before the cap** (`lastIndexOf('\n', MAX_BYTES)`). Cut there if found; otherwise hard-cut at the byte cap.
6. **Compose the contextual warning**: Three forms based on which flags fired:
   - byte only: `"<byteCount> (limit: 25KB) — index entries are too long"`
   - line only: `"<N> lines (limit: 200)"`
   - both: `"<N> lines and <byteCount>"`
7. **Append warning + return**: The warning text is appended after a blank line and the prefix `> WARNING: MEMORY.md is `, ending with `…Keep index entries to one line under ~200 chars; move detail into topic files.`

### Why this approach

- **Line-first**: Sticking the line cap before the byte cap means truncation lands on a natural boundary in the common case. Byte-first would risk cutting mid-line.
- **Byte cut at last newline**: Even after the line cap, if a single line happens to be enormous, the slice ends at the last full newline rather than mid-character. This survives multi-byte UTF-8 (no half-codepoint hazard).
- **Distinct warning text per fail mode**: The model can act on the feedback — "your lines are too long, not too many" → restructure index entries; "your line count is too high" → split files. A single generic warning would teach less.
- **`> WARNING:` markdown blockquote**: Inside the rendered prompt this becomes a visually-distinct quoted line, signalling "this is meta, not part of your memory."

### Key insight

The warning is part of the model's *training signal at runtime*. By saying explicitly "move detail into topic files," the system teaches the model the architectural discipline (index-vs-detail) every time the file is too big, without needing a separate doc page or training cycle. This entire function is **bit-identical** to v2.1.112 — only the obfuscated names changed.

```javascript
// ============================================
// truncateEntrypointContent - Enforces 200-line + 25 KB caps with contextual warning
// Location: cli_inner_pretty.js:142678-142716
// ============================================

// ORIGINAL (for source lookup):
function oi$(H) {
    let $ = H.trim(),
        q = $.split(`\n`),
        K = q.length,
        _ = $.length,
        A = K > jKH,
        z = _ > d5$;
    if (!A && !z) return { content: $, lineCount: K, byteCount: _, wasLineTruncated: A, wasByteTruncated: z };
    let Y = A ? q.slice(0, jKH).join(`\n`) : $;
    if (Y.length > d5$) {
        let O = Y.lastIndexOf(`\n`, d5$);
        Y = Y.slice(0, O > 0 ? O : d5$);
    }
    let f = z && !A ? `${l7(_)} (limit: ${l7(d5$)}) — index entries are too long`
        : A && !z ? `${K} lines (limit: ${jKH})`
        : `${K} lines and ${l7(_)}`;
    return {
        content: Y + `\n\n> WARNING: ${xj} is ${f}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
        lineCount: K,
        byteCount: _,
        wasLineTruncated: A,
        wasByteTruncated: z,
    };
}

// READABLE (for understanding):
export function truncateEntrypointContent(raw) {
  const trimmed = raw.trim()
  const contentLines = trimmed.split('\n')
  const lineCount = contentLines.length
  const byteCount = trimmed.length

  const wasLineTruncated = lineCount > MAX_ENTRYPOINT_LINES
  const wasByteTruncated = byteCount > MAX_ENTRYPOINT_BYTES

  if (!wasLineTruncated && !wasByteTruncated) {
    return { content: trimmed, lineCount, byteCount, wasLineTruncated, wasByteTruncated }
  }

  let truncated = wasLineTruncated
    ? contentLines.slice(0, MAX_ENTRYPOINT_LINES).join('\n')
    : trimmed

  if (truncated.length > MAX_ENTRYPOINT_BYTES) {
    const cutAt = truncated.lastIndexOf('\n', MAX_ENTRYPOINT_BYTES)
    truncated = truncated.slice(0, cutAt > 0 ? cutAt : MAX_ENTRYPOINT_BYTES)
  }

  const reason =
    wasByteTruncated && !wasLineTruncated
      ? `${formatFileSize(byteCount)} (limit: ${formatFileSize(MAX_ENTRYPOINT_BYTES)}) — index entries are too long`
      : wasLineTruncated && !wasByteTruncated
        ? `${lineCount} lines (limit: ${MAX_ENTRYPOINT_LINES})`
        : `${lineCount} lines and ${formatFileSize(byteCount)}`

  return {
    content:
      truncated +
      `\n\n> WARNING: ${ENTRYPOINT_NAME} is ${reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
    lineCount,
    byteCount,
    wasLineTruncated,
    wasByteTruncated,
  }
}

// Mapping: oi$→truncateEntrypointContent, H→raw, $→trimmed, q→contentLines, K→lineCount,
//          _→byteCount, A→wasLineTruncated, z→wasByteTruncated, Y→truncated, O→cutAt,
//          f→reason, jKH→MAX_ENTRYPOINT_LINES, d5$→MAX_ENTRYPOINT_BYTES, l7→formatFileSize,
//          xj→ENTRYPOINT_NAME
```

## `ensureMemoryDirExists` (PKH)

### What it does

Idempotent recursive mkdir for the memory directory. Called from `loadMemoryPrompt` (once per session via the `systemPromptSection('memory', …)` cache) so the model can always write straight to the directory without first running `mkdir` or `ls`.

### How it works

1. Call `fs.mkdir(memoryDir)` — the implementation is recursive by default and already swallows `EEXIST` internally.
2. If it still throws, normalize the error (extract `code` via `O8`) and route it to `logForDebugging` with `{ level: 'debug' }`. No throw.

### Why this approach

- **Recursive + idempotent**: The full parent chain (`~/.claude/projects/<slug>/memory/`) is created in one call. No try/catch dance.
- **Errors are non-fatal**: If `EACCES` / `EPERM` / `EROFS` shows up, prompt building still proceeds. The model's eventual `Write` will surface the real permission error at the right level, and `FileWriteTool` independently creates the parent of the file it's writing.
- **Debug-level log, not warn**: This is a routine setup step. A `warn` here would spam logs on every prompt build that hits a non-default storage; debug stays out of the way unless `--debug` is on.

### Key insight

The model is told (in the prompt) that the directory "already exists — write to it directly." This is only true because `ensureMemoryDirExists` runs first. The two pieces (harness behavior + prompt text) have to stay in sync; the comment block at the top of the function in `memdir.ts` makes that contract explicit.

```javascript
// ============================================
// ensureMemoryDirExists - Idempotent recursive mkdir, swallows real errors as debug logs
// Location: cli_inner_pretty.js:142717-142725
// ============================================

// ORIGINAL (for source lookup):
async function PKH(H) {
  let $ = C$();
  try {
    await $.mkdir(H);
  } catch (q) {
    let K = O8(q);
    N(`ensureMemoryDirExists failed for ${H}: ${K ?? String(q)}`, { level: "debug" });
  }
}

// READABLE (for understanding):
export async function ensureMemoryDirExists(memoryDir) {
  const fs = getFsImplementation()
  try {
    await fs.mkdir(memoryDir)
  } catch (e) {
    const code = e instanceof Error && 'code' in e && typeof e.code === 'string' ? e.code : undefined
    logForDebugging(
      `ensureMemoryDirExists failed for ${memoryDir}: ${code ?? String(e)}`,
      { level: 'debug' },
    )
  }
}

// Mapping: PKH→ensureMemoryDirExists, H→memoryDir, $→fs, C$→getFsImplementation,
//          q→e, K→code, O8→errorCodeExtractor, N→logForDebugging
```

## `logMemoryDirCounts` (jl)

### What it does

Fire-and-forget telemetry emitter. Reads the directory, counts files vs subdirectories, and emits `tengu_memdir_loaded` with the counts merged into the caller-supplied `baseMetadata`.

### How it works

1. Call `fs.readdir(memoryDir)` and chain `.then(…, …)`. **No `await`** — control returns immediately.
2. Success branch: Iterate dirents, increment `fileCount` or `subdirCount` based on `isFile()` / `isDirectory()`. Emit `tengu_memdir_loaded` with counts merged into `baseMetadata`.
3. Failure branch: Directory unreadable → emit `tengu_memdir_loaded` with only the base metadata (no counts).

### Why this approach

- **Async, intentionally**: Prompt building must not block on a possibly slow filesystem (network mount, large directory). The synchronous prompt path returns; this telemetry catches up later.
- **Both branches emit the same event**: Downstream analytics can fold both into one funnel; the absence of count fields signals the failure case.

### Key insight

This is a **detached observation channel**, not a blocking step. Anything that needs counts (dashboards, debugging) gets them eventually; the prompt path never waits.

```javascript
// ============================================
// logMemoryDirCounts - Fire-and-forget file/subdir telemetry
// Location: cli_inner_pretty.js:142726-142742
// ============================================

// ORIGINAL (for source lookup):
function jl(H, $) {
  C$().readdir(H).then(
    (K) => {
      let _ = 0, A = 0;
      for (let z of K)
        if (z.isFile()) _++;
        else if (z.isDirectory()) A++;
      d("tengu_memdir_loaded", { ...$, total_file_count: _, total_subdir_count: A });
    },
    () => {
      d("tengu_memdir_loaded", $);
    },
  );
}

// READABLE (for understanding):
function logMemoryDirCounts(memoryDir, baseMetadata) {
  const fs = getFsImplementation()
  void fs.readdir(memoryDir).then(
    dirents => {
      let fileCount = 0
      let subdirCount = 0
      for (const d of dirents) {
        if (d.isFile()) fileCount++
        else if (d.isDirectory()) subdirCount++
      }
      logEvent('tengu_memdir_loaded', {
        ...baseMetadata,
        total_file_count: fileCount,
        total_subdir_count: subdirCount,
      })
    },
    () => {
      logEvent('tengu_memdir_loaded', baseMetadata)
    },
  )
}

// Mapping: jl→logMemoryDirCounts, H→memoryDir, $→baseMetadata, C$→getFsImplementation,
//          K→dirents, _→fileCount, A→subdirCount, z→dirent, d→logEvent
```

## `buildMemoryLines` (VK6) — Default Path

### What it does

Builds the **behavioral instruction body** that gets injected into the system prompt for the default (non-tiny) auto-memory path: the header (`# auto memory`), the directory-exists hint, the optional skill-bouncer or full "## Types of memory" section, the "## What NOT to save" section, the "## How to save memories" two-step section, the "## When to access" + "## Before recommending" sections, the memory-vs-plan-vs-tasks delineation, optional extra guidelines, and finally an optional "## Searching past context" block.

It explicitly **does not** include the `MEMORY.md` file content — `loadMemoryPrompt` (the system-prompt path) calls this and lets the content come in via a separate user-context message. `buildMemoryPrompt` (the agent-memory path, used when there's no `claudemd.ts` equivalent) calls this and then appends the content itself.

### Differences from v2.1.112

The body of `VK6` is largely the v2.1.112 prose. Three small refactors:

- **`memoryDir` is now nullable**. When `memoryDir` is falsy the function emits `"You have a persistent, file-based memory system. The directory path is provided in your session context."` instead of the literal path. This supports the simple-system-prompt branch where the agent's directory is provided indirectly.
- **The "Types of memory" section is conditional on the BOUNCER flag** (`ZZH(U5$)` — see `memory_types.md`). If `tengu_ochre_finch` is on (via `LK6()`), the function emits a compact 4-bullet pointer to the `memory-types` skill rather than the full XML taxonomy.
- **The 4th parameter `K` and 5th parameter `_`**: `K = skipIndex` is the same v2.1.112 flag (`tengu_moth_copse`), but `_` (the 5th parameter) is new — it controls whether the bouncer variant is allowed. Inside `mVK` (agent-memory) this is always set to `true`; inside `c5$` it is unset (so the bouncer can fire if the flag is on).

### How it works

Inputs: `displayName` (e.g. `"auto memory"`), `memoryDir` (or null), `extraGuidelines`, `skipIndex`, `forcePassThrough`.

1. **Build the "How to save memories" block**: Two variants, same as v2.1.112.
   - **Two-step variant** (`skipIndex === false`): Step 1 writes the memory file with frontmatter; Step 2 adds a pointer line to `MEMORY.md`.
   - **One-step variant** (`skipIndex === true`): Just write the memory file. No mention of `MEMORY.md`.
2. **Compose the main `lines: string[]`**:
   - `# ${displayName}` header
   - Either `"You have a persistent, file-based memory system at \`${memoryDir}\`. ${DIR_EXISTS_GUIDANCE}"` or `"You have a persistent, file-based memory system. The directory path is provided in your session context. ${DIR_EXISTS_GUIDANCE}"`
   - Persistent memory system blurb
   - The save-on-request / forget-on-request paragraph
   - Spread `...(forcePassThrough ? TYPES_SECTION_INDIVIDUAL : ZZH(TYPES_SECTION_INDIVIDUAL))` — when the 5th argument is true, always emit the full INDIVIDUAL taxonomy; otherwise allow the BOUNCER swap
   - Spread `...WHAT_NOT_TO_SAVE_SECTION` (`GZH`)
   - Spread `...howToSave` (the variant chosen above)
   - Spread `...WHEN_TO_ACCESS_SECTION` (`vVK`)
   - Spread `...TRUSTING_RECALL_SECTION` (`TZH` — header text `## Before recommending from memory`)
   - "## Memory and other forms of persistence" — when to use plan/tasks instead
   - Spread `...(extraGuidelines ?? [])`
3. **Append the optional search section** when `memoryDir` is non-null: `lines.push(...buildSearchingPastContextSection(memoryDir))` — gated by `tengu_coral_fern`.
4. **Return**: The full `string[]` array. Callers `.join('\n')` themselves so they can `.push(...)` more lines first.

### Why this approach

- **Two-variant "How to save"**: Same as v2.1.112 — the two-step pattern is the default; the single-step variant is feature-flagged.
- **Spread-style composition**: Each named section is a `readonly string[]` constant; the function flattens them. Trivially A/B-able via feature flags.
- **`displayName` parameter, not hardcoded**: Serves auto memory (`"auto memory"`), per-agent memory (`"Persistent Agent Memory"`).
- **`extraGuidelines` is just a string array**: When `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` is set, its value is pushed verbatim.
- **Null `memoryDir` for simple prompt**: Lets the same builder serve the path-provided-in-context variant — one source of truth for the body text.

### Key insight

`buildMemoryLines` is **declarative-by-template**: a flat composition of named sections. The actual prose is in `memoryTypes.ts` constants — moving sections in/out is a one-line `[..., ...SECTION, ...]` edit. The v2.1.142 refactor only added the conditional swaps (BOUNCER, null memoryDir) without changing this template-first design.

```javascript
// ============================================
// buildMemoryLines (default path) - Behavioral instruction body, no MEMORY.md content
// Location: cli_inner_pretty.js:142743-142804
// ============================================

// ORIGINAL (for source lookup):
function VK6(H, $, q, K = !1, _ = !1) {
  let A = K ? [/* one-step howToSave */] : [/* two-step howToSave */],
    z = [
      `# ${H}`,
      "",
      $ ? `You have a persistent, file-based memory system at \`${$}\`. ${JKH}`
        : `You have a persistent, file-based memory system. The directory path is provided in your session context. ${JKH}`,
      "",
      "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.",
      "",
      "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
      "",
      ...(_ ? U5$ : ZZH(U5$)),
      ...GZH,
      "",
      ...A,
      "",
      ...vVK,
      "",
      ...TZH,
      "",
      "## Memory and other forms of persistence",
      "Memory is one of several persistence mechanisms available to you ...",
      "- When to use or update a plan instead of memory: ...",
      "- When to use or update tasks instead of memory: ...",
      "",
      ...(q ?? []),
      "",
    ];
  if ($) z.push(...VZH($));
  return z;
}

// READABLE (for understanding):
export function buildMemoryLines(
  displayName,
  memoryDir,                 // optional; null for simple-system-prompt path
  extraGuidelines,
  skipIndex = false,
  forcePassThrough = false,  // true → emit full TYPES_SECTION_INDIVIDUAL even if BOUNCER is on
) {
  const howToSave = skipIndex
    ? buildOneStepHowToSave()
    : buildTwoStepHowToSave()

  const lines = [
    `# ${displayName}`,
    '',
    memoryDir
      ? `You have a persistent, file-based memory system at \`${memoryDir}\`. ${DIR_EXISTS_GUIDANCE}`
      : `You have a persistent, file-based memory system. The directory path is provided in your session context. ${DIR_EXISTS_GUIDANCE}`,
    '',
    "You should build up this memory system over time ...",
    '',
    'If the user explicitly asks you to remember something, save it immediately ...',
    '',
    ...(forcePassThrough ? TYPES_SECTION_INDIVIDUAL : maybeSwapToBouncer(TYPES_SECTION_INDIVIDUAL)),
    ...WHAT_NOT_TO_SAVE_SECTION,
    '',
    ...howToSave,
    '',
    ...WHEN_TO_ACCESS_SECTION,
    '',
    ...TRUSTING_RECALL_SECTION,
    '',
    '## Memory and other forms of persistence',
    'Memory is one of several persistence mechanisms ...',
    '- When to use or update a plan instead of memory: ...',
    '- When to use or update tasks instead of memory: ...',
    '',
    ...(extraGuidelines ?? []),
    '',
  ]
  if (memoryDir) lines.push(...buildSearchingPastContextSection(memoryDir))
  return lines
}

// Mapping: VK6→buildMemoryLines, H→displayName, $→memoryDir, q→extraGuidelines,
//          K→skipIndex, _→forcePassThrough, A→howToSave, z→lines, ZZH→maybeSwapToBouncer,
//          U5$→TYPES_SECTION_INDIVIDUAL, GZH→WHAT_NOT_TO_SAVE_SECTION,
//          vVK→WHEN_TO_ACCESS_SECTION, TZH→TRUSTING_RECALL_SECTION, VZH→buildSearchingPastContextSection,
//          JKH→DIR_EXISTS_GUIDANCE
```

## `buildMemoryPrompt` (mVK)

### What it does

Single-directory variant that includes `MEMORY.md` content inline. Used by agent memory (which has no `claudemd.ts` equivalent that would deliver the content via a separate user-context message). The auto-memory path uses `loadMemoryPrompt` → `buildMemoryLines` instead; the content comes through a separate context layer.

### How it works

1. Compose the entrypoint path: `memoryDir + ENTRYPOINT_NAME`.
2. `readFileSync(entrypoint, {encoding: 'utf-8'})` inside try/catch. Failure is silent — empty string means "no memory yet."
3. Call `buildMemoryLines(displayName, memoryDir, extraGuidelines, false, true)` — note the `forcePassThrough=true` argument: agent-memory always sees the full taxonomy, never the bouncer.
4. **Branch on content**:
   - **Non-empty (after trim)**: Pass through `truncateEntrypointContent` → get `{content, byteCount, lineCount, wasLineTruncated, wasByteTruncated}`. Compute `memoryType = (displayName === AUTO_MEM_DISPLAY_NAME ? 'auto' : 'agent')`. Fire telemetry with all four metric fields. Push `"## MEMORY.md"`, `""`, and the truncated content into the lines array.
   - **Empty**: Push `"## MEMORY.md"`, `""`, and the placeholder text.
5. Join and return as a single string.

### Why this approach

- **Sync read**: Prompt building is synchronous overall. Async here would propagate up the call chain unnecessarily.
- **Silent read failure**: A missing file is not an error — it's the brand-new-user state. The placeholder text in the empty branch tells the model exactly what's going on.
- **`memoryType` tagged telemetry**: The same path serves auto memory and per-agent memory; the analytics field disambiguates.
- **`forcePassThrough=true`**: Agent-memory contexts have a single fixed prompt — the BOUNCER (skill-pointer) variant is incompatible because the agent may not have the `memory-types` skill loaded. Forcing the full taxonomy keeps agent memory self-sufficient.

### Key insight

The split between `buildMemoryPrompt` (returns string, includes content) and `buildMemoryLines` (returns array, no content) is intentional: callers that have access to a separate content-delivery channel (auto memory funnels MEMORY.md through a separate user-context message in `claudemd.ts`) use the array form; callers that don't (agent memory) use the string form.

```javascript
// ============================================
// buildMemoryPrompt - Agent-memory variant with MEMORY.md content inline
// Location: cli_inner_pretty.js:142805-142828
// ============================================

// ORIGINAL (for source lookup):
function mVK(H) {
  let { displayName: $, memoryDir: q, extraGuidelines: K } = H,
    _ = C$(),
    A = q + xj,
    z = "";
  try {
    z = _.readFileSync(A, { encoding: "utf-8" });
  } catch {}
  let Y = VK6($, q, K, !1, !0);
  if (z.trim()) {
    let f = oi$(z),
      O = $ === TK6 ? "auto" : "agent";
    jl(q, {
      content_length: f.byteCount,
      line_count: f.lineCount,
      was_truncated: f.wasLineTruncated,
      was_byte_truncated: f.wasByteTruncated,
      memory_type: O,
    });
    Y.push(`## ${xj}`, "", f.content);
  } else Y.push(`## ${xj}`, "", `Your ${xj} is currently empty. When you save new memories, they will appear here.`);
  return Y.join(`\n`);
}

// READABLE (for understanding):
export function buildMemoryPrompt(params) {
  const { displayName, memoryDir, extraGuidelines } = params
  const fs = getFsImplementation()
  const entrypoint = memoryDir + ENTRYPOINT_NAME

  let entrypointContent = ''
  try {
    entrypointContent = fs.readFileSync(entrypoint, { encoding: 'utf-8' })
  } catch {
    // No memory file yet
  }

  const lines = buildMemoryLines(
    displayName,
    memoryDir,
    extraGuidelines,
    /* skipIndex */ false,
    /* forcePassThrough */ true,   // agent-memory always sees the full taxonomy
  )

  if (entrypointContent.trim()) {
    const t = truncateEntrypointContent(entrypointContent)
    const memoryType = displayName === AUTO_MEM_DISPLAY_NAME ? 'auto' : 'agent'
    logMemoryDirCounts(memoryDir, {
      content_length: t.byteCount,
      line_count: t.lineCount,
      was_truncated: t.wasLineTruncated,
      was_byte_truncated: t.wasByteTruncated,
      memory_type: memoryType,
    })
    lines.push(`## ${ENTRYPOINT_NAME}`, '', t.content)
  } else {
    lines.push(
      `## ${ENTRYPOINT_NAME}`,
      '',
      `Your ${ENTRYPOINT_NAME} is currently empty. When you save new memories, they will appear here.`,
    )
  }
  return lines.join('\n')
}

// Mapping: mVK→buildMemoryPrompt, H→params, $→displayName, q→memoryDir, K→extraGuidelines,
//          _→fs, A→entrypoint, z→entrypointContent, Y→lines, f→t (truncationResult),
//          O→memoryType, C$→getFsImplementation, oi$→truncateEntrypointContent,
//          VK6→buildMemoryLines, jl→logMemoryDirCounts, xj→ENTRYPOINT_NAME, TK6→AUTO_MEM_DISPLAY_NAME
```

## `buildMemoryLinesTiny` (yVK) — Tiny Single-Dir Variant

### What it does

Same role as `buildMemoryLines`, but for the tiny-memory mode (single fact per file, no `MEMORY.md` index, wikilinks for cross-references). Selected when `gM()` (`tengu_billiard_aviary`) is true and team memory is off.

### How it works

The structure is largely the same as `VK6`, but four sections are different:

1. **The "## How to save memories" block is single-step only** — no two-step `MEMORY.md` index step, because the tiny variant abandons the manual index entirely.
2. **A new "## Memory files" block** appears between the intro paragraphs and the types section:
   - `### Granularity` — "Each memory file should contain one paragraph about a single fact ... Avoid writing one very long paragraph"
   - `### Immutability` — "Memory files should be treated as immutable. You should never edit a memory file in-place ... Instead, delete any memory files that have become stale or invalid and create new memory files in their place."
3. **Types section uses `ZK6`** (the tiny INDIVIDUAL variant) — drops the `reference` type from prompt examples; adds `<body_structure>` blocks with "One fact per file. Lead with the fact directly. No extra prose."
4. **A new "## Recalled memories in tool results" block** (`EVK`) appears between WHEN_TO_ACCESS and TRUSTING_RECALL — tells the model that `<system-reminder>`-wrapped recall blocks are background context, not user instructions.

The save-side prompt also uses the new wikilink-enabled frontmatter (`kVK`):

```
---
name: {{short-kebab-case-slug}}
description: {{one-line summary — used to decide relevance during recall}}
metadata:
  type: {{user, feedback, project}}    ← note: 'reference' missing from prompt
---

{{memory body — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines. Link related memories with [[their-name]].}}
```

The trailing `jK6` line is the wikilink helper:

> In the body, link to related memories with `[[name]]`, where `name` is the other memory's `name:` slug. Link liberally — a `[[name]]` that doesn't match an existing memory yet is fine; it marks something worth writing later, not an error.

### Why this approach

- **No index = no maintenance burden**: With tiny memories, the "two-step write" of v2.1.112 (write file + add pointer to `MEMORY.md`) becomes "one-step write." The index file is no longer kept in sync because there is no index file to keep in sync.
- **One fact per file = better retrieval**: With small files, `scanMemoryFiles` in synthesis mode (full-body manifest) can show the model literal fact text rather than just descriptions. This makes the recall layer more accurate without LLM intervention.
- **Wikilinks = lightweight graph**: When the model writes `[[deadline-2026-q1]]` inside one memory, it both creates a discoverability hook (a future `findRelevantMemories` query for "Q1 deadline" can pick up the linker by keyword overlap) and a forward-reference (the model can write `[[deadline-2026-q1]]` in a feedback memory before the deadline memory itself exists — the comment in `jK6` explicitly says "a `[[name]]` that doesn't match an existing memory yet is fine").
- **Immutability rule**: Files are append-only as a category but **never edit-in-place**. The dream-pruning agent (`SVK`) is responsible for stale-deletion; in-session edits would race with the synthesis cache (which keys on `mtimeMs` and could re-fetch the same file with different bytes during a single turn).

### Key insight

The tiny variant is a **content-addressed memory store** with deletion-only mutation. The model's prompt encodes this contract explicitly ("treat as immutable"), so the runtime doesn't need write locks or version vectors — just delete-and-rewrite as the canonical update path. The wikilinks layer adds a soft graph on top; the system doesn't validate them, but their existence is the prompt's discoverability tool.

## `buildCombinedMemoryPromptTiny` (hVK) — Tiny Dual-Dir Variant

### What it does

Tiny-memory dual-directory variant. Selected when `gM()` is true **and** team memory is enabled. Mirrors `hVK`'s body sections (Memory files / Memory scope / COMBINED types / how-to-save / when-to-access / recalled-in-tools / trusting-recall / persistence-comparison / extra-guidelines / search) using `GK6` (the tiny COMBINED types variant with `<scope>` tags).

### Notable differences from non-tiny `fS1.buildCombinedMemoryPrompt`

1. Same `## Memory files / Granularity / Immutability` block as `yVK`.
2. Same wikilink frontmatter (`kVK`) but the `metadata.type` example shows the COMBINED scope choices.
3. Same `## Recalled memories in tool results` block (`EVK`).
4. The `## How to save memories` block uses the tiny variant prose ("Write each memory to its own file in the chosen directory ...").

The team scope rules and the anti-secrets line are unchanged.

## `buildSimpleMemoryPrompt` (IVK) — Simple-System-Prompt Variant

### What it does

A **substantially shorter** memory prompt used when `LY()` (the simple-system-prompt flag, gated on `tengu_vellum_lantern` and certain models like opus-4-7) is true and tiny-memory is **off**. Compresses the entire memory section into a single Markdown blob — no `<types>` XML, no per-type `<examples>` blocks.

### How it works

The prompt structure is:

1. `# Memory` header.
2. One-paragraph orientation line giving the directory path(s) — single or dual depending on team-mem.
3. Inline frontmatter example (using the wikilink-enabled `kVK`).
4. A wikilink helper line (`jK6.join("\n")`).
5. A compressed scope-and-type description: ``"`user` — who the user is (role, expertise, preferences). `feedback` — guidance the user has given..."`` (single paragraph, no XML).
6. Optional team-mem qualifier ("`user` memories are always private; default `feedback` to private...").
7. Optional `MEMORY.md` pointer instructions (only if `skipIndex` is false).
8. A condensed "what NOT to save" + "drift caveat" paragraph baked into one sentence at the end.

Then the extra-guidelines (cowork) get appended if provided, and the search-section is included if `tengu_coral_fern` is on.

### Why this approach

- **Simple system prompt = aggressive token cuts**: The flag exists to make Claude Code prompts dramatically shorter for high-volume / cost-sensitive deployments. Memory was historically the second-largest section (after tool descriptions); collapsing it to ~30 lines instead of ~200 is a major lever.
- **Information density over readability**: The XML/example structure of the full memory prompt is for the model's clarity; in simple mode, the assumption is that the model has been trained recently on this prompt format and doesn't need worked examples to recognize the types.
- **All-or-nothing**: The simple memory prompt does not support the bouncer (skill-pointer) variant — the skill itself isn't loaded in simple-prompt sessions.

### Key insight

The simple memory prompt and the full prompt are **not** content-equivalent — the simple form has *less guidance*. The trade-off is acknowledged in the comment-less production code: simpler prompts cost fewer tokens but the model may miss edge-case behaviors (the `## What NOT to save` "save the surprising part" rule, the staleness "trust what you observe now" rule, etc.).

## `buildDreamPrompt` (SVK) — Offline Pruning Prompt

### What it does

Builds the **pruning prompt** used by the `/dream` slash command — a fork-style offline run that walks the memory directory and asks the model to delete stale / duplicate memories. Distinct from the auto-memory prompt because the dream agent's mandate is "compress", not "save."

### How it works

The prompt:

1. `# Dream: Memory Pruning` header.
2. Explains the job ("delete stale or invalidated memories, and collapse duplicates").
3. Names the memory directory path and asserts `DIR_EXISTS_GUIDANCE`.
4. Repeats the **immutability** rule ("never edit them in place. Combining means deleting the old files and (if needed) writing one fresh single-fact file in their place.").
5. Three-rule decision matrix per file: **Stale or invalidated** / **Duplicate or near-duplicate** / **Still good**.
6. For combined memories, instructs the model to **copy the `created:` date from the oldest source memory's frontmatter** so manifest sort order stays accurate.
7. If team memory is enabled, a special team caveat: "**`team/` subdirectory** — these memories are shared across teammates; other people's sessions write here. Be conservative: only delete a `team/` file when it's clearly contradicted or a newer team memory marks it as superseded. Do NOT delete a team memory just because you don't recognize it or it isn't relevant to your recent sessions — a teammate may rely on it. Do not move personal memories into `team/`."
8. Optional additional context block from the caller.

### Why this approach

- **Pruning needs its own mental model**: The auto-memory prompt teaches the model "when to save"; the dream prompt teaches "when to delete." Same taxonomy, opposite verb. Conflating them would lead to mid-conversation deletes which is exactly what the immutability rule wants to prevent.
- **Team-memory conservatism by default**: Without the explicit "don't delete team memories you don't recognize" rule, a single user's `/dream` could nuke another teammate's work. The prompt is engineered to be paranoid about team writes.
- **`created:` date preservation**: When two files are merged, the surviving file should carry the *oldest* `created:` date so it sorts in the manifest where the model previously expected it. Otherwise a merge re-dates the fact and the model's recall behavior shifts.

### Key insight

`SVK` is a **prompt for a different agent**, not part of the system-prompt-builder flow. The dream agent uses this as its *user message* (the slash command implementation injects it as a fork-mode input). That's why it includes the directory path literally — it's a one-shot, not a long-lived session.

## `loadMemoryPrompt` (c5$) — The Dispatcher

### What it does

Top-level entry point used by `systemPromptSection('memory', …)`. Returns `string | null`. Routes to the correct prompt builder based on **five** runtime conditions (was three in v2.1.112): auto-enablement (`isAutoMemoryEnabled`), the cowork verbatim env var, the simple-system-prompt feature, the tiny-memory flag, and team-mem.

### How it works

1. Read the gates: `autoEnabled = isAutoMemoryEnabled()`, plus the env var `CLAUDE_COWORK_MEMORY_GUIDELINES`.
2. **Cowork verbatim branch** (`autoEnabled && CLAUDE_COWORK_MEMORY_GUIDELINES set + non-empty`):
   - Ensure auto dir exists, fire telemetry, mark `memory_load_prompt` perf.
   - Return literal `\`# auto memory\\n${envVar.trim()}\``. **No taxonomy, no guidance, no search.** This is for SDK / Cowork deployments that want full control of the memory section text.
3. Compute `skipIndex = tengu_moth_copse(false)`, `extraGuidelines = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES ? [envVar] : undefined`.
4. **Simple + auto + not tiny + team-mem-resolved branch** (`autoEnabled && !gM() && LY(model)`):
   - Resolve auto dir, plus team dir if `isTeamMemoryEnabled()`.
   - Ensure either team-or-auto dir.
   - Fire telemetry (auto dir, and team dir if present).
   - Return `IVK(autoDir, teamDir, skipIndex, buildSearchingPastContextSection(autoDir), extraGuidelines)`.
5. **Simple + auto + tiny branch** (`autoEnabled && gM()`):
   - Resolve auto dir.
   - If team-mem enabled → ensure team dir, fire both telemetry, return `hVK(autoDir, teamDir, buildSearchingPastContextSection(autoDir), extraGuidelines)`.
   - Else → ensure auto dir, fire telemetry, return `yVK("auto memory", autoDir, buildSearchingPastContextSection(autoDir), extraGuidelines).join("\n")`.
6. **Team-mem (non-tiny, non-simple) branch** (`isTeamMemoryEnabled()`):
   - Resolve auto + team dirs.
   - Ensure team dir, fire both telemetry.
   - Return `OS1.buildCombinedMemoryPrompt(extraGuidelines, skipIndex)`.
7. **Single auto-memory branch** (`autoEnabled`):
   - Resolve auto dir, ensure it, fire telemetry.
   - Return `VK6("auto memory", autoDir, extraGuidelines, skipIndex).join("\n")`.
8. **Disabled branch** (fall-through):
   - Emit `tengu_memdir_disabled` with two flags: `disabled_by_env_var` and `disabled_by_setting`.
   - If the user is in the team-mem cohort (`tengu_herring_clock`), emit `tengu_team_memdir_disabled`.
   - Return `null`.

### Major changes from v2.1.112

The biggest delta is **structural**, not algorithmic — five branches instead of three:

- **NEW: cowork verbatim** (`CLAUDE_COWORK_MEMORY_GUIDELINES`) takes precedence over all other auto-mode paths. Useful for SDK callers that pass an entire `# auto memory` body via env var.
- **NEW: simple-system-prompt + non-tiny** routes to `IVK` instead of `VK6` — a much shorter prompt.
- **NEW: tiny variants** (`yVK` / `hVK`) — both single-dir and dual-dir.
- **REMOVED: KAIROS daily-log branch** — no longer dispatched here. The `logs/YYYY/MM/YYYY-MM-DD.md` path layout only appears in the `/dream` skill asset.
- **PRESERVED: team-mem non-tiny non-simple** — same `OS1.buildCombinedMemoryPrompt` as v2.1.112's `FtY.buildCombinedMemoryPrompt`.
- **PRESERVED: default auto-only** — same `VK6.buildMemoryLines` body as v2.1.112's `neK`.

### Why this approach

- **Branch order matters**: The cowork verbatim branch is first because it is the most explicit operator intent (env var). Simple-prompt is second because it is a global agent flag. Tiny is third because it is a session-level experiment flag. Team-mem is fourth because it is a project-level setting. Single auto is the default.
- **Five branches, not five functions**: Inlining the dispatch keeps the precedence visible at a single call site. A registry-style "memory prompt strategies" abstraction would obscure the priority order, which is itself a contract.
- **`autoEnabled` gates everything but the disabled-telemetry block**: If memory is off, none of the dispatch paths fire. The disabled-telemetry block always fires at the bottom so analytics see the off-state.
- **Team-mem requires auto-mem**: `isTeamMemoryEnabled` itself returns false if `isAutoMemoryEnabled` is false (see [team_memory.md](./team_memory.md)), so the team-mem branch can only enter when `autoEnabled` is already true.
- **`ensureMemoryDirExists(teamDir)` is enough for non-tiny team-mem because `teamDir = autoDir/team`**: Recursive mkdir creates autoDir as a side effect. For tiny mode, the auto dir uses `tiny_memory/` instead of `memory/`, but the team dir still nests under it.
- **Telemetry firing pattern**: `logMemoryDirCounts` is called for *every* directory used in the chosen branch — auto for non-team, both auto and team for dual-dir branches. This makes the `total_file_count` analytics per-directory rather than per-session-aggregate.

### Key insight

`loadMemoryPrompt` in v2.1.142 is the **only place** that decides which memory paradigm a session is in: cowork-verbatim, simple-prompt, tiny-with-team, tiny-without-team, full team, full single, or no memory. Once it returns, no later code reconsiders. The dispatch is **first-match-wins**: the simple-system-prompt branch (step 4) and the tiny branch (step 5) check `LY()` separately, so a session can be in "simple-non-tiny" *or* "any-tiny" but not "simple-tiny" — there is no merged "simple-and-tiny" prompt. Reading the branch precedence is the only way to know the runtime behavior of a particular flag combination.

```javascript
// ============================================
// loadMemoryPrompt - Top-level dispatcher for the system-prompt memory section
// Location: cli_inner_pretty.js:142855-142927
// ============================================

// ORIGINAL (for source lookup):
async function c5$(H) {
  let $ = x9(),
    q = process.env.CLAUDE_COWORK_MEMORY_GUIDELINES;
  if ($ && q && q.trim()) {
    let z = UY();
    return (await PKH(z), jl(z, { memory_type: "auto" }), RH("memory_load_prompt"),
      `# auto memory\n${q.trim()}`);
  }
  let K = Z$("tengu_moth_copse", !1),
    _ = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES,
    A = _ && _.trim().length > 0 ? [_] : void 0;
  if ($ && !gM() && LY(H)) {
    let z = UY(),
      f = vZH.isTeamMemoryEnabled() ? vZH.getTeamMemPath() : null;
    if ((await PKH(f ?? z), jl(z, { memory_type: "auto" }), f)) jl(f, { memory_type: "team" });
    return (RH("memory_load_prompt"), IVK(z, f, K, VZH(z), A));
  }
  if ($ && gM()) {
    let z = UY();
    if (vZH.isTeamMemoryEnabled()) {
      let f = vZH.getTeamMemPath();
      return (await PKH(f), jl(z, { memory_type: "auto" }), jl(f, { memory_type: "team" }),
        RH("memory_load_prompt"), hVK(z, f, VZH(z), A));
    }
    return (await PKH(z), jl(z, { memory_type: "auto" }), RH("memory_load_prompt"),
      yVK("auto memory", z, VZH(z), A).join(`\n`));
  }
  if (vZH.isTeamMemoryEnabled()) {
    let z = UY(),
      Y = vZH.getTeamMemPath();
    return (await PKH(Y), jl(z, { memory_type: "auto" }), jl(Y, { memory_type: "team" }),
      RH("memory_load_prompt"), OS1.buildCombinedMemoryPrompt(A, K));
  }
  if ($) {
    let z = UY();
    return (await PKH(z), jl(z, { memory_type: "auto" }), RH("memory_load_prompt"),
      VK6("auto memory", z, A, K).join(`\n`));
  }
  if ((d("tengu_memdir_disabled", {
    disabled_by_env_var: bH(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
    disabled_by_setting: !bH(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && m6().autoMemoryEnabled === !1,
  }),
    Z$("tengu_herring_clock", !1)))
    d("tengu_team_memdir_disabled", {});
  return null;
}

// READABLE (for understanding):
export async function loadMemoryPrompt(modelId) {
  const autoEnabled = isAutoMemoryEnabled()
  const coworkOverride = process.env.CLAUDE_COWORK_MEMORY_GUIDELINES

  // 1. COWORK verbatim — full operator control, no taxonomy, no guidance
  if (autoEnabled && coworkOverride && coworkOverride.trim()) {
    const autoDir = getAutoMemPath()
    await ensureMemoryDirExists(autoDir)
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    markPerfBoundary('memory_load_prompt')
    return `# auto memory\n${coworkOverride.trim()}`
  }

  const skipIndex = getFeatureValue_CACHED_MAY_BE_STALE('tengu_moth_copse', false)
  const coworkExtra = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES
  const extraGuidelines = coworkExtra && coworkExtra.trim().length > 0 ? [coworkExtra] : undefined

  // 2. SIMPLE + AUTO + NOT TINY — compressed memory section for high-volume deployments
  if (autoEnabled && !isTinyMemoryEnabled() && isSimpleSystemPromptEnabled(modelId)) {
    const autoDir = getAutoMemPath()
    const teamDir = teamMemPaths.isTeamMemoryEnabled() ? teamMemPaths.getTeamMemPath() : null
    await ensureMemoryDirExists(teamDir ?? autoDir)
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    if (teamDir) logMemoryDirCounts(teamDir, { memory_type: 'team' })
    markPerfBoundary('memory_load_prompt')
    return buildSimpleMemoryPrompt(autoDir, teamDir, skipIndex, buildSearchingPastContextSection(autoDir), extraGuidelines)
  }

  // 3. TINY-MEMORY VARIANT
  if (autoEnabled && isTinyMemoryEnabled()) {
    const autoDir = getAutoMemPath()
    if (teamMemPaths.isTeamMemoryEnabled()) {
      const teamDir = teamMemPaths.getTeamMemPath()
      await ensureMemoryDirExists(teamDir)
      logMemoryDirCounts(autoDir, { memory_type: 'auto' })
      logMemoryDirCounts(teamDir, { memory_type: 'team' })
      markPerfBoundary('memory_load_prompt')
      return buildCombinedMemoryPromptTiny(autoDir, teamDir, buildSearchingPastContextSection(autoDir), extraGuidelines)
    }
    await ensureMemoryDirExists(autoDir)
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    markPerfBoundary('memory_load_prompt')
    return buildMemoryLinesTiny('auto memory', autoDir, buildSearchingPastContextSection(autoDir), extraGuidelines).join('\n')
  }

  // 4. TEAM-MEM (non-tiny, non-simple) — combined private + team
  if (teamMemPaths.isTeamMemoryEnabled()) {
    const autoDir = getAutoMemPath()
    const teamDir = teamMemPaths.getTeamMemPath()
    await ensureMemoryDirExists(teamDir)        // recursive — also creates autoDir
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    logMemoryDirCounts(teamDir, { memory_type: 'team' })
    markPerfBoundary('memory_load_prompt')
    return teamMemPrompts.buildCombinedMemoryPrompt(extraGuidelines, skipIndex)
  }

  // 5. SINGLE AUTO-MEMORY (default)
  if (autoEnabled) {
    const autoDir = getAutoMemPath()
    await ensureMemoryDirExists(autoDir)
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    markPerfBoundary('memory_load_prompt')
    return buildMemoryLines('auto memory', autoDir, extraGuidelines, skipIndex).join('\n')
  }

  // 6. DISABLED
  logEvent('tengu_memdir_disabled', {
    disabled_by_env_var: isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
    disabled_by_setting:
      !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
      getInitialSettings().autoMemoryEnabled === false,
  })
  if (getFeatureValue_CACHED_MAY_BE_STALE('tengu_herring_clock', false)) {
    logEvent('tengu_team_memdir_disabled', {})
  }
  return null
}

// Mapping: c5$→loadMemoryPrompt, H→modelId, $→autoEnabled, q→coworkOverride, K→skipIndex,
//          _→coworkExtra, A→extraGuidelines, z→autoDir, Y/f→teamDir (varies by branch),
//          x9→isAutoMemoryEnabled, UY→getAutoMemPath, PKH→ensureMemoryDirExists,
//          jl→logMemoryDirCounts, RH→markPerfBoundary, Z$→getFeatureValue_CACHED_MAY_BE_STALE,
//          gM→isTinyMemoryEnabled, LY→isSimpleSystemPromptEnabled, IVK→buildSimpleMemoryPrompt,
//          hVK→buildCombinedMemoryPromptTiny, yVK→buildMemoryLinesTiny,
//          OS1→teamMemPromptsModule, VK6→buildMemoryLines, vZH→teamMemPaths,
//          d→logEvent, bH→isEnvTruthy, m6→getInitialSettings
```

## `shouldUseSimpleSystemPrompt` (BVK) and `getSimpleAgentHeader` (pVK)

Two small helpers used by `buildAgentMemoryPrompt` (`UVK`) and other agent-context loaders.

```javascript
// ============================================
// shouldUseSimpleSystemPrompt - Compose four gates for the simple-prompt branch
// Location: cli_inner_pretty.js:142928-142934
// ============================================

// ORIGINAL (for source lookup):
function BVK(H) {
  if (!x9()) return !1;
  if (gM()) return !1;
  if (vZH.isTeamMemoryEnabled()) return !1;
  if (LY(H)) return !1;
  return !0;
}

// READABLE (for understanding):
function shouldUseFullMemoryForAgent(modelId) {
  // True only when ALL of the following hold:
  //   - auto-memory is enabled
  //   - tiny-memory is OFF
  //   - team-memory is OFF
  //   - simple-system-prompt is OFF
  if (!isAutoMemoryEnabled()) return false
  if (isTinyMemoryEnabled()) return false
  if (teamMemPaths.isTeamMemoryEnabled()) return false
  if (isSimpleSystemPromptEnabled(modelId)) return false
  return true
}

// Mapping: BVK→shouldUseFullMemoryForAgent, H→modelId
```

Despite the misleading name, this predicate returns `true` only when **none** of the simple/tiny/team flags are set — that is, when the *full* default memory prompt should be used. It is essentially "is this session in the v2.1.112-baseline default mode?"

```javascript
// ============================================
// getSimpleAgentHeader - One-line agent memory header for simple-prompt branch
// Location: cli_inner_pretty.js:142935-142939
// ============================================

// ORIGINAL (for source lookup):
function pVK(H) {
  if (!BVK(H)) return null;
  return VK6(TK6, null, void 0, !1).join(`\n`);
}

// READABLE (for understanding):
function getSimpleAgentHeader(modelId) {
  if (!shouldUseFullMemoryForAgent(modelId)) return null
  return buildMemoryLines(
    AUTO_MEM_DISPLAY_NAME,
    /* memoryDir */ null,    // path will be provided in context, not literal
    /* extraGuidelines */ undefined,
    /* skipIndex */ false,
  ).join('\n')
}

// Mapping: pVK→getSimpleAgentHeader
```

When the session is in the full-default mode, `getSimpleAgentHeader` emits the standard memory body — but with **`null` memoryDir**, so the header line says "the directory path is provided in your session context" instead of a literal path. This lets the agent be reused across multiple memory-dir scopes within one process.

## `buildAgentMemoryPrompt` (UVK)

Final caller — the entry point used by agent loaders. Routes to either `loadMemoryPrompt` (full memory section) or a one-line agent memory header (path + cowork extras + search), depending on `shouldUseFullMemoryForAgent`.

```javascript
// ============================================
// buildAgentMemoryPrompt - Agent context entrypoint
// Location: cli_inner_pretty.js:142940-142951
// ============================================

// ORIGINAL (for source lookup):
async function UVK(H) {
  if (!BVK(H)) return c5$(H);
  let $ = UY();
  await PKH($);
  jl($, { memory_type: "auto" });
  let q = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES,
    K = [`# ${TK6}`, `Memory directory: \`${$}\``];
  if (q && q.trim().length > 0) K.push("", q);
  let _ = VZH($);
  if (_.length > 0) K.push("", ..._);
  return K.join(`\n`);
}

// READABLE (for understanding):
export async function buildAgentMemoryPrompt(modelId) {
  // If session uses ANY non-default memory mode (tiny / team / simple-system-prompt),
  // emit the full per-mode memory prompt via the main dispatcher.
  if (!shouldUseFullMemoryForAgent(modelId)) {
    return loadMemoryPrompt(modelId)
  }

  // Otherwise (full-default mode) emit a minimal agent header — just enough to
  // tell the agent where memory lives. The agent inherits its own memory body
  // from the lead session's system prompt.
  const autoDir = getAutoMemPath()
  await ensureMemoryDirExists(autoDir)
  logMemoryDirCounts(autoDir, { memory_type: 'auto' })
  const coworkExtra = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES
  const lines = [
    `# ${AUTO_MEM_DISPLAY_NAME}`,
    `Memory directory: \`${autoDir}\``,
  ]
  if (coworkExtra && coworkExtra.trim().length > 0) {
    lines.push('', coworkExtra)
  }
  const searchLines = buildSearchingPastContextSection(autoDir)
  if (searchLines.length > 0) {
    lines.push('', ...searchLines)
  }
  return lines.join('\n')
}

// Mapping: UVK→buildAgentMemoryPrompt, H→modelId, $→autoDir, q→coworkExtra, K→lines, _→searchLines,
//          BVK→shouldUseFullMemoryForAgent, UY→getAutoMemPath, PKH→ensureMemoryDirExists,
//          jl→logMemoryDirCounts, TK6→AUTO_MEM_DISPLAY_NAME, VZH→buildSearchingPastContextSection,
//          c5$→loadMemoryPrompt
```

The interesting case is the **inverted condition**: when `shouldUseFullMemoryForAgent` is `false` (i.e., any non-default mode), the agent gets the **full memory dispatcher output** — the entire memory section, taxonomy and all. When the predicate is `true` (full-default mode), the agent only needs a one-line header (it inherits the body from the lead).

This is the v2.1.142 way of handling agents that may run in a sub-session: tiny/team/simple sessions need explicit memory teaching because their agents may not see the lead's system prompt; full-default sessions can lean on the lead and just need the agent to know "where" memory is.

## Cross-Validation: v2.1.88 → v2.1.142

Algorithmic invariants confirmed by reading the obfuscated chunks:

| Invariant | v2.1.88 src | v2.1.142 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `ENTRYPOINT_NAME = 'MEMORY.md'` | memdir.ts:34 | `xj = "MEMORY.md"` at cli_inner_pretty.js:141682 | Yes |
| `MAX_ENTRYPOINT_LINES = 200` | memdir.ts:35 | `jKH = 200` at cli_inner_pretty.js:141683 | Yes |
| `MAX_ENTRYPOINT_BYTES = 25_000` | memdir.ts:38 | `d5$ = 25000` at cli_inner_pretty.js:142953 | Yes |
| Truncation: line-first then byte-at-last-newline | memdir.ts:78-85 | `oi$` cli_inner_pretty.js:142688-142698 | Yes |
| Contextual warning text (3 variants by which flag fired) | memdir.ts:87-92 | cli_inner_pretty.js:142699-142704 | Yes |
| Empty-file placeholder string | memdir.ts:311 | cli_inner_pretty.js:142825 | Yes |
| `'auto memory'` display name literal | memdir.ts:39 | `TK6 = "auto memory"` cli_inner_pretty.js:142954 | Yes |
| `memory_type` telemetry tag is `'auto'` or `'agent'` | memdir.ts:297 | cli_inner_pretty.js:142816 | Yes |
| `tengu_memdir_disabled` payload shape | memdir.ts:493-498 | cli_inner_pretty.js:142919-142922 | Yes |
| `DIR_EXISTS_GUIDANCE` text | memdir.ts:116-117 | `JKH` cli_inner_pretty.js:141684-141685 | Yes |
| `DIRS_EXIST_GUIDANCE` text | memdir.ts:118-119 | `B5$` cli_inner_pretty.js:141686-141687 | Yes |

The control flow, identifiers, and constants are stable across all three versions (v2.1.88, v2.1.112, v2.1.142). The new v2.1.142 dispatch branches all sit *outside* the bit-equivalent inner kernel. See [cross_validation.md](./cross_validation.md) for the full delta.
