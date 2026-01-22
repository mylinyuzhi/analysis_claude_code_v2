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
} from './types.js';

import { ATTACHMENT_CONSTANTS } from './types.js';

// ============================================
// Generator Result Type
// ============================================

export interface GeneratorResult {
  attachment: Attachment | null;
  error?: Error;
}

// ============================================
// History Analysis Helpers
// ============================================

/**
 * Check if an assistant message contains only thinking blocks.
 * Original: dF1 in chunks.148.mjs
 */
function isThinkingOnlyMessage(message: any): boolean {
  if (message.type !== 'assistant') return false;
  if (!Array.isArray(message.message.content)) return false;
  return message.message.content.every((block: any) => block.type === 'thinking');
}

/**
 * Analyze plan mode history to determine turn count and previous attachments.
 * Original: R27 in chunks.131.mjs
 */
function analyzePlanModeHistory(history: any[]): { turnCount: number; foundPlanModeAttachment: boolean } {
  let turnCount = 0;
  let foundPlanModeAttachment = false;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg?.type === 'assistant') {
      if (isThinkingOnlyMessage(msg)) continue;
      turnCount++;
    } else if (
      msg?.type === 'attachment' &&
      (msg.attachment.type === 'plan_mode' || msg.attachment.type === 'plan_mode_reentry')
    ) {
      foundPlanModeAttachment = true;
      break;
    }
  }

  return { turnCount, foundPlanModeAttachment };
}

/**
 * Count the number of plan mode attachments in history.
 * Original: _27 in chunks.131.mjs
 */
function countPlanModeAttachments(history: any[]): number {
  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg?.type === 'attachment') {
      if (msg.attachment.type === 'plan_mode_exit') break;
      if (msg.attachment.type === 'plan_mode') count++;
    }
  }
  return count;
}

// ============================================
// Plan Mode Generators
// ============================================

/**
 * Generate plan mode attachment.
 * Original: j27 in chunks.131.mjs
 */
export async function generatePlanModeAttachment(
  history: any[],
  ctx: AttachmentContext
): Promise<Attachment[]> {
  const appState = await ctx.getAppState();
  if (appState.toolPermissionContext.mode !== 'plan') return [];

  // Throttle plan mode attachments
  if (history && history.length > 0) {
    const { turnCount, foundPlanModeAttachment } = analyzePlanModeHistory(history);
    if (foundPlanModeAttachment && turnCount < 3) { // 3 is from ar2.TURNS_BETWEEN_ATTACHMENTS
      return [];
    }
  }

  // In real implementation, get plan file path and check if exists
  const planFilePath = `/tmp/plan-${ctx.agentId || 'main'}.md`;
  const planExists = false; 
  
  const attachments: Attachment[] = [];

  // Re-entry check (simulated)
  // if (hasExitedPlanMode() && planExists) ...

  // Determine reminder type (full or sparse)
  const attachmentCount = countPlanModeAttachments(history ?? []);
  const reminderType = (attachmentCount + 1) % 5 === 1 ? 'full' : 'sparse'; // 5 is from ar2.FULL_REMINDER_EVERY_N_ATTACHMENTS

  attachments.push({
    type: 'plan_mode',
    reminderType,
    isSubAgent: !!ctx.agentId,
    planFilePath,
    planExists,
  });

  return attachments;
}

/**
 * Generate plan mode exit attachment.
 * Original: T27 in chunks.131.mjs
 */
export async function generatePlanModeExitAttachment(
  ctx: AttachmentContext
): Promise<Attachment[]> {
  // Logic from T27: check if just exited plan mode
  // if (!hasJustExitedPlanMode()) return [];
  
  const appState = await ctx.getAppState();
  if (appState.toolPermissionContext.mode === 'plan') return [];

  const planFilePath = `/tmp/plan-${ctx.agentId || 'main'}.md`;
  const planExists = false;

  return [{
    type: 'plan_mode_exit',
    planFilePath,
    planExists,
  }];
}

/**
 * Generate verify plan reminder attachment.
 * Original: J97 in chunks.132.mjs
 */
export async function generateVerifyPlanReminderAttachment(
  history: any[],
  ctx: AttachmentContext
): Promise<Attachment[]> {
  // Source J97 returns []
  return [];
}

// ============================================
// User Prompt Generators
// ============================================

/**
 * Parse at-mentions from text.
 * Original: c27 in chunks.131.mjs
 */
function parseAtMentions(text: string): string[] {
  const quotedRegex = /(^|\s)@"([^"]+)"/g;
  const simpleRegex = /(^|\s)@([^\s]+)\b/g;
  const results: string[] = [];
  
  let match;
  while ((match = quotedRegex.exec(text)) !== null) {
    if (match[2]) results.push(match[2]);
  }
  
  const simpleMatches = text.match(simpleRegex) || [];
  for (const m of simpleMatches) {
    const mention = m.slice(m.indexOf('@') + 1);
    if (!mention.startsWith('"')) results.push(mention);
  }
  
  return [...new Set(results)];
}

/**
 * Parse filename and line range from mention string.
 * Original: i27 in chunks.131.mjs
 */
function parseFileNameAndRange(mention: string): { filename: string; lineStart?: number; lineEnd?: number } {
  const match = mention.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/);
  if (!match) return { filename: mention };
  
  const [, filename, start, end] = match;
  const lineStart = start ? parseInt(start, 10) : undefined;
  const lineEnd = end ? parseInt(end, 10) : lineStart;
  
  return {
    filename: filename ?? mention,
    lineStart,
    lineEnd
  };
}

/**
 * Generate at-mentioned files attachment.
 * Original: h27 in chunks.131.mjs
 */
export async function generateAtMentionedFilesAttachment(
  userPrompt: string,
  ctx: AttachmentContext
): Promise<Attachment[]> {
  const mentions = parseAtMentions(userPrompt);
  if (mentions.length === 0) return [];

  const attachments: Attachment[] = [];
  const appState = await ctx.getAppState();

  for (const mention of mentions) {
    const { filename, lineStart, lineEnd } = parseFileNameAndRange(mention);
    
    // Check permissions (simulated)
    // if (isDeny(filename, appState.toolPermissionContext)) continue;

    try {
      // In real implementation, check if directory or file and read
      // This would use ReadTool and handle already_read_file
      attachments.push({
        type: 'file',
        filename,
        content: {
          type: 'text',
          file: {
            filePath: filename,
            content: 'Simulated content',
            numLines: 1,
            startLine: lineStart ?? 1,
            totalLines: 1
          }
        }
      });
    } catch {
      // ignore
    }
  }

  return attachments;
}

/**
 * Parse MCP resource mentions.
 * Original: p27 in chunks.131.mjs
 */
function parseMcpMentions(text: string): string[] {
  const regex = /(^|\s)@([^\s]+:[^\s]+)\b/g;
  const matches = text.match(regex) || [];
  return [...new Set(matches.map((m) => m.slice(m.indexOf('@') + 1)))];
}

/**
 * Generate MCP resource attachment.
 * Original: u27 in chunks.131.mjs
 */
export async function generateMcpResourcesAttachment(
  userPrompt: string,
  ctx: AttachmentContext
): Promise<Attachment[]> {
  const mentions = parseMcpMentions(userPrompt);
  if (mentions.length === 0) return [];

  const attachments: Attachment[] = [];
  // In real implementation, read resources from MCP clients
  
  return attachments;
}

/**
 * Generate agent mentions attachment.
 * Original: g27 in chunks.131.mjs
 */
export function generateAgentMentionsAttachment(
  userPrompt: string,
  activeAgents: Array<{ type: string; name: string }>
): AgentMentionAttachment[] {
  const mentions = parseAtMentions(userPrompt);
  const agentMentions = mentions.filter(m => m.startsWith('agent-'));
  
  return agentMentions.map(m => {
    const type = m.replace('agent-', '');
    const agent = activeAgents.find(a => a.type === type);
    if (!agent) return null;
    
    return {
      type: 'agent_mention' as const,
      agentType: agent.type
    };
  }).filter((a): a is AgentMentionAttachment => a !== null);
}

// ============================================
// Core Generators
// ============================================

/**
 * Generate nested memory attachment.
 * Original: d27 in chunks.131.mjs
 */
export async function generateNestedMemoryAttachment(
  ctx: AttachmentContext
): Promise<Attachment[]> {
  if (!ctx.nestedMemoryAttachmentTriggers || ctx.nestedMemoryAttachmentTriggers.size === 0) {
    return [];
  }

  const attachments: Attachment[] = [];
  for (const path of ctx.nestedMemoryAttachmentTriggers) {
    // In real implementation, discover and read related files
    attachments.push({
      type: 'nested_memory',
      path,
      content: {
        type: 'text',
        path,
        content: 'Simulated nested memory'
      }
    });
  }
  
  // Clear triggers after processing
  ctx.nestedMemoryAttachmentTriggers.clear();
  
  return attachments;
}

/**
 * Generate CLAUDE.md attachment.
 * Original: v27 in chunks.131.mjs
 */
export async function generateClaudeMdAttachment(
  history: any[]
): Promise<Attachment[]> {
  // Source v27 returns []
  return [];
}

// ============================================
// Main Agent Generators
// ============================================

/**
 * Generate queued commands attachment.
 * Original: M27 in chunks.131.mjs
 */
export function generateQueuedCommandsAttachment(
  queuedCommands: any[]
): QueuedCommandAttachment[] {
  if (!queuedCommands) return [];
  
  return queuedCommands
    .filter((c) => c.mode === 'prompt')
    .map((c) => ({
      type: 'queued_command' as const,
      prompt: c.value,
      source_uuid: c.uuid,
      imagePasteIds: c.imagePasteIds
    }));
}

/**
 * Generate unified tasks attachment.
 * Original: A97 in chunks.132.mjs
 */
export async function generateUnifiedTasksAttachment(
  ctx: AttachmentContext,
  history: any[]
): Promise<Attachment[]> {
  const appState = await ctx.getAppState();
  if (!appState.tasks || appState.tasks.size === 0) return [];

  const attachments: Attachment[] = [];
  
  // Throttle progress updates (simulated)
  // let turnsSinceProgress = getTurnsSinceTaskProgress(history);

  for (const [taskId, task] of appState.tasks) {
    const taskData = task as any;
    
    // Status attachment
    attachments.push({
      type: 'task_status',
      taskId,
      taskType: taskData.type,
      status: taskData.status,
      description: taskData.description,
      deltaSummary: taskData.deltaSummary
    });
    
    // Progress attachment (throttled)
    if (taskData.message) {
      attachments.push({
        type: 'task_progress',
        taskId,
        taskType: taskData.type,
        message: taskData.message
      });
    }
  }
  
  return attachments;
}

/**
 * Generate async hook responses attachment.
 * Original: Q97 in chunks.132.mjs
 */
export async function generateAsyncHookResponsesAttachment(): Promise<Attachment[]> {
  // In real implementation, get pending hook responses
  return [];
}

/**
 * Generate token usage attachment.
 * Original: G97 in chunks.132.mjs
 */
export function generateTokenUsageAttachment(
  history: any[]
): TokenUsageAttachment[] {
  if (process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT !== 'true') return [];
  
  // In real implementation, calculate from history
  return [{
    type: 'token_usage',
    used: 1000,
    total: 200000,
    remaining: 199000
  }];
}

/**
 * Generate budget attachment.
 * Original: Z97 in chunks.132.mjs
 */
export function generateBudgetAttachment(
  maxBudgetUsd?: number
): BudgetAttachment[] {
  if (maxBudgetUsd === undefined) return [];
  
  return [{
    type: 'budget_usd',
    used: 0.5,
    total: maxBudgetUsd,
    remaining: maxBudgetUsd - 0.5
  }];
}

/**
 * Generate output style attachment.
 */
export function generateOutputStyleAttachment(
  ctx: AttachmentContext
): OutputStyleAttachment | null {
  const style = ctx.options.outputStyle;
  if (!style) return null;
  
  return {
    type: 'output_style',
    style
  };
}

/**
 * Generate todo reminders attachment.
 * Original: t27 in chunks.132.mjs
 */
export function generateTodoRemindersAttachment(
  history: any[],
  ctx: AttachmentContext
): TodoReminderAttachment[] {
  // Implementation from t27 logic: check turn count thresholds
  return [];
}

/**
 * Generate delegate mode exit attachment.
 * Original: S27 in chunks.131.mjs
 */
export function generateDelegateModeExitAttachment(): DelegateModeExitAttachment[] {
  // Logic from S27: check if just exited delegate mode
  return [{
    type: 'delegate_mode_exit'
  }];
}

/**
 * Generate IDE opened file attachment.
 */
export function generateOpenedFileInIdeAttachment(
  ideContext: any,
  ctx: AttachmentContext
): OpenedFileInIdeAttachment | null {
  if (!ideContext?.openedFile) return null;
  
  return {
    type: 'opened_file_in_ide',
    filename: ideContext.openedFile.filename
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

// NOTE: 函数已在声明处导出；移除重复聚合导出。
