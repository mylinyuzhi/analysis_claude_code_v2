# Sandbox Module Overview

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `initializeSandbox` ($44) - Main sandbox initialization entry point
- `isSandboxingEnabled` (ixA) - High-level sandbox availability check
- `wrapWithSandbox` (a64) - Platform-agnostic command wrapping
- `macOSSandboxWrapper` (Tm0) - macOS sandbox-exec wrapper
- `linuxSandboxWrapper` (qm0) - Linux bwrap wrapper

---

## 1. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Claude Code Sandbox System                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Layer 1: Settings & Configuration                │   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │ localSettings│  │flagSettings │  │policySettings│  │   CLI Args  │ │   │
│  │  │  (user)     │  │  (flags)    │  │  (enterprise)│  │  --sandbox  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │   │
│  │         └────────────────┼────────────────┼────────────────┘         │   │
│  │                          ▼                                           │   │
│  │                ┌─────────────────────┐                               │   │
│  │                │ parseSettingsToConfig│ (sH1)                        │   │
│  │                │ chunks.19.mjs:549   │                               │   │
│  │                └──────────┬──────────┘                               │   │
│  └───────────────────────────┼──────────────────────────────────────────┘   │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Layer 2: Core Sandbox Engine                     │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    SandboxConfig Object (e8)                    │ │   │
│  │  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐ │ │   │
│  │  │ │  network    │ │  filesystem │ │  ignoreViolations          │ │ │   │
│  │  │ │ ─────────── │ │ ─────────── │ │ ───────────────────────────│ │ │   │
│  │  │ │allowedDomains│ │ denyRead   │ │ {"*": [...patterns...]}    │ │ │   │
│  │  │ │deniedDomains│ │ allowWrite │ │ {"cmd": [...patterns...]}  │ │ │   │
│  │  │ │allowUnixSockets│denyWrite │ │                             │ │ │   │
│  │  │ │httpProxyPort│ │             │ │                             │ │ │   │
│  │  │ │socksProxyPort│             │ │                             │ │ │   │
│  │  │ └─────────────┘ └─────────────┘ └─────────────────────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                              │                                       │   │
│  │              ┌───────────────┼───────────────┐                       │   │
│  │              ▼               ▼               ▼                       │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │ Network Proxy   │ │ Filesystem      │ │ Violation       │        │   │
│  │  │ Infrastructure  │ │ Config Getters  │ │ Monitoring      │        │   │
│  │  │ (HTTP + SOCKS)  │ │                 │ │ (macOS only)    │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   Layer 3: Platform-Specific Wrappers                 │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────────┐│   │
│  │  │        macOS Sandbox        │  │         Linux Sandbox           ││   │
│  │  │     (Apple Seatbelt)        │  │      (bubblewrap/bwrap)         ││   │
│  │  │                             │  │                                 ││   │
│  │  │ ┌─────────────────────────┐ │  │ ┌─────────────────────────────┐ ││   │
│  │  │ │ generateSandboxProfile  │ │  │ │ buildFilesystemRestrictions │ ││   │
│  │  │ │ (H44) - Seatbelt policy │ │  │ │ (J44) - bind mount args     │ ││   │
│  │  │ └─────────────────────────┘ │  │ └─────────────────────────────┘ ││   │
│  │  │ ┌─────────────────────────┐ │  │ ┌─────────────────────────────┐ ││   │
│  │  │ │ macOSSandboxWrapper     │ │  │ │ linuxSandboxWrapper         │ ││   │
│  │  │ │ (Tm0) - sandbox-exec    │ │  │ │ (qm0) - bwrap command       │ ││   │
│  │  │ └─────────────────────────┘ │  │ └─────────────────────────────┘ ││   │
│  │  │ ┌─────────────────────────┐ │  │ ┌─────────────────────────────┐ ││   │
│  │  │ │ startViolationMonitor   │ │  │ │ Seccomp BPF Filter          │ ││   │
│  │  │ │ (Pm0) - log stream      │ │  │ │ (Unix socket blocking)      │ ││   │
│  │  │ └─────────────────────────┘ │  │ └─────────────────────────────┘ ││   │
│  │  │                             │  │ ┌─────────────────────────────┐ ││   │
│  │  │                             │  │ │ initializeLinuxBridges      │ ││   │
│  │  │                             │  │ │ (wm0) - socat proxies       │ ││   │
│  │  │                             │  │ └─────────────────────────────┘ ││   │
│  │  └─────────────────────────────┘  └─────────────────────────────────┘│   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Layer 4: Bash Tool Integration                     │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    isBashSandboxed (WIA)                        │ │   │
│  │  │                    chunks.106.mjs:446-452                       │ │   │
│  │  │                                                                 │ │   │
│  │  │  Decision Flow:                                                 │ │   │
│  │  │  1. Is sandbox enabled? (isSandboxingEnabled)                   │ │   │
│  │  │  2. Is dangerouslyDisableSandbox=true AND allowed by policy?    │ │   │
│  │  │  3. Is command in excludedCommands list?                        │ │   │
│  │  │  4. If all checks pass → Run in sandbox                         │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Support Matrix

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| **Sandbox Support** | Yes | Yes | No |
| **Sandbox Technology** | Apple Sandbox.app (Seatbelt) | bubblewrap (bwrap) | N/A |
| **File Restriction Method** | Sandbox profile rules | Bind mounts + tmpfs | N/A |
| **Network Restriction** | HTTP/SOCKS proxy filtering | `--unshare-net` + socat bridges | N/A |
| **Unix Socket Blocking** | Via sandbox profile | Seccomp BPF filter | N/A |
| **Violation Detection** | Real-time log stream | N/A (best-effort) | N/A |
| **Glob Pattern Support** | Yes (regex conversion) | No (logged as skipped) | N/A |
| **Docker/Nested Sandbox** | N/A | `enableWeakerNestedSandbox` | N/A |
| **Required Dependencies** | ripgrep (rg) | ripgrep, bwrap, socat | N/A |

---

## 3. Sandbox Initialization Flow

### Pseudocode: Sandbox Initialization

```
FUNCTION initializeSandbox(config, permissionCallback, enableMonitoring):
    IF already initializing:
        AWAIT existing initialization promise
        RETURN

    // Store configuration globally
    SET globalConfig = config

    // Validate dependencies
    IF NOT checkDependencies():
        platform = getPlatform()
        IF platform == "linux":
            THROW "Required: ripgrep (rg), bubblewrap (bwrap), and socat"
        ELSE IF platform == "macos":
            THROW "Required: ripgrep (rg)"
        ELSE:
            THROW "Platform not supported"

    // Start violation monitor on macOS
    IF enableMonitoring AND platform == "macos":
        startViolationMonitor(violationStore.addViolation, config.ignoreViolations)
        LOG "Started macOS sandbox log monitor"

    // Register cleanup handlers
    registerCleanupOnExit()

    // Initialize network infrastructure
    TRY:
        // HTTP Proxy
        IF config.network.httpProxyPort IS defined:
            httpPort = config.network.httpProxyPort
            LOG "Using external HTTP proxy on port ${httpPort}"
        ELSE:
            httpPort = AWAIT initializeHTTPProxy(permissionCallback)

        // SOCKS Proxy
        IF config.network.socksProxyPort IS defined:
            socksPort = config.network.socksProxyPort
            LOG "Using external SOCKS proxy on port ${socksPort}"
        ELSE:
            socksPort = AWAIT initializeSOCKSProxy(permissionCallback)

        // Linux-specific: Create socat bridges
        IF platform == "linux":
            linuxBridge = AWAIT initializeLinuxBridges(httpPort, socksPort)

        // Store network config
        SET networkConfig = {
            httpProxyPort: httpPort,
            socksProxyPort: socksPort,
            linuxBridge: linuxBridge
        }

        LOG "Network infrastructure initialized"
        RETURN networkConfig

    CATCH error:
        AWAIT shutdownSandbox()
        THROW error
```

---

## 4. Key Concepts

### 4.1 Sandbox Configuration Object

The sandbox uses a central configuration object (`e8` in obfuscated code) with three main sections:

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
    mandatoryDenySearchDepth?: number;  // Default: 3
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
┌─────────────────────────────────────────────────────────────────┐
│                    isBashSandboxed(toolInput)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. isSandboxingEnabled() == false?                             │
│     └──> RETURN false (no sandbox)                              │
│                                                                  │
│  2. toolInput.dangerouslyDisableSandbox == true                 │
│     AND areUnsandboxedCommandsAllowed() == true?                │
│     └──> RETURN false (bypass allowed by policy)                │
│                                                                  │
│  3. toolInput.command is empty?                                 │
│     └──> RETURN false                                           │
│                                                                  │
│  4. isExcludedCommand(toolInput.command) == true?               │
│     └──> RETURN false (command explicitly excluded)             │
│                                                                  │
│  5. DEFAULT:                                                    │
│     └──> RETURN true (run in sandbox)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Network Access Control

The sandbox uses HTTP and SOCKS proxy servers to filter network requests:

1. **Request arrives** at proxy server
2. **Check denied domains** - if match, deny immediately
3. **Check allowed domains** - if match, allow immediately
4. **No rule match** - invoke user permission callback or deny

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Sandboxed App  │────▶│  HTTP/SOCKS     │────▶│  Target Server  │
│                 │     │  Proxy Server   │     │                 │
└─────────────────┘     │                 │     └─────────────────┘
                        │  Filter Logic:  │
                        │  1. Deny list   │
                        │  2. Allow list  │
                        │  3. User prompt │
                        └─────────────────┘
```

### 4.5 Violation Monitoring (macOS)

On macOS, sandbox violations are detected via system logs:

```
┌─────────────────────────────────────────────────────────────────┐
│                   macOS Sandbox Violation Monitor                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Start: log stream --predicate "(eventMessage ENDSWITH tag)" │
│                                                                  │
│  2. Parse each log line for "Sandbox:" and "deny"               │
│                                                                  │
│  3. Extract command tag (CMD64_<base64>_END_<unique>)           │
│                                                                  │
│  4. Decode base64 to get original command                       │
│                                                                  │
│  5. Check ignore patterns:                                      │
│     - Global patterns in ignoreViolations["*"]                  │
│     - Command-specific patterns in ignoreViolations[cmd]        │
│                                                                  │
│  6. Add to SandboxViolationStore if not ignored                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Dependencies

### macOS
- **ripgrep (rg)** - Fast file scanning for dangerous file detection

### Linux
- **ripgrep (rg)** - Fast file scanning for dangerous file detection
- **bubblewrap (bwrap)** - Lightweight sandboxing tool
- **socat** - Network bridge for proxy connections inside container
- **Seccomp BPF filter** - Pre-compiled binary for Unix socket blocking (vendor/seccomp/)
- **apply-seccomp** - Binary to apply seccomp filter (vendor/seccomp/)

### Dependency Check Flow

```javascript
// ============================================
// checkDependencies - Validates all required binaries
// Location: chunks.17.mjs:298-309
// ============================================

// ORIGINAL (for source lookup):
function vm0(A) {
  let Q = aN();
  if (!xm0(Q)) return !1;
  if ((A ?? e8?.ripgrep)?.command === void 0) {
    if (!Jm0()) return !1
  }
  if (Q === "linux") {
    let Z = e8?.network?.allowAllUnixSockets ?? !1;
    return $m0(Z)
  }
  return !0
}

// READABLE (for understanding):
function checkDependencies(ripgrepConfig) {
  let platform = getPlatform();

  // Check if platform is supported (macos or linux)
  if (!isSupportedPlatform(platform)) {
    return false;
  }

  // Check if ripgrep is available (unless custom command specified)
  if ((ripgrepConfig ?? globalConfig?.ripgrep)?.command === undefined) {
    if (!isRipgrepAvailable()) {
      return false;
    }
  }

  // Linux-specific checks
  if (platform === "linux") {
    let allowAllUnixSockets = globalConfig?.network?.allowAllUnixSockets ?? false;
    return checkLinuxDependencies(allowAllUnixSockets);
  }

  return true;
}

// Mapping: vm0→checkDependencies, A→ripgrepConfig, Q→platform, xm0→isSupportedPlatform
```

---

## 6. File Locations

| Component | File | Key Lines |
|-----------|------|-----------|
| macOS Sandbox Core | chunks.17.mjs | 1-600 |
| Linux Sandbox Core | chunks.16.mjs | 3150-3550 |
| Settings Integration | chunks.19.mjs | 540-740 |
| Bash Tool Enforcement | chunks.106.mjs | 440-680 |
| Sandbox UI | chunks.152.mjs | 560-730 |
| Restrictions Summary | chunks.71.mjs | 665-785 |

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

## See Also

- [configuration.md](./configuration.md) - Configuration structure and parsing
- [permissions.md](./permissions.md) - Permission decision flow
- [macos_implementation.md](./macos_implementation.md) - macOS Seatbelt details
- [linux_implementation.md](./linux_implementation.md) - Linux bwrap details
