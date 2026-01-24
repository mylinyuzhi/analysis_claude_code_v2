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
import { getSessionId } from '@claudecode/shared';
import type { TranscriptEntry, TranscriptMetadata } from './types.js';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';

// ============================================
// Path Utilities
// ============================================

/**
 * Sanitize path for safe filesystem names.
 * Original: gGA (sanitizePath)
 */
export function sanitizePath(pathStr: string): string {
  return pathStr.replace(/[^a-zA-Z0-9]/g, '-');
}

/**
 * Get Claude configuration directory.
 * Original: wp()
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
 * Path: ~/.claude/projects/<sanitized-cwd>/<sessionId>/subagents/agent-<agentId>.jsonl
 */
export function getAgentTranscriptPath(agentId: string, cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const projectDir = getProjectDir(workingDir);
  const sessionId = getSessionId();
  return join(projectDir, sessionId, BACKGROUND_AGENT_CONSTANTS.SUBAGENTS_DIR, `agent-${agentId}.jsonl`);
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
  const entries = readTranscript(transcriptPath);
  if (entries.length === 0) return null;

  const firstEntry = entries[0];
  if (firstEntry && firstEntry.type === 'system' && (firstEntry.content as any)?.metadata) {
    return (firstEntry.content as any).metadata as TranscriptMetadata;
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

  const firstLine = lines[0];
  if (!firstLine) return;

  try {
    const firstEntry = JSON.parse(firstLine);
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
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
