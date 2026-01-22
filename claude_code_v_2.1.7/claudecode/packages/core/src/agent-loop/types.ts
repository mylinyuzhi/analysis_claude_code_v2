/**
 * @claudecode/core - Agent Loop Types
 *
 * Type definitions for the agent execution loop.
 * Reconstructed from chunks.134.mjs, chunks.112.mjs
 */

import type { ContentBlock } from '@claudecode/shared';
import type { ConversationMessage } from '../message/types.js';
import type { ApiError, RetryInfo, StreamEvent } from '../llm-api/types.js';
import type { ToolDefinition, ToolUseContext, PermissionResult } from '../tools/types.js';

// ============================================
// Query Tracking
// ============================================

/**
 * Query tracking context for telemetry
 */
export interface QueryTracking {
  /** Chain ID for this query sequence */
  chainId: string;
  /** Depth in the query chain */
  depth: number;
}

/**
 * Query source identifier
 */
export type QuerySource = 'main' | 'subagent' | 'background' | 'sdk';

// ============================================
// Agent Definition
// ============================================

/**
 * Agent definition for sub-agents
 */
export interface AgentDefinition {
  /** Agent type identifier */
  agentType: string;
  /** Human-readable guidance for the caller */
  whenToUse?: string;
  /** Source of agent definition */
  source?: 'built-in' | 'plugin' | 'skills' | 'bundled' | string;
  /** Base directory (used by runtime to resolve relative assets) */
  baseDir?: string;
  /** Optional UI color (used by interactive renderer) */
  color?: string;

  /** Display name */
  name?: string;

  /** Model to use (supports "inherit" in bundled runtime) */
  model?: 'inherit' | 'sonnet' | 'opus' | 'haiku' | string;

  /** Permission mode override */
  permissionMode?: 'default' | 'plan' | 'bypassPermissions' | 'dontAsk' | string;

  /** Allowed tools ("*" means all) */
  tools?: string[];
  /** Disallowed tools (enforced in runtime tool filtering) */
  disallowedTools?: string[];

  /** Skills to load */
  skills?: string[];

  /** Optional MCP server definitions */
  mcpServers?: unknown[];

  /** Custom hooks */
  hooks?: AgentHooks;

  /** Custom system prompt generator (bundled runtime uses this) */
  getSystemPrompt?: (args: { toolUseContext: ToolUseContext }) => string | string[];

  /** Concurrency safety */
  isConcurrencySafe?: boolean;
  /** Custom system prompt (static) */
  systemPrompt?: string;
  /** Critical system reminder */
  criticalSystemReminder_EXPERIMENTAL?: string;
  /** Callback on completion */
  callback?: () => void;
}

/**
 * Agent hooks configuration
 */
export interface AgentHooks {
  onStart?: () => void | Promise<void>;
  onEnd?: () => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

// ============================================
// Tool Execution
// ============================================

/**
 * Tool execution state
 */
export type ToolExecutionStatus = 'queued' | 'executing' | 'completed' | 'yielded';

/**
 * Tracked tool execution
 */
export interface TrackedToolExecution {
  /** Tool use ID */
  id: string;
  /** Tool use block */
  block: ToolUseBlock;
  /** Associated assistant message */
  assistantMessage: ConversationMessage;
  /** Current status */
  status: ToolExecutionStatus;
  /** Whether tool is concurrency-safe */
  isConcurrencySafe: boolean;
  /** Pending progress messages */
  pendingProgress: ConversationMessage[];
  /** Result messages */
  results?: ConversationMessage[];
  /** Context modifiers */
  contextModifiers?: Array<(ctx: ToolUseContext) => ToolUseContext>;
  /** Execution promise */
  promise?: Promise<void>;
}

/**
 * Tool use block
 */
export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: unknown;
}

/**
 * Tool result block
 */
export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

/**
 * Tool execution result
 */
export interface ToolExecutionResult {
  /** Result message */
  message?: ConversationMessage;
  /** Context modifier */
  contextModifier?: {
    modifyContext: (ctx: ToolUseContext) => ToolUseContext;
  };
}

// Alias used by tools/execution pipeline
export type ToolExecutionYield = ToolExecutionResult;

// ============================================
// Core Message Loop
// ============================================

/**
 * Core message loop options
 */
export interface CoreMessageLoopOptions {
  /** Conversation messages */
  messages: ConversationMessage[];
  /** System prompt */
  systemPrompt: string | string[];
  /** User context (user info) - can be structured key/value like system-reminder */
  userContext?: string | Record<string, string>;
  /** System context (environment info) - can be structured key/value like system-reminder */
  systemContext?: string | Record<string, string>;
  /** Tool permission checker */
  canUseTool: CanUseTool;
  /** Tool use context */
  toolUseContext: ToolUseContext;
  /** Auto-compact tracking state */
  autoCompactTracking?: AutoCompactTracking;
  /** Fallback model on overload */
  fallbackModel?: string;
  /** Whether stop hook is active */
  stopHookActive?: boolean;
  /** Query source (used for telemetry and compact heuristics) */
  querySource?: QuerySource | string;
  /** Max output tokens override */
  maxOutputTokensOverride?: number;
  /** Max output tokens recovery count */
  maxOutputTokensRecoveryCount?: number;
  /** Maximum turns */
  maxTurns?: number;
  /** Current turn count */
  turnCount?: number;
}

/**
 * Auto-compact tracking state
 */
export interface AutoCompactTracking {
  /** Whether compaction occurred */
  compacted: boolean;
  /** Turn ID for telemetry */
  turnId: string;
  /** Turn counter since compaction */
  turnCounter: number;
}

/**
 * Can use tool function type
 */
export type CanUseTool = (
  tool: ToolDefinition,
  input: unknown,
  assistantMessage: ConversationMessage
) => Promise<boolean | PermissionResult>;

// ============================================
// Sub-Agent Loop
// ============================================

/**
 * Sub-agent loop options
 */
export interface SubagentLoopOptions {
  /** Agent definition */
  agentDefinition: AgentDefinition;
  /** Initial prompt messages */
  promptMessages: ConversationMessage[];
  /** Tool use context */
  toolUseContext: ToolUseContext;
  /** Tool permission checker */
  canUseTool: CanUseTool;
  /** Whether running async */
  isAsync?: boolean;
  /** Fork context messages */
  forkContextMessages?: ConversationMessage[];
  /** Query source */
  querySource?: QuerySource;
  /** Override options */
  override?: SubagentOverride;
  /** Model override */
  model?: string;
  /** Maximum turns */
  maxTurns?: number;
}

/**
 * Sub-agent override options
 */
export interface SubagentOverride {
  /** Agent ID to resume */
  agentId?: string;
  /** Custom system prompt */
  systemPrompt?: string;
  /** Custom user context */
  userContext?: string;
  /** Custom system context */
  systemContext?: string;

  /** Abort controller override */
  abortController?: AbortController;
}

// ============================================
// Task Tool
// ============================================

/**
 * Task tool input
 */
export interface TaskToolInput {
  /** Prompt for the sub-agent */
  prompt: string;
  /** Sub-agent type */
  subagent_type: string;
  /** Task description */
  description?: string;
  /** Model override */
  model?: string;
  /** Agent ID to resume */
  resume?: string;
  /** Run in background */
  run_in_background?: boolean;
  /** Maximum turns */
  max_turns?: number;
}

/**
 * Task tool result
 */
export interface TaskToolResult {
  /** Whether running async */
  isAsync?: boolean;
  /** Task status */
  status: 'completed' | 'async_launched' | 'error';
  /** Agent ID */
  agentId?: string;
  /** Output file path */
  outputFile?: string;
  /** Result data */
  data?: unknown;
  /** Error message */
  error?: string;
}

// ============================================
// Background Task
// ============================================

/**
 * Task types
 */
export type TaskType = 'local_bash' | 'local_agent' | 'remote_agent';

/**
 * Task state
 */
export type TaskState = 'pending' | 'running' | 'completed' | 'failed' | 'killed';

/**
 * Base task structure
 */
export interface BaseTask {
  /** Task ID */
  id: string;
  /** Task type */
  type: TaskType;
  /** Current state */
  state: TaskState;
  /** Description */
  description: string;
  /** When created */
  createdAt: Date;
  /** When completed */
  completedAt?: Date;
  /** Output file path */
  outputFile?: string;
}

/**
 * Local agent task
 */
export interface LocalAgentTask extends BaseTask {
  type: 'local_agent';
  /** Agent ID */
  agentId: string;
  /** Progress info */
  progress?: TaskProgress;
  /** Messages */
  messages?: ConversationMessage[];
  /** Whether backgrounded */
  isBackgrounded?: boolean;
}

/**
 * Local bash task
 */
export interface LocalBashTask extends BaseTask {
  type: 'local_bash';
  /** Command */
  command: string;
  /** Shell command reference */
  shellCommand?: unknown;
}

/**
 * Task progress
 */
export interface TaskProgress {
  /** Estimated token count */
  tokenCount: number;
  /** Tool use count */
  toolUseCount: number;
  /** Recent activities */
  recentActivities: Array<{
    toolName: string;
    input: unknown;
  }>;
}

// ============================================
// Stream Events
// ============================================

/**
 * Stream request start event
 */
export interface StreamRequestStartEvent {
  type: 'stream_request_start';
}

/**
 * Progress event
 */
export interface ProgressEvent {
  type: 'progress';
  fullOutput?: string;
  output?: string;
  elapsedTimeSeconds: number;
  totalLines?: number;
}

/**
 * Tombstone event (message discarded)
 */
export interface TombstoneEvent {
  type: 'tombstone';
  message: ConversationMessage;
}

/**
 * Raw streaming event from the LLM API.
 *
 * Source: streamApiCall/queryWithStreaming yields raw `StreamEvent` for UI.
 */
export interface StreamEventLoopEvent {
  type: 'stream_event';
  event: StreamEvent;
}

/**
 * Retry event for streaming API call (used by UI for feedback).
 */
export interface RetryLoopEvent {
  type: 'retry';
  attempt: number;
  maxAttempts: number;
  delayMs: number;
}

/**
 * API error surfaced from streaming pipeline.
 *
 * Note: the loop may also emit an `assistant` error message or an `attachment`.
 */
export interface ApiErrorLoopEvent {
  type: 'api_error';
  error: ApiError;
  retryInfo?: RetryInfo;
}

/**
 * Loop events union
 */
export type LoopEvent =
  | StreamRequestStartEvent
  | ProgressEvent
  | TombstoneEvent
  | StreamEventLoopEvent
  | RetryLoopEvent
  | ApiErrorLoopEvent
  | ConversationMessage;

// ============================================
// Constants
// ============================================

/**
 * Agent loop constants
 */
export const AGENT_LOOP_CONSTANTS = {
  /** Background hint threshold for Task tool (ms) */
  BACKGROUND_HINT_THRESHOLD: 3000,

  /** Background threshold for shell commands (ms) */
  SHELL_BACKGROUND_THRESHOLD: 2000,

  /** Progress yield interval (ms) */
  PROGRESS_INTERVAL: 1000,

  /** Max recent activities to track */
  MAX_RECENT_ACTIVITIES: 5,

  /** Max output token recovery attempts */
  MAX_OUTPUT_TOKEN_RECOVERY: 3,

  /** Output token recovery message */
  OUTPUT_TOKEN_RECOVERY_MESSAGE:
    'Your response was cut off because it exceeded the output token limit. ' +
    'Please break your work into smaller pieces. Continue from where you left off.',
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
