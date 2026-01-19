/**
 * @claudecode/tools - Grep Tool
 *
 * A powerful search tool built on ripgrep.
 * Supports regex patterns, file type filtering, and context lines.
 *
 * Reconstructed from chunks.115.mjs:1620-1699+
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { GrepInput, GrepOutput, GrepOutputMode, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 20000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Grep tool input schema.
 * Original: Mu5 in chunks.115.mjs:1596-1610
 */
const grepInputSchema = z.object({
  pattern: z.string().describe('The regular expression pattern to search for in file contents'),
  path: z.string().optional().describe('File or directory to search in (defaults to cwd)'),
  glob: z.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}")'),
  output_mode: z
    .enum(['content', 'files_with_matches', 'count'])
    .optional()
    .default('files_with_matches')
    .describe('Output mode: content shows lines, files_with_matches shows paths, count shows counts'),
  '-B': z.number().optional().describe('Number of lines to show before each match'),
  '-A': z.number().optional().describe('Number of lines to show after each match'),
  '-C': z.number().optional().describe('Number of lines to show before and after each match'),
  '-n': z.boolean().optional().default(true).describe('Show line numbers (for content mode)'),
  '-i': z.boolean().optional().describe('Case insensitive search'),
  type: z.string().optional().describe('File type to search (e.g. js, py, rust)'),
  head_limit: z.number().optional().describe('Limit output to first N lines/entries'),
  offset: z.number().optional().describe('Skip first N lines/entries'),
  multiline: z.boolean().optional().describe('Enable multiline mode'),
});

/**
 * Grep tool output schema.
 * Original: _u5 in chunks.115.mjs:1611-1620
 */
const grepOutputSchema = z.object({
  mode: z.enum(['content', 'files_with_matches', 'count']).optional(),
  numFiles: z.number(),
  filenames: z.array(z.string()),
  content: z.string().optional(),
  numLines: z.number().optional(),
  numMatches: z.number().optional(),
  appliedLimit: z.number().optional(),
  appliedOffset: z.number().optional(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Execute ripgrep command.
 */
async function executeRipgrep(
  args: string[],
  cwd: string
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn('rg', args, { cwd, shell: true });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 0 });
    });

    proc.on('error', () => {
      resolve({ stdout, stderr, code: 1 });
    });
  });
}

/**
 * Build ripgrep arguments from input.
 */
function buildRipgrepArgs(input: GrepInput, searchPath: string): string[] {
  const args: string[] = [];

  // Output mode
  if (input.output_mode === 'files_with_matches') {
    args.push('-l');
  } else if (input.output_mode === 'count') {
    args.push('-c');
  }

  // Context lines
  if (input['-B'] !== undefined) args.push('-B', String(input['-B']));
  if (input['-A'] !== undefined) args.push('-A', String(input['-A']));
  if (input['-C'] !== undefined) args.push('-C', String(input['-C']));

  // Options
  if (input['-n'] !== false && input.output_mode === 'content') args.push('-n');
  if (input['-i']) args.push('-i');
  if (input.multiline) args.push('-U', '--multiline-dotall');

  // File type filter
  if (input.type) args.push('--type', input.type);

  // Glob filter
  if (input.glob) args.push('--glob', input.glob);

  // Pattern and path
  args.push('--', input.pattern, searchPath);

  return args;
}

// ============================================
// Grep Tool
// ============================================

/**
 * Grep tool implementation.
 * Original: Tc (GrepTool) in chunks.115.mjs:1620-1699+
 */
export const GrepTool = createTool<GrepInput, GrepOutput>({
  name: TOOL_NAMES.GREP,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `A powerful search tool built on ripgrep

Usage:
- ALWAYS use Grep for search tasks. NEVER invoke grep or rg as a Bash command.
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files with glob parameter or type parameter
- Output modes: "content" shows lines, "files_with_matches" shows file paths (default), "count" shows counts`;
  },

  async prompt() {
    return `Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping
Multiline matching: By default patterns match within single lines. Use multiline: true for cross-line patterns`;
  },

  inputSchema: grepInputSchema,
  outputSchema: grepOutputSchema,

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
      if (!existsSync(searchPath)) {
        return validationError(`Path not found: ${searchPath}`, 1);
      }
    }
    return validationSuccess();
  },

  async call(input, context) {
    const searchPath = input.path ? resolve(input.path) : context.getCwd();
    const mode = input.output_mode ?? 'files_with_matches';

    try {
      const args = buildRipgrepArgs(input, searchPath);
      const { stdout, stderr, code } = await executeRipgrep(args, context.getCwd());

      // ripgrep returns 1 for no matches, which is not an error
      if (code !== 0 && code !== 1) {
        return toolError(`Grep failed: ${stderr || 'Unknown error'}`);
      }

      let lines = stdout.split('\n').filter((line) => line.length > 0);

      // Apply offset
      if (input.offset !== undefined && input.offset > 0) {
        lines = lines.slice(input.offset);
      }

      // Apply limit
      if (input.head_limit !== undefined && input.head_limit > 0) {
        lines = lines.slice(0, input.head_limit);
      }

      // Extract filenames for files_with_matches and count modes
      const filenames: string[] = [];
      if (mode === 'files_with_matches') {
        filenames.push(...lines);
      } else if (mode === 'count') {
        // Format: filename:count
        for (const line of lines) {
          const colonIndex = line.lastIndexOf(':');
          if (colonIndex > 0) {
            filenames.push(line.substring(0, colonIndex));
          }
        }
      } else {
        // Content mode - extract unique filenames
        const fileSet = new Set<string>();
        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            fileSet.add(line.substring(0, colonIndex));
          }
        }
        filenames.push(...fileSet);
      }

      const result: GrepOutput = {
        mode,
        numFiles: filenames.length,
        filenames,
      };

      if (mode === 'content') {
        result.content = lines.join('\n');
        result.numLines = lines.length;
      }

      if (mode === 'count') {
        let totalMatches = 0;
        for (const line of stdout.split('\n')) {
          const colonIndex = line.lastIndexOf(':');
          if (colonIndex > 0) {
            const count = parseInt(line.substring(colonIndex + 1), 10);
            if (!isNaN(count)) totalMatches += count;
          }
        }
        result.numMatches = totalMatches;
      }

      if (input.offset !== undefined) {
        result.appliedOffset = input.offset;
      }
      if (input.head_limit !== undefined) {
        result.appliedLimit = input.head_limit;
      }

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Grep search failed: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    let content: string;

    if (result.mode === 'content' && result.content) {
      content = result.content;
    } else if (result.numFiles === 0) {
      content = 'No matches found.';
    } else {
      content = result.filenames.join('\n');
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

// NOTE: GrepTool 已在声明处导出；避免重复导出。
