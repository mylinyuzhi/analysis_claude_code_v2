/**
 * @claudecode/integrations - LSP Server Manager
 *
 * Manager for routing requests to appropriate LSP servers.
 * Reconstructed from chunks.114.mjs:2171-2330, 2640-2676
 */

import { extname, resolve } from 'path';
import type {
  LspServerManager,
  LspServerInstance,
  LspServerConfig,
  LspManagerState,
  LspDiagnosticFile,
} from './types.js';
import { LSP_CONSTANTS } from './types.js';
import { createLspServerInstance } from './instance.js';

// ============================================
// Diagnostics Registry
// ============================================

interface PendingDiagnostics {
  serverName: string;
  files: LspDiagnosticFile[];
  timestamp: number;
  attachmentSent: boolean;
}

const pendingDiagnosticsRegistry = new Map<string, PendingDiagnostics>();
const deliveredDiagnosticsCache = new Map<string, Set<string>>(); // uri -> set of hashed diagnostic fingerprints

// Max diagnostics per file and total
const MAX_DIAGNOSTICS_PER_FILE = 10;
const MAX_DIAGNOSTICS_TOTAL = 30;
const DELIVERED_CACHE_MAX_FILES = 500;

/**
 * Hash a diagnostic for deduplication.
 * Original: Oy2 in chunks.114.mjs:2377-2385
 */
function hashDiagnostic(diagnostic: any): string {
  return JSON.stringify({
    message: diagnostic.message,
    severity: diagnostic.severity,
    range: diagnostic.range,
    source: diagnostic.source || null,
    code: diagnostic.code || null,
  });
}

/**
 * Register diagnostics from a server.
 * Original: Ly2 in chunks.114.mjs:2349-2360
 */
export function registerDiagnostics(serverName: string, files: LspDiagnosticFile[]): void {
  const id = Math.random().toString(36).substring(7);
  console.log(`LSP Diagnostics: Registering ${files.length} diagnostic file(s) from ${serverName} (ID: ${id})`);
  pendingDiagnosticsRegistry.set(id, {
    serverName,
    files,
    timestamp: Date.now(),
    attachmentSent: false,
  });
}

/**
 * Map LSP severity to numeric value for sorting.
 * Original: wy2 in chunks.114.mjs:2362-2375
 */
function severityToNumber(severity: string | number): number {
  if (typeof severity === 'number') return severity;
  switch (severity) {
    case 'Error': return 1;
    case 'Warning': return 2;
    case 'Info': return 3;
    case 'Hint': return 4;
    default: return 4;
  }
}

/**
 * Map numeric severity to name.
 * Original: ug5 in chunks.114.mjs:2486-2499
 */
function numberToSeverity(severity: number): string {
  switch (severity) {
    case 1: return 'Error';
    case 2: return 'Warning';
    case 3: return 'Info';
    case 4: return 'Hint';
    default: return 'Error';
  }
}

/**
 * Deduplicate diagnostics.
 * Original: hg5 in chunks.114.mjs:2387-2409
 */
function deduplicateDiagnostics(files: LspDiagnosticFile[]): LspDiagnosticFile[] {
  const uriToFingerprints = new Map<string, Set<string>>();
  const result: LspDiagnosticFile[] = [];

  for (const file of files) {
    if (!uriToFingerprints.has(file.uri)) {
      uriToFingerprints.set(file.uri, new Set());
      result.push({
        uri: file.uri,
        diagnostics: [],
      });
    }

    const currentFileFingerprints = uriToFingerprints.get(file.uri)!;
    const fileResult = result.find((f) => f.uri === file.uri)!;
    const deliveredFingerprints = deliveredDiagnosticsCache.get(file.uri) || new Set<string>();

    for (const diagnostic of file.diagnostics) {
      try {
        const fingerprint = hashDiagnostic(diagnostic);
        if (currentFileFingerprints.has(fingerprint) || deliveredFingerprints.has(fingerprint)) {
          continue;
        }
        currentFileFingerprints.add(fingerprint);
        fileResult.diagnostics.push(diagnostic);
      } catch (error) {
        console.error(`Failed to deduplicate diagnostic in ${file.uri}: ${(error as Error).message}`);
        fileResult.diagnostics.push(diagnostic);
      }
    }
  }

  return result.filter((f) => f.diagnostics.length > 0);
}

/**
 * Deliver pending diagnostics.
 * Original: My2 in chunks.114.mjs:2411-2456
 */
export function deliverDiagnostics(): Array<{ serverName: string; files: LspDiagnosticFile[] }> {
  console.log(`LSP Diagnostics: Checking registry - ${pendingDiagnosticsRegistry.size} pending`);
  
  const allFiles: LspDiagnosticFile[] = [];
  const serverNames = new Set<string>();
  const pendingItems: PendingDiagnostics[] = [];

  for (const item of pendingDiagnosticsRegistry.values()) {
    if (!item.attachmentSent) {
      allFiles.push(...item.files);
      serverNames.add(item.serverName);
      pendingItems.push(item);
    }
  }

  if (allFiles.length === 0) return [];

  let processedFiles: LspDiagnosticFile[];
  try {
    processedFiles = deduplicateDiagnostics(allFiles);
  } catch (error) {
    console.error(`Failed to deduplicate LSP diagnostics: ${(error as Error).message}`);
    processedFiles = allFiles;
  }

  // Mark as sent
  for (const item of pendingItems) {
    item.attachmentSent = true;
  }

  const initialCount = allFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
  const deduplicatedCount = processedFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
  
  if (initialCount > deduplicatedCount) {
    console.log(`LSP Diagnostics: Deduplication removed ${initialCount - deduplicatedCount} duplicate diagnostic(s)`);
  }

  let totalDelivered = 0;
  let removedCount = 0;

  for (const file of processedFiles) {
    // Sort by severity (Error first)
    file.diagnostics.sort((a, b) => severityToNumber(a.severity) - severityToNumber(b.severity));

    // Limit per file
    if (file.diagnostics.length > MAX_DIAGNOSTICS_PER_FILE) {
      removedCount += file.diagnostics.length - MAX_DIAGNOSTICS_PER_FILE;
      file.diagnostics = file.diagnostics.slice(0, MAX_DIAGNOSTICS_PER_FILE);
    }

    // Limit total volume
    const remainingBudget = MAX_DIAGNOSTICS_TOTAL - totalDelivered;
    if (file.diagnostics.length > remainingBudget) {
      removedCount += file.diagnostics.length - remainingBudget;
      file.diagnostics = file.diagnostics.slice(0, remainingBudget);
    }

    totalDelivered += file.diagnostics.length;
  }

  processedFiles = processedFiles.filter((f) => f.diagnostics.length > 0);

  if (removedCount > 0) {
    console.log(`LSP Diagnostics: Volume limiting removed ${removedCount} diagnostic(s) (max ${MAX_DIAGNOSTICS_PER_FILE}/file, ${MAX_DIAGNOSTICS_TOTAL} total)`);
  }

  // Track delivered in cache
  for (const file of processedFiles) {
    if (!deliveredDiagnosticsCache.has(file.uri)) {
      if (deliveredDiagnosticsCache.size >= DELIVERED_CACHE_MAX_FILES) {
        // Simple eviction
        const firstKey = deliveredDiagnosticsCache.keys().next().value;
        if (firstKey) deliveredDiagnosticsCache.delete(firstKey);
      }
      deliveredDiagnosticsCache.set(file.uri, new Set());
    }
    const set = deliveredDiagnosticsCache.get(file.uri)!;
    for (const d of file.diagnostics) {
      try {
        set.add(hashDiagnostic(d));
      } catch (error) {
        console.error(`Failed to track delivered diagnostic in ${file.uri}: ${(error as Error).message}`);
      }
    }
  }

  if (totalDelivered === 0) {
    console.log('LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)');
    return [];
  }

  console.log(`LSP Diagnostics: Delivering ${processedFiles.length} file(s) with ${totalDelivered} diagnostic(s) from ${serverNames.size} server(s)`);
  
  return [{
    serverName: Array.from(serverNames).join(', '),
    files: processedFiles,
  }];
}

/**
 * Clear all pending diagnostics.
 * Original: Ry2 in chunks.114.mjs:2458-2460
 */
export function clearPendingDiagnostics(): void {
  console.log(`LSP Diagnostics: Clearing ${pendingDiagnosticsRegistry.size} pending diagnostic(s)`);
  pendingDiagnosticsRegistry.clear();
}

/**
 * Clear delivered diagnostics for a file.
 * Original: XW1 in chunks.114.mjs:2462-2464
 */
export function clearDeliveredDiagnostics(uri: string): void {
  if (deliveredDiagnosticsCache.has(uri)) {
    console.log(`LSP Diagnostics: Clearing delivered diagnostics for ${uri}`);
    deliveredDiagnosticsCache.delete(uri);
  }
}

/**
 * Format diagnostic from server for internal registry.
 * Original: mg5 in chunks.114.mjs:2501-2529
 */
function formatDiagnosticForRegistry(params: any): LspDiagnosticFile[] {
  let uri = params.uri;
  // Note: gg5 (uriToPath) logic simplified here, assuming URI is mostly fine or handled by consumer
  if (uri.startsWith('file://')) {
    try {
      uri = decodeURIComponent(uri.replace(/^file:\/\//, ''));
    } catch (e) {
      console.error(`Failed to convert URI to file path: ${uri}`);
    }
  }

  const diagnostics = params.diagnostics.map((d: any) => ({
    message: d.message,
    severity: numberToSeverity(d.severity),
    range: {
      start: { line: d.range.start.line, character: d.range.start.character },
      end: { line: d.range.end.line, character: d.range.end.character },
    },
    source: d.source,
    code: d.code !== undefined && d.code !== null ? String(d.code) : undefined,
  }));

  return [{ uri, diagnostics }];
}

/**
 * Register diagnostics handlers for all servers.
 * Original: _y2 in chunks.114.mjs:2531-2605
 */
function registerDiagnosticsHandlers(manager: LspServerManager): void {
  const servers = manager.getAllServers();
  const registrationErrors: Array<{ serverName: string; error: string }> = [];
  let successCount = 0;
  const failureTracker = new Map<string, { count: number; lastError: string }>();

  for (const [serverName, instance] of servers.entries()) {
    try {
      if (!instance || typeof instance.onNotification !== 'function') {
        const error = !instance ? 'Server instance is null/undefined' : 'Server instance has no onNotification method';
        registrationErrors.push({ serverName, error });
        console.error(`Skipping handler registration for ${serverName}: ${error}`);
        continue;
      }

      instance.onNotification('textDocument/publishDiagnostics', async (params: any) => {
        console.log(`[PASSIVE DIAGNOSTICS] Handler invoked for ${serverName}!`);
        try {
          if (!params || typeof params !== 'object' || !('uri' in params) || !('diagnostics' in params)) {
            console.error(`LSP server ${serverName} sent invalid diagnostic params`);
            return;
          }

          console.log(`Received diagnostics from ${serverName}: ${params.diagnostics.length} diagnostic(s) for ${params.uri}`);
          const formatted = formatDiagnosticForRegistry(params);
          const first = formatted[0];

          if (!first || formatted.length === 0 || first.diagnostics.length === 0) {
            console.log(`Skipping empty diagnostics from ${serverName} for ${params.uri}`);
            return;
          }

          try {
            registerDiagnostics(serverName, formatted);
            console.log(`LSP Diagnostics: Registered ${formatted.length} diagnostic file(s) from ${serverName} for async delivery`);
            failureTracker.delete(serverName);
          } catch (error) {
            console.error(`Error registering LSP diagnostics from ${serverName}: ${params.uri}, Error: ${(error as Error).message}`);
            const stats = failureTracker.get(serverName) || { count: 0, lastError: '' };
            stats.count++;
            stats.lastError = (error as Error).message;
            failureTracker.set(serverName, stats);
            if (stats.count >= 3) {
              console.log(`WARNING: LSP diagnostic handler for ${serverName} has failed ${stats.count} times consecutively.`);
            }
          }
        } catch (error) {
          console.error(`Unexpected error processing diagnostics from ${serverName}: ${(error as Error).message}`);
        }
      });

      console.log(`Registered diagnostics handler for ${serverName}`);
      successCount++;
    } catch (error) {
      registrationErrors.push({ serverName, error: (error as Error).message });
      console.error(`Failed to register diagnostics handler for ${serverName}: ${(error as Error).message}`);
    }
  }

  const totalServers = servers.size;
  if (registrationErrors.length > 0) {
    const errorDetails = registrationErrors.map((e) => `${e.serverName} (${e.error})`).join(', ');
    console.error(`Failed to register diagnostics for ${registrationErrors.length} LSP server(s): ${errorDetails}`);
  } else {
    console.log(`LSP notification handlers registered successfully for all ${totalServers} server(s)`);
  }
}

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
        `[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(serverConfigs).length} server(s)`
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
  console.log('[LSP MANAGER] Created manager instance, state=pending');

  const currentGeneration = ++generationCounter;
  console.log(`[LSP MANAGER] Starting async initialization (generation ${currentGeneration})`);
  
  initPromise = lspManager
    .initialize()
    .then(() => {
      if (currentGeneration === generationCounter) {
        lspState = 'success';
        console.log('LSP server manager initialized successfully');
        if (lspManager) {
          registerDiagnosticsHandlers(lspManager);
        }
      }
    })
    .catch((error) => {
      if (currentGeneration === generationCounter) {
        lspState = 'failed';
        lastError = error;
        lspManager = undefined;
        console.error(`Failed to initialize LSP server manager: ${error.message}`);
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
  if (lspState === 'failed') return undefined;
  return lspManager;
}

/**
 * Get the LSP manager status.
 * Original: f6A (getLspManagerStatus)
 */
export function getLspManagerStatus(): {
  status: LspManagerState;
  error?: Error;
} {
  return {
    status: lspState,
    error: lastError,
  };
}

/**
 * Wait for LSP manager initialization.
 * Original: Ty2 (waitForLspManagerInit)
 */
export async function waitForLspManagerInit(): Promise<void> {
  if (lspState === 'success' || lspState === 'failed') return;
  if (lspState === 'pending' && initPromise) {
    await initPromise;
  }
}


// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
