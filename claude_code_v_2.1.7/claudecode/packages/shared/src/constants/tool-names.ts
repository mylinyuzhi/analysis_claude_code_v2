/**
 * @claudecode/shared - Tool Name Constants
 *
 * Tool name constants used throughout Claude Code.
 * Reconstructed from multiple chunk files.
 *
 * Key symbols:
 * - X9 → BASH_TOOL_NAME (chunks.53.mjs:1475)
 * - z3 → READ_TOOL_NAME (chunks.55.mjs:1200)
 * - BY → WRITE_TOOL_NAME (chunks.58.mjs:3118)
 * - I8 → EDIT_TOOL_NAME (chunks.55.mjs:1149)
 * - lI → GLOB_TOOL_NAME (chunks.58.mjs:3089)
 * - DI → GREP_TOOL_NAME (chunks.58.mjs:3114)
 * - f3 → TASK_TOOL_NAME (chunks.58.mjs:3098)
 * - Bm → TODOWRITE_TOOL_NAME (chunks.59.mjs:224)
 * - cI → WEBFETCH_TOOL_NAME (chunks.55.mjs:1128)
 * - aR → WEBSEARCH_TOOL_NAME (chunks.58.mjs:3174)
 * - tq → NOTEBOOKEDIT_TOOL_NAME (chunks.58.mjs:3134)
 * - zY → ASKUSERQUESTION_TOOL_NAME (chunks.119.mjs:2283)
 * - kF → SKILL_TOOL_NAME (chunks.113.mjs:408)
 */

// ============================================
// Core Tool Names
// ============================================

/**
 * Bash tool name
 * Original: X9 in chunks.53.mjs:1475
 */
export const BASH_TOOL_NAME = 'Bash';

/**
 * Read tool name
 * Original: z3 in chunks.55.mjs:1200
 */
export const READ_TOOL_NAME = 'Read';

/**
 * Write tool name
 * Original: BY in chunks.58.mjs:3118
 */
export const WRITE_TOOL_NAME = 'Write';

/**
 * Edit tool name
 * Original: I8 in chunks.55.mjs:1149
 */
export const EDIT_TOOL_NAME = 'Edit';

/**
 * Glob tool name
 * Original: lI in chunks.58.mjs:3089
 */
export const GLOB_TOOL_NAME = 'Glob';

/**
 * Grep tool name
 * Original: DI in chunks.58.mjs:3114
 */
export const GREP_TOOL_NAME = 'Grep';

// ============================================
// Task & Agent Tool Names
// ============================================

/**
 * Task tool name (for subagent execution)
 * Original: f3 in chunks.58.mjs:3098
 */
export const TASK_TOOL_NAME = 'Task';

/**
 * TaskOutput tool name (for retrieving background task results)
 * Original: aHA in analysis docs
 */
export const TASKOUTPUT_TOOL_NAME = 'TaskOutput';

/**
 * KillShell tool name (for terminating background shells)
 * Original: GK1 in analysis docs
 */
export const KILLSHELL_TOOL_NAME = 'KillShell';

// ============================================
// Specialized Tool Names
// ============================================

/**
 * TodoWrite tool name
 * Original: Bm in chunks.59.mjs:224
 */
export const TODOWRITE_TOOL_NAME = 'TodoWrite';

/**
 * WebFetch tool name
 * Original: cI in chunks.55.mjs:1128
 */
export const WEBFETCH_TOOL_NAME = 'WebFetch';

/**
 * WebSearch tool name
 * Original: aR in chunks.58.mjs:3174
 */
export const WEBSEARCH_TOOL_NAME = 'WebSearch';

/**
 * NotebookEdit tool name
 * Original: tq in chunks.58.mjs:3134
 */
export const NOTEBOOKEDIT_TOOL_NAME = 'NotebookEdit';

/**
 * AskUserQuestion tool name
 * Original: zY in chunks.119.mjs:2283
 */
export const ASKUSERQUESTION_TOOL_NAME = 'AskUserQuestion';

/**
 * Skill tool name
 * Original: kF in chunks.113.mjs:408
 */
export const SKILL_TOOL_NAME = 'Skill';

// ============================================
// Plan Mode Tool Names
// ============================================

/**
 * EnterPlanMode tool name
 */
export const ENTERPLANMODE_TOOL_NAME = 'EnterPlanMode';

/**
 * ExitPlanMode tool name
 */
export const EXITPLANMODE_TOOL_NAME = 'ExitPlanMode';

// ============================================
// LSP Tool Names
// ============================================

/**
 * LSP tool name (Language Server Protocol integration)
 * Original: Sg2 in analysis docs
 */
export const LSP_TOOL_NAME = 'LSP';

// ============================================
// Tool Name Sets
// ============================================

/**
 * Core file operation tools
 */
export const FILE_TOOLS = new Set([
  READ_TOOL_NAME,
  WRITE_TOOL_NAME,
  EDIT_TOOL_NAME,
  GLOB_TOOL_NAME,
  GREP_TOOL_NAME,
]);

/**
 * Web-related tools
 */
export const WEB_TOOLS = new Set([
  WEBFETCH_TOOL_NAME,
  WEBSEARCH_TOOL_NAME,
]);

/**
 * Agent/Task tools
 */
export const AGENT_TOOLS = new Set([
  TASK_TOOL_NAME,
  TASKOUTPUT_TOOL_NAME,
  KILLSHELL_TOOL_NAME,
]);

/**
 * All built-in tool names
 */
export const ALL_TOOL_NAMES = new Set([
  BASH_TOOL_NAME,
  READ_TOOL_NAME,
  WRITE_TOOL_NAME,
  EDIT_TOOL_NAME,
  GLOB_TOOL_NAME,
  GREP_TOOL_NAME,
  TASK_TOOL_NAME,
  TASKOUTPUT_TOOL_NAME,
  KILLSHELL_TOOL_NAME,
  TODOWRITE_TOOL_NAME,
  WEBFETCH_TOOL_NAME,
  WEBSEARCH_TOOL_NAME,
  NOTEBOOKEDIT_TOOL_NAME,
  ASKUSERQUESTION_TOOL_NAME,
  SKILL_TOOL_NAME,
  ENTERPLANMODE_TOOL_NAME,
  EXITPLANMODE_TOOL_NAME,
  LSP_TOOL_NAME,
]);

