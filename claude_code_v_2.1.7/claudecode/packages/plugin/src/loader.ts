/**
 * @claudecode/plugin - Plugin Loader
 *
 * Discovery and loading of plugins from marketplaces and inline paths.
 * Reconstructed from chunks.1.mjs, chunks.91.mjs, and chunks.130.mjs.
 */

import { readFileSync, existsSync, statSync, realpathSync, mkdirSync, renameSync, rmSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import type {
  PluginDefinition,
  PluginManifest,
  PluginDiscoveryResult,
  PluginError,
  HooksConfig,
} from './types.js';
import {
  unifiedPluginManifestSchema,
  hooksFileSchema,
} from './schemas.js';
import {
  loadKnownMarketplaces,
  findPluginInCachedMarketplace,
  isMarketplaceSourceAllowed,
  isMarketplaceSourceBlocked,
} from './marketplace.js';
import {
  getVersionedCachePath,
  copyToVersionedCache,
  resolvePluginVersion,
  downloadPluginFromSource,
} from './installation.js';
import { loadSettings } from './settings.js';

// ============================================
// Internal State & Helpers
// ============================================

/**
 * Simple memoization wrapper for async functions.
 * Original: W0 / _U1 in chunks.1.mjs
 */
function createMemoizedAsync<T>(fn: () => Promise<T>): (() => Promise<T>) & { cache?: { clear: () => void } } {
  let cachedResult: T | undefined;
  let promise: Promise<T> | undefined;

  const memoized = async () => {
    if (cachedResult !== undefined) return cachedResult;
    if (promise) return promise;

    promise = fn().then((result) => {
      cachedResult = result;
      promise = undefined;
      return result;
    });

    return promise;
  };

  memoized.cache = {
    clear: () => {
      cachedResult = undefined;
      promise = undefined;
    },
  };

  return memoized;
}

const log = (msg: string, options?: { level?: string }) => {
  if (process.env.DEBUG || process.env.CLAUDE_CODE_DEBUG) {
    const prefix = options?.level === 'error' ? '✖' : options?.level === 'warn' ? '⚠' : 'ℹ';
    console.error(`[Plugin] ${prefix} ${msg}`);
  }
};

/**
 * Placeholder for telemetry tracking.
 * Original: e in chunks.130.mjs
 */
const trackError = (err: Error) => {
  // Telemetry implementation omitted
};

async function getEnabledPlugins(): Promise<Record<string, any>> {
  const settings = await loadSettings();
  return (settings.enabledPlugins as Record<string, any>) || {};
}

let inlinePluginPaths: string[] = [];
export function setInlinePluginPaths(paths: string[]): void {
  inlinePluginPaths = paths;
}
function getInlinePlugins(): string[] {
  return inlinePluginPaths;
}

// ============================================
// Hook Loading & Merging
// ============================================

/** Original: po2 in chunks.130.mjs:2602-2610 */
export function loadHooksFile(hooksPath: string, pluginName: string): HooksConfig {
  if (!existsSync(hooksPath)) {
    throw new Error(`Hooks file not found at ${hooksPath} for plugin ${pluginName}. If the manifest declares hooks, the file must exist.`);
  }

  const content = readFileSync(hooksPath, { encoding: 'utf-8' });
  const json = JSON.parse(content);
  return hooksFileSchema.parse(json).hooks;
}

/** Original: lo2 in chunks.130.mjs:2830-2838 */
export function mergeHookConfigs(base: HooksConfig | undefined, extra: HooksConfig): HooksConfig {
  if (!base) return extra;
  const merged = { ...base };
  for (const [key, hooks] of Object.entries(extra)) {
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

/** Original: LF1 in chunks.130.mjs */
function loadPluginManifestFromFile(manifestPath: string, pluginName: string, source: string): PluginManifest {
  if (!existsSync(manifestPath)) {
    return { name: pluginName, description: `Plugin from ${source}` } as PluginManifest;
  }
  try {
    const content = readFileSync(manifestPath, 'utf-8');
    const json = JSON.parse(content);
    const result = unifiedPluginManifestSchema.safeParse(json);
    if (result.success) return result.data;
    throw new Error(`Invalid manifest at ${manifestPath}: ${result.error.message}`);
  } catch (err: any) {
    throw err;
  }
}

/** 
 * Scans a plugin directory and constructs a PluginDefinition.
 * Original: ao2 in chunks.130.mjs:2612-2820 
 */
export function loadPluginDefinitionFromPath(
  pluginPath: string,
  source: string,
  enabled: boolean,
  pluginName: string,
  strict = true
): { plugin: PluginDefinition; errors: PluginError[] } {
  const errors: PluginError[] = [];
  const manifestJsonPath = join(pluginPath, '.claude-plugin', 'plugin.json');
  const manifest = loadPluginManifestFromFile(manifestJsonPath, pluginName, source);

  const pluginDef: PluginDefinition = {
    name: manifest.name,
    manifest,
    path: pluginPath,
    source,
    repository: source,
    enabled,
  };

  // Commands scanning
  const commandsDir = join(pluginPath, 'commands');
  if (!manifest.commands && existsSync(commandsDir)) pluginDef.commandsPath = commandsDir;
  if (manifest.commands) {
    const firstVal = Object.values(manifest.commands)[0];
    if (typeof manifest.commands === 'object' && !Array.isArray(manifest.commands) && firstVal && typeof firstVal === 'object' && ('source' in firstVal || 'content' in firstVal)) {
      const meta: Record<string, any> = {};
      const paths: string[] = [];
      for (const [name, cmd] of Object.entries(manifest.commands)) {
        if (!cmd || typeof cmd !== 'object') continue;
        if ((cmd as any).source) {
          const p = join(pluginPath, (cmd as any).source);
          if (existsSync(p)) {
            paths.push(p);
            meta[name] = cmd;
          } else {
            log(`Command ${name} path ${(cmd as any).source} specified in manifest but not found at ${p} for ${manifest.name}`, { level: 'warn' });
            trackError(new Error(`Plugin component file not found: ${p} for ${manifest.name}`));
            errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: p, component: 'commands' });
          }
        } else if ((cmd as any).content) {
          meta[name] = cmd;
        }
      }
      if (paths.length > 0) pluginDef.commandsPaths = paths;
      if (Object.keys(meta).length > 0) pluginDef.commandsMetadata = meta;
    } else {
      const raw = Array.isArray(manifest.commands) ? manifest.commands : [manifest.commands];
      const paths: string[] = [];
      for (const p of raw) {
        if (typeof p !== 'string') {
          log(`Unexpected command format in manifest for ${manifest.name}`, { level: 'error' });
          continue;
        }
        const full = join(pluginPath, p);
        if (existsSync(full)) {
          paths.push(full);
        } else {
          log(`Command path ${p} specified in manifest but not found at ${full} for ${manifest.name}`, { level: 'warn' });
          trackError(new Error(`Plugin component file not found: ${full} for ${manifest.name}`));
          errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: full, component: 'commands' });
        }
      }
      if (paths.length > 0) pluginDef.commandsPaths = paths;
    }
  }

  // Agents scanning
  const agentsDir = join(pluginPath, 'agents');
  if (!manifest.agents && existsSync(agentsDir)) pluginDef.agentsPath = agentsDir;
  if (manifest.agents) {
    const raw = Array.isArray(manifest.agents) ? manifest.agents : [manifest.agents];
    const paths: string[] = [];
    for (const p of raw) {
      const full = join(pluginPath, p as string);
      if (existsSync(full)) {
        paths.push(full);
      } else {
        log(`Agent path ${p} specified in manifest but not found at ${full} for ${manifest.name}`, { level: 'warn' });
        trackError(new Error(`Plugin component file not found: ${full} for ${manifest.name}`));
        errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: full, component: 'agents' });
      }
    }
    if (paths.length > 0) pluginDef.agentsPaths = paths;
  }

  // Skills scanning
  const skillsDir = join(pluginPath, 'skills');
  if (!manifest.skills && existsSync(skillsDir)) pluginDef.skillsPath = skillsDir;
  if (manifest.skills) {
    const raw = Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills];
    const paths: string[] = [];
    for (const p of raw) {
      const full = join(pluginPath, p as string);
      if (existsSync(full)) {
        paths.push(full);
      } else {
        log(`Skill path ${p} specified in manifest but not found at ${full} for ${manifest.name}`, { level: 'warn' });
        trackError(new Error(`Plugin component file not found: ${full} for ${manifest.name}`));
        errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: full, component: 'skills' });
      }
    }
    if (paths.length > 0) pluginDef.skillsPaths = paths;
  }

  // Output Styles scanning
  const outputStylesDir = join(pluginPath, 'output-styles');
  if (!manifest.outputStyles && existsSync(outputStylesDir)) pluginDef.outputStylesPath = outputStylesDir;
  if (manifest.outputStyles) {
    const raw = Array.isArray(manifest.outputStyles) ? manifest.outputStyles : [manifest.outputStyles];
    const paths: string[] = [];
    for (const p of raw) {
      const full = join(pluginPath, p as string);
      if (existsSync(full)) {
        paths.push(full);
      } else {
        log(`Output style path ${p} specified in manifest but not found at ${full} for ${manifest.name}`, { level: 'warn' });
        trackError(new Error(`Plugin component file not found: ${full} for ${manifest.name}`));
        errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: full, component: 'output-styles' });
      }
    }
    if (paths.length > 0) pluginDef.outputStylesPaths = paths;
  }

  // Hooks processing
  let hooks: HooksConfig | undefined;
  const loadedHooksPaths = new Set<string>();
  const stdHooksPath = join(pluginPath, 'hooks', 'hooks.json');
  if (existsSync(stdHooksPath)) {
    try {
      hooks = loadHooksFile(stdHooksPath, manifest.name);
      try {
        loadedHooksPaths.add(realpathSync(stdHooksPath));
      } catch {
        loadedHooksPaths.add(stdHooksPath);
      }
      log(`Loaded hooks from standard location for plugin ${manifest.name}: ${stdHooksPath}`);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Failed to load hooks for ${manifest.name}: ${msg}`, { level: 'error' });
      trackError(err instanceof Error ? err : new Error(msg));
      errors.push({ type: 'hook-load-failed', source, plugin: manifest.name, reason: msg });
    }
  }

  if (manifest.hooks) {
    const rawHooks = Array.isArray(manifest.hooks) ? manifest.hooks : [manifest.hooks];
    for (const h of rawHooks) {
      if (typeof h === 'string') {
        const p = join(pluginPath, h);
        if (!existsSync(p)) {
          log(`Hooks file ${h} specified in manifest but not found at ${p} for ${manifest.name}`, { level: 'error' });
          trackError(new Error(`Plugin component file not found: ${p} for ${manifest.name}`));
          errors.push({ type: 'path-not-found', source, plugin: manifest.name, path: p, component: 'hooks' });
          continue;
        }
        let rp: string;
        try {
          rp = realpathSync(p);
        } catch {
          rp = p;
        }
        if (loadedHooksPaths.has(rp)) {
          log(`Skipping duplicate hooks file for plugin ${manifest.name}: ${h} (resolves to already-loaded file: ${rp})`);
          if (strict) {
            const msg = `Duplicate hooks file detected: ${h} resolves to already-loaded file ${rp}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
            trackError(new Error(msg));
            errors.push({ type: 'hook-load-failed', source, plugin: manifest.name, reason: msg });
          }
          continue;
        }
        try {
          const config = loadHooksFile(p, manifest.name);
          try {
            hooks = mergeHookConfigs(hooks, config);
            loadedHooksPaths.add(rp);
            log(`Loaded and merged hooks from manifest for plugin ${manifest.name}: ${h}`);
          } catch (mergeErr: any) {
            const msg = mergeErr instanceof Error ? mergeErr.message : String(mergeErr);
            log(`Failed to merge hooks from ${h} for ${manifest.name}: ${msg}`, { level: 'error' });
            trackError(mergeErr instanceof Error ? mergeErr : new Error(msg));
            errors.push({ type: 'hook-load-failed', source, plugin: manifest.name, reason: `Failed to merge: ${msg}` });
          }
        } catch (loadErr: any) {
          const msg = loadErr instanceof Error ? loadErr.message : String(loadErr);
          log(`Failed to load hooks from ${h} for ${manifest.name}: ${msg}`, { level: 'error' });
          trackError(loadErr instanceof Error ? loadErr : new Error(msg));
          errors.push({ type: 'hook-load-failed', source, plugin: manifest.name, reason: msg });
        }
      } else if (typeof h === 'object') {
        hooks = mergeHookConfigs(hooks, h as HooksConfig);
      }
    }
  }
  if (hooks) pluginDef.hooksConfig = hooks;

  return { plugin: pluginDef, errors };
}

/** 
 * Initializes a plugin from a marketplace entry, handling caching and manifest merging.
 * Original: MB7 in chunks.130.mjs:2890-3177 
 */
export async function initializePluginFromMarketplace(
  entry: any,
  marketLocation: string,
  sourceId: string,
  enabled: boolean,
  accumulatedErrors: PluginError[]
): Promise<PluginDefinition | null> {
  log(`Loading plugin ${entry.name} from source: ${JSON.stringify(entry.source)}`);
  let installPath: string;
  const marketDir = statSync(marketLocation).isDirectory() ? marketLocation : dirname(marketLocation);

  if (typeof entry.source === 'string') {
    const sourcePath = join(marketDir, entry.source);
    if (!existsSync(sourcePath)) {
      const err = new Error(`Plugin path not found: ${sourcePath}`);
      log(`Plugin path not found: ${sourcePath}`, { level: 'error' });
      trackError(err);
      accumulatedErrors.push({ 
        type: 'generic-error', 
        source: sourceId, 
        error: `Plugin directory not found at path: ${sourcePath}. Check that the marketplace entry has the correct path.` 
      });
      return null;
    }
    try {
      const manifestPath = join(sourcePath, '.claude-plugin', 'plugin.json');
      let diskManifest: PluginManifest | undefined;
      try {
        diskManifest = loadPluginManifestFromFile(manifestPath, entry.name, entry.source);
      } catch {}
      const version = await resolvePluginVersion(sourceId, entry.source, diskManifest, marketDir, entry.version);
      installPath = await copyToVersionedCache(sourcePath, sourceId, version, entry, marketDir);
      log(`Copied local plugin ${entry.name} to versioned cache: ${installPath}`);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Failed to copy plugin ${entry.name} to versioned cache: ${msg}. Using marketplace path.`, { level: 'warn' });
      installPath = sourcePath;
    }
  } else {
    try {
      const version = await resolvePluginVersion(sourceId, entry.source, undefined, undefined, entry.version);
      const cachePath = getVersionedCachePath(sourceId, version);
      if (existsSync(cachePath)) {
        log(`Using versioned cached plugin ${entry.name} from ${cachePath}`);
        installPath = cachePath;
      } else {
        const downloaded = await downloadPluginFromSource(entry.source, { manifest: { name: entry.name } });
        const finalVersion = await resolvePluginVersion(sourceId, entry.source, downloaded.manifest, downloaded.path, entry.version);
        installPath = await copyToVersionedCache(downloaded.path, sourceId, finalVersion, entry, undefined);
        if (downloaded.path !== installPath) {
          rmSync(downloaded.path, { recursive: true, force: true });
        }
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Failed to cache plugin ${entry.name}: ${msg}`, { level: 'error' });
      trackError(err instanceof Error ? err : new Error(msg));
      accumulatedErrors.push({
        type: 'generic-error',
        source: sourceId,
        error: `Failed to download/cache plugin ${entry.name}: ${msg}`
      });
      return null;
    }
  }

  const manifestPath = join(installPath, '.claude-plugin', 'plugin.json');
  const hasManifestOnDisk = existsSync(manifestPath);
  const { plugin, errors } = loadPluginDefinitionFromPath(installPath, sourceId, enabled, entry.name, entry.strict ?? true);
  
  const innerErrors: PluginError[] = [...errors];

  if (!hasManifestOnDisk) {
    plugin.manifest = { ...entry, id: undefined, source: undefined, strict: undefined };
    plugin.name = plugin.manifest.name;
    
    // Commands merge from marketplace
    if (entry.commands) {
      const firstVal = Object.values(entry.commands)[0];
      if (typeof entry.commands === 'object' && !Array.isArray(entry.commands) && firstVal && typeof firstVal === 'object' && ('source' in firstVal || 'content' in firstVal)) {
        const meta: Record<string, any> = {};
        const paths: string[] = [];
        for (const [name, cmd] of Object.entries(entry.commands)) {
          if (!cmd || typeof cmd !== 'object' || !(cmd as any).source) continue;
          const p = join(installPath, (cmd as any).source);
          if (existsSync(p)) {
            paths.push(p);
            meta[name] = cmd;
          } else {
            log(`Command ${name} path ${(cmd as any).source} from marketplace entry not found at ${p} for ${entry.name}`, { level: 'warn' });
            trackError(new Error(`Plugin component file not found: ${p} for ${entry.name}`));
            innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: p, component: 'commands' });
          }
        }
        if (paths.length > 0) {
          plugin.commandsPaths = paths;
          plugin.commandsMetadata = meta;
        }
      } else {
        const raw = Array.isArray(entry.commands) ? entry.commands : [entry.commands];
        const paths: string[] = [];
        for (const p of raw) {
          if (typeof p !== 'string') continue;
          const full = join(installPath, p);
          if (existsSync(full)) {
            paths.push(full);
          } else {
            log(`Command path ${p} from marketplace entry not found at ${full} for ${entry.name}`, { level: 'warn' });
            trackError(new Error(`Plugin component file not found: ${full} for ${entry.name}`));
            innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: full, component: 'commands' });
          }
        }
        if (paths.length > 0) plugin.commandsPaths = paths;
      }
    }
    
    // Agents merge
    if (entry.agents) {
      const raw = Array.isArray(entry.agents) ? entry.agents : [entry.agents];
      const paths: string[] = [];
      for (const p of raw) {
        const full = join(installPath, p as string);
        if (existsSync(full)) paths.push(full);
        else {
          log(`Agent path ${p} from marketplace entry not found at ${full} for ${entry.name}`, { level: 'warn' });
          trackError(new Error(`Plugin component file not found: ${full} for ${entry.name}`));
          innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: full, component: 'agents' });
        }
      }
      if (paths.length > 0) plugin.agentsPaths = paths;
    }

    // Skills merge
    if (entry.skills) {
      const raw = Array.isArray(entry.skills) ? entry.skills : [entry.skills];
      const paths: string[] = [];
      for (const p of raw) {
        const full = join(installPath, p as string);
        if (existsSync(full)) paths.push(full);
        else {
          log(`Skill path ${p} from marketplace entry not found at ${full} for ${entry.name}`, { level: 'warn' });
          trackError(new Error(`Plugin component file not found: ${full} for ${entry.name}`));
          innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: full, component: 'skills' });
        }
      }
      if (paths.length > 0) plugin.skillsPaths = paths;
    }

    // Output Styles merge
    if (entry.outputStyles) {
      const raw = Array.isArray(entry.outputStyles) ? entry.outputStyles : [entry.outputStyles];
      const paths: string[] = [];
      for (const p of raw) {
        const full = join(installPath, p as string);
        if (existsSync(full)) paths.push(full);
        else {
          log(`Output style path ${p} from marketplace entry not found at ${full} for ${entry.name}`, { level: 'warn' });
          trackError(new Error(`Plugin component file not found: ${full} for ${entry.name}`));
          innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: full, component: 'output-styles' });
        }
      }
      if (paths.length > 0) plugin.outputStylesPaths = paths;
    }

    if (entry.hooks) plugin.hooksConfig = entry.hooks;
  } else if (!entry.strict && hasManifestOnDisk && (entry.commands || entry.agents || entry.skills || entry.hooks || entry.outputStyles)) {
    const conflictErr = new Error(`Plugin ${entry.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
    log(conflictErr.message, { level: 'error' });
    trackError(conflictErr);
    accumulatedErrors.push({
      type: 'generic-error',
      source: sourceId,
      error: `Plugin ${entry.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
    });
    return null;
  } else if (hasManifestOnDisk) {
    // Merge marketplace components into existing plugin def if not strict
    if (entry.commands) {
      const firstVal = Object.values(entry.commands)[0];
      if (typeof entry.commands === 'object' && !Array.isArray(entry.commands) && firstVal && typeof firstVal === 'object' && ('source' in firstVal || 'content' in firstVal)) {
        const meta = { ...plugin.commandsMetadata || {} };
        const paths: string[] = [];
        for (const [name, cmd] of Object.entries(entry.commands)) {
          if (!cmd || typeof cmd !== 'object' || !(cmd as any).source) continue;
          const p = join(installPath, (cmd as any).source);
          if (existsSync(p)) {
            paths.push(p);
            meta[name] = cmd;
          } else {
            innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: p, component: 'commands' });
          }
        }
        if (paths.length > 0) {
          plugin.commandsPaths = [...(plugin.commandsPaths || []), ...paths];
          plugin.commandsMetadata = meta;
        }
      } else {
        const raw = Array.isArray(entry.commands) ? entry.commands : [entry.commands];
        const paths: string[] = [];
        for (const p of raw) {
          if (typeof p !== 'string') continue;
          const full = join(installPath, p);
          if (existsSync(full)) paths.push(full);
          else innerErrors.push({ type: 'path-not-found', source: sourceId, plugin: entry.name, path: full, component: 'commands' });
        }
        if (paths.length > 0) plugin.commandsPaths = [...(plugin.commandsPaths || []), ...paths];
      }
    }
    // Similar merging for agents, skills, outputStyles
    if (entry.agents) {
      const raw = Array.isArray(entry.agents) ? entry.agents : [entry.agents];
      const paths = (raw as string[]).map(p => join(installPath, p)).filter(p => existsSync(p));
      if (paths.length > 0) plugin.agentsPaths = [...(plugin.agentsPaths || []), ...paths];
    }
    if (entry.skills) {
      const raw = Array.isArray(entry.skills) ? entry.skills : [entry.skills];
      const paths = (raw as string[]).map(p => join(installPath, p)).filter(p => existsSync(p));
      if (paths.length > 0) plugin.skillsPaths = [...(plugin.skillsPaths || []), ...paths];
    }
    if (entry.outputStyles) {
      const raw = Array.isArray(entry.outputStyles) ? entry.outputStyles : [entry.outputStyles];
      const paths = (raw as string[]).map(p => join(installPath, p)).filter(p => existsSync(p));
      if (paths.length > 0) plugin.outputStylesPaths = [...(plugin.outputStylesPaths || []), ...paths];
    }
    if (entry.hooks) {
      plugin.hooksConfig = { ...plugin.hooksConfig || {}, ...entry.hooks };
    }
  }

  accumulatedErrors.push(...innerErrors);
  return plugin;
}

/** 
 * Orchestrates loading of plugins from all enabled marketplace sources.
 * Original: OB7 in chunks.130.mjs:2841-2888 
 */
export async function loadMarketplacePlugins(): Promise<{ plugins: PluginDefinition[]; errors: PluginError[] }> {
  const enabledPlugins = await getEnabledPlugins();
  const plugins: PluginDefinition[] = [];
  const errors: PluginError[] = [];
  
  // Filtering for marketplace style IDs like plugin@marketplace
  const entries = Object.entries(enabledPlugins).filter(([id, enabled]) => {
    // Simple check for '@' to identify marketplace plugins
    return id.includes('@') && enabled !== undefined;
  });
  
  const marketplaces = await loadKnownMarketplaces();

  for (const [sourceId, enabled] of entries) {
    try {
      const [name, marketName] = sourceId.split('@');
      const marketConfig = marketplaces[marketName!];
      
      if (marketConfig && !isMarketplaceSourceAllowed(marketConfig.source)) {
        errors.push({ 
          type: 'marketplace-blocked-by-policy', 
          source: sourceId, 
          plugin: name!, 
          marketplace: marketName!, 
          blockedByBlocklist: isMarketplaceSourceBlocked(marketConfig.source), 
          allowedSources: [] 
        });
        continue;
      }
      
      const cached = findPluginInCachedMarketplace(sourceId);
      if (!cached) {
        errors.push({ 
          type: 'plugin-not-found', 
          source: sourceId, 
          pluginId: name!, 
          marketplace: marketName! 
        });
        continue;
      }
      
      const plugin = await initializePluginFromMarketplace(
        cached.entry, 
        cached.marketplaceInstallLocation, 
        sourceId, 
        enabled === true, 
        errors
      );
      
      if (plugin) {
        plugins.push(plugin);
      }
    } catch (err: any) {
      errors.push({ 
        type: 'generic-error', 
        source: sourceId, 
        error: err.message 
      });
    }
  }
  return { plugins, errors };
}

/**
 * Loads inline plugins from specified paths.
 * Original: RB7 in chunks.130.mjs:3180-3244
 */
async function loadInlinePlugins(paths: string[]): Promise<{ plugins: PluginDefinition[]; errors: PluginError[] }> {
  if (paths.length === 0) return { plugins: [], errors: [] };
  
  const plugins: PluginDefinition[] = [];
  const errors: PluginError[] = [];
  
  for (const path of paths) {
    try {
      const fullPath = resolve(path);
      if (!existsSync(fullPath)) {
        errors.push({ type: 'generic-error', source: path, error: `Inline plugin path not found: ${fullPath}` });
        continue;
      }
      
      const pluginName = basename(fullPath);
      const { plugin, errors: loadErrors } = loadPluginDefinitionFromPath(fullPath, fullPath, true, pluginName, true);
      
      plugins.push(plugin);
      errors.push(...loadErrors);
    } catch (err: any) {
      errors.push({ type: 'generic-error', source: path, error: err.message });
    }
  }
  
  return { plugins, errors };
}

/** 
 * Main orchestration entry point for plugin and hook discovery.
 * Original: DG in chunks.130.mjs:3246-3263 
 */
export const discoverPluginsAndHooks = createMemoizedAsync(async (): Promise<PluginDiscoveryResult> => {
  const marketplaceResult = await loadMarketplacePlugins();
  const inlinePaths = getInlinePlugins();
  const inlineResult = await loadInlinePlugins(inlinePaths);
  
  const allPlugins = [...marketplaceResult.plugins, ...inlineResult.plugins];
  const allErrors = [...marketplaceResult.errors, ...inlineResult.errors];

  return {
    enabled: allPlugins.filter(p => p.enabled),
    disabled: allPlugins.filter(p => !p.enabled),
    errors: allErrors,
  };
});
