/**
 * @claudecode/features - Context Restoration
 *
 * Functions for restoring context after compaction.
 * Reconstructed from chunks.132.mjs:677-750
 *
 * Key symbols:
 * - E97 → restoreRecentFilesAfterCompact
 * - z97 → createTodoAttachment
 * - xL0 → createPlanFileReferenceAttachment
 * - $97 → createInvokedSkillsAttachment
 * - C97 → createTaskStatusAttachments
 */

import {
  generateUUID,
  getGlobalState,
  getProjectRoot,
  getSessionId,
  getSessionPath,
} from '@claudecode/shared';
import type { BoundaryMarker, CompactAttachment, CompactSessionContext } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import {
  getPlanFilePath,
  readPlanFile as readPlanFileFromPlanMode,
  planFileExists,
} from '../plan-mode/index.js';

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
// Todo Item Interface
// ============================================

/**
 * Todo item structure.
 */
interface TodoItem {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

// ============================================
// Todo Restoration
// ============================================

/**
 * Get todo items for an agent from app state.
 * Original: Cb() in chunks.132.mjs
 *
 * @param context - Compact session context with app state access
 * @param agentId - Agent ID to get todos for
 * @returns Array of todo items
 */
export function getTodoItems(
  context?: CompactSessionContext,
  agentId?: string
): TodoItem[] {
  if (!context?.getAppState) {
    return [];
  }

  try {
    // Get app state synchronously if possible
    const appStatePromise = context.getAppState();
    if (appStatePromise instanceof Promise) {
      // Can't await in sync function, return empty
      return [];
    }

    const appState = appStatePromise as { todos?: Record<string, TodoItem[]> };
    const key = agentId || 'main';
    return appState?.todos?.[key] ?? [];
  } catch {
    return [];
  }
}

/**
 * Get todo items asynchronously.
 */
export async function getTodoItemsAsync(
  context: CompactSessionContext,
  agentId?: string
): Promise<TodoItem[]> {
  try {
    const appState = await context.getAppState();
    const state = appState as { todos?: Record<string, TodoItem[]> };
    const key = agentId || 'main';
    return state?.todos?.[key] ?? [];
  } catch {
    return [];
  }
}

/**
 * Create todo attachment for restoration.
 * Original: z97() in chunks.132.mjs:677-686
 *
 * @param context - Compact session context
 * @param agentId - Agent ID to get todos for
 * @returns Todo attachment or null if no todos
 */
export async function createTodoAttachment(
  context: CompactSessionContext,
  agentId?: string
): Promise<CompactAttachment | null> {
  const todoItems = await getTodoItemsAsync(context, agentId);

  if (todoItems.length === 0) {
    return null;
  }

  // Format todos for the summary
  const formattedTodos = todoItems.map((todo) => ({
    content: todo.content,
    status: todo.status,
    activeForm: todo.activeForm,
  }));

  return {
    type: 'todo',
    content: formattedTodos,
    context: 'post-compact',
  };
}

// ============================================
// Plan File Restoration
// ============================================

/**
 * Get current plan file path.
 * Original: xL0() helper in chunks.132.mjs
 *
 * Uses the plan-mode module's getPlanFilePath function.
 */
export function getCurrentPlanFilePath(agentId?: string): string | null {
  try {
    // Check if plan file exists before returning path
    if (!planFileExists(agentId)) {
      return null;
    }
    return getPlanFilePath(agentId);
  } catch {
    return null;
  }
}

/**
 * Read plan file content.
 *
 * Uses the plan-mode module's readPlanFile function.
 */
export function readPlanFile(agentId?: string): string | null {
  try {
    return readPlanFileFromPlanMode(agentId);
  } catch {
    return null;
  }
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

  const planContent = readPlanFile(agentId);

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
 * Get invoked skills for session from global state.
 * Original: $97() helper in chunks.132.mjs
 *
 * Retrieves skills from globalState.invokedSkills Map.
 */
export function getInvokedSkills(): string[] {
  try {
    const globalState = getGlobalState();
    const invokedSkills = globalState.invokedSkills;

    if (!invokedSkills || invokedSkills.size === 0) {
      return [];
    }

    // Return skill names
    return Array.from(invokedSkills.keys());
  } catch {
    return [];
  }
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

  // Get full skill info from global state
  const globalState = getGlobalState();
  const skillInfos = skills.map((name) => {
    const info = globalState.invokedSkills.get(name);
    return {
      name,
      startTime: info?.startTime,
    };
  });

  return {
    type: 'skill',
    content: skillInfos,
    context: 'post-compact',
  };
}

// ============================================
// Task Status Restoration
// ============================================

/**
 * Task status interface.
 */
interface TaskStatus {
  taskId: string;
  agentId?: string;
  status: 'running' | 'completed' | 'error' | 'backgrounded';
  description?: string;
}

/**
 * Get active task statuses from app state.
 * Original: C97() helper in chunks.132.mjs
 *
 * @param context - Compact session context
 * @returns Array of active task statuses
 */
export async function getActiveTaskStatuses(
  context: CompactSessionContext
): Promise<TaskStatus[]> {
  try {
    const appState = await context.getAppState();
    const state = appState as { activeTasks?: Record<string, TaskStatus> };

    if (!state?.activeTasks) {
      return [];
    }

    // Return only running or backgrounded tasks
    return Object.values(state.activeTasks).filter(
      (task) => task.status === 'running' || task.status === 'backgrounded'
    );
  } catch {
    return [];
  }
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
  const taskStatuses = await getActiveTaskStatuses(context);

  return taskStatuses.map((status) => ({
    type: 'task_status' as const,
    content: {
      taskId: status.taskId,
      agentId: status.agentId,
      status: status.status,
      description: status.description,
    },
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
): BoundaryMarker {
  return {
    type: 'system',
    subtype: 'compact_boundary',
    content: 'Conversation compacted',
    isMeta: false,
    timestamp: new Date().toISOString(),
    uuid: generateUUID(),
    level: 'info',
    compactMetadata: {
      trigger,
      preTokens: preCompactTokenCount,
    },
  };
}

// ============================================
// Summary Content Formatting
// ============================================

/**
 * Generate conversation ID for boundary.
 * Original: Bw() in chunks.132.mjs
 */
export function generateConversationId(_agentId?: string): string {
  // NOTE: Despite the name, original Bw() returns the current session transcript path.
  return getSessionPath(getSessionId(), getProjectRoot());
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
  transcriptPath?: string,
  recentMessagesPreserved?: boolean
): string {
  const normalized = summaryText.replace(/\n\n+/g, '\n\n').trim();

  let out = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${normalized}`;

  if (transcriptPath) {
    out += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${transcriptPath}`;
  }
  if (recentMessagesPreserved) {
    out += `\n\nRecent messages are preserved verbatim.`;
  }
  if (preserveHistory) {
    out += `\nPlease continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  }
  return out;
}

// ============================================
// Collect All Attachments
// ============================================

/**
 * Collect all context attachments after compaction.
 *
 * Gathers:
 * - Recently read files (limited by token budget)
 * - Active task statuses
 * - Todo items
 * - Plan file reference
 * - Invoked skills
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

  // Restore files, task statuses, and todos in parallel
  const [restoredFiles, taskStatuses, todoAttachment, planAttachment] = await Promise.all([
    restoreRecentFilesAfterCompact(previousReadState, context),
    createTaskStatusAttachments(context),
    createTodoAttachment(context, context.agentId),
    createPlanFileReferenceAttachment(context.agentId),
  ]);

  // Add restored files
  attachments.push(...restoredFiles);

  // Add task statuses
  attachments.push(...taskStatuses);

  // Add todo attachment if present
  if (todoAttachment) {
    attachments.push(todoAttachment);
  }

  // Add plan file attachment if present
  if (planAttachment) {
    attachments.push(planAttachment);
  }

  // Add invoked skills attachment (synchronous)
  const skillsAttachment = createInvokedSkillsAttachment();
  if (skillsAttachment) {
    attachments.push(skillsAttachment);
  }

  return attachments;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
