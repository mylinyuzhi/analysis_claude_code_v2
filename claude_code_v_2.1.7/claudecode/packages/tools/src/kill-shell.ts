/**
 * @claudecode/tools - KillShell Tool
 *
 * Kills a running background bash shell by its ID.
 *
 * Reconstructed from chunks.119.mjs:1490-1571
 *
 * Key symbols:
 * - GK1 → KILL_SHELL (tool name constant)
 * - ZK1 → KillShellTool (tool object)
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';
import { killBackgroundTask as killLocalBashTask } from '@claudecode/integrations/background-agents';

// ============================================
// Input Types
// ============================================

/**
 * KillShell input.
 */
export interface KillShellInput {
  /** The ID of the background shell to kill */
  shell_id: string;
}

/**
 * KillShell output.
 */
export interface KillShellOutput {
  /** Status message about the operation */
  message: string;
  /** The ID of the shell that was killed */
  shell_id: string;
}

// ============================================
// Input Schema
// ============================================

/**
 * KillShell input schema.
 * Original: lp5 in chunks.119.mjs:1485-1487
 */
const killShellInputSchema = z.object({
  shell_id: z
    .string()
    .describe('The ID of the background shell to kill'),
});

// ============================================
// Output Schema
// ============================================

/**
 * KillShell output schema.
 * Original: ip5 in chunks.119.mjs:1487-1490
 */
const killShellOutputSchema = z.object({
  message: z.string(),
  shell_id: z.string(),
});

// ============================================
// KillShell Tool
// ============================================

/**
 * KillShell tool implementation.
 * Original: ZK1 in chunks.119.mjs:1490-1571
 *
 * This tool terminates background bash shells that were started
 * with run_in_background=true in the Bash tool.
 */
export const KillShellTool = createTool<KillShellInput, KillShellOutput>({
  name: TOOL_NAMES.KILL_SHELL,
  strict: false,

  async description() {
    return `- Kills a running background bash shell by its ID
- Takes a shell_id parameter identifying the shell to kill
- Returns a success or failure status
- Use this tool when you need to terminate a long-running shell
- Shell IDs can be found using the /tasks command`;
  },

  async prompt() {
    return '';
  },

  inputSchema: killShellInputSchema,
  outputSchema: killShellOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    // Safe for concurrent execution
    return true;
  },

  isReadOnly() {
    // Not read-only - terminates a process
    return false;
  },

  async checkPermissions(input) {
    // Always allow - user initiated background shells
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const { shell_id } = input;

    if (!shell_id || shell_id.trim().length === 0) {
      return validationError('shell_id is required', 1);
    }

    // Get app state to check if shell exists
    const appState = await context.getAppState?.();
    const tasks = (appState as any)?.tasks;

    if (tasks) {
      const task = tasks.get?.(shell_id) || tasks[shell_id];
      if (!task) {
        return validationError(`Shell not found: ${shell_id}`, 1);
      }

      // Check task type is local_bash
      if (task.type !== 'local_bash') {
        return validationError(
          `Task ${shell_id} is not a background shell (type: ${task.type})`,
          2
        );
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    const { shell_id } = input;

    try {
      await killLocalBashTask(shell_id, context.setAppState as any);
      
      return toolSuccess({
        message: `Successfully killed shell: ${shell_id}`,
        shell_id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolError(`Failed to kill shell: ${message}`);
    }
  },

  /**
   * Map tool result to API format.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: result.message,
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: KillShellTool 已在声明处导出；避免重复导出。
