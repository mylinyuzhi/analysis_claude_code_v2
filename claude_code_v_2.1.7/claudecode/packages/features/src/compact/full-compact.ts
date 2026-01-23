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

import { generateUUID, sleep } from '@claudecode/shared';
import {
  createUserMessage,
  streamApiCall,
  type ConversationMessage,
  type MessagesRequest,
  type StreamApiCallOptions,
  type StreamingQueryResult,
} from '@claudecode/core';
import { analyticsEvent } from '@claudecode/platform';
import type { Message } from '@claudecode/shared';
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

import {
  executePreCompactHooks as executePreCompactHooksTrigger,
  executePluginHooksForEvent as executePluginHooksForEventTrigger,
} from '../hooks/triggers.js';

// ============================================
// Error Messages
// ============================================

export const NOT_ENOUGH_MESSAGES_ERROR = 'Not enough messages to compact.'; // DhA
export const COMPACTION_INTERRUPTED_ERROR = 'Compaction interrupted. Please try again.'; // Bs2
export const SUMMARY_FAILED_ERROR = 'Failed to generate conversation summary';

// ============================================
// Hook Integration (delegate to hooks module)
// ============================================

/**
 * Execute PreCompact hooks.
 * Delegates to `features/hooks/triggers.ts` implementation.
 */
export const executePreCompactHooks: (
  params: { trigger: 'auto' | 'manual'; customInstructions: string | null },
  signal?: AbortSignal
) => Promise<PreCompactHookResult> = executePreCompactHooksTrigger as any;

/**
 * Execute plugin hooks (SessionStart) for the given source.
 * Delegates to `features/hooks/triggers.ts` WU-equivalent.
 */
export const executePluginHooksForEvent: (event: string) => Promise<unknown[]> =
  (async (event: string) => executePluginHooksForEventTrigger(event)) as any;

// ============================================
// Summary Generation Helpers
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
): Message | null {
  if (msg.type === 'user') {
    const userMsg = msg as { message?: { content?: unknown } };
    const content = userMsg.message?.content;
    return {
      role: 'user',
      content: typeof content === 'string' || Array.isArray(content) ? (content as any) : '',
    };
  }
  if (msg.type === 'assistant') {
    const assistantMsg = msg as { message?: { content?: unknown } };
    const content = assistantMsg.message?.content;
    return {
      role: 'assistant',
      content: Array.isArray(content) ? (content as any) : [],
    };
  }
  return null;
}

/**
 * Calculate exponential backoff.
 * Original: fSA() in chunks.85.mjs
 */
function calculateBackoff(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
}

// ============================================
// Summary Generation Implementation
// ============================================

/**
 * Generate conversation summary via LLM.
 * Original: H97() in chunks.132.mjs:590-652
 *
 * Streams the summary generation request to the LLM and collects the response.
 * Includes retry logic and specific tool setup.
 */
export async function generateConversationSummary(params: {
  messages: ConversationMessage[];
  summaryRequest: ConversationMessage;
  appState: any;
  context: CompactSessionContext;
  preCompactTokenCount?: number;
}): Promise<ConversationMessage> {
  const { messages, summaryRequest, appState, context, preCompactTokenCount } = params;

  // Check if streaming retry is enabled via feature flag (source: tengu_compact_streaming_retry)
  // We use the constant from COMPACT_CONSTANTS.
  const maxAttempts = COMPACT_CONSTANTS.MAX_SUMMARY_RETRIES; // K97 = 2

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let hasStartedStreaming = false;
    let assistantResponse: ConversationMessage | undefined;

    context.setResponseLength?.(() => 0);

    // Convert conversation messages to API format
    const apiMessages: Message[] = [];
    for (const msg of messages) {
      const converted = convertToApiMessage(msg);
      if (converted) apiMessages.push(converted);
    }
    const summaryRequestConverted = convertToApiMessage(summaryRequest);
    if (summaryRequestConverted) apiMessages.push(summaryRequestConverted);

    const model = context.options.mainLoopModel || 'claude-sonnet-4-20250514';

    try {
      // Build and stream the API call
      // Original includes Read tool + MCP tools
      const stream = streamApiCall({
        messages: apiMessages as any[],
        systemPrompt: 'You are a helpful AI assistant tasked with summarizing conversations.',
        tools: appState.mcp?.tools || [], // Wi([v5, ...B.mcp.tools], "name") in source
        signal: context.abortController?.signal,
        options: {
          model,
          maxOutputTokensOverride: COMPACT_CONSTANTS.MAX_COMPACT_OUTPUT_TOKENS, // nU1
          querySource: 'compact', // Mark as compaction request
          isNonInteractiveSession: context.options.isNonInteractiveSession,
          hasAppendSystemPrompt: !!context.options.appendSystemPrompt,
          agents: context.options.agentDefinitions?.activeAgents || [],
        } as any,
      });

      let responseText = '';
      let responseUsage: CompactUsageStats = { input_tokens: 0, output_tokens: 0 };

      for await (const chunk of stream) {
        const c = chunk as StreamingQueryResult;

        // Detect when streaming starts
        if (!hasStartedStreaming && c.type === 'stream_event' && (c as any).event?.type === 'content_block_start') {
          hasStartedStreaming = true;
          context.setStreamMode?.('responding');
        }

        // Track response length for UI
        if (c.type === 'stream_event' && (c as any).event?.type === 'content_block_delta') {
          const delta = (c as any).event.delta;
          if (delta?.type === 'text_delta') {
            responseText += delta.text;
            context.setResponseLength?.((current) => current + delta.text.length);
          }
        }

        // Capture final assistant response
        if (c.type === 'assistant') {
          assistantResponse = c as unknown as ConversationMessage;
          responseUsage = {
            input_tokens: c.message.usage?.input_tokens ?? 0,
            output_tokens: c.message.usage?.output_tokens ?? 0,
            cache_read_input_tokens: c.message.usage?.cache_read_input_tokens,
            cache_creation_input_tokens: c.message.usage?.cache_creation_input_tokens,
          };
        }
      }

      if (assistantResponse) {
        return assistantResponse;
      }

      // If we got here without a response, it might be a silent failure or interruption
      throw new Error('No assistant response received');
    } catch (error) {
      if (context.abortController?.signal.aborted) {
        throw new CompactError(CompactErrorCode.COMPACTION_INTERRUPTED, COMPACTION_INTERRUPTED_ERROR);
      }

      if (attempt < maxAttempts) {
        analyticsEvent('tengu_compact_streaming_retry', {
          attempt,
          preCompactTokenCount,
          hasStartedStreaming,
        });
        await sleep(calculateBackoff(attempt), context.abortController?.signal);
        continue;
      }

      // All retries exhausted
      analyticsEvent('tengu_compact_failed', {
        reason: 'no_streaming_response',
        preCompactTokenCount,
        hasStartedStreaming,
        attempts: attempt,
      });
      throw new CompactError(CompactErrorCode.COMPACTION_INTERRUPTED, COMPACTION_INTERRUPTED_ERROR);
    }
  }

  throw new CompactError(CompactErrorCode.COMPACTION_INTERRUPTED, COMPACTION_INTERRUPTED_ERROR);
}

// ============================================
// Full Compact Implementation
// ============================================

/**
 * Perform full LLM-based compaction.
 * Original: cF1() in chunks.132.mjs:489-579
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

    // Get app state and validate permissions
    const appState = (await context.getAppState()) as any;
    // Source: q71(I.toolPermissionContext, "summary") - validation

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
      analyticsEvent('tengu_compact_failed', { reason: 'no_summary', preCompactTokenCount });
      throw new CompactError(CompactErrorCode.SUMMARY_FAILED, SUMMARY_FAILED_ERROR);
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

    // PHASE 8: Log telemetry
    analyticsEvent('tengu_compact', {
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: usageStats?.input_tokens,
      compactionOutputTokens: usageStats?.output_tokens,
      compactionCacheReadTokens: usageStats?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: usageStats?.cache_creation_input_tokens ?? 0,
    });

    // Create boundary marker and format summary
    const boundaryMarker = createBoundaryMarker(isAuto ? 'auto' : 'manual', preCompactTokenCount);
    const transcriptPath = generateConversationId(context.agentId);

    const summaryMessages: ConversationMessage[] = [
      createUserMessage({
        content: formatSummaryContent(summaryText, preserveHistory, transcriptPath),
        isCompactSummary: true,
        isVisibleInTranscriptOnly: true,
      }) as any,
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
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);

    throw error;
  } finally {
    // Final UI reset
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);
  }
}


// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
