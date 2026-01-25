/**
 * @claudecode/integrations - LSP Server Instance
 *
 * Wrapper for individual LSP server processes.
 * Reconstructed from chunks.114.mjs:1784-1958
 */

import { basename } from 'path';
import type {
  LspServerInstance,
  LspServerConfig,
  LspServerState,
  LspClient,
  LspClientCapabilities,
} from './types.js';
import { LSP_CONSTANTS } from './types.js';
import { createLspClient } from './client.js';

// ============================================
// Default Client Capabilities
// ============================================

/**
 * Default LSP client capabilities.
 * Original: chunks.114.mjs:1809-1852
 */
const DEFAULT_CAPABILITIES: LspClientCapabilities = {
  workspace: {
    configuration: false,
    workspaceFolders: false,
  },
  textDocument: {
    synchronization: {
      dynamicRegistration: false,
      willSave: false,
      willSaveWaitUntil: false,
      didSave: true,
    },
    publishDiagnostics: {
      relatedInformation: true,
      tagSupport: { valueSet: [1, 2] },
      versionSupport: false,
      codeDescriptionSupport: true,
      dataSupport: false,
    },
    hover: {
      dynamicRegistration: false,
      contentFormat: ['markdown', 'plaintext'],
    },
    definition: {
      dynamicRegistration: false,
      linkSupport: true,
    },
    references: {
      dynamicRegistration: false,
    },
    documentSymbol: {
      dynamicRegistration: false,
      hierarchicalDocumentSymbolSupport: true,
    },
    callHierarchy: {
      dynamicRegistration: false,
    },
  },
  general: {
    positionEncodings: ['utf-16'],
  },
};

// ============================================
// Server Instance Factory
// ============================================

/**
 * Create an LSP server instance.
 * Original: Vy2 (createLspServerInstance) in chunks.114.mjs:1784-1958
 *
 * @param serverName - Name of the server
 * @param config - Server configuration
 * @param getCwd - Function to get current working directory
 * @returns LSP server instance
 */
export function createLspServerInstance(
  serverName: string,
  config: LspServerConfig,
  getCwd: () => string
): LspServerInstance {
  // Validate unimplemented features
  // Original: chunks.114.mjs:1785-1787
  if (config.restartOnCrash !== undefined) {
    throw new Error(`LSP server '${serverName}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
  }
  if (config.startupTimeout !== undefined) {
    throw new Error(`LSP server '${serverName}': startupTimeout is not yet implemented. Remove this field from the configuration.`);
  }
  if (config.shutdownTimeout !== undefined) {
    throw new Error(`LSP server '${serverName}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
  }

  const client = createLspClient(serverName);
  let state: LspServerState = 'stopped';
  let startTime: Date | undefined;
  let lastError: Error | undefined;
  let restartCount = 0;

  /**
   * Start the LSP server.
   * Original: X in chunks.114.mjs:1791-1858
   */
  async function start(): Promise<void> {
    if (state === 'running' || state === 'starting') {
      return;
    }

    try {
      state = 'starting';
      console.log(`Starting LSP server instance: ${serverName}`);

      await client.start(config.command, config.args || [], {
        env: config.env,
        cwd: config.workspaceFolder,
      });

      const workspaceFolder = config.workspaceFolder || getCwd();
      const workspaceUri = `file://${workspaceFolder}`;

      await client.initialize({
        processId: process.pid,
        initializationOptions: config.initializationOptions ?? {},
        workspaceFolders: [{ uri: workspaceUri, name: basename(workspaceFolder) }],
        rootPath: workspaceFolder,
        rootUri: workspaceUri,
        capabilities: DEFAULT_CAPABILITIES,
      });

      state = 'running';
      startTime = new Date();
      console.log(`LSP server instance started: ${serverName}`);
    } catch (error) {
      state = 'error';
      lastError = error as Error;
      // Original: e(E) (logError)
      console.error(error);
      throw error;
    }
  }

  /**
   * Stop the LSP server.
   * Original: I in chunks.114.mjs:1859-1866
   */
  async function stop(): Promise<void> {
    if (state === 'stopped' || state === 'stopping') {
      return;
    }

    try {
      state = 'stopping';
      await client.stop();
      state = 'stopped';
      console.log(`LSP server instance stopped: ${serverName}`);
    } catch (error) {
      state = 'error';
      lastError = error as Error;
      console.error(error);
      throw error;
    }
  }

  /**
   * Restart the LSP server.
   * Original: D in chunks.114.mjs:1867-1886
   */
  async function restart(): Promise<void> {
    try {
      await stop();
    } catch (error) {
      throw new Error(
        `Failed to stop LSP server '${serverName}' during restart: ${(error as Error).message}`
      );
    }

    restartCount++;
    const maxRestarts = config.maxRestarts ?? LSP_CONSTANTS.DEFAULT_MAX_RESTARTS;

    if (restartCount > maxRestarts) {
      throw new Error(
        `Max restart attempts (${maxRestarts}) exceeded for server '${serverName}'`
      );
    }

    try {
      await start();
    } catch (error) {
      throw new Error(
        `Failed to start LSP server '${serverName}' during restart (attempt ${restartCount}/${maxRestarts}): ${(error as Error).message}`
      );
    }
  }

  /**
   * Check if the server is healthy.
   * Original: W in chunks.114.mjs:1888-1890
   */
  function isHealthy(): boolean {
    return state === 'running' && client.isInitialized;
  }

  /**
   * Send a request to the LSP server with retry logic.
   * Original: K in chunks.114.mjs:1891-1911
   */
  async function sendRequest<T>(method: string, params?: unknown): Promise<T> {
    if (!isHealthy()) {
      const errorMsg = `Cannot send request to LSP server '${serverName}': server is ${state}${
        lastError ? `, last error: ${lastError.message}` : ''
      }`;
      const error = new Error(errorMsg);
      console.error(error);
      throw error;
    }

    let lastErr: Error | undefined;
    for (let attempt = 0; attempt <= LSP_CONSTANTS.MAX_RETRIES; attempt++) {
      try {
        return await client.sendRequest<T>(method, params);
      } catch (error) {
        lastErr = error as Error;
        const errorCode = (error as any).code;

        // Retry on ContentModified error with exponential backoff
        // Original: Rg5 = -32801, _g5 = 500
        if (
          typeof errorCode === 'number' &&
          errorCode === LSP_CONSTANTS.CONTENT_MODIFIED_ERROR_CODE &&
          attempt < LSP_CONSTANTS.MAX_RETRIES
        ) {
          const delay = LSP_CONSTANTS.BASE_RETRY_DELAY * Math.pow(2, attempt);
          console.log(
            `LSP request '${method}' to '${serverName}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt + 1}/${LSP_CONSTANTS.MAX_RETRIES})…`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    const finalError = new Error(
      `LSP request '${method}' failed for server '${serverName}': ${lastErr?.message ?? 'unknown error'}`
    );
    console.error(finalError);
    throw finalError;
  }

  /**
   * Send a notification to the LSP server.
   * Original: V in chunks.114.mjs:1912-1923
   */
  async function sendNotification(method: string, params?: unknown): Promise<void> {
    if (!isHealthy()) {
      const error = new Error(`Cannot send notification to LSP server '${serverName}': server is ${state}`);
      console.error(error);
      throw error;
    }
    try {
      await client.sendNotification(method, params);
    } catch (error) {
      const wrappedError = new Error(`LSP notification '${method}' failed for server '${serverName}': ${(error as Error).message}`);
      console.error(wrappedError);
      throw wrappedError;
    }
  }

  /**
   * Register a notification handler.
   * Original: F in chunks.114.mjs:1925-1927
   */
  function onNotification(method: string, handler: (params: unknown) => void): void {
    client.onNotification(method, handler);
  }

  /**
   * Register a request handler.
   * Original: H in chunks.114.mjs:1929-1931
   */
  function onRequest<T>(
    method: string,
    handler: (params: unknown) => T | Promise<T>
  ): void {
    client.onRequest(method, handler);
  }

  return {
    name: serverName,
    config,
    get state() {
      return state;
    },
    get startTime() {
      return startTime;
    },
    get lastError() {
      return lastError;
    },
    get restartCount() {
      return restartCount;
    },
    start,
    stop,
    restart,
    isHealthy,
    sendRequest,
    sendNotification,
    onNotification,
    onRequest,
  };
}


// ============================================
// Export
// ============================================

// NOTE: createLspServerInstance 已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
