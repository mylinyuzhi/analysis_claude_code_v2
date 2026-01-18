/**
 * @claudecode/shared - Type Definitions
 *
 * Core TypeScript interfaces and types used throughout Claude Code.
 * Reconstructed from chunks.1.mjs and analysis documents.
 */

// ============================================
// Model & Token Types
// ============================================

/**
 * Model usage statistics tracking
 */
export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
  maxOutputTokens: number;
}

/**
 * Token usage from API response
 */
export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  server_tool_use?: {
    web_search_requests?: number;
  };
}

// ============================================
// Session Types
// ============================================

/**
 * Teleported session information
 */
export interface TeleportedSessionInfo {
  isTeleported: boolean;
  hasLoggedFirstMessage: boolean;
  sessionId: string;
}

/**
 * Invoked skill information
 */
export interface InvokedSkillInfo {
  name: string;
  startTime: number;
  [key: string]: unknown;
}

/**
 * Client type for the session
 */
export type ClientType = 'cli' | 'claude-vscode' | 'sdk' | string;

/**
 * Allowed setting sources
 */
export type SettingSource =
  | 'userSettings'
  | 'projectSettings'
  | 'localSettings'
  | 'flagSettings'
  | 'policySettings';

// ============================================
// Global State Types
// ============================================

/**
 * Global state object that persists throughout the session.
 * Reconstructed from $T9 (createDefaultGlobalState) in chunks.1.mjs:1784-2327
 */
export interface GlobalState {
  // Directory paths
  originalCwd: string;
  projectRoot: string;
  cwd: string;

  // Cost & Performance tracking
  totalCostUSD: number;
  totalAPIDuration: number;
  totalAPIDurationWithoutRetries: number;
  totalToolDuration: number;
  startTime: number;
  lastInteractionTime: number;

  // Code modification tracking
  totalLinesAdded: number;
  totalLinesRemoved: number;

  // Model configuration
  hasUnknownModelCost: boolean;
  modelUsage: Record<string, ModelUsage>;
  mainLoopModelOverride: string | undefined;
  initialMainLoopModel: string | null;
  modelStrings: string[] | null;
  sdkBetas: string[] | undefined;

  // Session configuration
  sessionId: string;
  isInteractive: boolean;
  clientType: ClientType;
  sessionIngressToken: string | undefined;
  oauthTokenFromFd: string | undefined;
  apiKeyFromFd: string | undefined;
  flagSettingsPath: string | undefined;
  allowedSettingSources: SettingSource[];

  // OpenTelemetry metrics
  meter: unknown | null;
  sessionCounter: unknown | null;
  locCounter: unknown | null;
  prCounter: unknown | null;
  commitCounter: unknown | null;
  costCounter: unknown | null;
  tokenCounter: unknown | null;
  codeEditToolDecisionCounter: unknown | null;
  activeTimeCounter: unknown | null;

  // Logging & tracing
  loggerProvider: unknown | null;
  eventLogger: unknown | null;
  meterProvider: unknown | null;
  tracerProvider: unknown | null;

  // Agent colors for UI
  agentColorMap: Map<string, string>;
  agentColorIndex: number;

  // Environment validators
  envVarValidators: unknown[];

  // API tracking
  lastAPIRequest: unknown | null;

  // Error tracking
  inMemoryErrorLog: unknown[];

  // Plugin system
  inlinePlugins: unknown[];

  // Permission modes
  sessionBypassPermissionsMode: boolean;
  sessionTrustAccepted: boolean;
  sessionPersistenceDisabled: boolean;

  // Plan mode state
  hasExitedPlanMode: boolean;
  needsPlanModeExitAttachment: boolean;

  // Delegate mode state
  hasExitedDelegateMode: boolean;
  needsDelegateModeExitAttachment: boolean;

  // LSP recommendation
  lspRecommendationShownThisSession: boolean;

  // JSON schema for init
  initJsonSchema: unknown | null;

  // Hooks registry
  registeredHooks: Record<string, unknown[]> | null;

  // Plan slug cache
  planSlugCache: Map<string, string>;

  // Teleport session info
  teleportedSessionInfo: TeleportedSessionInfo | null;

  // Invoked skills tracking
  invokedSkills: Map<string, InvokedSkillInfo>;

  // Slow operations tracking
  slowOperations: unknown[];

  // Main thread agent type
  mainThreadAgentType: string | undefined;
}

// ============================================
// Hook Types
// ============================================

/**
 * Hook event types
 */
export type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'Notification'
  | 'Stop'
  | 'SubagentStop'
  | 'SessionStart'
  | 'SessionEnd';

/**
 * Hook definition
 */
export interface HookDefinition {
  type: HookEvent;
  matcher?: string;
  command: string;
  pluginRoot?: string;
}

// ============================================
// Message Types
// ============================================

/**
 * Content block types for messages
 */
export type ContentBlockType =
  | 'text'
  | 'image'
  | 'tool_use'
  | 'tool_result'
  | 'thinking';

/**
 * Base content block
 */
export interface BaseContentBlock {
  type: ContentBlockType;
}

/**
 * Text content block
 */
export interface TextContentBlock extends BaseContentBlock {
  type: 'text';
  text: string;
}

/**
 * Image content block
 */
export interface ImageContentBlock extends BaseContentBlock {
  type: 'image';
  source: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

/**
 * Tool use content block
 */
export interface ToolUseContentBlock extends BaseContentBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/**
 * Tool result content block
 */
export interface ToolResultContentBlock extends BaseContentBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

/**
 * Thinking content block
 */
export interface ThinkingContentBlock extends BaseContentBlock {
  type: 'thinking';
  thinking: string;
}

/**
 * Union of all content block types
 */
export type ContentBlock =
  | TextContentBlock
  | ImageContentBlock
  | ToolUseContentBlock
  | ToolResultContentBlock
  | ThinkingContentBlock;

/**
 * Message role
 */
export type MessageRole = 'user' | 'assistant';

/**
 * Message structure
 */
export interface Message {
  role: MessageRole;
  content: string | ContentBlock[];
}

// ============================================
// Tool Types
// ============================================

/**
 * Tool parameter schema
 */
export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  default?: unknown;
  required?: boolean;
}

/**
 * Tool input schema
 */
export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolParameter>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Tool definition
 */
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: ToolInputSchema;
}

/**
 * Tool execution result
 */
export interface ToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

// ============================================
// Permission Types
// ============================================

/**
 * Permission mode for tools
 */
export type PermissionMode = 'auto' | 'dontAsk' | 'bypassPermissions';

/**
 * Permission rule action
 */
export type PermissionAction = 'allow' | 'deny' | 'ask';

/**
 * Permission rule
 */
export interface PermissionRule {
  tool: string;
  action: PermissionAction;
  pattern?: string;
}

// ============================================
// Agent Types
// ============================================

/**
 * Agent type identifiers
 */
export type AgentType =
  | 'main'
  | 'background'
  | 'subagent'
  | 'plan'
  | 'explore'
  | 'repl'
  | string;

/**
 * Agent configuration
 */
export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  model?: string;
  tools?: string[];
  systemPrompt?: string;
}

