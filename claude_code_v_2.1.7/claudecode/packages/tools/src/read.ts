/**
 * @claudecode/tools - Read Tool
 *
 * Reads files from the local filesystem.
 * Supports text files, images, PDFs, and Jupyter notebooks.
 *
 * Reconstructed from chunks.86.mjs:561-827
 */

import { readFile, stat } from 'fs/promises';
import { existsSync, statSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';
import { z } from 'zod';
import { execSync } from 'child_process';
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

// Image processing constants
// Original: JY0 in chunks.86.mjs
const MAX_IMAGE_DIMENSION = 1568;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB for base64 encoding
const IMAGE_QUALITY = 80;

// PDF processing constants
// Original: YEB in chunks.86.mjs
const MAX_PDF_PAGES = 50;
const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

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
 * Get file modification time.
 * Original: mz in chunks.148.mjs:2692
 */
function getFileModifiedTime(filePath: string): number {
  try {
    return Math.floor(statSync(filePath).mtimeMs);
  } catch {
    return 0;
  }
}

/**
 * Format content with line numbers (cat -n format).
 * Original: Logic similar to chunks.148.mjs:2697
 */
function formatWithLineNumbers(
  content: string,
  startLine: number
): string {
  const lines = content.split('\n');
  return lines
    .map((line, index) => {
      const lineNum = startLine + index;
      const truncatedLine =
        line.length > MAX_LINE_LENGTH ? line.substring(0, MAX_LINE_LENGTH) + '...' : line;
      return `${String(lineNum).padStart(6)}\t${truncatedLine}`;
    })
    .join('\n');
}

/**
 * Read text file with line numbers.
 * Original: L12 in chunks.148.mjs:2697
 */
function readTextFileWithLineNumbers(filePath: string, offset: number = 0, limit?: number) {
  const content = readFileSync(filePath, { encoding: 'utf8' });
  const lines = content.split(/\r?\n/);
  const start = offset === 0 ? 0 : offset - 1;
  const selectedLines = limit !== undefined && lines.length - start > limit 
    ? lines.slice(start, start + limit) 
    : lines.slice(start);
  
  return {
    content: selectedLines.join('\n'),
    lineCount: selectedLines.length,
    totalLines: lines.length
  };
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
  maxResultSizeChars: 100000,
  strict: true,

  async description() {
    // Original: PEB in chunks.86.mjs:573
    return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.`;
  },

  async prompt() {
    // Original: SEB in chunks.86.mjs:576
    return `Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${DEFAULT_LINE_LIMIT} lines starting from the beginning
- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters
- Any lines longer than ${MAX_LINE_LENGTH} characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows you to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually.
- This tool can read PDF files (.pdf). PDFs are processed page by page, extracting both text and visual content for analysis.
- This tool can only read files, not directories. To read a directory, use an ls command via the Bash tool.
- You can call multiple tools in a single response. It is always better to speculatively perform multiple searches in parallel if they are potentially useful.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.`;
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

  async checkPermissions(input, context) {
    // Original: chunks.86.mjs:602 (calls Jr)
    const appState = await context.getAppState();
    // Assuming fileReadPermissionCheck is mapped to Jr
    return permissionAllow(input); // Simplified for now
  },

  async validateInput(input, context) {
    // Original: chunks.86.mjs:612-669
    const filePath = resolve(input.file_path);
    const appState = await context.getAppState();

    // errorCode: 1 - Permission denied
    if (isPermissionDeniedPath(filePath)) {
      return validationError("File is in a directory that is denied by your permission settings.", 1);
    }

    if (isUncPath(filePath)) return validationSuccess();

    // errorCode: 2 - File not found
    if (!existsSync(filePath)) {
      let message = "File does not exist.";
      // (Similar to chunks.86.mjs:629-635)
      return validationError(message, 2);
    }

    // errorCode: 4 - Binary file
    if (isBinaryExtension(filePath) && !isImageExtension(filePath) && !isPdfExtension(filePath)) {
      return validationError(`This tool cannot read binary files. The file appears to be a binary ${extname(filePath)} file. Please use appropriate tools for binary file analysis.`, 4);
    }

    const stats = statSync(filePath);
    // errorCode: 5 - Empty image
    if (stats.size === 0 && isImageExtension(filePath)) {
      return validationError("Empty image files cannot be processed.", 5);
    }

    // errorCode: 6 - File too large
    if (!isImageExtension(filePath) && !isNotebookExtension(filePath) && !isPdfExtension(filePath)) {
      if (stats.size > MAX_FILE_SIZE && !input.offset && !input.limit) {
        // (Similar to chunks.86.mjs:660)
        return validationError("File is too large...", 6);
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    // Original: chunks.86.mjs:671-767
    const filePath = resolve(input.file_path);
    const offset = input.offset ?? 1;
    const limit = input.limit;

    try {
      if (isNotebookExtension(filePath)) {
        // Handle ipynb (Original: chunks.86.mjs:680)
        const content = await readFile(filePath, 'utf-8');
        // Simplified parse and state update
        context.readFileState.set(filePath, {
          content,
          timestamp: getFileModifiedTime(filePath),
          totalLines: content.split('\n').length,
          offset,
          limit
        });
        return toolSuccess({ type: 'notebook', file: { filePath, cells: [] } });
      }

      if (isImageExtension(filePath)) {
        // Handle images (Original: chunks.86.mjs:713)
        const buffer = await readFile(filePath);
        context.readFileState.set(filePath, {
          content: buffer.toString('base64'),
          timestamp: getFileModifiedTime(filePath),
          totalLines: 1,
          offset,
          limit
        });
        return toolSuccess({ type: 'image', file: { base64: buffer.toString('base64'), type: 'image/png', originalSize: buffer.length } });
      }

      // Handle text (Original: chunks.86.mjs:754)
      const { content, totalLines } = readTextFileWithLineNumbers(filePath, offset, limit);
      const formatted = formatWithLineNumbers(content, offset);

      context.readFileState.set(filePath, {
        content,
        timestamp: getFileModifiedTime(filePath),
        totalLines,
        offset,
        limit
      });

      return toolSuccess({
        type: 'text',
        file: {
          filePath,
          content: formatted,
          numLines: content.split('\n').length,
          startLine: offset,
          totalLines
        }
      });
    } catch (error) {
      return toolError(`Failed to read file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // Original: chunks.86.mjs:796-826
    if (result.type === 'text') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: result.file.content,
      };
    }
    // ... other types
    return { tool_use_id: toolUseId, type: 'tool_result', content: JSON.stringify(result) };
  },
});

// ============================================
// Export
// ============================================

// NOTE: ReadTool 已在声明处导出；避免重复导出。
