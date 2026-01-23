/**
 * @claudecode/features - Full Compact
 *
 * LLM-based full conversation compaction.
 * Original: cF1 in chunks.132.mjs:489-670
 */

import { sleep } from '@claudecode/shared';
import {
  createUserMessage,
  streamApiCall,
  type ConversationMessage,
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
  createBoundaryMarker,
  generateConversationId,
  formatSummaryContent,
  restoreRecentFilesAfterCompact,
  createTaskStatusAttachments,
  createTodoAttachment,
  createPlanFileReferenceAttachment,
  createInvokedSkillsAttachment,
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
// Hook Integration
// ============================================

/**
 * Execute PreCompact hooks.
 */
export const executePreCompactHooks: (
  params: { trigger: 'auto' | 'manual'; customInstructions: string | null },
  signal?: AbortSignal
) => Promise<PreCompactHookResult> = executePreCompactHooksTrigger as any;

/**
 * Execute plugin hooks.
 */
export const executePluginHooksForEvent: (event: string) => Promise<unknown[]> =
  (async (event: string) => executePluginHooksForEventTrigger(event)) as any;

// ============================================
// Token Accounting (er2 / As2)
// ============================================

interface MessageAccounting {
  toolRequests: Map<string, number>;
  toolResults: Map<string, number>;
  humanMessages: number;
  assistantMessages: number;
  localCommandOutputs: number;
  other: number;
  attachments: Map<string, number>;
  duplicateFileReads: Map<string, { count: number; tokens: number }>;
  total: number;
}

/**
 * Build message accounting for telemetry.
 * Original: er2 in chunks.132.mjs:351
 */
function buildMessageAccounting(messages: ConversationMessage[]): MessageAccounting {
  const stats: MessageAccounting = {
    toolRequests: new Map(),
    toolResults: new Map(),
    humanMessages: 0,
    assistantMessages: 0,
    localCommandOutputs: 0,
    other: 0,
    attachments: new Map(),
    duplicateFileReads: new Map(),
    total: 0,
  };

  const toolNameMap = new Map<string, string>();
  const filePathMap = new Map<string, string>();
  const dupTracker = new Map<string, { count: number; totalTokens: number }>();

  messages.forEach(msg => {
    if (msg.type === 'attachment') {
      const type = (msg as any).attachment?.type || 'unknown';
      stats.attachments.set(type, (stats.attachments.get(type) || 0) + 1);
    }
  });

  // Simplified normalization check - source uses FI(A)
  messages.forEach(msg => {
    if (msg.type !== 'user' && msg.type !== 'assistant') return;
    
    const content = msg.message?.content;
    if (typeof content === 'string') {
      const tokens = estimateMessageTokens([msg]);
      stats.total += tokens;
      if (msg.type === 'user' && content.includes('local-command-stdout')) {
        stats.localCommandOutputs += tokens;
      } else if (msg.type === 'user') {
        stats.humanMessages += tokens;
      } else {
        stats.assistantMessages += tokens;
      }
    } else if (Array.isArray(content)) {
      content.forEach(block => {
        // Equivalent to X97(I, J, Q, B, G, Z) in source
        const blockTokens = estimateMessageTokens([{ ...msg, message: { ...msg.message, content: [block] } }]);
        stats.total += blockTokens;

        switch (block.type) {
          case 'text':
            if (msg.type === 'user' && block.text?.includes('local-command-stdout')) {
              stats.localCommandOutputs += blockTokens;
            } else if (msg.type === 'user') {
              stats.humanMessages += blockTokens;
            } else {
              stats.assistantMessages += blockTokens;
            }
            break;
          case 'tool_use':
            if (block.name && block.id) {
              const name = block.name;
              stats.toolRequests.set(name, (stats.toolRequests.get(name) || 0) + blockTokens);
              toolNameMap.set(block.id, name);
              if (name === 'Read' && block.input?.file_path) {
                filePathMap.set(block.id, String(block.input.file_path));
              }
            }
            break;
          case 'tool_result':
            if (block.tool_use_id) {
              const name = toolNameMap.get(block.tool_use_id) || 'unknown';
              stats.toolResults.set(name, (stats.toolResults.get(name) || 0) + blockTokens);
              if (name === 'Read') {
                const path = filePathMap.get(block.tool_use_id);
                if (path) {
                  const d = dupTracker.get(path) || { count: 0, totalTokens: 0 };
                  dupTracker.set(path, { count: d.count + 1, totalTokens: d.totalTokens + blockTokens });
                }
              }
            }
            break;
          default:
            stats.other += blockTokens;
            break;
        }
      });
    }
  });

  dupTracker.forEach((val, path) => {
    if (val.count > 1) {
      const saved = Math.floor(val.totalTokens / val.count) * (val.count - 1);
      stats.duplicateFileReads.set(path, { count: val.count, tokens: saved });
    }
  });

  return stats;
}

/**
 * Build accounting metrics for telemetry.
 * Original: As2 in chunks.132.mjs:450
 */
function buildAccountingMetrics(stats: MessageAccounting): Record<string, any> {
  const metrics: Record<string, any> = {
    total_tokens: stats.total,
    human_message_tokens: stats.humanMessages,
    assistant_message_tokens: stats.assistantMessages,
    local_command_output_tokens: stats.localCommandOutputs,
    other_tokens: stats.other,
  };

  stats.attachments.forEach((count, type) => {
    metrics[`attachment_${type}_count`] = count;
  });
  stats.toolRequests.forEach((tokens, name) => {
    metrics[`tool_request_${name}_tokens`] = tokens;
  });
  stats.toolResults.forEach((tokens, name) => {
    metrics[`tool_result_${name}_tokens`] = tokens;
  });

  const dupTokens = [...stats.duplicateFileReads.values()].reduce((acc, v) => acc + v.tokens, 0);
  metrics.duplicate_read_tokens = dupTokens;
  metrics.duplicate_read_file_count = stats.duplicateFileReads.size;

  if (stats.total > 0) {
    metrics.human_message_percent = Math.round(stats.humanMessages / stats.total * 100);
    metrics.assistant_message_percent = Math.round(stats.assistantMessages / stats.total * 100);
    metrics.local_command_output_percent = Math.round(stats.localCommandOutputs / stats.total * 100);
    metrics.duplicate_read_percent = Math.round(dupTokens / stats.total * 100);
    
    const totalReqTokens = [...stats.toolRequests.values()].reduce((a, b) => a + b, 0);
    const totalResTokens = [...stats.toolResults.values()].reduce((a, b) => a + b, 0);
    metrics.tool_request_percent = Math.round(totalReqTokens / stats.total * 100);
    metrics.tool_result_percent = Math.round(totalResTokens / stats.total * 100);

    stats.toolRequests.forEach((val, name) => {
      metrics[`tool_request_${name}_percent`] = Math.round(val / stats.total * 100);
    });
    stats.toolResults.forEach((val, name) => {
      metrics[`tool_result_${name}_percent`] = Math.round(val / stats.total * 100);
    });
  }

  return metrics;
}

// ============================================
// Summary Generation Helpers
// ============================================

/**
 * Build compact instructions prompt.
 * Original: xZ0 in chunks.85.mjs:965
 */
export function buildCompactInstructions(customInstructions?: string): string {
  const template = (instr?: string) => `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Description of solved problems and ongoing troubleshooting
6. All user messages: Detailed non tool use user message
7. Pending Tasks: List all pending tasks
8. Current Work: Precise description of current work
9. Optional Next Step: Optional Next step to take
${instr ? `\nAdditional instructions:\n${instr}\n` : ''}
Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response.`;

  return template(customInstructions);
}

/**
 * Extract text content from assistant message.
 * Original: Xt in chunks.132.mjs
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
 * Original: Jd in chunks.85.mjs:876
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
 * Original: fSA in chunks.85.mjs
 */
function calculateBackoff(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
}

/**
 * Get total tokens from usage.
 * Original: uSA in chunks.85.mjs:881
 */
function getTotalUsageTokens(usage: CompactUsageStats): number {
  return usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + usage.output_tokens;
}

/**
 * Get last assistant token count.
 * Original: HKA in chunks.85.mjs:948
 */
function getLastAssistantTokenCount(messages: ConversationMessage[]): number {
  let i = messages.length - 1;
  while (i >= 0) {
    const msg = messages[i];
    const usage = extractUsageStats(msg!);
    if (usage) {
      // In source: return uSA(G) + TZ0(A.slice(Q + 1))
      return getTotalUsageTokens(usage) + estimateMessageTokens(messages.slice(i + 1));
    }
    i--;
  }
  return estimateMessageTokens(messages);
}

// ============================================
// Summary Generation Implementation
// ============================================

/**
 * Generate conversation summary via LLM.
 * Original: H97 in chunks.132.mjs:590-652
 */
export async function generateConversationSummary(params: {
  messages: ConversationMessage[];
  summaryRequest: ConversationMessage;
  appState: any;
  context: CompactSessionContext;
  preCompactTokenCount?: number;
}): Promise<ConversationMessage> {
  const { messages, summaryRequest, appState, context, preCompactTokenCount } = params;

  const maxAttempts = COMPACT_CONSTANTS.MAX_SUMMARY_RETRIES; // K97 = 2

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let hasStartedStreaming = false;
    let assistantResponse: ConversationMessage | undefined;

    context.setResponseLength?.(() => 0);

    const apiMessages: Message[] = [];
    for (const msg of messages) {
      const converted = convertToApiMessage(msg);
      if (converted) apiMessages.push(converted);
    }
    const summaryRequestConverted = convertToApiMessage(summaryRequest);
    if (summaryRequestConverted) apiMessages.push(summaryRequestConverted);

    const model = context.options.mainLoopModel || 'claude-3-5-sonnet-20241022';

    try {
      const stream = streamApiCall({
        messages: apiMessages as any[],
        systemPrompt: 'You are a helpful AI assistant tasked with summarizing conversations.',
        tools: appState.mcp?.tools || [],
        signal: context.abortController?.signal,
        options: {
          model,
          maxOutputTokensOverride: COMPACT_CONSTANTS.MAX_COMPACT_OUTPUT_TOKENS,
          querySource: 'compact',
          isNonInteractiveSession: context.options.isNonInteractiveSession,
          hasAppendSystemPrompt: !!context.options.appendSystemPrompt,
          agents: context.options.agentDefinitions?.activeAgents || [],
        } as any,
      });

      for await (const chunk of stream) {
        const c = chunk as StreamingQueryResult;

        if (!hasStartedStreaming && c.type === 'stream_event' && (c as any).event?.type === 'content_block_start') {
          hasStartedStreaming = true;
          context.setStreamMode?.('responding');
        }

        if (c.type === 'stream_event' && (c as any).event?.type === 'content_block_delta') {
          const delta = (c as any).event.delta;
          if (delta?.type === 'text_delta') {
            context.setResponseLength?.((current) => current + delta.text.length);
          }
        }

        if (c.type === 'assistant') {
          assistantResponse = c as unknown as ConversationMessage;
        }
      }

      if (assistantResponse) {
        return assistantResponse;
      }

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
        await sleep(calculateBackoff(attempt));
        continue;
      }

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
 * Original: cF1 in chunks.132.mjs:489-579
 */
export async function fullCompact(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  preserveHistory: boolean = true,
  customInstructions?: string,
  isAuto: boolean = false
): Promise<FullCompactResult> {
  try {
    if (messages.length === 0) {
      throw new CompactError(CompactErrorCode.NOT_ENOUGH_MESSAGES, NOT_ENOUGH_MESSAGES_ERROR);
    }

    const preCompactTokenCount = getLastAssistantTokenCount(messages);
    const accounting = buildMessageAccounting(messages);
    const metrics = buildAccountingMetrics(accounting);

    const appState = (await context.getAppState()) as any;
    
    // UI states
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

    let finalInstructions = customInstructions;
    if (hookResults.newCustomInstructions) {
      finalInstructions = finalInstructions
        ? `${finalInstructions}\n\n${hookResults.newCustomInstructions}`
        : hookResults.newCustomInstructions;
    }
    const userDisplayMessage = hookResults.userDisplayMessage;

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
    
    const [restoredFiles, taskStatuses, todoAttachment, planAttachment] = await Promise.all([
      restoreRecentFilesAfterCompact(previousReadState, context),
      createTaskStatusAttachments(context),
      createTodoAttachment(context, context.agentId),
      createPlanFileReferenceAttachment(context.agentId),
    ]);

    const attachments: any[] = [...restoredFiles, ...taskStatuses];
    if (todoAttachment) attachments.push(todoAttachment);
    if (planAttachment) attachments.push(planAttachment);
    const skillsAttachment = createInvokedSkillsAttachment();
    if (skillsAttachment) attachments.push(skillsAttachment);

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
      ...metrics
    });

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
    throw error;
  } finally {
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);
  }
}

