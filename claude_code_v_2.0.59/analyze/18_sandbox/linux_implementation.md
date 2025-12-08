# Linux Sandbox Implementation

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `linuxSandboxWrapper` (qm0) - Main sandbox wrapper function
- `buildFilesystemRestrictions` (J44) - Build bwrap bind mount arguments
- `initializeLinuxBridges` (wm0) - Create socat Unix→TCP bridges
- `buildNetworkAndSeccompCommand` (Y44) - Build inner container command
- `checkLinuxDependencies` ($m0) - Verify bwrap/socat installed
- `findSeccompBPFFilter` (NH1) - Locate pre-compiled BPF filter
- `getArchitectureForSeccomp` (Km0) - Detect CPU architecture for seccomp

---

## Overview

Claude Code's Linux sandbox uses **bubblewrap (bwrap)** for container-based isolation, with **seccomp BPF filters** for Unix socket blocking and **socat bridges** for network proxy forwarding.

**Key Components:**
- `linuxSandboxWrapper` (qm0) - Main wrapper function
- `buildFilesystemRestrictions` (J44) - Bind mount argument builder
- `initializeLinuxBridges` (wm0) - socat proxy bridge setup
- `checkLinuxDependencies` ($m0) - Dependency verification

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Claude Code Process (Host)                       │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────────┐    │
│  │ HTTP Proxy  │    │SOCKS Proxy  │    │  Sandbox Wrapper     │    │
│  │ (port N)    │    │ (port M)    │    │  linuxSandboxWrapper │    │
│  └──────┬──────┘    └──────┬──────┘    └──────────┬───────────┘    │
│         │                  │                      │                 │
│    ┌────┴────────────────┬─┘                      │                 │
│    ▼                     ▼                        ▼                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    socat Bridges                             │   │
│  │  HTTP: UNIX-LISTEN:/tmp/claude-http-XXX.sock → TCP:localhost:N  │
│  │  SOCKS: UNIX-LISTEN:/tmp/claude-socks-XXX.sock → TCP:localhost:M │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │                                       │
│                       Unix Sockets                                  │
│                             │                                       │
├─────────────────────────────┼───────────────────────────────────────┤
│                             ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              bwrap Container (Sandbox)                        │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │  Namespaces: --unshare-net --unshare-pid               │   │  │
│  │  │  Filesystem: --ro-bind / / + selective --bind          │   │  │
│  │  │  Env: HTTP_PROXY=localhost:3128, SOCKS=localhost:1080  │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │  Inner socat Reverse Bridges                           │   │  │
│  │  │  TCP-LISTEN:3128 → UNIX-CONNECT:/tmp/claude-http.sock  │   │  │
│  │  │  TCP-LISTEN:1080 → UNIX-CONNECT:/tmp/claude-socks.sock │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │  Seccomp BPF Filter (apply-seccomp)                    │   │  │
│  │  │  Blocks: socket(AF_UNIX, ...) syscalls                 │   │  │
│  │  │  Allows: Everything else (file I/O, network via proxy) │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │  User Command                                          │   │  │
│  │  │  $ curl https://api.example.com                        │   │  │
│  │  │    → Goes through HTTPS_PROXY=localhost:3128           │   │  │
│  │  │    → socat → Unix socket → host proxy → internet       │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependency Checking

### checkLinuxDependencies

Verifies required binaries are available before sandbox initialization.

```javascript
// ============================================
// checkLinuxDependencies - Verify bwrap and socat are installed
// Location: chunks.16.mjs:3242-3264
// ============================================

// ORIGINAL (for source lookup):
function $m0(A = !1) {
  try {
    let Q = MH1("which", ["bwrap"], { stdio: "ignore", timeout: 1000 }),
      B = MH1("which", ["socat"], { stdio: "ignore", timeout: 1000 }),
      G = Q.status === 0 && B.status === 0;
    if (!A) {
      let Z = NH1() !== null, I = PxA() !== null;
      if (!Z || !I) kQ(`[Sandbox Linux] Seccomp filtering not available...`, { level: "warn" })
    }
    return G
  } catch { return !1 }
}

// READABLE (for understanding):
function checkLinuxDependencies(skipSeccompCheck = false) {
  try {
    const bwrapResult = spawnSync("which", ["bwrap"], { stdio: "ignore", timeout: 1000 });
    const socatResult = spawnSync("which", ["socat"], { stdio: "ignore", timeout: 1000 });
    const dependenciesAvailable = bwrapResult.status === 0 && socatResult.status === 0;

    if (!skipSeccompCheck) {
      const hasSeccompFilter = findSeccompBPFFilter() !== null;
      const hasApplySeccomp = findApplySeccompBinary() !== null;

      if (!hasSeccompFilter || !hasApplySeccomp) {
        debugLog(`[Sandbox Linux] Seccomp filtering not available (missing binaries for ${process.arch}). ` +
          `Sandbox will run without Unix socket blocking (allowAllUnixSockets mode). ` +
          `This is less restrictive but still provides filesystem and network isolation.`,
          { level: "warn" });
      }
    }

    return dependenciesAvailable;
  } catch {
    return false;
  }
}

// Mapping: $m0→checkLinuxDependencies, A→skipSeccompCheck, Q→bwrapResult, B→socatResult, G→dependenciesAvailable
```

**Required Dependencies:**
| Binary | Purpose | Required |
|--------|---------|----------|
| `bwrap` | bubblewrap container isolation | **Yes** |
| `socat` | Network socket bridging | **Yes** |
| `apply-seccomp` | Seccomp filter application | Optional |
| `unix-block.bpf` | Pre-compiled BPF filter | Optional |

---

## Seccomp BPF Filtering

### Architecture Detection

```javascript
// ============================================
// getArchitectureForSeccomp - Detect CPU architecture for seccomp
// Location: chunks.16.mjs:3138-3155
// ============================================

// ORIGINAL (for source lookup):
function Km0() {
  let A = process.arch;
  switch (A) {
    case "x64": case "x86_64": return "x64";
    case "arm64": case "aarch64": return "arm64";
    case "ia32": case "x86":
      return kQ("[SeccompFilter] 32-bit x86 (ia32) is not currently supported...", { level: "error" }), null;
    default:
      return kQ(`[SeccompFilter] Unsupported architecture: ${A}...`), null
  }
}

// READABLE (for understanding):
function getArchitectureForSeccomp() {
  const arch = process.arch;
  switch (arch) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      // 32-bit x86 not supported due to socketcall() syscall bypass
      debugLog("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to " +
        "missing socketcall() syscall blocking. The current seccomp filter only blocks " +
        "socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.",
        { level: "error" });
      return null;
    default:
      debugLog(`[SeccompFilter] Unsupported architecture: ${arch}. Only x64 and arm64 are supported.`);
      return null;
  }
}

// Mapping: Km0→getArchitectureForSeccomp, A→arch
```

**Key insight:** 32-bit x86 is explicitly unsupported because the seccomp filter only blocks `socket(AF_UNIX, ...)` syscalls. On 32-bit x86, the `socketcall()` multiplexed syscall can bypass this restriction.

### Why Seccomp BPF for Unix Socket Blocking?

**Problem:** Network namespace isolation (`--unshare-net`) blocks TCP/UDP but still allows Unix domain sockets within the container. This is a security gap because:
1. Programs can communicate with host services via Unix sockets
2. Docker socket (`/var/run/docker.sock`) access enables container escape
3. D-Bus sockets allow IPC with system services

**Why this approach:**
- **Seccomp BPF** operates at the syscall level, blocking `socket(AF_UNIX, ...)` before the kernel creates the socket
- **Pre-compiled filters** avoid runtime compilation overhead and libseccomp dependency
- **Architecture-specific** because syscall numbers differ between x64 and arm64

**Alternatives considered:**
1. **Blocking socket files via bind mounts** - Doesn't prevent creation of new sockets
2. **AppArmor/SELinux** - Not available on all Linux distributions
3. **User namespace isolation** - Requires root or unprivileged user namespaces

**Trade-off:** Seccomp is optional - if binaries are missing, sandbox runs with `allowAllUnixSockets` mode (reduced security but still has filesystem/network isolation).

### Finding Seccomp Binaries

```javascript
// ============================================
// findSeccompBPFFilter - Locate pre-compiled BPF filter file
// Location: chunks.16.mjs:3157-3167
// ============================================

// ORIGINAL (for source lookup):
function NH1() {
  let A = Km0();
  if (!A) return kQ(`[SeccompFilter] Cannot find pre-generated BPF filter...`), null;
  kQ(`[SeccompFilter] Detected architecture: ${A}`);
  let Q = Vm0(Fm0(import.meta.url)),
    B = Sm("vendor", "seccomp", A, "unix-block.bpf"),
    G = [Sm(Q, B), Sm(Q, "..", "..", B), Sm(Q, "..", B)];
  for (let Z of G) if (qH1.existsSync(Z)) return kQ(`[SeccompFilter] Found pre-generated BPF filter: ${Z} (${A})`), Z;
  return kQ(`[SeccompFilter] Pre-generated BPF filter not found...`), null
}

// READABLE (for understanding):
function findSeccompBPFFilter() {
  const arch = getArchitectureForSeccomp();
  if (!arch) {
    debugLog(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`);
    return null;
  }

  debugLog(`[SeccompFilter] Detected architecture: ${arch}`);

  const dirname = getDirname(fileURLToPath(import.meta.url));
  const relativePath = path.join("vendor", "seccomp", arch, "unix-block.bpf");
  const searchPaths = [
    path.join(dirname, relativePath),
    path.join(dirname, "..", "..", relativePath),
    path.join(dirname, "..", relativePath)
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      debugLog(`[SeccompFilter] Found pre-generated BPF filter: ${searchPath} (${arch})`);
      return searchPath;
    }
  }

  debugLog(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${arch})`);
  return null;
}

// Mapping: NH1→findSeccompBPFFilter, A→arch, Q→dirname, B→relativePath, G→searchPaths, Z→searchPath
```

**BPF Filter Location:**
```
vendor/seccomp/{arch}/unix-block.bpf

Where {arch} is:
  - x64 (for x86_64)
  - arm64 (for aarch64)
```

---

## Network Bridge Setup

### Why Double-socat Bridge Architecture?

**Problem:** The bwrap container uses `--unshare-net` which creates an isolated network namespace. Inside this namespace:
- No network interfaces exist (except loopback)
- Cannot connect to host's TCP ports directly
- Proxy servers run on host, inaccessible from container

**Solution: Unix Socket Bridge**

```
Host Process                    Container Process
     │                               │
     ▼                               ▼
[HTTP Proxy :8080]              [curl example.com]
     │                               │
     │                               ▼
     │                          HTTPS_PROXY=localhost:3128
     │                               │
     ▼                               ▼
[Outer socat]                   [Inner socat]
UNIX-LISTEN:sock ◄─────────────► TCP-LISTEN:3128
     │               Unix         │
     │              Socket        │
     ▼              (bound)       ▼
TCP:localhost:8080           UNIX-CONNECT:sock
```

**Why this approach:**
1. **Unix sockets cross namespace boundaries** when explicitly bound into container via `--bind`
2. **Two socat processes** create a bidirectional bridge:
   - **Outer socat** (host): Listens on Unix socket, forwards to host TCP proxy
   - **Inner socat** (container): Listens on TCP, forwards to Unix socket
3. **Standard proxy environment variables** (`HTTP_PROXY`, `HTTPS_PROXY`) work transparently

**Why not simpler alternatives?**
- **Direct TCP binding**: Not possible with `--unshare-net`
- **Single socat**: Would require container to connect directly to Unix socket (not all programs support this)
- **veth pairs**: Requires root/CAP_NET_ADMIN, more complex setup

**Key insight:** The double-bridge creates a "virtual TCP port" inside the container that tunnels through Unix sockets to the host's proxy server.

### initializeLinuxBridges

Creates socat processes that bridge Unix sockets to TCP ports for proxy forwarding.

```javascript
// ============================================
// initializeLinuxBridges - Create socat Unix→TCP bridges
// Location: chunks.16.mjs:3266-3337
// ============================================

// ORIGINAL (for source lookup):
async function wm0(A, Q) {
  let B = G44(8).toString("hex"),
    G = zm0(Em0(), `claude-http-${B}.sock`),
    Z = zm0(Em0(), `claude-socks-${B}.sock`),
    I = [`UNIX-LISTEN:${G},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  kQ(`Starting HTTP bridge: socat ${I.join(" ")}`);
  let Y = Cm0("socat", I, { stdio: "ignore" });
  // ... error handling and SOCKS bridge setup ...
  return { httpSocketPath: G, socksSocketPath: Z, httpBridgeProcess: Y, socksBridgeProcess: W, httpProxyPort: A, socksProxyPort: Q }
}

// READABLE (for understanding):
async function initializeLinuxBridges(httpProxyPort, socksProxyPort) {
  // Generate unique socket names using random hex
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const httpSocketPath = path.join(os.tmpdir(), `claude-http-${uniqueId}.sock`);
  const socksSocketPath = path.join(os.tmpdir(), `claude-socks-${uniqueId}.sock`);

  // Create HTTP bridge: Unix socket → TCP proxy
  const httpBridgeArgs = [
    `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
    `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  debugLog(`Starting HTTP bridge: socat ${httpBridgeArgs.join(" ")}`);
  const httpBridgeProcess = spawn("socat", httpBridgeArgs, { stdio: "ignore" });

  if (!httpBridgeProcess.pid) {
    throw Error("Failed to start HTTP bridge process");
  }

  // Setup error/exit handlers
  httpBridgeProcess.on("error", (error) => {
    debugLog(`HTTP bridge process error: ${error}`, { level: "error" });
  });
  httpBridgeProcess.on("exit", (code, signal) => {
    debugLog(`HTTP bridge process exited with code ${code}, signal ${signal}`,
      { level: code === 0 ? "info" : "error" });
  });

  // Create SOCKS bridge: Unix socket → TCP proxy
  const socksBridgeArgs = [
    `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
    `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  debugLog(`Starting SOCKS bridge: socat ${socksBridgeArgs.join(" ")}`);
  const socksBridgeProcess = spawn("socat", socksBridgeArgs, { stdio: "ignore" });

  if (!socksBridgeProcess.pid) {
    // Cleanup HTTP bridge if SOCKS fails
    if (httpBridgeProcess.pid) {
      try { process.kill(httpBridgeProcess.pid, "SIGTERM"); } catch {}
    }
    throw Error("Failed to start SOCKS bridge process");
  }

  // Wait for socket files to be created (up to 5 attempts)
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (!httpBridgeProcess.pid || httpBridgeProcess.killed ||
        !socksBridgeProcess.pid || socksBridgeProcess.killed) {
      throw Error("Linux bridge process died unexpectedly");
    }

    try {
      if (fs.existsSync(httpSocketPath) && fs.existsSync(socksSocketPath)) {
        debugLog(`Linux bridges ready after ${attempt + 1} attempts`);
        break;
      }
    } catch (error) {
      debugLog(`Error checking sockets (attempt ${attempt + 1}): ${error}`, { level: "error" });
    }

    if (attempt === maxAttempts - 1) {
      // Cleanup on final failure
      if (httpBridgeProcess.pid) {
        try { process.kill(httpBridgeProcess.pid, "SIGTERM"); } catch {}
      }
      if (socksBridgeProcess.pid) {
        try { process.kill(socksBridgeProcess.pid, "SIGTERM"); } catch {}
      }
      throw Error(`Failed to create bridge sockets after ${maxAttempts} attempts`);
    }

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, attempt * 100));
  }

  return {
    httpSocketPath,
    socksSocketPath,
    httpBridgeProcess,
    socksBridgeProcess,
    httpProxyPort,
    socksProxyPort
  };
}

// Mapping: wm0→initializeLinuxBridges, A→httpProxyPort, Q→socksProxyPort, B→uniqueId, G→httpSocketPath, Z→socksSocketPath
```

### Network Flow Inside Container

```
┌────────────────────────────────────────────────────────────────┐
│                 Inside bwrap Container                          │
│                                                                 │
│  User Command (e.g., curl https://api.example.com)              │
│       │                                                         │
│       ▼                                                         │
│  Environment: HTTPS_PROXY=http://localhost:3128                 │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Inner socat (launched inside container)                 │   │
│  │  TCP-LISTEN:3128,fork,reuseaddr                         │   │
│  │           │                                              │   │
│  │           ▼                                              │   │
│  │  UNIX-CONNECT:/tmp/claude-http-XXX.sock                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                      │                                          │
│                      │ (Unix socket, bound from host)           │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Host System                                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  Outer socat (initialized by initializeLinuxBridges)    │     │
│  │  UNIX-LISTEN:/tmp/claude-http-XXX.sock,fork,reuseaddr  │     │
│  │           │                                              │     │
│  │           ▼                                              │     │
│  │  TCP:localhost:${httpProxyPort}                         │     │
│  └─────────────────────────────────────────────────────────┘     │
│                      │                                            │
│                      ▼                                            │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  HTTP Proxy Server (Domain filtering)                    │     │
│  │  checkNetworkAccess → allowedDomains / deniedDomains    │     │
│  └─────────────────────────────────────────────────────────┘     │
│                      │                                            │
│                      ▼                                            │
│                  Internet                                         │
└───────────────────────────────────────────────────────────────────┘
```

---

## Filesystem Restrictions

### buildFilesystemRestrictions

Constructs bwrap arguments for filesystem isolation.

```javascript
// ============================================
// buildFilesystemRestrictions - Build bwrap bind mount arguments
// Location: chunks.16.mjs:3356-3399
// ============================================

// ORIGINAL (for source lookup):
async function J44(A, Q, B = { command: "rg" }, G = RH1, Z) {
  let I = [];
  if (Q) {
    I.push("--ro-bind", "/", "/");
    let J = [];
    for (let X of Q.allowOnly || []) {
      let V = NR(X);
      if (V.startsWith("/dev/")) continue;
      if (!LR.existsSync(V)) continue;
      I.push("--bind", V, V), J.push(V)
    }
    let W = [...Q.denyWithinAllow || [], ...await Z44(B, G, Z)];
    for (let X of W) {
      let V = NR(X);
      if (V.startsWith("/dev/")) continue;
      if (!LR.existsSync(V)) continue;
      if (J.some((K) => V.startsWith(K + "/") || V === K)) I.push("--ro-bind", V, V);
    }
  } else I.push("--bind", "/", "/");
  // Read deny handling...
  return I
}

// READABLE (for understanding):
async function buildFilesystemRestrictions(readConfig, writeConfig, ripgrepConfig = { command: "rg" }, mandatoryDenySearchDepth = 3, abortSignal) {
  const args = [];

  if (writeConfig) {
    // Start with read-only root filesystem
    args.push("--ro-bind", "/", "/");

    const allowedWritePaths = [];

    // Add writable bind mounts for allowed paths
    for (const allowPath of writeConfig.allowOnly || []) {
      const resolvedPath = resolvePath(allowPath);

      // Skip /dev paths and non-existent paths
      if (resolvedPath.startsWith("/dev/")) {
        debugLog(`[Sandbox Linux] Skipping /dev path: ${resolvedPath}`);
        continue;
      }
      if (!fs.existsSync(resolvedPath)) {
        debugLog(`[Sandbox Linux] Skipping non-existent write path: ${resolvedPath}`);
        continue;
      }

      // Writable bind mount
      args.push("--bind", resolvedPath, resolvedPath);
      allowedWritePaths.push(resolvedPath);
    }

    // Handle deny paths within allowed areas (make them read-only)
    const denyPaths = [
      ...(writeConfig.denyWithinAllow || []),
      ...(await findDangerousFilesForDenylist(ripgrepConfig, mandatoryDenySearchDepth, abortSignal))
    ];

    for (const denyPath of denyPaths) {
      const resolvedPath = resolvePath(denyPath);

      if (resolvedPath.startsWith("/dev/")) continue;
      if (!fs.existsSync(resolvedPath)) {
        debugLog(`[Sandbox Linux] Skipping non-existent deny path: ${resolvedPath}`);
        continue;
      }

      // Only make read-only if within an allowed path
      const isWithinAllowed = allowedWritePaths.some(allowed =>
        resolvedPath.startsWith(allowed + "/") || resolvedPath === allowed
      );

      if (isWithinAllowed) {
        args.push("--ro-bind", resolvedPath, resolvedPath);
      } else {
        debugLog(`[Sandbox Linux] Skipping deny path not within allowed paths: ${resolvedPath}`);
      }
    }
  } else {
    // No write restrictions: full read-write access
    args.push("--bind", "/", "/");
  }

  // Handle read denials
  const readDenyPaths = [...(readConfig?.denyOnly || [])];
  if (fs.existsSync("/etc/ssh/ssh_config.d")) {
    readDenyPaths.push("/etc/ssh/ssh_config.d");
  }

  for (const denyPath of readDenyPaths) {
    const resolvedPath = resolvePath(denyPath);

    if (!fs.existsSync(resolvedPath)) {
      debugLog(`[Sandbox Linux] Skipping non-existent read deny path: ${resolvedPath}`);
      continue;
    }

    if (fs.statSync(resolvedPath).isDirectory()) {
      // Replace directory with empty tmpfs
      args.push("--tmpfs", resolvedPath);
    } else {
      // Replace file with /dev/null
      args.push("--ro-bind", "/dev/null", resolvedPath);
    }
  }

  return args;
}

// Mapping: J44→buildFilesystemRestrictions, A→readConfig, Q→writeConfig, B→ripgrepConfig, G→mandatoryDenySearchDepth, Z→abortSignal, I→args
```

### Dangerous Files Detection

```javascript
// ============================================
// findDangerousFilesForDenylist - Scan for sensitive files to protect
// Location: chunks.16.mjs:3193-3231
// ============================================

// ORIGINAL (for source lookup):
async function Z44(A = { command: "rg" }, Q = RH1, B) {
  let G = process.cwd(),
    Z = new AbortController,
    I = B ?? Z.signal,
    Y = OxA(),
    J = [...YKA.map((V) => AS.resolve(G, V)), ...Y.map((V) => AS.resolve(G, V)), AS.resolve(G, ".git/hooks"), AS.resolve(G, ".git/config")];
  // ... ripgrep scan for dangerous files ...
  return [...new Set(J)]
}

// READABLE (for understanding):
async function findDangerousFilesForDenylist(ripgrepConfig = { command: "rg" }, searchDepth = 3, abortSignal) {
  const cwd = process.cwd();
  const controller = new AbortController();
  const signal = abortSignal ?? controller.signal;

  const customDangerousPatterns = getCustomDangerousPatterns();

  // Default dangerous files to protect
  const dangerousPaths = [
    // Config files that shouldn't be modified
    ...DANGEROUS_CONFIG_FILES.map(file => path.resolve(cwd, file)),
    // Custom patterns from user config
    ...customDangerousPatterns.map(pattern => path.resolve(cwd, pattern)),
    // Git hooks and config
    path.resolve(cwd, ".git/hooks"),
    path.resolve(cwd, ".git/config")
  ];

  // Build ripgrep arguments to find dangerous patterns
  const rgArgs = [];
  for (const pattern of DANGEROUS_CONFIG_FILES) {
    rgArgs.push("--iglob", pattern);
  }
  for (const pattern of customDangerousPatterns) {
    rgArgs.push("--iglob", `**/${pattern}/**`);
  }
  rgArgs.push("--iglob", "**/.git/hooks/**");
  rgArgs.push("--iglob", "**/.git/config");

  // Run ripgrep to find files
  let foundFiles = [];
  try {
    foundFiles = await runRipgrep(
      ["--files", "--hidden", "--max-depth", String(searchDepth), ...rgArgs, "-g", "!**/node_modules/**"],
      cwd, signal, ripgrepConfig
    );
  } catch (error) {
    debugLog(`[Sandbox] ripgrep scan failed: ${error}`);
  }

  // Process found files and add to deny list
  for (const file of foundFiles) {
    const fullPath = path.resolve(cwd, file);
    // ... categorize and add to appropriate deny path ...
    dangerousPaths.push(fullPath);
  }

  return [...new Set(dangerousPaths)];
}

// Mapping: Z44→findDangerousFilesForDenylist, A→ripgrepConfig, Q→searchDepth, B→abortSignal, G→cwd
```

**Dangerous Config Files (YKA):**
```javascript
const DANGEROUS_CONFIG_FILES = [
  ".gitconfig",
  ".gitmodules",
  ".bashrc",
  ".bash_profile",
  ".zshrc",
  ".zprofile",
  ".profile",
  ".ripgreprc",
  ".mcp.json"
];
```

---

## Main Sandbox Wrapper

### linuxSandboxWrapper

The core function that wraps commands with bwrap sandboxing.

```javascript
// ============================================
// linuxSandboxWrapper - Main Linux sandbox wrapper
// Location: chunks.16.mjs:3401-3484
// ============================================

// ORIGINAL (for source lookup):
async function qm0(A) {
  let { command: Q, needsNetworkRestriction: B, httpSocketPath: G, socksSocketPath: Z, httpProxyPort: I, socksProxyPort: Y, readConfig: J, writeConfig: W, enableWeakerNestedSandbox: X, allowAllUnixSockets: V, binShell: F, ripgrepConfig: K = { command: "rg" }, mandatoryDenySearchDepth: D = RH1, abortSignal: H } = A,
    C = J && J.denyOnly.length > 0, E = W !== void 0;
  if (!B && !C && !E) return Q;
  // ... build bwrap command ...
}

// READABLE (for understanding):
async function linuxSandboxWrapper(options) {
  const {
    command,                    // Original command to sandbox
    needsNetworkRestriction,    // Whether to isolate network
    httpSocketPath,             // Unix socket for HTTP proxy
    socksSocketPath,            // Unix socket for SOCKS proxy
    httpProxyPort,              // Host HTTP proxy port
    socksProxyPort,             // Host SOCKS proxy port
    readConfig,                 // Read restriction config
    writeConfig,                // Write restriction config
    enableWeakerNestedSandbox,  // For Docker compatibility
    allowAllUnixSockets,        // Skip seccomp filter
    binShell,                   // Shell to use (default: bash)
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    abortSignal
  } = options;

  const hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
  const hasWriteRestrictions = writeConfig !== undefined;

  // Early return if no restrictions needed
  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  const bwrapArgs = [];
  let seccompFilterPath = undefined;

  try {
    // Setup seccomp filter for Unix socket blocking
    if (!allowAllUnixSockets) {
      seccompFilterPath = getSeccompFilter() ?? undefined;

      if (!seccompFilterPath) {
        debugLog("[Sandbox Linux] Seccomp filter not available (missing binaries). " +
          "Continuing without Unix socket blocking - sandbox will still provide " +
          "filesystem and network isolation but Unix sockets will be allowed.",
          { level: "warn" });
      } else {
        // Track filter for cleanup
        if (!seccompFilterPath.includes("/vendor/seccomp/")) {
          temporarySeccompFilters.add(seccompFilterPath);
          registerCleanupHandler();
        }
        debugLog("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking");
      }
    } else {
      debugLog("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    }

    // Network isolation
    if (needsNetworkRestriction) {
      bwrapArgs.push("--unshare-net");

      if (httpSocketPath && socksSocketPath) {
        // Verify bridge sockets exist
        if (!fs.existsSync(httpSocketPath)) {
          throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}. ` +
            `The bridge process may have died. Try reinitializing the sandbox.`);
        }
        if (!fs.existsSync(socksSocketPath)) {
          throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}. ` +
            `The bridge process may have died. Try reinitializing the sandbox.`);
        }

        // Bind socket paths into container
        bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
        bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

        // Set proxy environment variables
        const proxyEnvVars = buildProxyEnvironmentVars(3128, 1080);
        bwrapArgs.push(...proxyEnvVars.flatMap(envVar => {
          const eqIndex = envVar.indexOf("=");
          const name = envVar.slice(0, eqIndex);
          const value = envVar.slice(eqIndex + 1);
          return ["--setenv", name, value];
        }));

        // Pass host proxy ports for inner socat
        if (httpProxyPort !== undefined) {
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(httpProxyPort));
        }
        if (socksProxyPort !== undefined) {
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(socksProxyPort));
        }
      }
    }

    // Filesystem restrictions
    const fsArgs = await buildFilesystemRestrictions(readConfig, writeConfig, ripgrepConfig, mandatoryDenySearchDepth, abortSignal);
    bwrapArgs.push(...fsArgs);

    // Standard container setup
    bwrapArgs.push("--dev", "/dev");        // Minimal /dev
    bwrapArgs.push("--unshare-pid");        // PID namespace

    if (!enableWeakerNestedSandbox) {
      bwrapArgs.push("--proc", "/proc");    // Mount /proc (skip for Docker compat)
    }

    // Resolve shell path
    const shell = binShell || "bash";
    const whichResult = spawnSync("which", [shell], { encoding: "utf8" });
    if (whichResult.status !== 0) {
      throw Error(`Shell '${shell}' not found in PATH`);
    }
    const shellPath = whichResult.stdout.trim();

    bwrapArgs.push("--", shellPath, "-c");

    // Build final command with optional seccomp and inner socat
    if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
      const innerCommand = buildNetworkAndSeccompCommand(httpSocketPath, socksSocketPath, command, seccompFilterPath, shellPath);
      bwrapArgs.push(innerCommand);
    } else if (seccompFilterPath) {
      const applySeccompBinary = findApplySeccompBinary();
      if (!applySeccompBinary) {
        throw Error("apply-seccomp binary not found.");
      }
      const seccompCommand = shellQuote.quote([applySeccompBinary, seccompFilterPath, shellPath, "-c", command]);
      bwrapArgs.push(seccompCommand);
    } else {
      bwrapArgs.push(command);
    }

    const wrappedCommand = shellQuote.quote(["bwrap", ...bwrapArgs]);

    // Log restrictions summary
    const restrictions = [];
    if (needsNetworkRestriction) restrictions.push("network");
    if (hasReadRestrictions || hasWriteRestrictions) restrictions.push("filesystem");
    if (seccompFilterPath) restrictions.push("seccomp(unix-block)");

    debugLog(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`);

    return wrappedCommand;

  } catch (error) {
    // Cleanup seccomp filter on error
    if (seccompFilterPath && !seccompFilterPath.includes("/vendor/seccomp/")) {
      temporarySeccompFilters.delete(seccompFilterPath);
      try {
        cleanupSeccompFilter(seccompFilterPath);
      } catch (cleanupError) {
        debugLog(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${cleanupError}`, { level: "error" });
      }
    }
    throw error;
  }
}

// Mapping: qm0→linuxSandboxWrapper, A→options, Q→command, B→needsNetworkRestriction, ...
```

---

## Inner Container Command

### buildNetworkAndSeccompCommand

Builds the command that runs inside the bwrap container, including inner socat bridges.

```javascript
// ============================================
// buildNetworkAndSeccompCommand - Build inner container command
// Location: chunks.16.mjs:3339-3354
// ============================================

// ORIGINAL (for source lookup):
function Y44(A, Q, B, G, Z) {
  let I = Z || "bash",
    Y = [
      `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`,
      `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${Q} >/dev/null 2>&1 &`,
      'trap "kill %1 %2 2>/dev/null; exit" EXIT'
    ];
  if (G) {
    let J = PxA();
    if (!J) throw Error("apply-seccomp binary not found...");
    let W = ss.default.quote([J, G, I, "-c", B]),
      X = [...Y, W].join(`\n`);
    return `${I} -c ${ss.default.quote([X])}`
  } else {
    let J = [...Y, `eval ${ss.default.quote([B])}`].join(`\n`);
    return `${I} -c ${ss.default.quote([J])}`
  }
}

// READABLE (for understanding):
function buildNetworkAndSeccompCommand(httpSocketPath, socksSocketPath, userCommand, seccompFilterPath, shell) {
  const shellToUse = shell || "bash";

  // Inner socat bridges: reverse direction from host bridges
  // These create TCP listeners that forward to the Unix sockets bound from host
  const setupCommands = [
    // HTTP proxy: localhost:3128 → Unix socket → host HTTP proxy
    `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,
    // SOCKS proxy: localhost:1080 → Unix socket → host SOCKS proxy
    `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,
    // Cleanup trap: kill background socat processes on exit
    'trap "kill %1 %2 2>/dev/null; exit" EXIT'
  ];

  if (seccompFilterPath) {
    // With seccomp: wrap user command with apply-seccomp
    const applySeccompBinary = findApplySeccompBinary();
    if (!applySeccompBinary) {
      throw Error("apply-seccomp binary not found. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included.");
    }

    const seccompWrappedCommand = shellQuote.quote([
      applySeccompBinary,
      seccompFilterPath,
      shellToUse,
      "-c",
      userCommand
    ]);

    const fullScript = [...setupCommands, seccompWrappedCommand].join("\n");
    return `${shellToUse} -c ${shellQuote.quote([fullScript])}`;

  } else {
    // Without seccomp: run user command directly
    const fullScript = [...setupCommands, `eval ${shellQuote.quote([userCommand])}`].join("\n");
    return `${shellToUse} -c ${shellQuote.quote([fullScript])}`;
  }
}

// Mapping: Y44→buildNetworkAndSeccompCommand, A→httpSocketPath, Q→socksSocketPath, B→userCommand, G→seccompFilterPath, Z→shell
```

**Inner Container Script Structure:**
```bash
#!/bin/bash

# 1. Start HTTP proxy bridge (background)
socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/claude-http-xxx.sock >/dev/null 2>&1 &

# 2. Start SOCKS proxy bridge (background)
socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/claude-socks-xxx.sock >/dev/null 2>&1 &

# 3. Cleanup trap
trap "kill %1 %2 2>/dev/null; exit" EXIT

# 4. Run user command (with or without seccomp)
# With seccomp:
/path/to/apply-seccomp /path/to/unix-block.bpf bash -c "user_command_here"
# Without seccomp:
eval "user_command_here"
```

---

## Proxy Environment Variables

### buildProxyEnvironmentVars

Generates all necessary proxy environment variables for the sandboxed process.

```javascript
// ============================================
// buildProxyEnvironmentVars - Generate proxy env vars
// Location: chunks.16.mjs:3108-3119
// ============================================

// ORIGINAL (for source lookup):
function RxA(A, Q) {
  let B = ["SANDBOX_RUNTIME=1", "TMPDIR=/tmp/claude"];
  if (!A && !Q) return B;
  let G = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
  // ... build proxy vars ...
  return B
}

// READABLE (for understanding):
function buildProxyEnvironmentVars(httpProxyPort, socksProxyPort) {
  const envVars = [
    "SANDBOX_RUNTIME=1",           // Indicate sandbox environment
    "TMPDIR=/tmp/claude"           // Sandbox-safe temp directory
  ];

  if (!httpProxyPort && !socksProxyPort) {
    return envVars;
  }

  // Local addresses that bypass proxy
  const noProxyAddresses = [
    "localhost",
    "127.0.0.1",
    "::1",
    "*.local",
    ".local",
    "169.254.0.0/16",    // Link-local
    "10.0.0.0/8",        // Private Class A
    "172.16.0.0/12",     // Private Class B
    "192.168.0.0/16"     // Private Class C
  ].join(",");

  envVars.push(`NO_PROXY=${noProxyAddresses}`);
  envVars.push(`no_proxy=${noProxyAddresses}`);

  if (httpProxyPort) {
    // HTTP/HTTPS proxy settings (uppercase and lowercase)
    envVars.push(`HTTP_PROXY=http://localhost:${httpProxyPort}`);
    envVars.push(`HTTPS_PROXY=http://localhost:${httpProxyPort}`);
    envVars.push(`http_proxy=http://localhost:${httpProxyPort}`);
    envVars.push(`https_proxy=http://localhost:${httpProxyPort}`);
  }

  if (socksProxyPort) {
    // SOCKS5 proxy settings
    envVars.push(`ALL_PROXY=socks5h://localhost:${socksProxyPort}`);
    envVars.push(`all_proxy=socks5h://localhost:${socksProxyPort}`);

    // Git SSH proxy command (macOS specific)
    if (getPlatform() === "macos") {
      envVars.push(`GIT_SSH_COMMAND="ssh -o ProxyCommand='nc -X 5 -x localhost:${socksProxyPort} %h %p'"`);
    }

    // FTP proxy
    envVars.push(`FTP_PROXY=socks5h://localhost:${socksProxyPort}`);
    envVars.push(`ftp_proxy=socks5h://localhost:${socksProxyPort}`);

    // rsync proxy
    envVars.push(`RSYNC_PROXY=localhost:${socksProxyPort}`);

    // Docker proxy
    envVars.push(`DOCKER_HTTP_PROXY=http://localhost:${httpProxyPort || socksProxyPort}`);
    envVars.push(`DOCKER_HTTPS_PROXY=http://localhost:${httpProxyPort || socksProxyPort}`);

    // Google Cloud SDK proxy
    if (httpProxyPort) {
      envVars.push("CLOUDSDK_PROXY_TYPE=https");
      envVars.push("CLOUDSDK_PROXY_ADDRESS=localhost");
      envVars.push(`CLOUDSDK_PROXY_PORT=${httpProxyPort}`);
    }

    // gRPC proxy
    envVars.push(`GRPC_PROXY=socks5h://localhost:${socksProxyPort}`);
    envVars.push(`grpc_proxy=socks5h://localhost:${socksProxyPort}`);
  }

  return envVars;
}

// Mapping: RxA→buildProxyEnvironmentVars, A→httpProxyPort, Q→socksProxyPort, B→envVars, G→noProxyAddresses
```

**Complete Environment Variable List:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `SANDBOX_RUNTIME` | `1` | Indicate sandbox environment |
| `TMPDIR` | `/tmp/claude` | Safe temp directory |
| `NO_PROXY` / `no_proxy` | Local addresses | Bypass proxy for local |
| `HTTP_PROXY` / `http_proxy` | `http://localhost:3128` | HTTP proxy |
| `HTTPS_PROXY` / `https_proxy` | `http://localhost:3128` | HTTPS proxy |
| `ALL_PROXY` / `all_proxy` | `socks5h://localhost:1080` | SOCKS5 proxy |
| `GIT_SSH_COMMAND` | SSH with ProxyCommand | Git SSH via proxy |
| `FTP_PROXY` / `ftp_proxy` | `socks5h://localhost:1080` | FTP proxy |
| `RSYNC_PROXY` | `localhost:1080` | rsync proxy |
| `DOCKER_HTTP_PROXY` | HTTP proxy URL | Docker proxy |
| `GRPC_PROXY` / `grpc_proxy` | `socks5h://localhost:1080` | gRPC proxy |

---

## Docker Nested Sandbox Support

### enableWeakerNestedSandbox

Special mode for running sandbox inside Docker containers.

**Problem:** Docker containers already use namespaces. Running bwrap inside Docker with `--proc /proc` can fail due to permission conflicts.

**Solution:** The `enableWeakerNestedSandbox` option:
1. Skips mounting `/proc` inside the bwrap container
2. Allows bwrap to work inside Docker with reduced isolation

```javascript
// From linuxSandboxWrapper:
if (!enableWeakerNestedSandbox) {
  bwrapArgs.push("--proc", "/proc");  // Normal mode: mount /proc
}
// Docker mode: skip --proc to avoid conflicts
```

**When to use:**
- Running Claude Code inside Docker container
- Running in environments with existing namespace isolation
- When `/proc` mounting fails with permission errors

---

## Complete bwrap Command Structure

### Full Command Assembly

```bash
bwrap \
  # Network isolation
  --unshare-net \

  # Bind Unix sockets for proxy
  --bind /tmp/claude-http-XXX.sock /tmp/claude-http-XXX.sock \
  --bind /tmp/claude-socks-XXX.sock /tmp/claude-socks-XXX.sock \

  # Proxy environment variables
  --setenv SANDBOX_RUNTIME 1 \
  --setenv TMPDIR /tmp/claude \
  --setenv NO_PROXY "localhost,127.0.0.1,..." \
  --setenv HTTP_PROXY http://localhost:3128 \
  --setenv HTTPS_PROXY http://localhost:3128 \
  --setenv ALL_PROXY socks5h://localhost:1080 \
  --setenv CLAUDE_CODE_HOST_HTTP_PROXY_PORT 8080 \
  --setenv CLAUDE_CODE_HOST_SOCKS_PROXY_PORT 1081 \

  # Filesystem: read-only root
  --ro-bind / / \

  # Filesystem: writable paths
  --bind /home/user/project /home/user/project \

  # Filesystem: protect sensitive files
  --ro-bind /home/user/project/.gitconfig /home/user/project/.gitconfig \
  --ro-bind /home/user/project/.git/hooks /home/user/project/.git/hooks \

  # Read deny paths
  --tmpfs /home/user/.ssh \
  --ro-bind /dev/null /home/user/.aws/credentials \

  # Standard container setup
  --dev /dev \
  --unshare-pid \
  --proc /proc \

  # Shell and command
  -- /bin/bash -c \
  'socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/claude-http-XXX.sock >/dev/null 2>&1 &
   socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/claude-socks-XXX.sock >/dev/null 2>&1 &
   trap "kill %1 %2 2>/dev/null; exit" EXIT
   /path/to/apply-seccomp /path/to/unix-block.bpf bash -c "user_command"'
```

---

## Comparison: macOS vs Linux

| Aspect | macOS (Seatbelt) | Linux (bwrap) |
|--------|------------------|---------------|
| **Technology** | App Sandbox (sandbox-exec) | bubblewrap containers |
| **Isolation Type** | Mandatory Access Control | Linux namespaces |
| **Network** | Built-in deny + proxy | `--unshare-net` + proxy |
| **Filesystem** | Seatbelt policy rules | Bind mounts |
| **Unix Socket Blocking** | Built-in policy | Seccomp BPF filter |
| **Violation Detection** | Log stream parsing | None (prevention only) |
| **Docker Support** | N/A | `enableWeakerNestedSandbox` |
| **Dependencies** | None (built-in) | bwrap, socat |

---

## Related Symbols

Key functions documented in this file:
- `linuxSandboxWrapper` (qm0) - Main sandbox wrapper
- `buildFilesystemRestrictions` (J44) - Build bind mount args
- `initializeLinuxBridges` (wm0) - socat proxy bridge setup
- `buildNetworkAndSeccompCommand` (Y44) - Inner container command
- `buildProxyEnvironmentVars` (RxA) - Proxy env var generation
- `checkLinuxDependencies` ($m0) - Verify bwrap/socat available
- `findSeccompBPFFilter` (NH1) - Locate BPF filter file
- `findApplySeccompBinary` (PxA) - Locate apply-seccomp binary
- `getArchitectureForSeccomp` (Km0) - Detect CPU architecture
- `findDangerousFilesForDenylist` (Z44) - Find sensitive files
