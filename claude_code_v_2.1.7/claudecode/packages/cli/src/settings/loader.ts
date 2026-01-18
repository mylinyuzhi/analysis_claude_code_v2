/**
 * @claudecode/cli - Settings Loader
 *
 * Load and parse settings from various configuration sources.
 * Reconstructed from source code analysis.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ============================================
// Types
// ============================================

/**
 * MCP server configuration.
 */
export interface McpServerConfig {
  type?: 'stdio' | 'sse' | 'http' | 'ws' | 'ws-ide' | 'sse-ide' | 'sdk';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  disabled?: boolean;
}

/**
 * Claude Code settings structure.
 */
export interface ClaudeSettings {
  mcpServers?: Record<string, McpServerConfig>;
  disabledMcpServers?: string[];
  approvedMcpServers?: string[];
  permissions?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

/**
 * Settings scope.
 */
export type SettingsScope = 'user' | 'project' | 'local' | 'enterprise';

// ============================================
// Path Utilities
// ============================================

/**
 * Get Claude data directory.
 */
export function getClaudeDataDir(): string {
  const homeDir = os.homedir();

  // macOS: ~/Library/Application Support/claude
  if (process.platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support', 'claude');
  }

  // Linux: ~/.config/claude or $XDG_CONFIG_HOME/claude
  if (process.platform === 'linux') {
    const xdgConfig = process.env.XDG_CONFIG_HOME;
    if (xdgConfig) {
      return path.join(xdgConfig, 'claude');
    }
    return path.join(homeDir, '.config', 'claude');
  }

  // Windows: %APPDATA%/claude
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA;
    if (appData) {
      return path.join(appData, 'claude');
    }
    return path.join(homeDir, 'AppData', 'Roaming', 'claude');
  }

  // Fallback
  return path.join(homeDir, '.claude');
}

/**
 * Get user settings file path.
 */
export function getUserSettingsPath(): string {
  return path.join(getClaudeDataDir(), 'settings.json');
}

/**
 * Get project settings file path.
 */
export function getProjectSettingsPath(cwd?: string): string | null {
  const startDir = cwd || process.cwd();
  let currentDir = startDir;

  // Walk up directory tree looking for .mcp.json
  while (currentDir !== path.dirname(currentDir)) {
    const mcpPath = path.join(currentDir, '.mcp.json');
    if (fs.existsSync(mcpPath)) {
      return mcpPath;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Get local settings file path.
 */
export function getLocalSettingsPath(cwd?: string): string {
  const dir = cwd || process.cwd();
  return path.join(dir, '.claude.local.json');
}

/**
 * Get Claude home directory (~/.claude).
 */
export function getClaudeHomeDir(): string {
  return path.join(os.homedir(), '.claude');
}

/**
 * Get projects directory path.
 */
export function getProjectsDir(): string {
  return path.join(getClaudeHomeDir(), 'projects');
}

// ============================================
// Settings Loading
// ============================================

/**
 * Read JSON file safely.
 */
function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return null;
  }
}

/**
 * Load user settings.
 */
export function loadUserSettings(): ClaudeSettings {
  const settingsPath = getUserSettingsPath();
  return readJsonFile<ClaudeSettings>(settingsPath) || {};
}

/**
 * Load project settings (.mcp.json).
 */
export function loadProjectSettings(cwd?: string): ClaudeSettings {
  const settingsPath = getProjectSettingsPath(cwd);
  if (!settingsPath) {
    return {};
  }

  const config = readJsonFile<{ mcpServers?: Record<string, McpServerConfig> }>(settingsPath);
  if (!config) {
    return {};
  }

  return {
    mcpServers: config.mcpServers || {},
  };
}

/**
 * Load local settings (.claude.local.json).
 */
export function loadLocalSettings(cwd?: string): ClaudeSettings {
  const settingsPath = getLocalSettingsPath(cwd);
  return readJsonFile<ClaudeSettings>(settingsPath) || {};
}

/**
 * Load all settings merged (priority: local > project > user).
 */
export function loadAllSettings(cwd?: string): ClaudeSettings {
  const userSettings = loadUserSettings();
  const projectSettings = loadProjectSettings(cwd);
  const localSettings = loadLocalSettings(cwd);

  // Merge MCP servers (later overrides earlier)
  const mcpServers = {
    ...(userSettings.mcpServers || {}),
    ...(projectSettings.mcpServers || {}),
    ...(localSettings.mcpServers || {}),
  };

  // Merge disabled servers
  const disabledMcpServers = [
    ...(userSettings.disabledMcpServers || []),
    ...(localSettings.disabledMcpServers || []),
  ];

  // Merge approved servers
  const approvedMcpServers = [
    ...(userSettings.approvedMcpServers || []),
    ...(localSettings.approvedMcpServers || []),
  ];

  return {
    mcpServers,
    disabledMcpServers,
    approvedMcpServers,
    permissions: {
      ...(userSettings.permissions || {}),
      ...(localSettings.permissions || {}),
    },
    preferences: {
      ...(userSettings.preferences || {}),
      ...(localSettings.preferences || {}),
    },
  };
}

// ============================================
// Settings Writing
// ============================================

/**
 * Ensure directory exists.
 */
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write JSON file.
 */
function writeJsonFile(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Save user settings.
 */
export function saveUserSettings(settings: ClaudeSettings): void {
  const settingsPath = getUserSettingsPath();
  writeJsonFile(settingsPath, settings);
}

/**
 * Update user settings (partial).
 */
export function updateUserSettings(updates: Partial<ClaudeSettings>): void {
  const current = loadUserSettings();
  const merged = { ...current, ...updates };
  saveUserSettings(merged);
}

// ============================================
// MCP Server Settings
// ============================================

/**
 * Get MCP servers from settings.
 */
export function getMcpServers(cwd?: string): Record<string, McpServerConfig> {
  const settings = loadAllSettings(cwd);
  return settings.mcpServers || {};
}

/**
 * Check if MCP server is disabled.
 */
export function isServerDisabled(serverName: string, cwd?: string): boolean {
  const settings = loadAllSettings(cwd);
  return settings.disabledMcpServers?.includes(serverName) || false;
}

/**
 * Check if MCP server is approved.
 */
export function isServerApproved(serverName: string, cwd?: string): boolean {
  const settings = loadAllSettings(cwd);
  // User servers are auto-approved
  const userSettings = loadUserSettings();
  if (userSettings.mcpServers?.[serverName]) {
    return true;
  }
  return settings.approvedMcpServers?.includes(serverName) || false;
}

/**
 * Add MCP server to user settings.
 */
export function addMcpServer(
  serverName: string,
  config: McpServerConfig,
  scope: 'user' | 'project' | 'local' = 'user'
): void {
  if (scope === 'user') {
    const settings = loadUserSettings();
    settings.mcpServers = settings.mcpServers || {};
    settings.mcpServers[serverName] = config;
    saveUserSettings(settings);
  } else if (scope === 'project') {
    const projectPath = getProjectSettingsPath();
    if (projectPath) {
      const config2 = readJsonFile<{ mcpServers?: Record<string, McpServerConfig> }>(projectPath) || {};
      config2.mcpServers = config2.mcpServers || {};
      config2.mcpServers[serverName] = config;
      writeJsonFile(projectPath, config2);
    }
  } else {
    const localPath = getLocalSettingsPath();
    const settings = readJsonFile<ClaudeSettings>(localPath) || {};
    settings.mcpServers = settings.mcpServers || {};
    settings.mcpServers[serverName] = config;
    writeJsonFile(localPath, settings);
  }
}

/**
 * Remove MCP server from settings.
 */
export function removeMcpServer(serverName: string, scope: 'user' | 'project' | 'local' = 'user'): void {
  if (scope === 'user') {
    const settings = loadUserSettings();
    if (settings.mcpServers) {
      delete settings.mcpServers[serverName];
      saveUserSettings(settings);
    }
  }
}

/**
 * Enable/disable MCP server.
 */
export function setServerDisabled(serverName: string, disabled: boolean): void {
  const settings = loadUserSettings();
  settings.disabledMcpServers = settings.disabledMcpServers || [];

  if (disabled && !settings.disabledMcpServers.includes(serverName)) {
    settings.disabledMcpServers.push(serverName);
  } else if (!disabled) {
    settings.disabledMcpServers = settings.disabledMcpServers.filter((n) => n !== serverName);
  }

  saveUserSettings(settings);
}

// ============================================
// CLI Config Loading
// ============================================

/**
 * Parse MCP config from JSON string.
 */
export function parseMcpConfigJson(jsonString: string): Record<string, McpServerConfig> {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, McpServerConfig>;
    }
    return {};
  } catch {
    console.error('Failed to parse MCP config JSON');
    return {};
  }
}

/**
 * Load MCP config from file path.
 */
export function loadMcpConfigFile(filePath: string): Record<string, McpServerConfig> {
  const config = readJsonFile<{ mcpServers?: Record<string, McpServerConfig> }>(filePath);
  return config?.mcpServers || {};
}

// ============================================
// Environment Variable Substitution
// ============================================

/**
 * Substitute environment variables in string.
 * Pattern: ${VAR_NAME}
 */
export function substituteEnvVars(str: string): string {
  return str.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    return process.env[varName] || '';
  });
}

/**
 * Substitute environment variables in server config.
 */
export function substituteConfigEnvVars(config: McpServerConfig): McpServerConfig {
  const result = { ...config };

  if (result.command) {
    result.command = substituteEnvVars(result.command);
  }

  if (result.args) {
    result.args = result.args.map(substituteEnvVars);
  }

  if (result.env) {
    const newEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(result.env)) {
      newEnv[key] = substituteEnvVars(value);
    }
    result.env = newEnv;
  }

  if (result.url) {
    result.url = substituteEnvVars(result.url);
  }

  if (result.headers) {
    const newHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(result.headers)) {
      newHeaders[key] = substituteEnvVars(value);
    }
    result.headers = newHeaders;
  }

  return result;
}

// ============================================
// Export
// ============================================

export {
  getClaudeDataDir,
  getUserSettingsPath,
  getProjectSettingsPath,
  getLocalSettingsPath,
  getClaudeHomeDir,
  getProjectsDir,
  loadUserSettings,
  loadProjectSettings,
  loadLocalSettings,
  loadAllSettings,
  saveUserSettings,
  updateUserSettings,
  getMcpServers,
  isServerDisabled,
  isServerApproved,
  addMcpServer,
  removeMcpServer,
  setServerDisabled,
  parseMcpConfigJson,
  loadMcpConfigFile,
  substituteEnvVars,
  substituteConfigEnvVars,
};
