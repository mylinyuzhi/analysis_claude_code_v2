/**
 * @claudecode/integrations - LSP Server Manager
 *
 * Manager for routing requests to appropriate LSP servers.
 * Reconstructed from chunks.114.mjs:2171-2330, 2640-2676
 */

import { extname, resolve, basename } from 'path';
import type {
  LspServerManager,
  LspServerInstance,
  LspServerConfig,
  LspManagerState,
} from './types.js';
import { LSP_CONSTANTS } from './types.js';
import { createLspServerInstance } from './instance.js';

// ============================================
// Manager Factory
// ============================================

/**
 * Create an LSP server manager.
 * Original: Uy2 (createLspServerManager) in chunks.114.mjs:2171-2330
 *
 * @param getCwd - Function to get current working directory
 * @param loadServerConfigs - Function to load server configurations
 * @returns LSP server manager
 */
export function createLspServerManager(
  getCwd: () => string,
  loadServerConfigs: () => Promise<Record<string, LspServerConfig>>
): LspServerManager {
  const servers = new Map<string, LspServerInstance>();
  const extensionToServers = new Map<string, string[]>();
  const openFiles = new Map<string, string>(); // fileUri -> serverName

  async function initialize(): Promise<void> {
    let serverConfigs: Record<string, LspServerConfig>;
    try {
      serverConfigs = await loadServerConfigs();
      console.log(
        `[LSP SERVER MANAGER] Loaded ${Object.keys(serverConfigs).length} server(s)`
      );
    } catch (error) {
      throw new Error(
        `Failed to load LSP server configuration: ${(error as Error).message}`
      );
    }

    for (const [serverName, config] of Object.entries(serverConfigs)) {
      try {
        // Validate required fields
        if (!config.command) {
          throw new Error(`Server ${serverName} missing required 'command' field`);
        }
        if (
          !config.extensionToLanguage ||
          Object.keys(config.extensionToLanguage).length === 0
        ) {
          throw new Error(
            `Server ${serverName} missing required 'extensionToLanguage' field`
          );
        }

        // Build extension -> server mapping
        const extensions = Object.keys(config.extensionToLanguage);
        for (const ext of extensions) {
          const lowerExt = ext.toLowerCase();
          if (!extensionToServers.has(lowerExt)) {
            extensionToServers.set(lowerExt, []);
          }
          extensionToServers.get(lowerExt)!.push(serverName);
        }

        // Create server instance
        const serverInstance = createLspServerInstance(serverName, config, getCwd);
        servers.set(serverName, serverInstance);

        // Handle workspace/configuration requests (return null for all items)
        serverInstance.onRequest(
          LSP_CONSTANTS.METHODS.WORKSPACE_CONFIGURATION,
          (params: any) => {
            console.log(
              `LSP: Received workspace/configuration request from ${serverName}`
            );
            return params.items.map(() => null);
          }
        );

        // Start server asynchronously
        serverInstance.start().catch((error) => {
          console.error(
            `Failed to start LSP server ${serverName}: ${(error as Error).message}`
          );
        });
      } catch (error) {
        console.error(
          `Failed to initialize LSP server ${serverName}: ${(error as Error).message}`
        );
      }
    }

    console.log(`LSP manager initialized with ${servers.size} servers`);
  }

  async function shutdown(): Promise<void> {
    const errors: Error[] = [];

    // Stop all running servers
    for (const [serverName, server] of servers.entries()) {
      if (server.state === 'running') {
        try {
          await server.stop();
        } catch (error) {
          console.error(
            `Failed to stop LSP server ${serverName}: ${(error as Error).message}`
          );
          errors.push(error as Error);
        }
      }
    }

    // Clear all state maps
    servers.clear();
    extensionToServers.clear();
    openFiles.clear();

    // Throw aggregated error if any servers failed to stop
    if (errors.length > 0) {
      throw new Error(
        `Failed to stop ${errors.length} LSP server(s): ${errors.map((e) => e.message).join('; ')}`
      );
    }
  }

  function getServerForFile(filePath: string): LspServerInstance | undefined {
    const extension = extname(filePath).toLowerCase();
    const serverNames = extensionToServers.get(extension);
    if (!serverNames || serverNames.length === 0) {
      return undefined;
    }
    const serverName = serverNames[0]; // Use first matching server
    if (!serverName) return undefined;
    return servers.get(serverName);
  }

  async function ensureServerStarted(
    filePath: string
  ): Promise<LspServerInstance | undefined> {
    const server = getServerForFile(filePath);
    if (!server) {
      return undefined;
    }

    if (server.state === 'stopped') {
      try {
        await server.start();
      } catch (error) {
        throw new Error(
          `Failed to start LSP server for file ${filePath}: ${(error as Error).message}`
        );
      }
    }
    return server;
  }

  async function sendRequest<T>(
    filePath: string,
    method: string,
    params?: unknown
  ): Promise<T | undefined> {
    const server = await ensureServerStarted(filePath);
    if (!server) {
      return undefined;
    }

    try {
      return await server.sendRequest<T>(method, params);
    } catch (error) {
      throw new Error(
        `LSP request failed for file ${filePath}, method '${method}': ${(error as Error).message}`
      );
    }
  }

  async function openFile(filePath: string, content: string): Promise<void> {
    const server = await ensureServerStarted(filePath);
    if (!server) {
      return;
    }

    const fileUri = `file://${resolve(filePath)}`;

    // Skip if already open with same server
    if (openFiles.get(fileUri) === server.name) {
      console.log(`LSP: File already open, skipping didOpen for ${filePath}`);
      return;
    }

    const extension = extname(filePath).toLowerCase();
    const languageId = server.config.extensionToLanguage[extension] || 'plaintext';

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_OPEN, {
        textDocument: {
          uri: fileUri,
          languageId,
          version: 1,
          text: content,
        },
      });
      openFiles.set(fileUri, server.name);
      console.log(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);
    } catch (error) {
      throw new Error(
        `Failed to sync file open ${filePath}: ${(error as Error).message}`
      );
    }
  }

  async function changeFile(filePath: string, content: string): Promise<void> {
    const server = getServerForFile(filePath);

    // If server not running or file not tracked, fall back to openFile
    if (!server || server.state !== 'running') {
      return openFile(filePath, content);
    }

    const fileUri = `file://${resolve(filePath)}`;
    if (openFiles.get(fileUri) !== server.name) {
      return openFile(filePath, content);
    }

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_CHANGE, {
        textDocument: { uri: fileUri, version: 1 },
        contentChanges: [{ text: content }], // Full document sync
      });
      console.log(`LSP: Sent didChange for ${filePath}`);
    } catch (error) {
      throw new Error(
        `Failed to sync file change ${filePath}: ${(error as Error).message}`
      );
    }
  }

  async function saveFile(filePath: string): Promise<void> {
    const server = getServerForFile(filePath);
    if (!server || server.state !== 'running') {
      return;
    }

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_SAVE, {
        textDocument: { uri: `file://${resolve(filePath)}` },
      });
      console.log(`LSP: Sent didSave for ${filePath}`);
    } catch (error) {
      throw new Error(
        `Failed to sync file save ${filePath}: ${(error as Error).message}`
      );
    }
  }

  async function closeFile(filePath: string): Promise<void> {
    const server = getServerForFile(filePath);
    if (!server || server.state !== 'running') {
      return;
    }

    const fileUri = `file://${resolve(filePath)}`;

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_CLOSE, {
        textDocument: { uri: fileUri },
      });
      openFiles.delete(fileUri);
      console.log(`LSP: Sent didClose for ${filePath}`);
    } catch (error) {
      throw new Error(
        `Failed to sync file close ${filePath}: ${(error as Error).message}`
      );
    }
  }

  function isFileOpen(filePath: string): boolean {
    return openFiles.has(`file://${resolve(filePath)}`);
  }

  function getAllServers(): Map<string, LspServerInstance> {
    return servers;
  }

  return {
    initialize,
    shutdown,
    getServerForFile,
    ensureServerStarted,
    getAllServers,
    sendRequest,
    openFile,
    changeFile,
    saveFile,
    closeFile,
    isFileOpen,
  };
}

// ============================================
// Singleton Manager
// ============================================

let lspManager: LspServerManager | undefined;
let lspState: LspManagerState = 'not-started';
let lastError: Error | undefined;
let generationCounter = 0;
let initPromise: Promise<void> | undefined;

/**
 * Initialize the LSP server manager singleton.
 * Original: Py2 (initializeLspServerManager) in chunks.114.mjs:2640-2654
 */
export function initializeLspServerManager(
  getCwd: () => string,
  loadServerConfigs: () => Promise<Record<string, LspServerConfig>>
): void {
  console.log('[LSP MANAGER] initializeLspServerManager() called');

  // Singleton check: skip if already initialized or initializing
  if (lspManager !== undefined && lspState !== 'failed') {
    console.log('[LSP MANAGER] Already initialized or initializing, skipping');
    return;
  }

  // Reset on failure to allow retry
  if (lspState === 'failed') {
    lspManager = undefined;
    lastError = undefined;
  }

  lspManager = createLspServerManager(getCwd, loadServerConfigs);
  lspState = 'pending';

  const currentGeneration = generationCounter;
  initPromise = lspManager
    .initialize()
    .then(() => {
      if (currentGeneration === generationCounter) {
        lspState = 'success';
      }
    })
    .catch((error) => {
      if (currentGeneration === generationCounter) {
        lspState = 'failed';
        lastError = error;
        console.error(`LSP manager initialization failed: ${error.message}`);
      }
    });
}

/**
 * Shutdown the LSP server manager singleton.
 * Original: Sy2 (shutdownLspServerManager) in chunks.114.mjs:2657-2665
 */
export async function shutdownLspServerManager(): Promise<void> {
  if (lspManager === undefined) {
    return;
  }

  try {
    await lspManager.shutdown();
    console.log('LSP server manager shut down successfully');
  } catch (error) {
    console.error(
      `Failed to shutdown LSP server manager: ${(error as Error).message}`
    );
  } finally {
    // Reset all global state
    lspManager = undefined;
    lspState = 'not-started';
    lastError = undefined;
    initPromise = undefined;
    generationCounter++; // Invalidate any pending async operations
  }
}

/**
 * Get the LSP manager instance.
 * Original: Rc (getLspManager)
 */
export function getLspManager(): LspServerManager | undefined {
  return lspManager;
}

/**
 * Get the LSP manager status.
 * Original: f6A (getLspManagerStatus)
 */
export function getLspManagerStatus(): {
  state: LspManagerState;
  error?: Error;
} {
  return {
    state: lspState,
    error: lastError,
  };
}

/**
 * Wait for LSP manager initialization.
 * Original: Ty2 (waitForLspManagerInit)
 */
export async function waitForLspManagerInit(): Promise<void> {
  if (initPromise) {
    await initPromise;
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
