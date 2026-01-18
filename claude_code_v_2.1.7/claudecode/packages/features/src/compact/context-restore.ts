/**
 * @claudecode/features - Context Restoration
 *
 * Functions for restoring context after compaction.
 * Reconstructed from chunks.132.mjs:677-750
 */

import { generateUUID } from '@claudecode/shared';
import type { CompactAttachment, CompactSessionContext } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';

// ============================================
// File Restoration
// ============================================

/**
 * Restore recently read files after compaction.
 * Original: E97() in chunks.132.mjs
 *
 * @param previousReadState - Read file state before compact
 * @param context - Compact session context
 * @param maxFiles - Maximum number of files to restore
 * @returns Array of file attachments
 */
export async function restoreRecentFilesAfterCompact(
  previousReadState: Map<string, { content: string; timestamp: number }>,
  context: CompactSessionContext,
  maxFiles: number = COMPACT_CONSTANTS.MAX_FILES_TO_RESTORE
): Promise<CompactAttachment[]> {
  const attachments: CompactAttachment[] = [];

  // Sort files by recency (most recent first)
  const sortedFiles = [...previousReadState.entries()]
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, maxFiles);

  let totalTokens = 0;
  const maxTokensPerFile = COMPACT_CONSTANTS.MAX_TOKENS_PER_FILE;
  const totalBudget = COMPACT_CONSTANTS.TOTAL_FILE_TOKEN_BUDGET;

  for (const [path, { content }] of sortedFiles) {
    // Estimate tokens for this file
    const fileTokens = Math.ceil(content.length / 4); // Rough estimate

    // Check if we'd exceed budget
    if (totalTokens + fileTokens > totalBudget) {
      break;
    }

    // Truncate if file is too large
    let restoredContent = content;
    if (fileTokens > maxTokensPerFile) {
      const maxChars = maxTokensPerFile * 4;
      restoredContent = content.slice(0, maxChars) + '\n...[truncated for compaction]';
    }

    attachments.push({
      type: 'file',
      content: restoredContent,
      path,
      context: 'post-compact',
    });

    totalTokens += Math.min(fileTokens, maxTokensPerFile);
  }

  return attachments;
}

// ============================================
// Todo Restoration
// ============================================

/**
 * Get todo items for an agent.
 * Original: Cb() in chunks.132.mjs
 */
export function getTodoItems(agentId?: string): unknown[] {
  // This would need integration with actual todo storage
  // Placeholder implementation
  return [];
}

/**
 * Create todo attachment for restoration.
 * Original: z97() in chunks.132.mjs:677-686
 *
 * @param agentId - Agent ID to get todos for
 * @returns Todo attachment or null if no todos
 */
export function createTodoAttachment(agentId?: string): CompactAttachment | null {
  const todoItems = getTodoItems(agentId);

  if (todoItems.length === 0) {
    return null;
  }

  return {
    type: 'todo',
    content: todoItems,
    context: 'post-compact',
  };
}

// ============================================
// Plan File Restoration
// ============================================

/**
 * Get current plan file path.
 * Original: xL0() helper in chunks.132.mjs
 */
export function getCurrentPlanFilePath(agentId?: string): string | null {
  // This would need integration with plan mode
  // Placeholder implementation
  return null;
}

/**
 * Read plan file content.
 */
export async function readPlanFile(path: string): Promise<string | null> {
  // This would need file system integration
  // Placeholder implementation
  return null;
}

/**
 * Create plan file reference attachment.
 * Original: xL0() in chunks.132.mjs:688-697
 *
 * @param agentId - Agent ID
 * @returns Plan attachment or null if no plan exists
 */
export async function createPlanFileReferenceAttachment(
  agentId?: string
): Promise<CompactAttachment | null> {
  const planPath = getCurrentPlanFilePath(agentId);

  if (!planPath) {
    return null;
  }

  const planContent = await readPlanFile(planPath);

  if (!planContent) {
    return null;
  }

  return {
    type: 'plan',
    content: planContent,
    path: planPath,
    context: 'post-compact',
  };
}

// ============================================
// Invoked Skills Restoration
// ============================================

/**
 * Get invoked skills for session.
 * Original: $97() helper in chunks.132.mjs
 */
export function getInvokedSkills(): string[] {
  // This would need integration with skill system
  // Placeholder implementation
  return [];
}

/**
 * Create invoked skills attachment.
 * Original: $97() in chunks.132.mjs
 *
 * @returns Skills attachment or null if no skills invoked
 */
export function createInvokedSkillsAttachment(): CompactAttachment | null {
  const skills = getInvokedSkills();

  if (skills.length === 0) {
    return null;
  }

  return {
    type: 'skill',
    content: skills,
    context: 'post-compact',
  };
}

// ============================================
// Task Status Restoration
// ============================================

/**
 * Get active task statuses.
 * Original: C97() helper in chunks.132.mjs
 */
export function getActiveTaskStatuses(context: CompactSessionContext): unknown[] {
  // This would need integration with task management
  // Placeholder implementation
  return [];
}

/**
 * Create task status attachments.
 * Original: C97() in chunks.132.mjs
 *
 * @param context - Compact session context
 * @returns Array of task status attachments
 */
export async function createTaskStatusAttachments(
  context: CompactSessionContext
): Promise<CompactAttachment[]> {
  const taskStatuses = getActiveTaskStatuses(context);

  return taskStatuses.map((status) => ({
    type: 'task_status' as const,
    content: status,
    context: 'post-compact' as const,
  }));
}

// ============================================
// Boundary Marker
// ============================================

/**
 * Create boundary marker for compact event.
 * Original: pF1() in chunks.132.mjs
 *
 * @param trigger - Compact trigger type
 * @param preCompactTokenCount - Token count before compact
 * @returns Boundary marker
 */
export function createBoundaryMarker(
  trigger: 'auto' | 'manual',
  preCompactTokenCount: number
): {
  type: 'compact_boundary';
  trigger: 'auto' | 'manual';
  preCompactTokenCount: number;
  timestamp: string;
} {
  return {
    type: 'compact_boundary',
    trigger,
    preCompactTokenCount,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// Summary Content Formatting
// ============================================

/**
 * Generate conversation ID for boundary.
 * Original: Bw() in chunks.132.mjs
 */
export function generateConversationId(agentId?: string): string {
  const base = agentId ?? 'main';
  return `${base}-${generateUUID().slice(0, 8)}`;
}

/**
 * Format summary content for user message.
 * Original: u51() in chunks.132.mjs
 *
 * @param summaryText - Generated summary text
 * @param preserveHistory - Whether to mark as history
 * @param conversationId - Unique conversation ID
 * @returns Formatted summary content
 */
export function formatSummaryContent(
  summaryText: string,
  preserveHistory: boolean,
  conversationId: string
): string {
  const header = `[Conversation Summary - ID: ${conversationId}]`;
  const preserveNote = preserveHistory
    ? '\n\n(Previous conversation history preserved for reference)'
    : '';

  return `${header}\n\n${summaryText}${preserveNote}`;
}

// ============================================
// Collect All Attachments
// ============================================

/**
 * Collect all context attachments after compaction.
 *
 * @param context - Compact session context
 * @param previousReadState - Read file state before compact
 * @returns Array of all attachments
 */
export async function collectContextAttachments(
  context: CompactSessionContext,
  previousReadState: Map<string, { content: string; timestamp: number }>
): Promise<CompactAttachment[]> {
  const attachments: CompactAttachment[] = [];

  // Restore files and task statuses in parallel
  const [restoredFiles, taskStatuses] = await Promise.all([
    restoreRecentFilesAfterCompact(previousReadState, context),
    createTaskStatusAttachments(context),
  ]);

  attachments.push(...restoredFiles);
  attachments.push(...taskStatuses);

  // Add todo attachment
  const todoAttachment = createTodoAttachment(context.agentId);
  if (todoAttachment) {
    attachments.push(todoAttachment);
  }

  // Add plan file attachment
  const planAttachment = await createPlanFileReferenceAttachment(context.agentId);
  if (planAttachment) {
    attachments.push(planAttachment);
  }

  // Add invoked skills attachment
  const skillsAttachment = createInvokedSkillsAttachment();
  if (skillsAttachment) {
    attachments.push(skillsAttachment);
  }

  return attachments;
}

// ============================================
// Export
// ============================================

export {
  restoreRecentFilesAfterCompact,
  getTodoItems,
  createTodoAttachment,
  getCurrentPlanFilePath,
  readPlanFile,
  createPlanFileReferenceAttachment,
  getInvokedSkills,
  createInvokedSkillsAttachment,
  getActiveTaskStatuses,
  createTaskStatusAttachments,
  createBoundaryMarker,
  generateConversationId,
  formatSummaryContent,
  collectContextAttachments,
};
