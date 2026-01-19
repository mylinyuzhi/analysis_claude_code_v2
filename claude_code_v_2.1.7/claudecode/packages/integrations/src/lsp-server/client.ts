/**
 * @claudecode/integrations - LSP Client
 *
 * Low-level LSP client for JSON-RPC communication.
 * Reconstructed from chunks.114.mjs:1580-1773
 */

import { spawn, ChildProcess } from 'child_process';
import type {
  LspClient,
  LspClientStartOptions,
  LspInitializeParams,
  LspInitializeResult,
  LspServerCapabilities,
} from './types.js';
import { LSP_CONSTANTS } from './types.js';

// ============================================
// LSP Client Implementation
// ============================================

/**
 * Create a low-level LSP client.
 * Original: Dy2 (createLspClient) in chunks.114.mjs:1580-1773
 *
 * Uses JSON-RPC over stdio to communicate with LSP server.
 */
export function createLspClient(serverName: string): LspClient {
  let childProcess: ChildProcess | undefined;
  let capabilities: LspServerCapabilities | undefined;
  let isInitialized = false;
  let hasError = false;
  let lastError: Error | undefined;
  let isShuttingDown = false;

  // Message ID counter for JSON-RPC
  let messageId = 0;

  // Pending requests map
  const pendingRequests = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();

  // Notification handlers
  const notificationHandlers = new Map<string, (params: unknown) => void>();
  const requestHandlers = new Map<
    string,
    (params: unknown) => unknown | Promise<unknown>
  >();

  // Buffer for incomplete messages
  let buffer = '';

  function checkError(): void {
    if (hasError && lastError) {
      throw lastError;
    }
  }

  function sendMessage(message: object): void {
    if (!childProcess?.stdin) {
      throw new Error('LSP client not started');
    }
    const content = JSON.stringify(message);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    childProcess.stdin.write(header + content);
  }

  function handleMessage(message: {
    id?: number;
    method?: string;
    result?: unknown;
    error?: { code: number; message: string };
    params?: unknown;
  }): void {
    if (message.id !== undefined && pendingRequests.has(message.id)) {
      // Response to a request
      const pending = pendingRequests.get(message.id)!;
      pendingRequests.delete(message.id);

      if (message.error) {
        const error = new Error(message.error.message);
        (error as any).code = message.error.code;
        pending.reject(error);
      } else {
        pending.resolve(message.result);
      }
    } else if (message.method) {
      // Notification or request from server
      if (message.id !== undefined) {
        // Request from server
        const handler = requestHandlers.get(message.method);
        if (handler) {
          Promise.resolve(handler(message.params)).then(
            (result) => {
              sendMessage({ jsonrpc: '2.0', id: message.id, result });
            },
            (error) => {
              sendMessage({
                jsonrpc: '2.0',
                id: message.id,
                error: { code: -32603, message: error.message },
              });
            }
          );
        } else {
          sendMessage({
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Method not found: ${message.method}` },
          });
        }
      } else {
        // Notification from server
        const handler = notificationHandlers.get(message.method);
        if (handler) {
          handler(message.params);
        }
      }
    }
  }

  function parseMessages(data: string): void {
    buffer += data;

    while (true) {
      // Look for Content-Length header
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) break;

      const header = buffer.substring(0, headerEnd);
      const contentLengthMatch = header.match(/Content-Length:\s*(\d+)/i);
      if (!contentLengthMatch) {
        // Invalid header, skip
        buffer = buffer.substring(headerEnd + 4);
        continue;
      }

      const captured = contentLengthMatch[1];
      if (!captured) {
        buffer = buffer.substring(headerEnd + 4);
        continue;
      }
      const contentLength = parseInt(captured, 10);
      const messageStart = headerEnd + 4;
      const messageEnd = messageStart + contentLength;

      if (buffer.length < messageEnd) {
        // Incomplete message, wait for more data
        break;
      }

      const messageContent = buffer.substring(messageStart, messageEnd);
      buffer = buffer.substring(messageEnd);

      try {
        const message = JSON.parse(messageContent);
        handleMessage(message);
      } catch (e) {
        console.error(`Failed to parse LSP message: ${e}`);
      }
    }
  }

  return {
    async start(command: string, args: string[], options: LspClientStartOptions = {}) {
      // Spawn LSP server process
      childProcess = spawn(command, args, {
        env: { ...process.env, ...options.env },
        cwd: options.cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      childProcess.on('error', (error) => {
        if (!isShuttingDown) {
          hasError = true;
          lastError = error;
          console.error(`LSP server ${serverName} spawn error: ${error.message}`);
        }
      });

      childProcess.on('exit', (code, signal) => {
        if (!isShuttingDown) {
          isInitialized = false;
          console.log(
            `LSP server ${serverName} exited with code ${code}, signal ${signal}`
          );
        }
      });

      childProcess.stdout?.on('data', (data: Buffer) => {
        parseMessages(data.toString());
      });

      childProcess.stderr?.on('data', (data: Buffer) => {
        console.error(`[LSP ${serverName} stderr]: ${data.toString()}`);
      });

      console.log(`LSP client started for ${serverName}`);
    },

    async initialize(params: LspInitializeParams): Promise<LspInitializeResult> {
      if (!childProcess) {
        throw new Error('LSP client not started');
      }
      checkError();

      try {
        const result = (await this.sendRequest(
          LSP_CONSTANTS.METHODS.INITIALIZE,
          params
        )) as LspInitializeResult;
        capabilities = result.capabilities;
        await this.sendNotification(LSP_CONSTANTS.METHODS.INITIALIZED, {});
        isInitialized = true;
        console.log(`LSP server ${serverName} initialized`);
        return result;
      } catch (error) {
        throw new Error(
          `LSP server ${serverName} initialize failed: ${(error as Error).message}`
        );
      }
    },

    async sendRequest<T>(method: string, params?: unknown): Promise<T> {
      if (!childProcess) {
        throw new Error('LSP client not started');
      }
      checkError();
      if (!isInitialized && method !== LSP_CONSTANTS.METHODS.INITIALIZE) {
        throw new Error('LSP server not initialized');
      }

      const id = ++messageId;
      const message = { jsonrpc: '2.0', id, method, params };

      return new Promise<T>((resolve, reject) => {
        pendingRequests.set(id, {
          resolve: resolve as (value: unknown) => void,
          reject,
        });
        sendMessage(message);
      });
    },

    async sendNotification(method: string, params?: unknown): Promise<void> {
      if (!childProcess) {
        throw new Error('LSP client not started');
      }
      checkError();
      sendMessage({ jsonrpc: '2.0', method, params });
    },

    onNotification(method: string, handler: (params: unknown) => void): void {
      notificationHandlers.set(method, handler);
    },

    onRequest<T>(
      method: string,
      handler: (params: unknown) => T | Promise<T>
    ): void {
      requestHandlers.set(method, handler);
    },

    async stop(): Promise<void> {
      isShuttingDown = true;
      try {
        if (childProcess && isInitialized) {
          await this.sendRequest(LSP_CONSTANTS.METHODS.SHUTDOWN, null);
          await this.sendNotification(LSP_CONSTANTS.METHODS.EXIT, null);
        }
      } catch (error) {
        // Ignore errors during shutdown
      } finally {
        if (childProcess) {
          childProcess.removeAllListeners();
          childProcess.kill();
          childProcess = undefined;
        }
        isInitialized = false;
        capabilities = undefined;
        isShuttingDown = false;
        pendingRequests.clear();
        console.log(`LSP client stopped for ${serverName}`);
      }
    },

    get isInitialized(): boolean {
      return isInitialized;
    },

    get capabilities(): LspServerCapabilities | undefined {
      return capabilities;
    },
  };
}

// ============================================
// Export
// ============================================

// NOTE: createLspClient 已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
