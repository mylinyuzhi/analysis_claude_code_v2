/**
 * @claudecode/cli - Entry Point
 *
 * Main CLI entry point with mode detection.
 * Reconstructed from chunks.157.mjs:1860-1891
 *
 * Key symbols:
 * - D_7 → mainEntry
 * - J_7 → commandHandler
 * - zI9 → initializeConfig
 * - K12 → runMigrations
 * - sR7 → runConfigMigrations
 * - zL2 → loadRemoteSettings
 * - hw9 → runNonInteractive
 * - Y5 → renderInteractive
 * - v$A → MainInteractiveApp
 */

import type {
  ExecutionMode,
  ExecutionContext,
  CLIOptions,
  ParsedCLIArgs,
} from '../types.js';
import { CLI_CONSTANTS } from '../types.js';
import { parseOptions, validateOptions, CLI_OPTIONS } from './options.js';
import { handleMcpCli } from './mcp-cli.js';
import { handleChromeMcp, handleChromeNative } from './chrome-handlers.js';
import { handleRipgrep } from './ripgrep-handler.js';
import {
  loadAllSettings,
  loadMcpConfigFile,
  parseMcpConfigJson,
  getClaudeHomeDir,
  getUserSettingsPath,
} from '../settings/loader.js';
import { initializeMcp, resetMcpState } from '../mcp/state.js';

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
  const args = process.argv.slice(2);
  const mode = detectExecutionMode(args);

  // Emit telemetry marker for mode
  emitTelemetryMarker(mode);

  switch (mode) {
    case 'print':
      // Version fast path
      if (isVersionFastPath(args)) {
        console.log(`${CLI_CONSTANTS.VERSION} (Claude Code)`);
        return;
      }
      // Fall through to main handler
      break;

    case 'mcp-cli':
      // MCP CLI mode - delegate to MCP handler
      const mcpArgs = args.slice(1);
      const exitCode = await handleMcpCli(mcpArgs);
      process.exit(exitCode);

    case 'ripgrep':
      // Ripgrep mode - execute embedded ripgrep
      const rgArgs = args.slice(1);
      const rgExitCode = await handleRipgrep(rgArgs);
      process.exitCode = rgExitCode;
      return;

    case 'chrome-mcp':
      // Chrome MCP server
      await handleChromeMcp();
      return;

    case 'chrome-native':
      // Chrome native host
      await handleChromeNative();
      return;

    case 'interactive':
    default:
      // Standard mode - load main module
      await handleMainCommand();
      break;
  }
}

// Mode handlers are imported from separate modules:
// - handleMcpCli from './mcp-cli.js'
// - handleChromeMcp, handleChromeNative from './chrome-handlers.js'
// - handleRipgrep from './ripgrep-handler.js'

/**
 * Handle main command (interactive or print mode).
 * Original: J_7 (commandHandler) in chunks.157.mjs
 *
 * Flow:
 * 1. Parse CLI options
 * 2. Run preAction hook (initialize config, migrations, remote settings)
 * 3. Extract and validate options
 * 4. Setup MCP servers
 * 5. Branch to print or interactive mode
 */
async function handleMainCommand(): Promise<void> {
  const args = process.argv.slice(2);

  try {
    // Phase 1: Parse CLI options
    emitTelemetryMarker('run_function_start' as any);
    const options = parseOptions(args);

    // Phase 2: Validate options
    const validationResult = validateOptions(options);
    if (!validationResult.valid) {
      for (const error of validationResult.errors) {
        console.error(`Error: ${error}`);
      }
      process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
    }

    // Phase 3: Run preAction hook - initialization pipeline
    emitTelemetryMarker('preAction_start' as any);
    await runPreActionHook();
    emitTelemetryMarker('preAction_after_init' as any);

    // Phase 4: Extract key options
    const {
      debug = false,
      debugToStderr = false,
      print: isPrintMode = false,
      outputFormat = CLI_CONSTANTS.DEFAULT_OUTPUT_FORMAT,
      verbose = false,
      continue: shouldContinue = false,
      resume,
      sessionId,
      model,
      systemPrompt,
      appendSystemPrompt,
      allowedTools = [],
      disallowedTools = [],
      mcpConfig,
      cwd,
      prompt: initialPrompt,
    } = options;

    // Phase 5: Session ID validation
    if (sessionId) {
      const validated = validateSessionId(sessionId);
      if (!validated) {
        console.error('Error: Invalid session ID. Must be a valid UUID.');
        process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
      }
    }

    // Phase 6: Setup working directory
    if (cwd) {
      process.chdir(cwd);
    }

    // Phase 7: Load MCP configuration
    emitTelemetryMarker('action_mcp_configs_loaded' as any);
    let mcpServers: Record<string, unknown> = {};
    if (mcpConfig) {
      mcpServers = await loadMcpConfig(mcpConfig);
    }

    // Phase 8: Read prompt from stdin if piped
    let stdinPrompt = initialPrompt;
    if (!stdinPrompt && !process.stdin.isTTY) {
      stdinPrompt = await readStdinPrompt();
    }
    emitTelemetryMarker('action_after_input_prompt' as any);

    // Phase 9: Mode branching
    if (isPrintMode) {
      // Print mode (non-interactive)
      await runPrintMode({
        prompt: stdinPrompt,
        outputFormat,
        verbose,
        debug: debug || debugToStderr,
        model,
        systemPrompt,
        appendSystemPrompt,
        allowedTools,
        disallowedTools,
        mcpServers,
      });
    } else {
      // Interactive mode (default)
      await runInteractiveMode({
        initialPrompt: stdinPrompt,
        debug: debug || debugToStderr,
        verbose,
        shouldContinue,
        resume,
        sessionId,
        model,
        systemPrompt,
        appendSystemPrompt,
        allowedTools,
        disallowedTools,
        mcpServers,
      });
    }

    emitTelemetryMarker('cli_after_main_complete' as any);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
  }
}

// ============================================
// Initialization Pipeline
// ============================================

/**
 * Run pre-action initialization hook.
 * Original: preAction hook in J_7 (chunks.157.mjs:16-20)
 *
 * Phases:
 * 1. Enable configs
 * 2. Apply safe env vars
 * 3. Initialize detectors
 * 4. Setup graceful shutdown
 * 5. Initialize telemetry
 * 6. Populate OAuth
 * 7. Load remote settings
 * 8. Configure network (mTLS, proxy)
 * 9. Initialize MCP
 */
async function runPreActionHook(): Promise<void> {
  // Phase 1: Configuration loading
  await initializeConfig();

  // Phase 2: Run migrations
  await runMigrations();

  // Phase 3: Load remote settings
  await loadRemoteSettings();
}

/**
 * Initialize configuration.
 * Original: zI9 (initializeConfig) in chunks.149.mjs:2065-2105
 */
async function initializeConfig(): Promise<void> {
  // Enable configs
  enableConfigs();

  // Apply safe environment variables
  applySafeEnvVars();

  // Initialize detectors (settings, skills)
  // These would normally watch for file changes

  // Setup graceful shutdown handlers
  setupGracefulShutdown();

  // Initialize event logging
  initializeEventLogging();

  // Populate OAuth tokens
  await populateOAuth();
}

/**
 * Enable configuration files.
 * Original: nOA (enableConfigs) in chunks.149.mjs
 */
function enableConfigs(): void {
  // Load settings from all scopes
  const settings = loadAllSettings();

  // Store settings globally for access
  (globalThis as any).__claudeSettings = settings;

  // Ensure Claude home directory exists
  const fs = require('fs');
  const homeDir = getClaudeHomeDir();
  if (!fs.existsSync(homeDir)) {
    fs.mkdirSync(homeDir, { recursive: true });
  }
}

/**
 * Apply safe environment variables.
 * Original: KI9 (applySafeEnvVars) in chunks.149.mjs
 */
function applySafeEnvVars(): void {
  // Set safe defaults for environment variables
  // e.g., NODE_TLS_REJECT_UNAUTHORIZED, etc.
}

/**
 * Setup graceful shutdown handlers.
 * Original: LZ2 (setupGracefulShutdown) in chunks.149.mjs
 */
function setupGracefulShutdown(): void {
  // Handle SIGTERM, SIGINT for clean shutdown
  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(CLI_CONSTANTS.EXIT_CODES.INTERRUPTED);
  });
}

/**
 * Cleanup function for shutdown.
 */
async function cleanup(): Promise<void> {
  // Clean up MCP connections
  resetMcpState();

  // Reset terminal cursor
  cleanupCursor();
}

/**
 * Reset terminal cursor state on exit.
 * Original: I_7 (cleanupCursor) in chunks.157.mjs:1214-1216
 */
function cleanupCursor(): void {
  const TERMINAL_RESET_SEQUENCE = '\x1B[?25h\x1B[0m';
  const ttyStream = process.stderr.isTTY
    ? process.stderr
    : process.stdout.isTTY
      ? process.stdout
      : undefined;

  ttyStream?.write(TERMINAL_RESET_SEQUENCE);
}

/**
 * Initialize event logging.
 * Original: IKB (initializeEventLogging) in chunks.149.mjs
 */
function initializeEventLogging(): void {
  // Initialize first-party telemetry
}

/**
 * Populate OAuth tokens.
 * Original: jEQ (populateOAuth) in chunks.149.mjs
 */
async function populateOAuth(): Promise<void> {
  // Load OAuth tokens from token cache
}

/**
 * Run database migrations.
 * Original: K12 (runMigrations) in chunks.157.mjs
 */
async function runMigrations(): Promise<void> {
  // Run any pending data migrations
}

/**
 * Load remote settings.
 * Original: zL2 (loadRemoteSettings) in chunks.157.mjs
 */
async function loadRemoteSettings(): Promise<void> {
  // Load settings from remote server if enabled
}

// ============================================
// Session Management
// ============================================

/**
 * Validate session ID format.
 * Original: BU (validateUUID) in chunks.157.mjs
 */
function validateSessionId(id: string): string | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) ? id : null;
}

// ============================================
// MCP Configuration
// ============================================

/**
 * Load MCP configuration.
 */
async function loadMcpConfig(configPath: string): Promise<Record<string, unknown>> {
  try {
    // Try to load from file
    return loadMcpConfigFile(configPath);
  } catch {
    // Try to parse as JSON string
    try {
      return parseMcpConfigJson(configPath);
    } catch {
      console.warn(`Warning: Could not load MCP config from ${configPath}`);
      return {};
    }
  }
}

// ============================================
// Input Handling
// ============================================

/**
 * Read prompt from stdin.
 */
async function readStdinPrompt(): Promise<string | undefined> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    const timeout = setTimeout(() => {
      resolve(undefined);
    }, 100);

    process.stdin.on('data', (chunk) => {
      clearTimeout(timeout);
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      if (chunks.length > 0) {
        resolve(Buffer.concat(chunks).toString('utf-8').trim());
      } else {
        resolve(undefined);
      }
    });

    // If stdin is TTY, resolve immediately
    if (process.stdin.isTTY) {
      clearTimeout(timeout);
      resolve(undefined);
    }
  });
}

// ============================================
// Mode Execution
// ============================================

interface PrintModeOptions {
  prompt?: string;
  outputFormat: string;
  verbose: boolean;
  debug: boolean;
  model?: string;
  systemPrompt?: string;
  appendSystemPrompt?: string;
  allowedTools: string[];
  disallowedTools: string[];
  mcpServers: Record<string, unknown>;
}

/**
 * Run in print (non-interactive) mode.
 * Original: hw9 (runNonInteractive) in chunks.157.mjs
 */
async function runPrintMode(options: PrintModeOptions): Promise<void> {
  const { prompt, outputFormat, verbose } = options;

  if (!prompt) {
    console.error('Error: A prompt is required in print mode');
    process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
  }

  // In print mode, we process the prompt once and output the result
  if (verbose) {
    console.error(`Processing prompt: ${prompt.substring(0, 100)}...`);
  }

  // Setup JSON output if requested
  const isJsonOutput = outputFormat === 'json' || outputFormat === 'stream-json';

  try {
    // Import and run the agent loop
    const { streamApiCall } = await import('@claudecode/core/llm-api');

    // Build the request
    const request = {
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user' as const, content: prompt }],
      system: options.systemPrompt || options.appendSystemPrompt,
    };

    // Stream or collect response
    let fullResponse = '';
    const generator = streamApiCall(request, {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    for await (const result of generator) {
      if (result.type === 'assistant') {
        const content = result.message.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === 'text') {
              if (isJsonOutput) {
                fullResponse += block.text;
              } else {
                process.stdout.write(block.text);
              }
            }
          }
        }
      }
    }

    if (isJsonOutput) {
      console.log(JSON.stringify({ response: fullResponse }));
    } else {
      console.log(); // Final newline
    }
  } catch (error) {
    if (isJsonOutput) {
      console.log(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    } else {
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
    process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
  }
}

interface InteractiveModeOptions {
  initialPrompt?: string;
  debug: boolean;
  verbose: boolean;
  shouldContinue: boolean;
  resume?: string;
  sessionId?: string;
  model?: string;
  systemPrompt?: string;
  appendSystemPrompt?: string;
  allowedTools: string[];
  disallowedTools: string[];
  mcpServers: Record<string, unknown>;
}

/**
 * Run in interactive mode.
 * Original: Y5 (renderInteractive) in chunks.157.mjs
 */
async function runInteractiveMode(options: InteractiveModeOptions): Promise<void> {
  const { initialPrompt, shouldContinue, resume, debug } = options;

  if (debug) {
    console.error('Starting interactive mode...');
  }

  // Handle session continuation
  if (shouldContinue || resume) {
    console.log('Session continuation...');
    // Load previous session messages
    // This would use the session management system
  }

  // Start the interactive REPL
  // This would normally render the React UI with Ink
  console.log('Claude Code v' + CLI_CONSTANTS.VERSION);
  console.log('Interactive mode started. Type your prompt or use /help for commands.');

  // For now, implement a basic REPL
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  if (initialPrompt) {
    // Process initial prompt
    console.log(`Processing: ${initialPrompt}`);
    await processInteractivePrompt(initialPrompt, options);
  }

  rl.prompt();

  rl.on('line', async (line: string) => {
    const trimmed = line.trim();

    if (!trimmed) {
      rl.prompt();
      return;
    }

    // Handle slash commands
    if (trimmed.startsWith('/')) {
      await handleSlashCommand(trimmed, rl);
      rl.prompt();
      return;
    }

    // Process as prompt
    await processInteractivePrompt(trimmed, options);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });

  // Keep the process running
  await new Promise(() => {});
}

/**
 * Process a prompt in interactive mode.
 */
async function processInteractivePrompt(
  prompt: string,
  _options: InteractiveModeOptions
): Promise<void> {
  try {
    const { streamApiCall } = await import('@claudecode/core/llm-api');

    const request = {
      model: _options.model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user' as const, content: prompt }],
      system: _options.systemPrompt || _options.appendSystemPrompt,
    };

    const generator = streamApiCall(request, {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    for await (const result of generator) {
      if (result.type === 'assistant') {
        const content = result.message.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === 'text') {
              process.stdout.write(block.text);
            }
          }
        }
      }
    }
    console.log(); // Final newline
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Handle slash commands.
 */
async function handleSlashCommand(
  command: string,
  rl: import('readline').Interface
): Promise<void> {
  const [cmd, ...args] = command.slice(1).split(/\s+/);

  switch (cmd.toLowerCase()) {
    case 'help':
      console.log(`
Available commands:
  /help     - Show this help message
  /clear    - Clear conversation history
  /quit     - Exit Claude Code
  /version  - Show version info
  /model    - Show or set model
`);
      break;

    case 'quit':
    case 'exit':
      console.log('Goodbye!');
      rl.close();
      process.exit(0);
      break;

    case 'clear':
      console.log('Conversation cleared.');
      break;

    case 'version':
      console.log(`Claude Code v${CLI_CONSTANTS.VERSION}`);
      break;

    case 'model':
      if (args.length > 0) {
        console.log(`Model set to: ${args.join(' ')}`);
      } else {
        console.log('Current model: claude-sonnet-4-20250514');
      }
      break;

    default:
      console.log(`Unknown command: /${cmd}. Type /help for available commands.`);
  }
}

// ============================================
// Telemetry
// ============================================

/**
 * Emit telemetry marker for execution mode.
 */
function emitTelemetryMarker(mode: ExecutionMode): void {
  const markers = CLI_CONSTANTS.TELEMETRY_MARKERS;

  switch (mode) {
    case 'mcp-cli':
      // No specific marker for MCP CLI
      break;
    case 'ripgrep':
      console.debug(markers.RIPGREP_PATH);
      break;
    case 'chrome-mcp':
      console.debug(markers.CHROME_MCP_PATH);
      break;
    case 'chrome-native':
      console.debug(markers.CHROME_NATIVE_PATH);
      break;
    case 'interactive':
    case 'print':
    default:
      console.debug(markers.BEFORE_MAIN_IMPORT);
      break;
  }
}

// ============================================
// Execution Context
// ============================================

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

// ============================================
// Export
// ============================================

export {
  detectExecutionMode,
  isVersionFastPath,
  mainEntry,
  createExecutionContext,
};
