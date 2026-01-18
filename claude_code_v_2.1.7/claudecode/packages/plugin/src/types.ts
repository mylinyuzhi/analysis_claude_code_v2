/**
 * @claudecode/plugin - Plugin Type Definitions
 *
 * Type definitions for the plugin system.
 * Reconstructed from chunks.91.mjs, chunks.130.mjs
 */

// ============================================
// Plugin Manifest
// ============================================

/**
 * Command definition with metadata.
 */
export interface CommandDefinition {
  source?: string;
  content?: string;
  description?: string;
}

/**
 * Plugin manifest (plugin.json).
 */
export interface PluginManifest {
  /** Plugin name (lowercase, alphanumeric with hyphens) */
  name: string;

  /** Plugin version */
  version?: string;

  /** Plugin description */
  description?: string;

  /** Commands - path(s) or object with metadata */
  commands?: string | string[] | Record<string, CommandDefinition>;

  /** Agents - path(s) to agent files */
  agents?: string | string[];

  /** Skills - path(s) to skill files */
  skills?: string | string[];

  /** Hooks - path(s) or inline config */
  hooks?: string | string[] | HooksConfig;

  /** Output styles - path(s) to style files */
  outputStyles?: string | string[];

  /** LSP servers configuration */
  lspServers?: Record<string, LspServerManifest>;
}

/**
 * LSP server manifest entry.
 */
export interface LspServerManifest {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

// ============================================
// Plugin Definition
// ============================================

/**
 * Plugin definition (loaded plugin).
 */
export interface PluginDefinition {
  /** Plugin name */
  name: string;

  /** Parsed manifest */
  manifest: PluginManifest;

  /** Installation path */
  path: string;

  /** Source ID (name@marketplace) */
  source: string;

  /** Repository/origin */
  repository: string;

  /** Enable state */
  enabled: boolean;

  /** Default commands directory */
  commandsPath?: string;

  /** Custom command paths */
  commandsPaths?: string[];

  /** Command metadata */
  commandsMetadata?: Record<string, CommandDefinition>;

  /** Default agents directory */
  agentsPath?: string;

  /** Custom agent paths */
  agentsPaths?: string[];

  /** Default skills directory */
  skillsPath?: string;

  /** Custom skill paths */
  skillsPaths?: string[];

  /** Default output styles directory */
  outputStylesPath?: string;

  /** Custom output style paths */
  outputStylesPaths?: string[];

  /** Merged hooks configuration */
  hooksConfig?: HooksConfig;
}

// ============================================
// Hooks
// ============================================

/**
 * Hook entry type.
 */
export type HookType = 'command' | 'url';

/**
 * Hook entry definition.
 */
export interface HookEntry {
  type: HookType;
  command?: string;
  url?: string;
  timeout?: number;
  retries?: number;
}

/**
 * Hook event types.
 */
export type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PreMessage'
  | 'PostMessage'
  | 'Stop';

/**
 * Hooks configuration.
 */
export type HooksConfig = Partial<Record<HookEvent, HookEntry[]>>;

/**
 * Hooks file structure.
 */
export interface HooksFile {
  hooks: HooksConfig;
}

// ============================================
// Marketplace
// ============================================

/**
 * Plugin source types.
 */
export type PluginSourceType =
  | 'github'
  | 'github-default-branch'
  | 'git'
  | 'url'
  | 'file'
  | 'directory'
  | 'npm';

/**
 * GitHub plugin source.
 */
export interface GitHubPluginSource {
  source: 'github';
  repo: string;
  ref?: string;
}

/**
 * GitHub default branch source.
 */
export interface GitHubDefaultBranchSource {
  source: 'github-default-branch';
  repo: string;
  path?: string;
}

/**
 * Git plugin source.
 */
export interface GitPluginSource {
  source: 'git';
  url: string;
  ref?: string;
}

/**
 * URL plugin source.
 */
export interface UrlPluginSource {
  source: 'url';
  url: string;
  headers?: Record<string, string>;
}

/**
 * File plugin source.
 */
export interface FilePluginSource {
  source: 'file';
  path: string;
}

/**
 * Directory plugin source.
 */
export interface DirectoryPluginSource {
  source: 'directory';
  path: string;
}

/**
 * NPM plugin source.
 */
export interface NpmPluginSource {
  source: 'npm';
  package: string;
}

/**
 * Plugin source union.
 */
export type PluginSource =
  | GitHubPluginSource
  | GitHubDefaultBranchSource
  | GitPluginSource
  | UrlPluginSource
  | FilePluginSource
  | DirectoryPluginSource
  | NpmPluginSource;

/**
 * Marketplace plugin entry.
 */
export interface MarketplacePluginEntry {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  source: string | PluginSource;
  tags?: string[];
  license?: string;
}

/**
 * Marketplace manifest.
 */
export interface MarketplaceManifest {
  name: string;
  description?: string;
  author?: string;
  url?: string;
  plugins: MarketplacePluginEntry[];
}

/**
 * Known marketplace configuration.
 */
export interface KnownMarketplace {
  source: PluginSource;
  installLocation: string;
  lastUpdated: string;
  autoUpdate?: boolean;
}

// ============================================
// Installation
// ============================================

/**
 * Installation scope.
 */
export type InstallScope = 'managed' | 'user' | 'project' | 'local';

/**
 * Installed plugin entry (v2).
 */
export interface InstalledPluginEntry {
  scope: InstallScope;
  version: string;
  installPath: string;
  installedAt: string;
  lastUpdated?: string;
  gitCommitSha?: string;
  projectPath?: string;
}

/**
 * Installed plugins registry (v2).
 */
export interface InstalledPluginsRegistry {
  version: 2;
  plugins: Record<string, InstalledPluginEntry[]>;
}

// ============================================
// Discovery
// ============================================

/**
 * Plugin discovery result.
 */
export interface PluginDiscoveryResult {
  enabled: PluginDefinition[];
  disabled: PluginDefinition[];
  errors: PluginError[];
}

// ============================================
// Errors
// ============================================

/**
 * Plugin not found error.
 */
export interface PluginNotFoundError {
  type: 'plugin-not-found';
  source: string;
  pluginId: string;
  marketplace: string;
}

/**
 * Marketplace not found error.
 */
export interface MarketplaceNotFoundError {
  type: 'marketplace-not-found';
  source: string;
  marketplace: string;
}

/**
 * Marketplace load failed error.
 */
export interface MarketplaceLoadFailedError {
  type: 'marketplace-load-failed';
  source: string;
  error: string;
}

/**
 * Marketplace blocked by policy error.
 */
export interface MarketplaceBlockedError {
  type: 'marketplace-blocked-by-policy';
  source: string;
  plugin: string;
  marketplace: string;
  blockedByBlocklist: boolean;
  allowedSources: string[];
}

/**
 * Path not found error.
 */
export interface PathNotFoundError {
  type: 'path-not-found';
  source: string;
  plugin: string;
  path: string;
  component: 'commands' | 'agents' | 'skills' | 'hooks' | 'output-styles';
}

/**
 * Hook load failed error.
 */
export interface HookLoadFailedError {
  type: 'hook-load-failed';
  source: string;
  plugin: string;
  hookPath: string;
  reason: string;
}

/**
 * Component load failed error.
 */
export interface ComponentLoadFailedError {
  type: 'component-load-failed';
  source: string;
  plugin: string;
  component: string;
  error: string;
}

/**
 * LSP config invalid error.
 */
export interface LspConfigInvalidError {
  type: 'lsp-config-invalid';
  source: string;
  plugin: string;
  serverName: string;
  validationError: string;
}

/**
 * Generic error.
 */
export interface GenericPluginError {
  type: 'generic-error';
  source: string;
  error: string;
}

/**
 * Plugin error union.
 */
export type PluginError =
  | PluginNotFoundError
  | MarketplaceNotFoundError
  | MarketplaceLoadFailedError
  | MarketplaceBlockedError
  | PathNotFoundError
  | HookLoadFailedError
  | ComponentLoadFailedError
  | LspConfigInvalidError
  | GenericPluginError;

// ============================================
// Export
// ============================================

export type {
  CommandDefinition,
  PluginManifest,
  LspServerManifest,
  PluginDefinition,
  HookType,
  HookEntry,
  HookEvent,
  HooksConfig,
  HooksFile,
  PluginSourceType,
  GitHubPluginSource,
  GitHubDefaultBranchSource,
  GitPluginSource,
  UrlPluginSource,
  FilePluginSource,
  DirectoryPluginSource,
  NpmPluginSource,
  PluginSource,
  MarketplacePluginEntry,
  MarketplaceManifest,
  KnownMarketplace,
  InstallScope,
  InstalledPluginEntry,
  InstalledPluginsRegistry,
  PluginDiscoveryResult,
  PluginNotFoundError,
  MarketplaceNotFoundError,
  MarketplaceLoadFailedError,
  MarketplaceBlockedError,
  PathNotFoundError,
  HookLoadFailedError,
  ComponentLoadFailedError,
  LspConfigInvalidError,
  GenericPluginError,
  PluginError,
};
