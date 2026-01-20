/**
 * @claudecode/plugin - Plugin Loader
 *
 * Discovery and loading of plugins from marketplaces and inline paths.
 * Reconstructed from chunks.130.mjs:2612-3263
 */

import { readFileSync, existsSync, statSync, realpathSync, readdirSync } from 'fs';
import { join, basename, resolve } from 'path';
import type {
  PluginDefinition,
  PluginManifest,
  PluginDiscoveryResult,
  PluginError,
  HooksConfig,
  HooksFile,
} from './types.js';
import { pluginManifestSchema, hooksFileSchema } from './schemas.js';

// ============================================
// Memoization
// ============================================

/**
 * Simple memoization wrapper.
 * Original: W0 / _U1 in chunks.1.mjs:636-656
 */
function memoize<T>(fn: () => Promise<T>): (() => Promise<T>) & { cache?: Map<string, T> } {
  const cache = new Map<string, T>();
  const memoized = async () => {
    if (cache.has('result')) {
      return cache.get('result')!;
    }
    const result = await fn();
    cache.set('result', result);
    return result;
  };
  memoized.cache = cache;
  return memoized;
}

// ============================================
// Session Context (Placeholder)
// ============================================

interface SessionContext {
  inlinePlugins?: string[];
  enabledPlugins?: Record<string, boolean>;
}

let sessionContext: SessionContext = {};

/**
 * Set session context for plugin loading.
 */
export function setSessionContext(context: SessionContext): void {
  sessionContext = context;
}

/**
 * Get inline plugin paths from session.
 * Original: Qf0 in chunks.1.mjs:2678
 */
function getInlinePlugins(): string[] {
  return sessionContext.inlinePlugins || [];
}

/**
 * Get enabled plugins configuration.
 */
function getEnabledPlugins(): Record<string, boolean> {
  return sessionContext.enabledPlugins || {};
}

// ============================================
// File System Helpers
// ============================================

/**
 * Check if symlink points to already-loaded path (deduplication).
 */
function isSymlinkDuplicate(filePath: string, loadedPaths: Set<string>): boolean {
  try {
    const realPath = realpathSync(filePath);
    if (loadedPaths.has(realPath)) {
      return true;
    }
    loadedPaths.add(realPath);
    return false;
  } catch {
    if (loadedPaths.has(filePath)) {
      return true;
    }
    loadedPaths.add(filePath);
    return false;
  }
}

// ============================================
// Manifest Loading
// ============================================

/**
 * Load and validate plugin manifest.
 * Original: LF1 in chunks.130.mjs
 */
function loadManifest(
  manifestPath: string,
  pluginName: string,
  source: string
): PluginManifest {
  if (!existsSync(manifestPath)) {
    throw new Error(
      `Plugin manifest not found at ${manifestPath} for plugin ${pluginName}`
    );
  }

  const content = readFileSync(manifestPath, { encoding: 'utf-8' });
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Invalid JSON in plugin manifest: ${manifestPath}`);
  }

  const result = pluginManifestSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid plugin manifest for ${pluginName}: ${result.error.message}`
    );
  }

  return result.data as PluginManifest;
}

/**
 * Load hooks file.
 * Original: po2 in chunks.130.mjs:2602-2610
 */
function loadHooksFile(hooksPath: string, pluginName: string): HooksConfig {
  if (!existsSync(hooksPath)) {
    throw new Error(
      `Hooks file not found at ${hooksPath} for plugin ${pluginName}. If the manifest declares hooks, the file must exist.`
    );
  }

  const content = readFileSync(hooksPath, { encoding: 'utf-8' });
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Invalid JSON in hooks file: ${hooksPath}`);
  }

  const result = hooksFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Invalid hooks file for ${pluginName}: ${result.error.message}`);
  }

  return (result.data as HooksFile).hooks;
}

/**
 * Merge hook configurations.
 * Original: lo2 in chunks.130.mjs:2830-2838
 */
function mergeHookConfigs(
  baseConfig: HooksConfig | undefined,
  additionalConfig: HooksConfig
): HooksConfig {
  if (!baseConfig) return additionalConfig;

  const merged: HooksConfig = { ...baseConfig };

  for (const [hookType, hooks] of Object.entries(additionalConfig)) {
    const key = hookType as keyof HooksConfig;
    if (!merged[key]) {
      merged[key] = hooks;
    } else {
      merged[key] = [...(merged[key] || []), ...hooks];
    }
  }

  return merged;
}

// ============================================
// Plugin Definition Loading
// ============================================

/**
 * Load plugin definition from filesystem path.
 * Original: ao2 in chunks.130.mjs:2612-2820
 */
function loadPluginDefinitionFromPath(
  pluginPath: string,
  source: string,
  enabled: boolean,
  pluginName: string
): { plugin: PluginDefinition; errors: PluginError[] } {
  const errors: PluginError[] = [];

  // Load manifest
  const manifestPath = join(pluginPath, '.claude-plugin', 'plugin.json');
  const manifest = loadManifest(manifestPath, pluginName, source);

  // Base plugin definition
  const pluginDef: PluginDefinition = {
    name: manifest.name,
    manifest,
    path: pluginPath,
    source,
    repository: source,
    enabled,
  };

  // === COMMANDS ===
  const defaultCommandsPath = join(pluginPath, 'commands');
  if (!manifest.commands && existsSync(defaultCommandsPath)) {
    pluginDef.commandsPath = defaultCommandsPath;
  }

  if (manifest.commands) {
    if (typeof manifest.commands === 'string') {
      const cmdPath = join(pluginPath, manifest.commands);
      if (existsSync(cmdPath)) {
        pluginDef.commandsPaths = [cmdPath];
      } else {
        errors.push({
          type: 'path-not-found',
          source,
          plugin: manifest.name,
          path: cmdPath,
          component: 'commands',
        });
      }
    } else if (Array.isArray(manifest.commands)) {
      const resolvedPaths = manifest.commands
        .filter((p) => {
          const fullPath = join(pluginPath, p);
          if (existsSync(fullPath)) return true;
          errors.push({
            type: 'path-not-found',
            source,
            plugin: manifest.name,
            path: fullPath,
            component: 'commands',
          });
          return false;
        })
        .map((p) => join(pluginPath, p));
      if (resolvedPaths.length > 0) {
        pluginDef.commandsPaths = resolvedPaths;
      }
    } else {
      // Object format with metadata
      pluginDef.commandsMetadata = {};
      const commandsPaths: string[] = [];

      for (const [cmdName, cmdDef] of Object.entries(manifest.commands)) {
        if (cmdDef.source) {
          const cmdPath = join(pluginPath, cmdDef.source);
          if (existsSync(cmdPath)) {
            commandsPaths.push(cmdPath);
            pluginDef.commandsMetadata[cmdName] = cmdDef;
          } else {
            errors.push({
              type: 'path-not-found',
              source,
              plugin: manifest.name,
              path: cmdPath,
              component: 'commands',
            });
          }
        } else if (cmdDef.content) {
          pluginDef.commandsMetadata[cmdName] = cmdDef;
        }
      }

      if (commandsPaths.length > 0) {
        pluginDef.commandsPaths = commandsPaths;
      }
    }
  }

  // === AGENTS ===
  const defaultAgentsPath = join(pluginPath, 'agents');
  if (!manifest.agents && existsSync(defaultAgentsPath)) {
    pluginDef.agentsPath = defaultAgentsPath;
  }

  if (manifest.agents) {
    const paths = Array.isArray(manifest.agents)
      ? manifest.agents
      : [manifest.agents];
    const resolvedPaths = paths
      .filter((p) => {
        const fullPath = join(pluginPath, p);
        if (existsSync(fullPath)) return true;
        errors.push({
          type: 'path-not-found',
          source,
          plugin: manifest.name,
          path: fullPath,
          component: 'agents',
        });
        return false;
      })
      .map((p) => join(pluginPath, p));
    if (resolvedPaths.length > 0) {
      pluginDef.agentsPaths = resolvedPaths;
    }
  }

  // === SKILLS ===
  const defaultSkillsPath = join(pluginPath, 'skills');
  if (!manifest.skills && existsSync(defaultSkillsPath)) {
    pluginDef.skillsPath = defaultSkillsPath;
  }

  if (manifest.skills) {
    const paths = Array.isArray(manifest.skills)
      ? manifest.skills
      : [manifest.skills];
    const resolvedPaths = paths
      .filter((p) => {
        const fullPath = join(pluginPath, p);
        if (existsSync(fullPath)) return true;
        errors.push({
          type: 'path-not-found',
          source,
          plugin: manifest.name,
          path: fullPath,
          component: 'skills',
        });
        return false;
      })
      .map((p) => join(pluginPath, p));
    if (resolvedPaths.length > 0) {
      pluginDef.skillsPaths = resolvedPaths;
    }
  }

  // === OUTPUT STYLES ===
  const defaultOutputStylesPath = join(pluginPath, 'output-styles');
  if (!manifest.outputStyles && existsSync(defaultOutputStylesPath)) {
    pluginDef.outputStylesPath = defaultOutputStylesPath;
  }

  if (manifest.outputStyles) {
    const paths = Array.isArray(manifest.outputStyles)
      ? manifest.outputStyles
      : [manifest.outputStyles];
    const resolvedPaths = paths
      .filter((p) => existsSync(join(pluginPath, p)))
      .map((p) => join(pluginPath, p));
    if (resolvedPaths.length > 0) {
      pluginDef.outputStylesPaths = resolvedPaths;
    }
  }

  // === HOOKS ===
  let hooksConfig: HooksConfig | undefined;
  const loadedHookFiles = new Set<string>();

  // Load from standard location
  const standardHooksPath = join(pluginPath, 'hooks', 'hooks.json');
  if (existsSync(standardHooksPath)) {
    try {
      hooksConfig = loadHooksFile(standardHooksPath, manifest.name);
      try {
        loadedHookFiles.add(realpathSync(standardHooksPath));
      } catch {
        loadedHookFiles.add(standardHooksPath);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({
        type: 'hook-load-failed',
        source,
        plugin: manifest.name,
        hookPath: standardHooksPath,
        reason: errorMessage,
      });
    }
  }

  // Load from manifest-declared paths
  if (manifest.hooks && typeof manifest.hooks !== 'object') {
    const hookPaths = Array.isArray(manifest.hooks)
      ? manifest.hooks
      : [manifest.hooks];

    for (const hookPath of hookPaths) {
      if (typeof hookPath !== 'string') continue;

      const fullHookPath = join(pluginPath, hookPath);

      if (!existsSync(fullHookPath)) {
        errors.push({
          type: 'path-not-found',
          source,
          plugin: manifest.name,
          path: fullHookPath,
          component: 'hooks',
        });
        continue;
      }

      if (isSymlinkDuplicate(fullHookPath, loadedHookFiles)) {
        continue;
      }

      try {
        const additionalHooks = loadHooksFile(fullHookPath, manifest.name);
        hooksConfig = mergeHookConfigs(hooksConfig, additionalHooks);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        errors.push({
          type: 'hook-load-failed',
          source,
          plugin: manifest.name,
          hookPath: fullHookPath,
          reason: errorMessage,
        });
      }
    }
  }

  if (hooksConfig) {
    pluginDef.hooksConfig = hooksConfig;
  }

  return { plugin: pluginDef, errors };
}

// ============================================
// Inline Plugin Loading
// ============================================

/**
 * Extract plugin name from path.
 */
function extractPluginNameFromPath(pluginPath: string): string {
  return basename(resolve(pluginPath));
}

/**
 * Load plugins from --plugin-dir paths.
 * Original: RB7 in chunks.130.mjs:3180-3221
 */
async function loadInlinePlugins(
  inlinePluginPaths: string[]
): Promise<{ plugins: PluginDefinition[]; errors: PluginError[] }> {
  if (inlinePluginPaths.length === 0) {
    return { plugins: [], errors: [] };
  }

  const loadedPlugins: PluginDefinition[] = [];
  const errors: PluginError[] = [];

  for (let i = 0; i < inlinePluginPaths.length; i++) {
    const pluginPath = inlinePluginPaths[i];
    if (!pluginPath) {
      continue;
    }

    try {
      const normalizedPath = resolve(pluginPath);

      if (!existsSync(normalizedPath)) {
        console.warn(`Plugin path does not exist: ${normalizedPath}, skipping`);
        errors.push({
          type: 'path-not-found',
          source: `inline[${i}]`,
          plugin: '',
          path: normalizedPath,
          component: 'commands',
        });
        continue;
      }

      const pluginName = extractPluginNameFromPath(normalizedPath);

      const { plugin, errors: loadErrors } = loadPluginDefinitionFromPath(
        normalizedPath,
        `${pluginName}@inline`,
        true,
        pluginName
      );

      plugin.source = `${plugin.name}@inline`;
      plugin.repository = `${plugin.name}@inline`;

      loadedPlugins.push(plugin);
      errors.push(...loadErrors);

      console.log(`Loaded inline plugin from path: ${plugin.name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.warn(
        `Failed to load session plugin from ${pluginPath}: ${errorMessage}`
      );
      errors.push({
        type: 'generic-error',
        source: `inline[${i}]`,
        error: `Failed to load plugin: ${errorMessage}`,
      });
    }
  }

  if (loadedPlugins.length > 0) {
    console.log(
      `Loaded ${loadedPlugins.length} session-only plugins from --plugin-dir`
    );
  }

  return { plugins: loadedPlugins, errors };
}

// ============================================
// Marketplace Plugin Loading (Placeholder)
// ============================================

/**
 * Load plugins from marketplaces.
 * Original: OB7 in chunks.130.mjs:2841-2888
 *
 * Note: This is a placeholder that returns empty results.
 * Full implementation would require marketplace integration.
 */
async function loadMarketplacePlugins(): Promise<{
  plugins: PluginDefinition[];
  errors: PluginError[];
}> {
  // Placeholder - would load from configured marketplaces
  return { plugins: [], errors: [] };
}

// ============================================
// Main Discovery Function
// ============================================

/**
 * Discover all plugins from marketplaces and inline paths.
 * Original: DG in chunks.130.mjs:3246-3263
 */
export const discoverPluginsAndHooks = memoize(
  async (): Promise<PluginDiscoveryResult> => {
    // Load marketplace plugins
    const marketplaceResult = await loadMarketplacePlugins();
    const allPlugins = [...marketplaceResult.plugins];
    const allErrors = [...marketplaceResult.errors];

    // Load inline plugins
    const inlinePluginPaths = getInlinePlugins();
    if (inlinePluginPaths.length > 0) {
      const inlineResult = await loadInlinePlugins(inlinePluginPaths);
      allPlugins.push(...inlineResult.plugins);
      allErrors.push(...inlineResult.errors);
    }

    // Log discovery results
    const enabledCount = allPlugins.filter((p) => p.enabled).length;
    const disabledCount = allPlugins.filter((p) => !p.enabled).length;
    console.log(
      `Found ${allPlugins.length} plugins (${enabledCount} enabled, ${disabledCount} disabled)`
    );

    return {
      enabled: allPlugins.filter((p) => p.enabled),
      disabled: allPlugins.filter((p) => !p.enabled),
      errors: allErrors,
    };
  }
);

/**
 * Clear plugin discovery cache.
 * Original: Bt in chunks.130.mjs:3224-3226
 */
export function clearPluginCache(): void {
  discoverPluginsAndHooks.cache?.clear?.();
}

// ============================================
// Error Formatting
// ============================================

/**
 * Format plugin error for display.
 */
export function formatPluginError(error: PluginError): string {
  switch (error.type) {
    case 'plugin-not-found':
      return `Plugin '${error.pluginId}' not found in marketplace '${error.marketplace}'`;

    case 'marketplace-blocked-by-policy':
      if (error.blockedByBlocklist) {
        return `Marketplace '${error.marketplace}' is blocked by enterprise policy`;
      }
      return `Marketplace '${error.marketplace}' is not in the allowed list. Allowed: ${error.allowedSources.join(', ')}`;

    case 'path-not-found':
      return `${error.component} path not found for plugin '${error.plugin}': ${error.path}`;

    case 'hook-load-failed':
      return `Failed to load hooks for '${error.plugin}': ${error.reason}`;

    case 'lsp-config-invalid':
      return `Invalid LSP config for '${error.serverName}' in plugin '${error.plugin}': ${error.validationError}`;

    default:
      return (error as { error?: string }).error || 'Unknown error';
  }
}

// ============================================
// Export
// ============================================

export {
  loadPluginDefinitionFromPath,
  loadInlinePlugins,
  loadMarketplacePlugins,
  loadHooksFile,
  mergeHookConfigs,
};
