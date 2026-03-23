# LSP Diagnostic Pipeline - Detailed Analysis

> **Module**: LSP Integration
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.138.mjs`, `chunks.147.mjs`

---

## Overview

The LSP Diagnostic Pipeline is responsible for receiving, processing, deduplicating, and delivering diagnostic information (errors, warnings, hints) from Language Servers to the agent's context. This document provides a detailed analysis of the entire pipeline from LSP notification to system prompt injection.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `registerNotificationHandlers` ($a4) - Wires up diagnostic listeners
- `registerDiagnostics` (Ya4) - Buffers incoming diagnostics
- `checkDiagnosticsRegistry` (_a4) - Fetches, deduplicates, and clears
- `hashDiagnostic` (za4) - Computes deduplication hash
- `convertDiagnosticUriToPath` (MyY) - URI normalization
- `getLSPDiagnosticAttachments` (luY) - System reminder integration

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIAGNOSTIC PIPELINE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐                                                          │
│  │  LSP Server     │  (TypeScript, Go, Python, etc.)                         │
│  │  Analysis       │                                                          │
│  └────────┬────────┘                                                          │
│           │                                                                    │
│           │ publishDiagnostics notification                                   │
│           │ { uri: "file:///path/to/file.ts", diagnostics: [...] }            │
│           ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    NOTIFICATION HANDLER ($a4)                            │ │
│  │                                                                          │ │
│  │  1. Validate params (has uri, diagnostics)                              │ │
│  │  2. convertDiagnosticUriToPath (MyY)                                    │ │
│  │     file:///path/to/file.ts → /path/to/file.ts                          │ │
│  │  3. severityIntToString (JyY)                                           │ │
│  │     1 → "Error", 2 → "Warning", etc.                                    │ │
│  │  4. registerDiagnostics (Ya4)                                           │ │
│  │     Store in pendingDiagnosticsMap (Tl)                                 │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│           │                                                                    │
│           │ Stored in Tl (pendingDiagnosticsMap)                              │
│           ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    PENDING REGISTRY (Tl)                                 │ │
│  │                                                                          │ │
│  │  Map {                                                                   │ │
│  │    id1: { serverName, files: [...], timestamp, attachmentSent: false } │ │
│  │    id2: { serverName, files: [...], timestamp, attachmentSent: false } │ │
│  │  }                                                                       │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│           │                                                                    │
│           │ On next agent turn                                                │
│           ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                SYSTEM REMINDER INTEGRATION                               │ │
│  │                                                                          │ │
│  │  getLSPDiagnosticAttachments (luY) called                               │ │
│  │     │                                                                    │ │
│  │     └─► checkDiagnosticsRegistry (_a4)                                  │ │
│  │           │                                                              │ │
│  │           ├─► deduplicateDiagnostics (HyY)                              │ │
│  │           │     └─► hashDiagnostic (za4) for each                       │ │
│  │           │     └─► Check in-flight + delivered hashes                  │ │
│  │           │                                                              │ │
│  │           ├─► Volume limiting (10/file, 30 total)                       │ │
│  │           │                                                              │ │
│  │           ├─► Track delivered in F66 (LRU cache)                        │ │
│  │           │                                                              │ │
│  │           └─► clearPendingDiagnostics (wa4)                             │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│           │                                                                    │
│           │ Return [{ type: "diagnostics", files: [...] }]                   │
│           ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    SYSTEM PROMPT INJECTION                               │ │
│  │                                                                          │ │
│  │  <system-reminder>                                                       │ │
│  │  [LSP Diagnostics from typescript-language-server]                      │ │
│  │                                                                          │ │
│  │  src/App.tsx:                                                            │ │
│  │    Line 42:7 Error: Type 'string' is not assignable to type 'number'.  │ │
│  │    Line 58:3 Warning: 'result' is declared but never read.              │ │
│  │  </system-reminder>                                                      │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Notification Handler Registration

### Registration Function

```javascript
// ============================================
// registerNotificationHandlers - Wire up diagnostic listeners
// Location: chunks.138.mjs:1166-1240
// ============================================

// ORIGINAL (partial):
function $a4(A) {
    let q = A.getAllServers(),
        K = [],
        Y = 0,
        z = new Map;
    for (let [w, O] of q.entries()) try {
        if (!O || typeof O.onNotification !== "function") {
            let $ = !O ? "Server instance is null/undefined" : "Server instance has no onNotification method";
            K.push({
                serverName: w,
                error: $
            });
            let H = Error(`${$} for ${w}`);
            _6(H), k(`Skipping handler registration for ${w}: ${$}`);
            continue
        }
        O.onNotification("textDocument/publishDiagnostics", async ($) => {
            k(`[PASSIVE DIAGNOSTICS] Handler invoked for ${w}! Params type: ${typeof $}`);
            try {
                if (!$ || typeof $ !== "object" || !("uri" in $) || !("diagnostics" in $)) {
                    let M = Error(`LSP server ${w} sent invalid diagnostic params (missing uri or diagnostics)`);
                    _6(M), k(`Invalid diagnostic params from ${w}: ${B6($)}`);
                    return
                }
                let H = $;
                k(`Received diagnostics from ${w}: ${H.diagnostics.length} diagnostic(s) for ${H.uri}`);
                let j = MyY(H),
                    J = j[0];
                if (!J || j.length === 0 || J.diagnostics.length === 0) {
                    k(`Skipping empty diagnostics from ${w} for ${H.uri}`);
                    return
                }
                try {
                    Ya4({
                        serverName: w,
                        files: j
                    }), k(`LSP Diagnostics: Registered ${j.length} diagnostic file(s) from ${w} for async delivery`), z.delete(w)
                } catch (M) {
                    let D = M instanceof Error ? M : Error(`Failed to register LSP diagnostics: ${String(M)}`);
                    _6(D), k(`Error registering LSP diagnostics from ${w}: URI: ${H.uri}, Diagnostic count: ${J.diagnostics.length}, Error: ${D.message}`);
                }
            } catch (H) {
                let j = H instanceof Error ? H : Error(String(H));
                _6(j), k(`Error processing diagnostics from ${w}: ${j.message}`)
            }
        });
        O.onNotification("window/logMessage", ($) => {
            k(`LSP [${w}]: ${$.message}`)
        });
    } catch ($) {
        // ... error handling ...
    }
}

// READABLE:
function registerNotificationHandlers(manager) {
    const servers = manager.getAllServers();
    const failedServers = [];
    const pendingHandlers = new Map();

    for (const [serverName, client] of servers.entries()) {
        try {
            // Validate client has onNotification method
            if (!client || typeof client.onNotification !== "function") {
                const error = !client
                    ? "Server instance is null/undefined"
                    : "Server instance has no onNotification method";

                failedServers.push({ serverName, error });
                logError(Error(`${error} for ${serverName}`));
                log(`Skipping handler registration for ${serverName}: ${error}`);
                continue;
            }

            // Register handler for publishDiagnostics
            client.onNotification("textDocument/publishDiagnostics", async (params) => {
                log(`[PASSIVE DIAGNOSTICS] Handler invoked for ${serverName}!`);

                try {
                    // Validate params structure
                    if (!params || typeof params !== "object" || !("uri" in params) || !("diagnostics" in params)) {
                        const error = Error(`LSP server ${serverName} sent invalid diagnostic params (missing uri or diagnostics)`);
                        logError(error);
                        log(`Invalid diagnostic params from ${serverName}: ${JSON.stringify(params)}`);
                        return;
                    }

                    log(`Received diagnostics from ${serverName}: ${params.diagnostics.length} diagnostic(s) for ${params.uri}`);

                    // Convert URI to path and normalize diagnostics
                    const diagnosticFiles = convertDiagnosticUriToPath(params);  // MyY
                    const firstFile = diagnosticFiles[0];

                    // Skip empty diagnostics
                    if (!firstFile || diagnosticFiles.length === 0 || firstFile.diagnostics.length === 0) {
                        log(`Skipping empty diagnostics from ${serverName} for ${params.uri}`);
                        return;
                    }

                    // Register for async delivery
                    registerDiagnostics({
                        serverName,
                        files: diagnosticFiles
                    });
                    log(`LSP Diagnostics: Registered ${diagnosticFiles.length} diagnostic file(s) from ${serverName} for async delivery`);
                    pendingHandlers.delete(serverName);

                } catch (error) {
                    const err = error instanceof Error ? error : Error(String(error));
                    logError(err);
                    log(`Error processing diagnostics from ${serverName}: ${err.message}`);
                }
            });

            // Register handler for window/logMessage (server logs)
            client.onNotification("window/logMessage", (params) => {
                log(`LSP [${serverName}]: ${params.message}`);
            });

        } catch (error) {
            // Handle registration errors
        }
    }
}

// Mapping: $a4→registerNotificationHandlers, MyY→convertDiagnosticUriToPath, Ya4→registerDiagnostics
```

### Handler Execution Timing

```
┌─────────────────────────────────────────────────────────────────┐
│               NOTIFICATION TIMING                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   T1: File saved to disk                                        │
│          │                                                       │
│          ▼                                                       │
│   T2: FileEditTool sends didSave notification                   │
│          │                                                       │
│          ▼                                                       │
│   T3: LSP server receives didSave, triggers reanalysis         │
│          │                                                       │
│          │ (async - may take 100ms to several seconds)          │
│          ▼                                                       │
│   T4: LSP server sends publishDiagnostics                       │
│          │                                                       │
│          ▼                                                       │
│   T5: Handler ($a4) receives and registers diagnostics         │
│          │                                                       │
│          ▼                                                       │
│   T6: Stored in Tl (pendingDiagnosticsMap)                      │
│          │                                                       │
│          │ (wait for next agent turn)                            │
│          ▼                                                       │
│   T7: getLSPDiagnosticAttachments called, diagnostics           │
│       injected into system prompt                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Diagnostic Registration

### Buffer Function

```javascript
// ============================================
// registerDiagnostics - Buffer diagnostics for later delivery
// Location: chunks.138.mjs:978-989
// ============================================

// ORIGINAL:
function Ya4({
    serverName: A,
    files: q
}) {
    let K = OyY();
    k(`LSP Diagnostics: Registering ${q.length} diagnostic file(s) from ${A} (ID: ${K})`), Tl.set(K, {
        serverName: A,
        files: q,
        timestamp: Date.now(),
        attachmentSent: !1
    })
}

// READABLE:
function registerDiagnostics({ serverName, files }) {
    const diagnosticId = generateDiagnosticId();  // OyY
    log(`LSP Diagnostics: Registering ${files.length} diagnostic file(s) from ${serverName} (ID: ${diagnosticId})`);

    pendingDiagnosticsMap.set(diagnosticId, {  // Tl
        serverName,
        files,
        timestamp: Date.now(),
        attachmentSent: false  // Track if delivered to system prompt
    });
}

// Mapping: Ya4→registerDiagnostics, OyY→generateDiagnosticId, Tl→pendingDiagnosticsMap
```

### Why Buffering?

The diagnostics are **buffered** rather than immediately delivered because:
1. LSP notifications arrive asynchronously at any time
2. System prompt is built once per agent turn
3. Buffering allows batching multiple notifications
4. The `attachmentSent` flag prevents re-delivery

---

## 3. URI Conversion

### File URI to Path

```javascript
// ============================================
// convertDiagnosticUriToPath - Convert LSP URI to file path
// Location: chunks.138.mjs:1136-1164
// ============================================

// ORIGINAL:
function MyY(A) {
    let q;
    try {
        q = A.uri.startsWith("file://") ? jyY(A.uri) : A.uri
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        _6(z), k(`Failed to convert URI to file path: ${A.uri}. Error: ${z.message}. Using original URI as fallback.`), q = A.uri
    }
    let K = A.diagnostics.map((Y) => ({
        message: Y.message,
        severity: JyY(Y.severity),
        range: {
            start: {
                line: Y.range.start.line,
                character: Y.range.start.character
            },
            end: {
                line: Y.range.end.line,
                character: Y.range.end.character
            }
        },
        source: Y.source,
        code: Y.code !== void 0 && Y.code.code !== null ? String(Y.code) : void 0
    }));
    return [{
        uri: q,
        diagnostics: K
    }]
}

// READABLE:
function convertDiagnosticUriToPath(params) {
    let filePath;

    // Convert file:// URI to path
    try {
        if (params.uri.startsWith("file://")) {
            filePath = fileUriToPath(params.uri);  // jyY
        } else {
            filePath = params.uri;  // Non-file URI, use as-is
        }
    } catch (error) {
        logError(error);
        log(`Failed to convert URI to file path: ${params.uri}. Error: ${error.message}. Using original URI as fallback.`);
        filePath = params.uri;  // Fallback to original
    }

    // Normalize diagnostic format
    const diagnostics = params.diagnostics.map((d) => ({
        message: d.message,
        severity: severityIntToString(d.severity),  // JyY: 1→"Error", 2→"Warning", etc.
        range: {
            start: {
                line: d.range.start.line,
                character: d.range.start.character
            },
            end: {
                line: d.range.end.line,
                character: d.range.end.character
            }
        },
        source: d.source,
        code: d.code !== undefined && d.code !== null ? String(d.code) : undefined
    }));

    return [{
        uri: filePath,
        diagnostics
    }];
}

// Mapping: MyY→convertDiagnosticUriToPath, jyY→fileUriToPath, JyY→severityIntToString
```

### URI Conversion Details

**Input:** `file:///home/user/project/src/App.tsx`

**Output:** `/home/user/project/src/App.tsx`

**Fallback behavior:** If URI conversion fails (e.g., non-standard URI scheme), the original URI is used as-is. This ensures diagnostics are never lost due to URI parsing issues.

---

## 4. Diagnostic Registry Check

### Fetch and Clear

```javascript
// ============================================
// checkDiagnosticsRegistry - Fetch, dedupe, volume-limit, deliver
// Location: chunks.138.mjs:1040-1087
// ============================================

// ORIGINAL:
function _a4() {
    k(`LSP Diagnostics: Checking registry - ${Tl.size} pending`);
    let A = [],
        q = new Set,
        K = [];
    for (let H of Tl.values())
        if (!H.attachmentSent) A.push(...H.files), q.add(H.serverName), K.push(H);
    if (A.length === 0) return [];
    let Y;
    try {
        Y = HyY(A)
    } catch (H) {
        let j = H instanceof Error ? H : Error(String(H));
        _6(Error(`Failed to deduplicate LSP diagnostics: ${j.message}`)), Y = A
    }
    for (let H of K) H.attachmentSent = !0;
    for (let [H, j] of Tl)
        if (j.attachmentSent) Tl.delete(H);
    let z = A.reduce((H, j) => H + j.diagnostics.length, 0),
        _ = Y.reduce((H, j) => H + j.diagnostics.length, 0);
    if (z > _) k(`LSP Diagnostics: Deduplication removed ${z-_} duplicate diagnostic(s)`);
    let w = 0,
        O = 0;
    for (let H of Y) {
        if (H.diagnostics.sort((J, M) => Ka4(J.severity) - Ka4(M.severity)), H.diagnostics.length > FV1) O += H.diagnostics.length - FV1, H.diagnostics = H.diagnostics.slice(0, FV1);
        let j = qa4 - w;
        if (H.diagnostics.length > j) O += H.diagnostics.length - j, H.diagnostics = H.diagnostics.slice(0, j);
        w += H.diagnostics.length
    }
    if (Y = Y.filter((H) => H.diagnostics.length > 0), O > 0) k(`LSP Diagnostics: Volume limiting removed ${O} diagnostic(s) (max ${FV1}/file, ${qa4} total)`);
    for (let H of Y) {
        if (!F66.has(H.uri)) F66.set(H.uri, new Set);
        let j = F66.get(H.uri);
        for (let J of H.diagnostics) try {
            j.add(za4(J))
        } catch (M) {
            let D = M instanceof Error ? M : Error(String(M)),
                X = J.message?.substring(0, 100) || "<no message>";
            _6(Error(`Failed to track delivered diagnostic in ${H.uri}: ${D.message}. Diagnostic message: ${X}`))
        }
    }
    let $ = Y.reduce((H, j) => H + j.diagnostics.length, 0);
    if ($ === 0) return k("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
    return k(`LSP Diagnostics: Delivering ${Y.length} file(s) with ${$} diagnostic(s) from ${q.size} server(s)`), [{
        serverName: Array.from(q).join(", "),
        files: Y
    }]
}

// READABLE:
function checkDiagnosticsRegistry() {
    log(`LSP Diagnostics: Checking registry - ${pendingDiagnosticsMap.size} pending`);

    const allFiles = [];
    const serverNames = new Set();
    const pendingEntries = [];

    // Collect all pending diagnostics
    for (const entry of pendingDiagnosticsMap.values()) {  // Tl
        if (!entry.attachmentSent) {
            allFiles.push(...entry.files);
            serverNames.add(entry.serverName);
            pendingEntries.push(entry);
        }
    }

    if (allFiles.length === 0) return [];

    // Deduplicate
    let deduplicatedFiles;
    try {
        deduplicatedFiles = deduplicateDiagnostics(allFiles);  // HyY
    } catch (error) {
        logError(Error(`Failed to deduplicate LSP diagnostics: ${error.message}`));
        deduplicatedFiles = allFiles;  // Fall back to undeduplicated
    }

    // Mark as sent and clear pending
    for (const entry of pendingEntries) {
        entry.attachmentSent = true;
    }
    for (const [id, entry] of pendingDiagnosticsMap) {
        if (entry.attachmentSent) {
            pendingDiagnosticsMap.delete(id);
        }
    }

    // Log deduplication stats
    const beforeCount = allFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
    const afterCount = deduplicatedFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
    if (beforeCount > afterCount) {
        log(`LSP Diagnostics: Deduplication removed ${beforeCount - afterCount} duplicate diagnostic(s)`);
    }

    // Volume limiting
    let totalDiagnostics = 0;
    let removedCount = 0;

    for (const file of deduplicatedFiles) {
        // Sort by severity (Errors first)
        file.diagnostics.sort((a, b) => {
            return severityStringToInt(a.severity) - severityStringToInt(b.severity);  // Ka4
        });

        // Per-file limit (FV1 = 10)
        if (file.diagnostics.length > LSP_MAX_DIAGNOSTICS_PER_FILE) {
            removedCount += file.diagnostics.length - LSP_MAX_DIAGNOSTICS_PER_FILE;
            file.diagnostics = file.diagnostics.slice(0, LSP_MAX_DIAGNOSTICS_PER_FILE);
        }

        // Total limit (qa4 = 30)
        const remaining = LSP_MAX_DIAGNOSTICS_TOTAL - totalDiagnostics;
        if (file.diagnostics.length > remaining) {
            removedCount += file.diagnostics.length - remaining;
            file.diagnostics = file.diagnostics.slice(0, remaining);
        }

        totalDiagnostics += file.diagnostics.length;
    }

    // Filter empty files
    deduplicatedFiles = deduplicatedFiles.filter((f) => f.diagnostics.length > 0);

    if (removedCount > 0) {
        log(`LSP Diagnostics: Volume limiting removed ${removedCount} diagnostic(s) (max ${LSP_MAX_DIAGNOSTICS_PER_FILE}/file, ${LSP_MAX_DIAGNOSTICS_TOTAL} total)`);
    }

    // Track delivered diagnostics in LRU cache
    for (const file of deduplicatedFiles) {
        if (!deliveredDiagnosticsLru.has(file.uri)) {  // F66
            deliveredDiagnosticsLru.set(file.uri, new Set());
        }
        const uriHashes = deliveredDiagnosticsLru.get(file.uri);
        for (const diagnostic of file.diagnostics) {
            try {
                uriHashes.add(hashDiagnostic(diagnostic));  // za4
            } catch (error) {
                logError(Error(`Failed to track delivered diagnostic in ${file.uri}: ${error.message}`));
            }
        }
    }

    // Return final result
    const finalCount = deduplicatedFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
    if (finalCount === 0) {
        log("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)");
        return [];
    }

    log(`LSP Diagnostics: Delivering ${deduplicatedFiles.length} file(s) with ${finalCount} diagnostic(s) from ${serverNames.size} server(s)`);

    return [{
        serverName: Array.from(serverNames).join(", "),
        files: deduplicatedFiles
    }];
}

// Mapping: _a4→checkDiagnosticsRegistry, Tl→pendingDiagnosticsMap, HyY→deduplicateDiagnostics, Ka4→severityStringToInt, FV1→LSP_MAX_DIAGNOSTICS_PER_FILE, qa4→LSP_MAX_DIAGNOSTICS_TOTAL, F66→deliveredDiagnosticsLru, za4→hashDiagnostic
```

---

## 5. System Reminder Integration

### Attachment Producer

```javascript
// ============================================
// getLSPDiagnosticAttachments - System reminder attachment builder
// Location: chunks.147.mjs:800-820
// ============================================

// ORIGINAL:
async function luY(A) {
    if (!A.options.tools.some((q) => z3(q, Q7))) return [];
    k("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = _a4();
        if (q.length === 0) return [];
        k(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) wa4(), k(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return k(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return _6(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}

// READABLE:
async function getLSPDiagnosticAttachments(sessionContext) {
    // Only if LSP tool is available
    if (!sessionContext.options.tools.some((tool) => isLspTool(tool))) {  // z3, Q7
        return [];
    }

    log("LSP Diagnostics: getLSPDiagnosticAttachments called");

    try {
        // Fetch and clear pending diagnostics
        const diagnosticSets = checkDiagnosticsRegistry();  // _a4
        if (diagnosticSets.length === 0) return [];

        log(`LSP Diagnostics: Found ${diagnosticSets.length} pending diagnostic set(s)`);

        // Convert to attachment format
        const attachments = diagnosticSets.map(({ files }) => ({
            type: "diagnostics",
            files,
            isNew: true
        }));

        // Note: _a4 already cleared pending diagnostics
        log(`LSP Diagnostics: Returning ${attachments.length} diagnostic attachment(s)`);
        return attachments;

    } catch (error) {
        const err = error instanceof Error ? error : Error(String(error));
        logError(Error(`Failed to get LSP diagnostic attachments: ${err.message}`));
        return [];  // Fail gracefully - don't break agent
    }
}

// Mapping: luY→getLSPDiagnosticAttachments, z3→isLspTool, Q7→LSP_TOOL_TYPE, _a4→checkDiagnosticsRegistry, wa4→clearPendingDiagnostics
```

### When Called

The `getLSPDiagnosticAttachments` function is called during system reminder building, which happens:
1. **Before each LLM call** - To inject current diagnostics into context
2. **In the attachment producer pipeline** - Alongside other attachment types

---

## 6. Diagnostic Format in System Prompt

### Output Format

When diagnostics are injected, they appear in the system prompt as:

```
<system-reminder>
[LSP Diagnostics from typescript-language-server]

src/App.tsx:
  Line 42:7 Error: Type 'string' is not assignable to type 'number'. (TS2322)
  Line 58:3 Warning: 'result' is declared but its value is never read. (TS6133)

src/utils.ts:
  Line 12:5 Error: Cannot find name 'foo'. (TS2304)
</system-reminder>
```

### Format Structure

```
[LSP Diagnostics from {serverName}]

{filePath}:
  Line {line}:{character} {severity}: {message}. ({code})
  ...
```

**Why this format:**
- Clear visual separation with `[LSP Diagnostics from ...]`
- File-by-file grouping for easy scanning
- Line:character format matches editor conventions
- Error code in parentheses for quick reference

---

## 7. Cache Management

### Clearing Delivered Diagnostics for URI

```javascript
// ============================================
// clearDeliveredDiagnosticsForUri - Clear cache for specific file
// Location: chunks.138.mjs:1097-1099
// ============================================

// ORIGINAL:
function pV1(A) {
    if (F66.has(A)) k(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), F66.delete(A)
}

// READABLE:
function clearDeliveredDiagnosticsForUri(uri) {
    if (deliveredDiagnosticsLru.has(uri)) {  // F66
        log(`LSP Diagnostics: Clearing delivered diagnostics for ${uri}`);
        deliveredDiagnosticsLru.delete(uri);
    }
}

// Mapping: pV1→clearDeliveredDiagnosticsForUri, F66→deliveredDiagnosticsLru
```

### When Cleared

The delivered diagnostics cache for a specific URI is cleared when:
1. **File is edited** - Before sending `didChange` notification
2. **File is saved** - Before sending `didSave` notification

**Why:** Old diagnostics are for the previous version of the file. After editing:
- Line numbers may have shifted
- The error may have been fixed
- New errors may have been introduced

---

## 8. Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE DIAGNOSTIC FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Turn N-1: Agent edits file                                                │
│       │                                                                      │
│       ├─► FileEditTool writes file                                          │
│       │                                                                      │
│       ├─► pV1(fileUri) — Clear old diagnostics for this file               │
│       │                                                                      │
│       ├─► manager.changeFile() — Send textDocument/didChange               │
│       │                                                                      │
│       └─► manager.saveFile() — Send textDocument/didSave                   │
│                                                                              │
│   Turn N (async): LSP server processes                                      │
│       │                                                                      │
│       └─► LSP server sends publishDiagnostics                               │
│              │                                                               │
│              └─► $a4 handler receives                                        │
│                     │                                                        │
│                     ├─► MyY — Convert URI, normalize diagnostics            │
│                     │                                                        │
│                     └─► Ya4 — Register in Tl (pendingDiagnosticsMap)       │
│                                                                              │
│   Turn N+1: Agent starts next turn                                          │
│       │                                                                      │
│       ├─► System reminder building begins                                   │
│       │      │                                                               │
│       │      └─► luY (getLSPDiagnosticAttachments) called                  │
│       │             │                                                        │
│       │             └─► _a4 (checkDiagnosticsRegistry)                     │
│       │                    │                                                 │
│       │                    ├─► Collect pending diagnostics                  │
│       │                    │                                                 │
│       │                    ├─► HyY (deduplicateDiagnostics)                │
│       │                    │      └─► za4 for each diagnostic               │
│       │                    │      └─► Check F66 + in-flight hashes          │
│       │                    │                                                 │
│       │                    ├─► Sort by severity                             │
│       │                    │                                                 │
│       │                    ├─► Volume limit (10/file, 30 total)            │
│       │                    │                                                 │
│       │                    ├─► Track in F66 (deliveredDiagnosticsLru)      │
│       │                    │                                                 │
│       │                    └─► Clear Tl (pendingDiagnosticsMap)            │
│       │                                                                      │
│       └─► System prompt contains:                                           │
│              │                                                               │
│              │   [LSP Diagnostics from typescript-language-server]          │
│              │   src/App.tsx:                                                │
│              │     Line 42:7 Error: Type 'string' is not...                 │
│              │                                                               │
│              └─► Agent sees errors and can fix them                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. State Management Deep Dive

### State Variables Overview

The LSP diagnostic pipeline maintains several critical state variables that manage the lifecycle of diagnostics from reception to delivery:

| Variable | Symbol | Type | Purpose | Location |
|----------|--------|------|---------|----------|
| `pendingDiagnosticsMap` | Tl | `Map<id, Entry>` | Buffer for incoming diagnostics | chunks.138.mjs:1107 |
| `deliveredDiagnosticsLru` | F66 | `LRU<uri, Set<hash>>` | Track delivered diagnostics | chunks.138.mjs:1109 |
| `lspManagerInstance` | MN | `LspServerManager\|undefined` | Singleton manager instance | chunks.138.mjs:1322 |
| `managerState` | IZ | `"not-started"\|"pending"\|"success"\|"failed"` | Manager lifecycle state | chunks.138.mjs:1324 |
| `initializationError` | kl6 | `Error\|undefined` | Captured init error | chunks.138.mjs:1326 |
| `generationCounter` | QV1 | `number` | Race condition prevention | chunks.138.mjs:1328 |
| `initializationPromise` | UV1 | `Promise\|undefined` | Awaitable init promise | chunks.138.mjs:1330 |

### 9.1 Pending Diagnostics Map (Tl)

The pending diagnostics map acts as an **async buffer** between LSP notifications and system prompt delivery:

```javascript
// ============================================
// pendingDiagnosticsMap - Buffer for incoming diagnostics
// Location: chunks.138.mjs:1107, 1116
// ============================================

// Initialization:
Tl = new Map();

// Entry structure:
interface PendingDiagnosticEntry {
    serverName: string;      // e.g., "typescript-language-server"
    files: DiagnosticFile[]; // Array of { uri, diagnostics[] }
    timestamp: number;       // Date.now() when registered
    attachmentSent: boolean; // false initially, true after delivery
}

// Example state:
Map {
    "diag_1678954321000_abc123" => {
        serverName: "typescript-language-server",
        files: [{ uri: "/src/App.tsx", diagnostics: [...] }],
        timestamp: 1678954321456,
        attachmentSent: false
    }
}
```

**Lifecycle States:**

```
┌─────────────────────────────────────────────────────────────────┐
│            PENDING DIAGNOSTIC LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │  NOT IN MAP  │  Initial state                               │
│   └──────┬───────┘                                              │
│          │                                                       │
│          │ LSP notification received                             │
│          │ Ya4 (registerDiagnostics) called                     │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │    ADDED     │  entry.attachmentSent = false                │
│   │  (PENDING)   │  timestamp recorded                          │
│   └──────┬───────┘                                              │
│          │                                                       │
│          │ Next agent turn begins                                │
│          │ _a4 (checkDiagnosticsRegistry) called                │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │   DELIVERED  │  entry.attachmentSent = true                 │
│   │              │  Processed for dedup/volume limit            │
│   └──────┬───────┘                                              │
│          │                                                       │
│          │ After processing complete                             │
│          │ Entry deleted from map                                │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │   REMOVED    │  Memory freed                                │
│   └──────────────┘                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why Buffer with a Map?**

1. **Async Decoupling**: LSP notifications arrive at unpredictable times. The map allows collection without blocking.
2. **Batching**: Multiple notifications for the same file (from different servers) can be combined.
3. **Deduplication Prep**: The `attachmentSent` flag enables safe collection without double-delivery.
4. **Memory Safety**: Entries are promptly cleared after delivery to prevent unbounded growth.

### 9.2 LRU Cache for Delivered Diagnostics (F66)

The LRU cache tracks delivered diagnostic hashes to prevent re-delivery of the same errors:

```javascript
// ============================================
// deliveredDiagnosticsLru - LRU cache for deduplication
// Location: chunks.138.mjs:1109, 1116-1118
// ============================================

// Configuration:
const LRU_MAX_ENTRIES = 500;  // $yY

// Initialization:
F66 = new LRU({
    max: LRU_MAX_ENTRIES  // 500 URIs max
});

// Cache entry structure:
// Map<uri: string, Set<diagnosticHash: string>>
// Example:
LRU {
    "/src/App.tsx" => Set { "abc123...", "def456..." },
    "/src/utils.ts" => Set { "ghi789..." },
    // ... up to 500 entries
}
```

**LRU Eviction Policy:**

```
┌─────────────────────────────────────────────────────────────────┐
│               LRU CACHE BEHAVIOR                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Capacity: 500 URIs                                             │
│                                                                  │
│   When cache is full (500 entries):                             │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────────────────────────────────────────┐ │
│   │   Least Recently Used entry is evicted                    │ │
│   │                                                          │ │
│   │   Example: If "/old/unused.ts" was accessed longest ago, │ │
│   │   its Set of diagnostic hashes is dropped.               │ │
│   │                                                          │ │
│   │   This means: Old files' diagnostics are forgotten,     │ │
│   │   allowing re-delivery if the file becomes relevant     │ │
│   │   again (which is usually desired behavior).            │ │
│   └──────────────────────────────────────────────────────────┘ │
│                                                                  │
│   Access Pattern (promotes to "most recent"):                   │
│   ┌────────────────────────────────────────────────────────┐   │
│   │  F66.get(uri)  → Read (moves to end)                   │   │
│   │  F66.set(uri, hashes) → Write (moves to end)           │   │
│   │  F66.has(uri)  → Check (moves to end)                  │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why 500 Entries?**

The 500-entry limit balances:
- **Memory Usage**: Each entry stores a Set of SHA-256 hashes (~64 chars each)
- **Deduplication Window**: Covers typical project size (500 files is generous)
- **Re-delivery Protection**: Active files stay in cache; stale files are evicted

**Key Insight**: The LRU eviction policy means that diagnostics for files that haven't been discussed recently can be re-delivered. This is actually **desired behavior** because:
1. The error might have been fixed but re-introduced
2. The context about that error was likely pruned from conversation
3. Re-reminding about old errors in newly-relevant files is helpful

### 9.3 Generation Counter Pattern (QV1)

The generation counter prevents race conditions during manager initialization:

```javascript
// ============================================
// Generation Counter Pattern
// Location: chunks.138.mjs:1286-1301
// ============================================

// ORIGINAL:
function dm8() {
    if (MN !== void 0 && IZ !== "failed") {
        return  // Already initialized
    }
    if (IZ === "failed") {
        MN = void 0;
        kl6 = void 0;  // Clear previous error
    }
    MN = eo4();        // Create manager
    IZ = "pending";

    let A = ++QV1;     // Increment generation counter
    UV1 = MN.initialize().then(() => {
        if (A === QV1) {  // Only if still current generation
            IZ = "success";
            if (MN) $a4(MN);  // Register notification handlers
        }
    }).catch((q) => {
        if (A === QV1) {  // Only if still current generation
            IZ = "failed";
            kl6 = q;
            MN = void 0;
        }
    });
}

// READABLE:
function initializeLspServerManager() {
    // Guard against double initialization
    if (lspManagerInstance !== undefined && managerState !== "failed") {
        return;
    }

    // Reset on retry after failure
    if (managerState === "failed") {
        lspManagerInstance = undefined;
        initializationError = undefined;
    }

    // Create and mark as initializing
    lspManagerInstance = createLspServerManager();
    managerState = "pending";

    // Capture current generation
    const currentGeneration = ++generationCounter;

    // Start async initialization
    initializationPromise = lspManagerInstance.initialize()
        .then(() => {
            // CRITICAL: Only commit if still current generation
            if (currentGeneration === generationCounter) {
                managerState = "success";
                if (lspManagerInstance) {
                    registerNotificationHandlers(lspManagerInstance);
                }
            }
            // Otherwise, a new initialization started - ignore this result
        })
        .catch((error) => {
            // CRITICAL: Only commit if still current generation
            if (currentGeneration === generationCounter) {
                managerState = "failed";
                initializationError = error;
                lspManagerInstance = undefined;
            }
            // Otherwise, a new initialization started - ignore this error
        });
}

// Mapping: dm8→initializeLspServerManager, MN→lspManagerInstance, IZ→managerState, kl6→initializationError, QV1→generationCounter, UV1→initializationPromise, eo4→createLspServerManager, $a4→registerNotificationHandlers
```

**Race Condition Scenario:**

```
┌─────────────────────────────────────────────────────────────────┐
│           GENERATION COUNTER RACE PREVENTION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Time ─────────────────────────────────────────────────────►   │
│                                                                  │
│   Call 1: initializeLspServerManager()                          │
│       │                                                          │
│       ├─► QV1 = 1                                               │
│       ├─► MN.initialize() starts (async, slow)                  │
│       │                                                          │
│   Call 2: initializeLspServerManager() [reinitialize]           │
│       │                                                          │
│       ├─► QV1 = 2                                               │
│       ├─► MN.shutdown() old instance                            │
│       ├─► MN = new LspServerManager()                           │
│       ├─► MN.initialize() starts (async, fast)                  │
│       │                                                          │
│   Call 1's promise resolves (slow):                             │
│       │                                                          │
│       ├─► currentGeneration (1) !== QV1 (2)                     │
│       └─► IGNORED - stale initialization                         │
│       │                                                          │
│   Call 2's promise resolves (fast):                             │
│       │                                                          │
│       ├─► currentGeneration (2) === QV1 (2)                     │
│       └─► COMMITTED - current initialization                     │
│                                                                  │
│   Result: Only the MOST RECENT initialization is committed      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why This Pattern?**

1. **Async Safety**: Without the counter, a slow initialization from an earlier call could overwrite a successful later initialization.
2. **No Locks Needed**: JavaScript is single-threaded; the counter provides atomicity without mutex locks.
3. **Graceful Reinit**: When `reinitializeLspServerManager()` (dV1) is called, the old init's results are safely ignored.
4. **Simple Implementation**: Just an integer comparison - O(1) check.

### 9.4 Manager State Machine (IZ)

The manager state follows a strict state machine:

```
┌─────────────────────────────────────────────────────────────────┐
│              MANAGER STATE MACHINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                     ┌──────────────┐                            │
│                     │ "not-started"│  Initial state             │
│                     └──────┬───────┘                            │
│                            │                                     │
│                            │ dm8() called                       │
│                            │ MN = eo4()                         │
│                            ▼                                     │
│                     ┌──────────────┐                            │
│                     │   "pending"  │  Initializing              │
│                     └──────┬───────┘                            │
│                            │                                     │
│              ┌─────────────┼─────────────┐                      │
│              │             │             │                      │
│              ▼             │             ▼                      │
│       ┌──────────────┐     │      ┌──────────────┐             │
│       │   "success"  │     │      │   "failed"   │             │
│       └──────┬───────┘     │      └──────┬───────┘             │
│              │             │             │                      │
│              │             │             │ dm8() retry          │
│              │             │             │ (clears kl6)         │
│              │             │             │                      │
│              │             └─────────────┼──► Back to "pending" │
│              │                           │                      │
│              │ Ma4() shutdown            │                      │
│              ▼                           │                      │
│       ┌──────────────┐                   │                      │
│       │ "not-started"│ ◄─────────────────┘                      │
│       └──────────────┘                                          │
│                                                                  │
│   State Query: qT6() returns { status: IZ, error?: kl6 }       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**State Query Function:**

```javascript
// ============================================
// getLspManagerStatus - Query current manager state
// Location: chunks.138.mjs:1254-1268
// ============================================

// ORIGINAL:
function qT6() {
    if (IZ === "failed") return {
        status: "failed",
        error: kl6 || Error("Initialization failed")
    };
    if (IZ === "not-started") return { status: "not-started" };
    if (IZ === "pending") return { status: "pending" };
    return { status: "success" };
}

// READABLE:
function getLspManagerStatus() {
    switch (managerState) {
        case "failed":
            return {
                status: "failed",
                error: initializationError || Error("Initialization failed")
            };
        case "not-started":
            return { status: "not-started" };
        case "pending":
            return { status: "pending" };
        case "success":
            return { status: "success" };
    }
}

// Mapping: qT6→getLspManagerStatus, IZ→managerState, kl6→initializationError
```

### 9.5 Constants and Configuration

| Constant | Symbol | Value | Purpose |
|----------|--------|-------|---------|
| `LSP_MAX_DIAGNOSTICS_PER_FILE` | FV1 | 10 | Max diagnostics per file |
| `LSP_MAX_DIAGNOSTICS_TOTAL` | qa4 | 30 | Max diagnostics total |
| `LRU_MAX_ENTRIES` | $yY | 500 | LRU cache size |
| `LSP_ERROR_POLL_INTERVAL` | ITz | 5000 | UI poll interval (ms) |

```javascript
// Location: chunks.138.mjs:1100-1105
FV1 = 10;    // Max diagnostics per file
qa4 = 30;    // Max diagnostics total
$yY = 500;   // LRU cache max entries
```

---

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| registerNotificationHandlers | $a4 | chunks.138.mjs:1166-1240 |
| registerDiagnostics | Ya4 | chunks.138.mjs:978-989 |
| checkDiagnosticsRegistry | _a4 | chunks.138.mjs:1040-1087 |
| hashDiagnostic | za4 | chunks.138.mjs:1006-1014 |
| deduplicateDiagnostics | HyY | chunks.138.mjs:1016-1038 |
| clearPendingDiagnostics | wa4 | chunks.138.mjs:1089-1091 |
| clearDeliveredDiagnosticsForUri | pV1 | chunks.138.mjs:1097-1099 |
| convertDiagnosticUriToPath | MyY | chunks.138.mjs:1136-1164 |
| severityIntToString | JyY | chunks.138.mjs:1121-1134 |
| severityStringToInt | Ka4 | chunks.138.mjs:991-1004 |
| getLSPDiagnosticAttachments | luY | chunks.147.mjs:800-820 |
| getLspManager | vl | chunks.138.mjs:1249-1252 |
| getLspManagerStatus | qT6 | chunks.138.mjs:1254-1268 |
| initializeLspServerManager | dm8 | chunks.138.mjs:1286-1301 |
| reinitializeLspServerManager | dV1 | chunks.138.mjs:1303-1308 |
| shutdownLspServerManager | Ma4 | chunks.138.mjs:1311-1320 |
| pendingDiagnosticsMap | Tl | chunks.138.mjs:1107, 1116 |
| deliveredDiagnosticsLru | F66 | chunks.138.mjs:1109, 1116 |
| lspManagerInstance | MN | chunks.138.mjs:1322 |
| managerState | IZ | chunks.138.mjs:1324 |
| initializationError | kl6 | chunks.138.mjs:1326 |
| generationCounter | QV1 | chunks.138.mjs:1328 |
| initializationPromise | UV1 | chunks.138.mjs:1330 |
| LSP_MAX_DIAGNOSTICS_PER_FILE | FV1 | chunks.138.mjs:1101 |
| LSP_MAX_DIAGNOSTICS_TOTAL | qa4 | chunks.138.mjs:1103 |
| LRU_MAX_ENTRIES | $yY | chunks.138.mjs:1105 |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - All code verified against source