/**
 * @claudecode/core - Base Tool Implementation
 *
 * Abstract base class for implementing tools with common functionality.
 */

import type {
  Tool,
  Schema,
  ToolUseContext,
  ToolResult,
  ToolResultBlock,
  PermissionResult,
  ValidationResult,
  ProgressCallback,
  RenderOptions,
} from './types.js';

// ============================================
// Simple Schema Implementation
// ============================================

/**
 * Create a simple schema with parse/safeParse
 */
export function createSchema<T>(
  validator: (data: unknown) => T
): Schema<T> {
  return {
    parse(data: unknown): T {
      return validator(data);
    },
    safeParse(data: unknown): { success: true; data: T } | { success: false; error: Error } {
      try {
        const result = validator(data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as Error };
      }
    },
  };
}

/**
 * Create a passthrough schema (accepts any input)
 */
export function createPassthroughSchema<T>(): Schema<T> {
  return createSchema((data) => data as T);
}

// ============================================
// Base Tool Class
// ============================================

/**
 * Abstract base class for tools.
 *
 * Provides common functionality and default implementations
 * for optional interface methods.
 */
export abstract class BaseTool<TInput = unknown, TOutput = unknown>
  implements Tool<TInput, TOutput>
{
  abstract name: string;
  abstract maxResultSizeChars: number;
  abstract inputSchema: Schema<TInput>;
  abstract outputSchema: Schema<TOutput>;

  strict?: boolean = true;
  input_examples?: TInput[];
  userFacingName?: string | ((input: TInput) => string);

  /**
   * Get tool description
   */
  abstract description(): Promise<string> | string;

  /**
   * Get detailed usage prompt
   */
  abstract prompt(): Promise<string> | string;

  /**
   * Execute the tool
   */
  abstract call(
    input: TInput,
    context: ToolUseContext,
    toolUseId: string,
    metadata: unknown,
    progressCallback?: ProgressCallback
  ): Promise<ToolResult<TOutput>>;

  /**
   * Whether tool is enabled (default: true)
   */
  isEnabled(): boolean {
    return true;
  }

  /**
   * Whether tool can run concurrently (default: false)
   */
  isConcurrencySafe(_input?: TInput): boolean {
    return false;
  }

  /**
   * Whether tool is read-only (default: false)
   */
  isReadOnly(_input?: TInput): boolean {
    return false;
  }

  /**
   * Check permissions (default: allow)
   */
  async checkPermissions(
    _input: TInput,
    _context: ToolUseContext
  ): Promise<PermissionResult> {
    return { result: true };
  }

  /**
   * Validate input (default: pass)
   */
  async validateInput(
    input: TInput,
    _context: ToolUseContext
  ): Promise<ValidationResult> {
    const parseResult = this.inputSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        result: false,
        message: parseResult.error.message,
        behavior: 'deny',
      };
    }
    return { result: true };
  }

  /**
   * Map result to API format
   */
  mapToolResultToToolResultBlockParam(
    result: ToolResult<TOutput>,
    toolUseId: string
  ): ToolResultBlock {
    if (result.error) {
      const errorMessage =
        typeof result.error === 'string'
          ? result.error
          : result.error.message || 'Unknown error';

      return {
        type: 'tool_result',
        tool_use_id: toolUseId,
        content: errorMessage,
        is_error: true,
      };
    }

    // Convert result to string
    let content: string;
    if (typeof result.data === 'string') {
      content = result.data;
    } else if (result.data !== undefined) {
      content = JSON.stringify(result.data, null, 2);
    } else {
      content = 'Success';
    }

    // Truncate if too long
    if (content.length > this.maxResultSizeChars) {
      content =
        content.slice(0, this.maxResultSizeChars) +
        `\n...[truncated, ${content.length - this.maxResultSizeChars} chars omitted]`;
    }

    return {
      type: 'tool_result',
      tool_use_id: toolUseId,
      content,
      is_error: false,
    };
  }

  /**
   * Get display name
   */
  getDisplayName(input?: TInput): string {
    if (typeof this.userFacingName === 'function' && input !== undefined) {
      return this.userFacingName(input);
    }
    if (typeof this.userFacingName === 'string') {
      return this.userFacingName;
    }
    return this.name;
  }
}

// ============================================
// Read-Only Tool Base
// ============================================

/**
 * Base class for read-only tools (Glob, Grep, Read, WebFetch, etc.)
 */
export abstract class ReadOnlyTool<
  TInput = unknown,
  TOutput = unknown
> extends BaseTool<TInput, TOutput> {
  isReadOnly(): boolean {
    return true;
  }

  isConcurrencySafe(): boolean {
    return true;
  }
}

// ============================================
// File Tool Base
// ============================================

/**
 * Base class for file-based tools (Read, Write, Edit)
 */
export abstract class FileTool<
  TInput extends { file_path: string } = { file_path: string },
  TOutput = unknown
> extends BaseTool<TInput, TOutput> {
  /**
   * Extract file path from input
   */
  getPath(input: TInput): string {
    return input.file_path;
  }

  /**
   * Check if input represents a search or read command
   */
  isSearchOrReadCommand(_input?: TInput): { isSearch: boolean; isRead: boolean } {
    return { isSearch: false, isRead: this.isReadOnly() };
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
