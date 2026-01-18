/**
 * @claudecode/tools - Glob Tool
 *
 * Fast file pattern matching tool.
 * Returns matching file paths sorted by modification time.
 *
 * Reconstructed from chunks.115.mjs:1971-2069
 */

import { stat } from 'fs/promises';
import { existsSync, statSync, readdirSync } from 'fs';
import { resolve, join, relative } from 'path';
import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { GlobInput, GlobOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;
const MAX_FILES = 100;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Glob tool input schema.
 * Original: ju5 in chunks.115.mjs:1963-1966
 */
const globInputSchema = z.object({
  pattern: z.string().describe('The glob pattern to match files against'),
  path: z
    .string()
    .optional()
    .describe('The directory to search in. If not specified, uses current working directory.'),
});

/**
 * Glob tool output schema.
 * Original: Tu5 in chunks.115.mjs:1966-1971
 */
const globOutputSchema = z.object({
  durationMs: z.number(),
  numFiles: z.number(),
  filenames: z.array(z.string()),
  truncated: z.boolean(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Convert glob pattern to regex.
 */
function globToRegex(pattern: string): RegExp {
  // Escape special regex characters except glob wildcards
  let regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '<<<GLOBSTAR>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .replace(/<<<GLOBSTAR>>>/g, '.*');

  return new RegExp(`^${regex}$`);
}

/**
 * Recursively find files matching a glob pattern.
 */
function findFilesRecursively(
  dir: string,
  pattern: RegExp,
  baseDir: string,
  results: { path: string; mtime: number }[],
  maxFiles: number
): void {
  if (results.length >= maxFiles) return;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (results.length >= maxFiles) break;

      const fullPath = join(dir, entry.name);
      const relativePath = relative(baseDir, fullPath);

      // Skip hidden files and common ignore patterns
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        findFilesRecursively(fullPath, pattern, baseDir, results, maxFiles);
      } else if (entry.isFile()) {
        if (pattern.test(relativePath) || pattern.test(entry.name)) {
          try {
            const stats = statSync(fullPath);
            results.push({ path: relativePath, mtime: stats.mtimeMs });
          } catch {
            // Skip files we can't stat
          }
        }
      }
    }
  } catch {
    // Skip directories we can't read
  }
}

// ============================================
// Glob Tool
// ============================================

/**
 * Glob tool implementation.
 * Original: as (GlobTool) in chunks.115.mjs:1971-2069
 */
export const GlobTool = createTool<GlobInput, GlobOutput>({
  name: TOOL_NAMES.GLOB,
  maxResultSizeChars: MAX_RESULT_SIZE,

  async description() {
    return `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns`;
  },

  async prompt() {
    return `Glob patterns:
- * matches any characters except /
- ** matches any characters including /
- ? matches a single character
- [abc] matches any character in the set

Examples:
- "**/*.ts" - all TypeScript files
- "src/**/*.tsx" - all TSX files in src
- "*.json" - JSON files in current directory`;
  },

  inputSchema: globInputSchema,
  outputSchema: globOutputSchema,

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
    return { isSearch: true, isRead: false };
  },

  async checkPermissions(input) {
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    if (input.path) {
      const searchPath = resolve(input.path);

      // Check path exists (errorCode: 1)
      if (!existsSync(searchPath)) {
        return validationError(`Path not found: ${searchPath}`, 1);
      }

      // Check path is a directory (errorCode: 2)
      const stats = statSync(searchPath);
      if (!stats.isDirectory()) {
        return validationError(`Path is not a directory: ${searchPath}`, 2);
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    const startTime = Date.now();
    const searchPath = input.path ? resolve(input.path) : context.getCwd();
    const pattern = globToRegex(input.pattern);

    try {
      const results: { path: string; mtime: number }[] = [];
      findFilesRecursively(searchPath, pattern, searchPath, results, MAX_FILES + 1);

      // Sort by modification time (newest first)
      results.sort((a, b) => b.mtime - a.mtime);

      // Check truncation
      const truncated = results.length > MAX_FILES;
      const filenames = results.slice(0, MAX_FILES).map((r) => r.path);

      const durationMs = Date.now() - startTime;

      const result: GlobOutput = {
        durationMs,
        numFiles: filenames.length,
        filenames,
        truncated,
      };

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Glob search failed: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    let content = result.filenames.join('\n');
    if (result.truncated) {
      content += `\n\n(truncated to ${MAX_FILES} files)`;
    }
    if (result.numFiles === 0) {
      content = 'No files found matching the pattern.';
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content,
    };
  },
});

// ============================================
// Export
// ============================================

export { GlobTool };
