# Sandbox Architecture (Claude Code 2.1.38)

## Overview

The sandbox system is a critical security boundary that restricts what commands executed by Claude can do to the host system. It operates at the OS level using platform-native isolation mechanisms -- macOS `sandbox-exec` (seatbelt) and Linux `bwrap` (bubblewrap) -- to enforce filesystem, network, and process restrictions on every bash command the model invokes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `wrapWithSandbox` (eP5) - Main dispatch: wraps a command string with platform-specific sandbox
- `wrapWithMacOSSandbox` (Ye8) - macOS seatbelt wrapper using sandbox-exec
- `wrapWithLinuxSandbox` (st8) - Linux bwrap wrapper using bubblewrap + seccomp
- `buildSeatbeltProfile` (FP5) - Generates macOS sandbox-exec SBPL policy string
- `sandboxInitialize` (lP5) - Bootstraps sandbox: starts proxy servers, log monitor
- `isSandboxingEnabled` (Nq6) - Checks if sandbox is active (settings + platform support)
- `sandboxDebugLog` (L8) - Debug logger gated by SRT_DEBUG env var
- `SandboxViolationStore` (dy1) - Stores violations detected by the macOS log monitor
- `resolvePath` (tC) - Resolves relative/glob/tilde paths to absolute for sandbox rules
- `getSandboxRuntimePaths` (Ut8) - Locates `@anthropic-ai/sandbox-runtime` globally
- `getBpfFilterPath` (dt8) - Finds pre-generated seccomp BPF filter for unix socket blocking
- `getApplySeccompPath` (py1) - Finds the `apply-seccomp` binary
- `startMacOSLogMonitor` (ze8) - Streams macOS sandbox deny events in real time
- `isNetworkPermissionAllowed` (_e8) - Domain-level allow/deny decision for network proxying
- `sandboxConfigObject` (b8) - Public API object exposing all sandbox methods
- `buildProxyEnvVars` ($q6) - Constructs HTTP_PROXY/SOCKS_PROXY/NO_PROXY env vars
- `getDefaultWriteAllowPaths` (Uy1) - Returns safe write paths (/dev/null, /tmp/claude, etc.)

---

## Architecture Diagram

```
User or Agent Loop
       |
       v
  +-----------+
  | b8 (API)  |  <-- sandboxConfigObject: public interface
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
// Location: chunks.44.mjs:3166-3206 (Ln 119283)
// ============================================

// ORIGINAL (for source lookup):
function Ye8(A) {
    let { command: q, needsNetworkRestriction: K, httpProxyPort: Y, socksProxyPort: z,
          allowUnixSockets: w, allowAllUnixSockets: H, allowLocalBinding: $,
          readConfig: O, writeConfig: _, allowPty: J, allowGitConfig: X = !1, binShell: D } = A,
        j = O && O.denyOnly.length > 0;
    if (!K && !j && _ === void 0) return q;
    let P = uP5(q), W = FP5({ readConfig: O, writeConfig: _, httpProxyPort: Y, ... }),
        G = $q6(Y, z), f = D || "bash",
        Z = xP5("which", [f], { encoding: "utf8" });
    if (Z.status !== 0) throw Error(`Shell '${f}' not found in PATH`);
    let N = Z.stdout.trim(),
        T = Ae8.default.quote(["env", ...G, "sandbox-exec", "-p", W, N, "-c", q]);
    return T
}

// READABLE (for understanding):
function wrapWithMacOSSandbox(config) {
    let { command, needsNetworkRestriction, httpProxyPort, socksProxyPort,
          allowUnixSockets, allowAllUnixSockets, allowLocalBinding,
          readConfig, writeConfig, allowPty, allowGitConfig = false, binShell } = config;

    let hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
    // Early exit: if no restrictions needed at all, return command as-is
    if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) return command;

    let logTag = encodeCommandForLogging(command);
    let seatbeltProfile = buildSeatbeltProfile({ readConfig, writeConfig, httpProxyPort, ... });
    let proxyEnvVars = buildProxyEnvVars(httpProxyPort, socksProxyPort);
    let shell = binShell || "bash";
    let shellPath = which(shell);

    // Construct: env HTTP_PROXY=... sandbox-exec -p "<profile>" /bin/bash -c "<command>"
    return shellQuote(["env", ...proxyEnvVars, "sandbox-exec", "-p", seatbeltProfile, shellPath, "-c", command]);
}

// Mapping: Ye8->wrapWithMacOSSandbox, A->config, q->command, K->needsNetworkRestriction, Y->httpProxyPort, z->socksProxyPort, FP5->buildSeatbeltProfile, $q6->buildProxyEnvVars, uP5->encodeCommandForLogging
```

### Linux Bubblewrap (bwrap) + Seccomp

**What it does:** Wraps commands using `bwrap` with namespace isolation (network, filesystem) and optionally applies seccomp BPF filters to block Unix socket creation.

**How it works:**
1. `wrapWithSandbox` (eP5) detects platform as "linux" and calls `wrapWithLinuxSandbox` (st8)
2. For filesystem isolation:
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
// wrapWithLinuxSandbox - Linux bwrap sandbox wrapper (excerpt)
// Location: chunks.44.mjs:2830-3010 (Ln 118852)
// ============================================

// ORIGINAL (for source lookup):
function st8({ command: q, needsNetworkRestriction: K, httpSocketPath: Y, socksSocketPath: z,
               httpProxyPort: w, socksProxyPort: H, readConfig: $, writeConfig: O,
               enableWeakerNestedSandbox: _, allowAllUnixSockets: J, binShell: X, ... }) {
    // ... builds bwrap args with --bind, --ro-bind, --tmpfs, --unshare-net ...
    if (K) { Z.push("--unshare-net"); /* bind bridge sockets */ }
    // ... seccomp filter application ...
}

// READABLE (for understanding):
function wrapWithLinuxSandbox({
    command, needsNetworkRestriction, httpSocketPath, socksSocketPath,
    httpProxyPort, socksProxyPort, readConfig, writeConfig,
    enableWeakerNestedSandbox, allowAllUnixSockets, binShell, ...
}) {
    let bwrapArgs = ["bwrap"];

    // 1. Filesystem isolation
    if (writeConfig.allowOnly) {
        for (let writePath of writeConfig.allowOnly) {
            let resolved = resolvePath(writePath);
            if (resolved.startsWith("/dev/")) continue;  // Skip /dev paths
            if (!fs.existsSync(resolved)) continue;       // Skip non-existent
            bwrapArgs.push("--bind", resolved, resolved);  // Writable mount
        }
        // Deny paths within allowed paths: mount read-only
        for (let denyPath of writeConfig.denyWithinAllow) {
            let symlinkTarget = detectSymlinkInAllowedPaths(denyPath, allowedPaths);
            if (symlinkTarget) {
                // Symlink attack mitigation: mount /dev/null at target
                bwrapArgs.push("--ro-bind", "/dev/null", symlinkTarget);
                continue;
            }
            bwrapArgs.push("--ro-bind", denyPath, denyPath);
        }
    } else {
        bwrapArgs.push("--bind", "/", "/");  // Everything writable (fallback)
    }

    // 2. Network isolation
    if (needsNetworkRestriction) {
        bwrapArgs.push("--unshare-net");
        // Bind bridge sockets into namespace for proxy access
        bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
        bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);
    }

    // 3. Seccomp filter for Unix socket blocking
    if (!allowAllUnixSockets) {
        let bpfFilter = getBpfFilterPath();
        let applyBinary = getApplySeccompPath();
        if (bpfFilter && applyBinary) {
            // apply-seccomp loads BPF filter then execs the command
        }
    }

    return constructFinalCommand(bwrapArgs, command);
}

// Mapping: st8->wrapWithLinuxSandbox, q->command, K->needsNetworkRestriction, Y->httpSocketPath, z->socksSocketPath
```

---

## Sandbox Configuration System

### Settings-Driven Configuration

The sandbox is configured through the `b8` (sandboxConfigObject) which reads from settings:

```javascript
// ============================================
// sandboxConfigObject - Public sandbox API
// Location: chunks.47.mjs:109-139 (Ln 123872)
// ============================================

// ORIGINAL (for source lookup):
b8 = {
    initialize: EG5,
    isSandboxingEnabled: Nq6,
    isSandboxEnabledInSettings: le8,
    isAutoAllowBashIfSandboxedEnabled: GG5,
    areUnsandboxedCommandsAllowed: ZG5,
    wrapWithSandbox: vG5,
    ...
}

// READABLE (for understanding):
sandboxConfigObject = {
    initialize: initializeSandboxFromSettings,
    isSandboxingEnabled: isSandboxingEnabled,
    isSandboxEnabledInSettings: isSandboxEnabledInSettings,
    isAutoAllowBashIfSandboxedEnabled: isAutoAllowBashIfSandboxedEnabled,
    areUnsandboxedCommandsAllowed: areUnsandboxedCommandsAllowed,
    wrapWithSandbox: wrapWithSandboxFromSettings,
    // ... delegates most calls to hO (the low-level sandbox module)
}

// Mapping: b8->sandboxConfigObject, EG5->initializeSandboxFromSettings, Nq6->isSandboxingEnabled, le8->isSandboxEnabledInSettings, GG5->isAutoAllowBashIfSandboxedEnabled, ZG5->areUnsandboxedCommandsAllowed
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
