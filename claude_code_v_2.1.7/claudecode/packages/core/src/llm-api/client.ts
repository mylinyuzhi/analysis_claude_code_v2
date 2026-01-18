/**
 * @claudecode/core - LLM API Client Factory
 *
 * Multi-provider client creation for Anthropic, Bedrock, Vertex, and Foundry.
 * Reconstructed from chunks.82.mjs:2634-2737 (createAnthropicClient / XS)
 */

import { parseBoolean } from '@claudecode/shared';
import type {
  ClientOptions,
  BedrockOptions,
  VertexOptions,
  FoundryOptions,
  AnthropicClientInterface,
  ApiProvider,
  MessagesRequest,
  StreamEvent,
} from './types.js';

// ============================================
// Constants
// ============================================

/**
 * Default API timeout (10 minutes)
 */
const DEFAULT_API_TIMEOUT = 600_000;

/**
 * Default max retries
 */
const DEFAULT_MAX_RETRIES = 10;

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
  const version = process.env.npm_package_version || '2.1.7';
  return `claude-code/${version}`;
}

/**
 * Parse custom headers from environment
 * Original: In8 (parseCustomHeaders) in chunks.82.mjs
 */
export function parseCustomHeaders(): Record<string, string> {
  const customHeaders = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!customHeaders) return {};

  try {
    // Format: "Header1: value1, Header2: value2"
    const headers: Record<string, string> = {};
    const pairs = customHeaders.split(',');
    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split(':');
      if (key && valueParts.length > 0) {
        headers[key.trim()] = valueParts.join(':').trim();
      }
    }
    return headers;
  } catch {
    return {};
  }
}

/**
 * Build default headers for API requests
 */
export function buildDefaultHeaders(): Record<string, string> {
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
 */
class NativeAnthropicClient implements AnthropicClientInterface {
  private apiKey: string;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private maxRetries: number;
  private fetchFn: typeof fetch;

  constructor(options: ClientOptions & { defaultHeaders?: Record<string, string> }) {
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.baseURL = options.baseURL || process.env.ANTHROPIC_BASE_URL || DEFAULT_BASE_URL;
    this.defaultHeaders = options.defaultHeaders || {};
    this.timeout = options.timeout || DEFAULT_API_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.fetchFn = options.fetchOverride || globalThis.fetch;
  }

  private async makeRequest(
    endpoint: string,
    body: unknown,
    options?: { signal?: AbortSignal; stream?: boolean }
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': API_VERSION,
      ...this.defaultHeaders,
    };

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
    create: async (request: MessagesRequest) => {
      const body = {
        model: request.model,
        max_tokens: request.max_tokens,
        messages: request.messages,
        system: request.system,
        tools: request.tools,
        tool_choice: request.tool_choice,
        metadata: request.metadata,
        stop_sequences: request.stop_sequences,
        temperature: request.temperature,
        top_p: request.top_p,
        top_k: request.top_k,
        stream: false,
      };

      const response = await this.makeRequest('/v1/messages', body);
      return response.json();
    },

    /**
     * Create a streaming message
     */
    stream: async function* (
      this: NativeAnthropicClient,
      request: MessagesRequest,
      options?: { signal?: AbortSignal }
    ): AsyncGenerator<StreamEvent> {
      const body = {
        model: request.model,
        max_tokens: request.max_tokens,
        messages: request.messages,
        system: request.system,
        tools: request.tools,
        tool_choice: request.tool_choice,
        metadata: request.metadata,
        stop_sequences: request.stop_sequences,
        temperature: request.temperature,
        top_p: request.top_p,
        top_k: request.top_k,
        stream: true,
      };

      const response = await this.makeRequest('/v1/messages', body, {
        signal: options?.signal,
        stream: true,
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

        // Process any remaining data
        if (buffer.trim()) {
          const lines = buffer.split('\n');
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
 *
 * Provider selection based on environment variables:
 * - CLAUDE_CODE_USE_BEDROCK -> AWS Bedrock
 * - CLAUDE_CODE_USE_FOUNDRY -> Azure Foundry
 * - CLAUDE_CODE_USE_VERTEX -> Google Vertex AI
 * - Default -> First-party Anthropic API
 */
export async function createAnthropicClient(
  options: ClientOptions = {}
): Promise<AnthropicClientInterface> {
  const defaultHeaders = buildDefaultHeaders();
  const timeout = parseInt(process.env.API_TIMEOUT_MS || String(DEFAULT_API_TIMEOUT), 10);
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;

  const baseOptions = {
    defaultHeaders,
    maxRetries,
    timeout,
    dangerouslyAllowBrowser: true,
    ...(options.fetchOverride && { fetchOverride: options.fetchOverride }),
  };

  const provider = detectProvider();

  switch (provider) {
    case 'bedrock':
      return createBedrockClient({
        ...options,
        ...baseOptions,
      } as BedrockOptions);

    case 'foundry':
      return createFoundryClient({
        ...options,
        ...baseOptions,
      } as FoundryOptions);

    case 'vertex':
      return createVertexClient({
        ...options,
        ...baseOptions,
      } as VertexOptions);

    default:
      return createFirstPartyClient({
        ...options,
        ...baseOptions,
      });
  }
}

/**
 * Create AWS Bedrock client
 * Original: b41 (BedrockClient) in chunks.82.mjs
 */
async function createBedrockClient(options: BedrockOptions): Promise<AnthropicClientInterface> {
  // Determine AWS region
  const awsRegion =
    process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    'us-east-1';

  // For Bedrock, we need to use AWS SDK credentials
  // The base URL would be the Bedrock endpoint
  const bedrockEndpoint = `https://bedrock-runtime.${awsRegion}.amazonaws.com`;

  return new NativeAnthropicClient({
    ...options,
    baseURL: bedrockEndpoint,
    defaultHeaders: {
      ...options.defaultHeaders,
      // AWS credentials would be handled by AWS SDK signature
    },
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
  // Determine project ID
  const projectId =
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.ANTHROPIC_VERTEX_PROJECT_ID;

  const region = process.env.ANTHROPIC_VERTEX_REGION || 'us-central1';

  // Vertex AI uses a different endpoint format
  const vertexEndpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/anthropic/models`;

  return new NativeAnthropicClient({
    ...options,
    baseURL: vertexEndpoint,
    // Vertex uses Google Cloud authentication
  });
}

/**
 * Create first-party Anthropic client
 * Original: hP (AnthropicClient) in chunks.82.mjs
 */
async function createFirstPartyClient(options: ClientOptions & { defaultHeaders?: Record<string, string> }): Promise<AnthropicClientInterface> {
  // Get API key
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('No API key found. Set ANTHROPIC_API_KEY environment variable.');
  }

  return new NativeAnthropicClient({
    ...options,
    apiKey,
  });
}

// ============================================
// Export
// ============================================

export {
  createAnthropicClient,
  detectProvider,
  buildDefaultHeaders,
  getUserAgent,
  parseCustomHeaders,
  DEFAULT_API_TIMEOUT,
  DEFAULT_MAX_RETRIES,
  NativeAnthropicClient,
};
