/**
 * @claudecode/core - Core Message Loop
 *
 * Main message processing loop for agent execution.
 * Reconstructed from chunks.134.mjs:99-410
 *
 * Key symbols:
 * - aN → coreMessageLoop (main function)
 * - _H1 → StreamingToolExecutor
 * - lc → microCompact
 * - ys2 → autoCompactDispatcher
 * - _x → normalizeMessages
 * - oHA → streamApiResponse
 * - HQA → resolveModelWithPermissions
 * - fA9 → mergeSystemPromptWithContext
 * - _3A → addUserContextToMessages
 * - KM0 → executeToolsSequentially
 * - FHA → formatCompactionMessages
 * - FI → normalizeToolResults
 */

import { generateUUID } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ConversationMessage, ContentBlock } from '../message/types.js';
import type { ToolUseContext } from '../tools/types.js';
import { StreamingToolExecutor } from './streaming-tool-executor.js';
import { streamApiCall, type StreamApiCallOptions } from '../llm-api/streaming.js';
import type {
  CoreMessageLoopOptions,
  LoopEvent,
  AutoCompactTracking,
  ToolUseBlock,
  QueryTracking,
} from './types.js';
import { AGENT_LOOP_CONSTANTS } from './types.js';

// ============================================
// Performance Markers
// ============================================

/**
 * Performance marker storage.
 */
const performanceMarkers = new Map<string, number>();

/**
 * Record a performance marker.
 * Original: h6 in chunks.134.mjs
 */
function recordMarker(name: string): void {
  performanceMarkers.set(name, Date.now());
}

/**
 * Log telemetry event.
 * Original: l in chunks (telemetry)
 */
function logTelemetry(event: string, data: Record<string, unknown>): void {
  if (process.env.DEBUG_TELEMETRY) {
    console.log(`[Telemetry] ${event}:`, data);
  }
}

/**
 * Log error to error tracking.
 * Original: e in chunks
 */
function logError(error: Error): void {
  if (process.env.DEBUG_ERRORS) {
    console.error('[Error]', error);
  }
}

/**
 * Log exception with context.
 * Original: xM in chunks
 */
function logException(context: string, error: unknown): void {
  if (process.env.DEBUG_ERRORS) {
    console.error(`[Exception] ${context}:`, error);
  }
}

// ============================================
// Feature Flags
// ============================================

/**
 * Check if feature is enabled.
 * Original: f8 in chunks
 */
function isFeatureEnabled(feature: string): boolean {
  // Check environment variable override
  const envVar = `FEATURE_${feature.toUpperCase().replace(/-/g, '_')}`;
  if (process.env[envVar]) {
    return process.env[envVar] === 'true';
  }

  // Default feature states
  const defaultFeatures: Record<string, boolean> = {
    tengu_streaming_tool_execution2: true,
  };

  return defaultFeatures[feature] ?? false;
}

// ============================================
// Message Processing
// ============================================

/**
 * Normalize messages for API submission.
 * Original: _x in chunks.134.mjs
 */
function normalizeMessages(
  messages: ConversationMessage[]
): ConversationMessage[] {
  // Filter out non-API messages and normalize structure
  return messages.filter((msg) => {
    // Keep user, assistant, and tool result messages
    if (msg.type === 'user' || msg.type === 'assistant') return true;
    // Keep attachments that contribute to conversation
    if (msg.type === 'attachment') {
      const attachment = (msg as { attachment?: { type?: string } }).attachment;
      return (
        attachment?.type === 'tool_result' ||
        attachment?.type === 'edited_text_file' ||
        attachment?.type === 'error'
      );
    }
    return false;
  });
}

/**
 * Add user context to messages.
 * Original: _3A in chunks.134.mjs
 */
function addUserContextToMessages(
  messages: ConversationMessage[],
  userContext?: string
): ConversationMessage[] {
  if (!userContext) return messages;

  // Inject user context into system reminders
  return messages.map((msg) => {
    if (msg.type === 'user') {
      // Add context as system reminder
      return {
        ...msg,
        systemReminder: userContext,
      };
    }
    return msg;
  });
}

/**
 * Merge system prompt with context.
 * Original: fA9 in chunks.134.mjs
 */
function mergeSystemPromptWithContext(
  systemPrompt: string,
  systemContext?: string
): string {
  if (!systemContext) return systemPrompt;
  return `${systemPrompt}\n\n${systemContext}`;
}

/**
 * Resolve model with permissions.
 * Original: HQA in chunks.134.mjs
 */
function resolveModelWithPermissions(options: {
  permissionMode: string;
  mainLoopModel?: string;
  exceeds200kTokens?: boolean;
}): string {
  const { permissionMode, mainLoopModel, exceeds200kTokens } = options;

  // If in plan mode with large context, may need different model
  if (permissionMode === 'plan' && exceeds200kTokens) {
    // Use extended context model
    return 'claude-sonnet-4-20250514';
  }

  return mainLoopModel || 'claude-sonnet-4-20250514';
}

/**
 * Check if at blocking token limit.
 * Original: ic in chunks.134.mjs
 */
function checkTokenLimit(tokenCount: number): { isAtBlockingLimit: boolean } {
  const maxTokens = parseInt(process.env.CLAUDE_CODE_MAX_TOKENS || '200000', 10);
  return {
    isAtBlockingLimit: tokenCount > maxTokens,
  };
}

/**
 * Estimate token count for messages.
 * Original: HKA in chunks
 */
function estimateTokenCount(messages: ConversationMessage[]): number {
  let count = 0;
  for (const msg of messages) {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if ((block as { type: string }).type === 'text') {
          // Rough estimate: 4 characters per token
          count += Math.ceil(((block as { text: string }).text || '').length / 4);
        } else if ((block as { type: string }).type === 'tool_result') {
          const resultContent = (block as { content?: string }).content || '';
          count += Math.ceil(resultContent.length / 4);
        }
      }
    }
  }
  return count;
}

/**
 * Check if messages exceed 200k tokens.
 * Original: h51 in chunks.134.mjs
 */
function exceeds200kTokens(messages: ConversationMessage[]): boolean {
  return estimateTokenCount(messages) > 200000;
}

// ============================================
// Message Factories
// ============================================

/**
 * Create error attachment message.
 * Original: DZ in chunks.134.mjs
 */
function createErrorAttachment(options: {
  content: string;
  error?: string;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: 'error',
      content: options.content,
      error: options.error,
    },
  } as ConversationMessage;
}

/**
 * Create interrupted attachment message.
 * Original: fhA in chunks.134.mjs
 */
function createInterruptedAttachment(options: {
  toolUse: boolean;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: 'interrupted',
      toolUse: options.toolUse,
    },
  } as ConversationMessage;
}

/**
 * Create max turns attachment message.
 * Original: X4 in chunks.134.mjs
 */
function createMaxTurnsAttachment(options: {
  type: string;
  maxTurns: number;
  turnCount: number;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: options.type,
      maxTurns: options.maxTurns,
      turnCount: options.turnCount,
    },
  } as ConversationMessage;
}

/**
 * Create system message.
 * Original: hO in chunks.134.mjs
 */
function createSystemMessage(
  content: string,
  level: 'info' | 'warning' | 'error'
): ConversationMessage {
  return {
    type: 'system',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    content,
    level,
  } as ConversationMessage;
}

/**
 * Create tool result messages for error case.
 * Original: DM0 in chunks.134.mjs:83-97
 */
function* createToolErrorResults(
  assistantMessages: ConversationMessage[],
  errorMessage: string
): Generator<ConversationMessage> {
  for (const msg of assistantMessages) {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (!Array.isArray(content)) continue;

    const toolUses = content.filter(
      (block): block is ToolUseBlock => (block as { type: string }).type === 'tool_use'
    );

    for (const toolUse of toolUses) {
      yield createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: errorMessage,
            is_error: true,
            tool_use_id: toolUse.id,
          },
        ],
        toolUseResult: errorMessage,
        sourceToolAssistantUUID: (msg as { uuid: string }).uuid,
      }) as ConversationMessage;
    }
  }
}

// ============================================
// Compaction (Placeholders)
// ============================================

/**
 * Micro-compact messages.
 * Original: lc in chunks.134.mjs
 */
async function microCompact(
  messages: ConversationMessage[],
  _options: unknown,
  _context: ToolUseContext
): Promise<{
  messages: ConversationMessage[];
  compactionInfo?: { systemMessage?: ConversationMessage };
}> {
  // Placeholder - would integrate with compact module
  return { messages };
}

/**
 * Auto-compact dispatcher.
 * Original: ys2 in chunks.134.mjs
 */
async function autoCompactDispatcher(
  messages: ConversationMessage[],
  _context: ToolUseContext,
  _querySource?: string
): Promise<{
  compactionResult?: {
    summaryMessages: ConversationMessage[];
    attachments: ConversationMessage[];
    hookResults: ConversationMessage[];
    preCompactTokenCount: number;
    postCompactTokenCount: number;
    compactionUsage?: {
      input_tokens: number;
      output_tokens: number;
      cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number;
    };
  };
}> {
  // Placeholder - would integrate with compact module
  return {};
}

/**
 * Format compaction messages.
 * Original: FHA in chunks.134.mjs
 */
function formatCompactionMessages(
  compactionResult: NonNullable<Awaited<ReturnType<typeof autoCompactDispatcher>>['compactionResult']>
): ConversationMessage[] {
  return [
    ...compactionResult.summaryMessages,
    ...compactionResult.attachments,
    ...compactionResult.hookResults,
  ];
}

// ============================================
// Tool Execution
// ============================================

/**
 * Normalize tool results to messages.
 * Original: FI in chunks.134.mjs
 */
function normalizeToolResults(
  messages: ConversationMessage[],
  _tools: unknown[]
): ConversationMessage[] {
  return messages.filter((msg) => msg.type === 'user');
}

/**
 * Execute tools sequentially.
 * Original: KM0 in chunks.134.mjs:351-361
 */
async function* executeToolsSequentially(
  toolCalls: ToolUseBlock[],
  assistantMessages: ConversationMessage[],
  canUseTool: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  toolUseContext: ToolUseContext
): AsyncGenerator<{
  message?: ConversationMessage;
  newContext?: ToolUseContext;
}> {
  for (const toolCall of toolCalls) {
    // Find the assistant message containing this tool call
    const sourceMessage = assistantMessages.find((msg) => {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (!Array.isArray(content)) return false;
      return content.some(
        (block) =>
          (block as { type: string; id?: string }).type === 'tool_use' &&
          (block as { id: string }).id === toolCall.id
      );
    });

    if (!sourceMessage) continue;

    // Check permission
    const tool = toolUseContext.options.tools.find(
      (t) => (t as { name: string }).name === toolCall.name
    );
    if (!tool) continue;

    const allowed = await canUseTool(tool, toolCall.input, sourceMessage);
    if (!allowed) {
      yield {
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: 'Tool use denied by permission check',
              is_error: true,
              tool_use_id: toolCall.id,
            },
          ],
          toolUseResult: 'Tool use denied',
          sourceToolAssistantUUID: (sourceMessage as { uuid: string }).uuid,
        }) as ConversationMessage,
      };
      continue;
    }

    // Execute tool (placeholder - would call actual tool executor)
    yield {
      message: createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: 'Tool execution placeholder',
            tool_use_id: toolCall.id,
          },
        ],
        sourceToolAssistantUUID: (sourceMessage as { uuid: string }).uuid,
      }) as ConversationMessage,
    };
  }
}

// ============================================
// API Streaming
// ============================================

/**
 * Model fallback error.
 * Original: y51 in chunks.134.mjs
 */
class ModelFallbackError extends Error {
  constructor(
    public originalModel: string,
    public fallbackModel: string
  ) {
    super(`Model fallback from ${originalModel} to ${fallbackModel}`);
    this.name = 'ModelFallbackError';
  }
}

/**
 * Invalid request error.
 */
class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequestError';
  }
}

/**
 * Server error.
 */
class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

/**
 * Stream API response.
 * Original: oHA in chunks.134.mjs
 *
 * Integrates with the LLM API streaming module to get responses from Claude.
 */
async function* streamApiResponse(options: {
  messages: ConversationMessage[];
  systemPrompt: string;
  maxThinkingTokens?: number;
  tools: unknown[];
  signal?: AbortSignal;
  options: {
    getToolPermissionContext: () => Promise<unknown>;
    model: string;
    toolChoice?: unknown;
    isNonInteractiveSession?: boolean;
    fallbackModel?: string;
    onStreamingFallback?: () => void;
    querySource?: string;
    agents?: unknown[];
    hasAppendSystemPrompt?: boolean;
    maxOutputTokensOverride?: number;
    fetchOverride?: unknown;
    mcpTools?: unknown[];
    queryTracking: QueryTracking;
    taskIntensityOverride?: unknown;
    agentId?: string;
  };
}): AsyncGenerator<ConversationMessage> {
  // Build request payload for the API
  const request = {
    model: options.options.model,
    messages: options.messages.map((msg) => {
      // Convert to API message format
      if (msg.type === 'user') {
        return {
          role: 'user' as const,
          content: (msg as { message?: { content?: unknown } }).message?.content || '',
        };
      } else if (msg.type === 'assistant') {
        return {
          role: 'assistant' as const,
          content: (msg as { message?: { content?: unknown[] } }).message?.content || [],
        };
      }
      return null;
    }).filter(Boolean) as Array<{ role: 'user' | 'assistant'; content: unknown }>,
    system: options.systemPrompt,
    max_tokens: options.options.maxOutputTokensOverride || 8192,
    tools: options.tools as Array<{ name: string; description: string; input_schema: unknown }>,
  };

  // Stream options
  const streamOptions: StreamApiCallOptions = {
    model: options.options.model,
    fallbackModel: options.options.fallbackModel,
    maxThinkingTokens: options.maxThinkingTokens,
    tools: options.tools as Array<{ name: string; description: string; input_schema: unknown }>,
    agentId: options.options.agentId,
    signal: options.signal,
    onStreamingFallback: options.options.onStreamingFallback,
    fetchOverride: options.options.fetchOverride as typeof fetch | undefined,
  };

  try {
    // Use the real streaming API
    for await (const result of streamApiCall(request, streamOptions)) {
      if (result.type === 'assistant') {
        // Convert streaming result to ConversationMessage format
        const message: ConversationMessage = {
          type: 'assistant',
          uuid: result.message.uuid || generateUUID(),
          timestamp: new Date().toISOString(),
          message: {
            role: 'assistant',
            content: result.message.content,
          },
        } as ConversationMessage;

        yield message;
      } else if (result.type === 'stream_event') {
        // Could yield stream events for UI if needed
        // For now, we only yield complete assistant messages
      } else if (result.type === 'api_error') {
        // Handle API errors
        const errorMessage: ConversationMessage = {
          type: 'attachment',
          uuid: generateUUID(),
          timestamp: new Date().toISOString(),
          attachment: {
            type: 'error',
            content: result.error.message,
            apiError: result.error.type,
          },
        } as ConversationMessage;

        yield errorMessage;
      } else if (result.type === 'retry') {
        // Log retry attempts
        logTelemetry('tengu_api_retry', {
          attempt: result.attempt,
          maxAttempts: result.maxAttempts,
          delayMs: result.delayMs,
        });
      }
    }
  } catch (error) {
    // Convert errors to appropriate types
    if (error instanceof Error) {
      if (error.message.includes('fallback')) {
        throw new ModelFallbackError(options.options.model, options.options.fallbackModel || '');
      }
      if (error.message.includes('invalid_request')) {
        throw new InvalidRequestError(error.message);
      }
      if (error.message.includes('server')) {
        throw new ServerError(error.message);
      }
    }
    throw error;
  }
}

// ============================================
// Attachments Processing
// ============================================

/**
 * Process pending attachments.
 * Original: VHA in chunks.134.mjs
 */
async function* processPendingAttachments(
  _hookResult: unknown,
  _context: ToolUseContext,
  _subAgentResult: unknown,
  _queuedCommands: unknown[],
  _messages: ConversationMessage[],
  _querySource?: string
): AsyncGenerator<ConversationMessage> {
  // Placeholder - would process file change attachments, etc.
}

/**
 * Check if message is a file change attachment.
 * Original: uF1 in chunks.134.mjs
 */
function isFileChangeAttachment(message: ConversationMessage): boolean {
  if (message.type === 'attachment') {
    const attachment = (message as { attachment?: { type?: string } }).attachment;
    return attachment?.type === 'edited_text_file';
  }
  return false;
}

/**
 * Update queued commands.
 * Original: U32 in chunks.134.mjs
 */
function updateQueuedCommands(
  _commands: unknown[],
  _setAppState: (update: (state: unknown) => unknown) => void
): void {
  // Placeholder - would update app state with prompt commands
}

// ============================================
// Response Analysis
// ============================================

/**
 * Check for overly agreeable response.
 * Original: lA9 in chunks.134.mjs
 */
function isOverlyAgreeable(text: string): boolean {
  const agreeablePatterns = [
    /you're absolutely right/i,
    /you're completely correct/i,
    /that's exactly right/i,
  ];
  return agreeablePatterns.some((pattern) => pattern.test(text));
}

/**
 * Record API call info.
 * Original: aA9 in chunks.134.mjs
 */
function recordApiCallInfo(
  _messages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _context?: ToolUseContext,
  _querySource?: string
): void {
  // Placeholder - would record for debugging/analysis
}

/**
 * Get task intensity override.
 * Original: w3A in chunks.134.mjs
 */
function getTaskIntensityOverride(): unknown {
  return undefined;
}

// ============================================
// Post-Turn Processing
// ============================================

/**
 * Check for pending tool calls after turn.
 * Original: P77 in chunks.134.mjs
 */
async function* checkPendingToolCalls(
  _messages: ConversationMessage[],
  _assistantMessages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _canUseTool?: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  _context?: ToolUseContext,
  _querySource?: string,
  _autoCompactTracking?: AutoCompactTracking,
  _fallbackModel?: string,
  _stopHookActive?: boolean,
  _maxTurns?: number,
  _turnCount?: number
): AsyncGenerator<ConversationMessage> {
  // Placeholder - would check for additional work
}

/**
 * Process continuation triggers.
 * Original: T77 in chunks.134.mjs
 */
async function* processContinuationTriggers(
  _messages: ConversationMessage[],
  _assistantMessages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _canUseTool?: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  _context?: ToolUseContext,
  _querySource?: string,
  _autoCompactTracking?: AutoCompactTracking,
  _fallbackModel?: string,
  _maxTurns?: number,
  _turnCount?: number
): AsyncGenerator<ConversationMessage> {
  // Placeholder - would check for continuation triggers
}

// ============================================
// Core Message Loop
// ============================================

/**
 * Error message for context limit.
 * Original: Ar in chunks.134.mjs
 */
const CONTEXT_LIMIT_ERROR =
  'Your conversation has exceeded the maximum context window. Please start a new conversation or use /compact to summarize.';

/**
 * Max output token recovery limit.
 * Original: j77 in chunks.134.mjs
 */
const MAX_OUTPUT_TOKEN_RECOVERY = AGENT_LOOP_CONSTANTS.MAX_OUTPUT_TOKEN_RECOVERY;

/**
 * Core message loop generator.
 * Original: aN() in chunks.134.mjs:99-410
 *
 * Handles the main execution cycle:
 * 1. Micro-compaction for token optimization
 * 2. Auto-compaction for context window management
 * 3. API streaming with parallel tool execution
 * 4. Error handling and recovery
 * 5. Recursive continuation for tool results
 *
 * @param options - Loop options
 * @yields Conversation messages and events
 */
export async function* coreMessageLoop(
  options: CoreMessageLoopOptions
): AsyncGenerator<LoopEvent> {
  const {
    messages: inputMessages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext,
    autoCompactTracking: inputAutoCompactTracking,
    fallbackModel,
    stopHookActive,
    querySource,
    maxOutputTokensOverride,
    maxOutputTokensRecoveryCount = 0,
    maxTurns,
    turnCount = 1,
  } = options;

  // 1. Signal stream request start
  yield { type: 'stream_request_start' };

  recordMarker('query_fn_entry');

  // Track query start for main agent
  if (!toolUseContext.agentId) {
    logTelemetry('query_started', {});
  }

  // 2. Setup query tracking
  const queryTracking: QueryTracking = toolUseContext.queryTracking
    ? {
        chainId: toolUseContext.queryTracking.chainId,
        depth: toolUseContext.queryTracking.depth + 1,
      }
    : { chainId: generateUUID(), depth: 0 };

  const queryChainId = queryTracking.chainId;

  // Update context with query tracking
  let updatedContext: ToolUseContext = {
    ...toolUseContext,
    queryTracking,
  };

  // 3. Normalize messages
  let processedMessages = normalizeMessages(inputMessages);
  let autoCompactTracking = inputAutoCompactTracking;

  // 4. Micro-compaction
  recordMarker('query_microcompact_start');
  const microCompactResult = await microCompact(processedMessages, undefined, updatedContext);
  processedMessages = microCompactResult.messages;
  if (microCompactResult.compactionInfo?.systemMessage) {
    yield microCompactResult.compactionInfo.systemMessage;
  }
  recordMarker('query_microcompact_end');

  // 5. Auto-compaction
  recordMarker('query_autocompact_start');
  const { compactionResult } = await autoCompactDispatcher(processedMessages, updatedContext, querySource);
  recordMarker('query_autocompact_end');

  if (compactionResult) {
    const {
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage,
    } = compactionResult;

    logTelemetry('tengu_auto_compact_succeeded', {
      originalMessageCount: inputMessages.length,
      compactedMessageCount:
        compactionResult.summaryMessages.length +
        compactionResult.attachments.length +
        compactionResult.hookResults.length,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: compactionUsage?.input_tokens,
      compactionOutputTokens: compactionUsage?.output_tokens,
      compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: compactionUsage
        ? compactionUsage.input_tokens +
          (compactionUsage.cache_creation_input_tokens ?? 0) +
          (compactionUsage.cache_read_input_tokens ?? 0) +
          compactionUsage.output_tokens
        : 0,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    // Update tracking if first compaction this session
    if (!autoCompactTracking?.compacted) {
      autoCompactTracking = {
        compacted: true,
        turnId: generateUUID(),
        turnCounter: 0,
      };
    }

    const compactedMessages = formatCompactionMessages(compactionResult);
    for (const msg of compactedMessages) {
      yield msg;
    }
    processedMessages = compactedMessages;
  }

  // Update context with processed messages
  updatedContext = {
    ...updatedContext,
    messages: processedMessages,
  };

  // 6. Initialize state
  const assistantMessages: ConversationMessage[] = [];
  const toolResultMessages: ConversationMessage[] = [];

  recordMarker('query_setup_start');

  // Initialize streaming tool executor if feature enabled
  const streamingToolExecutor = isFeatureEnabled('tengu_streaming_tool_execution2')
    ? new StreamingToolExecutor(updatedContext.options.tools, canUseTool, updatedContext)
    : null;

  // Get app state for model resolution
  const appState = await updatedContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;

  // Resolve model
  let model = resolveModelWithPermissions({
    permissionMode,
    mainLoopModel: updatedContext.options.mainLoopModel,
    exceeds200kTokens: permissionMode === 'plan' && exceeds200kTokens(processedMessages),
  });

  // Merge system prompt with context
  const finalSystemPrompt = mergeSystemPromptWithContext(systemPrompt, systemContext);

  recordMarker('query_setup_end');

  // 7. Check blocking token limit
  let fetchOverride: unknown = undefined;
  const { isAtBlockingLimit } = checkTokenLimit(estimateTokenCount(processedMessages));
  if (isAtBlockingLimit) {
    yield createErrorAttachment({
      content: CONTEXT_LIMIT_ERROR,
      error: 'invalid_request',
    });
    return;
  }

  // 8. Main API streaming loop
  let shouldRetry = true;
  recordMarker('query_api_loop_start');

  try {
    while (shouldRetry) {
      shouldRetry = false;

      try {
        let didFallback = false;

        recordMarker('query_api_streaming_start');

        for await (const message of streamApiResponse({
          messages: addUserContextToMessages(processedMessages, userContext),
          systemPrompt: finalSystemPrompt,
          maxThinkingTokens: updatedContext.options.maxThinkingTokens,
          tools: updatedContext.options.tools,
          signal: updatedContext.abortController?.signal,
          options: {
            async getToolPermissionContext() {
              return (await updatedContext.getAppState()).toolPermissionContext;
            },
            model,
            toolChoice: undefined,
            isNonInteractiveSession: updatedContext.options.isNonInteractiveSession,
            fallbackModel,
            onStreamingFallback: () => {
              didFallback = true;
            },
            querySource,
            agents: updatedContext.options.agentDefinitions?.activeAgents,
            hasAppendSystemPrompt: !!updatedContext.options.appendSystemPrompt,
            maxOutputTokensOverride,
            fetchOverride,
            mcpTools: appState.mcp?.tools,
            queryTracking,
            taskIntensityOverride: getTaskIntensityOverride(),
            agentId: updatedContext.agentId,
          },
        })) {
          // Handle fallback: tombstone previous messages
          if (didFallback) {
            for (const msg of assistantMessages) {
              yield { type: 'tombstone', message: msg };
            }

            logTelemetry('tengu_orphaned_messages_tombstoned', {
              orphanedMessageCount: assistantMessages.length,
              queryChainId,
              queryDepth: queryTracking.depth,
            });

            assistantMessages.length = 0;
            toolResultMessages.length = 0;

            if (streamingToolExecutor) {
              streamingToolExecutor.discard();
              // Would recreate streaming executor
            }
          }

          yield message;

          // Track assistant messages
          if (message.type === 'assistant') {
            assistantMessages.push(message);

            // Feed tool uses to streaming executor
            if (streamingToolExecutor) {
              const content = (message as { message?: { content?: unknown[] } }).message?.content;
              if (Array.isArray(content)) {
                const toolUses = content.filter(
                  (block): block is ToolUseBlock =>
                    (block as { type: string }).type === 'tool_use'
                );
                for (const toolUse of toolUses) {
                  streamingToolExecutor.addTool(toolUse, message);
                }
              }
            }
          }

          // Yield completed tool results (parallel execution)
          if (streamingToolExecutor) {
            for (const result of streamingToolExecutor.getCompletedResults()) {
              if (result.message) {
                yield result.message;
                toolResultMessages.push(
                  ...normalizeToolResults([result.message], updatedContext.options.tools).filter(
                    (msg) => msg.type === 'user'
                  )
                );
              }
            }
          }
        }

        recordMarker('query_api_streaming_end');
      } catch (error) {
        // Model fallback on specific errors
        if (error instanceof ModelFallbackError && fallbackModel) {
          model = fallbackModel;
          shouldRetry = true;

          yield* createToolErrorResults(assistantMessages, 'Model fallback triggered');
          assistantMessages.length = 0;

          updatedContext.options.mainLoopModel = fallbackModel;

          logTelemetry('tengu_model_fallback_triggered', {
            original_model: error.originalModel,
            fallback_model: fallbackModel,
            entrypoint: 'cli',
            queryChainId,
            queryDepth: queryTracking.depth,
          });

          yield createSystemMessage(
            `Model fallback triggered: switching from ${error.originalModel} to ${error.fallbackModel}`,
            'info'
          );

          continue;
        }

        throw error;
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));

    const errorMessage = error instanceof Error ? error.message : String(error);

    logTelemetry('tengu_query_error', {
      assistantMessages: assistantMessages.length,
      toolUses: assistantMessages.flatMap((msg) => {
        const content = (msg as { message?: { content?: unknown[] } }).message?.content;
        if (!Array.isArray(content)) return [];
        return content.filter((block) => (block as { type: string }).type === 'tool_use');
      }).length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    if (error instanceof InvalidRequestError || error instanceof ServerError) {
      yield createErrorAttachment({ content: (error as Error).message });
      return;
    }

    yield* createToolErrorResults(assistantMessages, errorMessage);
    yield createInterruptedAttachment({ toolUse: false });

    logException('Query error', error);
    return;
  }

  // 9. Record API call info
  if (assistantMessages.length > 0) {
    recordApiCallInfo(
      [...processedMessages, ...assistantMessages],
      systemPrompt,
      userContext,
      systemContext,
      updatedContext,
      querySource
    );
  }

  // Check for overly agreeable responses
  if (
    assistantMessages.some((msg) => {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (!Array.isArray(content)) return false;
      return content.some(
        (block) =>
          (block as { type: string }).type === 'text' &&
          isOverlyAgreeable((block as { text: string }).text)
      );
    })
  ) {
    logTelemetry('tengu_model_response_keyword_detected', {
      is_overly_agreeable: true,
      queryChainId,
      queryDepth: queryTracking.depth,
    });
  }

  // 10. Handle abort
  if (updatedContext.abortController?.signal.aborted) {
    if (streamingToolExecutor) {
      for await (const result of streamingToolExecutor.getRemainingResults()) {
        if (result.message) yield result.message;
      }
    } else {
      yield* createToolErrorResults(assistantMessages, 'Interrupted by user');
    }

    yield createInterruptedAttachment({ toolUse: false });
    return;
  }

  // 11. Check for tool calls
  const toolCalls = assistantMessages.flatMap((msg) => {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (!Array.isArray(content)) return [];
    return content.filter(
      (block): block is ToolUseBlock => (block as { type: string }).type === 'tool_use'
    );
  });

  if (!assistantMessages.length || !toolCalls.length) {
    // Check for max_output_tokens recovery
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    if (
      lastMessage &&
      (lastMessage as { apiError?: string }).apiError === 'max_output_tokens' &&
      maxOutputTokensRecoveryCount < MAX_OUTPUT_TOKEN_RECOVERY
    ) {
      const recoveryMessage = createUserMessage({
        content:
          'Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.',
        isMeta: true,
      }) as ConversationMessage;

      yield* coreMessageLoop({
        ...options,
        messages: [...processedMessages, ...assistantMessages, recoveryMessage],
        maxOutputTokensRecoveryCount: maxOutputTokensRecoveryCount + 1,
      });
      return;
    }

    // Check for pending tool calls and continuation triggers
    yield* checkPendingToolCalls(
      processedMessages,
      assistantMessages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      updatedContext,
      querySource,
      autoCompactTracking,
      fallbackModel,
      stopHookActive,
      maxTurns,
      turnCount
    );

    yield* processContinuationTriggers(
      processedMessages,
      assistantMessages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      updatedContext,
      querySource,
      autoCompactTracking,
      fallbackModel,
      maxTurns,
      turnCount
    );

    return;
  }

  // 12. Execute remaining tools
  let hookStopped = false;
  let contextAfterTools = updatedContext;

  recordMarker('query_tool_execution_start');

  if (streamingToolExecutor) {
    logTelemetry('tengu_streaming_tool_execution_used', {
      tool_count: toolCalls.length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    for await (const result of streamingToolExecutor.getRemainingResults()) {
      const msg = result.message;
      if (!msg) continue;

      yield msg;

      // Check for hook stop
      if (
        msg.type === 'attachment' &&
        (msg as { attachment?: { type?: string } }).attachment?.type === 'hook_stopped_continuation'
      ) {
        hookStopped = true;
      }

      toolResultMessages.push(
        ...normalizeToolResults([msg], updatedContext.options.tools).filter(
          (m) => m.type === 'user'
        )
      );
    }

    contextAfterTools = {
      ...streamingToolExecutor.getUpdatedContext(),
      queryTracking,
    };
  } else {
    logTelemetry('tengu_streaming_tool_execution_not_used', {
      tool_count: toolCalls.length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    for await (const result of executeToolsSequentially(
      toolCalls,
      assistantMessages,
      canUseTool,
      updatedContext
    )) {
      if (result.message) {
        yield result.message;

        if (
          result.message.type === 'attachment' &&
          (result.message as { attachment?: { type?: string } }).attachment?.type ===
            'hook_stopped_continuation'
        ) {
          hookStopped = true;
        }

        toolResultMessages.push(
          ...normalizeToolResults([result.message], updatedContext.options.tools).filter(
            (m) => m.type === 'user'
          )
        );
      }

      if (result.newContext) {
        contextAfterTools = {
          ...result.newContext,
          queryTracking,
        };
      }
    }
  }

  recordMarker('query_tool_execution_end');

  // 13. Handle abort after tool execution
  if (updatedContext.abortController?.signal.aborted) {
    yield createInterruptedAttachment({ toolUse: true });

    const nextTurn = turnCount + 1;
    if (maxTurns && nextTurn > maxTurns) {
      yield createMaxTurnsAttachment({
        type: 'max_turns_reached',
        maxTurns,
        turnCount: nextTurn,
      });
    }
    return;
  }

  // 14. Check for hook stop
  if (hookStopped) return;

  // 15. Update auto-compact tracking
  if (autoCompactTracking?.compacted) {
    autoCompactTracking.turnCounter++;

    logTelemetry('tengu_post_autocompact_turn', {
      turnId: autoCompactTracking.turnId,
      turnCounter: autoCompactTracking.turnCounter,
      queryChainId,
      queryDepth: queryTracking.depth,
    });
  }

  // 16. Process queued commands and attachments
  const queuedCommands = [...(await contextAfterTools.getAppState()).queuedCommands];
  const fileChangeAttachments: ConversationMessage[] = [];

  logTelemetry('tengu_query_before_attachments', {
    messagesForQueryCount: processedMessages.length,
    assistantMessagesCount: assistantMessages.length,
    toolResultsCount: toolResultMessages.length,
    queryChainId,
    queryDepth: queryTracking.depth,
  });

  for await (const attachment of processPendingAttachments(
    null,
    contextAfterTools,
    null,
    queuedCommands,
    [...processedMessages, ...assistantMessages, ...toolResultMessages],
    querySource
  )) {
    yield attachment;
    toolResultMessages.push(attachment);

    if (isFileChangeAttachment(attachment)) {
      fileChangeAttachments.push(attachment);
    }
  }

  const fileChangeCount = toolResultMessages.filter(
    (msg) => msg.type === 'attachment' && (msg as { attachment?: { type?: string } }).attachment?.type === 'edited_text_file'
  ).length;

  logTelemetry('tengu_query_after_attachments', {
    totalToolResultsCount: toolResultMessages.length,
    fileChangeAttachmentCount: fileChangeCount,
    queryChainId,
    queryDepth: queryTracking.depth,
  });

  // Process prompt commands
  const promptCommands = queuedCommands.filter(
    (cmd) => (cmd as { mode?: string }).mode === 'prompt'
  );
  updateQueuedCommands(promptCommands, contextAfterTools.setAppState);

  // 17. Check max turns limit
  const nextTurn = turnCount + 1;
  if (maxTurns && nextTurn > maxTurns) {
    yield createMaxTurnsAttachment({
      type: 'max_turns_reached',
      maxTurns,
      turnCount: nextTurn,
    });
    return;
  }

  // 18. Recursive call for next turn
  yield* coreMessageLoop({
    messages: [...processedMessages, ...assistantMessages, ...toolResultMessages],
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext: contextAfterTools,
    autoCompactTracking,
    fallbackModel,
    stopHookActive,
    querySource,
    maxTurns,
    turnCount: nextTurn,
  });
}

// ============================================
// Export
// ============================================

export {
  coreMessageLoop,
  normalizeMessages,
  addUserContextToMessages,
  mergeSystemPromptWithContext,
  resolveModelWithPermissions,
  createErrorAttachment,
  createInterruptedAttachment,
  createMaxTurnsAttachment,
  createSystemMessage,
  createToolErrorResults,
  isFeatureEnabled,
  recordMarker,
  ModelFallbackError,
};
