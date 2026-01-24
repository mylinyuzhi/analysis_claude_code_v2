/**
 * @claudecode/core - LLM API Client Factory
 *
 * Multi-provider client creation for Anthropic, Bedrock, Vertex, and Foundry.
 * Reconstructed from chunks.82.mjs:2634-2737 (createAnthropicClient / XS)
 */

import { parseBoolean, isInteractive } from '@claudecode/shared';
import { 
  isClaudeAiOAuth, 
  getClaudeAiOAuth, 
  refreshOAuthTokenIfNeeded, 
  injectAuthHeader, 
  getApiKey,
} from '@claudecode/platform/auth';
import { getModelBetas } from '@claudecode/platform';
import { 
  isPromptCachingSupported, 
  applyMessageCacheBreakpoints, 
  formatSystemPromptWithCache 
} from './prompt-cache.js';
import type {
  ClientOptions,
  BedrockOptions,
  VertexOptions,
  FoundryOptions,
  AnthropicClientInterface,
  ApiProvider,
  MessagesRequest,
  MessagesResponse,
  StreamEvent,
} from './types.js';

// ============================================
// Constants
// ============================================

/**
 * Default API timeout (10 minutes)
 */
export const DEFAULT_API_TIMEOUT = 600_000;

/**
 * Default max retries
 */
export const DEFAULT_MAX_RETRIES = 10;

/**
 * Default base URL
 */
const DEFAULT_BASE_URL = 'https://api.anthropic.com';

/**
 * API version header
 */
const API_VERSION = '2023-06-01';

// ============================================
// Header Utilities
// ============================================

/**
 * Get user agent string
 * Original: gn (getUserAgent) in chunks.82.mjs
 */
export function getUserAgent(): string {
  // In source, it might be more complex, but this is the standard restored version
  const version = '2.1.7';
  return `claude-code/${version}`;
}

/**
 * Parse custom headers from environment
 * Original: In8 (parseCustomHeaders) in chunks.82.mjs:2744
 */
export function parseCustomHeaders(): Record<string, string> {
  const customHeaders = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!customHeaders) return {};

  const headers: Record<string, string> = {};
  const lines = customHeaders.split(/\n|\r\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (match) {
      const [, key, value] = match;
      if (key && value !== undefined) {
        headers[key] = value;
      }
    }
  }
  return headers;
}

/**
 * Build default headers for API requests
 */
export async function buildDefaultHeaders(): Promise<Record<string, string>> {
  const containerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  const remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  const customHeaders = parseCustomHeaders();

  const headers: Record<string, string> = {
    'x-app': 'cli',
    'User-Agent': getUserAgent(),
    ...customHeaders,
  };

  if (containerId) {
    headers['x-claude-remote-container-id'] = containerId;
  }

  if (remoteSessionId) {
    headers['x-claude-remote-session-id'] = remoteSessionId;
  }

  if (parseBoolean(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) {
    headers['x-anthropic-additional-protection'] = 'true';
  }

  // Refresh OAuth token if needed before adding auth headers
  await refreshOAuthTokenIfNeeded();

  // If not using Claude AI OAuth, add Authorization header (Xn8 in source)
  if (!isClaudeAiOAuth()) {
    injectAuthHeader(headers, isInteractive());
  }

  return headers;
}

// ============================================
// Provider Detection
// ============================================

/**
 * Detect which API provider to use based on environment
 */
export function detectProvider(): ApiProvider {
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return 'bedrock';
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return 'foundry';
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return 'vertex';
  }
  return 'anthropic';
}

// ============================================
// HTTP Client Implementation
// ============================================

/**
 * Native HTTP Anthropic client implementation
 * Uses fetch API directly instead of requiring @anthropic-ai/sdk
 * Compatible with the structure expected by the rest of the app.
 */
export class NativeAnthropicClient implements AnthropicClientInterface {
  private apiKey: string | null;
  private authToken?: string;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private maxRetries: number;
  private fetchFn: typeof fetch;

  constructor(options: ClientOptions & { authToken?: string }) {
    this.apiKey = options.apiKey || null;
    this.authToken = options.authToken;
    this.baseURL = options.baseURL || process.env.ANTHROPIC_BASE_URL || DEFAULT_BASE_URL;
    this.defaultHeaders = options.defaultHeaders || {};
    this.timeout = options.timeout || DEFAULT_API_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.fetchFn = options.fetchOverride || globalThis.fetch;
  }

  private async makeRequest(
    endpoint: string,
    body: unknown,
    options?: { signal?: AbortSignal; stream?: boolean; betas?: string[] }
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': API_VERSION,
      ...this.defaultHeaders,
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (options?.betas && options.betas.length > 0) {
      headers['anthropic-beta'] = options.betas.join(',');
    }

    if (options?.stream) {
      headers['Accept'] = 'text/event-stream';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchFn(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: options?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        let errorJson: { error?: { type?: string; message?: string } } = {};
        try {
          errorJson = JSON.parse(errorBody);
        } catch {
          // Not JSON
        }

        const error = new Error(
          errorJson.error?.message || `API request failed with status ${response.status}`
        );
        (error as any).status = response.status;
        (error as any).type = errorJson.error?.type;
        throw error;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  messages = {
    /**
     * Create a message (non-streaming)
     */
    create: async (request: MessagesRequest): Promise<MessagesResponse> => {
      let { messages, system, enablePromptCaching, model } = request;
      const cachingEnabled = enablePromptCaching && isPromptCachingSupported(model);

      if (cachingEnabled) {
        messages = applyMessageCacheBreakpoints(messages, true);
        if (Array.isArray(system)) {
          system = formatSystemPromptWithCache(system.map(s => s.text), true);
        } else if (typeof system === 'string') {
          system = formatSystemPromptWithCache([system], true);
        }
      }

      const body = {
        model,
        max_tokens: request.max_tokens,
        messages,
        system,
        tools: request.tools,
        tool_choice: request.tool_choice,
        thinking: request.thinking,
        metadata: request.metadata,
        stop_sequences: request.stop_sequences,
        temperature: request.temperature,
        top_p: request.top_p,
        top_k: request.top_k,
        stream: false,
      };

      const betas = getModelBetas(model);
      if (cachingEnabled) {
        betas.push('prompt-caching-2024-07-31');
      }

      const response = await this.makeRequest('/v1/messages', body, {
        betas: Array.from(new Set(betas))
      });
      return (await response.json()) as MessagesResponse;
    },

    /**
     * Create a streaming message
     */
    stream: async function* (
      this: NativeAnthropicClient,
      request: MessagesRequest,
      options?: { signal?: AbortSignal }
    ): AsyncGenerator<StreamEvent> {
      let { messages, system, enablePromptCaching, model } = request;
      const cachingEnabled = enablePromptCaching && isPromptCachingSupported(model);

      if (cachingEnabled) {
        messages = applyMessageCacheBreakpoints(messages, true);
        if (Array.isArray(system)) {
          system = formatSystemPromptWithCache(system.map(s => s.text), true);
        } else if (typeof system === 'string') {
          system = formatSystemPromptWithCache([system], true);
        }
      }

      const body = {
        model,
        max_tokens: request.max_tokens,
        messages,
        system,
        tools: request.tools,
        tool_choice: request.tool_choice,
        thinking: request.thinking,
        metadata: request.metadata,
        stop_sequences: request.stop_sequences,
        temperature: request.temperature,
        top_p: request.top_p,
        top_k: request.top_k,
        stream: true,
      };

      const betas = getModelBetas(model);
      if (cachingEnabled) {
        betas.push('prompt-caching-2024-07-31');
      }

      const response = await this.makeRequest('/v1/messages', body, {
        signal: options?.signal,
        stream: true,
        betas: Array.from(new Set(betas))
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete events from buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;

            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;

              try {
                const event = JSON.parse(data) as StreamEvent;
                yield event;
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }.bind(this),
  };
}

// ============================================
// Client Factory
// ============================================

/**
 * Create an Anthropic API client for the appropriate provider.
 *
 * Original: XS (createAnthropicClient) in chunks.82.mjs:2634-2737
 */
export async function createAnthropicClient(
  options: ClientOptions = {}
): Promise<AnthropicClientInterface> {
  const defaultHeaders = await buildDefaultHeaders();
  const timeout = parseInt(process.env.API_TIMEOUT_MS || String(DEFAULT_API_TIMEOUT), 10);
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;

  const commonConfig = {
    defaultHeaders,
    maxRetries,
    timeout,
    dangerouslyAllowBrowser: true,
    fetchOverride: options.fetchOverride || globalThis.fetch,
  };

  const provider = detectProvider();

  switch (provider) {
    case 'bedrock':
      return createBedrockClient({
        ...options,
        ...commonConfig,
      } as BedrockOptions);

    case 'foundry':
      return createFoundryClient({
        ...options,
        ...commonConfig,
      } as FoundryOptions);

    case 'vertex':
      return createVertexClient({
        ...options,
        ...commonConfig,
      } as VertexOptions);

    default:
      return createFirstPartyClient({
        ...options,
        ...commonConfig,
      });
  }
}

/**
 * Create AWS Bedrock client
 * Original: b41 (BedrockClient) in chunks.82.mjs
 */
async function createBedrockClient(options: BedrockOptions): Promise<AnthropicClientInterface> {
  const awsRegion =
    process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    'us-east-1';

  const bedrockEndpoint = `https://bedrock-runtime.${awsRegion}.amazonaws.com`;

  // Note: True Bedrock implementation would sign requests with AWS SigV4
  return new NativeAnthropicClient({
    ...options,
    baseURL: bedrockEndpoint,
  });
}

/**
 * Create Azure Foundry client
 * Original: u41 (FoundryClient) in chunks.82.mjs
 */
async function createFoundryClient(options: FoundryOptions): Promise<AnthropicClientInterface> {
  const foundryBaseUrl = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
  const foundryApiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY;

  return new NativeAnthropicClient({
    ...options,
    baseURL: foundryBaseUrl || DEFAULT_BASE_URL,
    apiKey: foundryApiKey || options.apiKey,
  });
}

/**
 * Create Google Vertex AI client
 * Original: v61 (VertexClient) in chunks.82.mjs
 */
async function createVertexClient(options: VertexOptions): Promise<AnthropicClientInterface> {
  const projectId =
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.ANTHROPIC_VERTEX_PROJECT_ID;

  const region = process.env.ANTHROPIC_VERTEX_REGION || 'us-central1';
  const vertexEndpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/anthropic/models`;

  return new NativeAnthropicClient({
    ...options,
    baseURL: vertexEndpoint,
  });
}

/**
 * Create first-party Anthropic client
 * Original: hP (AnthropicClient) in chunks.82.mjs
 */
async function createFirstPartyClient(options: ClientOptions): Promise<AnthropicClientInterface> {
  const oauthTokens = getClaudeAiOAuth();
  const apiKey = isClaudeAiOAuth() ? null : options.apiKey || getApiKey();
  const authToken = isClaudeAiOAuth() ? oauthTokens?.accessToken || undefined : undefined;

  return new NativeAnthropicClient({
    ...options,
    apiKey: apiKey || undefined,
    authToken,
  });
}
