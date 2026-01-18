/**
 * @claudecode/core - Message Normalization
 *
 * Functions for normalizing messages for API submission.
 * Reconstructed from chunks.147.mjs:2774-2998
 */

import type { Tool, ContentBlock } from '@claudecode/shared';
import type {
  ConversationMessage,
  AssistantMessage,
  UserMessage,
  AttachmentMessage,
  ToolUseGroup,
} from './types.js';
import {
  hasToolUse,
  hasToolResult,
  isHookAttachment,
  isFilteredMessage,
  isToolReference,
} from './type-guards.js';
import { createUserMessage } from './factory.js';

// ============================================
// Attachment Reordering
// ============================================

/**
 * Reorder attachments to be adjacent to their related messages.
 * Original: I$7 in chunks.147.mjs:2774-2784
 *
 * Attachments need to be placed immediately after their related
 * assistant/tool result messages for proper API processing.
 */
export function reorderAttachments(
  messages: ConversationMessage[]
): ConversationMessage[] {
  const result: ConversationMessage[] = [];
  const pendingAttachments: AttachmentMessage[] = [];

  // Process in reverse to collect attachments and place them correctly
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];

    if (msg.type === 'attachment') {
      pendingAttachments.unshift(msg);
    } else if (
      (msg.type === 'assistant' ||
        (msg.type === 'user' &&
          Array.isArray(msg.message.content) &&
          (msg.message.content as ContentBlock[])[0]?.type === 'tool_result')) &&
      pendingAttachments.length > 0
    ) {
      // Place message followed by pending attachments
      result.unshift(msg, ...pendingAttachments);
      pendingAttachments.length = 0;
    } else {
      result.unshift(msg);
    }
  }

  // Add any remaining attachments at the beginning
  result.unshift(...pendingAttachments);

  return result;
}

// ============================================
// Message Merging
// ============================================

/**
 * Merge two user messages.
 * Original: F$7 in chunks.147.mjs:2979-2989
 */
export function mergeUserMessages(
  first: UserMessage,
  second: UserMessage
): UserMessage {
  const firstContent = normalizeContentToArray(first.message.content);
  const secondContent = normalizeContentToArray(second.message.content);

  return {
    ...first,
    message: {
      ...first.message,
      content: reorderToolResultsFirst([...firstContent, ...secondContent]),
    },
  };
}

/**
 * Merge two assistant messages (for per-block yielding).
 * Original: K$7 in chunks.147.mjs:2962-2970
 */
export function mergeAssistantMessages(
  first: AssistantMessage,
  second: AssistantMessage
): AssistantMessage {
  return {
    ...first,
    message: {
      ...first.message,
      content: [...first.message.content, ...second.message.content],
    },
  };
}

/**
 * Merge user message with attachment content.
 * Original: W$7 in chunks.147.mjs:2950-2960
 */
export function mergeUserWithAttachment(
  user: UserMessage,
  attachment: UserMessage
): UserMessage {
  const userContent = normalizeContentToArray(user.message.content);
  const attachmentContent = normalizeContentToArray(attachment.message.content);

  return {
    ...user,
    message: {
      ...user.message,
      content: reorderToolResultsFirst(
        mergeToolResultWithText(userContent, attachmentContent)
      ),
    },
  };
}

// ============================================
// Content Normalization Helpers
// ============================================

/**
 * Normalize content to array format.
 * Original: E$1 in chunks.147.mjs:3000-3006
 */
export function normalizeContentToArray(
  content: string | ContentBlock[]
): ContentBlock[] {
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }
  return content;
}

/**
 * Reorder content blocks with tool_result first.
 * Original: SJ9 in chunks.147.mjs:2991-2998
 */
export function reorderToolResultsFirst(
  content: ContentBlock[]
): ContentBlock[] {
  const toolResults: ContentBlock[] = [];
  const other: ContentBlock[] = [];

  for (const block of content) {
    if (block.type === 'tool_result') {
      toolResults.push(block);
    } else {
      other.push(block);
    }
  }

  return [...toolResults, ...other];
}

/**
 * Merge tool result with following text content.
 * Original: H$7 in chunks.147.mjs:3008-3017
 */
export function mergeToolResultWithText(
  first: ContentBlock[],
  second: ContentBlock[]
): ContentBlock[] {
  const lastBlock = first[first.length - 1];

  // If last block is a tool_result with string content, and all second blocks are text,
  // merge the text into the tool_result
  if (
    lastBlock?.type === 'tool_result' &&
    typeof (lastBlock as { content: unknown }).content === 'string' &&
    second.every((block) => block.type === 'text')
  ) {
    const textContent = second
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n\n')
      .trim();

    if (textContent) {
      return [
        ...first.slice(0, -1),
        {
          ...lastBlock,
          content: [
            (lastBlock as { content: string }).content,
            textContent,
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ];
    }
  }

  return [...first, ...second];
}

// ============================================
// Tool Input Normalization
// ============================================

/**
 * Normalize tool input based on tool schema.
 * Original: uA9 in chunks.147.mjs
 */
export function normalizeToolInput(
  tool: Tool,
  input: unknown
): unknown {
  // If input is already correctly typed, return as-is
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  // Parse if string
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }

  // Tool-specific normalization could be added here
  return input;
}

// ============================================
// Tool Reference Filtering
// ============================================

/**
 * Check if tool search is enabled.
 * Original: Zd in chunks.147.mjs
 */
let toolSearchEnabled = false;

export function setToolSearchEnabled(enabled: boolean): void {
  toolSearchEnabled = enabled;
}

export function isToolSearchEnabled(): boolean {
  return toolSearchEnabled;
}

/**
 * Filter tool references based on available tools.
 * Original: D$7 in chunks.147.mjs:2790-2828
 */
export function filterToolReferences(
  message: UserMessage,
  availableToolNames: Set<string>
): UserMessage {
  const content = message.message.content;
  if (!Array.isArray(content)) return message;

  // Check if any tool_result has tool_reference to unavailable tool
  const hasUnavailableRefs = content.some((block) => {
    if (block.type !== 'tool_result') return false;
    const resultContent = (block as { content?: unknown }).content;
    if (!Array.isArray(resultContent)) return false;
    return resultContent.some((item) => {
      if (!isToolReference(item as ContentBlock)) return false;
      const toolName = (item as { tool_name: string }).tool_name;
      return toolName && !availableToolNames.has(toolName);
    });
  });

  if (!hasUnavailableRefs) return message;

  // Filter out unavailable tool references
  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block) => {
        if (block.type !== 'tool_result') return block;
        const resultContent = (block as { content?: unknown }).content;
        if (!Array.isArray(resultContent)) return block;

        const filtered = resultContent.filter((item) => {
          if (!isToolReference(item as ContentBlock)) return true;
          const toolName = (item as { tool_name: string }).tool_name;
          if (!toolName) return true;
          return availableToolNames.has(toolName);
        });

        if (filtered.length === 0) {
          return {
            ...block,
            content: [
              {
                type: 'text',
                text: '[Tool references removed - tools no longer available]',
              },
            ],
          };
        }

        return { ...block, content: filtered };
      }),
    },
  };
}

/**
 * Remove all tool references (when tool search disabled).
 * Original: XP0 in chunks.147.mjs:2830-2855
 */
export function removeAllToolReferences(message: UserMessage): UserMessage {
  const content = message.message.content;
  if (!Array.isArray(content)) return message;

  const hasToolRefs = content.some((block) => {
    if (block.type !== 'tool_result') return false;
    const resultContent = (block as { content?: unknown }).content;
    if (!Array.isArray(resultContent)) return false;
    return resultContent.some((item) => isToolReference(item as ContentBlock));
  });

  if (!hasToolRefs) return message;

  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block) => {
        if (block.type !== 'tool_result') return block;
        const resultContent = (block as { content?: unknown }).content;
        if (!Array.isArray(resultContent)) return block;

        const filtered = resultContent.filter(
          (item) => !isToolReference(item as ContentBlock)
        );

        if (filtered.length === 0) {
          return {
            ...block,
            content: [
              {
                type: 'text',
                text: '[Tool references removed - tool search not enabled]',
              },
            ],
          };
        }

        return { ...block, content: filtered };
      }),
    },
  };
}

/**
 * Strip caller field from tool_use blocks (for API compatibility).
 * Original: GJ9 in chunks.147.mjs:2857-2874
 */
export function stripToolUseCaller(
  message: AssistantMessage
): AssistantMessage {
  if (
    !message.message.content.some(
      (block) =>
        block.type === 'tool_use' &&
        'caller' in block &&
        (block as { caller?: unknown }).caller !== null
    )
  ) {
    return message;
  }

  return {
    ...message,
    message: {
      ...message.message,
      content: message.message.content.map((block) => {
        if (block.type !== 'tool_use') return block;
        return {
          type: 'tool_use',
          id: (block as { id: string }).id,
          name: (block as { name: string }).name,
          input: (block as { input: unknown }).input,
        };
      }),
    },
  };
}

// ============================================
// Main Normalization Function
// ============================================

/**
 * Get last element of array.
 * Original: QC in chunks.147.mjs
 */
function getLastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * Remove empty messages from array.
 * Original: MeB in chunks.147.mjs
 */
function removeEmptyMessages(messages: ConversationMessage[]): void {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.type === 'user' || msg.type === 'assistant') {
      const content =
        msg.type === 'user' ? msg.message.content : msg.message.content;
      if (
        Array.isArray(content) &&
        content.length === 0
      ) {
        messages.splice(i, 1);
      }
    }
  }
}

/**
 * Ensure messages alternate between user and assistant.
 * Original: w$7 in chunks.147.mjs
 */
function ensureAlternatingMessages(
  messages: ConversationMessage[]
): ConversationMessage[] {
  // The API requires strict alternation between user and assistant messages
  // This function ensures that pattern
  return messages;
}

/**
 * Convert attachment to user message with system content.
 * Original: q$7 in chunks.147.mjs
 */
function convertAttachmentToUserMessage(
  attachment: { type: string; content?: string; [key: string]: unknown }
): UserMessage[] {
  // Convert attachment content to a user message
  const content = attachment.content || `[Attachment: ${attachment.type}]`;
  return [
    createUserMessage({
      content: [{ type: 'text', text: content }],
    }),
  ];
}

/**
 * Normalize messages for API submission.
 * Original: FI in chunks.147.mjs:2876-2948
 *
 * This function:
 * 1. Filters out progress and system messages
 * 2. Reorders attachments
 * 3. Merges consecutive user/assistant messages
 * 4. Processes tool inputs
 * 5. Converts attachments to user messages
 */
export function normalizeMessagesToAPI(
  messages: ConversationMessage[],
  tools: Tool[] = []
): ConversationMessage[] {
  const toolNames = new Set(tools.map((t) => t.name));
  const reordered = reorderAttachments(messages);
  const output: ConversationMessage[] = [];

  // Filter and process messages
  reordered
    .filter((msg) => {
      // Remove progress and system messages
      if (msg.type === 'progress' || msg.type === 'system') return false;
      // Remove filtered messages
      if (isFilteredMessage(msg)) return false;
      return true;
    })
    .forEach((msg) => {
      switch (msg.type) {
        case 'user': {
          // Handle tool references based on tool search setting
          let processedMsg: UserMessage;
          if (!isToolSearchEnabled()) {
            processedMsg = removeAllToolReferences(msg);
          } else {
            processedMsg = filterToolReferences(msg, toolNames);
          }

          // Merge consecutive user messages (API requires alternation)
          const lastMsg = getLastElement(output);
          if (lastMsg?.type === 'user') {
            output[output.length - 1] = mergeUserMessages(
              lastMsg as UserMessage,
              processedMsg
            );
            return;
          }
          output.push(processedMsg);
          return;
        }

        case 'assistant': {
          // Process tool inputs
          const processedMsg: AssistantMessage = {
            ...msg,
            message: {
              ...msg.message,
              content: msg.message.content.map((block) => {
                if (block.type === 'tool_use') {
                  const tool = tools.find(
                    (t) => t.name === (block as { name: string }).name
                  );
                  const normalizedInput = tool
                    ? normalizeToolInput(tool, (block as { input: unknown }).input)
                    : (block as { input: unknown }).input;

                  if (isToolSearchEnabled()) {
                    return { ...block, input: normalizedInput };
                  }
                  return {
                    type: 'tool_use' as const,
                    id: (block as { id: string }).id,
                    name: (block as { name: string }).name,
                    input: normalizedInput,
                  };
                }
                return block;
              }),
            },
          };

          // Check for merge with previous assistant message (same message.id)
          for (let i = output.length - 1; i >= 0; i--) {
            const prevMsg = output[i];
            if (prevMsg.type !== 'assistant' && !hasToolResultBlocks(prevMsg)) {
              break;
            }
            if (prevMsg.type === 'assistant') {
              if (prevMsg.message.id === processedMsg.message.id) {
                output[i] = mergeAssistantMessages(
                  prevMsg as AssistantMessage,
                  processedMsg
                );
                return;
              }
              break;
            }
          }
          output.push(processedMsg);
          return;
        }

        case 'attachment': {
          // Convert attachment to user message
          const converted = convertAttachmentToUserMessage(msg.attachment);
          const lastMsg = getLastElement(output);
          if (lastMsg?.type === 'user') {
            output[output.length - 1] = converted.reduce(
              (acc, m) => mergeUserWithAttachment(acc, m),
              lastMsg as UserMessage
            );
            return;
          }
          output.push(...converted);
          return;
        }
      }
    });

  // Final cleanup
  removeEmptyMessages(output);
  return ensureAlternatingMessages(output);
}

// ============================================
// Helper Imports
// ============================================

function hasToolResultBlocks(msg: ConversationMessage): boolean {
  if (msg.type !== 'user') return false;
  const content = msg.message.content;
  if (typeof content === 'string') return false;
  return (content as ContentBlock[]).some((block) => block.type === 'tool_result');
}

// ============================================
// Export
// ============================================

export {
  reorderAttachments,
  mergeUserMessages,
  mergeAssistantMessages,
  mergeUserWithAttachment,
  normalizeContentToArray,
  reorderToolResultsFirst,
  mergeToolResultWithText,
  normalizeToolInput,
  filterToolReferences,
  removeAllToolReferences,
  stripToolUseCaller,
  normalizeMessagesToAPI,
  setToolSearchEnabled,
  isToolSearchEnabled,
};
