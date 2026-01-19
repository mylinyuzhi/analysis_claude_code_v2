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
    description: 'Output format',
    choices: ['text', 'json', 'stream-json'],
    defaultValue: 'text',
  },
  inputFormat: {
    flags: '--input-format <format>',
    description: 'Input format',
    choices: ['text', 'stream-json'],
    defaultValue: 'text',
  },
  includePartialMessages: {
    flags: '--include-partial-messages',
    description: 'Include partial streaming messages in output',
    implies: ['print'],
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
  continueRecent: {
    flags: '-cr, --continue-recent',
    description: 'Continue most recent conversation, skip if none exists',
    hidden: true,
    conflicts: ['resume', 'fork', 'teleport'],
  },
  resume: {
    flags: '-r, --resume <session>',
    description: 'Resume a specific session by ID',
    conflicts: ['continue', 'fork', 'teleport'],
  },
  fork: {
    flags: '--fork <session>',
    description: 'Fork a session (create new from existing)',
    conflicts: ['continue', 'resume', 'teleport'],
  },
  teleport: {
    flags: '--teleport <session>',
    description: 'Teleport to a remote session',
    conflicts: ['continue', 'resume', 'fork'],
    hidden: true,
  },
  remote: {
    flags: '--remote',
    description: 'Enable remote session features',
    hidden: true,
  },
  sessionId: {
    flags: '--session-id <id>',
    description: 'Set specific session ID',
    hidden: true,
  },

  // ---- Model & Agent ----
  model: {
    flags: '-m, --model <model>',
    description: 'Model to use (sonnet, opus, haiku, or model ID)',
  },
  fallbackModel: {
    flags: '--fallback-model <model>',
    description: 'Fallback model for overloaded primary',
    hidden: true,
  },
  agentId: {
    flags: '--agent-id <id>',
    description: 'Agent identifier for subagent mode',
    hidden: true,
  },
  addToTodo: {
    flags: '--add-to-todo',
    description: 'Add prompt to todo list instead of executing',
    hidden: true,
  },
  permission: {
    flags: '--permission <mode>',
    description: 'Permission mode',
    choices: ['default', 'plan', 'plan-force', 'bypassPermissions', 'acceptEdits'],
    hidden: true,
  },

  // ---- System Prompts ----
  systemPrompt: {
    flags: '-s, --system-prompt <prompt>',
    description: 'Custom system prompt (replaces default)',
    conflicts: ['appendSystemPrompt'],
  },
  appendSystemPrompt: {
    flags: '-a, --append-system-prompt <prompt>',
    description: 'Append to system prompt',
    conflicts: ['systemPrompt'],
  },
  systemPromptFile: {
    flags: '--system-prompt-file <path>',
    description: 'Read system prompt from file',
    conflicts: ['systemPrompt', 'appendSystemPromptFile'],
  },
  appendSystemPromptFile: {
    flags: '--append-system-prompt-file <path>',
    description: 'Append system prompt from file',
    conflicts: ['systemPromptFile', 'appendSystemPrompt'],
  },

  // ---- Tool Configuration ----
  allowedTools: {
    flags: '--allowed-tools <tools...>',
    description: 'Tools to allow (comma-separated)',
    parser: (value) => value.split(',').map((t) => t.trim()),
  },
  disallowedTools: {
    flags: '--disallowed-tools <tools...>',
    description: 'Tools to disallow (comma-separated)',
    parser: (value) => value.split(',').map((t) => t.trim()),
  },
  additionalDirectories: {
    flags: '--additional-directories <dirs...>',
    description: 'Additional directories to allow',
    parser: (value) => value.split(',').map((d) => d.trim()),
  },
  cwd: {
    flags: '--cwd <path>',
    description: 'Working directory',
  },

  // ---- MCP Configuration ----
  mcpConfig: {
    flags: '--mcp-config <path>',
    description: 'MCP config file path',
  },
  mcpConfigJson: {
    flags: '--mcp-config-json <json>',
    description: 'MCP config as JSON string',
  },
  mcpStrictTransportMode: {
    flags: '--mcp-strict-transport-mode',
    description: 'Enforce MCP transport mode',
    hidden: true,
  },
  allowMcpPromptAccess: {
    flags: '--allow-mcp-prompt-access',
    description: 'Allow MCP servers to access prompts',
    hidden: true,
  },

  // ---- Chrome Integration ----
  autoConnectChrome: {
    flags: '--auto-connect-chrome',
    description: 'Auto-connect to Chrome extension',
  },
  installChrome: {
    flags: '--install-chrome',
    description: 'Install Chrome extension native host',
  },

  // ---- Advanced ----
  maxBudget: {
    flags: '--max-budget <amount>',
    description: 'Maximum API cost budget',
    parser: (value) => parseFloat(value),
  },
  maxTurns: {
    flags: '--max-turns <count>',
    description: 'Maximum conversation turns',
    parser: (value) => parseInt(value, 10),
  },
  maxConversationTurns: {
    flags: '--max-conversation-turns <count>',
    description: 'Maximum total conversation turns',
    parser: (value) => parseInt(value, 10),
    hidden: true,
  },
  jsonOutputSchema: {
    flags: '--json-output-schema <schema>',
    description: 'JSON schema for structured output',
    hidden: true,
  },
  plugins: {
    flags: '--plugins <path>',
    description: 'Plugin directory path',
    hidden: true,
  },
  autoConnectIde: {
    flags: '--auto-connect-ide',
    description: 'Auto-connect to IDE',
  },
  installIdeExtension: {
    flags: '--install-ide-extension <ide>',
    description: 'Install IDE extension (vscode, cursor, windsurf)',
  },
  skipInstallIdeExtension: {
    flags: '--skip-install-ide-extension',
    description: 'Skip IDE extension installation',
  },
  noAutoUpdater: {
    flags: '--no-auto-updater',
    description: 'Disable auto-updater',
  },
  useBedrock: {
    flags: '--use-bedrock',
    description: 'Use AWS Bedrock as provider',
  },
  useVertex: {
    flags: '--use-vertex',
    description: 'Use Google Vertex AI as provider',
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

// ============================================
// Export
// ============================================

// NOTE: 以上符号已在定义处 `export`，避免重复导出。
