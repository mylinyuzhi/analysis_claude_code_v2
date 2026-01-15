# LSP Tool Integration (2.1.7)

> **NEW in 2.0.74** - Language Server Protocol for code intelligence features

---

## Overview

The LSP tool provides code intelligence features by interfacing with Language Server Protocol servers. It enables:
- Go to definition
- Find references
- Hover information (documentation, type info)
- Document symbols
- Workspace symbol search
- Go to implementation
- Call hierarchy analysis (incoming/outgoing calls)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LSP Tool (vU0)                           │
│  - validateInput() validates file exists                        │
│  - call() orchestrates LSP request                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Manager (Uy2)                       │
│  - Manages server lifecycle (start/stop/restart)                │
│  - Routes requests by file extension                            │
│  - Maintains file open state (textDocument/didOpen)             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Server Instance (Vy2)                      │
│  - Wraps individual LSP server process                          │
│  - Handles JSON-RPC communication via vscode-jsonrpc            │
│  - Manages retry logic on ContentModified errors                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LSP Client (Dy2)                               │
│  - Low-level process management                                 │
│  - StreamMessageReader/Writer for stdio communication           │
│  - Handles initialize/shutdown LSP lifecycle                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tool Definition

```javascript
// ============================================
// LSP Tool Definition
// Location: chunks.120.mjs:15-176
// ============================================

// ORIGINAL (key structure):
vU0 = {
  name: Sg2,                    // "LSP"
  maxResultSizeChars: 1e5,      // 100,000 chars max
  isLsp: !0,
  async description() { return xU0 },
  userFacingName: vg2,
  isEnabled() { ... },          // Check if any LSP server available
  inputSchema: Ol5,
  outputSchema: Ml5,
  isConcurrencySafe() { return !0 },
  isReadOnly() { return !0 },
  getPath({ filePath: A }) { return Y4(A) },
  async validateInput(A) { ... },
  async checkPermissions(A, Q) { ... },
  async prompt() { return xU0 },
  renderToolUseMessage: kg2,
  async call(A, Q) { ... },     // Main execution
  mapToolResultToToolResultBlockParam(A, Q) { ... }
}

// READABLE:
lspTool = {
  name: LSP_TOOL_NAME,          // "LSP"
  maxResultSizeChars: 100000,
  isLsp: true,
  async description() { return lspToolDescription },
  userFacingName: lspUserFacingName,
  isEnabled() {
    // Check manager state and server availability
    if (getLspManagerStatus().status === "failed") return false;
    const manager = getLspManager();
    if (!manager) return false;
    const servers = manager.getAllServers();
    if (servers.size === 0) return false;
    // At least one server must not be in error state
    return Array.from(servers.values()).some(s => s.state !== "error");
  },
  inputSchema: lspInputSchema,
  outputSchema: lspOutputSchema,
  isConcurrencySafe() { return true },
  isReadOnly() { return true },
  getPath({ filePath }) { return resolvePath(filePath) },
  async validateInput(input) { ... },
  async checkPermissions(input, context) { ... },
  async prompt() { return lspToolDescription },
  renderToolUseMessage: formatLspToolUse,
  async call(input, context) { ... },
  mapToolResultToToolResultBlockParam(result, toolUseId) { ... }
}

// Mapping: vU0→lspTool, Sg2→LSP_TOOL_NAME, xU0→lspToolDescription, Ol5→lspInputSchema, Ml5→lspOutputSchema
```

**Key insight:** The tool is read-only and concurrency-safe, meaning multiple LSP operations can run in parallel without side effects.

---

## Input/Output Schema

```javascript
// ============================================
// LSP Input Schema
// Location: chunks.120.mjs:15-19
// ============================================

// ORIGINAL:
Ol5 = m.strictObject({
  operation: m.enum([
    "goToDefinition", "findReferences", "hover", "documentSymbol",
    "workspaceSymbol", "goToImplementation", "prepareCallHierarchy",
    "incomingCalls", "outgoingCalls"
  ]).describe("The LSP operation to perform"),
  filePath: m.string().describe("The absolute or relative path to the file"),
  line: m.number().int().positive().describe("The line number (1-based, as shown in editors)"),
  character: m.number().int().positive().describe("The character offset (1-based, as shown in editors)")
})

// READABLE:
lspInputSchema = zod.strictObject({
  operation: zod.enum([...]),   // 9 supported operations
  filePath: zod.string(),       // File to operate on
  line: zod.number().int().positive(),      // 1-based line
  character: zod.number().int().positive()  // 1-based character
})

// Mapping: Ol5→lspInputSchema
```

```javascript
// ============================================
// LSP Output Schema
// Location: chunks.120.mjs:20-25
// ============================================

// ORIGINAL:
Ml5 = m.object({
  operation: m.enum([...]).describe("The LSP operation that was performed"),
  result: m.string().describe("The formatted result of the LSP operation"),
  filePath: m.string().describe("The file path the operation was performed on"),
  resultCount: m.number().int().nonnegative().optional().describe("Number of results"),
  fileCount: m.number().int().nonnegative().optional().describe("Number of files containing results")
})

// READABLE:
lspOutputSchema = zod.object({
  operation: zod.enum([...]),
  result: zod.string(),          // Formatted human-readable result
  filePath: zod.string(),
  resultCount: zod.number().optional(),
  fileCount: zod.number().optional()
})

// Mapping: Ml5→lspOutputSchema
```

---

## Main Tool Handler (call)

```javascript
// ============================================
// lspTool.call - Main LSP Operation Handler
// Location: chunks.120.mjs:99-167
// ============================================

// ORIGINAL (for source lookup):
async call(A, Q) {
  let B = Y4(A.filePath),
    G = o1();
  if (f6A().status === "pending") await Ty2();
  let Y = Rc();
  if (!Y) return e(Error("LSP server manager not initialized when tool was called")), {
    data: { operation: A.operation, result: "LSP server manager not initialized...", filePath: A.filePath }
  };
  let { method: J, params: X } = Rl5(A, B);
  try {
    if (!Y.isFileOpen(B)) {
      let F = await wl5(B, "utf-8");
      await Y.openFile(B, F)
    }
    let I = await Y.sendRequest(B, J, X);
    if (I === void 0) return k(`No LSP server available for file type ${yU0.extname(B)}...`), {
      data: { operation: A.operation, result: `No LSP server available for file type: ${yU0.extname(B)}`, filePath: A.filePath }
    };
    // Special handling for call hierarchy
    if (A.operation === "incomingCalls" || A.operation === "outgoingCalls") {
      let F = I;
      if (!F || F.length === 0) return { data: { ... resultCount: 0, fileCount: 0 } };
      let H = A.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
      I = await Y.sendRequest(B, H, { item: F[0] });
    }
    let { formatted: D, resultCount: W, fileCount: K } = jl5(A.operation, I, G);
    return { data: { operation: A.operation, result: D, filePath: A.filePath, resultCount: W, fileCount: K } }
  } catch (I) {
    let W = (I instanceof Error ? I : Error(String(I))).message;
    return e(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${W}`)), {
      data: { operation: A.operation, result: `Error performing ${A.operation}: ${W}`, filePath: A.filePath }
    }
  }
}

// READABLE (for understanding):
async call(input, context) {
  let resolvedPath = resolvePath(input.filePath);
  let workingDir = getCwd();

  // Wait for manager initialization if pending
  if (getLspManagerStatus().status === "pending") {
    await waitForLspManagerInit();
  }

  let manager = getLspManager();
  if (!manager) {
    logError(Error("LSP server manager not initialized when tool was called"));
    return { data: { operation: input.operation, result: "LSP server manager not initialized...", filePath: input.filePath } };
  }

  // Build LSP request from operation
  let { method, params } = buildLspRequest(input, resolvedPath);

  try {
    // Ensure file is opened in LSP server
    if (!manager.isFileOpen(resolvedPath)) {
      let content = await readFile(resolvedPath, "utf-8");
      await manager.openFile(resolvedPath, content);
    }

    let result = await manager.sendRequest(resolvedPath, method, params);

    if (result === undefined) {
      logDebug(`No LSP server available for file type ${path.extname(resolvedPath)}...`);
      return { data: { operation: input.operation, result: `No LSP server available for file type: ${path.extname(resolvedPath)}`, filePath: input.filePath } };
    }

    // Call hierarchy requires two requests: prepareCallHierarchy + incomingCalls/outgoingCalls
    if (input.operation === "incomingCalls" || input.operation === "outgoingCalls") {
      let callItems = result;
      if (!callItems || callItems.length === 0) {
        return { data: { ... resultCount: 0, fileCount: 0 } };
      }
      let callMethod = input.operation === "incomingCalls"
        ? "callHierarchy/incomingCalls"
        : "callHierarchy/outgoingCalls";
      result = await manager.sendRequest(resolvedPath, callMethod, { item: callItems[0] });
    }

    // Format result for display
    let { formatted, resultCount, fileCount } = formatLspResult(input.operation, result, workingDir);
    return { data: { operation: input.operation, result: formatted, filePath: input.filePath, resultCount, fileCount } };
  } catch (error) {
    let message = (error instanceof Error ? error : Error(String(error))).message;
    logError(Error(`LSP tool request failed for ${input.operation} on ${input.filePath}: ${message}`));
    return { data: { operation: input.operation, result: `Error performing ${input.operation}: ${message}`, filePath: input.filePath } };
  }
}

// Mapping: A→input, Q→context, B→resolvedPath, G→workingDir, Y→manager, J→method, X→params
// Mapping: Rl5→buildLspRequest, jl5→formatLspResult, Y4→resolvePath, o1→getCwd
// Mapping: f6A→getLspManagerStatus, Ty2→waitForLspManagerInit, Rc→getLspManager
```

**Key insight:** The call hierarchy operations (`incomingCalls`, `outgoingCalls`) require a two-step process:
1. First call `textDocument/prepareCallHierarchy` to get the call item at position
2. Then call `callHierarchy/incomingCalls` or `callHierarchy/outgoingCalls` with that item

---

## LSP Request Builder

```javascript
// ============================================
// Rl5 - Build LSP Request from Operation
// Location: chunks.119.mjs:3320-3407
// ============================================

// ORIGINAL (for source lookup):
function Rl5(A, Q) {
  let B = Ll5(Q).href,
    G = { line: A.line - 1, character: A.character - 1 };  // Convert to 0-based
  switch (A.operation) {
    case "goToDefinition":
      return { method: "textDocument/definition", params: { textDocument: { uri: B }, position: G } };
    case "findReferences":
      return { method: "textDocument/references", params: { textDocument: { uri: B }, position: G, context: { includeDeclaration: !0 } } };
    case "hover":
      return { method: "textDocument/hover", params: { textDocument: { uri: B }, position: G } };
    case "documentSymbol":
      return { method: "textDocument/documentSymbol", params: { textDocument: { uri: B } } };
    case "workspaceSymbol":
      return { method: "workspace/symbol", params: { query: "" } };
    case "goToImplementation":
      return { method: "textDocument/implementation", params: { textDocument: { uri: B }, position: G } };
    case "prepareCallHierarchy":
    case "incomingCalls":
    case "outgoingCalls":
      return { method: "textDocument/prepareCallHierarchy", params: { textDocument: { uri: B }, position: G } };
  }
}

// READABLE (for understanding):
function buildLspRequest(input, filePath) {
  let fileUri = pathToFileUri(filePath).href;
  let position = { line: input.line - 1, character: input.character - 1 };  // 1-based → 0-based

  switch (input.operation) {
    case "goToDefinition":
      return { method: "textDocument/definition", params: { textDocument: { uri: fileUri }, position } };
    case "findReferences":
      return { method: "textDocument/references", params: { textDocument: { uri: fileUri }, position, context: { includeDeclaration: true } } };
    case "hover":
      return { method: "textDocument/hover", params: { textDocument: { uri: fileUri }, position } };
    case "documentSymbol":
      return { method: "textDocument/documentSymbol", params: { textDocument: { uri: fileUri } } };
    case "workspaceSymbol":
      return { method: "workspace/symbol", params: { query: "" } };  // Empty query = all symbols
    case "goToImplementation":
      return { method: "textDocument/implementation", params: { textDocument: { uri: fileUri }, position } };
    case "prepareCallHierarchy":
    case "incomingCalls":
    case "outgoingCalls":
      // All start with prepareCallHierarchy (additional call made in handler)
      return { method: "textDocument/prepareCallHierarchy", params: { textDocument: { uri: fileUri }, position } };
  }
}

// Mapping: Rl5→buildLspRequest, Ll5→pathToFileUri, A→input, Q→filePath, B→fileUri, G→position
```

**Key insight:** Position conversion is critical - the tool accepts 1-based positions (as shown in editors) but LSP protocol uses 0-based positions internally.

---

## LSP Server Manager

```javascript
// ============================================
// Uy2 - Create LSP Server Manager
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
    let server = await getOrStartServer(filePath);
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
// Vy2 - Create LSP Server Instance
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
    if (!isReady()) {
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
    isReady,
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

## LSP Client (Low-level)

```javascript
// ============================================
// Dy2 - Create Low-level LSP Client
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

## Result Formatters

### Go to Definition

```javascript
// ============================================
// PU0 - Format Go To Definition Result
// Location: chunks.119.mjs:2878-2896
// ============================================

// ORIGINAL (for source lookup):
function PU0(A, Q) {
  if (!A) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  if (Array.isArray(A)) {
    let G = A.map((X) => qg2(X) ? Ug2(X) : X),
      Z = G.filter((X) => !X || !X.uri);
    if (Z.length > 0) k(`formatGoToDefinitionResult: Filtering out ${Z.length} invalid location(s)...`, { level: "warn" });
    let Y = G.filter((X) => X && X.uri);
    if (Y.length === 0) return "No definition found...";
    if (Y.length === 1) return `Defined in ${WK1(Y[0],Q)}`;
    let J = Y.map((X) => `  ${WK1(X,Q)}`).join(`\n`);
    return `Found ${Y.length} definitions:\n${J}`
  }
  let B = qg2(A) ? Ug2(A) : A;
  return `Defined in ${WK1(B,Q)}`
}

// READABLE (for understanding):
function formatGoToDefinitionResult(result, workingDir) {
  if (!result) {
    return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  }

  if (Array.isArray(result)) {
    // Normalize LocationLink to Location format
    let locations = result.map(item => isLocationLink(item) ? locationLinkToLocation(item) : item);
    let invalid = locations.filter(loc => !loc || !loc.uri);
    if (invalid.length > 0) {
      logDebug(`formatGoToDefinitionResult: Filtering out ${invalid.length} invalid location(s)...`, { level: "warn" });
    }
    let valid = locations.filter(loc => loc && loc.uri);

    if (valid.length === 0) return "No definition found...";
    if (valid.length === 1) return `Defined in ${formatLocation(valid[0], workingDir)}`;

    let formatted = valid.map(loc => `  ${formatLocation(loc, workingDir)}`).join("\n");
    return `Found ${valid.length} definitions:\n${formatted}`;
  }

  // Single location
  let location = isLocationLink(result) ? locationLinkToLocation(result) : result;
  return `Defined in ${formatLocation(location, workingDir)}`;
}

// Mapping: PU0→formatGoToDefinitionResult, qg2→isLocationLink, Ug2→locationLinkToLocation, WK1→formatLocation
```

### Find References

```javascript
// ============================================
// Lg2 - Format Find References Result
// Location: chunks.119.mjs:2898-2921
// ============================================

// ORIGINAL (for source lookup):
function Lg2(A, Q) {
  if (!A || A.length === 0) return "No references found...";
  let B = A.filter((J) => !J || !J.uri);
  if (B.length > 0) k(`formatFindReferencesResult: Filtering out ${B.length} invalid location(s)...`, { level: "warn" });
  let G = A.filter((J) => J && J.uri);
  if (G.length === 0) return "No references found...";
  if (G.length === 1) return `Found 1 reference:\n  ${WK1(G[0],Q)}`;
  let Z = wg2(G, Q),
    Y = [`Found ${G.length} references across ${Z.size} files:`];
  for (let [J, X] of Z) {
    Y.push(`\n${J}:`);
    for (let I of X) {
      let D = I.range.start.line + 1,
        W = I.range.start.character + 1;
      Y.push(`  Line ${D}:${W}`)
    }
  }
  return Y.join(`\n`)
}

// READABLE (for understanding):
function formatFindReferencesResult(locations, workingDir) {
  if (!locations || locations.length === 0) {
    return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  }

  let invalid = locations.filter(loc => !loc || !loc.uri);
  if (invalid.length > 0) {
    logDebug(`formatFindReferencesResult: Filtering out ${invalid.length} invalid location(s)...`, { level: "warn" });
  }
  let valid = locations.filter(loc => loc && loc.uri);

  if (valid.length === 0) return "No references found...";
  if (valid.length === 1) return `Found 1 reference:\n  ${formatLocation(valid[0], workingDir)}`;

  // Group by file
  let groupedByFile = groupLocationsByFile(valid, workingDir);
  let lines = [`Found ${valid.length} references across ${groupedByFile.size} files:`];

  for (let [filePath, fileLocations] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (let location of fileLocations) {
      let line = location.range.start.line + 1;
      let char = location.range.start.character + 1;
      lines.push(`  Line ${line}:${char}`);
    }
  }

  return lines.join("\n");
}

// Mapping: Lg2→formatFindReferencesResult, wg2→groupLocationsByFile
```

### Hover

```javascript
// ============================================
// Og2 - Format Hover Result
// Location: chunks.119.mjs:2935-2946
// ============================================

// ORIGINAL (for source lookup):
function Og2(A, Q) {
  if (!A) return "No hover information available...";
  let B = Ul5(A.contents);
  if (A.range) {
    let G = A.range.start.line + 1,
      Z = A.range.start.character + 1;
    return `Hover info at ${G}:${Z}:\n\n${B}`
  }
  return B
}

// READABLE (for understanding):
function formatHoverResult(hover, workingDir) {
  if (!hover) {
    return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
  }

  let content = extractHoverContent(hover.contents);

  if (hover.range) {
    let line = hover.range.start.line + 1;
    let char = hover.range.start.character + 1;
    return `Hover info at ${line}:${char}:\n\n${content}`;
  }

  return content;
}

// Mapping: Og2→formatHoverResult, Ul5→extractHoverContent
```

### Document Symbol

```javascript
// ============================================
// Rg2, Mg2 - Format Document Symbol Result
// Location: chunks.119.mjs:2979-3003
// ============================================

// ORIGINAL (for source lookup):
function Mg2(A, Q = 0) {     // flattenDocumentSymbol(symbol, depth)
  let B = [];
  B.push({
    name: A.name,
    kind: A.kind,
    range: A.range,
    depth: Q
  });
  if (A.children)
    for (let X of A.children) B.push(...Mg2(X, Q + 1));
  return B
}

function Rg2(A, Q) {         // formatDocumentSymbolResult(symbols, workingDir)
  if (!A || A.length === 0)
    return "No symbols found in this document.";
  let G = [],
    Z = [];
  for (let Y of A) Z.push(...Mg2(Y));
  for (let { name: Y, kind: J, range: X, depth: I } of Z) {
    let D = X.start.line + 1,
      W = rHA(J),            // symbolKindToName
      K = "  ".repeat(I);
    G.push(`${K}${W}: ${Y} (line ${D})`)
  }
  return G.join(`\n`)
}

// READABLE (for understanding):
function flattenDocumentSymbol(symbol, depth = 0) {
  let result = [];
  result.push({
    name: symbol.name,
    kind: symbol.kind,
    range: symbol.range,
    depth: depth
  });
  if (symbol.children) {
    for (let child of symbol.children) {
      result.push(...flattenDocumentSymbol(child, depth + 1));
    }
  }
  return result;
}

function formatDocumentSymbolResult(symbols, workingDir) {
  if (!symbols || symbols.length === 0) {
    return "No symbols found in this document.";
  }

  let lines = [];
  let flatSymbols = [];

  // Flatten hierarchical symbols
  for (let symbol of symbols) {
    flatSymbols.push(...flattenDocumentSymbol(symbol));
  }

  // Format each symbol with indentation based on depth
  for (let { name, kind, range, depth } of flatSymbols) {
    let line = range.start.line + 1;
    let kindName = symbolKindToName(kind);
    let indent = "  ".repeat(depth);
    lines.push(`${indent}${kindName}: ${name} (line ${line})`);
  }

  return lines.join("\n");
}

// Mapping: Rg2→formatDocumentSymbolResult, Mg2→flattenDocumentSymbol, rHA→symbolKindToName
```

**Key insight:** Document symbols can be hierarchical (e.g., methods inside classes). The formatter flattens the hierarchy and uses indentation to show nesting depth.

### Call Hierarchy

```javascript
// ============================================
// _g2, jg2, Tg2 - Format Call Hierarchy Results
// Location: chunks.119.mjs:3038-3115
// ============================================

// ORIGINAL (for source lookup):
function _g2(A, Q) {         // formatPrepareCallHierarchy(items, workingDir)
  if (!A || A.length === 0)
    return "No call hierarchy item found at this location.";
  let B = A[0],
    G = B.uri.replace("file://", ""),
    Z = Mc.relative(Q, G),
    Y = B.range.start.line + 1;
  return `Call hierarchy item: ${B.name} (${rHA(B.kind)}) at ${Z}:${Y}`
}

function jg2(A, Q) {         // formatIncomingCalls(calls, workingDir)
  if (!A || A.length === 0)
    return "No incoming calls found (no functions call this location).";
  let B = [`Found ${A.length} incoming call(s):`];
  for (let G of A) {
    let Z = G.from,
      Y = Z.uri.replace("file://", ""),
      J = Mc.relative(Q, Y),
      X = Z.range.start.line + 1,
      I = rHA(Z.kind);
    B.push(`  ${I}: ${Z.name} at ${J}:${X}`);
    if (G.fromRanges && G.fromRanges.length > 0) {
      for (let D of G.fromRanges) {
        let W = D.start.line + 1;
        B.push(`    - call at line ${W}`)
      }
    }
  }
  return B.join(`\n`)
}

function Tg2(A, Q) {         // formatOutgoingCalls(calls, workingDir)
  if (!A || A.length === 0)
    return "No outgoing calls found (this location doesn't call other functions).";
  let B = [`Found ${A.length} outgoing call(s):`];
  for (let G of A) {
    let Z = G.to,
      Y = Z.uri.replace("file://", ""),
      J = Mc.relative(Q, Y),
      X = Z.range.start.line + 1,
      I = rHA(Z.kind);
    B.push(`  ${I}: ${Z.name} at ${J}:${X}`);
    if (G.fromRanges && G.fromRanges.length > 0) {
      for (let D of G.fromRanges) {
        let W = D.start.line + 1;
        B.push(`    - call at line ${W}`)
      }
    }
  }
  return B.join(`\n`)
}

// READABLE (for understanding):
function formatPrepareCallHierarchy(items, workingDir) {
  if (!items || items.length === 0) {
    return "No call hierarchy item found at this location.";
  }
  let item = items[0];
  let filePath = item.uri.replace("file://", "");
  let relativePath = path.relative(workingDir, filePath);
  let line = item.range.start.line + 1;
  return `Call hierarchy item: ${item.name} (${symbolKindToName(item.kind)}) at ${relativePath}:${line}`;
}

function formatIncomingCalls(calls, workingDir) {
  if (!calls || calls.length === 0) {
    return "No incoming calls found (no functions call this location).";
  }

  let lines = [`Found ${calls.length} incoming call(s):`];
  for (let call of calls) {
    let caller = call.from;
    let filePath = caller.uri.replace("file://", "");
    let relativePath = path.relative(workingDir, filePath);
    let line = caller.range.start.line + 1;
    let kindName = symbolKindToName(caller.kind);
    lines.push(`  ${kindName}: ${caller.name} at ${relativePath}:${line}`);

    // Show specific call sites within the caller
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (let range of call.fromRanges) {
        let callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }
  return lines.join("\n");
}

function formatOutgoingCalls(calls, workingDir) {
  if (!calls || calls.length === 0) {
    return "No outgoing calls found (this location doesn't call other functions).";
  }

  let lines = [`Found ${calls.length} outgoing call(s):`];
  for (let call of calls) {
    let callee = call.to;
    let filePath = callee.uri.replace("file://", "");
    let relativePath = path.relative(workingDir, filePath);
    let line = callee.range.start.line + 1;
    let kindName = symbolKindToName(callee.kind);
    lines.push(`  ${kindName}: ${callee.name} at ${relativePath}:${line}`);

    // Show specific call sites (where the call is made)
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (let range of call.fromRanges) {
        let callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }
  return lines.join("\n");
}

// Mapping: _g2→formatPrepareCallHierarchy, jg2→formatIncomingCalls, Tg2→formatOutgoingCalls
// Mapping: A→items/calls, Q→workingDir, G→call, Z→item/caller/callee
```

**Key insight:** Call hierarchy provides bidirectional navigation:
- **Incoming calls**: "Who calls this function?" - useful for understanding impact of changes
- **Outgoing calls**: "What does this function call?" - useful for understanding dependencies

---

## Symbol Kind Mapping

```javascript
// ============================================
// rHA - Symbol Kind to Human-Readable Name
// Location: chunks.119.mjs:2948-2977
// ============================================

// ORIGINAL (for source lookup):
function rHA(A) {
  return {
    [1]: "File", [2]: "Module", [3]: "Namespace", [4]: "Package",
    [5]: "Class", [6]: "Method", [7]: "Property", [8]: "Field",
    [9]: "Constructor", [10]: "Enum", [11]: "Interface", [12]: "Function",
    [13]: "Variable", [14]: "Constant", [15]: "String", [16]: "Number",
    [17]: "Boolean", [18]: "Array", [19]: "Object", [20]: "Key",
    [21]: "Null", [22]: "EnumMember", [23]: "Struct", [24]: "Event",
    [25]: "Operator", [26]: "TypeParameter"
  }[A] || "Unknown"
}

// READABLE (for understanding):
function symbolKindToName(kind) {
  const kindMap = {
    1: "File", 2: "Module", 3: "Namespace", 4: "Package",
    5: "Class", 6: "Method", 7: "Property", 8: "Field",
    9: "Constructor", 10: "Enum", 11: "Interface", 12: "Function",
    13: "Variable", 14: "Constant", 15: "String", 16: "Number",
    17: "Boolean", 18: "Array", 19: "Object", 20: "Key",
    21: "Null", 22: "EnumMember", 23: "Struct", 24: "Event",
    25: "Operator", 26: "TypeParameter"
  };
  return kindMap[kind] || "Unknown";
}

// Mapping: rHA→symbolKindToName
```

---

## LSP Server Configuration Schema

```javascript
// ============================================
// YVA - LSP Server Configuration Schema
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

```javascript
// ============================================
// N75 - LSP Servers Plugin Schema
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

## Symbol Extraction for UI

```javascript
// ============================================
// xg2 - Extract Symbol at Position for Display
// Location: chunks.119.mjs:3143-3172
// ============================================

// ORIGINAL (for source lookup):
function xg2(A, Q, B) {
  try {
    let G = vA(),
      Z = Y4(A);
    if (!G.existsSync(Z)) return null;
    let J = G.readFileSync(Z, { encoding: "utf-8" }).split(`\n`);
    if (Q < 0 || Q >= J.length) return null;
    let X = J[Q];
    if (!X || B < 0 || B >= X.length) return null;
    let I = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
      D;
    while ((D = I.exec(X)) !== null) {
      let W = D.index,
        K = W + D[0].length;
      if (B >= W && B < K) {
        let V = D[0];
        return V.length > 30 ? V.slice(0, 27) + "..." : V
      }
    }
    return null
  } catch (G) {
    if (G instanceof Error) k(`Symbol extraction failed for ${A}:${Q}:${B}: ${G.message}`, { level: "warn" });
    return null
  }
}

// READABLE (for understanding):
function extractSymbolAtPosition(filePath, line, character) {
  try {
    let fs = getFs();
    let resolvedPath = resolvePath(filePath);

    if (!fs.existsSync(resolvedPath)) return null;

    let lines = fs.readFileSync(resolvedPath, { encoding: "utf-8" }).split("\n");

    if (line < 0 || line >= lines.length) return null;

    let lineContent = lines[line];
    if (!lineContent || character < 0 || character >= lineContent.length) return null;

    // Match identifiers OR operators
    let symbolRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;
    let match;

    while ((match = symbolRegex.exec(lineContent)) !== null) {
      let startIndex = match.index;
      let endIndex = startIndex + match[0].length;

      if (character >= startIndex && character < endIndex) {
        let symbol = match[0];
        // Truncate long symbols to 30 chars
        return symbol.length > 30 ? symbol.slice(0, 27) + "..." : symbol;
      }
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      logDebug(`Symbol extraction failed for ${filePath}:${line}:${character}: ${error.message}`, { level: "warn" });
    }
    return null;
  }
}

// Mapping: xg2→extractSymbolAtPosition, vA→getFs, Y4→resolvePath
```

**Why this approach:**
- Extracts the symbol name at cursor position for displaying in the UI
- Uses regex to match both identifiers (`\w$'!`) and operators (`+-*/%&|^~<>=`)
- Truncates symbols > 30 chars to prevent UI overflow
- Independent of LSP - works even when LSP server is unavailable

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

## Error Types

| Error Type | Description | Location |
|------------|-------------|----------|
| `lsp-config-invalid` | Plugin has invalid LSP server config | chunks.114.mjs |
| `lsp-server-start-failed` | Failed to start LSP server | chunks.114.mjs |
| `lsp-server-crashed` | LSP server crashed (with signal/exit code) | chunks.114.mjs |
| `lsp-request-timeout` | LSP request timed out | chunks.114.mjs |
| `lsp-request-failed` | LSP request failed | chunks.114.mjs |

---

## Supported Operations Summary

| Operation | LSP Method | Returns |
|-----------|------------|---------|
| `goToDefinition` | `textDocument/definition` | Definition location(s) |
| `findReferences` | `textDocument/references` | Reference locations |
| `hover` | `textDocument/hover` | Documentation, type info |
| `documentSymbol` | `textDocument/documentSymbol` | Symbols in file |
| `workspaceSymbol` | `workspace/symbol` | Symbols across workspace |
| `goToImplementation` | `textDocument/implementation` | Implementation locations |
| `prepareCallHierarchy` | `textDocument/prepareCallHierarchy` | Call hierarchy item |
| `incomingCalls` | `textDocument/prepareCallHierarchy` + `callHierarchy/incomingCalls` | Callers |
| `outgoingCalls` | `textDocument/prepareCallHierarchy` + `callHierarchy/outgoingCalls` | Callees |

---

## Related Symbols

> Symbol mappings: [symbol_index_infra.md](../00_overview/symbol_index_infra.md)

### Tool Definition
- `lspTool` (vU0) - Main LSP tool definition
- `LSP_TOOL_NAME` (Sg2) - Tool name constant "LSP"
- `lspToolDescription` (xU0) - Tool prompt description
- `lspInputSchema` (Ol5) - Zod input schema
- `lspOutputSchema` (Ml5) - Zod output schema

### Request Processing
- `buildLspRequest` (Rl5) - Build LSP request from operation
- `formatLspResult` (jl5) - Format LSP result for display
- `pathToFileUri` (Ll5) - Convert path to file:// URI
- `readFile` (wl5) - Read file contents

### Result Formatters
- `formatGoToDefinitionResult` (PU0) - Format definition result
- `formatFindReferencesResult` (Lg2) - Format references result
- `formatHoverResult` (Og2) - Format hover result
- `formatDocumentSymbolResult` (Rg2) - Format document symbols
- `flattenDocumentSymbol` (Mg2) - Flatten symbol hierarchy
- `formatPrepareCallHierarchy` (_g2) - Format call hierarchy item
- `formatIncomingCalls` (jg2) - Format incoming callers
- `formatOutgoingCalls` (Tg2) - Format outgoing callees
- `symbolKindToName` (rHA) - Symbol kind to readable name

### Location Helpers
- `formatLocation` (WK1) - Format location as file:line:col
- `groupLocationsByFile` (wg2) - Group locations by file path
- `isLocationLink` (qg2) - Check if LocationLink type
- `locationLinkToLocation` (Ug2) - Convert LocationLink to Location
- `extractHoverContent` (Ul5) - Extract content from hover result

### Server Manager (Singleton)
- `initializeLspServerManager` (Py2) - Initialize manager singleton
- `getLspManager` (Rc) - Get manager instance
- `getLspManagerStatus` (f6A) - Get manager state
- `waitForLspManagerInit` (Ty2) - Wait for initialization

### Server Manager (Factory)
- `createLspServerManager` (Uy2) - Create server manager instance
- `getAllLspServers` ($y2) - Load all LSP server configs from plugins

### Server Instance
- `createLspServerInstance` (Vy2) - Create server instance wrapper
- `MAX_RETRIES` (P$0) - Max retry attempts for ContentModified
- `CONTENT_MODIFIED_ERROR_CODE` (Rg5) - LSP error code -32801
- `BASE_RETRY_DELAY` (_g5) - Base delay for exponential backoff

### Low-level Client
- `createLspClient` (Dy2) - Create low-level LSP client

### UI Rendering
- `extractSymbolAtPosition` (xg2) - Extract symbol for UI display
- `formatLspToolUse` (kg2) - Format tool use message
- `lspUserFacingName` (vg2) - Tool display name
- `renderLspToolRejected` (bg2) - Render rejected message
- `renderLspToolError` (fg2) - Render error message
- `renderLspToolProgress` (hg2) - Render progress message
- `renderLspToolResult` (gg2) - Render result message

### Configuration
- `lspServerConfigSchema` (YVA) - Server config schema
- `lspPluginSchema` (N75) - Plugin LSP servers schema
- `lspConfigPathSchema` (ZVA) - Config file path schema

---

## See Also

- [../25_plugin/](../25_plugin/) - Plugin system (LSP server configuration)
- [../00_overview/symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Complete symbol index
