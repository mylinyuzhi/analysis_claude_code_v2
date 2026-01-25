/**
 * @claudecode/integrations - LSP Client
 *
 * Low-level LSP client implementation handling JSON-RPC communication over stdio.
 * Reconstructed from chunks.114.mjs
 */

import * as cp from 'child_process';
import {
  createMessageConnection,
  StreamMessageReader,
  StreamMessageWriter,
  type MessageConnection,
  Trace,
  type Disposable
} from 'vscode-jsonrpc/node';
import type {
  LspClient,
  LspClientStartOptions,
  LspInitializeParams,
  LspInitializeResult,
  LspServerCapabilities
} from './types';

/**
 * Creates a new LSP client instance.
 * Original: Dy2 in chunks.114.mjs:1614-1774
 */
export function createLspClient(serverName: string): LspClient {
  let process: cp.ChildProcess | undefined;
  let connection: MessageConnection | undefined;
  let capabilities: LspServerCapabilities | undefined;
  let isInitialized = false;
  let hasError = false;
  let lastError: Error | undefined;
  let isStopping = false;

  // Queue for handlers registered before connection is ready
  // Original: I (notifications) and D (requests) in chunks.114.mjs:1618-1619
  const notificationHandlers: Array<{ method: string; handler: (params: any) => void }> = [];
  const requestHandlers: Array<{ method: string; handler: (params: any) => any }> = [];

  function checkState() {
    if (hasError) {
      throw lastError || new Error(`LSP server ${serverName} failed to start`);
    }
  }

  function log(message: string) {
    // In original code: k(`[LSP SERVER ${A}] ${O}`)
    // We'll use console.log for now, or a logger if available
    // console.log(`[LSP Client - ${serverName}] ${message}`);
  }

  function error(err: Error) {
    // In original code: e(Error(...))
    console.error(`[LSP Client - ${serverName}] Error:`, err);
  }

  return {
    get capabilities() {
      return capabilities;
    },

    get isInitialized() {
      return isInitialized;
    },

    /**
     * Starts the LSP server process.
     * Original: start in chunks.114.mjs:1631
     */
    async start(command: string, args: string[], options?: LspClientStartOptions) {
      try {
        // Original: Mg5(K, V, { ... }) in chunks.114.mjs:1633
        process = cp.spawn(command, args || [], {
          stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
          env: options?.env ? { ...globalThis.process.env, ...options.env } : undefined,
          cwd: options?.cwd,
          shell: true // Often needed for command execution
        });

        if (!process.stdout || !process.stdin) {
          throw new Error('LSP server process stdio not available');
        }

        const proc = process;

        // Wait for spawn or error
        // Original: chunks.114.mjs:1642-1652
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
            proc.removeListener('spawn', onSpawn);
            proc.removeListener('error', onError);
          };
          proc.once('spawn', onSpawn);
          proc.once('error', onError);
        });

        // Handle stderr
        // Original: chunks.114.mjs:1653
        if (process.stderr) {
          process.stderr.on('data', (data: Buffer) => {
            const msg = data.toString().trim();
            if (msg) {
              log(`stderr: ${msg}`);
            }
          });
        }

        // Process error handling
        process.on('error', (err) => {
          if (!isStopping) {
            hasError = true;
            lastError = err;
            error(new Error(`LSP server ${serverName} failed to start: ${err.message}`));
          }
        });

        process.on('exit', (code, signal) => {
          if (code !== 0 && code !== null && !isStopping) {
            isInitialized = false;
            hasError = false; // Reset error flag on exit? Original: Y = !1
            lastError = undefined;
            error(new Error(`LSP server ${serverName} crashed with exit code ${code}`));
          }
        });

        if (process.stdin) {
            process.stdin.on('error', (err) => {
                if (!isStopping) {
                    log(`stdin error: ${err.message}`);
                }
            });
        }

        // Setup JSON-RPC connection
        // Original: chunks.114.mjs:1664
        const reader = new StreamMessageReader(process.stdout);
        const writer = new StreamMessageWriter(process.stdin);
        
        connection = createMessageConnection(reader, writer);

        connection.onError(([err, msg, count]) => {
          if (!isStopping) {
            hasError = true;
            lastError = err;
            error(new Error(`LSP server ${serverName} connection error: ${err.message}`));
          }
        });

        connection.onClose(() => {
          if (!isStopping) {
            isInitialized = false;
            log(`LSP server ${serverName} connection closed`);
          }
        });

        connection.listen();

        // Trace logging
        // Original: chunks.114.mjs:1670
        // We catch trace errors to prevent crashes
        try {
            connection.trace(Trace.Verbose, {
                log: (msg) => log(`[TRACE] ${msg}`)
            });
        } catch (err: any) {
            log(`Failed to enable tracing: ${err.message}`);
        }

        // Apply queued handlers
        // Original: chunks.114.mjs:1677
        for (const { method, handler } of notificationHandlers) {
          connection.onNotification(method, handler);
          log(`Applied queued notification handler for ${serverName}.${method}`);
        }
        notificationHandlers.length = 0;

        for (const { method, handler } of requestHandlers) {
          connection.onRequest(method, handler);
          log(`Applied queued request handler for ${serverName}.${method}`);
        }
        requestHandlers.length = 0;

        log(`LSP client started for ${serverName}`);

      } catch (err: any) {
        error(new Error(`LSP server ${serverName} failed to start: ${err.message}`));
        throw err;
      }
    },

    /**
     * Initializes the LSP session.
     * Original: initialize in chunks.114.mjs:1693
     */
    async initialize(params: LspInitializeParams): Promise<LspInitializeResult> {
      if (!connection) throw new Error('LSP client not started');
      checkState();

      try {
        const result = await connection.sendRequest<LspInitializeResult>('initialize', params);
        capabilities = result.capabilities;
        
        await connection.sendNotification('initialized', {});
        isInitialized = true;
        log(`LSP server ${serverName} initialized`);
        
        return result;
      } catch (err: any) {
        error(new Error(`LSP server ${serverName} initialize failed: ${err.message}`));
        throw err;
      }
    },

    /**
     * Sends a request to the server.
     * Original: sendRequest in chunks.114.mjs:1703
     */
    async sendRequest<T>(method: string, params?: unknown): Promise<T> {
      if (!connection) throw new Error('LSP client not started');
      checkState();
      
      // Original: if (!Z) throw Error("LSP server not initialized");
      // Note: Some requests might be allowed before initialization? 
      // strict mode checks initialization unless it's the initialize request itself, 
      // but sendRequest logic in original checks Z (isInitialized).
      // However, initialize() calls sendRequest('initialize', ...) internally in original? 
      // Wait, original initialize() calls B.sendRequest directly. 
      // This wrapper is for public use.
      if (!isInitialized) throw new Error('LSP server not initialized');

      try {
        return await connection.sendRequest<T>(method, params);
      } catch (err: any) {
        // We rethrow but wrap logic if needed
        // Original: throw e(Error(...)), F
        throw err; 
      }
    },

    /**
     * Sends a notification to the server.
     * Original: sendNotification in chunks.114.mjs:1712
     */
    async sendNotification(method: string, params?: unknown): Promise<void> {
      if (!connection) throw new Error('LSP client not started');
      checkState();

      try {
        await connection.sendNotification(method, params);
      } catch (err: any) {
        error(new Error(`LSP server ${serverName} notification ${method} failed: ${err.message}`));
        log(`Notification ${method} failed but continuing`);
      }
    },

    /**
     * Registers a notification handler.
     * Original: onNotification in chunks.114.mjs:1721
     */
    onNotification(method: string, handler: (params: unknown) => void) {
      if (!connection) {
        notificationHandlers.push({ method, handler });
        log(`Queued notification handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkState();
      connection.onNotification(method, handler);
    },

    /**
     * Registers a request handler.
     * Original: onRequest in chunks.114.mjs:1731
     */
    onRequest<T>(method: string, handler: (params: unknown) => T | Promise<T>) {
      if (!connection) {
        requestHandlers.push({ method, handler });
        log(`Queued request handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkState();
      connection.onRequest(method, handler);
    },

    /**
     * Stops the server.
     * Original: stop in chunks.114.mjs:1741
     */
    async stop() {
      let stopError: Error | undefined;
      isStopping = true;

      try {
        if (connection) {
          // Try graceful shutdown
          await connection.sendRequest('shutdown', null);
          await connection.sendNotification('exit', null);
        }
      } catch (err: any) {
        stopError = err;
        error(new Error(`LSP server ${serverName} stop failed: ${err.message}`));
      } finally {
        // Dispose connection
        if (connection) {
          try {
            connection.dispose();
          } catch (err: any) {
            log(`Connection disposal failed for ${serverName}: ${err.message}`);
          }
          connection = undefined;
        }

        // Kill process
        if (process) {
          process.removeAllListeners('error');
          process.removeAllListeners('exit');
          if (process.stdin) process.stdin.removeAllListeners('error');
          if (process.stderr) process.stderr.removeAllListeners('data');
          
          try {
            process.kill();
          } catch (err: any) {
            log(`Process kill failed for ${serverName} (may already be dead): ${err.message}`);
          }
          process = undefined;
        }

        isInitialized = false;
        capabilities = undefined;
        isStopping = false;
        
        // Original: if (K) Y = !0, J = K; (sets hasError if shutdown failed)
        if (stopError) {
          hasError = true;
          lastError = stopError;
        }

        log(`LSP client stopped for ${serverName}`);
      }

      if (stopError) throw stopError;
    }
  };
}
