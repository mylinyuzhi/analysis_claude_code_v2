/**
 * @claudecode/integrations - MCP SDK Server Implementation
 * 
 * Reconstructed from chunks.86.mjs (HxA), chunks.145.mjs (WuA), chunks.149.mjs (kuA).
 */

import { EventEmitter } from 'events';
import { z } from 'zod';

// ============================================
// Types & Schemas
// ============================================

export const JSONRPC_VERSION = "2.0";

export interface JsonRpcRequest {
  jsonrpc: typeof JSONRPC_VERSION;
  id: string | number;
  method: string;
  params?: any;
}

export interface JsonRpcNotification {
  jsonrpc: typeof JSONRPC_VERSION;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: typeof JSONRPC_VERSION;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export type JsonRpcMessage = JsonRpcRequest | JsonRpcNotification | JsonRpcResponse;

export enum McpErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ConnectionClosed = -32000,
  RequestTimeout = -32001,
}

export class McpError extends Error {
  constructor(public code: number, message: string, public data?: any) {
    super(message);
    this.name = 'McpError';
  }

  static fromError(code: number, message: string, data?: any) {
    return new McpError(code, message, data);
  }
}

// ============================================
// Protocol Base Class (Original: HxA in chunks.86.mjs)
// ============================================

export abstract class Protocol extends EventEmitter {
  protected _transport: any;
  protected _requestHandlers = new Map<string, (request: any, context: any) => Promise<any>>();
  protected _notificationHandlers = new Map<string, (notification: any) => Promise<void>>();
  protected _responseHandlers = new Map<number, (response: any) => void>();
  protected _requestHandlerAbortControllers = new Map<string | number, AbortController>();
  protected _requestMessageId = 0;

  constructor(protected _options: any = {}) {
    super();
  }

  get transport() { return this._transport; }

  setRequestHandler(method: string | any, handler: (request: any, context: any) => Promise<any>) {
    const methodName = typeof method === 'string' ? method : (method as any).shape?.method?.value;
    if (!methodName) throw new Error("Invalid method for request handler");
    this._requestHandlers.set(methodName, handler);
  }

  setNotificationHandler(method: string | any, handler: (notification: any) => Promise<void>) {
    const methodName = typeof method === 'string' ? method : (method as any).shape?.method?.value;
    if (!methodName) throw new Error("Invalid method for notification handler");
    this._notificationHandlers.set(methodName, handler);
  }

  async connect(transport: any) {
    this._transport = transport;
    
    transport.onclose = () => this._onclose();
    transport.onerror = (err: Error) => this._onerror(err);
    transport.onmessage = (message: JsonRpcMessage, extra: any) => {
      if ('result' in message || 'error' in message) {
        this._onresponse(message as JsonRpcResponse);
      } else if ('method' in message && 'id' in message) {
        this._onrequest(message as JsonRpcRequest, extra);
      } else if ('method' in message) {
        this._onnotification(message as JsonRpcNotification);
      } else {
        this._onerror(new Error(`Unknown message type: ${JSON.stringify(message)}`));
      }
    };

    await transport.start();
  }

  protected _onclose() {
    const handlers = this._responseHandlers;
    this._responseHandlers = new Map();
    const error = new McpError(McpErrorCode.ConnectionClosed, "Connection closed");
    this._transport = undefined;
    this.emit('close');
    for (const handler of handlers.values()) {
      handler(error);
    }
  }

  protected _onerror(err: Error) {
    this.emit('error', err);
  }

  protected _onnotification(notification: JsonRpcNotification) {
    const handler = this._notificationHandlers.get(notification.method);
    if (handler) {
      Promise.resolve().then(() => handler(notification)).catch(err => {
        this._onerror(new Error(`Uncaught error in notification handler: ${err}`));
      });
    }
  }

  protected _onrequest(request: JsonRpcRequest, extra: any) {
    const handler = this._requestHandlers.get(request.method);
    if (!handler) {
      this._transport?.send({
        jsonrpc: JSONRPC_VERSION,
        id: request.id,
        error: {
          code: McpErrorCode.MethodNotFound,
          message: `Method not found: ${request.method}`
        }
      }).catch((err: any) => this._onerror(err));
      return;
    }

    const controller = new AbortController();
    this._requestHandlerAbortControllers.set(request.id, controller);

    const context = {
      signal: controller.signal,
      ...extra
    };

    Promise.resolve()
      .then(() => handler(request, context))
      .then(async (result) => {
        if (controller.signal.aborted) return;
        await this._transport?.send({
          jsonrpc: JSONRPC_VERSION,
          id: request.id,
          result
        });
      }, async (error) => {
        if (controller.signal.aborted) return;
        await this._transport?.send({
          jsonrpc: JSONRPC_VERSION,
          id: request.id,
          error: {
            code: error instanceof McpError ? error.code : McpErrorCode.InternalError,
            message: error.message || "Internal error",
            data: error instanceof McpError ? error.data : undefined
          }
        });
      })
      .catch(err => this._onerror(err))
      .finally(() => {
        this._requestHandlerAbortControllers.delete(request.id);
      });
  }

  protected _onresponse(response: JsonRpcResponse) {
    const id = Number(response.id);
    const handler = this._responseHandlers.get(id);
    if (handler) {
      this._responseHandlers.delete(id);
      handler(response);
    } else {
      this._onerror(new Error(`Received a response for an unknown message ID: ${response.id}`));
    }
  }

  async notification(method: string, params?: any) {
    await this._transport?.send({
      jsonrpc: JSONRPC_VERSION,
      method,
      params
    });
  }
}

// ============================================
// Stdio Server Transport (Original: kuA in chunks.149.mjs)
// ============================================

export class StdioServerTransport {
  public onmessage?: (message: JsonRpcMessage) => void;
  public onerror?: (error: Error) => void;
  public onclose?: () => void;
  private _started = false;
  private _buffer = '';

  constructor(private _stdin: NodeJS.ReadableStream = process.stdin, private _stdout: NodeJS.WritableStream = process.stdout) {}

  async start() {
    if (this._started) throw new Error("StdioServerTransport already started");
    this._started = true;

    this._stdin.on('data', (chunk) => {
      this._buffer += chunk.toString();
      this._processBuffer();
    });

    this._stdin.on('error', (err) => this.onerror?.(err));
    this._stdin.on('end', () => this.onclose?.());
  }

  private _processBuffer() {
    const lines = this._buffer.split('\n');
    this._buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const message = JSON.parse(trimmed);
        this.onmessage?.(message);
      } catch (err) {
        this.onerror?.(new Error(`Failed to parse message: ${err}`));
      }
    }
  }

  async send(message: JsonRpcMessage) {
    return new Promise<void>((resolve, reject) => {
      const json = JSON.stringify(message) + '\n';
      if (this._stdout.write(json)) {
        resolve();
      } else {
        this._stdout.once('drain', resolve);
      }
    });
  }

  async close() {
    this._stdin.removeAllListeners();
    this.onclose?.();
  }
}

// ============================================
// Server Class (Original: WuA in chunks.145.mjs)
// ============================================

export class Server extends Protocol {
  constructor(public serverInfo: { name: string, version: string }, options: any = {}) {
    super(options);
    
    // Register initialize handler
    this.setRequestHandler('initialize', async (request) => {
      return {
        protocolVersion: '2024-11-05',
        capabilities: this._options.capabilities || {},
        serverInfo: this.serverInfo
      };
    });
    
    // Notification initialized
    this.setNotificationHandler('notifications/initialized', async () => {
      this.emit('initialized');
    });
  }
}
