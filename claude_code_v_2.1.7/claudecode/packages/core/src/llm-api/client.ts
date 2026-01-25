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
import * as AnthropicSdk from '@anthropic-ai/sdk';
import * as GoogleAuthLib from 'google-auth-library';
import * as AzureIdentity from '@azure/identity';
import * as AwsCredentialProviders from '@aws-sdk/credential-providers';
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
  private authTokenProvider?: () => Promise<string>;
  private requestHeadersProvider?: () => Promise<Record<string, string>>;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private maxRetries: number;
  private fetchFn: typeof fetch;

  public beta: NonNullable<AnthropicClientInterface['beta']>;

  constructor(
    options: ClientOptions & {
      authToken?: string;
      authTokenProvider?: () => Promise<string>;
      requestHeadersProvider?: () => Promise<Record<string, string>>;
    }
  ) {
    this.apiKey = options.apiKey || null;
    this.authToken = options.authToken;
    this.authTokenProvider = options.authTokenProvider;
    this.requestHeadersProvider = options.requestHeadersProvider;
    this.baseURL = options.baseURL || process.env.ANTHROPIC_BASE_URL || DEFAULT_BASE_URL;
    this.defaultHeaders = options.defaultHeaders || {};
    this.timeout = options.timeout || DEFAULT_API_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.fetchFn = options.fetchOverride || globalThis.fetch;

    // SDK-compatible surface: beta.messages.countTokens
    // Original: `client.beta.messages.countTokens` in chunks.85.mjs:713
    this.beta = {
      messages: {
        countTokens: async (request) => {
          const body: any = {
            model: request.model,
            messages:
              request.messages && request.messages.length > 0
                ? request.messages
                : [{ role: 'user', content: 'foo' }],
            ...(request.tools && request.tools.length > 0 ? { tools: request.tools } : {}),
            ...(request.thinking ? { thinking: request.thinking } : {}),
          };

          const betas = request.betas ?? [];
          const response = await this.makeRequest('/v1/messages/count_tokens', body, {
            betas,
          });
          return (await response.json()) as { input_tokens: number };
        },
      },
    };
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

    if (this.requestHeadersProvider) {
      const extra = await this.requestHeadersProvider();
      for (const [k, v] of Object.entries(extra)) {
        headers[k] = v;
      }
    }

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (!headers['Authorization'] && this.authTokenProvider) {
      const token = await this.authTokenProvider();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
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
// Anthropic SDK Wrapper (source parity)
// ============================================

/**
 * Create an Anthropic-SDK-style logger.
 * Original: B51 in chunks.82.mjs:2625-2632
 */
function createSdkLogger(): {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
} {
  return {
    error: (...args) => console.error('[Anthropic SDK ERROR]', ...args),
    warn: (...args) => console.error('[Anthropic SDK WARN]', ...args),
    info: (...args) => console.error('[Anthropic SDK INFO]', ...args),
    debug: (...args) => console.error('[Anthropic SDK DEBUG]', ...args),
  };
}

function getSdkCtor(name: string): any {
  const mod: any = AnthropicSdk as any;
  return mod[name] ?? mod.default?.[name];
}

function wrapSdkClient(sdkClient: any): AnthropicClientInterface {
  return {
    messages: {
      create: async (request: MessagesRequest): Promise<MessagesResponse> => {
        let { messages, system, enablePromptCaching, model } = request;
        const cachingEnabled = enablePromptCaching && isPromptCachingSupported(model);

        if (cachingEnabled) {
          messages = applyMessageCacheBreakpoints(messages, true);
          if (Array.isArray(system)) {
            system = formatSystemPromptWithCache(system.map((s) => s.text), true);
          } else if (typeof system === 'string') {
            system = formatSystemPromptWithCache([system], true);
          }
        }

        const betas = getModelBetas(model);
        if (cachingEnabled) {
          betas.push('prompt-caching-2024-07-31');
        }

        const sdkRequest: any = {
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
          ...(betas.length > 0 ? { betas: Array.from(new Set(betas)) } : {}),
        };

        return (await sdkClient.messages.create(sdkRequest)) as MessagesResponse;
      },

      stream: async function* (
        request: MessagesRequest,
        options?: { signal?: AbortSignal }
      ): AsyncGenerator<StreamEvent> {
        let { messages, system, enablePromptCaching, model } = request;
        const cachingEnabled = enablePromptCaching && isPromptCachingSupported(model);

        if (cachingEnabled) {
          messages = applyMessageCacheBreakpoints(messages, true);
          if (Array.isArray(system)) {
            system = formatSystemPromptWithCache(system.map((s) => s.text), true);
          } else if (typeof system === 'string') {
            system = formatSystemPromptWithCache([system], true);
          }
        }

        const betas = getModelBetas(model);
        if (cachingEnabled) {
          betas.push('prompt-caching-2024-07-31');
        }

        const sdkRequest: any = {
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
          ...(betas.length > 0 ? { betas: Array.from(new Set(betas)) } : {}),
        };

        // The SDK already exposes an event stream compatible with our `StreamEvent` union.
        for await (const evt of sdkClient.messages.stream(sdkRequest, {
          signal: options?.signal,
        })) {
          yield evt as StreamEvent;
        }
      },
    },

    beta: sdkClient.beta,
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
  // Original: chunks.82.mjs:2666-2687
  const awsRegion =
    process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    'us-east-1';

  const AnthropicBedrock = getSdkCtor('AnthropicBedrock');
  if (!AnthropicBedrock) {
    throw new Error('Missing AnthropicBedrock SDK export; cannot create Bedrock client');
  }

  const skipAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) || options.skipAuth === true;
  const sdkLogger = parseBoolean(process.env.DEBUG_ANTHROPIC_SDK) ? createSdkLogger() : undefined;

  const bedrockOptions: any = {
    defaultHeaders: options.defaultHeaders,
    maxRetries: options.maxRetries,
    timeout: options.timeout,
    dangerouslyAllowBrowser: true,
    fetch: (options.fetchOverride || globalThis.fetch) as any,
    awsRegion,
    ...(sdkLogger ? { logger: sdkLogger } : {}),
    ...(skipAuth ? { skipAuth: true } : {}),
  };

  if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
    bedrockOptions.skipAuth = true;
    bedrockOptions.defaultHeaders = {
      ...(bedrockOptions.defaultHeaders ?? {}),
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`,
    };
  } else if (!bedrockOptions.skipAuth) {
    // Resolve AWS credentials using the Node provider chain.
    const fromNodeProviderChain: any = (AwsCredentialProviders as any).fromNodeProviderChain;
    if (!fromNodeProviderChain) {
      throw new Error('Missing fromNodeProviderChain; cannot resolve AWS credentials for Bedrock');
    }
    const provider = fromNodeProviderChain();
    const creds = await provider();
    if (!creds?.accessKeyId || !creds?.secretAccessKey) {
      const err: any = new Error('Failed to resolve AWS credentials for Bedrock');
      err.name = 'CredentialsProviderError';
      throw err;
    }
    bedrockOptions.awsAccessKey = creds.accessKeyId;
    bedrockOptions.awsSecretKey = creds.secretAccessKey;
    if (creds.sessionToken) bedrockOptions.awsSessionToken = creds.sessionToken;
  }

  return wrapSdkClient(new AnthropicBedrock(bedrockOptions));
}

/**
 * Create Azure Foundry client
 * Original: u41 (FoundryClient) in chunks.82.mjs
 */
async function createFoundryClient(options: FoundryOptions): Promise<AnthropicClientInterface> {
  // Original: chunks.82.mjs:2688-2703
  const AnthropicAzure = getSdkCtor('AnthropicAzure');
  if (!AnthropicAzure) {
    throw new Error('Missing AnthropicAzure SDK export; cannot create Foundry client');
  }

  const foundryBaseUrl = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
  const foundryApiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY;
  const skipAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH);

  let azureADTokenProvider: (() => Promise<string>) | undefined;
  if (!foundryApiKey) {
    if (skipAuth) {
      azureADTokenProvider = () => Promise.resolve('');
    } else {
      const DefaultAzureCredential: any = (AzureIdentity as any).DefaultAzureCredential;
      const getBearerTokenProvider: any = (AzureIdentity as any).getBearerTokenProvider;
      if (!DefaultAzureCredential || !getBearerTokenProvider) {
        throw new Error('Missing @azure/identity exports; cannot create Foundry azureADTokenProvider');
      }
      azureADTokenProvider = getBearerTokenProvider(
        new DefaultAzureCredential(),
        'https://cognitiveservices.azure.com/.default'
      );
    }
  }

  const sdkLogger = parseBoolean(process.env.DEBUG_ANTHROPIC_SDK) ? createSdkLogger() : undefined;
  const foundryOptions: any = {
    defaultHeaders: options.defaultHeaders,
    maxRetries: options.maxRetries,
    timeout: options.timeout,
    dangerouslyAllowBrowser: true,
    fetch: (options.fetchOverride || globalThis.fetch) as any,
    ...(foundryBaseUrl ? { baseURL: foundryBaseUrl } : {}),
    ...(foundryApiKey ? { apiKey: foundryApiKey } : {}),
    ...(azureADTokenProvider ? { azureADTokenProvider } : {}),
    ...(sdkLogger ? { logger: sdkLogger } : {}),
  };

  return wrapSdkClient(new AnthropicAzure(foundryOptions));
}

/**
 * Create Google Vertex AI client
 * Original: v61 (VertexClient) in chunks.82.mjs
 */
async function createVertexClient(options: VertexOptions): Promise<AnthropicClientInterface> {
  // Original: chunks.82.mjs:2704-2726
  const AnthropicVertex = getSdkCtor('AnthropicVertex');
  if (!AnthropicVertex) {
    throw new Error('Missing AnthropicVertex SDK export; cannot create Vertex client');
  }

  const hasProjectEnv =
    Boolean(process.env.GCLOUD_PROJECT) ||
    Boolean(process.env.GOOGLE_CLOUD_PROJECT) ||
    Boolean(process.env.gcloud_project) ||
    Boolean(process.env.google_cloud_project);
  const hasCredsEnv =
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
    Boolean(process.env.google_application_credentials);

  const skipAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH);
  const GoogleAuth: any = (GoogleAuthLib as any).GoogleAuth;
  if (!GoogleAuth) {
    throw new Error('Missing google-auth-library GoogleAuth export; cannot create Vertex client');
  }

  const googleAuth = skipAuth
    ? {
        getClient: () => ({
          getRequestHeaders: () => ({}),
        }),
      }
    : new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        ...(!hasProjectEnv && !hasCredsEnv
          ? { projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID }
          : {}),
      });

  const region = options.region || process.env.ANTHROPIC_VERTEX_REGION || 'us-central1';
  const sdkLogger = parseBoolean(process.env.DEBUG_ANTHROPIC_SDK) ? createSdkLogger() : undefined;
  const vertexOptions: any = {
    defaultHeaders: options.defaultHeaders,
    maxRetries: options.maxRetries,
    timeout: options.timeout,
    dangerouslyAllowBrowser: true,
    fetch: (options.fetchOverride || globalThis.fetch) as any,
    region,
    googleAuth,
    ...(sdkLogger ? { logger: sdkLogger } : {}),
  };

  return wrapSdkClient(new AnthropicVertex(vertexOptions));
}

/**
 * Create first-party Anthropic client
 * Original: hP (AnthropicClient) in chunks.82.mjs
 */
async function createFirstPartyClient(options: ClientOptions): Promise<AnthropicClientInterface> {
  // Original: chunks.82.mjs:2727-2737
  const Anthropic = getSdkCtor('default') ?? getSdkCtor('Anthropic') ?? (AnthropicSdk as any);
  if (!Anthropic) {
    throw new Error('Missing Anthropic SDK export; cannot create first-party client');
  }

  const oauthTokens = getClaudeAiOAuth();
  const apiKey = isClaudeAiOAuth() ? null : options.apiKey || getApiKey();
  const authToken = isClaudeAiOAuth() ? oauthTokens?.accessToken || undefined : undefined;

  const sdkLogger = parseBoolean(process.env.DEBUG_ANTHROPIC_SDK) ? createSdkLogger() : undefined;
  const sdkOptions: any = {
    apiKey,
    authToken,
    defaultHeaders: options.defaultHeaders,
    maxRetries: options.maxRetries,
    timeout: options.timeout,
    dangerouslyAllowBrowser: true,
    fetch: (options.fetchOverride || globalThis.fetch) as any,
    ...(sdkLogger ? { logger: sdkLogger } : {}),
  };

  return wrapSdkClient(new (Anthropic as any)(sdkOptions));
}
