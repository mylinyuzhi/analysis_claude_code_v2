/**
 * @claudecode/sdk
 *
 * SDK transport and protocol layer for Claude Code.
 *
 * Provides transport implementations for:
 * - Stdio (JSON-lines over stdin/stdout)
 * - WebSocket (with reconnection and message replay)
 *
 * Key features:
 * - Request/response correlation via request_id
 * - Message buffering for WebSocket reconnection
 * - Permission callback system (can_use_tool)
 * - Hook callback system
 * - MCP message routing
 *
 * Reconstructed from chunks.155.mjs, chunks.156.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Transport Layer
// ============================================

export {
  // Ring buffer for message replay
  RingBuffer,
  // Stdio transport
  StdioSDKTransport,
  generateControlRequestId,
  writeToStdout,
  readStdin,
  // WebSocket transport
  WebSocketTransport,
  WebSocketSDKTransport,
  // Async Message Queue
  AsyncMessageQueue,
} from './transport/index.js';

// ============================================
// Protocol Layer
// ============================================

export {
  // Message schemas
  permissionRuleSchema,
  canUseToolResponseSchema,
  hookCallbackResponseSchema,
  // Message type guards
  isUserMessage,
  isControlRequest,
  isControlResponse,
  isSystemMessage,
  isResultMessage,
  isAssistantMessage,
  isKeepAlive,
  // Message creation
  createUserMessage,
  createStatusMessage,
  createErrorMessage,
  createResultMessage,
  createAssistantMessage,
  createControlResponse,
  // Message validation
  validateUserMessage,
  validateControlRequest,
  // UUID utilities
  generateMessageUuid,
  isValidUuid,
} from './protocol/index.js';

// ============================================
// Core SDK Logic
// ============================================

export { runSDKAgentLoop } from './loop.js';
export { runNonInteractiveSession } from './runner.js';
export { 
  loadInitialMessages, 
  createIOHandler, 
  parseResumeTarget 
} from './session.js';

// ============================================
// SDK Mode Detection
// ============================================

/**
 * Check if running in SDK mode.
 */
export function isSdkMode(): boolean {
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return (
    entrypoint === 'sdk-ts' ||
    entrypoint === 'sdk-py' ||
    entrypoint === 'sdk-cli'
  );
}

/**
 * Get SDK version if running in SDK mode.
 */
export function getSdkVersion(): string | undefined {
  return process.env.CLAUDE_AGENT_SDK_VERSION;
}

/**
 * Get SDK entrypoint type.
 */
export function getSdkEntrypoint(): string | undefined {
  return process.env.CLAUDE_CODE_ENTRYPOINT;
}
