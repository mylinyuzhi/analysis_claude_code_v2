/**
 * @claudecode/plugin
 *
 * Plugin system for Claude Code.
 *
 * Features:
 * - Plugin discovery from marketplaces and inline paths
 * - Plugin manifest validation
 * - Component loading (commands, agents, skills, hooks, output styles)
 * - Memoized discovery for performance
 *
 * Reconstructed from chunks.91.mjs, chunks.130.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Schemas
// ============================================

export * from './schemas.js';

// ============================================
// Loader
// ============================================

export {
  setSessionContext,
  loadPluginDefinitionFromPath,
  loadInlinePlugins,
  loadMarketplacePlugins,
  discoverPluginsAndHooks,
  clearPluginCache,
  formatPluginError,
  loadHooksFile,
  mergeHookConfigs,
  validateManifest,
} from './loader.js';

// ============================================
// Marketplace
// ============================================

export {
  // Path utilities
  getPluginsDir,
  getKnownMarketplacesPath,
  getMarketplacesCacheDir,
  getMarketplaceInstallPath,

  // Registry
  loadKnownMarketplaces,
  saveKnownMarketplaces,
  getKnownMarketplace,

  // Source utilities
  formatSourceName,
  parseSourceString,

  // Marketplace loading
  loadMarketplaceSource,
  loadMarketplace,
  validateMarketplaceName,

  // CRUD operations
  addMarketplaceSource,
  removeMarketplace,
  refreshMarketplace,
  listMarketplaces,
  updateAllMarketplaces,

  // Plugin lookup
  findPluginInMarketplace,
  searchPlugins,
  clearMarketplaceCache,
} from './marketplace.js';

// ============================================
// Installation
// ============================================

export {
  // Path utilities
  getInstalledPluginsPath,
  getPluginCacheDir,
  getPluginInstallPath,

  // Registry
  loadInstalledPlugins,
  saveInstalledPlugins,

  // Plugin ID utilities
  parsePluginId,
  formatPluginId,

  // Installation operations
  cachePluginFromSource,
  installPlugin,
  uninstallPlugin,
  updatePlugin,
  listInstalledPlugins,
} from './installation.js';

// ============================================
// Settings
// ============================================

export {
  // Settings path
  getSettingsPath,
  loadSettings,
  saveSettings,

  // Enabled plugins
  getEnabledPlugins,
  setEnabledPlugins,
  isPluginEnabled,

  // Enable/disable operations
  enablePlugin,
  disablePlugin,
  togglePlugin,
  enablePlugins,
  disablePlugins,
  disableAllPlugins,

  // Summary
  getPluginStateSummary,
} from './settings.js';
