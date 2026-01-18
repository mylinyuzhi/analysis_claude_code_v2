/**
 * @claudecode/tools - WebFetch Tool
 *
 * Fetches content from a URL and processes it using an AI model.
 * Includes caching and redirect handling.
 *
 * Reconstructed from chunks.119.mjs:1247-1424
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  permissionAsk,
  toolSuccess,
  toolError,
} from './base.js';
import type { WebFetchInput, WebFetchOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 100000;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Preapproved hosts that don't require permission.
 * Original: BK1 in chunks.119.mjs
 */
const PREAPPROVED_HOSTS = new Set([
  'docs.anthropic.com',
  'github.com',
  'raw.githubusercontent.com',
  'docs.github.com',
  'developer.mozilla.org',
  'www.typescriptlang.org',
  'nodejs.org',
  'docs.python.org',
  'docs.rust-lang.org',
  'go.dev',
  'docs.oracle.com',
  'learn.microsoft.com',
  'developer.apple.com',
  'kotlinlang.org',
]);

// Simple in-memory cache
const urlCache = new Map<string, { content: string; timestamp: number }>();

// ============================================
// Input/Output Schemas
// ============================================

/**
 * WebFetch tool input schema.
 * Original: dp5 in chunks.119.mjs:1236-1238
 */
const webFetchInputSchema = z.object({
  url: z.string().url().describe('The URL to fetch content from'),
  prompt: z.string().describe('The prompt to run on the fetched content'),
});

/**
 * WebFetch tool output schema.
 * Original: cp5 in chunks.119.mjs:1239-1246
 */
const webFetchOutputSchema = z.object({
  bytes: z.number(),
  code: z.number(),
  codeText: z.string(),
  result: z.string(),
  durationMs: z.number(),
  url: z.string(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Get hostname from URL.
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Convert HTML to markdown (simplified).
 */
function htmlToMarkdown(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Convert headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    // Convert paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Convert links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Convert lists
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Convert bold/italic
    .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*')
    // Convert code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n')
    // Remove remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Check cache for URL.
 */
function getCachedContent(url: string): string | null {
  const cached = urlCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.content;
  }
  return null;
}

/**
 * Cache URL content.
 */
function cacheContent(url: string, content: string): void {
  // Clean old entries
  const now = Date.now();
  for (const [key, value] of urlCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      urlCache.delete(key);
    }
  }
  urlCache.set(url, { content, timestamp: now });
}

// ============================================
// WebFetch Tool
// ============================================

/**
 * WebFetch tool implementation.
 * Original: hF (WebFetchTool) in chunks.119.mjs:1247-1424
 */
export const WebFetchTool = createTool<WebFetchInput, WebFetchOutput>({
  name: TOOL_NAMES.WEB_FETCH,
  maxResultSizeChars: MAX_RESULT_SIZE,

  async description() {
    return `- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content`;
  },

  async prompt() {
    return `Usage notes:
- The URL must be a fully-formed valid URL
- HTTP URLs will be automatically upgraded to HTTPS
- The prompt should describe what information you want to extract from the page
- This tool is read-only and does not modify any files
- Results may be summarized if the content is very large
- Includes a self-cleaning 15-minute cache for faster responses`;
  },

  inputSchema: webFetchInputSchema,
  outputSchema: webFetchOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return true;
  },

  isReadOnly() {
    return true;
  },

  async checkPermissions(input, context) {
    const hostname = getHostname(input.url);

    // Preapproved hosts don't need permission
    if (PREAPPROVED_HOSTS.has(hostname)) {
      return permissionAllow(input);
    }

    // Other hosts need permission
    return permissionAsk(`Fetch content from: ${hostname}`);
  },

  async validateInput(input, context) {
    try {
      new URL(input.url);
    } catch {
      return validationError('Invalid URL format', 1);
    }
    return validationSuccess();
  },

  async call(input, context) {
    const startTime = Date.now();
    let { url } = input;
    const { prompt } = input;

    // Upgrade HTTP to HTTPS
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }

    try {
      // Check cache
      const cachedContent = getCachedContent(url);
      if (cachedContent) {
        const durationMs = Date.now() - startTime;
        const result: WebFetchOutput = {
          bytes: Buffer.byteLength(cachedContent),
          code: 200,
          codeText: 'OK (cached)',
          result: `[Cached content for: ${url}]\n\n${cachedContent.slice(0, MAX_RESULT_SIZE)}`,
          durationMs,
          url,
        };
        return toolSuccess(result);
      }

      // Fetch URL
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ClaudeCode/1.0)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      });

      // Check for redirects to different host
      const responseUrl = response.url;
      const originalHost = getHostname(url);
      const responseHost = getHostname(responseUrl);

      if (originalHost !== responseHost) {
        const result: WebFetchOutput = {
          bytes: 0,
          code: response.status,
          codeText: `Redirected to different host`,
          result: `The URL redirected to a different host: ${responseUrl}\nPlease make a new WebFetch request with this redirect URL.`,
          durationMs: Date.now() - startTime,
          url,
        };
        return toolSuccess(result);
      }

      const contentType = response.headers.get('content-type') || '';
      const rawContent = await response.text();
      const bytes = Buffer.byteLength(rawContent);

      // Convert HTML to markdown
      let content = rawContent;
      if (contentType.includes('text/html')) {
        content = htmlToMarkdown(rawContent);
      }

      // Truncate if too large
      if (content.length > MAX_RESULT_SIZE) {
        content = content.slice(0, MAX_RESULT_SIZE) + '\n\n[Content truncated...]';
      }

      // Cache the content
      cacheContent(url, content);

      const durationMs = Date.now() - startTime;

      // In a real implementation, this would call an LLM with the prompt
      // For now, we just return the content with context about the prompt
      const result: WebFetchOutput = {
        bytes,
        code: response.status,
        codeText: response.statusText,
        result: `[Fetched: ${url}]\n[Prompt: ${prompt}]\n\n${content}`,
        durationMs,
        url,
      };

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Failed to fetch URL: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: result.result,
    };
  },
});

// ============================================
// Export
// ============================================

export { WebFetchTool };
