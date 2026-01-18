/**
 * @claudecode/features - Hook State Management
 *
 * Add/remove hooks from session state.
 * Reconstructed from chunks.91.mjs:2782-2868
 */

import type {
  HookEventType,
  HookDefinition,
  TrackedHookEntry,
  TrackedHookMatcher,
  SessionHooksData,
  HookExecutionResult,
  HOOK_EVENT_TYPES,
} from './types.js';

// ============================================
// Logging Placeholder
// ============================================

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

// ============================================
// App State Type (Minimal)
// ============================================

interface AppState {
  sessionHooks: Record<string, SessionHooksData>;
}

type SetAppState = (updater: (state: AppState) => AppState) => void;

// ============================================
// Hook Equality
// ============================================

/**
 * Check if two hooks are equal.
 * Original: LVA in chunks.91.mjs
 */
export function isHookEqual(hook1: HookDefinition, hook2: HookDefinition): boolean {
  if (hook1.type !== hook2.type) return false;

  if (hook1.type === 'command' && hook2.type === 'command') {
    return hook1.command === hook2.command;
  }

  if (hook1.type === 'prompt' && hook2.type === 'prompt') {
    return hook1.prompt === hook2.prompt;
  }

  if (hook1.type === 'agent' && hook2.type === 'agent') {
    // For agent hooks, compare prompt strings
    const prompt1 = typeof hook1.prompt === 'function' ? 'fn' : hook1.prompt;
    const prompt2 = typeof hook2.prompt === 'function' ? 'fn' : hook2.prompt;
    return prompt1 === prompt2;
  }

  if (hook1.type === 'callback' && hook2.type === 'callback') {
    return hook1.callback === hook2.callback;
  }

  return false;
}

// ============================================
// Add Hook to State
// ============================================

/**
 * Add a hook to session state.
 * Original: pZ1 in chunks.91.mjs:2782-2784
 */
export function addSessionHook(
  setAppState: SetAppState,
  sessionId: string,
  eventType: HookEventType,
  matcher: string,
  hook: HookDefinition,
  onHookSuccess?: (hook: HookDefinition, result: HookExecutionResult) => void
): void {
  addHookToState(setAppState, sessionId, eventType, matcher, hook, onHookSuccess);
}

/**
 * Internal state update for adding hook.
 * Original: h32 in chunks.91.mjs:2798-2837
 */
function addHookToState(
  setAppState: SetAppState,
  sessionId: string,
  eventType: HookEventType,
  matcher: string,
  hook: HookDefinition,
  onHookSuccess?: (hook: HookDefinition, result: HookExecutionResult) => void
): void {
  setAppState((currentState) => {
    // Get or create session data
    const sessionData: SessionHooksData = currentState.sessionHooks[sessionId] || { hooks: {} };
    const eventHooks: TrackedHookMatcher[] = sessionData.hooks[eventType] || [];

    // Find existing matcher entry
    const existingIndex = eventHooks.findIndex((entry) => entry.matcher === matcher);
    let updatedHooks: TrackedHookMatcher[];

    if (existingIndex >= 0) {
      // Add to existing matcher
      updatedHooks = [...eventHooks];
      const existingEntry = updatedHooks[existingIndex];
      updatedHooks[existingIndex] = {
        matcher: existingEntry.matcher,
        hooks: [...existingEntry.hooks, { hook, onHookSuccess }],
      };
    } else {
      // Create new matcher entry
      updatedHooks = [
        ...eventHooks,
        {
          matcher,
          hooks: [{ hook, onHookSuccess }],
        },
      ];
    }

    return {
      ...currentState,
      sessionHooks: {
        ...currentState.sessionHooks,
        [sessionId]: {
          hooks: {
            ...sessionData.hooks,
            [eventType]: updatedHooks,
          },
        },
      },
    };
  });

  logDebug(`Added session hook for event ${eventType} in session ${sessionId}`);
}

// ============================================
// Remove Hook from State
// ============================================

/**
 * Remove a hook from session state.
 * Original: g32 in chunks.91.mjs:2839-2868
 */
export function removeHookFromState(
  setAppState: SetAppState,
  sessionId: string,
  eventType: HookEventType,
  hookToRemove: HookDefinition
): void {
  setAppState((currentState) => {
    const sessionData = currentState.sessionHooks[sessionId];
    if (!sessionData) return currentState;

    // Filter out the hook from all matchers
    const filteredMatchers = (sessionData.hooks[eventType] || [])
      .map((matcherEntry) => {
        const remainingHooks = matcherEntry.hooks.filter(
          (hookEntry) => !isHookEqual(hookEntry.hook, hookToRemove)
        );
        return remainingHooks.length > 0
          ? { ...matcherEntry, hooks: remainingHooks }
          : null;
      })
      .filter((entry): entry is TrackedHookMatcher => entry !== null);

    // Update or remove event type entry
    const updatedEventHooks: Partial<Record<HookEventType, TrackedHookMatcher[]>> =
      filteredMatchers.length > 0
        ? { ...sessionData.hooks, [eventType]: filteredMatchers }
        : { ...sessionData.hooks };

    if (filteredMatchers.length === 0) {
      delete updatedEventHooks[eventType];
    }

    return {
      ...currentState,
      sessionHooks: {
        ...currentState.sessionHooks,
        [sessionId]: { hooks: updatedEventHooks },
      },
    };
  });

  logDebug(`Removed session hook for event ${eventType} in session ${sessionId}`);
}

// ============================================
// Get Session Hooks
// ============================================

/**
 * Get hooks for a session.
 * Original: lZ1 in chunks.91.mjs:2877-2891
 */
export function getSessionHooks(
  appState: AppState,
  sessionId: string,
  eventType?: HookEventType
): Map<HookEventType, TrackedHookMatcher[]> {
  const sessionData = appState.sessionHooks[sessionId];
  if (!sessionData) return new Map();

  const result = new Map<HookEventType, TrackedHookMatcher[]>();

  if (eventType) {
    // Get hooks for specific event only
    const eventHooks = sessionData.hooks[eventType];
    if (eventHooks) {
      result.set(eventType, eventHooks);
    }
    return result;
  }

  // Get all session hooks
  const eventTypes: HookEventType[] = [
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
  ];

  for (const event of eventTypes) {
    const eventHooks = sessionData.hooks[event];
    if (eventHooks) {
      result.set(event, eventHooks);
    }
  }

  return result;
}

/**
 * Get function-type hooks for a session.
 * Original: u32 in chunks.91.mjs
 */
export function getSessionFunctionHooks(
  appState: AppState,
  sessionId: string
): Map<HookEventType, TrackedHookMatcher[]> {
  const allHooks = getSessionHooks(appState, sessionId);
  const functionHooks = new Map<HookEventType, TrackedHookMatcher[]>();

  for (const [eventType, matchers] of allHooks) {
    const functionMatchers = matchers
      .map((matcher) => ({
        ...matcher,
        hooks: matcher.hooks.filter((entry) => entry.hook.type === 'callback'),
      }))
      .filter((matcher) => matcher.hooks.length > 0);

    if (functionMatchers.length > 0) {
      functionHooks.set(eventType, functionMatchers);
    }
  }

  return functionHooks;
}

// ============================================
// Find Session Hook
// ============================================

/**
 * Find a specific session hook entry.
 * Original: m32 in chunks.91.mjs
 */
export function findSessionHook(
  appState: AppState,
  sessionId: string,
  eventType: HookEventType,
  matcher: string,
  hook: HookDefinition
): TrackedHookEntry | undefined {
  const sessionData = appState.sessionHooks[sessionId];
  if (!sessionData) return undefined;

  const eventHooks = sessionData.hooks[eventType];
  if (!eventHooks) return undefined;

  for (const matcherEntry of eventHooks) {
    if (matcherEntry.matcher === matcher) {
      for (const hookEntry of matcherEntry.hooks) {
        if (isHookEqual(hookEntry.hook, hook)) {
          return hookEntry;
        }
      }
    }
  }

  return undefined;
}

// ============================================
// Clear Session Hooks
// ============================================

/**
 * Clear all hooks for a session.
 * Original: wVA in chunks.91.mjs
 */
export function clearSessionHooks(setAppState: SetAppState, sessionId: string): void {
  setAppState((currentState) => {
    const { [sessionId]: _, ...remainingSessions } = currentState.sessionHooks;
    return {
      ...currentState,
      sessionHooks: remainingSessions,
    };
  });

  logDebug(`Cleared all hooks for session ${sessionId}`);
}

// ============================================
// Export
// ============================================

export {
  isHookEqual,
  addSessionHook,
  removeHookFromState,
  getSessionHooks,
  getSessionFunctionHooks,
  findSessionHook,
  clearSessionHooks,
};
