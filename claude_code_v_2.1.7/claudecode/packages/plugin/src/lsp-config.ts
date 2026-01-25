/**
 * @claudecode/plugin - LSP Configuration
 *
 * Handles loading and validation of LSP server configurations from plugins.
 * Reconstructed from chunks.114.mjs (loading logic) and chunks.90.mjs (schema/expansion).
 */

import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import {
  lspServerConfigSchema,
  lspServersDefinitionSchema
} from './schemas';
import { discoverPluginsAndHooks } from './loader';
import type { PluginDefinition } from './types';

// ============================================
// Types
// ============================================

export type LspServerConfig = z.infer<typeof lspServerConfigSchema>;

// ============================================
// Variable Expansion
// ============================================

/**
 * Expands environment variables in a string.
 * Supports ${VAR} and ${VAR:-default}.
 * Original: BVA in chunks.90.mjs:263379
 */
function expandVars(input: string): { expanded: string; missingVars: string[] } {
  const missingVars: string[] = [];
  const expanded = input.replace(/\$\{([^}]+)\}/g, (match, content) => {
    const [varName, defaultValue] = content.split(':-', 2);
    const value = process.env[varName];
    
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    
    missingVars.push(varName);
    return match; // Keep original if missing and no default
  });
  
  return { expanded, missingVars };
}

/**
 * Replaces ${CLAUDE_PLUGIN_ROOT} with the actual plugin path.
 * Original: yg5 in chunks.114.mjs:333422
 */
function replacePluginRoot(input: string, pluginRoot: string): string {
  return input.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
}

/**
 * Expands variables in an LSP server configuration.
 * Original: vg5 in chunks.114.mjs:333426
 */
export function expandLspServerConfig(
  config: LspServerConfig,
  pluginRoot: string,
  errors: any[] = []
): LspServerConfig {
  const missingVars: string[] = [];
  
  const expand = (str: string): string => {
    const withRoot = replacePluginRoot(str, pluginRoot);
    const { expanded, missingVars: missing } = expandVars(withRoot);
    missingVars.push(...missing);
    return expanded;
  };

  const expandedConfig = { ...config };

  if (expandedConfig.command) {
    expandedConfig.command = expand(expandedConfig.command);
  }

  if (expandedConfig.args) {
    expandedConfig.args = expandedConfig.args.map(arg => expand(arg));
  }

  const env: Record<string, string> = {
    CLAUDE_PLUGIN_ROOT: pluginRoot,
    ...(expandedConfig.env || {})
  };

  for (const [key, value] of Object.entries(env)) {
    if (key !== 'CLAUDE_PLUGIN_ROOT') {
      env[key] = expand(value);
    }
  }
  expandedConfig.env = env;

  if (expandedConfig.workspaceFolder) {
    expandedConfig.workspaceFolder = expand(expandedConfig.workspaceFolder);
  }

  if (missingVars.length > 0) {
    const uniqueMissing = [...new Set(missingVars)];
    const msg = `Missing environment variables in plugin LSP config: ${uniqueMissing.join(', ')}`;
    console.warn(msg);
    // We log but don't strictly fail here in the original code, just warn
  }

  return expandedConfig;
}

// ============================================
// Loading Logic
// ============================================

/**
 * Validates a path to ensure it's relative and safe.
 * Original: Pg5 in chunks.114.mjs:333317
 */
function validateSafePath(basePath: string, relativePath: string): string | null {
  const resolvedBase = path.resolve(basePath);
  const resolvedPath = path.resolve(basePath, relativePath);
  const relative = path.relative(resolvedBase, resolvedPath);
  
  if (relative.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }
  return resolvedPath;
}

/**
 * Loads LSP servers from a plugin manifest or .lsp.json file.
 * Original: Sg5 (load from .lsp.json) and xg5 (load from manifest) logic combined/refactored.
 */
async function loadLspConfigs(
  configSource: string | Record<string, any> | Array<string | Record<string, any>>,
  pluginPath: string,
  pluginName: string,
  errors: any[]
): Promise<Record<string, LspServerConfig> | undefined> {
  const configs: Record<string, LspServerConfig> = {};
  const sources = Array.isArray(configSource) ? configSource : [configSource];

  for (const source of sources) {
    if (typeof source === 'string') {
      // Load from file
      const filePath = validateSafePath(pluginPath, source);
      if (!filePath) {
        const msg = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${source}`;
        console.warn(msg);
        errors.push({
          type: 'lsp-config-invalid',
          plugin: pluginName,
          serverName: source,
          validationError: 'Invalid path: must be relative and within plugin directory',
          source: 'plugin'
        });
        continue;
      }

      try {
        if (!fs.existsSync(filePath)) {
            // If explicit file config is missing, it's an error
             throw new Error(`File not found: ${filePath}`);
        }
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const json = JSON.parse(content);
        const result = z.record(z.string(), lspServerConfigSchema).safeParse(json);

        if (result.success) {
          Object.assign(configs, result.data);
        } else {
          const msg = `LSP config validation failed for ${source} in plugin ${pluginName}: ${result.error.message}`;
          console.error(msg);
          errors.push({
            type: 'lsp-config-invalid',
            plugin: pluginName,
            serverName: source,
            validationError: result.error.message,
            source: 'plugin'
          });
        }
      } catch (err: any) {
        const msg = `Failed to read/parse LSP config from ${source} in plugin ${pluginName}: ${err.message}`;
        console.error(msg);
        errors.push({
          type: 'lsp-config-invalid',
          plugin: pluginName,
          serverName: source,
          validationError: err.message,
          source: 'plugin'
        });
      }
    } else {
      // Inline config
      for (const [name, serverConfig] of Object.entries(source)) {
        const result = lspServerConfigSchema.safeParse(serverConfig);
        if (result.success) {
          configs[name] = result.data;
        } else {
          const msg = `LSP config validation failed for inline server "${name}" in plugin ${pluginName}: ${result.error.message}`;
          console.error(msg);
          errors.push({
            type: 'lsp-config-invalid',
            plugin: pluginName,
            serverName: name,
            validationError: result.error.message,
            source: 'plugin'
          });
        }
      }
    }
  }

  return Object.keys(configs).length > 0 ? configs : undefined;
}

/**
 * Loads LSP servers for a specific plugin.
 * Original: Ey2 in chunks.114.mjs:333469
 */
export async function loadLspServersFromPlugin(
  plugin: PluginDefinition,
  errors: any[] = []
): Promise<Record<string, LspServerConfig & { scope: string; source: string }> | undefined> {
  // Check if .lsp.json exists implicitly if not specified in manifest?
  // Original Sg5 calls jg5(A.path, ".lsp.json") and tries to load it.
  
  const loadedConfigs: Record<string, LspServerConfig> = {};
  
  // Try loading default .lsp.json
  const defaultLspJsonPath = path.join(plugin.path, '.lsp.json');
  if (fs.existsSync(defaultLspJsonPath)) {
      // In original Sg5, it tries to load .lsp.json.
      // We reuse loadLspConfigs logic but passed as string
      const defaultConfigs = await loadLspConfigs('.lsp.json', plugin.path, plugin.name, errors);
      if (defaultConfigs) Object.assign(loadedConfigs, defaultConfigs);
  }

  // Load from manifest
  if (plugin.manifest.lspServers) {
    const manifestConfigs = await loadLspConfigs(plugin.manifest.lspServers, plugin.path, plugin.name, errors);
    if (manifestConfigs) Object.assign(loadedConfigs, manifestConfigs);
  }

  if (Object.keys(loadedConfigs).length === 0) return undefined;

  // Process and expand configs
  const result: Record<string, LspServerConfig & { scope: string; source: string }> = {};
  for (const [name, config] of Object.entries(loadedConfigs)) {
    const expanded = expandLspServerConfig(config, plugin.path, errors);
    // Add metadata (original: kg5)
    const uniqueId = `plugin:${plugin.name}:${name}`;
    result[uniqueId] = {
      ...expanded,
      scope: 'dynamic',
      source: plugin.name
    };
  }

  return result;
}

/**
 * Gets all LSP servers from all enabled plugins.
 * Original: $y2 in chunks.114.mjs:333484
 */
export async function getAllLspServers(): Promise<{ servers: Record<string, LspServerConfig> }> {
  const servers: Record<string, LspServerConfig> = {};
  
  try {
    const { enabled } = await discoverPluginsAndHooks();
    
    for (const plugin of enabled) {
      const errors: any[] = [];
      const pluginServers = await loadLspServersFromPlugin(plugin, errors);
      
      if (pluginServers && Object.keys(pluginServers).length > 0) {
        Object.assign(servers, pluginServers);
        // console.log(`Loaded ${Object.keys(pluginServers).length} LSP server(s) from plugin: ${plugin.name}`);
      }
      
      if (errors.length > 0) {
        console.warn(`${errors.length} error(s) loading LSP servers from plugin: ${plugin.name}`);
      }
    }
    
    // console.log(`Total LSP servers loaded: ${Object.keys(servers).length}`);
  } catch (err: any) {
    console.error(`Error loading LSP servers: ${err.message}`);
    // Original catches and logs, returns partial or empty
  }

  return { servers };
}
