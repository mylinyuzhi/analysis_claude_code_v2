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
// Mock Client Implementation
// ============================================

/**
 * Mock Anthropic client for development/testing
 * In production, this would be the actual @anthropic-ai/sdk client
 */
class MockAnthropicClient implements AnthropicClientInterface {
  private options: ClientOptions;

  constructor(options: ClientOptions) {
    this.options = options;
  }

  messages = {
    create: async (request: Parameters<AnthropicClientInterface['messages']['create']>[0]) => {
      // This is a placeholder - in production, use the actual Anthropic SDK
      throw new Error('Anthropic client not implemented. Please install @anthropic-ai/sdk');
    },

    stream: async function* (request: Parameters<AnthropicClientInterface['messages']['create']>[0]) {
      // This is a placeholder - in production, use the actual Anthropic SDK
      throw new Error('Anthropic client not implemented. Please install @anthropic-ai/sdk');
      yield undefined as never; // Make TypeScript happy
    },
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
    ...(options.fetchOverride && { fetch: options.fetchOverride }),
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

  // In production, would use @anthropic-ai/bedrock-sdk
  // For now, return mock client
  console.warn('Bedrock client not implemented. Using mock client.');
  return new MockAnthropicClient(options);
}

/**
 * Create Azure Foundry client
 * Original: u41 (FoundryClient) in chunks.82.mjs
 */
async function createFoundryClient(options: FoundryOptions): Promise<AnthropicClientInterface> {
  // In production, would use appropriate Azure SDK
  console.warn('Foundry client not implemented. Using mock client.');
  return new MockAnthropicClient(options);
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

  // In production, would use @anthropic-ai/vertex-sdk
  console.warn('Vertex client not implemented. Using mock client.');
  return new MockAnthropicClient(options);
}

/**
 * Create first-party Anthropic client
 * Original: hP (AnthropicClient) in chunks.82.mjs
 */
async function createFirstPartyClient(options: ClientOptions): Promise<AnthropicClientInterface> {
  // Get API key
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('No API key found. Set ANTHROPIC_API_KEY environment variable.');
  }

  // In production, would use @anthropic-ai/sdk
  // For now, return mock client
  return new MockAnthropicClient({
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
};
