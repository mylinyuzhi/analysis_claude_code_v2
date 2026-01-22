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

import React from 'react';
import { render } from 'ink';
import { InteractiveSession } from '../components/InteractiveSession.js';
import { InternalApp } from '@claudecode/ui';
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
  getLocalSettingsPath,
  getProjectSettingsPath,
  applySafeEnvVars,
  configureGlobalMTLS,
  configureGlobalAgents,
} from '../settings/loader.js';
import {
  initializeMcp,
  resetMcpState,
  getMcpState,
  connectMcpServer,
} from '../mcp/state.js';
import type { McpServerConfig as StateMcpServerConfig } from '@claudecode/integrations';
import {
  getCommandRegistry,
  parseSlashCommandInput,
} from '@claudecode/features/slash-commands';
import { compact as compactFeature } from '@claudecode/features';
import { coreMessageLoop, type LoopEvent } from '@claudecode/core/agent-loop';
import {
  createUserMessage as createCoreUserMessage,
  createTextAssistantMessage,
  type ConversationMessage,
} from '@claudecode/core/message';
import { createDefaultAppState } from '@claudecode/core/state';
import { builtinTools as builtinToolImpls } from '@claudecode/tools';
import {
  addSessionToIndex,
  appendJsonlEntry,
  generateNewSessionId,
  getProjectDir,
  getSessionId,
  getSessionPath,
  loadOrRestoreSession,
  setSessionId,
  type SessionLogEntry,
} from '@claudecode/shared';
import * as nodeFs from 'fs';
import * as nodePath from 'path';
import type {
  Tool as ToolsTool,
  ToolContext as ToolsToolContext,
  ToolResult as ToolsToolResult,
  ToolResultBlockParam as ToolsToolResultBlockParam,
} from '@claudecode/tools';
import type {
  Tool as CoreTool,
  ToolUseContext as CoreToolUseContext,
  ToolResult as CoreToolResult,
} from '@claudecode/core/tools';
import {
  sandboxManager,
  setSandboxConfig,
  getSandboxConfig,
  SANDBOX_CONSTANTS,
  type SandboxConfig,
  type SandboxSettings,
  telemetry,
  refreshOAuthTokenIfNeeded,
} from '@claudecode/platform';

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
      // Fall through to main handler
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
      // Standard mode - load main module
      telemetryMarker('cli_before_main_import');
      // In source, there's a dynamic import here.
      telemetryMarker('cli_after_main_import');
      await handleMainCommand();
      telemetryMarker('cli_after_main_complete');
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
  const { telemetryMarker } = await import('@claudecode/platform');
  const args = process.argv.slice(2);

  try {
    // Phase 1: Parse CLI options
    telemetryMarker('run_function_start');
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
    telemetryMarker('preAction_start');
    await runPreActionHook();
    telemetryMarker('preAction_after_init');

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
    telemetryMarker('action_mcp_configs_loaded');
    let mcpServers: Record<string, unknown> = {};
    if (mcpConfig) {
      mcpServers = await loadMcpConfig(mcpConfig);
    }

    // Phase 8: Read prompt from stdin if piped
    let stdinPrompt = initialPrompt;
    if (!stdinPrompt && !process.stdin.isTTY) {
      stdinPrompt = await readStdinPrompt();
    }
    telemetryMarker('action_after_input_prompt');

    // Phase 9: Mode branching
    telemetryMarker('action_before_setup');
    // ... setup logic ...
    telemetryMarker('action_after_setup');
    
    telemetryMarker('action_commands_loaded');
    telemetryMarker('action_after_plugins_init');
    telemetryMarker('action_after_hooks');

    if (isPrintMode) {
      // Print mode (non-interactive)
      await runPrintMode({
        prompt: stdinPrompt,
        outputFormat,
        verbose,
        debug: Boolean(debug || debugToStderr),
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
        debug: Boolean(debug || debugToStderr),
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
  const { telemetryMarker } = await import('@claudecode/platform');
  const startTime = Date.now();
  
  // OB("info", "init_started")
  logInfo("init_started");
  telemetryMarker('init_function_start');

  try {
    // Phase 1: Enable configs
    const phase1Start = Date.now();
    enableConfigs(); // nOA
    logInfo("init_configs_enabled", { duration_ms: Date.now() - phase1Start });
    telemetryMarker('init_configs_enabled');

    // Phase 2: Apply safe environment variables
    const phase2Start = Date.now();
    applySafeEnvVars(); // KI9
    logInfo("init_safe_env_vars_applied", { duration_ms: Date.now() - phase2Start });
    telemetryMarker('init_safe_env_vars_applied');

    // Phase 3: Initialize detectors
    const phase3Start = Date.now();
    // HC.initialize() -> SettingsDetector.initialize()
    await initializeSettingsDetector();
    logInfo("init_settings_detector_initialized", { duration_ms: Date.now() - phase3Start });
    telemetryMarker('init_settings_detector_initialized');

    // k$1.initialize() -> SkillDetector.initialize()
    await initializeSkillDetector();
    telemetryMarker('init_skill_detector_initialized');

    // Phase 4: Setup graceful shutdown handlers
    setupGracefulShutdown(); // LZ2
    telemetryMarker('init_after_graceful_shutdown');

    // Phase 5: Initialize event logging
    initializeEventLogging(); // IKB
    telemetryMarker('init_after_1p_event_logging');

    // Phase 6: Populate OAuth tokens
    await populateOAuth(); // jEQ
    telemetryMarker('init_after_oauth_populate');

    // Phase 7: Load remote settings check
    if (shouldFetchRemoteSettings()) { // iH0()
      initFetchRemoteSettings(); // FL2()
    }
    telemetryMarker('init_after_remote_settings_check');

    // Phase 8: Initialize first launch time if needed
    initializeFirstLaunchTime(); // B2B()

    // Phase 9: Configure network (mTLS, proxy)
    const phase9Start = Date.now();
    logDebug("[init] configureGlobalMTLS starting");
    configureGlobalMTLS(); // btQ()
    logInfo("init_mtls_configured", { duration_ms: Date.now() - phase9Start });
    logDebug("[init] configureGlobalMTLS complete");

    const phase10Start = Date.now();
    logDebug("[init] configureGlobalAgents starting");
    configureGlobalAgents(); // mtQ()
    logInfo("init_proxy_configured", { duration_ms: Date.now() - phase10Start });
    logDebug("[init] configureGlobalAgents complete");
    telemetryMarker('init_network_configured');

    // Phase 10: Configure Windows shell and handle MCP-CLI session
    configureWindowsShell(); // F7Q()
    
    // C6(Sy2) -> Register shutdown hook for LSP manager
    registerShutdownHook(shutdownLspManager);

    if (isMcpCliMode()) { // jJ()
      process.env.CLAUDE_CODE_SESSION_ID = getSessionId() || generateNewSessionId(); // q0()
      registerMcpCliCleanup(); // AX9()
    }

    // Phase 11: Initialize scratchpad if enabled
    if (isScratchpadEnabled()) { // K$A()
      const phase11Start = Date.now();
      await initializeScratchpad(); // YX9()
      logInfo("init_scratchpad_created", { duration_ms: Date.now() - phase11Start });
    }

    logInfo("init_completed", { duration_ms: Date.now() - startTime });
    telemetryMarker('init_function_end');

  } catch (error) {
    if (error instanceof ConfigParseError) { // Hq
      return handleConfigError({ error }); // VI9
    }
    throw error;
  }
}

/**
 * Helper for logging info events (OB equivalent).
 */
function logInfo(event: string, metadata?: Record<string, unknown>): void {
  // In source, this goes to an internal logger/telemetry system
  if (process.env.DEBUG) {
    console.error(`[INFO] ${event}`, metadata || '');
  }
}

/**
 * Helper for logging debug messages (k equivalent).
 */
function logDebug(message: string): void {
  if (process.env.DEBUG) {
    console.error(`[DEBUG] ${message}`);
  }
}

/**
 * Placeholder for SettingsDetector initialization.
 * Original: HC.initialize() (cG8 in chunks.55.mjs)
 */
async function initializeSettingsDetector(): Promise<void> {
  // Implementation would involve setting up a file watcher for settings files
}

/**
 * Placeholder for SkillDetector initialization.
 * Original: k$1.initialize() (pU7 in chunks.149.mjs)
 */
async function initializeSkillDetector(): Promise<void> {
  // Implementation would involve setting up a directory watcher for skills
}

/**
 * Placeholder for remote settings check.
 * Original: iH0() (Zc in chunks.107.mjs)
 */
function shouldFetchRemoteSettings(): boolean {
  // Enterprise/First-party check logic
  return false; 
}

/**
 * Placeholder for starting remote settings fetch.
 * Original: FL2() (chunks.107.mjs)
 */
function initFetchRemoteSettings(): void {
  // Sets up a global promise for remote settings
}

/**
 * Initialize first launch time if not set.
 * Original: B2B() (chunks.48.mjs)
 */
function initializeFirstLaunchTime(): void {
  // Sets firstStartTime in global config/state
}

/**
 * Configure shell for Windows (Git Bash detection).
 * Original: F7Q() (chunks.20.mjs)
 */
function configureWindowsShell(): void {
  if (process.platform === 'win32') {
    // Logic to find Git Bash and set process.env.SHELL
  }
}

/**
 * Shutdown hooks registration system.
 * Original: C6() (chunks.1.mjs)
 */
const shutdownHooks = new Set<() => Promise<void> | void>();
function registerShutdownHook(hook: () => Promise<void> | void): void {
  shutdownHooks.add(hook);
}

/**
 * LSP Manager shutdown hook.
 * Original: Sy2() (chunks.114.mjs)
 */
async function shutdownLspManager(): Promise<void> {
  // Implementation to shutdown Yx (LSP Server Manager)
}

/**
 * Check if running in MCP-CLI mode.
 * Original: jJ() (chunks.148.mjs)
 */
function isMcpCliMode(): boolean {
  // Check if args include --mcp-cli or related mode
  return process.argv.includes('--mcp-cli');
}

/**
 * Register cleanup hook for MCP-CLI mode.
 * Original: AX9() (chunks.148.mjs)
 */
function registerMcpCliCleanup(): void {
  registerShutdownHook(async () => {
    // Cleanup MCP-CLI specific session files
  });
}

/**
 * Check if scratchpad feature is enabled.
 * Original: K$A() (chunks.148.mjs)
 */
function isScratchpadEnabled(): boolean {
  // Feature flag check for tengu_scratch
  return false;
}

/**
 * Initialize scratchpad directory.
 * Original: YX9() (chunks.148.mjs)
 */
async function initializeScratchpad(): Promise<void> {
  // Create scratchpad directory if needed
}

/**
 * Custom error class for configuration parsing errors.
 * Original: Hq (chunks.20.mjs)
 */
class ConfigParseError extends Error {
  constructor(public filePath: string, public defaultConfig: any) {
    super(`Failed to parse config at ${filePath}`);
    this.name = 'ConfigParseError';
  }
}

/**
 * Handle configuration error by showing an interactive UI.
 * Original: VI9() (chunks.149.mjs)
 */
async function handleConfigError(options: { error: ConfigParseError }): Promise<void> {
  console.error(`\n❌ Configuration Error in ${options.error.filePath}`);
  console.error('Please fix the JSON or delete the file to reset to defaults.');
  process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
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

  // Apply sandbox settings/config (if present)
  applySandboxFromSettings(settings);

  // Ensure Claude home directory exists
  const homeDir = getClaudeHomeDir();
  if (!nodeFs.existsSync(homeDir)) {
    nodeFs.mkdirSync(homeDir, { recursive: true });
  }
}

function applySandboxFromSettings(settings: any): void {
  const rawSandbox: SandboxSettings | undefined = settings?.sandbox;
  if (rawSandbox && typeof rawSandbox === 'object') {
    sandboxManager.setSandboxSettings(rawSandbox);
  }

  let cfg: SandboxConfig | undefined = settings?.sandboxConfig;
  if (!cfg && rawSandbox?.enabled) {
    cfg = buildDefaultSandboxConfig(process.cwd());
  }
  setSandboxConfig(cfg);
}

function buildDefaultSandboxConfig(cwd: string): SandboxConfig {
  return {
    network: {
      allowedDomains: [],
      deniedDomains: [],
      allowLocalBinding: true,
    },
    filesystem: {
      denyRead: [],
      allowWrite: [cwd, SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR],
      denyWrite: [],
    },
    mandatoryDenySearchDepth: 3,
  };
}

async function initializeSandboxIfEnabled(): Promise<void> {
  if (!sandboxManager.isSandboxingEnabled()) return;
  const cfg = getSandboxConfig();
  if (!cfg) {
    throw new Error('Sandbox is enabled but sandboxConfig is missing.');
  }

  const permissionCallback = await createSandboxPermissionCallback();
  await sandboxManager.initialize(cfg, permissionCallback, true);
}

async function createSandboxPermissionCallback(): Promise<
  (domain: string, type: 'http' | 'socks') => Promise<boolean>
> {
  // If no TTY, never prompt.
  if (!process.stdin.isTTY) {
    return async () => false;
  }

  const cache = new Map<string, boolean>();

  return async (domain: string, type: 'http' | 'socks') => {
    const key = `${type}:${domain}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
    const ans = await new Promise<string>((resolve) => {
      rl.question(`Allow ${type.toUpperCase()} access to ${domain}? [y/N] `, (a: string) => {
        rl.close();
        resolve(a);
      });
    });
    const normalized = ans.trim().toLowerCase();

    const ok = normalized === 'y' || normalized === 'yes';
    cache.set(key, ok);
    return ok;
  };
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
  telemetry.initializeStartupProfiling();
}

/**
 * Populate OAuth tokens.
 * Original: jEQ (populateOAuth) in chunks.149.mjs
 */
async function populateOAuth(): Promise<void> {
  // Load OAuth tokens from token cache
  try {
    // Attempt to refresh the token to ensure we have valid credentials available
    // for the session. This is a best-effort operation at startup.
    await refreshOAuthTokenIfNeeded();
  } catch (error) {
    // Ignore errors during startup - authentication may be handled later
    // or the user may not be logged in yet.
  }
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
  // TODO: Implement remote settings fetching when backend is available.
  // This typically involves fetching dynamic configuration/feature flags
  // from a remote endpoint.
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

function resolveAllowedToolSet(allowedTools: string[] | undefined): Set<string> | null {
  if (!allowedTools || allowedTools.length === 0) return null;
  if (allowedTools.includes('*')) return null;
  return new Set(allowedTools);
}

function resolveDisallowedToolSet(disallowedTools: string[] | undefined): Set<string> {
  return new Set((disallowedTools ?? []).filter(Boolean));
}

function filterToolsByAllowDeny<T extends { name: string }>(
  tools: T[],
  allowedTools: string[] | undefined,
  disallowedTools: string[] | undefined
): T[] {
  const allowed = resolveAllowedToolSet(allowedTools);
  const denied = resolveDisallowedToolSet(disallowedTools);
  return tools.filter((t) => {
    if (denied.has(t.name)) return false;
    if (allowed && !allowed.has(t.name)) return false;
    return true;
  });
}

function textFromContentBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';
  let out = '';
  for (const b of blocks) {
    if (b && typeof b === 'object' && (b as any).type === 'text') {
      out += String((b as any).text ?? '');
    }
  }
  return out;
}

function isConversationMessage(event: LoopEvent): event is ConversationMessage {
  return typeof event === 'object' && event !== null && 'type' in event &&
    (event as any).type !== 'progress' &&
    (event as any).type !== 'tombstone' &&
    (event as any).type !== 'stream_request_start' &&
    (event as any).type !== 'stream_event' &&
    (event as any).type !== 'retry' &&
    (event as any).type !== 'api_error';
}

function adaptToolsForCore(options: {
  allowedTools?: string[];
  disallowedTools?: string[];
  getAppState: () => Promise<any>;
  setAppState: (updater: (state: any) => any) => void;
  readFileState: Map<string, any>;
  agentId?: string;
  sessionId?: string;
  abortController?: AbortController;
}): CoreTool[] {
  const filtered = filterToolsByAllowDeny(builtinToolImpls as ToolsTool[], options.allowedTools, options.disallowedTools);

  return filtered.map((tool) => {
    const adapted: CoreTool = {
      name: tool.name,
      maxResultSizeChars: (tool as any).maxResultSizeChars ?? 30000,
      strict: (tool as any).strict,
      input_examples: (tool as any).input_examples,
      description: tool.description as any,
      prompt: tool.prompt as any,
      inputSchema: tool.inputSchema as any,
      outputSchema: tool.outputSchema as any,
      userFacingName: (tool as any).userFacingName,
      isEnabled: tool.isEnabled as any,
      isConcurrencySafe: tool.isConcurrencySafe as any,
      isReadOnly: tool.isReadOnly as any,
      isSearchOrReadCommand: (tool as any).isSearchOrReadCommand,
      getPath: (tool as any).getPath,
      checkPermissions: async (input: unknown, ctx: CoreToolUseContext) => {
        if (!(tool as any).checkPermissions) return { result: true };
        const toolCtx: ToolsToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          // Pass core tool use options through (Task tool relies on agentDefinitions/mcpClients, etc.)
          // Also attach current message history for forkContext behaviors.
          options: {
            ...(ctx as any).options,
            __messages: (ctx as any).messages,
          },
        };
        const res = await (tool as any).checkPermissions(input, toolCtx);
        if (res?.behavior === 'deny') return { result: false, behavior: 'deny', message: res.message };
        if (res?.behavior === 'ask') return { result: false, behavior: 'ask', message: res.message };
        return { result: true };
      },
      validateInput: async (input: unknown, ctx: CoreToolUseContext) => {
        if (!(tool as any).validateInput) return { result: true };
        const toolCtx: ToolsToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          options: {
            ...(ctx as any).options,
            __messages: (ctx as any).messages,
          },
        };
        const res = await (tool as any).validateInput(input, toolCtx);
        return { result: !!res?.result, message: res?.message, errorCode: res?.errorCode };
      },
      call: async (
        input: unknown,
        ctx: CoreToolUseContext,
        toolUseId: string,
        metadata: unknown,
        progressCallback?: (progress: any) => void
      ): Promise<CoreToolResult> => {
        const toolCtx: ToolsToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          options: {
            ...(ctx as any).options,
            __messages: (ctx as any).messages,
          },
        };

        const res: ToolsToolResult<any> = await (tool as any).call(
          input,
          toolCtx,
          toolUseId,
          metadata,
          progressCallback as any
        );

        return {
          data: res?.data,
          error: res?.error,
        } as CoreToolResult;
      },
      mapToolResultToToolResultBlockParam: (
        result: CoreToolResult,
        toolUseId: string
      ) => {
        const data = (result as any)?.data;
        const raw: ToolsToolResultBlockParam = (tool as any).mapToolResultToToolResultBlockParam
          ? (tool as any).mapToolResultToToolResultBlockParam(data, toolUseId)
          : ({ tool_use_id: toolUseId, type: 'tool_result', content: JSON.stringify(data) } as any);

        return {
          type: 'tool_result',
          tool_use_id: raw.tool_use_id,
          content: raw.content as any,
          is_error: Boolean((result as any)?.error) || raw.is_error,
        } as any;
      },
    };

    return adapted;
  });
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

  try {
    // Initialize sandbox (if enabled)
    if (sandboxManager.isSandboxingEnabled()) {
      try {
        await initializeSandboxIfEnabled();
      } catch (err) {
        process.stderr.write(
          `\n❌ Sandbox Error: ${err instanceof Error ? err.message : String(err)}\n`
        );
        process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
      }
    }
    const isStreamJson = outputFormat === 'stream-json';
    const isJson = outputFormat === 'json';

    // 1) 初始化运行态状态（非 React，供 toolUseContext 使用）
    let appState = createDefaultAppState();
    appState.verbose = Boolean(options.verbose);
    if (options.model) {
      (appState as any).mainLoopModel = options.model;
      (appState as any).mainLoopModelForSession = options.model;
    }

    const readFileState = new Map<string, any>();
    const abortController = new AbortController();

    const getAppState = async () => appState;
    const setAppState = (updater: (s: any) => any) => {
      appState = updater(appState);
    };

    // Initialize MCP and update AppState
    if (!getMcpState().initialized) {
      await initializeMcp(process.cwd());
    }
    
    // Connect any additional servers from options
    if (options.mcpServers && Object.keys(options.mcpServers).length > 0) {
      for (const [name, config] of Object.entries(options.mcpServers)) {
        try {
          await connectMcpServer(name, config as StateMcpServerConfig);
        } catch (err) {
          console.error(`Failed to connect to MCP server ${name}:`, err);
        }
      }
    }
    
    // Sync MCP state to AppState
    const mcpState = getMcpState();
    (appState as any).mcp = {
      clients: mcpState.clients,
      tools: mcpState.tools,
      resources: mcpState.resources,
      initialized: mcpState.initialized
    };

    const tools = adaptToolsForCore({
      allowedTools: options.allowedTools,
      disallowedTools: options.disallowedTools,
      getAppState,
      setAppState,
      readFileState,
      abortController,
    });

    // 2) 先走 slash command parser（与 interactive 行为一致）
    const registry = getCommandRegistry();
    const commands = registry.getAll();
    const cmdResult = prompt.trim().startsWith('/')
      ? await parseSlashCommandInput(prompt, {
          options: {
            commands,
            isNonInteractiveSession: true,
            model: options.model,
          },
          messages: [],
          abortController,
          cwd: process.cwd(),
        })
      : { messages: [{ role: 'user', content: prompt }], shouldQuery: true };

    if (!cmdResult.shouldQuery) {
      // 非交互模式下，local-jsx 等命令会被跳过；这里保持安静即可
      if (isJson) {
        process.stdout.write(JSON.stringify({ response: '' }) + '\n');
      }
      return;
    }

    const conversation: ConversationMessage[] = [];
    for (const m of cmdResult.messages) {
      if (!m?.content) continue;
      const content = Array.isArray(m.content) ? (m.content as any) : String(m.content);
      conversation.push(
        createCoreUserMessage({
          content,
          isMeta: Boolean((m as any).isMeta) || m.role === 'system',
        }) as any
      );
    }

    // 3) 跑 core message loop
    let fullResponse = '';
    for await (const ev of coreMessageLoop({
      messages: conversation,
      systemPrompt: options.systemPrompt || options.appendSystemPrompt || '',
      userContext: undefined,
      systemContext: undefined,
      canUseTool: async (tool) => {
        const denied = resolveDisallowedToolSet(options.disallowedTools);
        const allowed = resolveAllowedToolSet(options.allowedTools);
        if (denied.has(tool.name)) return false;
        if (allowed && !allowed.has(tool.name)) return false;
        return true;
      },
      toolUseContext: {
        getAppState,
        setAppState,
        readFileState,
        abortController,
        messages: conversation,
        options: {
          tools,
          mainLoopModel: options.model,
          agentDefinitions: (appState as any).agentDefinitions,
          mcpClients: (appState as any).mcp?.clients,
        },
      } as any,
      querySource: 'cli',
    })) {
      if (isStreamJson) {
        process.stdout.write(JSON.stringify(ev) + '\n');
        continue;
      }

      if (isConversationMessage(ev) && ev.type === 'assistant') {
        const text = textFromContentBlocks((ev as any).message?.content);
        fullResponse += text;
        if (!isJson) process.stdout.write(text);
      }
    }

    if (isJson) {
      process.stdout.write(JSON.stringify({ response: fullResponse }) + '\n');
    } else {
      process.stdout.write('\n');
    }
  } catch (error) {
    if (outputFormat === 'json' || outputFormat === 'stream-json') {
      process.stdout.write(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }) + '\n');
    } else {
      console.error('Error:', error instanceof Error ? error.message : String(error));
    }
    process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
  }
}

// ============================================
// Output Formatting
// ============================================

const Colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function formatToolCall(name: string, input: any): string {
  let inputStr = '';
  try {
    inputStr = JSON.stringify(input, null, 2);
  } catch {
    inputStr = String(input);
  }
  // Indent input for better readability
  const indentedInput = inputStr.split('\n').map(line => '  ' + line).join('\n');
  
  return `\n${Colors.yellow}🔨 ${Colors.bold}${name}${Colors.reset}\n${Colors.dim}${indentedInput}${Colors.reset}\n`;
}

function formatToolResult(content: any): string {
  if (typeof content === 'string') {
    return `\n${Colors.dim}Result: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}${Colors.reset}\n`;
  }
  return `\n${Colors.dim}Result: [Complex Data]${Colors.reset}\n`;
}

interface InteractiveModeOptions {
  initialPrompt?: string;
  debug: boolean;
  verbose: boolean;
  shouldContinue: boolean;
  resume?: string;
  sessionId?: string;
  agentId?: string;
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

  // Handle session continuation logic
  if (shouldContinue || resume) {
    // console.log('Session continuation...');
    // Load previous session messages logic would go here
  }

  // 1) Initialize AppState
  let appState = createDefaultAppState();
  appState.verbose = Boolean(options.verbose);
  if (options.model) {
    (appState as any).mainLoopModel = options.model;
    (appState as any).mainLoopModelForSession = options.model;
  }

  const readFileState = new Map<string, any>();
  const abortController = new AbortController();

  // Initialize sandbox (if enabled)
  if (sandboxManager.isSandboxingEnabled()) {
    try {
      await initializeSandboxIfEnabled();
    } catch (err) {
      process.stderr.write(
        `\n❌ Sandbox Error: ${err instanceof Error ? err.message : String(err)}\n`
      );
      process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
    }
  }

  const getAppState = async () => appState;
  const setAppState = (updater: (s: any) => any) => {
    appState = updater(appState);
  };

  // Initialize MCP and update AppState
  if (!getMcpState().initialized) {
    await initializeMcp(process.cwd());
  }
  
  // Connect any additional servers from options
  if (options.mcpServers && Object.keys(options.mcpServers).length > 0) {
    for (const [name, config] of Object.entries(options.mcpServers)) {
      try {
        await connectMcpServer(name, config as StateMcpServerConfig);
      } catch (err) {
        console.error(`Failed to connect to MCP server ${name}:`, err);
      }
    }
  }
  
  // Sync MCP state to AppState
  const mcpState = getMcpState();
  (appState as any).mcp = {
    clients: mcpState.clients,
    tools: mcpState.tools,
    resources: mcpState.resources,
    initialized: mcpState.initialized
  };

  const tools = adaptToolsForCore({
    allowedTools: options.allowedTools,
    disallowedTools: options.disallowedTools,
    getAppState,
    setAppState,
    readFileState,
    agentId: options.agentId,
    sessionId: options.sessionId,
    abortController,
  });

  const conversation: ConversationMessage[] = [];
  if (initialPrompt) {
    conversation.push(
      createCoreUserMessage({ content: initialPrompt.trim() }) as unknown as ConversationMessage
    );
  }

  console.log('Claude Code v' + CLI_CONSTANTS.VERSION);

  // Launch Ink Renderer
  const { waitUntilExit } = render(
    React.createElement(InternalApp, {
      terminalColumns: process.stdout.columns || 80,
      terminalRows: process.stdout.rows || 24,
      ink2: false, // Ink internal instance if needed
      stdin: process.stdin,
      stdout: process.stdout,
      exitOnCtrlC: true,
      initialTheme: (appState as any).theme,
      onExit: (err) => {
        if (err) console.error(err);
      }
    }, React.createElement(InteractiveSession, {
      initialMessages: conversation,
      tools,
      systemPrompt: options.systemPrompt || options.appendSystemPrompt || '',
      userContext: undefined,
      getAppState,
      setAppState,
      readFileState,
      abortController,
      mcpClients: (appState as any).mcp?.clients,
      agentDefinitions: (appState as any).agentDefinitions,
      model: options.model || 'claude-3-5-sonnet-20241022'
    }))
  );

  await waitUntilExit();
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

// NOTE: 以上符号已在定义处 `export`，避免重复导出。
