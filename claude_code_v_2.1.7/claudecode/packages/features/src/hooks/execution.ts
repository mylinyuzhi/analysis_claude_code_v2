/**
 * @claudecode/features - Hook Execution
 *
 * Main hook execution in REPL and non-REPL contexts.
 * Reconstructed from chunks.120.mjs:1532-2023
 */

import type { ConversationMessage } from '@claudecode/core';
import { streamApiCall, type MessagesRequest } from '@claudecode/core';
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
  PromptHook,
  AgentHook,
  HOOK_CONSTANTS,
} from './types.js';
import { getCurrentSessionId } from './context.js';
import { executeCommandHookWithResult } from './command-hook.js';
import { getMatchingHooks, isHooksDisabled } from './aggregation.js';
import type { MatchedHook } from './aggregation.js';
import { findSessionHook } from './state.js';
import {
  parseHookOutput,
  substituteArguments,
  parsePromptHookResponse,
} from './output-parser.js';

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

  const linkAbortSignals = (outer: AbortSignal | undefined, controller: AbortController) => {
    if (!outer) return;
    if (outer.aborted) {
      controller.abort();
      return;
    }
    outer.addEventListener('abort', () => controller.abort(), { once: true });
  };

  const runWithTimeout = async <T>(fn: (signal: AbortSignal) => Promise<T>, timeoutMs: number): Promise<T> => {
    const controller = new AbortController();
    linkAbortSignals(signal, controller);

    const t = setTimeout(() => controller.abort(), Math.max(0, timeoutMs));
    try {
      return await fn(controller.signal);
    } finally {
      clearTimeout(t);
    }
  };

  const extractTextFromAssistantContent = (content: unknown): string => {
    if (!Array.isArray(content)) return typeof content === 'string' ? content : '';
    let out = '';
    for (const block of content) {
      if (block && typeof block === 'object' && (block as any).type === 'text') {
        out += String((block as any).text ?? '');
      }
    }
    return out;
  };

  const runLLM = async (params: {
    model: string;
    system: string;
    user: string;
    maxTokens?: number;
    signal?: AbortSignal;
  }): Promise<string> => {
    const request: MessagesRequest = {
      model: params.model,
      system: params.system,
      messages: [{ role: 'user', content: params.user } as any],
      max_tokens: params.maxTokens ?? 1024,
      stream: true,
    };

    let text = '';
    for await (const ev of streamApiCall(request, {
      model: params.model,
      signal: params.signal,
    })) {
      if (!ev || typeof ev !== 'object') continue;
      if ((ev as any).type === 'assistant') {
        const msg = (ev as any).message;
        text += extractTextFromAssistantContent(msg?.content);
      }
      if ((ev as any).type === 'api_error') {
        const err = (ev as any).error;
        throw new Error(err?.message || 'LLM api_error');
      }
    }
    return text.trim();
  };

  // Handle prompt hooks
  if (hook.type === 'prompt') {
    const promptHook = hook as PromptHook;
    const timeoutMs = Math.max(0, (promptHook.timeout ?? 30) * 1000);
    const model = promptHook.model || process.env.ANTHROPIC_SMALL_FAST_MODEL || 'claude-3-5-haiku-20241022';

    const substituted = substituteArguments(promptHook.prompt, inputJson);
    const system =
      'You are a Claude Code prompt hook. You MUST reply with JSON only.\n' +
      'Schema: {"ok": boolean, "reason"?: string}.\n' +
      'Set ok=false if the operation should be blocked; include a short reason.';

    try {
      const stdout = await runWithTimeout(
        (sig) => runLLM({ model, system, user: substituted, maxTokens: 256, signal: sig }),
        timeoutMs
      );

      const parsed = parsePromptHookResponse(stdout);
      if (!parsed.success) {
        return {
          hook,
          outcome: 'non_blocking_error',
          message: `Prompt hook output is not valid JSON ({ok,reason}): ${parsed.error}`,
          stdout,
        };
      }

      if (!parsed.data.ok) {
        return {
          hook,
          outcome: 'blocking',
          preventContinuation: true,
          stopReason: parsed.data.reason,
          blockingError: {
            blockingError: parsed.data.reason || 'Prompt hook blocked operation',
          },
          stdout,
          output: parsed.data,
        };
      }

      return {
        hook,
        outcome: 'success',
        message: parsed.data.reason || 'Prompt hook approved',
        stdout,
        output: parsed.data,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const aborted = /aborted|AbortError/i.test(msg);
      return {
        hook,
        outcome: aborted ? 'cancelled' : 'non_blocking_error',
        message: aborted ? 'Prompt hook was cancelled' : `Prompt hook failed: ${msg}`,
      };
    }
  }

  // Handle agent hooks
  if (hook.type === 'agent') {
    const agentHook = hook as AgentHook;
    const timeoutMs = Math.max(0, (agentHook.timeout ?? 60) * 1000);
    const model = agentHook.model || 'claude-3-5-haiku-20241022';

    const hookPrompt =
      typeof agentHook.prompt === 'function'
        ? agentHook.prompt(_messages || [])
        : substituteArguments(agentHook.prompt, inputJson);

    const serializedMessages = (_messages || [])
      .slice(-30)
      .map((m) => {
        if (!m || typeof m !== 'object') return '';
        const t = (m as any).type;
        const role = t === 'assistant' ? 'assistant' : t === 'user' ? 'user' : t;
        const c = (m as any).message?.content;
        const txt = extractTextFromAssistantContent(c) || (typeof c === 'string' ? c : '');
        return `${role}: ${txt}`.trim();
      })
      .filter(Boolean)
      .join('\n');

    const user = `<hook_input>\n${inputJson}\n</hook_input>\n\n<conversation>\n${serializedMessages}\n</conversation>\n\n<hook_prompt>\n${hookPrompt}\n</hook_prompt>`;
    const system =
      'You are a Claude Code agent hook. Evaluate the hook_prompt given the conversation and hook_input.\n' +
      'Reply with either:\n' +
      '1) A JSON object compatible with hook output schema (e.g. {"continue": true} or {"continue": false, "stopReason": "..."} or {"decision": "block", "reason": "..."}), or\n' +
      '2) Plain text (treated as non-blocking additional info).\n' +
      'Prefer JSON when blocking.';

    try {
      const stdout = await runWithTimeout(
        (sig) => runLLM({ model, system, user, maxTokens: 512, signal: sig }),
        timeoutMs
      );

      const parsed = parseHookOutput(stdout);

      if (parsed.json) {
        // Blocking semantics are handled by the shared parser in executeSingleHook for command hooks.
        // We replicate key subset here.
        if ('continue' in parsed.json && (parsed.json as any).continue === false) {
          return {
            hook,
            outcome: 'blocking',
            preventContinuation: true,
            stopReason: (parsed.json as any).stopReason,
            blockingError: {
              blockingError: (parsed.json as any).stopReason || 'Agent hook prevented continuation',
            },
            stdout,
            output: parsed.json,
          };
        }
        if ('decision' in parsed.json && (parsed.json as any).decision === 'block') {
          return {
            hook,
            outcome: 'blocking',
            blockingError: {
              blockingError: (parsed.json as any).reason || 'Agent hook blocked operation',
            },
            stdout,
            output: parsed.json,
          };
        }

        return {
          hook,
          outcome: 'success',
          message: parsed.plainText || 'Agent hook completed',
          stdout,
          output: parsed.json,
        };
      }

      return {
        hook,
        outcome: 'success',
        message: parsed.plainText || 'Agent hook completed',
        stdout,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const aborted = /aborted|AbortError/i.test(msg);
      return {
        hook,
        outcome: aborted ? 'cancelled' : 'non_blocking_error',
        message: aborted ? 'Agent hook was cancelled' : `Agent hook failed: ${msg}`,
      };
    }
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
    const matchedHook = matchingHooks[i]!;
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

// NOTE: 符号已在声明处导出；移除重复聚合导出。
