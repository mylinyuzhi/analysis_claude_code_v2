/**
 * @claudecode/tools - LS Tool
 * 
 * Tool for listing files in a directory.
 * Reconstructed from source logic (chunks.131.mjs usage of o2/LS).
 */

import { z } from 'zod';
import * as path from 'path';
import {
  FileSystemWrapper,
  resolvePath
} from '@claudecode/platform/fs';

// Assumed imports
import { FileSystemWrapper as FS, resolvePath as resolvePathFn } from '../../platform/src/fs/index.js';

// ============================================
// Schemas
// ============================================

const InputSchema = z.object({
  path: z.string().describe('The absolute path to the directory to list')
});

// ============================================
// Tool Implementation
// ============================================

export const LSTool = {
  name: 'LS', // Original: o2.name
  description: 'Lists files in a given path.',
  inputSchema: InputSchema,

  async validateInput(input: any, context: any) {
    const { path: dirPath } = input;
    const resolvedPath = resolvePathFn(dirPath);
    const fs = FS;

    if (!fs.existsSync(resolvedPath)) {
      return {
        result: false,
        message: `Directory does not exist: ${resolvedPath}`,
        errorCode: 1 // Assuming error code
      };
    }

    const stats = fs.statSync(resolvedPath);
    if (!stats.isDirectory()) {
      return {
        result: false,
        message: `Path is not a directory: ${resolvedPath}`,
        errorCode: 2
      };
    }

    return { result: true };
  },

  async call(input: any, context: any) {
    const { path: dirPath } = input;
    const resolvedPath = resolvePathFn(dirPath);
    const fs = FS;

    try {
      const entries = fs.readdirSync(resolvedPath);
      
      // Format output similar to 'ls -F' (append / to dirs)
      const formattedEntries = entries.map(entry => {
        const isDir = entry.isDirectory();
        return isDir ? `${entry.name}/` : entry.name;
      });

      // Sort: Directories first, then files
      formattedEntries.sort((a, b) => {
        const aIsDir = a.endsWith('/');
        const bIsDir = b.endsWith('/');
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

      const output = formattedEntries.join('\n');

      return {
        data: {
          type: 'directory', // Matches chunks.131.mjs q$7 switch case
          path: resolvedPath,
          content: output
        }
      };
    } catch (error) {
      throw new Error(`Failed to list directory: ${error}`);
    }
  }
};
