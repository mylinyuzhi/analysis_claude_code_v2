/**
 * @claudecode/plugin - Plugin Installation
 *
 * Install, uninstall, enable, and disable plugins.
 *
 * Reconstructed from chunks.91.mjs, chunks.130.mjs
 *
 * Key symbols:
 * - ofA → installPlugin
 * - G32 → cachePluginFromSource
 * - f_ → loadInstalledPlugins
 * - UI0 → saveInstalledPlugins
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  PluginSource,
  PluginManifest,
  InstalledPluginEntry,
  InstalledPluginsRegistry,
  InstallScope,
  MarketplacePluginEntry,
} from './types.js';

import {
  getPluginsDir,
  loadMarketplace,
  findPluginInMarketplace,
  formatSourceName,
} from './marketplace.js';

// ============================================
// Constants
// ============================================

/** Installed plugins v1 filename (legacy) */
const INSTALLED_PLUGINS_V1_FILE = 'installed_plugins.json';

/** Installed plugins v2 filename */
const INSTALLED_PLUGINS_V2_FILE = 'installed_plugins_v2.json';

/** Plugin cache directory */
const CACHE_DIR = 'cache';

/** Plugin manifest directory */
const PLUGIN_DIR = '.claude-plugin';

/** Plugin manifest filename */
const PLUGIN_MANIFEST = 'plugin.json';

// ============================================
// Path Utilities
// ============================================

/**
 * Get home directory.
 */
function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '';
}

/**
 * Get installed plugins registry path.
 */
export function getInstalledPluginsPath(): string {
  return path.join(getHomeDir(), '.claude', INSTALLED_PLUGINS_V2_FILE);
}

/**
 * Get plugin cache directory.
 */
export function getPluginCacheDir(): string {
  return path.join(getPluginsDir(), CACHE_DIR);
}

/**
 * Get plugin install path.
 */
export function getPluginInstallPath(
  marketplace: string,
  pluginName: string,
  version: string
): string {
  return path.join(getPluginCacheDir(), marketplace, pluginName, version);
}

// ============================================
// Installed Plugins Registry
// ============================================

/**
 * Load installed plugins registry.
 * Original: f_ in chunks.91.mjs
 */
export async function loadInstalledPlugins(): Promise<InstalledPluginsRegistry> {
  const filePath = getInstalledPluginsPath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Check version
      if (data.version === 2) {
        return data;
      }

      // Migrate from v1 if needed
      return migrateV1ToV2(data);
    }
  } catch (error) {
    console.error('[Plugin] Failed to load installed plugins:', error);
  }

  // Return empty registry
  return { version: 2, plugins: {} };
}

/**
 * Save installed plugins registry.
 * Original: UI0 in chunks.91.mjs
 */
export async function saveInstalledPlugins(registry: InstalledPluginsRegistry): Promise<void> {
  const filePath = getInstalledPluginsPath();

  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Plugin] Failed to save installed plugins:', error);
    throw error;
  }
}

/**
 * Migrate v1 registry to v2 format.
 */
function migrateV1ToV2(v1Data: Record<string, unknown>): InstalledPluginsRegistry {
  const plugins: Record<string, InstalledPluginEntry[]> = {};

  for (const [pluginId, entry] of Object.entries(v1Data)) {
    if (typeof entry === 'object' && entry !== null) {
      const v1Entry = entry as {
        installPath?: string;
        version?: string;
        installedAt?: string;
      };

      plugins[pluginId] = [
        {
          scope: 'user',
          version: v1Entry.version || '1.0.0',
          installPath: v1Entry.installPath || '',
          installedAt: v1Entry.installedAt || new Date().toISOString(),
        },
      ];
    }
  }

  return { version: 2, plugins };
}

// ============================================
// Plugin Installation
// ============================================

/**
 * Parse plugin ID into name and marketplace.
 * Format: "plugin-name@marketplace" or "plugin-name" (uses default)
 */
export function parsePluginId(pluginId: string): { name: string; marketplace: string } {
  const atIndex = pluginId.lastIndexOf('@');
  if (atIndex > 0) {
    return {
      name: pluginId.substring(0, atIndex),
      marketplace: pluginId.substring(atIndex + 1),
    };
  }
  return { name: pluginId, marketplace: 'official' };
}

/**
 * Format plugin ID.
 */
export function formatPluginId(name: string, marketplace: string): string {
  return `${name}@${marketplace}`;
}

/**
 * Load plugin manifest from path.
 */
async function loadPluginManifest(pluginPath: string): Promise<PluginManifest | null> {
  const manifestPath = path.join(pluginPath, PLUGIN_DIR, PLUGIN_MANIFEST);

  try {
    if (fs.existsSync(manifestPath)) {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Ignore errors
  }

  return null;
}

/**
 * Cache plugin from source.
 * Original: G32 in chunks.130.mjs
 */
export async function cachePluginFromSource(
  source: PluginSource,
  marketplace: string,
  pluginName: string,
  version: string,
  progressCallback?: (message: string) => void
): Promise<string> {
  const installPath = getPluginInstallPath(marketplace, pluginName, version);

  progressCallback?.(`Caching plugin to ${installPath}...`);

  switch (source.source) {
    case 'directory': {
      // For directory source, just use the path directly
      return source.path;
    }

    case 'github':
    case 'github-default-branch': {
      // In real implementation:
      // 1. Clone repo to install path
      // 2. Checkout correct branch/ref
      // 3. Return install path
      throw new Error('GitHub source caching not yet implemented');
    }

    case 'git': {
      // In real implementation:
      // 1. Clone repo to install path
      // 2. Checkout ref if specified
      // 3. Return install path
      throw new Error('Git source caching not yet implemented');
    }

    default:
      throw new Error(`Unsupported source type for caching: ${source.source}`);
  }
}

/**
 * Install a plugin.
 * Original: ofA in chunks.91.mjs
 */
export async function installPlugin(
  pluginId: string,
  options: {
    scope?: InstallScope;
    projectPath?: string;
    progressCallback?: (message: string) => void;
  } = {}
): Promise<{ pluginId: string; installPath: string }> {
  const { name, marketplace } = parsePluginId(pluginId);
  const scope = options.scope || 'user';
  const progressCallback = options.progressCallback;

  progressCallback?.(`Looking up plugin ${name} in marketplace ${marketplace}...`);

  // 1. Find plugin in marketplace
  const pluginEntry = await findPluginInMarketplace(marketplace, name);
  if (!pluginEntry) {
    throw new Error(`Plugin '${name}' not found in marketplace '${marketplace}'.`);
  }

  // 2. Check if already installed
  const registry = await loadInstalledPlugins();
  const fullPluginId = formatPluginId(name, marketplace);

  if (registry.plugins[fullPluginId]) {
    const existing = registry.plugins[fullPluginId].find(
      (e) => e.scope === scope && (!options.projectPath || e.projectPath === options.projectPath)
    );
    if (existing) {
      throw new Error(
        `Plugin '${fullPluginId}' is already installed in scope '${scope}'.` +
          ` Use '/plugin update ${fullPluginId}' to update.`
      );
    }
  }

  // 3. Get source from plugin entry
  let source: PluginSource;
  if (typeof pluginEntry.source === 'string') {
    // Relative path from marketplace
    const marketplaceConfig = await loadMarketplace(marketplace);
    if (!marketplaceConfig) {
      throw new Error(`Failed to load marketplace '${marketplace}'.`);
    }
    // Treat as directory relative to marketplace
    source = { source: 'directory', path: pluginEntry.source };
  } else {
    source = pluginEntry.source;
  }

  // 4. Cache plugin
  progressCallback?.(`Downloading plugin ${name}...`);
  const version = pluginEntry.version || '1.0.0';
  const installPath = await cachePluginFromSource(
    source,
    marketplace,
    name,
    version,
    progressCallback
  );

  // 5. Validate plugin manifest
  const manifest = await loadPluginManifest(installPath);
  if (!manifest) {
    throw new Error(`Invalid plugin: no manifest found at ${installPath}`);
  }

  // 6. Register installation
  if (!registry.plugins[fullPluginId]) {
    registry.plugins[fullPluginId] = [];
  }

  registry.plugins[fullPluginId].push({
    scope,
    version,
    installPath,
    installedAt: new Date().toISOString(),
    projectPath: options.projectPath,
  });

  await saveInstalledPlugins(registry);

  progressCallback?.(`Successfully installed ${fullPluginId}`);
  console.log(`[Plugin] Installed: ${fullPluginId} (${scope})`);

  return { pluginId: fullPluginId, installPath };
}

/**
 * Uninstall a plugin.
 */
export async function uninstallPlugin(
  pluginId: string,
  options: {
    scope?: InstallScope;
    projectPath?: string;
  } = {}
): Promise<void> {
  const { name, marketplace } = parsePluginId(pluginId);
  const fullPluginId = formatPluginId(name, marketplace);
  const scope = options.scope || 'user';

  const registry = await loadInstalledPlugins();

  if (!registry.plugins[fullPluginId]) {
    throw new Error(`Plugin '${fullPluginId}' is not installed.`);
  }

  // Find and remove the matching installation
  const entries = registry.plugins[fullPluginId];
  const index = entries.findIndex(
    (e) => e.scope === scope && (!options.projectPath || e.projectPath === options.projectPath)
  );

  if (index === -1) {
    throw new Error(`Plugin '${fullPluginId}' is not installed in scope '${scope}'.`);
  }

  const entry = entries[index]!;

  // Remove from registry
  entries.splice(index, 1);
  if (entries.length === 0) {
    delete registry.plugins[fullPluginId];
  }

  await saveInstalledPlugins(registry);

  // Clean up cached files (if in cache directory)
  const cacheDir = getPluginCacheDir();
  if (entry.installPath.startsWith(cacheDir)) {
    try {
      fs.rmSync(entry.installPath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  console.log(`[Plugin] Uninstalled: ${fullPluginId} (${scope})`);
}

/**
 * Update a plugin to latest version.
 */
export async function updatePlugin(
  pluginId: string,
  options: {
    scope?: InstallScope;
    projectPath?: string;
    progressCallback?: (message: string) => void;
  } = {}
): Promise<{ pluginId: string; oldVersion: string; newVersion: string }> {
  const { name, marketplace } = parsePluginId(pluginId);
  const fullPluginId = formatPluginId(name, marketplace);
  const scope = options.scope || 'user';

  const registry = await loadInstalledPlugins();

  if (!registry.plugins[fullPluginId]) {
    throw new Error(`Plugin '${fullPluginId}' is not installed.`);
  }

  // Find the installation to update
  const entries = registry.plugins[fullPluginId];
  const entry = entries.find(
    (e) => e.scope === scope && (!options.projectPath || e.projectPath === options.projectPath)
  );

  if (!entry) {
    throw new Error(`Plugin '${fullPluginId}' is not installed in scope '${scope}'.`);
  }

  const oldVersion = entry.version;

  // Get latest version from marketplace
  const pluginEntry = await findPluginInMarketplace(marketplace, name);
  if (!pluginEntry) {
    throw new Error(`Plugin '${name}' not found in marketplace '${marketplace}'.`);
  }

  const newVersion = pluginEntry.version || '1.0.0';

  if (oldVersion === newVersion) {
    console.log(`[Plugin] ${fullPluginId} is already at latest version (${newVersion})`);
    return { pluginId: fullPluginId, oldVersion, newVersion };
  }

  // Re-install to update
  options.progressCallback?.(`Updating ${fullPluginId} from ${oldVersion} to ${newVersion}...`);

  // Get source
  let source: PluginSource;
  if (typeof pluginEntry.source === 'string') {
    source = { source: 'directory', path: pluginEntry.source };
  } else {
    source = pluginEntry.source;
  }

  // Cache new version
  const newInstallPath = await cachePluginFromSource(
    source,
    marketplace,
    name,
    newVersion,
    options.progressCallback
  );

  // Update registry entry
  entry.version = newVersion;
  entry.installPath = newInstallPath;
  entry.lastUpdated = new Date().toISOString();

  await saveInstalledPlugins(registry);

  console.log(`[Plugin] Updated: ${fullPluginId} (${oldVersion} → ${newVersion})`);

  return { pluginId: fullPluginId, oldVersion, newVersion };
}

/**
 * List installed plugins.
 */
export async function listInstalledPlugins(options: {
  scope?: InstallScope;
  projectPath?: string;
} = {}): Promise<
  Array<{
    pluginId: string;
    scope: InstallScope;
    version: string;
    installPath: string;
    installedAt: string;
  }>
> {
  const registry = await loadInstalledPlugins();
  const results: Array<{
    pluginId: string;
    scope: InstallScope;
    version: string;
    installPath: string;
    installedAt: string;
  }> = [];

  for (const [pluginId, entries] of Object.entries(registry.plugins)) {
    for (const entry of entries) {
      // Filter by scope if specified
      if (options.scope && entry.scope !== options.scope) continue;

      // Filter by project path if specified
      if (options.projectPath && entry.projectPath !== options.projectPath) continue;

      results.push({
        pluginId,
        scope: entry.scope,
        version: entry.version,
        installPath: entry.installPath,
        installedAt: entry.installedAt,
      });
    }
  }

  return results;
}

// ============================================
// Export
// ============================================

// NOTE: 本文件函数已在声明处导出；移除重复聚合导出。
