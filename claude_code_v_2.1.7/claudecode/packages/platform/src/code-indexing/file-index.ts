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
import * as os from 'os';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import ignore from 'ignore';
import Fuse from 'fuse.js';

import { getConfigFilePath, getSettingsFilePath } from '../auth/constants.js';
import { logError, recordTelemetry } from '../telemetry/index.js';
import { getOriginalCwd, getProjectRoot, getSessionId, getSessionPath } from '@claudecode/shared';
import type {
  FileIndex,
  FileSuggestion,
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

// ============================================
// Workspace File Providers (DQ9)
// ============================================

export interface WorkspaceFileProviderResult {
  filePath: string;
}

export type WorkspaceFileProvider = (
  cwd: string
) => Promise<WorkspaceFileProviderResult[]>;

/** Registered workspace file providers (Original: DQ9) */
const workspaceFileProviders: WorkspaceFileProvider[] = [];

export function registerWorkspaceFileProvider(provider: WorkspaceFileProvider): void {
  workspaceFileProviders.push(provider);
}

// ============================================
// Settings Access (r3 / L1)
// ============================================

type FileSuggestionSettings = {
  type?: 'command' | 'default' | string;
  command?: string;
};

type CodeIndexingSettings = {
  respectGitignore?: boolean;
  fileSuggestion?: FileSuggestionSettings;
};

let cachedUserSettings: { mtimeMs: number; value: CodeIndexingSettings } | null = null;
let cachedConfigFile: { mtimeMs: number; value: CodeIndexingSettings } | null = null;

function readJsonIfExists<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (err) {
    logError(err instanceof Error ? err : new Error(String(err)));
    return null;
  }
}

function readJsonWithMtime<T>(filePath: string): { mtimeMs: number; value: T } | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    const parsed = readJsonIfExists<T>(filePath);
    if (!parsed) return null;
    return { mtimeMs: stat.mtimeMs, value: parsed };
  } catch (err) {
    logError(err instanceof Error ? err : new Error(String(err)));
    return null;
  }
}

/** Settings accessor (Original: r3) */
function getUserSettings(): CodeIndexingSettings {
  const settingsPath = getSettingsFilePath();
  const current = readJsonWithMtime<CodeIndexingSettings>(settingsPath);
  if (!current) {
    cachedUserSettings = null;
    return {};
  }
  if (cachedUserSettings?.mtimeMs === current.mtimeMs) {
    return cachedUserSettings.value;
  }
  cachedUserSettings = current;
  return current.value;
}

/** Main config accessor (Original: L1) */
function getConfigFileSettings(): CodeIndexingSettings {
  const configPath = getConfigFilePath();
  const current = readJsonWithMtime<CodeIndexingSettings>(configPath);
  if (!current) {
    cachedConfigFile = null;
    return {};
  }
  if (cachedConfigFile?.mtimeMs === current.mtimeMs) {
    return cachedConfigFile.value;
  }
  cachedConfigFile = current;
  return current.value;
}

function getRespectGitignoreSetting(): boolean {
  const user = getUserSettings();
  const cfg = getConfigFileSettings();
  return user.respectGitignore ?? cfg.respectGitignore ?? true;
}

function getFileSuggestionSettings(): FileSuggestionSettings | undefined {
  return getUserSettings().fileSuggestion;
}

function createFileSuggestionHookInput(query: string): Record<string, unknown> {
  const sessionId = getSessionId();
  return {
    // Source alignment: `jE()` in `source/chunks.120.mjs:1169-1177`
    // - permission_mode is optional; IQ9 calls `jE()` without args.
    session_id: sessionId,
    transcript_path: getSessionPath(sessionId, getProjectRoot()),
    cwd: getCwd(),
    permission_mode: undefined,
    query,
  };
}

// ============================================
// Hook Settings (jQ)
// ============================================

type HookSettings = {
  disableAllHooks?: boolean;
  fileSuggestion?: FileSuggestionSettings;
};

/**
 * Read global hook settings from runtime.
 *
 * Source alignment:
 * - `jQ()` returns either `settings.hooks` or `settings` (fallback)
 * - Used by `Qq0` in `source/chunks.120.mjs:2274-2295`
 */
function getGlobalHookSettings(): HookSettings {
  const settings = (globalThis as any).__claudeSettings;
  if (!settings || typeof settings !== 'object') return {};

  const hooks = (settings as any).hooks;
  if (hooks && typeof hooks === 'object') return hooks as HookSettings;

  return settings as HookSettings;
}

// ============================================
// Helper Functions
// ============================================

function log(message: string) {
  // Mirrors source `k(...)` debug logging: only emit in debug mode.
  if (process.env.DEBUG || process.env.CLAUDE_CODE_DEBUG) {
    console.error(message);
  }
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
  return getOriginalCwd();
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

  if (!isBundledMode()) {
    rustModuleFailed = true;
    log('[FileIndex] Not in bundled mode, using Fuse.js fallback');
    return null;
  }

  try {
    const require = createRequire(import.meta.url);
    const addonUrl = new URL('../../file-index.node', import.meta.url);
    const addonPath = fileURLToPath(addonUrl);

    let mod: any = null;
    try {
      mod = require(addonPath);
    } catch {
      // Fall back to Node resolution in case the addon is placed elsewhere.
      mod = require('../../file-index.node');
    }

    const FileIndexCtor = mod?.FileIndex;
    if (!FileIndexCtor) {
      throw new Error('file-index.node did not export FileIndex');
    }

    fileIndexInstance = new FileIndexCtor();
    return fileIndexInstance;
  } catch (error: any) {
    rustModuleFailed = true;
    log(
      `[FileIndex] Rust module unavailable, falling back to Fuse.js: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    logError(error instanceof Error ? error : new Error(String(error)));
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
    let normalized = normalizePaths(files, gitRoot, effectiveDir);

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
            let normUntracked = normalizePaths(untracked, gitRoot, effective);
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
  const args = ['--files', '--follow', '--hidden', '--glob', '!.git/'];
  if (!respectGitignore) args.push('--no-ignore-vcs');

  const result = await execCommand('rg', [...args, '.'], {
    cwd: getCwd(),
    abortSignal,
  });
  if (result.code !== 0) {
    log(`[FileIndex] ripgrep failed (code=${result.code}, stderr=${result.stderr})`);
    return [];
  }

  const cwd = getCwd();
  const effective = getEffectiveWorkingDir();
  const absoluteFiles = result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((p) => path.resolve(cwd, p));

  return absoluteFiles.map((p) => path.relative(effective, p));
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
  const results = await Promise.all(
    workspaceFileProviders.map(async (provider) => {
      try {
        return await provider(cwd);
      } catch (err) {
        logError(err instanceof Error ? err : new Error(String(err)));
        return [];
      }
    })
  );
  return results.flatMap((items) => items.map((it) => it.filePath));
}

/**
 * Get project files entry point.
 * Original: XY7 (combined logic)
 */
export async function getProjectFiles(
  abortSignal: AbortSignal,
  respectGitignore: boolean
): Promise<string[]> {
  // Original: XY7 (getProjectFiles) in chunks.136.mjs:1664-1678
  log(`[FileIndex] getProjectFiles called, respectGitignore=${respectGitignore}`);

  const gitFiles = await getFilesUsingGit(abortSignal, respectGitignore);
  if (gitFiles !== null) {
    log(`[FileIndex] using git ls-files result (${gitFiles.length} files)`);
    return gitFiles;
  }

  log('[FileIndex] git ls-files returned null, falling back to ripgrep');
  const start = Date.now();
  const files = await getFilesUsingRipgrep(abortSignal, respectGitignore);
  const duration = Date.now() - start;

  log(`[FileIndex] ripgrep: ${files.length} files in ${duration}ms`);
  recordTelemetry('tengu_file_suggestions_ripgrep', {
    file_count: files.length,
    duration_ms: duration,
  });

  return files;
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
    const respectGitignore = getRespectGitignoreSetting();
    const cwd = getCwd();

    const [projectFiles, workspaceFiles] = await Promise.all([
      getProjectFiles(ac.signal, respectGitignore),
      getWorkspaceFiles(cwd),
    ]);

    const allFiles = [...projectFiles, ...workspaceFiles];
    const dirs = extractDirectoryPrefixes(allFiles);
    const completeList = [...dirs, ...allFiles];
    
    let fileList: string[] = [];
    const rustIndex = await getFileIndex();

    if (rustIndex) {
      try {
        rustIndex.loadFromFileList(completeList);
      } catch (e: any) {
        log(
          `[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${e.message}`
        );
        logError(e instanceof Error ? e : new Error(String(e)));
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
    logError(error instanceof Error ? error : new Error(String(error)));
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
    return [...topLevelDirs].sort().map(createFileResult);
  }

  const documents = uniqueFiles.map((f) => ({
    path: f,
    filename: path.basename(f),
    testPenalty: f.includes('test') ? 1 : 0,
  }));

  // Optimization: filter by prefix if query looks like a path
  // @ts-ignore
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
  results = results.sort((a: any, b: any) => {
    if (a.score === undefined || b.score === undefined) return 0;
    if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
    // @ts-ignore
    return a.item.testPenalty - b.item.testPenalty;
  });

  return results.map((r: any) => r.item.path).slice(0, MAX_SUGGESTIONS).map(createFileResult);
}

/**
 * Execute custom file suggestion command.
 * Original: Qq0
 */
export async function executeFileSuggestionCommand(
  hookInput: Record<string, unknown>,
  signal?: AbortSignal,
  timeoutMs: number = 5000
): Promise<string[]> {
  // ============================================
  // executeFileSuggestionCommand - Run helper command for file suggestions
  // Location (source): chunks.120.mjs:2274-2295
  // ============================================
  // Source behavior (Qq0):
  // - If hooks are disabled, return [].
  // - Must be configured as { type: "command", command: "..." }.
  // - stdin: JSON input
  // - stdout: newline-separated suggestions

  const hookSettings = getGlobalHookSettings();
  if (hookSettings.disableAllHooks === true) return [];

  // Prefer hook settings; fall back to legacy code-indexing settings.
  const cfg = hookSettings.fileSuggestion ?? getFileSuggestionSettings();
  if (!cfg || cfg.type !== 'command' || !cfg.command) return [];

  const inputJson = JSON.stringify(hookInput);
  const command = cfg.command;

  return await new Promise<string[]>((resolve) => {
    let stdout = '';
    let stderr = '';
    let finished = false;

    const child = spawn(command, [], {
      cwd: getCwd(),
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...(process.env as Record<string, string>),
      },
    });

    const done = (result: string[] = []) => {
      if (finished) return;
      finished = true;
      resolve(result);
    };

    const kill = () => {
      try {
        child.kill('SIGTERM');
      } catch {
        // ignore
      }
    };

    // Timeout (default 5000ms, same as source Qq0 default)
    const timeoutId = setTimeout(() => {
      kill();
    }, timeoutMs);

    const abortHandler = () => {
      kill();
    };
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeoutId);
        return done([]);
      }
      signal.addEventListener('abort', abortHandler);
    }

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (err) => {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', abortHandler);
      logError(err instanceof Error ? err : new Error(String(err)));
      recordTelemetry('tengu_file_suggestion_command_error', {
        error: err instanceof Error ? err.message : String(err),
      });
      done([]);
    });

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', abortHandler);

      // Source: `if (aborted || status !== 0) return []`
      if (code !== 0) {
        log(`[FileIndex] fileSuggestion command failed (code=${code}, stderr=${stderr.trim()})`);
        done([]);
        return;
      }

      const results = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      done(results);
    });

    // Write hook input to stdin
    try {
      child.stdin?.write(inputJson);
      child.stdin?.end();
    } catch (err) {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', abortHandler);
      logError(err instanceof Error ? err : new Error(String(err)));
      done([]);
    }
  });
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
  const fileSuggestion = getFileSuggestionSettings();
  const hookFileSuggestion = getGlobalHookSettings().fileSuggestion;
  const shouldUseCommandMode =
    fileSuggestion?.type === 'command' || hookFileSuggestion?.type === 'command';
  if (shouldUseCommandMode) {
    try {
      const hookInput = createFileSuggestionHookInput(query);
      const results = await executeFileSuggestionCommand(hookInput);
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
    if (normalizedQuery.startsWith('~')) {
      normalizedQuery = path.join(os.homedir(), normalizedQuery.substring(1));
    }

    return await performSearch(rustFileIndex, fallbackFileList, normalizedQuery);
  } catch (e: any) {
    logError(e instanceof Error ? e : new Error(String(e)));
    recordTelemetry('tengu_file_suggestions_error', { error: e?.message ?? String(e) });
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
