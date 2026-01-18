/**
 * @claudecode/platform - File Index System
 *
 * File path autocomplete with dual backend (Rust native + Fuse.js fallback).
 * Used for @ mentions and file path parameters in tools.
 *
 * Reconstructed from chunks.136.mjs
 *
 * Key symbols:
 * - QY7 → getFileIndex
 * - YY7 → getFilesUsingGit
 * - XY7 → getProjectFiles
 * - IY7 → initializeFileIndex
 * - WY7 → performSearch
 * - IQ9 → getFileSuggestions
 * - XR0 → refreshIndexCache
 * - KR0 → extractDirectoryPrefixes
 */

import * as path from 'path';
import type {
  FileIndex,
  FileSearchResult,
  FileSuggestion,
  FileSuggestionContext,
  FileIndexCache,
} from './types.js';

import { CACHE_TTL, MAX_SUGGESTIONS } from './types.js';

// ============================================
// Global State
// ============================================

/** Rust FileIndex singleton */
let fileIndexInstance: FileIndex | null = null;

/** Whether Rust module load failed */
let rustModuleFailed = false;

/** Cached Rust index instance */
let rustFileIndex: FileIndex | null = null;

/** Cached file list for Fuse.js fallback */
let fallbackFileList: string[] = [];

/** Pending refresh Promise */
let refreshPromise: Promise<FileIndexCache> | null = null;

/** Last refresh timestamp */
let lastRefreshTimestamp = 0;

/** Git repo detection cache */
let isGitRepoCache: boolean | null = null;

/** CWD when git cache was set */
let gitRepoCacheCwd: string | null = null;

/** Tracked files from git */
let trackedFiles: string[] = [];

// ============================================
// Rust Module Loading
// ============================================

/**
 * Check if running in bundled mode.
 */
function isBundledMode(): boolean {
  return typeof (globalThis as any).Bun?.embeddedFiles !== 'undefined';
}

/**
 * Load Rust FileIndex module.
 * Original: QY7 in chunks.136.mjs:1521-1529
 */
async function getFileIndex(): Promise<FileIndex | null> {
  // Already failed - don't retry
  if (rustModuleFailed) return null;

  // Return cached instance
  if (fileIndexInstance) return fileIndexInstance;

  // Only available in bundled mode
  if (isBundledMode()) {
    try {
      // In real implementation:
      // const module = await import('./file-index.node');
      // fileIndexInstance = new module.FileIndex();
      // return fileIndexInstance;
      return null;
    } catch (error) {
      rustModuleFailed = true;
      console.log(
        `[FileIndex] Rust module unavailable, falling back to Fuse.js: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  } else {
    rustModuleFailed = true;
    console.log('[FileIndex] Not in bundled mode, using Fuse.js fallback');
    return null;
  }
}

// ============================================
// Git Repository Detection
// ============================================

/**
 * Check if current directory is a git repository.
 * Original: GY7 in chunks.136.mjs
 */
async function isGitRepo(cwd: string): Promise<boolean> {
  // Use cache if CWD hasn't changed
  if (isGitRepoCache !== null && gitRepoCacheCwd === cwd) {
    return isGitRepoCache;
  }

  try {
    // In real implementation: exec 'git rev-parse --is-inside-work-tree'
    // For now, check for .git directory
    const { existsSync } = await import('fs');
    const gitDir = path.join(cwd, '.git');
    isGitRepoCache = existsSync(gitDir);
    gitRepoCacheCwd = cwd;
    return isGitRepoCache;
  } catch {
    isGitRepoCache = false;
    gitRepoCacheCwd = cwd;
    return false;
  }
}

// ============================================
// File Discovery
// ============================================

/**
 * Get files using git ls-files.
 * Original: YY7 in chunks.136.mjs:1594-1649
 */
async function getFilesUsingGit(
  cwd: string,
  _abortSignal?: AbortSignal,
  _respectGitignore = true
): Promise<string[] | null> {
  console.log('[FileIndex] getFilesUsingGit called');

  if (!(await isGitRepo(cwd))) {
    console.log('[FileIndex] not a git repo, returning null');
    return null;
  }

  try {
    // In real implementation:
    // 1. Run 'git ls-files --recurse-submodules'
    // 2. Parse output into file list
    // 3. Apply ignore patterns
    // 4. Background fetch untracked files

    // Stub implementation - return empty
    return [];
  } catch (error) {
    console.log(`[FileIndex] git ls-files error: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Get files using ripgrep fallback.
 * Original: XY7 (part) in chunks.136.mjs
 */
async function getFilesUsingRipgrep(
  cwd: string,
  _respectGitignore = true
): Promise<string[]> {
  try {
    // In real implementation:
    // Run 'rg --files --follow --hidden --glob "!.git/"'
    // Parse output into file list

    // Stub implementation - return empty
    return [];
  } catch {
    return [];
  }
}

/**
 * Get project files (git first, then ripgrep fallback).
 * Original: XY7 in chunks.136.mjs
 */
async function getProjectFiles(
  cwd: string,
  abortSignal?: AbortSignal,
  respectGitignore = true
): Promise<string[]> {
  // Try git first
  const gitFiles = await getFilesUsingGit(cwd, abortSignal, respectGitignore);
  if (gitFiles !== null) {
    trackedFiles = gitFiles;
    return gitFiles;
  }

  // Fallback to ripgrep
  return getFilesUsingRipgrep(cwd, respectGitignore);
}

/**
 * Extract directory prefixes from file paths.
 * Original: KR0 in chunks.136.mjs:1651-1658
 */
export function extractDirectoryPrefixes(files: string[]): string[] {
  const directories = new Set<string>();

  files.forEach((filePath) => {
    const rootDir = path.parse(filePath).root;
    let currentDir = path.dirname(filePath);

    // Walk up the directory tree
    while (currentDir !== '.' && currentDir !== rootDir && !directories.has(currentDir)) {
      directories.add(currentDir);
      currentDir = path.dirname(currentDir);
    }
  });

  // Add trailing separator to mark as directories
  return [...directories].map((dir) => dir + path.sep);
}

// ============================================
// Index Building
// ============================================

/**
 * Initialize file index.
 * Original: IY7 in chunks.136.mjs:1680-1711
 */
async function initializeFileIndex(cwd: string): Promise<FileIndexCache> {
  console.log('[FileIndex] Building index...');
  const startTime = Date.now();

  try {
    // Get project files
    const files = await getProjectFiles(cwd);

    // Extract directory prefixes for directory completion
    const dirPrefixes = extractDirectoryPrefixes(files);

    // Combine files and directory prefixes
    const allPaths = [...files, ...dirPrefixes];

    console.log(`[FileIndex] Found ${files.length} files, ${dirPrefixes.length} directories`);

    // Try to load into Rust index
    const rustIndex = await getFileIndex();
    if (rustIndex) {
      rustIndex.loadFromFileList(allPaths);
      console.log(
        `[FileIndex] Rust index built in ${Date.now() - startTime}ms`
      );
      return {
        rustIndex,
        fileList: allPaths,
        timestamp: Date.now(),
      };
    }

    // Use fallback file list
    console.log(
      `[FileIndex] Fallback list built in ${Date.now() - startTime}ms`
    );
    return {
      rustIndex: null,
      fileList: allPaths,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.log(`[FileIndex] Index build failed: ${(error as Error).message}`);
    return {
      rustIndex: null,
      fileList: [],
      timestamp: Date.now(),
    };
  }
}

/**
 * Refresh index cache.
 * Original: XR0 in chunks.136.mjs:1791-1799
 */
function refreshIndexCache(cwd: string): void {
  // Promise deduplication - only one refresh at a time
  if (!refreshPromise) {
    refreshPromise = initializeFileIndex(cwd)
      .then((result) => {
        rustFileIndex = result.rustIndex;
        fallbackFileList = result.fileList;
        lastRefreshTimestamp = Date.now();
        refreshPromise = null;
        return result;
      })
      .catch((error) => {
        console.log(`[FileIndex] Cache refresh failed: ${(error as Error).message}`);
        refreshPromise = null;
        return { rustIndex: null, fileList: [], timestamp: Date.now() };
      });
  }
}

// ============================================
// Search
// ============================================

/**
 * Create file suggestion result.
 * Original: ehA in chunks.136.mjs
 */
function createFileResult(filePath: string, score?: number): FileSuggestion {
  const isDirectory = filePath.endsWith(path.sep);
  return {
    path: filePath,
    isDirectory,
    name: isDirectory ? path.basename(filePath.slice(0, -1)) + '/' : path.basename(filePath),
    score,
  };
}

/**
 * Perform search in file index.
 * Original: WY7 in chunks.136.mjs:1742-1789
 */
async function performSearch(
  rustIndex: FileIndex | null,
  fallbackList: string[],
  query: string
): Promise<FileSuggestion[]> {
  // Try Rust index first
  if (rustIndex) {
    try {
      return rustIndex
        .search(query, MAX_SUGGESTIONS)
        .map((result) => createFileResult(result.path, result.score));
    } catch (error) {
      console.log(
        `[FileIndex] Rust search failed, falling back to Fuse.js: ${
          (error as Error).message
        }`
      );
    }
  }

  console.log('[FileIndex] Using Fuse.js fallback for search');

  // Deduplicate file list
  const uniqueFiles = [...new Set(fallbackList)];

  // Empty query: return top-level directories
  if (!query) {
    const topLevelDirs = new Set<string>();
    for (const file of uniqueFiles) {
      const topDir = file.split(path.sep)[0];
      if (topDir) {
        topLevelDirs.add(topDir);
        if (topLevelDirs.size >= MAX_SUGGESTIONS) break;
      }
    }
    return [...topLevelDirs].sort().map((dir) => createFileResult(dir));
  }

  // Simple prefix matching fallback (without Fuse.js for simplicity)
  const matches = uniqueFiles
    .filter((file) => {
      const lowerFile = file.toLowerCase();
      const lowerQuery = query.toLowerCase();
      return (
        lowerFile.includes(lowerQuery) ||
        path.basename(file).toLowerCase().includes(lowerQuery)
      );
    })
    .slice(0, MAX_SUGGESTIONS);

  // Sort by relevance (filename matches first, then path matches)
  matches.sort((a, b) => {
    const aBasename = path.basename(a).toLowerCase();
    const bBasename = path.basename(b).toLowerCase();
    const lowerQuery = query.toLowerCase();

    const aFilenameMatch = aBasename.includes(lowerQuery);
    const bFilenameMatch = bBasename.includes(lowerQuery);

    if (aFilenameMatch && !bFilenameMatch) return -1;
    if (!aFilenameMatch && bFilenameMatch) return 1;

    // Deprioritize test files
    const aIsTest = a.includes('test');
    const bIsTest = b.includes('test');
    if (!aIsTest && bIsTest) return -1;
    if (aIsTest && !bIsTest) return 1;

    return a.localeCompare(b);
  });

  return matches.map((file) => createFileResult(file));
}

// ============================================
// Main API
// ============================================

/**
 * Get file suggestions for autocomplete.
 * Original: IQ9 in chunks.136.mjs:1816-1842
 */
export async function getFileSuggestions(
  query: string,
  cwd: string,
  forceRefresh = false
): Promise<FileSuggestion[]> {
  // Empty query without force - return nothing
  if (!query && !forceRefresh) return [];

  // Special case: empty/root queries - list current directory
  if (query === '' || query === '.' || query === './') {
    // In real implementation: list current directory contents
    refreshIndexCache(cwd); // Trigger background refresh
    return [];
  }

  try {
    // Check if cache is stale
    const isStale = Date.now() - lastRefreshTimestamp > CACHE_TTL;

    // First call - need to wait for index initialization
    if (!rustFileIndex && fallbackFileList.length === 0) {
      refreshIndexCache(cwd);
      if (refreshPromise) await refreshPromise;
    }
    // Cache stale - refresh in background
    else if (isStale) {
      refreshIndexCache(cwd);
    }

    // Normalize query
    let normalizedQuery = query;
    const dotSlash = '.' + path.sep;
    if (query.startsWith(dotSlash)) {
      normalizedQuery = query.substring(2);
    }
    if (normalizedQuery.startsWith('~')) {
      // In real implementation: expand tilde to home directory
      normalizedQuery = normalizedQuery.slice(1);
    }

    return performSearch(rustFileIndex, fallbackFileList, normalizedQuery);
  } catch (error) {
    console.error('[FileIndex] Error:', error);
    return [];
  }
}

/**
 * Clear all file index caches.
 * Original: JQ9 in chunks.136.mjs
 */
export function clearFileIndexCache(): void {
  rustFileIndex = null;
  fallbackFileList = [];
  lastRefreshTimestamp = 0;
  refreshPromise = null;
  isGitRepoCache = null;
  gitRepoCacheCwd = null;
  trackedFiles = [];
}

/**
 * Execute custom file suggestion command.
 * Original: Qq0 in chunks.136.mjs
 */
export async function executeFileSuggestionCommand(
  context: FileSuggestionContext
): Promise<string[]> {
  // In real implementation:
  // 1. Get custom command from settings
  // 2. Execute command with context
  // 3. Parse output as file paths
  return [];
}

// ============================================
// Export
// ============================================

export {
  getFileIndex,
  isGitRepo,
  getFilesUsingGit,
  getFilesUsingRipgrep,
  getProjectFiles,
  extractDirectoryPrefixes,
  initializeFileIndex,
  refreshIndexCache,
  performSearch,
  getFileSuggestions,
  clearFileIndexCache,
  executeFileSuggestionCommand,
  createFileResult,
};
