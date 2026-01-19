/**
 * @claudecode/core - Message Type Guards
 *
 * Type guard functions for message type checking.
 * Reconstructed from chunks.147.mjs:2516-2788
 */

import type {
  ContentBlock,
  TextContentBlock,
  ToolUseContentBlock,
  ToolResultContentBlock,
  ThinkingContentBlock,
  ImageContentBlock,
} from '@claudecode/shared';
import type {
  ConversationMessage,
  AssistantMessage,
  UserMessage,
  ProgressMessage,
  AttachmentMessage,
  SystemMessage,
  Attachment,
} from './types.js';
import { EMPTY_CONTENT_PLACEHOLDER } from './factory.js';

// ============================================
// Basic Type Guards
// ============================================

/**
 * Check if message is an assistant message
 */
export function isAssistantMessage(
  message: ConversationMessage
): message is AssistantMessage {
  return message.type === 'assistant';
}

/**
 * Check if message is a user message
 */
export function isUserMessage(
  message: ConversationMessage
): message is UserMessage {
  return message.type === 'user';
}

/**
 * Check if message is a progress message
 */
export function isProgressMessage(
  message: ConversationMessage
): message is ProgressMessage {
  return message.type === 'progress';
}

/**
 * Check if message is an attachment message
 */
export function isAttachmentMessage(
  message: ConversationMessage
): message is AttachmentMessage {
  return message.type === 'attachment';
}

/**
 * Check if message is a system message
 */
export function isSystemMessage(
  message: ConversationMessage
): message is SystemMessage {
  return message.type === 'system';
}

// ============================================
// Tool-Related Type Guards
// ============================================

/**
 * Check if assistant message contains tool use.
 * Original: RJ9 in chunks.147.mjs:2591-2593
 */
export function hasToolUse(message: ConversationMessage): boolean {
  return (
    message.type === 'assistant' &&
    message.message.content.some((block) => block.type === 'tool_use')
  );
}

/**
 * Check if user message contains tool result.
 * Original: y19 in chunks.147.mjs:2595-2597
 */
export function hasToolResult(message: ConversationMessage): boolean {
  return (
    message.type === 'user' &&
    ((Array.isArray(message.message.content) &&
      (message.message.content as ContentBlock[])[0]?.type === 'tool_result') ||
      Boolean(message.toolUseResult))
  );
}

/**
 * Check if user message has tool result content blocks.
 * Original: V$7 in chunks.147.mjs:2972-2977
 */
export function hasToolResultBlocks(message: ConversationMessage): boolean {
  if (message.type !== 'user') return false;
  const content = message.message.content;
  if (typeof content === 'string') return false;
  return (content as ContentBlock[]).some((block) => block.type === 'tool_result');
}

// ============================================
// Hook-Related Type Guards
// ============================================

/**
 * Check if message is a hook attachment.
 * Original: V$A in chunks.147.mjs:2679-2681
 */
export function isHookAttachment(message: ConversationMessage): boolean {
  return (
    message.type === 'attachment' &&
    (message.attachment.type === 'hook_blocking_error' ||
      message.attachment.type === 'hook_cancelled' ||
      message.attachment.type === 'hook_error_during_execution' ||
      message.attachment.type === 'hook_non_blocking_error' ||
      message.attachment.type === 'hook_success' ||
      message.attachment.type === 'hook_system_message' ||
      message.attachment.type === 'hook_additional_context' ||
      message.attachment.type === 'hook_stopped_continuation')
  );
}

// ============================================
// System Message Type Guards
// ============================================

/**
 * Check if message is a local command system message.
 * Original: _P2 in chunks.147.mjs:2786-2788
 */
export function isLocalCommandMessage(message: ConversationMessage): boolean {
  return message.type === 'system' && message.subtype === 'local_command';
}

/**
 * Check if message is an API error system message.
 */
export function isApiErrorMessage(message: ConversationMessage): boolean {
  return message.type === 'system' && message.subtype === 'api_error';
}

// ============================================
// Content Validation
// ============================================

/**
 * Tool continuation messages.
 * Original: vN and Ss in chunks.147.mjs
 */
const TOOL_CONTINUATION_MESSAGE =
  'Please continue with your current task. If you have any pending tool calls, execute them now.';
const NO_TOOL_CONTINUATION_MESSAGE = 'Please continue.';

/**
 * Check if message has substantive content.
 * Original: UzA in chunks.147.mjs:2516-2523
 */
export function hasSubstantiveContent(message: ConversationMessage): boolean {
  // Progress, attachment, and system messages are always substantive
  if (
    message.type === 'progress' ||
    message.type === 'attachment' ||
    message.type === 'system'
  ) {
    return true;
  }

  // Check string content
  if (typeof message.message.content === 'string') {
    return message.message.content.trim().length > 0;
  }

  const content = message.message.content as ContentBlock[];

  // Empty array is not substantive
  if (content.length === 0) return false;

  // Multiple blocks is substantive
  if (content.length > 1) return true;

  // Single non-text block is substantive
  const firstBlock = content[0];
  if (!firstBlock) return false;
  if (firstBlock.type !== 'text') return true;

  // Check text content
  const text = (firstBlock as { type: 'text'; text: string }).text;
  return (
    text.trim().length > 0 &&
    text !== EMPTY_CONTENT_PLACEHOLDER &&
    text !== TOOL_CONTINUATION_MESSAGE
  );
}

// ============================================
// Message Filtering
// ============================================

/**
 * Check if message should be filtered out from API.
 * Original: J$7 in chunks.147.mjs (referenced in FI)
 */
export function isFilteredMessage(message: ConversationMessage): boolean {
  // Meta messages are filtered
  if (message.type === 'user' && message.isMeta) {
    return true;
  }

  // Visible-only-in-transcript messages are filtered
  if (message.type === 'user' && message.isVisibleInTranscriptOnly) {
    return true;
  }

  return false;
}

// ============================================
// Content Block Type Guards
// ============================================

/**
 * Check if content block is a tool reference.
 * Original: Yd in chunks.147.mjs
 */
export function isToolReference(
  block: ContentBlock
): block is ContentBlock & { tool_name: string } {
  return (
    typeof block === 'object' &&
    block !== null &&
    'tool_name' in block &&
    typeof (block as { tool_name?: unknown }).tool_name === 'string'
  );
}

/**
 * Check if content block is a text block
 */
export function isTextBlock(
  block: ContentBlock
): block is TextContentBlock {
  return block.type === 'text';
}

/**
 * Check if content block is a tool use block
 */
export function isToolUseBlock(
  block: ContentBlock
): block is ToolUseContentBlock {
  return block.type === 'tool_use';
}

/**
 * Check if content block is a tool result block
 */
export function isToolResultBlock(
  block: ContentBlock
): block is ToolResultContentBlock {
  return block.type === 'tool_result';
}

/**
 * Check if content block is a thinking block
 */
export function isThinkingBlock(
  block: ContentBlock
): block is ThinkingContentBlock {
  return block.type === 'thinking';
}

/**
 * Check if content block is an image block
 */
export function isImageBlock(
  block: ContentBlock
): block is ImageContentBlock {
  return block.type === 'image';
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
