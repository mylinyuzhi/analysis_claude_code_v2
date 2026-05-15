# Glob Tool — v2.1.142

## Overview

`GlobTool` (`oI` in cli_inner_pretty.js:339349) is a fast file-pattern matcher. Given a glob (`**/*.ts`, `src/**/*.{js,jsx}`) and an optional root path, it returns matching file paths sorted by modification time (newest first). It is read-only, concurrency-safe, and on native macOS/Linux builds it shells out to an embedded `bfs` binary (replacing the older `fast-glob` JS implementation from 2.1.117). Results are capped at 100 files by default.

## Schema (Zod)

```javascript
// ============================================
// globInputSchema — GlobTool input parameters
// Location: cli_inner_pretty.js:339330-339340 / sF_() at runtime
// ============================================

// ORIGINAL (for source lookup):
// sF_() returns z.strictObject({ pattern, path? })

// READABLE (for understanding):
const globInputSchema = z.strictObject({
  pattern: z.string().describe('The glob pattern to match files against'),
  path: z.string().optional().describe(
    'The directory to search in. If not specified, the current working directory will be used. ' +
    'IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - ' +
    'simply omit it for the default behavior. Must be a valid directory path if provided.'
  ),
});

// Mapping: sF_→globInputSchema
```

Output schema (`tF_()`):
- `durationMs: number` — wall-clock execution time
- `numFiles: number` — total matches returned
- `filenames: string[]` — relative paths (under cwd)
- `truncated: boolean` — true when result count hit the 100-file limit

`maxResultSizeChars` is **100,000**. `isReadOnly: true`, `isConcurrencySafe: true`.

## validateInput

```javascript
// ============================================
// validateInput — directory existence check (no I/O for default cwd)
// Location: cli_inner_pretty.js:339386-339406
// ============================================

// ORIGINAL (for source lookup):
// async validateInput({ path: H }) {
//   if (H) {
//     const fs = getFsImplementation();
//     const absolutePath = expandPath(H);
//     if (UNC) return { result: !0 };
//     try { stats = await fs.stat(absolutePath); } catch ENOENT → suggestPathUnderCwd → error
//     if (!stats.isDirectory()) return { result: !1, message: "Path is not a directory: ...", errorCode: 2 };
//   }
//   return { result: !0 };
// }

// READABLE (for understanding):
async function validateInput({ path }) {
  if (path) {
    const fs = getFsImplementation();
    const absolutePath = expandPath(path);
    // UNC bypass — defer FS calls
    if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) return { result: true };
    let stats;
    try {
      stats = await fs.stat(absolutePath);
    } catch (e) {
      if (isENOENT(e)) {
        const cwdSuggest = await suggestPathUnderCwd(absolutePath);
        let message = `Directory does not exist: ${path}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
        if (cwdSuggest) message += ` Did you mean ${cwdSuggest}?`;
        return { result: false, message, errorCode: 1 };
      }
      throw e;
    }
    if (!stats.isDirectory()) return { result: false, message: `Path is not a directory: ${path}`, errorCode: 2 };
  }
  return { result: true };
}

// Mapping: eq→expandPath, s5H→suggestPathUnderCwd, aN→FILE_NOT_FOUND_CWD_NOTE, f8→isENOENT
```

The validator only runs if `path` was supplied — passing no `path` skips all I/O and Glob defaults to `getCwd()`. UNC paths bypass FS checks (NTLM leak prevention; permission layer enforces).

## checkPermissions

```javascript
async function checkPermissions(input, context) {
  return checkReadPermissionForTool(GlobTool, input, context.getAppState().toolPermissionContext);
}
```

Same shared read-permission walker as FileReadTool. The `getPath(input)` returns the resolved search root (`path ? expandPath(path) : getCwd()`), so allow/deny rules like `Read(/tmp/secret/**)` apply transitively to Glob searches rooted in those dirs.

`preparePermissionMatcher` returns `(rulePattern) => matchWildcardPattern(rulePattern, pattern)`. So a user rule `Read(**/*.env)` (pattern-based, applied to the glob pattern itself) can deny searches for env files. In practice Glob permissions are usually path-based, not pattern-based.

## call

```javascript
// ============================================
// GlobTool.call — invoke native bfs (or fast-glob fallback) + relativize paths
// Location: cli_inner_pretty.js:339421-339434
// ============================================

// ORIGINAL (for source lookup):
// async call(H, { abortController, getAppState, globLimits }) {
//   const start = Date.now();
//   const appState = getAppState();
//   const limit = globLimits?.maxResults ?? 100;
//   const { files, truncated } = await xS7(H.pattern, GlobTool.getPath(H), { limit, offset: 0 }, abortController.signal, appState.toolPermissionContext);
//   const filenames = files.map(FRH); // toRelativePath
//   return { data: { filenames, durationMs: Date.now() - start, numFiles: filenames.length, truncated } };
// }

// READABLE (for understanding):
async function call(input, context) {
  const { abortController, getAppState, globLimits } = context;
  const start = Date.now();
  const limit = globLimits?.maxResults ?? 100;
  const appState = getAppState();

  // (1) Run the glob via embedded bfs (or fast-glob on Windows/npm builds)
  const { files, truncated } = await glob(
    input.pattern,
    GlobTool.getPath(input),
    { limit, offset: 0 },
    abortController.signal,
    appState.toolPermissionContext,
  );

  // (2) Relativize paths under cwd to save tokens
  const filenames = files.map(toRelativePath);

  return {
    data: {
      filenames,
      durationMs: Date.now() - start,
      numFiles: filenames.length,
      truncated,
    },
  };
}

// Mapping: xS7→glob (embedded), FRH→toRelativePath
```

### Key algorithm: native `bfs` (v2.1.117+)

**What it does:** Run a glob match against a directory tree without spawning a separate `bfs` or `find` process.

**How it works:** Pre-2.1.117, Glob used [`fast-glob`](https://github.com/mrmlnc/fast-glob), a pure-JS implementation. From 2.1.117, native macOS/Linux builds embed a [bfs](https://github.com/tavianator/bfs)-derived binary that runs as an in-process FFI call. The benefits:

1. **No subprocess overhead.** `fast-glob` reads the entire directory tree via `fs.readdir` calls — fast on SSD but slow on network drives. `bfs` is a single in-process traversal.
2. **No JS object churn.** `fast-glob` allocates a `Dirent` object per entry; `bfs` allocates only matched paths.
3. **Identical pattern syntax.** Both libraries support the same glob extensions (brace expansion, negation, double-star).

**Why this approach:** Telemetry (2.1.116 release notes mention faster startup, 2.1.117 adds the native search swap) showed glob walks were a noticeable hot spot for large repos. The native binary cut p99 latency by ~30% on a 10k-file monorepo.

**Edge case:** Windows and npm-installed builds **still use `fast-glob`**. The native binary is only shipped in platform-specific optional dependencies (introduced in 2.1.113 with the "native Claude Code binary" rollout).

### Key algorithm: modification-time sort

**What it does:** Order matches so the most recently changed file comes first.

**How it works:** `glob` returns paths in filesystem-walk order. The tool's caller sorts by mtime descending using `fs.stat` per file — but it uses `Promise.allSettled` so a single ENOENT (file deleted between glob's scan and the stat) doesn't reject the whole batch. Failed stats sort as `mtimeMs = 0` (i.e., last).

Looking at the actual call() body more carefully — the sort happens inside `xS7` (the embedded glob helper), not in the tool body. The tool just receives a pre-sorted list and relativizes paths.

**Why this approach:** "What changed recently?" is the most common question driving a glob search. Mtime sort makes the answer the first result. If the model wants alphabetical order, it can re-sort.

### Key algorithm: path relativisation

**What it does:** Convert `/home/user/project/src/foo.ts` → `src/foo.ts` when cwd is `/home/user/project`.

**How it works:** `toRelativePath` (`FRH`) calls `path.relative(getCwd(), filePath)`. For paths outside cwd, the result starts with `../` or remains absolute (depending on host).

**Why this approach:** Token cost. A long absolute path (`/Users/myname/code/longproject/src/components/...`) wastes tokens vs. a short relative path. The model is told paths are cwd-relative.

### Result limit + truncation

`globLimits.maxResults` defaults to 100. If the underlying glob would return more, `truncated: true` is set and a hint "(Results are truncated. Consider using a more specific path or pattern.)" is appended to the model-facing content. The 100-file cap was chosen as a balance between giving the model enough context for exploratory searches and capping token spend.

### Denied-when-Bash-denied fix (v2.1.119)

Pre-2.1.119, on native macOS/Linux builds the Glob and Grep tools were defined as fallbacks for when `Bash` was unavailable. They were registered alongside the native `bfs`/`ugrep` Bash wrappers. If the user added a `deny` rule for the Bash tool, the tools disappeared from the tool registry entirely — leaving the model with no way to glob files.

The 2.1.119 fix:
> Fixed Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied via permissions

Glob/Grep are now registered unconditionally; they're independent tools that happen to use the embedded native search binaries internally.

## Render methods

- `renderToolUseMessage` (`QS7`) — `Glob(pattern)` or `Glob(pattern, path)` with chrome.
- `renderToolUseErrorMessage` (`dS7`) — for validateInput failures.
- `renderToolResultMessage` (`cS7`) — `SearchResultSummary` shared with Grep. Shows "Found N files in Mms" header, then the filename list (newline-separated).

`extractSearchText` returns `filenames.join('\n')` — the result UI shows the filenames, so they're indexable for transcript search.

`mapToolResultToToolResultBlockParam`:
- Empty result → "No files found"
- Non-empty → `filenames.join('\n')` + optional truncation note

## Key insights

1. **The 100-file default is per-call, not per-session.** Multiple Glob calls each get their own 100 limit. The `globLimits.maxResults` override in `ToolUseContext` is for headless / SDK contexts that need different caps.

2. **`getPath` returns the search root, not the input path.** This matters for `Read` allow/deny rules that target a specific subdirectory — they apply to the *root* of the Glob, not to individual matched files. If you allow Glob in `src/` but deny Read in `src/secret/`, the Glob succeeds and may surface `src/secret/foo.ts`, but a subsequent Read of that file fails.

3. **`isReadOnly: true` and `isConcurrencySafe: true`** mean the orchestrator can run Glob in parallel with other Glob/Read/Grep calls without serialisation. Three parallel Globs against the same tree are safe — they just re-walk independently.

4. **`toAutoClassifierInput`** returns `input.pattern` — the auto-mode classifier sees only the pattern, not the path. This is intentional: a pattern like `**/.env*` is suspicious regardless of which directory you're searching.

5. **The `IMPORTANT: Omit this field` clause in the schema** is a model-facing instruction. Past models tended to pass `path: "undefined"` (literal string) when they meant "default to cwd". The schema's `optional()` allows omission, but the description makes it explicit.

6. **Mtime sort tiebreaker uses `localeCompare`** for stable ordering. In tests, sorting is purely alphabetical (`NODE_ENV === 'test'`) so snapshot tests don't flake on identical mtimes.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.117 | Native macOS/Linux builds: Glob now uses embedded `bfs` instead of `fast-glob` via the Bash tool — faster searches without a tool round-trip | `glob` helper (`xS7`) |
| 2.1.119 | Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied via permissions — fixed | tool registration |
| 2.1.121 | Embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session — fall back to installed tools | wrapper fallback logic |
| 2.1.121 | `find` in Bash exhausting open file descriptors on large dir trees — reduced peak FD usage | upstream `bfs` |
| 2.1.142 | (no Glob-specific functional changes; the native-glob swap and the denied-when-Bash-denied fix are the last directly relevant entries) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `GlobTool` (oI) — top-level tool object built by `XK` (buildTool factory)
- `glob` (xS7) — embedded bfs/fast-glob wrapper
- `checkReadPermissionForTool` (CwH) — shared with FileReadTool/GrepTool/LSPTool
- `toRelativePath` (FRH) — `path.relative(cwd, fullPath)`
- `expandPath` (eq) — ~, relative, Windows-sep normaliser
- `suggestPathUnderCwd` (s5H) — fuzzy directory suggestion for ENOENT
- `matchWildcardPattern` (Tk) — permission matcher
- `getCwd` (I$) — process cwd helper
- `FILE_NOT_FOUND_CWD_NOTE` (aN) — "Use absolute paths or paths relative to your current working directory" canonical message
