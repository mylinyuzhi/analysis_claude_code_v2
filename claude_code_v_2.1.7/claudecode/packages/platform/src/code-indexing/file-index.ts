/**
 * @claudecode/platform - File Index System
 *
 * File path autocomplete with dual backend (Rust native + Fuse.js fallback).
 * Used for @ mentions and file path parameters in tools.
 *
 * Reconstructed from chunks.136.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import ignore from 'ignore';
import Fuse from 'fuse.js';

import { recordTelemetry } from '../telemetry/index.js';
import type {
  FileIndex,
  FileSuggestion,
  FileSuggestionContext,
  FileIndexCache,
  FileSearchResult,
} from './types.js';

import { CACHE_TTL, MAX_SUGGESTIONS } from './types.js';

const execFileAsync = promisify(execFile);

// ============================================
// Global State
// ============================================

/** Rust FileIndex singleton (shA) */
let fileIndexInstance: FileIndex | null = null;

/** Whether Rust module load failed (GE1) */
let rustModuleFailed = false;

/** Cached Rust index instance (wzA) */
let rustFileIndex: FileIndex | null = null;

/** Cached file list for Fuse.js fallback (LzA) */
let fallbackFileList: string[] = [];

/** Pending refresh Promise (f3A) */
let refreshPromise: Promise<FileIndexCache> | null = null;

/** Last refresh timestamp (VR0) */
let lastRefreshTimestamp = 0;

/** Git repo detection cache (thA) */
let isGitRepoCache: boolean | null = null;

/** CWD when git cache was set (IR0) */
let gitRepoCacheCwd: string | null = null;

/** Background untracked fetch promise (ZE1) */
let untrackedFetchPromise: Promise<void> | null = null;

/** Tracked files from git (qzA) */
let trackedFiles: string[] = [];

/** Loaded ignore patterns (DR0) */
let ignorePatterns: any = null;

/** Cache key for patterns (WR0) */
let ignorePatternsKey: string | null = null;

/**
 * Registered plugins for file discovery (simulating DQ9).
 * Original: DQ9
 */
const registeredPlugins: unknown[] = [];

// ============================================
// Helper Functions
// ============================================

function log(message: string) {
  // In real implementation this might go to a logger
  // console.log(message);
}

/**
 * Execute a command.
 * Maps to J2 usage.
 */
async function execCommand(
  command: string,
  args: string[],
  options: { cwd?: string; timeout?: number; abortSignal?: AbortSignal } = {}
): Promise<{ code: number; stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: options.cwd,
      timeout: options.timeout,
      signal: options.abortSignal,
      encoding: 'utf8',
    });
    return { code: 0, stdout, stderr };
  } catch (error: any) {
    return {
      code: error.code || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
    };
  }
}

/**
 * Get current working directory.
 * Original: o1()
 */
function getCwd(): string {
  return process.cwd();
}

/**
 * Get effective working directory (project root logic usually).
 * Original: EQ() in chunks.136.mjs
 */
function getEffectiveWorkingDir(): string {
  // In the original code, this seems to determine the "root" of the project context.
  // For now, it defaults to process.cwd(), but in a full implementation,
  // it might check for a CLAUDE_PROJECT_ROOT env var or closest marker file.
  return getCwd();
}

/**
 * Check if running in bundled mode.
 * Original: LG()
 */
function isBundledMode(): boolean {
  return typeof (globalThis as any).Bun?.embeddedFiles !== 'undefined';
}

// ============================================
// Rust Module Loading
// ============================================

/**
 * Load Rust FileIndex module.
 * Original: QY7 in chunks.136.mjs:1521-1529
 */
async function getFileIndex(): Promise<FileIndex | null> {
  if (rustModuleFailed) return null;
  if (fileIndexInstance) return fileIndexInstance;

  if (isBundledMode()) {
    try {
      // In real code: await import('./file-index.node') or similar via require logic JR0/YR0
      // For reconstruction, we simulate failure if not found, or use a mock if we had one.
      // Since we don't have the binary, we fail gracefully to fallback.
      throw new Error('Rust module not found in reconstruction');
    } catch (error: any) {
      rustModuleFailed = true;
      log(
        `[FileIndex] Rust module unavailable, falling back to Fuse.js: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  } else {
    rustModuleFailed = true;
    log('[FileIndex] Not in bundled mode, using Fuse.js fallback');
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
export async function isGitRepo(cwd: string = getCwd()): Promise<boolean> {
  if (gitRepoCacheCwd === cwd && isGitRepoCache !== null) {
    return isGitRepoCache;
  }

  const result = await execCommand('git', ['rev-parse', '--git-dir'], {
    timeout: 2000,
    cwd,
  });

  isGitRepoCache = result.code === 0;
  gitRepoCacheCwd = cwd;
  return isGitRepoCache;
}

/**
 * Get git root path.
 * Original: cOA (simplified)
 */
async function getGitRootPath(cwd: string): Promise<string | null> {
  const result = await execCommand('git', ['rev-parse', '--show-toplevel'], {
    timeout: 2000,
    cwd,
  });
  if (result.code === 0) {
    return result.stdout.trim();
  }
  return null;
}

// ============================================
// File Discovery
// ============================================

/**
 * Normalize paths relative to effective working dir.
 * Original: GQ9
 */
function normalizePaths(files: string[], root: string, effectiveDir: string): string[] {
  if (effectiveDir === root) return files;
  return files.map((file) => {
    const absolute = path.join(root, file);
    return path.relative(effectiveDir, absolute);
  });
}

/**
 * Load ignore patterns from .ignore and .rgignore.
 * Original: ZQ9
 */
function loadIgnorePatterns(root: string, cwd: string): any {
  const key = `${root}:${cwd}`;
  if (ignorePatternsKey === key) return ignorePatterns;

  const patterns = ['.ignore', '.rgignore'];
  const dirs = [...new Set([root, cwd])];
  const ig = ignore();
  let found = false;

  for (const dir of dirs) {
    for (const patternFile of patterns) {
      const filePath = path.join(dir, patternFile);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          ig.add(content);
          found = true;
          log(`[FileIndex] loaded ignore patterns from ${filePath}`);
        } catch {
          // ignore error
        }
      }
    }
  }

  const result = found ? ig : null;
  ignorePatterns = result;
  ignorePatternsKey = key;
  return result;
}

/**
 * Merge untracked files into index.
 * Original: ZY7
 */
function mergeUntrackedFiles(files: string[]): void {
  if (files.length === 0) return;
  const dirs = extractDirectoryPrefixes(files);

  if (rustFileIndex && trackedFiles.length > 0) {
    const trackedDirs = extractDirectoryPrefixes(trackedFiles);
    const all = [...trackedFiles, ...trackedDirs, ...files, ...dirs];
    try {
      rustFileIndex.loadFromFileList(all);
      log(
        `[FileIndex] rebuilt Rust index with ${trackedFiles.length} tracked + ${files.length} untracked files`
      );
    } catch (e) {
      log(`[FileIndex] failed to rebuild Rust index: ${e}`);
    }
  } else {
    const all = [...files, ...dirs];
    const set = new Set(fallbackFileList);
    for (const file of all) {
      if (!set.has(file)) fallbackFileList.push(file);
    }
    log(`[FileIndex] merged ${files.length} untracked files into JS cache`);
  }
}

/**
 * Get files using git ls-files.
 * Original: YY7 in chunks.136.mjs
 */
export async function getFilesUsingGit(
  abortSignal: AbortSignal,
  respectGitignore: boolean
): Promise<string[] | null> {
  const startTime = Date.now();
  log('[FileIndex] getFilesUsingGit called');

  if (!(await isGitRepo())) {
    log('[FileIndex] not a git repo, returning null');
    return null;
  }

  try {
    const cwd = getCwd();
    const gitRoot = await getGitRootPath(cwd);
    if (!gitRoot) {
      log('[FileIndex] git rev-parse --show-toplevel failed, falling back to ripgrep');
      return null;
    }

    const gitStart = Date.now();
    const result = await execCommand('git', ['ls-files', '--recurse-submodules'], {
      timeout: 5000,
      abortSignal,
      cwd,
    });

    log(`[FileIndex] git ls-files (tracked) took ${Date.now() - gitStart}ms`);

    if (result.code !== 0) {
      log(
        `[FileIndex] git ls-files failed (code=${result.code}, stderr=${result.stderr}), falling back to ripgrep`
      );
      return null;
    }

    const files = result.stdout.trim().split('\n').filter(Boolean);
    const effectiveDir = getEffectiveWorkingDir();
    let normalized = normalizePaths(files, cwd, effectiveDir);

    const ignoreFilter = loadIgnorePatterns(gitRoot, cwd);
    if (ignoreFilter) {
      const before = normalized.length;
      normalized = ignoreFilter.filter(normalized);
      log(`[FileIndex] applied ignore patterns: ${before} -> ${normalized.length} files`);
    }

    trackedFiles = normalized;
    const duration = Date.now() - startTime;
    log(`[FileIndex] git ls-files: ${normalized.length} tracked files in ${duration}ms`);
    recordTelemetry('tengu_file_suggestions_git_ls_files', {
      file_count: normalized.length,
      tracked_count: normalized.length,
      untracked_count: 0,
      duration_ms: duration,
    });

    // Background fetch untracked files
    if (!untrackedFetchPromise) {
      untrackedFetchPromise = execCommand(
        'git',
        respectGitignore
          ? ['ls-files', '--others', '--exclude-standard']
          : ['ls-files', '--others'],
        {
          timeout: 10000,
          cwd,
        }
      )
        .then((res) => {
          if (res.code === 0) {
            const untracked = res.stdout.trim().split('\n').filter(Boolean);
            const effective = getEffectiveWorkingDir();
            let normUntracked = normalizePaths(untracked, cwd, effective);
            const ig = loadIgnorePatterns(gitRoot, cwd);
            if (ig && normUntracked.length > 0) {
              const count = normUntracked.length;
              normUntracked = ig.filter(normUntracked);
              log(
                `[FileIndex] applied ignore patterns to untracked: ${count} -> ${normUntracked.length} files`
              );
            }
            log(`[FileIndex] background untracked fetch: ${normUntracked.length} files`);
            mergeUntrackedFiles(normUntracked);
          }
        })
        .catch((e) => {
          log(`[FileIndex] background untracked fetch failed: ${e}`);
        })
        .finally(() => {
          untrackedFetchPromise = null;
        });
    }

    return normalized;
  } catch (error: any) {
    log(`[FileIndex] git ls-files error: ${error.message}`);
    return null;
  }
}

/**
 * Get files using ripgrep fallback.
 * Original: XY7 in chunks.136.mjs
 */
export async function getFilesUsingRipgrep(
  abortSignal: AbortSignal,
  respectGitignore: boolean
): Promise<string[]> {
  log(`[FileIndex] getProjectFiles called, respectGitignore=${respectGitignore}`);
  const gitFiles = await getFilesUsingGit(abortSignal, respectGitignore);
  if (gitFiles !== null) {
    log(`[FileIndex] using git ls-files result (${gitFiles.length} files)`);
    return gitFiles;
  }

  log('[FileIndex] git ls-files returned null, falling back to ripgrep');
  const start = Date.now();
  const args = ['--files', '--follow', '--hidden', '--glob', '!.git/'];
  if (!respectGitignore) {
    args.push('--no-ignore-vcs');
  }

  // Assuming `rg` is available in path for fallback
  const result = await execCommand('rg', args, {
    cwd: getCwd(),
    abortSignal,
  });

  const files = result.stdout.trim().split('\n').filter(Boolean);
  // Assuming rg outputs relative paths from cwd
  const effective = getEffectiveWorkingDir();
  const normalized = normalizePaths(files, getCwd(), effective);

  const duration = Date.now() - start;
  log(`[FileIndex] ripgrep: ${normalized.length} files in ${duration}ms`);
  recordTelemetry('tengu_file_suggestions_ripgrep', {
    file_count: normalized.length,
    duration_ms: duration,
  });

  return normalized;
}

/**
 * Extract directory prefixes from file paths.
 * Original: KR0 in chunks.136.mjs
 */
export function extractDirectoryPrefixes(files: string[]): string[] {
  const directories = new Set<string>();
  files.forEach((filePath) => {
    const rootDir = path.parse(filePath).root;
    let currentDir = path.dirname(filePath);
    while (currentDir !== '.' && currentDir !== rootDir && !directories.has(currentDir)) {
      directories.add(currentDir);
      currentDir = path.dirname(currentDir);
    }
  });
  return [...directories].map((dir) => dir + path.sep);
}

/**
 * Get workspace files.
 * Original: JY7 in chunks.136.mjs
 */
async function getWorkspaceFiles(cwd: string): Promise<string[]> {
  // Original logic:
  // return (await Promise.all(DQ9.map((B) => bd(B, A)))).flatMap((B) => B.map((G) => G.filePath))
  
  // DQ9 appears to be a list of registered plugins or providers.
  // In this reconstruction, we don't have the full plugin system initialized.
  // So we simulate it by iterating over `registeredPlugins` (which is empty).
  
  // If we had plugins, we would call their `getFiles` method.
  // Example mock implementation:
  const results = await Promise.all(
    registeredPlugins.map(async (plugin: any) => {
      try {
        if (typeof plugin.getWorkspaceFiles === 'function') {
          return await plugin.getWorkspaceFiles(cwd);
        }
        return [];
      } catch {
        return [];
      }
    })
  );

  return results.flat();
}

/**
 * Get project files entry point.
 * Original: XY7 (combined logic)
 */
export async function getProjectFiles(
  abortSignal: AbortSignal,
  respectGitignore: boolean
): Promise<string[]> {
  return getFilesUsingRipgrep(abortSignal, respectGitignore);
}

// ============================================
// Index Building
// ============================================

/**
 * Initialize file index.
 * Original: IY7 in chunks.136.mjs
 */
export async function initializeFileIndex(): Promise<FileIndexCache> {
  const ac = new AbortController();
  const timeout = setTimeout(() => {
    ac.abort();
  }, 10000);

  try {
    // Mock config retrieval
    const respectGitignore = true; // r3().respectGitignore
    const cwd = getCwd();

    const [projectFiles, workspaceFiles] = await Promise.all([
      getProjectFiles(ac.signal, respectGitignore),
      getWorkspaceFiles(cwd),
    ]);

    const allFiles = [...projectFiles, ...workspaceFiles];
    const dirs = extractDirectoryPrefixes(allFiles);
    const completeList = [...dirs, ...allFiles];
    
    let fileList = [];
    const rustIndex = await getFileIndex();

    if (rustIndex) {
      try {
        rustIndex.loadFromFileList(completeList);
      } catch (e: any) {
        log(
          `[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${e.message}`
        );
        recordTelemetry('tengu_file_index_rust_load_error', { error: e.message });
        fileList = completeList;
      }
    } else {
      fileList = completeList;
    }

    return {
      fileIndex: rustIndex,
      fileList,
    };
  } catch (error: any) {
    recordTelemetry('tengu_file_index_init_error', { error: error.message });
    return {
      fileIndex: null,
      fileList: [],
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Refresh index cache.
 * Original: XR0 in chunks.136.mjs
 */
export function refreshIndexCache(): void {
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
        recordTelemetry('tengu_file_index_refresh_error', { error: error.message });
        refreshPromise = null;
        return { fileIndex: null, fileList: [] };
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
export function createFileResult(filePath: string, score?: number): FileSuggestion {
  return {
    id: `file-${filePath}`,
    displayText: filePath,
    metadata: score !== undefined ? { score } : undefined,
  };
}

/**
 * List current directory files.
 * Original: KY7
 */
export async function listCurrentDirectory(): Promise<string[]> {
  const cwd = getCwd();
  try {
    const entries = fs.readdirSync(cwd, { withFileTypes: true });
    return entries.map((entry) => {
      const rel = path.relative(cwd, path.join(cwd, entry.name));
      return entry.isDirectory() ? rel + path.sep : rel;
    });
  } catch (e) {
    return [];
  }
}

/**
 * Perform search in file index.
 * Original: WY7 in chunks.136.mjs
 */
export async function performSearch(
  rustIndex: FileIndex | null,
  fallbackList: string[],
  query: string
): Promise<FileSuggestion[]> {
  if (rustIndex) {
    try {
      const results = rustIndex.search(query, MAX_SUGGESTIONS);
      return results.map((d) => createFileResult(d.path, d.score));
    } catch (e: any) {
      log(
        `[FileIndex] Rust search failed, falling back to Fuse.js: ${e.message}`
      );
      recordTelemetry('tengu_file_index_rust_search_error', { error: e.message });
    }
  }

  log('[FileIndex] Using Fuse.js fallback for search');
  const uniqueFiles = [...new Set(fallbackList)];

  if (!query) {
    const topLevelDirs = new Set<string>();
    for (const file of uniqueFiles) {
      const part = file.split(path.sep)[0];
      if (part) {
        topLevelDirs.add(part);
        if (topLevelDirs.size >= MAX_SUGGESTIONS) break;
      }
    }
    return [...topLevelDirs].sort().map((p) => createFileResult(p));
  }

  const documents = uniqueFiles.map((f) => ({
    path: f,
    filename: path.basename(f),
    testPenalty: f.includes('test') ? 1 : 0,
  }));

  // Optimization: filter by prefix if query looks like a path
  let searchDocs = documents;
  const lastSep = query.lastIndexOf(path.sep);
  if (lastSep > 2) {
    const prefix = query.substring(0, lastSep);
    searchDocs = documents.filter((d) =>
      d.path.substring(0, lastSep).startsWith(prefix)
    );
  }

  const fuse = new Fuse(searchDocs, {
    includeScore: true,
    threshold: 0.5,
    keys: [
      { name: 'path', weight: 1 },
      { name: 'filename', weight: 2 },
    ],
  });

  let results = fuse.search(query, { limit: MAX_SUGGESTIONS });

  // Custom sort
  results = results.sort((a, b) => {
    if (a.score === undefined || b.score === undefined) return 0;
    if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
    return a.item.testPenalty - b.item.testPenalty;
  });

  return results.map((r) => createFileResult(r.item.path, r.score));
}

/**
 * Mock config function (stub).
 */
function getMockConfig(): any {
  return {
    fileSuggestion: {
      type: 'default' // Change to 'command' to test custom command logic
    }
  };
}

/**
 * Execute custom file suggestion command.
 * Original: Qq0
 */
export async function executeFileSuggestionCommand(
  context: FileSuggestionContext
): Promise<string[]> {
  // Logic reconstructed from typical custom command patterns in Claude Code.
  // The command is expected to take the context as JSON on stdin and return JSON on stdout.
  const config = getMockConfig();
  const commandTemplate = config.fileSuggestion?.command;

  if (!commandTemplate) {
    return [];
  }

  try {
    // Basic substitution if commandTemplate has placeholders (simplified)
    const command = commandTemplate;
    
    // Create a child process
    const child = execFile('sh', ['-c', command], {
      timeout: 5000,
      encoding: 'utf8'
    });

    // Write context to stdin
    if (child.stdin) {
      child.stdin.write(JSON.stringify(context));
      child.stdin.end();
    }

    // Wait for output
    const stdout = await new Promise<string>((resolve, reject) => {
      let output = '';
      child.stdout?.on('data', (chunk) => { output += chunk; });
      child.on('close', (code) => {
        if (code === 0) resolve(output);
        else reject(new Error(`Command failed with code ${code}`));
      });
      child.on('error', reject);
    });

    // Parse result
    const result = JSON.parse(stdout);
    if (Array.isArray(result)) {
      return result.map(String);
    }
    return [];

  } catch (e: any) {
    recordTelemetry('tengu_file_suggestion_command_error', { error: e.message });
    return [];
  }
}

/**
 * Get file suggestions for autocomplete.
 * Original: IQ9 in chunks.136.mjs
 */
export async function getFileSuggestions(
  query: string,
  _cwd: string = getCwd(), // CWD unused in source logic as it uses global state
  forceRefresh = false
): Promise<FileSuggestion[]> {
  if (!query && !forceRefresh) return [];

  // Check for custom command configuration
  const config = getMockConfig();
  if (config.fileSuggestion?.type === 'command') {
    const context: FileSuggestionContext = {
      cwd: getCwd(),
      query,
      // session_id and other context would go here
    };
    try {
      const results = await executeFileSuggestionCommand(context);
      return results.slice(0, MAX_SUGGESTIONS).map((p) => createFileResult(p));
    } catch {
      return [];
    }
  }

  if (query === '' || query === '.' || query === './') {
    const list = await listCurrentDirectory();
    refreshIndexCache();
    return list.slice(0, MAX_SUGGESTIONS).map((p) => createFileResult(p));
  }

  try {
    const isStale = Date.now() - lastRefreshTimestamp > CACHE_TTL;

    if (!rustFileIndex && fallbackFileList.length === 0) {
      refreshIndexCache();
      if (refreshPromise) await refreshPromise;
    } else if (isStale) {
      refreshIndexCache();
    }

    let normalizedQuery = query;
    const dotSlash = '.' + path.sep;
    if (query.startsWith(dotSlash)) {
      normalizedQuery = query.substring(2);
    }
    // Handle tilde expansion if needed, source does Z = Y4(Z)
    // if (normalizedQuery.startsWith('~')) ...

    return await performSearch(rustFileIndex, fallbackFileList, normalizedQuery);
  } catch (e: any) {
    recordTelemetry('tengu_file_suggestions_error', { error: e.message });
    return [];
  }
}

/**
 * Clear all caches.
 * Original: JQ9
 */
export function clearFileIndexCache(): void {
  fileIndexInstance = null;
  rustModuleFailed = false;
  rustFileIndex = null;
  fallbackFileList = [];
  refreshPromise = null;
  lastRefreshTimestamp = 0;
  isGitRepoCache = null;
  gitRepoCacheCwd = null;
  untrackedFetchPromise = null;
  trackedFiles = [];
  ignorePatterns = null;
  ignorePatternsKey = null;
}
