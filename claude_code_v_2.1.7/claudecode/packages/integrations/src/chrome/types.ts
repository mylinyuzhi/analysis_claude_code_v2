/**
 * @claudecode/integrations - Chrome Types
 *
 * Type definitions for Chrome browser integration.
 * Reconstructed from chunks.145.mjs, chunks.149.mjs
 */

// ============================================
// Socket Communication
// ============================================

/**
 * Socket message format.
 * Uses 4-byte little-endian length prefix + JSON payload.
 */
export interface SocketMessage {
  type: string;
  id?: string;
  payload?: unknown;
}

/**
 * Socket client options.
 */
export interface SocketClientOptions {
  socketPath: string;
  timeout?: number;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
}

/**
 * Socket client state.
 */
export type SocketClientState = 'disconnected' | 'connecting' | 'connected' | 'error';

// ============================================
// Native Host
// ============================================

/**
 * Native messaging format.
 * Chrome native messaging uses 4-byte length prefix.
 */
export interface NativeMessage {
  type: string;
  requestId?: string;
  data?: unknown;
}

/**
 * Native host server options.
 */
export interface NativeHostOptions {
  socketPath: string;
  maxClients?: number;
}

// ============================================
// MCP Tools
// ============================================

/**
 * Chrome MCP tool names.
 */
export type ChromeMcpToolName =
  // Tab Management
  | 'tabs_context_mcp'
  | 'tabs_create_mcp'
  | 'tabs_close_mcp'
  | 'tabs_focus_mcp'
  | 'tabs_navigate_mcp'
  // Page Interaction
  | 'page_click_mcp'
  | 'page_fill_mcp'
  | 'page_select_mcp'
  | 'page_hover_mcp'
  | 'page_scroll_mcp'
  | 'page_keyboard_mcp'
  // Content Capture
  | 'screenshot_mcp'
  | 'snapshot_mcp'
  | 'console_logs_mcp'
  | 'network_logs_mcp'
  // Script Execution
  | 'evaluate_mcp'
  // Recording
  | 'gif_record_mcp'
  | 'gif_stop_mcp';

/**
 * Chrome MCP tool definition.
 */
export interface ChromeMcpTool {
  name: ChromeMcpToolName;
  title: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Tab information.
 */
export interface TabInfo {
  id: number;
  url: string;
  title: string;
  active: boolean;
  groupId?: number;
}

/**
 * Tab group information.
 */
export interface TabGroupInfo {
  id: number;
  title: string;
  tabs: TabInfo[];
}

// ============================================
// Tool Input Types
// ============================================

/**
 * tabs_context_mcp input.
 */
export interface TabsContextInput {
  createIfEmpty?: boolean;
}

/**
 * tabs_create_mcp input.
 */
export interface TabsCreateInput {
  url: string;
}

/**
 * tabs_navigate_mcp input.
 */
export interface TabsNavigateInput {
  tabId: number;
  url: string;
}

/**
 * page_click_mcp input.
 */
export interface PageClickInput {
  tabId: number;
  selector: string;
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
}

/**
 * page_fill_mcp input.
 */
export interface PageFillInput {
  tabId: number;
  selector: string;
  value: string;
}

/**
 * screenshot_mcp input.
 */
export interface ScreenshotInput {
  tabId: number;
  fullPage?: boolean;
  selector?: string;
}

/**
 * evaluate_mcp input.
 */
export interface EvaluateInput {
  tabId: number;
  expression: string;
}

// ============================================
// Tool Result Types
// ============================================

/**
 * Generic tool result.
 */
export interface ChromeToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Screenshot result.
 */
export interface ScreenshotResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Console log entry.
 */
export interface ConsoleLogEntry {
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  timestamp: number;
  source?: string;
}

/**
 * Network request entry.
 */
export interface NetworkRequestEntry {
  url: string;
  method: string;
  status: number;
  type: string;
  timestamp: number;
  duration?: number;
}

// ============================================
// Skill Configuration
// ============================================

/**
 * Chrome skill configuration.
 */
export interface ChromeSkillConfig {
  name: 'claude-in-chrome';
  description: string;
  whenToUse: string;
  allowedTools: ChromeMcpToolName[];
  userInvocable: boolean;
}

// ============================================
// Constants
// ============================================

export const CHROME_CONSTANTS = {
  // Socket paths
  SOCKET_PATH_UNIX: '/tmp/claude-chrome.sock',
  SOCKET_PATH_WINDOWS: '\\\\.\\pipe\\claude-chrome',

  // Timeouts
  SOCKET_TIMEOUT_MS: 30000,
  RECONNECT_DELAY_MS: 1000,
  MAX_RECONNECT_ATTEMPTS: 3,

  // Native messaging
  NATIVE_HOST_NAME: 'com.anthropic.claude_code',
  MAX_MESSAGE_SIZE: 1024 * 1024, // 1MB

  // Skill
  SKILL_NAME: 'claude-in-chrome',

  // Tool prefixes
  MCP_TOOL_PREFIX: 'mcp__claude-in-chrome__',
} as const;

/**
 * All Chrome MCP tools.
 */
export const CHROME_MCP_TOOLS: ChromeMcpToolName[] = [
  'tabs_context_mcp',
  'tabs_create_mcp',
  'tabs_close_mcp',
  'tabs_focus_mcp',
  'tabs_navigate_mcp',
  'page_click_mcp',
  'page_fill_mcp',
  'page_select_mcp',
  'page_hover_mcp',
  'page_scroll_mcp',
  'page_keyboard_mcp',
  'screenshot_mcp',
  'snapshot_mcp',
  'console_logs_mcp',
  'network_logs_mcp',
  'evaluate_mcp',
  'gif_record_mcp',
  'gif_stop_mcp',
];

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
