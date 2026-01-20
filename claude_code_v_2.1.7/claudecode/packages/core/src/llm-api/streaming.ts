/**
 * @claudecode/core - LLM API Streaming
 *
 * Streaming response handling with incremental aggregation.
 * Reconstructed from chunks.147.mjs (queryWithStreaming / BJ9)
 *
 * Key symbols:
 * - BJ9 → queryWithStreaming (main streaming function)
 * - dhA → updateUsage (merge usage statistics)
 * - JP0 → processContent (parse tool inputs)
 * - eY9 → generateMessageUUID
 */

import { generateUUID } from '@claudecode/shared';
import type { TokenUsage, ContentBlock, ToolDefinition } from '@claudecode/shared';
import type {
  StreamEvent,
  StreamingQueryResult,
  AssistantMessage,
  AggregatedContentBlock,
  StopReason,
  AnthropicClientInterface,
  MessagesRequest,
  RetryContext,
} from './types.js';
import { retryGenerator, isOverloadError } from './retry.js';
import { createAnthropicClient } from './client.js';

// ============================================
// Constants
// ============================================

/**
 * Stall detection threshold (30 seconds)
 * Original: ZA = 30000 in chunks.147.mjs
 */
export const STALL_THRESHOLD_MS = 30_000;

/**
 * Maximum tokens for non-streaming fallback
 * Original: wz7 = 21333 in chunks.147.mjs
 */
const MAX_NON_STREAMING_TOKENS = 21_333;

/**
 * Empty text placeholder for empty model responses
 * Original: JO in chunks.147.mjs
 */
const EMPTY_PLACEHOLDER = '[Empty response]';

// ============================================
// Aggregation State
// ============================================

/**
 * Extended usage tracking with server tool use
 * Original: Cj (DEFAULT_USAGE) in chunks.147.mjs
 */
interface ExtendedUsage extends TokenUsage {
  server_tool_use?: {
    web_search_requests?: number;
    web_fetch_requests?: number;
  };
  service_tier?: string;
  cache_creation?: {
    ephemeral_1h_input_tokens?: number;
    ephemeral_5m_input_tokens?: number;
  };
}

/**
 * Internal state for stream aggregation
 */
interface AggregationState {
  /** Content blocks indexed by position */
  contentBlocks: AggregatedContentBlock[];
  /** Partial message metadata from message_start */
  partialMessage: {
    id: string;
    model: string;
  } | null;
  /** Accumulated token usage */
  usage: ExtendedUsage;
  /** Final stop reason */
  stopReason: StopReason;
  /** Messages already yielded */
  yieldedIndices: Set<number>;
  /** First chunk received flag */
  isFirstChunk: boolean;
  /** Last event timestamp for stall detection */
  lastEventTime: number | null;
  /** Stall count */
  stallCount: number;
  /** Total stall time */
  totalStallTime: number;
  /** Time to first chunk (ms) */
  timeToFirstChunk: number;
  /** Request start time */
  requestStartTime: number;
  /** Did fall back to non-streaming */
  didFallBackToNonStreaming: boolean;
  /** Request ID from response */
  requestId: string | null;
}

/**
 * Create initial aggregation state
 * Original: State initialization in BJ9 (chunks.147.mjs)
 */
function createAggregationState(): AggregationState {
  return {
    contentBlocks: [],
    partialMessage: null,
    usage: {
      input_tokens: 0,
      output_tokens: 0,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
      server_tool_use: {
        web_search_requests: 0,
        web_fetch_requests: 0,
      },
    },
    stopReason: null,
    yieldedIndices: new Set(),
    isFirstChunk: true,
    lastEventTime: null,
    stallCount: 0,
    totalStallTime: 0,
    timeToFirstChunk: 0,
    requestStartTime: Date.now(),
    didFallBackToNonStreaming: false,
    requestId: null,
  };
}

// ============================================
// Content Block Processing
// ============================================

/**
 * Initialize a content block from start event
 */
function initializeContentBlock(
  event: StreamEvent & { type: 'content_block_start' }
): AggregatedContentBlock {
  const block = event.content_block as ContentBlock;
  const index = event.index;

  switch (block.type) {
    case 'tool_use':
      return {
        type: 'tool_use',
        index,
        id: (block as { id?: string }).id,
        name: (block as { name?: string }).name,
        input: '', // Will accumulate partial_json
      };

    case 'text':
      return {
        type: 'text',
        index,
        text: '', // Will accumulate text
      };

    case 'thinking':
      return {
        type: 'thinking',
        index,
        thinking: '', // Will accumulate thinking
        signature: '',
      };

    default:
      return {
        index,
        ...block,
      };
  }
}

/**
 * Apply delta to content block
 */
function applyDelta(
  block: AggregatedContentBlock,
  event: StreamEvent & { type: 'content_block_delta' }
): void {
  const delta = event.delta;

  switch (delta.type) {
    case 'text_delta':
      block.text = (block.text || '') + delta.text;
      break;

    case 'input_json_delta':
      block.input = (block.input || '') + delta.partial_json;
      break;

    case 'thinking_delta':
      block.thinking = (block.thinking || '') + delta.thinking;
      break;

    case 'signature_delta':
      block.signature = (block.signature || '') + delta.signature;
      break;
  }
}

/**
 * Finalize content block for output
 */
function finalizeContentBlock(block: AggregatedContentBlock): ContentBlock {
  switch (block.type) {
    case 'tool_use':
      // Parse accumulated JSON input
      let parsedInput: Record<string, unknown> = {};
      if (typeof block.input === 'string' && block.input) {
        try {
          parsedInput = JSON.parse(block.input);
        } catch {
          // Keep as string if parse fails
          parsedInput = { raw: block.input };
        }
      }

      return {
        type: 'tool_use',
        id: block.id || '',
        name: block.name || '',
        input: parsedInput,
      };

    case 'text':
      return {
        type: 'text',
        text: block.text || '',
      };

    case 'thinking':
      return {
        type: 'thinking',
        thinking: block.thinking || '',
      };

    default:
      return block as ContentBlock;
  }
}

// ============================================
// Usage Accumulation
// ============================================

/**
 * Update usage statistics by merging new values.
 * Takes newer values if present and > 0, otherwise keeps accumulated.
 *
 * Original: dhA (updateUsage) in chunks.147.mjs:447-463
 */
function updateUsage(
  accumulated: ExtendedUsage,
  newUsage: Partial<ExtendedUsage>
): ExtendedUsage {
  return {
    // Use new values if present and > 0, otherwise keep accumulated
    input_tokens:
      newUsage.input_tokens !== null &&
      newUsage.input_tokens !== undefined &&
      newUsage.input_tokens > 0
        ? newUsage.input_tokens
        : accumulated.input_tokens,

    cache_creation_input_tokens:
      newUsage.cache_creation_input_tokens !== null &&
      newUsage.cache_creation_input_tokens !== undefined &&
      newUsage.cache_creation_input_tokens > 0
        ? newUsage.cache_creation_input_tokens
        : accumulated.cache_creation_input_tokens,

    cache_read_input_tokens:
      newUsage.cache_read_input_tokens !== null &&
      newUsage.cache_read_input_tokens !== undefined &&
      newUsage.cache_read_input_tokens > 0
        ? newUsage.cache_read_input_tokens
        : accumulated.cache_read_input_tokens,

    output_tokens: newUsage.output_tokens ?? accumulated.output_tokens,

    server_tool_use: {
      web_search_requests:
        newUsage.server_tool_use?.web_search_requests ??
        accumulated.server_tool_use?.web_search_requests ??
        0,
      web_fetch_requests:
        newUsage.server_tool_use?.web_fetch_requests ??
        accumulated.server_tool_use?.web_fetch_requests ??
        0,
    },

    service_tier: accumulated.service_tier,

    cache_creation: {
      ephemeral_1h_input_tokens:
        newUsage.cache_creation?.ephemeral_1h_input_tokens ??
        accumulated.cache_creation?.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens:
        newUsage.cache_creation?.ephemeral_5m_input_tokens ??
        accumulated.cache_creation?.ephemeral_5m_input_tokens,
    },
  };
}

/**
 * Update usage from message_start event
 */
function updateUsageFromStart(
  state: AggregationState,
  usage: Partial<ExtendedUsage>
): void {
  state.usage = updateUsage(state.usage, usage);
}

/**
 * Update usage from message_delta event
 */
function updateUsageFromDelta(
  state: AggregationState,
  usage: Partial<ExtendedUsage>
): void {
  state.usage = updateUsage(state.usage, usage);
}

// ============================================
// Streaming Query Generator
// ============================================

/**
 * Process a streaming API response and yield messages.
 *
 * Original: BJ9 (queryWithStreaming) in chunks.147.mjs
 *
 * This generator:
 * 1. Processes SSE events from the API
 * 2. Aggregates content blocks incrementally
 * 3. Yields complete messages as content blocks finish
 * 4. Tracks token usage
 * 5. Detects stalls and handles errors
 *
 * @param stream - Async iterable of stream events
 * @param options - Streaming options
 * @yields StreamingQueryResult - Messages and events
 */
export async function* queryWithStreaming(
  stream: AsyncIterable<StreamEvent>,
  options: {
    model: string;
    onFirstChunk?: () => void;
    onStall?: (stallCount: number, totalStallTime: number) => void;
  }
): AsyncGenerator<StreamingQueryResult, void, undefined> {
  const state = createAggregationState();

  for await (const event of stream) {
    // Update last event time for stall detection
    const now = Date.now();
    if (state.lastEventTime !== null) {
      const elapsed = now - state.lastEventTime;
      if (elapsed > STALL_THRESHOLD_MS) {
        state.stallCount++;
        state.totalStallTime += elapsed;
        options.onStall?.(state.stallCount, state.totalStallTime);
      }
    }
    state.lastEventTime = now;

    // First chunk callback
    if (state.isFirstChunk) {
      state.isFirstChunk = false;
      options.onFirstChunk?.();
    }

    // Yield raw event for UI streaming
    yield { type: 'stream_event', event };

    // Process event by type
    switch (event.type) {
      case 'message_start': {
        state.partialMessage = {
          id: event.message.id,
          model: event.message.model,
        };
        updateUsageFromStart(state, event.message.usage);
        break;
      }

      case 'content_block_start': {
        state.contentBlocks[event.index] = initializeContentBlock(event);
        break;
      }

      case 'content_block_delta': {
        const block = state.contentBlocks[event.index];
        if (block) {
          applyDelta(block, event);
        }
        break;
      }

      case 'content_block_stop': {
        const index = event.index;

        // Only yield if not already yielded
        if (!state.yieldedIndices.has(index)) {
          state.yieldedIndices.add(index);

          const block = state.contentBlocks[index];
          if (block) {
            const finalizedBlock = finalizeContentBlock(block);
            const message: AssistantMessage = {
              uuid: generateUUID(),
              role: 'assistant',
              content: [finalizedBlock],
              model: state.partialMessage?.model || options.model,
              stopReason: null, // Will be set on message_delta
              usage: { ...state.usage },
            };

            yield { type: 'assistant', message };
          }
        }
        break;
      }

      case 'message_delta': {
        state.stopReason = event.delta.stop_reason;
        updateUsageFromDelta(state, event.usage);
        break;
      }

      case 'message_stop': {
        // Stream complete - nothing more to do
        break;
      }

      case 'error': {
        yield {
          type: 'api_error',
          error: {
            type: event.error.type,
            message: event.error.message,
          },
        };
        break;
      }
    }
  }
}

/**
 * Options for streaming API call
 */
export interface StreamApiCallOptions {
  /** Model to use */
  model: string;

  /** Optional API key override (used by tools package) */
  apiKey?: string;
  /** Fallback model if primary fails */
  fallbackModel?: string;
  /** Maximum thinking tokens */
  maxThinkingTokens?: number;
  /** Tool definitions for input normalization */
  tools?: ToolDefinition[];
  /** Agent ID for context */
  agentId?: string;
  /** Abort signal */
  signal?: AbortSignal;
  /** Enable prompt caching */
  enablePromptCaching?: boolean;
  /** Callback on first chunk */
  onFirstChunk?: () => void;
  /** Callback on stall detection */
  onStall?: (stallCount: number, totalStallTime: number) => void;
  /** Callback when falling back to non-streaming */
  onStreamingFallback?: () => void;
  /** Custom fetch override */
  fetchOverride?: typeof fetch;
  /** Temperature override */
  temperatureOverride?: number;
}

/**
 * Create a streaming request to the API with retry logic.
 *
 * Original: BJ9 (queryWithStreaming) in chunks.147.mjs:435933-436570
 *
 * This is the main entry point for streaming API calls. It:
 * 1. Creates client with retry wrapper
 * 2. Streams response with aggregation
 * 3. Falls back to non-streaming on error
 * 4. Tracks usage and timing metrics
 *
 * @param request - Messages request
 * @param options - Streaming options
 */
export async function* streamApiCall(
  request: MessagesRequest,
  options: StreamApiCallOptions
): AsyncGenerator<StreamingQueryResult, { usage: ExtendedUsage; stopReason: StopReason }, undefined> {
  const state = createAggregationState();
  state.requestStartTime = Date.now();

  try {
    // Create streaming client with retry logic
    const retryGen = retryGenerator(
      async () => createAnthropicClient({
        maxRetries: 0,
        model: options.model,
        apiKey: options.apiKey,
        fetchOverride: options.fetchOverride,
      }),
      async (client, attempt, context) => {
        // Build request payload with context overrides
        const payload: MessagesRequest = {
          ...request,
          model: context.model || options.model,
          max_tokens: context.maxTokensOverride || request.max_tokens,
        };

        // Start streaming
        return client.messages.stream(payload, { signal: options.signal });
      },
      {
        model: options.model,
        fallbackModel: options.fallbackModel,
        maxThinkingTokens: options.maxThinkingTokens,
        signal: options.signal,
      }
    );

    // Get stream from retry generator (handles retries automatically)
    let stream: AsyncIterable<StreamEvent> | null = null;
    for await (const retryInfo of retryGen) {
      if (retryInfo.type === 'retry') {
        // Yield retry info for UI
        yield {
          type: 'retry' as const,
          attempt: retryInfo.attempt,
          maxAttempts: retryInfo.maxAttempts,
          delayMs: retryInfo.delayMs,
        };
      } else {
        // Got the stream
        stream = retryInfo as unknown as AsyncIterable<StreamEvent>;
        break;
      }
    }

    if (!stream) {
      throw new Error('Failed to create stream');
    }

    // Process stream events
    for await (const event of stream) {
      const now = Date.now();

      // Stall detection
      if (state.lastEventTime !== null) {
        const elapsed = now - state.lastEventTime;
        if (elapsed > STALL_THRESHOLD_MS) {
          state.stallCount++;
          state.totalStallTime += elapsed;
          options.onStall?.(state.stallCount, state.totalStallTime);
        }
      }
      state.lastEventTime = now;

      // First chunk timing
      if (state.isFirstChunk) {
        state.isFirstChunk = false;
        state.timeToFirstChunk = now - state.requestStartTime;
        options.onFirstChunk?.();
      }

      // Always yield raw event for UI streaming
      yield { type: 'stream_event', event };

      // Process event by type
      switch (event.type) {
        case 'message_start': {
          state.partialMessage = {
            id: event.message.id,
            model: event.message.model,
          };
          updateUsageFromStart(state, event.message.usage);
          break;
        }

        case 'content_block_start': {
          state.contentBlocks[event.index] = initializeContentBlock(event);
          break;
        }

        case 'content_block_delta': {
          const block = state.contentBlocks[event.index];
          if (block) {
            applyDelta(block, event);
          }
          break;
        }

        case 'content_block_stop': {
          const index = event.index;

          // Only yield if not already yielded
          if (!state.yieldedIndices.has(index)) {
            state.yieldedIndices.add(index);

            const block = state.contentBlocks[index];
            if (block) {
              const finalizedBlock = finalizeContentBlock(block);
              const message: AssistantMessage = {
                uuid: generateUUID(),
                role: 'assistant',
                content: [finalizedBlock],
                model: state.partialMessage?.model || options.model,
                stopReason: null,
                usage: { ...state.usage },
              };

              yield { type: 'assistant', message };
            }
          }
          break;
        }

        case 'message_delta': {
          state.stopReason = event.delta.stop_reason;
          updateUsageFromDelta(state, event.usage);

          // Handle max tokens error
          if (state.stopReason === 'max_tokens') {
            yield {
              type: 'api_error',
              error: {
                type: 'max_output_tokens',
                message: `Claude's response exceeded the output token maximum.`,
              },
            };
          }
          break;
        }

        case 'message_stop': {
          // Stream complete
          break;
        }

        case 'error': {
          yield {
            type: 'api_error',
            error: {
              type: event.error.type,
              message: event.error.message,
            },
          };
          break;
        }
      }
    }

  } catch (error) {
    // Handle streaming errors with fallback to non-streaming
    if (options.signal?.aborted) {
      throw error;
    }

    if (isOverloadError(error)) {
      state.didFallBackToNonStreaming = true;
      options.onStreamingFallback?.();

      // Fall back to non-streaming with capped tokens
      const client = await createAnthropicClient({
        model: options.model,
        fetchOverride: options.fetchOverride,
      });

      const payload: MessagesRequest = {
        ...request,
        max_tokens: Math.min(request.max_tokens || MAX_NON_STREAMING_TOKENS, MAX_NON_STREAMING_TOKENS),
      };

      const response = await client.messages.create(payload);

      // Yield non-streaming result as assistant message
      const message: AssistantMessage = {
        uuid: generateUUID(),
        role: 'assistant',
        content: response.content as ContentBlock[],
        model: response.model,
        stopReason: response.stop_reason,
        usage: response.usage as ExtendedUsage,
      };

      state.usage = updateUsage(state.usage, response.usage as ExtendedUsage);
      state.stopReason = response.stop_reason;

      yield { type: 'assistant', message };
    } else {
      throw error;
    }
  }

  return { usage: state.usage, stopReason: state.stopReason };
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
