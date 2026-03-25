# Seccomp BPF Filter (Claude Code 2.1.76)

## Overview

On Linux, Claude Code uses seccomp-BPF (Secure Computing Mode with Berkeley Packet Filter) to block Unix socket creation within sandboxed processes. This provides an additional layer of isolation when `allowAllUnixSockets` is false. The seccomp filter is applied via a helper binary (`apply-seccomp`) that injects the BPF program into the process before executing the actual command.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key symbols in this document:
- `Nw8` - getSeccompArch function (maps process.arch to seccomp architecture)
- `Vw8` - getBpfFilterPath function (finds pre-generated BPF filter file)
- `Ex6` - getApplySeccompPath function (finds apply-seccomp binary)
- `RZ7` - validateSeccompAvailability function (checks if seccomp is available)
- `Tb3` - findBpfFilterFile function (searches for BPF file)
- `vb3` - findApplySeccompBinary function (searches for apply-seccomp binary)
- `yw8` - createdSeccompFilters set (tracks created filter files for cleanup)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Seccomp Filter Application                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Build Time (Pre-generated BPF)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ vendor/seccomp/                                                      │   │
│  │   ├── x64/                                                           │   │
│  │   │   ├── unix-block.bpf      ← BPF bytecode (x86-64)               │   │
│  │   │   └── apply-seccomp       ← Helper binary (x86-64)              │   │
│  │   └── arm64/                                                         │   │
│  │       ├── unix-block.bpf      ← BPF bytecode (ARM64)                │   │
│  │       └── apply-seccomp       ← Helper binary (ARM64)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Runtime Application                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Find BPF filter file (unix-block.bpf)                            │   │
│  │ 2. Find apply-seccomp binary                                        │   │
│  │ 3. Wrap command: apply-seccomp <filter.bpf> bash -c <command>        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ apply-seccomp process                                                │   │
│  │   1. Load BPF program into kernel                                    │   │
│  │   2. prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, prog)               │   │
│  │   3. execve("/bin/bash", ["-c", command])                           │   │
│  │   4. BPF filter blocks socket(AF_UNIX, ...) syscall                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Detection: `getSeccompArch` (Nw8)

**Location:** `chunks.55.mjs:2175-2193`

```javascript
// ============================================
// getSeccompArch - Map Node.js architecture to seccomp directory name
// Location: chunks.55.mjs:2175-2193
// ============================================

// ORIGINAL (for source lookup):
function Nw8() {
    let A = process.arch;
    switch (A) {
        case "x64":
            return "x64";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "ia32":
        case "x86":
            return wA("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
                level: "error"
            }), null;
        default:
            return wA(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
    }
}

// READABLE (for understanding):
function getSeccompArch() {
    let arch = process.arch;

    switch (arch) {
        case "x64":
            return "x64";

        case "arm64":
        case "aarch64":
            return "arm64";

        case "ia32":
        case "x86":
            // 32-bit x86 is NOT supported due to socketcall() bypass
            log("[SeccompFilter] 32-bit x86 (ia32) is not currently supported " +
                "due to missing socketcall() syscall blocking. The current " +
                "seccomp filter only blocks socket(AF_UNIX, ...), but on " +
                "32-bit x86, socketcall() can be used to bypass this.",
                { level: "error" });
            return null;

        default:
            log(`[SeccompFilter] Unsupported architecture: ${arch}. ` +
                "Only x64 and arm64 are supported.");
            return null;
    }
}

// Mapping: Nw8→getSeccompArch, A→arch, wA→log
```

### Why 32-bit x86 is Not Supported

On 32-bit x86 Linux, socket operations use the `socketcall()` syscall instead of individual `socket()`, `bind()`, `connect()`, etc. syscalls:

```c
// 64-bit x86:
socket(AF_UNIX, SOCK_STREAM, 0);  // syscall __NR_socket

// 32-bit x86:
socketcall(SYS_SOCKET, args);     // syscall __NR_socketcall
```

The BPF filter blocks `socket(AF_UNIX, ...)`, but `socketcall()` can still create Unix sockets, bypassing the filter. Supporting 32-bit would require:
1. Blocking `socketcall()` entirely (breaks all socket operations)
2. Complex BPF logic to parse `socketcall()` arguments

**Decision:** Only support x64 and arm64, where socket syscalls are separate.

---

## BPF Filter Discovery: `findBpfFilterFile` (Tb3)

**Location:** `chunks.55.mjs:2210-2225`

```javascript
// ============================================
// findBpfFilterFile - Find pre-generated BPF filter file
// Location: chunks.55.mjs:2210-2225
// ============================================

// ORIGINAL (for source lookup):
function Tb3(A) {
    if (A) {
        if (Bq6.existsSync(A)) return wA(`[SeccompFilter] Using BPF filter from explicit path: ${A}`), A;
        wA(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = Nw8();
    if (!q) return wA(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`), null;
    wA(`[SeccompFilter] Detected architecture: ${q}`);
    for (let K of LZ7("unix-block.bpf"))
        if (Bq6.existsSync(K)) return wA(`[SeccompFilter] Found pre-generated BPF filter: ${K} (${q})`), K;
    for (let K of yZ7()) {
        let Y = yL(K, "vendor", "seccomp", q, "unix-block.bpf");
        if (Bq6.existsSync(Y)) return wA(`[SeccompFilter] Found pre-generated BPF filter in global install: ${Y} (${q})`), Y
    }
    return wA(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${q})`), null
}

// READABLE (for understanding):
function findBpfFilterFile(explicitPath) {
    // Use explicit path if provided and exists
    if (explicitPath) {
        if (fs.existsSync(explicitPath)) {
            log(`[SeccompFilter] Using BPF filter from explicit path: ${explicitPath}`);
            return explicitPath;
        }
        log(`[SeccompFilter] Explicit path provided but file not found: ${explicitPath}`);
    }

    // Determine architecture
    let arch = getSeccompArch();
    if (!arch) {
        log(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`);
        return null;
    }

    log(`[SeccompFilter] Detected architecture: ${arch}`);

    // Search locations (in order):
    // 1. Package vendor directory
    for (let searchPath of getSearchPaths("unix-block.bpf")) {
        if (fs.existsSync(searchPath)) {
            log(`[SeccompFilter] Found pre-generated BPF filter: ${searchPath} (${arch})`);
            return searchPath;
        }
    }

    // 2. Global install directories
    for (let globalPath of getGlobalInstallPaths()) {
        let filterPath = path.join(globalPath, "vendor", "seccomp", arch, "unix-block.bpf");
        if (fs.existsSync(filterPath)) {
            log(`[SeccompFilter] Found pre-generated BPF filter in global install: ${filterPath} (${arch})`);
            return filterPath;
        }
    }

    log(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${arch})`);
    return null;
}

// Mapping: Tb3→findBpfFilterFile, A→explicitPath, Bq6→fs, Nw8→getSeccompArch,
//          LZ7→getSearchPaths, yZ7→getGlobalInstallPaths, yL→path.join
```

---

## apply-seccomp Binary Discovery: `findApplySeccompBinary` (vb3)

**Location:** `chunks.55.mjs:2234-2249`

```javascript
// ============================================
// findApplySeccompBinary - Find apply-seccomp helper binary
// Location: chunks.55.mjs:2234-2249
// ============================================

// ORIGINAL (for source lookup):
function vb3(A) {
    if (A) {
        if (Bq6.existsSync(A)) return wA(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${A}`), A;
        wA(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = Nw8();
    if (!q) return wA(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
    wA(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${q}`);
    for (let K of LZ7("apply-seccomp"))
        if (Bq6.existsSync(K)) return wA(`[SeccompFilter] Found apply-seccomp binary: ${K} (${q})`), K;
    for (let K of yZ7()) {
        let Y = yL(K, "vendor", "seccomp", q, "apply-seccomp");
        if (Bq6.existsSync(Y)) return wA(`[SeccompFilter] Found apply-seccomp binary in global install: ${Y} (${q})`), Y
    }
    return wA(`[SeccompFilter] apply-seccomp binary not found in any expected location (${q})`), null
}

// READABLE (for understanding):
function findApplySeccompBinary(explicitPath) {
    // Use explicit path if provided and exists
    if (explicitPath) {
        if (fs.existsSync(explicitPath)) {
            log(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${explicitPath}`);
            return explicitPath;
        }
        log(`[SeccompFilter] Explicit path provided but file not found: ${explicitPath}`);
    }

    // Determine architecture
    let arch = getSeccompArch();
    if (!arch) {
        log(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`);
        return null;
    }

    log(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${arch}`);

    // Search package vendor directory
    for (let searchPath of getSearchPaths("apply-seccomp")) {
        if (fs.existsSync(searchPath)) {
            log(`[SeccompFilter] Found apply-seccomp binary: ${searchPath} (${arch})`);
            return searchPath;
        }
    }

    // Search global install directories
    for (let globalPath of getGlobalInstallPaths()) {
        let binaryPath = path.join(globalPath, "vendor", "seccomp", arch, "apply-seccomp");
        if (fs.existsSync(binaryPath)) {
            log(`[SeccompFilter] Found apply-seccomp binary in global install: ${binaryPath} (${arch})`);
            return binaryPath;
        }
    }

    log(`[SeccompFilter] apply-seccomp binary not found in any expected location (${arch})`);
    return null;
}

// Mapping: vb3→findApplySeccompBinary, A→explicitPath
```

---

## Command Wrapping with Seccomp

When seccomp is enabled and a BPF filter is found, commands are wrapped:

```javascript
// In wrapWithBubblewrap (uZ7):
if (seccompFilterPath) {
    let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);
    let wrappedCommand = quote([
        applySeccompPath,
        seccompFilterPath,
        shellPath, "-c", command
    ]);
    bwrapArgs.push(wrappedCommand);
}

// Final command structure:
// bwrap [args] -- apply-seccomp /path/to/unix-block.bpf /bin/bash -c "actual command"
```

---

## BPF Filter Logic

The `unix-block.bpf` filter blocks the `socket` syscall when creating Unix domain sockets:

```
Pseudo-code for the BPF filter:

if (syscall == __NR_socket) {
    if (args[0] == AF_UNIX) {
        return SECCOMP_RET_ERRNO;  // Block with EAFNOSUPPORT error
    }
}
return SECCOMP_RET_ALLOW;  // Allow all other syscalls
```

**Error returned:** `EAFNOSUPPORT` (Address family not supported by protocol) - the same error as if the kernel didn't support Unix sockets.

---

## Configuration Schema

```javascript
// chunks.56.mjs:39-51
seccompConfig: z.object({
    bpfPath: z.string().optional()
        .describe("Path to a pre-generated BPF filter file. " +
            "If not provided, looks for vendor/seccomp/{x64,arm64}/unix-block.bpf"),

    applyPath: z.string().optional()
        .describe("Path to the apply-seccomp binary. " +
            "If not provided, looks for vendor/seccomp/{x64,arm64}/apply-seccomp")
}).optional().describe("Custom seccomp binary paths (Linux only).")
```

---

## Search Path Priority

The filter and binary are searched in this order:

1. **Explicit path** - If `seccompConfig.bpfPath` or `seccompConfig.applyPath` is set
2. **Package vendor directory** - `<package>/vendor/seccomp/{arch}/`
3. **Global npm install** - `<npm-global>/vendor/seccomp/{arch}/`

---

## Design Rationale

### Why Pre-generated BPF Instead of Runtime Generation

1. **Simplicity:** Runtime BPF generation requires libseccomp or custom BPF compiler
2. **Security:** Pre-generated filters can be audited once at build time
3. **Size:** No need to include BPF compiler in the package
4. **Portability:** Works in minimal containers without build tools

### Why apply-seccomp Helper Binary

The helper binary is needed because:
1. `prctl(PR_SET_SECCOMP, ...)` must be called before `execve()`
2. Node.js cannot call `prctl()` and then `execve()` atomically
3. The helper binary does: load BPF → `prctl(PR_SET_SECCOMP)` → `execve(command)`

### Why Not Use libseccomp

1. **Native dependency:** Requires compiling native code for each architecture
2. **Complexity:** Pre-generated filters are simpler and work the same way
3. **Distribution:** Binary files can be included in the npm package

---

## Seccomp Validation and Availability Check

### `validateSeccompAvailability` (RZ7)

**Location:** `chunks.55.mjs:2251-2257`

```javascript
// ============================================
// validateSeccompAvailability - Check if seccomp is available
// Location: chunks.55.mjs:2251-2257
// ============================================

// ORIGINAL (for source lookup):
function RZ7(A) {
    let q = Vw8(A);
    if (q) return wA("[SeccompFilter] Using pre-generated BPF filter"), q;
    return wA("[SeccompFilter] Pre-generated BPF filter not available for this architecture. Only x64 and arm64 are supported.", {
        level: "error"
    }), null
}

// READABLE (for understanding):
function validateSeccompAvailability(seccompConfig) {
    let bpfPath = getBpfFilterPath(seccompConfig?.bpfPath);
    if (bpfPath) {
        log("[SeccompFilter] Using pre-generated BPF filter");
        return bpfPath;
    }
    log("[SeccompFilter] Pre-generated BPF filter not available for this architecture. " +
        "Only x64 and arm64 are supported.", { level: "error" });
    return null;
}

// Mapping: RZ7→validateSeccompAvailability, A→seccompConfig, q→bpfPath, Vw8→getBpfFilterPath
```

---

## Dependency Check for Linux Sandbox

### `checkLinuxSandboxDependencies` (bZ7)

**Location:** `chunks.55.mjs:2387-2399`

```javascript
// ============================================
// checkLinuxSandboxDependencies - Validate Linux sandbox dependencies
// Location: chunks.55.mjs:2387-2399
// ============================================

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
function checkLinuxSandboxDependencies(seccompConfig) {
    let errors = [];
    let warnings = [];

    // Check for required binaries
    if (which("bwrap") === null) {
        errors.push("bubblewrap (bwrap) not installed");
    }
    if (which("socat") === null) {
        errors.push("socat not installed");
    }

    // Check for seccomp availability
    let hasBpfFilter = getBpfFilterPath(seccompConfig?.bpfPath) !== null;
    let hasApplySeccomp = getApplySeccompPath(seccompConfig?.applyPath) !== null;

    if (!hasBpfFilter || !hasApplySeccomp) {
        warnings.push("seccomp not available - unix socket access not restricted");
    }

    return {
        warnings: warnings,
        errors: errors
    };
}

// Mapping: bZ7→checkLinuxSandboxDependencies, A→seccompConfig, q→errors, K→warnings,
//          JU→which, Vw8→getBpfFilterPath, Ex6→getApplySeccompPath
```

**Key insight:** Seccomp is a **warning**, not an **error**. The sandbox can still operate without seccomp - it just won't block Unix sockets. This is a graceful degradation pattern.

---

## Seccomp Filter Cleanup

### Cleanup Tracking Set

**Location:** `chunks.55.mjs:2663-2666`

```javascript
// ORIGINAL (for source lookup):
yw8 = new Set, v21 = new Set

// READABLE (for understanding):
let createdSeccompFilters = new Set();  // Tracks seccomp filter files for cleanup
let createdEmptyDirs = new Set();        // Tracks empty directories for cleanup
```

### Cleanup Handler

**Location:** `chunks.55.mjs:2366-2384`

```javascript
// ============================================
// cleanupBwrapMountPoints - Clean up bwrap mount points on exit
// Location: chunks.55.mjs:2376-2384
// ============================================

// ORIGINAL (for source lookup):
function hw8() {
    for (let A of v21) try {
        let q = $2.statSync(A);
        if (q.isFile() && q.size === 0) $2.unlinkSync(A), wA(`[Sandbox Linux] Cleaned up bwrap mount point (file): ${A}`);
        else if (q.isDirectory()) {
            if ($2.readdirSync(A).length === 0) $2.rmdirSync(A), wA(`[Sandbox Linux] Cleaned up bwrap mount point (dir): ${A}`)
        }
    } catch {}
    v21.clear()
}

// READABLE (for understanding):
function cleanupBwrapMountPoints() {
    for (let path of createdEmptyDirs) {
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
    createdEmptyDirs.clear();
}

// Mapping: hw8→cleanupBwrapMountPoints, v21→createdEmptyDirs, $2→fs, wA→log
```

---

## Integration with wrapWithLinuxSandbox

The seccomp filter is applied within the `wrapWithLinuxSandbox` (uZ7) function:

```javascript
// ============================================
// Seccomp integration in wrapWithLinuxSandbox
// Location: chunks.55.mjs:2588-2599
// ============================================

// ORIGINAL (for source lookup):
if (!j) {
    v = RZ7(P?.bpfPath) ?? void 0;
    let u = Ex6(P?.applyPath);
    if (!v || !u) wA("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled. Install @anthropic-ai/sandbox-runtime globally for full protection.", {
        level: "warn"
    }), v = void 0;
    else {
        if (!v.includes("/vendor/seccomp/")) yw8.add(v), Lw8();
        wA("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking")
    }
} else wA("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");

// READABLE (for understanding):
if (!allowAllUnixSockets) {
    bpfFilterPath = validateSeccompAvailability(seccompConfig?.bpfPath) ?? undefined;
    let applyPath = getApplySeccompPath(seccompConfig?.applyPath);

    if (!bpfFilterPath || !applyPath) {
        log("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled. " +
            "Install @anthropic-ai/sandbox-runtime globally for full protection.",
            { level: "warn" });
        bpfFilterPath = undefined;
    } else {
        // Track non-vendor filter for cleanup
        if (!bpfFilterPath.includes("/vendor/seccomp/")) {
            createdSeccompFilters.add(bpfFilterPath);
            registerCleanupHandler();
        }
        log("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking");
    }
} else {
    log("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
}
```

### Key Decision Points

1. **Skip if `allowAllUnixSockets` is true** - No need to block Unix sockets if explicitly allowed
2. **Graceful degradation** - If seccomp unavailable, continue without Unix socket blocking
3. **Cleanup tracking** - Non-vendor filter files are tracked for cleanup on exit

---

## Error Handling in Command Wrapping

```javascript
// ============================================
// Seccomp error handling in wrapWithLinuxSandbox
// Location: chunks.55.mjs:2635-2647
// ============================================

// ORIGINAL (for source lookup):
} catch (N) {
    if (v && !v.includes("/vendor/seccomp/")) {
        yw8.delete(v);
        try {
            kw8(v)
        } catch (V) {
            wA(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${V}`, {
                level: "error"
            })
        }
    }
    throw N
}

// READABLE (for understanding):
} catch (error) {
    // Cleanup seccomp filter on error (only non-vendor files)
    if (bpfFilterPath && !bpfFilterPath.includes("/vendor/seccomp/")) {
        createdSeccompFilters.delete(bpfFilterPath);
        try {
            cleanupSeccompFilter(bpfFilterPath);
        } catch (cleanupError) {
            log(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${cleanupError}`,
                { level: "error" });
        }
    }
    throw error;
}
```

---

## BPF Filter Bytecode Structure

The pre-generated BPF filter follows this structure:

```
BPF Program Structure (unix-block.bpf):

struct sock_filter {
    u16 code;    // BPF instruction opcode
    u8  jt;      // Jump true
    u8  jf;      // Jump false
    u32 k;       // Generic multiuse field
};

Instructions (pseudo-code):

1. Load architecture:
   BPF_LD + BPF_W + BPF_ABS    → load syscall number

2. Check if socket syscall:
   BPF_JMP + BPF_JEQ + BPF_K   → if (syscall == __NR_socket) goto 3, else allow

3. Load first argument (domain):
   BPF_LD + BPF_W + BPF_ABS    → load args[0]

4. Check if AF_UNIX:
   BPF_JMP + BPF_JEQ + BPF_K   → if (domain == AF_UNIX) goto block, else allow

5. Block:
   BPF_RET + BPF_K             → return SECCOMP_RET_ERRNO (EAFNOSUPPORT)

6. Allow:
   BPF_RET + BPF_K             → return SECCOMP_RET_ALLOW
```

### Architecture-Specific Values

| Architecture | `__NR_socket` | `AF_UNIX` |
|--------------|---------------|-----------|
| x86-64 (x64) | 41 | 1 |
| ARM64 | 198 | 1 |

The BPF filter is compiled separately for each architecture with the correct syscall numbers.

---

## Performance Considerations

### Seccomp Overhead

1. **BPF filter loading** - One-time cost when process starts (~microseconds)
2. **Syscall overhead** - Every syscall goes through BPF filter
   - Non-socket syscalls: Minimal overhead (single comparison)
   - Socket syscalls: One extra comparison for domain check
3. **Memory overhead** - BPF program is ~100 bytes in kernel memory

### Optimization: Skip Seccomp When Not Needed

```javascript
// Early exit if no Unix socket blocking needed
if (allowAllUnixSockets) {
    log("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    // No seccomp overhead in this case
}
```

---

## Troubleshooting

### Common Issues

1. **"Seccomp binaries not available"**
   - Install `@anthropic-ai/sandbox-runtime` globally
   - Or ensure `vendor/seccomp/{arch}/` exists in package

2. **"32-bit x86 not supported"**
   - Use 64-bit Linux (x64 or arm64)
   - Or set `allowAllUnixSockets: true` in config

3. **"apply-seccomp binary not found"**
   - Check file permissions (must be executable)
   - Verify architecture matches (`uname -m`)

### Verification

```bash
# Check seccomp files exist
ls -la node_modules/@anthropic-ai/claude-code/vendor/seccomp/x64/

# Expected output:
# unix-block.bpf
# apply-seccomp

# Test apply-seccomp binary
./vendor/seccomp/x64/apply-seccomp ./vendor/seccomp/x64/unix-block.bpf /bin/bash -c "echo test"
```

---

## Related Documents

- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [network_proxy.md](./network_proxy.md) - Network proxy implementation
- [overview.md](./overview.md) - Sandbox architecture overview
- [violation_system.md](./violation_system.md) - Violation monitoring