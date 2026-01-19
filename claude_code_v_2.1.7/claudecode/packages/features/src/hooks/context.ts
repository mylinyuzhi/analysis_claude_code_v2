/**
 * @claudecode/features - Hook Context
 *
 * Hook environment context creation.
 * Reconstructed from chunks.120.mjs:1169-1177
 */

import type { HookEnvironmentContext } from './types.js';

import { getCwd, getProjectRoot, getSessionId, setSessionId, getSessionPath, getProjectDir } from '@claudecode/shared';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Get current session ID.
 * Original: q0 in chunks.1.mjs
 */
export function getCurrentSessionId(): string {
  return getSessionId();
}

/**
 * Set current session ID.
 */
export function setCurrentSessionId(sessionId: string): void {
  setSessionId(sessionId);
}

// ============================================
// Transcript Path (Placeholder)
// ============================================

/**
 * Get session transcript path.
 * Original: Bw in chunks.1.mjs
 */
export function getSessionTranscriptPath(sessionId: string): string {
  // Session log is persisted under the project cache directory.
  return getSessionPath(sessionId, getProjectRoot());
}

/**
 * Get agent transcript path.
 * Original: yb in chunks.1.mjs
 */
export function getAgentTranscriptPath(agentId: string): string {
  // Mirrors v2.1.x layout: <projectDir>/<sessionId>/agents/<agentId>/transcript.jsonl
  // Note: agent transcript directory helpers are defined elsewhere in the codebase.
  const projectDir = getProjectDir(getProjectRoot());
  const sessionId = getSessionId();
  return join(projectDir, sessionId, 'agents', agentId, 'transcript.jsonl');
}

// ============================================
// Working Directory (Placeholder)
// ============================================

/**
 * Get current working directory.
 * Original: o1 in chunks.1.mjs
 */
export function getCurrentWorkingDirectory(): string {
  return getCwd();
}

/**
 * Get project directory.
 * Original: EQ in chunks.1.mjs
 */
export function getProjectDirectory(): string {
  return getProjectRoot();
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
  // Mirrors chunks.85.mjs: SA2(PA2(), `hook-${idx}.sh`) where PA2() is a temp session-env dir.
  return join(tmpdir(), 'claude', 'session-env', getSessionId(), `hook-${hookIndex}.sh`);
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
