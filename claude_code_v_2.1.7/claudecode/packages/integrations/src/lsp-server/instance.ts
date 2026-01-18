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
  if (config.restartOnCrash !== undefined) {
    throw new Error(`LSP server '${serverName}': restartOnCrash is not yet implemented`);
  }
  if (config.startupTimeout !== undefined) {
    throw new Error(`LSP server '${serverName}': startupTimeout is not yet implemented`);
  }
  if (config.shutdownTimeout !== undefined) {
    throw new Error(`LSP server '${serverName}': shutdownTimeout is not yet implemented`);
  }

  const client = createLspClient(serverName);
  let state: LspServerState = 'stopped';
  let startTime: Date | undefined;
  let lastError: Error | undefined;
  let restartCount = 0;

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
      throw error;
    }
  }

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
      throw error;
    }
  }

  async function restart(): Promise<void> {
    // Step 1: Stop the server
    try {
      await stop();
    } catch (error) {
      throw new Error(
        `Failed to stop LSP server '${serverName}' during restart: ${(error as Error).message}`
      );
    }

    // Step 2: Increment restart counter
    restartCount++;
    const maxRestarts = config.maxRestarts ?? LSP_CONSTANTS.DEFAULT_MAX_RESTARTS;

    // Step 3: Check if max restarts exceeded
    if (restartCount > maxRestarts) {
      throw new Error(
        `Max restart attempts (${maxRestarts}) exceeded for server '${serverName}'`
      );
    }

    // Step 4: Start the server again
    try {
      await start();
    } catch (error) {
      throw new Error(
        `Failed to start LSP server '${serverName}' during restart (attempt ${restartCount}/${maxRestarts}): ${(error as Error).message}`
      );
    }
  }

  function isHealthy(): boolean {
    return state === 'running' && client.isInitialized;
  }

  async function sendRequest<T>(method: string, params?: unknown): Promise<T> {
    if (!isHealthy()) {
      const errorMsg = `Cannot send request to LSP server '${serverName}': server is ${state}${
        lastError ? `, last error: ${lastError.message}` : ''
      }`;
      throw new Error(errorMsg);
    }

    let lastErr: Error | undefined;
    for (let attempt = 0; attempt <= LSP_CONSTANTS.MAX_RETRIES; attempt++) {
      try {
        return await client.sendRequest<T>(method, params);
      } catch (error) {
        lastErr = error as Error;
        const errorCode = (error as any).code;

        // Retry on ContentModified error with exponential backoff
        if (
          typeof errorCode === 'number' &&
          errorCode === LSP_CONSTANTS.CONTENT_MODIFIED_ERROR_CODE &&
          attempt < LSP_CONSTANTS.MAX_RETRIES
        ) {
          const delay = LSP_CONSTANTS.BASE_RETRY_DELAY * Math.pow(2, attempt);
          console.log(
            `LSP request '${method}' to '${serverName}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt + 1}/${LSP_CONSTANTS.MAX_RETRIES})...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    throw new Error(
      `LSP request '${method}' failed for server '${serverName}': ${lastErr?.message ?? 'unknown error'}`
    );
  }

  async function sendNotification(method: string, params?: unknown): Promise<void> {
    if (!isHealthy()) {
      throw new Error(
        `Cannot send notification to LSP server '${serverName}': server is ${state}`
      );
    }
    await client.sendNotification(method, params);
  }

  function onNotification(method: string, handler: (params: unknown) => void): void {
    client.onNotification(method, handler);
  }

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

export { createLspServerInstance };
