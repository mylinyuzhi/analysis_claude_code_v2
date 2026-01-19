/**
 * @claudecode/platform - Auth Type Definitions
 *
 * Type definitions for the authentication system.
 * Reconstructed from chunks.48.mjs, chunks.82.mjs
 */

// ============================================
// OAuth Configuration
// ============================================

/**
 * OAuth configuration constants.
 * Original: b5Q in chunks.20.mjs
 */
export interface OAuthConfig {
  BASE_API_URL: string;
  CONSOLE_AUTHORIZE_URL: string;
  CLAUDE_AI_AUTHORIZE_URL: string;
  TOKEN_URL: string;
  API_KEY_URL: string;
  ROLES_URL: string;
  CONSOLE_SUCCESS_URL: string;
  CLAUDEAI_SUCCESS_URL: string;
  MANUAL_REDIRECT_URL: string;
  CLIENT_ID: string;
  OAUTH_FILE_SUFFIX: string;
  MCP_PROXY_URL?: string;
  MCP_PROXY_PATH?: string;
}

// ============================================
// API Key Resolution
// ============================================

/**
 * API key source types.
 */
export type ApiKeySource =
  | 'ANTHROPIC_API_KEY'
  | 'CLAUDE_CODE_OAUTH_TOKEN'
  | 'apiKeyHelper'
  | 'keychain'
  | 'config'
  | 'none';

/**
 * API key resolution result.
 */
export interface ApiKeyResult {
  key: string | null;
  source: ApiKeySource;
}

/**
 * Options for API key resolution.
 */
export interface GetApiKeyOptions {
  skipRetrievingKeyFromApiKeyHelper?: boolean;
}

// ============================================
// OAuth Tokens
// ============================================

/**
 * OAuth token data.
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
}

/**
 * OAuth token source types.
 */
export type OAuthTokenSource =
  | 'claudeAi'
  | 'fileDescriptor'
  | 'environment'
  | 'none';

/**
 * Claude.ai OAuth account info.
 */
export interface OAuthAccount {
  accountUuid?: string;
  organizationUuid?: string;
  email?: string;
  subscriptionType?: SubscriptionType;
}

/**
 * Subscription types.
 */
export type SubscriptionType = 'max' | 'pro' | 'enterprise' | 'team' | null;

// ============================================
// Provider Configuration
// ============================================

/**
 * Provider types for API client creation.
 */
export type ProviderType = 'anthropic' | 'bedrock' | 'vertex' | 'foundry';

/**
 * Provider client options.
 */
export interface ProviderClientOptions {
  apiKey?: string | null;
  authToken?: string;
  maxRetries?: number;
  timeout?: number;
  fetchOverride?: typeof fetch;
}

/**
 * Bedrock configuration.
 */
export interface BedrockConfig {
  awsAccessKey?: string;
  awsSecretKey?: string;
  awsRegion?: string;
  awsSessionToken?: string;
}

/**
 * Vertex configuration.
 */
export interface VertexConfig {
  projectId?: string;
  region?: string;
  googleAuthOptions?: unknown;
}

/**
 * Foundry configuration.
 */
export interface FoundryConfig {
  azureADToken?: string;
  managedIdentity?: boolean;
}

// ============================================
// Keychain
// ============================================

/**
 * Keychain storage entry.
 */
export interface KeychainEntry {
  key: string;
  source: string;
  createdAt?: string;
}

/**
 * Credentials storage (plaintext fallback).
 */
export interface CredentialsStorage {
  apiKey?: string;
  oauthTokens?: OAuthTokens;
  lastUpdated?: string;
}

// ============================================
// Token Refresh
// ============================================

/**
 * Token refresh result.
 */
export interface TokenRefreshResult {
  success: boolean;
  tokens?: OAuthTokens;
  error?: string;
}

/**
 * Token refresh lock state.
 */
export interface RefreshLockState {
  isLocked: boolean;
  lockAcquiredAt?: number;
  lockOwner?: string;
}

// ============================================
// Auth Events
// ============================================

/**
 * Auth event types for telemetry.
 */
export type AuthEventType =
  | 'tengu_oauth_success'
  | 'tengu_oauth_error'
  | 'tengu_oauth_manual_entry'
  | 'tengu_oauth_token_refresh_success'
  | 'tengu_oauth_token_refresh_failure'
  | 'tengu_oauth_token_refresh_lock_acquiring'
  | 'tengu_oauth_token_refresh_lock_acquired'
  | 'tengu_api_key_saved_to_keychain'
  | 'tengu_api_key_keychain_error';

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出。
