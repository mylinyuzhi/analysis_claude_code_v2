/**
 * @claudecode/integrations - MCP Types
 *
 * Type definitions for Model Context Protocol integration.
 * Reconstructed from chunks.131.mjs, chunks.90.mjs, chunks.85.mjs
 */

// ============================================
// Transport Types
// ============================================

/**
 * MCP transport type.
 * Original: Various transport classes in chunks.131.mjs
 */
export type McpTransportType =
  | 'stdio' // Local command-line servers (KX0)
  | 'sse' // Server-Sent Events (rG1)
  | 'http' // HTTP polling (kX0)
  | 'ws' // WebSocket (JZ1)
  | 'sse-ide' // IDE-specific SSE
  | 'ws-ide' // IDE-specific WebSocket
  | 'sdk'; // SDK-based (VL0)

// ============================================
// Server Configuration
// ============================================

/**
 * Base server configuration.
 */
export interface McpServerConfigBase {
  disabled?: boolean;
}

/**
 * Stdio server configuration.
 */
export interface McpStdioServerConfig extends McpServerConfigBase {
  type?: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

/**
 * SSE server configuration.
 */
export interface McpSseServerConfig extends McpServerConfigBase {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
}

/**
 * HTTP server configuration.
 */
export interface McpHttpServerConfig extends McpServerConfigBase {
  type: 'http';
  url: string;
  headers?: Record<string, string>;
}

/**
 * WebSocket server configuration.
 */
export interface McpWsServerConfig extends McpServerConfigBase {
  type: 'ws' | 'ws-ide';
  url: string;
  headers?: Record<string, string>;
}

/**
 * SSE IDE server configuration.
 */
export interface McpSseIdeServerConfig extends McpServerConfigBase {
  type: 'sse-ide';
  url: string;
  headers?: Record<string, string>;
}

/**
 * SDK server configuration.
 */
export interface McpSdkServerConfig extends McpServerConfigBase {
  type: 'sdk';
}

/**
 * Combined server configuration type.
 */
export type McpServerConfig =
  | McpStdioServerConfig
  | McpSseServerConfig
  | McpHttpServerConfig
  | McpWsServerConfig
  | McpSseIdeServerConfig
  | McpSdkServerConfig;

// ============================================
// Connection States
// ============================================

/**
 * Server connection state type.
 * Original: Various return types in connectMcpServer (SO)
 */
export type McpConnectionState =
  | 'connected' // Successfully connected and ready
  | 'pending' // Connection in progress
  | 'failed' // Connection failed
  | 'disabled' // Server disabled by user
  | 'needs-auth' // OAuth authentication required
  | 'proxy'; // Proxy server (claudeai)

/**
 * Server capabilities from MCP protocol.
 */
export interface McpServerCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    listChanged?: boolean;
    subscribe?: boolean;
  };
  logging?: object;
  experimental?: object;
}

/**
 * Connected server state.
 */
export interface McpConnectedServer {
  type: 'connected';
  name: string;
  client: McpClient;
  capabilities: McpServerCapabilities;
  config?: McpServerConfig;
  serverInfo?: unknown;
  instructions?: string;
  cleanup?: (() => void) | (() => Promise<void>);
}

/**
 * Failed server state.
 */
export interface McpFailedServer {
  type: 'failed';
  name: string;
  config: McpServerConfig;
  error?: string;
}

/**
 * Disabled server state.
 */
export interface McpDisabledServer {
  type: 'disabled';
  name: string;
  config: McpServerConfig;
}

/**
 * Pending server state.
 */
export interface McpPendingServer {
  type: 'pending';
  name: string;
  config: McpServerConfig;
}

/**
 * Needs auth server state.
 */
export interface McpNeedsAuthServer {
  type: 'needs-auth';
  name: string;
  config: McpServerConfig;
  authUrl?: string;
}

/**
 * Combined server connection type.
 */
export type McpServerConnection =
  | McpConnectedServer
  | McpFailedServer
  | McpDisabledServer
  | McpPendingServer
  | McpNeedsAuthServer;

// ============================================
// MCP Client Interface
// ============================================

/**
 * MCP Client interface (simplified).
 * Original: PG1 in chunks.131.mjs
 */
export interface McpClient {
  connect(transport: McpTransport): Promise<void>;
  close(): Promise<void>;
  getServerCapabilities(): McpServerCapabilities;
  getServerVersion(): string | undefined;
  getInstructions(): string | undefined;
  request<T>(params: McpRequest, schema?: object): Promise<T>;
  callTool(
    params: McpToolCallParams,
    schema?: object,
    options?: { signal?: AbortSignal; timeout?: number }
  ): Promise<McpToolResult>;
  getPrompt(params: McpPromptParams): Promise<McpPromptResult>;
  setNotificationHandler(type: string, handler: () => Promise<void>): void;
  setRequestHandler(schema: any, handler: (params: any) => Promise<unknown>): void;
}

/**
 * MCP Transport interface.
 */
export interface McpTransport {
  start(): Promise<void>;
  close(): Promise<void>;
  send(message: object): Promise<void>;
  // 运行时事件回调（不同 transport 可能实现不同）
  onMessage?: (handler: (message: unknown) => void) => void;
  onError?: (handler: (error: Error) => void) => void;
  onClose?: (handler: () => void) => void;
}

/**
 * MCP Request.
 */
export interface McpRequest {
  method: string;
  params?: object;
}

// ============================================
// Tool Types
// ============================================

/**
 * MCP tool call parameters.
 */
export interface McpToolCallParams {
  name: string;
  arguments: Record<string, unknown>;
  _meta?: object;
}

/**
 * MCP tool result.
 */
export interface McpToolResult {
  isError?: boolean;
  content?: McpContent[];
  error?: string;
  toolResult?: string;
  structuredContent?: object;
}

/**
 * MCP content types.
 */
export type McpContent =
  | McpTextContent
  | McpImageContent
  | McpResourceContent
  | McpResourceLinkContent;

/**
 * Text content.
 */
export interface McpTextContent {
  type: 'text';
  text: string;
}

/**
 * Image content.
 */
export interface McpImageContent {
  type: 'image';
  mimeType: string;
  data: string; // base64
}

/**
 * Resource content.
 */
export interface McpResourceContent {
  type: 'resource';
  resource: {
    uri: string;
    text?: string;
    blob?: string; // base64
    mimeType?: string;
  };
}

/**
 * Resource link content.
 */
export interface McpResourceLinkContent {
  type: 'resource_link';
  uri: string;
}

/**
 * MCP tool definition from server.
 */
export interface McpTool {
  name: string;
  description?: string;
  inputSchema?: object;
}

/**
 * MCP prompt definition from server.
 */
export interface McpPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

/**
 * MCP resource definition from server.
 */
export interface McpResource {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

/**
 * MCP tool definition from server (alternate name).
 */
export interface McpToolDefinition extends McpTool {
  name: string;
  description?: string;
  inputSchema?: object;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    openWorldHint?: boolean;
  };
}

/**
 * Claude Code tool wrapper for MCP tool.
 */
export interface McpWrappedTool {
  name: string;
  originalMcpToolName: string;
  isMcp: true;
  description(arg?: unknown, context?: unknown): Promise<string>;
  prompt?(context: unknown): Promise<string>;
  inputJSONSchema?: object;
  isConcurrencySafe(): boolean;
  isReadOnly(): boolean;
  isDestructive(): boolean;
  isOpenWorld(): boolean;
  call(
    args: Record<string, unknown>,
    context: ToolUseContext,
    _meta?: unknown,
    extraContext?: unknown
  ): Promise<{ data: unknown }>;
  userFacingName(): string;
  checkPermissions?(): Promise<unknown>;
}

/**
 * Tool use context.
 */
export interface ToolUseContext {
  abortController: AbortController;
  agentId?: string;
  options?: {
    tools?: any[];
    mcpClients?: McpConnectedServer[];
  };
}

// ============================================
// Prompt Types
// ============================================

/**
 * MCP prompt parameters.
 */
export interface McpPromptParams {
  name: string;
  arguments?: Record<string, string>;
}

/**
 * MCP prompt result.
 */
export interface McpPromptResult {
  messages: Array<{
    role: string;
    content: McpContent | McpContent[];
  }>;
}

/**
 * MCP prompt definition from server.
 */
export interface McpPromptDefinition {
  name: string;
  description?: string;
  arguments?: Record<
    string,
    {
      name: string;
      description?: string;
      required?: boolean;
    }
  >;
}

/**
 * Claude Code prompt wrapper for MCP prompt.
 */
export interface McpWrappedPrompt {
  type: 'prompt';
  name: string;
  description: string;
  isMcp: true;
  argNames: string[];
  source: 'mcp';
  userFacingName(): string;
  getPromptForCommand(argsString: string): Promise<unknown[]>;
}

// ============================================
// Resource Types
// ============================================

/**
 * MCP resource definition from server.
 */
export interface McpResourceDefinition {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

/**
 * Wrapped resource with server info.
 */
export interface McpWrappedResource extends McpResourceDefinition {
  server: string;
}

// ============================================
// Configuration Scopes
// ============================================

/**
 * Configuration scope.
 * Original: Various loadScopeServers (sX) calls
 */
export type McpConfigScope =
  | 'enterprise' // System policy (highest priority)
  | 'local' // .claude.local.json
  | 'project' // .mcp.json (walks up directory tree)
  | 'user' // ~/.config/claude/settings.json
  | 'dynamic' // CLI --mcp-config
  | 'plugin'; // Plugin manifests

/**
 * Config load result.
 */
export interface McpConfigResult {
  servers: Record<string, McpServerConfig>;
  errors: Array<{ server: string; error: string }>;
}

/**
 * Server connection result with capabilities.
 */
export interface McpServerConnectionResult {
  client: McpServerConnection;
  tools: McpWrappedTool[];
  commands: McpWrappedPrompt[];
  resources?: McpWrappedResource[];
}

// ============================================
// Auto-Search Types
// ============================================

/**
 * Tool search mode.
 * Original: k9A (getToolSearchMode) in chunks.85.mjs
 */
export type McpToolSearchMode =
  | 'tst' // Force enabled
  | 'tst-auto' // Auto mode (default)
  | 'mcp-cli' // Legacy MCP CLI mode
  | 'standard'; // All tools in prompt

/**
 * Auto-search decision result.
 */
export interface McpAutoSearchDecision {
  enabled: boolean;
  mode: McpToolSearchMode;
  reason: string;
  mcpToolCount: number;
  mcpToolDescriptionChars?: number;
  threshold?: number;
}

// ============================================
// Batch Initialization Types
// ============================================

/**
 * Batch initialization diagnostics.
 */
export interface McpBatchDiagnostics {
  totalServers: number;
  stdioCount: number;
  sseCount: number;
  httpCount: number;
  sseIdeCount: number;
  wsIdeCount: number;
}

/**
 * Callback for progressive server connection.
 */
export type McpServerConnectedCallback = (result: McpServerConnectionResult) => void;

// ============================================
// Constants
// ============================================

/**
 * MCP constants.
 */
export const MCP_CONSTANTS = {
  // Connection timeout (Fr2)
  // Original: Fr2 in chunks.131.mjs:1507
  CONNECTION_TIMEOUT: 60000, // 60 seconds

  // Tool timeout ($C7)
  // Original: $C7 in chunks.148.mjs:3546
  DEFAULT_TOOL_TIMEOUT: 100000000, // ~27 hours (effectively unlimited)

  // Batch size
  // Original: Vr2 usage in chunks.131.mjs:1168
  DEFAULT_BATCH_SIZE: 3,

  // Progress interval
  // Original: setInterval in zr2 (chunks.131.mjs:1382)
  PROGRESS_INTERVAL: 30000, // 30 seconds

  // Keep-alive interval
  // Original: setInterval in zr2 (chunks.131.mjs:1385)
  KEEPALIVE_INTERVAL: 50000, // 50 seconds

  // Auto-search constants
  // Original: heB in chunks.85.mjs:623
  SEARCH_CONTEXT_RATIO: 0.1, // 10% (heB)
  // Original: At8 in chunks.85.mjs:624
  CHAR_TO_TOKEN_MULTIPLIER: 2.5, // (At8)

  // Tool naming
  TOOL_PREFIX: 'mcp__',

  // MCPSearch tool name (Db)
  // Original: Db in chunks.85.mjs:487
  MCPSEARCH_TOOL_NAME: 'MCPSearch',

  // Reserved server names
  // Original: Ej, uEA usage
  RESERVED_SERVERS: ['claude-in-chrome', 'ide'] as const,

  // Notification types
  // Original: jY0, _Y0, NY0 in chunks.86.mjs
  NOTIFICATIONS: {
    TOOLS_LIST_CHANGED: 'notifications/tools/list_changed',
    PROMPTS_LIST_CHANGED: 'notifications/prompts/list_changed',
    RESOURCES_LIST_CHANGED: 'notifications/resources/list_changed',
  } as const,

  // Supported image MIME types (nB7)
  // Original: nB7 in chunks.131.mjs:1561
  SUPPORTED_IMAGE_TYPES: new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]),
} as const;
