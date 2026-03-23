# LSP Integration - Lifecycle Analysis

## Overview

This document covers the lifecycle of the LSP integration system, from manager initialization through server startup, request handling, and shutdown. Understanding this lifecycle is critical for debugging LSP-related issues.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `initializeLspServerManager` (dm8) - Singleton manager initialization
- `shutdownLspServerManager` (Ma4) - Clean shutdown
- `LspServerManager` (eo4) - Manager factory
- `getLspManager` (vl) - Singleton accessor
- `getLspManagerStatus` (qT6) - Status query

---

## 1. Manager State Machine

### State Transitions

```
┌────────────────────────────────────────────────────────────────────┐
│                         LSP MANAGER STATES                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌──────────────┐                                                │
│    │ not-started  │ ◄───────────── Initial state                   │
│    └──────┬───────┘                                                │
│           │                                                         │
│           │ initializeLspServerManager() (dm8)                     │
│           ▼                                                         │
│    ┌──────────────┐                                                │
│    │   pending    │ ◄───────────── Async initialization            │
│    └──────┬───────┘                                                │
│           │                                                         │
│     ┌─────┴─────┐                                                  │
│     │           │                                                  │
│     ▼           ▼                                                  │
│ ┌────────┐  ┌────────┐                                            │
│ │success │  │ failed │                                            │
│ └────┬───┘  └───┬────┘                                            │
│      │          │                                                  │
│      │          └──────► Can retry initializeLspServerManager()   │
│      │                                                             │
│      └───────────────► shutdownLspServerManager() (Ma4)           │
│                              │                                     │
│                              ▼                                     │
│                       ┌──────────────┐                            │
│                       │ not-started  │ ◄─── Return to initial     │
│                       └──────────────┘                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### State Variables

```javascript
// ============================================
// LSP Manager Singleton State
// Location: chunks.138.mjs:1322-1330
// ============================================

// ORIGINAL:
MN                        // Manager instance or undefined
IZ = "not-started"        // State: "not-started" | "pending" | "success" | "failed"
kl6                       // Last error (if failed)
QV1 = 0                   // Generation counter (prevents race conditions)
UV1                       // Initialization promise

// READABLE:
let lspManagerInstance = undefined;           // MN
let lspManagerState = "not-started";          // IZ
let lspManagerLastError = undefined;          // kl6
let lspInitGeneration = 0;                    // QV1
let lspInitPromise = undefined;               // UV1

// Mapping: MN→lspManagerInstance, IZ→lspManagerState, kl6→lspManagerLastError, QV1→lspInitGeneration, UV1→lspInitPromise
```

---

## 2. Initialization Sequence

### Manager Initialization

```javascript
// ============================================
// dm8 - Initialize the LSP server manager
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
    lspManagerInstance = LspServerManager();
    lspManagerState = "pending";
    log("[LSP MANAGER] Created manager instance, state=pending");

    // Increment generation for race condition prevention
    const generation = ++lspInitGeneration;
    log(`[LSP MANAGER] Starting async initialization (generation ${generation})`);

    // Async initialization
    lspInitPromise = lspManagerInstance.initialize()
        .then(() => {
            if (generation === lspInitGeneration) {
                lspManagerState = "success";
                log("LSP server manager initialized successfully");
                if (lspManagerInstance) {
                    registerNotificationHandlers(lspManagerInstance);
                }
            }
        })
        .catch((error) => {
            if (generation === lspInitGeneration) {
                lspManagerState = "failed";
                lspManagerLastError = error;
                lspManagerInstance = undefined;
                logError(error);
                log(`Failed to initialize LSP server manager: ${error.message}`);
            }
        });
}

// Mapping: dm8→initializeLspServerManager, eo4→LspServerManager, $a4→registerNotificationHandlers
```

**Generation counter pattern:** The `lspInitGeneration` (QV1) counter prevents stale initialization results from overwriting newer attempts. This is essential for:

1. **Rapid restarts:** If `shutdown()` and `initialize()` are called in quick succession
2. **Error recovery:** If initialization fails and is retried
3. **Race conditions:** Multiple concurrent initialization calls

### Detailed Initialization Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INITIALIZATION TIMELINE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  T0: initializeLspServerManager() called                            │
│      │                                                               │
│      ├─► Check: Already initialized?                                │
│      │   └─► Yes: Skip, return early                                │
│      │                                                               │
│      ├─► Check: Previous failure?                                   │
│      │   └─► Yes: Reset state variables                             │
│      │                                                               │
│      ├─► Create manager instance: eo4()                             │
│      │                                                               │
│      ├─► Set state = "pending"                                      │
│      │                                                               │
│      ├─► Increment generation counter                               │
│      │                                                               │
│      └─► Start async initialization: manager.initialize()           │
│                                                                      │
│  T1: manager.initialize() runs                                       │
│      │                                                               │
│      ├─► loadLspConfigs() (so4) → Get all plugin configs           │
│      │                                                               │
│      ├─► For each server config:                                    │
│      │   ├─► Validate required fields                               │
│      │   ├─► Build extension → server mapping                       │
│      │   ├─► createLspClient() (no4)                               │
│      │   ├─► Register workspace/configuration handler               │
│      │   └─► client.start() → Spawn process and handshake           │
│      │                                                               │
│      └─► Log total servers initialized                              │
│                                                                      │
│  T2: Initialization complete                                         │
│      │                                                               │
│      ├─► Check: generation === current?                             │
│      │   ├─► Yes: Set state = "success"                             │
│      │   │          registerNotificationHandlers(manager)            │
│      │   └─► No: Discard stale result                               │
│      │                                                               │
│      └─► Manager ready for use                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Manager Factory

### LspServerManager Structure

```javascript
// ============================================
// eo4 - LSP Server Manager Factory
// Location: chunks.138.mjs:806-969
// ============================================

// READABLE (structure):
function LspServerManager() {
    // Internal state
    const servers = new Map();          // name → client instance
    const extensionMap = new Map();     // .ts → ["typescript-language-server"]
    const openFiles = new Map();        // uri → serverName

    // Lifecycle
    async function initialize() { /* ... */ }
    async function shutdown() { /* ... */ }

    // Server access
    function getServerForFile(filePath) { /* ... */ }
    async function ensureServerStarted(filePath) { /* ... */ }
    async function sendRequest(filePath, method, params) { /* ... */ }
    function getAllServers() { /* ... */ }

    // File sync
    async function openFile(filePath, content) { /* ... */ }
    async function changeFile(filePath, content) { /* ... */ }
    async function saveFile(filePath) { /* ... */ }
    async function closeFile(filePath) { /* ... */ }
    function isFileOpen(filePath) { /* ... */ }

    return {
        initialize,
        shutdown,
        getServerForFile,
        ensureServerStarted,
        sendRequest,
        getAllServers,
        openFile,
        changeFile,
        saveFile,
        closeFile,
        isFileOpen
    };
}

// Mapping: eo4→LspServerManager
```

### Server Initialization Within Manager

```javascript
// ============================================
// Manager.initialize() - Server startup
// Location: chunks.138.mjs:810-835
// ============================================

// ORIGINAL:
async function Y() {
    let X;
    try {
        X = (await so4()).servers, k(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(X).length} server(s)`)
    } catch (P) {
        throw _6(Error(`Failed to load LSP server configuration: ${P.message}`)), P
    }
    for (let [P, W] of Object.entries(X)) try {
        if (!W.command) throw Error(`Server ${P} missing required 'command' field`);
        if (!W.extensionToLanguage || Object.keys(W.extensionToLanguage).length === 0) throw Error(`Server ${P} missing required 'extensionToLanguage' field`);
        let Z = Object.keys(W.extensionToLanguage);
        for (let f of Z) {
            let v = f.toLowerCase();
            if (!q.has(v)) q.set(v, []);
            let N = q.get(v);
            if (N) N.push(P)
        }
        let G = no4(P, W);
        A.set(P, G), G.onRequest("workspace/configuration", (f) => {
            return k(`LSP: Received workspace/configuration request from ${P}`), f.items.map(() => null)
        })
    } catch (Z) {
        _6(Error(`Failed to initialize LSP server ${P}: ${Z.message}`))
    }
    k(`LSP manager initialized with ${A.size} servers`)
}

// READABLE:
async function initialize() {
    let configs;
    try {
        configs = (await loadLspConfigs()).servers;
        log(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(configs).length} server(s)`);
    } catch (error) {
        logError(Error(`Failed to load LSP server configuration: ${error.message}`));
        throw error;
    }

    for (const [serverName, config] of Object.entries(configs)) {
        try {
            // Validate required fields
            if (!config.command) {
                throw Error(`Server ${serverName} missing required 'command' field`);
            }
            if (!config.extensionToLanguage || Object.keys(config.extensionToLanguage).length === 0) {
                throw Error(`Server ${serverName} missing required 'extensionToLanguage' field`);
            }

            // Build extension → server mapping
            const extensions = Object.keys(config.extensionToLanguage);
            for (const ext of extensions) {
                const normalized = ext.toLowerCase();
                if (!extensionMap.has(normalized)) {
                    extensionMap.set(normalized, []);
                }
                extensionMap.get(normalized)?.push(serverName);
            }

            // Create client instance
            const client = createLspClient(serverName, config);
            servers.set(serverName, client);

            // Handle workspace/configuration requests from server
            client.onRequest("workspace/configuration", (params) => {
                log(`LSP: Received workspace/configuration request from ${serverName}`);
                return params.items.map(() => null);  // Return null for each config item
            });

            // Start server (async, non-blocking)
            client.start().catch((error) => {
                logError(Error(`Failed to start LSP server ${serverName}: ${error.message}`));
            });

        } catch (error) {
            logError(Error(`Failed to initialize LSP server ${serverName}: ${error.message}`));
        }
    }

    log(`LSP manager initialized with ${servers.size} servers`);
}

// Mapping: Y→initialize, so4→loadLspConfigs, q→extensionMap, A→servers, no4→createLspClient
```

**Non-blocking start:** Each server starts asynchronously. The manager doesn't wait for all servers to be ready before returning. This allows partial functionality even if some servers fail.

---

## 4. Request Lifecycle

### File-Based Request Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LSP REQUEST LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Agent calls LSP Tool (goToDefinition, etc.)                        │
│      │                                                               │
│      ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ LspTool.call(input, context)                                 │  │
│  │                                                               │  │
│  │  1. Resolve file path                                         │  │
│  │  2. Check manager status (wait if pending)                   │  │
│  │  3. Get manager instance                                      │  │
│  │  4. Build LSP request params                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│      │                                                               │
│      ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ manager.sendRequest(filePath, method, params)                │  │
│  │                                                               │  │
│  │  1. getServerForFile(filePath) → find server by extension    │  │
│  │  2. ensureServerStarted(filePath) → restart if stopped       │  │
│  │  3. Check if file is open                                     │  │
│  │     └─► No: openFile(filePath, content)                       │  │
│  │  4. client.sendRequest(method, params)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│      │                                                               │
│      ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ LSP Client (no4)                                             │  │
│  │                                                               │  │
│  │  1. Send JSON-RPC request over stdio                         │  │
│  │  2. Wait for response (with timeout)                         │  │
│  │  3. Handle retry if ContentModified error                    │  │
│  │  4. Return result or throw error                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│      │                                                               │
│      ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Format and return result                                      │  │
│  │                                                               │  │
│  │  result = formatLspResult(operation, response)               │  │
│  │  return { operation, result, filePath, resultCount, fileCount} │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### File Sync Lifecycle

```javascript
// ============================================
// File sync methods in manager
// Location: chunks.138.mjs:878-955
// ============================================

// READABLE (conceptual):

// Open file - called when first accessing a file
async function openFile(filePath, content) {
    const client = await ensureServerStarted(filePath);
    if (!client) return;

    const uri = pathToFileUrl(path.resolve(filePath)).href;

    // Skip if already open
    if (openFiles.get(uri) === client.name) {
        log(`LSP: File already open, skipping didOpen for ${filePath}`);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const languageId = client.config.extensionToLanguage[ext] || "plaintext";

    await client.sendNotification("textDocument/didOpen", {
        textDocument: {
            uri,
            languageId,
            version: 1,
            text: content
        }
    });

    openFiles.set(uri, client.name);
    log(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);
}

// Change file - called after file edit
async function changeFile(filePath, content) {
    const client = getServerForFile(filePath);
    if (!client || client.state !== "running") {
        return openFile(filePath, content);  // Fallback to open
    }

    const uri = pathToFileUrl(path.resolve(filePath)).href;
    if (openFiles.get(uri) !== client.name) {
        return openFile(filePath, content);  // Not our file, open instead
    }

    await client.sendNotification("textDocument/didChange", {
        textDocument: { uri, version: 1 },
        contentChanges: [{ text: content }]
    });
    log(`LSP: Sent didChange for ${filePath}`);
}

// Save file - called after file write
async function saveFile(filePath) {
    const client = getServerForFile(filePath);
    if (!client || client.state !== "running") return;

    await client.sendNotification("textDocument/didSave", {
        textDocument: { uri: pathToFileUrl(path.resolve(filePath)).href }
    });
    log(`LSP: Sent didSave for ${filePath}`);
}

// Close file - cleanup when done
async function closeFile(filePath) {
    const client = getServerForFile(filePath);
    if (!client || client.state !== "running") return;

    const uri = pathToFileUrl(path.resolve(filePath)).href;
    await client.sendNotification("textDocument/didClose", {
        textDocument: { uri }
    });
    openFiles.delete(uri);
    log(`LSP: Sent didClose for ${filePath}`);
}

function isFileOpen(filePath) {
    const uri = pathToFileUrl(path.resolve(filePath)).href;
    return openFiles.has(uri);
}
```

---

## 5. Shutdown Sequence

### Manager Shutdown

```javascript
// ============================================
// Ma4 - Shutdown LSP server manager
// Location: chunks.138.mjs:1311-1320
// ============================================

// ORIGINAL:
async function Ma4() {
    if (MN === void 0) return;
    try {
        await MN.shutdown(), k("LSP server manager shut down successfully")
    } catch (A) {
        _6(A), k(`Failed to shutdown LSP server manager: ${_1(A)}`)
    } finally {
        MN = void 0, IZ = "not-started", kl6 = void 0, UV1 = void 0, QV1++
    }
}

// READABLE:
async function shutdownLspServerManager() {
    if (lspManagerInstance === undefined) return;

    try {
        await lspManagerInstance.shutdown();
        log("LSP server manager shut down successfully");
    } catch (error) {
        logError(error);
        log(`Failed to shutdown LSP server manager: ${error.message}`);
    } finally {
        // Reset all state
        lspManagerInstance = undefined;
        lspManagerState = "not-started";
        lspManagerLastError = undefined;
        lspInitPromise = undefined;
        lspInitGeneration++;  // Increment for any future initialization
    }
}

// Mapping: Ma4→shutdownLspServerManager
```

### Server Shutdown Within Manager

```javascript
// ============================================
// Manager.shutdown() - Stop all servers
// Location: chunks.138.mjs:836-845
// ============================================

// ORIGINAL:
async function z() {
    let X = Array.from(A.entries()).filter(([, Z]) => Z.state === "running" || Z.state === "error"),
        P = await Promise.allSettled(X.map(([, Z]) => Z.stop()));
    A.clear(), q.clear(), K.clear();
    let W = P.map((Z, G) => Z.status === "rejected" ? `${X[G][0]}: ${Z.reason.message}` : null).filter((Z) => Z !== null);
    if (W.length > 0) {
        let Z = Error(`Failed to stop ${W.length} LSP server(s): ${W.join("; ")}`);
        throw _6(Z), Z
    }
}

// READABLE:
async function shutdown() {
    const runningServers = Array.from(servers.entries())
        .filter(([, client]) => client.state === "running" || client.state === "error");

    const results = await Promise.allSettled(
        runningServers.map(([, client]) => client.stop())
    );

    // Clear all state
    servers.clear();
    extensionMap.clear();
    openFiles.clear();

    // Report if any servers failed to stop
    const failures = results
        .map((result, index) => {
            if (result.status === "rejected") {
                return `${runningServers[index][0]}: ${result.reason.message}`;
            }
            return null;
        })
        .filter(msg => msg !== null);

    if (failures.length > 0) {
        const error = Error(`Failed to stop ${failures.length} LSP server(s): ${failures.join("; ")}`);
        logError(error);
        throw error;
    }
}

// Mapping: z→shutdown, A→servers, q→extensionMap, K→openFiles
```

### Shutdown Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SHUTDOWN TIMELINE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  T0: shutdownLspServerManager() called                              │
│      │                                                               │
│      └─► Check: Manager exists?                                     │
│          └─► No: Return immediately                                 │
│                                                                      │
│  T1: manager.shutdown()                                             │
│      │                                                               │
│      ├─► For each running server:                                   │
│      │   ├─► client.stop()                                          │
│      │   │   ├─► Send "shutdown" request                            │
│      │   │   ├─► Send "exit" notification                           │
│      │   │   ├─► Kill process (if needed)                           │
│      │   │   └─► Wait for process to exit                           │
│      │   └─► Log any errors                                         │
│      │                                                               │
│      ├─► Clear servers Map                                          │
│      ├─► Clear extensionMap                                         │
│      └─► Clear openFiles Map                                        │
│                                                                      │
│  T2: Reset singleton state                                          │
│      │                                                               │
│      ├─► lspManagerInstance = undefined                             │
│      ├─► lspManagerState = "not-started"                            │
│      ├─► lspManagerLastError = undefined                            │
│      ├─► lspInitPromise = undefined                                 │
│      └─► lspInitGeneration++                                        │
│                                                                      │
│  T3: Manager ready for re-initialization                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Singleton Accessors

```javascript
// ============================================
// vl - Get LSP manager instance
// Location: chunks.138.mjs:1249-1252
// ============================================

// ORIGINAL:
function vl() {
    if (IZ === "failed") return;
    return MN
}

// READABLE:
function getLspManager() {
    // Don't return instance if initialization failed
    if (lspManagerState === "failed") return undefined;
    return lspManagerInstance;
}

// Mapping: vl→getLspManager


// ============================================
// qT6 - Get manager status
// Location: chunks.138.mjs:1254-1268
// ============================================

// ORIGINAL:
function qT6() {
    if (IZ === "failed") return {
        status: "failed",
        error: kl6 || Error("Initialization failed")
    };
    if (IZ === "not-started") return {
        status: "not-started"
    };
    if (IZ === "pending") return {
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

// Mapping: qT6→getLspManagerStatus


// ============================================
// Ja4 - Wait for manager to be ready
// Location: chunks.138.mjs:1281-1284
// ============================================

// ORIGINAL:
async function Ja4() {
    if (IZ === "success" || IZ === "failed") return;
    if (IZ === "pending" && UV1) await UV1
}

// READABLE:
async function waitForLspManager() {
    // Already done
    if (lspManagerState === "success" || lspManagerState === "failed") return;

    // Wait for pending initialization
    if (lspManagerState === "pending" && lspInitPromise) {
        await lspInitPromise;
    }
}

// Mapping: Ja4→waitForLspManager


// ============================================
// dV1 - Reinitialize LSP server manager
// Location: chunks.138.mjs:1303-1309
// ============================================

// ORIGINAL:
function dV1() {
    if (IZ === "not-started") return;
    if (k("[LSP MANAGER] reinitializeLspServerManager() called"), MN) MN.shutdown().catch((A) => {
        k(`[LSP MANAGER] old instance shutdown during reinit failed: ${_1(A)}`)
    });
    MN = void 0, IZ = "not-started", kl6 = void 0, dm8()
}

// READABLE:
function reinitializeLspServerManager() {
    // Skip if not initialized
    if (lspManagerState === "not-started") return;

    log("[LSP MANAGER] reinitializeLspServerManager() called");

    // Shutdown existing instance in background (don't wait)
    if (lspManagerInstance) {
        lspManagerInstance.shutdown().catch((error) => {
            log(`[LSP MANAGER] old instance shutdown during reinit failed: ${error.message}`);
        });
    }

    // Reset state and reinitialize
    lspManagerInstance = undefined;
    lspManagerState = "not-started";
    lspManagerLastError = undefined;
    initializeLspServerManager();  // dm8
}

// Mapping: dV1→reinitializeLspServerManager, dm8→initializeLspServerManager
```

**When reinitialize is used:**
- When plugin configurations change and servers need to be reloaded
- After workspace folder changes
- When LSP server configurations are updated dynamically

**Key behavior:** The old instance is shut down asynchronously (fire-and-forget), and a new initialization starts immediately. This means the reinit is non-blocking and the new manager starts fresh.

---

## Lifecycle Summary

| Phase | State | Key Actions |
|-------|-------|-------------|
| Initial | `not-started` | No manager exists |
| Creating | `pending` | Load configs, spawn servers |
| Ready | `success` | All servers running, accept requests |
| Failed | `failed` | Initialization failed, allow retry |
| Shutdown | `not-started` | All servers stopped, state cleared |

### Critical Timing Points

1. **First LSP request:** If manager is `pending`, waits for initialization
2. **After file edit:** `changeFile()` + `saveFile()` triggered automatically
3. **Before shutdown:** All servers stopped gracefully
4. **Recovery:** Failed state allows re-initialization with incremented generation