/**
 * @claudecode/features - Attachment Generators
 *
 * Individual attachment generator functions for the system reminder system.
 *
 * Reconstructed from chunks.131.mjs, chunks.132.mjs, chunks.148.mjs
 *
 * Key symbols:
 * - h27 → generateAtMentionedFilesAttachment
 * - m27 → generateChangedFilesAttachment
 * - Various generators for each attachment type
 */

import type {
  Attachment,
  AttachmentContext,
  TodoItem,
  TodoAttachment,
  TodoReminderAttachment,
  PlanModeAttachment,
  PlanModeExitAttachment,
  DelegateModeAttachment,
  MemoryAttachment,
  TaskStatusAttachment,
  DiagnosticsAttachment,
  IdeSelectionAttachment,
  OpenedFileInIdeAttachment,
  OutputStyleAttachment,
  TokenUsageAttachment,
  BudgetAttachment,
  InvokedSkillsAttachment,
  CriticalSystemReminderAttachment,
  HookBlockingErrorAttachment,
  HookSuccessAttachment,
  HookAdditionalContextAttachment,
  EditedTextFileAttachment,
  VerifyPlanReminderAttachment,
  CollabNotificationAttachment,
  ATTACHMENT_CONSTANTS,
} from './types.js';

// ============================================
// Generator Result Type
// ============================================

export interface GeneratorResult {
  attachment: Attachment | null;
  error?: Error;
}

// ============================================
// Todo Generators
// ============================================

/**
 * Generate todo attachment.
 * Original: Part of attachment generation in chunks.131.mjs
 */
export function generateTodoAttachment(
  todos: TodoItem[],
  context?: 'file-watch'
): TodoAttachment | null {
  if (!todos || todos.length === 0) {
    return null;
  }

  return {
    type: 'todo',
    content: todos,
    itemCount: todos.length,
    context,
  };
}

/**
 * Generate todo reminder attachment.
 * Shows when there are pending todos and enough turns have passed.
 */
export function generateTodoReminderAttachment(
  todos: TodoItem[],
  turnsSinceWrite: number,
  turnsSinceReminder: number
): TodoReminderAttachment | null {
  // Check if reminder is needed
  if (turnsSinceWrite < ATTACHMENT_CONSTANTS.TODO_TURNS_SINCE_WRITE) {
    return null;
  }

  if (turnsSinceReminder < ATTACHMENT_CONSTANTS.TODO_TURNS_BETWEEN_REMINDERS) {
    return null;
  }

  // Only remind about non-completed todos
  const pendingTodos = todos.filter((t) => t.status !== 'completed');
  if (pendingTodos.length === 0) {
    return null;
  }

  return {
    type: 'todo_reminder',
    content: pendingTodos,
    itemCount: pendingTodos.length,
  };
}

// ============================================
// Plan Mode Generators
// ============================================

/**
 * Generate plan mode attachment.
 * Original: Part of plan mode system in chunks.130.mjs
 */
export function generatePlanModeAttachment(
  planFilePath: string,
  planExists: boolean,
  turnIndex: number,
  isSubAgent: boolean = false
): PlanModeAttachment {
  // Full reminder every N turns, sparse otherwise
  const reminderType =
    turnIndex % ATTACHMENT_CONSTANTS.FULL_REMINDER_EVERY_N === 0
      ? 'full'
      : 'sparse';

  return {
    type: 'plan_mode',
    reminderType,
    isSubAgent,
    planFilePath,
    planExists,
  };
}

/**
 * Generate plan mode exit attachment.
 */
export function generatePlanModeExitAttachment(
  planFilePath: string,
  planExists: boolean
): PlanModeExitAttachment {
  return {
    type: 'plan_mode_exit',
    planFilePath,
    planExists,
  };
}

/**
 * Generate verify plan reminder attachment.
 */
export function generateVerifyPlanReminderAttachment(): VerifyPlanReminderAttachment {
  return {
    type: 'verify_plan_reminder',
  };
}

// ============================================
// Delegate Mode Generators
// ============================================

/**
 * Generate delegate mode attachment.
 */
export function generateDelegateModeAttachment(
  teamName: string,
  taskListPath: string
): DelegateModeAttachment {
  return {
    type: 'delegate_mode',
    teamName,
    taskListPath,
  };
}

// ============================================
// Memory Generators
// ============================================

/**
 * Generate memory attachment.
 * Original: Memory loading in chunks.131.mjs
 */
export function generateMemoryAttachment(
  memories: Array<{
    fullPath: string;
    content: string;
    lastModified: Date;
    remainingLines: number;
  }>
): MemoryAttachment | null {
  if (!memories || memories.length === 0) {
    return null;
  }

  return {
    type: 'memory',
    memories,
  };
}

// ============================================
// Task Status Generators
// ============================================

/**
 * Generate task status attachment.
 * Original: Task tracking in chunks.136.mjs
 */
export function generateTaskStatusAttachment(
  taskId: string,
  taskType: 'shell' | 'agent' | 'remote_session',
  status: 'running' | 'completed' | 'failed',
  description: string,
  deltaSummary?: string
): TaskStatusAttachment {
  return {
    type: 'task_status',
    taskId,
    taskType,
    status,
    description,
    deltaSummary,
  };
}

// ============================================
// Diagnostics Generators
// ============================================

/**
 * Generate diagnostics attachment.
 * Original: IDE diagnostics in chunks.151.mjs
 */
export function generateDiagnosticsAttachment(
  files: Array<{
    filePath: string;
    diagnostics: Array<{
      message: string;
      severity: 'error' | 'warning' | 'info' | 'hint';
      line: number;
      column?: number;
    }>;
  }>,
  isNew: boolean = false
): DiagnosticsAttachment | null {
  if (!files || files.length === 0) {
    return null;
  }

  // Filter out files with no diagnostics
  const filesWithDiagnostics = files.filter((f) => f.diagnostics.length > 0);
  if (filesWithDiagnostics.length === 0) {
    return null;
  }

  return {
    type: 'diagnostics',
    files: filesWithDiagnostics,
    isNew,
  };
}

// ============================================
// IDE Generators
// ============================================

/**
 * Generate IDE selection attachment.
 * Original: IDE context in chunks.151.mjs
 */
export function generateIdeSelectionAttachment(
  ideName: string,
  filename: string,
  lineStart: number,
  lineEnd: number,
  content: string
): IdeSelectionAttachment {
  // Truncate content if too long
  const truncatedContent =
    content.length > ATTACHMENT_CONSTANTS.IDE_CONTENT_TRUNCATION
      ? content.slice(0, ATTACHMENT_CONSTANTS.IDE_CONTENT_TRUNCATION) + '\n... (truncated)'
      : content;

  return {
    type: 'selected_lines_in_ide',
    ideName,
    filename,
    lineStart,
    lineEnd,
    content: truncatedContent,
  };
}

/**
 * Generate opened file in IDE attachment.
 */
export function generateOpenedFileInIdeAttachment(
  filename: string
): OpenedFileInIdeAttachment {
  return {
    type: 'opened_file_in_ide',
    filename,
  };
}

// ============================================
// Style & Budget Generators
// ============================================

/**
 * Generate output style attachment.
 */
export function generateOutputStyleAttachment(style: string): OutputStyleAttachment {
  return {
    type: 'output_style',
    style,
  };
}

/**
 * Generate token usage attachment.
 */
export function generateTokenUsageAttachment(
  used: number,
  total: number
): TokenUsageAttachment {
  return {
    type: 'token_usage',
    used,
    total,
    remaining: total - used,
  };
}

/**
 * Generate budget attachment.
 */
export function generateBudgetAttachment(
  used: number,
  total: number
): BudgetAttachment {
  return {
    type: 'budget_usd',
    used,
    total,
    remaining: total - used,
  };
}

// ============================================
// Skills Generators
// ============================================

/**
 * Generate invoked skills attachment.
 * Original: Skills system in chunks.152.mjs
 */
export function generateInvokedSkillsAttachment(
  skills: Array<{
    name: string;
    path: string;
    content: string;
  }>
): InvokedSkillsAttachment | null {
  if (!skills || skills.length === 0) {
    return null;
  }

  return {
    type: 'invoked_skills',
    skills,
  };
}

// ============================================
// Critical System Reminder Generators
// ============================================

/**
 * Generate critical system reminder attachment.
 */
export function generateCriticalSystemReminderAttachment(
  content: string
): CriticalSystemReminderAttachment {
  return {
    type: 'critical_system_reminder',
    content,
  };
}

// ============================================
// Hook Result Generators
// ============================================

/**
 * Generate hook blocking error attachment.
 */
export function generateHookBlockingErrorAttachment(
  hookName: string,
  command: string,
  blockingError: string
): HookBlockingErrorAttachment {
  return {
    type: 'hook_blocking_error',
    hookName,
    blockingError: {
      command,
      blockingError,
    },
  };
}

/**
 * Generate hook success attachment.
 */
export function generateHookSuccessAttachment(
  hookEvent: string,
  hookName: string,
  content: string
): HookSuccessAttachment {
  return {
    type: 'hook_success',
    hookEvent,
    hookName,
    content,
  };
}

/**
 * Generate hook additional context attachment.
 */
export function generateHookAdditionalContextAttachment(
  hookName: string,
  content: string[]
): HookAdditionalContextAttachment | null {
  if (!content || content.length === 0) {
    return null;
  }

  return {
    type: 'hook_additional_context',
    hookName,
    content,
  };
}

// ============================================
// Edited File Generators
// ============================================

/**
 * Generate edited text file attachment.
 * Shows a snippet of recently edited files.
 */
export function generateEditedTextFileAttachment(
  filename: string,
  snippet: string
): EditedTextFileAttachment {
  return {
    type: 'edited_text_file',
    filename,
    snippet,
  };
}

// ============================================
// Collab Generators
// ============================================

/**
 * Generate collab notification attachment.
 */
export function generateCollabNotificationAttachment(
  chats: Array<{
    handle: string;
    unreadCount: number;
  }>
): CollabNotificationAttachment | null {
  if (!chats || chats.length === 0) {
    return null;
  }

  // Filter out chats with no unread messages
  const unreadChats = chats.filter((c) => c.unreadCount > 0);
  if (unreadChats.length === 0) {
    return null;
  }

  return {
    type: 'collab_notification',
    chats: unreadChats,
  };
}

// ============================================
// Changed Files Generator
// ============================================

/**
 * Generate changed files attachment from read file state.
 * Original: m27 in chunks.131.mjs
 */
export function generateChangedFilesAttachment(
  ctx: AttachmentContext,
  currentFiles: Map<string, { content: string; timestamp: number }>
): EditedTextFileAttachment[] {
  const attachments: EditedTextFileAttachment[] = [];

  for (const [filePath, current] of currentFiles) {
    const previous = ctx.readFileState.get(filePath);

    // Check if file was modified since last read
    if (previous && previous.timestamp < current.timestamp) {
      // Generate a diff snippet (simplified)
      const snippet = generateDiffSnippet(previous.content, current.content);
      if (snippet) {
        attachments.push(
          generateEditedTextFileAttachment(filePath, snippet)
        );
      }
    }
  }

  return attachments;
}

/**
 * Generate a simple diff snippet between two versions.
 */
function generateDiffSnippet(oldContent: string, newContent: string): string | null {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  // Find first difference
  let firstDiff = 0;
  while (
    firstDiff < oldLines.length &&
    firstDiff < newLines.length &&
    oldLines[firstDiff] === newLines[firstDiff]
  ) {
    firstDiff++;
  }

  // Find last difference
  let oldEnd = oldLines.length - 1;
  let newEnd = newLines.length - 1;
  while (
    oldEnd > firstDiff &&
    newEnd > firstDiff &&
    oldLines[oldEnd] === newLines[newEnd]
  ) {
    oldEnd--;
    newEnd--;
  }

  // No differences
  if (firstDiff > oldEnd && firstDiff > newEnd) {
    return null;
  }

  // Build snippet with context
  const contextLines = 3;
  const startLine = Math.max(0, firstDiff - contextLines);
  const endLine = Math.min(newLines.length - 1, newEnd + contextLines);

  const snippetLines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    if (i >= firstDiff && i <= newEnd) {
      // Changed line
      snippetLines.push(`+ ${newLines[i]}`);
    } else {
      // Context line
      snippetLines.push(`  ${newLines[i]}`);
    }
  }

  return snippetLines.join('\n');
}

// ============================================
// Export
// ============================================

export {
  generateTodoAttachment,
  generateTodoReminderAttachment,
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
  generateVerifyPlanReminderAttachment,
  generateDelegateModeAttachment,
  generateMemoryAttachment,
  generateTaskStatusAttachment,
  generateDiagnosticsAttachment,
  generateIdeSelectionAttachment,
  generateOpenedFileInIdeAttachment,
  generateOutputStyleAttachment,
  generateTokenUsageAttachment,
  generateBudgetAttachment,
  generateInvokedSkillsAttachment,
  generateCriticalSystemReminderAttachment,
  generateHookBlockingErrorAttachment,
  generateHookSuccessAttachment,
  generateHookAdditionalContextAttachment,
  generateEditedTextFileAttachment,
  generateCollabNotificationAttachment,
  generateChangedFilesAttachment,
};
