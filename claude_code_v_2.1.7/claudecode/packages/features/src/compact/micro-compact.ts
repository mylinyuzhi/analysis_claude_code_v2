/**
 * @claudecode/features - Micro-Compact
 *
 * Tool-result micro-compaction (no LLM calls).
 * Original: lc() / microCompactToolResults in chunks.132.mjs:1111-1224
 */

import { createUserMessage, type ConversationMessage } from '@claudecode/core';
import { parseBoolean, type ContentBlock } from '@claudecode/shared';
import type { MicroCompactOptions, MicroCompactResult } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import { calculateThresholds, estimateMessageTokens } from './thresholds.js';

// ============================================
// Constants
// ============================================

export const CLEARED_MARKER = '[cleared]';

// Tools whose results are eligible for micro-compaction.
// Original: x97 = new Set([z3, X9, DI, lI, aR, cI, I8, BY])
const COMPACTABLE_TOOLS = new Set([
  'Read',
  'Bash',
  'Grep',
  'Glob',
  'WebSearch',
  'WebFetch',
  'Edit',
  'Write',
]);

// Persistent micro-compact state (module-level)
const compactedToolIds = new Set<string>();
const toolResultTokenCache = new Map<string, number>();
let microCompactOccurred = false;
const microCompactListeners: Array<() => void> = [];

export function didMicroCompactOccur(): boolean {
  return microCompactOccurred;
}

export function addMicroCompactListener(listener: () => void): () => void {
  microCompactListeners.push(listener);
  return () => {
    const idx = microCompactListeners.indexOf(listener);
    if (idx >= 0) microCompactListeners.splice(idx, 1);
  };
}

function notifyMicroCompactListeners(): void {
  for (const l of microCompactListeners) {
    try {
      l();
    } catch {
      // Ignore listener errors
    }
  }
}

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
function countMessageTokensForToolResult(block: ContentBlock): number {
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

/** Cache token counts for tool results (Original: y97) */
function getCachedToolResultTokens(toolUseId: string, block: ContentBlock): number {
  const cached = toolResultTokenCache.get(toolUseId);
  if (cached !== undefined) return cached;
  const computed = countMessageTokensForToolResult(block);
  toolResultTokenCache.set(toolUseId, computed);
  return computed;
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
/**
 * Micro-compact tool results.
 *
 * Matches chunks.132.mjs behavior:
 * - Keeps last 3 tool results intact
 * - Clears older results when total tool-result tokens exceed threshold
 * - When auto-triggered, also requires (a) above warning threshold and (b) savings >= 20k
 */
export async function microCompact(
  messages: ConversationMessage[],
  threshold?: number,
  context?: { readFileState?: Map<string, unknown> }
): Promise<{
  messages: ConversationMessage[];
  compactionInfo?: { systemMessage?: ConversationMessage };
  resultsCleared: number;
  tokensSaved: number;
}> {
  microCompactOccurred = false;

  if (parseBoolean(process.env.DISABLE_MICROCOMPACT)) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  const hasExplicitThreshold = threshold !== undefined;
  const targetThreshold = hasExplicitThreshold
    ? threshold!
    : COMPACT_CONSTANTS.MICRO_COMPACT_THRESHOLD; // P97 = 40000

  // Phase 1: collect compactable tool_use ids and tool_result token counts
  const toolUseIds: string[] = [];
  const toolResultTokens = new Map<string, number>();

  for (const msg of messages) {
    const m = msg as { type: string; message?: { content?: ContentBlock[] } };
    if ((m.type !== 'assistant' && m.type !== 'user') || !Array.isArray(m.message?.content)) continue;

    for (const block of m.message.content) {
      if (block.type === 'tool_use') {
        const bu = block as { id?: string; name?: string };
        if (!bu.id || !bu.name) continue;
        if (!COMPACTABLE_TOOLS.has(bu.name)) continue;
        if (compactedToolIds.has(bu.id)) continue;
        toolUseIds.push(bu.id);
      } else if (block.type === 'tool_result') {
        const br = block as { tool_use_id?: string };
        if (!br.tool_use_id) continue;
        if (!toolUseIds.includes(br.tool_use_id)) continue;
        const tokens = getCachedToolResultTokens(br.tool_use_id, block);
        toolResultTokens.set(br.tool_use_id, tokens);
      }
    }
  }

  if (toolUseIds.length === 0) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  // Phase 2: determine which tool results to compact
  const KEEP_RECENT = COMPACT_CONSTANTS.RECENT_TOOL_RESULTS_TO_KEEP; // S97 = 3
  const toolsToKeep = new Set(toolUseIds.slice(-KEEP_RECENT));
  const totalUncompactedTokens = [...toolResultTokens.values()].reduce((a, b) => a + b, 0);

  let tokensToSave = 0;
  const toolsToCompact = new Set<string>();
  for (const id of toolUseIds) {
    if (toolsToKeep.has(id)) continue;
    if (totalUncompactedTokens - tokensToSave > targetThreshold) {
      toolsToCompact.add(id);
      tokensToSave += toolResultTokens.get(id) ?? 0;
    }
  }

  // Phase 3: auto-trigger gating (warning threshold + minimum savings)
  if (!hasExplicitThreshold) {
    const currentTokens = estimateMessageTokens(messages);
    const thresholds = calculateThresholds(currentTokens);
    if (!thresholds.isAboveWarningThreshold || tokensToSave < COMPACT_CONSTANTS.MICRO_COMPACT_MIN_SAVINGS) {
      toolsToCompact.clear();
      tokensToSave = 0;
    }
  }

  if (toolsToCompact.size === 0) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  // Phase 4: readFileState cleanup (only for Read tool)
  if (context?.readFileState && toolsToCompact.size > 0) {
    const compactedFilepaths = new Map<string, string>();
    const keptFilepaths = new Set<string>();

    for (const msg of messages) {
      const m = msg as { type: string; message?: { content?: ContentBlock[] } };
      if ((m.type !== 'assistant' && m.type !== 'user') || !Array.isArray(m.message?.content)) continue;
      for (const block of m.message.content) {
        if (block.type !== 'tool_use') continue;
        const tu = block as { id?: string; name?: string; input?: { file_path?: unknown } };
        if (tu.name !== 'Read' || !tu.id) continue;
        const fp = tu.input?.file_path;
        if (typeof fp !== 'string') continue;

        if (toolsToCompact.has(tu.id)) compactedFilepaths.set(fp, tu.id);
        else keptFilepaths.add(fp);
      }
    }

    for (const [fp] of compactedFilepaths) {
      if (!keptFilepaths.has(fp)) {
        context.readFileState.delete(fp);
      }
    }
  }

  // Phase 5: replace tool_result content
  const newMessages = messages.map((msg) => {
    const m = msg as { type: string; message?: { content?: ContentBlock[] } };
    if (!Array.isArray(m.message?.content)) return msg;

    const updatedContent = m.message.content.map((block) => {
      if (block.type !== 'tool_result') return block;
      const tr = block as { tool_use_id?: string; content?: unknown };
      if (!tr.tool_use_id || !toolsToCompact.has(tr.tool_use_id)) return block;
      return { ...block, content: CLEARED_MARKER };
    });

    return { ...msg, message: { ...m.message, content: updatedContent } };
  });

  // Phase 6: update state & return
  for (const id of toolsToCompact) compactedToolIds.add(id);

  microCompactOccurred = true;
  notifyMicroCompactListeners();

  const resultsCleared = toolsToCompact.size;
  const systemMessage = createUserMessage({
    content: `<system-reminder>Micro-compact cleared ${resultsCleared} tool result(s) to reduce context size.</system-reminder>`,
    isMeta: true,
  }) as unknown as ConversationMessage;

  return {
    messages: newMessages as ConversationMessage[],
    compactionInfo: { systemMessage },
    resultsCleared,
    tokensSaved: tokensToSave,
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
          potentialSavings += countMessageTokensForToolResult(block);
        }
      }
    }
  }

  return potentialSavings >= minSavings;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复导出。
