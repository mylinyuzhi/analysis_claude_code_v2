# LSP Server Implementation (2.1.7)

> Server lifecycle management, process communication, and plugin integration

---

## Overview

This document covers the internal implementation of LSP server management:
- Server Manager (singleton) - Routes requests to appropriate servers
- Server Instance - Wraps individual LSP server processes
- LSP Client - Low-level JSON-RPC communication
- Plugin Integration - Loading server configs from plugins

> For tool interface and result formatters, see [lsp_tool.md](./lsp_tool.md)

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Manager (Uy2)                       │
│  - Singleton pattern with state machine                         │
│  - Extension-based server routing                               │
│  - File open state tracking                                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Instance (Vy2)                      │
│  - Per-server process wrapper                                   │
│  - Retry logic with exponential backoff                         │
│  - Health check and restart management                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Client (Dy2)                               │
│  - Spawns server process                                        │
│  - vscode-jsonrpc for protocol handling                         │
│  - Initialize/shutdown lifecycle                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Manager State Machine

```
                    ┌──────────────┐
                    │  not-started │ ◄─── Initial state
                    └──────┬───────┘
                           │ initializeLspServerManager()
                           ▼
                    ┌──────────────┐
                    │   pending    │ ◄─── Async initialization in progress
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │ Success                 │ Error
              ▼                         ▼
       ┌──────────────┐         ┌──────────────┐
       │   success    │         │    failed    │
       └──────────────┘         └──────────────┘
              │                         │
              │ shutdown()              │ retry allowed
              ▼                         ▼
       ┌──────────────┐         ┌──────────────┐
       │  not-started │         │  not-started │
       └──────────────┘         └──────────────┘
```

```javascript
// ============================================
// LSP Manager State Variables
// Location: chunks.114.mjs:2668-2676
// ============================================

// ORIGINAL:
Yx              // lspManager instance
kO = "not-started"  // state: "not-started" | "pending" | "success" | "failed"
DW1             // lastError (on failure)
IW1 = 0         // generationCounter (for async race prevention)
WW1             // initPromise

// READABLE:
lspManager              // Manager instance
lspState = "not-started"  // Current state
lastError               // Error if state is "failed"
generationCounter = 0   // Prevents race conditions in async init
initPromise             // Promise for awaiting initialization
```

---

## Global Singleton Analysis

### Is LSP Server Manager Global?

**Yes, the LSP Server Manager is a global singleton.**

```javascript
// ============================================
// Global Singleton Variables
// Location: chunks.114.mjs:2668-2670
// ============================================

// ORIGINAL:
Yx                      // Single global manager instance
kO = "not-started"      // Single global state

// READABLE:
lspManager              // Only ONE instance exists for entire application
lspState = "not-started"  // Shared state across all operations
```

**Evidence from initialization code:**

```javascript
// ============================================
// initializeLspServerManager - Singleton Enforcement
// Location: chunks.114.mjs:2640-2654
// ============================================

// ORIGINAL (for source lookup):
function Py2() {
  if (k("[LSP MANAGER] initializeLspServerManager() called"), Yx !== void 0 && kO !== "failed") {
    k("[LSP MANAGER] Already initialized or initializing, skipping");
    return  // ← Prevents duplicate initialization
  }
  if (kO === "failed") Yx = void 0, DW1 = void 0;
  Yx = Uy2(), kO = "pending";
  // ... async initialization
}

// READABLE (for understanding):
function initializeLspServerManager() {
  logDebug("[LSP MANAGER] initializeLspServerManager() called");

  // Singleton check: skip if already initialized or initializing
  if (lspManager !== undefined && lspState !== "failed") {
    logDebug("[LSP MANAGER] Already initialized or initializing, skipping");
    return;
  }

  // Reset on failure to allow retry
  if (lspState === "failed") {
    lspManager = undefined;
    lastError = undefined;
  }

  lspManager = createLspServerManager();
  lspState = "pending";
  // ... async initialization
}

// Mapping: Py2→initializeLspServerManager, Yx→lspManager, kO→lspState
```

---

### Multi-Workspace Support

**Current implementation does NOT support multiple workspaces or dynamic workspace switching.**

#### Limitation 1: Single Workspace at Initialization

Each LSP Server Instance binds to ONE workspace at startup:

```javascript
// ============================================
// Server Workspace Binding (at start time)
// Location: chunks.114.mjs:1798-1812
// ============================================

// ORIGINAL:
let E = Q.workspaceFolder || o1(),  // config.workspaceFolder OR getCwd()
  z = `file://${E}`,
  $ = {
    workspaceFolders: [{
      uri: z,
      name: Ky2.basename(E)
    }],
    rootPath: E,
    rootUri: z,
    capabilities: {
      workspace: {
        configuration: !1,
        workspaceFolders: !1  // ← Explicitly disabled!
      },
      // ...
    }
  };

// READABLE:
let workspaceFolder = config.workspaceFolder || getCwd();  // Determined ONCE
let workspaceUri = `file://${workspaceFolder}`;
let initializeParams = {
  workspaceFolders: [{ uri: workspaceUri, name: path.basename(workspaceFolder) }],
  rootPath: workspaceFolder,
  rootUri: workspaceUri,
  capabilities: {
    workspace: {
      configuration: false,
      workspaceFolders: false  // ← Multi-workspace NOT supported
    },
  }
};
```

#### Limitation 2: No Workspace Change Notification

The implementation does **NOT** send `workspace/didChangeWorkspaceFolders` notification:

```
LSP Protocol Standard:
├── workspace/didChangeWorkspaceFolders  ← NOT IMPLEMENTED
├── workspace/didChangeConfiguration     ← Config only, not folders
└── workspace/configuration              ← Returns null for all items
```

#### Limitation 3: No Automatic Reinitialize on CWD Change

```
User switches worktree (cwd changes):
├── LSP Manager: Still running ✓
├── LSP Servers: Still bound to OLD workspace ✗
├── File operations: May reference wrong workspace ✗
└── No detection mechanism for cwd change ✗
```

---

### What Happens When Switching Worktree?

```
┌─────────────────────────────────────────────────────────────────┐
│  Session Start: cwd = /project/main                             │
├─────────────────────────────────────────────────────────────────┤
│  1. initializeLspServerManager()                                │
│  2. TypeScript server starts with rootUri = file:///project/main│
│  3. Files opened relative to /project/main                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ User runs: cd /project/feature-branch
┌─────────────────────────────────────────────────────────────────┐
│  After Worktree Switch: cwd = /project/feature-branch           │
├─────────────────────────────────────────────────────────────────┤
│  ❌ LSP Manager: SAME instance (global singleton)               │
│  ❌ TypeScript server: Still rootUri = file:///project/main     │
│  ❌ New file opens: Server may not find them                    │
│  ❌ Go to definition: May jump to wrong project                 │
│  ❌ References: May show results from old workspace             │
└─────────────────────────────────────────────────────────────────┘
```

### Potential Issues

| Scenario | Expected | Actual |
|----------|----------|--------|
| Open file in new worktree | Resolved relative to new cwd | May fail if path doesn't exist in old workspace |
| Go to definition | Jump to definition in new worktree | May jump to old worktree |
| Find references | References in new worktree | May include/miss files due to workspace mismatch |
| Workspace symbols | Symbols from new worktree | Indexed from old workspace |

---

### Workaround: Manual Restart

The only current way to handle workspace changes is to **shutdown and reinitialize**:

```javascript
// ============================================
// shutdownLspServerManager - Cleanup and Reset
// Location: chunks.114.mjs:2657-2665
// ============================================

// ORIGINAL:
async function Sy2() {
  if (Yx === void 0) return;
  try {
    await Yx.shutdown(), k("LSP server manager shut down successfully")
  } catch (A) {
    e(A), k(`Failed to shutdown LSP server manager: ${A instanceof Error?A.message:String(A)}`)
  } finally {
    Yx = void 0, kO = "not-started", DW1 = void 0, WW1 = void 0, IW1++
  }
}

// READABLE:
async function shutdownLspServerManager() {
  if (lspManager === undefined) return;
  try {
    await lspManager.shutdown();
    logDebug("LSP server manager shut down successfully");
  } catch (error) {
    logError(error);
    logDebug(`Failed to shutdown LSP server manager: ${error.message}`);
  } finally {
    // Reset all global state
    lspManager = undefined;
    lspState = "not-started";
    lastError = undefined;
    initPromise = undefined;
    generationCounter++;  // Invalidate any pending async operations
  }
}

// Mapping: Sy2→shutdownLspServerManager
```

**Usage pattern for workspace switch:**
```
1. shutdownLspServerManager()  → Cleans up old servers
2. Change cwd to new worktree
3. initializeLspServerManager() → Starts fresh with new workspace
```

---

### Recommendations for Multi-Workspace Support

If multi-workspace support is needed, the following changes would be required:

1. **Capability Declaration**:
   ```javascript
   capabilities: {
     workspace: { workspaceFolders: true }  // Enable multi-workspace
   }
   ```

2. **Workspace Change Notification**:
   ```javascript
   // Send when workspace folders change
   server.sendNotification("workspace/didChangeWorkspaceFolders", {
     event: {
       added: [{ uri: "file:///new/path", name: "new-workspace" }],
       removed: [{ uri: "file:///old/path", name: "old-workspace" }]
     }
   });
   ```

3. **CWD Change Detection**:
   ```javascript
   // Monitor getCwd() changes and trigger reinitialize
   let lastCwd = getCwd();
   onCwdChange((newCwd) => {
     if (newCwd !== lastCwd) {
       // Option A: Reinitialize all servers
       // Option B: Send didChangeWorkspaceFolders
     }
   });
   ```

4. **Per-Workspace Server Instances** (alternative architecture):
   ```javascript
   // Map<workspacePath, LspServerManager>
   let workspaceManagers = new Map();
   ```

---

## LSP Server Manager

```javascript
// ============================================
// createLspServerManager - Create LSP Server Manager
// Location: chunks.114.mjs:2171-2330
// ============================================

// ORIGINAL (for source lookup):
function Uy2() {
  let A = new Map,           // serverName → LspServerInstance
    Q = new Map,             // extension → [serverNames]
    B = new Map;             // fileUri → serverName (open files)

  async function G() {       // initialize()
    let H;
    try {
      H = (await $y2()).servers;
      k(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(H).length} server(s)`)
    } catch (E) {
      throw e(Error(`Failed to load LSP server configuration: ${E.message}`)), E
    }
    for (let [E, z] of Object.entries(H)) try {
      if (!z.command) throw Error(`Server ${E} missing required 'command' field`);
      if (!z.extensionToLanguage || Object.keys(z.extensionToLanguage).length === 0)
        throw Error(`Server ${E} missing required 'extensionToLanguage' field`);
      // Build extension → server mapping
      let $ = Object.keys(z.extensionToLanguage);
      for (let L of $) {
        let M = L.toLowerCase();
        if (!Q.has(M)) Q.set(M, []);
        Q.get(M).push(E)
      }
      // Create server instance
      let O = Vy2(E, z);
      A.set(E, O);
      O.onRequest("workspace/configuration", (L) => {
        k(`LSP: Received workspace/configuration request from ${E}`);
        return L.items.map(() => null)
      });
      O.start().catch((L) => {
        e(Error(`Failed to start LSP server ${E}: ${L.message}`))
      })
    } catch ($) {
      e(Error(`Failed to initialize LSP server ${E}: ${$.message}`))
    }
    k(`LSP manager initialized with ${A.size} servers`)
  }

  function Y(H) {            // getServerForFile(filePath)
    let E = Mc.extname(H).toLowerCase(),
      z = Q.get(E);
    if (!z || z.length === 0) return;
    let $ = z[0];
    if (!$) return;
    return A.get($)
  }

  async function D(H, E) {   // openFile(filePath, content)
    let z = await J(H);
    if (!z) return;
    let $ = `file://${Mc.resolve(H)}`;
    if (B.get($) === z.name) {
      k(`LSP: File already open, skipping didOpen for ${H}`);
      return
    }
    let O = Mc.extname(H).toLowerCase(),
      L = z.config.extensionToLanguage[O] || "plaintext";
    try {
      await z.sendNotification("textDocument/didOpen", {
        textDocument: { uri: $, languageId: L, version: 1, text: E }
      });
      B.set($, z.name);
      k(`LSP: Sent didOpen for ${H} (languageId: ${L})`)
    } catch (M) {
      throw e(Error(`Failed to sync file open ${H}: ${M.message}`)), M
    }
  }

  return {
    initialize: G,
    shutdown: Z,
    getServerForFile: Y,
    getOrStartServer: J,
    sendRequest: X,
    getAllServers: I,
    openFile: D,
    syncFileChange: W,
    syncFileSave: K,
    isFileOpen: (H) => B.has(`file://${Mc.resolve(H)}`)
  }
}

// READABLE (for understanding):
function createLspServerManager() {
  let servers = new Map();           // serverName → LspServerInstance
  let extensionToServers = new Map(); // extension → [serverNames]
  let openFiles = new Map();         // fileUri → serverName

  async function initialize() {
    let serverConfigs;
    try {
      serverConfigs = (await getAllLspServers()).servers;
      logDebug(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(serverConfigs).length} server(s)`);
    } catch (error) {
      throw logError(Error(`Failed to load LSP server configuration: ${error.message}`)), error;
    }

    for (let [serverName, config] of Object.entries(serverConfigs)) {
      try {
        // Validate required fields
        if (!config.command) throw Error(`Server ${serverName} missing required 'command' field`);
        if (!config.extensionToLanguage || Object.keys(config.extensionToLanguage).length === 0)
          throw Error(`Server ${serverName} missing required 'extensionToLanguage' field`);

        // Build extension → server mapping
        let extensions = Object.keys(config.extensionToLanguage);
        for (let ext of extensions) {
          let lowerExt = ext.toLowerCase();
          if (!extensionToServers.has(lowerExt)) extensionToServers.set(lowerExt, []);
          extensionToServers.get(lowerExt).push(serverName);
        }

        // Create and start server instance
        let serverInstance = createLspServerInstance(serverName, config);
        servers.set(serverName, serverInstance);

        // Handle workspace/configuration requests (return null for all items)
        serverInstance.onRequest("workspace/configuration", (params) => {
          logDebug(`LSP: Received workspace/configuration request from ${serverName}`);
          return params.items.map(() => null);
        });

        serverInstance.start().catch((error) => {
          logError(Error(`Failed to start LSP server ${serverName}: ${error.message}`));
        });
      } catch (error) {
        logError(Error(`Failed to initialize LSP server ${serverName}: ${error.message}`));
      }
    }
    logDebug(`LSP manager initialized with ${servers.size} servers`);
  }

  function getServerForFile(filePath) {
    let extension = path.extname(filePath).toLowerCase();
    let serverNames = extensionToServers.get(extension);
    if (!serverNames || serverNames.length === 0) return;
    let serverName = serverNames[0];  // Use first matching server
    if (!serverName) return;
    return servers.get(serverName);
  }

  async function openFile(filePath, content) {
    let server = await ensureServerStarted(filePath);
    if (!server) return;
    let fileUri = `file://${path.resolve(filePath)}`;

    // Skip if already open
    if (openFiles.get(fileUri) === server.name) {
      logDebug(`LSP: File already open, skipping didOpen for ${filePath}`);
      return;
    }

    let extension = path.extname(filePath).toLowerCase();
    let languageId = server.config.extensionToLanguage[extension] || "plaintext";

    try {
      await server.sendNotification("textDocument/didOpen", {
        textDocument: { uri: fileUri, languageId, version: 1, text: content }
      });
      openFiles.set(fileUri, server.name);
      logDebug(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);
    } catch (error) {
      throw logError(Error(`Failed to sync file open ${filePath}: ${error.message}`)), error;
    }
  }

  return {
    initialize,          // G - Load configs, start servers
    shutdown,            // Z - Stop all servers gracefully
    getServerForFile,    // Y - Get server by file extension
    ensureServerStarted, // J - Start server if not running
    sendRequest,         // X - Send LSP request to appropriate server
    getAllServers: () => servers,  // I - Get all server instances
    openFile,            // D - Send textDocument/didOpen
    changeFile,          // W - Send textDocument/didChange
    saveFile,            // K - Send textDocument/didSave
    closeFile,           // V - Send textDocument/didClose
    isFileOpen           // F - Check if file is tracked
  };
}

// Mapping: Uy2→createLspServerManager, A→servers, Q→extensionToServers, B→openFiles
// Mapping: G→initialize, Z→shutdown, Y→getServerForFile, J→ensureServerStarted
// Mapping: X→sendRequest, I→getAllServers, D→openFile, W→changeFile, K→saveFile, V→closeFile, F→isFileOpen
// Mapping: $y2→getAllLspServers, Vy2→createLspServerInstance, Mc→path
```

**Why this approach:**
- Extension-based routing allows multiple LSP servers to coexist (e.g., TypeScript, Python, Go)
- First-match strategy for extensions (first configured server wins)
- File open state tracking prevents duplicate `didOpen` notifications
- Servers start asynchronously during initialization for faster startup

---

## Manager Core Methods

### ensureServerStarted

```javascript
// ============================================
// ensureServerStarted - Start server on demand
// Location: chunks.114.mjs:2226-2234
// ============================================

// ORIGINAL (for source lookup):
async function J(H) {
  let E = Y(H);
  if (!E) return;
  if (E.state === "stopped") try {
    await E.start()
  } catch (z) {
    throw e(Error(`Failed to start LSP server for file ${H}: ${z.message}`)), z
  }
  return E
}

// READABLE (for understanding):
async function ensureServerStarted(filePath) {
  let server = getServerForFile(filePath);
  if (!server) return;  // No server configured for this file type

  if (server.state === "stopped") {
    try {
      await server.start();
    } catch (error) {
      throw logError(Error(`Failed to start LSP server for file ${filePath}: ${error.message}`)), error;
    }
  }
  return server;
}

// Mapping: J→ensureServerStarted, H→filePath, E→server, Y→getServerForFile
```

### sendRequest

```javascript
// ============================================
// sendRequest - Route LSP request to appropriate server
// Location: chunks.114.mjs:2236-2243
// ============================================

// ORIGINAL (for source lookup):
async function X(H, E, z) {
  let $ = await J(H);
  if (!$) return;
  try {
    return await $.sendRequest(E, z)
  } catch (O) {
    throw e(Error(`LSP request failed for file ${H}, method '${E}': ${O.message}`)), O
  }
}

// READABLE (for understanding):
async function sendRequest(filePath, method, params) {
  let server = await ensureServerStarted(filePath);
  if (!server) return;  // No server available

  try {
    return await server.sendRequest(method, params);
  } catch (error) {
    throw logError(Error(`LSP request failed for file ${filePath}, method '${method}': ${error.message}`)), error;
  }
}

// Mapping: X→sendRequest, H→filePath, E→method, z→params, $→server, J→ensureServerStarted
```

**Key insight:** `sendRequest` implements lazy server startup - the server is only started when a request is made for a file of that type. This optimizes startup time by deferring server initialization until actually needed.

### shutdown

```javascript
// ============================================
// shutdown - Graceful shutdown of all servers
// Location: chunks.114.mjs:2203-2216
// ============================================

// ORIGINAL (for source lookup):
async function Z() {
  let H = [];
  for (let [E, z] of A.entries())
    if (z.state === "running") try {
      await z.stop()
    } catch ($) {
      let O = $;
      e(Error(`Failed to stop LSP server ${E}: ${O.message}`)), H.push(O)
    }
  if (A.clear(), Q.clear(), B.clear(), H.length > 0) {
    let E = Error(`Failed to stop ${H.length} LSP server(s): ${H.map((z)=>z.message).join("; ")}`);
    throw e(E), E
  }
}

// READABLE (for understanding):
async function shutdown() {
  let errors = [];

  // Stop all running servers
  for (let [serverName, server] of servers.entries()) {
    if (server.state === "running") {
      try {
        await server.stop();
      } catch (error) {
        logError(Error(`Failed to stop LSP server ${serverName}: ${error.message}`));
        errors.push(error);
      }
    }
  }

  // Clear all state maps
  servers.clear();
  extensionToServers.clear();
  openFiles.clear();

  // Throw aggregated error if any servers failed to stop
  if (errors.length > 0) {
    let aggregatedError = Error(`Failed to stop ${errors.length} LSP server(s): ${errors.map(e => e.message).join("; ")}`);
    throw logError(aggregatedError), aggregatedError;
  }
}

// Mapping: Z→shutdown, H→errors, A→servers, Q→extensionToServers, B→openFiles
```

**Why this approach:**
- **Best-effort shutdown**: Attempts to stop all servers even if some fail
- **Error aggregation**: Collects all errors and reports them together
- **State cleanup**: Clears all tracking maps regardless of errors to prevent memory leaks

---

## File Synchronization Methods

The manager tracks file state and synchronizes with LSP servers via standard LSP text document notifications:

```javascript
// ============================================
// File Sync Methods - didChange, didSave, didClose
// Location: chunks.114.mjs:2273-2321
// ============================================

// ORIGINAL (for source lookup):
async function W(H, E) {   // changeFile(filePath, content)
  let z = Y(H);
  if (!z || z.state !== "running") return D(H, E);  // Fall back to openFile
  let $ = `file://${Mc.resolve(H)}`;
  if (B.get($) !== z.name) return D(H, E);  // Server changed, reopen
  try {
    await z.sendNotification("textDocument/didChange", {
      textDocument: { uri: $, version: 1 },
      contentChanges: [{ text: E }]
    });
    k(`LSP: Sent didChange for ${H}`)
  } catch (O) {
    throw e(Error(`Failed to sync file change ${H}: ${O.message}`)), O
  }
}

async function K(H) {      // saveFile(filePath)
  let E = Y(H);
  if (!E || E.state !== "running") return;
  try {
    await E.sendNotification("textDocument/didSave", {
      textDocument: { uri: `file://${Mc.resolve(H)}` }
    });
    k(`LSP: Sent didSave for ${H}`)
  } catch (z) {
    throw e(Error(`Failed to sync file save ${H}: ${z.message}`)), z
  }
}

async function V(H) {      // closeFile(filePath)
  let E = Y(H);
  if (!E || E.state !== "running") return;
  let z = `file://${Mc.resolve(H)}`;
  try {
    await E.sendNotification("textDocument/didClose", {
      textDocument: { uri: z }
    });
    B.delete(z);  // Remove from open files tracking
    k(`LSP: Sent didClose for ${H}`)
  } catch ($) {
    throw e(Error(`Failed to sync file close ${H}: ${$.message}`)), $
  }
}

// READABLE (for understanding):
async function changeFile(filePath, content) {
  let server = getServerForFile(filePath);
  // If server not running or file not tracked, fall back to openFile
  if (!server || server.state !== "running") return openFile(filePath, content);

  let fileUri = `file://${path.resolve(filePath)}`;
  if (openFiles.get(fileUri) !== server.name) return openFile(filePath, content);

  try {
    await server.sendNotification("textDocument/didChange", {
      textDocument: { uri: fileUri, version: 1 },
      contentChanges: [{ text: content }]  // Full document sync
    });
    logDebug(`LSP: Sent didChange for ${filePath}`);
  } catch (error) {
    throw logError(Error(`Failed to sync file change ${filePath}: ${error.message}`)), error;
  }
}

async function saveFile(filePath) {
  let server = getServerForFile(filePath);
  if (!server || server.state !== "running") return;
  try {
    await server.sendNotification("textDocument/didSave", {
      textDocument: { uri: `file://${path.resolve(filePath)}` }
    });
    logDebug(`LSP: Sent didSave for ${filePath}`);
  } catch (error) {
    throw logError(Error(`Failed to sync file save ${filePath}: ${error.message}`)), error;
  }
}

async function closeFile(filePath) {
  let server = getServerForFile(filePath);
  if (!server || server.state !== "running") return;
  let fileUri = `file://${path.resolve(filePath)}`;
  try {
    await server.sendNotification("textDocument/didClose", {
      textDocument: { uri: fileUri }
    });
    openFiles.delete(fileUri);  // Remove from tracking
    logDebug(`LSP: Sent didClose for ${filePath}`);
  } catch (error) {
    throw logError(Error(`Failed to sync file close ${filePath}: ${error.message}`)), error;
  }
}

// Mapping: W→changeFile, K→saveFile, V→closeFile, H→filePath, E→content/server
```

**Key insight:** Uses **full document sync** (TextDocumentSyncKind.Full) for simplicity - sends entire file content on change rather than incremental edits. This is less efficient but simpler and works with all LSP servers.

---

## LSP Server Instance

```javascript
// ============================================
// createLspServerInstance - Create LSP Server Instance
// Location: chunks.114.mjs:1784-1958
// ============================================

// ORIGINAL (for source lookup):
function Vy2(A, Q) {
  // ... validation for unimplemented features
  let B = Dy2(A),           // Create LSP client
    G = "stopped",          // Server state
    Z, Y, J = 0;            // startTime, lastError, restartCount

  async function X() {      // start()
    if (G === "running" || G === "starting") return;
    try {
      G = "starting";
      k(`Starting LSP server instance: ${A}`);
      await B.start(Q.command, Q.args || [], { env: Q.env, cwd: Q.workspaceFolder });

      let E = Q.workspaceFolder || o1(),
        z = `file://${E}`,
        $ = {
          processId: process.pid,
          initializationOptions: Q.initializationOptions ?? {},
          workspaceFolders: [{ uri: z, name: Ky2.basename(E) }],
          rootPath: E,
          rootUri: z,
          capabilities: {
            workspace: { configuration: !1, workspaceFolders: !1 },
            textDocument: {
              synchronization: { dynamicRegistration: !1, willSave: !1, willSaveWaitUntil: !1, didSave: !0 },
              publishDiagnostics: { relatedInformation: !0, tagSupport: { valueSet: [1, 2] }, versionSupport: !1, codeDescriptionSupport: !0, dataSupport: !1 },
              hover: { dynamicRegistration: !1, contentFormat: ["markdown", "plaintext"] },
              definition: { dynamicRegistration: !1, linkSupport: !0 },
              references: { dynamicRegistration: !1 },
              documentSymbol: { dynamicRegistration: !1, hierarchicalDocumentSymbolSupport: !0 },
              callHierarchy: { dynamicRegistration: !1 }
            },
            general: { positionEncodings: ["utf-16"] }
          }
        };
      await B.initialize($);
      G = "running";
      Z = new Date;
      k(`LSP server instance started: ${A}`)
    } catch (E) {
      throw G = "error", Y = E, e(E), E
    }
  }

  async function K(E, z) {  // sendRequest with retry
    if (!W()) {
      let L = Error(`Cannot send request to LSP server '${A}': server is ${G}${Y?`, last error: ${Y.message}`:""}`);
      throw e(L), L
    }
    let $;
    for (let L = 0; L <= P$0; L++) try {  // P$0 = max retries
      return await B.sendRequest(E, z)
    } catch (M) {
      $ = M;
      let _ = M.code;
      // Retry on ContentModified error
      if (typeof _ === "number" && _ === Rg5 && L < P$0) {
        let x = _g5 * Math.pow(2, L);  // Exponential backoff
        k(`LSP request '${E}' to '${A}' got ContentModified error, retrying in ${x}ms (attempt ${L+1}/${P$0})…`);
        await new Promise((b) => setTimeout(b, x));
        continue
      }
      break
    }
    let O = Error(`LSP request '${E}' failed for server '${A}': ${$?.message??"unknown error"}`);
    throw e(O), O
  }

  return {
    name: A,
    config: Q,
    get state() { return G },
    get startTime() { return Z },
    get lastError() { return Y },
    get restartCount() { return J },
    start: X,
    stop: I,
    restart: D,
    isReady: W,
    sendRequest: K,
    sendNotification: V,
    onNotification: F,
    onRequest: H
  }
}

// READABLE (for understanding):
function createLspServerInstance(serverName, config) {
  // Validate unimplemented features
  if (config.restartOnCrash !== undefined) throw Error(`LSP server '${serverName}': restartOnCrash is not yet implemented`);
  if (config.startupTimeout !== undefined) throw Error(`LSP server '${serverName}': startupTimeout is not yet implemented`);
  if (config.shutdownTimeout !== undefined) throw Error(`LSP server '${serverName}': shutdownTimeout is not yet implemented`);

  let client = createLspClient(serverName);
  let state = "stopped";
  let startTime, lastError;
  let restartCount = 0;

  async function start() {
    if (state === "running" || state === "starting") return;
    try {
      state = "starting";
      logDebug(`Starting LSP server instance: ${serverName}`);
      await client.start(config.command, config.args || [], { env: config.env, cwd: config.workspaceFolder });

      let workspaceFolder = config.workspaceFolder || getCwd();
      let workspaceUri = `file://${workspaceFolder}`;
      let initializeParams = {
        processId: process.pid,
        initializationOptions: config.initializationOptions ?? {},
        workspaceFolders: [{ uri: workspaceUri, name: path.basename(workspaceFolder) }],
        rootPath: workspaceFolder,
        rootUri: workspaceUri,
        capabilities: {
          workspace: { configuration: false, workspaceFolders: false },
          textDocument: {
            synchronization: { dynamicRegistration: false, willSave: false, willSaveWaitUntil: false, didSave: true },
            publishDiagnostics: { relatedInformation: true, tagSupport: { valueSet: [1, 2] }, versionSupport: false, codeDescriptionSupport: true, dataSupport: false },
            hover: { dynamicRegistration: false, contentFormat: ["markdown", "plaintext"] },
            definition: { dynamicRegistration: false, linkSupport: true },
            references: { dynamicRegistration: false },
            documentSymbol: { dynamicRegistration: false, hierarchicalDocumentSymbolSupport: true },
            callHierarchy: { dynamicRegistration: false }
          },
          general: { positionEncodings: ["utf-16"] }
        }
      };
      await client.initialize(initializeParams);
      state = "running";
      startTime = new Date();
      logDebug(`LSP server instance started: ${serverName}`);
    } catch (error) {
      state = "error";
      lastError = error;
      throw logError(error), error;
    }
  }

  async function sendRequest(method, params) {
    if (!isHealthy()) {
      let error = Error(`Cannot send request to LSP server '${serverName}': server is ${state}${lastError ? `, last error: ${lastError.message}` : ""}`);
      throw logError(error), error;
    }

    let lastErr;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await client.sendRequest(method, params);
      } catch (error) {
        lastErr = error;
        let errorCode = error.code;
        // Retry on ContentModified error with exponential backoff
        if (typeof errorCode === "number" && errorCode === CONTENT_MODIFIED_ERROR_CODE && attempt < MAX_RETRIES) {
          let delay = BASE_RETRY_DELAY * Math.pow(2, attempt);
          logDebug(`LSP request '${method}' to '${serverName}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})…`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    let error = Error(`LSP request '${method}' failed for server '${serverName}': ${lastErr?.message ?? "unknown error"}`);
    throw logError(error), error;
  }

  return {
    name: serverName,
    config,
    get state() { return state },
    get startTime() { return startTime },
    get lastError() { return lastError },
    get restartCount() { return restartCount },
    start,
    stop,
    restart,
    isHealthy,
    sendRequest,
    sendNotification,
    onNotification,
    onRequest
  };
}

// Mapping: Vy2→createLspServerInstance, Dy2→createLspClient, A→serverName, Q→config
// Mapping: G→state, Z→startTime, Y→lastError, J→restartCount
// Mapping: P$0→MAX_RETRIES, Rg5→CONTENT_MODIFIED_ERROR_CODE, _g5→BASE_RETRY_DELAY
```

**Key insight:** The retry logic with exponential backoff handles `ContentModified` errors, which occur when the file content changes during an LSP operation.

---

## Server Instance Additional Methods

### isHealthy

```javascript
// ============================================
// isHealthy - Health Check Function
// Location: chunks.114.mjs:1888-1890
// ============================================

// ORIGINAL (for source lookup):
function W() {
  return G === "running" && B.isInitialized
}

// READABLE (for understanding):
function isHealthy() {
  return state === "running" && client.isInitialized;
}

// Mapping: W→isHealthy, G→state, B→client
```

**Key insight:** A server is considered healthy only when:
1. State is "running" (not stopped/starting/error)
2. LSP client connection is initialized (initialize handshake completed)

### stop

```javascript
// ============================================
// stop - Graceful Server Stop
// Location: chunks.114.mjs:1859-1865
// ============================================

// ORIGINAL (for source lookup):
async function I() {
  if (G === "stopped" || G === "stopping") return;
  try {
    G = "stopping", await B.stop(), G = "stopped", k(`LSP server instance stopped: ${A}`)
  } catch (E) {
    throw G = "error", Y = E, e(E), E
  }
}

// READABLE (for understanding):
async function stop() {
  // Idempotent: no-op if already stopped/stopping
  if (state === "stopped" || state === "stopping") return;

  try {
    state = "stopping";
    await client.stop();  // Send shutdown + exit, kill process
    state = "stopped";
    logDebug(`LSP server instance stopped: ${serverName}`);
  } catch (error) {
    state = "error";
    lastError = error;
    throw logError(error), error;
  }
}

// Mapping: I→stop, G→state, B→client
```

### restart

```javascript
// ============================================
// restart - Server Restart with Max Retries
// Location: chunks.114.mjs:1867-1886
// ============================================

// ORIGINAL (for source lookup):
async function D() {
  try {
    await I()  // stop first
  } catch (z) {
    let $ = Error(`Failed to stop LSP server '${A}' during restart: ${z.message}`);
    throw e($), $
  }
  J++;  // Increment restart counter
  let E = Q.maxRestarts ?? 3;
  if (J > E) {
    let z = Error(`Max restart attempts (${E}) exceeded for server '${A}'`);
    throw e(z), z
  }
  try {
    await X()  // start again
  } catch (z) {
    let $ = Error(`Failed to start LSP server '${A}' during restart (attempt ${J}/${E}): ${z.message}`);
    throw e($), $
  }
}

// READABLE (for understanding):
async function restart() {
  // Step 1: Stop the server
  try {
    await stop();
  } catch (error) {
    let wrappedError = Error(`Failed to stop LSP server '${serverName}' during restart: ${error.message}`);
    throw logError(wrappedError), wrappedError;
  }

  // Step 2: Increment restart counter
  restartCount++;
  let maxRestarts = config.maxRestarts ?? 3;  // Default: 3 attempts

  // Step 3: Check if max restarts exceeded
  if (restartCount > maxRestarts) {
    let error = Error(`Max restart attempts (${maxRestarts}) exceeded for server '${serverName}'`);
    throw logError(error), error;
  }

  // Step 4: Start the server again
  try {
    await start();
  } catch (error) {
    let wrappedError = Error(`Failed to start LSP server '${serverName}' during restart (attempt ${restartCount}/${maxRestarts}): ${error.message}`);
    throw logError(wrappedError), wrappedError;
  }
}

// Mapping: D→restart, I→stop, X→start, J→restartCount, Q→config, E→maxRestarts
```

**Why this approach:**
- **Stop-before-start**: Ensures clean state before restart
- **Restart counter**: Tracks total restarts to prevent infinite loops
- **Max restarts limit**: Default 3 attempts, configurable via `config.maxRestarts`
- **Detailed error messages**: Includes attempt count for debugging

**Note:** `restartOnCrash` (automatic crash recovery) is NOT YET IMPLEMENTED. The restart function is manually triggered.

### sendNotification and Event Handlers

```javascript
// ============================================
// sendNotification - Send LSP Notification
// Location: chunks.114.mjs:1912-1922
// ============================================

// ORIGINAL (for source lookup):
async function V(E, z) {
  if (!W()) {
    let $ = Error(`Cannot send notification to LSP server '${A}': server is ${G}`);
    throw e($), $
  }
  try {
    await B.sendNotification(E, z)
  } catch ($) {
    let O = Error(`LSP notification '${E}' failed for server '${A}': ${$.message}`);
    throw e(O), O
  }
}

// READABLE (for understanding):
async function sendNotification(method, params) {
  if (!isHealthy()) {
    let error = Error(`Cannot send notification to LSP server '${serverName}': server is ${state}`);
    throw logError(error), error;
  }
  try {
    await client.sendNotification(method, params);
  } catch (error) {
    let wrappedError = Error(`LSP notification '${method}' failed for server '${serverName}': ${error.message}`);
    throw logError(wrappedError), wrappedError;
  }
}

// Mapping: V→sendNotification, W→isHealthy, B→client
```

```javascript
// ============================================
// onNotification, onRequest - Event Handlers
// Location: chunks.114.mjs:1925-1931
// ============================================

// ORIGINAL (for source lookup):
function F(E, z) {
  B.onNotification(E, z)
}
function H(E, z) {
  B.onRequest(E, z)
}

// READABLE (for understanding):
function onNotification(method, handler) {
  client.onNotification(method, handler);
}
function onRequest(method, handler) {
  client.onRequest(method, handler);
}

// Mapping: F→onNotification, H→onRequest, B→client
```

**Key insight:** Event handlers allow the server instance to respond to:
- **Notifications**: One-way messages from server (e.g., `textDocument/publishDiagnostics`)
- **Requests**: Two-way messages requiring response (e.g., `workspace/configuration`)

---

## LSP Client (Low-level)

```javascript
// ============================================
// createLspClient - Create Low-level LSP Client
// Location: chunks.114.mjs:1580-1773
// ============================================

// ORIGINAL (for source lookup):
function Dy2(A) {
  let Q, B, G, Z = !1, Y = !1, J, X = !1, I = [], D = [];

  function W() {
    if (Y && J) throw J;
  }

  return {
    async start(K, V, F = {}) {
      // ... spawn process with spawn_sync (for initial spawn detection)
      Q = CA().spawn(K, V, { env: { ...process.env, ...F.env }, cwd: F.cwd, stdio: ["pipe", "pipe", "pipe"] });
      // ... handle spawn/error events
      let E = new us.StreamMessageReader(Q.stdout),
        z = new us.StreamMessageWriter(Q.stdin);
      B = us.createMessageConnection(E, z);
      B.onError(([$, O, L]) => {
        if (!X) Y = !0, J = $, e(Error(`LSP server ${A} connection error: ${$.message}`))
      });
      B.onClose(() => {
        if (!X) Z = !1, k(`LSP server ${A} connection closed`)
      });
      B.listen();
      B.trace(us.Trace.Verbose, { log: ($) => { k(`[LSP PROTOCOL ${A}] ${$}`) } }).catch(...);
      // Apply queued handlers
      for (let { method: $, handler: O } of I) B.onNotification($, O);
      for (let { method: $, handler: O } of D) B.onRequest($, O);
      k(`LSP client started for ${A}`)
    },
    async initialize(K) {
      if (!B) throw Error("LSP client not started");
      W();
      try {
        let V = await B.sendRequest("initialize", K);
        G = V.capabilities;
        await B.sendNotification("initialized", {});
        Z = !0;
        k(`LSP server ${A} initialized`);
        return V
      } catch (V) {
        throw e(Error(`LSP server ${A} initialize failed: ${V.message}`)), V
      }
    },
    async sendRequest(K, V) {
      if (!B) throw Error("LSP client not started");
      if (W(), !Z) throw Error("LSP server not initialized");
      try {
        return await B.sendRequest(K, V)
      } catch (F) {
        throw e(Error(`LSP server ${A} request ${K} failed: ${F.message}`)), F
      }
    },
    async stop() {
      X = !0;
      try {
        if (B) await B.sendRequest("shutdown", null), await B.sendNotification("exit", null)
      } catch (V) { ... }
      finally {
        if (B) { B.dispose(); B = void 0 }
        if (Q) { Q.removeAllListeners(...); Q.kill(); Q = void 0 }
        Z = !1; G = void 0; X = !1;
        k(`LSP client stopped for ${A}`)
      }
    },
    get isInitialized() { return Z },
    get capabilities() { return G }
  }
}

// READABLE (for understanding):
function createLspClient(serverName) {
  let process, connection, capabilities;
  let isInitialized = false, hasError = false, lastError, isShuttingDown = false;
  let queuedNotificationHandlers = [], queuedRequestHandlers = [];

  function checkError() {
    if (hasError && lastError) throw lastError;
  }

  return {
    async start(command, args, options = {}) {
      // Spawn LSP server process
      process = childProcess.spawn(command, args, {
        env: { ...process.env, ...options.env },
        cwd: options.cwd,
        stdio: ["pipe", "pipe", "pipe"]
      });

      // Create JSON-RPC connection over stdio
      let reader = new vscodeJsonrpc.StreamMessageReader(process.stdout);
      let writer = new vscodeJsonrpc.StreamMessageWriter(process.stdin);
      connection = vscodeJsonrpc.createMessageConnection(reader, writer);

      connection.onError(([error, msg, code]) => {
        if (!isShuttingDown) {
          hasError = true;
          lastError = error;
          logError(Error(`LSP server ${serverName} connection error: ${error.message}`));
        }
      });
      connection.onClose(() => {
        if (!isShuttingDown) {
          isInitialized = false;
          logDebug(`LSP server ${serverName} connection closed`);
        }
      });

      connection.listen();
      connection.trace(vscodeJsonrpc.Trace.Verbose, { log: (msg) => logDebug(`[LSP PROTOCOL ${serverName}] ${msg}`) });

      // Apply handlers that were queued before connection was ready
      for (let { method, handler } of queuedNotificationHandlers) {
        connection.onNotification(method, handler);
      }
      for (let { method, handler } of queuedRequestHandlers) {
        connection.onRequest(method, handler);
      }

      logDebug(`LSP client started for ${serverName}`);
    },

    async initialize(params) {
      if (!connection) throw Error("LSP client not started");
      checkError();
      try {
        let result = await connection.sendRequest("initialize", params);
        capabilities = result.capabilities;
        await connection.sendNotification("initialized", {});
        isInitialized = true;
        logDebug(`LSP server ${serverName} initialized`);
        return result;
      } catch (error) {
        throw logError(Error(`LSP server ${serverName} initialize failed: ${error.message}`)), error;
      }
    },

    async sendRequest(method, params) {
      if (!connection) throw Error("LSP client not started");
      checkError();
      if (!isInitialized) throw Error("LSP server not initialized");
      try {
        return await connection.sendRequest(method, params);
      } catch (error) {
        throw logError(Error(`LSP server ${serverName} request ${method} failed: ${error.message}`)), error;
      }
    },

    async stop() {
      isShuttingDown = true;
      try {
        if (connection) {
          await connection.sendRequest("shutdown", null);
          await connection.sendNotification("exit", null);
        }
      } catch (error) { ... }
      finally {
        if (connection) { connection.dispose(); connection = undefined; }
        if (process) { process.removeAllListeners(); process.kill(); process = undefined; }
        isInitialized = false;
        capabilities = undefined;
        isShuttingDown = false;
        logDebug(`LSP client stopped for ${serverName}`);
      }
    },

    get isInitialized() { return isInitialized },
    get capabilities() { return capabilities }
  };
}

// Mapping: Dy2→createLspClient, us→vscodeJsonrpc, CA→childProcess
// Mapping: Q→process, B→connection, G→capabilities, Z→isInitialized
```

**Key insight:** Uses `vscode-jsonrpc` library for LSP communication over stdio. The connection handles the JSON-RPC protocol, message framing, and error recovery.

---

## LSP Server Configuration Schema

```javascript
// ============================================
// lspServerConfigSchema - LSP Server Configuration Schema
// Location: chunks.90.mjs:1668-1687
// ============================================

// ORIGINAL (for source lookup):
YVA = m.strictObject({
  command: m.string().min(1).refine((A) => {
    if (A.includes(" ") && !A.startsWith("/")) return !1;
    return !0
  }, { message: "Command should not contain spaces. Use args array for arguments." })
    .describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
  args: m.array(d62).optional().describe("Command-line arguments to pass to the server"),
  extensionToLanguage: m.record(q75, d62).refine((A) => Object.keys(A).length > 0, {
    message: "extensionToLanguage must have at least one mapping"
  }).describe("Mapping from file extension to LSP language ID"),
  transport: m.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
  env: m.record(m.string(), m.string()).optional().describe("Environment variables"),
  initializationOptions: m.unknown().optional().describe("Initialization options for the server"),
  settings: m.unknown().optional().describe("Settings via workspace/didChangeConfiguration"),
  workspaceFolder: m.string().optional().describe("Workspace folder path"),
  startupTimeout: m.number().int().positive().optional().describe("Max startup wait time (ms)"),
  shutdownTimeout: m.number().int().positive().optional().describe("Max shutdown wait time (ms)"),
  restartOnCrash: m.boolean().optional().describe("Auto-restart on crash"),
  maxRestarts: m.number().int().nonnegative().optional().describe("Max restart attempts")
})

// READABLE (for understanding):
lspServerConfigSchema = zod.strictObject({
  command: zod.string().min(1).refine(cmd => {
    // Don't allow spaces in command (use args instead)
    if (cmd.includes(" ") && !cmd.startsWith("/")) return false;
    return true;
  }, { message: "Command should not contain spaces. Use args array for arguments." })
    .describe('Command to execute (e.g., "typescript-language-server")'),
  args: zod.array(zod.string()).optional()
    .describe("Command-line arguments"),
  extensionToLanguage: zod.record(extensionSchema, languageIdSchema)
    .refine(obj => Object.keys(obj).length > 0, { message: "Must have at least one mapping" })
    .describe("File extension → LSP language ID mapping"),
  transport: zod.enum(["stdio", "socket"]).default("stdio")
    .describe("Transport mechanism (only stdio implemented)"),
  env: zod.record(zod.string(), zod.string()).optional()
    .describe("Environment variables"),
  initializationOptions: zod.unknown().optional()
    .describe("LSP initialization options"),
  settings: zod.unknown().optional()
    .describe("Workspace settings"),
  workspaceFolder: zod.string().optional()
    .describe("Override workspace folder"),
  startupTimeout: zod.number().int().positive().optional()
    .describe("Startup timeout (NOT YET IMPLEMENTED)"),
  shutdownTimeout: zod.number().int().positive().optional()
    .describe("Shutdown timeout (NOT YET IMPLEMENTED)"),
  restartOnCrash: zod.boolean().optional()
    .describe("Auto-restart (NOT YET IMPLEMENTED)"),
  maxRestarts: zod.number().int().nonnegative().optional()
    .describe("Max restart attempts (default: 3)")
})

// Mapping: YVA→lspServerConfigSchema
```

**Key insight:** The `extensionToLanguage` field is the core routing mechanism - it maps file extensions (e.g., `.ts`, `.py`) to LSP language IDs (e.g., `typescript`, `python`). This determines which server handles which files.

---

## Plugin Integration

### Plugin Schema

```javascript
// ============================================
// lspPluginSchema - LSP Servers Plugin Schema
// Location: chunks.90.mjs:1688-1689
// ============================================

// ORIGINAL:
N75 = m.object({
  lspServers: m.union([
    ZVA.describe("Path to .lsp.json config file"),
    m.record(m.string(), YVA).describe("Inline configs by server name"),
    m.array(m.union([ZVA, m.record(m.string(), YVA)])).describe("Array of configs")
  ])
})

// READABLE:
lspPluginSchema = zod.object({
  lspServers: zod.union([
    pathSchema.describe("Path to .lsp.json config file relative to plugin root"),
    zod.record(zod.string(), lspServerConfigSchema).describe("Inline server configs keyed by name"),
    zod.array(zod.union([pathSchema, inlineConfigSchema])).describe("Array of paths or inline configs")
  ])
})

// Mapping: N75→lspPluginSchema
```

### Example Plugin Configuration

```json
{
  "name": "my-plugin",
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "extensionToLanguage": {
        ".ts": "typescript",
        ".tsx": "typescriptreact",
        ".js": "javascript",
        ".jsx": "javascriptreact"
      }
    },
    "python": {
      "command": "pylsp",
      "extensionToLanguage": {
        ".py": "python"
      },
      "initializationOptions": {
        "pylsp": {
          "plugins": {
            "pycodestyle": { "enabled": false }
          }
        }
      }
    }
  }
}
```

---

## Plugin LSP Server Loading

### Path Security Validation

```javascript
// ============================================
// validatePluginPath - Security check for path traversal
// Location: chunks.114.mjs:1971-1977
// ============================================

// ORIGINAL (for source lookup):
function Pg5(A, Q) {
  let B = S$0(A),
    G = S$0(A, Q),
    Z = Tg5(B, G);
  if (Z.startsWith("..") || S$0(Z) === Z) return null;
  return G
}

// READABLE (for understanding):
function validatePluginPath(pluginRoot, relativePath) {
  let normalizedRoot = path.normalize(pluginRoot);
  let fullPath = path.normalize(pluginRoot, relativePath);
  let relative = path.relative(normalizedRoot, fullPath);

  // Block path traversal attacks (e.g., "../../../etc/passwd")
  if (relative.startsWith("..") || path.normalize(relative) === relative) {
    return null;  // Blocked
  }
  return fullPath;  // Safe path
}

// Mapping: Pg5→validatePluginPath, A→pluginRoot, Q→relativePath, S$0→path.normalize, Tg5→path.relative
```

**Key insight:** This function prevents path traversal attacks where a malicious plugin could try to access files outside its directory (e.g., `../../etc/passwd`).

### Load from Plugin Default

```javascript
// ============================================
// loadLspServersFromPluginDefault - Load .lsp.json from plugin root
// Location: chunks.114.mjs:1979-2013
// ============================================

// ORIGINAL (for source lookup):
async function Sg5(A, Q = []) {
  let B = {},
    G = jg5(A.path, ".lsp.json");
  try {
    let Z = await Hy2(G, "utf-8"),
      Y = AQ(Z),
      J = m.record(m.string(), YVA).safeParse(Y);
    if (J.success) Object.assign(B, J.data);
    else {
      let X = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${J.error.message}`;
      e(Error(X)), Q.push({ type: "lsp-config-invalid", plugin: A.name, serverName: ".lsp.json", validationError: J.error.message, source: "plugin" })
    }
  } catch (Z) {
    if (Z.code !== "ENOENT") {
      let Y = Z instanceof Error ? `Failed to read/parse .lsp.json in plugin ${A.name}: ${Z.message}` : `...`;
      e(Z instanceof Error ? Z : Error(Y)), Q.push({ type: "lsp-config-invalid", ... })
    }
  }
  if (A.manifest.lspServers) {
    let Z = await xg5(A.manifest.lspServers, A.path, A.name, Q);
    if (Z) Object.assign(B, Z)
  }
  return Object.keys(B).length > 0 ? B : void 0
}

// READABLE (for understanding):
async function loadLspServersFromPluginDefault(plugin, errors = []) {
  let servers = {};
  let lspJsonPath = path.join(plugin.path, ".lsp.json");

  // Step 1: Try to load .lsp.json from plugin root
  try {
    let content = await readFile(lspJsonPath, "utf-8");
    let parsed = JSON.parse(content);
    let validation = zod.record(zod.string(), lspServerConfigSchema).safeParse(parsed);

    if (validation.success) {
      Object.assign(servers, validation.data);
    } else {
      let message = `LSP config validation failed for .lsp.json in plugin ${plugin.name}: ${validation.error.message}`;
      logError(Error(message));
      errors.push({ type: "lsp-config-invalid", plugin: plugin.name, serverName: ".lsp.json", validationError: validation.error.message, source: "plugin" });
    }
  } catch (error) {
    // ENOENT (file not found) is acceptable - .lsp.json is optional
    if (error.code !== "ENOENT") {
      let message = error instanceof Error
        ? `Failed to read/parse .lsp.json in plugin ${plugin.name}: ${error.message}`
        : `Failed to read/parse .lsp.json file in plugin ${plugin.name}`;
      logError(error instanceof Error ? error : Error(message));
      errors.push({ type: "lsp-config-invalid", plugin: plugin.name, serverName: ".lsp.json", validationError: `Failed to parse JSON: ${error.message}`, source: "plugin" });
    }
  }

  // Step 2: Also load from manifest.lspServers if present
  if (plugin.manifest.lspServers) {
    let manifestServers = await loadLspServersFromManifest(plugin.manifest.lspServers, plugin.path, plugin.name, errors);
    if (manifestServers) Object.assign(servers, manifestServers);
  }

  return Object.keys(servers).length > 0 ? servers : undefined;
}

// Mapping: Sg5→loadLspServersFromPluginDefault, A→plugin, Q→errors, jg5→path.join, Hy2→readFile, AQ→JSON.parse
// Mapping: YVA→lspServerConfigSchema, xg5→loadLspServersFromManifest
```

**How it works:**
1. First tries to load `.lsp.json` from plugin root (optional file)
2. Then loads from `manifest.lspServers` if present
3. Merges both sources into a single server configuration object
4. Collects all errors for reporting instead of failing fast

### Load from Manifest

```javascript
// ============================================
// loadLspServersFromManifest - Parse lspServers from plugin manifest
// Location: chunks.114.mjs:2016-2075
// ============================================

// ORIGINAL (for source lookup):
async function xg5(A, Q, B, G) {
  let Z = {},
    Y = Array.isArray(A) ? A : [A];
  for (let J of Y)
    if (typeof J === "string") {
      // Path to config file
      let X = Pg5(Q, J);
      if (!X) {
        let I = `Security: Path traversal attempt blocked in plugin ${B}: ${J}`;
        e(Error(I)), k(I, { level: "warn" }), G.push({ type: "lsp-config-invalid", plugin: B, serverName: J, validationError: "Invalid path: must be relative and within plugin directory", source: "plugin" });
        continue
      }
      // ... read and parse config file
    } else {
      // Inline config object
      for (let [X, I] of Object.entries(J)) {
        let D = YVA.safeParse(I);
        if (D.success) Z[X] = D.data;
        else { /* validation error */ }
      }
    }
  return Object.keys(Z).length > 0 ? Z : void 0
}

// READABLE (for understanding):
async function loadLspServersFromManifest(lspServers, pluginPath, pluginName, errors) {
  let servers = {};

  // Normalize to array format
  let items = Array.isArray(lspServers) ? lspServers : [lspServers];

  for (let item of items) {
    if (typeof item === "string") {
      // Item is a path to a config file (e.g., "servers/typescript.json")
      let safePath = validatePluginPath(pluginPath, item);

      if (!safePath) {
        // Path traversal attack detected!
        let message = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${item}`;
        logError(Error(message));
        logDebug(message, { level: "warn" });
        errors.push({
          type: "lsp-config-invalid",
          plugin: pluginName,
          serverName: item,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue;
      }

      // Read and parse the config file
      try {
        let content = await readFile(safePath, "utf-8");
        let parsed = JSON.parse(content);
        let validation = zod.record(zod.string(), lspServerConfigSchema).safeParse(parsed);
        if (validation.success) {
          Object.assign(servers, validation.data);
        } else {
          errors.push({ type: "lsp-config-invalid", ... });
        }
      } catch (error) { /* handle read/parse error */ }
    } else {
      // Item is an inline config object (e.g., { "typescript": { command: "...", ... } })
      for (let [serverName, config] of Object.entries(item)) {
        let validation = lspServerConfigSchema.safeParse(config);
        if (validation.success) {
          servers[serverName] = validation.data;
        } else {
          let message = `LSP config validation failed for inline server "${serverName}" in plugin ${pluginName}: ${validation.error.message}`;
          logError(Error(message));
          errors.push({ type: "lsp-config-invalid", plugin: pluginName, serverName, validationError: validation.error.message, source: "plugin" });
        }
      }
    }
  }

  return Object.keys(servers).length > 0 ? servers : undefined;
}

// Mapping: xg5→loadLspServersFromManifest, A→lspServers, Q→pluginPath, B→pluginName, G→errors
// Mapping: Pg5→validatePluginPath, YVA→lspServerConfigSchema
```

**Why this design:**
- **Flexible config formats**: Supports paths, inline objects, and arrays mixing both
- **Security-first**: Validates all file paths to prevent directory traversal
- **Error aggregation**: Collects all errors instead of failing on first error
- **Graceful degradation**: Skips invalid configs but continues loading valid ones

### Variable Expansion

```javascript
// ============================================
// expandLspServerConfig - Variable expansion in config
// Location: chunks.114.mjs:2082-2111
// ============================================

// ORIGINAL (for source lookup):
function vg5(A, Q, B) {
  let G = [],
    Z = (X) => {
      let I = yg5(X, Q),  // Replace ${CLAUDE_PLUGIN_ROOT}
        { expanded: D, missingVars: W } = BVA(I);  // Expand env vars
      return G.push(...W), D
    },
    Y = { ...A };
  if (Y.command) Y.command = Z(Y.command);
  if (Y.args) Y.args = Y.args.map((X) => Z(X));
  let J = { CLAUDE_PLUGIN_ROOT: Q, ...Y.env || {} };
  for (let [X, I] of Object.entries(J))
    if (X !== "CLAUDE_PLUGIN_ROOT") J[X] = Z(I);
  if (Y.env = J, Y.workspaceFolder) Y.workspaceFolder = Z(Y.workspaceFolder);
  if (G.length > 0) {
    let I = `Missing environment variables in plugin LSP config: ${[...new Set(G)].join(", ")}`;
    e(Error(I)), k(I, { level: "warn" })
  }
  return Y
}

// READABLE (for understanding):
function expandLspServerConfig(config, pluginRoot, pluginName) {
  let missingVars = [];

  function expand(value) {
    // Replace ${CLAUDE_PLUGIN_ROOT} with actual path
    let replaced = value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
    // Expand other environment variables
    let { expanded, missingVars: missing } = expandEnvVars(replaced);
    missingVars.push(...missing);
    return expanded;
  }

  let result = { ...config };

  // Expand command and args
  if (result.command) result.command = expand(result.command);
  if (result.args) result.args = result.args.map(arg => expand(arg));

  // Add CLAUDE_PLUGIN_ROOT to env and expand other env vars
  let env = { CLAUDE_PLUGIN_ROOT: pluginRoot, ...result.env || {} };
  for (let [key, value] of Object.entries(env)) {
    if (key !== "CLAUDE_PLUGIN_ROOT") {
      env[key] = expand(value);
    }
  }
  result.env = env;

  // Expand workspace folder
  if (result.workspaceFolder) {
    result.workspaceFolder = expand(result.workspaceFolder);
  }

  // Warn about missing variables
  if (missingVars.length > 0) {
    let message = `Missing environment variables in plugin LSP config: ${[...new Set(missingVars)].join(", ")}`;
    logError(Error(message));
    logDebug(message, { level: "warn" });
  }

  return result;
}

// Mapping: vg5→expandLspServerConfig, yg5→replacePluginRoot, BVA→expandEnvVars
```

**Key insight:** The `${CLAUDE_PLUGIN_ROOT}` placeholder allows plugins to reference files relative to their installation directory, making configs portable.

---

## Error Types

| Error Type | Description | Location |
|------------|-------------|----------|
| `lsp-config-invalid` | Plugin has invalid LSP server config | chunks.114.mjs |
| `lsp-server-start-failed` | Failed to start LSP server | chunks.114.mjs |
| `lsp-server-crashed` | LSP server crashed (with signal/exit code) | chunks.114.mjs |
| `lsp-request-timeout` | LSP request timed out | chunks.114.mjs |
| `lsp-request-failed` | LSP request failed | chunks.114.mjs |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

### Server Manager (Singleton)
- `initializeLspServerManager` (Py2) - Initialize manager singleton
- `getLspManager` (Rc) - Get manager instance
- `getLspManagerStatus` (f6A) - Get manager state
- `waitForLspManagerInit` (Ty2) - Wait for initialization

### Server Manager (Factory)
- `createLspServerManager` (Uy2) - Create server manager instance
- `getAllLspServers` ($y2) - Load all LSP server configs from plugins

### Server Manager Core Methods
- `ensureServerStarted` (J) - Start server on demand if stopped
- `sendRequest` (X) - Route LSP request to appropriate server
- `shutdown` (Z) - Graceful shutdown of all servers

### Server Instance
- `createLspServerInstance` (Vy2) - Create server instance wrapper
- `MAX_RETRIES` (P$0) - Max retry attempts for ContentModified
- `CONTENT_MODIFIED_ERROR_CODE` (Rg5) - LSP error code -32801
- `BASE_RETRY_DELAY` (_g5) - Base delay for exponential backoff

### Server Instance Methods
- `start` (X) - Start server and initialize LSP connection
- `stop` (I) - Graceful shutdown (shutdown + exit)
- `restart` (D) - Stop and restart with max retry limit
- `isHealthy` (W) - Health check (running + initialized)
- `sendRequest` (K) - Send LSP request with ContentModified retry
- `sendNotification` (V) - Send one-way LSP notification
- `onNotification` (F) - Register notification handler
- `onRequest` (H) - Register request handler

### Low-level Client
- `createLspClient` (Dy2) - Create low-level LSP client

### Configuration
- `lspServerConfigSchema` (YVA) - Server config schema
- `lspPluginSchema` (N75) - Plugin LSP servers schema
- `lspConfigPathSchema` (ZVA) - Config file path schema

### Plugin Loading
- `loadLspServersFromPluginDefault` (Sg5) - Load .lsp.json from plugin root
- `loadLspServersFromManifest` (xg5) - Parse lspServers from plugin manifest
- `validatePluginPath` (Pg5) - Security check for path traversal
- `expandLspServerConfig` (vg5) - Variable expansion in config
- `replacePluginRoot` (yg5) - Replace ${CLAUDE_PLUGIN_ROOT} placeholder

---

## See Also

- [lsp_tool.md](./lsp_tool.md) - Tool interface and result formatters
- [../25_plugin/](../25_plugin/) - Plugin system
- [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration symbols (LSP section)
