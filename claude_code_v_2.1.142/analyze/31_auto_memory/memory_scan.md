# Memory Scan — `memoryScan.ts` (v2.1.142)

## Module Overview

`memoryScan.ts` provides the *directory-traversal primitive* for the entire auto-memory subsystem. It walks the on-disk memory directory, parses YAML frontmatter from each `.md` file, and returns a sorted, capped list of memory file headers. Every other recall and extraction path — `findRelevantMemories`, `synthesizeRelevantMemories`, and `extractMemories` — calls into this module, so its three contracts (newest-first ordering, single-pass stat/read, MEMORY.md exclusion) are load-bearing for the whole feature.

**v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/memoryScan.ts` (94 lines).
**v2.1.142 lines**: `cli_inner_pretty.js:237076-237136` (functions `SO$` and `RO$`).

The module was historically embedded inside `findRelevantMemories.ts`; the v2.1.88 file header records the reason for the split (cyclic import — `extractMemories` needed the scan but couldn't import a file that pulled in the API client). The split also lets the recall and extraction paths share *exactly the same* manifest format so the model sees one stable representation across both prompts.

**v2.1.112 → v2.1.142 changes:**
1. Reads `LKH(frontmatter, "created")` instead of `frontmatter.created` — adapts to the new nested-`metadata` schema.
2. Reads `LKH(frontmatter, "last_read")` instead of `frontmatter.last_read` — same reason.
3. Reads `LKH(frontmatter, "type")` (via `VVK`) instead of `parseMemoryType(frontmatter.type)`.
4. The tiny-mode body read budget is **200 lines** (`Dz_ = 200`), same as v2.1.112's synthesis mode.
5. The tiny-mode file cap is **250** (`Mz_ = 250`), **down from 500 in v2.1.112** — reflecting the smaller per-file size expected from "one fact per file."
6. The non-tiny line budget remains **30 lines** (`wz_ = 30`).
7. The non-tiny file cap remains **200** (`Oz_ = 200`).
8. The body-extractor function is now `wBH` (was `p2`'s body slice) — same semantics, refactored entry point.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — symbols added by this unit

Key functions in this document:
- `scanMemoryFiles` (`SO$`) — Directory walker that returns `MemoryHeader[]` (cli_inner_pretty.js:237076-237112)
- `formatMemoryManifest` (`RO$`) — Manifest builder for both recall and extraction prompts (cli_inner_pretty.js:237113-237130)
- `parseMemoryType` (`VVK`) — Validating type coercion (see [memory_types.md](./memory_types.md))
- `parseFrontmatter` (`tO` via `wBH` wrapper) — YAML frontmatter parser
- `parseISODateOrNull` (`jz_`) — ISO date string validator (cli_inner_pretty.js:237066-237075)
- `readFileInRange` (`pOH`) — Read-with-stat utility shared with FileReadTool
- `LKH` — Metadata accessor for `frontmatter.metadata.*` fields
- `Oz_` — Non-tiny SCAN_FILE_CAP = 200
- `Mz_` — Tiny SYNTHESIS_FILE_CAP = 250 (was 500 in v2.1.112)
- `wz_` — FRONTMATTER_ONLY_LINE_BUDGET = 30
- `Dz_` — FULL_BODY_LINE_BUDGET = 200

## File Discovery

### What it does

`scanMemoryFiles` enumerates a memory directory, reads the top portion of every `.md` file, parses YAML frontmatter from each, and returns a `MemoryHeader[]` sorted newest-first and capped at a maximum count. The cap and the per-file read budget both *branch on the `gM()` "tiny / synthesis" feature flag* (`tengu_billiard_aviary`) because the tiny path also needs the **body content**, not just the frontmatter.

### How it works

```javascript
// ============================================
// scanMemoryFiles - Directory walk → MemoryHeader[]
// Location: cli_inner_pretty.js:237076-237112
// ============================================

// ORIGINAL (for source lookup):
async function SO$(H, $) {
  let q = gM(),
    K = q ? Dz_ : wz_;
  try {
    let A = (await UK7.readdir(H, { recursive: !0 })).filter(
        (f) => f.endsWith(".md") && x68.basename(f) !== "MEMORY.md",
      ),
      Y = (
        await Promise.allSettled(
          A.map(async (f) => {
            let O = x68.join(H, f),
              { content: M, mtimeMs: w } = await pOH(O, 0, K, void 0, $),
              { frontmatter: D, body: j } = wBH(M, O),
              J = LKH(D, "created"),
              X = (q ? jz_(J) : null) ?? w;
            return {
              filename: f,
              filePath: O,
              mtimeMs: X,
              description: D.description,
              type: VVK(LKH(D, "type")),
              created: J,
              last_read: LKH(D, "last_read"),
              content: q ? j.trim() || null : null,
            };
          }),
        )
      )
        .filter((f) => f.status === "fulfilled")
        .map((f) => f.value)
        .sort((f, O) => O.mtimeMs - f.mtimeMs)
        .slice(0, q ? Mz_ : Oz_);
    return (RH("memory_scan"), Y);
  } catch {
    return (J8("memory_scan", "memory_scan_readdir_failed"), []);
  }
}

// READABLE (for understanding):
async function scanMemoryFiles(memoryDir, signal) {
  const synthesisOn = isTinyMemoryEnabled()             // gM() = tengu_billiard_aviary
  const readBudgetLines = synthesisOn
    ? FULL_BODY_LINE_BUDGET                             // 200 — read full body for synthesis
    : FRONTMATTER_ONLY_LINE_BUDGET                      // 30  — frontmatter sufficient for recall

  try {
    const entries = await readdir(memoryDir, { recursive: true })
    const mdFiles = entries.filter(
      f => f.endsWith('.md') && basename(f) !== 'MEMORY.md',   // index file is loaded separately
    )

    const headers = await Promise.allSettled(
      mdFiles.map(async (relativePath) => {
        const filePath = join(memoryDir, relativePath)
        const { content, mtimeMs } = await readFileInRange(
          filePath, 0, readBudgetLines, undefined, signal,
        )
        const { frontmatter, body: bodyAfterFrontmatter } = parseFrontmatterAndBody(content, filePath)
        const createdRaw = readMetadataField(frontmatter, 'created')
        // synthesis branch: prefer explicit "created:" frontmatter to fs mtime
        // (mtime drifts on rsync/git checkout, breaking age reasoning)
        const effectiveTimestamp =
          (synthesisOn ? parseISODateOrNull(createdRaw) : null) ?? mtimeMs
        return {
          filename: relativePath,
          filePath,
          mtimeMs: effectiveTimestamp,
          description: frontmatter.description,
          type: parseMemoryType(readMetadataField(frontmatter, 'type')),
          created: createdRaw,
          last_read: readMetadataField(frontmatter, 'last_read'),
          content: synthesisOn ? (bodyAfterFrontmatter.trim() || null) : null,
        }
      }),
    )

    const maxFiles = synthesisOn ? SYNTHESIS_FILE_CAP : SCAN_FILE_CAP   // 250 vs 200
    const results = headers
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
      .slice(0, maxFiles)
    markPerfBoundary('memory_scan')
    return results
  } catch {
    markPerfFailure('memory_scan', 'memory_scan_readdir_failed')
    return []                                                          // bad path → empty list, never throw
  }
}

// Mapping:
// SO$        → scanMemoryFiles
// H          → memoryDir
// $          → signal (AbortSignal)
// q          → synthesisOn (gM() / tengu_billiard_aviary)
// K          → readBudgetLines
// A          → mdFiles
// f          → relativePath / fulfilled-result wrapper / loop var
// O          → filePath
// M          → content (raw file lines)
// w          → mtimeMs (from fs stat)
// D          → frontmatter (parsed YAML)
// j          → bodyAfterFrontmatter (content with frontmatter stripped)
// J          → createdRaw (raw frontmatter.metadata.created)
// X          → effectiveTimestamp
// gM         → isTinyMemoryEnabled
// UK7.readdir → readdir (fs/promises)
// x68.basename → basename (path)
// x68.join    → join (path)
// pOH         → readFileInRange (shared with FileReadTool)
// wBH         → parseFrontmatterAndBody (wrapper around tO)
// LKH         → readMetadataField
// VVK         → parseMemoryType
// jz_         → parseISODateOrNull
// Oz_         → SCAN_FILE_CAP = 200
// Mz_         → SYNTHESIS_FILE_CAP = 250 (was 500 in v2.1.112)
// wz_         → FRONTMATTER_ONLY_LINE_BUDGET = 30
// Dz_         → FULL_BODY_LINE_BUDGET = 200
// RH          → markPerfBoundary
// J8          → markPerfFailure
```

### Why this approach

**Why exclude `MEMORY.md`.** The auto-memory subsystem already loads `MEMORY.md` into the system prompt unconditionally as the "index" file (see [README.md](./README.md) and [memdir_core.md](./memdir_core.md)). Including it in recall results would surface its content twice — once in the system prompt and once as an attachment — wasting context and breaking the prompt-cache stability of the system section. Unchanged from v2.1.112.

**Why read-then-sort (not stat-sort-read).** A straightforward implementation would stat every file, sort by mtime, then read the top-N. That doubles the syscalls on the surviving files. `readFileInRange` *also* stats internally, returning `{content, mtimeMs}` in one shot — so the optimization is to read every file once (paying a small read cost on files that won't survive the slice), then sort. Same as v2.1.112.

**Why `Promise.allSettled` (not `Promise.all`).** A single malformed YAML or unreadable file would otherwise reject the whole scan. `allSettled` lets the survivor set proceed, and the `.filter(r => r.status === "fulfilled")` step drops the rejections silently. The outer `try/catch` returns `[]` only when the *directory itself* is unreadable.

**Why the synthesis-flag branch.**
- Selector-only path (`gM() === false`): `findRelevantMemories` only needs `description` from frontmatter, so a 30-line read budget per file is sufficient. The cap is 200 files (a model can effectively skim that many names+descriptions in a 256-token JSON response).
- Synthesis path (`gM() === true`): `synthesizeRelevantMemories` (cli_inner_pretty.js:237199-237257) calls the model with the *full body* of every memory and asks it to extract atomic facts. To support that, the scan reads 200 lines per file and the cap is 250 files. Reading bodies up-front means the synthesis prompt can be **cached** as a single user message (see [find_relevant_memories.md](./find_relevant_memories.md)).

**Why prefer `frontmatter.metadata.created` over `mtimeMs` in the synthesis path.** `mtimeMs` is fragile: `git checkout` resets it to the checkout timestamp, `rsync` resets it to the transfer time, and `cp -a` may or may not preserve it depending on flags. For an age-reasoning model, that drift is bad — a memory dated "today" because of a `git pull` is misleading. Synthesis explicitly reads an ISO date string from the frontmatter (`jz_` parses `YYYY-MM-DD`) and falls back to `mtimeMs` only when the field is absent. The selector-only path skips this because it never reasons about absolute dates — it only orders newest-first.

**Why the cap dropped from 500 to 250 in v2.1.142.** With "one fact per file" memories, each file is typically a single short paragraph. 250 single-fact memories at ~80 tokens each is ~20K tokens — still within a comfortable cached-manifest budget. The 500-file cap from v2.1.112 came from an era where memories were larger and the synthesis prompt budget was tighter. Halving the cap reduces worst-case manifest tokens without sacrificing typical-case coverage.

### Key insight

The shape of `MemoryHeader` is the **interface contract** between the disk and the model. Every other piece of the memory subsystem treats this object as the source of truth for what a memory *is*: a filename, a path, a timestamp, an optional description, an optional type, and (in synthesis mode) an optional body. The fact that `scanMemoryFiles` can produce headers without ever parsing memory bodies is what makes recall cheap — most calls finish 200 files in tens of milliseconds because each file's read stops after the first 30 lines.

---

## Manifest Formatting

### What it does

`formatMemoryManifest` (`RO$`) renders a `MemoryHeader[]` into the textual list that goes into the LLM prompt. It produces *exactly one line per file* with a stable, parseable layout, and is shared between the recall prompt and the extraction prompt — that sharing matters because both selectors return filenames that the calling code re-maps via `byFilename`, and *that map only works if both prompts render filenames identically.*

### How it works

```javascript
// ============================================
// formatMemoryManifest - Render headers as text manifest
// Location: cli_inner_pretty.js:237113-237130
// ============================================

// ORIGINAL (for source lookup):
function RO$(H) {
  return H.map(($) => {
    let q = $.type ? `[${$.type}] ` : "",
      K = new Date($.mtimeMs).toISOString(),
      _ = `- ${q}${$.filename} (${K})`;
    if ($.content !== null) {
      let A = $.content.replace(/\n/g, `
  `);
      return `${_}
  ${A}`;
    }
    return $.description ? `${_}: ${$.description}` : _;
  }).join(`\n`);
}

// READABLE (for understanding):
function formatMemoryManifest(memories) {
  return memories.map(memory => {
    const typeTag = memory.type ? `[${memory.type}] ` : ''
    const timestamp = new Date(memory.mtimeMs).toISOString()
    const headerLine = `- ${typeTag}${memory.filename} (${timestamp})`

    // Synthesis path: indent body two spaces under the header line
    if (memory.content !== null) {
      const indentedBody = memory.content.replace(/\n/g, '\n  ')
      return `${headerLine}\n  ${indentedBody}`
    }

    // Selector-only path: header + optional description
    return memory.description
      ? `${headerLine}: ${memory.description}`
      : headerLine
  }).join('\n')
}

// Mapping:
// RO$ → formatMemoryManifest
// H   → memories (MemoryHeader[])
// $   → memory (single header)
// q   → typeTag
// K   → timestamp (ISO 8601)
// _   → headerLine
// A   → indentedBody
```

### Why this layout

Same reasoning as v2.1.112:

**Why include the type tag `[user] / [feedback] / [project] / [reference]`.** The selector prompt tells the model to be "especially conservative with user-profile and project-overview memories" — the type tag lets the model identify those categories visually without re-reading the description.

**Why ISO 8601 timestamps in the manifest.** The model often needs to reason about *relative* freshness (e.g., "this is the latest feedback on auth"). A monotonic, sortable string lets it do that without invoking a date library.

**Why two-space indented body lines (synthesis path).** Synthesis surfaces *full bodies* in the manifest. To keep the list visually parseable, body lines are indented under their header — the model sees a clear "header / body / header / body" structure. Without the indent, body lines starting with `-` would be mistaken for header lines.

**Why fall back to the bare header when both content and description are absent.** A file with neither frontmatter nor a description still has a filename and a timestamp — useful even alone.

### Key insight

The manifest is **the model's API to disk**. Every byte that the model sees about which memories exist comes from this function, and it is the only place where the structure of "what the model knows" is defined. The contract is: *the model selects by filename, the host code re-maps via the `byFilename` map.* If the manifest's filename rendering ever drifts from the `byFilename` key, every selection turns into an empty array — silent feature breakage. The fact that the same `formatMemoryManifest` feeds both the selector and the extractor is what guarantees that drift cannot happen.

---

## Cross-Version Notes (v2.1.88 → v2.1.142)

The structural primitive is **identical** between versions; v2.1.142 adapts the body to the new `metadata.*` schema and tunes the synthesis cap.

| Concern | v2.1.88 | v2.1.112 | v2.1.142 | Change vs v2.1.112 |
|---|---|---|---|---|
| MEMORY.md exclusion | yes | yes | yes | none |
| Single-pass read+stat | yes | yes | yes | none |
| `Promise.allSettled` error handling | yes | yes | yes | none |
| Outer try/catch returns `[]` | yes | yes | yes | none |
| Sort by `mtimeMs` desc | yes | yes | yes | none |
| Two-mode (selector/synthesis) | no | yes (`wH` / `tengu_billiard_aviary`) | yes (`gM` / `tengu_billiard_aviary`) | identifier rename only |
| Non-tiny line budget | 30 | 30 | 30 | none |
| Tiny line budget | n/a | 200 | 200 | none |
| Non-tiny file cap | 200 | 200 | 200 | none |
| Tiny file cap | n/a | 500 | 250 | **halved** |
| `created` field | top-level | top-level | `metadata.created` (via `LKH`) | **schema change** |
| `last_read` field | top-level | top-level | `metadata.last_read` (via `LKH`) | **schema change** |
| `type` field | top-level | top-level | `metadata.type` (via `LKH` + `VVK`) | **schema change** |
| Manifest format | identical | identical | identical | none |
| ISO timestamp on manifest | yes | yes | yes | none |
| Two-space body indent | n/a | yes | yes | none |

The cap halving (500 → 250) and the schema migration to `metadata.*` are the two material differences from v2.1.112. The cap change is performance tuning; the schema change is unification with the rest of the codebase's frontmatter pattern (see [frontmatter_parsing.md](./frontmatter_parsing.md)).
