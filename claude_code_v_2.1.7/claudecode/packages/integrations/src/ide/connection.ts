/**
 * @claudecode/integrations - IDE Connection
 *
 * Lock file handling and IDE connection management.
 * Reconstructed from chunks.131.mjs:2351-2587
 */

import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'fs';
import { join, sep as PATH_SEP } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';
import net from 'net';
import type { IdeLockInfo, IdeConnection, IdeMcpConfig } from './types.js';
import { IDE_CONSTANTS } from './types.js';
import { getOS, isProcessAlive, isIDEProcessRunning, isInCodeTerminal } from './detection.js';
import { getIdeDisplayName, isVSCodeIDE, isJetBrainsIDE } from './config.js';
import { installVSCodeExtension, getInstalledExtensionVersion, getVSCodeCLIPath } from './extension.js';

// ============================================
// Internal State
// ============================================

/**
 * Global abort controller for connection polling.
 * Original: xF1 in chunks.131.mjs:2870
 */
let connectionAbortController: AbortController | null = null;

// ============================================
// Directory Utilities
// ============================================

/**
 * Get Claude configuration directory.
 */
function getClaudeDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Get directories containing IDE lock files.
 * Original: I27 (getIDEDirectories) in chunks.131.mjs:2426-2458
 *
 * Primary: ~/.claude/ide
 * WSL: Also checks Windows user directories
 */
export function getIDEDirectories(): string[] {
  const directories: string[] = [];
  const platform = getOS();

  // Primary: ~/.claude/ide
  const primaryDir = join(getClaudeDir(), IDE_CONSTANTS.IDE_DIR_NAME);
  if (existsSync(primaryDir)) {
    directories.push(primaryDir);
  }

  // WSL: Also check Windows user directories
  if (platform !== 'wsl') {
    return directories;
  }

  // Get Windows USERPROFILE via PowerShell
  let windowsProfile = process.env.USERPROFILE;
  if (!windowsProfile) {
    try {
      const result = execSync("powershell.exe -Command '$env:USERPROFILE'", {
        encoding: 'utf-8',
      });
      if (result) windowsProfile = result.trim();
    } catch {
      console.warn('Unable to get Windows USERPROFILE - IDE detection may be incomplete');
    }
  }

  if (windowsProfile) {
    // Convert Windows path to WSL path
    const wslDistro = process.env.WSL_DISTRO_NAME;
    const wslPath = convertWindowsToWslPath(windowsProfile, wslDistro);
    if (wslPath) {
      const windowsIdeDir = join(wslPath, '.claude', IDE_CONSTANTS.IDE_DIR_NAME);
      if (existsSync(windowsIdeDir)) {
        directories.push(windowsIdeDir);
      }
    }
  }

  // Also scan /mnt/c/Users/*/.claude/ide
  try {
    const usersDir = '/mnt/c/Users';
    if (existsSync(usersDir)) {
      const entries = readdirSync(usersDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        // Skip system directories
        if (['Public', 'Default', 'Default User', 'All Users'].includes(entry.name)) {
          continue;
        }
        const userIdeDir = join(usersDir, entry.name, '.claude', IDE_CONSTANTS.IDE_DIR_NAME);
        if (existsSync(userIdeDir)) {
          directories.push(userIdeDir);
        }
      }
    }
  } catch {
    // Ignore errors when scanning
  }

  return directories;
}

/**
 * Convert Windows path to WSL path.
 */
function convertWindowsToWslPath(windowsPath: string, distro?: string): string | null {
  try {
    // Simple conversion: C:\Users\foo -> /mnt/c/Users/foo
    const match = windowsPath.match(/^([A-Za-z]):\\(.*)$/);
    const driveLetter = match?.[1];
    const restRaw = match?.[2];
    if (driveLetter && restRaw !== undefined) {
      const drive = driveLetter.toLowerCase();
      const rest = restRaw.replace(/\\/g, '/');
      return `/mnt/${drive}/${rest}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Convert WSL path to Windows path.
 */
function convertWslToWindowsPath(wslPath: string, distro?: string): string | null {
  try {
    // /mnt/c/Users/foo -> C:\Users\foo
    const match = wslPath.match(/^\/mnt\/([a-z])\/(.*)$/);
    const driveLetter = match?.[1];
    const restRaw = match?.[2];
    if (driveLetter && restRaw !== undefined) {
      const drive = driveLetter.toUpperCase();
      const rest = restRaw.replace(/\//g, '\\');
      return `${drive}:\\${rest}`;
    }
    return null;
  } catch {
    return null;
  }
}

// ============================================
// Lock File Handling
// ============================================

/**
 * Get IDE lock files sorted by modification time (most recent first).
 * Original: bF1 (getIDELockFiles) in chunks.131.mjs:2351-2369
 */
export function getIDELockFiles(): string[] {
  try {
    const directories = getIDEDirectories();

    return directories
      .flatMap((ideDir) => {
        try {
          const entries = readdirSync(ideDir, { withFileTypes: true });
          return entries
            .filter((entry) => entry.name.endsWith('.lock'))
            .map((entry) => {
              const fullPath = join(ideDir, entry.name);
              return {
                path: fullPath,
                mtime: statSync(fullPath).mtime,
              };
            });
        } catch {
          return [];
        }
      })
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()) // Most recent first
      .map((entry) => entry.path);
  } catch {
    return [];
  }
}

/**
 * Parse IDE lock file content.
 * Original: Sr2 (parseLockFile) in chunks.131.mjs:2371-2403
 *
 * Lock file format (JSON):
 * {
 *   "workspaceFolders": ["/path/to/project"],
 *   "pid": 12345,
 *   "ideName": "vscode",
 *   "transport": "ws",
 *   "runningInWindows": false,
 *   "authToken": "optional-token"
 * }
 *
 * Legacy format: Line-separated paths
 */
export function parseLockFile(lockFilePath: string): IdeLockInfo | null {
  try {
    const content = readFileSync(lockFilePath, { encoding: 'utf-8' });
    let workspaceFolders: string[] = [];
    let pid: number | undefined;
    let ideName: string | undefined;
    let useWebSocket = false;
    let runningInWindows = false;
    let authToken: string | undefined;

    try {
      // Try parsing as JSON (modern format)
      const parsed = JSON.parse(content);
      if (parsed.workspaceFolders) workspaceFolders = parsed.workspaceFolders;
      pid = parsed.pid;
      ideName = parsed.ideName;
      useWebSocket = parsed.transport === 'ws';
      runningInWindows = parsed.runningInWindows === true;
      authToken = parsed.authToken;
    } catch {
      // Fallback: legacy format (line-separated paths)
      workspaceFolders = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }

    // Extract port from filename (e.g., "12345.lock" -> 12345)
    const filename = lockFilePath.split(PATH_SEP).pop();
    if (!filename) return null;
    const port = parseInt(filename.replace('.lock', ''), 10);
    if (isNaN(port)) return null;

    return {
      workspaceFolders,
      port,
      pid,
      ideName,
      useWebSocket,
      runningInWindows,
      authToken,
    };
  } catch {
    return null;
  }
}

// ============================================
// Port Reachability
// ============================================

/**
 * Check if a port is reachable.
 * Original: NL0 (isPortReachable) in chunks.131.mjs:2405-2424
 */
export async function isPortReachable(host: string, port: number, timeout = 1000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const cleanup = () => {
      socket.destroy();
    };

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      cleanup();
      resolve(true);
    });

    socket.on('timeout', () => {
      cleanup();
      resolve(false);
    });

    socket.on('error', () => {
      cleanup();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

// ============================================
// Stale Lock File Cleanup
// ============================================

/**
 * Remove stale IDE lock files.
 * Original: D27 (cleanupStaleLockFiles) in chunks.131.mjs:2460-2490
 *
 * Strategy:
 * 1. If PID provided and process not alive, mark as stale
 * 2. If no PID, check if port is reachable
 * 3. For WSL, always verify port reachability
 */
export async function cleanupStaleLockFiles(): Promise<void> {
  try {
    const lockFiles = getIDELockFiles();
    const platform = getOS();

    for (const lockPath of lockFiles) {
      const lockInfo = parseLockFile(lockPath);

      if (!lockInfo) {
        // Invalid lock file, delete it
        try {
          unlinkSync(lockPath);
        } catch {
          // Ignore deletion errors
        }
        continue;
      }

      const host = await getIDEHost(lockInfo.runningInWindows, lockInfo.port);
      let isStale = false;

      if (lockInfo.pid) {
        // If PID provided, check if process is alive
        if (!isProcessAlive(lockInfo.pid)) {
          if (platform !== 'wsl') {
            isStale = true;
          } else if (!(await isPortReachable(host, lockInfo.port))) {
            isStale = true;
          }
        }
      } else {
        // No PID, check if port is reachable
        if (!(await isPortReachable(host, lockInfo.port))) {
          isStale = true;
        }
      }

      if (isStale) {
        try {
          unlinkSync(lockPath);
        } catch {
          // Ignore deletion errors
        }
      }
    }
  } catch {
    // Ignore errors
  }
}

// ============================================
// IDE Host Resolution
// ============================================

/**
 * Get IDE host address.
 * Original: gr2 (getIDEHost) in chunks.131.mjs:3053-3070
 *
 * Handles:
 * - WSL: Gets Windows host IP from /etc/resolv.conf
 * - Override: Uses CLAUDE_CODE_IDE_HOST_OVERRIDE if set
 */
export async function getIDEHost(runningInWindows: boolean, port: number): Promise<string> {
  // Check for override
  const hostOverride = process.env[IDE_CONSTANTS.ENV_VARS.HOST_OVERRIDE];
  if (hostOverride) {
    return hostOverride;
  }

  const platform = getOS();

  // If running in WSL and IDE is in Windows, get Windows host IP
  if (platform === 'wsl' && runningInWindows) {
    try {
      // Get nameserver from /etc/resolv.conf (usually Windows host IP)
      const resolv = readFileSync('/etc/resolv.conf', 'utf-8');
      const match = resolv.match(/nameserver\s+(\d+\.\d+\.\d+\.\d+)/);
      const ip = match?.[1];
      if (ip) return ip;
    } catch {
      // Fall through to default
    }
  }

  return 'localhost';
}

// ============================================
// Connection Validation
// ============================================

/**
 * Normalize path for comparison.
 */
function normalizePath(filePath: string): string {
  // Remove trailing separator
  if (filePath.endsWith(PATH_SEP) && filePath.length > 1) {
    return filePath.slice(0, -1);
  }
  return filePath;
}

/**
 * Find valid IDE connections.
 * Original: IhA (getAvailableIDEConnections) in chunks.131.mjs:2532-2587
 *
 * Validation rules:
 * 1. If CLAUDE_CODE_IDE_SKIP_VALID_CHECK=true, always valid
 * 2. If CLAUDE_CODE_SSE_PORT matches lock file port, always valid
 * 3. Otherwise, check if CWD is inside any workspace folder
 */
export async function getAvailableIDEConnections(
  includeInvalid = false
): Promise<IdeConnection[]> {
  const connections: IdeConnection[] = [];

  try {
    const forcedPort = process.env[IDE_CONSTANTS.ENV_VARS.SSE_PORT]
      ? parseInt(process.env[IDE_CONSTANTS.ENV_VARS.SSE_PORT]!, 10)
      : null;
    const currentWorkingDir = process.cwd();
    const lockFiles = getIDELockFiles();
    const platform = getOS();
    const inCodeTerminal = isInCodeTerminal();

    for (const lockPath of lockFiles) {
      const lockInfo = parseLockFile(lockPath);
      if (!lockInfo) continue;

      // Skip if IDE process not running (non-WSL only)
      if (
        platform !== 'wsl' &&
        inCodeTerminal &&
        (!lockInfo.pid || !(await isIDEProcessRunning(lockInfo.pid, inCodeTerminal)))
      ) {
        continue;
      }

      // Validate workspace match
      let isValid = false;

      if (process.env[IDE_CONSTANTS.ENV_VARS.SKIP_VALID_CHECK] === 'true') {
        isValid = true;
      } else if (forcedPort && lockInfo.port === forcedPort) {
        isValid = true;
      } else {
        isValid = lockInfo.workspaceFolders.some((folder) => {
          let normalizedFolder = normalizePath(folder);

          // Handle WSL path conversion if needed
          if (platform === 'wsl' && lockInfo.runningInWindows && process.env.WSL_DISTRO_NAME) {
            const wslPath = convertWindowsToWslPath(folder, process.env.WSL_DISTRO_NAME);
            if (wslPath) {
              normalizedFolder = normalizePath(wslPath);
            }
          }

          // Case-insensitive comparison on Windows
          if (platform === 'windows') {
            return (
              currentWorkingDir.toUpperCase() === normalizedFolder.toUpperCase() ||
              currentWorkingDir.toUpperCase().startsWith(normalizedFolder.toUpperCase() + PATH_SEP)
            );
          }

          return (
            currentWorkingDir === normalizedFolder ||
            currentWorkingDir.startsWith(normalizedFolder + PATH_SEP)
          );
        });
      }

      if (!isValid && !includeInvalid) continue;

      // Determine connection URL
      const host = await getIDEHost(lockInfo.runningInWindows, lockInfo.port);
      const url = lockInfo.useWebSocket
        ? `ws://${host}:${lockInfo.port}`
        : `http://${host}:${lockInfo.port}/sse`;

      // Determine IDE name
      const name = lockInfo.ideName
        ? getIdeDisplayName(lockInfo.ideName)
        : inCodeTerminal
          ? 'IDE Terminal'
          : 'IDE';

      connections.push({
        url,
        name,
        workspaceFolders: lockInfo.workspaceFolders,
        port: lockInfo.port,
        isValid,
        authToken: lockInfo.authToken,
        ideRunningInWindows: lockInfo.runningInWindows,
      });
    }
  } catch {
    // Return whatever connections we found
  }

  return connections;
}

// ============================================
// Connection Polling
// ============================================

// Abort controller for wait cancellation
let waitAbortController: AbortController | null = null;

/**
 * Poll for IDE connection with timeout.
 * Original: Mr2 (waitForIDEConnection) in chunks.131.mjs:2517-2530
 *
 * Strategy:
 * 1. Cancel any previous wait
 * 2. Cleanup stale lock files
 * 3. Poll every 1 second for up to 30 seconds
 * 4. Return first valid connection found
 */
export async function waitForIDEConnection(): Promise<IdeConnection | null> {
  // Cancel any previous wait
  if (waitAbortController) {
    waitAbortController.abort();
  }
  waitAbortController = new AbortController();
  const signal = waitAbortController.signal;

  // First cleanup stale lock files
  await cleanupStaleLockFiles();

  const startTime = Date.now();
  const timeout = IDE_CONSTANTS.CONNECTION_POLL_TIMEOUT;
  const interval = IDE_CONSTANTS.CONNECTION_POLL_INTERVAL;

  while (Date.now() - startTime < timeout && !signal.aborted) {
    const connections = await getAvailableIDEConnections(false);
    if (signal.aborted) return null;
    if (connections.length === 1) return connections[0] ?? null; // Found exactly one valid connection
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return null;
}

/**
 * Cancel ongoing IDE connection wait.
 */
export function cancelWaitForIDEConnection(): void {
  if (waitAbortController) {
    waitAbortController.abort();
    waitAbortController = null;
  }
}

// ============================================
// MCP Configuration
// ============================================

/**
 * Check if the onboarding has been shown for the current terminal.
 * Original: SF1 in chunks.131.mjs:2236
 */
export function hasIdeOnboardingBeenShown(settings: any, terminal: string = 'unknown'): boolean {
  return settings.hasIdeOnboardingBeenShown?.[terminal] === true;
}

/**
 * Check if the extension is installed for the given IDE.
 * Original: Rr2 in chunks.131.mjs:2602
 */
export async function isExtensionInstalled(ideName: string): Promise<boolean> {
  if (isVSCodeIDE(ideName)) {
    const cliPath = getVSCodeCLIPath(ideName as any);
    if (!cliPath) return false;
    try {
      const version = await getInstalledExtensionVersion(cliPath);
      return version !== null;
    } catch {
      return false;
    }
  }
  // JetBrains support is handled differently in original source (zL0)
  return false;
}

/**
 * Orchestrate the installation of the extension.
 * Original: K27 in chunks.131.mjs:2492
 */
export async function handleExtensionInstallation(
  ideName: string,
  settings: any,
  updateSettings: (updates: any) => void,
  logTelemetry: (event: string, data: any) => void
): Promise<any> {
  try {
    const version = await installVSCodeExtension(ideName as any);
    logTelemetry('tengu_ext_installed', {});
    
    if (!settings.diffTool) {
      updateSettings({ diffTool: 'auto' });
    }

    return {
      installed: true,
      error: null,
      installedVersion: version,
      ideType: ideName,
    };
  } catch (error: any) {
    logTelemetry('tengu_ext_install_error', {});
    return {
      installed: false,
      error: error.message || String(error),
      installedVersion: null,
      ideType: ideName,
    };
  }
}

/**
 * Initialize IDE connection and extension installation.
 * Original: hr2 in chunks.131.mjs:2830-2854
 */
export async function initializeIDEConnection(
  onConnection: (conn: IdeConnection | null) => void,
  ideToInstall: string | undefined,
  showOnboarding: () => void,
  setInstallationState: (state: any) => void,
  settings: any,
  updateSettings: (updates: any) => void,
  logTelemetry: (event: string, data: any) => void,
  currentTerminal: string = 'unknown'
): Promise<void> {
  // Start polling for connection
  waitForIDEConnection().then(onConnection);

  const shouldAutoInstall = process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== 'true' && 
                           (settings.autoInstallIdeExtension ?? true);

  if (shouldAutoInstall) {
    const targetIDE = ideToInstall ?? currentTerminal;
    if (targetIDE) {
      if (isVSCodeIDE(targetIDE)) {
        const alreadyInstalled = await isExtensionInstalled(targetIDE);
        handleExtensionInstallation(targetIDE, settings, updateSettings, logTelemetry)
          .then((result) => {
            setInstallationState(result);
            if (result.installed) {
              waitForIDEConnection().then(onConnection);
            }
            if (!alreadyInstalled && result.installed && !hasIdeOnboardingBeenShown(settings, currentTerminal)) {
              showOnboarding();
            }
          });
      } else if (isJetBrainsIDE(targetIDE) && !hasIdeOnboardingBeenShown(settings, currentTerminal)) {
        isExtensionInstalled(targetIDE).then((installed) => {
          if (installed) showOnboarding();
        });
      }
    }
  }
}

/**
 * Get the IDE MCP client from a map of clients.
 * Original: nN in chunks.131.mjs:2818-2822
 */
export function getIDEClient(mcpClients: any): any | null {
  return mcpClients?.ide ?? null;
}

/**
 * Get the IDE name from connected clients.
 * Original: hF1 in chunks.131.mjs:2792-2795
 */
export function getIDEName(mcpClients: any): string | null {
  const ideClient = getIDEClient(mcpClients);
  return ideClient?.type === 'connected' ? ideClient.config.ideName : null;
}

/**
 * Check if an IDE is connected.
 * Original: fF1 in chunks.131.mjs:2598-2600
 */
export function hasConnectedIDE(mcpClients: any): boolean {
  return getIDEName(mcpClients) !== null;
}

/**
 * Create IDE MCP configuration from connection.
 * Used for dynamic MCP config when auto-connecting to IDE.
 */
export function createIdeMcpConfig(connection: IdeConnection): IdeMcpConfig {
  return {
    type: connection.url.startsWith('ws:') ? 'ws-ide' : 'sse-ide',
    url: connection.url,
    ideName: connection.name,
    authToken: connection.authToken,
    ideRunningInWindows: connection.ideRunningInWindows,
    scope: 'dynamic',
  };
}
