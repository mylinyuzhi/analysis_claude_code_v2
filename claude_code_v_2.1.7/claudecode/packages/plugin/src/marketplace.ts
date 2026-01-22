/**
 * @claudecode/plugin - Marketplace Management
 *
 * Discovery, registration, and management of plugin marketplaces.
 *
 * Reconstructed from chunks.91.mjs
 *
 * Key symbols:
 * - NS → addMarketplaceSource
 * - VI0 → loadMarketplaceSource (fetchMarketplace)
 * - _Z1 → removeMarketplace
 * - D5 → loadKnownMarketplaces
 * - FVA → saveKnownMarketplaces
 * - rC → loadMarketplace (with caching)
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  PluginSource,
  MarketplaceManifest,
  MarketplacePluginEntry,
  KnownMarketplace,
} from './types.js';

// ============================================
// Constants
// ============================================

/** Base directory for plugins */
const PLUGINS_BASE_DIR = '.claude/plugins';

/** Known marketplaces filename */
const KNOWN_MARKETPLACES_FILE = 'known_marketplaces.json';

/** Marketplace cache directory */
const MARKETPLACES_DIR = 'marketplaces';

/** Marketplace manifest filename */
const MARKETPLACE_MANIFEST = 'marketplace.json';

/** Plugin manifest directory */
const PLUGIN_DIR = '.claude-plugin';

/** Default official marketplace */
const OFFICIAL_MARKETPLACE = 'official';

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
 * Get plugins directory.
 */
export function getPluginsDir(): string {
  return path.join(getHomeDir(), PLUGINS_BASE_DIR);
}

/**
 * Get known marketplaces file path.
 */
export function getKnownMarketplacesPath(): string {
  return path.join(getPluginsDir(), KNOWN_MARKETPLACES_FILE);
}

/**
 * Get marketplace cache directory.
 */
export function getMarketplacesCacheDir(): string {
  return path.join(getPluginsDir(), MARKETPLACES_DIR);
}

/**
 * Get marketplace install location.
 */
export function getMarketplaceInstallPath(marketplaceName: string): string {
  return path.join(getMarketplacesCacheDir(), marketplaceName);
}

// ============================================
// Known Marketplaces Registry
// ============================================

/**
 * Load known marketplaces from disk.
 * Original: D5 in chunks.91.mjs
 */
export async function loadKnownMarketplaces(): Promise<Record<string, KnownMarketplace>> {
  const filePath = getKnownMarketplacesPath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[Plugin] Failed to load known marketplaces:', error);
  }

  return {};
}

/**
 * Save known marketplaces to disk.
 * Original: FVA in chunks.91.mjs
 */
export async function saveKnownMarketplaces(
  marketplaces: Record<string, KnownMarketplace>
): Promise<void> {
  const filePath = getKnownMarketplacesPath();

  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(marketplaces, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Plugin] Failed to save known marketplaces:', error);
    throw error;
  }
}

/**
 * Get a specific known marketplace.
 */
export async function getKnownMarketplace(name: string): Promise<KnownMarketplace | null> {
  const marketplaces = await loadKnownMarketplaces();
  return marketplaces[name] ?? null;
}

// ============================================
// Source Formatting
// ============================================

/**
 * Format source name for display.
 * Original: KVA in chunks.91.mjs
 */
export function formatSourceName(source: PluginSource): string {
  switch (source.source) {
    case 'github':
      return `github:${source.repo}${source.ref ? `@${source.ref}` : ''}`;
    case 'github-default-branch':
      return `github:${source.repo}${source.path ? `/${source.path}` : ''}`;
    case 'git':
      return `git:${source.url}${source.ref ? `@${source.ref}` : ''}`;
    case 'url':
      return `url:${source.url}`;
    case 'file':
      return `file:${source.path}`;
    case 'directory':
      return `dir:${source.path}`;
    case 'npm':
      return `npm:${source.package}`;
    default:
      return 'unknown';
  }
}

/**
 * Parse source string into PluginSource object.
 */
export function parseSourceString(sourceStr: string): PluginSource | null {
  // Check for github shorthand (owner/repo)
  if (/^[\w-]+\/[\w-]+$/.test(sourceStr)) {
    return {
      source: 'github-default-branch',
      repo: sourceStr,
    };
  }

  // Check for github URL
  if (sourceStr.startsWith('https://github.com/')) {
    const match = sourceStr.match(/github\.com\/([\w-]+\/[\w-]+)/);
    if (match) {
      const repo = match[1];
      if (!repo) return null;
      return {
        source: 'github-default-branch',
        repo,
      };
    }
  }

  // Check for git URL
  if (sourceStr.startsWith('git@') || sourceStr.endsWith('.git')) {
    return {
      source: 'git',
      url: sourceStr,
    };
  }

  // Check for HTTP URL
  if (sourceStr.startsWith('http://') || sourceStr.startsWith('https://')) {
    return {
      source: 'url',
      url: sourceStr,
    };
  }

  // Check for local path
  if (sourceStr.startsWith('/') || sourceStr.startsWith('.') || sourceStr.startsWith('~')) {
    const resolvedPath = sourceStr.startsWith('~')
      ? path.join(getHomeDir(), sourceStr.slice(1))
      : path.resolve(sourceStr);

    // Check if it's a file or directory
    try {
      const stat = fs.statSync(resolvedPath);
      if (stat.isDirectory()) {
        return { source: 'directory', path: resolvedPath };
      } else {
        return { source: 'file', path: resolvedPath };
      }
    } catch {
      // Path doesn't exist yet, assume directory
      return { source: 'directory', path: resolvedPath };
    }
  }

  // Check for npm package
  if (sourceStr.startsWith('@') || /^[\w-]+$/.test(sourceStr)) {
    return {
      source: 'npm',
      package: sourceStr,
    };
  }

  return null;
}

// ============================================
// Marketplace Loading
// ============================================

/**
 * Load marketplace manifest from path.
 */
async function loadMarketplaceManifestFromPath(dirPath: string): Promise<MarketplaceManifest | null> {
  // Try .claude-plugin/marketplace.json
  const pluginManifestPath = path.join(dirPath, PLUGIN_DIR, MARKETPLACE_MANIFEST);
  if (fs.existsSync(pluginManifestPath)) {
    try {
      const content = fs.readFileSync(pluginManifestPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Continue to try other paths
    }
  }

  // Try marketplace.json in root
  const rootManifestPath = path.join(dirPath, MARKETPLACE_MANIFEST);
  if (fs.existsSync(rootManifestPath)) {
    try {
      const content = fs.readFileSync(rootManifestPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Load marketplace from source.
 * Original: VI0 (fetchMarketplace) in chunks.91.mjs
 */
export async function loadMarketplaceSource(
  source: PluginSource,
  progressCallback?: (message: string) => void
): Promise<{ marketplace: MarketplaceManifest; cachePath: string }> {
  progressCallback?.(`Loading marketplace from ${formatSourceName(source)}...`);

  switch (source.source) {
    case 'directory': {
      const manifest = await loadMarketplaceManifestFromPath(source.path);
      if (!manifest) {
        throw new Error(`No marketplace manifest found in ${source.path}`);
      }
      return { marketplace: manifest, cachePath: source.path };
    }

    case 'file': {
      const content = fs.readFileSync(source.path, 'utf-8');
      const manifest = JSON.parse(content);
      return { marketplace: manifest, cachePath: path.dirname(source.path) };
    }

    case 'github':
    case 'github-default-branch': {
      // In real implementation:
      // 1. Clone repo to cache directory
      // 2. Checkout correct branch/ref
      // 3. Load marketplace.json
      throw new Error('GitHub source not yet implemented in stub');
    }

    case 'git': {
      // In real implementation:
      // 1. Clone repo to cache directory
      // 2. Checkout ref if specified
      // 3. Load marketplace.json
      throw new Error('Git source not yet implemented in stub');
    }

    case 'url': {
      // In real implementation:
      // 1. Fetch URL
      // 2. Parse JSON
      // 3. Cache locally
      throw new Error('URL source not yet implemented in stub');
    }

    case 'npm': {
      throw new Error('NPM source not yet implemented');
    }

    default:
      throw new Error(`Unknown source type: ${(source as PluginSource).source}`);
  }
}

/**
 * Load marketplace with caching.
 * Original: rC in chunks.91.mjs
 */
export async function loadMarketplace(
  name: string,
  forceRefresh = false
): Promise<MarketplaceManifest | null> {
  // Get known marketplace
  const known = await getKnownMarketplace(name);
  if (!known) {
    return null;
  }

  const cachePath = known.installLocation;

  // Check if refresh needed
  if (!forceRefresh && fs.existsSync(cachePath)) {
    const manifest = await loadMarketplaceManifestFromPath(cachePath);
    if (manifest) {
      return manifest;
    }
  }

  // Reload from source
  try {
    const { marketplace } = await loadMarketplaceSource(known.source);
    return marketplace;
  } catch (error) {
    console.error(`[Plugin] Failed to load marketplace ${name}:`, error);
    return null;
  }
}

// ============================================
// Marketplace CRUD
// ============================================

/**
 * Validate marketplace name.
 * Original: c62 in chunks.91.mjs
 */
export function validateMarketplaceName(
  name: string,
  source: PluginSource
): string | null {
  // Name must be lowercase alphanumeric with hyphens
  if (!/^[a-z0-9-]+$/.test(name)) {
    return `Invalid marketplace name '${name}'. Names must be lowercase alphanumeric with hyphens.`;
  }

  // Reserved names
  const reserved = ['inline', 'local', 'official', 'plugin', 'claude'];
  if (reserved.includes(name)) {
    return `Marketplace name '${name}' is reserved.`;
  }

  return null;
}

/**
 * Add a new marketplace source.
 * Original: NS in chunks.91.mjs:136-156
 */
export async function addMarketplaceSource(
  source: PluginSource,
  progressCallback?: (message: string) => void
): Promise<{ name: string }> {
  // 1. Check enterprise policy (stub - always allowed)
  // In real implementation: check isMarketplaceSourceAllowed(source)

  // 2. Download and validate marketplace
  const { marketplace, cachePath } = await loadMarketplaceSource(source, progressCallback);

  // 3. Validate marketplace name
  const validationError = validateMarketplaceName(marketplace.name, source);
  if (validationError) {
    throw new Error(validationError);
  }

  // 4. Check if already installed
  const knownMarketplaces = await loadKnownMarketplaces();
  if (knownMarketplaces[marketplace.name]) {
    throw new Error(
      `Marketplace '${marketplace.name}' is already installed. ` +
        `Please remove it first using '/plugin marketplace remove ${marketplace.name}'.`
    );
  }

  // 5. Register marketplace
  knownMarketplaces[marketplace.name] = {
    source,
    installLocation: cachePath,
    lastUpdated: new Date().toISOString(),
  };

  await saveKnownMarketplaces(knownMarketplaces);

  console.log(`[Plugin] Added marketplace source: ${marketplace.name}`);

  return { name: marketplace.name };
}

/**
 * Remove a marketplace.
 * Original: _Z1 in chunks.91.mjs
 */
export async function removeMarketplace(name: string): Promise<void> {
  const knownMarketplaces = await loadKnownMarketplaces();

  if (!knownMarketplaces[name]) {
    throw new Error(`Marketplace '${name}' is not installed.`);
  }

  // Get install location for cleanup
  const installLocation = knownMarketplaces[name].installLocation;

  // Remove from registry
  delete knownMarketplaces[name];
  await saveKnownMarketplaces(knownMarketplaces);

  // Clean up cached files (if not a local source)
  if (installLocation.startsWith(getMarketplacesCacheDir())) {
    try {
      fs.rmSync(installLocation, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  console.log(`[Plugin] Removed marketplace: ${name}`);
}

/**
 * Refresh marketplace from source.
 */
export async function refreshMarketplace(
  name: string,
  progressCallback?: (message: string) => void
): Promise<MarketplaceManifest> {
  const known = await getKnownMarketplace(name);
  if (!known) {
    throw new Error(`Marketplace '${name}' is not installed.`);
  }

  progressCallback?.(`Refreshing marketplace ${name}...`);

  const { marketplace } = await loadMarketplaceSource(known.source, progressCallback);

  // Update last updated time
  const knownMarketplaces = await loadKnownMarketplaces();
  if (knownMarketplaces[name]) {
    knownMarketplaces[name].lastUpdated = new Date().toISOString();
    await saveKnownMarketplaces(knownMarketplaces);
  }

  return marketplace;
}

/**
 * Update all known marketplaces.
 * Original: X32 in chunks.157.mjs:1051
 */
export async function updateAllMarketplaces(): Promise<void> {
  const marketplaces = await loadKnownMarketplaces();
  for (const name of Object.keys(marketplaces)) {
    try {
      await refreshMarketplace(name);
    } catch (error) {
      console.error(`[Plugin] Failed to refresh marketplace ${name}:`, error);
    }
  }
}

/**
 * List all known marketplaces.
 */
export async function listMarketplaces(): Promise<
  Array<{ name: string; source: PluginSource; lastUpdated: string }>
> {
  const known = await loadKnownMarketplaces();

  return Object.entries(known).map(([name, config]) => ({
    name,
    source: config.source,
    lastUpdated: config.lastUpdated,
  }));
}

// ============================================
// Plugin Lookup
// ============================================

/**
 * Find plugin in marketplace.
 */
export async function findPluginInMarketplace(
  marketplaceName: string,
  pluginName: string
): Promise<MarketplacePluginEntry | null> {
  const marketplace = await loadMarketplace(marketplaceName);
  if (!marketplace) {
    return null;
  }

  return marketplace.plugins.find((p) => p.name === pluginName) ?? null;
}

/**
 * Search for plugin across all marketplaces.
 */
export async function searchPlugins(
  query: string
): Promise<Array<{ marketplace: string; plugin: MarketplacePluginEntry }>> {
  const results: Array<{ marketplace: string; plugin: MarketplacePluginEntry }> = [];
  const knownMarketplaces = await loadKnownMarketplaces();
  const lowerQuery = query.toLowerCase();

  for (const marketplaceName of Object.keys(knownMarketplaces)) {
    const marketplace = await loadMarketplace(marketplaceName);
    if (!marketplace) continue;

    for (const plugin of marketplace.plugins) {
      if (
        plugin.name.toLowerCase().includes(lowerQuery) ||
        plugin.description?.toLowerCase().includes(lowerQuery) ||
        plugin.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ marketplace: marketplaceName, plugin });
      }
    }
  }

  return results;
}

/**
 * Clear marketplace cache.
 */
export function clearMarketplaceCache(): void {
  // Placeholder - in real implementation, would clear memoized marketplace results
}

// ============================================
// Export
// ============================================

// NOTE: 本文件函数已在声明处导出；移除重复聚合导出。
