# Grep Tool — v2.1.142

## Overview

`GrepTool` (`hV` in cli_inner_pretty.js:339026) is a content-search tool built on ripgrep (`rg`). It exposes ripgrep's regex syntax with three output modes (`content`, `files_with_matches`, `count`), context flags (`-A`/`-B`/`-C`), case insensitivity (`-i`), line numbers (`-n`), multiline mode, type/glob filters, and a `head_limit` + `offset` pagination layer. On native builds it uses an embedded ripgrep binary; npm builds use the system `rg`.

User-facing tool name: **`Search`** (`userFacingName()` returns `'Search'`).

## Schema (Zod)

```javascript
// ============================================
// grepInputSchema — GrepTool input parameters
// Location: cli_inner_pretty.js (lazy schema iF_)
// ============================================

// ORIGINAL (for source lookup):
// iF_() returns z.strictObject({ pattern, path?, glob?, output_mode?, '-B'?, '-A'?, '-C'?, context?, '-n'?, '-i'?, type?, head_limit?, offset?, multiline?, '-o'? })

// READABLE (for understanding):
const grepInputSchema = z.strictObject({
  pattern: z.string().describe('The regular expression pattern to search for in file contents'),
  path: z.string().optional().describe('File or directory to search in (rg PATH). Defaults to current working directory.'),
  glob: z.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
  output_mode: z.enum(['content', 'files_with_matches', 'count']).optional().describe(
    'Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), ' +
    '"files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). ' +
    'Defaults to "files_with_matches".'
  ),
  '-B': semanticNumber(z.number().optional()).describe('Lines to show before each match (rg -B). Requires output_mode: "content".'),
  '-A': semanticNumber(z.number().optional()).describe('Lines to show after each match (rg -A). Requires output_mode: "content".'),
  '-C': semanticNumber(z.number().optional()).describe('Alias for context.'),
  context: semanticNumber(z.number().optional()).describe('Lines to show before+after each match (rg -C). Requires output_mode: "content".'),
  '-n': semanticBoolean(z.boolean().optional()).describe('Show line numbers in output (rg -n). Requires output_mode: "content". Defaults to true.'),
  '-i': semanticBoolean(z.boolean().optional()).describe('Case insensitive search (rg -i)'),
  type: z.string().optional().describe('File type to search (rg --type). Common types: js, py, rust, go, java, etc.'),
  head_limit: semanticNumber(z.number().optional()).describe('Limit output to first N lines/entries. Defaults to 250. Pass 0 for unlimited.'),
  offset: semanticNumber(z.number().optional()).describe('Skip first N lines/entries. Defaults to 0.'),
  multiline: semanticBoolean(z.boolean().optional()).describe('Enable multiline mode where . matches newlines (rg -U --multiline-dotall).'),
});

// Mapping: iF_→grepInputSchema, Pb→semanticNumber, P2→semanticBoolean
```

Output schema (`aF_()`):
- `mode: 'content' | 'files_with_matches' | 'count'`
- `numFiles: number`
- `filenames: string[]`
- `content?: string` (for `content` and `count` modes)
- `numLines?: number` (for `content` mode)
- `numMatches?: number` (for `count` mode)
- `appliedLimit?: number` (set when truncation occurred)
- `appliedOffset?: number` (set when offset > 0)

`maxResultSizeChars` is **20,000** — anything larger spills to persisted output. Smaller than other tools because grep content fills up fast on broad patterns.

## validateInput

```javascript
// ============================================
// validateInput — only validates that path exists when supplied
// Location: cli_inner_pretty.js:339066-339083
// ============================================

// ORIGINAL (for source lookup):
// async validateInput({ path: H }) {
//   if (H) {
//     /* fs.stat absolute path, UNC bypass, ENOENT → suggestPathUnderCwd → error */
//   }
//   return { result: !0 };
// }

// READABLE (for understanding):
async function validateInput({ path }) {
  if (path) {
    const fs = getFsImplementation();
    const absolutePath = expandPath(path);
    if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) return { result: true };
    try {
      await fs.stat(absolutePath);
    } catch (e) {
      if (isENOENT(e)) {
        const cwdSuggest = await suggestPathUnderCwd(absolutePath);
        let message = `Path does not exist: ${path}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
        if (cwdSuggest) message += ` Did you mean ${cwdSuggest}?`;
        return { result: false, message, errorCode: 1 };
      }
      throw e;
    }
  }
  return { result: true };
}

// Mapping: standard imports
```

Note: unlike GlobTool, Grep accepts both **file** paths and **directory** paths (ripgrep handles either), so no `isDirectory()` check. Just an existence check.

## checkPermissions

Identical to GlobTool: shared `checkReadPermissionForTool` walker. `getPath` returns the search root (`path || getCwd()`).

## call

```javascript
// ============================================
// GrepTool.call — assemble rg args + apply head_limit/offset + relativize paths
// Location: cli_inner_pretty.js:339140-339330 (mirrors src/tools/GrepTool/GrepTool.ts:310-577)
// ============================================

// ORIGINAL (for source lookup):
// async call({ pattern, path, glob, type, output_mode = "files_with_matches", '-B', '-A', '-C', context, '-n', '-i', '-o', head_limit, offset = 0, multiline = !1 }, { abortController, getAppState }) {
//   /* assemble rg args (hidden, max-columns 500, VCS exclusions, multiline, case, output_mode, line numbers, context),
//      then pattern (with -e prefix if leading dash), type filter, glob filters (brace-aware split),
//      then ignore patterns + plugin-cache exclusions, then invoke ripGrep, then post-process by mode */
// }

// READABLE (for understanding):
async function call(input, { abortController, getAppState }) {
  const { pattern, path, glob, type, output_mode = 'files_with_matches',
          '-B': contextBefore, '-A': contextAfter, '-C': contextC, context,
          '-n': showLineNumbers = true, '-i': caseInsensitive = false, '-o': onlyMatching = false,
          head_limit, offset = 0, multiline = false } = input;

  const absolutePath = path ? expandPath(path) : getCwd();
  const args = ['--hidden'];

  // (1) Exclude VCS directories
  for (const dir of VCS_DIRECTORIES_TO_EXCLUDE) args.push('--glob', `!${dir}`);
  args.push('--max-columns', '500');  // (2) Limit per-line length

  if (multiline) args.push('-U', '--multiline-dotall');
  if (caseInsensitive) args.push('-i');

  // (3) Output mode flags
  if (output_mode === 'files_with_matches') args.push('-l');
  else if (output_mode === 'count') args.push('-c', '-H');
  if (showLineNumbers && output_mode === 'content') args.push('-n');
  if (onlyMatching && output_mode === 'content') args.push('-o');

  // (4) Context flags (only for content mode)
  if (output_mode === 'content') {
    if (context !== undefined) args.push('-C', context.toString());
    else if (contextC !== undefined) args.push('-C', contextC.toString());
    else {
      if (contextBefore !== undefined) args.push('-B', contextBefore.toString());
      if (contextAfter !== undefined) args.push('-A', contextAfter.toString());
    }
  }

  // (5) Pattern (use -e if it starts with - to prevent option misinterpretation)
  if (pattern.startsWith('-')) args.push('-e', pattern);
  else args.push(pattern);

  // (6) Type / glob filters
  if (type) args.push('--type', type);
  if (glob) {
    // Split on spaces, but keep brace expansions intact; then split on commas
    const globPatterns = [];
    for (const raw of glob.split(/\s+/)) {
      if (raw.includes('{') && raw.includes('}')) globPatterns.push(raw);
      else globPatterns.push(...raw.split(',').filter(Boolean));
    }
    for (const p of globPatterns.filter(Boolean)) args.push('--glob', p);
  }

  // (7) Ignore patterns from permission context
  const appState = getAppState();
  const ignorePatterns = normalizePatternsToPath(getFileReadIgnorePatterns(appState.toolPermissionContext), getCwd());
  for (const ignorePattern of ignorePatterns) {
    const rgIgnore = ignorePattern.startsWith('/') ? `!${ignorePattern}` : `!**/${ignorePattern}`;
    args.push('--glob', rgIgnore);
  }

  // (8) Plugin-cache exclusions (orphaned plugin versions)
  for (const exclusion of await getGlobExclusionsForPluginCache(absolutePath)) {
    args.push('--glob', exclusion);
  }

  // (9) Run ripgrep
  const results = await ripGrep(args, absolutePath, abortController.signal);

  // (10) Post-process based on mode
  if (output_mode === 'content') {
    const { items: limitedResults, appliedLimit } = applyHeadLimit(results, head_limit, offset);
    const finalLines = limitedResults.map(line => {
      // Lines have format: /absolute/path:line_content or /absolute/path:num:content
      // On Windows drive letters (C:) we have to skip the first 2 chars to avoid splitting on the drive colon
      const drivePrefix = /^[A-Za-z]:/.test(line) ? 2 : 0;
      const colonIndex = line.indexOf(':', drivePrefix);
      if (colonIndex > 0) {
        const filePath = line.substring(0, colonIndex);
        const rest = line.substring(colonIndex);
        return toRelativePath(filePath) + rest;
      }
      return line;
    });
    return { data: { mode: 'content', numFiles: 0, filenames: [], content: finalLines.join('\n'), numLines: finalLines.length, ...(appliedLimit !== undefined && { appliedLimit }), ...(offset > 0 && { appliedOffset: offset }) } };
  }

  if (output_mode === 'count') {
    /* similar — Windows drive-letter aware colon split, parse count, sum totals */
  }

  // files_with_matches default — stat for mtime sort, head_limit, relativize
  const stats = await Promise.allSettled(results.map(p => getFsImplementation().stat(p)));
  const sortedMatches = results
    .map((p, i) => [p, stats[i].status === 'fulfilled' ? (stats[i].value.mtimeMs ?? 0) : 0])
    .sort((a, b) => {
      if (process.env.NODE_ENV === 'test') return a[0].localeCompare(b[0]);
      const dt = b[1] - a[1];
      return dt === 0 ? a[0].localeCompare(b[0]) : dt;
    })
    .map(p => p[0]);
  const { items: finalMatches, appliedLimit } = applyHeadLimit(sortedMatches, head_limit, offset);
  const relativeMatches = finalMatches.map(toRelativePath);
  return { data: { mode: 'files_with_matches', filenames: relativeMatches, numFiles: relativeMatches.length, ...(appliedLimit !== undefined && { appliedLimit }), ...(offset > 0 && { appliedOffset: offset }) } };
}

// Mapping: rF_→VCS_DIRECTORIES_TO_EXCLUDE [.git, .svn, .hg, .bzr, .jj, .sl],
//          wt→ripGrep, ilH→normalizePatternsToPath, rlH→getFileReadIgnorePatterns,
//          nlH→getGlobExclusionsForPluginCache, wT6→applyHeadLimit, FRH→toRelativePath
```

### Key algorithm: head_limit + offset

**What it does:** Cap result count (`head_limit`) and skip the first N results (`offset`) — both work across all three output modes.

**How it works:** `applyHeadLimit(items, limit, offset)`:
1. `limit === 0` → unlimited (escape hatch); slice off `offset` items.
2. `limit ?? DEFAULT_HEAD_LIMIT` (250) is the effective cap.
3. Slice `[offset, offset + effectiveLimit]`.
4. `wasTruncated = items.length - offset > effectiveLimit` — only set `appliedLimit` when truncation actually happened, so the model knows there may be more results and can paginate via `offset`.

**Why this approach:** Broad content-mode greps fill up the 20KB persisted threshold easily — `class.*` against a node_modules can produce 10k+ lines. 250 is a generous default for exploratory searches while preventing context bloat. Explicit 0 lets the model say "I really do want all of it" without changing the default.

**Edge case:** `appliedLimit` is only set on truncation. The display path uses its presence to decide whether to print the "(Showing results with pagination = limit: N)" footer. Pre-2.1.139, it was set unconditionally, which produced "limit: undefined" in user-visible output when truncation hadn't happened.

### Key algorithm: glob splitting with brace-aware tokenisation

**What it does:** Accept `glob: "*.ts *.tsx"` and `glob: "*.{ts,tsx}"` and `glob: "*.ts,*.tsx"` all working.

**How it works:**
1. Split outer-level on whitespace.
2. For each token, if it contains both `{` and `}`, treat it as a brace expansion and pass through unchanged.
3. Otherwise, split on commas.

**Why this approach:** Ripgrep doesn't parse the model's compact glob list — it expects one `--glob` flag per pattern. Brace expansions are a single ripgrep glob; comma-separated lists are user-friendly shorthand. The two are visually similar, so the splitter handles both.

### Key algorithm: file-relative path output (v2.1.139)

**What it does:** Convert absolute paths in ripgrep output to relative paths.

**How it works:** Ripgrep output formats:
- `files_with_matches` mode: one absolute path per line
- `content` mode: `<absolute_path>:<content>` or `<absolute_path>:<line>:<content>`
- `count` mode: `<absolute_path>:<count>`

The relativization splits on the first `:`, relativises the path, and rejoins. Pre-2.1.139, this produced wrong output for Windows drive-letter paths like `C:\path\to\file.ts:42:match`. The `C:` was treated as a path-content separator, leaving `\path\to\file.ts:42:match` as the "content".

**Fix:** Detect Windows drive-letter prefix (`/^[A-Za-z]:/`) and skip the first 2 characters when looking for the path-content separator colon. The first `:` after the drive prefix is the real separator.

Quote from 2.1.139 changelog:
> Fixed Grep results not relativizing Windows drive-letter paths and count mode reporting wrong totals for single-file paths

The single-file count fix is in the count-mode parser: when ripgrep receives a single file path (not a directory), it omits the filename from the output and just prints the match count. The parser previously parsed this as `"" : N`, producing `numFiles: 0` despite `numMatches: N`. The fix: `-H` (always-show-filename) is now added to the count-mode args (`args.push('-c', '-H')`), forcing ripgrep to emit `<file>:<count>` even for single-file searches.

### Key algorithm: VCS directory exclusion + plugin-cache exclusion

**VCS directories** (`rF_`): `.git`, `.svn`, `.hg`, `.bzr`, `.jj`, `.sl`. Each is passed as `--glob '!.git'` etc. Without these, every grep would include `.git/objects/...` noise.

**Plugin cache exclusions:** `getGlobExclusionsForPluginCache(absolutePath)` returns glob patterns excluding stale plugin version directories. Plugins are versioned on disk; only the active version is "real" — old versions are kept for fast revert but shouldn't appear in user searches.

**`getFileReadIgnorePatterns`:** Reads `~/.claude/ignore`-style patterns (gitignore-format) from the permission context. Both user-defined ignores (`.claudeignore`) and managed ignore patterns merge here.

### Multiline mode

`multiline: true` translates to `-U --multiline-dotall`. Without it, ripgrep's regex `.` doesn't cross line boundaries. With it, `struct\s*\{[\s\S]*?field` can match across lines.

**Trade-off:** Multiline mode is slower and uses more memory (ripgrep can't stream line-by-line). The prompt explicitly tells the model to only enable it for cross-line patterns.

## Render methods

- `renderToolUseMessage` (`BS7`) — `Search(pattern)` chrome with mode/path/filters.
- `renderToolUseErrorMessage` (`pS7`) — for validateInput failures.
- `renderToolResultMessage` (`US7`) — `SearchResultSummary` (shared with Glob). Three branches:
  - `content` mode: shows matching lines with filename headers.
  - `count` mode: shows the count summary.
  - `files_with_matches` mode: shows the filename list.

`extractSearchText`:
- `content` mode: returns `content` (matching lines are content-meaningful).
- Other modes: `filenames.join('\n')`.

`mapToolResultToToolResultBlockParam` is mode-aware:
- `content` → `content || 'No matches found'`, with optional `[Showing results with pagination = limit: 250]` footer.
- `count` → raw lines + summary `"Found N total occurrences across M files."`.
- `files_with_matches` → `"Found N files\n<filenames>"` with optional pagination footer.
- Empty → `"No files found"`.

## Key insights

1. **`extractSearchText` distinguishes content from filenames.** Content-mode results are full matching lines (indexable, searchable); filename-mode results are paths only (also indexable, but the heuristic accounts for both).

2. **The 250-line default is a soft cap, not a hard cap.** `head_limit: 0` is the escape hatch for "I want everything". This pattern is consistent across `head_limit`-aware tools: 0 means unlimited, undefined means default, N > 0 means cap.

3. **`--max-columns 500`** caps individual line length. Base64 blobs, minified JS, and other long lines get truncated to 500 chars + `[...]`. Without this, a `grep` against `node_modules/*.min.js` could return single-line outputs of millions of chars.

4. **`appliedOffset` only appears when `offset > 0`.** This matches the `appliedLimit`-only-on-truncation pattern: chrome text only mentions pagination when it's actually in play.

5. **`Promise.allSettled` for mtime stats.** A single ENOENT (file deleted between ripgrep's scan and the stat) doesn't reject the whole batch. Failed stats sort as mtime 0 (i.e., last).

6. **NODE_ENV === 'test' uses alphabetical sort.** Snapshot tests would flake on mtime-based sorting because identical mtimes are common in test fixtures. Production uses mtime descending with alphabetical as a tiebreaker.

7. **The `-e` prefix for leading-dash patterns.** Without `-e`, ripgrep treats `-class` as an option flag and fails. With `-e`, it's unambiguous as a pattern.

8. **`isReadOnly` and `isConcurrencySafe`** are both true. Multiple Greps can run in parallel.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.117 | Native macOS/Linux builds: Grep uses embedded ugrep-derived binary instead of system `rg` | `ripGrep` (`wt`) |
| 2.1.119 | Glob and Grep tools disappearing on native builds when Bash is denied — fixed | tool registration |
| 2.1.121 | Embedded grep/find/rg shell wrappers failing when binary deleted mid-session — fall back to installed tools | wrapper resolution |
| 2.1.139 | Grep results not relativizing Windows drive-letter paths, count mode reporting wrong totals for single-file paths — fixed | drive-letter colon parser + `-c -H` flag |
| 2.1.139 | `appliedLimit: undefined` in output formatted as "limit: undefined" — fixed (only set when truncation occurred) | `applyHeadLimit` + `formatLimitInfo` |
| 2.1.142 | (no Grep-specific functional changes) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `GrepTool` (hV) — top-level tool object built by `XK`
- `ripGrep` (wt) — invokes the embedded/system ripgrep binary
- `applyHeadLimit` (wT6) — pagination layer with truncation detection
- `formatLimitInfo` (DT6) — UI chrome for `limit: N, offset: M`
- `toRelativePath` (FRH) — relativise paths under cwd
- `normalizePatternsToPath` (ilH) — convert user-ignore patterns to rg-glob form
- `getFileReadIgnorePatterns` (rlH) — read `.claudeignore` + managed ignores
- `getGlobExclusionsForPluginCache` (nlH) — exclude stale plugin version dirs
- `checkReadPermissionForTool` (CwH) — shared with FileReadTool/GlobTool/LSPTool
- `VCS_DIRECTORIES_TO_EXCLUDE` (rF_) — `[.git, .svn, .hg, .bzr, .jj, .sl]`
- `DEFAULT_HEAD_LIMIT` — 250
- `semanticNumber` (Pb) / `semanticBoolean` (P2) — Zod coercers that accept string-typed numbers/bools
- `plural` (S8) — UI helper for "1 file" vs "N files"
