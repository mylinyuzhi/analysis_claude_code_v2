/**
 * @claudecode/core - Tool Execution Flow
 *
 * Complete tool execution pipeline with validation, permissions, and hooks.
 * Reconstructed from chunks.134.mjs:660-1050
 *
 * Key symbols:
 * - jH1 → executeSingleTool (main entry)
 * - k77 → executeToolWithProgress (progress streaming wrapper)
 * - b77 → executeToolWithValidation (validation and permission flow)
 * - g77 → preToolUseHooks (pre-execution hooks)
 * - f77 → postToolUseHooks (post-execution hooks)
 * - K91 → findToolByName
 * - FM0 → createUserRejectedToolResult
 * - v4A → USER_REJECTED_CONTENT
 */

import { generateUUID } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ContentBlock } from '@claudecode/shared';
import type { ConversationMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext, ToolResult, ToolInput } from './types.js';
import type { ToolUseBlock, CanUseTool, ToolExecutionYield } from '../agent-loop/types.js';

// Import hooks from features package
import {
  executePreToolHooks,
  executePostToolHooks,
  executePostToolFailureHooks as executePostToolFailureHooksFromFeatures,
  type REPLHookYield,
  type HookExecutionResult,
  type PreToolUseOutput,
  type PostToolUseOutput,
} from '@claudecode/features';

// ============================================
// Constants
// ============================================

/**
 * User rejected content message.
 * Original: v4A in chunks.134.mjs
 */
export const USER_REJECTED_CONTENT = '<tool_use_error>User rejected tool use</tool_use_error>';

/**
 * Cancelled by user message.
 * Original: aVA in chunks.134.mjs
 */
export const CANCELLED_BY_USER_MESSAGE = 'Tool use cancelled by user';

// ============================================
// Helper Functions
// ============================================

/**
 * Find tool by name.
 * Original: K91 in chunks.134.mjs
 */
export function findToolByName(
  tools: ToolDefinition[],
  name: string
): ToolDefinition | undefined {
  return tools.find((t) => t.name === name);
}

/**
 * Get display name for tool (strips mcp__ prefix).
 * Original: k9 in chunks.134.mjs
 */
export function getToolDisplayName(name: string): string {
  if (name.startsWith('mcp__')) {
    return name.replace(/^mcp__[^_]+__/, '');
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
 * Original: v77 in chunks.134.mjs
 */
export function getMcpServerType(
  toolName: string,
  mcpClients: Array<{ name: string; type?: string; config?: { type?: string } }>
): string | undefined {
  if (!toolName.startsWith('mcp__')) return undefined;

  const parsed = parseMcpToolName(toolName);
  if (!parsed) return undefined;

  const client = mcpClients.find((c) => c.name === parsed.serverName);
  if (client?.type === 'connected') {
    return (client.config as { type?: string })?.type ?? 'stdio';
  }
  return undefined;
}

/**
 * Create user rejected tool result.
 * Original: FM0 in chunks.134.mjs
 */
export function createUserRejectedToolResult(toolUseId: string): ContentBlock {
  return {
    type: 'tool_result',
    content: USER_REJECTED_CONTENT,
    is_error: true,
    tool_use_id: toolUseId,
  } as ContentBlock;
}

/**
 * Format Zod validation error.
 * Original: u77 in chunks.134.mjs
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
// Telemetry (Placeholder)
// ============================================

function logTelemetry(event: string, data: Record<string, unknown>): void {
  if (process.env.DEBUG_TELEMETRY) {
    console.log(`[Telemetry] ${event}:`, data);
  }
}

function logError(error: Error): void {
  if (process.env.DEBUG_ERRORS) {
    console.error('[Error]', error);
  }
}

// ============================================
// Progress Queue
// ============================================

/**
 * Async queue for streaming progress.
 * Original: khA in chunks.134.mjs
 */
class AsyncQueue<T> {
  private queue: T[] = [];
  private waiting: Array<{ resolve: (value: T | undefined) => void; reject: (error: Error) => void }> = [];
  private isDone = false;
  private error: Error | null = null;

  enqueue(item: T): void {
    if (this.isDone) return;

    if (this.waiting.length > 0) {
      const waiter = this.waiting.shift()!;
      waiter.resolve(item);
    } else {
      this.queue.push(item);
    }
  }

  done(): void {
    this.isDone = true;
    for (const waiter of this.waiting) {
      waiter.resolve(undefined);
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
      if (this.error) {
        throw this.error;
      }

      if (this.queue.length > 0) {
        yield this.queue.shift()!;
        continue;
      }

      if (this.isDone) {
        return;
      }

      const item = await new Promise<T | undefined>((resolve, reject) => {
        this.waiting.push({ resolve, reject });
      });

      if (item === undefined) {
        return;
      }

      yield item;
    }
  }
}

// ============================================
// Pre-Tool Use Hooks
// ============================================

/**
 * Hook permission result.
 */
export interface HookPermissionResult {
  behavior: 'allow' | 'deny' | 'ask';
  updatedInput?: ToolInput;
  message?: string;
}

/**
 * Execute pre-tool use hooks.
 * Original: g77 in chunks.134.mjs
 *
 * Integrates with @claudecode/features/hooks executePreToolHooks.
 */
async function* executePreToolUseHooks(
  context: ToolUseContext,
  tool: ToolDefinition,
  input: ToolInput,
  toolUseId: string,
  messageId: string,
  requestId?: string,
  mcpServerType?: string
): AsyncGenerator<{
  type: 'message' | 'hookPermissionResult' | 'hookUpdatedInput' | 'preventContinuation' | 'stopReason' | 'stop';
  message?: ConversationMessage;
  hookPermissionResult?: HookPermissionResult;
  updatedInput?: ToolInput;
  shouldPreventContinuation?: boolean;
  stopReason?: string;
}> {
  // Get permission mode from context
  const permissionMode = context.options?.permissionMode ?? 'default';
  const signal = context.abortController?.signal;

  try {
    // Execute hooks from features package
    for await (const hookYield of executePreToolHooks(
      tool.name,
      toolUseId,
      input,
      context,
      permissionMode,
      signal
    )) {
      // Process hook yield results
      if (hookYield.preventContinuation) {
        yield {
          type: 'preventContinuation',
          shouldPreventContinuation: true,
        };
        yield {
          type: 'stopReason',
          stopReason: hookYield.stopReason,
        };
        yield { type: 'stop' };
        return;
      }

      // Check for permission decisions in hook output
      if (hookYield.result?.output) {
        const output = hookYield.result.output as { hookSpecificOutput?: PreToolUseOutput };
        const specificOutput = output.hookSpecificOutput;

        if (specificOutput?.hookEventName === 'PreToolUse') {
          // Handle permission decision
          if (specificOutput.permissionDecision) {
            yield {
              type: 'hookPermissionResult',
              hookPermissionResult: {
                behavior: specificOutput.permissionDecision,
                updatedInput: specificOutput.updatedInput as ToolInput | undefined,
                message: specificOutput.permissionDecisionReason,
              },
            };
          }

          // Handle updated input
          if (specificOutput.updatedInput) {
            yield {
              type: 'hookUpdatedInput',
              updatedInput: specificOutput.updatedInput as ToolInput,
            };
          }
        }
      }

      // Check for blocking outcomes
      if (hookYield.result?.outcome === 'blocking') {
        yield {
          type: 'hookPermissionResult',
          hookPermissionResult: {
            behavior: 'deny',
            message: hookYield.result.blockingError?.blockingError || 'Hook blocked operation',
          },
        };
      }

      if (process.env.DEBUG_HOOKS) {
        console.log(`[Hooks] PreToolUse result for ${tool.name}:`, hookYield.result);
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));
  }
}

// ============================================
// Post-Tool Use Hooks
// ============================================

/**
 * Execute post-tool use hooks.
 * Original: f77 in chunks.134.mjs
 *
 * Integrates with @claudecode/features/hooks executePostToolHooks.
 */
async function* executePostToolUseHooks(
  context: ToolUseContext,
  tool: ToolDefinition,
  toolUseId: string,
  messageId: string,
  input: ToolInput,
  result: unknown,
  requestId?: string,
  mcpServerType?: string
): AsyncGenerator<{
  updatedMCPToolOutput?: unknown;
  message?: ConversationMessage;
}> {
  // Get permission mode from context
  const permissionMode = context.options?.permissionMode ?? 'default';
  const signal = context.abortController?.signal;

  try {
    // Execute hooks from features package
    for await (const hookYield of executePostToolHooks(
      tool.name,
      toolUseId,
      input,
      result,
      context,
      permissionMode,
      signal
    )) {
      // Check for MCP output updates in hook result
      if (hookYield.result?.output) {
        const output = hookYield.result.output as { hookSpecificOutput?: PostToolUseOutput };
        const specificOutput = output.hookSpecificOutput;

        if (specificOutput?.hookEventName === 'PostToolUse') {
          // Handle updated MCP tool output
          if (specificOutput.updatedMCPToolOutput !== undefined) {
            yield {
              updatedMCPToolOutput: specificOutput.updatedMCPToolOutput,
            };
          }

          // Handle additional context (create a message for it)
          if (specificOutput.additionalContext) {
            yield {
              message: createUserMessage({
                content: `[PostToolUse Hook Context]: ${specificOutput.additionalContext}`,
                isHookOutput: true,
              }),
            };
          }
        }
      }

      if (process.env.DEBUG_HOOKS) {
        console.log(`[Hooks] PostToolUse result for ${tool.name}:`, hookYield.result);
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));
  }
}

// ============================================
// Post-Tool Use Failure Hooks
// ============================================

/**
 * Execute post-tool use failure hooks.
 * Original: p77 in chunks.134.mjs
 *
 * Integrates with @claudecode/features/hooks executePostToolFailureHooks.
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
  // Get permission mode from context
  const permissionMode = context.options?.permissionMode ?? 'default';
  const signal = context.abortController?.signal;

  try {
    // Execute hooks from features package
    for await (const hookYield of executePostToolFailureHooksFromFeatures(
      tool.name,
      toolUseId,
      input,
      error,
      isInterrupt,
      context,
      permissionMode,
      signal
    )) {
      // Log hook results for failures
      if (process.env.DEBUG_HOOKS) {
        console.log(`[Hooks] PostToolUseFailure result for ${tool.name}:`, hookYield.result);
      }
    }
  } catch (hookError) {
    logError(hookError instanceof Error ? hookError : new Error(String(hookError)));
  }
}

// ============================================
// Tool Result Creation
// ============================================

/**
 * Create tool result content block.
 * Original: YZ1 in chunks.134.mjs
 */
async function createToolResultContent(
  tool: ToolDefinition,
  result: unknown,
  toolUseId: string
): Promise<ContentBlock> {
  let content: string;

  if (typeof result === 'string') {
    content = result;
  } else if (result === null || result === undefined) {
    content = '';
  } else {
    try {
      content = JSON.stringify(result, null, 2);
    } catch {
      content = String(result);
    }
  }

  return {
    type: 'tool_result',
    content,
    tool_use_id: toolUseId,
  } as ContentBlock;
}

// ============================================
// Main Tool Execution
// ============================================

/**
 * Execute tool with validation and hooks.
 * Original: b77 in chunks.134.mjs:772-1050
 *
 * @param tool - Tool definition
 * @param toolUseId - Tool use ID
 * @param input - Tool input
 * @param context - Tool use context
 * @param canUseTool - Permission checker
 * @param assistantMessage - Assistant message containing tool use
 * @param messageId - Message ID
 * @param requestId - Request ID
 * @param mcpServerType - MCP server type (if applicable)
 * @param progressCallback - Progress callback
 * @returns Array of tool execution yields
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
  const results: ToolExecutionYield[] = [];

  // 1. Validate input schema
  if (tool.inputSchema) {
    const parsed = tool.inputSchema.safeParse(input);
    if (!parsed.success) {
      const errorMessage = formatValidationError(tool.name, parsed.error);

      logTelemetry('tengu_tool_use_error', {
        error: 'InputValidationError',
        errorDetails: errorMessage.slice(0, 2000),
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        isMcp: tool.isMcp ?? false,
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });

      results.push({
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
              is_error: true,
              tool_use_id: toolUseId,
            } as ContentBlock,
          ],
          toolUseResult: `InputValidationError: ${parsed.error.message}`,
          sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
        }),
      });
      return results;
    }
    input = parsed.data;
  }

  // 2. Run custom input validation
  if (tool.validateInput) {
    const validationResult = await tool.validateInput(input, context);
    if (validationResult?.result === false) {
      logTelemetry('tengu_tool_use_error', {
        messageID: messageId,
        toolName: getToolDisplayName(tool.name),
        error: validationResult.message,
        errorCode: validationResult.errorCode,
        isMcp: tool.isMcp ?? false,
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });

      results.push({
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: `<tool_use_error>${validationResult.message}</tool_use_error>`,
              is_error: true,
              tool_use_id: toolUseId,
            } as ContentBlock,
          ],
          toolUseResult: `Error: ${validationResult.message}`,
          sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
        }),
      });
      return results;
    }
  }

  // 3. Execute pre-tool hooks
  let hookPermissionResult: HookPermissionResult | undefined;
  let preventContinuation = false;
  let stopReason: string | undefined;

  for await (const hookYield of executePreToolUseHooks(
    context,
    tool,
    input,
    toolUseId,
    messageId,
    requestId,
    mcpServerType
  )) {
    switch (hookYield.type) {
      case 'message':
        if (hookYield.message) {
          const msg = hookYield.message as { message?: { type?: string } };
          if (msg.message?.type === 'progress' && progressCallback) {
            progressCallback({ toolUseID: toolUseId, data: hookYield.message });
          } else {
            results.push({ message: hookYield.message });
          }
        }
        break;
      case 'hookPermissionResult':
        hookPermissionResult = hookYield.hookPermissionResult;
        break;
      case 'hookUpdatedInput':
        if (hookYield.updatedInput) {
          input = hookYield.updatedInput;
        }
        break;
      case 'preventContinuation':
        preventContinuation = hookYield.shouldPreventContinuation ?? false;
        break;
      case 'stopReason':
        stopReason = hookYield.stopReason;
        break;
      case 'stop':
        results.push({
          message: createUserMessage({
            content: [createUserRejectedToolResult(toolUseId)],
            toolUseResult: `Error: ${stopReason}`,
            sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
          }),
        });
        return results;
    }
  }

  // 4. Check permission
  let permissionResult: { behavior: string; message?: string; updatedInput?: ToolInput; userModified?: boolean; acceptFeedback?: string };

  if (hookPermissionResult?.behavior === 'allow' && !tool.requiresUserInteraction?.()) {
    // Hook approved, skip permission check
    permissionResult = hookPermissionResult;
  } else if (hookPermissionResult?.behavior === 'deny') {
    // Hook denied
    permissionResult = hookPermissionResult;
  } else {
    // Ask for permission (execution pipeline expects structured result)
    const canUseResult = await canUseTool(tool, input, assistantMessage);
    
    if (typeof canUseResult === 'boolean') {
      permissionResult = canUseResult
        ? { behavior: 'allow' }
        : { behavior: 'deny', message: USER_REJECTED_CONTENT };
    } else {
      permissionResult = {
        behavior: canUseResult.behavior ?? (canUseResult.result ? 'allow' : 'deny'),
        message: canUseResult.message,
        updatedInput: (canUseResult as any).updatedInput,
        userModified: (canUseResult as any).userModified,
        acceptFeedback: (canUseResult as any).acceptFeedback,
      };
      
      if (!permissionResult.message && permissionResult.behavior === 'deny') {
        permissionResult.message = USER_REJECTED_CONTENT;
      }
    }
  }

  // 5. Handle permission denial
  if (permissionResult.behavior !== 'allow') {
    const decision = context.toolDecisions?.get(toolUseId);

    logTelemetry('tengu_tool_use_can_use_tool_rejected', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    let errorMessage = permissionResult.message;
    if (preventContinuation && !errorMessage) {
      errorMessage = `Execution stopped by PreToolUse hook${stopReason ? `: ${stopReason}` : ''}`;
    }

    results.push({
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: errorMessage || USER_REJECTED_CONTENT,
            is_error: true,
            tool_use_id: toolUseId,
          } as ContentBlock,
        ],
        toolUseResult: `Error: ${errorMessage}`,
        sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
      }),
    });
    return results;
  }

  // 6. Update input if permission modified it
  if (permissionResult.updatedInput !== undefined) {
    input = permissionResult.updatedInput;
  }

  logTelemetry('tengu_tool_use_can_use_tool_allowed', {
    messageID: messageId,
    toolName: getToolDisplayName(tool.name),
    queryChainId: context.queryTracking?.chainId,
    queryDepth: context.queryTracking?.depth,
    ...(mcpServerType ? { mcpServerType } : {}),
    ...(requestId ? { requestId } : {}),
  });

  // 7. Execute the tool
  const startTime = Date.now();

  try {
    const toolResult = await tool.call(
      input,
      {
        ...context,
        userModified: permissionResult.userModified ?? false,
      },
      toolUseId,
      { assistantMessage, canUseTool },
      progressCallback
        ? (progress) => {
            progressCallback({ toolUseID: toolUseId, data: progress });
          }
        : undefined
    );

    const durationMs = Date.now() - startTime;

    // Calculate result size
    let resultSizeBytes = 0;
    try {
      resultSizeBytes = JSON.stringify(toolResult.data).length;
    } catch {
      // Ignore serialization errors
    }

    logTelemetry('tengu_tool_use_success', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      isMcp: tool.isMcp ?? false,
      durationMs,
      toolResultSizeBytes: resultSizeBytes,
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    // Handle structured output
    if (typeof toolResult === 'object' && 'structured_output' in toolResult) {
      results.push({
        message: {
          type: 'attachment',
          uuid: generateUUID(),
          timestamp: new Date().toISOString(),
          attachment: {
            type: 'structured_output',
            data: (toolResult as { structured_output: unknown }).structured_output,
          },
        } as ConversationMessage,
      });
    }

    // Create tool result message
    const resultContent = await createToolResultContent(tool, toolResult.data, toolUseId);
    const contentBlocks: ContentBlock[] = [resultContent];

    // Add accept feedback if present
    if ('acceptFeedback' in permissionResult && permissionResult.acceptFeedback) {
      contentBlocks.push({
        type: 'text',
        text: permissionResult.acceptFeedback,
      } as ContentBlock);
    }

    results.push({
      message: createUserMessage({
        content: contentBlocks,
        toolUseResult: typeof toolResult.data === 'string' ? toolResult.data : JSON.stringify(toolResult.data),
        sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
      }),
      contextModifier: toolResult.contextModifier ? {
        toolUseID: toolUseId,
        modifyContext: toolResult.contextModifier.modifyContext
      } : undefined,
    });

    // 8. Execute post-tool hooks
    for await (const hookYield of executePostToolUseHooks(
      context,
      tool,
      toolUseId,
      messageId,
      input,
      toolResult.data,
      requestId,
      mcpServerType
    )) {
      if ('updatedMCPToolOutput' in hookYield) {
        // MCP output was modified by hook
        // In real implementation, would update the result
      } else if (hookYield.message) {
        results.push({ message: hookYield.message });
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));

    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullError = `Error calling tool${tool ? ` (${tool.name})` : ''}: ${errorMessage}`;

    results.push({
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: `<tool_use_error>${fullError}</tool_use_error>`,
            is_error: true,
            tool_use_id: toolUseId,
          } as ContentBlock,
        ],
        toolUseResult: fullError,
        sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
      }),
    });
  }

  return results;
}

// ============================================
// Progress Streaming Wrapper
// ============================================

/**
 * Execute tool with progress streaming.
 * Original: k77 in chunks.134.mjs:741-770
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

  // Progress callback that enqueues progress messages
  const progressCallback = (progress: { toolUseID: string; data: unknown }) => {
    logTelemetry('tengu_tool_use_progress', {
      messageID: messageId,
      toolName: getToolDisplayName(tool.name),
      isMcp: tool.isMcp ?? false,
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
        toolUseID: progress.toolUseID,
        parentToolUseID: toolUseId,
        data: progress.data,
      } as ConversationMessage,
    });
  };

  // Execute tool and enqueue results
  executeToolWithValidation(
    tool,
    toolUseId,
    input,
    context,
    canUseTool,
    assistantMessage,
    messageId,
    requestId,
    mcpServerType,
    progressCallback
  )
    .then((results) => {
      for (const result of results) {
        queue.enqueue(result);
      }
    })
    .catch((error) => {
      queue.setError(error instanceof Error ? error : new Error(String(error)));
    })
    .finally(() => {
      queue.done();
    });

  return queue;
}

// ============================================
// Main Entry Point
// ============================================

/**
 * Execute single tool.
 * Original: jH1 in chunks.134.mjs:660-739
 *
 * Main entry point for tool execution. Handles:
 * 1. Tool not found errors
 * 2. Abort checking
 * 3. Delegation to executeToolWithProgress
 *
 * @param toolUseBlock - Tool use block from assistant message
 * @param assistantMessage - Assistant message containing the tool use
 * @param canUseTool - Permission checker function
 * @param context - Tool use context
 * @yields Tool execution results and progress
 */
export async function* executeSingleTool(
  toolUseBlock: ToolUseBlock,
  assistantMessage: ConversationMessage,
  canUseTool: CanUseTool,
  context: ToolUseContext
): AsyncGenerator<ToolExecutionYield> {
  const toolName = toolUseBlock.name;
  const tool = findToolByName(context.options.tools, toolName);
  const messageId = (assistantMessage as { message?: { id?: string } }).message?.id || '';
  const requestId = (assistantMessage as { requestId?: string }).requestId;
  const mcpServerType = getMcpServerType(
    toolName,
    (context.options.mcpClients as any) || []
  );

  // Handle tool not found
  if (!tool) {
    const displayName = getToolDisplayName(toolName);

    logTelemetry('tengu_tool_use_error', {
      error: `No such tool available: ${displayName}`,
      toolName: displayName,
      toolUseID: toolUseBlock.id,
      isMcp: toolName.startsWith('mcp__'),
      queryChainId: context.queryTracking?.chainId,
      queryDepth: context.queryTracking?.depth,
      ...(mcpServerType ? { mcpServerType } : {}),
      ...(requestId ? { requestId } : {}),
    });

    yield {
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
            is_error: true,
            tool_use_id: toolUseBlock.id,
          } as ContentBlock,
        ],
        toolUseResult: `Error: No such tool available: ${toolName}`,
        sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
      }),
    };
    return;
  }

  const input = toolUseBlock.input;

  try {
    // Check for abort before execution
    if (context.abortController?.signal.aborted) {
      logTelemetry('tengu_tool_use_cancelled', {
        toolName: getToolDisplayName(tool.name),
        toolUseID: toolUseBlock.id,
        isMcp: tool.isMcp ?? false,
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
        ...(mcpServerType ? { mcpServerType } : {}),
        ...(requestId ? { requestId } : {}),
      });

      yield {
        message: createUserMessage({
          content: [createUserRejectedToolResult(toolUseBlock.id)],
          toolUseResult: CANCELLED_BY_USER_MESSAGE,
          sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
        }),
      };
      return;
    }

    // Execute tool with progress streaming
    for await (const result of executeToolWithProgress(
      tool,
      toolUseBlock.id,
      input,
      context,
      canUseTool,
      assistantMessage,
      messageId,
      requestId,
      mcpServerType
    )) {
      yield result;
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));

    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullError = `Error calling tool${tool ? ` (${tool.name})` : ''}: ${errorMessage}`;
    const isInterrupt = context.abortController?.signal.aborted ?? false;

    // Execute post-tool failure hooks
    for await (const hookResult of executePostToolFailureHooks(
      context,
      tool,
      toolUseBlock.id,
      input,
      errorMessage,
      isInterrupt
    )) {
      if (hookResult.message) {
        yield { message: hookResult.message };
      }
    }

    yield {
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: `<tool_use_error>${fullError}</tool_use_error>`,
            is_error: true,
            tool_use_id: toolUseBlock.id,
          } as ContentBlock,
        ],
        toolUseResult: fullError,
        sourceToolAssistantUUID: (assistantMessage as { uuid: string }).uuid,
      }),
    };
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
