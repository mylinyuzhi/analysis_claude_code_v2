/**
 * @claudecode/features - Hook Event Triggers
 *
 * All 12 hook event trigger functions.
 * Reconstructed from chunks.120.mjs:2027-2247
 */

import type { ConversationMessage } from '@claudecode/core';
import { createHookEnvironmentContext, getAgentTranscriptPath, getCurrentSessionId } from './context.js';
import { executeHooksInREPL, executeHooksOutsideREPL, REPLHookYield } from './execution.js';
import type {
  PreToolUseInput,
  PostToolUseInput,
  PostToolUseFailureInput,
  NotificationInput,
  UserPromptSubmitInput,
  SessionStartInput,
  SessionEndInput,
  StopInput,
  SubagentStartInput,
  SubagentStopInput,
  PreCompactInput,
  PermissionRequestInput,
  NonREPLHookResult,
  HOOK_CONSTANTS,
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
// Tool Use ID Generator
// ============================================

function generateToolUseId(): string {
  return `toolu_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================
// Default Timeout
// ============================================

const DEFAULT_TIMEOUT = 60000;

// ============================================
// PreToolUse Trigger
// ============================================

/**
 * Execute PreToolUse hooks.
 * Original: lU0 in chunks.120.mjs:2027-2043
 */
export async function* executePreToolHooks(
  toolName: string,
  toolUseId: string,
  toolInput: unknown,
  toolUseContext: unknown,
  permissionMode: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  logDebug(`executePreToolHooks called for tool: ${toolName}`);

  const hookInput: PreToolUseInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: 'PreToolUse',
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: toolUseId,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// ============================================
// PostToolUse Trigger
// ============================================

/**
 * Execute PostToolUse hooks.
 * Original: iU0 in chunks.120.mjs:2046-2062
 */
export async function* executePostToolHooks(
  toolName: string,
  toolUseId: string,
  toolInput: unknown,
  toolResponse: unknown,
  toolUseContext: unknown,
  permissionMode: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  const hookInput: PostToolUseInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: 'PostToolUse',
    tool_name: toolName,
    tool_input: toolInput,
    tool_response: toolResponse,
    tool_use_id: toolUseId,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: toolUseId,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// ============================================
// PostToolUseFailure Trigger
// ============================================

/**
 * Execute PostToolUseFailure hooks.
 * Original: nU0 in chunks.120.mjs:2065-2083
 */
export async function* executePostToolFailureHooks(
  toolName: string,
  toolUseId: string,
  toolInput: unknown,
  error: string,
  isInterrupt: boolean,
  toolUseContext: unknown,
  permissionMode: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  const hookInput: PostToolUseFailureInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: 'PostToolUseFailure',
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId,
    error,
    is_interrupt: isInterrupt,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: toolUseId,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// ============================================
// Notification Trigger
// ============================================

/**
 * Execute Notification hooks (non-REPL).
 * Original: vE0 in chunks.120.mjs:2085-2102
 */
export async function executeNotificationHooks(
  notification: {
    message: string;
    title?: string;
    notificationType: string;
  },
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<NonREPLHookResult[]> {
  const { message, title, notificationType } = notification;

  const hookInput: NotificationInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: 'Notification',
    message,
    title,
    notification_type: notificationType,
  };

  return executeHooksOutsideREPL({
    hookInput,
    matchQuery: notificationType,
    timeoutMs,
  });
}

// ============================================
// Stop/SubagentStop Trigger
// ============================================

/**
 * Execute Stop or SubagentStop hooks.
 * Original: aU0 in chunks.120.mjs:2104-2124
 */
export async function* executeStopHooks(
  permissionMode: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT,
  stopHookActive: boolean = false,
  agentId?: string,
  toolUseContext?: unknown,
  messages?: ConversationMessage[]
): AsyncGenerator<REPLHookYield> {
  // If agentId provided, trigger SubagentStop; otherwise Stop
  const hookInput: StopInput | SubagentStopInput = agentId
    ? {
        ...createHookEnvironmentContext(permissionMode),
        hook_event_name: 'SubagentStop',
        stop_hook_active: stopHookActive,
        agent_id: agentId,
        agent_transcript_path: getAgentTranscriptPath(agentId),
      }
    : {
        ...createHookEnvironmentContext(permissionMode),
        hook_event_name: 'Stop',
        stop_hook_active: stopHookActive,
      };

  yield* executeHooksInREPL({
    hookInput,
    timeoutMs,
    signal,
    toolUseContext,
    messages,
  });
}

// ============================================
// UserPromptSubmit Trigger
// ============================================

/**
 * Execute UserPromptSubmit hooks.
 * Original: oU0 in chunks.120.mjs:2126-2139
 */
export async function* executeUserPromptSubmitHooks(
  prompt: string,
  permissionMode: string,
  signal?: AbortSignal
): AsyncGenerator<REPLHookYield> {
  const hookInput: UserPromptSubmitInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: 'UserPromptSubmit',
    prompt,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: generateToolUseId(),
    matchQuery: undefined,
    signal,
  });
}

// ============================================
// SessionStart Trigger
// ============================================

/**
 * Execute SessionStart hooks.
 * Original: rU0 in chunks.120.mjs:2141-2155
 */
export async function* executeSessionStartHooks(
  source: string,
  sessionId: string,
  agentType?: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  const hookInput: SessionStartInput = {
    ...createHookEnvironmentContext(undefined, sessionId),
    hook_event_name: 'SessionStart',
    source, // "cli", "ide", "api", etc.
    agent_type: agentType,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: generateToolUseId(),
    matchQuery: undefined,
    signal,
    timeoutMs,
  });
}

// ============================================
// SessionEnd Trigger
// ============================================

/**
 * Execute SessionEnd hooks (non-REPL).
 * Original: tU0 in chunks.120.mjs:2204-2228
 */
export async function executeSessionEndHooks(
  reason: string,
  options?: {
    getAppState?: () => Promise<unknown>;
    setAppState?: (updater: (state: unknown) => unknown) => void;
    signal?: AbortSignal;
    timeoutMs?: number;
  }
): Promise<void> {
  const { getAppState, setAppState, signal, timeoutMs = DEFAULT_TIMEOUT } = options || {};

  const hookInput: SessionEndInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: 'SessionEnd',
    reason, // "user_exit", "error", "completed", etc.
  };

  const results = await executeHooksOutsideREPL({
    getAppState,
    hookInput,
    matchQuery: reason,
    signal,
    timeoutMs,
  });

  // Log any failed hooks to stderr
  for (const result of results) {
    if (!result.succeeded && result.output) {
      process.stderr.write(`SessionEnd hook [${result.command}] failed: ${result.output}\n`);
    }
  }

  // Clear session hooks
  if (setAppState) {
    const sessionId = getCurrentSessionId();
    // Would call clearSessionHooks(setAppState, sessionId)
    logDebug(`Cleared hooks for session ${sessionId}`);
  }
}

// ============================================
// SubagentStart Trigger
// ============================================

/**
 * Execute SubagentStart hooks.
 * Original: kz0 in chunks.120.mjs:2157-2171
 */
export async function* executeSubagentStartHooks(
  agentId: string,
  agentType: string,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  const hookInput: SubagentStartInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: 'SubagentStart',
    agent_id: agentId,
    agent_type: agentType,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: generateToolUseId(),
    matchQuery: agentType,
    signal,
    timeoutMs,
  });
}

// ============================================
// PreCompact Trigger
// ============================================

/**
 * PreCompact hook result.
 */
export interface PreCompactHookResult {
  newCustomInstructions?: string;
  userDisplayMessage?: string;
}

/**
 * Execute PreCompact hooks (non-REPL).
 * Original: sU0 in chunks.120.mjs:2173-2202
 */
export async function executePreCompactHooks(
  params: {
    trigger: string;
    customInstructions?: string;
  },
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<PreCompactHookResult> {
  const hookInput: PreCompactInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: 'PreCompact',
    trigger: params.trigger, // "auto" | "manual" | etc.
    custom_instructions: params.customInstructions,
  };

  const results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: params.trigger,
    signal,
    timeoutMs,
  });

  if (results.length === 0) return {};

  // Collect successful outputs for new custom instructions
  const successOutputs = results
    .filter((r) => r.succeeded && r.output.trim().length > 0)
    .map((r) => r.output.trim());

  // Build user display message
  const displayMessages = results.map((r) => {
    if (r.succeeded) {
      return r.output.trim()
        ? `PreCompact [${r.command}] completed successfully: ${r.output.trim()}`
        : `PreCompact [${r.command}] completed successfully`;
    } else {
      return r.output.trim()
        ? `PreCompact [${r.command}] failed: ${r.output.trim()}`
        : `PreCompact [${r.command}] failed`;
    }
  });

  return {
    newCustomInstructions: successOutputs.length > 0 ? successOutputs.join('\n\n') : undefined,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join('\n') : undefined,
  };
}

// ============================================
// PermissionRequest Trigger
// ============================================

/**
 * Execute PermissionRequest hooks.
 * Original: eU0 in chunks.120.mjs:2230-2247
 */
export async function* executePermissionRequestHooks(
  toolName: string,
  toolUseId: string,
  toolInput: unknown,
  toolUseContext: unknown,
  permissionMode: string,
  permissionSuggestions?: unknown[],
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT
): AsyncGenerator<REPLHookYield> {
  logDebug(`executePermissionRequestHooks called for tool: ${toolName}`);

  const hookInput: PermissionRequestInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: 'PermissionRequest',
    tool_name: toolName,
    tool_input: toolInput,
    permission_suggestions: permissionSuggestions,
  };

  yield* executeHooksInREPL({
    hookInput,
    toolUseID: toolUseId,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// ============================================
// Export
// ============================================

export {
  executePreToolHooks,
  executePostToolHooks,
  executePostToolFailureHooks,
  executeNotificationHooks,
  executeStopHooks,
  executeUserPromptSubmitHooks,
  executeSessionStartHooks,
  executeSessionEndHooks,
  executeSubagentStartHooks,
  executePreCompactHooks,
  executePermissionRequestHooks,
  PreCompactHookResult,
};
