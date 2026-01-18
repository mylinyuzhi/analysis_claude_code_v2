/**
 * @claudecode/tools - Tool Type Definitions
 *
 * Type definitions for built-in tools.
 * Reconstructed from chunks.115.mjs, chunks.124.mjs, chunks.119.mjs
 */

import type { ZodSchema } from 'zod';

// ============================================
// Permission Types
// ============================================

/**
 * Permission behavior enum.
 */
export type PermissionBehavior = 'allow' | 'deny' | 'ask';

/**
 * Permission check result.
 */
export interface PermissionResult {
  behavior: PermissionBehavior;
  message?: string;
  updatedInput?: unknown;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  result: boolean;
  message?: string;
  errorCode?: number;
}

// ============================================
// Tool Result Types
// ============================================

/**
 * Tool execution result.
 */
export interface ToolResult<T = unknown> {
  data: T;
  error?: string;
  errorCode?: number;
}

/**
 * Tool result block for API response.
 */
export interface ToolResultBlockParam {
  tool_use_id: string;
  type: 'tool_result';
  content: string | ContentBlock[];
  is_error?: boolean;
}

/**
 * Content block types.
 */
export interface ContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

// ============================================
// Tool Context Types
// ============================================

/**
 * Tool execution context.
 */
export interface ToolContext {
  /** Current working directory getter */
  getCwd: () => string;
  /** App state getter */
  getAppState: () => Promise<AppState>;
  /** App state setter */
  setAppState: (updater: (state: AppState) => AppState) => void;
  /** Read file state tracking */
  readFileState: Map<string, ReadFileState>;
  /** Agent ID */
  agentId?: string;
  /** Session ID */
  sessionId?: string;
  /** Abort signal */
  abortSignal?: AbortSignal;
  /** Permission checker */
  checkPermission?: (key: string) => Promise<PermissionBehavior>;
}

/**
 * Read file state for edit validation.
 */
export interface ReadFileState {
  content: string;
  timestamp: number;
  totalLines: number;
}

/**
 * Minimal app state for tool operations.
 */
export interface AppState {
  todos: Record<string, TodoItem[]>;
  [key: string]: unknown;
}

/**
 * Todo item.
 */
export interface TodoItem {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

// ============================================
// Tool Interface
// ============================================

/**
 * Tool metadata.
 */
export interface ToolMetadata {
  toolUseId: string;
  [key: string]: unknown;
}

/**
 * Progress callback for long-running tools.
 */
export type ProgressCallback = (progress: {
  stage: string;
  percent?: number;
  message?: string;
}) => void;

/**
 * Search/read command info.
 */
export interface SearchReadInfo {
  isSearch: boolean;
  isRead: boolean;
}

/**
 * Tool interface.
 * Original: Tool interface pattern from chunks.115.mjs, chunks.86.mjs
 */
export interface Tool<TInput = unknown, TOutput = unknown> {
  /** Unique tool identifier */
  name: string;

  /** Max result size in characters */
  maxResultSizeChars: number;

  /** Strict schema validation */
  strict?: boolean;

  /** Example inputs for API documentation */
  input_examples?: TInput[];

  /** Tool description for Claude */
  description(): Promise<string>;

  /** Detailed usage instructions */
  prompt(): Promise<string>;

  /** Zod schema for input validation */
  inputSchema: ZodSchema<TInput>;

  /** Zod schema for output structure */
  outputSchema: ZodSchema<TOutput>;

  /** Display name for UI */
  userFacingName?: string | ((input: TInput) => string);

  /** Whether tool is currently enabled */
  isEnabled(): boolean;

  /** Can run in parallel with other tools */
  isConcurrencySafe(input?: TInput): boolean;

  /** Whether tool modifies files */
  isReadOnly(input?: TInput): boolean;

  /** Check if this is a search or read command */
  isSearchOrReadCommand?(input: TInput): SearchReadInfo;

  /** Extract file path from input */
  getPath?(input: TInput): string;

  /** Check permissions before execution */
  checkPermissions?(
    input: TInput,
    context: ToolContext
  ): Promise<PermissionResult>;

  /** Validate input before execution */
  validateInput?(
    input: TInput,
    context: ToolContext
  ): Promise<ValidationResult>;

  /** Execute the tool */
  call(
    input: TInput,
    context: ToolContext,
    toolUseId: string,
    metadata?: ToolMetadata,
    progressCallback?: ProgressCallback
  ): Promise<ToolResult<TOutput>>;

  /** Map result to API block */
  mapToolResultToToolResultBlockParam(
    result: TOutput,
    toolUseId: string
  ): ToolResultBlockParam;

  /** Render tool use in UI (React node) */
  renderToolUseMessage?(input: TInput, options?: unknown): unknown;

  /** Render tool result in UI (React node) */
  renderToolResultMessage?(result: TOutput, options?: unknown): unknown;

  /** Render tool error in UI (React node) */
  renderToolUseErrorMessage?(error: Error, options?: unknown): unknown;

  /** Render rejected tool use in UI (React node) */
  renderToolUseRejectedMessage?(input: TInput, options?: unknown): unknown;

  /** Render progress in UI (React node) */
  renderToolUseProgressMessage?(input: TInput, options?: unknown): unknown;
}

// ============================================
// Tool Group Types
// ============================================

/**
 * Tool grouping.
 */
export interface ToolGroup {
  name: string;
  toolNames: Set<string>;
  isMcp?: boolean;
}

/**
 * Tool groupings.
 */
export interface ToolGroupings {
  READ_ONLY: ToolGroup;
  EDIT: ToolGroup;
  EXECUTION: ToolGroup;
  MCP: ToolGroup;
  OTHER: ToolGroup;
}

// ============================================
// Read Tool Types
// ============================================

/**
 * Read tool input.
 */
export interface ReadInput {
  file_path: string;
  offset?: number;
  limit?: number;
}

/**
 * Image dimensions.
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Image mime types.
 */
export type ImageMimeType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

/**
 * Notebook cell.
 */
export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  source: string;
  outputs?: unknown[];
}

/**
 * Read tool output - text file.
 */
export interface ReadTextOutput {
  type: 'text';
  file: {
    filePath: string;
    content: string;
    numLines: number;
    startLine: number;
    totalLines: number;
  };
}

/**
 * Read tool output - image file.
 */
export interface ReadImageOutput {
  type: 'image';
  file: {
    base64: string;
    type: ImageMimeType;
    originalSize: number;
    dimensions?: ImageDimensions;
  };
}

/**
 * Read tool output - notebook.
 */
export interface ReadNotebookOutput {
  type: 'notebook';
  file: {
    filePath: string;
    cells: NotebookCell[];
  };
}

/**
 * Read tool output - PDF.
 */
export interface ReadPdfOutput {
  type: 'pdf';
  file: {
    filePath: string;
    base64: string;
    originalSize: number;
  };
}

/**
 * Read tool output union.
 */
export type ReadOutput = ReadTextOutput | ReadImageOutput | ReadNotebookOutput | ReadPdfOutput;

// ============================================
// Write Tool Types
// ============================================

/**
 * Write tool input.
 */
export interface WriteInput {
  file_path: string;
  content: string;
}

/**
 * Diff patch.
 */
export interface Patch {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

/**
 * Write tool output.
 */
export interface WriteOutput {
  type: 'create' | 'update';
  filePath: string;
  content: string;
  structuredPatch: Patch[];
  originalFile: string | null;
}

// ============================================
// Edit Tool Types
// ============================================

/**
 * Edit tool input.
 */
export interface EditInput {
  file_path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}

/**
 * Edit tool output.
 */
export interface EditOutput {
  filePath: string;
  oldString: string;
  newString: string;
  originalFile: string;
  structuredPatch: Patch[];
  userModified: boolean;
  replaceAll: boolean;
}

// ============================================
// Glob Tool Types
// ============================================

/**
 * Glob tool input.
 */
export interface GlobInput {
  pattern: string;
  path?: string;
}

/**
 * Glob tool output.
 */
export interface GlobOutput {
  durationMs: number;
  numFiles: number;
  filenames: string[];
  truncated: boolean;
}

// ============================================
// Grep Tool Types
// ============================================

/**
 * Grep output mode.
 */
export type GrepOutputMode = 'content' | 'files_with_matches' | 'count';

/**
 * Grep tool input.
 */
export interface GrepInput {
  pattern: string;
  path?: string;
  glob?: string;
  output_mode?: GrepOutputMode;
  '-B'?: number;
  '-A'?: number;
  '-C'?: number;
  '-n'?: boolean;
  '-i'?: boolean;
  type?: string;
  head_limit?: number;
  offset?: number;
  multiline?: boolean;
}

/**
 * Grep tool output.
 */
export interface GrepOutput {
  mode?: GrepOutputMode;
  numFiles: number;
  filenames: string[];
  content?: string;
  numLines?: number;
  numMatches?: number;
  appliedLimit?: number;
  appliedOffset?: number;
}

// ============================================
// Bash Tool Types
// ============================================

/**
 * Bash tool input.
 */
export interface BashInput {
  command: string;
  timeout?: number;
  description?: string;
  run_in_background?: boolean;
  dangerouslyDisableSandbox?: boolean;
  _simulatedSedEdit?: {
    filePath: string;
    newContent: string;
  };
}

/**
 * Bash tool output.
 */
export interface BashOutput {
  stdout: string;
  stderr: string;
  rawOutputPath?: string;
  interrupted: boolean;
  isImage?: boolean;
  backgroundTaskId?: string;
  backgroundedByUser?: boolean;
  dangerouslyDisableSandbox?: boolean;
  returnCodeInterpretation?: string;
  structuredContent?: ContentBlock[];
}

// ============================================
// WebFetch Tool Types
// ============================================

/**
 * WebFetch tool input.
 */
export interface WebFetchInput {
  url: string;
  prompt: string;
}

/**
 * WebFetch tool output.
 */
export interface WebFetchOutput {
  bytes: number;
  code: number;
  codeText: string;
  result: string;
  durationMs: number;
  url: string;
}

// ============================================
// Task Tool Types
// ============================================

/**
 * Task tool input.
 */
export interface TaskInput {
  prompt: string;
  description: string;
  subagent_type: string;
  model?: 'sonnet' | 'opus' | 'haiku';
  max_turns?: number;
  run_in_background?: boolean;
  resume?: string;
}

/**
 * Task tool output.
 */
export interface TaskOutput {
  taskId: string;
  status: 'running' | 'completed' | 'error';
  result?: string;
  error?: string;
}

// ============================================
// TodoWrite Tool Types
// ============================================

/**
 * TodoWrite tool input.
 */
export interface TodoWriteInput {
  todos: TodoItem[];
}

/**
 * TodoWrite tool output.
 */
export interface TodoWriteOutput {
  oldTodos: TodoItem[];
  newTodos: TodoItem[];
}

// ============================================
// Skill Tool Types
// ============================================

/**
 * Skill tool input.
 */
export interface SkillInput {
  skill: string;
  args?: string;
}

/**
 * Skill tool output.
 */
export interface SkillOutput {
  skillName: string;
  executed: boolean;
  result?: string;
  error?: string;
}

// ============================================
// Tool Name Constants
// ============================================

export const TOOL_NAMES = {
  READ: 'Read',
  WRITE: 'Write',
  EDIT: 'Edit',
  GLOB: 'Glob',
  GREP: 'Grep',
  NOTEBOOK_EDIT: 'NotebookEdit',
  BASH: 'Bash',
  KILL_SHELL: 'KillShell',
  TASK_OUTPUT: 'TaskOutput',
  WEB_FETCH: 'WebFetch',
  WEB_SEARCH: 'WebSearch',
  TASK: 'Task',
  SKILL: 'Skill',
  ASK_USER_QUESTION: 'AskUserQuestion',
  ENTER_PLAN_MODE: 'EnterPlanMode',
  EXIT_PLAN_MODE: 'ExitPlanMode',
  TODO_WRITE: 'TodoWrite',
  LSP: 'LSP',
} as const;

// ============================================
// Exports
// ============================================

export type {
  PermissionBehavior,
  PermissionResult,
  ValidationResult,
  ToolResult,
  ToolResultBlockParam,
  ContentBlock,
  ToolContext,
  ReadFileState,
  AppState,
  TodoItem,
  ToolMetadata,
  ProgressCallback,
  SearchReadInfo,
  Tool,
  ToolGroup,
  ToolGroupings,
  ReadInput,
  ImageDimensions,
  ImageMimeType,
  NotebookCell,
  ReadTextOutput,
  ReadImageOutput,
  ReadNotebookOutput,
  ReadPdfOutput,
  ReadOutput,
  WriteInput,
  Patch,
  WriteOutput,
  EditInput,
  EditOutput,
  GlobInput,
  GlobOutput,
  GrepOutputMode,
  GrepInput,
  GrepOutput,
  BashInput,
  BashOutput,
  WebFetchInput,
  WebFetchOutput,
  TaskInput,
  TaskOutput,
  TodoWriteInput,
  TodoWriteOutput,
  SkillInput,
  SkillOutput,
};
