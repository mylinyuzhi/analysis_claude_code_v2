/**
 * @claudecode/sdk - WebSocket Transport
 *
 * WebSocket-based transport with reconnection and message replay.
 * Reconstructed from chunks.155.mjs:2805-3034 (Vy0, Fy0)
 */

import { PassThrough } from 'stream';
import type {
  SDKMessage,
  WebSocketTransportState,
  WebSocketTransportOptions,
} from '../types.js';
import { SDK_CONSTANTS } from '../types.js';
import { StdioSDKTransport } from './stdio.js';
import { RingBuffer } from './ring-buffer.js';

// ============================================
// WebSocket Transport (Low-Level)
// ============================================

/**
 * Low-level WebSocket handler with reconnection support.
 * Original: Vy0 (WebSocketTransport) in chunks.155.mjs:2805-2963
 */
export class WebSocketTransport {
  private ws: WebSocket | null = null;
  private lastSentId: string | null = null;
  private url: URL;
  private state: WebSocketTransportState = 'idle';
  private onData?: (data: string) => void;
  private onCloseCallback?: () => void;
  private headers: Record<string, string>;
  private sessionId?: string;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private messageBuffer: RingBuffer<SDKMessage>;

  constructor(options: WebSocketTransportOptions) {
    this.url = new URL(options.url);
    this.headers = options.headers || {};
    this.sessionId = options.sessionId;
    this.messageBuffer = new RingBuffer<SDKMessage>(SDK_CONSTANTS.MESSAGE_BUFFER_SIZE);
  }

  /**
   * Connect to WebSocket server.
   */
  connect(): void {
    if (this.state === 'closing' || this.state === 'closed') {
      return;
    }

    console.debug(`[SDK] WebSocketTransport: Connecting to ${this.url.href}`);

    try {
      // Create WebSocket with headers (Node.js WebSocket supports headers)
      this.ws = new WebSocket(this.url.href, ['mcp']);

      this.ws.onopen = () => {
        console.debug(`[SDK] WebSocketTransport: Connected to ${this.url.href}`);
        this.state = 'connected';
        this.reconnectAttempts = 0;

        // Replay buffered messages if reconnecting
        if (this.lastSentId) {
          this.replayBufferedMessages(this.lastSentId);
        }

        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        const data = typeof event.data === 'string' ? event.data : String(event.data);
        if (this.onData) {
          this.onData(data);
        }
      };

      this.ws.onerror = (event) => {
        console.error(`[SDK] WebSocketTransport: Error`, event);
        this.handleConnectionError();
      };

      this.ws.onclose = () => {
        console.debug(`[SDK] WebSocketTransport: Connection closed`);
        this.handleConnectionError();
      };
    } catch (error) {
      console.error(`[SDK] WebSocketTransport: Failed to connect`, error);
      this.handleConnectionError();
    }
  }

  /**
   * Send raw line to WebSocket.
   */
  private sendLine(line: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      this.ws.send(line);
      return true;
    } catch (error) {
      console.error(`[SDK] WebSocketTransport: Failed to send`, error);
      return false;
    }
  }

  /**
   * Disconnect without triggering reconnection.
   */
  private doDisconnect(): void {
    this.stopPingInterval();

    if (this.ws) {
      try {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
      } catch {
        // Ignore close errors
      }
      this.ws = null;
    }
  }

  /**
   * Handle connection error with exponential backoff reconnection.
   * Original: handleConnectionError() in Vy0
   */
  private handleConnectionError(): void {
    console.debug(`[SDK] WebSocketTransport: Disconnected from ${this.url.href}`);

    this.doDisconnect();

    // Don't reconnect if explicitly closing
    if (this.state === 'closing' || this.state === 'closed') {
      return;
    }

    if (this.reconnectAttempts < SDK_CONSTANTS.MAX_RECONNECT_ATTEMPTS) {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      this.state = 'reconnecting';
      this.reconnectAttempts++;

      // Exponential backoff: 1s, 2s, 4s, ..., max 30s
      const delay = Math.min(
        SDK_CONSTANTS.INITIAL_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1),
        SDK_CONSTANTS.MAX_RECONNECT_DELAY_MS
      );

      console.debug(
        `[SDK] WebSocketTransport: Reconnecting in ${delay}ms ` +
          `(attempt ${this.reconnectAttempts}/${SDK_CONSTANTS.MAX_RECONNECT_ATTEMPTS})`
      );

      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, delay);
    } else {
      console.error(`[SDK] WebSocketTransport: Max reconnection attempts reached`);
      this.state = 'closed';

      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    }
  }

  /**
   * Close connection gracefully.
   */
  close(): void {
    this.state = 'closing';

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.doDisconnect();
    this.state = 'closed';
  }

  /**
   * Replay buffered messages after reconnection.
   * Original: replayBufferedMessages() in Vy0
   */
  private replayBufferedMessages(lastAckedId: string | null): void {
    const bufferedMessages = this.messageBuffer.toArray();
    if (bufferedMessages.length === 0) {
      return;
    }

    let startIndex = 0;
    if (lastAckedId) {
      const ackIndex = bufferedMessages.findIndex(
        (msg) => msg.uuid === lastAckedId
      );
      if (ackIndex >= 0) {
        startIndex = ackIndex + 1; // Start after last acked
      }
    }

    const messagesToReplay = bufferedMessages.slice(startIndex);
    if (messagesToReplay.length === 0) {
      console.debug('[SDK] WebSocketTransport: No new messages to replay');
      return;
    }

    console.debug(
      `[SDK] WebSocketTransport: Replaying ${messagesToReplay.length} buffered messages`
    );

    for (const message of messagesToReplay) {
      const jsonLine = JSON.stringify(message) + '\n';
      if (!this.sendLine(jsonLine)) {
        this.handleConnectionError();
        break;
      }
    }
  }

  /**
   * Check if connected.
   */
  isConnected(): boolean {
    return this.state === 'connected';
  }

  /**
   * Set data callback.
   */
  setOnData(callback: (data: string) => void): void {
    this.onData = callback;
  }

  /**
   * Set close callback.
   */
  setOnClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  /**
   * Write message with buffering.
   * Original: write() in Vy0
   */
  write(message: SDKMessage): void {
    // Buffer messages with UUIDs for potential replay
    if (message.uuid) {
      this.messageBuffer.add(message);
      this.lastSentId = message.uuid;
    }

    const jsonLine = JSON.stringify(message) + '\n';

    if (this.state !== 'connected') {
      return;
    }

    const sessionInfo = this.sessionId ? ` session=${this.sessionId}` : '';
    console.debug(`[SDK] WebSocketTransport: Sending message type=${message.type}${sessionInfo}`);
    this.sendLine(jsonLine);
  }

  /**
   * Start ping interval for keepalive.
   */
  private startPingInterval(): void {
    this.stopPingInterval();

    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // Send ping frame or keep-alive message
        this.ws.send(JSON.stringify({ type: 'keep_alive' }) + '\n');
      }
    }, SDK_CONSTANTS.PING_INTERVAL_MS);
  }

  /**
   * Stop ping interval.
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

// ============================================
// WebSocket SDK Transport
// ============================================

/**
 * WebSocket SDK Transport extending StdioSDKTransport.
 * Original: Fy0 (WebSocketSDKTransport) in chunks.155.mjs:3000-3034
 */
export class WebSocketSDKTransport extends StdioSDKTransport {
  private url: URL;
  private transport: WebSocketTransport;
  private inputStream: PassThrough;

  constructor(options: {
    url: string;
    initialInputStream?: AsyncIterable<string>;
    replayUserMessages?: boolean;
    headers?: Record<string, string>;
    sessionId?: string;
  }) {
    // Create PassThrough stream to bridge WebSocket → parent class input
    const passThroughStream = new PassThrough({ encoding: 'utf8' });
    super(createAsyncIterableFromStream(passThroughStream), options.replayUserMessages ?? false);

    this.inputStream = passThroughStream;
    this.url = new URL(options.url);

    // Set up authentication headers
    const headers: Record<string, string> = { ...(options.headers || {}) };

    // Add auth token if available
    const authToken = process.env.ANTHROPIC_API_KEY;
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // Add environment runner version header
    const runnerVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
    if (runnerVersion) {
      headers['x-environment-runner-version'] = runnerVersion;
    }

    // Create and connect WebSocket transport
    this.transport = new WebSocketTransport({
      url: this.url.href,
      headers,
      sessionId: options.sessionId,
    });

    this.transport.setOnData((data) => {
      this.inputStream.write(data);
    });

    this.transport.setOnClose(() => {
      this.inputStream.end();
    });

    this.transport.connect();

    // Forward initial input stream if provided
    if (options.initialInputStream) {
      const stream = this.inputStream;
      (async () => {
        for await (const line of options.initialInputStream!) {
          stream.write(line + '\n');
        }
      })();
    }
  }

  /**
   * Override write to use WebSocket instead of stdout.
   */
  write(message: SDKMessage): void {
    this.transport.write(message);
  }

  /**
   * Close transport.
   */
  close(): void {
    this.transport.close();
    this.inputStream.end();
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Create async iterable from Node.js stream.
 */
async function* createAsyncIterableFromStream(
  stream: PassThrough
): AsyncGenerator<string, void, unknown> {
  for await (const chunk of stream) {
    yield typeof chunk === 'string' ? chunk : chunk.toString('utf8');
  }
}

// ============================================
// Export
// ============================================

export { WebSocketTransport, WebSocketSDKTransport };
