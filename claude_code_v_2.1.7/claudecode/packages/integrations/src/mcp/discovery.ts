/**
 * @claudecode/integrations - MCP Discovery
 *
 * Tool, prompt, and resource discovery from MCP servers.
 * Reconstructed from chunks.131.mjs:1917-2046
 */

import type {
  McpConnectedServer,
  McpServerConnection,
  McpToolDefinition,
  McpWrappedTool,
  McpPromptDefinition,
  McpWrappedPrompt,
  McpResourceDefinition,
  McpWrappedResource,
  McpContent,
  ToolUseContext,
} from './types.js';
import { MCP_CONSTANTS } from './types.js';
import { executeMcpTool } from './execution.js';

// ============================================
// Utility Functions
// ============================================

/**
 * Normalize tool/server name for use in tool naming.
 * Original: e3 (normalizeToolName) in chunks.131.mjs
 */
export function normalizeToolName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Normalize array (ensure it's an array).
 * Original: Nr (normalizeArray) in chunks.131.mjs
 */
function normalizeArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Simple memoization for async functions.
 * Original: W0 (memoize) in chunks.131.mjs
 */
function memoize<T extends McpConnectedServer, R>(
  fn: (arg: T) => Promise<R>
): ((arg: T) => Promise<R>) & { cache: Map<T, R> } {
  const cache = new Map<T, R>();

  const memoized = async (arg: T): Promise<R> => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = await fn(arg);
    cache.set(arg, result);
    return result;
  };

  memoized.cache = cache;
  return memoized;
}

/**
 * Check if tool is valid.
 * Original: rB7 (isValidTool) in chunks.131.mjs
 */
function isValidTool(tool: McpWrappedTool): boolean {
  return !!tool.name && !!tool.originalMcpToolName;
}

// ============================================
// Base Tool Properties
// ============================================

/**
 * Base properties for MCP tools.
 * Original: P42 (baseToolProperties) in chunks.131.mjs
 */
const baseToolProperties = {
  maxResultSizeChars: 100000,

  isEnabled(): boolean {
    return true;
  },

  requiresUserInteraction(): boolean {
    return false;
  },

  async checkPermissions(
    input: Record<string, unknown>
  ): Promise<{ behavior: 'allow' | 'deny' | 'ask'; updatedInput: Record<string, unknown> }> {
    return { behavior: 'allow', updatedInput: input };
  },
};

// ============================================
// Tool Discovery
// ============================================

/**
 * Fetch tools from MCP server.
 * Original: Ax (fetchMcpTools) in chunks.131.mjs:1917-1988
 */
export const fetchMcpTools = memoize(
  async (serverConnection: McpConnectedServer): Promise<McpWrappedTool[]> => {
    if (serverConnection.type !== 'connected') return [];

    try {
      // Check if server supports tools
      if (!serverConnection.capabilities?.tools) return [];

      // Request tool list from server
      const response = await serverConnection.client.request<{
        tools: McpToolDefinition[];
      }>({ method: 'tools/list' });

      // Transform each tool into Claude Code tool format
      return normalizeArray(response.tools)
        .map((tool) => {
          const wrappedTool: McpWrappedTool = {
            ...baseToolProperties,

            // Renamed with mcp__ prefix to avoid conflicts
            name: `${MCP_CONSTANTS.TOOL_PREFIX}${normalizeToolName(serverConnection.name)}__${normalizeToolName(tool.name)}`,
            originalMcpToolName: tool.name,
            isMcp: true,

            // Tool metadata
            async description(): Promise<string> {
              return tool.description ?? '';
            },
            inputJSONSchema: tool.inputSchema,

            // Annotations from MCP spec
            isConcurrencySafe(): boolean {
              return tool.annotations?.readOnlyHint ?? false;
            },
            isReadOnly(): boolean {
              return tool.annotations?.readOnlyHint ?? false;
            },
            isDestructive(): boolean {
              return tool.annotations?.destructiveHint ?? false;
            },
            isOpenWorld(): boolean {
              return tool.annotations?.openWorldHint ?? false;
            },

            // Tool execution
            async call(
              args: Record<string, unknown>,
              context: ToolUseContext,
              _assistantTurn?: unknown,
              _lastApiMessage?: unknown
            ): Promise<{ data: unknown }> {
              const result = await executeMcpTool({
                client: serverConnection,
                tool: tool.name,
                args,
                signal: context.abortController.signal,
              });
              return { data: result };
            },

            // Display name for UI
            userFacingName(): string {
              const displayName = tool.annotations?.title || tool.name;
              return `${serverConnection.name} - ${displayName} (MCP)`;
            },
          };

          return wrappedTool;
        })
        .filter(isValidTool);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[MCP] ${serverConnection.name}: Failed to fetch tools: ${errorMessage}`);
      return [];
    }
  }
);

// ============================================
// Prompt Discovery
// ============================================

/**
 * Map argument values to names.
 * Original: s9Q (mapArgsToNames) in chunks.131.mjs
 */
function mapArgsToNames(
  argNames: string[],
  argValues: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < argNames.length && i < argValues.length; i++) {
    const name = argNames[i];
    const value = argValues[i];
    if (!name || value === undefined) continue;
    result[name] = value;
  }
  return result;
}

/**
 * Convert MCP content to Claude format.
 * Original: Er2 (convertMcpContent) in chunks.131.mjs:1242-1303
 */
export async function convertMcpContent(
  content: McpContent | McpContent[],
  serverName: string
): Promise<unknown[]> {
  const contents = Array.isArray(content) ? content : [content];
  const results: unknown[] = [];

  for (const item of contents) {
    if (item.type === 'text') {
      results.push({ type: 'text', text: item.text });
    } else if (item.type === 'image') {
      if (MCP_CONSTANTS.SUPPORTED_IMAGE_TYPES.has(item.mimeType)) {
        results.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: item.mimeType,
            data: item.data,
          },
        });
      } else {
        results.push({
          type: 'text',
          text: `[Unsupported image type: ${item.mimeType}]`,
        });
      }
    } else if (item.type === 'resource') {
      if (item.resource?.text) {
        results.push({
          type: 'text',
          text: `Resource: ${item.resource.uri}\n${item.resource.text}`,
        });
      } else if (item.resource?.blob) {
        const mimeType = item.resource.mimeType || 'application/octet-stream';
        if (MCP_CONSTANTS.SUPPORTED_IMAGE_TYPES.has(mimeType)) {
          results.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: item.resource.blob,
            },
          });
        } else {
          results.push({
            type: 'text',
            text: `[Binary resource: ${item.resource.uri} (${mimeType})]`,
          });
        }
      }
    } else if (item.type === 'resource_link') {
      results.push({
        type: 'text',
        text: `Resource link: ${item.uri}`,
      });
    } else {
      results.push({
        type: 'text',
        text: JSON.stringify(item),
      });
    }
  }

  return results;
}

/**
 * Fetch prompts from MCP server.
 * Original: ZhA (fetchMcpPrompts) in chunks.131.mjs:2003-2046
 */
export const fetchMcpPrompts = memoize(
  async (serverConnection: McpConnectedServer): Promise<McpWrappedPrompt[]> => {
    if (serverConnection.type !== 'connected') return [];

    try {
      // Check if server supports prompts
      if (!serverConnection.capabilities?.prompts) return [];

      // Request prompt list from server
      const response = await serverConnection.client.request<{
        prompts: McpPromptDefinition[];
      }>({ method: 'prompts/list' });

      if (!response.prompts) return [];

      return normalizeArray(response.prompts).map((prompt) => {
        // Extract argument names
        const argNames = Object.values(prompt.arguments ?? {}).map((arg) => arg.name);

        const wrappedPrompt: McpWrappedPrompt = {
          type: 'prompt',
          name: `${MCP_CONSTANTS.TOOL_PREFIX}${normalizeToolName(serverConnection.name)}__${prompt.name}`,
          description: prompt.description ?? '',
          isMcp: true,
          argNames,
          source: 'mcp',

          userFacingName(): string {
            return `${serverConnection.name}:${prompt.name} (MCP)`;
          },

          async getPromptForCommand(argsString: string): Promise<unknown[]> {
            const argValues = argsString.split(' ').filter(Boolean);

            try {
              const result = await serverConnection.client.getPrompt({
                name: prompt.name,
                arguments: mapArgsToNames(argNames, argValues),
              });

              // Convert MCP content format to Claude message format
              const converted = await Promise.all(
                result.messages.map((msg) =>
                  convertMcpContent(msg.content as McpContent | McpContent[], serverConnection.name)
                )
              );

              return converted.flat();
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              console.error(
                `[MCP] ${serverConnection.name}: Error running '${prompt.name}': ${errorMessage}`
              );
              throw error;
            }
          },
        };

        return wrappedPrompt;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        `[MCP] ${serverConnection.name}: Failed to fetch prompts: ${errorMessage}`
      );
      return [];
    }
  }
);

// ============================================
// Resource Discovery
// ============================================

/**
 * Fetch resources from MCP server.
 * Original: GhA (fetchMcpResources) in chunks.131.mjs:1988-2002
 */
export const fetchMcpResources = memoize(
  async (serverConnection: McpConnectedServer): Promise<McpWrappedResource[]> => {
    if (serverConnection.type !== 'connected') return [];

    try {
      // Check if server supports resources
      if (!serverConnection.capabilities?.resources) return [];

      // Request resource list from server
      const response = await serverConnection.client.request<{
        resources: McpResourceDefinition[];
      }>({ method: 'resources/list' });

      if (!response.resources) return [];

      // Add server name to each resource for tracking
      return response.resources.map((resource) => ({
        ...resource,
        server: serverConnection.name,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        `[MCP] ${serverConnection.name}: Failed to fetch resources: ${errorMessage}`
      );
      return [];
    }
  }
);

// ============================================
// Cache Management
// ============================================

/**
 * Clear discovery caches for a server.
 */
export function clearDiscoveryCache(serverConnection: McpConnectedServer): void {
  fetchMcpTools.cache.delete(serverConnection);
  fetchMcpPrompts.cache.delete(serverConnection);
  fetchMcpResources.cache.delete(serverConnection);
}

/**
 * Refresh tools after list_changed notification.
 * Original: Handles jY0 notification in chunks.138.mjs
 */
export async function refreshToolsOnListChanged(
  serverConnection: McpConnectedServer,
  updateState: (tools: McpWrappedTool[]) => void
): Promise<void> {
  // Clear cached tool list
  fetchMcpTools.cache.delete(serverConnection);

  // Fetch fresh tool list
  const newTools = await fetchMcpTools(serverConnection);

  // Update state
  updateState(newTools);
}

/**
 * Setup list_changed notification handlers.
 * Original: chunks.138.mjs:2917-2927
 */
export function setupListChangedHandlers(
  serverConnection: McpConnectedServer,
  onToolsChanged: (tools: McpWrappedTool[]) => void,
  onPromptsChanged: (prompts: McpWrappedPrompt[]) => void,
  onResourcesChanged: (resources: McpWrappedResource[]) => void
): void {
  // Tools list changed
  if (serverConnection.capabilities?.tools?.listChanged) {
    serverConnection.client.setNotificationHandler(
      MCP_CONSTANTS.NOTIFICATIONS.TOOLS_LIST_CHANGED,
      async () => {
        console.debug(
          `[MCP] ${serverConnection.name}: Received tools/list_changed notification, refreshing tools`
        );
        fetchMcpTools.cache.delete(serverConnection);
        const newTools = await fetchMcpTools(serverConnection);
        onToolsChanged(newTools);
      }
    );
  }

  // Prompts list changed
  if (serverConnection.capabilities?.prompts?.listChanged) {
    serverConnection.client.setNotificationHandler(
      MCP_CONSTANTS.NOTIFICATIONS.PROMPTS_LIST_CHANGED,
      async () => {
        console.debug(
          `[MCP] ${serverConnection.name}: Received prompts/list_changed notification, refreshing prompts`
        );
        fetchMcpPrompts.cache.delete(serverConnection);
        const newPrompts = await fetchMcpPrompts(serverConnection);
        onPromptsChanged(newPrompts);
      }
    );
  }

  // Resources list changed
  if (serverConnection.capabilities?.resources?.listChanged) {
    serverConnection.client.setNotificationHandler(
      MCP_CONSTANTS.NOTIFICATIONS.RESOURCES_LIST_CHANGED,
      async () => {
        console.debug(
          `[MCP] ${serverConnection.name}: Received resources/list_changed notification, refreshing resources`
        );
        fetchMcpResources.cache.delete(serverConnection);
        const newResources = await fetchMcpResources(serverConnection);
        onResourcesChanged(newResources);
      }
    );
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
