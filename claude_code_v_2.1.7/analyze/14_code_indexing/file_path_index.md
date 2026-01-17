# FileIndex - File Path Autocomplete System

## Overview

FileIndex is Claude Code's file path autocomplete system, used for `@` mentions and file path parameters in tools. It uses a **Rust native module** as the primary engine with **Fuse.js** as a fallback.

**Core Features:**
- Dual-backend architecture (Rust native + JavaScript fallback)
- Git ls-files discovery with ripgrep fallback
- 60-second TTL cache with Promise deduplication
- Fuzzy search with weighted scoring

---

## Table of Contents

- [1. System Architecture](#1-system-architecture)
- [2. Trigger Conditions](#2-trigger-conditions)
- [3. Index Building Flow](#3-index-building-flow)
- [4. Cache Mechanism](#4-cache-mechanism)
- [5. Search Algorithm](#5-search-algorithm)
- [6. Configuration](#6-configuration)
- [7. Related Symbols](#7-related-symbols)

---

## 1. System Architecture

```
+---------------------------------------------------------------------+
|                      FileIndex System Architecture                    |
|                         chunks.136.mjs                                |
+---------------------------------------------------------------------+
|                                                                       |
|  +---------------------------------------------------------------+   |
|  |                       Entry Function                           |   |
|  |                   getFileSuggestions (IQ9)                     |   |
|  |                   chunks.136.mjs:1816-1842                     |   |
|  +-----------------------------+---------------------------------+   |
|                                |                                      |
|               +----------------v----------------+                     |
|               |   Custom Command Configured?    |                     |
|               |   fileSuggestion.type="command" |                     |
|               +----------------+----------------+                     |
|                                |                                      |
|          +--------------------+--------------------+                 |
|          | YES                                     | NO              |
|          v                                         v                 |
|  +---------------+                    +---------------------------+  |
|  | Execute       |                    |    Cache Expired? (60s)   |  |
|  | Custom Cmd    |                    +-------------+-------------+  |
|  | Qq0()         |                                  |                 |
|  +---------------+                    +-------------+-------------+  |
|                                       |    YES      |     NO      |  |
|                                       v             v             v  |
|                          +------------+  +----------+  +----------+  |
|                          | First Call |  | BG       |  | Use      |  |
|                          | Wait Init  |  | Refresh  |  | Cache    |  |
|                          +-----+------+  +----+-----+  +----+-----+  |
|                                |              |             |        |
|                                +------+-------+-------------+        |
|                                       |                              |
|                                       v                              |
|  +---------------------------------------------------------------+   |
|  |                   Index Build (IY7)                            |   |
|  |                                                                |   |
|  |  1. Git ls-files discovery (YY7)                               |   |
|  |  2. Ripgrep fallback (XY7) if git fails                        |   |
|  |  3. Workspace file scanning (JY7)                              |   |
|  |  4. Extract directory prefixes (KR0)                           |   |
|  |  5. Load into FileIndex                                        |   |
|  +-----------------------------+---------------------------------+   |
|                                |                                      |
|               +----------------v----------------+                     |
|               |    Rust Module Available?       |                     |
|               +----------------+----------------+                     |
|                                |                                      |
|          +--------------------+--------------------+                 |
|          | YES                                     | NO              |
|          v                                         v                 |
|  +------------------+                    +----------------------+    |
|  | Rust FileIndex   |                    |   Fuse.js Fallback   |    |
|  | (file-index.node)|                    |   (In-memory search) |    |
|  | High-performance |                    |   Fuzzy matching     |    |
|  | native search    |                    |   threshold: 0.5     |    |
|  +------------------+                    +----------------------+    |
|                                                                       |
+-----------------------------------------------------------------------+
                               |
                               v
                       Return Suggestions
```

### Backend Selection Logic

```javascript
// ============================================
// getFileIndex (QY7) - Load Rust FileIndex module
// Location: chunks.136.mjs:1521-1529
// ============================================

// ORIGINAL (for source lookup):
async function QY7() {
  if (GE1) return null;
  if (shA) return shA;
  if (LG()) try {
    return shA = new(await Promise.resolve().then(() => (JR0(), YR0))).FileIndex, shA
  } catch (A) {
    return GE1 = !0, k(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${A instanceof Error?A.message:String(A)}`), e(A), null
  } else return GE1 = !0, k("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}

// READABLE (for understanding):
async function getFileIndex() {
  // Already failed - don't retry
  if (rustModuleFailed) return null;

  // Return cached instance
  if (fileIndexInstance) return fileIndexInstance;

  // Only available in bundled mode
  if (isBundledMode()) {
    try {
      fileIndexInstance = new (await loadRustModule()).FileIndex;
      return fileIndexInstance;
    } catch (error) {
      rustModuleFailed = true;
      log(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${error.message}`);
      return null;
    }
  } else {
    rustModuleFailed = true;
    log("[FileIndex] Not in bundled mode, using Fuse.js fallback");
    return null;
  }
}

// Mapping: QY7→getFileIndex, GE1→rustModuleFailed, shA→fileIndexInstance,
//          LG→isBundledMode, JR0/YR0→loadRustModule
```

**Key Decision: Why Dual Backend?**

The Rust FileIndex provides significantly better performance for large codebases (10x+ faster search), but requires:
- Bundled distribution mode (not npm install from source)
- Native module compilation for the target platform

The Fuse.js fallback ensures functionality in all environments with acceptable performance for smaller projects.

---

## 2. Trigger Conditions

### When File Path Autocomplete Triggers

| Scenario | Trigger Method | Example |
|----------|---------------|---------|
| **@ mention** | User types `@` followed by path | `@src/comp` → completes to `src/components/` |
| **Tool parameters** | Read/Edit/Glob file_path params | `file_path: "./sr"` |
| **Bash commands** | Command line path arguments | `cat ./src/` |
| **Custom command** | `fileSuggestion.type = "command"` | Delegates to user-defined script |

### Main Entry Point

```javascript
// ============================================
// getFileSuggestions (IQ9) - Main autocomplete entry
// Location: chunks.136.mjs:1816-1842
// ============================================

// ORIGINAL (for source lookup):
async function IQ9(A, Q = !1) {
  if (!A && !Q) return [];
  if (r3().fileSuggestion?.type === "command") {
    let B = {
      ...jE(),
      query: A
    };
    return (await Qq0(B)).slice(0, NzA).map(ehA)
  }
  if (A === "" || A === "." || A === "./") {
    let B = await KY7();
    return XR0(), B.slice(0, NzA).map(ehA)
  }
  try {
    let G = Date.now() - VR0 > BY7;
    if (!wzA && LzA.length === 0) {
      if (XR0(), f3A) await f3A
    } else if (G) XR0();
    let Z = A,
      Y = "." + JW.sep;
    if (A.startsWith(Y)) Z = A.substring(2);
    if (Z.startsWith("~")) Z = Y4(Z);
    return await WY7(wzA, LzA, Z)
  } catch (B) {
    return e(B), []
  }
}

// READABLE (for understanding):
async function getFileSuggestions(query, forceRefresh = false) {
  // Empty query without force - return nothing
  if (!query && !forceRefresh) return [];

  // Check for custom command configuration
  if (getSessionConfig().fileSuggestion?.type === "command") {
    let context = {
      ...getSessionContext(),
      query: query
    };
    return (await executeFileSuggestionCommand(context))
      .slice(0, MAX_SUGGESTIONS)
      .map(createFileResult);
  }

  // Special case: empty/root queries - list current directory
  if (query === "" || query === "." || query === "./") {
    let directoryListing = await listCurrentDirectory();
    refreshIndexCache();  // Trigger background refresh
    return directoryListing.slice(0, MAX_SUGGESTIONS).map(createFileResult);
  }

  try {
    // Check if cache is stale (>60 seconds old)
    let isStale = Date.now() - lastRefreshTimestamp > CACHE_TTL;

    // First call - need to wait for index initialization
    if (!rustFileIndex && fallbackFileList.length === 0) {
      refreshIndexCache();
      if (refreshPromise) await refreshPromise;
    }
    // Cache stale - refresh in background (don't wait)
    else if (isStale) {
      refreshIndexCache();
    }

    // Normalize query
    let normalizedQuery = query;
    let dotSlash = "." + path.sep;
    if (query.startsWith(dotSlash)) {
      normalizedQuery = query.substring(2);
    }
    if (normalizedQuery.startsWith("~")) {
      normalizedQuery = expandTilde(normalizedQuery);
    }

    return await performSearch(rustFileIndex, fallbackFileList, normalizedQuery);
  } catch (error) {
    reportError(error);
    return [];
  }
}

// Mapping: IQ9→getFileSuggestions, A→query, Q→forceRefresh, r3→getSessionConfig,
//          jE→getSessionContext, Qq0→executeFileSuggestionCommand, NzA→MAX_SUGGESTIONS,
//          ehA→createFileResult, KY7→listCurrentDirectory, XR0→refreshIndexCache,
//          VR0→lastRefreshTimestamp, BY7→CACHE_TTL, wzA→rustFileIndex,
//          LzA→fallbackFileList, f3A→refreshPromise, WY7→performSearch, Y4→expandTilde
```

**Key Insight: Query Normalization**

Before searching, queries are normalized:
1. Remove leading `./` prefix
2. Expand `~` to home directory path
3. This ensures consistent matching regardless of how users type paths

---

## 3. Index Building Flow

### File Discovery Strategy

```
+---------------------------------------------------------------------+
|                    Index Building Flow (IY7)                          |
|                  chunks.136.mjs:1680-1711                             |
+---------------------------------------------------------------------+
|                                                                       |
|  Step 1: File Discovery (Parallel)                                   |
|  +---------------------------------------------------------------+   |
|  | Promise.all([                                                 |   |
|  |   getProjectFiles(signal, respectGitignore),  // XY7          |   |
|  |   getWorkspaceFiles(workspacePath)            // JY7          |   |
|  | ])                                                            |   |
|  +---------------------------------------------------------------+   |
|                                |                                      |
|                                v                                      |
|  Step 2: getProjectFiles Strategy                                    |
|  +---------------------------------------------------------------+   |
|  | 1. Try git ls-files --recurse-submodules (YY7)                |   |
|  |    - Fast for git repos                                       |   |
|  |    - Respects .gitignore by default                           |   |
|  |    - Background fetch of untracked files                      |   |
|  |                                                                |   |
|  | 2. Fallback to ripgrep if git fails:                          |   |
|  |    $ rg --files --follow --hidden --glob '!.git/'             |   |
|  |    - Works in non-git directories                             |   |
|  |    - --no-ignore-vcs flag if respectGitignore=false           |   |
|  +---------------------------------------------------------------+   |
|                                |                                      |
|                                v                                      |
|  Step 3: Extract Directory Prefixes (KR0)                            |
|  +---------------------------------------------------------------+   |
|  |  Input: ["src/components/Button.tsx",                         |   |
|  |          "src/utils/helpers.ts"]                              |   |
|  |                                                                |   |
|  |  Output: ["src/", "src/components/", "src/utils/"]            |   |
|  |                                                                |   |
|  |  Purpose: Enable directory-level completion                   |   |
|  +---------------------------------------------------------------+   |
|                                |                                      |
|                                v                                      |
|  Step 4: Load into Index Engine                                      |
|  +---------------------------------------------------------------+   |
|  |  if (rustIndex) {                                             |   |
|  |    rustIndex.loadFromFileList(allPaths);                      |   |
|  |  } else {                                                     |   |
|  |    fallbackFileList = allPaths;                               |   |
|  |  }                                                            |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
+---------------------------------------------------------------------+
```

### Git-Based File Discovery

```javascript
// ============================================
// getFilesUsingGit (YY7) - Git ls-files discovery
// Location: chunks.136.mjs:1594-1649
// ============================================

// ORIGINAL (for source lookup):
async function YY7(A, Q) {
  let B = Date.now();
  if (k("[FileIndex] getFilesUsingGit called"), !await GY7())
    return k("[FileIndex] not a git repo, returning null"), null;
  try {
    let G = cOA(o1());
    if (!G) return k("[FileIndex] git rev-parse --show-toplevel failed..."), null;
    let Z = o1(),
      Y = Date.now(),
      J = await J2("git", ["ls-files", "--recurse-submodules"], {
        timeout: 5000,
        abortSignal: A,
        cwd: Z
      });
    if (k(`[FileIndex] git ls-files (tracked) took ${Date.now()-Y}ms`), J.code !== 0)
      return k(`[FileIndex] git ls-files failed...`), null;
    let X = J.stdout.trim().split(`\n`).filter(Boolean),
      I = EQ(),
      D = GQ9(X, G, I),
      W = ZQ9(G, Z);
    if (W) {
      let V = D.length;
      D = W.filter(D), k(`[FileIndex] applied ignore patterns: ${V} -> ${D.length} files`)
    }
    qzA = D;
    // ... background untracked fetch ...
    return D
  } catch (G) {
    return k(`[FileIndex] git ls-files error: ${G.message}`), null
  }
}

// READABLE (for understanding):
async function getFilesUsingGit(abortSignal, respectGitignore) {
  let startTime = Date.now();
  log("[FileIndex] getFilesUsingGit called");

  // Check if we're in a git repository
  if (!await isGitRepo()) {
    log("[FileIndex] not a git repo, returning null");
    return null;
  }

  try {
    let gitRoot = getGitRootPath(getCwd());
    if (!gitRoot) {
      log("[FileIndex] git rev-parse --show-toplevel failed");
      return null;
    }

    let workingDir = getCwd();
    let gitStartTime = Date.now();

    // Run git ls-files for tracked files
    let result = await execCommand("git", ["ls-files", "--recurse-submodules"], {
      timeout: 5000,
      abortSignal: abortSignal,
      cwd: workingDir
    });

    log(`[FileIndex] git ls-files (tracked) took ${Date.now() - gitStartTime}ms`);

    if (result.code !== 0) {
      log(`[FileIndex] git ls-files failed (code=${result.code})`);
      return null;
    }

    // Parse output into file list
    let files = result.stdout.trim().split("\n").filter(Boolean);
    let currentDir = getEffectiveWorkingDir();
    let relativePaths = normalizePathsRelativeTo(files, gitRoot, currentDir);

    // Apply ignore patterns (.ignore, .rgignore)
    let ignoreFilter = loadIgnorePatterns(gitRoot, workingDir);
    if (ignoreFilter) {
      let beforeCount = relativePaths.length;
      relativePaths = ignoreFilter.filter(relativePaths);
      log(`[FileIndex] applied ignore patterns: ${beforeCount} -> ${relativePaths.length} files`);
    }

    // Store as tracked files
    trackedFiles = relativePaths;

    let duration = Date.now() - startTime;
    log(`[FileIndex] git ls-files: ${relativePaths.length} tracked files in ${duration}ms`);

    // Record telemetry
    recordTelemetry("tengu_file_suggestions_git_ls_files", {
      file_count: relativePaths.length,
      tracked_count: relativePaths.length,
      untracked_count: 0,
      duration_ms: duration
    });

    // Background fetch untracked files (non-blocking)
    if (!untrackedFetchPromise) {
      untrackedFetchPromise = execCommand("git",
        respectGitignore
          ? ["ls-files", "--others", "--exclude-standard"]
          : ["ls-files", "--others"],
        { timeout: 10000, cwd: workingDir }
      ).then(response => {
        if (response.code === 0) {
          let untrackedFiles = response.stdout.trim().split("\n").filter(Boolean);
          // ... normalize and merge into index ...
          mergeUntrackedFiles(untrackedFiles);
        }
      }).catch(error => {
        log(`[FileIndex] background untracked fetch failed: ${error}`);
      }).finally(() => {
        untrackedFetchPromise = null;
      });
    }

    return relativePaths;
  } catch (error) {
    log(`[FileIndex] git ls-files error: ${error.message}`);
    return null;
  }
}

// Mapping: YY7→getFilesUsingGit, A→abortSignal, Q→respectGitignore, GY7→isGitRepo,
//          cOA→getGitRootPath, o1→getCwd, J2→execCommand, EQ→getEffectiveWorkingDir,
//          GQ9→normalizePathsRelativeTo, ZQ9→loadIgnorePatterns, qzA→trackedFiles,
//          ZE1→untrackedFetchPromise
```

**Key Decision: Why Git First, Then Ripgrep?**

1. **Git ls-files is faster** - It reads from Git's index, which is already optimized
2. **Respects .gitignore** - Automatically excludes ignored files
3. **Handles submodules** - `--recurse-submodules` flag
4. **Fallback ensures robustness** - Works in non-git directories

### Directory Prefix Extraction

```javascript
// ============================================
// extractDirectoryPrefixes (KR0) - Extract parent directories
// Location: chunks.136.mjs:1651-1658
// ============================================

// ORIGINAL (for source lookup):
function KR0(A) {
  let Q = new Set;
  return A.forEach((B) => {
    let G = JW.parse(B).root,
      Z = JW.dirname(B);
    while (Z !== "." && Z !== G && !Q.has(Z)) Q.add(Z), Z = JW.dirname(Z)
  }), [...Q].map((B) => B + JW.sep)
}

// READABLE (for understanding):
function extractDirectoryPrefixes(files) {
  let directories = new Set();

  files.forEach((filePath) => {
    let rootDir = path.parse(filePath).root;
    let currentDir = path.dirname(filePath);

    // Walk up the directory tree
    while (currentDir !== "." && currentDir !== rootDir && !directories.has(currentDir)) {
      directories.add(currentDir);
      currentDir = path.dirname(currentDir);
    }
  });

  // Add trailing separator to mark as directories
  return [...directories].map((dir) => dir + path.sep);
}

// Mapping: KR0→extractDirectoryPrefixes, A→files, JW→path, Q→directories
```

**Why Extract Directory Prefixes?**

This enables users to autocomplete to directories, not just files. When user types `src/`, they see `src/components/`, `src/utils/`, etc.

---

## 4. Cache Mechanism

### Cache Variables

```javascript
// Location: chunks.136.mjs:1854-1880

let fileIndexInstance = null;    // shA - Rust FileIndex singleton
let rustModuleFailed = false;    // GE1 - Whether Rust module load failed
let rustFileIndex = null;        // wzA - Cached Rust index instance
let fallbackFileList = [];       // LzA - Cached file list for Fuse.js
let refreshPromise = null;       // f3A - Pending refresh Promise
let lastRefreshTimestamp = 0;    // VR0 - Last refresh time
const CACHE_TTL = 60000;         // BY7 - 60 second TTL
let isGitRepoCache = null;       // thA - Git repo detection cache
let gitRepoCacheCwd = null;      // IR0 - CWD when git cache was set
let untrackedFetchPromise = null;// ZE1 - Background untracked fetch
let trackedFiles = [];           // qzA - Tracked files list
let ignorePatterns = null;       // DR0 - Loaded ignore patterns
let ignorePatternsKey = null;    // WR0 - Cache key for patterns
const MAX_SUGGESTIONS = 15;      // NzA - Maximum results to return
```

### Cache Refresh Logic

```javascript
// ============================================
// refreshIndexCache (XR0) - Trigger cache refresh
// Location: chunks.136.mjs:1791-1799
// ============================================

// ORIGINAL (for source lookup):
function XR0() {
  if (!f3A) f3A = IY7().then((A) => {
    return wzA = A.fileIndex, LzA = A.fileList, VR0 = Date.now(), f3A = null, A
  }).catch((A) => {
    return k(`[FileIndex] Cache refresh failed: ${A instanceof Error?A.message:String(A)}`),
           e(A), f3A = null, {
      fileIndex: null,
      fileList: []
    }
  })
}

// READABLE (for understanding):
function refreshIndexCache() {
  // Promise deduplication - only one refresh at a time
  if (!refreshPromise) {
    refreshPromise = initializeFileIndex()
      .then((result) => {
        rustFileIndex = result.fileIndex;
        fallbackFileList = result.fileList;
        lastRefreshTimestamp = Date.now();
        refreshPromise = null;
        return result;
      })
      .catch((error) => {
        log(`[FileIndex] Cache refresh failed: ${error.message}`);
        reportError(error);
        refreshPromise = null;
        return { fileIndex: null, fileList: [] };
      });
  }
  // Returns undefined - callers can await f3A if needed
}

// Mapping: XR0→refreshIndexCache, f3A→refreshPromise, IY7→initializeFileIndex,
//          wzA→rustFileIndex, LzA→fallbackFileList, VR0→lastRefreshTimestamp
```

### Cache Strategy Diagram

```
Timeline:
─────────────────────────────────────────────────────────────────
│ First Call  │    Within 60s    │   After 60s   │
─────────────────────────────────────────────────────────────────
│ Sync wait   │  Use cache       │ Background    │
│ for index   │  Immediate       │ refresh       │
│ build       │  return          │ Use old cache │
─────────────────────────────────────────────────────────────────

Key Properties:
✓ First call blocks to ensure data exists
✓ Within TTL: immediate response from cache
✓ After TTL: background refresh, stale-while-revalidate
✓ Promise deduplication prevents concurrent builds
✓ Timeout protection (10 seconds max for index build)
```

---

## 5. Search Algorithm

### Rust FileIndex Search

The Rust native module provides:
- O(1) or O(log n) lookup depending on query
- Native string matching performance
- Memory-efficient storage

```javascript
// Rust module interface (from file-index.node)
class FileIndex {
  // Load file paths into the index
  loadFromFileList(paths: string[]): void;

  // Search for matching paths
  search(query: string, maxResults: number): SearchResult[];
}

interface SearchResult {
  path: string;   // Matching file path
  score: number;  // Relevance score (lower is better)
}
```

### Fuse.js Fallback Search

```javascript
// ============================================
// performSearch (WY7) - Search file index
// Location: chunks.136.mjs:1742-1789
// ============================================

// ORIGINAL (for source lookup):
async function WY7(A, Q, B) {
  if (A) try {
    return A.search(B, NzA).map((D) => ehA(D.path, D.score))
  } catch (I) {
    k(`[FileIndex] Rust search failed, falling back to Fuse.js: ${I.message}`), e(I)
  }
  k("[FileIndex] Using Fuse.js fallback for search");
  let G = [...new Set(Q)];
  if (!B) {
    let I = new Set;
    for (let D of G) {
      let W = D.split(JW.sep)[0];
      if (W) {
        if (I.add(W), I.size >= NzA) break
      }
    }
    return [...I].sort().map(ehA)
  }
  let Z = G.map((I) => {
      return {
        path: I,
        filename: JW.basename(I),
        testPenalty: I.includes("test") ? 1 : 0
      }
    }),
    Y = B.lastIndexOf(JW.sep);
  if (Y > 2) Z = Z.filter((I) => {
    return I.path.substring(0, Y).startsWith(B.substring(0, Y))
  });
  let X = new Vw(Z, {
    includeScore: !0,
    threshold: 0.5,
    keys: [{
      name: "path",
      weight: 1
    }, {
      name: "filename",
      weight: 2
    }]
  }).search(B, {
    limit: NzA
  });
  return X = X.sort((I, D) => {
    if (I.score === void 0 || D.score === void 0) return 0;
    if (Math.abs(I.score - D.score) > 0.05) return I.score - D.score;
    return I.item.testPenalty - D.item.testPenalty
  }), X.map((I) => I.item.path).slice(0, NzA).map(ehA)
}

// READABLE (for understanding):
async function performSearch(rustIndex, fallbackList, query) {
  // Try Rust index first
  if (rustIndex) {
    try {
      return rustIndex.search(query, MAX_SUGGESTIONS)
        .map((result) => createFileResult(result.path, result.score));
    } catch (error) {
      log(`[FileIndex] Rust search failed, falling back to Fuse.js: ${error.message}`);
      reportError(error);
    }
  }

  log("[FileIndex] Using Fuse.js fallback for search");

  // Deduplicate file list
  let uniqueFiles = [...new Set(fallbackList)];

  // Empty query: return top-level directories
  if (!query) {
    let topLevelDirs = new Set();
    for (let file of uniqueFiles) {
      let topDir = file.split(path.sep)[0];
      if (topDir) {
        topLevelDirs.add(topDir);
        if (topLevelDirs.size >= MAX_SUGGESTIONS) break;
      }
    }
    return [...topLevelDirs].sort().map(createFileResult);
  }

  // Build search documents with metadata
  let documents = uniqueFiles.map((filePath) => ({
    path: filePath,
    filename: path.basename(filePath),
    testPenalty: filePath.includes("test") ? 1 : 0  // Deprioritize test files
  }));

  // Path prefix optimization - filter by directory prefix
  let lastSepIndex = query.lastIndexOf(path.sep);
  if (lastSepIndex > 2) {
    documents = documents.filter((doc) =>
      doc.path.substring(0, lastSepIndex)
        .startsWith(query.substring(0, lastSepIndex))
    );
  }

  // Fuse.js fuzzy search
  let fuse = new Fuse(documents, {
    includeScore: true,
    threshold: 0.5,           // 50% match required
    keys: [
      { name: "path", weight: 1 },
      { name: "filename", weight: 2 }  // Filename matches rank higher
    ]
  });

  let results = fuse.search(query, { limit: MAX_SUGGESTIONS });

  // Sort by score, with test file penalty
  results = results.sort((a, b) => {
    if (a.score === undefined || b.score === undefined) return 0;
    // If scores are similar (within 0.05), use test penalty
    if (Math.abs(a.score - b.score) > 0.05) {
      return a.score - b.score;  // Lower score = better match
    }
    return a.item.testPenalty - b.item.testPenalty;
  });

  return results.map((r) => r.item.path)
    .slice(0, MAX_SUGGESTIONS)
    .map(createFileResult);
}

// Mapping: WY7→performSearch, A→rustIndex, Q→fallbackList, B→query,
//          NzA→MAX_SUGGESTIONS, ehA→createFileResult, Vw→Fuse, JW→path
```

**Key Search Algorithm Insights:**

1. **Filename Weight = 2x Path Weight**
   - `Button.tsx` matches "button" better than `src/components/buttons/index.ts`
   - More intuitive for users who remember filenames

2. **Test File Penalty**
   - Files containing "test" in path are deprioritized
   - When scores are close, non-test files appear first

3. **Path Prefix Optimization**
   - If query includes directory separator, pre-filter by prefix
   - Dramatically reduces search space for deep queries

4. **Threshold = 0.5**
   - Requires 50% similarity for matches
   - Balances precision vs recall for fuzzy matching

---

## 6. Configuration

### Settings Schema

```javascript
// chunks.90.mjs - fileSuggestion configuration
fileSuggestion: {
  type: "command",       // Enable custom command mode
  command: "/path/to/script"  // Script to execute for suggestions
}
```

### Configuration Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `fileSuggestion.type` | `"command"` | undefined | Enable custom suggestion command |
| `fileSuggestion.command` | string | - | Path to executable returning suggestions |
| `respectGitignore` | boolean | true | Whether to respect .gitignore patterns |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `RIPGREP_NODE_PATH` | Override ripgrep binary location |

---

## 7. Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Code Indexing module

### Core Functions

- `getFileIndex` (QY7) - Load Rust FileIndex module
- `getFilesUsingGit` (YY7) - Git ls-files discovery
- `getProjectFiles` (XY7) - Main file discovery with fallback
- `initializeFileIndex` (IY7) - Build complete index
- `performSearch` (WY7) - Search file index
- `getFileSuggestions` (IQ9) - Main autocomplete entry point
- `refreshIndexCache` (XR0) - Trigger cache refresh
- `loadIgnorePatterns` (ZQ9) - Load .ignore/.rgignore patterns
- `extractDirectoryPrefixes` (KR0) - Extract parent directories
- `createFileResult` (ehA) - Create suggestion object
- `listCurrentDirectory` (KY7) - List CWD contents
- `mergeUntrackedFiles` (ZY7) - Merge untracked files into index
- `clearFileIndexCache` (JQ9) - Reset all caches
- `clearAllCaches` (XE1) - Clear command handler

### Global Variables

- `rustFileIndex` (wzA) - Cached Rust index instance
- `fallbackFileList` (LzA) - JS fallback file list
- `lastRefreshTimestamp` (VR0) - Cache timestamp
- `refreshPromise` (f3A) - Pending refresh Promise
- `CACHE_TTL` (BY7) - 60000ms TTL constant
- `MAX_SUGGESTIONS` (NzA) - 15 max results
- `fileIndexInstance` (shA) - Rust FileIndex singleton
- `rustModuleFailed` (GE1) - Rust load failure flag
- `trackedFiles` (qzA) - Tracked files list
- `ignorePatterns` (DR0) - Loaded ignore patterns

---

## Summary

### FileIndex vs Tree-sitter Comparison

| Aspect | FileIndex | Tree-sitter |
|--------|-----------|-------------|
| **Purpose** | File path autocomplete | Bash command AST parsing |
| **Trigger** | @ mention / path input | Bash tool execution |
| **Data** | File path strings | Syntax tree nodes |
| **Cache** | 60s TTL | Parser singleton |
| **Implementation** | Rust + Fuse.js | WASM |

### Key Design Decisions

1. **On-demand Building** - Index built on first use, not at startup
2. **Background Refresh** - Updates after 60s without blocking user
3. **Dual Engine** - Rust performance + Fuse.js fallback guarantee
4. **Smart Sorting** - Filename weight higher, test files deprioritized

---

## Related Documentation

- [Tree-sitter Bash Parsing](./tree_sitter.md) - AST parsing system
- [Integration Points](./integration.md) - Cross-module connections
