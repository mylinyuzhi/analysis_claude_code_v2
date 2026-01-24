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
import { StdioSDKTransport, writeToStdout } from './stdio.js';
import { RingBuffer } from './ring-buffer.js';

// ============================================
// Internal Logger / Telemetry Mock (should be aligned with platform)
// ============================================

const log = (message: string, options?: { level: string }) => {
  if (process.env.DEBUG) {
    console.error(`[WebSocketTransport] ${message}`);
  }
};

const trackEvent = (level: string, name: string, metadata?: Record<string, unknown>) => {
  // Original: OB(level, name, metadata)
};

// ============================================
// WebSocket Transport (Low-Level)
// ============================================

/**
 * Low-level WebSocket handler with reconnection support.
 * Original: Vy0 (WebSocketTransport) in chunks.155.mjs:2805-2963
 */
export class WebSocketTransport {
  private ws: any = null;
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

  constructor(url: URL, headers: Record<string, string> = {}, sessionId?: string) {
    this.url = url;
    this.headers = headers;
    this.sessionId = sessionId;
    this.messageBuffer = new RingBuffer<SDKMessage>(SDK_CONSTANTS.MESSAGE_BUFFER_SIZE);
  }

  /**
   * Connect to WebSocket server.
   * Original: connect() in Vy0 (chunks.155.mjs:2821-2872)
   */
  async connect(): Promise<void> {
    if (this.state !== 'idle' && this.state !== 'reconnecting') {
      log(`WebSocketTransport: Cannot connect, current state is ${this.state}`, { level: 'error' });
      trackEvent('error', 'cli_websocket_connect_failed');
      return;
    }

    this.state = 'reconnecting';
    const startTime = Date.now();
    log(`WebSocketTransport: Opening ${this.url.href}`);
    trackEvent('info', 'cli_websocket_connect_opening');

    const headers = { ...this.headers };
    if (this.lastSentId) {
      headers['X-Last-Request-Id'] = this.lastSentId;
      log(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
    }

    // Use WebSocket from 'ws' package in Node.js
    const { default: WebSocket } = await import('ws');
    
    // In actual implementation, this might use a proxy agent (COA)
    this.ws = new WebSocket(this.url.href, {
      headers,
    });

    this.ws.on('open', () => {
      const duration = Date.now() - startTime;
      log('WebSocketTransport: Connected');
      trackEvent('info', 'cli_websocket_connect_connected', { duration_ms: duration });

      // Note: In Node.js 'ws' package, headers are available differently than in source's upgradeReq
      // Check if server acknowledged last received message via headers
      // (This part depends on the specific WS implementation used in source)
      
      this.reconnectAttempts = 0;
      this.state = 'connected';
      this.startPingInterval();

      // Activity signal / keep-alive
      try {
        this.ws.send(JSON.stringify({ type: 'keep_alive' }) + '\n');
        log('WebSocketTransport: Sent keep_alive (activity signal)');
      } catch (err) {
        log(`WebSocketTransport: Keep-alive failed: ${err}`, { level: 'error' });
        trackEvent('error', 'cli_websocket_keepalive_failed');
      }
    });

    this.ws.on('message', (data: Buffer | string) => {
      const messageStr = data.toString();
      if (this.onData) this.onData(messageStr);
    });

    this.ws.on('error', (err: Error) => {
      log(`WebSocketTransport: Error: ${err.message}`, { level: 'error' });
      trackEvent('error', 'cli_websocket_connect_error');
      this.handleConnectionError();
    });

    this.ws.on('close', (code: number, reason: string) => {
      log(`WebSocketTransport: Closed: ${code} ${reason}`, { level: 'error' });
      trackEvent('error', 'cli_websocket_connect_closed');
      this.handleConnectionError();
    });
  }

  /**
   * Send raw line to WebSocket.
   * Original: sendLine() in Vy0 (chunks.155.mjs:2873-2882)
   */
  private sendLine(line: string): boolean {
    if (!this.ws || this.state !== 'connected') {
      log('WebSocketTransport: Not connected');
      trackEvent('info', 'cli_websocket_send_not_connected');
      return false;
    }

    try {
      this.ws.send(line);
      return true;
    } catch (err) {
      log(`WebSocketTransport: Failed to send: ${err}`, { level: 'error' });
      trackEvent('error', 'cli_websocket_send_error');
      this.ws = null;
      this.handleConnectionError();
      return false;
    }
  }

  /**
   * Disconnect without triggering reconnection.
   * Original: doDisconnect() in Vy0 (chunks.155.mjs:2883-2885)
   */
  private doDisconnect(): void {
    this.stopPingInterval();
    // Original calls bX0() - clear proxy config?
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
  }

  /**
   * Handle connection error with exponential backoff.
   * Original: handleConnectionError() in Vy0 (chunks.155.mjs:2886-2902)
   */
  private handleConnectionError(): void {
    log(`WebSocketTransport: Disconnected from ${this.url.href}`);
    trackEvent('info', 'cli_websocket_disconnected');
    this.doDisconnect();

    if (this.state === 'closing' || this.state === 'closed') return;

    if (this.reconnectAttempts < SDK_CONSTANTS.MAX_RECONNECT_ATTEMPTS) {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      this.state = 'reconnecting';
      this.reconnectAttempts++;

      const delay = Math.min(
        SDK_CONSTANTS.INITIAL_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1),
        SDK_CONSTANTS.MAX_RECONNECT_DELAY_MS
      );

      log(`WebSocketTransport: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${SDK_CONSTANTS.MAX_RECONNECT_ATTEMPTS})`);
      trackEvent('error', 'cli_websocket_reconnect_attempt', { reconnectAttempts: this.reconnectAttempts });

      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, delay);
    } else {
      log(`WebSocketTransport: Max reconnection attempts reached for ${this.url.href}`, { level: 'error' });
      trackEvent('error', 'cli_websocket_reconnect_exhausted', { reconnectAttempts: this.reconnectAttempts });
      this.state = 'closed';
      if (this.onCloseCallback) this.onCloseCallback();
    }
  }

  /**
   * Close connection gracefully.
   * Original: close() in Vy0 (chunks.155.mjs:2903-2906)
   */
  close(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopPingInterval();
    this.state = 'closing';
    this.doDisconnect();
  }

  /**
   * Replay buffered messages after reconnection.
   * Original: replayBufferedMessages() in Vy0 (chunks.155.mjs:2907-2931)
   */
  private replayBufferedMessages(lastAckedId: string | null): void {
    const buffered = this.messageBuffer.toArray();
    if (buffered.length === 0) return;

    let startIndex = 0;
    if (lastAckedId) {
      const ackIndex = buffered.findIndex((msg: any) => msg.uuid === lastAckedId);
      if (ackIndex >= 0) startIndex = ackIndex + 1;
    }

    const toReplay = buffered.slice(startIndex);
    if (toReplay.length === 0) {
      log('WebSocketTransport: No new messages to replay');
      trackEvent('info', 'cli_websocket_no_messages_to_replay');
      return;
    }

    log(`WebSocketTransport: Replaying ${toReplay.length} buffered messages`);
    trackEvent('info', 'cli_websocket_messages_to_replay', { count: toReplay.length });

    for (const msg of toReplay) {
      const jsonLine = JSON.stringify(msg) + '\n';
      if (!this.sendLine(jsonLine)) {
        this.handleConnectionError();
        break;
      }
    }
  }

  /**
   * Check if connected.
   */
  isConnectedStatus(): boolean {
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
   * Original: write() in Vy0 (chunks.155.mjs:2941-2948)
   */
  write(message: SDKMessage): void {
    if (message.uuid && typeof message.uuid === 'string') {
      this.messageBuffer.add(message);
      this.lastSentId = message.uuid;
    }

    const jsonLine = JSON.stringify(message) + '\n';
    if (this.state !== 'connected') return;

    const sessionInfo = this.sessionId ? ` session=${this.sessionId}` : '';
    log(`WebSocketTransport: Sending message type=${message.type}${sessionInfo}`);
    this.sendLine(jsonLine);
  }

  /**
   * Start ping interval for keepalive.
   * Original: startPingInterval() in Vy0 (chunks.155.mjs:2949-2959)
   */
  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.state === 'connected' && this.ws) {
        try {
          this.ws.ping();
        } catch (err) {
          log(`WebSocketTransport: Ping failed: ${err}`, { level: 'error' });
          trackEvent('error', 'cli_websocket_ping_failed');
        }
      }
    }, SDK_CONSTANTS.PING_INTERVAL_MS);
  }

  /**
   * Stop ping interval.
   * Original: stopPingInterval() in Vy0 (chunks.155.mjs:2960-2962)
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
    sessionId?: string;
  }) {
    const passThroughStream = new PassThrough({ encoding: 'utf8' });
    super(createAsyncIterableFromStream(passThroughStream), options.replayUserMessages ?? false);

    this.inputStream = passThroughStream;
    this.url = new URL(options.url);

    // Set up authentication headers
    const headers: Record<string, string> = {};
    const authToken = process.env.ANTHROPIC_API_KEY; // Original calls G4A()
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const runnerVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
    if (runnerVersion) {
      headers['x-environment-runner-version'] = runnerVersion;
    }

    // Create and connect WebSocket transport
    // Original: jw9(this.url, Z, q0())
    this.transport = new WebSocketTransport(this.url, headers, options.sessionId);

    this.transport.setOnData((data) => {
      this.inputStream.write(data);
    });

    this.transport.setOnClose(() => {
      this.inputStream.end();
    });

    this.transport.connect();

    // Register shutdown hook
    // Original: C6(async () => this.close())
    // In Node.js, we can use process.on('exit') or similar if C6 is not available
    
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
   * Original: write() in Fy0 (chunks.155.mjs:3027-3029)
   */
  write(message: SDKMessage): void {
    this.transport.write(message);
  }

  /**
   * Close transport.
   * Original: close() in Fy0 (chunks.155.mjs:3030-3032)
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
