/**
 * @claudecode/core - Steering Types
 *
 * Type definitions for the 8-layer steering system.
 *
 * Reconstructed from chunks.91.mjs, chunks.133.mjs, chunks.134.mjs
 */

// ============================================
// Layer 1: System Reminder Types
// ============================================

/**
 * System reminder extraction result.
 */
export interface SystemReminderResult {
  /** Regular message content (non-system-reminder) */
  contextParts: string[];
  /** Extracted system reminder content */
  systemReminders: string[];
}

/**
 * User context for injection.
 */
export interface UserContext {
  /** CLAUDE.md file contents */
  claudeMd?: string;
  /** Git status output */
  gitStatus?: string;
  /** Custom context fields */
  [key: string]: string | undefined;
}

// ============================================
// Layer 2: Meta Message Types
// ============================================

/**
 * Content block for messages.
 */
export interface ContentBlock {
  type: 'text' | 'image' | 'tool_use' | 'tool_result' | 'thinking' | 'redacted_thinking';
  text?: string;
  id?: string; // tool_use id
  name?: string; // tool_use name
  input?: unknown; // tool_use input
  tool_use_id?: string; // tool_result id
  content?: string | ContentBlock[]; // tool_result content
  is_error?: boolean; // tool_result error flag
  thinking?: string;
  signature?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

/**
 * Message with optional meta flag.
 */
export interface SteeringMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

/**
 * Message wrapper for steering system.
 */
export interface MessageWrapper {
  type: 'user' | 'assistant' | 'system' | 'attachment' | 'progress';
  message: SteeringMessage;
  uuid?: string;
  timestamp?: string;
  isMeta?: boolean;
  isVisibleInTranscriptOnly?: boolean;
  toolUseResult?: any;
}

// ============================================
// Layer 3: Context Modifier Types
// ============================================

/**
 * Execution context flow state.
 */
export interface ExecutionContextFlow {
  /** Tool execution state */
  toolState: Map<string, ToolExecutionState>;
  /** Current execution mode */
  mode: 'concurrent' | 'serial';
  /** Pending context updates */
  pendingUpdates: ContextUpdate[];
}

/**
 * Tool execution state.
 */
export interface ToolExecutionState {
  toolName: string;
  startTime: number;
  status: 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: Error;
}

/**
 * Context update to be applied.
 */
export interface ContextUpdate {
  type: 'add' | 'remove' | 'modify';
  key: string;
  value?: unknown;
  timestamp: number;
}

// ============================================
// Layer 4: Append System Prompt Types
// ============================================

/**
 * CLI append options.
 */
export interface AppendSystemPromptOptions {
  /** Direct text to append */
  appendSystemPrompt?: string;
  /** File path to read and append */
  appendSystemPromptFile?: string;
}

// ============================================
// Layer 5: Hook Injection Types
// ============================================

/**
 * Hook events that can inject context.
 */
export type HookInjectionEvent =
  | 'UserPromptSubmit'
  | 'SessionStart'
  | 'SubagentStart'
  | 'PostToolUse'
  | 'PostToolUseFailure';

/**
 * Hook injection result.
 */
export interface HookInjectionResult {
  /** Event that triggered the injection */
  event: HookInjectionEvent;
  /** Hook name that produced the result */
  hookName: string;
  /** Additional context to inject */
  additionalContext?: string[];
  /** System message to inject */
  systemMessage?: string;
  /** Whether to block the operation */
  blocking?: boolean;
  /** Blocking error message */
  blockingError?: string;
}

// ============================================
// Layer 6: Plan Mode Steering Types
// ============================================

/**
 * Plan mode reminder types.
 */
export type PlanModeReminderType = 'full' | 'sparse' | 'subagent';

/**
 * Plan mode state.
 */
export interface PlanModeState {
  /** Whether plan mode is active */
  active: boolean;
  /** Path to plan file */
  planFilePath?: string;
  /** Whether plan file exists */
  planExists: boolean;
  /** Current turn index */
  turnIndex: number;
  /** Whether this is a sub-agent */
  isSubAgent: boolean;
}

/**
 * Plan mode tool restrictions.
 */
export interface PlanModeToolRestrictions {
  /** Tools that are allowed in plan mode */
  allowedTools: string[];
  /** Tools that are read-only */
  readOnlyTools: string[];
  /** Tools that are completely blocked */
  blockedTools: string[];
}

// ============================================
// Layer 7: Permission Mode Types
// ============================================

/**
 * Permission modes.
 */
export type PermissionMode =
  | 'acceptEdits'
  | 'bypassPermissions'
  | 'default'
  | 'dontAsk'
  | 'plan';

/**
 * Permission mode context.
 */
export interface PermissionModeContext {
  /** Current permission mode */
  mode: PermissionMode;
  /** Whether bypass is available */
  bypassAvailable: boolean;
  /** Auto-allow in plan mode when bypass available */
  autoAllowInPlanMode: boolean;
}

// ============================================
// Layer 8: Read File State Types
// ============================================

/**
 * Read file state entry.
 */
export interface ReadFileStateEntry {
  /** File content */
  content: string;
  /** Read timestamp */
  timestamp: number;
  /** Optional offset */
  offset?: number;
  /** Optional limit */
  limit?: number;
}

/**
 * Read file state mapping.
 */
export type ReadFileState = Map<string, ReadFileStateEntry>;

/**
 * Read file state merge options.
 */
export interface ReadFileStateMergeOptions {
  /** Whether to prefer newer entries */
  preferNewer: boolean;
  /** Whether to merge partial reads */
  mergePartialReads: boolean;
}

// ============================================
// Combined Steering Context
// ============================================

/**
 * Full steering context combining all layers.
 */
export interface SteeringContext {
  /** Layer 1: User context */
  userContext: UserContext;
  /** Layer 3: Execution context flow */
  executionFlow: ExecutionContextFlow;
  /** Layer 4: Append system prompt options */
  appendOptions: AppendSystemPromptOptions;
  /** Layer 5: Hook injections */
  hookInjections: HookInjectionResult[];
  /** Layer 6: Plan mode state */
  planMode: PlanModeState;
  /** Layer 7: Permission mode */
  permissionMode: PermissionModeContext;
  /** Layer 8: Read file state */
  readFileState: ReadFileState;
}

/**
 * Steering layer priority (lower = higher priority).
 */
export const STEERING_LAYER_PRIORITY = {
  SYSTEM_REMINDER: 1,
  META_MESSAGE: 2,
  CONTEXT_MODIFIER: 3,
  APPEND_SYSTEM_PROMPT: 4,
  HOOK_INJECTION: 5,
  PLAN_MODE: 6,
  PERMISSION_MODE: 7,
  READ_FILE_STATE: 8,
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
