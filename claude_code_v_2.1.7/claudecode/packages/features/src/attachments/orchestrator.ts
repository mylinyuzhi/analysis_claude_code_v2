/**
 * @claudecode/features - Attachment Orchestrator
 *
 * Main orchestration for generating all attachments with timeout handling.
 *
 * Reconstructed from chunks.131.mjs, chunks.132.mjs
 *
 * Key symbols:
 * - O27 → generateAllAttachments (main orchestrator)
 * - fJ → wrapWithErrorHandling
 */

import type {
  Attachment,
  AttachmentContext,
  AttachmentMessage,
  TodoItem,
  ATTACHMENT_CONSTANTS,
} from './types.js';

import {
  generateTodoAttachment,
  generateTodoReminderAttachment,
  generateTodoRemindersAttachment,
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
  generateDelegateModeAttachment,
  generateDelegateModeExitAttachment,
  generateMemoryAttachment,
  generateTaskStatusAttachment,
  generateDiagnosticsAttachment,
  generateLspDiagnosticsAttachment,
  generateIdeSelectionAttachment,
  generateOpenedFileInIdeAttachment,
  generateOutputStyleAttachment,
  generateTokenUsageAttachment,
  generateBudgetAttachment,
  generateInvokedSkillsAttachment,
  generateCriticalSystemReminderAttachment,
  generateChangedFilesAttachment,
  generateAtMentionedFilesAttachment,
  generateMcpResourcesAttachment,
  generateAgentMentionsAttachment,
  generateNestedMemoryAttachment,
  generateCollabNotificationAttachment,
  generateQueuedCommandsAttachment,
  generateUnifiedTasksAttachment,
  generateAsyncHookResponsesAttachment,
  generateVerifyPlanReminderAttachment,
} from './generators.js';

// ============================================
// Types
// ============================================

export interface AttachmentGenerationResult {
  attachments: Attachment[];
  errors: Array<{ generator: string; error: Error }>;
  timedOut: boolean;
  durationMs: number;
}

export interface GeneratorConfig {
  name: string;
  generator: () => Promise<Attachment | Attachment[] | null>;
  priority: number; // Lower = higher priority
}

// ============================================
// Constants
// ============================================

const GENERATION_TIMEOUT_MS = 1000;
const TELEMETRY_SAMPLE_RATE = 0.05;

// ============================================
// Error Handling Wrapper
// ============================================

/**
 * Wrap a generator with error handling.
 * Original: fJ in chunks.131.mjs
 */
export async function wrapWithErrorHandling<T>(
  name: string,
  generator: () => Promise<T>
): Promise<{ result: T | null; error: Error | null }> {
  try {
    const result = await generator();
    return { result, error: null };
  } catch (error) {
    // Log error for telemetry sampling
    if (Math.random() < TELEMETRY_SAMPLE_RATE) {
      console.error(`[Attachment] Generator "${name}" failed:`, error);
    }
    return {
      result: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// ============================================
// Main Orchestrator
// ============================================

/**
 * Generate all attachments with timeout handling.
 * Original: O27 in chunks.131.mjs
 *
 * @param userPrompt - User's input text (null if no user input)
 * @param context - Tool use context with agentId, options, readFileState, etc.
 * @param ideContext - IDE context (selection, opened file)
 * @param queuedCommands - Commands queued from hooks or async systems
 * @param conversationHistory - Array of previous messages
 * @param additionalParam - Additional parameter
 */
export async function generateAllAttachments(
  userPrompt: string | null,
  context: AttachmentContext,
  ideContext: any,
  queuedCommands: any[],
  conversationHistory: any[],
  additionalParam?: any
): Promise<AttachmentGenerationResult> {
  const startTime = Date.now();
  const attachments: Attachment[] = [];
  const errors: Array<{ generator: string; error: Error }> = [];
  let timedOut = false;

  // Create abort controller for timeout (1 second max for all attachments)
  const abortController = context.abortController ?? new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
    timedOut = true;
  }, GENERATION_TIMEOUT_MS);

  try {
    // Step 1: Check if attachments are globally disabled
    if (process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS === 'true') {
      return { attachments: [], errors: [], timedOut: false, durationMs: 0 };
    }

    // Step 2: Determine if this is the main agent (vs sub-agent)
    const isMainAgent = !context.agentId;

    // Step 3: Generate USER PROMPT ATTACHMENTS (only if user provided input)
    const userPromptGenerators = userPrompt ? [
      wrapWithErrorHandling('at_mentioned_files', () =>
        generateAtMentionedFilesAttachment(userPrompt, context)
      ),
      wrapWithErrorHandling('mcp_resources', () =>
        generateMcpResourcesAttachment(userPrompt, context)
      ),
      wrapWithErrorHandling('agent_mentions', () =>
        Promise.resolve(generateAgentMentionsAttachment(userPrompt, context.options.agentDefinitions?.activeAgents || []))
      )
    ] : [];

    // Wait for user prompt attachments to complete
    const userPromptResults = await Promise.all(userPromptGenerators);
    for (const { result, error } of userPromptResults) {
      if (error) errors.push({ generator: 'user_prompt', error });
      if (result) {
        if (Array.isArray(result)) attachments.push(...result);
        else attachments.push(result);
      }
    }

    // Step 4: Generate CORE ATTACHMENTS (always checked, available to all agents)
    const coreGenerators = [
      wrapWithErrorHandling('changed_files', () =>
        Promise.resolve(generateChangedFilesAttachment(context, new Map()))
      ),
      wrapWithErrorHandling('nested_memory', () =>
        generateNestedMemoryAttachment(context)
      ),
      wrapWithErrorHandling('plan_mode', () =>
        generatePlanModeAttachment(conversationHistory, context)
      ),
      wrapWithErrorHandling('plan_mode_exit', () =>
        generatePlanModeExitAttachment(context)
      ),
      wrapWithErrorHandling('delegate_mode', () =>
        generateDelegateModeAttachment(context)
      ),
      wrapWithErrorHandling('delegate_mode_exit', () =>
        Promise.resolve(generateDelegateModeExitAttachment())
      ),
      wrapWithErrorHandling('todo_reminders', () =>
        Promise.resolve(generateTodoRemindersAttachment(conversationHistory, context))
      ),
      wrapWithErrorHandling('collab_notification', async () =>
        generateCollabNotificationAttachment([])
      ),
      wrapWithErrorHandling('critical_system_reminder', () =>
        Promise.resolve(generateCriticalSystemReminderAttachment(context))
      )
    ];

    // Step 5: Generate MAIN AGENT ONLY ATTACHMENTS (only for primary agent)
    const mainAgentGenerators = isMainAgent ? [
      wrapWithErrorHandling('ide_selection', async () =>
        generateIdeSelectionAttachment(ideContext, context)
      ),
      wrapWithErrorHandling('ide_opened_file', async () =>
        generateOpenedFileInIdeAttachment(ideContext, context)
      ),
      wrapWithErrorHandling('output_style', async () =>
        Promise.resolve(generateOutputStyleAttachment(context))
      ),
      wrapWithErrorHandling('queued_commands', async () =>
        generateQueuedCommandsAttachment(queuedCommands)
      ),
      wrapWithErrorHandling('diagnostics', async () =>
        generateDiagnosticsAttachment()
      ),
      wrapWithErrorHandling('lsp_diagnostics', async () =>
        generateLspDiagnosticsAttachment()
      ),
      wrapWithErrorHandling('unified_tasks', async () =>
        generateUnifiedTasksAttachment(context, conversationHistory)
      ),
      wrapWithErrorHandling('async_hook_responses', async () =>
        generateAsyncHookResponsesAttachment()
      ),
      wrapWithErrorHandling('memory', async () =>
        generateMemoryAttachment(context, conversationHistory, additionalParam)
      ),
      wrapWithErrorHandling('token_usage', async () =>
        Promise.resolve(generateTokenUsageAttachment(conversationHistory))
      ),
      wrapWithErrorHandling('budget_usd', async () =>
        Promise.resolve(generateBudgetAttachment(context.options.maxBudgetUsd))
      ),
      wrapWithErrorHandling('verify_plan_reminder', async () =>
        generateVerifyPlanReminderAttachment(conversationHistory, context)
      )
    ] : [];

    // Execute all core and main agent generators in parallel
    const [coreResults, mainAgentResults] = await Promise.all([
      Promise.all(coreGenerators),
      Promise.all(mainAgentGenerators)
    ]);

    // Flatten and combine all attachments
    for (const { result, error } of coreResults) {
      if (error) errors.push({ generator: 'core', error });
      if (result) {
        if (Array.isArray(result)) attachments.push(...result);
        else attachments.push(result);
      }
    }

    for (const { result, error } of mainAgentResults) {
      if (error) errors.push({ generator: 'main_agent', error });
      if (result) {
        if (Array.isArray(result)) attachments.push(...result);
        else attachments.push(result);
      }
    }

  } finally {
    clearTimeout(timeoutId);
  }

  return {
    attachments,
    errors,
    timedOut,
    durationMs: Date.now() - startTime,
  };
}

/**
 * Build list of generators based on current state.
 */
export function buildGeneratorList(
  ctx: AttachmentContext,
  appState: Awaited<ReturnType<AttachmentContext['getAppState']>>,
  turnIndex: number
): GeneratorConfig[] {
  const generators: GeneratorConfig[] = [];
  const { toolPermissionContext, teamContext, todos, tasks } = appState;
  const agentId = ctx.agentId ?? 'main';

  // Priority 1: Critical system reminder (highest priority)
  if (ctx.options.criticalSystemReminder_EXPERIMENTAL) {
    generators.push({
      name: 'critical_system_reminder',
      priority: 1,
      generator: async () =>
        generateCriticalSystemReminderAttachment(ctx),
    });
  }

  // Priority 10: Plan mode
  if (toolPermissionContext.mode === 'plan') {
    generators.push({
      name: 'plan_mode',
      priority: 10,
      generator: async () => {
        return generatePlanModeAttachment([], ctx);
      },
    });
  }

  // Priority 11: Delegate mode
  if (toolPermissionContext.mode === 'delegate' && teamContext) {
    generators.push({
      name: 'delegate_mode',
      priority: 11,
      generator: async () =>
        generateDelegateModeAttachment(ctx),
    });
  }

  // Priority 20: Todo list
  const agentTodos = todos[agentId] ?? [];
  if (agentTodos.length > 0) {
    generators.push({
      name: 'todo',
      priority: 20,
      generator: async () => Promise.resolve([generateTodoAttachment(agentTodos)]),
    });
  }

  // Priority 30: Output style
  if (ctx.options.outputStyle) {
    generators.push({
      name: 'output_style',
      priority: 30,
      generator: async () => {
        const result = generateOutputStyleAttachment(ctx);
        return result ? [result] : [];
      },
    });
  }

  // Priority 40: Budget tracking
  if (ctx.options.maxBudgetUsd !== undefined) {
    generators.push({
      name: 'budget',
      priority: 40,
      generator: async () => {
        return generateBudgetAttachment(ctx.options.maxBudgetUsd);
      },
    });
  }

  // Priority 50: Memory files
  generators.push({
    name: 'memory',
    priority: 50,
    generator: async () => {
      return generateMemoryAttachment(ctx, [], "repl_main_thread");
    },
  });

  // Priority 60: Task status (for background tasks)
  if (tasks && tasks.size > 0) {
    generators.push({
      name: 'task_status',
      priority: 60,
      generator: async () => {
        const statusAttachments: Attachment[] = [];
        for (const [taskId, task] of tasks) {
          const taskData = task as {
            type: 'shell' | 'agent' | 'remote_session';
            status: 'running' | 'completed' | 'failed';
            description: string;
          };
          statusAttachments.push(
            generateTaskStatusAttachment(
              taskId,
              taskData.type,
              taskData.status,
              taskData.description
            )
          );
        }
        return statusAttachments;
      },
    });
  }

  // Priority 70: Invoked skills
  generators.push({
    name: 'invoked_skills',
    priority: 70,
    generator: async () => {
      // In real implementation, get active skills from state
      return generateInvokedSkillsAttachment([]);
    },
  });

  // Priority 80: Changed files
  generators.push({
    name: 'changed_files',
    priority: 80,
    generator: async () => {
      // In real implementation, compare with file system
      return generateChangedFilesAttachment(ctx, new Map());
    },
  });

  return generators;
}

// ============================================
// Attachment Message Wrapping
// ============================================

/**
 * Wrap attachment in message format for yielding.
 */
export function wrapAttachmentMessage(attachment: Attachment): AttachmentMessage {
  return {
    type: 'attachment',
    attachment,
    uuid: generateUuid(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate UUID for attachment messages.
 */
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// Async Generator for Streaming
// ============================================

/**
 * Generate attachments as async generator for streaming.
 * This allows attachments to be yielded as they're generated.
 */
export async function* generateAttachmentsStreaming(
  ctx: AttachmentContext,
  turnIndex: number = 0,
  userPrompt: string | null = null,
  ideContext: any = null,
  queuedCommands: any[] = [],
  conversationHistory: any[] = []
): AsyncGenerator<AttachmentMessage> {
  const result = await generateAllAttachments(
    userPrompt,
    ctx,
    ideContext,
    queuedCommands,
    conversationHistory,
    turnIndex
  );

  for (const attachment of result.attachments) {
    yield wrapAttachmentMessage(attachment);
  }

  // Log any errors (sampled)
  if (result.errors.length > 0 && Math.random() < TELEMETRY_SAMPLE_RATE) {
    console.error(
      `[Attachment] Generation completed with ${result.errors.length} errors in ${result.durationMs}ms`
    );
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
