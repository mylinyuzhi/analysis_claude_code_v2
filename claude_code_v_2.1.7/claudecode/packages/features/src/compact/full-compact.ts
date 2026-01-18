/**
 * @claudecode/features - Full Compact
 *
 * LLM-based full conversation compaction.
 * Reconstructed from chunks.132.mjs:489-670
 *
 * Key symbols:
 * - cF1 → fullCompact
 * - H97 → generateConversationSummary
 * - xZ0 → buildCompactInstructions
 */

import { generateUUID } from '@claudecode/shared';
import {
  createUserMessage,
  streamApiCall,
  type ConversationMessage,
  type MessagesRequest,
  type StreamApiCallOptions,
  type StreamingQueryResult,
} from '@claudecode/core';
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
 * Convert ConversationMessage to API message format.
 */
function convertToApiMessage(
  msg: ConversationMessage
): { role: 'user' | 'assistant'; content: string | unknown[] } | null {
  if (msg.type === 'user') {
    const userMsg = msg as { content?: string | unknown[] };
    return {
      role: 'user',
      content: userMsg.content || '',
    };
  }
  if (msg.type === 'assistant') {
    const assistantMsg = msg as { message?: { content?: unknown[] } };
    return {
      role: 'assistant',
      content: assistantMsg.message?.content || [],
    };
  }
  return null;
}

/**
 * Generate conversation summary via LLM.
 * Original: H97() in chunks.132.mjs:590-652
 *
 * Streams the summary generation request to the LLM and collects the response.
 */
export async function generateConversationSummary(params: {
  messages: ConversationMessage[];
  summaryRequest: ConversationMessage;
  appState: unknown;
  context: CompactSessionContext;
  preCompactTokenCount?: number;
}): Promise<ConversationMessage> {
  const { messages, summaryRequest, context, preCompactTokenCount } = params;

  // Convert conversation messages to API format
  const apiMessages: { role: 'user' | 'assistant'; content: string | unknown[] }[] = [];

  for (const msg of messages) {
    const converted = convertToApiMessage(msg);
    if (converted) {
      apiMessages.push(converted);
    }
  }

  // Add the summary request as the final user message
  const summaryRequestConverted = convertToApiMessage(summaryRequest);
  if (summaryRequestConverted) {
    apiMessages.push(summaryRequestConverted);
  }

  // Get model from context or use default compact model
  const model = context.compactModel || 'claude-sonnet-4-20250514';

  // Build the API request
  const request: MessagesRequest = {
    model,
    max_tokens: 4096,
    messages: apiMessages,
    system: `You are a helpful assistant that summarizes conversations.
Create a concise but comprehensive summary that preserves:
- Key decisions and conclusions
- Important files, code changes, and technical details
- Outstanding tasks and next steps
- Critical context needed for continuing the conversation

The summary will replace the full conversation history, so include all essential information.`,
  };

  // Build streaming options
  const options: StreamApiCallOptions = {
    model,
    signal: context.abortController?.signal,
    onProgress: (text: string) => {
      // Update response length for UI
      context.setResponseLength?.(() => text.length);
    },
  };

  try {
    // Stream the API call
    const stream = streamApiCall(request, options);

    // Collect the response
    let responseText = '';
    let responseUsage: CompactUsageStats = {
      input_tokens: 0,
      output_tokens: 0,
    };

    for await (const chunk of stream) {
      // Accumulate text from content blocks
      if (chunk.contentBlocks) {
        for (const block of chunk.contentBlocks) {
          if (block.type === 'text' && typeof block.text === 'string') {
            responseText = block.text;
          }
        }
      }

      // Capture usage statistics
      if (chunk.usage) {
        responseUsage = {
          input_tokens: chunk.usage.input_tokens || 0,
          output_tokens: chunk.usage.output_tokens || 0,
          cache_read_input_tokens: chunk.usage.cache_read_input_tokens,
          cache_creation_input_tokens: chunk.usage.cache_creation_input_tokens,
        };
      }
    }

    // Validate we got a response
    if (!responseText) {
      throw new CompactError(
        CompactErrorCode.SUMMARY_FAILED,
        'LLM returned empty summary'
      );
    }

    // Create assistant message with summary
    return {
      type: 'assistant',
      uuid: generateUUID(),
      timestamp: new Date().toISOString(),
      message: {
        id: generateUUID(),
        container: null,
        model,
        role: 'assistant',
        stop_reason: 'end_turn',
        stop_sequence: null,
        type: 'message',
        usage: responseUsage,
        content: [{ type: 'text', text: responseText }],
        context_management: null,
      },
    } as ConversationMessage;
  } catch (error) {
    // Check if aborted
    if (context.abortController?.signal.aborted) {
      throw new CompactError(
        CompactErrorCode.INTERRUPTED,
        COMPACTION_INTERRUPTED_ERROR
      );
    }

    // Re-throw compact errors
    if (error instanceof CompactError) {
      throw error;
    }

    // Wrap other errors
    throw new CompactError(
      CompactErrorCode.SUMMARY_FAILED,
      `Failed to generate summary: ${error instanceof Error ? error.message : String(error)}`
    );
  }
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
