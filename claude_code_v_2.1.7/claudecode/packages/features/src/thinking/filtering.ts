/**
 * @claudecode/features - Thinking Filtering
 *
 * Filtering utilities for thinking blocks during compact/restore.
 * Reconstructed from chunks.148.mjs, chunks.85.mjs
 */

import type { ThinkingBlock, ThinkingBlockType } from './types.js';

// ============================================
// Type Detection
// ============================================

/**
 * Content block with type field.
 */
interface ContentBlock {
  type: string;
}

/**
 * Message with content array.
 */
interface MessageWithContent {
  type?: string;
  role?: string;
  uuid?: string;
  message: {
    id?: string;
    content: ContentBlock[] | string;
  };
}

/**
 * Check if content block is a thinking block.
 * Original: _J9 (isThinkingBlock) in chunks.148.mjs:555-557
 */
export function isThinkingBlock(block: ContentBlock): block is ThinkingBlock {
  return block.type === 'thinking' || block.type === 'redacted_thinking';
}

/**
 * Check if message contains only thinking content.
 * Original: dF1 (isThinkingOnlyMessage) in chunks.148.mjs:511-515
 */
export function isThinkingOnlyMessage(message: MessageWithContent): boolean {
  if (message.type !== 'assistant' && message.role !== 'assistant') {
    return false;
  }

  const content = message.message.content;
  if (!Array.isArray(content)) {
    return false;
  }

  return content.every((block) => block.type === 'thinking');
}

/**
 * Check if messages contain any thinking content.
 * Original: leB (containsThinkingContent) in chunks.85.mjs:640-646
 */
export function containsThinkingContent(
  messages: Array<{ role: string; content: ContentBlock[] | string }>
): boolean {
  for (const message of messages) {
    if (message.role === 'assistant' && Array.isArray(message.content)) {
      for (const block of message.content) {
        if (
          typeof block === 'object' &&
          block !== null &&
          'type' in block &&
          (block.type === 'thinking' || block.type === 'redacted_thinking')
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

// ============================================
// Trailing Block Removal (Compact)
// ============================================

/**
 * Remove trailing thinking blocks from last message.
 * Original: w$7 (removeTrailingThinkingBlocks) in chunks.148.mjs:559-589
 *
 * Used during compaction to clean up thinking blocks at message end.
 */
export function removeTrailingThinkingBlocks(
  messages: MessageWithContent[],
  telemetry?: (event: string, data: Record<string, unknown>) => void
): MessageWithContent[] {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || (lastMessage.type !== 'assistant' && lastMessage.role !== 'assistant')) {
    return messages;
  }

  const contentBlocks = lastMessage.message.content;
  if (!Array.isArray(contentBlocks)) {
    return messages;
  }

  const lastBlock = contentBlocks[contentBlocks.length - 1];
  if (!lastBlock || !isThinkingBlock(lastBlock as ContentBlock)) {
    return messages;
  }

  // Find the last non-thinking block index
  let lastNonThinkingIndex = contentBlocks.length - 1;
  while (lastNonThinkingIndex >= 0) {
    const block = contentBlocks[lastNonThinkingIndex];
    if (!block || !isThinkingBlock(block as ContentBlock)) {
      break;
    }
    lastNonThinkingIndex--;
  }

  // Log metrics
  telemetry?.('tengu_filtered_trailing_thinking_block', {
    messageUUID: lastMessage.uuid,
    blocksRemoved: contentBlocks.length - lastNonThinkingIndex - 1,
    remainingBlocks: lastNonThinkingIndex + 1,
  });

  // Create filtered content (or placeholder if all thinking)
  const finalContent =
    lastNonThinkingIndex < 0
      ? [{ type: 'text', text: '[No message content]', citations: [] }]
      : contentBlocks.slice(0, lastNonThinkingIndex + 1);

  const updatedMessages = [...messages];
  updatedMessages[messages.length - 1] = {
    ...lastMessage,
    message: { ...lastMessage.message, content: finalContent },
  };
  return updatedMessages;
}

// ============================================
// Orphaned Message Removal (Restore)
// ============================================

/**
 * Filter out orphaned thinking-only messages.
 * Original: Su2 (filterOrphanedThinkingMessages) in chunks.148.mjs:591-611
 *
 * Used during session restore to remove orphaned thinking blocks.
 */
export function filterOrphanedThinkingMessages(
  messages: MessageWithContent[],
  telemetry?: (event: string, data: Record<string, unknown>) => void
): MessageWithContent[] {
  // First pass: collect IDs of messages with mixed content (thinking + non-thinking)
  const messagesWithMixedContent = new Set<string>();
  for (const message of messages) {
    if (message.type !== 'assistant' && message.role !== 'assistant') {
      continue;
    }
    const content = message.message.content;
    if (!Array.isArray(content)) {
      continue;
    }

    // Has at least one non-thinking block AND has an ID
    const hasNonThinking = content.some(
      (block) => block.type !== 'thinking' && block.type !== 'redacted_thinking'
    );
    if (hasNonThinking && message.message.id) {
      messagesWithMixedContent.add(message.message.id);
    }
  }

  // Second pass: filter out orphaned thinking-only messages
  return messages.filter((message) => {
    // Keep all non-assistant messages
    if (message.type !== 'assistant' && message.role !== 'assistant') {
      return true;
    }

    const content = message.message.content;
    if (!Array.isArray(content) || content.length === 0) {
      return true;
    }

    // Keep if has non-thinking content
    const allThinking = content.every(
      (block) => block.type === 'thinking' || block.type === 'redacted_thinking'
    );
    if (!allThinking) {
      return true;
    }

    // Keep if part of a mixed-content message
    if (message.message.id && messagesWithMixedContent.has(message.message.id)) {
      return true;
    }

    // Log and remove orphaned thinking-only message
    telemetry?.('tengu_filtered_orphaned_thinking_message', {
      messageUUID: message.uuid,
      messageId: message.message.id,
      blockCount: content.length,
    });
    return false;
  });
}

// ============================================
// Skip in Turn Counting
// ============================================

/**
 * Check if message should be skipped in turn counting.
 * Thinking-only messages don't count as turns.
 */
export function shouldSkipInTurnCount(message: MessageWithContent): boolean {
  return isThinkingOnlyMessage(message);
}

/**
 * Filter compactable blocks from messages (removes thinking and orphaned tool blocks).
 * Original: UG7 (filterCompactableMessages) in chunks.135.mjs:694-712
 *
 * @param messages - Messages to filter
 * @returns Filtered messages
 */
export function filterCompactableMessages(messages: any[]): any[] {
  const isToolResult = (block: any) =>
    typeof block === 'object' &&
    block !== null &&
    block.type === 'tool_result' &&
    typeof block.tool_use_id === 'string';

  const isSuccessfulResult = (block: any) =>
    !block.is_error &&
    !(typeof block.content === 'string' && block.content.includes('[Compacted]'));

  const isUserMessage = (msg: any) =>
    msg.type === 'user' || msg.role === 'user';

  // Build set of valid tool_use_ids (successful tool results)
  const validToolResultIds = new Set(
    messages
      .filter(isUserMessage)
      .flatMap((msg) => (Array.isArray(msg.message?.content) ? msg.message.content : []))
      .filter(isToolResult)
      .filter(isSuccessfulResult)
      .map((toolResult) => toolResult.tool_use_id)
  );

  // KEY FILTER: Exclude thinking blocks and orphaned tool references
  const shouldKeepBlock = (block: any) =>
    block.type !== 'thinking' &&
    block.type !== 'redacted_thinking' &&
    !(block.type === 'tool_use' && !validToolResultIds.has(block.id)) &&
    !(block.type === 'tool_result' && !validToolResultIds.has(block.tool_use_id));

  return messages
    .map((msg) => {
      if (!msg.message || !Array.isArray(msg.message.content)) return msg;
      const filteredContent = msg.message.content.filter(shouldKeepBlock);
      if (filteredContent.length === msg.message.content.length) return msg;
      if (filteredContent.length === 0) return null; // Drop empty messages
      return { ...msg, message: { ...msg.message, content: filteredContent } };
    })
    .filter((msg) => msg !== null);
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
