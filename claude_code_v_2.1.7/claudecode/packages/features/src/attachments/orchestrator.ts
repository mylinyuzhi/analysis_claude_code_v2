/**
 * @claudecode/features - Attachment Orchestrator
 * 
 * Main orchestration for generating all attachments with timeout handling.
 * Strictly aligned with source O27 (generateAllAttachments) and fJ (wrapWithErrorHandling).
 * 
 * Location: chunks.131.mjs:3121-3138 (O27), 3140-3164 (fJ), 3614-3621 (VHA)
 */

import type {
  Attachment,
  AttachmentContext,
  AttachmentMessage,
  AttachmentOptions,
} from './types.js';

import {
  generateAtMentionedFilesAttachment,
  generateMcpResourcesAttachment,
  generateAgentMentionsAttachment,
  generateChangedFilesAttachment,
  generateNestedMemoryAttachment,
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
  generateDelegateModeAttachment,
  generateDelegateModeExitAttachment,
  generateTodoRemindersAttachment,
  generateCollabNotificationAttachment,
  generateCriticalSystemReminderAttachment,
  generateIdeSelectionAttachment,
  generateOpenedFileInIdeAttachment,
  generateOutputStyleAttachment,
  generateQueuedCommandsAttachment,
  generateDiagnosticsAttachment,
  generateLspDiagnosticsAttachment,
  generateUnifiedTasksAttachment,
  generateAsyncHookResponsesAttachment,
  generateMemoryAttachment,
  generateTokenUsageAttachment,
  generateBudgetAttachment,
  generateVerifyPlanReminderAttachment,
} from './generators.js';

// ============================================
// Helpers (Simulated from Source)
// ============================================

/**
 * parseBoolean - a1 in chunks.131.mjs
 */
function parseBoolean(val: any): boolean {
  return val === 'true' || val === true || val === '1';
}

/**
 * JSON.stringify - eA in chunks.131.mjs
 */
function serialize(val: any): string {
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Telemetry log - l in chunks.131.mjs
 */
function logTelemetry(event: string, data: any) {
  // In real implementation, this sends to telemetry system
  if (process.env.DEBUG_ATTACHMENTS) {
    console.debug(`[Telemetry] ${event}`, data);
  }
}

/**
 * Error log - e in chunks.131.mjs
 */
function logError(err: any) {
  if (process.env.DEBUG_ATTACHMENTS) {
    console.error(`[Error]`, err);
  }
}

/**
 * Diagnostic log - xM in chunks.131.mjs
 */
function logDiagnostic(msg: string, err: any) {
  if (process.env.DEBUG_ATTACHMENTS) {
    console.warn(`[Diagnostic] ${msg}`, err);
  }
}

// ============================================
// Attachment Wrapper (fJ)
// ============================================

/**
 * wrapAttachmentGenerator - fJ in chunks.131.mjs:3140
 */
async function wrapAttachmentGenerator(
  label: string,
  generator: () => Promise<Attachment[]>
): Promise<Attachment[]> {
  const startTime = Date.now();
  try {
    const results = await generator();
    const duration = Date.now() - startTime;
    const size = results.reduce((acc, curr) => acc + serialize(curr).length, 0);

    if (Math.random() < 0.05) {
      logTelemetry("tengu_attachment_compute_duration", {
        label,
        duration_ms: duration,
        attachment_size_bytes: size,
        attachment_count: results.length
      });
    }
    return results;
  } catch (err) {
    const duration = Date.now() - startTime;
    if (Math.random() < 0.05) {
      logTelemetry("tengu_attachment_compute_duration", {
        label,
        duration_ms: duration,
        error: true
      });
    }
    logError(err);
    logDiagnostic(`Attachment error in ${label}`, err);
    return [];
  }
}

// ============================================
// Attachment Message Wrapper (X4)
// ============================================

/**
 * wrapAttachmentMessage - X4 in chunks.132.mjs:87
 */
export function wrapAttachmentMessage(attachment: Attachment): AttachmentMessage {
  return {
    type: "attachment",
    attachment,
    uuid: Math.random().toString(36).substring(2, 15), // Simulated q27()
    timestamp: new Date().toISOString()
  };
}

// ============================================
// Main Orchestrator (O27)
// ============================================

/**
 * generateAllAttachments - O27 in chunks.131.mjs:3121
 * 
 * @param userPrompt - A
 * @param context - Q
 * @param ideContext - B
 * @param queuedCommands - G
 * @param history - Z
 * @param additionalParam - Y
 */
export async function generateAllAttachments(
  userPrompt: string | null,
  context: AttachmentContext,
  ideContext: any,
  queuedCommands: any[],
  history: any[],
  additionalParam?: any
): Promise<Attachment[]> {
  if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];

  const abortController = context.abortController ?? new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, 1000);

  const generatorCtx = {
    ...context,
    abortController
  };

  const isMainAgent = !context.agentId;

  // Group D: User Prompt Related
  const userPromptGenerators = userPrompt ? [
    wrapAttachmentGenerator("at_mentioned_files", () => 
      generateAtMentionedFilesAttachment(userPrompt, generatorCtx)),
    wrapAttachmentGenerator("mcp_resources", () => 
      generateMcpResourcesAttachment(userPrompt, generatorCtx)),
    wrapAttachmentGenerator("agent_mentions", () => 
      Promise.resolve(generateAgentMentionsAttachment(userPrompt, context.options.agentDefinitions?.activeAgents || [])))
  ] : [];

  // Group K: Core Attachments
  const coreGenerators = [
    wrapAttachmentGenerator("changed_files", () => 
      Promise.resolve(generateChangedFilesAttachment(generatorCtx, new Map()))),
    wrapAttachmentGenerator("nested_memory", () => 
      generateNestedMemoryAttachment(generatorCtx)),
    wrapAttachmentGenerator("ultra_claude_md", async () => 
      // Mapping to v27 in source
      []), 
    wrapAttachmentGenerator("plan_mode", () => 
      generatePlanModeAttachment(history, context)),
    wrapAttachmentGenerator("plan_mode_exit", () => 
      generatePlanModeExitAttachment(context)),
    wrapAttachmentGenerator("delegate_mode", () => 
      generateDelegateModeAttachment(context)),
    wrapAttachmentGenerator("delegate_mode_exit", () => 
      Promise.resolve(generateDelegateModeExitAttachment())),
    wrapAttachmentGenerator("todo_reminders", () => 
      generateTodoRemindersAttachment(history, context)),
    wrapAttachmentGenerator("collab_notification", async () => 
      generateCollabNotificationAttachment([])),
    wrapAttachmentGenerator("critical_system_reminder", () => 
      Promise.resolve(generateCriticalSystemReminderAttachment(context)))
  ];

  // Group V: Main Agent Only
  const mainAgentGenerators = isMainAgent ? [
    wrapAttachmentGenerator("ide_selection", async () => 
      generateIdeSelectionAttachment(ideContext, context)),
    wrapAttachmentGenerator("ide_opened_file", async () => 
      Promise.resolve(generateOpenedFileInIdeAttachment(ideContext, context) ? [generateOpenedFileInIdeAttachment(ideContext, context)!] : [])),
    wrapAttachmentGenerator("output_style", async () => 
      Promise.resolve(generateOutputStyleAttachment(context) ? [generateOutputStyleAttachment(context)!] : [])),
    wrapAttachmentGenerator("queued_commands", async () => 
      generateQueuedCommandsAttachment(queuedCommands)),
    wrapAttachmentGenerator("diagnostics", async () => 
      generateDiagnosticsAttachment()),
    wrapAttachmentGenerator("lsp_diagnostics", async () => 
      generateLspDiagnosticsAttachment()),
    wrapAttachmentGenerator("unified_tasks", async () => 
      generateUnifiedTasksAttachment(context, history)),
    wrapAttachmentGenerator("async_hook_responses", async () => 
      generateAsyncHookResponsesAttachment()),
    wrapAttachmentGenerator("memory", async () => 
      generateMemoryAttachment(context, history, additionalParam)),
    wrapAttachmentGenerator("token_usage", async () => 
      Promise.resolve(generateTokenUsageAttachment(history))),
    wrapAttachmentGenerator("budget_usd", async () => 
      Promise.resolve(generateBudgetAttachment(context.options.maxBudgetUsd))),
    wrapAttachmentGenerator("verify_plan_reminder", async () => 
      generateVerifyPlanReminderAttachment(history, context))
  ] : [];

  try {
    const W = await Promise.all(userPromptGenerators);
    const [F, H] = await Promise.all([
      Promise.all(coreGenerators),
      Promise.all(mainAgentGenerators)
    ]);

    return [...W.flat(), ...F.flat(), ...H.flat()];
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================
// Streaming Generator (VHA)
// ============================================

/**
 * generateAttachmentsStreaming - VHA in chunks.131.mjs:3614
 */
export async function* generateAttachmentsStreaming(
  userPrompt: string | null,
  context: AttachmentContext,
  ideContext: any,
  queuedCommands: any[],
  history: any[],
  additionalParam?: any
): AsyncGenerator<AttachmentMessage> {
  const attachments = await generateAllAttachments(
    userPrompt,
    context,
    ideContext,
    queuedCommands,
    history,
    additionalParam
  );

  if (attachments.length === 0) return;

  logTelemetry("tengu_attachments", {
    attachment_types: attachments.map((a) => a.type)
  });

  for (const attachment of attachments) {
    yield wrapAttachmentMessage(attachment);
  }
}
