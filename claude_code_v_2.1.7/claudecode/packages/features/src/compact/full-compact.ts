/**
 * @claudecode/features - Full Compact
 *
 * LLM-based full conversation compaction.
 * Reconstructed from chunks.132.mjs:489-670
 */

import { generateUUID } from '@claudecode/shared';
import { createUserMessage, type ConversationMessage } from '@claudecode/core';
import type {
  FullCompactResult,
  CompactSessionContext,
  PreCompactHookResult,
  CompactUsageStats,
} from './types.js';
import { CompactError, CompactErrorCode, COMPACT_CONSTANTS } from './types.js';
import { estimateMessageTokens } from './thresholds.js';
import {
  collectContextAttachments,
  createBoundaryMarker,
  generateConversationId,
  formatSummaryContent,
} from './context-restore.js';

// ============================================
// Error Messages
// ============================================

const NOT_ENOUGH_MESSAGES_ERROR = 'Cannot compact: No messages to summarize';
const COMPACTION_INTERRUPTED_ERROR = 'Compaction was interrupted';
const SUMMARY_FAILED_ERROR = 'Failed to generate conversation summary';

// ============================================
// Pre-Compact Hooks
// ============================================

/**
 * Execute pre-compact hooks.
 * Original: sU0() in chunks.120.mjs:2173-2202
 *
 * @param params - Hook parameters
 * @param signal - Abort signal
 * @returns Hook results
 */
export async function executePreCompactHooks(
  params: { trigger: 'auto' | 'manual'; customInstructions: string | null },
  signal?: AbortSignal
): Promise<PreCompactHookResult> {
  // This would integrate with the hooks system
  // Placeholder implementation
  return {};
}

/**
 * Execute plugin hooks for an event.
 * Original: WU() in chunks.132.mjs
 */
export async function executePluginHooksForEvent(event: string): Promise<unknown[]> {
  // This would integrate with the plugin system
  // Placeholder implementation
  return [];
}

// ============================================
// Summary Generation
// ============================================

/**
 * Build compact instructions prompt.
 * Original: xZ0() in chunks.132.mjs
 */
export function buildCompactInstructions(customInstructions?: string): string {
  const basePrompt = `Please summarize the conversation above. Focus on:
1. Key decisions and conclusions reached
2. Important files and code changes discussed
3. Outstanding tasks or next steps
4. Critical context that should be preserved

Be concise but thorough. The summary will replace the full conversation history.`;

  if (customInstructions) {
    return `${basePrompt}\n\nAdditional instructions:\n${customInstructions}`;
  }

  return basePrompt;
}

/**
 * Extract text content from assistant message.
 * Original: Xt() in chunks.132.mjs
 */
export function extractTextContent(message: ConversationMessage): string | null {
  if (message.type !== 'assistant') return null;

  const content = (message as { message?: { content?: unknown[] } }).message?.content;
  if (!Array.isArray(content)) return null;

  const textBlocks = content
    .filter((block) => (block as { type: string }).type === 'text')
    .map((block) => (block as { text: string }).text);

  return textBlocks.join('\n').trim() || null;
}

/**
 * Extract usage stats from assistant message.
 * Original: Jd() in chunks.132.mjs
 */
export function extractUsageStats(message: ConversationMessage): CompactUsageStats | null {
  if (message.type !== 'assistant') return null;

  const usage = (message as { message?: { usage?: CompactUsageStats } }).message?.usage;
  return usage ?? null;
}

/**
 * Generate conversation summary via LLM.
 * Original: H97() in chunks.132.mjs:590-652
 *
 * This is a placeholder that would need to integrate with the LLM API.
 */
export async function generateConversationSummary(params: {
  messages: ConversationMessage[];
  summaryRequest: ConversationMessage;
  appState: unknown;
  context: CompactSessionContext;
  preCompactTokenCount?: number;
}): Promise<ConversationMessage> {
  // This would integrate with the LLM API for actual summary generation
  // Placeholder implementation that creates a mock summary

  const { messages, context } = params;

  // Simulate summary generation
  const messageCount = messages.length;
  const summaryText = `[Summary of ${messageCount} messages]

This conversation covered:
- Discussion and context up to this point
- Any files read or modified
- Key decisions made

The full conversation has been compacted to preserve context limits.`;

  // Create assistant message with summary
  return {
    type: 'assistant',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    message: {
      id: generateUUID(),
      container: null,
      model: 'claude-sonnet-4-20250514',
      role: 'assistant',
      stop_reason: 'stop_sequence',
      stop_sequence: null,
      type: 'message',
      usage: {
        input_tokens: 1000,
        output_tokens: 200,
      },
      content: [{ type: 'text', text: summaryText }],
      context_management: null,
    },
  } as ConversationMessage;
}

// ============================================
// Full Compact Implementation
// ============================================

/**
 * Perform full LLM-based compaction.
 * Original: cF1() in chunks.132.mjs:489-579
 *
 * @param messages - Conversation messages to compact
 * @param context - Compact session context
 * @param preserveHistory - Whether to mark summary as preserving history
 * @param customInstructions - Custom instructions for summary
 * @param isAuto - Whether this is an auto-triggered compact
 * @returns Full compact result
 */
export async function fullCompact(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  preserveHistory: boolean = true,
  customInstructions?: string,
  isAuto: boolean = false
): Promise<FullCompactResult> {
  try {
    // Validate we have messages to compact
    if (messages.length === 0) {
      throw new CompactError(CompactErrorCode.NOT_ENOUGH_MESSAGES, NOT_ENOUGH_MESSAGES_ERROR);
    }

    // Get pre-compact token count for telemetry
    const preCompactTokenCount = estimateMessageTokens(messages);

    // Get app state
    const appState = await context.getAppState();

    // Update UI spinners
    context.setSpinnerColor?.('claudeBlue_FOR_SYSTEM_SPINNER');
    context.setSpinnerShimmerColor?.('claudeBlueShimmer_FOR_SYSTEM_SPINNER');
    context.setSpinnerMessage?.('Running PreCompact hooks...');
    context.setSDKStatus?.('compacting');

    // PHASE 1: Execute PreCompact hooks
    const hookResults = await executePreCompactHooks(
      {
        trigger: isAuto ? 'auto' : 'manual',
        customInstructions: customInstructions ?? null,
      },
      context.abortController.signal
    );

    // Merge hook-provided custom instructions
    let finalInstructions = customInstructions;
    if (hookResults.newCustomInstructions) {
      finalInstructions = finalInstructions
        ? `${finalInstructions}\n\n${hookResults.newCustomInstructions}`
        : hookResults.newCustomInstructions;
    }
    const userDisplayMessage = hookResults.userDisplayMessage;

    // Update UI for summary generation
    context.setStreamMode?.('requesting');
    context.setResponseLength?.(() => 0);
    context.setSpinnerMessage?.('Compacting conversation');

    // PHASE 2: Build summary request
    const summaryPrompt = buildCompactInstructions(finalInstructions);
    const summaryRequest = createUserMessage({ content: summaryPrompt });

    // PHASE 3: Stream summary from LLM
    const summaryResponse = await generateConversationSummary({
      messages,
      summaryRequest,
      appState,
      context,
      preCompactTokenCount,
    });

    // PHASE 4: Validate summary response
    const summaryText = extractTextContent(summaryResponse);
    if (!summaryText) {
      throw new CompactError(
        CompactErrorCode.SUMMARY_FAILED,
        SUMMARY_FAILED_ERROR
      );
    }

    // PHASE 5: Restore context
    const previousReadState = new Map(context.readFileState);
    context.readFileState.clear();

    context.setSpinnerMessage?.('Restoring context...');
    const attachments = await collectContextAttachments(context, previousReadState);

    // PHASE 6: Run SessionStart hooks
    context.setSpinnerMessage?.('Running SessionStart hooks...');
    const sessionStartHookResults = await executePluginHooksForEvent('compact');

    // PHASE 7: Calculate post-compact metrics
    const usageStats = extractUsageStats(summaryResponse);
    const postCompactTokenCount = estimateMessageTokens([summaryResponse]);

    // Create boundary marker and format summary
    const boundaryMarker = createBoundaryMarker(
      isAuto ? 'auto' : 'manual',
      preCompactTokenCount
    );
    const conversationId = generateConversationId(context.agentId);

    const summaryMessages: ConversationMessage[] = [
      createUserMessage({
        content: formatSummaryContent(summaryText, preserveHistory, conversationId),
        isCompactSummary: true,
        isVisibleInTranscriptOnly: true,
      }),
    ];

    return {
      boundaryMarker,
      summaryMessages,
      attachments,
      hookResults: sessionStartHookResults,
      userDisplayMessage,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage: usageStats ?? undefined,
    };
  } catch (error) {
    // Reset UI state on error
    context.setStreamMode?.('requesting');
    context.setResponseLength?.(() => 0);
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);

    throw error;
  } finally {
    // Reset UI state
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);
  }
}

// ============================================
// Export
// ============================================

export {
  executePreCompactHooks,
  executePluginHooksForEvent,
  buildCompactInstructions,
  extractTextContent,
  extractUsageStats,
  generateConversationSummary,
  fullCompact,
  NOT_ENOUGH_MESSAGES_ERROR,
  COMPACTION_INTERRUPTED_ERROR,
  SUMMARY_FAILED_ERROR,
};
