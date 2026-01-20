/**
 * @claudecode/integrations - MCP Auto-Search Mode
 *
 * MCPSearch mode decision logic for context optimization.
 * Reconstructed from chunks.85.mjs:559-620
 */

import type {
  McpToolSearchMode,
  McpAutoSearchDecision,
  McpWrappedTool,
} from './types.js';
import { MCP_CONSTANTS } from './types.js';
import { telemetry } from '@claudecode/platform';

// ============================================
// Context Window Configuration
// ============================================

/**
 * Get context window size for model.
 * Original: KA1 (getContextWindowSize) in chunks.85.mjs
 */
function getContextWindowSize(modelId: string): number {
  // Claude models typically have 200K context
  if (modelId.includes('claude-3') || modelId.includes('claude-4')) {
    return 200000;
  }
  // Default fallback
  return 100000;
}

/**
 * Calculate token budget from context window.
 * Original: Jq (calculateTokenBudget) in chunks.85.mjs
 */
function calculateTokenBudget(modelId: string, contextWindowSize: number): number {
  // Leave some room for response and system prompt
  return Math.floor(contextWindowSize * 0.9);
}

/**
 * Calculate context threshold in characters.
 * Original: geB (calculateContextThreshold) in chunks.85.mjs:491-494
 *
 * Formula: tokenBudget * 0.1 * 2.5
 * - 10% of context window for MCP tools
 * - 2.5 chars per token average
 */
export function calculateContextThreshold(modelId: string): number {
  const contextWindowSize = getContextWindowSize(modelId);
  const tokenBudget = calculateTokenBudget(modelId, contextWindowSize);
  return Math.floor(
    tokenBudget * MCP_CONSTANTS.SEARCH_CONTEXT_RATIO * MCP_CONSTANTS.CHAR_TO_TOKEN_MULTIPLIER
  );
}

// ============================================
// Model Support
// ============================================

/**
 * Check if model supports tool_reference blocks.
 * Original: ueB (isModelSupportedForToolSearch) in chunks.85.mjs
 */
export function isModelSupportedForToolSearch(modelId: string): boolean {
  // Claude Sonnet 4+ and Opus 4+ support tool_reference blocks
  if (modelId.includes('sonnet-4') || modelId.includes('opus-4')) {
    return true;
  }
  if (modelId.includes('claude-4')) {
    return true;
  }
  // Legacy models don't support this feature
  return false;
}

/**
 * Check if MCPSearch tool is available in tool list.
 * Original: meB (isMcpSearchToolAvailable) in chunks.85.mjs
 */
export function isMcpSearchToolAvailable(tools: McpWrappedTool[]): boolean {
  return tools.some((tool) => tool.name === MCP_CONSTANTS.MCPSEARCH_TOOL_NAME);
}

// ============================================
// Description Size Calculation
// ============================================

/**
 * Calculate total MCP tool description size.
 * Original: Zt8 (calculateMcpDescriptionSize) in chunks.85.mjs
 */
export async function calculateMcpDescriptionSize(
  tools: McpWrappedTool[],
  getPermissionContext?: () => unknown,
  agents?: unknown[]
): Promise<number> {
  let totalChars = 0;

  for (const tool of tools) {
    if (!tool.isMcp) continue;

    // Get tool description
    const description = await tool.description();
    totalChars += description.length;

    // Add input schema size
    if (tool.inputJSONSchema) {
      totalChars += JSON.stringify(tool.inputJSONSchema).length;
    }

    // Add tool name
    totalChars += tool.name.length;
  }

  return totalChars;
}

// ============================================
// Mode Selection
// ============================================

/**
 * Check if user is internal (Anthropic employee).
 * Original: gW (isInternalUser) in chunks.85.mjs
 */
function isInternalUser(): boolean {
  return (
    parseBoolean(process.env.CLAUDECODE_INTERNAL_USER) ||
    parseBoolean(process.env.ANTHROPIC_INTERNAL_USER) ||
    parseBoolean(process.env.INTERNAL_USER)
  );
}

/**
 * Get feature flag value.
 * Original: ZZ (getFeatureFlag) in chunks.85.mjs
 */
function getFeatureFlag(flagName: string, defaultValue: boolean): boolean {
  // Minimal feature flag bridge for the reconstructed runtime.
  // Priority:
  // - `CLAUDE_FEATURE_<FLAGNAME>` env var
  // - defaultValue
  const envKey = `CLAUDE_FEATURE_${flagName.toUpperCase()}`;
  if (envKey in process.env) {
    return parseBoolean(process.env[envKey]);
  }
  return defaultValue;
}

/**
 * Parse boolean from string (true variants).
 * Original: a1 (parseBoolean) in chunks.1.mjs
 */
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

/**
 * Parse boolean for false variants.
 * Original: iX (parseBooleanFalse) in chunks.1.mjs
 */
function parseBooleanFalse(value: string | undefined): boolean {
  if (!value) return false;
  return ['false', '0', 'no'].includes(value.toLowerCase());
}

/**
 * Get tool search mode from environment/config.
 * Original: k9A (getToolSearchMode) in chunks.85.mjs:506-515
 */
export function getToolSearchMode(): McpToolSearchMode {
  // Check explicit environment variables
  if (process.env.ENABLE_TOOL_SEARCH === 'auto') {
    return 'tst-auto';
  }
  if (parseBoolean(process.env.ENABLE_TOOL_SEARCH)) {
    return 'tst';
  }
  if (parseBoolean(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) {
    return 'mcp-cli';
  }
  if (parseBooleanFalse(process.env.ENABLE_TOOL_SEARCH)) {
    return 'standard';
  }
  if (parseBooleanFalse(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) {
    return 'standard';
  }

  // Check feature flag (non-internal users)
  if (!isInternalUser()) {
    try {
      if (getFeatureFlag('tengu_mcp_tool_search', true) === false) {
        return 'standard';
      }
    } catch {
      // Ignore errors
    }
  }

  // Default: auto mode
  return 'tst-auto';
}

// ============================================
// Telemetry
// ============================================

/**
 * Track tool search mode decision.
 */
function trackToolSearchDecision(decision: McpAutoSearchDecision): void {
  // Prefer platform telemetry; fall back to debug logging.
  try {
    telemetry.logEvent('tengu_mcp_tool_search_decision', {
      ...decision,
    } as any);
  } catch {
    // ignore
  }
  if (process.env.DEBUG_TELEMETRY || process.env.CLAUDE_DEBUG) {
    console.debug('[MCP] Tool search decision:', decision);
  }
}

// ============================================
// Main Decision Function
// ============================================

/**
 * Determine if MCPSearch mode should be enabled.
 * Original: RZ0 (shouldEnableToolSearch) in chunks.85.mjs:559-592
 *
 * Enables MCPSearch when:
 * 1. Model supports tool_reference blocks (Sonnet 4+, Opus 4+)
 * 2. MCPSearch tool is available
 * 3. MCP tool descriptions exceed 10% of context window
 */
export async function shouldEnableToolSearch(
  modelId: string,
  allTools: McpWrappedTool[],
  getPermissionContext?: () => unknown,
  agents?: unknown[]
): Promise<boolean> {
  const mcpToolCount = allTools.filter((tool) => tool.isMcp).length;

  // Telemetry logging function
  function logDecision(
    enabled: boolean,
    mode: McpToolSearchMode,
    reason: string,
    extraData?: { mcpToolDescriptionChars?: number; threshold?: number }
  ): void {
    const decision: McpAutoSearchDecision = {
      enabled,
      mode,
      reason,
      mcpToolCount,
      ...extraData,
    };
    trackToolSearchDecision(decision);
  }

  // Check 1: Model support (Sonnet 4+, Opus 4+ required)
  if (!isModelSupportedForToolSearch(modelId)) {
    console.debug(
      `[MCP] Tool search disabled for model '${modelId}': no tool_reference support.`
    );
    logDecision(false, 'standard', 'model_unsupported');
    return false;
  }

  // Check 2: MCPSearch tool must be available
  if (!isMcpSearchToolAvailable(allTools)) {
    console.debug('[MCP] Tool search disabled: MCPSearchTool is not available.');
    logDecision(false, 'standard', 'mcp_search_unavailable');
    return false;
  }

  // Determine mode from environment/config
  const searchMode = getToolSearchMode();
  switch (searchMode) {
    case 'tst': // Forced enabled
      logDecision(true, searchMode, 'tst_enabled');
      return true;

    case 'tst-auto': {
      // Auto mode (default)
      // Calculate total MCP tool description size
      const descriptionChars = await calculateMcpDescriptionSize(
        allTools,
        getPermissionContext,
        agents
      );
      // Calculate threshold: 10% of context window × 2.5 char multiplier
      const threshold = calculateContextThreshold(modelId);
      const shouldEnable = descriptionChars >= threshold;

      console.debug(
        `[MCP] Auto tool search ${shouldEnable ? 'enabled' : 'disabled'}: ` +
          `${descriptionChars} chars (threshold: ${threshold}, 10% of context)`
      );
      logDecision(
        shouldEnable,
        searchMode,
        shouldEnable ? 'auto_above_threshold' : 'auto_below_threshold',
        { mcpToolDescriptionChars: descriptionChars, threshold }
      );
      return shouldEnable;
    }

    case 'mcp-cli':
    case 'standard':
      logDecision(false, searchMode, 'standard_mode');
      return false;
  }
}

// ============================================
// Discovered Tools Tracking
// ============================================

/**
 * Check if block is a tool result block.
 * Original: Jt8 (isToolResultBlock) in chunks.85.mjs
 */
function isToolResultBlock(block: unknown): block is { type: string; content: unknown[] } {
  return (
    block !== null &&
    typeof block === 'object' &&
    'type' in block &&
    (block as { type: string }).type === 'tool_result' &&
    'content' in block &&
    Array.isArray((block as { content: unknown[] }).content)
  );
}

/**
 * Check if block is a tool reference block.
 * Original: Yt8 (isToolReferenceBlock) in chunks.85.mjs
 */
function isToolReferenceBlock(block: unknown): block is { type: string; tool_name: string } {
  return (
    block !== null &&
    typeof block === 'object' &&
    'type' in block &&
    (block as { type: string }).type === 'tool_reference' &&
    'tool_name' in block
  );
}

/**
 * Find tools discovered via MCPSearch in message history.
 * Original: _Z0 (findDiscoveredToolsInHistory) in chunks.85.mjs:607-620
 */
export function findDiscoveredToolsInHistory(
  messages: Array<{
    type: string;
    message?: { content?: unknown };
  }>
): Set<string> {
  const discoveredTools = new Set<string>();

  for (const message of messages) {
    if (message.type !== 'user') continue;
    const content = message.message?.content;
    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (isToolResultBlock(block)) {
        for (const innerBlock of block.content) {
          if (isToolReferenceBlock(innerBlock)) {
            discoveredTools.add(innerBlock.tool_name);
          }
        }
      }
    }
  }

  if (discoveredTools.size > 0) {
    console.debug(
      `[MCP] Dynamic tool loading: found ${discoveredTools.size} discovered tools in message history`
    );
  }

  return discoveredTools;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
