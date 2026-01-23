/**
 * @claudecode/features - Slash Commands Types
 *
 * Type definitions for the slash command system.
 * Reconstructed from chunks.112.mjs, chunks.136.mjs, chunks.146.mjs
 */

import type { AppState, AgentDefinitions } from '@claudecode/core/state';
import type { EventHooksConfig } from '../hooks/types.js';

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
  /** Hook config carried by prompt commands (skills/plugins/policy). */
  hooks?: EventHooksConfig;
  /** Where this command was loaded from (source-aligned). */
  loadedFrom?: 'builtin' | 'skills' | 'plugin' | 'bundled' | 'commands_DEPRECATED' | string;
  userInvocable?: boolean;
  progressMessage?: string;
  agent?: string;
  pluginInfo?: any;
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
  resultText?: string;
}

// ============================================
// Command Messages
// ============================================

/**
 * Command message (for transcript).
 * Fully compatible with @claudecode/core/message/types.ts
 */
export interface CommandMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | CommandContent[];
  isMeta?: boolean;
  uuid?: string;
  // Fields for compatibility with core UserMessage/AssistantMessage
  type?: 'user' | 'assistant' | 'system' | 'progress' | 'attachment';
  message?: {
    role: string;
    content: any;
  };
  timestamp?: string;
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
// State Types
// ============================================

/**
 * Skill usage state type.
 * Original: MD1 related
 */
// Temporary duplicate to break circular dependency
export interface SkillUsage {
  usageCount: number;
  lastUsedAt: number;
}
// export type { SkillUsage } from '@claudecode/core/state';

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
  getAppState?: () => Promise<AppState>;
  setAppState?: (updater: (state: any) => any) => void;
  setResponseLength?: (updater: (prev: number) => number) => void;
  // Compatibility with ToolUseContext
  readFileState?: Map<string, any>;
  setInProgressToolUseIDs?: (updater: (ids: Set<string>) => Set<string>) => void;
  queryTracking?: { chainId: string; depth: number };
}

/**
 * Options within execution context.
 */
export interface CommandOptions {
  commands: SlashCommand[];
  isNonInteractiveSession: boolean;
  model?: string;
  agentDefinitions?: AgentDefinitions;
  tools: any[];
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
  SKILL_FORMAT_TAG: 'skill-format',
  SKILL_NAME_TAG: 'skill-name',
  SKILL_PROGRESS_TAG: 'skill-progress',

  // Messages
  ABORT_MESSAGE: '[Request interrupted by user]',
  EMPTY_CONTENT: '(no content)',

  // Built-in command names
  BUILTIN_COMMANDS: [
    // NOTE: This list is derived from the current `source/chunks.*.mjs` bundle.
    // Keep it in sync with the built-in registry.
    'add-dir',
    'agents',
    'btw',
    'clear',
    'color',
    'compact',
    'config',
    'context',
    'cost',
    'discover',
    'doctor',
    'exit',
    'export',
    'extra-usage',
    'feedback',
    'files',
    'help',
    'hooks',
    'ide',
    'init',
    'install',
    'install-github-app',
    'install-slack-app',
    'login',
    'logout',
    'mcp',
    'memory',
    'mobile',
    'model',
    'output-style',
    'passes',
    'permissions',
    'plan',
    'plugin',
    'pr-comments',
    'privacy-settings',
    'rate-limit-options',
    'release-notes',
    'remote-env',
    'rename',
    'resume',
    'review',
    'skills',
    'stats',
    'status',
    'statusline',
    'stickers',
    'tag',
    'terminal-setup',
    'tasks',
    'theme',
    'think-back',
    'thinkback-play',
    'todos',
    'upgrade',
    'usage',
    'vim',
  ] as const,
} as const;
