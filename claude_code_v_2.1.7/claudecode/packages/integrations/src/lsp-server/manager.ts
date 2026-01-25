/**
 * @claudecode/integrations - LSP Server Manager
 *
 * Manages multiple LSP server instances, routing requests based on file extensions,
 * and handling file synchronization (open, change, save, close).
 * Reconstructed from chunks.114.mjs
 */

import * as path from 'path';
import {
  type LspServerManager,
  type LspServerInstance,
  type LspServerConfig,
  LSP_CONSTANTS
} from './types';
import { createLspServerInstance } from './instance';

// We assume this will be implemented in the plugin package and exported.
// In the original bundle, this was $y2 in chunks.114.mjs.
// Since we can't import from @claudecode/plugin yet (circular dep potential or not built),
// we might need to inject this dependency or allow it to be set.
// For now, we'll try to import it, assuming the build system handles it.
// If not, we might need to restructure.
import { getAllLspServers } from '@claudecode/plugin'; 

/**
 * Creates the LSP server manager.
 * Original: Uy2 in chunks.114.mjs:2171-2340
 */
export function createLspServerManager(): LspServerManager {
  // Map<serverName, LspServerInstance>
  // Original: A
  const servers = new Map<string, LspServerInstance>();

  // Map<extension, serverNames[]>
  // Original: Q
  const extToServers = new Map<string, string[]>();

  // Map<fileUri, serverName>
  // Original: B
  const openFiles = new Map<string, string>();

  let status: 'not-started' | 'pending' | 'success' | 'failed' = 'not-started';
  let initPromise: Promise<void> | null = null;

  function log(message: string) {
    // console.log(`[LSP Manager] ${message}`);
  }

  function error(err: Error) {
    console.error(`[LSP Manager] Error:`, err);
  }

  /**
   * Initializes the manager by loading servers from plugins.
   * Original: G (initialize) in chunks.114.mjs:2175
   */
  async function initialize(): Promise<void> {
    if (initPromise) return initPromise;
    status = 'pending';

    initPromise = (async () => {
      let loadedServers: Record<string, LspServerConfig>;
      
      try {
        // Original: H = (await $y2()).servers
        const result = await getAllLspServers();
        loadedServers = result.servers;
        log(`getAllLspServers returned ${Object.keys(loadedServers).length} server(s)`);
      } catch (err: any) {
        status = 'failed';
        const msg = new Error(`Failed to load LSP server configuration: ${err.message}`);
        error(msg);
        throw msg; // Original rethrows
      }

      for (const [name, config] of Object.entries(loadedServers)) {
        try {
          if (!config.command) {
            throw new Error(`Server ${name} missing required 'command' field`);
          }
          if (!config.extensionToLanguage || Object.keys(config.extensionToLanguage).length === 0) {
            throw new Error(`Server ${name} missing required 'extensionToLanguage' field`);
          }

          // Map extensions to server
          const extensions = Object.keys(config.extensionToLanguage);
          for (const ext of extensions) {
            const lowerExt = ext.toLowerCase();
            if (!extToServers.has(lowerExt)) {
              extToServers.set(lowerExt, []);
            }
            extToServers.get(lowerExt)!.push(name);
          }

          // Create instance
          // Original: O = Vy2(E, z)
          const instance = createLspServerInstance(name, config);
          servers.set(name, instance);

          // Handle workspace/configuration request (mock implementation)
          // Original: chunks.114.mjs:2193
          instance.onRequest(LSP_CONSTANTS.METHODS.WORKSPACE_CONFIGURATION, (params: any) => {
            log(`LSP: Received workspace/configuration request from ${name}`);
            return params.items.map(() => null);
          });

          // Start server
          // Original: chunks.114.mjs:2195
          instance.start().catch(err => {
            error(new Error(`Failed to start LSP server ${name}: ${err.message}`));
          });

        } catch (err: any) {
          error(new Error(`Failed to initialize LSP server ${name}: ${err.message}`));
        }
      }

      log(`LSP manager initialized with ${servers.size} servers`);
      status = 'success';
    })();

    return initPromise;
  }

  /**
   * Shuts down all servers.
   * Original: Z (shutdown) in chunks.114.mjs:2203
   */
  async function shutdown(): Promise<void> {
    const errors: Error[] = [];

    for (const [name, instance] of servers.entries()) {
      if (instance.state === 'running') {
        try {
          await instance.stop();
        } catch (err: any) {
          error(new Error(`Failed to stop LSP server ${name}: ${err.message}`));
          errors.push(err);
        }
      }
    }

    servers.clear();
    extToServers.clear();
    openFiles.clear();

    if (errors.length > 0) {
      const msg = new Error(`Failed to stop ${errors.length} LSP server(s): ${errors.map(e => e.message).join('; ')}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Gets the server instance for a specific file.
   * Original: Y (getServerForFile) in chunks.114.mjs:2218
   */
  function getServerForFile(filePath: string): LspServerInstance | undefined {
    const ext = path.extname(filePath).toLowerCase();
    const serverNames = extToServers.get(ext);

    if (!serverNames || serverNames.length === 0) return undefined;
    
    // Original takes the first server (z[0])
    const serverName = serverNames[0];
    if (!serverName) return undefined;

    return servers.get(serverName);
  }

  /**
   * Ensures the server for a file is started.
   * Original: J (ensureServerStarted) in chunks.114.mjs:2226
   */
  async function ensureServerStarted(filePath: string): Promise<LspServerInstance | undefined> {
    const server = getServerForFile(filePath);
    if (!server) return undefined;

    if (server.state === 'stopped') {
      try {
        await server.start();
      } catch (err: any) {
        const msg = new Error(`Failed to start LSP server for file ${filePath}: ${err.message}`);
        error(msg);
        throw msg;
      }
    }
    return server;
  }

  /**
   * Sends a request to the appropriate server for a file.
   * Original: X (sendRequest) in chunks.114.mjs:2236
   */
  async function sendRequest<T>(filePath: string, method: string, params?: unknown): Promise<T | undefined> {
    const server = await ensureServerStarted(filePath);
    if (!server) return undefined;

    try {
      return await server.sendRequest<T>(method, params);
    } catch (err: any) {
      const msg = new Error(`LSP request failed for file ${filePath}, method '${method}': ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Returns all servers.
   * Original: I (getAllServers) in chunks.114.mjs:2246
   */
  function getAllServers(): Map<string, LspServerInstance> {
    return servers;
  }

  /**
   * Opens a file in the LSP server.
   * Original: D (openFile) in chunks.114.mjs:2249
   */
  async function openFile(filePath: string, content: string): Promise<void> {
    const server = await ensureServerStarted(filePath);
    if (!server) return;

    const uri = `file://${path.resolve(filePath)}`;
    
    if (openFiles.get(uri) === server.name) {
      log(`LSP: File already open, skipping didOpen for ${filePath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const languageId = server.config.extensionToLanguage[ext] || 'plaintext';

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_OPEN, {
        textDocument: {
          uri,
          languageId,
          version: 1,
          text: content
        }
      });
      openFiles.set(uri, server.name);
      log(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);
    } catch (err: any) {
      const msg = new Error(`Failed to sync file open ${filePath}: ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Notifies the server of a file change.
   * Original: W (changeFile) in chunks.114.mjs:2273
   */
  async function changeFile(filePath: string, content: string): Promise<void> {
    const server = getServerForFile(filePath);
    if (!server || server.state !== 'running') {
      // If not running, treat as open
      return openFile(filePath, content);
    }

    const uri = `file://${path.resolve(filePath)}`;
    if (openFiles.get(uri) !== server.name) {
      return openFile(filePath, content);
    }

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_CHANGE, {
        textDocument: {
          uri,
          version: 1 // We might need to increment this in a real implementation, but source uses 1
        },
        contentChanges: [{
          text: content
        }]
      });
      log(`LSP: Sent didChange for ${filePath}`);
    } catch (err: any) {
      const msg = new Error(`Failed to sync file change ${filePath}: ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Notifies the server of a file save.
   * Original: K (saveFile) in chunks.114.mjs:2293
   */
  async function saveFile(filePath: string): Promise<void> {
    const server = getServerForFile(filePath);
    if (!server || server.state !== 'running') return;

    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_SAVE, {
        textDocument: {
          uri: `file://${path.resolve(filePath)}`
        }
      });
      log(`LSP: Sent didSave for ${filePath}`);
    } catch (err: any) {
      const msg = new Error(`Failed to sync file save ${filePath}: ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Notifies the server of a file close.
   * Original: V (closeFile) in chunks.114.mjs:2307
   */
  async function closeFile(filePath: string): Promise<void> {
    const server = getServerForFile(filePath);
    if (!server || server.state !== 'running') return;

    const uri = `file://${path.resolve(filePath)}`;
    
    try {
      await server.sendNotification(LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DID_CLOSE, {
        textDocument: {
          uri
        }
      });
      openFiles.delete(uri);
      log(`LSP: Sent didClose for ${filePath}`);
    } catch (err: any) {
      const msg = new Error(`Failed to sync file close ${filePath}: ${err.message}`);
      error(msg);
      throw msg;
    }
  }

  /**
   * Checks if a file is open.
   * Original: F (isFileOpen) in chunks.114.mjs:2323
   */
  function isFileOpen(filePath: string): boolean {
    const uri = `file://${path.resolve(filePath)}`;
    return openFiles.has(uri);
  }

  function getStatus() {
    return { status };
  }

  async function waitForInit() {
    if (initPromise) await initPromise;
  }

  return {
    initialize,
    shutdown,
    getServerForFile,
    ensureServerStarted,
    sendRequest,
    getAllServers,
    openFile,
    changeFile,
    saveFile,
    closeFile,
    isFileOpen,
    getStatus,
    waitForInit
  };
}

// Global singleton instance
export const lspServerManager = createLspServerManager();
