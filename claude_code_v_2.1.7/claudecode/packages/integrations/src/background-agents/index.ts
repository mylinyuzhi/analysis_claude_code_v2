/**
 * @claudecode/integrations - Background Agents Module
 *
 * Background task management for bash commands and sub-agents.
 *
 * Key features:
 * - Run bash commands asynchronously
 * - Run sub-agents in background
 * - Unified TaskOutput tool for result retrieval
 * - Transcript persistence for agent tasks
 *
 * Storage:
 * - Bash tasks: In-memory (real-time streaming, lost on exit)
 * - Agent tasks: File-based (JSONL transcripts, persistent)
 *
 * Reconstructed from chunks.91.mjs, chunks.121.mjs, chunks.136.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Registry
// ============================================

export {
  BackgroundTaskRegistry,
  generateTaskId,
  generateBashTaskId,
  generateAgentTaskId,
  generateRemoteAgentTaskId,
  isBashTaskId,
  isRemoteAgentTaskId,
  getTaskRegistry,
  resetTaskRegistry,
} from './registry.js';

// ============================================
// Transcript
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
} from './transcript.js';

// ============================================
// Task Factories
// ============================================

import type { BackgroundBashTask, BackgroundAgentTask } from './types.js';
import { generateBashTaskId, generateAgentTaskId, generateRemoteAgentTaskId } from './registry.js';
import { getAgentTranscriptPath } from './transcript.js';

/**
 * Create a background bash task.
 */
export function createBashTask(command: string, pid?: number): BackgroundBashTask {
  return {
    id: generateBashTaskId(),
    type: 'local_bash',
    status: 'running',
    startTime: Date.now(),
    command,
    stdout: '',
    stderr: '',
    pid,
  };
}

/**
 * Create a background agent task.
 */
export function createAgentTask(
  description: string,
  options?: {
    prompt?: string;
    subagentType?: string;
    model?: string;
    cwd?: string;
  }
): BackgroundAgentTask {
  const id = generateAgentTaskId();
  return {
    id,
    type: 'local_agent',
    status: 'running',
    startTime: Date.now(),
    description,
    transcriptPath: getAgentTranscriptPath(id, options?.cwd),
    prompt: options?.prompt,
    subagentType: options?.subagentType,
    model: options?.model,
  };
}

/**
 * Create a remote agent task.
 */
export function createRemoteAgentTask(
  description: string,
  options?: {
    prompt?: string;
    cwd?: string;
  }
): BackgroundAgentTask {
  const id = generateRemoteAgentTaskId();
  return {
    id,
    type: 'remote_agent',
    status: 'running',
    startTime: Date.now(),
    description,
    transcriptPath: getAgentTranscriptPath(id, options?.cwd),
    prompt: options?.prompt,
  };
}
