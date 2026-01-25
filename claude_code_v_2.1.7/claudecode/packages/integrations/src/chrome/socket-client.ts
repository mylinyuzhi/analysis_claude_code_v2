/**
 * @claudecode/integrations - Chrome Socket Client
 *
 * Socket client for communicating with Chrome native host.
 * Reconstructed from chunks.145.mjs (AZ9)
 */

import net from 'net';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { CHROME_CONSTANTS } from './types.js';
import type { SocketMessage, SocketClientContext } from './types.js';

/**
 * Get socket path for Chrome communication.
 * Original: sfA in chunks.145.mjs:1085
 */
export function getSocketPath(): string {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows uses named pipes
    return `\\\\.\\pipe\\claude-in-chrome`;
  }

  // Unix uses domain sockets in temp directory
  return path.join(os.tmpdir(), 'claude-in-chrome.sock');
}

/**
 * Socket connection error class.
 * Original: z8A in chunks.145.mjs:979
 */
export class SocketConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocketConnectionError';
  }
}

/**
 * Socket client for Chrome native host communication.
 * Original: AZ9 (SocketClient) in chunks.145.mjs:787-970
 */
export class ChromeSocketClient {
  private socket: net.Socket | null = null;
  private connected = false;
  private connecting = false;
  private responseCallback: ((response: any) => void) | null = null;
  private notificationHandler: ((notification: SocketMessage) => void) | null = null;
  private responseBuffer = Buffer.alloc(0);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private context: SocketClientContext;

  constructor(context: SocketClientContext) {
    this.context = context;
  }

  async connect(): Promise<void> {
    const { serverName, logger } = this.context;
    
    if (this.connecting) {
      logger.info(`[${serverName}] Already connecting, skipping duplicate attempt`);
      return;
    }

    this.closeSocket();
    this.connecting = true;
    const socketPath = this.context.socketPath;
    logger.info(`[${serverName}] Attempting to connect to: ${socketPath}`);

    try {
      await this.validateSocketSecurity(socketPath);
    } catch (error) {
      this.connecting = false;
      logger.info(`[${serverName}] Security validation failed:`, error);
      return;
    }

    this.socket = net.createConnection(socketPath);
    
    this.socket.on('connect', () => {
      this.connected = true;
      this.connecting = false;
      this.reconnectAttempts = 0;
      logger.info(`[${serverName}] Successfully connected to bridge server`);
    });

    this.socket.on('data', (data) => {
      this.responseBuffer = Buffer.concat([this.responseBuffer, data]);
      
      while (this.responseBuffer.length >= 4) {
        const length = this.responseBuffer.readUInt32LE(0);
        if (this.responseBuffer.length < 4 + length) break;
        
        const payload = this.responseBuffer.slice(4, 4 + length);
        this.responseBuffer = this.responseBuffer.slice(4 + length);
        
        try {
          const message = JSON.parse(payload.toString('utf-8'));
          
          // Check if it's a notification (has method)
          if (message && typeof message.method === 'string') {
            logger.info(`[${serverName}] Received notification: ${message.method}`);
            if (this.notificationHandler) this.notificationHandler(message);
          } 
          // Check if it's a response (has result or error)
          else if (message && ('result' in message || 'error' in message)) {
            logger.info(`[${serverName}] Received tool response: ${JSON.stringify(message)}`);
            this.handleResponse(message);
          } 
          else {
            logger.info(`[${serverName}] Received unknown message: ${JSON.stringify(message)}`);
          }
        } catch (error) {
          logger.info(`[${serverName}] Failed to parse message:`, error);
        }
      }
    });

    this.socket.on('error', (error: any) => {
      logger.info(`[${serverName}] Socket error:`, error);
      this.connected = false;
      this.connecting = false;
      if (error.code && ['ECONNREFUSED', 'ECONNRESET', 'EPIPE'].includes(error.code)) {
        this.scheduleReconnect();
      }
    });

    this.socket.on('close', () => {
      this.connected = false;
      this.connecting = false;
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect(): void {
    const { serverName, logger } = this.context;
    
    if (this.reconnectTimer) {
      logger.info(`[${serverName}] Reconnect already scheduled, skipping`);
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.info(`[${serverName}] Max reconnection attempts reached`);
      this.cleanup();
      return;
    }

    this.reconnectAttempts++;
    // Exponential backoff: base * 1.5^(attempt-1), capped at 30s
    const delay = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
    
    logger.info(`[${serverName}] Reconnecting in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private handleResponse(response: any): void {
    if (this.responseCallback) {
      const callback = this.responseCallback;
      this.responseCallback = null;
      callback(response);
    }
  }

  setNotificationHandler(handler: (notification: SocketMessage) => void): void {
    this.notificationHandler = handler;
  }

  async ensureConnected(): Promise<boolean> {
    const { serverName } = this.context;
    
    if (this.connected && this.socket) return true;
    if (!this.socket && !this.connecting) await this.connect();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new SocketConnectionError(`[${serverName}] Connection attempt timed out after 5000ms`));
      }, 5000);

      const check = () => {
        if (this.connected) {
          clearTimeout(timeout);
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private async sendRequest(request: any, timeoutMs = 30000): Promise<any> {
    const { serverName } = this.context;
    
    if (!this.socket) {
      throw new SocketConnectionError(`[${serverName}] Cannot send request: not connected`);
    }

    const socket = this.socket;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseCallback = null;
        reject(new SocketConnectionError(`[${serverName}] Tool request timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.responseCallback = (response) => {
        clearTimeout(timeout);
        resolve(response);
      };

      const jsonStr = JSON.stringify(request);
      const jsonBuffer = Buffer.from(jsonStr, 'utf-8');
      const lengthBuffer = Buffer.allocUnsafe(4);
      lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);
      
      const messageBuffer = Buffer.concat([lengthBuffer, jsonBuffer]);
      socket.write(messageBuffer);
    });
  }

  async callTool(toolName: string, args: any): Promise<any> {
    const request = {
      method: 'execute_tool',
      params: {
        client_id: this.context.clientTypeId,
        tool: toolName,
        args: args
      }
    };
    return this.sendRequestWithRetry(request);
  }

  private async sendRequestWithRetry(request: any): Promise<any> {
    const { serverName, logger } = this.context;
    
    try {
      return await this.sendRequest(request);
    } catch (error) {
      if (!(error instanceof SocketConnectionError)) throw error;
      
      logger.info(`[${serverName}] Connection error, forcing reconnect and retrying: ${error.message}`);
      this.closeSocket();
      await this.ensureConnected();
      return await this.sendRequest(request);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.end();
      this.socket.destroy();
      this.socket = null;
    }
    this.connected = false;
    this.connecting = false;
  }

  cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.closeSocket();
    this.reconnectAttempts = 0;
    this.responseBuffer = Buffer.alloc(0);
    this.responseCallback = null;
  }

  disconnect(): void {
    this.cleanup();
  }

  private async validateSocketSecurity(socketPath: string): Promise<void> {
    const { serverName, logger } = this.context;
    
    // Windows named pipes handle security differently
    if (process.platform === 'win32') return;

    try {
      const stats = await fs.stat(socketPath);
      
      if (!stats.isSocket()) {
        throw new Error(`[${serverName}] Path exists but it's not a socket: ${socketPath}`);
      }

      // Check permissions: 0600 (owner read/write only)
      const mode = stats.mode & 0o777;
      if (mode !== 0o600) {
        throw new Error(`[${serverName}] Insecure socket permissions: ${mode.toString(8)} (expected 0600). Socket may have been tampered with.`);
      }

      // Check ownership
      const uid = process.getuid?.();
      if (uid !== undefined && stats.uid !== uid) {
        throw new Error(`Socket not owned by current user (uid: ${uid}, socket uid: ${stats.uid}). Potential security risk.`);
      }

      logger.info(`[${serverName}] Socket security validation passed`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        logger.info(`[${serverName}] Socket not found, will be created by server`);
        return;
      }
      throw error;
    }
  }
}

/**
 * Socket client factory.
 * Original: QZ9 in chunks.145.mjs:972
 */
export function createSocketClient(context: SocketClientContext): ChromeSocketClient {
  return new ChromeSocketClient(context);
}
