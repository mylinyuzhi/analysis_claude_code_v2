/**
 * @claudecode/integrations - MCP Discovery
 *
 * Fetch tools, prompts, and resources from MCP servers.
 * Reconstructed from chunks.131.mjs:1917-2015
 */

import type {
  McpConnectedServer,
  McpTool,
  McpWrappedTool,
  McpPrompt,
  McpWrappedPrompt,
  McpResource,
  McpWrappedResource,
} from './types.js';
import {
  sanitizeServerName,
  isValidTool,
  ensureServerConnected,
  logMcpError,
  memoize,
} from './connection.js';
import { executeMcpTool } from './execution.js';
import { z } from 'zod';

// ============================================
// Internal Constants & Helpers
// ============================================

/**
 * Default tool properties.
 * Original: P42 in chunks.89.mjs:2853
 */
const DEFAULT_TOOL_PROPS = {
  isEnabled: () => true,
  isConcurrencySafe: () => false,
  isReadOnly: () => false,
  isDestructive: () => false,
  isOpenWorld: () => false,
  maxResultSizeChars: 1e5
};

/**
 * Ensure input is an array.
 * Original: Nr in chunks.22.mjs
 */
function ensureArray<T>(input: T | T[] | undefined | null): T[] {
  if (input === null || input === undefined) return [];
  return Array.isArray(input) ? input : [input];
}

/**
 * Reserved MCP server name for chrome integration.
 * Original: Ej in chunks.131.mjs:49
 */
const CLAUDE_IN_CHROME_SERVER = "claude-in-chrome";

/**
 * Check if server is an indexing server (specifically chrome integration).
 * Original: uEA in chunks.130.mjs:3266
 */
function isIndexingServer(serverName: string): boolean {
  return sanitizeServerName(serverName) === CLAUDE_IN_CHROME_SERVER;
}

/**
 * Get specific metadata/UI functions for indexing tools.
 * Original: Ir2 in chunks.131.mjs:1003
 */
function getIndexingToolMetadata(toolName: string): any {
  return {
    userFacingName() {
      return `Claude in Chrome[${toolName.replace(/_mcp$/, "")}]`;
    },
    renderToolUseMessage(input: any, { verbose }: { verbose?: boolean }) {
      return null;
    },
    renderToolUseTag(input: any) {
      return null;
    },
    renderToolResultMessage(result: any, input: any, { verbose }: { verbose?: boolean }) {
      return null;
    }
  };
}

// ============================================
// Discovery Logic
// ============================================

/**
 * Zod schemas for MCP list responses.
 */
const McpListToolsSchema = z.object({
  tools: z.array(z.any())
});

const McpListResourcesSchema = z.object({
  resources: z.array(z.any())
});

const McpListPromptsSchema = z.object({
  prompts: z.array(z.any())
});

/**
 * Fetch tools from a connected MCP server.
 * Original: Ax (fetchMcpTools) in chunks.131.mjs:1917-1987
 */
export const fetchMcpTools = memoize(async (server: McpConnectedServer): Promise<McpWrappedTool[]> => {
  if (server.type !== "connected") return [];
  
  try {
    if (!server.capabilities?.tools) return [];
    
    // Original: let Q = await A.client.request({ method: "tools/list" }, WxA);
    const response = await server.client.request<{ tools: any[] }>({
      method: "tools/list"
    }, McpListToolsSchema);
    
    return ensureArray(response.tools).map((tool) => ({
      ...DEFAULT_TOOL_PROPS,
      // Original: name: `mcp__${e3(A.name)}__${e3(G.name)}`
      name: `mcp__${sanitizeServerName(server.name)}__${sanitizeServerName(tool.name)}`,
      originalMcpToolName: tool.name,
      isMcp: true as const,
      
      async description() {
        return tool.description ?? "";
      },
      
      async prompt() {
        return tool.description ?? "";
      },
      
      isConcurrencySafe() {
        return tool.annotations?.readOnlyHint ?? false;
      },
      
      isReadOnly() {
        return tool.annotations?.readOnlyHint ?? false;
      },
      
      isDestructive() {
        return tool.annotations?.destructiveHint ?? false;
      },
      
      isOpenWorld() {
        return tool.annotations?.openWorldHint ?? false;
      },
      
      inputJSONSchema: tool.inputSchema,
      
      async checkPermissions() {
        return {
          behavior: "passthrough" as const,
          message: "MCPTool requires permission.",
          suggestions: [{
            type: "addRules" as const,
            rules: [{
              toolName: `mcp__${sanitizeServerName(server.name)}__${sanitizeServerName(tool.name)}`,
              ruleContent: undefined
            }],
            behavior: "allow" as const,
            destination: "localSettings" as const
          }]
        };
      },
      
      async call(args: any, { abortController }: any, _meta: any, extraContext: any) {
        // Original: Extract toolUseId if available
        const toolUseId = extraContext?.toolUseId;
        const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};
        
        const connectedServer = await ensureServerConnected(server);
        const data = await executeMcpTool({
          client: connectedServer,
          tool: tool.name,
          args,
          meta,
          signal: abortController.signal
        });
        
        return { data };
      },
      
      userFacingName() {
        const title = tool.annotations?.title || tool.name;
        return `${server.name} - ${title} (MCP)`;
      },
      
      ...(isIndexingServer(server.name) ? getIndexingToolMetadata(tool.name) : {})
    } as McpWrappedTool)).filter(isValidTool);
  } catch (err) {
    logMcpError(server.name, `Failed to fetch tools: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
});

/**
 * Fetch resources from a connected MCP server.
 * Original: GhA (fetchMcpResources) in chunks.131.mjs:1988-2002
 */
export const fetchMcpResources = memoize(async (server: McpConnectedServer): Promise<McpWrappedResource[]> => {
  if (server.type !== "connected") return [];
  
  try {
    if (!server.capabilities?.resources) return [];
    
    const response = await server.client.request<{ resources: any[] }>({
      method: "resources/list"
    }, McpListResourcesSchema);
    
    if (!response.resources) return [];
    
    return response.resources.map((res) => ({
      ...res,
      server: server.name
    } as McpWrappedResource));
  } catch (err) {
    logMcpError(server.name, `Failed to fetch resources: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
});

/**
 * Helper to map positional arguments to names.
 * Original: s9Q in chunks.131.mjs
 */
function mapArgsToNames(argNames: string[], argValues: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  argNames.forEach((name, i) => {
    if (argValues[i] !== undefined) result[name] = argValues[i];
  });
  return result;
}

/**
 * Fetch prompts from a connected MCP server.
 * Original: ZhA (fetchMcpPrompts) in chunks.131.mjs:2003-2015
 */
export const fetchMcpPrompts = memoize(async (server: McpConnectedServer): Promise<McpWrappedPrompt[]> => {
  if (server.type !== "connected") return [];
  
  try {
    if (!server.capabilities?.prompts) return [];
    
    const response = await server.client.request<{ prompts: any[] }>({
      method: "prompts/list"
    }, McpListPromptsSchema);
    
    if (!response.prompts) return [];
    
    return response.prompts.map((prompt) => {
      const argNames = prompt.arguments?.map((a: any) => a.name) ?? [];
      
      return {
        type: 'prompt',
        name: `mcp__${sanitizeServerName(server.name)}__${sanitizeServerName(prompt.name)}`,
        description: prompt.description ?? "",
        isMcp: true as const,
        argNames,
        source: 'mcp' as const,
        userFacingName() {
          return `${server.name}:${prompt.name} (MCP)`;
        },
        async getPromptForCommand(argsString: string) {
          const argValues = argsString.split(" ");
          try {
            const client = await ensureServerConnected(server);
            const result = await client.client.getPrompt({
              name: prompt.name,
              arguments: mapArgsToNames(argNames, argValues)
            });
            const { convertMcpContent } = await import('./execution.js');
            return (await Promise.all(
              result.messages.map((msg: any) => convertMcpContent(msg.content, client.name))
            )).flat();
          } catch (error) {
            logMcpError(server.name, `Error running '${prompt.name}': ${error instanceof Error ? error.message : String(error)}`);
            throw error;
          }
        }
      } as McpWrappedPrompt;
    });
  } catch (err) {
    logMcpError(server.name, `Failed to fetch prompts: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
});

/**
 * Normalize tool name.
 */
export function normalizeToolName(name: string): string {
  return sanitizeServerName(name);
}

/**
 * Clear discovery cache.
 */
export function clearDiscoveryCache(): void {
  (fetchMcpTools as any).cache.clear();
  (fetchMcpPrompts as any).cache.clear();
  (fetchMcpResources as any).cache.clear();
}

/**
 * Refresh tools when list changed notification is received.
 * Original: handleToolsListChanged in chunks.138.mjs:2917-2927
 */
export async function refreshToolsOnListChanged(server: McpConnectedServer): Promise<void> {
  const cacheKey = JSON.stringify(server); 
  (fetchMcpTools as any).cache.delete(cacheKey);
  (fetchMcpPrompts as any).cache.delete(cacheKey);
  (fetchMcpResources as any).cache.delete(cacheKey);
  
  await Promise.all([
    fetchMcpTools(server),
    fetchMcpPrompts(server),
    fetchMcpResources(server)
  ]);
}

/**
 * Setup notification handlers for list changes.
 * Reconstructed from chunks.138.mjs
 */
export function setupListChangedHandlers(
  server: McpConnectedServer,
  onToolsChanged: () => void,
  onPromptsChanged: () => void,
  onResourcesChanged: () => void
): void {
  if (server.type !== "connected") return;
  
  if (server.capabilities?.tools?.listChanged) {
    server.client.setNotificationHandler("notifications/tools/list_changed", async () => {
      onToolsChanged();
    });
  }
  
  if (server.capabilities?.prompts?.listChanged) {
    server.client.setNotificationHandler("notifications/prompts/list_changed", async () => {
      onPromptsChanged();
    });
  }
  
  if (server.capabilities?.resources?.listChanged) {
    server.client.setNotificationHandler("notifications/resources/list_changed", async () => {
      onResourcesChanged();
    });
  }
}

/**
 * MCP list resources tool definition.
 * Original: Ud in chunks.89.mjs:2998
 */
export const listResourcesTool: McpWrappedTool = {
  isEnabled: () => true,
  isConcurrencySafe: () => true,
  isReadOnly: () => true,
  isDestructive: () => false,
  isOpenWorld: () => false,
  isMcp: true as const,
  originalMcpToolName: "listMcpResources",
  name: "listMcpResources",
  async description() {
    return "List all resources available across connected MCP servers.";
  },
  async prompt() {
    return "List available MCP resources.";
  },
  inputJSONSchema: z.object({
    server: z.string().optional().describe("Filter by server name")
  }),
  async call(args: any, { options }: any) {
    const { server: targetServer } = args;
    const mcpClients = options?.mcpClients ?? [];
    const results: any[] = [];
    
    const targets = targetServer 
      ? mcpClients.filter((c: any) => c.name === targetServer)
      : mcpClients;
      
    if (targetServer && targets.length === 0) {
      throw Error(`Server "${targetServer}" not found.`);
    }
    
    for (const server of targets) {
      if (server.type !== "connected") continue;
      try {
        if (!server.capabilities?.resources) continue;
        const response = await server.client.request({ method: "resources/list" }, z.any());
        if (response.resources) {
          results.push(...response.resources.map((r: any) => ({ ...r, server: server.name })));
        }
      } catch (err) {
        logMcpError(server.name, `Failed to fetch resources: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    return { data: results };
  },
  userFacingName: () => "listMcpResources"
} as any as McpWrappedTool;

/**
 * MCP read resource tool definition.
 * Original: qd in chunks.89.mjs:3167
 */
export const readResourceTool: McpWrappedTool = {
  isEnabled: () => true,
  isConcurrencySafe: () => true,
  isReadOnly: () => true,
  isDestructive: () => false,
  isOpenWorld: () => false,
  isMcp: true as const,
  originalMcpToolName: "readMcpResource",
  name: "readMcpResource",
  async description() {
    return "Read a specific resource from an MCP server.";
  },
  async prompt() {
    return "Read an MCP resource.";
  },
  inputJSONSchema: z.object({
    server: z.string().describe("The name of the MCP server"),
    uri: z.string().describe("The resource URI to read")
  }),
  async call(args: any, { options }: any) {
    const { server: serverName, uri } = args;
    const mcpClients = options?.mcpClients ?? [];
    const server = mcpClients.find((c: any) => c.name === serverName);
    
    if (!server) throw Error(`Server "${serverName}" not found.`);
    if (server.type !== "connected") throw Error(`Server "${serverName}" is not connected`);
    
    const result = await server.client.request({
      method: "resources/read",
      params: { uri }
    }, z.any());
    
    return { data: result };
  },
  userFacingName: () => "readMcpResource"
} as any as McpWrappedTool;
