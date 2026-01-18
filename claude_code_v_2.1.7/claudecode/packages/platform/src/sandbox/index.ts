/**
 * @claudecode/platform - Sandbox Module
 *
 * Sandbox system for command isolation.
 *
 * Key components:
 * - Platform-specific wrappers (Linux bwrap, macOS sandbox-exec)
 * - Network filtering via HTTP/SOCKS proxies
 * - Filesystem restrictions
 * - Violation monitoring (macOS)
 *
 * Reconstructed from chunks.53.mjs, chunks.55.mjs
 */

// Re-export types
export * from './types.js';

// Re-export configuration
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
} from './config.js';

// Re-export dependencies
export {
  getPlatform,
  isSupportedPlatform,
  getArchitectureForSeccomp,
  isCommandAvailable,
  getCommandPath,
  checkLinuxDependencies,
  checkMacOSDependencies,
  findSeccompBpfFilter,
  findApplySeccompBinary,
  checkDependencies,
  getDependencyStatusMessage,
} from './dependencies.js';

// Re-export violation store
export {
  SandboxViolationStore,
  getUniqueSandboxTag,
  encodeCommandTag,
  decodeCommandFromTag,
  parseViolationFromLog,
  shouldIgnoreViolation,
  getGlobalViolationStore,
  resetGlobalViolationStore,
  annotateStderrWithSandboxFailures,
  cleanSandboxViolations,
} from './violation-store.js';

// Re-export manager
export {
  sandboxManager,
  isBashSandboxed,
} from './manager.js';
