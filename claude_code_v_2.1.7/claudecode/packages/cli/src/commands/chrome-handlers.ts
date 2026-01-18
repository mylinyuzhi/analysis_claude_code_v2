/**
 * @claudecode/cli - Chrome Handlers
 *
 * Handlers for Chrome integration modes:
 * - Chrome MCP server mode (--claude-in-chrome-mcp)
 * - Chrome native host mode (--chrome-native-host)
 *
 * Reconstructed from chunks.157.mjs
 *
 * Key symbols:
 * - oX9 → claudeInChromeMcp
 * - AI9 → chromeNativeHostMain
 * - QI9 → NativeHostServer
 * - BI9 → StdinReader
 */

import * as net from 'net';
import * as path from 'path';
import * as os from 'os';

// ============================================
// Types
// ============================================

/**
 * Native messaging format (4-byte length prefix + JSON).
 */
interface NativeMessage {
  type: string;
  id?: string;
  payload?: unknown;
}

/**
 * Chrome MCP request.
 */
interface ChromeMcpRequest {
  method: string;
  params?: Record<string, unknown>;
  id?: string | number;
}

/**
 * Chrome MCP response.
 */
interface ChromeMcpResponse {
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
  id?: string | number;
}

// ============================================
// Constants
// ============================================

const SOCKET_FILENAME = 'claude-in-chrome.sock';

/**
 * Get socket path for Chrome communication.
 */
function getSocketPath(): string {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows uses named pipes
    return `\\\\.\\pipe\\claude-in-chrome`;
  }

  // Unix uses domain sockets
  const tmpDir = os.tmpdir();
  return path.join(tmpDir, SOCKET_FILENAME);
}

// ============================================
// Native Messaging Protocol
// ============================================

/**
 * Read a message from native messaging stream.
 * Original: BI9 (StdinReader) in chunks.157.mjs
 *
 * Native messaging format:
 * - 4 bytes: message length (little-endian uint32)
 * - N bytes: JSON payload
 */
async function readNativeMessage(stream: NodeJS.ReadableStream): Promise<NativeMessage | null> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    let messageLength = -1;

    const onData = (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);

      // Read length prefix if not yet read
      if (messageLength === -1 && buffer.length >= 4) {
        messageLength = buffer.readUInt32LE(0);
        buffer = buffer.slice(4);
      }

      // Read message if we have enough data
      if (messageLength > 0 && buffer.length >= messageLength) {
        const messageData = buffer.slice(0, messageLength);
        buffer = buffer.slice(messageLength);
        messageLength = -1;

        try {
          const message = JSON.parse(messageData.toString('utf-8'));
          stream.removeListener('data', onData);
          stream.removeListener('end', onEnd);
          stream.removeListener('error', onError);
          resolve(message);
        } catch (error) {
          reject(new Error(`Failed to parse native message: ${error}`));
        }
      }
    };

    const onEnd = () => {
      resolve(null);
    };

    const onError = (error: Error) => {
      reject(error);
    };

    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onError);
  });
}

/**
 * Write a message in native messaging format.
 */
function writeNativeMessage(stream: NodeJS.WritableStream, message: unknown): void {
  const json = JSON.stringify(message);
  const jsonBuffer = Buffer.from(json, 'utf-8');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);

  stream.write(lengthBuffer);
  stream.write(jsonBuffer);
}

// ============================================
// Chrome MCP Server
// ============================================

/**
 * Handle Chrome MCP server mode.
 * Original: oX9 (claudeInChromeMcp) in chunks.157.mjs
 *
 * This starts an MCP server that the Chrome extension can connect to
 * via the native host bridge.
 */
export async function handleChromeMcp(): Promise<void> {
  const socketPath = getSocketPath();

  // Clean up existing socket
  try {
    const fs = await import('fs');
    if (fs.existsSync(socketPath)) {
      fs.unlinkSync(socketPath);
    }
  } catch {
    // Ignore cleanup errors
  }

  // Create MCP server
  const server = net.createServer((socket) => {
    console.error('Chrome MCP: Client connected');

    let buffer = Buffer.alloc(0);

    socket.on('data', async (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      // Process complete messages
      while (buffer.length >= 4) {
        const messageLength = buffer.readUInt32LE(0);
        if (buffer.length < 4 + messageLength) {
          break; // Wait for more data
        }

        const messageData = buffer.slice(4, 4 + messageLength);
        buffer = buffer.slice(4 + messageLength);

        try {
          const request: ChromeMcpRequest = JSON.parse(messageData.toString('utf-8'));
          const response = await handleMcpRequest(request);
          sendMcpResponse(socket, response);
        } catch (error) {
          const errorResponse: ChromeMcpResponse = {
            error: {
              code: -32700,
              message: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
            },
          };
          sendMcpResponse(socket, errorResponse);
        }
      }
    });

    socket.on('close', () => {
      console.error('Chrome MCP: Client disconnected');
    });

    socket.on('error', (error) => {
      console.error('Chrome MCP: Socket error:', error.message);
    });
  });

  server.listen(socketPath, () => {
    console.error(`Chrome MCP: Server listening on ${socketPath}`);
  });

  // Handle shutdown
  process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });

  // Keep process running
  await new Promise(() => {});
}

/**
 * Send MCP response.
 */
function sendMcpResponse(socket: net.Socket, response: ChromeMcpResponse): void {
  const json = JSON.stringify(response);
  const jsonBuffer = Buffer.from(json, 'utf-8');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);

  socket.write(lengthBuffer);
  socket.write(jsonBuffer);
}

/**
 * Handle MCP request.
 */
async function handleMcpRequest(request: ChromeMcpRequest): Promise<ChromeMcpResponse> {
  const { method, params, id } = request;

  switch (method) {
    case 'initialize':
      return {
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
          },
          serverInfo: {
            name: 'claude-in-chrome',
            version: '2.1.7',
          },
        },
      };

    case 'tools/list':
      return {
        id,
        result: {
          tools: getChromeMcpTools(),
        },
      };

    case 'tools/call':
      return {
        id,
        result: await executeChromeTool(params as { name: string; arguments: Record<string, unknown> }),
      };

    default:
      return {
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

/**
 * Get Chrome MCP tool definitions.
 */
function getChromeMcpTools(): unknown[] {
  return [
    {
      name: 'tabs_context_mcp',
      description: 'Get information about current browser tabs',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'open_url_mcp',
      description: 'Open a URL in a new browser tab',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to open' },
        },
        required: ['url'],
      },
    },
    {
      name: 'click_mcp',
      description: 'Click an element on the page',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector of element to click' },
          tabId: { type: 'number', description: 'Tab ID' },
        },
        required: ['selector', 'tabId'],
      },
    },
    {
      name: 'fill_mcp',
      description: 'Fill a form field',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector of input element' },
          value: { type: 'string', description: 'Value to fill' },
          tabId: { type: 'number', description: 'Tab ID' },
        },
        required: ['selector', 'value', 'tabId'],
      },
    },
    {
      name: 'screenshot_mcp',
      description: 'Capture a screenshot of the page',
      inputSchema: {
        type: 'object',
        properties: {
          tabId: { type: 'number', description: 'Tab ID' },
          fullPage: { type: 'boolean', description: 'Capture full page' },
        },
        required: ['tabId'],
      },
    },
    // More tools would be defined here...
  ];
}

/**
 * Chrome extension client connection.
 */
let chromeExtensionClient: net.Socket | null = null;
let pendingRequests = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}>();

/**
 * Set Chrome extension client.
 */
export function setChromeExtensionClient(client: net.Socket | null): void {
  chromeExtensionClient = client;
}

/**
 * Execute a Chrome tool by forwarding to the extension.
 */
async function executeChromeTool(
  params: { name: string; arguments: Record<string, unknown> }
): Promise<unknown> {
  // If no extension connected, return error
  if (!chromeExtensionClient || !chromeExtensionClient.writable) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Chrome extension not connected. Cannot execute tool: ${params.name}`,
        },
      ],
    };
  }

  // Generate request ID
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Create promise for response
  const responsePromise = new Promise<unknown>((resolve, reject) => {
    pendingRequests.set(requestId, { resolve, reject });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        reject(new Error(`Tool execution timeout: ${params.name}`));
      }
    }, 30000);
  });

  // Send request to extension
  const request = {
    type: 'tool_call',
    id: requestId,
    name: params.name,
    arguments: params.arguments,
  };

  const json = JSON.stringify(request);
  const jsonBuffer = Buffer.from(json, 'utf-8');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);

  chromeExtensionClient.write(lengthBuffer);
  chromeExtensionClient.write(jsonBuffer);

  // Wait for response
  try {
    const result = await responsePromise;
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Handle tool response from Chrome extension.
 */
export function handleToolResponse(requestId: string, result: unknown, error?: string): void {
  const pending = pendingRequests.get(requestId);
  if (pending) {
    pendingRequests.delete(requestId);
    if (error) {
      pending.reject(new Error(error));
    } else {
      pending.resolve(result);
    }
  }
}

// ============================================
// Chrome Native Host
// ============================================

/**
 * Handle Chrome native host mode.
 * Original: AI9 (chromeNativeHostMain) in chunks.157.mjs
 *
 * This process:
 * 1. Reads native messaging from Chrome extension (stdin)
 * 2. Forwards to MCP server (socket)
 * 3. Returns responses via native messaging (stdout)
 */
export async function handleChromeNative(): Promise<void> {
  console.error('Chrome Native Host: Starting');

  const socketPath = getSocketPath();
  let mcpSocket: net.Socket | null = null;

  // Connect to MCP server
  try {
    mcpSocket = net.createConnection(socketPath);
    console.error(`Chrome Native Host: Connected to MCP server at ${socketPath}`);
  } catch (error) {
    console.error('Chrome Native Host: Failed to connect to MCP server:', error);
    // Continue without MCP connection - we'll handle locally
  }

  // Read messages from Chrome extension
  while (true) {
    try {
      const message = await readNativeMessage(process.stdin);
      if (!message) {
        // Stream closed
        break;
      }

      console.error('Chrome Native Host: Received message:', message.type);

      // Process message
      let response: unknown;

      if (mcpSocket && mcpSocket.writable) {
        // Forward to MCP server
        response = await forwardToMcp(mcpSocket, message);
      } else {
        // Handle locally
        response = await handleLocalMessage(message);
      }

      // Send response
      writeNativeMessage(process.stdout, response);
    } catch (error) {
      console.error('Chrome Native Host: Error:', error);

      // Send error response
      writeNativeMessage(process.stdout, {
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Cleanup
  if (mcpSocket) {
    mcpSocket.end();
  }
  console.error('Chrome Native Host: Shutting down');
}

/**
 * Forward message to MCP server.
 */
async function forwardToMcp(socket: net.Socket, message: NativeMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('MCP request timeout'));
    }, 30000);

    // Send message
    const json = JSON.stringify(message.payload || message);
    const jsonBuffer = Buffer.from(json, 'utf-8');
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);

    socket.write(lengthBuffer);
    socket.write(jsonBuffer);

    // Wait for response
    let buffer = Buffer.alloc(0);

    const onData = (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);

      if (buffer.length >= 4) {
        const messageLength = buffer.readUInt32LE(0);
        if (buffer.length >= 4 + messageLength) {
          clearTimeout(timeout);
          socket.removeListener('data', onData);

          const responseData = buffer.slice(4, 4 + messageLength);
          try {
            const response = JSON.parse(responseData.toString('utf-8'));
            resolve({
              type: 'mcp_response',
              id: message.id,
              payload: response,
            });
          } catch (error) {
            reject(new Error(`Failed to parse MCP response: ${error}`));
          }
        }
      }
    };

    socket.on('data', onData);
  });
}

/**
 * Handle message locally (when MCP server unavailable).
 */
async function handleLocalMessage(message: NativeMessage): Promise<unknown> {
  switch (message.type) {
    case 'ping':
      return { type: 'pong', id: message.id };

    case 'version':
      return {
        type: 'version_response',
        id: message.id,
        version: '2.1.7',
      };

    default:
      return {
        type: 'error',
        id: message.id,
        error: `Unknown message type: ${message.type}`,
      };
  }
}

// ============================================
// Export
// ============================================

export { getSocketPath, readNativeMessage, writeNativeMessage };
