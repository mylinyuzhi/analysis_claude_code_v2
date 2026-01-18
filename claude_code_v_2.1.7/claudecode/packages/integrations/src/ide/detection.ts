/**
 * @claudecode/integrations - IDE Detection
 *
 * Process-based IDE detection using platform-specific commands.
 * Reconstructed from chunks.131.mjs:2733-2779
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { IdeName } from './types.js';
import { IDE_CONFIG_MAP } from './config.js';

const execAsync = promisify(exec);

// ============================================
// Platform Detection
// ============================================

/**
 * Get current operating system.
 * Original: $Q (getOS) in chunks.131.mjs
 */
export function getOS(): 'macos' | 'windows' | 'linux' | 'wsl' {
  const platform = process.platform;

  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows';

  // Check for WSL
  if (platform === 'linux') {
    if (process.env.WSL_DISTRO_NAME) return 'wsl';
    return 'linux';
  }

  return 'linux';
}

// ============================================
// Process Detection Commands
// ============================================

/**
 * Get macOS process detection command.
 */
function getMacOSDetectionCommand(): string {
  const keywords = [
    'Visual Studio Code',
    'Code Helper',
    'Cursor Helper',
    'Cursor.app',
    'Windsurf Helper',
    'Windsurf.app',
    'IntelliJ IDEA',
    'PyCharm',
    'WebStorm',
    'PhpStorm',
    'RubyMine',
    'CLion',
    'GoLand',
    'Rider',
    'DataGrip',
    'AppCode',
    'DataSpell',
    'Aqua',
    'Gateway',
    'Fleet',
    'Android Studio',
  ];

  return `ps aux | grep -E "${keywords.join('|')}" | grep -v grep`;
}

/**
 * Get Windows process detection command.
 */
function getWindowsDetectionCommand(): string {
  const keywords = [
    'code.exe',
    'cursor.exe',
    'windsurf.exe',
    'idea64.exe',
    'idea.exe',
    'pycharm64.exe',
    'pycharm.exe',
    'webstorm64.exe',
    'webstorm.exe',
    'phpstorm64.exe',
    'phpstorm.exe',
    'rubymine64.exe',
    'rubymine.exe',
    'clion64.exe',
    'clion.exe',
    'goland64.exe',
    'goland.exe',
    'rider64.exe',
    'rider.exe',
    'datagrip64.exe',
    'datagrip.exe',
    'appcode64.exe',
    'appcode.exe',
    'dataspell64.exe',
    'dataspell.exe',
    'aqua64.exe',
    'aqua.exe',
    'gateway64.exe',
    'gateway.exe',
    'fleet64.exe',
    'fleet.exe',
    'studio64.exe',
    'studio.exe',
  ];

  return `tasklist | findstr /I "${keywords.join(' ')}"`;
}

/**
 * Get Linux process detection command.
 */
function getLinuxDetectionCommand(): string {
  const keywords = [
    'code',
    'cursor',
    'windsurf',
    'idea',
    'intellij',
    'pycharm',
    'webstorm',
    'phpstorm',
    'rubymine',
    'clion',
    'goland',
    'rider',
    'datagrip',
    'appcode',
    'dataspell',
    'aqua',
    'gateway',
    'fleet',
    'android-studio',
    'studio',
  ];

  return `ps aux | grep -E "${keywords.join('|')}" | grep -v grep`;
}

// ============================================
// IDE Detection
// ============================================

/**
 * Detect running IDEs by analyzing system processes.
 * Original: z27 (detectRunningIDEs) in chunks.131.mjs:2733-2779
 *
 * Strategy:
 * 1. Run platform-specific process listing command
 * 2. Match output against IDE configuration keywords
 * 3. Handle edge cases (e.g., Linux vscode vs cursor disambiguation)
 */
export async function detectRunningIDEs(): Promise<IdeName[]> {
  const detectedIDEs: IdeName[] = [];

  try {
    const platform = getOS();
    let processOutput = '';

    if (platform === 'macos') {
      const result = await execAsync(getMacOSDetectionCommand(), {
        shell: '/bin/bash',
      }).catch(() => ({ stdout: '' }));
      processOutput = result.stdout ?? '';

      // Match against macOS keywords
      for (const [ideKey, ideConfig] of Object.entries(IDE_CONFIG_MAP)) {
        for (const keyword of ideConfig.processKeywordsMac) {
          if (processOutput.includes(keyword)) {
            detectedIDEs.push(ideKey as IdeName);
            break; // Only add each IDE once
          }
        }
      }
    } else if (platform === 'windows') {
      const result = await execAsync(getWindowsDetectionCommand(), {
        shell: 'cmd.exe',
      }).catch(() => ({ stdout: '' }));
      processOutput = result.stdout ?? '';

      // Match against Windows keywords
      for (const [ideKey, ideConfig] of Object.entries(IDE_CONFIG_MAP)) {
        for (const keyword of ideConfig.processKeywordsWindows) {
          if (processOutput.toLowerCase().includes(keyword.toLowerCase())) {
            detectedIDEs.push(ideKey as IdeName);
            break;
          }
        }
      }
    } else if (platform === 'linux' || platform === 'wsl') {
      const result = await execAsync(getLinuxDetectionCommand(), {
        shell: '/bin/bash',
      }).catch(() => ({ stdout: '' }));
      processOutput = result.stdout ?? '';

      // Match against Linux keywords with special handling
      for (const [ideKey, ideConfig] of Object.entries(IDE_CONFIG_MAP)) {
        for (const keyword of ideConfig.processKeywordsLinux) {
          if (processOutput.includes(keyword)) {
            // Special handling: distinguish vscode from cursor on Linux
            // Both contain "code", so we need extra logic
            if (ideKey !== 'vscode') {
              detectedIDEs.push(ideKey as IdeName);
            } else if (
              !processOutput.includes('cursor') &&
              !processOutput.includes('appcode')
            ) {
              // Only add vscode if cursor/appcode not detected
              detectedIDEs.push(ideKey as IdeName);
            }
            break;
          }
        }
      }
    }
  } catch (error) {
    // Log error but don't throw - return empty array
    console.error('IDE detection error:', error);
  }

  return detectedIDEs;
}

// ============================================
// Process Utilities
// ============================================

/**
 * Check if a process is alive by PID.
 * Original: Pr2 (isProcessAlive) in chunks.131.mjs
 */
export function isProcessAlive(pid: number): boolean {
  try {
    // Sending signal 0 checks if process exists without killing it
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get parent PID of a process.
 * Original: _aA (getParentPid) in chunks.131.mjs
 *
 * Platform-specific implementation:
 * - macOS/Linux: Read from /proc/{pid}/stat or use ps
 * - Windows: Use wmic
 */
export async function getParentPid(pid: number): Promise<number | null> {
  const platform = getOS();

  try {
    if (platform === 'macos') {
      const { stdout } = await execAsync(`ps -o ppid= -p ${pid}`);
      const ppid = parseInt(stdout.trim(), 10);
      return isNaN(ppid) ? null : ppid;
    } else if (platform === 'linux' || platform === 'wsl') {
      // Try /proc first (faster)
      try {
        const fs = await import('fs/promises');
        const stat = await fs.readFile(`/proc/${pid}/stat`, 'utf-8');
        const parts = stat.split(' ');
        const ppid = parseInt(parts[3], 10);
        return isNaN(ppid) ? null : ppid;
      } catch {
        // Fallback to ps
        const { stdout } = await execAsync(`ps -o ppid= -p ${pid}`);
        const ppid = parseInt(stdout.trim(), 10);
        return isNaN(ppid) ? null : ppid;
      }
    } else if (platform === 'windows') {
      const { stdout } = await execAsync(
        `wmic process where processid=${pid} get parentprocessid /format:value`
      );
      const match = stdout.match(/ParentProcessId=(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Check if IDE process is running and in our parent chain.
 * Original: X27 (isIDEProcessRunning) in chunks.131.mjs:2315-2332
 *
 * Strategy:
 * 1. First check if process exists at all
 * 2. Walk up parent process chain (up to 10 levels)
 * 3. Verify IDE is our ancestor process
 *
 * This prevents connecting to stale lock files from crashed IDEs.
 */
export async function isIDEProcessRunning(
  pid: number,
  isInCodeTerminal: boolean
): Promise<boolean> {
  // First check if process exists
  if (!isProcessAlive(pid)) return false;

  // If not in code terminal, just check process exists
  if (!isInCodeTerminal) return true;

  // Walk up parent process chain to verify IDE is our parent
  try {
    let currentPid = process.ppid;
    const maxDepth = 10; // IDE_CONSTANTS.MAX_PARENT_CHAIN_DEPTH

    for (let i = 0; i < maxDepth; i++) {
      if (currentPid === pid) return true; // IDE is in our parent chain
      if (currentPid === 0 || currentPid === 1) break; // Reached init/root

      const parentPid = await getParentPid(currentPid);
      if (!parentPid || parentPid === currentPid) break;
      currentPid = parentPid;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Check if running in a code terminal (IDE integrated terminal).
 * Original: zK (isInCodeTerminal) in chunks.131.mjs:3035-3037
 */
export function isInCodeTerminal(): boolean {
  // Check for TERM_PROGRAM environment variable
  const termProgram = process.env.TERM_PROGRAM;
  const forceCodeTerminal = process.env.FORCE_CODE_TERMINAL;

  if (forceCodeTerminal === 'true' || forceCodeTerminal === '1') {
    return true;
  }

  return (
    termProgram === 'vscode' ||
    termProgram === 'cursor' ||
    termProgram === 'windsurf'
  );
}

// ============================================
// Export
// ============================================

export {
  getOS,
  detectRunningIDEs,
  isProcessAlive,
  getParentPid,
  isIDEProcessRunning,
  isInCodeTerminal,
};
