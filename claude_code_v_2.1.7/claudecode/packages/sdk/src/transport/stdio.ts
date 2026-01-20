/**
 * @claudecode/sdk - Stdio Transport
 *
 * JSON-lines transport over stdin/stdout.
 * Reconstructed from chunks.155.mjs:2621-2790 (wmA)
 */

import type {
  SDKMessage,
  SDKUserMessage,
  SDKControlRequest,
  SDKControlResponse,
  SDKKeepAliveMessage,
  SDKTransport,
  SDKPendingRequest,
  SDKCanUseToolResponse,
  SDKHookCallbackResponse,
  SDKMcpMessageResponse,
} from '../types.js';
import { SDK_CONSTANTS } from '../types.js';

// ============================================
// Request ID Generation
// ============================================

/**
 * Generate unique request ID.
 * Original: HR7 (generateControlRequestId) in chunks.155.mjs
 */
export function generateControlRequestId(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// Stdout Writer
// ============================================

/**
 * Write to stdout in chunks to prevent buffer issues.
 * Original: J9 (writeToStdout) in chunks.1.mjs:646-648
 */
export function writeToStdout(content: string): void {
  for (let offset = 0; offset < content.length; offset += SDK_CONSTANTS.STDOUT_CHUNK_SIZE) {
    process.stdout.write(content.substring(offset, offset + SDK_CONSTANTS.STDOUT_CHUNK_SIZE));
  }
}

// ============================================
// Stdio SDK Transport
// ============================================

/**
 * Stdio SDK Transport for JSON-lines communication.
 * Original: wmA (StdioSDKTransport) in chunks.155.mjs:2621-2790
 */
export class StdioSDKTransport implements SDKTransport {
  protected input: AsyncIterable<string>;
  protected replayUserMessages: boolean;
  protected pendingRequests: Map<string, SDKPendingRequest> = new Map();
  protected inputClosed: boolean = false;
  protected unexpectedResponseCallback?: (response: SDKControlResponse) => void;

  constructor(input: AsyncIterable<string>, replayUserMessages: boolean = false) {
    this.input = input;
    this.replayUserMessages = replayUserMessages;
  }

  /**
   * Async generator that reads and parses JSON-lines from input.
   * Original: read() method in wmA
   */
  async *read(): AsyncGenerator<SDKMessage, void, unknown> {
    let buffer = '';

    try {
      for await (const chunk of this.input) {
        buffer += chunk;

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.trim() === '') continue;

          const message = await this.processLine(line);
          if (message) {
            yield message;
          }
        }
      }
    } finally {
      this.inputClosed = true;
    }
  }

  /**
   * Process a single JSON line and route appropriately.
   * Original: processLine() in wmA
   */
  protected async processLine(line: string): Promise<SDKMessage | null> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(line);
    } catch (error) {
      console.error(`[SDK] Failed to parse JSON: ${line}`);
      return null;
    }

    if (!parsed || typeof parsed !== 'object') {
      console.error(`[SDK] Invalid message format: ${line}`);
      return null;
    }

    const message = parsed as SDKMessage;

    // Route by message type
    switch (message.type) {
      case 'keep_alive':
        // Silently ignore keep-alive messages
        return null;

      case 'control_response':
        // Route to pending request
        this.handleControlResponse(message as SDKControlResponse);
        return null;

      case 'control_request':
      case 'user':
        // Validate and yield to consumer
        return this.validateAndReturn(message);

      default:
        console.error(`[SDK] Unknown message type: ${message.type}`);
        // Exit on unknown message type in production
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        }
        return null;
    }
  }

  /**
   * Handle control response by resolving/rejecting pending request.
   */
  protected handleControlResponse(response: SDKControlResponse): void {
    const pending = this.pendingRequests.get(response.request_id);

    if (!pending) {
      // Unexpected response (e.g., after timeout)
      console.debug(`[SDK] Unexpected control response: ${response.request_id}`);
      if (this.unexpectedResponseCallback) {
        this.unexpectedResponseCallback(response);
      }
      return;
    }

    this.pendingRequests.delete(response.request_id);

    // Validate response if schema provided
    if (pending.schema) {
      // TODO: Validate against schema
    }

    // Check for error
    if ('error' in response.response && response.response.error) {
      pending.reject(new Error(String(response.response.error)));
    } else {
      pending.resolve(response.response);
    }
  }

  /**
   * Validate message and return for processing.
   */
  protected validateAndReturn(message: SDKMessage): SDKMessage | null {
    if (message.type === 'user') {
      const userMessage = message as SDKUserMessage;
      if (
        !userMessage.message ||
        typeof userMessage.message !== 'object' ||
        userMessage.message.role !== 'user'
      ) {
        console.error('[SDK] Invalid user message format');
        return null;
      }
    }

    if (message.type === 'control_request') {
      const controlRequest = message as SDKControlRequest;
      if (!controlRequest.request_id || !controlRequest.request) {
        console.error('[SDK] Invalid control request format');
        return null;
      }
    }

    return message;
  }

  /**
   * Write message to stdout as JSON-line.
   * Original: write() in wmA
   */
  write(message: SDKMessage): void {
    const jsonLine = JSON.stringify(message) + '\n';
    writeToStdout(jsonLine);
  }

  /**
   * Send control request and wait for response.
   * Original: sendRequest() in wmA
   */
  async sendRequest<T>(
    request: object,
    schema?: object,
    signal?: AbortSignal
  ): Promise<T> {
    const requestId = generateControlRequestId();

    const controlRequest: SDKControlRequest = {
      type: 'control_request',
      request_id: requestId,
      request: request as SDKControlRequest['request'],
    };

    return new Promise<T>((resolve, reject) => {
      // Store pending request
      this.pendingRequests.set(requestId, {
        request: controlRequest,
        resolve: resolve as (response: unknown) => void,
        reject,
        schema,
      });

      // Handle abort signal
      if (signal) {
        signal.addEventListener('abort', () => {
          if (this.pendingRequests.has(requestId)) {
            this.pendingRequests.delete(requestId);
            reject(new Error('Request aborted'));
          }
        });
      }

      // Send request
      this.write(controlRequest);
    });
  }

  /**
   * Get all pending permission requests (can_use_tool type).
   * Original: getPendingPermissionRequests() in wmA
   */
  getPendingPermissionRequests(): SDKControlRequest[] {
    const permissionRequests: SDKControlRequest[] = [];

    for (const pending of this.pendingRequests.values()) {
      if (
        pending.request.request &&
        'type' in pending.request.request &&
        pending.request.request.type === 'can_use_tool'
      ) {
        permissionRequests.push(pending.request);
      }
    }

    return permissionRequests;
  }

  /**
   * Set callback for unexpected responses.
   * Original: setUnexpectedResponseCallback() in wmA
   */
  setUnexpectedResponseCallback(callback: (response: SDKControlResponse) => void): void {
    this.unexpectedResponseCallback = callback;
  }

  /**
   * Create can-use-tool callback.
   * Original: createCanUseTool() in wmA
   */
  createCanUseTool(): (
    tool: unknown,
    input: Record<string, unknown>,
    context: unknown,
    globals: unknown,
    toolUseId: string,
    querySource?: string
  ) => Promise<SDKCanUseToolResponse> {
    return async (tool, input, _context, _globals, toolUseId, _querySource) => {
      const toolName = typeof tool === 'object' && tool !== null && 'name' in tool
        ? String((tool as { name: string }).name)
        : 'unknown';

      const response = await this.sendRequest<SDKCanUseToolResponse>({
        type: 'can_use_tool',
        tool_name: toolName,
        tool_input: input,
        tool_use_id: toolUseId,
      });

      return response;
    };
  }

  /**
   * Create hook callback.
   * Original: createHookCallback() in wmA
   */
  createHookCallback(
    callbackId: string,
    timeout?: number
  ): (eventType: string, eventData: Record<string, unknown>) => Promise<SDKHookCallbackResponse> {
    return async (eventType, eventData) => {
      const controller = new AbortController();
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      if (timeout) {
        timeoutHandle = setTimeout(() => {
          controller.abort();
        }, timeout);
      }

      try {
        const response = await this.sendRequest<SDKHookCallbackResponse>(
          {
            type: 'hook_callback',
            callback_id: callbackId,
            event_type: eventType,
            event_data: eventData,
          },
          undefined,
          controller.signal
        );
        return response;
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      }
    };
  }

  /**
   * Send MCP message to SDK-connected server.
   * Original: sendMcpMessage() in wmA
   */
  async sendMcpMessage(
    serverName: string,
    message: object
  ): Promise<SDKMcpMessageResponse> {
    return this.sendRequest<SDKMcpMessageResponse>({
      type: 'mcp_message',
      server_name: serverName,
      message,
    });
  }
}

// ============================================
// Stdin Reader
// ============================================

/**
 * Create async iterable from stdin.
 */
export async function* readStdin(): AsyncGenerator<string, void, unknown> {
  const { stdin } = process;
  stdin.setEncoding('utf8');

  for await (const chunk of stdin) {
    yield chunk;
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
