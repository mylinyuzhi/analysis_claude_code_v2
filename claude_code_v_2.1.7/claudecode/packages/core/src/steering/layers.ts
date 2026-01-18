/**
 * @claudecode/core - Steering Layers Implementation
 *
 * Implementation of the 8-layer steering system.
 *
 * Reconstructed from:
 * - chunks.91.mjs (system reminder extraction, filtering)
 * - chunks.133.mjs (user context injection)
 * - chunks.134.mjs (tool execution context)
 * - chunks.147.mjs (plan mode steering)
 *
 * Key symbols:
 * - mI0 → extractSystemReminder
 * - SG5 → filterSystemReminderMessages
 * - _3A → injectUserContext
 * - H0 → createMetaBlock
 * - KM0 → serialExecutionContextFlow
 * - z$7 → buildPlanModeSystemReminder
 * - VzA → buildReadFileStateMapping
 * - MKA → mergeReadFileState
 */

import type {
  SystemReminderResult,
  UserContext,
  SteeringMessage,
  MessageWrapper,
  ContentBlock,
  ExecutionContextFlow,
  ContextUpdate,
  AppendSystemPromptOptions,
  HookInjectionResult,
  PlanModeState,
  PlanModeReminderType,
  PlanModeToolRestrictions,
  PermissionModeContext,
  ReadFileState,
  ReadFileStateEntry,
  ReadFileStateMergeOptions,
  SteeringContext,
} from './types.js';

// ============================================
// Constants
// ============================================

/**
 * Regex for extracting system reminder content.
 * Original: PG5 in chunks.91.mjs:3581
 */
const SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;

/**
 * Plan mode reminder interval (full reminder every N turns).
 */
const FULL_REMINDER_INTERVAL = 5;

/**
 * Read-only tools in plan mode.
 */
const PLAN_MODE_READONLY_TOOLS = [
  'Read',
  'Glob',
  'Grep',
  'WebFetch',
  'WebSearch',
  'Task',
];

/**
 * Blocked tools in plan mode.
 */
const PLAN_MODE_BLOCKED_TOOLS = [
  'Write',
  'Edit',
  'Bash',
  'NotebookEdit',
];

// ============================================
// Layer 1: System Reminder Injection
// ============================================

/**
 * Extract content from system-reminder tags.
 * Original: mI0 in chunks.91.mjs:3368-3371
 */
export function extractSystemReminder(content: string): string | null {
  const match = content.trim().match(SYSTEM_REMINDER_REGEX);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * Wrap content in system-reminder tags.
 * Original: q5 in chunks.131.mjs
 */
export function wrapInSystemReminder(content: string): string {
  return `<system-reminder>\n${content}\n</system-reminder>`;
}

/**
 * Check if content has system reminder tags.
 */
export function hasSystemReminder(content: string): boolean {
  return content.includes('<system-reminder>');
}

/**
 * Filter messages into system reminders and regular content.
 * Original: SG5 in chunks.91.mjs:3373-3403
 */
export function filterSystemReminderMessages(
  messages: MessageWrapper[]
): SystemReminderResult {
  const contextParts: string[] = [];
  const systemReminders: string[] = [];

  for (const wrapper of messages) {
    const content = wrapper.message.content;

    if (typeof content === 'string') {
      const extracted = extractSystemReminder(content);
      if (extracted) {
        systemReminders.push(extracted);
      } else {
        contextParts.push(`[USER]\n${content}`);
      }
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'text' && block.text) {
          const extracted = extractSystemReminder(block.text);
          if (extracted) {
            systemReminders.push(extracted);
          } else {
            contextParts.push(`[USER]\n${block.text}`);
          }
        } else if (block.type === 'tool_result') {
          const toolContent =
            typeof block.content === 'string'
              ? block.content
              : JSON.stringify(block.content);
          const extracted = extractSystemReminder(toolContent);
          if (extracted) {
            systemReminders.push(extracted);
          } else {
            contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${toolContent}`);
          }
        }
      }
    }
  }

  return { contextParts, systemReminders };
}

// ============================================
// Layer 2: isMeta Property (Hidden Messages)
// ============================================

/**
 * Create a meta message block.
 * Original: H0 in chunks.147.mjs
 */
export function createMetaBlock(options: {
  content: string;
  isMeta: boolean;
}): SteeringMessage {
  return {
    role: 'user',
    content: options.content,
    isMeta: options.isMeta,
  };
}

/**
 * Filter out meta messages for user display.
 */
export function filterMetaMessages(messages: SteeringMessage[]): SteeringMessage[] {
  return messages.filter((msg) => !msg.isMeta);
}

/**
 * Get only meta messages.
 */
export function getMetaMessages(messages: SteeringMessage[]): SteeringMessage[] {
  return messages.filter((msg) => msg.isMeta);
}

// ============================================
// Layer 3: Context Modifiers
// ============================================

/**
 * Initialize execution context flow.
 */
export function initExecutionContextFlow(): ExecutionContextFlow {
  return {
    toolState: new Map(),
    mode: 'concurrent',
    pendingUpdates: [],
  };
}

/**
 * Update execution context for serial execution.
 * Original: KM0 in chunks.134.mjs
 */
export function serialExecutionContextFlow(
  flow: ExecutionContextFlow,
  toolName: string,
  status: 'running' | 'completed' | 'failed',
  result?: unknown,
  error?: Error
): ExecutionContextFlow {
  const newToolState = new Map(flow.toolState);

  if (status === 'running') {
    newToolState.set(toolName, {
      toolName,
      startTime: Date.now(),
      status: 'running',
    });
  } else {
    const existing = newToolState.get(toolName);
    if (existing) {
      newToolState.set(toolName, {
        ...existing,
        status,
        result,
        error,
      });
    }
  }

  return {
    ...flow,
    toolState: newToolState,
  };
}

/**
 * Apply pending context updates.
 */
export function applyContextUpdates(
  context: Record<string, unknown>,
  updates: ContextUpdate[]
): Record<string, unknown> {
  const result = { ...context };

  for (const update of updates) {
    switch (update.type) {
      case 'add':
        result[update.key] = update.value;
        break;
      case 'remove':
        delete result[update.key];
        break;
      case 'modify':
        if (update.key in result) {
          result[update.key] = update.value;
        }
        break;
    }
  }

  return result;
}

// ============================================
// Layer 4: Append System Prompt
// ============================================

/**
 * Build append system prompt content.
 */
export async function buildAppendSystemPrompt(
  options: AppendSystemPromptOptions
): Promise<string | null> {
  const parts: string[] = [];

  // Direct text
  if (options.appendSystemPrompt) {
    parts.push(options.appendSystemPrompt);
  }

  // File content
  if (options.appendSystemPromptFile) {
    try {
      // In real implementation, read from file system
      // const content = await fs.readFile(options.appendSystemPromptFile, 'utf-8');
      // parts.push(content);
    } catch {
      // Ignore file read errors
    }
  }

  return parts.length > 0 ? parts.join('\n\n') : null;
}

// ============================================
// Layer 5: Hook-Based Injection
// ============================================

/**
 * Process hook injection results into messages.
 */
export function processHookInjections(
  injections: HookInjectionResult[]
): SteeringMessage[] {
  const messages: SteeringMessage[] = [];

  for (const injection of injections) {
    // Additional context
    if (injection.additionalContext && injection.additionalContext.length > 0) {
      const content = injection.additionalContext.join('\n');
      messages.push(
        createMetaBlock({
          content: wrapInSystemReminder(
            `Hook "${injection.hookName}" (${injection.event}) context:\n${content}`
          ),
          isMeta: true,
        })
      );
    }

    // System message
    if (injection.systemMessage) {
      messages.push(
        createMetaBlock({
          content: wrapInSystemReminder(injection.systemMessage),
          isMeta: true,
        })
      );
    }

    // Blocking error
    if (injection.blocking && injection.blockingError) {
      messages.push(
        createMetaBlock({
          content: wrapInSystemReminder(
            `Hook "${injection.hookName}" blocked operation:\n${injection.blockingError}`
          ),
          isMeta: true,
        })
      );
    }
  }

  return messages;
}

// ============================================
// Layer 6: Plan Mode Steering
// ============================================

/**
 * Determine plan mode reminder type.
 * Original: Part of z$7 in chunks.147.mjs
 */
export function getPlanModeReminderType(
  turnIndex: number,
  isSubAgent: boolean
): PlanModeReminderType {
  if (isSubAgent) {
    return 'subagent';
  }
  return turnIndex % FULL_REMINDER_INTERVAL === 0 ? 'full' : 'sparse';
}

/**
 * Build plan mode system reminder.
 * Original: z$7 in chunks.147.mjs
 */
export function buildPlanModeSystemReminder(
  state: PlanModeState
): string {
  const reminderType = getPlanModeReminderType(state.turnIndex, state.isSubAgent);

  switch (reminderType) {
    case 'full':
      return buildFullPlanModeReminder(state);
    case 'sparse':
      return buildSparsePlanModeReminder(state);
    case 'subagent':
      return buildSubAgentPlanModeReminder(state);
    default:
      return buildSparsePlanModeReminder(state);
  }
}

/**
 * Build full plan mode reminder.
 * Original: $$7 in chunks.147.mjs
 */
function buildFullPlanModeReminder(state: PlanModeState): string {
  let reminder = `You are in PLAN MODE.

In plan mode, you should:
1. Explore the codebase to understand the structure
2. Design an implementation approach
3. Write your plan to ${state.planFilePath}
4. Use ExitPlanMode when ready for user approval

You have access to read-only tools: Read, Glob, Grep, WebFetch, WebSearch, Task
You CANNOT use: Write, Edit, Bash (except for read-only commands)

`;

  if (state.planExists) {
    reminder += `A plan file exists at ${state.planFilePath}. Review and update it as needed.`;
  } else {
    reminder += `No plan file exists yet. Create one at ${state.planFilePath} to outline your approach.`;
  }

  return reminder;
}

/**
 * Build sparse plan mode reminder.
 * Original: C$7 in chunks.147.mjs
 */
function buildSparsePlanModeReminder(state: PlanModeState): string {
  return `PLAN MODE active. Plan file: ${state.planFilePath}. Use ExitPlanMode when ready.`;
}

/**
 * Build sub-agent plan mode reminder.
 * Original: U$7 in chunks.147.mjs
 */
function buildSubAgentPlanModeReminder(state: PlanModeState): string {
  return `You are a sub-agent in PLAN MODE. Research and gather information for the plan. Report findings to the main agent.`;
}

/**
 * Get plan mode tool restrictions.
 */
export function getPlanModeToolRestrictions(): PlanModeToolRestrictions {
  return {
    allowedTools: [...PLAN_MODE_READONLY_TOOLS, 'ExitPlanMode', 'AskUserQuestion'],
    readOnlyTools: PLAN_MODE_READONLY_TOOLS,
    blockedTools: PLAN_MODE_BLOCKED_TOOLS,
  };
}

/**
 * Check if tool is allowed in plan mode.
 */
export function isToolAllowedInPlanMode(toolName: string): boolean {
  const restrictions = getPlanModeToolRestrictions();
  return (
    restrictions.allowedTools.includes(toolName) ||
    restrictions.readOnlyTools.includes(toolName)
  );
}

// ============================================
// Layer 7: Permission Mode Context
// ============================================

/**
 * Check if operation should auto-allow based on permission mode.
 */
export function shouldAutoAllow(
  context: PermissionModeContext,
  planModeActive: boolean
): boolean {
  // Always allow in bypass mode
  if (context.mode === 'bypassPermissions') {
    return true;
  }

  // Auto-allow in plan mode if bypass is available
  if (planModeActive && context.autoAllowInPlanMode && context.bypassAvailable) {
    return true;
  }

  // Accept edits mode
  if (context.mode === 'acceptEdits') {
    return true;
  }

  // Don't ask mode
  if (context.mode === 'dontAsk') {
    return true;
  }

  return false;
}

/**
 * Get permission mode from context.
 */
export function getEffectivePermissionMode(
  context: PermissionModeContext,
  planModeActive: boolean
): string {
  if (planModeActive) {
    return 'plan';
  }
  return context.mode;
}

// ============================================
// Layer 8: Read File State
// ============================================

/**
 * Build read file state mapping.
 * Original: VzA in chunks.134.mjs
 */
export function buildReadFileStateMapping(
  messages: MessageWrapper[]
): ReadFileState {
  const state: ReadFileState = new Map();

  for (const wrapper of messages) {
    // Extract file read information from tool results
    const content = wrapper.message.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'tool_result' && block.content) {
          // Parse tool result for file content
          const fileInfo = extractFileInfoFromToolResult(block);
          if (fileInfo) {
            state.set(fileInfo.path, {
              content: fileInfo.content,
              timestamp: Date.now(),
              offset: fileInfo.offset,
              limit: fileInfo.limit,
            });
          }
        }
      }
    }
  }

  return state;
}

/**
 * Extract file info from tool result.
 */
function extractFileInfoFromToolResult(block: ContentBlock): {
  path: string;
  content: string;
  offset?: number;
  limit?: number;
} | null {
  // In real implementation, parse the tool result content
  // to extract file path and content
  return null;
}

/**
 * Merge read file state from multiple sources.
 * Original: MKA in chunks.134.mjs
 */
export function mergeReadFileState(
  base: ReadFileState,
  incoming: ReadFileState,
  options: ReadFileStateMergeOptions = { preferNewer: true, mergePartialReads: false }
): ReadFileState {
  const result = new Map(base);

  for (const [path, entry] of incoming) {
    const existing = result.get(path);

    if (!existing) {
      // New entry
      result.set(path, entry);
    } else if (options.preferNewer && entry.timestamp > existing.timestamp) {
      // Newer entry replaces
      result.set(path, entry);
    } else if (options.mergePartialReads) {
      // Merge partial reads (combine content from different offsets)
      // This is a simplified implementation
      result.set(path, {
        ...existing,
        content: existing.content, // In real impl, merge content
        timestamp: Math.max(existing.timestamp, entry.timestamp),
      });
    }
  }

  return result;
}

/**
 * Check if file was read before write/edit.
 */
export function wasFileRead(state: ReadFileState, filePath: string): boolean {
  return state.has(filePath);
}

/**
 * Get file content from read state.
 */
export function getReadFileContent(
  state: ReadFileState,
  filePath: string
): string | null {
  const entry = state.get(filePath);
  return entry ? entry.content : null;
}

// ============================================
// Combined Steering
// ============================================

/**
 * Inject user context into messages.
 * Original: _3A in chunks.133.mjs:2585-2599
 */
export function injectUserContext(
  messages: SteeringMessage[],
  userContext: UserContext
): SteeringMessage[] {
  const entries = Object.entries(userContext).filter(
    ([_, value]) => value !== undefined
  );

  if (entries.length === 0) {
    return messages;
  }

  const contextSections = entries
    .map(([key, value]) => `# ${key}\n${value}`)
    .join('\n');

  const reminderMessage = createMetaBlock({
    content: wrapInSystemReminder(
      `As you answer the user's questions, you can use the following context:\n${contextSections}\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.`
    ),
    isMeta: true,
  });

  return [reminderMessage, ...messages];
}

/**
 * Apply all steering layers to messages.
 */
export function applySteeringLayers(
  messages: SteeringMessage[],
  context: SteeringContext
): SteeringMessage[] {
  let result = [...messages];

  // Layer 1 & 2: User context injection (creates isMeta messages)
  result = injectUserContext(result, context.userContext);

  // Layer 4: Append system prompt
  // (handled separately in prompt building)

  // Layer 5: Hook injections
  const hookMessages = processHookInjections(context.hookInjections);
  result = [...hookMessages, ...result];

  // Layer 6: Plan mode steering
  if (context.planMode.active) {
    const planReminder = buildPlanModeSystemReminder(context.planMode);
    result = [
      createMetaBlock({
        content: wrapInSystemReminder(planReminder),
        isMeta: true,
      }),
      ...result,
    ];
  }

  return result;
}

// ============================================
// Export
// ============================================

export {
  // Constants
  SYSTEM_REMINDER_REGEX,
  FULL_REMINDER_INTERVAL,
  PLAN_MODE_READONLY_TOOLS,
  PLAN_MODE_BLOCKED_TOOLS,

  // Layer 1: System Reminder
  extractSystemReminder,
  wrapInSystemReminder,
  hasSystemReminder,
  filterSystemReminderMessages,

  // Layer 2: Meta Messages
  createMetaBlock,
  filterMetaMessages,
  getMetaMessages,

  // Layer 3: Context Modifiers
  initExecutionContextFlow,
  serialExecutionContextFlow,
  applyContextUpdates,

  // Layer 4: Append System Prompt
  buildAppendSystemPrompt,

  // Layer 5: Hook Injection
  processHookInjections,

  // Layer 6: Plan Mode
  getPlanModeReminderType,
  buildPlanModeSystemReminder,
  getPlanModeToolRestrictions,
  isToolAllowedInPlanMode,

  // Layer 7: Permission Mode
  shouldAutoAllow,
  getEffectivePermissionMode,

  // Layer 8: Read File State
  buildReadFileStateMapping,
  mergeReadFileState,
  wasFileRead,
  getReadFileContent,

  // Combined
  injectUserContext,
  applySteeringLayers,
};
