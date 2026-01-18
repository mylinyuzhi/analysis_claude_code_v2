/**
 * @claudecode/tools - Write Tool
 *
 * Writes files to the local filesystem.
 * Enforces read-before-write pattern for existing files.
 *
 * Reconstructed from chunks.115.mjs:1269-1442
 */

import { writeFile, readFile, stat, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
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
  file_path: z.string().describe('The absolute path to the file to write (must be absolute)'),
  content: z.string().describe('The content to write to the file'),
});

/**
 * Write tool output schema.
 * Original: o$0 in chunks.115.mjs:1263-1269
 */
const writeOutputSchema = z.object({
  type: z.enum(['create', 'update']),
  filePath: z.string(),
  content: z.string(),
  structuredPatch: z.array(
    z.object({
      oldStart: z.number(),
      oldLines: z.number(),
      newStart: z.number(),
      newLines: z.number(),
      lines: z.array(z.string()),
    })
  ),
  originalFile: z.string().nullable(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Get file modification time.
 */
async function getFileModificationTime(filePath: string): Promise<number> {
  try {
    const stats = await stat(filePath);
    return stats.mtimeMs;
  } catch {
    return 0;
  }
}

/**
 * Create a simple diff patch.
 */
function createSimplePatch(original: string | null, newContent: string): Patch[] {
  if (original === null) {
    // New file - entire content is addition
    const lines = newContent.split('\n');
    return [
      {
        oldStart: 0,
        oldLines: 0,
        newStart: 1,
        newLines: lines.length,
        lines: lines.map((line) => `+${line}`),
      },
    ];
  }

  const oldLines = original.split('\n');
  const newLines = newContent.split('\n');

  // Simple diff - show all changes
  const patches: Patch[] = [];

  if (original !== newContent) {
    patches.push({
      oldStart: 1,
      oldLines: oldLines.length,
      newStart: 1,
      newLines: newLines.length,
      lines: [
        ...oldLines.map((line) => `-${line}`),
        ...newLines.map((line) => `+${line}`),
      ],
    });
  }

  return patches;
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
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.
- If this is an existing file, you MUST use the Read tool first to read the file's contents. This tool will fail if you did not read the file first.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.`;
  },

  async prompt() {
    return `Writing files:
- The file_path parameter must be an absolute path
- Parent directories will be created if they don't exist
- Existing files require reading first to prevent accidental overwrites
- The tool returns a diff showing what changed`;
  },

  inputSchema: writeInputSchema,
  outputSchema: writeOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return false; // File writes must be sequential
  },

  isReadOnly() {
    return false; // Modifies files
  },

  getPath(input) {
    return input.file_path;
  },

  async checkPermissions(input) {
    if (isPermissionDeniedPath(input.file_path)) {
      return permissionDeny(`Writing to ${input.file_path} is not allowed for security reasons`);
    }
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const filePath = resolve(input.file_path);

    // Check permission denied paths (errorCode: 1)
    if (isPermissionDeniedPath(filePath)) {
      return validationError(
        `Writing to ${filePath} is not allowed for security reasons`,
        1
      );
    }

    // If file exists, check it was read first (errorCode: 2)
    if (existsSync(filePath)) {
      const readState = context.readFileState.get(filePath);
      if (!readState) {
        return validationError(
          'File has not been read yet. Read it first before writing to it.',
          2
        );
      }

      // Check file hasn't been modified since read (errorCode: 3)
      const currentMtime = await getFileModificationTime(filePath);
      if (currentMtime > readState.timestamp) {
        return validationError(
          'File has been modified since it was read. Read it again before writing.',
          3
        );
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    const filePath = resolve(input.file_path);
    const newContent = input.content;

    try {
      // Get original content if file exists
      let originalContent: string | null = null;
      let isCreate = true;

      if (existsSync(filePath)) {
        originalContent = await readFile(filePath, 'utf-8');
        isCreate = false;
      }

      // Create parent directories if needed
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      // Write the file
      await writeFile(filePath, newContent, 'utf-8');

      // Create diff patch
      const structuredPatch = createSimplePatch(originalContent, newContent);

      // Update read state
      context.readFileState.set(filePath, {
        content: newContent,
        timestamp: Date.now(),
        totalLines: newContent.split('\n').length,
      });

      const result: WriteOutput = {
        type: isCreate ? 'create' : 'update',
        filePath,
        content: newContent,
        structuredPatch,
        originalFile: originalContent,
      };

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Failed to write file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    const action = result.type === 'create' ? 'Created' : 'Updated';
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: `${action} file: ${result.filePath}`,
    };
  },
});

// ============================================
// Export
// ============================================

export { WriteTool };
