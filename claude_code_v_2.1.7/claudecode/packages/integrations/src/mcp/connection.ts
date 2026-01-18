/**
 * @claudecode/integrations - MCP Connection
 *
 * Server connection management with transport selection.
 * Reconstructed from chunks.131.mjs:1563-1900
 *
 * Key symbols:
 * - SO → connectMcpServer (memoized with W0)
 * - rG1 → SSEClientTransport
 * - kX0 → HttpClientTransport
 * - JZ1 → WebSocketClientTransport
 * - KX0 → StdioClientTransport
 * - PG1 → MCPClient
 * - I4A → McpAuthProvider
 */

import type {
  McpServerConfig,
  McpServerConnection,
  McpConnectedServer,
  McpFailedServer,
  McpDisabledServer,
  McpNeedsAuthServer,
  McpServerCapabilities,
  McpClient,
  McpTransport,
  McpBatchDiagnostics,
  McpServerConnectionResult,
  McpServerConnectedCallback,
} from './types.js';
import { MCP_CONSTANTS } from './types.js';
import { isServerDisabled, substituteEnvVariables } from './config.js';
import { fetchMcpTools, fetchMcpPrompts, fetchMcpResources } from './discovery.js';

// ============================================
// Transport Implementations
// ============================================

/**
 * Stdio Client Transport for local process communication.
 * Original: KX0 in chunks.131.mjs
 *
 * Spawns a child process and communicates via stdin/stdout using JSON-RPC.
 */
class StdioClientTransport implements McpTransport {
  private process: import('child_process').ChildProcess | null = null;
  private messageBuffer = '';
  private messageHandlers: ((msg: object) => void)[] = [];
  private errorHandlers: ((err: Error) => void)[] = [];
  private closeHandlers: (() => void)[] = [];
  public stderr: import('stream').Readable | null = null;
  public pid: number | undefined;

  constructor(
    private options: {
      command: string;
      args?: string[];
      env?: Record<string, string>;
      stderr?: string;
    }
  ) {}

  async start(): Promise<void> {
    const { spawn } = await import('child_process');

    this.process = spawn(this.options.command, this.options.args || [], {
      stdio: ['pipe', 'pipe', this.options.stderr === 'pipe' ? 'pipe' : 'ignore'],
      env: this.options.env,
    });

    this.pid = this.process.pid;

    if (this.options.stderr === 'pipe' && this.process.stderr) {
      this.stderr = this.process.stderr;
    }

    // Handle stdout data (JSON-RPC messages)
    this.process.stdout?.on('data', (data: Buffer) => {
      this.messageBuffer += data.toString();

      // Process complete JSON messages (newline-delimited)
      const lines = this.messageBuffer.split('\n');
      this.messageBuffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            for (const handler of this.messageHandlers) {
              handler(message);
            }
          } catch {
            // Ignore invalid JSON
          }
        }
      }
    });

    // Handle process errors
    this.process.on('error', (err: Error) => {
      for (const handler of this.errorHandlers) {
        handler(err);
      }
    });

    // Handle process close
    this.process.on('close', () => {
      for (const handler of this.closeHandlers) {
        handler();
      }
    });
  }

  async close(): Promise<void> {
    if (!this.process || !this.pid) return;

    // Graceful shutdown: SIGINT → SIGTERM → SIGKILL
    try {
      process.kill(this.pid, 'SIGINT');

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          try {
            process.kill(this.pid!, 'SIGTERM');
          } catch {
            // Process may have already exited
          }
          setTimeout(() => {
            try {
              process.kill(this.pid!, 'SIGKILL');
            } catch {
              // Process may have already exited
            }
            resolve();
          }, 400);
        }, 100);

        this.process?.on('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    } catch {
      // Process may have already exited
    }

    this.process = null;
  }

  async send(message: object): Promise<void> {
    if (!this.process?.stdin?.writable) {
      throw new Error('Transport not connected');
    }
    this.process.stdin.write(JSON.stringify(message) + '\n');
  }

  onMessage(handler: (msg: object) => void): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: (err: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}

/**
 * SSE Client Transport for Server-Sent Events communication.
 * Original: rG1 in chunks.131.mjs
 *
 * Connects to SSE endpoint for server→client messages,
 * uses HTTP POST for client→server messages.
 */
class SSEClientTransport implements McpTransport {
  private eventSource: EventSource | null = null;
  private messageHandlers: ((msg: object) => void)[] = [];
  private errorHandlers: ((err: Error) => void)[] = [];
  private closeHandlers: (() => void)[] = [];
  private sessionUrl: string | null = null;

  constructor(
    private url: URL,
    private options?: {
      authProvider?: { tokens(): Promise<{ access_token: string } | null> };
      fetch?: typeof fetch;
      requestInit?: RequestInit;
      eventSourceInit?: {
        fetch?: (url: string, init?: RequestInit) => Promise<Response>;
      };
    }
  ) {}

  async start(): Promise<void> {
    // Create EventSource connection
    const fetchFn = this.options?.eventSourceInit?.fetch || fetch;

    // Initial SSE connection
    const response = await fetchFn(this.url.toString(), {
      ...this.options?.requestInit,
      headers: {
        ...this.options?.requestInit?.headers,
        Accept: 'text/event-stream',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationRequiredError('Authentication required');
      }
      throw new Error(`SSE connection failed: ${response.status}`);
    }

    // Parse session URL from response
    const sessionHeader = response.headers.get('X-MCP-Session-URL');
    if (sessionHeader) {
      this.sessionUrl = sessionHeader;
    }

    // Process SSE stream
    const reader = response.body?.getReader();
    if (reader) {
      this.processSSEStream(reader);
    }
  }

  private async processSSEStream(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete events
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const dataMatch = event.match(/^data: (.+)$/m);
          if (dataMatch) {
            try {
              const message = JSON.parse(dataMatch[1]);
              for (const handler of this.messageHandlers) {
                handler(message);
              }
            } catch {
              // Ignore invalid JSON
            }
          }
        }
      }
    } catch (error) {
      for (const handler of this.errorHandlers) {
        handler(error instanceof Error ? error : new Error(String(error)));
      }
    } finally {
      for (const handler of this.closeHandlers) {
        handler();
      }
    }
  }

  async close(): Promise<void> {
    this.eventSource?.close();
    this.eventSource = null;
  }

  async send(message: object): Promise<void> {
    const url = this.sessionUrl || this.url.toString();
    const fetchFn = this.options?.fetch || fetch;

    // Get auth token if available
    let authHeader: Record<string, string> = {};
    if (this.options?.authProvider) {
      const tokens = await this.options.authProvider.tokens();
      if (tokens) {
        authHeader = { Authorization: `Bearer ${tokens.access_token}` };
      }
    }

    const response = await fetchFn(url, {
      method: 'POST',
      ...this.options?.requestInit,
      headers: {
        'Content-Type': 'application/json',
        ...this.options?.requestInit?.headers,
        ...authHeader,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Send failed: ${response.status}`);
    }
  }

  onMessage(handler: (msg: object) => void): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: (err: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}

/**
 * HTTP Client Transport for Streamable HTTP communication.
 * Original: kX0 in chunks.131.mjs
 *
 * Uses HTTP POST for both directions with session management.
 */
class HttpClientTransport implements McpTransport {
  private sessionUrl: string | null = null;
  private messageHandlers: ((msg: object) => void)[] = [];
  private errorHandlers: ((err: Error) => void)[] = [];
  private closeHandlers: (() => void)[] = [];

  constructor(
    private url: URL,
    private options?: {
      authProvider?: { tokens(): Promise<{ access_token: string } | null> };
      fetch?: typeof fetch;
      requestInit?: RequestInit;
    }
  ) {}

  async start(): Promise<void> {
    // HTTP transport doesn't need persistent connection
    // Session is established on first request
  }

  async close(): Promise<void> {
    // Send close notification if session exists
    if (this.sessionUrl) {
      try {
        await this.send({ jsonrpc: '2.0', method: 'close' });
      } catch {
        // Ignore close errors
      }
    }
    this.sessionUrl = null;

    for (const handler of this.closeHandlers) {
      handler();
    }
  }

  async send(message: object): Promise<void> {
    const url = this.sessionUrl || this.url.toString();
    const fetchFn = this.options?.fetch || fetch;

    // Get auth token if available
    let authHeader: Record<string, string> = {};
    if (this.options?.authProvider) {
      const tokens = await this.options.authProvider.tokens();
      if (tokens) {
        authHeader = { Authorization: `Bearer ${tokens.access_token}` };
      }
    }

    const response = await fetchFn(url, {
      method: 'POST',
      ...this.options?.requestInit,
      headers: {
        'Content-Type': 'application/json',
        ...this.options?.requestInit?.headers,
        ...authHeader,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationRequiredError('Authentication required');
      }
      throw new Error(`HTTP request failed: ${response.status}`);
    }

    // Parse session URL from response if present
    const sessionHeader = response.headers.get('X-MCP-Session-URL');
    if (sessionHeader) {
      this.sessionUrl = sessionHeader;
    }

    // Parse response
    const responseData = await response.json();
    if (responseData) {
      for (const handler of this.messageHandlers) {
        handler(responseData);
      }
    }
  }

  onMessage(handler: (msg: object) => void): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: (err: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}

/**
 * WebSocket Client Transport for bidirectional communication.
 * Original: JZ1 in chunks.131.mjs
 */
class WebSocketClientTransport implements McpTransport {
  private messageHandlers: ((msg: object) => void)[] = [];
  private errorHandlers: ((err: Error) => void)[] = [];
  private closeHandlers: (() => void)[] = [];

  constructor(private ws: WebSocket) {}

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Wait for WebSocket to open
      if (this.ws.readyState === WebSocket.OPEN) {
        this.setupHandlers();
        resolve();
        return;
      }

      this.ws.onopen = () => {
        this.setupHandlers();
        resolve();
      };

      this.ws.onerror = (event) => {
        reject(new Error(`WebSocket error: ${event}`));
      };
    });
  }

  private setupHandlers(): void {
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        for (const handler of this.messageHandlers) {
          handler(message);
        }
      } catch {
        // Ignore invalid JSON
      }
    };

    this.ws.onerror = (event) => {
      for (const handler of this.errorHandlers) {
        handler(new Error(`WebSocket error: ${event}`));
      }
    };

    this.ws.onclose = () => {
      for (const handler of this.closeHandlers) {
        handler();
      }
    };
  }

  async close(): Promise<void> {
    this.ws.close();
  }

  async send(message: object): Promise<void> {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    this.ws.send(JSON.stringify(message));
  }

  onMessage(handler: (msg: object) => void): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: (err: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}

// ============================================
// Error Types
// ============================================

/**
 * Error thrown when authentication is required.
 */
class AuthenticationRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationRequiredError';
  }
}

// ============================================
// MCP Client Implementation
// ============================================

/**
 * MCP Client for server communication.
 * Original: PG1 in chunks.131.mjs
 */
class MCPClientImpl implements McpClient {
  private transport: McpTransport | null = null;
  private capabilities: McpServerCapabilities = {};
  private serverVersion: string | undefined;
  private instructions: string | undefined;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private notificationHandlers = new Map<string, () => Promise<void>>();
  private _onerror: ((err: Error) => void) | undefined;
  private _onclose: (() => void) | undefined;

  constructor(
    private clientInfo: {
      name: string;
      version: string;
    },
    private _clientCapabilities: {
      capabilities: {
        roots?: object;
      };
    }
  ) {}

  get onerror(): ((err: Error) => void) | undefined {
    return this._onerror;
  }

  set onerror(handler: ((err: Error) => void) | undefined) {
    this._onerror = handler;
  }

  get onclose(): (() => void) | undefined {
    return this._onclose;
  }

  set onclose(handler: (() => void) | undefined) {
    this._onclose = handler;
  }

  async connect(transport: McpTransport): Promise<void> {
    this.transport = transport;

    // Setup message handler
    transport.onMessage((message: unknown) => {
      this.handleMessage(message as { id?: number; method?: string; result?: unknown; error?: { message: string } });
    });

    transport.onError((err: Error) => {
      this._onerror?.(err);
    });

    transport.onClose(() => {
      this._onclose?.();
    });

    await transport.start();

    // Perform MCP handshake
    const initResult = await this.request<{
      capabilities: McpServerCapabilities;
      serverInfo?: { version?: string };
      instructions?: string;
    }>({
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        clientInfo: this.clientInfo,
        capabilities: this._clientCapabilities.capabilities,
      },
    });

    this.capabilities = initResult.capabilities || {};
    this.serverVersion = initResult.serverInfo?.version;
    this.instructions = initResult.instructions;

    // Send initialized notification
    await this.notify('notifications/initialized', {});
  }

  private handleMessage(message: { id?: number; method?: string; result?: unknown; error?: { message: string } }): void {
    // Handle response to our request
    if (message.id !== undefined && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);

      if (message.error) {
        pending.reject(new Error(message.error.message));
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    // Handle notification from server
    if (message.method) {
      const handler = this.notificationHandlers.get(message.method);
      if (handler) {
        handler().catch((err) => {
          this._onerror?.(err instanceof Error ? err : new Error(String(err)));
        });
      }
    }
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.transport = null;
  }

  getServerCapabilities(): McpServerCapabilities {
    return this.capabilities;
  }

  getServerVersion(): string | undefined {
    return this.serverVersion;
  }

  getInstructions(): string | undefined {
    return this.instructions;
  }

  async request<T>(params: { method: string; params?: object }, _schema?: object): Promise<T> {
    if (!this.transport) {
      throw new Error('Not connected');
    }

    const id = ++this.requestId;

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve: resolve as (v: unknown) => void, reject });

      this.transport!.send({
        jsonrpc: '2.0',
        id,
        method: params.method,
        params: params.params,
      }).catch(reject);
    });
  }

  async notify(method: string, params: object): Promise<void> {
    if (!this.transport) {
      throw new Error('Not connected');
    }

    await this.transport.send({
      jsonrpc: '2.0',
      method,
      params,
    });
  }

  async callTool(
    params: { name: string; arguments: Record<string, unknown>; _meta?: object },
    _schema?: object,
    options?: { signal?: AbortSignal; timeout?: number }
  ): Promise<{ isError?: boolean; content?: unknown[]; error?: string }> {
    const result = await Promise.race([
      this.request<{ isError?: boolean; content?: unknown[]; error?: string }>({
        method: 'tools/call',
        params: {
          name: params.name,
          arguments: params.arguments,
          _meta: params._meta,
        },
      }),
      ...(options?.timeout
        ? [
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Tool call timed out')), options.timeout)
            ),
          ]
        : []),
    ]);

    return result;
  }

  async getPrompt(params: {
    name: string;
    arguments?: Record<string, string>;
  }): Promise<{ messages: Array<{ role: string; content: unknown }> }> {
    return this.request({
      method: 'prompts/get',
      params,
    });
  }

  setNotificationHandler(type: string, handler: () => Promise<void>): void {
    this.notificationHandlers.set(type, handler);
  }

  setRequestHandler(type: string, handler: () => Promise<unknown>): void {
    // Request handlers would require more complex response handling
    // For now, treat as notification handler
    this.notificationHandlers.set(type, async () => {
      await handler();
    });
  }
}

// ============================================
// Auth Provider
// ============================================

/**
 * MCP Auth Provider for OAuth flows.
 * Original: I4A in chunks.131.mjs
 */
class McpAuthProvider {
  private tokenCache: { access_token: string } | null = null;

  constructor(
    private serverName: string,
    private config: McpServerConfig
  ) {}

  async tokens(): Promise<{ access_token: string } | null> {
    // Return cached token if available
    if (this.tokenCache) {
      return this.tokenCache;
    }

    // Check for token in config
    const sseConfig = this.config as { authToken?: string };
    if (sseConfig.authToken) {
      this.tokenCache = { access_token: sseConfig.authToken };
      return this.tokenCache;
    }

    // Would integrate with OAuth system for token retrieval
    return null;
  }
}

// ============================================
// Connection Timeout
// ============================================

/**
 * Create a timeout promise.
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Connection timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Get connection timeout from environment or default.
 * Original: jF1 in chunks.131.mjs
 */
function getConnectionTimeout(): number {
  const envTimeout = process.env.MCP_CONNECTION_TIMEOUT_MS;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return MCP_CONSTANTS.CONNECTION_TIMEOUT;
}

// ============================================
// Server Connection
// ============================================

/**
 * Get user agent string.
 * Original: VQA in chunks.131.mjs
 */
function getUserAgent(): string {
  return 'claude-code/2.1.7';
}

/**
 * Log MCP debug message.
 */
function logMcpDebug(serverName: string, message: string): void {
  if (process.env.MCP_DEBUG) {
    console.log(`[MCP:${serverName}] ${message}`);
  }
}

/**
 * Log MCP warning.
 */
function logMcpWarning(serverName: string, message: unknown): void {
  if (process.env.MCP_DEBUG) {
    console.warn(`[MCP:${serverName}] Warning:`, message);
  }
}

// Connection cache key generator
function getConnectionCacheKey(serverName: string, config: McpServerConfig): string {
  return `${serverName}:${JSON.stringify(config)}`;
}

// Connection cache
const connectionCache = new Map<string, Promise<McpServerConnection>>();

/**
 * Connect to a single MCP server.
 * Original: SO (connectMcpServer) in chunks.131.mjs:1563-1900
 *
 * Supports multiple transport types:
 * - stdio: Local process via stdin/stdout
 * - sse: Server-Sent Events
 * - http: Streamable HTTP
 * - ws: WebSocket
 * - sse-ide: SSE for IDE integration
 * - ws-ide: WebSocket for IDE integration
 */
export async function connectMcpServer(
  serverName: string,
  serverConfig: McpServerConfig,
  diagnostics?: McpBatchDiagnostics
): Promise<McpServerConnection> {
  const startTime = Date.now();

  // Check cache
  const cacheKey = getConnectionCacheKey(serverName, serverConfig);
  const cached = connectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Apply environment variable substitution
  const config = substituteEnvVariables(serverConfig);

  const connectionPromise = (async (): Promise<McpServerConnection> => {
    let transport: McpTransport;

    try {
      // Create transport based on type
      const type = 'type' in config ? (config as { type: string }).type : 'stdio';

      switch (type) {
        case 'sse': {
          const sseConfig = config as { url: string; headers?: Record<string, string>; authToken?: string };
          logMcpDebug(serverName, 'SSE transport initialized, awaiting connection');

          transport = new SSEClientTransport(new URL(sseConfig.url), {
            authProvider: new McpAuthProvider(serverName, config),
            requestInit: {
              headers: {
                'User-Agent': getUserAgent(),
                ...(sseConfig.headers || {}),
              },
            },
          });
          break;
        }

        case 'sse-ide': {
          const sseIdeConfig = config as { url: string };
          logMcpDebug(serverName, `Setting up SSE-IDE transport to ${sseIdeConfig.url}`);
          transport = new SSEClientTransport(new URL(sseIdeConfig.url));
          break;
        }

        case 'http': {
          const httpConfig = config as { url: string; headers?: Record<string, string> };
          logMcpDebug(serverName, `Initializing HTTP transport to ${httpConfig.url}`);

          transport = new HttpClientTransport(new URL(httpConfig.url), {
            authProvider: new McpAuthProvider(serverName, config),
            requestInit: {
              headers: {
                'User-Agent': getUserAgent(),
                ...(httpConfig.headers || {}),
              },
            },
          });
          break;
        }

        case 'ws':
        case 'ws-ide': {
          const wsConfig = config as { url: string; headers?: Record<string, string>; authToken?: string };
          logMcpDebug(serverName, `Initializing WebSocket transport to ${wsConfig.url}`);

          // In real implementation, would use ws library
          // For now, throw unsupported error
          throw new Error('WebSocket transport requires ws library');
        }

        case 'stdio':
        default: {
          const stdioConfig = config as {
            command: string;
            args?: string[];
            env?: Record<string, string>;
          };

          // Support shell prefix override
          const command = process.env.CLAUDE_CODE_SHELL_PREFIX || stdioConfig.command;
          const args = process.env.CLAUDE_CODE_SHELL_PREFIX
            ? [[stdioConfig.command, ...(stdioConfig.args || [])].join(' ')]
            : stdioConfig.args;

          transport = new StdioClientTransport({
            command,
            args,
            env: { ...process.env, ...(stdioConfig.env || {}) } as Record<string, string>,
            stderr: 'pipe',
          });
          break;
        }
      }

      // Setup stderr handler for stdio transport
      if (type === 'stdio' || !type) {
        const stdioTransport = transport as StdioClientTransport;
        if (stdioTransport.stderr) {
          stdioTransport.stderr.on('data', (data: Buffer) => {
            const message = data.toString().trim();
            if (message) {
              logMcpWarning(serverName, `Server stderr: ${message}`);
            }
          });
        }
      }

      // Create MCP client and connect with timeout
      const client = new MCPClientImpl(
        {
          name: 'claude-code',
          version: '2.1.7',
        },
        {
          capabilities: {
            roots: {},
          },
        }
      );

      // Connect with timeout
      logMcpDebug(serverName, `Starting connection with timeout of ${getConnectionTimeout()}ms`);

      await Promise.race([
        client.connect(transport),
        createTimeoutPromise(getConnectionTimeout()),
      ]);

      const connectionDuration = Date.now() - startTime;
      logMcpDebug(serverName, `Successfully connected to ${type} server in ${connectionDuration}ms`);

      // Get capabilities
      const capabilities = client.getServerCapabilities();
      const serverVersion = client.getServerVersion();
      const instructions = client.getInstructions();

      logMcpDebug(
        serverName,
        `Connection established with capabilities: ${JSON.stringify({
          hasTools: !!capabilities?.tools,
          hasPrompts: !!capabilities?.prompts,
          hasResources: !!capabilities?.resources,
          serverVersion: serverVersion || 'unknown',
        })}`
      );

      // Create cleanup function
      const cleanup = async (): Promise<void> => {
        try {
          await client.close();
        } catch (err) {
          logMcpDebug(serverName, `Error closing client: ${err}`);
        }
        connectionCache.delete(cacheKey);
      };

      const result: McpConnectedServer = {
        type: 'connected',
        name: serverName,
        client,
        capabilities: capabilities ?? {},
        serverInfo: serverVersion,
        instructions,
        config,
        cleanup,
      };

      return result;
    } catch (error) {
      const connectionDuration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      logMcpDebug(serverName, `Connection failed after ${connectionDuration}ms: ${errorMessage}`);

      // Remove from cache on failure
      connectionCache.delete(cacheKey);

      // Check if auth is required
      if (error instanceof AuthenticationRequiredError) {
        const needsAuth: McpNeedsAuthServer = {
          type: 'needs-auth',
          name: serverName,
          config,
        };
        return needsAuth;
      }

      const failed: McpFailedServer = {
        type: 'failed',
        name: serverName,
        config,
        error: errorMessage,
      };
      return failed;
    }
  })();

  connectionCache.set(cacheKey, connectionPromise);
  return connectionPromise;
}

// ============================================
// Batch Initialization
// ============================================

/**
 * Get batch size from environment.
 * Original: Uses MCP_SERVER_CONNECTION_BATCH_SIZE
 */
function getBatchSize(): number {
  const envSize = process.env.MCP_SERVER_CONNECTION_BATCH_SIZE;
  if (envSize) {
    const parsed = parseInt(envSize, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return MCP_CONSTANTS.DEFAULT_BATCH_SIZE;
}

/**
 * Process items in batches with concurrency limit.
 * Original: Vr2 (batchProcessWithLimit) in chunks.131.mjs
 */
async function batchProcessWithLimit<T, R>(
  items: T[],
  limit: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = processor(item).then((result) => {
      results.push(result);
    });

    executing.push(p as Promise<void>);

    if (executing.length >= limit) {
      await Promise.race(executing);
      // Remove completed promises
      for (let i = executing.length - 1; i >= 0; i--) {
        const promise = executing[i];
        const isResolved = await Promise.race([
          promise.then(() => true),
          Promise.resolve(false),
        ]);
        if (isResolved) {
          executing.splice(i, 1);
        }
      }
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Batch initialize all MCP servers.
 * Original: EL0 (batchInitializeAllServers) in chunks.131.mjs:1175-1240
 */
export async function batchInitializeAllServers(
  onServerConnected: McpServerConnectedCallback,
  serverConfigs: Record<string, McpServerConfig>
): Promise<void> {
  // Group servers by transport type for diagnostics
  const serverEntries = Object.entries(serverConfigs);
  const totalServers = serverEntries.length;

  const diagnostics: McpBatchDiagnostics = {
    totalServers,
    stdioCount: serverEntries.filter(
      ([_, c]) => !('type' in c) || (c as { type?: string }).type === 'stdio'
    ).length,
    sseCount: serverEntries.filter(([_, c]) => 'type' in c && (c as { type: string }).type === 'sse').length,
    httpCount: serverEntries.filter(([_, c]) => 'type' in c && (c as { type: string }).type === 'http').length,
    sseIdeCount: serverEntries.filter(
      ([_, c]) => 'type' in c && (c as { type: string }).type === 'sse-ide'
    ).length,
    wsIdeCount: serverEntries.filter(
      ([_, c]) => 'type' in c && (c as { type: string }).type === 'ws-ide'
    ).length,
  };

  // Process servers with concurrency limit
  await batchProcessWithLimit(
    serverEntries,
    getBatchSize(),
    async ([serverName, serverConfig]) => {
      try {
        // Skip disabled servers
        if (isServerDisabled(serverName)) {
          const disabled: McpDisabledServer = {
            type: 'disabled',
            name: serverName,
            config: serverConfig,
          };
          onServerConnected({
            client: disabled,
            tools: [],
            commands: [],
          });
          return;
        }

        // Connect to server
        const clientConnection = await connectMcpServer(
          serverName,
          serverConfig,
          diagnostics
        );

        if (clientConnection.type !== 'connected') {
          onServerConnected({
            client: clientConnection,
            tools: [],
            commands: [],
          });
          return;
        }

        // Fetch capabilities in parallel
        const hasResources = !!clientConnection.capabilities?.resources;
        const [tools, commands, resources] = await Promise.all([
          fetchMcpTools(clientConnection),
          fetchMcpPrompts(clientConnection),
          hasResources ? fetchMcpResources(clientConnection) : Promise.resolve([]),
        ]);

        onServerConnected({
          client: clientConnection,
          tools,
          commands,
          resources: resources.length > 0 ? resources : undefined,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[MCP] ${serverName}: Error: ${errorMessage}`);

        const failed: McpFailedServer = {
          type: 'failed',
          name: serverName,
          config: serverConfig,
          error: errorMessage,
        };
        onServerConnected({
          client: failed,
          tools: [],
          commands: [],
        });
      }
    }
  );
}

// ============================================
// Reconnection
// ============================================

/**
 * Reconnect a failed or disconnected server.
 * Original: C3A (reconnectMcpServer) in chunks.131.mjs:1125-1166
 */
export async function reconnectMcpServer(
  serverName: string,
  serverConfig: McpServerConfig
): Promise<McpServerConnectionResult> {
  // Clear cache for this server
  const cacheKey = getConnectionCacheKey(serverName, serverConfig);
  connectionCache.delete(cacheKey);

  // Attempt connection
  const newConnection = await connectMcpServer(serverName, serverConfig);

  if (newConnection.type !== 'connected') {
    return {
      client: newConnection,
      tools: [],
      commands: [],
    };
  }

  // Fetch all capabilities
  const hasResources = !!newConnection.capabilities?.resources;
  const [tools, commands, resources] = await Promise.all([
    fetchMcpTools(newConnection),
    fetchMcpPrompts(newConnection),
    hasResources ? fetchMcpResources(newConnection) : Promise.resolve([]),
  ]);

  return {
    client: newConnection,
    tools,
    commands,
    resources: resources.length > 0 ? resources : undefined,
  };
}

// ============================================
// Connection State Management
// ============================================

/**
 * Ensure server is connected, reconnecting if necessary.
 * Original: eKA (ensureServerConnected) in chunks.131.mjs
 */
export async function ensureServerConnected(
  serverConnection: McpServerConnection
): Promise<McpConnectedServer> {
  if (serverConnection.type === 'connected') {
    return serverConnection;
  }

  throw new Error(
    `Server ${serverConnection.name} is not connected (status: ${serverConnection.type})`
  );
}

// ============================================
// Export
// ============================================

export {
  connectMcpServer,
  batchInitializeAllServers,
  reconnectMcpServer,
  ensureServerConnected,
  createTimeoutPromise,
  getBatchSize,
  getConnectionTimeout,
  StdioClientTransport,
  SSEClientTransport,
  HttpClientTransport,
  WebSocketClientTransport,
  MCPClientImpl,
  AuthenticationRequiredError,
};
