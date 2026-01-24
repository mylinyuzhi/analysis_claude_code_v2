/**
 * @claudecode/integrations - IDE Types
 *
 * Type definitions for IDE integration.
 * Reconstructed from chunks.131.mjs
 */

// ============================================
// IDE Configuration
// ============================================

/**
 * IDE kind (base platform).
 */
export type IdeKind = 'vscode' | 'jetbrains' | 'terminal';

/**
 * IDE configuration entry.
 * Original: iEA (IDE_CONFIG_MAP) in chunks.131.mjs
 */
export interface IdeConfig {
  ideKind: IdeKind;
  displayName: string;
  extension?: string;
  processKeywordsMac: string[];
  processKeywordsWindows: string[];
  processKeywordsLinux: string[];
}

/**
 * IDE name keys.
 */
export type IdeName =
  | 'cursor'
  | 'windsurf'
  | 'vscode'
  | 'intellij'
  | 'pycharm'
  | 'webstorm'
  | 'phpstorm'
  | 'rubymine'
  | 'clion'
  | 'goland'
  | 'rider'
  | 'datagrip'
  | 'appcode'
  | 'dataspell'
  | 'aqua'
  | 'gateway'
  | 'fleet'
  | 'androidstudio';

// ============================================
// Lock File Types
// ============================================

/**
 * Parsed lock file information.
 * Original: Sr2 (parseLockFile) return type
 */
export interface IdeLockInfo {
  workspaceFolders: string[];
  port: number;
  pid?: number;
  ideName?: string;
  useWebSocket: boolean;
  runningInWindows: boolean;
  authToken?: string;
}

/**
 * IDE connection information.
 * Original: IhA (getAvailableIDEConnections) return type
 */
export interface IdeConnection {
  url: string;
  name: string;
  workspaceFolders: string[];
  port: number;
  isValid: boolean;
  authToken?: string;
  ideRunningInWindows: boolean;
}

// ============================================
// IDE Extension Types
// ============================================

/**
 * Extension installation state.
 */
export interface IdeInstallationState {
  status: 'idle' | 'checking' | 'installing' | 'installed' | 'error';
  version?: string;
  error?: string;
}

// ============================================
// IDE Diff Types
// ============================================

/**
 * IDE diff request.
 */
export interface IdeDiffRequest {
  oldFilePath: string;
  newFilePath: string;
  newFileContents: string;
  tabName: string;
}

/**
 * IDE diff response type.
 */
export type IdeDiffResponse =
  | 'TAB_CLOSED' // User accepted
  | 'REJECTED' // User rejected
  | { type: 'text'; text: string }; // User modified

// ============================================
// MCP Config Types
// ============================================

/**
 * IDE MCP server configuration.
 */
export interface IdeMcpConfig {
  type: 'sse-ide' | 'ws-ide';
  url: string;
  ideName: string;
  authToken?: string;
  ideRunningInWindows?: boolean;
  scope: 'dynamic';
}

// ============================================
// IDE Attachment Types
// ============================================

/**
 * IDE context information captured from the connected IDE.
 */
export interface IdeContext {
  filePath?: string;
  lineStart?: number;
  lineCount?: number;
  text?: string;
}

/**
 * IDE-related prompt attachments.
 */
export type IdeAttachment =
  | {
      type: 'selected_lines_in_ide';
      ideName: string;
      lineStart: number;
      lineEnd: number;
      filename: string;
      content: string;
    }
  | {
      type: 'opened_file_in_ide';
      filename: string;
    };

// ============================================
// Constants
// ============================================

/**
 * IDE constants.
 */
export const IDE_CONSTANTS = {
  // Lock file directory under ~/.claude/
  IDE_DIR_NAME: 'ide',

  // Connection timeout (Mr2)
  CONNECTION_POLL_INTERVAL: 1000, // 1 second
  CONNECTION_POLL_TIMEOUT: 30000, // 30 seconds

  // Attachment timeout
  ATTACHMENT_TIMEOUT: 1000, // 1 second

  // Extension identifiers
  VSCODE_EXTENSION_ID: 'anthropic.claude-code',
  JETBRAINS_PLUGIN_ID: 'claude-code-jetbrains-plugin',

  // Process parent chain depth
  MAX_PARENT_CHAIN_DEPTH: 10,

  // Environment variables
  ENV_VARS: {
    AUTO_CONNECT_IDE: 'CLAUDE_CODE_AUTO_CONNECT_IDE',
    SSE_PORT: 'CLAUDE_CODE_SSE_PORT',
    SKIP_VALID_CHECK: 'CLAUDE_CODE_IDE_SKIP_VALID_CHECK',
    SKIP_AUTO_INSTALL: 'CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL',
    HOST_OVERRIDE: 'CLAUDE_CODE_IDE_HOST_OVERRIDE',
    FORCE_CODE_TERMINAL: 'FORCE_CODE_TERMINAL',
    WSL_DISTRO_NAME: 'WSL_DISTRO_NAME',
  } as const,
} as const;

/**
 * Terminal info.
 */
export interface TerminalInfo {
  terminal: string | null;
}

/**
 * Keybinding installation context.
 */
export interface KeybindingContext {
  // Add any specific context fields if needed
}
