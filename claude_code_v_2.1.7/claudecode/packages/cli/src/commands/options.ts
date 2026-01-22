/**
 * @claudecode/cli - Option Parsing
 *
 * CLI option definitions and parsing utilities.
 * Reconstructed from chunks.157.mjs
 */

import type {
  CLIOptions,
  ParsedCLIArgs,
  PermissionMode,
  OutputFormat,
  InputFormat,
} from '../types.js';
import { CLI_CONSTANTS } from '../types.js';

// ============================================
// Option Definitions
// ============================================

/**
 * CLI option definition.
 */
export interface OptionDefinition {
  flags: string;
  description: string;
  defaultValue?: unknown;
  choices?: string[];
  parser?: (value: string, previous?: unknown) => unknown;
  hidden?: boolean;
  required?: boolean;
  conflicts?: string[];
  implies?: string[];
}

/**
 * All CLI option definitions.
 * Reconstructed from chunks.157.mjs:15-190
 */
export const CLI_OPTIONS: Record<string, OptionDefinition> = {
  // ---- Debug & Output ----
  debug: {
    flags: '-d, --debug [filter]',
    description: 'Enable debug mode with optional category filtering (e.g., "api,hooks")',
    parser: (value) => value === '' ? true : value,
  },
  debugToStderr: {
    flags: '-d2e, --debug-to-stderr',
    description: 'Enable debug mode (to stderr)',
    hidden: true,
  },
  verbose: {
    flags: '--verbose',
    description: 'Override verbose mode setting from config',
  },
  mcpDebug: {
    flags: '--mcp-debug',
    description: '[DEPRECATED] Enable MCP debug mode',
  },

  // ---- Input/Output Mode ----
  print: {
    flags: '-p, --print',
    description: 'Print response and exit (non-interactive mode)',
  },
  outputFormat: {
    flags: '--output-format <format>',
    description: 'Output format (only works with --print): "text" (default), "json", or "stream-json"',
    choices: ['text', 'json', 'stream-json'],
    defaultValue: 'text',
  },
  jsonSchema: {
    flags: '--json-schema <schema>',
    description: 'JSON Schema for structured output validation',
  },
  inputFormat: {
    flags: '--input-format <format>',
    description: 'Input format (only works with --print): "text" (default), or "stream-json"',
    choices: ['text', 'stream-json'],
    defaultValue: 'text',
  },
  includePartialMessages: {
    flags: '--include-partial-messages',
    description: 'Include partial streaming messages in output (works with --print and --output-format=stream-json)',
  },
  replayUserMessages: {
    flags: '--replay-user-messages',
    description: 'Re-emit user messages from stdin back on stdout for acknowledgment',
  },
  outputFile: {
    flags: '-o, --output-file <path>',
    description: 'Write final output to file',
  },
  readStdin: {
    flags: '--read-stdin',
    description: 'Read from stdin',
  },

  // ---- Session Management ----
  continue: {
    flags: '-c, --continue',
    description: 'Continue most recent conversation',
    conflicts: ['resume', 'fork', 'teleport'],
  },
  resume: {
    flags: '-r, --resume [value]',
    description: 'Resume a conversation by session ID, or open interactive picker',
    conflicts: ['continue', 'fork', 'teleport'],
  },
  forkSession: {
    flags: '--fork-session',
    description: 'When resuming, create a new session ID instead of reusing the original',
  },
  noSessionPersistence: {
    flags: '--no-session-persistence',
    description: 'Disable session persistence (only works with --print)',
  },
  resumeSessionAt: {
    flags: '--resume-session-at <message-id>',
    description: 'When resuming, only messages up to specified message ID',
    hidden: true,
  },
  rewindFiles: {
    flags: '--rewind-files <user-message-id>',
    description: 'Restore files to state at the specified user message and exit',
    hidden: true,
  },
  teleport: {
    flags: '--teleport [session]',
    description: 'Teleport to a remote session',
    hidden: true,
  },
  remote: {
    flags: '--remote <description>',
    description: 'Create a remote session with the given description',
    hidden: true,
  },
  sessionId: {
    flags: '--session-id <uuid>',
    description: 'Use a specific session ID (must be a valid UUID)',
  },

  // ---- Model & Agent ----
  model: {
    flags: '-m, --model <model>',
    description: 'Model to use (sonnet, opus, haiku, or model ID)',
  },
  agent: {
    flags: '--agent <agent>',
    description: 'Agent for the current session. Overrides the "agent" setting.',
  },
  fallbackModel: {
    flags: '--fallback-model <model>',
    description: 'Fallback model for overloaded primary (only works with --print)',
  },
  maxThinkingTokens: {
    flags: '--max-thinking-tokens <tokens>',
    description: 'Maximum number of thinking tokens (only works with --print)',
    hidden: true,
  },
  maxTurns: {
    flags: '--max-turns <turns>',
    description: 'Maximum number of agentic turns in non-interactive mode',
  },
  maxBudgetUsd: {
    flags: '--max-budget-usd <amount>',
    description: 'Maximum dollar amount to spend on API calls (only works with --print)',
  },
  permissionMode: {
    flags: '--permission-mode <mode>',
    description: 'Permission mode to use for the session',
  },
  dangerouslySkipPermissions: {
    flags: '--dangerously-skip-permissions',
    description: 'Bypass all permission checks',
  },
  allowDangerouslySkipPermissions: {
    flags: '--allow-dangerously-skip-permissions',
    description: 'Enable bypassing all permission checks as an option',
  },

  // ---- System Prompts ----
  systemPrompt: {
    flags: '-s, --system-prompt <prompt>',
    description: 'Custom system prompt (replaces default)',
  },
  systemPromptFile: {
    flags: '--system-prompt-file <file>',
    description: 'Read system prompt from file',
    hidden: true,
  },
  appendSystemPrompt: {
    flags: '-a, --append-system-prompt <prompt>',
    description: 'Append to system prompt',
  },
  appendSystemPromptFile: {
    flags: '--append-system-prompt-file <file>',
    description: 'Append system prompt from file',
    hidden: true,
  },

  // ---- Tool Configuration ----
  tools: {
    flags: '--tools <tools...>',
    description: 'Specify the list of available tools',
  },
  allowedTools: {
    flags: '--allowed-tools <tools...>',
    description: 'Tools to allow (comma-separated)',
  },
  disallowedTools: {
    flags: '--disallowed-tools <tools...>',
    description: 'Tools to disallow (comma-separated)',
  },
  addDir: {
    flags: '--add-dir <directories...>',
    description: 'Additional directories to allow tool access to',
  },
  cwd: {
    flags: '--cwd <path>',
    description: 'Working directory',
  },

  // ---- MCP Configuration ----
  mcpConfig: {
    flags: '--mcp-config <configs...>',
    description: 'Load MCP servers from JSON files or strings',
  },
  strictMcpConfig: {
    flags: '--strict-mcp-config',
    description: 'Only use MCP servers from --mcp-config',
  },

  // ---- Chrome Integration ----
  chrome: {
    flags: '--chrome',
    description: 'Enable Claude in Chrome integration',
  },
  noChrome: {
    flags: '--no-chrome',
    description: 'Disable Claude in Chrome integration',
  },

  // ---- Advanced ----
  settings: {
    flags: '--settings <file-or-json>',
    description: 'Additional settings JSON file or string',
  },
  settingSources: {
    flags: '--setting-sources <sources>',
    description: 'Setting sources to load (user, project, local)',
  },
  pluginDir: {
    flags: '--plugin-dir <paths...>',
    description: 'Load plugins from directories',
  },
  disableSlashCommands: {
    flags: '--disable-slash-commands',
    description: 'Disable all skills',
  },
  autoConnectIde: {
    flags: '--ide',
    description: 'Automatically connect to IDE on startup',
  },
  loopy: {
    flags: '--loopy [interval]',
    description: 'Enable loopy mode (autonomous agent)',
    hidden: true,
  },
  enableAuthStatus: {
    flags: '--enable-auth-status',
    description: 'Enable auth status messages in SDK mode',
    hidden: true,
  },
};

// ============================================
// Option Parsing
// ============================================

/**
 * Parse CLI arguments to options object.
 * This is a simplified parser - the real implementation uses Commander.js
 */
export function parseOptions(args: string[]): ParsedCLIArgs {
  const options: ParsedCLIArgs = {};
  let positionalPrompt: string | undefined;
  const remainingArgs: string[] = [];

  let i = 0;
  while (i < args.length) {
    const arg = args[i]!;
    const nextArg = args[i + 1];

    // Handle -- separator (everything after is positional)
    if (arg === '--') {
      remainingArgs.push(...args.slice(i + 1));
      break;
    }

    // Handle long options
    if (arg.startsWith('--')) {
      const [key, value] = parseOption(arg, nextArg);
      if (key) {
        (options as any)[key] = value;
        if (value !== true && nextArg && !nextArg.startsWith('-')) {
          i++; // Skip value
        }
      }
      i++;
      continue;
    }

    // Handle short options
    if (arg.startsWith('-') && arg.length > 1) {
      const [key, value] = parseShortOption(arg, nextArg);
      if (key) {
        (options as any)[key] = value;
        if (value !== true && nextArg && !nextArg.startsWith('-')) {
          i++; // Skip value
        }
      }
      i++;
      continue;
    }

    // Positional argument (prompt)
    if (!positionalPrompt) {
      positionalPrompt = arg;
    } else {
      remainingArgs.push(arg);
    }
    i++;
  }

  if (positionalPrompt) {
    options.prompt = positionalPrompt;
  }
  if (remainingArgs.length > 0) {
    options.args = remainingArgs;
  }

  return options;
}

/**
 * Parse long option (--flag or --flag=value).
 */
function parseOption(arg: string, nextArg?: string): [string | null, unknown] {
  const withoutPrefix = arg.slice(2);

  // Handle --flag=value
  if (withoutPrefix.includes('=')) {
    const parts = withoutPrefix.split('=');
    const flag = parts[0]!;
    const value = parts.slice(1).join('=');
    const key = camelCase(flag);
    const def = findOptionByFlag(flag);
    return [key, def?.parser ? def.parser(value) : value];
  }

  // Handle boolean or value option
  const key = camelCase(withoutPrefix);
  const def = findOptionByFlag(withoutPrefix);

  // If next arg exists and doesn't start with -, use as value
  if (nextArg && !nextArg.startsWith('-') && def && !isBooleanOption(def)) {
    return [key, def.parser ? def.parser(nextArg) : nextArg];
  }

  // Boolean flag
  return [key, true];
}

/**
 * Parse short option (-f or -f value).
 */
function parseShortOption(arg: string, nextArg?: string): [string | null, unknown] {
  const flag = arg.slice(1);

  // Map short flags to long names
  const shortMap: Record<string, string> = {
    'd': 'debug',
    'p': 'print',
    'c': 'continue',
    'r': 'resume',
    'm': 'model',
    's': 'systemPrompt',
    'a': 'appendSystemPrompt',
    'o': 'outputFile',
    'h': 'help',
    'v': 'version',
  };

  const longFlag = shortMap[flag];
  if (!longFlag) {
    return [null, null];
  }

  const def = CLI_OPTIONS[longFlag];

  // If next arg exists and doesn't start with -, use as value
  if (nextArg && !nextArg.startsWith('-') && def && !isBooleanOption(def)) {
    return [longFlag, def.parser ? def.parser(nextArg) : nextArg];
  }

  return [longFlag, true];
}

/**
 * Find option definition by flag name.
 */
function findOptionByFlag(flag: string): OptionDefinition | undefined {
  const key = camelCase(flag);
  return CLI_OPTIONS[key];
}

/**
 * Check if option is boolean type.
 */
function isBooleanOption(def: OptionDefinition): boolean {
  // Boolean if no choices and no parser that expects value
  return !def.choices && !def.parser;
}

/**
 * Convert kebab-case to camelCase.
 */
function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ============================================
// Validation
// ============================================

/**
 * Validate parsed options.
 */
export function validateOptions(options: ParsedCLIArgs): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check conflicts
  for (const [key, def] of Object.entries(CLI_OPTIONS)) {
    if ((options as any)[key] && def.conflicts) {
      for (const conflict of def.conflicts) {
        if ((options as any)[conflict]) {
          errors.push(`Options --${kebabCase(key)} and --${kebabCase(conflict)} cannot be used together`);
        }
      }
    }
  }

  // Check required options
  for (const [key, def] of Object.entries(CLI_OPTIONS)) {
    if (def.required && !(options as any)[key]) {
      errors.push(`Option --${kebabCase(key)} is required`);
    }
  }

  // Check choice values
  for (const [key, def] of Object.entries(CLI_OPTIONS)) {
    const value = (options as any)[key];
    if (value && def.choices && !def.choices.includes(value)) {
      errors.push(`Invalid value "${value}" for --${kebabCase(key)}. Must be one of: ${def.choices.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Convert camelCase to kebab-case.
 */
function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
