/**
 * @claudecode/integrations - IDE Integration Module
 *
 * Provides IDE detection, connection management, and integration features.
 *
 * Key features:
 * - Process-based IDE detection (18+ supported IDEs)
 * - Lock file discovery and parsing
 * - Workspace validation and connection matching
 * - WSL support with path translation
 *
 * Reconstructed from chunks.131.mjs, chunks.149.mjs, chunks.153.mjs
 */

// ============================================
// Types
// ============================================

export type {
  IdeKind,
  IdeConfig,
  IdeName,
  IdeLockInfo,
  IdeConnection,
  IdeInstallationState,
  IdeDiffRequest,
  IdeDiffResponse,
  IdeMcpConfig,
} from './types.js';

export { IDE_CONSTANTS } from './types.js';

// ============================================
// Configuration
// ============================================

export {
  IDE_CONFIG_MAP,
  isVSCodeIDE,
  isJetBrainsIDE,
  getIdeKind,
  getIdeDisplayName,
  getIdeExtensionId,
  getSupportedIdeNames,
  getIdesByKind,
} from './config.js';

// ============================================
// Detection
// ============================================

export {
  getOS,
  detectRunningIDEs,
  isProcessAlive,
  getParentPid,
  isIDEProcessRunning,
  isInCodeTerminal,
} from './detection.js';

// ============================================
// Connection
// ============================================

export {
  getIDEDirectories,
  getIDELockFiles,
  parseLockFile,
  isPortReachable,
  cleanupStaleLockFiles,
  getIDEHost,
  getAvailableIDEConnections,
  waitForIDEConnection,
  cancelWaitForIDEConnection,
  createIdeMcpConfig,
} from './connection.js';
