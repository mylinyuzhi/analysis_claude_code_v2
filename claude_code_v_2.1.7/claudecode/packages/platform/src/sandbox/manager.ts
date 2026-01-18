/**
 * @claudecode/platform - Sandbox Manager
 *
 * Central sandbox management object.
 * Reconstructed from chunks.53.mjs, chunks.55.mjs
 */

import { parseBoolean } from '@claudecode/shared';
import type {
  SandboxConfig,
  SandboxSettings,
  SandboxManager,
  SandboxWrapperOptions,
  NetworkInfrastructure,
  PermissionCallback,
  ReadConfig,
  WriteConfig,
  NetworkConfig,
  IgnoreViolationsConfig,
  SandboxViolationStore as ISandboxViolationStore,
} from './types.js';
import {
  getPlatform,
  isSupportedPlatform,
  checkDependencies,
  getDependencyStatusMessage,
} from './dependencies.js';
import {
  isSandboxingEnabled as isSandboxingEnabledConfig,
  isAutoAllowBashIfSandboxedEnabled as isAutoAllowBashConfig,
  areUnsandboxedCommandsAllowed as areUnsandboxedCommandsAllowedConfig,
  areSandboxSettingsLockedByPolicy,
  setSandboxSettings as setSettingsInternal,
  setSandboxConfig,
  getSandboxConfig,
  getFsReadConfig,
  getFsWriteConfig,
  getNetworkRestrictionConfig,
  getIgnoreViolations,
  getAllowUnixSockets,
  getAllowLocalBinding,
  getEnableWeakerNestedSandbox,
  getExcludedCommands,
  resetSandboxConfig,
} from './config.js';
import {
  getGlobalViolationStore,
  resetGlobalViolationStore,
  annotateStderrWithSandboxFailures,
} from './violation-store.js';

// ============================================
// State
// ============================================

/**
 * Initialization promise (prevents double init)
 */
let initializationPromise: Promise<NetworkInfrastructure> | undefined;

/**
 * Network infrastructure state
 */
let networkInfrastructure: NetworkInfrastructure | undefined;

/**
 * Linux glob pattern warnings
 */
let linuxGlobPatternWarnings: string[] = [];

/**
 * Violation monitor cleanup function
 */
let violationMonitorCleanup: (() => void) | undefined;

// ============================================
// Initialization
// ============================================

/**
 * Initialize sandbox system.
 * Original: P58() in chunks.53.mjs:2785-2823
 *
 * @param config - Sandbox configuration
 * @param permissionCallback - Callback for permission prompts
 * @param enableMonitoring - Enable violation monitoring (macOS only)
 */
async function initialize(
  config: SandboxConfig,
  permissionCallback: PermissionCallback,
  enableMonitoring = false
): Promise<void> {
  // Prevent double initialization
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  // Store configuration
  setSandboxConfig(config);

  // Validate dependencies
  if (!checkDependencies()) {
    const platform = getPlatform();
    let errorMsg = 'Sandbox dependencies are not available on this system.';

    if (platform === 'linux') {
      errorMsg += ' Required: ripgrep (rg), bubblewrap (bwrap), and socat.';
    } else if (platform === 'macos') {
      errorMsg += ' Required: ripgrep (rg).';
    } else {
      errorMsg += ` Platform '${platform}' is not supported.`;
    }

    throw new Error(errorMsg);
  }

  // Start violation monitor on macOS if enabled
  if (enableMonitoring && getPlatform() === 'macos') {
    // Placeholder - would start log stream monitor
    console.log('[Sandbox] Violation monitoring enabled (macOS)');
    violationMonitorCleanup = () => {
      console.log('[Sandbox] Stopping violation monitor');
    };
  }

  // Register cleanup handlers
  registerCleanupOnExit();

  // Initialize network infrastructure
  initializationPromise = (async () => {
    try {
      // Get or allocate proxy ports
      let httpPort: number;
      if (config.network.httpProxyPort !== undefined) {
        httpPort = config.network.httpProxyPort;
      } else {
        httpPort = await initializeHTTPProxy(permissionCallback);
      }

      let socksPort: number;
      if (config.network.socksProxyPort !== undefined) {
        socksPort = config.network.socksProxyPort;
      } else {
        socksPort = await initializeSOCKSProxy(permissionCallback);
      }

      // Linux-specific: Create socat bridges
      let linuxBridge: NetworkInfrastructure['linuxBridge'];
      if (getPlatform() === 'linux') {
        linuxBridge = await initializeLinuxBridges(httpPort, socksPort);
      }

      const networkConfig: NetworkInfrastructure = {
        httpProxyPort: httpPort,
        socksProxyPort: socksPort,
        linuxBridge,
      };

      networkInfrastructure = networkConfig;
      return networkConfig;
    } catch (error) {
      // Cleanup on failure
      initializationPromise = undefined;
      networkInfrastructure = undefined;
      await shutdown().catch(() => {});
      throw error;
    }
  })();

  await initializationPromise;
}

/**
 * Reset sandbox state.
 * Original: FZ8() in chunks.55.mjs
 */
async function reset(): Promise<void> {
  await shutdown();
  initializationPromise = undefined;
  networkInfrastructure = undefined;
  linuxGlobPatternWarnings = [];
  resetSandboxConfig();
  resetGlobalViolationStore();
}

/**
 * Refresh configuration from settings.
 * Original: VZ8() in chunks.55.mjs
 */
function refreshConfig(): void {
  // Re-read settings if needed
  // Placeholder - would re-parse settings
}

// ============================================
// Placeholder Implementations
// ============================================

/**
 * Initialize HTTP proxy (placeholder).
 * Would start an HTTP proxy server for network filtering.
 */
async function initializeHTTPProxy(
  _permissionCallback: PermissionCallback
): Promise<number> {
  // Placeholder - would start HTTP proxy server
  // Return a placeholder port
  return 3128;
}

/**
 * Initialize SOCKS proxy (placeholder).
 * Would start a SOCKS proxy server for network filtering.
 */
async function initializeSOCKSProxy(
  _permissionCallback: PermissionCallback
): Promise<number> {
  // Placeholder - would start SOCKS proxy server
  return 1080;
}

/**
 * Initialize Linux bridges (placeholder).
 * Would start socat processes to bridge Unix sockets.
 */
async function initializeLinuxBridges(
  httpProxyPort: number,
  socksProxyPort: number
): Promise<NetworkInfrastructure['linuxBridge']> {
  // Placeholder - would start socat bridges
  const randomHex = Math.random().toString(16).slice(2);
  return {
    httpSocketPath: `/tmp/claude-http-${randomHex}.sock`,
    socksSocketPath: `/tmp/claude-socks-${randomHex}.sock`,
    httpBridgeProcess: null,
    socksBridgeProcess: null,
    httpProxyPort,
    socksProxyPort,
  };
}

/**
 * Shutdown sandbox (placeholder).
 * Would stop proxy servers and bridges.
 */
async function shutdown(): Promise<void> {
  if (violationMonitorCleanup) {
    violationMonitorCleanup();
    violationMonitorCleanup = undefined;
  }

  // Would clean up proxy servers and bridges
}

/**
 * Register cleanup handlers on process exit.
 * Original: _58() in chunks.53.mjs
 */
function registerCleanupOnExit(): void {
  // Note: Would use process.on('exit', ...) etc.
  // Placeholder for now
}

// ============================================
// Command Wrapping
// ============================================

/**
 * Wrap command with sandbox.
 * Original: WZ8() in chunks.55.mjs
 *
 * @param options - Wrapper options
 * @returns Wrapped command string
 */
async function wrapWithSandbox(options: SandboxWrapperOptions): Promise<string> {
  const platform = getPlatform();

  if (platform === 'linux') {
    return wrapWithLinuxSandbox(options);
  } else if (platform === 'macos') {
    return wrapWithMacOSSandbox(options);
  }

  // Unsupported platform, return command unchanged
  return options.command;
}

/**
 * Wrap command with Linux sandbox (placeholder).
 * Would build bwrap command with proper restrictions.
 */
async function wrapWithLinuxSandbox(
  options: SandboxWrapperOptions
): Promise<string> {
  const { command, needsNetworkRestriction, readConfig, writeConfig } = options;

  const hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
  const hasWriteRestrictions = writeConfig !== undefined;

  // If no restrictions needed, return command unchanged
  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  // Build bwrap command (placeholder - would build full command)
  const bwrapArgs = ['--new-session', '--die-with-parent'];

  if (needsNetworkRestriction) {
    bwrapArgs.push('--unshare-net');
  }

  // Would add filesystem restrictions, seccomp filter, etc.
  bwrapArgs.push('--', '/bin/bash', '-c', command);

  // Log restrictions applied
  const restrictions: string[] = [];
  if (needsNetworkRestriction) restrictions.push('network');
  if (hasReadRestrictions || hasWriteRestrictions) restrictions.push('filesystem');

  console.log(
    `[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(', ')} restrictions)`
  );

  // Placeholder - would return properly quoted bwrap command
  return `bwrap ${bwrapArgs.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
}

/**
 * Wrap command with macOS sandbox (placeholder).
 * Would build sandbox-exec command with Seatbelt profile.
 */
async function wrapWithMacOSSandbox(
  options: SandboxWrapperOptions
): Promise<string> {
  const { command, needsNetworkRestriction, readConfig, writeConfig } = options;

  const hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;

  // If no restrictions needed, return command unchanged
  if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) {
    return command;
  }

  // Would generate Seatbelt profile and build sandbox-exec command
  console.log(
    `[Sandbox macOS] Applied restrictions - network: ${needsNetworkRestriction}, ` +
      `read: ${readConfig ? 'restricted' : 'none'}, write: ${writeConfig ? 'restricted' : 'none'}`
  );

  // Placeholder - would return sandbox-exec command
  return `sandbox-exec -p "(version 1)(allow default)" bash -c "${command.replace(/"/g, '\\"')}"`;
}

// ============================================
// Status Getters
// ============================================

/**
 * Check if sandboxing is enabled.
 */
function isSandboxingEnabled(): boolean {
  return isSandboxingEnabledConfig();
}

/**
 * Check if auto-allow bash when sandboxed is enabled.
 */
function isAutoAllowBashIfSandboxedEnabled(): boolean {
  return isAutoAllowBashConfig();
}

/**
 * Check if unsandboxed commands are allowed.
 */
function areUnsandboxedCommandsAllowed(): boolean {
  return areUnsandboxedCommandsAllowedConfig();
}

// ============================================
// Network Infrastructure Getters
// ============================================

/**
 * Get HTTP proxy port.
 */
function getProxyPort(): number | undefined {
  return networkInfrastructure?.httpProxyPort;
}

/**
 * Get SOCKS proxy port.
 */
function getSocksProxyPort(): number | undefined {
  return networkInfrastructure?.socksProxyPort;
}

/**
 * Get Linux HTTP socket path.
 */
function getLinuxHttpSocketPath(): string | undefined {
  return networkInfrastructure?.linuxBridge?.httpSocketPath;
}

/**
 * Get Linux SOCKS socket path.
 */
function getLinuxSocksSocketPath(): string | undefined {
  return networkInfrastructure?.linuxBridge?.socksSocketPath;
}

/**
 * Wait for network initialization.
 */
async function waitForNetworkInitialization(): Promise<NetworkInfrastructure | undefined> {
  if (initializationPromise) {
    return initializationPromise;
  }
  return networkInfrastructure;
}

// ============================================
// Linux Glob Pattern Warnings
// ============================================

/**
 * Get Linux glob pattern warnings.
 */
function getLinuxGlobPatternWarnings(): string[] {
  return [...linuxGlobPatternWarnings];
}

/**
 * Add Linux glob pattern warning.
 */
function addLinuxGlobPatternWarning(pattern: string): void {
  if (!linuxGlobPatternWarnings.includes(pattern)) {
    linuxGlobPatternWarnings.push(pattern);
    console.warn(
      `[Sandbox Linux] Glob pattern skipped (not supported on Linux): ${pattern}`
    );
  }
}

// ============================================
// Sandbox Manager Object
// ============================================

/**
 * Central sandbox management object.
 * Original: XB in chunks.55.mjs:1518-1546
 */
export const sandboxManager: SandboxManager = {
  // Lifecycle
  initialize,
  reset,
  refreshConfig,

  // Status checks
  isSandboxingEnabled,
  isAutoAllowBashIfSandboxedEnabled,
  areUnsandboxedCommandsAllowed,
  areSandboxSettingsLockedByPolicy,
  isSupportedPlatform,
  checkDependencies,

  // Settings
  setSandboxSettings: setSettingsInternal,
  getExcludedCommands,

  // Config getters
  getFsReadConfig,
  getFsWriteConfig,
  getNetworkRestrictionConfig,
  getIgnoreViolations,
  getAllowUnixSockets,
  getAllowLocalBinding,
  getEnableWeakerNestedSandbox,

  // Network infrastructure
  getProxyPort,
  getSocksProxyPort,
  getLinuxHttpSocketPath,
  getLinuxSocksSocketPath,
  waitForNetworkInitialization,

  // Command wrapping
  wrapWithSandbox,

  // Violation tracking
  getSandboxViolationStore: getGlobalViolationStore,
  annotateStderrWithSandboxFailures,

  // Linux-specific
  getLinuxGlobPatternWarnings,
};

// ============================================
// Convenience Functions
// ============================================

/**
 * Check if command should be sandboxed.
 * Original: KEA() in chunks.124.mjs:1217-1223
 *
 * @param command - Command to check
 * @param dangerouslyDisableSandbox - Whether bypass is requested
 * @returns Whether command should run in sandbox
 */
export function isBashSandboxed(
  command: string,
  dangerouslyDisableSandbox = false
): boolean {
  // 1. Is sandbox enabled?
  if (!isSandboxingEnabled()) {
    return false;
  }

  // 2. Is dangerouslyDisableSandbox=true AND allowed by policy?
  if (dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()) {
    return false;
  }

  // 3. Is command empty?
  if (!command || command.trim().length === 0) {
    return false;
  }

  // 4. Is command in excluded list?
  const excludedCommands = getExcludedCommands();
  for (const pattern of excludedCommands) {
    if (pattern === command) return false;
    if (pattern.endsWith(':*') && command.startsWith(pattern.slice(0, -2))) {
      return false;
    }
    if (pattern.endsWith(' *') && command.startsWith(pattern.slice(0, -2) + ' ')) {
      return false;
    }
  }

  // 5. Default: run in sandbox
  return true;
}

// ============================================
// Export
// ============================================

export {
  sandboxManager,
  isBashSandboxed,
  initialize,
  reset,
  refreshConfig,
  wrapWithSandbox,
  getProxyPort,
  getSocksProxyPort,
  getLinuxHttpSocketPath,
  getLinuxSocksSocketPath,
  waitForNetworkInitialization,
  getLinuxGlobPatternWarnings,
  addLinuxGlobPatternWarning,
};
