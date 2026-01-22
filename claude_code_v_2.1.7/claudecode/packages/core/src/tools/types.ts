/**
 * @claudecode/core - Tool Types
 *
 * Type definitions for the tool framework.
 * Reconstructed from chunks.115.mjs, chunks.86.mjs, and analysis documents.
 */

import type { ContentBlock } from '@claudecode/shared';

// ============================================
// Schema Types (Zod-like)
// ============================================

/**
 * Simple schema definition (Zod-compatible interface)
 */
export interface Schema<T = unknown> {
  parse(data: unknown): T;
  safeParse(data: unknown): { success: true; data: T } | { success: false; error: Error };
}

// ============================================
// Permission Types
// ============================================

/**
 * Permission check result
 */
export interface PermissionResult {
  /** Whether permission is granted */
  result: boolean;
  /** Behavior on denial: 'ask' shows prompt, 'deny' silently rejects */
  behavior?: 'ask' | 'deny';
  /** Message to display to user */
  message?: string;
  /** Error code for categorization */
  errorCode?: number;
  /** Additional metadata */
  meta?: Record<string, string>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether input is valid */
  result: boolean;
  /** Behavior on failure */
  behavior?: 'ask' | 'deny';
  /** Validation error message */
  message?: string;
  /** Error code */
  errorCode?: number;
  /** Additional metadata */
  meta?: Record<string, string>;
}

// ============================================
// Tool Result Types
// ============================================

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
  /** Result data */
  data?: T;
  /** Error if execution failed */
  error?: Error | string;
  /** Whether result should be cached */
  isCacheable?: boolean;
  /** Result metadata */
  metadata?: Record<string, unknown>;

  /** Optional context modifier (used by some tools) */
  contextModifier?: { modifyContext: (ctx: ToolUseContext) => ToolUseContext };
}

/** Generic tool input type used by execution pipeline */
export type ToolInput = unknown;

/**
 * Tool result block for API
 */
export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

// ============================================
// Tool Use Context
// ============================================

/**
 * Read file state map (shared across tools)
 */
export interface ReadFileState {
  content: string;
  timestamp: number;
  offset?: number;
  limit?: number;
}

/**
 * Tool use context passed to tool calls
 */
export interface ToolUseContext {
  /** Get current app state */
  getAppState: () => Promise<AppState>;
  /** Set app state */
  setAppState: (updater: (state: AppState) => AppState) => void;
  /** Current agent ID */
  agentId?: string;
  /** Message history */
  messages: unknown[];
  /** Read file state for validation */
  readFileState: Map<string, ReadFileState>;

  /** Track in-progress tool_use IDs (used by streaming tool execution) */
  setInProgressToolUseIDs?: (
    updater: (ids: Set<string>) => Set<string>
  ) => void;
  /** Abort controller for cancellation */
  abortController?: AbortController;
  /** Options */
  options: ToolUseOptions;

  /** Query tracking (telemetry / compaction heuristics) */
  queryTracking?: { chainId: string; depth: number };

  /** Optional critical system reminder injected for subagents */
  criticalSystemReminder_EXPERIMENTAL?: string;

  /** Tool permission decisions cache (used by execution pipeline) */
  toolDecisions?: Map<string, unknown>;

  /** Whether user modified tool input in prompt */
  userModified?: boolean;

  /** Pending steering attachments from previous turn */
  pendingSteeringAttachments?: unknown[];
}

/**
 * Tool use options
 */
export interface ToolUseOptions {
  /** Available tools */
  tools: Tool[];
  /** MCP clients */
  mcpClients?: unknown[];
  /** Main loop model */
  mainLoopModel?: string;

  /** Max thinking tokens override (streaming) */
  maxThinkingTokens?: number;

  /** Whether this is a non-interactive session */
  isNonInteractiveSession?: boolean;

  /** Extra system prompt appended at runtime */
  appendSystemPrompt?: string;

  /** Permission mode override */
  permissionMode?: string;

  /** Debug logging */
  debug?: boolean;

  /** Verbose rendering */
  verbose?: boolean;

  /** MCP resources snapshot */
  mcpResources?: unknown;
  /** Agent definitions */
  agentDefinitions?: {
    activeAgents: AgentDefinition[];
  };
}

/**
 * Agent definition
 */
export interface AgentDefinition {
  agentType: string;
  name: string;
  description: string;
  model?: string;
  tools?: string[];
  skills?: string[];
  permissionMode?: string;
  hooks?: Record<string, unknown[]>;
}

/**
 * App state (simplified)
 */
export interface AppState {
  [key: string]: unknown;
  toolPermissionContext: {
    mode: 'auto' | 'dontAsk' | 'bypassPermissions' | 'plan';
    shouldAvoidPermissionPrompts?: boolean;
    additionalWorkingDirectories?: Map<string, unknown>;
  };
  tasks?: Record<string, unknown>;
  queuedCommands?: unknown[];

  /** MCP runtime state (present in full AppState) */
  mcp?: { tools?: unknown };
}

// ============================================
// Progress Callback
// ============================================

/**
 * Progress callback for long-running tools
 */
export type ProgressCallback = (progress: ToolProgress) => void;

/**
 * Tool progress information
 */
export interface ToolProgress {
  /** Progress type */
  type: 'output' | 'status' | 'complete';
  /** Progress message or data */
  data?: string | unknown;
  /** Progress percentage (0-100) */
  percentage?: number;
}

// ============================================
// Tool Interface
// ============================================

/**
 * Tool interface that all tools must implement.
 *
 * Reconstructed from analysis of chunks.86.mjs, chunks.115.mjs
 */
export interface Tool<TInput = unknown, TOutput = unknown> {
  /** Unique tool identifier */
  name: string;

  /** Maximum result size in characters */
  maxResultSizeChars: number;

  /** Whether to use strict schema validation */
  strict?: boolean;

  /** Example inputs for API training */
  input_examples?: TInput[];

  /** Get tool description for Claude */
  description(): Promise<string> | string;

  /** Get detailed usage instructions */
  prompt(): Promise<string> | string;

  /** Input validation schema */
  inputSchema: Schema<TInput>;

  /** Output structure schema */
  outputSchema: Schema<TOutput>;

  /** Display name for UI (can be dynamic based on input) */
  userFacingName?: string | ((input: TInput) => string);

  /** Whether tool is currently enabled */
  isEnabled(): boolean;

  /** Whether tool is MCP-backed (optional) */
  isMcp?: boolean;

  /** Whether tool requires explicit user interaction (optional) */
  requiresUserInteraction?: () => boolean;

  /** Whether tool can run in parallel with other tools */
  isConcurrencySafe(input?: TInput): boolean;

  /** Whether tool only reads and doesn't modify anything */
  isReadOnly(input?: TInput): boolean;

  /** Check if input represents a search or read command */
  isSearchOrReadCommand?(input?: TInput): { isSearch: boolean; isRead: boolean };

  /** Extract file path from input (for file-based tools) */
  getPath?(input: TInput): string;

  /** Check if tool can be used with current permissions */
  checkPermissions?(
    input: TInput,
    context: ToolUseContext
  ): Promise<PermissionResult>;

  /** Validate input before execution */
  validateInput?(
    input: TInput,
    context: ToolUseContext
  ): Promise<ValidationResult>;

  /** Execute the tool */
  call(
    input: TInput,
    context: ToolUseContext,
    toolUseId: string,
    metadata: unknown,
    progressCallback?: ProgressCallback
  ): Promise<ToolResult<TOutput>>;

  /** Map tool result to API response block */
  mapToolResultToToolResultBlockParam(
    result: ToolResult<TOutput>,
    toolUseId: string
  ): ToolResultBlock;

  /** Render tool use message in UI */
  renderToolUseMessage?(input: TInput, options: RenderOptions): unknown;

  /** Render tool result message in UI */
  renderToolResultMessage?(result: ToolResult<TOutput>, options: RenderOptions): unknown;

  /** Render error message in UI */
  renderToolUseErrorMessage?(error: Error, options: RenderOptions): unknown;

  /** Render rejected message in UI */
  renderToolUseRejectedMessage?(input: TInput, options: RenderOptions): unknown;

  /** Render progress message in UI */
  renderToolUseProgressMessage?(input: TInput, options: RenderOptions): unknown;
}

/**
 * Tool definition used by agent-loop types.
 * In this codebase the runtime passes full Tool objects around.
 */
export type ToolDefinition = Tool;

/**
 * Render options for UI
 */
export interface RenderOptions {
  verbose?: boolean;
  isStreaming?: boolean;
  isBackgrounded?: boolean;
}

// ============================================
// Tool Grouping
// ============================================

/**
 * Tool group definition
 */
export interface ToolGroup {
  /** Group display name */
  name: string;
  /** Set of tool names in this group */
  toolNames: Set<string>;
  /** Whether this group is for MCP tools */
  isMcp?: boolean;
}

/**
 * Standard tool groupings
 */
export interface ToolGroupings {
  READ_ONLY: ToolGroup;
  EDIT: ToolGroup;
  EXECUTION: ToolGroup;
  MCP: ToolGroup;
  OTHER: ToolGroup;
}

// ============================================
// Tool Filter Sets
// ============================================

/**
 * Tools that are always excluded from subagents
 */
export const ALWAYS_EXCLUDED_TOOLS = new Set([
  'AskUserQuestion',
  'EnterPlanMode',
  'ExitPlanMode',
  'Task',
  'KillShell',
]);

/**
 * Tools that are safe for async/background execution
 */
export const ASYNC_SAFE_TOOLS = new Set([
  'Read',
  'Glob',
  'Grep',
  'WebFetch',
  'WebSearch',
  // Add more as needed
]);

/**
 * Built-in tool names
 */
export const BUILTIN_TOOL_NAMES = new Set([
  'Read',
  'Write',
  'Edit',
  'Glob',
  'Grep',
  'Bash',
  'Task',
  'TodoWrite',
  'WebFetch',
  'WebSearch',
  'Skill',
  'AskUserQuestion',
  'EnterPlanMode',
  'ExitPlanMode',
  'NotebookEdit',
  'TaskOutput',
  'KillShell',
  'LSP',
]);

// ============================================
// Export all types
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
