# Network Proxy Implementation (Claude Code 2.1.76)

## Overview

Claude Code's network sandbox provides filtered network access through HTTP and SOCKS proxies. On macOS, network requests are filtered at the sandbox-exec level. On Linux, where `--unshare-net` completely isolates the network namespace, a Unix socket bridge pattern is used to allow filtered network access through proxy servers running outside the sandbox.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key symbols in this document:
- `xZ7` - createBridgeSockets function (Linux Unix socket bridges)
- `Lb3` - buildBridgeWrapperCommand function (wraps command with socat bridges)
- `f21` - getProxyEnvVars function (HTTP_PROXY, SOCKS_PROXY environment variables)
- `AG7` - getHttpProxyPort function
- `qG7` - getSocksProxyPort function

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Network Filtering Architecture                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  macOS Approach:                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ sandbox-exec Profile                                                   │  │
│  │                                                                        │  │
│  │ ; Network                                                              │  │
│  │ (allow network-bind (local ip "localhost:3128"))                      │  │
│  │ (allow network-inbound (local ip "localhost:3128"))                   │  │
│  │ (allow network-outbound (remote ip "localhost:3128"))                 │  │
│  │ ; ... explicit network rules for each allowed destination             │  │
│  │                                                                        │  │
│  │ The proxy runs OUTSIDE the sandbox, sandboxed process connects to it  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Linux Approach:                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Network Namespace (completely isolated)                                │  │
│  │                                                                        │  │
│  │   ┌──────────────────────┐         ┌──────────────────────┐           │  │
│  │   │ HTTP Unix Socket     │         │ SOCKS Unix Socket    │           │  │
│  │   │ /tmp/claude-http.sock│         │ /tmp/claude-socks.sock│           │  │
│  │   └──────────┬───────────┘         └──────────┬───────────┘           │  │
│  │              │                                │                       │  │
│  │              │  --bind (into sandbox)         │  --bind               │  │
│  │              ▼                                ▼                       │  │
│  │   ┌──────────────────────────────────────────────────────────────┐   │  │
│  │   │                  Inside Sandbox                               │   │  │
│  │   │                                                                │   │  │
│  │   │   socat TCP-LISTEN:3128 UNIX-CONNECT:/tmp/claude-http.sock   │   │  │
│  │   │   socat TCP-LISTEN:1080 UNIX-CONNECT:/tmp/claude-socks.sock  │   │  │
│  │   │                                                                │   │  │
│  │   │   → localhost:3128 appears as HTTP proxy                     │   │  │
│  │   │   → localhost:1080 appears as SOCKS proxy                    │   │  │
│  │   └──────────────────────────────────────────────────────────────┘   │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│              │                                                                │
│              ▼                                                                │
│   ┌───────────────────────────────────────────────────────────────────────┐  │
│   │                  Proxy Server (outside sandbox)                        │  │
│   │                                                                        │  │
│   │   HTTP Proxy (port 3128) → Domain filter → Allow/Deny                 │  │
│   │   SOCKS Proxy (port 1080) → Domain filter → Allow/Deny                │  │
│   └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Linux Bridge Sockets: `createBridgeSockets` (xZ7)

**Location:** `chunks.55.mjs:2401-2471`

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
    // ... error handlers ...
    let O = [`UNIX-LISTEN:${z},fork,reuseaddr`, `TCP:localhost:${q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    wA(`Starting SOCKS bridge: socat ${O.join(" ")}`);
    let $ = SZ7("socat", O, { stdio: "ignore" });
    if (!$.pid) { /* cleanup and throw */ }
    // ... wait for sockets to be ready ...
    return {
        httpSocketPath: Y,
        socksSocketPath: z,
        httpBridgeProcess: w,
        socksBridgeProcess: $,
        httpProxyPort: A,
        socksProxyPort: q
    }
}

// READABLE (for understanding):
async function createBridgeSockets(httpProxyPort, socksProxyPort) {
    // Generate unique ID for socket names (avoid collisions)
    let socketId = randomBytes(8).toString("hex");

    let httpSocketPath = path.join(getTempDir(), `claude-http-${socketId}.sock`);
    let socksSocketPath = path.join(getTempDir(), `claude-socks-${socketId}.sock`);

    // HTTP bridge: Unix socket → TCP connection to proxy
    let httpBridgeArgs = [
        `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
        `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
    ];
    log(`Starting HTTP bridge: socat ${httpBridgeArgs.join(" ")}`);

    let httpBridgeProcess = spawn("socat", httpBridgeArgs, { stdio: "ignore" });
    if (!httpBridgeProcess.pid) {
        throw new Error("Failed to start HTTP bridge process");
    }

    // SOCKS bridge: Unix socket → TCP connection to proxy
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

    // Wait for sockets to be created (max 5 attempts with backoff)
    let maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (!httpBridgeProcess.pid || httpBridgeProcess.killed ||
            !socksBridgeProcess.pid || socksBridgeProcess.killed) {
            throw new Error("Linux bridge process died unexpectedly");
        }

        try {
            if (fs.existsSync(httpSocketPath) && fs.existsSync(socksSocketPath)) {
                log(`Linux bridges ready after ${attempt + 1} attempts`);
                break;
            }
        } catch (error) {
            log(`Error checking sockets (attempt ${attempt + 1}): ${error}`, { level: "error" });
        }

        if (attempt === maxAttempts - 1) {
            process.kill(httpBridgeProcess.pid, "SIGTERM");
            process.kill(socksBridgeProcess.pid, "SIGTERM");
            throw new Error(`Failed to create bridge sockets after ${maxAttempts} attempts`);
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

// Mapping: xZ7→createBridgeSockets, Nb3→randomBytes, CZ7→path.join, Ew8→getTempDir,
//          SZ7→spawn, wA→log, A→httpProxyPort, q→socksProxyPort
```

**Why Unix sockets:** Network namespaces are completely isolated - there's no shared localhost. By binding Unix sockets into the sandbox, we create a communication channel that bypasses the network namespace boundary.

**Why socat:** Socat provides a simple way to proxy between Unix sockets and TCP. The `fork,reuseaddr` options allow multiple concurrent connections.

---

## Bridge Wrapper Command: `buildBridgeWrapperCommand` (Lb3)

**Location:** `chunks.55.mjs:2474-2488`

```javascript
// ============================================
// buildBridgeWrapperCommand - Wrap command with socat bridges inside sandbox
// Location: chunks.55.mjs:2474-2488
// ============================================

// ORIGINAL (for source lookup):
function Lb3(A, q, K, Y, z, _) {
    let w = z || "bash",
        O = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${q} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
    if (Y) {
        let $ = Ex6(_);
        if (!$) throw Error("apply-seccomp binary not found...");
        let H = gq6.default.quote([$, Y, w, "-c", K]),
            j = [...O, H].join(`
`);
        return `${w} -c ${gq6.default.quote([j])}`
    } else {
        let $ = [...O, `eval ${gq6.default.quote([K])}`].join(`
`);
        return `${w} -c ${gq6.default.quote([$])}`
    }
}

// READABLE (for understanding):
function buildBridgeWrapperCommand(
    httpSocketPath,
    socksSocketPath,
    command,
    seccompFilterPath,
    shell = "bash",
    seccompApplyPath
) {
    // Start socat listeners inside sandbox that forward to Unix sockets
    let bridgeSetup = [
        // HTTP proxy listener on port 3128 → forward to Unix socket
        `socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${httpSocketPath} >/dev/null 2>&1 &`,

        // SOCKS proxy listener on port 1080 → forward to Unix socket
        `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${socksSocketPath} >/dev/null 2>&1 &`,

        // Cleanup on exit
        'trap "kill %1 %2 2>/dev/null; exit" EXIT'
    ];

    if (seccompFilterPath) {
        // Apply seccomp filter before running command
        let applySeccompPath = getApplySeccompPath(seccompApplyPath);
        if (!applySeccompPath) {
            throw new Error("apply-seccomp binary not found");
        }

        let seccompCommand = quote([applySeccompPath, seccompFilterPath, shell, "-c", command]);
        let fullScript = [...bridgeSetup, seccompCommand].join("\n");
        return `${shell} -c ${quote([fullScript])}`;
    } else {
        // No seccomp - run command directly
        let fullScript = [...bridgeSetup, `eval ${quote([command])}`].join("\n");
        return `${shell} -c ${quote([fullScript])}`;
    }
}

// Mapping: Lb3→buildBridgeWrapperCommand, A→httpSocketPath, q→socksSocketPath,
//          K→command, Y→seccompFilterPath, z→shell, Ex6→getApplySeccompPath
```

**The bridge pattern explained:**

1. **Outside sandbox:** Socat listens on Unix sockets, forwards to TCP proxy ports
2. **Inside sandbox:** Socat listens on TCP ports, forwards to Unix sockets
3. **Result:** Application sees `localhost:3128` as HTTP proxy, which tunnels through the Unix socket to the actual proxy outside the sandbox

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Bridge Pattern Flow                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Inside Sandbox                     Outside Sandbox                         │
│   ──────────────                     ───────────────                         │
│                                                                             │
│   App → localhost:3128                                                       │
│           │                                                                 │
│           ▼                                                                 │
│   socat TCP-LISTEN:3128                                                      │
│           │                                                                 │
│           │ (via Unix socket bound into sandbox)                            │
│           ▼                                                                 │
│   ────────┼─────────────────────────────────────────────────────┼──────     │
│           │  /tmp/claude-http-xxx.sock                          │            │
│   ────────┼─────────────────────────────────────────────────────┼──────     │
│           │                                                                 │
│           ▼                                                                 │
│                       socat UNIX-LISTEN                                      │
│                              │                                              │
│                              ▼                                              │
│                       TCP → localhost:3128 (proxy)                          │
│                              │                                              │
│                              ▼                                              │
│                       Domain Filter → Allow/Deny                            │
│                              │                                              │
│                              ▼                                              │
│                       Internet                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Domain Filtering Algorithm

### Proxy Request Interception

The HTTP and SOCKS proxies perform domain-based filtering on each request:

```javascript
// ============================================
// Domain filtering decision flow (conceptual)
// ============================================

// READABLE (for understanding):
function isDomainAllowed(hostname, proxyConfig) {
    // Step 1: Check explicit deny list (highest priority)
    for (let denyPattern of proxyConfig.deniedDomains) {
        if (matchDomain(denyPattern, hostname)) {
            log(`Domain ${hostname} denied by explicit deny rule: ${denyPattern}`);
            return { allowed: false, reason: 'explicit-deny' };
        }
    }

    // Step 2: Check explicit allow list
    for (let allowPattern of proxyConfig.allowedDomains) {
        if (matchDomain(allowPattern, hostname)) {
            log(`Domain ${hostname} allowed by rule: ${allowPattern}`);
            return { allowed: true, reason: 'explicit-allow' };
        }
    }

    // Step 3: No match found - apply default policy
    if (proxyConfig.defaultPolicy === 'allow') {
        return { allowed: true, reason: 'default-allow' };
    } else {
        // For managed domains: prompt user if callback available
        if (proxyConfig.onUnknownDomain) {
            return proxyConfig.onUnknownDomain(hostname);
        }
        return { allowed: false, reason: 'no-matching-rule' };
    }
}

function matchDomain(pattern, hostname) {
    // Wildcard support: *.example.com matches subdomain.example.com
    if (pattern.startsWith('*.')) {
        let baseDomain = pattern.slice(2);  // Remove "*."
        return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
    }
    // Exact match
    return pattern === hostname;
}
```

### NO_PROXY Construction

**What it does:** The `NO_PROXY` environment variable tells HTTP clients which hosts should bypass the proxy entirely (direct connection).

```javascript
// ============================================
// buildNoProxyList - Construct hosts that bypass proxy
// ============================================

// READABLE (for understanding):
function buildNoProxyList() {
    let noProxyHosts = [
        // Local addresses
        "localhost",
        "127.0.0.1",
        "::1",

        // Local network
        "*.local",
        ".local",

        // Private IPv4 ranges (RFC 1918)
        "169.254.0.0/16",  // Link-local
        "10.0.0.0/8",      // Class A private
        "172.16.0.0/12",   // Class B private
        "192.168.0.0/16",  // Class C private
    ];

    return noProxyHosts.join(",");
}

// Result: "localhost,127.0.0.1,::1,*.local,.local,169.254.0.0/16,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
```

**Why these ranges:**
- Local addresses should never go through the proxy (avoid loopback latency)
- Private networks are typically trusted internal resources
- Link-local addresses are non-routable, no need for filtering

---

## Proxy Environment Variables

**Location:** `chunks.55.mjs` (referenced in bwrap command building)

```javascript
// ============================================
// getProxyEnvVars - Generate proxy environment variables
// ============================================

// READABLE (for understanding):
function getProxyEnvVars(httpProxyPort, socksProxyPort) {
    return [
        `HTTP_PROXY=http://localhost:${httpProxyPort}`,
        `HTTPS_PROXY=http://localhost:${httpProxyPort}`,
        `http_proxy=http://localhost:${httpProxyPort}`,
        `https_proxy=http://localhost:${httpProxyPort}`,
        `ALL_PROXY=socks5://localhost:${socksProxyPort}`,
        `all_proxy=socks5://localhost:${socksProxyPort}`
    ];
}

// Used in bwrap arguments:
// --setenv HTTP_PROXY http://localhost:3128
// --setenv HTTPS_PROXY http://localhost:3128
// etc.
```

**Why both cases:** Some applications check `HTTP_PROXY` (uppercase), others check `http_proxy` (lowercase). Setting both ensures compatibility.

---

## macOS Network Rules

On macOS, network access is controlled through the SBPL profile:

```lisp
; Network
(allow network*)  ; If no restriction

; Or with restriction:
(allow network-bind (local ip "localhost:3128"))
(allow network-inbound (local ip "localhost:3128"))
(allow network-outbound (remote ip "localhost:3128"))

; Local binding (if allowLocalBinding):
(allow network-bind (local ip "*:*"))
(allow network-inbound (local ip "*:*"))
(allow network-outbound (local ip "*:*"))

; Unix sockets (if allowAllUnixSockets):
(allow system-socket (socket-domain AF_UNIX))
(allow network-bind (local unix-socket (path-regex #"^/")))
(allow network-outbound (remote unix-socket (path-regex #"^/")))
```

**Key difference from Linux:** macOS's sandbox-exec allows fine-grained network rules. The sandboxed process can connect to localhost:3128 (the proxy) but is denied access to other network destinations.

---

## Managed Domains

The proxy servers perform domain-based filtering. While the proxy implementation is in a separate package, Claude Code provides configuration for managed domains:

```javascript
// Schema for network configuration (chunks.56.mjs)
{
    httpProxyPort: z.number().int().min(1).max(65535).optional()
        .describe("Port of an external HTTP proxy to use..."),

    socksProxyPort: z.number().int().min(1).max(65535).optional()
        .describe("Port of an external SOCKS proxy to use..."),

    enableWeakerNetworkIsolation: z.boolean().optional()
        .describe("Enable weaker network isolation to allow access to " +
            "com.apple.trustd.agent (macOS only). This is needed for Go " +
            "programs to verify TLS certificates when using httpProxyPort...")
}
```

### Weaker Network Isolation for Go TLS

On macOS, Go programs need to verify TLS certificates through `com.apple.trustd.agent`. With network restriction, this service is blocked, causing TLS verification to fail.

**Solution:** `enableWeakerNetworkIsolation` adds:

```lisp
; trustd.agent - needed for Go TLS certificate verification
(allow mach-lookup (global-name "com.apple.trustd.agent"))
```

**Trade-off:** This opens a potential data exfiltration vector, as `trustd` can make network requests. Only enable when using Go-based CLI tools with a MITM proxy.

---

## Error Handling

### Bridge Socket Not Found

```javascript
if (!fs.existsSync(httpSocketPath)) {
    throw new Error(
        `Linux HTTP bridge socket does not exist: ${httpSocketPath}. ` +
        `The bridge process may have died. Try reinitializing the sandbox.`
    );
}
```

### Bridge Process Died

```javascript
if (!httpBridgeProcess.pid || httpBridgeProcess.killed) {
    throw new Error("Linux bridge process died unexpectedly");
}
```

---

## Design Rationale

### Why Not Allow Direct Network Access

Direct network access would allow sandboxed commands to:
1. Exfiltrate data to arbitrary servers
2. Bypass domain filtering
3. Access internal network resources

The proxy pattern ensures all network traffic passes through the filter.

### Why Separate HTTP and SOCKS Proxies

- **HTTP Proxy:** Handles HTTP/HTTPS traffic, can inspect and modify requests
- **SOCKS Proxy:** Handles any TCP traffic (including non-HTTP protocols)

Some tools only support one or the other, so providing both ensures compatibility.

### Why socat Instead of Built-in Forwarding

Bubblewrap doesn't have built-in port forwarding. Using socat provides:
1. Well-tested, reliable forwarding
2. Support for multiple concurrent connections (`fork`)
3. Keepalive configuration for long-running connections

---

## Related Documents

- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec profiles
- [overview.md](./overview.md) - Sandbox architecture overview