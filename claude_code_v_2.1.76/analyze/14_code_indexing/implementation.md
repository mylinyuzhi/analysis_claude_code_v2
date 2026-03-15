# Implementation Report - Code Indexing (Module 14)

## Overview

Code Indexing in Claude Code v2.1.38 provides high-performance file discovery and fuzzy search for the `@` mention autocomplete system. The system uses a **hybrid dual-engine architecture**: a native Rust-based `FileIndex` for production performance, with a JavaScript `Fuse.js` fallback for environments where the native module is unavailable. It integrates deeply with Git and Ripgrep for project file enumeration, and exposes a complete pipeline from file scanning → indexing → fuzzy search → UI rendering.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getFileSuggestions` (gAq) - Main entry point for `@` autocomplete (chunks.152.mjs:1300)
- `fileSuggestionsWrapper` (NgA) - Aggregates file + MCP + agent suggestions (chunks.182.mjs:2316)
- `getFileIndex` (LiY) - Factory: loads Rust FileIndex or returns null (chunks.152.mjs:1007)
- `rebuildIndex` (xiY) - Master rebuild: scans, loads Rust/Fuse index (chunks.152.mjs:1164)
- `getProjectFiles` (IiY) - Dispatcher: git → ripgrep fallback (chunks.152.mjs:1148)
- `getFilesUsingGit` (SiY) - Git-first file discovery + background untracked fetch (chunks.152.mjs:1077)
- `searchFileIndex` (uiY) - Dual-mode fuzzy search: Rust then Fuse.js (chunks.152.mjs:1226)
- `refreshIndexCache` (OIA) - Cache TTL guard + async rebuild trigger (chunks.152.mjs:1275)
- `formatFileSuggestion` (tU1) - File path → suggestion object with id and score (chunks.152.mjs:1216)
- `loadIgnorePatterns` (BAq) - Reads `.ignore`/`.rgignore` with key caching (chunks.152.mjs:1055)
- `getNonProjectFiles` (hiY) - Fetches workspace files outside the main project (chunks.152.mjs:1144)

---

## Architecture Overview

```
User Types "@" in Input
         │
         ▼
useAutocompleteInput (WGq)       ← chunks.183.mjs — React hook
         │
         ▼
fileSuggestionsWrapper (NgA)     ← chunks.182.mjs:2316 — Aggregator
    ┌────┴─────────┬──────────────┐
    ▼              ▼              ▼
getFileSuggestions  MCP Resources  Agent Suggestions
(gAq) ─────────────────────────────────────────────┐
         │                                          │
         ▼                                          │
[cache TTL check]                                   │
         │                                          │
    ┌────┴───────────────┐                          │
    ▼                    ▼                          │
refreshIndexCache (OIA)  searchFileIndex (uiY)      │
    │                          │                   │
    ▼                      ┌───┴────┐              │
rebuildIndex (xiY)         │Rust    │ Fuse.js        │
    │                      └────────┘               │
    ├── getProjectFiles (IiY)                        │
    │       ├── getFilesUsingGit (SiY)               │
    │       │       ├── git ls-files (tracked)       │
    │       │       └── git ls-files (untracked, bg) │
    │       └── executeRipgrep (lx) — fallback       │
    ├── getNonProjectFiles (hiY)                     │
    └── getFileIndex (LiY)                           │
                                                    │
         ▼                                          │
 [All results merged + scored] ←────────────────────┘
         │
         ▼
renderSuggestionList (rU1)       ← chunks.151.mjs:1758
         │
         ▼
suggestionItemComponent (vlY)    ← chunks.151.mjs:1819
```

---

## Module-Level State Variables

The indexing module maintains a set of module-scope variables that function as a shared cache:

```javascript
// chunks.152.mjs — global indexing state

aU1  = null       // rustFileIndex: singleton Rust FileIndex instance
Sf6  = false      // fallbackMode: permanent flag once Rust fails to load
sG1  = null       // Current Rust file index (post-rebuild)
tG1  = []         // JS fallback file list (used when Rust unavailable)
O91  = null       // cacheRefreshPromise: in-flight rebuild promise (dedup guard)
jIA  = 0          // lastCacheTime: epoch ms of last successful rebuild
RiY  = 60000      // CACHE_TTL_MS: 60-second cache lifetime
aG1  = 15         // MAX_RESULTS: maximum suggestions returned
oG1  = []         // globalTrackedFiles: raw tracked files from last git ls-files
hf6  = null       // untrackedFilesFetching: promise for background untracked fetch
JIA  = null       // lastIgnorePatterns: cached ignore filter object
XIA  = null       // lastIgnoreCacheKey: "gitRoot:projectCwd" cache key
```

---

## Core Algorithms

### 1. Rust FileIndex Initialization (`LiY` / `getFileIndex`)

**What it does:** Lazily loads the native Rust-based `FileIndex` module, with permanent fallback if it fails.

```javascript
// ============================================
// getFileIndex - Initialize Rust file index module (lazy singleton)
// Location: chunks.152.mjs:1007-1015
// ============================================

// ORIGINAL (for source lookup):
async function LiY() {
    if (Sf6) return null;
    if (aU1) return aU1;
    if (D9()) try {
        return aU1 = new(await Promise.resolve().then(() => ($IA(), HIA))).FileIndex, aU1
    } catch (A) {
        return Sf6 = !0, h(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${A instanceof Error?A.message:String(A)}`), K1(A), null
    } else return Sf6 = !0, h("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}

// READABLE (for understanding):
async function getFileIndex() {
    if (fallbackMode) return null;      // Permanent fallback: skip Rust
    if (rustFileIndex) return rustFileIndex; // Return cached singleton

    if (isBundledMode()) {
        try {
            rustFileIndex = new (await import(rustNativeModule)).FileIndex;
            return rustFileIndex;
        } catch (error) {
            fallbackMode = true;  // Permanent: no retry
            log(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${error.message}`);
            reportError(error);
            return null;
        }
    } else {
        fallbackMode = true;  // Non-bundled mode: always use Fuse.js
        log("[FileIndex] Not in bundled mode, using Fuse.js fallback");
        return null;
    }
}

// Mapping: LiY→getFileIndex, Sf6→fallbackMode, aU1→rustFileIndex, D9→isBundledMode,
//          $IA→initRustModule, HIA→nativeModule
```

**How it works:**
1. **Permanent fallback guard**: `Sf6` (fallbackMode) is checked first — if `true`, returns `null` immediately (no retry after failure).
2. **Singleton pattern**: `aU1` (rustFileIndex) caches the instance so `import()` is called only once.
3. **Bundled-mode check**: `D9()` (isBundledMode) gates Rust loading — in dev/test environments (`--no-bundle` mode), Rust is never attempted.
4. **Dynamic import**: Uses `Promise.resolve().then(() => ...)` pattern to defer the native module import.

**Why this approach:**
- Rust modules are WASM/native addons that fail silently in non-bundled builds.
- Permanent `fallbackMode` prevents repeated costly failed imports on every query.
- The Fuse.js fallback ensures the system always functions, just slower.

---

### 2. Cache-Aware File Suggestion Entry Point (`gAq` / `getFileSuggestions`)

**What it does:** The primary entry point called when the user types `@` + text. Manages cache lifecycle and dispatches to the appropriate search path.

```javascript
// ============================================
// getFileSuggestions - @-mention suggestion entry point
// Location: chunks.152.mjs:1300-1326
// ============================================

// ORIGINAL (for source lookup):
async function gAq(A, q = !1) {
    if (!A && !q) return [];
    if (l4().fileSuggestion?.type === "command") {
        let K = { ...aX(), query: A };
        return (await XyA(K)).slice(0, aG1).map(tU1)
    }
    if (A === "" || A === "." || A === "./") {
        let K = await BiY();
        return OIA(), K.slice(0, aG1).map(tU1)
    }
    try {
        let Y = Date.now() - jIA > RiY;
        if (!sG1 && tG1.length === 0) {
            if (OIA(), O91) await O91
        } else if (Y) OIA();
        let z = A, w = "." + bJ.sep;
        if (A.startsWith(w)) z = A.substring(2);
        if (z.startsWith("~")) z = g4(z);
        return await uiY(sG1, tG1, z)
    } catch (K) {
        return K1(K), []
    }
}

// READABLE (for understanding):
async function getFileSuggestions(query, forceInclude = false) {
    if (!query && !forceInclude) return [];

    // Branch 1: Custom shell command provider
    if (getSettings().fileSuggestion?.type === "command") {
        let params = { ...getCommandContext(), query };
        return (await runCustomFileSuggestionCommand(params)).slice(0, MAX_RESULTS).map(formatFileSuggestion);
    }

    // Branch 2: Empty query → show top-level directories
    if (query === "" || query === "." || query === "./") {
        let dirContents = await listCurrentDirectory();
        refreshIndexCache();  // Kick off background refresh
        return dirContents.slice(0, MAX_RESULTS).map(formatFileSuggestion);
    }

    try {
        // Branch 3: Cache management
        let cacheExpired = Date.now() - lastCacheTime > CACHE_TTL_MS;

        if (!rustIndex && jsFileList.length === 0) {
            // Cold start: build cache and WAIT for it
            refreshIndexCache();
            if (cacheRefreshPromise) await cacheRefreshPromise;
        } else if (cacheExpired) {
            // Background refresh: serve stale while rebuilding
            refreshIndexCache();
        }

        // Normalize query (strip ./ prefix, expand ~)
        let normalizedQuery = query;
        if (query.startsWith("./" )) normalizedQuery = query.substring(2);
        if (normalizedQuery.startsWith("~")) normalizedQuery = expandHome(normalizedQuery);

        return await searchFileIndex(rustIndex, jsFileList, normalizedQuery);
    } catch (error) {
        reportError(error);
        return [];
    }
}

// Mapping: gAq→getFileSuggestions, A→query, q→forceInclude, l4→getSettings,
//          XyA→runCustomFileSuggestionCommand, aX→getCommandContext, BiY→listCurrentDirectory,
//          OIA→refreshIndexCache, O91→cacheRefreshPromise, sG1→rustIndex, tG1→jsFileList,
//          jIA→lastCacheTime, RiY→CACHE_TTL_MS, g4→expandHome, uiY→searchFileIndex,
//          tU1→formatFileSuggestion, aG1→MAX_RESULTS
```

**How it works — Three execution branches:**

| Condition | Branch | Behavior |
|-----------|--------|----------|
| `fileSuggestion.type === "command"` | Custom command | Calls user-configured shell command |
| `query === "" \| "." \| "./"` | Directory listing | Returns `listCurrentDirectory()` result |
| Normal query | Cache + Search | Cache-aware path with rebuild scheduling |

**Cache management decision tree:**
```
                  ┌─ rustIndex == null AND jsFileList.length == 0 ?
                  │   YES → Cold start: refreshIndexCache() + AWAIT promise
                  │          (blocks until index is ready)
Cache decision ───┤
                  └─ cacheExpired (lastCacheTime + 60s < now) ?
                      YES → Background refresh (serve stale data immediately)
                      NO  → Use existing cache (fast path)
```

**Key insight:** The cold-start path (`await O91`) blocks to prevent returning empty results on first use. Subsequent calls use stale-while-revalidate, ensuring sub-millisecond response times.

---

### 3. Background Cache Refresh (`OIA` / `refreshIndexCache`)

**What it does:** Ensures only one rebuild is in flight at a time (deduplication via promise caching).

```javascript
// ============================================
// refreshIndexCache - Async rebuild with dedup guard
// Location: chunks.152.mjs:1275-1284
// ============================================

// ORIGINAL (for source lookup):
function OIA() {
    if (!O91) O91 = xiY().then((A) => {
        return sG1 = A.fileIndex, tG1 = A.fileList, jIA = Date.now(), O91 = null, A
    }).catch((A) => {
        return h(`[FileIndex] Cache refresh failed: ${A instanceof Error?A.message:String(A)}`), K1(A), O91 = null, {
            fileIndex: null, fileList: []
        }
    })
}

// READABLE (for understanding):
function refreshIndexCache() {
    if (!cacheRefreshPromise) {  // Dedup guard: skip if already rebuilding
        cacheRefreshPromise = rebuildIndex()
            .then((result) => {
                rustIndex = result.fileIndex;
                jsFileList = result.fileList;
                lastCacheTime = Date.now();
                cacheRefreshPromise = null;  // Reset dedup guard
                return result;
            })
            .catch((error) => {
                log(`[FileIndex] Cache refresh failed: ${error.message}`);
                reportError(error);
                cacheRefreshPromise = null;
                return { fileIndex: null, fileList: [] };
            });
    }
}

// Mapping: OIA→refreshIndexCache, O91→cacheRefreshPromise, xiY→rebuildIndex,
//          sG1→rustIndex, tG1→jsFileList, jIA→lastCacheTime
```

**Why this approach:**
- The `O91` guard prevents multiple concurrent rebuilds (which would each spawn git processes and waste CPU).
- On failure, the guard is reset (`O91 = null`) so the next user interaction can trigger a retry.
- The 60-second TTL is a deliberate trade-off: short enough to pick up file additions/deletions, long enough to not overwhelm the system with git processes.

---

### 4. Master Index Rebuild (`xiY` / `rebuildIndex`)

**What it does:** Orchestrates the full scan: fetches project files, fetches workspace files, loads them into the Rust or JS index.

```javascript
// ============================================
// rebuildIndex - Full project scan and index load
// Location: chunks.152.mjs:1164-1196
// ============================================

// ORIGINAL (for source lookup):
async function xiY() {
    let A = Aq(), q = setTimeout(() => { A.abort() }, 1e4);
    try {
        let K = l4(), Y = f6(),
            z = K.respectGitignore ?? Y.respectGitignore ?? !0,
            w = h6(),
            [H, $] = await Promise.all([IiY(A.signal, z), hiY(w)]),
            O = [...H, ...$],
            J = [...DIA(O), ...O],
            X = [], D = await LiY();
        if (D) try {
            D.loadFromFileList(J)
        } catch (j) {
            h(`[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${j instanceof Error?j.message:String(j)}`), K1(j), X = J
        } else X = J;
        return { fileIndex: D, fileList: X }
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), { fileIndex: null, fileList: [] }
    } finally {
        clearTimeout(q)
    }
}

// READABLE (for understanding):
async function rebuildIndex() {
    let abortController = new AbortController();
    let timeout = setTimeout(() => abortController.abort(), 10000); // 10s hard limit

    try {
        let userConfig = getUserConfig();
        let defaultConfig = getDefaultConfig();
        let respectGitignore = userConfig.respectGitignore ?? defaultConfig.respectGitignore ?? true;
        let cwd = getWorkingDirectory();

        // Parallel fetch: project files + workspace files
        let [projectFiles, workspaceFiles] = await Promise.all([
            getProjectFiles(abortController.signal, respectGitignore),
            getNonProjectFiles(cwd)
        ]);

        let allFiles = [...projectFiles, ...workspaceFiles];
        // Prepend directory entries so the index can navigate folder names
        let fileListWithDirs = [...getDirectoriesFromFiles(allFiles), ...allFiles];

        let jsFileList = [];
        let rustIndex = await getFileIndex();

        if (rustIndex) {
            try {
                rustIndex.loadFromFileList(fileListWithDirs);
                // If Rust succeeds, jsFileList stays empty (Rust handles all queries)
            } catch (error) {
                log(`[FileIndex] Failed to load Rust index, using Fuse.js fallback`);
                reportError(error);
                jsFileList = fileListWithDirs;  // Fall through to Fuse.js
            }
        } else {
            jsFileList = fileListWithDirs;  // Rust unavailable: use Fuse.js
        }

        return { fileIndex: rustIndex, fileList: jsFileList };
    } catch (error) {
        reportError(error);
        return { fileIndex: null, fileList: [] };
    } finally {
        clearTimeout(timeout);
    }
}

// Mapping: xiY→rebuildIndex, A→abortController, q→timeout, K→userConfig, Y→defaultConfig,
//          z→respectGitignore, w→cwd, H→projectFiles, $→workspaceFiles, O→allFiles,
//          J→fileListWithDirs, X→jsFileList, D→rustIndex, IiY→getProjectFiles,
//          hiY→getNonProjectFiles, DIA→getDirectoriesFromFiles, LiY→getFileIndex
```

**How it works:**
1. **10-second timeout**: An `AbortController` with a `setTimeout` ensures the rebuild never hangs indefinitely.
2. **Parallel fetch**: `getProjectFiles` (git/ripgrep) and `getNonProjectFiles` (workspace folders) run concurrently via `Promise.all`.
3. **Directory injection**: `DIA(O)` (getDirectoriesFromFiles) extracts unique parent directories and prepends them. This allows typing `src/` to navigate folder names before reaching individual files.
4. **Rust/Fuse.js decision**: Rust gets the full list via `loadFromFileList`. If Rust fails mid-load, `jsFileList` is populated as fallback.

---

### 5. Git-First Project File Discovery (`SiY` / `getFilesUsingGit`)

**What it does:** Uses `git ls-files` to get tracked files. Triggers a non-blocking background fetch for untracked files. Falls back to ripgrep if not a git repo.

```javascript
// ============================================
// getFilesUsingGit - Tracked files + background untracked fetch
// Location: chunks.152.mjs:1077-1133
// ============================================

// ORIGINAL (for source lookup):
async function SiY(A, q) {
    let K = Date.now();
    if (h("[FileIndex] getFilesUsingGit called"), !await yiY()) return h("[FileIndex] not a git repo, returning null"), null;
    try {
        let Y = YX(h6());
        if (!Y) return h("[FileIndex] git rev-parse --show-toplevel failed, falling back to ripgrep"), null;
        let z = h6(), w = Date.now(),
            H = await d4(pq(), ["-c", "core.quotepath=false", "ls-files", "--recurse-submodules"], {
                timeout: 5000, abortSignal: A, cwd: Y
            });
        if (h(`[FileIndex] git ls-files (tracked) took ${Date.now()-w}ms`), H.code !== 0)
            return h(`[FileIndex] git ls-files failed (code=${H.code}, stderr=${H.stderr}), falling back to ripgrep`), null;
        let $ = H.stdout.trim().split(`\n`).filter(Boolean),
            O = uAq($, Y, z),
            _ = BAq(Y, z);
        if (_) { let X = O.length; O = _.filter(O); h(`[FileIndex] applied ignore patterns: ${X} -> ${O.length} files`) }
        oG1 = O;
        let J = Date.now() - K;
        h(`[FileIndex] git ls-files: ${O.length} tracked files in ${J}ms`);
        c("tengu_file_suggestions_git_ls_files", { file_count: O.length, tracked_count: O.length, untracked_count: 0, duration_ms: J });
        if (!hf6) {
            let X = q ? ["-c", "core.quotepath=false", "ls-files", "--others", "--exclude-standard"]
                      : ["-c", "core.quotepath=false", "ls-files", "--others"];
            hf6 = d4(pq(), X, { timeout: 1e4, cwd: Y })
                .then((D) => {
                    if (D.code === 0) {
                        let j = D.stdout.trim().split(`\n`).filter(Boolean),
                            M = uAq(j, Y, z), P = BAq(Y, z);
                        if (P && M.length > 0) { let W = M.length; M = P.filter(M); }
                        h(`[FileIndex] background untracked fetch: ${M.length} files`);
                        CiY(M)  // Merge untracked into live index
                    }
                })
                .catch((D) => { h(`[FileIndex] background untracked fetch failed: ${D}`) })
                .finally(() => { hf6 = null })
        }
        return O
    } catch (Y) {
        return h(`[FileIndex] git ls-files error: ${Y instanceof Error?Y.message:String(Y)}`), null
    }
}

// READABLE (for understanding):
async function getFilesUsingGit(abortSignal, respectGitignore) {
    if (!await isGitRepository()) return null;  // Not a git repo: fall through to ripgrep

    try {
        let gitRoot = getGitRoot(getCwd());
        if (!gitRoot) return null;  // Detached state: fall through to ripgrep

        // Step 1: Fetch tracked files (5s timeout to prevent blocking)
        let result = await execCommand(getGitPath(), [
            "-c", "core.quotepath=false",  // Prevent unicode quoting
            "ls-files",
            "--recurse-submodules"          // Include submodule files
        ], { timeout: 5000, abortSignal, cwd: gitRoot });

        if (result.code !== 0) return null;

        // Step 2: Parse, normalize paths, apply .ignore patterns
        let tracked = parseLines(result.stdout);
        tracked = makeRelativePaths(tracked, gitRoot, getCwd());
        let ignoreFilter = loadIgnorePatterns(gitRoot, getCwd());
        if (ignoreFilter) tracked = ignoreFilter.filter(tracked);

        globalTrackedFiles = tracked;  // Cache for merge with untracked

        // Step 3: Background fetch for untracked files (10s timeout, non-blocking)
        if (!untrackedFetchPromise) {
            let untrackedArgs = respectGitignore
                ? ["ls-files", "--others", "--exclude-standard"]  // Respect .gitignore
                : ["ls-files", "--others"];                        // Show all untracked

            untrackedFetchPromise = execCommand(getGitPath(), ["-c", "core.quotepath=false", ...untrackedArgs], {
                timeout: 10000,
                cwd: gitRoot
            })
            .then((r) => {
                if (r.code === 0) {
                    let untracked = makeRelativePaths(parseLines(r.stdout), gitRoot, getCwd());
                    if (ignoreFilter && untracked.length > 0) untracked = ignoreFilter.filter(untracked);
                    mergeUntrackedIntoIndex(untracked);  // Hot-merge into live Rust/JS index
                }
            })
            .finally(() => { untrackedFetchPromise = null; });
        }

        return tracked;
    } catch (error) {
        return null;
    }
}

// Mapping: SiY→getFilesUsingGit, A→abortSignal, q→respectGitignore, K→startTime,
//          yiY→isGitRepository, YX→getGitRoot, h6→getCwd, d4→execCommand, pq→getGitPath,
//          H→result, $→trackedRaw, O→tracked, _→ignoreFilter, oG1→globalTrackedFiles,
//          hf6→untrackedFetchPromise, CiY→mergeUntrackedIntoIndex, uAq→makeRelativePaths,
//          BAq→loadIgnorePatterns, c→telemetry
```

**Key design decisions:**

**Split-phase fetching:**
- **Tracked files (blocking, 5s timeout):** `git ls-files --recurse-submodules` is the primary source. It completes synchronously in the rebuild flow.
- **Untracked files (background, 10s timeout):** `git ls-files --others` runs as a fire-and-forget promise. Results are merged via `CiY` (mergeUntrackedIntoIndex) once ready.

**Why split?** Tracked files (committed code) are almost always what users want to reference. The untracked fetch could take seconds in large repos (traversing the working tree). By returning tracked files immediately, the first autocomplete appears fast.

**`respectGitignore` flag:**
- `true` (default): Uses `--exclude-standard` to honor `.gitignore` — untracked temp files / build outputs don't appear.
- `false`: Shows all untracked files, useful when user has `respectGitignore: false` in settings.

**Telemetry integration:**
- Emits `tengu_file_suggestions_git_ls_files` with `{ file_count, tracked_count, untracked_count, duration_ms }`.
- Allows Anthropic to monitor the performance of file discovery in production.

---

### 6. Ripgrep Fallback (`IiY` / `getProjectFiles`)

**What it does:** When `getFilesUsingGit` returns `null`, falls back to `rg --files` to enumerate all non-gitignored files.

```javascript
// ============================================
// getProjectFiles - Git or ripgrep dispatcher
// Location: chunks.152.mjs:1148-1162
// ============================================

// ORIGINAL (for source lookup):
async function IiY(A, q) {
    h(`[FileIndex] getProjectFiles called, respectGitignore=${q}`);
    let K = await SiY(A, q);
    if (K !== null) return h(`[FileIndex] using git ls-files result (${K.length} files)`), K;
    h("[FileIndex] git ls-files returned null, falling back to ripgrep");
    let Y = Date.now(),
        z = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!q) z.push("--no-ignore-vcs");
    let H = (await lx(z, ".", A)).map((O) => bJ.relative(h6(), O)),
        $ = Date.now() - Y;
    h(`[FileIndex] ripgrep: ${H.length} files in ${$}ms`);
    c("tengu_file_suggestions_ripgrep", { file_count: H.length, duration_ms: $ });
    return H
}

// READABLE (for understanding):
async function getProjectFiles(abortSignal, respectGitignore) {
    // Try git first
    let gitFiles = await getFilesUsingGit(abortSignal, respectGitignore);
    if (gitFiles !== null) return gitFiles;

    // Ripgrep fallback
    let startTime = Date.now();
    let args = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!respectGitignore) args.push("--no-ignore-vcs");

    let files = (await runRipgrep(args, ".", abortSignal))
        .map((f) => path.relative(getCwd(), f));

    telemetry("tengu_file_suggestions_ripgrep", {
        file_count: files.length,
        duration_ms: Date.now() - startTime
    });

    return files;
}

// Mapping: IiY→getProjectFiles, A→abortSignal, q→respectGitignore, K→gitFiles,
//          SiY→getFilesUsingGit, Y→startTime, z→args, H→files, lx→runRipgrep,
//          bJ→path, h6→getCwd, c→telemetry
```

**Ripgrep flags used:**
| Flag | Purpose |
|------|---------|
| `--files` | List files only (no content search) |
| `--follow` | Follow symlinks |
| `--hidden` | Include hidden files (`.dotfiles`) |
| `--glob !.git/` | Exclude `.git` metadata |
| `--no-ignore-vcs` | (Optional) Skip VCS ignore rules |

---

### 7. Ignore Pattern Loading (`BAq` / `loadIgnorePatterns`)

**What it does:** Loads `.ignore` and `.rgignore` files from the git root and project CWD. Caches the filter object per directory pair.

```javascript
// ============================================
// loadIgnorePatterns - .ignore/.rgignore filter builder
// Location: chunks.152.mjs:1055-1075
// ============================================

// ORIGINAL (for source lookup):
function BAq(A, q) {
    let K = `${A}:${q}`;
    if (XIA === K) return JIA;
    let Y = b1(), z = [".ignore", ".rgignore"],
        w = [...new Set([A, q])], H = mAq.default(), $ = !1;
    for (let _ of w) for (let J of z) {
        let X = bJ.join(_, J);
        if (Y.existsSync(X)) try {
            let D = Y.readFileSync(X, { encoding: "utf8" });
            H.add(D), $ = !0, h(`[FileIndex] loaded ignore patterns from ${X}`)
        } catch {}
    }
    let O = $ ? H : null;
    return JIA = O, XIA = K, O
}

// READABLE (for understanding):
function loadIgnorePatterns(gitRoot, projectCwd) {
    let cacheKey = `${gitRoot}:${projectCwd}`;
    if (lastIgnoreCacheKey === cacheKey) return lastIgnorePatterns;  // Cache hit

    let fs = getFileSystem();
    let fileNames = [".ignore", ".rgignore"];
    let searchDirs = [...new Set([gitRoot, projectCwd])];  // Deduplicate if same dir
    let filter = ignoreLibrary.default();
    let found = false;

    for (let dir of searchDirs) {
        for (let name of fileNames) {
            let filePath = path.join(dir, name);
            if (fs.existsSync(filePath)) {
                try {
                    filter.add(fs.readFileSync(filePath, "utf8"));
                    found = true;
                    log(`[FileIndex] loaded ignore patterns from ${filePath}`);
                } catch { /* Silent failure: broken file = no patterns */ }
            }
        }
    }

    lastIgnorePatterns = found ? filter : null;
    lastIgnoreCacheKey = cacheKey;
    return lastIgnorePatterns;
}

// Mapping: BAq→loadIgnorePatterns, A→gitRoot, q→projectCwd, XIA→lastIgnoreCacheKey,
//          JIA→lastIgnorePatterns, b1→getFileSystem, mAq→ignoreLibrary, bJ→path
```

**Cache key design:** `"${gitRoot}:${projectCwd}"` handles monorepo scenarios where git root ≠ working directory. If the user `cd`s to a subdirectory, both the key and the patterns update.

---

### 8. Dual-Mode Fuzzy Search (`uiY` / `searchFileIndex`)

**What it does:** Executes the file search query against either the Rust native index or Fuse.js, with directory-prefix pre-filtering and test-file penalization.

```javascript
// ============================================
// searchFileIndex - Rust or Fuse.js search with scoring
// Location: chunks.152.mjs:1226-1273
// ============================================

// ORIGINAL (for source lookup):
async function uiY(A, q, K) {
    if (A) try {
        return A.search(K, aG1).map((_) => tU1(_.path, _.score))
    } catch (O) {
        h(`[FileIndex] Rust search failed, falling back to Fuse.js: ${O instanceof Error?O.message:String(O)}`), K1(O)
    }
    h("[FileIndex] Using Fuse.js fallback for search");
    let Y = [...new Set(q)];
    if (!K) {
        let O = new Set;
        for (let _ of Y) {
            let J = _.split(bJ.sep)[0];
            if (J) { if (O.add(J), O.size >= aG1) break }
        }
        return [...O].sort().map(tU1)
    }
    let z = Y.map((O) => ({ path: O, filename: bJ.basename(O), testPenalty: O.includes("test") ? 1 : 0 })),
        w = K.lastIndexOf(bJ.sep);
    if (w > 2) z = z.filter((O) => { return O.path.substring(0, w).startsWith(K.substring(0, w)) });
    let $ = new wy(z, {
        includeScore: !0, threshold: 0.5,
        keys: [{ name: "path", weight: 1 }, { name: "filename", weight: 2 }]
    }).search(K, { limit: aG1 });
    return $ = $.sort((O, _) => {
        if (O.score === void 0 || _.score === void 0) return 0;
        if (Math.abs(O.score - _.score) > 0.05) return O.score - _.score;
        return O.item.testPenalty - _.item.testPenalty
    }), $.map((O) => O.item.path).slice(0, aG1).map(tU1)
}

// READABLE (for understanding):
async function searchFileIndex(rustIndex, jsFileList, query) {
    // Path 1: Rust index (O(log n) or better)
    if (rustIndex) {
        try {
            return rustIndex.search(query, MAX_RESULTS)
                .map((r) => formatFileSuggestion(r.path, r.score));
        } catch (error) {
            log(`[FileIndex] Rust search failed, falling back to Fuse.js: ${error.message}`);
            // Fall through to Fuse.js
        }
    }

    // Path 2: Fuse.js fallback
    let uniqueFiles = [...new Set(jsFileList)];

    // Special case: empty query → show root directories only
    if (!query) {
        let rootDirs = new Set();
        for (let file of uniqueFiles) {
            let rootDir = file.split(path.sep)[0];
            if (rootDir) {
                rootDirs.add(rootDir);
                if (rootDirs.size >= MAX_RESULTS) break;
            }
        }
        return [...rootDirs].sort().map(formatFileSuggestion);
    }

    // Prepare search candidates with test penalty
    let candidates = uniqueFiles.map((file) => ({
        path: file,
        filename: path.basename(file),
        testPenalty: file.includes("test") ? 1 : 0  // Derank test files
    }));

    // Directory prefix filter: if query has a sep > 2 chars, filter by matching prefix
    let lastSep = query.lastIndexOf(path.sep);
    if (lastSep > 2) {
        candidates = candidates.filter((c) =>
            c.path.substring(0, lastSep).startsWith(query.substring(0, lastSep))
        );
    }

    // Fuse.js fuzzy search
    let results = new Fuse(candidates, {
        includeScore: true,
        threshold: 0.5,
        keys: [
            { name: "path", weight: 1 },
            { name: "filename", weight: 2 }  // Filename match is 2x more important
        ]
    }).search(query, { limit: MAX_RESULTS });

    // Sort: primary = score (ascending), secondary = testPenalty (penalize tests)
    results.sort((a, b) => {
        if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
        return a.item.testPenalty - b.item.testPenalty;
    });

    return results.map((r) => r.item.path).slice(0, MAX_RESULTS).map(formatFileSuggestion);
}

// Mapping: uiY→searchFileIndex, A→rustIndex, q→jsFileList, K→query, aG1→MAX_RESULTS,
//          tU1→formatFileSuggestion, wy→Fuse, bJ→path, Y→uniqueFiles, z→candidates,
//          w→lastSep, $→results
```

**Search algorithm — Fuse.js path:**

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | Dedup file list | Prevent duplicate results |
| 2 | Empty query check | Return sorted root dirs |
| 3 | testPenalty = 1 for paths with "test" | Deprioritize test files |
| 4 | Directory prefix filter | `src/comp` only searches `src/` files |
| 5 | Fuse.js with filename:path 2:1 weight | Filename match > path match |
| 6 | Stable sort: score then testPenalty | Preserve score order, tests sink |

**Score threshold `0.05`:** Scores within 5% are considered "ties". In ties, test files are pushed to the bottom. This prevents a test file with a slightly better fuzzy score from displacing a production file.

---

### 9. File Suggestion Result Format (`tU1` / `formatFileSuggestion`)

```javascript
// ============================================
// formatFileSuggestion - Wrap file path into suggestion object
// Location: chunks.152.mjs:1216-1224
// ============================================

// ORIGINAL (for source lookup):
function tU1(A, q) {
    return { id: `file-${A}`, displayText: A, metadata: q !== void 0 ? { score: q } : void 0 }
}

// READABLE (for understanding):
function formatFileSuggestion(filePath, score) {
    return {
        id: `file-${filePath}`,        // Namespaced ID for type detection in UI
        displayText: filePath,          // Shown in autocomplete dropdown
        metadata: score !== undefined ? { score } : undefined  // Score for re-ranking
    };
}

// Mapping: tU1→formatFileSuggestion, A→filePath, q→score
```

**Why `id: "file-${filePath}"`?**
The `file-` prefix is checked in the UI rendering layer (`vlY` / `suggestionItemComponent`) to select the correct rendering branch. Items with `id.startsWith("file-")` get file-specific icon and description truncation treatment.

---

## Data Flow: Complete Pipeline

```
[User types "@src"]
        │
        ▼
useAutocompleteInput (WGq)    chunks.183.mjs
  ├── await NgA("src", mcpResources, agents)
  │       │
  │       ├── gAq("src")          chunks.152.mjs:1300
  │       │     ├── [cache check] is sG1 null && tG1 empty?
  │       │     │     YES → refreshIndexCache() → await O91
  │       │     │           ↓ rebuildIndex() (xiY)
  │       │     │               ├── getProjectFiles(signal, true)   [IiY]
  │       │     │               │     ├── getFilesUsingGit(signal, true)   [SiY]
  │       │     │               │     │     ├── git ls-files (5s timeout)
  │       │     │               │     │     ├── apply .ignore patterns
  │       │     │               │     │     └── kick off background untracked fetch
  │       │     │               │     └── OR: runRipgrep() if not git repo
  │       │     │               ├── getNonProjectFiles(cwd)         [hiY]
  │       │     │               └── getFileIndex()                  [LiY]
  │       │     │                     ├── Rust: FileIndex.loadFromFileList()
  │       │     │                     └── OR: jsFileList = allFiles
  │       │     │
  │       │     └── [cache ready] → searchFileIndex(sG1, tG1, "src")   [uiY]
  │       │           ├── Rust: sG1.search("src", 15) → [{path, score}]
  │       │           └── OR: Fuse.js with filename:2, path:1 weights
  │       │           → returns [{id:"file-src/...", displayText:"src/..."}] x15
  │       │
  │       ├── MCP resource list → Fuse.js search of {displayText, name, uri}
  │       │
  │       └── Agent suggestions  → A0z(agents, "src")
  │
  └── Merge + score all results → slice(0, MAX_SUGGESTIONS) → return

        │
        ▼
renderSuggestionList (rU1)    chunks.151.mjs:1758
  ├── rows = terminalRows - 3 (max 6 visible)
  ├── scroll window calculation
  └── visibleItems.map(vlY)

        │
        ▼
suggestionItemComponent (vlY)  chunks.151.mjs:1819
  ├── item.id.startsWith("file-") → file branch
  │     └── icon + filename + description (truncated to 20 chars)
  ├── item.id.startsWith("mcp-resource-") → MCP branch
  │     └── truncate displayText to 30 chars
  └── fallback → generic displayText with color
```

---

## Performance Characteristics

| Operation | Cost | Notes |
|-----------|------|-------|
| Rust `FileIndex.search()` | ~0.1-1ms | Native, sub-linear |
| Fuse.js search (10k files) | ~20-50ms | O(n) scan with pre-filtering |
| `git ls-files` (tracked) | 50-500ms | 5s timeout; per rebuild |
| `git ls-files` (untracked) | 100-5000ms | 10s timeout; background |
| Ripgrep fallback | 200-2000ms | Filesystem traversal |
| Cache rebuild (full) | 200-5000ms | Runs every 60s |
| Directory listing | <10ms | Direct fs.readdir |

**Optimization strategies:**
1. **Rust-first**: Near-instant search for large codebases.
2. **Stale-while-revalidate**: Serves existing index while rebuilding in background (post cold-start).
3. **Cold-start await**: First call blocks until index is ready (prevents empty results).
4. **Background untracked files**: Doesn't block the initial suggestions.
5. **Directory prefix filter**: Reduces Fuse.js candidate set dramatically for nested paths.
6. **React memoization**: `React.memo` on `vlY` + 21-slot cache on `rU1` prevent re-renders on each keystroke.

---

## Configuration

### User Settings

| Setting | Default | Effect |
|---------|---------|--------|
| `fileSuggestion.type` | `"default"` | `"command"` uses custom shell command |
| `respectGitignore` | `true` | Controls `--exclude-standard` in untracked fetch |

### Environment

| Constant | Value | Meaning |
|----------|-------|---------|
| `CACHE_TTL_MS` (RiY) | `60000` | 60s rebuild interval |
| `MAX_RESULTS` (aG1) | `15` | Max suggestions from file index |
| `MAX_SUGGESTIONS` (VgA) | `~20` | Max suggestions after aggregation |

---

## Key Insights

### Zero-Configuration Design
Claude Code avoids persistent index databases (SQLite, SQLite-FTS, vector DB). Instead, the in-memory index is rebuilt from scratch every 60 seconds using tools that are universally available in developer environments (git, ripgrep). This means:
- No index corruption or stale-state bugs.
- No storage overhead.
- Works immediately in any project without setup.

### The 80/20 Rule for Untracked Files
The system fetches tracked files synchronously but untracked files asynchronously. This reflects an empirical truth: when you type `@`, you almost always want to reference committed source code, not newly created temp files. The non-blocking untracked fetch means they appear in the next suggestion refresh (within 10s) without slowing down the common case.

### Filename Weight = 2x Path Weight
The Fuse.js configuration uses `{name: "filename", weight: 2}` vs `{name: "path", weight: 1}`. When a developer types `@Button`, they most likely want `components/Button.tsx`, not `src/data/something/button_config.json`. The filename-biased weighting aligns search behavior with developer intent.

### Test File Penalization
The `testPenalty: file.includes("test") ? 1 : 0` + secondary sort ensures test files appear after production files when scores are similar (within 0.05). When a developer types `@userService`, `UserService.ts` appears before `UserService.test.ts`.
