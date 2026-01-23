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
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

// ============================================
// Configuration Loading
// ============================================

/**
 * Placeholder for settings loader.
 * In production, this would load from actual config files.
 */
type SettingsLike = {
  mcpServers?: Record<string, unknown>;
  // 兼容可能的命名
  mcp_servers?: Record<string, unknown>;
  disabledMcpServers?: string[];
  approvedMcpServers?: string[];
  enabledPlugins?: string[];
};

function getClaudeDir(): string {
  return join(homedir(), '.claude');
}

function safeReadJson<T>(filePath: string): T | null {
  try {
    if (!existsSync(filePath)) return null;
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteJson(filePath: string, data: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getUserSettingsPath(): string {
  return join(getClaudeDir(), 'settings.json');
}

function getEnterpriseSettingsPathCandidates(): string[] {
  const policyDir = process.env.CLAUDE_POLICY_DIR;
  if (!policyDir) return [];
  return [
    join(policyDir, 'settings.json'),
    join(policyDir, '.claude', 'settings.json'),
  ];
}

function findProjectSettingsPath(startDir?: string): string | null {
  const cwd = startDir || process.cwd();
  let current = cwd;
  // Walk up directory tree looking for `.claude/settings.json` or `.mcp.json`.
  while (current !== dirname(current)) {
    const p1 = join(current, '.claude', 'settings.json');
    if (existsSync(p1)) return p1;
    const p2 = join(current, '.mcp.json');
    if (existsSync(p2)) return p2;
    current = dirname(current);
  }
  return null;
}

function getLocalSettingsPath(startDir?: string): string {
  const projectPath = findProjectSettingsPath(startDir);
  const projectDir = projectPath ? dirname(dirname(projectPath)) : (startDir || process.cwd());
  // 兼容两种命名：settings.local.json / .claude.local.json
  const p1 = join(projectDir, '.claude', 'settings.local.json');
  if (existsSync(p1)) return p1;
  const p2 = join(projectDir, '.claude.local.json');
  return p2;
}

function normalizeServersFromSettings(obj: unknown): Record<string, McpServerConfig> {
  if (!obj || typeof obj !== 'object') return {};
  const s = obj as SettingsLike;
  const raw = s.mcpServers || s.mcp_servers;
  if (!raw || typeof raw !== 'object') return {};

  const out: Record<string, McpServerConfig> = {};
  for (const [name, cfg] of Object.entries(raw)) {
    const parsed = parseServerConfig(name, cfg);
    if (parsed) out[name] = parsed;
  }
  return out;
}

function loadScopeServers(scope: McpConfigScope): { servers: Record<string, McpServerConfig> } {
  switch (scope) {
    case 'enterprise': {
      for (const p of getEnterpriseSettingsPathCandidates()) {
        const settings = safeReadJson<SettingsLike>(p);
        if (settings) return { servers: normalizeServersFromSettings(settings) };
      }
      return { servers: {} };
    }
    case 'user': {
      const settings = safeReadJson<SettingsLike>(getUserSettingsPath()) || {};
      return { servers: normalizeServersFromSettings(settings) };
    }
    case 'project': {
      const p = findProjectSettingsPath();
      if (!p) return { servers: {} };
      const settings = safeReadJson<SettingsLike>(p) || {};
      // `.mcp.json` 可能直接是 {"servers": {...}} / {"mcpServers": {...}}
      const fromServers = (settings as any).servers && typeof (settings as any).servers === 'object'
        ? { mcpServers: (settings as any).servers } as any
        : settings;
      return { servers: normalizeServersFromSettings(fromServers) };
    }
    case 'local': {
      const p = getLocalSettingsPath();
      const settings = safeReadJson<SettingsLike>(p) || {};
      return { servers: normalizeServersFromSettings(settings) };
    }
    case 'plugin':
    default:
      return { servers: {} };
  }
}

/**
 * Check if enterprise config exists.
 * Original: _10 in chunks.131.mjs:534
 */
function enterpriseConfigExists(): boolean {
  return getEnterpriseSettingsPathCandidates().some((p) => existsSync(p));
}

/**
 * Check if server is allowed by policy.
 * Original: P10 in chunks.131.mjs:525
 */
function isServerAllowedByPolicy(
  serverName: string,
  serverConfig: McpServerConfig
): boolean {
  // 1) 明确 disabled 的 server 永远不加载
  if ((serverConfig as any)?.disabled === true) return false;

  // 2) 可选 allow/deny list（环境变量），用于企业/托管策略
  const allow = process.env.CLAUDE_POLICY_MCP_ALLOWLIST;
  if (allow) {
    const allowed = new Set(
      allow
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    if (!allowed.has(serverName)) return false;
  }

  const deny = process.env.CLAUDE_POLICY_MCP_DENYLIST;
  if (deny) {
    const denied = new Set(
      deny
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    if (denied.has(serverName)) return false;
  }

  return true;
}

/**
 * Get project server approval status.
 * Original: C21 in chunks.131.mjs:510
 */
function getProjectServerApprovalStatus(
  serverName: string
): 'approved' | 'pending' | 'denied' {
  // 兼容 CLI settings：~/.claude/settings.json 里的 approvedMcpServers
  const userSettings = safeReadJson<SettingsLike>(getUserSettingsPath()) || {};
  const approved = Array.isArray(userSettings.approvedMcpServers)
    ? new Set(userSettings.approvedMcpServers)
    : new Set<string>();

  const disabled = Array.isArray(userSettings.disabledMcpServers)
    ? new Set(userSettings.disabledMcpServers)
    : new Set<string>();

  if (disabled.has(serverName)) return 'denied';

  // 若用户 scope 中显式声明了该 server，则视为已批准（与 CLI loader.ts 行为一致）
  const userServers = normalizeServersFromSettings(userSettings);
  if (userServers[serverName]) return 'approved';

  if (approved.has(serverName)) return 'approved';

  // 可选：允许通过 env 跳过审批（用于测试/CI）
  if (process.env.CLAUDE_CODE_AUTO_APPROVE_PROJECT_MCP === 'true') return 'approved';

  return 'pending';
}

/**
 * Discover plugins and their MCP servers.
 * Original: To2 (getPluginMcpServers) in chunks.130.mjs:1530-1537
 */
async function discoverPluginsAndHooks(): Promise<{
  servers: Record<string, McpServerConfig>;
  errors: Array<{ server: string; error: string }>;
}> {
  // Original: DG in chunks.131.mjs:544
  // 尝试从已安装插件的 manifest 里读取 `mcpServers`（若存在）。
  // 该字段不在当前还原的 plugin types 中，但 source 运行时支持插件扩展。
  const errors: Array<{ server: string; error: string }> = [];
  const servers: Record<string, McpServerConfig> = {};

  const settings = safeReadJson<SettingsLike>(getUserSettingsPath()) || {};
  const enabledPlugins = Array.isArray(settings.enabledPlugins)
    ? settings.enabledPlugins.filter((x): x is string => typeof x === 'string')
    : [];
  if (enabledPlugins.length === 0) return { servers, errors };

  const registryPath = join(getClaudeDir(), 'installed_plugins_v2.json');
  const registry = safeReadJson<{ version?: number; plugins?: Record<string, Array<{ installPath?: string }> > }>(registryPath);
  if (!registry?.plugins) return { servers, errors };

  for (const pluginId of enabledPlugins) {
    const entries = registry.plugins[pluginId];
    const installPath = entries && entries[0] && typeof entries[0].installPath === 'string'
      ? entries[0].installPath
      : undefined;
    if (!installPath) continue;

    const manifestPath = join(installPath, '.claude-plugin', 'plugin.json');
    const manifest = safeReadJson<any>(manifestPath);
    const rawServers = manifest?.mcpServers;
    if (!rawServers || typeof rawServers !== 'object') continue;

    for (const [name, cfg] of Object.entries(rawServers as Record<string, unknown>)) {
      try {
        const parsed = parseServerConfig(name, cfg);
        if (parsed) {
          servers[name] = parsed;
        } else {
          errors.push({ server: name, error: 'Invalid MCP server config in plugin manifest' });
        }
      } catch (err) {
        errors.push({ server: name, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  return { servers, errors };
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
  // Original: let {servers: A} = sX("enterprise")
  // Step 1: Load enterprise servers (highest priority)
  const { servers: enterpriseServers } = loadScopeServers('enterprise');

  // Step 2: If enterprise config exists, ONLY use enterprise servers
  // Original: if (_10()) { ... }
  if (enterpriseConfigExists()) {
    const filteredServers: Record<string, McpServerConfig> = {};
    for (const [name, config] of Object.entries(enterpriseServers)) {
      // Apply policy filter
      // Original: if (!P10(K, D)) continue;
      if (!isServerAllowedByPolicy(name, config)) continue;
      filteredServers[name] = config;
    }
    return { servers: filteredServers, errors: [] };
  }

  // Step 3: Load from all other scopes
  // Original: let {servers: Q} = sX("user"), {servers: B} = sX("project"), {servers: G} = sX("local")
  const { servers: userServers } = loadScopeServers('user');
  const { servers: projectServers } = loadScopeServers('project');
  const { servers: localServers } = loadScopeServers('local');

  // Step 4: Load plugin-provided servers
  // Original: I = await DG()
  const pluginResult = await discoverPluginsAndHooks();
  const pluginServers = pluginResult.servers;
  const pluginErrors = pluginResult.errors;

  // Step 5: Filter project servers to only "approved" ones
  // Original: for (let [F, K] of Object.entries(B)) if (C21(F) === "approved") J[F] = K;
  const approvedProjectServers: Record<string, McpServerConfig> = {};
  for (const [name, config] of Object.entries(projectServers)) {
    if (getProjectServerApprovalStatus(name) === 'approved') {
      approvedProjectServers[name] = config;
    }
  }

  // Step 6: Merge servers (later overwrites earlier)
  // Priority: plugins → user → approved project → local
  // Original: let W = Object.assign({}, Z, Q, J, G)
  const mergedServers: Record<string, McpServerConfig> = {
    ...pluginServers,
    ...userServers,
    ...approvedProjectServers,
    ...localServers,
  };

  // Step 7: Apply policy filters
  // Original: for (let [F, K] of Object.entries(W)) { if (!P10(F, K)) continue; X[F] = K }
  const filteredServers: Record<string, McpServerConfig> = {};
  for (const [name, config] of Object.entries(mergedServers)) {
    if (!isServerAllowedByPolicy(name, config)) continue;
    filteredServers[name] = config;
  }

  return { servers: filteredServers, errors: pluginErrors };
}

/**
 * Find MCP server by name across all scopes.
 * Original: vs in chunks.131.mjs:518
 */
export function findMcpServer(serverName: string): (McpServerConfig & { scope: McpConfigScope }) | null {
  const { servers: enterprise } = loadScopeServers('enterprise');
  if (enterprise[serverName]) return { ...enterprise[serverName], scope: 'enterprise' };

  const { servers: local } = loadScopeServers('local');
  if (local[serverName]) return { ...local[serverName], scope: 'local' };

  const { servers: project } = loadScopeServers('project');
  if (project[serverName]) return { ...project[serverName], scope: 'project' };

  const { servers: user } = loadScopeServers('user');
  if (user[serverName]) return { ...user[serverName], scope: 'user' };

  return null;
}

/**
 * Get MCP configuration (alias for loadAllMcpConfig).
 * Original: it in chunks.131.mjs:589
 */
export const getMcpConfiguration = loadAllMcpConfig;

// ============================================
// Server Config Parsing
// ============================================

/**
 * Parse server config object from JSON.
 * Original: efA (parseMcpConfigObject) in chunks.131.mjs:604-665
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
  const settings = safeReadJson<SettingsLike>(getUserSettingsPath()) || {};
  return Array.isArray(settings.disabledMcpServers) ? settings.disabledMcpServers.includes(serverName) : false;
}

/**
 * Get list of disabled servers.
 */
export function getDisabledServers(): string[] {
  const settings = safeReadJson<SettingsLike>(getUserSettingsPath()) || {};
  return Array.isArray(settings.disabledMcpServers)
    ? settings.disabledMcpServers.filter((s): s is string => typeof s === 'string')
    : [];
}

/**
 * Set server disabled status.
 */
export function setServerDisabled(
  serverName: string,
  disabled: boolean
): void {
  const filePath = getUserSettingsPath();
  const settings = safeReadJson<SettingsLike>(filePath) || {};
  const list = Array.isArray(settings.disabledMcpServers)
    ? settings.disabledMcpServers.filter((s): s is string => typeof s === 'string')
    : [];

  const set = new Set(list);
  if (disabled) set.add(serverName);
  else set.delete(serverName);

  (settings as any).disabledMcpServers = Array.from(set);
  safeWriteJson(filePath, settings);
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

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
