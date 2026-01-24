/**
 * @claudecode/platform - API Key Resolution
 *
 * API key resolution and management.
 * Reconstructed from chunks.48.mjs
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';
import { isInteractive, getClientType, parseBoolean, isNonInteractive } from '@claudecode/shared';
import type {
  ApiKeyResult,
  ApiKeySource,
  GetApiKeyOptions,
  KeychainEntry,
} from './types.js';
import {
  AUTH_ENV_VARS,
  FD_PATH_PATTERNS,
  KEYCHAIN_CONFIG,
  API_KEY_HELPER_CONFIG,
  CREDENTIALS_PATHS,
  getConfigFilePath,
} from './constants.js';

// ============================================
// State
// ============================================

let cachedApiKeyHelperResult: string | null = null;
let apiKeyHelperCacheExpiry: number = 0;

// ============================================
// Mode Detection
// ============================================

/**
 * Check if running in SDK mode.
 * Original: eb0 in chunks.1.mjs:2670
 */
export function isSDKMode(): boolean {
  // Returns true if not interactive and not in VS Code
  return !isInteractive() && getClientType() !== 'claude-vscode';
}

/**
 * Check if running in hosted mode.
 * Original: a1 in chunks.1.mjs:3046 (General boolean parser used for env vars)
 */
export function isHostedMode(strict: boolean = false): boolean {
  const envValue = process.env.CLAUDE_CODE_HOSTED_MODE;
  if (strict) {
    return envValue === '1' || envValue === 'true';
  }
  return parseBoolean(envValue);
}

// ============================================
// File Descriptor Reading
// ============================================

/**
 * Get file descriptor path for current platform.
 */
function getFileDescriptorPath(fd: string): string | null {
  const platform = process.platform as keyof typeof FD_PATH_PATTERNS;
  const basePath = FD_PATH_PATTERNS[platform];
  if (!basePath) return null;
  return `${basePath}${fd}`;
}

/**
 * Read API key from file descriptor.
 * Original: aT1 in chunks.48.mjs
 */
export function readApiKeyFromFileDescriptor(): string | null {
  const fd = process.env[AUTH_ENV_VARS.API_KEY_FILE_DESCRIPTOR];
  if (!fd) return null;

  const fdPath = getFileDescriptorPath(fd);
  if (!fdPath) return null;

  try {
    const key = fs.readFileSync(fdPath, 'utf-8').trim();
    return key || null;
  } catch {
    return null;
  }
}

/**
 * Read OAuth token from file descriptor.
 * Original: nT1 in chunks.48.mjs
 */
export function readOAuthTokenFromFileDescriptor(): string | null {
  const fd = process.env[AUTH_ENV_VARS.OAUTH_TOKEN_FILE_DESCRIPTOR];
  if (!fd) return null;

  const fdPath = getFileDescriptorPath(fd);
  if (!fdPath) return null;

  try {
    const token = fs.readFileSync(fdPath, 'utf-8').trim();
    return token || null;
  } catch {
    return null;
  }
}

// ============================================
// API Key Masking & Config
// ============================================

/**
 * Mask API key for display/storage.
 * For approval check, it returns last 20 characters.
 * Original: TL in chunks.48.mjs:1664
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 20) return apiKey;
  return apiKey.slice(-20);
}

/**
 * Hash API key for config storage (Simple fallback).
 */
export function hashApiKey(apiKey: string): string {
  // Simple hash for comparison (not cryptographic)
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    const char = apiKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Get configuration from the main config file.
 * Original: L1 in chunks.48.mjs (inferred)
 */
function getConfig(): any {
  const configPath = getConfigFilePath();
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch {
    // Ignore errors
  }
  return {};
}

// ============================================
// API Key Helper
// ============================================

/**
 * Check if API key helper is configured.
 * Original: uOA in chunks.48.mjs:1830
 */
export function hasApiKeyHelper(): boolean {
  // Check settings for apiKeyHelper
  const config = getConfig();
  return !!config.apiKeyHelper;
}

/**
 * Execute API key helper script.
 * Original: mOA in chunks.48.mjs:2299
 */
export function executeApiKeyHelper(isTrusted: boolean = true): string | null {
  // Check cache
  if (cachedApiKeyHelperResult && Date.now() < apiKeyHelperCacheExpiry) {
    return cachedApiKeyHelperResult;
  }

  const config = getConfig();
  const helperCommand = config.apiKeyHelper;

  if (!helperCommand) return null;

  // Note: In source, it also checks for workspace trust if helper is from project settings.
  // Here we assume basic execution.

  try {
    const result = execSync(helperCommand, {
      timeout: API_KEY_HELPER_CONFIG.EXECUTION_TIMEOUT_MS,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (result) {
      // Cache the result
      const ttl = parseInt(
        process.env[AUTH_ENV_VARS.API_KEY_HELPER_TTL_MS] ||
          String(API_KEY_HELPER_CONFIG.DEFAULT_TTL_MS),
        10
      );
      cachedApiKeyHelperResult = result;
      apiKeyHelperCacheExpiry = Date.now() + ttl;
      return result;
    }
  } catch (error) {
    // Helper failed, log error similar to source line 2313
    const errorMessage = "Error getting API key from apiKeyHelper (in settings or ~/.claude.json):";
    console.error(errorMessage, error instanceof Error ? error.message : String(error));
    return " "; // Source returns a space on failure to indicate attempt but error
  }

  return null;
}

/**
 * Clear API key helper cache.
 */
export function clearApiKeyHelperCache(): void {
  cachedApiKeyHelperResult = null;
  apiKeyHelperCacheExpiry = 0;
}

// ============================================
// Keychain
// ============================================

/**
 * Read API key from macOS Keychain or Config.
 * Original: dOA in chunks.48.mjs:2326
 */
export function getKeychainKey(): ApiKeyResult | null {
  if (process.platform === 'darwin') {
    try {
      const serviceName = KEYCHAIN_CONFIG.SERVICE_NAME;
      // Source uses `security find-generic-password -a $USER -w -s "${Q}"`
      const result = execSync(
        `security find-generic-password -a $USER -w -s "${serviceName}"`,
        { encoding: 'utf-8', timeout: 5000 }
      ).trim();

      if (result) {
        return { key: result, source: 'keychain' };
      }
    } catch {
      // Keychain access failed
    }
  }

  // Fallback to primaryApiKey in config file
  const config = getConfig();
  if (config.primaryApiKey) {
    return { key: config.primaryApiKey, source: 'config' };
  }

  return null;
}

/**
 * Save API key to macOS Keychain.
 * Original: TEQ in chunks.48.mjs:1985
 */
export function saveKeychainKey(apiKey: string): boolean {
  if (process.platform !== 'darwin') {
    return saveConfigFileKey(apiKey);
  }

  try {
    const serviceName = KEYCHAIN_CONFIG.SERVICE_NAME;
    const accountName = os.userInfo().username;
    const hexKey = Buffer.from(apiKey, 'utf-8').toString('hex');

    // Add/Update entry using security command
    const command = `add-generic-password -U -a "${accountName}" -s "${serviceName}" -X "${hexKey}"`;
    execSync(`security -i <<EOF\n${command}\nEOF`, { timeout: 5000 });

    return true;
  } catch (error) {
    console.error('Failed to save API key to keychain:', error);
    return saveConfigFileKey(apiKey);
  }
}

// ============================================
// Config File Fallback
// ============================================

/**
 * Read API key from config file (plaintext fallback).
 */
function getConfigFileKey(): ApiKeyResult | null {
  const config = getConfig();
  if (config.apiKey) {
    return { key: config.apiKey, source: 'config' };
  }
  return null;
}

/**
 * Save API key to config file (plaintext fallback).
 */
function saveConfigFileKey(apiKey: string): boolean {
  const configPath = getConfigFilePath();
  const configDir = path.dirname(configPath);

  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    }

    const currentConfig = getConfig();
    const updatedConfig = {
      ...currentConfig,
      apiKey,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), {
      mode: 0o600,
    });

    return true;
  } catch {
    return false;
  }
}

// ============================================
// Main Resolution Function
// ============================================

/**
 * Get API key and its source.
 * Original: Oz in chunks.48.mjs:1780-1828
 *
 * Priority order:
 * 1. ANTHROPIC_API_KEY (SDK mode)
 * 2. File descriptor (if hosted)
 * 3. ANTHROPIC_API_KEY (user approved)
 * 4. File descriptor (general)
 * 5. API key helper script
 * 6. Keychain/config storage
 */
export function getApiKeyAndSource(
  options: GetApiKeyOptions = {}
): ApiKeyResult {
  // 1. SDK mode: Use env var directly
  if (isSDKMode() && process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY]) {
    return {
      key: process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY]!,
      source: 'ANTHROPIC_API_KEY',
    };
  }

  // 2. Hosted mode: Require explicit auth
  if (isHostedMode(false)) {
    const keyFromFd = readApiKeyFromFileDescriptor();
    if (keyFromFd) {
      return { key: keyFromFd, source: 'ANTHROPIC_API_KEY' };
    }

    if (
      !process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY] &&
      !process.env[AUTH_ENV_VARS.CLAUDE_CODE_OAUTH_TOKEN] &&
      !process.env[AUTH_ENV_VARS.OAUTH_TOKEN_FILE_DESCRIPTOR]
    ) {
      throw new Error(
        'ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required'
      );
    }

    if (process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY]) {
      return {
        key: process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY]!,
        source: 'ANTHROPIC_API_KEY',
      };
    }

    return { key: null, source: 'none' };
  }

  // 3. Normal mode: Check user-approved API key
  const envKey = process.env[AUTH_ENV_VARS.ANTHROPIC_API_KEY];
  if (envKey) {
    const config = getConfig();
    const maskedKey = maskApiKey(envKey);
    if (config.customApiKeyResponses?.approved?.includes(maskedKey)) {
      return {
        key: envKey,
        source: 'ANTHROPIC_API_KEY',
      };
    }
  }

  // 4. Try file descriptor
  const apiKeyFromFd = readApiKeyFromFileDescriptor();
  if (apiKeyFromFd) {
    return { key: apiKeyFromFd, source: 'ANTHROPIC_API_KEY' };
  }

  // 5. Try apiKeyHelper script
  if (options.skipRetrievingKeyFromApiKeyHelper) {
    if (hasApiKeyHelper()) {
      return { key: null, source: 'apiKeyHelper' };
    }
  } else {
    // Pass trust context: true if interactive
    const helperKey = executeApiKeyHelper(isInteractive());
    if (helperKey) {
      return { key: helperKey, source: 'apiKeyHelper' };
    }
  }

  // 6. Try keychain/stored credentials
  const storedKey = getKeychainKey();
  if (storedKey) {
    return storedKey;
  }

  return { key: null, source: 'none' };
}

/**
 * Get API key only (convenience function).
 * Original: YL in chunks.48.mjs:1763-1768
 */
export function getApiKey(): string | null {
  return getApiKeyAndSource().key;
}
