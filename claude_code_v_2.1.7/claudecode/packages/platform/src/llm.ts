/**
 * @claudecode/platform - LLM & API Utilities
 *
 * Provides functions for interacting with Anthropic API and counting tokens.
 * Reconstructed from chunks.82.mjs, chunks.85.mjs.
 */

import { 
  getJwtToken, 
  isClaudeAiOAuth,
  getClaudeAiOAuth,
  refreshOAuthTokenIfNeeded,
  injectAuthHeader,
} from './auth/oauth.js';
import { getApiKey } from './auth/api-key.js';
import { 
  OAUTH_BETA_HEADER, 
  BETA_HEADERS 
} from './auth/constants.js';
import { parseBoolean } from '@claudecode/shared';
import * as AnthropicSdk from '@anthropic-ai/sdk';
import * as GoogleAuthLib from 'google-auth-library';
import * as AzureIdentity from '@azure/identity';
import * as AwsCredentialProviders from '@aws-sdk/credential-providers';

/**
 * Count tokens for a set of messages and tools.
 * Original: gSA in chunks.85.mjs:695-735
 */
export async function countTokens(
  messages: any[],
  tools: any[] = []
): Promise<number | null> {
  try {
    const model = getDefaultModel();
    const betas = getModelBetas(model);
    const containsThinking = messageArrayContainsThinking(messages);

    const provider = detectProvider();
    const filteredBetas = provider === 'vertex' ? betas.filter((b) => VERTEX_ALLOWED_BETAS.has(b)) : betas;

    const client = await createAnthropicClientForTokenCounting({
      provider,
      model,
      maxRetries: 1,
    });

    const input = {
      model,
      messages: messages.length > 0 ? messages : [{ role: 'user', content: 'foo' }],
      tools,
      ...(filteredBetas.length > 0 ? { betas: filteredBetas } : {}),
      ...(containsThinking
        ? {
            thinking: {
              type: 'enabled',
              budget_tokens: 1024, // Original: jZ0 in chunks.85.mjs:856
            },
          }
        : {}),
    } as any;

    const res = await client.beta.messages.countTokens(input);
    return typeof res?.input_tokens === 'number' ? res.input_tokens : null;
  } catch (err) {
    // Match source behavior: swallow and return null.
    if (process.env.DEBUG_ERRORS) {
      console.error('[countTokens] failed:', err);
    }
    return null;
  }
}

// ============================================
// Helpers (source parity)
// ============================================

type ApiProvider = 'anthropic' | 'bedrock' | 'vertex' | 'foundry';

// Original: iU1 in chunks.1.mjs:2228
const VERTEX_ALLOWED_BETAS = new Set<string>([
  'claude-code-20250219',
  'interleaved-thinking-2025-05-14',
  'fine-grained-tool-streaming-2025-05-14',
  'context-management-2025-06-27',
]);

function detectProvider(): ApiProvider {
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) return 'bedrock';
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) return 'foundry';
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) return 'vertex';
  return 'anthropic';
}

// Original: leB in chunks.85.mjs:640-646
function messageArrayContainsThinking(msgs: any[]): boolean {
  for (const m of msgs) {
    if (m?.role === 'assistant' && Array.isArray(m.content)) {
      for (const b of m.content) {
        if (b && typeof b === 'object' && 'type' in b) {
          const t = (b as any).type;
          if (t === 'thinking' || t === 'redacted_thinking') return true;
        }
      }
    }
  }
  return false;
}

function parseCustomHeaders(): Record<string, string> {
  const raw = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const line of raw.split(/\n|\r\n/)) {
    if (!line.trim()) continue;
    const m = line.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (m) {
      const [, k, v] = m;
      if (k && v !== undefined) out[k] = v;
    }
  }
  return out;
}

async function buildDefaultHeaders(): Promise<Record<string, string>> {
  const containerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  const remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  const headers: Record<string, string> = {
    'x-app': 'cli',
    'User-Agent': 'claude-code/2.1.7',
    ...parseCustomHeaders(),
  };
  if (containerId) headers['x-claude-remote-container-id'] = containerId;
  if (remoteSessionId) headers['x-claude-remote-session-id'] = remoteSessionId;
  if (parseBoolean(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) {
    headers['x-anthropic-additional-protection'] = 'true';
  }

  // OAuth token check starting/complete in source (chunks.82.mjs:2655)
  await refreshOAuthTokenIfNeeded();

  // Inject Authorization bearer token only when NOT using Claude.ai OAuth.
  if (!isClaudeAiOAuth()) {
    injectAuthHeader(headers, true);
  }

  return headers;
}

function getSdkCtor(name: string): any {
  const mod: any = AnthropicSdk as any;
  return mod[name] ?? mod.default?.[name] ?? (name === 'default' ? mod.default : undefined);
}

async function createAnthropicClientForTokenCounting(options: {
  provider: ApiProvider;
  model: string;
  maxRetries: number;
}): Promise<any> {
  const defaultHeaders = await buildDefaultHeaders();
  const timeout = parseInt(process.env.API_TIMEOUT_MS || String(600000), 10);
  const fetchOverride = globalThis.fetch;

  const sdkLogger = parseBoolean(process.env.DEBUG_ANTHROPIC_SDK)
    ? {
        error: (...args: any[]) => console.error('[Anthropic SDK ERROR]', ...args),
        warn: (...args: any[]) => console.error('[Anthropic SDK WARN]', ...args),
        info: (...args: any[]) => console.error('[Anthropic SDK INFO]', ...args),
        debug: (...args: any[]) => console.error('[Anthropic SDK DEBUG]', ...args),
      }
    : undefined;

  const common: any = {
    defaultHeaders,
    maxRetries: options.maxRetries,
    timeout,
    dangerouslyAllowBrowser: true,
    fetch: fetchOverride as any,
    ...(sdkLogger ? { logger: sdkLogger } : {}),
  };

  if (options.provider === 'bedrock') {
    const AnthropicBedrock = getSdkCtor('AnthropicBedrock');
    if (!AnthropicBedrock) throw new Error('Missing AnthropicBedrock SDK export');

    const awsRegion =
      process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ||
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      'us-east-1';
    const skipAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH);

    const bedrockOpts: any = {
      ...common,
      awsRegion,
      ...(skipAuth ? { skipAuth: true } : {}),
    };

    if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
      bedrockOpts.skipAuth = true;
      bedrockOpts.defaultHeaders = {
        ...(bedrockOpts.defaultHeaders ?? {}),
        Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`,
      };
    } else if (!bedrockOpts.skipAuth) {
      const fromNodeProviderChain: any = (AwsCredentialProviders as any).fromNodeProviderChain;
      if (!fromNodeProviderChain) throw new Error('Missing fromNodeProviderChain');
      const provider = fromNodeProviderChain();
      const creds = await provider();
      if (!creds?.accessKeyId || !creds?.secretAccessKey) {
        const e: any = new Error('Failed to resolve AWS credentials for Bedrock');
        e.name = 'CredentialsProviderError';
        throw e;
      }
      bedrockOpts.awsAccessKey = creds.accessKeyId;
      bedrockOpts.awsSecretKey = creds.secretAccessKey;
      if (creds.sessionToken) bedrockOpts.awsSessionToken = creds.sessionToken;
    }

    return new AnthropicBedrock(bedrockOpts);
  }

  if (options.provider === 'foundry') {
    const AnthropicAzure = getSdkCtor('AnthropicAzure');
    if (!AnthropicAzure) throw new Error('Missing AnthropicAzure SDK export');

    const baseURL = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
    const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY;
    const skipAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH);

    let azureADTokenProvider: (() => Promise<string>) | undefined;
    if (!apiKey) {
      if (skipAuth) {
        azureADTokenProvider = () => Promise.resolve('');
      } else {
        const DefaultAzureCredential: any = (AzureIdentity as any).DefaultAzureCredential;
        const getBearerTokenProvider: any = (AzureIdentity as any).getBearerTokenProvider;
        if (!DefaultAzureCredential || !getBearerTokenProvider) {
          throw new Error('Missing @azure/identity exports');
        }
        azureADTokenProvider = getBearerTokenProvider(
          new DefaultAzureCredential(),
          'https://cognitiveservices.azure.com/.default'
        );
      }
    }

    return new AnthropicAzure({
      ...common,
      ...(baseURL ? { baseURL } : {}),
      ...(apiKey ? { apiKey } : {}),
      ...(azureADTokenProvider ? { azureADTokenProvider } : {}),
    });
  }

  if (options.provider === 'vertex') {
    const AnthropicVertex = getSdkCtor('AnthropicVertex');
    if (!AnthropicVertex) throw new Error('Missing AnthropicVertex SDK export');

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
    if (!GoogleAuth) throw new Error('Missing google-auth-library GoogleAuth export');

    const googleAuth = skipAuth
      ? {
          getClient: () => ({
            getRequestHeaders: () => ({}),
          }),
        }
      : new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
          ...(!hasProjectEnv && !hasCredsEnv ? { projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID } : {}),
        });

    const region = process.env.ANTHROPIC_VERTEX_REGION || 'us-central1';
    return new AnthropicVertex({
      ...common,
      region,
      googleAuth,
    });
  }

  // first-party
  const Anthropic = getSdkCtor('default') ?? getSdkCtor('Anthropic') ?? (AnthropicSdk as any);
  if (!Anthropic) throw new Error('Missing Anthropic SDK export');

  const oauthTokens = getClaudeAiOAuth();
  const apiKey = isClaudeAiOAuth() ? null : getApiKey();
  const authToken = isClaudeAiOAuth() ? oauthTokens?.accessToken || undefined : undefined;

  return new (Anthropic as any)({
    ...common,
    apiKey,
    authToken,
  });
}

/**
 * Get default model name.
 * Original: B5 in chunks.46.mjs:2225
 */
export function getDefaultModel(): string {
  if (process.env.CLAUDE_MODEL) return process.env.CLAUDE_MODEL;
  
  // Default models from AI() in chunks.46.mjs:1575
  const models = {
    sonnet: "claude-3-5-sonnet-20241022",
    sonnet45: "claude-3-7-sonnet-20250219",
    haiku: "claude-3-5-haiku-20241022"
  };

  // Logic from OOA() and wu() in chunks.46.mjs
  // Check for max subscription (N6() === 'max')
  // For now, default to sonnet
  return models.sonnet;
}

/**
 * Get context window size for a model.
 * Original: Jq in chunks.1.mjs:2235
 */
export function getContextWindowSize(modelId: string, betas?: string[]): number {
  if (
    modelId.includes("[1m]") || 
    (betas?.includes(BETA_HEADERS.CONTEXT_1M) && modelId.toLowerCase().includes("claude-sonnet-4"))
  ) {
    return 1000000;
  }
  return 200000;
}

/**
 * Get active betas for a model.
 * Original: pp1 in chunks.46.mjs:3177
 */
export function getModelBetas(modelId: string): string[] {
  const betas: string[] = [];
  const isHaiku = modelId.includes("haiku");
  
  // zb0: claude-code-20250219
  if (!isHaiku) {
    betas.push(BETA_HEADERS.CLAUDE_CODE);
  }
  
  // zi: oauth-2025-04-20
  if (isClaudeAiOAuth()) {
    betas.push(OAUTH_BETA_HEADER);
  }
  
  // n5A: context-1m-2025-08-07
  if (modelId.includes("[1m]")) {
    betas.push(BETA_HEADERS.CONTEXT_1M);
  }
  
  // $b0: interleaved-thinking-2025-05-14
  if (!parseBoolean(process.env.DISABLE_INTERLEAVED_THINKING)) {
    betas.push(BETA_HEADERS.INTERLEAVED_THINKING);
  }
  
  // CdA: context-management-2025-06-27
  if (parseBoolean(process.env.USE_API_CONTEXT_MANAGEMENT)) {
    betas.push(BETA_HEADERS.CONTEXT_MANAGEMENT);
  }
  
  // Add betas from env
  if (process.env.ANTHROPIC_BETAS && !isHaiku) {
    betas.push(...process.env.ANTHROPIC_BETAS.split(",").map(b => b.trim()).filter(Boolean));
  }
  
  return betas;
}
