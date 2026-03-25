# Sandbox Initialization Flow (Claude Code 2.1.76)

## Overview

The sandbox initialization is a multi-phase bootstrap process that validates dependencies, sets up network infrastructure (proxy servers and Unix socket bridges), and prepares the sandbox for command execution. This document details the complete initialization sequence from settings load to ready state.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key functions in this document:
- `Px3` - sandboxInitialize (main entry point)
- `pb3` - initializeLowLevel (low-level bootstrap)
- `h21` - isSandboxingEnabled (enabled check with all gates)
- `rZ7` - isSupportedPlatform (platform capability check)
- `oZ7` - checkDependencies (dependency validation)
- `zG7` - waitForNetworkInitialization (network ready check)
- `xw8` - reset (cleanup and teardown)
- `Wx3` - refreshSandboxConfig (dynamic config reload)

---

## Initialization Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sandbox Initialization Flow                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Settings Load                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PA() → getSettings()                                                 │   │
│  │   • sandbox.enabled: boolean                                         │   │
│  │   • sandbox.autoAllowBashIfSandboxed: boolean                        │   │
│  │   • sandbox.allowUnsandboxedCommands: boolean                        │   │
│  │   • sandbox.enabledPlatforms: string[]                               │   │
│  │   • sandbox.excludedCommands: string[]                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  2. Platform Check                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ isSupportedPlatform() (rZ7)                                          │   │
│  │   • macOS: return true                                               │   │
│  │   • Linux: return process.env.WSL_DISTRO_NAME !== "1"               │   │
│  │   • Other: return false                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  3. Dependency Validation                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ checkDependencies() (oZ7)                                            │   │
│  │   • ripgrep (rg) must be installed                                   │   │
│  │   • Linux: bwrap, socat, seccomp binaries                            │   │
│  │   • macOS: sandbox-exec (built-in)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  4. Network Infrastructure                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ initializeLowLevel() (pb3)                                           │   │
│  │   • Start HTTP proxy (or use external port)                          │   │
│  │   • Start SOCKS proxy (or use external port)                         │   │
│  │   • Linux: Create Unix socket bridges via socat                      │   │
│  │   • macOS: Start log stream monitor for violations                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  5. Ready State                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ wrapWithSandbox() can now wrap commands                              │   │
│  │   • Network namespace ready                                          │   │
│  │   • Proxy servers listening                                          │   │
│  │   • Violation monitoring active (macOS)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Main Entry Point: `sandboxInitialize` (Px3)

**Location:** `chunks.56.mjs:424-444`

```javascript
// ============================================
// sandboxInitialize - Main entry point for sandbox bootstrap
// Location: chunks.56.mjs:424-444
// ============================================

// ORIGINAL (for source lookup):
async function Px3(A) {
    if (da) return da;
    if (!h21()) return;
    let q = A ? async (K) => {
        if (Uq6()) return k(`[sandbox] Blocked network request to ${K.host} (allowManagedDomainsOnly)`), !1;
        return A(K)
    }: void 0;
    return da = (async () => {
        try {
            if (DD6 === void 0) DD6 = await Ox3(OS());
            let K = PA(),
                Y = R21(K);
            await aO.initialize(Y, q), Fw8 = tO.subscribe(() => {
                let z = PA(),
                    _ = R21(z);
                aO.updateConfig(_), k("Sandbox configuration updated from settings change")
            })
        } catch (K) {
            da = void 0, k(`Failed to initialize sandbox: ${_1(K)}`)
        }
    })(), da
}

// READABLE (for understanding):
async function sandboxInitialize(onNetworkRequest) {
    // Already initializing? Return existing promise
    if (initializationPromise) {
        return initializationPromise;
    }

    // Not enabled? Skip
    if (!isSandboxingEnabled()) {
        return;
    }

    // Wrap callback with managed domain check
    let wrappedCallback = onNetworkRequest
        ? async (request) => {
            if (isAllowManagedDomainsOnly()) {
                log(`[sandbox] Blocked network request to ${request.host} (allowManagedDomainsOnly)`);
                return false;
            }
            return onNetworkRequest(request);
        }
        : undefined;

    // Store promise for subsequent calls
    initializationPromise = (async () => {
        try {
            // Initialize OS info if needed
            if (osInfo === undefined) {
                osInfo = await detectOS();
            }

            // Get current settings
            let settings = getSettings();
            let sandboxConfig = buildSandboxConfig(settings);

            // Initialize low-level sandbox
            await sandboxLowLevel.initialize(sandboxConfig, wrappedCallback);

            // Subscribe to settings changes
            settingsSubscription = settingsStore.subscribe(() => {
                let newSettings = getSettings();
                let newConfig = buildSandboxConfig(newSettings);
                sandboxLowLevel.updateConfig(newConfig);
                log("Sandbox configuration updated from settings change");
            });
        } catch (error) {
            initializationPromise = undefined;
            log(`Failed to initialize sandbox: ${formatError(error)}`);
        }
    })();

    return initializationPromise;
}

// Mapping: Px3→sandboxInitialize, da→initializationPromise, h21→isSandboxingEnabled,
//          A→onNetworkRequest, Uq6→isAllowManagedDomainsOnly, k→log, PA→getSettings,
//          R21→buildSandboxConfig, aO→sandboxLowLevel, Fw8→settingsSubscription,
//          tO→settingsStore, DD6→osInfo, Ox3→detectOS, OS→getOS
```

### Key Design Decisions

**Why promise caching (`da`):**
- Prevents double initialization if called multiple times
- Allows awaiting the same initialization from multiple callers
- Returns immediately if already initialized

**Why settings subscription:**
- Sandbox config must stay in sync with user settings
- User may change settings during session (e.g., via `/sandbox` command)
- Updates proxy domain allowlists without restart

**Why wrapped callback:**
- Adds `allowManagedDomainsOnly` check before calling user callback
- Provides consistent interface for network permission requests

---

## Low-Level Initialization: `initializeLowLevel` (pb3)

**Location:** `chunks.55.mjs:3024-3057`

```javascript
// ============================================
// initializeLowLevel - Bootstrap network infrastructure
// Location: chunks.55.mjs:3024-3057
// ============================================

// ORIGINAL (for source lookup):
async function pb3(A, q, K = !1) {
    if (Ua) {
        await Ua;
        return
    }
    R5 = A;
    let Y = oZ7();
    if (Y.errors.length > 0) throw Error(`Sandbox dependencies not available: ${Y.errors.join(", ")}`);
    if (K && $v() === "macos") N21 = UZ7(V21.addViolation.bind(V21), R5.ignoreViolations), wA("Started macOS sandbox log monitor");
    mb3(), Ua = (async () => {
        try {
            let z;
            if (R5.network.httpProxyPort !== void 0) z = R5.network.httpProxyPort, wA(`Using external HTTP proxy on port ${z}`);
            else z = await gb3(q);
            let _;
            if (R5.network.socksProxyPort !== void 0) _ = R5.network.socksProxyPort, wA(`Using external SOCKS proxy on port ${_}`);
            else _ = await Fb3(q);
            let w;
            if ($v() === "linux") w = await xZ7(z, _);
            let O = {
                httpProxyPort: z,
                socksProxyPort: _,
                linuxBridge: w
            };
            return LL = O, wA("Network infrastructure initialized"), O
        } catch (z) {
            throw Ua = void 0, LL = void 0, xw8().catch((_) => {
                wA(`Cleanup failed in initializationPromise ${_}`, {
                    level: "error"
                })
            }), z
        }
    })(), await Ua
}

// READABLE (for understanding):
async function initializeLowLevel(config, onNetworkRequest, enableViolationMonitor = false) {
    // Already initialized? Wait for existing init
    if (networkInitPromise) {
        await networkInitPromise;
        return;
    }

    // Store config globally
    currentConfig = config;

    // Check dependencies first
    let depCheck = checkDependencies();
    if (depCheck.errors.length > 0) {
        throw new Error(`Sandbox dependencies not available: ${depCheck.errors.join(", ")}`);
    }

    // Start violation monitor (macOS only)
    if (enableViolationMonitor && getPlatform() === "macos") {
        logMonitorCleanup = startLogMonitor(
            violationStore.addViolation.bind(violationStore),
            config.ignoreViolations
        );
        log("Started macOS sandbox log monitor");
    }

    // Setup process cleanup handler
    setupProcessExitHandler();

    // Initialize network infrastructure
    networkInitPromise = (async () => {
        try {
            // HTTP Proxy
            let httpPort;
            if (config.network.httpProxyPort !== undefined) {
                httpPort = config.network.httpProxyPort;
                log(`Using external HTTP proxy on port ${httpPort}`);
            } else {
                httpPort = await startHttpProxy(onNetworkRequest);
            }

            // SOCKS Proxy
            let socksPort;
            if (config.network.socksProxyPort !== undefined) {
                socksPort = config.network.socksProxyPort;
                log(`Using external SOCKS proxy on port ${socksPort}`);
            } else {
                socksPort = await startSocksProxy(onNetworkRequest);
            }

            // Linux: Create Unix socket bridges
            let linuxBridge;
            if (getPlatform() === "linux") {
                linuxBridge = await createBridgeSockets(httpPort, socksPort);
            }

            // Store network state
            let networkState = {
                httpProxyPort: httpPort,
                socksProxyPort: socksPort,
                linuxBridge: linuxBridge
            };

            networkInfo = networkState;
            log("Network infrastructure initialized");
            return networkState;

        } catch (error) {
            // Cleanup on failure
            networkInitPromise = undefined;
            networkInfo = undefined;

            // Attempt cleanup
            await reset().catch((cleanupError) => {
                log(`Cleanup failed in initializationPromise ${cleanupError}`, { level: "error" });
            });

            throw error;
        }
    })();

    await networkInitPromise;
}

// Mapping: pb3→initializeLowLevel, A→config, q→onNetworkRequest, K→enableViolationMonitor,
//          Ua→networkInitPromise, R5→currentConfig, oZ7→checkDependencies, $v→getPlatform,
//          N21→logMonitorCleanup, UZ7→startLogMonitor, V21→violationStore, mb3→setupProcessExitHandler,
//          gb3→startHttpProxy, Fb3→startSocksProxy, xZ7→createBridgeSockets, LL→networkInfo,
//          xw8→reset, wA→log
```

### Initialization Steps

1. **Dependency Check:** Validates all required binaries are available
2. **Violation Monitor:** Starts `log stream` on macOS for sandbox denial messages
3. **HTTP Proxy:** Starts HTTP proxy server or uses external port
4. **SOCKS Proxy:** Starts SOCKS proxy server or uses external port
5. **Linux Bridges:** Creates Unix socket bridges for network namespace

---

## Enabled Check: `isSandboxingEnabled` (h21)

**Location:** `chunks.56.mjs:357-362`

```javascript
// ============================================
// isSandboxingEnabled - Check if sandbox is fully operational
// Location: chunks.56.mjs:357-362
// ============================================

// ORIGINAL (for source lookup):
function h21() {
    if (!Qw8()) return !1;
    if (pw8().errors.length > 0) return !1;
    if (!vG7()) return !1;
    return TG7()
}

// READABLE (for understanding):
function isSandboxingEnabled() {
    // Gate 1: Platform support
    if (!isSupportedPlatform()) {
        return false;
    }

    // Gate 2: Dependencies available
    if (checkDependencies().errors.length > 0) {
        return false;
    }

    // Gate 3: Platform in enabled list
    if (!isPlatformInEnabledList()) {
        return false;
    }

    // Gate 4: Enabled in settings
    return isSandboxEnabledInSettings();
}

// Mapping: h21→isSandboxingEnabled, Qw8→isSupportedPlatform, pw8→checkDependencies,
//          vG7→isPlatformInEnabledList, TG7→isSandboxEnabledInSettings
```

### The 4 Gates

| Gate | Function | Condition | Fail Reason |
|------|----------|-----------|-------------|
| 1 | `isSupportedPlatform()` | macOS or Linux (not WSL1) | Unsupported OS |
| 2 | `checkDependencies().errors` | Empty array | Missing binaries |
| 3 | `isPlatformInEnabledList()` | Current platform in allowlist | Disabled for platform |
| 4 | `isSandboxEnabledInSettings()` | `settings.sandbox.enabled === true` | User disabled |

---

## Platform Support: `isSupportedPlatform` (rZ7)

**Location:** `chunks.55.mjs:3059-3063`

```javascript
// ============================================
// isSupportedPlatform - Check if OS supports sandboxing
// Location: chunks.55.mjs:3059-3063
// ============================================

// ORIGINAL (for source lookup):
function rZ7() {
    let A = $v();
    if (A === "linux") return Pw8() !== "1";
    return A === "macos"
}

// READABLE (for understanding):
function isSupportedPlatform() {
    let platform = getPlatform();

    if (platform === "linux") {
        // WSL1 has issues with bwrap - check WSL_DISTRO_NAME
        return process.env.WSL_DISTRO_NAME !== "1";
    }

    return platform === "macos";
}

// Mapping: rZ7→isSupportedPlatform, $v→getPlatform, Pw8→process.env.WSL_DISTRO_NAME
```

### Why WSL1 is Not Supported

WSL1 uses a translation layer that doesn't support all Linux syscalls:
- `bwrap` requires `clone()`, `unshare()`, `pivot_root()` syscalls
- WSL1's syscall translation is incomplete
- WSL2 uses a real Linux kernel and is fully supported

---

## Dependency Validation: `checkDependencies` (oZ7)

**Location:** `chunks.55.mjs:3069-3088`

```javascript
// ============================================
// checkDependencies - Validate all required binaries
// Location: chunks.55.mjs:3069-3088
// ============================================

// ORIGINAL (for source lookup):
function oZ7(A) {
    if (!rZ7()) return {
        errors: ["Unsupported platform"],
        warnings: []
    };
    let q = [],
        K = [],
        Y = A ?? R5?.ripgrep ?? {
            command: "rg"
        };
    if (JU(Y.command) === null) q.push(`ripgrep (${Y.command}) not found`);
    if ($v() === "linux") {
        let _ = bZ7(R5?.seccomp);
        q.push(..._.errors), K.push(..._.warnings)
    }
    return {
        errors: q,
        warnings: K
    }
}

// READABLE (for understanding):
function checkDependencies(ripgrepConfig) {
    // Not a supported platform
    if (!isSupportedPlatform()) {
        return {
            errors: ["Unsupported platform"],
            warnings: []
        };
    }

    let errors = [];
    let warnings = [];

    // Ripgrep is always required
    let rgConfig = ripgrepConfig ?? currentConfig?.ripgrep ?? { command: "rg" };
    if (which(rgConfig.command) === null) {
        errors.push(`ripgrep (${rgConfig.command}) not found`);
    }

    // Linux-specific checks
    if (getPlatform() === "linux") {
        let linuxCheck = checkLinuxDependencies(currentConfig?.seccomp);
        errors.push(...linuxCheck.errors);
        warnings.push(...linuxCheck.warnings);
    }

    return { errors, warnings };
}

// Mapping: oZ7→checkDependencies, rZ7→isSupportedPlatform, $v→getPlatform,
//          JU→which, bZ7→checkLinuxDependencies, R5→currentConfig
```

### Linux Dependency Check: `checkLinuxDependencies` (bZ7)

**Location:** `chunks.55.mjs:2387-2399`

```javascript
// ORIGINAL (for source lookup):
function bZ7(A) {
    let q = [],
        K = [];
    if (JU("bwrap") === null) q.push("bubblewrap (bwrap) not installed");
    if (JU("socat") === null) q.push("socat not installed");
    let Y = Vw8(A?.bpfPath) !== null,
        z = Ex6(A?.applyPath) !== null;
    if (!Y || !z) K.push("seccomp not available - unix socket access not restricted");
    return {
        warnings: K,
        errors: q
    }
}

// READABLE (for understanding):
function checkLinuxDependencies(seccompConfig) {
    let errors = [];
    let warnings = [];

    // Required binaries
    if (which("bwrap") === null) {
        errors.push("bubblewrap (bwrap) not installed");
    }
    if (which("socat") === null) {
        errors.push("socat not installed");
    }

    // Optional seccomp
    let hasBpfFilter = getBpfFilterPath(seccompConfig?.bpfPath) !== null;
    let hasApplyBinary = getApplySeccompPath(seccompConfig?.applyPath) !== null;

    if (!hasBpfFilter || !hasApplyBinary) {
        warnings.push("seccomp not available - unix socket access not restricted");
    }

    return { warnings, errors };
}

// Mapping: bZ7→checkLinuxDependencies, JU→which, Vw8→getBpfFilterPath, Ex6→getApplySeccompPath
```

---

## Network Ready Check: `waitForNetworkInitialization` (zG7)

**Location:** `chunks.55.mjs:3198-3206`

```javascript
// ============================================
// waitForNetworkInitialization - Wait for network infrastructure
// Location: chunks.55.mjs:3198-3206
// ============================================

// ORIGINAL (for source lookup):
async function zG7() {
    if (Ua) try {
        return await Ua, !0
    } catch {
        return !1
    }
    return LL !== void 0
}

// READABLE (for understanding):
async function waitForNetworkInitialization() {
    // If initialization in progress, wait for it
    if (networkInitPromise) {
        try {
            await networkInitPromise;
            return true;
        } catch {
            return false;
        }
    }

    // Check if already initialized
    return networkInfo !== undefined;
}

// Mapping: zG7→waitForNetworkInitialization, Ua→networkInitPromise, LL→networkInfo
```

---

## Cleanup and Reset: `reset` (xw8)

**Location:** `chunks.55.mjs:3288-3380`

```javascript
// ============================================
// reset - Clean up all sandbox resources
// Location: chunks.55.mjs:3288-3380
// ============================================

// READABLE (for understanding):
async function reset() {
    // 1. Clean up mount points
    cleanupMountPoints();

    // 2. Stop log monitor (macOS)
    if (logMonitorCleanup) {
        logMonitorCleanup();
        logMonitorCleanup = undefined;
    }

    // 3. Stop Linux bridge processes
    if (networkInfo?.linuxBridge) {
        let { httpSocketPath, socksSocketPath, httpBridgeProcess, socksBridgeProcess } =
            networkInfo.linuxBridge;

        let cleanupPromises = [];

        // Kill HTTP bridge
        if (httpBridgeProcess.pid && !httpBridgeProcess.killed) {
            try {
                process.kill(httpBridgeProcess.pid, "SIGTERM");
                log("Sent SIGTERM to HTTP bridge process");

                cleanupPromises.push(new Promise((resolve) => {
                    httpBridgeProcess.once("exit", () => {
                        log("HTTP bridge process exited");
                        resolve();
                    });

                    // Force kill after 5 seconds
                    setTimeout(() => {
                        if (!httpBridgeProcess.killed) {
                            log("HTTP bridge did not exit, forcing SIGKILL", { level: "warn" });
                            try {
                                if (httpBridgeProcess.pid) {
                                    process.kill(httpBridgeProcess.pid, "SIGKILL");
                                }
                            } catch {}
                        }
                        resolve();
                    }, 5000);
                }));
            } catch (error) {
                if (error.code !== "ESRCH") {
                    log(`Error killing HTTP bridge: ${error}`, { level: "error" });
                }
            }
        }

        // Kill SOCKS bridge (similar pattern)
        // ...

        // Wait for processes to exit
        await Promise.all(cleanupPromises);

        // Remove socket files
        if (httpSocketPath) {
            try {
                fs.rmSync(httpSocketPath, { force: true });
                log("Cleaned up HTTP socket");
            } catch (error) {
                log(`HTTP socket cleanup error: ${error}`, { level: "error" });
            }
        }

        // Remove SOCKS socket
        // ...
    }

    // 4. Close proxy servers
    let proxyCleanupPromises = [];

    if (httpProxyServer) {
        let server = httpProxyServer;
        proxyCleanupPromises.push(new Promise((resolve) => {
            server.close((error) => {
                if (error && error.message !== "Server is not running.") {
                    log(`Error closing HTTP proxy server: ${error.message}`, { level: "error" });
                }
                resolve();
            });
        }));
    }

    if (socksProxyServer) {
        proxyCleanupPromises.push(
            socksProxyServer.close().catch((error) => {
                log(`Error closing SOCKS proxy server: ${error.message}`, { level: "error" });
            })
        );
    }

    await Promise.all(proxyCleanupPromises);

    // 5. Reset global state
    httpProxyServer = undefined;
    socksProxyServer = undefined;
    networkInfo = undefined;
    networkInitPromise = undefined;
}

// Mapping: xw8→reset, Ua→networkInitPromise, LL→networkInfo, N21→logMonitorCleanup,
//          jD6→httpProxyServer, Fq6→socksProxyServer
```

---

## Dynamic Config Reload: `refreshSandboxConfig` (Wx3)

**Location:** `chunks.56.mjs:447-451`

```javascript
// ============================================
// refreshSandboxConfig - Reload config from settings
// Location: chunks.56.mjs:447-451
// ============================================

// ORIGINAL (for source lookup):
function Wx3() {
    if (!h21()) return;
    let A = PA(),
        q = R21(A);
    aO.updateConfig(q)
}

// READABLE (for understanding):
function refreshSandboxConfig() {
    // Skip if not enabled
    if (!isSandboxingEnabled()) {
        return;
    }

    // Get fresh settings
    let settings = getSettings();
    let sandboxConfig = buildSandboxConfig(settings);

    // Update low-level module
    sandboxLowLevel.updateConfig(sandboxConfig);
}

// Mapping: Wx3→refreshSandboxConfig, h21→isSandboxingEnabled, PA→getSettings,
//          R21→buildSandboxConfig, aO→sandboxLowLevel
```

### When Config Refresh Happens

1. **Settings change:** User modifies settings via `/sandbox` command
2. **Settings file edit:** User edits `~/.claude/settings.json`
3. **Permission rule update:** Permission changes that affect sandbox paths

---

## Settings Change Subscription

The sandbox subscribes to settings changes during initialization:

```javascript
// In sandboxInitialize (Px3):
Fw8 = tO.subscribe(() => {
    let z = PA(),
        _ = R21(z);
    aO.updateConfig(_), k("Sandbox configuration updated from settings change")
})
```

This ensures:
- Domain allowlists update immediately
- Filesystem paths update without restart
- New exclusion patterns take effect

---

## Complete Initialization Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INITIALIZATION SEQUENCE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Claude Code starts                                                         │
│       │                                                                      │
│       ▼                                                                      │
│  Agent loop initialization                                                  │
│       │                                                                      │
│       ├──────────────────────────────────┐                                  │
│       │                                  │                                  │
│       ▼                                  ▼                                  │
│  isSandboxingEnabled()            sandboxInitialize()                        │
│       │                                  │                                  │
│       ├─ Check platform                  ├─ Get settings                     │
│       ├─ Check dependencies              ├─ Build config                     │
│       ├─ Check enabled platforms         ├─ Call pb3                         │
│       └─ Check enabled setting            │                                  │
│       │                                  ▼                                  │
│       │                          ┌──────────────────────┐                    │
│       │                          │ initializeLowLevel() │                    │
│       │                          └──────────────────────┘                    │
│       │                                  │                                  │
│       │                                  ├─ Validate dependencies            │
│       │                                  ├─ Start log monitor (macOS)        │
│       │                                  ├─ Start HTTP proxy                 │
│       │                                  ├─ Start SOCKS proxy                │
│       │                                  ├─ Create bridge sockets (Linux)    │
│       │                                  │                                  │
│       │                                  ▼                                  │
│       │                          Network infrastructure ready                │
│       │                                  │                                  │
│       ▼                                  ▼                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Sandbox ready for commands                                           │   │
│  │                                                                       │   │
│  │ When Bash tool called:                                               │   │
│  │   1. isCommandSandboxed() → true/false                               │   │
│  │   2. wrapWithSandbox() → wrapped command                             │   │
│  │   3. Execute in sandbox                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Network Proxy Server Startup

### HTTP Proxy Server (gb3)

**What it does:** Starts an HTTP proxy server on a random port, filtering requests through the domain allowlist/denylist.

```javascript
// ============================================
// startHttpProxy - Start HTTP proxy with domain filtering
// Location: chunks.55.mjs:2944-2980
// ============================================

// READABLE (for understanding):
async function startHttpProxy(onNetworkRequest) {
    // Create HTTP proxy server
    let server = http.createServer(async (req, res) => {
        try {
            // Parse target URL from request
            let targetUrl = new URL(req.url);

            // Build request context
            let requestContext = {
                host: targetUrl.hostname,
                port: targetUrl.port || 80,
                path: targetUrl.pathname + targetUrl.search,
                method: req.method,
                headers: req.headers
            };

            // Check with onNetworkRequest callback
            if (onNetworkRequest) {
                let allowed = await onNetworkRequest(requestContext);
                if (!allowed) {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Blocked by sandbox policy');
                    return;
                }
            }

            // Forward request to target
            let proxyReq = http.request({
                hostname: targetUrl.hostname,
                port: targetUrl.port || 80,
                path: targetUrl.pathname + targetUrl.search,
                method: req.method,
                headers: req.headers
            });

            proxyReq.on('response', (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (err) => {
                res.writeHead(502);
                res.end(`Proxy error: ${err.message}`);
            });

            req.pipe(proxyReq);
        } catch (err) {
            res.writeHead(500);
            res.end(`Proxy error: ${err.message}`);
        }
    });

    // Listen on random port
    await new Promise((resolve) => {
        server.listen(0, 'localhost', () => {
            resolve();
        });
    });

    let port = server.address().port;
    log(`[Sandbox] HTTP proxy started on port ${port}`);

    return port;
}

// Mapping: gb3→startHttpProxy, jD6→httpProxyServer
```

### SOCKS Proxy Server (Fb3)

**What it does:** Starts a SOCKS5 proxy server for TCP connections.

```javascript
// ============================================
// startSocksProxy - Start SOCKS5 proxy server
// Location: chunks.55.mjs:2982-3010
// ============================================

// READABLE (for understanding):
async function startSocksProxy(onNetworkRequest) {
    // Create SOCKS5 server
    let server = socks.createServer(async (info, accept, deny) => {
        // Build request context
        let requestContext = {
            host: info.dst.host,
            port: info.dst.port,
            socket: info.src
        };

        // Check with onNetworkRequest callback
        if (onNetworkRequest) {
            let allowed = await onNetworkRequest(requestContext);
            if (!allowed) {
                deny();
                return;
            }
        }

        // Accept connection
        accept();
    });

    // Listen on random port
    await new Promise((resolve) => {
        server.listen(0, 'localhost', () => {
            resolve();
        });
    });

    let port = server.address().port;
    log(`[Sandbox] SOCKS proxy started on port ${port}`);

    return port;
}

// Mapping: Fb3→startSocksProxy, Fq6→socksProxyServer
```

---

## Process Exit Handler Setup (mb3)

**What it does:** Ensures cleanup of sandbox resources when the Node.js process exits.

```javascript
// ============================================
// setupProcessExitHandler - Cleanup on process exit
// Location: chunks.55.mjs:2992-3018
// ============================================

// READABLE (for understanding):
function setupProcessExitHandler() {
    let cleanupCalled = false;

    async function cleanup() {
        if (cleanupCalled) return;
        cleanupCalled = true;

        log("[Sandbox] Process exit - cleaning up sandbox resources");

        // Kill proxy servers
        if (httpProxyServer) {
            httpProxyServer.close();
        }
        if (socksProxyServer) {
            socksProxyServer.close();
        }

        // Kill log monitor (macOS)
        if (logMonitorCleanup) {
            logMonitorCleanup();
        }

        // Kill bridge processes (Linux)
        if (networkInfo?.linuxBridge) {
            let { httpBridgeProcess, socksBridgeProcess } = networkInfo.linuxBridge;
            if (httpBridgeProcess?.pid) {
                process.kill(httpBridgeProcess.pid, "SIGTERM");
            }
            if (socksBridgeProcess?.pid) {
                process.kill(socksBridgeProcess.pid, "SIGTERM");
            }
        }

        // Cleanup seccomp filter files
        for (let filterPath of createdSeccompFilters) {
            try {
                fs.unlinkSync(filterPath);
            } catch {}
        }

        // Cleanup empty directories
        for (let dirPath of createdEmptyDirs) {
            try {
                fs.rmdirSync(dirPath);
            } catch {}
        }
    }

    // Register handlers for various exit scenarios
    process.on("exit", cleanup);
    process.on("SIGINT", async () => {
        await cleanup();
        process.exit(0);
    });
    process.on("SIGTERM", async () => {
        await cleanup();
        process.exit(0);
    });
    process.on("uncaughtException", async (err) => {
        log(`[Sandbox] Uncaught exception: ${err.message}`, { level: "error" });
        await cleanup();
        process.exit(1);
    });
}

// Mapping: mb3→setupProcessExitHandler, jD6→httpProxyServer, Fq6→socksProxyServer,
//          N21→logMonitorCleanup, LL→networkInfo, yw8→createdSeccompFilters, v21→createdEmptyDirs
```

---

## Sandbox Reset and Teardown (xw8)

**Location:** `chunks.55.mjs:3288-3320`

```javascript
// ============================================
// reset - Clean up all sandbox resources
// Location: chunks.55.mjs:3288-3320
// ============================================

// ORIGINAL (for source lookup):
async function xw8() {
    if (N21) {
        try {
            N21()
        } catch (A) {
            wA(`[Sandbox] Error stopping log monitor: ${A}`, {
                level: "error"
            })
        }
        N21 = void 0
    }
    if (LL?.linuxBridge) {
        let {
            httpBridgeProcess: A,
            socksBridgeProcess: q
        } = LL.linuxBridge;
        if (A?.pid) try {
            process.kill(A.pid, "SIGTERM")
        } catch {}
        if (q?.pid) try {
            process.kill(q.pid, "SIGTERM")
        } catch {}
    }
    for (let A of yw8) try {
        kw8(A)
    } catch {}
    for (let A of v21) try {
        $2.rmdirSync(A)
    } catch {}
    yw8.clear(), v21.clear(), Ua = void 0, LL = void 0, R5 = void 0, wA("[Sandbox] Reset complete")
}

// READABLE (for understanding):
async function reset() {
    // Stop log monitor (macOS)
    if (logMonitorCleanup) {
        try {
            logMonitorCleanup();
        } catch (err) {
            log(`[Sandbox] Error stopping log monitor: ${err}`, { level: "error" });
        }
        logMonitorCleanup = undefined;
    }

    // Kill bridge processes (Linux)
    if (networkInfo?.linuxBridge) {
        let { httpBridgeProcess, socksBridgeProcess } = networkInfo.linuxBridge;
        if (httpBridgeProcess?.pid) {
            try { process.kill(httpBridgeProcess.pid, "SIGTERM"); } catch {}
        }
        if (socksBridgeProcess?.pid) {
            try { process.kill(socksBridgeProcess.pid, "SIGTERM"); } catch {}
        }
    }

    // Cleanup seccomp filter files
    for (let filterPath of createdSeccompFilters) {
        try {
            fs.unlinkSync(filterPath);
        } catch {}
    }

    // Cleanup empty directories
    for (let dirPath of createdEmptyDirs) {
        try {
            fs.rmdirSync(dirPath);
        } catch {}
    }

    // Clear tracking sets
    createdSeccompFilters.clear();
    createdEmptyDirs.clear();

    // Reset state
    networkInitPromise = undefined;
    networkInfo = undefined;
    currentConfig = undefined;

    log("[Sandbox] Reset complete");
}

// Mapping: xw8→reset, N21→logMonitorCleanup, LL→networkInfo, yw8→createdSeccompFilters,
//          v21→createdEmptyDirs, kw8→fs.unlinkSync, Ua→networkInitPromise, R5→currentConfig
```

---

## Error Handling

### Dependency Check Failure

```javascript
if (depCheck.errors.length > 0) {
    throw new Error(`Sandbox dependencies not available: ${depCheck.errors.join(", ")}`);
}
```

User sees: "Sandbox dependencies not available: bubblewrap (bwrap) not installed, socat not installed"

### Network Initialization Failure

```javascript
catch (error) {
    networkInitPromise = undefined;
    networkInfo = undefined;
    await reset();
    throw error;
}
```

- Cleans up partial initialization
- Resets state for retry
- Error propagates to caller

### Platform Not Supported

```javascript
if (!isSupportedPlatform()) {
    return { errors: ["Unsupported platform"], warnings: [] };
}
```

Sandbox simply doesn't initialize - commands run unsandboxed.

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS implementation
- [network_proxy.md](./network_proxy.md) - Network filtering
- [symbol_validation.md](./symbol_validation.md) - Symbol mappings