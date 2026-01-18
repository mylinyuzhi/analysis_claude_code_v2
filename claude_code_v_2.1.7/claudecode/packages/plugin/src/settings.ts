/**
 * @claudecode/plugin - Plugin Settings
 *
 * Enable/disable state management for plugins.
 *
 * Reconstructed from chunks.91.mjs
 *
 * Plugin enabled state is stored in ~/.claude/settings.json
 * under the "enabledPlugins" key.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Constants
// ============================================

/** Settings file path */
const SETTINGS_FILE = '.claude/settings.json';

/** Enabled plugins key */
const ENABLED_PLUGINS_KEY = 'enabledPlugins';

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
 * Get settings file path.
 */
export function getSettingsPath(): string {
  return path.join(getHomeDir(), SETTINGS_FILE);
}

// ============================================
// Settings Management
// ============================================

/**
 * Load settings from disk.
 */
export async function loadSettings(): Promise<Record<string, unknown>> {
  const filePath = getSettingsPath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[Plugin] Failed to load settings:', error);
  }

  return {};
}

/**
 * Save settings to disk.
 */
export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  const filePath = getSettingsPath();

  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Plugin] Failed to save settings:', error);
    throw error;
  }
}

// ============================================
// Plugin Enabled State
// ============================================

/**
 * Get enabled plugins from settings.
 */
export async function getEnabledPlugins(): Promise<string[]> {
  const settings = await loadSettings();
  const enabled = settings[ENABLED_PLUGINS_KEY];

  if (Array.isArray(enabled)) {
    return enabled.filter((item): item is string => typeof item === 'string');
  }

  return [];
}

/**
 * Set enabled plugins in settings.
 */
export async function setEnabledPlugins(pluginIds: string[]): Promise<void> {
  const settings = await loadSettings();
  settings[ENABLED_PLUGINS_KEY] = pluginIds;
  await saveSettings(settings);
}

/**
 * Check if a plugin is enabled.
 */
export async function isPluginEnabled(pluginId: string): Promise<boolean> {
  const enabled = await getEnabledPlugins();
  return enabled.includes(pluginId);
}

/**
 * Enable a plugin.
 */
export async function enablePlugin(pluginId: string): Promise<void> {
  const enabled = await getEnabledPlugins();

  if (enabled.includes(pluginId)) {
    console.log(`[Plugin] Plugin '${pluginId}' is already enabled.`);
    return;
  }

  enabled.push(pluginId);
  await setEnabledPlugins(enabled);

  console.log(`[Plugin] Enabled: ${pluginId}`);
}

/**
 * Disable a plugin.
 */
export async function disablePlugin(pluginId: string): Promise<void> {
  const enabled = await getEnabledPlugins();

  const index = enabled.indexOf(pluginId);
  if (index === -1) {
    console.log(`[Plugin] Plugin '${pluginId}' is already disabled.`);
    return;
  }

  enabled.splice(index, 1);
  await setEnabledPlugins(enabled);

  console.log(`[Plugin] Disabled: ${pluginId}`);
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
 * Enable multiple plugins.
 */
export async function enablePlugins(pluginIds: string[]): Promise<void> {
  const enabled = await getEnabledPlugins();
  const toAdd = pluginIds.filter((id) => !enabled.includes(id));

  if (toAdd.length === 0) {
    console.log('[Plugin] All specified plugins are already enabled.');
    return;
  }

  await setEnabledPlugins([...enabled, ...toAdd]);

  console.log(`[Plugin] Enabled ${toAdd.length} plugins: ${toAdd.join(', ')}`);
}

/**
 * Disable multiple plugins.
 */
export async function disablePlugins(pluginIds: string[]): Promise<void> {
  const enabled = await getEnabledPlugins();
  const remaining = enabled.filter((id) => !pluginIds.includes(id));

  if (remaining.length === enabled.length) {
    console.log('[Plugin] None of the specified plugins were enabled.');
    return;
  }

  await setEnabledPlugins(remaining);

  const disabled = enabled.filter((id) => pluginIds.includes(id));
  console.log(`[Plugin] Disabled ${disabled.length} plugins: ${disabled.join(', ')}`);
}

/**
 * Disable all plugins.
 */
export async function disableAllPlugins(): Promise<void> {
  const enabled = await getEnabledPlugins();

  if (enabled.length === 0) {
    console.log('[Plugin] No plugins are currently enabled.');
    return;
  }

  await setEnabledPlugins([]);

  console.log(`[Plugin] Disabled all ${enabled.length} plugins.`);
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
  const enabled = await getEnabledPlugins();

  // In a full implementation, we would also check installed plugins
  // For now, just return enabled list
  return {
    enabled,
    disabled: [], // Would need installed plugins list
    total: enabled.length,
  };
}

// ============================================
// Export
// ============================================

export {
  getSettingsPath,
  loadSettings,
  saveSettings,
  getEnabledPlugins,
  setEnabledPlugins,
  isPluginEnabled,
  enablePlugin,
  disablePlugin,
  togglePlugin,
  enablePlugins,
  disablePlugins,
  disableAllPlugins,
  getPluginStateSummary,
};
