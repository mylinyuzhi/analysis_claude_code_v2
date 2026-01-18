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
  convertMcpContent,
} from './discovery.js';

// ============================================
// Execution
// ============================================

export {
  executeMcpTool,
  getMCPToolTimeout,
} from './execution.js';

// ============================================
// Auto-Search
// ============================================

export {
  shouldEnableToolSearch,
  calculateContextThreshold,
  calculateMcpDescriptionSize,
  isModelSupportedForToolSearch,
  isMcpSearchToolAvailable,
  getToolSearchMode,
  findDiscoveredToolsInHistory,
} from './autosearch.js';
