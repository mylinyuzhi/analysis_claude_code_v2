/**
 * @claudecode/core - State Factory Functions
 *
 * Factory functions for creating default state structures.
 * Reconstructed from chunks.135.mjs:1235-1329
 */

import type {
  AppState,
  Settings,
  ToolPermissionContext,
  AgentDefinitions,
  FileHistory,
  MCPState,
  PluginState,
  NotificationState,
  ElicitationState,
  PromptSuggestionState,
  SpeculationState,
  WorkerPermissionsState,
  PromptCoachingState,
  GitDiffState,
  FeedbackSurveyState,
  InboxState,
  Attribution,
} from './types.js';

// ============================================
// Default Settings
// ============================================

/**
 * Create default settings.
 * Original: r3 in chunks.135.mjs
 */
export function createDefaultSettings(): Settings {
  return {
    features: {},
    permissions: [],
    ui: {
      showTodos: false,
      verbose: false,
    },
    hooks: {},
    mcp: {},
  };
}

// ============================================
// Default Permission Context
// ============================================

/**
 * Create default permission context.
 * Original: oL in chunks.135.mjs
 */
export function createDefaultPermissionContext(): ToolPermissionContext {
  return {
    mode: 'default',
    isBypassPermissionsModeAvailable: false,
    shouldAvoidPermissionPrompts: false,
    sessionPermissions: new Map(),
    grantedPermissions: [],
    deniedPermissions: [],
    rules: [],
  };
}

// ============================================
// Default Attribution
// ============================================

/**
 * Create default attribution.
 * Original: z91 in chunks.135.mjs
 */
export function createDefaultAttribution(): Attribution {
  return {
    model: undefined,
    provider: undefined,
    apiVersion: undefined,
  };
}

// ============================================
// Default Sub-State Factories
// ============================================

/**
 * Create default agent definitions.
 */
export function createDefaultAgentDefinitions(): AgentDefinitions {
  return {
    activeAgents: [],
    allAgents: [],
  };
}

/**
 * Create default file history.
 */
export function createDefaultFileHistory(): FileHistory {
  return {
    snapshots: [],
    trackedFiles: new Set(),
  };
}

/**
 * Create default MCP state.
 */
export function createDefaultMCPState(): MCPState {
  return {
    clients: [],
    tools: [],
    commands: [],
    resources: {},
  };
}

/**
 * Create default plugin state.
 */
export function createDefaultPluginState(): PluginState {
  return {
    enabled: [],
    disabled: [],
    commands: [],
    agents: [],
    errors: [],
    installationStatus: {
      marketplaces: [],
      plugins: [],
    },
  };
}

/**
 * Create default notification state.
 */
export function createDefaultNotificationState(): NotificationState {
  return {
    current: null,
    queue: [],
  };
}

/**
 * Create default elicitation state.
 */
export function createDefaultElicitationState(): ElicitationState {
  return {
    queue: [],
  };
}

/**
 * Create default prompt suggestion state.
 */
export function createDefaultPromptSuggestionState(): PromptSuggestionState {
  return {
    text: null,
    promptId: null,
    shownAt: 0,
    acceptedAt: 0,
    generationRequestId: null,
  };
}

/**
 * Create default speculation state.
 * Original: FzA in chunks.135.mjs
 */
export function createDefaultSpeculationState(): SpeculationState {
  return {
    status: 'idle',
  };
}

/**
 * Create default worker permissions state.
 */
export function createDefaultWorkerPermissionsState(): WorkerPermissionsState {
  return {
    queue: [],
    selectedIndex: 0,
  };
}

/**
 * Create default prompt coaching state.
 */
export function createDefaultPromptCoachingState(): PromptCoachingState {
  return {
    tip: null,
    shownAt: 0,
  };
}

/**
 * Create default git diff state.
 */
export function createDefaultGitDiffState(): GitDiffState {
  return {
    stats: null,
    perFileStats: new Map(),
    hunks: new Map(),
    lastUpdated: 0,
  };
}

/**
 * Create default feedback survey state.
 */
export function createDefaultFeedbackSurveyState(): FeedbackSurveyState {
  return {
    timeLastShown: null,
    submitCountAtLastAppearance: null,
  };
}

/**
 * Create default inbox state.
 */
export function createDefaultInboxState(): InboxState {
  return {
    messages: [],
  };
}

// ============================================
// Feature Flag Helpers
// ============================================

/**
 * Check if extended thinking is enabled.
 * Original: q91 in chunks.135.mjs
 */
export function isExtendedThinkingEnabled(): boolean {
  // Check environment variable or settings
  return process.env.CLAUDE_CODE_EXTENDED_THINKING === 'true';
}

/**
 * Check if prompt suggestions are enabled.
 * Original: uH1 in chunks.135.mjs
 */
export function isPromptSuggestionEnabled(): boolean {
  // Check environment variable or settings
  return process.env.CLAUDE_CODE_PROMPT_SUGGESTIONS !== 'false';
}

// ============================================
// Main Factory Function
// ============================================

/**
 * Create default application state.
 * Original: HzA in chunks.135.mjs:1235-1329
 */
export function createDefaultAppState(): AppState {
  return {
    // Core Configuration
    settings: createDefaultSettings(),

    // Background Tasks
    tasks: {},

    // Debug/Logging
    verbose: false,

    // Model Configuration
    mainLoopModel: null,
    mainLoopModelForSession: null,

    // UI State
    statusLineText: undefined,
    showExpandedTodos: false,
    showExpandedIPAgents: false,
    selectedIPAgentIndex: 0,

    // Tool Permissions
    toolPermissionContext: {
      ...createDefaultPermissionContext(),
      mode: 'default',
    },

    // Agent System
    agent: undefined,
    agentDefinitions: createDefaultAgentDefinitions(),

    // File History
    fileHistory: createDefaultFileHistory(),

    // Attribution
    attribution: createDefaultAttribution(),

    // MCP
    mcp: createDefaultMCPState(),

    // Plugins
    plugins: createDefaultPluginState(),

    // Todos
    todos: {},

    // Notifications
    notifications: createDefaultNotificationState(),

    // Elicitation
    elicitation: createDefaultElicitationState(),

    // Feature Flags
    thinkingEnabled: isExtendedThinkingEnabled(),
    promptSuggestionEnabled: isPromptSuggestionEnabled(),

    // Feedback
    feedbackSurvey: createDefaultFeedbackSurveyState(),

    // Hooks
    sessionHooks: {},

    // Inbox
    inbox: createDefaultInboxState(),

    // Worker Permissions
    workerPermissions: createDefaultWorkerPermissionsState(),
    workerSandboxPermissions: createDefaultWorkerPermissionsState(),
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,

    // Prompt Suggestions
    promptSuggestion: createDefaultPromptSuggestionState(),

    // Speculation
    speculation: createDefaultSpeculationState(),
    speculationSessionTimeSavedMs: 0,

    // Prompt Coaching
    promptCoaching: createDefaultPromptCoachingState(),

    // Command Queue
    queuedCommands: [],

    // Linked Attachments
    linkedAttachments: [],

    // Git Integration
    gitDiff: createDefaultGitDiffState(),

    // Auth
    authVersion: 0,

    // Initial Message
    initialMessage: null,

    // Team
    teamContext: undefined,
  };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
