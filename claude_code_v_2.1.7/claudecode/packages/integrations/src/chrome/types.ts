/**
 * @claudecode/integrations - Chrome Types
 *
 * Type definitions for Chrome browser integration.
 * Reconstructed from chunks.145.mjs, chunks.149.mjs, chunks.131.mjs
 */

import type { McpTool } from '../../mcp/types.js';

// ============================================
// Constants
// ============================================

/**
 * Constants for Chrome integration.
 * Original values from chunks.145.mjs, chunks.131.mjs
 */
export const CHROME_CONSTANTS = {
  // Server/Host Names
  SERVER_NAME: 'claude-in-chrome', // Original: Ej
  NATIVE_HOST_NAME: 'com.anthropic.claude_code_browser_extension', // Original: nz1
  
  // URLs
  RECONNECT_URL: 'https://clau.de/chrome/reconnect', // Original: DH7 / $H7
  INSTALL_URL: 'https://claude.ai/chrome', // Original: EH7 / wU7
  PERMISSIONS_URL: 'https://clau.de/chrome/permissions', // Original: zH7
  BUG_REPORT_URL: 'https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome', // Original: LU7
  TAB_DEEPLINK_URL: 'https://clau.de/chrome/tab/', // Original: dB7

  // IPC
  MAX_MESSAGE_SIZE: 1048576, // 1MB, Original: eP0
  SOCKET_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 5000,
  
  // Settings/Feature Flags
  AUTO_ENABLE_FEATURE_FLAG: 'tengu_chrome_auto_enable',
  DEFAULT_ENABLED_SETTING: 'claudeInChromeDefaultEnabled',
  
  // Extension ID
  EXTENSION_ID: 'fcoeoabgfenejglbffodgkkbkcdhcgfn',
} as const;

// ============================================
// Socket Communication
// ============================================

/**
 * Socket message format.
 * Uses 4-byte little-endian length prefix + JSON payload.
 */
export interface SocketMessage {
  method?: string;
  params?: any;
  result?: any;
  error?: any;
  id?: number | string;
  type?: string; // Used in native messaging
}

/**
 * Socket client state.
 */
export type SocketClientState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Socket client context.
 */
export interface SocketClientContext {
  serverName: string;
  socketPath: string;
  clientTypeId: string;
  logger: {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
  onAuthenticationError: () => void;
  onToolCallDisconnected: () => string;
}

// ============================================
// MCP Tools
// ============================================

/**
 * Chrome MCP tool names.
 * Original names from Pe array in chunks.145.mjs
 */
export type ChromeMcpToolName =
  | 'javascript_tool'
  | 'read_page'
  | 'find'
  | 'form_input'
  | 'computer'
  | 'navigate'
  | 'resize_window'
  | 'gif_creator'
  | 'upload_image'
  | 'get_page_text'
  | 'tabs_context_mcp'
  | 'tabs_create_mcp'
  | 'update_plan'
  | 'read_console_messages'
  | 'read_network_requests'
  | 'shortcuts_list'
  | 'shortcuts_execute';

/**
 * All Chrome MCP tool names array.
 */
export const CHROME_MCP_TOOLS: ChromeMcpToolName[] = [
  'javascript_tool',
  'read_page',
  'find',
  'form_input',
  'computer',
  'navigate',
  'resize_window',
  'gif_creator',
  'upload_image',
  'get_page_text',
  'tabs_context_mcp',
  'tabs_create_mcp',
  'update_plan',
  'read_console_messages',
  'read_network_requests',
  'shortcuts_list',
  'shortcuts_execute',
];

// ============================================
// UI & Setup
// ============================================

export interface ChromeIntegrationSetupProps {
  onDone: () => void;
  isExtensionInstalled: boolean;
  configEnabled: boolean;
  isClaudeAISubscriber: boolean;
  isWSL: boolean;
}
