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
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
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
  generateChangedFilesAttachment,
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
 * This function orchestrates the generation of all system reminder attachments.
 * It runs generators in parallel with a 1-second timeout to ensure responsiveness.
 *
 * Key design decisions:
 * 1. Parallel execution for speed
 * 2. 1-second timeout to prevent blocking
 * 3. Error isolation - one failing generator doesn't break others
 * 4. Priority ordering for consistent attachment order
 */
export async function generateAllAttachments(
  ctx: AttachmentContext,
  turnIndex: number = 0
): Promise<AttachmentGenerationResult> {
  const startTime = Date.now();
  const attachments: Attachment[] = [];
  const errors: Array<{ generator: string; error: Error }> = [];
  let timedOut = false;

  // Create abort controller for timeout
  const abortController = ctx.abortController ?? new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
    timedOut = true;
  }, GENERATION_TIMEOUT_MS);

  try {
    // Get app state for generation context
    const appState = await ctx.getAppState();

    // Build list of generators based on current state
    const generators = buildGeneratorList(ctx, appState, turnIndex);

    // Run all generators in parallel
    const results = await Promise.allSettled(
      generators.map(async (config) => {
        // Check if aborted
        if (abortController.signal.aborted) {
          return { name: config.name, result: null, aborted: true };
        }

        const { result, error } = await wrapWithErrorHandling(
          config.name,
          config.generator
        );

        if (error) {
          errors.push({ generator: config.name, error });
        }

        return { name: config.name, result, priority: config.priority };
      })
    );

    // Collect successful results
    const successfulResults: Array<{
      name: string;
      result: Attachment | Attachment[] | null;
      priority: number;
    }> = [];

    for (const settledResult of results) {
      if (settledResult.status === 'fulfilled' && settledResult.value.result) {
        successfulResults.push(settledResult.value as {
          name: string;
          result: Attachment | Attachment[];
          priority: number;
        });
      }
    }

    // Sort by priority and flatten attachments
    successfulResults.sort((a, b) => a.priority - b.priority);

    for (const { result } of successfulResults) {
      if (Array.isArray(result)) {
        attachments.push(...result);
      } else if (result) {
        attachments.push(result);
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
        generateCriticalSystemReminderAttachment(
          ctx.options.criticalSystemReminder_EXPERIMENTAL!
        ),
    });
  }

  // Priority 10: Plan mode
  if (toolPermissionContext.mode === 'plan') {
    generators.push({
      name: 'plan_mode',
      priority: 10,
      generator: async () => {
        // In a real implementation, get plan file path from state
        const planFilePath = '/tmp/plan.md';
        const planExists = false; // Would check file system
        return generatePlanModeAttachment(planFilePath, planExists, turnIndex, !!ctx.agentId);
      },
    });
  }

  // Priority 11: Delegate mode
  if (toolPermissionContext.mode === 'delegate' && teamContext) {
    generators.push({
      name: 'delegate_mode',
      priority: 11,
      generator: async () =>
        generateDelegateModeAttachment(teamContext.teamName, '/tmp/tasks.md'),
    });
  }

  // Priority 20: Todo list
  const agentTodos = todos[agentId] ?? [];
  if (agentTodos.length > 0) {
    generators.push({
      name: 'todo',
      priority: 20,
      generator: async () => generateTodoAttachment(agentTodos),
    });
  }

  // Priority 30: Output style
  if (ctx.options.outputStyle) {
    generators.push({
      name: 'output_style',
      priority: 30,
      generator: async () =>
        generateOutputStyleAttachment(ctx.options.outputStyle!),
    });
  }

  // Priority 40: Budget tracking
  if (ctx.options.maxBudgetUsd !== undefined) {
    generators.push({
      name: 'budget',
      priority: 40,
      generator: async () => {
        // In real implementation, get actual usage from state
        const used = 0;
        return generateBudgetAttachment(used, ctx.options.maxBudgetUsd!);
      },
    });
  }

  // Priority 50: Memory files
  generators.push({
    name: 'memory',
    priority: 50,
    generator: async () => {
      // In real implementation, load memory files from disk
      return generateMemoryAttachment([]);
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
  turnIndex: number = 0
): AsyncGenerator<AttachmentMessage> {
  const result = await generateAllAttachments(ctx, turnIndex);

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
