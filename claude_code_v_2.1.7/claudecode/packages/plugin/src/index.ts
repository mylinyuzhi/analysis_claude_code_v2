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
  setInlinePluginPaths,
  loadPluginDefinitionFromPath,
  // loadInlinePlugins is internal
  loadMarketplacePlugins,
  discoverPluginsAndHooks,
  // clearPluginCache, // Not implemented in current reconstruction
  // formatPluginError, // Not implemented in current reconstruction
  loadHooksFile,
  mergeHookConfigs,
  validateManifest,
} from './loader.js';

// ============================================
// Marketplace
// ============================================

export {
  // Path utilities
  // getPluginsDir, // Not exported from marketplace.ts
  getKnownMarketplacesPath,
  getMarketplacesCacheDir,
  // getMarketplaceInstallPath, // Not exported

  // Registry
  loadKnownMarketplaces,
  saveKnownMarketplaces,
  // getKnownMarketplace, // Not exported

  // Source utilities
  // formatSourceName, // Not exported
  // parseSourceString, // Not exported

  // Marketplace loading
  loadMarketplaceSource,
  loadMarketplaceManifest,
  // validateMarketplaceName, // Not exported

  // CRUD operations
  addMarketplaceSource,
  removeMarketplace,
  refreshMarketplace,
  listMarketplaces,
  updateAllMarketplaces,

  // Plugin lookup
  findPluginInCachedMarketplace,
  // searchPlugins, // Not implemented
  clearMarketplaceCache,
} from './marketplace.js';

// ============================================
// Installation
// ============================================

export {
  // Path utilities
  getInstalledPluginsPath,
  getPluginCacheDir,
  // getPluginInstallPath, // Not exported

  // Registry
  loadInstalledPlugins,
  saveInstalledPlugins,

  // Plugin ID utilities
  // parsePluginId, // Not exported
  // formatPluginId, // Not exported

  // Installation operations
  // cachePluginFromSource, // Not exported
  installPlugin,
  uninstallPlugin,
  updatePlugin,
  // listInstalledPlugins, // Not implemented
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

// ============================================
// LSP Configuration
// ============================================

export {
  expandLspServerConfig,
  loadLspServersFromPlugin,
  getAllLspServers,
} from './lsp-config.js';
