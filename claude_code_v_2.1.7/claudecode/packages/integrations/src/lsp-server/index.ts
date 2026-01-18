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
 *
 * Reconstructed from chunks.114.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

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
