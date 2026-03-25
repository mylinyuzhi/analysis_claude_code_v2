# macOS Seatbelt Profile Generation (Claude Code 2.1.76)

## Overview

Claude Code uses macOS's sandbox-exec facility with dynamically generated Seatbelt (SBPL) profiles to restrict command execution. The profile is generated at runtime based on the specific security requirements of each command, including network restrictions, file access permissions, and process capabilities. The profile follows a whitelist-by-default approach with explicit denies for restricted resources.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key symbols in this document:
- `xb3` - generateSeatbeltProfile function (main profile generator)
- `Ib3` - generateFileReadRules function
- `bb3` - generateFileWriteRules function
- `QZ7` - wrapWithSeatbeltSandbox function (invokes sandbox-exec)
- `Hv` - quoteString function (JSON stringification for SBPL)
- `ub3` - getTempDirPaths function (macOS temp directory resolution)
- `UZ7` - startLogMonitor function (violation detection via log stream)
- `HD6` - SandboxViolationStore class (ring buffer for violations)
- `FZ7` - SANDBOX_LOG_TAG constant (unique identifier for log filtering)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Seatbelt Profile Generation Flow                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Command Request                                                            │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ wrapWithSeatbeltSandbox (QZ7)                                        │   │
│  │   • Check if sandboxing needed (network/file restrictions?)          │   │
│  │   • Generate unique log tag (random suffix for correlation)          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ generateSeatbeltProfile (xb3)                                        │   │
│  │   • Core permissions (process, mach IPC, sysctl)                     │   │
│  │   • Network rules (based on needsNetworkRestriction)                 │   │
│  │   • File read rules (Ib3) - allow all, deny specific                │   │
│  │   • File write rules (bb3) - deny default, allow specific           │   │
│  │   • PTY rules (if allowPty)                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  sandbox-exec -p <profile> /bin/bash -c <command>                          │
│       │                                                                     │
│       ▼                                                                     │
│  Log Monitor (UZ7)                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ log stream --predicate '(eventMessage ENDSWITH "_xxx_SBX")'         │   │
│  │   • Captures sandbox violations                                      │   │
│  │   • Correlates with encoded command                                  │   │
│  │   • Filters known benign violations (mDNSResponder, diagnosticd)     │   │
│  │   • Stores in SandboxViolationStore (HD6)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Profile Generation: `generateSeatbeltProfile` (xb3)

**Location:** `chunks.55.mjs:2755-2786`

```javascript
// ============================================
// generateSeatbeltProfile - Generate SBPL profile for sandbox-exec
// Location: chunks.55.mjs:2755-2786
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
    let M = ["(version 1)", `(deny default (with message "${J}"))`, "", `; LogTag: ${J}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", ...];
    // ... network and file rules ...
    return M.join(`
`)
}

// READABLE (for understanding):
function generateSeatbeltProfile({
    readConfig,           // { denyOnly: string[] } - paths to deny reading
    writeConfig,          // { allowOnly: string[], denyWithinAllow: string[] }
    httpProxyPort,        // Port for HTTP proxy (allowed localhost binding)
    socksProxyPort,       // Port for SOCKS proxy (allowed localhost binding)
    needsNetworkRestriction,  // If true, apply network rules
    allowUnixSockets,     // Array of Unix socket paths to allow
    allowAllUnixSockets,  // If true, allow all Unix sockets
    allowLocalBinding,    // If true, allow binding to any localhost port
    allowPty,             // If true, allow pseudo-terminal access
    allowGitConfig = false,   // Allow writing to .git/config
    enableWeakerNetworkIsolation = false,  // Allow trustd.agent for Go TLS
    logTag                // Unique identifier for violation correlation
}) {
    let profile = [
        // Header
        "(version 1)",
        `(deny default (with message "${logTag}"))`,
        "",
        `; LogTag: ${logTag}`,
        "",
        // Core permissions (see below for details)
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
        // Mach IPC, sysctl, IOKit rules...
        // Network rules (conditional)
        // File read/write rules
    ];

    return profile.join("\n");
}

// Mapping: xb3→generateSeatbeltProfile, A→readConfig, q→writeConfig, K→httpProxyPort,
//          Y→socksProxyPort, z→needsNetworkRestriction, _→allowUnixSockets,
//          w→allowAllUnixSockets, O→allowLocalBinding, $→allowPty, H→allowGitConfig,
//          j→enableWeakerNetworkIsolation, J→logTag, M→profile
```

---

## Core Permission Rules

### Process Permissions

```
; Process permissions
(allow process-exec)           ; Allow executing new processes
(allow process-fork)           ; Allow forking child processes
(allow process-info* (target same-sandbox))  ; Allow querying own process info
(allow signal (target same-sandbox))         ; Allow sending signals to children
(allow mach-priv-task-port (target same-sandbox))  ; Allow Mach task port for debugging
```

**Why these permissions:** Without these, the sandboxed process couldn't spawn children (e.g., shell pipelines), debug itself, or perform basic process operations. The `same-sandbox` target ensures permissions don't leak to processes outside the sandbox.

### Mach IPC Permissions

```
; Mach IPC - specific services only (no wildcard)
(allow mach-lookup
  (global-name "com.apple.audio.systemsoundserver")      ; System sounds
  (global-name "com.apple.distributed_notifications@Uv3") ; Notifications
  (global-name "com.apple.FontObjectsServer")            ; Font rendering
  (global-name "com.apple.fonts")                        ; Font access
  (global-name "com.apple.logd")                         ; Logging
  (global-name "com.apple.lsd.mapdb")                    ; Launch Services
  (global-name "com.apple.PowerManagement.control")      ; Power management
  (global-name "com.apple.system.logger")                ; System log
  (global-name "com.apple.system.notification_center")   ; Notifications
  (global-name "com.apple.system.opendirectoryd.libinfo") ; User/group lookup
  (global-name "com.apple.system.opendirectoryd.membership")
  (global-name "com.apple.bsd.dirhelper")                ; Directory services
  (global-name "com.apple.securityd.xpc")                ; Keychain access
  (global-name "com.apple.coreservices.launchservicesd") ; App launching
)
```

**Why no wildcard:** A blanket `(allow mach-lookup)` would allow the sandboxed process to communicate with any system service, defeating the purpose of sandboxing. Each service is explicitly allowed only if needed.

### sysctl Permissions

```
; sysctl - specific sysctls only
(allow sysctl-read
  (sysctl-name "hw.activecpu")
  (sysctl-name "hw.busfrequency_compat")
  (sysctl-name "hw.byteorder")
  (sysctl-name "hw.cacheconfig")
  (sysctl-name "hw.cachelinesize_compat")
  (sysctl-name "hw.cpufamily")
  ; ... 40+ more specific sysctls ...
  (sysctl-name-prefix "hw.optional.arm")      ; ARM feature detection
  (sysctl-name-prefix "hw.optional.arm.")
  (sysctl-name-prefix "hw.optional.armv8_")
  (sysctl-name-prefix "hw.perflevel")         ; Performance levels
  (sysctl-name-prefix "kern.proc.all")        ; Process info
  (sysctl-name-prefix "kern.proc.pgrp.")
  (sysctl-name-prefix "kern.proc.pid.")
  (sysctl-name-prefix "machdep.cpu.")         ; CPU details
  (sysctl-name-prefix "net.routetable.")      ; Network routing
)

; V8 thread calculations
(allow sysctl-write
  (sysctl-name "kern.tcsm_enable")   ; Thread confinement (Apple Silicon)
)
```

**Why specific sysctls:** Many sysctls expose sensitive information (e.g., `kern.hostname` could be identifying). Only sysctls needed for runtime operations are allowed.

### IOKit Permissions

```
; IOKit - specific operations only
(allow iokit-open
  (iokit-registry-entry-class "IOSurfaceRootUserClient")   ; GPU surfaces
  (iokit-registry-entry-class "RootDomainUserClient")      ; Power management
  (iokit-user-client-class "IOSurfaceSendRight")           ; Surface sharing
)

; IOKit properties
(allow iokit-get-properties)
```

**Why these classes:** IOSurface is needed for graphics rendering (used by Node.js native modules). RootDomain is needed for power state queries.

---

## Network Rules

### No Restriction

```
; Network
(allow network*)
```

### With Network Restriction

```javascript
// ORIGINAL (for source lookup):
if (!z) M.push("(allow network*)");
else {
    if (O) M.push('(allow network-bind (local ip "*:*"))'), ...
    if (w) M.push("(allow system-socket (socket-domain AF_UNIX))"), ...
    else if (_ && _.length > 0) {
        M.push("(allow system-socket (socket-domain AF_UNIX))");
        for (let D of _) {
            let X = EL(D);
            M.push(`(allow network-bind (local unix-socket (subpath ${Hv(X)})))`), ...
        }
    }
    if (K !== void 0) M.push(`(allow network-bind (local ip "localhost:${K}"))`), ...
    if (Y !== void 0) M.push(`(allow network-bind (local ip "localhost:${Y}"))`), ...
}

// READABLE (for understanding):
if (!needsNetworkRestriction) {
    profile.push("(allow network*)");  // No restrictions
} else {
    // Allow local binding if requested
    if (allowLocalBinding) {
        profile.push('(allow network-bind (local ip "*:*"))');
        profile.push('(allow network-inbound (local ip "*:*"))');
        profile.push('(allow network-outbound (local ip "*:*"))');
    }

    // Unix socket permissions
    if (allowAllUnixSockets) {
        profile.push("(allow system-socket (socket-domain AF_UNIX))");
        profile.push('(allow network-bind (local unix-socket (path-regex #"^/")))');
        profile.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
    } else if (allowUnixSockets && allowUnixSockets.length > 0) {
        profile.push("(allow system-socket (socket-domain AF_UNIX))");
        for (let socketPath of allowUnixSockets) {
            let expandedPath = expandPath(socketPath);  // Resolve ~, env vars
            profile.push(`(allow network-bind (local unix-socket (subpath ${quoteString(expandedPath)})))`);
            profile.push(`(allow network-outbound (remote unix-socket (subpath ${quoteString(expandedPath)})))`);
        }
    }

    // Proxy ports (for network interception)
    if (httpProxyPort !== undefined) {
        profile.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
        profile.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
        profile.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
    }
    if (socksProxyPort !== undefined) {
        profile.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
        profile.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
        profile.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
    }
}
```

**Key insight:** When `needsNetworkRestriction` is true, network access is denied by default. Only explicitly allowed operations (proxy ports, Unix sockets, local binding) are permitted.

---

## File Access Rules

### File Read Rules: `generateFileReadRules` (Ib3)

**Location:** `chunks.55.mjs:2715-2727`

```javascript
// ============================================
// generateFileReadRules - Generate file read permission rules
// Location: chunks.55.mjs:2715-2727
// ============================================

// ORIGINAL (for source lookup):
function Ib3(A, q) {
    if (!A) return ["(allow file-read*)"];
    let K = [];
    K.push("(allow file-read*)");
    for (let Y of A.denyOnly || []) {
        let z = EL(Y);
        if (zk(z)) {
            let _ = OD6(z);
            K.push("(deny file-read*", `  (regex ${Hv(_)})`, `  (with message "${q}"))`)
        } else K.push("(deny file-read*", `  (subpath ${Hv(z)})`, `  (with message "${q}"))`)
    }
    return K.push(...pZ7(A.denyOnly || [], q)), K
}

// READABLE (for understanding):
function generateFileReadRules(readConfig, logTag) {
    // No config = allow all reads
    if (!readConfig) return ["(allow file-read*)"];

    let rules = [];

    // Default: allow all file reads
    rules.push("(allow file-read*)");

    // Then deny specific paths
    for (let denyPath of readConfig.denyOnly || []) {
        let expandedPath = expandPath(denyPath);

        if (isGlobPattern(expandedPath)) {
            let regex = globToRegex(expandedPath);
            rules.push("(deny file-read*");
            rules.push(`  (regex ${quoteString(regex)})`);
            rules.push(`  (with message "${logTag}"))`);
        } else {
            rules.push("(deny file-read*");
            rules.push(`  (subpath ${quoteString(expandedPath)})`);
            rules.push(`  (with message "${logTag}"))`);
        }
    }

    // Add home directory protection rules
    rules.push(...generateHomeDirProtection(readConfig.denyOnly || [], logTag));

    return rules;
}

// Mapping: Ib3→generateFileReadRules, A→readConfig, q→logTag, K→rules,
//          EL→expandPath, zk→isGlobPattern, OD6→globToRegex, Hv→quoteString
```

### File Write Rules: `generateFileWriteRules` (bb3)

**Location:** `chunks.55.mjs:2729-2753`

```javascript
// ============================================
// generateFileWriteRules - Generate file write permission rules
// Location: chunks.55.mjs:2729-2753
// ============================================

// ORIGINAL (for source lookup):
function bb3(A, q, K = !1) {
    if (!A) return ["(allow file-write*)"];
    let Y = [],
        z = ub3();
    for (let w of z) {
        let O = EL(w);
        Y.push("(allow file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    for (let w of A.allowOnly || []) {
        let O = EL(w);
        if (zk(O)) {
            let $ = OD6(O);
            Y.push("(allow file-write*", `  (regex ${Hv($)})`, `  (with message "${q}"))`)
        } else Y.push("(allow file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    let _ = [...A.denyWithinAllow || [], ...Sb3(K)];
    for (let w of _) {
        let O = EL(w);
        if (zk(O)) {
            let $ = OD6(O);
            Y.push("(deny file-write*", `  (regex ${Hv($)})`, `  (with message "${q}"))`)
        } else Y.push("(deny file-write*", `  (subpath ${Hv(O)})`, `  (with message "${q}"))`)
    }
    return Y.push(...pZ7(_, q)), Y
}

// READABLE (for understanding):
function generateFileWriteRules(writeConfig, logTag, allowGitConfig = false) {
    // No config = allow all writes
    if (!writeConfig) return ["(allow file-write*)"];

    let rules = [];

    // Allow writing to temp directories (needed for most operations)
    let tempDirs = getTempDirPaths();
    for (let tempDir of tempDirs) {
        let expandedPath = expandPath(tempDir);
        rules.push("(allow file-write*");
        rules.push(`  (subpath ${quoteString(expandedPath)})`);
        rules.push(`  (with message "${logTag}"))`);
    }

    // Allow specific directories from config
    for (let allowPath of writeConfig.allowOnly || []) {
        let expandedPath = expandPath(allowPath);
        if (isGlobPattern(expandedPath)) {
            let regex = globToRegex(expandedPath);
            rules.push("(allow file-write*");
            rules.push(`  (regex ${quoteString(regex)})`);
            rules.push(`  (with message "${logTag}"))`);
        } else {
            rules.push("(allow file-write*");
            rules.push(`  (subpath ${quoteString(expandedPath)})`);
            rules.push(`  (with message "${logTag}"))`);
        }
    }

    // Deny specific paths within allowed directories
    let denyPaths = [...writeConfig.denyWithinAllow || [], ...getGitConfigDenies(allowGitConfig)];
    for (let denyPath of denyPaths) {
        let expandedPath = expandPath(denyPath);
        if (isGlobPattern(expandedPath)) {
            let regex = globToRegex(expandedPath);
            rules.push("(deny file-write*");
            rules.push(`  (regex ${quoteString(regex)})`);
            rules.push(`  (with message "${logTag}"))`);
        } else {
            rules.push("(deny file-write*");
            rules.push(`  (subpath ${quoteString(expandedPath)})`);
            rules.push(`  (with message "${logTag}"))`);
        }
    }

    // Add home directory protection rules
    rules.push(...generateHomeDirProtection(denyPaths, logTag));

    return rules;
}

// Mapping: bb3→generateFileWriteRules, A→writeConfig, q→logTag, K→allowGitConfig,
//          Y→rules, z→tempDirs, ub3→getTempDirPaths, Sb3→getGitConfigDenies
```

---

## Temp Directory Resolution: `getTempDirPaths` (ub3)

**Location:** `chunks.55.mjs:2793-2801`

```javascript
// ============================================
// getTempDirPaths - Resolve macOS temp directory paths
// Location: chunks.55.mjs:2793-2801
// ============================================

// ORIGINAL (for source lookup):
function ub3() {
    let A = process.env.TMPDIR;
    if (!A) return [];
    if (!A.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
    let K = A.replace(/\/T\/?$/, "");
    if (K.startsWith("/private/var/")) return [K, K.replace("/private", "")];
    else if (K.startsWith("/var/")) return [K, "/private" + K];
    return [K]
}

// READABLE (for understanding):
function getTempDirPaths() {
    let tmpdir = process.env.TMPDIR;
    if (!tmpdir) return [];

    // Validate TMPDIR format (macOS convention: /var/folders/XX/username/T/)
    const MACOS_TMPDIR_PATTERN = /^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/;
    if (!tmpdir.match(MACOS_TMPDIR_PATTERN)) return [];

    // Extract the parent directory (without /T suffix)
    let baseDir = tmpdir.replace(/\/T\/?$/, "");

    // Return both /private/var and /var paths (they're equivalent on macOS)
    if (baseDir.startsWith("/private/var/")) {
        return [baseDir, baseDir.replace("/private", "")];
    } else if (baseDir.startsWith("/var/")) {
        return [baseDir, "/private" + baseDir];
    }
    return [baseDir];
}

// Mapping: ub3→getTempDirPaths, A→tmpdir, K→baseDir
```

**Why both paths:** On macOS, `/var` is a symlink to `/private/var`. Some programs resolve symlinks before checking permissions, so both paths must be allowed.

---

## Violation Monitoring

### Log Tag Generation

```javascript
// Location: chunks.55.mjs:2899
FZ7 = `_${Math.random().toString(36).slice(2,11)}_SBX`

// Generates unique tag like "_k7x9m2pq_SBX" for correlation
```

### Log Monitor: `startLogMonitor` (UZ7)

**Location:** `chunks.55.mjs:2843-2889`

```javascript
// ============================================
// startLogMonitor - Monitor sandbox violations via macOS log stream
// Location: chunks.55.mjs:2843-2889
// ============================================

// ORIGINAL (for source lookup):
function UZ7(A, q) {
    let K = /CMD64_(.+?)_END/,
        Y = /Sandbox:\s+(.+)$/,
        z = q?.["*"] || [],
        _ = q ? Object.entries(q).filter(([O]) => O !== "*") : [],
        w = hb3("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${FZ7}")`, "--style", "compact"]);
    return w.stdout?.on("data", (O) => {
        let $ = O.toString().split(`
`),
            H = $.find((P) => P.includes("Sandbox:") && P.includes("deny")),
            j = $.find((P) => P.startsWith("CMD64_"));
        if (!H) return;
        let J = H.match(Y);
        if (!J?.[1]) return;
        let M = J[1],
            D, X;
        if (j) {
            if (X = j.match(K)?.[1], X) try {
                D = EZ7(X)  // Decode base64 command
            } catch {}
        }
        // Filter known benign violations
        if (M.includes("mDNSResponder") || M.includes("mach-lookup com.apple.diagnosticd") || M.includes("mach-lookup com.apple.analyticsd")) return;
        // Apply command-specific filters
        // ... (filtering logic)
        A({ line: M, command: D, encodedCommand: X, timestamp: new Date })
    }), ...  // Error handlers
}

// READABLE (for understanding):
function startLogMonitor(onViolation, filterConfig) {
    const CMD_PATTERN = /CMD64_(.+?)_END/;
    const SANDBOX_PATTERN = /Sandbox:\s+(.+)$/;

    // Filter config: { "*": ["global_filter"], "command_pattern": ["specific_filter"] }
    let globalFilters = filterConfig?.["*"] || [];
    let commandFilters = filterConfig ?
        Object.entries(filterConfig).filter(([key]) => key !== "*") : [];

    // Start log stream filtering for our unique tag
    let logProcess = spawnProcess("log", [
        "stream",
        "--predicate", `(eventMessage ENDSWITH "${SANDBOX_LOG_TAG}")`,
        "--style", "compact"
    ]);

    logProcess.stdout?.on("data", (data) => {
        let lines = data.toString().split("\n");

        // Find violation line
        let violationLine = lines.find(l => l.includes("Sandbox:") && l.includes("deny"));
        let commandLine = lines.find(l => l.startsWith("CMD64_"));

        if (!violationLine) return;

        let match = violationLine.match(SANDBOX_PATTERN);
        if (!match?.[1]) return;

        let violationMessage = match[1];
        let decodedCommand, encodedCommand;

        // Decode command if present
        if (commandLine) {
            encodedCommand = commandLine.match(CMD_PATTERN)?.[1];
            if (encodedCommand) {
                try {
                    decodedCommand = decodeBase64(encodedCommand);
                } catch {}
            }
        }

        // Filter known benign violations
        if (violationMessage.includes("mDNSResponder")) return;  // mDNS is always chatty
        if (violationMessage.includes("mach-lookup com.apple.diagnosticd")) return;  // Telemetry
        if (violationMessage.includes("mach-lookup com.apple.analyticsd")) return;  // Analytics

        // Apply command-specific filters
        // ... (filtering logic omitted for brevity)

        // Report violation
        onViolation({
            line: violationMessage,
            command: decodedCommand,
            encodedCommand: encodedCommand,
            timestamp: new Date()
        });
    });

    // Return cleanup function
    return () => {
        logProcess.kill("SIGTERM");
    };
}

// Mapping: UZ7→startLogMonitor, A→onViolation, q→filterConfig, FZ7→SANDBOX_LOG_TAG,
//          hb3→spawnProcess, EZ7→decodeBase64
```

**Why filter mDNSResponder and diagnosticd:** These services are accessed by the OS for background tasks (DNS resolution, telemetry). The sandbox blocks them, but they're not security-relevant violations. Filtering them reduces noise.

---

## SandboxViolationStore: `HD6`

**Location:** `chunks.55.mjs:2902-2936`

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
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
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
        this.violations = [];      // Ring buffer
        this.totalCount = 0;       // Total count (doesn't reset on trim)
        this.maxSize = 100;        // Maximum buffer size
        this.listeners = new Set(); // Change subscribers
    }

    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Trim to max size (ring buffer behavior)
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    getViolations(count) {
        if (count === undefined) return [...this.violations];
        return this.violations.slice(-count);  // Most recent N
    }

    getCount() {
        return this.violations.length;  // Current buffer size
    }

    getTotalCount() {
        return this.totalCount;  // Total since session start
    }

    getViolationsForCommand(command) {
        let encoded = encodeCommand(command);
        return this.violations.filter(v => v.encodedCommand === encoded);
    }

    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Initial call with current state
        return () => {
            this.listeners.delete(callback);  // Unsubscribe function
        };
    }

    notifyListeners() {
        let currentViolations = this.getViolations();
        this.listeners.forEach(callback => callback(currentViolations));
    }
}

// Mapping: HD6→SandboxViolationStore, T21→encodeCommand
```

**Why ring buffer:** Violations can be numerous. A fixed-size buffer prevents memory growth while keeping the most recent violations for debugging.

---

## Design Rationale

### Why Chrome Sandbox Policy as Base

The profile comment says "Essential permissions - based on Chrome sandbox policy." Chrome's sandbox is battle-tested and provides a good baseline for process isolation. Claude Code extends it with:
- Additional Mach services (logd, securityd for keychain)
- Specific sysctl permissions for runtime introspection
- PTY support for terminal operations

### Why `deny default` Instead of `allow default`

```
(deny default (with message "${logTag}"))
```

This makes the sandbox fail-safe: anything not explicitly allowed is denied. The `with message` clause includes the unique log tag, making violations traceable to specific commands.

### Why Both `subpath` and `regex` for Paths

- `subpath` is efficient for directory trees (e.g., `/Users/alice/project`)
- `regex` is needed for glob patterns (e.g., `~/.ssh/*`)

The generator chooses the appropriate rule type based on whether the path contains glob characters.

---

## Deep Algorithm Analysis: Profile Generation

### Algorithm Overview

The `generateSeatbeltProfile` (xb3) function constructs a complete SBPL profile through a multi-phase process:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Profile Generation Algorithm                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: Header & Default Deny                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ "(version 1)"                              ; SBPL version            │    │
│  │ (deny default (with message "${logTag}"))  ; Fail-safe default      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 2: Essential Permissions (Chrome Sandbox Base)                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Process permissions (exec, fork, signal, info)                       │    │
│  │ Mach IPC whitelist (20+ specific services)                           │    │
│  │ sysctl read whitelist (40+ specific entries + prefixes)              │    │
│  │ sysctl write (kern.tcsm_enable for V8 threading)                     │    │
│  │ IOKit permissions (IOSurface, RootDomain)                            │    │
│  │ Device file permissions (/dev/null, /dev/random, etc.)               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 3: Network Rules (Conditional)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ if (!needsNetworkRestriction) → (allow network*)                     │    │
│  │ else:                                                                │    │
│  │   if (allowLocalBinding) → (allow network-bind/inbound/outbound)    │    │
│  │   if (allowAllUnixSockets) → (allow system-socket AF_UNIX)          │    │
│  │   else if (allowUnixSockets) → (allow specific Unix socket paths)   │    │
│  │   if (httpProxyPort) → (allow localhost:${httpProxyPort})           │    │
│  │   if (socksProxyPort) → (allow localhost:${socksProxyPort})         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 4: File Read Rules                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ (allow file-read*)                        ; Default allow all reads  │    │
│  │ for each path in readConfig.denyOnly:                               │    │
│  │   if (isGlobPattern) → (deny file-read* (regex ...))               │    │
│  │   else → (deny file-read* (subpath ...))                            │    │
│  │ Add home directory protection rules                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 5: File Write Rules                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ if (!writeConfig) → (allow file-write*)   ; No restrictions         │    │
│  │ else:                                                                │    │
│  │   for each tempDir → (allow file-write* (subpath tempDir))          │    │
│  │   for each allowPath → (allow file-write* (subpath/regex ...))      │    │
│  │   for each denyPath → (deny file-write* (subpath/regex ...))        │    │
│  │   Add home directory protection rules                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Phase 6: PTY Rules (if allowPty)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ (allow pseudo-tty)                                                   │    │
│  │ (allow file-ioctl (literal "/dev/ptmx") (regex "^/dev/ttys"))       │    │
│  │ (allow file-read* file-write* (literal "/dev/ptmx"))                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Analysis

**Location:** `chunks.55.mjs:2755-2786`

```javascript
// ============================================
// generateSeatbeltProfile - Complete SBPL profile generator
// Location: chunks.55.mjs:2755-2786
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
    let M = ["(version 1)", `(deny default (with message "${J}"))`, "", `; LogTag: ${J}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", ...j ? ["; trustd.agent - needed for Go TLS certificate verification (weaker network isolation)", '(allow mach-lookup (global-name "com.apple.trustd.agent"))'] : [], "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', /* ... 40+ more sysctls ... */ ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
    if (M.push("; Network"), !z) M.push("(allow network*)");
    else {
        if (O) M.push('(allow network-bind (local ip "*:*"))'), M.push('(allow network-inbound (local ip "*:*"))'), M.push('(allow network-outbound (local ip "*:*"))');
        if (w) M.push("(allow system-socket (socket-domain AF_UNIX))"), M.push('(allow network-bind (local unix-socket (path-regex #"^/")))'), M.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        else if (_ && _.length > 0) {
            M.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let D of _) {
                let X = EL(D);
                M.push(`(allow network-bind (local unix-socket (subpath ${Hv(X)})))`), M.push(`(allow network-outbound (remote unix-socket (subpath ${Hv(X)})))`)
            }
        }
        if (K !== void 0) M.push(`(allow network-bind (local ip "localhost:${K}"))`), M.push(`(allow network-inbound (local ip "localhost:${K}"))`), M.push(`(allow network-outbound (remote ip "localhost:${K}"))`);
        if (Y !== void 0) M.push(`(allow network-bind (local ip "localhost:${Y}"))`), M.push(`(allow network-inbound (local ip "localhost:${Y}"))`), M.push(`(allow network-outbound (remote ip "localhost:${Y}"))`)
    }
    if (M.push(""), M.push("; File read"), M.push(...Ib3(A, J)), M.push(""), M.push("; File write"), M.push(...bb3(q, J, H)), $) M.push(""), M.push("; Pseudo-terminal (pty) support"), M.push("(allow pseudo-tty)"), M.push("(allow file-ioctl"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")"), M.push("(allow file-read* file-write*"), M.push('  (literal "/dev/ptmx")'), M.push('  (regex #"^/dev/ttys")'), M.push(")");
    return M.join(`
`)
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
    // =====================================================
    // PHASE 1: Header & Default Deny
    // =====================================================
    let profile = [
        "(version 1)",                              // SBPL version 1
        `(deny default (with message "${logTag}"))`, // Fail-safe: deny everything not allowed
        "",
        `; LogTag: ${logTag}`,                      // For log correlation
        "",
    ];

    // =====================================================
    // PHASE 2: Essential Permissions (Chrome Sandbox Base)
    // =====================================================

    // 2a. Process permissions
    profile.push("; Essential permissions - based on Chrome sandbox policy");
    profile.push("; Process permissions");
    profile.push("(allow process-exec)");           // Allow executing binaries
    profile.push("(allow process-fork)");           // Allow spawning children
    profile.push("(allow process-info* (target same-sandbox))");  // Query own processes
    profile.push("(allow signal (target same-sandbox))");         // Signal own processes
    profile.push("(allow mach-priv-task-port (target same-sandbox))"); // For debugging
    profile.push("");
    profile.push("; User preferences");
    profile.push("(allow user-preference-read)");   // Read user preferences
    profile.push("");

    // 2b. Mach IPC whitelist (no wildcard - each service explicitly allowed)
    profile.push("; Mach IPC - specific services only (no wildcard)");
    profile.push("(allow mach-lookup");
    profile.push('  (global-name "com.apple.audio.systemsoundserver")');      // System sounds
    profile.push('  (global-name "com.apple.distributed_notifications@Uv3")'); // Notifications
    profile.push('  (global-name "com.apple.FontObjectsServer")');            // Font rendering
    profile.push('  (global-name "com.apple.fonts")');                       // Font access
    profile.push('  (global-name "com.apple.logd")');                        // Logging daemon
    profile.push('  (global-name "com.apple.lsd.mapdb")');                   // Launch Services DB
    profile.push('  (global-name "com.apple.PowerManagement.control")');     // Power management
    profile.push('  (global-name "com.apple.system.logger")');               // System logger
    profile.push('  (global-name "com.apple.system.notification_center")');  // Notification center
    profile.push('  (global-name "com.apple.system.opendirectoryd.libinfo")'); // User/group lookup
    profile.push('  (global-name "com.apple.system.opendirectoryd.membership")');
    profile.push('  (global-name "com.apple.bsd.dirhelper")');               // Directory helper
    profile.push('  (global-name "com.apple.securityd.xpc")');               // Keychain access
    profile.push('  (global-name "com.apple.coreservices.launchservicesd")'); // App launching
    profile.push(")");
    profile.push("");

    // 2c. Optional: trustd.agent for Go TLS (weaker network isolation)
    if (enableWeakerNetworkIsolation) {
        profile.push("; trustd.agent - needed for Go TLS certificate verification");
        profile.push('(allow mach-lookup (global-name "com.apple.trustd.agent"))');
    }
    profile.push("");

    // 2d. POSIX IPC
    profile.push("; POSIX IPC - shared memory");
    profile.push("(allow ipc-posix-shm)");          // Shared memory
    profile.push("");
    profile.push("; POSIX IPC - semaphores for Python multiprocessing");
    profile.push("(allow ipc-posix-sem)");         // Semaphores (Python multiprocessing)
    profile.push("");

    // 2e. IOKit permissions
    profile.push("; IOKit - specific operations only");
    profile.push("(allow iokit-open");
    profile.push('  (iokit-registry-entry-class "IOSurfaceRootUserClient")');  // GPU surfaces
    profile.push('  (iokit-registry-entry-class "RootDomainUserClient")');     // Power management
    profile.push('  (iokit-user-client-class "IOSurfaceSendRight")');          // Surface sharing
    profile.push(")");
    profile.push("");
    profile.push("; IOKit properties");
    profile.push("(allow iokit-get-properties)");
    profile.push("");

    // 2f. System sockets (safe, doesn't allow network access)
    profile.push("; Specific safe system-sockets, doesn't allow network access");
    profile.push("(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))");
    profile.push("");

    // 2g. sysctl whitelist (40+ entries)
    profile.push("; sysctl - specific sysctls only");
    profile.push("(allow sysctl-read");
    profile.push('  (sysctl-name "hw.activecpu")');
    profile.push('  (sysctl-name "hw.busfrequency_compat")');
    // ... (omitted for brevity - see full list in source)
    profile.push('  (sysctl-name-prefix "machdep.cpu.")');
    profile.push('  (sysctl-name-prefix "net.routetable.")');
    profile.push(")");
    profile.push("");

    // 2h. sysctl write (V8 threading)
    profile.push("; V8 thread calculations");
    profile.push("(allow sysctl-write");
    profile.push('  (sysctl-name "kern.tcsm_enable")');  // Thread confinement on Apple Silicon
    profile.push(")");
    profile.push("");

    // 2i. Additional permissions
    profile.push("; Distributed notifications");
    profile.push("(allow distributed-notification-post)");
    profile.push("");
    profile.push("; Specific mach-lookup permissions for security operations");
    profile.push('(allow mach-lookup (global-name "com.apple.SecurityServer"))');
    profile.push("");

    // 2j. Device file permissions
    profile.push("; File I/O on device files");
    profile.push('(allow file-ioctl (literal "/dev/null"))');
    profile.push('(allow file-ioctl (literal "/dev/zero"))');
    profile.push('(allow file-ioctl (literal "/dev/random"))');
    profile.push('(allow file-ioctl (literal "/dev/urandom"))');
    profile.push('(allow file-ioctl (literal "/dev/dtracehelper"))');
    profile.push('(allow file-ioctl (literal "/dev/tty"))');
    profile.push("");
    profile.push("(allow file-ioctl file-read-data file-write-data");
    profile.push("  (require-all");
    profile.push('    (literal "/dev/null")');
    profile.push("    (vnode-type CHARACTER-DEVICE)");
    profile.push("  )");
    profile.push(")");
    profile.push("");

    // =====================================================
    // PHASE 3: Network Rules (Conditional)
    // =====================================================
    profile.push("; Network");

    if (!needsNetworkRestriction) {
        // No network restrictions - allow all
        profile.push("(allow network*)");
    } else {
        // Network restricted - allow only specific operations

        // 3a. Local binding (for servers)
        if (allowLocalBinding) {
            profile.push('(allow network-bind (local ip "*:*"))');
            profile.push('(allow network-inbound (local ip "*:*"))');
            profile.push('(allow network-outbound (local ip "*:*"))');
        }

        // 3b. Unix socket permissions
        if (allowAllUnixSockets) {
            // Allow all Unix sockets (less secure)
            profile.push("(allow system-socket (socket-domain AF_UNIX))");
            profile.push('(allow network-bind (local unix-socket (path-regex #"^/")))');
            profile.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        } else if (allowUnixSockets && allowUnixSockets.length > 0) {
            // Allow specific Unix socket paths
            profile.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let socketPath of allowUnixSockets) {
                let expandedPath = expandPath(socketPath);
                profile.push(`(allow network-bind (local unix-socket (subpath ${quoteString(expandedPath)})))`);
                profile.push(`(allow network-outbound (remote unix-socket (subpath ${quoteString(expandedPath)})))`);
            }
        }

        // 3c. Proxy ports (for network interception)
        if (httpProxyPort !== undefined) {
            profile.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
            profile.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
            profile.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
        }
        if (socksProxyPort !== undefined) {
            profile.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
            profile.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
            profile.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
        }
    }

    // =====================================================
    // PHASE 4: File Read Rules
    // =====================================================
    profile.push("");
    profile.push("; File read");
    profile.push(...generateFileReadRules(readConfig, logTag));

    // =====================================================
    // PHASE 5: File Write Rules
    // =====================================================
    profile.push("");
    profile.push("; File write");
    profile.push(...generateFileWriteRules(writeConfig, logTag, allowGitConfig));

    // =====================================================
    // PHASE 6: PTY Rules (if requested)
    // =====================================================
    if (allowPty) {
        profile.push("");
        profile.push("; Pseudo-terminal (pty) support");
        profile.push("(allow pseudo-tty)");
        profile.push("(allow file-ioctl");
        profile.push('  (literal "/dev/ptmx")');
        profile.push('  (regex #"^/dev/ttys")');
        profile.push(")");
        profile.push("(allow file-read* file-write*");
        profile.push('  (literal "/dev/ptmx")');
        profile.push('  (regex #"^/dev/ttys")');
        profile.push(")");
    }

    // Join all lines with newlines
    return profile.join("\n");
}

// Mapping: xb3→generateSeatbeltProfile, A→readConfig, q→writeConfig, K→httpProxyPort,
//          Y→socksProxyPort, z→needsNetworkRestriction, _→allowUnixSockets,
//          w→allowAllUnixSockets, O→allowLocalBinding, $→allowPty, H→allowGitConfig,
//          j→enableWeakerNetworkIsolation, J→logTag, M→profile, EL→expandPath, Hv→quoteString
```

### Key Design Decisions

**1. Why Chrome Sandbox Policy as Base?**

The Chrome browser sandbox is one of the most battle-tested sandboxes in production. It provides a well-audited baseline for:
- Process isolation (exec, fork, signal handling)
- Mach IPC service whitelist (no wildcard to prevent privilege escalation)
- sysctl read whitelist (prevents information disclosure)
- IOKit device access (GPU surfaces, power management)

Claude Code extends this baseline with:
- Additional Mach services (logd, securityd for keychain access)
- PTY support for interactive terminal operations
- Network proxy ports for filtered internet access

**2. Why Deny-by-Default with Explicit Allows?**

```
(deny default (with message "${logTag}"))
```

This fail-safe approach ensures:
- Any new system service or resource is automatically blocked
- Violations include the log tag for correlation to specific commands
- Security regressions (new OS features) are handled safely

**3. Why No Wildcard Mach Lookup?**

A blanket `(allow mach-lookup)` would allow communication with any system service, including:
- `com.apple.SecurityServer` - Could access keychain items
- `com.apple.launchd` - Could spawn privileged processes
- `com.apple.CoreAuthentication` - Could trigger authentication prompts

Each service is explicitly whitelisted after security review.

**4. Why Specific sysctl Entries?**

Many sysctls expose sensitive information:
- `kern.hostname` - System identifier
- `hw.serialnumber` - Hardware serial number
- `kern.osversion` - OS version (fingerprinting)

Only sysctls needed for runtime operations are allowed.

**5. Network Rule Ordering?**

The network rules follow a specific precedence:
1. `allowLocalBinding` - Allows binding to any localhost port
2. `allowAllUnixSockets` - Allows all Unix domain sockets (less secure)
3. `allowUnixSockets` (array) - Allows specific Unix socket paths (more secure)
4. Proxy ports - Always allowed if network restriction is enabled

The more permissive options (`allowAllUnixSockets`) take precedence over the restrictive ones for usability reasons.

### Example Generated Profile

For a command with:
- Network restriction enabled
- HTTP proxy on port 3128
- Write access to `/Users/alice/project`
- Deny write to `.env` files

```scheme
(version 1)
(deny default (with message "CMD64_abc123_END_x7k2m_SBX"))

; LogTag: CMD64_abc123_END_x7k2m_SBX

; Essential permissions - based on Chrome sandbox policy
; Process permissions
(allow process-exec)
(allow process-fork)
(allow process-info* (target same-sandbox))
(allow signal (target same-sandbox))
(allow mach-priv-task-port (target same-sandbox))

; User preferences
(allow user-preference-read)

; Mach IPC - specific services only (no wildcard)
(allow mach-lookup
  (global-name "com.apple.audio.systemsoundserver")
  ; ... more services ...
)

; Network
(allow network-bind (local ip "localhost:3128"))
(allow network-inbound (local ip "localhost:3128"))
(allow network-outbound (remote ip "localhost:3128"))

; File read
(allow file-read*)

; File write
(allow file-write*
  (subpath "/var/folders/xx/abcdef/T"))
(allow file-write*
  (subpath "/Users/alice/project"))
(deny file-write*
  (regex #"\.env(\.local)?$"))

; Pseudo-terminal (pty) support
(allow pseudo-tty)
(allow file-ioctl
  (literal "/dev/ptmx")
  (regex #"^/dev/ttys"))
(allow file-read* file-write*
  (literal "/dev/ptmx"))
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [network_proxy.md](./network_proxy.md) - HTTP/SOCKS proxy for network filtering
- [violation_system.md](./violation_system.md) - Violation correlation and reporting