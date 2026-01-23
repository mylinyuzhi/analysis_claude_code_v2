/**
 * @claudecode/tools - Base Tool Implementation
 *
 * Base factory and utilities for creating tools.
 * Reconstructed from chunks.115.mjs, chunks.86.mjs
 */

import type {
  Tool,
  ToolContext,
  ToolResult,
  ToolResultBlockParam,
  ValidationResult,
  PermissionResult,
  ProgressCallback,
  ToolMetadata,
} from './types.js';

// ============================================
// Tool Factory
// ============================================

/**
 * Options for creating a tool.
 */
export interface CreateToolOptions<TInput, TOutput> {
  name: string;
  maxResultSizeChars?: number;
  strict?: boolean;
  input_examples?: TInput[];

  description: () => Promise<string>;
  prompt: (context?: ToolContext) => Promise<string>;

  inputSchema: Tool<TInput, TOutput>['inputSchema'];
  outputSchema: Tool<TInput, TOutput>['outputSchema'];

  userFacingName?: string | ((input: TInput) => string);

  isEnabled?: () => boolean;
  isConcurrencySafe?: (input?: TInput) => boolean;
  isReadOnly?: (input?: TInput) => boolean;
  /** Whether tool execution inherently requires user interaction (e.g. UI prompts). */
  requiresUserInteraction?: (input?: TInput) => boolean;
  isSearchOrReadCommand?: (input: TInput) => { isSearch: boolean; isRead: boolean };
  getPath?: (input: TInput) => string;

  checkPermissions?: (input: TInput, context: ToolContext) => Promise<PermissionResult>;
  validateInput?: (input: TInput, context: ToolContext) => Promise<ValidationResult>;

  call: (
    input: TInput,
    context: ToolContext,
    toolUseId: string,
    metadata?: ToolMetadata,
    progressCallback?: ProgressCallback
  ) => Promise<ToolResult<TOutput>>;

  mapToolResultToToolResultBlockParam?: (
    result: TOutput,
    toolUseId: string
  ) => ToolResultBlockParam;

  renderToolUseMessage?: (input: TInput, options?: unknown) => unknown;
  renderToolResultMessage?: (result: TOutput, options?: unknown) => unknown;
  renderToolUseErrorMessage?: (error: Error, options?: unknown) => unknown;
  renderToolUseRejectedMessage?: (input: TInput, options?: unknown) => unknown;
  renderToolUseProgressMessage?: (input: TInput, options?: unknown) => unknown;
}

/**
 * Create a tool with default implementations.
 */
export function createTool<TInput, TOutput>(
  options: CreateToolOptions<TInput, TOutput>
): Tool<TInput, TOutput> {
  return {
    name: options.name,
    maxResultSizeChars: options.maxResultSizeChars ?? 30000,
    strict: options.strict ?? false,
    input_examples: options.input_examples,

    description: options.description,
    prompt: options.prompt,

    inputSchema: options.inputSchema,
    outputSchema: options.outputSchema,

    userFacingName: options.userFacingName,

    isEnabled: options.isEnabled ?? (() => true),
    isConcurrencySafe: options.isConcurrencySafe ?? (() => true),
    isReadOnly: options.isReadOnly ?? (() => true),
    requiresUserInteraction: options.requiresUserInteraction ?? (() => false),
    isSearchOrReadCommand: options.isSearchOrReadCommand,
    getPath: options.getPath,

    checkPermissions: options.checkPermissions,
    validateInput: options.validateInput,

    call: options.call,

    mapToolResultToToolResultBlockParam:
      options.mapToolResultToToolResultBlockParam ??
      ((result, toolUseId) => ({
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: JSON.stringify(result),
      })),

    renderToolUseMessage: options.renderToolUseMessage,
    renderToolResultMessage: options.renderToolResultMessage,
    renderToolUseErrorMessage: options.renderToolUseErrorMessage,
    renderToolUseRejectedMessage: options.renderToolUseRejectedMessage,
    renderToolUseProgressMessage: options.renderToolUseProgressMessage,
  };
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Create a successful validation result.
 */
export function validationSuccess(): ValidationResult {
  return { result: true };
}

/**
 * Create a failed validation result.
 */
export function validationError(message: string, errorCode?: number): ValidationResult {
  return { result: false, message, errorCode };
}

/**
 * Create an allow permission result.
 */
export function permissionAllow(updatedInput?: unknown): PermissionResult {
  return { behavior: 'allow', updatedInput };
}

/**
 * Create a deny permission result.
 */
export function permissionDeny(message?: string): PermissionResult {
  return { behavior: 'deny', message };
}

/**
 * Create an ask permission result.
 */
export function permissionAsk(message?: string): PermissionResult {
  return { behavior: 'ask', message };
}

// ============================================
// Result Helpers
// ============================================

/**
 * Create a successful tool result.
 */
export function toolSuccess<T>(data: T): ToolResult<T> {
  return { data };
}

/**
 * Create an error tool result.
 */
export function toolError<T>(error: string, errorCode?: number, data?: T): ToolResult<T> {
  return { data: data as T, error, errorCode };
}

// ============================================
// File Path Helpers
// ============================================

/**
 * Check if path is a permission denied path.
 * Original: Permission checking from chunks.86.mjs:612
 */
export function isPermissionDeniedPath(filePath: string): boolean {
  const deniedPatterns = [
    /\.env$/i,
    /credentials\./i,
    /secrets?\./i,
    /\.pem$/i,
    /\.key$/i,
    /id_rsa/i,
    /id_dsa/i,
    /id_ecdsa/i,
    /id_ed25519/i,
  ];

  return deniedPatterns.some((pattern) => pattern.test(filePath));
}

/**
 * Check if path is a UNC path.
 */
export function isUncPath(filePath: string): boolean {
  return filePath.startsWith('\\\\') || filePath.startsWith('//');
}

/**
 * Check if file extension indicates binary.
 */
export function isBinaryExtension(filePath: string): boolean {
  const binaryExtensions = new Set([
    '.exe',
    '.dll',
    '.so',
    '.dylib',
    '.bin',
    '.obj',
    '.o',
    '.a',
    '.lib',
    '.pyc',
    '.pyo',
    '.class',
    '.jar',
    '.war',
    '.ear',
    '.zip',
    '.tar',
    '.gz',
    '.bz2',
    '.7z',
    '.rar',
    '.iso',
    '.dmg',
    '.deb',
    '.rpm',
    '.msi',
    '.sqlite',
    '.db',
    '.sqlite3',
    '.wasm',
  ]);

  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  return binaryExtensions.has(ext);
}

/**
 * Check if file extension indicates an image.
 */
export function isImageExtension(filePath: string): boolean {
  const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  return imageExtensions.has(ext);
}

/**
 * Check if file extension indicates a Jupyter notebook.
 */
export function isNotebookExtension(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.ipynb');
}

/**
 * Check if path is a PDF.
 */
export function isPdfExtension(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.pdf');
}

/**
 * Check if the file is a Claude Code settings file.
 * Original: h$0 in chunks.148.mjs:2039-2044
 */
export function isSettingsJsonFile(filePath: string): boolean {
  return (
    filePath.endsWith('/.claude/settings.json') ||
    filePath.endsWith('/.claude/settings.local.json') ||
    filePath.endsWith('\\.claude\\settings.json') ||
    filePath.endsWith('\\.claude\\settings.local.json')
  );
}

/**
 * Validate settings JSON content.
 * Placeholder for actual implementation.
 * Original: b$0 in chunks.114.mjs:2883-2904
 */
export function validateSettingsJson(content: string): { isValid: boolean; error?: string; fullSchema?: string } {
  try {
    JSON.parse(content);
    return { isValid: true };
  } catch (e) {
    return {
      isValid: false,
      error: `Invalid JSON: ${(e as Error).message}`,
      fullSchema: '{}',
    };
  }
}

// ============================================
// Export
// ============================================

// NOTE: 本文件内函数已使用 `export` 导出；移除重复聚合导出。
