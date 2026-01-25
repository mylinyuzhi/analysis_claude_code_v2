/**
 * @claudecode/integrations - MCP Module
 *
 * Model Context Protocol (MCP) integration for Claude Code.
 * Supports multiple transport protocols, auto-search mode, and dynamic tool discovery.
 *
 * Key features:
 * - Multi-scope configuration (enterprise, user, project, local, plugin)
 * - Transport types: stdio, sse, http, ws, sdk
 * - Auto-search mode for context optimization (10% threshold)
 * - Dynamic tool/prompt/resource discovery
 * - list_changed notification handling
 *
 * Reconstructed from chunks.131.mjs, chunks.85.mjs, chunks.138.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Configuration
// ============================================

export {
  loadAllMcpConfig,
  parseServerConfig,
  isServerDisabled,
  getDisabledServers,
  setServerDisabled,
  substituteEnvVariables,
  findMcpServer,
} from './config.js';

// ============================================
// Connection
// ============================================

export {
  connectMcpServer,
  batchInitializeAllServers,
  reconnectMcpServer,
  ensureServerConnected,
  createTimeoutPromise,
  checkServerHealth,
  logMcpDebug,
  logMcpError,
} from './connection.js';

// ============================================
// Discovery
// ============================================

export {
  fetchMcpTools,
  fetchMcpPrompts,
  fetchMcpResources,
  normalizeToolName,
  clearDiscoveryCache,
  refreshToolsOnListChanged,
  setupListChangedHandlers,
  listResourcesTool,
  readResourceTool,
} from './discovery.js';

// ============================================
// Execution
// ============================================

export {
  executeMcpTool,
  getMCPToolTimeout,
  convertMcpContent,
} from './execution.js';

// ============================================
// SDK Server
// ============================================

export * from './sdk-server.js';

export {
  shouldEnableAutoSearch,
  calculateContextThreshold,
  calculateMcpDescriptionSize,
  isModelSupportedForToolSearch,
  isMcpSearchToolAvailable,
  getToolSearchMode,
  findDiscoveredToolsInHistory,
  createMcpSearchTool,
  MCP_SEARCH_TOOL_NAME,
  isAutoSearchEnabled,
} from './autosearch.js';
