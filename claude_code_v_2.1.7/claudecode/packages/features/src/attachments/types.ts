/**
 * @claudecode/features - Attachment Types
 *
 * Type definitions for the system reminder/attachment generation system.
 *
 * Reconstructed from chunks.131.mjs, chunks.132.mjs, chunks.148.mjs
 */

// ============================================
// Attachment Type Constants
// ============================================

/**
 * All supported attachment types.
 */
export const ATTACHMENT_TYPES = [
  // User Prompt Attachments
  'file',
  'directory',
  'mcp_resource',
  'agent_mention',
  'already_read_file',

  // Core Attachments
  'edited_text_file',
  'edited_image_file',
  'nested_memory',
  'plan_mode',
  'plan_mode_reentry',
  'plan_mode_exit',
  'delegate_mode',
  'delegate_mode_exit',
  'todo',
  'todo_reminder',
  'collab_notification',
  'critical_system_reminder',
  'invoked_skills',

  // Main Agent Attachments
  'selected_lines_in_ide',
  'opened_file_in_ide',
  'output_style',
  'queued_command',
  'diagnostics',
  'task_status',
  'task_progress',
  'async_hook_response',
  'memory',
  'token_usage',
  'budget_usd',
  'verify_plan_reminder',

  // Special Types
  'compact_file_reference',
  'plan_file_reference',
  'ultramemory',
  'hook_blocking_error',
  'hook_success',
  'hook_additional_context',
  'hook_stopped_continuation',
] as const;

export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

// ============================================
// File Content Types
// ============================================

/**
 * Text file content.
 */
export interface TextFileContent {
  type: 'text';
  file: {
    filePath: string;
    content: string;
    numLines: number;
    startLine: number;
    totalLines: number;
  };
}

/**
 * Image file content.
 */
export interface ImageFileContent {
  type: 'image';
  file: {
    filePath: string;
    base64Data: string;
    mimeType: string;
  };
}

/**
 * Notebook file content.
 */
export interface NotebookFileContent {
  type: 'notebook';
  file: {
    filePath: string;
    cells: Array<{
      type: 'code' | 'markdown';
      source: string;
      outputs?: unknown[];
    }>;
  };
}

/**
 * PDF file content.
 */
export interface PdfFileContent {
  type: 'pdf';
  file: {
    filePath: string;
    pages: Array<{
      pageNumber: number;
      text: string;
      images?: string[];
    }>;
  };
}

/**
 * File content union.
 */
export type FileContent =
  | TextFileContent
  | ImageFileContent
  | NotebookFileContent
  | PdfFileContent;

// ============================================
// Attachment Definitions
// ============================================

/**
 * File attachment (from @mention).
 */
export interface FileAttachment {
  type: 'file';
  filename: string;
  content: FileContent;
  truncated?: boolean;
}

/**
 * Directory attachment.
 */
export interface DirectoryAttachment {
  type: 'directory';
  path: string;
  content: string;
}

/**
 * MCP resource attachment.
 */
export interface McpResourceAttachment {
  type: 'mcp_resource';
  server: string;
  uri: string;
  name?: string;
  description?: string;
  content: {
    contents: Array<{ text: string } | { blob: string; mimeType: string }>;
  };
}

/**
 * Agent mention attachment.
 */
export interface AgentMentionAttachment {
  type: 'agent_mention';
  agentType: string;
}

/**
 * Edited text file attachment.
 */
export interface EditedTextFileAttachment {
  type: 'edited_text_file';
  filename: string;
  snippet: string;
}

/**
 * Edited image file attachment.
 */
export interface EditedImageFileAttachment {
  type: 'edited_image_file';
  filename: string;
  content: string;
}

/**
 * Nested memory attachment.
 */
export interface NestedMemoryAttachment {
  type: 'nested_memory';
  path: string;
  content: {
    type: 'text';
    path: string;
    content: string;
  };
}

/**
 * Plan mode attachment.
 */
export interface PlanModeAttachment {
  type: 'plan_mode';
  reminderType: 'full' | 'sparse';
  isSubAgent: boolean;
  planFilePath: string;
  planExists: boolean;
}

/**
 * Plan mode reentry attachment.
 */
export interface PlanModeReentryAttachment {
  type: 'plan_mode_reentry';
  planFilePath: string;
}

/**
 * Plan mode exit attachment.
 */
export interface PlanModeExitAttachment {
  type: 'plan_mode_exit';
  planFilePath: string;
  planExists: boolean;
}

/**
 * Delegate mode attachment.
 */
export interface DelegateModeAttachment {
  type: 'delegate_mode';
  teamName: string;
  taskListPath: string;
}

/**
 * Delegate mode exit attachment.
 */
export interface DelegateModeExitAttachment {
  type: 'delegate_mode_exit';
}

/**
 * Todo item.
 */
export interface TodoItem {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

/**
 * Todo attachment.
 */
export interface TodoAttachment {
  type: 'todo';
  content: TodoItem[];
  itemCount: number;
  context?: 'file-watch';
}

/**
 * Todo reminder attachment.
 */
export interface TodoReminderAttachment {
  type: 'todo_reminder';
  content: TodoItem[];
  itemCount: number;
}

/**
 * Collab notification attachment.
 */
export interface CollabNotificationAttachment {
  type: 'collab_notification';
  chats: Array<{
    handle: string;
    unreadCount: number;
  }>;
}

/**
 * Critical system reminder attachment.
 */
export interface CriticalSystemReminderAttachment {
  type: 'critical_system_reminder';
  content: string;
}

/**
 * Invoked skills attachment.
 */
export interface InvokedSkillsAttachment {
  type: 'invoked_skills';
  skills: Array<{
    name: string;
    path: string;
    content: string;
  }>;
}

/**
 * IDE selection attachment.
 */
export interface IdeSelectionAttachment {
  type: 'selected_lines_in_ide';
  ideName: string;
  lineStart: number;
  lineEnd: number;
  filename: string;
  content: string;
}

/**
 * Opened file in IDE attachment.
 */
export interface OpenedFileInIdeAttachment {
  type: 'opened_file_in_ide';
  filename: string;
}

/**
 * Output style attachment.
 */
export interface OutputStyleAttachment {
  type: 'output_style';
  style: string;
}

/**
 * Queued command attachment.
 */
export interface QueuedCommandAttachment {
  type: 'queued_command';
  prompt: string | Array<{ type: 'text' | 'image'; text?: string; data?: string }>;
  source_uuid: string;
  imagePasteIds?: string[];
}

/**
 * Diagnostics attachment.
 */
export interface DiagnosticsAttachment {
  type: 'diagnostics';
  files: Array<{
    filePath: string;
    diagnostics: Array<{
      message: string;
      severity: 'error' | 'warning' | 'info' | 'hint';
      line: number;
      column?: number;
    }>;
  }>;
  isNew: boolean;
}

/**
 * Task status attachment.
 */
export interface TaskStatusAttachment {
  type: 'task_status';
  taskId: string;
  taskType: 'shell' | 'agent' | 'remote_session';
  status: 'running' | 'completed' | 'failed';
  description: string;
  deltaSummary?: string;
}

/**
 * Task progress attachment.
 */
export interface TaskProgressAttachment {
  type: 'task_progress';
  taskId: string;
  taskType: 'shell' | 'agent' | 'remote_session';
  message: string;
}

/**
 * Async hook response attachment.
 */
export interface AsyncHookResponseAttachment {
  type: 'async_hook_response';
  processId: string;
  hookName: string;
  hookEvent: string;
  toolName?: string;
  response: {
    systemMessage?: string;
    hookSpecificOutput?: {
      additionalContext?: string;
    };
  };
  stdout?: string;
  stderr?: string;
  exitCode?: number;
}

/**
 * Memory attachment.
 */
export interface MemoryAttachment {
  type: 'memory';
  memories: Array<{
    fullPath: string;
    content: string;
    lastModified: Date;
    remainingLines: number;
  }>;
}

/**
 * Token usage attachment.
 */
export interface TokenUsageAttachment {
  type: 'token_usage';
  used: number;
  total: number;
  remaining: number;
}

/**
 * Budget attachment.
 */
export interface BudgetAttachment {
  type: 'budget_usd';
  used: number;
  total: number;
  remaining: number;
}

/**
 * Verify plan reminder attachment.
 */
export interface VerifyPlanReminderAttachment {
  type: 'verify_plan_reminder';
}

/**
 * Compact file reference attachment.
 */
export interface CompactFileReferenceAttachment {
  type: 'compact_file_reference';
  filename: string;
}

/**
 * Plan file reference attachment.
 */
export interface PlanFileReferenceAttachment {
  type: 'plan_file_reference';
  planFilePath: string;
  planContent: string;
}

/**
 * Ultramemory attachment.
 */
export interface UltramemoryAttachment {
  type: 'ultramemory';
  content: string;
}

/**
 * Hook blocking error attachment.
 */
export interface HookBlockingErrorAttachment {
  type: 'hook_blocking_error';
  hookName: string;
  blockingError: {
    command: string;
    blockingError: string;
  };
}

/**
 * Hook success attachment.
 */
export interface HookSuccessAttachment {
  type: 'hook_success';
  hookEvent: string;
  hookName: string;
  content: string;
}

/**
 * Hook additional context attachment.
 */
export interface HookAdditionalContextAttachment {
  type: 'hook_additional_context';
  hookName: string;
  content: string[];
}

/**
 * Hook stopped continuation attachment.
 */
export interface HookStoppedContinuationAttachment {
  type: 'hook_stopped_continuation';
  hookName: string;
  message: string;
}

/**
 * Already read file attachment (silent).
 */
export interface AlreadyReadFileAttachment {
  type: 'already_read_file';
  filename: string;
}

// ============================================
// Attachment Union
// ============================================

/**
 * All attachment types.
 */
export type Attachment =
  | FileAttachment
  | DirectoryAttachment
  | McpResourceAttachment
  | AgentMentionAttachment
  | EditedTextFileAttachment
  | EditedImageFileAttachment
  | NestedMemoryAttachment
  | PlanModeAttachment
  | PlanModeReentryAttachment
  | PlanModeExitAttachment
  | DelegateModeAttachment
  | DelegateModeExitAttachment
  | TodoAttachment
  | TodoReminderAttachment
  | CollabNotificationAttachment
  | CriticalSystemReminderAttachment
  | InvokedSkillsAttachment
  | IdeSelectionAttachment
  | OpenedFileInIdeAttachment
  | OutputStyleAttachment
  | QueuedCommandAttachment
  | DiagnosticsAttachment
  | TaskStatusAttachment
  | TaskProgressAttachment
  | AsyncHookResponseAttachment
  | MemoryAttachment
  | TokenUsageAttachment
  | BudgetAttachment
  | VerifyPlanReminderAttachment
  | CompactFileReferenceAttachment
  | PlanFileReferenceAttachment
  | UltramemoryAttachment
  | HookBlockingErrorAttachment
  | HookSuccessAttachment
  | HookAdditionalContextAttachment
  | HookStoppedContinuationAttachment
  | AlreadyReadFileAttachment;

// ============================================
// Attachment Message
// ============================================

/**
 * Attachment wrapped for yielding in agent loop.
 */
export interface AttachmentMessage {
  type: 'attachment';
  attachment: Attachment;
  uuid: string;
  timestamp: string;
}

// ============================================
// Generation Context
// ============================================

/**
 * Read file state entry.
 */
export interface ReadFileStateEntry {
  content: string;
  timestamp: number;
  offset?: number;
  limit?: number;
}

/**
 * IDE context.
 */
export interface IdeContext {
  selection?: {
    ideName: string;
    filename: string;
    lineStart: number;
    lineEnd: number;
    content: string;
  };
  openedFile?: {
    filename: string;
  };
}

/**
 * Attachment generation context.
 */
export interface AttachmentContext {
  /** Agent ID (undefined for main agent) */
  agentId?: string;
  /** Read file state map */
  readFileState: Map<string, ReadFileStateEntry>;
  /** Nested memory triggers */
  nestedMemoryAttachmentTriggers?: Set<string>;
  /** Abort controller for timeout */
  abortController?: AbortController;
  /** Get app state function */
  getAppState: () => Promise<AppState>;
  /** Options */
  options: AttachmentOptions;
}

/**
 * App state for attachments.
 */
export interface AppState {
  /** Tool permission context */
  toolPermissionContext: {
    mode: 'normal' | 'plan' | 'delegate';
  };
  /** Team context (for delegate mode) */
  teamContext?: {
    teamName: string;
  };
  /** Todos by agent */
  todos: Record<string, TodoItem[]>;
  /** Tasks */
  tasks?: Map<string, unknown>;
}

/**
 * Attachment options.
 */
export interface AttachmentOptions {
  /** Active agent definitions */
  agentDefinitions?: {
    activeAgents: Array<{
      type: string;
      name: string;
    }>;
  };
  /** Max budget in USD */
  maxBudgetUsd?: number;
  /** Critical system reminder */
  criticalSystemReminder_EXPERIMENTAL?: string;
  /** Output style */
  outputStyle?: string;
}

// ============================================
// Constants
// ============================================

/**
 * Attachment generation constants.
 * Aligned with nr2, ar2, N27, L27 in chunks.132.mjs:327
 */
export const ATTACHMENT_CONSTANTS = {
  /** Timeout for all attachment generation (ms) */
  GENERATION_TIMEOUT: 1000,
  /** Telemetry sampling rate */
  TELEMETRY_SAMPLE_RATE: 0.05,
  /** Max content size (simulated) */
  MAX_CONTENT_SIZE: 40000,
  /** Turns between plan mode attachments (ar2.TURNS_BETWEEN_ATTACHMENTS) */
  TURNS_BETWEEN_PLAN_ATTACHMENTS: 5,
  /** Full plan reminder interval (ar2.FULL_REMINDER_EVERY_N_ATTACHMENTS) */
  FULL_PLAN_REMINDER_EVERY_N: 5,
  /** Turns since last todo write before reminder (nr2.TURNS_SINCE_WRITE) */
  TODO_TURNS_SINCE_WRITE: 10,
  /** Turns between todo reminders (nr2.TURNS_BETWEEN_REMINDERS) */
  TODO_TURNS_BETWEEN_REMINDERS: 10,
  /** Task progress turn threshold (w27 in chunks.132.mjs:288) */
  PROGRESS_TURN_THRESHOLD: 3,
  /** Token cooldown (N27.TOKEN_COOLDOWN) */
  TOKEN_COOLDOWN: 5000,
  /** Turns between general reminders (L27.TURNS_BETWEEN_REMINDERS) */
  GENERAL_REMINDER_INTERVAL: 10,
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
