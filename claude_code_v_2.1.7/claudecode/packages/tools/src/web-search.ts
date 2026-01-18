/**
 * @claudecode/tools - WebSearch Tool
 *
 * Allows Claude to search the web and use the results to inform responses.
 * Provides up-to-date information for current events and recent data.
 *
 * Reconstructed from chunks.119.mjs:2110+
 *
 * Key symbols:
 * - aR → WEB_SEARCH (tool name constant)
 * - vD → WebSearchTool (tool object)
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MIN_QUERY_LENGTH = 2;

// ============================================
// Input Types
// ============================================

/**
 * WebSearch input.
 */
export interface WebSearchInput {
  /** The search query (required, min 2 chars) */
  query: string;
  /** Only include results from these domains */
  allowed_domains?: string[];
  /** Never include results from these domains */
  blocked_domains?: string[];
}

/**
 * Search result item.
 */
export interface SearchResultItem {
  /** Result title */
  title: string;
  /** Result URL */
  url: string;
  /** Result snippet/description */
  snippet?: string;
  /** Source domain */
  domain?: string;
}

/**
 * WebSearch output.
 */
export interface WebSearchOutput {
  /** Whether the search succeeded */
  success: boolean;
  /** The search query that was executed */
  query: string;
  /** Search results */
  results: SearchResultItem[];
  /** Number of results */
  resultCount: number;
  /** Error message if failed */
  error?: string;
}

// ============================================
// Input Schema
// ============================================

/**
 * WebSearch input schema.
 * Original: chunks.119.mjs:2110+
 */
const webSearchInputSchema = z.object({
  query: z
    .string()
    .min(MIN_QUERY_LENGTH)
    .describe('The search query to use'),
  allowed_domains: z
    .array(z.string())
    .optional()
    .describe('Only include search results from these domains'),
  blocked_domains: z
    .array(z.string())
    .optional()
    .describe('Never include search results from these domains'),
});

// ============================================
// Output Schema
// ============================================

const webSearchOutputSchema = z.object({
  success: z.boolean(),
  query: z.string(),
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string().optional(),
      domain: z.string().optional(),
    })
  ),
  resultCount: z.number(),
  error: z.string().optional(),
});

// ============================================
// WebSearch Tool
// ============================================

/**
 * WebSearch tool implementation.
 * Original: vD in chunks.119.mjs:2110+
 *
 * This tool allows Claude to search the web for current information.
 * Results are returned as search result blocks including links as markdown.
 *
 * Note: The actual search implementation depends on the configured search provider.
 * This implementation provides the interface and expects the search to be
 * performed by the runtime environment.
 */
export const WebSearchTool = createTool<WebSearchInput, WebSearchOutput>({
  name: TOOL_NAMES.WEB_SEARCH,
  strict: false,

  async description() {
    return `- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response`;
  },

  async prompt() {
    return `Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - Check the current date and use the current year when searching for recent information`;
  },

  inputSchema: webSearchInputSchema,
  outputSchema: webSearchOutputSchema,

  isEnabled() {
    // Web search may be conditionally enabled based on environment
    return true;
  },

  isConcurrencySafe() {
    // Safe for concurrent execution - read-only operation
    return true;
  },

  isReadOnly() {
    return true;
  },

  async checkPermissions(input) {
    // Web search is generally allowed
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const { query, allowed_domains, blocked_domains } = input;

    // Check query length
    if (!query || query.trim().length < MIN_QUERY_LENGTH) {
      return validationError(
        `Query must be at least ${MIN_QUERY_LENGTH} characters`,
        1
      );
    }

    // Validate domain filters don't conflict
    if (allowed_domains && blocked_domains) {
      const conflict = allowed_domains.some((d) => blocked_domains.includes(d));
      if (conflict) {
        return validationError(
          'Domain cannot be in both allowed_domains and blocked_domains',
          2
        );
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    const { query, allowed_domains, blocked_domains } = input;

    try {
      // The actual search implementation would be provided by the runtime
      // This tool interface expects the search to be performed externally
      // and results injected via context or environment

      // Check if there's a search provider in the context
      const searchProvider = (context as any).searchProvider;

      if (searchProvider && typeof searchProvider.search === 'function') {
        const results = await searchProvider.search({
          query,
          allowedDomains: allowed_domains,
          blockedDomains: blocked_domains,
        });

        return toolSuccess({
          success: true,
          query,
          results: results.items || [],
          resultCount: results.items?.length || 0,
        });
      }

      // If no search provider, return indication that search is not configured
      // The runtime environment is responsible for providing search capability
      return toolSuccess({
        success: false,
        query,
        results: [],
        resultCount: 0,
        error: 'Web search is not configured in this environment',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolError(`Search failed: ${message}`);
    }
  },

  /**
   * Map tool result to API format.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.success && result.results.length > 0) {
      // Format results as markdown with links
      const formattedResults = result.results
        .map((r, i) => {
          const domain = r.domain ? ` (${r.domain})` : '';
          return `${i + 1}. [${r.title}](${r.url})${domain}\n   ${r.snippet || ''}`;
        })
        .join('\n\n');

      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `Search results for "${result.query}":\n\n${formattedResults}\n\nRemember to include a "Sources:" section with relevant URLs in your response.`,
      };
    }

    if (result.error) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: result.error,
        is_error: true,
      };
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: `No results found for "${result.query}"`,
    };
  },
});

// ============================================
// Export
// ============================================

export { WebSearchTool };
