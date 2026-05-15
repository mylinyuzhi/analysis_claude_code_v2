# Read Tool — v2.1.142

## Overview

`FileReadTool` (`$Y` in cli_inner_pretty.js:407219) reads files from the local filesystem and produces a model-facing representation: line-prefixed text for code, base64 images for visual content, page-ranged extracts for PDFs, structured cell lists for Jupyter notebooks. It enforces a binary-extension blocklist, a device-path blocklist (`/dev/zero`, `/dev/urandom`, …), a size cap, and an output-token cap. The tool also implements **dedup**: repeat reads of an unchanged file with the same offset/limit return a `file_unchanged` stub instead of resending content, saving large amounts of cache_creation tokens.

## Schema (Zod)

```javascript
// ============================================
// fileReadInputSchema — FileReadTool input parameters
// Location: cli_inner_pretty.js / C45() at runtime
// ============================================

// ORIGINAL (for source lookup):
// C45() returns z.strictObject({ file_path, offset, limit, pages })

// READABLE (for understanding):
const fileReadInputSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to read'),
  offset: semanticNumber(z.number().optional()).describe('The line number to start reading from. Only provide if the file is too large to read at once'),
  limit: semanticNumber(z.number().optional()).describe('The number of lines to read. Only provide if the file is too large to read at once.'),
  pages: z.string().optional().describe('Page range for PDF files (e.g., "1-5", "3", "10-20"). Maximum 20 pages per request.'),
});

// Mapping: C45→fileReadInputSchema
```

Output schema (`b45()`) is a **discriminated union** over `type`:
- `text` — `{ filePath, content, returnCodeInterpretation, numLines, totalLines, startLine? }`
- `image` — `{ filePath, base64, type, originalSize }`
- `pdf` — `{ filePath, base64, originalSize }`
- `parts` — `{ filePath, originalSize, count, outputDir }` (PDF rendered as per-page images)
- `notebook` — `{ filePath, cells: NotebookCell[] }`
- `file_unchanged` — `{ filePath }` (dedup stub)

`maxResultSizeChars` is **Infinity** for the schema — actual size limits come from `getDefaultFileReadingLimits()` and the caller-supplied `fileReadingLimits` override.

## validateInput

```javascript
// ============================================
// validateInput — PDF page validation + path expansion + deny check + binary/device check
// Location: cli_inner_pretty.js (validateInput on $Y, mirrors src/tools/FileReadTool/FileReadTool.ts:418-495)
// ============================================

// ORIGINAL (for source lookup):
// async validateInput({ file_path, pages }, toolUseContext) {
//   if (pages !== undefined) { /* parsePDFPageRange */ }
//   const fullFilePath = expandPath(file_path);
//   const appState = toolUseContext.getAppState();
//   if (matchingRuleForInput(...) !== null) return { result: !1, message: ..., errorCode: 1 };
//   // UNC bypass, binary ext check (with PDF/image whitelist), device-file blocklist
//   return { result: !0 };
// }

// READABLE (for understanding):
async function validateInput({ file_path, pages }, toolUseContext) {
  // (1) PDF page range validation (pure string parsing, no I/O)
  if (pages !== undefined) {
    const parsed = parsePDFPageRange(pages);
    if (!parsed) return { result: false, message: `Invalid pages parameter: "${pages}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`, errorCode: 7 };
    const rangeSize = parsed.lastPage === Infinity ? PDF_MAX_PAGES_PER_READ + 1 : parsed.lastPage - parsed.firstPage + 1;
    if (rangeSize > PDF_MAX_PAGES_PER_READ) {
      return { result: false, message: `Page range "${pages}" exceeds maximum of ${PDF_MAX_PAGES_PER_READ} pages per request. Please use a smaller range.`, errorCode: 8 };
    }
  }

  // (2) Path expansion + deny-rule check (no I/O)
  const fullFilePath = expandPath(file_path);
  const appState = toolUseContext.getAppState();
  if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, 'read', 'deny') !== null) {
    return { result: false, message: 'File is in a directory that is denied by your permission settings.', errorCode: 1 };
  }

  // (3) UNC bypass (NTLM leak prevention)
  if (fullFilePath.startsWith('\\\\') || fullFilePath.startsWith('//')) return { result: true };

  // (4) Binary extension check — PDF, images, SVG are excluded (rendered natively)
  const ext = path.extname(fullFilePath).toLowerCase();
  if (hasBinaryExtension(fullFilePath) && !isPDFExtension(ext) && !IMAGE_EXTENSIONS.has(ext.slice(1))) {
    return { result: false, message: `This tool cannot read binary files. The file appears to be a binary ${ext} file. Please use appropriate tools for binary file analysis.`, errorCode: 4 };
  }

  // (5) Blocked device files: /dev/zero, /dev/urandom, /dev/stdin, etc.
  if (isBlockedDevicePath(fullFilePath)) {
    return { result: false, message: `Cannot read '${file_path}': this device file would block or produce infinite output.`, errorCode: 9 };
  }

  return { result: true };
}

// Mapping: parsePDFPageRange→parsePDFPageRange (utils), PDF_MAX_PAGES_PER_READ=20,
//          hasBinaryExtension/isPDFExtension/isBlockedDevicePath→utils.ts helpers
```

### Why a binary-extension blocklist?

The model is text-first. Reading a 50MB SQLite database as utf-8 produces garbage that wastes tokens. The blocklist (`.db`, `.sqlite`, `.so`, `.dylib`, `.dll`, `.exe`, `.bin`, `.o`, `.a`, …) tells the model "use a different tool" up-front. PDF/image extensions are whitelisted because the tool renders them natively as image content blocks.

### Why a device-path blocklist?

`/dev/zero` produces infinite output. `/dev/urandom` produces unbounded bytes. `/dev/stdin` blocks waiting for input that never arrives. These paths would hang the tool or fill memory. Safe device files like `/dev/null` are allowed.

### v2.1.140: offset whitespace/`+`-prefix coercion

A regression fixed in 2.1.140: when `offset` was passed as a whitespace-padded string (`" 5 "`) or `+`-prefixed (`"+5"`), validation rejected it. The `semanticNumber` Zod wrapper now coerces both forms. Same for `limit`.

## checkPermissions

```javascript
// ============================================
// FileReadTool.checkPermissions — read permission check
// Location: cli_inner_pretty.js:407268-407271
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions(H, $) {
  let q = $.getAppState();
  return CwH($Y, H, q.toolPermissionContext);
}

// READABLE (for understanding):
async function checkPermissions(input, context) {
  return checkReadPermissionForTool(FileReadTool, input, context.getAppState().toolPermissionContext);
}

// Mapping: CwH→checkReadPermissionForTool
```

The read-permission walker honours `additionalDirectories` (from `--add-dir`), the project root, and `Read(path)` allow/deny rules. Unlike write permissions, the default behaviour for "no rule matched" is **allow** for paths under the project root or `additionalDirectories`, **deny-with-ask** for paths outside.

## call

```javascript
// ============================================
// FileReadTool.call — main execution path with dedup + offset + image/PDF/notebook handling
// Location: cli_inner_pretty.js (call on $Y, mirrors src/tools/FileReadTool/FileReadTool.ts:496-651)
// ============================================

// ORIGINAL (for source lookup):
// async call({ file_path, offset = 1, limit, pages }, context, _canUseTool, parentMessage) {
//   const { readFileState, fileReadingLimits } = context;
//   /* (1) read default limits, (2) check dedup killswitch, (3) check existing state for dedup,
//      (4) skill-dir discovery, (5) callInner for read+render. (6) ENOENT → suggest alternate path. */
// }

// READABLE (for understanding):
async function call({ file_path, offset = 1, limit, pages }, context, _canUseTool, parentMessage) {
  const { readFileState, fileReadingLimits } = context;
  const defaults = getDefaultFileReadingLimits();
  const maxSizeBytes = fileReadingLimits?.maxSizeBytes ?? defaults.maxSizeBytes;
  const maxTokens = fileReadingLimits?.maxTokens ?? defaults.maxTokens;
  const ext = path.extname(file_path).toLowerCase().slice(1);
  const fullFilePath = expandPath(file_path);

  // (1) Dedup gate — return file_unchanged stub on identical re-read
  const dedupKillswitch = getFeatureValue_CACHED_MAY_BE_STALE('tengu_read_dedup_killswitch', false);
  const existingState = dedupKillswitch ? undefined : readFileState.get(fullFilePath);
  if (existingState && !existingState.isPartialView && existingState.offset !== undefined) {
    const rangeMatch = existingState.offset === offset && existingState.limit === limit;
    if (rangeMatch) {
      try {
        const mtimeMs = await getFileModificationTimeAsync(fullFilePath);
        if (mtimeMs === existingState.timestamp) {
          logEvent('tengu_file_read_dedup', { ext: getFileExtensionForAnalytics(fullFilePath) });
          return { data: { type: 'file_unchanged', file: { filePath: file_path } } };
        }
      } catch { /* stat failed — fall through */ }
    }
  }

  // (2) Skill-dir discovery (fire-and-forget)
  if (!isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    const newSkillDirs = await discoverSkillDirsForPaths([fullFilePath], getCwd());
    for (const dir of newSkillDirs) context.dynamicSkillDirTriggers?.add(dir);
    addSkillDirectories(newSkillDirs).catch(() => {});
    activateConditionalSkillsForPaths([fullFilePath], getCwd());
  }

  // (3) Inner read — dispatches to text/image/pdf/notebook handler
  try {
    return await callInner(file_path, fullFilePath, fullFilePath, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, context, parentMessage?.message.id);
  } catch (error) {
    if (getErrnoCode(error) === 'ENOENT') {
      // macOS screenshots use thin-space variants — try the alternate
      const altPath = getAlternateScreenshotPath(fullFilePath);
      if (altPath) { /* retry with altPath */ }

      const similar = findSimilarFile(fullFilePath);
      const cwdSuggest = await suggestPathUnderCwd(fullFilePath);
      let msg = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
      if (cwdSuggest) msg += ` Did you mean ${cwdSuggest}?`;
      else if (similar) msg += ` Did you mean ${similar}?`;
      throw new Error(msg);
    }
    throw error;
  }
}

// Mapping: getDefaultFileReadingLimits→c7H, getFileModificationTimeAsync→async stat wrapper
```

### Key algorithm: dedup

**What it does:** If the model already read this file (same path, same offset, same limit) and the file hasn't changed on disk, return a tiny stub instead of resending the full content.

**How it works:**
1. After every successful read, `readFileState.set(fullFilePath, { content, timestamp, offset, limit })` records the read.
2. On the next read, before doing any work, compare current request's `(offset, limit)` to the stored entry.
3. If they match **and** the file's current mtime equals the stored timestamp, return `{ type: 'file_unchanged', file: { filePath } }`.
4. The model-facing block contains a brief "File unchanged since last read" message — the model knows the content is already in context from the prior turn.

**Why this approach:** Telemetry showed ~18% of Read calls were same-file re-reads (up to 2.64% of fleet `cache_creation` token spend). The prior turn's Read tool_result is still in context, so re-sending the content wastes cache_creation tokens and adds noise. The stub is ~30 bytes vs typical 5-50KB.

**Edge case 1:** `existingState.isPartialView` (set by `offset`+`limit` reads). Don't dedup these — they reflect post-edit mtime, so deduping against them would point the model at pre-edit content.

**Edge case 2:** Edit/Write store `offset: undefined` in `readFileState` (they ran a full write). Dedup only applies when `existingState.offset !== undefined` (came from a real Read).

**Killswitch:** `tengu_read_dedup_killswitch` GB feature flag. If the model gets confused by the stub message externally, GB can flip the flag without a release.

### Key algorithm: line-numbered output

**What it does:** Code reads produce `cat -n`-style output: `<line_number>\t<content>`. This lets the model reference specific lines and tell the user "see line 42 of file.ts".

**How it works:**
1. Read file as bytes. Detect encoding (UTF-16 LE BOM → utf16le; fall back to utf8).
2. Decode + split on `\n`. Track total line count.
3. Slice `[offset-1, offset-1+limit]` (offsets are **1-based**).
4. Format each line as `${lineNumber}\t${content}` (line numbers right-padded for alignment if all are short).
5. Cap individual line length to 2000 chars (then `... (truncated)`). Cap total content to `maxTokens` tokens.

**Why this approach:** The Edit tool's `old_string` is matched against decoded **content** (without line-number prefixes). The prompt explicitly tells the model: "Strip the Read line prefix (line number + tab) before matching." This split lets the model use Read output as both a viewer and an Edit source.

### Key algorithm: PDF page range parsing

**What it does:** Convert `"1-5,8,10-12"` into a list of 1-based pages.

**How it works:** `parsePDFPageRange` splits on `,`, parses each piece as either `N` or `N-M`, and returns `[{ firstPage, lastPage }]`. The total page span (regardless of gaps) is capped at `PDF_MAX_PAGES_PER_READ = 20` per request — prevents OOM on giant PDFs and keeps the response bounded.

**Why a 20-page cap:** Each page renders to ~150KB of image base64 at our default DPI. 20 pages × 150KB = 3MB, which is at the upper bound of what fits comfortably in a single message.

### Image compression (v2.1.97)

PNG/JPG/GIF/WebP images are returned as base64 image content blocks. Pre-2.1.97, the tool emitted images at full resolution. From 2.1.97, images are **downscaled on read** if either dimension exceeds 2000px (or 2576px on legacy paths — fixed in 2.1.122 to use 2000 consistently). Original aspect ratio preserved. Compression uses `sharp` (if available) or a JS fallback.

**Why:** The model's vision encoder downsamples to ~1568px internally anyway. Sending a 4032×3024 photo wastes ~10x bandwidth and triggers session-breaking message size limits.

### Malware assessment removal (v2.1.126)

Pre-2.1.126, every Read call appended a `CYBER_RISK_MITIGATION_REMINDER` to the model's tool_result. This caused legacy models to occasionally refuse benign reads with "this is not malware" commentary. Removed in 2.1.126:

> Read tool: removed the per-file malware-assessment reminder that could cause spurious refusals and "this is not malware" commentary on legacy models

The reminder still exists for specific high-risk paths (`.env`, `id_rsa`, …) but is no longer fired per-file unconditionally.

## Render methods

- `renderToolUseMessage` (`pe7`) — `Read(path)` with optional `offset`/`limit` annotation.
- `renderToolUseTag` (`Ue7`) — short tag for the tool-use line in compact rendering.
- `renderToolResultMessage` (`Fe7`) — show summary chrome only: `Read 142 lines`, `Read image (42KB)`, `Read PDF pages 1-5`. **Never** the content itself.
- `renderToolUseErrorMessage` — for validateInput failures.

`extractSearchText` returns `""` because the content never appears in the UI rendering — there's nothing to index. The model-side serialisation (via `mapToolResultToToolResultBlockParam`) handles content+line-prefixes+CYBER_RISK reminder.

`mapToolResultToToolResultBlockParam` dispatches on `data.type`:
- `text` → `{ content: [<text-block with content>] }`
- `image` → `{ content: [{ type: 'image', source: { type: 'base64', data, media_type } }] }`
- `notebook` → uses `mapNotebookCellsToToolResult` which produces a structured cell list
- `pdf` → returns metadata block + supplemental `DocumentBlockParam` with the base64 PDF
- `parts` → image content blocks per extracted page
- `file_unchanged` → "File unchanged since last read at `{filePath}`."

## Key insights

1. **Three different "permission denials" can happen.** (a) `matchingRuleForInput(..., 'read', 'deny')` from validateInput. (b) `checkReadPermissionForTool` returning `{behavior: 'deny'}`. (c) The path being a UNC path that the validator skips but the permission layer denies. The validator deliberately defers I/O for UNC paths.

2. **`extractSearchText` returns `""`**. This is a deliberate under-count rather than a phantom — the tool result content is never shown in the UI render, only summary chrome. The tool_use is already indexed by `file_path`, so transcript search still works.

3. **Image content blocks pass through `buildImageToolResult`.** This handles content-type detection (PNG vs JPEG vs GIF vs WebP), normalises to the model's expected `image/...` media type, and applies the 2000px downscale.

4. **`backfillObservableInput`** runs `expandPath` on `file_path` so hooks defined for `Read("/abs/path/**")` aren't bypassed by `Read("./relative")`.

5. **The screenshot alternate-path retry.** macOS screenshot filenames sometimes use a thin space (U+2009) before AM/PM and sometimes a regular space. The tool retries the read with the alternate variant before reporting ENOENT. Without this, the user couldn't reliably read screenshots saved to the desktop.

6. **`offset` and `limit` are stored even on success.** They're written into `readFileState[path]` so the dedup gate can compare future identical reads.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.117 | Subagents running a different model than the main agent no longer flag file reads with a malware warning | malware-warning gate |
| 2.1.119 | SDK/bridge `read_file` size cap correctly enforced on growing files | size cap loop |
| 2.1.121 | Memory growth fix (multi-GB RSS) when processing many images in a session | image cache pruning |
| 2.1.122 | Images sent to newer models resized to 2576px → corrected to 2000px max (regression fix) | downscale path |
| 2.1.126 | Removed per-file malware-assessment reminder; large image paste downscales on paste | `mapToolResultToToolResultBlockParam` |
| 2.1.126 | Pasting an image larger than 2000px broke the session — images now downscaled on paste, oversized images in history removed and retried | image pipeline |
| 2.1.133 | Read denied on mapped network drives via `--add-dir` / SDK `additionalDirectories` — fixed | permission check |
| 2.1.140 | `Read` tool calls failing validation when `offset` is whitespace-padded or `+`-prefixed string — fixed | `semanticNumber` |
| 2.1.142 | (no Read-specific functional changes; touches are upstream — image downscale and skill discovery integrations are unchanged) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `FileReadTool` ($Y) — top-level tool object built by `XK` (buildTool factory)
- `checkReadPermissionForTool` (CwH) — common read-permission walker
- `getDefaultFileReadingLimits` (c7H) — default size + token caps
- `getFileModificationTime` (oN) — sync stat
- `parsePDFPageRange` — convert "1-5,8" → [{firstPage, lastPage}]
- `findSimilarFile` — Levenshtein-ish file-name suggestion for ENOENT
- `suggestPathUnderCwd` — suggest a real file under cwd matching the input basename
- `getAlternateScreenshotPath` — macOS screenshot thin-space fallback
- `mapNotebookCellsToToolResult` — render notebook cells as model-facing blocks
- `buildImageToolResult` — image block builder with downscale
- `hasBinaryExtension` / `isPDFExtension` / `IMAGE_EXTENSIONS` — extension classifiers
- `isBlockedDevicePath` — device-file blocklist (/dev/zero, /dev/urandom, /dev/stdin)
- `PDF_MAX_PAGES_PER_READ` — 20-page cap per request
