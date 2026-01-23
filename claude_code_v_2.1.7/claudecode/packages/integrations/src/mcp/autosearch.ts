/**
 * @claudecode/integrations - MCP Auto Search
 * 
 * Decision logic for auto-search mode and MCPSearch tool.
 * Original: logic in chunks.85.mjs and chunks.120.mjs
 */

import { parseBoolean } from '@claudecode/shared';
import { trackEvent, getModelBetas, getContextWindowSize, checkFeatureGate } from '@claudecode/platform';
import { logMcpDebug } from './connection.js';
import { z } from 'zod';

// ============================================
// Constants & State
// ============================================

/**
 * MCP Search tool name.
 * Original: Db in chunks.85.mjs:487
 */
export const MCP_SEARCH_TOOL_NAME = "MCPSearch";

/**
 * Threshold for auto-search mode (10% of context window).
 * Original: heB in chunks.85.mjs:623
 */
const MCP_SEARCH_CONTEXT_RATIO = 0.1;

/**
 * Character per token multiplier for threshold calculation.
 * Original: At8 in chunks.85.mjs:625
 */
const CHAR_TO_TOKEN_MULTIPLIER = 2.5;

/**
 * Models that do not support tool search (haiku series).
 * Original: Bt8 in chunks.85.mjs:637
 */
const UNSUPPORTED_SEARCH_MODELS = ["haiku"];

/**
 * Cache for MCP tool list changes.
 * Original: rg2 in chunks.120.mjs:261
 */
let lastMcpToolsHash: string | null = null;

// ============================================
// Logic Helpers
// ============================================

/**
 * Calculate character threshold for auto-search based on model context window.
 * Original: geB in chunks.85.mjs:491-495
 */
export function calculateContextThreshold(modelId: string): number {
  const betas = getModelBetas(modelId);
  const contextWindow = getContextWindowSize(modelId, betas);
  return Math.floor(contextWindow * MCP_SEARCH_CONTEXT_RATIO * CHAR_TO_TOKEN_MULTIPLIER);
}

/**
 * Get tool search mode from environment or experiment.
 * Original: k9A in chunks.85.mjs:506-516
 */
export function getToolSearchMode(): "tst-auto" | "tst" | "mcp-cli" | "standard" {
  if (process.env.ENABLE_TOOL_SEARCH === "auto") return "tst-auto";
  if (parseBoolean(process.env.ENABLE_TOOL_SEARCH)) return "tst";
  if (parseBoolean(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "mcp-cli";
  if (parseBoolean(process.env.ENABLE_TOOL_SEARCH) === false) return "standard";
  if (parseBoolean(process.env.ENABLE_EXPERIMENTAL_MCP_CLI) === false) return "standard";
  
  try {
    if (checkFeatureGate("tengu_mcp_tool_search", true) === false) {
      return "standard";
    }
  } catch {
    // Ignore gate check errors
  }
  
  return "tst-auto";
}

/**
 * Check if auto-search is enabled based on current mode.
 * Original: Zd in chunks.85.mjs:534-543
 */
export function isAutoSearchEnabled(): boolean {
  const mode = getToolSearchMode();
  return mode === "tst" || mode === "tst-auto";
}

/**
 * Check if model supports tool search.
 * Original: ueB in chunks.85.mjs:526-532
 */
export function isModelSupportedForToolSearch(modelId: string): boolean {
  const id = modelId.toLowerCase();
  // Original: Gt8() returns supported/unsupported list from feature gate or default Bt8
  return !UNSUPPORTED_SEARCH_MODELS.some(m => id.includes(m.toLowerCase()));
}

/**
 * Check if MCPSearch tool is in the tool list.
 * Original: meB in chunks.85.mjs:545-547
 */
export function isMcpSearchToolAvailable(tools: any[]): boolean {
  return tools.some(t => t.name === MCP_SEARCH_TOOL_NAME);
}

/**
 * Calculate total size of MCP tool descriptions.
 * Original: Zt8 in chunks.85.mjs:549-557
 */
export async function calculateMcpDescriptionSize(tools: any[], context: any): Promise<number> {
  const mcpTools = tools.filter(t => t.isMcp);
  if (mcpTools.length === 0) return 0;
  
  const prompts = await Promise.all(mcpTools.map(t => t.prompt(context)));
  return prompts.reduce((sum, p) => sum + (p?.length || 0), 0);
}

/**
 * Determine if auto-search mode should be enabled for the current session.
 * Original: RZ0 in chunks.85.mjs:559-593
 */
export async function shouldEnableAutoSearch(
  modelId: string,
  tools: any[],
  permissionContext: any,
  agents: any[]
): Promise<boolean> {
  const mcpToolCount = tools.filter(t => t.isMcp).length;

  const logDecision = (enabled: boolean, mode: string, reason: string, extra = {}) => {
    trackEvent("tengu_tool_search_mode_decision", {
      enabled,
      mode,
      reason,
      checkedModel: modelId,
      mcpToolCount,
      userType: "external",
      ...extra
    });
  };

  if (!isModelSupportedForToolSearch(modelId)) {
    logMcpDebug("autosearch", `Tool search disabled for model '${modelId}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`);
    logDecision(false, "standard", "model_unsupported");
    return false;
  }

  if (!isMcpSearchToolAvailable(tools)) {
    logMcpDebug("autosearch", "Tool search disabled: MCPSearchTool is not available (may have been disallowed via disallowedTools).");
    logDecision(false, "standard", "mcp_search_unavailable");
    return false;
  }

  const mode = getToolSearchMode();
  switch (mode) {
    case "tst":
      logDecision(true, mode, "tst_enabled");
      return true;
      
    case "tst-auto": {
      const descriptionSize = await calculateMcpDescriptionSize(tools, {
        getToolPermissionContext: permissionContext,
        tools,
        agents
      });
      const threshold = calculateContextThreshold(modelId);
      const enabled = descriptionSize >= threshold;
      
      logMcpDebug("autosearch", `Auto tool search ${enabled ? "enabled" : "disabled"}: ${descriptionSize} chars (threshold: ${threshold}, ${Math.round(MCP_SEARCH_CONTEXT_RATIO * 100)}% of context)`);
      
      logDecision(enabled, mode, enabled ? "auto_above_threshold" : "auto_below_threshold", {
        mcpToolDescriptionChars: descriptionSize,
        threshold
      });
      
      return enabled;
    }
    
    case "mcp-cli":
      logDecision(false, mode, "mcp_cli_mode");
      return false;
      
    case "standard":
    default:
      logDecision(false, mode, "standard_mode");
      return false;
  }
}

// ============================================
// MCPSearch Tool Implementation
// ============================================

/**
 * Generate description/prompt for MCPSearch tool.
 * Original: MZ0 in chunks.85.mjs:381-485
 */
function getMcpSearchPrompt(tools: any[]): string {
  const mcpTools = tools.filter(t => t.isMcp);
  
  const basePrompt = `Search for or select MCP tools to make them available for use.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST use this tool to load MCP tools BEFORE calling them directly.

This is a BLOCKING REQUIREMENT - MCP tools listed below are NOT available until you load them using this tool.

**Why this is non-negotiable:**
- MCP tools are deferred and not loaded until discovered via this tool
- Calling an MCP tool without first loading it will fail

**Query modes:**

1. **Direct selection** - Use \`select:<tool_name>\` when you know exactly which tool you need:
   - "select:mcp__slack__read_channel"
   - "select:mcp__filesystem__list_directory"
   - Returns just that tool if it exists

2. **Keyword search** - Use keywords when you're unsure which tool to use:
   - "list directory" - find tools for listing directories
   - "read file" - find tools for reading files
   - "slack message" - find slack messaging tools
   - Returns up to 5 matching tools ranked by relevance

**CORRECT Usage Patterns:**

<example>
User: List files in the src directory
Assistant: I can see mcp__filesystem__list_directory in the available tools. Let me select it.
[Calls MCPSearch with query: "select:mcp__filesystem__list_directory"]
[Calls the MCP tool]
</example>

<example>
User: I need to work with slack somehow
Assistant: Let me search for slack tools.
[Calls MCPSearch with query: "slack"]
Assistant: Found several options including mcp__slack__read_channel.
[Calls the MCP tool]
</example>

**INCORRECT Usage Pattern - NEVER DO THIS:**

<bad-example>
User: Read my slack messages
Assistant: [Directly calls mcp__slack__read_channel without loading it first]
WRONG - You must load the tool FIRST using this tool
</bad-example>`;

  if (mcpTools.length === 0) return basePrompt;

  return `${basePrompt}

Available MCP tools (must be loaded before use):
${mcpTools.map(t => t.name).join('\n')}`;
}

// Memoized prompt fetcher for search
// Original: sg2 in chunks.120.mjs:282-297
const fetchToolPromptCached = (function() {
  const cache = new Map<string, string>();
  return async (toolName: string, tools: any[]) => {
    if (cache.has(toolName)) return cache.get(toolName)!;
    const tool = tools.find(t => t.name === toolName);
    if (!tool) return "";
    const prompt = await tool.prompt({
      getToolPermissionContext: async () => ({
        mode: "default",
        additionalWorkingDirectories: new Map(),
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: false
      }),
      tools,
      agents: []
    });
    cache.set(toolName, prompt);
    return prompt;
  };
})();

/**
 * Keyword search logic for MCP tools.
 * Original: bl5 in chunks.120.mjs:239-255
 */
async function searchMcpTools(query: string, mcpTools: any[], allTools: any[], limit: number): Promise<string[]> {
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
  
  const results = await Promise.all(mcpTools.map(async (tool) => {
    const nameMatch = tool.name.toLowerCase().replace(/__/g, " ");
    const description = (await fetchToolPromptCached(tool.name, allTools)).toLowerCase();
    
    let score = 0;
    for (const kw of keywords) {
      if (nameMatch === kw) score += 10;
      else if (nameMatch.includes(kw)) score += 5;
      if (description.includes(kw)) score += 2;
    }
    
    return { name: tool.name, score };
  }));
  
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.name);
}

/**
 * Create the MCPSearch tool.
 * Original: tg2 in chunks.120.mjs:298-381
 */
export function createMcpSearchTool(): any {
  return {
    name: MCP_SEARCH_TOOL_NAME,
    maxResultSizeChars: 1e5,
    userFacingName: () => "MCPSearch",
    isEnabled: () => isAutoSearchEnabled(),
    isConcurrencySafe: () => true,
    isReadOnly: () => true,
    
    async description(_: any, { tools }: any) {
      return getMcpSearchPrompt(tools);
    },
    
    async prompt({ tools }: any) {
      return getMcpSearchPrompt(tools);
    },
    
    inputSchema: z.object({
      query: z.string().describe('Query to find MCP tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
      max_results: z.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
    }),
    
    outputSchema: z.object({
      matches: z.array(z.string()),
      query: z.string(),
      total_mcp_tools: z.number()
    }),
    
    async call(args: any, { options: { tools } }: any) {
      const { query, max_results = 5 } = args;
      const mcpTools = tools.filter((t: any) => t.isMcp);
      
      // Original kl5 cache invalidation check
      const currentHash = mcpTools.map((t: any) => t.name).sort().join(",");
      if (lastMcpToolsHash !== currentHash) {
        logMcpDebug("MCPSearch", "MCPSearchTool: cache invalidated - MCP tools changed");
        // Clear memoized prompts if needed
        lastMcpToolsHash = currentHash;
      }

      const logOutcome = (matches: string[], type: string) => {
        trackEvent("tengu_mcp_search_outcome", {
          query,
          queryType: type,
          matchCount: matches.length,
          totalMcpTools: mcpTools.length,
          maxResults: max_results,
          hasMatches: matches.length > 0
        });
      };

      const selectMatch = query.match(/^select:(.+)$/i);
      if (selectMatch) {
        const toolName = selectMatch[1].trim();
        const found = mcpTools.find((t: any) => t.name === toolName);
        if (!found) {
          logMcpDebug("MCPSearch", `MCPSearchTool: select failed - tool not found: ${toolName}`);
          logOutcome([], "select");
          return { data: { matches: [], query, total_mcp_tools: mcpTools.length } };
        }
        logMcpDebug("MCPSearch", `MCPSearchTool: selected "${toolName}"`);
        logOutcome([found.name], "select");
        return { data: { matches: [found.name], query, total_mcp_tools: mcpTools.length } };
      }
      
      const matches = await searchMcpTools(query, mcpTools, tools, max_results);
      logMcpDebug("MCPSearch", `MCPSearchTool: keyword search for "${query}", found ${matches.length} matches`);
      logOutcome(matches, "keyword");
      
      return { data: { matches, query, total_mcp_tools: mcpTools.length } };
    },
    
    async checkPermissions(input: any) {
      return { behavior: "allow", updatedInput: input };
    },
    
    mapToolResultToToolResultBlockParam(result: any, toolUseId: string) {
      if (result.matches.length === 0) {
        return {
          type: "tool_result",
          tool_use_id: toolUseId,
          content: "No matching MCP tools found"
        };
      }
      return {
        type: "tool_result",
        tool_use_id: toolUseId,
        content: result.matches.map((name: string) => ({
          type: "tool_reference",
          tool_name: name
        }))
      };
    }
  };
}

/**
 * Scan message history for tools discovered via tool_reference.
 * Original: _Z0 in chunks.85.mjs:607-621
 */
export function findDiscoveredToolsInHistory(messages: any[]): Set<string> {
  const discovered = new Set<string>();
  
  const isToolResultWithContent = (block: any) => 
    typeof block === "object" && block !== null && block.type === "tool_result" && Array.isArray(block.content);
    
  const isToolReference = (item: any) =>
    typeof item === "object" && item !== null && item.type === "tool_reference" && typeof item.tool_name === "string";

  for (const msg of messages) {
    if (msg.type !== "user" && msg.role !== "user") continue;
    const content = msg.message?.content || msg.content;
    if (!Array.isArray(content)) continue;
    
    for (const block of content) {
      if (isToolResultWithContent(block)) {
        for (const item of block.content) {
          if (isToolReference(item)) {
            discovered.add(item.tool_name);
          }
        }
      }
    }
  }
  
  if (discovered.size > 0) {
    logMcpDebug("autosearch", `Dynamic tool loading: found ${discovered.size} discovered tools in message history`);
  }
  
  return discovered;
}

