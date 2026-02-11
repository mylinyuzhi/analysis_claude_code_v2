# Implementation Report - Code Indexing (Module 14)

## Overview

Code Indexing in Claude Code v2.1.38 is primarily focused on high-performance file discovery and fuzzy searching. The system employs a hybrid architecture, using a native Rust-based index for speed with a JavaScript (Fuse.js) fallback for compatibility. It integrates deeply with Git and Ripgrep to maintain an up-to-date view of the project structure.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getFileIndex` (LiY) - Factory function that returns the Rust or Fuse.js indexer
- `rebuildIndex` (xiY) - Main entry point for scanning the project and updating the index
- `getFilesUsingGit` (SiY) - Uses `git ls-files` to efficiently list tracked/untracked files
- `searchFileIndex` (uiY) - Performs fuzzy search against the current index
- `refreshIndexCache` (OIA) - Handles background cache invalidation and rebuilding

## Core Algorithms

### 1. Hybrid Indexing Architecture

The system prioritizes performance by offloading heavy search tasks to a native module.

**Backend Selection:**
1.  **Rust Indexer**: Loaded via `await import(...)`. This provides sub-millisecond search performance for large monorepos.
2.  **Fuse.js Fallback**: Used if the native module fails to load or if the app is not running in "bundled" mode.

### 2. Project Scanning and Discovery (`SiY` / `getFilesUsingGit`)

Claude Code uses a "Git-first" discovery approach to respect ignore rules and prioritize relevant files.

**Sequence:**
1.  **Git Check**: Runs `git rev-parse --show-toplevel`.
2.  **Tracked Files**: Executes `git ls-files --recurse-submodules`.
3.  **Untracked Files**: Background fetch using `git ls-files --others --exclude-standard`.
4.  **Ignore Merging**: Aggregates patterns from `.gitignore`, `.ignore`, and `.rgignore`.
5.  **Ripgrep Fallback**: If Git is unavailable, it runs `rg --files --follow --hidden` to populate the list.

### 3. Fuzzy Search with Contextual Weighting (`uiY`)

When using the Fuse.js fallback, the system applies specific weights to improve search quality for developers.

====
// searchFileIndex - Fuzzy search implementation with weighting
// Location: chunks.152.mjs:1226-1273
====

// ORIGINAL (for source lookup):
async function uiY(A, q, K) {
    if (A) try {
        return A.search(K, aG1).map((_) => tU1(_.path, _.score))
    } catch (O) {
        h(`[FileIndex] Rust search failed, falling back to Fuse.js: ${O instanceof Error?O.message:String(O)}`);
    }
    let z = Y.map((O) => ({
        path: O,
        filename: bJ.basename(O),
        testPenalty: O.includes("test") ? 1 : 0
    }));
    let $ = new wy(z, {
        includeScore: !0,
        threshold: 0.5,
        keys: [{ name: "path", weight: 1 }, { name: "filename", weight: 2 }]
    }).search(K, { limit: aG1 });
    return $ = $.sort((O, _) => {
        if (O.score === void 0 || _.score === void 0) return 0;
        if (Math.abs(O.score - _.score) > 0.05) return O.score - _.score;
        return O.item.testPenalty - _.item.testPenalty
    }).map((O) => O.item.path).slice(0, aG1).map(tU1)
}

// READABLE (for understanding):
async function searchFileIndex(nativeIndex, jsFileList, query) {
    // 1. Try high-performance native search first
    if (nativeIndex) {
        try {
            return nativeIndex.search(query, MAX_RESULTS).map(item => formatResult(item.path, item.score));
        } catch (e) {
            log("[FileIndex] Native search failed, using fallback");
        }
    }

    // 2. Prepare data for Fuse.js fuzzy search
    let searchData = jsFileList.map(path => ({
        path: path,
        filename: path.split('/').pop(),
        testPenalty: path.includes("test") ? 1 : 0 // Penalize test files in results
    }));

    // 3. Execute fuzzy search with weighted keys
    let fuse = new Fuse(searchData, {
        includeScore: true,
        threshold: 0.5,
        keys: [
            { name: "path", weight: 1 },
            { name: "filename", weight: 2 } // Filename match is more important
        ]
    });

    let results = fuse.search(query, { limit: 15 });

    // 4. Sort by score, then apply test penalty for tie-breaking
    return results.sort((a, b) => {
        if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
        return a.item.testPenalty - b.item.testPenalty;
    }).map(r => r.item.path);
}

// Mapping: uiY→searchFileIndex, A→nativeIndex, q→jsFileList, K→query, wy→FuseJS, aG1→MAX_RESULTS (15)

## Key Insight

Claude Code's indexing is designed for **Zero-Configuration Speed**. By utilizing the Git index and Ripgrep, it avoids the overhead of maintaining a persistent database on disk (like SQLite or Vector DB), instead opting for a memory-resident index that is rebuilt every 60 seconds. The use of a native Rust module for search ensures that even in massive codebases, file suggestions remain instantaneous.
