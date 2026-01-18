/**
 * @claudecode/features - Plan File Management
 *
 * Plan file creation, reading, and path management.
 * Reconstructed from chunks.86.mjs:48-83
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateSlug } from './slug-generator.js';
import { PLAN_MODE_CONSTANTS } from './types.js';

// ============================================
// Logging Placeholder
// ============================================

function logError(error: Error): void {
  console.error(`[PlanMode] Error: ${error.message}`);
}

// ============================================
// Config Directory (Placeholder)
// ============================================

/**
 * Get Claude config directory.
 * Original: zQ in chunks.1.mjs
 */
function getClaudeConfigDir(): string {
  const homeDir = process.env.HOME || '~';
  return path.join(homeDir, '.claude');
}

// ============================================
// Session ID (Placeholder)
// ============================================

let currentSessionId: string | null = null;

/**
 * Get current session ID.
 */
export function getSessionId(): string {
  return currentSessionId || `session_${Date.now()}`;
}

/**
 * Set current session ID.
 */
export function setSessionId(sessionId: string): void {
  currentSessionId = sessionId;
}

// ============================================
// Plan Slug Cache
// ============================================

const planSlugCache = new Map<string, string>();

/**
 * Get plan slug cache.
 * Original: Z7A in chunks.86.mjs
 */
export function getPlanSlugCache(): Map<string, string> {
  return planSlugCache;
}

/**
 * Cache plan slug for session.
 * Original: ZY0 in chunks.86.mjs
 */
export function cachePlanSlug(sessionId: string, slug: string): void {
  planSlugCache.set(sessionId, slug);
}

/**
 * Clear plan slug cache for session.
 * Original: J12 in chunks.86.mjs:43-46
 */
export function clearPlanSlugCacheForSession(sessionId: string): void {
  planSlugCache.delete(sessionId);
}

// ============================================
// Plan Directory
// ============================================

/**
 * Get or create plans directory.
 * Original: NN in chunks.86.mjs:48-56
 *
 * @returns Path to ~/.claude/plans/
 */
export function getPlanDir(): string {
  const planDir = path.join(getClaudeConfigDir(), 'plans');

  if (!fs.existsSync(planDir)) {
    try {
      fs.mkdirSync(planDir, { recursive: true });
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  return planDir;
}

// ============================================
// Unique Plan Slug
// ============================================

/**
 * Get or create unique slug for session.
 * Original: GY0 in chunks.86.mjs:23-37
 *
 * @param sessionId - Optional session ID
 * @returns Unique slug like "bright-exploring-aurora"
 */
export function getUniquePlanSlug(sessionId?: string): string {
  const currentSession = sessionId ?? getSessionId();
  const cache = getPlanSlugCache();
  let slug = cache.get(currentSession);

  if (!slug) {
    const planDir = getPlanDir();

    // Try up to MAX_SLUG_RETRIES times to find unused slug
    for (let attempt = 0; attempt < PLAN_MODE_CONSTANTS.MAX_SLUG_RETRIES; attempt++) {
      slug = generateSlug();
      const planPath = path.join(planDir, `${slug}.md`);
      if (!fs.existsSync(planPath)) {
        break;
      }
    }

    if (slug) {
      cache.set(currentSession, slug);
    }
  }

  return slug || generateSlug();
}

// ============================================
// Plan File Path
// ============================================

/**
 * Get plan file path for session/agent.
 * Original: dC in chunks.86.mjs:58-62
 *
 * @param agentId - Optional agent ID for subagent plans
 * @returns Path to plan file
 */
export function getPlanFilePath(agentId?: string): string {
  const planSlug = getUniquePlanSlug(getSessionId());

  if (!agentId) {
    // Main session: ~/.claude/plans/bright-exploring-aurora.md
    return path.join(getPlanDir(), `${planSlug}.md`);
  }

  // Subagent: ~/.claude/plans/bright-exploring-aurora-agent-{agentId}.md
  return path.join(getPlanDir(), `${planSlug}-agent-${agentId}.md`);
}

// ============================================
// Read Plan File
// ============================================

/**
 * Read plan content from file.
 * Original: AK in chunks.86.mjs:64-74
 *
 * @param agentId - Optional agent ID
 * @returns Plan content or null if not found
 */
export function readPlanFile(agentId?: string): string | null {
  const planPath = getPlanFilePath(agentId);

  if (!fs.existsSync(planPath)) {
    return null;
  }

  try {
    return fs.readFileSync(planPath, { encoding: 'utf-8' });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

// ============================================
// Check Plan Exists
// ============================================

/**
 * Check if plan file exists for session.
 * Original: W71 in chunks.86.mjs:76-83
 *
 * @param conversation - Conversation with messages
 * @param sessionId - Optional session ID
 * @returns True if plan file exists
 */
export function checkPlanExists(
  conversation: { messages: Array<{ slug?: string }> },
  sessionId?: string
): boolean {
  // Find slug from conversation messages
  const slug = conversation.messages.find((msg) => msg.slug)?.slug;
  if (!slug) return false;

  const currentSession = sessionId ?? getSessionId();
  cachePlanSlug(currentSession, slug);

  const planPath = path.join(getPlanDir(), `${slug}.md`);
  return fs.existsSync(planPath);
}

/**
 * Check if plan file exists at path.
 */
export function planFileExists(agentId?: string): boolean {
  const planPath = getPlanFilePath(agentId);
  return fs.existsSync(planPath);
}

// ============================================
// Write Plan File
// ============================================

/**
 * Write plan content to file.
 *
 * @param content - Plan content
 * @param agentId - Optional agent ID
 */
export function writePlanFile(content: string, agentId?: string): void {
  const planPath = getPlanFilePath(agentId);

  try {
    // Ensure directory exists
    getPlanDir();

    fs.writeFileSync(planPath, content, { encoding: 'utf-8' });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Get shortened path for display.
 * Original: k6 in chunks.119.mjs
 */
export function shortenPath(filePath: string): string {
  const homeDir = process.env.HOME || '~';
  if (filePath.startsWith(homeDir)) {
    return filePath.replace(homeDir, '~');
  }
  return filePath;
}

// ============================================
// Export
// ============================================

export {
  getSessionId,
  setSessionId,
  getPlanSlugCache,
  cachePlanSlug,
  clearPlanSlugCacheForSession,
  getPlanDir,
  getUniquePlanSlug,
  getPlanFilePath,
  readPlanFile,
  checkPlanExists,
  planFileExists,
  writePlanFile,
  shortenPath,
};
