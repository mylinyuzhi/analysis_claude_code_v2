/**
 * @claudecode/platform - Auth Constants
 *
 * Authentication system constants.
 * Reconstructed from chunks.20.mjs, chunks.48.mjs
 */

import type { OAuthConfig } from './types.js';

// ============================================
// OAuth Configuration
// ============================================

/**
 * OAuth configuration (production).
 * Original: b5Q in chunks.20.mjs:543-554
 */
export const OAUTH_CONFIG: OAuthConfig = {
  BASE_API_URL: 'https://api.anthropic.com',
  CONSOLE_AUTHORIZE_URL: 'https://platform.claude.com/oauth/authorize',
  CLAUDE_AI_AUTHORIZE_URL: 'https://claude.ai/oauth/authorize',
  TOKEN_URL: 'https://platform.claude.com/v1/oauth/token',
  API_KEY_URL: 'https://api.anthropic.com/api/oauth/claude_cli/create_api_key',
  ROLES_URL: 'https://api.anthropic.com/api/oauth/claude_cli/roles',
  CONSOLE_SUCCESS_URL:
    'https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code',
  CLAUDEAI_SUCCESS_URL:
    'https://platform.claude.com/oauth/code/success?app=claude-code',
  MANUAL_REDIRECT_URL: 'https://platform.claude.com/oauth/code/callback',
  CLIENT_ID: '9d1c250a-e61b-44d9-88ed-5944d1962f5e',
  OAUTH_FILE_SUFFIX: '',
  MCP_PROXY_URL: undefined,
  MCP_PROXY_PATH: undefined,
};

// ============================================
// API Key Environment Variables
// ============================================

/**
 * Environment variable names for API keys and OAuth tokens.
 */
export const AUTH_ENV_VARS = {
  /** Direct API key */
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
  /** OAuth token (inference-only) */
  CLAUDE_CODE_OAUTH_TOKEN: 'CLAUDE_CODE_OAUTH_TOKEN',
  /** Bearer token */
  ANTHROPIC_AUTH_TOKEN: 'ANTHROPIC_AUTH_TOKEN',
  /** File descriptor for API key (secure injection) */
  API_KEY_FILE_DESCRIPTOR: 'CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR',
  /** File descriptor for OAuth token (secure injection) */
  OAUTH_TOKEN_FILE_DESCRIPTOR: 'CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR',
  /** API key helper TTL */
  API_KEY_HELPER_TTL_MS: 'CLAUDE_CODE_API_KEY_HELPER_TTL_MS',
} as const;

// ============================================
// Provider Environment Variables
// ============================================

/**
 * Environment variable names for provider selection.
 */
export const PROVIDER_ENV_VARS = {
  USE_BEDROCK: 'CLAUDE_CODE_USE_BEDROCK',
  USE_VERTEX: 'CLAUDE_CODE_USE_VERTEX',
  USE_FOUNDRY: 'CLAUDE_CODE_USE_FOUNDRY',
  CONTAINER_ID: 'CLAUDE_CODE_CONTAINER_ID',
  REMOTE_SESSION_ID: 'CLAUDE_CODE_REMOTE_SESSION_ID',
  ADDITIONAL_PROTECTION: 'CLAUDE_CODE_ADDITIONAL_PROTECTION',
} as const;

/**
 * Vertex region environment variables per model.
 */
export const VERTEX_REGION_ENV_VARS = {
  CLAUDE_4_1_OPUS: 'VERTEX_REGION_CLAUDE_4_1_OPUS',
  CLAUDE_HAIKU_4_5: 'VERTEX_REGION_CLAUDE_HAIKU_4_5',
} as const;

// ============================================
// File Paths
// ============================================

/**
 * File descriptor path patterns by platform.
 */
export const FD_PATH_PATTERNS = {
  darwin: '/dev/fd/',
  freebsd: '/dev/fd/',
  linux: '/proc/self/fd/',
} as const;

/**
 * Credentials file paths.
 */
export const CREDENTIALS_PATHS = {
  /** Config file */
  CONFIG_FILE: '.claude.json',
  /** Credentials file (plaintext fallback) */
  CREDENTIALS_FILE: '.claude/.credentials.json',
  /** Settings file (OAuth tokens) */
  SETTINGS_FILE: 'settings.json',
} as const;

// ============================================
// Keychain
// ============================================

/**
 * Keychain configuration.
 */
export const KEYCHAIN_CONFIG = {
  /** Service name for macOS Keychain */
  SERVICE_NAME: 'claude-code',
  /** Account name for API key */
  API_KEY_ACCOUNT: 'api-key',
  /** Account name for OAuth tokens */
  OAUTH_ACCOUNT: 'oauth-tokens',
} as const;

// ============================================
// Token Refresh
// ============================================

/**
 * Token refresh configuration.
 */
export const TOKEN_REFRESH_CONFIG = {
  /** Buffer time before expiry to trigger refresh (5 minutes) */
  EXPIRY_BUFFER_MS: 5 * 60 * 1000,
  /** Lock file timeout (30 seconds) */
  LOCK_TIMEOUT_MS: 30 * 1000,
  /** Max retry attempts for lock acquisition */
  LOCK_MAX_RETRIES: 3,
  /** Retry delay for lock acquisition */
  LOCK_RETRY_DELAY_MS: 1000,
} as const;

// ============================================
// API Key Helper
// ============================================

/**
 * API key helper configuration.
 */
export const API_KEY_HELPER_CONFIG = {
  /** Default TTL for cached API key (5 minutes) */
  DEFAULT_TTL_MS: 300000,
  /** Execution timeout (10 seconds) */
  EXECUTION_TIMEOUT_MS: 10000,
} as const;

// ============================================
// HTTP Headers
// ============================================

/**
 * Default HTTP headers for API requests.
 */
export const API_HEADERS = {
  /** API version header */
  ANTHROPIC_VERSION: 'anthropic-version',
  /** Beta features header */
  ANTHROPIC_BETA: 'anthropic-beta',
  /** User agent header */
  USER_AGENT: 'User-Agent',
  /** App identifier header */
  X_APP: 'x-app',
  /** API key header */
  X_API_KEY: 'X-Api-Key',
  /** Authorization header */
  AUTHORIZATION: 'Authorization',
} as const;

/**
 * API version value.
 */
export const API_VERSION = '2023-06-01';

// ============================================
// Export
// ============================================

// NOTE: 常量已在声明处导出；移除重复聚合导出。
