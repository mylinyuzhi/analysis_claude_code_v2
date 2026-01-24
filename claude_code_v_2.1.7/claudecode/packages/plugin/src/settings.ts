/**
 * @claudecode/plugin - Plugin Settings
 *
 * Enable/disable state management for plugins.
 * Reconstructed from chunks.91.mjs and chunks.90.mjs.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ============================================
// Internal State & Helpers
// ============================================

/**
 * Get home directory.
 */
function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '';
}

/**
 * Get settings file path.
 */
export function getSettingsPath(): string {
  return join(getHomeDir(), '.claude', 'settings.json');
}

// ============================================
// Settings Management
// ============================================

/**
 * Load settings from disk.
 */
export async function loadSettings(): Promise<Record<string, any>> {
  const filePath = getSettingsPath();
  if (!existsSync(filePath)) return {};

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[Plugin] Failed to load settings:', error);
    return {};
  }
}

/**
 * Save settings to disk.
 */
export async function saveSettings(settings: Record<string, any>): Promise<void> {
  const filePath = getSettingsPath();
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
}

// ============================================
// Plugin Enabled State
// ============================================

/**
 * Get enabled plugins from settings.
 * Original schema: record(string, union([array(string), boolean, undefined]))
 */
export async function getEnabledPlugins(): Promise<Record<string, any>> {
  const settings = await loadSettings();
  return settings.enabledPlugins || {};
}

/**
 * Set enabled plugins in settings.
 */
export async function setEnabledPlugins(enabledPlugins: Record<string, any>): Promise<void> {
  const settings = await loadSettings();
  settings.enabledPlugins = enabledPlugins;
  await saveSettings(settings);
}

/**
 * Check if a plugin is enabled.
 */
export async function isPluginEnabled(pluginId: string): Promise<boolean> {
  const enabled = await getEnabledPlugins();
  return enabled[pluginId] === true || (Array.isArray(enabled[pluginId]) && enabled[pluginId].length > 0);
}

/**
 * Enable a plugin.
 */
export async function enablePlugin(pluginId: string): Promise<void> {
  const enabled = await getEnabledPlugins();
  enabled[pluginId] = true;
  await setEnabledPlugins(enabled);
}

/**
 * Disable a plugin.
 */
export async function disablePlugin(pluginId: string): Promise<void> {
  const enabled = await getEnabledPlugins();
  delete enabled[pluginId];
  await setEnabledPlugins(enabled);
}

/**
 * Toggle plugin enabled state.
 */
export async function togglePlugin(pluginId: string): Promise<boolean> {
  const isEnabled = await isPluginEnabled(pluginId);
  if (isEnabled) {
    await disablePlugin(pluginId);
    return false;
  } else {
    await enablePlugin(pluginId);
    return true;
  }
}

/**
 * Enable a list of plugins.
 */
export async function enablePlugins(pluginIds: string[]): Promise<void> {
  const enabled = await getEnabledPlugins();
  for (const id of pluginIds) enabled[id] = true;
  await setEnabledPlugins(enabled);
}

/**
 * Disable a list of plugins.
 */
export async function disablePlugins(pluginIds: string[]): Promise<void> {
  const enabled = await getEnabledPlugins();
  for (const id of pluginIds) delete enabled[id];
  await setEnabledPlugins(enabled);
}

/**
 * Disable all plugins.
 */
export async function disableAllPlugins(): Promise<void> {
  await setEnabledPlugins({});
}

// ============================================
// Plugin State Summary
// ============================================

/**
 * Get plugin state summary.
 */
export async function getPluginStateSummary(): Promise<{
  enabled: string[];
  disabled: string[];
  total: number;
}> {
  const enabledMap = await getEnabledPlugins();
  const enabled = Object.keys(enabledMap).filter(id => enabledMap[id] === true || Array.isArray(enabledMap[id]));
  
  return {
    enabled,
    disabled: [], 
    total: enabled.length,
  };
}
