/**
 * @claudecode/integrations - Transcript Utilities
 *
 * Utilities for agent transcript file management.
 * Reconstructed from chunks.148.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { homedir } from 'os';
import type { TranscriptEntry, TranscriptMetadata, BackgroundTaskStatus } from './types.js';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';

// ============================================
// Path Utilities
// ============================================

/**
 * Sanitize path for safe filesystem names.
 * Original: fb3 (sanitizePath)
 */
export function sanitizePath(pathStr: string): string {
  return pathStr.replace(/[^a-zA-Z0-9]/g, '-');
}

/**
 * Get Claude configuration directory.
 */
export function getClaudeDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Get project directory for working directory.
 * Original: QV (getProjectDirForCwd)
 */
export function getProjectDir(cwd: string): string {
  const claudeDir = getClaudeDir();
  const sanitized = sanitizePath(cwd);
  return join(claudeDir, 'projects', sanitized);
}

/**
 * Get agent transcript path.
 * Original: yb (getAgentTranscriptPath) in chunks.148.mjs
 *
 * Path: ~/.claude/projects/<sanitized-cwd>/subagents/agent-<agentId>.jsonl
 */
export function getAgentTranscriptPath(agentId: string, cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const projectDir = getProjectDir(workingDir);
  return join(projectDir, BACKGROUND_AGENT_CONSTANTS.SUBAGENTS_DIR, `agent-${agentId}.jsonl`);
}

/**
 * Get task output file path.
 */
export function getTaskOutputPath(taskId: string, cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const projectDir = getProjectDir(workingDir);
  return join(projectDir, BACKGROUND_AGENT_CONSTANTS.TASKS_DIR, `${taskId}${BACKGROUND_AGENT_CONSTANTS.OUTPUT_EXTENSION}`);
}

/**
 * Ensure directory exists.
 */
export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

// ============================================
// Transcript Reading
// ============================================

/**
 * Read transcript file.
 */
export function readTranscript(transcriptPath: string): TranscriptEntry[] {
  if (!existsSync(transcriptPath)) {
    return [];
  }

  const content = readFileSync(transcriptPath, 'utf-8');
  const entries: TranscriptEntry[] = [];

  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    try {
      entries.push(JSON.parse(line));
    } catch {
      // Skip invalid lines
    }
  }

  return entries;
}

/**
 * Read transcript file as async stream.
 * Useful for large transcripts.
 */
export async function* readTranscriptStream(transcriptPath: string): AsyncGenerator<TranscriptEntry> {
  if (!existsSync(transcriptPath)) {
    return;
  }

  const stream = createReadStream(transcriptPath, { encoding: 'utf-8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      yield JSON.parse(line);
    } catch {
      // Skip invalid lines
    }
  }
}

/**
 * Read transcript metadata from first line.
 */
export function readTranscriptMetadata(transcriptPath: string): TranscriptMetadata | null {
  if (!existsSync(transcriptPath)) {
    return null;
  }

  const content = readFileSync(transcriptPath, 'utf-8');
  const firstLine = content.split('\n')[0];

  if (!firstLine) return null;

  try {
    const entry = JSON.parse(firstLine);
    if (entry.type === 'system' && entry.metadata) {
      return entry.metadata as TranscriptMetadata;
    }
  } catch {
    // Invalid metadata
  }

  return null;
}

// ============================================
// Transcript Writing
// ============================================

/**
 * Initialize transcript file with metadata.
 */
export function initTranscript(
  transcriptPath: string,
  metadata: TranscriptMetadata
): void {
  ensureDir(dirname(transcriptPath));

  const entry: TranscriptEntry = {
    type: 'system',
    content: { metadata },
    timestamp: Date.now(),
  };

  writeFileSync(transcriptPath, JSON.stringify(entry) + '\n', 'utf-8');
}

/**
 * Append entry to transcript.
 */
export function appendTranscriptEntry(
  transcriptPath: string,
  entry: Omit<TranscriptEntry, 'timestamp'>
): void {
  const fullEntry: TranscriptEntry = {
    ...entry,
    timestamp: Date.now(),
  };

  appendFileSync(transcriptPath, JSON.stringify(fullEntry) + '\n', 'utf-8');
}

/**
 * Update transcript metadata (rewrites first line).
 */
export function updateTranscriptMetadata(
  transcriptPath: string,
  updates: Partial<TranscriptMetadata>
): void {
  if (!existsSync(transcriptPath)) return;

  const content = readFileSync(transcriptPath, 'utf-8');
  const lines = content.split('\n');

  if (lines.length === 0) return;

  try {
    const firstEntry = JSON.parse(lines[0]);
    if (firstEntry.type === 'system' && firstEntry.content?.metadata) {
      firstEntry.content.metadata = {
        ...firstEntry.content.metadata,
        ...updates,
      };
      lines[0] = JSON.stringify(firstEntry);
      writeFileSync(transcriptPath, lines.join('\n'), 'utf-8');
    }
  } catch {
    // Failed to update
  }
}

// ============================================
// Task Output
// ============================================

/**
 * Read task output from file or transcript.
 */
export function readTaskOutput(taskId: string, cwd?: string): string | null {
  // Try output file first
  const outputPath = getTaskOutputPath(taskId, cwd);
  if (existsSync(outputPath)) {
    return readFileSync(outputPath, 'utf-8');
  }

  // Try transcript (for agent tasks)
  const transcriptPath = getAgentTranscriptPath(taskId, cwd);
  if (existsSync(transcriptPath)) {
    const entries = readTranscript(transcriptPath);
    // Get last assistant message
    const assistantMessages = entries.filter((e) => e.type === 'assistant');
    if (assistantMessages.length > 0) {
      const last = assistantMessages[assistantMessages.length - 1];
      return typeof last.content === 'string' ? last.content : JSON.stringify(last.content);
    }
  }

  return null;
}

/**
 * Write task output to file.
 */
export function writeTaskOutput(taskId: string, output: string, cwd?: string): void {
  const outputPath = getTaskOutputPath(taskId, cwd);
  ensureDir(dirname(outputPath));
  writeFileSync(outputPath, output, 'utf-8');
}

// ============================================
// Export
// ============================================

export {
  sanitizePath,
  getClaudeDir,
  getProjectDir,
  getAgentTranscriptPath,
  getTaskOutputPath,
  ensureDir,
  readTranscript,
  readTranscriptStream,
  readTranscriptMetadata,
  initTranscript,
  appendTranscriptEntry,
  updateTranscriptMetadata,
  readTaskOutput,
  writeTaskOutput,
};
