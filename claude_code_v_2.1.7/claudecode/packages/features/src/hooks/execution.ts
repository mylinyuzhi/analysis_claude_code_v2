/**
 * @claudecode/features - Hook Execution
 *
 * Main hook execution in REPL and non-REPL contexts.
 * Reconstructed from chunks.120.mjs:1532-2023
 */

import type { ConversationMessage } from '@claudecode/core';
import { agentLoop, streamApiCall, type MessagesRequest } from '@claudecode/core';
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
  InternalFunctionHook,
  HOOK_CONSTANTS,
} from './types.js';
import { getCurrentSessionId } from './context.js';
import { getMatchingHooks, isHooksDisabled } from './aggregation.js';
import type { MatchedHook } from './aggregation.js';
import { findSessionHook } from './state.js';
import {
  parseHookOutput,
  substituteArguments,
  parsePromptHookResponse,
  processHookJsonOutput,
} from './output-parser.js';
import { executeCommandHook, executeCommandHookWithResult } from './command-hook.js';

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
  const settings = (globalThis as any).__claudeSettings;
  if (settings && typeof settings === 'object') {
    const accepted = (settings as any).sessionTrustAccepted ?? (settings as any).workspaceTrustAccepted;
    if (accepted === false) return true;
    if (accepted === true) return false;
  }

  // Optional runtime override (CLI/IDE integration can set this)
  const globalAccepted = (globalThis as any).__claudeWorkspaceTrustAccepted;
  if (globalAccepted === false) return true;
  return false;
}

// ============================================
// Settings Check (Placeholder)
// ============================================

/**
 * Get hook settings.
 * Original: jQ in chunks.1.mjs
 */
function getSettings(): { disableAllHooks?: boolean } {
  const settings = (globalThis as any).__claudeSettings;
  const hookSettings = settings && typeof settings === 'object' && (settings as any).hooks && typeof (settings as any).hooks === 'object'
    ? (settings as any).hooks
    : settings;
  return (hookSettings && typeof hookSettings === 'object') ? hookSettings : {};
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
 * Execute an agent-based hook (sub-agent verifier).
 * Original: Nu2 in chunks.120.mjs:986-1142
 */
async function executeAgentHook(
  hook: AgentHook,
  eventType: HookEventType,
  hookName: string,
  inputJson: string,
  signal?: AbortSignal,
  toolUseContext?: any,
  messages?: ConversationMessage[]
): Promise<HookExecutionResult> {
  if (!toolUseContext || !messages) {
    return {
      hook,
      outcome: 'non_blocking_error',
      message: 'Agent hook requires ToolUseContext and Messages',
    };
  }

  const agentId = `hook-agent-${crypto.randomUUID().slice(0, 8)}`;
  const transcriptPath = (toolUseContext as any)?.transcriptPath || '';
  const timeoutMs = hook.timeout ? hook.timeout * 1000 : 60000;
  
  // 1. Substitute arguments in prompt
  const promptText = typeof hook.prompt === 'function' 
    ? hook.prompt(messages) 
    : substituteArguments(hook.prompt, inputJson);

  // 2. Prepare sub-agent tool context
  // Nu2 (chunks.120.mjs:1021-1048) logic:
  // Creates a child context with restricted permissions but access to transcript
  const subAgentContext = {
    ...toolUseContext,
    agentId,
    abortController: new AbortController(),
    options: {
      ...toolUseContext.options,
      isNonInteractiveSession: true,
      mainLoopModel: hook.model || 'claude-3-5-haiku-20241022',
      maxThinkingTokens: 0,
    },
    async getAppState() {
      const state = await toolUseContext.getAppState();
      const sessionRules = state.toolPermissionContext.alwaysAllowRules.session ?? [];
      return {
        ...state,
        toolPermissionContext: {
          ...state.toolPermissionContext,
          mode: 'dontAsk',
          alwaysAllowRules: {
            ...state.toolPermissionContext.alwaysAllowRules,
            session: [...sessionRules, `Read(/${transcriptPath})`],
          },
        },
      };
    },
  };

  try {
    let result: any = null;
    let turnCount = 0;

    const systemPrompt = [
      `You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${transcriptPath}\n` +
      `You can read this file to analyze the conversation history if needed.\n\n` +
      `Use the available tools to inspect the codebase and verify the condition.\n` +
      `Use as few steps as possible - be efficient and direct.\n\n` +
      `When done, return your result using the StructuredOutput tool with:\n` +
      `- ok: true if the condition is met\n` +
      `- ok: false with reason if the condition is not met`
    ];

    // Nu2 (chunks.120.mjs:1053-1076) execution loop
    for await (const event of agentLoop.coreMessageLoop({
      messages: [
        { 
          type: 'user', 
          uuid: crypto.randomUUID(), 
          timestamp: new Date().toISOString(), 
          message: { role: 'user', content: promptText } 
        } as any
      ],
      systemPrompt,
      canUseTool: async () => true, // sub-agent can use tools in dontAsk mode
      toolUseContext: subAgentContext,
      querySource: 'hook_agent',
    })) {
      if (event.type === 'assistant') {
        turnCount++;
        if (turnCount >= 50) {
          subAgentContext.abortController.abort();
          break;
        }
      }

      // Nu2 (chunks.120.mjs:1069) watches for structured_output
      if (event.type === 'attachment' && (event as any).attachment?.type === 'structured_output') {
        result = (event as any).attachment.data;
        subAgentContext.abortController.abort();
        break;
      }
    }

    if (!result) {
      if (turnCount >= 50) {
        return {
          hook,
          outcome: 'cancelled',
          message: 'Agent hook exceeded max turns (50)',
        };
      }
      return {
        hook,
        outcome: 'non_blocking_error',
        message: 'Agent hook failed to return structured output',
      };
    }

    // Nu2 (chunks.120.mjs:1115-1135) result processing
    if (!result.ok) {
      return {
        hook,
        outcome: 'blocking',
        preventContinuation: true,
        stopReason: result.reason || 'Agent hook condition not met',
        blockingError: {
          blockingError: result.reason || 'Agent hook condition not met',
        },
      };
    }

    return {
      hook,
      outcome: 'success',
      message: result.reason || 'Agent hook approved condition',
    };
  } catch (error) {
    return {
      hook,
      outcome: 'non_blocking_error',
      message: `Agent hook execution failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Execute a function-based hook (internal state updates).
 * Original: ol5 in chunks.120.mjs:2297-2364
 */
async function executeFunctionHook(
  hook: InternalFunctionHook,
  eventType: HookEventType,
  hookName: string,
  signal?: AbortSignal,
  timeoutMs: number = 60000,
  messages?: ConversationMessage[]
): Promise<HookExecutionResult> {
  const timeout = hook.timeout ?? timeoutMs;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // In a real impl, we'd use AbortSignal.any([signal, controller.signal])
  const combinedSignal = controller.signal;

  try {
    if (combinedSignal.aborted) {
      return {
        hook,
        outcome: 'cancelled',
      };
    }

    // ol5 (chunks.120.mjs:2318) logic:
    // Executes the callback with messages and the abort signal
    const result = await Promise.resolve(hook.callback(messages || [], combinedSignal));

    if (result) {
      return {
        hook,
        outcome: 'success',
      };
    }

    return {
      hook,
      outcome: 'blocking',
      blockingError: {
        blockingError: hook.errorMessage || 'Function hook blocked operation',
      },
    };
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || error.message === 'Function hook cancelled')) {
      return {
        hook,
        outcome: 'cancelled',
      };
    }
    return {
      hook,
      outcome: 'non_blocking_error',
      message: `Function hook failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Execute a single hook.


 * Reconstructed from At map loop in chunks.120.mjs:1587-1810
 */
async function executeSingleHook(
  matchedHook: MatchedHook,
  eventType: HookEventType,
  hookName: string,
  inputJson: string,
  signal?: AbortSignal,
  hookIndex?: number,
  toolUseContext?: any,
  messages?: ConversationMessage[]
): Promise<HookExecutionResult> {
  const { hook, pluginRoot } = matchedHook;
  const timeoutMs = (hook as any).timeout ? (hook as any).timeout * 1000 : 60000;

  // 1. Handle callback hooks (Internal JS callbacks)
  // Original: rl5 in chunks.120.mjs:1597
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

  // 2. Handle function hooks (Internal state update hooks)
  // Original: ol5 in chunks.120.mjs:1623
  if (hook.type === 'function') {
    return await executeFunctionHook(
      hook as InternalFunctionHook,
      eventType,
      hookName,
      signal,
      timeoutMs,
      messages
    );
  }

  // 3. Handle prompt hooks (LLM-based verification)
  // Original: w82 in chunks.92.mjs
  if (hook.type === 'prompt') {
    const promptHook = hook as PromptHook;
    const substituted = substituteArguments(promptHook.prompt, inputJson);
    const system =
      'You are a Claude Code prompt hook. You MUST reply with JSON only.\n' +
      'Schema: {"ok": boolean, "reason"?: string}.\n' +
      'Set ok=false if the operation should be blocked; include a short reason.';

    try {
      const stdout = await runWithTimeout(
        async (sig) => {
          return await runLLM({
            model: promptHook.model || 'claude-3-5-haiku-20241022',
            system,
            user: substituted,
            maxTokens: 256,
            signal: sig,
          });
        },
        timeoutMs,
        signal
      );

      const parsed = parsePromptHookResponse(stdout);
      if (!parsed.success) {
        return {
          hook,
          outcome: 'non_blocking_error',
          message: `Prompt hook output is not valid JSON: ${parsed.error}`,
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
          output: parsed.data as any,
        };
      }

      return {
        hook,
        outcome: 'success',
        message: parsed.data.reason || 'Prompt hook approved',
        stdout,
        output: parsed.data as any,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        hook,
        outcome: /aborted/i.test(msg) ? 'cancelled' : 'non_blocking_error',
        message: `Prompt hook failed: ${msg}`,
      };
    }
  }

  // 4. Handle agent hooks (Sub-agent verifier)
  // Original: Nu2 in chunks.120.mjs:1667
  if (hook.type === 'agent') {
    return await executeAgentHook(
      hook as AgentHook,
      eventType,
      hookName,
      inputJson,
      signal,
      toolUseContext,
      messages
    );
  }

  // 5. Handle command hooks (Shell commands)
  // Original: chunks.120.mjs:1670-1809
  try {
    const cmdResult = await executeCommandHook(
      hook as CommandHook,
      eventType,
      hookName,
      inputJson,
      signal,
      hookIndex,
      pluginRoot
    );

    if (cmdResult.aborted) {
      return {
        hook,
        outcome: 'cancelled',
        message: 'Hook was cancelled',
      };
    }

    const { json, validationError } = parseHookOutput(cmdResult.stdout);

    if (validationError) {
      return {
        hook,
        outcome: 'non_blocking_error',
        message: `JSON validation failed: ${validationError}`,
        stdout: cmdResult.stdout,
        stderr: cmdResult.stderr,
      };
    }

    if (json) {
      const structured = processHookJsonOutput({
        json,
        command: (hook as CommandHook).command,
        hookName,
        hookEvent: eventType,
        expectedHookEvent: eventType,
        stdout: cmdResult.stdout,
        stderr: cmdResult.stderr,
        exitCode: cmdResult.status,
      });

      return {
        ...structured,
        hook,
      };
    }

    if (cmdResult.status === 0) {
      return {
        hook,
        outcome: 'success',
        message: cmdResult.stdout.trim() || 'Hook completed successfully',
        stdout: cmdResult.stdout,
        stderr: cmdResult.stderr,
      };
    }

    if (cmdResult.status === 2) {
      return {
        hook,
        outcome: 'blocking',
        blockingError: {
          blockingError: `[${(hook as CommandHook).command}]: ${cmdResult.stderr || 'No stderr output'}`,
        },
      };
    }

    return {
      hook,
      outcome: 'non_blocking_error',
      message: `Failed with status code: ${cmdResult.status}`,
      stdout: cmdResult.stdout,
      stderr: cmdResult.stderr,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      hook,
      outcome: 'non_blocking_error',
      message: `Failed to run command hook: ${msg}`,
    };
  }
}

/**
 * Run with timeout helper.
 */
async function runWithTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  outerSignal?: AbortSignal
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const onAbort = () => controller.abort();
  if (outerSignal) {
    outerSignal.addEventListener('abort', onAbort);
  }

  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timeoutId);
    if (outerSignal) {
      outerSignal.removeEventListener('abort', onAbort);
    }
  }
}

/**
 * Execute LLM call for hooks.
 */
async function runLLM(params: {
  model: string;
  system: string;
  user: string;
  maxTokens: number;
  signal: AbortSignal;
}): Promise<string> {
  let text = '';
  try {
    for await (const ev of streamApiCall({
      messages: [{ role: 'user', content: params.user } as any],
      systemPrompt: params.system,
      signal: params.signal,
      options: {
        model: params.model,
        signal: params.signal,
      } as any,
    })) {
      if (!ev || typeof ev !== 'object') continue;
      if ((ev as any).type === 'assistant') {
        const content = (ev as any).message?.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === 'text') text += block.text;
          }
        } else if (typeof content === 'string') {
          text += content;
        }
      }
      if ((ev as any).type === 'api_error') {
        throw new Error((ev as any).error?.message || 'LLM api_error');
      }
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw e;
  }
  return text.trim();
}

// ============================================
// Execute Hooks in REPL
// ============================================

/**
 * REPL hook execution result.
 */
export interface REPLHookYield {
  /** Event type (e.g. 'progress') */
  type?: string;
  /** Message to display or send to API */
  message?: any;
  /** Hook result */
  result?: HookExecutionResult;
  /** Prevent continuation flag */
  preventContinuation?: boolean;
  /** Stop reason */
  stopReason?: string;
  /** Blocking error info */
  blockingError?: any;
  /** Additional contexts from hook */
  additionalContexts?: any[];
  /** Updated MCP tool output */
  updatedMCPToolOutput?: any;
  /** Aggregated permission behavior */
  permissionBehavior?: 'allow' | 'deny' | 'ask';
  /** Reason for hook permission decision */
  hookPermissionDecisionReason?: string;
  /** Updated tool input */
  updatedInput?: any;
  /** Result of permission request */
  permissionRequestResult?: any;
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
  // Original: jQ().disableAllHooks
  if (getSettings().disableAllHooks) return;

  const eventType = hookInput.hook_event_name;
  const hookName = matchQuery ? `${eventType}:${matchQuery}` : eventType;

  // Check workspace trust
  // Original: Ou2()
  if (isWorkspaceTrustRequired()) {
    logDebug(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return;
  }

  // Get app state and matching hooks
  const appState = toolUseContext
    ? await (toolUseContext as any).getAppState()
    : undefined;
  const sessionId =
    (toolUseContext as any)?.agentId ?? getCurrentSessionId();
  const matchingHooks = getMatchingHooks(appState, sessionId, eventType, hookInput);

  if (matchingHooks.length === 0) return;

  // Yield initial progress messages for each hook
  // Original: chunks.120.mjs:1570-1586
  for (const { hook } of matchingHooks) {
    yield {
      type: 'progress',
      message: {
        type: 'progress',
        data: {
          type: 'hook_progress',
          hookEvent: eventType,
          hookName,
          command: getHookStatusMessage(hook),
          promptText: hook.type === 'prompt' ? hook.prompt : undefined,
          statusMessage: (hook as any).statusMessage,
        },
        parentToolUseID: toolUseID,
        toolUseID,
        timestamp: new Date().toISOString(),
        uuid: crypto.randomUUID(),
      },
    };
  }

  // Prepare input JSON
  const inputJson = JSON.stringify(hookInput);

  // Track outcomes
  // Original: E = { success: 0, blocking: 0, ... }
  const outcomeCounters: Record<HookOutcome, number> = {
    success: 0,
    blocking: 0,
    non_blocking_error: 0,
    cancelled: 0,
  };

  let aggregatedPermissionBehavior: 'allow' | 'deny' | 'ask' | undefined;

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
  // Original: chunks.120.mjs:1818-1879
  for await (const result of streamAsyncIterator(hookPromises)) {
    outcomeCounters[result.outcome]++;

    // 1. Prevent continuation
    if (result.preventContinuation) {
      yield {
        preventContinuation: true,
        stopReason: result.stopReason,
      };
    }

    // 2. Blocking error
    if (result.blockingError) {
      yield { blockingError: result.blockingError };
    }

    // 3. Message (progress or result)
    if (result.message) {
      yield { message: result.message };
    }

    // 4. System message
    if (result.systemMessage) {
      yield {
        message: createHookSystemMessage({
          type: 'hook_system_message',
          content: result.systemMessage,
          hookName,
          toolUseID,
          hookEvent: eventType,
        }),
      };
    }

    // 5. Additional context
    if (result.additionalContext) {
      yield { additionalContexts: [result.additionalContext] };
    }

    // 6. Updated MCP tool output
    if (result.updatedMCPToolOutput) {
      yield { updatedMCPToolOutput: result.updatedMCPToolOutput };
    }

    // 7. Permission behavior aggregation
    // Deny takes priority, then Ask, then Allow.
    // Original: chunks.120.mjs:1844-1856
    if (result.permissionBehavior) {
      switch (result.permissionBehavior) {
        case 'deny':
          aggregatedPermissionBehavior = 'deny';
          break;
        case 'ask':
          if (aggregatedPermissionBehavior !== 'deny') {
            aggregatedPermissionBehavior = 'ask';
          }
          break;
        case 'allow':
          if (!aggregatedPermissionBehavior) {
            aggregatedPermissionBehavior = 'allow';
          }
          break;
        case 'passthrough':
          break;
      }
    }

    if (aggregatedPermissionBehavior !== undefined) {
      yield {
        permissionBehavior: aggregatedPermissionBehavior,
        hookPermissionDecisionReason: result.hookPermissionDecisionReason,
        updatedInput:
          result.updatedInput &&
          (result.permissionBehavior === 'allow' ||
            result.permissionBehavior === 'ask')
            ? result.updatedInput
            : undefined,
      };
    }

    // 8. Updated input (without explicit permission behavior)
    if (result.updatedInput && result.permissionBehavior === undefined) {
      yield { updatedInput: result.updatedInput };
    }

    // 9. Permission request result
    if (result.permissionRequestResult) {
      yield { permissionRequestResult: result.permissionRequestResult };
    }

    // 10. Check for one-shot hooks
    // Original: chunks.120.mjs:1868-1878
    if (appState && result.hook.type !== 'callback') {
      const currentSessionId = (toolUseContext as any)?.agentId ?? getCurrentSessionId();
      const sessionHookEntry = findSessionHook(
        appState as never,
        currentSessionId,
        eventType,
        matchQuery || '',
        result.hook
      );

      if (sessionHookEntry?.onHookSuccess && result.outcome === 'success') {
        try {
          // This is where once: true hooks are removed from state
          sessionHookEntry.onHookSuccess(result.hook, result);
        } catch (error) {
          logDebug(`Session hook success callback failed: ${error}`);
        }
      }
    }

    // Always yield the raw result for the consumer to track
    yield { type: 'result', result };
  }

  logDebug(
    `Hook execution complete: ${outcomeCounters.success} success, ` +
      `${outcomeCounters.blocking} blocking, ${outcomeCounters.non_blocking_error} errors`
  );
}

/**
 * Helper to get hook status message.
 * Original: AU in chunks.91.mjs:2965
 */
function getHookStatusMessage(hook: HookDefinition): string {
  if ('statusMessage' in hook && hook.statusMessage) return hook.statusMessage;
  switch (hook.type) {
    case 'command':
      return hook.command;
    case 'prompt':
      return hook.prompt;
    case 'agent':
      return typeof hook.prompt === 'function' ? 'agent prompt' : hook.prompt;
    case 'callback':
      return 'callback';
    default:
      return 'hook';
  }
}

/**
 * Helper to create a hook system message.
 * Original: X4 in chunks.132.mjs:87-94
 */
function createHookSystemMessage(data: any): any {
  return {
    type: 'message',
    message: {
      role: 'system',
      content: [
        {
          type: 'text',
          text: data.content,
        },
      ],
    },
    metadata: {
      type: data.type,
      hookName: data.hookName,
      toolUseID: data.toolUseID,
      hookEvent: data.hookEvent,
    },
  };
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
