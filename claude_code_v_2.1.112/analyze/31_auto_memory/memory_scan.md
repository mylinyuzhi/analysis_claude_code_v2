# Memory Scan — `memoryScan.ts` (v2.1.112)

## Module Overview

`memoryScan.ts` provides the *directory-traversal primitive* for the entire auto-memory subsystem. It walks the on-disk memory directory, parses YAML frontmatter from each `.md` file, and returns a sorted, capped list of memory file headers. Every other recall and extraction path — `findRelevantMemories`, `synthesizeRelevantMemories`, and `extractMemories` — calls into this module, so its three contracts (newest-first ordering, single-pass stat/read, MEMORY.md exclusion) are load-bearing for the whole feature.

**v2.1.88 source** : `/lyz/codespace/3rd/claude-code/src/memdir/memoryScan.ts` (94 lines).
**v2.1.112 chunk** : `chunks.99.mjs:553-601` (functions `t88` and `e88`).

This module was historically embedded inside `findRelevantMemories.ts`; the v2.1.88 file header records the reason for the split (cyclic import — `extractMemories` needed the scan but couldn't import a file that pulled in the API client). The split also lets the recall and extraction paths share *exactly the same* manifest format so the model sees one stable representation across both prompts.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_04.md](../00_overview/symbol_additions_unit_04.md) — symbols added by this unit
> - [symbol_index.md](../00_overview/symbol_index.md) — v2.1.88 → v2.1.112 scoped diff index

Key functions in this document:
- `scanMemoryFiles` (`t88`) — Directory walker that returns `MemoryHeader[]` (chunks.99.mjs:553-585)
- `formatMemoryManifest` (`e88`) — Manifest builder for both recall and extraction prompts (chunks.99.mjs:587-601)
- `parseMemoryType` (`CC4`) — Validating type coercion used by the scan (see [memory_types.md](./memory_types.md))
- `parseFrontmatter` (`p2`) — YAML frontmatter parser (chunks.86.mjs)
- `readFileInRange` (`m56`) — Read-with-stat utility shared with FileReadTool (chunks-wide)
- `MAX_MEMORY_FILES` (`FMz` = 200, `gMz` = 500) — Per-directory cap, branching on synthesis flag
- `FRONTMATTER_MAX_LINES` (`UMz` = 30, `QMz` = 200) — Per-file read budget, branching on synthesis flag

## File Discovery

### What it does

`scanMemoryFiles` enumerates a memory directory, reads the top portion of every `.md` file, parses YAML frontmatter from each, and returns a `MemoryHeader[]` sorted newest-first and capped at a maximum count. The cap and the per-file read budget both *branch on the `wH()` "synthesis" feature flag* (`tengu_billiard_aviary`) because the synthesis path also needs the **body content**, not just the frontmatter.

### How it works

```javascript
// ============================================
// scanMemoryFiles - Directory walk → MemoryHeader[]
// Location: chunks.99.mjs:553-585
// ============================================

// ORIGINAL (for source lookup):
async function t88(q, K) {
    let _ = wH(),
        z = _ ? QMz : UMz;
    try {
        let A = (await mMz(q, {
            recursive: !0
        })).filter((w) => w.endsWith(".md") && BMz(w) !== "MEMORY.md");
        return (await Promise.allSettled(A.map(async (w) => {
            let $ = pMz(q, w),
                { content: j, mtimeMs: H } = await m56($, 0, z, void 0, K),
                { frontmatter: J, content: X } = p2(j, $),
                M = (_ ? dMz(J.created) : null) ?? H;
            return {
                filename: w,
                filePath: $,
                mtimeMs: M,
                description: J.description || null,
                type: CC4(J.type),
                created: typeof J.created === "string" ? J.created : null,
                last_read: typeof J.last_read === "string" ? J.last_read : null,
                content: _ ? X.trim() || null : null
            }
        }))).filter((w) => w.status === "fulfilled").map((w) => w.value).sort((w, $) => $.mtimeMs - w.mtimeMs).slice(0, _ ? gMz : FMz)
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function scanMemoryFiles(memoryDir, signal) {
    const synthesisOn = isSynthesisEnabled();                      // wH = tengu_billiard_aviary
    const readBudgetLines = synthesisOn
        ? FULL_BODY_LINE_BUDGET                                    // 200 — read full body for synthesis
        : FRONTMATTER_ONLY_LINE_BUDGET;                            // 30  — frontmatter sufficient for recall

    try {
        const entries = await readdir(memoryDir, { recursive: true });
        const mdFiles = entries.filter(
            f => f.endsWith(".md") && basename(f) !== "MEMORY.md"  // index file is loaded separately
        );

        const headers = await Promise.allSettled(
            mdFiles.map(async (relativePath) => {
                const filePath = join(memoryDir, relativePath);
                const { content, mtimeMs } = await readFileInRange(
                    filePath, 0, readBudgetLines, undefined, signal
                );
                const { frontmatter, content: bodyAfterFrontmatter } = parseFrontmatter(content, filePath);

                // synthesis branch: prefer explicit "created:" frontmatter to fs mtime
                // (mtime drifts on rsync/git checkout, breaking age reasoning)
                const effectiveTimestamp =
                    (synthesisOn ? parseISODate(frontmatter.created) : null) ?? mtimeMs;

                return {
                    filename: relativePath,
                    filePath,
                    mtimeMs: effectiveTimestamp,
                    description: frontmatter.description || null,
                    type: parseMemoryType(frontmatter.type),
                    created: typeof frontmatter.created === "string" ? frontmatter.created : null,
                    last_read: typeof frontmatter.last_read === "string" ? frontmatter.last_read : null,
                    content: synthesisOn ? (bodyAfterFrontmatter.trim() || null) : null,
                };
            })
        );

        const maxFiles = synthesisOn ? SYNTHESIS_FILE_CAP : SCAN_FILE_CAP;   // 500 vs 200
        return headers
            .filter(r => r.status === "fulfilled")
            .map(r => r.value)
            .sort((a, b) => b.mtimeMs - a.mtimeMs)
            .slice(0, maxFiles);
    } catch {
        return [];                                                 // bad path → empty list, never throw
    }
}

// Mapping:
// t88        → scanMemoryFiles
// q          → memoryDir
// K          → signal (AbortSignal)
// _          → synthesisOn (wH() / tengu_billiard_aviary)
// z          → readBudgetLines
// A          → mdFiles
// w          → relativePath / fulfilled-result wrapper
// $          → filePath
// j          → content (raw file lines)
// H          → mtimeMs (from fs stat)
// J          → frontmatter (parsed YAML)
// X          → bodyAfterFrontmatter (content with frontmatter stripped)
// M          → effectiveTimestamp
// wH         → isSynthesisEnabled (chunks.64.mjs:1327)
// mMz        → readdir (fs/promises)
// BMz        → basename (path)
// pMz        → join (path)
// m56        → readFileInRange (shared with FileReadTool)
// p2         → parseFrontmatter (chunks.86.mjs)
// CC4        → parseMemoryType (chunks.99.mjs:516)
// dMz        → parseISODate (chunks.99.mjs:542-551)
// FMz        → SCAN_FILE_CAP = 200
// gMz        → SYNTHESIS_FILE_CAP = 500
// UMz        → FRONTMATTER_ONLY_LINE_BUDGET = 30
// QMz        → FULL_BODY_LINE_BUDGET = 200
```

### Why this approach

**Why exclude `MEMORY.md`.** The auto-memory subsystem already loads `MEMORY.md` into the system prompt unconditionally as the "index" file (see [README.md](./README.md) and `memdir_core.md`). Including it in recall results would surface its content twice — once in the system prompt and once as an attachment — wasting context and breaking the prompt-cache stability of the system section.

**Why read-then-sort (not stat-sort-read).** A straightforward implementation would stat every file, sort by mtime, then read the top-N. That doubles the syscalls on the surviving files. `readFileInRange` *also* stats internally, returning `{content, mtimeMs}` in one shot — so the optimization is to read every file once (paying a small read cost on files that won't survive the slice), then sort. The v2.1.88 author calls this out in the source comment:
  > "Single-pass: readFileInRange stats internally and returns mtimeMs, so we read-then-sort rather than stat-sort-read. For the common case (N ≤ 200) this halves syscalls vs a separate stat round."

**Why `Promise.allSettled` (not `Promise.all`).** A single malformed YAML or unreadable file would otherwise reject the whole scan. `allSettled` lets the survivor set proceed, and the `.filter(r => r.status === "fulfilled")` step drops the rejections silently. The outer `try/catch` returns `[]` only when the *directory itself* is unreadable.

**Why the synthesis-flag branch.**
- Selector-only path (`wH() === false`): `findRelevantMemories` only needs `description` from frontmatter, so a 30-line read budget per file is sufficient. The cap is 200 files (a model can effectively skim that many names+descriptions in a 256-token JSON response).
- Synthesis path (`wH() === true`): `synthesizeRelevantMemories` (chunks.99.mjs:687) calls the model with the *full body* of every memory and asks it to extract atomic facts. To support that, the scan reads 200 lines per file and the cap grows to 500 files. Reading bodies up-front means the synthesis prompt can be **cached** as a single user message (see `OQ1` / `wQ1` in chunks.86.mjs:2640-2678), so subsequent queries in the same session pay only for the incremental query text.

**Why prefer `frontmatter.created` over `mtimeMs` in the synthesis path.** `mtimeMs` is fragile: `git checkout` resets it to the checkout timestamp, `rsync` resets it to the transfer time, and `cp -a` may or may not preserve it depending on flags. For an age-reasoning model, that drift is bad — a memory dated "today" because of a `git pull` is misleading. Synthesis explicitly reads an ISO date string from the frontmatter (`dMz` parses `YYYY-MM-DD`) and falls back to `mtimeMs` only when the field is absent. The selector-only path skips this because it never reasons about absolute dates — it only orders newest-first.

### Key insight

The shape of `MemoryHeader` is the **interface contract** between the disk and the model. Every other piece of the memory subsystem treats this object as the source of truth for what a memory *is*: a filename, a path, a timestamp, an optional description, an optional type, and (in synthesis mode) an optional body. The fact that `scanMemoryFiles` can produce headers without ever parsing memory bodies is what makes recall cheap — most calls finish 200 files in tens of milliseconds because each file's read stops after the first 30 lines.

---

## Manifest Formatting

### What it does

`formatMemoryManifest` (`e88`) renders a `MemoryHeader[]` into the textual list that goes into the LLM prompt. It produces *exactly one line per file* with a stable, parseable layout, and is shared between the recall prompt (`SELECT_MEMORIES_SYSTEM_PROMPT`) and the extraction prompt — that sharing matters because both selectors return filenames that the calling code re-maps via `byFilename`, and *that map only works if both prompts render filenames identically.*

### How it works

```javascript
// ============================================
// formatMemoryManifest - Render headers as text manifest
// Location: chunks.99.mjs:587-601
// ============================================

// ORIGINAL (for source lookup):
function e88(q) {
    return q.map((K) => {
        let _ = K.type ? `[${K.type}] ` : "",
            z = new Date(K.mtimeMs).toISOString(),
            Y = `- ${_}${K.filename} (${z})`;
        if (K.content !== null) {
            let A = K.content.replace(/\n/g, `
  `);
            return `${Y}
  ${A}`
        }
        return K.description ? `${Y}: ${K.description}` : Y
    }).join(`
`)
}

// READABLE (for understanding):
function formatMemoryManifest(memories) {
    return memories.map(memory => {
        const typeTag = memory.type ? `[${memory.type}] ` : "";
        const timestamp = new Date(memory.mtimeMs).toISOString();
        const headerLine = `- ${typeTag}${memory.filename} (${timestamp})`;

        // Synthesis path: indent body two spaces under the header line
        if (memory.content !== null) {
            const indentedBody = memory.content.replace(/\n/g, "\n  ");
            return `${headerLine}\n  ${indentedBody}`;
        }

        // Selector-only path: header + optional description
        return memory.description
            ? `${headerLine}: ${memory.description}`
            : headerLine;
    }).join("\n");
}

// Mapping:
// e88 → formatMemoryManifest
// q   → memories (MemoryHeader[])
// K   → memory (single header)
// _   → typeTag
// z   → timestamp (ISO 8601)
// Y   → headerLine
// A   → indentedBody
```

### Why this layout

**Why include the type tag `[user] / [feedback] / [project] / [reference]`.** The selector prompt explicitly tells the model to be "especially conservative with user-profile and project-overview memories" (`[user]`, `[project]`) — the type tag lets the model identify those categories visually without re-reading the description. The tag is *omitted* when the type is missing so legacy files without frontmatter remain in the manifest.

**Why ISO 8601 timestamps in the manifest.** The model often needs to reason about *relative* freshness (e.g., "this is the latest feedback on auth"). A monotonic, sortable string lets it do that without invoking a date library. The selector prompt was tuned against ISO format specifically — switching to "5 days ago" prose here would lose monotonic comparability.

**Why two-space indented body lines (synthesis path).** Synthesis surfaces *full bodies* in the manifest. To keep the list visually parseable, body lines are indented under their header — the model sees a clear "header / body / header / body" structure and the system prompt explicitly references "the first message lists every available memory file with its frontmatter and full body" (chunks.99.mjs:777, the `lMz` constant). Without the indent, body lines starting with `-` would be mistaken for header lines.

**Why fall back to the bare header when both content and description are absent.** A file with neither frontmatter nor a description still has a filename and a timestamp — useful even alone. The model can then ask "is this the file the user wants?" purely from naming. Dropping nameless files would be wrong (a memory file is allowed to omit frontmatter and the type system degrades gracefully — see `memory_types.md`).

### Key insight

The manifest is **the model's API to disk**. Every byte that the model sees about which memories exist comes from this function, and it is the only place where the structure of "what the model knows" is defined. The contract is: *the model selects by filename, the host code re-maps via the `byFilename` map produced in `OQ1` (chunks.86.mjs:2640).* If the manifest's filename rendering ever drifts from the `byFilename` key, every selection turns into an empty array — silent feature breakage. The fact that the same `formatMemoryManifest` feeds both the selector and the extractor is what guarantees that drift cannot happen.

---

## Cross-Version Notes (v2.1.88 → v2.1.112)

The structural primitive is **identical** between versions; the v2.1.112 chunks materially expand on v2.1.88's `memoryScan.ts` in three places:

1. **New synthesis branch.** v2.1.88's `scanMemoryFiles` had no `wH()` flag — it always read 30 lines per file and capped at 200. v2.1.112 introduces the dual mode (frontmatter-only vs full-body) gated on `tengu_billiard_aviary` and grows the cap to 500 in the synthesis branch.
2. **New `created` / `last_read` frontmatter fields.** These are passed through to `MemoryHeader` and (for `created`) preferred over `mtimeMs` when present. v2.1.88's `MemoryHeader` only carried `description` and `type`.
3. **New `content` field on `MemoryHeader`.** In v2.1.88, `MemoryHeader` never carried the body — only a list of headers, then a second read pass for the surviving 5. v2.1.112 plumbs the body through the first scan so the synthesis cache (`OQ1` / `wQ1`) can store it without reading twice.

The manifest format gained the two-space-indented body lines for the synthesis path; otherwise the line-per-file rendering is byte-identical to v2.1.88.

The single-pass `read-then-sort` optimization, the `MEMORY.md` filter, and the `Promise.allSettled` + outer-catch error handling are all unchanged.
