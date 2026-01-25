/**
 * @claudecode/integrations - Chrome Native Host Bridge
 *
 * Implements the bridge between Chrome Extension and Claude Code CLI.
 * Reconstructed from chunks.157.mjs (QI9, BI9, oX9, AI9)
 */

import net from 'net';
import fs from 'fs';
import { CHROME_CONSTANTS } from './types.js';
import type { SocketMessage, SocketClientContext } from './types.js';
import { getSocketPath, createSocketClient, ChromeSocketClient } from './socket-client.js';
import { handleChromeToolCall, CHROME_TOOL_DEFINITIONS } from './tools.js';

/**
 * Utility to log native host events.
 * Original: FW in chunks.157.mjs:1647
 */
function logNativeHost(message: string, ...args: any[]): void {
  // Original uses a specialized logger, we'll use console.error for bridge debugging if needed
  // console.error(`[Claude Chrome Native Host] ${message}`, ...args);
}

/**
 * Send message to Chrome extension via stdout.
 * Original: C$A in chunks.157.mjs:1660
 */
function sendNativeMessage(message: any): void {
  const jsonStr = JSON.stringify(message);
  const buffer = Buffer.from(jsonStr, 'utf-8');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(buffer.length, 0);
  process.stdout.write(lengthBuffer);
  process.stdout.write(buffer);
}

/**
 * Reads Native Messaging input from Chrome extension.
 * Original: BI9 (StdinReader) in chunks.157.mjs:1818-1858
 */
export class StdinReader {
  private buffer = Buffer.alloc(0);
  private pendingResolve: ((message: string | null) => void) | null = null;
  private closed = false;

  constructor() {
    process.stdin.on('data', (data) => {
      this.buffer = Buffer.concat([this.buffer, data]);
      this.tryProcessMessage();
    });
    
    process.stdin.on('end', () => {
      this.closed = true;
      if (this.pendingResolve) {
        this.pendingResolve(null);
        this.pendingResolve = null;
      }
    });

    process.stdin.on('error', () => {
      this.closed = true;
      if (this.pendingResolve) {
        this.pendingResolve(null);
        this.pendingResolve = null;
      }
    });
  }

  private tryProcessMessage(): void {
    if (!this.pendingResolve) return;
    if (this.buffer.length < 4) return;

    const length = this.buffer.readUInt32LE(0);
    if (length === 0 || length > CHROME_CONSTANTS.MAX_MESSAGE_SIZE) {
      logNativeHost(`Invalid message length: ${length}`);
      this.pendingResolve(null);
      this.pendingResolve = null;
      return;
    }

    if (this.buffer.length < 4 + length) return;

    const payload = this.buffer.subarray(4, 4 + length);
    this.buffer = this.buffer.subarray(4 + length);
    const message = payload.toString('utf-8');
    
    const resolve = this.pendingResolve;
    this.pendingResolve = null;
    resolve(message);
  }

  async read(): Promise<string | null> {
    if (this.closed) return null;
    
    // Check if we already have a complete message in buffer
    if (this.buffer.length >= 4) {
      const length = this.buffer.readUInt32LE(0);
      if (length > 0 && length <= CHROME_CONSTANTS.MAX_MESSAGE_SIZE && this.buffer.length >= 4 + length) {
        const payload = this.buffer.subarray(4, 4 + length);
        this.buffer = this.buffer.subarray(4 + length);
        return payload.toString('utf-8');
      }
    }

    return new Promise((resolve) => {
      this.pendingResolve = resolve;
      this.tryProcessMessage();
    });
  }
}

/**
 * Socket server that listens for MCP client connections and bridges to Chrome extension.
 * Original: QI9 (NativeHostServer) in chunks.157.mjs:1679-1816
 */
export class NativeHostServer {
  private mcpClients = new Map<number, { id: number; socket: net.Socket; buffer: Buffer }>();
  private nextClientId = 1;
  private server: net.Server | null = null;
  private running = false;

  async start(): Promise<void> {
    if (this.running) return;
    
    const socketPath = getSocketPath();
    logNativeHost(`Creating socket listener: ${socketPath}`);

    if (process.platform !== 'win32' && fs.existsSync(socketPath)) {
      try {
        const stats = fs.statSync(socketPath);
        if (stats.isSocket()) {
          fs.unlinkSync(socketPath);
        }
      } catch (err) {}
    }

    this.server = net.createServer((socket) => this.handleMcpClient(socket));
    
    await new Promise<void>((resolve, reject) => {
      this.server!.listen(socketPath, () => {
        logNativeHost('Socket server listening for connections');
        
        if (process.platform !== 'win32') {
          try {
            fs.chmodSync(socketPath, 0o600);
            logNativeHost('Socket permissions set to 0600');
          } catch (err) {
            logNativeHost('Failed to set socket permissions:', err);
          }
        }
        
        this.running = true;
        resolve();
      });

      this.server!.on('error', (err) => {
        logNativeHost('Socket server error:', err);
        reject(err);
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.running) return;

    for (const [, client] of this.mcpClients) {
      client.socket.destroy();
    }
    this.mcpClients.clear();

    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
      this.server = null;
    }

    const socketPath = getSocketPath();
    if (process.platform !== 'win32' && fs.existsSync(socketPath)) {
      try {
        fs.unlinkSync(socketPath);
        logNativeHost('Cleaned up socket file');
      } catch (err) {}
    }

    this.running = false;
  }

  async handleMessage(rawMessage: string): Promise<void> {
    let message: any;
    try {
      message = JSON.parse(rawMessage);
    } catch (err) {
      logNativeHost('Failed to parse extension message:', err);
      return;
    }

    logNativeHost(`Handling Chrome message type: ${message.type}`);

    switch (message.type) {
      case 'ping':
        logNativeHost('Responding to ping');
        sendNativeMessage({
          type: 'pong',
          timestamp: Date.now()
        });
        break;

      case 'get_status':
        sendNativeMessage({
          type: 'status_response',
          native_host_version: '1.0.0'
        });
        break;

      case 'tool_response':
      case 'notification': {
        if (this.mcpClients.size > 0) {
          logNativeHost(`Forwarding ${message.type} to ${this.mcpClients.size} MCP clients`);
          
          // Prepare framed message
          const { type, ...payload } = message;
          const jsonStr = JSON.stringify(payload);
          const buffer = Buffer.from(jsonStr, 'utf-8');
          const lengthBuffer = Buffer.alloc(4);
          lengthBuffer.writeUInt32LE(buffer.length, 0);
          const framedMessage = Buffer.concat([lengthBuffer, buffer]);

          for (const [id, client] of this.mcpClients) {
            try {
              client.socket.write(framedMessage);
            } catch (err) {
              logNativeHost(`Failed to send to MCP client ${id}:`, err);
            }
          }
        }
        break;
      }

      default:
        logNativeHost(`Unknown message type: ${message.type}`);
        sendNativeMessage({
          type: 'error',
          error: `Unknown message type: ${message.type}`
        });
    }
  }

  private handleMcpClient(socket: net.Socket): void {
    const clientId = this.nextClientId++;
    const client = {
      id: clientId,
      socket,
      buffer: Buffer.alloc(0)
    };

    this.mcpClients.set(clientId, client);
    logNativeHost(`MCP client ${clientId} connected. Total clients: ${this.mcpClients.size}`);
    
    sendNativeMessage({ type: 'mcp_connected' });

    socket.on('data', (data) => {
      client.buffer = Buffer.concat([client.buffer, data]);
      
      while (client.buffer.length >= 4) {
        const length = client.buffer.readUInt32LE(0);
        if (length === 0 || length > CHROME_CONSTANTS.MAX_MESSAGE_SIZE) {
          logNativeHost(`Invalid message length from MCP client ${clientId}: ${length}`);
          socket.destroy();
          return;
        }

        if (client.buffer.length < 4 + length) break;

        const payload = client.buffer.slice(4, 4 + length);
        client.buffer = client.buffer.slice(4 + length);

        try {
          const request = JSON.parse(payload.toString('utf-8'));
          logNativeHost(`Forwarding tool request from MCP client ${clientId}: ${request.method}`);
          
          sendNativeMessage({
            type: 'tool_request',
            method: request.method,
            params: request.params
          });
        } catch (err) {
          logNativeHost(`Failed to parse tool request from MCP client ${clientId}:`, err);
        }
      }
    });

    socket.on('error', (err) => {
      logNativeHost(`MCP client ${clientId} error: ${err}`);
    });

    socket.on('close', () => {
      logNativeHost(`MCP client ${clientId} disconnected. Remaining clients: ${this.mcpClients.size - 1}`);
      this.mcpClients.delete(clientId);
      sendNativeMessage({ type: 'mcp_disconnected' });
    });
  }
}

/**
 * Create an MCP server instance for Chrome integration.
 * Original: PT0 in chunks.145.mjs:1093-1125
 */
export function createChromeMcpServer(context: SocketClientContext, McpServerClass: any) {
  const { serverName, logger } = context;
  const client = createSocketClient(context);
  
  // Create MCP server
  const server = new McpServerClass({
    name: serverName,
    version: '1.0.0'
  }, {
    capabilities: {
      tools: {},
      logging: {}
    }
  });

  // Register tool list handler
  // Using generic request handler identifiers if not imported
  const LIST_TOOLS_METHOD = 'tools/list'; // Original: DxA
  const CALL_TOOL_METHOD = 'tools/call';   // Original: n9A

  server.setRequestHandler(LIST_TOOLS_METHOD, async () => {
    // Note: In source, there's an isDisabled check here
    return {
      tools: CHROME_TOOL_DEFINITIONS
    };
  });

  // Register tool call handler
  server.setRequestHandler(CALL_TOOL_METHOD, async (request: any) => {
    logger.info(`[${serverName}] Executing tool: ${request.params.name}`);
    return await handleChromeToolCall(context, client, request.params.name, request.params.arguments || {});
  });

  // Forward notifications from socket bridge to MCP clients
  client.setNotificationHandler((notification: SocketMessage) => {
    logger.info(`[${serverName}] Forwarding MCP notification: ${notification.method}`);
    server.notification({
      method: notification.method,
      params: notification.params
    }).catch((err: any) => {
      logger.info(`[${serverName}] Failed to forward MCP notification: ${err.message}`);
    });
  });

  // Initial connection attempt
  client.ensureConnected().catch((err) => {
    logger.info(`[${serverName}] Initial socket connection failed:`, err);
  });

  return server;
}

/**
 * Entry point for starting the bridge server.
 * Original: AI9 in chunks.157.mjs:1666-1677
 */
export async function startNativeHostBridge(): Promise<void> {
  logNativeHost('Initializing Native Host Bridge...');
  const server = new NativeHostServer();
  const reader = new StdinReader();
  
  await server.start();
  
  while (true) {
    const message = await reader.read();
    if (message === null) break;
    await server.handleMessage(message);
  }
  
  await server.stop();
}

/**
 * Entry point for starting the MCP client.
 * Original: oX9 in chunks.157.mjs:1599-1616
 */
export async function startChromeMcpClient(McpServerClass: any, StdioServerTransportClass: any): Promise<void> {
  const logger = {
    debug: (...args: any[]) => console.error('[debug]', ...args),
    info: (...args: any[]) => console.error('[info]', ...args),
    warn: (...args: any[]) => console.error('[warn]', ...args),
    error: (...args: any[]) => console.error('[error]', ...args)
  };

  const context: SocketClientContext = {
    serverName: 'Claude in Chrome',
    logger,
    socketPath: getSocketPath(),
    clientTypeId: 'claude-code',
    onAuthenticationError: () => {
      logger.warn('Authentication error occurred. Please ensure you are logged into the Claude browser extension.');
    },
    onToolCallDisconnected: () => {
      return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (https://claude.ai/chrome). If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome`;
    }
  };

  const server = createChromeMcpServer(context, McpServerClass);
  const transport = new StdioServerTransportClass();
  
  console.error('[Claude in Chrome] Starting MCP server');
  await server.connect(transport);
  console.error('[Claude in Chrome] MCP server started');
}
