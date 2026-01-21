import { getLocalSettingsPath, readJsonFile, writeJsonFile, type ClaudeSettings } from './loader.js';

// ============================================
// Permission Settings
// ============================================

export interface PermissionRule {
  toolName: string;
  ruleContent?: string;
}

export interface PermissionConfig {
  type: 'addRules' | 'addDirectories';
  rules?: PermissionRule[];
  directories?: string[];
  behavior: 'allow' | 'deny';
  destination: 'localSettings' | 'session';
}

/**
 * Add a permission rule to local settings.
 */
export function addPermissionRule(rule: PermissionConfig): void {
  if (rule.destination !== 'localSettings') {
    return; // Only support persisting to local settings for now
  }

  const localPath = getLocalSettingsPath();
  const settings = readJsonFile<ClaudeSettings>(localPath) || {};
  
  // Initialize permissions object if not exists
  settings.permissions = settings.permissions || {};
  
  // We need to map our simple rule structure to the actual storage format
  // For now, we'll store it in a simple array under 'rules'
  // In a real implementation, this would be more complex
  const existingRules = (settings.permissions.rules as PermissionConfig[]) || [];
  
  // Avoid duplicates
  const isDuplicate = existingRules.some(r => 
    JSON.stringify(r.rules) === JSON.stringify(rule.rules) && 
    JSON.stringify(r.directories) === JSON.stringify(rule.directories) &&
    r.behavior === rule.behavior
  );

  if (!isDuplicate) {
    existingRules.push(rule);
    settings.permissions.rules = existingRules;
    writeJsonFile(localPath, settings);
  }
}
