/**
 * @claudecode/platform - Auth Constants
 *
 * Authentication system constants.
 * Reconstructed from chunks.20.mjs, chunks.48.mjs
 */

import * as path from 'node:path';
import * as os from 'node:os';
import type { OAuthConfig } from './types.js';

// ============================================
// Environment & Paths
// ============================================

/**
 * Get the Claude configuration directory (~/.claude).
 * Original: zQ in chunks.1.mjs:3042
 */
export function getClaudeDir(): string {
  return path.join(os.homedir(), '.claude');
}

/**
 * Get current environment.
 * Original: f5Q in chunks.20.mjs:489
 */
export function getClaudeCodeEnv(): 'local' | 'staging' | 'prod' {
  const env = process.env.CLAUDE_CODE_ENV;
  if (env === 'local' || env === 'staging' || env === 'prod') {
    return env;
  }
  return 'prod'; // Default to prod as in source
}

/**
 * Get OAuth file suffix for current environment.
 * Original: h5Q in chunks.20.mjs:493-502
 */
export function getOAuthFileSuffix(): string {
  switch (getClaudeCodeEnv()) {
    case 'local':
      return '-local-oauth';
    case 'staging':
      return '-staging-oauth';
    case 'prod':
    default:
      return '';
  }
}

/**
 * Credentials file paths.
 */
export const CREDENTIALS_PATHS = {
  /** Config file (base name) */
  CONFIG_FILE_BASE: '.claude',
  /** Credentials file (plaintext fallback) */
  CREDENTIALS_FILE: '.credentials.json',
  /** Settings file (OAuth tokens) */
  SETTINGS_FILE: 'settings.json',
} as const;

/**
 * Get config file name for current environment.
 * Original: wH in chunks.20.mjs:576
 */
export function getConfigFileName(): string {
  const suffix = getOAuthFileSuffix();
  return `${CREDENTIALS_PATHS.CONFIG_FILE_BASE}${suffix}.json`;
}

/**
 * Get absolute path to the main config file.
 */
export function getConfigFilePath(): string {
  const configDir = process.env.CLAUDE_CONFIG_DIR || os.homedir();
  return path.join(configDir, getConfigFileName());
}

/**
 * Get absolute path to the settings file (~/.claude/settings.json).
 */
export function getSettingsFilePath(): string {
  return path.join(getClaudeDir(), CREDENTIALS_PATHS.SETTINGS_FILE);
}

/**
 * Get absolute path to the credentials file (~/.claude/.credentials.json).
 */
export function getCredentialsFilePath(): string {
  return path.join(getClaudeDir(), CREDENTIALS_PATHS.CREDENTIALS_FILE);
}

// ============================================
// OAuth Configuration
// ============================================

/**
 * OAuth configuration (production).
 * Original: b5Q in chunks.20.mjs:543-554
 */
export const OAUTH_CONFIG_PROD: OAuthConfig = {
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

/**
 * OAuth configuration (local).
 * Original: MZ4 in chunks.20.mjs:557-571
 */
export const OAUTH_CONFIG_LOCAL: OAuthConfig = {
  BASE_API_URL: 'http://localhost:3000',
  CONSOLE_AUTHORIZE_URL: 'http://localhost:3000/oauth/authorize',
  CLAUDE_AI_AUTHORIZE_URL: 'http://localhost:4000/oauth/authorize',
  TOKEN_URL: 'http://localhost:3000/v1/oauth/token',
  API_KEY_URL: 'http://localhost:3000/api/oauth/claude_cli/create_api_key',
  ROLES_URL: 'http://localhost:3000/api/oauth/claude_cli/roles',
  CONSOLE_SUCCESS_URL:
    'http://localhost:3000/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code',
  CLAUDEAI_SUCCESS_URL: 'http://localhost:3000/oauth/code/success?app=claude-code',
  MANUAL_REDIRECT_URL: 'https://console.staging.ant.dev/oauth/code/callback',
  CLIENT_ID: '22422756-60c9-4084-8eb7-27705fd5cf9a',
  OAUTH_FILE_SUFFIX: '-local-oauth',
  MCP_PROXY_URL: 'http://localhost:8205',
  MCP_PROXY_PATH: '/v1/toolbox/shttp/mcp/{server_id}',
};

/**
 * Get OAuth configuration for current environment.
 * Original: v9 in chunks.20.mjs:504-521
 */
export function getOAuthConfig(): OAuthConfig {
  let config: OAuthConfig;
  switch (getClaudeCodeEnv()) {
    case 'local':
      config = OAUTH_CONFIG_LOCAL;
      break;
    case 'staging':
      // Source uses OZ4 ?? b5Q, and OZ4 is void 0
      config = OAUTH_CONFIG_PROD;
      break;
    case 'prod':
    default:
      config = OAUTH_CONFIG_PROD;
      break;
  }

  // Allow overriding client ID via environment
  const overrideClientId = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
  if (overrideClientId) {
    return {
      ...config,
      CLIENT_ID: overrideClientId,
    };
  }

  return config;
}

/**
 * Default OAuth scopes.
 * Original: g5Q in chunks.20.mjs:543
 */
export const DEFAULT_OAUTH_SCOPES = [
  'org:create_api_key',
  'user:profile',
  'user:inference',
  'user:sessions:claude_code',
];

/**
 * OAuth beta header value.
 * Original: zi in chunks.20.mjs:527
 */
export const OAUTH_BETA_HEADER = 'oauth-2025-04-20';

/**
 * Standard beta headers.
 * Reconstructed from chunks.1.mjs:2205-2211
 */
export const BETA_HEADERS = {
  /** Original: zb0 */
  CLAUDE_CODE: 'claude-code-20250219',
  /** Original: $b0 */
  INTERLEAVED_THINKING: 'interleaved-thinking-2025-05-14',
  /** Original: n5A */
  CONTEXT_1M: 'context-1m-2025-08-07',
  /** Original: CdA */
  CONTEXT_MANAGEMENT: 'context-management-2025-06-27',
  /** Original: Cb0 */
  STRUCTURED_OUTPUTS: 'structured-outputs-2025-09-17',
  /** Original: pU1 */
  WEB_SEARCH: 'web-search-2025-03-05',
  /** Original: UdA */
  TOOL_EXAMPLES: 'tool-examples-2025-10-29',
} as const;

/**
 * Current OAuth configuration (memoized snapshot).
 */
export const OAUTH_CONFIG = getOAuthConfig();

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
