/**
 * @claudecode/features - Micro-Compact
 *
 * Micro-compaction for tool results without LLM calls.
 * Reconstructed from chunks.107.mjs:1600-1700
 */

import type { ConversationMessage, ContentBlock } from '@claudecode/core';
import type { MicroCompactOptions, MicroCompactResult } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import { estimateMessageTokens } from './thresholds.js';

// ============================================
// Constants
// ============================================

const CLEARED_MARKER = '[cleared]';

// ============================================
// Tool Result Analysis
// ============================================

/**
 * Find tool_use/tool_result pairs in messages.
 *
 * @param messages - Conversation messages
 * @returns Map of tool_use_id to result message index
 */
function findToolResultPairs(
  messages: ConversationMessage[]
): Map<string, { useIndex: number; resultIndex: number }> {
  const pairs = new Map<string, { useIndex: number; resultIndex: number }>();
  const toolUseLocations = new Map<string, number>();

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i] as {
      type: string;
      message?: { content?: ContentBlock[] };
    };

    if (msg.type === 'assistant' && Array.isArray(msg.message?.content)) {
      for (const block of msg.message.content) {
        if (block.type === 'tool_use') {
          const id = (block as { id: string }).id;
          toolUseLocations.set(id, i);
        }
      }
    }

    if (msg.type === 'user' && Array.isArray(msg.message?.content)) {
      for (const block of msg.message.content) {
        if (block.type === 'tool_result') {
          const useId = (block as { tool_use_id: string }).tool_use_id;
          const useIndex = toolUseLocations.get(useId);
          if (useIndex !== undefined) {
            pairs.set(useId, { useIndex, resultIndex: i });
          }
        }
      }
    }
  }

  return pairs;
}

/**
 * Estimate token savings from clearing a tool result.
 *
 * @param block - Tool result content block
 * @returns Estimated tokens that would be saved
 */
function estimateToolResultTokens(block: ContentBlock): number {
  const content = (block as { content?: string | unknown[] }).content;

  if (typeof content === 'string') {
    return Math.ceil(content.length / 4);
  }

  if (Array.isArray(content)) {
    let tokens = 0;
    for (const item of content) {
      if (typeof item === 'string') {
        tokens += Math.ceil(item.length / 4);
      } else if ((item as { type?: string }).type === 'image') {
        tokens += COMPACT_CONSTANTS.TOKENS_PER_IMAGE;
      } else if ((item as { text?: string }).text) {
        tokens += Math.ceil((item as { text: string }).text.length / 4);
      }
    }
    return tokens;
  }

  return 0;
}

// ============================================
// Micro-Compact Implementation
// ============================================

/**
 * Perform micro-compaction on messages.
 * Original: lc() in chunks.107.mjs
 *
 * Micro-compact replaces old tool_result content with "[cleared]"
 * to reduce token count without an LLM call.
 *
 * @param messages - Conversation messages
 * @param options - Micro-compact options
 * @returns Micro-compact result
 */
export function microCompact(
  messages: ConversationMessage[],
  options: MicroCompactOptions = {}
): MicroCompactResult {
  const {
    minSavings = COMPACT_CONSTANTS.MICRO_COMPACT_MIN_SAVINGS,
    recentToKeep = COMPACT_CONSTANTS.RECENT_TOOL_RESULTS_TO_KEEP,
    threshold = COMPACT_CONSTANTS.MICRO_COMPACT_THRESHOLD,
  } = options;

  // Find all tool result pairs
  const pairs = findToolResultPairs(messages);

  if (pairs.size === 0) {
    return {
      messages,
      tokensSaved: 0,
      resultsCleared: 0,
    };
  }

  // Sort by result index (most recent last)
  const sortedPairs = [...pairs.entries()].sort(
    ([, a], [, b]) => a.resultIndex - b.resultIndex
  );

  // Determine which results to keep (most recent N)
  const toKeep = new Set(
    sortedPairs.slice(-recentToKeep).map(([id]) => id)
  );

  // Calculate potential savings
  let potentialSavings = 0;
  const toClear: string[] = [];

  for (const [id, { resultIndex }] of sortedPairs) {
    if (toKeep.has(id)) continue;

    const msg = messages[resultIndex] as {
      message?: { content?: ContentBlock[] };
    };

    if (msg.message?.content) {
      for (const block of msg.message.content) {
        if (
          block.type === 'tool_result' &&
          (block as { tool_use_id: string }).tool_use_id === id
        ) {
          const savings = estimateToolResultTokens(block);
          potentialSavings += savings;
          toClear.push(id);
        }
      }
    }
  }

  // Check if savings meet minimum threshold
  if (potentialSavings < minSavings) {
    return {
      messages,
      tokensSaved: 0,
      resultsCleared: 0,
    };
  }

  // Check if current token count is above threshold
  const currentTokens = estimateMessageTokens(messages);
  if (currentTokens < threshold) {
    return {
      messages,
      tokensSaved: 0,
      resultsCleared: 0,
    };
  }

  // Perform micro-compact
  const clearedIds = new Set(toClear);
  const modifiedMessages = messages.map((msg) => {
    const m = msg as {
      type: string;
      message?: { content?: ContentBlock[] };
    };

    if (m.type !== 'user' || !Array.isArray(m.message?.content)) {
      return msg;
    }

    const hasToolResult = m.message.content.some(
      (block) =>
        block.type === 'tool_result' &&
        clearedIds.has((block as { tool_use_id: string }).tool_use_id)
    );

    if (!hasToolResult) {
      return msg;
    }

    // Create modified message with cleared tool results
    return {
      ...msg,
      message: {
        ...m.message,
        content: m.message.content.map((block) => {
          if (
            block.type === 'tool_result' &&
            clearedIds.has((block as { tool_use_id: string }).tool_use_id)
          ) {
            return {
              ...block,
              content: CLEARED_MARKER,
            };
          }
          return block;
        }),
      },
    };
  });

  return {
    messages: modifiedMessages as ConversationMessage[],
    tokensSaved: potentialSavings,
    resultsCleared: toClear.length,
  };
}

/**
 * Check if micro-compact would be beneficial.
 *
 * @param messages - Conversation messages
 * @param options - Micro-compact options
 * @returns Whether micro-compact should be applied
 */
export function shouldMicroCompact(
  messages: ConversationMessage[],
  options: MicroCompactOptions = {}
): boolean {
  const {
    minSavings = COMPACT_CONSTANTS.MICRO_COMPACT_MIN_SAVINGS,
    threshold = COMPACT_CONSTANTS.MICRO_COMPACT_THRESHOLD,
  } = options;

  // Check token threshold
  const currentTokens = estimateMessageTokens(messages);
  if (currentTokens < threshold) {
    return false;
  }

  // Estimate potential savings
  const pairs = findToolResultPairs(messages);
  const recentToKeep = options.recentToKeep ?? COMPACT_CONSTANTS.RECENT_TOOL_RESULTS_TO_KEEP;

  if (pairs.size <= recentToKeep) {
    return false;
  }

  const sortedPairs = [...pairs.entries()].sort(
    ([, a], [, b]) => a.resultIndex - b.resultIndex
  );

  const toKeep = new Set(
    sortedPairs.slice(-recentToKeep).map(([id]) => id)
  );

  let potentialSavings = 0;

  for (const [id, { resultIndex }] of sortedPairs) {
    if (toKeep.has(id)) continue;

    const msg = messages[resultIndex] as {
      message?: { content?: ContentBlock[] };
    };

    if (msg.message?.content) {
      for (const block of msg.message.content) {
        if (
          block.type === 'tool_result' &&
          (block as { tool_use_id: string }).tool_use_id === id
        ) {
          potentialSavings += estimateToolResultTokens(block);
        }
      }
    }
  }

  return potentialSavings >= minSavings;
}

// ============================================
// Export
// ============================================

export { microCompact, shouldMicroCompact, CLEARED_MARKER };
