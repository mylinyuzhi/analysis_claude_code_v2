# LSP Integration - Lifecycle Analysis

## Overview

This document covers the lifecycle of the LSP integration system, from manager initialization through server startup, request handling, and shutdown. Understanding this lifecycle is critical for debugging LSP-related issues.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `initializeLspServerManager` (KF4) - Singleton manager initialization
- `shutdownLspServerManager` (YF4) - Clean shutdown
- `LspServerManager` (lm4) - Manager factory
- `getLspManager` (md) - Singleton accessor
- `getLspManagerStatus` (W51) - Status query

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
│           │ initializeLspServerManager()                           │
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
│      └───────────────► shutdownLspServerManager()                  │
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
// Location: chunks.133.mjs:2669-2677
// ============================================

// ORIGINAL:
jI           // Manager instance or undefined
ev = "not-started"   // State: "not-started" | "pending" | "success" | "failed"
vP6          // Last error (if failed)
TP6 = 0              // Generation counter (prevents race conditions)
EP6          // Initialization promise

// READABLE:
let lspManagerInstance = undefined;           // jI
let lspManagerState = "not-started";          // ev
let lspManagerLastError = undefined;          // vP6
let lspInitGeneration = 0;                    // TP6
let lspInitPromise = undefined;               // EP6

// Mapping: jI→lspManagerInstance, ev→lspManagerState, vP6→lspManagerLastError, TP6→lspInitGeneration, EP6→lspInitPromise
```

---

## 2. Initialization Sequence

### Manager Initialization

```javascript
// ============================================
// KF4 - Initialize the LSP server manager
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

    // Guard: Already initialized or in progress (except failed)
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
    lspManagerInstance = LspServerManager();  // lm4
    lspManagerState = "pending";
    log("[LSP MANAGER] Created manager instance, state=pending");

    // Increment generation for race condition prevention
    const generation = ++lspInitGeneration;
    log(`[LSP MANAGER] Starting async initialization (generation ${generation})`);

    // Async initialization
    lspInitPromise = lspManagerInstance.initialize()
        .then(() => {
            // Only update if this is still the current generation
            if (generation === lspInitGeneration) {
                lspManagerState = "success";
                log("LSP server manager initialized successfully");
                if (lspManagerInstance) {
                    registerNotificationHandlers(lspManagerInstance);  // em4
                }
            }
        })
        .catch((error) => {
            // Only update if this is still the current generation
            if (generation === lspInitGeneration) {
                lspManagerState = "failed";
                lspManagerLastError = error;
                lspManagerInstance = undefined;
                logError(error);
                log(`Failed to initialize LSP server manager: ${error.message}`);
            }
        });
}

// Mapping: KF4→initializeLspServerManager, lm4→LspServerManager, em4→registerNotificationHandlers
```

**Generation counter pattern:** The `lspInitGeneration` counter prevents stale initialization results from overwriting newer attempts. This is essential for:

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
│      ├─► Create manager instance: lm4()                             │
│      │                                                               │
│      ├─► Set state = "pending"                                      │
│      │                                                               │
│      ├─► Increment generation counter                               │
│      │                                                               │
│      └─► Start async initialization: manager.initialize()           │
│                                                                      │
│  T1: manager.initialize() runs                                       │
│      │                                                               │
│      ├─► loadLspConfigs() → Get all plugin configs                  │
│      │                                                               │
│      ├─► For each server config:                                    │
│      │   ├─► Validate required fields                               │
│      │   ├─► Build extension → server mapping                       │
│      │   ├─► createLspClient(serverName, config)                    │
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
// lm4 - LSP Server Manager Factory
// Location: chunks.133.mjs:2172-2341
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

// Mapping: lm4→LspServerManager
```

### Server Initialization Within Manager

```javascript
// ============================================
// Manager.initialize() - Server startup
// Location: chunks.133.mjs:2176-2203
// ============================================

// ORIGINAL (partial):
async function Y() {
    let M;
    try {
        M = (await dm4()).servers, h(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(M).length} server(s)`)
    } catch (P) {
        throw K1(Error(`Failed to load LSP server configuration: ${P.message}`)), P
    }
    for (let [P, W] of Object.entries(M)) try {
        if (!W.command) throw Error(`Server ${P} missing required 'command' field`);
        if (!W.extensionToLanguage || Object.keys(W.extensionToLanguage).length === 0) throw Error(`Server ${P} missing required 'extensionToLanguage' field`);
        let G = Object.keys(W.extensionToLanguage);
        for (let Z of G) {
            let N = Z.toLowerCase();
            if (!q.has(N)) q.set(N, []);
            let T = q.get(N);
            if (T) T.push(P)
        }
        let f = Fm4(P, W);
        A.set(P, f), f.onRequest("workspace/configuration", (Z) => {
            return h(`LSP: Received workspace/configuration request from ${P}`), Z.items.map(() => null)
        }), f.start().catch((Z) => {
            K1(Error(`Failed to start LSP server ${P}: ${Z.message}`))
        })
    } catch (G) {
        K1(Error(`Failed to initialize LSP server ${P}: ${G.message}`))
    }
    h(`LSP manager initialized with ${A.size} servers`)
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
            const client = createLspClient(serverName, config);  // Fm4
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

// Mapping: Y→initialize, dm4→loadLspConfigs, q→extensionMap, A→servers, Fm4→createLspClient
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
│  │ LSP Client (Fm4)                                             │  │
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
// Location: chunks.133.mjs:2250-2327
// ============================================

// READABLE (conceptual):

// Open file - called when first accessing a file
async function openFile(filePath, content) {
    const client = ensureServerStarted(filePath);
    if (!client) return;

    const uri = `file://${path.resolve(filePath)}`;

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

    const uri = `file://${path.resolve(filePath)}`;
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
        textDocument: { uri: `file://${path.resolve(filePath)}` }
    });
    log(`LSP: Sent didSave for ${filePath}`);
}

// Close file - cleanup when done
async function closeFile(filePath) {
    const client = getServerForFile(filePath);
    if (!client || client.state !== "running") return;

    const uri = `file://${path.resolve(filePath)}`;
    await client.sendNotification("textDocument/didClose", {
        textDocument: { uri }
    });
    openFiles.delete(uri);
    log(`LSP: Sent didClose for ${filePath}`);
}
```

---

## 5. Shutdown Sequence

### Manager Shutdown

```javascript
// ============================================
// YF4 - Shutdown LSP server manager
// Location: chunks.133.mjs:2658-2667
// ============================================

// ORIGINAL:
async function YF4() {
    if (jI === void 0) return;
    try {
        await jI.shutdown(), h("LSP server manager shut down successfully")
    } catch (A) {
        K1(A), h(`Failed to shutdown LSP server manager: ${A instanceof Error?A.message:String(A)}`)
    } finally {
        jI = void 0, ev = "not-started", vP6 = void 0, EP6 = void 0, TP6++
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

// Mapping: YF4→shutdownLspServerManager
```

### Server Shutdown Within Manager

```javascript
// ============================================
// Manager.shutdown() - Stop all servers
// Location: chunks.133.mjs:2204-2217
// ============================================

// ORIGINAL (partial):
async function z() {
    let M = [];
    for (let [P, W] of A.entries())
        if (W.state === "running") try {
            await W.stop()
        } catch (G) {
            let f = G;
            K1(Error(`Failed to stop LSP server ${P}: ${f.message}`)), M.push(f)
        }
    if (A.clear(), q.clear(), K.clear(), M.length > 0) {
        let P = Error(`Failed to stop ${M.length} LSP server(s): ${M.map((W)=>W.message).join("; ")}`);
        throw K1(P), P
    }
}

// READABLE:
async function shutdown() {
    const errors = [];

    for (const [serverName, client] of servers.entries()) {
        if (client.state === "running") {
            try {
                await client.stop();
            } catch (error) {
                logError(Error(`Failed to stop LSP server ${serverName}: ${error.message}`));
                errors.push(error);
            }
        }
    }

    // Clear all state
    servers.clear();
    extensionMap.clear();
    openFiles.clear();

    // Report if any servers failed to stop
    if (errors.length > 0) {
        const message = `Failed to stop ${errors.length} LSP server(s): ${errors.map(e => e.message).join("; ")}`;
        throw Error(message);
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
// md - Get LSP manager instance
// Location: chunks.133.mjs:2615-2618
// ============================================

// ORIGINAL:
function md() {
    if (ev === "failed") return;
    return jI
}

// READABLE:
function getLspManager() {
    // Don't return instance if initialization failed
    if (lspManagerState === "failed") return;
    return lspManagerInstance;
}

// Mapping: md→getLspManager


// ============================================
// W51 - Get manager status
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

// Mapping: W51→getLspManagerStatus


// ============================================
// qF4 - Wait for manager to be ready
// Location: chunks.133.mjs:2636-2639
// ============================================

// ORIGINAL:
async function qF4() {
    if (ev === "success" || ev === "failed") return;
    if (ev === "pending" && EP6) await EP6
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

// Mapping: qF4→waitForLspManager
```

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