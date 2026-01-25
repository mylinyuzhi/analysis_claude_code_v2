/**
 * @claudecode/integrations - LSP Server Instance
 *
 * Manages the lifecycle and communication of a single LSP server instance.
 * Handles automatic retries for ContentModified errors.
 * Reconstructed from chunks.114.mjs
 */

import * as path from 'path';
import {
  type LspServerInstance,
  type LspServerConfig,
  type LspServerState,
  LSP_CONSTANTS,
  type LspInitializeParams
} from './types';
import { createLspClient } from './client';

/**
 * Creates a new LSP server instance.
 * Original: Vy2 in chunks.114.mjs:1784-1956
 */
export function createLspServerInstance(
  name: string,
  config: LspServerConfig
): LspServerInstance {
  // Validate configuration
  // Original: chunks.114.mjs:1785-1787
  if (config.restartOnCrash !== undefined) {
    throw new Error(`LSP server '${name}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
  }
  if (config.startupTimeout !== undefined) {
    throw new Error(`LSP server '${name}': startupTimeout is not yet implemented. Remove this field from the configuration.`);
  }
  if (config.shutdownTimeout !== undefined) {
    throw new Error(`LSP server '${name}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
  }

  const client = createLspClient(name);
  
  let state: LspServerState = 'stopped';
  let startTime: Date | undefined;
  let lastError: Error | undefined;
  let restartCount = 0;

  function log(message: string) {
    // console.log(`[LSP Instance - ${name}] ${message}`);
  }

  function error(err: Error) {
    console.error(`[LSP Instance - ${name}] Error:`, err);
  }

  /**
   * Starts the server instance.
   * Original: X (start) in chunks.114.mjs:1791
   */
  async function start(): Promise<void> {
    if (state === 'running' || state === 'starting') return;

    try {
      state = 'starting';
      log(`Starting LSP server instance: ${name}`);

      await client.start(config.command, config.args || [], {
        env: config.env,
        cwd: config.workspaceFolder
      });

      const rootPath = config.workspaceFolder || process.cwd();
      const rootUri = `file://${rootPath}`;

      // Build initialization params
      // Original: chunks.114.mjs:1800-1853
      const initParams: LspInitializeParams = {
        processId: process.pid,
        initializationOptions: config.initializationOptions ?? {},
        workspaceFolders: [{
          uri: rootUri,
          name: path.basename(rootPath)
        }],
        rootPath: rootPath,
        rootUri: rootUri,
        capabilities: {
          workspace: {
            configuration: false,
            workspaceFolders: false
          },
          textDocument: {
            synchronization: {
              dynamicRegistration: false,
              willSave: false,
              willSaveWaitUntil: false,
              didSave: true
            },
            publishDiagnostics: {
              relatedInformation: true,
              tagSupport: {
                valueSet: [1, 2]
              },
              versionSupport: false,
              codeDescriptionSupport: true,
              dataSupport: false
            },
            hover: {
              dynamicRegistration: false,
              contentFormat: ["markdown", "plaintext"]
            },
            definition: {
              dynamicRegistration: false,
              linkSupport: true
            },
            references: {
              dynamicRegistration: false
            },
            documentSymbol: {
              dynamicRegistration: false,
              hierarchicalDocumentSymbolSupport: true
            },
            callHierarchy: {
              dynamicRegistration: false
            }
          },
          general: {
            positionEncodings: ["utf-16"]
          }
        }
      };

      await client.initialize(initParams);
      
      state = 'running';
      startTime = new Date();
      log(`LSP server instance started: ${name}`);

    } catch (err: any) {
      state = 'error';
      lastError = err;
      error(err);
      throw err;
    }
  }

  /**
   * Stops the server instance.
   * Original: I (stop) in chunks.114.mjs:1859
   */
  async function stop(): Promise<void> {
    if (state === 'stopped' || state === 'stopping') return;

    try {
      state = 'stopping';
      await client.stop();
      state = 'stopped';
      log(`LSP server instance stopped: ${name}`);
    } catch (err: any) {
      state = 'error';
      lastError = err;
      error(err);
      throw err;
    }
  }

  /**
   * Restarts the server instance.
   * Original: D (restart) in chunks.114.mjs:1867
   */
  async function restart(): Promise<void> {
    try {
      await stop();
    } catch (err: any) {
      const msg = new Error(`Failed to stop LSP server '${name}' during restart: ${err.message}`);
      error(msg);
      throw msg;
    }

    restartCount++;
    const maxRestarts = config.maxRestarts ?? LSP_CONSTANTS.DEFAULT_MAX_RESTARTS;

    if (restartCount > maxRestarts) {
      const msg = new Error(`Max restart attempts (${maxRestarts}) exceeded for server '${name}'`);
      error(msg);
      throw msg;
    }

    try {
      await start();
    } catch (err: any) {
      const msg = new Error(`Failed to start LSP server '${name}' during restart (attempt ${restartCount}/${maxRestarts}): ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Checks if the server is healthy.
   * Original: W in chunks.114.mjs:1888
   */
  function isHealthy(): boolean {
    return state === 'running' && client.isInitialized;
  }

  /**
   * Sends a request with retry logic for ContentModified errors.
   * Original: K (sendRequest) in chunks.114.mjs:1891
   */
  async function sendRequest<T>(method: string, params?: unknown): Promise<T> {
    if (!isHealthy()) {
      const msg = new Error(`Cannot send request to LSP server '${name}': server is ${state}${lastError ? `, last error: ${lastError.message}` : ''}`);
      error(msg);
      throw msg;
    }

    let lastReqError: any;
    
    // Retry loop
    for (let attempt = 0; attempt <= LSP_CONSTANTS.MAX_RETRIES; attempt++) {
      try {
        return await client.sendRequest<T>(method, params);
      } catch (err: any) {
        lastReqError = err;
        const code = err.code;

        // Check for ContentModified error (-32801)
        if (typeof code === 'number' && 
            code === LSP_CONSTANTS.CONTENT_MODIFIED_ERROR_CODE && 
            attempt < LSP_CONSTANTS.MAX_RETRIES) {
          
          const delay = LSP_CONSTANTS.BASE_RETRY_DELAY * Math.pow(2, attempt);
          log(`LSP request '${method}' to '${name}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt + 1}/${LSP_CONSTANTS.MAX_RETRIES})…`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    const msg = new Error(`LSP request '${method}' failed for server '${name}': ${lastReqError?.message ?? 'unknown error'}`);
    error(msg);
    throw msg;
  }

  /**
   * Sends a notification.
   * Original: V (sendNotification) in chunks.114.mjs:1912
   */
  async function sendNotification(method: string, params?: unknown): Promise<void> {
    if (!isHealthy()) {
      const msg = new Error(`Cannot send notification to LSP server '${name}': server is ${state}`);
      error(msg);
      throw msg;
    }

    try {
      await client.sendNotification(method, params);
    } catch (err: any) {
      const msg = new Error(`LSP notification '${method}' failed for server '${name}': ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  return {
    name,
    config,
    get state() { return state; },
    get startTime() { return startTime; },
    get lastError() { return lastError; },
    get restartCount() { return restartCount; },
    
    start,
    stop,
    restart,
    isHealthy,
    sendRequest,
    sendNotification,
    
    // Original: F (onNotification)
    onNotification: (method, handler) => client.onNotification(method, handler),
    
    // Original: H (onRequest)
    onRequest: (method, handler) => client.onRequest(method, handler)
  };
}
