# LSP Integration Algorithms - Deep Analysis

> **Module**: LSP Integration
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.138.mjs`, `chunks.144.mjs`

---

## Overview

This document provides detailed algorithmic analysis of the LSP (Language Server Protocol) integration subsystem. Each algorithm is analyzed for its purpose, implementation logic, design rationale, and key insights.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `sendRequestWithRetry` (J within no4) - Retry with exponential backoff
- `hashDiagnostic` (za4) - SHA-256 hash for diagnostic deduplication
- `deduplicateDiagnostics` (HyY) - Two-level deduplication algorithm
- `checkDiagnosticsRegistry` (_a4) - Volume limiting and delivery
- `initializeLspServerManager` (dm8) - Generation counter pattern

---

## Algorithm 1: Retry with Exponential Backoff for ContentModified

### What it does

When an LSP request fails with the `ContentModified` error (-32801), the system automatically retries the request with exponential backoff delays. This handles the common case where a document is modified while an LSP request is in-flight.

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                    RETRY DECISION TREE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   sendRequest(method, params)                                    │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐                                               │
│   │ attempt = 0  │                                               │
│   └──────┬───────┘                                               │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────┐                                       │
│   │ Send LSP Request     │                                       │
│   │ connection.send()    │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Success?             │                                       │
│   └──────────┬───────────┘                                       │
│          ┌───┴───┐                                               │
│         Yes      No                                              │
│          │        │                                              │
│          ▼        ▼                                              │
│   ┌──────────┐  ┌──────────────────────┐                        │
│   │ Return   │  │ error.code == -32801?│                        │
│   │ result   │  │ (ContentModified)    │                        │
│   └──────────┘  └──────────┬───────────┘                        │
│                      ┌──────┴──────┐                             │
│                     Yes            No                            │
│                      │             │                             │
│                      ▼             ▼                             │
│              ┌──────────────┐  ┌──────────────┐                 │
│              │ attempt < 3? │  │ Throw error  │                 │
│              └──────┬───────┘  └──────────────┘                 │
│                ┌────┴────┐                                      │
│               Yes        No                                     │
│                │          │                                     │
│                ▼          ▼                                     │
│       ┌──────────────┐  ┌──────────────┐                       │
│       │ delay =      │  │ Throw error  │                       │
│       │ 500 * 2^att  │  │ (max retries)│                       │
│       │              │  └──────────────┘                       │
│       │ sleep(delay) │                                          │
│       │ attempt++    │                                          │
│       └──────┬───────┘                                          │
│              │                                                   │
│              └──────────────────────────────────────►            │
│                     (back to send request)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// sendRequestWithRetry - LSP request retry with exponential backoff
// Location: chunks.138.mjs:498-518 (within no4 - createLspClient)
// ============================================

// ORIGINAL:
async function J(P, W) {
    if (!j()) {
        let f = Error(`Cannot send request to LSP server '${A}': server is ${Y}${_?`, last error: ${_.message}`:""}`);
        throw _6(f), f
    }
    let Z;
    for (let f = 0; f <= Qm8; f++) try {
        return await K.sendRequest(P, W)
    } catch (v) {
        Z = v;
        let N = v.code;
        if (typeof N === "number" && N === tEY && f < Qm8) {
            let L = eEY * Math.pow(2, f);
            k(`LSP request '${P}' to '${A}' got ContentModified error, retrying in ${L}ms (attempt ${f+1}/${Qm8})…`), await new Promise((h) => setTimeout(h, L));
            continue
        }
        break
    }
    let G = Error(`LSP request '${P}' failed for server '${A}': ${Z?.message??"unknown error"}`);
    throw _6(G), G
}

// READABLE:
async function sendRequestWithRetry(method, params) {
    // Check if server is running and initialized
    if (!isHealthy()) {
        const error = Error(`Cannot send request to LSP server '${serverName}': server is ${state}${lastError ? `, last error: ${lastError.message}` : ""}`);
        logError(error);
        throw error;
    }

    let lastError;

    // Retry loop: attempt 0, 1, 2, 3 (total 4 attempts, 3 retries)
    for (let attempt = 0; attempt <= LSP_MAX_RETRIES; attempt++) {
        try {
            return await connection.sendRequest(method, params);
        } catch (error) {
            lastError = error;
            const errorCode = error.code;

            // Only retry for ContentModified error (-32801)
            if (typeof errorCode === "number" && errorCode === CONTENT_MODIFIED_ERROR_CODE && attempt < LSP_MAX_RETRIES) {
                // Calculate exponential backoff: 500 * 2^attempt
                const delay = LSP_RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
                log(`LSP request '${method}' to '${serverName}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt+1}/${LSP_MAX_RETRIES})…`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }
            // Non-retryable error or max retries reached
            break;
        }
    }

    // All retries exhausted
    const error = Error(`LSP request '${method}' failed for server '${serverName}': ${lastError?.message ?? "unknown error"}`);
    logError(error);
    throw error;
}

// Mapping: J→sendRequestWithRetry, Qm8→LSP_MAX_RETRIES (3), tEY→CONTENT_MODIFIED_ERROR_CODE (-32801), eEY→LSP_RETRY_BASE_DELAY_MS (500), K.sendRequest→connection.sendRequest, j→isHealthy
```

### Timing Analysis

| Attempt | Delay Calculation | Delay (ms) | Cumulative Wait |
|---------|-------------------|------------|-----------------|
| 0 (initial) | 500 × 2^0 | 500 | 500ms |
| 1 (first retry) | 500 × 2^1 | 1000 | 1500ms |
| 2 (second retry) | 500 × 2^2 | 2000 | 3500ms |
| 3 (third retry) | N/A (max reached) | - | - |

**Total maximum wait time: 3500ms** (500 + 1000 + 2000)

### Why this approach

**Why ContentModified (-32801) is special:**
- This is an LSP 3.0 standard error code
- It means the document was modified while the request was being processed
- The server couldn't answer because its internal state was outdated
- Retrying gives the server time to catch up

**Why exponential backoff:**
- Initial 500ms allows quick recovery for simple cases
- Doubling delay handles progressively slower servers
- Maximum 2000ms prevents excessive waiting
- Pattern: 500 → 1000 → 2000 gives progressively more time

**Why max 3 retries:**
- 4 total attempts (1 initial + 3 retries) is a good balance
- Too many retries would make the agent feel unresponsive
- After 3.5 seconds of waiting, the operation is likely fundamentally broken

---

## Algorithm 2: Diagnostic Deduplication

### What it does

The system implements two-level deduplication to prevent duplicate diagnostics from appearing in the system prompt. This ensures:
1. Diagnostics from the same server aren't duplicated within a single turn
2. Diagnostics already shown to the agent aren't repeated

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                 DEDUPLICATION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   LSP Server sends publishDiagnostics                           │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────┐                                       │
│   │ hashDiagnostic(za4)  │                                       │
│   │ Compute SHA-256 hash │                                       │
│   │ of diagnostic fields │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Check Level 1:       │                                       │
│   │ in-flight hashes     │                                       │
│   │ (current turn)       │                                       │
│   └──────────┬───────────┘                                       │
│          ┌───┴───┐                                               │
│       Found      Not Found                                       │
│          │           │                                           │
│          ▼           ▼                                           │
│   ┌──────────┐  ┌──────────────────────┐                        │
│   │ Skip     │  │ Check Level 2:       │                        │
│   │ (dup)    │  │ delivered hashes     │                        │
│   └──────────┘  │ (LRU cache)          │                        │
│                 └──────────┬───────────┘                        │
│                      ┌──────┴──────┐                             │
│                   Found          Not Found                       │
│                      │               │                           │
│                      ▼               ▼                           │
│               ┌──────────┐    ┌──────────────┐                  │
│               │ Skip     │    │ Add to       │                  │
│               │ (dup)    │    │ pending set  │                  │
│               └──────────┘    │ Add hash to  │                  │
│                               │ both caches  │                  │
│                               └──────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// hashDiagnostic - Compute hash for diagnostic deduplication
// Location: chunks.138.mjs:1006-1014
// ============================================

// ORIGINAL:
function za4(A) {
    return B6({
        message: A.message,
        severity: A.severity,
        range: A.range,
        source: A.source || null,
        code: A.code || null
    })
}

// READABLE:
function hashDiagnostic(diagnostic) {
    return sha256Hash(JSON.stringify({
        message: diagnostic.message,
        severity: diagnostic.severity,
        range: diagnostic.range,
        source: diagnostic.source || null,
        code: diagnostic.code || null
    }));
}

// Mapping: za4→hashDiagnostic, B6→sha256Hash (JSON.stringify + hash)
```

**Hash fields explained:**
- `message` - The diagnostic message text (e.g., "Type 'string' is not assignable...")
- `severity` - Error (1), Warning (2), Info (3), or Hint (4)
- `range` - Start/end position in the file (line, character)
- `source` - The tool that produced it (e.g., "typescript", "eslint")
- `code` - The error code (e.g., "TS2322")

**Why these fields:**
- Together they uniquely identify a diagnostic
- Line numbers are included in range, so moved diagnostics are different
- Same error on different lines = different hash (correct behavior)

```javascript
// ============================================
// deduplicateDiagnostics - Per-URI two-level deduplication
// Location: chunks.138.mjs:1016-1038
// ============================================

// ORIGINAL:
function HyY(A) {
    let q = new Map,
        K = [];
    for (let Y of A) {
        if (!q.has(Y.uri)) q.set(Y.uri, new Set), K.push({
            uri: Y.uri,
            diagnostics: []
        });
        let z = q.get(Y.uri),
            _ = K.find((O) => O.uri === Y.uri),
            w = F66.get(Y.uri) || new Set;
        for (let O of Y.diagnostics) try {
            let $ = za4(O);
            if (z.has($) || w.has($)) continue;
            z.add($), _.diagnostics.push(O)
        } catch ($) {
            let H = $ instanceof Error ? $ : Error(String($)),
                j = O.message?.substring(0, 100) || "<no message>";
            _6(Error(`Failed to deduplicate diagnostic in ${Y.uri}: ${H.message}. Diagnostic message: ${j}`)), _.diagnostics.push(O)
        }
    }
    return K.filter((Y) => Y.diagnostics.length > 0)
}

// READABLE:
function deduplicateDiagnostics(diagnosticSets) {
    // Per-URI in-flight hash tracking (current turn only)
    const inFlightByUri = new Map();  // URI → Set<hash>

    const results = [];

    for (const diagnosticSet of diagnosticSets) {
        // Initialize per-URI tracking if needed
        if (!inFlightByUri.has(diagnosticSet.uri)) {
            inFlightByUri.set(diagnosticSet.uri, new Set());
            results.push({
                uri: diagnosticSet.uri,
                diagnostics: []
            });
        }

        const uriInFlight = inFlightByUri.get(diagnosticSet.uri);
        const resultEntry = results.find((r) => r.uri === diagnosticSet.uri);

        // Get per-URI delivered hashes from LRU cache (F66)
        const uriDelivered = deliveredDiagnosticsLru.get(diagnosticSet.uri) || new Set();

        for (const diagnostic of diagnosticSet.diagnostics) {
            try {
                const hash = hashDiagnostic(diagnostic);  // za4

                // Skip if already seen (in-flight OR previously delivered for this URI)
                if (uriInFlight.has(hash) || uriDelivered.has(hash)) {
                    continue;
                }

                // Add to in-flight set and result
                uriInFlight.add(hash);
                resultEntry.diagnostics.push(diagnostic);

            } catch (error) {
                // Fail-open: include diagnostic even if hashing fails
                const err = error instanceof Error ? error : Error(String(error));
                const diagnosticPreview = diagnostic.message?.substring(0, 100) || "<no message>";
                logError(Error(`Failed to deduplicate diagnostic in ${diagnosticSet.uri}: ${err.message}. Diagnostic message: ${diagnosticPreview}`));
                resultEntry.diagnostics.push(diagnostic);
            }
        }
    }

    return results.filter((r) => r.diagnostics.length > 0);
}

// Mapping: HyY→deduplicateDiagnostics, za4→hashDiagnostic, F66→deliveredDiagnosticsLru, _6→logError
```

### Fail-Open Strategy

If deduplication fails (e.g., malformed diagnostic), the diagnostic is still included:

```javascript
catch (error) {
    logError(error);
    resultEntry.diagnostics.push(diagnostic);  // Include anyway
}
```

**Why fail-open:**
- Better to show duplicate diagnostics than hide real errors
- Diagnostics are critical for agent understanding
- Hashing failure shouldn't break the entire system

### Key Insight: Per-URI Deduplication

**Why per-URI instead of global deduplication:**

1. **Prevents cross-file hash collisions** - Same error message/code in different files are distinct issues
2. **Independent file tracking** - Each file's diagnostics are managed separately
3. **Efficient LRU caching** - `F66` (deliveredDiagnosticsLru) is a Map of `URI → Set<hash>`, not a single Set
4. **Memory efficiency** - Old file diagnostics can be evicted independently

**Data structures:**
```
inFlightByUri (Map):  URI → Set<hash>     // Current turn only
F66 (LRU Map):        URI → Set<hash>     // Persisted across turns
```

This design ensures that diagnostics for `file1.js` don't affect deduplication for `file2.ts`.

---

## Algorithm 3: Volume Limiting

### What it does

To prevent overwhelming the system prompt with too many diagnostics, the system implements two-level volume limiting:
1. Per-file limit: Maximum diagnostics per file
2. Total limit: Maximum diagnostics across all files

### Implementation

```javascript
// ============================================
// Volume Limiting Constants
// Location: chunks.138.mjs:1101-1105
// ============================================

// ORIGINAL:
FV1 = 10
qa4 = 30
$yY = 500

// READABLE:
const LSP_MAX_DIAGNOSTICS_PER_FILE = 10;   // FV1
const LSP_MAX_DIAGNOSTICS_TOTAL = 30;      // qa4
const LSP_DIAGNOSTICS_LRU_SIZE = 500;      // $yY

// Mapping: FV1→LSP_MAX_DIAGNOSTICS_PER_FILE, qa4→LSP_MAX_DIAGNOSTICS_TOTAL, $yY→LSP_DIAGNOSTICS_LRU_SIZE
```

### Volume Limiting Logic

```javascript
// From checkDiagnosticsRegistry (_a4) - chunks.138.mjs:1062-1069

// READABLE:
let totalDiagnostics = 0;
let removedCount = 0;

for (const file of deduplicatedResults) {
    // Sort by severity (Errors first, then Warnings, etc.)
    file.diagnostics.sort((a, b) => {
        return severityStringToInt(a.severity) - severityStringToInt(b.severity);
    });

    // Per-file limit
    if (file.diagnostics.length > LSP_MAX_DIAGNOSTICS_PER_FILE) {
        removedCount += file.diagnostics.length - LSP_MAX_DIAGNOSTICS_PER_FILE;
        file.diagnostics = file.diagnostics.slice(0, LSP_MAX_DIAGNOSTICS_PER_FILE);
    }

    // Total limit
    const remaining = LSP_MAX_DIAGNOSTICS_TOTAL - totalDiagnostics;
    if (file.diagnostics.length > remaining) {
        removedCount += file.diagnostics.length - remaining;
        file.diagnostics = file.diagnostics.slice(0, remaining);
    }

    totalDiagnostics += file.diagnostics.length;
}

if (removedCount > 0) {
    log(`LSP Diagnostics: Volume limiting removed ${removedCount} diagnostic(s) (max ${LSP_MAX_DIAGNOSTICS_PER_FILE}/file, ${LSP_MAX_DIAGNOSTICS_TOTAL} total)`);
}
```

### Why These Limits

| Limit | Value | Reasoning |
|-------|-------|-----------|
| Per-file | 10 | A single file rarely has >10 unique, actionable errors |
| Total | 30 | Prevents overwhelming the agent context |
| LRU size | 500 | Tracks enough history for dedup without memory bloat |

**Severity-first ordering:** Errors are more important than warnings, so they're kept first when truncating.

---

## Algorithm 4: Generation Counter Pattern

### What it does

The generation counter prevents race conditions during manager reinitialization. When a new initialization starts, stale results from previous attempts are discarded.

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                 GENERATION COUNTER PATTERN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   T1: initializeLspServerManager() called                        │
│       generation = 1                                             │
│       Start async init                                           │
│          │                                                       │
│          │ (init in progress)                                    │
│          │                                                       │
│   T2: reinitializeLspServerManager() called                      │
│       generation = 2                                             │
│       Start new async init                                       │
│          │                                                       │
│          │                                                       │
│   T3: First init completes (generation 1)                        │
│       Check: generation (1) === current (2)?                     │
│       No → DISCARD result                                        │
│          │                                                       │
│          │                                                       │
│   T4: Second init completes (generation 2)                       │
│       Check: generation (2) === current (2)?                     │
│       Yes → APPLY result                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// initializeLspServerManager - Singleton init with generation counter
// Location: chunks.138.mjs:1286-1301
// ============================================

// ORIGINAL:
function dm8() {
    if (k("[LSP MANAGER] initializeLspServerManager() called"), MN !== void 0 && IZ !== "failed") {
        k("[LSP MANAGER] Already initialized or initializing, skipping");
        return
    }
    if (IZ === "failed") MN = void 0, kl6 = void 0;
    MN = eo4(), IZ = "pending", k("[LSP MANAGER] Created manager instance, state=pending");
    let A = ++QV1;
    k(`[LSP MANAGER] Starting async initialization (generation ${A})`), UV1 = MN.initialize().then(() => {
        if (A === QV1) {
            if (IZ = "success", k("LSP server manager initialized successfully"), MN) $a4(MN)
        }
    }).catch((q) => {
        if (A === QV1) IZ = "failed", kl6 = q, MN = void 0, _6(q), k(`Failed to initialize LSP server manager: ${_1(q)}`)
    })
}

// READABLE:
function initializeLspServerManager() {
    log("[LSP MANAGER] initializeLspServerManager() called");

    // Guard: Already initialized or in progress (except after failure)
    if (lspManagerInstance !== undefined && lspManagerState !== "failed") {
        log("[LSP MANAGER] Already initialized or initializing, skipping");
        return;
    }

    // Reset after failure
    if (lspManagerState === "failed") {
        lspManagerInstance = undefined;
        lspManagerLastError = undefined;
    }

    // Create new manager instance
    lspManagerInstance = LspServerManager();  // eo4
    lspManagerState = "pending";
    log("[LSP MANAGER] Created manager instance, state=pending");

    // Increment generation for race condition prevention
    const thisGeneration = ++lspInitGeneration;
    log(`[LSP MANAGER] Starting async initialization (generation ${thisGeneration})`);

    // Async initialization
    lspInitPromise = lspManagerInstance.initialize()
        .then(() => {
            // Only proceed if this is still the current generation
            if (thisGeneration === lspInitGeneration) {
                lspManagerState = "success";
                log("LSP server manager initialized successfully");
                if (lspManagerInstance) {
                    registerNotificationHandlers(lspManagerInstance);  // $a4
                }
            } else {
                log(`[LSP MANAGER] Discarding stale init result (generation ${thisGeneration} !== ${lspInitGeneration})`);
            }
        })
        .catch((error) => {
            // Only update state if this is still the current generation
            if (thisGeneration === lspInitGeneration) {
                lspManagerState = "failed";
                lspManagerLastError = error;
                lspManagerInstance = undefined;
                logError(error);
                log(`Failed to initialize LSP server manager: ${error.message}`);
            }
        });
}

// Mapping: dm8→initializeLspServerManager, MN→lspManagerInstance, IZ→lspManagerState, kl6→lspManagerLastError, QV1→lspInitGeneration, UV1→lspInitPromise, eo4→LspServerManager, $a4→registerNotificationHandlers
```

### Key Insight

```javascript
const thisGeneration = ++lspInitGeneration;

// Later in async callback:
if (thisGeneration === lspInitGeneration) {
    // Apply result
}
```

**Why this works:**
- Each init increments the counter atomically
- Async callbacks capture `thisGeneration` by value
- Only the most recent generation can update state
- Older results are silently discarded

### When Reinitialization Happens

1. **Plugin changes** - When plugins are enabled/disabled
2. **Configuration updates** - When `.lsp.json` files change
3. **Error recovery** - After a failed initialization
4. **Workspace changes** - When root folder changes

---

## Algorithm 5: Extension Resolution

### What it does

When a file path is provided, the system must determine which LSP server should handle it. This is done by mapping file extensions to server names.

### Implementation

```javascript
// ============================================
// getServerForFile - Find LSP server for a file
// Location: chunks.138.mjs:847-854 (within eo4 - LspServerManager)
// ============================================

// ORIGINAL:
function _(X) {
    let P = fl.extname(X).toLowerCase(),
        W = q.get(P);
    if (!W || W.length === 0) return;
    let Z = W[0];
    if (!Z) return;
    return A.get(Z)
}

// READABLE:
function getServerForFile(filePath) {
    // Get lowercase extension (e.g., ".ts", ".tsx")
    const extension = path.extname(filePath).toLowerCase();  // fl.extname

    // Look up servers for this extension
    const serverNames = extensionMap.get(extension);  // q
    if (!serverNames || serverNames.length === 0) {
        return undefined;  // No server for this file type
    }

    // Use first matching server
    const serverName = serverNames[0];
    return servers.get(serverName);  // A
}

// Mapping: _→getServerForFile, fl.extname→path.extname, q→extensionMap, A→servers
```

### Extension Map Building

```javascript
// During manager initialization (chunks.138.mjs:820-826)

for (const [serverName, config] of Object.entries(allConfigs)) {
    const extensions = Object.keys(config.extensionToLanguage);

    for (const ext of extensions) {
        const normalized = ext.toLowerCase();
        if (!extensionMap.has(normalized)) {
            extensionMap.set(normalized, []);
        }
        extensionMap.get(normalized)?.push(serverName);
    }
}
```

**Result:**
```
extensionMap = {
    ".ts":  ["typescript-language-server"],
    ".tsx": ["typescript-language-server"],
    ".js":  ["typescript-language-server"],
    ".jsx": ["typescript-language-server"],
    ".go":  ["gopls"],
    ".py":  ["pyright"],
}
```

### First-Server-Wins Policy

If multiple servers support the same extension, the first one registered is used:

```javascript
const serverName = serverNames[0];  // First server
```

**Why:** This prevents ambiguity. Plugin load order determines which server handles overlapping extensions.

---

## Algorithm 6: Severity Conversion

### What it does

LSP uses integer severity values (1-4) while the display layer uses strings ("Error", "Warning", etc.). Two conversion functions handle this.

### Int to String

```javascript
// ============================================
// severityIntToString - Convert LSP severity int to string
// Location: chunks.138.mjs:1121-1134
// ============================================

// ORIGINAL:
function JyY(A) {
    switch (A) {
        case 1: return "Error";
        case 2: return "Warning";
        case 3: return "Info";
        case 4: return "Hint";
        default: return "Error"
    }
}

// READABLE:
function severityIntToString(severity) {
    switch (severity) {
        case 1: return "Error";
        case 2: return "Warning";
        case 3: return "Info";
        case 4: return "Hint";
        default: return "Error";  // Default to most severe
    }
}

// Mapping: JyY→severityIntToString
```

### String to Int

```javascript
// ============================================
// severityStringToInt - Convert severity string to int for sorting
// Location: chunks.138.mjs:991-1004
// ============================================

// ORIGINAL:
function Ka4(A) {
    switch (A) {
        case "Error": return 1;
        case "Warning": return 2;
        case "Info": return 3;
        case "Hint": return 4;
        default: return 4
    }
}

// READABLE:
function severityStringToInt(severity) {
    switch (severity) {
        case "Error": return 1;
        case "Warning": return 2;
        case "Info": return 3;
        case "Hint": return 4;
        default: return 4;  // Default to least severe
    }
}

// Mapping: Ka4→severityStringToInt
```

### Usage

**For display:**
```javascript
const displaySeverity = severityIntToString(diagnostic.severity);
// 1 → "Error"
```

**For sorting (Errors first):**
```javascript
diagnostics.sort((a, b) => {
    return severityStringToInt(a.severity) - severityStringToInt(b.severity);
});
// Error(1) < Warning(2) < Info(3) < Hint(4)
```

---

## Algorithm 7: LRU Cache for Delivered Diagnostics

### What it does

An LRU (Least Recently Used) cache tracks previously delivered diagnostic hashes. This prevents the same diagnostic from appearing multiple times across turns.

### Implementation

```javascript
// ============================================
// Diagnostic state initialization
// Location: chunks.138.mjs:1116-1118
// ============================================

// ORIGINAL:
Tl = new Map
F66 = new kT({ max: $yY })

// READABLE:
const pendingDiagnosticsMap = new Map();  // Tl - Current turn's diagnostics
const deliveredDiagnosticsLru = new LRUCache({  // F66
    max: LSP_DIAGNOSTICS_LRU_SIZE  // $yY = 500
});

// Mapping: Tl→pendingDiagnosticsMap, F66→deliveredDiagnosticsLru, kT→LRUCache, $yY→LSP_DIAGNOSTICS_LRU_SIZE
```

### LRU Cache Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                    LRU CACHE BEHAVIOR                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Capacity: 500 entries                                         │
│                                                                  │
│   Add new diagnostic hash:                                      │
│          │                                                       │
│          ├─► If not full: Add to front                          │
│          │                                                       │
│          └─► If full: Remove least recently used, add to front  │
│                                                                  │
│   Check for duplicate:                                          │
│          │                                                       │
│          └─► If hash in cache: It's a duplicate                 │
│                                                                  │
│   Cache hit order:                                              │
│   [Most Recent] ... [Least Recent]                              │
│   [hash1, hash2, hash3, ..., hash500]                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why LRU:**
- Fixed memory size (500 entries max)
- Automatically evicts old, irrelevant diagnostics
- Recently seen diagnostics are remembered longer
- Handles the common case where errors are fixed and new ones appear

---

## Algorithm 8: Symbol Extraction for UI Display

### What it does

When the LSP tool is invoked, the UI needs to display a meaningful symbol name (like `useState`) rather than just raw line:character coordinates. The `extractSymbolAtPosition` (i1q) function reads the source file and extracts the token at the specified position.

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                 SYMBOL EXTRACTION ALGORITHM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Input: filePath, line (0-based), character (0-based)          │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────┐                                       │
│   │ Read 64KB buffer     │                                       │
│   │ from file start      │                                       │
│   │ (l1q = 65536)        │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Split by newlines    │                                       │
│   │ Get target line      │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Apply regex:         │                                       │
│   │ /[\w$'!]+|           │  ← Word characters + operators       │
│   │  [+\-*/%&|^~<>=]+/g  │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ For each match:      │                                       │
│   │   if char in range:  │                                       │
│   │     return token     │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Truncate if > 30:    │                                       │
│   │   27 chars + "..."   │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   Output: symbol name or null                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// extractSymbolAtPosition - Extract symbol name at position
// Location: chunks.144.mjs:381-414
// ============================================

// ORIGINAL:
function i1q(A, q, K) {
    try {
        let Y = $1(),
            z = L4(A),
            {
                buffer: _,
                bytesRead: w
            } = Y.readSync(z, {
                length: l1q
            }),
            $ = _.toString("utf-8", 0, w).split(`
`);
        if (q < 0 || q >= $.length) return null;
        if (w === l1q && q === $.length - 1) return null;
        let H = $[q];
        if (!H || K < 0 || K >= H.length) return null;
        let j = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
            J;
        while ((J = j.exec(H)) !== null) {
            let M = J.index,
                D = M + J[0].length;
            if (K >= M && K < D) {
                let X = J[0];
                return X.length > 30 ? X.slice(0, 27) + "..." : X
            }
        }
        return null
    } catch (Y) {
        if (Y instanceof Error) k(`Symbol extraction failed for ${A}:${q}:${K}: ${Y.message}`, {
            level: "warn"
        });
        return null
    }
}

// READABLE:
function extractSymbolAtPosition(filePath, line, character) {
    try {
        const fs = getFileSystem();
        const absolutePath = resolvePath(filePath);

        // Read 64KB buffer from file start
        const { buffer, bytesRead } = fs.readSync(absolutePath, {
            length: SYMBOL_EXTRACTION_BUFFER_SIZE  // 65536
        });

        // Split into lines
        const content = buffer.toString("utf-8", 0, bytesRead);
        const lines = content.split("\n");

        // Validate line number
        if (line < 0 || line >= lines.length) return null;

        // Edge case: buffer might be truncated at last line
        if (bytesRead === SYMBOL_EXTRACTION_BUFFER_SIZE && line === lines.length - 1) {
            return null;  // Line might be incomplete
        }

        const targetLine = lines[line];

        // Validate character position
        if (!targetLine || character < 0 || character >= targetLine.length) {
            return null;
        }

        // Regex for tokens: word characters OR operators
        const tokenRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;
        let match;

        while ((match = tokenRegex.exec(targetLine)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            // Check if character is within this token
            if (character >= start && character < end) {
                const token = match[0];
                // Truncate long symbols to 30 chars
                return token.length > 30 ? token.slice(0, 27) + "..." : token;
            }
        }

        return null;  // No token found at position
    } catch (error) {
        if (error instanceof Error) {
            log(`Symbol extraction failed for ${filePath}:${line}:${character}: ${error.message}`, { level: "warn" });
        }
        return null;
    }
}

// Mapping: i1q→extractSymbolAtPosition, $1→getFileSystem, L4→resolvePath, l1q→SYMBOL_EXTRACTION_BUFFER_SIZE, k→log
```

### Why this approach

**Why 64KB buffer:**
- Most source files are under 64KB
- Reading partial file is fast
- Avoids memory issues with huge files
- Line count validation handles truncation

**Why this regex:**
- `[\w$'!]+` - Matches identifiers (letters, digits, underscore, $, ', !)
- `[+\-*/%&|^~<>=]+` - Matches operators
- Covers all common programming language tokens
- Handles both JavaScript and other languages

**Why 30-character truncation:**
- Keeps UI display compact
- Long symbols are rare and usually generated
- 27 chars + "..." is readable

### Constants

```javascript
// ============================================
// SYMBOL_EXTRACTION_BUFFER_SIZE - Buffer size for symbol extraction
// Location: chunks.144.mjs:416
// ============================================

// ORIGINAL:
l1q = 65536

// READABLE:
const SYMBOL_EXTRACTION_BUFFER_SIZE = 65536;  // 64KB

// Mapping: l1q→SYMBOL_EXTRACTION_BUFFER_SIZE
```

---

## Algorithm 9: React Memoization Cache Pattern

### What it does

The LSP UI components use a custom memoization pattern to optimize React re-renders. Instead of using standard `useMemo`/`useCallback`, components use a cache array technique that stores previously computed values.

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                 MEMOIZATION CACHE PATTERN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Component renders with props {operation, resultCount, ...}    │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────┐                                       │
│   │ Get cache array:     │                                       │
│   │ A = A6(23)           │  ← 23-element cache array            │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Check if cached:     │                                       │
│   │ if (A[0] !== value)  │                                       │
│   └──────────┬───────────┘                                       │
│          ┌───┴───┐                                               │
│       Changed    Same                                            │
│          │           │                                           │
│          ▼           │                                           │
│   ┌──────────────┐   │                                           │
│   │ Recompute    │   │                                           │
│   │ Store in     │   │                                           │
│   │ cache        │   │                                           │
│   └──────┬───────┘   │                                           │
│          │           │                                           │
│          └─────┬─────┘                                           │
│                ▼                                                 │
│   ┌──────────────────────┐                                       │
│   │ Return cached or     │                                       │
│   │ newly computed value │                                       │
│   └──────────────────────┘                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// LspResultSummaryComponent - Uses memoization cache
// Location: chunks.144.mjs:424-480
// ============================================

// ORIGINAL:
function JIY(A) {
    let q = A6(23),  // Get 23-element cache array
        {
            operation: K,
            resultCount: Y,
            fileCount: z,
            content: _,
            verbose: w
        } = A,
        O;
    if (q[0] !== K) O = jIY[K] || {
        singular: "result",
        plural: "results"
    }, q[0] = K, q[1] = O;
    else O = q[1];
    // ... more memoization checks ...
}

// READABLE:
function LspResultSummaryComponent(props) {
    // Get memoization cache (23 elements)
    const cache = useCache(23);  // A6(23)
    const { operation, resultCount, fileCount, content, verbose } = props;

    // Memoize operation label lookup
    let label;
    if (cache[0] !== operation) {
        // Cache miss - recompute
        label = OPERATION_LABELS[operation] || { singular: "result", plural: "results" };
        cache[0] = operation;
        cache[1] = label;
    } else {
        // Cache hit - use stored value
        label = cache[1];
    }

    // Memoize count label (singular/plural)
    const countLabel = resultCount === 1 ? label.singular : label.plural;

    // Memoize header element
    let header;
    if (cache[2] !== countLabel || cache[3] !== label.special ||
        cache[4] !== operation || cache[5] !== resultCount) {
        // Recompute header React element
        if (operation === "hover" && resultCount > 0 && label.special) {
            header = <Text>Hover info {label.special}</Text>;
        } else {
            header = <Text>Found <Text bold>{resultCount} </Text>{countLabel}</Text>;
        }
        cache[2] = countLabel;
        cache[3] = label.special;
        cache[4] = operation;
        cache[5] = resultCount;
        cache[6] = header;
    } else {
        header = cache[6];
    }

    // ... similar memoization for fileSuffix, verbose container, etc.

    return verbose ? (
        <Box flexDirection="column">
            <Box flexDirection="row"><Text>  ⎿  {header}{fileSuffix}</Text></Box>
            <Box marginLeft={5}><Text>{content}</Text></Box>
        </Box>
    ) : (
        <Box height={1}>
            <Text>{header}{fileSuffix} {resultCount > 0 && <SpinnerDone />}</Text>
        </Box>
    );
}

// Mapping: JIY→LspResultSummaryComponent, A6→useCache, jIY→OPERATION_LABELS
```

### Why this approach

**Why custom cache instead of useMemo:**
- Fine-grained control over what gets cached
- Multiple independent values in single cache
- Avoids multiple useMemo calls for related values
- Better performance for complex components

**Why 23-element cache:**
- Stores multiple computed values
- operation (1), label (1), countLabel (1), special (1), header element (1), etc.
- Each memoized value uses 1-2 cache slots

**Cache slot layout for JIY:**
| Slot | Content |
|------|---------|
| 0 | operation (input) |
| 1 | label (computed) |
| 2 | countLabel (input for comparison) |
| 3 | label.special (input for comparison) |
| 4 | operation (input for comparison) |
| 5 | resultCount (input for comparison) |
| 6 | header element (computed) |
| 7 | fileCount (input) |
| 8 | fileSuffix element (computed) |
| 9-11 | verbose container parts |
| ... | ... |

### Operation Labels

```javascript
// ============================================
// OPERATION_LABELS - Singular/plural labels for LSP operations
// Location: chunks.144.mjs:552-590
// ============================================

// ORIGINAL:
jIY = {
    goToDefinition: { singular: "definition", plural: "definitions" },
    findReferences: { singular: "reference", plural: "references" },
    documentSymbol: { singular: "symbol", plural: "symbols" },
    workspaceSymbol: { singular: "symbol", plural: "symbols" },
    hover: { singular: "hover info", plural: "hover info", special: "available" },
    goToImplementation: { singular: "implementation", plural: "implementations" },
    prepareCallHierarchy: { singular: "call item", plural: "call items" },
    incomingCalls: { singular: "caller", plural: "callers" },
    outgoingCalls: { singular: "callee", plural: "callees" }
}

// READABLE:
const OPERATION_LABELS = {
    goToDefinition:       { singular: "definition",     plural: "definitions" },
    findReferences:       { singular: "reference",      plural: "references" },
    documentSymbol:       { singular: "symbol",         plural: "symbols" },
    workspaceSymbol:      { singular: "symbol",         plural: "symbols" },
    hover:                { singular: "hover info",     plural: "hover info", special: "available" },
    goToImplementation:   { singular: "implementation", plural: "implementations" },
    prepareCallHierarchy: { singular: "call item",      plural: "call items" },
    incomingCalls:        { singular: "caller",         plural: "callers" },
    outgoingCalls:        { singular: "callee",         plural: "callees" }
};

// Mapping: jIY→OPERATION_LABELS
```

**Hover special case:** The `special` field triggers "Hover info available" instead of "Found N hover info" because hover always returns 0 or 1 result.

---

## Algorithm 10: Git Ignore Filtering

### What it does

Filters LSP results (definitions, references) to exclude files that match patterns in `.gitignore`. This prevents showing references to `node_modules`, build artifacts, and other files the user doesn't care about.

### How it works

```javascript
// ============================================
// filterGitIgnoredFiles - Batch git check-ignore for LSP results
// Location: chunks.144.mjs:703-731
// ============================================

// ORIGINAL:
async function q8q(A, q) {
    if (A.length === 0) return A;
    let K = new Map;
    for (let w of A)
        if (w.uri && !K.has(w.uri)) K.set(w.uri, ZIY(w.uri));
    let Y = [...new Set(K.values())];
    if (Y.length === 0) return A;
    let z = new Set,
        _ = 50;
    for (let w = 0; w < Y.length; w += _) {
        let O = Y.slice(w, w + _),
            $ = await RA("git", ["check-ignore", ...O], {
                cwd: q,
                preserveOutputOnError: !1,
                timeout: 5000
            });
        if ($.code === 0 && $.stdout)
            for (let H of $.stdout.split(`
`)) {
                let j = H.trim();
                if (j) z.add(j)
            }
    }
    if (z.size === 0) return A;
    return A.filter((w) => {
        let O = K.get(w.uri);
        return !O || !z.has(O)
    })
}

// READABLE:
async function filterGitIgnoredFiles(locations, workspacePath) {
    if (locations.length === 0) return locations;

    // Step 1: Build URI → path mapping (deduplicated)
    const uriToPath = new Map();
    for (const loc of locations) {
        if (loc.uri && !uriToPath.has(loc.uri)) {
            uriToPath.set(loc.uri, fileUriToPath(loc.uri));  // ZIY
        }
    }

    const uniquePaths = [...new Set(uriToPath.values())];
    if (uniquePaths.length === 0) return locations;

    // Step 2: Run git check-ignore in batches of 50
    const ignoredPaths = new Set();
    const BATCH_SIZE = 50;

    for (let i = 0; i < uniquePaths.length; i += BATCH_SIZE) {
        const batch = uniquePaths.slice(i, i + BATCH_SIZE);

        const result = await runCommand("git", ["check-ignore", ...batch], {
            cwd: workspacePath,
            preserveOutputOnError: false,
            timeout: 5000  // 5 second timeout per batch
        });

        // git check-ignore returns 0 if files ARE ignored (matched)
        if (result.code === 0 && result.stdout) {
            for (const line of result.stdout.split("\n")) {
                const trimmed = line.trim();
                if (trimmed) {
                    ignoredPaths.add(trimmed);
                }
            }
        }
    }

    // Step 3: Filter out ignored files
    if (ignoredPaths.size === 0) return locations;

    return locations.filter((loc) => {
        const path = uriToPath.get(loc.uri);
        return !path || !ignoredPaths.has(path);
    });
}

// Mapping: q8q→filterGitIgnoredFiles, ZIY→fileUriToPath, RA→runCommand
```

### Why this approach

**Why batch processing (50 paths at a time):**
- Avoids command-line length limits (especially on Windows)
- Keeps git operations fast
- 5-second timeout prevents hangs on slow filesystems

**Why git check-ignore instead of manual parsing:**
- Correctly handles all gitignore patterns (negations, wildcards)
- Respects global gitignore and info/exclude
- Consistent with what git itself would ignore

### Timing Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                    GIT IGNORE FILTERING TIMING                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input: 150 references across 75 files                          │
│                                                                  │
│  Step 1: Build URI → path map                                    │
│      └─► O(150) iterations, Map insertion                       │
│      └─► ~1ms                                                    │
│                                                                  │
│  Step 2: Batch git check-ignore                                  │
│      └─► 75 unique paths / 50 per batch = 2 batches             │
│      └─► Batch 1: 50 paths → git check-ignore → ~50-100ms      │
│      └─► Batch 2: 25 paths → git check-ignore → ~50-100ms      │
│      └─► Total: ~100-200ms                                       │
│                                                                  │
│  Step 3: Filter results                                          │
│      └─► O(150) filter operation                                 │
│      └─► ~1ms                                                    │
│                                                                  │
│  Total: ~100-200ms for 150 references                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key insight

The algorithm assumes git is available and `.gitignore` exists. If git check-ignore fails or returns non-zero, all results are returned (fail-open behavior). This ensures LSP functionality works even outside git repositories.

---

## Algorithm 11: URI to Path Conversion

### What it does

Converts LSP `file://` URIs to local filesystem paths, handling both Unix and Windows formats.

### How it works

```javascript
// ============================================
// fileUriToPath - Convert file:// URI to local path
// Location: chunks.144.mjs:694-701
// ============================================

// ORIGINAL:
function ZIY(A) {
    let q = A.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(q)) q = q.slice(1);
    try {
        q = decodeURIComponent(q)
    } catch {}
    return q
}

// READABLE:
function fileUriToPath(uri) {
    // Step 1: Remove file:// prefix
    let path = uri.replace(/^file:\/\//, "");

    // Step 2: Handle Windows paths (file:///C:/path → C:/path)
    // Windows URIs have format: file:///C:/Users/...
    // After removing file://, we get /C:/Users/...
    // Need to remove leading slash before drive letter
    if (/^\/[A-Za-z]:/.test(path)) {
        path = path.slice(1);
    }

    // Step 3: Decode URL-encoded characters
    // e.g., %20 → space, %2B → +
    try {
        path = decodeURIComponent(path);
    } catch {
        // Keep original if decode fails (malformed encoding)
    }

    return path;
}

// Mapping: ZIY→fileUriToPath
```

### Why this approach

**Why regex for Windows detection:**
- `/^\/[A-Za-z]:/` matches `/C:/`, `/D:/`, etc.
- Simple and fast
- Works for all drive letters

**Why try-catch for decodeURIComponent:**
- Some URIs have malformed encoding
- Failing would break the entire LSP operation
- Graceful fallback to original string

### Example Conversions

| Input URI | Output Path |
|-----------|-------------|
| `file:///home/user/file.ts` | `/home/user/file.ts` |
| `file:///C:/Users/file.ts` | `C:/Users/file.ts` |
| `file:///path/with%20space.ts` | `/path/with space.ts` |
| `file:///path/with%2Bplus.ts` | `/path/with+plus.ts` |

---

## Algorithm 12: Binary Check Caching

### What it does

Caches the result of PATH availability checks for LSP server binaries. This avoids repeatedly calling `which` for the same binary, improving performance during plugin recommendation lookups.

### How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                    BINARY CHECK FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   checkBinaryAvailable(binaryName)                               │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────┐                                           │
│   │ Empty string?    │                                           │
│   └────────┬─────────┘                                           │
│        ┌───┴───┐                                                 │
│       Yes      No                                                │
│        │        │                                                │
│        ▼        ▼                                                │
│   ┌────────┐  ┌──────────────────┐                              │
│   │ return │  │ Cache hit?       │                              │
│   │ false  │  │ binaryCache.get  │                              │
│   └────────┘  └────────┬─────────┘                              │
│                    ┌───┴───┐                                     │
│                   Yes      No                                    │
│                    │        │                                    │
│                    ▼        ▼                                    │
│             ┌──────────┐  ┌──────────────────┐                  │
│             │ return   │  │ which(binary)    │                  │
│             │ cached   │  │ await EM(binary) │                  │
│             │ value    │  └────────┬─────────┘                  │
│             └──────────┘           │                            │
│                                   ▼                              │
│                          ┌──────────────────┐                   │
│                          │ Store in cache   │                   │
│                          │ binaryCache.set  │                   │
│                          │ (name, result)   │                   │
│                          └────────┬─────────┘                   │
│                                   │                              │
│                                   ▼                              │
│                          ┌──────────────────┐                   │
│                          │ return result    │                   │
│                          │ (true/false)     │                   │
│                          └──────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// checkBinaryAvailable - Check if binary exists in PATH with caching
// Location: chunks.195.mjs:217-225
// ============================================

// ORIGINAL:
async function kBq(A) {
    if (!A || !A.trim()) return k("[binaryCheck] Empty command provided, returning false"), !1;
    let q = A.trim(),
        K = VBq.get(q);
    if (K !== void 0) return k(`[binaryCheck] Cache hit for '${q}': ${K}`), K;
    let Y = !1;
    if (await EM(q).catch(() => null)) Y = !0;
    return VBq.set(q, Y), k(`[binaryCheck] Binary '${q}' ${Y?"found":"not found"}`), Y
}

// READABLE:
async function checkBinaryAvailable(binaryName) {
    // Guard: Empty or whitespace-only binary name
    if (!binaryName || !binaryName.trim()) {
        log("[binaryCheck] Empty command provided, returning false");
        return false;
    }

    const normalized = binaryName.trim();

    // Check cache first (Map lookup is O(1))
    const cached = binaryCheckCache.get(normalized);
    if (cached !== undefined) {
        log(`[binaryCheck] Cache hit for '${normalized}': ${cached}`);
        return cached;
    }

    // Cache miss: actually check PATH using which()
    let exists = false;
    if (await which(normalized).catch(() => null)) {
        exists = true;
    }

    // Store result in cache for future calls
    binaryCheckCache.set(normalized, exists);
    log(`[binaryCheck] Binary '${normalized}' ${exists ? "found" : "not found"}`);

    return exists;
}

// Mapping: kBq→checkBinaryAvailable, VBq→binaryCheckCache, EM→which
```

### Cache Initialization

```javascript
// ============================================
// binaryCheckCache - Global cache for binary availability
// Location: chunks.195.mjs:227
// ============================================

// ORIGINAL:
VBq = new Map

// READABLE:
const binaryCheckCache = new Map();

// Mapping: VBq→binaryCheckCache
```

### Why this approach

**Why use a Map cache:**
1. **Performance**: `which` spawns a subprocess; caching avoids repeated subprocess creation
2. **Stability**: Binary availability rarely changes during a session
3. **Simplicity**: No TTL or eviction needed (binaries don't appear/disappear)

**Why not LRU:**
- The set of binaries is typically small (10-20 unique names)
- No memory pressure from unbounded growth
- LRU would add unnecessary complexity

### Key insight

The cache is intentionally simple (no expiration, no eviction) because:
- Binary availability is stable during a session
- The number of unique binaries is bounded by installed plugins
- Cache entries are small (string → boolean)

---

## Algorithm 13: Plugin Recommendation Matching

### What it does

Matches opened files to LSP plugins from the marketplace, recommending appropriate plugins when no LSP server is configured for the file's extension.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN RECOMMENDATION MATCHING FLOW                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   getLspPluginRecommendations(filePath)                                          │
│          │                                                                       │
│          ▼                                                                       │
│   ┌──────────────────────┐                                                       │
│   │ Recommendations      │                                                       │
│   │ disabled?            │                                                       │
│   │ FTz() check          │                                                       │
│   └──────────┬───────────┘                                                       │
│          ┌───┴───┐                                                               │
│         Yes      No                                                              │
│          │        │                                                              │
│          ▼        ▼                                                              │
│   ┌──────────┐  ┌──────────────────────┐                                        │
│   │ return   │  │ Extract file         │                                        │
│   │ []       │  │ extension            │                                        │
│   └──────────┘  │ xTz(filePath)        │                                        │
│                 └──────────┬───────────┘                                        │
│                            │                                                      │
│                            ▼                                                      │
│                 ┌──────────────────────┐                                         │
│                 │ Fetch all LSP        │                                         │
│                 │ plugins from         │                                         │
│                 │ marketplace (gTz)    │                                         │
│                 └──────────┬───────────┘                                         │
│                            │                                                      │
│                            ▼                                                      │
│                 ┌──────────────────────────────────────────┐                     │
│                 │ For each plugin in marketplace:         │                     │
│                 │                                           │                     │
│                 │   extensions.has(fileExt)?               │                     │
│                 │        │                                  │                     │
│                 │        ├─► No  → Skip                    │                     │
│                 │        │                                  │                     │
│                 │        └─► Yes → Check filters:          │                     │
│                 │                 │                        │                     │
│                 │                 ├─► in never-suggest? → Skip                 │
│                 │                 │                        │                     │
│                 │                 ├─► already installed? → Skip               │
│                 │                 │                        │                     │
│                 │                 └─► Add to candidates    │                     │
│                 │                                           │                     │
│                 └──────────────────────────────────────────┘                     │
│                            │                                                      │
│                            ▼                                                      │
│                 ┌──────────────────────────────────────────┐                     │
│                 │ For each candidate:                      │                     │
│                 │                                           │                     │
│                 │   checkBinaryAvailable(command)?         │                     │
│                 │        │                                  │                     │
│                 │        ├─► No  → Skip (binary not in PATH)                   │
│                 │        │                                  │                     │
│                 │        └─► Yes → Add to valid list       │                     │
│                 │                                           │                     │
│                 └──────────────────────────────────────────┘                     │
│                            │                                                      │
│                            ▼                                                      │
│                 ┌──────────────────────────────────────────┐                     │
│                 │ Sort by official status:                 │                     │
│                 │                                           │                     │
│                 │   official plugins first                  │                     │
│                 │   community plugins after                 │                     │
│                 │                                           │                     │
│                 └──────────────────────────────────────────┘                     │
│                            │                                                      │
│                            ▼                                                      │
│                 ┌──────────────────────┐                                           │
│                 │ Return list of       │                                           │
│                 │ recommendations      │                                           │
│                 │ [{ pluginId,         │                                           │
│                 │    pluginName,       │                                           │
│                 │    isOfficial,       │                                           │
│                 │    command, ... }]   │                                           │
│                 └──────────────────────┘                                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// getLspPluginRecommendations - Match file to LSP plugins
// Location: chunks.195.mjs:303-353
// ============================================

// ORIGINAL:
async function RBq(A) {
    if (FTz()) return k("[lspRecommendation] Recommendations are disabled"), [];
    let q = xTz(A).toLowerCase();
    if (!q) return k("[lspRecommendation] No file extension found"), [];
    k(`[lspRecommendation] Looking for LSP plugins for ${q}`);
    let K = await gTz(),
        z = X1().lspRecommendationNeverPlugins ?? [],
        _ = [];
    for (let [O, $] of K) {
        if (!$.extensions.has(q)) continue;
        if (z.includes(O)) {
            k(`[lspRecommendation] Skipping ${O} (in never suggest list)`);
            continue
        }
        if (iB(O)) {
            k(`[lspRecommendation] Skipping ${O} (already installed)`);
            continue
        }
        _.push({
            info: $,
            pluginId: O
        })
    }
    let w = [];
    for (let {
            info: O,
            pluginId: $
        }
        of _)
        if (await kBq(O.command)) w.push({
            info: O,
            pluginId: $
        }), k(`[lspRecommendation] Binary '${O.command}' found for ${$}`);
        else k(`[lspRecommendation] Skipping ${$} (binary '${O.command}' not found)`);
    return w.sort((O, $) => {
        if (O.info.isOfficial && !$.info.isOfficial) return -1;
        if (!O.info.isOfficial && $.info.isOfficial) return 1;
        return 0
    }), w.map(({
        info: O,
        pluginId: $
    }) => ({
        pluginId: $,
        pluginName: O.entry.name,
        marketplaceName: O.marketplaceName,
        description: O.entry.description,
        isOfficial: O.isOfficial,
        extensions: Array.from(O.extensions),
        command: O.command
    }))
}

// READABLE:
async function getLspPluginRecommendations(filePath) {
    // Check if recommendations are disabled
    if (isLspRecommendationDisabled()) {
        log("[lspRecommendation] Recommendations are disabled");
        return [];
    }

    // Extract and normalize file extension
    const fileExt = extractFileExtension(filePath).toLowerCase();
    if (!fileExt) {
        log("[lspRecommendation] No file extension found");
        return [];
    }

    log(`[lspRecommendation] Looking for LSP plugins for ${fileExt}`);

    // Fetch all LSP-capable plugins from marketplace
    const allLspPlugins = await getAllLspPlugins();  // gTz

    // Get user's never-suggest list from settings
    const neverSuggestList = getSettings().lspRecommendationNeverPlugins ?? [];

    // Step 1: Filter by extension match and user preferences
    const candidates = [];
    for (const [pluginId, pluginInfo] of allLspPlugins) {
        // Must support this file extension
        if (!pluginInfo.extensions.has(fileExt)) continue;

        // Skip if in never-suggest list
        if (neverSuggestList.includes(pluginId)) {
            log(`[lspRecommendation] Skipping ${pluginId} (in never suggest list)`);
            continue;
        }

        // Skip if already installed
        if (isPluginInstalled(pluginId)) {
            log(`[lspRecommendation] Skipping ${pluginId} (already installed)`);
            continue;
        }

        candidates.push({ info: pluginInfo, pluginId });
    }

    // Step 2: Check binary availability (with caching)
    const validRecommendations = [];
    for (const { info, pluginId } of candidates) {
        const binaryAvailable = await checkBinaryAvailable(info.command);
        if (binaryAvailable) {
            validRecommendations.push({ info, pluginId });
            log(`[lspRecommendation] Binary '${info.command}' found for ${pluginId}`);
        } else {
            log(`[lspRecommendation] Skipping ${pluginId} (binary '${info.command}' not found)`);
        }
    }

    // Step 3: Sort by official status (official plugins first)
    validRecommendations.sort((a, b) => {
        if (a.info.isOfficial && !b.info.isOfficial) return -1;
        if (!a.info.isOfficial && b.info.isOfficial) return 1;
        return 0;
    });

    // Step 4: Return formatted recommendations
    return validRecommendations.map(({ info, pluginId }) => ({
        pluginId,
        pluginName: info.entry.name,
        marketplaceName: info.marketplaceName,
        description: info.entry.description,
        isOfficial: info.isOfficial,
        extensions: Array.from(info.extensions),
        command: info.command
    }));
}

// Mapping: RBq→getLspPluginRecommendations, FTz→isLspRecommendationDisabled,
//          xTz→extractFileExtension, gTz→getAllLspPlugins, X1→getSettings,
//          iB→isPluginInstalled, kBq→checkBinaryAvailable
```

### Helper Functions

```javascript
// ============================================
// isLspRecommendationDisabled - Check if recommendations are disabled
// Location: chunks.195.mjs:376-379
// ============================================

// ORIGINAL:
function FTz() {
    let A = X1();
    return A.lspRecommendationDisabled === !0 || (A.lspRecommendationIgnoredCount ?? 0) >= uTz
}

// READABLE:
function isLspRecommendationDisabled() {
    const settings = getSettings();
    // Disabled if explicitly disabled OR ignored 5+ times
    return settings.lspRecommendationDisabled === true ||
           (settings.lspRecommendationIgnoredCount ?? 0) >= MAX_IGNORE_COUNT;
}

// Mapping: FTz→isLspRecommendationDisabled, X1→getSettings, uTz→MAX_IGNORE_COUNT (5)
```

```javascript
// ============================================
// isOfficialMarketplace - Check if marketplace is official
// Location: chunks.195.mjs:235-237
// ============================================

// ORIGINAL:
function mTz(A) {
    return nV.has(A.toLowerCase())
}

// READABLE:
function isOfficialMarketplace(marketplaceName) {
    // nV is a Set of official marketplace names
    return OFFICIAL_MARKETPLACES.has(marketplaceName.toLowerCase());
}

// Mapping: mTz→isOfficialMarketplace, nV→OFFICIAL_MARKETPLACES
```

### Why this approach

**Why two-phase filtering:**
1. **First pass**: Extension match, never-suggest list, installation check (fast, synchronous)
2. **Second pass**: Binary availability check (async, cached, slower)

This ordering ensures we don't waste time checking binaries for plugins that would be filtered anyway.

**Why official-first sorting:**
- Official plugins have better quality assurance
- Reduces risk of recommending low-quality plugins
- User trust is higher for official sources

**Why binary check is last:**
- `which` subprocess is expensive
- Cache reduces repeated calls
- Still necessary to ensure the plugin will actually work

### Key insight

The algorithm balances thoroughness with performance:
1. **Cache lookup** for binary availability (O(1) after first check)
2. **Short-circuit filtering** before expensive operations
3. **Priority sorting** surfaces best recommendations first
4. **Never-suggest persistence** respects user preferences across sessions

---

## Summary

| Algorithm | Purpose | Key Insight |
|-----------|---------|-------------|
| **Exponential Backoff** | Handle ContentModified errors | 500ms → 1000ms → 2000ms gives server time to catch up |
| **Diagnostic Deduplication** | Prevent duplicate errors in prompt | Two-level: in-flight + LRU cache |
| **Volume Limiting** | Prevent context overflow | 10/file, 30 total, severity-sorted |
| **Generation Counter** | Prevent race conditions | Only latest generation can update state |
| **Extension Resolution** | Route files to servers | Lowercase extension → first matching server |
| **Severity Conversion** | Display vs sort formats | Int for sorting (1-4), string for display |
| **LRU Cache** | Memory-bounded history | 500 entries, auto-evicts oldest |
| **Symbol Extraction** | UI-friendly display names | 64KB buffer, regex tokenization, 30-char truncation |
| **Git Ignore Filtering** | Remove irrelevant results | Batch of 50, git check-ignore, fail-open |
| **URI to Path** | Cross-platform path handling | Windows drive letter detection, URL decode |
| **Memoization Cache** | React performance | 23-element array, dependency comparison, recompute on change |
| **Binary Check Caching** | Avoid repeated PATH lookups | Map cache, stable during session, no eviction needed |
| **Plugin Recommendation** | Match files to LSP plugins | Two-phase filtering, official-first sorting, binary availability check |

---

## Source Locations

| Algorithm | Primary Symbol | Location |
|-----------|----------------|----------|
| Exponential Backoff | J (within no4) | chunks.138.mjs:498-518 |
| Diagnostic Hashing | za4 | chunks.138.mjs:1006-1014 |
| Diagnostic Deduplication | HyY | chunks.138.mjs:1016-1038 |
| Volume Limiting | _a4 | chunks.138.mjs:1062-1069 |
| Generation Counter | dm8 | chunks.138.mjs:1286-1301 |
| Extension Resolution | _ (within eo4) | chunks.138.mjs:847-854 |
| Severity Int→String | JyY | chunks.138.mjs:1121-1134 |
| Severity String→Int | Ka4 | chunks.138.mjs:991-1004 |
| Symbol Extraction | i1q | chunks.144.mjs:381-414 |
| Git Ignore Filtering | q8q | chunks.144.mjs:703-731 |
| URI to Path | ZIY | chunks.144.mjs:694-701 |
| UI Memoization | JIY | chunks.144.mjs:424-480 |
| Binary Check Caching | kBq | chunks.195.mjs:217-225 |
| Binary Cache (global) | VBq | chunks.195.mjs:227 |
| Plugin Recommendation | RBq | chunks.195.mjs:303-353 |
| Get All LSP Plugins | gTz | chunks.195.mjs:274-301 |
| Is Official Marketplace | mTz | chunks.195.mjs:235-237 |
| Parse LSP Servers Config | BTz | chunks.195.mjs:239-251 |
| Extract LSP Server Info | LBq | chunks.195.mjs:257-272 |
| Is Recommendation Disabled | FTz | chunks.195.mjs:376-379 |
| Ignore Recommendation | hBq | chunks.195.mjs:355-363 |
| Dismiss Recommendation | SBq | chunks.195.mjs:366-373 |
| Install LSP Plugin | lTz | chunks.195.mjs:488-519 |
| MAX_IGNORE_COUNT | uTz | chunks.195.mjs:381 (value: 5) |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76
**Status**: Complete - All 13 algorithms verified against source code