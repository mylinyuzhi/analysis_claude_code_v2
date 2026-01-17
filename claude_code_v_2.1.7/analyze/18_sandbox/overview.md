# Sandbox Module Overview (2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `initializeSandbox` (P58) - Main sandbox initialization entry point
- `isSandboxingEnabled` (o01) - High-level sandbox availability check
- `sandboxManager` (XB) - Central sandbox management object
- `checkDependencies` (nr1) - Validate required dependencies

---

## 1. System Architecture

### High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                         Claude Code Sandbox System                            |
+-----------------------------------------------------------------------------+
|                                                                               |
|  +-----------------------------------------------------------------------+   |
|  |                      Layer 1: Settings & Configuration                 |   |
|  |                                                                        |   |
|  |  +--------------+  +--------------+  +---------------+  +------------+ |   |
|  |  | localSettings|  |flagSettings  |  |policySettings |  |  CLI Args  | |   |
|  |  |  (user)      |  |  (flags)     |  |  (enterprise) |  |  --sandbox | |   |
|  |  +------+-------+  +------+-------+  +-------+-------+  +------+-----+ |   |
|  |         +----------------+|+-----------------+----------------+         |   |
|  |                          ||                                             |   |
|  |                          vv                                             |   |
|  |                +-----------------------+                                |   |
|  |                | parseSettingsToConfig |                                |   |
|  |                | (settings -> sandbox) |                                |   |
|  |                +----------+------------+                                |   |
|  +-------------------------------+----------------------------------------+   |
|                                  v                                            |
|  +-----------------------------------------------------------------------+   |
|  |                      Layer 2: Core Sandbox Engine                      |   |
|  |                                                                        |   |
|  |  +------------------------------------------------------------------+  |   |
|  |  |                    sandboxManager (XB) Object                     |  |   |
|  |  | +-------------+ +-------------+ +-----------------------------+   |  |   |
|  |  | |  network    | |  filesystem | |  ignoreViolations           |   |  |   |
|  |  | | ----------- | | ----------- | | --------------------------- |   |  |   |
|  |  | |allowedDomains| denyRead    | | {"*": [...patterns...]}     |   |  |   |
|  |  | |deniedDomains| |allowWrite  | | {"cmd": [...patterns...]}   |   |  |   |
|  |  | |allowUnixSock| |denyWrite   | |                              |   |  |   |
|  |  | |httpProxyPort|              | |                              |   |  |   |
|  |  | +-------------+ +-------------+ +-----------------------------+   |  |   |
|  |  +------------------------------------------------------------------+  |   |
|  |                              |                                         |   |
|  |              +---------------+---------------+                         |   |
|  |              v               v               v                         |   |
|  |  +-----------------+ +-----------------+ +-----------------+           |   |
|  |  | Network Proxy   | | Filesystem      | | Violation       |           |   |
|  |  | Infrastructure  | | Config Getters  | | Monitoring      |           |   |
|  |  | (HTTP + SOCKS)  | |                 | | (macOS only)    |           |   |
|  |  +-----------------+ +-----------------+ +-----------------+           |   |
|  +-----------------------------------------------------------------------+   |
|                              |                                               |
|                              v                                               |
|  +-----------------------------------------------------------------------+   |
|  |                   Layer 3: Platform-Specific Wrappers                  |   |
|  |                                                                        |   |
|  |  +-----------------------------+  +---------------------------------+  |   |
|  |  |        macOS Sandbox        |  |         Linux Sandbox           |  |   |
|  |  |     (Apple Seatbelt)        |  |      (bubblewrap/bwrap)         |  |   |
|  |  |                             |  |                                 |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  | | generateSandboxProfile  | |  | | buildFilesystemRestrictions | |  |   |
|  |  | | (M58) - Seatbelt policy | |  | | (C58) - bind mount args     | |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  | | macOSSandboxWrapper     | |  | | linuxSandboxWrapper         | |  |   |
|  |  | | (HHB) - sandbox-exec    | |  | | (IHB) - bwrap command       | |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  | | startViolationMonitor   | |  | | Seccomp BPF Filter          | |  |   |
|  |  | | (EHB) - log stream      | |  | | (Unix socket blocking)      | |  |   |
|  |  | +-------------------------+ |  | +-----------------------------+ |  |   |
|  |  |                             |  | +-----------------------------+ |  |   |
|  |  |                             |  | | initializeLinuxBridges      | |  |   |
|  |  |                             |  | | (XHB) - socat proxies       | |  |   |
|  |  |                             |  | +-----------------------------+ |  |   |
|  |  +-----------------------------+  +---------------------------------+  |   |
|  +-----------------------------------------------------------------------+   |
|                              |                                               |
|                              v                                               |
|  +-----------------------------------------------------------------------+   |
|  |                    Layer 4: Bash Tool Integration                      |   |
|  |                                                                        |   |
|  |  +------------------------------------------------------------------+  |   |
|  |  |                    isBashSandboxed (KEA)                          |  |   |
|  |  |                    chunks.124.mjs:1217-1223                       |  |   |
|  |  |                                                                   |  |   |
|  |  |  Decision Flow:                                                   |  |   |
|  |  |  1. Is sandbox enabled? (isSandboxingEnabled)                     |  |   |
|  |  |  2. Is dangerouslyDisableSandbox=true AND allowed by policy?      |  |   |
|  |  |  3. Is command in excludedCommands list?                          |  |   |
|  |  |  4. If all checks pass -> Run in sandbox                          |  |   |
|  |  +------------------------------------------------------------------+  |   |
|  +-----------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------+
```

### Why This Architecture

**Design rationale:**
1. **Separation of concerns** - Each layer handles a specific responsibility
2. **Platform abstraction** - Core engine is platform-agnostic; platform wrappers handle OS-specific details
3. **Policy enforcement** - Settings hierarchy ensures enterprise policies can override user preferences
4. **Defense in depth** - Multiple restriction layers (filesystem, network, syscalls) provide comprehensive protection

---

## 2. Platform Support Matrix

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| **Sandbox Support** | Yes | Yes | No |
| **Sandbox Technology** | Apple Seatbelt | bubblewrap (bwrap) | N/A |
| **File Restriction Method** | Sandbox profile rules | Bind mounts + tmpfs | N/A |
| **Network Restriction** | HTTP/SOCKS proxy filtering | `--unshare-net` + socat bridges | N/A |
| **Unix Socket Blocking** | Via sandbox profile | Seccomp BPF filter | N/A |
| **Violation Detection** | Real-time log stream | N/A (best-effort) | N/A |
| **Glob Pattern Support** | Yes (regex conversion) | No (logged as skipped) | N/A |
| **Docker/Nested Sandbox** | N/A | `enableWeakerNestedSandbox` | N/A |
| **Required Dependencies** | ripgrep (rg) | ripgrep, bwrap, socat | N/A |

---

## 3. Sandbox Initialization Flow

### Core Initialization Function

```javascript
// ============================================
// initializeSandbox - Main sandbox initialization
// Location: chunks.53.mjs:2785-2823
// ============================================

// ORIGINAL (for source lookup):
async function P58(A, Q, B = !1) {
  if (Va) { await Va; return }
  if (k3 = A, !LHB()) {
    let G = dR(), Z = "Sandbox dependencies are not available on this system.";
    if (G === "linux") Z += " Required: ripgrep (rg), bubblewrap (bwrap), and socat.";
    else if (G === "macos") Z += " Required: ripgrep (rg).";
    else Z += ` Platform '${G}' is not supported.`;
    throw Error(Z)
  }
  if (B && dR() === "macos") T01 = EHB(P01.addViolation.bind(P01), k3.ignoreViolations);
  _58();
  Va = (async () => {
    try {
      let G; if (k3.network.httpProxyPort !== void 0) G = k3.network.httpProxyPort;
      else G = await j58(Q);
      let Z; if (k3.network.socksProxyPort !== void 0) Z = k3.network.socksProxyPort;
      else Z = await T58(Q);
      let Y; if (dR() === "linux") Y = await XHB(G, Z);
      let J = { httpProxyPort: G, socksProxyPort: Z, linuxBridge: Y };
      return cR = J, J
    } catch (G) {
      throw Va = void 0, cR = void 0, qr1().catch(() => {}), G
    }
  })();
  await Va
}

// READABLE (for understanding):
async function initializeSandbox(config, permissionCallback, enableMonitoring = false) {
  // Prevent double initialization
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  // Store configuration globally
  globalConfig = config;

  // Validate dependencies
  if (!checkDependencies()) {
    let platform = getPlatform();
    let errorMsg = "Sandbox dependencies are not available on this system.";
    if (platform === "linux") {
      errorMsg += " Required: ripgrep (rg), bubblewrap (bwrap), and socat.";
    } else if (platform === "macos") {
      errorMsg += " Required: ripgrep (rg).";
    } else {
      errorMsg += ` Platform '${platform}' is not supported.`;
    }
    throw Error(errorMsg);
  }

  // Start violation monitor on macOS
  if (enableMonitoring && getPlatform() === "macos") {
    violationMonitorCleanup = startMacOSViolationMonitor(
      violationStore.addViolation.bind(violationStore),
      globalConfig.ignoreViolations
    );
  }

  // Register cleanup handlers
  registerCleanupOnExit();

  // Initialize network infrastructure
  initializationPromise = (async () => {
    try {
      // HTTP Proxy
      let httpPort;
      if (globalConfig.network.httpProxyPort !== undefined) {
        httpPort = globalConfig.network.httpProxyPort;
      } else {
        httpPort = await initializeHTTPProxy(permissionCallback);
      }

      // SOCKS Proxy
      let socksPort;
      if (globalConfig.network.socksProxyPort !== undefined) {
        socksPort = globalConfig.network.socksProxyPort;
      } else {
        socksPort = await initializeSOCKSProxy(permissionCallback);
      }

      // Linux-specific: Create socat bridges
      let linuxBridge;
      if (getPlatform() === "linux") {
        linuxBridge = await initializeLinuxBridges(httpPort, socksPort);
      }

      // Store network config
      let networkConfig = {
        httpProxyPort: httpPort,
        socksProxyPort: socksPort,
        linuxBridge: linuxBridge
      };
      networkInfrastructure = networkConfig;
      return networkConfig;
    } catch (error) {
      // Cleanup on failure
      initializationPromise = undefined;
      networkInfrastructure = undefined;
      await shutdownSandbox().catch(() => {});
      throw error;
    }
  })();

  await initializationPromise;
}

// Mapping: P58->initializeSandbox, A->config, Q->permissionCallback, B->enableMonitoring
// Va->initializationPromise, k3->globalConfig, LHB->checkDependencies, dR->getPlatform
// EHB->startMacOSViolationMonitor, P01->violationStore, _58->registerCleanupOnExit
// j58->initializeHTTPProxy, T58->initializeSOCKSProxy, XHB->initializeLinuxBridges
```

### Initialization Algorithm Deep-dive

**Step-by-step explanation:**

1. **Prevent double initialization** - Uses promise as lock to prevent concurrent init
2. **Validate dependencies** - Platform-specific checks (bwrap/socat on Linux, rg on all)
3. **Start violation monitor** - macOS only, uses log stream to detect sandbox denials
4. **Register cleanup handlers** - Ensures proxies and bridges are torn down on exit
5. **Initialize network proxies** - HTTP and SOCKS proxies for network filtering
6. **Create platform-specific bridges** - Linux requires socat Unix-to-TCP bridges

**Why lazy initialization:**
- Not all sessions use sandbox (e.g., when disabled in settings)
- Proxy startup has overhead (~100ms)
- Failure handling is simpler at first use

---

## 4. Key Concepts

### 4.1 Sandbox Manager Object (XB)

The sandbox uses a central management object exposed as `XB`:

```javascript
// ============================================
// sandboxManager - Central sandbox management object
// Location: chunks.55.mjs:1518-1546
// ============================================

// ORIGINAL (for source lookup):
XB = {
  initialize: KZ8,
  isSandboxingEnabled: o01,
  isAutoAllowBashIfSandboxedEnabled: ZZ8,
  areUnsandboxedCommandsAllowed: YZ8,
  areSandboxSettingsLockedByPolicy: XZ8,
  setSandboxSettings: IZ8,
  getExcludedCommands: DZ8,
  wrapWithSandbox: WZ8,
  refreshConfig: VZ8,
  reset: FZ8,
  checkDependencies: nr1,
  getFsReadConfig: $X.getFsReadConfig,
  getFsWriteConfig: $X.getFsWriteConfig,
  getNetworkRestrictionConfig: $X.getNetworkRestrictionConfig,
  getIgnoreViolations: $X.getIgnoreViolations,
  getLinuxGlobPatternWarnings: JZ8,
  isSupportedPlatform: $X.isSupportedPlatform,
  getAllowUnixSockets: $X.getAllowUnixSockets,
  getAllowLocalBinding: $X.getAllowLocalBinding,
  getEnableWeakerNestedSandbox: $X.getEnableWeakerNestedSandbox,
  getProxyPort: $X.getProxyPort,
  getSocksProxyPort: $X.getSocksProxyPort,
  getLinuxHttpSocketPath: $X.getLinuxHttpSocketPath,
  getLinuxSocksSocketPath: $X.getLinuxSocksSocketPath,
  waitForNetworkInitialization: $X.waitForNetworkInitialization,
  getSandboxViolationStore: $X.getSandboxViolationStore,
  annotateStderrWithSandboxFailures: $X.annotateStderrWithSandboxFailures
}

// READABLE (for understanding):
sandboxManager = {
  // Lifecycle
  initialize: initializeSandbox,
  reset: resetSandbox,
  refreshConfig: refreshSandboxConfig,

  // Status checks
  isSandboxingEnabled: isSandboxingEnabled,
  isAutoAllowBashIfSandboxedEnabled: isAutoAllowBashEnabled,
  areUnsandboxedCommandsAllowed: areUnsandboxedCommandsAllowed,
  areSandboxSettingsLockedByPolicy: areSandboxSettingsLocked,
  isSupportedPlatform: isSupportedPlatform,
  checkDependencies: checkDependencies,

  // Settings
  setSandboxSettings: setSandboxSettings,
  getExcludedCommands: getExcludedCommands,

  // Config getters
  getFsReadConfig: getFsReadConfig,
  getFsWriteConfig: getFsWriteConfig,
  getNetworkRestrictionConfig: getNetworkRestrictionConfig,
  getIgnoreViolations: getIgnoreViolations,
  getAllowUnixSockets: getAllowUnixSockets,
  getAllowLocalBinding: getAllowLocalBinding,
  getEnableWeakerNestedSandbox: getEnableWeakerNestedSandbox,

  // Network infrastructure
  getProxyPort: getHttpProxyPort,
  getSocksProxyPort: getSocksProxyPort,
  getLinuxHttpSocketPath: getLinuxHttpSocketPath,
  getLinuxSocksSocketPath: getLinuxSocksSocketPath,
  waitForNetworkInitialization: waitForNetworkInitialization,

  // Command wrapping
  wrapWithSandbox: wrapCommandWithSandbox,

  // Violation tracking
  getSandboxViolationStore: getSandboxViolationStore,
  annotateStderrWithSandboxFailures: annotateStderrWithSandboxFailures,

  // Linux-specific
  getLinuxGlobPatternWarnings: getLinuxGlobPatternWarnings
}
```

### 4.2 Sandbox Modes

| Mode | `sandbox.enabled` | `autoAllowBashIfSandboxed` | Behavior |
|------|-------------------|---------------------------|----------|
| **Disabled** | false | N/A | No sandbox, normal permission prompts |
| **Auto-Allow** | true | true | Sandbox + auto-approve bash in accept-edits mode |
| **Strict** | true | false | Sandbox + prompt for each command |

### 4.3 Permission Decision Chain

```
+---------------------------------------------------------------+
|                    isBashSandboxed(toolInput)                   |
+---------------------------------------------------------------+
|                                                                 |
|  1. isSandboxingEnabled() == false?                            |
|     +---> RETURN false (no sandbox)                            |
|                                                                 |
|  2. toolInput.dangerouslyDisableSandbox == true                |
|     AND areUnsandboxedCommandsAllowed() == true?               |
|     +---> RETURN false (bypass allowed by policy)              |
|                                                                 |
|  3. toolInput.command is empty?                                |
|     +---> RETURN false                                         |
|                                                                 |
|  4. isExcludedCommand(toolInput.command) == true?              |
|     +---> RETURN false (command explicitly excluded)           |
|                                                                 |
|  5. DEFAULT:                                                   |
|     +---> RETURN true (run in sandbox)                         |
|                                                                 |
+---------------------------------------------------------------+
```

### 4.4 Network Access Control

The sandbox uses HTTP and SOCKS proxy servers to filter network requests:

```
+------------------+     +-------------------+     +-----------------+
|  Sandboxed App   |---->|  HTTP/SOCKS       |---->|  Target Server  |
|                  |     |  Proxy Server     |     |                 |
+------------------+     |                   |     +-----------------+
                         |  Filter Logic:    |
                         |  1. Deny list     |
                         |  2. Allow list    |
                         |  3. User prompt   |
                         +-------------------+
```

**Network access algorithm:**
1. **Check denied domains** - if match, deny immediately
2. **Check allowed domains** - if match, allow immediately
3. **No rule match** - invoke user permission callback or deny

### 4.5 Violation Monitoring (macOS)

On macOS, sandbox violations are detected via system logs:

```
+---------------------------------------------------------------+
|                   macOS Sandbox Violation Monitor              |
+---------------------------------------------------------------+
|                                                                 |
|  1. Start: log stream --predicate "(eventMessage ENDSWITH tag)"|
|                                                                 |
|  2. Parse each log line for "Sandbox:" and "deny"              |
|                                                                 |
|  3. Extract command tag (CMD64_<base64>_END_<unique>)          |
|                                                                 |
|  4. Decode base64 to get original command                      |
|                                                                 |
|  5. Check ignore patterns:                                     |
|     - Global patterns in ignoreViolations["*"]                 |
|     - Command-specific patterns in ignoreViolations[cmd]       |
|                                                                 |
|  6. Add to SandboxViolationStore if not ignored                |
|                                                                 |
+---------------------------------------------------------------+
```

---

## 5. Sandbox Configuration Schema

```typescript
interface SandboxConfig {
  network: {
    allowedDomains: string[];      // Whitelist of allowed domains
    deniedDomains: string[];       // Blacklist of denied domains
    allowUnixSockets?: string[];   // Specific Unix socket paths to allow
    allowAllUnixSockets?: boolean; // Allow all Unix sockets (disables seccomp)
    allowLocalBinding?: boolean;   // Allow localhost connections
    httpProxyPort?: number;        // External HTTP proxy port
    socksProxyPort?: number;       // External SOCKS proxy port
  };
  filesystem: {
    denyRead: string[];            // Paths to deny reading
    allowWrite: string[];          // Paths to allow writing
    denyWrite: string[];           // Paths to deny within allowed areas
  };
  ignoreViolations?: {
    "*"?: string[];                // Global ignore patterns
    [command: string]: string[];   // Per-command ignore patterns
  };
  enableWeakerNestedSandbox?: boolean; // For Docker environments
  ripgrep?: { command: string; args?: string[] };
  mandatoryDenySearchDepth?: number;   // Default: 3
}
```

---

## 6. Dependencies

### macOS
- **ripgrep (rg)** - Fast file scanning for dangerous file detection

### Linux
- **ripgrep (rg)** - Fast file scanning for dangerous file detection
- **bubblewrap (bwrap)** - Lightweight sandboxing tool for container-like isolation
- **socat** - Network bridge for proxy connections inside container
- **Seccomp BPF filter** - Pre-compiled binary for Unix socket blocking (`vendor/seccomp/`)
- **apply-seccomp** - Binary to apply seccomp filter (`vendor/seccomp/`)

### Dependency Check

```javascript
// ============================================
// checkLinuxSandboxDependencies - Verify bwrap and socat installed
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
      if (!Z || !Y) DB("[Sandbox Linux] Seccomp filtering not available...", { level: "warn" })
    }
    return G
  } catch { return !1 }
}

// READABLE (for understanding):
function checkLinuxSandboxDependencies(skipSeccompCheck = false) {
  try {
    let bwrapCheck = execSync("which", ["bwrap"], { stdio: "ignore", timeout: 1000 });
    let socatCheck = execSync("which", ["socat"], { stdio: "ignore", timeout: 1000 });
    let hasAllDeps = bwrapCheck.status === 0 && socatCheck.status === 0;

    if (!skipSeccompCheck) {
      let hasBpfFilter = findSeccompBpfFilter() !== null;
      let hasApplySeccomp = findApplySeccompBinary() !== null;
      if (!hasBpfFilter || !hasApplySeccomp) {
        log("[Sandbox Linux] Seccomp filtering not available (missing binaries)...", { level: "warn" });
      }
    }
    return hasAllDeps;
  } catch {
    return false;
  }
}

// Mapping: JHB->checkLinuxSandboxDependencies, A->skipSeccompCheck
```

---

## 7. Environment Variables

| Variable | Purpose | When Set |
|----------|---------|----------|
| `TMPDIR` | Temporary directory | Set to `/tmp/claude` in sandbox |
| `SANDBOX_RUNTIME` | Marker for sandbox mode | Always `1` when sandboxed |
| `HTTP_PROXY` / `HTTPS_PROXY` | HTTP proxy address | When network restricted |
| `ALL_PROXY` | SOCKS proxy address | When network restricted |
| `NO_PROXY` | Bypass list | localhost, 127.0.0.1, ::1, *.local |
| `GIT_SSH_COMMAND` | Custom SSH for git | With ProxyCommand for SOCKS |
| `CLOUDSDK_CORE_PROXY_*` | GCP SDK proxy | When network restricted |
| `CLAUDE_CODE_HOST_HTTP_PROXY_PORT` | Host HTTP port | Linux only |
| `CLAUDE_CODE_HOST_SOCKS_PROXY_PORT` | Host SOCKS port | Linux only |

---

## 8. Protected Files

The sandbox protects sensitive configuration files from modification:

```javascript
// Files protected by default:
protectedFiles = [
  ".gitconfig", ".gitmodules",
  ".bashrc", ".bash_profile",
  ".zshrc", ".zprofile", ".profile",
  ".ripgreprc", ".mcp.json"
]

// Directories protected:
protectedDirs = [".git", ".vscode", ".idea"]

// Always protected:
".git/hooks"  // Prevent hook injection attacks
".git/config" // Unless allowGitConfig is true
```

---

## 9. Integration Entry Points

### 9.1 Application Startup

```
+---------------------------------------------------------------+
|                    Sandbox Initialization Chain                 |
+---------------------------------------------------------------+
|                                                                 |
|  CLI Entry (chunks.155.mjs)                                     |
|       |                                                         |
|       v                                                         |
|  XB.isSandboxingEnabled() ─────> false ───> Skip sandbox        |
|       |                                                         |
|      true                                                       |
|       |                                                         |
|       v                                                         |
|  XB.initialize()                                                |
|       |                                                         |
|       +──> checkDependencies()                                  |
|       |         |                                               |
|       |         +──> Linux: bwrap, socat, rg                    |
|       |         +──> macOS: rg                                  |
|       |                                                         |
|       +──> initializeProxies() (HTTP + SOCKS)                   |
|       |                                                         |
|       +──> Linux: initializeLinuxBridges()                      |
|       |                                                         |
|       +──> macOS: startViolationMonitor()                       |
|       |                                                         |
|       v                                                         |
|  Settings subscription (reactive updates)                       |
|                                                                 |
+---------------------------------------------------------------+
```

### 9.2 Per-Turn Execution

| Stage | Function | Purpose |
|-------|----------|---------|
| Tool call | `bashToolHandler` (ka5) | Entry point for Bash tool |
| Decision | `isBashSandboxed` (KEA) | Determine if sandbox applies |
| Wrapping | `wrapWithSandbox` (WZ8) | Apply platform-specific wrapper |
| Execution | `executeShellCommand` (e51) | Run wrapped command |
| Output | `annotateStderrWithSandboxFailures` | Add violation info |
| Display | `cleanSandboxViolations` (Vb5) | Strip tags for user |

### 9.3 Subagent Inheritance

When Task tool spawns subagents:
- **Inherited**: `toolPermissionContext` (sandbox mode, policies)
- **NOT Inherited**: `dangerouslyDisableSandbox` (must be set per command)

### 9.4 Session Restore

When resuming a session:
- **Restored**: Messages, file history, todo state
- **NOT Restored**: Sandbox violations (fresh store created)

---

## See Also

- [configuration.md](./configuration.md) - Configuration structure and parsing
- [linux_implementation.md](./linux_implementation.md) - Linux bwrap details
- [macos_implementation.md](./macos_implementation.md) - macOS Seatbelt details
- [tool_integration.md](./tool_integration.md) - Bash tool, system reminder, subagent, and main loop integration
- [wildcard_permissions.md](./wildcard_permissions.md) - Permission pattern matching
