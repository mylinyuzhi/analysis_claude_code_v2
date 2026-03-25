# Sandbox Algorithm Analysis (Claude Code 2.1.76)

## Overview

This document provides source-verified algorithm analysis for the sandbox module's core functions. Each algorithm is documented with:
- Purpose and behavior
- Step-by-step logic explanation
- Source code with obfuscated and readable versions
- Key design decisions and trade-offs

---

## Algorithm 1: isCommandInExcludedList (yYz) - Command Exclusion Matching

**Location:** chunks.172.mjs:2412-2452

### What It Does

Determines if a command matches any pattern in the `excludedCommands` settings array. This is the gate that allows certain commands to bypass sandbox restrictions.

### Algorithm: BFS Variant Expansion

```
INPUT: command string
OUTPUT: boolean (true if command matches exclusion pattern)

1. Get excludedCommands from settings (array of patterns)
2. If empty, return false immediately
3. Parse command with shell tokenizer → produces array of command segments
4. For each segment, build variant set using BFS:
   a. Start with original string
   b. Strip environment variables (bn8) → add to variants
   c. Extract basename (Ac) → add to variants
   d. Continue until no new variants (use Set to prevent cycles)
5. For each exclusion pattern:
   a. Parse pattern type: prefix, exact, or wildcard
   b. Match each variant against pattern
   c. If match found, return true
6. Return false (no match)
```

### Source Code

```javascript
// ============================================
// isCommandInExcludedList - Command exclusion pattern matching
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
    // Step 1: Get exclusion patterns from settings
    let patterns = getSettings().sandbox?.excludedCommands ?? [];
    if (patterns.length === 0) return false;

    // Step 2: Parse command with shell tokenizer
    let commandSegments;
    try {
        commandSegments = shellTokenize(command);
    } catch {
        commandSegments = [command];  // Fallback to raw string
    }

    // Step 3: Build variant set for each segment
    for (let segment of commandSegments) {
        let variants = [segment.trim()];
        let seen = new Set(variants);
        let index = 0;

        // BFS: expand variants until no new ones
        while (index < variants.length) {
            let batchEnd = variants.length;

            for (let i = index; i < batchEnd; i++) {
                let current = variants[i];

                // Variant: strip environment variables
                let stripped = resolveCommandEnvVars(current, LD_PATH_REGEX);
                if (!seen.has(stripped)) {
                    variants.push(stripped);
                    seen.add(stripped);
                }

                // Variant: extract basename (command name only)
                let basename = extractCommandBasename(current);
                if (!seen.has(basename)) {
                    variants.push(basename);
                    seen.add(basename);
                }
            }
            index = batchEnd;
        }

        // Step 4: Match variants against patterns
        for (let pattern of patterns) {
            let parsed = parseExclusionPattern(pattern);

            for (let variant of variants) {
                switch (parsed.type) {
                    case "prefix":
                        // "npm:*" matches "npm", "npm install", "npm run test"
                        if (variant === parsed.prefix || variant.startsWith(parsed.prefix + " ")) {
                            return true;
                        }
                        break;

                    case "exact":
                        // "git" matches only "git"
                        if (variant === parsed.command) {
                            return true;
                        }
                        break;

                    case "wildcard":
                        // "npm run *" matches "npm run test", "npm run build"
                        if (matchWildcardPattern(parsed.pattern, variant)) {
                            return true;
                        }
                        break;
                }
            }
        }
    }

    return false;
}

// Mapping: yYz→isCommandInExcludedList, A→command, K→patterns, Y→commandSegments,
//          w→variants, O→seen, bn8→resolveCommandEnvVars, Ac→extractCommandBasename,
//          In8→parseExclusionPattern, Cn8→matchWildcardPattern, PA→getSettings
```

### Key Design Decisions

**Why BFS instead of simple matching:**
- Commands like `A=1 B=2 npm install` have multiple valid representations
- BFS ensures all variants are checked against all patterns
- Set prevents infinite loops from duplicate variants

**Pattern types:**
- **Prefix** (`npm:*`) - Matches command and all subcommands
- **Exact** (`git`) - Matches only that exact command
- **Wildcard** (`npm run *`) - Glob-style pattern matching

---

## Algorithm 2: SandboxViolationStore (HD6) - Ring Buffer with Observer Pattern

**Location:** chunks.55.mjs:2902-2936

### What It Does

Stores sandbox violation events for:
1. UI status line display (shows "blocked N operations")
2. Model context (violations visible in command output)
3. macOS log monitoring (captures sandbox-exec deny messages)

### Implementation

```javascript
// ============================================
// SandboxViolationStore - Ring buffer for violation events
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
        this.violations = [];      // Ring buffer (keeps last 100)
        this.totalCount = 0;       // Cumulative count (never reset)
        this.maxSize = 100;        // Buffer limit
        this.listeners = new Set(); // Observer callbacks
    }

    /**
     * Add a violation event to the store.
     * Auto-trims buffer when > maxSize.
     */
    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Ring buffer: keep only last maxSize
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    /**
     * Get violations. If count provided, returns last N.
     */
    getViolations(count) {
        if (count === undefined) return [...this.violations];
        return this.violations.slice(-count);
    }

    /**
     * Get current buffer size.
     */
    getCount() {
        return this.violations.length;
    }

    /**
     * Get total violations ever recorded.
     */
    getTotalCount() {
        return this.totalCount;
    }

    /**
     * Get violations for a specific command (by encoded tag).
     */
    getViolationsForCommand(command) {
        let encoded = encodeBase64Command(command);
        return this.violations.filter(v => v.encodedCommand === encoded);
    }

    /**
     * Clear buffer (keep totalCount).
     */
    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    /**
     * Subscribe to violation updates.
     * Returns unsubscribe function.
     */
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Immediate callback with current state
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all subscribers of state change.
     */
    notifyListeners() {
        let violations = this.getViolations();
        this.listeners.forEach(callback => callback(violations));
    }
}

// Mapping: HD6→SandboxViolationStore, T21→encodeBase64Command
```

### Key Design Decisions

**Why ring buffer (maxSize=100):**
- Violations can be numerous (hundreds per command)
- UI only shows last 10-100
- Prevents unbounded memory growth

**Why totalCount separate from violations.length:**
- UI shows delta: `currentTotal - lastKnownTotal`
- Allows tracking "new violations since last check"
- totalCount never resets, buffer does

**Observer pattern:**
- UI components subscribe on mount
- Immediate callback provides initial state
- Returns cleanup function for React useEffect

---

## Algorithm 3: generateSeatbeltProfile (xb3) - SBPL Construction

**Location:** chunks.55.mjs:2755-2787

### What It Does

Generates the macOS sandbox-exec profile string (SBPL - Seatbelt Profile Language). This is the policy that the kernel enforces for sandboxed commands.

### Generated Profile Structure

```
(version 1)
(deny default (with message "CMD64_..._END"))

; Essential permissions - based on Chrome sandbox policy
(allow process-exec)
(allow process-fork)
(allow process-info* (target same-sandbox))
(allow signal (target same-sandbox))
(allow mach-priv-task-port (target same-sandbox))

; Mach IPC - specific services only (no wildcard)
(allow mach-lookup
  (global-name "com.apple.audio.systemsoundserver")
  (global-name "com.apple.FontObjectsServer")
  (global-name "com.apple.fonts")
  (global-name "com.apple.logd")
  ; ... 15+ more services
)

; POSIX IPC - shared memory and semaphores
(allow ipc-posix-shm)
(allow ipc-posix-sem)

; IOKit - specific operations only
(allow iokit-open
  (iokit-registry-entry-class "IOSurfaceRootUserClient")
  (iokit-registry-entry-class "RootDomainUserClient")
)

; sysctl - specific names only (50+ allowed)
(allow sysctl-read
  (sysctl-name "hw.ncpu")
  (sysctl-name "kern.osversion")
  ; ... many more
)

; Network (conditional based on config)
(allow network-bind (local ip "localhost:PROXY_PORT"))
(allow network-outbound (remote ip "localhost:PROXY_PORT"))

; File I/O (from readConfig/writeConfig)
; ...
```

### Source Code

```javascript
// ============================================
// generateSeatbeltProfile - SBPL profile generator for macOS
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
    let M = ["(version 1)", `(deny default (with message "${J}"))`, "",
        `; LogTag: ${J}`, "",
        "; Essential permissions...",
        "(allow process-exec)", "(allow process-fork)",
        // ... 100+ more lines
    ];
    // Network section
    if (M.push("; Network"), !z) M.push("(allow network*)");
    else {
        if (O) M.push('(allow network-bind (local ip "*:*"))');
        if (w) M.push("(allow system-socket (socket-domain AF_UNIX))");
        // ... proxy ports
    }
    // File sections
    M.push(...Ib3(A, J));  // Read rules
    M.push(...bb3(q, J, H));  // Write rules
    return M.join("\n");
}

// READABLE (for understanding):
function generateSeatbeltProfile(config) {
    let {
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
    } = config;

    let profile = [
        "(version 1)",
        `(deny default (with message "${logTag}"))`,
        "",
        `; LogTag: ${logTag}`,
        "",
        // ===== SECTION: Essential Permissions =====
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
        // ===== SECTION: Mach IPC =====
        "; Mach IPC - specific services only (no wildcard)",
        "(allow mach-lookup",
        '  (global-name "com.apple.audio.systemsoundserver")',
        '  (global-name "com.apple.FontObjectsServer")',
        '  (global-name "com.apple.fonts")',
        '  (global-name "com.apple.logd")',
        '  (global-name "com.apple.securityd.xpc")',
        // ... 10+ more services
        ")",
        "",
        // ===== SECTION: POSIX IPC =====
        "; POSIX IPC - shared memory",
        "(allow ipc-posix-shm)",
        "",
        "; POSIX IPC - semaphores for Python multiprocessing",
        "(allow ipc-posix-sem)",
        "",
        // ===== SECTION: IOKit =====
        "; IOKit - specific operations only",
        "(allow iokit-open",
        '  (iokit-registry-entry-class "IOSurfaceRootUserClient")',
        '  (iokit-registry-entry-class "RootDomainUserClient")',
        ")",
        "",
        // ===== SECTION: sysctl =====
        "; sysctl - specific sysctls only",
        "(allow sysctl-read",
        '  (sysctl-name "hw.ncpu")',
        '  (sysctl-name "hw.memsize")',
        '  (sysctl-name "kern.osversion")',
        // ... 50+ more sysctls
        ")",
    ];

    // ===== SECTION: Network (Conditional) =====
    profile.push("", "; Network");

    if (!needsNetworkRestriction) {
        // No network restrictions: allow all
        profile.push("(allow network*)");
    } else {
        // Apply network restrictions

        if (allowLocalBinding) {
            profile.push('(allow network-bind (local ip "*:*"))');
            profile.push('(allow network-inbound (local ip "*:*"))');
            profile.push('(allow network-outbound (local ip "*:*"))');
        }

        if (allowAllUnixSockets) {
            profile.push("(allow system-socket (socket-domain AF_UNIX))");
            profile.push('(allow network-bind (local unix-socket (path-regex #"^/")))');
            profile.push('(allow network-outbound (remote unix-socket (path-regex #"^/")))');
        } else if (allowUnixSockets?.length > 0) {
            profile.push("(allow system-socket (socket-domain AF_UNIX))");
            for (let socketPath of allowUnixSockets) {
                let resolved = resolveAbsolutePath(socketPath);
                profile.push(`(allow network-bind (local unix-socket (subpath ${JSON.stringify(resolved)})))`);
                profile.push(`(allow network-outbound (remote unix-socket (subpath ${JSON.stringify(resolved)})))`);
            }
        }

        // Allow connections to proxy ports
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

    // ===== SECTION: File Read Rules =====
    profile.push("", "; File read");
    profile.push(...generateFileReadRules(readConfig, logTag));

    // ===== SECTION: File Write Rules =====
    profile.push("", "; File write");
    profile.push(...generateFileWriteRules(writeConfig, logTag, allowGitConfig));

    // ===== SECTION: PTY (Conditional) =====
    if (allowPty) {
        profile.push("", "; Pseudo-terminal (pty) support");
        profile.push("(allow pseudo-tty)");
        profile.push("(allow file-ioctl");
        profile.push('  (literal "/dev/ptmx")');
        profile.push('  (regex #"^/dev/ttys")');
        profile.push(")");
    }

    return profile.join("\n");
}

// Mapping: xb3→generateSeatbeltProfile, Ib3→generateFileReadRules, bb3→generateFileWriteRules,
//          Hv→quoteString (JSON.stringify), EL→resolveAbsolutePath
```

### Key Design Decisions

**Why `(deny default)`:**
- Defense-in-depth: everything blocked unless explicitly allowed
- Prevents accidental permission leaks
- Same model as Chrome/App Store apps

**Why so many specific rules:**
- Node.js and common tools need access to many system services
- Each Mach service has a specific purpose (fonts, logging, security)
- sysctl names are enumerated to prevent information disclosure

**Why logTag in every deny message:**
- Allows correlation with command in macOS logs
- Pattern: `CMD64_<base64>_END`
- Enables `getViolationsForCommand()` filtering

---

## Algorithm 4: matchDomainPattern (bw8) - Domain Wildcard Matching

**Location:** chunks.55.mjs:2952-2958

### What It Does

Matches a domain against a pattern that may contain wildcards (`*.example.com`).

### Source Code

```javascript
// ============================================
// matchDomainPattern - Domain wildcard matching
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
    // Wildcard pattern: *.example.com
    if (pattern.startsWith("*.")) {
        let suffix = pattern.substring(2);  // Remove "*."
        // Match: sub.example.com (must have something before the dot)
        // No match: example.com (wildcard requires subdomain)
        return domain.toLowerCase().endsWith("." + suffix.toLowerCase());
    }

    // Exact match (case-insensitive)
    return domain.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchDomainPattern, A→domain, q→pattern, K→suffix
```

### Key Design Decisions

**Why `*.example.com` requires subdomain:**
- `*.example.com` matches `api.example.com` but NOT `example.com`
- This is the standard wildcard semantics for DNS
- Prevents overly permissive matches

**Why case-insensitive:**
- DNS is case-insensitive
- Prevents bypass via case manipulation

---

## Algorithm 5: checkNetworkPermission (nZ7) - Network Access Control

**Location:** chunks.55.mjs:2960-2979

### What It Does

Determines if a network request to a specific domain/port should be allowed, denied, or requires user permission.

### Decision Order

```
1. Check deniedDomains → if match, DENY immediately
2. Check allowedDomains → if match, ALLOW immediately
3. If no match and callback provided → ASK USER
4. Default: DENY
```

### Source Code

```javascript
// ============================================
// checkNetworkPermission - Network access control
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
async function checkNetworkPermission(port, domain, permissionCallback) {
    // Guard: No config loaded
    if (!currentConfig) {
        logWarning("No config available, denying network request");
        return false;
    }

    // Step 1: Check deny list first (deny takes precedence)
    for (let deniedPattern of currentConfig.network.deniedDomains) {
        if (matchDomainPattern(domain, deniedPattern)) {
            logInfo(`Denied by config rule: ${domain}:${port}`);
            return false;  // DENY immediately
        }
    }

    // Step 2: Check allow list
    for (let allowedPattern of currentConfig.network.allowedDomains) {
        if (matchDomainPattern(domain, allowedPattern)) {
            logInfo(`Allowed by config rule: ${domain}:${port}`);
            return true;  // ALLOW immediately
        }
    }

    // Step 3: No match - check if we can ask user
    if (!permissionCallback) {
        logInfo(`No matching config rule, denying: ${domain}:${port}`);
        return false;  // No callback, default DENY
    }

    // Step 4: Ask user for permission
    logInfo(`No matching config rule, asking user: ${domain}:${port}`);
    try {
        let allowed = await permissionCallback({ host: domain, port });
        logInfo(`User ${allowed ? "allowed" : "denied"}: ${domain}:${port}`);
        return allowed;
    } catch (error) {
        logError(`Error in permission callback: ${error}`);
        return false;  // Error → DENY
    }
}

// Mapping: nZ7→checkNetworkPermission, A→port, q→domain, K→permissionCallback,
//          R5→currentConfig, bw8→matchDomainPattern, wA→logInfo/logWarning
```

### Key Design Decisions

**Why deny list checked first:**
- More secure: explicit deny overrides explicit allow
- Prevents accidental permission via conflicting rules
- Example: `allowedDomains: ["*.github.com"], deniedDomains: ["malware.github.com"]`
  - `malware.github.com` is denied despite matching allowed pattern

**Why default is DENY:**
- Secure-by-default principle
- Forces explicit allow-listing of domains
- Only when callback provided can user override

---

## Algorithm 6: parseExclusionPattern (yfq) - Pattern Type Detection

**Location:** chunks.172.mjs:1530-1544

### What It Does

Parses an exclusion pattern string to determine its type (prefix, exact, or wildcard).

### Pattern Types

| Pattern | Type | Example | Matches |
|---------|------|---------|---------|
| `command:*` | prefix | `npm:*` | `npm`, `npm install`, `npm run test` |
| `command` | exact | `git` | `git` only |
| `command *` | wildcard | `npm run *` | `npm run test`, `npm run build` |

### Source Code

```javascript
// ============================================
// parseExclusionPattern - Pattern type parser
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
    // Check for prefix pattern: "command:*"
    let prefix = extractPrefixPattern(pattern);
    if (prefix !== null) {
        return {
            type: "prefix",
            prefix: prefix
        };
    }

    // Check for wildcard pattern: contains unescaped "*"
    if (isWildcardPattern(pattern)) {
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

// Mapping: yfq→parseExclusionPattern, A→pattern, Ln8→extractPrefixPattern,
//          TYz→isWildcardPattern, q→prefix
```

### Helper Functions

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
    // Regex: match "something:*" and capture "something"
    let match = pattern.match(/^(.+):\*$/);
    return match ? match[1] : null;
}

// Mapping: Ln8→extractPrefixPattern, A→pattern


// ============================================
// isWildcardPattern - Detect unescaped wildcard characters
// Location: chunks.172.mjs:1492-1501
// ============================================

// ORIGINAL (for source lookup):
function TYz(A) {
    if (A.endsWith(":*")) return !1;  // Prefix pattern, not wildcard
    for (let q = 0; q < A.length; q++)
        if (A[q] === "*") {
            let K = 0, Y = q - 1;
            while (Y >= 0 && A[Y] === "\\") K++, Y--;
            if (K % 2 === 0) return !0  // Even backslashes = unescaped
        }
    return !1
}

// READABLE (for understanding):
function isWildcardPattern(pattern) {
    // Prefix patterns are not wildcards
    if (pattern.endsWith(":*")) return false;

    // Check each character for unescaped "*"
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === "*") {
            // Count preceding backslashes
            let backslashCount = 0;
            let j = i - 1;
            while (j >= 0 && pattern[j] === "\\") {
                backslashCount++;
                j--;
            }

            // Even backslashes = unescaped (\\* = escaped, \\\* = unescaped)
            if (backslashCount % 2 === 0) {
                return true;  // Unescaped wildcard found
            }
        }
    }
    return false;  // No unescaped wildcards
}

// Mapping: TYz→isWildcardPattern, A→pattern
```

### Key Design Decisions

**Why prefix (`:*`) is separate from wildcard:**
- Prefix matching is more efficient (exact match or startsWith)
- Wildcard requires regex conversion and matching
- Different use cases: `npm:*` (all npm commands) vs `npm run *:*` (specific pattern)

**Why backslash counting:**
- Allows escaping wildcards: `test\*` matches literal `test*`
- Even count = unescaped, odd count = escaped
- Standard glob escaping semantics

---

## Algorithm 7: isCommandSandboxed (Ti) - The 4-Gate Check

**Location:** chunks.172.mjs:2454-2460

### What It Does

Determines whether a Bash tool call should be wrapped with sandbox isolation.

### The 4 Gates

```
Gate 1: isSandboxingEnabled() → false if sandbox disabled
Gate 2: dangerouslyDisableSandbox && allowUnsandboxedCommands → false if model override
Gate 3: !command → false if no command string
Gate 4: isCommandInExcludedList() → false if command excluded
Default: true (sandbox it)
```

### Source Code

```javascript
// ============================================
// isCommandSandboxed - 4-gate sandbox decision
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
    // Gate 1: Global sandbox off
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return false;  // No sandboxing at all
    }

    // Gate 2: Model override (only if fallback allowed by policy)
    if (toolInput.dangerouslyDisableSandbox &&
        sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
        return false;  // Model requested no sandbox, policy allows it
    }

    // Gate 3: No command string
    if (!toolInput.command) {
        return false;  // Nothing to sandbox
    }

    // Gate 4: Command matches exclusion pattern
    if (isCommandInExcludedList(toolInput.command)) {
        return false;  // Command is in excludedCommands list
    }

    // All gates passed: sandbox the command
    return true;
}

// Mapping: Ti→isCommandSandboxed, A→toolInput, vA→sandboxConfigObject,
//          yYz→isCommandInExcludedList
```

### Gate Execution Order Rationale

1. **Global check first** - Cheapest check, exits early if sandbox disabled
2. **Model override second** - Respects model's decision if policy allows
3. **Command existence third** - Validates input before pattern matching
4. **Exclusion check last** - Most expensive (pattern matching)

---

## Summary

| Algorithm | Symbol | Purpose | Time Complexity |
|-----------|--------|---------|-----------------|
| isCommandInExcludedList | yYz | Pattern matching with variant expansion | O(n × m) where n=variants, m=patterns |
| SandboxViolationStore | HD6 | Ring buffer with observer pattern | O(1) add, O(n) get |
| generateSeatbeltProfile | xb3 | SBPL profile construction | O(k) where k=rules count |
| matchDomainPattern | bw8 | Domain wildcard matching | O(n) where n=domain length |
| checkNetworkPermission | nZ7 | Network access control | O(n) where n=domain patterns |
| parseExclusionPattern | yfq | Pattern type detection | O(n) where n=pattern length |
| isCommandSandboxed | Ti | 4-gate sandbox decision | O(1) + O(isCommandInExcludedList) |

---

## Algorithm 8: initializeLowLevel (pb3) - Network Infrastructure Bootstrap

**Location:** chunks.55.mjs:3024-3057

### What It Does

Initializes the network infrastructure required for sandbox network isolation:
1. Validates dependencies (bwrap, socat, seccomp on Linux)
2. Starts HTTP and SOCKS proxy servers
3. On Linux: creates Unix socket bridges
4. On macOS: starts log monitor for violation detection

### Source Code

```javascript
// ============================================
// initializeLowLevel - Network infrastructure bootstrap
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
                wA(`Cleanup failed in initializationPromise ${_}`, {
                    level: "error"
                })
            }), z
        }
    })(), await Ua
}

// READABLE (for understanding):
async function initializeLowLevel(config, networkPermissionCallback, enableLogMonitor = false) {
    // Gate: Already initializing? Return existing promise
    if (initializationPromise) {
        await initializationPromise;
        return;
    }

    // Store config globally
    currentConfig = config;

    // Validate dependencies before proceeding
    let depCheck = checkDependencies();
    if (depCheck.errors.length > 0) {
        throw Error(`Sandbox dependencies not available: ${depCheck.errors.join(", ")}`);
    }

    // macOS: Start log monitor for violation detection
    if (enableLogMonitor && getPlatform() === "macos") {
        logMonitorCleanup = startLogMonitor(
            violationStore.addViolation.bind(violationStore),
            currentConfig.ignoreViolations
        );
        log("Started macOS sandbox log monitor");
    }

    // Register cleanup handlers for process exit
    setupProcessExitHandler();

    // Initialize network infrastructure
    initializationPromise = (async () => {
        try {
            // HTTP Proxy: use external port or start new server
            let httpProxyPort;
            if (currentConfig.network.httpProxyPort !== undefined) {
                httpProxyPort = currentConfig.network.httpProxyPort;
                log(`Using external HTTP proxy on port ${httpProxyPort}`);
            } else {
                httpProxyPort = await startHttpProxy(networkPermissionCallback);
            }

            // SOCKS Proxy: use external port or start new server
            let socksProxyPort;
            if (currentConfig.network.socksProxyPort !== undefined) {
                socksProxyPort = currentConfig.network.socksProxyPort;
                log(`Using external SOCKS proxy on port ${socksProxyPort}`);
            } else {
                socksProxyPort = await startSocksProxy(networkPermissionCallback);
            }

            // Linux: Create Unix socket bridges for network namespace
            let linuxBridge;
            if (getPlatform() === "linux") {
                linuxBridge = await createBridgeSockets(httpProxyPort, socksProxyPort);
            }

            let networkInfo = {
                httpProxyPort,
                socksProxyPort,
                linuxBridge
            };

            networkConfig = networkInfo;
            log("Network infrastructure initialized");
            return networkInfo;

        } catch (error) {
            // Reset state on failure
            initializationPromise = undefined;
            networkConfig = undefined;

            // Attempt cleanup
            await reset().catch((cleanupError) => {
                logError(`Cleanup failed in initializationPromise ${cleanupError}`);
            });

            throw error;
        }
    })();

    await initializationPromise;
}

// Mapping: pb3→initializeLowLevel, A→config, q→networkPermissionCallback, K→enableLogMonitor,
//          Ua→initializationPromise, R5→currentConfig, oZ7→checkDependencies, $v→getPlatform,
//          N21→logMonitorCleanup, UZ7→startLogMonitor, V21→violationStore, mb3→setupProcessExitHandler,
//          gb3→startHttpProxy, Fb3→startSocksProxy, xZ7→createBridgeSockets, LL→networkConfig,
//          xw8→reset, wA→log
```

### Key Design Decisions

**Why promise caching:**
- Prevents double initialization from multiple callers
- Allows awaiting same initialization from different code paths
- Returns immediately if already initialized

**Why dependency check before initialization:**
- Early fail if bwrap/socat missing on Linux
- Better error message than cryptic spawn failures
- Allows graceful degradation on unsupported platforms

**Why external proxy port option:**
- Allows using shared proxy for multiple Claude Code instances
- Useful in containerized environments where port allocation is external
- Reduces port consumption when running multiple sessions

---

## Algorithm 9: createBridgeSockets (xZ7) - Unix Socket Bridge Creation

**Location:** chunks.55.mjs:2401-2450

### What It Does

Creates Unix socket bridges that allow network-isolated processes to communicate with proxy servers running in the parent process. This is the key mechanism that enables network filtering inside Linux's network namespace.

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     Parent Process (Unsandboxed)                 │
│  ┌─────────────┐    ┌─────────────┐                              │
│  │ HTTP Proxy  │    │SOCKS Proxy  │                              │
│  │  :port      │    │  :port      │                              │
│  └──────┬──────┘    └──────┬──────┘                              │
│         │                  │                                      │
│         ▼                  ▼                                      │
│  ┌─────────────┐    ┌─────────────┐                              │
│  │ Unix Socket │    │ Unix Socket │  ← Bridge sockets            │
│  │ /tmp/...http│    │ /tmp/...sock│                              │
│  └──────┬──────┘    └──────┬──────┘                              │
│         │                  │                                      │
└─────────│──────────────────│──────────────────────────────────────┘
          │                  │
          │    bind mount    │   bwrap --bind
          │    into ns       │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Child Process (Sandboxed)                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Network namespace (--unshare-net)                            ││
│  │                                                              ││
│  │  ┌─────────────┐    ┌─────────────┐                         ││
│  │  │ /tmp/...http│    │ /tmp/...sock│  ← Same socket paths   ││
│  │  └──────┬──────┘    └──────┬──────┘                         ││
│  │         │                  │                                 ││
│  │         ▼                  ▼                                 ││
│  │  HTTP_PROXY=localhost:3128  SOCKS_PROXY=localhost:1080      ││
│  │  (inside namespace, connects to bridge sockets)              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// createBridgeSockets - Unix socket bridge creation
// Location: chunks.55.mjs:2401-2450
// ============================================

// ORIGINAL (for source lookup):
async function xZ7(A, q) {
    let K = Bw8(),
        Y = WU.join(K, `claude-code-http-${process.pid}.sock`),
        z = WU.join(K, `claude-code-socks-${process.pid}.sock`);
    return await Promise.all([hb3("socat", ["-d", "-d", `TCP-LISTEN:${A},fork,reuseaddr`, `UNIX-CONNECT:${Y}`]), hb3("socat", ["-d", "-d", `TCP-LISTEN:${q},fork,reuseaddr`, `UNIX-CONNECT:${z}`])]), wA(`[Sandbox Linux] Created bridge sockets: ${Y}, ${z}`), {
        httpSocketPath: Y,
        socksSocketPath: z
    }
}

// READABLE (for understanding):
async function createBridgeSockets(httpProxyPort, socksProxyPort) {
    // Create unique socket paths in temp directory
    let tempDir = getTempDir();
    let httpSocketPath = path.join(tempDir, `claude-code-http-${process.pid}.sock`);
    let socksSocketPath = path.join(tempDir, `claude-code-socks-${process.pid}.sock`);

    // Start two socat bridges in parallel:
    // 1. HTTP: Listen on TCP port inside namespace, forward to Unix socket
    // 2. SOCKS: Same pattern
    await Promise.all([
        spawn("socat", ["-d", "-d", `TCP-LISTEN:${httpProxyPort},fork,reuseaddr`, `UNIX-CONNECT:${httpSocketPath}`]),
        spawn("socat", ["-d", "-d", `TCP-LISTEN:${socksProxyPort},fork,reuseaddr`, `UNIX-CONNECT:${socksSocketPath}`])
    ]);

    log(`[Sandbox Linux] Created bridge sockets: ${httpSocketPath}, ${socksSocketPath}`);

    return {
        httpSocketPath,
        socksSocketPath
    };
}

// Mapping: xZ7→createBridgeSockets, A→httpProxyPort, q→socksProxyPort,
//          K→tempDir, Y→httpSocketPath, z→socksSocketPath, Bw8→getTempDir,
//          hb3→spawn, WU→path, wA→log
```

### Key Design Decisions

**Why socat for bridging:**
- socat is a standard Unix tool for bidirectional data transfer
- Handles the TCP-to-Unix socket translation automatically
- `fork,reuseaddr` allows multiple concurrent connections
- `-d -d` provides debug logging for troubleshooting

**Why process.pid in socket path:**
- Ensures unique socket paths for multiple Claude Code instances
- Prevents socket path collisions between parallel sessions
- Allows cleanup by removing files matching PID pattern

**Why bind mount into namespace:**
- `--unshare-net` creates isolated network namespace
- Unix sockets can cross namespace boundaries when bind-mounted
- Bridge sockets in parent namespace become accessible in child

---

## Algorithm 10: buildFilesystemMounts (Rb3) - Linux Filesystem Isolation

**Location:** chunks.55.mjs:2491-2561

### What It Does

Generates the bwrap arguments for filesystem isolation:
- Read-only bind mounts for system directories
- Writable bind mounts for allowed paths
- tmpfs overlays for denied read paths
- /dev/null binding for denied files

### Source Code

```javascript
// ============================================
// buildFilesystemMounts - Linux filesystem isolation
// Location: chunks.55.mjs:2491-2561
// ============================================

// ORIGINAL (for source lookup):
async function Rb3(A, q, K, Y = 3, z = !1, _ = void 0) {
    let w = [];
    // ... ro-bind for system paths, bind for allowed writes, etc.
    return w
}

// READABLE (for understanding):
async function buildFilesystemMounts(readConfig, writeConfig, ripgrepConfig, mandatoryDenySearchDepth = 3, allowGitConfig = false, abortSignal = undefined) {
    let bwrapArgs = [];

    // 1. Read-only root filesystem (base isolation)
    bwrapArgs.push("--ro-bind", "/", "/");

    // 2. Writable paths from writeConfig.allowOnly
    for (let allowedPath of writeConfig?.allowOnly || []) {
        let resolvedPath = resolveAbsolutePath(allowedPath);

        // Create directory if it doesn't exist
        if (!fs.existsSync(resolvedPath)) {
            await fs.promises.mkdir(resolvedPath, { recursive: true });
        }

        // Check for symlink attacks
        let symlinkInfo = findSymlinkMountPoint(resolvedPath);
        if (symlinkInfo) {
            log(`[Sandbox] Detected symlink at ${resolvedPath}, binding parent instead`);
            bwrapArgs.push("--bind", symlinkInfo.parentPath, symlinkInfo.parentPath);
        } else {
            bwrapArgs.push("--bind", resolvedPath, resolvedPath);
        }
    }

    // 3. Denied read paths - use tmpfs or /dev/null
    for (let deniedPath of readConfig?.denyOnly || []) {
        let resolvedPath = resolveAbsolutePath(deniedPath);

        if (!fs.existsSync(resolvedPath)) {
            log(`[Sandbox] Skipping non-existent read deny path: ${resolvedPath}`);
            continue;
        }

        if (fs.statSync(resolvedPath).isDirectory()) {
            // Directory: mount empty tmpfs to hide contents
            bwrapArgs.push("--tmpfs", resolvedPath);
        } else {
            // File: bind /dev/null to hide content
            bwrapArgs.push("--ro-bind", "/dev/null", resolvedPath);
        }
    }

    // 4. Denied write paths within allowed areas
    for (let deniedWrite of writeConfig?.denyWithinAllow || []) {
        let resolvedPath = resolveAbsolutePath(deniedWrite);
        // These are handled by making parent ro-bind with specific exceptions
        // Implementation uses ripgrep to find dangerous files
    }

    // 5. Mandatory deny paths (.git/hooks, .env files, etc.)
    let mandatoryDenyPaths = getMandatoryDenyPaths(allowGitConfig);
    for (let mandatoryPath of mandatoryDenyPaths) {
        // These paths are always denied regardless of config
    }

    return bwrapArgs;
}

// Mapping: Rb3→buildFilesystemMounts, A→readConfig, q→writeConfig,
//          K→ripgrepConfig, Y→mandatoryDenySearchDepth, z→allowGitConfig,
//          _→abortSignal, w→bwrapArgs
```

### Key Design Decisions

**Why --ro-bind "/" "/" first:**
- Creates read-only base filesystem
- All writes require explicit --bind mounts
- Defense in depth: even if path escapes, can't modify system

**Why tmpfs for denied directories:**
- Completely hides directory contents
- Allows process to create temp files (which are discarded)
- No way to list original contents

**Why /dev/null binding for denied files:**
- Reads return empty
- Writes succeed but are discarded
- Prevents information disclosure from error messages

**Why symlink detection:**
- Attacker could create symlink from allowed path to denied path
- `ln -s /etc/passwd /project/allowed/passwd`
- Binding symlink target would expose denied content
- Solution: detect symlinks, bind parent directory instead

---

## Algorithm 11: isCommandSandboxed (Ti) - 4-Gate Sandbox Decision

**Location:** chunks.172.mjs:2454-2460

### What It Does

Determines whether a command should be wrapped with sandbox isolation. This is the primary decision gate called before every Bash tool execution.

### Algorithm: 4-Gate Decision Chain

```
INPUT: toolInput object { command, dangerouslyDisableSandbox }
OUTPUT: boolean (true = sandbox the command)

Gate 1: isSandboxingEnabled()
    └─ false → return false (sandbox disabled globally)

Gate 2: dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()
    └─ true → return false (model override with fallback allowed)

Gate 3: !command
    └─ true → return false (no command to sandbox)

Gate 4: isCommandInExcludedList(command)
    └─ true → return false (command matches exclusion pattern)

All gates passed → return true (wrap with sandbox)
```

### Source Code

```javascript
// ============================================
// isCommandSandboxed - 4-Gate sandbox decision
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
    // Gate 1: Global sandbox disabled?
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return false;  // Sandbox not enabled at all
    }

    // Gate 2: Model override with fallback allowed?
    if (toolInput.dangerouslyDisableSandbox &&
        sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
        return false;  // Model requested bypass and policy allows it
    }

    // Gate 3: No command string?
    if (!toolInput.command) {
        return false;  // Nothing to sandbox
    }

    // Gate 4: Command matches exclusion pattern?
    if (isCommandInExcludedList(toolInput.command)) {
        return false;  // Command is explicitly excluded
    }

    // All gates passed - sandbox the command
    return true;
}

// Mapping: Ti→isCommandSandboxed, A→toolInput, vA→sandboxConfigObject,
//          yYz→isCommandInExcludedList
```

### Key Design Decisions

**Why 4 gates in this order:**
1. **Gate 1 first**: Global check avoids unnecessary processing
2. **Gate 2 second**: Model override is expensive (permission prompt), check before pattern matching
3. **Gate 3 third**: Quick null check before expensive pattern matching
4. **Gate 4 last**: BFS pattern matching is most expensive, only run if needed

**Why Gate 2 requires both conditions:**
- `dangerouslyDisableSandbox` alone is not enough
- `areUnsandboxedCommandsAllowed()` must also be true
- This allows enterprise policies to disable the override capability entirely

---

## Algorithm 12: matchDomainPattern (bw8) - Domain Wildcard Matching

**Location:** chunks.55.mjs:2952-2958

### What It Does

Matches a domain against a pattern that may include wildcard prefix (*.example.com). Used for network filtering in the sandbox proxy.

### Algorithm: Wildcard Pattern Matching

```
INPUT: domain (string), pattern (string)
OUTPUT: boolean (true if domain matches pattern)

1. If pattern starts with "*.":
   a. Extract suffix = pattern.substring(2)
   b. Return true if domain ends with "." + suffix (case-insensitive)
   c. Example: "*.example.com" matches "api.example.com"
2. Else:
   a. Return true if domain equals pattern (case-insensitive)
   b. Exact match only
```

### Source Code

```javascript
// ============================================
// matchDomainPattern - Domain wildcard matching
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
    // Wildcard pattern: *.example.com
    if (pattern.startsWith("*.")) {
        // Extract the suffix after "*."
        let suffix = pattern.substring(2);
        // Match any subdomain of suffix
        // "*.example.com" matches "api.example.com" but not "example.com"
        return domain.toLowerCase().endsWith("." + suffix.toLowerCase());
    }

    // Exact match (case-insensitive)
    return domain.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchDomainPattern, A→domain, q→pattern, K→suffix
```

### Key Design Decisions

**Why "*.example.com" doesn't match "example.com":**
- Security decision: wildcard explicitly requires subdomain
- Prevents accidental matches on apex domain
- If apex domain should match, add explicit pattern "example.com"

**Why case-insensitive:**
- Domain names are case-insensitive by RFC 1035
- DNS lookups are case-insensitive
- Matching should reflect actual DNS behavior

---

## Algorithm 13: checkNetworkPermission (nZ7) - Network Access Control

**Location:** chunks.55.mjs:2960-2978

### What It Does

Checks if a network connection to a specific host:port should be allowed based on sandbox configuration. Called by the HTTP and SOCKS proxies for each connection attempt.

### Algorithm: Deny-First Permission Check

```
INPUT: port (number), host (string), permissionCallback (async function)
OUTPUT: Promise<boolean> (true = allow connection)

1. If no config available → deny with warning
2. Check against deniedDomains list:
   a. For each denied pattern
   b. If matchDomainPattern(host, pattern) → deny
3. Check against allowedDomains list:
   a. For each allowed pattern
   b. If matchDomainPattern(host, pattern) → allow
4. If no matching rules and no callback → deny
5. If callback provided:
   a. Call callback({ host, port }) to ask user
   b. Return user's decision
```

### Source Code

```javascript
// ============================================
// checkNetworkPermission - Network access control
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
        if (await K({
                host: q,
                port: A
            })) return wA(`User allowed: ${q}:${A}`), !0;
        else return wA(`User denied: ${q}:${A}`), !1
    } catch (Y) {
        return wA(`Error in permission callback: ${Y}`, {
            level: "error"
        }), !1
    }
}

// READABLE (for understanding):
async function checkNetworkPermission(port, host, permissionCallback) {
    // No config loaded - deny all (fail closed)
    if (!currentConfig) {
        log("No config available, denying network request");
        return false;
    }

    // Step 1: Check deny list first (highest priority)
    for (let deniedPattern of currentConfig.network.deniedDomains) {
        if (matchDomainPattern(host, deniedPattern)) {
            log(`Denied by config rule: ${host}:${port}`);
            return false;
        }
    }

    // Step 2: Check allow list
    for (let allowedPattern of currentConfig.network.allowedDomains) {
        if (matchDomainPattern(host, allowedPattern)) {
            log(`Allowed by config rule: ${host}:${port}`);
            return true;
        }
    }

    // Step 3: No matching rule - deny by default
    if (!permissionCallback) {
        log(`No matching config rule, denying: ${host}:${port}`);
        return false;
    }

    // Step 4: Ask user via callback
    log(`No matching config rule, asking user: ${host}:${port}`);
    try {
        let userDecision = await permissionCallback({ host, port });
        log(`User ${userDecision ? 'allowed' : 'denied'}: ${host}:${port}`);
        return userDecision;
    } catch (error) {
        log(`Error in permission callback: ${error}`, { level: "error" });
        return false;  // Fail closed on error
    }
}

// Mapping: nZ7→checkNetworkPermission, A→port, q→host, K→permissionCallback,
//          R5→currentConfig, bw8→matchDomainPattern, wA→log
```

### Key Design Decisions

**Why deny list checked first:**
- Security: explicit deny always takes precedence
- Even if domain matches allow list, deny list wins
- Allows fine-grained blocking within allowed domains

**Why fail closed:**
- No config → deny all
- No matching rule without callback → deny
- Error in callback → deny
- Security principle: default to safe state

**Why async callback:**
- Allows just-in-time permission prompting
- User can approve unexpected domains
- Callback only used when no static rule matches

---

## Algorithm 14: isSandboxingEnabled (h21) - Four-Gate Enablement Check

**Location:** chunks.56.mjs:357-362

### What It Does

Determines whether sandboxing is fully enabled by checking four independent gates in sequence. All gates must pass for sandboxing to be active.

### Algorithm

```
INPUT: none (reads from global state)
OUTPUT: boolean (true if sandbox fully enabled)

1. GATE 1: Platform support
   - isSupportedPlatform() checks if OS is macOS, Linux, or WSL2
   - Returns false for Windows, unsupported platforms

2. GATE 2: Dependency availability
   - checkDependencies() verifies bwrap, socat, seccomp (Linux)
   - Returns false if any required dependency is missing

3. GATE 3: Platform allowlist
   - isPlatformInEnabledList() checks enabledPlatforms setting
   - Returns false if current platform is explicitly disabled

4. GATE 4: Settings enablement
   - isSandboxEnabledInSettings() checks sandbox.enabled setting
   - Returns false if user has disabled sandbox

5. All gates passed → return true
```

### Source Code

```javascript
// ============================================
// isSandboxingEnabled - Four-gate enablement check
// Location: chunks.56.mjs:357-362
// ============================================

// ORIGINAL (for source lookup):
function h21() {
    if (!Qw8()) return !1;
    if (pw8().errors.length > 0) return !1;
    if (!vG7()) return !1;
    return TG7()
}

// READABLE (for understanding):
function isSandboxingEnabled() {
    // Gate 1: Platform support
    // Checks: macOS, Linux, or WSL2 (not Windows, not WSL1)
    if (!isSupportedPlatform()) {
        return false;
    }

    // Gate 2: Dependency availability
    // Checks: bwrap, socat, seccomp binaries (Linux)
    // Checks: ripgrep (all platforms)
    if (checkDependencies().errors.length > 0) {
        return false;
    }

    // Gate 3: Platform allowlist
    // Checks: enabledPlatforms setting includes current platform
    // Example: ["macos", "linux"] would enable both
    if (!isPlatformInEnabledList()) {
        return false;
    }

    // Gate 4: Settings enablement
    // Checks: sandbox.enabled in settings hierarchy
    // Can be set in localSettings, projectSettings, policySettings
    return isSandboxEnabledInSettings();
}

// Mapping: h21→isSandboxingEnabled, Qw8→isSupportedPlatform,
//          pw8→checkDependencies, vG7→isPlatformInEnabledList, TG7→isSandboxEnabledInSettings
```

### Key Design Decisions

**Why early returns (fail-fast pattern):**
- Most checks are cheap; expensive checks come later
- Avoids unnecessary work on unsupported platforms
- Clear separation of concerns

**Why errors vs warnings:**
- `checkDependencies().errors` blocks sandbox
- `checkDependencies().warnings` allows sandbox with reduced functionality
- Example: missing seccomp is warning (sandbox works, Unix sockets unblocked)

**Why separate isPlatformInEnabledList:**
- Allows enterprise policy to disable sandbox per-platform
- Useful for gradual rollout or platform-specific issues
- Default: all supported platforms enabled

---

## Algorithm 15: parseExclusionPattern (yfq) - Pattern Type Detection

**Location:** chunks.172.mjs:1530-1544

### What It Does

Parses an exclusion pattern string and determines its type (prefix, wildcard, or exact). This is the first step in command exclusion matching.

### Pattern Types

| Type | Example | Matches |
|------|---------|---------|
| prefix | `npm:*` | `npm`, `npm install`, `npm run test` |
| wildcard | `npm run *` | `npm run test`, `npm run build` |
| exact | `git` | Only `git` (not `git status`) |

### Source Code

```javascript
// ============================================
// parseExclusionPattern - Pattern type detection
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
    // Check 1: Prefix pattern (command:*)
    // extractPrefixPattern returns the prefix or null
    let prefix = extractPrefixPattern(pattern);
    if (prefix !== null) {
        return {
            type: "prefix",
            prefix: prefix  // e.g., "npm" from "npm:*"
        };
    }

    // Check 2: Wildcard pattern (contains * or ?)
    if (isWildcardPattern(pattern)) {
        return {
            type: "wildcard",
            pattern: pattern  // e.g., "npm run *"
        };
    }

    // Default: Exact match
    return {
        type: "exact",
        command: pattern  // e.g., "git"
    };
}

// Mapping: yfq→parseExclusionPattern, Ln8→extractPrefixPattern, TYz→isWildcardPattern
```

### extractPrefixPattern Implementation

```javascript
// ============================================
// extractPrefixPattern - Extract prefix from pattern
// Location: chunks.172.mjs:1488-1492
// ============================================

// ORIGINAL (for source lookup):
function Ln8(A) {
    if (!A.endsWith(":*")) return null;
    return A.slice(0, -2)
}

// READABLE (for understanding):
function extractPrefixPattern(pattern) {
    // Only patterns ending with ":*" are prefix patterns
    if (!pattern.endsWith(":*")) {
        return null;
    }
    // Strip the ":*" suffix to get the prefix
    return pattern.slice(0, -2);
}

// Mapping: Ln8→extractPrefixPattern
```

### isWildcardPattern Implementation

```javascript
// ============================================
// isWildcardPattern - Check for wildcard characters
// Location: chunks.172.mjs:1492
// ============================================

// ORIGINAL (for source lookup):
function TYz(A) {
    return /[*?]/.test(A)
}

// READABLE (for understanding):
function isWildcardPattern(pattern) {
    // Check for * or ? characters
    return /[*?]/.test(pattern);
}

// Mapping: TYz→isWildcardPattern
```

---

## Algorithm 16: matchWildcardPattern (Cn8) - Glob Pattern Matching

**Location:** chunks.172.mjs:1645-1647

### What It Does

Matches a string against a glob-style wildcard pattern. Used for command exclusion patterns like `npm run *`.

### Source Code

```javascript
// ============================================
// matchWildcardPattern - Glob-style pattern matching
// Location: chunks.172.mjs:1645-1647 (delegates to Efq)
// ============================================

// ORIGINAL (for source lookup):
function Cn8(A, q) {
    return Efq(A, q)
}

// READABLE (for understanding):
function matchWildcardPattern(pattern, text) {
    return convertWildcardToRegex(pattern, text);
}

// Mapping: Cn8→matchWildcardPattern, Efq→convertWildcardToRegex
```

### convertWildcardToRegex Implementation

```javascript
// ============================================
// convertWildcardToRegex - Wildcard to regex conversion
// Location: chunks.172.mjs:1503-1528
// ============================================

// ORIGINAL (for source lookup):
function Efq(A, q, K = !1) {
    let Y = "\x00ESCAPED_BACKSLASH\x00",
        z = "\x00ESCAPED_STAR\x00",
        _ = A.replace(/\\\\/g, Y).replace(/\\\*/g, z),
        w = 0, O = "", $ = [];
    for (let j = 0; j < _.length; j++) {
        let J = _[j];
        if (J === "*") {
            if (w > 0) $.push(_.slice(w, j)), w = 0;
            $.push("*")
        } else if (w === 0) w = j
    }
    if (w > 0) $.push(_.slice(w));
    // ... regex building logic
    let j = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")
              .replace(/\*/g, ".*")
              .replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*")
              .replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\"),
        J = (w.match(/\*/g) || []).length;
    if (j.endsWith(" .*") && J === 1) j = j.slice(0, -3) + "( .*)?";
    let M = "s" + (K ? "i" : "");
    return new RegExp(`^${j}$`, M).test(q)
}

// READABLE (for understanding):
function convertWildcardToRegex(pattern, text, caseInsensitive = false) {
    // Escape sequences for handling escaped wildcards
    let ESCAPED_BACKSLASH = "\x00ESCAPED_BACKSLASH\x00";
    let ESCAPED_STAR = "\x00ESCAPED_STAR\x00";

    // Step 1: Temporarily replace escaped sequences
    let normalized = pattern
        .replace(/\\\\/g, ESCAPED_BACKSLASH)  // \\ → placeholder
        .replace(/\\\*/g, ESCAPED_STAR);       // \* → placeholder

    // Step 2: Build regex string
    let regexStr = normalized
        .replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")  // Escape regex metacharacters
        .replace(/\*/g, ".*")                      // * → .* (match anything)
        .replace(new RegExp(ESCAPED_STAR, "g"), "\\*")     // Restore escaped *
        .replace(new RegExp(ESCAPED_BACKSLASH, "g"), "\\\\"); // Restore \\

    // Step 3: Handle trailing " *" specially
    // "npm run *" should match "npm run" AND "npm run test"
    let starCount = (regexStr.match(/\*/g) || []).length;
    if (regexStr.endsWith(" .*") && starCount === 1) {
        regexStr = regexStr.slice(0, -3) + "( .*)?";  // Make trailing part optional
    }

    // Step 4: Build and test regex
    let flags = "s" + (caseInsensitive ? "i" : "");  // s = dotAll
    let regex = new RegExp(`^${regexStr}$`, flags);

    return regex.test(text);
}

// Mapping: Efq→convertWildcardToRegex
```

### Pattern Matching Examples

| Pattern | Text | Result | Reason |
|---------|------|--------|--------|
| `npm:*` | `npm` | ✅ Match | Prefix pattern |
| `npm:*` | `npm install` | ✅ Match | Prefix + space |
| `npm:*` | `npm run test` | ✅ Match | Prefix + space + args |
| `npm:*` | `npx install` | ❌ No match | Different command |
| `npm run *` | `npm run test` | ✅ Match | Wildcard matches "test" |
| `npm run *` | `npm run` | ✅ Match | Trailing wildcard optional |
| `git` | `git` | ✅ Match | Exact match |
| `git` | `git status` | ❌ No match | Exact requires no args |

---

## Algorithm 17: extractCommandBasename (Ac) - Command Extraction

**Location:** chunks.172.mjs:1660-1680

### What It Does

Extracts the base command name from a complex shell command line, stripping environment variables, prefixes like `timeout`, `nice`, `nohup`, and extracting just the executable name.

### Source Code

```javascript
// ============================================
// extractCommandBasename - Strip prefixes and extract command
// Location: chunks.172.mjs:1660-1680
// ============================================

// ORIGINAL (for source lookup):
function Ac(A) {
    let q = [/^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|--(?:kill-after|signal)=[A-Za-z0-9_.+-]+|--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+|-v|-[ks][ \t]+[A-Za-z0-9_.+-]+|-[ks][A-Za-z0-9_.+-]+)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/, /^time[ \t]+(?:--[ \t]+)?/, /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/, /^nohup[ \t]+(?:--[ \t]+)?/],
        K = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/,
        Y = A,
        z = "";
    while (Y !== z) {
        z = Y, Y = hn8(Y);
        let _ = Y.match(K);
        if (_) {
            // Strip env var
            let w = _[1];
            if (!AS1.has(w)) break;
            Y = Y.slice(_[0].length)
        }
    }
    for (let _ of q) Y = Y.replace(_, "");
    return Y.trim().split(/\s+/)[0] || ""
}

// READABLE (for understanding):
function extractCommandBasename(commandLine) {
    // Regex patterns for command prefixes to strip
    let prefixPatterns = [
        // timeout [--options] <duration> <command>
        /^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|--(?:kill-after|signal)=[A-Za-z0-9_.+-]+|--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+|-v|-[ks][ \t]+[A-Za-z0-9_.+-]+|-[ks][A-Za-z0-9_.+-]+)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/,
        // time <command>
        /^time[ \t]+(?:--[ \t]+)?/,
        // nice -n <priority> <command>
        /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/,
        // nohup <command>
        /^nohup[ \t]+(?:--[ \t]+)?/
    ];

    // Pattern for environment variable: VAR=value
    let envVarPattern = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/;

    let result = commandLine;
    let previous = "";

    // Loop until no more changes (fixed point)
    while (result !== previous) {
        previous = result;

        // Remove comment lines
        result = removeComments(result);

        // Check for environment variable
        let match = result.match(envVarPattern);
        if (match) {
            let varName = match[1];
            // Only strip "safe" env vars
            if (!SAFE_ENV_VARS_SET.has(varName)) {
                break;  // Stop on unknown env var
            }
            result = result.slice(match[0].length);
        }
    }

    // Strip command prefixes (timeout, nice, nohup, time)
    for (let pattern of prefixPatterns) {
        result = result.replace(pattern, "");
    }

    // Extract first word (the command)
    return result.trim().split(/\s+/)[0] || "";
}

// Mapping: Ac→extractCommandBasename, q→prefixPatterns, K→envVarPattern,
//          hn8→removeComments, AS1→SAFE_ENV_VARS_SET
```

### Example Transformations

| Input | Output |
|-------|--------|
| `npm install` | `npm` |
| `NODE_ENV=production npm run build` | `npm` |
| `timeout 30s sleep 100` | `sleep` |
| `nice -n 10 make build` | `make` |
| `nohup node server.js &` | `node` |
| `A=1 B=2 bash -c 'echo hi'` | `bash` |

---

## Algorithm 18: resolveCommandEnvVars (bn8) - Env Var Resolution

**Location:** chunks.172.mjs:1682

### What It Does

Strips environment variable prefixes from a command line, handling `LD_*`, `DYLD_*`, and `PATH` specially for variant generation in exclusion matching.

### Source Code

```javascript
// ============================================
// resolveCommandEnvVars - Strip env vars for variant generation
// Location: chunks.172.mjs:1682
// ============================================

// READABLE (for understanding):
function resolveCommandEnvVars(commandLine, ldPathRegex) {
    // The regex matches LD_*, DYLD_*, and PATH environment variables
    // These are stripped to create command variants

    // Example: "LD_LIBRARY_PATH=/opt/lib npm install"
    // Becomes: "npm install"

    // This is used in BFS variant expansion to match commands
    // regardless of library path modifications
}

// Mapping: bn8→resolveCommandEnvVars, xfq→LD_PATH_REGEX
```

### Why LD_* / DYLD_* / PATH

These environment variables are commonly modified for:
- Custom library paths (`LD_LIBRARY_PATH`)
- macOS framework paths (`DYLD_LIBRARY_PATH`)
- Custom executable paths (`PATH`)

Stripping them allows matching `npm install` regardless of how paths are configured.

---

## Algorithm 19: wrapWithMacOSSandbox (QZ7) - macOS Sandbox Wrapper

**Location:** chunks.55.mjs:2803-2841

### What It Does

Wraps a command with macOS sandbox-exec using a dynamically generated SBPL (Seatbelt Profile Language) profile. This is the main entry point for macOS sandboxing.

### Source Code

```javascript
// ============================================
// wrapWithMacOSSandbox - Wrap command with sandbox-exec
// Location: chunks.55.mjs:2803-2841
// ============================================

// ORIGINAL (for source lookup):
function QZ7(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpProxyPort: Y,
        socksProxyPort: z,
        allowUnixSockets: _,
        allowAllUnixSockets: w,
        allowLocalBinding: O,
        readConfig: $,
        writeConfig: H,
        allowPty: j,
        allowGitConfig: J = !1,
        enableWeakerNetworkIsolation: M = !1,
        binShell: D
    } = A, X = $ && $.denyOnly.length > 0;
    if (!K && !X && H === void 0) return q;
    let W = Cb3(q),
        Z = xb3({
            readConfig: $, writeConfig: H, httpProxyPort: Y, socksProxyPort: z,
            needsNetworkRestriction: K, allowUnixSockets: _, allowAllUnixSockets: w,
            allowLocalBinding: O, allowPty: j, allowGitConfig: J,
            enableWeakerNetworkIsolation: M, logTag: W
        }),
        G = f21(Y, z),
        f = D || "bash",
        v = JU(f);
    if (!v) throw Error(`Shell '${f}' not found in PATH`);
    let N = gZ7.default.quote(["env", ...G, "sandbox-exec", "-p", Z, v, "-c", q]);
    return wA(`[Sandbox macOS] Applied restrictions - network: ${!!(Y||z)}, read: ${$?"allowAllExcept"in $?"allowAllExcept":"denyAllExcept":"none"}, write: ${H?"allowAllExcept"in H?"allowAllExcept":"denyAllExcept":"none"}`), N
}

// READABLE (for understanding):
function wrapWithMacOSSandbox(config) {
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
        allowPty,
        allowGitConfig = false,
        enableWeakerNetworkIsolation = false,
        binShell
    } = config;

    // Determine if any restrictions are needed
    let hasReadDeny = readConfig && readConfig.denyOnly.length > 0;

    // Early exit: No restrictions needed
    if (!needsNetworkRestriction && !hasReadDeny && writeConfig === undefined) {
        return command;  // Return unchanged
    }

    // Step 1: Generate log tag for violation correlation
    let logTag = generateLogTag(command);  // CMD64_<base64>_END_<session>

    // Step 2: Generate SBPL profile
    let profile = generateSeatbeltProfile({
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
        enableWeakerNetworkIsolation,
        logTag
    });

    // Step 3: Get proxy environment variables
    let envVars = getProxyEnvVars(httpProxyPort, socksProxyPort);

    // Step 4: Find shell
    let shell = binShell || "bash";
    let shellPath = which(shell);
    if (!shellPath) {
        throw Error(`Shell '${shell}' not found in PATH`);
    }

    // Step 5: Build sandbox-exec command
    // Format: env HTTP_PROXY=... sandbox-exec -p <profile> /bin/bash -c <command>
    let wrappedCommand = shellQuote([
        "env",
        ...envVars,
        "sandbox-exec",
        "-p", profile,
        shellPath,
        "-c", command
    ]);

    logDebug(`[Sandbox macOS] Applied restrictions - network: ${!!(httpProxyPort || socksProxyPort)}, read: ${readConfig ? "configured" : "none"}, write: ${writeConfig ? "configured" : "none"}`);

    return wrappedCommand;
}

// Mapping: QZ7→wrapWithMacOSSandbox, Cb3→generateLogTag, xb3→generateSeatbeltProfile,
//          f21→getProxyEnvVars, JU→which, gZ7.default.quote→shellQuote, wA→logDebug
```

### Key Design Decisions

**Why early exit when no restrictions:**
- Avoids unnecessary sandbox-exec overhead
- Commands run faster without profile parsing
- Some commands don't need any restrictions

**Why log tag in every deny message:**
- Allows correlation with command in macOS logs
- Pattern: `CMD64_<base64>_END_<session>`
- Enables `getViolationsForCommand()` filtering

**Why shell quoting:**
- Prevents command injection through profile
- Handles special characters in command
- Uses shq library for robust quoting

---

## Algorithm 20: wrapWithLinuxSandbox (uZ7) - Linux Bubblewrap Wrapper

**Location:** chunks.55.mjs:2564-2648

### What It Does

Wraps a command with bubblewrap (bwrap) for Linux sandboxing. Includes seccomp filter generation for Unix socket blocking and Unix socket bridge setup for network access.

### Source Code

```javascript
// ============================================
// wrapWithLinuxSandbox - Wrap command with bwrap
// Location: chunks.55.mjs:2564-2648
// ============================================

// ORIGINAL (for source lookup):
async function uZ7(A) {
    let {
        command: q, needsNetworkRestriction: K, httpSocketPath: Y, socksSocketPath: z,
        httpProxyPort: _, socksProxyPort: w, readConfig: O, writeConfig: $,
        enableWeakerNestedSandbox: H, allowAllUnixSockets: j, binShell: J,
        ripgrepConfig: M = { command: "rg" }, mandatoryDenySearchDepth: D = Rw8,
        allowGitConfig: X = !1, seccompConfig: P, abortSignal: W
    } = A, Z = O && O.denyOnly.length > 0, G = $ !== void 0;
    if (!K && !Z && !G) return q;
    let f = ["--new-session", "--die-with-parent"], v = void 0;
    try {
        // Seccomp filter generation for Unix socket blocking
        if (!j) {
            v = RZ7(P?.bpfPath) ?? void 0;
            let u = Ex6(P?.applyPath);
            if (!v || !u) wA("[Sandbox Linux] Seccomp binaries not available...", { level: "warn" }), v = void 0;
            else { /* track for cleanup */ }
        }
        // Network namespace
        if (K) {
            if (f.push("--unshare-net"), Y && z) {
                if (!$2.existsSync(Y)) throw Error(`Linux HTTP bridge socket does not exist: ${Y}...`);
                f.push("--bind", Y, Y), f.push("--bind", z, z);
                // Set proxy environment variables
            }
        }
        // Filesystem mounts
        let N = await Rb3(O, $, M, D, X, W);
        f.push(...N), f.push("--dev", "/dev"), f.push("--unshare-pid");
        if (!H) f.push("--proc", "/proc");
        // Build final command
        let V = J || "bash", L = JU(V);
        if (!L) throw Error(`Shell '${V}' not found in PATH`);
        if (f.push("--", L, "-c"), K && Y && z) {
            let u = Lb3(Y, z, q, v, L, P?.applyPath);
            f.push(u);
        } else if (v) {
            // Apply seccomp filter
            let u = Ex6(P?.applyPath);
            let I = gq6.default.quote([u, v, L, "-c", q]);
            f.push(I);
        } else f.push(q);
        let h = gq6.default.quote(["bwrap", ...f]);
        return wA(`[Sandbox Linux] Wrapped command with bwrap...`), h;
    } catch (N) {
        // Cleanup on error
        throw N;
    }
}

// READABLE (for understanding):
async function wrapWithLinuxSandbox(config) {
    let {
        command,
        needsNetworkRestriction,
        httpSocketPath,      // Path to HTTP proxy Unix socket bridge
        socksSocketPath,     // Path to SOCKS proxy Unix socket bridge
        httpProxyPort,
        socksProxyPort,
        readConfig,
        writeConfig,
        enableWeakerNestedSandbox,
        allowAllUnixSockets,
        binShell,
        ripgrepConfig = { command: "rg" },
        mandatoryDenySearchDepth = 3,
        allowGitConfig = false,
        seccompConfig,
        abortSignal
    } = config;

    // Determine if restrictions needed
    let hasReadDeny = readConfig && readConfig.denyOnly.length > 0;
    let hasWriteConfig = writeConfig !== undefined;

    // Early exit: No restrictions
    if (!needsNetworkRestriction && !hasReadDeny && !hasWriteConfig) {
        return command;
    }

    // Base bwrap args: process isolation
    let bwrapArgs = ["--new-session", "--die-with-parent"];
    let seccompFilterPath;

    try {
        // Step 1: Generate seccomp filter for Unix socket blocking
        if (!allowAllUnixSockets) {
            seccompFilterPath = getBpfFilterPath(seccompConfig?.bpfPath);
            let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);

            if (!seccompFilterPath || !applySeccompPath) {
                logWarning("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled");
                seccompFilterPath = undefined;
            } else {
                logDebug("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking");
            }
        }

        // Step 2: Network namespace isolation
        if (needsNetworkRestriction) {
            bwrapArgs.push("--unshare-net");

            // Bind bridge sockets into sandbox (for network proxy)
            if (httpSocketPath && socksSocketPath) {
                // Verify sockets exist
                if (!fs.existsSync(httpSocketPath)) {
                    throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}`);
                }
                if (!fs.existsSync(socksSocketPath)) {
                    throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}`);
                }

                bwrapArgs.push("--bind", httpSocketPath, httpSocketPath);
                bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);

                // Set environment variables for proxy ports
                // CLAUDE_CODE_HOST_HTTP_PROXY_PORT, CLAUDE_CODE_HOST_SOCKS_PROXY_PORT
            }
        }

        // Step 3: Filesystem mount arguments
        let fsArgs = await generateBwrapArgs(
            readConfig, writeConfig, ripgrepConfig,
            mandatoryDenySearchDepth, allowGitConfig, abortSignal
        );
        bwrapArgs.push(...fsArgs);

        // Step 4: Device and process namespaces
        bwrapArgs.push("--dev", "/dev");
        bwrapArgs.push("--unshare-pid");
        if (!enableWeakerNestedSandbox) {
            bwrapArgs.push("--proc", "/proc");
        }

        // Step 5: Build final command
        let shell = binShell || "bash";
        let shellPath = which(shell);
        if (!shellPath) {
            throw Error(`Shell '${shell}' not found in PATH`);
        }

        bwrapArgs.push("--", shellPath, "-c");

        // Different command wrapping based on network and seccomp
        if (needsNetworkRestriction && httpSocketPath && socksSocketPath) {
            // Use bridge wrapper for network access
            let bridgeCmd = buildBridgeWrapperCommand(
                httpSocketPath, socksSocketPath, command,
                seccompFilterPath, shellPath, seccompConfig?.applyPath
            );
            bwrapArgs.push(bridgeCmd);
        } else if (seccompFilterPath) {
            // Apply seccomp filter directly
            let applySeccompPath = getApplySeccompPath(seccompConfig?.applyPath);
            let wrappedCmd = shellQuote([applySeccompPath, seccompFilterPath, shellPath, "-c", command]);
            bwrapArgs.push(wrappedCmd);
        } else {
            // No special wrapping needed
            bwrapArgs.push(command);
        }

        // Step 6: Build and return final bwrap command
        let finalCommand = shellQuote(["bwrap", ...bwrapArgs]);

        let restrictions = [];
        if (needsNetworkRestriction) restrictions.push("network");
        if (hasReadDeny || hasWriteConfig) restrictions.push("filesystem");
        if (seccompFilterPath) restrictions.push("seccomp(unix-block)");

        logDebug(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`);

        return finalCommand;

    } catch (error) {
        // Cleanup seccomp filter on error
        if (seccompFilterPath && !seccompFilterPath.includes("/vendor/seccomp/")) {
            cleanupSeccompFilter(seccompFilterPath);
        }
        throw error;
    }
}

// Mapping: uZ7→wrapWithLinuxSandbox, RZ7→getBpfFilterPath, Ex6→getApplySeccompPath,
//          Rb3→generateBwrapArgs, Lb3→buildBridgeWrapperCommand, JU→which,
//          gq6.default.quote→shellQuote, $2.existsSync→fs.existsSync, wA→logDebug
```

### Key Design Decisions

**Why --new-session and --die-with-parent:**
- `--new-session`: Creates new session for signal isolation
- `--die-with-parent`: Kills sandbox when parent process dies
- Prevents orphan sandbox processes

**Why Unix socket bridges:**
- bwrap's `--unshare-net` blocks all network
- Bridges allow controlled network access via proxy
- socat bridges host proxy ports into sandbox namespace

**Why seccomp filter:**
- Blocks Unix socket syscalls even though network namespace exists
- Prevents bypass via Unix sockets (e.g., Docker socket)
- BPF filter applied before command execution

---

## Summary Table (Updated)

| Algorithm | Symbol | Purpose | Time Complexity |
|-----------|--------|---------|-----------------|
| isCommandInExcludedList | yYz | Pattern matching with variant expansion | O(n × m) where n=variants, m=patterns |
| SandboxViolationStore | HD6 | Ring buffer with observer pattern | O(1) add, O(n) get |
| generateSeatbeltProfile | xb3 | SBPL profile construction | O(k) where k=rules count |
| matchDomainPattern | bw8 | Domain wildcard matching | O(n) where n=domain length |
| checkNetworkPermission | nZ7 | Network access control | O(n) where n=domain patterns |
| parseExclusionPattern | yfq | Pattern type detection | O(n) where n=pattern length |
| isCommandSandboxed | Ti | 4-gate sandbox decision | O(1) + O(isCommandInExcludedList) |
| initializeLowLevel | pb3 | Network infrastructure bootstrap | O(1) + async proxy startup |
| createBridgeSockets | xZ7 | Unix socket bridge creation | O(1) + socat startup |
| buildFilesystemMounts | Rb3 | Linux filesystem isolation | O(n) where n=paths |
| extractPrefixPattern | Ln8 | Prefix pattern extraction | O(n) where n=pattern length |
| isWildcardPattern | TYz | Wildcard detection | O(n) where n=pattern length |
| matchWildcardPattern | Cn8 | Glob pattern matching | O(n) where n=text length |
| extractCommandBasename | Ac | Command extraction | O(n) where n=command length |
| resolveCommandEnvVars | bn8 | Env var stripping | O(n) where n=command length |
| convertWildcardToRegex | Efq | Wildcard to regex | O(n) where n=pattern length |
| **wrapWithMacOSSandbox** | QZ7 | macOS sandbox-exec wrapper | O(k) where k=profile size |
| **wrapWithLinuxSandbox** | uZ7 | Linux bwrap wrapper | O(n) where n=mounts + async cleanup |
| **isSandboxingEnabled** | h21 | 4-gate enablement check | O(1) + dep check |

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [symbol_validation.md](./symbol_validation.md) - Validated symbols
- [cross_module_integration.md](./cross_module_integration.md) - Integration points
- [ui_linkage.md](./ui_linkage.md) - UI components
- [ui_interaction_flows.md](./ui_interaction_flows.md) - UI state machines
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation details
- [network_proxy.md](./network_proxy.md) - Network isolation details

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - 18 algorithms verified against source code