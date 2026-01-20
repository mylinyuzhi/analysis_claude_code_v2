/**
 * @claudecode/features - Attachment Conversion
 *
 * Utilities for converting attachments to API message format.
 *
 * Reconstructed from chunks.131.mjs, chunks.148.mjs
 *
 * Key symbols:
 * - q5 → wrapInSystemReminder
 * - mI0 → extractSystemReminder
 * - SG5 → filterSystemReminderMessages
 */

import type {
  Attachment,
  AttachmentType,
  FileAttachment,
  DirectoryAttachment,
  McpResourceAttachment,
  TodoAttachment,
  TodoReminderAttachment,
  PlanModeAttachment,
  PlanModeExitAttachment,
  PlanModeReentryAttachment,
  DelegateModeAttachment,
  DelegateModeExitAttachment,
  MemoryAttachment,
  TaskStatusAttachment,
  TaskProgressAttachment,
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
  HookStoppedContinuationAttachment,
  EditedTextFileAttachment,
  EditedImageFileAttachment,
  VerifyPlanReminderAttachment,
  CollabNotificationAttachment,
  NestedMemoryAttachment,
  CompactFileReferenceAttachment,
  PlanFileReferenceAttachment,
  UltramemoryAttachment,
  AlreadyReadFileAttachment,
  QueuedCommandAttachment,
  AsyncHookResponseAttachment,
  AgentMentionAttachment,
} from './types.js';

// ============================================
// Types
// ============================================

/**
 * Message content block for API.
 */
export interface ContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

/**
 * API message format with system reminder support.
 */
export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
  /** Hidden from conversation but included in context */
  isMeta?: boolean;
}

// ============================================
// XML Tag Wrapping
// ============================================

/**
 * Wrap content in system-reminder XML tags.
 * Original: q5 in chunks.131.mjs
 */
export function wrapInSystemReminder(content: string): string {
  return `<system-reminder>\n${content}\n</system-reminder>`;
}

/**
 * Extract system reminder content from message.
 * Original: mI0 in chunks.148.mjs
 */
export function extractSystemReminder(message: string): string | null {
  const match = message.match(/<system-reminder>([\s\S]*?)<\/system-reminder>/);
  const captured = match?.[1];
  return captured ? captured.trim() : null;
}

/**
 * Check if message contains system reminder.
 */
export function hasSystemReminder(message: string): boolean {
  return message.includes('<system-reminder>');
}

/**
 * Remove system reminder tags from message.
 */
export function stripSystemReminder(message: string): string {
  return message.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
}

// ============================================
// Attachment to Text Conversion
// ============================================

/**
 * Convert attachment to text content for system reminder.
 */
export function attachmentToText(attachment: Attachment): string {
  switch (attachment.type) {
    case 'file':
      return fileAttachmentToText(attachment);
    case 'directory':
      return directoryAttachmentToText(attachment);
    case 'mcp_resource':
      return mcpResourceAttachmentToText(attachment);
    case 'todo':
      return todoAttachmentToText(attachment);
    case 'todo_reminder':
      return todoReminderAttachmentToText(attachment);
    case 'plan_mode':
      return planModeAttachmentToText(attachment);
    case 'plan_mode_exit':
      return planModeExitAttachmentToText(attachment);
    case 'plan_mode_reentry':
      return planModeReentryAttachmentToText(attachment);
    case 'delegate_mode':
      return delegateModeAttachmentToText(attachment);
    case 'delegate_mode_exit':
      return 'Delegate mode has ended. Returning to normal operation.';
    case 'memory':
      return memoryAttachmentToText(attachment);
    case 'task_status':
      return taskStatusAttachmentToText(attachment);
    case 'task_progress':
      return taskProgressAttachmentToText(attachment);
    case 'diagnostics':
      return diagnosticsAttachmentToText(attachment);
    case 'selected_lines_in_ide':
      return ideSelectionAttachmentToText(attachment);
    case 'opened_file_in_ide':
      return openedFileInIdeAttachmentToText(attachment);
    case 'output_style':
      return outputStyleAttachmentToText(attachment);
    case 'token_usage':
      return tokenUsageAttachmentToText(attachment);
    case 'budget_usd':
      return budgetAttachmentToText(attachment);
    case 'invoked_skills':
      return invokedSkillsAttachmentToText(attachment);
    case 'critical_system_reminder':
      return criticalSystemReminderAttachmentToText(attachment);
    case 'hook_blocking_error':
      return hookBlockingErrorAttachmentToText(attachment);
    case 'hook_success':
      return hookSuccessAttachmentToText(attachment);
    case 'hook_additional_context':
      return hookAdditionalContextAttachmentToText(attachment);
    case 'hook_stopped_continuation':
      return hookStoppedContinuationAttachmentToText(attachment);
    case 'edited_text_file':
      return editedTextFileAttachmentToText(attachment);
    case 'edited_image_file':
      return editedImageFileAttachmentToText(attachment);
    case 'verify_plan_reminder':
      return 'Remember to verify your plan before implementing.';
    case 'collab_notification':
      return collabNotificationAttachmentToText(attachment);
    case 'nested_memory':
      return nestedMemoryAttachmentToText(attachment);
    case 'compact_file_reference':
      return compactFileReferenceAttachmentToText(attachment);
    case 'plan_file_reference':
      return planFileReferenceAttachmentToText(attachment);
    case 'ultramemory':
      return ultramemoryAttachmentToText(attachment);
    case 'already_read_file':
      return ''; // Silent attachment
    case 'queued_command':
      return queuedCommandAttachmentToText(attachment);
    case 'async_hook_response':
      return asyncHookResponseAttachmentToText(attachment);
    case 'agent_mention':
      return agentMentionAttachmentToText(attachment);
    default:
      return `Unknown attachment type: ${(attachment as Attachment).type}`;
  }
}

// ============================================
// Individual Attachment Text Converters
// ============================================

function fileAttachmentToText(attachment: FileAttachment): string {
  const { filename, content, truncated } = attachment;
  let text = `File: ${filename}\n`;

  if (content.type === 'text') {
    text += `Lines ${content.file.startLine}-${content.file.startLine + content.file.numLines - 1} of ${content.file.totalLines}\n`;
    text += '```\n' + content.file.content + '\n```';
  } else if (content.type === 'image') {
    text += `[Image: ${content.file.mimeType}]`;
  } else if (content.type === 'notebook') {
    text += `Jupyter Notebook with ${content.file.cells.length} cells`;
  } else if (content.type === 'pdf') {
    text += `PDF with ${content.file.pages.length} pages`;
  }

  if (truncated) {
    text += '\n(Content truncated)';
  }

  return text;
}

function directoryAttachmentToText(attachment: DirectoryAttachment): string {
  return `Directory: ${attachment.path}\n${attachment.content}`;
}

function mcpResourceAttachmentToText(attachment: McpResourceAttachment): string {
  let text = `MCP Resource: ${attachment.name || attachment.uri}\n`;
  text += `Server: ${attachment.server}\n`;
  if (attachment.description) {
    text += `Description: ${attachment.description}\n`;
  }
  for (const content of attachment.content.contents) {
    if ('text' in content) {
      text += content.text;
    } else {
      text += `[Binary content: ${content.mimeType}]`;
    }
  }
  return text;
}

function todoAttachmentToText(attachment: TodoAttachment): string {
  let text = `Todo List (${attachment.itemCount} items):\n`;
  for (const item of attachment.content) {
    const status =
      item.status === 'completed' ? '✓' : item.status === 'in_progress' ? '→' : '○';
    text += `${status} ${item.content}\n`;
  }
  return text;
}

function todoReminderAttachmentToText(attachment: TodoReminderAttachment): string {
  let text = `Pending Todos (${attachment.itemCount} remaining):\n`;
  for (const item of attachment.content) {
    const status = item.status === 'in_progress' ? '→' : '○';
    text += `${status} ${item.content}\n`;
  }
  return text;
}

function planModeAttachmentToText(attachment: PlanModeAttachment): string {
  let text = 'You are in PLAN MODE.\n';
  text += `Plan file: ${attachment.planFilePath}\n`;
  if (attachment.planExists) {
    text += 'A plan file exists. Review it before proceeding.';
  } else {
    text += 'No plan file exists yet. Create one to outline your approach.';
  }
  if (attachment.isSubAgent) {
    text += '\nYou are operating as a sub-agent.';
  }
  return text;
}

function planModeExitAttachmentToText(attachment: PlanModeExitAttachment): string {
  let text = 'Plan mode has ended.\n';
  text += `Plan file: ${attachment.planFilePath}\n`;
  if (attachment.planExists) {
    text += 'The plan is ready for implementation.';
  }
  return text;
}

function planModeReentryAttachmentToText(attachment: PlanModeReentryAttachment): string {
  return `Re-entering plan mode. Plan file: ${attachment.planFilePath}`;
}

function delegateModeAttachmentToText(attachment: DelegateModeAttachment): string {
  return `You are in DELEGATE MODE for team: ${attachment.teamName}\nTask list: ${attachment.taskListPath}`;
}

function memoryAttachmentToText(attachment: MemoryAttachment): string {
  let text = 'Memory Files:\n';
  for (const mem of attachment.memories) {
    text += `\n--- ${mem.fullPath} ---\n`;
    text += mem.content;
    if (mem.remainingLines > 0) {
      text += `\n... (${mem.remainingLines} more lines)`;
    }
  }
  return text;
}

function taskStatusAttachmentToText(attachment: TaskStatusAttachment): string {
  let text = `Task ${attachment.taskId} (${attachment.taskType}): ${attachment.status}\n`;
  text += attachment.description;
  if (attachment.deltaSummary) {
    text += `\nRecent: ${attachment.deltaSummary}`;
  }
  return text;
}

function taskProgressAttachmentToText(attachment: TaskProgressAttachment): string {
  return `Task ${attachment.taskId} progress: ${attachment.message}`;
}

function diagnosticsAttachmentToText(attachment: DiagnosticsAttachment): string {
  let text = attachment.isNew ? 'NEW Diagnostics:\n' : 'Diagnostics:\n';
  for (const file of attachment.files) {
    text += `\n${file.filePath}:\n`;
    for (const diag of file.diagnostics) {
      const severity = diag.severity.toUpperCase();
      const location = diag.column
        ? `${diag.line}:${diag.column}`
        : `${diag.line}`;
      text += `  [${severity}] Line ${location}: ${diag.message}\n`;
    }
  }
  return text;
}

function ideSelectionAttachmentToText(attachment: IdeSelectionAttachment): string {
  return `Selected in ${attachment.ideName}: ${attachment.filename} (lines ${attachment.lineStart}-${attachment.lineEnd})\n\`\`\`\n${attachment.content}\n\`\`\``;
}

function openedFileInIdeAttachmentToText(attachment: OpenedFileInIdeAttachment): string {
  return `Currently open in IDE: ${attachment.filename}`;
}

function outputStyleAttachmentToText(attachment: OutputStyleAttachment): string {
  return `Output style: ${attachment.style}`;
}

function tokenUsageAttachmentToText(attachment: TokenUsageAttachment): string {
  const pct = ((attachment.used / attachment.total) * 100).toFixed(1);
  return `Token usage: ${attachment.used.toLocaleString()} / ${attachment.total.toLocaleString()} (${pct}%)`;
}

function budgetAttachmentToText(attachment: BudgetAttachment): string {
  return `Budget: $${attachment.used.toFixed(4)} / $${attachment.total.toFixed(2)} used`;
}

function invokedSkillsAttachmentToText(attachment: InvokedSkillsAttachment): string {
  let text = 'Active Skills:\n';
  for (const skill of attachment.skills) {
    text += `\n--- ${skill.name} ---\n`;
    text += skill.content;
  }
  return text;
}

function criticalSystemReminderAttachmentToText(
  attachment: CriticalSystemReminderAttachment
): string {
  return `CRITICAL: ${attachment.content}`;
}

function hookBlockingErrorAttachmentToText(
  attachment: HookBlockingErrorAttachment
): string {
  return `Hook "${attachment.hookName}" blocked command:\n${attachment.blockingError.command}\nReason: ${attachment.blockingError.blockingError}`;
}

function hookSuccessAttachmentToText(attachment: HookSuccessAttachment): string {
  return `Hook "${attachment.hookName}" (${attachment.hookEvent}):\n${attachment.content}`;
}

function hookAdditionalContextAttachmentToText(
  attachment: HookAdditionalContextAttachment
): string {
  return `Hook "${attachment.hookName}" context:\n${attachment.content.join('\n')}`;
}

function hookStoppedContinuationAttachmentToText(
  attachment: HookStoppedContinuationAttachment
): string {
  return `Hook "${attachment.hookName}" stopped: ${attachment.message}`;
}

function editedTextFileAttachmentToText(attachment: EditedTextFileAttachment): string {
  return `Recently edited: ${attachment.filename}\n${attachment.snippet}`;
}

function editedImageFileAttachmentToText(attachment: EditedImageFileAttachment): string {
  return `Recently edited image: ${attachment.filename}`;
}

function collabNotificationAttachmentToText(
  attachment: CollabNotificationAttachment
): string {
  let text = 'Collaboration Notifications:\n';
  for (const chat of attachment.chats) {
    text += `  @${chat.handle}: ${chat.unreadCount} unread\n`;
  }
  return text;
}

function nestedMemoryAttachmentToText(attachment: NestedMemoryAttachment): string {
  return `Nested memory from ${attachment.path}:\n${attachment.content.content}`;
}

function compactFileReferenceAttachmentToText(
  attachment: CompactFileReferenceAttachment
): string {
  return `Reference: ${attachment.filename}`;
}

function planFileReferenceAttachmentToText(
  attachment: PlanFileReferenceAttachment
): string {
  return `Plan file: ${attachment.planFilePath}\n${attachment.planContent}`;
}

function ultramemoryAttachmentToText(attachment: UltramemoryAttachment): string {
  return `Ultra-memory:\n${attachment.content}`;
}

function queuedCommandAttachmentToText(attachment: QueuedCommandAttachment): string {
  if (typeof attachment.prompt === 'string') {
    return `Queued command: ${attachment.prompt}`;
  }
  const textParts = attachment.prompt
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join(' ');
  return `Queued command: ${textParts}`;
}

function asyncHookResponseAttachmentToText(
  attachment: AsyncHookResponseAttachment
): string {
  let text = `Async hook response (${attachment.hookName} - ${attachment.hookEvent}):\n`;
  if (attachment.response.systemMessage) {
    text += attachment.response.systemMessage;
  }
  if (attachment.stdout) {
    text += `\nStdout: ${attachment.stdout}`;
  }
  if (attachment.stderr) {
    text += `\nStderr: ${attachment.stderr}`;
  }
  return text;
}

function agentMentionAttachmentToText(attachment: AgentMentionAttachment): string {
  return `Agent mentioned: @${attachment.agentType}`;
}

// ============================================
// Message Filtering
// ============================================

/**
 * Filter out hidden system reminder messages from conversation.
 * Original: SG5 in chunks.148.mjs
 */
export function filterSystemReminderMessages(
  messages: ApiMessage[]
): ApiMessage[] {
  return messages.filter((msg) => !msg.isMeta);
}

/**
 * Get only system reminder messages.
 */
export function getSystemReminderMessages(messages: ApiMessage[]): ApiMessage[] {
  return messages.filter((msg) => msg.isMeta);
}

// ============================================
// Attachment to API Message
// ============================================

/**
 * Convert attachment to API message format.
 */
export function attachmentToApiMessage(attachment: Attachment): ApiMessage {
  const text = attachmentToText(attachment);
  const wrappedContent = wrapInSystemReminder(text);

  return {
    role: 'user',
    content: wrappedContent,
    isMeta: true,
  };
}

/**
 * Convert multiple attachments to a single API message.
 */
export function attachmentsToApiMessage(attachments: Attachment[]): ApiMessage | null {
  if (attachments.length === 0) {
    return null;
  }

  const texts = attachments
    .map((a) => attachmentToText(a))
    .filter((t) => t.length > 0);

  if (texts.length === 0) {
    return null;
  }

  const combinedText = texts.join('\n\n');
  const wrappedContent = wrapInSystemReminder(combinedText);

  return {
    role: 'user',
    content: wrappedContent,
    isMeta: true,
  };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
