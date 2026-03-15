# LSP Integration - Error Handling Analysis

## Overview

The LSP integration implements a robust error handling strategy that covers:
- Server initialization failures
- Request timeouts and retries
- Server crash recovery
- Diagnostic processing errors
- UI error notifications

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `CONTENT_MODIFIED_ERROR_CODE` (qvY) - Retry trigger error code
- `LSP_MAX_RETRIES` (fkA) - Maximum retry attempts
- `LSP_RETRY_BASE_DELAY_MS` (KvY) - Retry delay base
- `getLspManagerStatus` (W51) - Status accessor with error info
- `clearDeliveredDiagnosticsForUri` (NP6) - Diagnostic cache clearing

---

## 1. Request Retry Mechanism

### Retry Constants

```javascript
// ============================================
// LSP Retry Configuration Constants
// Location: chunks.133.mjs:1959-1963
// ============================================

// ORIGINAL:
qvY = -32801
fkA = 3
KvY = 500

// READABLE:
const CONTENT_MODIFIED_ERROR_CODE = -32801;  // LSP standard error for concurrent modification
const LSP_MAX_RETRIES = 3;                   // Maximum retry attempts
const LSP_RETRY_BASE_DELAY_MS = 500;         // Base delay for exponential backoff

// Mapping: qvY→CONTENT_MODIFIED_ERROR_CODE, fkA→LSP_MAX_RETRIES, KvY→LSP_RETRY_BASE_DELAY_MS
```

### Content Modified Error Handling

**What it does:** When an LSP server returns error code `-32801` (Content Modified), it means the document was modified while the request was being processed. The client should retry the request.

**Why this approach:**
- The LSP 3.0 specification defines `-32801` as the standard error for this scenario
- Retrying allows the request to succeed once the server has caught up
- Exponential backoff prevents overwhelming the server

**Retry algorithm:**

```javascript
// ============================================
// LSP Request Retry Logic (conceptual)
// Location: chunks.133.mjs (within Fm4)
// ============================================

// READABLE (conceptual):
async function sendRequestWithRetry(method, params, retryCount = 0) {
    try {
        return await this.connection.sendRequest(method, params);
    } catch (error) {
        if (error.code === CONTENT_MODIFIED_ERROR_CODE && retryCount < LSP_MAX_RETRIES) {
            const delay = LSP_RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);
            await sleep(delay);
            return sendRequestWithRetry(method, params, retryCount + 1);
        }
        throw error;
    }
}
```

**Key insight:** The exponential backoff (`delay = 500 * 2^retryCount`) gives the LSP server time to stabilize. With `MAX_RETRIES = 3`, the delays are 500ms, 1000ms, and 2000ms — totaling 3.5 seconds maximum before failure.

---

## 2. Server State Management

### State Transitions

The LSP manager tracks server state with a simple state machine:

```
            ┌──────────────┐
            │  not-started │  ← Initial state
            └──────┬───────┘
                   │ initialize()
                   ▼
            ┌──────────────┐
            │    pending   │  ← Initialization in progress
            └──────┬───────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   ┌────────────┐    ┌────────────┐
   │   success  │    │   failed   │
   └────────────┘    └────────────┘
```

### Status Accessor

```javascript
// ============================================
// getLspManagerStatus - Returns current manager state
// Location: chunks.133.mjs:2620-2634
// ============================================

// ORIGINAL:
function W51() {
    if (ev === "failed") return {
        status: "failed",
        error: vP6 || Error("Initialization failed")
    };
    if (ev === "not-started") return {
        status: "not-started"
    };
    if (ev === "pending") return {
        status: "pending"
    };
    return {
        status: "success"
    }
}

// READABLE:
function getLspManagerStatus() {
    if (lspManagerState === "failed") {
        return {
            status: "failed",
            error: lspManagerLastError || Error("Initialization failed")
        };
    }
    if (lspManagerState === "not-started") {
        return { status: "not-started" };
    }
    if (lspManagerState === "pending") {
        return { status: "pending" };
    }
    return { status: "success" };
}

// Mapping: W51→getLspManagerStatus, ev→lspManagerState, vP6→lspManagerLastError
```

**Why this design:**
- The singleton pattern ensures one manager instance across the application
- The generation counter (`TP6`) prevents race conditions during reinitialization
- Error propagation allows UI to display meaningful messages

---

## 3. Diagnostic Processing Errors

### Error Recovery in Deduplication

```javascript
// ============================================
// jvY - Deduplication with error handling
// Location: chunks.133.mjs:2388-2409
// ============================================

// ORIGINAL (partial):
function jvY(A) {
    let q = new Map, K = [];
    for (let Y of A) {
        // ... setup code ...
        for (let $ of Y.diagnostics) try {
            let O = am4($);
            if (z.has(O) || H.has(O)) continue;
            z.add(O), w.diagnostics.push($)
        } catch (O) {
            let _ = O instanceof Error ? O : Error(String(O)),
                J = $.message?.substring(0, 100) || "<no message>";
            K1(Error(`Failed to deduplicate diagnostic in ${Y.uri}: ${_.message}. Diagnostic message: ${J}`)), w.diagnostics.push($)
        }
    }
    return K.filter((Y) => Y.diagnostics.length > 0)
}

// READABLE (partial):
function deduplicateDiagnostics(diagnosticFiles) {
    // ... setup ...
    for (const diagnostic of file.diagnostics) {
        try {
            const hash = hashDiagnostic(diagnostic);
            if (seenHashes.has(hash) || deliveredHashes.has(hash)) continue;
            seenHashes.add(hash);
            file.diagnostics.push(diagnostic);
        } catch (error) {
            // Log error but include diagnostic anyway (fail-open)
            logError(`Failed to deduplicate diagnostic in ${file.uri}: ${error.message}`);
            file.diagnostics.push(diagnostic);
        }
    }
    return files.filter(f => f.diagnostics.length > 0);
}

// Mapping: jvY→deduplicateDiagnostics, am4→hashDiagnostic
```

**Fail-open strategy:** If deduplication fails (e.g., malformed diagnostic), the diagnostic is still included in the output. This ensures users see errors even if processing is imperfect.

### Diagnostic Hashing Errors

```javascript
// ============================================
// am4 - Hash diagnostic with fallback
// Location: chunks.133.mjs:2378-2385
// ============================================

// ORIGINAL:
function am4(A) {
    return Q1({
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

// Mapping: am4→hashDiagnostic, Q1→sha256Hash
```

---

## 4. URI Conversion Errors

```javascript
// ============================================
// WvY - URI to path conversion with fallback
// Location: chunks.133.mjs:2502-2529
// ============================================

// ORIGINAL (partial):
function WvY(A) {
    let q;
    try {
        q = A.uri.startsWith("file://") ? MvY(A.uri) : A.uri
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        K1(z), h(`Failed to convert URI to file path: ${A.uri}. Error: ${z.message}. Using original URI as fallback.`), q = A.uri
    }
    // ... rest of function ...
}

// READABLE:
function convertDiagnosticUriToPath(diagnosticParams) {
    let filePath;
    try {
        filePath = diagnosticParams.uri.startsWith("file://")
            ? fileUriToPath(diagnosticParams.uri)  // MvY
            : diagnosticParams.uri;
    } catch (error) {
        logError(error);
        log(`Failed to convert URI to file path: ${diagnosticParams.uri}. Using original URI as fallback.`);
        filePath = diagnosticParams.uri;  // Fallback to original URI
    }
    // ... process diagnostics ...
}

// Mapping: WvY→convertDiagnosticUriToPath, MvY→fileUriToPath
```

**Key insight:** The fallback to the original URI ensures diagnostics are not lost even if URI parsing fails. This is critical for non-standard URI schemes.

---

## 5. Configuration Validation Errors

### Zod Schema Validation

```javascript
// ============================================
// HvY - Plugin LSP config loading with validation
// Location: chunks.133.mjs:1980-2009
// ============================================

// ORIGINAL (partial):
async function HvY(A, q = []) {
    let K = {}, Y = YvY(A.path, ".lsp.json");
    try {
        let z = await gm4(Y, "utf-8"),
            w = _A(z),
            H = u.record(u.string(), ew1).safeParse(w);
        if (H.success) Object.assign(K, H.data);
        else {
            let $ = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${H.error.message}`;
            K1(Error($)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: H.error.message,
                source: "plugin"
            })
        }
    } catch (z) {
        if (z.code !== "ENOENT") {
            // ... error handling ...
        }
    }
    // ...
}

// READABLE:
async function loadPluginLspConfig(plugin, errors = []) {
    const configs = {};
    const lspConfigPath = path.join(plugin.path, ".lsp.json");

    try {
        const content = await fs.readFile(lspConfigPath, "utf-8");
        const parsed = JSON.parse(content);

        // Zod validation
        const result = lspServerConfigSchema.record().safeParse(parsed);
        if (result.success) {
            Object.assign(configs, result.data);
        } else {
            // Validation failed - record error but continue
            const message = `LSP config validation failed for .lsp.json in plugin ${plugin.name}: ${result.error.message}`;
            logError(Error(message));
            errors.push({
                type: "lsp-config-invalid",
                plugin: plugin.name,
                serverName: ".lsp.json",
                validationError: result.error.message,
                source: "plugin"
            });
        }
    } catch (error) {
        if (error.code !== "ENOENT") {  // Ignore missing file
            // Handle other errors
        }
    }
    return Object.keys(configs).length > 0 ? configs : undefined;
}

// Mapping: HvY→loadPluginLspConfig, YvY→path.join, gm4→fs.readFile, _A→JSON.parse, ew1→lspServerConfigSchema
```

**Error collection pattern:** Errors are collected in an array (`q`) rather than thrown immediately. This allows processing to continue and report all validation issues at once.

---

## 6. Server Startup Errors

### Manager Initialization Error Handling

```javascript
// ============================================
// KF4 - LSP manager initialization with error handling
// Location: chunks.133.mjs:2641-2656
// ============================================

// ORIGINAL:
function KF4() {
    if (h("[LSP MANAGER] initializeLspServerManager() called"), jI !== void 0 && ev !== "failed") {
        h("[LSP MANAGER] Already initialized or initializing, skipping");
        return
    }
    if (ev === "failed") jI = void 0, vP6 = void 0;
    jI = lm4(), ev = "pending", h("[LSP MANAGER] Created manager instance, state=pending");
    let A = ++TP6;
    h(`[LSP MANAGER] Starting async initialization (generation ${A})`), EP6 = jI.initialize().then(() => {
        if (A === TP6) {
            if (ev = "success", h("LSP server manager initialized successfully"), jI) em4(jI)
        }
    }).catch((q) => {
        if (A === TP6) ev = "failed", vP6 = q, jI = void 0, K1(q), h(`Failed to initialize LSP server manager: ${q instanceof Error?q.message:String(q)}`)
    })
}

// READABLE:
function initializeLspServerManager() {
    log("[LSP MANAGER] initializeLspServerManager() called");

    // Guard: Already initialized
    if (lspManagerInstance !== undefined && lspManagerState !== "failed") {
        log("[LSP MANAGER] Already initialized or initializing, skipping");
        return;
    }

    // Reset on retry after failure
    if (lspManagerState === "failed") {
        lspManagerInstance = undefined;
        lspManagerLastError = undefined;
    }

    // Create manager and set state
    lspManagerInstance = LspServerManager();  // lm4
    lspManagerState = "pending";
    log("[LSP MANAGER] Created manager instance, state=pending");

    const generation = ++lspInitGeneration;
    log(`[LSP MANAGER] Starting async initialization (generation ${generation})`);

    lspInitPromise = lspManagerInstance.initialize()
        .then(() => {
            // Only proceed if this is still the current generation
            if (generation === lspInitGeneration) {
                lspManagerState = "success";
                log("LSP server manager initialized successfully");
                if (lspManagerInstance) {
                    registerNotificationHandlers(lspManagerInstance);  // em4
                }
            }
        })
        .catch((error) => {
            // Only update state if this is still the current generation
            if (generation === lspInitGeneration) {
                lspManagerState = "failed";
                lspManagerLastError = error;
                lspManagerInstance = undefined;
                logError(error);
                log(`Failed to initialize LSP server manager: ${error.message}`);
            }
        });
}

// Mapping: KF4→initializeLspServerManager, jI→lspManagerInstance, ev→lspManagerState, TP6→lspInitGeneration, EP6→lspInitPromise, lm4→LspServerManager, em4→registerNotificationHandlers
```

**Generation counter pattern:** The `TP6` (generation) counter prevents stale initialization results from overwriting newer attempts. If a new initialization starts before the previous one completes, the older result is discarded.

---

## 7. Tool-Level Error Handling

### Input Validation Errors

```javascript
// ============================================
// LspTool.validateInput - Input validation
// Location: chunks.140.mjs:731-765
// ============================================

// ORIGINAL:
async validateInput(A) {
    let q = Dd4.safeParse(A);
    if (!q.success) return {
        result: !1,
        message: `Invalid input: ${q.error.message}`,
        errorCode: 3
    };
    let K = b1(), Y = g4(A.filePath);
    if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
        result: !0
    };
    if (!K.existsSync(Y)) return {
        result: !1,
        message: `File does not exist: ${A.filePath}`,
        errorCode: 1
    };
    try {
        if (!K.statSync(Y).isFile()) return {
            result: !1,
            message: `Path is not a file: ${A.filePath}`,
            errorCode: 2
        }
    } catch (z) {
        let w = z instanceof Error ? z : Error(String(z));
        return K1(Error(`Failed to access file stats for LSP operation on ${A.filePath}: ${w.message}`)), {
            result: !1,
            message: `Cannot access file: ${A.filePath}. ${w.message}`,
            errorCode: 4
        }
    }
    return {
        result: !0
    }
}

// READABLE:
async validateInput(input) {
    // 1. Schema validation
    const parsed = lspInputSchemaStrict.safeParse(input);
    if (!parsed.success) {
        return {
            result: false,
            message: `Invalid input: ${parsed.error.message}`,
            errorCode: 3  // Validation error
        };
    }

    const fs = getFileSystem();
    const filePath = resolvePath(input.filePath);

    // 2. Skip validation for UNC paths (Windows network paths)
    if (filePath.startsWith("\\\\") || filePath.startsWith("//")) {
        return { result: true };
    }

    // 3. File existence check
    if (!fs.existsSync(filePath)) {
        return {
            result: false,
            message: `File does not exist: ${input.filePath}`,
            errorCode: 1  // File not found
        };
    }

    // 4. Is-file check
    try {
        if (!fs.statSync(filePath).isFile()) {
            return {
                result: false,
                message: `Path is not a file: ${input.filePath}`,
                errorCode: 2  // Not a file
            };
        }
    } catch (error) {
        logError(Error(`Failed to access file stats for LSP operation on ${input.filePath}`));
        return {
            result: false,
            message: `Cannot access file: ${input.filePath}. ${error.message}`,
            errorCode: 4  // Access error
        };
    }

    return { result: true };
}

// Mapping: Dd4→lspInputSchemaStrict, b1→getFileSystem, g4→resolvePath
```

**Error code mapping:**

| Code | Meaning | User Message |
|------|---------|--------------|
| 1 | File not found | "File does not exist: {path}" |
| 2 | Not a file | "Path is not a file: {path}" |
| 3 | Validation error | "Invalid input: {details}" |
| 4 | Access error | "Cannot access file: {path}" |

---

## Error Handling Summary

| Error Type | Handling Strategy | Recovery |
|------------|-------------------|----------|
| Content Modified (-32801) | Retry with exponential backoff | Up to 3 retries |
| Server crash | Log and report to UI | Manual restart or `restartOnCrash` (future) |
| Config validation | Collect errors, continue | Skip invalid configs, report issues |
| Diagnostic processing | Fail-open, include anyway | Log error, proceed |
| URI conversion | Fallback to original URI | Continue with original string |
| File access | Validate before request | Return error to user |
| Manager init failure | Track error, allow retry | Re-initialize on next attempt |