/**
 * @claudecode/features - Hook Context
 *
 * Hook environment context creation.
 * Reconstructed from chunks.120.mjs:1169-1177
 */

import type { HookEnvironmentContext } from './types.js';

// ============================================
// Session ID Management (Placeholder)
// ============================================

let currentSessionId: string | null = null;

/**
 * Get current session ID.
 * Original: q0 in chunks.1.mjs
 */
export function getCurrentSessionId(): string {
  return currentSessionId || `session_${Date.now()}`;
}

/**
 * Set current session ID.
 */
export function setCurrentSessionId(sessionId: string): void {
  currentSessionId = sessionId;
}

// ============================================
// Transcript Path (Placeholder)
// ============================================

/**
 * Get session transcript path.
 * Original: Bw in chunks.1.mjs
 */
export function getSessionTranscriptPath(sessionId: string): string {
  // Placeholder - would return actual transcript path
  const homeDir = process.env.HOME || '~';
  return `${homeDir}/.claude/transcripts/${sessionId}.jsonl`;
}

/**
 * Get agent transcript path.
 * Original: yb in chunks.1.mjs
 */
export function getAgentTranscriptPath(agentId: string): string {
  // Placeholder - would return actual agent transcript path
  const homeDir = process.env.HOME || '~';
  return `${homeDir}/.claude/agents/${agentId}/transcript.jsonl`;
}

// ============================================
// Working Directory (Placeholder)
// ============================================

/**
 * Get current working directory.
 * Original: o1 in chunks.1.mjs
 */
export function getCurrentWorkingDirectory(): string {
  return process.cwd();
}

/**
 * Get project directory.
 * Original: EQ in chunks.1.mjs
 */
export function getProjectDirectory(): string {
  // Placeholder - would find git root or similar
  return process.cwd();
}

// ============================================
// Context Creation
// ============================================

/**
 * Create hook environment context.
 * Original: jE in chunks.120.mjs:1169-1177
 *
 * @param permissionMode - Current permission mode
 * @param sessionId - Optional session ID override
 * @returns Hook environment context
 */
export function createHookEnvironmentContext(
  permissionMode?: string,
  sessionId?: string
): HookEnvironmentContext {
  const effectiveSessionId = sessionId ?? getCurrentSessionId();

  return {
    session_id: effectiveSessionId,
    transcript_path: getSessionTranscriptPath(effectiveSessionId),
    cwd: getCurrentWorkingDirectory(),
    permission_mode: permissionMode,
  };
}

// ============================================
// Environment File Path
// ============================================

/**
 * Get environment file path for SessionStart hooks.
 * Original: SA2 in chunks.120.mjs
 */
export function getEnvFilePath(hookIndex: number): string {
  const homeDir = process.env.HOME || '~';
  return `${homeDir}/.claude/.env.hook.${hookIndex}`;
}

// ============================================
// Export
// ============================================

export {
  getCurrentSessionId,
  setCurrentSessionId,
  getSessionTranscriptPath,
  getAgentTranscriptPath,
  getCurrentWorkingDirectory,
  getProjectDirectory,
  createHookEnvironmentContext,
  getEnvFilePath,
};
