/**
 * @claudecode/features - Hooks Types
 *
 * Type definitions for the hook system.
 * Reconstructed from chunks.90.mjs, chunks.92.mjs, chunks.120.mjs
 */

import type { ConversationMessage } from '@claudecode/core';

// ============================================
// Hook Event Types
// ============================================

/**
 * All supported hook event types.
 * Original: _b in chunks.90.mjs:1311
 */
export const HOOK_EVENT_TYPES = [
  'PreToolUse',
  'PostToolUse',
  'PostToolUseFailure',
  'Notification',
  'UserPromptSubmit',
  'SessionStart',
  'SessionEnd',
  'Stop',
  'SubagentStart',
  'SubagentStop',
  'PreCompact',
  'PermissionRequest',
] as const;

export type HookEventType = (typeof HOOK_EVENT_TYPES)[number];

// ============================================
// Hook Type Definitions
// ============================================

/**
 * Command hook - executes shell command.
 * Original: S75 in chunks.90.mjs:1878-1883
 */
export interface CommandHook {
  type: 'command';
  /** Shell command to execute */
  command: string;
  /** Timeout in seconds (default 60) */
  timeout?: number;
  /** Custom status message for spinner */
  statusMessage?: string;
  /** Auto-remove after first execution */
  once?: boolean;
}

/**
 * Prompt hook - evaluates LLM prompt.
 * Original: x75 in chunks.90.mjs:1884-1890
 */
export interface PromptHook {
  type: 'prompt';
  /** Prompt with $ARGUMENTS placeholder */
  prompt: string;
  /** Timeout in seconds (default 30) */
  timeout?: number;
  /** Model override (default: small fast model) */
  model?: string;
  /** Custom status message for spinner */
  statusMessage?: string;
  /** Auto-remove after first execution */
  once?: boolean;
}

/**
 * Agent hook - runs agentic verifier.
 * Original: y75 in chunks.90.mjs:1891-1897
 */
export interface AgentHook {
  type: 'agent';
  /** Prompt with $ARGUMENTS placeholder, or function returning prompt */
  prompt: string | ((messages: ConversationMessage[]) => string);
  /** Timeout in seconds (default 60) */
  timeout?: number;
  /** Model override (default: Haiku) */
  model?: string;
  /** Custom status message for spinner */
  statusMessage?: string;
  /** Auto-remove after first execution */
  once?: boolean;
}

/**
 * Callback hook - internal JS callback.
 */
export interface CallbackHook {
  type: 'callback';
  /** Callback function */
  callback: (input: HookInput) => Promise<HookOutput | void>;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Auto-remove after first execution */
  once?: boolean;
}

/**
 * Internal function hook - for state updates.
 */
export interface InternalFunctionHook {
  type: 'function';
  /** Unique ID */
  id: string;
  /** Callback function */
  callback: any;
  /** Error message on failure */
  errorMessage?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Auto-remove after first execution */
  once?: boolean;
}

/**
 * Hook type union.
 * Original: v75 in chunks.90.mjs:1898
 */
export type HookDefinition =
  | CommandHook
  | PromptHook
  | AgentHook
  | CallbackHook
  | InternalFunctionHook;

// ============================================
// Hook Matcher
// ============================================

/**
 * Hook matcher configuration.
 * Original: k75 in chunks.90.mjs:1898-1901
 */
export interface HookMatcher {
  /** Pattern: exact name, "Name1|Name2", or regex */
  matcher?: string;
  /** Hooks to execute when matched */
  hooks: HookDefinition[];
}

/**
 * Event hooks by event type.
 * Original: jb in chunks.90.mjs:1901
 */
export type EventHooksConfig = Partial<Record<HookEventType, HookMatcher[]>>;

// ============================================
// Hook Input Types
// ============================================

/**
 * Base hook environment context.
 * Original: jE in chunks.120.mjs:1169-1177
 */
export interface HookEnvironmentContext {
  /** Current session ID */
  session_id: string;
  /** Path to session transcript */
  transcript_path: string;
  /** Current working directory */
  cwd: string;
  /** Permission mode */
  permission_mode?: string;
}

/**
 * Base hook input with event name.
 */
export interface BaseHookInput extends HookEnvironmentContext {
  hook_event_name: HookEventType;
}

/**
 * PreToolUse hook input.
 */
export interface PreToolUseInput extends BaseHookInput {
  hook_event_name: 'PreToolUse';
  tool_name: string;
  tool_input: unknown;
  tool_use_id: string;
}

/**
 * PostToolUse hook input.
 */
export interface PostToolUseInput extends BaseHookInput {
  hook_event_name: 'PostToolUse';
  tool_name: string;
  tool_input: unknown;
  tool_response: unknown;
  tool_use_id: string;
}

/**
 * PostToolUseFailure hook input.
 */
export interface PostToolUseFailureInput extends BaseHookInput {
  hook_event_name: 'PostToolUseFailure';
  tool_name: string;
  tool_input: unknown;
  tool_use_id: string;
  error: string;
  is_interrupt: boolean;
}

/**
 * Notification hook input.
 */
export interface NotificationInput extends BaseHookInput {
  hook_event_name: 'Notification';
  message: string;
  title?: string;
  notification_type: string;
}

/**
 * UserPromptSubmit hook input.
 */
export interface UserPromptSubmitInput extends BaseHookInput {
  hook_event_name: 'UserPromptSubmit';
  prompt: string;
}

/**
 * SessionStart hook input.
 */
export interface SessionStartInput extends BaseHookInput {
  hook_event_name: 'SessionStart';
  source: string;
  agent_type?: string;
}

/**
 * SessionEnd hook input.
 */
export interface SessionEndInput extends BaseHookInput {
  hook_event_name: 'SessionEnd';
  reason: string;
}

/**
 * Stop hook input.
 */
export interface StopInput extends BaseHookInput {
  hook_event_name: 'Stop';
  stop_hook_active: boolean;
}

/**
 * SubagentStart hook input.
 */
export interface SubagentStartInput extends BaseHookInput {
  hook_event_name: 'SubagentStart';
  agent_id: string;
  agent_type: string;
}

/**
 * SubagentStop hook input.
 */
export interface SubagentStopInput extends BaseHookInput {
  hook_event_name: 'SubagentStop';
  agent_id: string;
  agent_transcript_path: string;
  stop_hook_active: boolean;
}

/**
 * PreCompact hook input.
 */
export interface PreCompactInput extends BaseHookInput {
  hook_event_name: 'PreCompact';
  trigger: string;
  custom_instructions?: string;
}

/**
 * PermissionRequest hook input.
 */
export interface PermissionRequestInput extends BaseHookInput {
  hook_event_name: 'PermissionRequest';
  tool_name: string;
  tool_input: unknown;
  permission_suggestions?: unknown[];
}

/**
 * Hook input union type.
 */
export type HookInput =
  | PreToolUseInput
  | PostToolUseInput
  | PostToolUseFailureInput
  | NotificationInput
  | UserPromptSubmitInput
  | SessionStartInput
  | SessionEndInput
  | StopInput
  | SubagentStartInput
  | SubagentStopInput
  | PreCompactInput
  | PermissionRequestInput;

// ============================================
// Hook Output Types
// ============================================

/**
 * Async hook response (hook runs in background).
 * Original: vG5 in chunks.92.mjs:106-108
 */
export interface AsyncHookResponse {
  async: true;
  asyncTimeout?: number;
}

/**
 * Permission decision for PreToolUse hooks.
 */
export type PermissionDecision = 'allow' | 'deny' | 'ask';

/**
 * PreToolUse specific output.
 */
export interface PreToolUseOutput {
  hookEventName: 'PreToolUse';
  permissionDecision?: PermissionDecision;
  permissionDecisionReason?: string;
  updatedInput?: Record<string, unknown>;
}

/**
 * PostToolUse specific output.
 */
export interface PostToolUseOutput {
  hookEventName: 'PostToolUse';
  additionalContext?: string;
  updatedMCPToolOutput?: unknown;
}

/**
 * PermissionRequest decision.
 */
export interface PermissionRequestDecision {
  behavior: 'allow' | 'deny';
  updatedInput?: Record<string, unknown>;
  updatedPermissions?: unknown[];
  message?: string;
  interrupt?: boolean;
}

/**
 * PermissionRequest specific output.
 */
export interface PermissionRequestOutput {
  hookEventName: 'PermissionRequest';
  decision?: PermissionRequestDecision;
}

/**
 * Generic event output with context.
 */
export interface EventContextOutput {
  hookEventName:
    | 'UserPromptSubmit'
    | 'SessionStart'
    | 'SubagentStart'
    | 'PostToolUseFailure';
  additionalContext?: string;
}

/**
 * Hook-specific output union.
 */
export type HookSpecificOutput =
  | PreToolUseOutput
  | PostToolUseOutput
  | PermissionRequestOutput
  | EventContextOutput;

/**
 * Sync hook output.
 * Original: kG5 in chunks.92.mjs:109-117
 */
export interface SyncHookOutput {
  /** Whether Claude should continue after hook */
  continue?: boolean;
  /** Hide stdout from transcript */
  suppressOutput?: boolean;
  /** Message shown when continue is false */
  stopReason?: string;
  /** Approve or block the operation */
  decision?: 'approve' | 'block';
  /** Explanation for the decision */
  reason?: string;
  /** Warning message shown to user */
  systemMessage?: string;
  /** Event-specific output */
  hookSpecificOutput?: HookSpecificOutput;
}

/**
 * Hook output union.
 * Original: AY1 in chunks.92.mjs
 */
export type HookOutput = AsyncHookResponse | SyncHookOutput;

// ============================================
// Hook Execution Types
// ============================================

/**
 * Hook execution outcome.
 */
export type HookOutcome = 'success' | 'blocking' | 'non_blocking_error' | 'cancelled';

/**
 * Hook execution result.
 */
export interface HookExecutionResult {
  /** The hook that was executed */
  hook: HookDefinition;
  /** Execution outcome */
  outcome: HookOutcome;
  /** Result message (for non-blocking display) */
  message?: string;
  /** Blocking error info */
  blockingError?: {
    blockingError: string;
  };
  /** Prevent continuation flag */
  preventContinuation?: boolean;
  /** Stop reason if continuation prevented */
  stopReason?: string;
  /** Parsed hook output */
  output?: HookOutput;
  /** Raw stdout from command hook */
  stdout?: string;
  /** Raw stderr from command hook */
  stderr?: string;
  /** System message from hook */
  systemMessage?: string;
  /** Additional context from hook */
  additionalContext?: any;
  /** Updated MCP tool output from hook */
  updatedMCPToolOutput?: any;
  /** Permission behavior decision from hook */
  permissionBehavior?: 'allow' | 'deny' | 'ask' | 'passthrough';
  /** Updated tool input from hook */
  updatedInput?: any;
  /** Reason for permission decision */
  hookPermissionDecisionReason?: string;
  /** Permission request result */
  permissionRequestResult?: any;
}

/**
 * Command hook execution result.
 */
export interface CommandHookResult {
  stdout: string;
  stderr: string;
  status: number;
  aborted: boolean;
}

/**
 * Prompt hook response schema.
 * Original: WyA in chunks.92.mjs
 */
export interface PromptHookResponse {
  ok: boolean;
  reason?: string;
}

// ============================================
// Hook State Types
// ============================================

/**
 * Tracked hook entry with success callback.
 */
export interface TrackedHookEntry {
  hook: HookDefinition;
  onHookSuccess?: (hook: HookDefinition, result: HookExecutionResult) => void;
}

/**
 * Matcher with tracked hooks.
 */
export interface TrackedHookMatcher {
  matcher: string;
  hooks: TrackedHookEntry[];
}

/**
 * Session hooks storage.
 */
export interface SessionHooksData {
  hooks: Partial<Record<HookEventType, TrackedHookMatcher[]>>;
}

/**
 * Async hook registry entry.
 * Original: Td map entries in chunks.92.mjs
 */
export interface AsyncHookEntry {
  processId: string;
  hookName: string;
  hookEvent: HookEventType;
  toolName?: string;
  command: string;
  startTime: number;
  timeout: number;
  stdout: string;
  stderr: string;
  responseAttachmentSent: boolean;
  shellCommand?: unknown;
}

// ============================================
// Hook Execution Options
// ============================================

/**
 * Options for REPL hook execution.
 */
export interface ExecuteHooksInREPLOptions {
  hookInput: HookInput;
  toolUseID?: string;
  matchQuery?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
  toolUseContext?: unknown;
  messages?: ConversationMessage[];
}

/**
 * Options for non-REPL hook execution.
 */
export interface ExecuteHooksOutsideREPLOptions {
  getAppState?: () => Promise<unknown>;
  hookInput: HookInput;
  matchQuery?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Non-REPL hook execution result.
 */
export interface NonREPLHookResult {
  succeeded: boolean;
  output: string;
  command: string;
}

// ============================================
// Settings Types
// ============================================

/**
 * Status line configuration.
 */
export interface StatusLineConfig {
  type: 'command';
  command: string;
  padding?: number;
}

/**
 * File suggestion configuration.
 */
export interface FileSuggestionConfig {
  type: 'command';
  command: string;
}

/**
 * Hook-related settings.
 */
export interface HookSettings {
  /** Hooks configuration by event type */
  hooks?: EventHooksConfig;
  /** Disable all hooks including statusLine */
  disableAllHooks?: boolean;
  /** Only managed (policy) hooks run */
  allowManagedHooksOnly?: boolean;
  /** Custom status line display */
  statusLine?: StatusLineConfig;
  /** Custom file suggestion for @ mentions */
  fileSuggestion?: FileSuggestionConfig;
}

// ============================================
// Constants
// ============================================

/**
 * Hook constants.
 */
export const HOOK_CONSTANTS = {
  /** Default hook timeout (ms) */
  DEFAULT_TIMEOUT: 60000,
  /** Default prompt hook timeout (ms) */
  PROMPT_HOOK_TIMEOUT: 30000,
  /** Default async hook timeout (ms) */
  ASYNC_HOOK_TIMEOUT: 15000,
  /** Default status line timeout (ms) */
  STATUS_LINE_TIMEOUT: 5000,
  /** Default file suggestion timeout (ms) */
  FILE_SUGGESTION_TIMEOUT: 5000,
  /** Max agent hook turns */
  AGENT_HOOK_MAX_TURNS: 50,
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
