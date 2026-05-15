# memdir.ts Deep Dive — v2.1.112

Deep deobfuscation of `src/memdir/memdir.ts` (507 lines in v2.1.88, structurally identical in v2.1.112). This file owns the entrypoint filename, the line/byte caps, the prompt-line builders, and the top-level `loadMemoryPrompt` dispatcher.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory belongs here once promoted)
> - [symbol_additions_unit_03.md](../00_overview/symbol_additions_unit_03.md) - New symbols added by this unit

Key functions and constants in this document:
- `ENTRYPOINT_NAME` (`YW` / `SE_`) - Constant `"MEMORY.md"` (chunks.153.mjs:2139, chunks.64.mjs:1374)
- `MAX_ENTRYPOINT_LINES` (`Ve`) - Constant 200 (chunks.153.mjs:2141)
- `MAX_ENTRYPOINT_BYTES` (`Zz8`) - Constant 25000 (chunks.192.mjs:90)
- `AUTO_MEM_DISPLAY_NAME` (`ptY`) - Constant `"auto memory"` (chunks.192.mjs:92)
- `DIR_EXISTS_GUIDANCE` (`FM6`) - String literal for prompt (chunks.153.mjs:2143)
- `DIRS_EXIST_GUIDANCE` (`sd8`) - Combined-mode literal (chunks.153.mjs:2145)
- `truncateEntrypointContent` (`eU1`) - 200L/25KB cap enforcer (chunks.191.mjs:3119)
- `ensureMemoryDirExists` (`Iu6`) - Idempotent recursive mkdir (chunks.191.mjs:3153)
- `logMemoryDirCounts` (`TW6`) - Fire-and-forget telemetry helper (chunks.191.mjs:3165)
- `buildMemoryLines` (`neK`) - Behavioral instructions builder (chunks.192.mjs:3)
- `buildMemoryPrompt` (`ieK`) - Agent-memory variant with content inline (chunks.192.mjs:9)
- `loadMemoryPrompt` (`fz8`) - Top-level dispatcher (chunks.192.mjs:45)
- `buildSearchingPastContextSection` (`Dz8`) - Optional "## Searching past context" block (chunks.192.mjs:36)
- `buildAssistantDailyLogPrompt` (KAIROS branch) - Daily-log variant (lives in fz8 directly in v2.1.112)

## File Map

| Block | What it owns | v2.1.88 lines | v2.1.112 chunks |
|-------|--------------|---------------|------------------|
| Constants | `ENTRYPOINT_NAME`, `MAX_ENTRYPOINT_LINES`, `MAX_ENTRYPOINT_BYTES`, `AUTO_MEM_DISPLAY_NAME`, `DIR_EXISTS_GUIDANCE`, `DIRS_EXIST_GUIDANCE` | 34-39, 116-119 | chunks.153.mjs:2139-2145, chunks.192.mjs:90-92 |
| `truncateEntrypointContent` | 200-line + 25 KB cap + contextual warning | 57-103 | chunks.191.mjs:3119-3151 |
| `ensureMemoryDirExists` | Idempotent recursive mkdir | 129-147 | chunks.191.mjs:3153-3163 |
| `logMemoryDirCounts` | Async file/subdir count telemetry | 153-185 | chunks.191.mjs:3165-3180 |
| `buildMemoryLines` | Build the behavioral instruction lines | 199-266 | chunks.192.mjs:3 |
| `buildMemoryPrompt` | Like `buildMemoryLines` plus MEMORY.md content | 272-316 | chunks.192.mjs:9-34 |
| `buildAssistantDailyLogPrompt` | KAIROS daily-log variant | 327-370 | inline inside `fz8` in v2.1.112 |
| `buildSearchingPastContextSection` | Optional grep-guidance section | 375-407 | chunks.192.mjs:36-43 |
| `loadMemoryPrompt` | Top-level dispatcher | 419-507 | chunks.192.mjs:45-86 |

## Constants

```javascript
// ============================================
// Memory entrypoint name and caps
// Location: chunks.153.mjs:2139-2145, chunks.192.mjs:90-92 (v2.1.88: memdir.ts:34-39)
// ============================================

// ORIGINAL (for source lookup):
YW = "MEMORY.md"
Ve = 200
Zz8 = 25000
ptY = "auto memory"
FM6 = "This directory already exists — write to it directly with the Write tool (do not run mkdir or check for its existence)."
sd8 = "Both directories already exist — write to them directly with the Write tool (do not run mkdir or check for their existence)."

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

// Mapping: YW→ENTRYPOINT_NAME, Ve→MAX_ENTRYPOINT_LINES, Zz8→MAX_ENTRYPOINT_BYTES,
//          ptY→AUTO_MEM_DISPLAY_NAME, FM6→DIR_EXISTS_GUIDANCE, sd8→DIRS_EXIST_GUIDANCE
```

### Why a byte cap on top of the line cap

The `~125 chars/line` comment in the source spells out the reasoning. With a 200-line cap **alone**, an index that uses single huge lines slips through — the 88 codebase notes a real observed p100 of 197 KB inside 200 lines. The 25 KB byte cap exists to catch that pathological shape. It does **not** replace the line cap; both fire, and `truncateEntrypointContent` distinguishes them in the warning message so the model knows which one to fix.

## `truncateEntrypointContent` (eU1)

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

The warning is part of the model's *training signal*. By saying explicitly "move detail into topic files," the system teaches the model the architectural discipline (index-vs-detail) every time the file is too big, without needing a separate doc page or training cycle.

```javascript
// ============================================
// truncateEntrypointContent - Enforces 200-line + 25 KB caps with contextual warning
// Location: chunks.191.mjs:3119-3151 (v2.1.88: memdir.ts:57-103)
// ============================================

// ORIGINAL (for source lookup):
function eU1(q) {
    let K = q.trim(),
        _ = K.split(`
`),
        z = _.length,
        Y = K.length,
        A = z > Ve,
        O = Y > Zz8;
    if (!A && !O) return { content: K, lineCount: z, byteCount: Y, wasLineTruncated: A, wasByteTruncated: O };
    let w = A ? _.slice(0, Ve).join(`
`) : K;
    if (w.length > Zz8) {
        let j = w.lastIndexOf(`
`, Zz8);
        w = w.slice(0, j > 0 ? j : Zz8)
    }
    let $ = O && !A ? `${o4(Y)} (limit: ${o4(Zz8)}) — index entries are too long` : A && !O ? `${z} lines (limit: ${Ve})` : `${z} lines and ${o4(Y)}`;
    return {
        content: w + `

> WARNING: ${YW} is ${$}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
        lineCount: z,
        byteCount: Y,
        wasLineTruncated: A,
        wasByteTruncated: O
    }
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

// Mapping: eU1→truncateEntrypointContent, q→raw, K→trimmed, _→contentLines, z→lineCount,
//          Y→byteCount, A→wasLineTruncated, O→wasByteTruncated, w→truncated, j→cutAt,
//          $→reason, Ve→MAX_ENTRYPOINT_LINES, Zz8→MAX_ENTRYPOINT_BYTES, o4→formatFileSize
```

## `ensureMemoryDirExists` (Iu6)

### What it does

Idempotent recursive mkdir for the memory directory. Called from `loadMemoryPrompt` (once per session via the `systemPromptSection('memory', …)` cache) so the model can always write straight to the directory without first running `mkdir` or `ls`.

### How it works

1. Call `fs.mkdir(memoryDir)` — the implementation is recursive by default and already swallows `EEXIST` internally.
2. If it still throws, normalize the error (extract `code` if present) and route it to `logForDebugging` with `{ level: 'debug' }`. No throw.

### Why this approach

- **Recursive + idempotent**: The full parent chain (`~/.claude/projects/<slug>/memory/`) is created in one call. No try/catch dance.
- **Errors are non-fatal**: If `EACCES` / `EPERM` / `EROFS` shows up, prompt building still proceeds. The model's eventual `Write` will surface the real permission error at the right level, and `FileWriteTool` independently creates the parent of the file it's writing.
- **Debug-level log, not warn**: This is a routine setup step. A `warn` here would spam logs on every prompt build that hits a non-default storage; debug stays out of the way unless `--debug` is on.

### Key insight

The model is told (in the prompt) that the directory "already exists — write to it directly." This is only true because `ensureMemoryDirExists` runs first. The two pieces (harness behavior + prompt text) have to stay in sync; the comment block at the top of the function makes that contract explicit.

```javascript
// ============================================
// ensureMemoryDirExists - Idempotent recursive mkdir, swallows real errors as debug logs
// Location: chunks.191.mjs:3153-3163 (v2.1.88: memdir.ts:129-147)
// ============================================

// ORIGINAL (for source lookup):
async function Iu6(q) {
    let K = V8();
    try { await K.mkdir(q) } catch (_) {
        let z = Q1(_);
        E(`ensureMemoryDirExists failed for ${q}: ${z??String(_)}`, { level: "debug" })
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

// Mapping: Iu6→ensureMemoryDirExists, q→memoryDir, K→fs, V8→getFsImplementation,
//          _→e, z→code, Q1→errorCodeExtractor, E→logForDebugging
```

## `logMemoryDirCounts` (TW6)

### What it does

Fire-and-forget telemetry emitter. Reads the directory, counts files vs subdirectories, and emits `tengu_memdir_loaded` with the counts merged into the caller-supplied `baseMetadata` (typically `{memory_type, content_length, line_count, was_truncated, was_byte_truncated}`).

### How it works

1. Call `fs.readdir(memoryDir)` and chain `.then(…, …)`. **No `await`** — control returns immediately.
2. Success branch: Iterate dirents, increment `fileCount` or `subdirCount` based on `isFile()` / `isDirectory()`. Emit `tengu_memdir_loaded` with counts.
3. Failure branch: Directory unreadable → emit `tengu_memdir_loaded` with only the base metadata (no counts).

### Why this approach

- **Async, intentionally**: Prompt building must not block on a possibly slow filesystem (network mount, large directory). The synchronous prompt path returns; this telemetry catches up later.
- **`void fs.readdir(…)…`**: The `void` is explicit — the v2.1.88 source uses it to silence lint warnings about discarded promises. Errors in either branch are absorbed by the rejection handler so an unhandled-rejection never propagates.
- **Both branches emit the same event**: Downstream analytics can fold both into one funnel; the absence of count fields signals the failure case.

### Key insight

This is a **detached observation channel**, not a blocking step. Anything that needs counts (dashboards, debugging) gets them eventually; the prompt path never waits.

## `buildMemoryLines` (neK)

### What it does

Builds the **behavioral instruction body** that gets injected into the system prompt: the header (`# auto memory`), the directory-exists hint, the "## Types of memory" section, the "## What NOT to save" section, the "## How to save memories" two-step section, the "## When to access" + "## Before recommending" sections, the memory-vs-plan-vs-tasks delineation, optional extra guidelines, and finally an optional "## Searching past context" block.

It explicitly **does not** include the `MEMORY.md` file content — `loadMemoryPrompt` (the system-prompt path) calls this and lets the content come in via a separate user-context message. `buildMemoryPrompt` (the agent-memory path, used when there's no `getClaudeMds()` equivalent) calls this and then appends the content itself.

### How it works

Inputs: `displayName` (e.g. `"auto memory"` or `"Persistent Agent Memory"`), `memoryDir`, optional `extraGuidelines` array, and `skipIndex` boolean (gated by the `tengu_moth_copse` feature flag).

1. **Build the "How to save memories" block**: Two variants.
   - **Two-step variant** (`skipIndex === false`): Step 1 writes the memory file with frontmatter; Step 2 adds a pointer line to `MEMORY.md`. Mentions the 200-line truncation, the format `- [Title](file.md) — one-line hook`, the rule that `MEMORY.md` has no frontmatter, and the no-duplicates rule.
   - **One-step variant** (`skipIndex === true`): Just write the memory file. No mention of `MEMORY.md`. The `tengu_moth_copse` flag is the kill-switch for the index discipline — when it's on, the model writes single-fact files and downstream tooling (`findRelevantMemories`) handles retrieval without an index.
2. **Compose the main `lines: string[]`**:
   - `# ${displayName}` header
   - Persistent memory system blurb with the directory path and `DIR_EXISTS_GUIDANCE`
   - "build up this memory system over time" purpose paragraph
   - The save-on-request / forget-on-request paragraph
   - Spread `...TYPES_SECTION_INDIVIDUAL` (or `bC4` / `IC4` variant depending on team-mode)
   - Spread `...WHAT_NOT_TO_SAVE_SECTION`
   - Spread `...howToSave` (the variant chosen above)
   - Spread `...WHEN_TO_ACCESS_SECTION` (includes the drift caveat)
   - Spread `...TRUSTING_RECALL_SECTION` ("Before recommending from memory" — eval-validated header wording)
   - "## Memory and other forms of persistence" — when to use plan/tasks instead
   - Spread `...(extraGuidelines ?? [])` for cowork / SDK extras
3. **Append the optional search section**: `lines.push(...buildSearchingPastContextSection(memoryDir))` — gated by `tengu_coral_fern`.
4. **Return**: The full `string[]` array. Callers `.join('\n')` themselves so they can `.push(...)` more lines first.

### Why this approach

- **Two-variant "How to save"**: The two-step pattern (write file + add index line) is the default, but it imposes an extra turn per save. The single-step variant (`skipIndex`) is a feature-flagged experiment for measuring whether the index is worth the cost. Splitting the variants in code rather than at the call site keeps the prompt text colocated.
- **Spread-style composition**: Each named section is a `readonly string[]` constant; the function flattens them. This makes it trivial to A/B individual sections via feature flags without restructuring the function.
- **`displayName` parameter, not hardcoded**: The same builder serves auto memory (`"auto memory"`), persistent agent memory (`"Persistent Agent Memory"` via `buildAgentMemoryPrompt`), and KAIROS daily-log mode (different displayName, different builder altogether). The displayName is the only header text that needs to change.
- **`extraGuidelines` is just a string array**: When `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` is set, its value is pushed verbatim. Cowork can extend the memory policy without forking the builder.

### Key insight

`buildMemoryLines` is **declarative-by-template**: it's mostly a flat composition of named sections. The actual prose is in `memoryTypes.ts` constants — moving sections in/out is a one-line `[..., ...SECTION, ...]` edit.

## `buildMemoryPrompt` (ieK)

### What it does

Single-directory variant that includes `MEMORY.md` content inline. Used by agent memory (which has no `claudemd.ts` equivalent that would deliver the content via a separate user-context message). The auto-memory path uses `loadMemoryPrompt` → `buildMemoryLines` instead; the content comes through a separate context layer.

### How it works

1. Compose the entrypoint path: `memoryDir + ENTRYPOINT_NAME` (note: trailing-sep is already on `memoryDir` from `getAutoMemPath`, so this is `…/memory/MEMORY.md`).
2. `readFileSync(entrypoint, {encoding: 'utf-8'})` inside try/catch. Failure is silent — empty string means "no memory yet."
3. Call `buildMemoryLines(displayName, memoryDir, extraGuidelines)` to get the behavioral instructions.
4. **Branch on content**:
   - **Non-empty (after trim)**: Pass through `truncateEntrypointContent` → get `{content, byteCount, lineCount, wasLineTruncated, wasByteTruncated}`. Compute `memoryType = (displayName === AUTO_MEM_DISPLAY_NAME ? 'auto' : 'agent')`. Fire telemetry with all four metric fields. Push `"## MEMORY.md"`, `""`, and the truncated content into the lines array.
   - **Empty**: Push `"## MEMORY.md"`, `""`, and the placeholder text `"Your MEMORY.md is currently empty. When you save new memories, they will appear here."`
5. Join and return as a single string.

### Why this approach

- **Sync read**: Prompt building is synchronous overall. Async here would propagate up the call chain unnecessarily.
- **Silent read failure**: A missing file is not an error — it's the brand-new-user state. The placeholder text in the empty branch tells the model exactly what's going on.
- **`memoryType` tagged telemetry**: The same path serves auto memory and per-agent memory; the analytics field disambiguates.
- **Caller controls join**: The function returns a finished string (unlike `buildMemoryLines` which returns the array). That's the contract — caller can't tweak sections after the fact.

### Key insight

The split between `buildMemoryPrompt` (returns string, includes content) and `buildMemoryLines` (returns array, no content) is intentional: callers that have access to a separate content-delivery channel (the auto-memory loader funnels MEMORY.md through `getClaudeMds()` analogues in user context) use the array form; callers that don't (agent memory) use the string form.

```javascript
// ============================================
// buildMemoryPrompt - Single-directory variant with MEMORY.md content inline
// Location: chunks.192.mjs:9-34 (v2.1.88: memdir.ts:272-316)
// ============================================

// ORIGINAL (for source lookup):
function ieK(q) {
    let { displayName: K, memoryDir: _, extraGuidelines: z } = q, Y = V8(), A = _ + YW, O = "";
    try { O = Y.readFileSync(A, { encoding: "utf-8" }) } catch {}
    let w = neK(K, _, z);
    if (O.trim()) {
        let $ = eU1(O), j = K === ptY ? "auto" : "agent";
        TW6(_, { content_length: $.byteCount, line_count: $.lineCount, was_truncated: $.wasLineTruncated, was_byte_truncated: $.wasByteTruncated, memory_type: j }),
        w.push(`## ${YW}`, "", $.content)
    } else w.push(`## ${YW}`, "", `Your ${YW} is currently empty. When you save new memories, they will appear here.`);
    return w.join(`
`)
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

  const lines = buildMemoryLines(displayName, memoryDir, extraGuidelines)

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

// Mapping: ieK→buildMemoryPrompt, q→params, K→displayName, _→memoryDir, z→extraGuidelines,
//          Y→fs, A→entrypoint, O→entrypointContent, w→lines, $→t (truncationResult),
//          j→memoryType, V8→getFsImplementation, eU1→truncateEntrypointContent,
//          neK→buildMemoryLines, TW6→logMemoryDirCounts, YW→ENTRYPOINT_NAME, ptY→AUTO_MEM_DISPLAY_NAME
```

## `loadMemoryPrompt` (fz8) — The Dispatcher

### What it does

Top-level entry point used by `systemPromptSection('memory', …)`. Returns `string | null`. Routes to the correct prompt builder based on three feature gates: auto-enablement (`isAutoMemoryEnabled`), KAIROS daily-log mode (`feature('KAIROS') && getKairosActive()`), and team memory (`feature('TEAMMEM') && isTeamMemoryEnabled()`).

### How it works

1. Read the gates: `autoEnabled = isAutoMemoryEnabled()`, `skipIndex = getFeatureValue('tengu_moth_copse', false)`.
2. Read cowork extras: `coworkExtraGuidelines` from `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` env var; coerce to `[…]` if non-empty.
3. **KAIROS branch** (`feature('KAIROS') && autoEnabled && getKairosActive()`):
   - This branch **takes precedence over TEAMMEM**. Append-only daily logs do not compose with team sync (which expects a shared `MEMORY.md` that both sides read+write).
   - Telemetry: `logMemoryDirCounts(getAutoMemPath(), { memory_type: 'auto' })`.
   - Return `buildAssistantDailyLogPrompt(skipIndex)`.
4. **Team-mem branch** (`feature('TEAMMEM') && teamMemPaths.isTeamMemoryEnabled()`):
   - Resolve `autoDir = getAutoMemPath()`, `teamDir = teamMemPaths.getTeamMemPath()`.
   - `ensureMemoryDirExists(teamDir)` — recursive mkdir; since `teamDir` is defined as `join(autoDir, 'team')`, this creates `autoDir` as a side effect.
   - Telemetry for both directories.
   - Return `teamMemPrompts.buildCombinedMemoryPrompt(extraGuidelines, skipIndex)`.
5. **Single auto-memory branch** (`autoEnabled`):
   - Resolve `autoDir = getAutoMemPath()`.
   - `ensureMemoryDirExists(autoDir)`.
   - Telemetry.
   - Return `buildMemoryLines('auto memory', autoDir, extraGuidelines, skipIndex).join('\n')`.
6. **Disabled branch** (fall-through):
   - Emit `tengu_memdir_disabled` with two flags: `disabled_by_env_var` (was the env var truthy?) and `disabled_by_setting` (was env not truthy AND `autoMemoryEnabled === false` in settings?).
   - If the user is in the team-mem cohort (`getFeatureValue('tengu_herring_clock', false)`), emit `tengu_team_memdir_disabled` so the gate-on/team-disabled population is countable.
   - Return `null`.

### Why this approach

- **KAIROS precedence**: KAIROS rewrites where new memories *go* (append-only logs) but keeps `MEMORY.md` as the distilled index (still loaded via `claudemd.ts`). Team sync doesn't fit because team sync expects bidirectional writes to a single shared file. Gating on `autoEnabled` first means the disabled-telemetry block in step 6 still fires correctly if a KAIROS user has the auto-mem env-var off.
- **Team-mem requires auto-mem**: `isTeamMemoryEnabled()` itself returns false if `isAutoMemoryEnabled()` is false, so there's no "team-only" branch.
- **`ensureMemoryDirExists(teamDir)` only**: Because `teamDir = join(autoDir, 'team')`, recursive mkdir creates the auto dir for free. The source comment flags this dependency explicitly so a future refactor that moves the team dir doesn't silently leave the auto dir uncreated.
- **Two disabled flags**: Splitting `disabled_by_env_var` from `disabled_by_setting` separates "user/admin actively turned it off" from "deployment context didn't enable it." Both are useful for product decisions.
- **`tengu_herring_clock` gate on `tengu_team_memdir_disabled`**: This is "would have been in the team-mem cohort if auto-mem had been on." Without the cohort check, the team-disabled signal would dominate-by-default for every user.

### Key insight

`loadMemoryPrompt` is the **only place** that decides which memory paradigm a session is in: append-only logs (KAIROS), shared private+team (TEAMMEM), single private (default), or no memory at all. Once it returns, no later code reconsiders. This makes the gate truly authoritative — there are no race conditions between concurrent reads, no inconsistency between what the model thinks is true and what the filesystem reflects.

```javascript
// ============================================
// loadMemoryPrompt - Top-level dispatcher for the system-prompt memory section
// Location: chunks.192.mjs:45-86 (v2.1.88: memdir.ts:419-507)
// ============================================

// ORIGINAL (for source lookup):
async function fz8() {
    let q = x3(),
        K = u8("tengu_moth_copse", !1),
        _ = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES,
        z = _ && _.trim().length > 0 ? [_] : void 0;
    if (q && wH()) {
        // (KAIROS branch — buildAssistantDailyLogPrompt is inlined here in v2.1.112)
        // ...
    }
    if (Ka8.isTeamMemoryEnabled()) {
        let Y = Nw(), A = Ka8.getTeamMemPath();
        return await Iu6(A), TW6(Y, { memory_type: "auto" }), TW6(A, { memory_type: "team" }),
               FtY.buildCombinedMemoryPrompt(z, K)
    }
    if (q) {
        let Y = Nw();
        return await Iu6(Y), TW6(Y, { memory_type: "auto" }),
               neK("auto memory", Y, z, K).join(`
`)
    }
    if (d("tengu_memdir_disabled", {
        disabled_by_env_var: S6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !S6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && v7().autoMemoryEnabled === !1
    }), u8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}

// READABLE (for understanding):
export async function loadMemoryPrompt() {
  const autoEnabled = isAutoMemoryEnabled()
  const skipIndex = getFeatureValue_CACHED_MAY_BE_STALE('tengu_moth_copse', false)

  // KAIROS takes precedence over TEAMMEM (append-only logs don't compose with team sync).
  if (feature('KAIROS') && autoEnabled && getKairosActive()) {
    logMemoryDirCounts(getAutoMemPath(), { memory_type: 'auto' })
    return buildAssistantDailyLogPrompt(skipIndex)
  }

  const coworkExtra = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES
  const extraGuidelines = coworkExtra && coworkExtra.trim().length > 0 ? [coworkExtra] : undefined

  if (feature('TEAMMEM') && teamMemPaths.isTeamMemoryEnabled()) {
    const autoDir = getAutoMemPath()
    const teamDir = teamMemPaths.getTeamMemPath()
    await ensureMemoryDirExists(teamDir) // recursive — creates autoDir too
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    logMemoryDirCounts(teamDir, { memory_type: 'team' })
    return teamMemPrompts.buildCombinedMemoryPrompt(extraGuidelines, skipIndex)
  }

  if (autoEnabled) {
    const autoDir = getAutoMemPath()
    await ensureMemoryDirExists(autoDir)
    logMemoryDirCounts(autoDir, { memory_type: 'auto' })
    return buildMemoryLines('auto memory', autoDir, extraGuidelines, skipIndex).join('\n')
  }

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

// Mapping: fz8→loadMemoryPrompt, q→autoEnabled, K→skipIndex, _→coworkExtra, z→extraGuidelines,
//          Y/A→autoDir/teamDir, x3→isAutoMemoryEnabled, wH→getKairosActive,
//          Ka8→teamMemPaths module, FtY→teamMemPrompts module, Nw→getAutoMemPath,
//          Iu6→ensureMemoryDirExists, TW6→logMemoryDirCounts, neK→buildMemoryLines,
//          d→logEvent, u8→getFeatureValue, S6→isEnvTruthy, v7→getInitialSettings
```

## KAIROS Daily-Log Variant

In v2.1.88 this is a named function `buildAssistantDailyLogPrompt` (memdir.ts:327-370). In v2.1.112 the literal text is inlined inside `fz8` (chunks.192.mjs) since this branch only has one caller.

### Algorithm

1. Resolve `memoryDir = getAutoMemPath()`.
2. Compose a **pattern** path, not a literal date: `join(memoryDir, 'logs', 'YYYY', 'MM', 'YYYY-MM-DD.md')`. The literal date would be wrong for cached prompts that cross midnight.
3. Tell the model:
   - "This session is long-lived. Append to today's daily log file (path pattern above)."
   - "Substitute today's date from `currentDate` in your context."
   - "When the date rolls over mid-session, start appending to the new day's file."
   - "Each entry: a short timestamped bullet. Create file + parent dirs on first write."
   - "Do not rewrite or reorganize the log — it is append-only."
   - "A separate nightly process distills these logs into `MEMORY.md` and topic files."
4. Spread `...WHAT_NOT_TO_SAVE_SECTION` to keep the no-derivable-content discipline.
5. If `!skipIndex`, mention that `MEMORY.md` is still loaded via separate machinery — read it for orientation but don't edit it.
6. Append `...buildSearchingPastContextSection(memoryDir)`.

### Why the path is a pattern

The whole `loadMemoryPrompt` result is cached by `systemPromptSection('memory', …)`. If the prompt **inlined** today's literal date (`/logs/2026/05/2026-05-15.md`), the cache would either bust on every midnight rollover (defeating the cache) or stay stale (telling the model to append to yesterday's file). The pattern form pushes the date binding into the model: it reads `currentDate` from the user-context attachment (which *does* update across midnight via a `date_change` mechanism) and computes the path itself.

The KAIROS branch is therefore **the one place** where the source explicitly trades a literal-but-easier-to-cache value for a more dynamic one. The comment on the function spells this out.

## Cross-Validation: v2.1.88 → v2.1.112

Algorithmic invariants confirmed by reading the obfuscated chunks:

| Invariant | v2.1.88 src | v2.1.112 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `ENTRYPOINT_NAME = 'MEMORY.md'` | memdir.ts:34 | `YW = "MEMORY.md"` at chunks.153.mjs:2139 | Yes |
| `MAX_ENTRYPOINT_LINES = 200` | memdir.ts:35 | `Ve = 200` at chunks.153.mjs:2141 | Yes |
| `MAX_ENTRYPOINT_BYTES = 25_000` | memdir.ts:38 | `Zz8 = 25000` at chunks.192.mjs:90 | Yes |
| Truncation: line-first then byte-at-last-newline | memdir.ts:78-85 | `eU1` chunks.191.mjs:3134-3140 | Yes |
| Contextual warning text (3 variants by which flag fired) | memdir.ts:87-92 | chunks.191.mjs:3141 | Yes |
| Empty-file placeholder string | memdir.ts:311 | chunks.192.mjs:31 | Yes |
| `'auto memory'` display name literal | memdir.ts:39 | `ptY = "auto memory"` chunks.192.mjs:92 | Yes |
| `memory_type` telemetry tag is `'auto'` or `'agent'` | memdir.ts:297 | chunks.192.mjs:23 | Yes |
| `tengu_memdir_disabled` payload shape | memdir.ts:493-498 | chunks.192.mjs:81-83 | Yes |

The control flow, identifiers, and constants are stable across the two versions. The only real delta is that `buildAssistantDailyLogPrompt` is inlined inside `loadMemoryPrompt` in v2.1.112 rather than being a separate symbol.
