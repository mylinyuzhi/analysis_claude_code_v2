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
  CHROME_MCP_TOOLS,
  CHROME_SKILL_CONFIG,
  CHROME_SKILL_PROMPT,
  CHROME_CONSTANTS,
} from './chrome/index.js';

// ============================================
// Background Agents Module
// ============================================

export * as backgroundAgents from './background-agents/index.js';

// Re-export commonly used Background Agent functions at top level
export {
  // Registry
  BackgroundTaskRegistry,
  generateTaskId,
  generateBashTaskId,
  generateAgentTaskId,
  getTaskRegistry,

  // Task factories
  createBashTask,
  createAgentTask,
  createRemoteAgentTask,

  // Output management
  readTaskOutput,
  writeTaskOutput,
  formatOutputPath,
  appendToOutputFile,
  getTaskOutputContent,
  registerOutputFile,

  // Signal handling (Ctrl+B)
  triggerBackgroundTransition,
  triggerBashBackgroundTransition,
  registerBackgroundableTask,
  isLocalAgentTask,
  isLocalBashTask,

  // Task handlers
  LocalBashTaskHandler,
  LocalAgentTaskHandler,
  RemoteAgentTaskHandler,
  getTaskHandlers,

  // TaskOutput utilities
  TASKOUTPUT_TOOL_NAME,
  KILLSHELL_TOOL_NAME,
  formatTaskOutput,
  truncateTaskOutput,
  waitForTaskCompletion,

  // Lifecycle
  killBackgroundTask,
  updateTaskProgress,
  markTaskCompleted,
  markTaskFailed,
  createTaskNotification,

  // Constants
  BACKGROUND_AGENT_CONSTANTS,
} from './background-agents/index.js';

// ============================================
// LSP Server Module
// ============================================

export * as lspServer from './lsp-server/index.js';

// Re-export commonly used LSP functions at top level
export {
  // Manager
  createLspClient,
  createLspServerInstance,
  createLspServerManager,
  initializeLspServerManager,
  shutdownLspServerManager,
  getLspManager,
  getLspManagerStatus,
  waitForLspManagerInit,
  LSP_CONSTANTS,

  // Operations
  LSP_OPERATIONS,
  buildLspRequest,
  formatLspResult,
  symbolKindToName,
  pathToFileUri,
  uriToRelativePath,
  formatLocation,
  extractSymbolAtPosition,
} from './lsp-server/index.js';

export type {
  // Manager types
  LspManagerState,
  LspServerState,
  LspServerConfig,
  LspPluginConfig,
  LspServerInstance,
  LspServerManager,
  LspClient,
  // Operation types
  LspOperation,
  LspOperationInput,
  LspOperationResult,
  LspRequest,
  LspPosition,
  LspRange,
  LspLocation,
  LspLocationLink,
  LspHoverResult,
  LspDocumentSymbol,
  LspSymbolInformation,
  LspCallHierarchyItem,
  LspIncomingCall,
  LspOutgoingCall,
} from './lsp-server/index.js';
