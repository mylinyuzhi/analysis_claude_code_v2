/**
 * @claudecode/integrations - LSP Server Module
 *
 * Language Server Protocol integration for code intelligence.
 * Provides hover, definition, references, and document symbols.
 *
 * Architecture:
 * - client.ts: Low-level JSON-RPC communication over stdio
 * - instance.ts: Server instance wrapper with lifecycle management
 * - manager.ts: Singleton manager with extension-based routing
 * - operations.ts: High-level LSP operations and result formatters
 *
 * Reconstructed from chunks.114.mjs, chunks.119.mjs, chunks.120.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Operations
// ============================================

export {
  // Constants
  LSP_OPERATIONS,
  // Request building
  buildLspRequest,
  // Result formatting
  formatLspResult,
  formatGoToDefinitionResult,
  formatFindReferencesResult,
  formatHoverResult,
  formatDocumentSymbolResult,
  formatWorkspaceSymbolResult,
  formatPrepareCallHierarchyResult,
  formatIncomingCallsResult,
  formatOutgoingCallsResult,
  // Utilities
  symbolKindToName,
  pathToFileUri,
  uriToRelativePath,
  isLocationLink,
  locationLinkToLocation,
  formatLocation,
  groupLocationsByFile,
  extractHoverContent,
  extractSymbolAtPosition,
} from './operations.js';

// ============================================
// Client
// ============================================

export { createLspClient } from './client.js';

// ============================================
// Instance
// ============================================

export { createLspServerInstance } from './instance.js';

// ============================================
// Manager
// ============================================

export {
  createLspServerManager,
  initializeLspServerManager,
  shutdownLspServerManager,
  getLspManager,
  getLspManagerStatus,
  waitForLspManagerInit,
} from './manager.js';
