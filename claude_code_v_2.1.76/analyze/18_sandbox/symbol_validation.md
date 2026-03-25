# Sandbox Symbol Validation Report (Claude Code 2.1.76)

## Overview

This document contains cross-validated symbol mappings for the Sandbox module. All symbols have been verified against source code locations.

## Validation Methodology

1. Search for symbol definition in source files using grep
2. Read surrounding code context to verify function/class purpose
3. Compare with existing documentation
4. Mark as validated, corrected, or new

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

### Sandbox Initialization

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `Xx3` | wrapWithSandbox | chunks.56.mjs:417 | ✅ Validated | Main dispatch function |
| `Px3` | sandboxInitialize | chunks.56.mjs:424 | ✅ Validated | Bootstrap initialization |
| `h21` | isSandboxingEnabled | chunks.56.mjs:357 | ✅ Validated | Global enabled check |
| `Dx3` | getExcludedCommands | chunks.56.mjs:413 | ✅ Validated | Get exclusion patterns |
| `Wx3` | refreshSandboxConfig | chunks.56.mjs:447 | ✅ Validated | Reload config |
| `Zx3` | sandboxReset | chunks.56.mjs:454 | ✅ Validated | Clear state |

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
| `Sb3` | getDenyWritePaths | chunks.55.mjs:2669 | ✅ Validated | Mandatory deny paths |
| `Cb3` | generateLogTag | chunks.55.mjs:2678 | ✅ Validated | Correlation ID |

### Seccomp Filter (Linux)

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `RZ7` | getSeccompBpfPath | chunks.55.mjs:2251 | ✅ Validated | Find BPF file |
| `Ex6` | getApplySeccompPath | chunks.55.mjs:2227 | ✅ Validated | Find apply binary |
| `Nw8` | getSeccompArch | chunks.55.mjs:2175 | ✅ Validated | Architecture mapping |

### Violation Monitoring

| Obfuscated | Readable | File:Line | Status | Notes |
|------------|----------|-----------|--------|-------|
| `UZ7` | startLogMonitor | chunks.55.mjs:2843 | ✅ Validated | macOS log stream |
| `FZ7` | SANDBOX_LOG_TAG | chunks.55.mjs:2899 | ✅ Validated | Unique session ID |
| `T21` | encodeBase64 | chunks.55.mjs:2679 | ✅ Validated | Command encoding |

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

## Conclusion

All sandbox symbols have been validated against source code. Key findings:

1. `vA` (not `b8`) is the correct sandboxConfigObject
2. `QZ7` (not `Ye8`) is the correct wrapWithMacOSSandbox
3. `xb3` (not `FP5`) is the correct generateSeatbeltProfile
4. `E9z` (not `nBY`) is the correct getSandboxSystemPromptBlock
5. All core functions are in chunks.55.mjs