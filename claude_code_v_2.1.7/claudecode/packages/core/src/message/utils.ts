/**
 * @claudecode/core - Message Utilities
 *
 * Utility functions for message processing.
 * Reconstructed from chunks.147.mjs:2495-2770
 */

import { generateUUID } from '@claudecode/shared';
import type { ContentBlock } from '@claudecode/shared';
import type {
  ConversationMessage,
  AssistantMessage,
  UserMessage,
  ProgressMessage,
  AttachmentMessage,
  ToolUseGroup,
  MessageAnalysisCache,
} from './types.js';
import {
  hasToolUse,
  hasToolResult,
  isHookAttachment,
} from './type-guards.js';
import { createUserMessage } from './factory.js';

// ============================================
// XML Tag Extraction
// ============================================

/**
 * Extract content from XML tag.
 * Original: Q9 in chunks.147.mjs:2495-2514
 */
export function extractXmlTagContent(
  text: string,
  tagName: string
): string | null {
  if (!text.trim() || !tagName.trim()) return null;

  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `<${escapedTag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`,
    'gi'
  );

  const openTagRegex = new RegExp(`<${escapedTag}(?:\\s+[^>]*?)?>`, 'gi');
  const closeTagRegex = new RegExp(`<\\/${escapedTag}>`, 'gi');

  let match;
  let depth = 0;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const content = match[1];
    const precedingText = text.slice(lastIndex, match.index);

    // Count unclosed tags
    depth = 0;
    openTagRegex.lastIndex = 0;
    while (openTagRegex.exec(precedingText) !== null) depth++;
    closeTagRegex.lastIndex = 0;
    while (closeTagRegex.exec(precedingText) !== null) depth--;

    // Only return if we're at depth 0 (properly nested)
    if (depth === 0 && content) {
      return content;
    }

    lastIndex = match.index + match[0].length;
  }

  return null;
}

// ============================================
// Message Splitting (for per-block display)
// ============================================

/**
 * Split messages into individual content blocks for display.
 * Original: a7 in chunks.147.mjs:2525-2589
 *
 * This is used for UI rendering where each content block
 * is displayed separately.
 */
export function splitMessagesToBlocks(
  messages: ConversationMessage[]
): ConversationMessage[] {
  let needsNewUUIDs = false;

  return messages.flatMap((msg): ConversationMessage[] => {
    switch (msg.type) {
      case 'assistant': {
        // Track if we need new UUIDs (when splitting multi-block messages)
        needsNewUUIDs = needsNewUUIDs || msg.message.content.length > 1;

        return msg.message.content.map((block) => {
          const uuid = needsNewUUIDs ? generateUUID() : msg.uuid;
          return {
            type: 'assistant' as const,
            timestamp: msg.timestamp,
            message: {
              ...msg.message,
              content: [block],
              context_management: msg.message.context_management ?? null,
            },
            isMeta: msg.isMeta,
            requestId: msg.requestId,
            uuid,
            error: msg.error,
            isApiErrorMessage: msg.isApiErrorMessage,
          } as ConversationMessage;
        });
      }

      case 'attachment':
      case 'progress':
      case 'system':
        return [msg];

      case 'user': {
        const content = msg.message.content;

        // String content - wrap in array
        if (typeof content === 'string') {
          const uuid = needsNewUUIDs ? generateUUID() : msg.uuid;
          return [
            {
              ...msg,
              uuid,
              message: {
                ...msg.message,
                content: [{ type: 'text' as const, text: content }],
              },
            } as ConversationMessage,
          ];
        }

        // Track multi-block
        needsNewUUIDs = needsNewUUIDs || content.length > 1;

        // Split each block into separate message
        let imageIndex = 0;
        return content.map((block) => {
          const isImage = block.type === 'image';
          const imagePasteId =
            isImage && msg.imagePasteIds ? msg.imagePasteIds[imageIndex] : undefined;
          if (isImage) imageIndex++;

          return {
            ...createUserMessage({
              content: [block],
              toolUseResult: msg.toolUseResult,
              isMeta: msg.isMeta,
              isVisibleInTranscriptOnly: msg.isVisibleInTranscriptOnly,
              timestamp: msg.timestamp,
              imagePasteIds: imagePasteId !== undefined ? [imagePasteId] : undefined,
            }),
            uuid: needsNewUUIDs ? generateUUID() : msg.uuid,
          } as ConversationMessage;
        });
      }
    }
  });
}

// ============================================
// Tool Use Analysis
// ============================================

/**
 * Get tool use ID from message.
 * Original: ogA in chunks.147.mjs
 */
export function getToolUseId(message: ConversationMessage): string | null {
  if (message.type === 'assistant' && hasToolUse(message)) {
    const toolUseBlock = message.message.content.find(
      (block) => block.type === 'tool_use'
    );
    return toolUseBlock ? (toolUseBlock as { id: string }).id : null;
  }
  return null;
}

/**
 * Get all tool use IDs from messages.
 * Original: X$7 in chunks.147.mjs:2765-2767
 */
export function getAllToolUseIds(messages: ConversationMessage[]): Set<string> {
  return new Set(
    messages
      .filter(
        (msg) =>
          msg.type === 'assistant' &&
          Array.isArray(msg.message.content) &&
          msg.message.content[0]?.type === 'tool_use'
      )
      .map((msg) => (msg as AssistantMessage).message.content[0] as { id: string })
      .map((block) => block.id)
  );
}

/**
 * Get tool result error status map.
 * Original: _z1 in chunks.147.mjs:2691-2695
 */
export function getToolResultErrors(
  messages: ConversationMessage[]
): Record<string, boolean> {
  return Object.fromEntries(
    messages.flatMap((msg) => {
      if (
        msg.type === 'user' &&
        Array.isArray(msg.message.content) &&
        (msg.message.content as ContentBlock[])[0]?.type === 'tool_result'
      ) {
        const block = (msg.message.content as ContentBlock[])[0] as {
          tool_use_id: string;
          is_error?: boolean;
        };
        return [[block.tool_use_id, block.is_error ?? false]];
      }
      return [];
    })
  );
}

/**
 * Get pending tool use IDs (no result yet).
 * Original: dkA in chunks.147.mjs:2759-2763
 */
export function getPendingToolUseIds(
  messages: ConversationMessage[]
): Set<string> {
  const resultIds = getToolResultErrors(messages);
  const allIds = getAllToolUseIds(messages);
  return difference(allIds, new Set(Object.keys(resultIds)));
}

/**
 * Get failed tool use IDs.
 * Original: d89 in chunks.147.mjs:2769-2772
 */
export function getFailedToolUseIds(
  messages: ConversationMessage[]
): Set<string> {
  const errorMap = getToolResultErrors(messages);
  return new Set(
    messages
      .filter(
        (msg) =>
          msg.type === 'assistant' &&
          Array.isArray(msg.message.content) &&
          msg.message.content[0]?.type === 'tool_use' &&
          errorMap[(msg.message.content[0] as { id: string }).id] === true
      )
      .map(
        (msg) =>
          ((msg as AssistantMessage).message.content[0] as { id: string }).id
      )
  );
}

/**
 * Set difference helper.
 * Original: r39 in chunks.147.mjs
 */
function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => !b.has(x)));
}

// ============================================
// Message Ordering (Tool Use Groups)
// ============================================

/**
 * Reorder messages by tool use groups.
 * Original: BR0 in chunks.147.mjs:2599-2677
 *
 * This ensures proper ordering: tool_use → preHooks → tool_result → postHooks
 */
export function reorderByToolUseGroups(
  messages: ConversationMessage[],
  additionalMessages: ConversationMessage[] = []
): ConversationMessage[] {
  // Build tool use groups
  const groups = new Map<string, ToolUseGroup>();

  for (const msg of messages) {
    // Tool use messages
    if (hasToolUse(msg) && msg.type === 'assistant') {
      const toolUseId = (msg.message.content[0] as { id?: string })?.id;
      if (toolUseId) {
        if (!groups.has(toolUseId)) {
          groups.set(toolUseId, {
            toolUse: null,
            preHooks: [],
            toolResult: null,
            postHooks: [],
          });
        }
        groups.get(toolUseId)!.toolUse = msg;
      }
      continue;
    }

    // Pre-tool hooks
    if (isHookAttachment(msg) && msg.type === 'attachment') {
      if (msg.attachment.hookEvent === 'PreToolUse') {
        const toolUseId = msg.attachment.toolUseID;
        if (toolUseId) {
          if (!groups.has(toolUseId)) {
            groups.set(toolUseId, {
              toolUse: null,
              preHooks: [],
              toolResult: null,
              postHooks: [],
            });
          }
          groups.get(toolUseId)!.preHooks.push(msg);
        }
      }
      continue;
    }

    // Tool results
    if (
      msg.type === 'user' &&
      Array.isArray(msg.message.content) &&
      (msg.message.content as ContentBlock[])[0]?.type === 'tool_result'
    ) {
      const toolUseId = (
        (msg.message.content as ContentBlock[])[0] as { tool_use_id: string }
      ).tool_use_id;
      if (!groups.has(toolUseId)) {
        groups.set(toolUseId, {
          toolUse: null,
          preHooks: [],
          toolResult: null,
          postHooks: [],
        });
      }
      groups.get(toolUseId)!.toolResult = msg;
      continue;
    }

    // Post-tool hooks
    if (isHookAttachment(msg) && msg.type === 'attachment') {
      if (msg.attachment.hookEvent === 'PostToolUse') {
        const toolUseId = msg.attachment.toolUseID;
        if (toolUseId) {
          if (!groups.has(toolUseId)) {
            groups.set(toolUseId, {
              toolUse: null,
              preHooks: [],
              toolResult: null,
              postHooks: [],
            });
          }
          groups.get(toolUseId)!.postHooks.push(msg);
        }
      }
      continue;
    }
  }

  // Build ordered output
  const result: ConversationMessage[] = [];
  const processed = new Set<string>();

  for (const msg of messages) {
    // Handle tool use messages
    if (hasToolUse(msg) && msg.type === 'assistant') {
      const toolUseId = (msg.message.content[0] as { id?: string })?.id;
      if (toolUseId && !processed.has(toolUseId)) {
        processed.add(toolUseId);
        const group = groups.get(toolUseId);
        if (group?.toolUse) {
          result.push(group.toolUse);
          result.push(...group.preHooks);
          if (group.toolResult) {
            result.push(group.toolResult);
          }
          result.push(...group.postHooks);
        }
      }
      continue;
    }

    // Skip already-processed hook and result messages
    if (isHookAttachment(msg)) continue;
    if (
      msg.type === 'user' &&
      Array.isArray(msg.message.content) &&
      (msg.message.content as ContentBlock[])[0]?.type === 'tool_result'
    ) {
      continue;
    }

    // Deduplicate API errors
    if (msg.type === 'system' && msg.subtype === 'api_error') {
      const lastMsg = result[result.length - 1];
      if (lastMsg?.type === 'system' && lastMsg.subtype === 'api_error') {
        result[result.length - 1] = msg;
      } else {
        result.push(msg);
      }
      continue;
    }

    result.push(msg);
  }

  // Add additional messages
  for (const msg of additionalMessages) {
    result.push(msg);
  }

  // Keep only the last API error
  const lastApiError = result
    .filter((msg) => msg.type === 'system' && msg.subtype === 'api_error')
    .pop();

  return result.filter(
    (msg) =>
      !(msg.type === 'system' && msg.subtype === 'api_error') ||
      msg === lastApiError
  );
}

// ============================================
// Message Analysis Cache
// ============================================

/**
 * Build message analysis cache for efficient lookups.
 * Original: h89 in chunks.147.mjs:2697-2739
 */
export function buildMessageAnalysisCache(
  progressMessages: ConversationMessage[],
  allMessages: ConversationMessage[]
): MessageAnalysisCache {
  // Build message ID to tool use ID mapping
  const messageIdToToolIds = new Map<string, Set<string>>();
  const toolIdToMessageId = new Map<string, string>();

  for (const msg of allMessages) {
    if (msg.type === 'assistant') {
      const messageId = msg.message.id;
      if (!messageIdToToolIds.has(messageId)) {
        messageIdToToolIds.set(messageId, new Set());
      }
      for (const block of msg.message.content) {
        if (block.type === 'tool_use') {
          const toolId = (block as { id: string }).id;
          messageIdToToolIds.get(messageId)!.add(toolId);
          toolIdToMessageId.set(toolId, messageId);
        }
      }
    }
  }

  // Build sibling map
  const siblingToolUseIDs = new Map<string, Set<string>>();
  for (const [toolId, messageId] of toolIdToMessageId) {
    siblingToolUseIDs.set(toolId, messageIdToToolIds.get(messageId) || new Set());
  }

  // Build progress and hook counts
  const progressMessagesByToolUseID = new Map<string, ProgressMessage[]>();
  const inProgressHookCounts = new Map<string, Map<string, number>>();
  const resolvedHookCounts = new Map<string, Map<string, number>>();

  for (const msg of progressMessages) {
    if (msg.type === 'progress') {
      const toolId = msg.parentToolUseID;
      if (toolId) {
        if (!progressMessagesByToolUseID.has(toolId)) {
          progressMessagesByToolUseID.set(toolId, []);
        }
        progressMessagesByToolUseID.get(toolId)!.push(msg);

        // Count hook progress
        if (msg.data.type === 'hook_progress') {
          const hookEvent = msg.data.hookEvent;
          if (hookEvent) {
            if (!inProgressHookCounts.has(toolId)) {
              inProgressHookCounts.set(toolId, new Map());
            }
            const counts = inProgressHookCounts.get(toolId)!;
            counts.set(hookEvent, (counts.get(hookEvent) ?? 0) + 1);
          }
        }
      }
    }

    if (isHookAttachment(msg) && msg.type === 'attachment') {
      const toolId = msg.attachment.toolUseID;
      const hookEvent = msg.attachment.hookEvent;
      if (toolId && hookEvent) {
        if (!resolvedHookCounts.has(toolId)) {
          resolvedHookCounts.set(toolId, new Map());
        }
        const counts = resolvedHookCounts.get(toolId)!;
        counts.set(hookEvent, (counts.get(hookEvent) ?? 0) + 1);
      }
    }
  }

  return {
    siblingToolUseIDs,
    progressMessagesByToolUseID,
    inProgressHookCounts,
    resolvedHookCounts,
  };
}

/**
 * Get sibling tool use IDs for a message.
 * Original: g89 in chunks.147.mjs:2741-2745
 */
export function getSiblingToolUseIds(
  message: ConversationMessage,
  cache: MessageAnalysisCache
): Set<string> {
  const toolId = getToolUseId(message);
  if (!toolId) return new Set();
  return cache.siblingToolUseIDs.get(toolId) ?? new Set();
}

/**
 * Get progress messages for a message.
 * Original: u89 in chunks.147.mjs:2747-2751
 */
export function getProgressMessages(
  message: ConversationMessage,
  cache: MessageAnalysisCache
): ProgressMessage[] {
  const toolId = getToolUseId(message);
  if (!toolId) return [];
  return cache.progressMessagesByToolUseID.get(toolId) ?? [];
}

/**
 * Check if hook is in progress.
 * Original: m89 in chunks.147.mjs:2753-2757
 */
export function isHookInProgress(
  toolUseId: string,
  hookEvent: string,
  cache: MessageAnalysisCache
): boolean {
  const inProgress = cache.inProgressHookCounts.get(toolUseId)?.get(hookEvent) ?? 0;
  const resolved = cache.resolvedHookCounts.get(toolUseId)?.get(hookEvent) ?? 0;
  return inProgress > resolved;
}

// ============================================
// Text Content Extraction
// ============================================

/**
 * Get text content from assistant message.
 * Original: Xt in chunks.147.mjs
 */
export function getTextContent(message: ConversationMessage): string | null {
  if (message.type !== 'assistant') return null;

  if (Array.isArray(message.message.content)) {
    const text = message.message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { text: string }).text)
      .join('\n')
      .trim();
    return text || null;
  }

  return null;
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
