/**
 * @claudecode/cli - Endpoint Detection
 *
 * Detect if Claude Code is running and communicate via socket.
 * Reconstructed from source code analysis.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as os from 'os';
import { getClaudeHomeDir } from '../settings/loader.js';

// ============================================
// Constants
// ============================================

const SOCKET_FILENAME = 'claude-code.sock';
const STATE_FILENAME = 'claude-code.state';
const CONNECTION_TIMEOUT = 5000;

// ============================================
// Types
// ============================================

/**
 * Endpoint state.
 */
export interface EndpointState {
  pid: number;
  socketPath: string;
  startTime: number;
  version: string;
}

/**
 * Socket command request.
 */
export interface SocketCommand {
  command: string;
  params?: Record<string, unknown>;
}

/**
 * Socket command response.
 */
export interface SocketResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ============================================
// Path Utilities
// ============================================

/**
 * Get socket file path.
 */
export function getSocketPath(): string {
  if (process.platform === 'win32') {
    // Windows uses named pipes
    return '\\\\.\\pipe\\claude-code';
  }

  // Unix uses domain sockets
  const tmpDir = os.tmpdir();
  return path.join(tmpDir, SOCKET_FILENAME);
}

/**
 * Get state file path.
 */
export function getStatePath(): string {
  return path.join(getClaudeHomeDir(), STATE_FILENAME);
}

// ============================================
// State Management
// ============================================

/**
 * Read endpoint state.
 */
export function readEndpointState(): EndpointState | null {
  try {
    const statePath = getStatePath();
    if (!fs.existsSync(statePath)) {
      return null;
    }

    const content = fs.readFileSync(statePath, 'utf-8');
    return JSON.parse(content) as EndpointState;
  } catch {
    return null;
  }
}

/**
 * Write endpoint state.
 */
export function writeEndpointState(state: EndpointState): void {
  const statePath = getStatePath();
  const dir = path.dirname(statePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(statePath, JSON.stringify(state), 'utf-8');
}

/**
 * Clear endpoint state.
 */
export function clearEndpointState(): void {
  const statePath = getStatePath();
  if (fs.existsSync(statePath)) {
    fs.unlinkSync(statePath);
  }
}

// ============================================
// Detection
// ============================================

/**
 * Check if process is running.
 */
function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if Claude Code is running.
 */
export function isRunningInEndpoint(): boolean {
  const state = readEndpointState();
  if (!state) {
    return false;
  }

  // Check if process is still running
  if (!isProcessRunning(state.pid)) {
    clearEndpointState();
    return false;
  }

  // Check if socket exists
  const socketPath = getSocketPath();
  if (process.platform !== 'win32' && !fs.existsSync(socketPath)) {
    return false;
  }

  return true;
}

/**
 * Check if socket is available.
 */
export async function isSocketAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const socketPath = getSocketPath();
    const socket = net.createConnection(socketPath);

    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 1000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

// ============================================
// Socket Communication
// ============================================

/**
 * Send command to running Claude Code instance.
 */
export async function sendCommand(
  command: string,
  params?: Record<string, unknown>,
  timeoutMs: number = CONNECTION_TIMEOUT
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const socketPath = getSocketPath();
    const socket = net.createConnection(socketPath);

    let buffer = '';
    let responseReceived = false;

    const timeout = setTimeout(() => {
      if (!responseReceived) {
        socket.destroy();
        reject(new Error('Connection timeout'));
      }
    }, timeoutMs);

    socket.on('connect', () => {
      // Send command as JSON
      const request: SocketCommand = { command, params };
      socket.write(JSON.stringify(request) + '\n');
    });

    socket.on('data', (data) => {
      buffer += data.toString();

      // Check for complete response
      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex !== -1) {
        responseReceived = true;
        clearTimeout(timeout);

        try {
          const responseStr = buffer.slice(0, newlineIndex);
          const response = JSON.parse(responseStr) as SocketResponse;

          socket.destroy();

          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || 'Unknown error'));
          }
        } catch (err) {
          socket.destroy();
          reject(err);
        }
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    socket.on('close', () => {
      clearTimeout(timeout);
      if (!responseReceived) {
        reject(new Error('Connection closed'));
      }
    });
  });
}

/**
 * Send command with wrapper for MCP CLI.
 */
export async function sendMcpCommand(
  commandId: string,
  options: { command: string; params?: Record<string, unknown> },
  timeoutMs?: number
): Promise<unknown> {
  return sendCommand('mcp-cli', {
    subCommand: commandId,
    ...options,
  }, timeoutMs);
}

// ============================================
// Socket Server (for main process)
// ============================================

/**
 * Command handler type.
 */
export type CommandHandler = (
  command: string,
  params?: Record<string, unknown>
) => Promise<unknown>;

/**
 * Start socket server.
 */
export function startSocketServer(handler: CommandHandler): net.Server {
  const socketPath = getSocketPath();

  // Clean up existing socket
  if (process.platform !== 'win32' && fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }

  const server = net.createServer((socket) => {
    let buffer = '';

    socket.on('data', async (data) => {
      buffer += data.toString();

      // Check for complete request
      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex !== -1) {
        const requestStr = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        try {
          const request = JSON.parse(requestStr) as SocketCommand;
          const result = await handler(request.command, request.params);

          const response: SocketResponse = {
            success: true,
            data: result,
          };
          socket.write(JSON.stringify(response) + '\n');
        } catch (err) {
          const response: SocketResponse = {
            success: false,
            error: err instanceof Error ? err.message : String(err),
          };
          socket.write(JSON.stringify(response) + '\n');
        }
      }
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  });

  server.listen(socketPath, () => {
    console.debug(`Socket server listening on ${socketPath}`);
  });

  // Write state file
  writeEndpointState({
    pid: process.pid,
    socketPath,
    startTime: Date.now(),
    version: '2.1.7',
  });

  // Cleanup on exit
  process.on('exit', () => {
    server.close();
    clearEndpointState();
    if (process.platform !== 'win32' && fs.existsSync(socketPath)) {
      fs.unlinkSync(socketPath);
    }
  });

  return server;
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在定义处导出；移除重复聚合导出。
