/**
 * @claudecode/cli
 *
 * CLI entry point for Claude Code.
 *
 * Key features:
 * - Multi-mode execution (interactive, print, MCP, Chrome, ripgrep)
 * - 45+ CLI options across 10 categories
 * - Session management (continue, resume, fork, teleport)
 * - Custom help formatting with alphabetical sorting
 * - MCP server management and tool execution
 * - Endpoint detection and socket communication
 *
 * Reconstructed from chunks.157.mjs, cli.chunks.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Commands
// ============================================

export * from './commands/index.js';

// Re-export commonly used functions at top level
export {
  mainEntry,
  detectExecutionMode,
  isVersionFastPath,
  createExecutionContext,
  parseOptions,
  validateOptions,
  CLI_OPTIONS,
} from './commands/index.js';

// ============================================
// Settings
// ============================================

export * from './settings/index.js';

// ============================================
// MCP
// ============================================

export * from './mcp/index.js';

// ============================================
// Endpoint
// ============================================

export * from './endpoint/index.js';

// ============================================
// Constants
// ============================================

export { CLI_CONSTANTS } from './types.js';
