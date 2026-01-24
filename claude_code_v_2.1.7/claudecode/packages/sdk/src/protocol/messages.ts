/**
 * @claudecode/sdk - Protocol Messages
 *
 * Message creation and validation utilities.
 * Reconstructed from chunks.155.mjs, chunks.156.mjs
 */

import { z } from 'zod';
import type {
  SDKMessage,
  SDKUserMessage,
  SDKControlRequest,
  SDKControlResponse,
  SDKSystemMessage,
  SDKResultMessage,
  SDKAssistantMessage,
  SDKPermissionDenial,
  SDKContentBlock,
} from '../types.js';

// ============================================
// Protocol Schemas
// ============================================

/**
 * Permission rule destination.
 * Original: TVA in chunks.92.mjs:58
 */
export const permissionDestinationSchema = z.enum([
  'userSettings',
  'projectSettings',
  'localSettings',
  'session',
  'cliArg',
]);

/**
 * Permission rule tool match.
 * Original: tZ1 in chunks.92.mjs:44
 */
export const toolRuleSchema = z.object({
  toolName: z.string(),
  ruleContent: z.string().optional(),
});

/**
 * Permission rule schema.
 * Original: eZ1 in chunks.92.mjs:58
 */
export const permissionRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('addRules'),
    rules: z.array(toolRuleSchema),
    behavior: z.enum(['allow', 'deny', 'ask']),
    destination: permissionDestinationSchema,
  }),
  z.object({
    type: z.literal('replaceRules'),
    rules: z.array(toolRuleSchema),
    behavior: z.enum(['allow', 'deny', 'ask']),
    destination: permissionDestinationSchema,
  }),
  z.object({
    type: z.literal('removeRules'),
    rules: z.array(toolRuleSchema),
    behavior: z.enum(['allow', 'deny', 'ask']),
    destination: permissionDestinationSchema,
  }),
  z.object({
    type: z.literal('setMode'),
    mode: z.string(), // k$B in source, usually permission mode
    destination: permissionDestinationSchema,
  }),
  z.object({
    type: z.literal('addDirectories'),
    directories: z.array(z.string()),
    destination: permissionDestinationSchema,
  }),
  z.object({
    type: z.literal('removeDirectories'),
    directories: z.array(z.string()),
    destination: permissionDestinationSchema,
  }),
]);

/**
 * Tool permission behavior schemas.
 * Original: VR7, FR7 in chunks.155.mjs:2590-2600
 */
export const toolPermissionAllowSchema = z.object({
  behavior: z.literal('allow'),
  updatedInput: z.record(z.string(), z.unknown()),
  updatedPermissions: z.array(permissionRuleSchema).optional(),
  toolUseID: z.string().optional(),
});

export const toolPermissionDenySchema = z.object({
  behavior: z.literal('deny'),
  message: z.string(),
  interrupt: z.boolean().optional(),
  toolUseID: z.string().optional(),
});

/**
 * can_use_tool response schema.
 * Original: JU1 in chunks.155.mjs:2600
 */
export const canUseToolResponseSchema = z.union([
  toolPermissionAllowSchema,
  toolPermissionDenySchema,
]);

/**
 * Hook callback result schemas.
 * Original: vG5, kG5 in chunks.92.mjs:106-149
 */
export const asyncHookResponseSchema = z.object({
  async: z.literal(true),
  asyncTimeout: z.number().optional(),
});

export const syncHookResponseSchema = z.object({
  continue: z.boolean().optional(),
  suppressOutput: z.boolean().optional(),
  stopReason: z.string().optional(),
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
  systemMessage: z.string().optional(),
  hookSpecificOutput: z
    .union([
      z.object({
        hookEventName: z.literal('PreToolUse'),
        permissionDecision: z.enum(['allow', 'deny', 'ask']).optional(),
        permissionDecisionReason: z.string().optional(),
        updatedInput: z.record(z.string(), z.unknown()).optional(),
      }),
      z.object({
        hookEventName: z.literal('UserPromptSubmit'),
        additionalContext: z.string().optional(),
      }),
      z.object({
        hookEventName: z.literal('SessionStart'),
        additionalContext: z.string().optional(),
      }),
      z.object({
        hookEventName: z.literal('SubagentStart'),
        additionalContext: z.string().optional(),
      }),
      z.object({
        hookEventName: z.literal('PostToolUse'),
        additionalContext: z.string().optional(),
        updatedMCPToolOutput: z.unknown().optional(),
      }),
      z.object({
        hookEventName: z.literal('PostToolUseFailure'),
        additionalContext: z.string().optional(),
      }),
      z.object({
        hookEventName: z.literal('PermissionRequest'),
        decision: canUseToolResponseSchema,
      }),
    ])
    .optional(),
});

/**
 * hook_callback response schema.
 * Original: AY1 in chunks.92.mjs:149
 */
export const hookCallbackResponseSchema = z.union([
  asyncHookResponseSchema,
  syncHookResponseSchema,
]);

// ============================================
// Message Type Guards
// ============================================

/**
 * Check if message is a user message.
 */
export function isUserMessage(message: SDKMessage): message is SDKUserMessage {
  return message.type === 'user';
}

/**
 * Check if message is a control request.
 */
export function isControlRequest(message: SDKMessage): message is SDKControlRequest {
  return message.type === 'control_request';
}

/**
 * Check if message is a control response.
 */
export function isControlResponse(message: SDKMessage): message is SDKControlResponse {
  return message.type === 'control_response';
}

/**
 * Check if message is a system message.
 */
export function isSystemMessage(message: SDKMessage): message is SDKSystemMessage {
  return message.type === 'system';
}

/**
 * Check if message is a result message.
 */
export function isResultMessage(message: SDKMessage): message is SDKResultMessage {
  return message.type === 'result';
}

/**
 * Check if message is an assistant message.
 */
export function isAssistantMessage(message: SDKMessage): message is SDKAssistantMessage {
  return message.type === 'assistant';
}

/**
 * Check if message is a keep-alive.
 */
export function isKeepAlive(message: SDKMessage): boolean {
  return message.type === 'keep_alive';
}

// ============================================
// Message Creation
// ============================================

/**
 * Create a user message.
 */
export function createUserMessage(
  content: string | SDKContentBlock[],
  sessionId?: string,
  uuid?: string
): SDKUserMessage {
  return {
    type: 'user',
    message: {
      role: 'user',
      content,
    },
    session_id: sessionId,
    uuid,
  };
}

/**
 * Create a system status message.
 */
export function createStatusMessage(
  status: string | null,
  uuid?: string
): SDKSystemMessage {
  return {
    type: 'system',
    subtype: 'status',
    status,
    uuid,
  };
}

/**
 * Create a system error message.
 */
export function createErrorMessage(
  error: string,
  uuid?: string
): SDKSystemMessage {
  return {
    type: 'system',
    subtype: 'error',
    error,
    uuid,
  };
}

/**
 * Create a result message.
 */
export function createResultMessage(
  subtype: 'success' | 'error' | 'interrupted',
  options?: {
    sessionId?: string;
    permissionDenials?: SDKPermissionDenial[];
    error?: string;
    uuid?: string;
  }
): SDKResultMessage {
  return {
    type: 'result',
    subtype,
    session_id: options?.sessionId,
    permission_denials: options?.permissionDenials,
    error: options?.error,
    uuid: options?.uuid,
  };
}

/**
 * Create an assistant message.
 */
export function createAssistantMessage(
  content: SDKContentBlock[],
  options?: {
    id?: string;
    model?: string;
    stopReason?: string;
    sessionId?: string;
    uuid?: string;
  }
): SDKAssistantMessage {
  return {
    type: 'assistant',
    message: {
      id: options?.id,
      role: 'assistant',
      content,
      model: options?.model,
      stop_reason: options?.stopReason,
    },
    session_id: options?.sessionId,
    uuid: options?.uuid,
  };
}

/**
 * Create a control response.
 */
export function createControlResponse(
  requestId: string,
  response: SDKControlResponse['response']
): SDKControlResponse {
  return {
    type: 'control_response',
    request_id: requestId,
    response,
  };
}

// ============================================
// Message Validation
// ============================================

/**
 * Validate user message format.
 */
export function validateUserMessage(message: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!message || typeof message !== 'object') {
    return { valid: false, error: 'Message is not an object' };
  }

  const msg = message as Record<string, unknown>;

  if (msg.type !== 'user') {
    return { valid: false, error: 'Invalid message type' };
  }

  if (!msg.message || typeof msg.message !== 'object') {
    return { valid: false, error: 'Missing message field' };
  }

  const innerMsg = msg.message as Record<string, unknown>;

  if (innerMsg.role !== 'user') {
    return { valid: false, error: 'Invalid role, expected "user"' };
  }

  if (!innerMsg.content) {
    return { valid: false, error: 'Missing content field' };
  }

  return { valid: true };
}

/**
 * Validate control request format.
 */
export function validateControlRequest(message: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!message || typeof message !== 'object') {
    return { valid: false, error: 'Message is not an object' };
  }

  const msg = message as Record<string, unknown>;

  if (msg.type !== 'control_request') {
    return { valid: false, error: 'Invalid message type' };
  }

  if (!msg.request_id || typeof msg.request_id !== 'string') {
    return { valid: false, error: 'Missing or invalid request_id' };
  }

  if (!msg.request || typeof msg.request !== 'object') {
    return { valid: false, error: 'Missing or invalid request field' };
  }

  return { valid: true };
}

// ============================================
// UUID Generation
// ============================================

/**
 * Generate message UUID.
 */
export function generateMessageUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if string is valid UUID.
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
