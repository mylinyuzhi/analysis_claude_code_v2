/**
 * @claudecode/core - State Module
 *
 * Application state management for Claude Code.
 * Provides React context, hooks, and factory functions.
 *
 * Key components:
 * - AppState types (complete state structure)
 * - Factory functions (createDefaultAppState, etc.)
 * - React context (AppStateProvider)
 * - Hooks (useAppState, useAppStateSafe, etc.)
 */

// Re-export types
export * from './types.js';

// Re-export factory functions
export {
  createDefaultSettings,
  createDefaultPermissionContext,
  createDefaultAttribution,
  createDefaultAgentDefinitions,
  createDefaultFileHistory,
  createDefaultMCPState,
  createDefaultPluginState,
  createDefaultNotificationState,
  createDefaultElicitationState,
  createDefaultPromptSuggestionState,
  createDefaultSpeculationState,
  createDefaultWorkerPermissionsState,
  createDefaultPromptCoachingState,
  createDefaultGitDiffState,
  createDefaultFeedbackSurveyState,
  createDefaultInboxState,
  isExtendedThinkingEnabled,
  isPromptSuggestionEnabled,
  createDefaultAppState,
} from './factory.js';

// Re-export context and hooks
export {
  AppStateContext,
  ProviderInitializedContext,
  shallowEqual,
  subscribeToSettingsChanges,
  notifySettingsChange,
  AppStateProvider,
  useAppState,
  useAppStateSafe,
  useAppStateValue,
  useAppStateUpdater,
  useAppStateSelector,
} from './context.js';

// Re-export context types
export type { AppStateContextValue, AppStateProviderProps } from './context.js';
