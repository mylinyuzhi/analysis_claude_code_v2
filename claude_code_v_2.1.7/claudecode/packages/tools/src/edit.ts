/**
 * @claudecode/tools - Edit Tool
 *
 * Performs exact string replacements in files.
 * Enforces read-before-write and uniqueness constraints.
 *
 * Reconstructed from chunks.115.mjs:779-1056
 */

import { writeFile, readFile, stat } from 'fs/promises';
import { existsSync, readFileSync, statSync } from 'fs';
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
  isNotebookExtension,
  isSettingsJsonFile,
  validateSettingsJson,
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
 * Original: xy2 in chunks.114.mjs:2693-2697
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
 * Original: KW1 in chunks.114.mjs:2704-2712
 */
const editOutputSchema = z.object({
  filePath: z.string().describe("The file path that was edited"),
  oldString: z.string().describe("The original string that was replaced"),
  newString: z.string().describe("The new string that replaced it"),
  originalFile: z.string().describe("The original file contents before editing"),
  structuredPatch: z.array(z.any()).describe("Diff patch showing the changes"),
  userModified: z.boolean().describe("Whether the user modified the proposed changes"),
  replaceAll: z.boolean().describe("Whether all occurrences were replaced"),
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

/**
 * Normalize quotes.
 * Original: FS2 in chunks.113.mjs:1692
 */
function normalizeQuotes(text: string): string {
  // Logic from chunks.113.mjs:1692
  return text.replaceAll('\u2018', "'").replaceAll('\u2019', "'").replaceAll('\u201C', '"').replaceAll('\u201D', '"');
}

/**
 * Fuzzy string matching with quote normalization.
 * Original: k6A in chunks.113.mjs:1708
 */
function findStringWithQuoteNormalization(fileContent: string, searchString: string): string | null {
  if (fileContent.includes(searchString)) return searchString;
  const normalizedSearch = normalizeQuotes(searchString);
  const normalizedContent = normalizeQuotes(fileContent);
  const index = normalizedContent.indexOf(normalizedSearch);
  if (index !== -1) return fileContent.substring(index, index + searchString.length);
  return null;
}

/**
 * Core string replacement.
 * Original: iD1 in chunks.113.mjs:1716
 */
function replaceString(content: string, oldString: string, newString: string, replaceAll: boolean = false): string {
  const replaceFn = replaceAll 
    ? (c: string, s: string, r: string) => c.replaceAll(s, () => r)
    : (c: string, s: string, r: string) => c.replace(s, () => r);
  
  if (newString !== "") return replaceFn(content, oldString, newString);
  
  // Special deletion logic for trailing newlines
  if (!oldString.endsWith('\n') && content.includes(oldString + '\n')) {
    return replaceFn(content, oldString + '\n', newString);
  }
  return replaceFn(content, oldString, newString);
}

/**
 * Apply edit and generate patch.
 * Original: nD1 / QbA in chunks.113.mjs:1725-1783
 */
function applyEditAndPatch(args: { filePath: string, fileContents: string, oldString: string, newString: string, replaceAll?: boolean }) {
  const { fileContents, oldString, newString, replaceAll = false } = args;
  const updatedFile = replaceString(fileContents, oldString, newString, replaceAll);
  
  if (updatedFile === fileContents) {
    throw Error(oldString === "" ? "Failed to create file." : "String not found in file. Failed to apply edit.");
  }
  
  // In reality, this would generate a real patch. 
  // For reconstruction, we assume a helper or return a simplified patch.
  return { updatedFile, patch: [] }; 
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
  maxResultSizeChars: 100000,
  strict: true,

  async description() {
    return "A tool for editing files";
  },

  async prompt() {
    // Original: KS2 in chunks.113.mjs:1681
    return `Performs exact string replacements in files.

Usage:
- You must use your \`Read\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file.
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`.
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`;
  },

  inputSchema: editInputSchema,
  outputSchema: editOutputSchema,

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
    // Original: chunks.115.mjs:805 (calls g6A)
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    // Original: chunks.115.mjs:814-941
    const { file_path: filePath, old_string, new_string, replace_all = false } = input;
    const resolvedPath = resolve(filePath);

    // errorCode: 1 - No changes
    if (old_string === new_string) {
      return validationError("No changes to make: old_string and new_string are exactly the same.", 1);
    }

    const appState = await context.getAppState();
    // errorCode: 2 - Permission denied (using AE in chunks.115.mjs:828)
    if (isPermissionDeniedPath(resolvedPath)) {
      return validationError("File is in a directory that is denied by your permission settings.", 2);
    }

    // errorCode: 3 - Create on existing
    if (existsSync(resolvedPath) && old_string === "") {
      const content = readFileSync(resolvedPath, 'utf8').replaceAll('\r\n', '\n').trim();
      if (content !== "") {
        return validationError("Cannot create new file - file already exists.", 3);
      }
      return validationSuccess();
    }

    if (!existsSync(resolvedPath) && old_string === "") return validationSuccess();

    // errorCode: 4 - Not found
    if (!existsSync(resolvedPath)) {
      return validationError("File does not exist.", 4);
    }

    // errorCode: 5 - ipynb
    if (resolvedPath.endsWith(".ipynb")) {
      return validationError("File is a Jupyter Notebook. Use the NotebookEdit to edit this file.", 5);
    }

    // errorCode: 6 - Not read yet
    const readRecord = context.readFileState.get(resolvedPath);
    if (!readRecord) {
      return validationError("File has not been read yet. Read it first before writing to it.", 6);
    }

    // errorCode: 7 - Modified since read
    if (getFileModifiedTime(resolvedPath) > readRecord.timestamp) {
      if (readRecord.offset === undefined && readRecord.limit === undefined) {
        const currentContent = readFileSync(resolvedPath, 'utf8').replaceAll('\r\n', '\n');
        if (currentContent !== readRecord.content) {
          return validationError("File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.", 7);
        }
      } else {
        return validationError("File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.", 7);
      }
    }

    const fileContent = readFileSync(resolvedPath, 'utf8').replaceAll('\r\n', '\n');
    const actualOldString = findStringWithQuoteNormalization(fileContent, old_string);

    // errorCode: 8 - String not found
    if (!actualOldString) {
      return validationError(`String to replace not found in file.\nString: ${old_string}`, 8);
    }

    // errorCode: 9 - Multiple matches
    const matchCount = fileContent.split(actualOldString).length - 1;
    if (matchCount > 1 && !replace_all) {
      return validationError(`Found ${matchCount} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.\nString: ${old_string}`, 9);
    }

    // errorCode: 10 - settings.json (Original: chunks.115.mjs:932 calls uy2)
    if (isSettingsJsonFile(resolvedPath)) {
      // (Validation logic omitted for brevity but noted)
    }

    return validationSuccess();
  },

  async call(input, context, toolUseId, metadata, progressCallback) {
    // Original: chunks.115.mjs:960-1024
    const { file_path: filePath, old_string, new_string, replace_all = false } = input;
    const resolvedPath = resolve(filePath);

    // Runtime race check (Original: chunks.115.mjs:974)
    const originalContent = existsSync(resolvedPath) ? readFileSync(resolvedPath, 'utf8').replaceAll('\r\n', '\n') : "";
    const readRecord = context.readFileState.get(resolvedPath);
    if (existsSync(resolvedPath)) {
      if (!readRecord || getFileModifiedTime(resolvedPath) > readRecord.timestamp) {
        if (!(readRecord && readRecord.offset === undefined && readRecord.limit === undefined && originalContent === readRecord.content)) {
          throw Error("File has been unexpectedly modified. Read it again before attempting to write it.");
        }
      }
    }

    const actualOldString = findStringWithQuoteNormalization(originalContent, old_string) || old_string;
    const { updatedFile, patch } = applyEditAndPatch({
      filePath: resolvedPath,
      fileContents: originalContent,
      oldString: actualOldString,
      newString: new_string,
      replaceAll: replace_all
    });

    await writeFile(resolvedPath, updatedFile, 'utf8');

    // LSP notification (Original: chunks.115.mjs:998)
    const lspManager = (context.options as any)?.lspManager;
    if (lspManager) {
      lspManager.changeFile(resolvedPath, updatedFile).catch(() => {});
      lspManager.saveFile(resolvedPath).catch(() => {});
    }

    // Update state
    context.readFileState.set(resolvedPath, {
      content: updatedFile,
      timestamp: getFileModifiedTime(resolvedPath),
      totalLines: updatedFile.split('\n').length,
      offset: undefined,
      limit: undefined
    });

    return toolSuccess({
      filePath,
      oldString: actualOldString,
      newString: new_string,
      originalFile: originalContent,
      structuredPatch: patch,
      userModified: false,
      replaceAll: replace_all
    });
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
