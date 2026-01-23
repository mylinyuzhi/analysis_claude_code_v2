/**
 * @claudecode/features - Plan File Management
 *
 * Plan file creation, reading, and path management.
 * Reconstructed from chunks.86.mjs:48-83, chunks.1.mjs:2312-2318
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateSlug } from './slug-generator.js';
import { PLAN_MODE_CONSTANTS } from './types.js';

// ============================================
// Internal Utilities
// ============================================

/**
 * Log error to console.
 * Original: e in chunks.86.mjs
 */
function logError(error: Error): void {
  console.error(`[PlanMode] Error: ${error.message}`);
}

/**
 * Get Claude config directory (~/.claude).
 * Original: zQ in chunks.1.mjs
 */
function getClaudeConfigDir(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, '.claude');
}

// ============================================
// Session Management
// ============================================

let currentSessionId: string | null = null;

/**
 * Get current session ID.
 * Original: q0 in chunks.1.mjs:2312-2314
 */
export function getSessionId(): string {
  if (!currentSessionId) {
    // Fallback if not set
    currentSessionId = `session_${Date.now()}`;
  }
  return currentSessionId;
}

/**
 * Set current session ID.
 * Original: pw in chunks.1.mjs:2316-2318
 */
export function setSessionId(sessionId: string): void {
  currentSessionId = sessionId;
}

// ============================================
// Plan Slug Cache
// ============================================

/**
 * Get plan slug cache Map.
 * Original: Z7A in chunks.1.mjs:2778-2780
 */
const planSlugCache = new Map<string, string>();

export function getPlanSlugCache(): Map<string, string> {
  return planSlugCache;
}

/**
 * Cache plan slug for session.
 * Original: ZY0 in chunks.86.mjs:39-41
 */
export function cachePlanSlug(sessionId: string, slug: string): void {
  getPlanSlugCache().set(sessionId, slug);
}

/**
 * Clear plan slug cache for session.
 * Original: J12 in chunks.86.mjs:43-46
 */
export function clearPlanSlugCacheForSession(sessionId: string): void {
  getPlanSlugCache().delete(sessionId ?? getSessionId());
}

// ============================================
// Plan Directory
// ============================================

/**
 * Get or create plans directory (~/.claude/plans).
 * Original: NN in chunks.86.mjs:48-56
 *
 * @returns Path to plans directory
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
 * Get or create unique slug for session with retry logic.
 * Original: GY0 in chunks.86.mjs:23-37
 *
 * @param sessionId - Optional session ID
 * @returns Unique slug like "bright-exploring-aurora"
 */
export function getUniquePlanSlug(sessionId?: string): string {
  const targetSession = sessionId ?? getSessionId();
  const cache = getPlanSlugCache();
  let slug = cache.get(targetSession);

  if (!slug) {
    const planDir = getPlanDir();
    const maxRetries = PLAN_MODE_CONSTANTS.MAX_SLUG_RETRIES;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      slug = generateSlug();
      const planPath = path.join(planDir, `${slug}.md`);
      if (!fs.existsSync(planPath)) {
        break; // Found unique name
      }
    }

    if (slug) {
      cache.set(targetSession, slug);
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
  const planDir = getPlanDir();

  if (!agentId) {
    // Main session: ~/.claude/plans/{slug}.md
    return path.join(planDir, `${planSlug}.md`);
  }

  // Subagent: ~/.claude/plans/{slug}-agent-{agentId}.md
  return path.join(planDir, `${planSlug}-agent-${agentId}.md`);
}

// ============================================
// Read/Write/Exists
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

/**
 * Check if plan file exists for session based on message slugs.
 * Original: W71 in chunks.86.mjs:76-83
 *
 * @param conversation - Conversation history
 * @param sessionId - Optional session ID
 * @returns True if plan file exists
 */
export function checkPlanExists(
  conversation: { messages: Array<{ slug?: string }> },
  sessionId?: string
): boolean {
  const slug = conversation.messages.find((msg) => msg.slug)?.slug;
  if (!slug) return false;

  const currentSession = sessionId ?? getSessionId();
  cachePlanSlug(currentSession, slug);

  const planPath = path.join(getPlanDir(), `${slug}.md`);
  return fs.existsSync(planPath);
}

/**
 * Check if plan file exists for current context.
 */
export function planFileExists(agentId?: string): boolean {
  return fs.existsSync(getPlanFilePath(agentId));
}

/**
 * Write plan content to file.
 */
export function writePlanFile(content: string, agentId?: string): void {
  const planPath = getPlanFilePath(agentId);
  try {
    getPlanDir(); // Ensure dir exists
    fs.writeFileSync(planPath, content, { encoding: 'utf-8' });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));
  }
}

// ============================================
// Display Utilities
// ============================================

/**
 * Shorten path by replacing home directory with ~.
 * Original: k6 in chunks.119.mjs:2399
 */
export function shortenPath(filePath: string): string {
  const homeDir = os.homedir();
  if (filePath.startsWith(homeDir)) {
    return filePath.replace(homeDir, '~');
  }
  return filePath;
}
