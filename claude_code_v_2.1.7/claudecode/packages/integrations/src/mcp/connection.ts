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
  McpSseServerConfig,
  McpSseIdeServerConfig,
  McpWsServerConfig,
  McpHttpServerConfig,
  McpServerConnection,
  McpConnectedServer,
  McpFailedServer,
  McpDisabledServer,
  McpNeedsAuthServer,
  McpServerCapabilities,
  McpClient,
  McpTransport,
  McpToolCallParams,
  McpToolResult,
  McpPromptParams,
  McpPromptResult,
  McpBatchDiagnostics,
  McpServerConnectionResult,
  McpServerConnectedCallback,
} from './types.js';
import { MCP_CONSTANTS } from './types.js';
import { isServerDisabled, substituteEnvVariables } from './config.js';
import {
  fetchMcpTools,
  fetchMcpPrompts,
  fetchMcpResources,
  listResourcesTool,
  readResourceTool,
} from './discovery.js';
import {
  getGlobalDispatcher,
  getMtlsCredentials,
  trackEvent,
  getUserAgent,
  getJwtToken,
  getHttpsAgentWithMtls,
  getProxyAgentForUrl,
} from '@claudecode/platform';
import { z } from 'zod';

// ============================================
// Internal Constants & Helpers
// ============================================

/**
 * Excluded IDE tools.
 * Original: oB7 in chunks.131.mjs:1562
 */
const EXCLUDED_IDE_TOOLS = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];

/**
 * Check if tool is valid (not excluded IDE tool).
 * Original: rB7 in chunks.131.mjs:1089
 */
export function isValidTool(tool: { name: string }): boolean {
  return !tool.name.startsWith("mcp__ide__") || EXCLUDED_IDE_TOOLS.includes(tool.name);
}

/**
 * Log MCP error.
 * Original: NZ in chunks.1.mjs:4618
 */
export function logMcpError(serverName: string, error: any): void {
  try {
    const et = (globalThis as any).ET;
    const h7a = (globalThis as any).H7A;
    if (et === null || et === undefined) {
      if (Array.isArray(h7a)) {
        h7a.push({
          type: "mcpError",
          serverName,
          error: error instanceof Error ? error.message : String(error)
        });
      }
      return;
    }
    et.logMCPError(serverName, error);
  } catch {}
}

/**
 * Log MCP debug message.
 * Original: i0 in chunks.1.mjs:4632
 */
export function logMcpDebug(serverName: string, message: string): void {
  try {
    const et = (globalThis as any).ET;
    const h7a = (globalThis as any).H7A;
    if (et === null || et === undefined) {
      if (Array.isArray(h7a)) {
        h7a.push({
          type: "mcpDebug",
          serverName,
          message
        });
      }
      return;
    }
    et.logMCPDebug(serverName, message);
  } catch {}
}

/**
 * Sanitize server name for display/id.
 * Original: e3 in chunks.131.mjs:60
 */
export function sanitizeServerName(name: string): string {
  let sanitized = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (name.startsWith("claude.ai ")) {
    sanitized = sanitized.replace(/_+/g, "_").replace(/^_|_$/g, "");
  }
  return sanitized;
}

/**
 * Connection cache key generator.
 * Original: FL0 in chunks.131.mjs:1093
 */
function getConnectionCacheKey(serverName: string, config: McpServerConfig, _diagnostics?: McpBatchDiagnostics): string {
  return `${serverName}-${JSON.stringify(config)}`;
}

/**
 * Simple memoization for async functions.
 * Original: W0 (_U1) in chunks.1.mjs:636
 */
export function memoize<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  resolver?: (...args: T) => string
): ((...args: T) => Promise<R>) & { cache: Map<string, R> } {
  const cache = new Map<string, R>();
  const memoized = async (...args: T): Promise<R> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args[0]);
    if (cache.has(key)) return cache.get(key)!;
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = cache;
  return memoized;
}

/**
 * Fetch wrapper with timeout.
 * Original: Wr2 in chunks.131.mjs:1050
 */
function withMcpTimeout(fetchFn: typeof fetch): typeof fetch {
  return async (url, options) => {
    if ((options?.method ?? "GET").toUpperCase() === "GET") return fetchFn(url, options);
    
    const timeout = 60000; // Fr2 in chunks.131.mjs:1507
    const signal = AbortSignal.timeout(timeout);
    
    if (!options?.signal) return fetchFn(url, { ...options, signal });
    
    const controller = new AbortController();
    const abort = () => controller.abort();
    
    options.signal.addEventListener("abort", abort);
    signal.addEventListener("abort", abort);
    
    const cleanup = () => {
      options.signal?.removeEventListener("abort", abort);
      signal.removeEventListener("abort", abort);
    };
    
    if (options.signal.aborted) controller.abort();
    
    try {
      const response = await fetchFn(url, { ...options, signal: controller.signal });
      cleanup();
      return response;
    } catch (err) {
      cleanup();
      throw err;
    }
  };
}

/**
 * Create fetch function with injected headers.
 * Original: Q4A in chunks.89.mjs:859
 */
function withDefaultFetchOptions(fetchFn: typeof fetch = fetch, extraHeaders?: any): typeof fetch {
  if (!extraHeaders) return fetchFn;
  return async (url, options) => {
    const mergedOptions = {
      ...extraHeaders,
      ...options,
      headers: (options?.headers) ? {
        ...(extraHeaders.headers || {}),
        ...(options.headers || {})
      } : extraHeaders.headers
    };
    return fetchFn(url, mergedOptions);
  };
}

/**
 * Get headers helper.
 * Original: _F1 in chunks.131.mjs:816
 */
async function getMcpHeaders(serverName: string, config: McpServerConfig): Promise<Record<string, string>> {
  const headers = (config as any).headers || {};
  const authHeaders = await getAuthHeaders(serverName, config) || {};
  return {
    ...headers,
    ...authHeaders
  };
}

/**
 * Get dynamic auth headers using headersHelper.
 * Original: mB7 in chunks.131.mjs:790
 */
async function getAuthHeaders(serverName: string, config: McpServerConfig): Promise<Record<string, string> | null> {
  const configObj = config as any;
  if (!configObj.headersHelper) return null;
  
  try {
    logMcpDebug(serverName, "Executing headersHelper to get dynamic headers");
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    // Original: J2 in chunks.131.mjs:800 (exec helper)
    const { stdout } = await (execAsync as any)(configObj.headersHelper, {
      shell: true,
      timeout: 10000,
      encoding: 'utf8'
    });
    
    if (!stdout) throw new Error(`headersHelper for MCP server '${serverName}' did not return a valid value`);
    
    const result = JSON.parse(stdout.trim());
    if (typeof result !== "object" || result === null || Array.isArray(result)) {
      throw new Error(`headersHelper for MCP server '${serverName}' must return a JSON object with string key-value pairs`);
    }
    
    for (const [key, value] of Object.entries(result)) {
      if (typeof value !== "string") {
        throw new Error(`headersHelper for MCP server '${serverName}' returned non-string value for key "${key}": ${typeof value}`);
      }
    }
    
    logMcpDebug(serverName, `Successfully retrieved ${Object.keys(result).length} headers from headersHelper`);
    return result as Record<string, string>;
  } catch (err) {
    logMcpError(serverName, `Error getting headers from headersHelper: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/**
 * Get connection timeout.
 * Original: jF1 in chunks.131.mjs:1046
 */
function getConnectionTimeout(): number {
  const envTimeout = process.env.MCP_TIMEOUT || process.env.MCP_CONNECTION_TIMEOUT;
  return envTimeout ? parseInt(envTimeout, 10) : 60000;
}

/**
 * Root list request schema.
 * Original: yY0 in chunks.86.mjs:1916
 */
const listRootsRequestSchema = z.object({
  method: z.literal("roots/list")
});

// ============================================
// Transport Implementations
// ============================================

/**
 * Stdio Client Transport for local process communication.
 * Original: KX0 in chunks.131.mjs
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

    this.process.stdout?.on('data', (data: Buffer) => {
      this.messageBuffer += data.toString();
      const lines = this.messageBuffer.split('\n');
      this.messageBuffer = lines.pop() || '';
      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            for (const handler of this.messageHandlers) handler(message);
          } catch {}
        }
      }
    });

    this.process.on('error', (err: Error) => {
      for (const handler of this.errorHandlers) handler(err);
    });

    this.process.on('close', () => {
      for (const handler of this.closeHandlers) handler();
    });
  }

  async close(): Promise<void> {
    if (!this.process || !this.pid) return;
    try {
      process.kill(this.pid, 'SIGINT');
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          try { process.kill(this.pid!, 'SIGTERM'); } catch {}
          setTimeout(() => {
            try { process.kill(this.pid!, 'SIGKILL'); } catch {}
            resolve();
          }, 400);
        }, 100);
        this.process?.on('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    } catch {}
    this.process = null;
  }

  async send(message: object): Promise<void> {
    if (!this.process?.stdin?.writable) throw new Error('Transport not connected');
    this.process.stdin.write(JSON.stringify(message) + '\n');
  }

  onMessage(handler: (msg: object) => void): void { this.messageHandlers.push(handler); }
  onError(handler: (err: Error) => void): void { this.errorHandlers.push(handler); }
  onClose(handler: () => void): void { this.closeHandlers.push(handler); }
}

/**
 * SSE Client Transport for Server-Sent Events communication.
 * Original: rG1 in chunks.131.mjs
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
    const fetchFn = this.options?.eventSourceInit?.fetch || fetch;
    const response = await fetchFn(this.url.toString(), {
      ...this.options?.requestInit,
      headers: {
        ...this.options?.requestInit?.headers,
        Accept: 'text/event-stream',
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new AuthenticationRequiredError('Authentication required');
      throw new Error(`SSE connection failed: ${response.status}`);
    }

    const sessionHeader = response.headers.get('X-MCP-Session-URL');
    if (sessionHeader) this.sessionUrl = sessionHeader;

    const reader = response.body?.getReader();
    if (reader) this.processSSEStream(reader);
  }

  private async processSSEStream(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const event of events) {
          const dataMatch = event.match(/^data: (.+)$/m);
          if (dataMatch) {
            try {
              const payload = dataMatch[1];
              if (!payload) continue;
              const message = JSON.parse(payload);
              for (const handler of this.messageHandlers) handler(message);
            } catch {}
          }
        }
      }
    } catch (error) {
      for (const handler of this.errorHandlers) handler(error instanceof Error ? error : new Error(String(error)));
    } finally {
      for (const handler of this.closeHandlers) handler();
    }
  }

  async close(): Promise<void> {
    this.eventSource?.close();
    this.eventSource = null;
  }

  async send(message: object): Promise<void> {
    const url = this.sessionUrl || this.url.toString();
    const fetchFn = this.options?.fetch || fetch;
    let authHeader: Record<string, string> = {};
    if (this.options?.authProvider) {
      const tokens = await this.options.authProvider.tokens();
      if (tokens) authHeader = { Authorization: `Bearer ${tokens.access_token}` };
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
    if (!response.ok) throw new Error(`Send failed: ${response.status}`);
  }

  onMessage(handler: (msg: object) => void): void { this.messageHandlers.push(handler); }
  onError(handler: (err: Error) => void): void { this.errorHandlers.push(handler); }
  onClose(handler: () => void): void { this.closeHandlers.push(handler); }
}

/**
 * HTTP Client Transport for Streamable HTTP communication.
 * Original: kX0 in chunks.131.mjs
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

  async start(): Promise<void> {}

  async close(): Promise<void> {
    if (this.sessionUrl) {
      try { await this.send({ jsonrpc: '2.0', method: 'close' }); } catch {}
    }
    this.sessionUrl = null;
    for (const handler of this.closeHandlers) handler();
  }

  async send(message: object): Promise<void> {
    const url = this.sessionUrl || this.url.toString();
    const fetchFn = this.options?.fetch || fetch;
    let authHeader: Record<string, string> = {};
    if (this.options?.authProvider) {
      const tokens = await this.options.authProvider.tokens();
      if (tokens) authHeader = { Authorization: `Bearer ${tokens.access_token}` };
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
      if (response.status === 401) throw new AuthenticationRequiredError('Authentication required');
      throw new Error(`HTTP request failed: ${response.status}`);
    }
    const sessionHeader = response.headers.get('X-MCP-Session-URL');
    if (sessionHeader) this.sessionUrl = sessionHeader;
    const responseData = await response.json();
    if (responseData) {
      for (const handler of this.messageHandlers) handler(responseData);
    }
  }

  onMessage(handler: (msg: object) => void): void { this.messageHandlers.push(handler); }
  onError(handler: (err: Error) => void): void { this.errorHandlers.push(handler); }
  onClose(handler: () => void): void { this.closeHandlers.push(handler); }
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
      if (this.ws.readyState === (globalThis.WebSocket as any).OPEN) {
        this.setupHandlers();
        resolve();
        return;
      }
      this.ws.onopen = () => { this.setupHandlers(); resolve(); };
      this.ws.onerror = (event) => reject(new Error(`WebSocket error: ${event}`));
    });
  }

  private setupHandlers(): void {
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        for (const handler of this.messageHandlers) handler(message);
      } catch {}
    };
    this.ws.onerror = (event) => {
      for (const handler of this.errorHandlers) handler(new Error(`WebSocket error: ${event}`));
    };
    this.ws.onclose = () => {
      for (const handler of this.closeHandlers) handler();
    };
  }

  async close(): Promise<void> { this.ws.close(); }

  async send(message: object): Promise<void> {
    if (this.ws.readyState !== (globalThis.WebSocket as any).OPEN) throw new Error('WebSocket not connected');
    this.ws.send(JSON.stringify(message));
  }

  onMessage(handler: (msg: object) => void): void { this.messageHandlers.push(handler); }
  onError(handler: (err: Error) => void): void { this.errorHandlers.push(handler); }
  onClose(handler: () => void): void { this.closeHandlers.push(handler); }
}

/**
 * Error thrown when authentication is required.
 */
class AuthenticationRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationRequiredError';
  }
}

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
  private requestHandlers = new Map<string, (params: any) => Promise<unknown>>();
  private _onerror: ((err: Error) => void) | undefined;
  private _onclose: (() => void) | undefined;

  constructor(
    private clientInfo: { name: string; version: string; },
    private _clientCapabilities: { capabilities: { roots?: object; }; }
  ) {}

  get onerror(): ((err: Error) => void) | undefined { return this._onerror; }
  set onerror(handler: ((err: Error) => void) | undefined) { this._onerror = handler; }
  get onclose(): (() => void) | undefined { return this._onclose; }
  set onclose(handler: (() => void) | undefined) { this._onclose = handler; }

  async connect(transport: McpTransport): Promise<void> {
    this.transport = transport;
    transport.onMessage?.((message: any) => this.handleMessage(message));
    transport.onError?.((err: Error) => this._onerror?.(err));
    transport.onClose?.(() => this._onclose?.());
    await transport.start();
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
    await this.notify('notifications/initialized', {});
  }

  private handleMessage(message: { id?: number; method?: string; result?: unknown; error?: { message: string }; params?: any }): void {
    if (message.id !== undefined && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
      return;
    }
    if (message.method && message.id !== undefined) {
      const handler = this.requestHandlers.get(message.method);
      if (handler) {
        handler(message.params).then((result) => {
          this.transport?.send({ jsonrpc: '2.0', id: message.id, result }).catch(() => {});
        }).catch((error) => {
          this.transport?.send({
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32603, message: error instanceof Error ? error.message : String(error) }
          }).catch(() => {});
        });
        return;
      }
    }
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

  getServerCapabilities(): McpServerCapabilities { return this.capabilities; }
  getServerVersion(): string | undefined { return this.serverVersion; }
  getInstructions(): string | undefined { return this.instructions; }

  async request<T>(params: { method: string; params?: object }, _schema?: object): Promise<T> {
    if (!this.transport) throw new Error('Not connected');
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
    if (!this.transport) throw new Error('Not connected');
    await this.transport.send({ jsonrpc: '2.0', method, params, });
  }

  async callTool(
    params: McpToolCallParams,
    _schema?: object,
    options?: { signal?: AbortSignal; timeout?: number }
  ): Promise<McpToolResult> {
    const result = await Promise.race([
      this.request<McpToolResult>({
        method: 'tools/call',
        params: {
          name: params.name,
          arguments: params.arguments,
          _meta: params._meta,
        },
      }),
      ...(options?.timeout
        ? [new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Tool call timed out')), options.timeout)
          )]
        : []),
    ]);
    return result;
  }

  async getPrompt(params: McpPromptParams): Promise<McpPromptResult> {
    return this.request<McpPromptResult>({ method: 'prompts/get', params, });
  }

  setNotificationHandler(type: string, handler: () => Promise<void>): void {
    this.notificationHandlers.set(type, handler);
  }

  setRequestHandler<T extends z.ZodTypeAny>(schema: T, handler: (params: z.infer<T>) => Promise<unknown>): void {
    const method = (schema as any).shape?.method?.value || (schema as any)._def?.innerType?.shape?.method?.value;
    if (method) this.requestHandlers.set(method, handler);
  }
}

/**
 * MCP Auth Provider for OAuth flows.
 * Original: I4A in chunks.90.mjs:991
 */
class McpAuthProvider {
  private tokenCache: { access_token: string } | null = null;
  constructor(private serverName: string, private config: McpServerConfig) {}
  async tokens(): Promise<{ access_token: string } | null> {
    if (this.tokenCache) return this.tokenCache;
    const sseConfig = this.config as { authToken?: string };
    if (sseConfig.authToken) {
      this.tokenCache = { access_token: sseConfig.authToken };
      return this.tokenCache;
    }
    return null;
  }
}

/**
 * Create a timeout promise.
 */
export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Connection timed out after ${ms}ms`));
    }, ms);
  });
}

// ============================================
// Server Connection
// ============================================

/**
 * Connect to a single MCP server.
 * Original: SO (connectMcpServer) in chunks.131.mjs:1563-1900
 */
export const connectMcpServer = memoize(async (
  serverName: string,
  serverConfig: McpServerConfig,
  batchDiagnostics?: McpBatchDiagnostics
): Promise<McpServerConnection> => {
  const startTime = Date.now();
  const config = substituteEnvVariables(serverConfig);

  try {
    let transport: McpTransport;
    const type = 'type' in config ? (config as { type: string }).type : 'stdio';
    // Original: Y = G4A() in chunks.131.mjs:1566 (Session JWT)
    const sessionAuthToken = getJwtToken();

    if (type === "sse") {
      const sseConfig = config as McpSseServerConfig;
      const authProvider = new McpAuthProvider(serverName, config);
      const headers = await getMcpHeaders(serverName, config);
      const options = {
        authProvider,
        fetch: withMcpTimeout(withDefaultFetchOptions(fetch, { headers })),
        requestInit: {
          headers: {
            "User-Agent": getUserAgent(),
            ...headers
          }
        },
        eventSourceInit: {
          fetch: async (url: string, init?: any) => {
            const auth: Record<string, string> = {};
            const tokens = await authProvider.tokens();
            if (tokens) auth.Authorization = `Bearer ${tokens.access_token}`;
            const proxy = getGlobalDispatcher();
            return fetch(url, {
              ...init,
              ...proxy,
              headers: {
                "User-Agent": getUserAgent(),
                ...auth,
                ...init?.headers,
                ...headers,
                Accept: "text/event-stream"
              }
            });
          }
        }
      };
      transport = new SSEClientTransport(new URL(sseConfig.url), options);
      logMcpDebug(serverName, "SSE transport initialized, awaiting connection");
    } else if (type === "sse-ide") {
      const sseIdeConfig = config as McpSseIdeServerConfig;
      logMcpDebug(serverName, `Setting up SSE-IDE transport to ${sseIdeConfig.url}`);
      const proxy = getGlobalDispatcher();
      const options = (proxy as any).dispatcher ? {
        eventSourceInit: {
          fetch: async (url: string, init?: any) => {
            return fetch(url, {
              ...init,
              ...proxy,
              headers: {
                "User-Agent": getUserAgent(),
                ...init?.headers
              }
            });
          }
        }
      } : {};
      transport = new SSEClientTransport(new URL(sseIdeConfig.url), Object.keys(options).length > 0 ? options : undefined);
    } else if (type === "ws-ide") {
      const wsIdeConfig = config as McpWsServerConfig;
      const mtls = getMtlsCredentials();
      const options = {
        headers: {
          "User-Agent": getUserAgent(),
          ...(wsIdeConfig as any).authToken && {
            "X-Claude-Code-Ide-Authorization": (wsIdeConfig as any).authToken
          }
        },
        agent: getProxyAgentForUrl(wsIdeConfig.url),
        ...mtls
      };
      const ws = new (globalThis.WebSocket as any)(wsIdeConfig.url, ["mcp"], Object.keys(options).length > 0 ? options : undefined);
      transport = new WebSocketClientTransport(ws);
    } else if (type === "ws") {
      const wsConfig = config as McpWsServerConfig;
      logMcpDebug(serverName, `Initializing WebSocket transport to ${wsConfig.url}`);
      const headers = await getMcpHeaders(serverName, config);
      const mtls = getMtlsCredentials();
      const options = {
        headers: {
          "User-Agent": getUserAgent(),
          ...sessionAuthToken && {
            Authorization: `Bearer ${sessionAuthToken}`
          },
          ...headers
        },
        agent: getProxyAgentForUrl(wsConfig.url),
        ...mtls
      };
      const redacted = Object.fromEntries(Object.entries(options.headers).map(([k, v]) => k.toLowerCase() === "authorization" ? [k, "[REDACTED]"] : [k, v]));
      logMcpDebug(serverName, `WebSocket transport options: ${JSON.stringify({url:wsConfig.url, headers:redacted, hasSessionAuth:!!sessionAuthToken})}`);
      const ws = new (globalThis.WebSocket as any)(wsConfig.url, ["mcp"], Object.keys(options).length > 0 ? options : undefined);
      transport = new WebSocketClientTransport(ws);
    } else if (type === "http") {
      const httpConfig = config as McpHttpServerConfig;
      logMcpDebug(serverName, `Initializing HTTP transport to ${httpConfig.url}`);
      const authProvider = new McpAuthProvider(serverName, config);
      const headers = await getMcpHeaders(serverName, config);
      const proxy = getGlobalDispatcher();
      const options = {
        authProvider,
        fetch: withMcpTimeout(withDefaultFetchOptions(fetch, { headers })),
        requestInit: {
          ...proxy,
          headers: {
            "User-Agent": getUserAgent(),
            ...sessionAuthToken && {
              Authorization: `Bearer ${sessionAuthToken}`
            },
            ...headers
          }
        }
      };
      const redacted = options.requestInit?.headers ? Object.fromEntries(Object.entries(options.requestInit.headers as any).map(([k, v]) => k.toLowerCase() === "authorization" ? [k, "[REDACTED]"] : [k, v])) : undefined;
      logMcpDebug(serverName, `HTTP transport options: ${JSON.stringify({url:httpConfig.url, headers:redacted, hasAuthProvider:!!authProvider, timeoutMs: 60000})}`);
      transport = new HttpClientTransport(new URL(httpConfig.url), options);
      logMcpDebug(serverName, "HTTP transport created successfully");
    } else if (type === "stdio" || !type) {
      const command = process.env.CLAUDE_CODE_SHELL_PREFIX || (config as any).command;
      const args = process.env.CLAUDE_CODE_SHELL_PREFIX ? [[(config as any).command, ...(config as any).args].join(" ")] : (config as any).args;
      transport = new StdioClientTransport({
        command,
        args,
        env: {
          ...process.env,
          ...(config as any).env
        },
        stderr: "pipe"
      });
    } else {
      throw Error(`Unsupported server type: ${type}`);
    }

    let stderrHandler: ((data: any) => void) | undefined;
    if (type === "stdio" || !type) {
      const stdio = transport as StdioClientTransport;
      if (stdio.stderr) {
        stderrHandler = (data: any) => {
          const msg = data.toString().trim();
          if (msg) logMcpError(serverName, `Server stderr: ${msg}`);
        };
        stdio.stderr.on("data", stderrHandler);
      }
    }

    const client = new MCPClientImpl({
      name: "claude-code",
      version: "2.1.7"
    }, {
      capabilities: {
        roots: {}
      }
    });

    if (type === "http") logMcpDebug(serverName, "Client created, setting up request handler");
    client.setRequestHandler(listRootsRequestSchema, async () => {
      logMcpDebug(serverName, "Received ListRoots request from server");
      return {
        roots: [{
          uri: `file://${process.cwd()}`
        }]
      };
    });

    logMcpDebug(serverName, `Starting connection with timeout of ${getConnectionTimeout()}ms`);
    
    const connectTask = client.connect(transport);
    const timeoutTask = new Promise<void>((_, reject) => {
      const timer = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        logMcpDebug(serverName, `Connection timeout triggered after ${elapsed}ms (limit: ${getConnectionTimeout()}ms)`);
        reject(Error(`Connection to MCP server "${serverName}" timed out after ${getConnectionTimeout()}ms`));
      }, getConnectionTimeout());
      connectTask.then(() => clearTimeout(timer)).catch(() => clearTimeout(timer));
    });

    try {
      await Promise.race([connectTask, timeoutTask]);
      logMcpDebug(serverName, `Successfully connected to ${type} server in ${Date.now() - startTime}ms`);
    } catch (err) {
      if ((type === "sse" || type === "http") && err instanceof Error) {
        if ((err as any).status === 401 || err.name === "AuthenticationRequiredError") {
          trackEvent("tengu_mcp_server_needs_auth", {});
          logMcpDebug(serverName, "Authentication required for server");
          return {
            name: serverName,
            type: "needs-auth",
            config
          };
        }
      }
      throw err;
    }

    const capabilities = client.getServerCapabilities();
    const version = client.getServerVersion();
    const instructions = client.getInstructions();

    logMcpDebug(serverName, `Connection established with capabilities: ${JSON.stringify({hasTools:!!capabilities?.tools, hasPrompts:!!capabilities?.prompts, hasResources:!!capabilities?.resources, serverVersion:version||"unknown"})}`);

    if (type === "sse-ide" || type === "ws-ide") {
      trackEvent("tengu_mcp_ide_server_connection_succeeded", {
        connectionDurationMs: Date.now() - startTime,
        serverVersion: version
      });
      try { (client as any).notify("notifications/ide_connected", {}); } catch {}
    }

    let uptimeStart = Date.now();
    let hasError = false;
    const originalOnError = client.onerror;
    const originalOnClose = client.onclose;
    let consecutiveErrors = 0;

    client.onerror = (err: Error) => {
      hasError = true;
      const uptime = Math.floor((Date.now() - uptimeStart) / 1000);
      logMcpDebug(serverName, `${(type || "stdio").toUpperCase()} connection dropped after ${uptime}s uptime: ${err.message}`);
      
      const isTerminal = (msg: string) => /ECONNRESET|ETIMEDOUT|EPIPE|EHOSTUNREACH|ECONNREFUSED|Body Timeout Error|terminated/.test(msg);
      if (type === "sse" || type === "http") {
        if (isTerminal(err.message)) {
          consecutiveErrors++;
          if (consecutiveErrors >= 3) {
            logMcpDebug(serverName, "Max consecutive errors reached, triggering reconnection");
            consecutiveErrors = 0;
            client.onclose?.();
          }
        } else {
          consecutiveErrors = 0;
        }
      }
      if (originalOnError) originalOnError(err);
    };

    client.onclose = () => {
      const uptime = Math.floor((Date.now() - uptimeStart) / 1000);
      logMcpDebug(serverName, `${(type || "unknown").toUpperCase()} connection closed after ${uptime}s (${hasError ? "with errors" : "cleanly"})`);
      connectMcpServer.cache.delete(getConnectionCacheKey(serverName, serverConfig));
      logMcpDebug(serverName, "Cleared connection cache for reconnection");
      if (originalOnClose) originalOnClose();
    };

    const cleanup = async () => {
      if (stderrHandler && (type === "stdio" || !type)) (transport as StdioClientTransport).stderr?.off("data", stderrHandler);
      if (type === "stdio") {
        const pid = (transport as StdioClientTransport).pid;
        if (pid) {
          logMcpDebug(serverName, "Sending SIGINT to MCP server process");
          try {
            process.kill(pid, "SIGINT");
            await new Promise<void>(r => {
              let done = false;
              const interval = setInterval(() => {
                try { process.kill(pid, 0); } catch { if (!done) { done = true; clearInterval(interval); r(); } }
              }, 50);
              setTimeout(() => {
                if (!done) {
                  done = true;
                  clearInterval(interval);
                  try { process.kill(pid, "SIGKILL"); } catch {}
                  r();
                }
              }, 600);
            });
          } catch {}
        }
      }
      await client.close();
    };

    trackEvent("tengu_mcp_server_connection_succeeded", {
      connectionDurationMs: Date.now() - startTime,
      transportType: type,
      ...batchDiagnostics
    });

    return {
      type: "connected",
      name: serverName,
      client,
      capabilities: capabilities ?? {},
      serverInfo: version,
      instructions,
      config,
      cleanup
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : String(err);
    trackEvent("tengu_mcp_server_connection_failed", {
      connectionDurationMs: duration,
      transportType: (config as any).type,
      ...batchDiagnostics
    });
    logMcpDebug(serverName, `Connection failed after ${duration}ms: ${msg}`);
    logMcpError(serverName, `Connection failed: ${msg}`);
    connectMcpServer.cache.delete(getConnectionCacheKey(serverName, serverConfig));
    return {
      name: serverName,
      type: "failed",
      config,
      error: msg
    };
  }
}, getConnectionCacheKey);

/**
 * Check MCP server health by attempting a connection.
 * Original: EL9 in chunks.156.mjs:1688
 */
export async function checkServerHealth(serverName: string, config: McpServerConfig): Promise<string> {
  try {
    const conn = await connectMcpServer(serverName, config);
    if (conn.type === 'connected') {
      if (typeof (conn as any).cleanup === 'function') await (conn as any).cleanup();
      else (conn as any).client.close();
      return '✓ Connected';
    } else if (conn.type === 'needs-auth') return '⚠ Needs authentication';
    else return '✗ Failed to connect';
  } catch (err) {
    return `✗ Connection error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// ============================================
// Batch Initialization
// ============================================

/**
 * Get batch size from environment.
 */
function getBatchSize(): number {
  const envSize = process.env.MCP_SERVER_CONNECTION_BATCH_SIZE;
  if (envSize) {
    const parsed = parseInt(envSize, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return MCP_CONSTANTS.DEFAULT_BATCH_SIZE;
}

/**
 * Process items in batches with concurrency limit (sequential batches).
 * Original: Vr2 in chunks.131.mjs:1168
 */
async function batchProcessWithLimit<T, R>(
  items: T[],
  limit: number,
  processor: (item: T) => Promise<R>
): Promise<void> {
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    await Promise.all(batch.map(processor));
  }
}

/**
 * Check if server type is local (stdio or sdk).
 * Original: Kr2 in chunks.131.mjs:1085
 */
function isLocalServer(config: McpServerConfig): boolean {
  const type = (config as any).type;
  return !type || type === "stdio" || type === "sdk";
}

/**
 * Batch initialize all MCP servers.
 * Original: EL0 (batchInitializeAllServers) in chunks.131.mjs:1175-1240
 */
export async function batchInitializeAllServers(
  onServerConnected: McpServerConnectedCallback,
  serverConfigs: Record<string, McpServerConfig>
): Promise<void> {
  let resourcesInitialized = false;
  const serverEntries = Object.entries(serverConfigs);
  const totalServers = serverEntries.length;
  const batchDiagnostics: McpBatchDiagnostics = {
    totalServers,
    stdioCount: serverEntries.filter(([_, c]) => (c as any).type === 'stdio').length,
    sseCount: serverEntries.filter(([_, c]) => (c as any).type === 'sse').length,
    httpCount: serverEntries.filter(([_, c]) => (c as any).type === 'http').length,
    sseIdeCount: serverEntries.filter(([_, c]) => (c as any).type === 'sse-ide').length,
    wsIdeCount: serverEntries.filter(([_, c]) => (c as any).type === 'ws-ide').length,
  };

  const localServers = serverEntries.filter(([_, c]) => isLocalServer(c));
  const remoteServers = serverEntries.filter(([_, c]) => !isLocalServer(c));

  const processServer = async ([serverName, serverConfig]: [string, McpServerConfig]) => {
    try {
      if (isServerDisabled(serverName)) {
        onServerConnected({ client: { name: serverName, type: 'disabled', config: serverConfig }, tools: [], commands: [] });
        return;
      }
      const clientConnection = await connectMcpServer(serverName, serverConfig, batchDiagnostics);
      if (clientConnection.type !== 'connected') {
        onServerConnected({ client: clientConnection, tools: [], commands: [] });
        return;
      }
      const hasResources = !!clientConnection.capabilities?.resources;
      const [tools, commands, resources] = await Promise.all([
        fetchMcpTools(clientConnection),
        fetchMcpPrompts(clientConnection),
        hasResources ? fetchMcpResources(clientConnection) : Promise.resolve([]),
      ]);
      const baseResourceTools: any[] = [];
      if (hasResources && !resourcesInitialized) {
        resourcesInitialized = true;
        baseResourceTools.push(listResourcesTool, readResourceTool);
      }
      onServerConnected({ client: clientConnection, tools: [...tools, ...baseResourceTools], commands, resources: resources.length > 0 ? resources : undefined });
    } catch (error) {
      logMcpError(serverName, `Error fetching tools/commands/resources: ${error instanceof Error ? error.message : String(error)}`);
      onServerConnected({ client: { name: serverName, type: 'failed', config: serverConfig, error: error instanceof Error ? error.message : String(error) } as McpFailedServer, tools: [], commands: [] });
    }
  };

  const localBatchSize = parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3;
  const remoteBatchSize = parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 20;

  await Promise.all([
    batchProcessWithLimit(localServers, localBatchSize, processServer),
    batchProcessWithLimit(remoteServers, remoteBatchSize, processServer),
  ]);
}

/**
 * Reconnect a failed or disconnected server.
 * Original: C3A (reconnectMcpServer) in chunks.131.mjs:1125-1166
 */
export async function reconnectMcpServer(
  serverName: string,
  serverConfig: McpServerConfig
): Promise<McpServerConnectionResult> {
  try {
    const cacheKey = getConnectionCacheKey(serverName, serverConfig);
    const cached = connectMcpServer.cache.get(cacheKey);
    if (cached) {
      try {
        const conn = await cached;
        if (conn.type === 'connected' && (conn as any).cleanup) await (conn as any).cleanup();
      } catch {}
    }
    connectMcpServer.cache.delete(cacheKey);
    const newConnection = await connectMcpServer(serverName, serverConfig);
    if (newConnection.type !== 'connected') return { client: newConnection, tools: [], commands: [] };
    const hasResources = !!newConnection.capabilities?.resources;
    const [tools, commands, resources] = await Promise.all([
      fetchMcpTools(newConnection),
      fetchMcpPrompts(newConnection),
      hasResources ? fetchMcpResources(newConnection) : Promise.resolve([]),
    ]);
    const baseResourceTools: any[] = [];
    if (hasResources) {
      baseResourceTools.push(listResourcesTool, readResourceTool);
    }
    return { client: newConnection, tools: [...tools, ...baseResourceTools], commands, resources: resources.length > 0 ? resources : undefined };
  } catch (error) {
    logMcpError(serverName, `Error during reconnection: ${error instanceof Error ? error.message : String(error)}`);
    return { client: { name: serverName, type: 'failed', config: serverConfig, error: error instanceof Error ? error.message : String(error) } as McpFailedServer, tools: [], commands: [] };
  }
}

/**
 * Ensure server is connected, reconnecting if necessary.
 * Original: eKA (ensureServerConnected) in chunks.131.mjs
 */
export async function ensureServerConnected(
  serverConnection: McpServerConnection
): Promise<McpConnectedServer> {
  if (serverConnection.type === 'connected') return serverConnection;
  throw new Error(`Server ${serverConnection.name} is not connected (status: ${serverConnection.type})`);
}
