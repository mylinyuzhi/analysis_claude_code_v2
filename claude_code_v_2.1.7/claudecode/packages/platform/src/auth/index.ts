/**
 * @claudecode/platform - Auth Module
 *
 * Authentication system for Claude Code.
 * Supports API key, OAuth, and provider-specific authentication.
 *
 * Reconstructed from chunks.48.mjs, chunks.82.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Constants
// ============================================

export {
  OAUTH_CONFIG,
  AUTH_ENV_VARS,
  PROVIDER_ENV_VARS,
  VERTEX_REGION_ENV_VARS,
  FD_PATH_PATTERNS,
  CREDENTIALS_PATHS,
  KEYCHAIN_CONFIG,
  TOKEN_REFRESH_CONFIG,
  API_KEY_HELPER_CONFIG,
  API_HEADERS,
  API_VERSION,
} from './constants.js';

// ============================================
// API Key Management
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
} from './api-key.js';

// ============================================
// OAuth
// ============================================

export {
  isClaudeAiOAuth,
  getClaudeAiOAuth,
  getOAuthTokenSource,
  shouldUseOAuth,
  getOAuthAccount,
  getJwtToken,
  injectAuthHeader,
  saveOAuthTokens,
  clearOAuthTokens,
  isTokenExpiringSoon,
  getTimeUntilExpiry,
  refreshOAuthTokenIfNeeded,
  refreshOAuthToken,
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  fetchOAuthProfile,
  fetchUserRoles,
  createApiKey,
  AuthCodeListener,
  OAuthManager,
} from './oauth.js';
