/**
 * @claudecode/integrations - Output File Management
 *
 * Manages output files for background tasks.
 * Reconstructed from chunks.86.mjs
 *
 * Key symbols:
 * - aY → formatOutputPath
 * - g9A → appendToOutputFile
 * - K71 → getTaskOutputContent
 * - OKA → registerOutputFile
 * - Zr → createEmptyOutputFile
 * - JY0 → ensureOutputDirExists
 * - eSA → getAgentOutputDir
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  unlinkSync,
  symlinkSync,
} from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
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
 * Get Claude configuration directory.
 */
function getClaudeDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Get project directory for working directory.
 */
function getProjectDir(cwd: string): string {
  const claudeDir = getClaudeDir();
  const sanitized = sanitizePath(cwd);
  return join(claudeDir, 'projects', sanitized);
}

/**
 * Get agent output directory.
 * Original: eSA in chunks.86.mjs
 *
 * Path: ~/.claude/projects/<sanitized-cwd>/agents/
 */
export function getAgentOutputDir(cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const projectDir = getProjectDir(workingDir);
  return join(projectDir, 'agents');
}

/**
 * Format output file path.
 * Original: aY in chunks.86.mjs:106-108
 *
 * Path: ~/.claude/projects/<sanitized-cwd>/agents/<taskId>.output
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
    const dir = dirname(outputPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, '', 'utf-8');
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
 * Creates symlink: transcript → output
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

    // Create symlink: transcript → output
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
      appendFileSync(outputPath, content, 'utf-8');
    } catch (error) {
      console.error('[Background] Failed to append to output file:', error);
    }
  });

  pendingWrites.set(taskId, writePromise);
}

/**
 * Get task output content.
 * Original: K71 in chunks.86.mjs:157-165
 */
export function getTaskOutputContent(taskId: string, cwd?: string): string {
  try {
    const outputPath = formatOutputPath(taskId, cwd);
    if (!existsSync(outputPath)) return '';
    return readFileSync(outputPath, 'utf-8');
  } catch (error) {
    console.error('[Background] Failed to read output file:', error);
    return '';
  }
}

/**
 * Write content to output file (overwrite).
 */
export function writeOutputFile(taskId: string, content: string, cwd?: string): void {
  try {
    ensureOutputDirExists(cwd);
    const outputPath = formatOutputPath(taskId, cwd);
    writeFileSync(outputPath, content, 'utf-8');
  } catch (error) {
    console.error('[Background] Failed to write output file:', error);
  }
}

/**
 * Check if output file exists.
 */
export function outputFileExists(taskId: string, cwd?: string): boolean {
  const outputPath = formatOutputPath(taskId, cwd);
  return existsSync(outputPath);
}

/**
 * Delete output file.
 */
export function deleteOutputFile(taskId: string, cwd?: string): boolean {
  try {
    const outputPath = formatOutputPath(taskId, cwd);
    if (existsSync(outputPath)) {
      unlinkSync(outputPath);
      return true;
    }
    return false;
  } catch {
    return false;
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

export {
  getAgentOutputDir,
  formatOutputPath,
  ensureOutputDirExists,
  createEmptyOutputFile,
  registerOutputFile,
  appendToOutputFile,
  getTaskOutputContent,
  writeOutputFile,
  outputFileExists,
  deleteOutputFile,
  clearPendingWrite,
  waitForPendingWrites,
};
