/**
 * @claudecode/core - Prompt Caching Logic
 *
 * Implements Anthropic's prompt caching strategy for Claude Code.
 * Reconstructed from analysis of chunks.133.mjs, chunks.146.mjs, chunks.147.mjs.
 */

import { parseBoolean, IDENTITY_HEADERS, type Message, type ContentBlock } from '@claudecode/shared';
import { trackEvent, checkFeatureGate } from '@claudecode/platform';
import { 
  type SystemContent, 
  type CacheControl
} from './types.js';

/**
 * Original: SD (getHaikuModel) in chunks.46.mjs:2193
 */
export function getHaikuModel(): string {
  // process.env.ANTHROPIC_SMALL_FAST_MODEL || fp1()
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || "claude-3-5-haiku-20241022";
}

/**
 * Original: OR (getSonnetModel) in chunks.46.mjs:2231
 */
export function getSonnetModel(): string {
  return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || "claude-3-5-sonnet-20241022";
}

/**
 * Original: sJA (getOpusModel) in chunks.46.mjs:2248
 */
export function getOpusModel(): string {
  return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL || "claude-3-opus-20240229";
}

/**
 * Original: AJ9 (isPromptCachingSupported) in chunks.146.mjs:2872-2886
 */
export function isPromptCachingSupported(model: string): boolean {
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING)) return false;
  
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    if (model === getHaikuModel()) return false;
  }
  
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    if (model === getSonnetModel()) return false;
  }
  
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    if (model === getOpusModel()) return false;
  }
  
  return true;
}

/**
 * Original: wuA (getCacheControl) in chunks.146.mjs:2889-2895
 */
export function getCacheControl(): CacheControl {
  // Check experiment flag 'prompt_cache_1h_experiment'
  const gateValue = checkFeatureGate('prompt_cache_1h_experiment', { use_1h_cache: false });
  if (gateValue && gateValue.use_1h_cache) {
    return { type: 'ephemeral', ttl: '1h' };
  }
  return { type: 'ephemeral' };
}

/**
 * Original: rO0 (formatSystemPrompt) in chunks.133.mjs:2563-2577
 * 
 * Separates billing headers and identity headers from the main content.
 * Ensures specific ordering: Billing Header -> Identity Header -> Content.
 */
export function formatSystemPrompt(parts: string[]): string[] {
  let billingHeader: string | undefined;
  let identityHeader: string | undefined;
  const contentParts: string[] = [];
  
  for (const part of parts) {
    if (!part) continue;
    
    if (part.startsWith('x-anthropic-billing-header')) {
      billingHeader = part;
    } else if (IDENTITY_HEADERS.has(part)) {
      identityHeader = part;
    } else {
      contentParts.push(part);
    }
  }
  
  const result: string[] = [];
  if (billingHeader) result.push(billingHeader);
  if (identityHeader) result.push(identityHeader);
  
  const combinedContent = contentParts.join('\n');
  if (combinedContent) result.push(combinedContent);
  
  return result;
}

/**
 * Original: Nz7 (formatSystemPromptWithCache) in chunks.147.mjs:492-502
 * 
 * New in v2.1.x: Explicitly excludes billing headers from cache_control.
 */
export function formatSystemPromptWithCache(parts: string[], cachingEnabled: boolean): SystemContent[] {
  return formatSystemPrompt(parts).map((text) => {
    const isBillingHeader = text.startsWith('x-anthropic-billing-header');
    const shouldCache = cachingEnabled && !isBillingHeader;
    
    return {
      type: 'text',
      text,
      ...(shouldCache ? { cache_control: getCacheControl() } : {})
    };
  });
}

/**
 * Original: $z7 (applyUserMessageCacheBreakpoint) in chunks.146.mjs:2948-2972
 */
function applyUserMessageCacheBreakpoint(message: Message, applyCache: boolean, eligible: boolean): Message {
  if (applyCache) {
    const content = message.content;
    if (typeof content === 'string') {
      return {
        role: 'user',
        content: [{
          type: 'text',
          text: content,
          ...(eligible ? { cache_control: getCacheControl() } : {})
        }]
      };
    } else {
      return {
        role: 'user',
        content: content.map((block: ContentBlock, idx: number) => ({
          ...block,
          ...(idx === content.length - 1 && eligible ? { cache_control: getCacheControl() } : {})
        }))
      };
    }
  }
  return message;
}

/**
 * Original: Cz7 (applyAssistantMessageCacheBreakpoint) in chunks.146.mjs:2975-3000
 * 
 * Excludes 'thinking' and 'redacted_thinking' blocks from caching.
 */
function applyAssistantMessageCacheBreakpoint(message: Message, applyCache: boolean, eligible: boolean): Message {
  if (applyCache) {
    const content = message.content;
    if (typeof content === 'string') {
      return {
        role: 'assistant',
        content: [{
          type: 'text',
          text: content,
          ...(eligible ? { cache_control: getCacheControl() } : {})
        }]
      };
    } else {
      return {
        role: 'assistant',
        content: content.map((block: ContentBlock, idx: number) => {
          const isLastBlock = idx === content.length - 1;
          // Thinking blocks are excluded from prompt caching as they vary too much
          const isCacheableType = block.type !== 'thinking' && block.type !== 'redacted_thinking';
          const shouldAddCache = isLastBlock && isCacheableType && eligible;
          
          return {
            ...block,
            ...(shouldAddCache ? { cache_control: getCacheControl() } : {})
          };
        })
      };
    }
  }
  return message;
}

/**
 * Original: qz7 (applyMessageCacheBreakpoints) in chunks.147.mjs:483-490
 * 
 * Applies prompt caching breakpoints to the last 2 messages in the conversation history.
 */
export function applyMessageCacheBreakpoints(messages: Message[], cachingEnabled: boolean): Message[] {
  trackEvent('tengu_api_cache_breakpoints', {
    totalMessageCount: messages.length,
    cachingEnabled
  });
  
  return messages.map((msg, idx) => {
    // Apply cache to the last 2 messages (index > length - 3)
    const isWithinCacheWindow = idx > messages.length - 3;
    
    if (msg.role === 'user') {
      return applyUserMessageCacheBreakpoint(msg, isWithinCacheWindow, cachingEnabled);
    } else {
      return applyAssistantMessageCacheBreakpoint(msg, isWithinCacheWindow, cachingEnabled);
    }
  });
}
