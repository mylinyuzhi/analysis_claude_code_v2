# Sandbox Architecture (Claude Code 2.1.76)

## Overview

The sandbox system is a critical security boundary that restricts what commands executed by Claude can do to the host system. It operates at the OS level using platform-native isolation mechanisms -- macOS `sandbox-exec` (seatbelt) and Linux `bwrap` (bubblewrap) -- to enforce filesystem, network, and process restrictions on every bash command the model invokes.

> **⚠️ Symbol Correction (v2.1.76):** The actual sandbox config object is `vA` (chunks.56.mjs:516), not `b8` as previously documented. The symbol `b8` is used elsewhere in the codebase. The low-level sandbox module is `aO`, referenced from `vA`.
> **⚠️ Symbol Correction (v2.1.76):** `Ye8` at chunks.59.mjs:5105 is NOT wrapWithMacOSSandbox - it's React fiber commitWork code. The actual macOS sandbox wrapper is `QZ7` (chunks.55.mjs:2803).
> **⚠️ Symbol Correction (v2.1.76):** `FP5` at chunks.35.mjs:1456 is NOT buildSeatbeltProfile - it's an AWS credential provider function. The actual seatbelt profile builder is `xb3` (chunks.55.mjs:2755).
> **⚠️ Symbol Correction (v2.1.76):** `nBY` at chunks.149.mjs:1935 is NOT getSandboxSystemPromptBlock - it's getCacheSafeParams. The actual getSandboxSystemPromptBlock is `E9z` (chunks.171.mjs:1892).

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated - Public API facade |
| `QZ7` | wrapWithMacOSSandbox | chunks.55.mjs:2803 | ✅ Validated - macOS sandbox-exec wrapper |
| `xb3` | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated - SBPL profile generator |
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated - Linux bwrap wrapper |
| `HD6` | SandboxViolationStore | chunks.55.mjs:2902 | ✅ Validated - Ring buffer for violations |

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `wrapWithSandbox` (Xx3) - chunks.56.mjs:417 - Main dispatch: wraps a command string with platform-specific sandbox
- `wrapWithMacOSSandbox` (QZ7) - chunks.55.mjs:2803 - macOS seatbelt wrapper using sandbox-exec
- `generateSeatbeltProfile` (xb3) - chunks.55.mjs:2755 - Generates macOS sandbox-exec SBPL policy string
- `wrapWithLinuxSandbox` (uZ7) - chunks.55.mjs:2564 - Linux bwrap wrapper using bubblewrap + seccomp
- `sandboxInitialize` (Px3) - chunks.56.mjs:424 - Bootstraps sandbox: starts proxy servers, log monitor
- `isSandboxingEnabled` (h21) - chunks.56.mjs:357 - Full gate: platform + deps + settings (public API via vA)
- `isCommandSandboxed` (Ti) - chunks.172.mjs:2454 - Per-command gate: enabled + not excluded + not override
- `isCommandInExcludedList` (Lzz) - chunks.173.mjs:2714 - Checks command against excludedCommands patterns
- `getSandboxSystemPromptBlock` (E9z) - chunks.171.mjs:1892 - Injects sandbox instructions into Bash tool system prompt
- `SandboxViolationStore` (HD6) - chunks.55.mjs:2902 - Ring buffer for tracking sandbox violations
- `startLogMonitor` (UZ7) - chunks.55.mjs:2843 - macOS log stream monitoring for sandbox violations

---

## Architecture Diagram

```
User or Agent Loop
       |
       v
  +-----------+
  | vA (API)  |  <-- sandboxConfigObject: public interface
  +-----------+
       |
  isSandboxingEnabled()?
       |
  +----+----+
  | YES     | NO --> command runs unsandboxed (if allowed)
  v
wrapWithSandbox(command, shell, overrides, abortSignal)
       |
  +----+----+
  |         |
  v         v
macOS     Linux
Ye8()     st8()
  |         |
  v         v
sandbox-exec -p <SBPL>   bwrap --unshare-net --ro-bind ... + seccomp
  |                            |
  v                            v
Network proxy (HTTP+SOCKS)   Network via Unix socket bridge
  |                            |
  v                            v
Command runs in restricted environment
```

---

## Platform-Specific Sandbox Implementations

### macOS Seatbelt (sandbox-exec)

**What it does:** Wraps every command with `sandbox-exec -p <profile>`, where the profile is a dynamically generated Scheme-like policy language (SBPL) that Apple's sandbox system enforces at the kernel level.

**How it works:**
1. `wrapWithSandbox` (eP5) detects platform as "macos" and calls `wrapWithMacOSSandbox` (Ye8)
2. Ye8 calls `buildSeatbeltProfile` (FP5) which constructs the full SBPL policy
3. The profile starts with `(deny default)` -- everything is denied by default
4. Selective `(allow ...)` rules are added for:
   - Process execution (fork, exec)
   - Specific Mach IPC services (fonts, logging, security)
   - Specific sysctl reads (hardware info, kernel version)
   - Network (only if allowed, via proxy ports)
   - File read/write (based on configured allow/deny paths)
5. The command is then wrapped: `env <proxy_vars> sandbox-exec -p <profile> <shell> -c <command>`

**Why this approach:**
- macOS `sandbox-exec` is the native kernel-level sandbox, same technology used for App Store apps
- SBPL policies are extremely granular (individual Mach services, specific sysctl names)
- The `(deny default)` approach is defense-in-depth: anything not explicitly allowed is blocked
- The policy explicitly allows Chrome sandbox policy essentials to avoid breaking dev tools

**Key insight:** The sandbox profile is enormous (100+ rules) because macOS processes need access to many system services even for simple operations. The developers had to carefully enumerate every Mach service, sysctl, and IOKit class that Node.js and common dev tools need.

```javascript
// ============================================
// wrapWithMacOSSandbox - Wraps command with macOS sandbox-exec
// Location: chunks.55.mjs:2803 (QZ7) - validated in v2.1.76
// ============================================

// ORIGINAL (for source lookup):
function QZ7(A) {
    let { command: q, needsNetworkRestriction: K, httpProxyPort: Y, socksProxyPort: z,
          readConfig: $, writeConfig: H, allowUnixSockets: _, allowAllUnixSockets: w,
          allowLocalBinding: O, allowPty: j, allowGitConfig: J = !1, binShell: D } = A,
        X = $ && $.denyOnly.length > 0;
    if (!K && !X && H === void 0) return q;
    let W = Cb3(q),
        Z = xb3({ readConfig: $, writeConfig: H, httpProxyPort: Y, ... }),
        G = f21(Y, z), f = D || "bash", v = JU(f);
    if (!v) throw Error(`Shell '${f}' not found in PATH`);
    let N = gZ7.default.quote(["env", ...G, "sandbox-exec", "-p", Z, v, "-c", q]);
    return N
}

// READABLE (for understanding):
function wrapWithMacOSSandbox(config) {
    let { command, needsNetworkRestriction, httpProxyPort, socksProxyPort,
          allowUnixSockets, allowAllUnixSockets, allowLocalBinding,
          readConfig, writeConfig, allowPty, allowGitConfig = false, binShell } = config;

    let hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
    // Early exit: if no restrictions needed at all, return command as-is
    if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) return command;

    let logTag = generateLogTag(command);
    let seatbeltProfile = generateSeatbeltProfile({ readConfig, writeConfig, httpProxyPort, ... });
    let proxyEnvVars = buildProxyEnvVars(httpProxyPort, socksProxyPort);
    let shell = binShell || "bash";
    let shellPath = which(shell);

    // Construct: env HTTP_PROXY=... sandbox-exec -p "<profile>" /bin/bash -c "<command>"
    return shellQuote(["env", ...proxyEnvVars, "sandbox-exec", "-p", seatbeltProfile, shellPath, "-c", command]);
}

// Mapping: QZ7→wrapWithMacOSSandbox, A→config, xb3→generateSeatbeltProfile, f21→buildProxyEnvVars,
//          Cb3→generateLogTag, JU→which, gZ7→shellQuote
```

> **Note:** The previously documented `Ye8` at chunks.59.mjs:5105 is NOT wrapWithMacOSSandbox. That is React fiber commitWork code. The correct symbol is `QZ7` at chunks.55.mjs:2803.

### Linux Bubblewrap (bwrap) + Seccomp

**What it does:** Wraps commands using `bwrap` with namespace isolation (network, filesystem) and optionally applies seccomp BPF filters to block Unix socket creation.

**How it works:**
1. `wrapWithSandbox` (Xx3) detects platform and delegates to `ob3` (low-level wrapWithSandbox)
2. Low-level `ob3` routes to platform-specific implementation:
   - macOS → `QZ7` (wrapWithMacOSSandbox)
   - Linux → `uZ7` (wrapWithLinuxSandbox)
3. For filesystem isolation:
   - If `writeConfig.allowOnly` is specified, each path is `--bind` mounted (writable)
   - Deny paths within allowed paths get `--ro-bind` (read-only)
   - Symlink replacement attacks are mitigated by mounting `/dev/null` at symlink targets
   - If no allowOnly, `--bind / /` makes everything writable (less restrictive)
3. For read restrictions, deny paths are mounted as `--tmpfs` (directories) or `--ro-bind /dev/null` (files)
4. For network isolation:
   - `--unshare-net` creates a new network namespace (no network access)
   - HTTP/SOCKS bridge sockets are bind-mounted into the namespace
   - Proxy env vars route traffic through these bridges
5. For Unix socket blocking:
   - A pre-generated BPF seccomp filter blocks `socket(AF_UNIX, ...)` syscalls
   - The `apply-seccomp` binary loads the BPF filter before exec
   - Architecture-specific (x64, arm64); 32-bit x86 is explicitly unsupported due to `socketcall()` bypass

**Why this approach:**
- `bwrap` is the standard unprivileged sandbox on Linux (used by Flatpak)
- Network namespace isolation is absolute -- no traffic can leak
- The bridge socket pattern allows controlled outbound access through the proxy
- Seccomp BPF is necessary because bwrap alone cannot block Unix sockets (local IPC)

**Key insight:** The Linux sandbox has a symlink replacement attack mitigation. When a deny path is actually a symlink pointing into an allowed write directory, an attacker could replace the symlink target. The code detects this and mounts `/dev/null` at the symlink resolution to prevent writes.

```javascript
// ============================================
// wrapWithLinuxSandbox - Linux bwrap sandbox wrapper (COMPLETE)
// Location: chunks.55.mjs:2564-2648 (validated in v2.1.76)
// ============================================

// ORIGINAL (for source lookup):
async function uZ7(A) {
    let { command: q, needsNetworkRestriction: K, httpSocketPath: Y, socksSocketPath: z,
           httpProxyPort: _, socksProxyPort: w, readConfig: O, writeConfig: $,
           enableWeakerNestedSandbox: H, allowAllUnixSockets: j, binShell: J,
           ripgrepConfig: M = { command: "rg" }, mandatoryDenySearchDepth: D = Rw8,
           allowGitConfig: X = !1, seccompConfig: P, abortSignal: W } = A,
        Z = O && O.denyOnly.length > 0, G = $ !== void 0;
    if (!K && !Z && !G) return q;
    let f = ["--new-session", "--die-with-parent"], v = void 0;
    try {
        if (!j) {
            v = RZ7(P?.bpfPath) ?? void 0;
            let u = Ex6(P?.applyPath);
            if (!v || !u) wA("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled...", { level: "warn" }), v = void 0;
            else { /* generate seccomp BPF filter */ }
        }
        if (K) {
            if (f.push("--unshare-net"), Y && z) {
                if (!$2.existsSync(Y)) throw Error(`Linux HTTP bridge socket does not exist: ${Y}`);
                if (!$2.existsSync(z)) throw Error(`Linux SOCKS bridge socket does not exist: ${z}`);
                f.push("--bind", Y, Y), f.push("--bind", z, z);
                let u = f21(3128, 1080); // Build proxy env vars
                f.push(...u.flatMap((I) => { let g = I.indexOf("="), B = I.slice(0, g), b = I.slice(g + 1); return ["--setenv", B, b] }));
            }
        }
        let N = await Rb3(O, $, M, D, X, W); // Build filesystem mounts
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
    } catch (N) { /* cleanup and rethrow */ }
}

// READABLE (for understanding):
async function wrapWithLinuxSandbox(config) {
    let { command, needsNetworkRestriction, httpSocketPath, socksSocketPath,
           httpProxyPort, socksProxyPort, readConfig, writeConfig,
           enableWeakerNestedSandbox, allowAllUnixSockets, binShell,
           ripgrepConfig = { command: "rg" }, seccompConfig, abortSignal } = config;

    let hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
    let hasWriteConfig = writeConfig !== undefined;

    // Early exit: if no restrictions needed, return command as-is
    if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteConfig) {
        return command;
    }

    let bwrapArgs = ["--new-session", "--die-with-parent"];
    let bpfFilterPath = undefined;

    try {
        // 1. Seccomp filter setup (for Unix socket blocking)
        if (!allowAllUnixSockets) {
            bpfFilterPath = getSeccompBpfPath(seccompConfig?.bpfPath);
            let applyPath = getApplySeccompPath(seccompConfig?.applyPath);
            if (!bpfFilterPath || !applyPath) {
                logWarning("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled");
                bpfFilterPath = undefined;
            }
        }

        // 2. Network isolation: --unshare-net + bind bridge sockets
        if (needsNetworkRestriction) {
            bwrapArgs.push("--unshare-net");
            if (httpSocketPath && socksSocketPath) {
                if (!fs.existsSync(httpSocketPath)) {
                    throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}`);
                }
                if (!fs.existsSync(socksSocketPath)) {
                    throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}`);
                }
                // Bind bridge sockets into the network namespace
                bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
                bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);
                // Set proxy environment variables
                let proxyEnvVars = buildProxyEnvVars(3128, 1080);
                for (let envVar of proxyEnvVars) {
                    let [key, value] = envVar.split("=");
                    bwrapArgs.push("--setenv", key, value);
                }
            }
        }

        // 3. Filesystem isolation via bind mounts
        let filesystemMounts = await buildFilesystemMounts(readConfig, writeConfig, ripgrepConfig);
        bwrapArgs.push(...filesystemMounts);

        // 4. Process isolation
        bwrapArgs.push("--dev", "/dev");
        bwrapArgs.push("--unshare-pid");
        if (!enableWeakerNestedSandbox) {
            bwrapArgs.push("--proc", "/proc");
        }

        // 5. Shell and command setup
        let shell = binShell || "bash";
        let shellPath = which(shell);
        if (!shellPath) throw Error(`Shell '${shell}' not found in PATH`);

        bwrapArgs.push("--", shellPath, "-c");

        // 6. Final command construction with optional seccomp
        if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
            // Wrap with bridge socket handling and seccomp
            let wrappedCommand = buildBridgeCommand(httpSocketPath, socksSocketPath, command, bpfFilterPath, shellPath);
            bwrapArgs.push(wrappedCommand);
        } else if (bpfFilterPath) {
            // Apply seccomp filter before executing command
            let applyPath = getApplySeccompPath();
            let seccompCommand = shellQuote([applyPath, bpfFilterPath, shellPath, "-c", command]);
            bwrapArgs.push(seccompCommand);
        } else {
            bwrapArgs.push(command);
        }

        return shellQuote(["bwrap", ...bwrapArgs]);
    } catch (error) {
        // Cleanup seccomp filter on error
        if (bpfFilterPath && !bpfFilterPath.includes("/vendor/seccomp/")) {
            cleanupSeccompFilter(bpfFilterPath);
        }
        throw error;
    }
}

// Mapping: uZ7→wrapWithLinuxSandbox, q→command, K→needsNetworkRestriction,
//          Y→httpSocketPath, z→socksSocketPath, f→bwrapArgs, v→bpfFilterPath,
//          RZ7→getSeccompBpfPath, Ex6→getApplySeccompPath, $2→fs, JU→which,
//          f21→buildProxyEnvVars, Rb3→buildFilesystemMounts, gq6→shellQuote
```

    return constructFinalCommand(bwrapArgs, command);
}

// Mapping: st8->wrapWithLinuxSandbox, q->command, K->needsNetworkRestriction, Y->httpSocketPath, z->socksSocketPath
```

---

## Sandbox Configuration System

### Two-Layer Architecture

The sandbox has a two-layer architecture:

| Layer | Symbol | Location | Purpose |
|-------|--------|----------|---------|
| Public API | `vA` | chunks.56.mjs:516 | Settings facade with initialization promise |
| Low-level | `aO` | chunks.55.mjs:3436 | Runtime-effective implementation |

```javascript
// ============================================
// sandboxConfigObject (vA) - Public sandbox API
// Location: chunks.56.mjs:516-547
// ============================================

// ORIGINAL (for source lookup):
vA = {
    initialize: Px3,
    isSandboxingEnabled: h21,
    isSandboxEnabledInSettings: TG7,
    isPlatformInEnabledList: vG7,
    isAutoAllowBashIfSandboxedEnabled: $x3,
    areUnsandboxedCommandsAllowed: Hx3,
    areSandboxSettingsLockedByPolicy: Jx3,
    setSandboxSettings: Mx3,
    getExcludedCommands: Dx3,
    wrapWithSandbox: Xx3,
    refreshConfig: Wx3,
    reset: Zx3,
    checkDependencies: pw8,
    getFsReadConfig: aO.getFsReadConfig,
    getFsWriteConfig: aO.getFsWriteConfig,
    getNetworkRestrictionConfig: aO.getNetworkRestrictionConfig,
    getIgnoreViolations: aO.getIgnoreViolations,
    getLinuxGlobPatternWarnings: jx3,
    isSupportedPlatform: Qw8,
    getAllowUnixSockets: aO.getAllowUnixSockets,
    getAllowLocalBinding: aO.getAllowLocalBinding,
    getEnableWeakerNestedSandbox: aO.getEnableWeakerNestedSandbox,
    getProxyPort: aO.getProxyPort,
    getSocksProxyPort: aO.getSocksProxyPort,
    getLinuxHttpSocketPath: aO.getLinuxHttpSocketPath,
    getLinuxSocksSocketPath: aO.getLinuxSocksSocketPath,
    waitForNetworkInitialization: aO.waitForNetworkInitialization,
    getSandboxViolationStore: aO.getSandboxViolationStore,
    annotateStderrWithSandboxFailures: aO.annotateStderrWithSandboxFailures,
    cleanupAfterCommand: aO.cleanupAfterCommand
}

// READABLE (for understanding):
sandboxConfigObject = {
    // Initialization
    initialize: initializeSandboxFromSettings,          // Px3
    reset: resetSandbox,                                // Zx3
    refreshConfig: refreshSandboxConfig,               // Wx3

    // Status checks
    isSandboxingEnabled: isSandboxingEnabled,          // h21
    isSandboxEnabledInSettings: isSandboxEnabledInSettings,  // TG7
    isPlatformInEnabledList: isPlatformInEnabledList,  // vG7
    isSupportedPlatform: isSupportedPlatform,          // Qw8
    checkDependencies: checkSandboxDependencies,       // pw8

    // Permission behavior
    isAutoAllowBashIfSandboxedEnabled: isAutoAllowBashIfSandboxedEnabled,  // $x3
    areUnsandboxedCommandsAllowed: areUnsandboxedCommandsAllowed,          // Hx3
    areSandboxSettingsLockedByPolicy: areSandboxSettingsLockedByPolicy,    // Jx3

    // Settings modification
    setSandboxSettings: setSandboxSettings,            // Mx3
    getExcludedCommands: getExcludedCommands,          // Dx3

    // Core operation
    wrapWithSandbox: wrapWithSandbox,                  // Xx3

    // Config accessors (delegated to aO)
    getFsReadConfig: aO.getFsReadConfig,
    getFsWriteConfig: aO.getFsWriteConfig,
    getNetworkRestrictionConfig: aO.getNetworkRestrictionConfig,
    // ... more delegated methods
}

// Mapping: vA→sandboxConfigObject, Px3→initializeSandboxFromSettings, h21→isSandboxingEnabled,
//          Xx3→wrapWithSandbox, aO→lowLevelSandboxModule
```

### Low-Level Sandbox Module (aO)

```javascript
// ============================================
// Low-level sandbox module (aO)
// Location: chunks.55.mjs:3436-3461
// ============================================

// READABLE (for understanding):
lowLevelSandboxModule = {
    initialize: pb3,                    // Initialize sandbox with config
    isSupportedPlatform: rZ7,           // Check if platform supports sandbox
    isSandboxingEnabled: Qb3,           // Check if sandbox is actually running
    checkDependencies: oZ7,             // Check bwrap, socat, seccomp

    // Config accessors
    getFsReadConfig: Ub3,               // { denyOnly: [...] }
    getFsWriteConfig: db3,              // { allowOnly: [...], denyWithinAllow: [...] }
    getNetworkRestrictionConfig: cb3,   // { allowedDomains, deniedDomains }
    getAllowUnixSockets: aZ7,
    getAllowLocalBinding: sZ7,
    getIgnoreViolations: tZ7,
    getEnableWeakerNestedSandbox: eZ7,

    // Proxy/network
    getProxyPort: AG7,
    getSocksProxyPort: qG7,
    getLinuxHttpSocketPath: KG7,
    getLinuxSocksSocketPath: YG7,
    waitForNetworkInitialization: zG7,

    // Core operation
    wrapWithSandbox: ob3,               // Platform-specific sandbox wrapping
    cleanupAfterCommand: _G7,
    reset: xw8,

    // Violations
    getSandboxViolationStore: tb3,
    annotateStderrWithSandboxFailures: eb3,

    // Config management
    getConfig: ab3,
    updateConfig: sb3
}

// Mapping: aO→lowLevelSandboxModule, ob3→wrapWithSandbox, Qb3→isSandboxingEnabled
```

### Configuration Parameters

The sandbox configuration (`c3` internal state variable) contains:

| Parameter | Purpose |
|-----------|---------|
| `sandbox.enabled` | Master switch (default: false) |
| `sandbox.autoAllowBashIfSandboxed` | Auto-approve bash commands when sandbox is on (default: true) |
| `sandbox.allowUnsandboxedCommands` | Allow fallback to unsandboxed execution (default: true) |
| `sandbox.enabledPlatforms` | Array of platforms to enable on (e.g., ["macos", "linux"]) |
| `sandbox.excludedCommands` | Glob patterns for commands that bypass sandbox |
| `filesystem.allowWrite` | Paths where write access is allowed |
| `filesystem.denyWrite` | Paths where write is denied even within allowed paths |
| `filesystem.denyRead` | Paths where read access is denied |
| `network.allowedDomains` | Domains allowed for outbound network access |
| `network.deniedDomains` | Domains explicitly blocked |
| `network.allowUnixSockets` | Specific Unix socket paths to allow |
| `network.allowAllUnixSockets` | Allow all Unix socket access |
| `network.allowLocalBinding` | Allow binding to localhost ports |
| `seccomp.bpfPath` | Custom path to BPF filter binary |
| `seccomp.applyPath` | Custom path to apply-seccomp binary |

### Auto-Allow Decision Logic

**What it does:** When sandbox is enabled and `autoAllowBashIfSandboxed` is true, bash commands are automatically approved without user confirmation -- the sandbox itself is the security boundary.

**How it works:**
1. Permission check flow in `zmA` (chunks.172.mjs:1404) first checks sandbox + auto-allow
2. If both enabled, calls `Ezz` which checks if the command would be sandboxed (`Sc(A)`)
3. If sandboxed, returns `{ behavior: "allow", decisionReason: "Auto-allowed with sandbox" }`
4. This bypasses the normal permission prompt entirely

**Why this approach:**
- The sandbox provides OS-level isolation, making the permission prompt redundant for sandboxed commands
- This dramatically improves UX -- users don't have to approve every `ls`, `cat`, or `npm install`
- The `excludedCommands` setting lets specific commands still run outside the sandbox (e.g., `npm run test:*`)

**Key insight:** The "dangerouslyDisableSandbox" parameter allows the model to explicitly request running outside the sandbox. When `allowUnsandboxedCommands` is "open" (fallback allowed), a failed sandboxed command can be retried unsandboxed. When "closed" (strict mode), commands must always run in the sandbox.

---

## Network Proxy Architecture

### Proxy Design

**What it does:** Since sandboxed commands have no direct network access, all outbound traffic is routed through HTTP and SOCKS proxy servers running in the parent (unsandboxed) process.

**How it works:**
1. During `sandboxInitialize` (lP5), two proxy servers are started:
   - HTTP proxy via `dP5` (listening on localhost, random port)
   - SOCKS proxy via `cP5` (listening on localhost, random port)
2. On macOS: proxy ports are allowed through the seatbelt profile; env vars point to `localhost:<port>`
3. On Linux: bridge sockets are created and bind-mounted into the bwrap namespace; env vars point to the bridged ports
4. The proxy servers implement domain filtering via `isNetworkPermissionAllowed` (_e8):
   - Check `deniedDomains` first (immediate deny)
   - Check `allowedDomains` next (immediate allow)
   - If no match and callback available, prompt user
   - If no match and no callback, deny

**Why this approach:**
- Network namespace isolation (Linux) provides absolute network blocking
- macOS sandbox-exec network rules are less granular, so the proxy adds application-level control
- Domain-based filtering gives meaningful security without IP-level rules
- The SOCKS proxy handles non-HTTP protocols (git SSH, gRPC, etc.)

```javascript
// ============================================
// buildProxyEnvVars - Constructs proxy environment variables
// Location: chunks.44.mjs:2556-2567 (Ln 118660)
// ============================================

// ORIGINAL (for source lookup):
function $q6(A, q) {
    let Y = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR||"/tmp/claude"}`];
    if (!A && !q) return Y;
    let z = ["localhost", "127.0.0.1", "::1", "*.local", ".local", ...].join(",");
    Y.push(`NO_PROXY=${z}`);
    if (A) Y.push(`HTTP_PROXY=http://localhost:${A}`, `HTTPS_PROXY=http://localhost:${A}`);
    if (q) {
        Y.push(`ALL_PROXY=socks5h://localhost:${q}`);
        if (wL() === "macos") Y.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${q} %h %p'`);
        Y.push(`DOCKER_HTTP_PROXY=...`, `GRPC_PROXY=...`);
    }
    return Y
}

// READABLE (for understanding):
function buildProxyEnvVars(httpProxyPort, socksProxyPort) {
    let envVars = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR || "/tmp/claude"}`];
    if (!httpProxyPort && !socksProxyPort) return envVars;

    // Local addresses bypass the proxy entirely
    let noProxyHosts = ["localhost", "127.0.0.1", "::1", "*.local", ".local",
                        "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
    envVars.push(`NO_PROXY=${noProxyHosts}`);

    // HTTP proxy for standard HTTP/HTTPS traffic
    if (httpProxyPort) {
        envVars.push(`HTTP_PROXY=http://localhost:${httpProxyPort}`);
        envVars.push(`HTTPS_PROXY=http://localhost:${httpProxyPort}`);
    }

    // SOCKS proxy for everything else (SSH, gRPC, FTP, etc.)
    if (socksProxyPort) {
        envVars.push(`ALL_PROXY=socks5h://localhost:${socksProxyPort}`);
        // Special: Git SSH must be explicitly configured to use SOCKS
        if (getPlatform() === "macos") {
            envVars.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${socksProxyPort} %h %p'`);
        }
    }

    return envVars;
}

// Mapping: $q6->buildProxyEnvVars, A->httpProxyPort, q->socksProxyPort, wL->getPlatform
```

---

## macOS Sandbox Log Monitor

### Violation Detection

**What it does:** On macOS, monitors the system log in real time for sandbox deny events, matching them back to specific commands. This powers the violation counter shown in the UI and the `<sandbox_violations>` annotations added to stderr.

**How it works:**
1. `startMacOSLogMonitor` (ze8) spawns `log stream --predicate '...'` filtered for sandbox deny messages
2. Each deny event is parsed to extract:
   - The violation description (e.g., `Sandbox: file-write* deny /etc/passwd`)
   - The encoded command identifier (base64 of first 100 chars)
3. Violations are stored in `SandboxViolationStore` (dy1) -- a ring buffer capped at 100 entries
4. When a command's stderr is returned, `annotateStderrWithSandboxFailures` (YW5) appends `<sandbox_violations>...</sandbox_violations>` tags
5. Certain benign violations are filtered out (mDNSResponder, diagnosticd, analyticsd)

**Why this approach:**
- macOS sandbox-exec does not provide a programmatic API for violations
- The system log is the only way to detect what was blocked
- The command encoding (base64 of first 100 chars) allows correlating violations to specific commands
- This data is critical for users to understand why their commands are failing

**Key insight:** The log tag is a random string `_<random>_SBX` appended to sandbox-exec messages. This uniqueness prevents picking up violations from other processes using sandbox-exec on the same machine.

---

## .claude/skills Blocking

The sandbox system does **not** specifically block `.claude/skills` paths. Instead, the filesystem deny/allow configuration is general-purpose:

1. Write access defaults to allowing `/dev/stdout`, `/dev/stderr`, `/dev/null`, `/tmp/claude`, and `~/.npm/_logs`
2. The `denyWrite` configuration can block sensitive paths like `~/.bashrc`, `~/.ssh/*`, etc.
3. The `denyRead` configuration can prevent reading sensitive files
4. The `.claude` directory itself is typically within the project root (allowed for write)

The interaction between sandbox and skills is indirect: when skills execute bash commands, those commands go through the same sandbox wrapping. The skill itself is loaded in the unsandboxed parent process, but any tool execution it triggers is sandboxed.

---

## Seccomp BPF Filter Architecture

### Unix Socket Blocking

**What it does:** Prevents sandboxed processes from creating Unix domain sockets, which could be used to escape network isolation by communicating with services outside the namespace.

**How it works:**
1. Pre-generated BPF filters exist for x64 and arm64 architectures
2. The `apply-seccomp` binary loads the BPF filter via `seccomp(2)` system call, then execs the target command
3. The filter blocks `socket(AF_UNIX, ...)` syscalls specifically
4. If the filter or binary is not found, the sandbox degrades gracefully but logs a warning

**Why this approach:**
- bwrap's `--unshare-net` blocks TCP/UDP but not Unix domain sockets
- Unix sockets can communicate with any service on the host via `/run`, `/var/run`, or `/tmp`
- Seccomp BPF is the only way to block specific syscall arguments at the kernel level
- Pre-generated filters avoid the need for a C compiler at runtime

**Key insight:** 32-bit x86 is explicitly unsupported because it uses the `socketcall()` multiplexer syscall instead of individual `socket()`/`connect()`/etc. syscalls. Blocking `socketcall()` entirely would break all networking, so the filter cannot selectively block AF_UNIX on that architecture.

---

## Cleanup and Lifecycle

The sandbox has careful cleanup logic in `reset` (u8A):

1. Stops the macOS log monitor process
2. On Linux, terminates HTTP and SOCKS bridge processes (SIGTERM, then SIGKILL after 5s)
3. Removes bridge socket files
4. Closes HTTP and SOCKS proxy servers
5. Clears all internal state

This cleanup is registered on `exit`, `SIGINT`, and `SIGTERM` via `registerCleanup` (UP5) to prevent orphaned processes and socket files.

---

## Settings Management Layer

### Three-Layer Settings Architecture

The sandbox has three layers of settings management on top of the low-level `hO` module:

| Layer | Location | Purpose |
|-------|----------|---------|
| Low-level config | `c3` in chunks.44/45 | Runtime-effective sandbox config (filesystem, network, seccomp) |
| Settings API | `chunks.46.mjs` | Reads from unified settings, builds `c3`; provides `setSandboxSettings()` |
| Public object | `b8` in chunks.47.mjs | Single facade used by all callers; adds initialization promise, settings reactivity |

### buildSandboxConfigFromSettings

**What it does:** Transforms the user-facing settings (which mix permissions, network rules, etc.) into the internal sandbox config format understood by `hO.initialize()`.

**How it works:**
1. Reads `network.allowedDomains` from settings, but if `isManagedDomainsPolicy()` (KC1) is true, ignores local settings and reads only from `policySettings` instead
2. Scans all permission allow/deny rules for `domain:` prefixed rules and extracts the domains
3. Collects filesystem allow/deny paths from:
   - Settings files paths themselves (settings files must always be writable)
   - `.claude/skills` directory (skill definitions)
   - Git worktree paths (detected by reading `.git` file content)
   - `additionalDirectories` from permissions
   - All permission `allow` rules for Write tool → added to `allowWrite`
   - All permission `deny` rules for Write tool → added to `denyWrite`
   - All permission `deny` rules for Read tool → added to `denyRead`
4. Always adds project directory `.` and home directory to `allowWrite`
5. Returns structured config with `filesystem`, `network`, `ignoreViolations`, `ripgrep`

```javascript
// ============================================
// buildSandboxConfigFromSettings - Translates user settings to sandbox config
// Location: chunks.46.mjs:2697-2790 (Ln 123568)
// ============================================

// ORIGINAL (for source lookup):
function n8A(A) {
    let q = A.permissions || {}, K = [], Y = [];
    if (KC1()) { /* read only from policySettings for allowedDomains */ }
    else { /* read from A.sandbox.network.allowedDomains and permission allow rules */ }
    for (let j of q.deny || []) { /* extract domain: deniedDomains */ }
    let z = [".", YC1()], w = [], H = [];  // z=allowWrite, w=denyWrite, H=denyRead
    // ... collect settings file paths, skills paths, git worktree paths
    // ... scan all permission rules for file path rules
    return { network: {...}, filesystem: { denyRead: H, allowWrite: z, denyWrite: w }, ... }
}

// READABLE (for understanding):
function buildSandboxConfigFromSettings(settings) {
    let permissions = settings.permissions || {};
    let allowedDomains = [], deniedDomains = [];

    // If managed domains policy: only use policy-level domains
    if (isManagedDomainsPolicy()) {
        let policySettings = getSettingsLayer("policySettings");
        allowedDomains = policySettings?.sandbox?.network?.allowedDomains || [];
        // Also extract from policySettings permission allow rules
    } else {
        allowedDomains = settings.sandbox?.network?.allowedDomains || [];
        // Also extract domain: prefix from permission allow rules
    }
    // Extract domain: prefix from permission deny rules
    for (let rule of permissions.deny || []) {
        let parsed = parsePermissionRule(rule);
        if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:"))
            deniedDomains.push(parsed.ruleContent.substring(7));
    }

    let allowWrite = [".", getHomeDirectory()];  // Always allow cwd and home
    let denyWrite = [];
    let denyRead = [];

    // Add settings file paths (must be writable for settings changes to work)
    let settingsFiles = SETTINGS_FILES.map(f => getSettingsPath(f)).filter(Boolean);
    allowWrite.push(...settingsFiles);
    allowWrite.push(joinPath(getRootDir(), ".claude", "skills"));  // skills dir

    // Detect git worktree: read .git file to find actual git dir
    // ... (adds additional working directories to allowWrite)

    // Scan permission rules for file path rules
    for (let settingsSource of SETTINGS_SOURCES) {
        let layerSettings = getSettingsLayer(settingsSource);
        if (!layerSettings?.permissions) continue;
        for (let rule of layerSettings.permissions.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "Write" && parsed.ruleContent)
                allowWrite.push(resolvePathFromSettings(parsed.ruleContent, settingsSource));
        }
        for (let rule of layerSettings.permissions.deny || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "Write" && parsed.ruleContent)
                denyWrite.push(resolvePathFromSettings(parsed.ruleContent, settingsSource));
            if (parsed.toolName === "Read" && parsed.ruleContent)
                denyRead.push(resolvePathFromSettings(parsed.ruleContent, settingsSource));
        }
    }

    return {
        network: {
            allowedDomains, deniedDomains,
            allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: settings.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: settings.sandbox?.network?.allowLocalBinding,
            httpProxyPort: settings.sandbox?.network?.httpProxyPort,
            socksProxyPort: settings.sandbox?.network?.socksProxyPort
        },
        filesystem: { denyRead, allowWrite, denyWrite },
        ignoreViolations: settings.sandbox?.ignoreViolations,
        ripgrep: settings.sandbox?.ripgrep || getRipgrepConfig()
    };
}

// Mapping: n8A->buildSandboxConfigFromSettings, A->settings, KC1->isManagedDomainsPolicy
```

**Key insight:** Permission rules for the `Write` and `Read` tools are automatically mirrored into the sandbox filesystem config. This means when a user adds `*.write: /some/path` to their permissions, the sandbox also allows writing there. The two systems stay in sync without requiring separate sandbox configuration.

---

## isCommandSandboxed Decision Logic

### Per-Command Gate (Ti)

**What it does:** Determines whether a specific bash command invocation should be wrapped in the sandbox. Called just before `wrapWithSandbox()` and also by the permission check system.

**Location:** chunks.172.mjs:2454-2460 (actual location, previously documented incorrectly as `Sc`)

```javascript
// ============================================
// isCommandSandboxed - Per-command sandbox gate
// Location: chunks.172.mjs:2454-2460 (Ln 443666)
// ============================================

// ORIGINAL (for source lookup):
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}

// READABLE (for understanding):
function isCommandSandboxed(toolInput) {
    if (!sandboxConfig.isSandboxingEnabled()) return false;           // Gate 1: global sandbox off
    if (toolInput.dangerouslyDisableSandbox && sandboxConfig.areUnsandboxedCommandsAllowed()) return false; // Gate 2: model override
    if (!toolInput.command) return false;                              // Gate 3: no command string
    if (isCommandInExcludedList(toolInput.command)) return false;      // Gate 4: excluded pattern
    return true;
}

// Mapping: Ti→isCommandSandboxed, A→toolInput, vA→sandboxConfig, yYz→isCommandInExcludedList
```

**The 4 gates (in order):**
1. **Global switch**: `isSandboxingEnabled()` → false means sandbox is off entirely (disabled in settings, unsupported platform, or deps missing)
2. **Model override**: `dangerouslyDisableSandbox: true` in the tool input + `areUnsandboxedCommandsAllowed()` = true (open mode). In closed mode, this gate is skipped -- the model cannot bypass.
3. **Empty command**: Defensive check to avoid wrapping empty strings
4. **Excluded list**: `isCommandInExcludedList()` (yYz) -- command matches a user-defined exclusion pattern

### wrapWithSandbox (ob3) - Platform-Specific Routing

**What it does:** The low-level sandbox wrapper that builds configuration and routes to platform-specific implementations.

**Location:** chunks.55.mjs:3208-3274

```javascript
// ============================================
// wrapWithSandbox (ob3) - Platform-specific sandbox routing
// Location: chunks.55.mjs:3208-3274
// ============================================

// ORIGINAL (for source lookup):
async function ob3(A, q, K, Y) {
    let z = $v(),  // getPlatform()
        _ = (P) => P.map((W) => mq6(W)).filter((W) => {
            if ($v() === "linux" && zk(W)) return wA(`[Sandbox] Skipping glob write pattern on Linux: ${W}`), !1;
            return !0
        }),
        w = _(K?.filesystem?.allowWrite ?? R5?.filesystem.allowWrite ?? []),
        O = {
            allowOnly: [...kx6(), ...w],
            denyWithinAllow: _(K?.filesystem?.denyWrite ?? R5?.filesystem.denyWrite ?? [])
        },
        $ = K?.filesystem?.denyRead ?? R5?.filesystem.denyRead ?? [],
        H = [];
    for (let P of $) {
        let W = mq6(P);
        if ($v() === "linux" && zk(W)) H.push(...Gw8(P));
        else H.push(W)
    }
    let j = { denyOnly: H },
        J = K?.network?.allowedDomains !== void 0 || R5?.network?.allowedDomains !== void 0,
        M = J, D = J;
    if (D) await zG7();  // waitForNetworkInitialization()
    let X = K?.allowPty ?? R5?.allowPty;
    switch (z) {
        case "macos":
            return QZ7({ command: A, needsNetworkRestriction: M, httpProxyPort: D ? AG7() : void 0,
                socksProxyPort: D ? qG7() : void 0, readConfig: j, writeConfig: O, ... });
        case "linux":
            return uZ7({ command: A, needsNetworkRestriction: M, httpSocketPath: D ? KG7() : void 0,
                socksSocketPath: D ? YG7() : void 0, readConfig: j, writeConfig: O, ... });
        default:
            throw Error(`Sandbox configuration is not supported on platform: ${z}`)
    }
}

// READABLE (for understanding):
async function wrapWithSandbox(command, shell, overrides, abortSignal) {
    const platform = getPlatform();  // $v()

    // Build write config: { allowOnly: [...], denyWithinAllow: [...] }
    const allowWritePaths = resolvePaths(overrides?.filesystem?.allowWrite ?? config?.filesystem.allowWrite ?? []);
    const writeConfig = {
        allowOnly: [...getDefaultAllowedPaths(), ...allowWritePaths],
        denyWithinAllow: resolvePaths(overrides?.filesystem?.denyWrite ?? config?.filesystem.denyWrite ?? [])
    };

    // Build read config: { denyOnly: [...] }
    const denyReadPaths = [];
    for (const path of overrides?.filesystem?.denyRead ?? config?.filesystem.denyRead ?? []) {
        const resolved = resolvePath(path);
        // On Linux, glob patterns expand to multiple paths
        if (platform === "linux" && isGlobPattern(resolved)) {
            denyReadPaths.push(...expandGlobPattern(path));
        } else {
            denyReadPaths.push(resolved);
        }
    }
    const readConfig = { denyOnly: denyReadPaths };

    // Determine if network restrictions apply
    const hasAllowedDomains = overrides?.network?.allowedDomains !== undefined ||
                               config?.network?.allowedDomains !== undefined;
    const needsNetworkRestriction = hasAllowedDomains;

    // Wait for proxy servers to be ready if network restriction is needed
    if (needsNetworkRestriction) {
        await waitForNetworkInitialization();
    }

    const allowPty = overrides?.allowPty ?? config?.allowPty;

    // Route to platform-specific implementation
    switch (platform) {
        case "macos":
            return wrapWithMacOSSandbox({
                command,
                needsNetworkRestriction,
                httpProxyPort: needsNetworkRestriction ? getProxyPort() : undefined,
                socksProxyPort: needsNetworkRestriction ? getSocksProxyPort() : undefined,
                readConfig,
                writeConfig,
                allowUnixSockets: getAllowUnixSockets(),
                allowAllUnixSockets: getAllowAllUnixSockets(),
                allowLocalBinding: getAllowLocalBinding(),
                ignoreViolations: getIgnoreViolations(),
                allowPty,
                allowGitConfig: getAllowGitConfig(),
                enableWeakerNetworkIsolation: getEnableWeakerNetworkIsolation(),
                binShell: shell
            });

        case "linux":
            return wrapWithLinuxSandbox({
                command,
                needsNetworkRestriction,
                httpSocketPath: needsNetworkRestriction ? getLinuxHttpSocketPath() : undefined,
                socksSocketPath: needsNetworkRestriction ? getLinuxSocksSocketPath() : undefined,
                httpProxyPort: needsNetworkRestriction ? config?.httpProxyPort : undefined,
                socksProxyPort: needsNetworkRestriction ? config?.socksProxyPort : undefined,
                readConfig,
                writeConfig,
                enableWeakerNestedSandbox: getEnableWeakerNestedSandbox(),
                allowAllUnixSockets: getAllowAllUnixSockets(),
                binShell: shell,
                ripgrepConfig: getRipgrepConfig(),
                mandatoryDenySearchDepth: getMandatoryDenySearchDepth(),
                allowGitConfig: getAllowGitConfig(),
                seccompConfig: getSeccompConfig(),
                abortSignal
            });

        default:
            throw new Error(`Sandbox configuration is not supported on platform: ${platform}`);
    }
}

// Mapping: ob3→wrapWithSandbox, $v→getPlatform, QZ7→wrapWithMacOSSandbox, uZ7→wrapWithLinuxSandbox,
//          zG7→waitForNetworkInitialization, AG7→getProxyPort, qG7→getSocksProxyPort
```

### Key Algorithm: Config Preparation

**What it does:** Before wrapping, the function resolves all paths and handles platform-specific quirks.

**Steps:**
1. **Resolve paths:** All path patterns are resolved to absolute paths via `mq6()`
2. **Linux glob handling:** On Linux, glob patterns in deny lists expand to individual paths
3. **Build write config:** Combines default allowed paths (cwd, home, settings files) with user-specified paths
4. **Build read config:** Only contains deny paths (no "allow only" for reads)
5. **Network check:** If `allowedDomains` is set, network restriction is enabled

**Why Linux glob expansion matters:** Linux bwrap doesn't support shell glob patterns in mount arguments. The code must expand `*.log` to individual file paths before constructing the bwrap command.

### excludedCommands Pattern Matching (Lzz)

**What it does:** Checks if a command matches any pattern in `settings.sandbox.excludedCommands`.

**How it works:**

```javascript
// ============================================
// isCommandInExcludedList - Checks command against excludedCommands patterns
// Location: chunks.172.mjs:1741-1761 (Ln 443548)
// ============================================

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    let excludedCommands = getSettings().sandbox?.excludedCommands ?? [];
    if (excludedCommands.length === 0) return false;

    for (let pattern of excludedCommands) {
        let parsed = parseCommandPattern(pattern);  // ymA()
        switch (parsed.type) {
            case "exact":
                if (command.trim() === parsed.command) return true;
                break;
            case "prefix": {
                let trimmed = command.trim();
                // Match exact prefix OR prefix followed by space
                if (trimmed === parsed.prefix || trimmed.startsWith(parsed.prefix + " ")) return true;
                break;
            }
            case "wildcard":
                if (wildcardMatch(parsed.pattern, command.trim())) return true;  // RmA()
                break;
        }
    }
    return false;
}

// Pattern parsing: ymA()
// Input: "npm run test:*"
// → type: "wildcard", pattern: "npm run test:*"
//
// Input: "my-exact-command"
// → type: "exact", command: "my-exact-command"
//
// Input: "git push:"   (via extractCommandPrefix WG5 - the ":*" suffix syntax)
// → type: "prefix", prefix: "git push"
```

**Three pattern types:**
- **exact**: String equality after trim. E.g., `"git status"` only matches `git status` exactly.
- **prefix**: Via the `command:*` syntax (`WG5` extracts the prefix). E.g., `"git push:*"` → prefix `"git push"` matches `git push`, `git push origin`, etc.
- **wildcard**: Shell-style glob matching via `RmA()`. E.g., `"npm run test:*"` matches any `npm run test:` followed by anything.

**Key insight:** The `extractCommandPrefix` function (WG5) handles the `:*` suffix syntax used by the `/sandbox exclude` command: `ae8("npm run test:*")` calls `WG5("npm run test:*")` which returns `"npm run test"` for prefix matching. This allows users to exclude entire families of commands with a single pattern.

---

## macOS Violation Correlation System

### Command Encoding

The macOS log monitor needs to correlate deny events (which come asynchronously from the kernel) back to specific commands. This is done via a two-part identifier:

```javascript
// ============================================
// buildCommandLogTag - Embeds command identifier in seatbelt profile
// Location: chunks.44.mjs:3045-3047 (Ln ~119045)
// ============================================

// ORIGINAL:
function uP5(A) { return `CMD64_${Oq6(A)}_END_${qe8}` }
function Oq6(A) { let q = A.slice(0, 100); return Buffer.from(q).toString("base64") }

// READABLE:
function buildCommandLogTag(command) {
    return `CMD64_${encodeCommandForViolation(command)}_END_${sandboxSessionId}`;
}
function encodeCommandForViolation(command) {
    return Buffer.from(command.slice(0, 100)).toString("base64");
}
```

**How the correlation works:**
1. `buildCommandLogTag(command)` creates a string like `CMD64_bHMgLWxh_END__abc12_SBX`
2. This tag is embedded in the seatbelt profile as a comment: `; LogTag: CMD64_..._END_...`
3. macOS sandbox-exec includes the tag in the log message when any deny occurs
4. `startMacOSLogMonitor` (ze8) streams `log stream --predicate '(eventMessage ENDSWITH "_SBX")'`
5. The monitor parses both:
   - The violation line: `Sandbox: file-write* deny /etc/passwd`
   - The tag line: `CMD64_bHMgLWxh_END__abc12_SBX`
6. Decodes `bHMgLWxh` → `ls -la` → associates this deny with the `ls -la` command

**The `sandboxSessionId` (qe8):**
- Generated once at module load: `_${Math.random().toString(36).slice(2,11)}_SBX`
- Used as a suffix so the `--predicate` filter only captures violations from THIS Claude instance
- Prevents picking up violations from other processes running `sandbox-exec` concurrently

**Violation filtering:**
Three types of violations are silently filtered out:
- `mDNSResponder` - routine DNS lookup denies (every process tries this)
- `mach-lookup com.apple.diagnosticd` - diagnostics daemon
- `mach-lookup com.apple.analyticsd` - analytics daemon

These are expected denies for any sandboxed process and are not actionable by users.

**`ignoreViolations` config:**
The `ignoreViolations` setting allows fine-grained suppression:
- `ignoreViolations["*"]` - array of violation substrings to always ignore
- `ignoreViolations["/path/to/command"]` - per-command ignore list (matched against decoded command)

---

## UI Linkage Summary

> Full UI documentation: [ui_linkage.md](ui_linkage.md)

The sandbox system integrates with UI at 6 points:

| UI Point | Component | Trigger |
|----------|-----------|---------|
| `/sandbox` command | `sandboxSlashCommandHandler` (oqz) | User types `/sandbox` |
| Status bar flash | `SandboxViolationStatusLine` (lWq) | New violations detected; auto-dismisses in 5s |
| Violation log | `SandboxViolationListPanel` (HLq) | Any violations exist; macOS only |
| Permission prompt title | Bash permission component (chunks.180) | `dangerouslyDisableSandbox: true` in input |
| Doctor check | `SandboxDoctorCheck` (Q7q) | `/doctor` command; shows dep errors/warnings |
| System prompt | `getSandboxSystemPromptBlock` (nBY) | Every LLM call when sandbox is enabled |

---

## Deep Algorithm Analysis

### SandboxViolationStore (HD6) - Ring Buffer for Violations

**What it does:** A singleton ring buffer class that stores sandbox violation events (macOS only). Provides O(1) add, O(n) filter, and subscriber-based notifications for UI updates.

**Location:** chunks.55.mjs:2902-2936

**Why this approach:**
- Ring buffer bounds memory usage (max 100 violations)
- Subscriber pattern enables reactive UI updates
- Per-command filtering allows displaying violations for specific commands

**Algorithm:**

```javascript
// ============================================
// SandboxViolationStore - Ring buffer for sandbox violations
// Location: chunks.55.mjs:2902-2936
// ============================================

// ORIGINAL (for source lookup):
class HD6 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(A) {
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize)
            this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(A) {
        if (A === void 0) return [...this.violations];
        return this.violations.slice(-A)
    }
    getCount() {
        return this.violations.length
    }
    getTotalCount() {
        return this.totalCount
    }
    getViolationsForCommand(A) {
        let q = T21(A);
        return this.violations.filter((K) => K.encodedCommand === q)
    }
    clear() {
        this.violations = [], this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), A(this.getViolations()), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        let A = this.getViolations();
        this.listeners.forEach((q) => q(A))
    }
}

// READABLE (for understanding):
class SandboxViolationStore {
    constructor() {
        this.violations = [];          // Ring buffer array
        this.totalCount = 0;           // Total violations ever (never reset)
        this.maxSize = 100;            // Ring buffer capacity
        this.listeners = new Set();    // Subscriber callbacks
    }

    // Add violation with ring buffer overflow handling
    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Ring buffer: keep only last maxSize items
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    // Get all or last N violations
    getViolations(count) {
        if (count === undefined) return [...this.violations];
        return this.violations.slice(-count);
    }

    // Current buffer size
    getCount() {
        return this.violations.length;
    }

    // Lifetime total (used for "N operations blocked" message)
    getTotalCount() {
        return this.totalCount;
    }

    // Filter violations for specific command (by encoded tag)
    getViolationsForCommand(encodedCommand) {
        let tag = encodeCommandTag(encodedCommand);
        return this.violations.filter(v => v.encodedCommand === tag);
    }

    // Clear buffer (but not totalCount)
    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    // Subscribe pattern: returns unsubscribe function
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Immediately notify with current state
        return () => {
            this.listeners.delete(callback);
        };
    }

    // Notify all subscribers
    notifyListeners() {
        let violations = this.getViolations();
        this.listeners.forEach(callback => callback(violations));
    }
}

// Mapping: HD6→SandboxViolationStore, T21→encodeCommandTag
```

**Key Design Decisions:**

| Decision | Rationale |
|----------|-----------|
| Ring buffer (max 100) | Bounds memory usage while keeping recent context |
| `totalCount` never reset | Accurate "N operations blocked" for session |
| Immediate callback on subscribe | Subscribers get initial state without race conditions |
| Per-command filtering | Allows showing violations for specific command execution |

**Violation Object Structure:**

```typescript
interface SandboxViolation {
    encodedCommand: string;    // Base64-encoded command tag
    operation: string;         // e.g., "file-write*", "network-outbound"
    path?: string;             // Target path (for filesystem violations)
    host?: string;             // Target host (for network violations)
    timestamp: number;         // Unix timestamp
}
```

---

### Seatbelt Profile Generation (xb3) - macOS SBPL Builder

**What it does:** Generates a complete macOS sandbox-exec Seatbelt profile (SBPL) from configuration parameters. The SBPL is a Lisp-like policy language that defines what operations are allowed/denied.

**Location:** chunks.55.mjs:2755-2787

**Why this approach:**
- Declarative policy generation from structured config
- Platform-specific optimizations (e.g., `trustd.agent` for Go TLS)
- Comprehensive sysctl allowlist for common operations

**Algorithm:**

```javascript
// ============================================
// generateSeatbeltProfile - macOS SBPL generator
// Location: chunks.55.mjs:2755-2787
// ============================================

// ORIGINAL (for source lookup):
function xb3({
    readConfig: A,
    writeConfig: q,
    httpProxyPort: K,
    socksProxyPort: Y,
    needsNetworkRestriction: z,
    allowUnixSockets: _,
    allowAllUnixSockets: w,
    allowLocalBinding: O,
    allowPty: $,
    allowGitConfig: H = !1,
    enableWeakerNetworkIsolation: j = !1,
    logTag: J
}) {
    let M = ["(version 1)", `(deny default (with message "${J}"))`, "", `; LogTag: ${J}`, "",
        "; Essential permissions - based on Chrome sandbox policy",
        "; Process permissions", "(allow process-exec)", "(allow process-fork)",
        "(allow process-info* (target same-sandbox))",
        "(allow signal (target same-sandbox))",
        "(allow mach-priv-task-port (target same-sandbox))",
        // ... extensive allowlist for mach-lookup, sysctl, etc.
    ];
    if (M.push("; Network"), !z) M.push("(allow network*)");
    else {
        // Network restrictions with proxy ports
        if (O) M.push('(allow network-bind (local ip "*:*"))');
        if (K !== void 0) M.push(`(allow network-bind (local ip "localhost:${K}"))`);
        if (Y !== void 0) M.push(`(allow network-bind (local ip "localhost:${Y}"))`);
    }
    // File read/write rules
    M.push(...generateFileReadRules(A, J));
    M.push(...generateFileWriteRules(q, J, H));
    return M.join("\n");
}

// READABLE (for understanding):
function generateSeatbeltProfile({
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    allowPty,
    allowGitConfig = false,
    enableWeakerNetworkIsolation = false,
    logTag
}) {
    let rules = [];

    // SBPL version and default deny
    rules.push("(version 1)");
    rules.push(`(deny default (with message "${logTag}"))`);
    rules.push("");
    rules.push(`; LogTag: ${logTag}`);
    rules.push("");

    // Essential process permissions
    rules.push("; Essential permissions - based on Chrome sandbox policy");
    rules.push("(allow process-exec)");
    rules.push("(allow process-fork)");
    rules.push("(allow process-info* (target same-sandbox))");
    rules.push("(allow signal (target same-sandbox))");
    rules.push("(allow mach-priv-task-port (target same-sandbox))");

    // User preferences
    rules.push("(allow user-preference-read)");

    // Mach IPC - specific services only (security)
    rules.push("(allow mach-lookup");
    rules.push('  (global-name "com.apple.audio.systemsoundserver")');
    rules.push('  (global-name "com.apple.FontObjectsServer")');
    rules.push('  (global-name "com.apple.securityd.xpc")');
    // ... more services
    rules.push(")");

    // POSIX IPC - shared memory and semaphores
    rules.push("(allow ipc-posix-shm)");
    rules.push("(allow ipc-posix-sem)");

    // IOKit - specific operations
    rules.push("(allow iokit-open");
    rules.push('  (iokit-registry-entry-class "IOSurfaceRootUserClient")');
    rules.push(")");

    // Sysctl - extensive allowlist
    rules.push("(allow sysctl-read");
    rules.push('  (sysctl-name "hw.ncpu")');
    rules.push('  (sysctl-name "kern.ostype")');
    // ... 50+ sysctl names
    rules.push(")");

    // Network rules
    rules.push("; Network");
    if (!needsNetworkRestriction) {
        rules.push("(allow network*)");  // Open mode
    } else {
        // Restricted mode with proxy ports
        if (allowLocalBinding) {
            rules.push('(allow network-bind (local ip "*:*"))');
            rules.push('(allow network-inbound (local ip "*:*"))');
            rules.push('(allow network-outbound (local ip "*:*"))');
        }
        if (allowAllUnixSockets) {
            rules.push("(allow system-socket (socket-domain AF_UNIX))");
        }
        if (httpProxyPort !== undefined) {
            rules.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
            rules.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
            rules.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
        }
        if (socksProxyPort !== undefined) {
            rules.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
        }
    }

    // File I/O rules
    rules.push("; File read");
    rules.push(...generateFileReadRules(readConfig, logTag));
    rules.push("; File write");
    rules.push(...generateFileWriteRules(writeConfig, logTag, allowGitConfig));

    // PTY support (for interactive commands)
    if (allowPty) {
        rules.push("; Pseudo-terminal (pty) support");
        rules.push("(allow pseudo-tty)");
        rules.push("(allow file-ioctl");
        rules.push('  (literal "/dev/ptmx")');
        rules.push(")");
    }

    return rules.join("\n");
}

// Mapping: xb3→generateSeatbeltProfile, A→readConfig, q→writeConfig, K→httpProxyPort,
//          Y→socksProxyPort, z→needsNetworkRestriction, _→allowUnixSockets,
//          w→allowAllUnixSockets, O→allowLocalBinding, $→allowPty, H→allowGitConfig,
//          j→enableWeakerNetworkIsolation, J→logTag, M→rules
```

**Key Design Decisions:**

| Decision | Rationale |
|----------|-----------|
| `deny default` + explicit allows | Default-deny is the secure posture |
| Specific mach-lookup services | Prevents access to privileged system services |
| Proxy port allowlisting | Sandbox's HTTP/SOCKS proxy needs explicit permission |
| Sysctl allowlist | Common sysctls needed for runtime introspection |
| PTY support optional | Interactive commands need pty, but it's a larger attack surface |

---

### Network Proxy Architecture

**What it does:** The sandbox runs local HTTP and SOCKS proxies that filter network requests based on domain allowlists/denylists. Commands running in the sandbox have `HTTP_PROXY` and `ALL_PROXY` environment variables pointing to these proxies.

**Flow:**

```
Sandboxed Command
    │ HTTP_PROXY=http://127.0.0.1:{port}
    ▼
Local HTTP Proxy (AG7)
    │ Check domain against allowlist/denylist
    ├─ Allowed → Forward request
    └─ Denied → Return error (logged as violation)
```

**Proxy Ports:**
- `httpProxyPort` - HTTP proxy port (AG7)
- `socksProxyPort` - SOCKS proxy port (qG7)

**Domain Matching:**

```javascript
// ============================================
// Domain matching for proxy filtering
// Location: chunks.55.mjs:2952-2958
// ============================================

// ORIGINAL (for source lookup):
function bw8(A, q) {
    if (q.startsWith("*.")) {
        let K = q.substring(2);
        return A.toLowerCase().endsWith("." + K.toLowerCase())
    }
    return A.toLowerCase() === q.toLowerCase()
}

// READABLE (for understanding):
function matchesDomain(host, pattern) {
    // Wildcard pattern: *.example.com matches sub.example.com
    if (pattern.startsWith("*.")) {
        let suffix = pattern.substring(2);
        return host.toLowerCase().endsWith("." + suffix.toLowerCase());
    }
    // Exact match
    return host.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchesDomain, A→host, q→pattern, K→suffix
```

**Why domain filtering:**
- Prevents data exfiltration to unauthorized hosts
- Allows fine-grained network policy (e.g., allow only `api.github.com`)
- MITM proxy support for TLS inspection on specific domains

---

## SandboxViolationStore (HD6) - Violation Ring Buffer

### What it does

A ring buffer class that stores sandbox violations detected by the macOS log monitor. Provides an observer pattern for UI updates.

### Location: chunks.55.mjs:2902-2936

```javascript
// ============================================
// SandboxViolationStore - Ring buffer for sandbox violations
// Location: chunks.55.mjs:2902-2936
// ============================================

// ORIGINAL (for source lookup):
class HD6 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(A) {
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize)
            this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(A) {
        if (A === void 0) return [...this.violations];
        return this.violations.slice(-A)
    }
    getCount() { return this.violations.length }
    getTotalCount() { return this.totalCount }
    getViolationsForCommand(A) {
        let q = T21(A);
        return this.violations.filter((K) => K.encodedCommand === q)
    }
    clear() { this.violations = [], this.notifyListeners() }
    subscribe(A) {
        return this.listeners.add(A), A(this.getViolations()), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        let A = this.getViolations();
        this.listeners.forEach((q) => q(A))
    }
}

// READABLE (for understanding):
class SandboxViolationStore {
    violations = [];          // Ring buffer of violations
    totalCount = 0;          // Total violations ever recorded
    maxSize = 100;           // Buffer capacity
    listeners = new Set();   // Observer callbacks

    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Ring buffer: trim to max size
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    getViolations(count) {
        if (count === undefined) return [...this.violations];
        return this.violations.slice(-count);  // Return last N
    }

    getCount() { return this.violations.length; }
    getTotalCount() { return this.totalCount; }

    // Get violations for a specific command (via encoded identifier)
    getViolationsForCommand(command) {
        let encodedCommand = encodeBase64(command);
        return this.violations.filter(v => v.encodedCommand === encodedCommand);
    }

    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    // Observer pattern for UI updates
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Immediate notification
        return () => this.listeners.delete(callback);  // Unsubscribe
    }

    notifyListeners() {
        const violations = this.getViolations();
        this.listeners.forEach(cb => cb(violations));
    }
}

// Mapping: HD6→SandboxViolationStore, A→violation/command, q→encodedCommand/count/callback,
//          T21→encodeBase64
```

### Key Design Decisions

**Why ring buffer:**
- Unbounded growth would consume memory
- 100 violations is enough for debugging current session
- `totalCount` preserves historical count even after trimming

**Why observer pattern:**
- UI components can react to new violations
- Status bar indicator updates in real-time
- Violation list panel refreshes automatically

**Why command encoding:**
- `log stream` output doesn't include process ID
- Base64 of first 100 chars provides unique correlation
- Multiple commands may run in parallel - encoding distinguishes them

---

## Network Permission Check (nZ7)

### What it does

Checks network requests against domain allowlist/denylist configuration. Called by the proxy servers for each outbound connection.

### Location: chunks.55.mjs:2960-2978

```javascript
// ============================================
// checkNetworkPermission - Domain-based network access control
// Location: chunks.55.mjs:2960-2978
// ============================================

// ORIGINAL (for source lookup):
async function nZ7(A, q, K) {
    if (!R5) return wA("No config available, denying network request"), !1;
    for (let Y of R5.network.deniedDomains)
        if (bw8(q, Y)) return wA(`Denied by config rule: ${q}:${A}`), !1;
    for (let Y of R5.network.allowedDomains)
        if (bw8(q, Y)) return wA(`Allowed by config rule: ${q}:${A}`), !0;
    if (!K) return wA(`No matching config rule, denying: ${q}:${A}`), !1;
    wA(`No matching config rule, asking user: ${q}:${A}`);
    try {
        if (await K({ host: q, port: A })) return wA(`User allowed: ${q}:${A}`), !0;
        else return wA(`User denied: ${q}:${A}`), !1
    } catch (Y) {
        return wA(`Error in permission callback: ${Y}`, { level: "error" }), !1
    }
}

// READABLE (for understanding):
async function checkNetworkPermission(port, host, permissionCallback) {
    // No config - deny by default
    if (!sandboxConfig) {
        logSandbox("No config available, denying network request");
        return false;
    }

    // Check deny list first (takes precedence)
    for (let deniedDomain of sandboxConfig.network.deniedDomains) {
        if (matchesDomain(host, deniedDomain)) {
            logSandbox(`Denied by config rule: ${host}:${port}`);
            return false;
        }
    }

    // Check allow list
    for (let allowedDomain of sandboxConfig.network.allowedDomains) {
        if (matchesDomain(host, allowedDomain)) {
            logSandbox(`Allowed by config rule: ${host}:${port}`);
            return true;
        }
    }

    // No match - if callback available, ask user; otherwise deny
    if (!permissionCallback) {
        logSandbox(`No matching config rule, denying: ${host}:${port}`);
        return false;
    }

    logSandbox(`No matching config rule, asking user: ${host}:${port}`);
    try {
        const allowed = await permissionCallback({ host, port });
        logSandbox(`User ${allowed ? 'allowed' : 'denied'}: ${host}:${port}`);
        return allowed;
    } catch (error) {
        logSandbox(`Error in permission callback: ${error}`, { level: "error" });
        return false;
    }
}

// Mapping: nZ7→checkNetworkPermission, A→port, q→host, K→permissionCallback,
//          R5→sandboxConfig, bw8→matchesDomain, wA→logSandbox
```

### Permission Decision Flow

```
Network Request (host, port)
    │
    ▼
Check deniedDomains
    │
    ├─ Host matches denied domain → DENY
    │
    └─ No match → Check allowedDomains
           │
           ├─ Host matches allowed domain → ALLOW
           │
           └─ No match → Has permission callback?
                  │
                  ├─ No callback → DENY (default-deny)
                  │
                  └─ Has callback → Prompt user
                         │
                         ├─ User approves → ALLOW
                         └─ User denies → DENY
```

---

## Validated Symbol Summary (Phase 1 Cross-Validation)

### Confirmed Correct Mappings

| Obfuscated | Readable | File:Line | Validation Status |
|------------|----------|-----------|-------------------|
| vA | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated |
| aO | lowLevelSandboxModule | chunks.55.mjs:3436 | ✅ Validated |
| uZ7 | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated |
| xb3 | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated |
| QZ7 | wrapWithMacOSSandbox | chunks.55.mjs:2803 | ✅ Validated |
| HD6 | SandboxViolationStore | chunks.55.mjs:2902 | ✅ Validated |
| Ti | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated |
| h21 | isSandboxingEnabled | chunks.56.mjs:518 | ✅ Validated |
| Xx3 | wrapWithSandbox | chunks.56.mjs:526 | ✅ Validated |
| nZ7 | checkNetworkPermission | chunks.55.mjs:2960 | ✅ Validated |
| bw8 | matchesDomain | chunks.55.mjs:2952 | ✅ Validated |

### Corrected Mappings

| Obfuscated | Previous Mapping | Correct Mapping | Correct Location |
|------------|-----------------|-----------------|------------------|
| b8 | sandboxConfigObject | vA is correct | chunks.56.mjs:516 |
| Ye8 | wrapWithMacOSSandbox | QZ7 is correct | chunks.55.mjs:2803 |
| FP5 | buildSeatbeltProfile | xb3 is correct | chunks.55.mjs:2755 |
| Sc | isCommandSandboxed | Ti is correct | chunks.172.mjs:2454 |
| nBY | getSandboxSystemPromptBlock | E9z is correct | chunks.171.mjs:1892 |
| dy1 | SandboxViolationStore | HD6 is correct | chunks.55.mjs:2902 |

### Internal Symbol Mappings (aO module)

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| pb3 | initialize | Initialize sandbox with config |
| rZ7 | isSupportedPlatform | Check if platform supports sandbox |
| Qb3 | isSandboxingEnabled | Check if sandbox is actually running |
| oZ7 | checkDependencies | Check bwrap, socat, seccomp |
| Ub3 | getFsReadConfig | { denyOnly: [...] } |
| db3 | getFsWriteConfig | { allowOnly: [...], denyWithinAllow: [...] } |
| cb3 | getNetworkRestrictionConfig | { allowedDomains, deniedDomains } |
| ob3 | wrapWithSandbox | Platform-specific sandbox wrapping |
| tb3 | getSandboxViolationStore | Get violation store instance |
| eb3 | annotateStderrWithSandboxFailures | Add violation tags to stderr |
| AG7 | getHttpProxyPort | HTTP proxy port |
| qG7 | getSocksProxyPort | SOCKS proxy port |

---

## System Prompt Injection: `getSandboxSystemPromptBlock` (E9z)

**Location:** `chunks.171.mjs:1892-1923`

**What it does:** Generates the sandbox instructions that are injected into the Bash tool's system prompt. These instructions teach the model how to work with sandboxing and when to use `dangerouslyDisableSandbox`.

### Source Code

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions for Bash tool system prompt
// Location: chunks.171.mjs:1892-1923
// ============================================

// ORIGINAL (for source lookup):
function E9z() {
    if (!vA.isSandboxingEnabled()) return "";
    let A = vA.getFsReadConfig(),
        q = vA.getFsWriteConfig(),
        K = vA.getNetworkRestrictionConfig(),
        Y = vA.getAllowUnixSockets(),
        z = vA.getIgnoreViolations(),
        _ = vA.areUnsandboxedCommandsAllowed(),
        w = {
            read: A,
            write: q
        },
        O = {
            ...K?.allowedHosts && {
                allowedHosts: K.allowedHosts
            },
            ...K?.deniedHosts && {
                deniedHosts: K.deniedHosts
            },
            ...Y && {
                allowUnixSockets: Y
            }
        },
        $ = [];
    if (Object.keys(w).length > 0) $.push(`Filesystem: ${B6(w)}`);
    if (Object.keys(O).length > 0) $.push(`Network: ${B6(O)}`);
    if (z) $.push(`Ignored violations: ${B6(z)}`);
    let j = [..._ ? ["You should always default to running commands within the sandbox...",
        "Treat each command you execute with dangerouslyDisableSandbox: true individually..."]
      : ["All commands MUST run in sandbox mode - dangerouslyDisableSandbox is disabled by policy..."]];
    return ["", "## Command sandbox", "By default, your command will be run in a sandbox...",
        ...fi(j)].join("\n");
}

// READABLE (for understanding):
function getSandboxSystemPromptBlock() {
    // Guard: Sandbox not enabled → no instructions
    if (!sandboxConfigObject.isSandboxingEnabled()) return "";

    // Gather current configuration
    let readConfig = sandboxConfigObject.getFsReadConfig();
    let writeConfig = sandboxConfigObject.getFsWriteConfig();
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig();
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let unsandboxedCommandsAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();

    // Build filesystem restrictions object
    let filesystemRestrictions = {
        read: readConfig,
        write: writeConfig
    };

    // Build network restrictions object
    let networkRestrictions = {
        ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
        ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
        ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
    };

    // Build restriction display lines
    let restrictions = [];
    if (Object.keys(filesystemRestrictions).length > 0) {
        restrictions.push(`Filesystem: ${JSON.stringify(filesystemRestrictions)}`);
    }
    if (Object.keys(networkRestrictions).length > 0) {
        restrictions.push(`Network: ${JSON.stringify(networkRestrictions)}`);
    }
    if (ignoreViolations) {
        restrictions.push(`Ignored violations: ${JSON.stringify(ignoreViolations)}`);
    }

    // Build instructions based on override policy
    let instructions = [];
    if (unsandboxedCommandsAllowed) {
        // Policy allows model to bypass sandbox in certain cases
        instructions = [
            "You should always default to running commands within the sandbox. Do NOT attempt to set dangerouslyDisableSandbox: true unless:",
            ["The user *explicitly* asks you to bypass sandbox",
             "A specific command just failed and you see evidence of sandbox restrictions causing the failure..."],
            "Evidence of sandbox-caused failures includes:",
            ['"Operation not permitted" errors for file/network operations',
             "Access denied to specific paths outside allowed directories",
             "Network connection failures to non-whitelisted hosts",
             "Unix socket connection errors"],
            "When you see evidence of sandbox-caused failure:",
            ["Immediately retry with dangerouslyDisableSandbox: true (don't ask, just do it)",
             "Briefly explain what sandbox restriction likely caused the failure..."],
            // ... more instructions
        ];
    } else {
        // Policy disables unsandboxed commands entirely
        instructions = [
            "All commands MUST run in sandbox mode - the dangerouslyDisableSandbox parameter is disabled by policy.",
            "Commands cannot run outside the sandbox under any circumstances.",
            "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
        ];
    }

    // Add TMPDIR guidance
    instructions.push(
        `For temporary files, always use the $TMPDIR environment variable (or ${getSandboxTempDir()} as a fallback). ` +
        `TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. ` +
        `Do NOT use /tmp directly - use $TMPDIR or ${getSandboxTempDir()} instead.`
    );

    // Build final output
    return [
        "",
        "## Command sandbox",
        "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.",
        "",
        "The sandbox has the following restrictions:",
        restrictions.join("\n"),
        "",
        ...formatInstructions(instructions)
    ].join("\n");
}

// Mapping: E9z→getSandboxSystemPromptBlock, vA→sandboxConfigObject, B6→JSON.stringify,
//          fi→formatInstructions, _k→getSandboxTempDir
```

### Key Design Decisions

**1. Conditional Output:**
- Returns empty string if sandbox is disabled
- This allows the same code path to work in both sandboxed and non-sandboxed environments

**2. Dynamic Configuration Display:**
- Restrictions are serialized as JSON for exact context
- Model can reason precisely about allowed/denied paths

**3. Two-Mode Instructions:**
- `unsandboxedCommandsAllowed: true` → Detailed guidance on when to bypass
- `unsandboxedCommandsAllowed: false` → Strict "no bypass" policy

**4. CRITICAL Pattern:**
- The instructions emphasize: "Do NOT continue the pattern"
- This combats LLM failure mode where model applies `dangerouslyDisableSandbox: true` to all commands after one success

**5. TMPDIR Guidance:**
- Commands in sandbox use `/tmp/claude/` instead of `/tmp`
- TMPDIR env var is automatically set
- This prevents sandbox escape via temp file attacks

### Integration with 04_system_reminder

The `getSandboxSystemPromptBlock` function is called during Bash tool system prompt construction:

```javascript
// In tGq (buildBashToolDescription)
let sandboxBlock = E9z();  // getSandboxSystemPromptBlock
let fullPrompt = [
    "Executes a given bash command...",
    "# Instructions",
    ...otherInstructions,
    sandboxBlock,  // <-- Injected here
    ...additionalBlocks
].join("\n");
```

---

## Integration with 04_system_reminder (Summary)

The sandbox integrates with system reminders through:

1. **Bash Tool System Prompt** - `getSandboxSystemPromptBlock` (E9z) injects:
   - Current sandbox restrictions (filesystem, network)
   - `dangerouslyDisableSandbox` usage instructions
   - `mcp-cli` exception for sandbox bypass
   - TMPDIR guidance (`/tmp/claude`)

2. **Violation Annotations** - `<sandbox_violations>` XML tags in stderr

3. **Auto-Allow Logic** - When `autoAllowBashIfSandboxed` is enabled, sandboxed commands bypass permission prompts

### Key Integration Points

```
04_system_reminder ←→ 18_sandbox
    │
    ├─ Bash tool system prompt
    │   └─ "Commands run in sandbox with restrictions: ..."
    │
    ├─ Violation reporting
    │   └─ <sandbox_violations> in tool result
    │
    ├─ Permission flow
    │   └─ Auto-allow when sandbox enabled
    │
    └─ Network proxy
        └─ Domain-based permission prompts
```
