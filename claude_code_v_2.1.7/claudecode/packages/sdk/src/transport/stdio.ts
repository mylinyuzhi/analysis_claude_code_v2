/**
 * @claudecode/sdk - Stdio Transport
 *
 * JSON-lines transport over stdin/stdout.
 * Reconstructed from chunks.155.mjs:2621-2790 (wmA)
 */

import { z } from 'zod';
import type {
  SDKMessage,
  SDKUserMessage,
  SDKControlRequest,
  SDKControlResponse,
  SDKTransport,
  SDKPendingRequest,
  SDKCanUseToolResponse,
  SDKHookCallbackResponse,
  SDKMcpMessageResponse,
} from '../types.js';
import { SDK_CONSTANTS } from '../types.js';
import {
  canUseToolResponseSchema,
  hookCallbackResponseSchema,
} from '../protocol/messages.js';

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
  // Fallback UUID generation (matches source behavior)
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
// Error Exit
// ============================================

/**
 * Exit with error message.
 * Original: Wy0 (exitWithError) in chunks.155.mjs:2792-2794
 */
export function exitWithError(message: string): never {
  console.error(message);
  process.exit(1);
}

// ============================================
// Helper Functions
// ============================================

/**
 * Extract decision reason for SDK.
 * Original: ER7 (extractDecisionReason) in chunks.155.mjs:2603-2619
 */
function extractDecisionReason(reason: any): string | undefined {
  if (!reason) return undefined;
  switch (reason.type) {
    case 'rule':
    case 'mode':
    case 'subcommandResults':
    case 'permissionPromptTool':
      return undefined;
    case 'hook':
    case 'asyncAgent':
    case 'sandboxOverride':
    case 'classifier':
    case 'workingDir':
    case 'other':
      return reason.reason;
    default:
      return undefined;
  }
}

/**
 * Process tool permission response from SDK.
 * Original: NmA (processToolPermissionResponse) in chunks.155.mjs:2551-2572
 */
function processToolPermissionResponse(
  response: any,
  tool: any,
  input: any,
  context: any
): any {
  const decisionReason = {
    type: 'permissionPromptTool',
    permissionPromptToolName: tool.name,
    toolResult: response,
  };

  if (response.behavior === 'allow') {
    const updatedPermissions = response.updatedPermissions;
    if (updatedPermissions) {
      // NOTE: context.setAppState implementation depends on core state management
      context.setAppState((state: any) => ({
        ...state,
        // Original: Wk(J.toolPermissionContext, Y) - mergePermissions
        toolPermissionContext: {
          ...state.toolPermissionContext,
          // Placeholder for merge logic until implemented in core
          rules: [...(state.toolPermissionContext.rules || []), ...updatedPermissions],
        },
      }));
      // Original: cMA(Y) - savePermissions
      // Implementation placeholder for persisting permissions
    }
    return {
      ...response,
      decisionReason,
    };
  } else if (response.behavior === 'deny' && response.interrupt) {
    context.abortController.abort();
  }

  return {
    ...response,
    decisionReason,
  };
}

/**
 * AbortError class.
 * Original: aG in source
 */
class AbortError extends Error {
  constructor() {
    super('Request aborted');
    this.name = 'AbortError';
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
  protected structuredInput: AsyncGenerator<SDKMessage, void, unknown>;
  protected pendingRequests: Map<string, SDKPendingRequest> = new Map();
  protected inputClosed: boolean = false;
  protected unexpectedResponseCallback?: (response: SDKControlResponse) => Promise<void>;

  constructor(input: AsyncIterable<string>, replayUserMessages: boolean = false) {
    this.input = input;
    this.replayUserMessages = replayUserMessages;
    this.structuredInput = this.read();
  }

  /**
   * Async generator that reads and parses JSON-lines from input.
   * Original: read() method in wmA (chunks.155.mjs:2633-2652)
   */
  async *read(): AsyncGenerator<SDKMessage, void, unknown> {
    let buffer = '';

    for await (const chunk of this.input) {
      buffer += chunk;
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        const message = await this.processLine(line);
        if (message) yield message;
      }
    }

    if (buffer) {
      const message = await this.processLine(buffer);
      if (message) yield message;
    }

    this.inputClosed = true;
    for (const pending of this.pendingRequests.values()) {
      pending.reject(new Error('Tool permission stream closed before response received'));
    }
  }

  /**
   * Process a single JSON line and route appropriately.
   * Original: processLine() in wmA (chunks.155.mjs:2659-2692)
   */
  protected async processLine(line: string): Promise<SDKMessage | null | undefined> {
    try {
      const message = JSON.parse(line) as SDKMessage;

      if (message.type === 'keep_alive') return;

      if (message.type === 'control_response') {
        const controlResponse = message as SDKControlResponse;
        const pending = this.pendingRequests.get(controlResponse.request_id);

        if (!pending) {
          if (this.unexpectedResponseCallback) {
            await this.unexpectedResponseCallback(controlResponse);
          }
          return;
        }

        this.pendingRequests.delete(controlResponse.request_id);

        if ('subtype' in controlResponse.response && controlResponse.response.subtype === 'error') {
          pending.reject(new Error(String(controlResponse.response.error)));
          return;
        }

        const responseData = (controlResponse.response as any).response || controlResponse.response;
        if (pending.schema) {
          try {
            pending.resolve((pending.schema as any).parse(responseData));
          } catch (validationError) {
            pending.reject(validationError as Error);
          }
        } else {
          pending.resolve(responseData || {});
        }

        if (this.replayUserMessages) return message;
        return;
      }

      if (message.type !== 'user' && message.type !== 'control_request') {
        exitWithError(`Error: Expected message type 'user' or 'control', got '${message.type}'`);
      }

      if (message.type === 'control_request') {
        const controlRequest = message as SDKControlRequest;
        if (!controlRequest.request) {
          exitWithError('Error: Missing request on control_request');
        }
        return controlRequest;
      }

      const userMessage = message as SDKUserMessage;
      if (userMessage.message.role !== 'user') {
        exitWithError(`Error: Expected message role 'user', got '${userMessage.message.role}'`);
      }

      return userMessage;
    } catch (error) {
      console.error(`Error parsing streaming input line: ${line}: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Write message to stdout as JSON-line.
   * Original: write() in wmA (chunks.155.mjs:2693-2696)
   */
  write(message: SDKMessage): void {
    const jsonLine = JSON.stringify(message) + '\n';
    writeToStdout(jsonLine);
  }

  /**
   * Send control request and wait for response.
   * Original: sendRequest() in wmA (chunks.155.mjs:2697-2737)
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
      request: request as any,
    };

    if (this.inputClosed) throw new Error('Stream closed');
    if (signal?.aborted) throw new Error('Request aborted');

    this.write(controlRequest);

    const abortHandler = () => {
      this.write({
        type: 'control_cancel_request',
        request_id: requestId,
      } as any);
      const pending = this.pendingRequests.get(requestId);
      if (pending) pending.reject(new AbortError());
    };

    if (signal) {
      signal.addEventListener('abort', abortHandler, { once: true });
    }

    try {
      return await new Promise<T>((resolve, reject) => {
        this.pendingRequests.set(requestId, {
          request: controlRequest,
          resolve: resolve as (response: unknown) => void,
          reject,
          schema,
        });
      });
    } finally {
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Get all pending permission requests (can_use_tool type).
   * Original: getPendingPermissionRequests() in wmA (chunks.155.mjs:2653-2655)
   */
  getPendingPermissionRequests(): SDKControlRequest[] {
    return Array.from(this.pendingRequests.values())
      .map((p) => p.request)
      .filter((r) => (r.request as any).subtype === 'can_use_tool');
  }

  /**
   * Set callback for unexpected responses.
   * Original: setUnexpectedResponseCallback() in wmA (chunks.155.mjs:2656-2658)
   */
  setUnexpectedResponseCallback(callback: (response: SDKControlResponse) => Promise<void>): void {
    this.unexpectedResponseCallback = callback;
  }

  /**
   * Create can-use-tool callback.
   * Original: createCanUseTool() in wmA (chunks.155.mjs:2738-2762)
   */
  createCanUseTool(): (
    tool: any,
    input: Record<string, unknown>,
    context: any,
    globals: any,
    toolUseId: string
  ) => Promise<SDKCanUseToolResponse> {
    return async (tool, input, context, globals, toolUseId) => {
      // NOTE: toolPermissionDispatcher (B$) needs implementation in core
      // For now, assume it's passed or available. 
      // Original calls B$(tool, input, context, globals, toolUseId)
      const localResult = await (context.toolPermissionDispatcher || 
        (async () => ({ behavior: 'ask' })))(tool, input, context, globals, toolUseId);

      if (localResult.behavior === 'allow' || localResult.behavior === 'deny') {
        return localResult;
      }

      try {
        const response = await this.sendRequest<any>(
          {
            subtype: 'can_use_tool',
            tool_name: tool.name,
            input: input,
            permission_suggestions: localResult.suggestions,
            blocked_path: localResult.blockedPath,
            decision_reason: extractDecisionReason(localResult.decisionReason),
            tool_use_id: toolUseId,
            agent_id: context.agentId,
          },
          canUseToolResponseSchema,
          context.abortController?.signal
        );

        return processToolPermissionResponse(response, tool, input, context);
      } catch (error) {
        return processToolPermissionResponse(
          {
            behavior: 'deny',
            message: `Tool permission request failed: ${error}`,
            toolUseID: toolUseId,
          },
          tool,
          input,
          context
        );
      }
    };
  }

  /**
   * Create hook callback.
   * Original: createHookCallback() in wmA (chunks.155.mjs:2763-2780)
   */
  createHookCallback(
    callbackId: string,
    timeout?: number
  ): {
    type: 'callback';
    timeout?: number;
    callback: (input: any, toolUseId: string | null, abortSignal?: AbortSignal) => Promise<SDKHookCallbackResponse>;
  } {
    return {
      type: 'callback',
      timeout,
      callback: async (input, toolUseId, abortSignal) => {
        try {
          return await this.sendRequest<SDKHookCallbackResponse>(
            {
              subtype: 'hook_callback',
              callback_id: callbackId,
              input: input,
              tool_use_id: toolUseId || undefined,
            },
            hookCallbackResponseSchema,
            abortSignal
          );
        } catch (error) {
          console.error(`Error in hook callback ${callbackId}:`, error);
          return {} as SDKHookCallbackResponse;
        }
      },
    };
  }

  /**
   * Send MCP message to SDK-connected server.
   * Original: sendMcpMessage() in wmA (chunks.155.mjs:2781-2789)
   */
  async sendMcpMessage(
    serverName: string,
    message: object
  ): Promise<any> {
    const response = await this.sendRequest<any>(
      {
        subtype: 'mcp_message',
        server_name: serverName,
        message,
      },
      z.object({
        mcp_response: z.any(),
      })
    );
    return response.mcp_response;
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
