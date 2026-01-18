/**
 * @claudecode/tools - Read Tool
 *
 * Reads files from the local filesystem.
 * Supports text files, images, PDFs, and Jupyter notebooks.
 *
 * Reconstructed from chunks.86.mjs:561-827
 */

import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, extname } from 'path';
import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  permissionDeny,
  toolSuccess,
  toolError,
  isPermissionDeniedPath,
  isUncPath,
  isBinaryExtension,
  isImageExtension,
  isNotebookExtension,
  isPdfExtension,
} from './base.js';
import type {
  ReadInput,
  ReadOutput,
  ReadTextOutput,
  ReadImageOutput,
  ReadNotebookOutput,
  ReadPdfOutput,
  ImageMimeType,
  NotebookCell,
  ToolContext,
} from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const DEFAULT_LINE_LIMIT = 2000;
const MAX_LINE_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_RESULT_SIZE = 30000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Read tool input schema.
 * Original: je8 in chunks.86.mjs:522-526
 */
const readInputSchema = z.object({
  file_path: z.string().describe('The absolute path to the file to read'),
  offset: z
    .number()
    .optional()
    .describe('The line number to start reading from. Only provide if the file is too large.'),
  limit: z
    .number()
    .optional()
    .describe('The number of lines to read. Only provide if the file is too large.'),
});

/**
 * Read tool output schema.
 * Original: Pe8 in chunks.86.mjs:526-561
 */
const readOutputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    file: z.object({
      filePath: z.string(),
      content: z.string(),
      numLines: z.number(),
      startLine: z.number(),
      totalLines: z.number(),
    }),
  }),
  z.object({
    type: z.literal('image'),
    file: z.object({
      base64: z.string(),
      type: z.enum(['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
      originalSize: z.number(),
      dimensions: z
        .object({
          width: z.number(),
          height: z.number(),
        })
        .optional(),
    }),
  }),
  z.object({
    type: z.literal('notebook'),
    file: z.object({
      filePath: z.string(),
      cells: z.array(
        z.object({
          id: z.string(),
          type: z.enum(['code', 'markdown']),
          source: z.string(),
          outputs: z.array(z.unknown()).optional(),
        })
      ),
    }),
  }),
  z.object({
    type: z.literal('pdf'),
    file: z.object({
      filePath: z.string(),
      base64: z.string(),
      originalSize: z.number(),
    }),
  }),
]);

// ============================================
// Helper Functions
// ============================================

/**
 * Get MIME type for image extension.
 */
function getImageMimeType(filePath: string): ImageMimeType {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

/**
 * Format content with line numbers (cat -n format).
 */
function formatWithLineNumbers(
  content: string,
  startLine: number
): { formatted: string; numLines: number } {
  const lines = content.split('\n');
  const numLines = lines.length;

  const formatted = lines
    .map((line, index) => {
      const lineNum = startLine + index;
      // Truncate long lines
      const truncatedLine =
        line.length > MAX_LINE_LENGTH ? line.substring(0, MAX_LINE_LENGTH) + '...' : line;
      // Format: spaces + line number + tab + content
      return `${String(lineNum).padStart(6)}\t${truncatedLine}`;
    })
    .join('\n');

  return { formatted, numLines };
}

/**
 * Parse Jupyter notebook cells.
 */
function parseNotebookCells(content: string): NotebookCell[] {
  try {
    const notebook = JSON.parse(content);
    const cells: NotebookCell[] = [];

    if (notebook.cells && Array.isArray(notebook.cells)) {
      for (let i = 0; i < notebook.cells.length; i++) {
        const cell = notebook.cells[i];
        cells.push({
          id: cell.id || `cell_${i}`,
          type: cell.cell_type === 'code' ? 'code' : 'markdown',
          source: Array.isArray(cell.source) ? cell.source.join('') : cell.source || '',
          outputs: cell.outputs,
        });
      }
    }

    return cells;
  } catch {
    return [];
  }
}

// ============================================
// Read Tool
// ============================================

/**
 * Read tool implementation.
 * Original: v5 (ReadTool) in chunks.86.mjs:561-827
 */
export const ReadTool = createTool<ReadInput, ReadOutput>({
  name: TOOL_NAMES.READ,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid.`;
  },

  async prompt() {
    return `Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${DEFAULT_LINE_LIMIT} lines starting from the beginning
- You can optionally specify a line offset and limit for long files
- Any lines longer than ${MAX_LINE_LENGTH} characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows reading images (PNG, JPG, etc), PDFs, and Jupyter notebooks`;
  },

  inputSchema: readInputSchema,
  outputSchema: readOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return true;
  },

  isReadOnly() {
    return true;
  },

  isSearchOrReadCommand() {
    return { isSearch: false, isRead: true };
  },

  getPath(input) {
    return input.file_path;
  },

  async checkPermissions(input) {
    // Check permission denied paths
    if (isPermissionDeniedPath(input.file_path)) {
      return permissionDeny(`Access to ${input.file_path} is not allowed for security reasons`);
    }
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const filePath = resolve(input.file_path);

    // Check permission denied paths (errorCode: 1)
    if (isPermissionDeniedPath(filePath)) {
      return validationError(
        `Access to ${filePath} is not allowed for security reasons`,
        1
      );
    }

    // Allow UNC paths without existence check
    if (isUncPath(filePath)) {
      return validationSuccess();
    }

    // Check file existence (errorCode: 2)
    if (!existsSync(filePath)) {
      return validationError(`File not found: ${filePath}`, 2);
    }

    // Reject binary files (errorCode: 4)
    if (isBinaryExtension(filePath) && !isImageExtension(filePath) && !isPdfExtension(filePath)) {
      return validationError(
        `Cannot read binary file: ${filePath}. Only text, image, PDF, and notebook files are supported.`,
        4
      );
    }

    // Check file size (errorCode: 6)
    try {
      const stats = await stat(filePath);
      if (stats.size > MAX_FILE_SIZE && !isImageExtension(filePath) && !isPdfExtension(filePath)) {
        return validationError(
          `File too large: ${filePath} (${stats.size} bytes). Maximum size is ${MAX_FILE_SIZE} bytes.`,
          6
        );
      }
    } catch {
      // Ignore stat errors
    }

    return validationSuccess();
  },

  async call(input, context) {
    const filePath = resolve(input.file_path);
    const offset = input.offset ?? 1;
    const limit = input.limit ?? DEFAULT_LINE_LIMIT;

    try {
      // Handle images
      if (isImageExtension(filePath)) {
        const buffer = await readFile(filePath);
        const stats = await stat(filePath);

        // Check for empty image (errorCode: 5)
        if (stats.size === 0) {
          return toolError('Empty image file', 5);
        }

        const result: ReadImageOutput = {
          type: 'image',
          file: {
            base64: buffer.toString('base64'),
            type: getImageMimeType(filePath),
            originalSize: stats.size,
          },
        };

        // Store read state for edit validation
        context.readFileState.set(filePath, {
          content: '',
          timestamp: Date.now(),
          totalLines: 0,
        });

        return toolSuccess(result);
      }

      // Handle PDFs
      if (isPdfExtension(filePath)) {
        const buffer = await readFile(filePath);
        const stats = await stat(filePath);

        const result: ReadPdfOutput = {
          type: 'pdf',
          file: {
            filePath,
            base64: buffer.toString('base64'),
            originalSize: stats.size,
          },
        };

        return toolSuccess(result);
      }

      // Handle Jupyter notebooks
      if (isNotebookExtension(filePath)) {
        const content = await readFile(filePath, 'utf-8');
        const cells = parseNotebookCells(content);

        const result: ReadNotebookOutput = {
          type: 'notebook',
          file: {
            filePath,
            cells,
          },
        };

        // Store read state
        context.readFileState.set(filePath, {
          content,
          timestamp: Date.now(),
          totalLines: content.split('\n').length,
        });

        return toolSuccess(result);
      }

      // Handle text files
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const totalLines = lines.length;

      // Apply offset and limit
      const startIndex = Math.max(0, offset - 1);
      const endIndex = Math.min(lines.length, startIndex + limit);
      const selectedLines = lines.slice(startIndex, endIndex);
      const selectedContent = selectedLines.join('\n');

      // Format with line numbers
      const { formatted, numLines } = formatWithLineNumbers(selectedContent, offset);

      const result: ReadTextOutput = {
        type: 'text',
        file: {
          filePath,
          content: formatted,
          numLines,
          startLine: offset,
          totalLines,
        },
      };

      // Store read state for edit validation
      context.readFileState.set(filePath, {
        content,
        timestamp: Date.now(),
        totalLines,
      });

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Failed to read file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.type === 'text') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: result.file.content,
      };
    }

    if (result.type === 'image') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: result.file.type,
              data: result.file.base64,
            },
          },
        ],
      };
    }

    if (result.type === 'notebook') {
      const cellsText = result.file.cells
        .map((cell, i) => `[Cell ${i + 1} (${cell.type})]:\n${cell.source}`)
        .join('\n\n');
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: cellsText,
      };
    }

    if (result.type === 'pdf') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `PDF file: ${result.file.filePath} (${result.file.originalSize} bytes)`,
      };
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: JSON.stringify(result),
    };
  },
});

// ============================================
// Export
// ============================================

export { ReadTool };
