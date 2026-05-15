# Frontmatter Parsing and Cross-References — v2.1.112

How memory files' YAML frontmatter is parsed, how `name` / `description` / `type` (and `created` / `last_read`) are validated, and what the system does with bare-Markdown `[Title](file.md)` links inside `MEMORY.md`. Includes the explicit "no wikilinks" finding.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_unit_03.md](../00_overview/symbol_additions_unit_03.md) - New symbols from this unit

Key functions and constants:
- `parseFrontmatter` (`p2`) - Generic YAML frontmatter parser, used everywhere (chunks.80.mjs:2422)
- `parseMemoryType` (`CC4`) - Validates `frontmatter.type` against the 4-element taxonomy (chunks.99.mjs:516)
- `parseISODateOrNull` (`dMz`) - Validates `frontmatter.created` as `YYYY-MM-DD` (chunks.99.mjs:542)
- `scanMemoryFiles` (`t88`) - Memory dir scan that calls `parseFrontmatter` per file (chunks.99.mjs:553)
- `formatMemoryManifest` (`e88`) - Renders headers as a manifest for the model (chunks.99.mjs:587)
- `MEMORY_FRONTMATTER_EXAMPLE` (`mh6` / `MkK`) - The frontmatter template baked into the system prompt (chunks.99.mjs / chunks.153.mjs:2198)

## The Generic Parser: `parseFrontmatter` (p2)

### What it does

Takes a raw file string and (optionally) the file path for error messages. Returns `{frontmatter: object, content: string}` — the frontmatter dict (empty if absent or unparseable) and the body without the frontmatter block.

This parser is **not memory-specific** — it lives in `src/utils/frontmatterParser.js` and is shared by skills, slash commands, agents, and other configs across the codebase. Memory is one consumer.

### How it works

1. **Regex match the frontmatter block**: `q.match(zy6)` — `zy6` is a precompiled regex of the form `/^---\n([\s\S]*?)\n---\n?/`. Captures the inner YAML payload in group 1.
2. **No match → no frontmatter**: Return `{frontmatter: {}, content: q}`. The file is treated as pure content.
3. **Slice the body**: `q.slice(match[0].length)` — everything after the `---\n` closer.
4. **First-pass YAML parse**: Try `yt6(captured)` (the strict YAML parser). If it returns a plain object (`typeof === 'object' && !Array.isArray`), use that. **Reject scalars and arrays** — frontmatter must be a dict.
5. **Second-pass with auto-quote fixup**: If the strict parser threw, run `g8z(captured)` (a heuristic that auto-quotes problematic values like unquoted colons), then re-parse. If this works, use the result.
6. **Both parses failed**: Log `Failed to parse YAML frontmatter[: in <path>]: <msg>` at warn level. Return `{frontmatter: {}, content: body}` — body is still extracted, frontmatter is empty.
7. **Return**: Always returns the result tuple; never throws.

### Why this approach

- **Empty-on-failure rather than throw**: A broken file becomes a "file with no frontmatter" — the parsing pipeline survives. Memory code further down sees `frontmatter.type === undefined` and renders the file without a type tag rather than failing the whole scan.
- **Two-pass parse**: Real-world memory files (especially user-edited) frequently contain unquoted colons (`description: hello: world`). A strict parser fails; the fixup pass quotes the value so the second parse succeeds. This is forgiving by design — memory files are *content*, not config.
- **Reject scalars and arrays**: A YAML payload that parses as `[1, 2, 3]` or `"hello"` is not a frontmatter dict. Falling through to the next branch (or the empty fallback) is correct.
- **Warn-level log**: Failure-to-parse is a developer-relevant signal but doesn't affect runtime correctness. Warn is appropriate.

### Key insight

The parser is **content-permissive** — it tries hard to extract a dict, but a complete failure is silent (warn-only) so a single broken memory file doesn't bring down the manifest. This pairs with the lenient downstream consumers (`parseMemoryType` → `undefined`, `description: frontmatter.description || null`) to make the whole memory pipeline crash-resistant against malformed user content.

```javascript
// ============================================
// parseFrontmatter - Two-pass YAML frontmatter extractor
// Location: chunks.80.mjs:2422-2450 (v2.1.88: src/utils/frontmatterParser.ts)
// ============================================

// ORIGINAL (for source lookup):
function p2(q, K) {
    let _ = q.match(zy6);
    if (!_) return { frontmatter: {}, content: q };
    let z = _[1] || "", Y = q.slice(_[0].length), A = {};
    try {
        let O = yt6(z);
        if (O && typeof O === "object" && !Array.isArray(O)) A = O
    } catch {
        try {
            let O = g8z(z), w = yt6(O);
            if (w && typeof w === "object" && !Array.isArray(w)) A = w
        } catch (O) {
            let w = K ? ` in ${K}` : "";
            E(`Failed to parse YAML frontmatter${w}: ${O instanceof Error?O.message:O}`, { level: "warn" })
        }
    }
    return { frontmatter: A, content: Y }
}

// READABLE (for understanding):
export function parseFrontmatter(raw: string, filePath?: string): { frontmatter: Record<string, unknown>, content: string } {
  const match = raw.match(FRONTMATTER_RE)  // /^---\n([\s\S]*?)\n---\n?/
  if (!match) return { frontmatter: {}, content: raw }

  const payload = match[1] || ''
  const body = raw.slice(match[0].length)
  let frontmatter: Record<string, unknown> = {}

  try {
    const parsed = parseYaml(payload)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      frontmatter = parsed as Record<string, unknown>
    }
  } catch {
    try {
      const fixed = autoQuoteYaml(payload)
      const parsed = parseYaml(fixed)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        frontmatter = parsed as Record<string, unknown>
      }
    } catch (err) {
      const where = filePath ? ` in ${filePath}` : ''
      logForDebugging(
        `Failed to parse YAML frontmatter${where}: ${err instanceof Error ? err.message : err}`,
        { level: 'warn' },
      )
    }
  }

  return { frontmatter, content: body }
}

// Mapping: p2→parseFrontmatter, q→raw, K→filePath, _→match, z→payload, Y→body, A→frontmatter,
//          O→parsed (or err in catch), w→fixed (or where in catch), yt6→parseYaml,
//          g8z→autoQuoteYaml, zy6→FRONTMATTER_RE, E→logForDebugging
```

## How Memory Consumes Frontmatter

The full chain for a single memory file is:

```
file on disk: ~/.claude/projects/<slug>/memory/user_role.md
  │
  ├─ ---
  │  name: User profession
  │  description: User is a data scientist focused on observability
  │  type: user
  │  created: 2026-05-10
  │  last_read: 2026-05-12T08:30Z
  │  ---
  │  body content here
  │
  ▼  readFileInRange(path, 0, FRONTMATTER_MAX_LINES=30) ← stats during read
parseFrontmatter(content, filePath)
  │
  │  → { frontmatter: { name: 'User profession', description: '...',
  │                     type: 'user', created: '2026-05-10', last_read: '...' },
  │      content: 'body content here' }
  │
  ▼
scanMemoryFiles consumer assembles MemoryHeader:
  {
    filename: 'user_role.md',
    filePath: '<absolute>',
    mtimeMs: 1715424000000,  // from readFileInRange's stat
    description: frontmatter.description || null,
    type: parseMemoryType(frontmatter.type),  // 'user' | undefined
  }
  │
  ▼  (sort newest-first, take top 200)
formatMemoryManifest renders:
  - [user] user_role.md (2026-05-10T...): User is a data scientist focused on observability
```

### Field-by-field validation

| Frontmatter field | Reading code | Validator | Failure behavior |
|-------------------|--------------|-----------|------------------|
| `name` | `J.name` (chunks.99.mjs:567) — used by some callers like skills | type check `typeof J.name === 'string'` ad hoc | Falls back to `yI6(q)` (filename derived) or empty |
| `description` | `J.description` | `J.description \|\| null` | `null` — manifest line omits `:description` suffix |
| `type` | `J.type` | `parseMemoryType` | `undefined` — manifest line omits `[type] ` prefix |
| `created` | `J.created` | `parseISODateOrNull(J.created)` if KAIROS/tiny-mem on, else ignored | `null` — sort falls back to file mtime |
| `last_read` | `J.last_read` | `typeof J.last_read === 'string'` | `null` — used by age-tracking, optional |

### `parseISODateOrNull` (dMz)

```javascript
// ============================================
// parseISODateOrNull - Validates "YYYY-MM-DD" frontmatter.created field
// Location: chunks.99.mjs:542-551
// ============================================

// ORIGINAL (for source lookup):
function dMz(q) {
    if (typeof q !== "string") return null;
    let K = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q);
    if (!K) return null;
    let _ = Number(K[1]), z = Number(K[2]), Y = Number(K[3]),
        A = new Date(_, z - 1, Y).getTime();
    return Number.isNaN(A) ? null : A
}

// READABLE (for understanding):
function parseISODateOrNull(raw: unknown): number | null {
  if (typeof raw !== 'string') return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const ts = new Date(year, month - 1, day).getTime()
  return Number.isNaN(ts) ? null : ts
}

// Mapping: dMz→parseISODateOrNull, q→raw, K→m, _→year, z→month, Y→day, A→ts
```

**Why this matters**: When the tiny-mem ("one fact per file") variant is on, memories are sorted by `created` rather than by file mtime, so an immutable memory's *intent date* is preserved even when the file is moved/recreated. Strict `YYYY-MM-DD` format with `null` on invalid input means a corrupted date silently falls back to mtime sort rather than crashing the scan.

## The Frontmatter Template in the Prompt

The model is told what to write through `MEMORY_FRONTMATTER_EXAMPLE`, embedded in the "How to save memories" prompt section:

```markdown
```markdown
---
name: {{memory name}}
description: {{one-line description — used to decide relevance in future conversations, so be specific}}
type: {{user, feedback, project, reference}}
---

{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}
```
```

(The outer ```` ```markdown ```` and ```` ``` ```` are part of the prompt — the model writes a literal Markdown code block including those fences.)

In v2.1.112, the chunks.153.mjs newer variant (`MkK`) drops the `description:` line, keeping just `name:` and `type:`:

```markdown
---
name: {{memory name}}
type: {{user, feedback, project}}
---
```

This pairs with the "one paragraph per file" body-structure language elsewhere in the prompt — small files don't need a separate one-line description, since the recall selector reads the whole body.

### Type interpolation

The `type:` example placeholder is computed at module init from the `MEMORY_TYPES` array:

```javascript
`type: {{${MEMORY_TYPES.join(", ")}}}`
```

This is the **only** place the array gets templated into the prompt. If a fifth type is ever added to `MEMORY_TYPES`, the prompt example shows it on the next session without further edits. Conversely, if the prompt example were a hand-written literal, it would drift from the taxonomy — the dynamic interpolation enforces the bidirectional invariant.

## What about `[[link]]` Wikilink Cross-References?

**They are not a thing in this module.**

Searching for `[[` across `src/memdir/`, `src/utils/frontmatterParser.ts`, the team-mem code, and the v2.1.112 chunks shows **no wikilink handling**:

```
$ grep -rn '\[\[' /lyz/codespace/3rd/claude-code/src/memdir/  →  (no output)
$ grep -rn '\[\[' /lyz/codespace/3rd/claude-code/src/utils/frontmatterParser.ts  →  (no output)
$ grep -rn '\[\[.*\]\]' chunks.*.mjs (memdir-relevant)  →  (no output)
```

The format the model is told to use for `MEMORY.md` entries is **plain Markdown link syntax**:

```
- [Title](file.md) — one-line hook
```

Specifically from `buildMemoryLines`:

> **Step 2** — add a pointer to that file in `MEMORY.md`. `MEMORY.md` is an index, not a memory — each entry should be one line, under ~150 characters: `- [Title](file.md) — one-line hook`. It has no frontmatter. Never write memory content directly into `MEMORY.md`.

Why plain Markdown:
- **No special resolver needed**: When the model reads `MEMORY.md` and decides to follow a link, it just calls the `Read` tool with the relative path. No custom URI scheme parsing.
- **Renders correctly in any editor**: Users can view and edit `MEMORY.md` in VS Code, Obsidian, or vim and the links still mean something.
- **Trivially auto-completable**: When the model writes a new link, it just needs to know the filename — same disposition as a regular code file path.

The implicit invariant: a `[Title](file.md)` entry in `MEMORY.md` means "there exists `<memoryDir>/file.md`." The system does **not** automatically validate that the file exists — the model is responsible for keeping the index honest, and the `## Before recommending from memory` section explicitly tells the model to verify file existence before acting on memory content. Stale links are a soft failure, not a hard one.

### Why not wikilinks

A `[[file]]` wikilink would require:
- A resolver that searches for the filename inside the memory directory
- A namespace decision (resolve relative to current file? to memory root?)
- A teaching prompt explaining the syntax to the model
- A renderer that decides whether the link resolved or not

None of that machinery exists in the codebase, and the plain-Markdown form gets the same job done with `Read tool + path`. The model already knows how to read a path; teaching it a custom resolver would be wasted prompt tokens.

## Cross-Module Touch Points

`parseFrontmatter` is used by **many** consumers besides memory:

| Caller (v2.1.112 chunk:line) | What it parses |
|------------------------------|-----------------|
| chunks.99.mjs:567 (`scanMemoryFiles` / `t88`) | Memory files |
| chunks.156.mjs:131, 176, 263, 315 | Skill `SKILL.md` frontmatter |
| chunks.158.mjs:1826 | Agent definitions |
| chunks.165.mjs:378 | (TUI/IDE flow) |
| chunks.155.mjs:2893 | Slash command frontmatter |
| chunks.186.mjs:2210 | (Background agent context) |
| chunks.211.mjs:1869, chunks.212.mjs:591 | Verification rubrics |

This is why `parseFrontmatter` lives in `src/utils/` — it's a shared primitive. The lenient, warn-on-failure behavior matters across all callers: a broken skill manifest, a broken agent definition, a broken memory file — all should degrade locally without breaking the shared scan.

## Cross-Validation: v2.1.88 → v2.1.112

| Invariant | v2.1.88 src | v2.1.112 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `parseFrontmatter` two-pass (strict → autoQuote fixup) | utils/frontmatterParser.ts | `p2` chunks.80.mjs:2422-2450 | Yes |
| Returns `{frontmatter: {}, content: body}` on parse failure | utils/frontmatterParser.ts | `p2` chunks.80.mjs:2439-2444 | Yes |
| `parseMemoryType` returns `undefined` for unknown types | memoryTypes.ts:28-31 | `CC4` chunks.99.mjs:516-519 | Yes |
| `description` falls back to `null` in `MemoryHeader` | memoryScan.ts:60 | `description: J.description \|\| null` chunks.99.mjs:575 | Yes |
| `MEMORY_FRONTMATTER_EXAMPLE` uses `MEMORY_TYPES.join(', ')` for the `type:` placeholder | memoryTypes.ts:266 | `mh6` chunks.99.mjs (joined from `SC4`) | Yes |
| FRONTMATTER_MAX_LINES = 30 for the read-range optimization | memoryScan.ts:23 | `UMz = 30` chunks.99.mjs:607 | Yes |
| MAX_MEMORY_FILES cap = 200 (non-tiny) / 500 (tiny) | memoryScan.ts:22 | `FMz = 200`, `gMz = 500` chunks.99.mjs:603-605 | Yes |
| No wikilink handling in memory parsing | (absence) | (no `[[` in memdir-related chunks) | Yes |

Everything lines up. The shared frontmatter parser, the memory-specific type validator, and the lenient downstream consumers form a consistent contract: extract what you can, surface what you can't, never crash on user-edited content.
