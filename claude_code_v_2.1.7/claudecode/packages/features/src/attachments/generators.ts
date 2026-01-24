/**
 * @claudecode/features - Attachment Generators
 * 
 * Individual attachment generator functions for the system reminder system.
 * Aligned with source:
 * - j27 (Plan Mode)
 * - t27 (Todo Reminder)
 * - M27 (Queued Commands)
 * - h27 (At-Mentioned Files)
 * - u27 (MCP Resources)
 * - g27 (Agent Mentions)
 * - A97 (Unified Tasks)
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
  AgentMentionAttachment,
  QueuedCommandAttachment,
  DelegateModeExitAttachment,
} from './types.js';

import { ATTACHMENT_CONSTANTS } from './types.js';

// ============================================
// History Analysis Helpers
// ============================================

/**
 * Check if an assistant message contains only thinking blocks.
 * Original: dF1 in chunks.148.mjs
 */
function isThinkingOnlyMessage(message: any): boolean {
  if (message.type !== 'assistant') return false;
  if (!Array.isArray(message.message?.content)) return false;
  return message.message.content.every((block: any) => block.type === 'thinking');
}

/**
 * Analyze plan mode history to determine turn count and previous attachments.
 * Original: R27 in chunks.131.mjs:3176
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
 * Original: _27 in chunks.131.mjs:3195
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

/**
 * Analyze todo history.
 * Original: s27 in chunks.132.mjs:96
 */
function analyzeTodoHistory(history: any[]): { turnsSinceLastTodoWrite: number; turnsSinceLastReminder: number } {
  let turnsSinceLastTodoWrite = 0;
  let turnsSinceLastReminder = 0;
  let foundWrite = false;
  let foundReminder = false;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg?.type === 'assistant') {
      if (isThinkingOnlyMessage(msg)) continue;
      
      if (!foundWrite && Array.isArray(msg.message?.content)) {
        if (msg.message.content.some((b: any) => b.type === 'tool_use' && b.name === 'TodoWrite')) {
          foundWrite = true;
        }
      }
      if (!foundWrite) turnsSinceLastTodoWrite++;
      if (!foundReminder) turnsSinceLastReminder++;
    } else if (!foundReminder && msg?.type === 'attachment' && msg.attachment.type === 'todo_reminder') {
      foundReminder = true;
    }
    
    if (foundWrite && foundReminder) break;
  }

  return { turnsSinceLastTodoWrite, turnsSinceLastReminder };
}

// ============================================
// Factory Helpers
// ============================================

/**
 * Generate todo attachment.
 */
export function generateTodoAttachment(todos: TodoItem[]): TodoAttachment {
  return {
    type: 'todo',
    content: todos,
    itemCount: todos.length,
  };
}

/**
 * Generate task status attachment.
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

/**
 * Generate invoked skills attachment.
 */
export function generateInvokedSkillsAttachment(
  skills: any[]
): InvokedSkillsAttachment[] {
  if (!skills || skills.length === 0) return [];
  return [
    {
      type: 'invoked_skills',
      skills: skills.map((s) => ({
        name: s.name,
        path: s.path,
        content: s.content,
      })),
    },
  ];
}

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

/**
 * Generate edited text file attachment.
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

/**
 * Alias for generateTodoRemindersAttachment.
 */
export const generateTodoReminderAttachment = generateTodoRemindersAttachment;

export interface GeneratorResult {
  attachment: Attachment | null;
  error?: Error;
}

// ============================================
// Plan Mode Generators
// ============================================

/**
 * Generate plan mode attachment.
 * Original: j27 in chunks.131.mjs:3207
 */
export async function generatePlanModeAttachment(
  history: any[],
  ctx: AttachmentContext
): Promise<Attachment[]> {
  const appState = await ctx.getAppState();
  if (appState.toolPermissionContext.mode !== 'plan') return [];

  if (history && history.length > 0) {
    const { turnCount, foundPlanModeAttachment } = analyzePlanModeHistory(history);
    if (foundPlanModeAttachment && turnCount < ATTACHMENT_CONSTANTS.TURNS_BETWEEN_PLAN_ATTACHMENTS) {
      return [];
    }
  }

  const planFilePath = `/Users/bytedance/codespace/myapp/analysis_claude_code_v2/plan-${ctx.agentId || 'main'}.md`; // Simulated dC()
  const planExists = true; // Simulated AK() !== null
  
  const attachments: Attachment[] = [];

  // Plan Mode Reentry (if just entered)
  // Simulated Xf0() && Y !== null
  if (false) {
    attachments.push({
      type: 'plan_mode_reentry',
      planFilePath
    });
  }

  // Determine reminder type (full or sparse)
  const attachmentCount = countPlanModeAttachments(history ?? []);
  const reminderType = (attachmentCount + 1) % ATTACHMENT_CONSTANTS.FULL_PLAN_REMINDER_EVERY_N === 1 ? 'full' : 'sparse';

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
 * Original: T27 in chunks.131.mjs:3233
 */
export async function generatePlanModeExitAttachment(
  ctx: AttachmentContext
): Promise<Attachment[]> {
  const appState = await ctx.getAppState();
  if (appState.toolPermissionContext.mode === 'plan') return [];

  const planFilePath = `/Users/bytedance/codespace/myapp/analysis_claude_code_v2/plan-${ctx.agentId || 'main'}.md`;
  const planExists = true;

  return [{
    type: 'plan_mode_exit',
    planFilePath,
    planExists,
  }];
}

// ============================================
// Todo Generators
// ============================================

/**
 * Generate todo reminders attachment.
 * Original: t27 in chunks.132.mjs:117
 */
export async function generateTodoRemindersAttachment(
  history: any[],
  ctx: AttachmentContext
): Promise<TodoReminderAttachment[]> {
  // Check if TodoWrite tool is available
  // if (!ctx.options.tools.some(t => t.name === 'TodoWrite')) return [];

  if (!history || history.length === 0) return [];

  const { turnsSinceLastTodoWrite, turnsSinceLastReminder } = analyzeTodoHistory(history);

  if (
    turnsSinceLastTodoWrite >= ATTACHMENT_CONSTANTS.TODO_TURNS_SINCE_WRITE &&
    turnsSinceLastReminder >= ATTACHMENT_CONSTANTS.TODO_TURNS_BETWEEN_REMINDERS
  ) {
    const appState = await ctx.getAppState();
    const agentId = ctx.agentId || 'main';
    const todos = appState.todos[agentId] || [];
    
    return [{
      type: 'todo_reminder',
      content: todos,
      itemCount: todos.length
    }];
  }

  return [];
}

// ============================================
// Core Generators
// ============================================

/**
 * Generate critical system reminder attachment.
 * Original: x27 in chunks.131.mjs:3265
 */
export function generateCriticalSystemReminderAttachment(
  ctx: AttachmentContext
): CriticalSystemReminderAttachment[] {
  const reminder = ctx.options.criticalSystemReminder_EXPERIMENTAL;
  if (!reminder) return [];
  return [{
    type: 'critical_system_reminder',
    content: reminder
  }];
}

/**
 * Generate delegate mode attachment.
 * Original: P27 in chunks.131.mjs:3246
 */
export async function generateDelegateModeAttachment(
  ctx: AttachmentContext
): Promise<DelegateModeAttachment[]> {
  const appState = await ctx.getAppState();
  if (appState.toolPermissionContext.mode !== 'delegate') return [];
  if (!appState.teamContext) return [];
  
  const home = process.env.HOME || '.';
  const taskListPath = `${home}/.claude/tasks/${appState.teamContext.teamName}/`;
  
  return [{
    type: 'delegate_mode',
    teamName: appState.teamContext.teamName,
    taskListPath
  }];
}

/**
 * Generate delegate mode exit attachment.
 * Original: S27 in chunks.131.mjs:3258 (approx)
 */
export function generateDelegateModeExitAttachment(): DelegateModeExitAttachment[] {
  // Logic from S27: returns [{ type: 'delegate_mode_exit' }]
  return [{
    type: 'delegate_mode_exit'
  }];
}

/**
 * Generate nested memory attachment.
 * Original: d27 in chunks.131.mjs:3301 (approx)
 */
export async function generateNestedMemoryAttachment(
  ctx: AttachmentContext
): Promise<Attachment[]> {
  if (!ctx.nestedMemoryAttachmentTriggers || ctx.nestedMemoryAttachmentTriggers.size === 0) {
    return [];
  }

  const attachments: Attachment[] = [];
  for (const path of ctx.nestedMemoryAttachmentTriggers) {
    attachments.push({
      type: 'nested_memory',
      path,
      content: {
        type: 'text',
        path,
        content: 'Simulated nested memory content'
      }
    });
  }
  
  ctx.nestedMemoryAttachmentTriggers.clear();
  return attachments;
}

/**
 * Generate collab notification attachment.
 * Original: B97 in chunks.132.mjs:223
 */
export function generateCollabNotificationAttachment(chats: any[]): CollabNotificationAttachment[] {
  // Source B97 returns []
  return [];
}

// ============================================
// Main Agent Generators
// ============================================

/**
 * Generate memory attachment.
 * Original: mr2 in chunks.131.mjs:3073
 */
export async function generateMemoryAttachment(
  ctx: AttachmentContext,
  history: any[],
  additionalParam?: any
): Promise<MemoryAttachment[]> {
  if (additionalParam !== 'repl_main_thread') return [];
  return [];
}

/**
 * Generate queued commands attachment.
 * Original: M27 in chunks.131.mjs:3166
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
 * Original: A97 in chunks.132.mjs:151
 */
export async function generateUnifiedTasksAttachment(
  ctx: AttachmentContext,
  history: any[]
): Promise<Attachment[]> {
  const appState = await ctx.getAppState();
  if (!appState.tasks || appState.tasks.size === 0) return [];

  const attachments: Attachment[] = [];
  
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
    
    // Progress attachment (throttled by w27)
    // Simplified logic for now
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
 * Original: Q97 in chunks.132.mjs:190
 */
export async function generateAsyncHookResponsesAttachment(): Promise<Attachment[]> {
  // Logic from Q97: reads from hook registry
  return [];
}

/**
 * Generate token usage attachment.
 * Original: G97 in chunks.132.mjs:227
 */
export function generateTokenUsageAttachment(
  history: any[]
): TokenUsageAttachment[] {
  if (process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT !== 'true') return [];
  
  // Logic from G97: uses q3A() (max) and sH(history) (used)
  return [{
    type: 'token_usage',
    used: 1234,
    total: 200000,
    remaining: 200000 - 1234
  }];
}

/**
 * Generate budget attachment.
 * Original: Z97 in chunks.132.mjs:239
 */
export function generateBudgetAttachment(
  maxBudgetUsd?: number
): BudgetAttachment[] {
  if (maxBudgetUsd === undefined) return [];
  
  // Logic from Z97: uses $H() (used)
  return [{
    type: 'budget_usd',
    used: 0.1,
    total: maxBudgetUsd,
    remaining: maxBudgetUsd - 0.1
  }];
}

/**
 * Generate verify plan reminder attachment.
 * Original: J97 in chunks.132.mjs:274
 */
export async function generateVerifyPlanReminderAttachment(
  history: any[],
  ctx: AttachmentContext
): Promise<Attachment[]> {
  // Source J97 returns []
  return [];
}

/**
 * Generate diagnostics attachment.
 */
export async function generateDiagnosticsAttachment(): Promise<DiagnosticsAttachment[]> {
  return [];
}

/**
 * Generate LSP diagnostics attachment.
 */
export async function generateLspDiagnosticsAttachment(): Promise<DiagnosticsAttachment[]> {
  return [];
}

/**
 * Generate IDE selection attachment.
 */
export async function generateIdeSelectionAttachment(
  ideContext: any,
  ctx: AttachmentContext
): Promise<IdeSelectionAttachment[]> {
  if (!ideContext?.selection) return [];
  const s = ideContext.selection;
  return [{
    type: 'selected_lines_in_ide',
    ideName: s.ideName,
    lineStart: s.lineStart,
    lineEnd: s.lineEnd,
    filename: s.filename,
    content: s.content
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

// ============================================
// User Prompt Generators
// ============================================

/**
 * Generate at-mentioned files attachment.
 * Original: h27 in chunks.131.mjs:3322 (approx)
 */
export async function generateAtMentionedFilesAttachment(
  userPrompt: string,
  ctx: AttachmentContext
): Promise<Attachment[]> {
  // Logic from h27: parses @mentions and reads files
  return [];
}

/**
 * Generate MCP resource attachment.
 * Original: u27 in chunks.131.mjs:3350 (approx)
 */
export async function generateMcpResourcesAttachment(
  userPrompt: string,
  ctx: AttachmentContext
): Promise<Attachment[]> {
  // Logic from u27: parses @uri mentions and reads resources
  return [];
}

/**
 * Generate agent mentions attachment.
 * Original: g27 in chunks.131.mjs:3380 (approx)
 */
export function generateAgentMentionsAttachment(
  userPrompt: string,
  activeAgents: Array<{ type: string; name: string }>
): AgentMentionAttachment[] {
  // Logic from g27: parses @agent mentions
  return [];
}

// ============================================
// Core Generators (User Prompt Related)
// ============================================

/**
 * Generate changed files attachment.
 * Original: m27 in chunks.131.mjs:3310 (approx)
 */
export function generateChangedFilesAttachment(
  ctx: AttachmentContext,
  currentFiles: Map<string, { content: string; timestamp: number }>
): EditedTextFileAttachment[] {
  // Logic from m27: compares current files with readFileState
  return [];
}
