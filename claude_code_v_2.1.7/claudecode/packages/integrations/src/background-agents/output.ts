/**
 * @claudecode/integrations - Output File Management
 *
 * Manages output files for background tasks.
 * Reconstructed from chunks.86.mjs
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  symlinkSync,
  statSync,
} from 'fs';
import { appendFile } from 'fs/promises';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';
import { sanitizePath } from './transcript.js';

// ============================================
// Pending Writes Queue
// ============================================

/**
 * Map of pending write promises per task.
 * Ensures sequential writes for each task.
 * Original: X12 in chunks.86.mjs
 */
const pendingWrites = new Map<string, Promise<void>>();

// ============================================
// Path Utilities
// ============================================

/**
 * Get agent output directory.
 *
 * NOTE: Despite the legacy name, source stores output files under a temp root
 * (not under ~/.claude/projects).
 *
 * Original path composition:
 * - MM0() in chunks.148.mjs:2086-2089 → (CLAUDE_CODE_TMPDIR || /tmp) + '/claude/'
 * - V71() in chunks.148.mjs:2091-2093 → join(MM0(), sanitizePath(cwd))
 * - eSA() in chunks.86.mjs:95-97 → join(V71(), 'tasks')
 *
 * Effective path: <tmp>/claude/<sanitized-cwd>/tasks/
 */
export function getAgentOutputDir(cwd?: string): string {
  const workingDir = cwd ?? process.cwd();

  // Source: MM0() prefers CLAUDE_CODE_TMPDIR, defaults to '/tmp' on non-Windows.
  const baseTmp = process.env.CLAUDE_CODE_TMPDIR ?? (process.platform === 'win32' ? tmpdir() : '/tmp');

  // Source: MM0() then appends '/claude'. We keep it as a directory, no trailing separator needed.
  const claudeTmpRoot = join(baseTmp, 'claude');

  // Source: V71() uses sanitizePath(cwd) (gGA).
  const cwdSlug = sanitizePath(workingDir);

  // Source: eSA() uses 'tasks' directory name.
  return join(claudeTmpRoot, cwdSlug, 'tasks');
}

/**
 * Format output file path.
 * Original: aY in chunks.86.mjs:106-108
 *
 * Path: <tmp>/claude/<sanitized-cwd>/tasks/<taskId>.output
 */
export function formatOutputPath(taskId: string, cwd?: string): string {
  return join(getAgentOutputDir(cwd), `${taskId}${BACKGROUND_AGENT_CONSTANTS.OUTPUT_EXTENSION}`);
}

/**
 * Ensure output directory exists.
 * Original: JY0 in chunks.86.mjs
 */
export function ensureOutputDirExists(cwd?: string): void {
  const outputDir = getAgentOutputDir(cwd);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
}

// ============================================
// Output File Operations
// ============================================

/**
 * Create empty output file.
 * Original: Zr in chunks.86.mjs
 */
export function createEmptyOutputFile(taskId: string, cwd?: string): string {
  try {
    ensureOutputDirExists(cwd);
    const outputPath = formatOutputPath(taskId, cwd);
    if (!existsSync(outputPath)) {
      writeFileSync(outputPath, '', 'utf8');
    }
    return outputPath;
  } catch (error) {
    console.error('[Background] Failed to create empty output file:', error);
    return formatOutputPath(taskId, cwd);
  }
}

/**
 * Register output file as symlink to transcript.
 * Original: OKA in chunks.86.mjs:174-183
 *
 * Creates symlink: transcript -> output
 * This allows TaskOutput tool to read live progress via the output path.
 */
export function registerOutputFile(taskId: string, transcriptPath: string, cwd?: string): string {
  try {
    ensureOutputDirExists(cwd);
    const outputPath = formatOutputPath(taskId, cwd);

    // Delete existing file/symlink if present
    if (existsSync(outputPath)) {
      unlinkSync(outputPath);
    }

    // Create symlink: transcript -> output
    symlinkSync(transcriptPath, outputPath);
    return outputPath;
  } catch (error) {
    console.error('[Background] Failed to register output file:', error);
    // Fallback to creating empty file
    return createEmptyOutputFile(taskId, cwd);
  }
}

/**
 * Append content to output file.
 * Original: g9A in chunks.86.mjs:110-131
 *
 * Writes are chained via Promises to ensure sequential order
 * even for concurrent tool executions.
 */
export function appendToOutputFile(taskId: string, content: string, cwd?: string): void {
  try {
    ensureOutputDirExists(cwd);
    const outputPath = formatOutputPath(taskId, cwd);
    const dir = dirname(outputPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error('[Background] Failed to ensure output dir:', error);
    return;
  }

  const outputPath = formatOutputPath(taskId, cwd);

  // Chain writes to ensure sequential order
  const writePromise = (pendingWrites.get(taskId) ?? Promise.resolve()).then(async () => {
    try {
      await appendFile(outputPath, content, 'utf8');
    } catch (error) {
      console.error('[Background] Failed to append to output file:', error);
    }
  });

  pendingWrites.set(taskId, writePromise);
}

/**
 * Read task output content.
 * Original: K71 in chunks.86.mjs:157-165
 */
export function getTaskOutputContent(taskId: string, cwd?: string): string {
  try {
    const outputPath = formatOutputPath(taskId, cwd);
    if (!existsSync(outputPath)) return '';
    return readFileSync(outputPath, 'utf8');
  } catch (error) {
    console.error('[Background] Failed to read output file:', error);
    return '';
  }
}

/**
 * Read task output content.
 * Alias for getTaskOutputContent for external package compatibility.
 */
export const readTaskOutput = getTaskOutputContent;

/**
 * Write to task output file (full write).
 */
export function writeTaskOutput(taskId: string, content: string, cwd?: string): void {
  try {
    ensureOutputDirExists(cwd);
    const outputPath = formatOutputPath(taskId, cwd);
    writeFileSync(outputPath, content, 'utf8');
  } catch (error) {
    console.error('[Background] Failed to write output file:', error);
  }
}

/**
 * Read delta from output file since last offset.
 * Original: XY0 in chunks.86.mjs:133-155
 */
export function readTaskOutputDelta(taskId: string, offset: number, cwd?: string): { content: string; newOffset: number } {
  try {
    const outputPath = formatOutputPath(taskId, cwd);
    if (!existsSync(outputPath)) {
      return { content: '', newOffset: offset };
    }

    const size = statSync(outputPath).size;
    if (size <= offset) {
      return { content: '', newOffset: offset };
    }

    // Since we are reading as utf8 string, slice might be tricky if offset is not at character boundary,
    // but the original code uses I12(B, "utf8").slice(Q).
    const content = readFileSync(outputPath, 'utf8').slice(offset);
    return { content, newOffset: size };
  } catch (error) {
    console.error('[Background] Failed to read output delta:', error);
    return { content: '', newOffset: offset };
  }
}

/**
 * Clear pending write for task.
 */
export function clearPendingWrite(taskId: string): void {
  pendingWrites.delete(taskId);
}

/**
 * Wait for all pending writes for a task.
 */
export async function waitForPendingWrites(taskId: string): Promise<void> {
  const pending = pendingWrites.get(taskId);
  if (pending) {
    await pending;
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
