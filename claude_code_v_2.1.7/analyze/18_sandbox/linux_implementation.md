# Linux Sandbox Implementation (2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `linuxSandboxWrapper` (IHB) - Main sandbox wrapper function
- `buildFilesystemRestrictions` (C58) - Build bwrap bind mount arguments
- `initializeLinuxBridges` (XHB) - Create socat Unix-to-TCP bridges
- `buildNetworkAndSeccompCommand` ($58) - Build inner container command
- `checkLinuxDependencies` (JHB) - Verify bwrap/socat installed
- `getArchitectureForSeccomp` (eFB) - Detect CPU architecture

---

## 1. Overview

### Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                          HOST SYSTEM                                         |
|                                                                              |
|  +-----------------+     +-------------------+                               |
|  | HTTP Proxy      |     | SOCKS Proxy       |                               |
|  | localhost:XXXX  |     | localhost:YYYY    |                               |
|  +--------+--------+     +---------+---------+                               |
|           |                        |                                         |
|           v                        v                                         |
|  +------------------+     +------------------+                               |
|  | socat bridge     |     | socat bridge     |                               |
|  | TCP:localhost -> |     | TCP:localhost -> |                               |
|  | UNIX:/tmp/sock1  |     | UNIX:/tmp/sock2  |                               |
|  +--------+---------+     +---------+--------+                               |
|           |                         |                                        |
+-----------+-------------------------+----------------------------------------+
            |                         |
            v                         v
+-----------------------------------------------------------------------------+
|                      BWRAP CONTAINER (Network Namespace)                     |
|                                                                              |
|  +------------------+     +------------------+                               |
|  | socat reverse    |     | socat reverse    |                               |
|  | UNIX:/tmp/sock1->|     | UNIX:/tmp/sock2->|                               |
|  | TCP:localhost:   |     | TCP:localhost:   |                               |
|  | 3128             |     | 1080             |                               |
|  +--------+---------+     +---------+--------+                               |
|           |                         |                                        |
|           +------------+------------+                                        |
|                        |                                                     |
|                        v                                                     |
|  +--------------------------------------------------------------+           |
|  |                    SECCOMP BPF FILTER                         |           |
|  |  +--------------------------------------------------------+   |           |
|  |  | Blocks: socket(AF_UNIX, ...)                           |   |           |
|  |  | Allows: All other syscalls                             |   |           |
|  |  +--------------------------------------------------------+   |           |
|  +--------------------------------------------------------------+           |
|                        |                                                     |
|                        v                                                     |
|  +--------------------------------------------------------------+           |
|  |                    USER COMMAND                               |           |
|  |  /bin/bash -c "actual_command_here"                          |           |
|  +--------------------------------------------------------------+           |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### Why This Architecture

**Problem:** Linux lacks a built-in fine-grained sandbox like macOS Seatbelt.

**Solution:** Combine multiple technologies:
1. **bubblewrap (bwrap)** - User namespace isolation, mount namespace control
2. **Network namespace** - Complete network isolation via `--unshare-net`
3. **socat bridges** - Tunnel proxy connections through Unix sockets
4. **seccomp BPF** - Block Unix socket creation to prevent local IPC attacks

**Trade-offs:**
- More complex setup than macOS
- Requires external dependencies (bwrap, socat)
- No real-time violation monitoring (unlike macOS log stream)
- Stronger isolation guarantees

---

## 2. Dependency Checking

### checkLinuxDependencies Function

```javascript
// ============================================
// checkLinuxDependencies - Verify bwrap and socat installed
// Location: chunks.53.mjs:2170-2192
// ============================================

// ORIGINAL (for source lookup):
function JHB(A = !1) {
  try {
    let Q = Hr1("which", ["bwrap"], { stdio: "ignore", timeout: 1000 }),
      B = Hr1("which", ["socat"], { stdio: "ignore", timeout: 1000 }),
      G = Q.status === 0 && B.status === 0;
    if (!A) {
      let Z = Vr1() !== null, Y = _01() !== null;
      if (!Z || !Y) DB("[Sandbox Linux] Seccomp filtering not available (missing binaries)...", { level: "warn" })
    }
    return G
  } catch { return !1 }
}

// READABLE (for understanding):
function checkLinuxDependencies(skipSeccompCheck = false) {
  try {
    // Check if bwrap is available
    let bwrapCheck = execSync("which", ["bwrap"], {
      stdio: "ignore",
      timeout: 1000
    });

    // Check if socat is available
    let socatCheck = execSync("which", ["socat"], {
      stdio: "ignore",
      timeout: 1000
    });

    let hasAllDeps = bwrapCheck.status === 0 && socatCheck.status === 0;

    // Optionally check seccomp binaries
    if (!skipSeccompCheck) {
      let hasBpfFilter = findSeccompBpfFilter() !== null;
      let hasApplySeccomp = findApplySeccompBinary() !== null;
      if (!hasBpfFilter || !hasApplySeccomp) {
        log("[Sandbox Linux] Seccomp filtering not available (missing binaries). " +
            "Sandbox will run without Unix socket blocking.", { level: "warn" });
      }
    }

    return hasAllDeps;
  } catch {
    return false;
  }
}

// Mapping: JHB->checkLinuxDependencies, A->skipSeccompCheck, Hr1->execSync
// Vr1->findSeccompBpfFilter, _01->findApplySeccompBinary
```

**Required binaries:**
- `bwrap` - bubblewrap sandbox container
- `socat` - Socket relay for proxy bridging
- `rg` - ripgrep for dangerous file scanning

---

## 3. Seccomp BPF Filtering

### 3.1 Architecture Detection

```javascript
// ============================================
// getArchitectureForSeccomp - Determine supported architecture
// Location: chunks.53.mjs:2035-2052
// ============================================

// ORIGINAL (for source lookup):
function eFB() {
  let A = process.arch;
  switch (A) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      return DB("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking.", { level: "error" }), null;
    default:
      return DB(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
  }
}

// READABLE (for understanding):
function getArchitectureForSeccomp() {
  let arch = process.arch;
  switch (arch) {
    case "x64":
    case "x86_64":
      return "x64";

    case "arm64":
    case "aarch64":
      return "arm64";

    case "ia32":
    case "x86":
      // 32-bit x86 NOT supported due to socketcall() bypass
      log("[SeccompFilter] 32-bit x86 (ia32) is not currently supported " +
          "due to missing socketcall() syscall blocking.", { level: "error" });
      return null;

    default:
      log(`[SeccompFilter] Unsupported architecture: ${arch}. Only x64 and arm64 are supported.`);
      return null;
  }
}

// Mapping: eFB->getArchitectureForSeccomp, A->arch
```

### Why ia32 (32-bit x86) is NOT Supported

**Security vulnerability:**
- The seccomp filter blocks `socket(AF_UNIX, ...)` syscall
- On 32-bit x86, `socketcall()` can be used instead
- `socketcall()` is a multiplexed syscall that wraps socket operations
- Blocking just `socket()` leaves a bypass hole via `socketcall()`

**Result:** 32-bit Linux is excluded from seccomp filtering.

### 3.2 Finding Seccomp Binaries

```javascript
// ============================================
// findSeccompBpfFilter - Locate pre-compiled BPF filter
// Location: chunks.53.mjs:2054-2064
// ============================================

// ORIGINAL (for source lookup):
function Vr1() {
  let A = eFB();
  if (!A) return null;
  let Q = sFB(tFB(import.meta.url)),
    B = Ka("vendor", "seccomp", A, "unix-block.bpf"),
    G = [Ka(Q, B), Ka(Q, "..", "..", B), Ka(Q, "..", B)];
  for (let Z of G)
    if (Kr1.existsSync(Z)) return Z;
  return null
}

// READABLE (for understanding):
function findSeccompBpfFilter() {
  let arch = getArchitectureForSeccomp();
  if (!arch) return null;

  let baseDir = dirname(fileURLToPath(import.meta.url));
  let relativePath = path.join("vendor", "seccomp", arch, "unix-block.bpf");

  // Search in multiple locations
  let searchPaths = [
    path.join(baseDir, relativePath),
    path.join(baseDir, "..", "..", relativePath),
    path.join(baseDir, "..", relativePath)
  ];

  for (let searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

// Mapping: Vr1->findSeccompBpfFilter, eFB->getArchitectureForSeccomp
```

**File locations:**
- `vendor/seccomp/x64/unix-block.bpf` - Pre-compiled BPF filter for x64
- `vendor/seccomp/arm64/unix-block.bpf` - Pre-compiled BPF filter for arm64
- `vendor/seccomp/{arch}/apply-seccomp` - Binary to apply the filter

---

## 4. Network Bridge Setup

### 4.1 Why Double-socat Bridge Architecture

**Problem:** Inside the bwrap container with `--unshare-net`, there's no network connectivity. But we need to route traffic through the host's HTTP/SOCKS proxies.

**Solution:** Use Unix sockets as the communication channel:

```
HOST:                           CONTAINER:
┌─────────────────┐             ┌─────────────────┐
│ HTTP Proxy      │             │ Inner socat     │
│ localhost:3128  │             │ TCP:3128 <──────┼──── Programs use
└────────┬────────┘             └────────┬────────┘     localhost:3128
         │                               │
         v                               v
┌─────────────────┐             ┌─────────────────┐
│ Outer socat     │<──UNIX──────│ Unix socket     │
│ TCP→UNIX bridge │   socket    │ /tmp/claude-*.sock
└─────────────────┘             └─────────────────┘
```

1. Host-side socat: `TCP:localhost:proxyPort` → `UNIX:/tmp/claude-http-*.sock`
2. Container-side socat: `UNIX:/tmp/claude-http-*.sock` → `TCP:localhost:3128`

**Why Unix sockets work:** They exist in the filesystem namespace, which is shared via bind mounts.

### 4.2 initializeLinuxBridges Function

```javascript
// ============================================
// initializeLinuxBridges - Create HTTP and SOCKS proxy bridges
// Location: chunks.53.mjs:2194-2265
// ============================================

// ORIGINAL (for source lookup):
async function XHB(A, Q) {
  let B = V58(8).toString("hex"),
    G = ZHB(GHB(), `claude-http-${B}.sock`),
    Z = ZHB(GHB(), `claude-socks-${B}.sock`),
    Y = [`UNIX-LISTEN:${G},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  let J = BHB("socat", Y, { stdio: "ignore" });
  if (!J.pid) throw Error("Failed to start HTTP bridge process");
  J.on("error", (W) => { DB(`HTTP bridge process error: ${W}`, { level: "error" }) });

  let X = [`UNIX-LISTEN:${Z},fork,reuseaddr`, `TCP:localhost:${Q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  let I = BHB("socat", X, { stdio: "ignore" });
  if (!I.pid) {
    if (J.pid) try { process.kill(J.pid, "SIGTERM") } catch {}
    throw Error("Failed to start SOCKS bridge process")
  }

  let D = 5;
  for (let W = 0; W < D; W++) {
    if (!J.pid || J.killed || !I.pid || I.killed) throw Error("Linux bridge process died unexpectedly");
    if (FC.existsSync(G) && FC.existsSync(Z)) break;
    if (W === D - 1) throw Error(`Failed to create bridge sockets after ${D} attempts`);
    await new Promise((K) => setTimeout(K, W * 100))
  }
  return { httpSocketPath: G, socksSocketPath: Z, httpBridgeProcess: J, socksBridgeProcess: I, httpProxyPort: A, socksProxyPort: Q }
}

// READABLE (for understanding):
async function initializeLinuxBridges(httpProxyPort, socksProxyPort) {
  // Generate random socket names to avoid collisions
  let randomHex = crypto.randomBytes(8).toString("hex");
  let httpSocketPath = path.join(getTempDir(), `claude-http-${randomHex}.sock`);
  let socksSocketPath = path.join(getTempDir(), `claude-socks-${randomHex}.sock`);

  // Start HTTP bridge: UNIX socket <- TCP localhost:httpProxyPort
  let httpArgs = [
    `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
    `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  let httpProcess = spawn("socat", httpArgs, { stdio: "ignore" });
  if (!httpProcess.pid) {
    throw Error("Failed to start HTTP bridge process");
  }
  httpProcess.on("error", (err) => {
    log(`HTTP bridge process error: ${err}`, { level: "error" });
  });

  // Start SOCKS bridge: UNIX socket <- TCP localhost:socksProxyPort
  let socksArgs = [
    `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
    `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  let socksProcess = spawn("socat", socksArgs, { stdio: "ignore" });
  if (!socksProcess.pid) {
    // Cleanup HTTP process on failure
    if (httpProcess.pid) {
      try { process.kill(httpProcess.pid, "SIGTERM"); } catch {}
    }
    throw Error("Failed to start SOCKS bridge process");
  }

  // Wait for sockets to be created (with retry)
  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Check if processes died
    if (!httpProcess.pid || httpProcess.killed || !socksProcess.pid || socksProcess.killed) {
      throw Error("Linux bridge process died unexpectedly");
    }

    // Check if sockets exist
    if (fs.existsSync(httpSocketPath) && fs.existsSync(socksSocketPath)) {
      log(`Linux bridges ready after ${attempt + 1} attempts`);
      break;
    }

    // Give up after max retries
    if (attempt === MAX_RETRIES - 1) {
      // Cleanup
      if (httpProcess.pid) try { process.kill(httpProcess.pid, "SIGTERM"); } catch {}
      if (socksProcess.pid) try { process.kill(socksProcess.pid, "SIGTERM"); } catch {}
      throw Error(`Failed to create bridge sockets after ${MAX_RETRIES} attempts`);
    }

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, attempt * 100));
  }

  return {
    httpSocketPath,
    socksSocketPath,
    httpBridgeProcess: httpProcess,
    socksBridgeProcess: socksProcess,
    httpProxyPort,
    socksProxyPort
  };
}

// Mapping: XHB->initializeLinuxBridges, A->httpProxyPort, Q->socksProxyPort
// V58->crypto.randomBytes, GHB->getTempDir, BHB->spawn
```

---

## 5. Filesystem Restrictions

### 5.1 buildFilesystemRestrictions Function

```javascript
// ============================================
// buildFilesystemRestrictions - Build bwrap bind mount arguments
// Location: chunks.53.mjs:2284-2337
// ============================================

// ORIGINAL (for source lookup):
async function C58(A, Q, B = { command: "rg" }, G = zr1, Z = !1, Y) {
  let J = [];
  if (Q) {
    J.push("--ro-bind", "/", "/");
    let I = [];
    for (let W of Q.allowOnly || []) {
      let K = KP(W);
      if (K.startsWith("/dev/")) continue;
      if (!FC.existsSync(K)) continue;
      J.push("--bind", K, K), I.push(K)
    }
    let D = [...Q.denyWithinAllow || [], ...await E58(B, G, Z, Y)];
    for (let W of D) {
      let K = KP(W);
      if (K.startsWith("/dev/")) continue;
      let V = F58(K, I);
      if (V) { J.push("--ro-bind", "/dev/null", V); continue }
      if (!FC.existsSync(K)) {
        let H = Mz.dirname(K);
        while (H !== "/" && !FC.existsSync(H)) H = Mz.dirname(H);
        if (I.some((z) => H.startsWith(z + "/") || H === z || K.startsWith(z + "/"))) {
          let z = H58(K);
          J.push("--ro-bind", "/dev/null", z)
        }
        continue
      }
      if (I.some((H) => K.startsWith(H + "/") || K === H)) J.push("--ro-bind", K, K)
    }
  } else J.push("--bind", "/", "/");
  // ... read restrictions ...
  return J
}

// READABLE (for understanding):
async function buildFilesystemRestrictions(
  readConfig,
  writeConfig,
  ripgrepConfig = { command: "rg" },
  searchDepth = 3,
  allowGitConfig = false,
  abortSignal
) {
  let bwrapArgs = [];

  if (writeConfig) {
    // Default: Read-only root
    bwrapArgs.push("--ro-bind", "/", "/");

    // Track writable paths for deny-within-allow logic
    let writablePaths = [];

    // Mount writable paths
    for (let writePath of writeConfig.allowOnly || []) {
      let normalizedPath = normalizePath(writePath);

      // Skip /dev paths
      if (normalizedPath.startsWith("/dev/")) {
        log(`[Sandbox Linux] Skipping /dev path: ${normalizedPath}`);
        continue;
      }

      // Skip non-existent paths
      if (!fs.existsSync(normalizedPath)) {
        log(`[Sandbox Linux] Skipping non-existent write path: ${normalizedPath}`);
        continue;
      }

      // Mount as writable
      bwrapArgs.push("--bind", normalizedPath, normalizedPath);
      writablePaths.push(normalizedPath);
    }

    // Build deny list (explicit denies + dangerous files)
    let denyPaths = [
      ...(writeConfig.denyWithinAllow || []),
      ...(await findDangerousFiles(ripgrepConfig, searchDepth, allowGitConfig, abortSignal))
    ];

    // Apply deny-within-allow logic
    for (let denyPath of denyPaths) {
      let normalizedPath = normalizePath(denyPath);

      // Skip /dev paths
      if (normalizedPath.startsWith("/dev/")) continue;

      // Check for symlink attack
      let symlinkInPath = findSymlinkInPath(normalizedPath, writablePaths);
      if (symlinkInPath) {
        // Mount /dev/null at symlink to prevent attack
        bwrapArgs.push("--ro-bind", "/dev/null", symlinkInPath);
        log(`[Sandbox Linux] Mounted /dev/null at symlink ${symlinkInPath} to prevent attack`);
        continue;
      }

      // Handle non-existent paths
      if (!fs.existsSync(normalizedPath)) {
        // Find first existing parent
        let parent = path.dirname(normalizedPath);
        while (parent !== "/" && !fs.existsSync(parent)) {
          parent = path.dirname(parent);
        }

        // Only block if parent is within writable paths
        if (writablePaths.some(wp => parent.startsWith(wp + "/") || parent === wp || normalizedPath.startsWith(wp + "/"))) {
          let firstNonExistent = findFirstNonExistent(normalizedPath);
          bwrapArgs.push("--ro-bind", "/dev/null", firstNonExistent);
          log(`[Sandbox Linux] Mounted /dev/null at ${firstNonExistent} to block creation of ${normalizedPath}`);
        }
        continue;
      }

      // Mount existing deny paths as read-only if within writable
      if (writablePaths.some(wp => normalizedPath.startsWith(wp + "/") || normalizedPath === wp)) {
        bwrapArgs.push("--ro-bind", normalizedPath, normalizedPath);
      }
    }
  } else {
    // No write restrictions: bind entire root as writable
    bwrapArgs.push("--bind", "/", "/");
  }

  // Apply read restrictions
  let readDenyPaths = [...(readConfig?.denyOnly || [])];
  if (fs.existsSync("/etc/ssh/ssh_config.d")) {
    readDenyPaths.push("/etc/ssh/ssh_config.d");
  }

  for (let denyPath of readDenyPaths) {
    let normalizedPath = normalizePath(denyPath);
    if (!fs.existsSync(normalizedPath)) continue;

    if (fs.statSync(normalizedPath).isDirectory()) {
      // Mount tmpfs over directories
      bwrapArgs.push("--tmpfs", normalizedPath);
    } else {
      // Mount /dev/null over files
      bwrapArgs.push("--ro-bind", "/dev/null", normalizedPath);
    }
  }

  return bwrapArgs;
}

// Mapping: C58->buildFilesystemRestrictions, A->readConfig, Q->writeConfig
// E58->findDangerousFiles, F58->findSymlinkInPath, H58->findFirstNonExistent
```

### 5.2 Symlink Attack Protection (NEW in 2.1.7)

```javascript
// ============================================
// findSymlinkInPath - Detect symlinks in path for attack prevention
// Location: chunks.53.mjs:2090-2106
// ============================================

// ORIGINAL (for source lookup):
function F58(A, Q) {
  let B = A.split(Mz.sep), G = "";
  for (let Z of B) {
    if (!Z) continue;
    let Y = G + Mz.sep + Z;
    try {
      if (FC.lstatSync(Y).isSymbolicLink()) {
        if (Q.some((I) => Y.startsWith(I + "/") || Y === I)) return Y
      }
    } catch { break }
    G = Y
  }
  return null
}

// READABLE (for understanding):
function findSymlinkInPath(targetPath, writablePaths) {
  let pathComponents = targetPath.split(path.sep);
  let currentPath = "";

  for (let component of pathComponents) {
    if (!component) continue;

    let testPath = currentPath + path.sep + component;

    try {
      // Check if this path component is a symlink
      if (fs.lstatSync(testPath).isSymbolicLink()) {
        // Only flag if symlink is within a writable path
        if (writablePaths.some(wp => testPath.startsWith(wp + "/") || testPath === wp)) {
          return testPath;  // Return the symlink path
        }
      }
    } catch {
      // Path doesn't exist, stop checking
      break;
    }

    currentPath = testPath;
  }

  return null;
}

// Mapping: F58->findSymlinkInPath, A->targetPath, Q->writablePaths
```

**Why symlink protection:**
An attacker could create a symlink like `project/.git -> /etc` and then write to `project/.git/passwd`. The sandbox would block `/etc/passwd` but allow `project/.git/passwd` (within workspace). This check detects and blocks such symlinks.

---

## 6. Main Sandbox Wrapper

### 6.1 linuxSandboxWrapper Function

```javascript
// ============================================
// linuxSandboxWrapper - Main Linux sandbox wrapper
// Location: chunks.53.mjs:2339-2423
// ============================================

// ORIGINAL (for source lookup):
async function IHB(A) {
  let {
    command: Q, needsNetworkRestriction: B, httpSocketPath: G, socksSocketPath: Z,
    httpProxyPort: Y, socksProxyPort: J, readConfig: X, writeConfig: I,
    enableWeakerNestedSandbox: D, allowAllUnixSockets: W, binShell: K,
    ripgrepConfig: V = { command: "rg" }, mandatoryDenySearchDepth: F = zr1,
    allowGitConfig: H = !1, abortSignal: E
  } = A, z = X && X.denyOnly.length > 0, $ = I !== void 0;
  if (!B && !z && !$) return Q;

  let O = ["--new-session", "--die-with-parent"], L = void 0;
  try {
    if (!W) if (L = AHB() ?? void 0, !L) DB("[Sandbox Linux] Seccomp filter not available...", { level: "warn" });
    else { if (!L.includes("/vendor/seccomp/")) Er1.add(L), z58(); }
    if (B) {
      O.push("--unshare-net");
      if (G && Z) {
        O.push("--bind", G, G), O.push("--bind", Z, Z);
        let u = M01(3128, 1080);
        O.push(...u.flatMap((f) => { let AA = f.indexOf("="); return ["--setenv", f.slice(0, AA), f.slice(AA + 1)] }));
        if (Y !== void 0) O.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(Y));
        if (J !== void 0) O.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(J))
      }
    }
    let M = await C58(X, I, V, F, H, E);
    O.push(...M), O.push("--dev", "/dev"), O.push("--unshare-pid");
    if (!D) O.push("--proc", "/proc");
    // ... shell execution setup ...
    return bwrapCommand
  } catch (M) { /* cleanup */ throw M }
}

// READABLE (for understanding):
async function linuxSandboxWrapper(options) {
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
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    abortSignal
  } = options;

  const hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
  const hasWriteRestrictions = writeConfig !== undefined;

  // If no restrictions needed, return command unchanged
  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions) {
    return command;
  }

  // Base bwrap arguments
  let bwrapArgs = ["--new-session", "--die-with-parent"];
  let seccompFilter = undefined;

  try {
    // Setup seccomp filter (unless allowAllUnixSockets)
    if (!allowAllUnixSockets) {
      seccompFilter = getOrGenerateSeccompFilter() ?? undefined;
      if (!seccompFilter) {
        log("[Sandbox Linux] Seccomp filter not available. Continuing without Unix socket blocking.", { level: "warn" });
      } else {
        // Track for cleanup
        if (!seccompFilter.includes("/vendor/seccomp/")) {
          tempSeccompFilters.add(seccompFilter);
          registerCleanupOnExit();
        }
        log("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking");
      }
    } else {
      log("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    }

    // Network isolation
    if (needsNetworkRestriction) {
      bwrapArgs.push("--unshare-net");

      if (httpSocketPath && socksSocketPath) {
        // Verify sockets exist
        if (!fs.existsSync(httpSocketPath)) {
          throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}`);
        }
        if (!fs.existsSync(socksSocketPath)) {
          throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}`);
        }

        // Bind socket paths into container
        bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
        bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

        // Set proxy environment variables
        let proxyEnvVars = buildProxyEnvironmentVars(3128, 1080);
        bwrapArgs.push(...proxyEnvVars.flatMap(envVar => {
          let eqIndex = envVar.indexOf("=");
          let name = envVar.slice(0, eqIndex);
          let value = envVar.slice(eqIndex + 1);
          return ["--setenv", name, value];
        }));

        // Pass host ports for inner socat
        if (httpProxyPort !== undefined) {
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(httpProxyPort));
        }
        if (socksProxyPort !== undefined) {
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(socksProxyPort));
        }
      }
    }

    // Filesystem restrictions
    let fsArgs = await buildFilesystemRestrictions(
      readConfig, writeConfig, ripgrepConfig, mandatoryDenySearchDepth, allowGitConfig, abortSignal
    );
    bwrapArgs.push(...fsArgs);

    // Device and process namespace
    bwrapArgs.push("--dev", "/dev");
    bwrapArgs.push("--unshare-pid");

    // Mount /proc (unless in Docker)
    if (!enableWeakerNestedSandbox) {
      bwrapArgs.push("--proc", "/proc");
    }

    // Find shell path
    let shell = binShell || "bash";
    let whichResult = execSync("which", [shell], { encoding: "utf8" });
    if (whichResult.status !== 0) {
      throw Error(`Shell '${shell}' not found in PATH`);
    }
    let shellPath = whichResult.stdout.trim();
    bwrapArgs.push("--", shellPath, "-c");

    // Build final command
    if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
      let innerCommand = buildNetworkAndSeccompCommand(httpSocketPath, socksSocketPath, command, seccompFilter, shellPath);
      bwrapArgs.push(innerCommand);
    } else if (seccompFilter) {
      let applySeccomp = findApplySeccompBinary();
      if (!applySeccomp) {
        throw Error("apply-seccomp binary not found");
      }
      let seccompCommand = shellQuote([applySeccomp, seccompFilter, shellPath, "-c", command]);
      bwrapArgs.push(seccompCommand);
    } else {
      bwrapArgs.push(command);
    }

    // Build final bwrap command
    let fullCommand = shellQuote(["bwrap", ...bwrapArgs]);

    // Log restrictions applied
    let restrictions = [];
    if (needsNetworkRestriction) restrictions.push("network");
    if (hasReadRestrictions || hasWriteRestrictions) restrictions.push("filesystem");
    if (seccompFilter) restrictions.push("seccomp(unix-block)");
    log(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`);

    return fullCommand;
  } catch (error) {
    // Cleanup on error
    if (seccompFilter && !seccompFilter.includes("/vendor/seccomp/")) {
      tempSeccompFilters.delete(seccompFilter);
      try { cleanupSeccompFilter(seccompFilter); } catch {}
    }
    throw error;
  }
}

// Mapping: IHB->linuxSandboxWrapper, A->options, Q->command, B->needsNetworkRestriction
// C58->buildFilesystemRestrictions, M01->buildProxyEnvironmentVars
```

### 6.2 Complete bwrap Command Structure

```bash
bwrap \
  --new-session \                          # New session for isolation
  --die-with-parent \                      # Cleanup on parent exit
  --unshare-net \                          # Network namespace isolation
  --bind /tmp/claude-http-xxx.sock /tmp/claude-http-xxx.sock \  # HTTP socket
  --bind /tmp/claude-socks-xxx.sock /tmp/claude-socks-xxx.sock \ # SOCKS socket
  --setenv HTTP_PROXY "http://localhost:3128" \   # Proxy env vars
  --setenv HTTPS_PROXY "http://localhost:3128" \
  --setenv ALL_PROXY "socks5://localhost:1080" \
  --ro-bind / / \                          # Read-only root
  --bind /path/to/workspace /path/to/workspace \  # Writable workspace
  --ro-bind /dev/null /path/to/.gitconfig \       # Block sensitive files
  --dev /dev \                             # Device files
  --unshare-pid \                          # PID namespace isolation
  --proc /proc \                           # Mount /proc
  -- /bin/bash -c \                        # Execute in shell
  'socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/... >/dev/null 2>&1 &
   socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/... >/dev/null 2>&1 &
   trap "kill %1 %2 2>/dev/null; exit" EXIT
   apply-seccomp /path/to/unix-block.bpf /bin/bash -c "actual_command"'
```

---

## 7. Inner Container Command

### 7.1 buildNetworkAndSeccompCommand Function

```javascript
// ============================================
// buildNetworkAndSeccompCommand - Build inner container script
// Location: chunks.53.mjs:2267-2282
// ============================================

// ORIGINAL (for source lookup):
function $58(A, Q, B, G, Z) {
  let Y = Z || "bash",
    J = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`,
         `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${Q} >/dev/null 2>&1 &`,
         'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
  if (G) {
    let X = _01();
    if (!X) throw Error("apply-seccomp binary not found");
    let I = QBA.default.quote([X, G, Y, "-c", B]),
      D = [...J, I].join("\n");
    return `${Y} -c ${QBA.default.quote([D])}`
  } else {
    let X = [...J, `eval ${QBA.default.quote([B])}`].join("\n");
    return `${Y} -c ${QBA.default.quote([X])}`
  }
}

// READABLE (for understanding):
function buildNetworkAndSeccompCommand(
  httpSocketPath,
  socksSocketPath,
  userCommand,
  seccompFilter,
  shell
) {
  let shellPath = shell || "bash";

  // Inner script lines
  let scriptLines = [
    // Start HTTP bridge: TCP:3128 <- UNIX socket
    `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,

    // Start SOCKS bridge: TCP:1080 <- UNIX socket
    `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,

    // Cleanup trap
    'trap "kill %1 %2 2>/dev/null; exit" EXIT'
  ];

  if (seccompFilter) {
    // With seccomp: wrap command in apply-seccomp
    let applySeccompPath = findApplySeccompBinary();
    if (!applySeccompPath) {
      throw Error("apply-seccomp binary not found");
    }

    let seccompCommand = shellQuote([applySeccompPath, seccompFilter, shellPath, "-c", userCommand]);
    let fullScript = [...scriptLines, seccompCommand].join("\n");
    return `${shellPath} -c ${shellQuote([fullScript])}`;
  } else {
    // Without seccomp: execute command directly
    let fullScript = [...scriptLines, `eval ${shellQuote([userCommand])}`].join("\n");
    return `${shellPath} -c ${shellQuote([fullScript])}`;
  }
}

// Mapping: $58->buildNetworkAndSeccompCommand, A->httpSocketPath, Q->socksSocketPath
// B->userCommand, G->seccompFilter, Z->shell
```

### 7.2 Inner Script Breakdown

```bash
#!/bin/bash

# 1. Start reverse HTTP bridge
# Listens on TCP:3128, forwards to Unix socket on host
socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:/tmp/claude-http-xxx.sock >/dev/null 2>&1 &

# 2. Start reverse SOCKS bridge
# Listens on TCP:1080, forwards to Unix socket on host
socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:/tmp/claude-socks-xxx.sock >/dev/null 2>&1 &

# 3. Cleanup on exit
# Kill background socat processes when script exits
trap "kill %1 %2 2>/dev/null; exit" EXIT

# 4. Execute user command with seccomp filter
/path/to/apply-seccomp /path/to/unix-block.bpf /bin/bash -c "user_command_here"
```

---

## 8. Docker Nested Sandbox Support

### enableWeakerNestedSandbox Option

When running inside Docker or other container environments:

```javascript
// enableWeakerNestedSandbox = true
if (!enableWeakerNestedSandbox) {
  bwrapArgs.push("--proc", "/proc");
}
```

**Why skip /proc mounting in Docker:**
- Docker already provides an isolated /proc
- Nested /proc mounting can fail or cause conflicts
- The container's /proc is already sufficiently isolated

---

## 9. v2.1.7 Changes from v2.0.59

### New Features

1. **`allowGitConfig` parameter** - Allows `.git/config` modification when explicitly enabled
2. **Symlink attack protection** (`F58`) - Detects and blocks symlinks used to escape sandbox
3. **Improved path handling** - Better handling of non-existent deny paths

### Security Improvements

1. **Symlink detection** - Prevents `project/.git -> /etc` style attacks
2. **First-non-existent blocking** - Blocks creation of deny paths within writable areas
3. **Enhanced logging** - Better visibility into sandbox decisions

---

## See Also

- [overview.md](./overview.md) - System architecture
- [macos_implementation.md](./macos_implementation.md) - macOS comparison
- [tool_integration.md](./tool_integration.md) - Bash tool integration
