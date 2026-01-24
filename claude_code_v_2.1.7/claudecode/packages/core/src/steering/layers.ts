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
export const SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;

/**
 * Plan mode reminder interval (full reminder every N turns).
 */
export const FULL_REMINDER_INTERVAL = 5;

/**
 * Read-only tools in plan mode.
 */
export const PLAN_MODE_READONLY_TOOLS = [
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
export const PLAN_MODE_BLOCKED_TOOLS = [
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
 * Wrap text in system-reminder tags.
 * Original: Yh in chunks.147.mjs:3212-3216
 */
export function wrapSystemReminderText(content: string): string {
  return `<system-reminder>\n${content}\n</system-reminder>`;
}

/**
 * Wrap all message content in system-reminder tags.
 * Original: q5 in chunks.147.mjs:3218-3245
 */
export function wrapInSystemReminder(messages: MessageWrapper[]): MessageWrapper[] {
  return messages.map((msg) => {
    if (typeof msg.message.content === 'string') {
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrapSystemReminderText(msg.message.content),
        },
      };
    } else if (Array.isArray(msg.message.content)) {
      const wrappedContent = msg.message.content.map((block: ContentBlock) => {
        if (block.type === 'text' && block.text) {
          return {
            ...block,
            text: wrapSystemReminderText(block.text),
          };
        }
        return block;
      });
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrappedContent,
        },
      };
    }
    return msg;
  });
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
 * Original: H0 in chunks.147.mjs:2410-2440
 */
export function createMetaBlock(options: {
  content: string | ContentBlock[];
  isMeta: boolean;
  isVisibleInTranscriptOnly?: boolean;
}): MessageWrapper {
  return {
    type: 'user',
    message: {
      role: 'user',
      content: options.content,
    },
    isMeta: options.isMeta,
    isVisibleInTranscriptOnly: options.isVisibleInTranscriptOnly,
    uuid: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Filter out meta messages for user display.
 */
export function filterMetaMessages(messages: MessageWrapper[]): MessageWrapper[] {
  return messages.filter((msg) => !msg.isMeta);
}

/**
 * Get only meta messages.
 */
export function getMetaMessages(messages: MessageWrapper[]): MessageWrapper[] {
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
): MessageWrapper[] {
  const messages: MessageWrapper[] = [];

  for (const injection of injections) {
    // Additional context
    if (injection.additionalContext && injection.additionalContext.length > 0) {
      const content = injection.additionalContext.join('\n');
      messages.push(
        createMetaBlock({
          content: wrapSystemReminderText(
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
          content: wrapSystemReminderText(injection.systemMessage),
          isMeta: true,
        })
      );
    }

    // Blocking error
    if (injection.blocking && injection.blockingError) {
      messages.push(
        createMetaBlock({
          content: wrapSystemReminderText(
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
): MessageWrapper[] {
  const reminderType = getPlanModeReminderType(state.turnIndex, state.isSubAgent);

  let content = '';
  switch (reminderType) {
    case 'full':
      content = buildFullPlanModeReminder(state);
      break;
    case 'sparse':
      content = buildSparsePlanModeReminder(state);
      break;
    case 'subagent':
      content = buildSubAgentPlanModeReminder(state);
      break;
    default:
      content = buildSparsePlanModeReminder(state);
  }

  return wrapInSystemReminder([
    createMetaBlock({
      content,
      isMeta: true,
    }),
  ]);
}

/**
 * Build full plan mode reminder.
 * Original: $$7 in chunks.147.mjs
 */
function buildFullPlanModeReminder(state: PlanModeState): string {
  let reminder = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${state.planExists ? `A plan file already exists at ${state.planFilePath}. You can read it and make incremental edits using the Edit tool.` : `No plan file exists yet. You should create your plan at ${state.planFilePath} using the Write tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Explore subagent type.

1. Focus on understanding the user's request and the code associated with their request

2. **Launch up to 3 Explore agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - 3 agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigates testing patterns

3. After exploring the code, use the AskUserQuestion tool to clarify ambiguities in the user request up front.

### Phase 2: Design
Goal: Design an implementation approach.

Launch Plan agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to 3 agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
- **Multiple agents**: Use up to 3 agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture

In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use AskUserQuestion to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### Phase 5: Call ExitPlanMode
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ExitPlanMode to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the AskUserQuestion tool OR calling ExitPlanMode. Do not stop unless it's for these 2 reasons

**Important:** Use AskUserQuestion ONLY to clarify requirements or choose between approaches. Use ExitPlanMode to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ExitPlanMode.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the AskUserQuestion tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;
  return reminder;
}

/**
 * Build sparse plan mode reminder.
 * Original: C$7 in chunks.147.mjs
 */
function buildSparsePlanModeReminder(state: PlanModeState): string {
  return `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${state.planFilePath}). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
}

/**
 * Build sub-agent plan mode reminder.
 * Original: U$7 in chunks.147.mjs
 */
function buildSubAgentPlanModeReminder(state: PlanModeState): string {
  return `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${state.planExists ? `A plan file already exists at ${state.planFilePath}. You can read it and make incremental edits using the Edit tool if you need to.` : `No plan file exists yet. You should create your plan at ${state.planFilePath} using the Write tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask the user clarifying questions. If you do use the AskUserQuestion, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
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
 * Original: VzA in chunks.135.mjs
 */
export function buildReadFileStateMapping(
  messages: MessageWrapper[],
  cwd: string
): ReadFileState {
  const state: ReadFileState = new Map();
  const readToolUseMap = new Map<string, string>();
  const writeToolUseMap = new Map<string, { filePath: string; content: string }>();

  // Pass 1: Collect Read and Write tool uses from assistant
  for (const message of messages) {
    if (message.type === 'assistant' && Array.isArray(message.message.content)) {
      for (const block of message.message.content) {
        if (block.type === 'tool_use') {
          if (block.name === 'Read') {
            const input = block.input as any;
            if (input?.file_path && input?.offset === undefined && input?.limit === undefined) {
              readToolUseMap.set(block.id!, input.file_path);
            }
          } else if (block.name === 'Write') {
            const input = block.input as any;
            if (input?.file_path && input?.content) {
              writeToolUseMap.set(block.id!, {
                filePath: input.file_path,
                content: input.content,
              });
            }
          }
        }
      }
    }
  }

  // Pass 2: Match results from user
  for (const message of messages) {
    if (message.type === 'user' && Array.isArray(message.message.content)) {
      for (const block of message.message.content) {
        if (block.type === 'tool_result' && block.tool_use_id) {
          const readPath = readToolUseMap.get(block.tool_use_id);
          if (readPath && typeof block.content === 'string') {
            const cleanedContent = block.content
              .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
              .split('\n')
              .map((line) => {
                const match = line.match(/^\s*\d+→(.*)$/);
                return match ? match[1] : line;
              })
              .join('\n')
              .trim();

            const timestamp = message.timestamp
              ? new Date(message.timestamp).getTime()
              : Date.now();

            state.set(readPath, {
              content: cleanedContent,
              timestamp,
              offset: undefined,
              limit: undefined,
            });
          }

          const writeData = writeToolUseMap.get(block.tool_use_id);
          if (writeData) {
            const timestamp = message.timestamp
              ? new Date(message.timestamp).getTime()
              : Date.now();

            state.set(writeData.filePath, {
              content: writeData.content,
              timestamp,
              offset: undefined,
              limit: undefined,
            });
          }
        }
      }
    }
  }

  return state;
}

/**
 * Merge read file state from multiple sources.
 * Original: MKA in chunks.86.mjs
 */
export function mergeReadFileState(
  base: ReadFileState,
  incoming: ReadFileState
): ReadFileState {
  const result = new Map(base);

  for (const [path, entry] of incoming) {
    const existing = result.get(path);
    if (!existing || entry.timestamp > existing.timestamp) {
      result.set(path, entry);
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
  messages: MessageWrapper[],
  userContext: UserContext
): MessageWrapper[] {
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
    content: wrapSystemReminderText(
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
  messages: MessageWrapper[],
  context: SteeringContext
): MessageWrapper[] {
  let result = [...messages];

  // Layer 1 & 2: User context injection (creates isMeta messages)
  result = injectUserContext(result, context.userContext);

  // Layer 5: Hook injections
  const hookMessages = processHookInjections(context.hookInjections);
  result = [...hookMessages, ...result];

  // Layer 6: Plan mode steering
  if (context.planMode.active) {
    const planModeMessages = buildPlanModeSystemReminder(context.planMode);
    result = [...planModeMessages, ...result];
  }

  return result;
}
