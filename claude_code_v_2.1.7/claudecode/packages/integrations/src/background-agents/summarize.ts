/**
 * @claudecode/integrations - Background Task Summarization
 * 
 * Logic for generating progress summaries and extracting todo lists from background tasks.
 * Reconstructed from chunks.121.mjs:76-108
 */

import { extractXmlTagContent, getTextContent } from '@claudecode/core';

/**
 * Interface for LLM call options used in summarization.
 */
interface SummarizeOptions {
  callLLM: (params: {
    systemPrompt: string[];
    userPrompt: string;
    signal: AbortSignal;
    options: any;
  }) => Promise<any>;
}

/**
 * Extract todo list from task log.
 * Original: Hi5 in chunks.121.mjs:76-84
 */
export function extractTodoList(log: any[]): any[] {
  // Find last assistant message containing TodoWrite tool use
  const lastTodoWrite = log.findLast((entry) => 
    entry.type === 'assistant' && 
    entry.message.content.some((block: any) => block.type === 'tool_use' && block.name === 'TodoWrite')
  );

  if (!lastTodoWrite) return [];

  const toolUseBlock = lastTodoWrite.message.content.find((block: any) => 
    block.type === 'tool_use' && block.name === 'TodoWrite'
  );

  if (!toolUseBlock || !toolUseBlock.input || !toolUseBlock.input.todos) {
    return [];
  }

  return toolUseBlock.input.todos;
}

/**
 * Generate a delta progress summary for new messages.
 * Original: Ei5 in chunks.121.mjs:86-108
 */
export async function generateProgressSummary(
  newMessages: any[], 
  previousSummary: string | null,
  options: SummarizeOptions
): Promise<string | null> {
  try {
    const systemPrompt = [
      "You are given a few messages from a conversation, as well as a summary of the conversation so far. Your task is to summarize the new messages in the conversation based on the summary so far. Aim for 1-2 sentences at most, focusing on the most important details. The summary MUST be in <summary>summary goes here</summary> tags. If there is no new information, return an empty string: <summary></summary>."
    ];

    const userPrompt = `Summary so far: ${previousSummary ?? 'None'}\n\nNew messages: ${JSON.stringify(newMessages)}`;

    const response = await options.callLLM({
      systemPrompt,
      userPrompt,
      signal: new AbortController().signal,
      options: {
        querySource: "background_task_summarize_delta",
        agents: [],
        isNonInteractiveSession: false,
        hasAppendSystemPrompt: false,
        mcpTools: []
      }
    });

    // Extract text content from assistant response
    // Original uses Xt(B) which extracts text from message
    let textContent = '';
    if (response.type === 'assistant' && Array.isArray(response.message.content)) {
      textContent = response.message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');
    }

    if (!textContent) return null;

    // Extract content from <summary> tags
    // Original: Q9(G, "summary")
    return extractXmlTagContent(textContent, 'summary');
  } catch (error) {
    console.error('[Background] Failed to generate progress summary:', error);
    return null;
  }
}
