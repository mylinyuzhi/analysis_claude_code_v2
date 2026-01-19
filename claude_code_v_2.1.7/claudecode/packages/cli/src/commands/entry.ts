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
  getLocalSettingsPath,
  getProjectSettingsPath,
} from '../settings/loader.js';
import { initializeMcp, resetMcpState } from '../mcp/state.js';
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

  // Apply sandbox settings/config (if present)
  applySandboxFromSettings(settings);

  // Ensure Claude home directory exists
  const fs = require('fs');
  const homeDir = getClaudeHomeDir();
  if (!fs.existsSync(homeDir)) {
    fs.mkdirSync(homeDir, { recursive: true });
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
    (event as any).type !== 'progress' && (event as any).type !== 'tombstone' && (event as any).type !== 'stream_request_start';
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

  // Handle session continuation
  if (shouldContinue || resume) {
    console.log('Session continuation...');
    // Load previous session messages
    // This would use the session management system
  }

  // Start the interactive REPL
  // Bundled runtime uses Ink; here we keep a minimal stdin loop but复用 coreMessageLoop 逻辑。
  console.log('Claude Code v' + CLI_CONSTANTS.VERSION);
  console.log('交互模式启动。输入问题，或用 /help 查看命令。');

  // 1) 初始化运行态状态（非 React，供 toolUseContext / tools 使用）
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

  const canUseTool = async (tool: { name: string }) => {
    const denied = resolveDisallowedToolSet(options.disallowedTools);
    const allowed = resolveAllowedToolSet(options.allowedTools);
    if (denied.has(tool.name)) return false;
    if (allowed && !allowed.has(tool.name)) return false;
    return true;
  };

  async function runOneTurn(
    userMessages: Array<{ role: 'user' | 'system'; content: string | any[]; isMeta?: boolean }>
  ): Promise<void> {
    for (const m of userMessages) {
      conversation.push(
        createCoreUserMessage({
          content: Array.isArray(m.content) ? (m.content as any) : m.content,
          isMeta: Boolean(m.isMeta) || m.role === 'system',
        }) as any
      );
    }

    for await (const ev of coreMessageLoop({
      messages: conversation,
      systemPrompt: options.systemPrompt || options.appendSystemPrompt || '',
      userContext: undefined,
      systemContext: undefined,
      canUseTool: async (tool, _input, _assistantMessage) => canUseTool(tool),
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
      if (ev && typeof ev === 'object' && (ev as any).type === 'progress') {
        continue;
      }
      if (ev && typeof ev === 'object' && (ev as any).type === 'tombstone') {
        continue;
      }
      if (ev && typeof ev === 'object' && (ev as any).type === 'stream_request_start') {
        continue;
      }
      if (!isConversationMessage(ev as any)) continue;

      // 持久化消息（用于后续 turn 上下文）
      conversation.push(ev as any);

      // 最小输出：assistant 文本 + tool_use/tool_result + error attachment
      if ((ev as any).type === 'assistant') {
        const content = (ev as any).message?.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block?.type === 'text') {
              process.stdout.write(String(block.text ?? ''));
            } else if (block?.type === 'tool_use') {
              const toolName = String(block.name ?? 'unknown');
              // 交互 UI 中会有更丰富渲染，这里给出可读的文本占位。
              process.stderr.write(`\n[工具调用] ${toolName}\n`);
              if (block.input !== undefined) {
                try {
                  process.stderr.write(JSON.stringify(block.input) + '\n');
                } catch {
                  process.stderr.write(String(block.input) + '\n');
                }
              }
            }
          }
        }
      } else if ((ev as any).type === 'user') {
        const content = (ev as any).message?.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block?.type === 'tool_result') {
              const c = block.content;
              if (typeof c === 'string') {
                process.stdout.write(String(c));
                if (!String(c).endsWith('\n')) process.stdout.write('\n');
              } else {
                const t = textFromContentBlocks(c);
                if (t) process.stdout.write(t + (t.endsWith('\n') ? '' : '\n'));
              }
            }
          }
        }
      } else if ((ev as any).type === 'attachment') {
        const att = (ev as any).attachment;
        if (att?.type === 'error' && att?.content) {
          process.stderr.write(String(att.content) + '\n');
        }
      }
    }

    process.stdout.write('\n');
  }

  // Handle session continuation (占位，保持与 source 入口结构一致)
  if (shouldContinue || resume) {
    console.log('Session continuation...');
  }

  // 2) REPL
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  async function handleInput(trimmed: string): Promise<void> {
    const registry = getCommandRegistry();
    const commands = registry.getAll();

    // Special-case: /compact [custom instructions]
    // In the bundled runtime, /compact is a local command that mutates the session message history.
    // Our CLI is not Ink-based, so we apply the compaction here and replace `conversation`.
    if (trimmed === '/compact' || trimmed.startsWith('/compact ')) {
      const customInstructions = trimmed.slice('/compact'.length).trim() || undefined;
      if (conversation.length === 0) {
        process.stdout.write('Cannot compact: no messages yet.\n');
        return;
      }

      const compactContext = {
        agentId: options.agentId,
        getAppState,
        setAppState,
        abortController,
        readFileState,
        options: {
          mainLoopModel: options.model,
          isNonInteractiveSession: false,
          appendSystemPrompt: options.appendSystemPrompt || options.systemPrompt || '',
          agentDefinitions: (appState as any).agentDefinitions,
        },
      };

      const result = await compactFeature.manualCompact(
        conversation as any,
        compactContext as any,
        customInstructions
      );

      // Replace conversation history with compacted boundary + summary messages.
      // NOTE: `attachments` / `hookResults` are typed as non-message structures in this reconstruction,
      // so we keep the minimal canonical history that the core loop understands.
      conversation.length = 0;
      conversation.push(result.boundaryMarker as any, ...(result.summaryMessages as any));

      if (result.userDisplayMessage) {
        process.stdout.write(String(result.userDisplayMessage).trimEnd() + '\n');
      }
      process.stdout.write('Conversation compacted.\n');
      return;
    }

    if (trimmed.startsWith('/')) {
      const result = await parseSlashCommandInput(trimmed, {
        options: {
          commands,
          isNonInteractiveSession: false,
          model: options.model,
        },
        messages: [],
        abortController,
        cwd: process.cwd(),
      });

      if (!result.shouldQuery) {
        // local/local-jsx: 直接打印输出消息
        for (const msg of result.messages) {
          if (!msg?.content) continue;
          if (Array.isArray(msg.content)) {
            const text = msg.content
              .map((b: any) => (b && b.type === 'text' ? String(b.text ?? '') : ''))
              .join('');
            if (text) process.stdout.write(text + '\n');
          } else {
            process.stdout.write(String(msg.content) + '\n');
          }
        }
        return;
      }

      await runOneTurn(
        result.messages.map((m) => ({
          role: m.role as any,
          content: Array.isArray(m.content) ? (m.content as any) : String(m.content ?? ''),
          isMeta: Boolean((m as any).isMeta),
        }))
      );
      return;
    }

    await runOneTurn([{ role: 'user', content: trimmed }]);
  }

  if (initialPrompt) {
    await handleInput(initialPrompt.trim());
  }

  rl.prompt();
  rl.on('line', async (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }
    try {
      await handleInput(trimmed);
    } finally {
      rl.prompt();
    }
  });

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });

  await new Promise(() => {});
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

// NOTE: 以上符号已在定义处 `export`，避免重复导出。
