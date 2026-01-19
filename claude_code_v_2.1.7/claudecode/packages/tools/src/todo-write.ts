/**
 * @claudecode/tools - TodoWrite Tool
 *
 * Create and manage a structured task list for the current coding session.
 * Helps track progress, organize complex tasks, and demonstrate thoroughness.
 *
 * Reconstructed from chunks.59.mjs:402-481
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  permissionAllow,
  toolSuccess,
} from './base.js';
import type {
  TodoWriteInput,
  TodoWriteOutput,
  TodoItem,
  ToolContext,
} from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 100000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Todo status enum.
 * Original: NX8 in chunks.59.mjs
 */
const todoStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

/**
 * Todo item schema.
 */
const todoItemSchema = z.object({
  content: z.string().min(1).describe('Task description'),
  status: todoStatusSchema.describe('Task status'),
  activeForm: z.string().min(1).describe('Present continuous form (e.g., "Fixing the login bug")'),
});

/**
 * TodoWrite tool input schema.
 * Original: SX8 in chunks.59.mjs:397-398
 */
const todoWriteInputSchema = z.object({
  todos: z.array(todoItemSchema).describe('The updated todo list'),
});

/**
 * TodoWrite tool output schema.
 * Original: xX8 in chunks.59.mjs:399-401
 */
const todoWriteOutputSchema = z.object({
  oldTodos: z.array(todoItemSchema),
  newTodos: z.array(todoItemSchema),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a simple ID.
 */
function generateId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================
// TodoWrite Tool
// ============================================

/**
 * TodoWrite tool implementation.
 * Original: vD (TodoWriteTool) in chunks.59.mjs:402-481
 */
export const TodoWriteTool = createTool<TodoWriteInput, TodoWriteOutput>({
  name: TOOL_NAMES.TODO_WRITE,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  input_examples: [
    {
      todos: [
        {
          content: 'Fix the login bug',
          status: 'pending',
          activeForm: 'Fixing the login bug',
        },
      ],
    },
    {
      todos: [
        {
          content: 'Implement feature',
          status: 'completed',
          activeForm: 'Implementing feature',
        },
        {
          content: 'Write unit tests',
          status: 'in_progress',
          activeForm: 'Writing unit tests',
        },
      ],
    },
  ],

  async description() {
    return `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.`;
  },

  async prompt() {
    return `When to Use:
1. Complex multi-step tasks - When a task requires 3 or more distinct steps
2. Non-trivial and complex tasks - Tasks that require careful planning
3. User explicitly requests todo list - When the user directly asks
4. User provides multiple tasks - When users provide a list of things to be done
5. After receiving new instructions - Immediately capture user requirements

When NOT to Use:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps

Task States:
- pending: Task not yet started
- in_progress: Currently working on (limit to ONE task at a time)
- completed: Task finished successfully

IMPORTANT: Mark tasks complete IMMEDIATELY after finishing (don't batch completions)`;
  },

  inputSchema: todoWriteInputSchema,
  outputSchema: todoWriteOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return false; // State modifications must be sequential
  },

  isReadOnly() {
    return false; // Modifies app state
  },

  async checkPermissions(input) {
    // TodoWrite is always allowed
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    return validationSuccess();
  },

  async call(input, context) {
    const { todos } = input;
    const appState = await context.getAppState();
    const agentId = context.agentId ?? generateId();

    // Get old todos
    const oldTodos: TodoItem[] = appState.todos[agentId] ?? [];

    // If all todos completed, clear the list
    const allCompleted = todos.every((t) => t.status === 'completed');
    const newTodos: TodoItem[] = allCompleted ? [] : todos;

    // Update app state
    context.setAppState((state) => ({
      ...state,
      todos: { ...state.todos, [agentId]: newTodos },
    }));

    const result: TodoWriteOutput = {
      oldTodos,
      newTodos,
    };

    return toolSuccess(result);
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content:
        'Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable',
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: TodoWriteTool 已在声明处导出；避免重复导出。
