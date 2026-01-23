/**
 * @claudecode/platform - OAuth Authentication
 *
 * OAuth 2.0 with PKCE for Claude.ai authentication.
 * Reconstructed from chunks.48.mjs, chunks.82.mjs
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import type {
  OAuthTokens,
  OAuthTokenSource,
  OAuthAccount,
  TokenRefreshResult,
} from './types.js';
import {
  OAUTH_CONFIG,
  AUTH_ENV_VARS,
  TOKEN_REFRESH_CONFIG,
  CREDENTIALS_PATHS,
} from './constants.js';
import { readOAuthTokenFromFileDescriptor } from './api-key.js';

// ============================================
// State
// ============================================

let cachedOAuthTokens: OAuthTokens | null = null;
let cachedOAuthAccount: OAuthAccount | null = null;
let isRefreshing = false;

type OAuthTokenEndpointResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number | string;
  token_type?: string;
  scope?: string;
};

function parseOAuthTokenEndpointResponse(
  data: unknown,
  fallbackRefreshToken?: string
): TokenRefreshResult {
  if (!data || typeof data !== 'object') {
    return {
      success: false,
      error: 'Token endpoint returned invalid JSON',
    };
  }

  const record = data as Partial<OAuthTokenEndpointResponse> &
    Record<string, unknown>;
  const accessToken =
    typeof record.access_token === 'string' ? record.access_token : undefined;

  if (!accessToken) {
    return {
      success: false,
      error: 'Token endpoint response missing access_token',
    };
  }

  const refreshToken =
    typeof record.refresh_token === 'string'
      ? record.refresh_token
      : fallbackRefreshToken;

  const expiresInRaw = record.expires_in;
  const expiresIn =
    typeof expiresInRaw === 'number'
      ? expiresInRaw
      : typeof expiresInRaw === 'string' && expiresInRaw.trim() !== ''
        ? Number(expiresInRaw)
        : undefined;

  const expiresAt = Number.isFinite(expiresIn)
    ? Date.now() + (expiresIn as number) * 1000
    : undefined;

  const tokenType =
    typeof record.token_type === 'string' ? record.token_type : 'Bearer';
  const scope = typeof record.scope === 'string' ? record.scope : undefined;

  const tokens: OAuthTokens = {
    accessToken,
    refreshToken,
    expiresAt,
    tokenType,
    scope,
  };

  return { success: true, tokens };
}

// ============================================
// OAuth Token Management
// ============================================

/**
 * Check if Claude.ai OAuth is active.
 * Original: qB in chunks.48.mjs:2125-2128
 */
export function isClaudeAiOAuth(): boolean {
  const tokens = getClaudeAiOAuth();
  return tokens !== null && !!tokens.accessToken;
}

/**
 * Get cached Claude.ai OAuth tokens (memoized).
 * Original: g4 in chunks.48.mjs
 */
export function getClaudeAiOAuth(): OAuthTokens | null {
  if (cachedOAuthTokens) {
    return cachedOAuthTokens;
  }

  // Try loading from settings
  const tokens = loadOAuthTokensFromSettings();
  if (tokens) {
    cachedOAuthTokens = tokens;
    return tokens;
  }

  return null;
}

/**
 * Get OAuth token source.
 * Original: an in chunks.48.mjs:1735-1761
 */
export function getOAuthTokenSource(): OAuthTokenSource {
  // Check Claude.ai OAuth first
  if (isClaudeAiOAuth()) {
    return 'claudeAi';
  }

  // Check file descriptor
  const fdToken = readOAuthTokenFromFileDescriptor();
  if (fdToken) {
    return 'fileDescriptor';
  }

  // Check environment variable
  if (process.env[AUTH_ENV_VARS.CLAUDE_CODE_OAUTH_TOKEN]) {
    return 'environment';
  }

  return 'none';
}

/**
 * Check if OAuth should be used.
 * Original: iq in chunks.48.mjs:1723-1733
 */
export function shouldUseOAuth(): boolean {
  const source = getOAuthTokenSource();
  return source !== 'none';
}

/**
 * Get OAuth account info.
 */
export function getOAuthAccount(): OAuthAccount | null {
  if (cachedOAuthAccount) {
    return cachedOAuthAccount;
  }

  // Load from settings
  const settingsPath = path.join(os.homedir(), '.claude', CREDENTIALS_PATHS.SETTINGS_FILE);
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    if (settings.claudeAiOauth?.account) {
      cachedOAuthAccount = settings.claudeAiOauth.account;
      return cachedOAuthAccount;
    }
  } catch {
    // Settings file doesn't exist or is invalid
  }

  return null;
}

/**
 * Get current session JWT token.
 * Original: G4A in chunks.89.mjs:2190
 */
export function getJwtToken(): string | undefined {
  // @ts-ignore
  return globalThis.EJ?.jwtToken;
}

// ============================================
// Token Loading
// ============================================

/**
 * Load OAuth tokens from settings file.
 */
function loadOAuthTokensFromSettings(): OAuthTokens | null {
  const settingsPath = path.join(os.homedir(), '.claude', CREDENTIALS_PATHS.SETTINGS_FILE);

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    const oauthData = settings.claudeAiOauth;

    if (oauthData?.accessToken) {
      return {
        accessToken: oauthData.accessToken,
        refreshToken: oauthData.refreshToken,
        expiresAt: oauthData.expiresAt,
        tokenType: oauthData.tokenType || 'Bearer',
        scope: oauthData.scope,
      };
    }
  } catch {
    // Settings file doesn't exist or is invalid
  }

  return null;
}

/**
 * Save OAuth tokens to settings file.
 * Original: XXA in chunks.48.mjs
 */
export function saveOAuthTokens(tokens: OAuthTokens): boolean {
  const settingsDir = path.join(os.homedir(), '.claude');
  const settingsPath = path.join(settingsDir, CREDENTIALS_PATHS.SETTINGS_FILE);

  try {
    // Ensure directory exists
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true, mode: 0o700 });
    }

    // Load existing settings
    let settings: Record<string, unknown> = {};
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch {
      // File doesn't exist or is invalid
    }

    // Update OAuth tokens
    settings.claudeAiOauth = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      tokenType: tokens.tokenType,
      scope: tokens.scope,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), {
      mode: 0o600,
    });

    // Update cache
    cachedOAuthTokens = tokens;

    return true;
  } catch {
    return false;
  }
}

/**
 * Clear OAuth tokens.
 */
export function clearOAuthTokens(): void {
  cachedOAuthTokens = null;
  cachedOAuthAccount = null;

  const settingsPath = path.join(os.homedir(), '.claude', CREDENTIALS_PATHS.SETTINGS_FILE);
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    delete settings.claudeAiOauth;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), {
      mode: 0o600,
    });
  } catch {
    // Ignore errors
  }
}

// ============================================
// Token Expiry
// ============================================

/**
 * Check if token is expiring soon.
 * Original: yg in chunks.48.mjs
 */
export function isTokenExpiringSoon(tokens: OAuthTokens): boolean {
  if (!tokens.expiresAt) {
    return false; // No expiry info, assume valid
  }

  const now = Date.now();
  const expiryTime = tokens.expiresAt;
  const bufferTime = TOKEN_REFRESH_CONFIG.EXPIRY_BUFFER_MS;

  return now >= expiryTime - bufferTime;
}

/**
 * Get time until token expiry in milliseconds.
 */
export function getTimeUntilExpiry(tokens: OAuthTokens): number | null {
  if (!tokens.expiresAt) {
    return null;
  }
  return Math.max(0, tokens.expiresAt - Date.now());
}

// ============================================
// Token Refresh
// ============================================

/**
 * Refresh OAuth token if needed.
 * Original: xR in chunks.48.mjs:2056-2123
 */
export async function refreshOAuthTokenIfNeeded(): Promise<void> {
  const tokens = getClaudeAiOAuth();
  if (!tokens || !tokens.refreshToken) {
    return;
  }

  if (!isTokenExpiringSoon(tokens)) {
    return;
  }

  // Prevent concurrent refresh attempts
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  try {
    const result = await refreshOAuthToken(tokens.refreshToken);
    if (result.success && result.tokens) {
      saveOAuthTokens(result.tokens);
    }
  } finally {
    isRefreshing = false;
  }
}

/**
 * Refresh OAuth token using refresh token.
 */
export async function refreshOAuthToken(
  refreshToken: string
): Promise<TokenRefreshResult> {
  try {
    const response = await fetch(OAUTH_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: OAUTH_CONFIG.CLIENT_ID,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Token refresh failed: ${response.status} - ${errorText}`,
      };
    }

    const data = (await response.json()) as unknown;
    return parseOAuthTokenEndpointResponse(data, refreshToken);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown refresh error',
    };
  }
}

// ============================================
// PKCE Utilities
// ============================================

/**
 * Generate PKCE code verifier.
 */
export function generateCodeVerifier(): string {
  const buffer = crypto.randomBytes(32);
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate PKCE code challenge from verifier.
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate OAuth state parameter.
 */
export function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ============================================
// OAuth URL Building
// ============================================

/**
 * Build OAuth authorization URL.
 */
export function buildAuthorizationUrl(options: {
  codeChallenge: string;
  state: string;
  redirectUri?: string;
  scope?: string;
  useClaudeAi?: boolean;
}): string {
  const baseUrl = options.useClaudeAi
    ? OAUTH_CONFIG.CLAUDE_AI_AUTHORIZE_URL
    : OAUTH_CONFIG.CONSOLE_AUTHORIZE_URL;

  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.CLIENT_ID,
    response_type: 'code',
    code_challenge: options.codeChallenge,
    code_challenge_method: 'S256',
    state: options.state,
  });

  if (options.redirectUri) {
    params.set('redirect_uri', options.redirectUri);
  }

  if (options.scope) {
    params.set('scope', options.scope);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens.
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri?: string
): Promise<TokenRefreshResult> {
  try {
    const params: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
      client_id: OAUTH_CONFIG.CLIENT_ID,
    };

    if (redirectUri) {
      params.redirect_uri = redirectUri;
    }

    const response = await fetch(OAUTH_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Token exchange failed: ${response.status} - ${errorText}`,
      };
    }

    const data = (await response.json()) as unknown;
    return parseOAuthTokenEndpointResponse(data);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown exchange error',
    };
  }
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
