/**
 * @claudecode/core - LLM API Types
 *
 * Type definitions for the LLM API module.
 * Reconstructed from analysis of chunks.82.mjs, chunks.85.mjs, chunks.147.mjs
 */

import type { ContentBlock, Message, TokenUsage } from '@claudecode/shared';

// ============================================
// Provider Types
// ============================================

/**
 * Supported API providers
 */
export type ApiProvider = 'anthropic' | 'bedrock' | 'vertex' | 'foundry';

/**
 * Client configuration options
 */
export interface ClientOptions {
  apiKey?: string;
  maxRetries?: number;
  timeout?: number;
  model?: string;
  fetchOverride?: typeof fetch;

  /** Override Anthropic API base URL */
  baseURL?: string;

  /** Additional default headers applied to every request */
  defaultHeaders?: Record<string, string>;

  /** SDK compatibility flag (kept for parity with upstream options shape) */
  dangerouslyAllowBrowser?: boolean;
}

/**
 * Provider-specific options
 */
export interface BedrockOptions extends ClientOptions {
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  awsSessionToken?: string;
  skipAuth?: boolean;
}

export interface VertexOptions extends ClientOptions {
  region?: string;
  projectId?: string;
}

export interface FoundryOptions extends ClientOptions {
  azureADTokenProvider?: () => Promise<string>;
}

// ============================================
// Request Types
// ============================================

/**
 * Messages API request parameters
 */
export interface MessagesRequest {
  model: string;
  messages: Message[];
  system?: string | SystemContent[];
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  tools?: ToolDefinition[];
  tool_choice?: ToolChoice;
  metadata?: RequestMetadata;
  stream?: boolean;
}

/**
 * System content block
 */
export interface SystemContent {
  type: 'text';
  text: string;
  cache_control?: CacheControl;
}

/**
 * Cache control for prompt caching
 */
export interface CacheControl {
  type: 'ephemeral';
}

/**
 * Tool definition for API
 */
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  cache_control?: CacheControl;
}

/**
 * Tool choice options
 */
export type ToolChoice =
  | { type: 'auto' }
  | { type: 'any' }
  | { type: 'tool'; name: string }
  | { type: 'none' };

/**
 * Request metadata
 */
export interface RequestMetadata {
  user_id?: string;
}

// ============================================
// Response Types
// ============================================

/**
 * Messages API response
 */
export interface MessagesResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: ContentBlock[];
  model: string;
  stop_reason: StopReason;
  stop_sequence?: string;
  usage: TokenUsage;
}

/**
 * Stop reason types
 */
export type StopReason =
  | 'end_turn'
  | 'max_tokens'
  | 'stop_sequence'
  | 'tool_use'
  | null;

// ============================================
// Streaming Types
// ============================================

/**
 * Streaming event types
 */
export type StreamEventType =
  | 'message_start'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop'
  | 'ping'
  | 'error';

/**
 * Base stream event
 */
export interface BaseStreamEvent {
  type: StreamEventType;
}

/**
 * Message start event
 */
export interface MessageStartEvent extends BaseStreamEvent {
  type: 'message_start';
  message: {
    id: string;
    type: 'message';
    role: 'assistant';
    model: string;
    usage: TokenUsage;
  };
}

/**
 * Content block start event
 */
export interface ContentBlockStartEvent extends BaseStreamEvent {
  type: 'content_block_start';
  index: number;
  content_block: ContentBlock;
}

/**
 * Content block delta event
 */
export interface ContentBlockDeltaEvent extends BaseStreamEvent {
  type: 'content_block_delta';
  index: number;
  delta: ContentDelta;
}

/**
 * Content delta types
 */
export type ContentDelta =
  | { type: 'text_delta'; text: string }
  | { type: 'input_json_delta'; partial_json: string }
  | { type: 'thinking_delta'; thinking: string }
  | { type: 'signature_delta'; signature: string };

/**
 * Content block stop event
 */
export interface ContentBlockStopEvent extends BaseStreamEvent {
  type: 'content_block_stop';
  index: number;
}

/**
 * Message delta event
 */
export interface MessageDeltaEvent extends BaseStreamEvent {
  type: 'message_delta';
  delta: {
    stop_reason: StopReason;
    stop_sequence?: string;
  };
  usage: {
    output_tokens: number;
  };
}

/**
 * Message stop event
 */
export interface MessageStopEvent extends BaseStreamEvent {
  type: 'message_stop';
}

/**
 * Ping event
 */
export interface PingEvent extends BaseStreamEvent {
  type: 'ping';
}

/**
 * Error event
 */
export interface ErrorEvent extends BaseStreamEvent {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}

/**
 * Union of all stream events
 */
export type StreamEvent =
  | MessageStartEvent
  | ContentBlockStartEvent
  | ContentBlockDeltaEvent
  | ContentBlockStopEvent
  | MessageDeltaEvent
  | MessageStopEvent
  | PingEvent
  | ErrorEvent;

// ============================================
// Aggregation Types
// ============================================

/**
 * Aggregated content block with accumulated content
 */
export interface AggregatedContentBlock {
  type: string;
  index: number;
  // Text block
  text?: string;
  // Tool use block
  id?: string;
  name?: string;
  input?: string | Record<string, unknown>;
  // Thinking block
  thinking?: string;
  signature?: string;
}

/**
 * Streaming query result types
 */
export type StreamingQueryResult =
  | { type: 'assistant'; message: AssistantMessage }
  | { type: 'stream_event'; event: StreamEvent }
  | { type: 'retry'; attempt: number; maxAttempts: number; delayMs: number }
  | { type: 'api_error'; error: ApiError; retryInfo?: RetryInfo };

/**
 * Assistant message from streaming
 */
export interface AssistantMessage {
  uuid: string;
  role: 'assistant';
  content: ContentBlock[];
  model: string;
  stopReason: StopReason;
  usage: TokenUsage;
}

/**
 * Retry information
 */
export interface RetryInfo {
  attempt: number;
  maxAttempts: number;
  delayMs: number;
}

// ============================================
// Error Types
// ============================================

/**
 * API error structure
 */
export interface ApiError {
  type: string;
  message: string;
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Context overflow error details
 */
export interface ContextOverflowError {
  inputTokens: number;
  contextLimit: number;
}

/**
 * Fallback triggered error
 */
export class FallbackTriggeredError extends Error {
  constructor(
    public readonly primaryModel: string,
    public readonly fallbackModel: string
  ) {
    super(`Fallback triggered: ${primaryModel} -> ${fallbackModel}`);
    this.name = 'FallbackTriggeredError';
  }
}

/**
 * Overload error
 */
export class OverloadError extends Error {
  constructor(
    public readonly originalError: Error,
    public readonly context: { model: string; maxThinkingTokens?: number }
  ) {
    super('API overloaded');
    this.name = 'OverloadError';
  }
}

/**
 * Abort error
 */
export class AbortError extends Error {
  constructor() {
    super('Operation aborted');
    this.name = 'AbortError';
  }
}

// ============================================
// Client Interface
// ============================================

/**
 * Abstract client interface for all providers
 */
export interface AnthropicClientInterface {
  messages: {
    create(request: MessagesRequest): Promise<MessagesResponse>;
    stream(
      request: MessagesRequest,
      options?: { signal?: AbortSignal }
    ): AsyncIterable<StreamEvent>;
  };
}

// ============================================
// Retry Options
// ============================================

/**
 * Retry generator options
 */
export interface RetryOptions {
  model: string;
  fallbackModel?: string;
  maxThinkingTokens?: number;
  signal?: AbortSignal;
  maxRetries?: number;
}

/**
 * Retry context passed through attempts
 */
export interface RetryContext {
  model: string;
  maxThinkingTokens?: number;
  maxTokensOverride?: number;
}

// ============================================
// Export all types
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
