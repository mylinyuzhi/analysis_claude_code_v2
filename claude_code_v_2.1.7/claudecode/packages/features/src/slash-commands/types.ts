/**
 * @claudecode/features - Slash Commands Types
 *
 * Type definitions for the slash command system.
 * Reconstructed from chunks.112.mjs, chunks.136.mjs, chunks.146.mjs
 */

// ============================================
// Command Types
// ============================================

/**
 * Command type determines execution behavior.
 * - local-jsx: Interactive React/Ink UI component
 * - local: Synchronous text output
 * - prompt: LLM invocation with custom prompt
 */
export type CommandType = 'local-jsx' | 'local' | 'prompt';

/**
 * Command context for execution.
 * - fork: Execute in separate agent (subagent)
 * - undefined: Execute in main conversation
 */
export type CommandContext = 'fork' | undefined;

/**
 * Display options for command output.
 */
export interface CommandDisplayOptions {
  display?: 'skip' | 'system' | 'default';
  shouldQuery?: boolean;
}

// ============================================
// Command Interfaces
// ============================================

/**
 * Base command interface.
 */
export interface BaseCommand {
  name: string;
  type: CommandType;
  description: string;
  aliases?: string[];
  argumentHint?: string;
  isEnabled: () => boolean;
  isHidden: boolean;
  supportsNonInteractive?: boolean;
  userFacingName: () => string;

  // Optional properties
  context?: CommandContext;
  allowedTools?: string[];
  model?: string;
  hooks?: CommandHooks;
  loadedFrom?: 'builtin' | 'skills' | 'plugin';
  userInvocable?: boolean;
  progressMessage?: string;
}

/**
 * Local command (synchronous text output).
 */
export interface LocalCommand extends BaseCommand {
  type: 'local';
  call: (args: string, context: CommandExecutionContext) => Promise<LocalCommandResult>;
}

/**
 * Local JSX command (interactive UI).
 */
export interface LocalJSXCommand extends BaseCommand {
  type: 'local-jsx';
  call: (
    onComplete: (output: string, displayOptions?: CommandDisplayOptions) => void,
    context: CommandExecutionContext,
    args: string
  ) => Promise<JSX.Element | null>;
}

/**
 * Prompt command (LLM invocation).
 */
export interface PromptCommand extends BaseCommand {
  type: 'prompt';
  getPromptForCommand: (args: string, context: CommandExecutionContext) => Promise<CommandContent[]>;
}

/**
 * Union type for all command types.
 */
export type SlashCommand = LocalCommand | LocalJSXCommand | PromptCommand;

// ============================================
// Command Results
// ============================================

/**
 * Local command result types.
 */
export type LocalCommandResult =
  | { type: 'skip' }
  | { type: 'compact'; compactionResult: CompactionResult }
  | { type: 'text'; value: string };

/**
 * Compaction result from /compact command.
 */
export interface CompactionResult {
  messagesToKeep: number;
  summary: string;
  tokensRemoved?: number;
}

/**
 * Command execution result.
 */
export interface CommandExecutionResult {
  messages: CommandMessage[];
  shouldQuery: boolean;
  command?: SlashCommand;
  allowedTools?: string[];
  maxThinkingTokens?: number;
  model?: string;
}

// ============================================
// Command Messages
// ============================================

/**
 * Command message (for transcript).
 */
export interface CommandMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | CommandContent[];
  isMeta?: boolean;
}

/**
 * Command content block.
 */
export type CommandContent =
  | { type: 'text'; text: string }
  | { type: 'image'; source: ImageSource }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string };

/**
 * Image source for content.
 */
export interface ImageSource {
  type: 'base64';
  media_type: string;
  data: string;
}

// ============================================
// Command Hooks
// ============================================

/**
 * Hooks that can be registered by commands.
 */
export interface CommandHooks {
  preToolCall?: HookDefinition;
  postToolCall?: HookDefinition;
  onError?: HookDefinition;
}

/**
 * Hook definition.
 */
export interface HookDefinition {
  type: 'bash' | 'javascript';
  command: string;
  timeout?: number;
}

// ============================================
// Execution Context
// ============================================

/**
 * Context passed to command execution.
 */
export interface CommandExecutionContext {
  options: CommandOptions;
  messages: CommandMessage[];
  abortController: AbortController;
  cwd: string;
  setAppState?: (updater: (state: unknown) => unknown) => void;
}

/**
 * Options within execution context.
 */
export interface CommandOptions {
  commands: SlashCommand[];
  isNonInteractiveSession: boolean;
  model?: string;
}

// ============================================
// Parsing Types
// ============================================

/**
 * Result of extractCommandParts.
 */
export interface ExtractedCommand {
  commandName: string;
  args: string;
  isMcp: boolean;
}

/**
 * Command classification type.
 */
export type CommandClassification = 'mcp' | 'custom' | string;

// ============================================
// Registry Types
// ============================================

/**
 * Command registry interface.
 */
export interface CommandRegistry {
  register(command: SlashCommand): void;
  unregister(name: string): boolean;
  get(name: string): SlashCommand | undefined;
  has(name: string): boolean;
  getAll(): SlashCommand[];
  getBuiltin(): SlashCommand[];
  getCustom(): SlashCommand[];
  getNames(): string[];
}

// ============================================
// Constants
// ============================================

export const COMMAND_CONSTANTS = {
  // Validation regex
  VALID_NAME_REGEX: /^[a-zA-Z0-9:\-_]+$/,
  INVALID_CHAR_REGEX: /[^a-zA-Z0-9:\-_]/,

  // MCP marker
  MCP_MARKER: '(MCP)',

  // Command tags
  COMMAND_NAME_TAG: 'command-name',
  COMMAND_MESSAGE_TAG: 'command-message',
  COMMAND_ARGS_TAG: 'command-args',
  STDOUT_TAG: 'local-command-stdout',
  STDERR_TAG: 'local-command-stderr',

  // Built-in command names
  BUILTIN_COMMANDS: [
    'help',
    'clear',
    'compact',
    'config',
    'context',
    'cost',
    'doctor',
    'feedback',
    'ide',
    'init',
    'login',
    'logout',
    'mcp',
    'memory',
    'model',
    'permissions',
    'plan',
    'plugin',
    'pr-comments',
    'release-notes',
    'rename',
    'resume',
    'review',
    'status',
    'tasks',
    'todos',
    'usage',
    'vim',
    'add-dir',
  ] as const,
} as const;

// ============================================
// Export
// ============================================

export type {
  CommandType,
  CommandContext,
  CommandDisplayOptions,
  BaseCommand,
  LocalCommand,
  LocalJSXCommand,
  PromptCommand,
  SlashCommand,
  LocalCommandResult,
  CompactionResult,
  CommandExecutionResult,
  CommandMessage,
  CommandContent,
  ImageSource,
  CommandHooks,
  HookDefinition,
  CommandExecutionContext,
  CommandOptions,
  ExtractedCommand,
  CommandClassification,
  CommandRegistry,
};
