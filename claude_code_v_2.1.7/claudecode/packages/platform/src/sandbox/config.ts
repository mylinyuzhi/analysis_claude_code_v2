/**
 * @claudecode/platform - Sandbox Configuration
 *
 * Settings getter functions for sandbox configuration.
 * Reconstructed from chunks.55.mjs:1509-1517
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { memoize } from '@claudecode/shared';
import {
  BASH_TOOL_NAME,
  EDIT_TOOL_NAME,
  READ_TOOL_NAME,
  WEBFETCH_TOOL_NAME,
} from '@claudecode/shared';
import type { SandboxSettings, SandboxConfig, NetworkConfig } from './types.js';
import { SANDBOX_CONSTANTS } from './types.js';
import { getPlatform } from './dependencies.js';

// ============================================
// Internal Helpers
// ============================================

/**
 * Resolve rule path based on source.
 * Original: cr1 in chunks.55.mjs:1250-1257
 */
function resolveRulePath(ruleContent: string, sourceRoot?: string): string {
  if (ruleContent.startsWith('//')) {
    return ruleContent.slice(1);
  }
  if (ruleContent.startsWith('/') && !ruleContent.startsWith('//')) {
    if (sourceRoot) {
      return path.join(sourceRoot, ruleContent.slice(1));
    }
  }
  return ruleContent;
}

/**
 * Parse a permission rule string into tool name and content.
 * Original: JRA in source
 */
function parsePermissionRule(rule: string): { toolName: string; ruleContent?: string } {
  const colonIndex = rule.indexOf(':');
  if (colonIndex === -1) {
    return { toolName: rule };
  }
  return {
    toolName: rule.slice(0, colonIndex),
    ruleContent: rule.slice(colonIndex + 1),
  };
}

/**
 * Parse settings to sandbox configuration.
 * Original: lr1 in chunks.55.mjs:1259-1338
 *
 * @param settings - User/policy settings object
 * @param sourceRoots - Map of setting sources to their root directories
 * @returns Fully resolved SandboxConfig
 */
export function parseSettingsToConfig(
  settings: any,
  sourceRoots: Record<string, string> = {}
): SandboxConfig {
  const permissions = settings.permissions || {};
  const allowedDomains: string[] = [];
  const deniedDomains: string[] = [];

  // 1. Collect domains from sandbox config
  if (settings.sandbox?.network?.allowedDomains) {
    allowedDomains.push(...settings.sandbox.network.allowedDomains);
  }

  // 2. Collect domains from general permission rules
  for (const rule of permissions.allow || []) {
    const { toolName, ruleContent } = parsePermissionRule(rule);
    if (toolName === WEBFETCH_TOOL_NAME && ruleContent?.startsWith('domain:')) {
      allowedDomains.push(ruleContent.substring(7));
    }
  }

  for (const rule of permissions.deny || []) {
    const { toolName, ruleContent } = parsePermissionRule(rule);
    if (toolName === WEBFETCH_TOOL_NAME && ruleContent?.startsWith('domain:')) {
      deniedDomains.push(ruleContent.substring(7));
    }
  }

  // 3. Filesystem restrictions
  const allowWrite: string[] = ['.'];
  const denyWrite: string[] = [];
  const denyRead: string[] = [];

  const cwd = process.cwd();

  // Add standard protected files
  denyWrite.push(
    path.join(cwd, '.claude', 'settings.json'),
    path.join(cwd, '.claude', 'settings.local.json')
  );

  // Check git directory for potential extra write access (submodules)
  const gitPath = path.join(cwd, '.git');
  try {
    const stat = fs.statSync(gitPath);
    if (stat.isFile()) {
      const content = fs.readFileSync(gitPath, 'utf8');
      const match = content.match(/^gitdir:\s*(.+)$/m);
      if (match?.[1]) {
        const gitDir = match[1].trim();
        const gitIndex = gitDir.indexOf('.git');
        if (gitIndex > 0) {
          const root = gitDir.substring(0, gitIndex - 1);
          if (root !== cwd) {
            allowWrite.push(root);
          }
        }
      }
    }
  } catch {
    // Ignore git errors
  }

  // Parse tool-specific path permissions
  // Note: In source, this iterates over setting sources
  for (const [source, root] of Object.entries(sourceRoots)) {
    const sourceSettings = settings[source] || {};
    if (!sourceSettings.permissions) continue;

    for (const rule of sourceSettings.permissions.allow || []) {
      const { toolName, ruleContent } = parsePermissionRule(rule);
      if (toolName === EDIT_TOOL_NAME && ruleContent) {
        allowWrite.push(resolveRulePath(ruleContent, root));
      }
    }

    for (const rule of sourceSettings.permissions.deny || []) {
      const { toolName, ruleContent } = parsePermissionRule(rule);
      if (toolName === EDIT_TOOL_NAME && ruleContent) {
        denyWrite.push(resolveRulePath(ruleContent, root));
      }
      if (toolName === READ_TOOL_NAME && ruleContent) {
        denyRead.push(resolveRulePath(ruleContent, root));
      }
    }
  }

  // 4. Ripgrep config
  const ripgrep = settings.sandbox?.ripgrep || {
    command: 'rg',
    args: [], // GGA would return default args if any
  };

  return {
    network: {
      allowedDomains: [...new Set(allowedDomains)],
      deniedDomains: [...new Set(deniedDomains)],
      allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
      allowAllUnixSockets: settings.sandbox?.network?.allowAllUnixSockets,
      allowLocalBinding: settings.sandbox?.network?.allowLocalBinding,
      httpProxyPort: settings.sandbox?.network?.httpProxyPort,
      socksProxyPort: settings.sandbox?.network?.socksProxyPort,
    },
    filesystem: {
      denyRead: [...new Set(denyRead)],
      allowWrite: [...new Set(allowWrite)],
      denyWrite: [...new Set(denyWrite)],
    },
    ignoreViolations: settings.sandbox?.ignoreViolations,
    enableWeakerNestedSandbox: settings.sandbox?.enableWeakerNestedSandbox,
    ripgrep,
    mandatoryDenySearchDepth: settings.sandbox?.mandatoryDenySearchDepth ?? 3,
  };
}

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
export function isSandboxEnabledInSettings(settings?: SandboxSettings): boolean {
  return settings?.enabled ?? false;
}

/**
 * Check if auto-allow bash mode is enabled.
 * Original: yEB in chunks.55.mjs:1512-1514
 */
export function isAutoAllowBashEnabled(settings?: SandboxSettings): boolean {
  return settings?.autoAllowBashIfSandboxed ?? true;
}

/**
 * Check if unsandboxed commands are allowed (dangerouslyDisableSandbox bypass).
 * Original: vEB in chunks.55.mjs:1515-1517
 */
export function areUnsandboxedCommandsAllowedInSettings(settings?: SandboxSettings): boolean {
  return settings?.allowUnsandboxedCommands ?? true;
}

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

// NOTE: 函数已在声明处导出；移除重复聚合导出。
