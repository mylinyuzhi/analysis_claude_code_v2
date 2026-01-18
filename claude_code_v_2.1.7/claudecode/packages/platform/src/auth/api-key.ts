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
 * Original: eb0 in chunks.48.mjs
 */
export function isSDKMode(): boolean {
  return process.env.CLAUDE_CODE_SDK_MODE === '1';
}

/**
 * Check if running in hosted mode.
 * Original: a1 in chunks.48.mjs
 */
export function isHostedMode(strict: boolean = false): boolean {
  const envValue = process.env.CLAUDE_CODE_HOSTED_MODE;
  if (strict) {
    return envValue === '1' || envValue === 'true';
  }
  return !!envValue && envValue !== '0' && envValue !== 'false';
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
// API Key Masking
// ============================================

/**
 * Mask API key for display/storage.
 * Original: TL in chunks.48.mjs
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return '*'.repeat(apiKey.length);
  return `${apiKey.slice(0, 4)}..${apiKey.slice(-4)}`;
}

/**
 * Hash API key for config storage.
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

// ============================================
// API Key Helper
// ============================================

/**
 * Check if API key helper is configured.
 * Original: uOA in chunks.48.mjs
 */
export function hasApiKeyHelper(): boolean {
  // Check config for apiKeyHelper setting
  const configPath = path.join(os.homedir(), CREDENTIALS_PATHS.CONFIG_FILE);
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return !!config.apiKeyHelper;
  } catch {
    return false;
  }
}

/**
 * Execute API key helper script.
 * Original: mOA in chunks.48.mjs
 */
export function executeApiKeyHelper(trustedContext?: unknown): string | null {
  // Check cache
  if (cachedApiKeyHelperResult && Date.now() < apiKeyHelperCacheExpiry) {
    return cachedApiKeyHelperResult;
  }

  const configPath = path.join(os.homedir(), CREDENTIALS_PATHS.CONFIG_FILE);
  let helperCommand: string | undefined;

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    helperCommand = config.apiKeyHelper;
  } catch {
    return null;
  }

  if (!helperCommand) return null;

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
  } catch {
    // Helper failed, return null
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
 * Read API key from macOS Keychain.
 * Original: dOA in chunks.48.mjs
 */
export function getKeychainKey(): ApiKeyResult | null {
  if (process.platform !== 'darwin') {
    return getConfigFileKey();
  }

  try {
    const result = execSync(
      `security find-generic-password -s "${KEYCHAIN_CONFIG.SERVICE_NAME}" -a "${KEYCHAIN_CONFIG.API_KEY_ACCOUNT}" -w 2>/dev/null`,
      { encoding: 'utf-8', timeout: 5000 }
    ).trim();

    if (result) {
      // Keychain stores hex-encoded JSON
      try {
        const decoded = Buffer.from(result, 'hex').toString('utf-8');
        const data = JSON.parse(decoded) as KeychainEntry;
        return { key: data.key, source: 'keychain' };
      } catch {
        // Might be plain API key
        return { key: result, source: 'keychain' };
      }
    }
  } catch {
    // Keychain access failed, fallback to config file
  }

  return getConfigFileKey();
}

/**
 * Save API key to macOS Keychain.
 */
export function saveKeychainKey(apiKey: string): boolean {
  if (process.platform !== 'darwin') {
    return saveConfigFileKey(apiKey);
  }

  try {
    const entry: KeychainEntry = {
      key: apiKey,
      source: 'user',
      createdAt: new Date().toISOString(),
    };
    const encoded = Buffer.from(JSON.stringify(entry)).toString('hex');

    // Delete existing entry first
    try {
      execSync(
        `security delete-generic-password -s "${KEYCHAIN_CONFIG.SERVICE_NAME}" -a "${KEYCHAIN_CONFIG.API_KEY_ACCOUNT}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 5000 }
      );
    } catch {
      // May not exist
    }

    // Add new entry
    execSync(
      `security add-generic-password -s "${KEYCHAIN_CONFIG.SERVICE_NAME}" -a "${KEYCHAIN_CONFIG.API_KEY_ACCOUNT}" -w "${encoded}"`,
      { encoding: 'utf-8', timeout: 5000 }
    );

    return true;
  } catch {
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
  const credentialsPath = path.join(
    os.homedir(),
    CREDENTIALS_PATHS.CREDENTIALS_FILE
  );

  try {
    const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    if (data.apiKey) {
      return { key: data.apiKey, source: 'config' };
    }
  } catch {
    // File doesn't exist or is invalid
  }

  return null;
}

/**
 * Save API key to config file (plaintext fallback).
 */
function saveConfigFileKey(apiKey: string): boolean {
  const credentialsDir = path.join(os.homedir(), '.claude');
  const credentialsPath = path.join(
    os.homedir(),
    CREDENTIALS_PATHS.CREDENTIALS_FILE
  );

  try {
    // Ensure directory exists
    if (!fs.existsSync(credentialsDir)) {
      fs.mkdirSync(credentialsDir, { recursive: true, mode: 0o700 });
    }

    const data = {
      apiKey,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(credentialsPath, JSON.stringify(data, null, 2), {
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
 * 2. File descriptor
 * 3. ANTHROPIC_API_KEY (user approved)
 * 4. API key helper script
 * 5. Keychain/config storage
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

  // 3. Try file descriptor
  const apiKeyFromFd = readApiKeyFromFileDescriptor();
  if (apiKeyFromFd) {
    return { key: apiKeyFromFd, source: 'ANTHROPIC_API_KEY' };
  }

  // 4. Try apiKeyHelper script
  if (!options.skipRetrievingKeyFromApiKeyHelper) {
    const helperKey = executeApiKeyHelper();
    if (helperKey) {
      return { key: helperKey, source: 'apiKeyHelper' };
    }
  } else if (hasApiKeyHelper()) {
    return { key: null, source: 'apiKeyHelper' };
  }

  // 5. Try keychain/stored credentials
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

// ============================================
// Export
// ============================================

export {
  isSDKMode,
  isHostedMode,
  readApiKeyFromFileDescriptor,
  readOAuthTokenFromFileDescriptor,
  maskApiKey,
  hashApiKey,
  hasApiKeyHelper,
  executeApiKeyHelper,
  clearApiKeyHelperCache,
  getKeychainKey,
  saveKeychainKey,
  getApiKeyAndSource,
  getApiKey,
};
