# macOS Sandbox Implementation

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `generateSandboxProfile` (H44) - Generate Seatbelt policy
- `macOSSandboxWrapper` (Tm0) - Wrap command with sandbox-exec
- `startMacOSViolationMonitor` (Pm0) - Monitor sandbox denials
- `SandboxViolationStore` (XKA) - Store violation history
- `buildFileReadPolicy` (K44) - Generate read policy rules
- `buildFileWritePolicy` (D44) - Generate write policy rules

---

## 1. Overview

macOS sandbox uses **Apple's Sandbox.app** (also known as **Seatbelt**), which provides:
- Process-level sandboxing via policy profiles
- Fine-grained control over file, network, and system access
- Real-time violation monitoring via system logs

### Why Seatbelt for macOS?

**What it is:** Seatbelt is Apple's Mandatory Access Control (MAC) system, used internally by Safari, Mail, and App Store apps for sandboxing.

**Why this approach:**
1. **Built-in to macOS** - No external dependencies required (unlike Linux needing bwrap/socat)
2. **Kernel-level enforcement** - Cannot be bypassed by user-space code
3. **Fine-grained policies** - Controls individual syscalls (file-read, network-bind, mach-lookup)
4. **Real-time violation logging** - Denials logged to system console, enabling monitoring

**Alternatives considered:**
1. **Docker/containerd** - Overkill for CLI tool, requires Docker installation
2. **Third-party sandbox tools** - Additional dependencies, less reliable than system tools
3. **User-level restrictions only** - Can be bypassed, not true security boundary

**Trade-offs:**
- **Pro:** Native, fast, no dependencies
- **Con:** macOS-only, requires understanding Seatbelt policy DSL, deprecation risk (sandbox-exec is "deprecated" but still functional)

**Key insight:** Seatbelt policies follow a "default deny" model - start by denying everything, then explicitly allow needed operations. This is safer than "default allow" approaches.

### Command Structure

```
sandbox-exec -p "<seatbelt_policy>" /bin/bash -c "<actual_command>"
```

---

## 2. Sandbox Profile Generation

### generateSandboxProfile (H44)

```javascript
// ============================================
// generateSandboxProfile - Generate complete Seatbelt policy
// Location: chunks.17.mjs:3-29
// ============================================

// ORIGINAL (for source lookup):
function H44({
  readConfig: A,
  writeConfig: Q,
  httpProxyPort: B,
  socksProxyPort: G,
  needsNetworkRestriction: Z,
  allowUnixSockets: I,
  allowAllUnixSockets: Y,
  allowLocalBinding: J,
  logTag: W
}) {
  let X = ["(version 1)", `(deny default (with message "${W}"))`, "", `; LogTag: ${W}`, "",
    "; Essential permissions - based on Chrome sandbox policy",
    "; Process permissions",
    "(allow process-exec)",
    "(allow process-fork)",
    "(allow process-info* (target same-sandbox))",
    "(allow signal (target same-sandbox))",
    "(allow mach-priv-task-port (target same-sandbox))",
    // ... extensive Mach IPC, sysctl, IOKit permissions ...
  ];
  if (X.push("; Network"), !Z) X.push("(allow network*)");
  else {
    if (J) X.push('(allow network-bind (local ip "localhost:*"))'),
           X.push('(allow network-inbound (local ip "localhost:*"))'),
           X.push('(allow network-outbound (local ip "localhost:*"))');
    if (Y) X.push('(allow network* (subpath "/"))');
    else if (I && I.length > 0)
      for (let V of I) {
        let F = NR(V);
        X.push(`(allow network* (subpath ${t$(F)}))`)
      }
    if (B !== void 0) X.push(`(allow network-bind (local ip "localhost:${B}"))`),
           X.push(`(allow network-inbound (local ip "localhost:${B}"))`),
           X.push(`(allow network-outbound (remote ip "localhost:${B}"))`);
    if (G !== void 0) X.push(`(allow network-bind (local ip "localhost:${G}"))`),
           X.push(`(allow network-inbound (local ip "localhost:${G}"))`),
           X.push(`(allow network-outbound (remote ip "localhost:${G}"))`)
  }
  return X.push(""), X.push("; File read"), X.push(...K44(A, W)),
         X.push(""), X.push("; File write"), X.push(...D44(Q, W)), X.join(`\n`)
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
  logTag
}) {
  // ─── POLICY HEADER ───
  let policy = [
    "(version 1)",
    `(deny default (with message "${logTag}"))`,  // Default deny everything
    "",
    `; LogTag: ${logTag}`,  // For violation tracking
    "",
    "; Essential permissions - based on Chrome sandbox policy",
  ];

  // ─── PROCESS PERMISSIONS ───
  policy.push(
    "; Process permissions",
    "(allow process-exec)",           // Execute processes
    "(allow process-fork)",           // Fork child processes
    "(allow process-info* (target same-sandbox))",  // Query own process
    "(allow signal (target same-sandbox))",         // Signal own process
    "(allow mach-priv-task-port (target same-sandbox))",
  );

  // ─── USER PREFERENCES ───
  policy.push(
    "",
    "; User preferences",
    "(allow user-preference-read)",
  );

  // ─── MACH IPC (INTER-PROCESS COMMUNICATION) ───
  // Why these specific services? Each is required for basic CLI functionality:
  //
  // Font/Display: FontObjectsServer, fonts - Required by many CLI tools that output colored text
  // Logging: logd, system.logger - Required for NSLog and os_log (debugging)
  // Notifications: distributed_notifications, notification_center - Required for process coordination
  // Directory Services: opendirectoryd.libinfo, opendirectoryd.membership - Required for user/group lookups
  // Security: trustd.agent, securityd.xpc - Required for SSL/TLS certificate validation
  // Launch Services: coreservices.launchservicesd - Required for file type associations
  // Temp Files: bsd.dirhelper - Required for creating temp directories
  //
  // Why NOT allow mach-lookup wildcard?
  // - Would allow access to ANY Mach service
  // - Security risk: could communicate with arbitrary system services
  // - Chrome sandbox uses similar restricted list
  policy.push(
    "",
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
  );

  // ─── POSIX IPC ───
  policy.push(
    "",
    "; POSIX IPC - shared memory",
    "(allow ipc-posix-shm)",
    "",
    "; POSIX IPC - semaphores for Python multiprocessing",
    "(allow ipc-posix-sem)",
  );

  // ─── IOKIT PERMISSIONS ───
  policy.push(
    "",
    "; IOKit - specific operations only",
    "(allow iokit-open",
    '  (iokit-registry-entry-class "IOSurfaceRootUserClient")',
    '  (iokit-registry-entry-class "RootDomainUserClient")',
    '  (iokit-user-client-class "IOSurfaceSendRight")',
    ")",
    "",
    "; IOKit properties",
    "(allow iokit-get-properties)",
  );

  // ─── SYSCTL PERMISSIONS ───
  policy.push(
    "",
    "; Specific safe system-sockets, doesn't allow network access",
    "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))",
    "",
    "; sysctl - specific sysctls only",
    "(allow sysctl-read",
    // Hardware info
    '  (sysctl-name "hw.activecpu")',
    '  (sysctl-name "hw.memsize")',
    '  (sysctl-name "hw.ncpu")',
    '  (sysctl-name "hw.pagesize")',
    // ... many more sysctl entries ...
    '  (sysctl-name-prefix "machdep.cpu.")',
    ")",
    "",
    "; V8 thread calculations",
    '(allow sysctl-write (sysctl-name "kern.tcsm_enable"))',
  );

  // ─── DEVICE FILE PERMISSIONS ───
  policy.push(
    "",
    "; File I/O on device files",
    '(allow file-ioctl (literal "/dev/null"))',
    '(allow file-ioctl (literal "/dev/zero"))',
    '(allow file-ioctl (literal "/dev/random"))',
    '(allow file-ioctl (literal "/dev/urandom"))',
    '(allow file-ioctl (literal "/dev/dtracehelper"))',
    '(allow file-ioctl (literal "/dev/tty"))',
  );

  // ─── NETWORK PERMISSIONS ───
  policy.push("", "; Network");

  if (!needsNetworkRestriction) {
    // Full network access
    policy.push("(allow network*)");
  } else {
    // Restricted network access
    if (allowLocalBinding) {
      policy.push('(allow network-bind (local ip "localhost:*"))');
      policy.push('(allow network-inbound (local ip "localhost:*"))');
      policy.push('(allow network-outbound (local ip "localhost:*"))');
    }

    if (allowAllUnixSockets) {
      // Allow all Unix sockets
      policy.push('(allow network* (subpath "/"))');
    } else if (allowUnixSockets && allowUnixSockets.length > 0) {
      // Allow specific Unix socket paths
      for (let socketPath of allowUnixSockets) {
        let normalizedPath = normalizePath(socketPath);
        policy.push(`(allow network* (subpath ${JSON.stringify(normalizedPath)}))`);
      }
    }

    // HTTP proxy port
    if (httpProxyPort !== undefined) {
      policy.push(`(allow network-bind (local ip "localhost:${httpProxyPort}"))`);
      policy.push(`(allow network-inbound (local ip "localhost:${httpProxyPort}"))`);
      policy.push(`(allow network-outbound (remote ip "localhost:${httpProxyPort}"))`);
    }

    // SOCKS proxy port
    if (socksProxyPort !== undefined) {
      policy.push(`(allow network-bind (local ip "localhost:${socksProxyPort}"))`);
      policy.push(`(allow network-inbound (local ip "localhost:${socksProxyPort}"))`);
      policy.push(`(allow network-outbound (remote ip "localhost:${socksProxyPort}"))`);
    }
  }

  // ─── FILE PERMISSIONS ───
  policy.push("", "; File read");
  policy.push(...buildFileReadPolicy(readConfig, logTag));

  policy.push("", "; File write");
  policy.push(...buildFileWritePolicy(writeConfig, logTag));

  return policy.join("\n");
}

// Mapping: H44→generateSandboxProfile, A→readConfig, Q→writeConfig, B→httpProxyPort,
//          G→socksProxyPort, Z→needsNetworkRestriction, I→allowUnixSockets,
//          Y→allowAllUnixSockets, J→allowLocalBinding, W→logTag, K44→buildFileReadPolicy,
//          D44→buildFileWritePolicy, NR→normalizePath, t$→JSON.stringify
```

---

## 3. File Permission Policies

### buildFileReadPolicy (K44)

```javascript
// ============================================
// buildFileReadPolicy - Generate Seatbelt file-read rules
// Location: chunks.16.mjs:3551-3562
// ============================================

// ORIGINAL (for source lookup):
function K44(A, Q) {
  if (!A) return ["(allow file-read*)"];
  let B = [];
  B.push("(allow file-read*)");
  for (let G of A.denyOnly || []) {
    let Z = NR(G);
    if (qR(Z)) {
      let I = jxA(Z);
      B.push("(deny file-read*", `  (regex ${t$(I)})`, `  (with message "${Q}"))`)
    } else B.push("(deny file-read*", `  (subpath ${t$(Z)})`, `  (with message "${Q}"))`)
  }
  return B
}

// READABLE (for understanding):
function buildFileReadPolicy(readConfig, logTag) {
  // Default: allow all reads
  if (!readConfig) {
    return ["(allow file-read*)"];
  }

  let rules = [];

  // Start with allow-all, then add denials
  rules.push("(allow file-read*)");

  for (let deniedPath of readConfig.denyOnly || []) {
    let normalizedPath = normalizePath(deniedPath);

    if (isGlobPattern(normalizedPath)) {
      // Convert glob to regex for Seatbelt
      let regexPattern = globToRegex(normalizedPath);  // jxA
      rules.push(
        "(deny file-read*",
        `  (regex ${JSON.stringify(regexPattern)})`,
        `  (with message "${logTag}"))`
      );
    } else {
      // Use subpath for literal paths
      rules.push(
        "(deny file-read*",
        `  (subpath ${JSON.stringify(normalizedPath)})`,
        `  (with message "${logTag}"))`
      );
    }
  }

  return rules;
}

// Mapping: K44→buildFileReadPolicy, A→readConfig, Q→logTag, NR→normalizePath,
//          qR→isGlobPattern, jxA→globToRegex, t$→JSON.stringify
```

### buildFileWritePolicy (D44)

```javascript
// ============================================
// buildFileWritePolicy - Generate Seatbelt file-write rules
// Location: chunks.16.mjs:3565-3589
// ============================================

// ORIGINAL (for source lookup):
function D44(A, Q) {
  if (!A) return ["(allow file-write*)"];
  let B = [], G = C44();
  for (let I of G) {
    let Y = NR(I);
    B.push("(allow file-write*", `  (subpath ${t$(Y)})`, `  (with message "${Q}"))`)
  }
  for (let I of A.allowOnly || []) {
    let Y = NR(I);
    if (qR(Y)) {
      let J = jxA(Y);
      B.push("(allow file-write*", `  (regex ${t$(J)})`, `  (with message "${Q}"))`)
    } else B.push("(allow file-write*", `  (subpath ${t$(Y)})`, `  (with message "${Q}"))`)
  }
  let Z = [...A.denyWithinAllow || [], ...V44()];
  for (let I of Z) {
    let Y = NR(I);
    B.push(...Rm0([Y], Q))
  }
  return B
}

// READABLE (for understanding):
function buildFileWritePolicy(writeConfig, logTag) {
  // Default: allow all writes
  if (!writeConfig) {
    return ["(allow file-write*)"];
  }

  let rules = [];

  // ─── STEP 1: Allow temp directories ───
  let tempDirs = getTempDirsFromEnv();  // C44 - extracts from $TMPDIR
  for (let tempDir of tempDirs) {
    let normalizedPath = normalizePath(tempDir);
    rules.push(
      "(allow file-write*",
      `  (subpath ${JSON.stringify(normalizedPath)})`,
      `  (with message "${logTag}"))`
    );
  }

  // ─── STEP 2: Allow user-specified paths ───
  for (let allowedPath of writeConfig.allowOnly || []) {
    let normalizedPath = normalizePath(allowedPath);

    if (isGlobPattern(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push(
        "(allow file-write*",
        `  (regex ${JSON.stringify(regexPattern)})`,
        `  (with message "${logTag}"))`
      );
    } else {
      rules.push(
        "(allow file-write*",
        `  (subpath ${JSON.stringify(normalizedPath)})`,
        `  (with message "${logTag}"))`
      );
    }
  }

  // ─── STEP 3: Deny specific paths (even within allowed areas) ───
  let denyPaths = [
    ...(writeConfig.denyWithinAllow || []),
    ...getConfigurationDirsToProtect()  // V44 - .git, .bashrc, etc.
  ];

  for (let denyPath of denyPaths) {
    let normalizedPath = normalizePath(denyPath);
    // Add deny rules including unlink protection
    rules.push(...buildDenyWriteRules([normalizedPath], logTag));  // Rm0
  }

  return rules;
}

// Mapping: D44→buildFileWritePolicy, A→writeConfig, Q→logTag, C44→getTempDirsFromEnv,
//          V44→getConfigurationDirsToProtect, Rm0→buildDenyWriteRules
```

---

## 4. Command Wrapping

### macOSSandboxWrapper (Tm0)

```javascript
// ============================================
// macOSSandboxWrapper - Wrap command with sandbox-exec
// Location: chunks.17.mjs:45-80
// ============================================

// ORIGINAL (for source lookup):
function Tm0(A) {
  let {
    command: Q,
    needsNetworkRestriction: B,
    httpProxyPort: G,
    socksProxyPort: Z,
    allowUnixSockets: I,
    allowAllUnixSockets: Y,
    allowLocalBinding: J,
    readConfig: W,
    writeConfig: X,
    binShell: V
  } = A, F = W && W.denyOnly.length > 0;
  if (!B && !F && X === void 0) return Q;
  let D = F44(Q),
    H = H44({
      readConfig: W,
      writeConfig: X,
      httpProxyPort: G,
      socksProxyPort: Z,
      needsNetworkRestriction: B,
      allowUnixSockets: I,
      allowAllUnixSockets: Y,
      allowLocalBinding: J,
      logTag: D
    }),
    C = `export ${RxA(G,Z).join(" ")} && `,
    E = V || "bash",
    U = X44("which", [E], { encoding: "utf8" });
  if (U.status !== 0) throw Error(`Shell '${E}' not found in PATH`);
  let q = U.stdout.trim(),
    w = Mm0.default.quote(["sandbox-exec", "-p", H, q, "-c", C + Q]);
  return kQ(`[Sandbox macOS] Applied restrictions - network: ${!!(G||Z)}, read: ${W?"allowAllExcept"in W?"allowAllExcept":"denyAllExcept":"none"}, write: ${X?"allowAllExcept"in X?"allowAllExcept":"denyAllExcept":"none"}`), w
}

// READABLE (for understanding):
function macOSSandboxWrapper(config) {
  let {
    command,
    needsNetworkRestriction,
    httpProxyPort,
    socksProxyPort,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    readConfig,
    writeConfig,
    binShell
  } = config;

  // ─── CHECK IF SANDBOX NEEDED ───
  let hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;

  // Skip sandbox if no restrictions
  if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === undefined) {
    return command;  // Run without sandbox
  }

  // ─── GENERATE COMMAND TAG ───
  // Used for tracking violations in log stream
  let commandTag = encodeCommandTag(command);  // F44 - CMD64_<base64>_END_<unique>

  // ─── GENERATE SANDBOX POLICY ───
  let sandboxPolicy = generateSandboxProfile({
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    logTag: commandTag
  });

  // ─── BUILD ENVIRONMENT EXPORT ───
  // Set proxy environment variables
  let envExport = `export ${buildProxyEnvironmentVars(httpProxyPort, socksProxyPort).join(" ")} && `;

  // ─── FIND SHELL PATH ───
  let shell = binShell || "bash";
  let whichResult = spawnSync("which", [shell], { encoding: "utf8" });

  if (whichResult.status !== 0) {
    throw Error(`Shell '${shell}' not found in PATH`);
  }

  let shellPath = whichResult.stdout.trim();

  // ─── BUILD FINAL COMMAND ───
  // sandbox-exec -p <policy> <shell> -c <env_export && command>
  let wrappedCommand = shellQuote([
    "sandbox-exec",
    "-p", sandboxPolicy,
    shellPath,
    "-c", envExport + command
  ]);

  log(`[Sandbox macOS] Applied restrictions - network: ${!!(httpProxyPort || socksProxyPort)}, read: ${readConfig ? "restricted" : "none"}, write: ${writeConfig ? "restricted" : "none"}`);

  return wrappedCommand;
}

// Mapping: Tm0→macOSSandboxWrapper, A→config, Q→command, B→needsNetworkRestriction,
//          G→httpProxyPort, Z→socksProxyPort, I→allowUnixSockets, Y→allowAllUnixSockets,
//          J→allowLocalBinding, W→readConfig, X→writeConfig, V→binShell, F44→encodeCommandTag,
//          H44→generateSandboxProfile, RxA→buildProxyEnvironmentVars, X44→spawnSync,
//          Mm0.default.quote→shellQuote
```

---

## 5. Violation Monitoring

### startMacOSViolationMonitor (Pm0)

```javascript
// ============================================
// startMacOSViolationMonitor - Monitor sandbox denials via log stream
// Location: chunks.17.mjs:82-128
// ============================================

// ORIGINAL (for source lookup):
function Pm0(A, Q) {
  let B = /CMD64_(.+?)_END/,
    G = /Sandbox:\s+(.+)$/,
    Z = Q?.["*"] || [],
    I = Q ? Object.entries(Q).filter(([J]) => J !== "*") : [],
    Y = W44("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${Om0}")`, "--style", "compact"]);
  return Y.stdout?.on("data", (J) => {
    let W = J.toString().split(`\n`),
      X = W.find((C) => C.includes("Sandbox:") && C.includes("deny")),
      V = W.find((C) => C.startsWith("CMD64_"));
    if (!X) return;
    let F = X.match(G);
    if (!F?.[1]) return;
    let K = F[1],
      D, H;
    if (V) {
      if (H = V.match(B)?.[1], H) try {
        D = Xm0(H)
      } catch {}
    }
    if (K.includes("mDNSResponder") || K.includes("mach-lookup com.apple.diagnosticd") || K.includes("mach-lookup com.apple.analyticsd")) return;
    if (Q && D) {
      if (Z.length > 0) {
        if (Z.some((E) => K.includes(E))) return
      }
      for (let [C, E] of I)
        if (D.includes(C)) {
          if (E.some((q) => K.includes(q))) return
        }
    }
    A({ line: K, command: D, encodedCommand: H, timestamp: new Date })
  }), Y.stderr?.on("data", (J) => {
    kQ(`[Sandbox Monitor] Log stream stderr: ${J.toString()}`)
  }), Y.on("error", (J) => {
    kQ(`[Sandbox Monitor] Failed to start log stream: ${J.message}`)
  }), Y.on("exit", (J) => {
    kQ(`[Sandbox Monitor] Log stream exited with code: ${J}`)
  }), () => {
    kQ("[Sandbox Monitor] Stopping log monitor"), Y.kill("SIGTERM")
  }
}

// READABLE (for understanding):
function startMacOSViolationMonitor(onViolation, ignoreRules) {
  // ─── REGEX PATTERNS ───
  let commandTagPattern = /CMD64_(.+?)_END/;       // Extract command tag
  let sandboxMessagePattern = /Sandbox:\s+(.+)$/;  // Extract denial message

  // ─── IGNORE RULES ───
  let globalIgnorePatterns = ignoreRules?.["*"] || [];
  let commandSpecificPatterns = ignoreRules
    ? Object.entries(ignoreRules).filter(([key]) => key !== "*")
    : [];

  // ─── START LOG STREAM ───
  // Monitor system logs for sandbox denials ending with unique tag
  let logProcess = spawn("log", [
    "stream",
    "--predicate", `(eventMessage ENDSWITH "${uniqueSandboxTag}")`,  // Om0
    "--style", "compact"
  ]);

  // ─── PROCESS LOG OUTPUT ───
  logProcess.stdout?.on("data", (buffer) => {
    let lines = buffer.toString().split("\n");

    // Find denial line and command tag line
    let denialLine = lines.find(line =>
      line.includes("Sandbox:") && line.includes("deny")
    );
    let tagLine = lines.find(line => line.startsWith("CMD64_"));

    if (!denialLine) return;

    // Extract denial message
    let denialMatch = denialLine.match(sandboxMessagePattern);
    if (!denialMatch?.[1]) return;
    let denialMessage = denialMatch[1];

    // Extract and decode command
    let decodedCommand, encodedTag;
    if (tagLine) {
      encodedTag = tagLine.match(commandTagPattern)?.[1];
      if (encodedTag) {
        try {
          decodedCommand = decodeBase64(encodedTag);  // Xm0
        } catch {}
      }
    }

    // ─── FILTER KNOWN-SAFE DENIALS ───
    // These are system services that commonly trigger false positives
    if (denialMessage.includes("mDNSResponder") ||
        denialMessage.includes("mach-lookup com.apple.diagnosticd") ||
        denialMessage.includes("mach-lookup com.apple.analyticsd")) {
      return;  // Ignore
    }

    // ─── APPLY IGNORE RULES ───
    if (ignoreRules && decodedCommand) {
      // Check global ignore patterns
      if (globalIgnorePatterns.length > 0) {
        if (globalIgnorePatterns.some(pattern => denialMessage.includes(pattern))) {
          return;  // Ignored by global pattern
        }
      }

      // Check command-specific ignore patterns
      for (let [commandPattern, patterns] of commandSpecificPatterns) {
        if (decodedCommand.includes(commandPattern)) {
          if (patterns.some(pattern => denialMessage.includes(pattern))) {
            return;  // Ignored by command-specific pattern
          }
        }
      }
    }

    // ─── REPORT VIOLATION ───
    onViolation({
      line: denialMessage,
      command: decodedCommand,
      encodedCommand: encodedTag,
      timestamp: new Date()
    });
  });

  // ─── ERROR HANDLING ───
  logProcess.stderr?.on("data", (buffer) => {
    log(`[Sandbox Monitor] Log stream stderr: ${buffer.toString()}`);
  });

  logProcess.on("error", (error) => {
    log(`[Sandbox Monitor] Failed to start log stream: ${error.message}`);
  });

  logProcess.on("exit", (code) => {
    log(`[Sandbox Monitor] Log stream exited with code: ${code}`);
  });

  // ─── RETURN UNSUBSCRIBE FUNCTION ───
  return () => {
    log("[Sandbox Monitor] Stopping log monitor");
    logProcess.kill("SIGTERM");
  };
}

// Mapping: Pm0→startMacOSViolationMonitor, A→onViolation, Q→ignoreRules, B→commandTagPattern,
//          G→sandboxMessagePattern, W44→spawn, Om0→uniqueSandboxTag, Xm0→decodeBase64
```

### SandboxViolationStore (XKA)

```javascript
// ============================================
// SandboxViolationStore - Store and track sandbox violations
// Location: chunks.17.mjs:140-174
// ============================================

// ORIGINAL (for source lookup):
class XKA {
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
    let Q = TxA(A);
    return this.violations.filter((B) => B.encodedCommand === Q)
  }
  clear() { this.violations = [], this.notifyListeners() }
  subscribe(A) {
    return this.listeners.add(A), A(this.getViolations()), () => { this.listeners.delete(A) }
  }
  notifyListeners() {
    let A = this.getViolations();
    this.listeners.forEach((Q) => Q(A))
  }
}

// READABLE (for understanding):
class SandboxViolationStore {
  constructor() {
    this.violations = [];      // Recent violations (max 100)
    this.totalCount = 0;       // Total violations ever
    this.maxSize = 100;        // Keep last 100
    this.listeners = new Set(); // Subscribers for updates
  }

  addViolation(violation) {
    this.violations.push(violation);
    this.totalCount++;

    // Trim to max size (keep most recent)
    if (this.violations.length > this.maxSize) {
      this.violations = this.violations.slice(-this.maxSize);
    }

    this.notifyListeners();
  }

  getViolations(count) {
    if (count === undefined) {
      return [...this.violations];  // Return copy of all
    }
    return this.violations.slice(-count);  // Return last N
  }

  getCount() {
    return this.violations.length;
  }

  getTotalCount() {
    return this.totalCount;
  }

  getViolationsForCommand(command) {
    let encodedCommand = encodeCommandTag(command);  // TxA
    return this.violations.filter(v => v.encodedCommand === encodedCommand);
  }

  clear() {
    this.violations = [];
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getViolations());  // Immediate callback with current state

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    let violations = this.getViolations();
    this.listeners.forEach(callback => callback(violations));
  }
}

// Mapping: XKA→SandboxViolationStore, TxA→encodeCommandTag
```

---

## 6. Helper Functions

### Glob to Regex Conversion

```javascript
// ============================================
// globToRegex - Convert glob pattern to regex for Seatbelt
// Location: chunks.16.mjs:3510-3512
// ============================================

// ORIGINAL (for source lookup):
function jxA(A) {
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
    // Escape special regex characters
    .replace(/[.^$+{}()|\\]/g, "\\$&")
    // Handle unclosed brackets
    .replace(/\[([^\]]*?)$/g, "\\[$1")
    // Preserve **/ for later (matches any directories)
    .replace(/\*\*\//g, "__GLOBSTAR_SLASH__")
    // Preserve ** for later (matches anything)
    .replace(/\*\*/g, "__GLOBSTAR__")
    // * matches any characters except /
    .replace(/\*/g, "[^/]*")
    // ? matches single character except /
    .replace(/\?/g, "[^/]")
    // Restore **/ as optional directory match
    .replace(/__GLOBSTAR_SLASH__/g, "(.*/)?")
    // Restore ** as any characters
    .replace(/__GLOBSTAR__/g, ".*")
    + "$";
}

// Examples:
// "*.js" → "^[^/]*\\.js$"
// "src/**/*.ts" → "^src/(.*/)\\?[^/]*\\.ts$"
// "**/*.test.js" → "^(.*/)?[^/]*\\.test\\.js$"

// Mapping: jxA→globToRegex
```

### Command Tag Encoding

```javascript
// ============================================
// encodeCommandTag - Create unique tag for violation tracking
// Location: chunks.16.mjs:3514-3516
// ============================================

// ORIGINAL (for source lookup):
function F44(A) {
  return `CMD64_${TxA(A)}_END_${Om0}`
}

// READABLE (for understanding):
function encodeCommandTag(command) {
  // Format: CMD64_<base64_first_100_chars>_END_<unique_session_tag>
  let encodedCommand = base64Encode(command.slice(0, 100));  // TxA
  return `CMD64_${encodedCommand}_END_${uniqueSandboxTag}`;  // Om0
}

// The unique session tag (Om0) is generated at startup:
// Om0 = `_${Math.random().toString(36).slice(2,11)}_SBX`

// Mapping: F44→encodeCommandTag, TxA→base64Encode, Om0→uniqueSandboxTag
```

---

## 7. Protected Paths

### getConfigurationDirsToProtect (V44)

```javascript
// ============================================
// getConfigurationDirsToProtect - Get sensitive paths to protect
// Location: chunks.16.mjs:3502-3508
// ============================================

// ORIGINAL (for source lookup):
function V44() {
  let A = process.cwd(),
    Q = [];
  for (let B of YKA) Q.push(Jv.resolve(A, B)), Q.push(`**/${B}`);
  for (let B of OxA()) Q.push(Jv.resolve(A, B)), Q.push(`**/${B}/**`);
  return Q.push(Jv.resolve(A, ".git/hooks")), Q.push(Jv.resolve(A, ".git/config")),
         Q.push("**/.git/hooks/**"), Q.push("**/.git/config"), [...new Set(Q)]
}

// READABLE (for understanding):
function getConfigurationDirsToProtect() {
  let cwd = process.cwd();
  let protectedPaths = [];

  // User config files (YKA = config file list)
  // Includes: .gitconfig, .gitmodules, .bashrc, .bash_profile,
  //           .zshrc, .zprofile, .profile, .ripgreprc, .mcp.json
  for (let configFile of CONFIG_FILES) {
    protectedPaths.push(path.resolve(cwd, configFile));  // Absolute path
    protectedPaths.push(`**/${configFile}`);             // Glob pattern
  }

  // Protected directories (OxA() = directory list)
  // Includes: .git, .vscode, .idea, .claude/commands, .claude/agents
  for (let protectedDir of getProtectedDirs()) {
    protectedPaths.push(path.resolve(cwd, protectedDir));
    protectedPaths.push(`**/${protectedDir}/**`);
  }

  // Git hooks and config (special handling)
  protectedPaths.push(path.resolve(cwd, ".git/hooks"));
  protectedPaths.push(path.resolve(cwd, ".git/config"));
  protectedPaths.push("**/.git/hooks/**");
  protectedPaths.push("**/.git/config");

  return [...new Set(protectedPaths)];  // Deduplicate
}

// Mapping: V44→getConfigurationDirsToProtect, YKA→CONFIG_FILES, OxA→getProtectedDirs
```

---

## See Also

- [overview.md](./overview.md) - System architecture
- [configuration.md](./configuration.md) - Configuration structure
- [permissions.md](./permissions.md) - Permission decision flow
- [linux_implementation.md](./linux_implementation.md) - Linux implementation
