/**
 * @claudecode/shared - Token Usage Utilities
 *
 * Utilities for merging and aggregating token usage statistics, including prompt caching.
 * Reconstructed from analysis of chunks.147.mjs.
 */

import { type TokenUsage } from '../types/index.js';
import { type PricingModel } from '../constants/index.js';

/**
 * Original: Lw3 (calculateCost) in chunks.46.mjs:1909-1910
 */
export function calculateCost(pricing: PricingModel, usage: TokenUsage): number {
  return (
    (usage.input_tokens / 1_000_000) * pricing.inputTokens +
    (usage.output_tokens / 1_000_000) * pricing.outputTokens +
    ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheReadTokens +
    ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheWriteTokens +
    (usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests +
    (usage.server_tool_use?.web_fetch_requests ?? 0) * pricing.webSearchRequests // Assuming same price for now or needs update
  );
}

/**
 * Original: dhA (mergeUsage) in chunks.147.mjs:447-462
 * 
 * Merges two usage objects, preferring non-zero values from the second object.
 */
export function mergeUsage(prev: TokenUsage, next: TokenUsage): TokenUsage {
  return {
    input_tokens: next.input_tokens !== null && next.input_tokens > 0 ? next.input_tokens : prev.input_tokens,
    cache_creation_input_tokens: (next.cache_creation_input_tokens !== null && (next.cache_creation_input_tokens ?? 0) > 0) 
      ? next.cache_creation_input_tokens 
      : prev.cache_creation_input_tokens,
    cache_read_input_tokens: (next.cache_read_input_tokens !== null && (next.cache_read_input_tokens ?? 0) > 0) 
      ? next.cache_read_input_tokens 
      : prev.cache_read_input_tokens,
    output_tokens: next.output_tokens ?? prev.output_tokens,
    server_tool_use: {
      web_search_requests: next.server_tool_use?.web_search_requests ?? prev.server_tool_use?.web_search_requests,
      web_fetch_requests: next.server_tool_use?.web_fetch_requests ?? prev.server_tool_use?.web_fetch_requests
    },
    cache_creation: {
      ephemeral_1h_input_tokens: next.cache_creation?.ephemeral_1h_input_tokens ?? prev.cache_creation?.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: next.cache_creation?.ephemeral_5m_input_tokens ?? prev.cache_creation?.ephemeral_5m_input_tokens
    }
  };
}

/**
 * Original: SH1 (aggregateUsage) in chunks.147.mjs:465-480
 * 
 * Sums up all token fields from two usage objects.
 */
export function aggregateUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
  return {
    input_tokens: a.input_tokens + b.input_tokens,
    cache_creation_input_tokens: (a.cache_creation_input_tokens ?? 0) + (b.cache_creation_input_tokens ?? 0),
    cache_read_input_tokens: (a.cache_read_input_tokens ?? 0) + (b.cache_read_input_tokens ?? 0),
    output_tokens: a.output_tokens + b.output_tokens,
    server_tool_use: {
      web_search_requests: (a.server_tool_use?.web_search_requests ?? 0) + (b.server_tool_use?.web_search_requests ?? 0),
      web_fetch_requests: (a.server_tool_use?.web_fetch_requests ?? 0) + (b.server_tool_use?.web_fetch_requests ?? 0)
    },
    cache_creation: {
      ephemeral_1h_input_tokens: (a.cache_creation?.ephemeral_1h_input_tokens ?? 0) + (b.cache_creation?.ephemeral_1h_input_tokens ?? 0),
      ephemeral_5m_input_tokens: (a.cache_creation?.ephemeral_5m_input_tokens ?? 0) + (b.cache_creation?.ephemeral_5m_input_tokens ?? 0)
    }
  };
}
