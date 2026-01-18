/**
 * @claudecode/integrations
 *
 * External integrations for Claude Code.
 */

// ============================================
// MCP Module
// ============================================

export * from './mcp/index.js';

// ============================================
// IDE Integration Module
// ============================================

export * as ide from './ide/index.js';

// Re-export commonly used IDE functions at top level
export {
  detectRunningIDEs,
  getAvailableIDEConnections,
  waitForIDEConnection,
  isInCodeTerminal,
  isVSCodeIDE,
  isJetBrainsIDE,
  getIdeDisplayName,
  IDE_CONFIG_MAP,
} from './ide/index.js';

// ============================================
// Chrome Integration Module
// ============================================

export * as chrome from './chrome/index.js';

// Re-export commonly used Chrome functions at top level
export {
  ChromeSocketClient,
  CHROME_TOOLS,
  getChromeMcpConfig,
  getChromeMcpSkill,
  CHROME_CONSTANTS,
} from './chrome/index.js';

// ============================================
// Background Agents Module
// ============================================

export * as backgroundAgents from './background-agents/index.js';

// Re-export commonly used Background Agent functions at top level
export {
  BackgroundTaskRegistry,
  generateTaskId,
  generateBashTaskId,
  generateAgentTaskId,
  getTaskRegistry,
  createBashTask,
  createAgentTask,
  readTaskOutput,
  writeTaskOutput,
  BACKGROUND_AGENT_CONSTANTS,
} from './background-agents/index.js';

// ============================================
// LSP Server Module
// ============================================

export * as lspServer from './lsp-server/index.js';

// Re-export commonly used LSP functions at top level
export {
  createLspClient,
  createLspServerInstance,
  createLspServerManager,
  initializeLspServerManager,
  shutdownLspServerManager,
  getLspManager,
  getLspManagerStatus,
  waitForLspManagerInit,
  LSP_CONSTANTS,
} from './lsp-server/index.js';

export type {
  LspManagerState,
  LspServerState,
  LspServerConfig,
  LspPluginConfig,
  LspServerInstance,
  LspServerManager,
  LspClient,
} from './lsp-server/index.js';
