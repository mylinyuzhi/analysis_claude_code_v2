/**
 * @claudecode/core - State Types
 *
 * Type definitions for application state management.
 * Reconstructed from chunks.135.mjs:1235-1419
 */

import type { Tool } from '../tools/types.js';

// ============================================
// Tool Permission Context
// ============================================

/**
 * Permission modes
 */
export type PermissionMode =
  | 'default'
  | 'plan'
  | 'acceptEdits'
  | 'bypassPermissions'
  | 'dontAsk';

/**
 * Permission rule type
 */
export interface PermissionRule {
  /** Tool name pattern (glob) */
  pattern: string;
  /** Allow or deny */
  allow: boolean;
  /** Optional path restrictions */
  paths?: string[];
}

/**
 * Tool permission context for cross-module interaction
 */
export interface ToolPermissionContext {
  /** Current permission mode */
  mode: PermissionMode;
  /** Whether bypass mode is available */
  isBypassPermissionsModeAvailable: boolean;
  /** Should avoid permission prompts */
  shouldAvoidPermissionPrompts: boolean;
  /** Session-level permissions */
  sessionPermissions: Map<string, boolean>;
  /** Granted permissions list */
  grantedPermissions: string[];
  /** Denied permissions list */
  deniedPermissions: string[];
  /** Permission rules */
  rules: PermissionRule[];
}

// ============================================
// Settings
// ============================================

/**
 * User settings structure
 */
export interface Settings {
  /** Model preferences */
  model?: string;
  /** API key */
  apiKey?: string;
  /** Custom API base URL */
  apiBaseUrl?: string;
  /** Enabled features */
  features?: Record<string, boolean>;
  /** Tool permission rules */
  permissions?: PermissionRule[];
  /** UI preferences */
  ui?: {
    theme?: 'light' | 'dark' | 'system';
    showTodos?: boolean;
    verbose?: boolean;
  };
  /** Hook configurations */
  hooks?: Record<string, unknown[]>;
  /** MCP server configurations */
  mcp?: Record<string, unknown>;
}

// ============================================
// Agent Definitions
// ============================================

/**
 * Agent definition structure
 */
export interface AgentDefinition {
  /** Agent type identifier */
  agentType: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Model to use */
  model?: string;
  /** Available tools */
  tools?: string[];
  /** Required skills */
  skills?: string[];
  /** Permission mode override */
  permissionMode?: PermissionMode;
  /** Custom hooks */
  hooks?: Record<string, unknown[]>;
}

/**
 * Agent definitions container
 */
export interface AgentDefinitions {
  /** Currently active/enabled agents */
  activeAgents: AgentDefinition[];
  /** All available agents */
  allAgents: AgentDefinition[];
}

// ============================================
// File History
// ============================================

/**
 * File snapshot for history tracking
 */
export interface FileSnapshot {
  /** File path */
  path: string;
  /** File content at snapshot time */
  content: string;
  /** Snapshot timestamp */
  timestamp: number;
  /** Operation that created this snapshot */
  operation?: 'read' | 'edit' | 'write';
}

/**
 * File history tracking
 */
export interface FileHistory {
  /** Content snapshots */
  snapshots: FileSnapshot[];
  /** Currently tracked file paths */
  trackedFiles: Set<string>;
}

// ============================================
// MCP (Model Context Protocol)
// ============================================

/**
 * MCP client instance reference
 */
export interface MCPClient {
  /** Server name */
  name: string;
  /** Connection status */
  connected: boolean;
  /** Available tools */
  tools: string[];
  /** Connection error if any */
  error?: Error;
}

/**
 * MCP state
 */
export interface MCPState {
  /** Connected MCP clients */
  clients: MCPClient[];
  /** MCP-provided tools */
  tools: Tool[];
  /** MCP-provided commands */
  commands: string[];
  /** MCP resources */
  resources: Record<string, unknown>;
}

// ============================================
// Plugin System
// ============================================

/**
 * Plugin installation status
 */
export interface PluginInstallationStatus {
  marketplaces: string[];
  plugins: string[];
}

/**
 * Plugin error
 */
export interface PluginError {
  pluginId: string;
  error: string;
  timestamp: number;
}

/**
 * Plugin state
 */
export interface PluginState {
  /** Enabled plugin IDs */
  enabled: string[];
  /** Disabled plugin IDs */
  disabled: string[];
  /** Plugin-provided commands */
  commands: string[];
  /** Plugin-provided agents */
  agents: AgentDefinition[];
  /** Plugin errors */
  errors: PluginError[];
  /** Installation status */
  installationStatus: PluginInstallationStatus;
}

// ============================================
// Todo System
// ============================================

/**
 * Todo item status
 */
export type TodoStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Todo item
 */
export interface TodoItem {
  /** Todo content/description */
  content: string;
  /** Current status */
  status: TodoStatus;
  /** Active form text for display */
  activeForm: string;
}

/**
 * Todos storage (by session)
 */
export type TodosState = Record<string, TodoItem[]>;

// ============================================
// Notifications
// ============================================

/**
 * Notification type
 */
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

/**
 * Notification item
 */
export interface Notification {
  /** Notification ID */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Message content */
  message: string;
  /** Timestamp */
  timestamp: number;
  /** Auto-dismiss timeout (ms) */
  timeout?: number;
}

/**
 * Notification state
 */
export interface NotificationState {
  /** Currently displayed notification */
  current: Notification | null;
  /** Queued notifications */
  queue: Notification[];
}

// ============================================
// Elicitation (User Input)
// ============================================

/**
 * Elicitation request
 */
export interface ElicitationRequest {
  /** Request ID */
  id: string;
  /** Question to ask */
  question: string;
  /** Available options */
  options: Array<{
    label: string;
    description?: string;
  }>;
  /** Allow multi-select */
  multiSelect?: boolean;
}

/**
 * Elicitation state
 */
export interface ElicitationState {
  /** Pending input requests */
  queue: ElicitationRequest[];
}

// ============================================
// Prompt Suggestions
// ============================================

/**
 * Prompt suggestion state
 */
export interface PromptSuggestionState {
  /** Suggested prompt text */
  text: string | null;
  /** Prompt ID for tracking */
  promptId: string | null;
  /** When suggestion was shown */
  shownAt: number;
  /** When suggestion was accepted */
  acceptedAt: number;
  /** Generation request ID */
  generationRequestId: string | null;
}

// ============================================
// Speculation
// ============================================

/**
 * Speculation status
 */
export type SpeculationStatus = 'idle' | 'pending' | 'running' | 'completed' | 'failed';

/**
 * Speculation state
 */
export interface SpeculationState {
  /** Current speculation status */
  status: SpeculationStatus;
  /** Speculated result */
  result?: unknown;
  /** Speculation error */
  error?: Error;
}

// ============================================
// Worker Permissions
// ============================================

/**
 * Worker permission request
 */
export interface WorkerPermissionRequest {
  /** Request ID */
  id: string;
  /** Worker ID */
  workerId: string;
  /** Requested permission */
  permission: string;
  /** Tool or action name */
  toolName?: string;
  /** Input data */
  input?: unknown;
}

/**
 * Worker permissions state
 */
export interface WorkerPermissionsState {
  /** Pending permission requests */
  queue: WorkerPermissionRequest[];
  /** Selected index for UI */
  selectedIndex: number;
}

// ============================================
// Prompt Coaching
// ============================================

/**
 * Prompt coaching state
 */
export interface PromptCoachingState {
  /** Current tip */
  tip: string | null;
  /** When tip was shown */
  shownAt: number;
}

// ============================================
// Git Integration
// ============================================

/**
 * Git diff stats
 */
export interface GitDiffStats {
  /** Files changed */
  filesChanged: number;
  /** Lines added */
  additions: number;
  /** Lines deleted */
  deletions: number;
}

/**
 * Git diff hunk
 */
export interface GitDiffHunk {
  /** Start line */
  startLine: number;
  /** Line count */
  lineCount: number;
  /** Diff content */
  content: string;
}

/**
 * Git diff state
 */
export interface GitDiffState {
  /** Overall stats */
  stats: GitDiffStats | null;
  /** Per-file stats */
  perFileStats: Map<string, GitDiffStats>;
  /** Hunks by file path */
  hunks: Map<string, GitDiffHunk[]>;
  /** Last updated timestamp */
  lastUpdated: number;
}

// ============================================
// Feedback Survey
// ============================================

/**
 * Feedback survey state
 */
export interface FeedbackSurveyState {
  /** Time last shown */
  timeLastShown: number | null;
  /** Submit count at last appearance */
  submitCountAtLastAppearance: number | null;
}

// ============================================
// Inbox (Worker Messages)
// ============================================

/**
 * Inbox message
 */
export interface InboxMessage {
  /** Message ID */
  id: string;
  /** Sender ID */
  senderId: string;
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: number;
}

/**
 * Inbox state
 */
export interface InboxState {
  /** Messages */
  messages: InboxMessage[];
}

// ============================================
// Background Tasks
// ============================================

/**
 * Task status
 */
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Background task
 */
export interface BackgroundTask {
  /** Task ID */
  id: string;
  /** Task type */
  type: string;
  /** Current status */
  status: TaskStatus;
  /** Start time */
  startTime: number;
  /** End time */
  endTime?: number;
  /** Result if completed */
  result?: unknown;
  /** Error if failed */
  error?: Error;
  /** Progress percentage (0-100) */
  progress?: number;
}

/**
 * Tasks storage
 */
export type TasksState = Record<string, BackgroundTask>;

// ============================================
// Attribution
// ============================================

/**
 * Model attribution info
 */
export interface Attribution {
  /** Model name */
  model?: string;
  /** Provider name */
  provider?: string;
  /** API version */
  apiVersion?: string;
}

// ============================================
// Linked Attachments
// ============================================

/**
 * Linked attachment
 */
export interface LinkedAttachment {
  /** Attachment path */
  path: string;
  /** Attachment type */
  type: 'file' | 'url' | 'image';
  /** When linked */
  linkedAt: number;
}

// ============================================
// Main App State
// ============================================

/**
 * Complete application state structure
 */
export interface AppState {
  // Core Configuration
  /** Merged user/project/local settings */
  settings: Settings;

  // Background Tasks
  /** Map of task ID to task object */
  tasks: TasksState;

  // Debug/Logging
  /** Verbose logging mode */
  verbose: boolean;

  // Model Configuration
  /** Default model from settings */
  mainLoopModel: string | null;
  /** Per-session model override */
  mainLoopModelForSession: string | null;

  // UI State
  /** Custom status line message */
  statusLineText: string | undefined;
  /** Todo panel expansion */
  showExpandedTodos: boolean;
  /** In-progress agents panel */
  showExpandedIPAgents: boolean;
  /** Selected agent index */
  selectedIPAgentIndex: number;

  // Tool Permissions
  /** Cross-module permission context */
  toolPermissionContext: ToolPermissionContext;

  // Agent System
  /** Current agent context */
  agent: AgentDefinition | undefined;
  /** Agent definitions */
  agentDefinitions: AgentDefinitions;

  // File History
  /** File history tracking */
  fileHistory: FileHistory;

  // Attribution
  /** Model/API attribution */
  attribution: Attribution;

  // MCP
  /** MCP system state */
  mcp: MCPState;

  // Plugins
  /** Plugin system state */
  plugins: PluginState;

  // Todos
  /** Todo list by session */
  todos: TodosState;

  // Notifications
  /** Notification system */
  notifications: NotificationState;

  // Elicitation
  /** User input elicitation */
  elicitation: ElicitationState;

  // Feature Flags
  /** Extended thinking enabled */
  thinkingEnabled: boolean;
  /** Prompt suggestions enabled */
  promptSuggestionEnabled: boolean;

  // Feedback
  /** Feedback survey state */
  feedbackSurvey: FeedbackSurveyState;

  // Hooks
  /** Session hooks configuration */
  sessionHooks: Record<string, unknown[]>;

  // Inbox
  /** Worker inbox */
  inbox: InboxState;

  // Worker Permissions
  /** Worker permission requests */
  workerPermissions: WorkerPermissionsState;
  /** Worker sandbox permissions */
  workerSandboxPermissions: WorkerPermissionsState;
  /** Pending worker request */
  pendingWorkerRequest: WorkerPermissionRequest | null;
  /** Pending sandbox request */
  pendingSandboxRequest: WorkerPermissionRequest | null;

  // Prompt Suggestions
  /** Prompt suggestion state */
  promptSuggestion: PromptSuggestionState;

  // Speculation
  /** Speculative execution state */
  speculation: SpeculationState;
  /** Time saved via speculation */
  speculationSessionTimeSavedMs: number;

  // Prompt Coaching
  /** Prompt coaching tips */
  promptCoaching: PromptCoachingState;

  // Command Queue
  /** Commands waiting to execute */
  queuedCommands: unknown[];

  // Linked Attachments
  /** Linked file attachments */
  linkedAttachments: LinkedAttachment[];

  // Git Integration
  /** Git diff state */
  gitDiff: GitDiffState;

  // Auth
  /** Auth state version */
  authVersion: number;

  // Initial Message
  /** Initial message for session */
  initialMessage: string | null;
}

// ============================================
// State Update Types
// ============================================

/**
 * State updater function
 */
export type StateUpdater = (state: AppState) => AppState;

/**
 * State change event
 */
export interface StateChangeEvent {
  /** New state */
  newState: AppState;
  /** Previous state */
  oldState: AppState | null;
}

/**
 * State change callback
 */
export type StateChangeCallback = (event: StateChangeEvent) => void;

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
