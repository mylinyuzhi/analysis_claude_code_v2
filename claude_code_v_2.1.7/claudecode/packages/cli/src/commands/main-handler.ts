/**
 * @claudecode/cli - Main Handler
 *
 * Implementation of the main command handler (interactive and print modes).
 * Reconstructed from chunks.157.mjs:1-791
 */

import React from 'react';
import { render } from 'ink';
import { InteractiveSession } from '../components/InteractiveSession.js';
import { InternalApp } from '@claudecode/ui';
import type {
  ExecutionMode,
  ExecutionContext,
} from '../types.js';
import { CLI_CONSTANTS } from '../types.js';
import { parseOptions, validateOptions } from './options.js';
import {
  loadAllSettings,
  getClaudeHomeDir,
  applySafeEnvVars,
  configureGlobalMTLS,
  configureGlobalAgents,
} from '../settings/loader.js';
import {
  initializeMcp,
  resetMcpState,
  getMcpState,
  connectMcpServer,
  getToolSearchMode
} from '../mcp/state.js';
import type { McpServerConfig as StateMcpServerConfig } from '@claudecode/integrations';
import {
  getCommandRegistry,
  parseSlashCommandInput,
} from '@claudecode/features/slash-commands';
import { coreMessageLoop, type LoopEvent } from '@claudecode/core/agent-loop';
import {
  createUserMessage as createCoreUserMessage,
  type ConversationMessage,
} from '@claudecode/core/message';
import { createDefaultAppState, createDefaultPermissionContext } from '@claudecode/core/state';
import { builtinTools as builtinToolImpls } from '@claudecode/tools';
import {
  generateNewSessionId,
  getSessionId,
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
// Main Command Handler
// ============================================

/**
 * Handle main command (interactive or print mode).
 * Original: J_7 (commandHandler) in chunks.157.mjs
 */
export async function handleMainCommand(): Promise<void> {
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

async function runPreActionHook(): Promise<void> {
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
export async function initializeConfig(): Promise<void> {
  const { telemetryMarker } = await import('@claudecode/platform');
  const startTime = Date.now();
  
  logInfo("init_started");
  telemetryMarker('init_function_start');

  try {
    // Phase 1: Enable configs
    let q = Date.now();
    enableConfigs(); // nOA
    logInfo("init_configs_enabled", { duration_ms: Date.now() - q });
    telemetryMarker('init_configs_enabled');

    // Phase 2: Apply safe environment variables
    let b = Date.now();
    applySafeEnvVars(); // KI9
    logInfo("init_safe_env_vars_applied", { duration_ms: Date.now() - b });
    telemetryMarker('init_safe_env_vars_applied');

    // Phase 3: Initialize detectors
    let g = Date.now();
    await initializeSettingsDetector(); // HC.initialize()
    logInfo("init_settings_detector_initialized", { duration_ms: Date.now() - g });
    telemetryMarker('init_settings_detector_initialized');

    await initializeSkillDetector(); // k$1.initialize()
    telemetryMarker('init_skill_detector_initialized');

    // Phase 4: Setup graceful shutdown
    setupGracefulShutdown(); // LZ2
    telemetryMarker('init_after_graceful_shutdown');

    // Phase 5: Initialize 1P event logging
    initializeEventLogging(); // IKB
    telemetryMarker('init_after_1p_event_logging');

    // Phase 6: Populate OAuth
    await populateOAuth(); // jEQ
    telemetryMarker('init_after_oauth_populate');

    // Phase 7: Remote settings check
    if (shouldFetchRemoteSettings()) { // iH0()
      await initFetchRemoteSettings(); // FL2()
    }
    telemetryMarker('init_after_remote_settings_check');

    // Phase 8: First launch initialization
    initializeFirstLaunchTime(); // B2B()

    // Phase 9: Configure global mTLS
    let z = Date.now();
    logDebug("[init] configureGlobalMTLS starting");
    configureGlobalMTLS(); // btQ()
    logInfo("init_mtls_configured", { duration_ms: Date.now() - z });
    logDebug("[init] configureGlobalMTLS complete");

    // Phase 10: Configure global agents/proxy
    let y = Date.now();
    logDebug("[init] configureGlobalAgents starting");
    configureGlobalAgents(); // mtQ()
    logInfo("init_proxy_configured", { duration_ms: Date.now() - y });
    logDebug("[init] configureGlobalAgents complete");
    telemetryMarker('init_network_configured');

    // Phase 11: Windows shell config
    configureWindowsShell(); // F7Q()
    
    // Phase 12: Register shutdown hooks
    registerShutdownHook(shutdownLspManager); // C6(Sy2)

    // Phase 13: MCP initialization
    if (isMcpCliMode()) { // jJ()
      process.env.CLAUDE_CODE_SESSION_ID = getSessionId() || generateNewSessionId();
      registerMcpCliCleanup(); // AX9()
    }

    // Phase 14: Scratchpad creation
    if (isScratchpadEnabled()) { // K$A()
      let j = Date.now();
      await initializeScratchpad(); // YX9()
      logInfo("init_scratchpad_created", { duration_ms: Date.now() - j });
    }

    logInfo("init_completed", { duration_ms: Date.now() - startTime });
    telemetryMarker('init_function_end');

  } catch (error) {
    if (error instanceof ConfigParseError) {
      return handleConfigError({ error });
    }
    throw error;
  }
}

function logInfo(event: string, metadata?: Record<string, unknown>): void {
  if (process.env.DEBUG) {
    console.error(`[INFO] ${event}`, metadata || '');
  }
}

function logDebug(message: string): void {
  if (process.env.DEBUG) {
    console.error(`[DEBUG] ${message}`);
  }
}

async function initializeSettingsDetector(): Promise<void> {
  const settingsDir = getClaudeHomeDir();
  if (!nodeFs.existsSync(settingsDir)) return;

  try {
    const { watch } = await import('chokidar');
    const watcher = watch(settingsDir, {
      persistent: true,
      ignoreInitial: true,
      depth: 0,
    });
    watcher.on('change', (filePath) => {
      if (filePath.endsWith('settings.json')) {
        logDebug(`Settings change detected: ${filePath}`);
      }
    });
    registerShutdownHook(async () => {
      await watcher.close();
    });
  } catch (err) {
    logDebug('chokidar not available, settings auto-reload disabled');
  }
}

async function initializeSkillDetector(): Promise<void> {
  const skillDirs = [
    nodePath.join(getClaudeHomeDir(), 'skills'),
    nodePath.join(process.cwd(), '.claude', 'skills'),
  ];

  try {
    const { watch } = await import('chokidar');
    const watcher = watch(skillDirs.filter(d => nodeFs.existsSync(d)), {
      persistent: true,
      ignoreInitial: true,
      depth: 1,
    });
    watcher.on('all', (event, filePath) => {
      logDebug(`Skill change detected: ${event} ${filePath}`);
    });
    registerShutdownHook(async () => {
      await watcher.close();
    });
  } catch (err) {
    logDebug('chokidar not available, skill auto-reload disabled');
  }
}

function shouldFetchRemoteSettings(): boolean {
  return process.env.CLAUDE_CODE_ENTERPRISE === 'true'; 
}

async function initFetchRemoteSettings(): Promise<void> {
  logDebug('Fetching remote settings...');
}

function initializeFirstLaunchTime(): void {
  const settings = (globalThis as any).__claudeSettings || {};
  if (!settings.firstLaunchTime) {
    logDebug('First launch detected');
  }
}

function configureWindowsShell(): void {
  if (process.platform === 'win32' && !process.env.SHELL) {
    const gitBashPath = process.env.CLAUDE_CODE_GIT_BASH_PATH || 'C:\\Program Files\\Git\\bin\\bash.exe';
    if (nodeFs.existsSync(gitBashPath)) {
      process.env.SHELL = gitBashPath;
      logDebug(`Using Git Bash: ${gitBashPath}`);
    }
  }
}

const shutdownHooks = new Set<() => Promise<void> | void>();
function registerShutdownHook(hook: () => Promise<void> | void): void {
  shutdownHooks.add(hook);
}

async function shutdownLspManager(): Promise<void> {
  logDebug('Shutting down LSP manager');
}

function isMcpCliMode(): boolean {
  return process.argv.includes('--mcp-cli') && getToolSearchMode() === 'mcp-cli';
}

function registerMcpCliCleanup(): void {
  registerShutdownHook(async () => {
    logDebug('Cleaning up MCP CLI session');
  });
}

function isScratchpadEnabled(): boolean {
  return process.env.CLAUDE_CODE_SCRATCHPAD === 'true';
}

async function initializeScratchpad(): Promise<void> {
  const sessionId = getSessionId() || generateNewSessionId();
  const scratchpadDir = nodePath.join(getClaudeHomeDir(), 'sessions', sessionId, 'scratchpad');
  if (!nodeFs.existsSync(scratchpadDir)) {
    nodeFs.mkdirSync(scratchpadDir, { recursive: true });
  }
  logDebug(`Scratchpad initialized at: ${scratchpadDir}`);
}

class ConfigParseError extends Error {
  constructor(public filePath: string, public defaultConfig: any) {
    super(`Failed to parse config at ${filePath}`);
    this.name = 'ConfigParseError';
  }
}

async function handleConfigError(options: { error: ConfigParseError }): Promise<void> {
  console.error(`\n❌ Configuration Error in ${options.error.filePath}`);
  console.error('Please fix the JSON or delete the file to reset to defaults.');
  process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
}

function enableConfigs(): void {
  const settings = loadAllSettings();
  (globalThis as any).__claudeSettings = settings;
  applySandboxFromSettings(settings);
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

function setupGracefulShutdown(): void {
  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(CLI_CONSTANTS.EXIT_CODES.INTERRUPTED);
  });
}

async function cleanup(): Promise<void> {
  resetMcpState();
  cleanupCursor();
}

function cleanupCursor(): void {
  const TERMINAL_RESET_SEQUENCE = '\x1B[?25h\x1B[0m';
  const ttyStream = process.stderr.isTTY
    ? process.stderr
    : process.stdout.isTTY
      ? process.stdout
      : undefined;

  ttyStream?.write(TERMINAL_RESET_SEQUENCE);
}

function initializeEventLogging(): void {
  telemetry.initializeStartupProfiling();
}

async function populateOAuth(): Promise<void> {
  try {
    await refreshOAuthTokenIfNeeded();
  } catch (error) {
    // Ignore
  }
}

async function runMigrations(): Promise<void> {
}

async function loadRemoteSettings(): Promise<void> {
}

function validateSessionId(id: string): string | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) ? id : null;
}

async function loadMcpConfig(configPath: string): Promise<Record<string, unknown>> {
  const { loadMcpConfigFile, parseMcpConfigJson } = await import('../settings/loader.js');
  try {
    return loadMcpConfigFile(configPath);
  } catch {
    try {
      return parseMcpConfigJson(configPath);
    } catch {
      console.warn(`Warning: Could not load MCP config from ${configPath}`);
      return {};
    }
  }
}

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

    if (process.stdin.isTTY) {
      clearTimeout(timeout);
      resolve(undefined);
    }
  });
}

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

function createInitialAppState(options: {
  verbose?: boolean;
  model?: string;
  toolPermissionContext: any;
  agent?: any;
  agentDefinitions: any;
  mcpClients: any[];
  mcpTools: any[];
  mcpCommands: string[];
  notifications?: any[];
  initialPrompt?: string;
}): any {
  const appState = createDefaultAppState();
  
  return {
    ...appState,
    verbose: options.verbose ?? appState.verbose,
    mainLoopModel: options.model || appState.mainLoopModel,
    mainLoopModelForSession: options.model || appState.mainLoopModelForSession,
    showExpandedIPAgents: false,
    selectedIPAgentIndex: 0,
    toolPermissionContext: options.toolPermissionContext,
    agent: options.agent?.agentType,
    agentDefinitions: options.agentDefinitions,
    mcp: {
      ...appState.mcp,
      clients: options.mcpClients,
      tools: options.mcpTools,
      commands: options.mcpCommands,
    },
    notifications: {
      current: null,
      queue: options.notifications || [],
    },
    elicitation: {
      queue: [],
    },
    thinkingEnabled: appState.thinkingEnabled,
    promptSuggestionEnabled: appState.promptSuggestionEnabled,
    speculation: appState.speculation,
    speculationSessionTimeSavedMs: 0,
    promptCoaching: {
      tip: null,
      shownAt: 0,
    },
    queuedCommands: [],
    linkedAttachments: [],
    workerPermissions: {
      queue: [],
      selectedIndex: 0,
    },
    workerSandboxPermissions: {
      queue: [],
      selectedIndex: 0,
    },
    gitDiff: {
      stats: null,
      perFileStats: new Map(),
      hunks: new Map(),
      lastUpdated: 0,
    },
    authVersion: 0,
    initialMessage: options.initialPrompt ? {
      message: createCoreUserMessage({
        content: String(options.initialPrompt)
      }) as any
    } : null,
    teamContext: undefined, 
  };
}

async function runPrintMode(options: PrintModeOptions): Promise<void> {
  const { prompt, outputFormat, verbose } = options;

  if (!prompt) {
    console.error('Error: A prompt is required in print mode');
    process.exit(CLI_CONSTANTS.EXIT_CODES.ERROR);
  }

  if (verbose) {
    console.error(`Processing prompt: ${prompt.substring(0, 100)}...`);
  }

  try {
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

    let stdinPrompt: string | null = null;
    if (!process.stdin.isTTY) {
      stdinPrompt = await new Promise<string>((resolve) => {
        let data = '';
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => resolve(data.trim()));
      });
    }

    if (!getMcpState().initialized) {
      await initializeMcp(process.cwd());
    }
    
    if (options.mcpServers && Object.keys(options.mcpServers).length > 0) {
      for (const [name, config] of Object.entries(options.mcpServers)) {
        try {
          await connectMcpServer(name, config as StateMcpServerConfig);
        } catch (err) {
          console.error(`Failed to connect to MCP server ${name}:`, err);
        }
      }
    }
    
    const mcpState = getMcpState();

    let appState = createInitialAppState({
      verbose: Boolean(options.verbose),
      model: options.model,
      toolPermissionContext: createDefaultPermissionContext(),
      agentDefinitions: { activeAgents: [], allAgents: [] },
      mcpClients: mcpState.clients,
      mcpTools: mcpState.tools,
      mcpCommands: mcpState.commands,
      initialPrompt: stdinPrompt || undefined,
    });

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

async function runInteractiveMode(options: InteractiveModeOptions): Promise<void> {
  const { initialPrompt, shouldContinue, resume, debug } = options;

  if (debug) {
    console.error('Starting interactive mode...');
  }

  if (shouldContinue || resume) {
    // Session continuation
  }

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

  if (!getMcpState().initialized) {
    await initializeMcp(process.cwd());
  }
  
  if (options.mcpServers && Object.keys(options.mcpServers).length > 0) {
    for (const [name, config] of Object.entries(options.mcpServers)) {
      try {
        await connectMcpServer(name, config as StateMcpServerConfig);
      } catch (err) {
        console.error(`Failed to connect to MCP server ${name}:`, err);
      }
    }
  }
  
  const mcpState = getMcpState();

  let appState = createInitialAppState({
    verbose: Boolean(options.verbose),
    model: options.model,
    toolPermissionContext: createDefaultPermissionContext(),
    agentDefinitions: { activeAgents: [], allAgents: [] },
    mcpClients: mcpState.clients,
    mcpTools: mcpState.tools,
    mcpCommands: mcpState.commands,
    initialPrompt: initialPrompt || undefined,
  });

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

  const { waitUntilExit } = render(
    React.createElement(InternalApp, {
      terminalColumns: process.stdout.columns || 80,
      terminalRows: process.stdout.rows || 24,
      ink2: false,
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
