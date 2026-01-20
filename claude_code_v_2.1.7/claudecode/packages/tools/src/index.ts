/**
 * @claudecode/tools
 *
 * Built-in tool implementations for Claude Code.
 *
 * Tools provide Claude with the ability to interact with the filesystem,
 * execute commands, search the web, and manage tasks.
 *
 * Reconstructed from chunks.86, chunks.115, chunks.119, chunks.124, chunks.59, chunks.113
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Base
// ============================================

export {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  permissionDeny,
  permissionAsk,
  toolSuccess,
  toolError,
  isPermissionDeniedPath,
  isUncPath,
  isBinaryExtension,
  isImageExtension,
  isNotebookExtension,
  isPdfExtension,
} from './base.js';

// ============================================
// File Operation Tools
// ============================================

export { ReadTool } from './read.js';
export { WriteTool } from './write.js';
export { EditTool } from './edit.js';

// ============================================
// Search Tools
// ============================================

export { GlobTool } from './glob.js';
export { GrepTool } from './grep.js';

// ============================================
// Execution Tools
// ============================================

export { BashTool } from './bash.js';

// ============================================
// Web Tools
// ============================================

export { WebFetchTool } from './web-fetch.js';

// ============================================
// Task Management Tools
// ============================================

export { TaskTool } from './task.js';
export { TodoWriteTool } from './todo-write.js';
export { SkillTool } from './skill.js';

// ============================================
// Interactive Tools
// ============================================

export { AskUserQuestionTool } from './ask-user-question.js';

// ============================================
// Notebook Tools
// ============================================

export { NotebookEditTool } from './notebook-edit.js';

// ============================================
// Web Tools (Extended)
// ============================================

export { WebSearchTool } from './web-search.js';

// ============================================
// Background Task Tools
// ============================================

export { KillShellTool } from './kill-shell.js';
export { TaskOutputTool } from './task-output.js';

// ============================================
// Tool Collection
// ============================================

import { ReadTool } from './read.js';
import { WriteTool } from './write.js';
import { EditTool } from './edit.js';
import { GlobTool } from './glob.js';
import { GrepTool } from './grep.js';
import { BashTool } from './bash.js';
import { WebFetchTool } from './web-fetch.js';
import { TaskTool } from './task.js';
import { TodoWriteTool } from './todo-write.js';
import { SkillTool } from './skill.js';
import { AskUserQuestionTool } from './ask-user-question.js';
import { NotebookEditTool } from './notebook-edit.js';
import { WebSearchTool } from './web-search.js';
import { KillShellTool } from './kill-shell.js';
import { TaskOutputTool } from './task-output.js';
import type { Tool, ToolGroupings } from './types.js';

/**
 * All built-in tools.
 */
export const builtinTools: Array<Tool<any, any>> = [
  ReadTool,
  WriteTool,
  EditTool,
  GlobTool,
  GrepTool,
  BashTool,
  WebFetchTool,
  WebSearchTool,
  TaskTool,
  TodoWriteTool,
  SkillTool,
  AskUserQuestionTool,
  NotebookEditTool,
  KillShellTool,
  TaskOutputTool,
];

/**
 * Get tool by name.
 */
export function getToolByName(name: string): Tool<any, any> | undefined {
  return builtinTools.find((tool) => tool.name === name);
}

/**
 * Get tool groupings.
 * Original: XG9 (getToolGroupings) in chunks.144.mjs:1259-1281
 */
export function getToolGroupings(): ToolGroupings {
  return {
    READ_ONLY: {
      name: 'Read-only tools',
      toolNames: new Set([
        GlobTool.name,
        GrepTool.name,
        TaskTool.name,
        ReadTool.name,
        WebFetchTool.name,
      ]),
    },
    EDIT: {
      name: 'Edit tools',
      toolNames: new Set([EditTool.name, WriteTool.name]),
    },
    EXECUTION: {
      name: 'Execution tools',
      toolNames: new Set([BashTool.name]),
    },
    MCP: {
      name: 'MCP tools',
      toolNames: new Set(),
      isMcp: true,
    },
    OTHER: {
      name: 'Other tools',
      toolNames: new Set([TodoWriteTool.name, SkillTool.name]),
    },
  };
}
