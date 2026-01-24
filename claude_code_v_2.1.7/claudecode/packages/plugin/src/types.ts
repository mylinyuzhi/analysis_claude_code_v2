/**
 * @claudecode/plugin - Plugin Type Definitions
 *
 * Type definitions for the plugin system.
 * Reconstructed from chunks.90.mjs, chunks.91.mjs, and chunks.130.mjs.
 */

// ============================================
// Author & Metadata
// ============================================

/** Original: p62 in chunks.90.mjs */
export interface AuthorInfo {
  name: string;
  email?: string;
  url?: string;
}

// ============================================
// Component Definitions
// ============================================

/** Original: H75 in chunks.90.mjs */
export interface CommandMetadata {
  source?: string;
  content?: string;
  description?: string;
  argumentHint?: string;
  model?: string;
  allowedTools?: string[];
}

/** Original: YVA in chunks.90.mjs */
export interface LspServerConfig {
  command: string;
  args?: string[];
  extensionToLanguage: Record<string, string>;
  transport: 'stdio' | 'socket';
  env?: Record<string, string>;
  initializationOptions?: unknown;
  settings?: unknown;
  workspaceFolder?: string;
  startupTimeout?: number;
  shutdownTimeout?: number;
  restartOnCrash?: boolean;
  maxRestarts?: number;
}

// ============================================
// Hooks
// ============================================

/**
 * Note: The actual implementation of hooks is complex and handled by the hooks package.
 * These types represent how they are declared in plugin manifests.
 */

export type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'Notification'
  | 'UserPromptSubmit'
  | 'SessionStart'
  | 'SessionEnd'
  | 'Stop'
  | 'SubagentStart'
  | 'SubagentStop'
  | 'PreCompact'
  | 'PermissionRequest';

export type HooksConfig = Record<string, any[]>;

/** Original: l62 in chunks.90.mjs */
export interface HooksFile {
  description?: string;
  hooks: HooksConfig;
}

// ============================================
// Plugin Manifest
// ============================================

/** Original: V4A in chunks.90.mjs */
export interface PluginManifest {
  // Base Metadata (V75)
  name: string;
  version?: string;
  description?: string;
  author?: AuthorInfo;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];

  // Components
  hooks?: string | HooksConfig | (string | HooksConfig)[];
  commands?: string | string[] | Record<string, CommandMetadata>;
  agents?: string | string[];
  skills?: string | string[];
  outputStyles?: string | string[];
  mcpServers?: string | string | Record<string, any> | (string | Record<string, any>)[];
  lspServers?: string | Record<string, LspServerConfig> | (string | LspServerConfig)[];
}

// ============================================
// Loaded Plugin Definition
// ============================================

/**
 * Result of loading a plugin from a path.
 * Matches the structure returned by ao2 in chunks.130.mjs.
 */
export interface PluginDefinition {
  name: string;
  manifest: PluginManifest;
  path: string;
  source: string;
  repository: string;
  enabled: boolean;

  // Component Paths & Metadata
  commandsPath?: string;
  commandsPaths?: string[];
  commandsMetadata?: Record<string, CommandMetadata>;

  agentsPath?: string;
  agentsPaths?: string[];

  skillsPath?: string;
  skillsPaths?: string[];

  outputStylesPath?: string;
  outputStylesPaths?: string[];

  hooksConfig?: HooksConfig;
}

// ============================================
// Marketplace
// ============================================

/** Original: rxA in chunks.90.mjs */
export type MarketplaceSource =
  | { source: 'url'; url: string; headers?: Record<string, string> }
  | { source: 'github'; repo: string; ref?: string; path?: string }
  | { source: 'git'; url: string; ref?: string; path?: string }
  | { source: 'npm'; package: string }
  | { source: 'file'; path: string }
  | { source: 'directory'; path: string };

/** Original: w75 in chunks.90.mjs */
export type PluginSource =
  | string // Relative path
  | { source: 'npm'; package: string; version?: string; registry?: string }
  | { source: 'pip'; package: string; version?: string; registry?: string }
  | { source: 'url'; url: string; ref?: string }
  | { source: 'github'; repo: string; ref?: string };

/** Original: L75 in chunks.90.mjs */
export interface MarketplacePluginEntry extends Partial<PluginManifest> {
  name: string;
  source: PluginSource;
  category?: string;
  tags?: string[];
  strict?: boolean;
}

/** Original: JVA in chunks.90.mjs */
export interface MarketplaceManifest {
  name: string;
  owner: AuthorInfo;
  plugins: MarketplacePluginEntry[];
  metadata?: {
    pluginRoot?: string;
    version?: string;
    description?: string;
  };
}

/** Original: _75 in chunks.90.mjs */
export interface KnownMarketplace {
  source: MarketplaceSource;
  installLocation: string;
  lastUpdated: string;
  autoUpdate?: boolean;
}

// ============================================
// Installation Registry
// ============================================

/** Original: M75 in chunks.90.mjs */
export type InstallScope = 'managed' | 'user' | 'project' | 'local' | 'flag';

/** Original: R75 in chunks.90.mjs */
export interface InstalledPluginEntry {
  scope: InstallScope;
  projectPath?: string;
  installPath: string;
  version?: string;
  installedAt?: string;
  lastUpdated?: string;
  gitCommitSha?: string;
}

/** Original: txA in chunks.90.mjs */
export interface InstalledPluginsRegistry {
  version: 2;
  plugins: Record<string, InstalledPluginEntry[]>;
}

// ============================================
// Discovery & Errors
// ============================================

export interface PluginDiscoveryResult {
  enabled: PluginDefinition[];
  disabled: PluginDefinition[];
  errors: PluginError[];
}

/** Original: h_ in chunks.91.mjs labels these types */
export type PluginError =
  | { type: 'generic-error'; source: string; error: string }
  | { type: 'path-not-found'; source: string; plugin: string; path: string; component: string }
  | { type: 'git-auth-failed'; authType: string; gitUrl: string }
  | { type: 'git-timeout'; operation: string; gitUrl: string }
  | { type: 'network-error'; url: string; details?: string }
  | { type: 'manifest-parse-error'; parseError: string }
  | { type: 'manifest-validation-error'; validationErrors: string[] }
  | { type: 'plugin-not-found'; source: string; pluginId: string; marketplace: string }
  | { type: 'marketplace-not-found'; marketplace: string }
  | { type: 'marketplace-load-failed'; marketplace: string; reason: string }
  | { type: 'repository-scan-failed'; reason: string }
  | { type: 'mcp-config-invalid'; serverName: string; validationError: string }
  | { type: 'hook-load-failed'; source: string; plugin: string; hookPath?: string; reason: string }
  | { type: 'component-load-failed'; component: string; path: string; reason: string }
  | { type: 'mcpb-download-failed'; url: string; reason: string }
  | { type: 'mcpb-extract-failed'; mcpbPath: string; reason: string }
  | { type: 'mcpb-invalid-manifest'; mcpbPath: string; validationError: string }
  | { type: 'lsp-config-invalid'; plugin: string; serverName: string; validationError: string }
  | { type: 'lsp-server-start-failed'; plugin: string; serverName: string; reason: string }
  | { type: 'lsp-server-crashed'; plugin: string; serverName: string; signal?: string; exitCode?: number }
  | { type: 'lsp-request-timeout'; plugin: string; serverName: string; method: string; timeoutMs: number }
  | { type: 'lsp-request-failed'; plugin: string; serverName: string; method: string; error: string }
  | { type: 'marketplace-blocked-by-policy'; source: string; plugin: string; marketplace: string; blockedByBlocklist: boolean; allowedSources: string[] };
