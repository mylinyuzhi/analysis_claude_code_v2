/**
 * @claudecode/platform - Sandbox Manager
 *
 * Central sandbox management object.
 * Reconstructed from chunks.53.mjs, chunks.55.mjs
 */

import { spawn, spawnSync } from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import type {
  SandboxConfig,
  SandboxSettings,
  SandboxManager,
  SandboxWrapperOptions,
  NetworkInfrastructure,
  PermissionCallback,
  ReadConfig,
  WriteConfig,
  NetworkConfig,
  IgnoreViolationsConfig,
  SandboxViolationStore as ISandboxViolationStore,
} from './types.js';
import {
  getPlatform,
  isSupportedPlatform,
  checkDependencies,
  findSeccompBpfFilter,
  findApplySeccompBinary,
} from './dependencies.js';
import {
  isSandboxingEnabled as isSandboxingEnabledConfig,
  isAutoAllowBashIfSandboxedEnabled as isAutoAllowBashConfig,
  areUnsandboxedCommandsAllowed as areUnsandboxedCommandsAllowedConfig,
  areSandboxSettingsLockedByPolicy,
  setSandboxSettings as setSettingsInternal,
  setSandboxConfig,
  getSandboxConfig,
  getFsReadConfig,
  getFsWriteConfig,
  getNetworkRestrictionConfig,
  getIgnoreViolations,
  getAllowUnixSockets,
  getAllowLocalBinding,
  getEnableWeakerNestedSandbox,
  getExcludedCommands,
  resetSandboxConfig,
} from './config.js';
import {
  getGlobalViolationStore,
  resetGlobalViolationStore,
  annotateStderrWithSandboxFailures,
  decodeCommandFromTag,
  getUniqueSandboxTag,
  encodeCommandTag,
  shouldIgnoreViolation,
} from './violation-store.js';
import { SANDBOX_CONSTANTS, type SandboxViolation } from './types.js';

// ============================================
// State
// ============================================

/**
 * Initialization promise (prevents double init)
 */
let initializationPromise: Promise<NetworkInfrastructure> | undefined;

/**
 * Network infrastructure state
 */
let networkInfrastructure: NetworkInfrastructure | undefined;

/**
 * Linux glob pattern warnings
 */
let linuxGlobPatternWarnings: string[] = [];

/**
 * Violation monitor cleanup function
 */
let violationMonitorCleanup: (() => void) | undefined;

/**
 * Proxy servers / bridge processes
 */
let httpProxyServer: http.Server | undefined;
let socksProxyServer: net.Server | undefined;
let cleanupOnExitRegistered = false;

/**
 * Domain decision cache (per-process/session)
 */
const domainDecisionCache = new Map<string, boolean>();

// ============================================
// SOCKS5 Server Implementation
// Original: cFB in chunks.53.mjs:1589-1803
// ============================================

enum SocksCommand {
  CONNECT = 0x01,
  BIND = 0x02,
  UDP_ASSOCIATE = 0x03,
}

enum SocksAddressType {
  IPv4 = 0x01,
  DOMAIN = 0x03,
  IPv6 = 0x04,
}

enum SocksReplyStatus {
  REQUEST_GRANTED = 0x00,
  GENERAL_FAILURE = 0x01,
  CONNECTION_NOT_ALLOWED = 0x02,
  NETWORK_UNREACHABLE = 0x03,
  HOST_UNREACHABLE = 0x04,
  CONNECTION_REFUSED = 0x05,
  TTL_EXPIRED = 0x06,
  COMMAND_NOT_SUPPORTED = 0x07,
  ADDRESS_TYPE_NOT_SUPPORTED = 0x08,
}

type SocksRulesetValidator = (
  session: SocksSession,
  accept: () => void,
  deny: () => void
) => Promise<boolean | void>;

class SocksSession {
  public socket: net.Socket;
  public server: Socks5Server;
  public destAddress?: string;
  public destPort?: number;
  public command?: string;

  constructor(server: Socks5Server, socket: net.Socket) {
    this.server = server;
    this.socket = socket;
    socket.on('error', () => {});
    socket.pause();
    this.handleGreeting();
  }

  private readBytes(n: number): Promise<Buffer> {
    return new Promise((resolve) => {
      let buffer = Buffer.allocUnsafe(n);
      let offset = 0;
      const onData = (chunk: Buffer) => {
        const bytesToCopy = Math.min(chunk.length, n - offset);
        chunk.copy(buffer, offset, 0, bytesToCopy);
        offset += bytesToCopy;
        if (offset < n) return;

        this.socket.removeListener('data', onData);
        const remaining = chunk.subarray(bytesToCopy);
        if (remaining.length > 0) {
          (this.socket as any).unshift(remaining);
        }
        this.socket.pause();
        resolve(buffer);
      };
      this.socket.on('data', onData);
      this.socket.resume();
    });
  }

  private async handleGreeting(): Promise<void> {
    const header = await this.readBytes(1);
    if (header.readUInt8() !== 0x05) {
      this.socket.destroy();
      return;
    }

    const nMethodsHeader = await this.readBytes(1);
    const nMethods = nMethodsHeader.readUInt8();
    if (nMethods > 128 || nMethods === 0) {
      this.socket.destroy();
      return;
    }

    const methods = await this.readBytes(nMethods);
    const selectedMethod = 0x00; // NO AUTHENTICATION REQUIRED
    if (!methods.includes(selectedMethod)) {
      this.socket.write(Buffer.from([0x05, 0xff]));
      this.socket.destroy();
      return;
    }

    this.socket.write(Buffer.from([0x05, selectedMethod]));
    await this.handleConnectionRequest();
  }

  private async handleConnectionRequest(): Promise<void> {
    await this.readBytes(1); // VER
    const cmdByte = (await this.readBytes(1))[0]!;
    const cmd = SocksCommand[cmdByte];
    if (!cmd) {
      this.socket.destroy();
      return;
    }
    this.command = cmd.toLowerCase();

    await this.readBytes(1); // RSV
    const atyp = (await this.readBytes(1)).readUInt8();
    let host = '';

    switch (atyp) {
      case SocksAddressType.IPv4:
        host = (await this.readBytes(4)).join('.');
        break;
      case SocksAddressType.DOMAIN: {
        const len = (await this.readBytes(1)).readUInt8();
        host = (await this.readBytes(len)).toString();
        break;
      }
      case SocksAddressType.IPv6: {
        const bytes = await this.readBytes(16);
        const parts: string[] = [];
        for (let i = 0; i < 16; i += 2) {
          parts.push(bytes.readUInt16BE(i).toString(16));
        }
        host = parts.join(':');
        break;
      }
      default:
        this.socket.destroy();
        return;
    }

    const port = (await this.readBytes(2)).readUInt16BE();
    if (this.command !== 'connect') {
      this.socket.write(Buffer.from([0x05, 0x07, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
      this.socket.destroy();
      return;
    }

    this.destAddress = host;
    this.destPort = port;

    let decisionMade = false;
    const accept = () => {
      if (decisionMade) return;
      decisionMade = true;
      this.establishConnection();
    };
    const deny = () => {
      if (decisionMade) return;
      decisionMade = true;
      this.socket.write(Buffer.from([0x05, 0x02, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
      this.socket.destroy();
    };

    if (!this.server.rulesetValidator) {
      accept();
      return;
    }

    const result = await this.server.rulesetValidator(this, accept, deny);
    if (result === true) accept();
    else if (result === false) deny();
  }

  private establishConnection(): void {
    this.server.connectionHandler(this, (status: keyof typeof SocksReplyStatus) => {
      const statusCode = SocksReplyStatus[status];
      if (statusCode === undefined) throw new Error(`"${status}" is not a valid status.`);
      this.socket.write(Buffer.from([0x05, statusCode, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
      if (status !== 'REQUEST_GRANTED') this.socket.destroy();
    });
    this.socket.resume();
  }
}

class Socks5Server {
  public server: net.Server;
  public rulesetValidator?: SocksRulesetValidator;
  public connectionHandler: (
    session: SocksSession,
    reply: (status: keyof typeof SocksReplyStatus) => void
  ) => void;

  constructor() {
    this.connectionHandler = defaultSocksConnectionHandler;
    this.server = net.createServer((socket) => {
      socket.setNoDelay();
      new SocksSession(this, socket);
    });
  }

  public listen(port: number, host: string, callback?: () => void): this {
    this.server.listen(port, host, callback);
    return this;
  }

  public close(callback?: (err?: Error) => void): this {
    this.server.close(callback);
    return this;
  }

  public unref(): void {
    this.server.unref();
  }
}

function defaultSocksConnectionHandler(
  session: SocksSession,
  reply: (status: keyof typeof SocksReplyStatus) => void
): void {
  if (session.command !== 'connect' || !session.destAddress || session.destPort === undefined) {
    reply('COMMAND_NOT_SUPPORTED');
    return;
  }
  
  const host = session.destAddress;
  const port = session.destPort;

  const upstream = net.createConnection({
    host,
    port,
  });
  upstream.setNoDelay();

  let connected = false;
  upstream.on('error', (err: any) => {
    if (!connected) {
      switch (err.code) {
        case 'EINVAL':
        case 'ENOENT':
        case 'ENOTFOUND':
        case 'ETIMEDOUT':
        case 'EADDRNOTAVAIL':
        case 'EHOSTUNREACH':
          reply('HOST_UNREACHABLE');
          break;
        case 'ENETUNREACH':
          reply('NETWORK_UNREACHABLE');
          break;
        case 'ECONNREFUSED':
          reply('CONNECTION_REFUSED');
          break;
        default:
          reply('GENERAL_FAILURE');
      }
    }
  });

  upstream.on('ready', () => {
    connected = true;
    reply('REQUEST_GRANTED');
    session.socket.pipe(upstream).pipe(session.socket);
  });

  session.socket.on('close', () => upstream.destroy());
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize sandbox system.
 * Original: P58() in chunks.53.mjs:2785-2823
 *
 * @param config - Sandbox configuration
 * @param permissionCallback - Callback for permission prompts
 * @param enableMonitoring - Enable violation monitoring (macOS only)
 */
async function initialize(
  config: SandboxConfig,
  permissionCallback: PermissionCallback,
  enableMonitoring = false
): Promise<void> {
  // Prevent double initialization
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  // Store configuration
  setSandboxConfig(config);

  // Validate dependencies
  if (!checkDependencies()) {
    const platform = getPlatform();
    let errorMsg = 'Sandbox dependencies are not available on this system.';

    if (platform === 'linux') {
      errorMsg += ' Required: ripgrep (rg), bubblewrap (bwrap), and socat.';
    } else if (platform === 'macos') {
      errorMsg += ' Required: ripgrep (rg).';
    } else {
      errorMsg += ` Platform '${platform}' is not supported.`;
    }

    throw new Error(errorMsg);
  }

  // Start violation monitor on macOS if enabled
  if (enableMonitoring && getPlatform() === 'macos') {
    violationMonitorCleanup = startMacOSViolationMonitor(getGlobalViolationStore(), config.ignoreViolations);
  }

  // Register cleanup handlers
  registerCleanupOnExit();

  // Initialize network infrastructure
  initializationPromise = (async () => {
    try {
      // Get or allocate proxy ports
      let httpPort: number;
      if (config.network.httpProxyPort !== undefined) {
        httpPort = config.network.httpProxyPort;
      } else {
        httpPort = await initializeHTTPProxy(permissionCallback);
      }

      let socksPort: number;
      if (config.network.socksProxyPort !== undefined) {
        socksPort = config.network.socksProxyPort;
      } else {
        socksPort = await initializeSOCKSProxy(permissionCallback);
      }

      // Linux-specific: Create socat bridges
      let linuxBridge: NetworkInfrastructure['linuxBridge'];
      if (getPlatform() === 'linux') {
        linuxBridge = await initializeLinuxBridges(httpPort, socksPort);
      }

      const networkConfig: NetworkInfrastructure = {
        httpProxyPort: httpPort,
        socksProxyPort: socksPort,
        linuxBridge,
      };

      networkInfrastructure = networkConfig;
      return networkConfig;
    } catch (error) {
      // Cleanup on failure
      initializationPromise = undefined;
      networkInfrastructure = undefined;
      await shutdown().catch(() => {});
      throw error;
    }
  })();

  await initializationPromise;
}

/**
 * Reset sandbox state.
 * Original: FZ8() in chunks.55.mjs
 */
async function reset(): Promise<void> {
  await shutdown();
  initializationPromise = undefined;
  networkInfrastructure = undefined;
  linuxGlobPatternWarnings = [];
  resetSandboxConfig();
  resetGlobalViolationStore();
}

/**
 * Refresh configuration from settings.
 * Original: VZ8() in chunks.55.mjs
 */
function refreshConfig(): void {
  // Re-read settings if needed
  // Placeholder - would re-parse settings
}

// ============================================
// Network Infrastructure & Proxies
// ============================================

/**
 * Initialize HTTP proxy.
 * Original: j58() in chunks.53.mjs:2754-2769
 */
async function initializeHTTPProxy(
  permissionCallback: PermissionCallback
): Promise<number> {
  httpProxyServer = http.createServer();

  // HTTPS CONNECT tunneling
  // Original: kFB(A).on('connect', ...) in chunks.53.mjs:1495-1543
  httpProxyServer.on('connect', async (req, clientSocket, head) => {
    clientSocket.on('error', () => {});

    try {
      const url = req.url || '';
      const [host, portStr] = url.split(':');
      const port = portStr ? parseInt(portStr, 10) : 443;

      if (!host || !port) {
        clientSocket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        return;
      }

      const allowed = await checkDomainAllowed(port, host, permissionCallback);
      if (!allowed) {
        clientSocket.end(
          'HTTP/1.1 403 Forbidden\r\n' +
          'Content-Type: text/plain\r\n' +
          'X-Proxy-Error: blocked-by-allowlist\r\n\r\n' +
          'Connection blocked by network allowlist'
        );
        return;
      }

      const serverSocket = net.createConnection(port, host, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        if (head && head.length > 0) serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
      });

      serverSocket.on('error', () => {
        clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
      });

      clientSocket.on('end', () => serverSocket.end());
      serverSocket.on('end', () => clientSocket.end());
    } catch (err) {
      clientSocket.end('HTTP/1.1 500 Internal Server Error\r\n\r\n');
    }
  });

  // Basic forward proxy for absolute-form HTTP requests.
  // Original: kFB(A).on('request', ...) in chunks.53.mjs:1544-1584
  httpProxyServer.on('request', async (req, res) => {
    try {
      const urlStr = req.url || '';
      const parsed = new URL(urlStr);
      const host = parsed.hostname;
      const port = parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === 'https:' ? 443 : 80);

      const allowed = await checkDomainAllowed(port, host, permissionCallback);
      if (!allowed) {
        res.writeHead(403, {
          'Content-Type': 'text/plain',
          'X-Proxy-Error': 'blocked-by-allowlist'
        });
        res.end('Connection blocked by network allowlist');
        return;
      }

      const proxyReq = (parsed.protocol === 'https:' ? require('https') : http).request(
        {
          hostname: host,
          port,
          path: parsed.pathname + parsed.search,
          method: req.method,
          headers: {
            ...req.headers,
            host: parsed.host,
          },
        },
        (proxyRes: any) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'text/plain' });
          res.end('Bad Gateway');
        }
      });

      req.pipe(proxyReq);
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    }
  });

  await new Promise<void>((resolve, reject) => {
    httpProxyServer!.once('error', reject);
    httpProxyServer!.listen(0, '127.0.0.1', () => {
      const addr = httpProxyServer!.address();
      if (addr && typeof addr === 'object') {
        httpProxyServer!.unref();
        resolve();
      } else {
        reject(new Error('Failed to get proxy server address'));
      }
    });
  });

  const addr = httpProxyServer!.address() as net.AddressInfo;
  return addr.port;
}

/**
 * Initialize SOCKS proxy.
 * Original: T58() in chunks.53.mjs:2771-2783
 */
async function initializeSOCKSProxy(
  permissionCallback: PermissionCallback
): Promise<number> {
  const server = new Socks5Server();
  socksProxyServer = server.server;

  server.rulesetValidator = async (session) => {
    try {
      const { destAddress, destPort } = session;
      if (!destAddress || destPort === undefined) return false;

      const allowed = await checkDomainAllowed(destPort, destAddress, permissionCallback);
      return allowed;
    } catch (err) {
      return false;
    }
  };

  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.server.address();
      if (addr && typeof addr === 'object' && 'port' in addr) {
        server.unref();
        resolve(addr.port);
      } else {
        reject(new Error('Failed to get SOCKS proxy server port'));
      }
    });
  });
}

/**
 * Initialize Linux bridges.
 * Original: XHB() in chunks.53.mjs:2194-2265
 */
async function initializeLinuxBridges(
  httpProxyPort: number,
  socksProxyPort: number
): Promise<NetworkInfrastructure['linuxBridge']> {
  const randomHex = crypto.randomBytes(8).toString('hex');
  const tmpDir = getSandboxTempDir();
  ensureDir(tmpDir);

  const httpSocketPath = path.join(tmpDir, `claude-http-${randomHex}.sock`);
  const socksSocketPath = path.join(tmpDir, `claude-socks-${randomHex}.sock`);

  const httpArgs = [
    `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
    `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`,
  ];
  const httpBridgeProcess = spawn('socat', httpArgs, { stdio: 'ignore' });
  if (!httpBridgeProcess.pid) {
    throw new Error('Failed to start HTTP bridge process');
  }
  httpBridgeProcess.on('error', (err) => {
    // console.error(`[Sandbox Linux] HTTP bridge error: ${err}`);
  });

  const socksArgs = [
    `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
    `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`,
  ];
  const socksBridgeProcess = spawn('socat', socksArgs, { stdio: 'ignore' });
  if (!socksBridgeProcess.pid) {
    if (httpBridgeProcess.pid) try { process.kill(httpBridgeProcess.pid, 'SIGTERM'); } catch {}
    throw new Error('Failed to start SOCKS bridge process');
  }

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (
      !httpBridgeProcess.pid ||
      httpBridgeProcess.killed ||
      !socksBridgeProcess.pid ||
      socksBridgeProcess.killed
    ) {
      throw new Error('Linux bridge process died unexpectedly');
    }
    if (fs.existsSync(httpSocketPath) && fs.existsSync(socksSocketPath)) break;
    if (attempt === MAX_RETRIES - 1) {
      if (httpBridgeProcess.pid) try { process.kill(httpBridgeProcess.pid, 'SIGTERM'); } catch {}
      if (socksBridgeProcess.pid) try { process.kill(socksBridgeProcess.pid, 'SIGTERM'); } catch {}
      throw new Error(`Failed to create bridge sockets after ${MAX_RETRIES} attempts`);
    }
    await new Promise((r) => setTimeout(r, attempt * 100));
  }

  return {
    httpSocketPath,
    socksSocketPath,
    httpBridgeProcess,
    socksBridgeProcess,
    httpProxyPort,
    socksProxyPort,
  };
}

/**
 * Check if a domain matches a pattern (supports *.domain.com).
 * Original: CHB() in chunks.53.mjs:2725-2731
 */
function matchesDomainPattern(domain: string, pattern: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();

  if (normalizedPattern.startsWith('*.')) {
    const suffix = normalizedPattern.slice(2);
    return normalizedDomain.endsWith('.' + suffix) || normalizedDomain === suffix;
  }

  return normalizedDomain === normalizedPattern;
}

/**
 * Check if a domain is allowed by network policy.
 * Original: NHB() in chunks.53.mjs:2733-2752
 *
 * @param port - Destination port
 * @param host - Destination host
 * @param permissionCallback - Callback for permission prompts
 */
async function checkDomainAllowed(
  port: number,
  host: string,
  permissionCallback: PermissionCallback
): Promise<boolean> {
  const normalized = (host || '').trim().toLowerCase();
  if (!normalized) return false;

  const cacheKey = `${normalized}:${port}`;
  const cached = domainDecisionCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const config = getSandboxConfig();
  if (!config) return false;

  // Deny list priority
  for (const pattern of config.network.deniedDomains) {
    if (matchesDomainPattern(normalized, pattern)) {
      domainDecisionCache.set(cacheKey, false);
      return false;
    }
  }

  // Allow list
  for (const pattern of config.network.allowedDomains) {
    if (matchesDomainPattern(normalized, pattern)) {
      domainDecisionCache.set(cacheKey, true);
      return true;
    }
  }

  // Permission callback (User prompt)
  try {
    const ok = await permissionCallback({ host: normalized, port });
    domainDecisionCache.set(cacheKey, ok);
    return ok;
  } catch (err) {
    return false;
  }
}

/**
 * Get environment variables for the sandbox.
 * Original: M01() in chunks.53.mjs:2005-2016
 */
export function getSandboxEnvVars(httpPort?: number, socksPort?: number): string[] {
  const env = ['SANDBOX_RUNTIME=1', 'TMPDIR=/tmp/claude'];
  if (!httpPort && !socksPort) return env;

  const noProxy = [
    'localhost',
    '127.0.0.1',
    '::1',
    '*.local',
    '.local',
    '169.254.0.0/16',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
  ].join(',');

  env.push(`NO_PROXY=${noProxy}`, `no_proxy=${noProxy}`);

  if (httpPort) {
    const proxyUrl = `http://localhost:${httpPort}`;
    env.push(`HTTP_PROXY=${proxyUrl}`, `HTTPS_PROXY=${proxyUrl}`, `http_proxy=${proxyUrl}`, `https_proxy=${proxyUrl}`);
  }

  if (socksPort) {
    const socksUrl = `socks5h://localhost:${socksPort}`;
    env.push(`ALL_PROXY=${socksUrl}`, `all_proxy=${socksUrl}`);

    if (getPlatform() === 'macos') {
      env.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${socksPort} %h %p'`);
    }

    env.push(`FTP_PROXY=${socksUrl}`, `ftp_proxy=${socksUrl}`, `RSYNC_PROXY=localhost:${socksPort}`);
    
    const dockerProxyUrl = `http://localhost:${httpPort || socksPort}`;
    env.push(`DOCKER_HTTP_PROXY=${dockerProxyUrl}`, `DOCKER_HTTPS_PROXY=${dockerProxyUrl}`);

    if (httpPort) {
      env.push('CLOUDSDK_PROXY_TYPE=https', 'CLOUDSDK_PROXY_ADDRESS=localhost', `CLOUDSDK_PROXY_PORT=${httpPort}`);
    }

    env.push(`GRPC_PROXY=${socksUrl}`, `grpc_proxy=${socksUrl}`);
  }

  return env;
}

/**
 * Shutdown sandbox.
 * Original: qr1() in chunks.53.mjs
 */
async function shutdown(): Promise<void> {
  if (violationMonitorCleanup) {
    violationMonitorCleanup();
    violationMonitorCleanup = undefined;
  }

  // Stop proxy servers
  if (httpProxyServer) {
    await new Promise<void>((resolve) => httpProxyServer!.close(() => resolve())).catch(() => {});
    httpProxyServer = undefined;
  }
  if (socksProxyServer) {
    await new Promise<void>((resolve) => socksProxyServer!.close(() => resolve())).catch(() => {});
    socksProxyServer = undefined;
  }

  // Stop Linux bridge processes and remove sockets
  if (networkInfrastructure?.linuxBridge) {
    const { httpBridgeProcess, socksBridgeProcess, httpSocketPath, socksSocketPath } =
      networkInfrastructure.linuxBridge;

    const killIfPossible = (p: any) => {
      if (!p || !p.pid) return;
      try { process.kill(p.pid, 'SIGTERM'); } catch {}
    };

    killIfPossible(httpBridgeProcess);
    killIfPossible(socksBridgeProcess);

    try {
      if (httpSocketPath && fs.existsSync(httpSocketPath)) fs.unlinkSync(httpSocketPath);
      if (socksSocketPath && fs.existsSync(socksSocketPath)) fs.unlinkSync(socksSocketPath);
    } catch {
      // ignore
    }
  }
}

/**
 * Register cleanup handlers on process exit.
 * Original: _58() in chunks.53.mjs
 */
function registerCleanupOnExit(): void {
  if (cleanupOnExitRegistered) return;
  cleanupOnExitRegistered = true;

  const handler = async () => {
    await shutdown().catch(() => {});
  };

  process.on('exit', () => {
    // best-effort sync cleanup
    try {
      if (violationMonitorCleanup) violationMonitorCleanup();
    } catch {
      // ignore
    }
  });
  process.on('SIGINT', () => {
    handler().finally(() => process.exit(130));
  });
  process.on('SIGTERM', () => {
    handler().finally(() => process.exit(143));
  });
}

// ============================================
// Command Wrapping
// ============================================

/**
 * Wrap command with sandbox.
 * Original: WZ8() in chunks.55.mjs
 *
 * @param options - Wrapper options
 * @returns Wrapped command string
 */
async function wrapWithSandbox(options: SandboxWrapperOptions): Promise<string> {
  const platform = getPlatform();

  if (platform === 'linux') {
    return wrapWithLinuxSandbox(options);
  } else if (platform === 'macos') {
    return wrapWithMacOSSandbox(options);
  }

  // Unsupported platform, return command unchanged
  return options.command;
}

/**
 * Wrap command with Linux sandbox.
 * Original: IHB() in chunks.53.mjs:2339-2423
 */
async function wrapWithLinuxSandbox(
  options: SandboxWrapperOptions
): Promise<string> {
  const {
    command,
    needsNetworkRestriction,
    httpSocketPath,
    socksSocketPath,
    httpProxyPort,
    socksProxyPort,
    readConfig,
    writeConfig,
    enableWeakerNestedSandbox,
    allowAllUnixSockets,
    binShell,
    ripgrepConfig = { command: 'rg' },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    abortSignal,
  } = options;

  const hasReadRestrictions = !!(readConfig && readConfig.denyOnly.length > 0);
  const hasWriteRestrictions = writeConfig !== undefined;

  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  const bwrapArgs: string[] = ['--new-session', '--die-with-parent'];
  let seccompFilter: string | undefined;

  try {
    if (!allowAllUnixSockets) {
      seccompFilter = getBestEffortSeccompFilter();
      if (!seccompFilter) {
        // console.warn('[Sandbox Linux] Seccomp filter not available...');
      } else {
        // In the original, there's logic to add to cleanup set if it's a temp file
        // For now, we assume it's pre-generated or handled by the system.
      }
    }

    // Network isolation
    if (needsNetworkRestriction) {
      bwrapArgs.push('--unshare-net');
      if (httpSocketPath && socksSocketPath) {
        if (!fs.existsSync(httpSocketPath)) {
          throw new Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}`);
        }
        if (!fs.existsSync(socksSocketPath)) {
          throw new Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}`);
        }

        bwrapArgs.push('--bind', httpSocketPath, httpSocketPath);
        bwrapArgs.push('--bind', socksSocketPath, socksSocketPath);

        // Container-side proxy ports are fixed (3128, 1080)
        const envVars = getSandboxEnvVars(3128, 1080);
        for (const env of envVars) {
          const idx = env.indexOf('=');
          bwrapArgs.push('--setenv', env.slice(0, idx), env.slice(idx + 1));
        }

        if (httpProxyPort !== undefined) {
          bwrapArgs.push('--setenv', 'CLAUDE_CODE_HOST_HTTP_PROXY_PORT', String(httpProxyPort));
        }
        if (socksProxyPort !== undefined) {
          bwrapArgs.push('--setenv', 'CLAUDE_CODE_HOST_SOCKS_PROXY_PORT', String(socksProxyPort));
        }
      }
    }

    // Filesystem restrictions
    // Original: C58() in chunks.53.mjs:2284-2337
    const fsArgs = await buildFilesystemRestrictions(
      readConfig,
      writeConfig,
      ripgrepConfig,
      mandatoryDenySearchDepth,
      allowGitConfig,
      abortSignal
    );
    bwrapArgs.push(...fsArgs);

    // Devices and PID namespace
    bwrapArgs.push('--dev', '/dev');
    bwrapArgs.push('--unshare-pid');
    if (!enableWeakerNestedSandbox) {
      bwrapArgs.push('--proc', '/proc');
    }

    const shell = binShell || 'bash';
    const shellPath = resolveShellPath(shell);

    bwrapArgs.push('--', shellPath, '-c');

    let finalInner: string;
    if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
      // Original: $58() in chunks.53.mjs:2267-2282
      finalInner = buildNetworkAndSeccompCommand(
        httpSocketPath,
        socksSocketPath,
        command,
        seccompFilter,
        shellPath
      );
    } else if (seccompFilter) {
      const applySeccomp = findApplySeccompBinaryOrThrow();
      finalInner = shellQuote([applySeccomp, seccompFilter, shellPath, '-c', command]);
    } else {
      finalInner = command;
    }

    bwrapArgs.push(finalInner);

    const restrictions: string[] = [];
    if (needsNetworkRestriction) restrictions.push('network');
    if (hasReadRestrictions || hasWriteRestrictions) restrictions.push('filesystem');
    if (seccompFilter) restrictions.push('seccomp(unix-block)');

    // console.log(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(', ')} restrictions)`);
    return shellQuote(['bwrap', ...bwrapArgs]);
  } catch (err) {
    throw err;
  }
}

/**
 * Build filesystem restriction arguments for bwrap.
 * Original: C58() in chunks.53.mjs:2284-2337
 */
async function buildFilesystemRestrictions(
  readConfig: ReadConfig | undefined,
  writeConfig: WriteConfig | undefined,
  ripgrepConfig: { command: string; args?: string[] },
  searchDepth: number,
  allowGitConfig: boolean,
  abortSignal?: AbortSignal
): Promise<string[]> {
  const args: string[] = [];

  if (writeConfig) {
    args.push('--ro-bind', '/', '/');
    const writablePaths: string[] = [];

    for (const p of writeConfig.allowOnly || []) {
      const normalized = normalizePath(p);
      if (normalized.startsWith('/dev/')) continue;
      if (!fs.existsSync(normalized)) continue;
      args.push('--bind', normalized, normalized);
      writablePaths.push(normalized);
    }

    const denyPaths = [
      ...(writeConfig.denyWithinAllow || []),
      ...(await findDangerousFiles(ripgrepConfig, searchDepth, allowGitConfig, abortSignal, writablePaths)),
    ];

    for (const p of denyPaths) {
      const normalized = normalizePath(p);
      if (normalized.startsWith('/dev/')) continue;

      // Anti-symlink logic
      // Original: F58() in chunks.53.mjs:2090-2106
      const symlinkViolation = findSymlinkViolation(normalized, writablePaths);
      if (symlinkViolation) {
        args.push('--ro-bind', '/dev/null', symlinkViolation);
        continue;
      }

      if (!fs.existsSync(normalized)) {
        let parent = path.dirname(normalized);
        while (parent !== '/' && !fs.existsSync(parent)) parent = path.dirname(parent);

        if (writablePaths.some((wp) => parent.startsWith(wp + '/') || parent === wp || normalized.startsWith(wp + '/'))) {
          // Original: H58() in chunks.53.mjs:2108-2118
          const target = findFirstNonExistent(normalized);
          args.push('--ro-bind', '/dev/null', target);
        }
        continue;
      }

      if (writablePaths.some((wp) => normalized.startsWith(wp + '/') || normalized === wp)) {
        args.push('--ro-bind', normalized, normalized);
      }
    }
  } else {
    args.push('--bind', '/', '/');
  }

  // Read restrictions
  const readDenyPaths = [...(readConfig?.denyOnly || [])];
  if (fs.existsSync('/etc/ssh/ssh_config.d')) {
    readDenyPaths.push('/etc/ssh/ssh_config.d');
  }

  for (const p of readDenyPaths) {
    const normalized = normalizePath(p);
    if (!fs.existsSync(normalized)) continue;
    if (fs.statSync(normalized).isDirectory()) {
      args.push('--tmpfs', normalized);
    } else {
      args.push('--ro-bind', '/dev/null', normalized);
    }
  }

  return args;
}

/**
 * Scan for dangerous config files under writable roots.
 * Original: E58() in chunks.53.mjs:2120-2159
 */
async function findDangerousFiles(
  ripgrepConfig: { command: string; args?: string[] },
  searchDepth: number,
  allowGitConfig: boolean,
  abortSignal: AbortSignal | undefined,
  writablePaths: string[]
): Promise<string[]> {
  const rg = ripgrepConfig.command;
  const extraArgs = ripgrepConfig.args || [];

  const protectedNames = new Set<string>(SANDBOX_CONSTANTS.PROTECTED_FILES as unknown as string[]);
  const protectedDirs = new Set<string>(SANDBOX_CONSTANTS.PROTECTED_DIRS as unknown as string[]);

  if (allowGitConfig) {
    protectedNames.delete('.gitconfig');
    protectedDirs.delete('.git');
  }

  const results = new Set<string>();
  const cwd = process.cwd();

  // Basic set from home/cwd
  const baseSet = [
    ...Array.from(protectedNames).map(n => path.resolve(cwd, n)),
    path.resolve(cwd, '.git/hooks')
  ];
  if (!allowGitConfig) baseSet.push(path.resolve(cwd, '.git/config'));
  
  for (const p of baseSet) results.add(p);

  // Scan with ripgrep
  const iglobs: string[] = [];
  for (const n of protectedNames) iglobs.push('--iglob', n);
  iglobs.push('--iglob', '**/.git/hooks/**');
  if (!allowGitConfig) iglobs.push('--iglob', '**/.git/config');

  let rgFiles: string[] = [];
  try {
    const args = [
      '--files',
      '--hidden',
      '--max-depth', String(searchDepth),
      ...iglobs,
      '-g', '!**/node_modules/**',
      ...extraArgs,
      cwd
    ];
    // console.log(`[Sandbox] Scanning for dangerous files: rg ${args.join(' ')}`);
    // Note: In original it's a wrapper aFB
    const proc = spawnSync(rg, args, { encoding: 'utf8', timeout: 10000, signal: abortSignal });
    if (proc.status === 0 && proc.stdout) {
      rgFiles = proc.stdout.split('\n').map(l => l.trim()).filter(Boolean);
    }
  } catch (err) {
    // ignore
  }

  for (const file of rgFiles) {
    const fullPath = path.resolve(cwd, file);
    let matched = false;
    for (const pDir of ['.git']) { // Original O01 returns more dirs but .git is key
      const lowerFile = fullPath.toLowerCase();
      const lowerDir = pDir.toLowerCase();
      if (lowerFile.includes(path.sep + lowerDir + path.sep) || lowerFile.endsWith(path.sep + lowerDir)) {
        if (pDir === '.git') {
          const idx = lowerFile.indexOf(path.sep + '.git' + path.sep);
          if (idx !== -1) {
            const gitRoot = fullPath.slice(0, idx + 5);
            if (lowerFile.includes('.git/hooks')) results.add(path.join(gitRoot, 'hooks'));
            else if (lowerFile.includes('.git/config')) results.add(path.join(gitRoot, 'config'));
          }
        }
        matched = true;
        break;
      }
    }
    if (!matched) results.add(fullPath);
  }

  return Array.from(results);
}

/**
 * Detect symlink within a path that points to a restricted area.
 * Original: F58() in chunks.53.mjs:2090-2106
 */
function findSymlinkViolation(fullPath: string, writablePaths: string[]): string | null {
  const parts = fullPath.split(path.sep);
  let current = '';
  for (const part of parts) {
    if (!part) continue;
    current = current + path.sep + part;
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        if (writablePaths.some(wp => current.startsWith(wp + '/') || current === wp)) {
          return current;
        }
      }
    } catch {
      break;
    }
  }
  return null;
}

/**
 * Find the first non-existent component in a path.
 * Original: H58() in chunks.53.mjs:2108-2118
 */
function findFirstNonExistent(fullPath: string): string {
  const parts = fullPath.split(path.sep);
  let current = '';
  for (const part of parts) {
    if (!part) continue;
    const next = current + path.sep + part;
    if (!fs.existsSync(next)) return next;
    current = next;
  }
  return fullPath;
}

/**
 * Build inner command for network reverse-bridges and optional seccomp.
 * Original: $58() in chunks.53.mjs:2267-2282
 */
function buildNetworkAndSeccompCommand(
  httpSocketPath: string,
  socksSocketPath: string,
  userCommand: string,
  seccompFilter: string | undefined,
  shellPath: string
): string {
  const bridgeScript = [
    `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,
    `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,
    'trap "kill %1 %2 2>/dev/null; exit" EXIT',
  ];

  if (seccompFilter) {
    const applySeccomp = findApplySeccompBinaryOrThrow();
    const seccompCmd = shellQuote([applySeccomp, seccompFilter, shellPath, '-c', userCommand]);
    const fullScript = [...bridgeScript, seccompCmd].join('\n');
    return `${shellPath} -c ${shellQuote([fullScript])}`;
  } else {
    const fullScript = [...bridgeScript, `eval ${shellQuote([userCommand])}`].join('\n');
    return `${shellPath} -c ${shellQuote([fullScript])}`;
  }
}

/**
 * Wrap command with macOS sandbox.
 * Original: HHB() in chunks.53.mjs:2576-2615
 */
async function wrapWithMacOSSandbox(options: SandboxWrapperOptions): Promise<string> {
  const {
    command,
    needsNetworkRestriction,
    httpProxyPort,
    socksProxyPort,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    readConfig,
    writeConfig,
    allowPty,
    allowGitConfig = false,
    binShell,
  } = options;

  const hasReadRestrictions = !!(readConfig && readConfig.denyOnly.length > 0);
  const hasWriteRestrictions = writeConfig !== undefined;

  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  const logTag = encodeCommandTag(command);
  const profile = generateSandboxProfile({
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    allowPty,
    allowGitConfig,
    logTag,
  });

  const envVars = getSandboxEnvVars(httpProxyPort, socksProxyPort);
  const shell = binShell || 'bash';
  const shellPath = resolveShellPath(shell);

  const wrapped = shellQuote(['env', ...envVars, 'sandbox-exec', '-p', profile, shellPath, '-c', command]);
  return wrapped;
}

/**
 * Generate macOS Seatbelt sandbox profile.
 * Original: M58() in chunks.53.mjs:2531-2560
 */
function generateSandboxProfile(params: {
  readConfig?: ReadConfig;
  writeConfig?: WriteConfig;
  httpProxyPort?: number;
  socksProxyPort?: number;
  needsNetworkRestriction: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  allowLocalBinding?: boolean;
  allowPty?: boolean;
  allowGitConfig?: boolean;
  logTag: string;
}): string {
  const {
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    allowPty,
    allowGitConfig,
    logTag,
  } = params;

  const rules: string[] = [
    '(version 1)',
    `(deny default (with message ${escapeSandboxString(logTag)}))`,
    '',
    `; LogTag: ${logTag}`,
    '',
    '; Essential permissions',
    '(allow process-exec)',
    '(allow process-fork)',
    '(allow process-info* (target same-sandbox))',
    '(allow signal (target same-sandbox))',
    '(allow mach-priv-task-port (target same-sandbox))',
    '',
    '(allow user-preference-read)',
    '',
    '(allow mach-lookup',
    '  (global-name "com.apple.audio.systemsoundserver")',
    '  (global-name "com.apple.distributed_notifications@Uv3")',
    '  (global-name "com.apple.FontObjectsServer")',
    '  (global-name "com.apple.fonts")',
    '  (global-name "com.apple.logd")',
    '  (global-name "com.apple.lsd.mapdb")',
    '  (global-name "com.apple.PowerManagement.control")',
    '  (global-name "com.apple.system.logger")',
    '  (global-name "com.apple.system.notification_center")',
    '  (global-name "com.apple.trustd.agent")',
    '  (global-name "com.apple.system.opendirectoryd.libinfo")',
    '  (global-name "com.apple.system.opendirectoryd.membership")',
    '  (global-name "com.apple.bsd.dirhelper")',
    '  (global-name "com.apple.securityd.xpc")',
    '  (global-name "com.apple.coreservices.launchservicesd")',
    ')',
    '',
    '(allow ipc-posix-shm)',
    '(allow ipc-posix-sem)',
    '',
    '(allow iokit-open',
    '  (iokit-registry-entry-class "IOSurfaceRootUserClient")',
    '  (iokit-registry-entry-class "RootDomainUserClient")',
    '  (iokit-user-client-class "IOSurfaceSendRight")',
    ')',
    '(allow iokit-get-properties)',
    '',
    '(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))',
    '',
    '(allow sysctl-read)',
    '(allow sysctl-write',
    '  (sysctl-name "kern.tcsm_enable")',
    ')',
    '',
    '(allow distributed-notification-post)',
    '(allow mach-lookup (global-name "com.apple.SecurityServer"))',
    '',
    '(allow file-ioctl (literal "/dev/null"))',
    '(allow file-ioctl (literal "/dev/zero"))',
    '(allow file-ioctl (literal "/dev/random"))',
    '(allow file-ioctl (literal "/dev/urandom"))',
    '(allow file-ioctl (literal "/dev/dtracehelper"))',
    '(allow file-ioctl (literal "/dev/tty"))',
    '',
    '(allow file-ioctl file-read-data file-write-data',
    '  (require-all',
    '    (literal "/dev/null")',
    '    (vnode-type CHARACTER-DEVICE)',
    '  )',
    ')',
  ];

  if (!needsNetworkRestriction) {
    rules.push('(allow network*)');
  } else {
    if (allowLocalBinding) {
      rules.push('(allow network-bind (local ip "localhost:*"))');
      rules.push('(allow network-inbound (local ip "localhost:*"))');
      rules.push('(allow network-outbound (local ip "localhost:*"))');
    }
    if (allowAllUnixSockets) {
      rules.push('(allow network* (subpath "/"))');
    } else if (allowUnixSockets && allowUnixSockets.length > 0) {
      for (const socket of allowUnixSockets) {
        rules.push(`(allow network* (subpath ${escapeSandboxString(normalizePath(socket))}))`);
      }
    }
    if (httpProxyPort !== undefined) {
      rules.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
      rules.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
      rules.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
    }
    if (socksProxyPort !== undefined) {
      rules.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
      rules.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
      rules.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
    }
  }

  rules.push('');
  rules.push('; File read');
  rules.push(...generateReadRules(readConfig, logTag));
  rules.push('');
  rules.push('; File write');
  rules.push(...generateWriteRules(writeConfig, logTag, !!allowGitConfig));

  if (allowPty) {
    rules.push('');
    rules.push('; PTY support');
    rules.push('(allow pseudo-tty)');
    rules.push('(allow file-ioctl (literal "/dev/ptmx") (regex #"^/dev/ttys"))');
    rules.push('(allow file-read* file-write* (literal "/dev/ptmx") (regex #"^/dev/ttys"))');
  }

  return rules.join('\n');
}

function generateReadRules(config: ReadConfig | undefined, logTag: string): string[] {
  if (!config) return ['(allow file-read*)'];
  const rules: string[] = ['(allow file-read*)'];
  for (const p of config.denyOnly) {
    const normalized = normalizePath(p);
    if (normalized.includes('*') || normalized.includes('?')) {
      rules.push(`(deny file-read* (regex ${escapeSandboxString(globToRegex(normalized))}) (with message ${escapeSandboxString(logTag)}))`);
    } else {
      rules.push(`(deny file-read* (subpath ${escapeSandboxString(normalized)}) (with message ${escapeSandboxString(logTag)}))`);
    }
  }
  rules.push(...generateUnlinkRules(config.denyOnly, logTag));
  return rules;
}

function generateWriteRules(config: WriteConfig | undefined, logTag: string, allowGitConfig: boolean): string[] {
  if (!config) return ['(allow file-write*)'];
  const rules: string[] = [];
  const tmpRoots = getMacTmpDirRoots();
  for (const root of tmpRoots) {
    rules.push(`(allow file-write* (subpath ${escapeSandboxString(root)}) (with message ${escapeSandboxString(logTag)}))`);
  }

  for (const p of config.allowOnly) {
    const normalized = normalizePath(p);
    if (normalized.includes('*') || normalized.includes('?')) {
      rules.push(`(allow file-write* (regex ${escapeSandboxString(globToRegex(normalized))}) (with message ${escapeSandboxString(logTag)}))`);
    } else {
      rules.push(`(allow file-write* (subpath ${escapeSandboxString(normalized)}) (with message ${escapeSandboxString(logTag)}))`);
    }
  }

  const denyPaths = [...config.denyWithinAllow, ...getProtectedPaths(allowGitConfig)];
  for (const p of denyPaths) {
    const normalized = normalizePath(p);
    if (normalized.includes('*') || normalized.includes('?')) {
      rules.push(`(deny file-write* (regex ${escapeSandboxString(globToRegex(normalized))}) (with message ${escapeSandboxString(logTag)}))`);
    } else {
      rules.push(`(deny file-write* (subpath ${escapeSandboxString(normalized)}) (with message ${escapeSandboxString(logTag)}))`);
    }
  }
  rules.push(...generateUnlinkRules(denyPaths, logTag));
  return rules;
}

function generateUnlinkRules(paths: string[], logTag: string): string[] {
  const rules: string[] = [];
  for (const p of paths) {
    const normalized = normalizePath(p);
    if (normalized.includes('*') || normalized.includes('?')) {
      const regex = globToRegex(normalized);
      rules.push(`(deny file-write-unlink (regex ${escapeSandboxString(regex)}) (with message ${escapeSandboxString(logTag)}))`);
      const prefix = normalized.split(/[*?]/)[0];
      if (prefix && prefix !== '/') {
        const dir = prefix.endsWith('/') ? prefix.slice(0, -1) : path.dirname(prefix);
        rules.push(`(deny file-write-unlink (literal ${escapeSandboxString(dir)}) (with message ${escapeSandboxString(logTag)}))`);
        for (const parent of getParentDirectories(dir)) {
          rules.push(`(deny file-write-unlink (literal ${escapeSandboxString(parent)}) (with message ${escapeSandboxString(logTag)}))`);
        }
      }
    } else {
      rules.push(`(deny file-write-unlink (subpath ${escapeSandboxString(normalized)}) (with message ${escapeSandboxString(logTag)}))`);
      for (const parent of getParentDirectories(normalized)) {
        rules.push(`(deny file-write-unlink (literal ${escapeSandboxString(parent)}) (with message ${escapeSandboxString(logTag)}))`);
      }
    }
  }
  return rules;
}

function getParentDirectories(p: string): string[] {
  const dirs: string[] = [];
  let current = path.dirname(p);
  while (current !== '/' && current !== '.') {
    dirs.push(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return dirs;
}

function getMacTmpDirRoots(): string[] {
  const tmp = process.env.TMPDIR;
  if (!tmp) return [];
  if (!tmp.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
  const root = tmp.replace(/\/T\/?$/, '');
  if (root.startsWith('/private/var/')) return [root, root.replace('/private', '')];
  if (root.startsWith('/var/')) return [root, '/private' + root];
  return [root];
}

function getProtectedPaths(allowGitConfig: boolean): string[] {
  const cwd = process.cwd();
  const paths: string[] = [];
  for (const f of SANDBOX_CONSTANTS.PROTECTED_FILES as unknown as string[]) {
    if (allowGitConfig && f === '.gitconfig') continue;
    paths.push(path.resolve(cwd, f));
    paths.push(`**/${f}`);
  }
  // Simplified logic for protected dirs
  paths.push(path.resolve(cwd, '.git/hooks'));
  paths.push('**/.git/hooks/**');
  if (!allowGitConfig) {
    paths.push(path.resolve(cwd, '.git/config'));
    paths.push('**/.git/config');
  }
  return [...new Set(paths)];
}

function escapeSandboxString(s: string): string {
  return JSON.stringify(s);
}

function globToRegex(glob: string): string {
  return '^' + glob
    .replace(/[.^$+{}()|\\]/g, '\\$&')
    .replace(/\[([^\]]*?)$/g, '\\[$1')
    .replace(/\*\*\//g, '__GLOBSTAR_SLASH__')
    .replace(/\*\*/g, '__GLOBSTAR__')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')
    .replace(/__GLOBSTAR_SLASH__/g, '(.*/)?')
    .replace(/__GLOBSTAR__/g, '.*') + '$';
}

/**
 * Start violation monitor on macOS.
 * Original: EHB() in chunks.53.mjs:2617-2663
 */
function startMacOSViolationMonitor(
  store: ISandboxViolationStore,
  ignoreConfig?: IgnoreViolationsConfig
): () => void {
  const cmdRegex = /CMD64_(.+?)_END/;
  const sandboxRegex = /Sandbox:\s+(.+)$/;
  const globalIgnores = ignoreConfig?.['*'] || [];
  const perCommandIgnores = ignoreConfig ? Object.entries(ignoreConfig).filter(([k]) => k !== '*') : [];

  const logTagSuffix = '_SBX'; // Simplified, original uses VHB which is random but consistent per session

  const logProcess = spawn('log', ['stream', '--predicate', `(eventMessage ENDSWITH "${logTagSuffix}")`, '--style', 'compact']);

  logProcess.stdout?.on('data', (data) => {
    const lines = data.toString().split('\n');
    const denyLine = lines.find((l: string) => l.includes('Sandbox:') && l.includes('deny'));
    const tagLine = lines.find((l: string) => l.startsWith('CMD64_'));

    if (!denyLine) return;

    const match = denyLine.match(sandboxRegex);
    if (!match?.[1]) return;

    const violation = match[1];
    let command: string | undefined;
    let encodedCommand: string | undefined;

    if (tagLine) {
      const tagMatch = tagLine.match(cmdRegex);
      const tagVal = tagMatch?.[1];
      if (tagVal) {
        encodedCommand = tagVal;
        try {
          command = Buffer.from(tagVal, 'base64').toString('utf8');
        } catch {}
      }
    }

    // Filter noisy system violations
    if (
      violation.includes('mDNSResponder') ||
      violation.includes('mach-lookup com.apple.diagnosticd') ||
      violation.includes('mach-lookup com.apple.analyticsd')
    ) {
      return;
    }

    // Apply ignores
    if (ignoreConfig && command) {
      if (globalIgnores.some((p) => violation.includes(p))) return;
      for (const [cmdPattern, patterns] of perCommandIgnores) {
        if (command.includes(cmdPattern)) {
          if (patterns && patterns.some((p) => violation.includes(p))) return;
        }
      }
    }

    store.addViolation({
      line: violation,
      command,
      encodedCommand,
      timestamp: new Date(),
    });
  });

  return () => {
    logProcess.kill('SIGTERM');
  };
}

// ============================================
// Helpers
// ============================================

function ensureDir(dirPath: string): void {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch {
    // ignore
  }
}

function getSandboxTempDir(): string {
  return SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR;
}

/**
 * Normalize path and handle home expansion.
 */
function normalizePath(inputPath: string): string {
  let p = inputPath.trim();
  if (!p) return p;

  if (p.startsWith('~/')) {
    p = path.join(os.homedir(), p.slice(2));
  }

  if (!path.isAbsolute(p)) {
    p = path.resolve(process.cwd(), p);
  }

  return path.normalize(p);
}

/**
 * Shell quote arguments for command string.
 */
function shellQuote(args: string[]): string {
  const quote = (s: string) => {
    if (s.length === 0) return "''";
    if (/^[A-Za-z0-9_\-.,/:=@]+$/.test(s)) return s;
    return `'${s.replace(/'/g, `'"'"'`)}'`;
  };
  return args.map(quote).join(' ');
}

/**
 * Resolve full path to shell binary.
 */
function resolveShellPath(shell: string): string {
  const result = spawnSync('which', [shell], { encoding: 'utf8', timeout: 1000 });
  if (result.status !== 0 || !result.stdout) {
    throw new Error(`Shell '${shell}' not found in PATH`);
  }
  return result.stdout.trim();
}

/**
 * Get best-effort seccomp filter path.
 */
function getBestEffortSeccompFilter(): string | undefined {
  return findSeccompBpfFilter() || undefined;
}

/**
 * Find apply-seccomp binary or throw.
 */
function findApplySeccompBinaryOrThrow(): string {
  const p = findApplySeccompBinary();
  if (!p) throw new Error('apply-seccomp binary not found');
  return p;
}

function getConfigPathsToProtect(allowGitConfig: boolean): string[] {
  const out: string[] = [];
  for (const f of SANDBOX_CONSTANTS.PROTECTED_FILES as unknown as string[]) {
    if (allowGitConfig && f === '.gitconfig') continue;
    out.push(path.join(os.homedir(), f));
  }
  // Also protect git metadata directories inside writable roots (pattern form).
  if (!allowGitConfig) {
    out.push('**/.git/**');
  }
  return out;
}

// ============================================
// Status Getters
// ============================================

/**
 * Check if sandboxing is enabled.
 */
function isSandboxingEnabled(): boolean {
  return isSandboxingEnabledConfig();
}

/**
 * Check if auto-allow bash when sandboxed is enabled.
 */
function isAutoAllowBashIfSandboxedEnabled(): boolean {
  return isAutoAllowBashConfig();
}

/**
 * Check if unsandboxed commands are allowed.
 */
function areUnsandboxedCommandsAllowed(): boolean {
  return areUnsandboxedCommandsAllowedConfig();
}

// ============================================
// Network Infrastructure Getters
// ============================================

/**
 * Get HTTP proxy port.
 */
function getProxyPort(): number | undefined {
  return networkInfrastructure?.httpProxyPort;
}

/**
 * Get SOCKS proxy port.
 */
function getSocksProxyPort(): number | undefined {
  return networkInfrastructure?.socksProxyPort;
}

/**
 * Get Linux HTTP socket path.
 */
function getLinuxHttpSocketPath(): string | undefined {
  return networkInfrastructure?.linuxBridge?.httpSocketPath;
}

/**
 * Get Linux SOCKS socket path.
 */
function getLinuxSocksSocketPath(): string | undefined {
  return networkInfrastructure?.linuxBridge?.socksSocketPath;
}

/**
 * Wait for network initialization.
 */
async function waitForNetworkInitialization(): Promise<NetworkInfrastructure | undefined> {
  if (initializationPromise) {
    return initializationPromise;
  }
  return networkInfrastructure;
}

// ============================================
// Linux Glob Pattern Warnings
// ============================================

/**
 * Get Linux glob pattern warnings.
 */
function getLinuxGlobPatternWarnings(): string[] {
  return [...linuxGlobPatternWarnings];
}

/**
 * Add Linux glob pattern warning.
 */
function addLinuxGlobPatternWarning(pattern: string): void {
  if (!linuxGlobPatternWarnings.includes(pattern)) {
    linuxGlobPatternWarnings.push(pattern);
    console.warn(
      `[Sandbox Linux] Glob pattern skipped (not supported on Linux): ${pattern}`
    );
  }
}

// ============================================
// Sandbox Manager Object
// ============================================

/**
 * Central sandbox management object.
 * Original: XB in chunks.55.mjs:1518-1546
 */
export const sandboxManager: SandboxManager = {
  // Lifecycle
  initialize,
  reset,
  refreshConfig,

  // Status checks
  isSandboxingEnabled,
  isAutoAllowBashIfSandboxedEnabled,
  areUnsandboxedCommandsAllowed,
  areSandboxSettingsLockedByPolicy,
  isSupportedPlatform,
  checkDependencies,

  // Settings
  setSandboxSettings: setSettingsInternal,
  getExcludedCommands,

  // Config getters
  getFsReadConfig,
  getFsWriteConfig,
  getNetworkRestrictionConfig,
  getIgnoreViolations,
  getAllowUnixSockets,
  getAllowLocalBinding,
  getEnableWeakerNestedSandbox,

  // Network infrastructure
  getProxyPort,
  getSocksProxyPort,
  getLinuxHttpSocketPath,
  getLinuxSocksSocketPath,
  waitForNetworkInitialization,

  // Command wrapping
  wrapWithSandbox,

  // Violation tracking
  getSandboxViolationStore: getGlobalViolationStore,
  annotateStderrWithSandboxFailures,

  // Linux-specific
  getLinuxGlobPatternWarnings,
};

// ============================================
// Convenience Functions
// ============================================

/**
 * Check if command should be sandboxed.
 * Original: KEA() in chunks.124.mjs:1217-1223
 *
 * @param command - Command to check
 * @param dangerouslyDisableSandbox - Whether bypass is requested
 * @returns Whether command should run in sandbox
 */
export function isBashSandboxed(
  command: string,
  dangerouslyDisableSandbox = false
): boolean {
  // 1. Is sandbox enabled?
  if (!isSandboxingEnabled()) {
    return false;
  }

  // 2. Is dangerouslyDisableSandbox=true AND allowed by policy?
  if (dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()) {
    return false;
  }

  // 3. Is command empty?
  if (!command || command.trim().length === 0) {
    return false;
  }

  // 4. Is command in excluded list?
  const excludedCommands = getExcludedCommands();
  for (const pattern of excludedCommands) {
    if (pattern === command) return false;
    if (pattern.endsWith(':*') && command.startsWith(pattern.slice(0, -2))) {
      return false;
    }
    if (pattern.endsWith(' *') && command.startsWith(pattern.slice(0, -2) + ' ')) {
      return false;
    }
  }

  // 5. Default: run in sandbox
  return true;
}

// ============================================
// Export
// ============================================

// NOTE: 函数/对象已在声明处导出；移除重复聚合导出。
