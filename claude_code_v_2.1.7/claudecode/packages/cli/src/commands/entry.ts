/**
 * @claudecode/cli - Entry Point
 *
 * Main CLI entry point with mode detection.
 * Reconstructed from chunks.157.mjs:1860-1891
 *
 * Key symbols:
 * - D_7 → mainEntry
 * - J_7 → commandHandler
 */

import type {
  ExecutionMode,
  ExecutionContext,
} from '../types.js';
import { CLI_CONSTANTS } from '../types.js';
import { handleMcpCli } from './mcp-cli.js';
import { handleChromeMcp, handleChromeNative } from './chrome-handlers.js';
import { handleRipgrep } from './ripgrep-handler.js';

// ============================================
// Mode Detection
// ============================================

/**
 * Detect execution mode from command line arguments.
 * Original: D_7 (mainEntry) in chunks.157.mjs:1860-1891
 *
 * Modes (checked in order):
 * 1. Version fast path: -v, --version, -V (immediate response)
 * 2. MCP CLI: --mcp-cli (delegate to MCP handler)
 * 3. Ripgrep: --ripgrep (execute embedded ripgrep)
 * 4. Chrome MCP: --claude-in-chrome-mcp (start MCP server)
 * 5. Chrome Native: --chrome-native-host (native messaging)
 * 6. Standard: Load full application
 */
export function detectExecutionMode(args: string[]): ExecutionMode {
  // Mode 1: Version fast path
  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v' || args[0] === '-V')) {
    return 'print'; // Will output version and exit
  }

  // Mode 2: MCP CLI
  if (args[0] === '--mcp-cli') {
    return 'mcp-cli';
  }

  // Mode 3: Ripgrep
  if (args[0] === '--ripgrep') {
    return 'ripgrep';
  }

  // Mode 4: Chrome MCP server
  if (args[0] === '--claude-in-chrome-mcp') {
    return 'chrome-mcp';
  }

  // Mode 5: Chrome native host
  if (args[0] === '--chrome-native-host') {
    return 'chrome-native';
  }

  // Mode 6: Standard (check for print mode later in option parsing)
  return 'interactive';
}

/**
 * Check if in version fast path.
 */
export function isVersionFastPath(args: string[]): boolean {
  return args.length === 1 && (args[0] === '--version' || args[0] === '-v' || args[0] === '-V');
}

// ============================================
// Entry Point
// ============================================

/**
 * Main entry point.
 * Original: D_7 (mainEntry) in chunks.157.mjs:1860-1891
 *
 * Flow:
 * 1. Get CLI arguments
 * 2. Detect execution mode
 * 3. Handle fast paths (version, ripgrep)
 * 4. Load and execute appropriate handler
 */
export async function mainEntry(): Promise<void> {
  const { telemetryMarker } = await import('@claudecode/platform');
  const args = process.argv.slice(2);
  const mode = detectExecutionMode(args);

  switch (mode) {
    case 'print':
      // Version fast path
      if (isVersionFastPath(args)) {
        telemetryMarker('cli_version_fast_path');
        console.log(`${CLI_CONSTANTS.VERSION} (Claude Code)`);
        return;
      }
      // Fall through to main handler if not just --version
      break;

    case 'mcp-cli':
      // MCP CLI mode - delegate to MCP handler
      const mcpArgs = args.slice(1);
      const exitCode = await handleMcpCli(mcpArgs);
      process.exit(exitCode);

    case 'ripgrep':
      // Ripgrep mode - execute embedded ripgrep
      telemetryMarker('cli_ripgrep_path');
      const rgArgs = args.slice(1);
      const rgExitCode = await handleRipgrep(rgArgs);
      process.exitCode = rgExitCode;
      return;

    case 'chrome-mcp':
      // Chrome MCP server
      telemetryMarker('cli_claude_in_chrome_mcp_path');
      await handleChromeMcp();
      return;

    case 'chrome-native':
      // Chrome native host
      telemetryMarker('cli_chrome_native_host_path');
      await handleChromeNative();
      return;

    case 'interactive':
    default:
      break;
  }

  // Standard mode - load main module dynamically
  // This matches source optimization: Promise.resolve().then(() => (UL9(), CL9))
  telemetryMarker('cli_before_main_import');
  const { handleMainCommand } = await import('./main-handler.js');
  telemetryMarker('cli_after_main_import');
  
  await handleMainCommand();
  telemetryMarker('cli_after_main_complete');
}

/**
 * Initialize workspace.
 * Original: IU1 in chunks.156.mjs:1731
 */
export async function initializeWorkspace(
  cwd: string,
  mode: string = 'default',
  bypassPermissions: boolean = false,
  isChrome: boolean = false,
  sessionId?: string
): Promise<void> {
  const { initializeConfig } = await import('./main-handler.js');
  await initializeConfig();
  
  if (bypassPermissions || mode === 'bypassPermissions') {
    if (process.platform !== 'win32' && process.getuid?.() === 0 && !process.env.IS_SANDBOX) {
      console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons");
      process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
    }
  }
}

/**
 * Create execution context.
 */
export function createExecutionContext(
  mode: ExecutionMode,
  options: Record<string, unknown> = {}
): ExecutionContext {
  return {
    mode,
    options: options as any,
    cwd: process.cwd(),
    isTerminal: process.stdout.isTTY ?? false,
    hasTTY: Boolean(process.stdin.isTTY && process.stdout.isTTY),
  };
}
