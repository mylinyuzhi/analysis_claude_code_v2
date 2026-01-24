/**
 * @claudecode/platform - Sandbox Dependencies
 *
 * Dependency checking for sandbox system.
 * Reconstructed from chunks.53.mjs:2035-2192
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { SandboxPlatform } from './types.js';

// ============================================
// Platform Detection
// ============================================

/**
 * Get current platform for sandbox.
 * Original: dR() in chunks.53.mjs
 */
export function getPlatform(): SandboxPlatform {
  switch (process.platform) {
    case 'darwin':
      return 'macos';
    case 'linux':
      return 'linux';
    default:
      return 'unsupported';
  }
}

/**
 * Check if current platform supports sandboxing
 */
export function isSupportedPlatform(): boolean {
  const platform = getPlatform();
  return platform === 'linux' || platform === 'macos';
}

// ============================================
// Architecture Detection
// ============================================

/**
 * Get CPU architecture for seccomp filter.
 * Original: eFB() in chunks.53.mjs:2035-2052
 *
 * @returns Architecture string or null if unsupported
 */
export function getArchitectureForSeccomp(): 'x64' | 'arm64' | null {
  const arch = process.arch;

  switch (arch) {
    case 'x64':
      return 'x64';
    case 'arm64':
      return 'arm64';
    case 'ia32':
      // 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking.
      console.error(
        '[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.'
      );
      return null;
    default:
      console.error(
        `[SeccompFilter] Unsupported architecture: ${arch}. Only x64 and arm64 are supported.`
      );
      return null;
  }
}

// ============================================
// Command Checking
// ============================================

/**
 * Check if a command is available in PATH.
 *
 * @param command - Command to check
 * @returns Whether command is available
 */
export function isCommandAvailable(command: string): boolean {
  try {
    const result = spawnSync('which', [command], {
      stdio: 'ignore',
      timeout: 1000,
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Get command path if available.
 *
 * @param command - Command to find
 * @returns Full path to command or null
 */
export function getCommandPath(command: string): string | null {
  try {
    const result = spawnSync('which', [command], {
      encoding: 'utf8',
      timeout: 1000,
    });
    if (result.status === 0 && result.stdout) {
      return result.stdout.trim();
    }
    return null;
  } catch {
    return null;
  }
}

// ============================================
// Linux Dependencies
// ============================================

/**
 * Check Linux sandbox dependencies.
 * Original: JHB() in chunks.53.mjs:2170-2192
 *
 * @param skipSeccompCheck - Skip checking for seccomp binaries
 * @returns Whether all required dependencies are available
 */
export function checkLinuxDependencies(skipSeccompCheck = false): boolean {
  try {
    // Check for bwrap (bubblewrap)
    const hasBwrap = isCommandAvailable('bwrap');

    // Check for socat
    const hasSocat = isCommandAvailable('socat');

    const hasAllDeps = hasBwrap && hasSocat;

    if (!skipSeccompCheck) {
      const hasBpfFilter = findSeccompBpfFilter() !== null;
      const hasApplySeccomp = findApplySeccompBinary() !== null;

      if (!hasBpfFilter || !hasApplySeccomp) {
        console.warn(
          '[Sandbox Linux] Seccomp filtering not available (missing binaries). ' +
            'Sandbox will run without Unix socket blocking.'
        );
      }
    }

    return hasAllDeps;
  } catch {
    return false;
  }
}

// ============================================
// macOS Dependencies
// ============================================

/**
 * Check macOS sandbox dependencies.
 *
 * @returns Whether all required dependencies are available
 */
export function checkMacOSDependencies(): boolean {
  // macOS sandbox-exec is built-in, only need ripgrep for dangerous file scanning
  return isCommandAvailable('rg');
}

// ============================================
// Seccomp Binary Location
// ============================================

/**
 * Find seccomp BPF filter file.
 * Original: Vr1() in chunks.53.mjs:2054-2064
 *
 * @returns Path to BPF filter or null
 */
export function findSeccompBpfFilter(): string | null {
  const arch = getArchitectureForSeccomp();
  if (!arch) return null;

  // Get base directory (relative to this module)
  let baseDir: string;
  try {
    baseDir = path.dirname(fileURLToPath(import.meta.url));
  } catch {
    baseDir = __dirname;
  }

  const relativePath = path.join('vendor', 'seccomp', arch, 'unix-block.bpf');

  // Search in multiple locations
  const searchPaths = [
    path.join(baseDir, relativePath),
    path.join(baseDir, '..', '..', relativePath),
    path.join(baseDir, '..', relativePath),
    path.join(baseDir, '..', '..', '..', relativePath),
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

/**
 * Find apply-seccomp binary.
 * Original: _01() in chunks.53.mjs
 *
 * @returns Path to apply-seccomp or null
 */
export function findApplySeccompBinary(): string | null {
  const arch = getArchitectureForSeccomp();
  if (!arch) return null;

  // Get base directory
  let baseDir: string;
  try {
    baseDir = path.dirname(fileURLToPath(import.meta.url));
  } catch {
    baseDir = __dirname;
  }

  const relativePath = path.join('vendor', 'seccomp', arch, 'apply-seccomp');

  // Search in multiple locations
  const searchPaths = [
    path.join(baseDir, relativePath),
    path.join(baseDir, '..', '..', relativePath),
    path.join(baseDir, '..', relativePath),
    path.join(baseDir, '..', '..', '..', relativePath),
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

// ============================================
// Combined Dependency Check
// ============================================

/**
 * Check all sandbox dependencies for current platform.
 * Original: LHB() in chunks.53.mjs
 *
 * @returns Whether sandbox dependencies are available
 */
export function checkDependencies(): boolean {
  const platform = getPlatform();

  // Check for ripgrep (required on all platforms)
  const hasRipgrep = isCommandAvailable('rg');
  if (!hasRipgrep) {
    return false;
  }

  switch (platform) {
    case 'linux':
      return checkLinuxDependencies();
    case 'macos':
      return checkMacOSDependencies();
    default:
      return false;
  }
}

/**
 * Get dependency status message.
 *
 * @returns Human-readable status message
 */
export function getDependencyStatusMessage(): string {
  const platform = getPlatform();

  if (!isSupportedPlatform()) {
    return `Platform '${process.platform}' is not supported for sandboxing.`;
  }

  const hasRipgrep = isCommandAvailable('rg');

  if (platform === 'linux') {
    const hasBwrap = isCommandAvailable('bwrap');
    const hasSocat = isCommandAvailable('socat');

    const missing: string[] = [];
    if (!hasRipgrep) missing.push('ripgrep (rg)');
    if (!hasBwrap) missing.push('bubblewrap (bwrap)');
    if (!hasSocat) missing.push('socat');

    if (missing.length === 0) {
      return 'All Linux sandbox dependencies are available.';
    }
    return `Missing Linux sandbox dependencies: ${missing.join(', ')}`;
  }

  if (platform === 'macos') {
    if (!hasRipgrep) {
      return 'Missing macOS sandbox dependency: ripgrep (rg)';
    }
    return 'All macOS sandbox dependencies are available.';
  }

  return 'Sandbox dependencies could not be checked.';
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
