/**
 * @claudecode/integrations - TaskOutput Tool Utilities
 * 
 * Utilities and Tool definition for retrieving background task output.
 * Reconstructed from chunks.119.mjs and chunks.86.mjs
 */

import { z } from 'zod';
import type { 
  BackgroundTask, 
  BackgroundBashTask, 
  BackgroundAgentTask, 
  RemoteAgentTask,
  TaskOutputResult,
  SetAppState
} from './types.js';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';
import { getTaskOutputContent, formatOutputPath } from './output.js';

// ============================================
// Constants & Tool Metadata
// ============================================

/**
 * TaskOutput tool name.
 * Original: aHA in chunks.119.mjs:1574
 */
export const TASKOUTPUT_TOOL_NAME = 'TaskOutput';

/**
 * KillShell tool name.
 * Original: GK1 in chunks.119.mjs:1427
 */
export const KILLSHELL_TOOL_NAME = 'KillShell';

// ============================================
// Configuration & Limits
// ============================================

/**
 * Get maximum task output length for tool results.
 * Original: np5 in chunks.119.mjs:1576-1580
 */
export function getTaskMaxOutputLength(): number {
  // Original uses Eb0.validate which handles capped status.
  // Here we use a simpler but equivalent logic.
  const envValue = process.env.TASK_MAX_OUTPUT_LENGTH;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      // Logic for capped/effective would go here if needed
      return parsed;
    }
  }
  return 100000; // Default: 100KB
}

// ============================================
// Logic: Truncation & Formatting
// ============================================

/**
 * Truncate task output from the tail and add reference to full file.
 * Original: bbA in chunks.119.mjs:1582-1597
 * 
 * Key insight: Keeps the END of the output (most recent context).
 */
export function truncateTaskOutput(content: string, taskId: string): { content: string; wasTruncated: boolean } {
  const maxLength = getTaskMaxOutputLength();
  
  if (content.length <= maxLength) {
    return { content, wasTruncated: false };
  }

  // Prepend message with full output path (Original: aY(Q))
  const fullOutputPath = formatOutputPath(taskId);
  const truncationHeader = `[Truncated. Full output: ${fullOutputPath}]\n\n`;
  
  const remainingLength = maxLength - truncationHeader.length;
  // Slice from the end (Original: A.slice(-Y))
  const tailContent = content.slice(-remainingLength);
  
  return {
    content: truncationHeader + tailContent,
    wasTruncated: true
  };
}

/**
 * Formats a background task state into the standard tool result object.
 * Original: YK1 in chunks.119.mjs:1605-1632
 */
export function formatTaskOutput(task: BackgroundTask): TaskOutputResult {
  const output = getTaskOutputContent(task.id);
  
  const result: any = {
    task_id: task.id,
    task_type: task.type,
    status: task.status,
    description: task.description,
    output: output
  };

  switch (task.type) {
    case 'local_bash':
      const bashTask = task as BackgroundBashTask;
      result.exitCode = bashTask.result?.code ?? null;
      break;
    case 'local_agent':
      const agentTask = task as BackgroundAgentTask;
      result.prompt = agentTask.prompt;
      result.result = output; // For agents, output IS the result
      result.error = agentTask.error;
      break;
    case 'remote_agent':
      const remoteTask = task as RemoteAgentTask;
      result.prompt = remoteTask.command;
      break;
  }

  return result;
}

// ============================================
// Logic: Polling & Waiting
// ============================================

/**
 * Wait for task completion within timeout using polling.
 * Original: op5 in chunks.119.mjs:1634-1644
 */
export async function waitForTaskCompletion(
  taskId: string, 
  getTasks: () => Promise<Record<string, BackgroundTask>>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<BackgroundTask | null> {
  const start = Date.now();
  
  while (Date.now() - start < timeoutMs) {
    if (signal?.aborted) {
      // Original throws aG (AbortError)
      throw new Error('AbortError');
    }
    
    const tasks = await getTasks();
    const task = tasks[taskId];
    
    if (!task) return null;
    
    // Status terminal states: everything except 'running' or 'pending'
    if (task.status !== 'running' && task.status !== 'pending') {
      return task;
    }
    
    // Original: await new Promise((I) => setTimeout(I, 100))
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Return current state even if timed out
  const finalTasks = await getTasks();
  return finalTasks[taskId] ?? null;
}

// ============================================
// Tool Implementation
// ============================================

/**
 * Input schema for TaskOutput tool.
 * Original: ap5 in chunks.119.mjs:1754-1758
 */
export const taskOutputInputSchema = z.object({
  task_id: z.string().describe("The task ID to get output from"),
  block: z.boolean().default(true).describe("Whether to wait for completion"),
  timeout: z.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
});

/**
 * Execute the TaskOutput tool logic.
 * This is the common entry point for both CLI and Agent tool calls.
 * Original: part of JK1 execution logic in chunks.119.mjs
 */
export async function executeTaskOutputTool(
  params: z.infer<typeof taskOutputInputSchema>,
  context: {
    getTasks: () => Promise<Record<string, BackgroundTask>>;
    setAppState: SetAppState;
  }
): Promise<TaskOutputResult> {
  const { task_id, block, timeout } = params;
  const { getTasks } = context;

  let task = (await getTasks())[task_id];
  if (!task) {
    throw new Error(`Task ${task_id} not found`);
  }

  if (block && (task.status === 'running' || task.status === 'pending')) {
    const completedTask = await waitForTaskCompletion(task_id, getTasks, timeout);
    if (completedTask) {
      task = completedTask;
    }
  }

  return formatTaskOutput(task);
}

/**
 * Tool Definition for TaskOutput.
 * Original: JK1 in chunks.119.mjs:1759-1785
 */
export const TaskOutputTool = {
  name: TASKOUTPUT_TOOL_NAME,
  maxResultSizeChars: 100000,
  aliases: ["AgentOutputTool", "BashOutputTool"],
  userFacingName() {
    return "Task Output";
  },
  inputSchema: taskOutputInputSchema,
  async description() {
    return "Retrieves output from a running or completed task";
  }
  // execution logic is usually handled by the main loop calling handlers.ts
};
