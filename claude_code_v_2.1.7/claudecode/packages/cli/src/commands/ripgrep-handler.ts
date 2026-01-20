/**
 * @claudecode/cli - Ripgrep Handler
 *
 * Handler for ripgrep mode (--ripgrep).
 * Executes the embedded ripgrep binary with passthrough arguments.
 *
 * Reconstructed from chunks.157.mjs
 *
 * Key symbols:
 * - ripgrepMain → handleRipgrep
 */

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// ============================================
// Constants
// ============================================

/**
 * Ripgrep binary name by platform.
 */
const RIPGREP_BINARY: Record<string, string> = {
  darwin: 'rg',
  linux: 'rg',
  win32: 'rg.exe',
};

// ============================================
// Path Resolution
// ============================================

/**
 * Find the ripgrep binary path.
 *
 * Search order:
 * 1. Embedded in node_modules (packaged with claude-code)
 * 2. System PATH
 */
function findRipgrepBinary(): string | null {
  const platform = process.platform;
  const binaryName = RIPGREP_BINARY[platform] || 'rg';

  // Search locations
  const searchPaths = [
    // Embedded ripgrep (relative to package)
    path.join(__dirname, '..', '..', '..', 'vendor', 'ripgrep', binaryName),
    path.join(__dirname, '..', '..', 'vendor', 'ripgrep', binaryName),

    // node_modules locations
    path.join(__dirname, '..', '..', '..', 'node_modules', '@anthropic-ai', 'ripgrep', binaryName),
    path.join(__dirname, '..', '..', 'node_modules', '@anthropic-ai', 'ripgrep', binaryName),

    // Global node_modules
    path.join(process.cwd(), 'node_modules', '@anthropic-ai', 'ripgrep', binaryName),
  ];

  // Check each location
  for (const searchPath of searchPaths) {
    try {
      if (fs.existsSync(searchPath)) {
        return searchPath;
      }
    } catch {
      // Continue searching
    }
  }

  // Fall back to system PATH
  return binaryName;
}

// ============================================
// Ripgrep Execution
// ============================================

/**
 * Handle ripgrep mode.
 * Original: ripgrepMain in chunks.157.mjs
 *
 * Passes all arguments to the embedded ripgrep binary.
 * This allows Claude Code to use a consistent ripgrep version
 * regardless of system installation.
 */
export async function handleRipgrep(args: string[]): Promise<number> {
  const ripgrepPath = findRipgrepBinary();

  if (!ripgrepPath) {
    console.error('Error: ripgrep binary not found');
    console.error('Please ensure @anthropic-ai/ripgrep is installed');
    return 1;
  }

  return new Promise((resolve) => {
    // Spawn ripgrep with passthrough arguments
    const rg = spawn(ripgrepPath, args, {
      stdio: 'inherit', // Pass stdin/stdout/stderr directly
      env: process.env,
    });

    rg.on('error', (error) => {
      console.error('Error executing ripgrep:', error.message);
      resolve(1);
    });

    rg.on('exit', (code) => {
      resolve(code ?? 0);
    });
  });
}

/**
 * Get ripgrep version.
 */
export async function getRipgrepVersion(): Promise<string | null> {
  const ripgrepPath = findRipgrepBinary();
  if (!ripgrepPath) {
    return null;
  }

  return new Promise((resolve) => {
    const rg = spawn(ripgrepPath, ['--version'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    let output = '';
    rg.stdout?.on('data', (data) => {
      output += data.toString();
    });

    rg.on('error', () => {
      resolve(null);
    });

    rg.on('exit', (code) => {
      if (code === 0 && output) {
        // Parse version from output like "ripgrep 14.1.0"
        const match = output.match(/ripgrep\s+(\d+\.\d+\.\d+)/);
        resolve(match?.[1] ?? null);
      } else {
        resolve(null);
      }
    });
  });
}

// ============================================
// Export
// ============================================

export { findRipgrepBinary };
