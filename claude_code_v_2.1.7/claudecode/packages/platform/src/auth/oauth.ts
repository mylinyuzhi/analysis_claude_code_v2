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
import * as http from 'node:http';
import { analyticsEvent, logError, telemetryMarker } from '../telemetry/index.js';
import { openBrowser } from '../utils/browser.js';
import type {
  OAuthTokens,
  OAuthTokenSource,
  OAuthAccount,
  TokenRefreshResult,
  SubscriptionType,
} from './types.js';
import {
  getOAuthConfig,
  AUTH_ENV_VARS,
  TOKEN_REFRESH_CONFIG,
  CREDENTIALS_PATHS,
  getSettingsFilePath,
  DEFAULT_OAUTH_SCOPES,
} from './constants.js';
import { readOAuthTokenFromFileDescriptor, executeApiKeyHelper } from './api-key.js';

// ============================================
// State
// ============================================

let cachedOAuthTokens: OAuthTokens | null = null;
let isRefreshing = false;

// ============================================
// Internal Helpers
// ============================================

/**
 * Check if the scopes include claude.ai access.
 * Original: xg in chunks.48.mjs
 */
function hasClaudeAiScope(scopes?: string[] | string): boolean {
  if (!scopes) return false;
  const scopeList = Array.isArray(scopes) ? scopes : scopes.split(' ');
  // In source it checks for specific scopes, usually includes 'user:inference' or similar
  return (
    scopeList.includes('user:inference') ||
    scopeList.includes('user:profile') ||
    scopeList.some((s) => s.startsWith('claude-ai'))
  );
}

/**
 * Get the storage provider.
 * Original: ZL in chunks.27.mjs
 */
function getStorage(): any {
  const settingsPath = getSettingsFilePath();
  return {
    read: () => {
      try {
        if (fs.existsSync(settingsPath)) {
          return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        }
      } catch {
        // Ignore errors
      }
      return {};
    },
    update: (data: any) => {
      try {
        const settingsDir = path.dirname(settingsPath);
        if (!fs.existsSync(settingsDir)) {
          fs.mkdirSync(settingsDir, { recursive: true, mode: 0o700 });
        }
        fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), { mode: 0o600 });
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
  };
}

// ============================================
// OAuth Token Management
// ============================================

/**
 * Check if Claude.ai OAuth is active.
 * Original: qB in chunks.48.mjs:2125-2128
 */
export function isClaudeAiOAuth(): boolean {
  const source = getOAuthTokenSource();
  if (source === 'none') return false;
  const tokens = getClaudeAiOAuth();
  return !!tokens?.accessToken && hasClaudeAiScope(tokens.scopes || tokens.scope);
}

/**
 * Get cached Claude.ai OAuth tokens (memoized).
 * Original: g4 in chunks.48.mjs:2346
 */
export function getClaudeAiOAuth(): OAuthTokens | null {
  if (cachedOAuthTokens) {
    return cachedOAuthTokens;
  }

  // 1. Check environment variable
  if (process.env[AUTH_ENV_VARS.CLAUDE_CODE_OAUTH_TOKEN]) {
    cachedOAuthTokens = {
      accessToken: process.env[AUTH_ENV_VARS.CLAUDE_CODE_OAUTH_TOKEN]!,
      refreshToken: null,
      expiresAt: null,
      scopes: [...DEFAULT_OAUTH_SCOPES],
      subscriptionType: null,
      rateLimitTier: null,
    };
    return cachedOAuthTokens;
  }

  // 2. Check file descriptor
  const fdToken = readOAuthTokenFromFileDescriptor();
  if (fdToken) {
    cachedOAuthTokens = {
      accessToken: fdToken,
      refreshToken: null,
      expiresAt: null,
      scopes: [...DEFAULT_OAUTH_SCOPES],
      subscriptionType: null,
      rateLimitTier: null,
    };
    return cachedOAuthTokens;
  }

  // 3. Load from settings
  try {
    const data = getStorage().read();
    if (data?.claudeAiOauth?.accessToken) {
      cachedOAuthTokens = data.claudeAiOauth;
      return cachedOAuthTokens;
    }
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
  }

  return null;
}

/**
 * Get OAuth token source.
 * Original: an in chunks.48.mjs:1735-1761
 */
export function getOAuthTokenSource(): OAuthTokenSource {
  if (process.env[AUTH_ENV_VARS.ANTHROPIC_AUTH_TOKEN]) {
    return 'environment'; // Mapped from ANTHROPIC_AUTH_TOKEN
  }
  if (process.env[AUTH_ENV_VARS.CLAUDE_CODE_OAUTH_TOKEN]) {
    return 'environment';
  }
  if (readOAuthTokenFromFileDescriptor()) {
    return 'fileDescriptor';
  }
  
  const tokens = getClaudeAiOAuth();
  if (tokens?.accessToken && hasClaudeAiScope(tokens.scopes || tokens.scope)) {
    return 'claudeAi';
  }

  return 'none';
}

/**
 * Check if OAuth should be used.
 * Original: iq in chunks.48.mjs:1723-1733
 */
export function shouldUseOAuth(): boolean {
  return getOAuthTokenSource() !== 'none';
}

/**
 * Get OAuth account info.
 */
export function getOAuthAccount(): OAuthAccount | null {
  try {
    const data = getStorage().read();
    return data?.claudeAiOauth?.account || null;
  } catch {
    return null;
  }
}

/**
 * Get current session JWT token.
 * Original: G4A in chunks.89.mjs:2190
 */
export function getJwtToken(): string | undefined {
  // @ts-ignore
  return globalThis.EJ?.jwtToken;
}

/**
 * Inject authorization header into headers object.
 * Original: Xn8 in chunks.82.mjs:2739
 */
export function injectAuthHeader(headers: Record<string, string>, isTrusted: boolean = true): void {
  const token = process.env[AUTH_ENV_VARS.ANTHROPIC_AUTH_TOKEN] || executeApiKeyHelper(isTrusted);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
}

// ============================================
// Token Persistence
// ============================================

/**
 * Save OAuth tokens to settings file.
 * Original: XXA in chunks.48.mjs:2034
 */
export function saveOAuthTokens(tokens: OAuthTokens): boolean {
  if (tokens.scopes && !hasClaudeAiScope(tokens.scopes)) {
    analyticsEvent('tengu_oauth_tokens_not_claude_ai', {});
    return true;
  }

  if (!tokens.refreshToken || !tokens.expiresAt) {
    analyticsEvent('tengu_oauth_tokens_inference_only', {});
    return true;
  }

  try {
    const storage = getStorage();
    const data = storage.read() || {};
    data.claudeAiOauth = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      subscriptionType: tokens.subscriptionType,
      rateLimitTier: tokens.rateLimitTier,
    };
    
    const result = storage.update(data);
    if (result.success) {
      analyticsEvent('tengu_oauth_tokens_saved', { storageBackend: 'file' });
      cachedOAuthTokens = tokens;
      return true;
    } else {
      analyticsEvent('tengu_oauth_tokens_save_failed', { storageBackend: 'file' });
      return false;
    }
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    analyticsEvent('tengu_oauth_tokens_save_exception', { error: (error as Error).message });
    return false;
  }
}

/**
 * Clear OAuth tokens.
 */
export function clearOAuthTokens(): void {
  cachedOAuthTokens = null;
  const storage = getStorage();
  const data = storage.read();
  if (data?.claudeAiOauth) {
    delete data.claudeAiOauth;
    storage.update(data);
  }
}

// ============================================
// Token Expiry
// ============================================

/**
 * Check if token is expiring soon.
 * Original: yg in chunks.48.mjs
 */
export function isTokenExpiringSoon(expiresAt?: number | null): boolean {
  if (!expiresAt) {
    return false;
  }

  const now = Date.now();
  const bufferTime = TOKEN_REFRESH_CONFIG.EXPIRY_BUFFER_MS;

  return now >= expiresAt - bufferTime;
}

/**
 * Get time until token expiry in milliseconds.
 */
export function getTimeUntilExpiry(expiresAt?: number | null): number | null {
  if (!expiresAt) {
    return null;
  }
  return Math.max(0, expiresAt - Date.now());
}

// ============================================
// Token Refresh
// ============================================

/**
 * Refresh OAuth token if needed.
 * Original: xR in chunks.48.mjs:2084-2123
 */
export async function refreshOAuthTokenIfNeeded(retryCount = 0, force = false): Promise<boolean> {
  let tokens = getClaudeAiOAuth();
  
  if (!force) {
    if (!tokens?.refreshToken || !isTokenExpiringSoon(tokens.expiresAt)) {
      return false;
    }
  }

  if (!tokens?.refreshToken || !hasClaudeAiScope(tokens.scopes || tokens.scope)) {
    return false;
  }

  // Prevent concurrent refresh attempts using a lock if possible
  if (isRefreshing) {
    return false;
  }

  isRefreshing = true;

  try {
    analyticsEvent('tengu_oauth_token_refresh_starting', {});
    const result = await refreshAccessToken(tokens.refreshToken);
    if (result.success && result.tokens) {
      saveOAuthTokens(result.tokens);
      return true;
    }
    return false;
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return false;
  } finally {
    isRefreshing = false;
  }
}

/** Alias for refreshOAuthTokenIfNeeded */
export const refreshOAuthToken = refreshOAuthTokenIfNeeded;

/**
 * Refresh access token using refresh token.
 * Original: rT1 in chunks.48.mjs
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenRefreshResult> {
  const oauthConfig = getOAuthConfig();
  try {
    const response = await fetch(oauthConfig.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: oauthConfig.CLIENT_ID,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Token refresh failed: ${response.status} - ${errorText}`,
      };
    }

    const data = (await response.json()) as any;
    const expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : null;
    
    return {
      success: true,
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt,
        scopes: data.scope ? data.scope.split(' ') : [],
        tokenType: data.token_type || 'Bearer',
      },
    };
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
  const oauthConfig = getOAuthConfig();
  const baseUrl = options.useClaudeAi
    ? oauthConfig.CLAUDE_AI_AUTHORIZE_URL
    : oauthConfig.CONSOLE_AUTHORIZE_URL;

  const params = new URLSearchParams({
    client_id: oauthConfig.CLIENT_ID,
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
  const oauthConfig = getOAuthConfig();
  try {
    const params: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
      client_id: oauthConfig.CLIENT_ID,
    };

    if (redirectUri) {
      params.redirect_uri = redirectUri;
    }

    const response = await fetch(oauthConfig.TOKEN_URL, {
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

    const data = (await response.json()) as any;
    const expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : null;

    return {
      success: true,
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
        scopes: data.scope ? data.scope.split(' ') : [],
        tokenType: data.token_type || 'Bearer',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown exchange error',
    };
  }
}

/**
 * Fetch OAuth profile/account info.
 * Original: RZA in chunks.27.mjs:1767-1779
 */
export async function fetchOAuthProfile(accessToken: string): Promise<any> {
  const oauthConfig = getOAuthConfig();
  const url = `${oauthConfig.BASE_API_URL}/api/oauth/profile`;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return null;
  }
}

/**
 * Fetch user roles and store in account info.
 * Original: REQ in chunks.27.mjs:1884-1904
 */
export async function fetchUserRoles(accessToken: string): Promise<any> {
  const oauthConfig = getOAuthConfig();
  try {
    const response = await fetch(oauthConfig.ROLES_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user roles: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    throw error;
  }
}

/**
 * Create a managed API key using OAuth access token.
 * Original: _EQ in chunks.27.mjs:1906-1925
 */
export async function createApiKey(accessToken: string): Promise<string | null> {
  const oauthConfig = getOAuthConfig();
  try {
    const response = await fetch(oauthConfig.API_KEY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to create API key: ${response.statusText}`);
    }
    const data = (await response.json()) as any;
    const apiKey = data?.raw_key;
    if (apiKey) {
      analyticsEvent('tengu_oauth_api_key', { status: 'success', statusCode: response.status });
      return apiKey;
    }
    return null;
  } catch (error) {
    analyticsEvent('tengu_oauth_api_key', {
      status: 'failure',
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// ============================================
// Auth Listener & Manager
// ============================================

/**
 * Local server to listen for OAuth redirect callbacks.
 * Original: eD0 in chunks.97.mjs:983-1072
 */
export class AuthCodeListener {
  private server: http.Server;
  private port: number = 0;
  private promiseResolver: ((code: string) => void) | null = null;
  private promiseRejecter: ((error: Error) => void) | null = null;
  private expectedState: string | null = null;
  private pendingResponse: http.ServerResponse | null = null;
  private callbackPath: string;

  constructor(callbackPath: string = '/callback') {
    this.server = http.createServer();
    this.callbackPath = callbackPath;
  }

  async start(port: number = 0): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server.once('error', (err) => {
        reject(new Error(`Failed to start OAuth callback server: ${err.message}`));
      });
      this.server.listen(port, 'localhost', () => {
        const address = this.server.address() as any;
        this.port = address.port;
        resolve(this.port);
      });
    });
  }

  getPort(): number {
    return this.port;
  }

  hasPendingResponse(): boolean {
    return this.pendingResponse !== null;
  }

  async waitForAuthorization(state: string, onStarted: () => void): Promise<string> {
    return new Promise((resolve, reject) => {
      this.promiseResolver = resolve;
      this.promiseRejecter = reject;
      this.expectedState = state;
      this.startLocalListener(onStarted);
    });
  }

  handleSuccessRedirect(scopes?: string[]): void {
    if (!this.pendingResponse) return;
    
    const oauthConfig = getOAuthConfig();
    const isClaudeAi = scopes?.some(s => s.startsWith('user:'));
    const location = isClaudeAi ? oauthConfig.CLAUDEAI_SUCCESS_URL : oauthConfig.CONSOLE_SUCCESS_URL;

    this.pendingResponse.writeHead(302, { Location: location });
    this.pendingResponse.end();
    this.pendingResponse = null;
    analyticsEvent('tengu_oauth_automatic_redirect', {});
  }

  handleErrorRedirect(): void {
    if (!this.pendingResponse) return;
    const oauthConfig = getOAuthConfig();
    this.pendingResponse.writeHead(302, { Location: oauthConfig.CLAUDEAI_SUCCESS_URL });
    this.pendingResponse.end();
    this.pendingResponse = null;
    analyticsEvent('tengu_oauth_automatic_redirect_error', {});
  }

  private startLocalListener(onStarted: () => void): void {
    this.server.on('request', this.handleRequest.bind(this));
    this.server.on('error', (err) => {
      logError(err);
      this.close();
      if (this.promiseRejecter) this.promiseRejecter(err);
    });
    onStarted();
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname !== this.callbackPath) {
      res.writeHead(404);
      res.end();
      return;
    }

    const code = url.searchParams.get('code') || undefined;
    const state = url.searchParams.get('state') || undefined;
    this.validateAndRespond(code, state, res);
  }

  private validateAndRespond(code: string | undefined, state: string | undefined, res: http.ServerResponse): void {
    if (!code) {
      res.writeHead(400);
      res.end('Authorization code not found');
      if (this.promiseRejecter) this.promiseRejecter(new Error('No authorization code received'));
      return;
    }

    if (state !== this.expectedState) {
      res.writeHead(400);
      res.end('Invalid state parameter');
      if (this.promiseRejecter) this.promiseRejecter(new Error('Invalid state parameter'));
      return;
    }

    this.pendingResponse = res;
    if (this.promiseResolver) {
      this.promiseResolver(code);
      this.promiseResolver = null;
      this.promiseRejecter = null;
    }
  }

  close(): void {
    if (this.pendingResponse) this.handleErrorRedirect();
    this.server.removeAllListeners();
    this.server.close();
  }
}

/**
 * Manager for the OAuth PKCE flow.
 * Original: YkA in chunks.107.mjs:1589-1674
 */
export class OAuthManager {
  private codeVerifier: string;
  private listener: AuthCodeListener | null = null;
  private port: number | null = null;
  private manualAuthCodeResolver: ((code: string) => void) | null = null;

  constructor() {
    this.codeVerifier = generateCodeVerifier();
  }

  async startOAuthFlow(
    onUrlReady: (url: string) => Promise<void>,
    options?: {
      loginWithClaudeAi?: boolean;
      inferenceOnly?: boolean;
      orgUUID?: string;
      expiresIn?: number;
    }
  ): Promise<any> {
    this.listener = new AuthCodeListener();
    this.port = await this.listener.start();

    const codeChallenge = generateCodeChallenge(this.codeVerifier);
    const state = generateState();

    const authOptions = {
      codeChallenge,
      state,
      redirectUri: `http://localhost:${this.port}/callback`,
      useClaudeAi: options?.loginWithClaudeAi,
    };

    const manualUrl = buildAuthorizationUrl({ ...authOptions });
    const autoUrl = buildAuthorizationUrl({ ...authOptions }); // In source they might be slightly different or same

    const code = await this.waitForAuthorizationCode(state, async () => {
      await onUrlReady(manualUrl);
      await openBrowser(autoUrl);
    });

    const isAutomatic = this.listener?.hasPendingResponse() ?? false;
    analyticsEvent('tengu_oauth_auth_code_received', { automatic: isAutomatic });

    try {
      const result = await exchangeCodeForTokens(code, this.codeVerifier, authOptions.redirectUri);
      if (!result.success || !result.tokens) {
        throw new Error(result.error || 'Token exchange failed');
      }

      const tokens = result.tokens;
      
      // Update account info if provided
      const profile = await fetchOAuthProfile(tokens.accessToken);
      
      if (isAutomatic) {
        this.listener?.handleSuccessRedirect(tokens.scopes);
      }

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
        subscriptionType: profile?.subscriptionType,
        rateLimitTier: profile?.rateLimitTier,
      };
    } catch (error) {
      if (isAutomatic) this.listener?.handleErrorRedirect();
      throw error;
    } finally {
      this.listener?.close();
    }
  }

  private async waitForAuthorizationCode(state: string, onStarted: () => void): Promise<string> {
    return new Promise((resolve, reject) => {
      this.manualAuthCodeResolver = resolve;
      this.listener?.waitForAuthorization(state, onStarted).then((code) => {
        this.manualAuthCodeResolver = null;
        resolve(code);
      }).catch((err) => {
        this.manualAuthCodeResolver = null;
        reject(err);
      });
    });
  }

  handleManualAuthCodeInput(options: { authorizationCode: string; state: string }): void {
    if (this.manualAuthCodeResolver) {
      this.manualAuthCodeResolver(options.authorizationCode);
      this.manualAuthCodeResolver = null;
      this.listener?.close();
    }
  }

  cleanup(): void {
    this.listener?.close();
    this.manualAuthCodeResolver = null;
  }
}
