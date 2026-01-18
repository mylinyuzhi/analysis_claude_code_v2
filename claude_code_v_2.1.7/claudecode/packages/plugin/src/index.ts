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
} from './loader.js';
