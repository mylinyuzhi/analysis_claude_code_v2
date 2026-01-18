/**
 * @claudecode/core - State Context
 *
 * React context and hooks for application state management.
 * Reconstructed from chunks.135.mjs:1331-1419
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type {
  AppState,
  StateUpdater,
  StateChangeEvent,
  StateChangeCallback,
  ToolPermissionContext,
} from './types.js';
import { createDefaultAppState, createDefaultPermissionContext } from './factory.js';

// ============================================
// Context Types
// ============================================

/**
 * State context value type
 */
export type AppStateContextValue = [AppState, (updater: StateUpdater) => void] & {
  __IS_INITIALIZED__?: boolean;
};

/**
 * App state provider props
 */
export interface AppStateProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Initial state (optional, uses default if not provided) */
  initialState?: AppState;
  /** Callback when state changes */
  onChangeAppState?: StateChangeCallback;
}

// ============================================
// Shallow Equality Check
// ============================================

/**
 * Shallow equality check for state objects.
 * Original: SG7 in chunks.135.mjs:1225-1233
 */
export function shallowEqual<T extends Record<string, unknown>>(
  objA: T,
  objB: T
): boolean {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

// ============================================
// Context Creation
// ============================================

/**
 * Main app state context.
 * Original: RM0 in chunks.135.mjs:1419
 */
const AppStateContext = createContext<AppStateContextValue>([
  {} as AppState,
  (updater) => updater,
] as AppStateContextValue);

/**
 * Provider initialized context (prevents nesting).
 * Original: c19 in chunks.135.mjs:1419
 */
const ProviderInitializedContext = createContext<boolean>(false);

// ============================================
// Permission Helpers
// ============================================

/**
 * Check if remote bypass is disabled.
 * Original: phA in chunks.135.mjs
 */
function isRemoteBypassDisabled(): boolean {
  return process.env.CLAUDE_CODE_DISABLE_BYPASS === 'true';
}

/**
 * Disable bypass mode.
 * Original: lhA in chunks.135.mjs
 */
function disableBypassMode(context: ToolPermissionContext): ToolPermissionContext {
  return {
    ...context,
    isBypassPermissionsModeAvailable: false,
    mode: context.mode === 'bypassPermissions' ? 'default' : context.mode,
  };
}

/**
 * Merge permission contexts.
 * Original: p19 in chunks.135.mjs
 */
function mergePermissionContexts(
  current: ToolPermissionContext,
  updates: Partial<ToolPermissionContext>
): ToolPermissionContext {
  return {
    ...current,
    ...updates,
    sessionPermissions: new Map([
      ...current.sessionPermissions,
      ...(updates.sessionPermissions ?? new Map()),
    ]),
  };
}

// ============================================
// Settings Subscription (Placeholder)
// ============================================

type SettingsChangeCallback = (source: string, settings: unknown) => void;
const settingsSubscribers: SettingsChangeCallback[] = [];

/**
 * Subscribe to settings file changes.
 * Original: EDA in chunks.135.mjs
 */
export function subscribeToSettingsChanges(callback: SettingsChangeCallback): () => void {
  settingsSubscribers.push(callback);
  return () => {
    const index = settingsSubscribers.indexOf(callback);
    if (index >= 0) {
      settingsSubscribers.splice(index, 1);
    }
  };
}

/**
 * Notify settings changes (for internal use).
 */
export function notifySettingsChange(source: string, settings: unknown): void {
  for (const callback of settingsSubscribers) {
    callback(source, settings);
  }
}

// ============================================
// App State Provider
// ============================================

/**
 * React context provider for global app state.
 * Original: b5 in chunks.135.mjs:1331-1384
 */
export function AppStateProvider({
  children,
  initialState,
  onChangeAppState,
}: AppStateProviderProps): React.ReactElement {
  // Prevent nested providers
  if (useContext(ProviderInitializedContext)) {
    throw new Error('AppStateProvider can not be nested within another AppStateProvider');
  }

  // State container with current and previous for change detection
  const [stateContainer, setStateContainer] = useState<{
    currentState: AppState;
    previousState: AppState | null;
  }>({
    currentState: initialState ?? createDefaultAppState(),
    previousState: null,
  });

  // State updater with shallow equality check and change notification
  const updateState = useCallback(
    (updaterFn: StateUpdater) => {
      setStateContainer((container) => {
        const { currentState: previousState } = container;
        const newState = updaterFn(previousState);

        // Skip update if shallow equal (optimization)
        if (shallowEqual(newState, previousState)) {
          return container;
        }

        const newContainer = {
          currentState: newState,
          previousState,
        };

        // Notify parent of change
        onChangeAppState?.({
          newState: newContainer.currentState,
          oldState: newContainer.previousState,
        });

        return newContainer;
      });
    },
    [onChangeAppState]
  );

  // Memoized context value
  const contextValue = useMemo<AppStateContextValue>(() => {
    const value = [stateContainer.currentState, updateState] as AppStateContextValue;
    value.__IS_INITIALIZED__ = true;
    return value;
  }, [stateContainer.currentState, updateState]);

  // Effect: Disable bypass mode if remotely disabled
  useEffect(() => {
    const { toolPermissionContext } = stateContainer.currentState;
    if (toolPermissionContext.isBypassPermissionsModeAvailable && isRemoteBypassDisabled()) {
      console.log('Disabling bypass permissions mode on mount');
      updateState((state) => ({
        ...state,
        toolPermissionContext: disableBypassMode(state.toolPermissionContext),
      }));
    }
  }, []);

  // Subscribe to settings file changes
  useEffect(() => {
    const unsubscribe = subscribeToSettingsChanges((source, newSettings) => {
      console.log(`Settings changed from ${source}, updating AppState`);
      updateState((state) => {
        const permissionUpdates = createDefaultPermissionContext();
        let newPermissionContext = mergePermissionContexts(
          state.toolPermissionContext,
          permissionUpdates
        );
        if (newPermissionContext.isBypassPermissionsModeAvailable && isRemoteBypassDisabled()) {
          newPermissionContext = disableBypassMode(newPermissionContext);
        }
        return {
          ...state,
          settings: newSettings as AppState['settings'],
          toolPermissionContext: newPermissionContext,
        };
      });
    });

    return unsubscribe;
  }, [updateState]);

  // Render with nested provider flag
  return React.createElement(
    ProviderInitializedContext.Provider,
    { value: true },
    React.createElement(AppStateContext.Provider, { value: contextValue }, children)
  );
}

// ============================================
// Hooks
// ============================================

/**
 * Hook to access app state and updater.
 * Original: a0 in chunks.135.mjs:1386-1390
 *
 * @throws ReferenceError if called outside AppStateProvider
 */
export function useAppState(): AppStateContextValue {
  const contextValue = useContext(AppStateContext);
  if (!contextValue.__IS_INITIALIZED__) {
    throw new ReferenceError('useAppState cannot be called outside of an <AppStateProvider />');
  }
  return contextValue;
}

/**
 * Safe hook variant that returns null outside provider.
 * Original: HZ2 in chunks.135.mjs:1392-1396
 */
export function useAppStateSafe(): AppStateContextValue | null {
  const contextValue = useContext(AppStateContext);
  if (!contextValue.__IS_INITIALIZED__) {
    return null;
  }
  return contextValue;
}

/**
 * Hook to get just the current state (read-only).
 */
export function useAppStateValue(): AppState {
  const [state] = useAppState();
  return state;
}

/**
 * Hook to get just the state updater.
 */
export function useAppStateUpdater(): (updater: StateUpdater) => void {
  const [, setAppState] = useAppState();
  return setAppState;
}

/**
 * Hook to select a specific part of state.
 */
export function useAppStateSelector<T>(selector: (state: AppState) => T): T {
  const [state] = useAppState();
  return selector(state);
}

// ============================================
// Export
// ============================================

export {
  AppStateContext,
  ProviderInitializedContext,
  shallowEqual,
  isRemoteBypassDisabled,
  disableBypassMode,
  mergePermissionContexts,
  AppStateProvider,
  useAppState,
  useAppStateSafe,
  useAppStateValue,
  useAppStateUpdater,
  useAppStateSelector,
};
