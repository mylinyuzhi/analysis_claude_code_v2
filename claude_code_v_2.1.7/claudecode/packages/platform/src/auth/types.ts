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
  | '/login managed key'
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
  refreshToken?: string | null;
  expiresAt?: number | null;
  tokenType?: string;
  scope?: string;
  scopes?: string[];
  subscriptionType?: SubscriptionType;
  rateLimitTier?: string | null;
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
  organizationName?: string;
  emailAddress?: string;
  displayName?: string;
  billingType?: string;
  hasExtraUsageEnabled?: boolean;
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
  model?: string;
}

/**
 * Bedrock configuration.
 */
export interface BedrockConfig extends ProviderClientOptions {
  awsAccessKey?: string;
  awsSecretKey?: string;
  awsRegion?: string;
  awsSessionToken?: string;
  skipAuth?: boolean;
  logger?: any;
}

/**
 * Vertex configuration.
 */
export interface VertexConfig extends ProviderClientOptions {
  projectId?: string;
  region?: string;
  googleAuth?: any;
  logger?: any;
}

/**
 * Foundry configuration.
 */
export interface FoundryConfig extends ProviderClientOptions {
  azureADTokenProvider?: () => Promise<string>;
  logger?: any;
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
  | 'tengu_oauth_token_refresh_lock_retry'
  | 'tengu_oauth_token_refresh_lock_retry_limit_reached'
  | 'tengu_oauth_token_refresh_lock_error'
  | 'tengu_oauth_token_refresh_starting'
  | 'tengu_oauth_token_refresh_race_resolved'
  | 'tengu_oauth_token_refresh_race_recovered'
  | 'tengu_api_key_saved_to_keychain'
  | 'tengu_api_key_keychain_error';
