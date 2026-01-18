/**
 * @claudecode/integrations - Chrome Socket Client
 *
 * Socket client for communicating with Chrome native host.
 * Reconstructed from chunks.145.mjs (AZ9)
 */

import net from 'net';
import type { SocketMessage, SocketClientOptions, SocketClientState } from './types.js';
import { CHROME_CONSTANTS } from './types.js';

// ============================================
// Message Encoding/Decoding
// ============================================

/**
 * Encode message with 4-byte length prefix.
 * Format: [4 bytes little-endian length][JSON payload]
 */
export function encodeMessage(message: SocketMessage): Buffer {
  const jsonStr = JSON.stringify(message);
  const jsonBuffer = Buffer.from(jsonStr, 'utf-8');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);
  return Buffer.concat([lengthBuffer, jsonBuffer]);
}

/**
 * Decode message from buffer.
 * Returns [message, remainingBuffer] or [null, buffer] if incomplete.
 */
export function decodeMessage(buffer: Buffer): [SocketMessage | null, Buffer] {
  if (buffer.length < 4) {
    return [null, buffer];
  }

  const length = buffer.readUInt32LE(0);

  if (buffer.length < 4 + length) {
    return [null, buffer];
  }

  const jsonStr = buffer.slice(4, 4 + length).toString('utf-8');
  const message = JSON.parse(jsonStr) as SocketMessage;
  const remaining = buffer.slice(4 + length);

  return [message, remaining];
}

// ============================================
// Socket Client
// ============================================

/**
 * Socket client for Chrome native host communication.
 * Original: AZ9 (SocketClient) in chunks.145.mjs
 *
 * Features:
 * - Automatic reconnection
 * - Request/response correlation via message ID
 * - 4-byte length-prefixed JSON messages
 */
export class ChromeSocketClient {
  private socket: net.Socket | null = null;
  private state: SocketClientState = 'disconnected';
  private buffer: Buffer = Buffer.alloc(0);
  private pendingRequests: Map<string, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
    timeout: ReturnType<typeof setTimeout>;
  }> = new Map();
  private reconnectAttempts = 0;
  private options: Required<SocketClientOptions>;

  constructor(options: SocketClientOptions) {
    this.options = {
      socketPath: options.socketPath,
      timeout: options.timeout ?? CHROME_CONSTANTS.SOCKET_TIMEOUT_MS,
      reconnect: options.reconnect ?? true,
      maxReconnectAttempts: options.maxReconnectAttempts ?? CHROME_CONSTANTS.MAX_RECONNECT_ATTEMPTS,
    };
  }

  /**
   * Get current state.
   */
  getState(): SocketClientState {
    return this.state;
  }

  /**
   * Check if connected.
   */
  isConnected(): boolean {
    return this.state === 'connected';
  }

  /**
   * Connect to socket.
   */
  async connect(): Promise<void> {
    if (this.state === 'connected' || this.state === 'connecting') {
      return;
    }

    this.state = 'connecting';

    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.options.socketPath);

      this.socket.on('connect', () => {
        this.state = 'connected';
        this.reconnectAttempts = 0;
        this.buffer = Buffer.alloc(0);
        resolve();
      });

      this.socket.on('data', (data) => {
        this.handleData(data);
      });

      this.socket.on('error', (error) => {
        this.state = 'error';
        if (this.reconnectAttempts === 0) {
          reject(error);
        }
        this.handleDisconnect();
      });

      this.socket.on('close', () => {
        this.state = 'disconnected';
        this.handleDisconnect();
      });
    });
  }

  /**
   * Disconnect from socket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.state = 'disconnected';
    this.buffer = Buffer.alloc(0);

    // Reject all pending requests
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Socket disconnected'));
    }
    this.pendingRequests.clear();
  }

  /**
   * Send request and wait for response.
   */
  async request<T = unknown>(type: string, payload?: unknown): Promise<T> {
    if (!this.isConnected()) {
      await this.connect();
    }

    const id = generateRequestId();
    const message: SocketMessage = { type, id, payload };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${type}`));
      }, this.options.timeout);

      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeout,
      });

      const buffer = encodeMessage(message);
      this.socket!.write(buffer);
    });
  }

  /**
   * Send message without waiting for response.
   */
  send(type: string, payload?: unknown): void {
    if (!this.isConnected()) {
      throw new Error('Not connected');
    }

    const message: SocketMessage = { type, payload };
    const buffer = encodeMessage(message);
    this.socket!.write(buffer);
  }

  /**
   * Handle incoming data.
   */
  private handleData(data: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, data]);

    // Process all complete messages in buffer
    while (true) {
      const [message, remaining] = decodeMessage(this.buffer);
      if (!message) break;

      this.buffer = remaining;
      this.handleMessage(message);
    }
  }

  /**
   * Handle decoded message.
   */
  private handleMessage(message: SocketMessage): void {
    // Check if this is a response to a pending request
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      clearTimeout(pending.timeout);

      if (message.type === 'error') {
        pending.reject(new Error(String(message.payload)));
      } else {
        pending.resolve(message.payload);
      }
    }
  }

  /**
   * Handle disconnection (attempt reconnect if enabled).
   */
  private handleDisconnect(): void {
    if (!this.options.reconnect) return;
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) return;

    this.reconnectAttempts++;
    const delay = CHROME_CONSTANTS.RECONNECT_DELAY_MS * this.reconnectAttempts;

    setTimeout(() => {
      this.connect().catch(() => {
        // Reconnect failed, will retry
      });
    }, delay);
  }
}

// ============================================
// Utilities
// ============================================

/**
 * Generate unique request ID.
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Get socket path for current platform.
 */
export function getSocketPath(): string {
  return process.platform === 'win32'
    ? CHROME_CONSTANTS.SOCKET_PATH_WINDOWS
    : CHROME_CONSTANTS.SOCKET_PATH_UNIX;
}

/**
 * Create socket client with default options.
 */
export function createSocketClient(options?: Partial<SocketClientOptions>): ChromeSocketClient {
  return new ChromeSocketClient({
    socketPath: getSocketPath(),
    ...options,
  });
}

// ============================================
// Export
// ============================================

export {
  encodeMessage,
  decodeMessage,
  ChromeSocketClient,
  getSocketPath,
  createSocketClient,
};
