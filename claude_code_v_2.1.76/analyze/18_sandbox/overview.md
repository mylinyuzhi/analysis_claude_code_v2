# Sandbox Architecture (Claude Code 2.1.76)

## Overview

The sandbox system is a critical security boundary that restricts what commands executed by Claude can do to the host system. It operates at the OS level using platform-native isolation mechanisms -- macOS `sandbox-exec` (seatbelt) and Linux `bwrap` (bubblewrap) -- to enforce filesystem, network, and process restrictions on every bash command the model invokes.

> **⚠️ Symbol Correction (v2.1.76):** The actual sandbox config object is `vA` (chunks.56.mjs:516), not `b8` as previously documented. The symbol `b8` is used elsewhere in the codebase. The low-level sandbox module is `aO`, referenced from `vA`.
> **⚠️ Symbol Correction (v2.1.76):** `Ye8` at chunks.59.mjs:5105 is NOT wrapWithMacOSSandbox - it's React fiber commitWork code. The actual macOS sandbox wrapper is `QZ7` (chunks.55.mjs:2803).
> **⚠️ Symbol Correction (v2.1.76):** `FP5` at chunks.35.mjs:1456 is NOT buildSeatbeltProfile - it's an AWS credential provider function. The actual seatbelt profile builder is `xb3` (chunks.55.mjs:2755).
> **⚠️ Symbol Correction (v2.1.76):** `nBY` at chunks.149.mjs:1935 is NOT getSandboxSystemPromptBlock - it's getCacheSafeParams. The actual getSandboxSystemPromptBlock is `E9z` (chunks.171.mjs:1892).
> **⚠️ Symbol Correction (v2.1.76):** `Lzz` at chunks.173.mjs:2714 is NOT isCommandInExcludedList - it's an Auto Mode reminder function. The actual isCommandInExcludedList is `yYz` (chunks.172.mjs:2412).

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated - Public API facade |
| `QZ7` | wrapWithMacOSSandbox | chunks.55.mjs:2803 | ✅ Validated - macOS sandbox-exec wrapper |
| `xb3` | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated - SBPL profile generator |
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated - Linux bwrap wrapper |
| `HD6` | SandboxViolationStore | chunks.55.mjs:2902 | ✅ Validated - Ring buffer for violations |
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | ✅ Validated - Command exclusion matcher |
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated - Per-command sandbox gate |
| `bw8` | matchDomainPattern | chunks.55.mjs:2952 | ✅ Validated - Domain wildcard matching |

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
- `isCommandInExcludedList` (yYz) - chunks.172.mjs:2412 - Checks command against excludedCommands patterns (prefix/exact/wildcard)
- `matchDomainPattern` (bw8) - chunks.55.mjs:2952 - Matches domain against pattern (wildcard: *.example.com)
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
QZ7()     uZ7()
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
1. `wrapWithSandbox` (Xx3) detects platform as "macos" and calls `wrapWithMacOSSandbox` (QZ7)
2. QZ7 calls `generateSeatbeltProfile` (xb3) which constructs the full SBPL policy
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

---

## The `dangerouslyDisableSandbox` Decision Flow

### Complete Decision Tree: `isCommandSandboxed` (Ti)

**Location:** `chunks.172.mjs:2454-2460`

```javascript
// ============================================
// isCommandSandboxed - Determines if a command should be sandboxed
// Location: chunks.172.mjs:2454-2460
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
    // GATE 1: Global sandbox disabled
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return false;  // No sandboxing at all
    }

    // GATE 2: Model override with fallback allowed
    if (toolInput.dangerouslyDisableSandbox &&
        sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
        return false;  // Model requested bypass, policy allows it
    }

    // GATE 3: No command to execute
    if (!toolInput.command) {
        return false;  // Nothing to sandbox
    }

    // GATE 4: Command matches exclusion pattern
    if (isCommandInExcludedList(toolInput.command)) {
        return false;  // Explicitly excluded from sandbox
    }

    // All gates passed → sandbox it
    return true;
}

// Mapping: Ti→isCommandSandboxed, A→toolInput, vA→sandboxConfigObject,
//          yYz→isCommandInExcludedList
```

### The 4 Gates Explained

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    isCommandSandboxed DECISION TREE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Input: Bash tool input object { command, dangerouslyDisableSandbox, ... }  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GATE 1: isSandboxingEnabled()                                        │    │
│  │                                                                       │    │
│  │ Check: Platform supported? Dependencies OK? Enabled in settings?    │    │
│  │                                                                       │    │
│  │ ┌──────────────────┐      ┌──────────────────┐                      │    │
│  │ │ false            │      │ true             │                      │    │
│  │ │ return false     │      │ Continue to      │                      │    │
│  │ │ (no sandbox)     │      │ GATE 2           │                      │    │
│  │ └──────────────────┘      └──────────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GATE 2: dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed  │    │
│  │                                                                       │    │
│  │ Check: Model set dangerouslyDisableSandbox: true?                   │    │
│  │        AND policy allows unsandboxed fallback?                       │    │
│  │                                                                       │    │
│  │ ┌──────────────────┐      ┌──────────────────┐                      │    │
│  │ │ true             │      │ false            │                      │    │
│  │ │ return false     │      │ Continue to      │                      │    │
│  │ │ (model override) │      │ GATE 3           │                      │    │
│  │ └──────────────────┘      └──────────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GATE 3: !toolInput.command                                           │    │
│  │                                                                       │    │
│  │ Check: Is there an actual command string?                            │    │
│  │                                                                       │    │
│  │ ┌──────────────────┐      ┌──────────────────┐                      │    │
│  │ │ true (no cmd)    │      │ false (has cmd)  │                      │    │
│  │ │ return false     │      │ Continue to      │                      │    │
│  │ │ (nothing to run) │      │ GATE 4           │                      │    │
│  │ └──────────────────┘      └──────────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ GATE 4: isCommandInExcludedList(command)                             │    │
│  │                                                                       │    │
│  │ Check: Does command match any pattern in excludedCommands?          │    │
│  │        Patterns: prefix:*, suffix:*, *:contains:*, exact           │    │
│  │                                                                       │    │
│  │ ┌──────────────────┐      ┌──────────────────┐                      │    │
│  │ │ true             │      │ false            │                      │    │
│  │ │ return false     │      │ return true      │                      │    │
│  │ │ (excluded)       │      │ (SANDBOX IT)     │                      │    │
│  │ └──────────────────┘      └──────────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Result: true → wrap with sandbox-exec/bwrap                               │
│          false → execute directly (unsandboxed)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Gate Details

| Gate | Condition | Returns | Interpretation |
|------|-----------|---------|----------------|
| 1 | `!isSandboxingEnabled()` | `false` | Sandbox system not active |
| 2 | `dangerouslyDisableSandbox && allowUnsandboxed` | `false` | Model override, policy allows |
| 3 | `!command` | `false` | Empty command, nothing to sandbox |
| 4 | `isCommandInExcludedList()` | `false` | User excluded this command |
| - | All gates pass | `true` | **Wrap with sandbox** |

### Fallback Policy Behavior

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FALLBACK POLICY BEHAVIOR                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  allowUnsandboxedCommands: true (Open Policy)                               │
│  ─────────────────────────────────────────────────────                       │
│                                                                              │
│  Model sets dangerouslyDisableSandbox: true                                 │
│       │                                                                      │
│       ▼                                                                      │
│  isCommandSandboxed() returns false                                         │
│       │                                                                      │
│       ▼                                                                      │
│  Command runs WITHOUT sandbox wrapper                                       │
│       │                                                                      │
│       ▼                                                                      │
│  Permission prompt shows: "Bash command (unsandboxed)"                      │
│       │                                                                      │
│       ▼                                                                      │
│  User can approve/deny the unsandboxed execution                            │
│                                                                              │
│                                                                              │
│  allowUnsandboxedCommands: false (Closed Policy)                            │
│  ──────────────────────────────────────────────────────                      │
│                                                                              │
│  Model sets dangerouslyDisableSandbox: true                                 │
│       │                                                                      │
│       ▼                                                                      │
│  isCommandSandboxed() IGNORES the override                                  │
│       │                                                                      │
│       ▼                                                                      │
│  Command runs WITH sandbox wrapper                                          │
│       │                                                                      │
│       ▼                                                                      │
│  Model cannot bypass sandbox under any circumstances                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Permission Auto-Allow Flow

**Location:** `chunks.172.mjs:1987`

```javascript
// ============================================
// checkBashPermissionWithSandbox - Auto-allow logic for sandboxed commands
// Location: chunks.172.mjs:1987-1995
// ============================================

// ORIGINAL (for source lookup):
if (vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(A)) {
    return {
        behavior: "allow",
        decisionReason: {
            type: "auto-allowed",
            reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
        }
    }
}

// READABLE (for understanding):
// In checkBashPermission()
if (sandboxConfigObject.isSandboxingEnabled() &&
    sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled() &&
    isCommandSandboxed(toolInput)) {

    // Auto-approve without prompting user
    return {
        behavior: "allow",
        decisionReason: {
            type: "auto-allowed",
            reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
        }
    };
}

// Otherwise, proceed with normal permission flow
// Mapping: Ti→isCommandSandboxed, vA→sandboxConfigObject, A→toolInput
```

### Why Auto-Allow is Safe

When `autoAllowBashIfSandboxed` is enabled:

1. **Sandbox provides isolation** - Even malicious commands can't damage the system
2. **Network is filtered** - All network goes through proxy with domain filtering
3. **Filesystem is restricted** - Write access limited to allowed paths
4. **Violations are logged** - User can see what sandbox blocked

**Trade-off:** Convenience vs visibility. User doesn't see every command, but sandbox catches dangerous operations.

---

## Complete Command Execution Flow

### End-to-End Sandbox Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE BASH COMMAND EXECUTION FLOW                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. LLM Generates Bash Tool Call                                            │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ { command: "ls -la", description: "List files",                 │     │
│     │   dangerouslyDisableSandbox: false }                            │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                              │                                               │
│                              ▼                                               │
│  2. Permission Check (chunks.172.mjs)                                       │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ checkBashPermissionWithSandbox()                                 │     │
│     │                                                                  │     │
│     │ if (isSandboxingEnabled() && autoAllowBashIfSandboxed() &&       │     │
│     │     isCommandSandboxed(input)) {                                 │     │
│     │     → AUTO-ALLOW: No user prompt needed                          │     │
│     │ } else if (dangerouslyDisableSandbox && allowUnsandboxed) {      │     │
│     │     → PROMPT: "Bash command (unsandboxed)"                       │     │
│     │ } else {                                                         │     │
│     │     → PROMPT: "Bash command"                                     │     │
│     │ }                                                                │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                              │                                               │
│                              ▼                                               │
│  3. isCommandSandboxed() Decision (Ti)                                      │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ Gate 1: isSandboxingEnabled()? → NO → return false              │     │
│     │ Gate 2: dangerouslyDisableSandbox && allowUnsandboxed?          │     │
│     │         → YES → return false                                    │     │
│     │ Gate 3: !command? → YES → return false                          │     │
│     │ Gate 4: isCommandInExcludedList()? → YES → return false         │     │
│     │ return true (sandbox the command)                               │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                              │                                               │
│               ┌──────────────┴──────────────┐                               │
│               │                             │                               │
│               ▼                             ▼                               │
│     NOT SANDBOXED                   SANDBOXED                              │
│     ┌────────────────┐             ┌────────────────────────────────┐       │
│     │ Execute        │             │ 4. wrapWithSandbox() (Xx3)     │       │
│     │ directly       │             │    │                           │       │
│     │ (no isolation) │             │    ├─ Build readConfig         │       │
│     └────────────────┘             │    ├─ Build writeConfig        │       │
│               │                    │    ├─ Check network restriction│       │
│               │                    │    │                           │       │
│               │                    │    └─ Route by platform:       │       │
│               │                    │         │                      │       │
│               │                    │    ┌────┴────┐                 │       │
│               │                    │    │         │                 │       │
│               │                    │    ▼         ▼                 │       │
│               │                    │  macOS    Linux               │       │
│               │                    │  QZ7()    uZ7()                │       │
│               │                    │    │         │                 │       │
│               │                    │    ▼         ▼                 │       │
│               │                    │ sandbox-  bwrap               │       │
│               │                    │ exec -p    --unshare-net      │       │
│               │                    │ <SBPL>     --ro-bind          │       │
│               │                    │            --seccomp          │       │
│               │                    └────────────────────────────────┘       │
│               │                             │                               │
│               └──────────────┬──────────────┘                               │
│                              │                                               │
│                              ▼                                               │
│  5. Command Execution                                                       │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ Shell executes command (sandboxed or not)                       │     │
│     │                                                                  │     │
│     │ Sandbox enforces:                                               │     │
│     │   • Filesystem: Read/write only to allowed paths               │     │
│     │   • Network: Only through proxy (if restriction enabled)       │     │
│     │   • Process: Isolated in namespace (Linux)                      │     │
│     │   • Unix sockets: Blocked by seccomp (Linux, if enabled)       │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                              │                                               │
│                              ▼                                               │
│  6. Output Collection & Violation Annotation                                │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ stdout/stderr captured                                          │     │
│     │                                                                  │     │
│     │ macOS only: annotateStderrWithSandboxFailures()                 │     │
│     │   If violations detected:                                        │     │
│     │   <sandbox_violations>                                           │     │
│     │   Sandbox: file-write* deny /etc/passwd                         │     │
│     │   Sandbox: network-outbound deny 192.168.1.1:443                │     │
│     │   </sandbox_violations>                                          │     │
│     │                                                                  │     │
│     │ SandboxViolationStore (HD6) updated by log monitor (macOS)      │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                              │                                               │
│                              ▼                                               │
│  7. Result Returned to LLM                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │ Tool result contains:                                           │     │
│     │   • stdout: Command output                                      │     │
│     │   • stderr: Error output (with violations annotated)            │     │
│     │   • sandbox_violations: Array of detected violations            │     │
│     │                                                                  │     │
│     │ LLM sees evidence of sandbox failures:                          │     │
│     │   → Can retry with dangerouslyDisableSandbox: true              │     │
│     │   → (only if allowUnsandboxedCommands: true)                    │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Decision Points Summary

| Decision Point | Function | Location | Key Outputs |
|----------------|----------|----------|-------------|
| Global enable check | `isSandboxingEnabled()` (h21) | chunks.56.mjs:357 | Checks platform, deps, settings |
| Per-command check | `isCommandSandboxed()` (Ti) | chunks.172.mjs:2454 | 4-gate decision |
| Auto-allow check | `checkBashPermissionWithSandbox()` | chunks.172.mjs:1987 | Skip prompt if sandboxed |
| Platform routing | `wrapWithSandboxInternal()` (ob3) | chunks.55.mjs:3208 | macOS vs Linux |
| SBPL generation | `generateSeatbeltProfile()` (xb3) | chunks.55.mjs:2755 | macOS profile |
| bwrap command | `wrapWithLinuxSandbox()` (uZ7) | chunks.55.mjs:2564 | Linux namespace args |

---

## Module Documentation Index

The 18_sandbox module analysis contains the following documents:

| File | Description | Key Topics |
|------|-------------|------------|
| `overview.md` | Architecture overview | Platform-specific implementations, decision flow |
| `bwrap_implementation.md` | Linux bubblewrap | `--ro-bind`, `--unshare-net`, seccomp, symlink attacks |
| `seatbelt_profile.md` | macOS sandbox-exec | SBPL generation, Mach IPC, sysctl rules |
| `network_proxy.md` | HTTP/SOCKS proxy | Domain filtering, Unix socket bridges |
| `initialization_flow.md` | Bootstrap sequence | Dependency checks, proxy startup, process exit handlers |
| `cross_module_integration.md` | Module integration | System prompt injection, permissions, hooks, MCP |
| `ui_linkage.md` | UI components | `/sandbox` command, status line, keyboard navigation |
| `violation_system.md` | Violation monitoring | Log stream, correlation, ring buffer store |
| `symbol_validation.md` | Symbol validation | Cross-validated mappings, corrections |
| `seccomp_filter.md` | Seccomp BPF | Unix socket blocking, architecture support |
| `permission_sync.md` | Permission sync | Settings mirroring, policy management |

### Quick Reference by Topic

- **Want to understand how sandbox works?** → `overview.md`
- **Developing on Linux?** → `bwrap_implementation.md`, `seccomp_filter.md`
- **Developing on macOS?** → `seatbelt_profile.md`, `violation_system.md`
- **Network restrictions?** → `network_proxy.md`
- **UI integration?** → `ui_linkage.md`
- **System prompt injection?** → `cross_module_integration.md`
- **Symbol lookup?** → `symbol_validation.md`, `../00_overview/symbol_index_infra_platform.md`

---

## Error Handling and Failure Scenarios

### Initialization Errors

| Error Scenario | Detection Point | User-Visible Message | Recovery Action |
|----------------|-----------------|----------------------|-----------------|
| Unsupported platform | `isSupportedPlatform()` (rZ7) | "Unsupported platform" | Sandbox disabled; commands run unsandboxed |
| Missing bwrap (Linux) | `checkDependencies()` (oZ7) | "bubblewrap (bwrap) not installed" | Sandbox disabled; user must install bwrap |
| Missing socat (Linux) | `checkDependencies()` (oZ7) | "socat not installed" | Sandbox disabled; user must install socat |
| Missing ripgrep | `checkDependencies()` (oZ7) | "ripgrep (rg) not found" | Sandbox disabled; user must install ripgrep |
| Missing seccomp (Linux) | `checkLinuxDependencies()` (bZ7) | Warning: "seccomp not available - unix socket access not restricted" | Sandbox enabled with reduced security (no Unix socket blocking) |
| WSL1 detected | `isSupportedPlatform()` | Returns false (not explicit error) | Sandbox disabled; WSL2 required |

### Network Infrastructure Errors

| Error Scenario | Detection Point | Behavior | Recovery Action |
|----------------|-----------------|----------|-----------------|
| HTTP proxy bind failure | `createHttpProxy()` (gb3) | Initialization promise rejects | `reset()` called; error propagated to caller |
| SOCKS proxy bind failure | `createSocksProxy()` (Fb3) | Initialization promise rejects | `reset()` called; error propagated to caller |
| Bridge socket creation failure (Linux) | `createBridgeSockets()` (xZ7) | Initialization promise rejects | Cleanup attempted; error propagated |
| Proxy port already in use | Port conflict during bind | Random port assignment fails | Error logged; sandbox fails to initialize |

### Runtime Errors

| Error Scenario | Location | Behavior | User Impact |
|----------------|----------|----------|-------------|
| bwrap exec failure | `wrapWithLinuxSandbox()` (uZ7) | Command execution fails with error | LLM sees error, can retry unsandboxed if allowed |
| sandbox-exec failure | `wrapWithMacOSSandbox()` (QZ7) | Command execution fails with error | LLM sees error, can retry unsandboxed if allowed |
| Network request to denied domain | `checkNetworkPermission()` (nZ7) | Connection refused/error | Command fails; violation logged (macOS) |
| File write to denied path | Seatbelt/bwrap enforcement | Permission denied error | Command fails; violation logged (macOS) |

### Error Message Examples

**macOS violation annotation (stderr):**
```
<sandbox_violations>
Sandbox: file-write* deny /etc/passwd
Sandbox: network-outbound deny 192.168.1.1:443
</sandbox_violations>
```

**Dependency error (initialization):**
```
Error: Sandbox dependencies not available: bubblewrap (bwrap) not installed, socat not installed
```

**Permission denied (runtime):**
```
bash: /etc/passwd: Permission denied
```

### Graceful Degradation Patterns

The sandbox is designed with graceful degradation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GRACEFUL DEGRADATION HIERARCHY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Level 0: Full Sandbox                                                      │
│  ────────────────────────                                                   │
│  • All dependencies available                                               │
│  • Network namespace isolated (Linux) / Seatbelt active (macOS)             │
│  • Seccomp BPF blocking Unix sockets (Linux)                               │
│  • Violation monitoring active (macOS)                                      │
│                                                                              │
│  Level 1: Reduced Security (Linux only)                                     │
│  ──────────────────────────────────────────                                 │
│  • bwrap + socat available                                                  │
│  • seccomp NOT available (warning logged)                                   │
│  • Network isolated but Unix sockets NOT blocked                           │
│  • This is a warning, not an error                                          │
│                                                                              │
│  Level 2: Sandbox Disabled                                                  │
│  ────────────────────────────                                               │
│  • Critical dependencies missing (bwrap, socat, rg)                        │
│  • Unsupported platform                                                     │
│  • User disabled in settings                                                │
│  • Commands run WITHOUT sandbox protection                                  │
│                                                                              │
│  Level 3: Initialization Failed                                             │
│  ─────────────────────────────                                              │
│  • Dependencies OK but proxy/bridge failed                                  │
│  • initializationPromise rejects                                            │
│  • User sees error message                                                  │
│  • Sandbox state is reset; may retry initialization                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cleanup on Failure

The `reset()` function (xw8) provides comprehensive cleanup:

```javascript
// ============================================
// reset - Cleanup all sandbox resources on failure/exit
// Location: chunks.55.mjs:3288-3380
// ============================================

// READABLE (for understanding):
async function reset() {
    // 1. Stop log monitor (macOS)
    if (logMonitorCleanup) {
        logMonitorCleanup();
        logMonitorCleanup = undefined;
    }

    // 2. Terminate Linux bridge processes
    if (networkInfo?.linuxBridge) {
        const { httpBridgePid, socksBridgePid } = networkInfo.linuxBridge;

        // SIGTERM first
        if (httpBridgePid) process.kill(httpBridgePid, 'SIGTERM');
        if (socksBridgePid) process.kill(socksBridgePid, 'SIGTERM');

        // Wait 5 seconds, then SIGKILL if still running
        await sleep(5000);
        // ... force kill logic ...

        // Remove socket files
        fs.unlinkSync(httpSocketPath);
        fs.unlinkSync(socksSocketPath);
    }

    // 3. Close proxy servers
    if (httpProxyServer) httpProxyServer.close();
    if (socksProxyServer) socksProxyServer.close();

    // 4. Reset state
    networkInfo = undefined;
    networkInitPromise = undefined;
    currentConfig = undefined;
}

// Mapping: xw8→reset, N21→logMonitorCleanup, LL→networkInfo
```

### Process Exit Registration

Cleanup is registered via `setupProcessExitHandler` (mb3):

```javascript
// Registers cleanup on:
// - 'exit' event (normal exit)
// - 'SIGINT' (Ctrl+C)
// - 'SIGTERM' (kill command)
// - 'beforeExit' (event loop empty)
```

---

## Algorithm Deep-Dives

This section provides detailed analysis of key algorithms used in the sandbox system.

### 1. Command Exclusion Matching (`yYz`)

**What it does:** Determines whether a command should skip sandboxing based on the `excludedCommands` configuration.

**Location:** chunks.172.mjs:2412-2452

```javascript
// ============================================
// isCommandInExcludedList - Command exclusion pattern matcher
// Location: chunks.172.mjs:2412-2452
// ============================================

// ORIGINAL (for source lookup):
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try {
        Y = EO(A)
    } catch {
        Y = [A]
    }
    for (let z of Y) {
        let w = [z.trim()], O = new Set(w), $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j], M = bn8(J, xfq);
                if (!O.has(M)) w.push(M), O.add(M);
                let D = Ac(J);
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        for (let H of K) {
            let j = In8(H);
            for (let J of w) switch (j.type) {
                case "prefix":
                    if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === j.command) return !0;
                    break;
                case "wildcard":
                    if (Cn8(j.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    let excludedPatterns = getSettings().sandbox?.excludedCommands ?? [];
    if (excludedPatterns.length === 0) return false;

    // Parse command into variants (handles shell scripts with multiple commands)
    let commandVariants;
    try {
        commandVariants = parseShellCommand(command);  // EO: shell parser
    } catch {
        commandVariants = [command];  // Fallback: use raw command
    }

    for (let variant of commandVariants) {
        // Expand command into all possible forms
        let expandedForms = [variant.trim()];
        let seen = new Set(expandedForms);

        // BFS expansion: strip env vars, extract basename
        let queueIndex = 0;
        while (queueIndex < expandedForms.length) {
            let currentLength = expandedForms.length;
            for (let i = queueIndex; i < currentLength; i++) {
                let cmd = expandedForms[i];

                // Strip environment variable assignments (LD_*, DYLD_*, PATH)
                let withoutEnv = stripEnvVars(cmd);
                if (!seen.has(withoutEnv)) {
                    expandedForms.push(withoutEnv);
                    seen.add(withoutEnv);
                }

                // Extract command basename (last component after /)
                let basename = extractBasename(cmd);
                if (!seen.has(basename)) {
                    expandedForms.push(basename);
                    seen.add(basename);
                }
            }
            queueIndex = currentLength;
        }

        // Check each pattern against all expanded forms
        for (let pattern of excludedPatterns) {
            let parsed = parseExclusionPattern(pattern);  // In8: pattern parser

            for (let form of expandedForms) {
                switch (parsed.type) {
                    case "prefix":
                        // "npm:*" matches "npm" or "npm install"
                        if (form === parsed.prefix || form.startsWith(parsed.prefix + " ")) {
                            return true;
                        }
                        break;
                    case "exact":
                        // "git" matches exactly "git"
                        if (form === parsed.command) {
                            return true;
                        }
                        break;
                    case "wildcard":
                        // "docker compose *" matches "docker compose up"
                        if (matchWildcard(parsed.pattern, form)) {
                            return true;
                        }
                        break;
                }
            }
        }
    }
    return false;
}

// Mapping: yYz→isCommandInExcludedList, PA→getSettings, EO→parseShellCommand,
//          bn8→stripEnvVars, Ac→extractBasename, In8→parseExclusionPattern, Cn8→matchWildcard
```

**Why this algorithm is complex:**

1. **Shell command parsing**: Commands may contain pipes, subshells, and multiple statements
2. **Environment variable stripping**: `LD_LIBRARY_PATH=/foo cmd` should match exclusion for `cmd`
3. **Basename extraction**: `/usr/bin/git` should match exclusion pattern `git`
4. **Pattern types**:
   - `prefix` (npm:*) - matches command and any arguments
   - `exact` (git) - matches exactly the command name
   - `wildcard` (docker compose *) - glob-style matching

**Security consideration:** If the pattern matching were too loose, commands could escape sandboxing. The BFS expansion ensures all command forms are checked.

---

### 2. Domain Pattern Matching (`bw8`)

**What it does:** Matches a domain against a pattern, supporting wildcard subdomain matching.

**Location:** chunks.55.mjs:2952-2958

```javascript
// ============================================
// matchDomainPattern - Domain wildcard matcher
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
function matchDomainPattern(domain, pattern) {
    // Wildcard pattern: "*.example.com"
    if (pattern.startsWith("*.")) {
        let baseDomain = pattern.substring(2);  // "example.com"
        // Match: "api.example.com" → true
        // Match: "sub.api.example.com" → true
        // No match: "example.com" → false (need at least one subdomain)
        // No match: "notexample.com" → false
        return domain.toLowerCase().endsWith("." + baseDomain.toLowerCase());
    }

    // Exact match: "github.com"
    return domain.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchDomainPattern, A→domain, q→pattern, K→baseDomain
```

**Why case-insensitive:** DNS is case-insensitive, so domain matching must also be case-insensitive.

**Security consideration:** The pattern `*.com` is NOT allowed (validated by Zod schema). Wildcards must have at least two parts after the `*` (e.g., `*.example.com` is valid, `*.com` is not).

---

### 3. Violation Correlation via Base64 Encoding

**What it does:** Correlates sandbox violation log messages with the command that triggered them.

**Architecture:**

```
Command Execution                        Violation Detection
       │                                        │
       ▼                                        ▼
generateLogTag("cat /etc/passwd")    log stream --predicate '(eventMessage ENDSWITH "_xxx_SBX")'
       │                                        │
       ▼                                        ▼
"CMD64_Y2F0IC9ldGMvcGFzc3dk_END_k7x9m2pq_SBX"   Sandbox: deny file-read /etc/passwd _k7x9m2pq_SBX
       │                                        │
       │                                        ▼
       │                                 Parse: extract "Y2F0IC9ldGMvcGFzc3dk"
       │                                        │
       │                                        ▼
       │                                 decodeBase64("Y2F0IC9ldGMvcGFzc3dk") = "cat /etc/passwd"
       │                                        │
       └────────────────────────────────────────┘
                     Match confirmed
```

**Log Tag Generation (`Cb3`):**

```javascript
// ============================================
// generateLogTag - Generate correlation ID for command
// Location: chunks.55.mjs:2678-2679
// ============================================

// ORIGINAL (for source lookup):
function Cb3(A) {
    return `CMD64_${T21(A)}_END_${FZ7}`
}

// READABLE (for understanding):
function generateLogTag(command) {
    // FZ7 = `_${Math.random().toString(36).slice(2,11)}_SBX`
    // Example: "_k7x9m2pq_SBX"
    return `CMD64_${encodeBase64(command)}_END_${SANDBOX_LOG_TAG}`;
    // Result: "CMD64_Y2F0IC9ldGMvcGFzc3dk_END_k7x9m2pq_SBX"
}

// Mapping: Cb3→generateLogTag, T21→encodeBase64, FZ7→SANDBOX_LOG_TAG
```

**Why base64 encoding:**
1. Commands may contain special characters (`'`, `"`, `\n`, `|`)
2. Base64 produces clean, parseable identifiers
3. Easily reversible for correlation

**Why random session tag:**
1. Multiple Claude Code sessions can run simultaneously
2. Each session has a unique tag (`_k7x9m2pq_SBX`)
3. Prevents cross-talk between sessions

---

---

## Algorithm: isCommandSandboxed Decision Tree

**What it does:** Determines whether a Bash command should run inside the sandbox. This is the critical gating function that enforces sandbox policy for every Bash tool invocation.

**Location:** chunks.172.mjs:2454-2460

```javascript
// ============================================
// isCommandSandboxed - Gate check for sandbox wrapping
// Location: chunks.172.mjs:2454-2460
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
function isCommandSandboxed(bashToolInput) {
    // GATE 1: Is sandboxing globally enabled?
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return false;  // Sandbox disabled in settings
    }

    // GATE 2: Is dangerouslyDisableSandbox requested AND fallback allowed?
    if (bashToolInput.dangerouslyDisableSandbox &&
        sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
        return false;  // Model requested bypass, policy allows it
    }

    // GATE 3: Is there a valid command?
    if (!bashToolInput.command) {
        return false;  // Empty/null command
    }

    // GATE 4: Is command in excluded list?
    if (isCommandInExcludedList(bashToolInput.command)) {
        return false;  // Command pattern matches exclusion rule
    }

    // All gates passed → sandbox the command
    return true;
}

// Mapping: Ti→isCommandSandboxed, vA→sandboxConfigObject, yYz→isCommandInExcludedList, A→bashToolInput
```

### Decision Tree Visualization

```
                    ┌─────────────────────────────┐
                    │ isCommandSandboxed(input)   │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Is sandbox globally       │
                    │ enabled? (h21)            │
                    └─────────────┬─────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │ NO                │                   │ YES
              ▼                   │                   ▼
        ┌───────────┐            │             ┌─────────────────┐
        │ return    │            │             │ Is              │
        │ false     │            │             │ dangerouslyDis- │
        │ (disabled)│            │             │ ableSandbox     │
        └───────────┘            │             │ set AND policy  │
                                 │             │ allows fallback?│
                                 │             └────────┬────────┘
                                 │                      │
                                 │       ┌──────────────┼──────────────┐
                                 │       │ YES          │              │ NO
                                 │       ▼              │              ▼
                                 │ ┌───────────┐       │        ┌─────────────┐
                                 │ │ return    │       │        │ Is command  │
                                 │ │ false     │       │        │ empty/null? │
                                 │ │ (bypass)  │       │        └──────┬──────┘
                                 │ └───────────┘       │               │
                                 │                     │    ┌──────────┼──────────┐
                                 │                     │    │ YES      │          │ NO
                                 │                     │    ▼          │          ▼
                                 │                     │ ┌────────┐   │   ┌───────────────┐
                                 │                     │ │ return │   │   │ Is command in │
                                 │                     │ │ false  │   │   │ excluded list?│
                                 │                     │ └────────┘   │   └───────┬───────┘
                                 │                     │              │           │
                                 │                     │              │  ┌────────┼────────┐
                                 │                     │              │  │ YES    │       │ NO
                                 │                     │              │  ▼        │       ▼
                                 │                     │              │ ┌──────┐  │  ┌──────────┐
                                 │                     │              │ │return│  │  │ return   │
                                 │                     │              │ │false │  │  │ true     │
                                 │                     │              │ └──────┘  │  │(SANDBOX!)│
                                 │                     │              │           │  └──────────┘
```

### Why This Design

**Short-circuit evaluation:** Each gate is checked in order of computational cost:
1. `isSandboxingEnabled()` - O(1) settings lookup
2. `dangerouslyDisableSandbox` check - O(1) property access
3. Empty command check - O(1) falsy check
4. `isCommandInExcludedList()` - O(n*m) pattern matching (most expensive, checked last)

**Fallback policy integration:** Gate 2 enforces the "open" vs "closed" mode:
- **Open mode** (`allowUnsandboxedCommands: true`): Model can request bypass
- **Closed mode** (`allowUnsandboxedCommands: false`): Gate 2 always fails, model cannot bypass

---

## Algorithm: Environment Variable Stripping (`bn8`)

**What it does:** Strips environment variable assignments from a command string to get the actual command name. This is used during exclusion pattern matching because `LD_LIBRARY_PATH=/foo cmd` should match an exclusion for `cmd`.

**Location:** chunks.172.mjs (inferred from context at line 2429)

```javascript
// ============================================
// stripEnvVars - Remove environment variable assignments from command
// Location: chunks.172.mjs:2429 (referenced as bn8)
// ============================================

// READABLE (for understanding):
function stripEnvVars(command, envPattern) {
    // envPattern is /^(LD_|DYLD_|PATH$)/
    // Matches: LD_LIBRARY_PATH=foo, DYLD_INSERT_LIBRARIES=bar, PATH=/usr/bin

    // Split command into tokens
    let tokens = command.split(/\s+/);
    let result = [];

    for (let token of tokens) {
        // Check if this looks like an env var assignment
        if (token.includes('=')) {
            let [name, ...valueParts] = token.split('=');
            let varName = name;

            // Check if the variable name matches our pattern
            if (envPattern.test(varName)) {
                // Skip this token (it's an env var we strip)
                continue;
            }
        }
        // Not an env var or doesn't match pattern - keep it
        result.push(token);

        // Stop once we hit the actual command (first non-env token)
        // Actually, we continue to preserve arguments for later checks
    }

    return result.join(' ');
}

// Example transformations:
// "LD_LIBRARY_PATH=/opt/lib ./myapp" → "./myapp"
// "PATH=/usr/bin DYLD_LIBRARY_PATH=/lib node script.js" → "node script.js"
// "FOO=bar echo hello" → "FOO=bar echo hello" (FOO doesn't match pattern, kept)

// Mapping: bn8→stripEnvVars, xfq→ENV_PATTERN
```

### Why Strip Only LD_*, DYLD_*, PATH

**Security-relevant environment variables:**
- `LD_LIBRARY_PATH`, `LD_PRELOAD` - Linux dynamic linker injection
- `DYLD_LIBRARY_PATH`, `DYLD_INSERT_LIBRARIES` - macOS dynamic linker injection
- `PATH` - Command resolution path

These are commonly used in privilege escalation attacks and are stripped to ensure the exclusion pattern matches the underlying command regardless of environment manipulation.

---

## Algorithm: Basename Extraction (`Ac`)

**What it does:** Extracts the basename (last path component) from a command string. Used to match exclusions like `git` against `/usr/bin/git`.

**Location:** chunks.172.mjs:2431 (referenced as Ac)

```javascript
// ============================================
// extractBasename - Get command name from full path
// Location: chunks.172.mjs:2431
// ============================================

// READABLE (for understanding):
function extractBasename(command) {
    // Get the first token (the command itself, not arguments)
    let firstToken = command.trim().split(/\s+/)[0];

    // If it's a path, extract the last component
    if (firstToken.includes('/')) {
        return firstToken.split('/').pop();
    }

    // Already a basename
    return firstToken;
}

// Example transformations:
// "/usr/bin/git status" → "git"
// "git commit -m 'msg'" → "git"
// "./scripts/build.sh" → "build.sh"
// "node" → "node"

// Mapping: Ac→extractBasename
```

### Why Basename Extraction Matters

A command can be invoked in multiple ways:
- Full path: `/usr/bin/git status`
- Relative path: `./git status`
- Basename: `git status`

All of these should match an exclusion pattern `git:*`. The BFS expansion algorithm ensures all forms are checked.

---

## Algorithm: Exclusion Pattern Parsing (`In8`)

**What it does:** Parses an exclusion pattern string into a structured object with type and parameters.

**Location:** chunks.172.mjs:2437 (referenced as In8)

```javascript
// ============================================
// parseExclusionPattern - Parse exclusion pattern into structured object
// Location: chunks.172.mjs:2437
// ============================================

// READABLE (for understanding):
function parseExclusionPattern(pattern) {
    // Pattern types:
    // 1. Wildcard suffix: "npm:*" → { type: "prefix", prefix: "npm" }
    // 2. Exact match: "git" → { type: "exact", command: "git" }
    // 3. Glob pattern: "docker compose *" → { type: "wildcard", pattern: "docker compose *" }

    // Check for prefix wildcard (ends with :*)
    if (pattern.endsWith(':*')) {
        return {
            type: "prefix",
            prefix: pattern.slice(0, -2)  // Remove ":*"
        };
    }

    // Check for glob pattern (contains * or ?)
    if (pattern.includes('*') || pattern.includes('?')) {
        return {
            type: "wildcard",
            pattern: pattern
        };
    }

    // Exact match
    return {
        type: "exact",
        command: pattern
    };
}

// Example patterns:
// "npm:*" → matches "npm", "npm install", "npm run build"
// "git" → matches exactly "git" (not "github" or "git-status")
// "docker compose *" → matches "docker compose up", "docker compose build"

// Mapping: In8→parseExclusionPattern
```

### Pattern Type Matching Logic

```javascript
// For each pattern, check against all expanded command forms:
for (let form of expandedForms) {
    switch (parsed.type) {
        case "prefix":
            // "npm:*" matches "npm" OR "npm <anything>"
            if (form === parsed.prefix || form.startsWith(parsed.prefix + " ")) {
                return true;
            }
            break;

        case "exact":
            // "git" matches exactly "git"
            if (form === parsed.command) {
                return true;
            }
            break;

        case "wildcard":
            // "docker compose *" uses glob matching
            if (matchWildcard(parsed.pattern, form)) {
                return true;
            }
            break;
    }
}
```

---

## Algorithm: Wildcard Pattern Matching (`Cn8`)

**What it does:** Implements glob-style pattern matching for exclusion patterns containing `*` or `?`.

**Location:** chunks.172.mjs (inferred from context)

```javascript
// ============================================
// matchWildcard - Glob pattern matching for exclusion patterns
// Location: chunks.172.mjs (referenced as Cn8)
// ============================================

// READABLE (for understanding):
function matchWildcard(pattern, str) {
    // Convert glob pattern to regex:
    // * → matches any characters (including none)
    // ? → matches exactly one character
    // Other characters are escaped

    let regexStr = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // Escape regex special chars
        .replace(/\*/g, '.*')                   // * → .*
        .replace(/\?/g, '.');                   // ? → .

    // Anchor the pattern
    regexStr = '^' + regexStr + '$';

    let regex = new RegExp(regexStr);
    return regex.test(str);
}

// Example matches:
// "docker compose *" matches "docker compose up"
// "npm run test:*" matches "npm run test:unit", "npm run test:integration"
// "make ?" matches "make a", "make b" (single char only)

// Mapping: Cn8→matchWildcard
```

---

## Cross-Feature Integration: System Reminder Attachment

**What it does:** The sandbox integrates with the system reminder system via the `getSandboxSystemPromptBlock` function, which generates instructions for the model about sandbox usage.

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   System Reminder Integration Flow                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Bash Tool System Prompt Assembly                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ tGq() → Bash tool description builder                                │   │
│  │   • Calls E9z() to get sandbox instructions                         │   │
│  │   • Injects into system prompt if sandbox enabled                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         │                                                   │
│                         ▼                                                   │
│  2. getSandboxSystemPromptBlock (E9z)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Gate: isSandboxingEnabled()?                                      │   │
│  │ • Gather: fsReadConfig, fsWriteConfig, networkConfig               │   │
│  │ • Branch: open mode vs closed mode instructions                     │   │
│  │ • Return: Formatted markdown block                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         │                                                   │
│                         ▼                                                   │
│  3. Model receives instructions:                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ## Command sandbox                                                  │   │
│  │ By default, your command will be run in a sandbox...                │   │
│  │ The sandbox has the following restrictions:                         │   │
│  │ - Filesystem: {...}                                                 │   │
│  │ - Network: {...}                                                    │   │
│  │ - Instructions for dangerouslyDisableSandbox usage                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Open vs Closed Mode Instructions

**Open Mode** (`allowUnsandboxedCommands: true`):
```
You should always default to running commands within the sandbox.
Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:
- The user *explicitly* asks you to bypass sandbox
- A specific command just failed and you see evidence of sandbox restrictions

Evidence of sandbox-caused failures includes:
- "Operation not permitted" errors for file/network operations
- Access denied to specific paths outside allowed directories
- Network connection failures to non-whitelisted hosts
- Unix socket connection errors

When you see evidence of sandbox-caused failure:
- Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
- Briefly explain what sandbox restriction likely caused the failure
```

**Closed Mode** (`allowUnsandboxedCommands: false`):
```
All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter
is disabled by policy. Commands cannot run outside the sandbox under any circumstances.
If a command fails due to sandbox restrictions, work with the user to adjust sandbox
settings instead.
```

---

## Cross-Feature Integration: Permission System

**What it does:** The sandbox integrates with the permission system to enable auto-approval for sandboxed commands and proper permission prompts for bypass requests.

### Auto-Allow Logic

When `autoAllowBashIfSandboxed: true`:
1. Command arrives at permission check
2. `isCommandSandboxed()` returns true
3. Permission system auto-approves without prompting user
4. Rationale: Sandbox already restricts command capabilities

### Sandbox Override Permission Prompt

When model sets `dangerouslyDisableSandbox: true`:
1. `isCommandSandboxed()` returns false (bypass requested)
2. Permission check triggers a prompt
3. Reason displayed: "Run outside of the sandbox" (`sandboxOverride` type)
4. User must approve the unsandboxed execution

```javascript
// Permission reason type (chunks.172.mjs:2544-2545)
case "sandboxOverride":
    return "Run outside of the sandbox";
```

---

## Complete Implementation: buildSandboxConfig (R21)

**What it does:** Transforms user-facing settings into the internal sandbox configuration format. This is the critical function that bridges the settings UI to the sandbox runtime.

**Location:** chunks.56.mjs:224-310

```javascript
// ============================================
// buildSandboxConfig - Build sandbox config from user settings
// Location: chunks.56.mjs:224-310
// ============================================

// ORIGINAL (for source lookup):
function R21(A) {
    let q = A.permissions || {},
        K = [],
        Y = [];
    if (Uq6()) {
        let W = L8("policySettings");
        for (let Z of W?.sandbox?.network?.allowedDomains || []) K.push(Z);
        for (let Z of W?.permissions?.allow || []) {
            let G = MD6(Z);
            if (G.toolName === sO && G.ruleContent?.startsWith("domain:")) K.push(G.ruleContent.substring(7))
        }
    } else {
        for (let W of A.sandbox?.network?.allowedDomains || []) K.push(W);
        for (let W of q.allow || []) {
            let Z = MD6(W);
            if (Z.toolName === sO && Z.ruleContent?.startsWith("domain:")) K.push(Z.ruleContent.substring(7))
        }
    }
    for (let W of q.deny || []) {
        let Z = MD6(W);
        if (Z.toolName === sO && Z.ruleContent?.startsWith("domain:")) Y.push(Z.ruleContent.substring(7))
    }
    let z = [".", _k()],
        _ = [],
        w = [],
        O = VG.map((W) => F_(W)).filter((W) => W !== void 0);
    _.push(...O);
    let $ = OS(),
        H = AA();
    if ($ !== H) _.push(pq6($, ".claude", "settings.json")), _.push(pq6($, ".claude", "settings.local.json"));
    if (_.push(pq6(H, ".claude", "skills")), $ !== H) _.push(pq6($, ".claude", "skills"));
    let j = ["HEAD", "objects", "refs", "hooks", "config"];
    for (let W of j)
        if (_.push(pq6(H, W)), $ !== H) _.push(pq6($, W));
    if (DD6 && DD6 !== $) z.push(DD6);
    let J = new Set([...A.permissions?.additionalDirectories || [], ...XT()]);
    z.push(...J);
    for (let W of VG) {
        let Z = L8(W);
        if (Z?.permissions) {
            for (let f of Z.permissions.allow || []) {
                let v = MD6(f);
                if (v.toolName === R4 && v.ruleContent) z.push(Qq6(v.ruleContent, W))
            }
            for (let f of Z.permissions.deny || []) {
                let v = MD6(f);
                if (v.toolName === R4 && v.ruleContent) _.push(Qq6(v.ruleContent, W));
                if (v.toolName === s7 && v.ruleContent) w.push(Qq6(v.ruleContent, W))
            }
        }
        let G = Z?.sandbox?.filesystem;
        if (G) {
            for (let f of G.allowWrite || []) z.push(Qq6(f, W));
            for (let f of G.denyWrite || []) _.push(Qq6(f, W));
            for (let f of G.denyRead || []) w.push(Qq6(f, W))
        }
    }
    let {
        rgPath: M,
        rgArgs: D,
        argv0: X
    } = p$6(), P = A.sandbox?.ripgrep ?? {
        command: M,
        args: D,
        argv0: X
    };
    return {
        network: {
            allowedDomains: K,
            deniedDomains: Y,
            allowUnixSockets: A.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: A.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: A.sandbox?.network?.allowLocalBinding,
            httpProxyPort: A.sandbox?.network?.httpProxyPort,
            socksProxyPort: A.sandbox?.network?.socksProxyPort
        },
        filesystem: {
            denyRead: w,
            allowWrite: z,
            denyWrite: _
        },
        ignoreViolations: A.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: A.sandbox?.enableWeakerNestedSandbox,
        enableWeakerNetworkIsolation: A.sandbox?.enableWeakerNetworkIsolation,
        ripgrep: P
    }
}

// READABLE (for understanding):
function buildSandboxConfig(settings) {
    let permissions = settings.permissions || {};
    let allowedDomains = [];
    let deniedDomains = [];

    // === NETWORK DOMAINS ===
    // Check if managed domains policy is active
    if (isAllowManagedDomainsOnly()) {
        // Use only policy settings for domains
        let policySettings = getSettingsLayer("policySettings");
        allowedDomains = policySettings?.sandbox?.network?.allowedDomains || [];
        // Also extract domain: rules from policy permissions
        for (let rule of policySettings?.permissions?.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
                allowedDomains.push(parsed.ruleContent.substring(7));
            }
        }
    } else {
        // Use local settings for domains
        allowedDomains = settings.sandbox?.network?.allowedDomains || [];
        for (let rule of permissions.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
                allowedDomains.push(parsed.ruleContent.substring(7));
            }
        }
    }

    // Extract denied domains from permission deny rules
    for (let rule of permissions.deny || []) {
        let parsed = parsePermissionRule(rule);
        if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
            deniedDomains.push(parsed.ruleContent.substring(7));
        }
    }

    // === FILESYSTEM PATHS ===
    let allowWrite = [".", getHomeDirectory()];  // Always allow cwd and home
    let denyWrite = [];
    let denyRead = [];

    // Add settings files (must be writable for settings changes)
    let settingsPaths = SETTINGS_SOURCES.map(s => getSettingsPath(s)).filter(Boolean);
    denyWrite.push(...settingsPaths);

    // Add skills directory
    denyWrite.push(joinPath(getRootDir(), ".claude", "skills"));
    if (getRootDir() !== getWorkingDir()) {
        denyWrite.push(joinPath(getWorkingDir(), ".claude", "skills"));
    }

    // Add git directories (must be writable for git operations)
    let gitPaths = ["HEAD", "objects", "refs", "hooks", "config"];
    for (let path of gitPaths) {
        denyWrite.push(joinPath(getWorkingDir(), path));
        if (getRootDir() !== getWorkingDir()) {
            denyWrite.push(joinPath(getRootDir(), path));
        }
    }

    // Add git worktree if detected
    if (gitWorktreePath && gitWorktreePath !== getRootDir()) {
        allowWrite.push(gitWorktreePath);
    }

    // Add additional directories from permissions
    let additionalDirs = new Set([
        ...settings.permissions?.additionalDirectories || [],
        ...getAdditionalDirectories()
    ]);
    allowWrite.push(...additionalDirs);

    // Scan all settings layers for permission rules
    for (let source of SETTINGS_SOURCES) {
        let layerSettings = getSettingsLayer(source);
        if (!layerSettings?.permissions) continue;

        // Write allow rules → allowWrite
        for (let rule of layerSettings.permissions.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "Write" && parsed.ruleContent) {
                allowWrite.push(resolvePathFromSettings(parsed.ruleContent, source));
            }
        }

        // Write deny rules → denyWrite
        for (let rule of layerSettings.permissions.deny || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "Write" && parsed.ruleContent) {
                denyWrite.push(resolvePathFromSettings(parsed.ruleContent, source));
            }
            // Read deny rules → denyRead
            if (parsed.toolName === "Read" && parsed.ruleContent) {
                denyRead.push(resolvePathFromSettings(parsed.ruleContent, source));
            }
        }

        // Sandbox-specific filesystem settings
        let sandboxFs = layerSettings?.sandbox?.filesystem;
        if (sandboxFs) {
            for (let path of sandboxFs.allowWrite || []) {
                allowWrite.push(resolvePathFromSettings(path, source));
            }
            for (let path of sandboxFs.denyWrite || []) {
                denyWrite.push(resolvePathFromSettings(path, source));
            }
            for (let path of sandboxFs.denyRead || []) {
                denyRead.push(resolvePathFromSettings(path, source));
            }
        }
    }

    // === RIPGREP CONFIG ===
    let { rgPath, rgArgs, argv0 } = getRipgrepConfig();
    let ripgrepConfig = settings.sandbox?.ripgrep ?? {
        command: rgPath,
        args: rgArgs,
        argv0: argv0
    };

    return {
        network: {
            allowedDomains,
            deniedDomains,
            allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
            allowAllUnixSockets: settings.sandbox?.network?.allowAllUnixSockets,
            allowLocalBinding: settings.sandbox?.network?.allowLocalBinding,
            httpProxyPort: settings.sandbox?.network?.httpProxyPort,
            socksProxyPort: settings.sandbox?.network?.socksProxyPort
        },
        filesystem: {
            denyRead,
            allowWrite,
            denyWrite
        },
        ignoreViolations: settings.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: settings.sandbox?.enableWeakerNestedSandbox,
        enableWeakerNetworkIsolation: settings.sandbox?.enableWeakerNetworkIsolation,
        ripgrep: ripgrepConfig
    };
}

// Mapping: R21→buildSandboxConfig, A→settings, q→permissions, K→allowedDomains, Y→deniedDomains,
//          Uq6→isAllowManagedDomainsOnly, L8→getSettingsLayer, MD6→parsePermissionRule,
//          sO→WebFetchToolName, z→allowWrite, _→denyWrite, w→denyRead,
//          VG→SETTINGS_SOURCES, OS→getRootDir, AA→getWorkingDir, _k→getHomeDirectory,
//          DD6→gitWorktreePath, pq6→joinPath, Qq6→resolvePathFromSettings
```

### Key Algorithm: Settings-to-Config Transformation

**What it does:** Converts high-level user settings into the low-level config format needed by the sandbox runtime.

**How it works:**
1. **Network domains:** Extracts from both `sandbox.network.allowedDomains` and permission rules with `domain:` prefix
2. **Managed domains:** If policy is active, ignores local settings and uses only policy
3. **Filesystem paths:** Merges from multiple sources:
   - Default: cwd and home directory
   - Settings files (must be writable)
   - Git directories
   - Permission rules (Write/Read tools)
   - Sandbox-specific filesystem settings
4. **Worktree detection:** Reads `.git` file to detect git worktree paths

**Why this approach:**
- Single source of truth: all path config comes from settings
- Permission mirroring: Write/Read permissions automatically apply to sandbox
- Policy compliance: managed domains override local config

---

## Complete Implementation: initializeLowLevel (pb3)

**What it does:** The low-level sandbox initialization that starts proxy servers, creates bridge sockets (Linux), and starts the log monitor (macOS).

**Location:** chunks.55.mjs:3024-3057

```javascript
// ============================================
// initializeLowLevel - Low-level sandbox bootstrap
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
                wA(`Cleanup failed in initializationPromise ${_}`, { level: "error" })
            }), z
        }
    })(), await Ua
}

// READABLE (for understanding):
async function initializeLowLevel(config, onNetworkRequest, startLogMonitor = false) {
    // Already initializing? Wait for existing promise
    if (initializationPromise) {
        await initializationPromise;
        return;
    }

    // Store config
    currentConfig = config;

    // Check dependencies
    let deps = checkDependencies();
    if (deps.errors.length > 0) {
        throw new Error(`Sandbox dependencies not available: ${deps.errors.join(", ")}`);
    }

    // Start macOS log monitor if requested
    if (startLogMonitor && getPlatform() === "macos") {
        logMonitorCleanup = startLogMonitor(
            violationStore.addViolation.bind(violationStore),
            config.ignoreViolations
        );
        logSandbox("Started macOS sandbox log monitor");
    }

    // Register cleanup handlers for process exit
    registerExitCleanup();

    // Main initialization
    initializationPromise = (async () => {
        try {
            // Start HTTP proxy (or use external port)
            let httpPort;
            if (config.network.httpProxyPort !== undefined) {
                httpPort = config.network.httpProxyPort;
                logSandbox(`Using external HTTP proxy on port ${httpPort}`);
            } else {
                httpPort = await startHttpProxy(onNetworkRequest);
            }

            // Start SOCKS proxy (or use external port)
            let socksPort;
            if (config.network.socksProxyPort !== undefined) {
                socksPort = config.network.socksProxyPort;
                logSandbox(`Using external SOCKS proxy on port ${socksPort}`);
            } else {
                socksPort = await startSocksProxy(onNetworkRequest);
            }

            // Linux: Create Unix socket bridges for network namespace
            let linuxBridge = undefined;
            if (getPlatform() === "linux") {
                linuxBridge = await createBridgeSockets(httpPort, socksPort);
            }

            // Store network config
            let networkConfig = {
                httpProxyPort: httpPort,
                socksProxyPort: socksPort,
                linuxBridge: linuxBridge
            };

            storedNetworkConfig = networkConfig;
            logSandbox("Network infrastructure initialized");

            return networkConfig;
        } catch (error) {
            // Reset state on failure
            initializationPromise = undefined;
            storedNetworkConfig = undefined;

            // Attempt cleanup
            await resetLowLevel().catch(cleanupError => {
                logSandbox(`Cleanup failed in initializationPromise ${cleanupError}`, { level: "error" });
            });

            throw error;
        }
    })();

    await initializationPromise;
}

// Mapping: pb3→initializeLowLevel, A→config, q→onNetworkRequest, K→startLogMonitor,
//          Ua→initializationPromise, R5→currentConfig, oZ7→checkDependencies,
//          $v→getPlatform, N21→logMonitorCleanup, UZ7→startLogMonitor,
//          V21→violationStore, mb3→registerExitCleanup, gb3→startHttpProxy,
//          Fb3→startSocksProxy, xZ7→createBridgeSockets, LL→storedNetworkConfig,
//          xw8→resetLowLevel, wA→logSandbox
```

### Key Algorithm: Idempotent Initialization

**What it does:** Ensures sandbox is initialized exactly once, even if multiple callers call `initialize()` concurrently.

**How it works:**
1. Check if `initializationPromise` exists → return existing promise
2. Store config in `currentConfig`
3. Check dependencies → throw if missing
4. Start log monitor (macOS only)
5. Start HTTP proxy → get port
6. Start SOCKS proxy → get port
7. Create bridge sockets (Linux only)
8. Store network config for later use

**Why promise caching:**
- Multiple tools may call `wrapWithSandbox()` before initialization completes
- Prevents double-starting proxy servers
- All callers await the same promise

---

## buildProxyEnvVars Function (f21)

### What it does

Builds the environment variables that configure HTTP/SOCKS proxy settings for sandboxed commands. These variables tell standard tools (curl, git, npm, etc.) to route their network traffic through the sandbox's proxy servers.

### Location: chunks.55.mjs:2102-2112

```javascript
// ============================================
// buildProxyEnvVars - Constructs proxy environment variables
// Location: chunks.55.mjs:2102-2112
// ============================================

// ORIGINAL (for source lookup):
function f21(A, q) {
    let Y = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR||"/tmp/claude"}`];
    if (!A && !q) return Y;
    let z = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
    if (Y.push(`NO_PROXY=${z}`), Y.push(`no_proxy=${z}`), A) Y.push(`HTTP_PROXY=http://localhost:${A}`), Y.push(`HTTPS_PROXY=http://localhost:${A}`), Y.push(`http_proxy=http://localhost:${A}`), Y.push(`https_proxy=http://localhost:${A}`);
    if (q) {
        if (Y.push(`ALL_PROXY=socks5h://localhost:${q}`), Y.push(`all_proxy=socks5h://localhost:${q}`), $v() === "macos") Y.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${q} %h %p'`);
        if (Y.push(`FTP_PROXY=socks5h://localhost:${q}`), Y.push(`ftp_proxy=socks5h://localhost:${q}`), Y.push(`RSYNC_PROXY=localhost:${q}`), Y.push(`DOCKER_HTTP_PROXY=http://localhost:${A||q}`), Y.push(`DOCKER_HTTPS_PROXY=http://localhost:${A||q}`), A) Y.push("CLOUDSDK_PROXY_TYPE=https"), Y.push("CLOUDSDK_PROXY_ADDRESS=localhost"), Y.push(`CLOUDSDK_PROXY_PORT=${A}`);
        Y.push(`GRPC_PROXY=socks5h://localhost:${q}`), Y.push(`grpc_proxy=socks5h://localhost:${q}`)
    }
    return Y
}

// READABLE (for understanding):
function buildProxyEnvVars(httpProxyPort, socksProxyPort) {
    // Base env vars - always set
    let envVars = [
        "SANDBOX_RUNTIME=1",
        `TMPDIR=${process.env.CLAUDE_TMPDIR || "/tmp/claude"}`
    ];

    // No proxies configured - return base vars only
    if (!httpProxyPort && !socksProxyPort) return envVars;

    // NO_PROXY: Traffic to these destinations bypasses proxy
    // Includes: localhost, loopback, link-local, private networks
    let noProxyHosts = [
        "localhost", "127.0.0.1", "::1",
        "*.local", ".local",
        "169.254.0.0/16",  // Link-local
        "10.0.0.0/8",       // Private Class A
        "172.16.0.0/12",    // Private Class B
        "192.168.0.0/16"    // Private Class C
    ].join(",");
    envVars.push(`NO_PROXY=${noProxyHosts}`);
    envVars.push(`no_proxy=${noProxyHosts}`);

    // HTTP proxy - standard HTTP/HTTPS traffic
    if (httpProxyPort) {
        envVars.push(`HTTP_PROXY=http://localhost:${httpProxyPort}`);
        envVars.push(`HTTPS_PROXY=http://localhost:${httpProxyPort}`);
        envVars.push(`http_proxy=http://localhost:${httpProxyPort}`);
        envVars.push(`https_proxy=http://localhost:${httpProxyPort}`);
    }

    // SOCKS proxy - all protocols including SSH, FTP, gRPC
    if (socksProxyPort) {
        envVars.push(`ALL_PROXY=socks5h://localhost:${socksProxyPort}`);
        envVars.push(`all_proxy=socks5h://localhost:${socksProxyPort}`);

        // macOS: Configure git SSH to use SOCKS proxy via netcat
        if (getPlatform() === "macos") {
            envVars.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${socksProxyPort} %h %p'`);
        }

        // FTP and rsync proxy
        envVars.push(`FTP_PROXY=socks5h://localhost:${socksProxyPort}`);
        envVars.push(`ftp_proxy=socks5h://localhost:${socksProxyPort}`);
        envVars.push(`RSYNC_PROXY=localhost:${socksProxyPort}`);

        // Docker proxy configuration
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

// Mapping: f21→buildProxyEnvVars, A→httpProxyPort, q→socksProxyPort,
//          $v→getPlatform
```

### Key Design Decisions

**1. SANDBOX_RUNTIME=1:**
- Signals to sandboxed processes that they're running in sandbox
- Tools can detect and adapt behavior accordingly

**2. TMPDIR Configuration:**
- Set to `/tmp/claude` (or `CLAUDE_TMPDIR` env var)
- Sandbox allows write access to this directory
- Prevents temp file attacks on system temp directories

**3. NO_PROXY for Local Networks:**
- Private IP ranges bypass proxy
- Link-local addresses bypass proxy
- `.local` mDNS domains bypass proxy
- This ensures local network operations work without latency

**4. Dual Case Variables:**
- Both uppercase and lowercase versions (`HTTP_PROXY` and `http_proxy`)
- Some tools only check one or the other

**5. Git SSH via SOCKS:**
- macOS uses `nc` (netcat) as ProxyCommand
- Routes SSH connections through SOCKS proxy
- Enables git+ssh:// URLs to work through sandbox

### Environment Variables by Protocol

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `HTTP_PROXY` | HTTP requests | `http://localhost:12345` |
| `HTTPS_PROXY` | HTTPS requests | `http://localhost:12345` |
| `ALL_PROXY` | All protocols via SOCKS | `socks5h://localhost:12346` |
| `NO_PROXY` | Bypass proxy for these | `localhost,127.0.0.1,...` |
| `GIT_SSH_COMMAND` | Git SSH via SOCKS | `ssh -o ProxyCommand='nc ...'` |
| `GRPC_PROXY` | gRPC via SOCKS | `socks5h://localhost:12346` |
| `TMPDIR` | Temp directory | `/tmp/claude` |

---

## dangerouslyDisableSandbox Flow

### Overview

The `dangerouslyDisableSandbox` parameter is the model's escape hatch from sandbox isolation. It allows the LLM to request running a command outside the sandbox when sandbox restrictions are causing failures. This section documents the complete flow from model intent to execution.

### Input Schema Definition

**Location:** chunks.172.mjs:56

```javascript
// ============================================
// Bash Tool Input Schema with dangerouslyDisableSandbox
// Location: chunks.172.mjs:40-67
// ============================================

// ORIGINAL (for source lookup):
zfq = F6(() => C.strictObject({
    command: C.string().describe("The command to execute"),
    timeout: C.number().optional().describe(`Optional timeout...`),
    description: C.string().optional().describe(`Clear, concise description...`),
    run_in_background: YX(C.boolean().optional()).describe("Set to true to run this command in the background..."),
    dangerouslyDisableSandbox: YX(C.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
    _simulatedSedEdit: C.object({...}).optional().describe("Internal: pre-computed sed edit result...")
}))

// READABLE (for understanding):
BashToolInputSchema = z.strictObject({
    command: z.string().describe("The command to execute"),
    timeout: z.number().optional(),
    description: z.string().optional(),
    run_in_background: z.boolean().optional().describe("Set to true to run this command in the background..."),
    dangerouslyDisableSandbox: z.boolean().optional().describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
    _simulatedSedEdit: z.object({...}).optional()
});

// Mapping: zfq→BashToolInputSchema, C→z, YX→describeWithWarning, F6→lazy
```

**Key insight:** The parameter name `dangerouslyDisableSandbox` intentionally signals risk to the model. The word "dangerously" makes the model think twice before using it and appears prominently in permission prompts.

### Decision Flow Diagram

```
Model calls Bash tool with { command: "npm install", dangerouslyDisableSandbox: true }
    │
    ▼
isCommandSandboxed(input) check (Ti)
    │
    ├─ Gate 1: isSandboxingEnabled() → false?
    │   └─ YES: Command runs unsandboxed (sandbox disabled globally)
    │
    ├─ Gate 2: dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()?
    │   ├─ YES (open mode): Command runs unsandboxed (model override honored)
    │   │   └─ Permission prompt shows: "Bash command (unsandboxed)"
    │   │   └─ Reason: "Run outside of the sandbox"
    │   │
    │   └─ NO (closed mode): Continue to Gate 3
    │       └─ dangerouslyDisableSandbox is IGNORED
    │
    ├─ Gate 3: command exists?
    │   └─ NO: Return false (no command to sandbox)
    │
    ├─ Gate 4: isCommandInExcludedList(command)?
    │   └─ YES: Command runs unsandboxed (excluded by pattern)
    │
    └─ All gates passed: Command runs SANDBOXED
        └─ wrapWithSandbox() is called
```

### Permission Prompt Integration

When `dangerouslyDisableSandbox: true` triggers a permission ask, the UI displays:

**Title:** `"Bash command (unsandboxed)"` (instead of just `"Bash command"`)

**Reason:** `"Run outside of the sandbox"`

**Location:** chunks.172.mjs:2544-2545

```javascript
// ============================================
// formatDecisionMessage - Permission prompt reason text
// Location: chunks.172.mjs:2517-2557
// ============================================

// ORIGINAL (for source lookup):
function ow(A, q) {
    // ... other cases ...
    case "sandboxOverride":
        return "Run outside of the sandbox";
    // ...
}

// READABLE (for understanding):
function formatDecisionMessage(toolName, decisionReason) {
    switch (decisionReason.type) {
        case "sandboxOverride":
            return "Run outside of the sandbox";
        // ... other cases ...
    }
}

// Mapping: ow→formatDecisionMessage
```

### Open vs Closed Mode

The `allowUnsandboxedCommands` setting (default: `true`) determines whether `dangerouslyDisableSandbox` is honored:

| Mode | Setting | Behavior |
|------|---------|----------|
| **Open** | `allowUnsandboxedCommands: true` | Model can bypass sandbox via `dangerouslyDisableSandbox: true`. Permission prompt appears. |
| **Closed** | `allowUnsandboxedCommands: false` | `dangerouslyDisableSandbox` is completely ignored. All commands must run sandboxed or be in `excludedCommands`. |

**Why this distinction matters:**

1. **Open mode (default):** The model can self-heal from sandbox failures. When a command fails due to sandbox restrictions, the model sees the error and can retry with `dangerouslyDisableSandbox: true`.

2. **Closed mode:** Used in enterprise environments where security policy mandates that ALL commands run sandboxed. The only escape hatch is `excludedCommands` which requires explicit configuration.

### System Prompt Instructions

The model receives detailed instructions about when to use `dangerouslyDisableSandbox` via the system prompt injection (`E9z` - getSandboxSystemPromptBlock).

**Open mode instructions (when `areUnsandboxedCommandsAllowed() === true`):**

```markdown
- CRITICAL: Commands run in sandbox mode by default - do NOT set `dangerouslyDisableSandbox`
  - Even if you have recently run commands with `dangerouslyDisableSandbox: true`, you MUST NOT continue that pattern
  - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox
  - Set `dangerouslyDisableSandbox: true` if:
    1. The user *explicitly* asks to bypass sandbox, OR
    2. A command just failed and you see evidence of sandbox restrictions causing the failure
  - Evidence of sandbox-caused failures includes:
    - "Operation not permitted" errors for file/network operations
    - Access denied to specific paths outside allowed directories
    - Network connection failures to non-whitelisted hosts
  - When you see evidence of sandbox-caused failure:
    - IMMEDIATELY retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
    - Briefly explain what sandbox restriction likely caused the failure
```

**Closed mode instructions (when `areUnsandboxedCommandsAllowed() === false`):**

```markdown
- CRITICAL: All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy
```

**Why the anti-learning pattern:**

LLMs tend to persist patterns across a session. If the model uses `dangerouslyDisableSandbox: true` once, it might continue using it for subsequent commands. The explicit warning "Do NOT learn from or repeat the pattern" combats this behavior.

### Closed Mode Implementation

**Location:** chunks.56.mjs:341-343

```javascript
// ============================================
// areUnsandboxedCommandsAllowed - Check if fallback mode is open
// Location: chunks.56.mjs:341-343
// ============================================

// ORIGINAL (for source lookup):
function Hx3() {
    return PA()?.sandbox?.allowUnsandboxedCommands ?? !0
}

// READABLE (for understanding):
function areUnsandboxedCommandsAllowed() {
    // Default: true (open mode)
    return getSettings()?.sandbox?.allowUnsandboxedCommands ?? true;
}

// Mapping: Hx3→areUnsandboxedCommandsAllowed, PA→getSettings
```

When this returns `false`, Gate 2 of `isCommandSandboxed` can never pass, so `dangerouslyDisableSandbox` is effectively ignored:

```javascript
// In isCommandSandboxed (Ti):
if (bashToolInput.dangerouslyDisableSandbox && sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
    return false;  // This block is NEVER entered in closed mode
}
```

---

## Algorithm Deep-Dives

This section provides source-level analysis of key decision algorithms in the sandbox system.

### isCommandInExcludedList Algorithm (yYz)

**Location:** chunks.172.mjs:2412-2452

**What it does:** Determines if a command matches any pattern in the `excludedCommands` settings list. Commands in this list run outside the sandbox without requiring `dangerouslyDisableSandbox`.

**How it works:**

```javascript
// ============================================
// isCommandInExcludedList - Check command against exclusion patterns
// Location: chunks.172.mjs:2412-2452
// ============================================

// ORIGINAL (for source lookup):
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try {
        Y = EO(A)  // Split command into pipeline parts
    } catch {
        Y = [A]    // Fallback: treat entire string as one command
    }
    for (let z of Y) {
        let w = [z.trim()],
            O = new Set(w),
            $ = 0;
        // Expand command variants by stripping env vars and prefixes
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq);  // Strip env var assignments
                if (!O.has(M)) w.push(M), O.add(M);
                let D = Ac(J);        // Extract command basename
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        // Match each variant against exclusion patterns
        for (let H of K) {
            let j = In8(H);  // Parse pattern into {type, prefix/command/pattern}
            for (let J of w) switch (j.type) {
                case "prefix":
                    if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === j.command) return !0;
                    break;
                case "wildcard":
                    if (Cn8(j.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    let patterns = getSettings().sandbox?.excludedCommands ?? [];
    if (patterns.length === 0) return false;

    // Split pipeline into individual commands (e.g., "a | b" → ["a", "b"])
    let commandParts;
    try {
        commandParts = splitPipeline(command);
    } catch {
        commandParts = [command];  // Fallback on parse error
    }

    for (let part of commandParts) {
        // Build variants: original, with env vars stripped, with basename extracted
        let variants = [part.trim()];
        let seen = new Set(variants);
        let processedIndex = 0;

        while (processedIndex < variants.length) {
            let batchEnd = variants.length;
            for (let i = processedIndex; i < batchEnd; i++) {
                let variant = variants[i];

                // Strip environment variable assignments
                let strippedEnv = resolveCommandEnvVars(variant, LD_PATH_REGEX);
                if (!seen.has(strippedEnv)) {
                    variants.push(strippedEnv);
                    seen.add(strippedEnv);
                }

                // Extract just the command name (basename)
                let basename = extractCommandBasename(variant);
                if (!seen.has(basename)) {
                    variants.push(basename);
                    seen.add(basename);
                }
            }
            processedIndex = batchEnd;
        }

        // Check each variant against each pattern
        for (let pattern of patterns) {
            let parsed = parseExclusionPattern(pattern);
            for (let variant of variants) {
                switch (parsed.type) {
                    case "prefix":
                        // "npm run:*" matches "npm run test", "npm run build"
                        if (variant === parsed.prefix || variant.startsWith(parsed.prefix + " ")) {
                            return true;
                        }
                        break;
                    case "exact":
                        // "cat" matches only "cat"
                        if (variant === parsed.command) return true;
                        break;
                    case "wildcard":
                        // "npm*:test" matches "npm run test", "npmx test"
                        if (matchWildcardPattern(parsed.pattern, variant)) return true;
                        break;
                }
            }
        }
    }
    return false;
}

// Mapping: yYz→isCommandInExcludedList, PA→getSettings, EO→splitPipeline,
//          bn8→resolveCommandEnvVars, xfq→LD_PATH_REGEX, Ac→extractCommandBasename,
//          In8→parseExclusionPattern, Cn8→matchWildcardPattern
```

**Why this approach:**

1. **Pipeline splitting:** A command like `npm install | grep success` needs to check both parts. If `npm install` is excluded, the whole pipeline runs unsandboxed.

2. **Variant expansion:** The command `NODE_ENV=prod npm run test` should match `npm run:*`. The algorithm strips env vars to get `npm run test`, then extracts basename `npm` to cover all cases.

3. **Three pattern types:**
   - **Prefix** (`npm:*`): Matches commands starting with the prefix
   - **Exact** (`cat`): Matches only the exact command
   - **Wildcard** (`npm*:test`): Glob-style matching for complex patterns

**Key insight:** The variant expansion is iterative (while loop) because stripping env vars might reveal another env var to strip. Example: `A=1 B=2 npm test` needs two passes.

---

### parseExclusionPattern Algorithm (yfq)

**Location:** chunks.172.mjs:1530-1544

**What it does:** Classifies an exclusion pattern string into one of three types: prefix, wildcard, or exact match.

```javascript
// ============================================
// parseExclusionPattern - Classify exclusion pattern type
// Location: chunks.172.mjs:1530-1544
// ============================================

// ORIGINAL (for source lookup):
function yfq(A) {
    let q = Ln8(A);  // Check for prefix pattern (ends with :*)
    if (q !== null) return {
        type: "prefix",
        prefix: q
    };
    if (TYz(A)) return {  // Check for wildcard characters
        type: "wildcard",
        pattern: A
    };
    return {
        type: "exact",
        command: A
    };
}

// READABLE (for understanding):
function parseExclusionPattern(pattern) {
    // 1. Check for prefix pattern: "command:*"
    let prefix = extractPrefixPattern(pattern);
    if (prefix !== null) {
        return { type: "prefix", prefix };
    }

    // 2. Check for wildcard characters: "*", "?"
    if (isWildcardPattern(pattern)) {
        return { type: "wildcard", pattern };
    }

    // 3. Default: exact match
    return { type: "exact", command: pattern };
}

// Mapping: yfq→parseExclusionPattern, Ln8→extractPrefixPattern, TYz→isWildcardPattern
```

### extractPrefixPattern Algorithm (Ln8)

**Location:** chunks.172.mjs:1488-1490

```javascript
// ============================================
// extractPrefixPattern - Extract prefix from "command:*" pattern
// Location: chunks.172.mjs:1488-1490
// ============================================

// ORIGINAL (for source lookup):
function Ln8(A) {
    return A.match(/^(.+):\*$/)?.[1] ?? null
}

// READABLE (for understanding):
function extractPrefixPattern(pattern) {
    // Match patterns like "npm:*" → returns "npm"
    // Match "npm run:*" → returns "npm run"
    let match = pattern.match(/^(.+):\*$/);
    return match ? match[1] : null;
}

// Examples:
// "npm:*" → "npm"
// "npm run:*" → "npm run"
// "cat" → null (no prefix)
// "npm*:test" → null (wildcard, not prefix)
```

### isWildcardPattern Algorithm (TYz)

**Location:** chunks.172.mjs:1492-1498

```javascript
// ============================================
// isWildcardPattern - Check if pattern contains unescaped wildcards
// Location: chunks.172.mjs:1492-1498
// ============================================

// ORIGINAL (for source lookup):
function TYz(A) {
    if (A.endsWith(":*")) return !1;  // Prefix patterns are NOT wildcards
    for (let q = 0; q < A.length; q++)
        if (A[q] === "*") {
            // Check if escaped: preceding backslashes
            let K = 0, Y = q - 1;
            while (Y >= 0 && A[Y] === "\\") K++, Y--;
            // Odd number of backslashes = escaped (not a wildcard)
            if (K % 2 === 0) return !0
        }
    return !1
}

// READABLE (for understanding):
function isWildcardPattern(pattern) {
    // Prefix patterns are NOT wildcards (handled separately)
    if (pattern.endsWith(":*")) return false;

    // Look for unescaped '*' characters
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === "*") {
            // Count preceding backslashes
            let backslashCount = 0;
            let j = i - 1;
            while (j >= 0 && pattern[j] === "\\") {
                backslashCount++;
                j--;
            }
            // Even backslashes = not escaped = real wildcard
            if (backslashCount % 2 === 0) return true;
        }
    }
    return false;
}

// Examples:
// "npm*" → true (wildcard)
// "npm\\*" → false (escaped, literal asterisk)
// "npm:*" → false (prefix pattern)
// "npm*:test" → true (wildcard)
```

**Why escape handling:** Users might want to exclude a command literally named `npm*` (unlikely but valid). The pattern `npm\\*` matches the literal string "npm*".

---

### extractCommandBasename Algorithm (Ac)

**Location:** chunks.172.mjs:1660-1680

**What it does:** Strips command wrappers (timeout, time, nice, nohup) and environment variables to extract the actual command name.

```javascript
// ============================================
// extractCommandBasename - Extract base command from wrapped command
// Location: chunks.172.mjs:1660-1680
// ============================================

// ORIGINAL (for source lookup):
function Ac(A) {
    let q = [/^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|...)+\d+(?:\.\d+)?[smhd]?[ \t]+/,
             /^time[ \t]+(?:--[ \t]+)?/,
             /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/,
             /^nohup[ \t]+(?:--[ \t]+)?/],
        K = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/,
        Y = A,
        z = "";
    // Loop 1: Strip safe env vars
    while (Y !== z) {
        z = Y, Y = hn8(Y);  // Remove comments
        let _ = Y.match(K);
        if (_) {
            let w = _[1];  // Env var name
            if (AS1.has(w)) Y = Y.replace(K, "")  // Safe env var, strip it
        }
    }
    z = "";
    // Loop 2: Strip command wrappers
    while (Y !== z) {
        z = Y, Y = hn8(Y);
        for (let _ of q) Y = Y.replace(_, "")
    }
    return Y.trim()
}

// READABLE (for understanding):
function extractCommandBasename(command) {
    // Regex patterns for command wrappers
    let wrapperPatterns = [
        /^timeout[ \t]+(?:(?:--options...)+\d+(?:\.\d+)?[smhd]?[ \t]+/,  // timeout 10s ...
        /^time[ \t]+(?:--[ \t]+)?/,                                        // time ...
        /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/,                    // nice -n 10 ...
        /^nohup[ \t]+(?:--[ \t]+)?/                                        // nohup ...
    ];
    let envVarPattern = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/;

    let result = command;
    let previous = "";

    // Phase 1: Strip safe environment variables
    while (result !== previous) {
        previous = result;
        result = removeComments(result);
        let match = result.match(envVarPattern);
        if (match) {
            let envVarName = match[1];
            if (SAFE_ENV_VARS_SET.has(envVarName)) {
                result = result.replace(envVarPattern, "");
            }
        }
    }

    // Phase 2: Strip command wrappers
    previous = "";
    while (result !== previous) {
        previous = result;
        result = removeComments(result);
        for (let pattern of wrapperPatterns) {
            result = result.replace(pattern, "");
        }
    }

    return result.trim();
}

// Mapping: Ac→extractCommandBasename, hn8→removeComments, AS1→SAFE_ENV_VARS_SET
```

**Why two-phase loop:** Each phase might need multiple passes. For `A=1 B=2 timeout 10s npm test`:
1. Phase 1 strips `A=1 ` → `B=2 timeout 10s npm test`
2. Phase 1 strips `B=2 ` → `timeout 10s npm test`
3. Phase 2 strips `timeout 10s ` → `npm test`

**SAFE_ENV_VARS_SET (AS1):**
```javascript
// Location: chunks.172.mjs:2407
AS1 = new Set([
    "GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE",
    "RUST_BACKTRACE", "RUST_LOG",
    "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE",
    "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG",
    "ANTHROPIC_API_KEY",
    "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME",
    "CHARSET", "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR",
    "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS",
    "GCC_COLORS", "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE"
]);
```

These are "safe" because they don't affect system security -- they only affect language runtimes and display settings.

---

### matchWildcardPattern Algorithm (Cn8)

**Location:** chunks.172.mjs:1645-1647 (delegates to Efq at chunks.172.mjs:1503-1528)

**What it does:** Glob-style pattern matching with escape support for literal asterisks.

```javascript
// ============================================
// matchWildcardPattern - Glob-style pattern matching
// Location: chunks.172.mjs:1645-1647 (wrapper), chunks.172.mjs:1503-1528 (impl)
// ============================================

// ORIGINAL (for source lookup):
function Cn8(A, q) {
    return Efq(A, q)  // Delegate to implementation
}

function Efq(A, q, K = !1) {
    let Y = A.trim(),
        z = "\x00ESCAPED_STAR\x00",
        _ = "\x00ESCAPED_BACKSLASH\x00",
        w = "",
        O = 0;
    // Pass 1: Escape handling
    while (O < Y.length) {
        let X = Y[O];
        if (X === "\\" && O + 1 < Y.length) {
            let P = Y[O + 1];
            if (P === "*") {
                w += "\x00ESCAPED_STAR\x00", O += 2;  // Replace \* with placeholder
                continue
            } else if (P === "\\") {
                w += "\x00ESCAPED_BACKSLASH\x00", O += 2;  // Replace \\ with placeholder
                continue
            }
        }
        w += X, O++
    }
    // Pass 2: Convert to regex
    let j = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")  // Escape regex special chars
              .replace(/\*/g, ".*")                     // Convert * to .*
              .replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*")      // Restore \* as literal
              .replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\"); // Restore \\

    // Handle "pattern *" (with trailing space-star) as optional suffix
    let J = (w.match(/\*/g) || []).length;
    if (j.endsWith(" .*") && J === 1) {
        j = j.slice(0, -3) + "( .*)?";
    }

    let M = "s" + (K ? "i" : "");  // Case sensitivity flag
    return new RegExp(`^${j}$`, M).test(q);
}

// READABLE (for understanding):
function matchWildcardPattern(pattern, text, caseInsensitive = false) {
    let p = pattern.trim();

    // Step 1: Replace escaped sequences with placeholders
    // \* becomes PLACEHOLDER_STAR, \\ becomes PLACEHOLDER_BACKSLASH
    let processed = "";
    let i = 0;
    while (i < p.length) {
        if (p[i] === "\\" && i + 1 < p.length) {
            if (p[i + 1] === "*") {
                processed += "\x00ESCAPED_STAR\x00";
                i += 2;
                continue;
            } else if (p[i + 1] === "\\") {
                processed += "\x00ESCAPED_BACKSLASH\x00";
                i += 2;
                continue;
            }
        }
        processed += p[i];
        i++;
    }

    // Step 2: Convert to regex
    let regex = processed
        .replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")    // Escape regex specials
        .replace(/\*/g, ".*")                        // * → .*
        .replace(/\x00ESCAPED_STAR\x00/g, "\\*")    // \* → literal *
        .replace(/\x00ESCAPED_BACKSLASH\x00/g, "\\\\");  // \\ → literal \

    // Step 3: Special handling for "command *" → optional suffix
    let wildcardCount = (processed.match(/\*/g) || []).length;
    if (regex.endsWith(" .*") && wildcardCount === 1) {
        regex = regex.slice(0, -3) + "( .*)?";  // "npm *args" → matches "npm" or "npm args"
    }

    let flags = "s" + (caseInsensitive ? "i" : "");
    return new RegExp(`^${regex}$`, flags).test(text);
}

// Mapping: Cn8→matchWildcardPattern, Efq→matchWildcardPatternImpl
```

**Why placeholder approach:** Direct string manipulation would be error-prone. Using unique placeholders ensures escaped sequences survive the regex conversion process.

**Examples:**
| Pattern | Text | Match? | Reason |
|---------|------|--------|--------|
| `npm*` | `npm install` | ✓ | `npm.*` matches |
| `npm*` | `npm` | ✓ | `npm.*` matches empty string |
| `npm run:*` | `npm run test` | ✓ | Prefix pattern |
| `npm\\*` | `npm*` | ✓ | Literal asterisk |
| `npm *` | `npm` | ✓ | Optional suffix (special case) |
| `npm *` | `npm install` | ✓ | Optional suffix matches |

---

### buildFilesystemMounts Algorithm (Rb3)

**Location:** chunks.55.mjs:2491-2562

**What it does:** Constructs the bwrap mount arguments for Linux sandbox filesystem isolation. Handles write allow/deny paths, read deny paths, and symlink attack mitigation.

```javascript
// ============================================
// buildFilesystemMounts - Linux bwrap filesystem mount construction
// Location: chunks.55.mjs:2491-2562
// ============================================

// ORIGINAL (for source lookup):
async function Rb3(A, q, K = { command: "rg" }, Y = Rw8, z = !1, _) {
    let w = [];
    if (q) {
        w.push("--ro-bind", "/", "/");  // Start with read-only root
        let $ = [];  // Track allowed write paths
        for (let j of q.allowOnly || []) {
            let J = EL(j);  // Resolve path
            // Skip /dev paths
            if (J.startsWith("/dev/")) continue;
            // Skip non-existent paths
            if (!$2.existsSync(J)) continue;
            // Symlink attack mitigation
            try {
                let M = $2.realpathSync(J), D = J.replace(/\/+$/, "");
                if (M !== D && Z21(J, M)) {
                    wA(`Skipping symlink pointing outside: ${j} -> ${M}`);
                    continue;
                }
            } catch { continue; }
            w.push("--bind", J, J);  // Writable bind mount
            $.push(J);  // Track for deny-within-allow checks
        }
        // Process deny paths within allowed areas
        let H = [...q.denyWithinAllow || [], ...await yb3(K, Y, z, _)];
        for (let j of H) {
            let J = EL(j);
            if (J.startsWith("/dev/")) continue;
            // Check for symlink attack
            let M = Vb3(J, $);
            if (M) {
                w.push("--ro-bind", "/dev/null", M);  // Block symlink target
                continue;
            }
            // Handle non-existent deny paths
            if (!$2.existsSync(J)) {
                if (kb3(J)) continue;  // Has file ancestor - can't create
                // Find nearest existing ancestor
                let X = IJ.dirname(J);
                while (X !== "/" && !$2.existsSync(X)) X = IJ.dirname(X);
                // Check if within allowed write area
                if ($.some((W) => X.startsWith(W + "/") || X === W || J.startsWith(W + "/"))) {
                    let W = Eb3(J);  // Find first non-existent path
                    let Z = $2.mkdtempSync(IJ.join(Ew8(), "claude-empty-"));
                    w.push("--ro-bind", Z, W);  // Mount empty dir to block creation
                    v21.add(W);  // Track for cleanup
                }
                continue;
            }
            // Mount read-only if within allowed area
            if ($.some((X) => J.startsWith(X + "/") || J === X)) {
                w.push("--ro-bind", J, J);
            }
        }
    } else {
        w.push("--bind", "/", "/");  // Full write access
    }
    // Handle read deny paths
    let O = [...A?.denyOnly || []];
    if ($2.existsSync("/etc/ssh/ssh_config.d")) O.push("/etc/ssh/ssh_config.d");
    for (let $ of O) {
        let H = EL($);
        if (!$2.existsSync(H)) continue;
        if ($2.statSync(H).isDirectory()) {
            w.push("--tmpfs", H);  // Mount empty tmpfs for directories
        } else {
            w.push("--ro-bind", "/dev/null", H);  // Block files with /dev/null
        }
    }
    return w;
}

// READABLE (for understanding):
async function buildFilesystemMounts(readConfig, writeConfig, ripgrepConfig, mandatoryDenyDepth, allowGitConfig, abortSignal) {
    let mountArgs = [];

    // CASE 1: Write restrictions configured
    if (writeConfig) {
        // Start with read-only root filesystem
        mountArgs.push("--ro-bind", "/", "/");

        let allowedWritePaths = [];

        // Process write-allowed paths
        for (let path of writeConfig.allowOnly || []) {
            let resolved = resolvePath(path);

            // Skip device paths
            if (resolved.startsWith("/dev/")) {
                log(`Skipping /dev path: ${resolved}`);
                continue;
            }

            // Skip non-existent paths
            if (!fs.existsSync(resolved)) {
                log(`Skipping non-existent write path: ${resolved}`);
                continue;
            }

            // SYMLINK ATTACK MITIGATION
            try {
                let realPath = fs.realpathSync(resolved);
                let normalized = resolved.replace(/\/+$/, "");
                if (realPath !== normalized && isSymlinkEscaping(resolved, realPath)) {
                    log(`Skipping symlink escaping expected location: ${path} -> ${realPath}`);
                    continue;
                }
            } catch {
                continue;
            }

            // Add writable bind mount
            mountArgs.push("--bind", resolved, resolved);
            allowedWritePaths.push(resolved);
        }

        // Process deny-within-allow paths
        let denyPaths = [
            ...(writeConfig.denyWithinAllow || []),
            ...(await findDangerousFiles(ripgrepConfig, mandatoryDenyDepth, allowGitConfig, abortSignal))
        ];

        for (let denyPath of denyPaths) {
            let resolved = resolvePath(denyPath);

            // Skip device paths
            if (resolved.startsWith("/dev/")) continue;

            // SYMLINK REPLACEMENT ATTACK DETECTION
            let symlinkMountPoint = findSymlinkInPath(resolved, allowedWritePaths);
            if (symlinkMountPoint) {
                // Mount /dev/null at symlink to prevent writes through it
                mountArgs.push("--ro-bind", "/dev/null", symlinkMountPoint);
                log(`Mounted /dev/null at symlink ${symlinkMountPoint} to prevent symlink replacement attack`);
                continue;
            }

            // Handle non-existent deny paths
            if (!fs.existsSync(resolved)) {
                // Can't create if path has a file ancestor
                if (hasFileAncestor(resolved)) {
                    log(`Skipping deny path with file ancestor: ${resolved}`);
                    continue;
                }

                // Find nearest existing ancestor
                let ancestor = path.dirname(resolved);
                while (ancestor !== "/" && !fs.existsSync(ancestor)) {
                    ancestor = path.dirname(ancestor);
                }

                // Only block if within allowed write area
                if (allowedWritePaths.some(p =>
                    ancestor.startsWith(p + "/") ||
                    ancestor === p ||
                    resolved.startsWith(p + "/")
                )) {
                    let firstNonexistent = findFirstNonexistentPath(resolved);
                    let emptyDir = fs.mkdtempSync(path.join(tmpDir(), "claude-empty-"));
                    mountArgs.push("--ro-bind", emptyDir, firstNonexistent);
                    trackForCleanup(firstNonexistent);
                    log(`Mounted empty dir at ${firstNonexistent} to block creation of ${resolved}`);
                }
                continue;
            }

            // Mount read-only if within allowed area
            if (allowedWritePaths.some(p => resolved.startsWith(p + "/") || resolved === p)) {
                mountArgs.push("--ro-bind", resolved, resolved);
            }
        }
    } else {
        // CASE 2: No write restrictions - full filesystem access
        mountArgs.push("--bind", "/", "/");
    }

    // Handle read deny paths
    let readDenyPaths = [...(readConfig?.denyOnly || [])];
    // Always block ssh_config.d if it exists
    if (fs.existsSync("/etc/ssh/ssh_config.d")) {
        readDenyPaths.push("/etc/ssh/ssh_config.d");
    }

    for (let denyPath of readDenyPaths) {
        let resolved = resolvePath(denyPath);

        if (!fs.existsSync(resolved)) {
            log(`Skipping non-existent read deny path: ${resolved}`);
            continue;
        }

        if (fs.statSync(resolved).isDirectory()) {
            // Mount empty tmpfs for directories
            mountArgs.push("--tmpfs", resolved);
        } else {
            // Mount /dev/null for files
            mountArgs.push("--ro-bind", "/dev/null", resolved);
        }
    }

    return mountArgs;
}

// Mapping: Rb3→buildFilesystemMounts, A→readConfig, q→writeConfig, K→ripgrepConfig,
//          Y→mandatoryDenyDepth, z→allowGitConfig, _→abortSignal, EL→resolvePath,
//          $2→fs, Vb3→findSymlinkInPath, kb3→hasFileAncestor, Eb3→findFirstNonexistentPath,
//          yb3→findDangerousFiles, Z21→isSymlinkEscaping, w→mountArgs
```

**Key Algorithm: Symlink Attack Mitigation**

**What it does:** Prevents an attacker from replacing a symlink within an allowed write path to gain access to sensitive files.

**Attack scenario:**
```
1. Allowed write path: /home/user/project
2. Deny path: /home/user/.ssh (a symlink to /home/user/project/.ssh)
3. Attacker removes symlink, creates directory .ssh in project
4. Attacker now has write access to what was supposed to be blocked
```

**Defense:**
```
1. For each deny path, check if any component is a symlink
2. If symlink points into an allowed write area:
   - Mount /dev/null at the symlink's parent location
   - This blocks both reading and writing through the symlink
```

**Why mount /dev/null:**
- Cannot be written to (reads return EOF, writes are discarded)
- Cannot be read from (returns empty)
- Standard Unix device, always present
- Blocks both read and write access at that path

---

### matchDomainPattern Algorithm (bw8)

**Location:** chunks.55.mjs:2952-2958

**What it does:** Matches a hostname against a domain pattern with wildcard support. Used for network permission filtering.

```javascript
// ============================================
// matchDomainPattern - Domain wildcard matching for network filtering
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
function matchDomainPattern(hostname, pattern) {
    // Wildcard pattern: *.example.com
    if (pattern.startsWith("*.")) {
        let baseDomain = pattern.substring(2);  // Remove "*."
        // Match: hostname ends with .example.com
        return hostname.toLowerCase().endsWith("." + baseDomain.toLowerCase());
    }

    // Exact match (case-insensitive)
    return hostname.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchDomainPattern, A→hostname, q→pattern
```

**Why this approach:**
- **Simple but effective:** Only supports `*.domain` prefix wildcards
- **Case-insensitive:** DNS is case-insensitive
- **No regex:** Avoids regex overhead and complexity
- **Secure:** Wildcard must be at start, prevents `*` in middle

**Examples:**
| Pattern | Hostname | Match? |
|---------|----------|--------|
| `*.example.com` | `api.example.com` | ✓ |
| `*.example.com` | `sub.api.example.com` | ✓ |
| `*.example.com` | `example.com` | ✗ (no dot prefix) |
| `example.com` | `example.com` | ✓ |
| `example.com` | `api.example.com` | ✗ |

**Important:** `*.example.com` does NOT match `example.com` directly. The pattern requires at least one subdomain.

---

### Network Permission Check Flow (nZ7)

**Location:** chunks.55.mjs:2960-2979

**What it does:** Checks if a network request to a host:port should be allowed, denied, or requires user confirmation.

```javascript
// ============================================
// checkNetworkPermission - Domain-based network access control
// Location: chunks.55.mjs:2960-2979
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
async function checkNetworkPermission(port, hostname, onPermissionRequest) {
    // No config? Default deny
    if (!currentConfig) {
        log("No config available, denying network request");
        return false;
    }

    // CHECK 1: Denied domains (takes precedence)
    for (let denied of currentConfig.network.deniedDomains) {
        if (matchDomainPattern(hostname, denied)) {
            log(`Denied by config rule: ${hostname}:${port}`);
            return false;  // Immediate deny, no further checks
        }
    }

    // CHECK 2: Allowed domains
    for (let allowed of currentConfig.network.allowedDomains) {
        if (matchDomainPattern(hostname, allowed)) {
            log(`Allowed by config rule: ${hostname}:${port}`);
            return true;  // Explicitly allowed
        }
    }

    // CHECK 3: No match found - ask user or default deny
    if (!onPermissionRequest) {
        log(`No matching config rule, denying: ${hostname}:${port}`);
        return false;  // No callback - must deny
    }

    // Ask user via callback
    log(`No matching config rule, asking user: ${hostname}:${port}`);
    try {
        let allowed = await onPermissionRequest({ host: hostname, port });
        log(`${allowed ? 'User allowed' : 'User denied'}: ${hostname}:${port}`);
        return allowed;
    } catch (error) {
        log(`Error in permission callback: ${error}`, { level: "error" });
        return false;  // Error - default deny
    }
}

// Mapping: nZ7→checkNetworkPermission, A→port, q→hostname, K→onPermissionRequest,
//          R5→currentConfig, bw8→matchDomainPattern, wA→log
```

**Decision Flow:**
```
Network request to host:port
    │
    ▼
Check deniedDomains list
    │
    ├─ host matches denied pattern → DENY (no further checks)
    │
    └─ no deny match ──► Check allowedDomains list
                            │
                            ├─ host matches allowed pattern → ALLOW
                            │
                            └─ no allow match ──► onPermissionRequest callback?
                                                     │
                                                     ├─ Yes → Ask user → ALLOW/DENY
                                                     │
                                                     └─ No → DENY (default)
```

**Key Design Decision:** Deny list is checked FIRST, before allow list. This ensures explicit denials always take precedence, even if an allow rule would match.

---

## Related Documents

- [initialization_flow.md](./initialization_flow.md) - Sandbox bootstrap sequence
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec implementation
- [ui_linkage.md](./ui_linkage.md) - UI components and interactions
- [cross_module_integration.md](./cross_module_integration.md) - Cross-module integration
- [symbol_validation.md](./symbol_validation.md) - Symbol mappings
- [violation_system.md](./violation_system.md) - Violation detection and correlation
- [network_proxy.md](./network_proxy.md) - HTTP/SOCKS proxy implementation
- [seccomp_filter.md](./seccomp_filter.md) - Linux seccomp BPF filter
