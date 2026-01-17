# macOS Sandbox Implementation (2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `generateSandboxProfile` (M58) - Generate Seatbelt policy
- `macOSSandboxWrapper` (HHB) - Wrap command with sandbox-exec
- `startMacOSViolationMonitor` (EHB) - Monitor sandbox denials via log stream
- `SandboxViolationStore` (nMA) - Store violation history
- `encodeCommandTag` (w58) - Encode command for correlation

---

## 1. Overview

### Why Seatbelt for macOS

Apple's Seatbelt (also known as `sandbox-exec`) provides:

1. **Built-in system** - No external dependencies required
2. **Kernel-level enforcement** - Cannot be bypassed from userspace
3. **Fine-grained control** - Per-operation permissions (read, write, execute, network)
4. **Real-time logging** - Violations logged to system log for monitoring
5. **Default-deny model** - Everything blocked unless explicitly allowed

**Trade-offs:**
- Apple considers it "deprecated" (but still functional)
- macOS-specific (no cross-platform portability)
- Profile syntax is complex and underdocumented

### Architecture

```
+----------------------------------------------------+
|                    sandbox-exec                     |
|           env [proxy vars] sandbox-exec -p         |
|              "<seatbelt_policy>" bash -c           |
|                   "user_command"                    |
+------------------------+---------------------------+
                         |
                         v
+----------------------------------------------------+
|                  Seatbelt Policy                    |
|                                                     |
|  (version 1)                                        |
|  (deny default (with message "CMD64_xxx_END_tag")) |
|                                                     |
|  ; Essential permissions                            |
|  (allow process-exec)                               |
|  (allow process-fork)                               |
|  (allow mach-lookup ...)                            |
|  (allow file-read*)                                 |
|  (deny file-read* (subpath "/denied/path"))        |
|  (allow file-write* (subpath "/allowed/path"))     |
|  (allow network-outbound (remote ip "proxy:port")) |
|  ...                                                |
+----------------------------------------------------+
                         |
                         v
+----------------------------------------------------+
|              macOS Kernel (XNU)                     |
|         Enforces sandbox restrictions               |
+----------------------------------------------------+
                         |
                         v
+----------------------------------------------------+
|              System Log (unified log)               |
|          Records "Sandbox: deny ..." messages       |
+----------------------------------------------------+
                         |
                         v
+----------------------------------------------------+
|          startMacOSViolationMonitor                 |
|     log stream --predicate "(... ENDSWITH tag)"    |
|            Parses and reports violations            |
+----------------------------------------------------+
```

---

## 2. Sandbox Profile Generation

### 2.1 generateSandboxProfile Function

```javascript
// ============================================
// generateSandboxProfile - Create Seatbelt policy string
// Location: chunks.53.mjs:2531-2560
// ============================================

// ORIGINAL (for source lookup):
function M58({
  readConfig: A, writeConfig: Q, httpProxyPort: B, socksProxyPort: G,
  needsNetworkRestriction: Z, allowUnixSockets: Y, allowAllUnixSockets: J,
  allowLocalBinding: X, allowPty: I, allowGitConfig: D = !1, logTag: W
}) {
  let K = [
    "(version 1)",
    `(deny default (with message "${W}"))`,
    "",
    `; LogTag: ${W}`,
    "",
    "; Essential permissions",
    "(allow process-exec)", "(allow process-fork)",
    "(allow process-info* (target same-sandbox))",
    "(allow signal (target same-sandbox))",
    "(allow mach-priv-task-port (target same-sandbox))",
    "",
    "(allow user-preference-read)",
    "",
    "; Mach IPC - specific services only",
    "(allow mach-lookup",
    '  (global-name "com.apple.audio.systemsoundserver")',
    '  (global-name "com.apple.distributed_notifications@Uv3")',
    // ... many more mach services ...
    ")",
    // ... rest of policy ...
  ];
  // Add network, file read, file write sections
  return K.join("\n")
}

// READABLE (for understanding):
function generateSandboxProfile({
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
  logTag
}) {
  let policyLines = [
    // Header
    "(version 1)",
    `(deny default (with message "${logTag}"))`,  // Default deny with tag for logging
    "",
    `; LogTag: ${logTag}`,
    "",

    // Essential process permissions
    "; Essential permissions - based on Chrome sandbox policy",
    "; Process permissions",
    "(allow process-exec)",
    "(allow process-fork)",
    "(allow process-info* (target same-sandbox))",
    "(allow signal (target same-sandbox))",
    "(allow mach-priv-task-port (target same-sandbox))",
    "",

    // User preferences
    "(allow user-preference-read)",
    "",

    // Mach IPC - specific services only (no wildcards)
    "; Mach IPC - specific services only (no wildcard)",
    "(allow mach-lookup",
    '  (global-name "com.apple.audio.systemsoundserver")',
    '  (global-name "com.apple.distributed_notifications@Uv3")',
    '  (global-name "com.apple.FontObjectsServer")',
    '  (global-name "com.apple.fonts")',
    '  (global-name "com.apple.logd")',
    '  (global-name "com.apple.lsd.mapdb")',
    '  (global-name "com.apple.PowerManagement.control")',
    '  (global-name "com.apple.system.logger")',
    '  (global-name "com.apple.system.notification_center")',
    '  (global-name "com.apple.trustd.agent")',
    '  (global-name "com.apple.system.opendirectoryd.libinfo")',
    '  (global-name "com.apple.system.opendirectoryd.membership")',
    '  (global-name "com.apple.bsd.dirhelper")',
    '  (global-name "com.apple.securityd.xpc")',
    '  (global-name "com.apple.coreservices.launchservicesd")',
    ")",
    "",

    // POSIX IPC
    "; POSIX IPC - shared memory",
    "(allow ipc-posix-shm)",
    "",
    "; POSIX IPC - semaphores for Python multiprocessing",
    "(allow ipc-posix-sem)",
    "",

    // IOKit
    "; IOKit - specific operations only",
    "(allow iokit-open",
    '  (iokit-registry-entry-class "IOSurfaceRootUserClient")',
    '  (iokit-registry-entry-class "RootDomainUserClient")',
    '  (iokit-user-client-class "IOSurfaceSendRight")',
    ")",
    "(allow iokit-get-properties)",
    "",

    // System sockets (not network access)
    "; Specific safe system-sockets, doesn't allow network access",
    "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))",
    "",

    // ... many more sysctl, device, etc. permissions ...
  ];

  // Network section
  policyLines.push("; Network");
  if (!needsNetworkRestriction) {
    policyLines.push("(allow network*)");
  } else {
    // Allow localhost binding if enabled
    if (allowLocalBinding) {
      policyLines.push('(allow network-bind (local ip "localhost:*"))');
      policyLines.push('(allow network-inbound (local ip "localhost:*"))');
      policyLines.push('(allow network-outbound (local ip "localhost:*"))');
    }

    // Unix sockets
    if (allowAllUnixSockets) {
      policyLines.push('(allow network* (subpath "/"))');
    } else if (allowUnixSockets && allowUnixSockets.length > 0) {
      for (let socketPath of allowUnixSockets) {
        let normalizedPath = normalizePath(socketPath);
        policyLines.push(`(allow network* (subpath ${quote(normalizedPath)}))`);
      }
    }

    // Proxy ports
    if (httpProxyPort !== undefined) {
      policyLines.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
      policyLines.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
      policyLines.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
    }
    if (socksProxyPort !== undefined) {
      policyLines.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
      policyLines.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
      policyLines.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
    }
  }

  // File read section
  policyLines.push("");
  policyLines.push("; File read");
  policyLines.push(...buildFileReadPolicy(readConfig, logTag));

  // File write section
  policyLines.push("");
  policyLines.push("; File write");
  policyLines.push(...buildFileWritePolicy(writeConfig, logTag, allowGitConfig));

  // PTY support if needed
  if (allowPty) {
    policyLines.push("");
    policyLines.push("; Pseudo-terminal (pty) support");
    policyLines.push("(allow pseudo-tty)");
    policyLines.push("(allow file-ioctl");
    policyLines.push('  (literal "/dev/ptmx")');
    policyLines.push('  (regex #"^/dev/ttys")');
    policyLines.push(")");
    policyLines.push("(allow file-read* file-write*");
    policyLines.push('  (literal "/dev/ptmx")');
    policyLines.push('  (regex #"^/dev/ttys")');
    policyLines.push(")");
  }

  return policyLines.join("\n");
}

// Mapping: M58->generateSandboxProfile
```

### 2.2 Profile Structure

The generated profile has these sections:

| Section | Purpose |
|---------|---------|
| **Header** | Version, default deny with logging tag |
| **Process** | exec, fork, signals, process info |
| **Mach IPC** | Specific Apple service lookups |
| **POSIX IPC** | Shared memory, semaphores |
| **IOKit** | Graphics, power management |
| **sysctl** | System info reads (CPU, memory) |
| **Device files** | /dev/null, /dev/random, etc. |
| **Network** | Proxy ports, localhost, Unix sockets |
| **File read** | Allow all except deny list |
| **File write** | Deny all except allow list |
| **PTY** | Terminal support (optional) |

---

## 3. File Permission Policies

### 3.1 File Read Policy

```javascript
// ============================================
// buildFileReadPolicy - Generate file read rules
// Location: chunks.53.mjs:2491-2503
// ============================================

// ORIGINAL (for source lookup):
function L58(A, Q) {
  if (!A) return ["(allow file-read*)"];
  let B = [];
  B.push("(allow file-read*)");
  for (let G of A.denyOnly || []) {
    let Z = KP(G);
    if (WP(Z)) {
      let Y = j01(Z);
      B.push("(deny file-read*", `  (regex ${kL(Y)})`, `  (with message "${Q}"))`)
    } else B.push("(deny file-read*", `  (subpath ${kL(Z)})`, `  (with message "${Q}"))`)
  }
  return B.push(...FHB(A.denyOnly || [], Q)), B
}

// READABLE (for understanding):
function buildFileReadPolicy(readConfig, logTag) {
  // No restrictions: allow all reads
  if (!readConfig) {
    return ["(allow file-read*)"];
  }

  let rules = [];

  // Default: allow all reads
  rules.push("(allow file-read*)");

  // Add deny rules for specific paths
  for (let denyPath of readConfig.denyOnly || []) {
    let normalizedPath = normalizePath(denyPath);

    if (hasGlobPattern(normalizedPath)) {
      // Convert glob to regex
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(deny file-read*");
      rules.push(`  (regex ${quote(regexPattern)})`);
      rules.push(`  (with message "${logTag}"))`);
    } else {
      // Use subpath for directories
      rules.push("(deny file-read*");
      rules.push(`  (subpath ${quote(normalizedPath)})`);
      rules.push(`  (with message "${logTag}"))`);
    }
  }

  // Add unlink protection for denied paths
  rules.push(...buildUnlinkProtection(readConfig.denyOnly || [], logTag));

  return rules;
}

// Mapping: L58->buildFileReadPolicy, A->readConfig, Q->logTag, j01->globToRegex
```

### 3.2 File Write Policy

```javascript
// ============================================
// buildFileWritePolicy - Generate file write rules
// Location: chunks.53.mjs:2505-2529
// ============================================

// ORIGINAL (for source lookup):
function O58(A, Q, B = !1) {
  if (!A) return ["(allow file-write*)"];
  let G = [], Z = R58();
  for (let J of Z) {
    let X = KP(J);
    G.push("(allow file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  for (let J of A.allowOnly || []) {
    let X = KP(J);
    if (WP(X)) {
      let I = j01(X);
      G.push("(allow file-write*", `  (regex ${kL(I)})`, `  (with message "${Q}"))`)
    } else G.push("(allow file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  let Y = [...A.denyWithinAllow || [], ...N58(B)];
  for (let J of Y) {
    let X = KP(J);
    if (WP(X)) {
      let I = j01(X);
      G.push("(deny file-write*", `  (regex ${kL(I)})`, `  (with message "${Q}"))`)
    } else G.push("(deny file-write*", `  (subpath ${kL(X)})`, `  (with message "${Q}"))`)
  }
  return G.push(...FHB(Y, Q)), G
}

// READABLE (for understanding):
function buildFileWritePolicy(writeConfig, logTag, allowGitConfig = false) {
  // No restrictions: allow all writes
  if (!writeConfig) {
    return ["(allow file-write*)"];
  }

  let rules = [];

  // Always allow writing to temp directories
  let tempDirs = getTempDirectories();
  for (let tempDir of tempDirs) {
    let normalizedPath = normalizePath(tempDir);
    rules.push("(allow file-write*");
    rules.push(`  (subpath ${quote(normalizedPath)})`);
    rules.push(`  (with message "${logTag}"))`);
  }

  // Allow specified writable paths
  for (let allowPath of writeConfig.allowOnly || []) {
    let normalizedPath = normalizePath(allowPath);

    if (hasGlobPattern(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(allow file-write*");
      rules.push(`  (regex ${quote(regexPattern)})`);
      rules.push(`  (with message "${logTag}"))`);
    } else {
      rules.push("(allow file-write*");
      rules.push(`  (subpath ${quote(normalizedPath)})`);
      rules.push(`  (with message "${logTag}"))`);
    }
  }

  // Build deny list (explicit denies + protected config files)
  let denyPaths = [
    ...(writeConfig.denyWithinAllow || []),
    ...getConfigurationDirsToProtect(allowGitConfig)
  ];

  // Add deny rules
  for (let denyPath of denyPaths) {
    let normalizedPath = normalizePath(denyPath);

    if (hasGlobPattern(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(deny file-write*");
      rules.push(`  (regex ${quote(regexPattern)})`);
      rules.push(`  (with message "${logTag}"))`);
    } else {
      rules.push("(deny file-write*");
      rules.push(`  (subpath ${quote(normalizedPath)})`);
      rules.push(`  (with message "${logTag}"))`);
    }
  }

  // Add unlink protection
  rules.push(...buildUnlinkProtection(denyPaths, logTag));

  return rules;
}

// Mapping: O58->buildFileWritePolicy, A->writeConfig, Q->logTag, B->allowGitConfig
// R58->getTempDirectories, N58->getConfigurationDirsToProtect
```

---

## 4. Command Wrapping

### macOSSandboxWrapper Function

```javascript
// ============================================
// macOSSandboxWrapper - Wrap command with sandbox-exec
// Location: chunks.53.mjs:2576-2615
// ============================================

// ORIGINAL (for source lookup):
function HHB(A) {
  let {
    command: Q, needsNetworkRestriction: B, httpProxyPort: G, socksProxyPort: Z,
    allowUnixSockets: Y, allowAllUnixSockets: J, allowLocalBinding: X,
    readConfig: I, writeConfig: D, allowPty: W, allowGitConfig: K = !1, binShell: V
  } = A, F = I && I.denyOnly.length > 0;
  if (!B && !F && D === void 0) return Q;
  let E = w58(Q),
    z = M58({ readConfig: I, writeConfig: D, httpProxyPort: G, socksProxyPort: Z,
              needsNetworkRestriction: B, allowUnixSockets: Y, allowAllUnixSockets: J,
              allowLocalBinding: X, allowPty: W, allowGitConfig: K, logTag: E }),
    $ = M01(G, Z),
    O = V || "bash",
    L = q58("which", [O], { encoding: "utf8" });
  if (L.status !== 0) throw Error(`Shell '${O}' not found in PATH`);
  let M = L.stdout.trim(),
    _ = KHB.default.quote(["env", ...$, "sandbox-exec", "-p", z, M, "-c", Q]);
  return _
}

// READABLE (for understanding):
function macOSSandboxWrapper(options) {
  const {
    command,
    needsNetworkRestriction,
    httpProxyPort,
    socksProxyPort,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    readConfig,
    writeConfig,
    allowPty,
    allowGitConfig = false,
    binShell
  } = options;

  const hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;

  // If no restrictions needed, return command unchanged
  if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) {
    return command;
  }

  // Generate command tag for log correlation
  let logTag = encodeCommandTag(command);

  // Generate Seatbelt profile
  let sandboxProfile = generateSandboxProfile({
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    allowPty,
    allowGitConfig,
    logTag
  });

  // Build proxy environment variables
  let proxyEnvVars = buildProxyEnvironmentVars(httpProxyPort, socksProxyPort);

  // Find shell path
  let shell = binShell || "bash";
  let whichResult = execSync("which", [shell], { encoding: "utf8" });
  if (whichResult.status !== 0) {
    throw Error(`Shell '${shell}' not found in PATH`);
  }
  let shellPath = whichResult.stdout.trim();

  // Build final command
  let fullCommand = shellQuote([
    "env",
    ...proxyEnvVars,
    "sandbox-exec",
    "-p", sandboxProfile,
    shellPath,
    "-c", command
  ]);

  log(`[Sandbox macOS] Applied restrictions - network: ${!!(httpProxyPort||socksProxyPort)}, ` +
      `read: ${readConfig ? "restricted" : "none"}, write: ${writeConfig ? "restricted" : "none"}`);

  return fullCommand;
}

// Mapping: HHB->macOSSandboxWrapper, w58->encodeCommandTag, M58->generateSandboxProfile
// M01->buildProxyEnvironmentVars
```

### Command Structure

```bash
env \
  HTTP_PROXY="http://localhost:3128" \
  HTTPS_PROXY="http://localhost:3128" \
  ALL_PROXY="socks5://localhost:1080" \
  NO_PROXY="localhost,127.0.0.1,::1,*.local" \
  sandbox-exec -p '(version 1)
(deny default (with message "CMD64_xxx_END_tag"))
; ... policy content ...
' \
  /bin/bash -c "actual_user_command"
```

---

## 5. Violation Monitoring

### 5.1 startMacOSViolationMonitor Function

```javascript
// ============================================
// startMacOSViolationMonitor - Monitor sandbox denials via log stream
// Location: chunks.53.mjs:2617-2663
// ============================================

// ORIGINAL (for source lookup):
function EHB(A, Q) {
  let B = /CMD64_(.+?)_END/,
    G = /Sandbox:\s+(.+)$/,
    Z = Q?.["*"] || [],
    Y = Q ? Object.entries(Q).filter(([X]) => X !== "*") : [],
    J = U58("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${VHB}")`, "--style", "compact"]);
  return J.stdout?.on("data", (X) => {
    let I = X.toString().split("\n"),
      D = I.find((E) => E.includes("Sandbox:") && E.includes("deny")),
      W = I.find((E) => E.startsWith("CMD64_"));
    if (!D) return;
    let K = D.match(G);
    if (!K?.[1]) return;
    let V = K[1], F, H;
    if (W) {
      if (H = W.match(B)?.[1], H) try { F = rFB(H) } catch {}
    }
    if (V.includes("mDNSResponder") || V.includes("mach-lookup com.apple.diagnosticd") ||
        V.includes("mach-lookup com.apple.analyticsd")) return;
    if (Q && F) {
      if (Z.length > 0) { if (Z.some((z) => V.includes(z))) return }
      for (let [E, z] of Y) if (F.includes(E)) { if (z.some((O) => V.includes(O))) return }
    }
    A({ line: V, command: F, encodedCommand: H, timestamp: new Date })
  }), () => { J.kill("SIGTERM") }
}

// READABLE (for understanding):
function startMacOSViolationMonitor(violationCallback, ignoreRules) {
  // Regex patterns
  const CMD64_PATTERN = /CMD64_(.+?)_END/;      // Extract encoded command
  const SANDBOX_DENY_PATTERN = /Sandbox:\s+(.+)$/; // Extract violation message

  // Parse ignore rules
  const wildcardRules = ignoreRules?.["*"] || [];
  const specificRules = ignoreRules
    ? Object.entries(ignoreRules).filter(([key]) => key !== "*")
    : [];

  // Start log stream with unique predicate
  const logProcess = spawn("log", [
    "stream",
    "--predicate",
    `(eventMessage ENDSWITH "${UNIQUE_SANDBOX_TAG}")`,
    "--style", "compact"
  ]);

  // Process log output
  logProcess.stdout?.on("data", (chunk) => {
    const lines = chunk.toString().split("\n");

    // Find sandbox deny line
    const denyLine = lines.find(line =>
      line.includes("Sandbox:") && line.includes("deny")
    );

    // Find encoded command line
    const cmdLine = lines.find(line => line.startsWith("CMD64_"));

    if (!denyLine) return;

    // Extract violation message
    const match = denyLine.match(SANDBOX_DENY_PATTERN);
    if (!match?.[1]) return;

    const violationMsg = match[1];
    let decodedCommand, encodedCommand;

    // Try to decode command
    if (cmdLine) {
      encodedCommand = cmdLine.match(CMD64_PATTERN)?.[1];
      if (encodedCommand) {
        try {
          decodedCommand = base64Decode(encodedCommand);
        } catch {}
      }
    }

    // Filter known safe violations (system services)
    if (violationMsg.includes("mDNSResponder") ||
        violationMsg.includes("mach-lookup com.apple.diagnosticd") ||
        violationMsg.includes("mach-lookup com.apple.analyticsd")) {
      return;
    }

    // Check against ignore rules
    if (ignoreRules && decodedCommand) {
      // Wildcard rules apply to all commands
      if (wildcardRules.length > 0) {
        if (wildcardRules.some(rule => violationMsg.includes(rule))) return;
      }

      // Specific command rules
      for (let [commandPattern, rulesList] of specificRules) {
        if (decodedCommand.includes(commandPattern)) {
          if (rulesList.some(rule => violationMsg.includes(rule))) return;
        }
      }
    }

    // Report violation to caller
    violationCallback({
      line: violationMsg,
      command: decodedCommand,
      encodedCommand: encodedCommand,
      timestamp: new Date()
    });
  });

  // Log errors
  logProcess.stderr?.on("data", (chunk) => {
    log(`[Sandbox Monitor] Log stream stderr: ${chunk.toString()}`);
  });
  logProcess.on("error", (error) => {
    log(`[Sandbox Monitor] Failed to start log stream: ${error.message}`);
  });
  logProcess.on("exit", (code) => {
    log(`[Sandbox Monitor] Log stream exited with code: ${code}`);
  });

  // Return cleanup function
  return () => {
    log("[Sandbox Monitor] Stopping log monitor");
    logProcess.kill("SIGTERM");
  };
}

// Mapping: EHB->startMacOSViolationMonitor, A->violationCallback, Q->ignoreRules
// VHB->UNIQUE_SANDBOX_TAG, rFB->base64Decode
```

### 5.2 How Violation Monitoring Works

1. **Log stream** - `log stream --predicate "(eventMessage ENDSWITH tag)"`
2. **Parse output** - Look for lines containing "Sandbox:" and "deny"
3. **Decode command** - Extract base64-encoded command from `CMD64_xxx_END` pattern
4. **Filter noise** - Skip known safe system service violations
5. **Apply rules** - Check ignore patterns from config
6. **Report** - Call callback with violation details

### 5.3 SandboxViolationStore Class

```javascript
// ============================================
// SandboxViolationStore - In-memory violation history
// Location: chunks.53.mjs:2675-2709
// ============================================

// ORIGINAL (for source lookup):
class nMA {
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
  getViolationsForCommand(A) {
    let Q = R01(A);
    return this.violations.filter((B) => B.encodedCommand === Q)
  }
  subscribe(A) {
    return this.listeners.add(A), A(this.getViolations()), () => { this.listeners.delete(A) }
  }
}

// READABLE (for understanding):
class SandboxViolationStore {
  constructor() {
    this.violations = [];       // Store recent violations
    this.totalCount = 0;        // Track total count (even after pruning)
    this.maxSize = 100;         // Keep only last 100 violations
    this.listeners = new Set(); // Reactive listeners
  }

  addViolation(violation) {
    this.violations.push(violation);
    this.totalCount++;

    // Prune old violations
    if (this.violations.length > this.maxSize) {
      this.violations = this.violations.slice(-this.maxSize);
    }

    this.notifyListeners();
  }

  getViolations(limit) {
    if (limit === undefined) {
      return [...this.violations];
    }
    return this.violations.slice(-limit);
  }

  getCount() {
    return this.violations.length;
  }

  getTotalCount() {
    return this.totalCount;
  }

  getViolationsForCommand(command) {
    // Encode command to match against stored encoded commands
    let encodedCmd = encodeToBase64(command);
    return this.violations.filter(v => v.encodedCommand === encodedCmd);
  }

  clear() {
    this.violations = [];
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getViolations());  // Immediate callback with current state
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    let violations = this.getViolations();
    this.listeners.forEach(callback => callback(violations));
  }
}

// Mapping: nMA->SandboxViolationStore
```

---

## 6. Helper Functions

### 6.1 Glob to Regex Conversion

```javascript
// ============================================
// globToRegex - Convert glob pattern to regex
// Location: chunks.53.mjs:2450-2452
// ============================================

// ORIGINAL (for source lookup):
function j01(A) {
  return "^" + A.replace(/[.^$+{}()|\\]/g, "\\$&")
              .replace(/\[([^\]]*?)$/g, "\\[$1")
              .replace(/\*\*\//g, "__GLOBSTAR_SLASH__")
              .replace(/\*\*/g, "__GLOBSTAR__")
              .replace(/\*/g, "[^/]*")
              .replace(/\?/g, "[^/]")
              .replace(/__GLOBSTAR_SLASH__/g, "(.*/)?")
              .replace(/__GLOBSTAR__/g, ".*") + "$"
}

// READABLE (for understanding):
function globToRegex(globPattern) {
  return "^" + globPattern
    // Escape regex special chars
    .replace(/[.^$+{}()|\\]/g, "\\$&")
    // Handle unclosed brackets
    .replace(/\[([^\]]*?)$/g, "\\[$1")
    // Preserve globstar patterns temporarily
    .replace(/\*\*\//g, "__GLOBSTAR_SLASH__")
    .replace(/\*\*/g, "__GLOBSTAR__")
    // Convert single * to "any character except /"
    .replace(/\*/g, "[^/]*")
    // Convert ? to "any single character except /"
    .replace(/\?/g, "[^/]")
    // Convert globstar patterns
    .replace(/__GLOBSTAR_SLASH__/g, "(.*/)?")  // **/ = zero or more directories
    .replace(/__GLOBSTAR__/g, ".*")            // ** = anything
    + "$";  // Anchor at end
}

// Mapping: j01->globToRegex, A->globPattern
```

### 6.2 Command Tag Encoding

```javascript
// ============================================
// encodeCommandTag - Encode command for log correlation
// Location: chunks.53.mjs:2454-2456
// ============================================

// ORIGINAL (for source lookup):
function w58(A) {
  return `CMD64_${R01(A)}_END_${VHB}`
}

// READABLE (for understanding):
function encodeCommandTag(command) {
  // Format: CMD64_<base64_encoded_command>_END_<unique_session_tag>
  return `CMD64_${base64Encode(command)}_END_${UNIQUE_SANDBOX_TAG}`;
}

// Mapping: w58->encodeCommandTag, R01->base64Encode, VHB->UNIQUE_SANDBOX_TAG
```

---

## 7. Comparison: macOS vs Linux

| Aspect | macOS | Linux |
|--------|-------|-------|
| **Technology** | Apple Seatbelt | bubblewrap + seccomp |
| **Enforcement** | Kernel (XNU) | Kernel (namespaces) |
| **Dependencies** | None (built-in) | bwrap, socat |
| **Network Isolation** | Proxy filtering | Namespace isolation |
| **Violation Detection** | Real-time log stream | None |
| **Glob Support** | Yes (regex conversion) | No |
| **Profile Complexity** | High (S-expression) | Medium (CLI args) |
| **Docker Support** | N/A | enableWeakerNestedSandbox |

---

## See Also

- [overview.md](./overview.md) - System architecture
- [linux_implementation.md](./linux_implementation.md) - Linux comparison
- [tool_integration.md](./tool_integration.md) - Bash tool integration
