/**
 * @claudecode/cli - MCP State Manager
 *
 * Manages MCP server connections and state for CLI commands.
 * Reconstructed from cli.chunks.mjs analysis.
 */

import { spawn, type ChildProcess } from 'child_process';
import {
  getMcpServers,
  isServerDisabled,
  isServerApproved,
  substituteConfigEnvVars,
  type McpServerConfig,
} from '../settings/loader.js';

// ============================================
// Types
// ============================================

/**
 * MCP client connection status.
 */
export type McpClientStatus = 'connected' | 'pending' | 'failed' | 'disabled';

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
  process?: ChildProcess;
  capabilities?: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
  };
  error?: string;
  requestId: number;
  pendingRequests: Map<number, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  }>;
  buffer: string;
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
  // Close all client processes
  for (const client of mcpState.clients.values()) {
    if (client.process && !client.process.killed) {
      client.process.kill();
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
// Client Communication
// ============================================

/**
 * Send JSON-RPC request to MCP server.
 */
async function sendRequest(
  client: McpClientWrapper,
  method: string,
  params?: object
): Promise<unknown> {
  if (!client.process || client.status !== 'connected') {
    throw new Error(`Server ${client.name} is not connected`);
  }

  const id = ++client.requestId;
  const request = {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };

  return new Promise((resolve, reject) => {
    client.pendingRequests.set(id, { resolve, reject });

    const message = JSON.stringify(request) + '\n';
    client.process!.stdin?.write(message, (err) => {
      if (err) {
        client.pendingRequests.delete(id);
        reject(err);
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (client.pendingRequests.has(id)) {
        client.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }
    }, 30000);
  });
}

/**
 * Handle response from MCP server.
 */
function handleResponse(client: McpClientWrapper, data: string): void {
  client.buffer += data;

  // Process complete JSON lines
  const lines = client.buffer.split('\n');
  client.buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const response = JSON.parse(line);

      // Handle response to request
      if (response.id !== undefined && client.pendingRequests.has(response.id)) {
        const { resolve, reject } = client.pendingRequests.get(response.id)!;
        client.pendingRequests.delete(response.id);

        if (response.error) {
          reject(new Error(response.error.message || 'Unknown error'));
        } else {
          resolve(response.result);
        }
      }

      // Handle notifications (we just log them for now)
      if (response.method && !response.id) {
        console.debug(`[MCP] ${client.name}: Notification ${response.method}`);
      }
    } catch {
      // Ignore invalid JSON
    }
  }
}

// ============================================
// Client Connection
// ============================================

/**
 * Connect to stdio MCP server.
 */
async function connectStdioServer(
  name: string,
  config: McpServerConfig
): Promise<McpClientWrapper> {
  const client: McpClientWrapper = {
    name,
    status: 'pending',
    config,
    requestId: 0,
    pendingRequests: new Map(),
    buffer: '',
  };

  if (!config.command) {
    client.status = 'failed';
    client.error = 'No command specified';
    return client;
  }

  try {
    // Substitute environment variables
    const resolvedConfig = substituteConfigEnvVars(config);

    // Spawn process
    const proc = spawn(resolvedConfig.command!, resolvedConfig.args || [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...(resolvedConfig.env || {}),
      },
    });

    client.process = proc;

    // Handle stdout (JSON-RPC responses)
    proc.stdout?.on('data', (data) => {
      handleResponse(client, data.toString());
    });

    // Handle stderr (debug output)
    proc.stderr?.on('data', (data) => {
      console.debug(`[MCP] ${name} stderr:`, data.toString().trim());
    });

    // Handle process exit
    proc.on('exit', (code) => {
      if (client.status === 'connected') {
        client.status = 'failed';
        client.error = `Process exited with code ${code}`;
      }
    });

    proc.on('error', (err) => {
      client.status = 'failed';
      client.error = err.message;
    });

    // Wait a bit for process to start
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Send initialize request
    const initResult = await sendRequest(client, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'claude-code-cli',
        version: '2.1.7',
      },
    }) as { capabilities?: { tools?: object; resources?: object; prompts?: object } };

    client.status = 'connected';
    client.capabilities = {
      tools: !!initResult.capabilities?.tools,
      resources: !!initResult.capabilities?.resources,
      prompts: !!initResult.capabilities?.prompts,
    };

    // Send initialized notification
    await sendRequest(client, 'notifications/initialized', {});

    return client;
  } catch (error) {
    client.status = 'failed';
    client.error = error instanceof Error ? error.message : String(error);
    if (client.process && !client.process.killed) {
      client.process.kill();
    }
    return client;
  }
}

/**
 * Connect to MCP server.
 */
export async function connectMcpServer(
  name: string,
  config: McpServerConfig
): Promise<McpClientWrapper> {
  const type = config.type || 'stdio';

  switch (type) {
    case 'stdio':
      return connectStdioServer(name, config);
    case 'sse':
    case 'http':
    case 'ws':
    case 'ws-ide':
    case 'sse-ide':
      // TODO: Implement network transports
      return {
        name,
        status: 'failed',
        config,
        error: `Transport type ${type} not yet implemented`,
        requestId: 0,
        pendingRequests: new Map(),
        buffer: '',
      };
    default:
      return {
        name,
        status: 'failed',
        config,
        error: `Unknown transport type: ${type}`,
        requestId: 0,
        pendingRequests: new Map(),
        buffer: '',
      };
  }
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize MCP connections.
 */
export async function initializeMcp(cwd?: string): Promise<void> {
  if (mcpState.initialized) {
    return;
  }

  const servers = getMcpServers(cwd);

  // Connect to each server
  const connectionPromises: Promise<void>[] = [];

  for (const [name, config] of Object.entries(servers)) {
    // Skip disabled servers
    if (config.disabled || isServerDisabled(name, cwd)) {
      mcpState.clients.set(name, {
        name,
        status: 'disabled',
        config,
        requestId: 0,
        pendingRequests: new Map(),
        buffer: '',
      });
      continue;
    }

    // Check if project server is approved
    if (!isServerApproved(name, cwd)) {
      mcpState.clients.set(name, {
        name,
        status: 'pending',
        config,
        error: 'Server not approved',
        requestId: 0,
        pendingRequests: new Map(),
        buffer: '',
      });
      continue;
    }

    // Connect to server
    connectionPromises.push(
      connectMcpServer(name, config).then((client) => {
        mcpState.clients.set(name, client);
        mcpState.normalizedNames.set(normalizeServerName(name), name);
      })
    );
  }

  // Wait for all connections
  await Promise.allSettled(connectionPromises);

  // Discover tools and resources
  await discoverToolsAndResources();

  mcpState.initialized = true;
}

/**
 * Normalize server name for lookup.
 */
export function normalizeServerName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Find client by name (supports normalized lookup).
 */
export function findClient(name: string): McpClientWrapper | undefined {
  // Direct lookup
  if (mcpState.clients.has(name)) {
    return mcpState.clients.get(name);
  }

  // Normalized lookup
  const normalized = normalizeServerName(name);
  const originalName = mcpState.normalizedNames.get(normalized);
  if (originalName) {
    return mcpState.clients.get(originalName);
  }

  return undefined;
}

// ============================================
// Discovery
// ============================================

/**
 * Discover tools and resources from connected servers.
 */
async function discoverToolsAndResources(): Promise<void> {
  const tools: McpToolInfo[] = [];
  const resources: McpResourceInfo[] = [];

  for (const client of mcpState.clients.values()) {
    if (client.status !== 'connected') continue;

    // Discover tools
    if (client.capabilities?.tools) {
      try {
        const result = await sendRequest(client, 'tools/list', {}) as { tools?: Array<{
          name: string;
          description?: string;
          inputSchema?: object;
        }> };

        if (result.tools) {
          for (const tool of result.tools) {
            tools.push({
              name: tool.name,
              server: client.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            });
          }
        }
      } catch (error) {
        console.error(`[MCP] ${client.name}: Failed to discover tools:`, error);
      }
    }

    // Discover resources
    if (client.capabilities?.resources) {
      try {
        const result = await sendRequest(client, 'resources/list', {}) as { resources?: Array<{
          uri: string;
          name?: string;
          description?: string;
          mimeType?: string;
        }> };

        if (result.resources) {
          for (const resource of result.resources) {
            resources.push({
              uri: resource.uri,
              name: resource.name,
              server: client.name,
              description: resource.description,
              mimeType: resource.mimeType,
            });
          }
        }
      } catch (error) {
        console.error(`[MCP] ${client.name}: Failed to discover resources:`, error);
      }
    }
  }

  mcpState.tools = tools;
  mcpState.resources = resources;
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

  if (client.status !== 'connected') {
    throw new McpConnectionError(
      `Server '${serverName}' is not connected: ${client.error || client.status}`
    );
  }

  if (options?.debug) {
    console.debug(`[MCP] ${serverName}: Calling tool ${toolName} with args:`, args);
  }

  const result = await sendRequest(client, 'tools/call', {
    name: toolName,
    arguments: args,
  }) as { isError?: boolean; content?: Array<{ type: string; text?: string }>; error?: string };

  if (result.isError) {
    const errorMsg = result.content?.[0]?.text || result.error || 'Unknown error';
    throw new Error(errorMsg);
  }

  // Extract text content
  if (result.content) {
    const textContent = result.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');
    return textContent || result;
  }

  return result;
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

  if (client.status !== 'connected') {
    throw new McpConnectionError(
      `Server '${serverName}' is not connected: ${client.error || client.status}`
    );
  }

  if (options?.debug) {
    console.debug(`[MCP] ${serverName}: Reading resource ${uri}`);
  }

  const result = await sendRequest(client, 'resources/read', {
    uri,
  }) as { contents?: Array<{ text?: string; blob?: string; mimeType?: string }> };

  return { contents: result.contents || [] };
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
  return mcpState.tools.find(
    (t) => t.server === serverName && t.name === toolName
  );
}

/**
 * Search tools by pattern.
 */
export function searchTools(
  pattern: string,
  options?: { ignoreCase?: boolean }
): McpToolInfo[] {
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
  return undefined;
}

// ============================================
// Export
// ============================================

export {
  getMcpState,
  isMcpInitialized,
  resetMcpState,
  initializeMcp,
  connectMcpServer,
  normalizeServerName,
  findClient,
  callMcpTool,
  readMcpResource,
  getServerList,
  getToolList,
  getResourceList,
  findTool,
  searchTools,
  getServerError,
};
