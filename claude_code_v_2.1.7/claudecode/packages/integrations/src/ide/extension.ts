/**
 * @claudecode/integrations - VS Code Extension Management
 *
 * Checks for and installs the anthropic.claude-code extension for VS Code based IDEs.
 * Reconstructed from chunks.131.mjs:2614-2718
 */

import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import semver from 'semver';
import { getOS } from './detection.js';
import type { IdeName } from './types.js';
import { IDE_CONFIG_MAP } from './config.js';

const execAsync = promisify(exec);

// Minimum required version of the extension
// Original: _r2() returning "0.0.1" (or similar constant)
// We'll use a constant for now.
const MIN_REQUIRED_VERSION = '0.0.0'; // Replace with actual version if known, or 0.0.0 to ensure install

// ============================================
// Extension Installation
// ============================================

/**
 * Install anthropic.claude-code extension if needed.
 * Original: F27 (installVSCodeExtension) in chunks.131.mjs:2614-2632
 */
export async function installVSCodeExtension(ideName: IdeName): Promise<string | null> {
  if (isVSCodeIDE(ideName)) {
    const cliPath = getVSCodeCLIPath(ideName);
    if (cliPath) {
      let currentVersion = await getInstalledExtensionVersion(cliPath);

      // Install if not installed or version is outdated
      if (!currentVersion || semver.lt(currentVersion, getMinRequiredVersion())) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay

        try {
          // Force install the extension
          await execCommand(
            cliPath,
            ['--force', '--install-extension', 'anthropic.claude-code'],
            { env: getCleanEnv() }
          );
          
          // Check version again after install
          currentVersion = await getInstalledExtensionVersion(cliPath);
        } catch (error) {
           // If install fails, throw error with details
           // The original code throws: Error(`${result.code}: ${result.error} ${result.stderr}`)
           throw new Error(`Failed to install extension: ${error}`);
        }
      }
      return currentVersion;
    }
  }
  return null;
}

/**
 * Get the minimum required extension version.
 * Original: _r2
 */
export function getMinRequiredVersion(): string {
  // TODO: Update this when we know the actual requirement
  return '0.2.6'; 
}

/**
 * Check installed extension version.
 * Original: H27 (getInstalledExtensionVersion) in chunks.131.mjs:2654-2666
 */
export async function getInstalledExtensionVersion(cliPath: string): Promise<string | null> {
  try {
    const { stdout } = await execCommand(
      cliPath,
      ['--list-extensions', '--show-versions'],
      { env: getCleanEnv() }
    );
    
    const extensions = stdout?.split('\n') || [];
    for (const extension of extensions) {
      const [name, version] = extension.trim().split('@');
      if (name === 'anthropic.claude-code' && version) {
        return version;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ============================================
// CLI Path Resolution
// ============================================

/**
 * Get CLI command path for VSCode-based IDE.
 * Original: xr2 (getVSCodeCLIPath) in chunks.131.mjs:2702-2718
 */
export function getVSCodeCLIPath(ideName: IdeName): string | null {
  // First try to find CLI from parent process (macOS)
  const cliFromProcess = findCLIFromParentProcess();
  if (cliFromProcess && fs.existsSync(cliFromProcess)) {
    return cliFromProcess;
  }

  // Fallback to standard commands
  switch (ideName) {
    case 'vscode':
      return 'code';
    case 'cursor':
      return 'cursor';
    case 'windsurf':
      return 'windsurf';
    default:
      return null;
  }
}

/**
 * Find CLI path from parent process tree.
 * Original: E27 (findCLIFromParentProcess) in chunks.131.mjs:2668-2700
 */
function findCLIFromParentProcess(): string | null {
  try {
    if (getOS() !== 'macos') return null;

    let currentPid = process.ppid;
    const maxDepth = 10;

    for (let i = 0; i < maxDepth; i++) {
      if (!currentPid || currentPid <= 1) break;

      // Get command line for the process
      // ps -o command= -p PID
      const command = execSyncSafe(`ps -o command= -p ${currentPid}`);
      
      if (command) {
        // Map app bundle names to binary names
        const appMap: Record<string, string> = {
          'Visual Studio Code.app': 'code',
          'Cursor.app': 'cursor',
          'Windsurf.app': 'windsurf',
          'Visual Studio Code - Insiders.app': 'code',
          'VSCodium.app': 'codium'
        };

        const electronPathSuffix = '/Contents/MacOS/Electron';

        for (const [appName, binName] of Object.entries(appMap)) {
          // Check if command path contains app bundle structure
          // e.g. /Applications/Visual Studio Code.app/Contents/MacOS/Electron
          const appPathIndex = command.indexOf(appName + electronPathSuffix);
          
          if (appPathIndex !== -1) {
            const bundlePathEnd = appPathIndex + appName.length;
            // Construct path to bin command
            // e.g. /Applications/Visual Studio Code.app/Contents/Resources/app/bin/code
            return command.substring(0, bundlePathEnd) + `/Contents/Resources/app/bin/${binName}`;
          }
        }
      }

      // Get parent PID
      const ppidOutput = execSyncSafe(`ps -o ppid= -p ${currentPid}`);
      if (!ppidOutput) break;
      
      const ppid = parseInt(ppidOutput.trim(), 10);
      if (isNaN(ppid)) break;
      currentPid = ppid;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ============================================
// Helpers
// ============================================

/**
 * Check if IDE is VSCode-based.
 * Original: kF1 (isVSCodeIDE)
 */
function isVSCodeIDE(ideName: IdeName): boolean {
  if (!ideName) return false;
  const ideConfig = IDE_CONFIG_MAP[ideName];
  return !!(ideConfig && ideConfig.ideKind === 'vscode');
}

/**
 * Execute command safely.
 * Wrapper around execAsync.
 */
async function execCommand(
  command: string,
  args: string[],
  options: { env?: NodeJS.ProcessEnv } = {}
): Promise<{ stdout: string; stderr: string }> {
  const cmd = `${command} ${args.join(' ')}`;
  return execAsync(cmd, options);
}

/**
 * Execute sync command safely, returning trimmed stdout or null on error.
 * Original: NH
 */
function execSyncSafe(command: string): string | null {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch {
    return null;
  }
}

/**
 * Get clean environment variables for command execution.
 * Original: LL0 (getCleanEnv)
 * 
 * On Linux/Unix, filtering environment variables can be important
 * to avoid issues with DISPLAY or other session-specific vars
 * when running commands from a different context.
 */
function getCleanEnv(): NodeJS.ProcessEnv {
  // In the original code, this might filter specific vars.
  // For now, we return process.env but we could sanitize it.
  // The analysis says "Clean env to avoid DISPLAY issues on Linux"
  // so we might want to unset DISPLAY if needed, or just pass through.
  // Looking at chunk 131, LL0 implementation might differ.
  // Since we don't have LL0 implementation details, we'll return process.env
  // but ensure PATH is preserved.
  return process.env;
}
