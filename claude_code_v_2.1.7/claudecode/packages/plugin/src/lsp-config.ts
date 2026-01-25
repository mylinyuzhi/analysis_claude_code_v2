/**
 * @claudecode/plugin - LSP Configuration Loader
 *
 * Logic for loading and expanding LSP server configurations from plugins.
 * Reconstructed from chunks.114.mjs and chunks.90.mjs.
 */

import * as path from 'path';
import { z } from 'zod';
import { lspServerConfigSchema } from './schemas.js';
import type { PluginDefinition, LspServerConfig, PluginError } from './types.js';
import { discoverPluginsAndHooks } from './loader.js';
import { getFileSystem } from '@claudecode/platform';

/**
 * Replace ${CLAUDE_PLUGIN_ROOT} placeholder with actual plugin path.
 * Original: yg5 in chunks.114.mjs:2077-2080
 */
function replacePluginRoot(value: string, pluginRoot: string): string {
  if (typeof value !== 'string') return value;
  return value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
}

/**
 * Expand environment variables in string.
 * Original: BVA in chunks.90.mjs:1691-1699
 */
function expandEnvVars(value: string): { expanded: string; missingVars: string[] } {
  if (typeof value !== 'string') return { expanded: value, missingVars: [] };
  const missingVars: string[] = [];
  const expanded = value.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    const envValue = process.env[varName];
    if (envValue === undefined) {
      missingVars.push(varName);
      return match;
    }
    return envValue;
  });
  return { expanded, missingVars };
}

/**
 * Expand variables in LSP server configuration.
 * Original: vg5 in chunks.114.mjs:2082-2111
 */
export function expandLspServerConfig(
  config: LspServerConfig,
  pluginRoot: string,
  pluginName: string
): LspServerConfig {
  const missingVars: string[] = [];

  const expand = (val: string) => {
    const withRoot = replacePluginRoot(val, pluginRoot);
    const { expanded, missingVars: missing } = expandEnvVars(withRoot);
    missingVars.push(...missing);
    return expanded;
  };

  const expandedConfig = { ...config };

  if (expandedConfig.command) {
    expandedConfig.command = expand(expandedConfig.command);
  }

  if (expandedConfig.args) {
    expandedConfig.args = expandedConfig.args.map((arg) => expand(arg));
  }

  const env: Record<string, string> = { CLAUDE_PLUGIN_ROOT: pluginRoot, ...(expandedConfig.env || {}) };
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
    console.warn(
      `[LSP CONFIG] Missing environment variables in plugin LSP config for ${pluginName}: ${[
        ...new Set(missingVars),
      ].join(', ')}`
    );
  }

  return expandedConfig;
}

/**
 * Validate security of plugin paths.
 * Original: Pg5 in chunks.114.mjs:1971-1977
 */
function validatePluginPath(pluginRoot: string, relativePath: string): string | null {
  const normalizedRoot = path.normalize(pluginRoot);
  const fullPath = path.normalize(path.join(pluginRoot, relativePath));
  const rel = path.relative(normalizedRoot, fullPath);

  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }
  return fullPath;
}

/**
 * Load LSP servers from .lsp.json in plugin root.
 * Original: Sg5 in chunks.114.mjs:1979-2013
 */
async function loadLspServersFromPluginDefault(
  plugin: PluginDefinition,
  errors: PluginError[] = []
): Promise<Record<string, LspServerConfig> | undefined> {
  const servers: Record<string, LspServerConfig> = {};
  const fs = getFileSystem();
  const lspJsonPath = path.join(plugin.path, '.lsp.json');

  try {
    if (fs.existsSync(lspJsonPath)) {
      const content = fs.readFileSync(lspJsonPath, { encoding: 'utf-8' });
      const parsed = JSON.parse(content);
      const result = z.record(z.string(), lspServerConfigSchema).safeParse(parsed);

      if (result.success) {
        Object.assign(servers, result.data);
      } else {
        errors.push({
          type: 'lsp-config-invalid',
          plugin: plugin.name,
          serverName: '.lsp.json',
          validationError: result.error.message,
        });
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      errors.push({
        type: 'lsp-config-invalid',
        plugin: plugin.name,
        serverName: '.lsp.json',
        validationError: error.message,
      });
    }
  }

  if (plugin.manifest.lspServers) {
    const manifestServers = await loadLspServersFromManifest(
      plugin.manifest.lspServers as any,
      plugin.path,
      plugin.name,
      errors
    );
    if (manifestServers) {
      Object.assign(servers, manifestServers);
    }
  }

  return Object.keys(servers).length > 0 ? servers : undefined;
}

/**
 * Load LSP servers defined in plugin manifest.
 * Original: xg5 in chunks.114.mjs:2016-2075
 */
async function loadLspServersFromManifest(
  lspServers: string | Record<string, LspServerConfig> | (string | Record<string, LspServerConfig>)[],
  pluginPath: string,
  pluginName: string,
  errors: PluginError[]
): Promise<Record<string, LspServerConfig> | undefined> {
  const servers: Record<string, LspServerConfig> = {};
  const fs = getFileSystem();
  const items = Array.isArray(lspServers) ? lspServers : [lspServers];

  for (const item of items) {
    if (typeof item === 'string') {
      const safePath = validatePluginPath(pluginPath, item);
      if (!safePath) {
        errors.push({
          type: 'lsp-config-invalid',
          plugin: pluginName,
          serverName: item,
          validationError: 'Invalid path: must be relative and within plugin directory',
        });
        continue;
      }

      try {
        if (fs.existsSync(safePath)) {
          const content = fs.readFileSync(safePath, { encoding: 'utf-8' });
          const parsed = JSON.parse(content);
          const result = z.record(z.string(), lspServerConfigSchema).safeParse(parsed);
          if (result.success) {
            Object.assign(servers, result.data);
          } else {
            errors.push({
              type: 'lsp-config-invalid',
              plugin: pluginName,
              serverName: item,
              validationError: result.error.message,
            });
          }
        }
      } catch (error: any) {
        errors.push({
          type: 'lsp-config-invalid',
          plugin: pluginName,
          serverName: item,
          validationError: error.message,
        });
      }
    } else {
      for (const [name, config] of Object.entries(item)) {
        const result = lspServerConfigSchema.safeParse(config);
        if (result.success) {
          servers[name] = result.data as LspServerConfig;
        } else {
          errors.push({
            type: 'lsp-config-invalid',
            plugin: pluginName,
            serverName: name,
            validationError: result.error.message,
          });
        }
      }
    }
  }

  return Object.keys(servers).length > 0 ? servers : undefined;
}

/**
 * Prefix server names to avoid conflicts between plugins.
 * Original: kg5 in chunks.114.mjs:2113-2124
 */
function prefixServerNames(
  configs: Record<string, LspServerConfig>,
  pluginName: string
): Record<string, LspServerConfig> {
  const result: Record<string, LspServerConfig> = {};
  for (const [name, config] of Object.entries(configs)) {
    const prefixedName = `plugin:${pluginName}:${name}`;
    result[prefixedName] = {
      ...config,
      // @ts-ignore - Add internal metadata
      scope: 'dynamic',
      source: pluginName,
    };
  }
  return result;
}

/**
 * Load LSP servers from a single plugin.
 * Original: Ey2 in chunks.114.mjs:2126-2133
 */
export async function loadLspServersFromPlugin(
  plugin: PluginDefinition,
  errors: PluginError[] = []
): Promise<Record<string, LspServerConfig> | undefined> {
  if (!plugin.enabled) return;

  const rawServers = await loadLspServersFromPluginDefault(plugin, errors);
  if (!rawServers) return;

  const expandedServers: Record<string, LspServerConfig> = {};
  for (const [name, config] of Object.entries(rawServers)) {
    expandedServers[name] = expandLspServerConfig(config, plugin.path, plugin.name);
  }

  return prefixServerNames(expandedServers, plugin.name);
}

/**
 * Load all LSP servers from all enabled plugins.
 * Original: $y2 in chunks.114.mjs:2143-2162
 */
export async function getAllLspServers(): Promise<{ servers: Record<string, LspServerConfig> }> {
  const result: Record<string, LspServerConfig> = {};
  try {
    const discovery = await discoverPluginsAndHooks();
    for (const plugin of discovery.enabled) {
      const errors: PluginError[] = [];
      const pluginServers = await loadLspServersFromPlugin(plugin, errors);
      if (pluginServers && Object.keys(pluginServers).length > 0) {
        Object.assign(result, pluginServers);
      }
    }
  } catch (error: any) {
    console.error(`[LSP CONFIG] Error loading LSP servers: ${error.message}`);
  }
  return { servers: result };
}
