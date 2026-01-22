/**
 * @claudecode/tools - Write Tool
 *
 * Writes files to the local filesystem.
 * Enforces read-before-write pattern for existing files.
 *
 * Reconstructed from chunks.115.mjs:1269-1442
 */

import { writeFile, readFile, stat, mkdir } from 'fs/promises';
import { existsSync, readFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
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
} from './base.js';
import type { WriteInput, WriteOutput, Patch, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Write tool input schema.
 * Original: Lu5 in chunks.115.mjs:1260-1263
 */
const writeInputSchema = z.object({
  file_path: z.string().describe('The absolute path to the file to write (must be absolute, not relative)'),
  content: z.string().describe('The content to write to the file'),
});

/**
 * Write tool output schema.
 * Original: o$0 in chunks.115.mjs:1263-1269
 */
const writeOutputSchema = z.object({
  type: z.enum(['create', 'update']).describe("Whether a new file was created or an existing file was updated"),
  filePath: z.string().describe("The path to the file that was written"),
  content: z.string().describe("The content that was written to the file"),
  structuredPatch: z.array(z.any()).describe("Diff patch showing the changes"),
  originalFile: z.string().nullable().describe("The original file content before the write (null for new files)"),
});

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

// ============================================
// Write Tool
// ============================================

/**
 * Write tool implementation.
 * Original: X$ (WriteTool) in chunks.115.mjs:1269-1442
 */
export const WriteTool = createTool<WriteInput, WriteOutput>({
  name: TOOL_NAMES.WRITE,
  maxResultSizeChars: 100000,
  strict: true,

  async description() {
    return `Writes a file to the local filesystem.`;
  },

  async prompt() {
    // Original: QCB in chunks.115.mjs:1283
    return `Usage:
- This tool will overwrite the existing file if there is one at the provided path.
- If this is an existing file, you MUST use the Read tool first to read the file's contents. This tool will fail if you did not read the file first.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`;
  },

  inputSchema: writeInputSchema,
  outputSchema: writeOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return false;
  },

  isReadOnly() {
    return false;
  },

  getPath(input) {
    return input.file_path;
  },

  async checkPermissions(input, context) {
    // Original: chunks.115.mjs:1302 (calls g6A)
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    // Original: chunks.115.mjs:1308-1336
    const filePath = resolve(input.file_path);
    const appState = await context.getAppState();

    // errorCode: 1 - Permission denied
    if (isPermissionDeniedPath(filePath)) {
      return validationError("File is in a directory that is denied by your permission settings.", 1);
    }

    if (!existsSync(filePath)) return validationSuccess();

    // errorCode: 2 - Not read yet
    const readRecord = context.readFileState.get(filePath);
    if (!readRecord) {
      return validationError("File has not been read yet. Read it first before writing to it.", 2);
    }

    // errorCode: 3 - Modified since read
    if (getFileModifiedTime(filePath) > readRecord.timestamp) {
      return validationError("File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.", 3);
    }

    return validationSuccess();
  },

  async call(input, context, toolUseId, metadata, progressCallback) {
    // Original: chunks.115.mjs:1338-1422
    const filePath = resolve(input.file_path);
    const newContent = input.content;

    try {
      // Hook beforeFileEdited
      // await Ec.beforeFileEdited(filePath);

      const exists = existsSync(filePath);
      const originalContent = exists ? readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n') : null;

      // Runtime check (Original: chunks.115.mjs:1350)
      if (exists) {
        const currentMtime = getFileModifiedTime(filePath);
        const readRecord = context.readFileState.get(filePath);
        if (!readRecord || currentMtime > readRecord.timestamp) {
          if (!(readRecord && readRecord.offset === undefined && readRecord.limit === undefined && originalContent === readRecord.content)) {
            throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
          }
        }
      }

      // await ps(context.updateFileHistoryState, filePath, metadata.uuid);

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, newContent, 'utf8');

      // Update state
      context.readFileState.set(filePath, {
        content: newContent,
        timestamp: getFileModifiedTime(filePath),
        totalLines: newContent.split('\n').length,
        offset: undefined,
        limit: undefined
      });

      return toolSuccess({
        type: exists ? 'update' : 'create',
        filePath,
        content: newContent,
        structuredPatch: [], // Simplified
        originalFile: originalContent
      });
    } catch (error) {
      return toolError(`Failed to write file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // Original: chunks.115.mjs:1424-1441
    if (result.type === 'create') {
      return {
        tool_use_id: toolUseId,
        type: "tool_result",
        content: `File created successfully at: ${result.filePath}`
      };
    }
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: `The file ${result.filePath} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:\n${result.content.slice(0, 1000)}`
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: WriteTool 已在声明处导出；避免重复导出。
