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
// Placeholder Implementations
// ============================================

/**
 * Initialize HTTP proxy (placeholder).
 * Would start an HTTP proxy server for network filtering.
 */
async function initializeHTTPProxy(
  permissionCallback: PermissionCallback
): Promise<number> {
  if (httpProxyServer) {
    const addr = httpProxyServer.address();
    if (addr && typeof addr === 'object') return addr.port;
  }

  httpProxyServer = http.createServer();

  // Basic forward proxy for absolute-form HTTP requests.
  httpProxyServer.on('request', async (req, res) => {
    try {
      const urlStr = req.url ?? '';
      // Proxies usually receive absolute URLs; fall back to Host header.
      const parsed = (() => {
        try {
          if (/^https?:\/\//i.test(urlStr)) return new URL(urlStr);
        } catch {
          // ignore
        }
        const host = String(req.headers.host ?? '');
        return new URL(`http://${host}${urlStr.startsWith('/') ? urlStr : `/${urlStr}`}`);
      })();

      const hostname = parsed.hostname;
      const port = Number(parsed.port || 80);
      const allowed = await checkDomainAllowed(hostname, 'http', permissionCallback);
      if (!allowed) {
        res.writeHead(403, { 'content-type': 'text/plain' });
        res.end('Blocked by sandbox network policy');
        return;
      }

      const proxyReq = http.request(
        {
          method: req.method,
          host: hostname,
          port,
          path: parsed.pathname + parsed.search,
          headers: {
            ...req.headers,
            host: req.headers.host,
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers as any);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', (err) => {
        res.writeHead(502, { 'content-type': 'text/plain' });
        res.end(`Proxy error: ${err.message}`);
      });

      req.pipe(proxyReq);
    } catch (err) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end(`Proxy internal error: ${(err as Error).message}`);
    }
  });

  // HTTPS CONNECT tunneling
  httpProxyServer.on('connect', (req, clientSocket, head) => {
    (async () => {
      const target = req.url ?? '';
      const [host, portStr] = target.split(':');
      const port = Number(portStr || 443);

      if (!host) {
        clientSocket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        clientSocket.destroy();
        return;
      }

      const allowed = await checkDomainAllowed(host, 'http', permissionCallback);
      if (!allowed) {
        clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        clientSocket.destroy();
        return;
      }

      const serverSocket = net.connect(port, host, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        if (head && head.length > 0) serverSocket.write(head);
        clientSocket.pipe(serverSocket);
        serverSocket.pipe(clientSocket);
      });

      serverSocket.on('error', () => {
        try {
          clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        } catch {
          // ignore
        }
        clientSocket.destroy();
      });
    })().catch(() => {
      try {
        clientSocket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
      } catch {
        // ignore
      }
      clientSocket.destroy();
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpProxyServer!.once('error', reject);
    httpProxyServer!.listen(0, '127.0.0.1', () => resolve());
  });

  const addr = httpProxyServer.address();
  if (!addr || typeof addr !== 'object') {
    throw new Error('Failed to bind HTTP proxy server');
  }
  return addr.port;
}

/**
 * Initialize SOCKS proxy (placeholder).
 * Would start a SOCKS proxy server for network filtering.
 */
async function initializeSOCKSProxy(
  permissionCallback: PermissionCallback
): Promise<number> {
  if (socksProxyServer) {
    const addr = socksProxyServer.address();
    if (addr && typeof addr === 'object') return addr.port;
  }

  socksProxyServer = net.createServer((socket) => {
    let stage: 'greeting' | 'request' = 'greeting';
    let buffered = Buffer.alloc(0);

    const onData = (chunk: Buffer) => {
      buffered = Buffer.concat([buffered, chunk]);

      // Greeting: VER, NMETHODS, METHODS...
      if (stage === 'greeting') {
        if (buffered.length < 2) return;
        const ver = buffered[0] ?? 0;
        const nmethods = buffered[1] ?? 0;
        if (buffered.length < 2 + nmethods) return;
        if (ver !== 0x05) {
          socket.destroy();
          return;
        }
        // NO AUTH
        socket.write(Buffer.from([0x05, 0x00]));
        buffered = buffered.slice(2 + nmethods);
        stage = 'request';
      }

      // Request: VER, CMD, RSV, ATYP, DST.ADDR, DST.PORT
      if (stage === 'request') {
        if (buffered.length < 4) return;
        const ver = buffered[0];
        const cmd = buffered[1];
        const atyp = buffered[3];
        if (ver !== 0x05 || cmd !== 0x01) {
          // Only CONNECT supported
          socket.end(Buffer.from([0x05, 0x07, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
          return;
        }

        let offset = 4;
        let host = '';
        if (atyp === 0x01) {
          // IPv4
          if (buffered.length < offset + 4 + 2) return;
          host = `${buffered[offset]}.${buffered[offset + 1]}.${buffered[offset + 2]}.${buffered[offset + 3]}`;
          offset += 4;
        } else if (atyp === 0x03) {
          // Domain
          if (buffered.length < offset + 1) return;
          const lenByte = buffered[offset];
          if (lenByte === undefined) return;
          const len = lenByte;
          if (buffered.length < offset + 1 + len + 2) return;
          host = buffered.slice(offset + 1, offset + 1 + len).toString('utf8');
          offset += 1 + len;
        } else if (atyp === 0x04) {
          // IPv6
          if (buffered.length < offset + 16 + 2) return;
          const addrBytes = buffered.slice(offset, offset + 16);
          host = addrBytes.toString('hex').match(/.{1,4}/g)?.join(':') ?? '';
          offset += 16;
        } else {
          socket.end(Buffer.from([0x05, 0x08, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
          return;
        }

        const port = buffered.readUInt16BE(offset);
        buffered = Buffer.alloc(0);

        (async () => {
          const allowed = await checkDomainAllowed(host, 'socks', permissionCallback);
          if (!allowed) {
            socket.end(Buffer.from([0x05, 0x02, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
            return;
          }

          const upstream = net.connect(port, host, () => {
            // Success reply with dummy bind address
            socket.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
            socket.pipe(upstream);
            upstream.pipe(socket);
          });

          upstream.on('error', () => {
            socket.end(Buffer.from([0x05, 0x04, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
          });
        })().catch(() => {
          socket.end(Buffer.from([0x05, 0x01, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
        });

        socket.off('data', onData);
      }
    };

    socket.on('data', onData);
  });

  await new Promise<void>((resolve, reject) => {
    socksProxyServer!.once('error', reject);
    socksProxyServer!.listen(0, '127.0.0.1', () => resolve());
  });

  const addr = socksProxyServer.address();
  if (!addr || typeof addr !== 'object') {
    throw new Error('Failed to bind SOCKS proxy server');
  }
  return addr.port;
}

/**
 * Initialize Linux bridges (placeholder).
 * Would start socat processes to bridge Unix sockets.
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
    console.error(`[Sandbox Linux] HTTP bridge process error: ${err}`);
  });

  const socksArgs = [
    `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
    `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`,
  ];
  const socksBridgeProcess = spawn('socat', socksArgs, { stdio: 'ignore' });
  if (!socksBridgeProcess.pid) {
    try {
      process.kill(httpBridgeProcess.pid!, 'SIGTERM');
    } catch {
      // ignore
    }
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
      try {
        process.kill(httpBridgeProcess.pid!, 'SIGTERM');
      } catch {
        // ignore
      }
      try {
        process.kill(socksBridgeProcess.pid!, 'SIGTERM');
      } catch {
        // ignore
      }
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
 * Shutdown sandbox (placeholder).
 * Would stop proxy servers and bridges.
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

    const killIfPossible = (p: unknown) => {
      const pid = (p as any)?.pid as number | undefined;
      if (!pid) return;
      try {
        process.kill(pid, 'SIGTERM');
      } catch {
        // ignore
      }
    };
    killIfPossible(httpBridgeProcess);
    killIfPossible(socksBridgeProcess);

    try {
      if (httpSocketPath) fs.rmSync(httpSocketPath, { force: true });
    } catch {
      // ignore
    }
    try {
      if (socksSocketPath) fs.rmSync(socksSocketPath, { force: true });
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
 * Wrap command with Linux sandbox (placeholder).
 * Would build bwrap command with proper restrictions.
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
    ripgrepConfig,
    mandatoryDenySearchDepth,
    allowGitConfig,
    abortSignal,
  } = options;

  const hasReadRestrictions = !!(readConfig && readConfig.denyOnly.length > 0);
  const hasWriteRestrictions = writeConfig !== undefined;

  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  const bwrapArgs: string[] = ['--new-session', '--die-with-parent'];

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

      // Container-side proxy ports are fixed
      for (const env of buildProxyEnvironmentVars(
        SANDBOX_CONSTANTS.CONTAINER_HTTP_PROXY_PORT,
        SANDBOX_CONSTANTS.CONTAINER_SOCKS_PROXY_PORT
      )) {
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
  const fsArgs = await buildFilesystemRestrictions(
    readConfig,
    writeConfig,
    ripgrepConfig,
    mandatoryDenySearchDepth,
    Boolean(allowGitConfig),
    abortSignal
  );
  bwrapArgs.push(...fsArgs);

  // Namespaces and devices
  bwrapArgs.push('--dev', '/dev');
  bwrapArgs.push('--unshare-pid');
  if (!enableWeakerNestedSandbox) {
    bwrapArgs.push('--proc', '/proc');
  }

  const shellPath = resolveShellPath(binShell || 'bash');

  // Build inner command for network reverse-bridges and optional seccomp
  const seccompFilter = !allowAllUnixSockets ? getBestEffortSeccompFilter() : undefined;
  let finalInner: string;

  if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
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

  bwrapArgs.push('--', shellPath, '-c', finalInner);

  const restrictions: string[] = [];
  if (needsNetworkRestriction) restrictions.push('network');
  if (hasReadRestrictions || hasWriteRestrictions) restrictions.push('filesystem');
  if (seccompFilter) restrictions.push('seccomp(unix-block)');
  console.log(
    `[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(', ')} restrictions)`
  );

  return shellQuote(['bwrap', ...bwrapArgs]);
}

/**
 * Wrap command with macOS sandbox (placeholder).
 * Would build sandbox-exec command with Seatbelt profile.
 */
async function wrapWithMacOSSandbox(
  options: SandboxWrapperOptions
): Promise<string> {
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
    allowGitConfig,
    binShell,
  } = options;

  const hasReadRestrictions = !!(readConfig && readConfig.denyOnly.length > 0);
  if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) {
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
    allowGitConfig: Boolean(allowGitConfig),
    logTag,
  });

  const envVars = buildProxyEnvironmentVars(httpProxyPort, socksProxyPort);
  const shellPath = resolveShellPath(binShell || 'bash');

  console.log(
    `[Sandbox macOS] Applied restrictions - network: ${needsNetworkRestriction}, ` +
      `read: ${readConfig ? 'restricted' : 'none'}, write: ${writeConfig ? 'restricted' : 'none'}`
  );

  return shellQuote(['env', ...envVars, 'sandbox-exec', '-p', profile, shellPath, '-c', command]);
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

function normalizePath(inputPath: string): string {
  let p = inputPath.trim();
  if (!p) return p;

  // Home expansion
  if (p.startsWith('~/')) {
    p = path.join(os.homedir(), p.slice(2));
  }

  // Relative to current cwd
  if (!path.isAbsolute(p)) {
    p = path.resolve(process.cwd(), p);
  }

  return path.normalize(p);
}

function shellQuote(args: string[]): string {
  const quote = (s: string) => {
    if (s.length === 0) return "''";
    if (/^[A-Za-z0-9_\-.,/:=@]+$/.test(s)) return s;
    return `'${s.replace(/'/g, `'"'"'`)}'`;
  };
  return args.map(quote).join(' ');
}

function resolveShellPath(shell: string): string {
  const result = spawnSync('which', [shell], { encoding: 'utf8', timeout: 1000 });
  if (result.status !== 0 || !result.stdout) {
    throw new Error(`Shell '${shell}' not found in PATH`);
  }
  return result.stdout.trim();
}

function buildProxyEnvironmentVars(httpPort?: number, socksPort?: number): string[] {
  const out: string[] = [];
  if (httpPort !== undefined) {
    out.push(`HTTP_PROXY=http://localhost:${httpPort}`);
    out.push(`HTTPS_PROXY=http://localhost:${httpPort}`);
  }
  if (socksPort !== undefined) {
    out.push(`ALL_PROXY=socks5://localhost:${socksPort}`);
  }
  out.push('NO_PROXY=localhost,127.0.0.1,::1,*.local');
  return out;
}

function getBestEffortSeccompFilter(): string | undefined {
  const p = findSeccompBpfFilter();
  if (!p) {
    console.warn(
      '[Sandbox Linux] Seccomp filtering not available (missing binaries). Continuing without Unix socket blocking.'
    );
    return undefined;
  }
  return p;
}

function findApplySeccompBinaryOrThrow(): string {
  const p = findApplySeccompBinary();
  if (!p) throw new Error('apply-seccomp binary not found');
  return p;
}

function buildNetworkAndSeccompCommand(
  httpSocketPath: string,
  socksSocketPath: string,
  userCommand: string,
  seccompFilter: string | undefined,
  shellPath: string
): string {
  const scriptLines = [
    `socat TCP-LISTEN:${SANDBOX_CONSTANTS.CONTAINER_HTTP_PROXY_PORT},fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,
    `socat TCP-LISTEN:${SANDBOX_CONSTANTS.CONTAINER_SOCKS_PROXY_PORT},fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,
    'trap "kill %1 %2 2>/dev/null; exit" EXIT',
  ];

  if (seccompFilter) {
    const applySeccomp = findApplySeccompBinaryOrThrow();
    const seccompCmd = shellQuote([applySeccomp, seccompFilter, shellPath, '-c', userCommand]);
    const fullScript = [...scriptLines, seccompCmd].join('\n');
    return `${shellPath} -c ${shellQuote([fullScript])}`;
  }

  const fullScript = [...scriptLines, `eval ${shellQuote([userCommand])}`].join('\n');
  return `${shellPath} -c ${shellQuote([fullScript])}`;
}

async function buildFilesystemRestrictions(
  readConfig: ReadConfig | undefined,
  writeConfig: WriteConfig | undefined,
  ripgrepConfig: SandboxWrapperOptions['ripgrepConfig'] | undefined,
  searchDepth: number | undefined,
  allowGitConfig: boolean,
  abortSignal?: AbortSignal
): Promise<string[]> {
  const args: string[] = [];

  // Write restrictions
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
      ...await findDangerousFiles(ripgrepConfig, searchDepth, allowGitConfig, abortSignal, writablePaths),
    ];

    for (const p of denyPaths) {
      const normalized = normalizePath(p);
      if (normalized.startsWith('/dev/')) continue;
      if (!fs.existsSync(normalized)) {
        // Best-effort: block creation if the denied path is under a writable area
        const parent = findFirstExistingParent(normalized);
        if (writablePaths.some((wp) => parent === wp || parent.startsWith(wp + path.sep))) {
          const firstNonExistent = findFirstNonExistent(normalized);
          args.push('--ro-bind', '/dev/null', firstNonExistent);
        }
        continue;
      }

      // Only apply deny within writable areas
      if (writablePaths.some((wp) => normalized === wp || normalized.startsWith(wp + path.sep))) {
        args.push('--ro-bind', normalized, normalized);
      }
    }
  } else {
    // No write restrictions
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
    try {
      const stat = fs.statSync(normalized);
      if (stat.isDirectory()) {
        args.push('--tmpfs', normalized);
      } else {
        args.push('--ro-bind', '/dev/null', normalized);
      }
    } catch {
      // ignore
    }
  }

  return args;
}

function findFirstExistingParent(p: string): string {
  let cur = p;
  while (cur !== '/' && !fs.existsSync(cur)) {
    cur = path.dirname(cur);
  }
  return cur;
}

function findFirstNonExistent(p: string): string {
  const parts = normalizePath(p).split(path.sep);
  let cur = '';
  for (const part of parts) {
    if (!part) continue;
    cur = cur ? path.join(cur, part) : path.sep + part;
    if (!fs.existsSync(cur)) return cur;
  }
  return normalizePath(p);
}

async function findDangerousFiles(
  ripgrepConfig: SandboxWrapperOptions['ripgrepConfig'] | undefined,
  searchDepth: number | undefined,
  allowGitConfig: boolean,
  abortSignal: AbortSignal | undefined,
  writablePaths: string[]
): Promise<string[]> {
  const depth = searchDepth ?? SANDBOX_CONSTANTS.DEFAULT_MANDATORY_DENY_SEARCH_DEPTH;
  const rg = ripgrepConfig?.command || 'rg';
  const extraArgs = ripgrepConfig?.args || [];

  // Protect a known set of config files and dirs from modification.
  const protectedNames = new Set<string>(SANDBOX_CONSTANTS.PROTECTED_FILES as unknown as string[]);
  const protectedDirs = new Set<string>(SANDBOX_CONSTANTS.PROTECTED_DIRS as unknown as string[]);

  if (allowGitConfig) {
    protectedNames.delete('.gitconfig');
    protectedDirs.delete('.git');
  }

  const results = new Set<string>();

  for (const base of writablePaths) {
    if (abortSignal?.aborted) break;

    // Scan for protected filenames under writable roots.
    const patterns = Array.from(protectedNames).map((n) => n.replace(/\./g, '\\.') + '$');
    if (patterns.length === 0) continue;

    const rgArgs = [
      '--files',
      '--hidden',
      '--follow',
      '--max-depth',
      String(depth),
      ...extraArgs,
      base,
    ];

    const proc = spawnSync(rg, rgArgs, { encoding: 'utf8', timeout: 5000 });
    if (proc.status === 0 && proc.stdout) {
      const files = proc.stdout.split('\n').map((l) => l.trim()).filter(Boolean);
      for (const f of files) {
        const bn = path.basename(f);
        if (protectedNames.has(bn)) results.add(f);
        if (protectedDirs.has(bn)) results.add(f);
      }
    }
  }

  return Array.from(results);
}

async function checkDomainAllowed(
  domain: string,
  type: 'http' | 'socks',
  permissionCallback: PermissionCallback
): Promise<boolean> {
  const normalized = (domain || '').trim().toLowerCase();
  if (!normalized) return false;

  const cacheKey = `${type}:${normalized}`;
  const cached = domainDecisionCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const cfg = getSandboxConfig();
  const netCfg = cfg?.network;

  // Deny list has priority
  if (netCfg?.deniedDomains?.some((p) => matchesDomainPattern(normalized, p))) {
    domainDecisionCache.set(cacheKey, false);
    return false;
  }

  // If allow list exists, require match
  if (netCfg?.allowedDomains && netCfg.allowedDomains.length > 0) {
    const ok = netCfg.allowedDomains.some((p) => matchesDomainPattern(normalized, p));
    domainDecisionCache.set(cacheKey, ok);
    return ok;
  }

  // Otherwise defer to callback
  const ok = await permissionCallback(normalized, type);
  domainDecisionCache.set(cacheKey, ok);
  return ok;
}

function matchesDomainPattern(domain: string, pattern: string): boolean {
  const p = String(pattern || '').trim().toLowerCase();
  if (!p) return false;
  if (p === '*') return true;
  if (p.startsWith('*.')) {
    const suffix = p.slice(1); // keep leading '.'
    return domain.endsWith(suffix);
  }
  if (p.startsWith('.')) {
    return domain.endsWith(p);
  }
  // Exact or subdomain match
  return domain === p || domain.endsWith('.' + p);
}

function startMacOSViolationMonitor(
  store: ISandboxViolationStore,
  ignoreRules?: Record<string, string[] | undefined>
): () => void {
  const uniqueTag = getUniqueSandboxTag();

  const logProc = spawn('log', [
    'stream',
    '--predicate',
    `(eventMessage ENDSWITH "${uniqueTag}")`,
    '--style',
    'compact',
  ]);

  let lastCmdLine: string | undefined;

  logProc.stdout?.on('data', (chunk) => {
    const lines = chunk.toString().split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('CMD64_')) {
        lastCmdLine = trimmed;
        continue;
      }

      if (!trimmed.includes('Sandbox:') || !trimmed.includes('deny')) continue;

      // Extract violation message
      const m = trimmed.match(/Sandbox:\s+(.+)$/);
      if (!m?.[1]) continue;
      const violationMsg = m[1];

      // Extract encoded command from last CMD64 line
      const encoded = lastCmdLine?.match(/CMD64_(.+?)_END/)?.[1];
      let decoded: string | undefined;
      if (encoded) {
        try {
          decoded = decodeCommandFromTag(encoded);
        } catch {
          // ignore
        }
      }

      const v: SandboxViolation = {
        line: violationMsg,
        command: decoded,
        encodedCommand: encoded,
        timestamp: new Date(),
      };

      if (shouldIgnoreViolation(v, ignoreRules)) continue;
      store.addViolation(v);
    }
  });

  logProc.on('error', (err) => {
    console.warn(`[Sandbox macOS] Failed to start violation monitor: ${err.message}`);
  });

  return () => {
    try {
      logProc.kill('SIGTERM');
    } catch {
      // ignore
    }
  };
}

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

  const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const hasGlob = (s: string) => /[*?\[]/.test(s);
  const globToRegex = (globPattern: string) => {
    return (
      '^' +
      globPattern
        .replace(/[.^$+{}()|\\]/g, '\\$&')
        .replace(/\[([^\]]*?)$/g, '\\[$1')
        .replace(/\*\*\//g, '__GLOBSTAR_SLASH__')
        .replace(/\*\*/g, '__GLOBSTAR__')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '[^/]')
        .replace(/__GLOBSTAR_SLASH__/g, '(.*/)?')
        .replace(/__GLOBSTAR__/g, '.*') +
      '$'
    );
  };

  const rules: string[] = [];
  rules.push('(version 1)');
  rules.push(`(deny default (with message ${quote(logTag)}))`);
  rules.push('');
  rules.push(`; LogTag: ${logTag}`);
  rules.push('');
  rules.push('; Essential permissions');
  rules.push('(allow process-exec)');
  rules.push('(allow process-fork)');
  rules.push('(allow process-info* (target same-sandbox))');
  rules.push('(allow signal (target same-sandbox))');
  rules.push('(allow user-preference-read)');
  rules.push('');
  // Broad mach lookup to reduce breakage in this reconstructed runtime.
  rules.push('(allow mach-lookup (global-name "*"))');
  rules.push('(allow ipc-posix-shm)');
  rules.push('(allow ipc-posix-sem)');

  // Network
  rules.push('');
  rules.push('; Network');
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
      for (const p of allowUnixSockets) {
        const normalized = normalizePath(p);
        rules.push(`(allow network* (subpath ${quote(normalized)}))`);
      }
    }

    if (httpProxyPort !== undefined) {
      rules.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
      rules.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
      rules.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
    }
    if (socksProxyPort !== undefined) {
      rules.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
      rules.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
      rules.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
    }
  }

  // File read
  rules.push('');
  rules.push('; File read');
  if (!readConfig) {
    rules.push('(allow file-read*)');
  } else {
    rules.push('(allow file-read*)');
    for (const p of readConfig.denyOnly || []) {
      const normalized = normalizePath(p);
      if (hasGlob(normalized)) {
        const r = globToRegex(normalized);
        rules.push('(deny file-read*');
        rules.push(`  (regex ${quote(r)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      } else {
        rules.push('(deny file-read*');
        rules.push(`  (subpath ${quote(normalized)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      }
    }
  }

  // File write
  rules.push('');
  rules.push('; File write');
  if (!writeConfig) {
    rules.push('(allow file-write*)');
  } else {
    // Always allow temp dir
    rules.push('(allow file-write*');
    rules.push(`  (subpath ${quote(getSandboxTempDir())})`);
    rules.push(`  (with message ${quote(logTag)}))`);

    for (const p of writeConfig.allowOnly || []) {
      const normalized = normalizePath(p);
      if (hasGlob(normalized)) {
        const r = globToRegex(normalized);
        rules.push('(allow file-write*');
        rules.push(`  (regex ${quote(r)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      } else {
        rules.push('(allow file-write*');
        rules.push(`  (subpath ${quote(normalized)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      }
    }

    const denyPaths = [
      ...(writeConfig.denyWithinAllow || []),
      ...getConfigPathsToProtect(Boolean(allowGitConfig)),
    ];

    for (const p of denyPaths) {
      const normalized = normalizePath(p);
      if (hasGlob(normalized)) {
        const r = globToRegex(normalized);
        rules.push('(deny file-write*');
        rules.push(`  (regex ${quote(r)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      } else {
        rules.push('(deny file-write*');
        rules.push(`  (subpath ${quote(normalized)})`);
        rules.push(`  (with message ${quote(logTag)}))`);
      }
    }
  }

  if (allowPty) {
    rules.push('');
    rules.push('; Pseudo-terminal (pty) support');
    rules.push('(allow pseudo-tty)');
  }

  return rules.join('\n');
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
