/**
 * @claudecode/features - Hook Execution
 *
 * Main hook execution in REPL and non-REPL contexts.
 * Reconstructed from chunks.120.mjs:1532-2023
 */

import type { ConversationMessage } from '@claudecode/core';
import type {
  HookEventType,
  HookDefinition,
  HookInput,
  HookExecutionResult,
  HookOutcome,
  ExecuteHooksInREPLOptions,
  ExecuteHooksOutsideREPLOptions,
  NonREPLHookResult,
  CommandHook,
  HOOK_CONSTANTS,
} from './types.js';
import { getCurrentSessionId } from './context.js';
import { executeCommandHookWithResult } from './command-hook.js';
import { getMatchingHooks, isHooksDisabled, MatchedHook } from './aggregation.js';
import { findSessionHook } from './state.js';
import { parseHookOutput, substituteArguments } from './output-parser.js';

// ============================================
// Logging Placeholder
// ============================================

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

// ============================================
// Workspace Trust Check (Placeholder)
// ============================================

/**
 * Check if workspace trust is required.
 * Original: Ou2 in chunks.1.mjs
 */
function isWorkspaceTrustRequired(): boolean {
  // Placeholder - would check workspace trust state
  return false;
}

// ============================================
// Settings Check (Placeholder)
// ============================================

interface HookSettings {
  disableAllHooks?: boolean;
}

/**
 * Get hook settings.
 * Original: jQ in chunks.1.mjs
 */
function getSettings(): HookSettings {
  // Placeholder - would load settings
  return {};
}

// ============================================
// Parallel Async Iterator
// ============================================

/**
 * Stream async iterator for parallel execution.
 * Original: SVA in chunks.120.mjs
 * Yields results as each promise completes.
 */
async function* streamAsyncIterator<T>(promises: Promise<T>[]): AsyncGenerator<T> {
  const pending = new Map<number, Promise<{ index: number; value: T }>>();

  promises.forEach((promise, index) => {
    pending.set(
      index,
      promise.then((value) => ({ index, value }))
    );
  });

  while (pending.size > 0) {
    const result = await Promise.race(pending.values());
    pending.delete(result.index);
    yield result.value;
  }
}

// ============================================
// Execute Single Hook
// ============================================

/**
 * Execute a single hook.
 */
async function executeSingleHook(
  matchedHook: MatchedHook,
  eventType: HookEventType,
  hookName: string,
  inputJson: string,
  signal?: AbortSignal,
  hookIndex?: number,
  _toolUseContext?: unknown,
  _messages?: ConversationMessage[]
): Promise<HookExecutionResult> {
  const { hook, pluginRoot } = matchedHook;

  // Handle command hooks
  if (hook.type === 'command') {
    const result = await executeCommandHookWithResult(
      hook as CommandHook,
      eventType,
      hookName,
      inputJson,
      signal,
      hookIndex,
      pluginRoot
    );

    if (result.aborted) {
      return {
        hook,
        outcome: 'cancelled',
        message: 'Hook was cancelled',
      };
    }

    if (!result.succeeded) {
      return {
        hook,
        outcome: 'non_blocking_error',
        message: `Hook failed: ${result.output}`,
        stdout: result.output,
      };
    }

    // Parse output
    const parsed = parseHookOutput(result.output);

    if (parsed.json) {
      // Check for blocking
      if ('continue' in parsed.json && parsed.json.continue === false) {
        return {
          hook,
          outcome: 'blocking',
          blockingError: {
            blockingError: parsed.json.stopReason || 'Hook prevented continuation',
          },
          preventContinuation: true,
          stopReason: parsed.json.stopReason,
          output: parsed.json,
        };
      }

      if ('decision' in parsed.json && parsed.json.decision === 'block') {
        return {
          hook,
          outcome: 'blocking',
          blockingError: {
            blockingError: parsed.json.reason || 'Hook blocked operation',
          },
          output: parsed.json,
        };
      }
    }

    return {
      hook,
      outcome: 'success',
      message: parsed.plainText || 'Hook completed successfully',
      stdout: result.output,
      output: parsed.json,
    };
  }

  // Handle prompt hooks (placeholder)
  if (hook.type === 'prompt') {
    logDebug('Prompt hook execution - placeholder');
    return {
      hook,
      outcome: 'success',
      message: 'Prompt hook executed (placeholder)',
    };
  }

  // Handle agent hooks (placeholder)
  if (hook.type === 'agent') {
    logDebug('Agent hook execution - placeholder');
    return {
      hook,
      outcome: 'success',
      message: 'Agent hook executed (placeholder)',
    };
  }

  // Handle callback hooks
  if (hook.type === 'callback') {
    try {
      const hookInput = JSON.parse(inputJson) as HookInput;
      const result = await hook.callback(hookInput);

      if (result && 'continue' in result && result.continue === false) {
        return {
          hook,
          outcome: 'blocking',
          blockingError: {
            blockingError: result.stopReason || 'Callback prevented continuation',
          },
          preventContinuation: true,
          stopReason: result.stopReason,
        };
      }

      return {
        hook,
        outcome: 'success',
        message: 'Callback hook completed',
      };
    } catch (error) {
      return {
        hook,
        outcome: 'non_blocking_error',
        message: `Callback failed: ${error}`,
      };
    }
  }

  return {
    hook,
    outcome: 'non_blocking_error',
    message: `Unknown hook type: ${(hook as { type: string }).type}`,
  };
}

// ============================================
// Execute Hooks in REPL
// ============================================

/**
 * REPL hook execution result.
 */
export interface REPLHookYield {
  /** Progress update */
  type?: 'progress' | 'complete';
  /** Hook result */
  result?: HookExecutionResult;
  /** Prevent continuation flag */
  preventContinuation?: boolean;
  /** Stop reason */
  stopReason?: string;
}

/**
 * Execute hooks in REPL context.
 * Original: At in chunks.120.mjs:1532-1908
 *
 * @param options - Execution options
 * @yields Hook execution results and progress
 */
export async function* executeHooksInREPL(
  options: ExecuteHooksInREPLOptions
): AsyncGenerator<REPLHookYield> {
  const {
    hookInput,
    toolUseID,
    matchQuery,
    signal,
    timeoutMs = 60000,
    toolUseContext,
    messages,
  } = options;

  // Check if hooks are disabled
  if (getSettings().disableAllHooks) return;

  const eventType = hookInput.hook_event_name;
  const hookName = matchQuery ? `${eventType}:${matchQuery}` : eventType;

  // Check workspace trust
  if (isWorkspaceTrustRequired()) {
    logDebug(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return;
  }

  // Get app state and matching hooks
  const appState = toolUseContext
    ? await (toolUseContext as { getAppState: () => Promise<unknown> }).getAppState()
    : undefined;
  const sessionId =
    (toolUseContext as { agentId?: string })?.agentId ?? getCurrentSessionId();
  const matchingHooks = getMatchingHooks(appState, sessionId, eventType, hookInput);

  if (matchingHooks.length === 0) return;

  logDebug(`Found ${matchingHooks.length} matching hooks for ${hookName}`);

  // Prepare input JSON
  const inputJson = JSON.stringify(hookInput);

  // Track outcomes
  const outcomeCounters: Record<HookOutcome, number> = {
    success: 0,
    blocking: 0,
    non_blocking_error: 0,
    cancelled: 0,
  };

  // Execute hooks in parallel
  const hookPromises = matchingHooks.map((matchedHook, index) =>
    executeSingleHook(
      matchedHook,
      eventType,
      hookName,
      inputJson,
      signal,
      index,
      toolUseContext,
      messages
    )
  );

  // Process results as they complete
  for await (const result of streamAsyncIterator(hookPromises)) {
    outcomeCounters[result.outcome]++;

    // Check for one-shot hooks
    if (result.hook.once && result.outcome === 'success' && appState) {
      const sessionHookEntry = findSessionHook(
        appState as never,
        sessionId,
        eventType,
        matchQuery || '',
        result.hook
      );

      if (sessionHookEntry?.onHookSuccess) {
        try {
          sessionHookEntry.onHookSuccess(result.hook, result);
        } catch (error) {
          logDebug(`Session hook success callback failed: ${error}`);
        }
      }
    }

    // Yield blocking results
    if (result.preventContinuation) {
      yield {
        preventContinuation: true,
        stopReason: result.stopReason,
        result,
      };
      return;
    }

    // Yield result
    yield { result };
  }

  logDebug(
    `Hook execution complete: ${outcomeCounters.success} success, ` +
      `${outcomeCounters.blocking} blocking, ${outcomeCounters.non_blocking_error} errors`
  );
}

// ============================================
// Execute Hooks Outside REPL
// ============================================

/**
 * Execute hooks outside REPL context.
 * Original: pU0 in chunks.120.mjs:1910-2023
 *
 * Only command hooks are supported.
 * Returns array of results instead of async generator.
 */
export async function executeHooksOutsideREPL(
  options: ExecuteHooksOutsideREPLOptions
): Promise<NonREPLHookResult[]> {
  const { getAppState, hookInput, matchQuery, signal, timeoutMs = 60000 } = options;

  const eventType = hookInput.hook_event_name;
  const hookName = matchQuery ? `${eventType}:${matchQuery}` : eventType;

  if (getSettings().disableAllHooks) {
    logDebug(`Skipping hooks for ${hookName} due to 'disableAllHooks' setting`);
    return [];
  }

  if (isWorkspaceTrustRequired()) {
    logDebug(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return [];
  }

  // Get app state
  const appState = getAppState ? await getAppState() : undefined;
  const sessionId = getCurrentSessionId();
  const matchingHooks = getMatchingHooks(appState, sessionId, eventType, hookInput);

  if (matchingHooks.length === 0) return [];

  const results: NonREPLHookResult[] = [];
  const inputJson = JSON.stringify(hookInput);

  for (let i = 0; i < matchingHooks.length; i++) {
    const matchedHook = matchingHooks[i];
    const { hook, pluginRoot } = matchedHook;

    // Only command hooks supported outside REPL
    if (hook.type !== 'command') {
      results.push({
        succeeded: false,
        output: `${hook.type} hooks are only supported in REPL context`,
        command: `[${hook.type} hook]`,
      });
      continue;
    }

    const result = await executeCommandHookWithResult(
      hook as CommandHook,
      eventType,
      hookName,
      inputJson,
      signal,
      i,
      pluginRoot
    );

    results.push({
      succeeded: result.succeeded,
      output: result.output,
      command: (hook as CommandHook).command,
    });
  }

  return results;
}

// ============================================
// Export
// ============================================

export {
  executeHooksInREPL,
  executeHooksOutsideREPL,
  REPLHookYield,
};
