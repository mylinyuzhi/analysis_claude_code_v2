/**
 * @claudecode/core - Streaming Tool Executor
 *
 * Parallel tool execution during API streaming.
 * Reconstructed from chunks.133.mjs:2911-3087
 */

import { createUserMessage } from '../message/factory.js';
import type { ConversationMessage, ContentBlock } from '../message/types.js';
import type { ToolDefinition, ToolUseContext } from '../tools/types.js';
import type {
  TrackedToolExecution,
  ToolExecutionResult,
  ToolUseBlock,
  CanUseTool,
} from './types.js';

// ============================================
// Streaming Tool Executor
// ============================================

/**
 * Streaming tool executor for parallel tool execution.
 * Original: _H1 class in chunks.133.mjs:2911-3087
 *
 * Enables parallel execution of concurrency-safe tools while
 * streaming API responses, significantly improving responsiveness.
 */
export class StreamingToolExecutor {
  private toolDefinitions: ToolDefinition[];
  private canUseTool: CanUseTool;
  private tools: TrackedToolExecution[] = [];
  private toolUseContext: ToolUseContext;
  private hasErrored = false;
  private discarded = false;
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
   * Add a tool for execution.
   * Called for each tool_use block as it streams in.
   * Original: addTool method
   *
   * @param toolUseBlock - Tool use block from assistant message
   * @param assistantMessage - The assistant message containing this tool use
   */
  addTool(toolUseBlock: ToolUseBlock, assistantMessage: ConversationMessage): void {
    if (this.discarded) return;

    // Find tool definition
    const toolDef = this.toolDefinitions.find((t) => t.name === toolUseBlock.name);

    // Unknown tool - create error result immediately
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
          }),
        ],
      });
      return;
    }

    // Validate input and determine concurrency safety
    let isConcurrencySafe = false;
    if (toolDef.inputSchema) {
      const parsed = toolDef.inputSchema.safeParse(toolUseBlock.input);
      if (parsed?.success && toolDef.isConcurrencySafe) {
        isConcurrencySafe = toolDef.isConcurrencySafe(parsed.data);
      }
    }

    // Queue the tool
    this.tools.push({
      id: toolUseBlock.id,
      block: toolUseBlock,
      assistantMessage,
      status: 'queued',
      isConcurrencySafe,
      pendingProgress: [],
    });

    // Trigger queue processing (may start execution immediately)
    this.processQueue();
  }

  /**
   * Determine if a tool can be executed now.
   *
   * @param isConcurrencySafe - Whether the new tool is concurrency-safe
   * @returns Whether execution can proceed
   */
  private canExecuteTool(isConcurrencySafe: boolean): boolean {
    const executing = this.tools.filter((t) => t.status === 'executing');

    // Can execute if:
    // 1. Nothing is currently executing, OR
    // 2. New tool is concurrency-safe AND all executing tools are concurrency-safe
    return (
      executing.length === 0 ||
      (isConcurrencySafe && executing.every((t) => t.isConcurrencySafe))
    );
  }

  /**
   * Process queued tools.
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
   * Get abort reason if execution should stop.
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
   * Create synthetic error message for aborted tool.
   */
  private createSyntheticErrorMessage(
    toolUseId: string,
    abortReason: string,
    assistantMessage: ConversationMessage
  ): ConversationMessage {
    let errorContent: string;

    switch (abortReason) {
      case 'streaming_fallback':
        errorContent = 'Tool execution was cancelled due to streaming fallback.';
        break;
      case 'sibling_error':
        errorContent =
          'Tool execution was skipped because a previous tool returned an error.';
        break;
      case 'user_interrupted':
        errorContent = 'Tool execution was cancelled by user.';
        break;
      default:
        errorContent = `Tool execution was cancelled: ${abortReason}`;
    }

    return createUserMessage({
      content: [
        {
          type: 'tool_result',
          content: `<tool_use_error>${errorContent}</tool_use_error>`,
          is_error: true,
          tool_use_id: toolUseId,
        } as ContentBlock,
      ],
    });
  }

  /**
   * Execute a single tool.
   */
  private async executeTool(tool: TrackedToolExecution): Promise<void> {
    tool.status = 'executing';

    // Track in-progress tool use IDs
    if (this.toolUseContext.setInProgressToolUseIDs) {
      this.toolUseContext.setInProgressToolUseIDs((ids) =>
        new Set([...ids, tool.id])
      );
    }

    const results: ConversationMessage[] = [];
    const contextModifiers: Array<(ctx: ToolUseContext) => ToolUseContext> = [];

    const execution = (async () => {
      // Check for abort conditions
      const abortReason = this.getAbortReason();
      if (abortReason) {
        results.push(
          this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage)
        );
        tool.results = results;
        tool.status = 'completed';
        return;
      }

      // Find tool definition
      const toolDef = this.toolDefinitions.find((t) => t.name === tool.block.name);
      if (!toolDef) {
        results.push(
          this.createSyntheticErrorMessage(
            tool.id,
            'unknown_tool',
            tool.assistantMessage
          )
        );
        tool.results = results;
        tool.status = 'completed';
        return;
      }

      // Check permission
      const hasPermission = await this.canUseTool(
        toolDef,
        tool.block.input,
        tool.assistantMessage
      );

      if (!hasPermission) {
        results.push(
          createUserMessage({
            content: [
              {
                type: 'tool_result',
                content: '<tool_use_error>User rejected tool use</tool_use_error>',
                is_error: true,
                tool_use_id: tool.id,
              } as ContentBlock,
            ],
          })
        );
        tool.results = results;
        tool.status = 'completed';
        return;
      }

      // Execute the tool
      try {
        const result = await toolDef.call(
          tool.block.input,
          this.toolUseContext,
          this.canUseTool,
          tool.assistantMessage,
          (progress) => {
            // Handle progress
            if (progress) {
              tool.pendingProgress.push(progress);
              if (this.progressAvailableResolve) {
                this.progressAvailableResolve();
                this.progressAvailableResolve = undefined;
              }
            }
          }
        );

        // Create result message
        const resultMessage = createUserMessage({
          content: [
            {
              type: 'tool_result',
              content:
                typeof result === 'string' ? result : JSON.stringify(result),
              tool_use_id: tool.id,
            } as ContentBlock,
          ],
        });

        results.push(resultMessage);
      } catch (error) {
        this.hasErrored = true;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        results.push(
          createUserMessage({
            content: [
              {
                type: 'tool_result',
                content: `<tool_use_error>${errorMessage}</tool_use_error>`,
                is_error: true,
                tool_use_id: tool.id,
              } as ContentBlock,
            ],
          })
        );
      }

      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = 'completed';

      // Apply context modifiers for non-concurrent tools
      if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
        for (const modifier of contextModifiers) {
          this.toolUseContext = modifier(this.toolUseContext);
        }
      }

      // Remove from in-progress set
      if (this.toolUseContext.setInProgressToolUseIDs) {
        this.toolUseContext.setInProgressToolUseIDs((ids) => {
          const newIds = new Set(ids);
          newIds.delete(tool.id);
          return newIds;
        });
      }
    })();

    tool.promise = execution;

    // Chain to process next queued tool when this completes
    execution.finally(() => {
      this.processQueue();
    });
  }

  /**
   * Get completed results (non-blocking).
   * Yields results that are ready without waiting.
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
      } else if (tool.status === 'executing' && !tool.isConcurrencySafe) {
        // Non-concurrent tool blocks further yielding
        break;
      }
    }
  }

  /**
   * Get all remaining results (blocking).
   * Waits for all tools to complete and yields their results.
   */
  async *getRemainingResults(): AsyncGenerator<ToolExecutionResult> {
    if (this.discarded) return;

    while (this.hasUnfinishedTools()) {
      await this.processQueue();

      for (const result of this.getCompletedResults()) {
        yield result;
      }

      // Wait for executing tools if no results available
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
   * Check if there are unfinished tools.
   */
  private hasUnfinishedTools(): boolean {
    return this.tools.some(
      (t) => t.status === 'queued' || t.status === 'executing'
    );
  }

  /**
   * Check if there are executing tools.
   */
  private hasExecutingTools(): boolean {
    return this.tools.some((t) => t.status === 'executing');
  }

  /**
   * Check if there are completed but not yielded results.
   */
  private hasCompletedResults(): boolean {
    return this.tools.some(
      (t) => t.status === 'completed' && t.results && t.results.length > 0
    );
  }

  /**
   * Check if there are pending progress messages.
   */
  private hasPendingProgress(): boolean {
    return this.tools.some((t) => t.pendingProgress.length > 0);
  }

  /**
   * Discard all pending tool executions.
   * Called on streaming fallback.
   */
  discard(): void {
    this.discarded = true;
  }

  /**
   * Get updated context after tool execution.
   */
  getUpdatedContext(): ToolUseContext {
    return this.toolUseContext;
  }
}

// ============================================
// Export
// ============================================

export { StreamingToolExecutor };
