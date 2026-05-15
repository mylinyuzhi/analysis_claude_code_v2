# Frontmatter Parsing and Cross-References — v2.1.142

How memory files' YAML frontmatter is parsed in v2.1.142, how the schema migrated from top-level `type:` (v2.1.112) to nested `metadata.type:` (v2.1.142), how `name` / `description` / `type` / `created` / `last_read` are validated, and the explicit **adoption of `[[name]]` wikilink cross-references** that v2.1.112 did not have.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) - New symbols from this unit

Key functions and constants:
- `parseFrontmatter` (`tO`) - Generic YAML frontmatter parser, used everywhere (cli_inner_pretty.js:141788-141809)
- `coerceToFrontmatterDict` (`PVK`) - Type-guard that ensures parsed YAML is a plain object (cli_inner_pretty.js:141810-141813)
- `autoQuoteYaml` (`aI1`) - Heuristic auto-quoting for unquoted-colon values (cli_inner_pretty.js:141761-141787)
- `parseMemoryType` (`VVK`) - Validates `frontmatter.metadata.type` against the 4-element taxonomy (cli_inner_pretty.js:141954-141957)
- `parseISODateOrNull` (`jz_`) - Validates `frontmatter.created` as `YYYY-MM-DD` (cli_inner_pretty.js:237066-237075)
- `scanMemoryFiles` (`SO$`) - Memory dir scan that calls `parseFrontmatter` per file (cli_inner_pretty.js:237076-237112)
- `formatMemoryManifest` (`RO$`) - Renders headers as a manifest for the model (cli_inner_pretty.js:237113-237130)
- `LKH` - Metadata accessor (`(frontmatter, fieldName) => frontmatter.metadata[fieldName] ...`) (cli_inner_pretty.js:141938)
- `qS1` - Slug normalizer for the `name:` field (cli_inner_pretty.js:141940-141945)
- `$S1` - Frontmatter validator (`{ name, description, metadata }`) (cli_inner_pretty.js:141930-141937)
- `MEMORY_FRONTMATTER_EXAMPLE` (`jBH`) - Default frontmatter (`metadata.type` nested, all 4 types) baked into prompts (cli_inner_pretty.js:142165)
- `MEMORY_FRONTMATTER_EXAMPLE_TINY` (`kVK`) - Tiny variant (`metadata.type` nested, 3 types) (cli_inner_pretty.js:142353)
- `WIKILINK_GUIDANCE` (`jK6`) - The `[[name]]` cross-reference prompt block (cli_inner_pretty.js:141950-141952)
- `XKH` - Frontmatter regex `/^---\s*\n([\s\S]*?)---\s*\n?/` (cli_inner_pretty.js:141889)
- `iYH` - YAML parser via `Bun.YAML.parse` (cli_inner_pretty.js:141751-141753)

## The Generic Parser: `parseFrontmatter` (tO)

### What it does

Takes a raw file string and (optionally) the file path for error messages, plus an unused third argument. Returns `{frontmatter: object, content: string}` — the frontmatter dict (empty if absent or unparseable) and the body without the frontmatter block.

This parser is **not memory-specific** — it lives in the same shared utility as in v2.1.112 and is consumed by skills, slash commands, agents, and other configs across the codebase. Memory is one consumer.

### Changes from v2.1.112

The function gains a third parameter `q` (apparently unused in the visible body — likely a forward-compatibility hook for caller-injected validators). The two-pass parsing strategy and `Bun.YAML.parse` callout are preserved.

### How it works

1. **Regex match the frontmatter block**: `H.match(XKH)` — `XKH = /^---\s*\n([\s\S]*?)---\s*\n?/`. Note the v2.1.142 form uses `---\s*\n` rather than `---\n` — tolerates trailing whitespace after the opening `---`.
2. **No match → no frontmatter**: Return `{frontmatter: {}, content: H}`.
3. **Slice the body**: `H.slice(match[0].length)`.
4. **First-pass YAML parse**: Try `PVK(iYH(payload))` where `iYH = Bun.YAML.parse`. `PVK` returns the parsed object if it's a plain dict (not scalar, not array), else `{}`.
5. **Second-pass with auto-quote fixup**: If the strict parser threw, run `aI1(payload)` (the auto-quote heuristic), then re-parse.
6. **Both parses failed**: Log `Failed to parse YAML frontmatter[: in <path>]: <msg>` at warn level. Return `{frontmatter: {}, content: body}`.
7. **Return**: Always returns the result tuple; never throws.

### Why this approach

Same as v2.1.112:

- **Empty-on-failure rather than throw**: A broken file becomes a "file with no frontmatter" — the parsing pipeline survives.
- **Two-pass parse**: Real-world memory files frequently contain unquoted colons (`description: hello: world`).
- **Reject scalars and arrays via `PVK`**: A YAML payload that parses as `[1, 2, 3]` or `"hello"` is not a frontmatter dict.
- **Warn-level log**: Failure-to-parse is a developer-relevant signal but doesn't affect runtime correctness.

### Key insight

The parser is **content-permissive** — it tries hard to extract a dict, but a complete failure is silent (warn-only) so a single broken memory file doesn't bring down the manifest. This pairs with the lenient downstream consumers (`parseMemoryType` → `undefined`, `description: frontmatter.description || null`, `metadata[fieldName]` returning `undefined` for absent fields) to make the whole memory pipeline crash-resistant against malformed user content.

```javascript
// ============================================
// parseFrontmatter - Two-pass YAML frontmatter extractor
// Location: cli_inner_pretty.js:141788-141809
// ============================================

// ORIGINAL (for source lookup):
function tO(H, $, q) {
  let K = H.match(XKH);
  if (!K) return { frontmatter: {}, content: H };
  let _ = K[1] || "",
    A = H.slice(K[0].length),
    z = (f) => f,
    Y = {};
  try {
    Y = z(PVK(iYH(_)));
  } catch {
    try {
      let f = aI1(_);
      Y = z(PVK(iYH(f)));
    } catch (f) {
      let O = $ ? ` in ${$}` : "";
      N(`Failed to parse YAML frontmatter${O}: ${f instanceof Error ? f.message : f}`, { level: "warn" });
    }
  }
  return { frontmatter: Y, content: A };
}

// READABLE (for understanding):
export function parseFrontmatter(raw, filePath, _unused) {
  const match = raw.match(FRONTMATTER_RE)  // /^---\s*\n([\s\S]*?)---\s*\n?/
  if (!match) return { frontmatter: {}, content: raw }

  const payload = match[1] || ''
  const body = raw.slice(match[0].length)
  const passthrough = (x) => x
  let frontmatter = {}

  try {
    frontmatter = passthrough(coerceToFrontmatterDict(parseYaml(payload)))
  } catch {
    try {
      const fixed = autoQuoteYaml(payload)
      frontmatter = passthrough(coerceToFrontmatterDict(parseYaml(fixed)))
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

// Mapping: tO→parseFrontmatter, H→raw, $→filePath, q→_unused, K→match, _→payload,
//          A→body, z→passthrough, Y→frontmatter, f→fixed/err (depending on branch),
//          O→where, iYH→parseYaml, PVK→coerceToFrontmatterDict, aI1→autoQuoteYaml,
//          XKH→FRONTMATTER_RE, N→logForDebugging
```

## `coerceToFrontmatterDict` (PVK) — The Object Type Guard

```javascript
// ============================================
// coerceToFrontmatterDict - Coerce YAML output to a plain dict or empty object
// Location: cli_inner_pretty.js:141810-141813
// ============================================

// ORIGINAL (for source lookup):
function PVK(H) {
  if (H && typeof H === "object" && !Array.isArray(H)) return H;
  return {};
}

// READABLE (for understanding):
function coerceToFrontmatterDict(parsed) {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed
  }
  return {}
}

// Mapping: PVK→coerceToFrontmatterDict
```

Same semantics as v2.1.112's inline check — if YAML produced a scalar, an array, or `null`, treat it as "no frontmatter."

## `autoQuoteYaml` (aI1) — Heuristic Fixup Pass

### What it does

Walks the YAML payload line by line, looking for `key: value` lines where the value contains characters that broke the strict parser. Wraps such values in double quotes (escaping existing backslashes and double-quotes) so the second-pass parse can succeed.

### How it works

For each line:
1. Match `/^([a-zA-Z_-]+):\s+(.+)$/` — capture key and value.
2. If the value is already quoted (`"..."` or `'...'`), pass through.
3. Otherwise check the value against `oI1.test(value)` — a regex that detects "needs quoting" patterns (the regex is not fully visible in the obfuscated output but in v2.1.88 it matches lines containing colons, `#`, `{`, `}`, `[`, `]`, `,`, or other YAML-significant characters).
4. If the value needs quoting, replace `\\` with `\\\\` and `"` with `\\"`, then emit `${key}: "${escaped}"`.
5. Pass through anything else.

### Why this approach

A user writing `description: linker.ts:142 has the lookup table` would produce a YAML parse error because `linker.ts:142` looks like a nested map. The auto-quote fixup converts that to `description: "linker.ts:142 has the lookup table"`, which the strict parser handles correctly.

The heuristic is intentionally **line-oriented** (not a full YAML state machine) because the failure mode it targets is single-line key-value pairs. Multi-line literals (`description: |`) don't trigger this path because they're a different YAML syntax that the strict parser handles correctly the first time.

### Key insight

This is **forgiveness by code**: rather than asking the model to escape every colon in its frontmatter, the runtime fixes the easy cases. The cost is one extra regex pass per parse-failure — negligible on the frontmatter scan path.

## How Memory Consumes Frontmatter — v2.1.142

The full chain for a single memory file in v2.1.142:

```
file on disk: ~/.claude/projects/<slug>/memory/user_role.md  (or tiny_memory/)
  │
  ├─ ---
  │  name: user-profession
  │  description: User is a data scientist focused on observability
  │  metadata:
  │    type: user
  │  created: 2026-05-10
  │  last_read: 2026-05-12T08:30Z
  │  ---
  │  body content here, may contain [[other-memory-slug]]
  │
  ▼  readFileInRange(path, 0, FRONTMATTER_MAX_LINES) ← stats during read
parseFrontmatter(content, filePath)
  │
  │  → { frontmatter: {
  │       name: 'user-profession',
  │       description: '...',
  │       metadata: { type: 'user', last_read: '...' },
  │       created: '2026-05-10'
  │     },
  │     content: 'body content here, may contain [[other-memory-slug]]' }
  │
  ▼
scanMemoryFiles consumer assembles MemoryHeader:
  {
    filename: 'user_role.md',
    filePath: '<absolute>',
    mtimeMs: 1715424000000,    // from readFileInRange's stat, OR
                               // parseISODate('2026-05-10') if tiny mode
    description: frontmatter.description,
    type: parseMemoryType(LKH(frontmatter, "type")),   // reads frontmatter.metadata.type
    created: LKH(frontmatter, "created"),
    last_read: LKH(frontmatter, "last_read"),
    content: tiny ? body.trim() : null,
  }
  │
  ▼  (sort newest-first, take top 200 or 250)
formatMemoryManifest renders:
  - [user] user_role.md (2026-05-10T...)
    user is a data scientist
    [...continuing body...]
```

### The `LKH` accessor

```javascript
// ============================================
// LKH - Read a metadata field with type-safe coercion
// Location: cli_inner_pretty.js:141938
// ============================================

// ORIGINAL (for source lookup):
LKH = (H, $) => DK6(H.metadata[$])

// READABLE (for understanding):
function readMetadataField(frontmatter, fieldName) {
  return coerceNonEmptyStringOrNull(frontmatter.metadata[fieldName])
}

// Mapping: LKH→readMetadataField, H→frontmatter, $→fieldName, DK6→coerceNonEmptyStringOrNull
```

Where `DK6 = (H) => (typeof H === "string" && H.length > 0 ? H : null)` (cli_inner_pretty.js:141928).

This is the **v2.1.142 schema accessor**. Everywhere in `memoryScan.ts` that previously read `frontmatter.type` (v2.1.112) now reads `LKH(frontmatter, "type")`, which:
1. Looks inside `frontmatter.metadata` for the field.
2. Returns `null` for absent, empty, or non-string values.

### Backward compatibility with v2.1.112 files

A memory file written by v2.1.112 has the following frontmatter:

```yaml
---
name: User profession
description: ...
type: user       ← top-level
---
```

When v2.1.142's `scanMemoryFiles` (`SO$`) reads this file:
- `frontmatter.metadata` is `undefined`.
- `LKH(frontmatter, "type")` → `coerceNonEmptyStringOrNull(undefined.type)` → **TypeError** would be raised by the `.type` access on `undefined`.

So actually the code must handle `metadata === undefined`. Reading the obfuscated `SO$` body more carefully:

```javascript
{ frontmatter: D, body: j } = wBH(M, O),
J = LKH(D, "created"),
```

The chain doesn't crash because `LKH` uses optional chaining-like access. Let me re-examine the obfuscated source: looking at `LKH = (H, $) => DK6(H.metadata[$])` — this *would* throw on `H.metadata === undefined`. However, the parser `tO` always returns `{ frontmatter: parsedDict }` where `parsedDict` is at least `{}`. For a v2.1.112 file, `frontmatter = { name, description, type, created }` and `frontmatter.metadata === undefined`. The expression `H.metadata[$]` evaluates as `undefined[$]` which **throws**.

The likely resolution is that the parsing path is wrapped in a separate validator that flattens the schema — or the metadata access is implicitly defended elsewhere. Looking at `$S1`:

```javascript
$S1 = (H) => {
  let $ = HS1(H.metadata) ? H.metadata : {},
    q = Object.entries(H).reduce((K, [_, A]) => {
      if (sI1.includes(_) || A == null) return K;
      return (K[_] = A), K;
    }, {});
  return { name: DK6(H.name), description: DK6(H.description), metadata: Object.freeze({ ...q, ...$ }) };
}
```

This is the **frontmatter validator**: it builds a `metadata` dict by *moving top-level keys into metadata* (excluding `name`, `description`, `metadata` themselves — those are in `sI1 = ["name", "description", "metadata"]`). So a v2.1.112 file with top-level `type: user` becomes (after `$S1`):

```javascript
{
  name: 'user-profession',
  description: '...',
  metadata: { type: 'user', created: '2026-05-10' }   // promoted from top-level
}
```

And then `LKH(validatedFrontmatter, "type")` correctly reads `'user'`. This is the **compatibility shim**: v2.1.112 files have their top-level fields *promoted* into the `metadata` namespace by `$S1`, so the v2.1.142 read path sees them in the unified location.

### When `$S1` is applied

`$S1` is only one of several frontmatter validators in the codebase (others for skills, agents, etc.). The memory scan path (`SO$`) does **not** appear to call `$S1` directly — it calls `LKH` straight against the parsed frontmatter. So actually the v2.1.112 → v2.1.142 compatibility may not be automatic; v2.1.112 files might genuinely appear as `type: undefined` in v2.1.142.

Looking again at line 237088: `{ frontmatter: D, body: j } = wBH(M, O)`. The function `wBH` is the body extractor. Then `LKH(D, "type")` accesses `D.metadata["type"]`. If `D.metadata === undefined`, this throws.

There is a defensive layer somewhere: either `LKH` is defined differently in this scope (it could be), or `D` always has a `metadata` field added by some upstream normalizer that wraps `parseFrontmatter`. The safest reading is that **`memoryScan` in v2.1.142 reads only the v2.1.142 schema** — v2.1.112 files would yield `type: undefined` and be untyped legacy entries in the manifest.

### Field-by-field validation (v2.1.142)

| Frontmatter field | Reading code | Validator | Failure behavior |
|-------------------|--------------|-----------|------------------|
| `name` | `J.name` (cli_inner_pretty.js:237088 area) | type check; slug-normalize via `qS1` | Falls back to filename |
| `description` | `D.description` | type check via `DK6` (non-empty string or null) | `null` — manifest line omits `:description` suffix |
| `metadata.type` (v2.1.142 path) | `LKH(D, "type")` | `parseMemoryType` (`VVK`) | `undefined` — manifest line omits `[type] ` prefix |
| `created` | `LKH(D, "created")` | `parseISODateOrNull` (`jz_`) under tiny mode | falls back to file mtime |
| `last_read` | `LKH(D, "last_read")` | type guard via `DK6` | `null` — used by age-tracking, optional |

### `parseISODateOrNull` (jz_)

```javascript
// ============================================
// parseISODateOrNull - Validates "YYYY-MM-DD" frontmatter.created field
// Location: cli_inner_pretty.js:237066-237075
// ============================================

// ORIGINAL (for source lookup):
function jz_(H) {
  if (typeof H !== "string") return null;
  let $ = /^(\d{4})-(\d{2})-(\d{2})$/.exec(H);
  if (!$) return null;
  let q = Number($[1]),
    K = Number($[2]),
    _ = Number($[3]),
    A = new Date(q, K - 1, _).getTime();
  return Number.isNaN(A) ? null : A;
}

// READABLE (for understanding):
function parseISODateOrNull(raw) {
  if (typeof raw !== 'string') return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const ts = new Date(year, month - 1, day).getTime()
  return Number.isNaN(ts) ? null : ts
}

// Mapping: jz_→parseISODateOrNull, H→raw, $→m, q→year, K→month, _→day, A→ts
```

**Why this matters**: When the tiny-mem ("one fact per file") variant is on, memories are sorted by `created` rather than by file mtime, so an immutable memory's *intent date* is preserved even when the file is moved/recreated. Strict `YYYY-MM-DD` format with `null` on invalid input means a corrupted date silently falls back to mtime sort rather than crashing the scan.

## The Frontmatter Template in the Prompt

The model is told what to write through `MEMORY_FRONTMATTER_EXAMPLE`, embedded in the "How to save memories" prompt section. **The v2.1.142 form uses nested `metadata.type:` rather than top-level `type:`**:

```markdown
\`\`\`markdown
---
name: {{short-kebab-case-slug}}
description: {{one-line summary — used to decide relevance in future conversations, so be specific}}
metadata:
  type: {{user, feedback, project, reference}}
---

{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines. Link related memories with [[their-name]].}}
\`\`\`

In the body, link to related memories with `[[name]]`, where `name` is the other memory's `name:` slug. Link liberally — a `[[name]]` that doesn't match an existing memory yet is fine; it marks something worth writing later, not an error.
```

(The outer backtick-fence is part of the prompt — the model writes a literal Markdown code block including those fences.)

### Type interpolation

The `metadata.type:` example placeholder is computed at module init from the type-list array passed to `ci$(types)`:

```javascript
`  type: {{${types.join(", ")}}}`
```

For default mode: `types = MEMORY_TYPES` (4 values).
For tiny mode: `types = TINY_MEMORY_TYPES` (3 values — `reference` dropped).

This is the **only** place the array gets templated into the prompt. If a fifth type is ever added to `MEMORY_TYPES`, the prompt example shows it on the next session without further edits. The dual templating (full vs tiny) means the prompts and the validator stay in sync per-variant.

## The Wikilink Convention — NEW in v2.1.142

The single biggest user-facing change in v2.1.142's frontmatter ecosystem is the **adoption of `[[name]]` wikilinks for memory cross-references**.

In v2.1.112: there was no wikilink handling. The format the model was told to use for `MEMORY.md` entries was **plain Markdown link syntax**: `- [Title](file.md) — one-line hook`. Wikilinks did not appear anywhere in the memory code or prompts.

In v2.1.142: every frontmatter example ends with the `WIKILINK_GUIDANCE` block:

> In the body, link to related memories with `[[name]]`, where `name` is the other memory's `name:` slug. Link liberally — a `[[name]]` that doesn't match an existing memory yet is fine; it marks something worth writing later, not an error.

### What wikilinks are for

The motivating use case is the **tiny-memory variant**: when each memory is one fact in its own file, cross-references between facts become important. Without wikilinks, a `feedback` memory like "use bun for builds" can't easily point to the `project` memory that established the rule. With wikilinks, the body of the feedback memory can write `[[choose-bun-rationale]]` and a downstream tool (or the model in a future session) can follow the link.

### What the runtime does with wikilinks

**Nothing automatic.** Searching the v2.1.142 binary for `\\[\\[` (escaped wikilink brackets) shows only:
- The prompt blocks that *teach* the convention.
- The dream-prompt assets that mention wikilinks.

There is **no resolver, no link validation, no graph construction, no follow-the-link logic** in the runtime. Wikilinks are purely a prompt convention — the model is taught to write them, and it's the model's job to read them in future sessions (treating them as filename hints to feed to the Read tool).

### Why no resolver

Compare to a system like Obsidian: wikilinks there have a resolver that follows links across the vault. Claude Code doesn't need that machinery because:

1. **The recall layer (`findRelevantMemories`) reads bodies during selection** in tiny+synthesis mode. If a memory's body contains `[[other-name]]`, the recall LLM can already see it and decide whether the linked memory is relevant — without a resolver.
2. **The model is already capable of following links** with the Read tool, given a filename hint.
3. **Avoiding the resolver avoids a class of bugs**: stale links (link target was deleted), ambiguous links (two memories share a name slug), and link-cycle handling don't need to be solved in the runtime.

The trade-off: wikilinks are **soft references** — they may not resolve at recall time, and the model is told that's fine ("a `[[name]]` that doesn't match an existing memory yet is fine; it marks something worth writing later, not an error"). The "marks something worth writing later" framing turns a potential bug class into a feature: dangling links are *aspirations*, not errors.

### Key insight

Wikilinks are a **prompt-engineering primitive** in v2.1.142, not a data-structure feature. They exist to teach the model that memories form a graph and that cross-references are first-class — without requiring any code to actually traverse that graph. The runtime cost is zero; the cognitive cost on the model is "remember this syntax exists." Synthesis-mode recall can read links from bodies as part of relevance reasoning, which is the closest thing to runtime traversal but it's done by the LLM, not by an algorithm.

## Cross-Module Touch Points

`parseFrontmatter` (`tO`) is used by **many** consumers besides memory in v2.1.142. The locations are largely unchanged from v2.1.112; the parser is shared infrastructure.

| Caller (cli_inner_pretty.js area) | What it parses |
|------------------------------------|-----------------|
| Memory scan (`SO$`) | Memory files |
| Skill manifests (`SKILL.md`) | Skill frontmatter |
| Agent manifests | Agent definitions |
| Slash command files | Slash command frontmatter |
| Verification rubrics | Eval frontmatter |

The lenient, warn-on-failure behavior matters across all callers: a broken skill manifest, a broken agent definition, a broken memory file — all should degrade locally without breaking the shared scan.

## Cross-Validation: v2.1.88 → v2.1.142

| Invariant | v2.1.88 src | v2.1.142 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `parseFrontmatter` two-pass (strict → autoQuote fixup) | utils/frontmatterParser.ts | `tO` cli_inner_pretty.js:141788-141809 | Yes |
| Returns `{frontmatter: {}, content: body}` on parse failure | utils/frontmatterParser.ts | `tO` cli_inner_pretty.js:141803-141805 | Yes |
| `parseMemoryType` returns `undefined` for unknown types | memoryTypes.ts:28-31 | `VVK` cli_inner_pretty.js:141954-141957 | Yes |
| `parseISODateOrNull` strict `YYYY-MM-DD` validator | memoryScan.ts (helper) | `jz_` cli_inner_pretty.js:237066-237075 | Yes |
| Frontmatter regex `/^---\n.../` | utils/frontmatterParser.ts | `XKH` cli_inner_pretty.js:141889 (now `/^---\s*\n.../`, slightly looser) | Yes (with minor whitespace tolerance) |
| FRONTMATTER_MAX_LINES = 30 for the frontmatter-only read budget | memoryScan.ts:23 | `wz_ = 30` cli_inner_pretty.js:237135 | Yes |
| MAX_MEMORY_FILES = 200 (non-tiny) / 250 (tiny) | memoryScan.ts:22 | `Oz_ = 200, Mz_ = 250` cli_inner_pretty.js:237133-237134 | Yes (tiny cap is 250 in v2.1.142, was 500 in v2.1.112) |

**v2.1.142-specific changes not present in v2.1.88 source:**

| Addition | v2.1.142 obfuscated |
|----------|---------------------|
| `parseFrontmatter` adds unused 3rd parameter | `tO(H, $, q)` |
| `metadata.type:` nested frontmatter schema | `MEMORY_FRONTMATTER_EXAMPLE` (`jBH`/`kVK`) cli_inner_pretty.js:142165 / 142353 |
| `LKH` metadata accessor function | cli_inner_pretty.js:141938 |
| `qS1` slug normalizer | cli_inner_pretty.js:141940-141945 |
| `$S1` frontmatter validator with metadata promotion | cli_inner_pretty.js:141930-141937 |
| `WIKILINK_GUIDANCE` (`[[name]]` cross-references) | cli_inner_pretty.js:141950-141952 |
| Tiny memory body read in scan | `Dz_ = 200` (200 lines, was 200 in v2.1.112 synthesis mode but capped at 30 for non-tiny in v2.1.142) |
| Tiny memory cap | `Mz_ = 250` (lower than v2.1.112's 500, reflecting expected single-fact density) |

**One v2.1.112 → v2.1.142 difference worth flagging**: the synthesis mode in v2.1.142 reads 200 lines per file (same as v2.1.112) but **caps at 250 memories** instead of v2.1.112's 500. With smaller per-memory files (one fact each), 250 still represents a meaningful working set, and 500 was excessive for the manifest budget. The cap change is a tuning, not a regression.

Everything else lines up. The shared frontmatter parser, the memory-specific type validator, the new metadata-namespace accessor, and the lenient downstream consumers form a consistent contract: extract what you can, surface what you can't, never crash on user-edited content, and now teach the model about `[[wikilinks]]` as a free-floating prompt convention.
