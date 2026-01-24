/**
 * @claudecode/platform - LLM & API Utilities
 *
 * Provides functions for interacting with Anthropic API and counting tokens.
 * Reconstructed from chunks.82.mjs, chunks.85.mjs.
 */

import { 
  getJwtToken, 
  isClaudeAiOAuth 
} from './auth/oauth.js';
import { 
  OAUTH_BETA_HEADER, 
  BETA_HEADERS 
} from './auth/constants.js';
import { parseBoolean } from '@claudecode/shared';

/**
 * Count tokens for a set of messages and tools.
 * Original: gSA in chunks.85.mjs:695
 * 
 * Note: This implementation is a placeholder that should be 
 * wired to the actual API client in the core package.
 */
export async function countTokens(
  messages: any[],
  tools: any[] = []
): Promise<number | null> {
  // In source, this calls createAnthropicClient({ maxRetries: 0 }) 
  // and then beta.messages.countTokens.
  // Since platform cannot depend on core, we return null or a simple estimate
  // and expect core to override this if needed.
  return null;
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
