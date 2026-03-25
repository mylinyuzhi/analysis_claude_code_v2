# Linux Bubblewrap Implementation (Claude Code 2.1.76)

## Overview

On Linux, Claude Code uses `bwrap` (bubblewrap) to implement sandbox isolation. Unlike macOS's sandbox-exec which uses SBPL profiles, bubblewrap uses a command-line argument approach to construct filesystem namespaces, network namespaces, and process isolation. The implementation handles filesystem mount construction, symlink attack prevention, and network namespace isolation with Unix socket bridges.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key symbols in this document:
- `uZ7` - wrapWithBubblewrap function (main bwrap command builder)
- `Rb3` - generateBwrapArgs function (filesystem mount arguments)
- `Lb3` - buildBridgeWrapperCommand function (network namespace bridge wrapper)
- `Sb3` - getDenyWritePaths function (paths to block write access)
- `Cb3` - generateLogTag function (command correlation identifier)
- `v21` - createdEmptyDirs set (cleanup tracking)
- `yw8` - createdSeccompFilters set (seccomp file cleanup)
- `bZ7` - checkLinuxSandboxDependencies function (dependency validator)
- `xZ7` - startLinuxSocketBridges function (socat bridge process spawner)

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated - Main bwrap command builder |
| `Rb3` | generateBwrapArgs | chunks.55.mjs:2491 | ✅ Validated - Filesystem mount arguments |
| `Cb3` | generateLogTag | chunks.55.mjs:2678 | ✅ Validated - Command correlation ID |
| `xZ7` | createBridgeSockets | chunks.55.mjs:2401 | ✅ Validated - Unix socket bridges |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bubblewrap Sandbox Construction                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Command Request                                                            │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ wrapWithBubblewrap (uZ7)                                             │   │
│  │   • Check if sandboxing needed                                       │   │
│  │   • Generate seccomp filter (for Unix socket blocking)               │   │
│  │   • Build namespace arguments                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ generateBwrapArgs (Rb3) - Filesystem mounts                          │   │
│  │                                                                      │   │
│  │   Write restrictions:                                                │   │
│  │   --ro-bind / /           → Read-only root                          │   │
│  │   --bind /path /path      → Writable allowed paths                  │   │
│  │   --ro-bind /dev/null N   → Block denied paths                      │   │
│  │                                                                      │   │
│  │   Read restrictions:                                                 │   │
│  │   --tmpfs /path           → Hide directory (empty tmpfs)            │   │
│  │   --ro-bind /dev/null N   → Hide file                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  bwrap [args] -- /bin/bash -c <command>                                    │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Namespace Isolation                                                  │   │
│  │   --unshare-net    → No network (unless bridge sockets bound)       │   │
│  │   --unshare-pid    → Separate PID namespace                         │   │
│  │   --new-session    → New session (prevents terminal signal leak)    │   │
│  │   --die-with-parent → Kill sandbox when parent dies                 │   │
│  │   --dev /dev       → Minimal /dev filesystem                        │   │
│  │   --proc /proc     → Separate /proc (if not nested sandbox)         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Main Function: `wrapWithBubblewrap` (uZ7)

**Location:** `chunks.55.mjs:2564-2648`

```javascript
// ============================================
// wrapWithBubblewrap - Construct bwrap command for sandboxing
// Location: chunks.55.mjs:2564-2648
// ============================================

// ORIGINAL (for source lookup):
async function uZ7(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpSocketPath: Y,
        socksSocketPath: z,
        httpProxyPort: _,
        socksProxyPort: w,
        readConfig: O,
        writeConfig: $,
        enableWeakerNestedSandbox: H,
        allowAllUnixSockets: j,
        binShell: J,
        ripgrepConfig: M = { command: "rg" },
        mandatoryDenySearchDepth: D = Rw8,
        allowGitConfig: X = !1,
        seccompConfig: P,
        abortSignal: W
    } = A, Z = O && O.denyOnly.length > 0, G = $ !== void 0;
    if (!K && !Z && !G) return q;
    let f = ["--new-session", "--die-with-parent"],
        v = void 0;
    try {
        // ... seccomp filter generation ...
        if (K) {
            if (f.push("--unshare-net"), Y && z) {
                f.push("--bind", Y, Y), f.push("--bind", z, z);
                // ... environment variables ...
            }
        }
        let N = await Rb3(O, $, M, D, X, W);
        if (f.push(...N), f.push("--dev", "/dev"), f.push("--unshare-pid"), !H) f.push("--proc", "/proc");
        // ... final command construction ...
        let h = gq6.default.quote(["bwrap", ...f]);
        return wA(`[Sandbox Linux] Wrapped command with bwrap (${R.join(", ")} restrictions)`), h
    } catch (N) { /* ... error handling ... */ }
}

// READABLE (for understanding):
async function wrapWithBubblewrap({
    command,
    needsNetworkRestriction,
    httpSocketPath,       // Path to HTTP proxy Unix socket bridge
    socksSocketPath,      // Path to SOCKS proxy Unix socket bridge
    httpProxyPort,        // Host port for HTTP proxy
    socksProxyPort,       // Host port for SOCKS proxy
    readConfig,           // { denyOnly: string[] } - paths to deny reading
    writeConfig,          // { allowOnly: string[], denyWithinAllow: string[] }
    enableWeakerNestedSandbox,  // Skip /proc mount for nested sandboxing
    allowAllUnixSockets,  // Skip seccomp Unix socket blocking
    binShell,             // Shell to use (default: bash)
    ripgrepConfig,        // Configuration for ripgrep command generation
    mandatoryDenySearchDepth,  // Depth for mandatory deny paths
    allowGitConfig = false,    // Allow writing to .git/config
    seccompConfig,        // Seccomp BPF filter configuration
    abortSignal
}) {
    let hasReadDeny = readConfig && readConfig.denyOnly.length > 0;
    let hasWriteConfig = writeConfig !== undefined;

    // Skip sandboxing if not needed
    if (!needsNetworkRestriction && !hasReadDeny && !hasWriteConfig) {
        return command;
    }

    // Base arguments: process isolation
    let bwrapArgs = [
        "--new-session",      // New session for signal isolation
        "--die-with-parent"   // Kill sandbox when parent dies
    ];

    let seccompFilterPath = undefined;

    try {
        // Generate seccomp filter for Unix socket blocking (if needed)
        if (!allowAllUnixSockets) {
            seccompFilterPath = generateSeccompFilter(seccompConfig?.bpfPath);
            // ... filter generation logic ...
        }

        // Network namespace isolation
        if (needsNetworkRestriction) {
            bwrapArgs.push("--unshare-net");

            // Bind bridge sockets into sandbox (for network proxy)
            if (httpSocketPath && socksSocketPath) {
                bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
                bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

                // Set environment variables for proxy ports
                // ... env var setup ...
            }
        }

        // Filesystem mount arguments
        let fsArgs = await generateBwrapArgs(
            readConfig, writeConfig, ripgrepConfig,
            mandatoryDenySearchDepth, allowGitConfig, abortSignal
        );
        bwrapArgs.push(...fsArgs);

        // Device and process namespaces
        bwrapArgs.push("--dev", "/dev");
        bwrapArgs.push("--unshare-pid");
        if (!enableWeakerNestedSandbox) {
            bwrapArgs.push("--proc", "/proc");
        }

        // Final command construction
        let shell = binShell || "bash";
        let shellPath = which(shell);
        bwrapArgs.push("--", shellPath, "-c");

        // Wrap with seccomp if filter exists
        if (seccompFilterPath) {
            let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);
            bwrapArgs.push(quote([applySeccompPath, seccompFilterPath, shellPath, "-c", command]));
        } else {
            bwrapArgs.push(command);
        }

        let fullCommand = quote(["bwrap", ...bwrapArgs]);
        log(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`);
        return fullCommand;

    } catch (error) {
        // Cleanup seccomp filter on error
        if (seccompFilterPath && !seccompFilterPath.includes("/vendor/seccomp/")) {
            cleanupSeccompFilter(seccompFilterPath);
        }
        throw error;
    }
}

// Mapping: uZ7→wrapWithBubblewrap, K→needsNetworkRestriction, Y→httpSocketPath,
//          z→socksSocketPath, O→readConfig, $→writeConfig, f→bwrapArgs,
//          Rb3→generateBwrapArgs, gq6→shellQuote, wA→log
```

---

## Filesystem Mount Generation: `generateBwrapArgs` (Rb3)

**Location:** `chunks.55.mjs:2491-2561`

```javascript
// ============================================
// generateBwrapArgs - Generate bwrap filesystem mount arguments
// Location: chunks.55.mjs:2491-2561
// ============================================

// ORIGINAL (for source lookup):
async function Rb3(A, q, K = { command: "rg" }, Y = Rw8, z = !1, _) {
    let w = [];
    if (q) {
        w.push("--ro-bind", "/", "/");
        let $ = [];
        for (let j of q.allowOnly || []) {
            let J = EL(j);
            // ... path validation and expansion ...
            w.push("--bind", J, J), $.push(J)
        }
        let H = [...q.denyWithinAllow || [], ...await yb3(K, Y, z, _)];
        for (let j of H) {
            let J = EL(j);
            // ... symlink attack prevention ...
            if ($.some((X) => J.startsWith(X + "/") || J === X)) w.push("--ro-bind", J, J);
        }
    } else w.push("--bind", "/", "/");
    let O = [...A?.denyOnly || []];
    // ... read deny handling ...
    return w
}

// READABLE (for understanding):
async function generateBwrapArgs(
    readConfig,              // { denyOnly: string[] }
    writeConfig,             // { allowOnly: string[], denyWithinAllow: string[] }
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    abortSignal
) {
    let args = [];

    if (writeConfig) {
        // Start with read-only root (deny-by-default for writes)
        args.push("--ro-bind", "/", "/");

        let allowedWritePaths = [];

        // Allow writing to specific paths
        for (let allowPath of writeConfig.allowOnly || []) {
            let expandedPath = expandPath(allowPath);

            // Skip /dev paths (handled separately)
            if (expandedPath.startsWith("/dev/")) {
                log(`[Sandbox Linux] Skipping /dev path: ${expandedPath}`);
                continue;
            }

            // Skip non-existent paths
            if (!fs.existsSync(expandedPath)) {
                log(`[Sandbox Linux] Skipping non-existent write path: ${expandedPath}`);
                continue;
            }

            // Symlink escape check
            try {
                let realPath = fs.realpathSync(expandedPath);
                let normalizedPath = expandedPath.replace(/\/+$/, "");
                if (realPath !== normalizedPath && isSymlinkEscape(expandedPath, realPath)) {
                    log(`[Sandbox Linux] Skipping symlink pointing outside: ${allowPath} -> ${realPath}`);
                    continue;
                }
            } catch {
                log(`[Sandbox Linux] Skipping unresolvable write path: ${expandedPath}`);
                continue;
            }

            // Mount as writable
            args.push("--bind", expandedPath, expandedPath);
            allowedWritePaths.push(expandedPath);
        }

        // Deny specific paths within allowed areas
        let denyPaths = [
            ...writeConfig.denyWithinAllow || [],
            ...await getMandatoryDenyPaths(ripgrepConfig, mandatoryDenySearchDepth, allowGitConfig, abortSignal)
        ];

        for (let denyPath of denyPaths) {
            let expandedPath = expandPath(denyPath);

            if (expandedPath.startsWith("/dev/")) continue;

            // Check for symlink attack vector
            let symlinkMountPoint = findSymlinkMountPoint(expandedPath, allowedWritePaths);
            if (symlinkMountPoint) {
                // Mount /dev/null at symlink to prevent replacement attack
                args.push("--ro-bind", "/dev/null", symlinkMountPoint);
                log(`[Sandbox Linux] Mounted /dev/null at symlink ${symlinkMountPoint}`);
                continue;
            }

            // For non-existent deny paths within allowed areas
            if (!fs.existsSync(expandedPath)) {
                if (hasFileAncestor(expandedPath)) {
                    log(`[Sandbox Linux] Skipping deny with file ancestor: ${expandedPath}`);
                    continue;
                }

                // Find nearest existing ancestor
                let ancestor = path.dirname(expandedPath);
                while (ancestor !== "/" && !fs.existsSync(ancestor)) {
                    ancestor = path.dirname(ancestor);
                }

                // Only block if within allowed paths
                if (allowedWritePaths.some(p =>
                    ancestor.startsWith(p + "/") || ancestor === p ||
                    expandedPath.startsWith(p + "/")
                )) {
                    let blockMountPoint = findBestBlockPoint(expandedPath);
                    if (blockMountPoint !== expandedPath) {
                        // Create empty temp dir to mount
                        let emptyDir = fs.mkdtempSync(path.join(TEMP_DIR, "claude-empty-"));
                        args.push("--ro-bind", emptyDir, blockMountPoint);
                        trackCreatedDir(blockMountPoint);  // For cleanup
                        log(`[Sandbox Linux] Mounted empty dir at ${blockMountPoint}`);
                    } else {
                        args.push("--ro-bind", "/dev/null", blockMountPoint);
                        trackCreatedDir(blockMountPoint);
                        log(`[Sandbox Linux] Mounted /dev/null at ${blockMountPoint}`);
                    }
                }
                continue;
            }

            // Existing path within allowed area - make read-only
            if (allowedWritePaths.some(p =>
                expandedPath.startsWith(p + "/") || expandedPath === p
            )) {
                args.push("--ro-bind", expandedPath, expandedPath);
            }
        }
    } else {
        // No write config = allow all writes
        args.push("--bind", "/", "/");
    }

    // Read deny paths - use tmpfs for dirs, /dev/null for files
    let readDenyPaths = [...readConfig?.denyOnly || []];

    // Always deny /etc/ssh/ssh_config.d (contains sensitive configs)
    if (fs.existsSync("/etc/ssh/ssh_config.d")) {
        readDenyPaths.push("/etc/ssh/ssh_config.d");
    }

    for (let denyPath of readDenyPaths) {
        let expandedPath = expandPath(denyPath);

        if (!fs.existsSync(expandedPath)) {
            log(`[Sandbox Linux] Skipping non-existent read deny: ${expandedPath}`);
            continue;
        }

        if (fs.statSync(expandedPath).isDirectory()) {
            // Mount empty tmpfs to hide directory contents
            args.push("--tmpfs", expandedPath);
        } else {
            // Mount /dev/null to hide file
            args.push("--ro-bind", "/dev/null", expandedPath);
        }
    }

    return args;
}

// Mapping: Rb3→generateBwrapArgs, A→readConfig, q→writeConfig, w→args,
//          EL→expandPath, $→allowedWritePaths, yb3→getMandatoryDenyPaths
```

---

## Key Mount Patterns

### Read-Only Root with Writable Exceptions

```
--ro-bind / /                    # Root filesystem is read-only
--bind /home/user/project /home/user/project  # Allow writes to project
--bind /tmp /tmp                 # Allow writes to tmp
```

**Why this approach:** Bubblewrap doesn't have a deny-by-default write policy like macOS's sandbox-exec. Instead, we mount the entire root as read-only, then explicitly bind-mount writable paths.

### Blocking Specific Paths

```
--ro-bind /dev/null /home/user/.ssh/id_rsa   # Hide sensitive file
--tmpfs /home/user/.ssh                       # Hide entire directory
```

**Why `/dev/null`:** Binding `/dev/null` to a path makes reads return empty and writes go nowhere. This effectively "hides" the file without causing errors that would reveal its existence.

### Symlink Attack Prevention

```
# If /home/user/project/link -> /etc is a symlink
--ro-bind /dev/null /home/user/project/link   # Block the symlink target
```

**The attack vector:** An attacker could create a symlink inside a writable directory pointing to a sensitive location. After sandbox creation, they replace the symlink with a real file, gaining access to the target.

**Mitigation:** Mount `/dev/null` at symlink paths within writable areas to prevent replacement.

---

## Namespace Arguments

### Network Isolation

```javascript
// Network namespace with proxy bridge
if (needsNetworkRestriction) {
    bwrapArgs.push("--unshare-net");

    if (httpSocketPath && socksSocketPath) {
        // Bind bridge sockets into sandbox
        bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
        bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

        // Set proxy environment variables
        bwrapArgs.push("--setenv", "HTTP_PROXY", `http://localhost:3128`);
        bwrapArgs.push("--setenv", "SOCKS_PROXY", `socks5://localhost:1080`);
    }
}
```

**Why Unix socket bridges:** Network namespaces are completely isolated - no network access at all. To allow filtered network access through the sandbox's HTTP/SOCKS proxy, we bind-mount Unix socket paths into the namespace.

### Process Isolation

```javascript
bwrapArgs.push("--dev", "/dev");      // Minimal /dev with safe devices
bwrapArgs.push("--unshare-pid");       // Separate PID namespace
bwrapArgs.push("--proc", "/proc");     // Separate /proc (unless nested)
bwrapArgs.push("--new-session");       // New session (terminal signals)
bwrapArgs.push("--die-with-parent");   // Cleanup on parent death
```

**Why `--die-with-parent`:** Ensures the sandbox process tree is killed if Claude Code crashes or is killed. Without this, orphaned sandbox processes could continue running.

---

## Mandatory Deny Paths: `getDenyWritePaths` (Sb3)

**Location:** `chunks.55.mjs:2669-2676`

```javascript
// ============================================
// getDenyWritePaths - Get paths that should always be denied write access
// Location: chunks.55.mjs:2669-2676
// ============================================

// ORIGINAL (for source lookup):
function Sb3(A = !1) {
    let q = process.cwd(),
        K = [];
    for (let Y of Vx6) K.push(WU.resolve(q, Y)), K.push(`**/${Y}`);
    for (let Y of G21()) K.push(WU.resolve(q, Y)), K.push(`**/${Y}/**`);
    if (K.push(WU.resolve(q, ".git/hooks")), K.push("**/.git/hooks/**"), !A) K.push(WU.resolve(q, ".git/config")), K.push("**/.git/config");
    return [...new Set(K)]
}

// READABLE (for understanding):
function getDenyWritePaths(allowGitConfig = false) {
    let cwd = process.cwd();
    let denyPaths = [];

    // Environment files (sensitive data)
    for (let envFile of ENV_FILES) {  // ['.env', '.env.local', '.env.*.local']
        denyPaths.push(path.resolve(cwd, envFile));
        denyPaths.push(`**/${envFile}`);
    }

    // Configuration files (may contain secrets)
    for (let configFile of getConfigFiles()) {  // ['claude.json', 'settings.json', ...]
        denyPaths.push(path.resolve(cwd, configFile));
        denyPaths.push(`**/${configFile}/**`);
    }

    // Git hooks (execution vectors)
    denyPaths.push(path.resolve(cwd, ".git/hooks"));
    denyPaths.push("**/.git/hooks/**");

    // Git config (unless explicitly allowed)
    if (!allowGitConfig) {
        denyPaths.push(path.resolve(cwd, ".git/config"));
        denyPaths.push("**/.git/config");
    }

    return [...new Set(denyPaths)];  // Deduplicate
}

// Mapping: Sb3→getDenyWritePaths, Vx6→ENV_FILES, G21→getConfigFiles, WU→path
```

**Why these paths are always denied:**
- `.env` files often contain API keys and secrets
- Config files may have sensitive settings
- `.git/hooks` could be used for code execution
- `.git/config` may contain remote URLs with embedded credentials

---

## Log Tag Generation: `generateLogTag` (Cb3)

**Location:** `chunks.55.mjs:2678-2679`

```javascript
// ORIGINAL (for source lookup):
function Cb3(A) {
    return `CMD64_${T21(A)}_END_${FZ7}`
}

// READABLE (for understanding):
function generateLogTag(command) {
    return `CMD64_${encodeBase64(command)}_END_${SANDBOX_LOG_TAG}`;
}

// Mapping: Cb3→generateLogTag, T21→encodeBase64, FZ7→SANDBOX_LOG_TAG
```

**Why base64 encoding:** The command string may contain special characters that would break log parsing. Base64 encoding ensures a clean, parseable format.

---

## Error Handling and Cleanup

### Cleanup Tracking

```javascript
// Global sets for tracking created resources
yw8 = new Set();  // Seccomp filter files created
v21 = new Set();  // Empty directories created
```

### Cleanup Functions

```javascript
// Location: chunks.55.mjs:2375-2382
function cleanupMountPoint(path) {
    try {
        let stat = fs.statSync(path);
        if (stat.isFile() && stat.size === 0) {
            fs.unlinkSync(path);
            log(`[Sandbox Linux] Cleaned up bwrap mount point (file): ${path}`);
        } else if (stat.isDirectory()) {
            if (fs.readdirSync(path).length === 0) {
                fs.rmdirSync(path);
                log(`[Sandbox Linux] Cleaned up bwrap mount point (dir): ${path}`);
            }
        }
    } catch {}
}
```

---

## Design Rationale

### Why `--ro-bind / /` Instead of `--ro-bind` (Recursive)

Bubblewrap requires source and destination for bind mounts. `--ro-bind / /` makes the entire root filesystem read-only, then specific `--bind` calls create writable exceptions.

### Why Separate PID Namespace

Without `--unshare-pid`, the sandboxed process could see and potentially signal other processes. A separate PID namespace provides true isolation.

### Why Not Always Mount `/proc`

The `enableWeakerNestedSandbox` flag skips `--proc /proc` when running inside another sandbox (e.g., Docker, Flatpak). Nested sandboxing can conflict with `/proc` mounts.

---

## Deep Algorithm Analysis: Bubblewrap Command Construction

### Algorithm Overview

The `wrapWithLinuxSandbox` (uZ7) function constructs a bubblewrap command through a multi-phase process:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bubblewrap Command Construction Algorithm                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: Early Exit Check                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ if (!needsNetworkRestriction && !hasReadDeny && !hasWriteConfig)    │    │
│  │   return command;  // Skip sandboxing entirely                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 2: Seccomp Filter Generation (for Unix socket blocking)              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ if (!allowAllUnixSockets)                                            │    │
│  │   Generate seccomp BPF filter at seccompFilterPath                  │    │
│  │   Track filter for cleanup                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 3: Network Namespace Setup                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ if (needsNetworkRestriction)                                         │    │
│  │   --unshare-net                        ; No network access          │    │
│  │   if (httpSocketPath && socksSocketPath)                            │    │
│  │     --bind httpSocketPath httpSocketPath  ; Bridge HTTP socket      │    │
│  │     --bind socksSocketPath socksSocketPath ; Bridge SOCKS socket    │    │
│  │     --setenv HTTP_PROXY http://localhost:3128                       │    │
│  │     --setenv SOCKS_PROXY socks5://localhost:1080                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 4: Filesystem Mount Generation                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ generateBwrapArgs(readConfig, writeConfig, ...)                     │    │
│  │                                                                      │    │
│  │ if (writeConfig):                                                    │    │
│  │   --ro-bind / /                        ; Read-only root             │    │
│  │   for each allowPath: --bind path path ; Writable exceptions        │    │
│  │   for each denyPath: --ro-bind path path ; Read-only within allow   │    │
│  │ else:                                                                │    │
│  │   --bind / /                           ; Full write access          │    │
│  │                                                                      │    │
│  │ for each readDenyPath:                                               │    │
│  │   if (directory): --tmpfs path          ; Hide with empty tmpfs     │    │
│  │   else: --ro-bind /dev/null path        ; Hide file                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 5: Process Namespace & Device Setup                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ --dev /dev                              ; Minimal /dev filesystem   │    │
│  │ --unshare-pid                           ; Separate PID namespace    │    │
│  │ --proc /proc                            ; Separate /proc (unless nested)│ │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 6: Final Command Assembly                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ bwrap [args] -- shell -c <command>                                  │    │
│  │                                                                      │    │
│  │ if (seccompFilterPath):                                             │    │
│  │   bwrap [args] -- apply-seccomp filter shell -c <command>           │    │
│  │ else:                                                                │    │
│  │   bwrap [args] -- shell -c <command>                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Analysis: wrapWithLinuxSandbox (uZ7)

**Location:** `chunks.55.mjs:2564-2648`

```javascript
// ============================================
// wrapWithLinuxSandbox - Main entry point for Linux sandboxing
// Location: chunks.55.mjs:2564-2648
// ============================================

// ORIGINAL (for source lookup):
async function uZ7(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpSocketPath: Y,
        socksSocketPath: z,
        httpProxyPort: _,
        socksProxyPort: w,
        readConfig: O,
        writeConfig: $,
        enableWeakerNestedSandbox: H,
        allowAllUnixSockets: j,
        binShell: J,
        ripgrepConfig: M = { command: "rg" },
        mandatoryDenySearchDepth: D = Rw8,
        allowGitConfig: X = !1,
        seccompConfig: P,
        abortSignal: W
    } = A, Z = O && O.denyOnly.length > 0, G = $ !== void 0;
    if (!K && !Z && !G) return q;
    let f = ["--new-session", "--die-with-parent"],
        v = void 0;
    try {
        if (!j) {
            v = RZ7(P?.bpfPath) ?? void 0;
            let u = Ex6(P?.applyPath);
            if (!v || !u) wA("[Sandbox Linux] Seccomp binaries not available...", { level: "warn" }), v = void 0;
            else {
                if (!v.includes("/vendor/seccomp/")) yw8.add(v), Lw8();
                wA("[Sandbox Linux] Generated seccomp BPF filter...")
            }
        }
        if (K) {
            if (f.push("--unshare-net"), Y && z) {
                if (!$2.existsSync(Y)) throw Error(`Linux HTTP bridge socket does not exist: ${Y}...`);
                if (!$2.existsSync(z)) throw Error(`Linux SOCKS bridge socket does not exist: ${z}...`);
                f.push("--bind", Y, Y), f.push("--bind", z, z);
                let u = f21(3128, 1080);
                f.push(...u.flatMap((I) => { /* setenv logic */ }));
            }
        }
        let N = await Rb3(O, $, M, D, X, W);
        if (f.push(...N), f.push("--dev", "/dev"), f.push("--unshare-pid"), !H) f.push("--proc", "/proc");
        let V = J || "bash", L = JU(V);
        if (!L) throw Error(`Shell '${V}' not found in PATH`);
        if (f.push("--", L, "-c"), K && Y && z) {
            let u = Lb3(Y, z, q, v, L, P?.applyPath);
            f.push(u)
        } else if (v) {
            let u = Ex6(P?.applyPath);
            let I = gq6.default.quote([u, v, L, "-c", q]);
            f.push(I)
        } else f.push(q);
        let h = gq6.default.quote(["bwrap", ...f]);
        return wA(`[Sandbox Linux] Wrapped command with bwrap...`), h
    } catch (N) {
        if (v && !v.includes("/vendor/seccomp/")) { yw8.delete(v); kw8(v); }
        throw N
    }
}

// READABLE (for understanding):
async function wrapWithLinuxSandbox({
    command,
    needsNetworkRestriction,
    httpSocketPath,      // Path to HTTP proxy Unix socket bridge
    socksSocketPath,     // Path to SOCKS proxy Unix socket bridge
    httpProxyPort,       // Host port for HTTP proxy
    socksProxyPort,      // Host port for SOCKS proxy
    readConfig,          // { denyOnly: string[] }
    writeConfig,         // { allowOnly: string[], denyWithinAllow: string[] }
    enableWeakerNestedSandbox,
    allowAllUnixSockets,
    binShell,
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    seccompConfig,
    abortSignal
}) {
    // =====================================================
    // PHASE 1: Early Exit Check
    // =====================================================
    let hasReadDeny = readConfig && readConfig.denyOnly.length > 0;
    let hasWriteConfig = writeConfig !== undefined;

    // Skip sandboxing if not needed (optimization)
    if (!needsNetworkRestriction && !hasReadDeny && !hasWriteConfig) {
        return command;  // No restrictions, return original command
    }

    // =====================================================
    // PHASE 2: Base Arguments (Process Isolation)
    // =====================================================
    let bwrapArgs = [
        "--new-session",      // New session for signal isolation
        "--die-with-parent"   // Kill sandbox when parent dies
    ];

    let seccompFilterPath = undefined;

    try {
        // =====================================================
        // PHASE 2b: Seccomp Filter Generation (Unix Socket Blocking)
        // =====================================================
        if (!allowAllUnixSockets) {
            seccompFilterPath = generateSeccompBpfFilter(seccompConfig?.bpfPath) ?? undefined;
            let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);

            if (!seccompFilterPath || !applySeccompPath) {
                log("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled", {
                    level: "warn"
                });
                seccompFilterPath = undefined;
            } else {
                // Track for cleanup (if not vendor-provided)
                if (!seccompFilterPath.includes("/vendor/seccomp/")) {
                    createdSeccompFilters.add(seccompFilterPath);
                    scheduleCleanup();
                }
                log("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking");
            }
        }

        // =====================================================
        // PHASE 3: Network Namespace Setup
        // =====================================================
        if (needsNetworkRestriction) {
            bwrapArgs.push("--unshare-net");  // No network access

            if (httpSocketPath && socksSocketPath) {
                // Validate bridge sockets exist
                if (!fs.existsSync(httpSocketPath)) {
                    throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}. The bridge process may have died.`);
                }
                if (!fs.existsSync(socksSocketPath)) {
                    throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}. The bridge process may have died.`);
                }

                // Bind bridge sockets into sandbox
                bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
                bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

                // Set proxy environment variables
                let proxyEnvVars = buildProxyEnvVars(3128, 1080);
                bwrapArgs.push(...proxyEnvVars.flatMap(envVar => {
                    let eqIndex = envVar.indexOf("=");
                    let name = envVar.slice(0, eqIndex);
                    let value = envVar.slice(eqIndex + 1);
                    return ["--setenv", name, value];
                }));

                // Set host proxy ports (for advanced use)
                if (httpProxyPort !== undefined) {
                    bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(httpProxyPort));
                }
                if (socksProxyPort !== undefined) {
                    bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(socksProxyPort));
                }
            }
        }

        // =====================================================
        // PHASE 4: Filesystem Mount Generation
        // =====================================================
        let fsArgs = await generateBwrapArgs(
            readConfig, writeConfig, ripgrepConfig,
            mandatoryDenySearchDepth, allowGitConfig, abortSignal
        );
        bwrapArgs.push(...fsArgs);

        // =====================================================
        // PHASE 5: Process Namespace & Device Setup
        // =====================================================
        bwrapArgs.push("--dev", "/dev");       // Minimal /dev filesystem
        bwrapArgs.push("--unshare-pid");       // Separate PID namespace

        if (!enableWeakerNestedSandbox) {
            bwrapArgs.push("--proc", "/proc");  // Separate /proc (if not nested)
        }

        // =====================================================
        // PHASE 6: Final Command Assembly
        // =====================================================
        let shell = binShell || "bash";
        let shellPath = which(shell);
        if (!shellPath) {
            throw Error(`Shell '${shell}' not found in PATH`);
        }

        bwrapArgs.push("--", shellPath, "-c");

        // Wrap command with seccomp if filter exists
        if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
            // Use bridge wrapper (includes seccomp handling)
            let wrappedCommand = buildBridgeWrapperCommand(
                httpSocketPath, socksSocketPath, command,
                seccompFilterPath, shellPath, seccompConfig?.applyPath
            );
            bwrapArgs.push(wrappedCommand);
        } else if (seccompFilterPath) {
            // Apply seccomp filter
            let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);
            let seccompCommand = shellQuote.quote([
                applySeccompPath, seccompFilterPath, shellPath, "-c", command
            ]);
            bwrapArgs.push(seccompCommand);
        } else {
            // No seccomp, just run command
            bwrapArgs.push(command);
        }

        // Quote the entire command for shell execution
        let fullCommand = shellQuote.quote(["bwrap", ...bwrapArgs]);

        // Log restrictions applied
        let restrictions = [];
        if (needsNetworkRestriction) restrictions.push("network");
        if (hasReadDeny || hasWriteConfig) restrictions.push("filesystem");
        if (seccompFilterPath) restrictions.push("seccomp(unix-block)");

        log(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`);

        return fullCommand;

    } catch (error) {
        // Cleanup seccomp filter on error
        if (seccompFilterPath && !seccompFilterPath.includes("/vendor/seccomp/")) {
            createdSeccompFilters.delete(seccompFilterPath);
            try {
                cleanupSeccompFilter(seccompFilterPath);
            } catch (cleanupError) {
                log(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${cleanupError}`, {
                    level: "error"
                });
            }
        }
        throw error;
    }
}

// Mapping: uZ7→wrapWithLinuxSandbox, q→command, K→needsNetworkRestriction,
//          Y→httpSocketPath, z→socksSocketPath, O→readConfig, $→writeConfig,
//          f→bwrapArgs, Rb3→generateBwrapArgs, gq6→shellQuote, wA→log
```

### Deep Algorithm: generateBwrapArgs (Rb3)

**Location:** `chunks.55.mjs:2491-2561`

```javascript
// ============================================
// generateBwrapArgs - Generate filesystem mount arguments
// Location: chunks.55.mjs:2491-2561
// ============================================

// ORIGINAL (for source lookup):
async function Rb3(A, q, K = { command: "rg" }, Y = Rw8, z = !1, _) {
    let w = [];
    if (q) {
        w.push("--ro-bind", "/", "/");
        let $ = [];
        for (let j of q.allowOnly || []) {
            let J = EL(j);
            // ... validation logic ...
            w.push("--bind", J, J), $.push(J)
        }
        let H = [...q.denyWithinAllow || [], ...await yb3(K, Y, z, _)];
        for (let j of H) {
            let J = EL(j);
            // ... symlink attack prevention ...
            if ($.some((X) => J.startsWith(X + "/") || J === X)) w.push("--ro-bind", J, J);
        }
    } else w.push("--bind", "/", "/");
    let O = [...A?.denyOnly || []];
    // ... read deny handling ...
    return w
}

// READABLE (for understanding):
async function generateBwrapArgs(
    readConfig,
    writeConfig,
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    abortSignal
) {
    let args = [];

    // =====================================================
    // PHASE A: Write Restriction Setup
    // =====================================================
    if (writeConfig) {
        // A1: Start with read-only root (deny-by-default for writes)
        args.push("--ro-bind", "/", "/");

        let allowedWritePaths = [];

        // A2: Process allowed write paths
        for (let allowPath of writeConfig.allowOnly || []) {
            let expandedPath = expandPath(allowPath);

            // Skip /dev paths (handled separately by --dev)
            if (expandedPath.startsWith("/dev/")) {
                log(`[Sandbox Linux] Skipping /dev path: ${expandedPath}`);
                continue;
            }

            // Skip non-existent paths (would fail at mount time)
            if (!fs.existsSync(expandedPath)) {
                log(`[Sandbox Linux] Skipping non-existent write path: ${expandedPath}`);
                continue;
            }

            // Symlink escape check
            try {
                let realPath = fs.realpathSync(expandedPath);
                let normalizedPath = expandedPath.replace(/\/+$/, "");
                if (realPath !== normalizedPath && isSymlinkEscape(expandedPath, realPath)) {
                    log(`[Sandbox Linux] Skipping symlink pointing outside: ${allowPath} -> ${realPath}`);
                    continue;
                }
            } catch {
                log(`[Sandbox Linux] Skipping unresolvable write path: ${expandedPath}`);
                continue;
            }

            // Mount as writable (override the read-only root)
            args.push("--bind", expandedPath, expandedPath);
            allowedWritePaths.push(expandedPath);
        }

        // A3: Process deny paths within allowed areas
        let denyPaths = [
            ...writeConfig.denyWithinAllow || [],
            ...await getMandatoryDenyPaths(ripgrepConfig, mandatoryDenySearchDepth, allowGitConfig, abortSignal)
        ];

        for (let denyPath of denyPaths) {
            let expandedPath = expandPath(denyPath);

            if (expandedPath.startsWith("/dev/")) continue;

            // Symlink attack prevention
            let symlinkMountPoint = findSymlinkMountPoint(expandedPath, allowedWritePaths);
            if (symlinkMountPoint) {
                // Mount /dev/null at symlink to prevent replacement attack
                args.push("--ro-bind", "/dev/null", symlinkMountPoint);
                log(`[Sandbox Linux] Mounted /dev/null at symlink ${symlinkMountPoint}`);
                continue;
            }

            // Handle non-existent deny paths
            if (!fs.existsSync(expandedPath)) {
                if (hasFileAncestor(expandedPath)) {
                    log(`[Sandbox Linux] Skipping deny with file ancestor: ${expandedPath}`);
                    continue;
                }

                // Find nearest existing ancestor
                let ancestor = path.dirname(expandedPath);
                while (ancestor !== "/" && !fs.existsSync(ancestor)) {
                    ancestor = path.dirname(ancestor);
                }

                // Only block if within allowed paths
                if (allowedWritePaths.some(p =>
                    ancestor.startsWith(p + "/") || ancestor === p ||
                    expandedPath.startsWith(p + "/")
                )) {
                    let blockMountPoint = findBestBlockPoint(expandedPath);
                    if (blockMountPoint !== expandedPath) {
                        let emptyDir = fs.mkdtempSync(path.join(TEMP_DIR, "claude-empty-"));
                        args.push("--ro-bind", emptyDir, blockMountPoint);
                        trackCreatedDir(blockMountPoint);
                        log(`[Sandbox Linux] Mounted empty dir at ${blockMountPoint}`);
                    } else {
                        args.push("--ro-bind", "/dev/null", blockMountPoint);
                        trackCreatedDir(blockMountPoint);
                        log(`[Sandbox Linux] Mounted /dev/null at ${blockMountPoint}`);
                    }
                }
                continue;
            }

            // Existing path within allowed area - make read-only
            if (allowedWritePaths.some(p =>
                expandedPath.startsWith(p + "/") || expandedPath === p
            )) {
                args.push("--ro-bind", expandedPath, expandedPath);
            }
        }
    } else {
        // No write restrictions - allow all writes
        args.push("--bind", "/", "/");
    }

    // =====================================================
    // PHASE B: Read Restriction Setup
    // =====================================================
    let readDenyPaths = [...readConfig?.denyOnly || []];

    // Always deny /etc/ssh/ssh_config.d (contains sensitive configs)
    if (fs.existsSync("/etc/ssh/ssh_config.d")) {
        readDenyPaths.push("/etc/ssh/ssh_config.d");
    }

    for (let denyPath of readDenyPaths) {
        let expandedPath = expandPath(denyPath);

        if (!fs.existsSync(expandedPath)) {
            log(`[Sandbox Linux] Skipping non-existent read deny: ${expandedPath}`);
            continue;
        }

        if (fs.statSync(expandedPath).isDirectory()) {
            // Mount empty tmpfs to hide directory contents
            args.push("--tmpfs", expandedPath);
        } else {
            // Mount /dev/null to hide file (reads return empty)
            args.push("--ro-bind", "/dev/null", expandedPath);
        }
    }

    return args;
}

// Mapping: Rb3→generateBwrapArgs, A→readConfig, q→writeConfig, w→args,
//          EL→expandPath, $→allowedWritePaths, yb3→getMandatoryDenyPaths
```

### Key Design Decisions

**1. Why `--ro-bind / /` Instead of Just Denying Writes?**

Bubblewrap doesn't have a native "deny all writes" flag. The approach is:
1. Mount the entire root filesystem as read-only (`--ro-bind / /`)
2. Then mount specific paths as writable (`--bind /path /path`)

This achieves deny-by-default for writes with explicit exceptions.

**2. Why Bind Unix Socket Bridges Into Sandbox?**

Network namespaces created by `--unshare-net` have zero network access. The HTTP/SOCKS proxy runs outside the sandbox. To allow sandboxed processes to use the proxy:
1. Proxy creates Unix domain sockets on the host
2. These sockets are bind-mounted into the sandbox
3. Environment variables point to the sockets
4. The sandboxed process connects to `localhost:3128` which routes through the bridge

**3. Why Seccomp for Unix Socket Blocking?**

Even with `--unshare-net`, processes can still create Unix domain sockets for local IPC. This could be used to:
- Communicate with Docker socket (`/var/run/docker.sock`)
- Access D-Bus over Unix socket
- Connect to other local services

Seccomp BPF filters block the `socket(AF_UNIX, ...)` syscall entirely.

**4. Why `--die-with-parent`?**

If Claude Code crashes, we want sandboxed processes to also terminate. Without this:
- Orphaned sandboxed processes could continue running
- Resource cleanup would never happen
- Security boundary would persist indefinitely

**5. Why Check for Symlink Attacks?**

An attacker with write access could:
1. Create a symlink: `ln -s /etc writable_dir/link`
2. Sandbox creates with `--ro-bind` on the directory
3. Attacker replaces symlink with real file after sandbox starts
4. Now attacker has write access to `/etc`

The fix: Mount `/dev/null` at symlink paths within writable areas.

### Example Generated Command

For a command with:
- Network restriction
- Write access to `/home/user/project`
- Deny write to `.env` files

```bash
bwrap \
  --new-session \
  --die-with-parent \
  --unshare-net \
  --ro-bind / / \
  --bind /home/user/project /home/user/project \
  --ro-bind /home/user/project/.env /home/user/project/.env \
  --dev /dev \
  --unshare-pid \
  --proc /proc \
  -- /bin/bash -c 'npm test'
```

---

## Symlink Attack Prevention Algorithm

### The Attack Vector

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Symlink Replacement Attack Vector                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Scenario: /home/user/project is writable (allowed)                         │
│                                                                              │
│  Step 1: Attacker creates symlink                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ $ ln -s /etc /home/user/project/link_to_etc                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Step 2: Sandbox starts (before bwrap executes)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ bwrap --ro-bind / / --bind /home/user/project /home/user/project    │    │
│  │                                                                      │    │
│  │ At this point, link_to_etc points to /etc (read-only)               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Step 3: Sandboxed process runs                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Process can write to /home/user/project/link_to_etc/passwd          │    │
│  │                                                                      │    │
│  │ WAIT! The symlink still points to /etc, which is read-only!         │    │
│  │ BUT: Attacker could replace the symlink with a real directory...    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  MITIGATION: Mount /dev/null at symlink paths                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ --ro-bind /dev/null /home/user/project/link_to_etc                  │    │
│  │                                                                      │    │
│  │ Now any attempt to access link_to_etc returns empty/error           │    │
│  │ Attacker cannot replace or use the symlink                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### findSymlinkMountPoint Function (Vb3)

**Location:** `chunks.55.mjs:2269-2291`

```javascript
// ============================================
// findSymlinkMountPoint - Detect symlink attack vector
// Location: chunks.55.mjs:2269-2291
// ============================================

// READABLE (for understanding):
function findSymlinkMountPoint(denyPath, allowedWritePaths) {
    // Check if denyPath is within any writable path
    for (let writePath of allowedWritePaths) {
        if (!denyPath.startsWith(writePath + "/")) continue;

        // Check if denyPath itself is a symlink
        try {
            let stat = fs.lstatSync(denyPath);
            if (stat.isSymbolicLink()) {
                return denyPath;  // Mount /dev/null here
            }
        } catch {
            // Path doesn't exist - check parent chain
        }

        // Check if any parent is a symlink within writable area
        let currentPath = denyPath;
        while (currentPath !== writePath) {
            let parentPath = path.dirname(currentPath);
            if (parentPath === currentPath) break;  // Reached root

            try {
                let parentStat = fs.lstatSync(parentPath);
                if (parentStat.isSymbolicLink()) {
                    return parentPath;  // Found symlink in chain
                }
            } catch {}

            currentPath = parentPath;
        }
    }

    return null;  // No symlink attack vector found
}

// Mapping: Vb3→findSymlinkMountPoint, $2→fs, IJ→path
```

---

## Bridge Wrapper Command (Lb3) - Network Namespace Setup

### Location: chunks.55.mjs:2474-2489

```javascript
// ============================================
// buildBridgeWrapperCommand - Wrap command with socat bridges inside sandbox
// Location: chunks.55.mjs:2474-2489
// ============================================

// ORIGINAL (for source lookup):
function Lb3(A, q, K, Y, z, _) {
    let w = [f21(3128, 1080).flatMap((H) => {
        let j = H.indexOf("="),
            J = H.slice(0, j),
            M = H.slice(j + 1);
        return ["export", `${J}=${M}`]
    }).join(" ")],
        O = _ ? hZ7(_) : void 0;
    if (Y) {
        let H = gq6.default.quote([O ?? "apply-seccomp", Y, z, "-c", K]);
        w.push(H);
        let j = [...w, "eval " + gq6.default.quote([K])].join("\n");
        return `${z} -c ${gq6.default.quote([j])}`
    } else {
        let H = [...w, `eval ${gq6.default.quote([K])}`].join("\n");
        return `${z} -c ${gq6.default.quote([H])}`
    }
}

// READABLE (for understanding):
function buildBridgeWrapperCommand(
    httpSocketPath,      // Unix socket for HTTP proxy
    socksSocketPath,     // Unix socket for SOCKS proxy
    command,             // The actual command to run
    seccompBpfPath,      // Optional: seccomp BPF filter file
    shellPath,           // Shell binary path
    applySeccompPath     // Optional: path to apply-seccomp binary
) {
    // Step 1: Build proxy environment variable exports
    let proxyEnvExports = buildProxyEnvVars(3128, 1080).flatMap(env => {
        let equalsIndex = env.indexOf("=");
        let key = env.slice(0, equalsIndex);
        let value = env.slice(equalsIndex + 1);
        return ["export", `${key}=${value}`];
    }).join(" ");

    // Initialize command array with proxy exports
    let wrappedCommands = [proxyEnvExports];

    // Step 2: Determine apply-seccomp path
    let actualApplyPath = applySeccompPath
        ? resolveBinary(applySeccompPath)
        : undefined;

    // Step 3: Build the wrapped command
    if (seccompBpfPath) {
        // With seccomp: apply filter before running command
        let seccompCommand = shellQuote([
            actualApplyPath ?? "apply-seccomp",
            seccompBpfPath,
            shellPath,
            "-c",
            command
        ]);
        wrappedCommands.push(seccompCommand);

        // Full wrapper script
        let wrapperScript = [
            ...wrappedCommands,
            "eval " + shellQuote([command])
        ].join("\n");

        return `${shellPath} -c ${shellQuote([wrapperScript])}`;
    } else {
        // Without seccomp: just run with proxy env
        let wrapperScript = [
            ...wrappedCommands,
            `eval ${shellQuote([command])}`
        ].join("\n");

        return `${shellPath} -c ${shellQuote([wrapperScript])}`;
    }
}

// Mapping: Lb3→buildBridgeWrapperCommand, A→httpSocketPath, q→socksSocketPath,
//          K→command, Y→seccompBpfPath, z→shellPath, _→applySeccompPath,
//          f21→buildProxyEnvVars, gq6→shellQuote, hZ7→resolveBinary
```

### Why Bridge Inside Sandbox?

When `--unshare-net` is used, the sandbox has NO network access. The bridge pattern works as follows:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Network Bridge Pattern Inside Sandbox                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Host (outside sandbox):                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ HTTP Proxy listening on localhost:3128                              │    │
│  │ SOCKS Proxy listening on localhost:1080                             │    │
│  │                                                                      │    │
│  │ socat bridges:                                                       │    │
│  │   /tmp/claude-http-xxx.sock → localhost:3128                        │    │
│  │   /tmp/claude-socks-xxx.sock → localhost:1080                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  2. bwrap --bind mounts sockets into sandbox:                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ --bind /tmp/claude-http-xxx.sock /tmp/claude-http-xxx.sock          │    │
│  │ --bind /tmp/claude-socks-xxx.sock /tmp/claude-socks-xxx.sock        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  3. Inside sandbox:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ export HTTP_PROXY=http://localhost:3128                             │    │
│  │ export SOCKS_PROXY=socks5://localhost:1080                          │    │
│  │                                                                      │    │
│  │ When process connects to localhost:3128:                            │    │
│  │   → Actually connects to /tmp/claude-http-xxx.sock                  │    │
│  │   → socat forwards to host's localhost:3128                         │    │
│  │   → Host proxy handles the request                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec implementation
- [network_proxy.md](./network_proxy.md) - HTTP/SOCKS proxy for network filtering
- [seccomp_filter.md](./seccomp_filter.md) - Seccomp BPF filter for Unix socket blocking
- [overview.md](./overview.md) - Sandbox architecture overview