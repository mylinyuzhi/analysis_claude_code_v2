/**
 * @claudecode/tools - Edit Tool
 *
 * Performs exact string replacements in files.
 * Enforces read-before-write and uniqueness constraints.
 *
 * Reconstructed from chunks.115.mjs:779-1056
 */

import { writeFile, readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
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
  isNotebookExtension,
} from './base.js';
import type { EditInput, EditOutput, Patch, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Edit tool input schema.
 * Original: xy2 in chunks.115.mjs:794
 */
const editInputSchema = z.object({
  file_path: z.string().describe('The absolute path to the file to modify'),
  old_string: z.string().describe('The text to replace'),
  new_string: z.string().describe('The text to replace it with (must be different from old_string)'),
  replace_all: z
    .boolean()
    .optional()
    .default(false)
    .describe('Replace all occurrences of old_string (default false)'),
});

/**
 * Edit tool output schema.
 * Original: KW1 in chunks.115.mjs
 */
const editOutputSchema = z.object({
  filePath: z.string(),
  oldString: z.string(),
  newString: z.string(),
  originalFile: z.string(),
  structuredPatch: z.array(
    z.object({
      oldStart: z.number(),
      oldLines: z.number(),
      newStart: z.number(),
      newLines: z.number(),
      lines: z.array(z.string()),
    })
  ),
  userModified: z.boolean(),
  replaceAll: z.boolean(),
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
 * Count occurrences of a string in content.
 */
function countOccurrences(content: string, search: string): number {
  if (!search) return 0;
  let count = 0;
  let position = 0;
  while ((position = content.indexOf(search, position)) !== -1) {
    count++;
    position += search.length;
  }
  return count;
}

/**
 * Create a diff patch for the edit.
 */
function createEditPatch(
  original: string,
  edited: string,
  oldString: string,
  newString: string
): Patch[] {
  const originalLines = original.split('\n');
  const editedLines = edited.split('\n');

  // Find the first difference
  let startLine = 0;
  while (
    startLine < originalLines.length &&
    startLine < editedLines.length &&
    originalLines[startLine] === editedLines[startLine]
  ) {
    startLine++;
  }

  // Find the last difference
  let endOld = originalLines.length - 1;
  let endNew = editedLines.length - 1;
  while (
    endOld > startLine &&
    endNew > startLine &&
    originalLines[endOld] === editedLines[endNew]
  ) {
    endOld--;
    endNew--;
  }

  // Extract changed lines
  const oldChangedLines = originalLines.slice(startLine, endOld + 1);
  const newChangedLines = editedLines.slice(startLine, endNew + 1);

  return [
    {
      oldStart: startLine + 1,
      oldLines: oldChangedLines.length,
      newStart: startLine + 1,
      newLines: newChangedLines.length,
      lines: [
        ...oldChangedLines.map((line) => `-${line}`),
        ...newChangedLines.map((line) => `+${line}`),
      ],
    },
  ];
}

// ============================================
// Edit Tool
// ============================================

/**
 * Edit tool implementation.
 * Original: J$ (EditTool) in chunks.115.mjs:779-1056
 */
export const EditTool = createTool<EditInput, EditOutput>({
  name: TOOL_NAMES.EDIT,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `Performs exact string replacements in files.

Usage:
- You must use your Read tool at least once in the conversation before editing.
- The edit will FAIL if old_string is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use replace_all to change every instance.
- Use replace_all for replacing and renaming strings across the file.`;
  },

  async prompt() {
    return `When editing text from Read tool output, ensure you preserve the exact indentation.
- ALWAYS prefer editing existing files in the codebase
- Only use emojis if the user explicitly requests it
- The old_string must exist in the file exactly as written`;
  },

  inputSchema: editInputSchema,
  outputSchema: editOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return false; // File edits must be sequential
  },

  isReadOnly() {
    return false; // Modifies files
  },

  getPath(input) {
    return input.file_path;
  },

  async checkPermissions(input) {
    if (isPermissionDeniedPath(input.file_path)) {
      return permissionDeny(`Editing ${input.file_path} is not allowed for security reasons`);
    }
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const filePath = resolve(input.file_path);
    const { old_string, new_string, replace_all } = input;

    // Check old_string !== new_string (errorCode: 1)
    if (old_string === new_string) {
      return validationError(
        'old_string and new_string must be different',
        1
      );
    }

    // Check permission denied paths (errorCode: 2)
    if (isPermissionDeniedPath(filePath)) {
      return validationError(
        `Editing ${filePath} is not allowed for security reasons`,
        2
      );
    }

    // Handle file creation when old_string === "" (errorCode: 3)
    if (old_string === '') {
      if (!existsSync(filePath)) {
        // This is a file creation
        return validationSuccess();
      }
      return validationError(
        'Cannot use empty old_string on existing file. Use Write tool for creating new files.',
        3
      );
    }

    // Check file existence (errorCode: 4)
    if (!existsSync(filePath)) {
      return validationError(`File not found: ${filePath}`, 4);
    }

    // Check not Jupyter notebook (errorCode: 5)
    if (isNotebookExtension(filePath)) {
      return validationError(
        'Cannot use Edit tool on Jupyter notebooks. Use NotebookEdit tool instead.',
        5
      );
    }

    // Check file was read first (errorCode: 6)
    const readState = context.readFileState.get(filePath);
    if (!readState) {
      return validationError(
        'File has not been read yet. Read it first before editing.',
        6
      );
    }

    // Check file not modified since read (errorCode: 7)
    const currentMtime = await getFileModificationTime(filePath);
    if (currentMtime > readState.timestamp) {
      return validationError(
        'File has been modified since it was read. Read it again before editing.',
        7
      );
    }

    // Read current content for validation
    const content = await readFile(filePath, 'utf-8');

    // Check old_string found in file (errorCode: 8)
    if (!content.includes(old_string)) {
      return validationError(
        `old_string not found in file. Make sure to copy the exact text from the file.`,
        8
      );
    }

    // Check old_string is unique unless replace_all (errorCode: 9)
    if (!replace_all) {
      const occurrences = countOccurrences(content, old_string);
      if (occurrences > 1) {
        return validationError(
          `old_string found ${occurrences} times in file. Set replace_all: true or provide more context to make it unique.`,
          9
        );
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    const filePath = resolve(input.file_path);
    const { old_string, new_string, replace_all } = input;

    try {
      // Handle file creation
      if (old_string === '' && !existsSync(filePath)) {
        await writeFile(filePath, new_string, 'utf-8');

        context.readFileState.set(filePath, {
          content: new_string,
          timestamp: Date.now(),
          totalLines: new_string.split('\n').length,
        });

        const result: EditOutput = {
          filePath,
          oldString: old_string,
          newString: new_string,
          originalFile: '',
          structuredPatch: [
            {
              oldStart: 0,
              oldLines: 0,
              newStart: 1,
              newLines: new_string.split('\n').length,
              lines: new_string.split('\n').map((line) => `+${line}`),
            },
          ],
          userModified: false,
          replaceAll: replace_all ?? false,
        };

        return toolSuccess(result);
      }

      // Read original content
      const originalContent = await readFile(filePath, 'utf-8');

      // Perform replacement
      let editedContent: string;
      if (replace_all) {
        editedContent = originalContent.split(old_string).join(new_string);
      } else {
        editedContent = originalContent.replace(old_string, new_string);
      }

      // Write edited content
      await writeFile(filePath, editedContent, 'utf-8');

      // Create patch
      const structuredPatch = createEditPatch(
        originalContent,
        editedContent,
        old_string,
        new_string
      );

      // Update read state
      context.readFileState.set(filePath, {
        content: editedContent,
        timestamp: Date.now(),
        totalLines: editedContent.split('\n').length,
      });

      const result: EditOutput = {
        filePath,
        oldString: old_string,
        newString: new_string,
        originalFile: originalContent,
        structuredPatch,
        userModified: false,
        replaceAll: replace_all ?? false,
      };

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Failed to edit file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: `The file ${result.filePath} has been updated successfully.`,
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: EditTool 已在声明处导出；避免重复导出。
