/**
 * @claudecode/core - Streaming Tool Executor
 *
 * Parallel tool execution during API streaming.
 * Reconstructed from chunks.133.mjs:2911-3087
 */

import { createUserMessage } from '../message/factory.js';
import type { ContentBlock } from '@claudecode/shared';
import type { ConversationMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext } from '../tools/types.js';
import { executeSingleTool } from '../tools/execution.js';
import type {
  TrackedToolExecution,
  ToolExecutionResult,
  ToolUseBlock,
  CanUseTool,
} from './types.js';

// Original: v4A in chunks.148.mjs:623
const USER_REJECTED_MESSAGE = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.";

// Original: aVA in chunks.148.mjs:621
const CANCELLED_BY_USER_MESSAGE = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed.";

// ============================================
// Streaming Tool Executor
// ============================================

/**
 * Streaming tool executor for parallel tool execution.
 * Original: _H1 class in chunks.133.mjs:2911-3087
 * Also known as: ToolUseQueueManager
 *
 * Enables parallel execution of concurrency-safe tools while
 * streaming API responses, significantly improving responsiveness.
 */
export class StreamingToolExecutor {
  private toolDefinitions: ToolDefinition[];
  private canUseTool: CanUseTool;
  private tools: TrackedToolExecution[] = [];
  private toolUseContext: ToolUseContext;
  private hasErrored = false; // Original: hasErrored in chunks.133.mjs:2916
  private discarded = false;  // Original: discarded in chunks.133.mjs:2917
  private progressAvailableResolve?: () => void;

  constructor(
    toolDefinitions: ToolDefinition[],
    canUseTool: CanUseTool,
    toolUseContext: ToolUseContext
  ) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext;
  }

  /**
   * Discard all pending tool executions.
   * Called on streaming fallback.
   * Original: discard method in chunks.133.mjs:2924-2926
   */
  discard(): void {
    this.discarded = true;
  }

  /**
   * Add a tool for execution.
   * Called for each tool_use block as it streams in.
   * Original: addTool method in chunks.133.mjs:2927-2960
   *
   * @param toolUseBlock - Tool use block from assistant message
   * @param assistantMessage - The assistant message containing this tool use
   */
  addTool(toolUseBlock: ToolUseBlock, assistantMessage: ConversationMessage): void {
    // Find tool definition
    const toolDef = this.toolDefinitions.find((t) => t.name === toolUseBlock.name);

    // Unknown tool - create error result immediately (Original: chunks.133.mjs:2929-2949)
    if (!toolDef) {
      this.tools.push({
        id: toolUseBlock.id,
        block: toolUseBlock,
        assistantMessage,
        status: 'completed',
        isConcurrencySafe: true,
        pendingProgress: [],
        results: [
          createUserMessage({
            content: [
              {
                type: 'tool_result',
                content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
                is_error: true,
                tool_use_id: toolUseBlock.id,
              } as ContentBlock,
            ],
            toolUseResult: `Error: No such tool available: ${toolUseBlock.name}`,
            sourceToolAssistantUUID: assistantMessage.uuid,
          }),
        ],
      });
      return;
    }

    // Validate input and determine concurrency safety (Original: safeParse in chunks.133.mjs:2950-2951)
    const parsed = toolDef.inputSchema?.safeParse(toolUseBlock.input);
    const isConcurrencySafe = parsed?.success ? toolDef.isConcurrencySafe(parsed.data) : false;

    // Queue the tool (Original: chunks.133.mjs:2952-2959)
    this.tools.push({
      id: toolUseBlock.id,
      block: toolUseBlock,
      assistantMessage,
      status: 'queued',
      isConcurrencySafe,
      pendingProgress: [],
    });

    // Trigger queue processing
    this.processQueue();
  }

  /**
   * Determine if a tool can be executed now.
   * Original: canExecuteTool method in chunks.133.mjs:2961-3004
   *
   * @param isConcurrencySafe - Whether the new tool is concurrency-safe
   * @returns Whether execution can proceed
   */
  canExecuteTool(isConcurrencySafe: boolean): boolean {
    const executing = this.tools.filter((t) => t.status === 'executing');

    // Can execute if:
    // 1. Nothing is currently executing, OR
    // 2. New tool is concurrency-safe AND all executing tools are concurrency-safe
    // Original: Q.length === 0 || A && Q.every((B) => B.isConcurrencySafe)
    return (
      executing.length === 0 ||
      (!!isConcurrencySafe && executing.every((t) => t.isConcurrencySafe))
    );
  }

  /**
   * Process queued tools.
   * Original: processQueue method in chunks.133.mjs:2965-2971
   */
  private async processQueue(): Promise<void> {
    for (const tool of this.tools) {
      if (tool.status !== 'queued') continue;

      if (this.canExecuteTool(tool.isConcurrencySafe)) {
        // Start execution
        await this.executeTool(tool);
      } else if (!tool.isConcurrencySafe) {
        // Non-concurrent tool blocks further processing
        break;
      }
    }
  }

  /**
   * Create synthetic error message for aborted tool.
   * Original: createSyntheticErrorMessage method in chunks.133.mjs:2972-3003
   */
  private createSyntheticErrorMessage(
    toolUseId: string,
    abortReason: string,
    assistantMessage: ConversationMessage
  ): ConversationMessage {
    if (abortReason === 'user_interrupted') {
      return createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: USER_REJECTED_MESSAGE,
            is_error: true,
            tool_use_id: toolUseId,
          } as ContentBlock,
        ],
        toolUseResult: 'User rejected tool use',
        sourceToolAssistantUUID: assistantMessage.uuid,
      });
    }

    if (abortReason === 'streaming_fallback') {
      return createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: '<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>',
            is_error: true,
            tool_use_id: toolUseId,
          } as ContentBlock,
        ],
        toolUseResult: 'Streaming fallback - tool execution discarded',
        sourceToolAssistantUUID: assistantMessage.uuid,
      });
    }

    return createUserMessage({
      content: [
        {
          type: 'tool_result',
          content: '<tool_use_error>Sibling tool call errored</tool_use_error>',
          is_error: true,
          tool_use_id: toolUseId,
        } as ContentBlock,
      ],
      toolUseResult: 'Sibling tool call errored',
      sourceToolAssistantUUID: assistantMessage.uuid,
    });
  }

  /**
   * Get abort reason if execution should stop.
   * Original: getAbortReason method in chunks.133.mjs:3004-3009
   */
  private getAbortReason(): string | null {
    if (this.discarded) {
      return 'streaming_fallback';
    }
    if (this.hasErrored) {
      return 'sibling_error';
    }
    if (this.toolUseContext.abortController?.signal.aborted) {
      return 'user_interrupted';
    }
    return null;
  }

  /**
   * Execute a single tool.
   * Original: executeTool method in chunks.133.mjs:3010-3040
   */
  private async executeTool(tool: TrackedToolExecution): Promise<void> {
    tool.status = 'executing';

    // Track in-progress tool use IDs (Original: chunks.133.mjs:3011)
    if (this.toolUseContext.setInProgressToolUseIDs) {
      this.toolUseContext.setInProgressToolUseIDs((ids) =>
        new Set([...ids, tool.id])
      );
    }

    const results: ConversationMessage[] = [];
    const contextModifiers: Array<(ctx: ToolUseContext) => ToolUseContext> = [];

    const execution = (async () => {
      // Abort before starting
      const abortReason = this.getAbortReason();
      if (abortReason) {
        results.push(this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage));
        tool.results = results;
        tool.contextModifiers = contextModifiers;
        tool.status = 'completed';
        return;
      }

      // Execute via the unified tool execution generator (Original: jH1 in chunks.134.mjs:660)
      const generator = executeSingleTool(
        tool.block,
        tool.assistantMessage,
        this.canUseTool as any,
        this.toolUseContext
      );

      let hasReceivedError = false;

      for await (const item of generator) {
        const duringAbort = this.getAbortReason();
        if (duringAbort && !hasReceivedError) {
          results.push(this.createSyntheticErrorMessage(tool.id, duringAbort, tool.assistantMessage));
          break;
        }

        // Error detection logic (Original: chunks.133.mjs:3028)
        if (
          item.message?.type === 'user' &&
          Array.isArray((item.message as any).message?.content) &&
          (item.message as any).message.content.some(
            (b: any) => b.type === 'tool_result' && b.is_error === true
          )
        ) {
          this.hasErrored = true;
          hasReceivedError = true;
        }

        const msg = item.message as ConversationMessage | undefined;
        if (msg) {
          if (msg.type === 'progress') {
            tool.pendingProgress.push(msg);
            if (this.progressAvailableResolve) {
              this.progressAvailableResolve();
              this.progressAvailableResolve = undefined;
            }
          } else {
            results.push(msg);
          }
        }

        if (item.contextModifier) {
          contextModifiers.push(item.contextModifier.modifyContext);
        }
      }

      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = 'completed';

      // Apply context modifiers immediately for non-concurrent tools (Original: chunks.133.mjs:3035-3036)
      if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
        for (const modifier of contextModifiers) {
          this.toolUseContext = modifier(this.toolUseContext);
        }
      }
    })();

    tool.promise = execution;

    // Chain to process next queued tool when this completes (Original: chunks.133.mjs:3038-3040)
    execution.finally(() => {
      this.processQueue();
    });
  }

  /**
   * Get completed results (non-blocking).
   * Yields results that are ready without waiting.
   * Original: getCompletedResults generator in chunks.133.mjs:3041-3056
   */
  *getCompletedResults(): Generator<ToolExecutionResult> {
    if (this.discarded) return;

    for (const tool of this.tools) {
      // Yield any pending progress first
      while (tool.pendingProgress.length > 0) {
        yield { message: tool.pendingProgress.shift()! };
      }

      if (tool.status === 'yielded') continue;

      if (tool.status === 'completed' && tool.results) {
        tool.status = 'yielded';
        for (const result of tool.results) {
          yield { message: result };
        }

        // Remove from in-progress set (Original: C77 in chunks.133.mjs:3053)
        removeFromInProgressToolUseIDs(this.toolUseContext, tool.id);
      } else if (tool.status === 'executing' && !tool.isConcurrencySafe) {
        // Non-concurrent tool blocks further yielding
        break;
      }
    }
  }

  /**
   * Check if there are pending progress messages.
   * Original: hasPendingProgress in chunks.133.mjs:3057-3059
   */
  private hasPendingProgress(): boolean {
    return this.tools.some((t) => t.pendingProgress.length > 0);
  }

  /**
   * Get all remaining results (blocking).
   * Waits for all tools to complete and yields their results.
   * Original: getRemainingResults async generator in chunks.133.mjs:3060-3074
   */
  async *getRemainingResults(): AsyncGenerator<ToolExecutionResult> {
    if (this.discarded) return;

    while (this.hasUnfinishedTools()) {
      await this.processQueue();

      for (const result of this.getCompletedResults()) {
        yield result;
      }

      // Wait for executing tools if no results available (Original: chunks.133.mjs:3065-3071)
      if (
        this.hasExecutingTools() &&
        !this.hasCompletedResults() &&
        !this.hasPendingProgress()
      ) {
        const promises = this.tools
          .filter((t) => t.status === 'executing' && t.promise)
          .map((t) => t.promise!);

        const progressPromise = new Promise<void>((resolve) => {
          this.progressAvailableResolve = resolve;
        });

        if (promises.length > 0) {
          await Promise.race([...promises, progressPromise]);
        }
      }
    }

    // Final yield of any remaining results
    for (const result of this.getCompletedResults()) {
      yield result;
    }
  }

  /**
   * Check if there are completed results.
   * Original: hasCompletedResults in chunks.133.mjs:3075-3077
   */
  private hasCompletedResults(): boolean {
    return this.tools.some((t) => t.status === 'completed');
  }

  /**
   * Check if there are executing tools.
   * Original: hasExecutingTools in chunks.133.mjs:3078-3080
   */
  private hasExecutingTools(): boolean {
    return this.tools.some((t) => t.status === 'executing');
  }

  /**
   * Check if there are unfinished tools.
   * Original: hasUnfinishedTools in chunks.133.mjs:3081-3083
   */
  private hasUnfinishedTools(): boolean {
    return this.tools.some((t) => t.status !== 'yielded');
  }

  /**
   * Get updated context after tool execution.
   * Original: getUpdatedContext in chunks.133.mjs:3084-3086
   */
  getUpdatedContext(): ToolUseContext {
    return this.toolUseContext;
  }
}

/**
 * Remove a tool use ID from the in-progress set.
 * Original: C77 function in chunks.133.mjs:3089-3091
 */
function removeFromInProgressToolUseIDs(context: ToolUseContext, toolUseId: string): void {
  if (context.setInProgressToolUseIDs) {
    context.setInProgressToolUseIDs((ids) => {
      return new Set([...ids].filter((id) => id !== toolUseId));
    });
  }
}
