/**
 * @claudecode/platform - Sandbox Configuration
 *
 * Settings getter functions for sandbox configuration.
 * Reconstructed from chunks.55.mjs:1509-1517
 */

import { memoize } from '@claudecode/shared';
import type { SandboxSettings, SandboxConfig, NetworkConfig } from './types.js';

// ============================================
// Settings State
// ============================================

/**
 * Global sandbox settings state
 */
let currentSettings: SandboxSettings = {
  enabled: false,
  autoAllowBashIfSandboxed: true,
  allowUnsandboxedCommands: true,
};

/**
 * Global sandbox configuration
 */
let currentConfig: SandboxConfig | undefined;

/**
 * Whether settings are locked by policy
 */
let settingsLockedByPolicy = false;

/**
 * Excluded commands list
 */
let excludedCommands: string[] = [];

// ============================================
// Settings Getter Functions
// ============================================

/**
 * Check if sandbox is enabled in settings.
 * Original: xEB in chunks.55.mjs:1509-1511
 */
export const isSandboxEnabledInSettings = memoize(
  (settings?: SandboxSettings): boolean => {
    return settings?.enabled ?? false;
  }
);

/**
 * Check if auto-allow bash mode is enabled.
 * Original: yEB in chunks.55.mjs:1512-1514
 */
export const isAutoAllowBashEnabled = memoize(
  (settings?: SandboxSettings): boolean => {
    return settings?.autoAllowBashIfSandboxed ?? true;
  }
);

/**
 * Check if unsandboxed commands are allowed (dangerouslyDisableSandbox bypass).
 * Original: vEB in chunks.55.mjs:1515-1517
 */
export const areUnsandboxedCommandsAllowedInSettings = memoize(
  (settings?: SandboxSettings): boolean => {
    return settings?.allowUnsandboxedCommands ?? true;
  }
);

// ============================================
// Global Settings Management
// ============================================

/**
 * Get current sandbox settings
 */
export function getSandboxSettings(): SandboxSettings {
  return { ...currentSettings };
}

/**
 * Set sandbox settings
 */
export function setSandboxSettings(settings: SandboxSettings): void {
  if (settingsLockedByPolicy) {
    console.warn('[Sandbox] Settings are locked by policy, cannot modify');
    return;
  }

  currentSettings = {
    ...currentSettings,
    ...settings,
  };
}

/**
 * Get current sandbox configuration
 */
export function getSandboxConfig(): SandboxConfig | undefined {
  return currentConfig;
}

/**
 * Set sandbox configuration
 */
export function setSandboxConfig(config: SandboxConfig | undefined): void {
  currentConfig = config;
}

/**
 * Check if settings are locked by policy
 */
export function areSandboxSettingsLockedByPolicy(): boolean {
  return settingsLockedByPolicy;
}

/**
 * Lock settings by policy (enterprise control)
 */
export function lockSandboxSettings(): void {
  settingsLockedByPolicy = true;
}

// ============================================
// Status Check Functions
// ============================================

/**
 * Check if sandbox is enabled (global).
 * Original: o01 in chunks.55.mjs
 */
export function isSandboxingEnabled(): boolean {
  return isSandboxEnabledInSettings(currentSettings);
}

/**
 * Check if auto-allow bash when sandboxed is enabled.
 * Original: ZZ8 in chunks.55.mjs
 */
export function isAutoAllowBashIfSandboxedEnabled(): boolean {
  return isAutoAllowBashEnabled(currentSettings);
}

/**
 * Check if unsandboxed commands are allowed.
 * Original: YZ8 in chunks.55.mjs
 */
export function areUnsandboxedCommandsAllowed(): boolean {
  return areUnsandboxedCommandsAllowedInSettings(currentSettings);
}

// ============================================
// Config Getter Functions
// ============================================

/**
 * Get filesystem read configuration
 */
export function getFsReadConfig(): { denyOnly: string[] } | undefined {
  if (!currentConfig) return undefined;
  return { denyOnly: currentConfig.filesystem.denyRead };
}

/**
 * Get filesystem write configuration
 */
export function getFsWriteConfig():
  | { allowOnly: string[]; denyWithinAllow: string[] }
  | undefined {
  if (!currentConfig) return undefined;
  return {
    allowOnly: currentConfig.filesystem.allowWrite,
    denyWithinAllow: currentConfig.filesystem.denyWrite,
  };
}

/**
 * Get network restriction configuration
 */
export function getNetworkRestrictionConfig(): NetworkConfig | undefined {
  if (!currentConfig) return undefined;
  return currentConfig.network;
}

/**
 * Get ignore violations configuration
 */
export function getIgnoreViolations():
  | Record<string, string[] | undefined>
  | undefined {
  if (!currentConfig) return undefined;
  return currentConfig.ignoreViolations;
}

/**
 * Get allowed Unix sockets
 */
export function getAllowUnixSockets(): string[] | undefined {
  return currentConfig?.network.allowUnixSockets;
}

/**
 * Get allow local binding flag
 */
export function getAllowLocalBinding(): boolean {
  return currentConfig?.network.allowLocalBinding ?? false;
}

/**
 * Get enable weaker nested sandbox flag
 */
export function getEnableWeakerNestedSandbox(): boolean {
  return currentConfig?.enableWeakerNestedSandbox ?? false;
}

// ============================================
// Excluded Commands
// ============================================

/**
 * Get excluded commands list
 */
export function getExcludedCommands(): string[] {
  return [...excludedCommands];
}

/**
 * Add command to exclusion list
 */
export function addExcludedCommand(command: string): void {
  if (!excludedCommands.includes(command)) {
    excludedCommands.push(command);
  }
}

/**
 * Remove command from exclusion list
 */
export function removeExcludedCommand(command: string): void {
  const index = excludedCommands.indexOf(command);
  if (index !== -1) {
    excludedCommands.splice(index, 1);
  }
}

/**
 * Check if command is excluded from sandbox
 */
export function isExcludedCommand(command: string): boolean {
  return excludedCommands.some((pattern) => {
    // Exact match
    if (pattern === command) return true;

    // Prefix match (pattern:*)
    if (pattern.endsWith(':*')) {
      const prefix = pattern.slice(0, -2);
      return command.startsWith(prefix);
    }

    // Wildcard match (pattern *)
    if (pattern.endsWith(' *')) {
      const prefix = pattern.slice(0, -2);
      return command.startsWith(prefix + ' ');
    }

    return false;
  });
}

// ============================================
// Reset
// ============================================

/**
 * Reset all sandbox configuration
 */
export function resetSandboxConfig(): void {
  currentSettings = {
    enabled: false,
    autoAllowBashIfSandboxed: true,
    allowUnsandboxedCommands: true,
  };
  currentConfig = undefined;
  settingsLockedByPolicy = false;
  excludedCommands = [];
}

// ============================================
// Export
// ============================================

export {
  isSandboxEnabledInSettings,
  isAutoAllowBashEnabled,
  areUnsandboxedCommandsAllowedInSettings,
  getSandboxSettings,
  setSandboxSettings,
  getSandboxConfig,
  setSandboxConfig,
  areSandboxSettingsLockedByPolicy,
  lockSandboxSettings,
  isSandboxingEnabled,
  isAutoAllowBashIfSandboxedEnabled,
  areUnsandboxedCommandsAllowed,
  getFsReadConfig,
  getFsWriteConfig,
  getNetworkRestrictionConfig,
  getIgnoreViolations,
  getAllowUnixSockets,
  getAllowLocalBinding,
  getEnableWeakerNestedSandbox,
  getExcludedCommands,
  addExcludedCommand,
  removeExcludedCommand,
  isExcludedCommand,
  resetSandboxConfig,
};
