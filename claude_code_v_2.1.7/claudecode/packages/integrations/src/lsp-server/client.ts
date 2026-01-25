/**
 * @claudecode/integrations - LSP Client
 *
 * Low-level LSP client for JSON-RPC communication.
 * Reconstructed from chunks.114.mjs:1580-1773
 */

import { spawn, type ChildProcess } from 'child_process';
import * as rpc from 'vscode-jsonrpc/node.js';
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
 * Naming restored for readability.
 */
export function createLspClient(serverName: string): LspClient {
  let process: ChildProcess | undefined;
  let connection: rpc.MessageConnection | undefined;
  let capabilities: LspServerCapabilities | undefined;
  let isInitialized = false;
  let hasError = false;
  let lastError: Error | undefined;
  let isShuttingDown = false;

  // Queued handlers for when connection is not yet ready
  // Original: I (notification) and D (request) arrays
  const queuedNotificationHandlers: Array<{ method: string; handler: (params: any) => void }> = [];
  const queuedRequestHandlers: Array<{ method: string; handler: (params: any) => any }> = [];

  function checkError(): void {
    // Original: W
    if (hasError) {
      throw lastError || new Error(`LSP server ${serverName} failed to start`);
    }
  }

  return {
    get capabilities() {
      return capabilities;
    },

    get isInitialized() {
      return isInitialized;
    },

    async start(command: string, args: string[], options: LspClientStartOptions = {}) {
      try {
        // Original: chunks.114.mjs:1633
        process = spawn(command, args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: options.env ? { ...globalThis.process.env, ...options.env } as any : undefined,
          cwd: options.cwd,
        });

        if (!process.stdout || !process.stdin) {
          throw new Error('LSP server process stdio not available');
        }

        const cp = process;

        // Wait for process to spawn or fail
        await new Promise<void>((resolve, reject) => {
          const onSpawn = () => {
            cleanup();
            resolve();
          };
          const onError = (err: Error) => {
            cleanup();
            reject(err);
          };
          const cleanup = () => {
            cp.removeListener('spawn', onSpawn);
            cp.removeListener('error', onError);
          };
          cp.once('spawn', onSpawn);
          cp.once('error', onError);
        });

        // Log stderr
        if (process.stderr) {
          process.stderr.on('data', (data: Buffer) => {
            const output = data.toString().trim();
            if (output) {
              console.log(`[LSP SERVER ${serverName}] ${output}`);
            }
          });
        }

        // Handle process events
        process.on('error', (err) => {
          if (!isShuttingDown) {
            hasError = true;
            lastError = err;
            console.error(`LSP server ${serverName} failed to start: ${err.message}`);
          }
        });

        process.on('exit', (code, signal) => {
          if (code !== 0 && code !== null && !isShuttingDown) {
            isInitialized = false;
            hasError = false;
            lastError = undefined;
            console.error(`LSP server ${serverName} crashed with exit code ${code}`);
          }
        });

        if (process.stdin) {
          process.stdin.on('error', (err) => {
            if (!isShuttingDown) {
              console.log(`LSP server ${serverName} stdin error: ${err.message}`);
            }
          });
        }

        // Setup JSON-RPC connection
        const reader = new rpc.StreamMessageReader(process.stdout);
        const writer = new rpc.StreamMessageWriter(process.stdin);
        connection = rpc.createMessageConnection(reader, writer);

        connection.onError(([error]) => {
          if (!isShuttingDown) {
            hasError = true;
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`LSP server ${serverName} connection error: ${lastError.message}`);
          }
        });

        connection.onClose(() => {
          if (!isShuttingDown) {
            isInitialized = false;
            console.log(`LSP server ${serverName} connection closed`);
          }
        });

        connection.listen();

        // Enable tracing (Original: Trace.Verbose)
        connection.trace(rpc.Trace.Verbose, {
          log: (msg) => {
            console.log(`[LSP PROTOCOL ${serverName}] ${msg}`);
          },
        }).catch((err) => {
          console.log(`Failed to enable tracing for ${serverName}: ${err.message}`);
        });

        // Apply queued handlers
        for (const { method, handler } of queuedNotificationHandlers) {
          connection.onNotification(method, handler);
          console.log(`Applied queued notification handler for ${serverName}.${method}`);
        }
        queuedNotificationHandlers.length = 0;

        for (const { method, handler } of queuedRequestHandlers) {
          connection.onRequest(method, handler);
          console.log(`Applied queued request handler for ${serverName}.${method}`);
        }
        queuedRequestHandlers.length = 0;

        console.log(`LSP client started for ${serverName}`);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`LSP server ${serverName} failed to start: ${error.message}`);
        throw error;
      }
    },

    async initialize(params: LspInitializeParams): Promise<LspInitializeResult> {
      if (!connection) throw new Error('LSP client not started');
      checkError();
      try {
        const result = (await connection.sendRequest('initialize', params)) as LspInitializeResult;
        capabilities = result.capabilities;
        await connection.sendNotification('initialized', {});
        isInitialized = true;
        console.log(`LSP server ${serverName} initialized`);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`LSP server ${serverName} initialize failed: ${error.message}`);
        throw error;
      }
    },

    async sendRequest<T>(method: string, params?: unknown): Promise<T> {
      if (!connection) throw new Error('LSP client not started');
      checkError();
      if (!isInitialized && method !== 'initialize') {
        throw new Error('LSP server not initialized');
      }
      try {
        return (await connection.sendRequest(method, params)) as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`LSP server ${serverName} request ${method} failed: ${error.message}`);
        throw error;
      }
    },

    async sendNotification(method: string, params?: unknown): Promise<void> {
      if (!connection) throw new Error('LSP client not started');
      checkError();
      try {
        await connection.sendNotification(method, params);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`LSP server ${serverName} notification ${method} failed: ${error.message}`);
        console.log(`Notification ${method} failed but continuing`);
      }
    },

    onNotification(method: string, handler: (params: any) => void) {
      if (!connection) {
        queuedNotificationHandlers.push({ method, handler });
        console.log(`Queued notification handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkError();
      connection.onNotification(method, handler);
    },

    onRequest(method: string, handler: (params: any) => any) {
      if (!connection) {
        queuedRequestHandlers.push({ method, handler });
        console.log(`Queued request handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkError();
      connection.onRequest(method, handler);
    },

    async stop(): Promise<void> {
      let stopError: Error | undefined;
      isShuttingDown = true;
      try {
        if (connection) {
          await connection.sendRequest('shutdown', null);
          await connection.sendNotification('exit', null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`LSP server ${serverName} stop failed: ${error.message}`);
        stopError = error;
      } finally {
        if (connection) {
          try {
            connection.dispose();
          } catch (err: any) {
            console.log(`Connection disposal failed for ${serverName}: ${err.message}`);
          }
          connection = undefined;
        }
        if (process) {
          process.removeAllListeners('error');
          process.removeAllListeners('exit');
          if (process.stdin) process.stdin.removeAllListeners('error');
          if (process.stderr) process.stderr.removeAllListeners('data');
          try {
            process.kill();
          } catch (err: any) {
            console.log(`Process kill failed for ${serverName} (may already be dead): ${err.message}`);
          }
          process = undefined;
        }
        isInitialized = false;
        capabilities = undefined;
        isShuttingDown = false;
        if (stopError) {
          hasError = true;
          lastError = stopError;
        }
        console.log(`LSP client stopped for ${serverName}`);
      }
      if (stopError) throw stopError;
    },
  };
}


// ============================================
// Export
// ============================================

// NOTE: createLspClient 已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
