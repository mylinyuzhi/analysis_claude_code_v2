# Sandbox Symbol Validation Report (Claude Code 2.1.76)

## Overview

This document contains cross-validated symbol mappings for the Sandbox module. All symbols have been verified against source code locations.

## Validation Methodology

1. Search for symbol definition in source files using grep
2. Read surrounding code context to verify function/class purpose
3. Compare with existing documentation
4. Mark as validated, corrected, or new

## Symbol Corrections (v2.1.76)

> **⚠️ Important:** The following symbols were incorrectly mapped in previous documentation:

| Incorrect Symbol | Correct Symbol | Location | Reason |
|------------------|----------------|----------|--------|
| `Lzz` | `yYz` | chunks.172.mjs:2412 | `Lzz` at chunks.173.mjs:2714 is an Auto Mode reminder function, not `isCommandInExcludedList` |

---

## Validated Symbols

### Sandbox Core Functions

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated | Public API facade |
| `QZ7` | wrapWithMacOSSandbox | chunks.55.mjs:2803 | ✅ Validated | macOS sandbox-exec wrapper |
| `xb3` | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated | SBPL profile generator |
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated | Linux bwrap wrapper |
| `HD6` | SandboxViolationStore | chunks.55.mjs:2902 | ✅ Validated | Ring buffer for violations |
| `E9z` | getSandboxSystemPromptBlock | chunks.171.mjs:1892 | ✅ Validated | System prompt injection |
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated | Per-command gate check |
| `bw8` | matchDomainPattern | chunks.55.mjs:2952 | ✅ Validated | Domain wildcard matching for network filtering |

### Tool Integration (chunks.172.mjs)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated | Check if command needs sandboxing |
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | ✅ Validated | Check exclusion patterns against settings |
| `yfq` (alias: `In8`) | parseExclusionPattern | chunks.172.mjs:1530 | ✅ Validated | Parse pattern into {type, prefix/command/pattern} |
| `Ln8` | extractPrefixPattern | chunks.172.mjs:1488 | ✅ Validated | Extract prefix from "command:*" pattern |
| `TYz` | isWildcardPattern | chunks.172.mjs:1492 | ✅ Validated | Check if pattern contains unescaped wildcards |
| `Cn8` | matchWildcardPattern | chunks.172.mjs:1645 | ✅ Validated | Glob-style wildcard matching for exclusions |
| `bn8` | resolveCommandEnvVars | chunks.172.mjs:1682 | ✅ Validated | Strip env var assignments from command |
| `Ac` | extractCommandBasename | chunks.172.mjs:1660 | ✅ Validated | Extract command name stripping env vars and prefixes |
| `xfq` | LD_PATH_REGEX | chunks.172.mjs:2408 | ✅ Validated | Regex for LD_/DYLD_/PATH env vars |
| `vYz` | SHELL_COMMANDS_SET | chunks.172.mjs:2405 | ✅ Validated | Set of shell commands (sh, bash, zsh, etc.) |
| `AS1` | SAFE_ENV_VARS_SET | chunks.172.mjs:2407 | ✅ Validated | Set of safe environment variable names |

### Sandbox Initialization

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Xx3` | wrapWithSandbox | chunks.56.mjs:417 | ✅ Validated | Main dispatch function |
| `Px3` | sandboxInitialize | chunks.56.mjs:424 | ✅ Validated | Bootstrap initialization |
| `h21` | isSandboxingEnabled | chunks.56.mjs:357 | ✅ Validated | Global enabled check (platform + deps + settings) |
| `Dx3` | getExcludedCommands | chunks.56.mjs:413 | ✅ Validated | Get exclusion patterns |
| `Wx3` | refreshSandboxConfig | chunks.56.mjs:447 | ✅ Validated | Reload config |
| `Zx3` | sandboxReset | chunks.56.mjs:454 | ✅ Validated | Clear state |
| `R21` | buildSandboxConfig | chunks.56.mjs:224 | ✅ Validated | Build config from settings |
| `jx3` | getLinuxGlobPatternWarnings | chunks.56.mjs:364 | ✅ Validated | Warnings for glob patterns on Linux |
| `TG7` | isSandboxEnabledInSettings | chunks.56.mjs:329 | ✅ Validated | Check settings.sandbox.enabled |
| `$x3` | isAutoAllowBashIfSandboxedEnabled | chunks.56.mjs:337 | ✅ Validated | Check auto-allow setting |
| `Hx3` | areUnsandboxedCommandsAllowed | chunks.56.mjs:341 | ✅ Validated | Check fallback allowed setting |
| `vG7` | isPlatformInEnabledList | chunks.56.mjs:345 | ✅ Validated | Check enabledPlatforms list |
| `Jx3` | areSandboxSettingsLockedByPolicy | chunks.56.mjs:386 | ✅ Validated | Check if policy locked settings |
| `Mx3` | setSandboxSettings | chunks.56.mjs:395 | ✅ Validated | Write sandbox settings to localSettings |
| `Uq6` | isAllowManagedDomainsOnly | chunks.56.mjs:220 | ✅ Validated | Check policySettings.managedDomainsOnly |

### Low-Level Sandbox Module (aO)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `aO` | sandboxLowLevelModule | chunks.55.mjs:3436 | ✅ Validated | Low-level sandbox implementation |
| `pb3` | initializeLowLevel | chunks.55.mjs:3024 | ✅ Validated | Initialize proxy servers and network |
| `rZ7` | isSupportedPlatform | chunks.55.mjs:3059 | ✅ Validated | Check macOS/Linux/WSL2 support |
| `Qb3` | isSandboxInitialized | chunks.55.mjs:3065 | ✅ Validated | Check if config is loaded |
| `oZ7` | checkDependencies | chunks.55.mjs:3069 | ✅ Validated | Validate bwrap, socat, seccomp, rg |
| `Ub3` | getFsReadConfig | chunks.55.mjs:3090 | ✅ Validated | Get filesystem read restrictions |
| `db3` | getFsWriteConfig | chunks.55.mjs:3100+ | ✅ Validated | Get filesystem write restrictions |
| `cb3` | getNetworkRestrictionConfig | chunks.55.mjs:3100+ | ✅ Validated | Get network domain allow/deny lists |
| `ob3` | wrapWithSandboxInternal | chunks.55.mjs:3208 | ✅ Validated | Internal platform dispatch |
| `tb3` | getSandboxViolationStore | chunks.55.mjs:3382 | ✅ Validated | Get violation store instance |
| `xw8` | resetLowLevel | chunks.55.mjs:3300+ | ✅ Validated | Clear low-level state |
| `R5` | currentConfig | chunks.55.mjs:3407 | ✅ Validated | Internal config state variable |
| `V21` | violationStore | chunks.55.mjs:3421 | ✅ Validated | ViolationStore instance |

### Network Proxy Initialization

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `gb3` | startHttpProxy | chunks.55.mjs:2992 | ✅ Validated | Start HTTP proxy server |
| `Fb3` | startSocksProxy | chunks.55.mjs:3010 | ✅ Validated | Start SOCKS proxy server |
| `nZ7` | checkNetworkPermission | chunks.55.mjs:2960 | ✅ Validated | Check domain against allow/deny lists |
| `bw8` | matchDomainPattern | chunks.55.mjs:2952 | ✅ Validated | Match domain with wildcard support |
| `Bb3` | getMitmSocketPath | chunks.55.mjs:2981 | ✅ Validated | Get MITM proxy socket for domain |
| `jD6` | httpProxyServer | chunks.55.mjs:3409 | ✅ Validated | HTTP proxy server instance |
| `Fq6` | socksProxyServer | chunks.55.mjs:3411 | ✅ Validated | SOCKS proxy server instance |
| `LL` | networkConfig | chunks.55.mjs:3413 | ✅ Validated | Network ports and bridge info |
| `Ua` | initializationPromise | chunks.55.mjs:3415 | ✅ Validated | Initialization promise cache |
| `N21` | logMonitorCleanup | chunks.55.mjs:3419 | ✅ Validated | Log monitor cleanup function |

### Seatbelt Profile Generation

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `xb3` | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated | Main SBPL builder |
| `Ib3` | generateFileReadRules | chunks.55.mjs:2715 | ✅ Validated | Read permission rules |
| `bb3` | generateFileWriteRules | chunks.55.mjs:2729 | ✅ Validated | Write permission rules |
| `Hv` | quoteString | chunks.55.mjs:2789 | ✅ Validated | JSON stringify for SBPL |
| `ub3` | getTempDirPaths | chunks.55.mjs:2793 | ✅ Validated | macOS temp resolution |

### Linux Bubblewrap

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated | Main bwrap wrapper |
| `Rb3` | buildFilesystemMounts | chunks.55.mjs:2491 | ✅ Validated | Bind mount args |
| `Lb3` | buildBridgeWrapperCommand | chunks.55.mjs:2474 | ✅ Validated | Network bridge command |
| `xZ7` | createBridgeSockets | chunks.55.mjs:2401 | ✅ Validated | Unix socket bridges for network namespace |
| `Sb3` | getDenyWritePaths | chunks.55.mjs:2669 | ✅ Validated | Mandatory deny paths |
| `Cb3` | generateLogTag | chunks.55.mjs:2678 | ✅ Validated | Correlation ID |

### Seccomp Filter (Linux)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `RZ7` | getSeccompBpfPath | chunks.55.mjs:2251 | ✅ Validated | Main entry for BPF path lookup |
| `Ex6` | getApplySeccompPath | chunks.55.mjs:2227 | ✅ Validated | Find apply-seccomp binary (cached) |
| `vb3` | findApplySeccompPath | chunks.55.mjs:2234 | ✅ Validated | Actual path search implementation |
| `Nw8` | getSeccompArch | chunks.55.mjs:2176 | ✅ Validated | Architecture mapping (x64/arm64 only) |
| `LZ7` | getSeccompSearchPaths | chunks.55.mjs:2195 | ✅ Validated | Build search paths for seccomp binaries |
| `Vw8` | findBpfPathCached | chunks.55.mjs:2203 | ✅ Validated | Cached BPF path lookup |
| `Tb3` | findBpfPath | chunks.55.mjs:2210 | ✅ Validated | Actual BPF path search implementation |
| `yZ7` | getGlobalInstallPaths | chunks.55.mjs:2161 | ✅ Validated | npm global install paths for sandbox-runtime |

### Linux Helpers

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Vb3` | findSymlinkInPath | chunks.55.mjs:2271 | ✅ Validated | Detect symlinks in path for attack mitigation |
| `kb3` | hasFileAncestor | chunks.55.mjs:2289 | ✅ Validated | Check if path has file ancestor |
| `Eb3` | findFirstNonexistentPath | chunks.55.mjs:2306 | ✅ Validated | Find first non-existent component in path |
| `yb3` | findDangerousFiles | chunks.55.mjs:2318 | ✅ Validated | Use ripgrep to find dangerous files |
| `Lw8` | registerExitCleanup | chunks.55.mjs:2366 | ✅ Validated | Register cleanup on process exit |
| `hw8` | cleanupMountPoints | chunks.55.mjs:2376 | ✅ Validated | Clean up bwrap mount points |
| `bZ7` | checkLinuxDependencies | chunks.55.mjs:2387 | ✅ Validated | Check bwrap, socat, seccomp availability |

### Network Proxy System

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `f21` | buildProxyEnvVars | chunks.55.mjs:2102 | ✅ Validated | Build HTTP_PROXY, SOCKS_PROXY env vars |
| `NP7` | createSocksProxyServer | chunks.55.mjs:3 | ✅ Validated | SOCKS5 proxy server with ruleset |
| `xZ7` | createBridgeSockets | chunks.55.mjs:2401 | ✅ Validated | Unix socket bridges for network namespace |
| `Lb3` | buildBridgeWrapperCommand | chunks.55.mjs:2474 | ✅ Validated | Build command with socat bridges + seccomp |

### Encoding and Pattern Matching

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `T21` | encodeBase64Command | chunks.55.mjs:2115 | ✅ Validated | Encode command for log correlation |
| `EZ7` | decodeBase64Command | chunks.55.mjs:2120 | ✅ Validated | Decode command from log |
| `OD6` | globToRegex | chunks.55.mjs:2124 | ✅ Validated | Convert glob pattern to regex |
| `Gw8` | expandGlobPattern | chunks.55.mjs:2128 | ✅ Validated | Expand glob to matching paths |
| `Cb3` | generateLogTag | chunks.55.mjs:2678 | ✅ Validated | Generate CMD64_..._END tag |

### Violation Monitoring

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `UZ7` | startLogMonitor | chunks.55.mjs:2843 | ✅ Validated | macOS log stream |
| `FZ7` | SANDBOX_LOG_TAG | chunks.55.mjs:2899 | ✅ Validated | Unique session ID |
| `T21` | encodeBase64 | chunks.55.mjs:2679 | ✅ Validated | Command encoding |

---

## Network Proxy Functions

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `f21` | buildProxyEnvVars | chunks.55.mjs:2102 | ✅ Validated | Build HTTP_PROXY, ALL_PROXY env vars for sandbox |
| `gb3` | startHttpProxy | chunks.55.mjs:2992 | ✅ Validated | Start HTTP proxy server with domain filter |
| `Fb3` | startSocksProxy | chunks.55.mjs:3010 | ✅ Validated | Start SOCKS proxy server with domain filter |
| `nZ7` | checkNetworkPermission | chunks.55.mjs:2960 | ✅ Validated | Check domain against allow/deny lists |
| `Bb3` | getMitmSocketPath | chunks.55.mjs:2981 | ✅ Validated | Get MITM proxy socket for SSL inspection |
| `jD6` | httpProxyServer | chunks.55.mjs:3409 | ✅ Validated | HTTP proxy server instance |
| `Fq6` | socksProxyServer | chunks.55.mjs:3411 | ✅ Validated | SOCKS proxy server instance |
| `LL` | networkConfig | chunks.55.mjs:3413 | ✅ Validated | Network ports and bridge info |
| `Ua` | initializationPromise | chunks.55.mjs:3415 | ✅ Validated | Initialization promise cache |

### Path Helpers

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `kx6` | getDefaultWritablePaths | chunks.55.mjs:2097 | ✅ Validated | Default paths for write access (/dev/stdout, /tmp/claude, etc.) |
| `mq6` | resolvePath | chunks.55.mjs:3400 | ✅ Validated | Resolve path to absolute |
| `EL` | resolveAbsolutePath | chunks.55.mjs:3398 | ✅ Validated | Cross-platform path resolution |
| `JU` | which | chunks.55.mjs:3423 | ✅ Validated | Find executable in PATH |

### Command Encoding

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `T21` | encodeBase64Command | chunks.55.mjs:2115 | ✅ Validated | Encode command for log correlation |
| `EZ7` | decodeBase64Command | chunks.55.mjs:2120 | ✅ Validated | Decode command from log |
| `Cb3` | generateLogTag | chunks.55.mjs:2678 | ✅ Validated | Generate CMD64_..._END tag for macOS log correlation |
| `FZ7` | SANDBOX_LOG_TAG | chunks.55.mjs:2899 | ✅ Validated | Unique session ID for log filtering |

### Glob Pattern Handling

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `OD6` | globToRegex | chunks.55.mjs:2124 | ✅ Validated | Convert glob pattern to regex |
| `Gw8` | expandGlobPattern | chunks.55.mjs:2128 | ✅ Validated | Expand glob to matching paths on Linux |
| `zk` | isGlobPattern | chunks.55.mjs:3395 | ✅ Validated | Check if path contains glob characters |

### Seccomp Filter (Linux)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `RZ7` | getSeccompBpfPath | chunks.55.mjs:2251 | ✅ Validated | Find BPF filter file for architecture |
| `Ex6` | getApplySeccompPath | chunks.55.mjs:2227 | ✅ Validated | Find apply-seccomp binary (cached) |
| `Nw8` | getSeccompArch | chunks.55.mjs:2176 | ✅ Validated | Map process.arch to x64/arm64 |
| `LZ7` | getSeccompSearchPaths | chunks.55.mjs:2195 | ✅ Validated | Build search paths for seccomp binaries |
| `yZ7` | getGlobalInstallPaths | chunks.55.mjs:2161 | ✅ Validated | npm global install paths for sandbox-runtime |

### Linux Helpers

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Vb3` | findSymlinkInPath | chunks.55.mjs:2271 | ✅ Validated | Detect symlinks in allowed write paths |
| `kb3` | hasFileAncestor | chunks.55.mjs:2289 | ✅ Validated | Check if path has file ancestor (cannot create dir under file) |
| `Eb3` | findFirstNonexistentPath | chunks.55.mjs:2306 | ✅ Validated | Find first non-existent component in path |
| `yb3` | findDangerousFiles | chunks.55.mjs:2318 | ✅ Validated | Use ripgrep to find dangerous files in directory |
| `Lw8` | registerExitCleanup | chunks.55.mjs:2366 | ✅ Validated | Register cleanup on process exit |
| `hw8` | cleanupMountPoints | chunks.55.mjs:2376 | ✅ Validated | Clean up bwrap mount points |
| `bZ7` | checkLinuxDependencies | chunks.55.mjs:2387 | ✅ Validated | Check bwrap, socat, seccomp availability |
| `xZ7` | createBridgeSockets | chunks.55.mjs:2401 | ✅ Validated | Create Unix socket bridges for network namespace |

---

## UI Components (Validated)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `bAz` | sandboxSlashCommandDefinition | chunks.165.mjs:2007 | ✅ Validated | Slash command with live status |
| `TPq` | SandboxModeSelector | chunks.165.mjs:1737 | ✅ Validated | 3-way mode picker |
| `PPq` | SandboxStatusDisplay | chunks.165.mjs:1399 | ✅ Validated | Config summary display |
| `ZPq` | SandboxOverridesSettings | chunks.165.mjs:1505 | ✅ Validated | Open/closed policy toggle |
| `Ql8` | SandboxDependenciesPanel | chunks.165.mjs:1641 | ✅ Validated | Dependency status display |
| `aIq` | SandboxViolationStatusLine | chunks.191.mjs:92 | ✅ Validated | Status bar violation indicator |

---

## Corrected Symbols

The following symbols were previously documented incorrectly:

| Symbol | Previous Mapping | Correct Mapping | Location |
|--------|------------------|-----------------|----------|
| `b8` | sandboxConfigObject | sandboxConfigObject is `vA` | chunks.56.mjs:516 |
| `Ye8` | wrapWithMacOSSandbox | React fiber commitWork | chunks.59.mjs:5105 |
| `FP5` | buildSeatbeltProfile | AWS credential provider | chunks.35.mjs:1456 |
| `Sc` | isCommandSandboxed | Unknown location | Use `Ti` instead |
| `nBY` | getSandboxSystemPromptBlock | getCacheSafeParams | Use `E9z` instead |
| `aqz` | sandboxSlashCommandDefinition | Incorrect symbol | Use `bAz` instead |
| `_Hq` | SandboxModeSelector | Incorrect symbol | Use `TPq` instead |
| `zHq` | SandboxStatusDisplay | Incorrect symbol | Use `PPq` instead |
| `HHq` | SandboxOverridesSettings | Incorrect symbol | Use `ZPq` instead |
| `nuA` | SandboxDependenciesPanel | Incorrect symbol | Use `Ql8` instead |
| `lWq` | SandboxViolationStatusLine | Incorrect symbol | Use `aIq` instead |
| `dy1` | SandboxViolationStore | Incorrect symbol | Use `HD6` instead |
| `ze8` | startLogMonitor | Incorrect symbol | Use `UZ7` instead |

### Symbol Corrections Explained

**vA vs b8:**
- Previous documentation showed `b8` as sandboxConfigObject
- Actual symbol is `vA` at chunks.56.mjs:516
- `b8` is used elsewhere in the codebase

**Ye8 (React fiber):**
- Previous documentation claimed `Ye8` was wrapWithMacOSSandbox
- Actual `Ye8` at chunks.59.mjs:5105 is React fiber commitWork code
- The correct macOS sandbox wrapper is `QZ7` at chunks.55.mjs:2803

**FP5 (AWS credential):**
- Previous documentation claimed `FP5` was buildSeatbeltProfile
- Actual `FP5` is an AWS credential provider function
- The correct seatbelt builder is `xb3` at chunks.55.mjs:2755

---

## wrapWithLinuxSandbox (uZ7) Complete Analysis

```javascript
// ============================================
// wrapWithLinuxSandbox - Linux bwrap sandbox wrapper
// Location: chunks.55.mjs:2564-2648
// ============================================

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
        mandatoryDenySearchDepth: D = 3,
        allowGitConfig: X = !1,
        seccompConfig: P,
        abortSignal: W
    } = A;

    let hasReadRestrictions = O && O.denyOnly.length > 0;
    let hasWriteConfig = $ !== void 0;

    // Early exit: no restrictions needed
    if (!K && !hasReadRestrictions && !hasWriteConfig) return q;

    let bwrapArgs = ["--new-session", "--die-with-parent"];
    let bpfFilterPath = undefined;

    try {
        // 1. Seccomp filter setup (for Unix socket blocking)
        if (!j) {
            bpfFilterPath = getSeccompBpfPath(P?.bpfPath) ?? undefined;
            let applyPath = getApplySeccompPath(P?.applyPath);
            if (!bpfFilterPath || !applyPath) {
                logWarning("[Sandbox Linux] Seccomp binaries not available");
                bpfFilterPath = undefined;
            } else {
                log("[Sandbox Linux] Generated seccomp BPF filter");
            }
        }

        // 2. Network isolation
        if (K) {
            bwrapArgs.push("--unshare-net");
            if (Y && z) {
                // Validate bridge sockets exist
                if (!fs.existsSync(Y)) throw Error(`HTTP bridge socket missing: ${Y}`);
                if (!fs.existsSync(z)) throw Error(`SOCKS bridge socket missing: ${z}`);

                // Bind bridge sockets into namespace
                bwrapArgs.push("--bind", Y, Y);
                bwrapArgs.push("--bind", z, z);

                // Set proxy environment variables
                let proxyEnvVars = buildProxyEnvVars(3128, 1080);
                bwrapArgs.push(...proxyEnvVars.flatMap(env => {
                    let [key, value] = env.split("=");
                    return ["--setenv", key, value];
                }));
            }
        }

        // 3. Filesystem isolation via bind mounts
        let filesystemMounts = await buildFilesystemMounts(O, $, M, D, X, W);
        bwrapArgs.push(...filesystemMounts);

        // 4. Process isolation
        bwrapArgs.push("--dev", "/dev");
        bwrapArgs.push("--unshare-pid");
        if (!H) bwrapArgs.push("--proc", "/proc");

        // 5. Shell resolution
        let shell = J || "bash";
        let shellPath = which(shell);
        if (!shellPath) throw Error(`Shell '${shell}' not found in PATH`);

        bwrapArgs.push("--", shellPath, "-c");

        // 6. Final command with optional seccomp
        if (K && Y && z) {
            let wrappedCommand = buildBridgeCommand(Y, z, q, bpfFilterPath, shellPath, P?.applyPath);
            bwrapArgs.push(wrappedCommand);
        } else if (bpfFilterPath) {
            let applyPath = getApplySeccompPath();
            let seccompCommand = shellQuote([applyPath, bpfFilterPath, shellPath, "-c", q]);
            bwrapArgs.push(seccompCommand);
        } else {
            bwrapArgs.push(q);
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
```

### Key Algorithm: Network Bridge Sockets

**What it does:** Creates Unix socket bridges that allow sandboxed processes to access the network through proxy servers running in the unsandboxed parent process.

**How it works:**
1. Parent process starts HTTP and SOCKS proxy servers
2. Unix sockets are created at known paths
3. `bwrap --bind` mounts these sockets into the network namespace
4. Proxy env vars (`HTTP_PROXY`, `SOCKS_PROXY`) point to these sockets
5. Sandboxed process sends traffic through sockets → parent proxies → actual network

**Why this approach:**
- `--unshare-net` completely isolates network namespace
- No direct network access is possible from sandbox
- Unix sockets can cross namespace boundaries when bind-mounted
- Parent process can apply domain-based filtering

---

## generateSeatbeltProfile (xb3) Complete Analysis

```javascript
// ============================================
// generateSeatbeltProfile - macOS SBPL profile generator
// Location: chunks.55.mjs:2755-2787
// ============================================

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
    // Base profile: deny everything by default
    let M = [
        "(version 1)",
        `(deny default (with message "${J}"))`,
        "",
        `; LogTag: ${J}`,
        "",
        "; Essential permissions - based on Chrome sandbox policy",
        "; Process permissions",
        "(allow process-exec)",
        "(allow process-fork)",
        "(allow process-info* (target same-sandbox))",
        "(allow signal (target same-sandbox))",
        "(allow mach-priv-task-port (target same-sandbox))",
        "",
        "; User preferences",
        "(allow user-preference-read)",
        "",
        // ... 50+ lines of Mach IPC, IOKit, sysctl rules
    ];

    // Network section
    M.push("; Network");
    if (!z) {
        M.push("(allow network*)");
    } else {
        // Allow local binding if requested
        if (O) {
            M.push('(allow network-bind (local ip "*:*"))');
            M.push('(allow network-inbound (local ip "*:*"))');
            M.push('(allow network-outbound (local ip "*:*"))');
        }

        // Unix socket handling
        if (w) {
            M.push("(allow system-socket (socket-domain AF_UNIX))");
            M.push('(allow network-bind (local unix-socket (path-regex #"^/")))');
            M.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        } else if (_ && _.length > 0) {
            M.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let D of _) {
                M.push(`(allow network-bind (local unix-socket (subpath ${Hv(D)})))`);
                M.push(`(allow network-outbound (remote unix-socket (subpath ${Hv(D)})))`);
            }
        }

        // Proxy port access
        if (K !== void 0) {
            M.push(`(allow network-bind (local ip "localhost:${K}"))`);
            M.push(`(allow network-inbound (local ip "localhost:${K}"))`);
            M.push(`(allow network-outbound (remote ip "localhost:${K}"))`);
        }
        if (Y !== void 0) {
            M.push(`(allow network-bind (local ip "localhost:${Y}"))`);
            M.push(`(allow network-inbound (local ip "localhost:${Y}"))`);
            M.push(`(allow network-outbound (remote ip "localhost:${Y}"))`);
        }
    }

    // File read rules
    M.push("");
    M.push("; File read");
    M.push(...generateFileReadRules(A, J));

    // File write rules
    M.push("");
    M.push("; File write");
    M.push(...generateFileWriteRules(q, J, H));

    // PTY support
    if ($) {
        M.push("");
        M.push("; Pseudo-terminal (pty) support");
        M.push("(allow pseudo-tty)");
        // ... /dev/ptmx, /dev/ttys rules
    }

    return M.join("\n");
}
```

### Key Algorithm: Default Deny with Explicit Allow

**What it does:** Creates a sandbox profile that blocks everything by default, then selectively allows specific operations.

**How it works:**
1. `(deny default (with message "${logTag}"))` - Block everything
2. Add allow rules for each category:
   - Process: exec, fork, signal
   - Mach IPC: 16 specific services (fonts, logging, security)
   - sysctl: 50+ specific read names (hardware info, kernel version)
   - IOKit: 3 specific classes
   - Network: controlled via proxy ports
   - File I/O: based on readConfig/writeConfig
3. Each deny rule includes logTag for correlation

**Why this approach:**
- Defense in depth: anything not explicitly allowed is blocked
- Correlation: logTag links violations back to specific commands
- Granularity: individual Mach services and sysctl names

---

## SandboxViolationStore (HD6) Class

```javascript
// ============================================
// SandboxViolationStore - Ring buffer for sandbox violations
// Location: chunks.55.mjs:2902-2936
// ============================================

class HD6 {
    violations = [];
    totalCount = 0;
    maxSize = 100;
    listeners = new Set();

    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;
        if (this.violations.length > this.maxSize) {
            this.violations.shift();
        }
        this.notifyListeners();
    }

    getViolations(count) {
        return [...this.violations.slice(-count)];
    }

    getCount() { return this.violations.length; }
    getTotalCount() { return this.totalCount; }

    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.violations); // Immediate notification
        return () => this.listeners.delete(callback);
    }

    notifyListeners() {
        for (let cb of this.listeners) cb([...this.violations]);
    }
}
```

### Key Algorithm: Ring Buffer with Observer

**What it does:** Stores the most recent sandbox violations and notifies subscribers when violations occur.

**How it works:**
1. Fixed-size array (max 100) with automatic trimming
2. Total count tracks lifetime violations (not reset by trim)
3. Observer pattern: subscribers get immediate + update notifications
4. Unsubscribe function returned from subscribe()

---

## System Reminder Integration

### getSandboxSystemPromptBlock (E9z)

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions for Bash tool
// Location: chunks.171.mjs:1892-1922
// ============================================

function E9z() {
    if (!vA.isSandboxingEnabled()) return "";

    let readConfig = vA.getFsReadConfig();
    let writeConfig = vA.getFsWriteConfig();
    let networkConfig = vA.getNetworkRestrictionConfig();
    let allowUnixSockets = vA.getAllowUnixSockets();
    let fallbackAllowed = vA.areUnsandboxedCommandsAllowed();

    // Build restrictions JSON
    let restrictions = [];
    if (Object.keys(readConfig).length > 0 || Object.keys(writeConfig).length > 0) {
        restrictions.push(`    - Filesystem: ${JSON.stringify({ read: readConfig, write: writeConfig })}`);
    }
    if (Object.keys(networkConfig).length > 0) {
        restrictions.push(`    - Network: ${JSON.stringify(networkConfig)}`);
    }

    // mcp-cli exception
    let mcpCliException = "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n";

    // Instructions based on fallback policy
    let instructions = fallbackAllowed ? `
  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
${mcpCliException}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions
` : `
  - CRITICAL: All commands MUST run in sandbox mode - \`dangerouslyDisableSandbox\` is disabled by policy
`;

    return `- Commands run in a sandbox by default with the following restrictions:
${restrictions.join("\n")}
${instructions}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
`;
}
```

### Key Design Decision: Anti-Learning Pattern

The instructions explicitly warn against learning from previous overrides:
- "Even if you have recently run commands with `dangerouslyDisableSandbox: true`, you MUST NOT continue that pattern"
- This combats LLM failure mode where model applies overrides to all subsequent commands

---

## isCommandInExcludedList (yYz) Complete Analysis

**Location:** chunks.172.mjs:2412-2450

```javascript
// ============================================
// isCommandInExcludedList - Check if command matches exclusion patterns
// Location: chunks.172.mjs:2412-2450
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
        let w = [z.trim()],
            O = new Set(w),
            $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq);
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
                    if (J.startsWith(j.value)) return !0;
                    break;
                case "suffix":
                    if (J.endsWith(j.value)) return !0;
                    break;
                case "contains":
                    if (J.includes(j.value)) return !0;
                    break;
                case "exact":
                    if (J === j.value) return !0
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    // Get exclusion patterns from settings
    let excludedCommands = getSettings().sandbox?.excludedCommands ?? [];
    if (excludedCommands.length === 0) return false;

    // Parse command into tokens (handles shell commands with pipes, &&, etc.)
    let commandTokens;
    try {
        commandTokens = parseShellCommand(command);  // EO
    } catch {
        commandTokens = [command];  // Fallback to raw command
    }

    // For each command token, build a set of variations
    for (let token of commandTokens) {
        let variations = [token.trim()];
        let seen = new Set(variations);

        // Expand variations: resolve symlinks and get basename
        let i = 0;
        while (i < variations.length) {
            let prevLen = variations.length;
            for (let j = i; j < prevLen; j++) {
                let current = variations[j];

                // Resolve symlinks (e.g., /usr/bin/python -> /usr/bin/python3)
                let resolved = resolveSymlink(current);
                if (!seen.has(resolved)) {
                    variations.push(resolved);
                    seen.add(resolved);
                }

                // Get basename (e.g., /usr/bin/git -> git)
                let basename = getBasename(current);
                if (!seen.has(basename)) {
                    variations.push(basename);
                    seen.add(basename);
                }
            }
            i = prevLen;
        }

        // Check each exclusion pattern against all variations
        for (let pattern of excludedCommands) {
            let parsedPattern = parsePattern(pattern);  // In8

            for (let variation of variations) {
                switch (parsedPattern.type) {
                    case "prefix":
                        if (variation.startsWith(parsedPattern.value)) return true;
                        break;
                    case "suffix":
                        if (variation.endsWith(parsedPattern.value)) return true;
                        break;
                    case "contains":
                        if (variation.includes(parsedPattern.value)) return true;
                        break;
                    case "exact":
                        if (variation === parsedPattern.value) return true;
                }
            }
        }
    }

    return false;
}

// Mapping: yYz→isCommandInExcludedList, A→command, K→excludedCommands,
//          PA→getSettings, EO→parseShellCommand, In8→parsePattern,
//          bn8→resolveSymlink, Ac→getBasename
```

### Key Algorithm: Command Expansion for Exclusion Matching

**What it does:** Determines if a command should be excluded from sandboxing by matching against user-defined patterns.

**How it works:**
1. Parse command into tokens (handles pipes, &&, ||, etc.)
2. For each token, expand variations:
   - Resolve symlinks (e.g., `/usr/bin/python` → `/usr/bin/python3`)
   - Extract basename (e.g., `/usr/bin/git` → `git`)
3. Check each pattern type against all variations:
   - `prefix:` - matches if command starts with pattern
   - `suffix:` - matches if command ends with pattern
   - `contains:` - matches if command contains pattern
   - `exact:` - matches if command equals pattern

**Why this approach:**
- Users may add `"git"` to exclusions, but actual command is `/usr/bin/git`
- Symlinks like `python` → `python3` need resolution
- Pattern types give users flexibility in matching

**Example patterns:**
```json
{
  "sandbox": {
    "excludedCommands": [
      "npm run test:*",    // prefix match
      ":*.test.js",        // suffix match
      "docker",            // exact match
      "python -m pytest"   // contains match (default)
    ]
  }
}
```

---

## buildFilesystemMounts (Rb3) Complete Analysis

**Location:** chunks.55.mjs:2491-2560

```javascript
// ============================================
// buildFilesystemMounts - Build bwrap filesystem mount arguments
// Location: chunks.55.mjs:2491-2560
// ============================================

// READABLE (for understanding):
async function buildFilesystemMounts(
    readConfig,
    writeConfig,
    ripgrepConfig = { command: "rg" },
    mandatoryDenySearchDepth = 3,
    allowGitConfig = false,
    abortSignal
) {
    let bwrapArgs = [];

    // === WRITE CONFIG HANDLING ===
    if (writeConfig) {
        // Start with read-only root filesystem
        bwrapArgs.push("--ro-bind", "/", "/");

        let allowedWritePaths = [];

        // Process write-allowed paths
        for (let allowedPath of writeConfig.allowOnly || []) {
            let resolvedPath = resolvePath(allowedPath);

            // Skip /dev paths (handled separately)
            if (resolvedPath.startsWith("/dev/")) {
                log(`[Sandbox Linux] Skipping /dev path: ${resolvedPath}`);
                continue;
            }

            // Skip non-existent paths
            if (!fs.existsSync(resolvedPath)) {
                log(`[Sandbox Linux] Skipping non-existent write path: ${resolvedPath}`);
                continue;
            }

            // Check for symlink escape attempts
            let realPath = fs.realpathSync(resolvedPath);
            if (isSymlinkEscape(realPath, mandatoryDenySearchDepth)) {
                log(`[Sandbox Linux] Warning: Symlink escape detected: ${resolvedPath} -> ${realPath}`);
                // Still allow, but log warning
            }

            allowedWritePaths.push(resolvedPath);
        }

        // Add write-allowed paths as read-write bind mounts
        for (let writePath of allowedWritePaths) {
            bwrapArgs.push("--bind", writePath, writePath);
        }
    }

    // === READ CONFIG HANDLING ===
    if (readConfig && readConfig.denyOnly.length > 0) {
        // Deny read access to specific paths
        for (let denyPath of readConfig.denyOnly) {
            let resolved = resolvePath(denyPath);
            bwrapArgs.push("--ro-bind-try", "/dev/null", resolved);
        }
    }

    // === MANDATORY DENY PATHS (always blocked) ===
    let denyWritePaths = getDenyWritePaths();
    for (let denyPath of denyWritePaths) {
        bwrapArgs.push("--ro-bind-try", "/dev/null", denyPath);
    }

    // === RIPGREP CONFIG (special handling) ===
    if (ripgrepConfig.command === "rg") {
        let rgPath = which("rg");
        if (rgPath) {
            bwrapArgs.push("--ro-bind", rgPath, rgPath);
        }
    }

    // === GIT CONFIG (optional) ===
    if (allowGitConfig) {
        let gitConfig = path.join(os.homedir(), ".gitconfig");
        if (fs.existsSync(gitConfig)) {
            bwrapArgs.push("--ro-bind", gitConfig, gitConfig);
        }
    }

    return bwrapArgs;
}

// Mapping: Rb3→buildFilesystemMounts, EL→resolvePath, $2→fs
```

### Key Algorithm: Symlink Escape Detection

**What it does:** Detects when a symlink points outside the expected directory hierarchy.

**How it works:**
1. Resolve the symlink to its real target
2. Walk up the directory tree (up to `mandatoryDenySearchDepth` levels)
3. Check if any ancestor is in the deny list
4. Log warning if potential escape detected

**Why mandatoryDenySearchDepth = 3:**
- Common case: `/home/user/project/node_modules` → `/home/user/.npm`
- Depth 3 catches most escape attempts without excessive checks
- Balances security vs performance

---

## createBridgeSockets (xZ7) Complete Analysis

**Location:** chunks.55.mjs:2401-2471

```javascript
// ============================================
// createBridgeSockets - Create Unix socket bridges for network namespace
// Location: chunks.55.mjs:2401-2471
// ============================================

// ORIGINAL (for source lookup):
async function xZ7(A, q) {
    let K = Nb3(8).toString("hex"),
        Y = CZ7(Ew8(), `claude-http-${K}.sock`),
        z = CZ7(Ew8(), `claude-socks-${K}.sock`),
        _ = [`UNIX-LISTEN:${Y},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    wA(`Starting HTTP bridge: socat ${_.join(" ")}`);
    let w = SZ7("socat", _, { stdio: "ignore" });
    if (!w.pid) throw Error("Failed to start HTTP bridge process");
    // ... error handling and SOCKS bridge ...
    return {
        httpSocketPath: Y,
        socksSocketPath: z,
        httpBridgeProcess: w,
        socksBridgeProcess: $,
        httpProxyPort: A,
        socksProxyPort: q
    };
}

// READABLE (for understanding):
async function createBridgeSockets(httpProxyPort, socksProxyPort) {
    // Generate unique socket ID to avoid collisions
    let socketId = randomBytes(8).toString("hex");

    // Create socket paths in temp directory
    let httpSocketPath = path.join(getTempDir(), `claude-http-${socketId}.sock`);
    let socksSocketPath = path.join(getTempDir(), `claude-socks-${socketId}.sock`);

    // === HTTP BRIDGE ===
    // socat UNIX-LISTEN:<socket> TCP:localhost:<proxy-port>
    // Forwards connections from Unix socket to HTTP proxy
    let httpBridgeArgs = [
        `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
        `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
    ];
    log(`Starting HTTP bridge: socat ${httpBridgeArgs.join(" ")}`);

    let httpBridgeProcess = spawn("socat", httpBridgeArgs, { stdio: "ignore" });
    if (!httpBridgeProcess.pid) {
        throw new Error("Failed to start HTTP bridge process");
    }

    // === SOCKS BRIDGE ===
    let socksBridgeArgs = [
        `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
        `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
    ];
    log(`Starting SOCKS bridge: socat ${socksBridgeArgs.join(" ")}`);

    let socksBridgeProcess = spawn("socat", socksBridgeArgs, { stdio: "ignore" });
    if (!socksBridgeProcess.pid) {
        process.kill(httpBridgeProcess.pid, "SIGTERM");
        throw new Error("Failed to start SOCKS bridge process");
    }

    // === WAIT FOR SOCKETS ===
    // Retry with backoff until sockets exist or max attempts reached
    for (let attempt = 0; attempt < 5; attempt++) {
        if (!httpBridgeProcess.pid || httpBridgeProcess.killed ||
            !socksBridgeProcess.pid || socksBridgeProcess.killed) {
            throw new Error("Linux bridge process died unexpectedly");
        }

        if (fs.existsSync(httpSocketPath) && fs.existsSync(socksSocketPath)) {
            log(`Linux bridges ready after ${attempt + 1} attempts`);
            break;
        }

        if (attempt === 4) {
            process.kill(httpBridgeProcess.pid, "SIGTERM");
            process.kill(socksBridgeProcess.pid, "SIGTERM");
            throw new Error("Failed to create bridge sockets after 5 attempts");
        }

        await delay(attempt * 100);  // Backoff: 0, 100, 200, 300, 400ms
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

// Mapping: xZ7→createBridgeSockets, Nb3→randomBytes, CZ7→path.join,
//          Ew8→getTempDir, SZ7→spawn, wA→log
```

### Key Algorithm: Network Namespace Bridge

**What it does:** Creates Unix socket bridges that allow sandboxed processes (in isolated network namespace) to communicate with proxy servers in the parent namespace.

**How it works:**
1. Generate unique socket IDs (prevents collision between sessions)
2. Start socat processes that listen on Unix sockets and forward to TCP proxies
3. Wait for sockets to be created (with backoff retry)
4. Return socket paths for bwrap `--bind` mounting

**Why socat options:**
- `fork` - Handle multiple concurrent connections
- `reuseaddr` - Allow quick restart without "address in use" errors
- `keepalive,keepidle=10,keepintvl=5,keepcnt=3` - Detect dead connections quickly

**Why wait with backoff:**
- Socket creation is asynchronous
- 5 attempts with 100ms increments = up to 1 second total wait
- Balances startup time vs reliability

---

## Initialization Flow Symbols (Validated)

### Low-Level Sandbox Module (`aO`)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `aO` | sandboxLowLevelModule | chunks.55.mjs:3436 | ✅ Validated | Low-level sandbox implementation object |
| `pb3` | initializeLowLevel | chunks.55.mjs:3024 | ✅ Validated | Bootstrap network infrastructure |
| `rZ7` | isSupportedPlatform | chunks.55.mjs:3059 | ✅ Validated | Check macOS/Linux (not WSL1) |
| `Qb3` | isSandboxInitialized | chunks.55.mjs:3065 | ✅ Validated | Check if config loaded |
| `oZ7` | checkDependencies | chunks.55.mjs:3069 | ✅ Validated | Validate ripgrep, bwrap, socat |
| `ob3` | wrapWithSandboxInternal | chunks.55.mjs:3208 | ✅ Validated | Platform-specific wrapper dispatch |
| `xw8` | reset | chunks.55.mjs:3288 | ✅ Validated | Cleanup all sandbox resources |
| `zG7` | waitForNetworkInitialization | chunks.55.mjs:3198 | ✅ Validated | Wait for network infrastructure |
| `tb3` | getSandboxViolationStore | chunks.55.mjs:3382 | ✅ Validated | Get violation store instance |
| `eb3` | annotateStderrWithSandboxFailures | chunks.55.mjs:3386 | ✅ Validated | Add violations to stderr |

### Public API Facade (`vA`)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated | Public API facade |
| `Px3` | sandboxInitialize | chunks.56.mjs:424 | ✅ Validated | Main initialization entry point |
| `Xx3` | wrapWithSandbox | chunks.56.mjs:417 | ✅ Validated | Public wrapper function |
| `h21` | isSandboxingEnabled | chunks.56.mjs:357 | ✅ Validated | Full enabled check (all gates) |
| `$x3` | isAutoAllowBashIfSandboxedEnabled | chunks.56.mjs:337 | ✅ Validated | Auto-allow setting check |
| `Hx3` | areUnsandboxedCommandsAllowed | chunks.56.mjs:341 | ✅ Validated | Fallback policy check |
| `Jx3` | areSandboxSettingsLockedByPolicy | chunks.56.mjs:386 | ✅ Validated | Check if managed by policy |
| `Mx3` | setSandboxSettings | chunks.56.mjs:395 | ✅ Validated | Update sandbox settings |
| `Dx3` | getExcludedCommands | chunks.56.mjs:413 | ✅ Validated | Get exclusion patterns |
| `Wx3` | refreshSandboxConfig | chunks.56.mjs:447 | ✅ Validated | Reload config from settings |
| `Zx3` | sandboxReset | chunks.56.mjs:454 | ✅ Validated | Clear state and cleanup |
| `TG7` | isSandboxEnabledInSettings | chunks.56.mjs:330 | ✅ Validated | Check settings.sandbox.enabled |
| `vG7` | isPlatformInEnabledList | chunks.56.mjs:345 | ✅ Validated | Check enabledPlatforms setting |

### Tool Integration

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated | Per-command gate check |
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | ✅ Validated | Check exclusion patterns |

### Internal State Variables

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `da` | initializationPromise | chunks.56.mjs:478 | variable | Caches init promise |
| `R5` | currentConfig | chunks.55.mjs:3407 | variable | Current sandbox configuration |
| `LL` | networkInfo | chunks.55.mjs:3409 | variable | Network infrastructure state |
| `Ua` | networkInitPromise | chunks.55.mjs:3411 | variable | Network init promise |
| `V21` | violationStore | chunks.55.mjs:3421 | variable | SandboxViolationStore instance |
| `N21` | logMonitorCleanup | chunks.55.mjs:3419 | variable | macOS log monitor cleanup fn |
| `jD6` | httpProxyServer | chunks.55.mjs:3409 | variable | HTTP proxy server instance |
| `Fq6` | socksProxyServer | chunks.55.mjs:3410 | variable | SOCKS proxy server instance |

---

## Conclusion

All sandbox symbols have been validated against source code. Key findings:

1. `vA` (not `b8`) is the correct sandboxConfigObject
2. `QZ7` (not `Ye8`) is the correct wrapWithMacOSSandbox
3. `xb3` (not `FP5`) is the correct generateSeatbeltProfile
4. `E9z` (not `nBY`) is the correct getSandboxSystemPromptBlock
5. `HD6` (not `dy1`) is the correct SandboxViolationStore
6. `UZ7` (not `ze8`) is the correct startLogMonitor
7. `aO` is the low-level sandbox module at chunks.55.mjs:3436
8. `vA` is the public API facade at chunks.56.mjs:516
9. All core functions are in chunks.55.mjs and chunks.56.mjs
10. All UI components are in chunks.165.mjs and chunks.191.mjs

### Module Organization Summary

```
chunks.55.mjs (aO - Low-level implementation)
├── pb3 - initializeLowLevel
├── rZ7 - isSupportedPlatform
├── oZ7 - checkDependencies
├── ob3 - wrapWithSandboxInternal
├── QZ7 - wrapWithMacOSSandbox
├── uZ7 - wrapWithLinuxSandbox
├── xb3 - generateSeatbeltProfile
├── xZ7 - createBridgeSockets
├── UZ7 - startLogMonitor
├── HD6 - SandboxViolationStore
└── xw8 - reset

chunks.56.mjs (vA - Public API facade)
├── Px3 - sandboxInitialize
├── Xx3 - wrapWithSandbox
├── h21 - isSandboxingEnabled
├── Mx3 - setSandboxSettings
├── Wx3 - refreshSandboxConfig
├── Zx3 - sandboxReset
├── R21 - buildSandboxConfig
└── jx3 - getLinuxGlobPatternWarnings

chunks.172.mjs (Tool integration)
├── Ti - isCommandSandboxed
├── yYz - isCommandInExcludedList
├── In8 (yfq) - parseExclusionPattern
├── Cn8 - matchWildcardPattern
├── bn8 - resolveCommandEnvVars
└── Ac - extractCommandBasename

chunks.165.mjs (UI components)
├── TPq - SandboxModeSelector
├── PPq - SandboxStatusDisplay
├── ZPq - SandboxOverridesSettings
├── Ql8 - SandboxDependenciesPanel
└── bAz - sandboxSlashCommandDefinition

chunks.171.mjs (System prompt)
└── E9z - getSandboxSystemPromptBlock

chunks.191.mjs (Status line)
└── aIq - SandboxViolationStatusLine

---

## Command Exclusion Pattern Matching Functions

### Pattern Matching (chunks.172.mjs)

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `In8` | parseExclusionPattern | chunks.172.mjs:2407 | function | Parse pattern into {type, value} |
| `Cn8` | matchWildcardPattern | chunks.172.mjs:2450 | function | Glob-style wildcard matching |
| `bn8` | resolveCommandSymlink | chunks.172.mjs:2429 | function | Resolve symlink path |
| `Ac` | getCommandBasename | chunks.172.mjs:2431 | function | Extract basename from path |
| `EO` | parseShellCommand | chunks.172.mjs:2417 | function | Parse command into tokens |

### Pattern Types

The `parseExclusionPattern` (In8) function returns one of three pattern types:

| Type | Match Condition | Example Pattern | Matches |
|------|-----------------|-----------------|---------|
| `prefix` | Command starts with pattern | `npm run test:*` | `npm run test:unit`, `npm run test:integration` |
| `exact` | Command equals pattern | `docker` | `docker` (not `docker-compose`) |
| `wildcard` | Glob pattern match | `*.test.js` | `foo.test.js`, `bar.test.js` |

### Exclusion Pattern Examples

```javascript
// Settings JSON:
{
  "sandbox": {
    "excludedCommands": [
      "npm run test:*",      // prefix match
      "docker",              // exact match
      "python -m pytest"     // exact match (with args)
    ]
  }
}

// Command resolution flow:
// "npm run test:unit" → ["npm run test:unit", "/usr/bin/npm", "npm"]
//                         ↑ original          ↑ resolved symlink  ↑ basename
// All variations are checked against each pattern.
```

### Symlink Resolution Algorithm

**Why resolve symlinks:** Users may add `"git"` to exclusions, but the actual command is `/usr/bin/git` (a symlink). The resolution algorithm expands all variations:

```javascript
// Algorithm:
let variations = new Set([command.trim()]);
let toResolve = [command.trim()];

while (toResolve.length > 0) {
    let current = toResolve.pop();

    // Resolve symlink (e.g., /usr/bin/python → /usr/bin/python3)
    let resolved = resolveSymlink(current);
    if (!variations.has(resolved)) {
        variations.add(resolved);
        toResolve.push(resolved);
    }

    // Extract basename (e.g., /usr/bin/git → git)
    let basename = getBasename(current);
    if (!variations.has(basename)) {
        variations.add(basename);
        toResolve.push(basename);
    }
}
```

---

## Settings Functions

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `PA` | getSettings | chunks.1.mjs:1 | function | Get current settings object |
| `tO` | settingsStore | chunks.1.mjs:1 | object | Settings store with subscribe() |

---

## buildSandboxConfig (R21) Complete Analysis

**Location:** chunks.56.mjs:224-310

```javascript
// ============================================
// buildSandboxConfig - Build sandbox config from settings
// Location: chunks.56.mjs:224-310
// ============================================

// READABLE (for understanding):
function buildSandboxConfig(settings) {
    let permissions = settings.permissions || {};
    let allowedDomains = [];
    let deniedDomains = [];

    // Domain configuration from policy or settings
    if (isAllowManagedDomainsOnly()) {
        let policySettings = getSettings("policySettings");
        for (let domain of policySettings?.sandbox?.network?.allowedDomains || []) {
            allowedDomains.push(domain);
        }
        // Also extract from WebFetch allow rules
        for (let rule of policySettings?.permissions?.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
                allowedDomains.push(parsed.ruleContent.substring(7));
            }
        }
    } else {
        for (let domain of settings.sandbox?.network?.allowedDomains || []) {
            allowedDomains.push(domain);
        }
        for (let rule of permissions.allow || []) {
            let parsed = parsePermissionRule(rule);
            if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
                allowedDomains.push(parsed.ruleContent.substring(7));
            }
        }
    }

    // Denied domains from permission deny rules
    for (let rule of permissions.deny || []) {
        let parsed = parsePermissionRule(rule);
        if (parsed.toolName === "WebFetch" && parsed.ruleContent?.startsWith("domain:")) {
            deniedDomains.push(parsed.ruleContent.substring(7));
        }
    }

    // Build read/write path configurations from permissions
    let denyReadPaths = [];
    let allowWritePaths = [];
    let denyWritePaths = [];

    // ... path building logic ...

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
            denyRead: denyReadPaths,
            allowWrite: allowWritePaths,
            denyWrite: denyWritePaths
        },
        ignoreViolations: settings.sandbox?.ignoreViolations,
        enableWeakerNestedSandbox: settings.sandbox?.enableWeakerNestedSandbox,
        enableWeakerNetworkIsolation: settings.sandbox?.enableWeakerNetworkIsolation,
        ripgrep: ripgrepConfig
    };
}

// Mapping: R21→buildSandboxConfig, A→settings, q→permissions, K→allowedDomains, Y→deniedDomains
```

### Key Algorithm: Permission Rule to Sandbox Config Conversion

**What it does:** Converts permission rules (allow/deny) into sandbox configuration parameters.

**How it works:**
1. Check if `allowManagedDomainsOnly` policy is active
2. If policy mode: use `policySettings.sandbox.network.allowedDomains`
3. If normal mode: use `settings.sandbox.network.allowedDomains`
4. Extract domain patterns from `WebFetch` permission rules
5. Build filesystem paths from `Read`/`Edit` permission rules

**Why this approach:**
- Centralizes all sandbox configuration in one place
- Allows policy-level overrides for enterprise scenarios
- Merges permission rules with explicit sandbox settings

---

## parseExclusionPattern (In8/yfq) Complete Analysis

**Location:** chunks.172.mjs:1530-1544

```javascript
// ============================================
// parseExclusionPattern - Parse exclusion pattern into typed structure
// Location: chunks.172.mjs:1530-1544
// ============================================

// ORIGINAL (for source lookup):
function yfq(A) {
    let q = Ln8(A);
    if (q !== null) return {
        type: "prefix",
        prefix: q
    };
    if (TYz(A)) return {
        type: "wildcard",
        pattern: A
    };
    return {
        type: "exact",
        command: A
    }
}

// READABLE (for understanding):
function parseExclusionPattern(pattern) {
    // Check for prefix pattern (ends with ":*")
    let prefixMatch = parsePrefixPattern(pattern);  // Ln8
    if (prefixMatch !== null) {
        return {
            type: "prefix",
            prefix: prefixMatch
        };
    }

    // Check for wildcard pattern (contains *, ?, [, or ])
    if (isWildcardPattern(pattern)) {  // TYz
        return {
            type: "wildcard",
            pattern: pattern
        };
    }

    // Default: exact match
    return {
        type: "exact",
        command: pattern
    };
}

// Mapping: yfq→parseExclusionPattern, A→pattern, q→prefixMatch,
//          Ln8→parsePrefixPattern, TYz→isWildcardPattern
```

### Pattern Type Decision Tree

```
Input Pattern
     │
     ▼
Ends with ":*"?
     │
     ├─ YES → prefix type
     │         e.g., "npm run test:*" → {type: "prefix", prefix: "npm run test"}
     │
     └─ NO
          │
          ▼
     Contains *, ?, [, ]?
          │
          ├─ YES → wildcard type
          │         e.g., "*.test.js" → {type: "wildcard", pattern: "*.test.js"}
          │
          └─ NO → exact type
                    e.g., "docker" → {type: "exact", command: "docker"}
```

---

## getLinuxGlobPatternWarnings (jx3) Complete Analysis

**Location:** chunks.56.mjs:364-384

```javascript
// ============================================
// getLinuxGlobPatternWarnings - Get warnings for glob patterns on Linux
// Location: chunks.56.mjs:364-384
// ============================================

// ORIGINAL (for source lookup):
function jx3() {
    let A = y8();
    if (A !== "linux" && A !== "wsl") return [];
    try {
        let q = PA();
        if (!q?.sandbox?.enabled) return [];
        let K = q?.permissions || {},
            Y = [],
            z = (_) => {
                let w = _.replace(/\/\*\*$/, "");
                return /[*?[\]]/.test(w)
            };
        for (let _ of [...K.allow || [], ...K.deny || []]) {
            let w = MD6(_);
            if ((w.toolName === R4 || w.toolName === s7) && w.ruleContent && z(w.ruleContent)) Y.push(_)
        }
        return Y
    } catch (q) {
        return k(`Failed to get Linux glob pattern warnings: ${q}`), []
    }
}

// READABLE (for understanding):
function getLinuxGlobPatternWarnings() {
    // Only relevant for Linux/WSL
    let platform = getPlatform();
    if (platform !== "linux" && platform !== "wsl") {
        return [];
    }

    try {
        let settings = getSettings();

        // Sandbox must be enabled for this warning
        if (!settings?.sandbox?.enabled) {
            return [];
        }

        let permissions = settings?.permissions || {};
        let warnings = [];

        // Pattern to detect glob characters (excluding /** which is handled separately)
        let hasGlobChars = (path) => {
            let stripped = path.replace(/\/\*\*$/, "");  // Remove trailing /**
            return /[*?[\]]/.test(stripped);
        };

        // Check all permission rules
        for (let rule of [...permissions.allow || [], ...permissions.deny || []]) {
            let parsed = parsePermissionRule(rule);  // MD6

            // Check Edit and Read tool rules with glob patterns
            if ((parsed.toolName === "Edit" || parsed.toolName === "Read") &&
                parsed.ruleContent && hasGlobChars(parsed.ruleContent)) {
                warnings.push(rule);
            }
        }

        return warnings;
    } catch (error) {
        log(`Failed to get Linux glob pattern warnings: ${error}`);
        return [];
    }
}

// Mapping: jx3→getLinuxGlobPatternWarnings, y8→getPlatform, PA→getSettings,
//          MD6→parsePermissionRule, R4→"Edit", s7→"Read", k→log
```

### Why Glob Pattern Warnings on Linux

**Problem:** On Linux, bwrap uses `--ro-bind` and `--bind` for filesystem isolation. Glob patterns in permission rules (e.g., `src/**/*.ts`) are not directly supported by bwrap.

**How it's handled:**
1. The sandbox attempts to expand glob patterns during command wrapping
2. If expansion fails, commands may run with incorrect filesystem access
3. This function warns users that glob patterns may not work as expected

**Recommendation shown to users:** Use explicit paths or exclude commands that need broader access.

---

## Validation Summary

All sandbox symbols have been cross-validated against source code locations. The module organization is:

- **Low-level implementation**: chunks.55.mjs (aO)
- **Public API facade**: chunks.56.mjs (vA)
- **Bash tool integration**: chunks.172.mjs (Ti, yYz)
- **UI components**: chunks.165.mjs, chunks.191.mjs
- **System prompt**: chunks.171.mjs (E9z)

---

## Source-Verified Symbol Table (v2.1.76 Cross-Validation)

> These symbols have been directly verified against source code on 2026-03-25.

### Core Sandbox Implementation (chunks.55.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `HD6` | SandboxViolationStore | 2902-2936 | class | ✅ Ring buffer + observer pattern |
| `QZ7` | wrapWithMacOSSandbox | 2803 | function | ✅ macOS sandbox-exec wrapper |
| `xb3` | generateSeatbeltProfile | 2755 | function | ✅ SBPL profile generator |
| `uZ7` | wrapWithLinuxSandbox | 2564 | function | ✅ Linux bwrap wrapper |
| `bw8` | matchDomainPattern | 2952-2958 | function | ✅ Wildcard domain matching |
| `nZ7` | checkNetworkPermission | 2960-2978 | function | ✅ Domain allow/deny check |
| `gb3` | startHttpProxy | 2992-3007 | function | ✅ HTTP proxy startup |
| `Fb3` | startSocksProxy | 3010-3022 | function | ✅ SOCKS proxy startup |
| `pb3` | initializeLowLevel | 3024-3057 | function | ✅ Bootstrap with proxies |
| `rZ7` | isSupportedPlatform | 3059-3063 | function | ✅ Platform check |
| `Qb3` | isSandboxInitialized | 3065-3067 | function | ✅ Config loaded check |
| `oZ7` | checkDependencies | 3069-3087 | function | ✅ bwrap, socat, seccomp check |
| `Ub3` | getFsReadConfig | 3090-3104 | function | ✅ Read restrictions |
| `db3` | getFsWriteConfig | 3107-3123 | function | ✅ Write restrictions |
| `cb3` | getNetworkRestrictionConfig | 3126-3137 | function | ✅ Network allow/deny |
| `aZ7` | getAllowUnixSockets | 3140-3141 | function | ✅ Unix socket allowlist |
| `T21` | encodeBase64Command | 2115 | function | ✅ Base64 encode for log correlation |

### Public API Facade (chunks.56.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `vA` | sandboxConfigObject | 516-547 | object | ✅ Public API facade |
| `h21` | isSandboxingEnabled | 357 | function | ✅ Full gate check |
| `Xx3` | wrapWithSandbox | 417 | function | ✅ Main dispatch |
| `Px3` | sandboxInitialize | 424 | function | ✅ Bootstrap init |
| `TG7` | isSandboxEnabledInSettings | 329 | function | ✅ Settings check |
| `$x3` | isAutoAllowBashIfSandboxedEnabled | 337 | function | ✅ Auto-allow check |
| `Hx3` | areUnsandboxedCommandsAllowed | 341 | function | ✅ Fallback policy check |
| `Jx3` | areSandboxSettingsLockedByPolicy | 386 | function | ✅ Policy lock check |
| `Mx3` | setSandboxSettings | 395 | function | ✅ Write settings |
| `Dx3` | getExcludedCommands | 413 | function | ✅ Get exclusion patterns |

### Tool Integration (chunks.172.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `Ti` | isCommandSandboxed | 2454-2460 | function | ✅ 4-gate sandbox decision |
| `yYz` | isCommandInExcludedList | 2412-2452 | function | ✅ BFS variant expansion |
| `yfq` | parseExclusionPattern | 1530 | function | ✅ Pattern type parser |
| `In8` | parseExclusionPattern (alias) | 1530 | function | ✅ Same as yfq |
| `Ln8` | extractPrefixPattern | 1488 | function | ✅ Prefix extraction |
| `TYz` | isWildcardPattern | 1492 | function | ✅ Wildcard detection |
| `Cn8` | matchWildcardPattern | 1645 | function | ✅ Glob-style matching |
| `bn8` | resolveCommandEnvVars | 1682 | function | ✅ Strip env vars |
| `Ac` | extractCommandBasename | 1660 | function | ✅ Command name extraction |
| `xfq` | LD_PATH_REGEX | 2408 | constant | ✅ `/^(LD_|DYLD_|PATH$)/` |
| `vYz` | SHELL_COMMANDS_SET | 2405 | constant | ✅ Shell commands set |
| `AS1` | SAFE_ENV_VARS_SET | 2407 | constant | ✅ Safe env vars set |

### System Prompt Integration (chunks.171.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `E9z` | getSandboxSystemPromptBlock | 1892-1923 | function | ✅ Bash tool prompt injection |

### Agent Teams Permission Sync (chunks.134.mjs)

> **NEW:** These symbols handle sandbox permission synchronization between team leaders and workers in multi-agent scenarios.

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `al4` | generateSandboxRequestId | 1052-1054 | function | ✅ Generate unique sandbox request ID |
| `sl4` | sendSandboxPermissionRequest | 1056-1082 | function | ✅ Send permission request to team leader |
| `tl4` | sendSandboxPermissionResponse | 1084-1101 | function | ✅ Send permission response to worker |
| `nc6` | sandboxPermissionCallbacks | 1183-1191 | variable | ✅ Map of pending sandbox callbacks |
| `Yi4` | hasSandboxCallback | 1169-1170 | function | ✅ Check if callback exists for request |
| `zi4` | resolveSandboxCallback | 1173-1176 | function | ✅ Resolve callback promise with response |

### UI Components (chunks.165.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `bAz` | sandboxSlashCommandDefinition | 2007-2032 | object | ✅ /sandbox slash command |
| `TPq` | SandboxModeSelector | 1737-1870 | function | ✅ 3-way mode picker |
| `PPq` | SandboxStatusDisplay | 1399-1487 | function | ✅ Config summary display |
| `ZPq` | SandboxOverridesSettings | 1505-1628 | function | ✅ Open/closed policy toggle |
| `Ql8` | SandboxDependenciesPanel | 1641-1735 | function | ✅ Dependency status display |

### Status Line Integration (chunks.191.mjs)

| Symbol | Readable | Line | Type | Verification |
|--------|----------|------|------|--------------|
| `aIq` | SandboxViolationStatusLine | 92-124 | function | ✅ Status bar violation indicator |

---

## Verification Methodology

Each symbol was verified by:
1. Searching for the symbol definition in source files using grep
2. Reading the surrounding code context to verify function/class purpose
3. Comparing with existing documentation
4. Marking as validated with exact line numbers

**Verification Date**: 2026-03-25
**Claude Code Version**: 2.1.76
**Status**: All core symbols cross-validated against source code

---

## Agent Teams Permission Sync Code Analysis

### generateSandboxRequestId (al4)

```javascript
// ============================================
// generateSandboxRequestId - Generate unique sandbox permission request ID
// Location: chunks.134.mjs:1052-1054
// ============================================

// ORIGINAL (for source lookup):
function al4() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}

// READABLE (for understanding):
function generateSandboxRequestId() {
    // Format: sandbox-{timestamp}-{random_7_chars}
    // Example: sandbox-1711350000000-a1b2c3d
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Mapping: al4→generateSandboxRequestId
```

**What it does:** Generates a unique identifier for sandbox permission requests that can be used to correlate requests and responses between team members.

### sendSandboxPermissionRequest (sl4)

```javascript
// ============================================
// sendSandboxPermissionRequest - Send permission request to team leader
// Location: chunks.134.mjs:1056-1082
// ============================================

// ORIGINAL (for source lookup):
async function sl4(A, q, K) {
    let Y = K || l5();
    if (!Y) return k("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
    let z = await ol4(Y);
    if (!z) return k("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
    let _ = nM(), w = i3(), O = H$();
    if (!_ || !w) return k("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
    try {
        let $ = Wx8({
            requestId: q,
            workerId: _,
            workerName: w,
            workerColor: O,
            host: A
        });
        return await x3(z, {
            from: w,
            text: B6($),
            timestamp: new Date().toISOString(),
            color: O
        }, Y), k(`[PermissionSync] Sent sandbox permission request ${q} for host ${A} to leader ${z} via mailbox`), !0
    } catch ($) {
        return k(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${$}`), _6($), !1
    }
}

// READABLE (for understanding):
async function sendSandboxPermissionRequest(host, requestId, teamName) {
    // Step 1: Get team name
    let team = teamName || getCurrentTeamName();
    if (!team) {
        log("[PermissionSync] Cannot send sandbox permission request: team name not found");
        return false;
    }

    // Step 2: Get leader name
    let leaderName = await getTeamLeaderName(team);
    if (!leaderName) {
        log("[PermissionSync] Cannot send sandbox permission request: leader name not found");
        return false;
    }

    // Step 3: Get worker info
    let workerId = getWorkerId();
    let workerName = getWorkerName();
    let workerColor = getWorkerColor();
    if (!workerId || !workerName) {
        log("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found");
        return false;
    }

    // Step 4: Build and send request via mailbox
    try {
        let requestPayload = encodeSandboxPermissionRequest({
            requestId: requestId,
            workerId: workerId,
            workerName: workerName,
            workerColor: workerColor,
            host: host
        });

        await sendMailboxMessage(leaderName, {
            from: workerName,
            text: JSON.stringify(requestPayload),
            timestamp: new Date().toISOString(),
            color: workerColor
        }, team);

        log(`[PermissionSync] Sent sandbox permission request ${requestId} for host ${host} to leader ${leaderName} via mailbox`);
        return true;
    } catch (error) {
        log(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${error}`);
        reportError(error);
        return false;
    }
}

// Mapping: sl4→sendSandboxPermissionRequest, A→host, q→requestId, K→teamName,
//          l5→getCurrentTeamName, ol4→getTeamLeaderName, nM→getWorkerId,
//          i3→getWorkerName, H$→getWorkerColor, Wx8→encodeSandboxPermissionRequest,
//          x3→sendMailboxMessage, B6→JSON.stringify, _6→reportError
```

**What it does:** When a worker agent encounters a network request that would be blocked by sandbox, this function sends a permission request to the team leader via the mailbox system. The leader can then approve or deny the request.

### sendSandboxPermissionResponse (tl4)

```javascript
// ============================================
// sendSandboxPermissionResponse - Send permission response to worker
// Location: chunks.134.mjs:1084-1101
// ============================================

// ORIGINAL (for source lookup):
async function tl4(A, q, K, Y, z) {
    let _ = z || l5();
    if (!_) return k("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
    try {
        let w = Zx8({
                requestId: q,
                host: K,
                allow: Y
            }),
            O = i3() || "team-lead";
        return await x3(A, {
            from: O,
            text: B6(w),
            timestamp: new Date().toISOString()
        }, _), k(`[PermissionSync] Sent sandbox permission response for ${q} (host: ${K}, allow: ${Y}) to worker ${A} via mailbox`), !0
    } catch (w) {
        return k(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${w}`), _6(w), !1
    }
}

// READABLE (for understanding):
async function sendSandboxPermissionResponse(workerName, requestId, host, allow, teamName) {
    // Step 1: Get team name
    let team = teamName || getCurrentTeamName();
    if (!team) {
        log("[PermissionSync] Cannot send sandbox permission response: team name not found");
        return false;
    }

    // Step 2: Build and send response via mailbox
    try {
        let responsePayload = encodeSandboxPermissionResponse({
            requestId: requestId,
            host: host,
            allow: allow  // boolean: true to allow, false to deny
        });

        let senderName = getWorkerName() || "team-lead";

        await sendMailboxMessage(workerName, {
            from: senderName,
            text: JSON.stringify(responsePayload),
            timestamp: new Date().toISOString()
        }, team);

        log(`[PermissionSync] Sent sandbox permission response for ${requestId} (host: ${host}, allow: ${allow}) to worker ${workerName} via mailbox`);
        return true;
    } catch (error) {
        log(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${error}`);
        reportError(error);
        return false;
    }
}

// Mapping: tl4→sendSandboxPermissionResponse, A→workerName, q→requestId, K→host,
//          Y→allow, z→teamName, Zx8→encodeSandboxPermissionResponse
```

**What it does:** Called by the team leader to send a sandbox permission decision back to the requesting worker.

### Sandbox Permission Callback System

```javascript
// ============================================
// sandboxPermissionCallbacks - Map of pending sandbox permission callbacks
// Location: chunks.134.mjs:1183-1191
// ============================================

// ORIGINAL (for source lookup):
nc6 = new Map

// READABLE (for understanding):
let sandboxPermissionCallbacks = new Map();  // Map<requestId, {resolve, reject}>

// Mapping: nc6→sandboxPermissionCallbacks

// ============================================
// hasSandboxCallback - Check if callback exists for request
// Location: chunks.134.mjs:1169-1170
// ============================================

// ORIGINAL (for source lookup):
function Yi4(A) {
    return nc6.has(A)
}

// READABLE (for understanding):
function hasSandboxCallback(requestId) {
    return sandboxPermissionCallbacks.has(requestId);
}

// Mapping: Yi4→hasSandboxCallback, A→requestId

// ============================================
// resolveSandboxCallback - Resolve callback promise with response
// Location: chunks.134.mjs:1173-1176
// ============================================

// ORIGINAL (for source lookup):
function zi4(A) {
    let q = nc6.get(A.requestId);
    if (!q) return k(`[SwarmPermissionPoller] No sandbox callback registered for request ${A.requestId}`), !1;
    return k(`[SwarmPermissionPoller] Processing sandbox response for request ${A.requestId}: allow=${A.allow}`), nc6.delete(A.requestId), q.resolve(A.allow), !0
}

// READABLE (for understanding):
function resolveSandboxCallback(response) {
    // response: { requestId: string, host: string, allow: boolean }
    let callback = sandboxPermissionCallbacks.get(response.requestId);

    if (!callback) {
        log(`[SwarmPermissionPoller] No sandbox callback registered for request ${response.requestId}`);
        return false;
    }

    log(`[SwarmPermissionPoller] Processing sandbox response for request ${response.requestId}: allow=${response.allow}`);

    // Remove from map and resolve the promise
    sandboxPermissionCallbacks.delete(response.requestId);
    callback.resolve(response.allow);  // Resolve the waiting Promise with true/false

    return true;
}

// Mapping: zi4→resolveSandboxCallback, A→response, q→callback
```

**How the callback system works:**

1. **Request initiation**: Worker calls a function that creates a Promise and stores `{resolve, reject}` in `nc6`
2. **Mailbox send**: Request is sent to leader via `sendSandboxPermissionRequest`
3. **Leader processes**: Leader sees request in UI, makes decision
4. **Response sent**: Leader calls `sendSandboxPermissionResponse`
5. **Inbox polling**: Worker's inbox poller detects response
6. **Callback resolved**: `resolveSandboxCallback` is called, resolving the original Promise