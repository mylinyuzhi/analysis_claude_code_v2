# Sandbox Violation System (Claude Code 2.1.76)

## Overview

The sandbox violation system monitors and reports attempts by sandboxed processes to access denied resources. On macOS, this is implemented by streaming system logs (`log stream`) and filtering for sandbox denial messages. The system correlates violations with the originating command using base64-encoded command identifiers, filters known benign violations, and stores violations in a ring buffer for UI display and debugging.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)

Key symbols in this document:
- `UZ7` - startLogMonitor function (macOS log stream monitoring)
- `HD6` - SandboxViolationStore class (ring buffer for violations)
- `Cb3` - generateLogTag function (command correlation identifier)
- `T21` - encodeBase64 function (command encoding)
- `EZ7` - decodeBase64 function (command decoding)
- `FZ7` - SANDBOX_LOG_TAG constant (unique session identifier)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Sandbox Violation Monitoring                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sandboxed Command                                                          │
│       │                                                                     │
│       │ (attempt to access denied resource)                                │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ macOS Sandbox Kernel Extension                                       │   │
│  │   • Denies access                                                    │   │
│  │   • Generates log message: "Sandbox: <violation details>"            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ macOS Unified Logging (log stream)                                   │   │
│  │   • Event message ends with: "_<random>_SBX"                         │   │
│  │   • Contains CMD64_<base64>_END_<tag> for command correlation        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ startLogMonitor (UZ7)                                                │   │
│  │   • log stream --predicate '(eventMessage ENDSWITH "_xxx_SBX")'     │   │
│  │   • Parse violation messages                                         │   │
│  │   • Decode command from CMD64_<base64>_END                           │   │
│  │   • Filter benign violations (mDNSResponder, diagnosticd)            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ SandboxViolationStore (HD6)                                          │   │
│  │   • Ring buffer (max 100 violations)                                 │   │
│  │   • Subscribe pattern for UI updates                                 │   │
│  │   • getViolationsForCommand() for per-command lookup                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Log Tag Generation

### Session Tag

**Location:** `chunks.55.mjs:2899`

```javascript
// ORIGINAL (for source lookup):
FZ7 = `_${Math.random().toString(36).slice(2,11)}_SBX`

// READABLE (for understanding):
const SANDBOX_LOG_TAG = `_${Math.random().toString(36).slice(2, 11)}_SBX`;

// Example: "_k7x9m2pq_SBX"
```

**Why random:** Each Claude Code session generates a unique tag. This allows multiple sessions to run simultaneously without cross-talk in logs.

### Command Tag

**Location:** `chunks.55.mjs:2678-2679`

```javascript
// ORIGINAL (for source lookup):
function Cb3(A) {
    return `CMD64_${T21(A)}_END_${FZ7}`
}

// READABLE (for understanding):
function generateLogTag(command) {
    return `CMD64_${encodeBase64(command)}_END_${SANDBOX_LOG_TAG}`;
}

// Example: "CMD64_Y2F0IC9ldGMvcGFzc3dk_END_k7x9m2pq_SBX"
```

**Why base64 encoding:**
1. Commands may contain special characters (quotes, newlines, pipes)
2. Base64 produces a clean, parseable identifier
3. Easily reversible for correlation

---

## Log Monitor: `startLogMonitor` (UZ7)

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
                D = EZ7(X)
            } catch {}
        }
        if (M.includes("mDNSResponder") || M.includes("mach-lookup com.apple.diagnosticd") || M.includes("mach-lookup com.apple.analyticsd")) return;
        if (q && D) {
            if (z.length > 0) {
                if (z.some((W) => M.includes(W))) return
            }
            for (let [P, W] of _)
                if (D.includes(P)) {
                    if (W.some((G) => M.includes(G))) return
                }
        }
        A({
            line: M,
            command: D,
            encodedCommand: X,
            timestamp: new Date
        })
    }), w.stderr?.on("data", (O) => {
        wA(`[Sandbox Monitor] Log stream stderr: ${O.toString()}`)
    }), w.on("error", (O) => {
        wA(`[Sandbox Monitor] Failed to start log stream: ${O.message}`)
    }), w.on("exit", (O) => {
        wA(`[Sandbox Monitor] Log stream exited with code: ${O}`)
    }), () => {
        wA("[Sandbox Monitor] Stopping log monitor"), w.kill("SIGTERM")
    }
}

// READABLE (for understanding):
function startLogMonitor(onViolation, filterConfig) {
    const CMD_PATTERN = /CMD64_(.+?)_END/;
    const SANDBOX_DENY_PATTERN = /Sandbox:\s+(.+)$/;

    // Filter config structure:
    // {
    //   "*": ["global_filter_1", "global_filter_2"],  // Applied to all commands
    //   "command_pattern": ["specific_filter"]        // Applied only to matching commands
    // }
    let globalFilters = filterConfig?.["*"] || [];
    let commandSpecificFilters = filterConfig
        ? Object.entries(filterConfig).filter(([key]) => key !== "*")
        : [];

    // Start log stream filtered by our session tag
    let logProcess = spawn("log", [
        "stream",
        "--predicate", `(eventMessage ENDSWITH "${SANDBOX_LOG_TAG}")`,
        "--style", "compact"
    ]);

    // Process log output
    logProcess.stdout?.on("data", (data) => {
        let lines = data.toString().split("\n");

        // Find the violation line (contains "Sandbox:" and "deny")
        let violationLine = lines.find(l =>
            l.includes("Sandbox:") && l.includes("deny")
        );

        // Find the command correlation line (starts with "CMD64_")
        let commandLine = lines.find(l => l.startsWith("CMD64_"));

        if (!violationLine) return;

        // Extract violation message
        let match = violationLine.match(SANDBOX_DENY_PATTERN);
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

        // === FILTERING ===

        // Filter known benign violations
        if (violationMessage.includes("mDNSResponder")) {
            // mDNS is always chatty, not a real violation
            return;
        }
        if (violationMessage.includes("mach-lookup com.apple.diagnosticd")) {
            // macOS telemetry, not a real violation
            return;
        }
        if (violationMessage.includes("mach-lookup com.apple.analyticsd")) {
            // macOS analytics, not a real violation
            return;
        }

        // Apply global filters
        if (filterConfig && decodedCommand) {
            if (globalFilters.length > 0) {
                if (globalFilters.some(filter => violationMessage.includes(filter))) {
                    return;  // Filtered out by global filter
                }
            }

            // Apply command-specific filters
            for (let [commandPattern, filters] of commandSpecificFilters) {
                if (decodedCommand.includes(commandPattern)) {
                    if (filters.some(filter => violationMessage.includes(filter))) {
                        return;  // Filtered out by command-specific filter
                    }
                }
            }
        }

        // Report violation
        onViolation({
            line: violationMessage,
            command: decodedCommand,
            encodedCommand: encodedCommand,
            timestamp: new Date()
        });
    });

    // Error handlers
    logProcess.stderr?.on("data", (data) => {
        log(`[Sandbox Monitor] Log stream stderr: ${data.toString()}`);
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

// Mapping: UZ7→startLogMonitor, A→onViolation, q→filterConfig,
//          K→CMD_PATTERN, Y→SANDBOX_DENY_PATTERN, FZ7→SANDBOX_LOG_TAG,
//          hb3→spawn, EZ7→decodeBase64, wA→log
```

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
        this.violations = [];      // Ring buffer of violations
        this.totalCount = 0;       // Total count (doesn't reset on trim)
        this.maxSize = 100;        // Maximum buffer size
        this.listeners = new Set(); // Change notification subscribers
    }

    /**
     * Add a violation to the store
     * @param {Object} violation - { line, command, encodedCommand, timestamp }
     */
    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Trim to max size (ring buffer behavior)
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    /**
     * Get violations from the buffer
     * @param {number} [count] - Number of most recent violations to return
     * @returns {Array} Array of violations
     */
    getViolations(count) {
        if (count === undefined) {
            return [...this.violations];
        }
        return this.violations.slice(-count);
    }

    /**
     * Get current buffer size
     * @returns {number} Number of violations in buffer
     */
    getCount() {
        return this.violations.length;
    }

    /**
     * Get total violations since session start
     * @returns {number} Total count including trimmed violations
     */
    getTotalCount() {
        return this.totalCount;
    }

    /**
     * Get all violations for a specific command
     * @param {string} command - The command to search for
     * @returns {Array} Violations matching the command
     */
    getViolationsForCommand(command) {
        let encoded = encodeBase64(command);
        return this.violations.filter(v => v.encodedCommand === encoded);
    }

    /**
     * Clear all violations
     */
    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    /**
     * Subscribe to violation changes
     * @param {Function} callback - Called with current violations on change
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Initial call with current state
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all subscribers of changes
     */
    notifyListeners() {
        let currentViolations = this.getViolations();
        this.listeners.forEach(callback => callback(currentViolations));
    }
}

// Mapping: HD6→SandboxViolationStore, T21→encodeBase64
```

---

## Violation Filtering

### Known Benign Violations

The following violations are always filtered:

| Pattern | Reason |
|---------|--------|
| `mDNSResponder` | mDNS daemon is always trying to advertise services; blocked by design |
| `mach-lookup com.apple.diagnosticd` | macOS crash reporting telemetry |
| `mach-lookup com.apple.analyticsd` | macOS analytics service |

**Why these are filtered:** These services are accessed by the macOS system on behalf of all processes, regardless of the application's intent. Blocking them is correct, but reporting them as violations would create noise without security value.

### Configurable Filters

Filter configuration is passed to `startLogMonitor`:

```javascript
const filterConfig = {
    "*": [
        "file-write-data",      // Ignore file write attempts (handled elsewhere)
        "network-outbound"      // Ignore network attempts (handled by proxy)
    ],
    "npm install": [
        "mach-lookup com.apple.CoreSimulator",  // npm tries to access simulator
        "file-read-data /Users"                  // npm reads user directories
    ],
    "git": [
        "mach-lookup com.apple.xpc.launchd"      // git accesses launchd
    ]
};
```

**How it works:**
1. Global filters (`"*"`) apply to all commands
2. Command-specific filters apply only when the command matches the key
3. A violation is filtered if its message contains any of the filter strings

---

## Violation Data Shape

```typescript
interface SandboxViolation {
    line: string;              // The raw violation message from logs
                               // e.g., "deny(1) mach-lookup com.apple.some-service"

    command: string;           // Decoded command string (if available)
                               // e.g., "cat /etc/passwd"

    encodedCommand: string;    // Base64-encoded command (for correlation)
                               // e.g., "Y2F0IC9ldGMvcGFzc3dk"

    timestamp: Date;           // When the violation occurred
}
```

---

## Integration with Sandboxed Commands

### Command Wrapping with Log Tag

```javascript
// In sandbox-exec profile generation (macOS):
let profile = [
    `(deny default (with message "${logTag}"))`,
    // ... rest of profile
];

// The logTag appears in every denial message:
// "Sandbox: deny(1) file-read-data /etc/shadow (with message _k7x9m2pq_SBX)"
```

### Command Correlation Injection

```javascript
// Commands are prefixed with a marker for correlation:
let commandMarker = `echo "CMD64_${base64Command}_END_${logTag}"; ${actualCommand}`;

// In the logs:
// CMD64_Y2F0IC9ldGMvcGFzc3dk_END_k7x9m2pq_SBX
// Sandbox: deny(1) file-read-data /etc/shadow (with message _k7x9m2pq_SBX)
```

---

## Design Rationale

### Why Ring Buffer

Violations can be numerous in a long session. A fixed-size buffer:
1. Prevents memory growth
2. Keeps most recent violations (most relevant)
3. Provides total count for statistics

### Why Base64 Command Encoding

Commands may contain:
- Quotes (`'`, `"`)
- Newlines (multiline commands)
- Special characters (`|`, `&`, `$`, etc.)

Base64 encoding ensures a clean, parseable identifier that can be decoded without escaping issues.

### Why Log Stream Instead of File Parsing

`log stream` provides:
1. Real-time monitoring (no polling delay)
2. Filtering at the source (reduced log volume)
3. Structured output (compact style is parseable)

---

## Related Documents

- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec profiles
- [overview.md](./overview.md) - Sandbox architecture overview
- [../ui_linkage.md](./ui_linkage.md) - UI components for violation display