/**
 * @claudecode/core - Tool Execution Flow
 *
 * Complete tool execution pipeline with validation, permissions, and hooks.
 * Reconstructed from chunks.134.mjs:660-1125 and chunks.89.mjs:2458-2483
 */

import { generateUUID } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ContentBlock, ToolResultContentBlock } from '@claudecode/shared';
import type { ConversationMessage, UserMessage, AssistantMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext, ToolResult, ToolInput } from './types.js';
import type { ToolUseBlock, CanUseTool, ToolExecutionYield } from '../agent-loop/types.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { 
  analyticsEvent, 
  logStructuredMetric 
} from '@claudecode/platform';

// Import hooks from features package
import {
  executePreToolHooks,
  executePostToolHooks,
  executePostToolFailureHooks as executePostToolFailureHooksFromFeatures,
} from '@claudecode/features';

// ============================================
// Constants
// ============================================

/**
 * User rejected content message.
 * Original: v4A in chunks.148.mjs:623
 */
export const USER_REJECTED_CONTENT = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.";

/**
 * Cancelled by user message.
 * Original: aVA in chunks.148.mjs:621
 */
export const CANCELLED_BY_USER_MESSAGE = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed.";

/**
 * Default maximum result size before persistence.
 * Original: U42 in chunks.89.mjs:2392
 */
const DEFAULT_MAX_RESULT_SIZE = 400000;

/**
 * Preview size for persisted results.
 * Original: q42 in chunks.89.mjs:2532
 */
const PREVIEW_SIZE = 2000;

/**
 * Persisted output markers.
 * Original: GZ1 and cX0 in chunks.89.mjs:2526-2528
 */
const PERSISTED_OUTPUT_START = '<persisted-output>';
const PERSISTED_OUTPUT_END = '</persisted-output>';

// ============================================
// Types
// ============================================

/**
 * Hook permission result.
 */
export interface HookPermissionResult {
  behavior: 'allow' | 'deny' | 'ask';
  updatedInput?: ToolInput;
  message?: string;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Find tool by name.
 * Original: K91 in chunks.134.mjs:662
 */
export function findToolByName(
  tools: ToolDefinition[],
  name: string
): ToolDefinition | undefined {
  return tools.find((t) => t.name === name);
}

/**
 * Get display name for tool (strips mcp__ prefix).
 * Original: k9 in chunks.134.mjs:667
 */
export function getToolDisplayName(name: string): string {
  if (name.startsWith('mcp__')) {
    const parts = name.split('__');
    if (parts.length >= 3) {
      return parts.slice(2).join('__');
    }
  }
  return name;
}

/**
 * Parse MCP tool name to get server name.
 * Original: qF in chunks.134.mjs
 */
export function parseMcpToolName(
  toolName: string
): { serverName: string; toolName: string } | null {
  if (!toolName.startsWith('mcp__')) {
    return null;
  }
  const parts = toolName.split('__');
  if (parts.length < 3) {
    return null;
  }
  const serverName = parts[1];
  if (!serverName) return null;
  return {
    serverName,
    toolName: parts.slice(2).join('__'),
  };
}

/**
 * Get MCP server type from tool name.
 * Original: v77 in chunks.134.mjs:651
 */
export function getMcpServerType(
  toolName: string,
  mcpClients: Array<{ name: string; type?: string; config?: { type?: string } }>
): string | undefined {
  if (!toolName.startsWith('mcp__')) return undefined;

  const parsed = parseMcpToolName(toolName);
  if (!parsed) return undefined;
  
  const client = mcpClients.find((c) => c.name === parsed.serverName) as any;
  if (client?.type === 'connected') {
    return client.config?.type ?? 'stdio';
  }
  return undefined;
}

/**
 * Create user rejected tool result.
 * Original: FM0 in chunks.147.mjs:2486
 */
export function createUserRejectedToolResult(toolUseId: string): ContentBlock {
  return {
    type: 'tool_result',
    content: CANCELLED_BY_USER_MESSAGE,
    is_error: true,
    tool_use_id: toolUseId,
  } as ContentBlock;
}

/**
 * Alias for createUserRejectedToolResult to match index.ts expectations
 */
export const createCancelledToolResult = createUserRejectedToolResult;

/**
 * Format Zod validation error.
 * Original: u77 in chunks.134.mjs:775
 */
export function formatValidationError(toolName: string, error: { message: string; errors?: Array<{ path: string[]; message: string }> }): string {
  if (error.errors && error.errors.length > 0) {
    const details = error.errors
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    return `Input validation failed for ${toolName}:\n${details}`;
  }
  return `Input validation failed for ${toolName}: ${error.message}`;
}

// ============================================
// Monitoring & Telemetry
// ============================================

/**
 * Log telemetry event.
 * Original: l in chunks.134.mjs
 */
function logTelemetry(event: string, data: Record<string, unknown>): void {
  analyticsEvent(event, data);
}

/**
 * Record duration of tool execution.
 * Original: aU1 in chunks.134.mjs:958
 */
function recordDuration(durationMs: number): void {
  // Global state update or performance mark
}

/**
 * Record tool success/failure state.
 * Original: lI0 in chunks.134.mjs:981
 */
function recordToolSuccess(result: { success: boolean; error?: string }): void {
  // Span management placeholder
}

/**
 * Record raw tool result for monitoring.
 * Original: sZ1 in chunks.134.mjs:985
 */
function recordToolResult(result: string): void {
  // Span management placeholder
}

/**
 * Log structured metric for tool result.
 * Original: LF in chunks.134.mjs:1008
 */
async function logToolResultMetric(eventName: string, data: Record<string, unknown>): Promise<void> {
  await logStructuredMetric(eventName, data);
}

/**
 * Track tool input for tracing.
 * Original: J82 in chunks.134.mjs:869
 */
function trackToolInput(toolName: string, input: Record<string, unknown>): void {
  // Tracing placeholder
}

/**
 * Clear tool input tracing state.
 * Original: X82 in chunks.134.mjs:869
 */
function clearToolInput(): void {
  // Tracing placeholder
}

/**
 * Log debug output for tools.
 * Original: D82 in chunks.134.mjs:973
 */
function logDebugOutput(key: string, data: Record<string, unknown>): void {
  if (process.env.DEBUG_TOOLS) {
    console.log(`[Debug] ${key}:`, data);
  }
}

/**
 * Track permission decision.
 * Original: pI0 in chunks.134.mjs:889
 */
function trackPermissionDecision(decision: string, source: string): void {
  // Decision tracking placeholder
}

/**
 * Start tool execution span.
 * Original: I82 in chunks.134.mjs:946
 */
function startSpan(): void {
  // Span start placeholder
}

/**
 * Is tool an MCP tool?
 * Original: $j in chunks.134.mjs:1007
 */
function isMcpTool(tool: ToolDefinition): boolean {
  return tool.name.startsWith('mcp__');
}

/**
 * Get MCP server scope.
 * Original: WM0 in chunks.134.mjs:1007
 */
function getMcpServerScope(toolName: string): string | null {
  if (!toolName.startsWith('mcp__')) return null;
  const parts = toolName.split('__');
  return parts.length >= 2 ? (parts[1] as string) : null;
}

// ============================================
// Progress Queue
// ============================================

/**
 * Async queue for streaming progress.
 * Reconstructed from chunks.133.mjs:3221-3280 (khA class)
 */
class AsyncQueue<T> {
  private queue: T[] = [];
  private waiting: Array<{ resolve: (value: { done: boolean; value: T | undefined }) => void; reject: (error: Error) => void }> = [];
  private isDone = false;
  private error: Error | null = null;

  enqueue(item: T): void {
    if (this.isDone) return;

    if (this.waiting.length > 0) {
      const waiter = this.waiting.shift()!;
      waiter.resolve({ done: false, value: item });
    } else {
      this.queue.push(item);
    }
  }

  done(): void {
    if (this.isDone) return;
    this.isDone = true;
    for (const waiter of this.waiting) {
      waiter.resolve({ done: true, value: undefined });
    }
    this.waiting = [];
  }

  setError(err: Error): void {
    this.error = err;
    this.isDone = true;
    for (const waiter of this.waiting) {
      waiter.reject(err);
    }
    this.waiting = [];
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    while (true) {
      const result = await this.next();
      if (result.done) return;
      yield result.value!;
    }
  }

  private next(): Promise<{ done: boolean; value: T | undefined }> {
    if (this.queue.length > 0) {
      return Promise.resolve({ done: false, value: this.queue.shift() });
    }
    if (this.isDone) {
      return Promise.resolve({ done: true, value: undefined });
    }
    if (this.error) {
      return Promise.reject(this.error);
    }
    return new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject });
    });
  }
}

// ============================================
// Tool Result Persistence
// ============================================

/**
 * Get preview of result.
 * Original: H85 in chunks.89.mjs:2485
 */
function createResultPreview(content: string, limit: number): { preview: string; hasMore: boolean } {
  if (content.length <= limit) {
    return { preview: content, hasMore: false };
  }
  
  const lastNewline = content.slice(0, limit).lastIndexOf('\n');
  const splitPos = lastNewline > limit * 0.5 ? lastNewline : limit;
  
  return {
    preview: content.slice(0, splitPos),
    hasMore: true,
  };
}

/**
 * Create persisted result preview block.
 * Original: V85 in chunks.89.mjs:2446
 */
function createPersistedResultPreview(info: { filepath: string; originalSize: number; preview: string; hasMore: boolean }): string {
  let output = `${PERSISTED_OUTPUT_START}\n`;
  output += `Output too large (${info.originalSize.toLocaleString()} characters). Full output saved to: ${info.filepath}\n\n`;
  output += `Preview (first ${PREVIEW_SIZE.toLocaleString()} chars):\n`;
  output += info.preview;
  if (info.hasMore) {
    output += '\n...';
  }
  output += `\n${PERSISTED_OUTPUT_END}`;
  return output;
}

/**
 * Persist large result if needed.
 * Original: F85 in chunks.89.mjs:2463
 */
async function persistLargeResultIfNeeded(
  contentBlock: ContentBlock,
  toolName: string,
  maxSize?: number,
  sessionDir?: string
): Promise<ContentBlock> {
  if (contentBlock.type !== 'tool_result') return contentBlock;
  const resultBlock = contentBlock as ToolResultContentBlock;
  
  const content = resultBlock.content;
  if (!content || !sessionDir) return contentBlock;

  // Don't persist if it contains images (Original: chunks.89.mjs:2467)
  if (Array.isArray(content) && content.some(b => typeof b === 'object' && 'type' in b && b.type === 'image')) {
    return contentBlock;
  }

  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  const limit = maxSize ?? DEFAULT_MAX_RESULT_SIZE;

  if (contentStr.length <= limit) {
    return contentBlock;
  }

  // Persist to disk (Original: Z4A in chunks.89.mjs:2412)
  const resultsDir = join(sessionDir, 'tool-results');
  if (!existsSync(resultsDir)) {
    mkdirSync(resultsDir, { recursive: true });
  }

  const isJson = typeof content !== 'string';
  const ext = isJson ? 'json' : 'txt';
  const fileName = `${resultBlock.tool_use_id}.${ext}`;
  const filePath = join(resultsDir, fileName);

  try {
    writeFileSync(filePath, contentStr, 'utf-8');
    
    const previewInfo = createResultPreview(contentStr, PREVIEW_SIZE);
    const persistedPreview = createPersistedResultPreview({
      filepath: filePath,
      originalSize: contentStr.length,
      preview: previewInfo.preview,
      hasMore: previewInfo.hasMore,
    });

    logTelemetry('tengu_tool_result_persisted', {
      toolName: getToolDisplayName(toolName),
      originalSizeBytes: contentStr.length,
      persistedSizeBytes: persistedPreview.length,
      estimatedOriginalTokens: Math.ceil(contentStr.length / 4),
      estimatedPersistedTokens: Math.ceil(persistedPreview.length / 4),
    });

    return {
      ...resultBlock,
      content: persistedPreview,
    } as ContentBlock;
  } catch (err) {
    logTelemetry('tengu_tool_result_persistence_failed', {
      toolName: getToolDisplayName(toolName),
      error: String(err),
    });
    return contentBlock;
  }
}

// ============================================
// Tool Result Creation
// ============================================

/**
 * Create tool result content block.
 * Original: YZ1 in chunks.89.mjs:2458
 */
async function createToolResultContent(
  tool: ToolDefinition,
  result: unknown,
  toolUseId: string,
  context: ToolUseContext
): Promise<ContentBlock> {
  let block: ContentBlock;
  if ((tool as any).mapToolResultToToolResultBlockParam) {
    block = (tool as any).mapToolResultToToolResultBlockParam(result, toolUseId);
  } else {
    block = {
      type: 'tool_result',
      content: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
      tool_use_id: toolUseId,
    } as ContentBlock;
  }

  return persistLargeResultIfNeeded(
    block,
    tool.name,
    (tool as any).maxResultSizeChars,
    context.options.sessionDir
  );
}

// ============================================
// Tool Execution Flow
// ============================================

/**
 * Execute tool with validation and hooks.
 * Original: b77 in chunks.134.mjs:772-1125
 */
export async function executeToolWithValidation(
  tool: ToolDefinition,
  toolUseId: string,
  input: ToolInput,
  context: ToolUseContext,
  canUseTool: CanUseTool,
  assistantMessage: ConversationMessage,
  messageId: string,
  requestId?: string,
  mcpServerType?: string,
  progressCallback?: (progress: { toolUseID: string; data: unknown }) => void
): Promise<ToolExecutionYield[]> {
  const yields: ToolExecutionYield[] = [];

  // 1. Input Validation (Zod)
  if (tool.inputSchema) {
    const parsed = tool.inputSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = formatValidationError(tool.name, (parsed as any).error);
      logTelemetry('tengu_tool_use_error', {
        error: 'InputValidationError',
        errorDetails: errorMsg.slice(0, 2000),
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        isMcp: isMcpTool(tool),
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });

      yields.push({
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: `<tool_use_error>InputValidationError: ${errorMsg}</tool_use_error>`,
              is_error: true,
              tool_use_id: toolUseId,
            } as ContentBlock,
          ],
          toolUseResult: `InputValidationError: ${(parsed as any).error.message}`,
          sourceToolAssistantUUID: (assistantMessage as any).uuid,
        }),
      });
      return yields;
    }
    input = parsed.data;
  }

  // 2. Custom Validation
  if (tool.validateInput) {
    const customValid = await tool.validateInput(input, context);
    if (customValid?.result === false) {
      logTelemetry('tengu_tool_use_error', {
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        error: customValid.message,
        errorCode: customValid.errorCode,
        isMcp: isMcpTool(tool),
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });

      yields.push({
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: `<tool_use_error>${customValid.message}</tool_use_error>`,
              is_error: true,
              tool_use_id: toolUseId,
            } as ContentBlock,
          ],
          toolUseResult: `Error: ${customValid.message}`,
          sourceToolAssistantUUID: (assistantMessage as any).uuid,
        }),
      });
      return yields;
    }
  }

  // 3. Pre-execution Hooks
  let hookPermission: HookPermissionResult | undefined;
  let preventContinuation = false;
  let stopReason: string | undefined;

  const preHookStartTime = Date.now();
  try {
    for await (const hookYield of executePreToolHooks(
      tool.name,
      toolUseId,
      input,
      context,
      context.options.permissionMode || 'default',
      context.abortController?.signal
    )) {
      if (hookYield.result?.outcome === 'cancelled') {
        analyticsEvent('tengu_pre_tool_hooks_cancelled', {
          toolName: getToolDisplayName(tool.name),
          queryChainId: context.queryTracking?.chainId,
          queryDepth: context.queryTracking?.depth,
        });
      }

      if (hookYield.preventContinuation) {
        preventContinuation = true;
        stopReason = hookYield.stopReason;
      }
      
      if (hookYield.result?.outcome === 'blocking') {
        hookPermission = {
          behavior: 'deny',
          message: hookYield.result.blockingError?.blockingError || 'Blocked by hook',
        };
      }

      if (hookYield.result?.output) {
        const out = (hookYield.result.output as any).hookSpecificOutput;
        if (out?.hookEventName === 'PreToolUse') {
          if (out.permissionDecision) {
            hookPermission = {
              behavior: out.permissionDecision,
              updatedInput: out.updatedInput,
              message: out.permissionDecisionReason,
            };
          }
          if (out.updatedInput) input = out.updatedInput;
        }
      }
    }
  } catch (err) {
    analyticsEvent('tengu_pre_tool_hook_error', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      isMcp: isMcpTool(tool),
      duration: Date.now() - preHookStartTime,
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });
  }

  if (preventContinuation) {
    yields.push({
      message: createUserMessage({
        content: [createUserRejectedToolResult(toolUseId)],
        toolUseResult: `Error: ${stopReason || 'Execution stopped by hook'}`,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
    });
    return yields;
  }

  // 4. Permission Check
  let decision: { behavior: string; message?: string; updatedInput?: ToolInput; userModified?: boolean; acceptFeedback?: string; decisionReason?: any };

  const toolParameters: Record<string, unknown> = {};
  if (input && typeof input === 'object') {
    if (tool.name === 'Bash' && 'command' in input) {
      const bashInput = input as any;
      toolParameters.bash_command = bashInput.command.trim().split(/\s+/)[0] || '';
      toolParameters.full_command = bashInput.command;
      if (bashInput.timeout !== undefined) toolParameters.timeout = bashInput.timeout;
      if (bashInput.description !== undefined) toolParameters.description = bashInput.description;
      if ('dangerouslyDisableSandbox' in bashInput) toolParameters.dangerouslyDisableSandbox = bashInput.dangerouslyDisableSandbox;
    } else if (tool.name === 'Write' && 'file_path' in input) {
      toolParameters.file_path = String((input as any).file_path);
    } else if ((tool.name === 'Edit' || tool.name === 'Read') && 'file_path' in input) {
      toolParameters.file_path = String((input as any).file_path);
    }
  }

  // Track tool input (Original: J82 in chunks.134.mjs:869)
  trackToolInput(tool.name, toolParameters);
  clearToolInput(); // Original: X82 in chunks.134.mjs:869

  if (hookPermission?.behavior === 'allow' && !tool.requiresUserInteraction?.()) {
    decision = hookPermission as any;
  } else if (hookPermission?.behavior === 'deny') {
    decision = hookPermission as any;
  } else {
    const canUse = await canUseTool(tool, input, assistantMessage);
    if (typeof canUse === 'boolean') {
      decision = canUse ? { behavior: 'allow' } : { behavior: 'deny', message: USER_REJECTED_CONTENT };
    } else {
      decision = {
        behavior: canUse.behavior || (canUse.result ? 'allow' : 'deny'),
        message: canUse.message,
        updatedInput: (canUse as any).updatedInput,
        userModified: (canUse as any).userModified,
        acceptFeedback: (canUse as any).acceptFeedback,
        decisionReason: (canUse as any).decisionReason,
      };
    }
  }

  const toolDecision = context.toolDecisions?.get(toolUseId);

  if (decision.behavior !== 'allow') {
    trackPermissionDecision('reject', toolDecision?.source || 'unknown');
    logTelemetry('tengu_tool_use_can_use_tool_rejected', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    yields.push({
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: decision.message || USER_REJECTED_CONTENT,
            is_error: true,
            tool_use_id: toolUseId,
          } as ContentBlock,
        ],
        toolUseResult: `Error: ${decision.message}`,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
    });
    return yields;
  }

  if (decision.updatedInput) input = decision.updatedInput;

  logTelemetry('tengu_tool_use_can_use_tool_allowed', {
    messageID: messageId,
    toolName: getToolDisplayName(tool.name),
    queryChainId: context.queryTracking?.chainId,
    queryDepth: context.queryTracking?.depth,
    ...(mcpServerType ? { mcpServerType } : {}),
    ...(requestId ? { requestId } : {}),
  });

  // 5. Execution
  const toolDecisionForExec = context.toolDecisions?.get(toolUseId);
  trackPermissionDecision(toolDecisionForExec?.decision || 'unknown', toolDecisionForExec?.source || 'unknown');
  startSpan();
  const startTime = Date.now();
  try {
    const toolResult = await tool.call(
      input,
      { ...context, userModified: decision.userModified ?? false },
      toolUseId,
      { assistantMessage, canUseTool },
      progressCallback ? (p) => progressCallback({ toolUseID: toolUseId, data: p }) : undefined
    );

    const duration = Date.now() - startTime;
    recordDuration(duration);
    recordToolSuccess({ success: true });
    
    const resultStr = typeof toolResult.data === 'string' ? toolResult.data : JSON.stringify(toolResult.data);
    recordToolResult(resultStr);

    logTelemetry('tengu_tool_use_success', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      isMcp: isMcpTool(tool),
      durationMs: duration,
      toolResultSizeBytes: resultStr.length,
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    const mcpServerScope = isMcpTool(tool) ? getMcpServerScope(tool.name) : null;
    logToolResultMetric('tool_result', {
      tool_name: getToolDisplayName(tool.name),
      success: 'true',
      duration_ms: String(duration),
      ...(Object.keys(toolParameters).length > 0 ? { tool_parameters: JSON.stringify(toolParameters) } : {}),
      tool_result_size_bytes: String(resultStr.length),
      ...(toolDecision ? { decision_source: toolDecision.source, decision_type: toolDecision.decision } : {}),
      ...(mcpServerScope ? { mcp_server_scope: mcpServerScope } : {}),
    });

    // 6. Post-execution mapping and hooks
    const resultContent = await createToolResultContent(tool, toolResult.data, toolUseId, context);
    const contentBlocks: ContentBlock[] = [resultContent];
    if (decision.acceptFeedback) {
      contentBlocks.push({ type: 'text', text: decision.acceptFeedback } as ContentBlock);
    }

    yields.push({
      message: createUserMessage({
        content: contentBlocks,
        toolUseResult: resultStr,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
      contextModifier: toolResult.contextModifier ? {
        toolUseID: toolUseId,
        modifyContext: toolResult.contextModifier.modifyContext
      } : undefined,
    });

    // Post-tool hooks
    try {
      for await (const hookYield of executePostToolHooks(
        tool.name,
        toolUseId,
        input,
        toolResult.data,
        context,
        context.options.permissionMode || 'default',
        context.abortController?.signal
      )) {
        if (hookYield.result?.outcome === 'cancelled') {
          analyticsEvent('tengu_post_tool_hooks_cancelled', {
            toolName: getToolDisplayName(tool.name),
            queryChainId: context.queryTracking?.chainId,
            queryDepth: context.queryTracking?.depth,
          });
        }

        if (hookYield.result?.output) {
          const out = (hookYield.result.output as any).hookSpecificOutput;
          if (out?.additionalContext) {
            yields.push({
              message: createUserMessage({
                content: `[PostToolUse Hook]: ${out.additionalContext}`,
                isHookOutput: true,
              }),
            });
          }
        }
      }
    } catch (hookErr) {
      analyticsEvent('tengu_post_tool_hook_error', {
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        isMcp: isMcpTool(tool),
        duration: 0, // Should track duration
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });
    }

  } catch (err) {
    const duration = Date.now() - startTime;
    recordDuration(duration);
    recordToolSuccess({ success: false, error: String(err) });
    recordToolResult('');

    logTelemetry('tengu_tool_use_error', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      error: err instanceof Error ? err.constructor.name : 'UnknownError',
      isMcp: isMcpTool(tool),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    const mcpServerScope = isMcpTool(tool) ? getMcpServerScope(tool.name) : null;
    logToolResultMetric('tool_result', {
      tool_name: getToolDisplayName(tool.name),
      use_id: toolUseId,
      success: 'false',
      duration_ms: String(duration),
      error: err instanceof Error ? err.message : String(err),
      ...(Object.keys(toolParameters).length > 0 ? { tool_parameters: JSON.stringify(toolParameters) } : {}),
      ...(toolDecision ? { decision_source: toolDecision.source, decision_type: toolDecision.decision } : {}),
      ...(mcpServerScope ? { mcp_server_scope: mcpServerScope } : {}),
    });

    const fullError = `Error calling tool (${tool.name}): ${err instanceof Error ? err.message : String(err)}`;
    
    // Failure hooks
    const failureHookStartTime = Date.now();
    try {
      for await (const hookYield of executePostToolFailureHooksFromFeatures(
        tool.name,
        toolUseId,
        input,
        String(err),
        context.abortController?.signal?.aborted ?? false,
        context,
        context.options.permissionMode || 'default',
        context.abortController?.signal
      )) {
        if (hookYield.result?.outcome === 'cancelled') {
          analyticsEvent('tengu_post_tool_failure_hooks_cancelled', {
            toolName: getToolDisplayName(tool.name),
            queryChainId: context.queryTracking?.chainId,
            queryDepth: context.queryTracking?.depth,
          });
        }
        // Process failure hook outputs if needed
      }
    } catch (hookErr) {
      analyticsEvent('tengu_post_tool_failure_hook_error', {
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        isMcp: isMcpTool(tool),
        duration: Date.now() - failureHookStartTime,
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });
    }

    yields.push({
      message: createUserMessage({
        content: [{ type: 'tool_result', content: `<tool_use_error>${fullError}</tool_use_error>`, is_error: true, tool_use_id: toolUseId } as ContentBlock],
        toolUseResult: fullError,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
    });
  }

  return yields;
}

/**
 * Execute post-tool use failure hooks.
 * Original: p77 in chunks.134.mjs
 */
export async function* executePostToolFailureHooks(
  context: ToolUseContext,
  tool: ToolDefinition,
  toolUseId: string,
  input: ToolInput,
  error: string,
  isInterrupt: boolean
): AsyncGenerator<{
  message?: ConversationMessage;
}> {
  for await (const hookYield of executePostToolFailureHooksFromFeatures(
    tool.name,
    toolUseId,
    input,
    error,
    isInterrupt,
    context,
    context.options.permissionMode || 'default',
    context.abortController?.signal
  )) {
    if (hookYield.result?.output) {
      const out = (hookYield.result.output as any).hookSpecificOutput;
      if (out?.additionalContext) {
        yield {
          message: createUserMessage({
            content: `[PostToolUseFailure Hook]: ${out.additionalContext}`,
            isHookOutput: true,
          }),
        };
      }
    }
  }
}

/**
 * Main entry for tool execution with progress.
 * Original: k77 in chunks.134.mjs:741
 */
export function executeToolWithProgress(
  tool: ToolDefinition,
  toolUseId: string,
  input: ToolInput,
  context: ToolUseContext,
  canUseTool: CanUseTool,
  assistantMessage: ConversationMessage,
  messageId: string,
  requestId?: string,
  mcpServerType?: string
): AsyncIterable<ToolExecutionYield> {
  const queue = new AsyncQueue<ToolExecutionYield>();

  const progressCallback = (p: { toolUseID: string; data: unknown }) => {
    logTelemetry('tengu_tool_use_progress', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      isMcp: isMcpTool(tool),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    queue.enqueue({
      message: {
        type: 'progress',
        uuid: generateUUID(),
        timestamp: new Date().toISOString(),
        toolUseID: p.toolUseID,
        parentToolUseID: toolUseId,
        data: p.data,
      } as ConversationMessage,
    });
  };

  executeToolWithValidation(
    tool, toolUseId, input, context, canUseTool, assistantMessage, messageId, requestId, mcpServerType, progressCallback
  ).then(results => {
    for (const res of results) queue.enqueue(res);
  }).catch(err => {
    queue.setError(err instanceof Error ? err : new Error(String(err)));
  }).finally(() => {
    queue.done();
  });

  return queue;
}

/**
 * Unified tool executor generator.
 * Original: jH1 in chunks.134.mjs:660
 */
export async function* executeSingleTool(
  toolUseBlock: ToolUseBlock,
  assistantMessage: ConversationMessage,
  canUseTool: CanUseTool,
  context: ToolUseContext
): AsyncGenerator<ToolExecutionYield> {
  const tool = findToolByName(context.options.tools, toolUseBlock.name);
  const messageId = (assistantMessage as any).message?.id || '';
  const requestId = (assistantMessage as any).requestId;
  const mcpServerType = getMcpServerType(toolUseBlock.name, (context.options.mcpClients as any) || []);

  if (!tool) {
    const name = getToolDisplayName(toolUseBlock.name);
    logTelemetry('tengu_tool_use_error', {
      error: `No such tool available: ${name}`,
      toolName: name,
      toolUseID: toolUseBlock.id,
      isMcp: toolUseBlock.name.startsWith('mcp__'),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    yield {
      message: createUserMessage({
        content: [{ type: 'tool_result', content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`, is_error: true, tool_use_id: toolUseBlock.id } as ContentBlock],
        toolUseResult: `Error: No such tool available: ${toolUseBlock.name}`,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
    };
    return;
  }

  if (context.abortController?.signal?.aborted) {
    logTelemetry('tengu_tool_use_cancelled', {
      toolName: getToolDisplayName(tool.name),
      toolUseID: toolUseBlock.id,
      isMcp: isMcpTool(tool),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    yield {
      message: createUserMessage({
        content: [createUserRejectedToolResult(toolUseBlock.id)],
        toolUseResult: CANCELLED_BY_USER_MESSAGE,
        sourceToolAssistantUUID: (assistantMessage as any).uuid,
      }),
    };
    return;
  }

  for await (const res of executeToolWithProgress(
    tool, toolUseBlock.id, toolUseBlock.input, context, canUseTool, assistantMessage, messageId, requestId, mcpServerType
  )) {
    yield res;
  }
}
