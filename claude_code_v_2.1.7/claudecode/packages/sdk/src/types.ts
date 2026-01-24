/**
 * @claudecode/sdk - SDK Types
 *
 * Type definitions for SDK transport and protocol.
 * Reconstructed from chunks.155.mjs, chunks.156.mjs
 */

// ============================================
// Message Types
// ============================================

/**
 * Base message interface.
 */
export interface SDKMessage {
  type: string;
  uuid?: string;
}

/**
 * User message (from SDK client).
 */
export interface SDKUserMessage extends SDKMessage {
  type: 'user';
  message: {
    role: 'user';
    content: string | SDKContentBlock[];
  };
  session_id?: string;
  isReplay?: boolean;
}

/**
 * Content block types.
 */
export type SDKContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
  | { type: 'tool_result'; tool_use_id: string; content: string | SDKContentBlock[] };

/**
 * Control request (from SDK client).
 */
export interface SDKControlRequest extends SDKMessage {
  type: 'control_request';
  request_id: string;
  request:
    | SDKCanUseToolRequest
    | SDKHookCallbackRequest
    | SDKMcpMessageRequest
    | SDKInitializeRequest;
}

/**
 * Control response (to SDK client).
 */
export interface SDKControlResponse extends SDKMessage {
  type: 'control_response';
  request_id: string;
  response:
    | SDKCanUseToolResponse
    | SDKHookCallbackResponse
    | SDKMcpMessageResponse
    | SDKInitializeResponse
    | { subtype: 'error'; error: string };
}

/**
 * Keep-alive message.
 */
export interface SDKKeepAliveMessage extends SDKMessage {
  type: 'keep_alive';
}

/**
 * System message (from Claude Code).
 */
export interface SDKSystemMessage extends SDKMessage {
  type: 'system';
  subtype: 'status' | 'error' | 'info';
  status?: string | null;
  error?: string;
  info?: string;
}

/**
 * Result message (from Claude Code).
 */
export interface SDKResultMessage extends SDKMessage {
  type: 'result';
  subtype: 'success' | 'error' | 'interrupted';
  session_id?: string;
  permission_denials?: SDKPermissionDenial[];
  error?: string;
}

/**
 * Assistant message (from Claude Code).
 */
export interface SDKAssistantMessage extends SDKMessage {
  type: 'assistant';
  message: {
    id?: string;
    role: 'assistant';
    content: SDKContentBlock[];
    model?: string;
    stop_reason?: string;
  };
  session_id?: string;
}

// ============================================
// Control Request Types
// ============================================

/**
 * Can-use-tool request (permission check).
 */
export interface SDKCanUseToolRequest {
  type: 'can_use_tool';
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_use_id: string;
}

/**
 * Can-use-tool response.
 */
export interface SDKCanUseToolResponse {
  type: 'can_use_tool_response';
  behavior: 'allow' | 'deny' | 'ask';
  message?: string;
  updated_input?: Record<string, unknown>;
}

/**
 * Hook callback request.
 */
export interface SDKHookCallbackRequest {
  type: 'hook_callback';
  callback_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
}

/**
 * Hook callback response.
 */
export interface SDKHookCallbackResponse {
  type: 'hook_callback_response';
  output?: {
    decision?: 'block' | 'allow' | 'modify';
    reason?: string;
    modified_args?: Record<string, unknown>;
  };
  error?: string;
}

/**
 * MCP message request.
 */
export interface SDKMcpMessageRequest {
  type: 'mcp_message';
  server_name: string;
  message: object;
}

/**
 * MCP message response.
 */
export interface SDKMcpMessageResponse {
  type: 'mcp_message_response';
  response?: object;
  error?: string;
}

/**
 * Initialize request.
 */
export interface SDKInitializeRequest {
  type: 'initialize';
  prompt?: string;
  system_prompt?: string;
  append_system_prompt?: string;
  allowed_tools?: string[];
  disallowed_tools?: string[];
  mcp_servers?: string[];
  hooks?: Record<string, SDKHookConfig[]>;
  options?: SDKInitializeOptions;
}

/**
 * Initialize response.
 */
export interface SDKInitializeResponse {
  type: 'initialize_response';
  session_id: string;
  success: boolean;
  error?: string;
}

/**
 * Hook configuration in initialize request.
 */
export interface SDKHookConfig {
  matcher: string | { pattern: string };
  hookCallbackIds: string[];
  timeout?: number;
}

/**
 * Initialize options.
 */
export interface SDKInitializeOptions {
  model?: string;
  maxTokens?: number;
  maxTurns?: number;
  temperature?: number;
  continueSession?: boolean;
  resumeSession?: string;
  workingDirectory?: string;
}

// ============================================
// Permission Denial
// ============================================

/**
 * Permission denial tracking.
 */
export interface SDKPermissionDenial {
  tool_name: string;
  tool_use_id: string;
  tool_input: Record<string, unknown>;
}

// ============================================
// Transport Types
// ============================================

/**
 * SDK transport interface.
 */
export interface SDKTransport {
  /** Async iterator for incoming messages */
  read(): AsyncGenerator<SDKMessage, void, unknown>;

  /** Write message to output */
  write(message: SDKMessage): void;

  /** Send control request and wait for response */
  sendRequest<T>(
    request: object,
    schema?: object,
    signal?: AbortSignal
  ): Promise<T>;

  /** Get pending permission requests */
  getPendingPermissionRequests(): SDKControlRequest[];

  /** Create can-use-tool callback */
  createCanUseTool(): (
    tool: unknown,
    input: Record<string, unknown>,
    context: unknown,
    globals: unknown,
    toolUseId: string
  ) => Promise<SDKCanUseToolResponse>;

  /** Create hook callback */
  createHookCallback(
    callbackId: string,
    timeout?: number
  ): {
    type: 'callback';
    timeout?: number;
    callback: (input: any, toolUseId: string | null, abortSignal?: AbortSignal) => Promise<SDKHookCallbackResponse>;
  };

  /** Send MCP message */
  sendMcpMessage(
    serverName: string,
    message: object
  ): Promise<SDKMcpMessageResponse>;

  /** Set callback for unexpected responses */
  setUnexpectedResponseCallback(
    callback: (response: SDKControlResponse) => Promise<void>
  ): void;

  /** Close transport */
  close?(): void;
}

/**
 * Pending request entry.
 */
export interface SDKPendingRequest {
  request: SDKControlRequest;
  resolve: (response: unknown) => void;
  reject: (error: Error) => void;
  schema?: object;
}

// ============================================
// WebSocket Transport Types
// ============================================

/**
 * WebSocket transport state.
 */
export type WebSocketTransportState =
  | 'idle'
  | 'reconnecting'
  | 'connected'
  | 'closing'
  | 'closed';

/**
 * WebSocket transport options.
 */
export interface WebSocketTransportOptions {
  url: string;
  headers?: Record<string, string>;
  sessionId?: string;
  replayUserMessages?: boolean;
}

// ============================================
// Constants
// ============================================

/**
 * SDK constants.
 */
export const SDK_CONSTANTS = {
  // Stdout chunk size (J9)
  STDOUT_CHUNK_SIZE: 2000,

  // WebSocket reconnection (Vy0)
  MESSAGE_BUFFER_SIZE: 1000, // zR7
  MAX_RECONNECT_ATTEMPTS: 3, // Rw9
  INITIAL_RECONNECT_DELAY_MS: 1000, // $R7
  MAX_RECONNECT_DELAY_MS: 30000, // CR7
  PING_INTERVAL_MS: 10000, // UR7

  // SDK entrypoints
  ENTRYPOINTS: ['sdk-ts', 'sdk-py', 'sdk-cli'] as const,

  // Identity constants
  CLI_IDENTITY: "You are Claude Code, Anthropic's official CLI for Claude.",
  SDK_CLI_IDENTITY:
    "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.",
  SDK_AGENT_IDENTITY: 'You are a Claude agent, built on Anthropic\'s Claude Agent SDK.',
} as const;
