/**
 * @claudecode/integrations - MCP Configuration
 *
 * Load and parse MCP server configurations from multiple scopes.
 * Reconstructed from chunks.131.mjs:535-587
 */

import type {
  McpServerConfig,
  McpConfigScope,
  McpConfigResult,
} from './types.js';

// ============================================
// Configuration Loading
// ============================================

/**
 * Placeholder for settings loader.
 * In production, this would load from actual config files.
 */
function loadScopeServers(
  scope: McpConfigScope
): { servers: Record<string, McpServerConfig> } {
  // TODO: Implement actual config loading from:
  // - enterprise: System policy
  // - user: ~/.config/claude/settings.json
  // - project: .mcp.json (walks up directory tree)
  // - local: .claude.local.json
  // - plugin: Plugin manifests
  return { servers: {} };
}

/**
 * Check if enterprise config exists.
 * Original: _10 in chunks.131.mjs
 */
function enterpriseConfigExists(): boolean {
  // TODO: Implement enterprise config detection
  return false;
}

/**
 * Check if server is allowed by policy.
 * Original: P10 in chunks.131.mjs
 */
function isServerAllowedByPolicy(
  serverName: string,
  serverConfig: McpServerConfig
): boolean {
  // TODO: Implement policy checking
  return true;
}

/**
 * Get project server approval status.
 * Original: C21 in chunks.131.mjs
 */
function getProjectServerApprovalStatus(
  serverName: string
): 'approved' | 'pending' | 'denied' {
  // TODO: Implement approval status checking
  return 'approved';
}

/**
 * Discover plugins and their MCP servers.
 * Original: DG (discoverPluginsAndHooks) in chunks.91.mjs
 */
async function discoverPluginsAndHooks(): Promise<{
  servers: Record<string, McpServerConfig>;
  errors: Array<{ server: string; error: string }>;
}> {
  // TODO: Implement plugin discovery
  return { servers: {}, errors: [] };
}

// ============================================
// Main Config Loader
// ============================================

/**
 * Load all MCP configurations from all scopes.
 * Original: cEA (loadAllMcpConfig) in chunks.131.mjs:535-587
 *
 * Priority (highest to lowest):
 * 1. Enterprise (when exists, overrides all)
 * 2. Local (.claude.local.json)
 * 3. Project (.mcp.json - approved only)
 * 4. User (~/.config/claude/settings.json)
 * 5. Plugin (plugin manifests)
 */
export async function loadAllMcpConfig(): Promise<McpConfigResult> {
  // Step 1: Load enterprise servers (highest priority)
  const { servers: enterpriseServers } = loadScopeServers('enterprise');

  // Step 2: If enterprise config exists, ONLY use enterprise servers
  if (enterpriseConfigExists()) {
    const filteredServers: Record<string, McpServerConfig> = {};
    for (const [name, config] of Object.entries(enterpriseServers)) {
      // Apply policy filter
      if (!isServerAllowedByPolicy(name, config)) continue;
      filteredServers[name] = config;
    }
    return { servers: filteredServers, errors: [] };
  }

  // Step 3: Load from all other scopes
  const { servers: userServers } = loadScopeServers('user');
  const { servers: projectServers } = loadScopeServers('project');
  const { servers: localServers } = loadScopeServers('local');

  // Step 4: Load plugin-provided servers
  const pluginResult = await discoverPluginsAndHooks();
  const pluginServers = pluginResult.servers;
  const pluginErrors = pluginResult.errors;

  // Step 5: Filter project servers to only "approved" ones
  const approvedProjectServers: Record<string, McpServerConfig> = {};
  for (const [name, config] of Object.entries(projectServers)) {
    if (getProjectServerApprovalStatus(name) === 'approved') {
      approvedProjectServers[name] = config;
    }
  }

  // Step 6: Merge servers (later overwrites earlier)
  // Priority: plugins → user → approved project → local
  const mergedServers = Object.assign(
    {},
    pluginServers,
    userServers,
    approvedProjectServers,
    localServers
  );

  // Step 7: Apply policy filters
  const filteredServers: Record<string, McpServerConfig> = {};
  for (const [name, config] of Object.entries(mergedServers)) {
    if (!isServerAllowedByPolicy(name, config)) continue;
    filteredServers[name] = config;
  }

  return { servers: filteredServers, errors: pluginErrors };
}

// ============================================
// Server Config Parsing
// ============================================

/**
 * Parse server config object from JSON.
 * Original: efA (parseConfigObj) in chunks.131.mjs
 */
export function parseServerConfig(
  serverName: string,
  rawConfig: unknown
): McpServerConfig | null {
  if (!rawConfig || typeof rawConfig !== 'object') {
    return null;
  }

  const config = rawConfig as Record<string, unknown>;
  const type = (config.type as string) || 'stdio';

  switch (type) {
    case 'stdio':
      if (typeof config.command !== 'string') return null;
      return {
        type: 'stdio',
        command: config.command,
        args: Array.isArray(config.args)
          ? config.args.map(String)
          : undefined,
        env:
          config.env && typeof config.env === 'object'
            ? (config.env as Record<string, string>)
            : undefined,
        disabled: config.disabled === true,
      };

    case 'sse':
      if (typeof config.url !== 'string') return null;
      return {
        type: 'sse',
        url: config.url,
        headers:
          config.headers && typeof config.headers === 'object'
            ? (config.headers as Record<string, string>)
            : undefined,
        disabled: config.disabled === true,
      };

    case 'http':
      if (typeof config.url !== 'string') return null;
      return {
        type: 'http',
        url: config.url,
        headers:
          config.headers && typeof config.headers === 'object'
            ? (config.headers as Record<string, string>)
            : undefined,
        disabled: config.disabled === true,
      };

    case 'ws':
    case 'ws-ide':
      if (typeof config.url !== 'string') return null;
      return {
        type: type as 'ws' | 'ws-ide',
        url: config.url,
        headers:
          config.headers && typeof config.headers === 'object'
            ? (config.headers as Record<string, string>)
            : undefined,
        disabled: config.disabled === true,
      };

    case 'sse-ide':
      if (typeof config.url !== 'string') return null;
      return {
        type: 'sse-ide',
        url: config.url,
        headers:
          config.headers && typeof config.headers === 'object'
            ? (config.headers as Record<string, string>)
            : undefined,
        disabled: config.disabled === true,
      };

    case 'sdk':
      return {
        type: 'sdk',
        disabled: config.disabled === true,
      };

    default:
      return null;
  }
}

// ============================================
// Disabled Server Management
// ============================================

/**
 * Check if a server is disabled.
 */
export function isServerDisabled(serverName: string): boolean {
  // TODO: Check user settings for disabled servers
  return false;
}

/**
 * Get list of disabled servers.
 */
export function getDisabledServers(): string[] {
  // TODO: Load from user settings
  return [];
}

/**
 * Set server disabled status.
 */
export function setServerDisabled(
  serverName: string,
  disabled: boolean
): void {
  // TODO: Save to user settings
}

// ============================================
// Variable Substitution
// ============================================

/**
 * Substitute environment variables in config.
 * Pattern: ${VAR_NAME}
 *
 * Original: Variable substitution in plugin_integration.md
 */
export function substituteEnvVariables(
  config: McpServerConfig
): McpServerConfig {
  const substituteString = (str: string): string => {
    return str.replace(/\$\{([^}]+)\}/g, (_, varName) => {
      return process.env[varName] || '';
    });
  };

  const result = { ...config };

  if ('command' in result && result.command) {
    result.command = substituteString(result.command);
  }

  if ('args' in result && result.args) {
    result.args = result.args.map(substituteString);
  }

  if ('env' in result && result.env) {
    const newEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(result.env)) {
      newEnv[key] = substituteString(value);
    }
    result.env = newEnv;
  }

  if ('url' in result && result.url) {
    result.url = substituteString(result.url);
  }

  if ('headers' in result && result.headers) {
    const newHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(result.headers)) {
      newHeaders[key] = substituteString(value);
    }
    result.headers = newHeaders;
  }

  return result;
}

// ============================================
// Export
// ============================================

export {
  loadAllMcpConfig,
  parseServerConfig,
  isServerDisabled,
  getDisabledServers,
  setServerDisabled,
  substituteEnvVariables,
};
