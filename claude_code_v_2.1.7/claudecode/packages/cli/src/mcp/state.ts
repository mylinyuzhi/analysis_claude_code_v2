/**
 * @claudecode/cli - MCP State Manager
 *
 * CLI MCP 状态管理：复用 @claudecode/integrations/mcp 的 config/connection/discovery。
 *
 * 背景：早期还原版本在 CLI 内自建了一个“仅 stdio JSON-RPC”的简化 MCP client，
 * 缺少 source 行为中的多 transport（sse/http/ide）、capabilities、keepalive、telemetry。
 */

import {
  loadAllMcpConfig,
  batchInitializeAllServers,
  connectMcpServer as connectMcpServerFromIntegrations,
  executeMcpTool,
  type McpServerConfig,
  type McpServerConnection,
  type McpConnectedServer,
} from '@claudecode/integrations';

// ============================================
// Types
// ============================================

/**
 * MCP client connection status.
 */
export type McpClientStatus = 'connected' | 'pending' | 'failed' | 'disabled' | 'needs-auth';

/**
 * MCP server info for display.
 */
export interface McpServerInfo {
  name: string;
  type: McpClientStatus;
  hasTools?: boolean;
  hasResources?: boolean;
  hasPrompts?: boolean;
  error?: string;
}

/**
 * MCP tool info.
 */
export interface McpToolInfo {
  name: string;
  server: string;
  description?: string;
  inputSchema?: object;
}

/**
 * MCP resource info.
 */
export interface McpResourceInfo {
  uri: string;
  name?: string;
  server: string;
  description?: string;
  mimeType?: string;
}

/**
 * MCP client wrapper.
 */
export interface McpClientWrapper {
  name: string;
  status: McpClientStatus;
  config: McpServerConfig;
  capabilities?: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
  };
  error?: string;

  /** integrations 连接对象（connected/failed/disabled/pending/needs-auth） */
  connection?: McpServerConnection;
}

/**
 * MCP State.
 */
export interface McpState {
  clients: Map<string, McpClientWrapper>;
  tools: McpToolInfo[];
  resources: McpResourceInfo[];
  normalizedNames: Map<string, string>;
  initialized: boolean;
}

// ============================================
// Global State
// ============================================

let mcpState: McpState = {
  clients: new Map(),
  tools: [],
  resources: [],
  normalizedNames: new Map(),
  initialized: false,
};

// ============================================
// State Accessors
// ============================================

/**
 * Get MCP state.
 */
export function getMcpState(): McpState {
  return mcpState;
}

/**
 * Check if MCP is initialized.
 */
export function isMcpInitialized(): boolean {
  return mcpState.initialized;
}

/**
 * Reset MCP state.
 */
export function resetMcpState(): void {
  // Close all MCP connections (best-effort)
  for (const client of mcpState.clients.values()) {
    const conn = client.connection;
    if (conn && conn.type === 'connected') {
      try {
        const cleanup = conn.cleanup;
        if (typeof cleanup === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          Promise.resolve(cleanup());
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          conn.client.close();
        }
      } catch {
        // ignore
      }
    }
  }

  mcpState = {
    clients: new Map(),
    tools: [],
    resources: [],
    normalizedNames: new Map(),
    initialized: false,
  };
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize MCP connections.
 */
export async function initializeMcp(_cwd?: string): Promise<void> {
  if (mcpState.initialized) return;

  resetMcpState();

  const { servers, errors } = await loadAllMcpConfig();

  // 记录配置读取错误（不阻断初始化）
  for (const e of errors || []) {
    console.debug(`[MCP] config error: ${e.server}: ${e.error}`);
  }

  for (const name of Object.keys(servers)) {
    mcpState.normalizedNames.set(name.toLowerCase(), name);
  }

  await batchInitializeAllServers(({ client, tools, resources }) => {
    const status = client.type as McpClientStatus;

    const wrapper: McpClientWrapper = {
      name: client.name,
      status,
      config: (client as any).config || (servers as any)[client.name],
      capabilities:
        client.type === 'connected'
          ? {
              tools: !!client.capabilities?.tools,
              resources: !!client.capabilities?.resources,
              prompts: !!client.capabilities?.prompts,
            }
          : undefined,
      error: (client as any).error,
      connection: client as McpServerConnection,
    };

    mcpState.clients.set(client.name, wrapper);

    if (Array.isArray(tools)) {
      for (const t of tools) {
        mcpState.tools.push({
          name: (t as any).name,
          server: client.name,
          description: (t as any).description,
          inputSchema: (t as any).inputSchema,
        });
      }
    }

    if (Array.isArray(resources)) {
      for (const r of resources) {
        mcpState.resources.push({
          uri: (r as any).uri,
          name: (r as any).name,
          server: client.name,
          description: (r as any).description,
          mimeType: (r as any).mimeType,
        });
      }
    }
  }, servers);

  mcpState.initialized = true;
}

/**
 * Connect to a single MCP server (best-effort, primarily for tests/diagnostics).
 */
export async function connectMcpServer(serverName: string, config: McpServerConfig): Promise<void> {
  const conn = await connectMcpServerFromIntegrations(serverName, config);
  const wrapper: McpClientWrapper = {
    name: serverName,
    status: conn.type as McpClientStatus,
    config,
    capabilities:
      conn.type === 'connected'
        ? {
            tools: !!conn.capabilities?.tools,
            resources: !!conn.capabilities?.resources,
            prompts: !!conn.capabilities?.prompts,
          }
        : undefined,
    error: (conn as any).error,
    connection: conn,
  };
  mcpState.clients.set(serverName, wrapper);
}

// ============================================
// Lookups
// ============================================

/**
 * Find client by name (supports case-insensitive lookup).
 */
export function findClient(serverName: string): McpClientWrapper | undefined {
  const exact = mcpState.clients.get(serverName);
  if (exact) return exact;
  const normalized = mcpState.normalizedNames.get(serverName.toLowerCase());
  if (!normalized) return undefined;
  return mcpState.clients.get(normalized);
}

// ============================================
// Tool Execution
// ============================================

/**
 * Call MCP tool.
 */
export async function callMcpTool(
  toolName: string,
  serverName: string,
  args: Record<string, unknown>,
  options?: { debug?: boolean; timeout?: number }
): Promise<unknown> {
  const client = findClient(serverName);
  if (!client) {
    throw new McpConnectionError(`Server '${serverName}' not found`);
  }

  if (client.status !== 'connected' || client.connection?.type !== 'connected') {
    throw new McpConnectionError(
      `Server '${serverName}' is not connected: ${client.error || client.status}`
    );
  }

  if (options?.debug) {
    console.debug(`[MCP] ${serverName}: Calling tool ${toolName} with args:`, args);
  }

  // integrations 层已包含 timeout / keepalive / telemetry
  const connected = client.connection as McpConnectedServer;
  return await executeMcpTool({
    client: connected,
    tool: toolName,
    args,
    meta: options?.debug ? { debug: true } : undefined,
    signal: undefined,
  });
}

/**
 * Read MCP resource.
 */
export async function readMcpResource(
  serverName: string,
  uri: string,
  options?: { debug?: boolean; timeout?: number }
): Promise<{ contents: Array<{ text?: string; blob?: string; mimeType?: string }> }> {
  const client = findClient(serverName);
  if (!client) {
    throw new McpConnectionError(`Server '${serverName}' not found`);
  }

  if (client.status !== 'connected' || client.connection?.type !== 'connected') {
    throw new McpConnectionError(
      `Server '${serverName}' is not connected: ${client.error || client.status}`
    );
  }

  if (options?.debug) {
    console.debug(`[MCP] ${serverName}: Reading resource ${uri}`);
  }

  const connected = client.connection as McpConnectedServer;
  const result = await connected.client.request<{
    contents?: Array<{ text?: string; blob?: string; mimeType?: string }>;
  }>(
    {
      method: 'resources/read',
      params: { uri },
    } as any
  );

  return { contents: result?.contents || [] };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get server info list for display.
 */
export function getServerList(): McpServerInfo[] {
  const servers: McpServerInfo[] = [];

  for (const client of mcpState.clients.values()) {
    servers.push({
      name: client.name,
      type: client.status,
      hasTools: client.capabilities?.tools,
      hasResources: client.capabilities?.resources,
      hasPrompts: client.capabilities?.prompts,
      error: client.error,
    });
  }

  return servers;
}

/**
 * Get tools list.
 */
export function getToolList(serverFilter?: string): McpToolInfo[] {
  if (!serverFilter) {
    return mcpState.tools;
  }
  return mcpState.tools.filter((t) => t.server === serverFilter);
}

/**
 * Get resources list.
 */
export function getResourceList(serverFilter?: string): McpResourceInfo[] {
  if (!serverFilter) {
    return mcpState.resources;
  }
  return mcpState.resources.filter((r) => r.server === serverFilter);
}

/**
 * Find tool by name.
 */
export function findTool(serverName: string, toolName: string): McpToolInfo | undefined {
  return mcpState.tools.find((t) => t.server === serverName && t.name === toolName);
}

/**
 * Search tools by pattern.
 */
export function searchTools(pattern: string, options?: { ignoreCase?: boolean }): McpToolInfo[] {
  const flags = options?.ignoreCase ? 'i' : '';
  const regex = new RegExp(pattern, flags);

  return mcpState.tools.filter((t) => {
    return regex.test(t.name) || (t.description && regex.test(t.description));
  });
}

/**
 * Get server error message.
 */
export function getServerError(serverName: string): string | undefined {
  const client = findClient(serverName);
  if (!client) {
    return `Server '${serverName}' not found`;
  }
  if (client.status === 'failed') {
    return client.error || 'Connection failed';
  }
  if (client.status === 'disabled') {
    return 'Server is disabled';
  }
  if (client.status === 'pending') {
    return 'Server not approved';
  }
  if (client.status === 'needs-auth') {
    return 'Server needs authentication';
  }
  return undefined;
}

// ============================================
// Custom Errors
// ============================================

/**
 * MCP connection error.
 */
export class McpConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'McpConnectionError';
  }
}
