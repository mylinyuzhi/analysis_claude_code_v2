/**
 * @claudecode/cli - Type Definitions
 *
 * CLI argument and configuration types.
 * Reconstructed from chunks.157.mjs
 */

// ============================================
// CLI Options
// ============================================

/**
 * Permission mode options.
 */
export type PermissionMode =
  | 'default'        // Ask for dangerous tools
  | 'plan'           // Ask for plan approval
  | 'plan-force'     // Force plan mode
  | 'bypassPermissions' // Skip all permission checks
  | 'acceptEdits';   // Auto-accept edit tools

/**
 * Output format options.
 */
export type OutputFormat =
  | 'text'           // Plain text output
  | 'json'           // Full JSON output
  | 'stream-json';   // Streaming JSON lines

/**
 * Input format options.
 */
export type InputFormat =
  | 'text'           // Plain text input
  | 'stream-json';   // Streaming JSON input

/**
 * Model selection options.
 */
export type ModelOption =
  | 'sonnet'
  | 'opus'
  | 'haiku'
  | string;  // Custom model ID

/**
 * Main CLI options.
 * Reconstructed from chunks.157.mjs:15-190
 */
export interface CLIOptions {
  // ---- Debug & Output ----
  debug?: boolean | string;
  debugToStderr?: boolean;
  verbose?: boolean;
  mcpDebug?: boolean;

  // ---- Input/Output Mode ----
  print?: boolean;
  outputFormat?: OutputFormat;
  inputFormat?: InputFormat;
  includePartialMessages?: boolean;
  outputFile?: string;
  readStdin?: boolean;
  inputStreamFormat?: 'raw' | 'lines';

  // ---- Session Management ----
  continue?: boolean;
  continueRecent?: boolean;
  resume?: string;
  fork?: string;
  teleport?: string;
  remote?: boolean;
  remoteNoAutoAuth?: boolean;
  sessionId?: string;

  // ---- Model & Agent ----
  model?: ModelOption;
  fallbackModel?: string;
  agentId?: string;
  addToTodo?: boolean;
  permission?: PermissionMode;

  // ---- System Prompts ----
  systemPrompt?: string;
  appendSystemPrompt?: string;
  systemPromptFile?: string;
  appendSystemPromptFile?: string;

  // ---- Tool Configuration ----
  allowedTools?: string[];
  disallowedTools?: string[];
  additionalDirectories?: string[];
  cwd?: string;

  // ---- MCP Configuration ----
  mcpConfig?: string;
  mcpConfigJson?: string;
  mcpStrictTransportMode?: boolean;
  allowMcpPromptAccess?: boolean;

  // ---- Chrome Integration ----
  autoConnectChrome?: boolean;
  installChrome?: boolean;

  // ---- Advanced ----
  maxBudget?: number;
  maxTurns?: number;
  maxConversationTurns?: number;
  jsonOutputSchema?: string;
  plugins?: string;
  autoConnectIde?: boolean;
  installIdeExtension?: string;
  skipInstallIdeExtension?: boolean;
  noAutoUpdater?: boolean;
  useBedrock?: boolean;
  useVertex?: boolean;

  // ---- Internal/Hidden ----
  mcpCli?: boolean;
  claudeInChromeMcp?: boolean;
  chromeNativeHost?: boolean;
  ripgrep?: boolean;
}

/**
 * Parsed CLI arguments with prompt.
 */
export interface ParsedCLIArgs extends CLIOptions {
  prompt?: string;  // Positional argument
  args?: string[];  // Remaining arguments
}

// ============================================
// Subcommands
// ============================================

/**
 * Available subcommands.
 */
export type Subcommand =
  | 'config'
  | 'mcp'
  | 'doctor'
  | 'login'
  | 'logout'
  | 'status';

/**
 * Config subcommand options.
 */
export interface ConfigSubcommandOptions {
  action: 'get' | 'set' | 'unset' | 'list' | 'reset';
  key?: string;
  value?: string;
  global?: boolean;
}

/**
 * MCP subcommand options.
 */
export interface McpSubcommandOptions {
  action: 'add' | 'remove' | 'list' | 'enable' | 'disable';
  serverName?: string;
  scope?: 'user' | 'project' | 'local';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
}

// ============================================
// Execution Modes
// ============================================

/**
 * CLI execution mode.
 */
export type ExecutionMode =
  | 'interactive'     // Default interactive REPL
  | 'print'          // Non-interactive print mode
  | 'mcp-cli'        // MCP command mode
  | 'chrome-mcp'     // Chrome MCP server
  | 'chrome-native'  // Chrome native host
  | 'ripgrep';       // Embedded ripgrep

/**
 * Execution context.
 */
export interface ExecutionContext {
  mode: ExecutionMode;
  options: ParsedCLIArgs;
  cwd: string;
  isTerminal: boolean;
  hasTTY: boolean;
}

// ============================================
// Version Info
// ============================================

/**
 * Version information.
 */
export interface VersionInfo {
  version: string;
  commit?: string;
  buildDate?: string;
  nodeVersion?: string;
}

// ============================================
// Constants
// ============================================

export const CLI_CONSTANTS = {
  // Default values
  DEFAULT_OUTPUT_FORMAT: 'text' as OutputFormat,
  DEFAULT_INPUT_FORMAT: 'text' as InputFormat,
  DEFAULT_PERMISSION_MODE: 'default' as PermissionMode,

  // Environment variables
  ENV_VARS: {
    DEBUG: 'CLAUDE_CODE_DEBUG',
    MODEL: 'CLAUDE_MODEL',
    API_KEY: 'ANTHROPIC_API_KEY',
    MAX_TURNS: 'CLAUDE_CODE_MAX_TURNS',
    DISABLE_AUTO_UPDATE: 'CLAUDE_CODE_DISABLE_AUTO_UPDATE',
    USE_BEDROCK: 'CLAUDE_CODE_USE_BEDROCK',
    USE_VERTEX: 'CLAUDE_CODE_USE_VERTEX',
    ENTRYPOINT: 'CLAUDE_CODE_ENTRYPOINT',
  } as const,

  // Exit codes
  EXIT_CODES: {
    SUCCESS: 0,
    ERROR: 1,
    INTERRUPTED: 130,
    PERMISSION_DENIED: 126,
  } as const,

  // Telemetry markers
  TELEMETRY_MARKERS: {
    VERSION_FAST_PATH: 'cli_version_fast_path',
    RIPGREP_PATH: 'cli_ripgrep_path',
    CHROME_MCP_PATH: 'cli_claude_in_chrome_mcp_path',
    CHROME_NATIVE_PATH: 'cli_chrome_native_host_path',
    BEFORE_MAIN_IMPORT: 'cli_before_main_import',
    AFTER_MAIN_IMPORT: 'cli_after_main_import',
    AFTER_MAIN_COMPLETE: 'cli_after_main_complete',
  } as const,

  // Version
  VERSION: '2.1.7',
} as const;

// ============================================
// Export
// ============================================

export type {
  PermissionMode,
  OutputFormat,
  InputFormat,
  ModelOption,
  CLIOptions,
  ParsedCLIArgs,
  Subcommand,
  ConfigSubcommandOptions,
  McpSubcommandOptions,
  ExecutionMode,
  ExecutionContext,
  VersionInfo,
};
