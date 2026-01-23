/**
 * @claudecode/features - Skill-Level Hooks
 *
 * Register hooks from skill frontmatter.
 * Reconstructed from chunks.112.mjs:2340-2354
 */

import type {
  HookEventType,
  HookDefinition,
  EventHooksConfig,
} from './types.js';
import { HOOK_EVENT_TYPES } from './types.js';
import { addSessionHook, removeHookFromState } from './state.js';

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

type SetAppState = (updater: (state: any) => any) => void;

/**
 * Register hooks from skill frontmatter.
 * Original: OD1 in chunks.112.mjs:2340-2354
 *
 * @param setAppState - State setter function
 * @param sessionId - Current session ID
 * @param hooksConfig - Hooks configuration from skill frontmatter
 * @param skillName - Name of the skill for logging
 * @returns Number of hooks registered
 */
export function registerSkillFrontmatterHooks(
  setAppState: SetAppState,
  sessionId: string,
  hooksConfig: EventHooksConfig,
  skillName: string
): number {
  let registeredCount = 0;

  for (const eventType of HOOK_EVENT_TYPES) {
    const eventMatchers = hooksConfig[eventType];
    if (!eventMatchers) continue;

    for (const matcher of eventMatchers) {
      for (const hook of matcher.hooks) {
        // Create removal callback for one-shot hooks
        // Original: D = I.once ? () => { ... g32(A, Q, Y, I) } : void 0
        const onSuccessCallback = hook.once
          ? () => {
              logDebug(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
              removeHookFromState(setAppState, sessionId, eventType, hook);
            }
          : undefined;

        // Register the hook
        addSessionHook(
          setAppState,
          sessionId,
          eventType,
          matcher.matcher || '',
          hook,
          onSuccessCallback
        );
        registeredCount++;
      }
    }
  }

  if (registeredCount > 0) {
    logDebug(`Registered ${registeredCount} hooks from skill '${skillName}'`);
  }

  return registeredCount;
}

/**
 * Unregister all hooks for a skill.
 * Called when skill execution completes.
 */
export function unregisterSkillHooks(
  setAppState: SetAppState,
  sessionId: string,
  hooksConfig: EventHooksConfig
): number {
  let removedCount = 0;

  for (const eventType of HOOK_EVENT_TYPES) {
    const eventMatchers = hooksConfig[eventType];
    if (!eventMatchers) continue;

    for (const matcher of eventMatchers) {
      for (const hook of matcher.hooks) {
        // Only remove non-once hooks (once hooks remove themselves)
        if (!hook.once) {
          removeHookFromState(setAppState, sessionId, eventType, hook);
          removedCount++;
        }
      }
    }
  }

  if (removedCount > 0) {
    logDebug(`Unregistered ${removedCount} hooks`);
  }

  return removedCount;
}
